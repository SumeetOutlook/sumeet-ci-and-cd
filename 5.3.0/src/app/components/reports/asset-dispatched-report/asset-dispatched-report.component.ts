import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
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
import { ViewUploadDocumentsDialogComponent } from '../../partialView/view-upload-documents-dialog/view-upload-documents-dialog.component'
import { assetTabsComponent } from '../../partialView/assetDetails/asset_tabs.component';
import { ToastrService } from 'ngx-toastr';
import {ITAssetsService} from '../../../components/services/ITAssetsService';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { ExportFieldsComponent } from 'app/components/partialView/export-fields/export-fields.component'; 
import { MultiSearchDialogComponent } from 'app/components/partialView/multi-search-dialog/multi-search-dialog.component';
import { CompanyLocationService } from 'app/components/services/CompanyLocationService';

interface City {
  id: string;
  name: string;
}
interface Plant {
  id: string;
  name: string;
}
interface TransferId {
  id: string;
  name: string;
}
interface AssetCategory {
  id: string;
  name: string;
}
interface Status {
  id: string;
  name: string;
}
interface Currency {
  id: string;
  name: string;
}

export interface PeriodicElement {
  AssetNo: string;
  SubNo: string;
  CapitalizationDate: string;
  AssetClass: string;
  AssetType: string;
  AssetSubType: string;
  UOM: string;
  AssetName: string;
  AssetDescription: string;
  Qty: string;
  Location: string;
  Cost: string;
  WDV: string;
  EquipmentNO: string;
  AssetCondition: string;
  AssetCriticality: string;

}


const PLANTS: Plant[] = [
  { name: '7888996', id: 'A' },
  { name: 'AAAABBBBCCCC', id: 'B' },
  { name: 'Abu Dhabi', id: 'C' },
  { name: 'Auckland', id: 'D' },
  { name: 'Chennai', id: 'E' },
  { name: 'Dubai', id: 'F' },
  { name: 'Mumbai', id: 'G' },
  { name: 'Wellington', id: 'H' },
];
const CITY: City[] = [
  { name: 'Pune', id: 'A' },
  { name: 'Sulawesi Selatan', id: 'B' },
  { name: 'Abu Zabi', id: 'C' },
  { name: 'Hillsborough', id: 'D' },
  { name: 'Leone', id: 'E' },
  { name: 'Dubai', id: 'F' },
  { name: 'Mumbai', id: 'G' },
  { name: 'Martinborough', id: 'H' },
];
const TRANSFERID: TransferId[] = [
  { name: 'TR_20200821', id: 'A' },
  { name: 'TR_20200822', id: 'B' },
  { name: 'TR_20200823', id: 'C' },
  { name: 'TR_20200824', id: 'D' },
  { name: 'TR_20200826', id: 'E' },
  { name: 'TR_20200827', id: 'F' },
];
const ASSETCATEGORY: AssetCategory[] = [
  { name: '@#$%^&*()', id: 'A' },
  { name: 'AAABBBCCC', id: 'B' },
  { name: 'Computer', id: 'C' },
  { name: 'Furniture & Fixture', id: 'D' },
  { name: 'LAND & BUILDING', id: 'E' },
  { name: 'LAPTOP', id: 'F' },
  { name: 'PLANT & EQUIPMENT', id: 'G' },
  { name: 'PLANT & MACHINARY', id: 'H' },
];
const STATUS: Status[] = [
  { name: 'Unapproved Transfer', id: 'A' },
  { name: 'Reinitiation requested', id: 'B' },
  { name: 'Request Withdrawn', id: 'C' },
  { name: 'Transfer Initiated', id: 'D' },
  { name: 'Available for Physical Transfer', id: 'E' },
  { name: 'Completed Transfer', id: 'F' },
  { name: 'Assets In Transit', id: 'G' },
];
const CURRENCY: Currency[] = [
  { name: 'INR', id: 'A' },
  { name: 'EGP', id: 'B' },
  { name: 'USD', id: 'C' },
];

@Component({
  selector: 'app-asset-dispatched-report',
  templateUrl: './asset-dispatched-report.component.html',
  styleUrls: ['./asset-dispatched-report.component.scss']
})
export class AssetDispatchedReportComponent implements OnInit {

