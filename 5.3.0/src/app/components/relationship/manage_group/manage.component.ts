import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
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
import * as resource from '../../../../assets/Resource.json';
import * as header from '../../../../assets/Headers.json';
import { ToastrService } from 'ngx-toastr';
import { CompanyBlockService } from '../../services/CompanyBlockService';
import { GroupService } from '../../services/GroupService';
import { CompanyLocationService } from '../../services/CompanyLocationService';
import { UserService } from '../../services/UserService';
import { Router, ActivatedRoute } from '@angular/router';
import { AllPathService } from 'app/components/services/AllPathServices';
import * as menuheaders from '../../../../assets/MenuHeaders.json'
interface AssetType {
  id: string;
  name: string;
}
interface UOM {
  id: string;
  name: string;
}

interface City {
  id: string;
  name: string;
}
interface Plant {
  id: string;
  name: string;
}


interface ManageGroup {
  id: string;
  name: string;
}
export interface PeriodicElement {
  InventoryNo: string;
  AssetNo: string;
  Records: string;
  SubNo: string;
  CapitalizationDate: string;
  AssetClass: string;
  AssetType: string;
  AssetSubType: string;
  Plant: string;
  AssetName: string;
  AssetDescription: string;
  Qty: string;
  Location: string;
  Cost: string;
  WDV: string;
  EquipmentNO: string;
  AssetCondition: string;
  AssetCriticality: string;
  AssetinAction: string;
}

const PLANTS: Plant[] = [];
const CITY: City[] = [];

const MANAGEGROUP: ManageGroup[] = [
  { name: 'Minor Group', id: 'A' },
  { name: 'Major Group', id: 'B' },
];

