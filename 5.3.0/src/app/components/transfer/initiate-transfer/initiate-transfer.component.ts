import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, HostListener,Output,EventEmitter } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl, FormArray, FormBuilder, FormGroup ,Validators} from '@angular/forms';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { AssetTransferDialogComponent } from '../dialog/asset-transfer-dialog/asset-transfer-dialog.component';
import { AssetTransferVendorDialogComponent } from '../dialog/asset-transfer-vendor-dialog/asset-transfer-vendor-dialog.component';
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
import { GroupDetailsComponent } from 'app/components/partialView/group-details/group-details.component';
import { ReportService } from 'app/components/services/ReportService';
import { ExportFieldsComponent } from 'app/components/partialView/export-fields/export-fields.component';
import { MultiSearchDialogComponent } from 'app/components/partialView/multi-search-dialog/multi-search-dialog.component';
export interface SqSort extends Sort {
  //   /** The id of the column being sorted. */
  // active: string;

  // /** The sort direction. */
  // direction: SortDirection;
  type: string;
}

@Component({
  selector: 'app-initiate-transfer',
  templateUrl: './initiate-transfer.component.html',
  styleUrls: ['./initiate-transfer.component.scss']
})
export class InitiateTransferComponent implements OnInit {

  Headers: any;
  message: any;

  numRows: number;
  withoutFilter: any
  selectedValue: string;
  IsDisabled: boolean = true;
  setflag: boolean = false;
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
  conditionValue: any;
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
  @Output() insuranceEndDate: EventEmitter<any> = new EventEmitter<any>();
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

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  protected _onDestroy = new Subject<void>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ReportForm: FormGroup;

  //displayedColumns: string[] = ['select', 'InventoryNo', 'AssetNo', 'SubNo', 'CapitalizationDate', 'AssetClass', 'AssetName', 'AssetDescription', 'Qty', 'UOM', 'Cost', 'WDV', 'EquipmentNO', 'AssetCondition', 'AssetCriticality', 'Status'];
  dataSource = new MatTableDataSource<any>();
  displayedColumns: any[] = ['select'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  selection = new SelectionModel<any>(true, []);
  tempdatasource: any[] = [];
  displayTable: boolean = false;
  displaybtn: boolean = false;
  multiSearch: any[] = [];
  panelOpenState = true;
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
    public reportService: ReportService,
    private fb: FormBuilder,
    private jwtAuth: JwtAuthService,
  ) {

    this.Headers = this.jwtAuth.getHeaders();
    this.message = this.jwtAuth.getResources();
  }
  hdrs: any;
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

    this.cityMultiCtrl = "";
    this.categoryMultiCtrl = "";
    this.assetclassMultiCtrl = "";

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
     
