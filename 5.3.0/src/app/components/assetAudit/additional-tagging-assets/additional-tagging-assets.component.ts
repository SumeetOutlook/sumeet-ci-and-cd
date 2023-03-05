import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild,HostListener } from '@angular/core';
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
import { Router, ActivatedRoute } from '@angular/router';
import { AllPathService } from 'app/components/services/AllPathServices';
import { GetFieldsComponent } from 'app/components/partialView/get-fields/get-fields.component';
import { Sort } from '@angular/material/sort';
import { FlexAlignStyleBuilder } from '@angular/flex-layout';
import { AuditService } from '../../services/AuditService';
import { ReportService } from 'app/components/services/ReportService';
import { ExportFieldsComponent } from 'app/components/partialView/export-fields/export-fields.component'; 
import { AdditionalRejectPopupComponent } from './additional-reject-popup/additional-reject-popup.component';
import { MultiSearchDialogComponent } from 'app/components/partialView/multi-search-dialog/multi-search-dialog.component'; 

interface AssetStatus {
  id: string;
  name: string;
}
export interface SqSort extends Sort {
  //   /** The id of the column being sorted. */
  // active: string;

  // /** The sort direction. */
  // direction: SortDirection;
  type: string;
}

@Component({
  selector: 'app-additional-tagging-assets',
  templateUrl: './additional-tagging-assets.component.html',
  styleUrls: ['./additional-tagging-assets.component.scss']
})
export class AdditionalTaggingAssetsComponent implements OnInit {

  Headers: any ;
  message: any ;

  numRows: number;
  withoutFilter: any
  selectedValue: string;
  IsDisabled: boolean = true;
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

  filteredValues = {
    AssetNo: '', SubNo: '', CapitalizationDate: '',
    AssetClass: '', AssetType: '',
    AssetSubType: '', UOM: '', AssetName: '',
    AssetDescription: '', Qty: '', Cost: '', WDV: '',
    EquipmentNO: '', AssetCondition: '', AssetCriticality: ''
  };

