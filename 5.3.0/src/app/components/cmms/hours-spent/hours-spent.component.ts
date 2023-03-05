import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { AssetTransferDialogComponent } from 'app/components/transfer/dialog/asset-transfer-dialog/asset-transfer-dialog.component';
import { AssetTransferVendorDialogComponent } from 'app/components/transfer/dialog/asset-transfer-vendor-dialog/asset-transfer-vendor-dialog.component';
import { assetTabsComponent } from '../../partialView/assetDetails/asset_tabs.component';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import * as menuheaders from '../../../../assets/MenuHeaders.json';
import * as headers from '../../../../assets/Headers.json';
import * as resource from '../../../../assets/Resource.json';
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
import { AddEditIssueDialogComponent } from '../dialogs/add-edit-issue-dialog/add-edit-issue-dialog.component';
import { CmmsService } from '../../services/CmmsService';
import { AssetCategoryService } from 'app/components/services/AssetCategoryService';
import { AssetTypeService } from 'app/components/services/AssetTypeService';
import { AssetSubTypeService } from 'app/components/services/AssetSubTypeService';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { AutofillMonitor } from '@angular/cdk/text-field';
export interface SqSort extends Sort {
  //   /** The id of the column being sorted. */
  // active: string;

  // /** The sort direction. */
  // direction: SortDirection;
  type: string;
}
@Component({
  selector: 'app-hours-spent',
  templateUrl: './hours-spent.component.html',
  styleUrls: ['./hours-spent.component.scss']
})
export class HoursSpentComponent implements OnInit {

  //charts start

  width: number = 700;
  height: number = 300;
  fitContainer: boolean = false;

    view: any[] = [600, 400];
  // options for the chart
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Sales';
  timeline = true;
  doughnut = true;
  colorScheme = {
    domain: ['#9370DB', '#87CEFA', '#FA8072', '#FF7F50', '#90EE90', '#9370DB']
  };
  //pie
  showLabels = true;
  // data goes here
public single = [
  {
    "name": "China",
    "value": 2243772
  },
  {
    "name": "USA",
    "value": 1126000
  },
  {
    "name": "Norway",
    "value": 296215
  },
  {
    "name": "Japan",
    "value": 257363
  },
  {
    "name": "Germany",
    "value": 196750
  },
  {
    "name": "France",
    "value": 204617
  }
];
public multi = [
  {
    "name": "China",
    "series": [
      {
        "name": "2018",
        "value": 2243772
      },
      {
        "name": "2017",
        "value": 1227770
      }
    ]
  },
  {
    "name": "USA",
    "series": [
      {
        "name": "2018",
        "value": 1126000
      },
      {
        "name": "2017",
        "value": 764666
      }
    ]
  },
  {
    "name": "Norway",
    "series": [
      {
        "name": "2018",
        "value": 296215
      },
      {
        "name": "2017",
        "value": 209122
      }
    ]
  },
  {
    "name": "Japan",
    "series": [
      {
        "name": "2018",
        "value": 257363
      },
      {
        "name": "2017",
        "value": 205350
      }
    ]
  },
  {
    "name": "Germany",
    "series": [
      {
        "name": "2018",
        "value": 196750
      },
      {
        "name": "2017",
        "value": 129246
      }
    ]
  },
  {
    "name": "France",
    "series": [
      {
        "name": "2018",
        "value": 204617
      },
      {
        "name": "2017",
        "value": 149797
      }
    ]
  }
];

