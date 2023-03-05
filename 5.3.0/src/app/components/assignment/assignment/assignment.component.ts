import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild,Output,EventEmitter } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { assetTabsComponent } from '../../partialView/assetDetails/asset_tabs.component';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { ReportService } from 'app/components/services/ReportService';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import * as menuheaders from '../../../../assets/MenuHeaders.json'
import { ReconciliationService } from '../../services/ReconciliationService';
import { CompanyLocationService } from '../../services/CompanyLocationService';
import { UserMappingService } from '../../services/UserMappingService';
import { CompanyBlockService } from '../../services/CompanyBlockService';
import { GroupService } from '../../services/GroupService';
import { UserService } from '../../services/UserService';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { AllPathService } from 'app/components/services/AllPathServices';
import { GetFieldsComponent } from 'app/components/partialView/get-fields/get-fields.component';
import { Sort } from '@angular/material/sort';
import { AssetService } from '../../services/AssetService';
import { AllocatedAssetDialogComponent } from '../dialog/allocated-asset-dialog/allocated-asset-dialog.component';
import { UnallocatedAssetDialogComponent } from '../dialog/unallocated-asset-dialog/unallocated-asset-dialog.component';
import { ITAssetsService } from '../../services/ITAssetsService';
import { GroupDetailsComponent } from 'app/components/partialView/group-details/group-details.component';
import { ExportFieldsComponent } from 'app/components/partialView/export-fields/export-fields.component';
import { MultiSearchDialogComponent } from 'app/components/partialView/multi-search-dialog/multi-search-dialog.component';
@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.scss']
})
export class AssignmentComponent implements OnInit {

  Headers: any = [];
  message: any;

  numRows: number;
  withoutFilter: any
  selectedValue: string;
  IsDisabled: boolean = true;
  setflag: boolean =false;
  private isButtonVisible = false;
  private isButtonVisibleADL2 = false;
  private isButtonVisibleADL3 = false;
  private isButtonVisibleSupplier = false;
  private isButtonVisibleGRNNo = false;
  private isButtonVisibleSerialNo = false;
  private isButtonVisibleITSerialNo = false;
  private isButtonVisiblePONumber = false;
  private isButtonVisibleEqipmentNumber = false;
  private isButtonVisibleCPPNumber = false;
  private isButtonVisibleBarCode = false;
  public bindData: any[];
  public arrlength = 0;
  public arr = [];
  public newdataSource = [];
  public isallchk: boolean;
  public getselectedData: any[] = [];
  public selecteddatasource: any[] = [];
  public appliedfilters: any[] = [];
  AssetNoFilter = new FormControl();
  AssetClassFilter = new FormControl();
  TransferTypeFilter = new FormControl();
  panelOpenState = true;
  searchColumns: any[] = [];
  @Output() insuranceEndDate: EventEmitter<any> = new EventEmitter<any>();
  filteredValues = {
    AssetNo: '', SubNo: '', CapitalizationDate: '',
    AssetClass: '', AssetType: '',
    AssetSubType: '', UOM: '', AssetName: '',
    AssetDescription: '', Qty: '', Cost: '', WDV: '',
    EquipmentNO: '', AssetCondition: '', AssetCriticality: ''
  };

  CompanyId: any;
  UserName: any;
  Name: any;
  GroupId: any;
  UserId: any;
  RegionId: any;
  IsCompanyAdmin: any = 1;
  IslayerDisplay: any;
  layerid: any;
  Layertext: any;
  HeaderLayerText: any;
  serachtext: any;
  colunname: any;
  menuheader: any = (menuheaders as any).default;