  transferTypelst: any[] = [];
  result: any[] = [];
  TRANSFERTYPE: any[] = [];
  transfertype: any[] = [];
  CompanyId: any;
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
  hiderejectbtn:boolean =true;
  menuheader: any = (menuheaders as any).default
  public transfertypeMultiCtrl: any;
  public transfertypeFilterCtrl: FormControl = new FormControl();
  public filteredTransferTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public cityMultiCtrl: any;
  public cityMultiFilterCtrl: FormControl = new FormControl();
  public filteredCityMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public plantMultiCtrl: any;
  public plantMultiFilterCtrl: FormControl = new FormControl();
  public filteredPlantsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public categoryMultiCtrl: any;
  public categoryFilterCtrl: FormControl = new FormControl();
  public filteredcategoryMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public assetclassMultiCtrl: any;
  public assetclassFilterCtrl: FormControl = new FormControl();
  public filteredAssetClassMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public assettypeMultiCtrl: any;
  public assettypeFilterCtrl: FormControl = new FormControl();
  public filteredAssetTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public assetsubtypeMultiCtrl: any;
  public assetsubtypeFilterCtrl: FormControl = new FormControl();
  public filteredAssetSubTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public additionalTypeCtrl: any;
  public additionaMultilCtrl: any;
  public additionalTypeFilterCtrl: FormControl = new FormControl();
  public filteradditionalTypeCtrl: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public assetstatusMultiCtrl: any;
  SelectedStatusItems: any;
  public filteredAssetstatusMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public assetstatus: any[] = [
   // { name: 'ALL', id: 'ALL' },
    { name: 'Available for Review', id: 'AvailableforReview' },
    { name: 'Information Pending', id: 'InformationPending' },
     
  ];
  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  protected _onDestroy = new Subject<void>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  //displayedColumns: string[] = ['select', 'InventoryNo', 'AssetNo', 'SubNo', 'CapitalizationDate', 'AssetClass', 'AssetName', 'AssetDescription', 'Qty', 'UOM', 'Cost', 'WDV', 'EquipmentNO', 'AssetCondition', 'AssetCriticality', 'Status'];
  dataSource = new MatTableDataSource<any>();
  displayedColumns: any[] = ['select'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  selection = new SelectionModel<any>(true, []);
  tempdatasource: any[] = [];
  displayTable: boolean = false;
  displaybtn: boolean = false;
  setflag: boolean = false;
  ListOfCategory1: any[];

  constructor(public dialog: MatDialog,
    public rs: ReconciliationService,
    public cls: CompanyLocationService,
    public ums: UserMappingService,
    public cbs: CompanyBlockService,
    public gs: GroupService,
    public AllPath: AllPathService,
    public toastr: ToastrService,
    private storage: ManagerService,
    public confirmService: AppConfirmService,
    private loader: AppLoaderService,
    public us: UserService,
    private router: Router,
    public reportService: ReportService,
    public AllPathService: AllPathService,
    public alertService: MessageAlertService,
    public as: AuditService ,private jwtAuth: JwtAuthService) {
      this.Headers = this.jwtAuth.getHeaders();
	    this.message = this.jwtAuth.getResources();
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
    this.categoryMultiCtrl = "";
    this.plantMultiCtrl ="";
    this.cityMultiCtrl ="";
    this.additionalTypeCtrl ="";
    this.assetstatusMultiCtrl = "ALL";

    this.GetInitiatedData();
    this.filteredAssetstatusMulti.next(this.assetstatus.slice());
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  ListOfField: any[] = [];
  ListOfFilter: any[] = [];
  ListOfFilterName: any[] = [];
  ListOfCategory: any[] = [];
  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  AdditionalTypeList: any[] = [];
  ExportedFields: any[] = [];
  ListOfField1: any[] = [];
  searchColumns: any[] = [];
  GetInitiatedData() {

    let url1 = this.cls.GetLocationListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 31);
    let url2 = this.cbs.GetCategoryListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 31);
    let url3 = this.gs.GetFieldListByPageId(31,this.UserId, this.CompanyId);
    let url4 = this.gs.GetFilterIDlistByPageId(31);
    let url5 = this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.RegionId, "31");
    let url6 = this.as.GetAdditionalType();
     //  let url6 = this.groupservice.GetFieldList(66,this.SessionUserId);
    forkJoin([url1, url2, url3, url4, url5, url6]).subscribe(results => {
      if (!!results[0]) {

        this.ListOfLoc = JSON.parse(results[0]);
        this.ListOfLoc1 = JSON.parse(results[0]);
        this.ListOfSBU = this.UniqueArraybyId(this.ListOfLoc, this.Layertext);
        this.getFilterCityType();
        this.getFilterPlantType();
      }

      if (!!results[1]) {
        this.ListOfCategory = JSON.parse(results[1]);
        this.ListOfCategory1 = JSON.parse(results[1]);
        this.getFilterCategoryType();
      }
      if (!!results[2]) {
        this.ListOfField = JSON.parse(results[2]);
        this.searchColumns = this.ListOfField.filter(x => x.SearchOptionEnabled == true).map(choice => choice);
        this.displayedColumns = this.ListOfField;
        this.displayedColumns = this.displayedColumns.filter(x => x.Custom2 == "1").map(choice => choice.Custom1);
        // var idx = this.displayedColumns.indexOf('Photo');
        // if(idx > -1){
        //   this.displayedColumns.splice(idx,1);
        // }
        this.withoutFilter = this.ListOfField.map(choice => choice.FieldName);
        this.displayedColumns = ['Select'].concat(this.displayedColumns);
        console.log(this.displayedColumns);
      }
      if (!!results[3]) {
        this.ListOfFilter = JSON.parse(results[3]);
        if (!!this.ListOfFilter) {
          this.ListOfFilter.forEach(x => this.ListOfFilterName.push(x.FilterName))
        }
      }
      if (!!results[4]) {
        this.ListOfPagePermission = JSON.parse(results[4]);
        if (this.ListOfPagePermission.length > 0) {
          for (var i = 0; i < this.ListOfPagePermission.length; i++) {
            this.PermissionIdList.push(this.ListOfPagePermission[i].ModulePermissionId);
          }
        }
        else {
          // this.alertService.alert({ message: this.message.NotAuthorisedToAccess, title: this.message.AssetrakSays })
          //   .subscribe(res => {
          //     this.router.navigateByUrl('h/a')
          //   })
        }
      }
      if (!!results[5]) {
        this.AdditionalTypeList = results[5];
        console.log("AdditionalType",this.AdditionalTypeList);
        //this.filteredAssetClassMulti.next(this.categorylist.slice());
      }
                // if (!!results[1]) {

      //   this.ListOfField1 = JSON.parse(results[1]);
      //   this.searchColumns = this.ListOfField1.filter(x => x.SearchOptionEnabled == true).map(choice => choice);
      // }
      this.loader.close();
      //this.GetPageSession();
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

  getFilterTransferType() {
    this.filteredTransferTypeMulti.next(this.transfertype.slice());
    this.transfertypeFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterTransfertypeMulti();
      });
  }
  protected filterTransfertypeMulti() {
    if (!this.transfertype) {
      return;
    }
    let search = this.transfertypeFilterCtrl.value;
    if (!search) {
      this.filteredTransferTypeMulti.next(this.transfertype.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredTransferTypeMulti.next(
      this.transfertype.filter(x => x.DisplayName.toLowerCase().indexOf(search) > -1)
    );
  }
  toggleSelectAlltransfertype(selectAllValue: boolean) {
    this.filteredTransferTypeMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.transfertypeMultiCtrl.patchValue(val);
        } else {
          this.transfertypeMultiCtrl.patchValue([]);
        }
      });
  }


   
  onchangeSBU(value) {
    debugger;
    this.showmultiSearch = false;
    if (!!value) {
      var list = [];
      if (!!this.cityMultiCtrl && this.cityMultiCtrl.length > 0) {
        this.cityMultiCtrl.forEach(x => {
          this.ListOfLoc1 = this.ListOfLoc.filter(y => y[this.Layertext].indexOf(x) > -1);
          this.ListOfLoc1.forEach(x => {
            list.push(x);
          })
        })
        this.ListOfLoc1 = list;
      }
      else {
        this.ListOfLoc1 = this.ListOfLoc.filter(y => y);
      }
      this.plantMultiCtrl = "";
      this.getFilterPlantType();
    }
    else {
      this.ListOfLoc1 = this.ListOfLoc;
      this.plantMultiCtrl = "";
      this.getFilterPlantType();
    }
  }
  //========= City ===========
  checkoutInitiationLocations: any;
  ListOfLoc: any[] = [];
  ListOfLoc1: any[] = [];
  ListOfSBU: any[] = [];

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
      this.ListOfSBU.filter(x => x.Zone.toLowerCase().indexOf(search) > -1)
    );
  }
  limit = 10;
  offset = 0;
  getFilterPlantType() {
    
    this.filteredPlantsMulti.next(this.ListOfLoc1.slice(0, this.offset + this.limit));
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
  getFilterCategoryType() {
    this.filteredcategoryMulti.next(this.ListOfCategory.slice());
    this.categoryFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCategoryMulti();
      });
  }
  protected filterCategoryMulti() {
    if (!this.ListOfCategory) {
      return;
    }
    let search = this.categoryFilterCtrl.value;
    if (!search) {
      this.filteredcategoryMulti.next(this.ListOfCategory.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredcategoryMulti.next(
      this.ListOfCategory.filter(x => x.AssetCategoryName.toLowerCase().indexOf(search) > -1)
    );
  }
  ListOfBlocks: any[] = [];
  CheckRights() {
    this.cbs.GetBlockOfAssetsByCompany(this.CompanyId).subscribe(r1 => {
      this.ListOfBlocks = r1;
      this.getFilterAssetClassType();
    })
  }
  getFilterAssetClassType() {
    this.filteredAssetClassMulti.next(this.ListOfBlocks.slice());
    this.assetclassFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAssetclassMulti();
      });
  }
  protected filterAssetclassMulti() {
    if (!this.ListOfBlocks) {
      return;
    }
    let search = this.assetclassFilterCtrl.value;
    if (!search) {
      this.filteredAssetClassMulti.next(this.ListOfBlocks.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredAssetClassMulti.next(
      this.ListOfBlocks.filter(x => x.BlockName.toLowerCase().indexOf(search) > -1)
    );
  }
  //====== Bind Data To DataSource========  
  handlePage(pageEvent: PageEvent) {

    this.paginationParams.pageSize = pageEvent.pageSize;
    this.paginationParams.currentPageIndex = pageEvent.pageIndex;
    this.paginationParams.endIndex = (this.paginationParams.currentPageIndex + 1) * pageEvent.pageSize;
    this.paginationParams.startIndex = this.paginationParams.currentPageIndex * pageEvent.pageSize;
    if (!!this.variable && !!this.variable) {
      this.GetAdditionalAssetsBindData("SearchText")
    }
    if(this.multipleserach= true && this.multiSearch.length > 0)
    {
      this.GetAdditionalAssetsBindData("multiplesearch");
    }
    else {
      this.GetAdditionalAssetsBindData("")
    }

  }
  GetAdditionalAssets() {
    this.selection.clear();
    this.getclear();
    this.Onchange();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;
    this.GetAdditionalAssetsBindData("OnPageload");
  }

  isExport: Boolean = false;
  IsSearch: boolean = false;
  issort: boolean = false;
  // clickToExport() {
  //   this.GetAdditionalAssetsBindData("IsExport");
  // }
  clickToExport() {
    if(this.displayTable == true && this.dataSource.data.length != 0){
      this.GetAdditionalAssetsBindData("IsExport");
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
  Searchlist :any[];
  GetAdditionalAssetsBindData(Action) {
    debugger;

    var LocationIdList = [];
    var CategoryIdList = [];
    var BlockIdList = [];
    var TAIdList = [];
    var subTypeOfAssetList = [];
    var AdditionalTypeId = [];

    if (!!this.plantMultiCtrl) {
      this.plantMultiCtrl.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }
    else {
      this.ListOfLoc1.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }

    if (!!this.assetclassMultiCtrl) {
      this.assetclassMultiCtrl.forEach(x => {
        BlockIdList.push(x.Id);
      })
    }

    if (!!this.categoryMultiCtrl && this.categoryMultiCtrl.length !=0) {
      this.categoryMultiCtrl.forEach(x => {
        CategoryIdList.push(x.AssetCategoryId);
      })
    }
    else {
      this.ListOfCategory.forEach(x => {
        CategoryIdList.push(x.AssetCategoryId);
      })
    }

    if (!!this.assettypeMultiCtrl) {
      this.assettypeMultiCtrl.forEach(x => {
        TAIdList.push(x.Id);
      })
    }

    if (!!this.assetsubtypeMultiCtrl) {
      this.assetsubtypeMultiCtrl.forEach(x => {
        subTypeOfAssetList.push(x.Id);
      })
    }

    // if (!!this.additionalTypeCtrl) {
    //   this.additionalTypeCtrl.forEach(x => {
    //     AdditionalTypeId.push(x.AdditionalAssetType);
    //   })
    // }

    if (!!this.additionalTypeCtrl) {
        AdditionalTypeId.push(this.additionalTypeCtrl.AdditionalAssetType);
    }
    //===== Sorting and Searching ===
    this.isExport = false;
    this.issort = false;
    this.IsSearch = false;
    this.serachtext = "";
    this.colunname = "";
    this.multipleserach = false;
    if (Action === 'IsExport') {
      this.isExport = true;
    }
    if (Action == "SearchText" && this.variable != "" && !!this.variable && !!this.variable1) {
      this.serachtext = this.variable;
      this.colunname = this.variable1;
      this.IsSearch = true;
    }
    if (Action == "Sort" && !!this.variable1) {
      this.issort = true;
      this.colunname = this.variable1;
    }

    //  if (this.plantMultiCtrl.length == 0) {

    //    this.toastr.warning(`Please Select ${this.Headers.Location}`, this.message.AssetrakSays);
    //    return null;
    //  }
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
    this.loader.open();

    var assetsDetails = {
      CompanyId: this.CompanyId,
      LocationIdList: LocationIdList,
      RegionId: this.RegionId,
      CategoryIdList: CategoryIdList,
      SbuList: [],
      AssetsClassList: [],
      typeOfAssetList: [],
      subTypeOfAssetList: [],
      TagginStatusList: [],
      BlockId: 0,
      AdditionalTypeId: AdditionalTypeId,
      // AdditionalDefault: !!this.additionalTypeCtrl ? this.additionalTypeCtrl[0].Default : false,
      AdditionalDefault: !!this.additionalTypeCtrl ? this.additionalTypeCtrl.Default : false,
      pageNo: this.paginationParams.currentPageIndex + 1,
      pageSize: this.paginationParams.pageSize,
      SearchText: this.serachtext,
      columnName: this.colunname,
      Ispotential: false,
      IsExport: this.isExport,
      PageId: 31,
      GroupId : this.GroupId,
      ExportedFields : this.ExportedFields,
      ismultiplesearch: this.multipleserach,
      Searchlist : this.Searchlist,
      Option: this.SelectedStatusItems,
    };
    this.as.GetPrePrintedAdditionalAssetList(assetsDetails).subscribe(r => {
      debugger;
      this.loader.close();
      if (Action === 'IsExport') {
        this.AllPathService.DownloadExportFile(r);
      }
      else {
        this.bindData = JSON.parse(r);
        console.log(this.bindData)
        this.paginationParams.totalCount = 0;
        if (!!this.bindData && this.bindData.length > 0) {
          this.paginationParams.totalCount = this.bindData.length > 0 ? this.bindData[0].AssetListCount : 0;
          this.displaybtn = true;
          this.displayTable = true;
        }
        else {
          this.displayTable = true;
        }
        this.onChangeDataSource(this.bindData);
        //this.SetPageSession();
      }

    })
  }
  onChangeDataSource(value) 
  {
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.sort = this.sort;
    // this.isAllSelected = false;
    // var ids = [];
    // for (var i = 0; i < this.bindData.length; i++) {
    //   var idx = this.getselectedIds.indexOf(this.bindData[i].PreFarId);
    //   if (idx > -1) {
    //     ids.push(this.bindData[i].PreFarId);
    //   }
    // }
    // if (this.bindData.length > 0 && this.bindData.length == ids.length) {
    //   this.isAllSelected = true;
    // }
  }
  

  PotentialMapPopup() {
    debugger;
    var potentialMatchby = "1";
    if (potentialMatchby == "1") {
      potentialMatchby = "AssetId";
    }
    else if (potentialMatchby == "2") {
      potentialMatchby = "SerialNo";
    }
    else if (potentialMatchby == "3") {
      potentialMatchby = "ItSerialNo";
    }

    var assetsDetails = {
      potentialMatchby: potentialMatchby,
      companyId: this.CompanyId,
      groupId: this.GroupId,
      locationId: !!this.plantMultiCtrl ? this.plantMultiCtrl.LocationId : 0,
      blockId: 0,
      pageNo: 1,
      pageSize: 100,
      searchText: "",
      isSearch: false,
      ispotential: true,
    };
    this.loader.open();
    this.as.GetAssetForPotentialMatchJson(assetsDetails).subscribe(r => {
      debugger;
      this.loader.close();
      var msg = r;
      if (msg == "Potential Match Completed Successfully By AssetId") {
        msg = "Potential Match Completed Successfully";
      }
      else if (msg == "Potential Match Completed Successfully By SerialNo") {
        msg = "Potential Match Completed Successfully";
      }
      else {
        msg = "Potential Match Completed Successfully";
      }
      if (msg != "") {
        this.toastr.success(this.message.PotentialMatchSucess, this.message.AssetrakSays);
      }
      this.clearSelected();
    })
  }

  DeleteAdditionalAssets() {
    if (this.getselectedIds.length == 0) {
      this.toastr.warning(this.message.SelectAsset, this.message.AssetrakSays);
      return null;
    }
    this.confirmService.confirm({ message: this.message.DeleteSelectedAssets, title: this.message.AssetrakSays })
      .subscribe(res => {
        if (!!res) {
          debugger;
          var assetsDetails =
          {
            CompanyId: parseInt(this.CompanyId),
            AssetList: this.getselectedIds.join(',')
          }
          this.loader.open();
          this.as.DeleteAdditionalAssets(assetsDetails).subscribe(r => {
            this.loader.close();
            if (r == "success") {
              this.toastr.success(this.message.AssetDeleteSucess, this.message.AssetrakSays);
            }
            else {
              this.toastr.error(this.message.SessionTimeOutError, this.message.AssetrakSays);
            }
            this.clearSelected();
          })
        }
      })
  }
  SetPageSession() {
    debugger;
    var locationId = 0;
    var LocationIdList = [];
    var CategoryIdList = [];
    var BlockIdList = [];
    var TAIdList = [];
    var subTypeOfAssetList = [];

    if (!!this.plantMultiCtrl) {
      locationId = !!this.plantMultiCtrl ? this.plantMultiCtrl.LocationId : 0;
      LocationIdList.push(locationId);
    }
    else {
      this.ListOfLoc1.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }

    if (!!this.assetclassMultiCtrl) {
      this.assetclassMultiCtrl.forEach(x => {
        BlockIdList.push(x.Id);
      })
    }

    if (!!this.categoryMultiCtrl) {
      this.categoryMultiCtrl.forEach(x => {
        CategoryIdList.push(x.AssetCategoryId);
      })
    }

    if (!!this.assettypeMultiCtrl) {
      this.assettypeMultiCtrl.forEach(x => {
        TAIdList.push(x.Id);
      })
    }

    if (!!this.assetsubtypeMultiCtrl) {
      this.assetsubtypeMultiCtrl.forEach(x => {
        subTypeOfAssetList.push(x.Id);
      })
    }

    var formData = {
      'Pagename': "Initiate Transfer",
      'SbuList': [],
      'LocationIdList': LocationIdList,
      'CategoryIdList': CategoryIdList,
      'AssetsClassList': BlockIdList,
      'typeOfAssetList': TAIdList,
      'subTypeOfAssetList': subTypeOfAssetList,
      'TransferType': !!this.transfertypeMultiCtrl ? this.transfertypeMultiCtrl.Id : 0,
    };

    localStorage.setItem('PageSession', JSON.stringify(formData));
  }
  StorePageSession: any;
  GetPageSession() {
    debugger;
    this.StorePageSession = "";
    if (!!localStorage.getItem('PageSession') && localStorage.getItem('PageSession') != "null") {
      this.StorePageSession = {}
      this.StorePageSession = JSON.parse(localStorage.getItem('PageSession'));
      if (this.StorePageSession.Pagename === "Additional Tagging") {

      }
      else {
        localStorage.setItem('PageSession', null);
        this.StorePageSession = "";
      }
    }
  }

  PageId=31;
  ReportFlag :boolean = false;
  openPopUp(data: any = {}) {
    debugger;
    this.ReportFlag = false;
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
  editGridpop() {

    let title = 'Edit Grid Display';
    const dialogRef = this.dialog.open(GetFieldsComponent, {
      width: '60vw',
      height: 'auto',
      data: { title: title, payload: this.ListOfField }
    })
    dialogRef.afterClosed().subscribe(result => {

      if (!!result) {
        console.log(result)
        this.ListOfField = result;
        this.displayedColumns = this.ListOfField;
        console.log(this.displayedColumns);
        this.displayedColumns = this.ListOfField.filter(x => x.Custom2 == "1" ).map(choice => choice.Custom1);
        this.displayedColumns = ['Select'].concat(this.displayedColumns);
      }
    })
  }

  numSelected: any = 0;
  getselectedIds: any[] = [];
  isAllSelected: boolean = false;
  masterToggle() {
    this.isAllSelected = !this.isAllSelected;
    this.selection.clear();
    this.getselectedIds = [];
    if (this.isAllSelected == true) {
      this.dataSource.data.forEach(row => {
        this.selection.select(row)
      });
    }
    // else {
    //   this.dataSource.data.forEach(row => this.selection.toggle(row));
    // }
    this.numSelected = this.selection.selected.length;
    if (this.numSelected > 0) {
      this.selection.selected.forEach(row => this.getselectedIds.push(row.PrePurId));
    }
  }
  TaggingButton: any[] = [];
  displayrejctbtn :boolean =false;
  isSelected(row) {
    this.isAllSelected = false;
    this.displayrejctbtn = false;
    this.selection.toggle(row)
    this.numSelected = this.selection.selected.length;
    var idx = this.getselectedIds.indexOf(row.PrePurId);
    if (idx > -1) {
      this.getselectedIds.splice(idx, 1);
    }
    else {
      this.getselectedIds.push(row.PrePurId);
    }
    if ( row.RejectFlag == null || row.RejectFlag == false) {
      this.displayrejctbtn = false;
      var idx = this.TaggingButton.indexOf(row.PrePurId);
      if (idx > -1) {
        this.TaggingButton.splice(idx, 1);
        this.getselectedData.splice(idx, 1);
      }
      else {
        this.TaggingButton.push(row.PrePurId);
        this.getselectedData.push(row);
      }
    }
    else{
      this.displayrejctbtn = true;
    }
  }
  // toggleSelectAllCity(selectAllValue: boolean) {
  //   this.filteredCityMulti.pipe(take(1), takeUntil(this._onDestroy))
  //     .subscribe(val => {
  //       if (selectAllValue) {
  //         this.cityMultiCtrl.patchValue(val);
  //       } else {
  //         this.cityMultiCtrl.patchValue([]);
  //       }
  //     });
  // }
  toggleSelectAllCity(selectAllValue) {
    this.cityMultiCtrl = [];
    this.filteredCityMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (!!selectAllValue.checked) {
          this.ListOfSBU.forEach(element => {
            this.cityMultiCtrl.push(element[this.Layertext]);
          });
        } else {
          this.cityMultiCtrl = "";
        }
        this.onchangeSBU('');
      });
  }

  // toggleSelectAll(selectAllValue: boolean) {

  //   this.filteredPlantsMulti.pipe(take(1), takeUntil(this._onDestroy))
  //     .subscribe(val => {
  //       if (selectAllValue) {
  //         this.plantMultiCtrl.patchValue(val);
  //       } else {
  //         this.plantMultiCtrl.patchValue([]);
  //       }
  //     });
  // }
  toggleSelectAll(selectAllValue) {    
    this.plantMultiCtrl = [];
    this.filteredPlantsMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {     
        debugger;  
        if (!!selectAllValue.checked) {
          let search = this.plantMultiFilterCtrl.value;
          if(!!search){
            this.ListOfLoc1.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1).forEach(element => {
              this.plantMultiCtrl.push(element);
            });
          }
          else{
            this.ListOfLoc1.forEach(element => {
              this.plantMultiCtrl.push(element);
            });
          }          
        } else {
          this.plantMultiCtrl = "";
        }
        this.ListOfCategory = this.ListOfCategory1;
        this.getFilterCategoryType();
      });
  }

  toggleSelectAllassetclass(selectAllValue: boolean) {
    this.filteredAssetClassMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.assetclassMultiCtrl.patchValue(val);
        } else {
          this.assetclassMultiCtrl.patchValue([]);
        }
      });
  }

  CategoryGetdata() {
    debugger;
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


    this.reportService.GetCategoryRightWiseForReport(this.CompanyId, this.UserId, PlantList, false, 31).subscribe(r => {
      this.ListOfCategory = [];
      
      r.forEach(element => {
        // this.ListOfCategory=[];
        this.ListOfCategory.push(element);
        this.getFilterCategoryType();
      });
    })
  }

  //  toggleSelectAllcategory(selectAllValue: boolean) {

  //   this.filteredcategoryMulti.pipe(take(1), takeUntil(this._onDestroy))
  //     .subscribe(val => {

  //       if (selectAllValue) {
  //          this.categoryMultiCtrl.patchValue(val);
  //        } else {
  //          this.categoryMultiCtrl.patchValue([]);
  //        }
  //      });
  //  }
   toggleSelectAllcategory(selectAllValue) {
      this.categoryMultiCtrl = [];
      this.filteredcategoryMulti.pipe(take(1), takeUntil(this._onDestroy))
        .subscribe(val => {
          if (!!selectAllValue.checked) {
            this.ListOfCategory.forEach(element => {
              this.categoryMultiCtrl.push(element);
            });
          } else {
            this.categoryMultiCtrl = "";
          }
       });
    }
    mapLocation(element) {
      if (!element.GPS_CoOrdinate) {
  
      } else {
        window.open('https://www.google.com/maps/search/?api=1&query=' + element.GPS_CoOrdinate, '_blank');
      }
    }

  viewSelected() {
    this.getclear();
    this.paginationParams.totalCount = this.selection.selected.length;
    this.paginationParams.endIndex = this.selection.selected.length;
    this.onChangeDataSource(this.selection.selected);
  }
  clearSelectedView() {
    this.selection.clear();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.paginationParams.totalCount = 0;
    if (!!this.bindData && this.bindData.length > 0) {
      this.paginationParams.totalCount = this.bindData[0].AssetListCount;
      this.paginationParams.endIndex = this.bindData[0].AssetListCount;
    }
    this.onChangeDataSource(this.bindData);
  }
  clearSelected() {
    this.selection.clear();
    this.getclear();
    this.numSelected = 0;
    this.getselectedIds = [];
    //this.onChangeDataSource(this.bindData);
    this.GetAdditionalAssetsBindData("")
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
        data.UOM.toString().trim().toLowerCase().indexOf(searchString.UOM.toLowerCase()) !== -1 &&
        data.AssetName.toString().trim().toLowerCase().indexOf(searchString.AssetName.toLowerCase()) !== -1 &&
        data.AssetDescription.toString().trim().toLowerCase().indexOf(searchString.AssetDescription.toLowerCase()) !== -1 &&
        data.Qty.trim().indexOf(searchString.Qty) !== -1 &&
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

  ViewPhoto(b) {
    debugger;
    var filename = b.Photopath;
    var pathName = this.CompanyId + "/PrePrintAdditional/" + b.Photopath; //4_3_2021_42_Untitled.png"; //
    if (filename == "") {
      this.toastr.warning(this.message.DocumentNotFound, this.message.AssetrakSays);
      return false;
    }
    this.AllPath.ViewDocument(pathName);
    return false;
  }

  variable: any;
  variable1: any;
  action: any[] = [];
  SerchAssetid(columnName) {

    var flag = 0;
    this.variable1 = columnName;
    if (!!this.variable) {
      flag = 1;
    }
    this.variable = !this.AssetNoFilter.value ? "" : this.AssetNoFilter.value;
    this.variable = this.variable.trim();
    if (flag == 1 || !!this.variable) {
      this.paginator.pageIndex = 0;
      this.paginationParams.pageSize = 50;
      this.paginationParams.currentPageIndex = 0;
      this.GetAdditionalAssetsBindData("SearchText");
    }

  }
  ClearSerch(columnName, isflag) {
    this.variable1 = "";
    this.variable = "";
    this.AssetNoFilter.setValue("");

    this.SearchcolumnName = "";
    if (columnName == "AssetId") { this.isButtonVisible = !isflag; }
    else if (columnName == "Barcode") { this.isButtonVisibleBarCode = !isflag; }
    else if (columnName == "ADL2") { this.isButtonVisibleADL2 = !isflag; }
    else if (columnName == "ADL3") { this.isButtonVisibleADL3 = !isflag; }
    else if (columnName == "Suplier") { this.isButtonVisibleSupplier = !isflag; }
    else if (columnName == "GRNNo") { this.isButtonVisibleGRNNo = !isflag; }
    else if (columnName == "SerialNo") { this.isButtonVisibleSerialNo = !isflag; }
    else if (columnName == "ITSerialNo") { this.isButtonVisibleITSerialNo = !isflag; }
    else if (columnName == "PONumber") { this.isButtonVisibleITSerialNo = !isflag; }
    else if (columnName == "equipmentNo") { this.isButtonVisibleEqipmentNumber = !isflag; }
    else if (columnName == "CPPNumber") {
      this.isButtonVisibleCPPNumber = !isflag;
    }
    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;
    this.GetAdditionalAssetsBindData("");
  }

  SearchcolumnName: any;
  Serchicon(columnName, isflag) {
    this.getclear();
    this.variable = this.AssetNoFilter.setValue("");
    this.SearchcolumnName = columnName;

    if (columnName == "AssetId") {
      this.isButtonVisible = !isflag;
    }
    else if (columnName == "Barcode") {
      this.isButtonVisibleBarCode = !isflag;
    }
    else if (columnName == "ADL2") {
      this.isButtonVisibleADL2 = !isflag;
    }
    else if (columnName == "ADL3") {
      this.isButtonVisibleADL3 = !isflag;
    }
    else if (columnName == "Suplier") {
      this.isButtonVisibleSupplier = !isflag;
    }
    else if (columnName == "GRNNo") {
      this.isButtonVisibleGRNNo = !isflag;
    }
    else if (columnName == "SerialNo") {
      this.isButtonVisibleSerialNo = !isflag;
    }
    else if (columnName == "ITSerialNo") {
      this.isButtonVisibleITSerialNo = !isflag;
    }
    else if (columnName == "PONumber") {
      this.isButtonVisiblePONumber = !isflag;
    }
    else if (columnName == "equipmentNo") {
      this.isButtonVisibleEqipmentNumber = !isflag;
    }
    else if (columnName == "CPPNumber") {
      this.isButtonVisibleCPPNumber = !isflag;
    }

  }
  getclear() {
    this.variable1 = "";
    this.variable = "";
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
    if (this.SearchcolumnName != $event.active) {
      if ($event.active != "Select") {
        if ($event.direction == "asc" || $event.direction == "") {
          this.GetAdditionalAssetsBindData("")
        } else {
          this.variable1 = $event.active;
          this.GetAdditionalAssetsBindData("Sort")
        }
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
  openApproveRejectDialog() {
    debugger;
   if (this.getselectedIds.length > 0) {
      var component: any
      component = AdditionalRejectPopupComponent;
      const dialogRef = this.dialog.open(component, {
        panelClass: 'group-form-dialog',
        width: '400px',
        disableClose: true,
        data: {
          component1: 'ApproveRejectComponent',
          // value: getValue[0],
          // name: getValue[1],
        },
      });
      dialogRef.afterClosed().subscribe(result => {
        if (!!result) {

          this.ContinueRejectbtn(result);
        }
      });
    }
  }
  ContinueRejectbtn(result) {
    debugger;
    var prefarIds = [];
    const numSelected = this.getselectedIds.length;
    for (var i = 0; i < numSelected; i++) {
      prefarIds.push(this.getselectedIds[i]);
    }
    var AssetsParameterDto = {
      PrepuIds: prefarIds,
      CompanyId:this.CompanyId,
      RejectComment: result,
      createdBy: this.UserId,
     }

    this.as.UpdateRejectCommentOnPreprintAdditional(AssetsParameterDto)
      .subscribe(r => {
        debugger;
        // var msg='';
        // if(r == "success"){
        //   msg = "Information requested successfully.";
        //   this.toastr.success(msg, this.message.AssetrakSays);
        //   return null;
        // }
        var msg = '';
        if (r.startsWith("Success")) {
          var result = r.split(',');
          if (parseInt(result[1]) == this.getselectedIds.length) {
            msg = "Information requested successfully.";
            this.toastr.success(this.message.ReviewAssetRejected, this.message.AssetrakSays);
          }
          else if (parseInt(result[2]) == this.getselectedIds.length) {
            msg = "Information cannot be requested for selected Asset/s.";
            this.toastr.error(this.message.Requestinformationreject, this.message.AssetrakSays);
          }
          else {
            msg = "Information for "+ parseInt(result[1]) +" assets requested successfully and could not be requested for "+ parseInt(result[3]) +" Assets.";
            this.toastr.error(msg, this.message.AssetrakSays);
          }
        }else{
          this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
        }
       
        this.clearSelected();
      });
  }
  // elements = [1];
  // count = 1;
  // @HostListener("window:scroll", [])
  // onScroll(): void {
  //   if (this.bottomReached()) {
  //     this.elements = [...this.elements, this.count++];
  //   }
  // }

  // bottomReached(): boolean {
  //   return (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
  // }
  registerflag :boolean =false;
  SelectionColumn(ele , item){
    debugger;
    this.registerflag =false;
    item.Condition = "";
    item.HighValue ="";
    item.LowValue ="";
   item.fieldname = ele.FieldName;
  //  if(item.fieldname == "Register")
  //  {
  //    this.registerflag =true;
  //  }
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
  if(!!this.showmultiSearch)
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
  this.multiSearch.forEach(val => {
    if(!!val.HighValue){
      this.hideSearch = true;
      this.searchCount = this.searchCount + 1;
    }
  })
 }
 removeSearch(idx){
  this.multiSearch.splice(idx , 1);
  this.onChangeAdvancedSearch(); 
 }
 clearSearchData(){
  this.showmultiSearch = !this.showmultiSearch;
  this.multiSearch = [];
  if(!!this.hideSearch)
    this.GetAdditionalAssetsBindData("");
 }
 multipleserach : boolean= false;
 onMultiSearchClick(){
 
     
    this.multipleserach= true ;
    this.GetAdditionalAssetsBindData("multiplesearch");
    console.log(this.multiSearch);
 
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
      if(result.length>1)	
      val.HighValue = result[0].name+','+result[1].name+'...';	
      else val.HighValue = result[0].name;	
    }	
  })	
 }	
 Onchange(){
  this.showmultiSearch = false;
 }
 clearInput(val:any){	
  val.HighValue = '';	
  val.LowValue = '';
}
Selectstatusbox(event) {
  this.SelectedStatusItems = event;
}
}
