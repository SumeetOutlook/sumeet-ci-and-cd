import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild,Output,EventEmitter  } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { LocalStoreService } from 'app/shared/services/local-store.service';
import { assetTabsComponent } from '../../partialView/assetDetails/asset_tabs.component';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';

import { ReviewDialogComponent } from './review_dialog/review-dialog.component';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { MapadditionalDialogComponent } from '../approveTagging/mapadditional_dialog/mapadditional-dialog.component';
import { MapadditionalassetDialogComponent } from '../approveTagging/mapadditionalAsset_dialog/mapadditionalasset-dialog.component';
import { ApproveRejectComponent } from './approve_reject_popup/approvereject.component';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { GroupService } from '../../services/GroupService';

import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/UserService';
import { ToastrService } from 'ngx-toastr';
import { CompanyLocationService } from '../../services/CompanyLocationService';
import { AssetService } from '../../services/AssetService';
import { CompanyBlockService } from '../../services/CompanyBlockService';
import { AllPathService } from '../../services/AllPathServices';
import { GetFieldsComponent } from 'app/components/partialView/get-fields/get-fields.component'
import * as menuheaders from '../../../../assets/MenuHeaders.json';
import { Sort } from '@angular/material/sort';
import { GroupDetailsComponent } from 'app/components/partialView/group-details/group-details.component';
import { ITAssetsService } from '../../../components/services/ITAssetsService';
import { CompanyService } from '../../../components/services/CompanyService';
import { AuditService } from '../../../components/services/AuditService';
import { date } from 'ngx-custom-validators/src/app/date/validator';
import { ExportFieldsComponent } from 'app/components/partialView/export-fields/export-fields.component'; 
import { MultiSearchDialogComponent } from 'app/components/partialView/multi-search-dialog/multi-search-dialog.component';
interface SBU {
  id: string;
  name: string;
}

interface Plant {
  id: string;
  name: string;
}

interface AssetClass {
  id: string;
  name: string;
}

interface AssetStatus {
  id: string;
  name: string;
}

interface Inventory {
  id: string;
  name: string;
}

interface Status {
  id: string;
  name: string;
}

interface AssetType {
  id: string;
  name: string;
}

interface AssetSubType {
  id: string;
  name: string;
}

interface Company {
  id: string;
  name: string;
}

interface Region {
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
  selector: 'app-approvetagging',
  templateUrl: './approvetagging.component.html',
  styleUrls: ['./approvetagging.component.scss']
})
export class ApprovetaggingComponent implements OnInit {

  constructor(public gs: GroupService, private httpService: HttpClient, public localService: LocalStoreService, private storage: ManagerService,
    public dialog: MatDialog, private confirmService: AppConfirmService, private loader: AppLoaderService, private jwtAuth: JwtAuthService,
    private router: Router,
    public CompanyService: CompanyService,
    public AuditService: AuditService,
    public alertService: MessageAlertService,
    public us: UserService, public toastr: ToastrService,
    public cls: CompanyLocationService,
    public cbs: CompanyBlockService,
    public AllPath: AllPathService,
    public ITAssetsService: ITAssetsService,
    public assetService: AssetService) {

      this.Headers = this.jwtAuth.getHeaders();
	    this.message = this.jwtAuth.getResources();

     }

  CompanyId: any;
  GroupId: any;
  UserId: any;
  RegionId: any;
  IslayerDisplay: any;
  layerid: any;
  Layertext: any;
  panelOpenState = true;
  searchColumns: any[] = [];
  HeaderLayerText: any;
  menuheader: any = (menuheaders as any).default
  getselectedIds: any[] = [];
  public appliedfilters: any[] = [];
  private isButtonVisible = false;
  private isButtonVisibleBarCode = false;
  private isButtonVisibleADL2 = false;
  private isButtonVisibleADL3 = false;
  private isButtonVisibleSupplier = false;
  private isButtonVisibleGRNNo = false;
  private isButtonVisibleSerialNo = false;
  private isButtonVisibleITSerialNo = false;
  private isButtonVisiblePONumber = false;
  private isButtonVisibleEqipmentNumber = false;
  private isButtonVisibleCPPNumber = false;

  SBUList: any[]=[];
  PlantList: any[]=[];
  categorylist: any[]=[];
  modifiedfield: any;
  assettypes: any;
  SBUName: any;
  assettypedropdown: any;
  assetsubtypedropdown: any;
  companydata: any;
  regiondata: any;
  IsExport: boolean;
  IsSearch: boolean;
  ModifiedList: any;
  CloseHide: boolean = true;
  issort: boolean = false;
  setflag: boolean =false;
  @Output() insuranceEndDate: EventEmitter<any> = new EventEmitter<any>();
  Headers: any ;
  message: any ;
  AssetNoFilter = new FormControl();

  public SBUMultiFilterCtrl: FormControl = new FormControl();
  public SBUMultiCtrl: any;
  public filteredSBUMulti: ReplaySubject<SBU[]> = new ReplaySubject<SBU[]>(1);
  public filtered: ReplaySubject<SBU[]> = new ReplaySubject<SBU[]>(1);
  public filteredSBU: ReplaySubject<SBU[]> = new ReplaySubject<SBU[]>(1);

