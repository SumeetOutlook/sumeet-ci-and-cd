import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { assetTabsComponent } from '../../partialView/assetDetails/asset_tabs.component';
import { LocalStoreService } from 'app/shared/services/local-store.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AssetService } from '../../services/AssetService';
import { GroupService } from 'app/components/services/GroupService';
import { CompanyService } from 'app/components/services/CompanyService';
import { RegionService } from 'app/components/services/RegionService';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { SbuService } from 'app/components/services/SbuService';
import { LocationService } from 'app/components/services/LocationService';
import { UserRoleService } from 'app/components/services/UserRoleService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AssetClassService } from '../../services/AssetClassService';
import { AssetCategoryService } from 'app/components/services/AssetCategoryService';
import { AssetTypeService } from 'app/components/services/AssetTypeService';
import { AssetSubTypeService } from 'app/components/services/AssetSubTypeService';
import { ReconciliationService } from 'app/components/services/ReconciliationService';
import { ReportService } from 'app/components/services/ReportService';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { CompanyBlockService } from 'app/components/services/CompanyBlockService';
import { GetFieldsComponent } from 'app/components/partialView/get-fields/get-fields.component'
import { AllPathService } from 'app/components/services/AllPathServices';
import * as menuheaders from '../../../../assets/MenuHeaders.json'
import { LongPressDirective } from '@swimlane/ngx-datatable';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { ExportFieldsComponent } from 'app/components/partialView/export-fields/export-fields.component'; 
import { MultiSearchDialogComponent } from 'app/components/partialView/multi-search-dialog/multi-search-dialog.component';
import { ViewuploadDocregisterDialogComponent } from './viewupload-docregister-dialog/viewupload-docregister-dialog.component';
import { CompanyLocationService } from 'app/components/services/CompanyLocationService';
import { Y } from '@angular/cdk/keycodes';
export interface SqSort extends Sort {
  //   /** The id of the column being sorted. */
  // active: string;

  // /** The sort direction. */
  // direction: SortDirection;
  type: string;
}

@Component({
  selector: 'app-asset_register',
  templateUrl: './asset_register.component.html',
  styleUrls: ['./asset_register.component.scss']
})
export class AssetRegisterComponent implements OnInit, AfterViewInit, OnDestroy {
  header: any = [];
  message: any;
  numRows: number;
  show: boolean = false;
  isButtonVisible: boolean = false;
  setflag: boolean = false;
  submitted: boolean = false;
  public arrlength = 0;
  public fil = 0;
  public appliedfilters: any[] = [];
  panelOpenState = true;
  disabledSorting: boolean=false;

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  protected _onDestroy = new Subject<void>();
  menuheader: any = (menuheaders as any).default
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource<any>();

  ReportForm: FormGroup;
  get f1() { return this.ReportForm.controls; };

  SessionGroupId: any;
  SessionRegionId: any;
  SessionCompanyId: any;
  SessionUserId: any;
  isExport: Boolean = false;
  Count: number = 0;
  IsPageLoad: Boolean = false;

  paginationParams: any;
 // resultData: any;
  regionData: any[] = [];
  companyData: any[] = [];
  sbus: any[] = [];
  locations: any[] = [];
  AssetClassData: any[] = [];
  categories: any[] = [];
  typeData: any[] = [];
  subTypeData: any[] = [];
  classData: any[] = [];

  selectedSBUList: any[] = [];
  selectedPlantIdList: any[] = [];

  transferStatus: any[] = [];

  statusList: any[] = [];

