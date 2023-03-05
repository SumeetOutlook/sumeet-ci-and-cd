import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild,Output,EventEmitter } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { ReportService } from 'app/components/services/ReportService';
import { GetFieldsComponent } from 'app/components/partialView/get-fields/get-fields.component'
import { LocalStoreService } from 'app/shared/services/local-store.service';
import { assetTabsComponent } from '../../partialView/assetDetails/asset_tabs.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssetService } from '../../services/AssetService';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { ToastrService } from 'ngx-toastr';
import { CompanyBlockService } from '../../services/CompanyBlockService';
import { GroupService } from '../../services/GroupService';
import { CompanyLocationService } from '../../services/CompanyLocationService';
import { UserService } from '../../services/UserService';
import { Router, ActivatedRoute } from '@angular/router';
import { AllPathService } from 'app/components/services/AllPathServices';
import * as menuheaders from '../../../../assets/MenuHeaders.json'
import { ExportFieldsComponent } from 'app/components/partialView/export-fields/export-fields.component';
import { ComponentSplitDialogComponent } from '../dialog/component-split-dialog/component-split-dialog.component';
import { CreateGroupDialogComponent } from '../dialog/create-group-dialog/create-group-dialog.component';
import { GroupDetailsComponent } from 'app/components/partialView/group-details/group-details.component';
//import { NavigationService } from '../../services/navigation.service';
import { MultiSearchDialogComponent } from 'app/components/partialView/multi-search-dialog/multi-search-dialog.component';


interface AssetType {
  id: string;
  name: string;
}
interface UOM {
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
  selector: 'app-assetrelationship',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss']
})
export class AssetRelationshipComponent implements OnInit, AfterViewInit, OnDestroy {

  Headers: any;
  message: any;

  HeaderLayerText: any;
  numRows: number;
  selectedValue: string;
  selectedassetclass: string;
  selectedassettype: string;
  selectedassetuom: string;
  setflag: boolean = false;

 
  //arrBirds: Array<arrBirds> = [];
  public arrBirds: any[];
  panelOpenState = true;
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
  public getSeletedData = [];

  public bindData: any[];
  public assetlength;
  public newLength;
  public arrlength = 0;
  public arr = [];
  public newdataSource = [];
  public isallchk: boolean;
  public getselectedData: any[] = [];
  public selecteddatasource: any[] = [];
  public appliedfilters: any[] = [];
  public sendData;
  menuheader: any = (menuheaders as any).default;
  @Output() insuranceEndDate: EventEmitter<any> = new EventEmitter<any>();
  AssetNoFilter = new FormControl();
  SubNoFilter = new FormControl();
  CapitalizationDateFilter = new FormControl();
  AssetClassFilter = new FormControl();
  AssetTypeFilter = new FormControl();
  AssetSubTypeFilter = new FormControl();
  UOMFilter = new FormControl();
  AssetNameFilter = new FormControl();
  AssetDescriptionFilter = new FormControl();
  QtyFilter = new FormControl();
  LocationFilter = new FormControl();
  CostFilter = new FormControl();
  WDVFilter = new FormControl();
  EquipmentNOFilter = new FormControl();
  AssetConditionFilter = new FormControl();
  AssetCriticalityFilter = new FormControl();


  filteredValues = {
    AssetNo: '', SubNo: '', CapitalizationDate: '',
    AssetClass: '', AssetType: '',
    AssetSubType: '', UOM: '', AssetName: '',
    AssetDescription: '', Qty: '', Cost: '', WDV: '',
    EquipmentNO: '', AssetCondition: '', AssetCriticality: ''

  };
  loadAllAssets = [];
  companyId = '2';
  assetBlockId = '0';
  typeId = '';
  quantitySplitId = '';
  locationId = '0';
  AssetClassIds = '';
  assetTypeIds = '';
  uomValues = '';
  plantIds = '';
  cityIds = '';
  UserId = 5;
  regionId = 1;
  groupId = 2;
  prefarIds = [];
  public city: any[] = [];
  public cityMultiCtrl: any;
  public cityMultiFilterCtrl: FormControl = new FormControl();
  public filteredCityMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public plants: any[] = [];
  public plantMultiCtrl: any;
  public plantMultiFilterCtrl: FormControl = new FormControl();
  public filteredPlantsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public categoryMultiCtrl: any;
  public categoryFilterCtrl: FormControl = new FormControl();
  public filteredcategoryMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public assetclass: any[] = [];
  public assetclassMultiCtrl: any;
  public assetclassFilterCtrl: FormControl = new FormControl();
  public filteredAssetClassMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public assettype: any[] = [];
  public assettypeMultiCtrl: any;
  public assettypeFilterCtrl: FormControl = new FormControl();
  public filteredAssetTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public assetuom: any[] = [];
  public assetuomMultiCtrl: any;
  public assetuomFilterCtrl: FormControl = new FormControl();
  public filteredAssetUomMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public assetSubTypes = [];


  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  protected _onDestroy = new Subject<void>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  displayedColumns: any[] = [];
  dataSource = new MatTableDataSource<any>();
  payloadData = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  tempdatasource: any[] = [];
  quantityList: string[] = [];
  result = [];
  IsCompanyAdmin: any = 1;
  IslayerDisplay: any;
  layerid: any;
  Layertext: any;
  isExport: Boolean = false;
  displayTable: boolean = false;
  displaybtn: boolean = false;