  public plants: any;
  public plantMultiCtrl: any;
  public plantMultiFilterCtrl: FormControl = new FormControl();
  public filteredPlantsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  protected assetclass: any;
  public assetclassMultiCtrl: FormControl = new FormControl();
  public assetclassFilterCtrl: FormControl = new FormControl();
  public filteredAssetClassMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public assetstatus: any[] = [
    { name: 'Under Tagging', id: 'UnderTagging' },
    { name: 'Information Pending', id: 'InformationPending' },
    { name: 'Not Found', id: 'Missing' },
    { name: 'ALL', id: 'ALL' },
  ];
  public assetstatusMultiCtrl: any;
  public assetstatusFilterCtrl: FormControl = new FormControl();
  public filteredAssetstatusMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);


  public inventory: any[] = [
    { name: 'Verified and Tagged', id: '1' },
    { name: 'Verified but not Tagged', id: '2' },
    { name: 'Not Verifiable', id: '5' },
    { name: 'Not Found', id: '6' },
    { name: 'Pending Verification', id: '7' },

  ];
  public inventoryMultiCtrl: any;
  public InventoryFilterCtrl: FormControl = new FormControl();
  public inventorynote: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);


  // protected AssetType: AssetType[] = InventoryNote;
  protected AssetType: any;
  public AssettypeMultiCtrl: FormControl = new FormControl();
  public AssetTypeFilterCtrl: FormControl = new FormControl();
  public assettype: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);


  protected AssetsubType: any;
  public AssetsubtypeMultiCtrl: FormControl = new FormControl();
  public AssetsubTypeFilterCtrl: FormControl = new FormControl();
  public assetsubtype: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);


  protected modifiedfields: any;
  public ModifiedMultiCtrl: any;
  public ModifiedFilterCtrl: FormControl = new FormControl();
  public modified: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);


  protected comapnyfields: any;
  public companyMultiCtrl: FormControl = new FormControl();
  public companylist: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  protected regionfields: any;
  public regiondMultiCtrl: FormControl = new FormControl();
  public regionlist: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public categoryMultiCtrl: any;
  public categoryFilterCtrl: FormControl = new FormControl();
  public filteredcategoryMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public getselectedData: any[] = [];
  public getSelectPreferId: any[] = [];
  public getselectedplantData: any[] = [];
  public newdataSource = [];
  public isallchk: boolean;
  displayTable: boolean = false;
  displaybtn: boolean = false;
  selection = new SelectionModel<any>(true, []);
  SelectedPlantItems: any[] = [];
  SelectedSBUItems: any[] = [];
  SelectedCategoryItems: any[] = [];
  SelectedStatusItems: any;
  SelectedInventoryItems: any[] = [];
  SelectedassettypeItems: any[] = [];
  SelectedassetsubtypeItems: any[] = [];
  SelectedmodifiedItems: any[] = [];
  SelectedcompanyItems: any[] = [];
  SelectedregionItems: any[] = [];
  SelectedId: any;
  ApproveAuditOptions: { option: any; data: any; };
  MapOptions: { option: any; data: any; };
  selectedSBUList: any[] = [];
  filteredValues = {
    AssetNo: '', SubNo: '', CapitalizationDate: '',
    AssetClass: '', AssetType: '',
    AssetSubType: '', UOM: '', AssetName: '',
    AssetDescription: '', Qty: '', Cost: '', WDV: '',
    EquipmentNO: '', AssetCondition: '', AssetCriticality: ''

  };

  dataSource = new MatTableDataSource<any>();

  displayedColumns: any[] = ['select'];
  public arrlength = 0;
  arrBirds: any[] = [];
  quantitySplitId = '';
  prefarIds = [];
  quantityList: string[] = [];
  paginationParams: any;
  ListofAdditinolMandatory: any[] = [];
  selectionoption ='1'

  ngOnInit(): void {
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

    this.SBUMultiCtrl = "";
    this.plantMultiCtrl = "";
    this.categoryMultiCtrl = "";
    this.assetstatusMultiCtrl = "TaggingApproval";
    this.inventoryMultiCtrl="";

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
    debugger;
    this.filteredAssetstatusMulti.next(this.assetstatus.slice());
    this.inventorynote.next(this.inventory.slice());

    // this.OnGetModifiedField();
    this.OnGetAssetType();
    this.OnGetAssetSubType();
    this.OnGetCompany();
    this.OnGetRegion();
  }

  ListOfField: any[] = [];
  ListOfAdditionalField: any[] = [];
  ListOfMapField: any[] = [];
  ListOfFilter: any[] = [];
  ListOfFilterName: any[] = [];
  NewModifiedList: any[] = [];
  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  PlantList1: any[] = [];
  GRNMandatory: any[] = [];
  FARMandatory: any[] = [];
  NONFARMandatory: any[] = [];
  ApproveMandatoryField: any[] = [];
  categorylist1: any[] = [];
  ExportedFields: any[] = [];
  
  GetInitiatedData() {

    this.loader.open();
    let url1 = this.gs.GetFieldListByPageId(30,this.UserId,this.CompanyId);
    let url2 = this.gs.GetFilterIDlistByPageId(30);
    let url3 = this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.RegionId, "30,31");
    let url4 = this.cls.GetLocationListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 30)
    let url5 = this.cbs.GetCategoryListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 30);
    let url6 = this.gs.GetFieldListByPageId(31,this.UserId,this.CompanyId);
    let url7 = this.us.CheckFreezePeriodStatus(this.GroupId, this.RegionId, this.CompanyId);
    forkJoin([url1, url2, url3, url4, url5, url6 , url7]).subscribe(results => {
       
      if (!!results[0]) {
        this.ModifiedList = [];
        this.FARMandatory = [];
        this.NONFARMandatory = [];
        this.GRNMandatory = [];

        this.ListOfField = JSON.parse(results[0]);
        this.searchColumns = this.ListOfField.filter(x => x.SearchOptionEnabled == true).map(choice => choice);
        this.displayedColumns = this.ListOfField;
        this.displayedColumns = this.displayedColumns.filter(x => x.Custom2 == "1").map(choice => choice.Custom1);
        this.displayedColumns = ['Select', 'Icon'].concat(this.displayedColumns);
        this.ListOfField.forEach(x => {
          if (!!x.EditableDuringTagging) {
            this.ModifiedList.push(x.FieldName);
            if (!!x.EditableDuringTaggingReview) {
              this.ApproveMandatoryField.push(x.FieldName);
            }
            if (!!x.MandetoryFar) {
              this.FARMandatory.push(x.FieldName);
            }
            if (!!x.MandetoryNonFar) {
              this.NONFARMandatory.push(x.FieldName);
            }
            if (!!x.MandetoryGrn) {
              this.GRNMandatory.push(x.FieldName);
            }
          }
        })

        console.log('grn' , this.GRNMandatory);
      }
      if (!!results[1]) {
        this.ListOfFilter = JSON.parse(results[1]);
        if (!!this.ListOfFilter) {
          this.ListOfFilter.forEach(x => this.ListOfFilterName.push(x.FilterName))
        }
      }
      if (!!results[2]) {
        this.ListOfPagePermission = JSON.parse(results[2]);
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
      if (!!results[3]) {
        this.PlantList = JSON.parse(results[3]);
        this.PlantList1 = JSON.parse(results[3]);
        this.SBUList = this.UniqueArraybyId(this.PlantList, this.Layertext);
        this.getFilterCityType();
        this.getFilterPlantType();
      }
      if (!!results[4]) {
        this.categorylist = JSON.parse(results[4]);
        this.categorylist1 = JSON.parse(results[4]);
        this.getFilterCategoryType();
      }
      if (!!results[5]) {
         
        var list = [];
        this.ListOfAdditionalField = JSON.parse(results[5]);
        this.ListOfAdditionalField.forEach(x => {
           
          if (!!x.Additional) {
            list.push(x.FieldName);
            if (!!x.AdditionalMandatory) {
              this.ListofAdditinolMandatory.push(x.FieldName);
            }
          }
        })
        this.ListOfMapField = list;
         
        console.log(this.ListOfMapField);
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

  onChangeSBU(value) {
    this.showmultiSearch = false;
    if (!!value) {
      var list = [];
      if (!!this.SBUMultiCtrl && this.SBUMultiCtrl.length > 0) {
        this.SBUMultiCtrl.forEach(x => {
          this.PlantList = this.PlantList1.filter(y => y[this.Layertext].indexOf(x) > -1);
          this.PlantList.forEach(x => {
            list.push(x);
          })
        })
        this.PlantList = list;
      }
      else {
        this.PlantList = this.PlantList1.filter(y => y);
      }
      this.plantMultiCtrl = "";
      //this.filteredPlantsMulti.next(this.PlantList.slice());
      this. getFilterPlantType();
    }
    else {
      this.PlantList = this.PlantList1;
      this.plantMultiCtrl = "";
      //this.filteredPlantsMulti.next(this.PlantList.slice());
      this. getFilterPlantType();
    }
  }

  getFilterCityType() {
    this.filteredSBUMulti.next(this.SBUList.slice());
    this.SBUMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCityMulti();
      });
  }
  protected filterCityMulti() {
    if (!this.PlantList) {
      return;
    }
    let search = this.SBUMultiFilterCtrl.value;
    if (!search) {
      this.filteredSBUMulti.next(this.SBUList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredSBUMulti.next(
      this.SBUList.filter(x => x.Zone.toLowerCase().indexOf(search) > -1)
    );
  }
  limit = 10;
  offset = 0;
  getFilterPlantType() {
    this.filteredPlantsMulti.next(this.PlantList.slice());
    this.plantMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPlantsMulti();
      });
  }
  protected filterPlantsMulti() {
    if (!this.PlantList) {
      return;
    }
    let search = this.plantMultiFilterCtrl.value;
    if (!search) {
      this.filteredPlantsMulti.next(this.PlantList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredPlantsMulti.next(
      this.PlantList.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1)
    );
  }


  //====== Bind Data To DataSource========  
  handlePage(pageEvent: PageEvent) {
    this.paginationParams.pageSize = pageEvent.pageSize;
    this.paginationParams.currentPageIndex = pageEvent.pageIndex;
    this.paginationParams.endIndex = (this.paginationParams.currentPageIndex + 1) * pageEvent.pageSize;
    this.paginationParams.startIndex = this.paginationParams.currentPageIndex * pageEvent.pageSize;
    if (!!this.variable && !!this.variable) {
      this.OnGetGridData("SearchText")
    }
    else if(this.multipleserach= true && this.multiSearch.length > 0)
     
    {
      this.OnGetGridData("multiplesearch");
    }
    else {
      this.OnGetGridData("")
    }
  }
  // clickToExport() {
  //   if(this.displayTable == true){

  //     this.OnGetGridData("IsExport");
  //   }else{
  //     this.toastr.warning(`No data selected to export`, this.message.AssetrakSays);
  //     return null;      
  //   }
  // }
  clickToExport() {
    if(this.displayTable == true && this.dataSource.data.length != 0){
      this.OnGetGridData("IsExport");
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
  OnGetGridDataBindData() {
    this.selection.clear();
    this.getclear();
    this.Onchange();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.getselectedData = [];
    this.SendbackButton = [];
    this.TaggingButton = [];
    this.MapButton = [];
    this.MissingButton = [];
    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;
    this.OnGetGridData("OnPageload");
  }
  bindData: any[] = [];
  variable3: any[] = [];
  serachtext: any;
  colunname: any;
  isExport: boolean = false;
  Searchlist :any[];
  OnGetGridData(Action) {
    this.loader.open();
    this.ALLValidationCheck();
    var LocationIdList = [];
    var CategoryIdList = [];
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
    if (Action == "Sort" && !!this.variable1) {
      this.issort = true;
      this.colunname = this.variable1;
    }

    if (!!this.SelectedPlantItems && this.SelectedPlantItems.length > 0) {
      LocationIdList = this.SelectedPlantItems;
    }
    else {
      this.PlantList.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }

    if (!!this.SelectedCategoryItems && this.SelectedCategoryItems.length > 0) {
      CategoryIdList = this.SelectedCategoryItems;
    }
    else {
      this.categorylist.forEach(x => {
        CategoryIdList.push(x.AssetCategoryId);
      })
    }
    debugger;
    var assetDetails = {
      CategoryIdList: CategoryIdList,
      UserId: this.UserId,
      CompanyId: this.CompanyId,
      LocationIdList: LocationIdList,
      pageSize: this.paginationParams.pageSize,
      pageNo: this.paginationParams.currentPageIndex + 1,
      AssetStage: 7,
      AssetStatus: "",
      Option: this.SelectedStatusItems,
      SbuList: this.SelectedSBUItems,
      RegionId: this.RegionId,
      AssetsClassList: [],
      typeOfAssetList: this.SelectedassettypeItems,
      subTypeOfAssetList: this.SelectedassetsubtypeItems,
      TagginStatusList: this.SelectedInventoryItems,
      IsExport: this.isExport,
      ModifiedList: this.SelectedmodifiedItems,
      RegionIdList: this.SelectedregionItems,
      CompanyIdList: this.SelectedcompanyItems,
      SearchText: this.serachtext,
      columnName: this.colunname,
      IsSearch: this.IsSearch,
      issorting: this.issort,
      PageId : 30,
      GroupId:this.GroupId,
      IsCallFromReview : false,
      ExportedFields : this.ExportedFields,
      ismultiplesearch: this.multipleserach,
      Searchlist : this.Searchlist,
      IsCallFromAndroid :true
    }

    this.jwtAuth.Getapprovetagginggrid(assetDetails)
      .subscribe(r => {
         
        this.loader.close();
        if (Action === 'IsExport') {
          this.AllPath.DownloadExportFile(r);
        }
        else {
          this.bindData = [];
          if (!!r && r != null) {
            this.bindData = JSON.parse(r);
            console.log(this.bindData);
            this.paginationParams.totalCount = 0;
            if (!!this.bindData && this.bindData.length > 0) {
              this.paginationParams.totalCount = this.bindData[0].AssetListCount;
              this.displaybtn = true;
              this.displayTable = true;
            }
            else {
              this.displayTable = true;
            }
          }
          this.onChangeDataSource(this.bindData);
          this.SetPageSession();
        }
      });
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
     
    var formData = {
      'Pagename': "Approve Tagging",
      'SbuList': this.SelectedSBUItems,
      'LocationIdList': this.SelectedPlantItems,
      'CategoryIdList': this.SelectedCategoryItems,
      'Option': this.SelectedStatusItems,
      'typeOfAssetList': this.SelectedassettypeItems,
      'subTypeOfAssetList': this.SelectedassetsubtypeItems,
      'TagginStatusList': this.SelectedInventoryItems,
      'ModifiedList': this.SelectedmodifiedItems
    }

    localStorage.setItem('PageSession', JSON.stringify(formData));
  }

  StorePageSession: any;
  GetPageSession() {
     
    this.StorePageSession = "";
    if (!!localStorage.getItem('PageSession') && localStorage.getItem('PageSession') != "null") {
      this.StorePageSession = {}
      this.StorePageSession = JSON.parse(localStorage.getItem('PageSession'));
      if (this.StorePageSession.Pagename === "Approve Tagging") {
        var list = [];
        this.plantMultiCtrl = "";
        this.PlantList.forEach(x => {
           
          if (this.StorePageSession.LocationIdList.indexOf(x.LocationId) > -1) {
            list.push(x.LocationId);
            this.plantMultiCtrl = list;
            this.SelectedPlantItems = list;
          }
        })
        this.categoryMultiCtrl = "";
        list = [];
        this.categorylist.forEach(x => {
          if (this.StorePageSession.CategoryIdList.indexOf(x.AssetCategoryId) > -1) {
            list.push(x.AssetCategoryId);
            this.categoryMultiCtrl = list;
            this.SelectedCategoryItems = list;
          }
        })

        this.inventoryMultiCtrl = "";
        list = [];
        this.inventory.forEach(x => {
          if (this.StorePageSession.TagginStatusList.indexOf(x.id) > -1) {
            list.push(x.id);
            this.inventoryMultiCtrl = list;
            this.SelectedInventoryItems = list;
          }
        })

        this.assetstatusMultiCtrl = this.StorePageSession.Option;
        this.SelectedStatusItems = this.StorePageSession.Option;

        this.OnGetGridDataBindData();
      }
      else {
        localStorage.setItem('PageSession', null);
        this.StorePageSession = "";
      }
    }
  }
  numSelected: any = 0;
  isAllSelected: boolean = false;
  masterToggle() {
   debugger;
    this.isAllSelected = !this.isAllSelected;
    this.selection.clear();
    this.getselectedIds = [];
    this.getselectedData = [];
    this.SendbackButton = [];
    this.TaggingButton = [];
    this.MapButton = [];
    this.MissingButton =[];
    debugger;
    if (this.isAllSelected == true) {
      this.dataSource.data.forEach(row => {
         
        if (!(row.RejectFlag == true || row.TaggingStatus == 6 || ((row.MergeId < 0 || row.MergeId2 < 0) && row.TaggingStatus != null && row.TaggingStatus != 9 && row.TaggingStatus != 7))) {
          this.selection.select(row)
        }
      });
    }
    // else {
    //   this.dataSource.data.forEach(row => this.selection.toggle(row));
    // }

    this.numSelected = this.selection.selected.length;
    if (this.numSelected > 0) {
      this.selection.selected.forEach(row => {
        this.getselectedIds.push(row.PreFarId);
        debugger;
        if ((row.TaggingStatus == null || row.TaggingStatus == 7) && (row.MergeId == 0 || row.MergeId == null) && (row.MergeId2 == 0 || row.MergeId2 == null) && !row.Barcode) {
          var idx = this.SendbackButton.indexOf(row.PreFarId);
          if (idx > -1) {
            this.SendbackButton.splice(idx, 1);
          }
          else {
            this.SendbackButton.push(row.PreFarId);
          }
        }
        if (row.TaggingStatus != null && row.TaggingStatus != 9 && row.TaggingStatus != 7 && row.TaggingStatus != 6 && (row.RejectFlag == null || row.RejectFlag == false)) {
          var idx = this.TaggingButton.indexOf(row.PreFarId);
          if (idx > -1) {
            this.TaggingButton.splice(idx, 1);
            this.getselectedData.splice(idx, 1);
          }
          else {
            this.TaggingButton.push(row.PreFarId);
            this.getselectedData.push(row);
          }
        }
        if (row.TaggingStatus == 7 && !row.Barcode) {
          var idx = this.MapButton.indexOf(row.PreFarId);
          if (idx > -1) {
            this.MapButton.splice(idx, 1);
          }
          else {
            this.MapButton.push(row.PreFarId);
          }
        }
        if (row.TaggingStatus == 6) {
          var idx = this.MissingButton.indexOf(row.PreFarId);
          if (idx > -1) {
            this.MissingButton.splice(idx, 1);
          }
          else {
            this.MissingButton.push(row.PreFarId);
          }
        }
      })
    }
  }
  TaggingButton: any[] = [];
  SendbackButton: any[] = [];
  MapButton : any[] = [];
  MissingButton : any[] = [];
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
    //============================
    if ((row.TaggingStatus == null || row.TaggingStatus == 7) && (row.MergeId == 0 || row.MergeId == null) && (row.MergeId2 == 0 || row.MergeId2 == null) && !row.Barcode) {
      var idx = this.SendbackButton.indexOf(row.PreFarId);
      if (idx > -1) {
        this.SendbackButton.splice(idx, 1);
      }
      else {
        this.SendbackButton.push(row.PreFarId);
      }
    }
    if (row.TaggingStatus != null && row.TaggingStatus != 9 && row.TaggingStatus != 7 && row.TaggingStatus != 6 && (row.RejectFlag == null || row.RejectFlag == false)) {
      var idx = this.TaggingButton.indexOf(row.PreFarId);
      if (idx > -1) {
        this.TaggingButton.splice(idx, 1);
        this.getselectedData.splice(idx, 1);
      }
      else {
        this.TaggingButton.push(row.PreFarId);
        this.getselectedData.push(row);
      }
    }
    if (row.TaggingStatus == 7 && !row.Barcode) {
      var idx = this.MapButton.indexOf(row.PreFarId);
      if (idx > -1) {
        this.MapButton.splice(idx, 1);
      }
      else {
        this.MapButton.push(row.PreFarId);
      }
    }
    if (row.TaggingStatus == 6) {
      var idx = this.MissingButton.indexOf(row.PreFarId);
      if (idx > -1) {
        this.MissingButton.splice(idx, 1);
      }
      else {
        this.MissingButton.push(row.PreFarId);
      }
    }
    //this.GetList(this.getselectedIds);
  }
  viewSelected() {
    this.getclear();
    this.paginationParams.totalCount = this.selection.selected.length;
    this.paginationParams.endIndex = this.selection.selected.length;
    this.onChangeDataSource(this.selection.selected);
  }
  clearSelectedView() {
    this.SendbackButton = [];
    this.TaggingButton = [];
    this.MapButton = [];
    this.MissingButton =[];
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
    this.getselectedData = [];
    this.SendbackButton = [];
    this.TaggingButton = [];
    this.MapButton = [];
    this.MissingButton =[];
    this.OnGetGridData("")
  }

  getFilterCategoryType() {
    this.filteredcategoryMulti.next(this.categorylist.slice());
    this.categoryFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCategoryMulti();
      });
  }
  protected filterCategoryMulti() {
    if (!this.categorylist) {
      return;
    }
    let search = this.categoryFilterCtrl.value;
    if (!search) {
      this.filteredcategoryMulti.next(this.categorylist.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredcategoryMulti.next(
      this.categorylist.filter(x => x.AssetCategoryName.toLowerCase().indexOf(search) > -1)
    );
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
        this.displayedColumns = this.ListOfField.filter(x => x.Custom2 == "1" ).map(choice => choice.Custom1);
        this.displayedColumns = ['Select', 'Icon', 'review'].concat(this.displayedColumns);
      }
    })
  }

  mapLocation(element) {
    if (!element.GPS_CoOrdinate) {

    } else {
      window.open('https://www.google.com/maps/search/?api=1&query=' + element.GPS_CoOrdinate, '_blank');
    }
  }


  GetList(RecordEntities: any) {
    this.SelectedId = "";
    RecordEntities.forEach(Id => {
      this.SelectedId = Id + "," + this.SelectedId;
    });
    this.SelectedId = this.SelectedId.replace(/,\s*$/, "");
  }

  openFilter_PopUp() {

  }

  OnGetAssetType() {
    this.jwtAuth.GetTypeOfAssetList(this.CompanyId)
      .subscribe(r => {
        this.assettypedropdown = JSON.parse(r);
        this.assettype.next(this.assettypedropdown.slice());
      });
  }

  OnGetAssetSubType() {
    this.ITAssetsService.GetSubTypeOfAssetMasterList(this.CompanyId)
      .subscribe(r => {
        this.assetsubtypedropdown = JSON.parse(r);
        this.assetsubtype.next(this.assetsubtypedropdown.slice());
      });
  }

  OnGetCompany() {
    const UserId = this.UserId;
    this.CompanyService.OnGetComapnyList(UserId)
      .subscribe(r => {
        this.companydata = JSON.parse(r);
        this.companylist.next(this.companydata.slice());
      });
  }

  OnGetRegion() {
    const UserId = this.UserId;
    this.CompanyService.OnGetRegionList(UserId)
      .subscribe(r => {
        this.regiondata = JSON.parse(r);
        this.regionlist.next(this.regiondata.slice());
      });
  }

  SelectSBUCheckbox(event) {
    this.SelectedSBUItems = event;
  }

  SelectPlantCheckbox(event) {
    this.SelectedPlantItems = event;
  }

  Selectcategorybox(event) {
    this.SelectedCategoryItems = event;
  }

  Selectstatusbox(event) {
    this.SelectedStatusItems = event;
  }

  Selectinventorybox(event) {
    this.SelectedInventoryItems = event;
  }

  Selectassettypebox(event) {
    this.SelectedassettypeItems = event;
  }

  Selectassetsubtypebox(event) {
    this.SelectedassetsubtypeItems = event;
  }

  Selectmodifiedbox(event) {
    this.SelectedmodifiedItems = event;
  }

  Selectcompanybox(event) {
    this.SelectedcompanyItems = event;
  }

  Selectregionbox(event) {
    this.SelectedregionItems = event;
  }
  ALLValidationCheck() {
    if (this.SelectedStatusItems == undefined) {
      this.SelectedStatusItems = "TaggingApproval"
    }

    if (this.CompanyId != 0) {
      this.SelectedcompanyItems = [Number(this.CompanyId)];

    }

    else {
      if (this.SelectedcompanyItems[0] == undefined) {
        this.SelectedcompanyItems = [];
      }
    }

    if (this.RegionId != 0) {
      this.SelectedregionItems = [Number(this.RegionId)];

    }
    else {
      if (this.SelectedregionItems[0] == undefined) {
        this.SelectedregionItems = [];
      }
    }

    if (this.SelectedSBUItems[0] == undefined) {
      this.SelectedSBUItems = [];
    }


    if (this.SelectedPlantItems[0] == undefined) {
      this.SelectedPlantItems = [];
    }


    if (this.SelectedCategoryItems[0] == undefined) {
      this.SelectedCategoryItems = [];
    }


    if (this.SelectedassettypeItems[0] == undefined) {
      this.SelectedassettypeItems = [];
    }


    if (this.SelectedassetsubtypeItems[0] == undefined) {
      this.SelectedassetsubtypeItems = [];
    }

    if (this.SelectedInventoryItems[0] == undefined) {
      this.SelectedInventoryItems = [];
    }

    if (this.SelectedmodifiedItems[0] == undefined) {
      this.SelectedmodifiedItems = [];
    }
  }

  BackToAssetRelationStage() {
    debugger;
    this.confirmService.confirm({ message: `Are you sure, you want to send back selected asset/s to Define relationship page?`, title: this.message.AssetrakSays })
      .subscribe(res => {
        if (!!res) {
          var prefarIds = [];
          const numSelected = this.SendbackButton.length;
          for (var i = 0; i < numSelected; i++) {
            prefarIds.push(this.SendbackButton[i]);
          }
          var LocationIdList = [];
          if (!!this.SelectedPlantItems && this.SelectedPlantItems.length > 0) {
            LocationIdList = this.SelectedPlantItems;
          }
          else {
            this.PlantList.forEach(x => {
              LocationIdList.push(x.LocationId);
            })
          }
          var assetsDetails = {
            UserId: this.UserId,
            CompanyId: this.CompanyId,
            AssetList: prefarIds.join(','),
            LocationIdList: LocationIdList
          }
          this.AuditService.GetAssetsForBackToScruitiny(assetsDetails)
            .subscribe(r => {
              if(r == "0") {
                this.toastr.warning(this.message.AssetInProgress, this.message.AssetrakSays);
              }
              else if(r == "In transfer or retirement") {
                this.toastr.warning(this.message.InTransferRetirement, this.message.AssetrakSays);
              }
              else {
                this.toastr.success(this.message.AssetSentBackComponentizationStage, this.message.AssetrakSays);
              }
              this.clearSelected();
            });
        }
      });
  }

  ContinueRejectbtn(result) {
    debugger;
    var prefarIds = [];
    const numSelected = this.getselectedIds.length;
    for (var i = 0; i < numSelected; i++) {
      prefarIds.push(this.getselectedIds[i]);
    }
    var objAssetsParameterDto = {
      PrefarIdlist: prefarIds, //[Number(this.SelectedId)],
      approveRejectComment: result,
      UserId: this.UserId,
      Optionlistformodified: [],
      ModifiedAssetDtoList: []
    }

    this.AuditService.RejectApprove(objAssetsParameterDto)
      .subscribe(r => {
        var msg = '';
        if (r.startsWith("Success")) {
          var result = r.split(',');
          if (parseInt(result[1]) == this.getselectedIds.length) {
            msg = "Information requested successfully.";
            this.toastr.success(msg, this.message.AssetrakSays);
          }
          else if (parseInt(result[2]) == this.getselectedIds.length) {
            msg = "Information cannot be requested for selected Asset/s.";
            this.toastr.error(msg, this.message.AssetrakSays);
          }
          else {
            msg = "Information for "+ parseInt(result[1]) +" assets requested successfully and could not be requested for "+ parseInt(result[3]) +" Assets.";
            this.toastr.error(msg, this.message.AssetrakSays);
          }
          //this.toastr.success(this.message.TaggingReject, this.message.AssetrakSays);
          //this.toastr.success(result[1] + ' assets are Approved Successfully.' + result[2] + ' assets are Failed to Approve and for ' + result[3] + ' assets action is already taken.', this.message.AssetrakSays);
        }
        else if(r == "Too many characters"){
          this.toastr.warning(this.message.TooManyChar, this.message.AssetrakSays);
        }
        else {
          this.toastr.error(this.message.ErrorMessage, this.message.AssetrakSays);
        }
        this.clearSelected();
      });
  }

  ContinueRequestbtn(PreFarId, result) {

    this.getSelectPreferId = PreFarId;
    var objAssetsParameterDto = {
      PrefarIdlist: [this.getSelectPreferId],
      approveRejectComment: result
    }
    this.AuditService.RejectApprove(objAssetsParameterDto)
      .subscribe(r => {
        var result = r.split(',');
        if (!!result && result.length > 0 && result[0] == 'Success') {
          //this.toastr.success(this.message.TaggingReject, this.message.AssetrakSays);    
          this.toastr.success('assets are Requested for Information Successfully.' + result[1] + ' Action on Asset/s already taken.', this.message.AssetrakSays);
        }
        else {
          this.toastr.error(this.message.ErrorMessage, this.message.AssetrakSays);
        }
        this.clearSelected();
      });

  }

  ApproveAssetDtolist: any[];
  ApproveAssetDto = [];
  AssetMandatoryFields: any[] = [];
  ApproveAudit() {
     
    var cnt = 0;
    if (this.selection.selected.length > 0) {
      for (var i = 0; i < this.selection.selected.length; i++) {
        var AssetId = this.selection.selected[i].AssetId;
        if (AssetId.startsWith('GRN')) {
          this.AssetMandatoryFields = this.GRNMandatory;
        }
        else if (AssetId.startsWith('NFAR')) {
          this.AssetMandatoryFields = this.NONFARMandatory;
        }
        else {
          this.AssetMandatoryFields = this.FARMandatory;
        }
        var flag = 0;
        this.AssetMandatoryFields.forEach(x => {
          if (this.selection.selected[i][x] == null || this.selection.selected[i][x] == "") {
            flag = 1;
            cnt++;             
          }
        })
        if (flag == 1) {
          var idx = this.getselectedData.indexOf(this.selection.selected[i]);
          if (idx > -1) {
            this.getselectedData.splice(idx, 1);
          }
        }
      }
    }
     
    if (this.getselectedData.length > 0) {
      var msg = "";
      if (this.getselectedData.length > 0 && cnt == 0) {
        msg = this.message.ApproveTaggingAsset;
      }
      else if (this.getselectedData.length > 0 && cnt > 0) {
        msg = this.message.ApproveTaggingAssetWithError;
      }

      this.confirmService.confirm({ message: msg, title: this.message.AssetrakSays })
        .subscribe(res => {
          if (!!res) {
            this.ApproveAssetDto = [];
             
            this.getselectedData.forEach(Id => {
              var ApproveAssetDtolist = {
                PreFarId: Id.PreFarId,
                Taggable: Id.Taggable,
                LastModifiedBy: this.UserId,
                LabelMaterial: Id.LabelMaterial,
                LabelSize: Id.LabelSize,
                flag: "1",
                InventoryComment: Id.InventoryComment,
                isUserAllocationAlllow: true,
                //LastModifiedOn: this.JsonDate(Id.LastModifiedOn),
                OutwardLocation:new Date(Id.LastModifiedOn), 
                isSingleAsset: false,
                Optionlistformodified: this.ModifiedList,
                ModifiedAssetDtoList: []
              };
              this.ApproveAssetDto.push(ApproveAssetDtolist);
            });
            var approveTaggingDetails = {
              ApproveAssetDtolist: this.ApproveAssetDto
            }
            this.AuditService.MultipalApproveTagging(approveTaggingDetails)
              .subscribe(r => {
                 
                var msg = '';
                if (r.startsWith("success")) {
                  var result = r.split(',');
                  if (parseInt(result[1]) == this.ApproveAssetDto.length) {
                    msg = "Tagging approved successfully.";
                    this.toastr.success(msg, this.message.AssetrakSays);
                  }
                  else if (parseInt(result[2]) == this.ApproveAssetDto.length) {
                    msg = "Tagging cannot be approved for the selected asset/";
                    this.toastr.error(msg, this.message.AssetrakSays);
                  }
                  else {
                    msg = "Tagging for "+ parseInt(result[1]) +" assets updated successfully and could not be approved for "+ parseInt(result[3]) +" Assets.";
                    this.toastr.error(msg, this.message.AssetrakSays);
                  }
                  //this.toastr.success(result[1] + ' assets are Approved Successfully.' + result[2] + ' assets are Failed to Approve and for ' + result[3] + ' assets action is already taken.', this.message.AssetrakSays);
                }
                else {
                  this.toastr.error(this.message.ErrorMessage, this.message.AssetrakSays);
                }
                this.clearSelected();
              });
          }
        })
    }
    else {
      this.toastr.warning(this.message.ApproveTaggingError, this.message.AssetrakSays);
    }

  }

  PageId =30;
  ReportFlag :boolean = false;
  openPopUp(data: any = {}) {
    debugger;
    this.ReportFlag = false;
    this.ListOfField.forEach((element,index)=>{
      if(element.Custom1 == 'review' || element.Custom1 == 'Photo') 
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
  OptionList: any[] = [];
  Review(...vars) {

    this.ApproveAuditOptions = {
      option: vars[0],
      data: vars[1]
    }
    this.OptionList = [];
    var PrefarId = vars[1].PreFarId;
    var ProjectType = "Tagging";
    this.AuditService.GetnewModifiedAssetListForReview(PrefarId, ProjectType)
      .subscribe(r => {

        var List = JSON.parse(r);
        List.forEach(element => {
          element.Temp1 = this.Headers[element.Option];
          this.OptionList.push(element);
        });
        var component: any

        this.loader.open();
        component = ReviewDialogComponent;
        const dialogRef = this.dialog.open(component, {
          panelClass: 'group-form-dialog',
          disableClose: true,
          data: {
            component1: 'ApprovetaggingComponent',
            value: this.OptionList,
            name: vars[1],
          },
        });

        dialogRef.afterClosed()
          .subscribe(res => {

            if (res != false) {
              if (res[0].Result == "Accept") {
                this.AcceptandApprove(res);
              }
              else if (res[0].Result == "Reject") {
                this.openRequestDialog(vars[1].PreFarId);
              }
            }
          });
        this.loader.close();
      });
  }

  AcceptandApprove(result) {
    var approveTaggingDetails = {
      ApproveAssetDtolist: result
    }
    this.AuditService.MultipalApproveTagging(approveTaggingDetails)
      .subscribe(r => {
        this.toastr.success(this.message.TaggingApproveSuccess, this.message.AssetrakSays);
        this.clearSelected();
      });
  }
  OnSingleAccept(res) {
    const EmailId = res.UserEmail;
    const CompanyId = this.CompanyId;
    const GridData = res.GridData;
    this.jwtAuth.EmailExistInEmpMasterDetail(EmailId, CompanyId)
      .subscribe(r => {
        if (r == 1) {
          var updateDetails = {
            PreFarId: GridData.PreFarId,
            UserEmailId: EmailId,
            CompanyId: this.CompanyId,
            UserId: this.UserId
          };
          this.jwtAuth.UpdateModifiedAssetdata(updateDetails)
            .subscribe(r => {

              if (r != null) {
                var approveTaggingDetails = {
                  PreFarId: GridData.PreFarId,
                  Taggable: GridData.Taggable,
                  LastModifiedBy: this.UserId,
                  LabelMaterial: GridData.LabelMaterial,
                  LabelSize: GridData.LabelSize,
                  Flag: GridData.Flag,
                  InventoryComment: GridData.InventoryComment,
                  IsuserAllowAllocation: true,
                  LastModifiedOn: this.JsonDate(GridData.LastModifiedOn)
                };
                this.AuditService.ApproveTaggingDetails(approveTaggingDetails)
                  .subscribe(r => {

                    this.toastr.success(this.message.TaggingApproveSuccess, this.message.AssetrakSays);
                    this.clearSelected();
                  });
              }
            });
        }
      });
  }

  public JsonDate(datePicker) {
    Date.prototype.toJSON = function () {
      var date = '/Date(' + this.getTime() + ')/';
      return date;
    };
    var dt = new Date(datePicker);
    var dt1 = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds()));
    return dt1.toJSON();
  }

  OnSingleReject(res) {
    const GridData = res.GridData;
    var approveTaggingDetails = {
      PreFarId: GridData.PreFarId,
      Taggable: GridData.Taggable,
      LastModifiedBy: this.UserId,
      LabelMaterial: GridData.LabelMaterial,
      LabelSize: GridData.LabelSize,
      Flag: GridData.Flag,
      InventoryComment: GridData.InventoryComment,
      IsuserAllowAllocation: true,
      LastModifiedOn: this.JsonDate(GridData.LastModifiedOn)
    };
    this.AuditService.ApproveTaggingDetails(approveTaggingDetails)
      .subscribe(r => {
        this.toastr.success(this.message.TaggingReject, this.message.AssetrakSays);
        this.clearSelected();
      });
  }

  openApproveRejectDialog() {
    if (this.selection.selected.length > 0) {
      var component: any
      component = ApproveRejectComponent;
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

  openRequestDialog(PreFarId) {

    var component: any
    component = ApproveRejectComponent;
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
      if (result) {

        this.ContinueRequestbtn(PreFarId, result);
      }
    });
  }

  mapwithasset() {
     
    if (this.selection.selected.length == 1) {
      var locationId = 0;
      const numSelected = this.selection.selected.length;
      for (var i = 0; i < numSelected; i++) {
        locationId = this.selection.selected[i].LocationId;
      }
      let configdata = {
        CompanyId: this.CompanyId,
        GroupId: this.GroupId,
        UserId: this.UserId,
        selected: this.selection.selected,
        LocationId: locationId,
        ListOfMapField: this.ListOfMapField
      }
      let title = 'Component Split';
      let dialogRef: MatDialogRef<any> = this.dialog.open(MapadditionalDialogComponent, { 
        data: { title: title, configdata: configdata }
      })
      dialogRef.afterClosed()
        .subscribe(res => {
          if (!!res) {
            this.OpenAdditionalDialog(res);
          }
        })
    }
  }

  OpenAdditionalDialog(PrePrintId) {
     
    let configdata = {
      CompanyId: this.CompanyId,
      GroupId: this.GroupId,
      UserId: this.UserId,
      PrePrintId: PrePrintId,
      selected: this.selection.selected,
      ListOfMapField: this.ListOfMapField,
      ListofAdditinolMandatory: this.ListofAdditinolMandatory
    }
    let title = '';
    let dialogRef: MatDialogRef<any> = this.dialog.open(MapadditionalassetDialogComponent, { width:'70vw',
      data: { title: title, configdata: configdata }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!!res) {
           
          this.loader.open();
          this.assetService.NewApproveChangeForPrePrintedAdditionalAssetMap(res).subscribe(response => {
             debugger;
            this.loader.close();
            if (response == 'Asset mapped Successfully') {
              this.toastr.success(this.message.AssetMappedSucess, this.message.AssetrakSays);
            }
            else if (response == 'No assets found') {
              this.toastr.warning(this.message.NoAssetsFound, this.message.AssetrakSays);
            }
            else if (response == 'Incorrect Inventory Number. The barcode entered is not printed for the selected Asset Class/Location​/Company')
            {
              this.toastr.warning(this.message.InventoryNumberError,this.message.AssetrakSays);
            }
            else if (response == 'Inventory Number already exist')
            {
              this.toastr.warning(this.message.InventoryNumberalreadyexist,this.message.AssetrakSays);
            }
            else if (response == 'Inventory Number is not Valid')
            {
              this.toastr.warning(this.message.InventoryNoNotAvailable,this.message.AssetrakSays);
            }
            else{

            }
            this.clearSelected();
          });
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

  ViewPhoto(b) {
    var filename = b.Photopath;
    var pathName = this.CompanyId + "/Photo/" + b.Photopath; //4_3_2021_42_Untitled.png"; //
    if (filename == "") {
      this.toastr.warning(this.message.DocumentNotFound, this.message.AssetrakSays);
      return false;
    }
    this.AllPath.ViewDocument(pathName);
    return false;
  }

  bindData1: any[] = [];
  ReviewPhoto(b) {
    debugger;
    var LocationIdList = [];
    var CategoryIdList = [];
    if (!!this.SelectedPlantItems && this.SelectedPlantItems.length > 0) {
      LocationIdList = this.SelectedPlantItems;
    }
    else {
      this.PlantList.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }
    if (!!this.SelectedCategoryItems && this.SelectedCategoryItems.length > 0) {
      CategoryIdList = this.SelectedCategoryItems;
    }
    else {
      this.categorylist.forEach(x => {
        CategoryIdList.push(x.AssetCategoryId);
      })
    }

    var assetDetails = {
      CategoryIdList: CategoryIdList,
      UserId: this.UserId,
      CompanyId: this.CompanyId,
      LocationIdList: LocationIdList,
      pageSize: 100,
      pageNo: 1,
      AssetStage: 7,
      AssetStatus: "",
      Option: "TaggingApproval",
      SbuList: this.SelectedSBUItems,
      RegionId: this.RegionId,
      AssetsClassList: [],
      typeOfAssetList: this.SelectedassettypeItems,
      subTypeOfAssetList: this.SelectedassetsubtypeItems,
      TagginStatusList: this.SelectedInventoryItems,
      IsExport: false,
      ModifiedList: this.ModifiedList,//this.SelectedmodifiedItems,
      RegionIdList: this.SelectedregionItems,
      CompanyIdList: this.SelectedcompanyItems,
      SearchText: '',
      columnName: '',
      IsSearch: false,
      issorting: false,
      ModifiedStatus: 'All',
      PageId : 30,
      GroupId:this.GroupId,
      IsCallFromReview : true
    }
    this.loader.open();
    //this.assetService.GetPrefarIdListForTaggingApproval(assetDetails).subscribe
    this.jwtAuth.Getapprovetagginggrid(assetDetails).subscribe(r => {
       debugger;
      this.loader.close();
      var PrefarIdList = [];
      b.AssetListCount = 0;
      b.assetDetails = assetDetails;
      b.FARMandatory = this.FARMandatory;
      b.NONFARMandatory = this.NONFARMandatory;
      b.GRNMandatory = this.GRNMandatory;
      b.ReviewList = this.ApproveMandatoryField;

      if (!!r) {
        this.bindData1 = JSON.parse(r);
        if (this.bindData1.length > 0) {
          b.AssetListCount = this.bindData1[0].AssetListCount;
          this.bindData1.forEach(x => {
            PrefarIdList.push(x.PreFarId);
          })
        }
      }
      localStorage.setItem("PrefarIdList", JSON.stringify(PrefarIdList));
      localStorage.setItem("rowData", JSON.stringify(b));
      this.router.navigate([], { state: b }).then(result => { window.open('/sessions/view_photo', '_blank'); });
      var idx = PrefarIdList.indexOf(b.PreFarId);
      // if (idx > -1) { //PrefarIdList.splice(idx, 1) 
      // }
      // else{
      //   this.clearSelected();
      // }
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
      this.OnGetGridData("SearchText");
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
    this.OnGetGridData("");
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
          this.OnGetGridData("")
        } else {
          this.variable1 = $event.active;
          this.OnGetGridData("Sort")
        }
      }
    }
  }

  toggleSelectAllCity(selectAllValue) {
    this.SBUMultiCtrl = [];
    this.filteredSBUMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (!!selectAllValue.checked) {
          this.SBUList.forEach(element => {
            this.SBUMultiCtrl.push(element[this.Layertext]);
          });
        } else {
          this.SBUMultiCtrl = "";
        }
        this.onChangeSBU('');
      });
  }
  toggleSelectAll(selectAllValue) {    
    this.plantMultiCtrl=[];
    this.filteredPlantsMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {       
        if (!!selectAllValue.checked) {
          this.PlantList.forEach(element => {
            this.plantMultiCtrl.push(element.LocationId);
          });          
        } else {         
          this.plantMultiCtrl="";
        }
        this.SelectedPlantItems = this.plantMultiCtrl;
        this.categorylist = this.categorylist1;
        this.getFilterCategoryType();
      });
  }

  toggleSelectAllcategory(selectAllValue) {
    this.categoryMultiCtrl =[];
    this.filteredcategoryMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (!!selectAllValue.checked) {
          this.categorylist.forEach(element => {
            this.categoryMultiCtrl.push(element.AssetCategoryId);
          });  
        } else {
          this.categoryMultiCtrl="";
        }
        this.SelectedCategoryItems = this.categoryMultiCtrl;
      });
  }

  toggleSelectAllinventory(selectAllValue) {
    this.inventoryMultiCtrl =[];
    this.inventorynote.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (!!selectAllValue.checked) {
          this.inventory.forEach(element => {
            this.inventoryMultiCtrl.push(element.id);
          });  
        } else {
          this.inventoryMultiCtrl="";
        }
        this.SelectedInventoryItems = this.inventoryMultiCtrl;
      });
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
removeSearch(idx){
  this.multiSearch.splice(idx , 1);
  this.onChangeAdvancedSearch(); 
}
multipleserach : boolean= false;
multiSearch : any[]=[];
onMultiSearchClick(){

    debugger;
    if(this.searchCount == 0){
      this.toastr.warning(`Please Select All Fields`, this.message.AssetrakSays);
      return null;
     }
     else{
    this.multipleserach= true ;
    this.OnGetGridData("multiplesearch");
    console.log(this.multiSearch);
     }

}
hideSearch : boolean = false;
searchCount : any = 0;
clearSearchData(){
  this.showmultiSearch = !this.showmultiSearch;
  this.multiSearch = [];
  if(!!this.hideSearch)
    this.OnGetGridData("");
}
onChangeAdvancedSearch(){
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
  val.LowValue = '';
}
}
