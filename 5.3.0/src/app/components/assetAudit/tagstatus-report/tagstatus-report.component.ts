import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl, FormArray, FormGroup, Validators,FormBuilder } from '@angular/forms';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import * as header from '../../../../assets/Headers.json';
import * as resource from '../../../../assets/Resource.json';
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
import { AssetClassService } from '../../services/AssetClassService';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import { assetTabsComponent } from '../../partialView/assetDetails/asset_tabs.component';
import { GetFieldsComponent } from 'app/components/partialView/get-fields/get-fields.component';
import * as menuheaders from '../../../../assets/MenuHeaders.json'
import { Sort } from '@angular/material/sort';
import { AllPathService } from 'app/components/services/AllPathServices';
import { R } from '@angular/cdk/keycodes';
import { ReportService } from 'app/components/services/ReportService';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

export interface SqSort extends Sort {
  //   /** The id of the column being sorted. */
  // active: string;

  // /** The sort direction. */
  // direction: SortDirection;
  type: string;
}

@Component({
  selector: 'app-tagstatus-report',
  templateUrl: './tagstatus-report.component.html',
  styleUrls: ['./tagstatus-report.component.scss']
})
export class TagstatusReportComponent implements OnInit {

  Headers: any ;
  message: any = (resource as any).default;

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
  menuheader: any = (menuheaders as any).default
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


  CompanyId: any;
  GroupId: any;
  UserId: any;
  RegionId: any;
  IslayerDisplay: any;
  layerid: any;
  Layertext: any;
  HeaderLayerText: any;
  serachtext: any;
  colunname: any;
  ReportForm: FormGroup;

