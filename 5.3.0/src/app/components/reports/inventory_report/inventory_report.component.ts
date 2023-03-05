import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { assetTabsComponent } from '../../partialView/assetDetails/asset_tabs.component';
import { MatSelect } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';

import { LocalStoreService } from 'app/shared/services/local-store.service';
import { DatePipe } from '@angular/common';
import { AssetService } from '../../services/AssetService';
import { GroupService } from 'app/components/services/GroupService';
import { CompanyService } from 'app/components/services/CompanyService';
import { RegionService } from 'app/components/services/RegionService';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { SbuService } from 'app/components/services/SbuService';
import { LocationService } from 'app/components/services/LocationService';
import { UserRoleService } from 'app/components/services/UserRoleService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AssetClassService } from '../../services/AssetClassService';
import { AssetCategoryService } from 'app/components/services/AssetCategoryService';
import { AssetTypeService } from 'app/components/services/AssetTypeService';
import { AssetSubTypeService } from 'app/components/services/AssetSubTypeService';
import { ReconciliationService } from 'app/components/services/ReconciliationService';
import { AssetRetireService } from 'app/components/services/AssetRetireService';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { ReportService } from 'app/components/services/ReportService';
import { AllPathService } from 'app/components/services/AllPathServices';
import { GetFieldsComponent } from 'app/components/partialView/get-fields/get-fields.component';
import * as menuheaders from '../../../../assets/MenuHeaders.json';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { ViewUploadDocumentsDialogComponent } from '../../partialView/view-upload-documents-dialog/view-upload-documents-dialog.component'

import { ToastrService } from 'ngx-toastr';
import {ITAssetsService} from '../../../components/services/ITAssetsService';
import { ExportFieldsComponent } from 'app/components/partialView/export-fields/export-fields.component'; 
import { MultiSearchDialogComponent } from 'app/components/partialView/multi-search-dialog/multi-search-dialog.component';
import { CompanyLocationService } from 'app/components/services/CompanyLocationService';

@Component({
  selector: 'app-inventory_report',
  templateUrl: './inventory_report.component.html',
  styleUrls: ['./inventory_report.component.scss']
})

export class InventoryReportComponent implements OnInit, AfterViewInit, OnDestroy {

  header: any = [];
  message: any;
  numRows: number;
  show: boolean = false;
  showperiod: boolean = false;
  showretire: boolean = false;
  isButtonVisible: boolean = false;
  setflag: boolean =false;
  submitted: boolean = false;
  public arrlength = 0;
  public fil = 0;
  public appliedfilters: any[] = [];
  panelOpenState = true;
  menuheader: any = (menuheaders as any).default
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  protected _onDestroy = new Subject<void>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: any[] = [];
  dataSource = new MatTableDataSource<any>();
  ReportForm: FormGroup;
  get f1() { return this.ReportForm.controls; };

  SessionGroupId: any;
  SessionRegionId: any;
  SessionCompanyId: any;
  SessionUserId: any;
  isExport: Boolean = false;
  Count: any;
  IsPageLoad: Boolean = false;

  regionData: any[] = [];
  companyData: any[] = [];
  sbus: any[] = [];
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
  ProjectList: any[] = [];
  Userlocations: any[] = [];
  TypeStatus: any[] = [];
  SelectedByData: any[] = []

  SelectReportBY: any[] = [
    { value: "ByLocation", name: "By Location" },
    { value: "ByProjectId", name: "By Project Id" },
  ]

  statusList: any[] = [];

  public regionMultiCtrl: FormControl = new FormControl();
  public regionMultiFilterCtrl: FormControl = new FormControl();
  public region: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public companyMultiCtrl: FormControl = new FormControl();
  public companyMultiFilterCtrl: FormControl = new FormControl();
  public company: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public sbuMultiCtrl: any;
  public sbuMultiFilterCtrl: FormControl = new FormControl();
  public filteredsbuMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public plantMultiCtrl: any;
  public plantMultiFilterCtrl: FormControl = new FormControl();
  public filteredPlantsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public categoryMultiCtrl: any;
  public categoryMultiFilterCtrl: FormControl = new FormControl();
  public filteredCategorysMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public classMultiCtrl: FormControl = new FormControl();
  public classMultiFilterCtrl: FormControl = new FormControl();
  public class: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public typeMultiCtrl: FormControl = new FormControl();
  public typeMultiFilterCtrl: FormControl = new FormControl();
  public type: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public subtypeMultiCtrl: FormControl = new FormControl();
  public subtypeMultiFilterCtrl: FormControl = new FormControl();
  public subtype: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public statusMultiCtrl: FormControl = new FormControl();
  public statusMultiFilterCtrl: FormControl = new FormControl();
  public filteredStatusMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public transferidMultiCtrl: FormControl = new FormControl();
  public transferidFilterCtrl: FormControl = new FormControl();
  public transferid: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public selectedbyctrl: FormControl = new FormControl();
  public selectedby: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public financialyearctrl: FormControl = new FormControl();
  public financialyear: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public periodMultiCtrl: FormControl = new FormControl();
  public periodMultiFilterCtrl: FormControl = new FormControl();
  public period: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public reportSelectionBy: FormControl = new FormControl();
  public reportSelectionValue: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(private jwtAuth: JwtAuthService, public dialog: MatDialog, private httpService: HttpClient, public localService: LocalStoreService, public datepipe: DatePipe,
    public groupservice: GroupService,
    public toastr: ToastrService,
    public AllPathService: AllPathService,
    public companyservice: CompanyService,
    public ITAssetsService:ITAssetsService,
    public regionservice: RegionService,
    private storage: ManagerService,
    public sbuService: SbuService,
    public locationService: LocationService,
    private userRoleService: UserRoleService,
    private fb: FormBuilder,
    private assetClassService: AssetClassService,
    public categoryservice: AssetCategoryService,
    public typeservice: AssetTypeService,
    public subTypeservice: AssetSubTypeService,
    public reconciliationService: ReconciliationService,
    public AssetRetireService: AssetRetireService,
    public reportService: ReportService,
    private loader: AppLoaderService,
    public cls: CompanyLocationService) {
      this.header = this.jwtAuth.getHeaders();
      this.message = this.jwtAuth.getResources();
      this.TypeStatus= [
        { value: "Yes", name: this.header.AssetsExcluded },
        { value: "No", name: this.header.IncludeUntaggedAssets },
      ];
    
      this.SelectedByData = [
        { value: "OngoingProject", name: this.header.OngoingProject },
        { value: "CompletedProject", name: this.header.CompletedProject },
      ]
  }
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  IslayerDisplay: any;
  layerid: any;
  Layertext: any;
  HeaderLayerText: any;

