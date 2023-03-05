import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Inject,Output,EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as headers from '../../../../assets/Headers.json';
import { ManagerService } from '../../storage/sessionMangaer';
import { AppConfirmService } from '../../../../app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../app/shared/services/app-loader/app-loader.service';
import { LocalStoreService } from '../../../shared/services/local-store.service';
import { ReplaySubject, Subject, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from "@angular/router";
import { MatSelect } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { UpdateAssetRegisterComponent } from './UpdateAssetRegister_popup/UpdateAssetRegister.component';

// import { CreateGroupDialogComponent } from './create_group_dialog/create_group_dialog.component';
// import { ComponentSplitDialogComponent } from './component_split_dialog/component_split_dialog.component';

import { CompanyLocationService } from '../../services/CompanyLocationService';
import { CompanyBlockService } from '../../services/CompanyBlockService';
import { UserService } from '../../services/UserService';
import { GroupService } from '../../services/GroupService';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { Constants } from 'app/components/storage/constants';
import { AssetService } from 'app/components/services/AssetService';
import { ReportService } from 'app/components/services/ReportService';
import * as menuheaders from '../../../../assets/MenuHeaders.json';
import { GetFieldsComponent } from 'app/components/partialView/get-fields/get-fields.component';
import { assetTabsComponent } from '../../partialView/assetDetails/asset_tabs.component';
import { GroupDetailsComponent } from 'app/components/partialView/group-details/group-details.component';
// import { ComponentSpiltDialogComponent } from '../edit_asset/component-spilt-dialog/component-spilt-dialog.component';
// import { CreateGroupDialogComponent } from '../edit_asset/create-group-dialog/create-group-dialog.component';
import { ComponentSplitDialogComponent } from '../../relationship/dialog/component-split-dialog/component-split-dialog.component';
import { CreateGroupDialogComponent } from '../../relationship/dialog/create-group-dialog/create-group-dialog.component';
import { MultiSearchDialogComponent } from 'app/components/partialView/multi-search-dialog/multi-search-dialog.component'; 
interface City {
  id: string;
  name: string;
}

interface Plant {
  id: string;
  name: string;
}

const CITY: City[] = [];

const PLANTS: Plant[] = [];


export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};
@Component({
  selector: 'app-edit_asset',
  templateUrl: './edit_asset.component.html',
  styleUrls: ['./edit_asset.component.scss'] 
})
export class EditAssetComponent implements OnInit {
  products: any ;
  protected _onDestroy = new Subject<void>();
  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public Edit_data: any[];
  SelectAssetMaster = ["Transfer", "Retirement", "Edit", "Tagging", "Inventory", "Componentization"];
  filterDropdown = ["Transaction Pending", "Transaction Failed"];
  public SelectedAssetmaster: any;
  public Edittempdatasource: any[] = [];
  public Editselecteddatasource: any[] = [];

  //protected city: City[] = CITY;
  public cityMultiCtrl: any ;
  public cityMultiFilterCtrl: FormControl = new FormControl();
  public filteredCityMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  protected plants: Plant[] = PLANTS;
  public plantMultiCtrl: any ;
  public plantMultiFilterCtrl: FormControl = new FormControl();
  public filteredPlantsMulti: ReplaySubject<Plant[]> = new ReplaySubject<Plant[]>(1);
  menuheader: any = (menuheaders as any).default
  public selectedData: FormControl = new FormControl();

  value: any;
  updateData: any;
  updateDataInsert: any;
  deleteOptions: { option: any; id: any; };
  json: any;
  show: boolean = false;
  public hideth;
  private isButtonVisible = false;
  public getselectedData: any[] = [];
  public assetlength;
  public newLength;
  public arrlength = 0;
  public arr = [];
  public newdataSource = [];
  public isallchk: boolean;
  selection = new SelectionModel<any>(true, []);
  IslayerDisplay: any;
  CompanyId: any;
  GroupId: any;
  UserId: any;
  RegionId: any;
  Layertext: any;
  layerid: any;
  HeaderLayerText: any;
  displayTable: boolean = false;
  displaybtn: boolean = false;
  panelOpenState = true;

