import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Component, OnInit, ViewChild, Inject, ViewEncapsulation, EventEmitter, Output, VERSION, ChangeDetectionStrategy } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupService } from 'app/components/services/GroupService';
import { take, takeUntil } from 'rxjs/operators';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
import * as headers from '../../../../assets/Headers.json';
import * as resource from '../../../../assets/Resource.json';
import * as moment from "moment";
import { default as _rollupMoment } from "moment";
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';

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
import { CompanyLocationService } from '../../services/CompanyLocationService';

import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';

@Component({
  selector: 'app-add-software-page',
  templateUrl: './add-software-page.component.html',
  styleUrls: ['./add-software-page.component.scss']
})
export class AddSoftwarePageComponent implements OnInit {

  message: any = (resource as any).default;
  header: any = (headers as any).default;
  submitted: boolean = false;
  fileList: any[] = [];
  // Only Integer Numbers for GRNDate
  keyPressNumbers(event) {
    const charcode = (event.which) ? event.which : event.keycode;
    if (charcode > 31 && (charcode < 48 || charcode > 57)) {
      return false;
    }
    return true;
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
  public stp1Form: FormGroup;
  public stp2Form: FormGroup;
  public AssetInfo: FormGroup;
  public HardwareInfo: FormGroup;
  public Download: FormGroup;
  public CostForm: FormGroup;
  public Maintenance: FormGroup;
  public OtherInfo: FormGroup;
  public OperatingSystem = "Select Operating System";
  public CPUClass = "Select CPU Class";
  public CPUSubClass = "Select CPU SubClass";
  public ApplicationType = "Select Application Type";
  public Model = "Select Model";
  public Manufacturer = "Select Manufacturer";
  public UOMData: any[] = [];
  public getUploadssetData = {};
  public OsData: any;
  list: any[] = [];
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
  public OSData: any[] = [];
  public CPUClassData: any[] = [];
  public CPUSubClassData: any[] = [];
  public ApplicationTypeData: any[] = [];
  public ModelData: any[] = [];
  public ManufacturerData: any[] = [];
  public CreateOtherinfoData: any;
  public DownloadInfoData: any;
  public hardwareinfodata: any;
  public typeId: any;
  public LcTypes: any[];
  public blockId: any;
  public showAssetType = true;
  public showAssetSubType = true;
  public allMappedRackListData: any[] = [];
  public selectedIndex;
  public allAssetTypeData: any[] = [];
  public plantData: any[] = [];
  public assetClassData: any[] = [];
  public CategoryData: any[] = [];
  public GRNMandatoryFields: any[] = [];
  public CreateAssetData: any;
  public costData: any;
  public showSublocation = true;
  public showAssetCategory = true;
  public maintenanceData: any;
  public CId: Number;
  public GId: Number;
  public TId: Number;
  public UId: Number;
  public TaskId: Number;
  public AssetInfoFormControls: any[] = [];
  public CostFormControls: any[] = [];
  public MaintenanceFormControls: any[] = [];
  public OtherInfoFormControls: any[] = [];
  public DownloadFormControls: any[] = [];
  public HardwareInfoFormControls: any[] = [];
  public enableCostFormField = true;
  public enableMaintainanceField = true;
  public enableOtherInfoField = true;
  public enableDownloadField = true;
  public enableHardwareInfoField = true;
  public addAssetData: any;
  public typeOfSoftwares: any[] = ['Capitalized Software','Others'];
  public LCTypes: any[] = ['Perpetual','Subscription'];
  public RestrictionTypes: any[] = ['Per User', 'Per Core'];
  GroupId: any;
  RegionId: any;
  UserId: any;
  CompanyId: any;

  numericPattern = "^[0-9]*$";
  decimalNumericPattern = "^-?[0-9]\\d*(\\.\\d{1,3})?$";
  residualValuePattern = "^[0-9]+(\.[0-9]{1,2})*$";
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  today = new Date();
  displayedColumns: string[] = ['DocumentType', 'DocumentName', 'DeleteDocument'];
  datasource = new MatTableDataSource();
  uploadAssetData: any;
  get s1() { return this.stp1Form.controls; }
  get s2() { return this.stp2Form.controls; }
  get f1() { return this.AssetInfo.controls; };
  // get f2() { return this.CostForm.controls; };
  get f3() { return this.Maintenance.controls; };
  get f4() { return this.OtherInfo.controls; }
  get f5() { return this.Download.controls; }
  get f6() { return this.HardwareInfo.controls; }
  @Output() insuranceEndDate: EventEmitter<any> = new EventEmitter<any>();
  @Output() AMCEndDate: EventEmitter<any> = new EventEmitter<any>();
  @Output() GetSelectedValue: EventEmitter<any> = new EventEmitter<any>();
  protected _onDestroy = new Subject<void>();
  public requiredValidator = [
    Validators.required
  ]
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
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

  displayedUploadHeaders = [this.header.DocumentType, this.header.uploadFile]
  displayedHardwareInfoHeaders = [this.header.OperatingSystem, this.header.CpuClass, this.header.CpuSubClass, this.header.ApplicationType,
  this.header.Model, this.header.Manufacturer, this.header.HostName, this.header.HDD, this.header.RAM,]

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute,
    public toastr: ToastrService,
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
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    public messageAlertService: MessageAlertService,
    public userDataService: UserService,
    private storage: ManagerService,
    public companyBlockService: CompanyBlockService,
    public companyLocationService: CompanyLocationService,
    public reconciliationService: ReconciliationService
  ) { }