  header: any = [];
  message: any;
  panelOpenState = true;
  numRows: number;
  show: boolean = false;
  showperiod: boolean = false;
  showretire: boolean = false;
  //showGoButton : boolean = false;
  isButtonVisible: boolean = false;
  setflag: boolean =false;
  submitted: boolean = false;
  public arrlength = 0;
  public fil = 0;
  public appliedfilters: any[] = [];
  menuheader: any = (menuheaders as any).default
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  protected _onDestroy = new Subject<void>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedHeaders: string[] = [this.header.InventoryNumber, this.header.AssetNo, this.header.SAID,
  this.header.AssetClass, this.header.ADL1, this.header.ADL2, this.header.ADL3, this.header.AcquisitionCost, this.header.WDV,
  this.header.EquipmentNumber, this.header.AssetCondition, this.header.AssetCriticality, this.header.TransferId, this.header.TransferStatus,
  this.header.SourceLocation, this.header.TransferTo, this.header.PreviousInventoryInfo,
  this.header.InitiatedBy, this.header.InitiatedOn, this.header.FinancialLevelTransferBy, this.header.FinancialLevelTransferOn,
  this.header.BlockOwner, this.header.SourceBODate, this.header.DestinationBlockOwner, this.header.DestinationBODate, this.header.A1, this.header.Approval1On,
  this.header.A2, this.header.Approval2On, this.header.A3, this.header.Approval3On, this.header.WithdrawBy, this.header.WithdrawOn,
  this.header.ApprovedDeclinedby, this.header.ApprovedDeclinedOn, this.header.Comment, this.header.PhysicalAssetTransferBy, this.header.PhysicalAssetTransferon, this.header.InventoryStatus, this.header.RetirementStatus,
  this.header.AllocationStatus];

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

  transferStatus: any[] = [];

  SelectedByData: any[] = [
    { value: "ForThePeriod", name: "For The Period" },
    { value: "ByTransferId", name: "By Transfer Id" },
  ]

  statusList: any[] = [];
  // DisplayHeaders: string[] = [ this.header.InventoryNumber, this.header.AID, this.header.SAID, this.header.AcquisitionDate, this.header.AssetClass, this.header.ADL1, this.header.ADL2, this.header.ADL3,this.header.Supplier, this.header.Location, this.header.Quantity, this.header.CostCenter, this.header.Room, this.header.StorageLocation, this.header.UserEmail, this.header.User, this.header.Cost, this.header.WDV, this.header.EqipmentNumber, this.header.AssetCondition, this.header.AssetCriticality, this.header.InventoryIndicator, this.header.Stage, this.header.ThirdPartyName, this.header.VendorLocation, this.header.VendorSentDate, this.header.CheckedOutAsset, this.header.WDVDate, this.header.TransferType, this.header.SerialNo, this.header.UOM, this.header.ITSerialNo, this.header.TransferId, this.header.TransferStatus, this.header.SourceLocation, this.header.DestinationLocation, this.header.PreviousInventoryInfo, this.header.InitiatedBy, this.header.InitiatedOn, this.header.FinancialLevelTransferBy, this.header.FinancialLevelTransferOn, this.header.AssetClassOwner, this.header.SourceBOTime, this.header.DestinationBlockOwner, this.header.DestinationBOTime, this.header.A1, this.header.Approval1On, this.header.A2, this.header.Approval2On, this.header.A3, this.header.Approval3On, this.header.WithdrawBy, this.header.WithdrawOn, this.header.ApprovedDeclinedby, this.header.ApprovedDeclinedOn, this.header.Comment, this.header.TransferDocument, this.header.PhysicalAssetTransferBy, this.header.PhysicalAssetTransferon, this.header.InventoryStatus, this.header.RetirementStatus, this.header.AllocationStatus, this.header.ATF, this.header.SBU];
  DisplayHeaders: string[] = [this.header.InventoryNumber, this.header.PrefarId, this.header.AID, this.header.SAID, this.header.AcquisitionDate, this.header.AssetClass, this.header.ADL1, this.header.ADL2, this.header.ADL3, this.header.Supplier, this.header.Location, this.header.Quantity, this.header.CostCenter, this.header.Room, this.header.StorageLocation, this.header.UserEmail, this.header.User, this.header.Cost, this.header.WDV, this.header.ConvertedCost, this.header.ConvertedWDV, this.header.EqipmentNumber, this.header.AssetCondition, this.header.AssetCriticality, this.header.InventoryIndicator, this.header.ThirdPartyName, this.header.VendorLocation, this.header.VendorSentDate, this.header.CheckedOutAsset, this.header.InventoryNote, this.header.LabelQuality, this.header.WDVDate, this.header.TransferType, this.header.SerialNo, this.header.UOM, this.header.ITSerialNo, this.header.TransferId, this.header.TransferStatus, this.header.SourceLocation, this.header.DestinationLocation, this.header.PreviousInventoryInfo, this.header.InitiatedBy, this.header.InitiatedOn, this.header.FinancialLevelTransferBy, this.header.FinancialLevelTransferOn, this.header.AssetClassOwner, this.header.SBOApprovedOn, this.header.DestinationBlockOwner, this.header.DBOApprovedOn, this.header.A1, this.header.Approval1On, this.header.A2, this.header.Approval2On, this.header.A3, this.header.Approval3On, this.header.WithdrawBy, this.header.WithdrawOn, this.header.ApprovedDeclinedby, this.header.ApprovedDeclinedOn, this.header.ReceivedBy, this.header.ReceivedOn, this.header.Comment, this.header.TransferDocument, this.header.PhysicalAssetTransferBy, this.header.PhysicalAssetTransferon, this.header.PhysicalAssetDispatchDocument, this.header.DeliveryMode, this.header.Temp2, this.header.DeliveredTo, this.header.Temp4, this.header.Temp5, this.header.ExpectedReceiptDate, this.header.ATF, this.header.SBU];

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