  public dataSource;
  displayedHeadersEdit = [];
  // displayedColumnsEdit = ["Select", "InventoryNo", "AssetNo", "SubNo", "AssetType", "AssetSub-Type", "CapitalizationDate", "AssetClass", "AssetName", "AssetDescription", "Plant", "Cost", "WDV", "AssetrakStage",
  //   "EquipmentNumber", "AssetCondition", "AssetCriticality"];
  @Output() insuranceEndDate: EventEmitter<any> = new EventEmitter<any>();
  displayedColumns: any[] = [];
  AssetNoFilter = new FormControl();

  filteredValues = {
    AssetNo: '', SubNo: '', CapitalizationDate: '',
    AssetClass: '', AssetType: '',
    AssetSubType: '', UOM: '', AssetName: '',
    AssetDescription: '', Qty: '', Cost: '', WDV: '',
    EquipmentNO: '', AssetCondition: '', AssetCriticality: ''

  };

  public appliedfilters: any[] = [];
  public sendData;
  public grpdata;

  searchby: string = "";
  // 
  public searchFilterCtrl: FormControl = new FormControl();
  ReportForm: FormGroup;

  constructor(
    // private cs: CommonService,
    public dialog: MatDialog,
    private storage: ManagerService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService, public localService: LocalStoreService,
    private httpService: HttpClient,
    private router: Router,
    public gs: GroupService,
    public us: UserService,
    public cls: CompanyLocationService,
    public cbs: CompanyBlockService,
    public alertService: MessageAlertService,
    public assetService: AssetService,
    public rs : ReportService,
    public toastr: ToastrService,
    private jwtAuth: JwtAuthService,private fb:FormBuilder
  ) {
    this.products = this.jwtAuth.getHeaders();
    this.Headers = this.jwtAuth.getHeaders();
    this.message = this.jwtAuth.getResources();

    this.displayedHeadersEdit = ['', this.products.InventoryNumber, this.products.AssetNo, this.products.SAID, this.products.AssetType, this.products.SubTypeOfAsset, this.products.AcquisitionDate, this.products.AssetClass,
    this.products.ADL2, this.products.ADL3, this.products.Location, this.products.AcquisitionCost, this.products.WDV, this.products.Stage, this.products.EquipmentNumber, this.products.AssetCondition, this.products.AssetCriticality];
  }

  Headers: any ;
  message: any;

  paginationParams: any;

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Records per page';
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
    this.AssetNoFilter.valueChanges.subscribe((AssetNoFilterValue) => {
      this.filteredValues['AssetNo'] = AssetNoFilterValue;
      this.dataSource.filter = this.filteredValues.AssetNo;
    });

    this.hideth = true;
    this.cityMultiCtrl = "";
    this.plantMultiCtrl = "";
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

