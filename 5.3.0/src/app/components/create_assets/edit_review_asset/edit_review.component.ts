import { Component, OnInit, ViewChild, Inject, ViewEncapsulation, EventEmitter, Output, VERSION, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup, FormGroupDirective, NgForm, FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from "@angular/router";
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { take, takeUntil } from 'rxjs/operators';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { AddCommentDialogComponent } from '../edit_review_asset/add-comment-dialog/add-comment-dialog.component';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { DatePipe } from '@angular/common';
import { default as _rollupMoment } from "moment";
import { map, startWith } from 'rxjs/operators';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { getMatIconFailedToSanitizeLiteralError } from '@angular/material/icon';
import { CostCenterService } from 'app/components/services/CostCenterService';
import { ApplicationTypeService } from 'app/components/services/ApplicationTypeService';
import { ModelService } from 'app/components/services/ModelService';
import { OperatingSystemService } from 'app/components/services/OperatingSystemService';
import { CpuClassService } from 'app/components/services/CpuClassService';
import { CpuSubClassService } from 'app/components/services/CpuSubClassService';
import { CompanyService } from 'app/components/services/CompanyService';
import { ManufacturerService } from 'app/components/services/ManufacturerService';
import { UserMappingService } from 'app/components/services/UserMappingService';
import { UploadService } from 'app/components/services/UploadService';
import { AssetService } from 'app/components/services/AssetService';
import { CompanyRackService } from 'app/components/services/CompanyRackService';
import { LocalStoreService } from 'app/shared/services/local-store.service';
import { ITAssetsService } from 'app/components/services/ITAssetsService';
import { UserService } from 'app/components/services/UserService';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { CompanyBlockService } from 'app/components/services/CompanyBlockService';
import { ReconciliationService } from 'app/components/services/ReconciliationService';
import { GroupService } from 'app/components/services/GroupService';
import { CompanyLocationService } from '../../services/CompanyLocationService';
import { AllPathService } from '../../services/AllPathServices';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ErrorStateMatcher } from '@angular/material/core';
import { FileUploader } from 'ng2-file-upload';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return (control && control.invalid);
  }
}