  ngOnInit(): void {
    this.loader.open();
    this.SessionGroupId = Number(this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID));
    this.SessionRegionId = Number(this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID));
    this.SessionCompanyId = Number(this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID));
    this.SessionUserId = Number(this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID));

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

    this.ReportForm = this.fb.group({

      regionMultiCtrl: [''],
      regionMultiFilterCtrl: [''],
      companyMultiCtrl: [''],
      companyMultiFilterCtrl: [''],
      sbuMultiCtrl: [''],
      sbuMultiFilterCtrl: [''],
      plantMultiCtrl: [''],
      plantMultiFilterCtrl: [''],
      categoryMultiCtrl: [''],
      categoryMultiFilterCtrl: [''],
      classMultiCtrl: [''],
      classMultiFilterCtrl: [''],
      typeMultiCtrl: [''],
      typeMultiFilterCtrl: [''],
      subtypeMultiCtrl: [''],
      subtypeMultiFilterCtrl: [''],
      statusMultiCtrl: [''],
      statusMultiFilterCtrl: [''],
      selectedbyctrl: ['', [Validators.required]],
      reportSelectionBy: ['', [Validators.required]],
      ProjectIdctrl: ['', [Validators.required]],
      periodMultiCtrl: [''],
      periodMultiFilterCtrl: [''],
      financialyearctrl: [''],
    });

    this.paginationParams = {
      pageSize: 50,
      currentPageIndex: 0,
      endIndex: 0,
      startIndex: 0,
      totalCount: 0,
    }

    this.SBUGetdata();
    this.CategoryGetdata();
    this.TransferStatusGetdata();
    this.GetAllCompanyByGroupIdRegionId();
    this.GetAllRegionByGroupId();
    this.OnGetAssetType();
    this.OnGetAssetSubType();
    this.GetInitiatedData();
    // this.LocationGetdata();
    this.OnGetFinancialYear();

    this.selectedby.next(this.SelectedByData.slice());
    this.reportSelectionValue.next(this.SelectReportBY.slice());
    this.loader.close(); 
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    //this.dataSource.paginator = this.paginator;
  }

  viewSelected() {
    //   
    // this.dataSource = new MatTableDataSource();
  }

  clearSelected() {
    // this.newdataSource = [];
    // this.getselectedData = [];
    // this.arrlength = 0;
    // this.onChangeDataSource(this.arrBirds);
  }

  showTable() {
    this.IsPageLoad= true;
    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;  
    this.getclear(); 
    this.Onchange();
    this.getTransferInProcessData("OnPageload");
    this.show = true;
  }

  ExportedFields: any[] = [];
  clickToExport() {
    if(this.displayTable == true && this.dataSource.data.length != 0){
      this.getTransferInProcessData("IsExport");
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

  showLocationWise: boolean = false;
  showSelection: boolean = false;
  showProjectIdWise: boolean = false;
  flag: any;
  ReportSelectionFlag: any;

  onChangeReportby(event) {
    this.LocationGetdata();
    this.showmultiSearch = false;
    this.showLocationWise = false;
    this.showSelection = false;
    this.showProjectIdWise= false;
    this.flag="";
    this.ReportSelectionFlag = event;
    this.ReportForm.controls['sbuMultiCtrl'].setValue("");
    this.ReportForm.controls['plantMultiCtrl'].setValue("");
    this.ReportForm.controls['categoryMultiCtrl'].setValue("");
    this.ReportForm.controls['statusMultiCtrl'].setValue("");
    this.ReportForm.controls['ProjectIdctrl'].setValue("");
    this.ReportForm.controls['periodMultiCtrl'].setValue("");
    this.ReportForm.controls['financialyearctrl'].setValue("");
    this.ReportForm.controls['selectedbyctrl'].setValue("");
    this.resultData = [];
    this.onChangeDataSourceC("");
    this.paginationParams.totalCount=0;
    if (event == "ByLocation") {
      this.ReportForm.get('selectedbyctrl').clearValidators();
      this.ReportForm.get('selectedbyctrl').updateValueAndValidity();
      this.ReportForm.get('ProjectIdctrl').clearValidators();
      this.ReportForm.get('ProjectIdctrl').updateValueAndValidity();
      this.showLocationWise = true;
      this.showSelection = false;
      this.showProjectIdWise= false;
      // this.LocationGetdata();
    }
    else {
      this.ReportForm.get('selectedbyctrl').setValidators([Validators.required]);
      this.ReportForm.get('selectedbyctrl').updateValueAndValidity();
      this.ReportForm.get('ProjectIdctrl').setValidators([Validators.required]);
      this.ReportForm.get('ProjectIdctrl').updateValueAndValidity();
      this.showSelection = true;
      this.showProjectIdWise= false;
      this.showLocationWise = false;
    }
  }

  onChangeSelectedby(event) {
    this.showmultiSearch = false;
    this.showProjectIdWise= true;
    this.flag=event;
    this.ReportForm.controls['sbuMultiCtrl'].setValue("");
    this.ReportForm.controls['plantMultiCtrl'].setValue("");
    this.ReportForm.controls['categoryMultiCtrl'].setValue("");
    this.ReportForm.controls['statusMultiCtrl'].setValue("");
    this.ReportForm.controls['ProjectIdctrl'].setValue("");
    this.ReportForm.controls['periodMultiCtrl'].setValue("");
    this.ReportForm.controls['financialyearctrl'].setValue("");
    this.resultData = [];
    this.onChangeDataSourceC("");
    this.paginationParams.totalCount=0;
    if (event == "OngoingProject") {
      this.GetProjectName("Ongoing");
    }
    else {
      this.GetProjectName("CompletedProject");
    }
    debugger;
    this.LocationGetdata();
  }

  GetProjectName(name) {
    debugger;
    this.ProjectList = [];
    var companyId = this.SessionCompanyId.toString();
    //  var locationIds = !!this.locations ? this.locations.map(x => x.LocationId) : "0";   
    var userId =this.SessionUserId;   
    var ProjectType = name;
    this.reportService.GetProjectNameForReport(companyId, userId, ProjectType).subscribe(r => {

      if (r != null && !!r) {
        r.forEach(element => {
          this.ProjectList.push(element)
        });
      }
    })
  }

  onChangeperiod()
  {
    this.showmultiSearch = false;
    this.ProjectList = [];
    this.ReportForm.controls['ProjectIdctrl'].setValue("");
    this.ReportForm.controls['plantMultiCtrl'].setValue("");
    var companyId = this.SessionCompanyId.toString();
    // var locationIds = !!this.locations ? this.locations.map(x => x.LocationId) : "0";
    var userId=this.SessionUserId;
    var ProjectType = this.flag=="OngoingProject" ? "Ongoing":"CompletedProject";
    var periodIds = !!this.ReportForm.value.periodMultiCtrl? this.ReportForm.value.periodMultiCtrl.join(','):"";
    this.reportService.GetProjectNameForInventoryReportPeriodWise(companyId, userId, ProjectType,periodIds).subscribe(r => {

      if (r != null && !!r) {
        r.forEach(element => {
          this.ProjectList.push(element)
        });
      }
    })
    this.LocationGetdata();
  }

  onChangeProjectName() {
    this.showmultiSearch = false;
    if(!!this.ReportForm.value.ProjectIdctrl)
    {
      this.locations = [];
      this.filteredPlantsMulti= new ReplaySubject<any[]>(1);
      this.selectedPlantIdList = [];
      this.ReportForm.controls['plantMultiCtrl'].setValue("");
      var companyId = this.SessionCompanyId;
      var userId = this.SessionUserId;
      var IsGroupRegion = false;
      var SBUList = !!this.selectedSBUList ? this.selectedSBUList.join(',') : "";
      var moduleId=57;
      var projectName=this.ReportForm.value.ProjectIdctrl;
      this.reportService.GetLocationRightAndProjectWiseForReport(companyId, userId, IsGroupRegion, SBUList,moduleId,projectName).subscribe(r => {
        r.forEach(element => {
          this.locations.push(element)
          this.getFilterLocations();
        });
      })
    }
  }


  opentablePopup(columnName) {
    const dialogconfigcom = new MatDialogConfig();
    dialogconfigcom.disableClose = true;
    dialogconfigcom.autoFocus = true;
    dialogconfigcom.width = "45%";
  }

  openFilter_PopUp() {
  }

  openEditGridDisplay() {
  }

  handlePage(pageEvent: PageEvent) {
    this.IsPageLoad= false;
    this.paginationParams.pageSize = pageEvent.pageSize;
    this.paginationParams.currentPageIndex = pageEvent.pageIndex;
    this.paginationParams.endIndex = (this.paginationParams.currentPageIndex + 1) * pageEvent.pageSize;
    this.paginationParams.startIndex = this.paginationParams.currentPageIndex * pageEvent.pageSize;
    this.getTransferInProcessData("");
    if(this.multipleserach= true && this.multiSearch.length > 0)
    {
      this.getTransferInProcessData("multiplesearch");
    }
  }


  financialyeardata: any;

  OnGetFinancialYear() {
    this.ReportForm.controls['financialyearctrl'].setValue("");
    this.companyservice.GetFiscalYearList(this.SessionGroupId)
      .subscribe(r => {

        this.financialyeardata = JSON.parse(r);
        this.financialyear.next(this.financialyeardata.slice());
      });
  }

  SelectfinancialItems: any[] = [];
  periodItems: any[] = [];

  onChangefinancial(event) {
    this.showmultiSearch = false;
    this.periodItems=[];
    this.SelectfinancialItems = event;
    this.ReportForm.controls['periodMultiCtrl'].setValue("");
    if (this.selectedCompanyList != null) {
      var groupId = this.SessionGroupId.toString();
      var Company = this.SessionCompanyId.toString();
      var RegionId = this.SessionRegionId.toString();
      var FinancialYear = this.SelectfinancialItems;

      this.companyservice.GetPeriodList(groupId, RegionId, Company, FinancialYear)
        .subscribe(r => {

          const perioddata = JSON.parse(r);
          this.period.next(perioddata.slice());
          perioddata.forEach(x => {
            this.periodItems.push(x)
          });
        });
    }
    else {
      groupId = this.SessionGroupId.toString();
      Company = this.SessionCompanyId.toString();
      RegionId = this.SessionRegionId.toString();
      FinancialYear = this.SelectfinancialItems;

      this.companyservice.GetPeriodList(groupId, RegionId, Company, FinancialYear)
        .subscribe(r => {

          const perioddata = JSON.parse(r);
          this.period.next(perioddata.slice());
          perioddata.forEach(x => {
            this.periodItems.push(x)
          });
        });
    }
  }

  regiondata: any;
  SelectedregionItems: any[] = [];

  GetAllRegionByGroupId() {
    this.companyservice.OnGetRegionList(this.SessionUserId)
      .subscribe(r => {
        this.regiondata = JSON.parse(r);
        this.region.next(this.regiondata.slice());
      });
  }


  Selectregionbox(event) {
    this.SelectedregionItems = event;
  }


  getFilterRegion(Value) {
    this.region.next(Value.slice());
    this.ReportForm.controls['regionMultiFilterCtrl'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterRegionMulti();
      });
  }

  protected filterRegionMulti() {
    if (!this.regionData) {
      return;
    }
    let search = this.ReportForm.controls['regionMultiFilterCtrl'].value;
    if (!search) {
      this.region.next(this.regionData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.region.next(
      this.regionData.filter(x => x.SBU.toLowerCase().indexOf(search) > -1)
    );
  }


  GetAllCompanyByGroupIdRegionId() {
    //    
    this.companyData = [];
    var GId = this.SessionGroupId;
    var RId = this.SessionRegionId;
    this.companyservice.GetAllCompanyData(GId, RId).subscribe(response => {
      response.forEach(element => {
        this.companyData.push(element)
        this.getFilterCompany();
      });
    })
  }

  getFilterCompany() {
    this.company.next(this.companyData.slice());
    this.ReportForm.controls['companyMultiFilterCtrl'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCompanyMulti();
      });
  }

  protected filterCompanyMulti() {
    if (!this.companyData) {
      return;
    }
    let search = this.ReportForm.controls['companyMultiFilterCtrl'].value;
    if (!search) {
      this.company.next(this.companyData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.company.next(
      this.companyData.filter(x => x.CompanyName.toLowerCase().indexOf(search) > -1)
    );
  }

  assettypedropdown: any;
  OnGetAssetType() {
    this.jwtAuth.GetTypeOfAssetList(this.SessionCompanyId)
      .subscribe(r => {
        //   
        this.assettypedropdown = JSON.parse(r);
        this.type.next(this.assettypedropdown.slice());
      });
  }

  assetsubtypedropdown: any;
  OnGetAssetSubType() {
    this.ITAssetsService.GetSubTypeOfAssetMasterList(this.SessionCompanyId)
      .subscribe(r => {
        //   
        this.assetsubtypedropdown = JSON.parse(r);
        this.subtype.next(this.assetsubtypedropdown.slice());
      });
  }
  ListOfSBU :any[] =[];
  SBUGetdata() {
    this.sbus = [];
    this.selectedSBUList = [];
    this.ReportForm.controls['sbuMultiCtrl'].setValue("");
    var companyId = this.SessionCompanyId;
   // this.userRoleService.GetAllSBU(companyId).subscribe(r => {
    this.cls.GetLocationListByConfiguration(this.SessionGroupId, this.SessionUserId, this.SessionCompanyId, this.SessionRegionId, 57).subscribe(r => {
      this.ListOfSBU = JSON.parse(r);
      this.sbus = this.UniqueArraybyId(this.ListOfSBU, this.Layertext);
        this.getFilterSBUUS();
   
    })
  }

  getFilterSBUUS() {
    this.filteredsbuMulti.next(this.sbus.slice());
    this.ReportForm.controls['sbuMultiFilterCtrl'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterSBUMulti();
      });
  }

  protected filterSBUMulti() {
    if (!this.sbus) {
      return;
    }
    let search = this.ReportForm.controls['sbuMultiFilterCtrl'].value;
    if (!search) {
      this.filteredsbuMulti.next(this.sbus.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredsbuMulti.next(
      this.sbus.filter(x => x.Zone.toLowerCase().indexOf(search) > -1)
    );
  }


  onChangeSBU(name) {
    this.showmultiSearch = false;
    var idx = this.selectedSBUList.indexOf(name);
    if (idx > -1) {
      this.selectedSBUList.splice(idx, 1);
    }
    else {
      this.selectedSBUList.push(name);
    }
    this.LocationGetdata();
  }


  LocationGetdata() {
    debugger;
    this.locations = [];
    this.filteredPlantsMulti= new ReplaySubject<any[]>(1);
    this.selectedPlantIdList = [];
    this.ReportForm.controls['plantMultiCtrl'].setValue("");
    var companyId = this.SessionCompanyId;
    var userId = this.SessionUserId;
    var IsGroupRegion = false;
    var SBUList = !!this.selectedSBUList ? this.selectedSBUList.join(',') : "";
    var moduleId=57;
    this.reportService.GetLocationRightWiseForReport(companyId, userId, IsGroupRegion, SBUList,moduleId).subscribe(r => {

      r.forEach(element => {

        this.locations.push(element)
        this.getFilterLocations();
      });
    })
  }

  getFilterLocations() {
    this.filteredPlantsMulti.next(this.locations.slice());
    this.ReportForm.controls['plantMultiFilterCtrl'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPlantsMulti();
      });
  }

  protected filterPlantsMulti() {
    if (!this.locations) {
      return;
    }
    let search = this.ReportForm.controls['plantMultiFilterCtrl'].value;
    if (!search) {
      this.filteredPlantsMulti.next(this.locations.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredPlantsMulti.next(
      this.locations.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1)
    );
  }


  CategoryGetdata() {
    this.categories = [];
    this.ReportForm.controls['categoryMultiCtrl'].setValue("");
    var companyId = this.SessionCompanyId;
    var userId = this.SessionUserId;
    var IsGroupRegion = false;
    var PlantList = !!this.selectedPlantIdList ? this.selectedPlantIdList.join(',') : "";
    var moduleId=57;
    this.reportService.GetCategoryRightWiseForReport(companyId, userId, PlantList, IsGroupRegion,moduleId).subscribe(r => {
      r.forEach(element => {
        this.categories.push(element)
        this.getFilterCategory();
      });
    })
  }

  getFilterCategory() {
    this.filteredCategorysMulti.next(this.categories.slice());
    this.ReportForm.controls['categoryMultiFilterCtrl'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCategoryMulti();
      });
  }

  protected filterCategoryMulti() {
    if (!this.categories) {
      return;
    }
    let search = this.ReportForm.controls['categoryMultiFilterCtrl'].value;
    if (!search) {
      this.filteredCategorysMulti.next(this.categories.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCategorysMulti.next(
      this.categories.filter(x => x.AssetCategoryName.toLowerCase().indexOf(search) > -1)
    );
  }


  TransferStatusGetdata() {
    this.statusList = [];
    this.ReportForm.controls['statusMultiCtrl'].setValue("");
    this.TypeStatus.forEach(element => {
      this.statusList.push(element)
      this.getFilterStatus();
    });
  }


  getFilterStatus() {
    this.filteredStatusMulti.next(this.statusList.slice());
    this.ReportForm.controls['statusMultiFilterCtrl'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterStatussMulti();
      });
  }

  protected filterStatussMulti() {
    if (!this.statusList) {
      return;
    }
    let search = this.ReportForm.controls['statusMultiFilterCtrl'].value;
    if (!search) {
      this.filteredStatusMulti.next(this.statusList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredStatusMulti.next(
      this.statusList.filter(x => x.name.toLowerCase().indexOf(search) > -1)
    );
  }

  onChangePlant(plantId) {
    this.showmultiSearch = false;
    var idx = this.selectedPlantIdList.indexOf(plantId);
    if (idx > -1) {
      this.selectedPlantIdList.splice(idx, 1);
    }
    else {
      this.selectedPlantIdList.push(plantId);
    }
    this.CategoryGetdata();
  }

  onChangeCompany(CompanyId) {
    var idx = this.selectedCompanyList.indexOf(CompanyId);
    if (idx > -1) {
      this.selectedCompanyList.splice(idx, 1);
    }
    else {
      this.selectedCompanyList.push(CompanyId);
    }
  }


  SelectRetireIdItems: any[] = [];
  SelectRetireId(event) {
    this.SelectRetireIdItems = [event];
  }

  SelectedstatusItems: any[] = [];
  SelectStatusbox(event) {
    this.SelectedstatusItems = event;
  }


  SelectedcategoryItems: any[] = [];
  SelectcategoryId(event) {
    this.showmultiSearch = false;
    this.SelectedcategoryItems = event;
  }

  SelectedclassItems: any[] = [];
  SelectclassId(event) {
    this.SelectedclassItems = event;
  }

  SelectedtypeItems: any[] = [];
  SelecttypeId(event) {
    this.SelectedtypeItems = event;
  }

  SelectedsubtypeItems: any[] = [];
  SelectsubtypeId(event) {
    this.SelectedsubtypeItems = event;
  }
  PageId =57;
  ReportFlag :boolean = false;
  openPopUp(data: any = {}) {
    debugger;

    this.ListOfField.forEach((element,index)=>{
      if(element.Custom1 == 'MissingDocument' || element.Custom1 == 'Photo' ) 
        this.ListOfField.splice(index,1);
   });
   if(this.ReportSelectionFlag == "ByProjectId"){
    this.ReportFlag = true;
   }
   else{
    this.ReportFlag = false;
   }
  
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
  displayTable: boolean = false;
  Searchlist :any[];
  getTransferInProcessData(action) {
    debugger;
    if(!this.ReportForm.value.reportSelectionBy){
      this.toastr.warning('Please Select Report By', this.message.AssetrakSays);
      return null;
    }
    if(this.ReportSelectionFlag =="ByProjectId")
    {
      if(!(this.ReportForm.value.selectedbyctrl && this.ReportForm.value.ProjectIdctrl)){
        this.toastr.warning('Please Select Project type/ID', this.message.AssetrakSays);
        return null;
      }
    }
    this.loader.open();
    this.resultData = [];
    this.multipleserach = false;
    if (action === 'IsExport') {
      this.isExport = true;
    }
    else if (action !== 'IsExport') {
      this.isExport = false;
      this.paginationParams.totalCount=0;
      this.onChangeDataSourceC("");
    }

    var LocationIdList = []
    var categoryIdList = []
    if (!this.ReportForm.value.categoryMultiCtrl) {
      this.categories.forEach(x => {
        categoryIdList.push(x.AssetCategoryId);
      })
    }
    else {

      categoryIdList = this.ReportForm.value.categoryMultiCtrl
    }

    if (!this.ReportForm.value.plantMultiCtrl && this.ReportForm.value.plantMultiCtrl=="" && this.ReportForm.value.plantMultiCtrl.length == 0) {
      this.locations.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }
    else {
      LocationIdList = this.ReportForm.value.plantMultiCtrl
    }

    var selectedValue = this.ReportForm.value.selectedbyctrl;
    if(action == "OnPageload"){
      this.multipleserach = false;
      this.Searchlist = [];
    }
    if (action == "multiplesearch" && this.multiSearch.length > 0  )
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
    var parameters =
    {
      IsPhysicalVerProject: true,
      IsBaseSelected: true,
      SelectedProject: "PhysicalVerification",
      CompanyIds: [this.SessionCompanyId],
      locationIdList: LocationIdList,
      UserId: this.SessionUserId,
      isPageLoad: this.IsPageLoad,
      projectdetails: this.ReportForm.value.selectedbyctrl,
      projectName: this.ReportForm.value.ProjectIdctrl,
      CurrencyRate: 1,
      GroupId: this.SessionGroupId,
      RegionIdList: [this.SessionRegionId],
      blockIdList: [],
      SBUList: this.ReportForm.value.sbuMultiCtrl,
      CategoryIdList: categoryIdList,
      typeOfAssetList: [],
      subTypeOfAssetList: [],
      searchtext: this.IsSearch ? this.SearchText : "",
      searchColumn: this.IsSearch ? this.SearchOnColumn : "",
      pageNumber: this.isExport ? 0 : this.paginationParams.currentPageIndex + 1,
      pageSize: this.isExport ? 0 : this.paginationParams.pageSize,
      isExport: this.isExport,
      ReportSelectionBy:this.ReportSelectionFlag,
      ExportedFields : this.ExportedFields,
      ismultiplesearch: this.multipleserach,
      Searchlist : this.Searchlist,
      PageId : 57
    };

    this.reportService.GetProjectInventoryReport(parameters).subscribe(response => {
      this.loader.close();
      if (action === 'IsExport') {
        debugger;
        if(!!response)
        {
          this.AllPathService.DownloadExportFile(response);
          console.log("URL", URL);
        }
      } else {
        this.resultData = JSON.parse(response);
        this.displayTable = true;
        if(this.ReportSelectionFlag =="ByProjectId")
        {
          this.GetCountOfReport();
          // this.paginationParams.totalCount =  0;
          if (selectedValue == "OngoingProject") {
            this.onChangeDataSourceC(this.resultData.reportholder);
          } else {
            this.onChangeDataSourceC(this.resultData.inventorycomplete);
          }
        }else{
          this.paginationParams.totalCount =  this.resultData[0].TotalCount;
          this.onChangeDataSourceC(this.resultData);
        }
        // this.GetCountOfReport();
        // // this.paginationParams.totalCount =  0;
        // if (selectedValue == "OngoingProject") {
        //   this.onChangeDataSourceC(this.resultData.reportholder);
        // } else {
        //   this.onChangeDataSourceC(this.resultData.inventorycomplete);
        // }
      }

    });
  }

  onChangeDataSourceC(value) {
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.sort = this.sort;
  }

  applyFilterC(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleSelectAllSBU(selectAllValue) {
    debugger;
    this.showmultiSearch = false;
    this.sbuMultiCtrl = [];
    this.filteredsbuMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        debugger;
        if (!!selectAllValue.checked) {
          this.sbus.forEach(element => {
            this.sbuMultiCtrl.push(element[this.Layertext]);
          });
        } else {
          this.sbuMultiCtrl = "";
        }
      });
      this.ReportForm.controls['sbuMultiCtrl'].setValue(this.sbuMultiCtrl);
  }

  toggleSelectPlantAll(selectAllValue) {
    debugger;
    this.showmultiSearch = false;
    this.plantMultiCtrl = [];
    this.filteredPlantsMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        debugger;
        if (!!selectAllValue.checked) {
          let search = this.ReportForm.controls['plantMultiFilterCtrl'].value;
          if(!!search){
            this.locations.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1).forEach(element => {
              this.plantMultiCtrl.push(element.LocationId);
            });
          }
          else{
            this.locations.forEach(element => {
              this.plantMultiCtrl.push(element.LocationId);
            });
          }          
        } else {
          this.plantMultiCtrl = "";
        }
        this.ReportForm.controls['plantMultiCtrl'].setValue(this.plantMultiCtrl);
      });
  }

  toggleSelectCategoryAll(selectAllValue) {
    debugger;
    this.categoryMultiCtrl = [];
    this.filteredCategorysMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        debugger;
        if (!!selectAllValue.checked) {
          let search = this.ReportForm.controls['categoryMultiFilterCtrl'].value;
          if(!!search){
            this.categories.filter(x => x.AssetCategoryName.toLowerCase().indexOf(search) > -1).forEach(element => {
              this.categoryMultiCtrl.push(element.AssetCategoryId);
            });
          }
          else{
            this.categories.forEach(element => {
              this.categoryMultiCtrl.push(element.AssetCategoryId);
            });
          }          
        } else {
          this.categoryMultiCtrl = "";
        }
        this.ReportForm.controls['categoryMultiCtrl'].setValue(this.categoryMultiCtrl);
      });
  }
  
  


  //Changes for Page field data and edit grid display

  ListOfField: any[] = [];
  ListOfField1: any[] = [];
  searchColumns: any[] = [];

  GetInitiatedData() {

    let url3 = this.groupservice.GetFieldListByPageId(57,this.SessionUserId,this.SessionCompanyId);
   // let url6 = this.groupservice.GetFieldList(57,this.SessionUserId);
    forkJoin([url3]).subscribe(results => {

      if (!!results[0]) {

        this.ListOfField = JSON.parse(results[0]);
        this.searchColumns = this.ListOfField.filter(x => x.SearchOptionEnabled == true).map(choice => choice);
        this.displayedColumns = this.ListOfField;
        this.displayedColumns = this.displayedColumns.filter(x => x.Custom2 == "1").map(choice => choice.Custom1);
        console.log("Displayed: ", this.displayedColumns)
      }
      // if (!!results[1]) {

      //   this.ListOfField1 = JSON.parse(results[1]);
      //   this.searchColumns = this.ListOfField1.filter(x => x.SearchOptionEnabled == true).map(choice => choice);
      // }
    })
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
      }
    })
  }


  GetCountOfReport() {
    var LocationIdList = []
    var categoryIdList = []
    if (!this.ReportForm.value.categoryMultiCtrl) {
      this.categories.forEach(x => {
        categoryIdList.push(x.AssetCategoryId);
      })
    }
    else {

      categoryIdList = this.ReportForm.value.categoryMultiCtrl
    }

    if (!this.ReportForm.value.plantMultiCtrl) {
      this.locations.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }
    else {
      LocationIdList = this.ReportForm.value.plantMultiCtrl
    }
    var data =
    {
      projectdetails: this.ReportForm.value.selectedbyctrl,
      taggable: "",
      projectName: this.ReportForm.value.ProjectIdctrl,
      selectedStatusList: "",
      CompanyIds: [this.SessionCompanyId],
      tableName: "InventoryReport",
      UserId: this.SessionUserId,
      blockIdList: [],
      locationIdList: LocationIdList,
      // searchtext: '',
      // searchColumn: '',
      searchtext: this.IsSearch ? this.SearchText : "",
      searchColumn: this.IsSearch ? this.SearchOnColumn : "",	
      SBUList: this.ReportForm.value.sbuMultiCtrl,
      CategoryIdList: categoryIdList,
      typeOfAssetList: [],
      subTypeOfAssetList: [],
    }

    this.reportService.GetReportCount(data).subscribe(response => {

      this.Count = response;
      this.paginationParams.totalCount = !!this.Count ? this.Count : 0;
    })
  }


