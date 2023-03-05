import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild,Output,EventEmitter  } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { ReconciliationService } from '../../services/ReconciliationService';
import { CompanyLocationService } from '../../services/CompanyLocationService';
import { UserMappingService } from '../../services/UserMappingService';
import { CompanyBlockService } from '../../services/CompanyBlockService';
import { GroupService } from '../../services/GroupService';
import { UserService } from '../../services/UserService';
import { AssetRetireService } from '../../services/AssetRetireService';
import { AssetRetirementDialogComponent } from '../dialog/asset-retirement-dialog/asset-retirement-dialog.component';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import { assetTabsComponent } from '../../partialView/assetDetails/asset_tabs.component';
import { GetFieldsComponent } from 'app/components/partialView/get-fields/get-fields.component';
import * as menuheaders from '../../../../assets/MenuHeaders.json'
import { Sort } from '@angular/material/sort';
import { GroupDetailsComponent } from 'app/components/partialView/group-details/group-details.component';
import { ReportService } from 'app/components/services/ReportService';
import { AllPathService } from 'app/components/services/AllPathServices';
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
  selector: 'app-initiate-retirement',
  templateUrl: './initiate-retirement.component.html',
  styleUrls: ['./initiate-retirement.component.scss']
})
export class InitiateRetirementComponent implements OnInit {

  Headers: any = [];
  message: any = [];

  numRows: number;
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
  panelOpenState = true;
  menuheader: any = (menuheaders as any).default
  public bindData: any[];
  public arrlength = 0;
  public arr = [];
  public newdataSource = [];
  public isallchk: boolean;
  public getselectedData: any[] = [];
  public selecteddatasource: any[] = [];
  public appliedfilters: any[] = [];
  @Output() insuranceEndDate: EventEmitter<any> = new EventEmitter<any>();
  /////Filter Instance/////////
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
  multiSearch : any[]=[];
  Searchlist :any[];

  AssetLifeData: any[] = [];

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