@Component({
  selector: 'app-editreview',
  templateUrl: './edit_review.component.html',
  styleUrls: ['./edit_review.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class EditReviewComponent implements OnInit {

  header: any ;
  message: any ;
  submitted: boolean = false;
  public arrlength = 0;
  public getselectedData: any[] = [];
  public newdataSource = [];
  public isallchk: boolean;

  public AssetInfo: FormGroup;
  //public HardwareInfo: FormGroup;
  public Download: FormGroup;
  //public CostForm: FormGroup;
  // public Maintenance: FormGroup;
  public OtherInfo: FormGroup;
  // public InventoryInfo: FormGroup;
  public showSubLocation = true;
  public showAssetType = true;
  public showAssetSubType = true;
  public allMappedRackListData: any[] = [];
  public CId: Number;
  public GId: Number;
  public TId: Number;
  public UId: Number;
  public GRNRequired;
  public UploaddocsData: any[] = [];
  public AssetConditionData: any[] = [];
  public AssetCriticalityData: any[] = [];
  public locationData: any[] = [];
  public allLocationData: any[] = [];
  public CostCenterData: any[] = [];
  public allUsersBlocksData: any;
  public allSupplierData: any[] = [];
  public allSubtypeData: any[] = [];
  public blocksofAssetData: any[] = [];
  public OsData: any[] = [];
  public CPUClassData: any[] = [];
  public CPUSubClassData: any[] = [];
  public ApplicationTypeData: any[] = [];
  public ModelData: any[] = [];
  public ManufacturerData: any[] = [];
  public CreateOtherinfoData: any;
  public DownloadInfoData: any;
  public hardwareinfodata: any;
  public typeId: any;
  public blockId: any;
  public selectedIndex;
  public showSublocation = true;
  public showAssetCategory = true;
  public disabledField: boolean = false;
  public disabledEditField: boolean = true;
  public disabledAssetId: boolean = true;
  public allAssetTypeData: any[] = [];
  public plantData: any[] = [];
  public assetClassData: any[] = [];
  public CategoryData: any[] = [];
  public GRNMandatoryFields: any[] = [];
  public CreateAssetData: any;
  public costData: any;
  list: any[] = [];
  public getApproveValue: any;
  selectedfile :any;
  public UOMData: any[] = [];
  public IsInventoryIndicator: boolean = false;

  get f1() { return this.AssetInfo.controls; };
  //get f2() { return this.InventoryInfo.controls };
  //get f3() { return this.Maintenance.controls; };
  get f4() { return this.OtherInfo.controls; }
  get f5() { return this.Download.controls; }
  //get f6() { return this.HardwareInfo.controls; }

  matcher = new MyErrorStateMatcher();


  @Output() capitlizationDate: EventEmitter<any> = new EventEmitter<any>();
  @Output() assetexpiryDate: EventEmitter<any> = new EventEmitter<any>();
  @Output() depnrunDate: EventEmitter<any> = new EventEmitter<any>();
  @Output() insuranceStartDate: EventEmitter<any> = new EventEmitter<any>();
  @Output() insuranceEndDate: EventEmitter<any> = new EventEmitter<any>();
  @Output() AMCStartDate: EventEmitter<any> = new EventEmitter<any>();
  @Output() AMCEndDate: EventEmitter<any> = new EventEmitter<any>();
  @Output() warrantyStartDate: EventEmitter<any> = new EventEmitter<any>();
  @Output() warrantyEndDate: EventEmitter<any> = new EventEmitter<any>();
  @Output() GRNDate: EventEmitter<any> = new EventEmitter<any>();

  @Output() GetSelectedValue: EventEmitter<any> = new EventEmitter<any>();

  protected _onDestroy = new Subject<void>();

  public requiredValidator = [
    Validators.required
  ]

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('selectedFile') selectedFile: any;
  public uploader: FileUploader = new FileUploader({ isHTML5: true });
  uploaders :any[] = [];
  // protected _onDestroy = new Subject<void>();

  public filteredUOM: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredAssetCondition: ReplaySubject<any[]> = new ReplaySubject<any[]>(2);
  public filteredAssetCriticality: ReplaySubject<any[]> = new ReplaySubject<any[]>(3);

  public filteredCostCenter: ReplaySubject<any[]> = new ReplaySubject<any[]>(4);

  public filteredVendor: ReplaySubject<any[]> = new ReplaySubject<any[]>(5);
  public filteredAssetSubtype: ReplaySubject<any[]> = new ReplaySubject<any[]>(6);
  public filteredAssetType: ReplaySubject<any[]> = new ReplaySubject<any[]>(7);
  public filteredPlant: ReplaySubject<any[]> = new ReplaySubject<any[]>(8);
  public filteredSubLocation: ReplaySubject<any[]> = new ReplaySubject<any[]>(9);
  public filteredAssetClass: ReplaySubject<any[]> = new ReplaySubject<any[]>(10);
  public filteredAssetCategory: ReplaySubject<any[]> = new ReplaySubject<any[]>(11);

  public filteredUpload: ReplaySubject<any[]> = new ReplaySubject<any[]>(12);
  public filteredOperatingSystemName: ReplaySubject<any[]> = new ReplaySubject<any[]>(13);
  public filteredCPUClass: ReplaySubject<any[]> = new ReplaySubject<any[]>(15);
  public filteredCPUsubClass: ReplaySubject<any[]> = new ReplaySubject<any[]>(16);
  public filteredApplicationType: ReplaySubject<any[]> = new ReplaySubject<any[]>(17);
  public filteredModel: ReplaySubject<any[]> = new ReplaySubject<any[]>(18);
  public filteredManufacturer: ReplaySubject<any[]> = new ReplaySubject<any[]>(19);


  numericPattern = "^[0-9]*$";
  decimalNumericPattern = "^-?[0-9]\\d*(\\.\\d{1,3})?$";
  residualValuePattern = "^[0-9]+(\.[0-9]{1,2})*$";
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  today = new Date();
  displayedColumns: string[] = ['DocumentType', 'DocumentName', 'ViewDocument', 'DeleteDocument'];
  datasource = new MatTableDataSource();
  uploadAssetData: any;
  // public selectedIndex;

  Approve: any;
  Reject: any;

  GroupId: any;
  RegionId: any;
  UserId: any;
  CompanyId: any;

  displayedUploadHeaders = [];

  displayedHardwareInfoHeaders = [];

  rowData: any;
  constructor(private router: Router, public dialog: MatDialog,
    public toastr: ToastrService,
    public fb: FormBuilder,
    public route: ActivatedRoute,
    public datepipe: DatePipe,
    public applicationTypeService: ApplicationTypeService,
    public assetservice: AssetService,
    public groupservice: GroupService,
    public costcenterservice: CostCenterService,
    public modelservice: ModelService,
    public cpuclassservice: CpuClassService,
    public cpusubclassservice: CpuSubClassService,
    public companyservice: CompanyService,
    public operatingsystemservice: OperatingSystemService,
    public manufacturerservice: ManufacturerService,
    public usermappingservice: UserMappingService,
    public uploadservice: UploadService,
    public companyrackservice: CompanyRackService,
    public localService: LocalStoreService,
    public ITassetservice: ITAssetsService,
    public assetsService: AssetService,
    public confirmService: AppConfirmService,
    public loader: AppLoaderService,
    public messageAlertService: MessageAlertService,
    public userDataService: UserService,
    public storage: ManagerService,
    public companyBlockService: CompanyBlockService,
    public reconciliationService: ReconciliationService,
    public companyLocationService: CompanyLocationService,
    public AllPath: AllPathService,
    private jwtAuth: JwtAuthService,
    private ls: LocalStoreService) {
      this.header = this.jwtAuth.getHeaders();
      this.message = this.jwtAuth.getResources();
      
      this.displayedUploadHeaders = [this.header.DocumentType, this.header.uploadFile];
      this.displayedHardwareInfoHeaders = [this.header.OperatingSystem, this.header.CpuClass, this.header.CpuSubClass, this.header.ApplicationType,
        this.header.Model, this.header.Manufacturer, this.header.HostName, this.header.HDD, this.header.RAM]

      this.rowData = this.router.getCurrentNavigation().extras.state;
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

  nextStep(i) {
    this.selectedIndex = i;
  }
  previousStep(i) {
    this.selectedIndex = i;
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.nextStep(tabChangeEvent.index);
    this.previousStep(tabChangeEvent.index);
  }
  PageSession="PageSession"
  PageData: any;
  public onBack() {
    this.PageData = this.ls.getItem(this.PageSession);
    this.title = this.PageData.Pagename;
     if (this.title == "Edit Asset"){
      this.router.navigateByUrl('h1/b');
    }
    else {
      this.router.navigateByUrl('h1/c');
    }
  }

  EditGetData: any;
  title: any;
  PageId: any;
  fileextlist:any[];
  AssetInfoTab : any;
  ngOnInit() {

    if (!!this.rowData) {

      this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
      this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
      this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
      this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
      
      var AssetId = this.rowData.AssetId;
      var pagename = this.rowData.pagename;        
      if (pagename == "editasset") {
        this.PageId = 21;     
        this.title="Edit"; 
        this.AssetInfoTab = "Edit Asset View";          
      }
      else{
        this.PageId = 22; 
        this.AssetInfoTab = "Review Asset View";
        this.title="Review Asset View"; 
      }
      if (AssetId.startsWith('GRN')) {
        //this.GetMandatoryByFlag('GRN');       
        //this.PageId = 19;
        this.disabledAssetId = true;
        this.GetFieldListByPageId('GRN');
      }
      else if (AssetId.startsWith('NFAR')) {
        //this.GetMandatoryByFlag('NFAR');
        //this.PageId = 19;
        this.disabledAssetId = true;
        this.GetFieldListByPageId('NFAR');
      }
      else {
        //this.GetMandatoryByFlag('FAR');
        //this.PageId = 18;
        this.disabledAssetId = false;
        this.GetFieldListByPageId('FAR');
      }
      var FunctionId = 6;
      this.uploadservice.GetAllowedExtensions(FunctionId).subscribe(response => {         
        this.fileextlist =response;  
      })
      
      

      this.AssetInfo = this.fb.group({
        SubAssetId: [''],
        AssetId: [''],
        Quantity: ['', [Validators.pattern(this.decimalNumericPattern)]],
        Unit: [''],
        uomFilter: [''],
        AcquisitionDate: [''],
        GRNNo: [''],
        PONumber: ['', [Validators.maxLength(50)]],
        InvoiceNo: ['', [Validators.maxLength(45)]],
        SerialNo: ['', [Validators.maxLength(30)]],
        ITSerialNo: ['', [Validators.maxLength(50)]],
        equipmentNo: ['', [Validators.maxLength(20)]],
        Location: [''],
        plantFilter: [''],
        Rack: [''],
        subLocationFilter: [''],
        Room: ['', [Validators.maxLength(250)]],
        costCenterFilter: [''],
        AssetCriticality: [''],
        assetcricalityFilter: [''],
        BlockOfAsset: [''],
        AssetClassFilter: [''],
        CategoryName: [''],
        categoryFilter: [''],
        typeOfAsset: [''],
        assettypeFilter: [''],
        subTypeOfAsset: [''],
        assetsubtypeFilter: [''],
        ADL2: ['', [Validators.maxLength(250)]],
        ADL3: ['', [Validators.maxLength(250)]],
        Suplier: [''],
        vendorFilter: [''],
        UsefulLife: ['', [Validators.maxLength(6),Validators.pattern(this.decimalNumericPattern)]],
        ExpiryDate: [''],
        AssetCondition: [''],
        assetconditionFilter: [''],
        UserEmailId: ['', [Validators.minLength(2), Validators.maxLength(100)]],
        Custodian: ['', [Validators.minLength(2), Validators.maxLength(100)]],
        AcquisitionCost: ['', [Validators.maxLength(17), Validators.pattern(this.decimalNumericPattern)]],
        WDV: ['', [Validators.maxLength(17), Validators.pattern(this.decimalNumericPattern)]],
        WDVDate: [''],
        InventoryNo: [''],
        //SerialNo: [''],
        sublocation: [''],
        Building: [''],
        //ITSerialNo: [''],
        InventoryIndicator: [''],
        LabelSize: [''],
        LabelMaterial: [''],
        InsuranceFrom: [''],
        InsuranceTo: [''],
        InsuranceVendor: [''],
        AMCStartDate: [''],
        AMCExpiryDate: [''],
        AMCVendor: [''],
        WarrantyExpiryDate: [''],
        InstallationDate: [''],
        WarrantyPeriod: ['', Validators.maxLength(30)],
        WarrantyCost: ['', [Validators.maxLength(30), Validators.pattern(this.decimalNumericPattern)]],
        WarrantyTerms: ['', Validators.maxLength(30)],
        WarrantyRemarks: ['', Validators.maxLength(30)],
        OperatingSystem: [''],
        CPUClass: [''],
        CPUSubClass: [''],
        ApplicationType: [''],
        Model: [''],
        Manufacturer: [''],
        HostName: [''],
        HDD: [''],
        RAM: [''],
        OperatingSystemFilter: [''],
        ManufacturerFilter: [''],
        CPUClassDataFilter: [''],
        ApplicationDataFilter: [''],
        ModelDataFilter: [''],
        CPUClasssubDataFilter: [''],
        GRNDate: [''],
        AmortizationStartDate: [''],
        AmortizeNBV: [''],
      });

      
      this.OtherInfo = this.fb.group({
        IsMetal: [''],
        CPPNumber: [''],
        AMCComment: [''],
        Budget: [''],
        GRNDate: [''],
        Description: [''],
        Remark: [''],
        AccountingStatus: [''],
        Division: [''],
        ExpenseAccount: [''],
        CostAccount: [''],
        ReverseAccount: [''],
        Department: [''],
        Area: [''],
        Merchandise: [''],
        InterCompany: [''],
        ServiceProvider: [''],
        AccumulatedDepreciation: [''],
        Class: [''],
        Loc2: [''],
        Loc3: [''],
        Loc4: [''],
        Loc5: [''],
        FutureUse: [''],
        InterUnit: [''],
        AccountClearing: [''],
        DepartmentClearing: [''],
        Comments: [''],
        Upl: [''],
        DepreciationReserve: [''],
        Project: [''],
        AmortizationStartDate: [''],
        AmortizeNBV: [''],
        LifeInMonths: [''],
        Messages: [''],
      })
      this.Download = this.fb.group({
        DocumentType: [''],
        FileUpload: [''],
        UploadFilter: [''],
      })
      

      this.GetCategoryAndLocationList();
      this.GetBlocksOfAssets();
      this.GetData1();
      this.GetData();
      this.custodianFilter();
      this.userFilter();
      this.GetEmpEmailList();
      this.GetAllUploadDoc();
      this.CheckWetherClientCustomizationConfi();
      this.CheckWetherUsefulLifeConfigExits();

    }
    else {
      this.onBack();
    }
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  ListOfField: any[] = [];
  displayedColumns1: any[] = [];
  mandatoryFields: any[] = [];
  editableFields: any[] = [];
  GetFieldListByPageId(flag){
    debugger;
    this.groupservice.GetFieldListByPageId(this.PageId,this.UserId,this.CompanyId).subscribe(r => {
      debugger;
      this.ListOfField = JSON.parse(r);
      console.log(this.ListOfField);
      if (flag == 'GRN') {
        this.displayedColumns1 = this.ListOfField.filter(x => x).map(choice => choice.Custom1);
        this.mandatoryFields = this.ListOfField.filter(x => x.MandetoryGrn == true).map(choice => choice.Custom1);
        this.editableFields = this.ListOfField.filter(x => x.Editable == true).map(choice => choice.Custom1);
      }
      if (flag == 'NFAR') {
        this.displayedColumns1 = this.ListOfField.filter(x => x).map(choice => choice.Custom1);
        this.mandatoryFields = this.ListOfField.filter(x => x.MandetoryNonFar == true).map(choice => choice.Custom1);
        this.editableFields = this.ListOfField.filter(x => x.Editable == true).map(choice => choice.Custom1);
      }
      if (flag == 'FAR') {
        this.displayedColumns1 = this.ListOfField.filter(x => x).map(choice => choice.Custom1);
        this.mandatoryFields = this.ListOfField.filter(x => x.MandetoryFar == true).map(choice => choice.Custom1);
        this.editableFields = this.ListOfField.filter(x => x.Editable == true).map(choice => choice.Custom1);
      }

      console.log(this.displayedColumns1);
      console.log(this.mandatoryFields);
      console.log(this.editableFields);

      this.mandatoryFields.forEach(val => {
        if (!!this.AssetInfo.controls[val]) {
          if (val == 'AssetId' || val == 'GRNNo' || val == 'Room' || val == 'ADL2' || val == 'ADL3' || val == 'PONumber' || val == 'InvoiceNo' || val == 'SerialNo' || val == 'ITSerialNo' || val == 'equipmentNo') {
            this.AssetInfo.controls[val].setValidators([Validators.required, this.noWhitespaceValidator]);
          }
          else {
            this.AssetInfo.controls[val].setValidators([Validators.required]);
          }
        }
      })
    })
  }
  // Comment this method by shailesh
  GetMandatoryByFlag(flag) {
     
    this.groupservice.GetMandatoryByFlag(flag).subscribe((response) => {
       
      this.ListOfField = response;
      console.log(this.ListOfField);
      if (flag == 'GRN') {
        this.displayedColumns1 = this.ListOfField.filter(x => x.GRN == true).map(choice => choice.FieldsName);
        this.mandatoryFields = this.ListOfField.filter(x => x.GRNMandatory == true).map(choice => choice.FieldsName);
        this.editableFields = this.ListOfField.filter(x => x.Editable == true).map(choice => choice.FieldsName);
      }
      if (flag == 'NFAR') {
        this.displayedColumns1 = this.ListOfField.filter(x => x.NONFAR == true).map(choice => choice.FieldsName);
        this.mandatoryFields = this.ListOfField.filter(x => x.NonFarMandatory == true).map(choice => choice.FieldsName);
        this.editableFields = this.ListOfField.filter(x => x.Editable == true).map(choice => choice.FieldsName);
      }
      if (flag == 'FAR') {
        this.displayedColumns1 = this.ListOfField.filter(x => x.FAR == true).map(choice => choice.FieldsName);
        this.mandatoryFields = this.ListOfField.filter(x => x.FarManadatory == true).map(choice => choice.FieldsName);
        this.editableFields = this.ListOfField.filter(x => x.Editable == true).map(choice => choice.FieldsName);
      }

      console.log(this.displayedColumns1);
      console.log(this.mandatoryFields);
      console.log(this.editableFields);

      this.mandatoryFields.forEach(val => {

        if (!!this.AssetInfo.controls[val]) {
          if (val == 'AssetId' || val == 'GRNNo' || val == 'Room' || val == 'ADL2' || val == 'ADL3' || val == 'PONumber' || val == 'InvoiceNo' || val == 'SerialNo' || val == 'ITSerialNo' || val == 'equipmentNo') {
            this.AssetInfo.controls[val].setValidators([Validators.required, this.noWhitespaceValidator]);
          }
          else {
            this.AssetInfo.controls[val].setValidators([Validators.required]);
          }
        }
        // else if (!!this.Maintenance.controls[val]) {
        //   this.Maintenance.controls[val].setValidators([Validators.required]);
        // }
        // else if (!!this.OtherInfo.controls[val]) {
        //   this.OtherInfo.controls[val].setValidators([Validators.required]);
        // }
        // else if (!!this.HardwareInfo.controls[val]) {
        //   this.HardwareInfo.controls[val].setValidators([Validators.required]);
        // }
        // else {
        // }
      })
    });
  }

  viewpath(item) {
     
    var path = item.DocumentPath.split('uploads')
    this.AllPath.ViewDocument(path[1]);
  }

  GetData() {
    this.loader.open();
    var CId = this.CompanyId;
    var GId = this.GroupId;
    let url1 = this.cpuclassservice.GetAllCPUClassList(CId, GId);
    let url2 = this.cpusubclassservice.GetAllCPUSubClassList(CId, GId);
    let url3 = this.applicationTypeService.GetAllApplicationTypeList(CId, GId);
    let url4 = this.modelservice.GetAllModelList(CId, GId);
    let url5 = this.manufacturerservice.GetAllManufactureList(CId, GId);
    let url6 = this.operatingsystemservice.GetAllOperatingSystemList(CId, GId);
    let url7 = this.assetservice.GetAssetConditionList();
    forkJoin([url1, url2, url3, url4, url5, url6, url7]).subscribe(results => {
      if (!!results[0]) {
        this.CPUClassData = JSON.parse(results[0]);
        this.getFilterCPUClass();
      }
      if (!!results[1]) {
        this.CPUSubClassData = JSON.parse(results[1]);
        this.getFilterCPUsubClass();
      }
      if (!!results[2]) {
        this.ApplicationTypeData = JSON.parse(results[2]);
        this.getFilterApplicationType();
      }
      if (!!results[3]) {
        this.ModelData = JSON.parse(results[3]);
        this.getFilterModel();
      }
      if (!!results[4]) {
        this.ManufacturerData = JSON.parse(results[4]);
        this.getFilterManufacturer();
      }
      if (!!results[5]) {
        this.OsData = JSON.parse(results[5]);
        this.getFilterOperatingSystemName();
      }
      if (!!results[6]) {
        this.AssetConditionData = JSON.parse(results[6]);
        this.getFilterAssetCondition();
      }

      if (!!this.rowData) {
         
        var prefarId = this.rowData.PreFarId;
        this.getEditData(prefarId);
        var pagename = this.rowData.pagename;
        this.UploadStatus = !!this.rowData.UploadStatus ? this.rowData.UploadStatus : 0;
        this.disabledField = false;
        this.title = "Review";
        if (pagename == "editasset") {
          this.title = "Edit";
          this.disabledField = true;
        }
      }

    })
  }
  UploadStatus: any;
  allMappedRackList: any[] = [];
  GetData1() {

    let url1 = this.groupservice.GetAllGRNAssetData();
    let url2 = this.groupservice.GetAllUOMData();
    let url3 = this.companyrackservice.GetMappedRackListWithRackName(this.CompanyId);
    let url4 = this.costcenterservice.GetAllCostsCenterList(this.CompanyId, this.GroupId);
    let url5 = this.assetservice.GetAllSupplierListData(this.CompanyId, this.GroupId);
    let url6 = this.assetservice.GetAssetCriticalityList();
    forkJoin([url1, url2, url3, url4, url5, url6]).subscribe(results => {

      if (!!results[0]) {
        this.GRNMandatoryFields = results[0];
      }
      if (!!results[1]) {
        this.UOMData = JSON.parse(results[1]);
        this.getFilterUOM();
      }
      if (!!results[2]) {
        this.allMappedRackList = results[2];
        this.allMappedRackListData = results[2];
        this.getFilterSubLocation();
      }
      if (!!results[3]) {
        this.CostCenterData = JSON.parse(results[3]);
        this.getFilterCostCenter();
      }
      if (!!results[4]) {
        this.allSupplierData = JSON.parse(results[4]);
        this.getFilterVendors();
      }
      if (!!results[5]) {
        this.AssetCriticalityData = JSON.parse(results[5]);
        this.getFilterAssetCriticality();
      }
    })
  }
  GetBlocksOfAssets() {
    this.CId = this.CompanyId;
    this.groupservice.BlocksOfAssetsGetByCompanyId(this.CId).subscribe(response => {
      if (response) {
        this.blocksofAssetData = response;
        this.AssetClassData = [];
        if (this.blocksofAssetData.length > 0) {
          this.blocksofAssetData.forEach(element => {
            this.AssetClassData.push(element);
          })
        }
        this.getFilteredAssetClass();
      }
    })
  }
  LocationList = [];
  CategoryList = [];
  AllCategoryList: any[] = [];
  GetCategoryAndLocationList() {
     
    let url1 = this.companyLocationService.GetLocationListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, this.PageId);
    let url2 = this.companyBlockService.GetCategoryListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, this.PageId);

    forkJoin([url1, url2]).subscribe(results => {
      
      if (!!results[0]) {
        this.LocationList = JSON.parse(results[0]);
        this.getFilterPlant();
      }
      if (!!results[1]) {
        this.AllCategoryList = JSON.parse(results[1]);
      }
    })
  }
  ClientCustmizationExits: any;
  CheckWetherClientCustomizationConfi() {
    var GroupId = this.GroupId;
    this.groupservice.CheckWetherConfigurationExistForClientCust(GroupId, 16)
      .subscribe(response => {
        this.ClientCustmizationExits = response;
      })
  }
  isusefulLife: any;
  CheckWetherUsefulLifeConfigExits() {
    var GroupId = this.GroupId;
    this.groupservice.CheckWetherConfigurationExist(GroupId, 3)
      .subscribe(r => {
        if (r == true) {
          this.isusefulLife = "Year";
        }
        else {
          this.isusefulLife = "Month";
        }
      })
  }
  IsAgentUsedOrNot: any;
  CheckWetherConfigurationExistIsAgentUsedOrNot() {
    var GroupId = this.GroupId;
    this.groupservice.CheckWetherConfigurationExistIsAgentUsedOrNot(GroupId, 21)
      .subscribe(response => {
        if (response) {
          if (response == true) {
            this.IsAgentUsedOrNot = true;
          }
          else {
            this.IsAgentUsedOrNot = false;
          }
        }
      })
  }
  UomValueSelected: any;
  LocationValueSelected: any;
  StorageLocationValueSelected: any;
  CostCenterValueSelected: any;
  AssetCriticalityValueSelected: any;
  CategoryListValueSelected: any;
  AssetClassValueSelected: any;
  TypeOfAssetValueSelected: any;
  SubTypeOfAssetValueSelected: any;
  SuplierValueSelected: any;
  assetconditionValueSelected: any;
  CustodianValueSelected: any;
  UserValueSelected: any;
  editAssetInfo: any;
  ClientCustData = [];
  ClientCustHeader = [];
  AssetList: any;
  AssetListHeader: any;
  PreperchasedList: any;
  ClientCust = [];
  formattedArr = [];
  disableOtherInfo: boolean = false;
  MandatoryOtherInfo: boolean = false;
  getEditData(prefarId) {
    this.assetservice.GetAssetById2(prefarId)
      .subscribe(r => {
        
        this.loader.close();
        this.ClientCustData = [];
        this.ClientCustHeader = [];
        var AllData = JSON.parse(r);
        this.editAssetInfo = JSON.parse(r);
        console.log(this.editAssetInfo);
        //============ other info data binding ===========
        this.AssetList = AllData.AssetList;
        this.AssetListHeader = AllData.AssetListHeader;
        if (this.AssetList != "[null]") {
          this.ClientCustData = JSON.parse(this.AssetList);
        }
        this.ClientCustHeader = JSON.parse(this.AssetListHeader);
        console.log("ClientCustHeader", this.ClientCustHeader);
        this.ClientCust = [];
        var ClientCustColumnname = ['CPPNumber', 'AMCComment', 'ServiceProvider', 'Remark', 'Class', 'AccountingStatus', 'Division','ExpenseAccount','CostAccount','ReserveAccount','Department','Area','Merchandise','Loc2','Loc3','Loc4','Loc5','Account_Clearing','Department_Clearing','GRNDate','InterCompany','AccumulatedDepreciation',
        'Description','FutureUse','InterUnit','DepreciationReserve','AmortizationStartDate','AmortizeNBV','IsMetal','Budget','Comments','Upl','Messages','Project']
        this.formattedArr = [];
        if (this.ClientCustData.length > 0) {          
          // this.ClientCustData[0].forEach((k, v) => {  
          // })
          this.ClientCustHeader.forEach((c) => {
            var val = null;
            if (!!this.ClientCustData[0][c.Columnname]) {
              val = this.ClientCustData[0][c.Columnname];
              // if (c.Description == "date") {
              //   val = !!val ? this.datepipe.transform(val, 'dd-MMM-yyyy') : "";
              // }
            }            
            if (ClientCustColumnname.indexOf(c.Columnname) > -1 && this.displayedColumns1.indexOf(c.Columnname) > -1) {
              var final = {
                Columnname: c.Columnname,
                DisplayName: c.DisplayName,
                Description: c.Description,
                CustomLength: c.CustomLength,
                IsEditable: c.IsEditable,
                IsActiveInEditAsset: c.IsActiveInEditAsset,
                IsDetailShow: c.IsDetailShow,
                Value: val
              }

              this.formattedArr.push(final);
               
              if (this.mandatoryFields.indexOf(c.Columnname) > -1) {
                this.MandatoryOtherInfo = true;
                this.disableOtherInfo = true;
              }
              if (!!val) {
                this.getheaderValues(final, val);
              }
            }
          })
        }
        else {
           
          this.ClientCustHeader.forEach((c) => {
            if (ClientCustColumnname.indexOf(c.Columnname) > -1 && this.displayedColumns1.indexOf(c.Columnname) > -1) {
              var final = {
                Columnname: c.Columnname,
                DisplayName: c.DisplayName,
                Description: c.Description,
                CustomLength: c.CustomLength,
                IsEditable: c.IsEditable,
                IsActiveInEditAsset: c.IsActiveInEditAsset,
                IsDetailShow: c.IsDetailShow,
                Value: null
              }

              this.formattedArr.push(final);
            }
          });
        }
         
        this.ClientCust = this.formattedArr;
        console.log('ClientCust', this.ClientCust);
        
        //============ Hardware info data binding ===========
        this.PreperchasedList = JSON.parse(this.editAssetInfo.PreperchasedList);
        if (this.PreperchasedList.length > 0) {

          var OperatingSystem = !this.PreperchasedList[0].OperatingSystem ? "" : this.PreperchasedList[0].OperatingSystem;
          this.AssetInfo.controls['OperatingSystem'].setValue(OperatingSystem);
          this.OsData.forEach((val) => {
            if (val.OperatingSystemName.toLowerCase() == OperatingSystem.toLowerCase()) {
              this.AssetInfo.controls['OperatingSystem'].setValue(val);
            }
          })
          var CPUClass = !this.PreperchasedList[0].CPUClass ? "" : this.PreperchasedList[0].CPUClass;
          this.AssetInfo.controls['CPUClass'].setValue(CPUClass);
          this.CPUClassData.forEach((val) => {
            if (val.CpuClassName.toLowerCase() == CPUClass.toLowerCase()) {
              this.AssetInfo.controls['CPUClass'].setValue(val);
            }
          })
          var CPUSubClass = !this.PreperchasedList[0].CPUSubClass ? "" : this.PreperchasedList[0].CPUSubClass;
          this.AssetInfo.controls['CPUSubClass'].setValue(CPUSubClass);
          this.CPUSubClassData.forEach((val) => {
            if (val.CpuSubClassName.toLowerCase() == CPUSubClass.toLowerCase()) {
              this.AssetInfo.controls['CPUSubClass'].setValue(val);
            }
          })
          var ApplicationType = !this.PreperchasedList[0].ApplicationType ? "" : this.PreperchasedList[0].ApplicationType;
          this.AssetInfo.controls['ApplicationType'].setValue(ApplicationType);
          this.ApplicationTypeData.forEach((val) => {
            if (val.ApplicationTypeName.toLowerCase() == ApplicationType.toLowerCase()) {
              this.AssetInfo.controls['ApplicationType'].setValue(val);
            }
          })
          var Model = !this.PreperchasedList[0].Model ? "" : this.PreperchasedList[0].Model;
          this.AssetInfo.controls['Model'].setValue(Model);
          this.ModelData.forEach((val) => {
            if (val.ModelName.toLowerCase() == Model.toLowerCase()) {
              this.AssetInfo.controls['Model'].setValue(val);
            }
          })
          var Manufacturer = !this.PreperchasedList[0].Manufacturer ? "" : this.PreperchasedList[0].Manufacturer;
          this.AssetInfo.controls['Manufacturer'].setValue(Manufacturer);
          this.ManufacturerData.forEach((val) => {
            if (val.ManufacturerName.toLowerCase() == Manufacturer.toLowerCase()) {
              this.AssetInfo.controls['Manufacturer'].setValue(val);
            }
          })
          var HostName = !this.PreperchasedList[0].HostName ? "" : this.PreperchasedList[0].HostName;
          this.AssetInfo.controls['HostName'].setValue(HostName);
          var HDD = !this.PreperchasedList[0].HDD ? "" : this.PreperchasedList[0].HDD;
          this.AssetInfo.controls['HDD'].setValue(HDD);
          var RAM = !this.PreperchasedList[0].RAM ? "" : this.PreperchasedList[0].RAM;
          this.AssetInfo.controls['RAM'].setValue(RAM);


        }
         
        //============ Asset info data binding ===========
        this.AssetInfo.controls['InventoryNo'].setValue(this.editAssetInfo.Barcode);
        this.AssetInfo.controls['AssetId'].setValue(this.editAssetInfo.AssetId);
        this.AssetInfo.controls['SubAssetId'].setValue(this.editAssetInfo.SubAssetId);

        this.AssetInfo.controls['Unit'].setValue("");
        this.UOMData.forEach((val) => {
          if (val.Unit_Name.toLowerCase() == this.editAssetInfo.Unit.toLowerCase()) {
            this.UomValueSelected = val;
            this.AssetInfo.controls['Unit'].setValue(val);
          }
        })
        this.AssetInfo.controls['AcquisitionCost'].setValue(this.editAssetInfo.AcquisitionCost);
        this.AssetInfo.controls['WDV'].setValue(this.editAssetInfo.WDV);
        var Quantity = Number(this.editAssetInfo.Quantity);
        this.AssetInfo.controls['Quantity'].setValue(Quantity);
        //var AcquisitionDate = this.datepipe.transform(this.editAssetInfo.AcquisitionDate, 'dd-MMM-yyyy');
        this.AssetInfo.controls['AcquisitionDate'].setValue(this.editAssetInfo.AcquisitionDate);
        this.AssetInfo.controls['WDVDate'].setValue(this.editAssetInfo.WDVDate);
        this.AssetInfo.controls['GRNNo'].setValue(this.editAssetInfo.GRNNo);
        this.AssetInfo.controls['PONumber'].setValue(this.editAssetInfo.PONumber);
        this.AssetInfo.controls['InvoiceNo'].setValue(this.editAssetInfo.InvoiceNo);
        this.AssetInfo.controls['SerialNo'].setValue(this.editAssetInfo.SerialNo);
        this.AssetInfo.controls['ITSerialNo'].setValue(this.editAssetInfo.ITSerialNo);
        this.AssetInfo.controls['equipmentNo'].setValue(this.editAssetInfo.equipmentNo);
        this.AssetInfo.controls['Location'].setValue("");
        if(!!this.editAssetInfo.Location){
        this.LocationList.forEach((val) => {
          if (val.LocationName.toLowerCase() == this.editAssetInfo.Location.toLowerCase()) {
            this.LocationValueSelected = val;
            this.bindSubLocation(val);
            this.AssetInfo.controls['Location'].setValue(val);
          }
        })
      }
        this.AssetInfo.controls['Rack'].setValue("");
        if(!!this.editAssetInfo.Rack){
        this.allMappedRackListData.forEach((val) => {
          if (val.RackName.toLowerCase() == this.editAssetInfo.Rack.toLowerCase()) {
            this.StorageLocationValueSelected = val;
            this.AssetInfo.controls['Rack'].setValue(val);
          }
        })
      }
        //  this.AssetInfo.controls['subLocationFilter'].setValue(this.editAssetInfo.Rack);    
        this.AssetInfo.controls['Room'].setValue(this.editAssetInfo.Room);
        this.AssetInfo.controls['Building'].setValue("")
        if(!!this.editAssetInfo.Building){
        this.CostCenterData.forEach((val) => {
          if (val.Description.toLowerCase() == this.editAssetInfo.Building.toLowerCase()) {
            this.CostCenterValueSelected = val;
            this.AssetInfo.controls['Building'].setValue(val)
          }
        })
      }

        this.AssetInfo.controls['AssetCriticality'].setValue("");
        if(!!this.editAssetInfo.AssetCriticality){
        this.AssetCriticalityData.forEach((val) => {
          if (val.AssetCriticality.toLowerCase() == this.editAssetInfo.AssetCriticality.toLowerCase()) {
            this.AssetCriticalityValueSelected = val;
            this.AssetInfo.controls['AssetCriticality'].setValue(val);
          }
        })
      }

        this.AssetInfo.controls['BlockOfAsset'].setValue("");
        if(!!this.editAssetInfo.BlockOfAsset){
        this.AssetClassData.forEach((val) => {
          if (val.BlockName.toLowerCase() == this.editAssetInfo.BlockOfAsset.toLowerCase()) {
            this.AssetClassValueSelected = val;
            this.AssetInfo.controls['BlockOfAsset'].setValue(val);
            this.SelectAssetClassId1(val);
          }
        })
      }
        this.AssetInfo.controls['CategoryName'].setValue("");
        if(!!this.editAssetInfo.CategoryName){
        this.CategoryList.forEach((val) => {
          if (val.AssetCategoryName.toLowerCase() == this.editAssetInfo.CategoryName.toLowerCase()) {
            this.CategoryListValueSelected = val;
            this.AssetInfo.controls['CategoryName'].setValue(val);
          }
        })
      }
        this.AssetInfo.controls['typeOfAsset'].setValue("");
        this.AssetInfo.controls['subTypeOfAsset'].setValue("");

        // this.showSublocation = true;
        this.GetAllAssetTypeData1(this.editAssetInfo.AssetCategoryId);
        this.showAssetSubType = true;
        this.GetAllAssetSubtypeData1(this.editAssetInfo.TAId);

        this.AssetInfo.controls['ADL2'].setValue(this.editAssetInfo.ADL2);
        this.AssetInfo.controls['ADL3'].setValue(this.editAssetInfo.ADL3);
        this.AssetInfo.controls['Suplier'].setValue("");
        this.allSupplierData.forEach((val) => {
          if (val.SupplierName.toLowerCase() == this.editAssetInfo.Suplier.toLowerCase()) {
            this.SuplierValueSelected = val;
            this.AssetInfo.controls['Suplier'].setValue(val);
          }
        })
         
        // this.AssetInfo.controls['UsefulLife'].setValue(this.data.name.UsefulLife),
        //var expiryDate = this.datepipe.transform(this.editAssetInfo.expiryDate, 'dd-MMM-yyyy');
         
        this.AssetInfo.controls['ExpiryDate'].setValue(this.editAssetInfo.expiryDate);
        this.AssetInfo.controls['AssetCondition'].setValue("");
        
        this.AssetConditionData.forEach((val) => {
          if (val.AssetCondition.toLowerCase() == this.editAssetInfo.AssetCondition.trim().toLowerCase()) {
            this.assetconditionValueSelected = val;
            this.AssetInfo.controls['AssetCondition'].setValue(val);
          }
        })
        if(!!this.editAssetInfo.UserDetails || !!this.editAssetInfo.UserEmailId || !!this.editAssetInfo.CustodianEmailId){
          this.AssetInfo.controls['UserEmailId'].setValue(this.editAssetInfo.UserEmailId);
          this.AssetInfo.controls['Custodian'].setValue(this.editAssetInfo.CustodianEmailId);
        }       

        //============ Inventory info data binding ===========
        this.AssetInfo.controls['InventoryNo'].setValue(this.editAssetInfo.Barcode);
        if (!!this.editAssetInfo.Barcode) {
          this.IsInventoryIndicator = true;
        }
         
        //this.InventoryInfo.controls['SerialNo'].setValue(this.editAssetInfo.SerialNo);
        //this.InventoryInfo.controls['Room'].setValue(this.editAssetInfo.Room);
        //this.InventoryInfo.controls['sublocation'].setValue(this.editAssetInfo.StorageLocation);
        // this.InventoryInfo.controls['CostCenter'].setValue(this.editAssetInfo.Building);
        this.AssetInfo.controls['Building'].setValue("")
        this.CostCenterData.forEach((val) => {
          if (val.Description.toLowerCase() == this.editAssetInfo.Building.toLowerCase()) {
            this.CostCenterValueSelected = val;
            this.AssetInfo.controls['Building'].setValue(val)
          }
        })
        
        //this.InventoryInfo.controls['ITSerialNo'].setValue(this.editAssetInfo.ITSerialNo);
        this.AssetInfo.controls['InventoryIndicator'].setValue(this.editAssetInfo.Taggable);
        this.AssetInfo.controls['LabelSize'].setValue(this.editAssetInfo.LabelSize);
        this.AssetInfo.controls['LabelMaterial'].setValue(this.editAssetInfo.LabelMaterial);
         
        //============ Maintenance info data binding ===========
        this.AssetInfo.controls['InsuranceFrom'].setValue(this.editAssetInfo.InsuranceFrom);
        this.AssetInfo.controls['InsuranceTo'].setValue(this.editAssetInfo.InsuranceTo);
        this.AssetInfo.controls['InsuranceVendor'].setValue(this.editAssetInfo.InsuranceVendor);
        this.AssetInfo.controls['AMCStartDate'].setValue(this.editAssetInfo.AMCStartDate);
        this.changeAMCStartDate("");
        this.AssetInfo.controls['AMCExpiryDate'].setValue(this.editAssetInfo.AMCExpiryDate);
        this.AssetInfo.controls['AMCVendor'].setValue(this.editAssetInfo.AMCVendor);
        this.AssetInfo.controls['InstallationDate'].setValue(this.editAssetInfo.InstallationDate);
        this.changeWarrantyStartDate();
        this.AssetInfo.controls['WarrantyExpiryDate'].setValue(this.editAssetInfo.WarrantyExpiryDate);
        this.AssetInfo.controls['WarrantyPeriod'].setValue(this.editAssetInfo.WarrantyPeriod);
        this.AssetInfo.controls['WarrantyCost'].setValue(this.editAssetInfo.WarrantyCost);
        this.AssetInfo.controls['WarrantyTerms'].setValue(this.editAssetInfo.WarrantyTerms);
        this.AssetInfo.controls['WarrantyRemarks'].setValue(this.editAssetInfo.WarrantyRemarks);

         

      })
    //======== Get Document List ======
    this.GetEditAssetUploadDocument(prefarId);
  }

  GetEditAssetUploadDocument(prefarId) {
    this.displayDocument = false;
    this.fileListArray = [];
    this.groupservice.GetEditAssetUploadDocument(prefarId)
      .subscribe(r => {
         
        this.fileListArray = JSON.parse(r);
        console.log("Document", this.fileListArray);
        this.onChangeDataSource(this.fileListArray);
        this.displayDocument = true;
      });
  }

  fileList: any[] = [];
  DocumentType: string;
  FileUpload: string;
  FileExtension: string;
  size: any;
  fileListArray: any[] = [];
  fileChange(event) {
     
    var isDocumentAlreadyAdded = false;
    this.fileList =  event.target.files;;
    for(var i =0 ; i< this.fileList.length; i++){
      this.selectedfile=this.fileList[i];
     this.FileUploadValidation(this.fileList[0].name,this.fileList[0].size);

     if(this.uploadfile == false){
      this.selectedFile.nativeElement.value = '';
      this.uploader.queue[i].remove();
   }
  }
    this.DocumentType = this.Download.controls['DocumentType'].value;
    if (!this.DocumentType || this.DocumentType == "" || this.DocumentType == null) {
      event.target.value = '';
      this.messageAlertService.alert({ title: this.message.AssetrakSays, message: this.message.SelectDocumentType })
      return false;

    }
    else {
      var type = this.documentId === 3 ? "Asset Photo" : this.documentId === 4 ? "Insurance Policy" : this.documentId === 5 ? "AMC Document" : this.documentId === 7 ? "Invoice" : this.documentId === 8 ? "Software Document" : "";

      if (this.fileListArray.length > 0) {
        for (var i = 0; i < this.fileListArray.length; i++) {
          if (this.fileListArray[i].Displayname == type) {
            isDocumentAlreadyAdded = true;
            break;
          }
        }
      }
      if (isDocumentAlreadyAdded == false) {
         
        this.fileList = event.target.files;
        var checkFileFlag = false;
        var chkFilsSizeIsValid = false;
        var MaxContentLength = 1024 * 1024 * 2 / 1024;
        this.size = this.fileList[0].size;
        var i = parseInt(this.size);
        // this.size1 = parseFloat(i / 1024).toFixed(2);

        if (this.fileList.length > 0) {
          var file = this.fileList[0].name;
          var data = {
            DocumentType: this.documentType,
            DocumentName: this.fileList[0].name,
            Displayname: this.displayname,
            DocumentTypeId: this.documentId,
            FileListData: this.fileList[0]
          }
          //  this.fileListArray.push(data);
          if (file != null) {
            this.FileExtension = file.substring(file.lastIndexOf('.') + 1, file.length);
          }
          checkFileFlag = true;
        }
        if (this.documentId === 3) {
          var AllowedImageExtensions = [".jpg", ".jpeg", ".png"];
          var index = AllowedImageExtensions.indexOf("." + this.FileExtension);
          if (index > -1) {
            checkFileFlag = true;
          }
          else {
            var msg = "Invalid File Type. Select .jpeg, .jpg or png file";
            //var msg = "Please Select file of type: " + AllowedImageExtensions.join();
            this.messageAlertService.alert({ title: this.message.AssetrakSays, message: msg });
            this.Download.controls['FileUpload'].setValue(null);
            checkFileFlag = false;
            return false;
          }
        }
        this.fileListArray.push(data);
        //====== upload Document ===
        if (checkFileFlag == true) {
          var filedata = {
            documentType: this.documentId,
            fileList: this.fileList,
            CompanyId: this.CompanyId
          }
          this.upload(filedata);
        }
        this.Download.controls['FileUpload'].setValue(null);
      }
      else {
        var msg1 = this.message.FileAlreadyUploaded;
        msg1 = msg1.replace('xxxx', this.DocumentType['Displayname']);
        this.messageAlertService.alert({ title: this.message.AssetrakSays, message: msg1 });
        this.Download.controls['FileUpload'].setValue(null);
      }
      this.onChangeDataSource(this.fileListArray);
    }
  }
  displayDocument : boolean = false;
  onChangeDataSource(value) {    
    this.datasource.data = value;
  }

  deleteData(element) {
     
    this.confirmService.confirm({ message: this.message.DocumentDeleteNotification, title: this.message.AssetrakSays })
      .subscribe(res => {
        if (!!res) {
          this.DeleteAssetDocumentById(element);
        }
      })
  }
  DeleteAssetDocumentById(element) {
     
    //this.loader.open();
    var idx = this.fileListArray.indexOf(element);
    if (idx > -1) {
      this.fileListArray.splice(idx, 1);
    }

    this.onChangeDataSource(this.fileListArray);
    //====================
     
    var id = !!element.DocumentId ? element.DocumentId : 0;
    if (id != 0) {
      this.assetservice.DeleteAssetDocumentById(element.DocumentId, element.DocumentPath).subscribe(r => {
         
        // this.loader.close();
        if (r == "success") {
          this.GetEditAssetUploadDocument(this.editAssetInfo.PreFarId);
          this.toastr.success(this.message.DocumentDeleteSuccessfully, this.message.AssetrakSays);
    
        }
      });

    }
    else {
      this.GetEditAssetUploadDocument(this.editAssetInfo.PreFarId)
      this.toastr.success(this.message.DocumentDeleteSuccessfully, this.message.AssetrakSays);
;
    }

  }
  upload(filedata) {
     
    this.uploadservice.uploadDocument(filedata).subscribe(r => {
       
      if(!!r){
        var filePath = r;
        this.setUploadMissingFile(this.CompanyId, filePath, filedata.documentType)
      }      
    });
  }

  setUploadMissingFile(companyId, filePath, documentType) {
      
    //  this.loader.open();
    var prefarId = this.editAssetInfo.PreFarId;//$scope.vm.prefarId1;
    var projectType = "None";
    var projectId = 0;    
    if(documentType == 4){
      var path = filePath.split('/Insurance/');
    }
    else if(documentType == 5){
      var path = filePath.split('/AMC/');
    }
    else if(documentType == 7){
      var path = filePath.split('/Invoice/');
    }
    else if(documentType == 8 || documentType == 9){
      var path = filePath.split('uploads/');
    }
    else{
      var path = filePath.split('/Photo/');
    }    
    var uploadmissingdto = {
      CId: companyId,
      PreFarId: prefarId,
      ProjectType: projectType,
      ProjectId: projectId,
      filePath: !!path[1] ? path[1] : "",
      documentType: documentType,
    }
    this.reconciliationService.setUploadMissingFile(uploadmissingdto)
      .subscribe(response => {
         
        // this.loader.close();
        this.GetEditAssetUploadDocument(this.editAssetInfo.PreFarId);
      })
  }
  changeAssetExpiryDate(dateEvent1) {
    this.assetexpiryDate.emit(dateEvent1.value);
  }

  ConfigForCategoryExits: any;
  // CheckWetherApprovalConfigExits() {
  //   var GroupId = this.GroupId;
  //   this.groupservice.CheckWetherConfigurationExist(GroupId, 23)
  //     .subscribe(r => {
  //       this.ConfigForCategoryExits = r;
  //       if (this.ConfigForCategoryExits == true) {
  //         this.GetBlocksOfAssets();
  //       }
  //       if (!this.ConfigForCategoryExits || this.ConfigForCategoryExits === false) {
  //         this.GetAllBlocksOfAssets();
  //         var CatId = 0;
  //         this.GetAllAssetTypeData(CatId);
  //       }
  //     })
  // }
  // GetAllBlocksOfAssets() {
  //   this.CId = this.CompanyId;
  //   this.groupservice.BlocksOfAssetsGetByCompanyId(this.CId).subscribe(response => {
  //     if (response) {
  //       this.AssetClassData = response;
  //       this.getFilteredAssetClass();
  //     }
  //   })
  // }

  AssetClassData: any[] = [];
  CatId: any;
  SelectAssetClassId(event) {
     
    this.loader.open()
    this.CategoryList = [];
    this.CatId = !!event ? event.AssetCategoryId : 0;
    this.AssetInfo.controls['CategoryName'].setValue("");
    if (this.AllCategoryList.length > 0) {
      this.AllCategoryList.forEach(element => {
        if (element.AssetCategoryId == this.CatId) {
          this.CategoryList.push(element);
          this.AssetInfo.controls['CategoryName'].setValue(element);
        }
      })
    }
    this.getFilterCategory();
    // this.AssetClassData = [];
    // if (this.blocksofAssetData.length > 0) {
    //   this.blocksofAssetData.forEach(element => {
    //     if (element.AssetCategoryId == event.AssetCategoryId) {
    //       this.AssetClassData.push(element);
    //     }
    //   })
    // }
    // this.getFilteredAssetClass();
    this.AssetInfo.controls['typeOfAsset'].setValue("");
    this.AssetInfo.controls['subTypeOfAsset'].setValue("");

    this.allSubtypeData = [];
    this.getFilterAssetSubtype();
    this.GetAllAssetTypeData(this.CatId);
    this.loader.close()
  }
  SelectAssetClassId1(event) {
    if (this.AllCategoryList.length > 0) {
      this.AllCategoryList.forEach(element => {
        if (element.AssetCategoryId == event.AssetCategoryId) {
          this.CategoryList.push(element);
        }
      })
    }
    this.getFilterCategory();
  }



  // allColumnsForCust: any[];
  // columnsNameForCust: any[];
  // ColumnHeaderNameForCust: any[];
  // getAllClientCustomizationData() {
  //   var lisTtype = "CreateGrnAsset";
  //   this.assetsService.GetAllCustomizationDataWithType(lisTtype)
  //     .subscribe(Response => {
  //       this.allColumnsForCust = [];
  //       this.columnsNameForCust = [];
  //       this.ColumnHeaderNameForCust = [];
  //       if (Response === "[]" || Response === "" || Response === null) {
  //       } else {
  //         this.allColumnsForCust = JSON.parse(Response);           
  //         this.ColumnHeaderNameForCust = this.allColumnsForCust;
  //       }
  //     })
  // }


  GetAllAssetSubtypeData(AssetTypeId) {
    this.TId = !!AssetTypeId ? AssetTypeId : 0;
    this.CId = this.CompanyId;
    this.ITassetservice.GetAllSubtypeData(this.TId, this.CId)
      .subscribe(response => {
        this.allSubtypeData = response;
        this.AssetInfo.controls['subTypeOfAsset'].setValue("");
        this.getFilterAssetSubtype();
      })
  }
  GetAllAssetSubtypeData1(AssetTypeId) {
    this.TId = !!AssetTypeId ? AssetTypeId : 0;
    this.CId = this.CompanyId;
    this.ITassetservice.GetAllSubtypeData(this.TId, this.CId)
      .subscribe(response => {
        this.allSubtypeData = response;
        this.allSubtypeData.forEach((val) => {
          if (!!this.editAssetInfo.subTypeOfAsset && (val.SubTypeOfAsset.toLowerCase() == this.editAssetInfo.subTypeOfAsset.toLowerCase())) {
            this.SubTypeOfAssetValueSelected = val;
            this.AssetInfo.controls['subTypeOfAsset'].setValue(val);
          }
        })
        this.getFilterAssetSubtype();
      })
  }
  GetAllAssetTypeData(CatId) {
    var companyData = {
      BlockName: CatId,
      CompanyId: this.CompanyId
    }
    this.ITassetservice.GetTypeByBlockJSON(companyData)
      .subscribe(response => {
         
        this.allAssetTypeData = [];
        if (CatId != 0) {
          this.allAssetTypeData = response;
        }
        this.getFilterAssettype();
      })
  }
  GetAllAssetTypeData1(CatId) {
    var companyData = {
      BlockName: CatId,
      CompanyId: this.CompanyId
    }
    this.ITassetservice.GetTypeByBlockJSON(companyData)
      .subscribe(response => {
        this.allAssetTypeData = response;
        this.allAssetTypeData.forEach((val) => {
          if (val.TypeOfAsset.toLowerCase() == this.editAssetInfo.TypeOfAsset.toLowerCase()) {
            this.TypeOfAssetValueSelected = val;
            this.AssetInfo.controls['typeOfAsset'].setValue(val);
            this.showAssetSubType = false;
          }
        })
        this.getFilterAssettype();
      })
  }

  //Upload Document
  GetAllUploadDoc() {
    this.assetservice.GetDocumentTypeId().subscribe(response => {
      this.list = JSON.parse(response);
      this.UploaddocsData = [];
      // this.list = response;
      for (var i = 0; i < this.list.length; i++) {
        if (this.list[i].Displayname == "Asset Photo" || this.list[i].Displayname == "Insurance Policy" || this.list[i].Displayname == "AMC Document" || this.list[i].Displayname == "Invoice" || this.list[i].Displayname == "Software Document" || this.list[i].Displayname == "Other") {
          this.UploaddocsData.push(this.list[i]);
        }
      }
      this.getFilterUpload();
    })
  }
  AssetTypeId: any;
  SelectAssetTypeId(event) {
    if (!event) {
      this.showAssetSubType = true;
    } else {
      this.showAssetSubType = false;
      this.AssetTypeId = !!event.TAId ? event.TAId : 0;
      this.GetAllAssetSubtypeData(this.AssetTypeId);
    }
  }
  enableOtherText: boolean = false;
  uploadDisabled: boolean = false;
  documentId: any;
  displayname: any;
  documentType: any;
  selectedDocType(event) {

    this.enableOtherText = false;
    this.documentId = event.DocumentTypeId;
    this.displayname = event.Displayname;
    this.documentType = event.DocumentType;
    if (!event.Displayname || event.Displayname == "" || event.Displayname == null) {
      this.uploadDisabled = true;
    }
    this.uploadDisabled = false;
    if (event.Displayname === "Other") {
      this.enableOtherText = true;
    }
  }
  bindSubLocation(value) {
    this.showSublocation = false;
    this.allMappedRackListData = [];
    this.allMappedRackList.forEach(val => {
      if (val.LocationID == value.LocationId) {
        this.allMappedRackListData.push(val);
      }
    })
    this.getFilterSubLocation();
  }



  WarrantyStartDate: any;
  WarrantyEnd: any;
  totalMonth: any;
  calculatePeriod() {
    this.WarrantyStartDate = this.AssetInfo.value.InstallationDate._d;
    this.WarrantyEnd = this.AssetInfo.value.WarrantyExpiryDate._d;
    this.totalMonth = this.Noofmonths(this.WarrantyStartDate, this.WarrantyEnd);
    this.AssetInfo.controls['WarrantyPeriod'].setValue(this.totalMonth);
    //this.Maintenance.controls['WarrantyPeriod'].disable();
    this.WarrantyPeriodEnable = true;
  }
  Noofmonths(WarrantyStartDate, WarrantyEnd) {
    var installationDate = new Date(WarrantyStartDate);
    var WarrantyExpiryDate = new Date(WarrantyEnd);
    var Nomonths;
    Nomonths = (WarrantyExpiryDate.getFullYear() - installationDate.getFullYear()) * 12;
    Nomonths -= installationDate.getMonth() + 1;
    Nomonths += WarrantyExpiryDate.getMonth() + 1;
    return Nomonths <= 0 ? 0 : Nomonths;
  }

  WExpiaryDate: any;
  WExpiaryDateDisable: boolean = false;
  calculateExpiaryDateWithPeriod() {
    if (!this.AssetInfo.value.WarrantyPeriod || this.AssetInfo.value.WarrantyPeriod == "") {
      this.WExpiaryDateDisable = false;
      //this.Maintenance.controls['WarrantyEnd'].enable();
      this.WarrantyEndEnable = false;
      this.AssetInfo.controls['WarrantyExpiryDate'].setValue(null);

    } else {
      this.WExpiaryDate = this.addMonths(new Date(), parseInt(this.AssetInfo.value.WarrantyPeriod));
      this.AssetInfo.controls['WarrantyExpiryDate'].setValue(this.WExpiaryDate);
      this.WExpiaryDateDisable = true;
      //this.Maintenance.controls['WarrantyEnd'].disable();
      this.WarrantyEndEnable = true;
    }
  }
  expDate: any = false;
  calculateExpiaryDateWithUsefullife() {
    
    let datesssss;
    let months = !this.AssetInfo.value.UsefulLife ? 0 : this.AssetInfo.value.UsefulLife;
    let initDate = !this.AssetInfo.value.AcquisitionDate ? "" : new Date(this.AssetInfo.value.AcquisitionDate);
    
    if(!!initDate){
      if(this.isusefulLife.toLowerCase()=='month'){
        datesssss = this.addMonths(initDate, parseInt(months));//initDate.add(months, 'months');
        this.AssetInfo.controls['ExpiryDate'].setValue(datesssss);
      }
      else if(this.isusefulLife.toLowerCase()=='year'){
        datesssss = this.addMonths(initDate, parseInt(months) * 12);//initDate.add(months, 'years');
        this.AssetInfo.controls['ExpiryDate'].setValue(datesssss);
      }
    }
    if(!months) {
      this.expDate = false;
      return;
     }
     else  {this.expDate = true;}
  }

  addMonths(date, months) {
    var d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
  }

  changeInsuranceEnd(dateEvent4) {
    this.insuranceEndDate.emit(dateEvent4.value);
  }
  changeAMCStartDate(dateEvent5) {
    this.amcStartDate = new Date(this.AssetInfo.value.AMCStartDate);
    this.amcEndDate = new Date(this.amcStartDate);
  }
  amcStartDate: any;
  amcEndDate: any;
  changeAMCEndDate(dateEvent6) {
    this.AMCEndDate.emit(dateEvent6.value);

  }

  clculateAcqCostAndWdvCost = function () {
    var acq = parseFloat(this.AssetInfo.value.AcquisitionCost);
    var wdv = parseFloat(this.AssetInfo.value.WDV);
    if (acq > -1) {
      if (wdv > acq) {
        this.messageAlertService.alert({ title: this.message.AssetrakSays, message: this.message.CostCompare });
        this.AssetInfo.controls['WDV'].setValue(null);
        return false;
      }
    }
  }

  warrantyStart: any;
  maxDateFormatForWarrenty: any;
  WarrantyEndEnable: boolean = false;
  WarrantyPeriodEnable: boolean = false;
  changeWarrantyStartDate() {
     
    this.WExpiaryDateDisable = false;
    this.WarrantyEndEnable = false;
    this.WarrantyPeriodEnable = false;
    //this.Maintenance.controls['WarrantyEnd'].enable();
    this.AssetInfo.controls['WarrantyPeriod'].enable();
    this.AssetInfo.controls['WarrantyExpiryDate'].setValue(null);
    this.AssetInfo.controls['WarrantyPeriod'].setValue(null);
    this.warrantyStart = new Date(this.AssetInfo.value.InstallationDate);
    this.maxDateFormatForWarrenty = new Date(this.warrantyStart);

  }
  changeWarrantyEndDate(dateEvent8) {
    this.warrantyEndDate.emit(dateEvent8.value);
  }
  //OtherInfo Date
  chargeGRNDate(dateEvent) {
    this.GRNDate.emit(dateEvent.value);
  }
  insuranceFrom: any;
  InsuranceFromForWarrenty: any;
  changeInsuranceStart(dateEvent3) {
    this.insuranceFrom = new Date(this.AssetInfo.value.InsuranceFrom);
    this.InsuranceFromForWarrenty = new Date(this.insuranceFrom);
  }

  UpdateAssetNew(result) {
    this.loader.open();
    
    var farDetails = {
      PreFarId: this.editAssetInfo.PreFarId,
      GroupId: this.GroupId,
      CompanyId: this.CompanyId,
      RegionId: this.RegionId,
      LocationId: !this.AssetInfo.value.Location ? null : this.AssetInfo.value.Location.LocationId,
      AssetId: !this.AssetInfo.value.AssetId ? this.editAssetInfo.AssetId : this.AssetInfo.value.AssetId,
      SubAssetId: !this.AssetInfo.value.SubAssetId ? this.editAssetInfo.SubAssetId : this.AssetInfo.value.SubAssetId,
      Barcode: !this.AssetInfo.value.InventoryNo ? "" : this.AssetInfo.value.InventoryNo,
      BlockOfAsset: !this.AssetInfo.value.BlockOfAsset ? "" : this.AssetInfo.value.BlockOfAsset.BlockName,
      // AcquisitionDate: this.JsonDate(this.AssetInfo.value.AcquisitionDate),
      AcquisitionDateInString:!this.AssetInfo.value.AcquisitionDate?null: new Date(this.AssetInfo.value.AcquisitionDate),
      Quantity: !this.AssetInfo.value.Quantity ? null : this.AssetInfo.value.Quantity,
      Location: !this.AssetInfo.value.Location ? "" : this.AssetInfo.value.Location.LocationName,
      AcquisitionCost: !this.AssetInfo.value.AcquisitionCost ? "" : this.AssetInfo.value.AcquisitionCost,
      WDV: !this.AssetInfo.value.WDV ? 0 : this.AssetInfo.value.WDV,
      // WDVDate: !this.AssetInfo.value.WDVDate ? null : this.JsonDate(this.AssetInfo.value.WDVDate),
      WDVDateInString: !this.AssetInfo.value.WDVDate ? null : new Date(this.AssetInfo.value.WDVDate),
      Building: !this.AssetInfo.value.Building ? "" : this.AssetInfo.value.Building.Description,
      Rack: !this.AssetInfo.value.Rack ? "" : this.AssetInfo.value.Rack.RackName,
      Room: !this.AssetInfo.value.Room ? null : this.AssetInfo.value.Room,
      ADL1: !this.AssetInfo.value.BlockOfAsset ? "" : this.AssetInfo.value.BlockOfAsset.BlockName,
      ADL2: !this.AssetInfo.value.ADL2 ? "" : this.AssetInfo.value.ADL2,
      ADL3: !this.AssetInfo.value.ADL3 ? "" : this.AssetInfo.value.ADL3,
      CustodianEmailId: !this.AssetInfo.value.Custodian ? null : this.AssetInfo.value.Custodian.split("|")[2],
      CustodianName: !this.AssetInfo.value.Custodian ? null : this.AssetInfo.value.Custodian.split("|")[1],
      UserEmailId: !this.AssetInfo.value.UserEmailId ? null : this.AssetInfo.value.UserEmailId.split("|")[2],
      UserName: !this.AssetInfo.value.UserEmailId ? null : this.AssetInfo.value.UserEmailId.split("|")[1],
      Taggable: !this.editAssetInfo.Taggable ? "" : this.editAssetInfo.Taggable,
      LabelSize: !this.editAssetInfo.LabelSize ? "" : this.editAssetInfo.LabelSize,
      LabelMaterial: !this.editAssetInfo.LabelMaterial ? "" : this.editAssetInfo.LabelMaterial,
      Suplier: !this.AssetInfo.value.Suplier ? null : this.AssetInfo.value.Suplier.SupplierName,
      SerialNo: !this.AssetInfo.value.SerialNo ? null : this.AssetInfo.value.SerialNo,
      RemainingUseFulLife: !this.editAssetInfo.RemainingUseFulLife ? "" : this.editAssetInfo.RemainingUseFulLife,
      Unit: !this.AssetInfo.value.Unit ? 'EA' : this.AssetInfo.value.Unit.Unit_Name,
      // expiryDate: !this.AssetInfo.value.ExpiryDate ? null : this.JsonDate(this.AssetInfo.value.ExpiryDate),
      expiryDateInString: !this.AssetInfo.value.ExpiryDate ? null :new Date(this.AssetInfo.value.ExpiryDate),
      ITSerialNo: !this.AssetInfo.value.ITSerialNo ? null : this.AssetInfo.value.ITSerialNo,
      PONumber: !this.AssetInfo.value.PONumber ? null : this.AssetInfo.value.PONumber,
      equipmentNo: !this.AssetInfo.value.equipmentNo ? null : this.AssetInfo.value.equipmentNo,
      InvoiceNo: !this.AssetInfo.value.InvoiceNo ? null : this.AssetInfo.value.InvoiceNo,
      TAId: !this.AssetInfo.value.typeOfAsset ? 0 : this.AssetInfo.value.typeOfAsset.TAId,
      STAId: !this.AssetInfo.value.subTypeOfAsset ? 0 : this.AssetInfo.value.subTypeOfAsset.STAId,
      TypeOfAsset: !this.AssetInfo.value.typeOfAsset ? null : this.AssetInfo.value.typeOfAsset.TypeOfAsset,
      subTypeOfAsset: !this.AssetInfo.value.subTypeOfAsset ? null : this.AssetInfo.value.subTypeOfAsset.SubTypeOfAsset,
      ReplacementValue: !this.AssetInfo.value.ResidualValue ? null : this.AssetInfo.value.ResidualValue,
      LastModifiedBy: this.UserId,
      OperatingSystem: !this.AssetInfo.value.OperatingSystem ? null : this.AssetInfo.value.OperatingSystem.OperatingSystemName,
      CPUClass: !this.AssetInfo.value.CPUClass ? null : this.AssetInfo.value.CPUClass.CpuClassName,
      CPUSubClass: !this.AssetInfo.value.CPUSubClass ? null : this.AssetInfo.value.CPUSubClass.CpuSubClassName,
      ApplicationType: !this.AssetInfo.value.ApplicationType ? null : this.AssetInfo.value.ApplicationType.ApplicationTypeName,
      Model: !this.AssetInfo.value.Model ? null : this.AssetInfo.value.Model.ModelName,
      Manufacturer: !this.AssetInfo.value.Manufacturer ? null : this.AssetInfo.value.Manufacturer.ManufacturerName,
      HostName: !this.AssetInfo.value.HostName ? "" : this.AssetInfo.value.HostName,
      HDD: !this.AssetInfo.value.HDD ? "" : this.AssetInfo.value.HDD,
      RAM: !this.AssetInfo.value.RAM ? "" : this.AssetInfo.value.RAM,
      // InsuranceFrom: !this.Maintenance.value.InsuranceFrom ? null : this.JsonDate(this.Maintenance.value.InsuranceFrom),
      // InsuranceTo: !this.Maintenance.value.InsuranceTo ? null : this.JsonDate(this.Maintenance.value.InsuranceTo),
      InsuranceFromInString: !this.AssetInfo.value.InsuranceFrom ? null : new Date(this.AssetInfo.value.InsuranceFrom),
      InsuranceToInString: !this.AssetInfo.value.InsuranceTo ? null : new Date(this.AssetInfo.value.InsuranceTo),
      InsuranceVendor: !this.AssetInfo.value.InsuranceVendor ? null : this.AssetInfo.value.InsuranceVendor,
      // AMCExpiryDate: !this.AssetInfo.value.AMCExpiryDate ? null : this.JsonDate(this.AssetInfo.value.AMCExpiryDate),
      // AMCStartDate: !this.AssetInfo.value.AMCStartDate ? null : this.JsonDate(this.AssetInfo.value.AMCStartDate),
      AMCExpiryDateInString: !this.AssetInfo.value.AMCExpiryDate ? null : new Date(this.AssetInfo.value.AMCExpiryDate),
      AMCStartDateInString: !this.AssetInfo.value.AMCStartDate ? null : new Date(this.AssetInfo.value.AMCStartDate),
      AMCVendor: !this.AssetInfo.value.AMCVendor ? null : this.AssetInfo.value.AMCVendor,
      // InstallationDate: !this.AssetInfo.value.InstallationDate ? null : this.JsonDate(this.AssetInfo.value.InstallationDate),
      // WarrantyExpiryDate: !this.AssetInfo.value.WarrantyExpiryDate ? null : this.JsonDate(this.AssetInfo.value.WarrantyExpiryDate),
      InstallationDateInString: !this.AssetInfo.value.InstallationDate ? null : new Date(this.AssetInfo.value.InstallationDate),
      WarrantyExpiryDateInString: !this.AssetInfo.value.WarrantyExpiryDate ? null : new Date(this.AssetInfo.value.WarrantyExpiryDate),
      WarrantyPeriod: !this.AssetInfo.value.WarrantyPeriod ? "0" : this.AssetInfo.value.WarrantyPeriod,
      WarrantyCost: !this.AssetInfo.value.WarrantyCost ? "" : this.AssetInfo.value.WarrantyCost,
      WarrantyTerms: !this.AssetInfo.value.WarrantyTerms ? "" : this.AssetInfo.value.WarrantyTerms,
      WarrantyRemarks: !this.AssetInfo.value.WarrantyRemarks ? "" : this.AssetInfo.value.WarrantyRemarks,
      AssetCondition: !this.AssetInfo.value.AssetCondition ? null : this.AssetInfo.value.AssetCondition.AssetCondition,
      AssetCriticality: !this.AssetInfo.value.AssetCriticality ? "Normal" : this.AssetInfo.value.AssetCriticality.AssetCriticality,
      AssetList: JSON.stringify(this.getAllClientCustomizationValues),
      AssetCategoryId: !this.AssetInfo.value.CategoryName ? "0" : this.AssetInfo.value.CategoryName.AssetCategoryId,
      CategoryName: !this.AssetInfo.value.CategoryName ? "" : this.AssetInfo.value.CategoryName.AssetCategoryName,
      GrnDateInstring :!this.AssetInfo.value.GRNDate ? null : new Date(this.AssetInfo.value.GRNDate),
      AmortizationStartDateInString:!this.AssetInfo.value.AmortizationStartDate ? null : new Date(this.AssetInfo.value.AmortizationStartDate),
      RejectComment: result
    }
    this.assetservice.UpdateEditAsset(farDetails)
      .subscribe(r => {
          
        this.loader.close();
        //this.router.navigate(['create_assets/review_assets']);
        this.toastr.success(this.message.AssetDetailsUpdateSucess, this.message.AssetrakSays);
        if (this.title == "Edit") {
          this.router.navigateByUrl('h1/b');
        }
        else {
          this.router.navigateByUrl('h1/c');
        }
        // var msg = r.split(',')[0];
        // this.PrefarId = r.split(',')[1];
        // if (msg == "Success") {
        //   this.toastr.success(this.message.AssetDetailsUpdateSucess, this.message.AssetrakSays);
        // }
        // else if (msg == "Fail") {
        //   this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
        // }
        // this.uploadDocument();
      })
  }

  UpdateAsset() {
     

    var AssetId = !this.AssetInfo.value.AssetId ? this.editAssetInfo.AssetId : this.AssetInfo.value.AssetId;
    var SubAssetId = !this.AssetInfo.value.SubAssetId ? this.editAssetInfo.SubAssetId : this.AssetInfo.value.SubAssetId;
    var PreFarId = this.editAssetInfo.PreFarId;
    if (AssetId.startsWith('GRN') || AssetId.startsWith('NFAR')) {
      if (this.title == "Edit" || this.UploadStatus == 3) {
        this.UpdateAssetNew("");
      }
      else {
        const dialogRef = this.dialog.open(AddCommentDialogComponent, {
          panelClass: 'group-form-dialog',
          width: '400px',
          disableClose: true,
          data: {},
        });
        dialogRef.afterClosed().subscribe(result => {
          if (!!result) {
             
            this.UpdateAssetNew(result);
          }
        });
      }
    }
    else {
      this.loader.open();
      this.assetsService.IsAssetIdAndSubNoDuplicate(this.CompanyId, AssetId, SubAssetId, PreFarId).subscribe(r => {
         
        this.loader.close();
        if (r == false) {
          if (this.title == "Edit" || this.UploadStatus == 3) {
            this.UpdateAssetNew("");
          }
          else {
            const dialogRef = this.dialog.open(AddCommentDialogComponent, {
              panelClass: 'group-form-dialog',
              width: '400px',
              disableClose: true,
              data: {},
            });
            dialogRef.afterClosed().subscribe(result => {
              if (!!result) {
                 
                this.UpdateAssetNew(result);
              }
            });
          }
        }
        else {
          this.toastr.warning(this.message.AssetIdAlreadyExist, this.message.AssetrakSays);
        }
      });
    }

  }

  ContinueRejectbtn(result) {
     
    this.loader.open();
    var AssetsDetail =
    {
      UserId: this.UserId,
      CompanyId: this.CompanyId,
      AssetList: this.rowData.PreFarId,
      RejectComment: result
    }
    //this.ShowGridData = ReviewData;
    this.assetservice.AssetsRejection(AssetsDetail).subscribe(r => {
       
      this.loader.close();

      if (r == "Assets are Rejected Sucessfully.") {
        this.toastr.success(this.message.ReviewAssetRejected, this.message.AssetrakSays);
      }

    })

  }

  PrefarId: any;
  uploadDocument() {
     
    if (this.fileListArray.length > 0) {
      for (var i = 0; i < this.fileListArray.length; i++) {
        let formData = new FormData();
        formData.append('uploadFile', this.fileListArray[i]);
        var companyId = this.CompanyId;
        var documentTypeId = this.fileListArray[i].DocumentTypeId;
        var data = {
          documentType: documentTypeId,
          CompanyId: companyId,
          fileList: this.fileListArray[i].FileListData
        }

        this.uploadservice.uploadDocumentCreateGRNAsset(data)
          .subscribe(result => {

            var filePath = result.split('|')[0];
            documentTypeId = result.split('|')[1];
            this.setUploadMissingFile(companyId, filePath, documentTypeId)
          })
      }
    }
  }

  getFilteredAssetClass() {

    this.filteredAssetClass.next(this.AssetClassData.slice());
    this.AssetInfo.controls['AssetClassFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAssetClass();
      });
  }
  protected filterAssetClass() {

    if (!this.AssetClassData) {
      return;
    }
    // get the search keyword
    let search = this.AssetInfo.controls['AssetClassFilter'].value;
    if (!search) {
      this.filteredAssetClass.next(this.AssetClassData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the Asset Class
    this.filteredAssetClass.next(
      this.AssetClassData.filter(x => x.BlockName.toLowerCase().indexOf(search) > -1)
    );
  }
  columnsName = [];
  getAllClientCustomizationValues = [];
  getheaderValues(...val) {
     
    if(val[0].Columnname == 'GRNDate'){
      val[1] = !!val[1] ? this.datepipe.transform(val[1],'dd-MMM-yyyy') : ""; //new Date(val[1]) //
    }
    var value = val[1].trim();
    var key = val[0].Columnname;
    var row = { name: key, value: value };
    if (val[0].Columnname === 'GRNNo') {
      var GRNNo = val[0].model;
      var companyId = 2;
      var GroupId = this.GroupId;
      this.assetsService.CheckInvoiceNoForCreateGRN(GRNNo, companyId, GroupId, "")
        .subscribe(Response => {
          if (Response == "Duplicate GRN Number") {
            this.confirmService.confirm({ message: this.message.DuplicateGRNWarningForSingleCreate, title: this.message.AssetrakSays })
              .subscribe(res => {
                if (res) {
                  if (this.columnsName.length > 0) {
                    for (var k = 0; k < this.columnsName.length; k++) {
                      if (this.columnsName[k].name == val[0].Columnname) {

                        this.columnsName.splice(k, 1);
                      }
                    }
                  }
                  if (!!value) { this.columnsName.push(row); }
                } else {
                  val[0].model = "";
                  if (this.columnsName.length > 0) {
                    for (var k = 0; k < this.columnsName.length; k++) {
                      if (this.columnsName[k].name == val[0].Columnname) {

                        this.columnsName.splice(k, 1);

                      }
                    }
                  }
                }
              })
          }
        })

    } else {
      if (this.columnsName.length > 0) {
        for (var k = 0; k < this.columnsName.length; k++) {
          if (this.columnsName[k].name == val[0].Columnname) {
            this.columnsName.splice(k, 1);
          }
        }
      }
      if (!!value) { this.columnsName.push(row); }
    }
    this.getAllClientCustomizationValues = this.columnsName;
     
    // ======= Disable Other Info tab ========
    if (!!this.MandatoryOtherInfo) {
      this.disableOtherInfo = true;
      if (this.getAllClientCustomizationValues.length > 0) {
        this.getAllClientCustomizationValues.forEach(element => {
          if (this.mandatoryFields.indexOf(element.name) > -1) {
            this.disableOtherInfo = false;
          }
        });
      }
    }

  }
  getFilterCPUClass() {
    this.filteredCPUClass.next(this.CPUClassData.slice());
    this.AssetInfo.controls['CPUClassDataFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCPUClassData();
      });

  }
  protected filterCPUClassData() {
    if (!this.CPUClassData) {
      return;
    }
    // get the search keyword
    let search = this.AssetInfo.controls['CPUClassDataFilter'].value;
    if (!search) {
      this.filteredCPUClass.next(this.CPUClassData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the data
    this.filteredCPUClass.next(
      this.CPUClassData.filter(x => x.CpuClassName.toLowerCase().indexOf(search) > -1)
    );
  }
  getFilterCPUsubClass() {
    this.filteredCPUsubClass.next(this.CPUSubClassData.slice());
    this.AssetInfo.controls['CPUClasssubDataFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCPUsubClassData();
      });
  }
  protected filterCPUsubClassData() {
    if (!this.CPUSubClassData) {
      return;
    }
    // get the search keyword
    let search = this.AssetInfo.controls['CPUClasssubDataFilter'].value;
    if (!search) {
      this.filteredCPUsubClass.next(this.CPUSubClassData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the data
    this.filteredCPUsubClass.next(
      this.CPUSubClassData.filter(x => x.CpuSubClassName.toLowerCase().indexOf(search) > -1)
    );
  }
  getFilterApplicationType() {
    this.filteredApplicationType.next(this.ApplicationTypeData.slice());
    this.AssetInfo.controls['ApplicationDataFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterApplication();
      });
  }
  protected filterApplication() {
    if (!this.ApplicationTypeData) {
      return;
    }
    // get the search keyword
    let search = this.AssetInfo.controls['ApplicationDataFilter'].value;
    if (!search) {
      this.filteredApplicationType.next(this.ApplicationTypeData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the data
    this.filteredApplicationType.next(
      this.ApplicationTypeData.filter(x => x.ApplicationTypeName.toLowerCase().indexOf(search) > -1)
    );
  }
  getFilterModel() {
    this.filteredModel.next(this.ModelData.slice());
    this.AssetInfo.controls['ModelDataFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterModelData();
      });
  }
  protected filterModelData() {

    if (!this.ModelData) {
      return;
    }
    // get the search keyword
    let search = this.AssetInfo.controls['ModelDataFilter'].value;
    if (!search) {
      this.filteredModel.next(this.ModelData.slice());
      return;
    } else {
      search = search.toLowerCase();

    }
    // filter the Vendors
    this.filteredModel.next(
      this.ModelData.filter(x => x.ModelName.toLowerCase().indexOf(search) > -1)
    );
  }
  getFilterManufacturer() {
    this.filteredManufacturer.next(this.ManufacturerData.slice());
    this.AssetInfo.controls['ManufacturerFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterManufacturerData();
      });

  }
  protected filterManufacturerData() {
    if (!this.ManufacturerData) {
      return;
    }
    // get the search keyword
    let search = this.AssetInfo.controls['ManufacturerFilter'].value;
    if (!search) {
      this.filteredManufacturer.next(this.ManufacturerData.slice());
      return;
    } else {
      search = search.toLowerCase();

    }
    // filter the Manufacturer
    this.filteredManufacturer.next(
      this.ManufacturerData.filter(x => x.ManufacturerName.toLowerCase().indexOf(search) > -1)
    );
  }
  getFilterOperatingSystemName() {
    this.filteredOperatingSystemName.next(this.OsData.slice());
    this.AssetInfo.controls['OperatingSystemFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterOSData();
      });
  }
  protected filterOSData() {
    if (!this.OsData) {
      return;
    }
    // get the search keyword
    let search = this.AssetInfo.controls['OperatingSystemFilter'].value;
    if (!search) {
      this.filteredOperatingSystemName.next(this.OsData.slice());
      return;
    } else {
      search = search.toLowerCase();

    }
    // filter the data
    this.filteredOperatingSystemName.next(
      this.OsData.filter(x => x.OperatingSystemName.toLowerCase().indexOf(search) > -1)
    );
  }
  getFilterUpload() {
    this.filteredUpload.next(this.UploaddocsData.slice());
    this.Download.controls['UploadFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterUploadData();
      });

  }
  protected filterUploadData() {
    if (!this.UploaddocsData) {
      return;
    }

    let search = this.Download.controls['UploadFilter'].value;
    if (!search) {
      this.filteredUpload.next(this.UploaddocsData.slice());
      return;
    } else {
      search = search.toLowerCase();

    }

    this.filteredUpload.next(
      this.UploaddocsData.filter(x => x.Displayname.toLowerCase().indexOf(search) > -1)
    );
  }
  getFilterAssetCondition() {
    this.filteredAssetCondition.next(this.AssetConditionData.slice());
    this.AssetInfo.controls['assetconditionFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAssetConditionData();
      });
  }
  protected filterAssetConditionData() {
    if (!this.AssetConditionData) {
      return;
    }
    let search = this.AssetInfo.controls['assetconditionFilter'].value;
    if (!search) {
      this.filteredAssetCondition.next(this.AssetConditionData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredAssetCondition.next(
      this.AssetConditionData.filter(x => x.AssetCondition.toLowerCase().indexOf(search) > -1)
    )
  }

  empList: any[] = [];
  empListForCustodian: any[] = [];
  filteredOptions: Observable<string[]>;
  filteredOptionsForCust: Observable<string[]>;
  GetEmpEmailList() {
    var companyId = this.CompanyId;
    var userEmailId = "";
    this.userDataService.GetEmployeeBySearchKeyWord(this.GroupId, "", true, this.CompanyId)
      .subscribe(res => {
        if (!res || res === "" || res === null) {
          this.empList = [];
        } else {
          this.empList = res;
          console.log("empList", this.empList);
          this.empListForCustodian = res;
        }
      })
  }

  custodianFilter() {
    this.filteredOptionsForCust = this.AssetInfo.controls['Custodian'].valueChanges
      .pipe(
        startWith(''),
        map(v => this._filterCustodian(v))
      );
  }
  userFilter() {
     
    this.filteredOptions = this.AssetInfo.controls['UserEmailId'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
       
  }
  private _filter(value: string): string[] {
     
    const filterValue = value.toLowerCase();
    return this.empList.filter(option => option.toLowerCase().includes(filterValue));
  }
  private _filterCustodian(v: string): string[] {
    const filterValue1 = v.toLowerCase();
    return this.empListForCustodian.filter(x => x.toLowerCase().includes(filterValue1));
  }
  getFilterUOM() {
    this.filteredUOM.next(this.UOMData.slice());
    this.AssetInfo.controls['uomFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterUOMData();
      });

  }
  protected filterUOMData() {
    if (!this.UOMData) {
      return;
    }

    let search = this.AssetInfo.controls['uomFilter'].value;
    if (!search) {
      this.filteredUOM.next(this.UOMData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredUOM.next(
      this.UOMData.filter(x => x.Unit_Name.toLowerCase().indexOf(search) > -1)
    );
  }

  maxDate: any;
  maxDateFormat: any;
  acqnAndexpiaryDateValidation() {
    this.maxDateFormat = new Date(this.AssetInfo.value.AcquisitionDate);
    this.maxDate = this.datepipe.transform(this.maxDateFormat, 'dd-MMM-yyyy');
  }
  changeCapitlizationDate(dateEvent) {
    this.capitlizationDate.emit(dateEvent.value);
  }

  CheckInvoiceNo() {
    var GRNNo = !this.AssetInfo.value.GRNNo ? "" : this.AssetInfo.value.GRNNo;
    var companyId = this.CompanyId;
    var GroupId = this.GroupId;
    if (!this.AssetInfo.value.GRNNo || this.AssetInfo.value.GRNNo == "" || this.AssetInfo.value.GRNNo == null) {

    } else {
      this.assetsService.CheckInvoiceNoForCreateGRN(GRNNo, companyId, GroupId, "")
        .subscribe(res => {
          if (res === "Duplicate GRN Number") {
            this.confirmService.confirm({ message: this.message.DuplicateGRNWarningForSingleCreate, title: this.message.AssetrakSays })
              .subscribe(res => {
                if (res) {
                } else {
                  this.AssetInfo.value.GRNNo = "";
                }
              })
          }
        })
    }
  }

  getFilterPlant() {
    this.filteredPlant.next(this.LocationList.slice());
    this.AssetInfo.controls['plantFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPlant();
      });
  }

  protected filterPlant() {
    if (!this.LocationList) {
      return;
    }

    let search = this.AssetInfo.controls['plantFilter'].value;
    if (!search) {
      this.filteredPlant.next(this.LocationList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredPlant.next(
      this.LocationList.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1)
    );
  }

  getFilterCategory() {
    this.filteredAssetCategory.next(this.CategoryList.slice());
    this.AssetInfo.controls['categoryFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCategoryData();
      });
  }

  protected filterCategoryData() {
    if (!this.CategoryList) {
      return;
    }
    // get the search keyword
    let search = this.AssetInfo.controls['categoryFilter'].value;
    if (!search) {
      this.filteredAssetCategory.next(this.CategoryList.slice());
      return;
    } else {
      search = search.toLowerCase();

    }
    // filter the Asset category
    this.filteredAssetCategory.next(
      this.CategoryList.filter(x => x.AssetCategoryName.toLowerCase().indexOf(search) > -1)
    );
  }
  getFilterSubLocation() {
    this.filteredSubLocation.next(this.allMappedRackListData.slice());
    this.AssetInfo.controls['subLocationFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterSubLocation();
      });

  }
  protected filterSubLocation() {
    if (!this.allMappedRackListData) {
      return;
    }
    // get the search keyword
    let search = this.AssetInfo.controls['subLocationFilter'].value;
    if (!search) {
      this.filteredSubLocation.next(this.allMappedRackListData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the Sub Location
    this.filteredSubLocation.next(
      this.allMappedRackListData.filter(x => x.RackName.toLowerCase().indexOf(search) > -1)
    );
  }

  getFilterCostCenter() {
    this.filteredCostCenter.next(this.CostCenterData.slice());
    this.AssetInfo.controls['costCenterFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCostCenterData();
      });
  }
  protected filterCostCenterData() {

    if (!this.CostCenterData) {
      return;
    }
    // get the search keyword
    let search = this.AssetInfo.controls['costCenterFilter'].value;
    if (!search) {
      this.filteredCostCenter.next(this.CostCenterData.slice());
      return;
    } else {
      search = search.toLowerCase();

    }
    // filter the Asset_condition
    this.filteredCostCenter.next(
      this.CostCenterData.filter(x => x.Description.toLowerCase().indexOf(search) > -1)
    );
  }
  getFilterAssetCriticality() {
    this.filteredAssetCriticality.next(this.AssetCriticalityData.slice());
    this.AssetInfo.controls['assetcricalityFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAssetCriticalityData();
      });

  }
  protected filterAssetCriticalityData() {
    if (!this.AssetCriticalityData) {
      return;
    }
    // get the search keyword
    let search = this.AssetInfo.controls['assetcricalityFilter'].value;
    if (!search) {
      this.filteredAssetCriticality.next(this.AssetCriticalityData.slice());
      return;
    } else {
      search = search.toLowerCase();

    }
    // filter the Asset_criticality
    this.filteredAssetCriticality.next(
      this.AssetCriticalityData.filter(x => x.AssetCriticality.toLowerCase().indexOf(search) > -1)
    );
  }
  getFilterAssettype() {
    this.filteredAssetType.next(this.allAssetTypeData.slice());
    this.AssetInfo.controls['assettypeFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAssettypeData();
      });

  }
  protected filterAssettypeData() {
    if (!this.allAssetTypeData) {
      return;
    }
    let search = this.AssetInfo.controls['assettypeFilter'].value;
    if (!search) {
      this.filteredAssetType.next(this.allAssetTypeData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the Asset Type
    this.filteredAssetType.next(
      this.allAssetTypeData.filter(x => x.TypeOfAsset.toLowerCase().indexOf(search) > -1)
    );

  }
  getFilterAssetSubtype() {
    this.filteredAssetSubtype.next(this.allSubtypeData.slice());
    this.AssetInfo.controls['assetsubtypeFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterSubtypeData();
      });
  }
  protected filterSubtypeData() {
    if (!this.allSubtypeData) {
      return;
    }
    // get the search keyword
    let search = this.AssetInfo.controls['assetsubtypeFilter'].value;
    if (!search) {
      this.filteredAssetSubtype.next(this.allSubtypeData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the SubType
    this.filteredAssetSubtype.next(
      this.allSubtypeData.filter(x => x.SubTypeOfAsset.toLowerCase().indexOf(search) > -1)
    );
  }
  getFilterVendors() {
    this.filteredVendor.next(this.allSupplierData.slice());
    this.AssetInfo.controls['vendorFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterVendorData();
      });
  }
  protected filterVendorData() {
    if (!this.allSupplierData) {
      return;
    }
    // get the search keyword
    let search = this.AssetInfo.controls['vendorFilter'].value;
    if (!search) {
      this.filteredVendor.next(this.allSupplierData.slice());
      return;
    } else {
      search = search.toLowerCase();

    }
    // filter the Vendors
    this.filteredVendor.next(
      this.allSupplierData.filter(x => x.SupplierName.toLowerCase().indexOf(search) > -1)
    );
  }
  // GetAllCPUClassByCompanyIdGroupId() {
  //   var CId = this.CompanyId;
  //   var GId = this.GroupId;
  //   this.cpuclassservice.GetAllCPUClassList(CId, GId).subscribe(response => {
  //     this.CPUClassData = JSON.parse(response);
  //     this.getFilterCPUClass();
  //   })
  // }
  // GetAllCPUSubClassByCompanyIdGroupId() {
  //   var CId = this.CompanyId;
  //   var GId = this.GroupId;
  //   this.cpusubclassservice.GetAllCPUSubClassList(CId, GId).subscribe(response => {
  //     this.CPUSubClassData = JSON.parse(response);
  //     this.getFilterCPUsubClass();
  //   })
  // }
  // GetApplicationTypeByCompanyIdGroupId() {
  //   var CId = this.CompanyId;
  //   var GId = this.GroupId;
  //   this.applicationTypeService.GetAllApplicationTypeList(CId, GId).subscribe(response => {
  //     this.ApplicationTypeData = JSON.parse(response);
  //     this.getFilterApplicationType();
  //   })
  // }
  // GetModelByCompanyIdGroupId() {
  //   var CId = this.CompanyId;;
  //   var GId = this.GroupId;
  //   this.modelservice.GetAllModelList(CId, GId).subscribe(response => {

  //     this.ModelData = JSON.parse(response);
  //     this.getFilterModel();
  //   })
  // }
  // GetManufacturerCompanyIdGroupId() {
  //   var CId = this.CompanyId;
  //   var GId = this.GroupId;
  //   this.manufacturerservice.GetAllManufactureList(CId, GId).subscribe(response => {
  //     this.ManufacturerData = JSON.parse(response);
  //     this.getFilterManufacturer();
  //   })
  // }
  // GetOSData() {
  //   var CId = this.CompanyId;
  //   var GId = this.GroupId;
  //   this.operatingsystemservice.GetAllOperatingSystemList(CId, GId).subscribe(response => {
  //     this.OsData = JSON.parse(response);
  //     this.getFilterOperatingSystemName();
  //   })
  // }
  // GetAllAssetCondition() {
  //   this.assetservice.GetAssetConditionList().subscribe(response => {
  //     this.AssetConditionData = JSON.parse(response);
  //     this.getFilterAssetCondition();
  //   })
  // }
  // GetAllPreferFieldsForGRN() {
  //   this.groupservice.GetAllGRNAssetData().subscribe(response => {
  //     this.GRNMandatoryFields = response;
  //   })
  // }
  // GetAllMappedRackedListData() {
  //   this.CId = this.CompanyId;
  //   this.companyrackservice.GetMappedRackListWithRackName(this.CId)
  //     .subscribe(response => {
  //       this.allMappedRackListData = response;
  //       this.getFilterSubLocation();
  //     })
  // }
  // GetCostCenterByCompanyIdGroupId() {
  //   this.CId = this.CompanyId;
  //   this.GId = this.GroupId;
  //   this.costcenterservice.GetAllCostsCenterList(this.CId, this.GId).subscribe(response => {
  //     this.CostCenterData = JSON.parse(response);
  //     this.getFilterCostCenter();
  //   })
  // }  
  // GetAllUOM() {
  //   this.groupservice.GetAllUOMData().subscribe(response => {
  //     this.UOMData = JSON.parse(response);
  //     this.getFilterUOM();
  //   })
  // }
  // GetAllSupplierData() {
  //   this.CId = this.CompanyId;
  //   this.GId = this.GroupId;
  //   this.assetservice.GetAllSupplierListData(this.CId, this.GId).subscribe(response => {
  //     this.allSupplierData = JSON.parse(response);
  //     this.getFilterVendors();
  //   })
  // }
  // GetAllAssetCriticality() {
  //   this.assetservice.GetAssetCriticalityList().subscribe(response => {
  //     this.AssetCriticalityData = JSON.parse(response);
  //     this.getFilterAssetCriticality();
  //   })
  // }
  doublext= /\.\w{2,3}\.\w{2,3}$/;
  fileName :any;
  uploadfile: boolean =false;
  FileUploadValidation(filename,filesize) {
     
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
      this.toastr.error(this.message.fileextensionvalidation, this.message.AssetrakSays);
      return null;
    }
  if( !(filename.endsWith(extension)) )
  {
      this.uploadfile =false;
      this.toastr.error(this.message.fileextensionvalidation, this.message.AssetrakSays);
     return null;
  }
 if( doublextension ==true )
 {
    this.uploadfile =false;
     this.toastr.error(this.message.fileextensionvalidation, this.message.AssetrakSays);
    return null;
  } 
   if(filename.startsWith('.') )
   {
     this.uploadfile =false;
     this.toastr.error(this.message.fileextensionvalidation, this.message.AssetrakSays);
     return null;
  }
   }
   } 
 }
}