  constructor(private jwtAuth: JwtAuthService, public dialog: MatDialog, private httpService: HttpClient, public localService: LocalStoreService, public datepipe: DatePipe,
    public groupservice: GroupService,
    public AllPathService: AllPathService,
    public companyservice: CompanyService,
    public regionservice: RegionService,
    public ITAssetsService:ITAssetsService,
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
    public toastr: ToastrService,
    private loader: AppLoaderService,
    public cls :CompanyLocationService
    ){
       this.header = this.jwtAuth.getHeaders();
       this.message = this.jwtAuth.getResources();
       this.transferStatus = [
        { value: "", name: this.header.All },
        { value: "Rejected Transfer", name: this.header.RequestReinitiation },
        { value: "Request Withdrawn", name: this.header.RequestWithdrawn },
        { value: "Unapproved Transfer", name: this.header.UnapprovedTransfer },
        { value: "Avail for Physical Transfer", name: this.header.AvailforPhysicalTransfer },
        // { value: "Assets In Transit", name: this.header.AssetsInTransit },
        { value: "Completed Transfer", name: this.header.CompletedTransfer },
    
      ];
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

    // this.SessionGroupId = 2;
    // this.SessionRegionId = 1;
    // this.SessionCompanyId = 2;
    // this.SessionUserId= 4;

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
      transferidMultiCtrl: ['', [Validators.required]],
      transferidFilterCtrl: ['',],
      selectedbyctrl: ['',[Validators.required]],
      periodMultiCtrl: ['', [Validators.required]],
      periodMultiFilterCtrl: [''],
      financialyearctrl: ['', [Validators.required]]
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
    this.OnGetClass();
    this.OnGetAssetType();
    this.OnGetAssetSubType();
    this.OnGetFinancialYear();
    this.GetInitiatedData();
    this.OnGetTransferId();
    this.LocationGetdata();

    this.selectedby.next(this.SelectedByData.slice());
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
    if(!this.ReportForm.value.selectedbyctrl){
      this.toastr.warning('Please Select Selected By', this.message.AssetrakSays);
      return null;
    }
    if(this.ReportForm.value.selectedbyctrl =="ForThePeriod")
    {
      if(!(this.ReportForm.value.financialyearctrl && this.ReportForm.value.periodMultiCtrl)){
        this.toastr.warning('Please Select Financial year/Period', this.message.AssetrakSays);
        return null;
      }
    }
    if(this.ReportForm.value.selectedbyctrl =="ByTransferId")
    {
      if(!this.ReportForm.value.transferidMultiCtrl.length){
        this.toastr.warning('Please Select Transfer ID', this.message.AssetrakSays);
        return null;
      }
    }
    this.IsPageLoad= true;
    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0; 
    this.getclear();
    this.Onchange();
    this.getTransferInProcessData("OnPageload");
    this.show = true;
  }

  
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
  onChangeSelectedby(event) {

    this.ReportForm.controls['sbuMultiCtrl'].setValue("");
    this.ReportForm.controls['plantMultiCtrl'].setValue("");
    this.ReportForm.controls['categoryMultiCtrl'].setValue("");
    this.ReportForm.controls['statusMultiCtrl'].setValue("");
    this.ReportForm.controls['transferidMultiCtrl'].setValue("");
    this.ReportForm.controls['periodMultiCtrl'].setValue("");
    this.ReportForm.controls['financialyearctrl'].setValue("");
    if (event == "ForThePeriod") {
      this.showperiod = true;
      this.showretire = false;
      this.ReportForm.get('transferidMultiCtrl').clearValidators();
      this.ReportForm.get('transferidMultiCtrl').updateValueAndValidity();
    }
    else {
      this.showperiod = false;
      this.showretire = true;
      this.ReportForm.get('periodMultiCtrl').clearValidators();
      this.ReportForm.get('periodMultiCtrl').updateValueAndValidity();
      this.ReportForm.get('financialyearctrl').clearValidators();
      this.ReportForm.get('financialyearctrl').updateValueAndValidity();
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

  onChangefinancial(event) {

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
        });
    }
  }

  SelectperiodItems: any[] = [];

  onChangeperiod(event) {
    this.SelectperiodItems = [event];
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

  regiondata: any;
  SelectedregionItems: any[] = [];

  GetAllRegionByGroupId() {
    this.companyservice.OnGetRegionList(this.SessionUserId)
      .subscribe(r => {
        //  
        this.regiondata = JSON.parse(r);
        this.region.next(this.regiondata.slice());
      });
  }


  Selectregionbox(event) {
    this.SelectedregionItems = event;
  }


  getFilterRegion(Value) {
    //  
    this.region.next(Value.slice());
    this.ReportForm.controls['regionMultiFilterCtrl'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        //   
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
      //   
      response.forEach(element => {
        this.companyData.push(element)
        this.getFilterCompany();
      });
    })
  }

  getFilterCompany() {
    //  
    this.company.next(this.companyData.slice());
    this.ReportForm.controls['companyMultiFilterCtrl'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        //  
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
    this.cls.GetLocationListByConfiguration(this.SessionGroupId, this.SessionUserId, this.SessionCompanyId, this.SessionRegionId, 63).subscribe(r => {
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

  RetireIdData1: any;

  OnGetTransferId() {

    this.RetireIdData1 = "";
    this.transferIdData = [];
    this.ReportForm.controls['transferidMultiCtrl'].setValue("");
    var CompanyIds = this.SessionCompanyId.toString();
    var locationIdList = !!this.selectedPlantIdList ? this.selectedPlantIdList.join(',') : "";
    var UserId = this.SessionUserId;
    var IsGroupRegion = false;
    var sbuIdList = !!this.selectedSBUList ? this.selectedSBUList.join(',') : "";
    this.reportService.GetTransferIdsForTransferDispatchedReport(CompanyIds, locationIdList,UserId, IsGroupRegion,sbuIdList).subscribe(response => {

      this.RetireIdData1 = JSON.stringify(response);
      this.transferid.next(JSON.parse(this.RetireIdData1).slice());
      this.transferIdData = [];
      response.forEach(element => {
       this.transferIdData.push(element)
       this.getFiltertransferIds();
     });  
    })
  }

  onChangeSBU(name) {
    //  
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
    this.locations = [];
    this.filteredPlantsMulti= new ReplaySubject<any[]>(1);
    this.selectedPlantIdList = [];
    this.ReportForm.controls['plantMultiCtrl'].setValue("");
    var companyId = this.SessionCompanyId;
    var userId = this.SessionUserId;
    var IsGroupRegion = false;
    var SBUList = !!this.selectedSBUList ? this.selectedSBUList.join(',') : "";
    var moduleId=63;
    this.reportService.GetLocationRightWiseForReport(companyId, userId, IsGroupRegion, SBUList,moduleId).subscribe(r => {

      r.forEach(element => {

        this.locations.push(element)
        this.getFilterLocations();
      });
    })
    this.OnGetTransferId();
  }

  getFilterLocations() {
    //  
    this.filteredPlantsMulti.next(this.locations.slice());
    this.ReportForm.controls['plantMultiFilterCtrl'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        //  
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
    var moduleId=63;
    // this.userRoleService.GetAllCategory(companyId).subscribe(r => {
    this.reportService.GetCategoryRightWiseForReport(companyId, userId, PlantList, IsGroupRegion,moduleId).subscribe(r => {
      r.forEach(element => {
        this.categories.push(element)
        this.getFilterCategory();
      });
    })
  }

  getFilterCategory() {
    //  
    this.filteredCategorysMulti.next(this.categories.slice());
    this.ReportForm.controls['categoryMultiFilterCtrl'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        //  
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
    this.transferStatus.forEach(element => {
      this.statusList.push(element)
      this.getFilterStatus();
    });
  }


  getFilterStatus() {
    //  
    this.filteredStatusMulti.next(this.statusList.slice());
    this.ReportForm.controls['statusMultiFilterCtrl'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        //  
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
    debugger;
    var idx = this.selectedPlantIdList.indexOf(plantId);
    if (idx > -1) {
      this.selectedPlantIdList.splice(idx, 1);
    }
    else {
      this.selectedPlantIdList.push(plantId);
    }
    this.OnGetTransferId();
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

    this.OnGetTransferId();
  }

  // GetTransferIds(result : any) {
  // //  
  //   this.transferIdData = [];
  //   var CompanyIds = this.selectedCompanyList.join(',');
  //   var locationIdList = result.join(',');

  //   this.AssetRetireService.GetAllRetiredIdForReport(CompanyIds,locationIdList).subscribe(response=>{
  //   //   r.forEach(element => {
  //   //       this.transferIdData.push(element)
  //   //       this.getFiltertransferIds();
  //   //   });
  //   //  
  //   this.transferIdData  = JSON.parse(response);

  //   this.retrieid.next(this.transferIdData.slice());
  //    })
  // }
displayTable: boolean = false;
  getFiltertransferIds() {
    //  
    this.transferIdData.sort((a,b) =>  a < b ? 1 : a > b ? -1 : 0);
    this.transferid.next(this.transferIdData.slice());
    this.ReportForm.controls['transferidFilterCtrl'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        //   
        this.filtertransferIdsMulti();
      });
  }
  PageId =63;
  ReportFlag :boolean = false;
  openPopUp(data: any = {}) {
    debugger;
    this.ReportFlag = true;
    this.ListOfField.forEach((element,index)=>{
      if(element.Custom1 == 'TransferDocument' || element.Custom1 == 'PhysicalDispatchDocument' || element.Custom1 == 'ATF' ) 
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
  protected filtertransferIdsMulti() {
    if (!this.transferIdData) {
      return;
    }
    let search = this.ReportForm.controls['transferidFilterCtrl'].value;
    if (!search) {
      this.transferid.next(this.transferIdData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.transferid.next(
      this.transferIdData.filter(x => x.toLowerCase().indexOf(search) > -1)
    );
  }

  OnGetClass() {

    var CompanyId = this.SessionCompanyId;

    this.AssetRetireService.GetBlockOfAssetsByCompany(CompanyId).subscribe(response => {
      //  
      var Class = JSON.stringify(response);
      this.class.next(JSON.parse(Class).slice());

    });
  }

  SelectRetireIdItems: any[] = [];

  SelectRetireId(event) {

    this.SelectRetireIdItems = [event];
    //this.showGoButton = true;
  }

  SelectedstatusItems: any[] = [];

  SelectStatusbox(event) {

    this.SelectedstatusItems = event;
  }


  SelectedcategoryItems: any[] = [];

  SelectcategoryId(event) {

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

  ExportedFields: any[] = [];
  Searchlist :any[];

  getTransferInProcessData(action) {
    this.loader.open();
    // this.dataSource=null;
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

    if (!this.ReportForm.value.plantMultiCtrl) {
      this.locations.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }
    else {
      LocationIdList = this.ReportForm.value.plantMultiCtrl
    }
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
      selectedStatusList: this.ReportForm.value.statusMultiCtrl,
      GroupId: this.SessionGroupId,
      RegionIdList: [this.SessionRegionId],
      CompanyIds: [this.SessionCompanyId],
      IsBaseSelected: true,
      ReportName: "AssetDispatchedReport",
      transferAssetIdList: this.ReportForm.value.transferidMultiCtrl,
      UserId: this.SessionUserId,
      blockIdList: [],
      isExport: this.isExport,
      isPageLoad: this.IsPageLoad,
      locationIdList: LocationIdList,
      // pageNumber :  this.paginationParams.currentPageIndex + 1,
      // pageSize : this.paginationParams.pageSize,
      pageNumber: this.isExport ? 0 : this.paginationParams.currentPageIndex + 1,
      pageSize: this.isExport ? 0 : this.paginationParams.pageSize,
      // searchtext: "",
      // searchColumn: "",
      searchtext: this.IsSearch ? this.SearchText : "",
      searchColumn: this.IsSearch ? this.SearchOnColumn : "",
      SBUList: this.ReportForm.value.sbuMultiCtrl,
      CategoryIdList: categoryIdList,
      typeOfAssetList: [],
      subTypeOfAssetList: [],
      Period: this.ReportForm.value.periodMultiCtrl,
      fiscal_Year: this.ReportForm.value.financialyearctrl,
      blockid: [],
      ExportedFields : this.ExportedFields,
      ismultiplesearch: this.multipleserach,
      Searchlist : this.Searchlist,
      PageId : 63
    };

    this.reportService.GETASSETREGISTERREPORTBYSP(parameters).subscribe(response => {
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
        this.GetCountOfReport();
        this.onChangeDataSourceC(this.resultData.reportholder);
      }

    });
  }

  onChangeDataSourceC(value) {
    //  
    this.dataSource = new MatTableDataSource(value);
    //this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilterC(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleSelectAllSBU(selectAllValue) {
    debugger;
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

    let url3 = this.groupservice.GetFieldListByPageId(63,this.SessionUserId,this.SessionCompanyId);
   // let url6 = this.groupservice.GetFieldList(63,this.SessionUserId);
    forkJoin([url3]).subscribe(results => {

      if (!!results[0]) {

        this.ListOfField = JSON.parse(results[0]);
        this.searchColumns = this.ListOfField.filter(x => x.SearchOptionEnabled == true).map(choice => choice);
        this.displayedColumns = this.ListOfField;
        this.displayedColumns = this.displayedColumns.filter(x => x.Custom2 == "1").map(choice => choice.Custom1);
        this.displayedColumns = ['Icon'].concat(this.displayedColumns);
        console.log("Displayed: ", this.displayedColumns)
      }
      // if (!!results[1]) {

      //   this.ListOfField1 = JSON.parse(results[1]);
      //   this.searchColumns = this.ListOfField1.filter(x => x.SearchOptionEnabled == true).map(choice => choice);
      // }
      // this.loader.close();
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
        this.displayedColumns = ['Icon'].concat(this.displayedColumns);
      }
    })
  }


  GetATFData(currentdata) {

    if (!!currentdata) {
      var fileNames = currentdata.split('/');
      var prefarId = fileNames[0];
      var status = fileNames[1];
      var id = fileNames[2];
      this.reportService.GetATF(prefarId, id).subscribe(response => {

        var path = response;
        this.AllPathService.ViewATFandADF(path);
      })
    }
  }

  GetATAFData(currentdata) {

    if (!!currentdata) {
      var fileNames = currentdata.split('/');
      var prefarId = fileNames[0];
      var status = fileNames[1];
      var id = fileNames[2];
      this.reportService.GetATAF(prefarId, id).subscribe(response => {

        var path = response;
        this.AllPathService.ViewATFandADF(path);
      })
    }
  }


  showpdfATAF(value) {

    var data = value.split('/');
    var prefarId = data[0];
    var Status = data[1];
    var discardSource = data[2];
    var ReceiveDate = data[3];

    if ((ReceiveDate != "" || ReceiveDate != null) && ((value.indexOf('Retirement Approved') > -1) || (value.indexOf('Disposed') > -1) || (value.indexOf('Avail for Physical Transfer') > -1))) {
      return true;
    } else {
      return false;
    }
  }


  showpdfForATFToADF(value) {

    if ((value.indexOf('Assets In Transit') > -1) || (value.indexOf('Completed Transfer') > -1)) {
      return true;
    } else {
      return false;
    }
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
      selectedStatusList: this.ReportForm.value.statusMultiCtrl,
      CompanyIds: [this.SessionCompanyId],
      tableName: "AssetDispatchedReport",
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
      TransferIdList: this.ReportForm.value.transferidMultiCtrl,
      Period: this.ReportForm.value.periodMultiCtrl,
    }

    this.reportService.GetReportCount(data).subscribe(response => {

      this.Count = response;
      this.paginationParams.totalCount = this.Count;
    })
  }


  viewDocuments(element) {
    debugger;
    // var TransferId = !!this.transferIdMultiCtrl ? this.transferIdMultiCtrl : 0;
    var TransferId = element[this.header.TransferId];
    this.reconciliationService.GetDocumentlistByTransferID(TransferId).subscribe(r => {

      if (!!r) {
        var documentList = [];
        documentList = JSON.parse(r);
        console.log("Doc", documentList)
        const dialogRef = this.dialog.open(ViewUploadDocumentsDialogComponent, {
          width: '980px',
          disableClose: true,
          data: { title: "", payload: documentList }
        });
        dialogRef.afterClosed().subscribe(result => {

        })
      }
    })
  }

  viewPhysicalDocuments(element) {
    debugger;
    
    var TransferId = element[this.header.TransferId];
    this.reconciliationService.GetDocumentlistByPhysicalTransfer(TransferId).subscribe(r => {

      if (!!r) {
        var documentList = [];
        documentList = JSON.parse(r);
        console.log("Doc", documentList)
        const dialogRef = this.dialog.open(ViewUploadDocumentsDialogComponent, {
          width: '980px',
          disableClose: true,
          data: { title: "", payload: documentList }
        });
        dialogRef.afterClosed().subscribe(result => {

        })
      }
    })
  }

  

  viewDispatchDocument(element) {
    debugger;
    var id = element[this.header.PhysicalDispatchDocument];
    var prefarId=id.split('/')[0];
    var docId=id.split('/')[1];
    var ProjectName = this.ReportForm.value.ProjectIdctrl;
      this.reportService.GetAllDocumentsPathForTransferReport(prefarId, docId).subscribe(r => {
      if (!!r) {
        var path = r;
        var fileNames = path.split('|');
        var FileName = fileNames[1];

        var path1 = this.SessionCompanyId + "/Transfer/" + FileName;
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

  GetRetireIcon(value, type) {
    
    var groupdata = value;
    var fileNames = groupdata.split('/');

    var MergeId = fileNames[0];
    var prefarid = fileNames[1];
    var PreHistoryId = fileNames[2];
    var ADDL_Tag = fileNames[3];
    var SplitType = fileNames[4];

    if (type == 'Retired') {
          if (PreHistoryId === "9" || PreHistoryId === "Retired") {
            return true;
          }
          else {
            return false;
          }
    }
    if (type == 'Quantity') {
          if (PreHistoryId === "9" || PreHistoryId === "Retired") {
            return false;
          }
          else if (SplitType == "Quantity") {
            return true;
          }
          else {
            return false;
          }
    }
    if (type == 'Parent') {
        if (PreHistoryId === "9" || PreHistoryId === "Retired") {
          return false;
        } else if ((MergeId != "0" && MergeId != null) && (prefarid === MergeId)) {
          return true;
        }
        else if ((ADDL_Tag != "0" && ADDL_Tag != null) && (MergeId === null || MergeId === 0) && (prefarid === ADDL_Tag)) {
          return true;
        }
        else {
          return false;
        }
    }
    if (type == 'Group') {
        if (PreHistoryId === "9" || PreHistoryId === "Retired") {

        }
        else if ((MergeId != "0" && MergeId != null) && (prefarid != MergeId)) {
          return true;
        }
        else if ((ADDL_Tag != "0" && ADDL_Tag != null) && (MergeId === null || MergeId === 0) && (prefarid != ADDL_Tag)) {
          return true;
        }
        else {
          return false;
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