  constructor(
    public dialog: MatDialog,
    public cls: CompanyLocationService,
    public cbs: CompanyBlockService,
    public gs: GroupService,
    public localService: LocalStoreService,
    public assetService: AssetService,
    private readonly snackBar: MatSnackBar,
    private storage: ManagerService,
    public confirmService: AppConfirmService,
    private loader: AppLoaderService,
    public toastr: ToastrService,
    public us: UserService,
    public alertService: MessageAlertService,
    private router: Router,
    public AllPathService: AllPathService,
    public reportService: ReportService,
    private jwtAuth: JwtAuthService,
    //private navService: NavigationService
    ){
       this.Headers = this.jwtAuth.getHeaders();
       this.message = this.jwtAuth.getResources();
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

  paginationParams: any;
  fileDownloadPath: any;
  private readonly setting = {
    element: { dynamicDownload: <unknown>null as HTMLElement }
  };
  ngOnInit(): void {
    this.loader.open();
    this.paginationParams = {
      pageSize: 50,
      currentPageIndex: 0,
      endIndex: 0,
      startIndex: 0,
      totalCount: 0,
    }
    this.groupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.regionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.companyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
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

    this.cityMultiCtrl = "";
    this.plantMultiCtrl = "";
    this.categoryMultiCtrl = "";
    this.assetuomMultiCtrl = "";

    this.GetInitiatedFieldData();
    this.GetInitiatedData();
    this.paginator._intl.itemsPerPageLabel = 'Records per page';

    this.filteredAssetClassMulti.next(this.assetclass.slice());
    this.assetclassFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAssetclassMulti();
      });

