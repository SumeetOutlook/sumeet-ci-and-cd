import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
// import { MatPaginator } from '@angular/material/paginator';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { UploadAssetRegisterComponent } from './UploadAssetRegister_popup/UploadAssetRegister.component';
import { AssetService } from 'app/components/services/AssetService';
import { AllPathService } from 'app/components/services/AllPathServices';
// import * as headers from '../../../../assets/Headers.json';
// import * as resource from '../../../../assets/Resource.json';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { MapColumnsPopupComponent } from './mapcolumns_popup/mapcolumns_popup.component';
import { UploadService } from 'app/components/services/UploadService';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { ReconciliationService } from 'app/components/services/ReconciliationService';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/UserService';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import * as menuheaders from '../../../../assets/MenuHeaders.json';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create_assets',
  templateUrl: './create_assets.component.html',
  styleUrls: ['./create_assets.component.scss'],
})
export class CreateAssetsComponent implements OnInit {

  header: any ;
  message: any ;
  order: string;
  public dialogForm: FormGroup;

  SelectUploadedBy: any[] = []

  IsCompanyAdmin: any = 1;
  FileNameWithPath: any;
  LocationId: any;
  menuheader :any =(menuheaders as any).default
  GroupId: any;
  RegionId: any;
  UserId: any;
  CompanyId: any;
  paginationParams: any;

