import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Inject } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManagerService } from '../../storage/sessionMangaer'
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { LocalStoreService } from '../../../shared/services/local-store.service';
import { CreateAssetClassDialogComponent } from './assetclass_add_edit_dialog/createassetclass-dialog.component';
import { UploadAssetClassPopUpComponent } from './assetclass_upload_dialog/upload_assetclass_popup.component';
import * as headers from '../../../../assets/Headers.json';
import * as resource from '../../../../assets/Resource.json';
import { ToastrService } from 'ngx-toastr';
import { UploadService } from 'app/components/services/UploadService';
import { HttpClient } from '@angular/common/http';
import { AssetClassService } from '../../services/AssetClassService';
import { Constants } from 'app/components/storage/constants';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/UserService';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import * as menuheaders from '../../../../assets/MenuHeaders.json';
import { AllPathService } from 'app/components/services/AllPathServices';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-asset_class',
  templateUrl: './asset_class.component.html',
  styleUrls: ['./asset_class.component.scss']
})
export class AssetClassComponent implements OnInit, AfterViewInit {
  message: any = (resource as any).default;
  Headers: any ;

  @ViewChild('AssetClasspaginator', { static: true }) AssetClasspaginator: MatPaginator;
  @ViewChild('AssetClass_sort', { static: false }) AssetClass_sort: MatSort;
  @ViewChild('AssetClass_table', { static: false }) AssetClass_table: any;

  private isButtonVisible = false;
  setflag: boolean=false;
  public SelectedAssetmaster: any;
  value: any;
  updateData: any;
  updateDataInsert: any;
  deleteOptions: { option: any; id: any; };
  json: any;
  show: boolean = false;
  public hideth;
  public AssetClass_data;
  public dataLength;
  AssetClass_datasource: any;
  displayedHeadersAssetClass: any[] = [];
  // displayedColumnsAssetClass: string[] = ['BlockName', 'Acronym', 'ITAMAssetClass', 'NFARBlock', 'Actions'];
  displayedColumnsAssetClass: string[] = ['BlockName', 'Acronym', 'Actions'];
  public cpuClass;

  GroupIdSession: any;
  RegionIdSession: any;
  CompanyIdSession: any;
  UserIdSession: any;
  menuheader: any = (menuheaders as any).default
  constructor(
    // private cs: CommonService,
    public dialog: MatDialog,
    private storage: ManagerService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    public toastr: ToastrService,
    public localService: LocalStoreService,
    public uploadService: UploadService,
    private assetClassService: AssetClassService,
    private router: Router,
    public alertService: MessageAlertService,
    public us: UserService,
    public AllPathService: AllPathService,
    private jwtAuth : JwtAuthService
  ) 
  {
    this.Headers = this.jwtAuth.getHeaders()
    this.displayedHeadersAssetClass = [this.Headers.AssetClass, this.Headers.ShortName, this.Headers.ITAssetClass, this.Headers.NFARBlock, this.Headers.Actions];
   }