  // protected city: City[] = CITY;
  public cityMultiCtrl: any;
  public cityMultiFilterCtrl: FormControl = new FormControl();
  public filteredCityMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  // protected plants: Plant[] = PLANTS;
  public plantMultiCtrl: any;
  public plantMultiFilterCtrl: FormControl = new FormControl();
  public filteredPlantsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  // protected assetclass: AssetClass[] = ASSETCLASS;
  public assetclassMultiCtrl: any;
  public assetclassFilterCtrl: FormControl = new FormControl();
  public filteredAssetClassMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  protected assetstatus: any;
  public assetstatusMultiCtrl: any;
  public assetstatusFilterCtrl: FormControl = new FormControl();
  public filteredAssetStatusMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);


  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  protected _onDestroy = new Subject<void>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource<any>();
  displayedColumns: any[] = ['select'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  selection = new SelectionModel<any>(true, []);
  displayTable: boolean = false;
  displaybtn: boolean = false;

  ASSETStatus: any[] = [];

  constructor(public dialog: MatDialog,
    public rs: ReconciliationService,
    public cls: CompanyLocationService,
    public ums: UserMappingService,
    public cbs: CompanyBlockService,
    public gs: GroupService,
    public toastr: ToastrService,
    private storage: ManagerService,
    public confirmService: AppConfirmService,
    private loader: AppLoaderService,
    public us: UserService,
    private router: Router,
    public AllPathService: AllPathService,
    public alertService: MessageAlertService,
    public as: AssetService,
    public ITAssetsService: ITAssetsService,
    public reportService: ReportService,
    private jwtAuth: JwtAuthService,
    ){
       this.Headers = this.jwtAuth.getHeaders();
       this.message = this.jwtAuth.getResources();
       this.ASSETStatus= [    
        { name: this.Headers.Stores, id: '00' },
        { name: this.Headers.AllocatedUnconfirmed, id: '0' },
        { name: this.Headers.AllocatedConfirmed, id: '1' },
        { name: this.Headers.AllocatedDeclined, id: '2' },
        { name: this.Headers.Uploaded, id: '3' },
        { name: this.Headers.EmployeeNotAvailable, id: '5' },
      ];
    
    }
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  paginationParams: any;
  ngOnInit(): void {

    this.loader.open();
    this.paginationParams = {
      pageSize: 50,
      currentPageIndex: 0,
      endIndex: 0,
      startIndex: 0,
      totalCount: 0,
    }
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    this.Name = this.storage.get(Constants.SESSSION_STORAGE, Constants.Name);
    this.UserName = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_NAME);

    this.cityMultiCtrl = "";
    this.plantMultiCtrl = "";
    this.assetclassMultiCtrl = "";
    this.assetstatusMultiCtrl = "";
    debugger;
    this.layerid = this.storage.get(Constants.SESSSION_STORAGE, Constants.LAYER_ID);
    this.IslayerDisplay = this.layerid;
    if (this.layerid == 1) {
      this.Layertext = "Country";
    }
    else if (this.layerid == 2) {
      this.Layertext = "State";
    }
    else if (this.layerid == 3) {
      this.Layertext = "City";
    }
    else if (this.layerid == 4) {
      this.Layertext = "Zone";
    }
    this.HeaderLayerText = this.Layertext;
    this.GetInitiatedData();
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  ListOfField: any[] = [];
  ListOfLoc: any[] = [];
  ListOfLoc1: any[] = [];
  ListOfSBU: any[] = [];
  ListOfFilter: any[] = [];
  ListOfFilterName: any[] = [];
  ListOfCategory: any[] = [];
  ListOfCategory1: any[] = [];
  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  flag :any;
  GetInitiatedData() {
    debugger;
    let url1 = this.cls.GetLocationListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 107);
    let url2 = this.cbs.GetCategoryListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 107);
  let url3 = this.gs.GetFieldListByPageId(107,this.UserId,this.CompanyId);
    let url4 = this.gs.GetFilterIDlistByPageId(107);
    let url5 = this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.RegionId, "107");
    let url6 =  this.gs.CheckWetherConfigurationExist(this.GroupId, 65)
    forkJoin([url1, url2, url3, url4, url5,url6]).subscribe(results => {
      if (!!results[0]) {
        this.ListOfLoc = JSON.parse(results[0]);
        this.ListOfLoc1 = this.ListOfLoc;
        this.ListOfSBU = this.UniqueArraybyId(this.ListOfLoc1, this.Layertext);

        this.getFilterCityType();
        this.getFilterPlantType();
      }
      debugger;
      if (!!results[1]) {
        this.ListOfCategory = JSON.parse(results[1]);
        this.ListOfCategory1 = JSON.parse(results[1]);
        this.getFilterCategoryType();
      }
      if (!!results[2]) {
        this.ListOfField = JSON.parse(results[2]);
        this.searchColumns = this.ListOfField.filter(x => x.SearchOptionEnabled == true).map(choice => choice);
        this.displayedColumns = this.ListOfField;
        this.displayedColumns = this.displayedColumns.filter(x => x.Custom2== "1" ).map(choice => choice.Custom1);
        this.displayedColumns = ['Select','Icon'].concat(this.displayedColumns);
        console.log(this.displayedColumns);
      }
      if (!!results[3]) {
        this.ListOfFilter = JSON.parse(results[3]);
        if (!!this.ListOfFilter) {
          this.ListOfFilter.forEach(x => this.ListOfFilterName.push(x.FilterName))
        }
      }
      this.flag = results[5];
      if (!!results[4]) {
        this.ListOfPagePermission = JSON.parse(results[4]);
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
      this.loader.close();
      this.GetPageSession();
    })
  }
  StorePageSession: any;
  GetPageSession() {
    this.StorePageSession = "";
    if (!!localStorage.getItem('PageSession') && localStorage.getItem('PageSession') != "null") {
      this.StorePageSession = {}
      this.StorePageSession = JSON.parse(localStorage.getItem('PageSession'));
      if (this.StorePageSession.Pagename === "Asset Allocation") {
        
      }
      else {
        localStorage.setItem('PageSession', null);
        this.StorePageSession = "";
      }
    }
  }

  UniqueArraybyId(collection, keyname) {
    var output = [], keys = [];
    collection.forEach(item => {
      var key = item[keyname];
      if (keys.indexOf(key) === -1) {
        keys.push(key);
        output.push(item);
      }
    });
    return output;
  };
  // onchangeSBU(value) {
  //   if (!!value) {
  //     this.ListOfLoc1 = this.ListOfLoc.filter(x => x[this.Layertext].indexOf(value) > -1);
  //     this.getFilterPlantType();
  //   }
  //   else {
  //     this.ListOfLoc1 = this.ListOfLoc.filter(x => x);
  //     this.getFilterPlantType();
  //   }
  // }
  onchangeSBU(value) {
    debugger;
    this.showmultiSearch = false;
        if(!!value){
          var list = [];    
          if(!!this.cityMultiCtrl && this.cityMultiCtrl.length > 0){
            this.cityMultiCtrl.forEach(x => {
              this.ListOfLoc = this.ListOfLoc1.filter(y => y[this.Layertext].indexOf(x) > -1);
              this.ListOfLoc.forEach(x => {
                list.push(x);
              })        
            })
            this.ListOfLoc = list;
          }
          else{
            this.ListOfLoc = this.ListOfLoc1.filter(y => y);
          }      
          this.plantMultiCtrl = "";
          this.getFilterPlantType();
        }
        else{     
          this.ListOfLoc = this.ListOfLoc1;
          this.plantMultiCtrl = "";
          this.getFilterPlantType();
        }   
        // if (!!value) {
        //   this.ListOfLoc = this.ListOfLoc1.filter(x => x[this.Layertext].indexOf(value) > -1);
        //   this.getFilterPlantType();
        // }
        // else {
        //   this.ListOfLoc = this.ListOfLoc1.filter(x => x);
        //   this.getFilterPlantType();
        // }
      }
 
  CategoryGetdata() {
    this.showmultiSearch = false;
    var PlantList = [];
    if (!!this.plantMultiCtrl) {
      this.plantMultiCtrl.forEach(x => {
        PlantList.push(x.LocationId);
      })
    }
    else {
      this.ListOfLoc.forEach(x => {
        PlantList.push(x.LocationId);
      })
    }
   
    debugger
    this.reportService.GetCategoryRightWiseForReport(this.CompanyId, this.UserId, PlantList, false,24).subscribe(r => {
      this.ListOfCategory=[];
      r.forEach(element => {
        // this.ListOfCategory=[];
        this.ListOfCategory.push(element);
        this.getFilterCategoryType();
      });
    })
  }
 
  clickToExport() {
    if(this.displayTable == true && this.dataSource.data.length != 0){
      this.AssetallocationBindData("IsExport");
    } else{
      if(this.displayTable == false){
        this.toastr.warning(this.message.NoDataselected, this.message.AssetrakSays);
        return null;
      }
      else{
        this.toastr.warning(this.message.NoDataAvailable, this.message.AssetrakSays);
        return null;
      }            
    }
  }
  //====== Bind Data To DataSource========  
  handlePage(pageEvent: PageEvent) {
    debugger;
    this.paginationParams.pageSize = pageEvent.pageSize;
    this.paginationParams.currentPageIndex = pageEvent.pageIndex;
    this.paginationParams.endIndex = (this.paginationParams.currentPageIndex + 1) * pageEvent.pageSize;
    this.paginationParams.startIndex = this.paginationParams.currentPageIndex * pageEvent.pageSize;
     if(this.multipleserach= true && this.multiSearch.length > 0) 
    {
      this.AssetallocationBindData("multiplesearch");
    }
    else{
      this.AssetallocationBindData("")
    }
   
  }
  IsSearch: boolean = false;
  isExport: boolean = false;
  Assetallocation() {
    this.selection.clear();
    this.numSelected = 0;
    this.Onchange();
    this.getselectedIds = [];
    this.resendmailbtn = [];
    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;
    this.getclear();
    this.AssetallocationBindData("OnPageload");
  }
  ExportedFields:any=[];
  multiSearch : any[]=[];
  Searchlist :any[];
  AssetallocationBindData(Action) {
    debugger;
    this.loader.open();
    var LocationIdList = [];
    var CategoryIdList = [];
    var Statuslist = [];
   
    if (!!this.plantMultiCtrl) {
      this.plantMultiCtrl.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }
    else {
      this.ListOfLoc.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }

    if (!!this.assetclassMultiCtrl) {
      this.assetclassMultiCtrl.forEach(x => {
        CategoryIdList.push(x.AssetCategoryId);
      })
    }
    else {
      this.ListOfCategory.forEach(x => {
        CategoryIdList.push(x.AssetCategoryId);
      })
    }

    // if (!!this.assetstatusMultiCtrl) {
    //   this.assetstatusMultiCtrl.forEach(x => {
    //     Statuslist.push(x);
    //   })
    // }
    this.isExport = false;
  //  this.showmultiSearch = false;
    this.multipleserach = false;
    if (Action === 'IsExport') {
      this.isExport = true;
    }
    if(Action == "OnPageload"){
      this.multipleserach = false;
      this.Searchlist = [];
    }
    if (Action == "multiplesearch" && this.multiSearch.length > 0  )
    {
      if(this.multiSearch[0].fieldname != "")
      {
      this.multipleserach = true;
      this.Searchlist = this.multiSearch;
      }
    }
    if(this.panelOpenState && this.showmultiSearch && this.displayTable) {
      this.panelOpenState = false;
    }  

    var assetDetails = {
      CompanyId: this.CompanyId,
      RegionId: this.RegionId,
      CategoryIdList: CategoryIdList,
      pageNo: this.paginationParams.currentPageIndex + 1,
      pageSize: this.paginationParams.pageSize,
      AssetStage: 15,
      BlockId: 0,
      Option: !!this.assetstatusMultiCtrl ? this.assetstatusMultiCtrl.id : "",
      SbuList: [],
      LocationIdList: LocationIdList,
      SearchText: this.IsSearch ? this.SearchText : "",
      searchColumn: this.IsSearch ? this.SearchOnColumn : "",
      IsExport: this.isExport,
      typeOfAssetList: [],
      subTypeOfAssetList: [],
      AllocationStatuslist: Statuslist,
      GroupId: this.GroupId,
      UserId: this.UserId,
      PageId : 107,
      ExportedFields : this.ExportedFields,
      Searchlist : this.Searchlist,
      ismultiplesearch: this.multipleserach,
    }
    this.as.GetAssetListForUserCustodian(assetDetails).subscribe(r => {
      debugger;
      this.loader.close();
      if (Action === 'IsExport') {
        this.AllPathService.DownloadExportFile(r);
      }
      else {
        this.bindData = [];
        if(!!r){
          this.bindData = JSON.parse(r);
        }   
        this.paginationParams.totalCount = 0;
        if (!!this.bindData && this.bindData.length > 0) {
          this.paginationParams.totalCount = this.bindData[0].AssetListCount;
          this.displaybtn = true;
          this.displayTable = true;
        } 
        else{
          this.displayTable = true;
          //this.toastr.warning(this.message.NoDataAvailable, this.message.AssetrakSays);
        }       
        this.onChangeDataSource(this.bindData);
      }
    })
  }

  onChangeDataSource(value) {
    this.dataSource = new MatTableDataSource(value);
    //this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  viewSelected() {
    this.getclear();
    this.paginationParams.totalCount = this.selection.selected.length;
    this.paginationParams.endIndex = this.selection.selected.length;
    this.onChangeDataSource(this.selection.selected);
  }
  clearSelectedView() {
    this.resendmailbtn = [];
   // this.getclear();
    this.selection.clear();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.paginationParams.totalCount = 0;
    if (!!this.bindData && this.bindData.length > 0) {
      this.paginationParams.totalCount = this.bindData[0].AssetListCount;
   
    } 
          
    this.onChangeDataSource(this.bindData);
  }

  clearSelected() {
    this.selection.clear();
    this.getclear();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.resendmailbtn = [];
    this.AssetallocationBindData("");
  }

  isAllSelected: boolean = false;
  numSelected: any = 0;
  getselectedIds: any[] = [];
  masterToggle() {
    debugger;
    this.isAllSelected = !this.isAllSelected;
    this.selection.clear();
    this.getselectedIds = [];
    this.resendmailbtn = [];
    if (this.isAllSelected == true) {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
    this.numSelected = this.selection.selected.length;
    if (this.numSelected > 0) {
      this.selection.selected.forEach(row => {
        this.getselectedIds.push(row.PreFarId)
        if (row.allocatedStatus == '0' || row.allocatedStatus == '2' || row.allocatedStatus == '3') {
          this.resendmailbtn.push(row.PreFarId);
        }
      });
    }
  }
  resendmailbtn: any[] = [];
  isSelected(row) {
    debugger;
    this.isAllSelected = false;
    this.selection.toggle(row)
    this.numSelected = this.selection.selected.length;
    var idx = this.getselectedIds.indexOf(row.PreFarId);
    if (idx > -1) {
      this.getselectedIds.splice(idx, 1);
    }
    else {
      this.getselectedIds.push(row.PreFarId);
    }

    if (row.allocatedStatus == '0' || row.allocatedStatus == '2' || row.allocatedStatus == '3') {
      var idx = this.resendmailbtn.indexOf(row.PreFarId);
      if (idx > -1) {
        this.resendmailbtn.splice(idx, 1);
      }
      else {
        this.resendmailbtn.push(row.PreFarId);
      }
    }
  }


  PageId =107;
  openPopUp(data: any = {}) {
    debugger;
    let title = 'Add new member';
    var payload = {
      PageId : this.PageId,
      element : data,
      ListOfField : this.ListOfField,
      Pagename: "Asset Allocation"
    }
     var Originaldata = data;
    const dialogRef = this.dialog.open(assetTabsComponent, {
      width: 'auto',
     
      data: { title: title, payload: payload }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          debugger;
          data = Originaldata;
          return;
        }
      })
  }

  editGridpop() {

    let title = 'Edit Grid Display';
    const dialogRef = this.dialog.open(GetFieldsComponent, {
      width: '60vw',
      height: 'auto',
      data: { title: title, payload: this.ListOfField }
    })
    dialogRef.afterClosed().subscribe(result => {
      debugger;
      if (!!result) {
        console.log(result)
        this.ListOfField = result;
        this.displayedColumns = this.ListOfField;
        console.log(this.displayedColumns);
        this.displayedColumns = this.ListOfField.filter(x => x.Custom2 == "1" ).map(choice => choice.Custom1);
        this.displayedColumns = ['Select','Icon'].concat(this.displayedColumns);
      }
    })
  }
  AssetType: any;
  openallocation(data: any = {}) {
    if (this.selection.selected.length > 0) {
      var prefarIds = [];
      var bindData = [];
      var locationId = 0;
      const numSelected = this.selection.selected.length;
      for (var i = 0; i < numSelected; i++) {
        //locationId = this.selection.selected[i].LocationId;
      
        debugger;
        if(this.selection.selected[i].MergeId > 0){
          prefarIds.push(this.selection.selected[i].PreFarId);
        }
        else{
          bindData.push(this.selection.selected[i]);
        }      
      }
      
      

      let configdata = {
        CompanyId: this.CompanyId,
        GroupId: this.GroupId,
        UserId: this.UserId,
        AssetList: prefarIds,
        Name: this.Name,
        bindData : bindData,
        Flag :this.flag
      }
      const dialogRef = this.dialog.open(AllocatedAssetDialogComponent, {
        width: '980px',
       
        data: { title: '', payload: this.selection.selected, configdata: configdata }
      });

      dialogRef.afterClosed().subscribe(result => {
        debugger;
        if (!!result) {
          this.loader.open();
          this.as.UpdateAsset(result).subscribe(r => {
            debugger;
            this.loader.close();
            this.toastr.success(this.message.AssetAllocationInfoUpdateSucess, this.message.AssetrakSays);
            this.clearSelected();
          })
        }
      })
    }
    else {
      this.toastr.warning(this.message.SelectAtleastOneAsset, this.message.AssetrakSays);
    }
  }
  txtUserEmail: any;
  txtCustodianEmail: any;
  openUnallocate(data: any = {}) {
    var prefarIds = [];
    var bindData = [];
    var locationId = 0;
    if (this.selection.selected.length > 0) {
      var flag1 = 0;
      const numSelected = this.selection.selected.length;
      for (var i = 0; i < numSelected; i++) {
      
        debugger;
        if(this.selection.selected[i].MergeId > 0){
          prefarIds.push(this.selection.selected[i].PreFarId);
        }
        else{
          bindData.push(this.selection.selected[i]);
        }      
      }
      if (flag1 > 0) {
        this.toastr.warning(this.message.UserNotAvailable, this.message.AssetrakSays);
        return false;
      }
    }

    let configdata = {
      CompanyId: this.CompanyId,
      GroupId: this.GroupId,
      UserId: this.UserId,
      AssetList: prefarIds,
      Name: this.Name,
      UserName: this.UserName,
      txtUserEmail: !this.txtUserEmail ? "" : this.txtUserEmail,
      LocationId: locationId,
      txtCustodianEmail: !this.txtCustodianEmail ? "" : this.txtCustodianEmail,
      bindData : bindData
    }
    const dialogRef = this.dialog.open(UnallocatedAssetDialogComponent, {
      width: '980px',
     
      data: { title: '', payload: this.selection.selected, configdata: configdata }
    });

    dialogRef.afterClosed().subscribe(result => {
      debugger;
      if (!!result) {
        this.loader.open();
        this.as.AssetUnallocation(result).subscribe(r => {
          debugger;
          this.loader.close();
          if (r == "success") {
            this.toastr.success(this.message.AssetAllocationInfoUpdateSucess, this.message.AssetrakSays);
            this.clearSelected();
          }
          else {
            this.toastr.error(r, this.message.AssetrakSays);
          }
        })
      }
    })
  }

  ResendMail() {
    debugger;
    if (this.resendmailbtn.length > 0) {
      // var prefarIds = [];
      // const numSelected = this.selection.selected.length;
      // for (var i = 0; i < numSelected; i++) {
      //   prefarIds.push(this.selection.selected[i].PreFarId);
      // }
      this.AssetType = "Capitalized Assets";

      let configdata = {
        CompanyId: this.CompanyId,
        GroupId: this.GroupId,
        PrefarIdlist: this.resendmailbtn
      }
      this.loader.open();
      this.as.ResendMail(configdata).subscribe(r => {
        debugger;
        this.loader.close();
        if (r == "sucess") {
          this.toastr.success(this.message.MailSendSucess, this.message.AssetrakSays);
          this.clearSelected();
        }
      })
    }
    else {
      this.toastr.warning(this.message.SelectAtleastOneAsset, this.message.AssetrakSays);
    }
  }
  GetSubGroupJson(element) {
    let title = 'Group Details';
    const dialogRef = this.dialog.open(GroupDetailsComponent, {
      width: 'auto',
      data: { title: title, payload: element.PreFarId }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
       
      }
    })
  }


  getFilterCityType() {
    this.filteredCityMulti.next(this.ListOfSBU.slice());
    this.cityMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCityMulti();
      });
  }
  protected filterCityMulti() {
    if (!this.ListOfSBU) {
      return;
    }
    let search = this.cityMultiFilterCtrl.value;
    if (!search) {
      this.filteredCityMulti.next(this.ListOfSBU.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCityMulti.next(
      this.ListOfSBU.filter(city => city.name.toLowerCase().indexOf(search) > -1)
    );
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
      this.ListOfLoc1.filter(plant => plant.LocationName.toLowerCase().indexOf(search) > -1)
    );
  }
  getFilterCategoryType() {
    this.filteredAssetClassMulti.next(this.ListOfCategory.slice());
    this.assetclassFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAssetclassMulti();
      });
  }
  protected filterAssetclassMulti() {
    if (!this.ListOfCategory) {
      return;
    }
    let search = this.assetclassFilterCtrl.value;
    if (!search) {
      this.filteredAssetClassMulti.next(this.ListOfCategory.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredAssetClassMulti.next(
      this.ListOfCategory.filter(assetclass => assetclass.AssetCategoryName.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterAssetstatusMulti() {
    if (!this.assetstatus) {
      return;
    }
    let search = this.assetstatusFilterCtrl.value;
    if (!search) {
      this.filteredAssetStatusMulti.next(this.assetstatus.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredAssetStatusMulti.next(
      this.assetstatus.filter(assetstatus => assetstatus.name.toLowerCase().indexOf(search) > -1)
    );
  }

  toggleSelectAllCity(selectAllValue) {
    this.cityMultiCtrl = [];
    this.filteredCityMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (!!selectAllValue.checked) {
          this.ListOfSBU.forEach(element => {
            this.cityMultiCtrl.push(element[this.Layertext]);
          });          
        } else {
          this.cityMultiCtrl ="";
        }
        this.onchangeSBU('');
      });
  }

  toggleSelectAll(selectAllValue) {    
    this.plantMultiCtrl=[];
    this.filteredPlantsMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {       
        if (!!selectAllValue.checked) {
          this.ListOfLoc.forEach(element => {
            this.plantMultiCtrl.push(element);
          });          
        } else {         
          this.plantMultiCtrl="";
        }
        this.ListOfCategory = this.ListOfCategory1;
        this.getFilterCategoryType();
      });
  }

  toggleSelectAllassetclass(selectAllValue) {
    this.assetclassMultiCtrl = [];
    this.filteredAssetClassMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (!!selectAllValue.checked) {
          this.ListOfCategory.forEach(element => {
            this.assetclassMultiCtrl.push(element);
          }); 
        } else {
          this.assetclassMultiCtrl="";
        }
      });
  }

  toggleSelectAllassetstatus(selectAllValue: boolean) {
    this.filteredAssetStatusMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.assetstatusMultiCtrl.patchValue(val);
        } else {
          this.assetstatusMultiCtrl.patchValue([]);
        }
      });
  }

  customFilterPredicate() {
    const myFilterPredicate = (data: any, filter: string): boolean => {

      let searchString = JSON.parse(filter);
      return data.AssetNo.toString().trim().toLowerCase().indexOf(searchString.AssetNo.toLowerCase()) !== -1 &&
        data.SubNo.toString().trim().indexOf(searchString.SubNo) !== -1 &&
        data.CapitalizationDate.toString().trim().toLowerCase().indexOf(searchString.CapitalizationDate.toLowerCase()) !== -1 &&
        data.AssetClass.toString().trim().toLowerCase().indexOf(searchString.AssetClass.toLowerCase()) !== -1 &&
        data.AssetType.toString().trim().toLowerCase().indexOf(searchString.AssetType.toLowerCase()) !== -1 &&
        data.AssetSubType.toString().trim().toLowerCase().indexOf(searchString.AssetSubType.toLowerCase()) !== -1 &&
        data.AssetName.toString().trim().toLowerCase().indexOf(searchString.AssetName.toLowerCase()) !== -1 &&
        data.AssetDescription.toString().trim().toLowerCase().indexOf(searchString.AssetDescription.toLowerCase()) !== -1 &&
        data.Cost.trim().toLowerCase().indexOf(searchString.Cost) !== -1 &&
        data.WDV.toString().trim().indexOf(searchString.WDV) !== -1 &&
        data.EquipmentNO.toString().trim().indexOf(searchString.EquipmentNO) !== -1 &&
        data.AssetCondition.toString().trim().toLowerCase().indexOf(searchString.AssetCondition.toLowerCase()) !== -1 &&
        data.AssetCriticality.toString().trim().toLowerCase().indexOf(searchString.AssetCriticality.toLowerCase()) !== -1;
    }
    return myFilterPredicate;
  }

  clearfilter() {
    if (this.appliedfilters.length > 0) {
      while (this.appliedfilters.length > 0) {
        this.appliedfilters.splice(this.appliedfilters.length - 1);
        console.log(this.appliedfilters);
      }
    }

  } 
  SearchText: any;
  SearchOnColumn: any;
  SerchAssetid(columnName) {
    debugger;
    // this.IsPageLoad= false;
    this.IsSearch = false;
    this.SearchText = "";
    this.SearchOnColumn = "";

    this.SearchOnColumn = columnName;
    this.SearchText = !this.AssetNoFilter.value ? "" : this.AssetNoFilter.value;
    if (!!this.SearchText) {
      this.IsSearch = true;
      this.SearchText = this.SearchText.trim();
    }
    if (this.IsSearch) {
      this.paginator.pageIndex = 0;
      this.paginationParams.pageSize = 50;
      this.paginationParams.currentPageIndex = 0;
      this.AssetallocationBindData("SearchText");
    }
  }

  ClearSerch(columnName, isflag) {
    debugger;
    this.SearchOnColumn = "";
    this.SearchText = "";
    this.AssetNoFilter.setValue("");
    this.IsSearch = false;

    this.isButtonVisible = !isflag;
    this.isButtonVisibleBarCode = !isflag;
    this.isButtonVisibleADL2 = !isflag;
    this.isButtonVisibleADL3 = !isflag;
    this.isButtonVisibleSupplier = !isflag;
    this.isButtonVisibleGRNNo = !isflag;
    this.isButtonVisibleSerialNo = !isflag;
    this.isButtonVisibleITSerialNo = !isflag;
    this.isButtonVisiblePONumber = !isflag;
    this.isButtonVisibleEqipmentNumber = !isflag;
    this.isButtonVisibleCPPNumber = !isflag;
     
    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;
    this.getclear();
    this.AssetallocationBindData("");
  }


  Serchicon(columnName, isflag) {
    debugger;
    this.SearchOnColumn = "";
    this.SearchText = "";
    this.AssetNoFilter.setValue("");
    this.IsSearch = false;

    this.isButtonVisible = isflag;
    this.isButtonVisibleBarCode = isflag;
    this.isButtonVisibleADL2 = isflag;
    this.isButtonVisibleADL3 = isflag;
    this.isButtonVisibleSupplier = isflag;
    this.isButtonVisibleGRNNo = isflag;
    this.isButtonVisibleSerialNo = isflag;
    this.isButtonVisibleITSerialNo = isflag;
    this.isButtonVisiblePONumber = isflag;
    this.isButtonVisibleEqipmentNumber = isflag;
    this.isButtonVisibleCPPNumber = isflag;

    if (columnName == "AssetId") { this.isButtonVisible = !isflag; }
    if (columnName == "Barcode") { this.isButtonVisibleBarCode = !isflag; }
    if (columnName == "ADL2") { this.isButtonVisibleADL2 = !isflag; }
    if (columnName == "ADL3") { this.isButtonVisibleADL3 = !isflag; }
    if (columnName == "Suplier") { this.isButtonVisibleSupplier = !isflag; }
    if (columnName == "GRNNo") { this.isButtonVisibleGRNNo = !isflag; }
    if (columnName == "SerialNo") { this.isButtonVisibleSerialNo = !isflag; }
    if (columnName == "ITSerialNo") { this.isButtonVisibleITSerialNo = !isflag; }
    if (columnName == "PONumber") { this.isButtonVisiblePONumber = !isflag; }
    if (columnName == "equipmentNo") { this.isButtonVisibleEqipmentNumber = !isflag; }
    if (columnName == "CPPNumber") { this.isButtonVisibleCPPNumber = !isflag; }
  }

  getclear() {
    this.SearchOnColumn = "";
    this.SearchText = "";
    this.AssetNoFilter.setValue("");
    this.IsSearch = false;

    this.isButtonVisible = false;
    this.isButtonVisibleADL2 = false;
    this.isButtonVisibleADL3 = false;
    this.isButtonVisibleSupplier = false;
    this.isButtonVisibleGRNNo = false;
    this.isButtonVisibleSerialNo = false;
    this.isButtonVisibleITSerialNo = false;
    this.isButtonVisiblePONumber = false;
    this.isButtonVisibleEqipmentNumber = false;
    this.isButtonVisibleCPPNumber = false;
    this.isButtonVisibleBarCode = false;
  }
  openExportPopup(){
    let title = 'Export';
    const dialogRef = this.dialog.open(ExportFieldsComponent, {
      width: '60vw',
      height: 'auto',
      data: { title: title, payload: this.ListOfField }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {           
        this.ExportedFields = result;
        //this.ExportedFields = this.ExportedFields.filter(x => x.IsForDefault == true).map(choice => choice.FieldName);   
        this.ExportedFields = this.ExportedFields.filter(x => x.Custom2 == "1").map(choice => choice.Custom1);
        this.clickToExport();     
      }
    })
  }
  registerflag :boolean =false;
  SelectionColumn(ele , item){
    debugger;
    this.registerflag =false;
    item.Condition = "";
    item.HighValue ="";
    item.LowValue ="";
    item.fieldname = ele.FieldName;
    if(item.fieldname == "Register")
    {
      this.registerflag =true;
    }
    item.OptionType = ele.SearchOptionType;
    this.ListOfField.forEach(val => {
      if(val.FieldName == ele.FieldName){
        item.Tablename = val.Tables;
      }
    })
  }
  showmultiSearch:any=false;
  multiSearchAdd(){
    debugger;
    this.showmultiSearch = !this.showmultiSearch;
    this.multiSearch = [];
    if(!!this.showmultiSearch)
        this.addSearch();
  }

  addSearch() {
    var data = {
      fieldname: '',
      Tablename: '',
      Condition: '',
      HighValue:'',
      LowValue:''
    }
    this.multiSearch.push(data);
    this.onChangeAdvancedSearch();  
  } 
  multipleserach : boolean= false;
  onMultiSearchClick(){

      debugger;
      if(this.searchCount == 0){
        this.toastr.warning(`Please Select All Fields`, this.message.AssetrakSays);
        return null;
       }
       else{
      this.multipleserach= true ;
      this.AssetallocationBindData("multiplesearch");
      console.log(this.multiSearch);
       }

  }
  removeSearch(idx){
    this.multiSearch.splice(idx , 1);
    this.onChangeAdvancedSearch(); 
  }
  hideSearch : boolean = false;
  searchCount : any = 0;
  clearSearchData(){
    this.showmultiSearch = !this.showmultiSearch;
    this.multiSearch = [];
    if(!!this.hideSearch)
      this.AssetallocationBindData("");
  }
  onChangeAdvancedSearch(){
    debugger;
    this.searchCount = 0;
    this.hideSearch = false;
    this.multiSearch.forEach(val => {
      if(val.Condition == "IN"){
        if(!!val.HighValue){
          this.hideSearch = true;
          this.searchCount = this.searchCount + 1;
        }
      }
      else{
      if( val.fieldname == 'AcquisitionDate' || val.fieldname =='WDVDate')
      {
        if(!!val.HighValue && !!val.LowValue ){
          this.hideSearch = true;
          this.searchCount = this.searchCount + 1;
        }
      }
      else if(val.fieldname == 'AssetId')
      {
        if(!!val.HighValue ){
          this.hideSearch = true;
          this.searchCount = this.searchCount + 1;
        }
      }
      else{
      var s = val.HighValue;
       s = s.replace(/,/g, '');
      if(!!val.HighValue){
        this.hideSearch = true;
        this.searchCount = this.searchCount + 1;
      }
      val.HighValue = s;  
    }
  }
  
    })
  }
  Onchange(){
    this.showmultiSearch = false;
   }
  setStep() {	
    this.panelOpenState = true; 	
  }	
  changeState() {	
     	
    this.panelOpenState = false;	
  }
  openMultiSearchDialog(val:any){	
    let title = 'Create list of values to search';	
    const dialogRef = this.dialog.open(MultiSearchDialogComponent, {	
      width: 'auto',	
      height: 'auto',	
      data: { title: title, payload: '' }	
    })	
    dialogRef.afterClosed().subscribe(result => {	
      debugger;
      if (!!result) {           	
        console.log(result)	
        // if(result.length>1)	
        // val.HighValue = result[0].name+','+result[1].name+'...';	
        // else val.HighValue = result[0].name;
        val.HighValue ="";	
        if(result.length>1){
         var i=0;
        for( i=0;i<result.length;i++){ 
        if(val.HighValue!='')
        val.HighValue = val.HighValue+","+result[i].name ;
        else
        val.HighValue = result[i].name ;
      }
      }
         else val.HighValue = result[0].name;	
      }	
      this.onChangeAdvancedSearch();
    })	
  }	
  startdate: any;
  newdate:any;
  Enddate: any;
  changeStartDate(dateEvent4) {
    debugger;
    // this.insuranceStartDate.emit(dateEvent3.value);
    this.startdate = new Date(dateEvent4.value);
    this.Enddate = new Date( this.startdate);
    this.onChangeAdvancedSearch();
  }
  changeEndDate(dateEvent4) {
    debugger;
    this.insuranceEndDate.emit(dateEvent4.value);
    this.onChangeAdvancedSearch();
  }
  clearInput(val:any){	
    val.HighValue = '';	
  }
}