  displayedHeaders = [];
  displayedColumns: string[] = ['SrNo', 'FileName', 'UploadedOn', 'UploadedBy', 'TotalAssets', 'TotalImportedAssets','Status', 'DownloadFile'];
  //datasource = new MatTableDataSource(this.mandatory);
  datasource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, private fb: FormBuilder,
    public assetService: AssetService,
    public uploadService: UploadService,
    public confirmService: AppConfirmService,
    private loader: AppLoaderService, public allPathService: AllPathService,
    private storage: ManagerService,
    public reconciliationService: ReconciliationService,
    private router: Router,
    public alertService: MessageAlertService,
    public us: UserService,
    public toastr: ToastrService,
    private jwtAuth: JwtAuthService,) { 
      this.header = this.jwtAuth.getHeaders();
      this.message = this.jwtAuth.getResources();
      this.SelectUploadedBy = [
        { value: 'GRN No', viewValue: this.header.GRNNo },
      //  { value: 'InventoryNumber', viewValue: this.header.InventoryNumber },
        {value: 'NFAR', viewValue: this.header.AssetNonFAR },
      ]
      this.displayedHeaders = [this.header.srno, this.header.FileName, this.header.UploadOn, this.header.UploadedBy, this.header.TotalAssetInFile, this.header.TotalImportedAseets,this.header.Status, this.header.DownloadLink]
    }
    assetuploadid:any;
  ngOnInit(): void {
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);

    this.GetInitiatedData();
    this.buildItemForm();

    this.paginationParams = {
      pageSize: 50,
      currentPageIndex: 0,
      endIndex: 0,
      startIndex: 0,
      totalCount: 0,
    }
    this.getDataForGrid1();
  }

  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  GetInitiatedData() {
    let url5 = this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.RegionId, "18,19,20");
    let url7 = this.us.CheckFreezePeriodStatus(this.GroupId, this.RegionId, this.CompanyId);
    forkJoin([url5 , url7]).subscribe(results => {
      if (!!results[0]) {          
        this.ListOfPagePermission = JSON.parse(results[0]);
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
      if (!!results[1]) {
        debugger;
        var FreezePeriod = results[1];
        if (!!FreezePeriod) {
          this.alertService.alert({ message: this.message.NotAuthorisedToAccessONFreezePeriod, title: this.message.AssetrakSays })
          .subscribe(res => {
            this.router.navigateByUrl('h/a')
          })
        }
      }

    })
  }

  buildItemForm() {
    this.dialogForm = this.fb.group({
      uploadBy: [''],
    })
  }


  uploadNameBy: any;
  openCreate_Asset() {
      
    this.uploadNameBy = this.dialogForm.controls['uploadBy'].value;
    localStorage.setItem("uploadNameBy", this.uploadNameBy );  
    //this.router.navigate(['create_assets/create_assets_popup', this.uploadNameBy]);
    this.router.navigateByUrl('h1/aa');
  }

  openUpload_AssetRegister() {
    let dialogRef: MatDialogRef<any> = this.dialog.open(UploadAssetRegisterComponent, {
      maxHeight: '90vh',
      width: '700px',
      disableClose: true,
      data: {
        UploadTypeFlag :this.assetuploadid,
        uploadBy: this.dialogForm.value.uploadBy,
      },
    })
    dialogRef.afterClosed().subscribe(result => {
        
      if (!!result) {
        this.FileNameWithPath = result[1];
        if(result[0]=="[]")
        {
          this.toastr.error(this.message.SpredsheetBlank, this.message.AssetrakSays);
        }
        else{
        this.open_MapColumns_Popup(result)
        }
      }
    })
  }

  open_MapColumns_Popup(res) {
    var data = {
      columnsName: res[0],
      UploadTypeFlag :this.assetuploadid,
      uploadBy: this.dialogForm.value.uploadBy,
      CompanyId: this.CompanyId,
      LocationId: 0,
      GroupId: this.GroupId,
      UserId: this.UserId
    }
    let dialogRef: MatDialogRef<any> = this.dialog.open(MapColumnsPopupComponent, {
      width: 'auto',
      maxHeight: '90vh',
      minHeight: '30vh',
      disableClose: true,
      data: {
        component1: 'MapColumnsPopupComponent',
        data: data,
      },
    })
    dialogRef.afterClosed().subscribe(result => {
        
      if (!!result) {
        this.CheckGrnNumberDuplicate(result);
      }
    })
  }
  CheckGrnNumberDuplicate(result) {
    var path = this.FileNameWithPath.split('uploads\\');
    var excelDetails =
    {
      FileName: path[1],
      PageName: this.pagename,
      CompanyId: this.CompanyId,
      RegionId: this.RegionId,
      GroupId: this.GroupId,
      CreatedBy: this.UserId,
      UserId: this.UserId,
      IsActive: true,
      AssetList: JSON.stringify(result),
      UploadType: this.Uploadtype,
      uploadBy: this.dialogForm.value.uploadBy
    }
    this.uploadService.CheckGrnNumberDuplicate(excelDetails).subscribe(res => {
      if (res === "Duplicate GRN Number and Supplier") {
        this.confirmService.confirm({ message: this.message.DuplicateGRNWarningForSingleCreate, title: this.message.AssetrakSays })
          .subscribe(res => {
            if (!!res) {
              this.SaveUpdateMapping(result);
            } else {
              // this.AssetInfo.get("GRNNo").setValue("");
              // this.AssetInfo.get("Suplier").setValue("");
            }
          })
      }
      else{
        this.SaveUpdateMapping(result);
      }
    })
  }
  SaveUpdateMapping(result) {
      
    this.loader.open();
    var path = this.FileNameWithPath.split('uploads\\');
    var excelDetails =
    {
      FileName: path[1],
      PageName: this.pagename,
      CompanyId: this.CompanyId,
      RegionId: this.RegionId,
      GroupId: this.GroupId,
      CreatedBy: this.UserId,
      UserId: this.UserId,
      IsActive: true,
      AssetList: JSON.stringify(result),
      UploadType: this.Uploadtype,
      uploadBy: this.dialogForm.value.uploadBy
    }
    var listofdto= [];
    listofdto.push(excelDetails);
    this.uploadService.AddBulkFarDataWithMultipalExcelUploadGRNJson(listofdto).subscribe(result => {
        
      this.loader.close();
      var msg = "";
      if (result == "All the Assets Updated Successfully.") {
        msg = this.message.AssetUploadSucess;
      }
      else if (result == "All the assets in the file are already available. None of the assets are updated.") {
        msg = this.message.AllAssetAvailable;
      }
      else if (result == "Not allow to upload or update this file of assets.") {
        msg = this.message.NotAllowtoUploadFile;
      }
      else if (result == "There is no data available in spreadsheet.Please check and try again.") {
        msg = this.message.SpredsheetBlank;
      }
      else {
        msg = result;
      }
      this.alertService.alert({title: this.message.AssetrakSays, message: msg})
      // this.confirmService.confirm({ message: msg, title: this.message.AssetrakSays })
      //   .subscribe(res => {
      //     if (res) {
      //       this.loader.open();
      //       this.loader.close();
      //     }
      //   })
        this.getDataForGrid();
    })
  }

  handlePage(pageEvent: PageEvent) {
      
    this.paginationParams.pageSize = pageEvent.pageSize;
    this.paginationParams.currentPageIndex = pageEvent.pageIndex;
    this.paginationParams.endIndex = (this.paginationParams.currentPageIndex + 1) * pageEvent.pageSize;
    this.paginationParams.startIndex = this.paginationParams.currentPageIndex * pageEvent.pageSize;
    this.getDataForGrid();
  }

  getDataForGrid1()
  {
      
    // this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;  
    this.getDataForGrid();
  }

  DataForGrid: any[] = [];
  getDataForGrid() {
      
    var companyId = this.CompanyId;
    var userId = this.UserId;
    var PageName = this.pagename;
    // var pageNo = 1;
    // var PageSize = 50;
    var pageNo = this.paginationParams.currentPageIndex + 1;
    var PageSize = this.paginationParams.pageSize;
    var search = "";
    var isSearch = false;
    var IsExport = false;
    var IsCompanyAdmin = 1;
    this.paginationParams.totalCount=0;
    this.loader.open();
    this.assetService.GetGridDataForGrnAsset(companyId, userId, PageName, pageNo, PageSize, search, isSearch, IsExport, IsCompanyAdmin)
      .subscribe(result => {
          
        this.loader.close();
        if (!result || result == null || result == "") {
          this.DataForGrid = [];
          this.onChangeDataSource(this.DataForGrid);
          return false;
        } else {
          this.DataForGrid = JSON.parse(result);
          this.DataForGrid.forEach( r => {
            if(r.LocationId==2)
            {
              r.LocationId="File uploaded successfully."
            }
            if(r.LocationId==1)
            {
              r.LocationId="File upload is failed."
            }
            if(r.LocationId==0 || r.LocationId==3)
            {
              r.LocationId="File upload is in progress."
            }
            
              
          })
          this.paginationParams.totalCount= this.DataForGrid[0].ListCount != null ?this.DataForGrid[0].ListCount :0;
          this.onChangeDataSource(this.DataForGrid);
        }
      })
  }


  onChangeDataSource(value) {
      
    this.datasource = new MatTableDataSource(value);
     this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  selectedPath: string;

  donloadexcels(v) {
      
    this.loader.open();
    this.selectedPath = v.FileName;
    this.allPathService.DownloadExcelGrnAsset(this.selectedPath);
    this.loader.close();
  }
  Uploadtype;
  pagename;
  flag :boolean =false;
  onchangeId(id:any){
    debugger;
    if(id == "GRNNo")
    {
      //if(!this.PermissionIdList.indexOf(45))
      for(var i=0;i<this.ListOfPagePermission.length;i++){
      if(this.ListOfPagePermission[i].ModulePermissionId == 40 || this.ListOfPagePermission[i].ModulePermissionId == 203 ||
        this.ListOfPagePermission[i].ModulePermissionId == 204)
      {
          this.flag =true;
      }
    }
    this.assetuploadid=2;
    this.Uploadtype="uploadGRN";
    this.pagename="UploadGRNAssets";
    this.getDataForGrid();
   }
   else if(id == "NFAR"){
    for(var i=0;i<this.ListOfPagePermission.length;i++){
    if( this.ListOfPagePermission[i].ModulePermissionId == 203)
   
    {
        this.flag =true;
    }
  }
  this.assetuploadid=3;
  this.Uploadtype="uploadNFAR";
  this.pagename="UploadNFARAssets";
  this.getDataForGrid();
  }
  
  }



}
