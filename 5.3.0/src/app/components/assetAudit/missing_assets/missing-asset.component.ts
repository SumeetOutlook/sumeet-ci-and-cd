import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Inject,Output,EventEmitter } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AllPathService } from 'app/components/services/AllPathServices';
import { MatSelect } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import * as headers from '../../../../assets/Headers.json';
import { LocalStoreService } from 'app/shared/services/local-store.service';
import { DatePipe } from '@angular/common';
import { GroupService } from 'app/components/services/GroupService';
import { CompanyService } from 'app/components/services/CompanyService';
import { RegionService } from 'app/components/services/RegionService';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReconciliationService } from 'app/components/services/ReconciliationService';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { UserService } from '../../services/UserService';
import { ToastrService } from 'ngx-toastr';
import { CompanyLocationService } from '../../services/CompanyLocationService';
import { CompanyBlockService } from '../../services/CompanyBlockService';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import * as resource from '../../../../assets/Resource.json';
import * as header from '../../../../assets/Headers.json';
import { AuditService } from '../../services/AuditService';
import { ReportService } from '../../services/ReportService';
import { assetTabsComponent } from '../../partialView/assetDetails/asset_tabs.component';
import { GetFieldsComponent } from 'app/components/partialView/get-fields/get-fields.component';
import { SendMailCategoryownerDialogComponent } from '../missing_assets/send-mail-categoryowner-dialog/send-mail-categoryowner-dialog.component';
import { Sort } from '@angular/material/sort';
import { GroupDetailsComponent } from 'app/components/partialView/group-details/group-details.component';
import { ExportFieldsComponent } from 'app/components/partialView/export-fields/export-fields.component'; 
import { UploadService } from 'app/components/services/UploadService';
import { MultiSearchDialogComponent } from 'app/components/partialView/multi-search-dialog/multi-search-dialog.component'; 

interface SBU {
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
  selector: 'app-missing-asset',
  templateUrl: './missing-asset.component.html',
  styleUrls: ['./missing-asset.component.scss']
})
export class MissingAssetComponent implements OnInit {


  header: any = (resource as any).default ;
  message: any = (resource as any).default;
  Headers: any ;
  numRows: number;
  AssetNoFilter = new FormControl();
  show: boolean = false;
   displayTable: boolean = false;
  showperiod: boolean = false;
  showretire: boolean = false;
  setflag: boolean =false;
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
  submitted: boolean = false;
  public arrlength = 0;
  public fil = 0;
  public appliedfilters: any[] = [];
  dropdowndisabeled: boolean = true;
  panelOpenState = true;
  public selectedbyctrl: FormControl = new FormControl();
  

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  protected _onDestroy = new Subject<void>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  DisplayHeaders:any []
  displayedColumns: any[] = [];

  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  isExport: Boolean = false;
  ReportForm: FormGroup;
  get f1() { return this.ReportForm.controls; };

  GroupId: any;
  RegionId: any;
  CompanyId: any;
  UserId: any;
  regionData: any[] = [];
  companyData: any[] = [];
  locations: any[] = [];
  AssetClassData: any[] = [];
  categories: any[] = [];
  typeData: any[] = [];
  subTypeData: any[] = [];
  transferIdData: any[] = [];
  CloseHide: boolean = true;
  selectedSBUList: any[] = [];
  selectedPlantIdList: any[] = [];
  selectedCompanyList: any[] = [];
  RetireData: any[] = [];
  paginationParams: any;
  resultData: any;
  SBUList: any;
  PlantList: any;
  categorylist: any;
  IslayerDisplay: any;
  layerid: any;
  Layertext: any;
  HeaderLayerText: any;
  bindData: any[] = [];
  variable3: any[] = [];
  serachtext: any;
  colunname: any;
  IsSearch: boolean = false;
  issort: boolean = false;
  @Output() insuranceEndDate: EventEmitter<any> = new EventEmitter<any>();
  displaybtn: boolean = false;

  public project: any[] = [];

  statusList: any[] = [];
  fileextlist:any[];
 

  public projectctrl: any;
  public Project: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public projectMultiCtrl: any;
  public projectFilterCtrl: FormControl = new FormControl();
  public filteredprojectMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public projectidMultiCtrl: any;
  public projectidFilterCtrl: FormControl = new FormControl();
  public filteredprojectidMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public SBUMultiFilterCtrl: FormControl = new FormControl();
  public SBUMultiCtrl: any;
  public filteredSBUMulti: ReplaySubject<SBU[]> = new ReplaySubject<SBU[]>(1);
  public filtered: ReplaySubject<SBU[]> = new ReplaySubject<SBU[]>(1);
  public filteredSBU: ReplaySubject<SBU[]> = new ReplaySubject<SBU[]>(1);