  ngOnInit() {
    this.hideth = true;
    this.GroupIdSession = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID),
      this.RegionIdSession = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID),
      this.CompanyIdSession = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID),
      this.UserIdSession = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID),

      this.GetInitiatedData();
    this.GetAllAssetClass();
  }
  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  GetInitiatedData() {
    let url5 = this.us.PermissionRightsByUserIdAndPageId(this.GroupIdSession, this.UserIdSession, this.CompanyIdSession, this.RegionIdSession, "5");
    forkJoin([url5]).subscribe(results => {
      if (!!results[0]) {
         
        this.ListOfPagePermission = JSON.parse(results[0]);
        console.log("PagePermission", this.ListOfPagePermission)
        if (this.ListOfPagePermission.length > 0) {
          for (var i = 0; i < this.ListOfPagePermission.length; i++) {
            this.PermissionIdList.push(this.ListOfPagePermission[i].ModulePermissionId);
          }
        }
        else {
          this.alertService.alert({ message: this.message.NotAuthorisedToAccess, title: this.message.AssetrakSays })
            .subscribe(res => {
              this.router.navigateByUrl('h/a')
            })
        }
      }

    })
  }

  // Get all asset class by company id.
  GetAllAssetClass() {
     
    this.assetClassService.AssetClassGetAll(this.CompanyIdSession).subscribe(data => {
      this.AssetClass_data = data as any[];
      this.onChangeDataSource(this.AssetClass_data);
    });
  }

  // open Add or Edit dialog
  addEditAssetClass(...getValue): void {
    const dialogconfigcom1 = new MatDialogConfig();
  //  dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = "50%";
    dialogconfigcom1.data = {
      component1: 'assetClassComponent',
      value: getValue[0],
      payload: getValue[1]
    };
     
    const modalService = this.dialog.open(CreateAssetClassDialogComponent, dialogconfigcom1);

     
    modalService.afterClosed().subscribe((res) => {
       

      if (res && getValue[0] === 'edit') {
         
        this.updateData = res;
        this.updateData["Id"] = getValue[1].Id;
        this.updateData["GroupId"] = getValue[1].GroupId;
        this.EditAssetClass(this.updateData)
      }
      else if (res && getValue[0] === 'insert') {
         
        this.updateDataInsert = res;
        this.loader.open;
        this.AddAssetClass(this.updateDataInsert)
        this.loader.close();
      }
    });
  }

  // edit asset class
  EditAssetClass(result: any) {
     
    var assetClassData = {
      UpdateBlockAcronym: {
        Id: result.Id,
        Acronym: result.Acronym,
        BlockName: result.BlockName,
        CompanyId: this.CompanyIdSession,
        GroupId: this.GroupIdSession
      }
    }

    this.assetClassService.AssetClassUpdate(assetClassData).subscribe(r => {
       
      if (r == "BlockExistsAcronymsuccess") {
        this.toastr.success(this.message.BlockNameExistsShortNameUpdate, this.message.AssetrakSays);
      }
      if (r == "BlockExistsAcronymExists") {
        this.toastr.success(this.message.BlockNameExistsShortNameExists, this.message.AssetrakSays);
      }
      if (r == "BlocksuccessAcronymsuccess") {
        this.toastr.success(this.message.BlockNameUpdateShortNameUpdate, this.message.AssetrakSays);
      }
      if (r == "BlocksuccessAcronymExists") {
        this.toastr.success(this.message.BlockNameUpdateShortNameExists, this.message.AssetrakSays);
      }
      this.GetAllAssetClass();
    })
  }

  // add asset class
  AddAssetClass(result: any) {
     

    var assetClassDTO = {
      objectListDetails: [{
        Acronym: result.Acronym,
        AssetCount: 0,
        BlockName: result.BlockName,
        BlockOwner: null,
        CompanyId: this.CompanyIdSession,
        GroupId: this.GroupIdSession,
        Id: 0,
        ITBlock: false,
        Location: null,
        MobileUser: null,
        Task: null,
        User: null,
        UserId: this.UserIdSession
      }]
    }

    this.assetClassService.AssetClassInsert(assetClassDTO).subscribe(r => {
       
      if (r.length == 0) {
        this.toastr.success(this.message.SucessBlock, this.message.AssetrackSays);
      }
      else if (r.length > 0) {
        this.toastr.warning(this.message.AssetClassExists, this.message.AssetrackSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrackSays);
      }
      this.GetAllAssetClass();
    })
  }

  // open confirmation dialog and delete asset class
  deleteAssetClass(...vars) {
     
    this.deleteOptions = {
      option: vars[0],
      id: vars[1]
    }
    var compId = this.CompanyIdSession;
    var bId = this.deleteOptions.id.Id;
    this.assetClassService.CheckAssetCountForBlock(compId, bId).subscribe(r => {
       
      if (r == 0) {
        this.confirmService.confirm({ message: `Are you sure want to delete the asset Class ?`, title: this.message.AssetrakSays })
          .subscribe(res => {
            if (res) {              
              this.RemoveAssetClass(this.deleteOptions);              
            }
          })
      }
      else {
        var msg = this.message.AssetClassDeletefail;
        msg = msg.replace('xxxx', vars[1].BlockName); 
        this.toastr.warning(msg, this.message.AssetrackSays);
        this.GetAllAssetClass();
      }

    })
  }


  // delete asset class
  RemoveAssetClass(result: any) {
     
    var assetClassData = {
      Id: result.id.Id
    }
    this.assetClassService.AssetClassDelete(assetClassData).subscribe(r => {
      debugger;
      var msg = this.message.AssetClassDelete;
      msg = msg.replace('xxxx', result.id.BlockName); 
      this.toastr.success(msg , this.message.AssetrakSays);
      this.GetAllAssetClass();
    })
  }

  // opens upload dialog and uploads asset class xls file
  openUploadAssetClass(): void {
     
    const dialogconfigcom1 = new MatDialogConfig();
  //  dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = "50%";
    const modalService = this.dialog.open(UploadAssetClassPopUpComponent, dialogconfigcom1);
    modalService.afterClosed().subscribe((res) => {
      if (res) {
        var uploadedFileInfo = {
          FileName: res,
          GroupId: this.GroupIdSession,
          UserId: this.UserIdSession,
          CompanyId: this.CompanyIdSession
        }
        this.assetClassService.AssetClassUpload(uploadedFileInfo).subscribe(r => {
           
          if (r == "") {
            this.toastr.warning(this.message.ProvideDetails, this.message.AssetrakSays);
          }
          else if (r == "Incorrect File template") {
            this.toastr.warning("Incorrect File template", this.message.AssetrakSays);
          }
          else if (r != "") {
            this.toastr.success(r, this.message.AssetrakSays);
          }
          this.GetAllAssetClass();
        })
      }
    });
  }

  // updates ITblock checkbox data
  updateITBlock(element) {
     
    var itblock;
    if (element.ITBlock) {
      itblock = 0;
    } else {
      itblock = 1;
    }

    this.assetClassService.ITBlockUpdate(element.Id, itblock).subscribe(r => {
       
      this.GetAllAssetClass();
    })
  }

  // updates NFARBlock checkbox data
  updateNFARBlock(element) {
     
    var NFARBlock;
    if (element.NFARBlock) {
      NFARBlock = 0;
    } else {
      NFARBlock = 1;
    }
    this.assetClassService.NFARBlockUpdate(element.Id, NFARBlock).subscribe(r => {
       
      this.GetAllAssetClass();
    })
  }

  // refreshes mat table data
  onChangeDataSource(data) {
    this.AssetClass_datasource = new MatTableDataSource(data);
    console.log(this.AssetClass_data);
    this.AssetClass_datasource.paginator = this.AssetClasspaginator;
    this.AssetClass_datasource.sort = this.AssetClass_sort;
  }


  ngAfterViewInit() {
    // this.CPUClass_datasource.paginator = this.CPUClasspaginator;
    // this.OperatingSystem_datasource.paginator = this.operatingSystempaginator;
    // this.CPUSubClass_datasource.paginator = this.CPUSubClasspaginator;
    // this.ApplicationType_datasource.paginator = this.ApplicationTypepaginator;
    // this.Model_datasource.paginator = this.Modelpaginator;
    // this.Manufacturer_datasource.paginator = this.Manufacturerpaginator;
    // this.Vendor_datasource.paginator = this.Vendorpaginator;
  }

  //AllFilter
  applyFilterCPUClass(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.AssetClass_datasource.filter = filterValue.trim().toLowerCase();
  }

  /*exportAsXLSX() {
    console.log("this native elemnt", this.operatingSystem_table)
    this.show = true;
    this.exportToExcelFromTable(this.operatingSystem_table._elementRef, "sbu");
    this.show = false
  }*/

  exportToExcelFromTable(exltable, filename) {
     
    /*const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(exltable.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, filename + '_' + moment(Date.now()).format('YYYY_MM_DD') + '.csv');*/

  }

  // export asset class file
  exportAssetClassFile() {
     
    let isExport = true;
    this.assetClassService.AssetClassExport(this.CompanyIdSession, isExport).subscribe(r => {
       
      if (!!r) {
        this.AllPathService.DownloadExportFile(r);
        console.log("URL", URL);
      }
    })
  }

  downLoadFile(data: any, type: string) {
     
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert('Please disable your Pop-up blocker and try again.');
    }
  }

  ClearSerch(columnName, isflag) {
    debugger;
    this.isButtonVisible = !isflag;
    this.GetAllAssetClass();
  }
}
