import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Inject } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManagerService } from '../../storage/sessionMangaer'
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { LocalStoreService } from '../../../shared/services/local-store.service';
import { CreateAssetClassDialogComponent } from '../../master/asset_class/assetclass_add_edit_dialog/createassetclass-dialog.component';
import { CreateWorkorderDialogComponent } from '../dialogs/create-workorder-dialog/create-workorder-dialog.component';
import * as headers from '../../../../assets/Headers.json';
import { take, takeUntil } from 'rxjs/operators';
import * as resource from '../../../../assets/Resource.json';
import { ToastrService } from 'ngx-toastr';
import { UploadService } from 'app/components/services/UploadService';
import { Sort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { AssetClassService } from '../../services/AssetClassService';
import { Constants } from 'app/components/storage/constants';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/UserService';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import * as menuheaders from '../../../../assets/MenuHeaders.json';
import { AllPathService } from 'app/components/services/AllPathServices';
import { WorkorderTypeDialogComponent } from '../dialogs/workorder-type-dialog/workorder-type-dialog.component';
import { CmmsService } from '../../services/CmmsService';
import { FormControl } from '@angular/forms';
import { CompanyLocationService } from '../../services/CompanyLocationService';

@Component({
  selector: 'app-create-work-order',
  templateUrl: './create-work-order.component.html',
  styleUrls: ['./create-work-order.component.scss']
})



export class CreateWorkOrderComponent implements OnInit {

  message: any = (resource as any).default;
  Headers: any = (headers as any).default;
  orderType: any='';
  paginationParams: any;
  status: any='';
  @ViewChild(MatPaginator) paginator: MatPaginator;

  assetType:any;
  
  protected _onDestroy = new Subject<void>();
  plantVal: any;
  public plantMultiFilterCtrl: FormControl = new FormControl();
  public filteredPlantsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  selectedAsset:any;
  displayedColumns: any[] = ['Actions','ImageUrl','OrderNumber','IssueType','LocationName','AssetCriticality','StatusName','CriticalityType']
  @ViewChild('AssetClasspaginator', { static: true }) AssetClasspaginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('AssetClass_table', { static: false }) AssetClass_table: any;

  private isButtonVisible = false;
  setflag: boolean=false;
  loc:any;
  statuses:any[] = ['Open','Close']
  subLoc:any;
  astNo: any;
  showGrid: Boolean = false;
  public SelectedAssetmaster: any;
  value: any;
  updateData: any;
  updateDataInsert: any;
  deleteOptions: { option: any; id: any; };
  json: any;
  show: boolean = false;
  public hideth;
  orderTyes: any[] = [];
  public AssetClass_data;
  workOrdersData: any[] = [];
  public dataLength;
  ListOfLoc1: any;
  AssetClass_datasource: any;
  ListOfLoc: any;
  datasource: any;
  displayedHeadersAssetClass: string[] = ['Select','InventoryNo', 'AssetName', 'SubNo','SerialNo','AssetCategory'];
  // displayedColumnsAssetClass: string[] = ['BlockName', 'Acronym', 'ITAMAssetClass', 'NFARBlock', 'Actions'];
  displayedColumnsAssetClass: string[] = ['Select','InventoryNo', 'AssetName', 'SubNo','SerialNo','AssetCategory'];
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
    private cmmsService: CmmsService,
    public cls: CompanyLocationService
  ) { }

  ngOnInit() {
    this.hideth = true;
    this.paginationParams = {
      pageSize: 50,
      currentPageIndex: 0,
      endIndex: 0,
      startIndex: 0,
      totalCount: 0,
    }
    this.GroupIdSession = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID),
      this.RegionIdSession = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID),
      this.CompanyIdSession = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID),
      this.UserIdSession = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID),
      this.GetInitiatedData();
    this.GetAllAssetClass();
    // this.GetAllWorkOrders();
    this.getOrderTypes();
    let url1 = this.cls.GetLocationListByConfiguration(this.GroupIdSession, this.UserIdSession, this.CompanyIdSession, this.RegionIdSession, 40);
    url1.subscribe(locs=>{
      this.ListOfLoc = JSON.parse(locs);
      this.ListOfLoc1 = this.ListOfLoc;
      this.getFilterPlantType();
    });
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
  changeAsstType(){
    debugger
    if(!this.assetType) {
      this.selectedAsset=null;
      return;
    }
  }
  changi(el){
    this.selectedAsset = el;
    this.astNo = el.Acronym;
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
  openUploadAssetClass(todo, rowData): void {
    //  if((!this.loc||!this.subLoc)&&this.assetType!='equipment') {
    //    this.toastr.warning("Location/Sub Location can't be empty", this.message.AssetrakSays);
    //    return;
    // }
    const dialogconfigcom1 = new MatDialogConfig();
  //  dialogconfigcom1.disableClose = true;
    // dialogconfigcom1.autoFocus = true;
     dialogconfigcom1.width = "auto";
     dialogconfigcom1.height = "auto";
    //  dialogconfigcom1.maxWidth = "auto";
     if(todo == 'edit')
      dialogconfigcom1.data = rowData;
    //  dialogconfigcom1.data.locD = this.loc;
    //  dialogconfigcom1.data.subLocD = this.subLoc;
     console.log(dialogconfigcom1);
    const modalService = this.dialog.open(WorkorderTypeDialogComponent, dialogconfigcom1);
    modalService.afterClosed().subscribe((res) => {
      if (res) {
          this.cmmsService.addWorkOrder(res).subscribe(resp=>{
            this.GetAllWorkOrders();
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

  showAssetGrid(){
    this.showGrid = true;
  }

  GetAllWorkOrders(){
    console.log(this.plantVal);
     this.loader.open();
    let filters = [];
    filters.push({"FilterName":"a.InitiatedBy","FilterValue":[this.UserIdSession.toString()]});
    let singleFilter = {};
    debugger;
    if(this.plantVal && this.plantVal?.length != 0){
      singleFilter['FilterName'] = "a.LocationID";
      singleFilter['FilterValue'] = [];
      this.plantVal.forEach(plant=>{
        singleFilter['FilterValue'].push((plant.LocationId).toString());
      });
      filters.push(singleFilter);
    }
    singleFilter = {};
    console.log('status', singleFilter);
    if(this.status){
      singleFilter['FilterName'] = "a.StatusID";
      singleFilter['FilterValue'] = [];
      if(this.status == 'Open') singleFilter['FilterValue'].push("1","2","4","5","6","11","12");
      else if(this.status == 'Close') singleFilter['FilterValue'].push("3","10","17");
      filters.push(singleFilter);
    }
    debugger;
    if(!filters){
      this.cmmsService.getAllWorkdOrders().subscribe(res=>{
        this.workOrdersData = JSON.parse(res.Model);
        console.log(this.workOrdersData);
        this.onChangeDataSource(this.workOrdersData);
        this.showAssetGrid();
        this.loader.close();
      });
    }
    else{
      this.cmmsService.getWorkOrderByFilter(filters).subscribe(res=>{
        this.workOrdersData = JSON.parse(res.Model);
        console.log(this.workOrdersData);
        this.onChangeDataSource(this.workOrdersData);
        this.showAssetGrid();
        this.loader.close();
      });
    }
    console.log(filters);

  }

  onChangeDataSource(value) {
    this.datasource = new MatTableDataSource(value);
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
   this.paginationParams.totalCount = this.workOrdersData.length;

  }

  getOrderTypes(){
    this.cmmsService.getOrderTypes().subscribe(res=>{
      debugger; 
      this.orderTyes = JSON.parse(res.Model);
      console.log(this.orderTyes);
    })
  }

  limit = 10;
offset = 0;
getFilterPlantType() {
  this.filteredPlantsMulti.next(this.ListOfLoc.slice(0, this.offset + this.limit));
  this.offset += this.limit;
  this.plantMultiFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterPlantsMulti();
    });
}

protected filterPlantsMulti() {
  if (!this.ListOfLoc1) {
    return;
  }
  let search = this.plantMultiFilterCtrl.value;
  if (!search) {
    this.filteredPlantsMulti.next(this.ListOfLoc1.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredPlantsMulti.next(
    this.ListOfLoc1.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1)
  );
}

applyFilter(value){
  this.datasource.filter = value.trim().toLowerCase();
}
}