  DisplayHeaders: string[] = [this.header.InventoryNumber, this.header.PrefarId, this.header.AID, this.header.SAID, this.header.AcquisitionDate, this.header.AssetClass, this.header.ADL1, this.header.ADL2, this.header.ADL3, this.header.Supplier, this.header.Location, this.header.Quantity, this.header.CostCenter, this.header.Room, this.header.StorageLocation, this.header.UserEmail, this.header.User, this.header.Cost, this.header.WDV, this.header.EqipmentNumber, this.header.AssetCondition, this.header.AssetCriticality, this.header.InventoryIndicator, this.header.Stage, this.header.ThirdPartyName, this.header.VendorLocation, this.header.VendorSentDate, this.header.CheckedOutAsset, this.header.WDVDate, this.header.TransferType, this.header.SerialNo, this.header.UOM, this.header.ITSerialNo, this.header.TransferId, this.header.TransferStatus, this.header.SourceLocation, this.header.DestinationLocation, this.header.PreviousInventoryInfo, this.header.InitiatedBy, this.header.InitiatedOn, this.header.FinancialLevelTransferBy, this.header.FinancialLevelTransferOn, this.header.AssetClassOwner, this.header.SourceBOTime, this.header.DestinationBlockOwner, this.header.DestinationBOTime, this.header.A1, this.header.Approval1On, this.header.A2, this.header.Approval2On, this.header.A3, this.header.Approval3On, this.header.WithdrawBy, this.header.WithdrawOn, this.header.ApprovedDeclinedby, this.header.ApprovedDeclinedOn, this.header.Comment, this.header.TransferDocument, this.header.PhysicalAssetTransferBy, this.header.PhysicalAssetTransferon, this.header.InventoryStatus, this.header.RetirementStatus, this.header.AllocationStatus, this.header.ATF, this.header.SBU];
  displayedColumns: any[] = [];
  displaybtn: boolean = false;
  selection = new SelectionModel<any>(true, []);
  public sbuMultiCtrl: any;
  public sbuMultiFilterCtrl: FormControl = new FormControl();
  public filteredsbuMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public plantMultiCtrl: any;
  public plantMultiFilterCtrl: FormControl = new FormControl();
  public filteredPlantsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public categoryMultiCtrl: any;
  public categoryMultiFilterCtrl: FormControl = new FormControl();
  public filteredCategorysMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public statusMultiCtrl: FormControl = new FormControl();
  public statusMultiFilterCtrl: FormControl = new FormControl();
  public filteredStatusMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public classMultiCtrl: FormControl = new FormControl();
  public classFilterCtrl: FormControl = new FormControl();
  public filteredclassMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(private cbs: CompanyBlockService, public dialog: MatDialog, private httpService: HttpClient, public localService: LocalStoreService, public datepipe: DatePipe,
    public groupservice: GroupService,
    public companyservice: CompanyService,
    public toastr: ToastrService,
    public regionservice: RegionService,
    private storage: ManagerService,
    public sbuService: SbuService,
    public locationService: LocationService,
    private userRoleService: UserRoleService,
    private fb: FormBuilder,
    private assetClassService: AssetClassService,
    public categoryservice: AssetCategoryService,
    public typeservice: AssetTypeService,
    public subTypeservice: AssetSubTypeService,
    public reconciliationService: ReconciliationService,
    public reportService: ReportService,
    private loader: AppLoaderService,
    public AllPathService: AllPathService,
    private jwtAuth: JwtAuthService,
    public cls: CompanyLocationService
    ){
       this.header = this.jwtAuth.getHeaders();
       this.message = this.jwtAuth.getResources();
       this.transferStatus = [
        { value: "0", name: this.header.All },
        { value: "2", name: this.header.Componentization },
        { value: "3", name: this.header.PrintDetails },
        // { value: "4", name: this.header.GenerateBarcode },
        // { value: "5", name: this.header.AvailableForTagging },
        // { value: "6", name: this.header.PendingPrintLabels },
        { value: "7", name: this.header.UnderTagging },
        { value: "8", name: this.header.AvailableForInventory },
        { value: "9", name: this.header.UnderInventory }
      ];
    }
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  IslayerDisplay: any;
  layerid: any;
  Layertext: any;
  HeaderLayerText: any;
  
  ngOnInit(): void {
    debugger;

    this.loader.open();
    this.SessionGroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.SessionRegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.SessionCompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.SessionUserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);

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

