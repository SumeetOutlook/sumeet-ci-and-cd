
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Inject,Output,EventEmitter  } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { take, takeUntil } from 'rxjs/operators';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { ReconciliationService } from '../../services/ReconciliationService';
import { CompanyLocationService } from '../../services/CompanyLocationService';
import { UserMappingService } from '../../services/UserMappingService';
import { CompanyBlockService } from '../../services/CompanyBlockService';
import { GroupService } from '../../services/GroupService';
import { UserService } from '../../services/UserService';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatDialogConfig } from '@angular/material/dialog';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { assetTabsComponent } from '../../partialView/assetDetails/asset_tabs.component';
import { MatTableDataSource } from '@angular/material/table';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSelect } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { ReceiveAssetDialogComponent } from '../dialog/receive-asset-dialog/receive-asset-dialog.component';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { GetFieldsComponent } from 'app/components/partialView/get-fields/get-fields.component';
import * as menuheaders from '../../../../assets/MenuHeaders.json';
import { AllPathService } from 'app/components/services/AllPathServices';
import { Sort } from '@angular/material/sort';
import { ReportService } from 'app/components/services/ReportService';
import { GroupDetailsComponent } from 'app/components/partialView/group-details/group-details.component';
import { ViewUploadDocumentsDialogComponent } from '../../partialView/view-upload-documents-dialog/view-upload-documents-dialog.component'
import { MultiSearchDialogComponent } from 'app/components/partialView/multi-search-dialog/multi-search-dialog.component'; 
import { ExportFieldsComponent } from 'app/components/partialView/export-fields/export-fields.component';

export interface SqSort extends Sort {
  //   /** The id of the column being sorted. */
  // active: string;

  // /** The sort direction. */
  // direction: SortDirection;
  type: string;
}

@Component({
  selector: 'app-receive-asset',
  templateUrl: './receive-asset.component.html',
  styleUrls: ['./receive-asset.component.scss']
})
export class ReceiveAssetComponent implements OnInit {

  Headers: any;
  message: any;
  menuheader: any = (menuheaders as any).default
  //displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol', 'date', 'assetclass', 'assetName', 'qty', 'uom', 'from', 'cost', 'wdv'];
  dataSource = new MatTableDataSource<any>();
  transfer = new FormControl();
  city = new FormControl();
  transferType = new FormControl();
  plant = new FormControl();
  transfertype = [];
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
  isExport: Boolean = false;
  issort: boolean = false;
  setflag: boolean=false;
  panelOpenState = true;
  multiSearch : any[]=[];
  multipleserach : boolean= false;
  showmultiSearch:any=false;
  @Output() insuranceEndDate: EventEmitter<any> = new EventEmitter<any>();
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
  displayedColumns: any[] = ['select'];
  // displayedColumns: string[] = ['select', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'];

  toppings = new FormControl();
  ListOfCategory: any[] = [];
  ListOfSBU: any[] = [];
  ListOfLoc: any[] = [];
  ListOfLoc1: any[] = [];
  checkoutInitiationLocations: any;
  selection = new SelectionModel<any>(true, []);
  AssetNoFilter = new FormControl();
  displayTable: boolean = false;
  displaybtn: boolean = false;
  ReportForm: FormGroup;
  private readonly setting = {
    element: { dynamicDownload: <unknown>null as HTMLElement }
  };

