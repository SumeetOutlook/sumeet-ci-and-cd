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
import { GetFieldsComponent } from 'app/components/partialView/get-fields/get-fields.component'
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { PhysicalDisposalDialogComponent } from '../dialog/physical-disposal-dialog/physical-disposal-dialog.component';
import { assetTabsComponent } from '../../partialView/assetDetails/asset_tabs.component';
import { ReconciliationService } from '../../services/ReconciliationService';
import { CompanyLocationService } from '../../services/CompanyLocationService';
import { UserMappingService } from '../../services/UserMappingService';
import { CompanyBlockService } from '../../services/CompanyBlockService';
import { GroupService } from '../../services/GroupService';
import { AssetRetireService } from '../../services/AssetRetireService';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { UserService } from '../../services/UserService';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as menuheaders from '../../../../assets/MenuHeaders.json';
import { Sort } from '@angular/material/sort';
import { ReportService } from 'app/components/services/ReportService';
import { GroupDetailsComponent } from 'app/components/partialView/group-details/group-details.component';
import { AllPathService } from 'app/components/services/AllPathServices';
import { ViewUploadDocumentsDialogComponent } from '../../partialView/view-upload-documents-dialog/view-upload-documents-dialog.component';
import {RetirementDisposalWithdrawDialogComponent} from '../dialog/retirement-disposal-withdraw-dialog/retirement-disposal-withdraw-dialog.component';
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
  selector: 'app-physical-disposal',
  templateUrl: './physical-disposal.component.html',
  styleUrls: ['./physical-disposal.component.scss']
})
export class PhysicalDisposalComponent implements OnInit {

  Headers: any = [];
  message: any;
  ReportForm: FormGroup;
  numRows: number;
  selectedValue: string;
  IsDisabled: boolean = true;
  setflag: boolean=false;
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
  private isApprovalLevelButtonVisible = false;
  menuheader: any = (menuheaders as any).default
  public bindData: any[];
  public arrlength = 0;
  public arr = [];
  public newdataSource = [];
  public isallchk: boolean;
  public getselectedData: any[] = [];
  public selecteddatasource: any[] = [];
  public appliedfilters: any[] = [];

  /////Filter Instance/////////
  AssetNoFilter = new FormControl();
  ApprovalLevelFilter = new FormControl();
  AssetClassFilter = new FormControl();
  TransferTypeFilter = new FormControl();

  filteredValues = {
    AssetNo: '', ApprovalLevel: '', SubNo: '', CapitalizationDate: '',
    AssetClass: '', AssetType: '',
    AssetSubType: '', UOM: '', AssetName: '',
    AssetDescription: '', Qty: '', Cost: '', WDV: '',
    EquipmentNO: '', AssetCondition: '', AssetCriticality: ''
  };


  result: any[] = [];
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
  issort: boolean = false;
  searchColumns: any[] = [];
  public assetstatusMultiCtrl: any;
  public assetstatusMultifilterCtrl: FormControl = new FormControl();

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