  public cityMultiCtrl: any;
  public cityMultiFilterCtrl: FormControl = new FormControl();
  public filteredCityMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public plantMultiCtrl: any;
  public plantMultiFilterCtrl: FormControl = new FormControl();
  public filteredPlantsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public categoryMultiCtrl: any;
  public categoryFilterCtrl: FormControl = new FormControl();
  public filteredcategoryMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public inventoryMulti: any;
  public materialMulti: any;
  public printMulti: any;
  public inventoryMultiCtrl: FormControl = new FormControl();
  public InventoryFilterCtrl: FormControl = new FormControl();
  public inventorynote: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public materialnote: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public printtypenote: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);



  InventoryNoteType: any[] = [
    { id: 'Damaged/Non-readable', name: 'Damaged/Non-readable' },
    { id: 'Inconvenient to Scan', name: 'Inconvenient to Scan' },
    { id: 'Tag not available', name: 'Tag not available' },
  ];

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  protected _onDestroy = new Subject<void>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: any[] = ['select'];
  //displayedColumns: string[] = ['DownloadPrint', 'Barcode', 'AssetId', 'SubAssetId', 'AcquisitionDate', 'BlockOfAsset', 'ADL2', 'ADL3', 'Quantity', 'Unit', 'Location', 'AcquisitionCost', 'WDV'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  tempdatasource: any[] = [];
  displayTable: boolean = false;
  displaybtn: boolean = false;

  constructor(public dialog: MatDialog,
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
    public alertService: MessageAlertService,
    public ast: AssetClassService,
    public rs: ReconciliationService,
    public AllPathService: AllPathService,
    public reportService: ReportService,private jwtAuth:JwtAuthService,
    private fb:FormBuilder) 
    {
      this.Headers = this.jwtAuth.getHeaders()
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
    this.inventoryMulti = "";
    
    this.ReportForm = this.fb.group({
      plantMultiFilterCtrl : ['', [Validators.required]],
    })
    this.GetInitiatedData();

    this.inventorynote.next(this.InventoryNoteType.slice());
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  ListOfField: any[] = [];
  ListOfFilter: any[] = [];
  ListOfFilterName: any[] = [];
  ListOfCategory: any[] = [];
  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  ListOfLoc: any[] = [];
  ListOfLoc1: any[] = [];
  ListOfSBU: any[] = [];
  GetInitiatedData() {

    let url1 = this.cls.GetLocationListByConfigurationAndAssetsAvailable(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 29,"tagStatus");
    let url2 = this.cbs.GetCategoryListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 29);
    let url3 = this.gs.GetFieldListByPageId(29,this.UserId,this.CompanyId);
    let url4 = this.gs.GetFilterIDlistByPageId(29);
    let url5 = this.gs.CheckWetherConfigurationExist(this.GroupId, 11);
    let url6 = this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.RegionId, "29");
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
        this.getFilterCategoryType();
      }
      if (!!results[2]) {
        this.ListOfField = JSON.parse(results[2]);
        this.displayedColumns = this.ListOfField;
        this.displayedColumns = this.displayedColumns.filter(x => x.Custom2 == "1").map(choice => choice.Custom1);
        this.displayedColumns = ['Select'].concat(this.displayedColumns);
        console.log("fields",this.displayedColumns);
      }
      if (!!results[3]) {
        this.ListOfFilter = JSON.parse(results[3]);
        if (!!this.ListOfFilter) {
          this.ListOfFilter.forEach(x => this.ListOfFilterName.push(x.FilterName))
        }
      }
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

  selectedPlantIdList: any[] = [];
  onChangePlant(plantId) {
    this.selectedPlantIdList = [];
    this.selectedPlantIdList.push(plantId);
    this.CategoryGetdata();
  }

  CategoryGetdata() {
    this.ListOfCategory = [];
    this.filteredcategoryMulti= new ReplaySubject<any[]>(1);
    this.categoryMultiCtrl="";
    var companyId = this.CompanyId;
    var userId = this.UserId;
    var IsGroupRegion = false;
    var PlantList = !!this.selectedPlantIdList ? this.selectedPlantIdList.join(',') : "";
    var moduleId=29;
    this.reportService.GetCategoryRightWiseForReport(companyId, userId, PlantList, IsGroupRegion,moduleId).subscribe(r => {

      r.forEach(element => {
        this.ListOfCategory.push(element)
        this.getFilterCategoryType();
      });
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
  getFilterPlantType() {
    this.filteredPlantsMulti.next(this.ListOfLoc.slice());
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
      this.ReprinttagStatusBindData("SearchText")
    }
    else {
      this.ReprinttagStatusBindData("")
    }

  }
  IsSearch: boolean = false;
  issort: boolean = false;
  isExport: boolean = false;
  ReprinttagStatus() {
    this.selection.clear();
    this.getclear();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;
    this.ReprinttagStatusBindData("OnPageload");
  }

  // clickToExport() {
  //   if(this.displayTable == true){

  //     this.ReprinttagStatusBindData("IsExport");
  //   }else{
  //     this.toastr.warning(`No data selected to export`, this.message.AssetrakSays);
  //     return null;      
  //   }
  // }
  clickToExport() {
    if(this.displayTable == true && this.dataSource.data.length != 0){
      this.ReprinttagStatusBindData("IsExport");
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

  ReprinttagStatusBindData(Action) {
    debugger;
    if (!this.plantMultiCtrl) {

      this.toastr.warning(`Please Select ${this.Headers.Location}`, this.message.AssetrakSays);
      return null;
    }
    this.loader.open();
    var locationId = 0;
    var LocationIdList = [];
    var CategoryIdList = [];

    if (!!this.plantMultiCtrl) {
      locationId = !!this.plantMultiCtrl ? this.plantMultiCtrl.LocationId : 0;
      LocationIdList.push(locationId);
    }
    else {
      this.ListOfLoc1.forEach(x => {
        LocationIdList.push(x.LocationId);
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

    //===== Sorting and Searching ===
    this.isExport = false;
    this.issort = false;
    this.IsSearch = false;
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

    var assetDetails = {
      CompanyId: this.CompanyId,
      LocationId: !!this.plantMultiCtrl ? this.plantMultiCtrl.LocationId : 0,
      CategoryIdList: CategoryIdList,
      ProjectType: 2,
      ProjectId: 0,
      AssetStatus: 0,
      AssetStage: 9,
      BlockOfAsset: 0,
      LabelQuality: !!this.inventoryMulti ? this.inventoryMulti : "All",
      //LabelQuality: [],
      pageNo: this.paginationParams.currentPageIndex + 1,
      pageSize: this.paginationParams.pageSize,
      IsSearch: this.IsSearch,
      SearchText: this.serachtext,
      IsExport: this.isExport,
      columnName:this.colunname,
      PageId : 29
    }

    this.rs.GetReconciliationAssetListForLabelStatusdto(assetDetails).subscribe(r => {
      debugger;
      this.loader.close();
      if (Action === 'IsExport') {
        debugger;
        if(!!r)
        {
          this.AllPathService.DownloadExportFile(r);
          console.log("URL", URL);
        }
      }else{
        this.bindData = !!r ? JSON.parse(r) : [];
        this.paginationParams.totalCount = 0;
        if (!!this.bindData && this.bindData.length > 0) {
          this.paginationParams.totalCount = this.bindData[0].AssetListCount;
          this.displaybtn = true;
          this.displayTable = true;
        }
        this.displayTable = true;
        this.onChangeDataSource(this.bindData);
      }
      // this.bindData = !!r ? JSON.parse(r) : [];
      // this.paginationParams.totalCount = 0;
      // if (!!this.bindData && this.bindData.length > 0) {
      //   this.paginationParams.totalCount = this.bindData[0].AssetListCount;
      //   this.displaybtn = true;
      //   this.displayTable = true;
      // }
      // this.onChangeDataSource(this.bindData);
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

  numSelected: any = 0;
  getselectedIds: any[] = [];
  isAllSelected: boolean = false;
  masterToggle() {
    this.selection.clear();
    this.isAllSelected = !this.isAllSelected;
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
  SendForReTagging() {
    debugger;
    if (this.selection.selected.length > 0) {
      var assetDetails = {
        LId: !!this.plantMultiCtrl ? this.plantMultiCtrl.LocationId : 0,
        ProjectId: 0,
        ProjectType: "Inventory",
        LastModifiedBy: this.UserId,
        AssetList: this.getselectedIds.join(',')
      }

      this.rs.SendForReTagging(assetDetails).subscribe(r => {
        debugger;
        if (r == true) {
          // this.toastr.success("success", this.message.AssetrakSays);
          this.toastr.success(this.message.Tagsentreprintingsuccessfully, this.message.AssetrakSays);
        }
        else {
          this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
        }
        this.clearSelected();
      })
    }
    else {
      this.toastr.warning(this.message.NoassetsAvailable, this.message.AssetrakSays);
    }
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
    this.filteredcategoryMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {

        if (selectAllValue) {
          this.categoryMultiCtrl.patchValue(val);
        } else {
          this.categoryMultiCtrl.patchValue([]);
        }
      });
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
    this.ReprinttagStatusBindData("");
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
  PageId =29;
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
      this.ReprinttagStatusBindData("SearchText");
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
    this.ReprinttagStatusBindData("");

  }
  SearchcolumnName: any;

  Serchicon(columnName, isflag) {

    this.variable = this.AssetNoFilter.setValue("");
    this.SearchcolumnName = columnName;
    this.getclear();
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
          this.ReprinttagStatusBindData("")
        } else {
          this.variable1 = $event.active;
          this.ReprinttagStatusBindData("Sort")
        }
      }
    }
  }

}