  constructor(public rs: ReconciliationService,
    public cls: CompanyLocationService,
    public ums: UserMappingService,
    public cbs: CompanyBlockService,
    public gs: GroupService,
    public dialog: MatDialog,
    private storage: ManagerService,
    private router: Router,
    public alertService: MessageAlertService,
    public us: UserService,
    public toastr: ToastrService,
    public loader: AppLoaderService,
    public AllPathService: AllPathService,
    public reportService: ReportService,
    private jwtAuth: JwtAuthService,private fb: FormBuilder
    ){
       debugger;
       this.Headers = this.jwtAuth.getHeaders();
       this.message = this.jwtAuth.getResources();
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

  }
  ListOfTransferId: any[] = [];
  loadTransferIds() {
    this.transferIdMultiCtrl = "";
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

    const assetDetails = {
      CompanyId: this.CompanyId,
      LocationIdList: LocationIdList,
      TransitTypes: 1,
      pageNo: 1,
      pageSize: 50,
      searchText: "",
      IsSearch: false,
      IsForRevert: false,
      UserId: this.UserId,
      TransferType: 1,
      IsExport: false,
      BlockIdList: [],
      RegionId: 0,
      SbuList: [],
      typeOfAssetList: [],
      subTypeOfAssetList: []
    };
    console.log('assetDetails', assetDetails);

    this.rs.getTransferId(assetDetails).subscribe(response => {
      debugger;
      this.result = JSON.parse(response);
      this.ListOfTransferId = [];
      this.result = this.UniqueArraybyId(this.result, "TransferId");
      this.result.forEach(val => {
        this.ListOfTransferId.push(val.TransferId);
      })
      this.getFilterTransferId();
    });
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
    if (!this.ListOfTransferId) {
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

  export() {
    this.dyanmicDownloadByHtmlTag(
      { fileName: 'file', text: 'Add dynamic input' });
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

  getFilterCityType() {
    this.filteredCityMulti.next(this.ListOfSBU.slice());
    this.cityMultiFilterCtrl.valueChanges
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
  sbutosbunotallowed: any;
  ListOfField: any[] = [];
  ListOfFilter: any[] = [];
  ListOfFilterName: any[] = [];
  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  ListOfCategory1: any[] = [];
  ListOfField1: any[] = [];
  searchColumns: any[] = [];
  GetInitiatedData() {

    this.loader.open();
    let url1 = this.cls.GetLocationListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 44);
    let url2 = this.cbs.GetCategoryListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 44);
    let url3 = this.gs.GetFieldListByPageId(44,this.UserId, this.CompanyId);
    let url4 = this.gs.GetFilterIDlistByPageId(44);
    let url5 = this.gs.CheckWetherConfigurationExist(this.GroupId, 44);
    let url6 = this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.RegionId, "44");
    let url7 = this.us.CheckFreezePeriodStatus(this.GroupId, this.RegionId, this.CompanyId);
   //  let url6 = this.groupservice.GetFieldList(66,this.SessionUserId);
    forkJoin([url1, url2, url3, url4, url5, url6 , url7]).subscribe(results => {
      if (!!results[0]) {
        this.ListOfLoc = JSON.parse(results[0]);
        this.ListOfLoc1 = this.ListOfLoc;
        this.ListOfSBU = this.UniqueArraybyId(this.ListOfLoc1, this.Layertext);
        this.getFilterCityType();
        this.getFilterPlantType();
        this.loadTransferIds();
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
      this.sbutosbunotallowed = results[4];
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
                 // if (!!results[1]) {

      //   this.ListOfField1 = JSON.parse(results[1]);
      //   this.searchColumns = this.ListOfField1.filter(x => x.SearchOptionEnabled == true).map(choice => choice);
      // }
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

  onEmpty() {
    this.ListOfLoc1 = this.ListOfLoc
    this.getFilterPlantType();
  }
  // onchangeSBU(value) {
  //   this.plantMultiCtrl = "";
  //   this.transferIdMultiCtrl = "";
  //   this.ListOfLoc1 = this.ListOfLoc.filter(x => x[this.Layertext].indexOf(value) > -1);
  //   this.getFilterPlantType();
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

  //====== Bind Data To DataSource========  
  handlePage(pageEvent: PageEvent) {

    this.paginationParams.pageSize = pageEvent.pageSize;
    this.paginationParams.currentPageIndex = pageEvent.pageIndex;
    this.paginationParams.endIndex = (this.paginationParams.currentPageIndex + 1) * pageEvent.pageSize;
    this.paginationParams.startIndex = this.paginationParams.currentPageIndex * pageEvent.pageSize;
    if (!!this.variable && !!this.variable) {
      this.GetAssetForReceiveAssetBindData("SearchText")
    }
    if(this.multipleserach= true && this.multiSearch.length > 0)
    {
      this.GetAssetForReceiveAssetBindData("multiplesearch");
    }
    else {
      this.GetAssetForReceiveAssetBindData("")
    }

  }

  GetAssetForReceiveAsset() {
    this.selection.clear();
    this.getclear();
    this.Onchange();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;
    this.GetAssetForReceiveAssetBindData("OnPageload");
  }

  // clickToExport() {
  //   if(this.displayTable == true){
  //     this.GetAssetForReceiveAssetBindData("IsExport");
  //   }else{
  //     this.toastr.warning(`No data selected to export`, this.message.AssetrakSays);
  //     return null;
  //   }
  // }
  ExportedFields: any[] = [];
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
  clickToExport() {
    if(this.displayTable == true && this.dataSource.data.length != 0){
      this.GetAssetForReceiveAssetBindData("IsExport");
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
  Searchlist :any[];
  GetAssetForReceiveAssetBindData(Action) {
    debugger;
    if(!this.transferIdMultiCtrl){
      this.toastr.warning(`Please Select  ${this.Headers.TransferId}`, this.message.AssetrakSays);
      return null;
    }
    this.loader.open();
    var locationId = 0;
    var blockId = 0;
    var locations = "";
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
    const assetsDetails = {
      CompanyId: this.CompanyId,
      LocationIdList: LocationIdList,
      TransitTypes: 1,
      pageNo: this.paginationParams.currentPageIndex + 1,
      pageSize: this.paginationParams.pageSize,
      SearchText: this.serachtext,
      IsSearch: this.IsSearch,
      IsForRevert: false,
      UserId: this.UserId,
      TransferType: !!this.transfertypeMultiCtrl ? this.transfertypeMultiCtrl.Id : 1,
      TransferId: !!this.transferIdMultiCtrl ? this.transferIdMultiCtrl : 0,
      IsExport: this.isExport,
      BlockIdList: CategoryIdList,
      RegionId: this.RegionId,
      GroupId: this.GroupId,
      AssetsClassList: [],
      SbuList: [],
      typeOfAssetList: [],
      subTypeOfAssetList: [],
      columnName: this.colunname,
      issorting: this.issort,
      PageId : 44,
      ismultiplesearch: this.multipleserach,
      Searchlist : this.Searchlist,
      ExportedFields: this.ExportedFields
    };
    debugger;
    this.rs.getAssetsUsingTransferId(assetsDetails).subscribe(response => {
      this.loader.close();
      debugger;
      if (Action === 'IsExport') {
        this.AllPathService.DownloadExportFile(response);
      }
      else {
        this.bindData = JSON.parse(response);
        this.paginationParams.totalCount = 0;
        if (!!this.bindData && this.bindData.length > 0) {
          // this.paginationParams.totalCount = this.bindData[0].AssetListCount; 
          this.paginationParams.totalCount = this.bindData[0].TotalAssets; 
          this.displaybtn = true;
          this.displayTable = true;
        }
        else{
          this.displayTable = true;
          //this.toastr.warning(this.message.NoDataAvailable, this.message.AssetrakSays);
        }
        this.onChangeDataSource(this.bindData);
        this.SetPageSession();
      }
    });
  }

  onChangeDataSource(value) {
    this.dataSource
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
  
  SetPageSession() {
    debugger;
    var LocationIdList = [];
    var CategoryIdList = [];
    var BlockIdList = [];
    var TAIdList = [];
    var subTypeOfAssetList = [];

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
      'Pagename': "Receive Asset",
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
      if (this.StorePageSession.Pagename === "Receive Asset") {
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
        this.GetAssetForReceiveAsset();
      }
      else {
        localStorage.setItem('PageSession', null);
        this.StorePageSession = "";
      }
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
        this.displayedColumns = ['Select', 'Icon'].concat(this.displayedColumns);
      }
    })
  }

  openInwardDialogOld() {

    if (this.selection.selected.length == 0) {
      this.toastr.warning(this.message.SelectAsset, this.message.AssetrakSays);
      return null;
    }

    var prefarIds = [];
    var locationId = 0;
    const numSelected = this.selection.selected.length;
    for (var i = 0; i < numSelected; i++) {
      prefarIds.push(this.selection.selected[i].PreFarId);
      locationId = this.selection.selected[i].OutwardLocationId;
    }
    let title = '';
    let configdata = {
      CompanyId: this.CompanyId,
      GroupId: this.GroupId,
      LocationId: locationId,
      UserId: this.UserId,
      AssetList: prefarIds.join(','),
      TransferType: !!this.transfertypeMultiCtrl ? this.transfertypeMultiCtrl : 1,
    }

    const dialogRef = this.dialog.open(ReceiveAssetDialogComponent, {
      width: '980px',
      data: { title: title, payload: this.selection.selected, configdata: configdata }
    });
    dialogRef.afterClosed().subscribe(result => {

      if (!!result) {
        this.loader.open()
        this.rs.UpdateAssetDetailsOnInward(result).subscribe(response => {

          this.loader.close()
          if (response == "success") {
            this.MarkAssetsAsInwardOrRevert();
          }
        });
      }
    });
  }

  openInwardDialog() {
    if (this.selection.selected.length == 0) {
      this.toastr.warning(this.message.SelectAsset, this.message.AssetrakSays);
      return null;
    }

    var prefarIds = [];
    var locationId = 0;
    const numSelected = this.selection.selected.length;
    for (var i = 0; i < numSelected; i++) {
      prefarIds.push(this.selection.selected[i].PreFarId);
      locationId = this.selection.selected[i].OutwardLocationId;
    }

    var assetsDetails = {
      AssetList: prefarIds.join(','),
      Building: '',
      Room: '',
      RackName: '',
      UserEmail: '',
      CustodianEmail: '',
      Custodian: '',
      UserName: '',
      UserId: this.UserId,
      TransferType: !!this.transfertypeMultiCtrl ? this.transfertypeMultiCtrl.Id : 1,
      LocationId: locationId
    }

    this.loader.open()
    this.rs.UpdateAssetDetailsOnInward(assetsDetails).subscribe(response => {

      this.loader.close()
      if (response == "success") {
        this.MarkAssetsAsInwardOrRevert();
      }
    });
  }

  MarkAssetsAsInwardOrRevert() {

    this.loader.open()
    var prefarIds = [];
    var locationId = 0;
    const numSelected = this.selection.selected.length;
    for (var i = 0; i < numSelected; i++) {
      prefarIds.push(this.selection.selected[i].PreFarId);
      locationId = this.selection.selected[i].OutwardLocationId;
    }
    var assetsDetails =
    {
      CompanyId: Number(this.CompanyId),
      LocationId: Number(locationId),
      TransitTypes: "1",
      AssetList: prefarIds.join(','),
      IsForRevert: false,
      LastModifiedBy: this.UserId,
      TransferType: !!this.transfertypeMultiCtrl ? this.transfertypeMultiCtrl.Id : 1,
    }
    this.rs.MarkAssetsAsInwardOrRevert(assetsDetails).subscribe(r1 => {

      this.loader.close()
      var str2 = "";
      var result = r1.split("_");
      var str1 = result[0];
      str2 = result[1];
      if (str1 == "success") {
        this.toastr.success(this.message.AssetInwardSucess, this.message.AssetrakSays);
        this.clearSelected();
      }
      else {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
    });
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
  PageId =44;
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
          // this.paginationParams.totalCount = this.bindData[0].AssetListCount; 
          this.paginationParams.totalCount = this.bindData[0].TotalAssets; 
         
        }
       
        this.onChangeDataSource(this.bindData);
      
  }
  clearSelected() {
    this.selection.clear();
    this.getclear();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.GetAssetForReceiveAssetBindData("")
  }
  numSelected: any = 0;
  getselectedIds: any[] = [];
  isAllSelected: boolean = false;
  masterToggle() {
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
  getFilterTransferType() {
    this.filteredTransferTypeMulti.next(this.transfertype.slice());
    this.transfertypeFilterCtrl.valueChanges
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

    this.filteredTransferTypeMulti
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
  openEditGridDisplay() {
  }

  openFilter_PopUp() {
  }

  clearfilter() {
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
      this.GetAssetForReceiveAssetBindData("SearchText");
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
    this.GetAssetForReceiveAssetBindData("");

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
          this.GetAssetForReceiveAssetBindData("")
        } else {
          this.variable1 = $event.active;
          this.GetAssetForReceiveAssetBindData("Sort")
        }
      }
    }
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
    this.GetAssetForReceiveAssetBindData("");
 }

 onMultiSearchClick(){
 
  if(this.searchCount == 0){
    this.toastr.warning(`Please Select all Fields`, this.message.AssetrakSays);
    return null;
   }
   else{
    this.multipleserach= true ;
    this.GetAssetForReceiveAssetBindData("multiplesearch");
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

@Component({
  selector: 'inward-dialog',
  templateUrl: 'inward-dialog.html',
  styleUrls: ['./receive-asset.component.scss']
})
export class InwardDialog implements OnInit {
  groupId = 2;
  companyId = 2;
  locationId = 2;
  costCenter = [];
  subLocations = [];
  subLocation = '';
  costId = '';
  room = '';
  userMail = '';
  custodian = '';
 
  constructor(
    public rs: ReconciliationService,
    public dialogRef: MatDialogRef<InwardDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { this.loadCostCenter(); this.loadSubLocations(); }

  onNoClick(): void {
    this.dialogRef.close();
  }

  loadCostCenter() {
    this.rs.getCostCenter(this.groupId, this.companyId).subscribe(response => {
      this.costCenter = JSON.parse(response);
    });
  }

  loadSubLocations() {
    this.rs.getRevertLocation(this.locationId).subscribe(response => {
      console.log('location', response);
      this.subLocations = JSON.parse(response);
    })
  }

  submit() {
    const assetsDetails = {
      AssetList: [],
      Building: '',
      Room: this.room,
      RackName: '',
      UserEmail: this.userMail,
      CustodianEmail: this.custodian,
      Custodian: '',
      UserName: '',
      UserId: 5,
      TransferType: 1,
      LocationId: this.locationId,
    };
    this.rs.updateReceiveAsset(assetsDetails).subscribe(response => {
      console.log(response);
    });

  } 
}