    this.ReportForm = this.fb.group({
      searchFilterCtrl : ['', [Validators.required]],
    })
  }

  SelectedSBUItems: any[] = [];

  SelectSBUCheckbox(event) {

    this.SelectedSBUItems = event;
  }


  SelectedPlantItems: any[] = [];

  SelectPlantCheckbox(event) {
    this.SelectedPlantItems = event;
  }

  ListOfField: any[] = [];
  ListOfFilter: any[] = [];
  ListOfFilterName: any[] = [];
  NewModifiedList: any[] = [];
  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  SBUList: any[] = [];
  PlantList: any[] = [];
  PlantList1: any[] = [];
  CategoryList: any[] = [];
  ListOfField1: any[] = [];
  searchColumns: any[] = [];
  GetInitiatedData() {

    this.loader.open();
    let url1 = this.gs.GetFieldListByPageId(21,this.UserId,this.CompanyId);
    let url2 = this.gs.GetFilterIDlistByPageId(21);
    let url3 = this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.RegionId, "21");
    let url4 = this.cls.GetLocationListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 21)
    let url5 = this.us.CheckFreezePeriodStatus(this.GroupId, this.RegionId, this.CompanyId);
    let url6 = this.cbs.GetCategoryListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 21);
    //  let url6 = this.groupservice.GetFieldList(66,this.SessionUserId);
    forkJoin([url1, url2, url3, url4 , url5 , url6]).subscribe(results => {
      if (!!results[0]) {
        this.ListOfField = JSON.parse(results[0]);
        this.searchColumns = this.ListOfField.filter(x => x.SearchOptionEnabled == true).map(choice => choice);
        this.displayedColumns = this.ListOfField;
        this.displayedColumns = this.displayedColumns.filter(x => x.Custom2 == "1").map(choice => choice.Custom1);
        this.displayedColumns = ['Select', 'Icon'].concat(this.displayedColumns);
        console.log("Displayed: ", this.displayedColumns)
      }
      if (!!results[1]) {
        this.ListOfFilter = JSON.parse(results[1]);
        if (!!this.ListOfFilter) {
          this.ListOfFilter.forEach(x => this.ListOfFilterName.push(x.FilterName))
        }
      }
      if (!!results[2]) {
        this.ListOfPagePermission = JSON.parse(results[2]);
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
      if (!!results[3]) {
        this.PlantList1 = JSON.parse(results[3]);
        this.PlantList = JSON.parse(results[3]);
        this.SBUList = this.UniqueArraybyId(this.PlantList, this.Layertext);
        this.getFilterCityType();
        this.getFilterPlantType();
      }
      if (!!results[4]) {
        
        var FreezePeriod = results[4];
        if (!!FreezePeriod) {
          this.alertService.alert({ message: this.message.NotAuthorisedToAccessONFreezePeriod, title: this.message.AssetrakSays })
          .subscribe(res => {
            this.router.navigateByUrl('h/a')
          })
        }
      }
      if (!!results[5]) {
        this.CategoryList = JSON.parse(results[5]);
      }
                  // if (!!results[1]) {

      //   this.ListOfField1 = JSON.parse(results[1]);
      //   this.searchColumns = this.ListOfField1.filter(x => x.SearchOptionEnabled == true).map(choice => choice);
      // }

      this.loader.close();
      this.GetPageSession();
    })
  }

  CategoryGetdata() {  
    this.showmultiSearch = false;  
    if (!!this.SelectedPlantItems && this.SelectedPlantItems.length > 0) {
    }
    else {
      this.PlantList.forEach(x => {
        this.SelectedPlantItems.push(x.LocationId);
      })
    }
    debugger
    this.rs.GetCategoryRightWiseForReport(this.CompanyId, this.UserId, this.SelectedPlantItems, false, 21).subscribe(r => {
      this.CategoryList = [];
      r.forEach(element => {
        this.CategoryList.push(element);
      });
    })
  }

  SetPageSession() {
    
    var LocationIdList = [];
    if (!!this.plantMultiCtrl) {
      this.plantMultiCtrl.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }
    var formData = {
      'Pagename': "Edit Asset",
      'SbuList': [],
      'LocationIdList': LocationIdList,
      'SearchText': !!this.searchby ? this.searchby : "",
    };
    localStorage.setItem('PageSession', JSON.stringify(formData));
  }

  StorePageSession: any;
  GetPageSession() {
    
    this.StorePageSession = "";
    if (!!localStorage.getItem('PageSession') && localStorage.getItem('PageSession') != "null") {
      this.StorePageSession = {}
      this.StorePageSession = JSON.parse(localStorage.getItem('PageSession'));
      if (this.StorePageSession.Pagename === "Edit Asset") {
        var list = [];
        this.plantMultiCtrl = "";
        this.PlantList.forEach(x => {
          
          if (this.StorePageSession.LocationIdList.indexOf(x.LocationId) > -1) {
            list.push(x);
            this.plantMultiCtrl = list;
          }
        })
        this.searchby = this.StorePageSession.SearchText;
        this.GetGridData();
      }
      else {
        localStorage.setItem('PageSession', null);
        this.StorePageSession = "";
      }
    }
  }
  onchangeSBU(value) {
    this.showmultiSearch = false;
    if (!!value) {
      var list = [];
      if (!!this.cityMultiCtrl && this.cityMultiCtrl.length > 0) {
        this.cityMultiCtrl.forEach(x => {
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
      this.getFilterPlantType();
    }
    else {
      this.PlantList = this.PlantList1;
      this.plantMultiCtrl = "";
      this.getFilterPlantType();
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

  numSelected: any = 0;
  getselectedIds: any[] = [];
  isAllSelected: boolean = false;
  masterToggle() {
    

    this.isAllSelected = !this.isAllSelected;
    this.selection.clear();
    this.getselectedIds = [];
    this.selectedQtySplitData = [];
    this.btnGroupAsset = false;
    this.btnSplitAsset = false;
    if (this.isAllSelected == true) {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
    // else {
    //   this.dataSource.data.forEach(row => this.selection.toggle(row));
    // }
    this.numSelected = this.selection.selected.length;
    if (this.numSelected > 0) {
      this.btnGroupAsset = true;
      this.selection.selected.forEach(row => {
        this.getselectedIds.push(row.PreFarId);
        this.selectedQtySplitData.push(row);
        if ((row.MergeId == 0 || row.MergeId == null) && (row.SplitId == 0 || row.SplitId == null) && (row.MergeId2 == 0 || row.MergeId2 == null) && (row.BlockOfAsset == this.selectedQtySplitData[0].BlockOfAsset)) { }
        else {
          this.btnGroupAsset = false;
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
  }
  selectedQtySplitData: any[] = [];
  btnGroupAsset: boolean = false;
  btnSplitAsset: boolean = false;
  isSelected(row) {
    
    this.isAllSelected = false;
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
    
  }

  getFilterCityType() {
    this.filteredCityMulti.next(this.SBUList.slice());
    this.cityMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCityMulti();
      });
  }
  protected filterCityMulti() {
    if (!this.SBUList) {
      return;
    }
    let search = this.cityMultiFilterCtrl.value;
    if (!search) {
      this.filteredCityMulti.next(this.SBUList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCityMulti.next(
      this.SBUList.filter(x => x.City.toLowerCase().indexOf(search) > -1)
    );
  }
  getFilterPlantType() {
    this.filteredPlantsMulti.next(this.PlantList.slice());
    this.plantMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPlantsMulti();
      });
  }
  protected filterPlantsMulti() {
    if (!this.PlantList1) {
      return;
    }
    let search = this.plantMultiFilterCtrl.value;
    if (!search) {
      this.filteredPlantsMulti.next(this.PlantList1.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredPlantsMulti.next(
      this.PlantList1.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1)
    );
  }


  OnGetlayerid() {

    if (this.layerid == 1) {
      this.SBUList = this.SBUList.filter((item, i, arr) => arr.findIndex((t) => t.Country === item.Country) === i);
      this.filteredCityMulti.next(this.SBUList);
      // this.filteredPlantsMulti.next(this.PlantList.filter((item) => item.Country = this.SBUName).slice());
      // this.filteredSBUMulti.next(this.SBUList.filter((item) => item.Country.slice()));
    }
    else if (this.layerid == 2) {
      this.SBUList = this.SBUList.filter((item, i, arr) => arr.findIndex((t) => t.State === item.State) === i);
      this.filteredCityMulti.next(this.SBUList);
      // this.filteredPlantsMulti.next(this.PlantList.filter((item) => item.State = this.SBUName.slice()));
    }
    else if (this.layerid == 3) {
      this.SBUList = this.SBUList.filter((item, i, arr) => arr.findIndex((t) => t.City === item.City) === i);
      this.filteredCityMulti.next(this.SBUList);
    }
    else if (this.layerid == 4) {
      this.SBUList = this.SBUList.filter((item, i, arr) => arr.findIndex((t) => t.Zone === item.Zone) === i);
      this.filteredCityMulti.next(this.SBUList);
    }

    this.cityMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCityMulti();
      });
  }

  //====== Bind Data To DataSource========  
  handlePage(pageEvent: PageEvent) {

    this.paginationParams.pageSize = pageEvent.pageSize;
    this.paginationParams.currentPageIndex = pageEvent.pageIndex;
    this.paginationParams.endIndex = (this.paginationParams.currentPageIndex + 1) * pageEvent.pageSize;
    this.paginationParams.startIndex = this.paginationParams.currentPageIndex * pageEvent.pageSize;
    this.GetGridDataBindData("")
    if(this.multipleserach= true && this.multiSearch.length > 0)
    {
      this.GetGridDataBindData("multiplesearch");
    }
  }
  GetGridData() {
    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;
    this.GetGridDataBindData("");
  }
  bindData: any[] = [];
  Searchlist :any[];
  GetGridDataBindData(Action) {
      debugger;
      if (!this.searchby) {
        this.toastr.warning("Please Select Search", this.message.AssetrakSays);
        return null;
      }
    this.loader.open();
    var SbuList = [];
    var LocationIdList = [];
    var CategoryIdList = [];
    this.multipleserach = false;
    if (!!this.SelectedPlantItems && this.SelectedPlantItems.length > 0) {
    }
    else {
      this.PlantList.forEach(x => {
        this.SelectedPlantItems.push(x.LocationId);
      })
    }
    this.CategoryList.forEach(x => {
      CategoryIdList.push(x.AssetCategoryId);
    })
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
    var searchassetsDto = {
      LocationIdList: this.SelectedPlantItems,
      CategoryIdList: CategoryIdList,
      AssetsClassList: [],
      typeOfAssetList: [],
      subTypeOfAssetList: [],
      QuantityList: [],
      pageNo: this.paginationParams.currentPageIndex + 1,
      pageSize: this.paginationParams.pageSize,
      SbuList: SbuList,
      SearchText: this.searchby,
      CompanyId: Number(this.CompanyId),
      RegionId: Number(this.RegionId),
      UserId: Number(this.UserId),
      AssetStage: "AllAssets",
      PageName: "EditAssetData",
      TaskId: 7,
      TaskName: "Edit Assets",
      IsForManageGroup: false,
      ProjectId: 0,
      GroupType: "",
      Flag: "",
      IsExport: false,
      PageId: 21,
      GroupId: this.GroupId,
      ismultiplesearch: this.multipleserach,
      Searchlist : this.Searchlist,
    }

    this.assetService.SearchAssetJSON(searchassetsDto)
      .subscribe(result => {

        this.loader.close();
        this.bindData = [];
        if (!!result) {
          this.bindData = JSON.parse(result)
        }
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
      });
  }

  onChangeDataSource(value) {
    this.dataSource = new MatTableDataSource(value);
    //this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  
  toggleSelectAllCity(selectAllValue) {
    
    this.cityMultiCtrl = [];
    this.filteredCityMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        
        if (!!selectAllValue.checked) {
          this.SBUList.forEach(element => {
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
          //this.plantMultiCtrl.patchValue(val);
          this.PlantList.forEach(element => {
            this.plantMultiCtrl.push(element.LocationId);
          });          
        } else {         
          this.plantMultiCtrl="";
        }
      });
  }

  protected setInitialValue() {
    this.filteredCityMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: any, b: any) => a && b && a.id === b.id;
      });

    this.filteredPlantsMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: Plant, b: Plant) => a && b && a.id === b.id;
      });
  }

  ngAfterViewInit() {

  }

  applyFilterEdit(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
  // isAllSelected() {
  //   this.newdataSource = [];
  //   if (this.isallchk == true) {
  //     for (let i = 0; i < this.Edit_data.length; i++) {
  //       this.newdataSource.push(this.Edit_data[i].ID);
  //     }
  //   }
  //   console.log(this.isAllSelected);
  //   this.arrlength = this.newdataSource.length;
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource.data.length;
  //   return numSelected === numRows;
  // }


  openUpdateAssetRegisterDialog() {

    var component: any
    component = UpdateAssetRegisterComponent;
    const dialogRef = this.dialog.open(component, {
      panelClass: 'group-form-dialog',
      width: '50%',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
  openComponent_Split() {
      
    let configdata = {
      CompanyId: this.CompanyId,
      GroupId: this.GroupId,
      UserId: this.UserId,
      RegionId: this.RegionId,
      selected: this.selection.selected
    }
    let title = 'Component Split';
    let dialogRef: MatDialogRef<any> = this.dialog.open(ComponentSplitDialogComponent, {
      data: { title: title, configdata: configdata }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        
        if (!!res) {
          // this.assetService.splitComponent(res).subscribe(response => {              
          //   this.toastr.success(this.message.ComponentSplitSucess, this.message.AssetrakSays);            
          // });
          this.clearSelected();
        }
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
      this.PlantList.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }
    let configdata = {
      CompanyId: this.CompanyId,
      GroupId: this.GroupId,
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
        
        if (!!res) {
          this.assetService.groupSplit(res).subscribe(response => {
            
            this.toastr.success(this.message.GroupDoneSuccessfully, this.message.AssetrakSays);
            //this.GetSubGroupJson(res.parentAssets);
            this.clearSelected();
          });
        }
      })
  }



  // openCreate_Group() {

  //   var component: any
  //   component = CreateGroupDialogComponent;
  //   const dialogRef = this.dialog.open(component, {
  //     panelClass: 'group-form-dialog',
  //     width: '75%',
  //     disableClose: true,
  //     data: {
  //       payload: this.selectedData.value,
  //       tabledata: this.Edit_data
  //     },
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {

  //     }

  //   });
  // }

  // openComponent_Split() {

  //   var component: any

  //   component = ComponentSplitDialogComponent;


  //   const dialogRef = this.dialog.open(component, {
  //     panelClass: 'group-form-dialog',
  //     width: '75%',
  //     disableClose: true,
  //     data: {
  //       payload: this.selectedData.value,
  //     },
  //   });


  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {


  //     }

  //   });
  // }  

  setflag: boolean = false;
  opentablePopup(columnName) {
  }

  openFilter_PopUp() {

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
  PageId =21;
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

  viewSelected() {

    this.dataSource = new MatTableDataSource(this.getselectedData);
  }

  clearSelected() {
    this.selection.clear();
    this.getselectedIds = [];
    this.selectedQtySplitData = [];
    this.btnGroupAsset = false;
    this.btnSplitAsset = false;
    this.newdataSource = [];
    this.getselectedData = [];
    this.arrlength = 0;
    this.GetGridDataBindData("");
  }

  clearfilter() {
    if (this.appliedfilters.length > 0) {
      while (this.appliedfilters.length > 0) {
        this.appliedfilters.splice(this.appliedfilters.length - 1);
        console.log(this.appliedfilters);
      }
    }
  }

  // openEditAssetDialog() {
  //    
  //   this.router.navigateByUrl('create_assets/edit_asset_popup');
  // }
  openEditAssetDialog() {
    
    //this.selectedData.value = this.selectedQtySplitData[0];
    this.selectedQtySplitData[0]["pagename"] = "editasset";
    this.router.navigate(['/h1/cc'], {
      state: this.selectedQtySplitData[0]
    });
    //this.router.navigate(['create_assets/edit_review_asset',this.getselectedData]);
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
    this.GetGridDataBindData("");
 }
 multipleserach : boolean= false;
 onMultiSearchClick(){
 
  if(this.searchCount == 0){
    this.toastr.warning(`Please Select All Fields`, this.message.AssetrakSays);
    return null;
   }
   else{
    this.multipleserach= true ;
    this.GetGridDataBindData("multiplesearch");
    console.log(this.multiSearch);
   }
 
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