    this.filteredAssetTypeMulti.next(this.assettype.slice());
    this.assettypeFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAssettypeMulti();
      });


    this.filteredAssetUomMulti.next(this.assetuom.slice());
    this.assetuomFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAssetuomMulti();
      });

    // this.AssetNoFilter.valueChanges.subscribe((AssetNoFilterValue) => {
    //   this.filteredValues['AssetNo'] = AssetNoFilterValue;
    //   this.dataSource.filter = this.filteredValues.AssetNo;
    // });

    this.SubNoFilter.valueChanges.subscribe((SubNoFilterValue) => {
      this.filteredValues['SubNo'] = SubNoFilterValue;
      this.dataSource.filter = this.filteredValues.SubNo;
    });

    this.CapitalizationDateFilter.valueChanges.subscribe((CapitalizationDateFilterValue) => {
      this.filteredValues['CapitalizationDate'] = CapitalizationDateFilterValue;

      this.dataSource.filter = this.filteredValues.CapitalizationDate;
    });

    this.AssetClassFilter.valueChanges.subscribe((AssetClassFilterValue) => {
      this.filteredValues['AssetClass'] = AssetClassFilterValue;
      this.dataSource.filter = this.filteredValues.AssetClass;
    });

    this.AssetTypeFilter.valueChanges.subscribe((AssetTypeFilterValue) => {
      this.filteredValues['AssetType'] = AssetTypeFilterValue;
      this.dataSource.filter = this.filteredValues.AssetType;
    });

    this.AssetSubTypeFilter.valueChanges.subscribe((AssetSubTypeFilterValue) => {
      this.filteredValues['AssetSubType'] = AssetSubTypeFilterValue;
      this.dataSource.filter = this.filteredValues.AssetSubType;
    });

    this.UOMFilter.valueChanges.subscribe((UOMFilterValue) => {
      this.filteredValues['UOM'] = UOMFilterValue;
      this.dataSource.filter = this.filteredValues.UOM;
    });

    this.AssetNameFilter.valueChanges.subscribe((AssetNameFilterValue) => {
      this.filteredValues['AssetName'] = AssetNameFilterValue;
      this.dataSource.filter = this.filteredValues.AssetName;
    });

    this.AssetDescriptionFilter.valueChanges.subscribe((AssetDescriptionFilterValue) => {
      this.filteredValues['AssetDescription'] = AssetDescriptionFilterValue;
      this.dataSource.filter = this.filteredValues.AssetDescription;
    });

    this.QtyFilter.valueChanges.subscribe((QtyFilterValue) => {
      this.filteredValues['Qty'] = QtyFilterValue;
      this.dataSource.filter = this.filteredValues.Qty;
    });

    this.CostFilter.valueChanges.subscribe((CostFilterValue) => {
      this.filteredValues['Cost'] = CostFilterValue;
      this.dataSource.filter = this.filteredValues.Cost;
    });

    this.WDVFilter.valueChanges.subscribe((WDVFilterValue) => {
      this.filteredValues['WDV'] = WDVFilterValue;
      this.dataSource.filter = this.filteredValues.WDV;
    });

    this.EquipmentNOFilter.valueChanges.subscribe((EquipmentNOFilterValue) => {
      this.filteredValues['EquipmentNO'] = EquipmentNOFilterValue;
      this.dataSource.filter = this.filteredValues.EquipmentNO;
    });

    this.AssetConditionFilter.valueChanges.subscribe((AssetConditionFilterValue) => {
      this.filteredValues['AssetCondition'] = AssetConditionFilterValue;
      this.dataSource.filter = this.filteredValues.AssetCondition;
    });

    this.AssetCriticalityFilter.valueChanges.subscribe((AssetCriticalityFilterValue) => {
      this.filteredValues['AssetCriticality'] = AssetCriticalityFilterValue;
      this.dataSource.filter = this.filteredValues.AssetCriticality;
    });

    this.dataSource.filterPredicate = this.customFilterPredicate();
  }


  GetInitiatedFieldData() {

    let url1 = this.assetService.getUomData(this.companyId, this.assetBlockId);
    let url2 = this.assetService.getSubAssets(this.companyId);
    let url3 = this.assetService.typeOfAsset(this.companyId);
    let url4 = this.assetService.getAssetClass(this.groupId, this.UserId, this.companyId, this.regionId);
    forkJoin([url1, url2, url3, url4]).subscribe(results => {
      if (!!results[0]) {
        this.assetuom = JSON.parse(results[0]);
      }
      if (!!results[1]) {
        this.assetSubTypes = JSON.parse(results[1]);
      }
      if (!!results[2]) {
        this.assettype = JSON.parse(results[2]);
      }
      if (!!results[3]) {
        this.assetclass = JSON.parse(results[3]);
      }
    })
  }

  selectRow(element: any, isChecked: boolean) {
    console.log(element);
    if (isChecked) {
      this.quantityList.push(element);
      this.quantitySplitId = element.PreFarId;
      this.prefarIds.push(element.PreFarId);
    } else {
      const index = this.quantityList.indexOf(element);
      this.quantityList.splice(index, 1);
    }
  }

  ListOfLoc: any[] = [];
  ListOfLoc1: any[] = [];
  ListOfSBU: any[] = [];
  ListOfCategory: any[] = [];
  ListOfCategory1: any[] = [];
  ListOfField: any[] = [];
  ListOfField1: any[] = [];
  ListOfFilter: any[] = [];
  ListOfFilterName: any[] = [];
  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  searchColumns: any[] = [];
  GetInitiatedData() {
debugger;
    let url1 = this.cls.GetLocationListByConfiguration(this.groupId, this.UserId, this.companyId, this.regionId, 24);
    let url2 = this.cbs.GetCategoryListByConfiguration(this.groupId, this.UserId, this.companyId, this.regionId, 24);
    let url3 = this.gs.GetFieldListByPageId(24,this.UserId,this.companyId);
    let url4 = this.gs.GetFilterIDlistByPageId(24);
    let url5 = this.us.PermissionRightsByUserIdAndPageId(this.groupId, this.UserId, this.companyId, this.regionId, "24");
   // let url6 = this.gs.GetFieldList(24,this.UserId);
    forkJoin([url1, url2, url3, url4, url5]).subscribe(results => {
      debugger;
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
       console.log(this.displayedColumns);      
       this.displayedColumns = this.displayedColumns.filter(x => x.Custom2== "1" ).map(choice => choice.Custom1);
        console.log(this.displayedColumns);
        this.displayedColumns = ['Select', 'Icon'].concat(this.displayedColumns);
        console.log(this.displayedColumns);
      }
      // if (!!results[5]) {

      //   this.ListOfField1 = JSON.parse(results[5]);
      //   this.searchColumns = this.ListOfField1.filter(x => x.SearchOptionEnabled == true).map(choice => choice);
      // //  this.displayedColumns = this.ListOfField1;  
      // //  console.log(this.displayedColumns);      
      // //  this.displayedColumns = this.displayedColumns.filter(x => x.Custom2== "1" ).map(choice => choice.Custom1);
      // // console.log(this.displayedColumns);
      // //  this.displayedColumns = ['Select', 'Icon'].concat(this.displayedColumns);
      // //  console.log(this.displayedColumns);
      // }
      if (!!results[3]) {
        this.ListOfFilter = JSON.parse(results[3]);
        if (!!this.ListOfFilter) {
          this.ListOfFilter.forEach(x => this.ListOfFilterName.push(x.FilterName));
        }
      }
      if (!!results[4]) {

        this.ListOfPagePermission = JSON.parse(results[4]);
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
      this.loader.close();
      this.GetPageSession();
    })
  }
 
  onchangeSBU(value) {
    this.showmultiSearch = false;
    if (!!value) {
      var list = [];
      if (!!this.cityMultiCtrl && this.cityMultiCtrl.length > 0) {
        this.cityMultiCtrl.forEach(x => {
          this.ListOfLoc = this.ListOfLoc1.filter(y => y[this.Layertext].indexOf(x) > -1);
          this.ListOfLoc.forEach(x => {
            list.push(x);
          })
        })
        this.ListOfLoc = list;
      }
      else {
        this.ListOfLoc = this.ListOfLoc1.filter(y => y);
      }
      this.plantMultiCtrl = "";
      this.getFilterPlantType();
    }
    else {
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

  //====== Bind Data To DataSource========  
  handlePage(pageEvent: PageEvent) {
     
    this.paginationParams.pageSize = pageEvent.pageSize;
    this.paginationParams.currentPageIndex = pageEvent.pageIndex;
    this.paginationParams.endIndex = (this.paginationParams.currentPageIndex + 1) * pageEvent.pageSize;
    this.paginationParams.startIndex = this.paginationParams.currentPageIndex * pageEvent.pageSize;
    if (!!this.variable && !!this.variable) {
      this.GetAssetListBySelectionBindData("SearchText")
    }
    else if(this.multipleserach= true && this.multiSearch.length > 0)
    {
      this.GetAssetListBySelectionBindData("multiplesearch");
    }
    else {
      this.GetAssetListBySelectionBindData("")
    }

  }
  GetAssetListBySelection() {
     
    this.selection.clear();
    this.getclear();
    this.Onchange();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;
    this.GetAssetListBySelectionBindData("OnPageload");
  }

  clickToExport() {
    if(this.displayTable == true && this.dataSource.data.length != 0){
      this.GetAssetListBySelectionBindData("IsExport");
    } else{
      if(this.displayTable == false){
        this.toastr.warning(`No data selected to export`, this.message.AssetrakSays);
        return null;
      }
      else{
        this.toastr.warning(this.message.NoDataAvailable, this.message.AssetrakSays);
        return null;
      }            
    }
  }



  variable3: any[] = [];
  serachtext: any;
  colunname: any;
  IsSearch: boolean = false;
  issort: boolean = false;
  SortType: any;
  multiSearch : any[]=[];
  Searchlist :any[];
  ExportedFields:any[];
  GetAssetListBySelectionBindData(Action) {
    debugger;
    this.loader.open();
    var LocationIdList = [];
    var CategoryIdList = [];
    var BlockIdList = [];
    var TAIdList = [];
    var UnitList = [];

    if (!!this.plantMultiCtrl && this.plantMultiCtrl.length > 0) {
      this.plantMultiCtrl.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }
    else {
      this.ListOfLoc.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }

    if (!!this.categoryMultiCtrl && this.categoryMultiCtrl.length > 0) {
      this.categoryMultiCtrl.forEach(x => {
        CategoryIdList.push(x.AssetCategoryId);
      })
    } else {
      this.ListOfCategory.forEach(x => {
        CategoryIdList.push(x.AssetCategoryId);
      })
    }

    if (!!this.assetclassMultiCtrl) {
      this.assetclassMultiCtrl.forEach(x => {
        BlockIdList.push(x.Id);
      })
    }

    if (!!this.assettypeMultiCtrl) {
      this.assettypeMultiCtrl.forEach(x => {
        TAIdList.push(x.Id);
      })
    }

    if (!!this.assetuomMultiCtrl) {
      this.assetuomMultiCtrl.forEach(x => {
        UnitList.push(x);
      })
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

    const objAsetsParameterDto = {
      UserId: this.UserId,
      CompanyId: this.companyId,
      LocationIdList: LocationIdList,
      AssetStage: "2",
      IsForManageGroup: false,
      ProjectType: "0",
      ProjectId: 0,
      AssetStatus: "0",
      CategoryIdList: CategoryIdList,
      UnitList: UnitList,
      PageName: "ScrutinizeAssets",
      groupTypeList: '',
      TAIdList: TAIdList,
      GroupId: this.groupId,
      pageNo: this.paginationParams.currentPageIndex + 1,
      pageSize: this.paginationParams.pageSize,
      SearchText: this.serachtext,
      IsExport: this.isExport,
      SbuList: '',
      subTypeOfAssetList: "",
      QuantityList: "",
      BlockIdList: "",
      columnName: this.colunname,
      IsSearch: this.IsSearch,
      issorting: this.issort,
      SortType: !!this.issort ? this.SortType : "",
      PageId: 24,
      ismultiplesearch: this.multipleserach,
      Searchlist : this.Searchlist,
      ExportedFields : this.ExportedFields,
      RegionId : this.regionId
    }
    this.assetService.loadAssetListAllData(objAsetsParameterDto).subscribe((response: any) => {
       
      this.loader.close();
      if (Action === 'IsExport') {
        this.AllPathService.DownloadExportFile(response);
      }
      else {
        debugger;
        this.bindData = JSON.parse(response);
        this.paginationParams.totalCount = 0;
        if (!!this.bindData && this.bindData.length > 0) {
          this.paginationParams.totalCount = this.bindData[0].AssetListCount;
          this.paginationParams.endIndex = this.bindData[0].AssetListCount;
          this.displaybtn = true;
          this.displayTable = true;
        }
        else {
          this.displayTable = true;
        }
        this.onChangeDataSource(this.bindData);
        this.SetPageSession();
      }

    });
  }

  private dyanmicDownloadByHtmlTag(arg: { fileName: string, text: string }) {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = 'text/plain';
    element.setAttribute(
      'href',
      `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
    element.setAttribute('download', arg.fileName);

    const event = new MouseEvent('click');
    element.dispatchEvent(event);
  }

  onChangeDataSource(value) {
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.sort = this.sort;
    this.isAllSelected = false;
    var ids = [];

    for (var i = 0; i < this.bindData.length; i++) {
      var idx = this.getselectedIds.indexOf(this.bindData[i].PreFarId);
      if (idx > -1) {
        ids.push(this.bindData[i].PreFarId);
      }
    }
    if (this.bindData.length > 0 && this.bindData.length == ids.length) {
      this.isAllSelected = true;
    }
  }
  numSelected: any = 0;
  getselectedIds: any[] = [];
  isAllSelected: boolean = false;
  DisabledComponentforSAP:boolean = false;
  masterToggle() {
     

    this.isAllSelected = !this.isAllSelected;
    this.selection.clear();
    this.getselectedIds = [];
    this.selectedQtySplitData = [];
    this.btnQuantitySplit = false;
    this.btnGroupAsset = false;
    this.btnSplitAsset = false;
    if (this.isAllSelected == true) {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
    // else {
    //   this.dataSource.data.forEach(row => this.selection.toggle(row));
    // }
    this.numSelected = this.selection.selected.length;
    var flag = 0;
    if (this.numSelected > 0) {
      this.btnGroupAsset = true;
      this.selection.selected.forEach(row => {
        this.getselectedIds.push(row.PreFarId);
        this.selectedQtySplitData.push(row);

        if ((row.Quantity == 0 || row.Quantity == null) || parseInt(row.Quantity) <= 1) {
          flag = 1;
        }

        if ((row.MergeId == 0 || row.MergeId == null) && (row.SplitId == 0 || row.SplitId == null) && (row.MergeId2 == 0 || row.MergeId2 == null) && (row.BlockOfAsset == this.selectedQtySplitData[0].BlockOfAsset)) { }
        else {
          this.btnGroupAsset = false;
        }
        if(row.SplitFlag == true) 
        {
          this.DisabledComponentforSAP = true;
        }
        else
        {
          this.DisabledComponentforSAP = false;
        }
      });
    }

    if (this.selectedQtySplitData.length == 1) {
      if ((parseInt(this.selectedQtySplitData[0].AcquisitionCost) == 0 && parseInt(this.selectedQtySplitData[0].WDV) == 0) || (this.selectedQtySplitData[0].AcquisitionCost == "0" && this.selectedQtySplitData[0].WDV == "0")) {
        this.btnSplitAsset = false;
      }
      else if (this.selectedQtySplitData[0].isDifferentAssetIdsInGroupFlag == false && (this.selectedQtySplitData[0].MergeId2 == 0 || this.selectedQtySplitData[0].MergeId2 == null)) {
        this.btnSplitAsset = true;
      }
    }
    if (flag == 0 && this.selectedQtySplitData.length > 0) {
      this.btnQuantitySplit = true;
    }
  }
  selectedQtySplitData: any[] = [];
  btnQuantitySplit: boolean = false;
  btnGroupAsset: boolean = false;
  btnSplitAsset: boolean = false;
  isSelected(row) {
     
    this.isAllSelected = false;
    this.btnQuantitySplit = false;
    this.btnGroupAsset = false;
    this.btnSplitAsset = false;

    this.selection.toggle(row)
    this.numSelected = this.selection.selected.length;
    var idx = this.getselectedIds.indexOf(row.PreFarId);
    if (idx > -1) {
      this.getselectedIds.splice(idx, 1);
      this.selectedQtySplitData.splice(idx, 1);
    }
    else {
      this.getselectedIds.push(row.PreFarId);
      this.selectedQtySplitData.push(row);
    }
    //==================
    if (this.selectedQtySplitData.length == 1) {
      // if ((this.selectedQtySplitData[0].MergeId == 0 || this.selectedQtySplitData[0].MergeId == null) && (this.selectedQtySplitData[0].SplitId == 0 || this.selectedQtySplitData[0].SplitId == null)) {
      //   this.btnGroupAsset = true;
      // }

      if ((parseInt(this.selectedQtySplitData[0].AcquisitionCost) == 0 && parseInt(this.selectedQtySplitData[0].WDV) == 0) || (this.selectedQtySplitData[0].AcquisitionCost == "0" && this.selectedQtySplitData[0].WDV == "0")) {
        if(this.selectedQtySplitData[0].Flag == 3){
          this.btnSplitAsset = true;
        }else
        {
        this.btnSplitAsset = false;
        }
      }
      else if (this.selectedQtySplitData[0].isDifferentAssetIdsInGroupFlag == false && (this.selectedQtySplitData[0].MergeId2 == 0 || this.selectedQtySplitData[0].MergeId2 == null)) {
        this.btnSplitAsset = true;
      }
    }
    if(row.SplitFlag == true) 
        {
          this.DisabledComponentforSAP = true;
        }
        else
        {
          this.DisabledComponentforSAP = false;
        }
    //========================
    var flag = 0;
    if (this.numSelected > 0) {
      this.btnGroupAsset = true;
      this.selection.selected.forEach(row => {
        if ((row.Quantity == 0 || row.Quantity == null) || parseInt(row.Quantity) <= 1) {
          flag = 1;
        }
        // for group asset
        if ((row.MergeId == 0 || row.MergeId == null) && (row.SplitId == 0 || row.SplitId == null) && (row.MergeId2 == 0 || row.MergeId2 == null) && (row.BlockOfAsset == this.selectedQtySplitData[0].BlockOfAsset)) { }
        else {
          this.btnGroupAsset = false;
        }
      })
    }
     
    if (flag == 0 && this.selectedQtySplitData.length > 0) {
      this.btnQuantitySplit = true;
    }
  }

  SetPageSession() {
     debugger;
    var LocationIdList = [];
    var CategoryIdList = [];
    var BlockIdList = [];
    var TAIdList = [];
    var UnitList = [];
    if (!!this.plantMultiCtrl) {
      this.plantMultiCtrl.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }

    if (!!this.categoryMultiCtrl) {
      this.categoryMultiCtrl.forEach(x => {
        CategoryIdList.push(x.AssetCategoryId);
      })
    }

    if (!!this.assetclassMultiCtrl) {
      this.assetclassMultiCtrl.forEach(x => {
        BlockIdList.push(x.Id);
      })
    }

    if (!!this.assettypeMultiCtrl) {
      this.assettypeMultiCtrl.forEach(x => {
        TAIdList.push(x.Id);
      })
    }

    if (!!this.assetuomMultiCtrl) {
      this.assetuomMultiCtrl.forEach(x => {
        UnitList.push(x);
      })
    }

    var formData = {
      'Pagename': "Define Relationship",
      'SbuList': [],
      'LocationIdList': LocationIdList,
      'CategoryIdList': CategoryIdList,
      'TAIdList': TAIdList,
      'BlockIdList': BlockIdList,
      'UnitList': UnitList
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
      if (this.StorePageSession.Pagename === "Define Relationship") {
        var list = [];
        this.plantMultiCtrl = "";
        this.ListOfLoc.forEach(x => {
           
          if (this.StorePageSession.LocationIdList.indexOf(x.LocationId) > -1) {
            list.push(x);
            this.plantMultiCtrl = list;
          }
        })
        this.categoryMultiCtrl = "";
        list = [];
        this.ListOfCategory.forEach(x => {
          if (this.StorePageSession.CategoryIdList.indexOf(x.AssetCategoryId) > -1) {
            list.push(x);
            this.categoryMultiCtrl = list;
          }
        })

        this.assetuomMultiCtrl = "";
        list = [];
        this.assetuom.forEach(x => {
          if (this.StorePageSession.UnitList.indexOf(x) > -1) {
            list.push(x);
            this.assetuomMultiCtrl = list;
          }
        })

        this.GetAssetListBySelection();
      }
      else {
        localStorage.setItem('PageSession', null);
        this.StorePageSession = "";
      }
    }
  }


  openComponent_Tagging() {

    var LocationId = !!this.plantMultiCtrl ? this.plantMultiCtrl[0].LocationId : 0;
    var BlockName = !!this.assetclassMultiCtrl ? this.assetclassMultiCtrl[0].BlockName : "";
    this.confirmService.confirm({ message: this.message.SendForTagging, title: this.message.AssetrakSays })
      .subscribe(res => {
        if (!!res) {
          var assetsDetails =
          {
            CompanyId: this.companyId,
            LocationId: LocationId,
            LastModifiedBy: this.UserId,
            GroupId: this.groupId,
            BlockName: BlockName,
            TotalCount: 0,
            PrefarIdlist: this.getselectedIds
          }
          this.assetService.sendForTagging(assetsDetails).subscribe(response => {

            var count = JSON.stringify(response);
            if (count == '0') {
              this.toastr.warning(this.message.NoAssetforScrutiny, this.message.AssetrakSays);
            } else if (count != '0') {
              this.toastr.success(this.message.ScrutinySucess, this.message.AssetrakSays);
              this.clearSelected();
            }
            else {
              this.toastr.error(this.message.NotAuthoziedForScrutiny, this.message.AssetrakSays);
            }
          });
        }
      })
  }

  quantitySplit() {
     
   // if (this.selection.selected.length) {
    this.confirmService.confirm({ message: this.message.QuantitySplit, title: this.message.AssetrakSays })
    .subscribe(res => {
      if (!!res) {
      const assetsDetails = {
        CompanyId: this.companyId,
        LastModifiedBy: this.UserId,
        AssetList: this.getselectedIds.join(','),
        GroupId: this.groupId
      };
      this.loader.open();
      this.assetService.quantitySplit(assetsDetails).subscribe(response => {
         
        this.loader.close();
        if (response === 'success') {
          this.toastr.success(this.message.QuantitySplitSucess, this.message.AssetrakSays);
          this.clearSelected();
        }
        else{
        this.toastr.warning(this.message.SelectAssetforQuantitySplit, this.message.AssetrakSays);
        }
      });
    }
    })
    
     
  

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
    this.reportService.GetCategoryRightWiseForReport(this.companyId, this.UserId, PlantList, false, 24).subscribe(r => {
      this.ListOfCategory = [];
      r.forEach(element => {
        // this.ListOfCategory=[];
        this.ListOfCategory.push(element);
        this.getFilterCategoryType();
      });
    })
  }

  openCreate_Group() {
     
    var LocationIdList = [];
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
    let configdata = {
      CompanyId: this.companyId,
      GroupId: this.groupId,
      UserId: this.UserId,
      selected: this.selection.selected,
      LocationIdList: LocationIdList
    }
    let title = 'Create Group';
    let dialogRef: MatDialogRef<any> = this.dialog.open(CreateGroupDialogComponent, {
      data: { title: title, configdata: configdata }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        debugger
        if (!!res) {
          debugger
          this.assetService.groupSplit(res).subscribe(response => {
             
            this.toastr.success(this.message.GroupDoneSuccessfully, this.message.AssetrakSays);           
            this.clearSelected();            
          });
        }
        else{
          this.selection.deselect();
        }
      })
  }
  // GroupDetailsInfo1 :any[]=[];
  // GetSubGroupJson(parentAssets){
  //   this.assetService.GetSubGroupJson(parentAssets).subscribe(response => {
  //      
  //     this.GroupDetailsInfo1 = JSON.parse(response);
  //   });
  // }
  openComponent_Split() {
     
    let configdata = {
      CompanyId: this.companyId,
      GroupId: this.groupId,
      UserId: this.UserId,
      RegionId: this.regionId,
      selected: this.selection.selected
    }
    let title = 'Component Split';
    let dialogRef: MatDialogRef<any> = this.dialog.open(ComponentSplitDialogComponent, {
      data: { title: title, configdata: configdata }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!!res) {
          this.clearSelected();
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
      this.ListOfSBU.filter(x => x.City.toLowerCase().indexOf(search) > -1)
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
    if (!this.ListOfLoc) {
      return;
    }
    let search = this.plantMultiFilterCtrl.value;
    if (!search) {
      this.filteredPlantsMulti.next(this.ListOfLoc.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredPlantsMulti.next(
      this.ListOfLoc.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1)
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

  toggleSelectAll(selectAllValue) {    
    this.plantMultiCtrl = [];
    this.filteredPlantsMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {       
        if (!!selectAllValue.checked) {
          let search = this.plantMultiFilterCtrl.value;
          if(!!search){
            this.ListOfLoc.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1).forEach(element => {
              this.plantMultiCtrl.push(element);
            });
          }
          else{
            this.ListOfLoc.forEach(element => {
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
  toggleSelectAllcategory(selectAllValue) {
    this.categoryMultiCtrl = [];
    this.filteredcategoryMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (!!selectAllValue.checked) {
          let search = this.categoryFilterCtrl.value;
          if(!!search){
            this.ListOfCategory.filter(x => x.AssetCategoryName.toLowerCase().indexOf(search) > -1).forEach(element => {
              this.categoryMultiCtrl.push(element);
            });
          }
          else{
            this.ListOfCategory.forEach(element => {
              this.categoryMultiCtrl.push(element);
            });
          }          
        } else {
          this.categoryMultiCtrl = "";
        }
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
  toggleSelectAllassettype(selectAllValue: boolean) {
    this.filteredAssetTypeMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.assettypeMultiCtrl.patchValue(val);
        } else {
          this.assettypeMultiCtrl.patchValue([]);
        }
      });
  }
  toggleSelectAllassetuom(selectAllValue) {
    this.assetuomMultiCtrl = [];
    this.filteredAssetUomMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (!!selectAllValue.checked) {
          this.assetuom.forEach(element => {
            this.assetuomMultiCtrl.push(element);
          });
        } else {
          this.assetuomMultiCtrl = "";
        }
      });
  }

  protected setInitialValue() { }

  protected filterAssetclassMulti() {
    if (!this.assetclass) {
      return;
    }
    let search = this.assetclassFilterCtrl.value;
    if (!search) {
      this.filteredAssetClassMulti.next(this.assetclass.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredAssetClassMulti.next(
      this.assetclass.filter(assetclass => assetclass.name.toLowerCase().indexOf(search) > -1)
    );
  }
  protected filterAssettypeMulti() {
    if (!this.assettype) {
      return;
    }
    let search = this.assettypeFilterCtrl.value;
    if (!search) {
      this.filteredAssetTypeMulti.next(this.assettype.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredAssetTypeMulti.next(
      this.assettype.filter(assettype => assettype.name.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterAssetuomMulti() {
    if (!this.assetuom) {
      return;
    }
    let search = this.assetuomFilterCtrl.value;
    if (!search) {
      this.filteredAssetUomMulti.next(this.assetuom.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredAssetUomMulti.next(
      this.assetuom.filter(assetuom => assetuom.name.toLowerCase().indexOf(search) > -1)
    );
  }
  PageId=24;
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
      debugger;
      if (!!result) {
        this.ListOfField=[];
        console.log(result);
        this.ListOfField = result;
        console.log(this.ListOfField);
        this.displayedColumns = this.ListOfField;
        console.log(this.displayedColumns);
        this.displayedColumns = this.ListOfField.filter(x => x.Custom2 == "1" ).map(choice => choice.Custom1);
        this.displayedColumns = ['Select', 'Icon'].concat(this.displayedColumns);
        console.log(this.displayedColumns);
      }
    })
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

  clearfilter() {
    if (this.appliedfilters.length > 0) {
      while (this.appliedfilters.length > 0) {
        this.appliedfilters.splice(this.appliedfilters.length - 1);
        console.log(this.appliedfilters);
      }
    }
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.setInitialValue();
  }

  EnableDisable(selectedvalue, index) {
    var idx = this.newdataSource.indexOf(selectedvalue.ID);
    if (idx > -1) {
      this.newdataSource.splice(idx, 1);
      this.getselectedData.splice(idx, 1);
    }
    else {
      this.newdataSource.push(selectedvalue.ID);
      this.getselectedData.push(selectedvalue);
    }
    this.arrlength = this.newdataSource.length;
  }

  viewSelected() {
    this.getclear();
    this.paginationParams.totalCount = this.selection.selected.length;
    this.paginationParams.endIndex = this.selection.selected.length;
    this.onChangeDataSource(this.selection.selected);
  }
  clearSelectedView() {
    this.btnQuantitySplit = false;
    this.btnGroupAsset = false;
    this.btnSplitAsset = false;
    // this.getclear();
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
    this.selectedQtySplitData = [];
    this.GetAssetListBySelectionBindData("");
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

  variable: any;
  variable1: any;
  action: any[] = []
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
      // SearchText=this.AssetNoFilter.value
      //this.action=[this.variable, this.variable1];
      this.GetAssetListBySelectionBindData("SearchText");
    }
  }
  ClearSerch(columnName, isflag) {
     
    this.variable1 = "";
    this.variable = "";
    this.AssetNoFilter.setValue("");
    // this.variable1 = columnName;
    // this.variable = this.AssetNoFilter.value;
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
    else if (columnName == "CPPNumber") { this.isButtonVisibleCPPNumber = !isflag; }
    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;
    this.GetAssetListBySelectionBindData("");
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
     
    this.variable = "";
    this.variable1 = "";
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
  maaz: string;
  sortColumn($event: SqSort) {
     
    if (this.SearchcolumnName != $event.active) {
      if ($event.active != "Select") {
        if ($event.direction == "asc" || $event.direction == "") {
          this.SortType = "asc";
          this.variable1 = $event.active;
          this.GetAssetListBySelectionBindData("Sort")
        } else {
          this.SortType = "desc";
          this.variable1 = $event.active;
          this.GetAssetListBySelectionBindData("Sort")
        }
      }
    }
  }

  openDialog() {
    const dialogconfig = new MatDialogConfig();
  //  dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    dialogconfig.width = "50%";
    //this.dialog.open(DialogExampleComponent, dialogconfig);
  }
  opencomponent() {
    const dialogconfigcom = new MatDialogConfig();
 //   dialogconfigcom.disableClose = true;
    dialogconfigcom.autoFocus = true;
    dialogconfigcom.width = "50%";
    //this.dialog.open(createComponent, dialogconfigcom);
  }
  openInventory() {
    const dialoginventory = new MatDialogConfig();
   // dialoginventory.disableClose = true;
    dialoginventory.autoFocus = true;
    dialoginventory.width = "40%";
    //this.dialog.open(InventoryComponent, dialoginventory);
  }

  openList() {
    const dialogconfig1 = new MatDialogConfig();
 //   dialogconfig1.disableClose = true;
    dialogconfig1.autoFocus = true;
    dialogconfig1.width = "80%";
    //this.dialog.open(Dialog_ExampleComponent, dialogconfig1);
  }
  groupdialg() {
    const dialogconfig2 = new MatDialogConfig();
   // dialogconfig2.disableClose = true;
    dialogconfig2.autoFocus = true;
    dialogconfig2.width = "80%";
  }

  openCommonDialog() {
    const dialogconfigcommon = new MatDialogConfig();
  //  dialogconfigcommon.disableClose = true;
    dialogconfigcommon.autoFocus = true;
    dialogconfigcommon.width = "80%";
  }
  registerflag :boolean =false;
  SelectionColumn(ele , item){
     debugger;
     this.registerflag =false;
     item.Condition = "";
     item.HighValue ="";
     item.LowValue ="";
    item.fieldname = ele.FieldName;
    if(item.fieldname == "RegisterFlag")
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
  removeSearch(idx){
    this.multiSearch.splice(idx , 1);
    this.onChangeAdvancedSearch(); 
  }
  clearSearchData(){
    this.showmultiSearch = !this.showmultiSearch;
    this.multiSearch = [];
    if(!!this.hideSearch)
      this.GetAssetListBySelectionBindData("");
  }
  multipleserach : boolean= false;
  onMultiSearchClick(){
debugger;
       console.log(this.searchCount);
       if(this.searchCount == 0){
        this.toastr.warning(`Please Select All Fields`, this.message.AssetrakSays);
        return null;
       }
       else{
      this.multipleserach= true ;
      this.GetAssetListBySelectionBindData("multiplesearch");
      console.log(this.multiSearch);
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

  setStep() {	
    this.panelOpenState = true; 	
  }	
  changeState() {	
     	
    this.panelOpenState = false;	
  }

  openMultiSearchDialog(val:any){	
    val.HighValue ="";
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
  clearInput(val:any){	
    val.HighValue = '';	
  }

  isSticky (column: string): boolean {
    return (column === 'Select' || column === 'Icon' || column === 'Barcode' || column === 'AssetId' || column ==='SubAssetId') ? true : false;
  }

  toggleSideNav(element) {
    debugger;
    if(!!element.PreFarId){
      //this.navService.selectedPreFarId = element.PreFarId ;
      //this.navService.setShowNav(true);
    }    
  }
  Onchange(){
    this.showmultiSearch = false;
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
  selectionCondition(val){
    val.HighValue ="";
    val.LowValue ="";

  }

}

