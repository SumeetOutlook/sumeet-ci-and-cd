import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild,Output,EventEmitter } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select'
import { PhysicalAssetTransferComponent } from './physical_asset_transfer_popup/physical_asset_transfer.component';
import { assetTabsComponent } from '../../partialView/assetDetails/asset_tabs.component';
import { GetFieldsComponent } from 'app/components/partialView/get-fields/get-fields.component'
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
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/UserService';
import { AllPathService } from 'app/components/services/AllPathServices';
import { Sort } from '@angular/material/sort';
import { GroupDetailsComponent } from 'app/components/partialView/group-details/group-details.component';

import { ReportService } from 'app/components/services/ReportService';
//import { AssetTransferWithdrawDialogComponent } from '../dialog/asset-transfer-withdraw-dialog/asset-transfer-withdraw-dialog.component';
import { AssetTransferPhysicalWithdrawDialogComponent} from '../dialog/asset-transfer-physical-withdraw-dialog/asset-transfer-physical-withdraw-dialog.component';
import { ExportFieldsComponent } from 'app/components/partialView/export-fields/export-fields.component'; 
import { MultiSearchDialogComponent } from 'app/components/partialView/multi-search-dialog/multi-search-dialog.component';
import { ViewUploadDocumentsDialogComponent } from '../../partialView/view-upload-documents-dialog/view-upload-documents-dialog.component'
export interface SqSort extends Sort {
  //   /** The id of the column being sorted. */
  // active: string;

  // /** The sort direction. */
  // direction: SortDirection;
  type: string;
}

@Component({
  selector: 'app-physical_movement',
  templateUrl: './physical_movement.component.html',
  styleUrls: ['./physical_movement.component.scss']
})
export class PhysicalMovementComponent implements OnInit, OnDestroy {
  Headers: any;
  message: any;
  menuheader: any = (menuheaders as any).default
  numRows: number;
  selectedValue: string;
  selectedassetclass: string;
  selectedassettype: string;
  selectedassetuom: string;
  IsDisabled: boolean = true;
  panelOpenState = true;
  setflag: boolean = false;
  showmultiSearch: any = false;
  public bindData: any[];
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
  public arrlength = 0;
  public arr = [];
  public newdataSource = [];
  public isallchk: boolean;
  public getselectedData: any[] = [];
  public selecteddatasource: any[] = [];
  public appliedfilters: any[] = [];
  public sessionId: any;
  //panelOpenState = true;
  multiSearch: any[] = [];
  /////Filter Instance/////////
  @Output() insuranceEndDate: EventEmitter<any> = new EventEmitter<any>();
  AssetNoFilter = new FormControl();
  filteredValues = {
    AssetNo: '', SubNo: '', CapitalizationDate: '',
    AssetClass: '', AssetType: '',
    AssetSubType: '', UOM: '', AssetName: '',
    AssetDescription: '', Qty: '', Cost: '', WDV: '',
    EquipmentNO: '', AssetCondition: '', AssetCriticality: ''

  };
  ReportForm: FormGroup;
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
  IsSearch: boolean = false;
  isExport: Boolean = false;
  issort: boolean = false;

  public transferIdMultiCtrl: any;
  public transferIdFilterCtrl: FormControl = new FormControl();
  public filteredtransferIdMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

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

  public transfertypeMultiCtrl: any;
  public transfertypeFilterCtrl: FormControl = new FormControl();
  public filteredTransferTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

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