  insuranceFrom: any;
  InsuranceFromForWarrenty: any;
  changeInsuranceStart(dateEvent3) {
    // this.insuranceStartDate.emit(dateEvent3.value);
    this.insuranceFrom = new Date(this.Maintenance.value.InsuranceFrom);
    this.InsuranceFromForWarrenty = new Date(this.insuranceFrom);
  }
  amcStartDate: any;
  amcEndDate: any;
  changeAMCEndDate(dateEvent6) {
    this.AMCEndDate.emit(dateEvent6.value);
  }
  changeAMCStartDate() {
    this.amcStartDate = new Date(this.Maintenance.value.AMCStartDate);
    this.amcEndDate = new Date(this.amcStartDate);
  }
  changeInsuranceEnd(dateEvent4) {
    this.insuranceEndDate.emit(dateEvent4.value);
  }
  nextStep(i) {
    this.selectedIndex = i;
    this.onMaintenanceFormSubmit();
  }
  CheckGRNWithVendor() {
     
    var GRNNo = !this.AssetInfo.value.GRNNo ? "" : this.AssetInfo.value.GRNNo;
    var vendor = !this.AssetInfo.value.Suplier ? "" : this.AssetInfo.value.Suplier.SupplierName;
    var companyId = this.CompanyId;
    var GroupId = this.GroupId;
    if (!!GRNNo && !!vendor) {
      this.loader.open();
      this.assetsService.CheckInvoiceNoForCreateGRN(GRNNo, companyId, GroupId, vendor)
        .subscribe(res => {
           
          this.loader.close();
          if (res === "Duplicate GRN Number and Supplier") {
            this.confirmService.confirm({ message: this.message.DuplicateGRNWarningForSingleCreate, title: this.message.AssetrakSays })
              .subscribe(res => {
                if (!!res) {
                  //this.selectedIndex = 1;
                } else {
                  this.AssetInfo.get("GRNNo").setValue("");
                  this.AssetInfo.get("Suplier").setValue("");
                }
              })
          }
          else {
            //this.selectedIndex = 1;
          }
        })
    }

    //this.onAssetInfoSubmit();
  }
  previousStep(i) {
    this.selectedIndex = i;
  }
  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.nextStep(tabChangeEvent.index);
    this.previousStep(tabChangeEvent.index);
  }

  UploadNameBy: any;
  ngOnInit() {
     
    this.UploadNameBy = localStorage.getItem("uploadNameBy"); //this.route.snapshot.params;

    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);

    this.GetMandatoryByFlag('FAR');
    this.CheckWetherClientCustomizationConfi();


    this.stp1Form = this.fb.group({
      TypeAsst: [''],
      AsstNo: [''],
      LicenseType: ['']
    });

    this.stp2Form = this.fb.group({
    license: ['']
    });

    this.AssetInfo = this.fb.group({
      InventoryNo: [''],
      AssetId: [''],
      SubAssetId: [''],
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
      Room: ['', [Validators.maxLength(30)]],
      Building: [''],
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
      ADL2: ['', [Validators.maxLength(50)]],
      ADL3: ['', [Validators.maxLength(45)]],
      Suplier: [''],
      vendorFilter: [''],
      UsefulLife: ['', [Validators.maxLength(6),Validators.pattern(this.decimalNumericPattern)]],
      ExpiryDate: [{value:'',disabled:false}],
      AssetCondition: [''],
      assetconditionFilter: [''],
      UserEmailId: ['', [Validators.minLength(2), Validators.maxLength(100)]],
      Custodian: ['', [Validators.minLength(2), Validators.maxLength(100)]],
      AcquisitionCost: ['', [Validators.maxLength(17), Validators.pattern(this.decimalNumericPattern)]],
      WDV: ['', [Validators.maxLength(17), Validators.pattern(this.decimalNumericPattern)]],
      WDVDate: ['']

    });

    this.Maintenance = this.fb.group({
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
      WarrantyRemarks: ['', Validators.maxLength(30)]
    })
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
    this.HardwareInfo = this.fb.group({
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
    })

    // if (this.UploadNameBy == 'GRNNo') {
    //   this.AssetInfo.controls['GRNNo'].setValidators([Validators.required]);
    // }
    // else {
    //   this.AssetInfo.controls['InventoryNo'].setValidators([Validators.required]);
    // }
    //this.AssetInfo.get('AssetCategory').disable();
    
    this.custodianFilter();
    this.userFilter();
    this.GetEmpEmailList();
    this.GetAllPreferFieldsForGRN();
    //this.GetAllUOM();
    //this.GetAllAssetCondition();
    //this.GetAllAssetCriticality();
    //this.GetAllSupplierData();
    //this.GetCostCenterByCompanyIdGroupId();
    //this.GetAllMappedRackedListData();
    this.GetAllUploadDoc();
    //this.GetOSData();
    //this.GetAllCPUClassByCompanyIdGroupId();
    //this.GetApplicationTypeByCompanyIdGroupId();
    //this.GetModelByCompanyIdGroupId();
    //this.GetManufacturerCompanyIdGroupId();
    //this.GetAllCPUSubClassByCompanyIdGroupId();
    
    this.GetCategoryAndLocationList();
    this.GetHardwaredata();
    this.CheckWetherApprovalConfigExits();
    this.CheckWetherUsefulLifeConfigExits();
    this.CheckWetherConfigurationExistIsAgentUsedOrNot();
    
    this.AssetInfoFormControls = Object.keys(this.AssetInfo.value);
    this.MaintenanceFormControls = Object.keys(this.Maintenance.value);
    this.OtherInfoFormControls = Object.keys(this.OtherInfo.value);
    this.DownloadFormControls = Object.keys(this.Download.value);
    this.HardwareInfoFormControls = Object.keys(this.HardwareInfo.value);
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}
  ListOfField: any[] = [];
  displayedColumns1: any[] = [];
  mandatoryFields: any[] = [];
  GetMandatoryByFlag(flag) {
     
    this.groupservice.GetMandatoryByFlag(flag).subscribe((response) => {
       
      this.ListOfField = response;
      this.displayedColumns1 = this.ListOfField.filter(x => x.FAR == true).map(choice => choice.FieldsName);
      this.mandatoryFields = this.ListOfField.filter(x => x.FarManadatory == true).map(choice => choice.FieldsName);
      console.log(this.displayedColumns1);
      console.log(this.mandatoryFields);

      this.mandatoryFields.forEach(val => {
         
        if (!!this.AssetInfo.controls[val]) {
          if(val == 'AssetId' || val == 'GRNNo' || val == 'Room' || val == 'ADL2' || val == 'ADL3' || val == 'PONumber' || val == 'InvoiceNo' || val == 'SerialNo' || val == 'ITSerialNo' || val == 'equipmentNo'){
            this.AssetInfo.controls[val].setValidators([Validators.required , this.noWhitespaceValidator]);
          }
          else{
            this.AssetInfo.controls[val].setValidators([Validators.required]);
          }
        }
        else if (!!this.Maintenance.controls[val]) {
          this.Maintenance.controls[val].setValidators([Validators.required]);
        }
        else if (!!this.OtherInfo.controls[val]) {
          this.OtherInfo.controls[val].setValidators([Validators.required]);
        }
        else if (!!this.HardwareInfo.controls[val]) {
          this.HardwareInfo.controls[val].setValidators([Validators.required]);
        }
        else {

        }
      })
      this.getAllClientCustomizationData();
    });
  }

  public onBack() {
    this.router.navigateByUrl('h1/d');
  }
  //============ GRN ===========
  GetAllPreferFieldsForGRN() {
    this.groupservice.GetAllGRNAssetData().subscribe(response => {
      this.GRNMandatoryFields = response;
      this.checkRequiredFields();
      this.EnableFormFields();
    })
  }

  public checkRequiredFields() {
    if (this.CostFormControls) {
      this.GRNMandatoryFields.forEach((element, gindex) => {
        this.CostFormControls.forEach((ele, aindex) => {
          if (element.FieldsName == ele) {
            if (element.GRNMandatory == true) {
              this.CostForm.controls[ele].setValidators([Validators.required]);
            }
          }
        });
      })
    }
    else if (this.MaintenanceFormControls) {
      this.GRNMandatoryFields.forEach((element, gindex) => {
        this.MaintenanceFormControls.forEach((ele, aindex) => {
          if (element.FieldsName == ele) {
            if (element.GRNMandatory == true) {
              this.Maintenance.controls[ele].setValidators([Validators.required]);
            }
          }
        });
      })
    }
    else if (this.OtherInfoFormControls) {
      this.GRNMandatoryFields.forEach((element, gindex) => {
        this.OtherInfoFormControls.forEach((ele, aindex) => {
          if (element.FieldsName == ele) {
            if (element.GRNMandatory == true) {
              this.OtherInfo.controls[ele].setValidators([Validators.required]);
            }
          }
        });
      })
    }
    else if (this.DownloadFormControls) {
      this.GRNMandatoryFields.forEach((element, gindex) => {
        this.DownloadFormControls.forEach((ele, aindex) => {
          if (element.FieldsName == ele) {
            if (element.GRNMandatory == true) {
              this.Download.controls[ele].setValidators([Validators.required]);
            }
          }
        });
      })
    }
    else (this.HardwareInfoFormControls)
    {
      this.GRNMandatoryFields.forEach((element, gindex) => {
        this.HardwareInfoFormControls.forEach((ele, aindex) => {
          if (element.FieldsName == ele) {
            if (element.GRNMandatory == true) {
              this.HardwareInfo.controls[ele].setValidators([Validators.required]);
            }
          }
        });
      })

    }
  }

  public EnableFormFields() {
    if (this.CostFormControls) {
      this.GRNMandatoryFields.forEach((element, gindex) => {
        this.CostFormControls.forEach((ele, aindex) => {
          if (element.FieldsName == ele) {
            if (element.GRN == true) {
              this.enableCostFormField = true;
            }
          }
        });
      })
    }
    else if (this.MaintenanceFormControls) {
      this.GRNMandatoryFields.forEach((element, gindex) => {

        this.MaintenanceFormControls.forEach((ele, aindex) => {
          if (element.FieldsName == ele) {
            if (element.GRN == true) {
              this.enableMaintainanceField = true;
            }
          }
        });

      })
    }
    else if (this.OtherInfoFormControls) {
      this.GRNMandatoryFields.forEach((element, gindex) => {

        this.OtherInfoFormControls.forEach((ele, aindex) => {
          if (element.FieldsName == ele) {
            if (element.GRN == true) {
              this.enableOtherInfoField = true;
            }
          }
        });

      })
    }
    else if (this.DownloadFormControls) {
      this.GRNMandatoryFields.forEach((element, gindex) => {

        this.DownloadFormControls.forEach((ele, aindex) => {
          if (element.FieldsName == ele) {
            if (element.GRN == true) {
              this.enableDownloadField = true;
            }
          }
        });

      })
    }
    else (this.HardwareInfoFormControls)
    {
      this.GRNMandatoryFields.forEach((element, gindex) => {

        this.HardwareInfoFormControls.forEach((ele, aindex) => {
          if (element.FieldsName == ele) {
            if (element.GRN == true) {
              this.enableHardwareInfoField = true;
            }
          }
        });

      })
    }
  }

  //GetUOMData
  // GetAllUOM() {
  //   this.groupservice.GetAllUOMData().subscribe(response => {
  //     this.UOMData = JSON.parse(response);
  //     this.getFilterUOM();
  //   })
  // }
  // //GetAssetConditionData
  // GetAllAssetCondition() {
  //   this.assetservice.GetAssetConditionList().subscribe(response => {
  //     this.AssetConditionData = JSON.parse(response);
  //     this.getFilterAssetCondition();
  //   })
  // }
  // GetAllAssetCriticality() {
  //   this.assetservice.GetAssetCriticalityList().subscribe(response => {
  //     this.AssetCriticalityData = JSON.parse(response);
  //     this.getFilterAssetCriticality();
  //   })
  // }
  //CostCenterByCompanyIdgroupId
  // GetCostCenterByCompanyIdGroupId() {
  //   this.CId = this.CompanyId;
  //   this.GId = this.GroupId;
  //   this.costcenterservice.GetAllCostsCenterList(this.CId, this.GId).subscribe(response => {
  //     this.CostCenterData = JSON.parse(response);
  //     this.getFilterCostCenter();
  //   })
  // }
  // //SupplierListDataByCompanyIdGroupId:vendor list
  // GetAllSupplierData() {
  //   this.CId = this.CompanyId;
  //   this.GId = this.GroupId;
  //   this.assetservice.GetAllSupplierListData(this.CId, this.GId).subscribe(response => {
  //     this.allSupplierData = JSON.parse(response);
  //     this.getFilterVendors();
  //   })
  // }

  // GetCategoryAndLocationList() {
  //       
  //   var groupId = this.GroupId;
  //   var userid = this.UserId;
  //   var companyId = this.CompanyId;
  //   var regionId = this.RegionId;
  //   this.companyBlockService.GetCategoryAndLocationListForReview(groupId, userid, companyId, regionId)
  //     .subscribe(r => {
  //        
  //       var AllData = JSON.parse(r);
  //       this.CategoryList = AllData.AssetCategoryList;
  //       this.LocationList = AllData.AssetLocationList;
  //       this.getFilterPlant();
  //       this.getFilterCategory();
  //     })
  // }
  LocationList = [];
  CategoryList = [];
  AllCategoryList: any[] = [];
  GetCategoryAndLocationList() {
     
    this.loader.open();
    let url1 = this.companyLocationService.GetLocationListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 18);
    let url2 = this.companyBlockService.GetCategoryListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 18);
    let url3 = this.companyrackservice.GetMappedRackListWithRackName(this.CompanyId);
    let url4 = this.groupservice.GetAllUOMData();
    let url5 = this.assetsService.GetAllSupplierListData(this.CompanyId, this.GroupId);
    let url6 = this.assetsService.GetAssetConditionList();
    let url7 = this.assetservice.GetAssetCriticalityList();
    let url8 = this.costcenterservice.GetAllCostsCenterList(this.CompanyId, this.GroupId);

    forkJoin([url1, url2, url3, url4, url5, url6, url7, url8]).subscribe(results => {
       
      this.loader.close();
      if (!!results[0]) {
        this.LocationList = JSON.parse(results[0]);
        this.getFilterPlant();
      }
      if (!!results[1]) {
        this.AllCategoryList = JSON.parse(results[1]);
      }
      if (!!results[2]) {
        this.allMappedRackList = results[2];
        this.allMappedRackListData = results[2];
        this.getFilterSubLocation();
      }
      if (!!results[3]) {
        this.UOMData = JSON.parse(results[3]);
        this.getFilterUOM();
      }
      if (!!results[4]) {
        this.allSupplierData = JSON.parse(results[4]);
        this.getFilterVendors();
      }
      if (!!results[5]) {
        this.AssetConditionData = JSON.parse(results[5]);
        this.getFilterAssetCondition();
      }
      if (!!results[6]) {
        this.AssetCriticalityData = JSON.parse(results[6]);
        this.getFilterAssetCriticality();
      }
      if (!!results[7]) {
        this.CostCenterData = JSON.parse(results[7]);
        this.getFilterCostCenter();
      }
    })
  }
  GetHardwaredata() {
     
    let url1 = this.operatingsystemservice.GetAllOperatingSystemList(this.CompanyId, this.GroupId);
    let url2 = this.cpuclassservice.GetAllCPUClassList(this.CompanyId, this.GroupId);
    let url3 = this.cpusubclassservice.GetAllCPUSubClassList(this.CompanyId, this.GroupId);
    let url4 = this.applicationTypeService.GetAllApplicationTypeList(this.CompanyId, this.GroupId);
    let url5 = this.modelservice.GetAllModelList(this.CompanyId, this.GroupId);
    let url6 = this.manufacturerservice.GetAllManufactureList(this.CompanyId, this.GroupId);

    forkJoin([url1, url2, url3, url4, url5, url6]).subscribe(results => {
       
      if (!!results[0]) {
        this.OsData = JSON.parse(results[0]);
        this.getFilterOperatingSystemName();
      }
      if (!!results[1]) {
        this.CPUClassData = JSON.parse(results[1]);
        this.getFilterCPUClass();
      }
      if (!!results[2]) {
        this.CPUSubClassData = JSON.parse(results[2]);
        this.getFilterCPUsubClass();
      }
      if (!!results[3]) {
        this.ApplicationTypeData = JSON.parse(results[3]);
        this.getFilterApplicationType();
      }
      if (!!results[4]) {
        this.ModelData = JSON.parse(results[4]);
        this.getFilterModel();
      }
      if (!!results[5]) {
        this.ManufacturerData = JSON.parse(results[5]);
        this.getFilterManufacturer();
      }
    })
  }  
  allMappedRackList: any[] = [];
  // GetAllMappedRackedListData() {
  //   this.CId = this.CompanyId;
  //   this.companyrackservice.GetMappedRackListWithRackName(this.CId)
  //     .subscribe(response => {
  //       this.allMappedRackList = response;
  //       this.allMappedRackListData = response;
  //       this.getFilterSubLocation();
  //     })
  // }
  bindSubLocation(value) {
     
    if(!!value){
      this.showSublocation = false;
    this.allMappedRackListData = [];
    this.allMappedRackList.forEach(val => {
      if (val.LocationID == value.LocationId) {
        this.allMappedRackListData.push(val);
      }
    })
    this.getFilterSubLocation();

    }
    else 
    {
      this.showSublocation = true;
      this.allMappedRackListData = []; 
      this.getFilterSubLocation();
    }
    
  }
  GetBlocksOfAssets() {
    this.CId = this.CompanyId;
    var userId = this.UserId;
    // this.groupservice.BlocksOfAssetsGetByCompanyId(this.CId).subscribe(response => {
    this.groupservice.BlocksOfAssetsGetByCompanyIdUserId(this.CId, userId).subscribe(response => {
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
  GetAllAssetTypeData(CatId) {
     
    var companyData = {
      BlockName: CatId,
      CompanyId: this.CompanyId
    }
    this.ITassetservice.GetTypeByBlockJSON(companyData)
      .subscribe(response => {
         
        this.allAssetTypeData = [];
        this.allSubtypeData = [];
        if (CatId != 0 && !!CatId) {
          this.allAssetTypeData = response;
        }
        this.getFilterAssettype();
        this.getFilterAssetSubtype();
      })
  }
  AssetTypeId: any;
  SelectAssetTypeId(event) {
     
    if (!event) {
      this.showAssetSubType = true;
      this.AssetTypeId =  0;
      this.GetAllAssetSubtypeData(this.AssetTypeId);
    } else {
      this.showAssetSubType = false;
      this.AssetTypeId = !!event ? event.TAId : 0;
      this.GetAllAssetSubtypeData(this.AssetTypeId);
    }
  }

  GetAllAssetSubtypeData(AssetTypeId) {
    this.TId = AssetTypeId;
    this.CId = this.CompanyId;
    this.allSubtypeData = [];
    this.ITassetservice.GetAllSubtypeData(this.TId, this.CId)
      .subscribe(response => {
         
        this.allSubtypeData = response;
        this.getFilterAssetSubtype();
      })
  }
  //Upload Document
  GetAllUploadDoc() {
    this.assetservice.GetDocumentTypeId().subscribe(response => {
       
      this.UploaddocsData = [];
      this.list = JSON.parse(response);
      console.log("upload", this.list);
      for (var i = 0; i < this.list.length; i++) {
        if (this.list[i].Displayname == "Asset Photo" || this.list[i].Displayname == "Insurance Policy" || this.list[i].Displayname == "AMC Document" || this.list[i].Displayname == "Invoice" || this.list[i].Displayname == "Software Document" || this.list[i].Displayname == "Other") {
          this.UploaddocsData.push(this.list[i]);
        }
      }
      this.getFilterUpload();
    })
  }
  // GetApplicationTypeByCompanyIdGroupId() {
  //   var CId = this.CompanyId;
  //   var GId = this.GroupId;
  //   this.ApplicationTypeData = [];
  //   this.applicationTypeService.GetAllApplicationTypeList(CId, GId).subscribe(response => {
  //     this.ApplicationTypeData = JSON.parse(response);
  //     this.getFilterApplicationType();
  //   })
  // }
  // GetOSData() {
  //   var CId = this.CompanyId;
  //   var GId = this.GroupId;
  //   this.OsData = [];
  //   this.operatingsystemservice.GetAllOperatingSystemList(CId, GId).subscribe(response => {
  //     this.OsData = JSON.parse(response);
  //     this.getFilterOperatingSystemName();
  //   })
  // }
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

  getFilterUOM() {

    this.filteredUOM.next(this.UOMData.slice());
    this.AssetInfo.controls['uomFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        ;
        this.filterUOMData();
      });

  }
  protected filterUOMData() {

    if (!this.UOMData) {
      return;
    }
    // get the search keyword
    let search = this.AssetInfo.controls['uomFilter'].value;
    if (!search) {
      this.filteredUOM.next(this.UOMData.slice());
      return;
    } else {
      search = search.toLowerCase();

    }
    // filter the UOM
    this.filteredUOM.next(
      this.UOMData.filter(x => x.Unit_Name.toLowerCase().indexOf(search) > -1)
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
    ;
    if (!this.AssetConditionData) {
      return;
    }
    // get the search keyword
    let search = this.AssetInfo.controls['assetconditionFilter'].value;
    if (!search) {
      this.filteredAssetCondition.next(this.AssetConditionData.slice());
      return;
    } else {
      search = search.toLowerCase();

    }
    // filter the Asset_condition
    this.filteredAssetCondition.next(
      this.AssetConditionData.filter(x => x.AssetCondition.toLowerCase().indexOf(search) > -1)
    );
    ;

  }
  getFilterAssetCriticality() {
    
    this.filteredAssetCriticality.next(this.AssetCriticalityData.slice());
    this.AssetInfo.controls['assetcricalityFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        ;
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
    // get the search keyword
    let search = this.AssetInfo.controls['plantFilter'].value;
    if (!search) {
      this.filteredPlant.next(this.LocationList.slice());
      return;
    } else {
      search = search.toLowerCase();

    }
    // filter the Plant
    this.filteredPlant.next(
      this.LocationList.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1)
    );


  }
  getFilterCategory() {

    this.filteredAssetCategory.next(this.CategoryList.slice());
    this.AssetInfo.controls['categoryFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        ;
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
        ;
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
  AssetClassData: any[] = [];
  CatId: any;
  SelectAssetClassId(event) {
     
    this.CategoryList = [];
    this.AssetInfo.controls['CategoryName'].setValue("");
    if (this.AllCategoryList.length > 0) {
      this.AllCategoryList.forEach(element => {
        if (element.AssetCategoryId == event.AssetCategoryId) {
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
    this.CatId = event.AssetCategoryId;
    this.GetAllAssetTypeData(this.CatId);
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
    // get the search keyword
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
    // get the search keyword
    let search = this.Download.controls['UploadFilter'].value;
    if (!search) {
      this.filteredUpload.next(this.UploaddocsData.slice());
      return;
    } else {
      search = search.toLowerCase();

    }
    // filter the data
    this.filteredUpload.next(
      this.UploaddocsData.filter(x => x.Displayname.toLowerCase().indexOf(search) > -1)
    );


  }
  getFilterOperatingSystemName() {
    this.filteredOperatingSystemName.next(this.OsData.slice());
    this.HardwareInfo.controls['OperatingSystemFilter'].valueChanges
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
    let search = this.HardwareInfo.controls['OperatingSystemFilter'].value;
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
  getFilterCPUClass() {

    this.filteredCPUClass.next(this.CPUClassData.slice());
    this.HardwareInfo.controls['CPUClassDataFilter'].valueChanges
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
    let search = this.HardwareInfo.controls['CPUClassDataFilter'].value;
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
    this.HardwareInfo.controls['CPUClasssubDataFilter'].valueChanges
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
    let search = this.HardwareInfo.controls['CPUClasssubDataFilter'].value;
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
    this.HardwareInfo.controls['ApplicationDataFilter'].valueChanges
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
    let search = this.HardwareInfo.controls['ApplicationDataFilter'].value;
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
    this.HardwareInfo.controls['ModelDataFilter'].valueChanges
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
    let search = this.HardwareInfo.controls['ModelDataFilter'].value;
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
    this.HardwareInfo.controls['ManufacturerFilter'].valueChanges
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
    let search = this.HardwareInfo.controls['ManufacturerFilter'].value;
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

  onMaintenanceFormSubmit() {

    if (this.Maintenance.valid) {
      var MaintenanceData = {
        insuranceStart: this.datepipe.transform(this.Maintenance.value.InsuranceFrom, 'dd-MMM-yyyy'),
        insuranceEnd: this.datepipe.transform(this.Maintenance.value.InsuranceTo, 'dd-MMM-yyyy'),
        insuranceVendor: this.Maintenance.value.InsuranceVendor,
        AMCstart: this.datepipe.transform(this.Maintenance.value.AMCStartDate, 'dd-MMM-yyyy'),
        AMCend: this.datepipe.transform(this.Maintenance.value.AMCExpiryDate, 'dd-MMM-yyyy'),
        AMCvendor: this.Maintenance.value.AMCVendor,
        warrantyStartDate: this.datepipe.transform(this.Maintenance.value.InstallationDate, 'dd-MMM-yyyy'),
        warrantyEnd: this.datepipe.transform(this.Maintenance.value.WarrantyExpiryDate, 'dd-MMM-yyyy'),
        warrantyPeriod: this.Maintenance.value.WarrantyPeriod,
        warrantyCost: this.Maintenance.value.WarrantyCost,
        warrantyTerms: this.Maintenance.value.WarrantyTerms,
        remarks: this.Maintenance.value.WarrantyRemarks
      }
      this.maintenanceData = MaintenanceData;
    }
  }

  CheckDuplicate : boolean = true;
  AssetIdDuplicate() {
     
    this.CheckDuplicate = true;
    var AcqDate = !this.AssetInfo.value.AcquisitionDate ? this.datepipe.transform(new Date(), 'dd-MMM-yyyy') : this.datepipe.transform(this.AssetInfo.value.AcquisitionDate, 'dd-MMM-yyyy');
    var assetId = !this.AssetInfo.value.AssetId ? "" : isNaN(this.AssetInfo.value.AssetId) === false ? parseInt(this.AssetInfo.value.AssetId) : this.AssetInfo.value.AssetId;
    var BlockId = !this.AssetInfo.value.BlockOfAsset ? "0" : this.AssetInfo.value.BlockOfAsset.Id;
    var subAssetId = !this.AssetInfo.value.SubAssetId ? "0" : this.AssetInfo.value.SubAssetId;

    let url1 = this.assetsService.IsAssetIdDuplicate(this.CompanyId, this.GroupId, assetId, subAssetId, AcqDate);
    let url2 = this.assetsService.IsAssetIdAndAcqDateDuplicate(this.CompanyId, assetId, AcqDate);
    let url3 = this.assetsService.IsAIDSameDiffBlock(this.CompanyId, assetId, BlockId);
    this.loader.open();
    forkJoin([url1, url2, url3]).subscribe(results => {
       
      this.CheckDuplicate = false;
      this.loader.close();
      if (!!results[0]) {
        var duplicateAsset = results[0];
        if (duplicateAsset === true){
          this.previousStep(0);
          this.AssetInfo.controls['AssetId'].setValue("");
          this.AssetInfo.controls['SubAssetId'].setValue("");
          this.toastr.warning(this.message.AssetIdAlreadyExist, this.message.AssetrakSays);
          this.CheckDuplicate = true;
        }
      }
      else if (!!results[1]) {
        var duplicateAssetAcqDate = results[1];
        if (duplicateAssetAcqDate === true){
          this.previousStep(0);
          this.AssetInfo.controls['AssetId'].setValue("");
          this.AssetInfo.controls['AcquisitionDate'].setValue("");
          this.toastr.warning(this.message.AssetIdAlreadyExist, this.message.AssetrakSays);
          this.CheckDuplicate = true;
        }
      }
      else if (!!results[2]) {
        var duplicateAsset = results[2];
        if (duplicateAsset === true){
          this.previousStep(0);
          this.AssetInfo.controls['AssetId'].setValue("");
          this.AssetInfo.controls['BlockOfAsset'].setValue("");
          this.toastr.warning(this.message.SameAIdDiffBlock, this.message.AssetrakSays);
          this.CheckDuplicate = true;
        }
      }
      else{

      }

      if(this.CheckDuplicate == false){
        this.AddGRNAssetWithAssetID();
      }
    })
  }

  AddGRNAssetWithAssetID() {
     debugger;
    this.loader.open();
    var assetDataList = {
      ADL1: !this.AssetInfo.value.BlockOfAsset ? "" : this.AssetInfo.value.BlockOfAsset.BlockName,
      ADL2: !this.AssetInfo.value.ADL2 ? "" : this.AssetInfo.value.ADL2,
      ADL3: !this.AssetInfo.value.ADL3 ? "" : this.AssetInfo.value.ADL3,
      // AMCExpiryDate: !this.Maintenance.value.AMCExpiryDate ? null : this.JsonDate(this.Maintenance.value.AMCExpiryDate),
      // AMCStartDate: !this.Maintenance.value.AMCStartDate ? null : this.JsonDate(this.Maintenance.value.AMCStartDate),
      AMCExpiryDateInString: !this.Maintenance.value.AMCExpiryDate ? null : new Date(this.Maintenance.value.AMCExpiryDate),
      AMCStartDateInString: !this.Maintenance.value.AMCStartDate ? null : new Date(this.Maintenance.value.AMCStartDate),
      AMCVendor: !this.Maintenance.value.AMCVendor ? null : this.Maintenance.value.AMCVendor,
      AcquisitionCost: !this.AssetInfo.value.AcquisitionCost ? "" : this.AssetInfo.value.AcquisitionCost,
      // AcquisitionDate: !this.AssetInfo.value.AcquisitionDate ? null : this.JsonDate(this.AssetInfo.value.AcquisitionDate),
      AcquisitionDateInString: !this.AssetInfo.value.AcquisitionDate ? null : new Date(this.AssetInfo.value.AcquisitionDate),
      AssetId: !this.AssetInfo.value.AssetId ? "" : isNaN(this.AssetInfo.value.AssetId) === false ? parseInt(this.AssetInfo.value.AssetId) : this.AssetInfo.value.AssetId,
      AssetStage: 2,
      BlockOfAsset: !this.AssetInfo.value.BlockOfAsset ? "" : this.AssetInfo.value.BlockOfAsset.BlockName,
      Building: !this.AssetInfo.value.Building ? "" : this.AssetInfo.value.Building.Description,
      CompanyId: this.CompanyId,
      CustodianEmailId: !this.AssetInfo.value.Custodian ? null : this.AssetInfo.value.Custodian.split("|")[2],
      CustodianName: !this.AssetInfo.value.Custodian ? null : this.AssetInfo.value.Custodian.split("|")[1],
      GroupId: this.GroupId,
      RegionId: this.RegionId,
      ITSerialNo: !this.AssetInfo.value.ITSerialNo ? null : this.AssetInfo.value.ITSerialNo,
      // InstallationDate: !this.Maintenance.value.InstallationDate ? null : this.JsonDate(this.Maintenance.value.InstallationDate),
      // InsuranceFrom: !this.Maintenance.value.InsuranceFrom ? null : this.JsonDate(this.Maintenance.value.InsuranceFrom),
      // InsuranceTo: !this.Maintenance.value.InsuranceTo ? null : this.JsonDate(this.Maintenance.value.InsuranceTo),
      InstallationDateInString: !this.Maintenance.value.InstallationDate ? null : new Date(this.Maintenance.value.InstallationDate),
      InsuranceFromInString: !this.Maintenance.value.InsuranceFrom ? null : new Date(this.Maintenance.value.InsuranceFrom),
      InsuranceToInString: !this.Maintenance.value.InsuranceTo ? null : new Date(this.Maintenance.value.InsuranceTo),
      InsuranceVendor: !this.Maintenance.value.InsuranceVendor ? null : this.Maintenance.value.InsuranceVendor,
      InvoiceNo: !this.AssetInfo.value.InvoiceNo ? null : this.AssetInfo.value.InvoiceNo,
      LastModifiedBy: this.UserId,
      Location: !this.AssetInfo.value.Location ? "" : this.AssetInfo.value.Location.LocationName,
      LocationId: !this.AssetInfo.value.Location ? null : this.AssetInfo.value.Location.LocationId,
      PONumber: !this.AssetInfo.value.PONumber ? null : this.AssetInfo.value.PONumber,
      Quantity: !this.AssetInfo.value.Quantity ? null : this.AssetInfo.value.Quantity,
      Rack: !this.AssetInfo.value.Rack ? "" : this.AssetInfo.value.Rack.RackName,
      Room: !this.AssetInfo.value.Room ? null : this.AssetInfo.value.Room,
      SerialNo: !this.AssetInfo.value.SerialNo ? null : this.AssetInfo.value.SerialNo,
      SubAssetId: !this.AssetInfo.value.SubAssetId ? "0" : this.AssetInfo.value.SubAssetId,
      Suplier: !this.AssetInfo.value.Suplier ? null : this.AssetInfo.value.Suplier.SupplierName,
      TypeOfAsset: !this.AssetInfo.value.typeOfAsset ? null : this.AssetInfo.value.typeOfAsset.TypeOfAsset,
      TAId: !this.AssetInfo.value.typeOfAsset ? 0 : this.AssetInfo.value.typeOfAsset.TAId,
      Unit: !this.AssetInfo.value.Unit ? 'EA' : this.AssetInfo.value.Unit.Unit_Name,
      UsefulLife: !this.AssetInfo.value.UsefulLife ? null : this.AssetInfo.value.UsefulLife,
      UserEmailId: !this.AssetInfo.value.UserEmailId ? null : this.AssetInfo.value.UserEmailId.split("|")[2],
      UserName: !this.AssetInfo.value.UserEmailId ? null : this.AssetInfo.value.UserEmailId.split("|")[1],
      WDV: !this.AssetInfo.value.WDV ? 0 : this.AssetInfo.value.WDV,
      // WDVDate: !this.AssetInfo.value.WDVDate ? null : this.JsonDate(this.AssetInfo.value.WDVDate),
      // WarrantyExpiryDate: !this.Maintenance.value.WarrantyExpiryDate ? null : this.JsonDate(this.Maintenance.value.WarrantyExpiryDate),
      // expiryDate: !this.AssetInfo.value.ExpiryDate ? null : this.JsonDate(this.AssetInfo.value.ExpiryDate),
      WDVDateInString: !this.AssetInfo.value.WDVDate ? null : new Date(this.AssetInfo.value.WDVDate),
      WarrantyExpiryDateInString: !this.Maintenance.value.WarrantyExpiryDate ? null : new Date(this.Maintenance.value.WarrantyExpiryDate),
      expiryDateInString: !this.AssetInfo.value.ExpiryDate ? null : new Date(this.AssetInfo.value.ExpiryDate),
      subTypeOfAsset: !this.AssetInfo.value.subTypeOfAsset ? null : this.AssetInfo.value.subTypeOfAsset.SubTypeOfAsset,
      STAId: !this.AssetInfo.value.subTypeOfAsset ? 0 : this.AssetInfo.value.subTypeOfAsset.STAId,
      CreatedBy: this.UserId,
      ReplacementValue: !this.AssetInfo.value.ReplacementValue ? null : this.AssetInfo.value.ReplacementValue,
      CTId: 0,
      CMId: "",
      OperatingSystem: !this.HardwareInfo.value.OperatingSystem ? null : this.HardwareInfo.value.OperatingSystem.OperatingSystemName,
      CPUClass: !this.HardwareInfo.value.CPUClass ? null : this.HardwareInfo.value.CPUClass.CpuClassName,
      CPUSubClass: !this.HardwareInfo.value.CPUSubClass ? null : this.HardwareInfo.value.CPUSubClass.CpuSubClassName,
      ApplicationType: !this.HardwareInfo.value.ApplicationType ? null : this.HardwareInfo.value.ApplicationType.ApplicationTypeName,
      Model: !this.HardwareInfo.value.Model ? null : this.HardwareInfo.value.Model.ModelName,
      Manufacturer: !this.HardwareInfo.value.Manufacturer ? null : this.HardwareInfo.value.Manufacturer.ManufacturerName,
      uploadBy: "AssetID",//this.UploadNameBy,   //"GRNNo",
      Barcode: !this.AssetInfo.value.InventoryNo ? "" : this.AssetInfo.value.InventoryNo,
      GRNNo: !this.AssetInfo.value.GRNNo ? "" : this.AssetInfo.value.GRNNo,
      HostName: !this.HardwareInfo.value.HostName ? "" : this.HardwareInfo.value.HostName,
      HDD: !this.HardwareInfo.value.HDD ? "" : this.HardwareInfo.value.HDD,
      RAM: !this.HardwareInfo.value.RAM ? "" : this.HardwareInfo.value.RAM,
      WarrantyPeriod: !this.Maintenance.value.WarrantyPeriod ? "" : this.Maintenance.value.WarrantyPeriod,
      WarrantyCost: !this.Maintenance.value.WarrantyCost ? "" : this.Maintenance.value.WarrantyCost,
      WarrantyTerms: !this.Maintenance.value.WarrantyTerms ? "" : this.Maintenance.value.WarrantyTerms,
      WarrantyRemarks: !this.Maintenance.value.WarrantyRemarks ? "" : this.Maintenance.value.WarrantyRemarks,
      AssetCondition: !this.AssetInfo.value.AssetCondition ? null : this.AssetInfo.value.AssetCondition.AssetCondition,
      AssetCriticality: !this.AssetInfo.value.AssetCriticality ? "Normal" : this.AssetInfo.value.AssetCriticality.AssetCriticality,
      equipmentNo: !this.AssetInfo.value.equipmentNo ? null : this.AssetInfo.value.equipmentNo,
      AssetList: JSON.stringify(this.getAllClientCustomizationValues),
      AssetCategoryId: !this.AssetInfo.value.CategoryName ? "0" : this.AssetInfo.value.CategoryName.AssetCategoryId,
      CategoryName: !this.AssetInfo.value.CategoryName ? "" : this.AssetInfo.value.CategoryName.AssetCategoryName,
      PageName: "CreateAsset",
      UserId: this.UserId
    }
     
    var listofdto = [];
    listofdto.push(assetDataList);
    this.uploadservice.UploadNormalAsset(listofdto)
      .subscribe(r => {
         
        this.loader.close();
        var msg = r.split(',')[0];
        this.PrefarId = r.split(',')[1];
        if (msg == "Success") {
          this.toastr.success(this.message.AssetCreateSucess, this.message.AssetrakSays);
        }
        else if (msg == "Fail") {
          this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
        }
        this.uploadDocument();
        this.router.navigate(['h1/d']);
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

  setUploadMissingFile(companyId, filePath, documentType) {
     
    var prefarId = this.PrefarId;//$scope.vm.prefarId1;
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
        this.Download.controls['FileUpload'].setValue(null);
      })
  }

  tinn: any
  allColumnsForCust: any[];
  columnsNameForCust: any[];
  ColumnHeaderNameForCust: any[];
  disableOtherInfo :boolean = false;
  MandatoryOtherInfo :boolean = false;
  getAllClientCustomizationData() {
    debugger;
    var lisTtype = "CreateGrnAsset";
    this.assetsService.GetAllCustomizationDataWithType(lisTtype)
      .subscribe(Response => {
        debugger;
        this.allColumnsForCust = [];
        this.columnsNameForCust = [];
        this.ColumnHeaderNameForCust = [];
        if (Response === "[]" || Response === "" || Response === null) {

        } else {
          var ClientCustColumnname = ['CPPNumber', 'AMCComment', 'ServiceProvider', 'Remark', 'Class', 'AccountingStatus', 'Division','ExpenseAccount','CostAccount','ReserveAccount','Department','Area','Merchandise','Loc2','Loc3','Loc4','Loc5','Account_Clearing','Department_Clearing','GRNDate','InterCompany','AccumulatedDepreciation'];
          var allColumnsForCust = JSON.parse(Response);
          allColumnsForCust.forEach((c) => {
            var idx = ClientCustColumnname.indexOf(c.Columnname);
            var idx1 = this.displayedColumns1.indexOf(c.Columnname);
            if (idx > -1 && idx1 > -1) {
              this.allColumnsForCust.push(c);
            }
             
            if(this.mandatoryFields.indexOf(c.Columnname) > -1){
              this.MandatoryOtherInfo = true;
              this.disableOtherInfo = true;
            }
          })
          debugger;
          console.log("Cust1", this.allColumnsForCust);
          this.ColumnHeaderNameForCust = this.allColumnsForCust;
        }
      })
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
    if(!!this.MandatoryOtherInfo){
      this.disableOtherInfo = true;
      if(this.getAllClientCustomizationValues.length > 0 ){
        this.disableOtherInfo = false;
      }
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

  DocumentType: string;
  FileUpload: string;
  FileExtension: string;
  size: any;
  fileListArray: any[] = [];
  fileChange(event) {
     debugger;
    var isDocumentAlreadyAdded = false;
    this.DocumentType = this.Download.controls['DocumentType'].value;
    if (!this.DocumentType || this.DocumentType == "" || this.DocumentType == null) {
      event.target.value = '';
      this.messageAlertService.alert({ title: this.message.AssetrakSays, message: this.message.SelectDocumentType })
      return false;
    } else {
      var type = this.documentId === 3 ? "Asset Photo" : this.documentId === 4 ? "Insurance Policy" : this.documentId === 5 ? "AMC Document" : this.documentId === 7 ? "Invoice" : this.documentId === 8 ? "Software Document" : "";

      if (this.fileListArray.length > 0) {
        for (var i = 0; i < this.fileListArray.length; i++) {
          if (this.fileListArray[i].DisplayName == type) {
            isDocumentAlreadyAdded = true;
            break;
          }
        }
      }
      if (isDocumentAlreadyAdded == false) {
         
        //this.Download.controls['FileUpload'].setValue(null);

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
            DisplayName: this.displayname,
            DocumentTypeId: this.documentId,
            FileListData: this.fileList[0]
          }
          //this.fileListArray.push(data);

          if (file != null) {
            this.FileExtension = file.substring(file.lastIndexOf('.') + 1, file.length);
          }
        }
        if (this.documentId === 3) {
          var AllowedImageExtensions = [".jpg", ".jpeg", ".png"];
          var index = AllowedImageExtensions.indexOf("." + this.FileExtension);
          if (index > -1) {
            checkFileFlag = true;
          }
          else {
            var msg = "Invalid File Type. Select .jpeg, .jpg or png file";
            this.messageAlertService.alert({ title: this.message.AssetrakSays, message: msg });
            this.Download.controls['FileUpload'].setValue(null);
            return false;
          }
        }
        this.fileListArray.push(data);
        this.Download.controls['FileUpload'].setValue(null);
      } else {
        var msg1 = this.message.FileAlreadyUploaded;
        msg1 = msg1.replace('xxxx', this.DocumentType['Displayname']);
        this.messageAlertService.alert({ title: this.message.AssetrakSays, message: msg1 });
        this.Download.controls['FileUpload'].setValue(null);
      }
      this.onChangeDataSource(this.fileListArray);

    }

    //this.uploadDocuemnt();

  }

  onChangeDataSource(value) {
    this.datasource = new MatTableDataSource(value);
    //this.datasource.sort = this.sort;
    // this.datasource.paginator = this.paginator;
  }

  deleteData(element) {
    this.confirmService.confirm({ message: this.message.DocumentDeleteNotification, title: this.message.AssetrakSays })
      .subscribe(res => {
        if (!!res) {
          var idx = this.fileListArray.indexOf(element);
          if (idx > -1) {
            this.fileListArray.splice(idx, 1);
          }
          this.onChangeDataSource(this.fileListArray);
        }
      })
  }
  maxDate: any;
  maxDateFormat: any;
  minDate: any;
  acqnAndexpiaryDateValidation() {
    debugger;
    if(this.AssetInfo.value.AcquisitionDate) 
    this.maxDateFormat = new Date(this.AssetInfo.value.AcquisitionDate);
    this.maxDate = this.datepipe.transform(this.maxDateFormat, 'dd-MMM-yyyy');
    this.minDate = new Date(this.AssetInfo.value.AcquisitionDate);
  }

  empList: any[] = [];
  empListForCustodian: any[] = [];
  filteredOptions: Observable<string[]>;
  filteredOptionsForCust: Observable<string[]>;
  GetEmpEmailList() {
    var userEmailId = "";
    //this.userDataService.GetEmpEmailForAutoComplete(userEmailId, this.GroupId)
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

  ConfigForCategoryExits: any;
  CheckWetherApprovalConfigExits() {
    var GroupId = this.GroupId;
    this.groupservice.CheckWetherConfigurationExist(GroupId, 23)
      .subscribe(r => {
        this.ConfigForCategoryExits = r;
        if (this.ConfigForCategoryExits == true) {
          this.GetBlocksOfAssets();
        }
        if (!this.ConfigForCategoryExits || this.ConfigForCategoryExits === false) {
          this.GetAllBlocksOfAssets();
          var CatId = 0;
          this.GetAllAssetTypeData(CatId);
        }
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

  GetAllBlocksOfAssets() {
    this.CId = this.CompanyId;
    this.groupservice.BlocksOfAssetsGetByCompanyId(this.CId).subscribe(response => {
      if (response) {
        this.AssetClassData = response;
        this.getFilteredAssetClass();
      }
    })
  }


  clculateAcqCostAndWdvCost = function () {
    var acq = parseFloat(this.AssetInfo.value.AcquisitionCost);
    var wdv = parseFloat(this.AssetInfo.value.WDV);
    if (acq > -1) {
      if (wdv > acq) {
        this.messageAlertService.alert({ title: this.message.AssetrakSays, message: this.message.CostCompare })

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
    this.Maintenance.controls['WarrantyPeriod'].enable();
    this.Maintenance.controls['WarrantyExpiryDate'].setValue(null);
    this.Maintenance.controls['WarrantyPeriod'].setValue(null);
    this.warrantyStart = new Date(this.Maintenance.value.InstallationDate);
    this.maxDateFormatForWarrenty = new Date(this.warrantyStart);

  }


  InstallationDate: any;
  WarrantyEnd: any;
  totalMonth: any;
  calculatePeriod() {

    this.InstallationDate = this.Maintenance.value.InstallationDate._d;
    this.WarrantyEnd = this.Maintenance.value.WarrantyExpiryDate._d;
    this.totalMonth = this.Noofmonths(this.InstallationDate, this.WarrantyEnd);
    this.Maintenance.controls['WarrantyPeriod'].setValue(this.totalMonth);
    //this.Maintenance.controls['WarrantyPeriod'].disable();
    this.WarrantyPeriodEnable = true;
  }


  Noofmonths(InstallationDate, WarrantyEnd) {
    var installationDate = new Date(InstallationDate);
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

    if (!this.Maintenance.value.WarrantyPeriod || this.Maintenance.value.WarrantyPeriod == "") {
      this.WExpiaryDateDisable = false;
      //this.Maintenance.controls['WarrantyEnd'].enable();
      this.WarrantyEndEnable = false;
      this.Maintenance.controls['WarrantyExpiryDate'].setValue(null);

    } else {
      this.WExpiaryDate = this.addMonths(new Date(), parseInt(this.Maintenance.value.WarrantyPeriod));
      this.Maintenance.controls['WarrantyExpiryDate'].setValue(this.WExpiaryDate);
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

  ClientCustmizationExits: any;
  CheckWetherClientCustomizationConfi() {
    var GroupId = this.GroupId;
    this.groupservice.CheckWetherConfigurationExistForClientCust(GroupId, 16)
      .subscribe(response => {
        this.ClientCustmizationExits = response;
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
  
}