  public plants: any;
  public plantMultiCtrl: any;
  public plantMultiFilterCtrl: FormControl = new FormControl();
  public filteredPlantsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public assetclassMultiCtrl: any;
  public assetclassFilterCtrl: FormControl = new FormControl();
  public filteredAssetClassMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public categoryMultiCtrl: any;
  public categoryFilterCtrl: FormControl = new FormControl();
  public filteredcategoryMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);


  constructor(public AllPathService: AllPathService, private jwtAuth: JwtAuthService, public dialog: MatDialog, private httpService: HttpClient, public localService: LocalStoreService, public datepipe: DatePipe,
    public groupservice: GroupService,
    public companyservice: CompanyService,
    public regionservice: RegionService,
    private storage: ManagerService,
    public reconciliationService: ReconciliationService,
    public us: UserService, public toastr: ToastrService,
    public cls: CompanyLocationService,
    public cbs: CompanyBlockService,
    public gs: GroupService,
    public alertService: MessageAlertService,
    private loader: AppLoaderService,
    private router: Router,
    public as: AuditService,
    public rp: ReportService,
    public uploadService: UploadService,
    private fb: FormBuilder
  ) {
    this.Headers = this.jwtAuth.getHeaders()
    this.DisplayHeaders = [this.Headers.InventoryNo, this.header.AID, this.Headers.SAID, this.Headers.Category, this.Headers.AssetSubtype, this.Headers.CapitalizationDate, this.Headers.AssetClass, this.Headers.AssetDescription, this.Headers.AssetDescriptionMissing, this.Headers.Qty, this.Headers.UOM, this.Headers.Plant, this.Headers.Cost, this.Headers.WDV, this.header.Action, this.Headers.EqipmentNumber, this.Headers.AssetConditionMissing, this.Headers.AssetCriticality, this.Headers.NotFoundNote, this.Headers.Upload, this.Headers.ViewDocument];
    this.project =[
      { name: this.Headers.PhysicalVerification, id: 'PhysicalVerification' },
      //{ name: this.Headers.SelfCertification, id: 'SelfCertification' },
    ];
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit(): void {

    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);

    this.SBUMultiCtrl = "";
    this.categoryMultiCtrl = "";
    this.ReportForm = this.fb.group({
      selectedbyctrl: ['', [Validators.required]],
      plantMultiFilterCtrl : ['', [Validators.required]],
      projectidFilterCtrl : ['', [Validators.required]],
    });

    this.paginationParams = {
      pageSize: 50,
      currentPageIndex: 0,
      endIndex: 0,
      startIndex: 0,
      totalCount: 0,
    }

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
    var FunctionId = 9;
    this.uploadService.GetAllowedExtensions(FunctionId).subscribe(response => {
      debugger;
      this.fileextlist =response;  
    })
    this.filterProjectMulti();
    this.GetInitiatedData();

  }

  missingNote: any[] = [];
  ListOfField: any[] = [];
  ListOfLoc1: any[] = [];
  ListOfFilter: any[] = [];
  ListOfFilterName: any[] = [];
  NewModifiedList: any[] = [];
  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  ExportedFields: any[] = [];
  ListOfField1: any[] = [];
  searchColumns: any[] = [];
  GetInitiatedData() {

    this.loader.open();
    let url1 = this.gs.GetFieldListByPageId(35,this.UserId,this.CompanyId);
    let url2 = this.gs.GetFilterIDlistByPageId(35);
    let url3 = this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 35);
    let url4 = this.cls.GetLocationListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 35)
    let url5 = this.cbs.GetCategoryListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 35);
    let url6 = this.as.getMissingNoteInList();
     //  let url6 = this.groupservice.GetFieldList(66,this.SessionUserId);
    forkJoin([url1, url2, url3, url4, url5, url6]).subscribe(results => {
      if (!!results[0]) {
        this.ListOfField = JSON.parse(results[0]);
        this.searchColumns = this.ListOfField.filter(x => x.SearchOptionEnabled == true).map(choice => choice);
        this.displayedColumns = this.ListOfField;
        this.displayedColumns = this.displayedColumns.filter(x => x.Custom2 == "1").map(choice => choice.Custom1);
        this.displayedColumns = ['Select', 'Icon'].concat(this.displayedColumns);
        // this.displayedColumns = this.displayedColumns.concat("Status");
        // this.displayedColumns = this.displayedColumns.concat("NotFoundNote");
        // this.displayedColumns = this.displayedColumns.concat("Upload");
        // this.displayedColumns = this.displayedColumns.concat("ViewDocument");

      }
      if (!!results[1]) {
        this.ListOfFilter = JSON.parse(results[1]);
        if (!!this.ListOfFilter) {
          this.ListOfFilter.forEach(x => this.ListOfFilterName.push(x.FilterName))
        }
        console.log(this.ListOfFilter);
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
        this.PlantList = JSON.parse(results[3]);
        this.ListOfLoc1 = JSON.parse(results[3]);
        this.SBUList = this.UniqueArraybyId(this.PlantList, this.Layertext);
        this.getFilterCityType();
        this.getFilterPlantType();

      }
      if (!!results[4]) {
        this.categorylist = JSON.parse(results[4]);
        this.getFilterCategoryType();
        //this.filteredAssetClassMulti.next(this.categorylist.slice());
      }
      if (!!results[5]) {
        this.missingNote = JSON.parse(results[5]);

      }
             // if (!!results[1]) {

      //   this.ListOfField1 = JSON.parse(results[1]);
      //   this.searchColumns = this.ListOfField1.filter(x => x.SearchOptionEnabled == true).map(choice => choice);
      // }
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
      if (this.StorePageSession.Pagename === "Missing Asset") {
        
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

  onchangeSBU(value) {
    this.showmultiSearch = false;
    if (!!value) {
      this.PlantList = this.ListOfLoc1.filter(x => x[this.Layertext].indexOf(value) > -1);
      this.getFilterPlantType();
    }
    else {
      this.PlantList = this.ListOfLoc1.filter(x => x);
      this.getFilterPlantType();
    }
  }
  loclist: any[] = [];
  loclistIds: any[] = [];
  OnchangeProjectId(val) {
    debugger;
    this.showmultiSearch = false;
    this.SBUMultiCtrl = "";
    this.plantMultiCtrl = "";
    this.loader.open();
    var projectName = val.Name;
    this.cls.GetInventoryLocationIdsByProjectNamePageName(this.CompanyId, 'missing', projectName).subscribe(r => {
      debugger;
      this.loader.close();
      if (!!r) {
        this.loclist = r;
        this.loclistIds = [];
        for (var i = 0; i < this.loclist.length; i++) {
          this.loclistIds.push(this.loclist[i].LocationId);
        }
        this.PlantList = [];
        for (var j = 0; j < this.ListOfLoc1.length; j++) {
          var idx = this.loclistIds.indexOf(this.ListOfLoc1[j].LocationId);
          if (idx > -1) {
            this.PlantList.push(this.ListOfLoc1[j]);
          }
        }
        // this.ListOfLoc1 = this.ListOfLoc;
        this.SBUList = this.UniqueArraybyId(this.PlantList, this.Layertext);
        this.getFilterCityType();
        this.getFilterPlantType();
      }
    })
  }
  IsPhysicalVerification: boolean = false;
  IsSelfCertification: boolean = false;
  selectedProject: any;
  selected(name) {

    if (name == "PhysicalVerification") {
      this.selectedProject = name;
      this.IsPhysicalVerification = true;
      this.GetInventoryProjectList();
    }

    if (name == "SelfCertification") {
      this.selectedProject = name;
      this.IsSelfCertification = true;
      //this.GetProjectName();
    }
  }
  ListProject: any[] = [];
  GetInventoryProjectList() {
  debugger;
    this.loader.open();
    this.ListProject=[];
    this.projectidMultiCtrl="";
    this.plantMultiCtrl="";
    this.filteredprojectidMulti = new ReplaySubject<any[]>(1);
    var LocationIdList = [];
    var SbuList = [];
    var CategoryIdList = [];
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

    if (!!this.categoryMultiCtrl) {
      this.categoryMultiCtrl.forEach(x => {
        CategoryIdList.push(x.AssetCategoryId);
      })
    }
    else {
      this.categorylist.forEach(x => {
        CategoryIdList.push(x.AssetCategoryId);
      })
    }
    var pageName = "SelfCertification";
    if (!!this.IsPhysicalVerification) {
      pageName = "missing";
    }

    var assetDetails = {
      companyId: this.CompanyId,
      locationIdList: LocationIdList,
      pageName: pageName,
      CategoryIdList: CategoryIdList
    }
    this.as.GetInventoryProjectListForReconcilition(assetDetails).subscribe(r => {

      this.loader.close();
      this.ListProject = r;// JSON.parse(r);
      this.filterProjectIdMulti();
    })
  }

  protected filterProjectIdMulti() {
    if (!this.ListProject) {
      return;
    }
    let search = this.projectidFilterCtrl.value;
    if (!search) {
      this.filteredprojectidMulti.next(this.ListProject.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredprojectidMulti.next(
      this.ListProject.filter(projectid => projectid.name.toLowerCase().indexOf(search) > -1)
    );
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  toggleSelectAllSBU(selectAllValue: boolean) {
    this.filteredSBUMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.SBUMultiCtrl.patchValue(val);
        } else {
          this.SBUMultiCtrl.patchValue([]);
        }
      });
  }

  toggleSelectPlantAll(selectAllValue: boolean) {
    this.filteredPlantsMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.plantMultiCtrl.patchValue(val);
        } else {
          this.plantMultiCtrl.patchValue([]);
        }
      });
  }

  toggleSelectclassAll(selectAllValue: boolean) {
    this.filteredAssetClassMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.assetclassMultiCtrl.patchValue(val);
        } else {
          this.assetclassMultiCtrl.patchValue([]);
        }
      });
  }
  fileList: any[] = [];
  fileChange(event) {

    this.fileList = event.target.files;
    this.FileUploadValidation(this.fileList[0].name,this.fileList[0].size);
    if(this.uploadfile ==false){
      event.target.value = null;
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
    debugger;
    if (!this.SBUList) {
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
      this.SBUList.filter(x => x.City.toLowerCase().indexOf(search) > -1)
    );
  }

  // getFilterSBUUS() {
  //   this.ReportForm.controls['sbuMultiFilterCtrl'].valueChanges
  //     .pipe(takeUntil(this._onDestroy))
  //     .subscribe(() => {
  //       this.filterSBUMulti();
  //     });
  // }
  // protected filterSBUMulti() {
  //   if (!this.SBUList) {
  //     return;
  //   }
  //   let search = this.ReportForm.controls['sbuMultiFilterCtrl'].value;
  //   if (!search) {
  //     this.filteredSBUMulti.next(this.SBUList.slice());
  //     return;
  //   } else {
  //     search = search.toLowerCase();
  //   }
  //   this.filteredSBUMulti.next(
  //     this.SBUList.filter(x => x.SBU.toLowerCase().indexOf(search) > -1)
  //   );
  // }


  protected filterProjectMulti() {
    if (!this.project) {
      return;
    }
    let search = this.projectFilterCtrl.value;
    if (!search) {
      this.filteredprojectMulti.next(this.project.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredprojectMulti.next(
      this.project.filter(project => project.name.toLowerCase().indexOf(search) > -1)
    );
  }

  SelectedProject: any;
  onChangeProject(event) {
    this.CloseHide = false;
    this.SelectedProject = event;
    if (event == "PhysicalVerification") {
      this.dropdowndisabeled = false;
    }
    else {
      this.dropdowndisabeled = true;
    }
  }

  SelectedPlant: any[] = [];
  onChangePlant(event) {
    this.SelectedPlant = event;
  }
  SelectedProjectName: any[] = [];
  onChangeprojectid(event) {
    this.showmultiSearch = false;
    this.SelectedProjectName = event.join(',');
  }

  SelectedAssetClass: any[] = [];
  onChangeassetclass(event) {
    this.SelectedAssetClass = event;
  }
  //====== Bind Data To DataSource========  
  handlePage(pageEvent: PageEvent) {

    this.paginationParams.pageSize = pageEvent.pageSize;
    this.paginationParams.currentPageIndex = pageEvent.pageIndex;
    this.paginationParams.endIndex = (this.paginationParams.currentPageIndex + 1) * pageEvent.pageSize;
    this.paginationParams.startIndex = this.paginationParams.currentPageIndex * pageEvent.pageSize;
    if (!!this.variable && !!this.variable) {
      this.GetMissingAssetsBindData("SearchText")
    }
    if(this.multipleserach= true && this.multiSearch.length > 0)
    {
      this.GetMissingAssetsBindData("multiplesearch");
    }
    else {
      this.GetMissingAssetsBindData("")
    }

  }

  buttonEnable: boolean = false;
  GetMissingAssets() {

    this.buttonEnable = true;
    this.selection.clear();
    this.getclear();
    this.Onchange();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;
    this.GetMissingAssetsBindData("OnPageload");
  }
  
  clickToExport() {
    if(this.displayTable == true && this.dataSource.data.length != 0){
      this.GetMissingAssetsBindData("IsExport");
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
  GetMissingAssetsBindData(Action) {
    if(!(this.plantMultiCtrl&& this.projectidMultiCtrl)){
      this.toastr.warning(`Please Select ${this.Headers.Location} /${this.Headers.ProjectName}`, this.message.AssetrakSays);
      return null;
    }
    this.loader.open();
    var LocationIdList = [];
    var SbuList = [];
    var locationId = 0;
    var CategoryIdList = [];
    if (!!this.plantMultiCtrl) {
      locationId = !!this.plantMultiCtrl ? this.plantMultiCtrl.LocationId : 0;
      LocationIdList.push(locationId);
    }
    else {
      this.PlantList.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }

    if (!!this.categoryMultiCtrl) {
      this.categoryMultiCtrl.forEach(x => {
        CategoryIdList.push(x.AssetCategoryId);
      })
    }
    else {
      this.categorylist.forEach(x => {
        CategoryIdList.push(x.AssetCategoryId);
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
    var assetsDetails = {
      CompanyId: this.CompanyId,
      SbuList: SbuList,
      LocationId: !!this.plantMultiCtrl ? this.plantMultiCtrl.LocationId : 0,
      LocationIdList: LocationIdList,
      BlockName: "",
      CategoryName: "",
      ProjectType: "Inventory",
      AssetStage: "VerificationStatus",
      AssetStatus: "Missing",
      ProjectId: 0,
      SearchText: this.serachtext,
      pageNo: this.paginationParams.currentPageIndex + 1,
      pageSize: this.paginationParams.pageSize,
      IsExport: this.isExport,
      PageName: 'Missing',
      projectName: !!this.projectidMultiCtrl ? this.projectidMultiCtrl.Name : "",
      CategoryIdList: CategoryIdList,
      AssetsClassList: [],
      typeOfAssetList: [],
      subTypeOfAssetList: [],
      columnName: this.colunname,
      IsSearch: this.IsSearch,
      issorting: this.issort,
      PageId : 35,
      ExportedFields : this.ExportedFields,
      ismultiplesearch: this.multipleserach,
      Searchlist : this.Searchlist,
    };

    this.reconciliationService.GetReconciliationAssetList(assetsDetails).subscribe(response => {
      this.loader.close();
      if (Action === 'IsExport') {
        if (response == null) {
          this.GetMissingAssetsBindData("OnPageload");
        }
        else {
          this.AllPathService.DownloadExportFile(response);
        }
      }
      else {
        this.bindData = [];
        this.bindData = JSON.parse(response);
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
      }
      
      this.onChangeDataSourceC(this.bindData);
    });
  }

  onChangeDataSourceC(value) {

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
      var locationId = !!this.plantMultiCtrl ? this.plantMultiCtrl.LocationId : 0;
      PlantList.push(locationId);
    }
    else {
      this.ListOfLoc1.forEach(x => {
        PlantList.push(x.LocationId);
      })
    }
   
    debugger
    this.rp.GetCategoryRightWiseForReport(this.CompanyId, this.UserId, PlantList, false,24).subscribe(r => {
      this.categorylist=[];
      r.forEach(element => {
        // this.ListOfCategory=[];
        this.categorylist.push(element);
        this.getFilterCategoryType();
      });
    })
  }

  BackToInventory() {
debugger;
    if (!!this.IsPhysicalVerification) {
      if (this.getselectedIds.length > 0) {
        this.loader.open();
        var CategoryIdList = [];
        if (!!this.categoryMultiCtrl) {
          this.categoryMultiCtrl.forEach(x => {
            CategoryIdList.push(x.AssetCategoryId);
          })
        }
        else {
          this.categorylist.forEach(x => {
            CategoryIdList.push(x.AssetCategoryId);
          })
        }
        var assetDeails = {
          // CompanyId: this.CompanyId,
          // projectId: 0,
          // projectType: "Inventory",
          // assetIdLists: this.getselectedIds.join(','),
          // status: "Pending",
          // modifiedBy: this.UserId,
          // LocationId: !!this.plantMultiCtrl ? this.plantMultiCtrl.LocationId : 0,
          // Projectname: !!this.projectidMultiCtrl ? this.projectidMultiCtrl.Name : "",
          CompanyId: this.CompanyId,
          ProjectId: 0,
          ProjectType: "Inventory",
          AssetId: this.getselectedIds.join(','),
          Status: "Pending",
          LastModifiedBy: this.UserId,
          LocationId: !!this.plantMultiCtrl ? this.plantMultiCtrl.LocationId : 0,
          projectName: !!this.projectidMultiCtrl ? this.projectidMultiCtrl.Name : "",
        }
        this.as.SetStatusToAssetList(assetDeails).subscribe(r => {
debugger;
          this.loader.close();
          if (!!r) {
            this.toastr.success(this.message.AssetRevertSucess, this.message.AssetrakSays);
          }
          else {
            this.toastr.warning(r, this.message.AssetrakSays);
          }
          this.clearSelected();
        })
      }
      else {
        this.toastr.warning(this.message.SelectAsset, this.message.AssetrakSays);
      }
    }
  }

  SendMailToUser() {

    if (this.getselectedIds.length > 0) {
      this.loader.open();
      var CategoryIdList = [];
      if (!!this.categoryMultiCtrl) {
        this.categoryMultiCtrl.forEach(x => {
          CategoryIdList.push(x.AssetCategoryId);
        })
      }
      else {
        this.categorylist.forEach(x => {
          CategoryIdList.push(x.AssetCategoryId);
        })
      }
      var assetDeails = {
        CompanyId: this.CompanyId,
        parameterList: this.getselectedIds,
        categorylist: CategoryIdList
      }
      this.reconciliationService.SendMailToUserforMissingAssets(assetDeails).subscribe(r => {

        this.loader.close();
        if (r === "1") {
          this.toastr.success(this.message.MailSendSucess, this.message.AssetrakSays);
        }
        else if (r === "2") {
          this.toastr.warning(this.message.AllocationNotConfirmByUser, this.message.AssetrakSays);
        }
        else {
          this.toastr.warning(r, this.message.AssetrakSays);
        }

        this.clearSelected();
      })
    }
    else {
      this.toastr.warning(this.message.SelectAsset, this.message.AssetrakSays);
    }

  }

  SetMissingStatus(b) {

    if (!!this.IsPhysicalVerification) {
      if (b.TpMissingStatus === "Other") {
        return false;
      }
      var assetDeails = {
        CId: this.CompanyId,
        PreFarId: b.PreFarId,
        ProjectType: "Inventory",
        ProjectId: !!this.projectidMultiCtrl ? this.projectidMultiCtrl.ProjectId : "",
        missingStatus: b.TpMissingStatus,
        UId: this.UserId,
        LId: !!this.plantMultiCtrl ? this.plantMultiCtrl.LocationId : 0
      }
      this.as.setMissingStatus(assetDeails).subscribe(r => {

      })
    }
  }
  SetMissingStatus1(b) {

    if (!!this.IsPhysicalVerification) {
      if (b.TpMissingStatus === "Other") {
        b.TpMissingStatus = b.TpMissingStatus1;
      }
      var assetDeails = {
        CId: this.CompanyId,
        PreFarId: b.PreFarId,
        ProjectType: "Inventory",
        ProjectId: !!this.projectidMultiCtrl ? this.projectidMultiCtrl.ProjectId : "",
        missingStatus: b.TpMissingStatus,
        UId: this.UserId,
        LId: !!this.plantMultiCtrl ? this.plantMultiCtrl.LocationId : 0
      }
      this.as.setMissingStatus(assetDeails).subscribe(r => {

      })
    }
  }

  upload(d) {
    debugger;
    
    if (this.fileList.length > 0 && this.uploadfile == true) {
      var assetDeails = {
        fileName: "",
        companyId: this.CompanyId,
        fileType: "Missing",
        fileList: this.fileList
      }
      this.as.PostFiles(assetDeails).subscribe(result => {
        debugger;
        if (!!result) {
          if (result != "Your files is too large, maximum allowed size is 2 MB") {
            var fileName = result;
            this.uploadMissingFile(fileName, d.PreFarId);
          }
          else {
            this.toastr.warning(this.message.FileisTooLarge, this.message.AssetrakSays);
          }
        }
      })
    }
    else {
      this.alertService.alert({ title: this.message.AssetrakSays, message: this.message.File })
    }
  }

  uploadMissingFile(fileName, preFarId) {

    if (!!this.IsPhysicalVerification) {
      this.loader.open();
      var path = fileName.split('Missing\\');
      var assetDeails = {
        CId: this.CompanyId,
        PreFarId: preFarId,
        ProjectType: "Inventory",
        ProjectId: !!this.projectidMultiCtrl ? this.projectidMultiCtrl.ProjectId : "",
        // filePath: fileName,
        filePath: path[1],
        documentType: 1,
        projectName: !!this.projectidMultiCtrl ? this.projectidMultiCtrl.Name : "",
        LId: !!this.plantMultiCtrl ? this.plantMultiCtrl.LocationId : 0
      }
      this.as.setUploadMissingFile(assetDeails).subscribe(r => {

        this.loader.close();
        this.clearSelected();
      })
    }
  }

  viewDocument(d) {

    var filePath = this.CompanyId + "\\Missing\\" + d.FileName;
    this.AllPathService.ViewDocument(filePath);
  }

  GetMissingDataBlockwise() {

    let configdata = {
      CompanyId: this.CompanyId,
      GroupId: this.GroupId,
      LocationId: !!this.plantMultiCtrl ? this.plantMultiCtrl.LocationId : 0,
      TPID: !!this.projectidMultiCtrl ? this.projectidMultiCtrl.ProjectId : "",
      projectName: !!this.projectidMultiCtrl ? this.projectidMultiCtrl.Name : "",
      UserId: this.UserId,
      assetStatus: "Missing",
      assetStage: "VerificationStatus"
    }

    var assetDetails = {
      companyId : this.CompanyId,
      locationId :!!this.plantMultiCtrl ? this.plantMultiCtrl.LocationId : 0,
      assetStage:"VerificationStatus",
      assetStatus:"Missing",
      TPID:!!this.projectidMultiCtrl ? this.projectidMultiCtrl.ProjectId : 0,
      projectName: !!this.projectidMultiCtrl ? this.projectidMultiCtrl.Name : "",
    }

    this.as.CheckForSendMailToOWNER(assetDetails).subscribe(r => {
      debugger;
      if(!!r)
      {
        if(r =="1")
        {
          const dialogRef = this.dialog.open(SendMailCategoryownerDialogComponent, {
            width: '750px',

            data: { configdata: configdata }
          });
          dialogRef.afterClosed().subscribe(result => {
      
            if (!!result) {
              this.SendMailToBlockOwner(result.selectedIds, result.CCmail, result.message);
            }
          })
        }
        if(r =="0")
        {
          this.toastr.warning(this.message.ProjectAlreadyClosed, this.message.AssetrakSays);
          if(this.IsPhysicalVerification)
          {
            this.bindData=[];
            this.onChangeDataSourceC("");
            // this.GetInitiatedData();
            this.selected("PhysicalVerification");         
          } 
        }
      }

    })
    // const dialogRef = this.dialog.open(SendMailCategoryownerDialogComponent, {
    //   width: '750px',
    //   disableClose: true,
    //   data: { configdata: configdata }
    // });
    // dialogRef.afterClosed().subscribe(result => {

    //   if (!!result) {
    //     this.SendMailToBlockOwner(result.selectedIds, result.CCmail, result.message);
    //   }
    // })
  }

  SendMailToBlockOwner(selectedIds, CCmail, message) {
    debugger;
    this.loader.open();
    var assetsDetails = {
      CompanyId: this.CompanyId,
      LocationId: !!this.plantMultiCtrl ? this.plantMultiCtrl.LocationId : 0,
      CategoryName: selectedIds,
      ProjectType: "Inventory",
      AssetStage: "VerificationStatus",
      AssetStatus: "Missing",
      ProjectId: !!this.projectidMultiCtrl ? this.projectidMultiCtrl.ProjectId : "",
      projectName: !!this.projectidMultiCtrl ? this.projectidMultiCtrl.Name : "",
      CCmail: CCmail,
      Message: message,
      LastModifiedBy: this.UserId,
      PageName: "missing",
    }
    this.reconciliationService.sendMailForMissingAssets(assetsDetails).subscribe(r => {
      debugger;
      this.loader.close();
      if (r === "success") {
        this.toastr.success(this.message.MailSendSucess, this.message.AssetrakSays);
      }
      else if (r === "1") {
        this.toastr.warning(this.message.ProjectAlreadyClosed, this.message.AssetrakSays);
        if(this.IsPhysicalVerification)
        {
          this.bindData=[];
          this.onChangeDataSourceC("");
          // this.GetInitiatedData();
          this.selected("PhysicalVerification");
         
        }          
      } else if (r === "No data") {
        this.toastr.warning(this.message.FailSendMailToOwner, this.message.AssetrakSays);
      }
      else if (r === "Failed") {
        this.toastr.warning(this.message.UnableToSendEmail, this.message.AssetrakSays);
      }
      else {
        this.toastr.warning(r, this.message.AssetrakSays);
      }

      this.selection.clear();
      this.numSelected = 0;
      this.getselectedIds = [];

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
      this.dataSource.data.forEach(row => this.selection.select(row));
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
  viewSelected() {
    this.getclear();
    this.paginationParams.totalCount = this.selection.selected.length;
    this.paginationParams.endIndex = this.selection.selected.length;
    this.onChangeDataSourceC(this.selection.selected);
  }
   clearSelectedView() {
    this.buttonEnable = false;
    //this.getclear();
    this.selection.clear();
    this.numSelected = 0;
    this.getselectedIds = [];
  this.paginationParams.totalCount = 0;
        if (!!this.bindData && this.bindData.length > 0) {
          this.paginationParams.totalCount = this.bindData[0].AssetListCount;
         
        }
       
      
      
      this.onChangeDataSourceC(this.bindData);
  }
  clearSelected() {
    this.selection.clear();
    this.getclear();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.GetMissingAssetsBindData("");
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

  toggleSelectAllcategory(selectAllValue) {
    this.categoryMultiCtrl =[];
    this.filteredcategoryMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (!!selectAllValue.checked) {
          this.categorylist.forEach(element => {
            this.categoryMultiCtrl.push(element);
          });  
        } else {
          this.categoryMultiCtrl="";
        }
      });
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
  PageId = 35;
  ReportFlag :boolean = false;
  openPopUp(data: any = {}) {
    debugger;
    this.ReportFlag = false;
    this.ListOfField.forEach((element,index)=>{
      if(element.Custom1 == 'Upload' || element.Custom1 == 'ViewDocument' || element.Custom1 == 'NotFoundNote' ) 
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

  editGridpop() {

    let title = 'Edit Grid Display';
    const dialogRef = this.dialog.open(GetFieldsComponent, {
      width: '60vw',
      height: 'auto',
      data: { title: title, payload: this.ListOfField }
    })
    dialogRef.afterClosed().subscribe(result => {

      if (!!result) {
        this.ListOfField = result;
        this.displayedColumns = this.ListOfField;
        this.displayedColumns = this.ListOfField.filter(x => x.Custom2 == "1" ).map(choice => choice.Custom1);
        this.displayedColumns = ['Select', 'Icon'].concat(this.displayedColumns);
        // this.displayedColumns = this.displayedColumns.concat("Status");
        // this.displayedColumns = this.displayedColumns.concat("NotFoundNote");
        // this.displayedColumns = this.displayedColumns.concat("Upload");
        // this.displayedColumns = this.displayedColumns.concat("ViewDocument");
      }
    })
  }


  OnGetlayerid() {
    if (this.layerid == 1) {
      this.SBUList = this.SBUList.filter((item, i, arr) => arr.findIndex((t) => t.Country === item.Country) === i);
      this.filteredSBUMulti.next(this.SBUList);
      // this.filteredPlantsMulti.next(this.PlantList.filter((item) => item.Country = this.SBUName).slice());
      // this.filteredSBUMulti.next(this.SBUList.filter((item) => item.Country.slice()));
    }
    else if (this.layerid == 2) {
      this.SBUList = this.SBUList.filter((item, i, arr) => arr.findIndex((t) => t.State === item.State) === i);
      this.filteredSBUMulti.next(this.SBUList);
      // this.filteredPlantsMulti.next(this.PlantList.filter((item) => item.State = this.SBUName.slice()));
    }
    else if (this.layerid == 3) {
      this.SBUList = this.SBUList.filter((item, i, arr) => arr.findIndex((t) => t.City === item.City) === i);
      this.filteredSBUMulti.next(this.SBUList);
    }
    else if (this.layerid == 4) {
      this.SBUList = this.SBUList.filter((item, i, arr) => arr.findIndex((t) => t.Zone === item.Zone) === i);
      this.filteredSBUMulti.next(this.SBUList);
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
      this.GetMissingAssetsBindData("SearchText");
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
    this.GetMissingAssetsBindData("");
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
          this.GetMissingAssetsBindData("")
        } else {
          this.variable1 = $event.active;
          this.GetMissingAssetsBindData("Sort")
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
  doublext= /\.\w{2,3}\.\w{2,3}$/;
  fileName :any;
  uploadfile: boolean =false;
  FileUploadValidation(filename,filesize) {
    debugger;
   this.fileName = filename;
   var extension = filename.substr(filename.lastIndexOf('.')); //check file type extention
   var doublextension = this.doublext.test(filename);

   for(let j = 0; j < this.fileextlist.length; j++)
   {
    if(extension.toLowerCase() === this.fileextlist[j] &&  filesize < 3000000)
      {    
      this.uploadfile =true;

      }    
  else{
    if (filesize > 3000000)
    { 
    this.uploadfile =false;
    
    this.toastr.error(this.message.filesizerestriction, this.message.AssetrakSays);
    return null;
   }
   if(this.fileextlist.indexOf(extension) == -1)
   {
    this.uploadfile =false;
    this.toastr.error(this.message.fileextensionvalidation2, this.message.AssetrakSays);
    return null;
   }
    if( !(filename.endsWith(extension)) ){
      this.uploadfile =false;
   this.toastr.error(this.message.fileextensionvalidation2, this.message.AssetrakSays);
   return null;
  }

 if( doublextension ==true ){
  this.uploadfile =false;
   this.toastr.error(this.message.fileextensionvalidation2, this.message.AssetrakSays);
  return null;
  } 
   if(filename.startsWith('.') ){
    this.uploadfile =false;
    this.toastr.error(this.message.fileextensionvalidation2, this.message.AssetrakSays);
   return null;
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
   this.GetMissingAssetsBindData("");
}
multipleserach : boolean= false;
onMultiSearchClick(){

  if(this.searchCount == 0){
    this.toastr.warning(`Please Select All Fields`, this.message.AssetrakSays);
    return null;
   }
   else{
   this.multipleserach= true ;
   this.GetMissingAssetsBindData("multiplesearch");
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