@Component({
  selector: 'app-managegroup',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageGroupComponent implements OnInit, AfterViewInit, OnDestroy {
  Headers: any = (header as any).default;
  message: any = (resource as any).default;

  HeaderLayerText: any;
  numRows: number;
  selectedValue: string;
  selectedassetclass: string;
  selectedassettype: string;
  selectedassetuom: string;
  IsDisabled: boolean = true;
  //arrBirds: Array<arrBirds> = [];
  public arrBirds: any[];
  private isButtonVisible = false;
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
  menuheader :any =(menuheaders as any).default
  /////Filter Instance/////////

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



  ///////////////////////////////////
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


  displayedColumns: any[] = ['select'];
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
    public AllPathService : AllPathService
  ) {

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
  fileDownloadPath : any;
  private readonly setting = {
    element: { dynamicDownload: <unknown>null as HTMLElement }
  };
  ngOnInit(): void {
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
    debugger;
    
    this.GetInitiatedData();
    this.GetInitiatedFieldData();

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



    this.AssetNoFilter.valueChanges.subscribe((AssetNoFilterValue) => {
      this.filteredValues['AssetNo'] = AssetNoFilterValue;
      this.dataSource.filter = this.filteredValues.AssetNo;
    });

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

  quantitySplit() {
    const assetsDetails = {
      CompanyId: this.companyId,
      LastModifiedBy: '5',
      AssetList: this.quantitySplitId
    };
    this.assetService.quantitySplit(assetsDetails).subscribe(response => {
      if (response === 'success') {
        this.snackBar.open('Quantity split successful!', 'Dismiss');
      }
    });
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
  ListOfSBU: any[] = [];
  ListOfCategory: any[] = [];
  ListOfField: any[] = [];
  ListOfFilter: any[] = [];
  ListOfFilterName: any[] = [];
  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  GetInitiatedData() {
    debugger;
    let url1 = this.cls.GetLocationListByConfiguration(this.groupId, this.UserId, this.companyId, this.regionId, 24);
    let url2 = this.cbs.GetCategoryListByConfiguration(this.groupId, this.UserId, this.companyId, this.regionId, 24);
    let url3 = this.gs.GetFieldListByPageId(24,this.UserId, this.companyId);
    let url4 = this.gs.GetFilterIDlistByPageId(24);
    let url5 = this.us.PermissionRightsByUserIdAndPageId(this.groupId, this.UserId, this.companyId, this.regionId, "24");
    forkJoin([url1, url2, url3, url4, url5]).subscribe(results => {
      if (!!results[0]) {
        this.ListOfLoc = JSON.parse(results[0]);
        this.ListOfSBU = this.UniqueArraybyId(this.ListOfLoc, this.Layertext);
        console.log(this.ListOfSBU);
        this.getFilterCityType();
        this.getFilterPlantType();
      }
      debugger;
      if (!!results[1]) {
        this.ListOfCategory = JSON.parse(results[1]);
        this.getFilterCategoryType();
      }
      if (!!results[2]) {
        this.ListOfField = JSON.parse(results[2]);
        this.displayedColumns = this.ListOfField;
        this.displayedColumns = this.displayedColumns.filter(x => x.Custom2 == "1").map(choice => choice.Custom1);
        this.displayedColumns = ['Select'].concat(this.displayedColumns);
        console.log("Displayed: ",this.displayedColumns)
      }
      if (!!results[3]) {
        this.ListOfFilter = JSON.parse(results[3]);
        if (!!this.ListOfFilter) {
          this.ListOfFilter.forEach(x => this.ListOfFilterName.push(x.FilterName))
          console.log(this.ListOfFilterName);

        }
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

      this.loader.close();
    })
  }
  //====== Bind Data To DataSource========  
  handlePage(pageEvent: PageEvent) {

    this.paginationParams.pageSize = pageEvent.pageSize;
    this.paginationParams.currentPageIndex = pageEvent.pageIndex;
    this.paginationParams.endIndex = (this.paginationParams.currentPageIndex + 1) * pageEvent.pageSize;
    this.paginationParams.startIndex = this.paginationParams.currentPageIndex * pageEvent.pageSize;
    this.GetAssetListBySelectionBindData("")
  }
  GetAssetListBySelection() {
    this.selection.clear();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0; 
    this.GetAssetListBySelectionBindData("OnPageload");
  }

  clickToExport() {
    this.GetAssetListBySelectionBindData("IsExport");
  }

  GetAssetListBySelectionBindData(Action) {
    this.loader.open();    
    var LocationIdList = [];
    var CategoryIdList = [];
    var BlockIdList = [];
    var TAIdList = [];
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

    if (Action === 'IsExport') {
      this.isExport = true;
    }
    else if (Action !== 'IsExport') {
      this.isExport = false;
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
      UnitList: [],
      PageName: "ScrutinizeAssets",
      groupTypeList: '',
      TAIdList: TAIdList,
      GroupId: this.groupId,
      pageNo: this.paginationParams.currentPageIndex + 1,
      pageSize: this.paginationParams.pageSize,
      SearchText: "",
      IsExport: this.isExport,
      SbuList: '',
      subTypeOfAssetList: "",
      QuantityList: "",
      BlockIdList: ""
    }    
    this.assetService.loadAssetListAllData(objAsetsParameterDto).subscribe((response: any) => {
      debugger;
      this.loader.close();
      if (Action === 'IsExport') {        
         this.AllPathService.DownloadExportFile(response); 
      }
      else{
        this.bindData = JSON.parse(response);
        console.log("data", this.bindData);
        this.paginationParams.totalCount = 0;
        if (!!this.bindData && this.bindData.length > 0) {
          this.paginationParams.totalCount = this.bindData[0].AssetListCount;
        }
        this.onChangeDataSource(this.bindData);
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
  masterToggle() {
    debugger;
    // this.isAllSelected() ?
    //   this.selection.clear() :
    //   this.dataSource.data.forEach(row => this.selection.select(row));
    this.isAllSelected = !this.isAllSelected;
    this.getselectedIds = [];
    if (this.isAllSelected == true) {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
    else {
      this.dataSource.data.forEach(row => this.selection.toggle(row));
    }
    this.numSelected = this.selection.selected.length;
    if (this.numSelected > 0) {
      this.selection.selected.forEach(row => this.getselectedIds.push(row.PreFarId));
    }
  }

  isSelected(row) {
    debugger;
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
  openComponent_Tagging() {
    debugger;
    var LocationId = !!this.plantMultiCtrl ? this.plantMultiCtrl[0].LocationId : 0;
    var BlockName = !!this.assetclassMultiCtrl ? this.assetclassMultiCtrl[0].BlockName : "";    
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
  getFilterPlantType() {
    this.filteredPlantsMulti.next(this.ListOfLoc.slice());
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

  toggleSelectAllCity(selectAllValue: boolean) {
    this.filteredCityMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.cityMultiCtrl.patchValue(val);
        } else {
          this.cityMultiCtrl.patchValue([]);
        }
      });
  }

  toggleSelectAll(selectAllValue: boolean) {
    this.filteredPlantsMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.plantMultiCtrl.patchValue(val);
        } else {
          this.plantMultiCtrl.patchValue([]);
        }
      });
  }
  toggleSelectAllcategory(selectAllValue: boolean) {
    debugger;
    this.filteredcategoryMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        debugger;
        if (selectAllValue) {
          this.categoryMultiCtrl.patchValue(val);
        } else {
          this.categoryMultiCtrl.patchValue([]);
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
  toggleSelectAllassetuom(selectAllValue: boolean) {
    this.filteredAssetUomMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.assetuomMultiCtrl.patchValue(val);
        } else {
          this.assetuomMultiCtrl.patchValue([]);
        }
      });
  }

  protected setInitialValue() {  }

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



  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.setInitialValue();
  }
  openDialog() {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    dialogconfig.width = "50%";

    //this.dialog.open(DialogExampleComponent, dialogconfig);

  }
  opencomponent() {
    const dialogconfigcom = new MatDialogConfig();
    dialogconfigcom.disableClose = true;
    dialogconfigcom.autoFocus = true;
    dialogconfigcom.width = "50%";

    //this.dialog.open(createComponent, dialogconfigcom);

  }
  openInventory() {
    const dialoginventory = new MatDialogConfig();
    dialoginventory.disableClose = true;
    dialoginventory.autoFocus = true;
    dialoginventory.width = "40%";
    //this.dialog.open(InventoryComponent, dialoginventory);
  }

  openList() {
    const dialogconfig1 = new MatDialogConfig();
    dialogconfig1.disableClose = true;
    dialogconfig1.autoFocus = true;
    dialogconfig1.width = "80%";
    //this.dialog.open(Dialog_ExampleComponent, dialogconfig1);

  }
  groupdialg() {
    const dialogconfig2 = new MatDialogConfig();
    dialogconfig2.disableClose = true;
    dialogconfig2.autoFocus = true;
    dialogconfig2.width = "80%";
  }

  openCommonDialog() {
    const dialogconfigcommon = new MatDialogConfig();
    dialogconfigcommon.disableClose = true;
    dialogconfigcommon.autoFocus = true;
    dialogconfigcommon.width = "80%";
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
    this.onChangeDataSource(this.selection.selected);
  }

  clearSelected() {   
    this.selection.clear();
    this.numSelected = 0;
    this.getselectedIds = [];
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

  opentablePopup(columnName) {
    // const dialogconfigcom = new MatDialogConfig();
    // dialogconfigcom.disableClose = true;
    // dialogconfigcom.autoFocus = true;
    // dialogconfigcom.width = "45%";
    // dialogconfigcom.data = this.tempdatasource;
    // const dialogRef = this.dialog.open(tablecolumComponent, dialogconfigcom);
    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result.length > 0) {
    //     for (let i = 0; i < this.arrBirds.length; i++) {
    //       var idx = result.indexOf(this.arrBirds[i].AssetNo);
    //       if (idx > -1) {
    //         this.selecteddatasource.push(this.arrBirds[i])
    //       }
    //     }
    //     this.dataSource = new MatTableDataSource(this.selecteddatasource);
    //   }
    // });
  }

  PageId =24;
  openPopUp(data: any = {}) {
    debugger;
    return null;
    let title = 'Add new member';    
    const dialogRef = this.dialog.open(assetTabsComponent, {
      width: 'auto',
      disableClose: true,
      data: { title: title, payload: data.PreFarId }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {         
          return;
        }
      })
  }
 editGridpop(){
    debugger
    let title= 'Edit Grid Display' ;
    const dialogRef = this.dialog.open(GetFieldsComponent, {
      width: '60vw',
     height: 'auto',
      data: { title: title, payload:this.ListOfField}
    })
    dialogRef.afterClosed().subscribe(result => {
      debugger
      if (!!result) {
        console.log(result)
        this.ListOfField = result;
        this.displayedColumns = this.ListOfField;         
        this.displayedColumns = this.ListOfField.filter(x => x.Custom2 == "1" ).map(choice => choice.Custom1);
        this.displayedColumns = ['Select'].concat(this.displayedColumns);
      }
    })
  }

  openCreate_Group() {
    // let title = 'Create Group';
    // let dialogRef: MatDialogRef<any> = this.dialog.open(CreateGroupDialogComponent, {
    //   width: '80vw',
    //   height: 'auto',
    //   disableClose: true,
    //   data: { title: title, payload: this.quantityList }
    // })
    // dialogRef.afterClosed()
    //   .subscribe(res => {
    //     this.GetAssetListBySelectionBindData("")
    //     if (!res) {
    //       // If user press cancel
    //       return;
    //     }
    //   })
  }

  openComponent_Split() {
    // let title = 'Component Split';
    // let dialogRef: MatDialogRef<any> = this.dialog.open(ComponentSplitDialogComponent, {
    //   data: { payload: this.quantityList }
    // })
    // dialogRef.afterClosed()
    //   .subscribe(res => {
    //     this.GetAssetListBySelectionBindData("")
    //     if (!res) {
    //       return;
    //     }
    //   })
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
    //     console.log(result);
    //     this.sendData = result;
    //     if (result.length > 0)
    //       for (let i = 0; i < result.length; i++) {
    //         this.appliedfilters.push(result[i].name);
    //       }
    //   })
  }

  openNew_PopUp() {
    // let title = 'Add new member';
    // let dialogRef: MatDialogRef<any> = this.dialog.open(newPopupComponent, {
    //   width: '45vw',
    //   maxHeight: '90vh',
    //   minHeight: '30vh',
    //   disableClose: true,
    // })
    // dialogRef.afterClosed()
    //   .subscribe(res => {
    //     this.GetAssetListBySelectionBindData("")
    //     if (!res) {
    //       // If user press cancel
    //       return;
    //     }
    //   })
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
  variable:any;
  variable1:any;
  action:any[]=[]
  SerchAssetid(columnName){
    debugger;
    this.variable1= columnName;
    this.variable=this.AssetNoFilter.value;
    // SearchText=this.AssetNoFilter.value
    this.action=[this.variable, this.variable1];
    this.GetAssetListBySelectionBindData(this.action);
  }

}