  public barChartOptions: ChartOptions = {
    responsive: true,
    legend: { position: 'top' },
    layout: {
      padding: {
        left: 50,
        right: 50,
        top: 50,
        bottom: 50
    }
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        clamp : true,
        offset: 8,
        font: {
          size: 15,
          
        },
      },
    },
  };

  public chartColors: Array<any> = [
    { // all colors in order
      backgroundColor: ['#008bd0',"Red","Orange","Yellow","Green","Blue","Indigo","Violet","Pink","Purple","Turquoise","Gold","Lime","Maroon","Navy","Coral","Teal","Brown","White","Black","Sky"]
    }
]
  public barChartLabels1: Label[] = [['Mac ','not working'],['Windows',' corrupted'],['Joystick button',' not working'],['Mouse scroll buton',' not working'],
  ['Mac ','not working'],['Windows',' corrupted'],['Joystick button',' not working'],['Mouse scroll buton',' not working'],
  ['Mac ','not working'],['Windows',' corrupted']];
  public barChartType: ChartType = 'pie';
  public barChartLegend = false;
  public barChartPlugins = [pluginDataLabels];
  public barChartData: ChartDataSets[] = [
    { data: [5, 6, 7,8 , 9, 10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25], label: 'Hours Spent' }
  ];
  public barChartLabels2: Label[] = ['Tech-A','Tech-B','Tech-C','Tech-A','Tech-B','Tech-C','Tech-A','Tech-B','Tech-C','Tech-A','Tech-B','Tech-C','Tech-A','Tech-B','Tech-C','Tech-A','Tech-B','Tech-C','Tech-A'];
  techniciansData: any = ['Tech-A','Tech-B','Tech-C'];

  //charts end
  Headers:any = (headers as any).default;
  periodsData: any=['P1','P2'];
  fiscalYearData: any = ['2021-2022','2022-2023'];
  issueType:any;
  message: any = (resource as any).default;
  category:any;
  issueVal: any;
  locVal: any;
  type:any;
  subtype:any;
  // categoryData: any;
  orderTyes: any[];
  issueTypes: any[] = ['Mac not working','Windows corrupted','Joystick button not working','Mouse scroll buton not working',
  'AC not working'];
  categories: any[];
  types: any[];
  subTypes: any[];
  numRows: number;
  withoutFilter: any
  orderTypeFilterCtrl: FormControl = new FormControl();;
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

  public filteredsubtypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public subtypeFilterCtrl: FormControl = new FormControl();

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
  filteredOrderTypes:  ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public assetsubtypeFilterCtrl: FormControl = new FormControl();
  public filteredAssetSubTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

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
  multiSearch: any[] = [];
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
    private cmmsService: CmmsService,
    public categoryservice: AssetCategoryService,
    public typeservice: AssetTypeService,
    public subTypeservice: AssetSubTypeService,
  ) {

    this.Headers = this.jwtAuth.getHeaders();
    this.message = this.jwtAuth.getResources();
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }
  hdrs: any;
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  paginationParams: any;
  ngOnInit(): void {

    // this.loader.open();
    // this.barChartOptions.scales.yAxes[0].ticks.max = Math.max(...barChartLabels2.datasets[0].data) * 1.2
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
    // let cols = ['Order Type','Issue Type','Issue Code','Mapping'];
    // this.displayedColumns = cols;
    this.cityMultiCtrl = "";
    this.categoryMultiCtrl = "";
    this.assetclassMultiCtrl = "";
    this.getOrderTypes();
    this.getCategories();
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

    // this.GetTransferTypes();
   this.GetInitiatedData();
    // this.CheckRights();
    // this.AssetNoFilter.valueChanges.subscribe((AssetNoFilterValue) => {
    //   this.filteredValues['AssetNo'] = AssetNoFilterValue;
    //   this.dataSource.filter = this.filteredValues.AssetNo;
    // });

  }

  ListOfField: any[] = [];
  ListOfFilter: any[] = [];
  ListOfFilterName: any[] = [];
  ListOfCategory: any[] = [];
  ListOfCategory1: any[] = [];
  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  ExportedFields: any[] = [];
  GetInitiatedData() {

    let url1 = this.cls.GetLocationListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 40);
    let url2 = this.cbs.GetCategoryListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 40);
    let url3 = this.gs.GetFieldListByPageId(114,this.UserId,this.CompanyId);
    let url4 = this.gs.GetFilterIDlistByPageId(114);
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
        //  this.displayedColumns = this.ListOfField;
        //  console.log('binddata', this.ListOfField);
        //  this.displayedColumns.push('Mapping');
        this.displayedColumns = this.ListOfField.map(choice => choice.FieldName);
           this.displayedColumns.push('OrderType','IssueType','IssueCode','DownTime','Mapping');
        console.log('cols',this.displayedColumns);
        this.withoutFilter = this.ListOfField.map(choice => choice.FieldName);
        // this.displayedColumns = ['Select', 'Icon'].concat(this.displayedColumns);
        // let cols = ['Order Type','Issue Type','Mapping'];
        // this.displayedColumns = cols;
      }
      if (!!results[3]) {
        this.ListOfFilter = JSON.parse(results[3]);
        if (!!this.ListOfFilter) {
          this.ListOfFilter.forEach(x => this.ListOfFilterName.push(x.FilterName))
        }
      }
  
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

    })
  }

  SelectionColumn(FieldName, item) {

    this.ListOfField.forEach(val => {
      if (val.FieldName == FieldName) {
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
  }

  removeSearch(i: number) {
    //this.multiSearch.removeAt(i);
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

    this.showmultiSearch = true;
    if (this.multiSearch = []) {
      this.addSearch();
    }
    else { }
  }
  multipleserach: boolean = false;
  onMultiSearchClick() {

    debugger;
    this.multipleserach = true;
    //this.GetAssetForTransfserBindData("multiplesearch");
    console.log(this.multiSearch);

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
    debugger
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

  getFilterType(){
    // public assettypeMultiCtrl: any;
    // public assettypeFilterCtrl: FormControl = new FormControl();
    // public filteredsubtypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    debugger;
    this.filteredAssetTypeMulti.next(this.types.slice());
    this.assettypeFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(()=> {
        this.filterAssetTypes();
      })
  }



  filterAssetTypes(){
    if (!this.types) {
      return;
    }
    debugger;
    let search = this.assettypeFilterCtrl.value;
    if (!search) {
      this.filteredAssetTypeMulti.next(this.types.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredAssetTypeMulti.next(
      this.types.filter(x => x.TypeOfAsset.toLowerCase().indexOf(search) > -1)
    );
  }


  getFilterSubType() {
    this.filteredsubtypeMulti.next(this.subTypes.slice());
    this.subtypeFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterSubTypeMulti();
      });
  }

  protected filterSubTypeMulti(){
    if (!this.subTypes) {
      return;
    }
    let search = this.subtypeFilterCtrl.value;
    if (!search) {
      this.filteredsubtypeMulti.next(this.subTypes.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredsubtypeMulti.next(
      this.subTypes.filter(x => x.SubTypeOfAsset.toLowerCase().indexOf(search) > -1)
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
  tableData: any[];
  GetAssetForTransfserBindData(Action) {
        
    // this.tableData  = daata;
    // this.displayTable = true;
    // this.onChangeDataSource(daata);
  // 
  if(!this.cityMultiCtrl) {
    this.toastr.warning('Please Select Order Type', this.message.AssetrakSays);
    return;
  }
  this.loader.open();
  let data = {
    OrderTypeID : this.cityMultiCtrl,
    CategoryID: this.category?this.category:[],
    TypeID: this.type?this.type:[],
    SubTypeID: this.subtype?this.subtype:[],
    PageNumber:this.paginationParams.currentPageIndex + 1,
    PageSize :this.paginationParams.pageSize
  }
  debugger;
  this.cmmsService.getIssueTypesWithMapping(data).subscribe(issueTypes=>{
    this.bindData = JSON.parse(issueTypes.Model);
    console.log(this.bindData);
    this.paginationParams.totalCount = issueTypes.TotalRecords > 0 ? issueTypes.TotalRecords : 0;
    this.onChangeDataSource(this.bindData);
    this.displayTable = true;
    this.loader.close();
  })
  }
  onChangeDataSource(value) {
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.sort = this.sort;
    this.isAllSelected = false;
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
        this.displayedColumns = ['Select', 'Icon'].concat(this.displayedColumns);
      }
    })
  }

  CategoryGetdata() {
    debugger
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


    this.reportService.GetCategoryRightWiseForReport(this.CompanyId, this.UserId, PlantList, false, 24).subscribe(r => {
      this.ListOfCategory = [];
      r.forEach(element => {
        // this.ListOfCategory=[];
        this.ListOfCategory.push(element);
        this.getFilterCategoryType();
      });
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

  openInfoDialog(todo: String,data: any,idx:any){
    let title = 'Info';
    let dialogData;
    if(todo=='add')
     dialogData = {
      width: '65vw',
      height: 'auto',
      disableClose : true,
      data: { title: title, payload: this.ListOfField,task: todo }
    };
    else if(todo=='edit')
    dialogData = {
      width: '65vw',
      height: 'auto',
      disableClose : true,
      data: { title: title, payload: this.ListOfField, rowData: data,task: todo }
    };
    else if(todo=='view')
    dialogData = {
      width: '65vw',
      height: 'auto',
      disableClose : true,
      data: { title: title, payload: this.ListOfField, rowData: data,task: todo }
    };
    else if(todo == 'delete') {
      if(idx>-1){
          this.confirmService.confirm({ message: "Are you sure you want to delete Issue Type?", title: this.message.AssetrakSays })
        .subscribe(res => {
          if (res) {
            this.cmmsService.deleteIssueTypeByIssueId(data.IssueTypeID).subscribe(res=>{
              console.log(res);
              this.toastr.error('Part deleted successfully!!',this.message.AssetrakSays); 
              this.GetAssetForTransfserBindData("");
            });
            
          }
        })
        return; 
      }
    }
    if(todo=='view' || todo == 'edit' || todo=='add'){
      debugger;
      this.cmmsService.getIssueTypeByIssueId(data.IssueTypeID).subscribe(res=>{
        debugger;
        console.log(res);
        dialogData.data.rowData = res.Model;
        const dialogRef = this.dialog.open(AddEditIssueDialogComponent, dialogData)
        dialogRef.afterClosed().subscribe(result => {
          if (!!result) { 
            if(result=='close') return;
            if(todo=='add')  {
              // this.tableData.push(result);
              // this.onChangeDataSource(this.tableData);
              // this.toastr.success('Issue Created successfully!!',this.message.AssetrakSays);
              this.cmmsService.addEditIssueTypeByOrderId(result).subscribe(res=>{
                console.log(res);
                this.toastr.success('Issue Created successfully!!',this.message.AssetrakSays);
                this.GetAssetForTransfserBindData("");
                debugger;
              })
            }
            else {
              this.cmmsService.addEditIssueTypeByOrderId(result).subscribe(res=>{
                console.log(res);
                this.toastr.success('Issue Edited successfully!!',this.message.AssetrakSays);
                this.GetAssetForTransfserBindData("");
                debugger;
              })
     
            }
            
          }
          else {
            if(idx>-1){
              this.tableData.splice(idx,1);
              this.onChangeDataSource(this.tableData);
            this.toastr.error('Issue deleted successfully!!',this.message.AssetrakSays);
            }
          }
        })
      })
 
  }
  }
  handlePage(pageEvent: PageEvent) {
    this.paginationParams.pageSize = pageEvent.pageSize;
    this.paginationParams.currentPageIndex = pageEvent.pageIndex;
    this.paginationParams.endIndex = (this.paginationParams.currentPageIndex + 1) * pageEvent.pageSize;
    this.paginationParams.startIndex = this.paginationParams.currentPageIndex * pageEvent.pageSize;
    this.GetAssetForTransfserBindData("");
  }

  getOrderTypes(){
    this.cmmsService.getOrderTypes().subscribe(res=>{
      debugger; 
      this.orderTyes = JSON.parse(res.Model);
      this.getFilterOrderType()
      console.log(this.orderTyes);
    })
  }

  getCategories(){
    this.categoryservice.GetAllCategoryData(this.GroupId, this.RegionId, this.CompanyId).subscribe(response => {
      debugger;
      this.categories = response;
      this.getFilterCategoryType();
      // this.onChangeDataSource(response);
    })
  }

  toggleSelectAllCategories($event){
    
  }

  GetAllTypeData() {
     this.loader.open();
  
    var typeData = {
      categoryIds: this.category,
      groupId: this.GroupId,
      regionId: this.RegionId,
      companyId: this.CompanyId,
    }

    this.cmmsService.GetAssetTypesByCategoryIds(typeData).subscribe(response => {
       this.loader.close();
      this.types = response.Model;
      this.getFilterType();
      debugger;
    })
  }

  GetAllSubTypeByCategoryIdTypeId() {
    this.loader.open();
    var subTypeData = {
      typeIds: this.type,
      groupId: this.GroupId,
      regionId: this.RegionId,
      companyId: this.CompanyId,
    }

    this.cmmsService.getAssetSubTypesByTypeIds(subTypeData).subscribe(response => {
      this.loader.close();
      this.subTypes = response.Model;
      this.getFilterSubType();
      // this.onChangeDataSourceS(response);
    })
  }

  getFilterOrderType() {
    this.filteredOrderTypes.next(this.orderTyes.slice());
    this.orderTypeFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterOrderTypes();
      });
  }
  filterOrderTypes(){
    if (!this.orderTyes) {
      return;
    }
    // get the search keyword
    let search = this.orderTypeFilterCtrl.value;
    if (!search) {
      this.filteredOrderTypes.next(this.orderTyes.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredOrderTypes.next(
      this.orderTyes.filter(ot => ot.OrderType.toLowerCase().indexOf(search) > -1)
    );
  }

}