//   GetPhoto(currentdata) {
// debugger;
//     if (!!currentdata) {
//       var prefarId = currentdata;
//       var documentType = 3;
//       var ProjectName = this.ReportForm.value.ProjectIdctrl;
//       // this.reportService.GetPhotoForReport(prefarId, documentType).subscribe(response => {
//         this.reportService.GetPhotoForInventoryReport(prefarId, documentType,ProjectName).subscribe(response => {

//         var path = this.SessionCompanyId + "/Inventory/" + response;
//         this.AllPathService.ViewDocument(path);
//       })
//     }
//   }

GetPhoto(element) {
  debugger;
      if (!!element) {
        var prefarId = element.PrefarId;
        var documentType = 3;
        var ProjectName = this.ReportForm.value.ProjectIdctrl;
        if(ProjectName==""){
          ProjectName = element.projectName;
        }
        // this.reportService.GetPhotoForReport(prefarId, documentType).subscribe(response => {
          this.reportService.GetPhotoForInventoryReport(prefarId, documentType,ProjectName).subscribe(response => {
  
          var path = this.SessionCompanyId + "/Inventory/" + response;
          this.AllPathService.ViewDocument(path);
        })
      }
    }


  viewDocuments(element) {
    var prefarId=0;
    if(this.ReportSelectionFlag =="ByProjectId")
    {
       prefarId = element[this.header.MissingDocument];
    }else{
       prefarId = element['MissingDocument'];
    }
    // var prefarId = element[this.header.MissingDocument];
    var documentType = 100;
    var ProjectName = this.ReportForm.value.ProjectIdctrl;
    if(ProjectName==""){
      ProjectName = element.projectName;
    }
    // this.reportService.GetAllDocumentsPath(prefarId, documentType).subscribe(r => {
      this.reportService.GetAllDocumentsPathForIneventoryReport(prefarId, documentType,ProjectName).subscribe(r => {
      if (!!r) {
        var path = r;
        var fileNames = path.split('|');
        var FileName = fileNames[3];

        var path1 = this.SessionCompanyId + "/Missing/" + FileName;
        this.AllPathService.ViewDocument(path1);

      }
    })
  }


  //Search Functionality
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
  SearchText: any;
  SearchOnColumn: any;
  IsSearch:boolean= false;
  
  AssetNoFilter = new FormControl();


  SerchAssetid(columnName) {
    debugger;
    this.IsPageLoad= false;
    this.IsSearch= false;
    this.SearchText= "";
    this.SearchOnColumn = "";

    this.SearchOnColumn = columnName;
    this.SearchText = !this.AssetNoFilter.value ? "" : this.AssetNoFilter.value;
    if(!!this.SearchText){
       this.IsSearch= true;
       this.SearchText = this.SearchText.trim(); 
    }
     
    if(this.IsSearch) {
      this.paginator.pageIndex = 0;
      this.paginationParams.pageSize = 50;
      this.paginationParams.currentPageIndex = 0;

      this.getTransferInProcessData("SearchText");
    }    
  }

  ClearSerch(columnName, isflag) {
    debugger;
    this.SearchOnColumn = "";
    this.SearchText = "";
    this.AssetNoFilter.setValue("");
    this.IsSearch= false;

    this.isButtonVisible = !isflag; 
    this.isButtonVisibleBarCode = !isflag; 
    this.isButtonVisibleADL2 = !isflag; 
    this.isButtonVisibleADL3 = !isflag; 
    this.isButtonVisibleSupplier = !isflag; 
    this.isButtonVisibleGRNNo = !isflag; 
    this.isButtonVisibleSerialNo = !isflag; 
    this.isButtonVisibleITSerialNo = !isflag; 
    this.isButtonVisiblePONumber = !isflag; 
    this.isButtonVisibleEqipmentNumber = !isflag; 
    this.isButtonVisibleCPPNumber = !isflag; 

    // this.showTable();
    this.IsPageLoad= false;
    this.paginator.pageIndex = 0;
   this.paginationParams.pageSize = 50;
   this.paginationParams.currentPageIndex = 0;  
   this.getclear(); 
   this.getTransferInProcessData("");
  }


  Serchicon(columnName, isflag) {
    debugger;
    if(this.ReportForm.valid)
    {
      this.SearchOnColumn = "";
      this.SearchText = "";
      this.AssetNoFilter.setValue("");
      this.IsSearch= false;
  
      this.isButtonVisible = isflag;
      this.isButtonVisibleBarCode = isflag;
      this.isButtonVisibleADL2 = isflag;
      this.isButtonVisibleADL3 = isflag;
      this.isButtonVisibleSupplier = isflag;
      this.isButtonVisibleGRNNo = isflag;
      this.isButtonVisibleSerialNo = isflag;
      this.isButtonVisibleITSerialNo = isflag;
      this.isButtonVisiblePONumber = isflag;
      this.isButtonVisibleEqipmentNumber = isflag;
      this.isButtonVisibleCPPNumber = isflag;
  
      if (columnName == "AssetId") { this.isButtonVisible = !isflag; }
      if (columnName == "Barcode") { this.isButtonVisibleBarCode = !isflag; }
      if (columnName == "ADL2") { this.isButtonVisibleADL2 = !isflag; }
      if (columnName == "ADL3") { this.isButtonVisibleADL3 = !isflag; }
      if (columnName == "Suplier") { this.isButtonVisibleSupplier = !isflag; }
      if (columnName == "GRNNo") { this.isButtonVisibleGRNNo = !isflag; }
      if (columnName == "SerialNo") { this.isButtonVisibleSerialNo = !isflag; }
      if (columnName == "ITSerialNo") { this.isButtonVisibleITSerialNo = !isflag; }
      if (columnName == "PONumber") { this.isButtonVisiblePONumber = !isflag; }
      if (columnName == "equipmentNo") { this.isButtonVisibleEqipmentNumber = !isflag; }
      if (columnName == "CPPNumber") { this.isButtonVisibleCPPNumber = !isflag; }
    }
  }

  getclear() {
    this.SearchOnColumn = "";
    this.SearchText = "";
    this.AssetNoFilter.setValue("");
    this.IsSearch= false;

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
   
  mapLocation(element){ 
    debugger;
    var value="";
    if(this.ReportSelectionFlag =="ByProjectId")
    {
       value = element[this.header['GPS_CoOrdinate']] ;
    }else{
       value = element['GPS_CoOrdinate'] ;
    }
    // var value = element[this.header['GPS_CoOrdinate']] ;
    if (!value) {

    } else {
        window.open('https://www.google.com/maps/search/?api=1&query=' + value ,'_blank');
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
  this.searchCount = 0;
  this.hideSearch = false;
  this.multiSearch.forEach(val => {
    if(!!val.HighValue){
      this.hideSearch = true;
      this.searchCount = this.searchCount + 1;
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
    this.getTransferInProcessData("");
}
multipleserach : boolean= false;
onMultiSearchClick(){

     
    this.multipleserach= true ;
    this.getTransferInProcessData("multiplesearch");
    console.log(this.multiSearch);

}
openMultiSearchDialog(val:any){	
  let title = 'Create list of values to search';	
  const dialogRef = this.dialog.open(MultiSearchDialogComponent, {	
    width: 'auto',	
    height: 'auto',	
    data: { title: title, payload: '' }	
  })	
  dialogRef.afterClosed().subscribe(result => {	
    if (!!result) {           	
      console.log(result)	
      if(result.length>1)	
      val.HighValue = result[0].name+','+result[1].name+'...';	
      else val.HighValue = result[0].name;	
    }	
  })	
}	
Onchange(){
  this.showmultiSearch = false;
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
}