      plantMultiFilterCtrl : ['', [Validators.required]],
    });
    this.GetTransferTypes();
    this.GetInitiatedData();
    this.CheckRights();
    // this.AssetNoFilter.valueChanges.subscribe((AssetNoFilterValue) => {
    //   this.filteredValues['AssetNo'] = AssetNoFilterValue;
    //   this.dataSource.filter = this.filteredValues.AssetNo;
    // });
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  ListOfField: any[] = [];
  ListOfFilter: any[] = [];
  ListOfFilterName: any[] = [];
  ListOfCategory: any[] = [];
  ListOfCategory1: any[] = [];
  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  ExportedFields: any[] = [];
  searchColumns: any[] = [];
  GetInitiatedData() {

    let url1 = this.cls.GetLocationListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 40);
    let url2 = this.cbs.GetCategoryListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 40);
    let url3 = this.gs.GetFieldListByPageId(40,this.UserId, this.CompanyId);
    let url4 = this.gs.GetFilterIDlistByPageId(40);
    let url5 = this.gs.CheckWetherConfigurationExist(this.GroupId, 24);
    let url6 = this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.RegionId, "40");
    forkJoin([url1, url2, url3, url4, url5, url6]).subscribe(results => {
      if (!!results[0]) {

        this.ListOfLoc = JSON.parse(results[0]);
        this.ListOfLoc1 = this.ListOfLoc;
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
        console.log('binddata', this.ListOfField)
        this.displayedColumns = this.displayedColumns.filter(x => x.Custom2 == "1").map(choice => choice.Custom1);
        this.withoutFilter = this.ListOfField.map(choice => choice.FieldName);
        this.displayedColumns = ['Select', 'Icon'].concat(this.displayedColumns);
      }
      if (!!results[3]) {
        this.ListOfFilter = JSON.parse(results[3]);
        if (!!this.ListOfFilter) {
          this.ListOfFilter.forEach(x => this.ListOfFilterName.push(x.FilterName))
        }
      }
      this.sbutosbunotallowed = results[4];
      if (!!results[5]) {
        this.ListOfPagePermission = JSON.parse(results[5]);
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

  addSearch() {
    var data = {
      fieldname: '',
      Tablename: '',
      Condition: '',
      HighValue: '',
      LowValue: ''
    }
    this.multiSearch.push(data);
    this.onChangeAdvancedSearch();  
  }

  removeSearch(idx){
    this.multiSearch.splice(idx , 1);
    this.onChangeAdvancedSearch(); 
  }
  // removemultipldSearch(idx) {
  //   
  //   // var idx1 = this.multiSearch.indexOf(idx);
  //   // if (idx1 > -1) {
  //   //   this.multiSearch.splice(idx1, 1);
  //   // }
  //   this.multiSearch.splice(idx, 1);
  // }  
  showmultiSearch: any = false;
  multiSearchAdd() {

    this.showmultiSearch = !this.showmultiSearch;
    this.multiSearch = [];
    if(!!this.showmultiSearch)
        this.addSearch();
  }
  multipleserach: boolean = false;
  onMultiSearchClick() {

    debugger;
    if(this.searchCount == 0){
      this.toastr.warning(`Please Select all Fields`, this.message.AssetrakSays);
      return null;
     }
     else{
    this.multipleserach = true;
    this.GetAssetForTransfserBindData("multiplesearch");
    console.log(this.multiSearch);
     }

  }
  // ngAfterViewInit(): void {
  //   this.dataSource.sort = this.sort;
  //   this.dataSource.paginator = this.paginator;
  //   this.setInitialValue();
  // }  
  //========= Transfer Type ===========
  GetTransferTypes() {
    this.rs.GetTransferTypes().subscribe(r => {
      this.result = JSON.parse(r);
      this.transfertype = this.result;
      this.transfertype.forEach(val => {
        if (val.DisplayName == "Location") {
          this.transfertypeMultiCtrl = val;
          this.showDestinationByType();
        }
      })
      this.getFilterTransferType()
    })
  }
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
  showLocation: boolean = true;
  ShowVendor: boolean = true;
  ShowLoan: boolean = true;
  showStorageLocations: boolean = true;
  showCostCenters: boolean = true;
  showDestinationByType() {

    if (!this.transfertypeMultiCtrl) {
      this.showLocation = false;
      this.ListOfLoc1 = [];
      this.ListOfSBU = [];
      return;
    } else {

      if (this.transfertypeMultiCtrl.Type == "Location") {
        this.showLocation = true;
        this.ShowVendor = true;
        this.ShowLoan = true;
      }
      else {
        this.showLocation = false;
        this.ShowVendor = false;
        this.ShowLoan = false;
      }
      if (this.transfertypeMultiCtrl.Type == "Storage Location") {
        this.showStorageLocations = true;
      } else {
        this.showStorageLocations = false;
      }
      if (this.transfertypeMultiCtrl.Type == "Cost Center") {
        this.showCostCenters = true;
      } else {
        this.showCostCenters = false;
      }
    }
    //this.GetLocationById();
    //this.CheckRights();
  }

  onEmpty() {
    this.ListOfLoc1 = this.ListOfLoc
    this.getFilterPlantType();
  }


  onchangeSBU(value) {
    debugger;
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
      this.GetAssetForTransfserBindData("SearchText")
    }
    else if (this.multipleserach = true && this.multiSearch.length > 0) {
      this.GetAssetForTransfserBindData("multiplesearch");
    }
    else {
      this.GetAssetForTransfserBindData("")
    }

  }
  GetAssetForTransfser() {
    this.selection.clear();
    this.getclear();
    this.Onchange()
   this.numSelected = 0;
    this.getselectedIds = [];
    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;
    this.GetAssetForTransfserBindData("OnPageload");
  }

  isExport: Boolean = false;
  IsSearch: boolean = false;
  issort: boolean = false;

  clickToExport() {
    if (this.displayTable == true && this.dataSource.data.length != 0) {
      this.GetAssetForTransfserBindData("IsExport");
    } else {
      if (this.displayTable == false) {
        this.toastr.warning(this.message.NoDataselected, this.message.AssetrakSays);
        return null;
      }
      else {
        this.toastr.warning(this.message.NoDataAvailable, this.message.AssetrakSays);
        return null;
      }
    }
  }
  Searchlist: any[];
  GetAssetForTransfserBindData(Action) {

    debugger;
    var locationId = 0;
    var blockId = 0;
    var CategoryId = 0;
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
    //===== Sorting and Searching ===
    this.isExport = false;
    this.issort = false;
    this.IsSearch = false;
    this.serachtext = "";
    this.colunname = "";
    this.multipleserach = false;
 //   this.showmultiSearch = false;
    this.Searchlist = [];
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
    if (!this.plantMultiCtrl) {

      this.toastr.warning(`Please Select ${this.Headers.Location}`, this.message.AssetrakSays);
      return null;
    }
    
    this.loader.open();
    var assetDetails = {
      CompanyId: this.CompanyId,
      RegionId: this.RegionId,
      SbuList: [],
      LocationIdList: LocationIdList,
      CategoryIdList: CategoryIdList,
      AssetsClassList: BlockIdList,
      typeOfAssetList: TAIdList,
      subTypeOfAssetList: subTypeOfAssetList,
      pageNo: this.paginationParams.currentPageIndex + 1,
      pageSize: this.paginationParams.pageSize,
      // SearchText: '',
      IsSearch: this.IsSearch,
      UserId: this.UserId,
      BlockId: blockId,
      AssetLife: '',
      Flag: 'Checkout Initiation',
      TransferType: !!this.transfertypeMultiCtrl ? this.transfertypeMultiCtrl.Id : 0,
      IsExport: this.isExport,
      SearchText: this.serachtext,
      columnName: this.colunname,
      isfromReinitation: false,
      issorting: this.issort,
      PageId: 40,
      ismultiplesearch: this.multipleserach,
      Searchlist: this.Searchlist,
      ExportedFields: this.ExportedFields,
      GroupId: this.GroupId
    }
    this.rs.GetAssetListToChangeLocation(assetDetails).subscribe(r => {
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
        this.SetPageSession();
      }


    })
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

  SetPageSession() {

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

    this.StorePageSession = "";
    if (!!localStorage.getItem('PageSession') && localStorage.getItem('PageSession') != "null") {
      this.StorePageSession = {}
      this.StorePageSession = JSON.parse(localStorage.getItem('PageSession'));
      if (this.StorePageSession.Pagename === "Initiate Transfer") {
        this.ListOfLoc1.forEach(x => {
          if (this.StorePageSession.LocationIdList.indexOf(x.LocationId) > -1) {
            this.plantMultiCtrl = x;
          }
        })
        this.ListOfCategory.forEach(x => {
          if (this.StorePageSession.CategoryIdList.indexOf(x.AssetCategoryId) > -1) {
            this.categoryMultiCtrl.push(x);
          }
        })
        this.GetAssetForTransfser();
      }
      else {
        localStorage.setItem('PageSession', null);
        this.StorePageSession = "";
      }
    }
  }
  vendorLocations: boolean = false;
  outWardlocations: boolean = true;
  RevertDates: boolean = false;
  uploadDocSHOW: boolean = false;
  outwardType: any;
  Typename: any;
  sbutosbunotallowed: any;
  sbufilter: any;

  openDialog(value) {

    this.uploadDocSHOW = false;

    if (value === "Permanent") {
      this.vendorLocations = false;
      this.outWardlocations = true;
      this.RevertDates = false;
      this.outwardType = (!!this.transfertypeMultiCtrl && this.transfertypeMultiCtrl.Id == "2") ? "PermanentSL" : (!!this.transfertypeMultiCtrl && this.transfertypeMultiCtrl.Id == "3" ? "PermanentCC" : "Permanent");
      this.Typename = 'Relocation';
    }
    else if (value === "Vendor") {
      this.vendorLocations = true;
      this.outWardlocations = false;
      this.RevertDates = true;
      this.outwardType = (!!this.transfertypeMultiCtrl && this.transfertypeMultiCtrl.Id == "2") ? "VendorSL" : (!!this.transfertypeMultiCtrl && this.transfertypeMultiCtrl.Id == "3" ? "VendorCC" : "Vendor");
      this.Typename = 'Vendor'; //'Third Party';      
      //GetToBindDisplayListByType();
    }
    //this.GetLocationsByCompanyIdToBindSelectList();
    this.GetAssetForTransferNew(value);
  }
  PageId =40;
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
        this.displayedColumns = this.displayedColumns.filter(x => x.Custom2 == "1").map(choice => choice.Custom1);
        this.displayedColumns = ['Select', 'Icon'].concat(this.displayedColumns);
      }
    })
  }

  CategoryGetdata() {
    debugger;
    this.showmultiSearch = false;
    var PlantList = [];
    if (!!this.plantMultiCtrl) {
      var locationId = !!this.plantMultiCtrl ? this.plantMultiCtrl.LocationId : 0;
      PlantList.push(locationId);
    }
    else {
      this.ListOfLoc.forEach(x => {
        PlantList.push(x.LocationId);
      })
    }


    this.reportService.GetCategoryRightWiseForReport(this.CompanyId, this.UserId, PlantList, false, 40).subscribe(r => {
      this.ListOfCategory = [];
      r.forEach(element => {
        // this.ListOfCategory=[];
        this.ListOfCategory.push(element);
        this.getFilterCategoryType();
      });
    })
  }

  GetAssetForTransferNew(value) {

    if (this.selection.selected.length == 0) {
      this.toastr.warning(this.message.SelectAsset, this.message.AssetrakSays);
      return null;
    }

    var prefarIds = [];
    var bindData = [];
    const numSelected = this.selection.selected.length;
    for (var i = 0; i < numSelected; i++) {

      if (this.selection.selected[i].MergeId > 0 || this.selection.selected[i].MergeId2 > 0) {
        prefarIds.push(this.selection.selected[i].PreFarId);
      }
      else {
        bindData.push(this.selection.selected[i]);
      }
    }
    let title = '';
    let configdata = {
      layerid: this.layerid,
      CompanyId: this.CompanyId,
      GroupId: this.GroupId,
      LocationId: !!this.plantMultiCtrl ? this.plantMultiCtrl.LocationId : 0,
      UserId: this.UserId,
      BlockId: 0,
      AssetLife: "Checkout Initiation",
      Flag: "Checkout Initiation",
      AssetList: prefarIds.join(','),
      TransferType: !!this.transfertypeMultiCtrl ? this.transfertypeMultiCtrl : 0,
      showLocation: this.showLocation,
      sbutosbunotallowed: this.sbutosbunotallowed,
      showCostCenters: this.showCostCenters,
      showStorageLocations: this.showStorageLocations,
      vendorLocations: this.vendorLocations,
      outWardlocations: this.outWardlocations,
      RevertDates: this.RevertDates,
      outwardType: this.outwardType,
      Typename: this.Typename,
      LocationIdData: !!this.plantMultiCtrl ? this.plantMultiCtrl : 0,
      bindData: bindData,
      getselectedIds: this.getselectedIds,
    }
    var dialogComponent: any;
    if (value === "Permanent") {
      dialogComponent = AssetTransferDialogComponent;
    }
    else {
      dialogComponent = AssetTransferVendorDialogComponent;
    }
    const dialogRef = this.dialog.open(dialogComponent, {
      width: '980px',
      data: { title: title, payload: this.selection.selected, configdata: configdata }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        if (this.transfertypeMultiCtrl.Type === "Location") {
          this.loader.open();
          this.rs.SetOutwardLocationDetailswithDoc(result).subscribe(r => {

            this.loader.close();
            if (!!r) {
              var result = r.split("_");
              var str1 = result[0];
              var str2 = result[1];
              var str2 = str2.split("/");

              if (str1 == "0")    // Asset loaned successfully
              {
                this.toastr.success(this.message.AssetLoanedSuccess, this.message.AssetrakSays);

              } else if (str1 == "1")   //Asset transferred to new location successfully
              {
                this.toastr.success(this.message.AssetTransferredToNewLocation, this.message.AssetrakSays);

              } else if (str1 == "2")    //Asset transfer already initiated for the selected asset.
              {
                this.toastr.warning(this.message.AssetTransferInitiatedSelectedAsset, this.message.AssetrakSays);

              } else if (str1 == "3")        //Destination Block Owner not available for selected assets
              {
                this.toastr.warning(this.message.DestinationBlockOwnerNotAvailable, this.message.AssetrakSays);

              } else if (str1 == "4")   //Source Block Owner not available for selected assets
              {
                this.toastr.warning(this.message.SourceBlockOwnerNotAvailable, this.message.AssetrakSays);

              } else if (str1 == "5")    //Source and Destination Block Owner not available for selected assets
              {
                this.toastr.warning(this.message.SourceAndDestinationBlockOwnNotAvailable, this.message.AssetrakSays);

              } else if (str1 == "6")      //Asset transfer for assets with block owner available initiated
              {
                this.toastr.success(this.message.AssetTransferInitiatedWithBlockowner, this.message.AssetrakSays);

              } else if (str1 == "7")     //Asset transfer initiated successfully
              {
                this.toastr.success(this.message.AssetTransferInitiatedSuccess, this.message.AssetrakSays);

              } else if (str1 == "8")         //Asset Transferred Successfully
              {
                this.toastr.success(this.message.AssetTransferSuccess, this.message.AssetrakSays);
              } else if (str1 == "9")         //Asset Transferred Successfully
              {
                this.toastr.success(this.message.AssetTransferApproveSucess, this.message.AssetrakSays);
              }
              else if (str1 == "Selected assets are already in retirement process.") {
                this.toastr.error(this.message.AssetalredyinRetirementprocess, this.message.AssetrakSays)
              }
            }
            else {
              this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
            }
            this.clearSelected();
          })
        }
        else {
          var ttype = !!this.transfertypeMultiCtrl ? this.transfertypeMultiCtrl.Id : 0;
          var str = ttype == 2 ? "storage location" : "cost center";
          var msg = "Some of the selected assets are having blank " + str + ", Are you sure you want to proceed?";
          this.rs.SetOutwardLocationDetailsCostcenterStorageLocation(result).subscribe(r => {
            if (!!r) {
              var result = r.split("_");
              var str1 = result[0];
              var str2 = result[1];
              var str2 = str2.split("/");
              if (str1 == "0")    // Asset loaned successfully
              {
                this.toastr.success(this.message.AssetLoanedSuccess, this.message.AssetrakSays);

              } else if (str1 == "1")   //Asset transferred to new location successfully
              {
                this.toastr.success(this.message.AssetTransferredToNewLocation, this.message.AssetrakSays);

              } else if (str1 == "2")    //Asset transfer already initiated for the selected asset.
              {
                this.toastr.warning(this.message.AssetTransferInitiatedSelectedAsset, this.message.AssetrakSays);

              } else if (str1 == "3")        //Destination Block Owner not available for selected assets
              {
                this.toastr.warning(this.message.DestinationBlockOwnerNotAvailable, this.message.AssetrakSays);

              } else if (str1 == "4")   //Source Block Owner not available for selected assets
              {
                this.toastr.warning(this.message.SourceBlockOwnerNotAvailable, this.message.AssetrakSays);

              } else if (str1 == "5")    //Source and Destination Block Owner not available for selected assets
              {
                this.toastr.warning(this.message.SourceAndDestinationBlockOwnNotAvailable, this.message.AssetrakSays);

              } else if (str1 == "6")      //Asset transfer for assets with block owner available initiated
              {
                this.toastr.success(this.message.AssetTransferInitiatedWithBlockowner, this.message.AssetrakSays);

              } else if (str1 == "7")     //Asset transfer initiated successfully
              {
                this.toastr.success(this.message.AssetTransferInitiatedSuccess, this.message.AssetrakSays);

              } else if (str1 == "8")         //Asset Transferred Successfully
              {
                this.toastr.success(this.message.AssetTransferSuccess, this.message.AssetrakSays);
              }
              else {
                this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
              }
            }
            else {
              this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
            }
            this.clearSelected();
          })
        }

      }

    });
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
        if (!row.allocatedStatus) {
          this.selection.select(row)
        }
      });
    }
    // else {
    //   this.dataSource.data.forEach(row => this.selection.toggle(row));
    // }
    this.numSelected = this.selection.selected.length;
    if (this.numSelected > 0) {
      this.selection.selected.forEach(row => this.getselectedIds.push(row.PreFarId));
    }
  }

  isSelected(row) {
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
          //this.plantMultiCtrl.patchValue(val);
          this.ListOfLoc.forEach(element => {
            this.plantMultiCtrl.push(element);
          });
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
          this.ListOfCategory.forEach(element => {
            this.categoryMultiCtrl.push(element);
          });
        } else {
          this.categoryMultiCtrl = "";
        }
      });
  }

  toggleSelectAllassetclass(selectAllValue) {
    this.assetclassMultiCtrl = [];
    this.filteredAssetClassMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (!!selectAllValue.checked) {
          this.ListOfBlocks.forEach(element => {
            this.assetclassMultiCtrl.push(element);
          });
        } else {
          this.assetclassMultiCtrl = "";
        }
      });
  }

  viewSelected() {
    this.getclear();
    this.paginationParams.totalCount = this.selection.selected.length;
    this.paginationParams.endIndex = this.selection.selected.length;
    this.onChangeDataSource(this.selection.selected);
  }

  clearSelectedView() {
    //this.getclear();
    this.selection.clear();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.paginationParams.totalCount = 0;
    if (!!this.bindData && this.bindData.length > 0) {
      this.paginationParams.totalCount = this.bindData.length > 0 ? this.bindData[0].AssetListCount : 0;

    }

    this.onChangeDataSource(this.bindData);

  }
  clearSelected() {
    this.getclear();
    this.selection.clear();
    this.numSelected = 0;
    this.getselectedIds = [];
    //this.onChangeDataSource(this.bindData);
    this.GetAssetForTransfserBindData("")
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
      this.GetAssetForTransfserBindData("SearchText");
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
    this.GetAssetForTransfserBindData("");
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
    debugger;
    if (this.SearchcolumnName != $event.active) {
      if ($event.active != "Select") {
        if ($event.direction == "asc" || $event.direction == "") {
          this.GetAssetForTransfserBindData("")
        } else {
          this.variable1 = $event.active;
          this.GetAssetForTransfserBindData("Sort")
        }
      }
    }
  }

  openExportPopup() {
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
  hideSearch : boolean = false;
  searchCount : any = 0;
  clearSearchData(){
    this.showmultiSearch = !this.showmultiSearch;
    this.multiSearch = [];
    if(!!this.hideSearch)
      this.GetAssetForTransfserBindData("");
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
  Onchange(){
    this.showmultiSearch = false;
  }
  clearInput(val:any){	
    val.HighValue = '';	
  }
}