  public retirementIdMultiCtrl: any;
  public retirementIdFilterCtrl: FormControl = new FormControl();
  public filteredretirementIdMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  protected _onDestroy = new Subject<void>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: any[] = ['select'];
  // displayedColumns: string[] = ['select', '2', '3', '4', '5', '6', '26', '7', '8', '27','28', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  tempdatasource: any[] = [];
  displayTable: boolean = false;
  displaybtn: boolean = false;
  AssetStatusData: any[] = [];
  multiSearch : any[]=[];
  Searchlist :any[];
  multipleserach : boolean= false;
  @Output() insuranceEndDate: EventEmitter<any> = new EventEmitter<any>();
  constructor(public dialog: MatDialog,
    public rs: ReconciliationService,
    public cls: CompanyLocationService,
    public ums: UserMappingService,
    public cbs: CompanyBlockService,
    public gs: GroupService,
    public toastr: ToastrService,
    public ars: AssetRetireService,
    private storage: ManagerService,
    private loader: AppLoaderService,
    public us: UserService,
    private router: Router,
    public alertService: MessageAlertService,
    public confirmService: AppConfirmService,
    public reportService: ReportService,
    public AllPathService: AllPathService,
    private jwtAuth: JwtAuthService,private fb: FormBuilder
    ){
       this.Headers = this.jwtAuth.getHeaders();
       this.message = this.jwtAuth.getResources();
      this. AssetStatusData = [
        { value: 'ReadyToDisposal', viewValue: this.Headers.ReadyToDisposal },
        { value: 'PhysicalDisposal', viewValue: this.Headers.PhysicalDisposal },
      ];
    }
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  paginationParams: any;
  ngOnInit(): void {
    debugger;
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

    this.ReportForm = this.fb.group({
      retirementIdFilterCtrl: ['', [Validators.required]],
      assetstatusMultifilterCtrl: ['', [Validators.required]],
    });
    this.cityMultiCtrl = "";
    this.plantMultiCtrl = "";
    this.categoryMultiCtrl = "";
    this.assetclassMultiCtrl = "";

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

    this.AssetNoFilter.valueChanges.subscribe((AssetNoFilterValue) => {
      this.filteredValues['AssetNo'] = AssetNoFilterValue;
      this.dataSource.filter = this.filteredValues.AssetNo;
    });
    this.dataSource.filterPredicate = this.customFilterPredicate();

  }