  // displayedHeaders: string[] = [this.Headers.Select, this.Headers.InventoryNumber, this.Headers.AssetNo, this.Headers.SAID, this.Headers.AcquisitionDate, this.Headers.AssetClass, this.Headers.ADL2, this.Headers.ADL3,
  // this.Headers.Quantity, this.Headers.UOM, this.Headers.AcquisitionCost, this.Headers.WDV, this.Headers.EquipmentNumber, this.Headers.AssetCondition, this.Headers.AssetCriticality, this.Headers.Action];
  displayedColumns: any[] = ['select'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  //displayedColumns: string[] = ['select', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
  dataSource = new MatTableDataSource<any>();
  payloadData = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  tempdatasource: any[] = [];
  displayTable: boolean = false;
  displaybtn: boolean = false;
  searchColumns: any[] = [];
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
    private router: Router,
    public alertService: MessageAlertService,
    public us: UserService,
    public AllPathService: AllPathService,
    public reportService: ReportService,
    private jwtAuth: JwtAuthService,private fb: FormBuilder
  ) {
    debugger;
    this.Headers = this.jwtAuth.getHeaders();
    this.message = this.jwtAuth.getResources();
  }
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  paginationParams: any;
  ngOnInit(): void {

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
    this.layerid = this.storage.get(Constants.SESSSION_STORAGE, Constants.LAYER_ID);

    this.cityMultiCtrl = "";
    this.plantMultiCtrl = "";
    this.categoryMultiCtrl = "";
    this.ReportForm = this.fb.group({
      transferIdFilterCtrl: ['', [Validators.required]],
      plantMultiFilterCtrl : ['', [Validators.required]],
    });
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
    this.GetTransferTypes();
    this.GetInitiatedData();
    this.AssetNoFilter.valueChanges.subscribe((AssetNoFilterValue) => {
      this.filteredValues['AssetNo'] = AssetNoFilterValue;
      this.dataSource.filter = this.filteredValues.AssetNo;
    });
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }
  ListOfField: any[] = [];
  ListOfFilter: any[] = [];
  ListOfFilterName: any[] = [];
  ListOfCategory: any[] = [];
  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  ListOfCategory1: any[] = [];
  ExportedFields: any[] = [];
  ListOfInitiatorPermission: any[] = [];
  //searchColumns: any[] = [];
  GetInitiatedData() {

    this.loader.open();
    let url1 = this.cls.GetLocationListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 42);
    let url2 = this.cbs.GetCategoryListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 42);
    let url3 = this.gs.GetFieldListByPageId(42,this.UserId, this.CompanyId);
    let url4 = this.gs.GetFilterIDlistByPageId(42);
    let url5 = this.gs.CheckWetherConfigurationExist(this.GroupId, 14);
    let url6 = this.cbs.GetBlockOfAssetsByCompany(this.CompanyId);
    let url7 = this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.RegionId, "42");
    let url8 = this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.RegionId, "40");
    let url9 = this.us.CheckFreezePeriodStatus(this.GroupId, this.RegionId, this.CompanyId);
    forkJoin([url1, url2, url3, url4, url5, url6, url7, url8, url9]).subscribe(results => {
      if (!!results[0]) {
        this.ListOfLoc = JSON.parse(results[0]);
        this.ListOfLoc1 = this.ListOfLoc
        this.ListOfSBU = this.UniqueArraybyId(this.ListOfLoc, this.Layertext);
        console.log(this.ListOfSBU);
        this.getFilterCityType();
        this.getFilterPlantType();
        this.GetTransferIds();
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
        console.log(this.ListOfFilter);
      }
      this.AssetClassOrcostCenter = results[4];
      if (!!results[5]) {
        this.ListOfBlocks = results[5];
        this.getFilterAssetClassType();
      }
      if (!!results[6]) {
        this.ListOfPagePermission = JSON.parse(results[6]);
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
      if (!!results[7]) {
        this.ListOfInitiatorPermission = JSON.parse(results[7]);
        if (this.ListOfInitiatorPermission.length > 0) {
          for (var i = 0; i < this.ListOfInitiatorPermission.length; i++) {
            this.PermissionIdList.push(this.ListOfInitiatorPermission[i].ModulePermissionId);
          }
          console.log("PagePermission2", this.PermissionIdList)
        }
      }
      if (!!results[8]) {
        debugger;
        var FreezePeriod = results[8];
        if (!!FreezePeriod) {
          this.alertService.alert({ message: this.message.NotAuthorisedToAccessONFreezePeriod, title: this.message.AssetrakSays })
            .subscribe(res => {
              this.router.navigateByUrl('h/a')
            })
        }
      }
      this.loader.close();
      this.GetPageSession();
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
  //========= Transfer Type ===========
  GetTransferTypes() {

    this.rs.GetTransferTypes().subscribe(r => {

      this.result = JSON.parse(r);
      this.transfertype = this.result;
      this.transfertype.forEach(val => {
        if (val.DisplayName == "Location") {
          this.transfertypeMultiCtrl = val;
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
  //========= City ===========
  checkoutInitiationLocations: any;
  ListOfLoc: any[] = [];
  ListOfLoc1: any[] = [];
  ListOfSBU: any[] = [];
  ListOfBlocks: any[] = [];
  AssetClassOrcostCenter: any;
  GetLocationById() {

    console.log(this.transfertypeMultiCtrl);
    var ttype = !!this.transfertypeMultiCtrl ? this.transfertypeMultiCtrl.Id : 0;
    let url1 = this.cls.GetLocationsByCompanyIdToBindSelectListByPageName(this.CompanyId, "physicaltransferapproval", this.GroupId, ttype);
    let url2 = this.ums.GetUsersLocationsByTaskIdsCompanyUserId(97, this.CompanyId, this.UserId);
    let url3 = this.gs.CheckWetherConfigurationExist(this.GroupId, 14);
    let url4 = this.cbs.GetBlockOfAssetsByCompany(this.CompanyId);
    forkJoin([url1, url2, url3, url4]).subscribe(results => {

      if (!!results[1]) {
        this.checkoutInitiationLocations = results[1];
      }
      else {
        this.checkoutInitiationLocations = '';
      }
      if (!!results[0]) {
        var IsCompanyAdmin = 1;//this.IsCompanyAdmin;//!$rootScope.globals.currentUser.IsCompanyAdmin ? 0 : $rootScope.globals.currentUser.IsCompanyAdmin;
        var checkoutInitiationLocations = this.checkoutInitiationLocations;
        this.ListOfLoc = results[0];
        var list = [];
        var listOfLoc = [];
        if (IsCompanyAdmin == 0 && checkoutInitiationLocations != '') {
          list = checkoutInitiationLocations.split(",");
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
            this.ListOfSBU = this.ListOfLoc;
          }
        }
        else if (IsCompanyAdmin == 0 && checkoutInitiationLocations == '') {
          this.ListOfLoc1 = this.ListOfLoc;
          this.ListOfSBU = this.ListOfLoc;
        }
        else if (IsCompanyAdmin === 1) {
          this.ListOfLoc1 = this.ListOfLoc;
          this.ListOfSBU = this.ListOfLoc;
        }
        this.getFilterCityType();
        this.getFilterPlantType();
      }
      if (!!results[2]) {
        this.AssetClassOrcostCenter = results[2];
      }
      if (!!results[3]) {
        this.ListOfBlocks = results[3];
        this.getFilterAssetClassType();
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
    this.reportService.GetCategoryRightWiseForReport(this.CompanyId, this.UserId, PlantList, false, 24).subscribe(r => {
      this.ListOfCategory = [];
      r.forEach(element => {
        // this.ListOfCategory=[];
        this.ListOfCategory.push(element);
        this.getFilterCategoryType();
      });
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
  ListOfTransferId: any[] = [];
  GetTransferIds() {
    this.transferIdMultiCtrl = "";
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
    var assetDetails = {
      LocationIdList: LocationIdList,
      TransferType: !!this.transfertypeMultiCtrl ? this.transfertypeMultiCtrl.Id : 1
    }
    this.rs.GetTransferIdsForPhysicalTransfer(assetDetails).subscribe(r => {

      this.ListOfTransferId = r;
      this.getFilterTransferId()
    })
  }
  getFilterTransferId() {
    this.ListOfTransferId.sort((a,b) =>  a < b ? 1 : a > b ? -1 : 0);
    this.filteredtransferIdMulti.next(this.ListOfTransferId.slice());
    this.transferIdFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterTransferIdMulti();
      });
  }
  protected filterTransferIdMulti() {
    if (!this.ListOfBlocks) {
      return;
    }
    let search = this.transferIdFilterCtrl.value;
    if (!search) {
      this.filteredtransferIdMulti.next(this.ListOfTransferId.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredtransferIdMulti.next(
      this.ListOfTransferId.filter(x => x.toLowerCase().indexOf(search) > -1)
    );
  }
  onEmpty() {
    this.ListOfLoc = this.ListOfLoc1
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
  }
  //====== Bind Data To DataSource========  
  handlePage(pageEvent: PageEvent) {

    this.paginationParams.pageSize = pageEvent.pageSize;
    this.paginationParams.currentPageIndex = pageEvent.pageIndex;
    this.paginationParams.endIndex = (this.paginationParams.currentPageIndex + 1) * pageEvent.pageSize;
    this.paginationParams.startIndex = this.paginationParams.currentPageIndex * pageEvent.pageSize;
    if (!!this.variable && !!this.variable) {
      this.GetAssetForPhysicalTransferBindData("SearchText")
    }
    else if(this.multipleserach= true && this.multiSearch.length > 0) 
    {
      this.GetAssetForPhysicalTransferBindData("multiplesearch");
    }
    else {
      this.GetAssetForPhysicalTransferBindData("")
    }

  }
  GetAssetForPhysicalTransfer() {
    this.selection.clear();
    this.getclear();
    this.Onchange()
    this.numSelected = 0;
    this.getselectedIds = [];
    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;
    this.GetAssetForPhysicalTransferBindData("OnPageload");
  }


  clickToExport() {
    if (this.displayTable == true && this.dataSource.data.length != 0) {
      this.GetAssetForPhysicalTransferBindData("IsExport");
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
  Searchlist :any[];
  GetAssetForPhysicalTransferBindData(Action) {
    if (!this.transferIdMultiCtrl) {
      this.toastr.warning(`Please Select  ${this.Headers.TransferId}`, this.message.AssetrakSays);
      return null;
    }
    this.loader.open();
    var locationId = 0;
    var blockId = 0;
    var locations = "";
   // this.showmultiSearch = false;
    var LocationIdList = [];
    var SbuList = [];
    var CategoryIdList = [];
    var BlockIdList = [];
    var TAIdList = [];
    var subTypeOfAssetList = [];
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
    if(this.panelOpenState && this.showmultiSearch && this.displayTable) {
      this.panelOpenState = false;
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
  
    var assetDetails = {
      CompanyId: this.CompanyId,
      RegionId: this.RegionId,
      GroupId: this.GroupId,
      //LocationId: !!this.plantMultiCtrl ? this.plantMultiCtrl[0].LocationId : 0,
      LocationIdList: LocationIdList,
      pageNo: this.paginationParams.currentPageIndex + 1,
      pageSize: this.paginationParams.pageSize,
      IsSearch: false,
      UserId: this.UserId,
      BlockId: !!this.assetclassMultiCtrl ? this.assetclassMultiCtrl[0].Id : 0,
      TransferId: !!this.transferIdMultiCtrl ? this.transferIdMultiCtrl : 0,
      TransferType: !!this.transfertypeMultiCtrl ? this.transfertypeMultiCtrl.Id : 0,
      IsExport: this.isExport,
      SbuList: SbuList,
      CategoryIdList: CategoryIdList,
      AssetsClassList: BlockIdList,
      typeOfAssetList: TAIdList,
      subTypeOfAssetList: subTypeOfAssetList,
      SearchText: this.serachtext,
      columnName: this.colunname,
      issorting: this.issort,
      PageId: 42,
      ismultiplesearch: this.multipleserach,
      Searchlist : this.Searchlist,
      ExportedFields : this.ExportedFields
    }
    this.rs.GetAssetForPhysicalTransfer(assetDetails).subscribe(r => {

      this.loader.close();
      if (Action === 'IsExport') {
        this.AllPathService.DownloadExportFile(r);
      }
      else {
        this.bindData = JSON.parse(r);
        this.paginationParams.totalCount = 0;
        if (!!this.bindData && this.bindData.length > 0) {
          this.paginationParams.totalCount = this.bindData[0].AssetListCount;
          this.displaybtn = true;
          this.displayTable = true;
        }
        else {
          this.displayTable = true;
          //this.toastr.warning(this.message.NoDataAvailable, this.message.AssetrakSays);
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
    var ApprovalStatus = [];

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

    if (!!this.assetsubtypeMultiCtrl) {
      this.assetsubtypeMultiCtrl.forEach(x => {
        subTypeOfAssetList.push(x.Id);
      })
    }

    var formData = {
      'Pagename': "Physical Transfer",
      'SbuList': [],
      'LocationIdList': LocationIdList,
      'CategoryIdList': CategoryIdList,
      'AssetsClassList': BlockIdList,
      'typeOfAssetList': TAIdList,
      'subTypeOfAssetList': subTypeOfAssetList,
      'TransferType': !!this.transfertypeMultiCtrl ? this.transfertypeMultiCtrl : 1,
      'TransferId': !!this.transferIdMultiCtrl ? this.transferIdMultiCtrl : 0,
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
      if (this.StorePageSession.Pagename === "Physical Transfer") {
        var list = [];
        this.plantMultiCtrl = "";
        this.ListOfLoc1.forEach(x => {

          if (this.StorePageSession.LocationIdList.indexOf(x.LocationId) > -1) {
            list.push(x);
            this.plantMultiCtrl = list;
          }
        })
        list = [];
        this.categoryMultiCtrl = "";
        this.ListOfCategory.forEach(x => {
          if (this.StorePageSession.CategoryIdList.indexOf(x.AssetCategoryId) > -1) {
            list.push(x);
            this.categoryMultiCtrl = list;
          }
        })
        this.transferIdMultiCtrl = this.StorePageSession.TransferId;
        this.GetAssetForPhysicalTransfer();
      }
      else {
        localStorage.setItem('PageSession', null);
        this.StorePageSession = "";
      }
    }
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

  toggleSelectAlltransferId(selectAllValue: boolean) {
    this.filteredtransferIdMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.transferIdMultiCtrl.patchValue(val);
        } else {
          this.transferIdMultiCtrl.patchValue([]);
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
  CourierMode: boolean = false;
  TransferMode: boolean = false;
  HandDeliveryMode: boolean = false;
  CourierquiredFields: boolean = false;
  TransferrquiredFields: boolean = false;
  handDeliveryRequired: boolean = false;
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
  openDialog() {

    if (this.selection.selected.length > 0) {

      var prefarIds = [];
      var locationId = 0;
      var bindData = [];
      const numSelected = this.selection.selected.length;
      for (var i = 0; i < numSelected; i++) {
        prefarIds.push(this.selection.selected[i].PreFarId);
        locationId = this.selection.selected[i].LocationId;
        bindData.push(this.selection.selected[i]);
      }
      var data =
      {
        CompanyId: this.CompanyId,
        LocationId: locationId,
        UserId: this.UserId,
        BlockId: !!this.assetclassMultiCtrl ? this.assetclassMultiCtrl[0].Id : 0,
        pageNo: this.paginationParams.currentPageIndex + 1,
        pageSize: this.paginationParams.pageSize,
        SearchText: "",
        IsSearch: false,
        AssetList: prefarIds.join(','),
        TransferType: !!this.transfertypeMultiCtrl ? this.transfertypeMultiCtrl.Id : 0,
        bindData: bindData,
        GroupId:this.GroupId
      }

      let title = 'Add new member';
      let dialogRef: MatDialogRef<any> = this.dialog.open(PhysicalAssetTransferComponent, {
        width: '85vw',
        maxHeight: '90vh',
        minHeight: '30vh',
        data: { title: title, configdata: data }
      })
      debugger;
      dialogRef.afterClosed().subscribe(result => {
        if (!!result) {
          debugger;
          this.loader.open();
          this.rs.SavePhysicalTransferAsset(result).subscribe(r => {

            this.loader.close();
            if (!!r) {
              this.toastr.success(this.message.AssetDispatchedSuccess, this.message.AssetrakSays);
              this.clearSelected();
            }
            else {
              this.toastr.error(this.message.ErrorMessage, this.message.AssetrakSays);
            }
          })
        }
      })
    }
    else {
      this.toastr.warning(this.message.Selectassetphysicaltransfer, this.message.AssetrakSays);
    }

  }

  viewDocuments(element) {
    debugger;
    var TransferId = !!this.transferIdMultiCtrl ? this.transferIdMultiCtrl : 0;
    this.rs.GetDocumentlistByTransferID(TransferId).subscribe(r => {

      if (!!r) {
        var documentList = [];
        documentList = JSON.parse(r);
        console.log("Doc", documentList)
        const dialogRef = this.dialog.open(ViewUploadDocumentsDialogComponent, {
          width: '980px',
        
          data: { title: "", payload: documentList }
        });
        dialogRef.afterClosed().subscribe(result => {

        })
      }

    })
  }

  openWithdrawDialog(value) {

    var prefarIds = [];
    var locationId = 0;
    var bindData = [];
    if (this.selection.selected.length > 0) {
      const numSelected = this.selection.selected.length;
      var TransferType = !!this.transfertypeMultiCtrl ? this.transfertypeMultiCtrl.Id : 1;
      for (var i = 0; i < numSelected; i++) {
        prefarIds.push(this.selection.selected[i].PreFarId);
        locationId = this.selection.selected[i].LocationId;
        bindData.push(this.selection.selected[i]);
      }
      let configdata = {
        CompanyId: this.CompanyId,
        GroupId: this.GroupId,
        LocationId: locationId,
        UserId: this.UserId,
        AssetList: prefarIds.join(','),
        TransferType: TransferType,
        TransferId: !!this.transferIdMultiCtrl ? this.transferIdMultiCtrl : 0,
        BlockId: !!this.assetclassMultiCtrl ? this.assetclassMultiCtrl[0].Id : 0,
        pageNo: this.paginationParams.currentPageIndex + 1,
        pageSize: this.paginationParams.pageSize,
        SearchText: "",
        IsSearch: false,
        bindData: bindData
        //Windrawtransfer: "Physical_movement",
      }
      const dialogRef = this.dialog.open(AssetTransferPhysicalWithdrawDialogComponent, {
        width: '980px',

        data: { title: value, payload: this.selection.selected, configdata: configdata }
      });
      dialogRef.afterClosed().subscribe(result => {

        if (!!result) {
          this.loader.open();
          this.rs.MultipleWithdrawTransferByInitiator(result).subscribe(r => {

            this.loader.close();
            if (r == "Asset Transfer Withdrawn Successfully") {
              this.toastr.success(this.message.AssetWithdrawerSuccess, this.message.AssetrakSays);
            }
            this.clearSelected();
          })
        }
      })
    }
    else {
      this.toastr.warning(this.message.SelectAssetstowithdrawnTransfer, this.message.AssetrakSays);
    }
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
    this.selection.clear();
    this.getclear();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.GetAssetForPhysicalTransferBindData("")
  }
  numSelected: any = 0;
  getselectedIds: any[] = [];
  isAllSelected: boolean = false;
  masterToggle() {

    this.isAllSelected = !this.isAllSelected;
    this.getselectedIds = [];
    this.selection.clear();
    if (this.isAllSelected == true) {
      this.dataSource.data.forEach(row => {
        if (row.allocatedStatus != 'Asset In Project') {
          this.selection.select(row);
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

  opentablePopup(columnName) {

  }
  PageId =42;
  ReportFlag :boolean = false;
  openPopUp(data: any = {}) {
    debugger;
    this.ReportFlag = false;
    this.ListOfField.forEach((element,index)=>{
      if(element.Custom1 == 'TransferDocument') 
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

  openFilter_PopUp() {
    // let title = 'Add new member';
    // let dialogRef: MatDialogRef<any> = this.dialog.open(filterPopupComponent, {
    //   width: '65vw',
    //   maxHeight: '90vh',
    //   minHeight: '30vh',
    //   disableClose: true,
    //   data: { prop: this.sendData }
    // })
    // dialogRef.afterClosed()
    //   .subscribe(result => {
    //      
    //     console.log(result);
    //     this.sendData = result;
    //     if (result.length > 0)
    //       for (let i = 0; i < result.length; i++) {
    //         this.appliedfilters.push(result[i].name);
    //       }
    //     console.log(this.appliedfilters);
    //   })
  }


  clearfilter() {
    // if (this.appliedfilters.length > 0) {
    //   while (this.appliedfilters.length > 0) {
    //     this.appliedfilters.splice(this.appliedfilters.length - 1);
    //     console.log(this.appliedfilters);
    //   }
    // }
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
      this.GetAssetForPhysicalTransferBindData("SearchText");
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
    this.GetAssetForPhysicalTransferBindData("");

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
          this.GetAssetForPhysicalTransferBindData("")
        } else {
          this.variable1 = $event.active;
          this.GetAssetForPhysicalTransferBindData("Sort")
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
  //multiSearch: any[] = [];
  multiSearchAdd() {

    this.showmultiSearch = !this.showmultiSearch;
    this.multiSearch = [];
    if(!!this.showmultiSearch)
        this.addSearch();
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
 removeSearch(idx){
  this.multiSearch.splice(idx , 1);
  this.onChangeAdvancedSearch(); 
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
  this.GetAssetForPhysicalTransferBindData("multiplesearch");
  console.log(this.multiSearch);
   }

  }
  setStep() {	
    this.panelOpenState = true; 	
  }	
  hideSearch : boolean = false;
  searchCount : any = 0;
  clearSearchData(){
    this.showmultiSearch = !this.showmultiSearch;
    this.multiSearch = [];
    if(!!this.hideSearch)
      this.GetAssetForPhysicalTransferBindData("");
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
//   addSearch() {
//     var data = {
//       fieldname: '',
//       Tablename: '',
//       Condition: '',
//       HighValue: '',
//       LowValue: ''
//     }
//     this.multiSearch.push(data);
//   }
//   removeSearch(idx){
//     this.multiSearch.splice(idx , 1);
//     this.onChangeAdvancedSearch(); 
//   }
//   SelectionColumn(ele , item){
//     debugger;
//    item.fieldname = ele.FieldName;
//    item.OptionType = ele.SearchOptionType;
//    this.ListOfField.forEach(val => {
//      if(val.FieldName == ele.FieldName){
//        item.Tablename = val.Tables;
//      }
//    })
//  }
//  clearInput(val:any){	
//   val.HighValue = '';	
// }
// }
// hideSearch : boolean = false;
//   searchCount : any = 0;
//   clearSearchData(){
//     this.showmultiSearch = !this.showmultiSearch;
//     this.multiSearch = [];
//     if(!!this.hideSearch)
//       this.GetAssetForPhysicalTransferBindData("");
//   }
//   onChangeAdvancedSearch(){
//     this.searchCount = 0;
//     this.hideSearch = false;
//     this.multiSearch.forEach(val => {
//       if(!!val.HighValue){
//         this.hideSearch = true;
//         this.searchCount = this.searchCount + 1;
//       }
//     })
//   }
//   setStep() {	
//     this.panelOpenState = true; 	
//   }	
//   changeState() {	
     	
//     this.panelOpenState = false;	
//   }
//   openMultiSearchDialog(val:any){	
//     let title = 'Create list of values to search';	
//     const dialogRef = this.dialog.open(MultiSearchDialogComponent, {	
//       width: 'auto',	
//       height: 'auto',	
//       data: { title: title, payload: '' }	
//     })	
//     dialogRef.afterClosed().subscribe(result => {	
//       if (!!result) {           	
//         console.log(result)	
//         if(result.length>1)	
//         val.HighValue = result[0].name+','+result[1].name+'...';	
//         else val.HighValue = result[0].name;	
//       }	
//     })	
//   }	
}