  public assetlifeMultiCtrl: any;

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  protected _onDestroy = new Subject<void>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: any[] = ['select'];
  // displayedColumns: string[] = ['select', 'InventoryNo', 'AssetNo', 'SubNo', 'CapitalizationDate', 'AssetClass', 'AssetName', 'AssetDescription', 'Qty', 'UOM', 'Cost', 'WDV', 'EquipmentNO', 'AssetCondition', 'AssetCriticality', 'Status'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  tempdatasource: any[] = [];
  displayTable: boolean = false;
  displaybtn: boolean = false;
  ReportForm: FormGroup;
  constructor(public dialog: MatDialog,
    public rs: ReconciliationService,
    public cls: CompanyLocationService,
    public ums: UserMappingService,
    public cbs: CompanyBlockService,
    public gs: GroupService,
    public toastr: ToastrService,
    public ars: AssetRetireService,
    private storage: ManagerService,
    public confirmService: AppConfirmService,
    private loader: AppLoaderService,
    public us: UserService,
    private router: Router,
    public alertService: MessageAlertService,
    public reportService: ReportService,
    public AllPathService: AllPathService,
    private jwtAuth: JwtAuthService,private fb: FormBuilder
    ){
       debugger;
       this.Headers = this.jwtAuth.getHeaders();
       this.message = this.jwtAuth.getResources();
       this.AssetLifeData= [
        //{ value: 'All', viewValue: "All" },
        { value: 'Active', viewValue: this.Headers.Active },
        { value: 'Expire', viewValue: this.Headers.Expired },
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
    //this.paginator._intl.itemsPerPageLabel = 'Records per page1';
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);

    this.assetlifeMultiCtrl = "";
    this.cityMultiCtrl = "";
    this.categoryMultiCtrl = "";
    this.assetclassMultiCtrl = "";
    this.ReportForm = this.fb.group({
      plantMultiFilterCtrl: ['', [Validators.required]],
     
    });

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
    this.GetBlocksOfAssets();

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

    let url1 = this.cls.GetLocationListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 47);
    let url2 = this.cbs.GetCategoryListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 47);
    let url3 = this.gs.GetFieldListByPageId(47,this.UserId, this.CompanyId);
    let url4 = this.gs.GetFilterIDlistByPageId(47);
    let url5 = this.gs.CheckWetherConfigurationExist(this.GroupId, 11);
    let url6 = this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.RegionId, "47");
    forkJoin([url1, url2, url3, url4, url5, url6]).subscribe(results => {
      if (!!results[0]) {
        this.ListOfLoc = JSON.parse(results[0]);
        this.ListOfLoc1 = this.ListOfLoc;
        this.ListOfSBU = this.UniqueArraybyId(this.ListOfLoc1, this.Layertext);
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
        this.displayedColumns = ['Select', 'Icon'].concat(this.displayedColumns);
      }
      if (!!results[3]) {
        this.ListOfFilter = JSON.parse(results[3]);
        if (!!this.ListOfFilter) {
          this.ListOfFilter.forEach(x => this.ListOfFilterName.push(x.FilterName))
        }
      }
      this.AssetClassOrcostCenter = results[4];
      if (!!results[5]) {
        this.ListOfPagePermission = JSON.parse(results[5]);
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
  //========= City ===========
  retirementInitiationLocations: any;
  AssetClassOrcostCenter: any;
  ListOfLoc: any[] = [];
  ListOfLoc1: any[] = [];
  ListOfSBU: any[] = [];
  GetLocationById() {

    var flag = !this.assetlifeMultiCtrl ? "All" : this.assetlifeMultiCtrl;
    let url1 = this.cls.GetLocationsByCompanyIdToBindSelectList(this.CompanyId);
    let url2: Observable<any>;
    if (flag == "Active") {
      url2 = this.ums.GetUsersLocationsByTaskIdsCompanyUserId(51, this.CompanyId, this.UserId);
    }
    if (flag == "Expire") {
      url2 = this.ums.GetUsersLocationsByTaskIdsCompanyUserId(56, this.CompanyId, this.UserId);
    }
    let url3 = this.gs.CheckWetherConfigurationExist(this.GroupId, 14);
    forkJoin([url1, url2, url3]).subscribe(results => {

      if (!!results[1]) {
        this.retirementInitiationLocations = results[1];
      }
      else {
        this.retirementInitiationLocations = '';
      }
      if (!!results[0]) {
        var IsCompanyAdmin = 1;//this.IsCompanyAdmin;//!$rootScope.globals.currentUser.IsCompanyAdmin ? 0 : $rootScope.globals.currentUser.IsCompanyAdmin;
        var retirementInitiationLocations = this.retirementInitiationLocations;
        this.ListOfLoc = results[0];
        var list = [];
        var listOfLoc = [];
        if (IsCompanyAdmin == 0 && retirementInitiationLocations != '') {
          list = retirementInitiationLocations.split(",");
          if (list.length === 1 && list[0] === 0) {
          }
          else {
            for (var s = 0; s < this.ListOfLoc.length; s++) {
              for (var j = 0; j < list.length; j++) {
                if (this.ListOfLoc[s].LocationId == list[j]) {
                  listOfLoc.push(this.ListOfLoc[s]);
                }
              }
            }

            this.ListOfLoc = listOfLoc;
            this.ListOfLoc1 = this.ListOfLoc;
            this.ListOfSBU = this.ListOfLoc1;
          }
        }
        else if (IsCompanyAdmin === 1) {
          this.ListOfLoc1 = this.ListOfLoc;
          this.ListOfSBU = this.ListOfLoc1.filter(function (el, index, array) {
            return array.indexOf(el) == index;
          });
        }
      }
      this.AssetClassOrcostCenter = results[2];
      this.getFilterCityType();
      this.getFilterPlantType();
      this.CheckRights();
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

  onEmpty() {
    this.ListOfLoc1 = this.ListOfLoc
    this.getFilterPlantType();
  }
  // onchangeSBU(value) {
  //   debugger;
  //   this.plantMultiCtrl = "";
  //   this.ListOfLoc1 = this.ListOfLoc.filter(x => x[this.Layertext].indexOf(value) > -1);
  //   this.getFilterPlantType();
  // }
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
  }

  CategoryGetdata() {
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

    debugger
    this.reportService.GetCategoryRightWiseForReport(this.CompanyId, this.UserId, PlantList, false, 47).subscribe(r => {
      this.ListOfCategory = [];
      r.forEach(element => {
        // this.ListOfCategory=[];
        this.ListOfCategory.push(element);
        this.getFilterCategoryType();
      });
    })
  }
  ListOfBlocks: any[] = [];
  CheckRights() {
    var locationId = 0;
    var userRights = "Retirement Initiation";
    var isRetirementInitiationRights = "";
    this.rs.CheckRights(locationId, this.CompanyId, this.UserId, userRights).subscribe(r => {
      isRetirementInitiationRights = r.toString();
      if (isRetirementInitiationRights == '1') {
        this.cbs.GetBlockOfAssetsByCompany(this.CompanyId).subscribe(r1 => {

          this.ListOfBlocks = r1;
          this.getFilterAssetClassType();
        })
      }
      else {
        if (locationId != null && locationId > 0) { }
        else {
          this.cbs.GetBlocksByLocUser(0, this.UserId, this.CompanyId).subscribe(r1 => {

            this.ListOfBlocks = r1;
            this.getFilterAssetClassType();
          })
        }
      }
    })
  }

  GetBlocksOfAssets() {
    var blocksofAssetData = [];
    var cId = this.CompanyId;
    var userId = this.UserId;
    this.gs.BlocksOfAssetsGetByCompanyIdUserId(cId, userId).subscribe(response => {
      if (response) {
        blocksofAssetData = response;
        this.ListOfBlocks = [];
        if (blocksofAssetData.length > 0) {
          blocksofAssetData.forEach(element => {
            this.ListOfBlocks.push(element);
          })
        }
        this.getFilterAssetClassType();
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
        this.displayedColumns = ['Select', 'Icon'].concat(this.displayedColumns);
      }
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
  //====== Bind Data To DataSource========  
  handlePage(pageEvent: PageEvent) {

    this.paginationParams.pageSize = pageEvent.pageSize;
    this.paginationParams.currentPageIndex = pageEvent.pageIndex;
    this.paginationParams.endIndex = (this.paginationParams.currentPageIndex + 1) * pageEvent.pageSize;
    this.paginationParams.startIndex = this.paginationParams.currentPageIndex * pageEvent.pageSize;
    if (!!this.variable && !!this.variable) {
      this.RetirementInitiationBindData("SearchText")
    }
    else if(this.multipleserach= true && this.multiSearch.length > 0) 
    {
      this.RetirementInitiationBindData("multiplesearch");
    }
    else {
      this.RetirementInitiationBindData("")
    }

  }
  IsSearch: boolean = false;
  issort: boolean = false;
  isExport: boolean = false;
  RetirementInitiation() {
    this.selection.clear();
    this.getclear();
    this.Onchange();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;
    this.RetirementInitiationBindData("OnPageload");
  }
  clickToExport() {
    if (this.displayTable == true && this.dataSource.data.length != 0) {
      this.RetirementInitiationBindData("IsExport");
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
  RetirementInitiationBindData(Action) {
    if (!this.plantMultiCtrl) {

      this.toastr.warning(`Please Select ${this.Headers.Location}`, this.message.AssetrakSays);
      return null;
    }
    this.loader.open();
    var locationId = 0;
    var blockId = 0;
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

    if (!!this.categoryMultiCtrl && this.categoryMultiCtrl.length > 0) {
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
    //this.showmultiSearch = false;
    this.serachtext = "";
    this.colunname = "";
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

    var assetDetails = {
      CompanyId: this.CompanyId,
      RegionId: this.RegionId,
      SbuList: [],
      LocationIdList: LocationIdList,
      CategoryIdList: CategoryIdList,
      AssetsClassList: BlockIdList,
      typeOfAssetList: TAIdList,
      subTypeOfAssetList: subTypeOfAssetList,
      LocationId: !!this.plantMultiCtrl ? this.plantMultiCtrl.LocationId : 0,
      pageNo: this.paginationParams.currentPageIndex + 1,
      pageSize: this.paginationParams.pageSize,
      //SearchText: '',
      IsSearch: this.IsSearch,
      UserId: this.UserId,
      BlockId: !!this.assetclassMultiCtrl ? this.assetclassMultiCtrl[0].Id : 0,
      AssetLife: !this.assetlifeMultiCtrl ? "All" : this.assetlifeMultiCtrl,
      Flag: 'Retirement Initiation',
      IsExport: this.isExport,
      SearchText: this.serachtext,
      columnName: this.colunname,
      isfromReinitation: false,
      issorting: this.issort,
      PageId: 47,
      ismultiplesearch: this.multipleserach,
      Searchlist : this.Searchlist,
      ExportedFields : this.ExportedFields,
      GroupId: this.GroupId
    }
    this.ars.GetAssetListToInitiateRetire(assetDetails).subscribe(r => {
      debugger;
      this.loader.close();
      if (Action === 'IsExport') {
        this.AllPathService.DownloadExportFile(r);
      }
      else {
        this.bindData = !!r ? JSON.parse(r) : [];
        this.paginationParams.totalCount = 0;
        if (!!this.bindData && this.bindData.length > 0) {
          this.paginationParams.totalCount = this.bindData[0].AssetListCount;
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
      'Pagename': "Initiate Retirement",
      'SbuList': [],
      'LocationIdList': LocationIdList,
      'CategoryIdList': CategoryIdList,
      'AssetsClassList': BlockIdList,
      'typeOfAssetList': TAIdList,
      'subTypeOfAssetList': subTypeOfAssetList,
      'AssetLife': !this.assetlifeMultiCtrl ? "All" : this.assetlifeMultiCtrl,
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
      if (this.StorePageSession.Pagename === "Initiate Retirement") {
        this.ListOfLoc1.forEach(x => {
          if (this.StorePageSession.LocationIdList.indexOf(x.LocationId) > -1) {
            this.plantMultiCtrl = x;
          }
        })
        var list = [];
        this.ListOfCategory.forEach(x => {
          if (this.StorePageSession.CategoryIdList.indexOf(x.AssetCategoryId) > -1) {
            list.push(x);
            this.categoryMultiCtrl = list;
          }
        })
        this.assetlifeMultiCtrl = !this.StorePageSession.AssetLife ? "All" : this.StorePageSession.AssetLife;
        this.RetirementInitiation();
      }
      else {
        localStorage.setItem('PageSession', null);
        this.StorePageSession = "";
      }
    }
  }

  openDialog() {
    debugger;
    if (this.selection.selected.length > 0) {
      var prefarIds = [];
      var bindData = [];
      var AssetLife = !this.assetlifeMultiCtrl ? "All" : this.assetlifeMultiCtrl;
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
        AssetLife: AssetLife,
        AssetList: prefarIds.join(','),
        bindData: bindData,
        getselectedIds:this.getselectedIds,
      }
      const dialogRef = this.dialog.open(AssetRetirementDialogComponent, {
        width: '980px',

        data: { title: title, payload: this.selection.selected, configdata: configdata }
      });
      dialogRef.afterClosed().subscribe(result => {
        debugger;
        if (!!result) {
          this.loader.open();
          var RetireDto = {
            Excelfile: result.Excelfile,
            AssetList: result.AssetList,
            rComment: result.rComment,
            Amount: result.Amount,
            CustomerName: result.CustomerName,
            discardValue: result.discardValue,
            discardType: result.discardType,
            discardedPhoto: result.discardedPhoto,
            DiscardedPhotoId: result.DiscardedPhotoId,
            RetireDateTime: result.RetireDateTime,
            UserId: result.UserId,
            LocationId: result.LocationId,
            CompanyId: result.CompanyId,
            proposedDate: result.proposedDate,
            amountype: result.amountype,
            assetLifeFlag: result.assetLifeFlag,
            TransactionTypeForSellingAmount: result.TransactionTypeForSellingAmount,
            SellingAlist: JSON.stringify(result.SellingAmountlist)
          }
          var fileList = result.fileList;
          this.ars.AddRetiredAssetDetails(RetireDto, fileList).subscribe(r => {
            debugger;
            this.loader.close();
            debugger;
            if (r == "Retire Initiate Sucess") {
              this.toastr.success(this.message.RetireInitiateSucess, this.message.AssetrakSays);
            }
            else if (r == "Retirement Already Initiated") {
              this.toastr.error(this.message.RetirementAlreadyInitiated, this.message.AssetrakSays);
            }
            else if (r == "Selected assets are already in transfer process"){
              this.toastr.error(this.message.AssetalredyinTransferprocess, this.message.AssetrakSays);
            }
            else {
              this.toastr.error(this.message.ErrorMessage, this.message.AssetrakSays);
            }
            this.clearSelected();
          })
        }
      });
    }
    else {
      this.toastr.warning(this.message.SelectassetInitiateRetirement, this.message.AssetrakSays);
    }
  }
  numSelected: any = 0;
  getselectedIds: any[] = [];
  isAllSelected: boolean = false;
  masterToggle() {
    debugger;

    this.selection.clear();
    this.isAllSelected = !this.isAllSelected;
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
      this.paginationParams.totalCount = this.bindData[0].AssetListCount;

    }

    this.onChangeDataSource(this.bindData);

  }
  clearSelected() {
    this.getclear();
    this.selection.clear();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.RetirementInitiationBindData("");
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
  PageId =47;
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
      this.RetirementInitiationBindData("SearchText");
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
    else if (columnName == "CPPNumber") { this.isButtonVisibleCPPNumber = !isflag; }

    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;
    this.RetirementInitiationBindData("");

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
  sortColumn($event: SqSort) {

    if (this.SearchcolumnName != $event.active) {
      if ($event.active != "Select") {
        if ($event.direction == "asc" || $event.direction == "") {
          this.RetirementInitiationBindData("")
        } else {
          this.variable1 = $event.active;
          this.RetirementInitiationBindData("Sort")
        }
      }
    }
  }
  
  showmultiSearch:any=false;
  multiSearchAdd(){
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
  removeSearch(idx){
    this.multiSearch.splice(idx , 1);
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
      this.RetirementInitiationBindData("multiplesearch");
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
  hideSearch : boolean = false;
  searchCount : any = 0;
  clearSearchData(){
    this.showmultiSearch = !this.showmultiSearch;
    this.multiSearch = [];
    if(!!this.hideSearch)
      this.RetirementInitiationBindData("");
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