  //========= Transfer Type =========== 
  ListOfField: any[] = [];
  ListOfFilter: any[] = [];
  ListOfFilterName: any[] = [];
  ListOfCategory: any[] = [];
  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  ListOfLoc1: any;
  ListOfCategory1 : any[] = [];
  ExportedFields: any[] = [];
  ListOfInitiatorPermission: any[] = [];
  //searchColumns: any[] = [];
  GetInitiatedData() {
    debugger;
    let url1 = this.cls.GetLocationListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 49);
    let url2 = this.cbs.GetCategoryListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 49);
    let url3 = this.gs.GetFieldListByPageId(49,this.UserId, this.CompanyId);
    let url4 = this.gs.GetFilterIDlistByPageId(49);
    let url5 = this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.RegionId, "49");
    let url6 = this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.RegionId, "47");
    let url7 = this.us.CheckFreezePeriodStatus(this.GroupId, this.RegionId, this.CompanyId);
    forkJoin([url1, url2, url3, url4, url5 , url6, url7]).subscribe(results => {
      if (!!results[0]) {
        this.ListOfLoc = JSON.parse(results[0]);
        this.ListOfLoc1 = this.ListOfLoc
        this.ListOfSBU = this.UniqueArraybyId(this.ListOfLoc, this.Layertext);
        console.log(this.ListOfSBU);
        this.getFilterCityType();
        this.getFilterPlantType();
        //this.GetAllRetiredId();
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
        this.displayedColumns = this.displayedColumns.filter(x => x.Custom2 == "1").map(choice => choice.Custom1);
        this.displayedColumns = ['Select','Icon'].concat(this.displayedColumns);
      }
      if (!!results[3]) {
        this.ListOfFilter = JSON.parse(results[3]);
        if (!!this.ListOfFilter) {
          this.ListOfFilter.forEach(x => this.ListOfFilterName.push(x.FilterName))
        }
        console.log(this.ListOfFilter);
      }
      if (!!results[4]) {
        debugger;
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
      if (!!results[5]) {
        this.ListOfInitiatorPermission = JSON.parse(results[5]);
        if (this.ListOfInitiatorPermission.length > 0) {
          for (var i = 0; i < this.ListOfInitiatorPermission.length; i++) {
            this.PermissionIdList.push(this.ListOfInitiatorPermission[i].ModulePermissionId);
          }
          console.log("PagePermission2", this.PermissionIdList)
        }
      }
      if (!!results[6]) {
        debugger;
        var FreezePeriod = results[6];
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

  StorePageSession: any;
  GetPageSession() {
    this.StorePageSession = "";
    if (!!localStorage.getItem('PageSession') && localStorage.getItem('PageSession') != "null") {
      this.StorePageSession = {}
      this.StorePageSession = JSON.parse(localStorage.getItem('PageSession'));
      if (this.StorePageSession.Pagename === "Physical Disposal") {
        
      }
      else {
        localStorage.setItem('PageSession', null);
        this.StorePageSession = "";
      }
    }
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
  //========= City ===========
  checkoutInitiationLocations: any;
  ListOfLoc: any[] = [];
  ListOfSBU: any[] = [];
  ListOfBlocks: any[] = [];
  AssetClassOrcostCenter: any;
  GetLocationById() {
    debugger;
    let url1 = this.cls.GetLocationsByCompanyIdToBindSelectListByPageName(this.CompanyId, "physicalDisposal", this.GroupId, 0);
    let url2 = this.ums.GetUsersLocationsByTaskIdsCompanyUserId(109, this.CompanyId, this.UserId);
    let url3 = this.gs.CheckWetherConfigurationExist(this.GroupId, 14);
    forkJoin([url1, url2, url3]).subscribe(results => {
      debugger;
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
            debugger;
            this.ListOfLoc = listOfLoc;
            this.ListOfSBU = this.ListOfLoc;
          }
        }
        else if (IsCompanyAdmin === 1) {
          this.ListOfLoc = this.ListOfLoc;
          this.ListOfSBU = this.ListOfLoc;
        }
        this.getFilterCityType();
        this.getFilterPlantType();
      }
      this.AssetClassOrcostCenter = results[2];
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
        this.displayedColumns = ['Select','Icon'].concat(this.displayedColumns);
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

  CheckRights() {
    debugger;
    var locationId = 0;
    var userRights = "Physical Asset Disposal Approver";
    var isCheckOutInitiationRights = "";
    this.rs.CheckRights(locationId, this.CompanyId, this.UserId, userRights).subscribe(r => {
      debugger;
      isCheckOutInitiationRights = r.toString();
      if (isCheckOutInitiationRights == '1') {
        this.cbs.GetBlockOfAssetsByCompany(this.CompanyId).subscribe(r1 => {
          debugger;
          this.ListOfBlocks = r1;
          this.getFilterAssetClassType();
        })
      }
      else {
        if (locationId != null && locationId > 0) { }
        else {
          this.cbs.GetBlocksByLocUser(0, this.UserId, this.CompanyId).subscribe(r1 => {
            debugger;
            this.ListOfBlocks = r1;
            this.getFilterAssetClassType();
          })
        }
      }
    })
  }
  clickToExport() {
    if(this.displayTable == true && this.dataSource.data.length != 0){
      this.GetAssetForPhysicalDisposalBindData("IsExport");
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

  onEmpty() {
    this.ListOfLoc = this.ListOfLoc1
    this.getFilterPlantType();
  }

  // onchangeSBU(value) {
  //   this.plantMultiCtrl = "";
  //   this.retirementIdMultiCtrl = "";
  //   this.assetstatusMultiCtrl = "";
  //   if (!!value) {
  //     this.ListOfLoc = this.ListOfLoc1.filter(x => x[this.Layertext].indexOf(value) > -1);
  //     this.getFilterPlantType();
  //   }
  //   else {
  //     this.ListOfLoc = this.ListOfLoc1.filter(x => x);
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
  ListOfRetiredId: any[] = [];
  disabled: boolean;
  GetAllRetiredId() {
    debugger;
    this.showmultiSearch = false;
    this.retirementIdMultiCtrl = "";
    var LocationIdList = [];
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
    var Status = !this.assetstatusMultiCtrl ? null : this.assetstatusMultiCtrl;
    if (Status == "ReadyToDisposal") {
      Status = "P";
    }
    if (Status == "PhysicalDisposal") {
      Status = "P1";
    }
    var assetDetails = {
      CompanyId: this.CompanyId,
      LocationIdList: LocationIdList,
      AssetStatus: Status
    }
    this.rs.GetAllPhysicalDisposalRetiredAssetId(assetDetails).subscribe(r => {
      debugger;
      this.ListOfRetiredId = JSON.parse(r);
      this.getFilterTransferId()
    })
  }
  getFilterTransferId() {
    this.ListOfRetiredId.sort((a,b) =>  a < b ? 1 : a > b ? -1 : 0);
    this.filteredretirementIdMulti.next(this.ListOfRetiredId.slice());
    this.retirementIdFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterTransferIdMulti();
      });
  }
  protected filterTransferIdMulti() {
    if (!this.ListOfBlocks) {
      return;
    }
    let search = this.retirementIdFilterCtrl.value;
    if (!search) {
      this.filteredretirementIdMulti.next(this.ListOfRetiredId.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredretirementIdMulti.next(
      this.ListOfRetiredId.filter(x => x.toLowerCase().indexOf(search) > -1)
    );
  }
  toggleSelectAllcategory(selectAllValue) {
    this.categoryMultiCtrl =[];
    this.filteredcategoryMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (!!selectAllValue.checked) {
          this.ListOfCategory.forEach(element => {
            this.categoryMultiCtrl.push(element);
          });  
        } else {
          this.categoryMultiCtrl="";
        }
      });
  }
  //====== Bind Data To DataSource========  
  handlePage(pageEvent: PageEvent) {
    debugger;
    this.paginationParams.pageSize = pageEvent.pageSize;
    this.paginationParams.currentPageIndex = pageEvent.pageIndex;
    this.paginationParams.endIndex = (this.paginationParams.currentPageIndex + 1) * pageEvent.pageSize;
    this.paginationParams.startIndex = this.paginationParams.currentPageIndex * pageEvent.pageSize;
    if (!!this.variable && !!this.variable) {
      this.GetAssetForPhysicalDisposalBindData("SearchText")
    }
    else if (this.multipleserach = true && this.multiSearch.length > 0) {
      this.GetAssetForPhysicalDisposalBindData("multiplesearch");
    }
    else {
      this.GetAssetForPhysicalDisposalBindData("")
    }

  }
  isExport: boolean = false;
  //Searchlist :any[];
  GetAssetForPhysicalDisposal() {
    this.selection.clear();
    this.getclear();
    this.Onchange();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.readyToDisposal = [];
    this.physicalDisposal = [];
    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;
    this.GetAssetForPhysicalDisposalBindData("OnPageload");
  }
  showmultiSearch:any=false;
  GetAssetForPhysicalDisposalBindData(Action) {
    debugger;
    if(!this.retirementIdMultiCtrl){
      this.toastr.warning(`Please Select ${this.Headers.RetirementId}`, this.message.AssetrakSays);
      return null;
    }
    this.loader.open();
    var LocationIdList = [];
    var SbuList = [];
    var CategoryIdList = [];
    var BlockIdList = [];
    var TAIdList = [];
    var subTypeOfAssetList = [];
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
    var Status = !this.assetstatusMultiCtrl ? null : this.assetstatusMultiCtrl;
    if (Status == "ReadyToDisposal") {
      Status = "P";
    }
    if (Status == "PhysicalDisposal") {
      Status = "P1";
    }

    //===== Sorting and Searching ===
    this.isExport = false;
    this.issort = false;
    this.IsSearch = false;
   // this.showmultiSearch = false;
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
      GroupId: this.GroupId,
      RegionId: this.RegionId,
      LocationIdList: LocationIdList,
      pageNo: this.paginationParams.currentPageIndex + 1,
      pageSize: this.paginationParams.pageSize,
      UserId: this.UserId,
      //SearchText: '',
      IsSearch: false,
      RetiredId: !!this.retirementIdMultiCtrl ? this.retirementIdMultiCtrl : 0,
      IsExport:  this.isExport,
      BlockId: !!this.assetclassMultiCtrl ? this.assetclassMultiCtrl[0].Id : 0,
      AssetStatus: Status,
      typeOfAssetList: TAIdList,
      subTypeOfAssetList: subTypeOfAssetList,
      SbuList: SbuList,
      CategoryIdList: CategoryIdList,
      AssetsClassList: [],
      SearchText: this.serachtext,
      columnName: this.colunname,
      issorting: this.issort,
      PageId : 49,
      ismultiplesearch: this.multipleserach,
      Searchlist : this.Searchlist,
      ExportedFields : this.ExportedFields
    }
    this.rs.GetAssetForPhysicalDisposal(assetDetails).subscribe(r => {
      debugger;
      this.loader.close();
      this.bindData = [];
      if(Action === 'IsExport')
      {
        debugger;
        if(!!r)
        {
          this.AllPathService.DownloadExportFile(r);
          console.log("URL", URL);
        }
      }
      else {
      this.bindData = JSON.parse(r);
      console.log(this.bindData);
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
    this.dataSource.sort = this.sort;
    this.isAllSelected = false;
    var ids = [];
    debugger;
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
  ReadyToDisposed() {
    if (this.selection.selected.length) {
      this.confirmService.confirm({ message: this.message.ReadyToDisposedNotification, title: this.message.AssetrakSays })
        .subscribe(res => {
          if (!!res) {
            var prefarIds = [];
            var locationId = 0;
            const numSelected = this.selection.selected.length;
            for (var i = 0; i < numSelected; i++) {
              prefarIds.push(this.selection.selected[i].PreFarId);
              locationId = this.selection.selected[i].LocationId;
            }
            var assetsDetails =
            {
              CompanyId: this.CompanyId,
              LocationId: locationId,
              UserId: this.UserId,
              BlockId: !!this.assetclassMultiCtrl ? this.assetclassMultiCtrl[0].Id : 0,
              AssetList: prefarIds.join(',')
            }
            this.loader.open();
            this.rs.AssetReadyToDisposal(assetsDetails).subscribe(r => {
              debugger;
              this.loader.close();
              if (!r) {
                this.toastr.error(this.message.ErrorMessage, this.message.AssetrakSays);
              }
              else {
                this.toastr.success(this.message.AssetReadyDisposeSucess, this.message.AssetrakSays);
              }
              this.clearSelected();
            })
          }
        })
    }
    else {
      this.toastr.warning(this.message.AssetsNotAvailableReadyToDisposed, this.message.AssetrakSays);
    }
  }
  openDialog() {
    debugger;
    var ProposedSellingAmount = 0;
    var ProposedSellingAmount1 = 0;
    var DiscardType;
    var DiscardValue;
    if (this.selection.selected.length) {
      var prefarIds = [];
      var locationId = [];
      var bindData = [];
      const numSelected = this.selection.selected.length;
      for (var i = 0; i < numSelected; i++) {
        prefarIds.push(this.selection.selected[i].PreFarId);
        var Amount = !this.selection.selected[i].Amount ? "0" : this.selection.selected[i].Amount;
        ProposedSellingAmount1 = ProposedSellingAmount1 + Number(Amount);
        ProposedSellingAmount= parseFloat(ProposedSellingAmount1.toFixed(3));
        DiscardType = this.selection.selected[i].DiscardType;
        DiscardValue = this.selection.selected[i].DiscardValue;
        locationId = this.selection.selected[i].LocationId;
        bindData.push(this.selection.selected[i]);
      }
      let configdata = {
        CompanyId: this.CompanyId,
        GroupId: this.GroupId,
        LocationId: locationId,
        UserId: this.UserId,
        AssetList: prefarIds.join(','),
        BlockId: !!this.assetclassMultiCtrl ? this.assetclassMultiCtrl[0].Id : 0,
        ProposedSellingAmount: ProposedSellingAmount,
        DiscardType: DiscardType,
        DiscardValue: DiscardValue,
        bindData: bindData
      }
      const dialogRef = this.dialog.open(PhysicalDisposalDialogComponent, {
        width: '980px',
   
        data: { title: '', configdata: configdata }
      });
      dialogRef.afterClosed().subscribe(result => {
        debugger;
        if (!!result) {
          this.loader.open();
          this.rs.SavePhysicalDisposalAsset(result).subscribe(r => {
            debugger;
            this.loader.close();
            if (!r) {
              this.toastr.error(this.message.ErrorMessage, this.message.AssetrakSays);
            }
            else {
              this.toastr.success(this.message.AssetPhysicalDisposeSucess, this.message.AssetrakSays);
            }
            this.clearSelected();
          })
        }
      })
    }
    else {
      this.toastr.warning(this.message.AssetsNotAvailableForPhysicalDisposal, this.message.AssetrakSays);
    }
  }
  
  numSelected: any = 0;
  getselectedIds: any[] = [];
  isAllSelected: boolean = false;
  masterToggle() {
    debugger;
    this.isAllSelected = !this.isAllSelected;
    this.getselectedIds = [];
    this.readyToDisposal = [];
    this.physicalDisposal = [];
    if (this.isAllSelected == true) {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
    else {
      this.dataSource.data.forEach(row => this.selection.toggle(row));
    }
    this.numSelected = this.selection.selected.length;
    if (this.numSelected > 0) {
      this.selection.selected.forEach(row => {
        this.getselectedIds.push(row.PreFarId);
        if (row.allocatedStatus == 'Ready To Disposal') {
          this.readyToDisposal.push(row.PreFarId);
        }
        if (row.allocatedStatus == 'Physical Disposal') {
          this.physicalDisposal.push(row.PreFarId);
        }
      });
    }
  }
  readyToDisposal: any[] = [];
  physicalDisposal: any[] = [];
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

    if (row.allocatedStatus == 'Ready To Disposal') {
      var idx = this.readyToDisposal.indexOf(row.PreFarId);
      if (idx > -1) {
        this.readyToDisposal.splice(idx, 1);
      }
      else {
        this.readyToDisposal.push(row.PreFarId);
      }
    }
    if (row.allocatedStatus == 'Physical Disposal') {
      var idx = this.physicalDisposal.indexOf(row.PreFarId);
      if (idx > -1) {
        this.physicalDisposal.splice(idx, 1);
      }
      else {
        this.physicalDisposal.push(row.PreFarId);
      }
    }
  }

  viewDocuments(element) {
    var RetiredId = !!this.retirementIdMultiCtrl ? this.retirementIdMultiCtrl : 0
    this.ars.GetDocumentlistByRetireAssetID(RetiredId).subscribe(r => {
      
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
    this.plantMultiCtrl=[];
    this.filteredPlantsMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {       
        if (!!selectAllValue.checked) {
          //this.plantMultiCtrl.patchValue(val);
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

  toggleSelectAllretirementId(selectAllValue: boolean) {
    this.filteredretirementIdMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.retirementIdMultiCtrl.patchValue(val);
        } else {
          this.retirementIdMultiCtrl.patchValue([]);
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
  clearSelected() {
    this.getclear();
    this.selection.clear();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.readyToDisposal = [];
    this.physicalDisposal = [];
    this.GetAssetForPhysicalDisposalBindData("");
  }
  PageId =49;
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
    debugger;
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
      this.GetAssetForPhysicalDisposalBindData("SearchText");
    }
  }
  ClearSerch(columnName, isflag) {
    debugger;
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
    this.GetAssetForPhysicalDisposalBindData("");

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
          this.GetAssetForPhysicalDisposalBindData("")
        } else {
          this.variable1 = $event.active;
          this.GetAssetForPhysicalDisposalBindData("Sort")
        }
      }
    }
  }

  openWithdrawDialog(value) {
    debugger;
    if (this.selection.selected.length > 0) {
    var prefarIds = [];
    var LocationIdList = [];
    var locationId = 0;
    var SbuList = [];
    var CategoryIdList = [];
    var BlockIdList = [];
    var TAIdList = [];
    var subTypeOfAssetList = [];
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
    var Status = !this.assetstatusMultiCtrl ? null : this.assetstatusMultiCtrl;
    if (Status == "ReadyToDisposal") {
      Status = "P";
    }
    if (Status == "PhysicalDisposal") {
      Status = "P1";
    }
    var bindData = [];
      const numSelected = this.selection.selected.length;
     // var TransferType = !!this.transfertypeMultiCtrl ? this.transfertypeMultiCtrl.Id : 1;
      for (var i = 0; i < numSelected; i++) {
        prefarIds.push(this.selection.selected[i].PreFarId);
        locationId = this.selection.selected[i].LocationId;
        bindData.push(this.selection.selected[i]);
      }
      
      let configdata = {
        CompanyId: this.CompanyId,
        GroupId: this.GroupId,
        locationId: locationId,
        UserId: this.UserId,
        AssetList: prefarIds.join(','),
        RetiredId: !!this.retirementIdMultiCtrl ? this.retirementIdMultiCtrl : 0,
        IsExport:  this.isExport,
        BlockId: !!this.assetclassMultiCtrl ? this.assetclassMultiCtrl[0].Id : 0,
        AssetStatus: Status,
        typeOfAssetList: TAIdList,
        subTypeOfAssetList: subTypeOfAssetList,
        SbuList: SbuList,
        CategoryIdList: CategoryIdList,
        bindData : bindData
    
      }
      debugger;
      const dialogRef = this.dialog.open(RetirementDisposalWithdrawDialogComponent, {
        width: '980px',
      
        data: { title: value, payload: this.selection.selected, configdata: configdata }
      });
      dialogRef.afterClosed().subscribe(result => {
        debugger;
        if (!!result) {
          this.loader.open();
          this.ars.RejectRetirementByMultipleWithdraw(result).subscribe(r => {
          debugger;
            this.loader.close();
            if (r == "Asset Retirement Withdrawn Successfully") {
              this.toastr.success(this.message.Assetretirementwithdrawnsuccessfully, this.message.AssetrakSays);
            }
            else if (r == "not authorized") {
              this.toastr.warning(this.message.NotAuthorizedtoReject, this.message.AssetrakSays);
            }
            else if (r == "Asset already approved.") {
              this.toastr.error(this.message.ActionAlreadyTaken, this.message.AssetrakSays);
            }
            else {
              this.toastr.error(r, this.message.AssetrakSays);
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
onMultiSearchClick(){

  debugger;
  if(this.searchCount == 0){
    this.toastr.warning(`Please Select All Fields`, this.message.AssetrakSays);
    return null;
   }
   else{
  this.multipleserach= true ;
  this.GetAssetForPhysicalDisposalBindData("multiplesearch");
  console.log(this.multiSearch);
   }

}
  //multipleserach: boolean = false;
  // onMultiSearchClick() {

  //   debugger;
  //   this.multipleserach = true;
  //   //this.GetAssetForTransfserBindData("multiplesearch");
  //   console.log(this.multiSearch);

  // }
  setStep() {	
    this.panelOpenState = true; 	
  }	
  hideSearch : boolean = false;
  searchCount : any = 0;
  clearSearchData(){
    this.showmultiSearch = !this.showmultiSearch;
    this.multiSearch = [];
    if(!!this.hideSearch)
      this.GetAssetForPhysicalDisposalBindData("");
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
  multiSearchAdd(){
  
    this.showmultiSearch = !this.showmultiSearch;
    this.multiSearch = [];
    if(!!this.showmultiSearch)
        this.addSearch();
    
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
//     this.onChangeAdvancedSearch();  
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
// openMultiSearchDialog(val:any){	
//   let title = 'Create list of values to search';	
//   const dialogRef = this.dialog.open(MultiSearchDialogComponent, {	
//     width: 'auto',	
//     height: 'auto',	
//     data: { title: title, payload: '' }	
//   })	
//   dialogRef.afterClosed().subscribe(result => {	
//     if (!!result) {           	
//       console.log(result)	
//       if(result.length>1)	
//       val.HighValue = result[0].name+','+result[1].name+'...';	
//       else val.HighValue = result[0].name;	
//     }	
//   })	
// }	
// hideSearch : boolean = false;
// searchCount : any = 0;
// onChangeAdvancedSearch(){
//   this.searchCount = 0;
//   this.hideSearch = false;
//   this.multiSearch.forEach(val => {
//     if(!!val.HighValue){
//       this.hideSearch = true;
//       this.searchCount = this.searchCount + 1;
//     }
//   })
// }
// multiSearchAdd(){
//   this.showmultiSearch = !this.showmultiSearch;
//   this.multiSearch = [];
//   if(!!this.showmultiSearch)
//       this.addSearch();
// }
}