    this.ReportForm = this.fb.group({
      sbuMultiCtrl: [''],
      plantMultiCtrl: [''],
      categoryMultiCtrl: [''],
      statusMultiCtrl: [''],
      classMultiCtrl: [''],
      sbuMultiFilterCtrl: [''],
      plantMultiFilterCtrl: [''],
      categoryMultiFilterCtrl: [''],
      statusMultiFilterCtrl: [''],
      classFilterCtrl: [''],

    });
    this.paginationParams = {
      pageSize: 50,
      currentPageIndex: 0,
      endIndex: 0,
      startIndex: 0,
      totalCount: 0,
    }
    this.SBUGetdata();
    this.LocationGetdata();
    this.CategoryGetdata();
    //this.AssetClassGetdata();
    this.TransferStatusGetdata();
    this.GetInitiatedData();
    this.addSearch();
    this.loader.close();
  }

  variable: any;
  handlePage(pageEvent: PageEvent) {
    this.IsPageLoad = false;
    this.paginationParams.pageSize = pageEvent.pageSize;
    this.paginationParams.currentPageIndex = pageEvent.pageIndex;
    this.paginationParams.endIndex = (this.paginationParams.currentPageIndex + 1) * pageEvent.pageSize;
    this.paginationParams.startIndex = this.paginationParams.currentPageIndex * pageEvent.pageSize;
    if (!!this.variable && !!this.variable){
    this.getTransferInProcessData("SearchText"); 
    }
    else if(this.multipleserach= true && this.multiSearch.length > 0)
    {
      this.getTransferInProcessData("multiplesearch");
    }
    else{
      this.getTransferInProcessData("")
    }
  }

  // clickToExport() {
  //   this.getTransferInProcessData("IsExport");
  // }
  clickToExport() {
    if(this.displayTable == true && this.dataSource.data.length != 0){
      this.getTransferInProcessData("IsExport");
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

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    //this.dataSource.paginator = this.paginator;
  }

  viewSelected() {

  }

  clearSelected() {

  }

  clearfilter() {

  }

  showTable(event) {
    debugger
    // if(event.eventPhase==2)
    // return;
    this.IsPageLoad = true;
    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;
    this.getclear();
    this.Onchange();
    this.HideAddVanceSerch =true;
    this.getTransferInProcessData("");
    this.show = true;
  }

  opentablePopup(columnName) {

    const dialogconfigcom = new MatDialogConfig();
    dialogconfigcom.disableClose = true;
    dialogconfigcom.autoFocus = true;
    dialogconfigcom.width = "45%";
  }

  openFilter_PopUp() {
  }

  openEditGridDisplay() {
  }

  ListOfSBU :any[] =[];
  SBUGetdata() {

    this.sbus = [];
    this.selectedSBUList = [];
    this.ReportForm.controls['sbuMultiCtrl'].setValue("");
    var companyId = this.SessionCompanyId;
    //this.userRoleService.GetAllSBU(companyId).subscribe(r => {
   this.cls.GetLocationListByConfiguration(this.SessionGroupId, this.SessionUserId, this.SessionCompanyId, this.SessionRegionId, 58).subscribe(r => {

       this.ListOfSBU = JSON.parse(r);
      this.sbus = this.UniqueArraybyId(this.ListOfSBU, this.Layertext);
  
        this.getFilterSBUUS();
    })
  }

  getFilterSBUUS() {

    this.filteredsbuMulti.next(this.sbus.slice());
    this.ReportForm.controls['sbuMultiFilterCtrl'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {

        this.filterSBUMulti();
      });
  }

  protected filterSBUMulti() {
    if (!this.sbus) {
      return;
    }
    let search = this.ReportForm.controls['sbuMultiFilterCtrl'].value;
    if (!search) {
      this.filteredsbuMulti.next(this.sbus.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredsbuMulti.next(
      this.sbus.filter(x => x.Zone.toLowerCase().indexOf(search) > -1)
    );
  }

  onChangeSBU(name) {
    debugger;
    this.showmultiSearch = false;
    var idx = this.selectedSBUList.indexOf(name);
    if (idx > -1) {
      this.selectedSBUList.splice(idx, 1);
    }
    else {
      this.selectedSBUList.push(name);
    }
    this.LocationGetdata();
  }


  LocationGetdata() {
    debugger;
    this.locations = [];
    this.filteredPlantsMulti = new ReplaySubject<any[]>(1);
    this.selectedPlantIdList = [];
    this.ReportForm.controls['plantMultiCtrl'].setValue("");
    var companyId = this.SessionCompanyId;
    var userId = this.SessionUserId;
    var IsGroupRegion = false;
    var SBUList = !!this.selectedSBUList ? this.selectedSBUList.join(',') : "";
    var moduleId = 58;
    this.reportService.GetLocationRightWiseForReport(companyId, userId, IsGroupRegion, SBUList, moduleId).subscribe(r => {
      debugger;
      r.forEach(element => {
        this.locations.push(element)
        this.getFilterLocations();
      });
      // this.getFilterLocations();
    })
  }

  getFilterLocations() {

    this.filteredPlantsMulti.next(this.locations.slice());
    this.ReportForm.controls['plantMultiFilterCtrl'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {

        this.filterPlantsMulti();
      });
  }

  onChangePlant(plantId) {
    this.showmultiSearch = false;
    var idx = this.selectedPlantIdList.indexOf(plantId);
    if (idx > -1) {
      this.selectedPlantIdList.splice(idx, 1);
    }
    else {
      this.selectedPlantIdList.push(plantId);
    }
    this.CategoryGetdata();
  }

  protected filterPlantsMulti() {
    if (!this.locations) {
      return;
    }
    let search = this.ReportForm.controls['plantMultiFilterCtrl'].value;
    if (!search) {
      this.filteredPlantsMulti.next(this.locations.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredPlantsMulti.next(
      this.locations.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1)
    );
  }


  CategoryGetdata() {

    this.categories = [];
    this.ReportForm.controls['categoryMultiCtrl'].setValue("");
    var companyId = this.SessionCompanyId;
    var userId = this.SessionUserId;
    var IsGroupRegion = false;
    var PlantList = !!this.selectedPlantIdList ? this.selectedPlantIdList.join(',') : "";
    var moduleId = 58;
    // this.userRoleService.GetAllCategory(companyId).subscribe(r => {
    this.reportService.GetCategoryRightWiseForReport(companyId, userId, PlantList, IsGroupRegion, moduleId).subscribe(r => {

      r.forEach(element => {
        this.categories.push(element)
        this.getFilterCategory();
      });
      this.AssetClassGetdatabyCatId();
    })
  }

  getFilterCategory() {

    this.filteredCategorysMulti.next(this.categories.slice());
    this.ReportForm.controls['categoryMultiFilterCtrl'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {

        this.filterCategoryMulti();
      });
  }

  protected filterCategoryMulti() {
    if (!this.categories) {
      return;
    }
    let search = this.ReportForm.controls['categoryMultiFilterCtrl'].value;
    if (!search) {
      this.filteredCategorysMulti.next(this.categories.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCategorysMulti.next(
      this.categories.filter(x => x.AssetCategoryName.toLowerCase().indexOf(search) > -1)
    );
  }


  AssetClassGetdata() {
    this.classData = [];
    this.ReportForm.controls['classMultiCtrl'].setValue("");
    var companyId = this.SessionCompanyId;
    this.cbs.GetBlockOfAssetsByCompany(companyId).subscribe(r => {
    debugger;
      r.forEach(element => {
        
        this.classData.push(element)
        this.getFilterClass();
      });
    })
  }
  blockIdList:any;
  bindData:any;
  AssetClassGetdatabyCatId()
  {
    debugger;
    ///this.categories = [];
    var categoryIdList = [];
      var companyId = this.SessionCompanyId;
      if(this.ReportForm.value.categoryMultiCtrl== "")
      {
        this.categories.forEach(element => {
          categoryIdList.push(element.AssetCategoryId);
        });
      }
      var CompanyBlockDetails = {
        blockIdList : this.ReportForm.value.categoryMultiCtrl==""?categoryIdList:this.ReportForm.value.categoryMultiCtrl,
        CompanyId:this.SessionCompanyId
      }

      // if (!this.ReportForm.value.categoryMultiCtrl) {
      //   this.categories.forEach(x => {
      //     categoryIdList.push(x.AssetCategoryId);
      //   })
      // }
      // else {
  
      //   categoryIdList = this.ReportForm.value.categoryMultiCtrl
      // }
      
      this.cbs.GetBlockOfAssetsByCompanyAssetCategoryId(CompanyBlockDetails).subscribe(r => {
        this.classData = [];
        this.bindData = JSON.parse(r);
        this.bindData.forEach(element => {
        
          this.classData.push(element)
          this.getFilterClass();
        })
      })
  }
  
  getFilterClass() {

    this.filteredclassMulti.next(this.classData.slice());
    this.ReportForm.controls['classFilterCtrl'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {

        this.filterClassMulti();
      });
  }

  protected filterClassMulti() {
    if (!this.classData) {
      return;
    }
    let search = this.ReportForm.controls['classFilterCtrl'].value;
    if (!search) {
      this.filteredclassMulti.next(this.classData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredclassMulti.next(
      this.classData.filter(x => x.BlockName.toLowerCase().indexOf(search) > -1)
    );
  }


  TransferStatusGetdata() {
    this.statusList = [];
    this.ReportForm.controls['statusMultiCtrl'].setValue("");
    this.transferStatus.forEach(element => {
      this.statusList.push(element)
      this.getFilterStatus();
    });
  }
  PageId =58;
  ReportFlag :boolean = false;
  openPopUp(data: any = {}) {
    debugger;
    this.ReportFlag = true;
    this.ListOfField.forEach((element,index)=>{
      if(element.Custom1 =='Document' ) 
        this.ListOfField.splice(index,1);
     });
    let title = 'Add new member';
    var payload = {
      PageId : this.PageId,
      element : data,
      ListOfField : this.ListOfField,
      ReportFlag : this.ReportFlag ,
    }
    const dialogRef = this.dialog.open(assetTabsComponent, {
      width: 'auto',
     
      data: { title: title, payload: payload }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
      })
  }

  getFilterStatus() {

    this.filteredStatusMulti.next(this.statusList.slice());
    this.ReportForm.controls['statusMultiFilterCtrl'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {

        this.filterStatussMulti();
      });
  }

  protected filterStatussMulti() {
    if (!this.statusList) {
      return;
    }
    let search = this.ReportForm.controls['statusMultiFilterCtrl'].value;
    if (!search) {
      this.filteredStatusMulti.next(this.statusList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredStatusMulti.next(
      this.statusList.filter(x => x.name.toLowerCase().indexOf(search) > -1)
    );
  }

  displayTable: boolean = false;
  ExportedFields: any[] = [];
  Searchlist :any[];
  issort: boolean = false;
  SortType: any;
  resultData:any
  ResultData1:any;
  getTransferInProcessData(action) {
    debugger;
    this.loader.open();
   this.Searchlist = [];
    this.multipleserach = false;
    this.issort = false;

    if (action === 'IsExport') {
      this.isExport = true;
    }
    else if (action !== 'IsExport') {
      this.isExport = false;
      //this.onChangeDataSourceC("");
      //this.paginationParams.totalCount = 0;
    }
    var LocationIdList = []
    var categoryIdList = []
    if (!this.ReportForm.value.categoryMultiCtrl) {
      this.categories.forEach(x => {
        categoryIdList.push(x.AssetCategoryId);
      })
    }
    else {

      categoryIdList = this.ReportForm.value.categoryMultiCtrl
    }

    if (!this.ReportForm.value.plantMultiCtrl) {
      this.locations.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }
    else {
      LocationIdList = this.ReportForm.value.plantMultiCtrl
    }
    if (action == "Sort" && !!this.SearchOnColumn) {
      this.issort = true;
    }
    if(action == "OnPageload"){
      this.multipleserach = false;
      this.Searchlist = [];
    }
    if (action == "multiplesearch" && this.multiSearch.length > 0  )
    {
      if(this.multiSearch[0].fieldname != "")
      {
      this.multipleserach = true;
      this.Searchlist = this.multiSearch;
      this.showmultiSearch = !this.showmultiSearch;
      this.selection.clear();
     
      }
    }

    if(this.panelOpenState && this.showmultiSearch && this.displayTable) {
      this.panelOpenState = false;
    }   
    if(LocationIdList.length!=0 && categoryIdList.length != 0)
    {
    var data =
    {
      selectedStatusList: this.ReportForm.value.statusMultiCtrl,
      GroupId: this.SessionGroupId,
      RegionIdList: [this.SessionRegionId],
      CompanyIds: [this.SessionCompanyId],
      IsBaseSelected: true,
      ReportName: "AssetRegisterReport",
      UserId: this.SessionUserId,
      blockIdList: this.ReportForm.value.classMultiCtrl,
      isExport: this.isExport,
      isPageLoad: this.IsPageLoad,
      locationIdList: LocationIdList,
      pageNumber: this.isExport ? 0 : this.paginationParams.currentPageIndex + 1,
      pageSize: this.isExport ? 0 : this.paginationParams.pageSize,
      searchtext: this.IsSearch ? this.SearchText : "",
      searchColumn: !!this.SearchOnColumn ? this.SearchOnColumn : "",
      SBUList: this.ReportForm.value.sbuMultiCtrl,
      CategoryIdList: categoryIdList,
      typeOfAssetList: [],
      subTypeOfAssetList: [],
      blockid: [],
      ExportedFields : this.ExportedFields,
      ismultiplesearch: this.multipleserach,
      Searchlist : this.Searchlist,
      issorting: this.issort,
      SortType: !!this.issort ? this.SortType : "",
      PageId : 58,
    }

    this.reportService.GetTransferInProcessData(data).subscribe(response => {
      // this.reportService.GetTransferInProcessData1(data).subscribe(response => {
      debugger;
      this.loader.close();
      this.resultData = [];
      if (action === 'IsExport') {
        debugger;
        if (!!response) {
          this.AllPathService.DownloadExportFile(response);

        }
      } else {
        if(!!response){
          this.ResultData1 = JSON.parse(response);
          if(!!this.ResultData1.reportholder){
            this.displayTable = true;
            this.displaybtn = true;
            this.resultData = this.ResultData1.reportholder
            this.paginationParams.totalCount = this.ResultData1.reportholder[0].Count;
            this.onChangeDataSourceC(this.resultData);
         //   console.log("Result",this.ResultData1.reportholder)
          }
          else if(this.ResultData1.Table1){
            this.displayTable = true;
            this.displaybtn = true;
            this.resultData = this.ResultData1.Table1
            this.onChangeDataSourceC(this.resultData);
         //   console.log("Result",this.ResultData1.Table1)
            this.paginationParams.totalCount = 0;
          }
          else{
            console.log("Result",this.ResultData1.reportholder)
          }
      }
      //   this.resultData = JSON.parse(response);
      //  // console.log("URL", this.resultData);
      //   this.displayTable = true;
      //   // this.GetCountOfReport();
      //   // this.onChangeDataSourceC(this.resultData.assetregister);
      // }
      if(action=="SearchText")
        {
          this.showmultiSearch = false

        }
        else{
          
          this.displayTable = true;
          
        }
        //this.loader.close();
      }
    })
    }
  
  }

  onChangeDataSourceC(value) {

    this.dataSource = new MatTableDataSource(value);
   // var a =this.dataSource.data.length;
    this.dataSource.sort = this.sort;
  }

  applyFilterC(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleSelectAllSBU(selectAllValue) {
    debugger;
    this.sbuMultiCtrl = [];
    this.filteredsbuMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        debugger;
        if (!!selectAllValue.checked) {
          this.sbus.forEach(element => {
            this.sbuMultiCtrl.push(element[this.Layertext]);
          });
        } else {
          this.sbuMultiCtrl = "";
        }
      });
      this.ReportForm.controls['sbuMultiCtrl'].setValue(this.sbuMultiCtrl);
  }

  toggleSelectPlantAll(selectAllValue) {
    debugger;
    this.plantMultiCtrl = [];
    this.filteredPlantsMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        debugger;
        if (!!selectAllValue.checked) {
          let search = this.ReportForm.controls['plantMultiFilterCtrl'].value;
          if(!!search){
            this.locations.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1).forEach(element => {
              this.plantMultiCtrl.push(element.LocationId);
            });
          }
          else{
            this.locations.forEach(element => {
              this.plantMultiCtrl.push(element.LocationId);
            });
          }          
        } else {
          this.plantMultiCtrl = "";
        }
        this.ReportForm.controls['plantMultiCtrl'].setValue(this.plantMultiCtrl);
      });
  }

  toggleSelectCategoryAll(selectAllValue) {
    debugger;
    this.showmultiSearch = false;
    this.categoryMultiCtrl = [];
    this.filteredCategorysMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        debugger;
        if (!!selectAllValue.checked) {
          let search = this.ReportForm.controls['categoryMultiFilterCtrl'].value;
          if(!!search){
            this.categories.filter(x => x.AssetCategoryName.toLowerCase().indexOf(search) > -1).forEach(element => {
              this.categoryMultiCtrl.push(element.AssetCategoryId);
            });
          }
          else{
            this.categories.forEach(element => {
              this.categoryMultiCtrl.push(element.AssetCategoryId);
            });
          }          
        } else {
          this.categoryMultiCtrl = "";  
        }
        this.ReportForm.controls['categoryMultiCtrl'].setValue(this.categoryMultiCtrl);
      });
  }
  



  //Changes for Page field data and edit grid display

  ListOfField: any[] = [];
  ListOfField1: any[] = [];
  searchColumns: any[] = [];
  GetInitiatedData() {

    let url3 = this.groupservice.GetFieldListByPageId(58,this.SessionUserId,this.SessionCompanyId);
    //let url6 = this.groupservice.GetFieldList(58,this.SessionUserId);
    forkJoin([url3]).subscribe(results => {

      if (!!results[0]) {

        this.ListOfField = JSON.parse(results[0]);
        this.searchColumns = this.ListOfField.filter(x => x.SearchOptionEnabled == true).map(choice => choice);
        this.displayedColumns = this.ListOfField;
        this.displayedColumns = this.displayedColumns.filter(x => x.Custom2 == "1").map(choice => choice.Custom1);
        this.displayedColumns = ['Icon'].concat(this.displayedColumns);
        console.log("Displayed: ", this.displayedColumns)
      }
      // if (!!results[1]) {

      //   this.ListOfField1 = JSON.parse(results[1]);
      //   this.searchColumns = this.ListOfField1.filter(x => x.SearchOptionEnabled == true).map(choice => choice);
      // }
      this.loader.close();
    })
  }

  editGridpop() {
    debugger
    let title = 'Edit Grid Display';
    const dialogRef = this.dialog.open(GetFieldsComponent, {
      width: '60vw',
      height: 'auto',
      data: { title: title, payload: this.ListOfField }
    })
    dialogRef.afterClosed().subscribe(result => {
      debugger
      if (!!result) {
        console.log(result)
        this.ListOfField = result;
        this.displayedColumns = this.ListOfField;
        console.log(this.displayedColumns);
        this.displayedColumns = this.ListOfField.filter(x => x.Custom2 == "1" ).map(choice => choice.Custom1);
        this.displayedColumns = ['Icon'].concat(this.displayedColumns);
      }
    })
  }


  GetCountOfReport() {
    var LocationIdList = []
    var categoryIdList = []
    if (!this.ReportForm.value.categoryMultiCtrl) {
      this.categories.forEach(x => {
        categoryIdList.push(x.AssetCategoryId);
      })
    }
    else {
      categoryIdList = this.ReportForm.value.categoryMultiCtrl
    }

    if (!this.ReportForm.value.plantMultiCtrl) {
      this.locations.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }
    else {
      LocationIdList = this.ReportForm.value.plantMultiCtrl
    }

    var data =
    {
      selectedStatusList: this.ReportForm.value.statusMultiCtrl,
      CompanyIds: [this.SessionCompanyId],
      tableName: "AssetRegisterReport",
      UserId: this.SessionUserId,
      blockIdList: this.ReportForm.value.classMultiCtrl,
      locationIdList: LocationIdList,
      // searchtext: '',
      // searchColumn: '',
      searchtext: this.IsSearch ? this.SearchText : "",
      searchColumn: this.IsSearch ? this.SearchOnColumn : "",
      SBUList: this.ReportForm.value.sbuMultiCtrl,
      CategoryIdList: categoryIdList,
      typeOfAssetList: [],
      subTypeOfAssetList: [],
    }

    this.reportService.GetReportCount(data).subscribe(response => {

      this.Count = response;
      this.paginationParams.totalCount = !!this.Count ? this.Count : 0;
    })
  }


  //Search functionality
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
  SearchText: any;
  SearchOnColumn: any;
  IsSearch: boolean = false;

  AssetNoFilter = new FormControl();


  SerchAssetid(columnName) {
    debugger;
    this.IsPageLoad = false;
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

      this.getTransferInProcessData("SearchText");
    }
  }

  ClearSerch(columnName, isflag) {
    debugger;
    this.IsPageLoad = false;
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

    // this.showTable();
    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;
    this.getclear();
    this.getTransferInProcessData("");
  }


  Serchicon(columnName, isflag) {
    debugger;
    this.SearchOnColumn = "";
    this.SearchText = "";
    this.AssetNoFilter.setValue("");
   // this.IsSearch = false;

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
    if (columnName == "BarCode") { this.isButtonVisibleBarCode = !isflag; }
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

  sortColumn($event: SqSort) {
     debugger;
    // if (this.SearchOnColumn != $event.active) {
    //   if ($event.active != "Select") {
        if ($event.direction == "asc" || $event.direction == "") {
          this.SortType = "ASC";
          this.SearchOnColumn = $event.active;
          if ($event.active!= "AssetId") { this.isButtonVisible = false; }
          if ($event.active != "BarCode") { this.isButtonVisibleBarCode = false; }
          if ($event.active != "ADL2") { this.isButtonVisibleADL2 = false; }
          if ($event.active != "ADL3") { this.isButtonVisibleADL3 = false; }
          if ($event.active != "Suplier") { this.isButtonVisibleSupplier = false; }
          if ($event.active != "GRNNo") { this.isButtonVisibleGRNNo = false; }
          if ($event.active != "SerialNo") { this.isButtonVisibleSerialNo = false; }
          if ($event.active != "ITSerialNo") { this.isButtonVisibleITSerialNo = false; }
          if ($event.active != "PONumber") { this.isButtonVisiblePONumber = false; }
          if ($event.active != "equipmentNo") { this.isButtonVisibleEqipmentNumber = false; }
          if ($event.active!= "CPPNumber") { this.isButtonVisibleCPPNumber = false; }
          if(this.isButtonVisibleBarCode == true ||  this.isButtonVisible ==true ||
            this.isButtonVisibleADL2 == true||
            this.isButtonVisibleADL3 == true|| 
            this.isButtonVisibleSupplier == true|| 
            this.isButtonVisibleGRNNo == true|| 
            this.isButtonVisibleSerialNo == true|| 
            this.isButtonVisibleITSerialNo == true|| 
            this.isButtonVisiblePONumber == true|| 
            this.isButtonVisibleEqipmentNumber == true|| 
            this.isButtonVisibleCPPNumber == true 
             )
          {
            
              this.SearchText = !this.AssetNoFilter.value ? "" : this.AssetNoFilter.value;
              if(!!this.SearchText)
              {

              this.getTransferInProcessData("Sort");
              }
            }
          
          else 
          {
            this.getTransferInProcessData("Sort");
          }
          
        } else {
          this.SortType = "DESC";
          this.SearchOnColumn = $event.active;
          if(this.isButtonVisibleBarCode == true ||  this.isButtonVisible ==true ||
            this.isButtonVisibleADL2 == true||
            this.isButtonVisibleADL3 == true|| 
            this.isButtonVisibleSupplier == true|| 
            this.isButtonVisibleGRNNo == true|| 
            this.isButtonVisibleSerialNo == true|| 
            this.isButtonVisibleITSerialNo == true|| 
            this.isButtonVisiblePONumber == true|| 
            this.isButtonVisibleEqipmentNumber == true|| 
            this.isButtonVisibleCPPNumber == true 
             )
          {
            
            
              this.SearchText = !this.AssetNoFilter.value ? "" : this.AssetNoFilter.value;
              if(!!this.SearchText)
              {

              this.getTransferInProcessData("Sort");
              }
            
          }
          else 
          {
          this.getTransferInProcessData("Sort")
          }
        }
    //   }
    // }
  }

  mapLocation(element) {
    debugger;
    var value = element[this.header['GPS_CoOrdinate']];
    if (!value) {

    } else {
      window.open('https://www.google.com/maps/search/?api=1&query=' + value, '_blank');
    }
  }


  GetRetireIcon(value, type) {

    var groupdata = value;
    var fileNames = groupdata.split('/');

    var MergeId = fileNames[0];
    var prefarid = fileNames[1];
    var PreHistoryId = fileNames[2];
    var ADDL_Tag = fileNames[3];
    var SplitType = fileNames[4];

    if (type == 'Retired') {
      if (PreHistoryId === "9" || PreHistoryId === "Retired") {
        return true;
      }
      else {
        return false;
      }
    }
    if (type == 'Quantity') {
      if (PreHistoryId === "9" || PreHistoryId === "Retired") {
        return false;
      }
      else if (SplitType == "Quantity") {
        return true;
      }
      else {
        return false;
      }
    }
    if (type == 'Parent') {
      if (PreHistoryId === "9" || PreHistoryId === "Retired") {
        return false;
      } else if ((MergeId != "0" && MergeId != null) && (prefarid === MergeId)) {
        return true;
      }
      else if ((ADDL_Tag != "0" && ADDL_Tag != null) && (MergeId === null || MergeId === 0) && (prefarid === ADDL_Tag)) {
        return true;
      }
      else {
        return false;
      }
    }
    if (type == 'Group') {
      if (PreHistoryId === "9" || PreHistoryId === "Retired") {

      }
      else if ((MergeId != "0" && MergeId != null) && (prefarid != MergeId)) {
        return true;
      }
      else if ((ADDL_Tag != "0" && ADDL_Tag != null) && (MergeId === null || MergeId === 0) && (prefarid != ADDL_Tag)) {
        return true;
      }
      else {
        return false;
      }
    }

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
 multiSearch : any[]=[];
 multiSearchAdd(){
  
  this.showmultiSearch = !this.showmultiSearch;
  this.multiSearch = [];
  this.HideAddVanceSerch=true;
  //if(!!this.showmultiSearch)
      this.addSearch();
  
}
hideSearch : boolean = false;
searchCount : any = 0;
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
onChangeAdvancedSearch(){
  this.searchCount = 0;
  this.hideSearch = false;
  this.panelOpenState = true;
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
if( val.fieldname == 'CustodianDetails')
{
  val.Tablename= "assetallocationtable";
  
}
  })
}
removeSearch(idx){
  this.multiSearch.splice(idx , 1);
  this.onChangeAdvancedSearch(); 
}
HideAddVanceSerch :boolean = false;
clearSearchData(){
  this.displaybtn=true;
  //this.showmultiSearch = !this.showmultiSearch;
  this.multiSearch = [];
  if(!!this.hideSearch)
    this.getTransferInProcessData("");
    this.showmultiSearch = false;
    this.HideAddVanceSerch = true;
}
multipleserach : boolean= false;
onMultiSearchClick(){
  debugger;
  
  if(this.searchCount == 0 && this.multiSearch.length==0){

    this.toastr.warning(`Please Select All Fields`, this.message.AssetrakSays);
    return null;
   }
   else if(this.searchCount != 0){
     
    this.multipleserach= true ;
    this.getTransferInProcessData("multiplesearch");
    console.log(this.multiSearch);
    this.getclear();
    this.showmultiSearch=!this.showmultiSearch;
   }
   else
       {
        this.panelOpenState = true;
       }
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
// Onchange(){
//   this.showmultiSearch = false;

// }
viewDocuments(element) {
  debugger;
  // var RetiredId = !!this.retirementIdMultiCtrl ? this.retirementIdMultiCtrl : 0
  this.groupservice.GetEditAssetUploadDocument(element.PrefarId).subscribe(r => {
    
    if (!!r) {
      var documentList = [];
      documentList = JSON.parse(r);
      console.log("Doc", documentList)
      const dialogRef = this.dialog.open(ViewuploadDocregisterDialogComponent, {
        width: '980px',
     
        data: { title: "", payload: documentList }
      });
      dialogRef.afterClosed().subscribe(result => {
        
      })
    }

  })
}
UniqueArraybyId(collection, keyname) {
  var output = [],
    keys = [];

  collection.forEach(item => {
    var key = item[keyname];
    if (keys.indexOf(key) === -1) {
      keys.push(key);
      output.push(item);
    }
  });
  return output;
};
}
/* Revision History
*18/01/2023  AE-2516  Bharti  Updated Condition for no data available in search result
*19/01/2023   AE-2516  Bharti  fix multiple search Condition "Contains (Multiple Value)" logic 
**/