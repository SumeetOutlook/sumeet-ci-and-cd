import { Component, OnInit, Inject, ViewEncapsulation, EventEmitter, ViewChild,Output, VERSION, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {MatTabChangeEvent} from '@angular/material/tabs';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as headers from '../../../../../assets/Headers.json';
import * as resource from '../../../../../assets/Resource.json';
import * as _moment from "moment";
import { default as _rollupMoment } from "moment";
import { Router, ActivatedRoute } from '@angular/router';

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
import {GroupService} from 'app/components/services/GroupService';
import { CompanyRackService } from 'app/components/services/CompanyRackService';
import { LocalStoreService } from 'app/shared/services/local-store.service';
import {ITAssetsService} from 'app/components/services/ITAssetsService';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

const moment = _rollupMoment || _moment;

export const dtFORMAT = {
  parse: {
    dateInput: "DD-MMM-YYYY"
  },
  display: {
    dateInput: "DD-MMM-YYYY"
  }
};

@Component({
  selector: 'app-editassetreview',
  templateUrl: './edit_popup.component.html',
  styleUrls: ['./edit_popup.component.scss'],
  providers: [
    DatePipe,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: dtFORMAT }]
})
export class EditAssetPopupComponent implements OnInit {
  
  message: any = (resource as any).default;
  header: any ;
  submitted: boolean = false;
  public DocumentType = "Select Document Type";
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
  public CompanyId: any;
  public UserId: any;
  public GroupId: any;
  public typeId: any;
  public blockId: any;
  public showSubLocation = true;
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
  public enableAssetFormField = true;
  public enableCostFormField = true;
  public enableMaintainanceField = true;
  public enableOtherInfoField = true;
  public enableDownloadField = true;
  public enableHardwareInfoField = true;
  public addAssetData: any;
  public numericPattern = "^[0-9]*$";
  public decimalNumericPattern = "^[0-9]{0,13}(\.[0-9]{1,3})*$";
  public residualValuePattern = "^[0-9]+(\.[0-9]{1,2})*$";
  displayedColumns: string[] = ['DocumentType', 'DocumentName', 'DeleteDocument'];
  datasource = new MatTableDataSource();
  uploadAssetData: any;
  public AssetInfo: FormGroup;
  public HardwareInfo: FormGroup;
  public Download: FormGroup;
  public CostForm: FormGroup;
  public Maintenance: FormGroup;
  public OtherInfo: FormGroup;
  checkRequired : boolean = false;

  get f1() { return this.AssetInfo.controls; };
  get f2() { return this.CostForm.controls; };
  get f3() { return this.Maintenance.controls; };
  get f4() { return this.OtherInfo.controls; }
  get f5() { return this.Download.controls; }
  get f6() { return this.HardwareInfo.controls; }

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
  protected _onDestroy = new Subject<void>();

  public requiredValidator = [
    Validators.required
  ]

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
  
  displayedHeaders :any []= [] 
  
  
  displayedCostHeaders :any [] = []
  
  displayedMaintenanceHeaders:any[] = [];
  
  displayedOtherInfoHeaders:any[] = []
  
  displayedUploadHeaders:any [] = []
  
  displayedHardwareInfoHeaders: any[];
  
  
    // Only Integer Numbers for GRNDate
    keyPressNumbers(event) {
      const charcode = (event.which) ? event.which : event.keycode;
      if (charcode > 31 && (charcode < 48 || charcode > 57)) {
        return false;
      }
      return true;
    }
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  //protected _onDestroy = new Subject<void>();
  //public selectedIndex;
  //displayedColumns: string[] =['DocumentType','DocumentName','DeleteDocument'];
  //datasource=new MatTableDataSource();

  constructor(
  public dialogRef: MatDialogRef<EditAssetPopupComponent>,@Inject(MAT_DIALOG_DATA) public data: any,
  private fb: FormBuilder,public toastr: ToastrService,private router: Router,
  public datepipe: DatePipe,
  public applicationTypeService:ApplicationTypeService,
  public assetservice:AssetService,
  public groupservice:GroupService,
  public costcenterservice:CostCenterService,
  public modelservice:ModelService,
  public cpuclassservice:CpuClassService,
  public cpusubclassservice:CpuSubClassService,
  public companyservice:CompanyService,
  public operatingsystemservice:OperatingSystemService,
  public manufacturerservice:ManufacturerService,
  public usermappingservice:UserMappingService,
  public uploadservice:UploadService,
  public companyrackservice:CompanyRackService,
  public localService:LocalStoreService,
  public ITassetservice:ITAssetsService,
  private jwtAuth:JwtAuthService) 
  {
    this.header = this.jwtAuth.getHeaders()

    this.displayedHeaders  = [this.header.InventoryNumber, this.header.AssetNo, this.header.SAID, this.header.UOM, this.header.Quantity, this.header.AcquisitionDate, this.header.GRNNo,
      this.header.PONumber, this.header.InvoiceNo, this.header.SerialNo, this.header.ITSerialNo, this.header.EquipmentNumber, this.header.Location,
      this.header.StorageLocation, this.header.Room, this.header.CostCenter, this.header.AssetCriticality, this.header.AssetClass, this.header.AssetCategory,
      this.header.AssetType, this.header.AssetSubtype, this.header.ADL2, this.header.ADL3, this.header.ThirdPartyName,
      this.header.UsefulLife, this.header.AssetExpiryDate, this.header.AssetCondition, this.header.User, this.header.Custodian];
    
      this.displayedCostHeaders =  [this.header.Cost, this.header.WDV, this.header.WDVDate, this.header.ReplacementValue]

      this.displayedMaintenanceHeaders = [this.header.InsuranceFrom, this.header.InsuranceTo, this.header.InsuranceVendor, this.header.AMCStartDate, this.header.AMCEndDate,
        this.header.AMCVendor, this.header.InstallationDate, this.header.WarrantyExpiryDate, this.header.WarrantyPeriod, this.header.WarrantyCost,
        this.header.WarrantyTerms, this.header.WarrantyRemarks]

      this.displayedOtherInfoHeaders = [this.header.IsMetal, this.header.CPPNumber, this.header.AMCComment, this.header.Budget,
        this.header.GRNDate, this.header.Description, this.header.Remark, this.header.AccountingStatus, this.header.Division,
        this.header.ExpenseAccount, this.header.CostAccount, this.header.ReserveAccount, this.header.Department, this.header.Area, this.header.Merchandise,
        this.header.InterCompany, this.header.ServiceProvider, this.header.AccumulatedDepreciation, this.header.Class, this.header.Loc2,
        this.header.Loc3, this.header.Loc4, this.header.Loc5, this.header.FutureUse, this.header.InterUnit, this.header.Account_Clearing,
        this.header.Department_Clearing, this.header.Comments, this.header.Upl, this.header.DepreciationReserve, this.header.Project,
        this.header.AmortizationStartDate, this.header.AmortizeNBV, this.header.LifeInMonths, this.header.Messages,]

        this.displayedUploadHeaders =  [this.header.DocumentType, this.header.uploadFile]

        this.displayedHardwareInfoHeaders = [this.header.OperatingSystem, this.header.CpuClass, this.header.CpuSubClass, this.header.ApplicationType,
          this.header.Model, this.header.Manufacturer, this.header.HostName, this.header.HDD, this.header.RAM,]
   }

  nextStep(i){
       this.selectedIndex=i;
       //console.log(i);
  }
  previousStep(i){
      this.selectedIndex=i;
      console.log(i);
  }

  public tabChanged(tabChangeEvent:MatTabChangeEvent):void{
    this.nextStep(tabChangeEvent.index);
    this.previousStep(tabChangeEvent.index);
   
  }
  ngOnInit() {
    debugger;
    this.buildItemForm();
    this.GetAllPreferFieldsForGRN();
    this.GetAllUOM();
    this.GetAllAssetCondition();
    this.GetAllAssetCriticality();
    this.GetBlocksOfAssets();
    this.GetAllSupplierData();

    this.GetAllAssetSubtypeData();
   
    this.GetLocationByCompanyID();
    this.GetCostCenterByCompanyIdGroupId();
    this.GetAllAssetTypeData();
    this.GetAllMappedRackedListData();

    this.GetAllCategoryData();
    this.GetAllUploadDoc();
    this.GetOSData();
    this.GetAllCPUClassByCompanyIdGroupId();
    this.GetApplicationTypeByCompanyIdGroupId();
    this.GetModelByCompanyIdGroupId();
    this.GetManufacturerCompanyIdGroupId();
    this.GetAllCPUSubClassByCompanyIdGroupId();
    debugger;
    this.AssetInfoFormControls = Object.keys(this.AssetInfo.value);
    this.CostFormControls = Object.keys(this.CostForm.value);
    this.MaintenanceFormControls = Object.keys(this.Maintenance.value);
    this.OtherInfoFormControls = Object.keys(this.OtherInfo.value);
    this.DownloadFormControls = Object.keys(this.Download.value);
    this.HardwareInfoFormControls = Object.keys(this.HardwareInfo.value);
  
 
    }

    ngOnDestroy(): void {
      this._onDestroy.next();
      this._onDestroy.complete();
    }

    buildItemForm() {
      this.AssetInfo = this.fb.group({
        AssetID :  [{value:''}],
        InventoryNo: [{value:''}],
        AssetNo: [{value:''}],
        SubNo: [{value:''}],
        AssetClass: [{value:''}],
        AssetType: [''],
        AssetTypeFilter: [''],
        AssetSubType: [''],
        AssetSubTypeFilter: [''],
        CapitalizationDate: [{value:''}],
        Qty: [{value:''}],
        Plant: [{value:''}],
        SubLocation: [''],
        SubLocationFilter: [''],
        AssetCondition: [''],
        AssetCricality: [''],
        GRNNo: [''],
        Room: [''],
        UOM: [''],
        UOMFilter: [''],
        AssetName: [{value:'',disabled:true}],
        AssetDescription: [''],
        VendorName: [''],
        VendorNameFilter: [''],
        CostCenterFilter: [''],
        PONo: [{value:'',disabled:true}],
        InvoiceNo: [{value:'',disabled:true}],
        SerialNo: [''],
        CostCenter: [''],
        ITSerialNo: [''],
        UsefulLife: [{value:'',disabled:true}],
        AssetExpiryDate: [''],
        User: [{value:'',disabled:true}],
        Custodian: [{value:'',disabled:true}],
        EquipmentNumber: [''],
        asset_condition:[''],
        assettypeFilter:[''],
        AssetCategory:[''],
        costCenterFilter:[''],
        AssetLocation:[''],
      })
      this.CostForm = this.fb.group({
        Cost: [{value:'',disabled:true}],
        WDV: [{value:'',disabled:true}],
        DepnRunDate: [{value:'',disabled:true}],
        ResidualValue: [''],
      })
      this.Maintenance = this.fb.group({
        InsuranceStart: [{value:'',disabled:true}],
        InsuranceEnd: [{value:'',disabled:true}],
        InsuranceVendor: [{value:'',disabled:true}],
        AMCStart: [{value:'',disabled:true}],
        AMCEnd: [{value:'',disabled:true}],
        AMCVendor: [{value:'',disabled:true}],
        WarrantyEnd: [{value:'',disabled:true}],
        WarrantyStartDate: [{value:'',disabled:true}],
        WarrantyPeriod: [''],
        WarrantyCost: [''],
        WarrantyTerms: [''],
        Remarks: [''],
        InsuranceTo:[''],
      })
      this.OtherInfo = this.fb.group({
        IsMetal: [''],
        CPPNumber: [''],
        AMCComment: [''],
        Budget: [''],
        GRNDate: [''],
        Description:[''],
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
        Loc2:[''],
        Loc3:[''],
        Loc4:[''],
        Loc5:[''],
        FutureUse:[''],
        InterUnit:[''],
        AccountClearing:[''],
        DepartmentClearing:[''],
        Comments:[''],
        Upl:[''],
        DepreciationReserve:[''],
        Project:[''],
        AmortizationStartDate:[''],
        AmortizeNBV:[''],
        LifeInMonths:[''],
        Messages:[''],
      })
      this.Download=this.fb.group({
        DocumentType:[''],
        DocumentTypeFilter:[''],
        FileUpload:['']
      })
      this.HardwareInfo = this.fb.group({
        OperatingSystem: [''],
        OperatingSystemFilter: [''],
        CPUClass: [''],
        CPUClassFilter: [''],
        CPUSubClass: [''],
        CPUSubClassFilter: [''],
        ApplicationType: [''],
        ApplicationTypeFilter: [''],
        Model: [''],
        ModelFilter: [''],
        Manufacturer: [''],
        ManufacturerFilter: [''],
        HostName: [''],
        HDD: [''],
        RAM: [''],
        ModelDataFilter:[''],
      })


      if(this.data.component1 == 'ReviewComponent')
    {
     
      this.AssetInfo.controls['InventoryNo'].setValue(this.data.name.Barcode),
      this.AssetInfo.controls['AssetID'].setValue(this.data.name.AssetID),     
      this.AssetInfo.controls['SubAssetID'].setValue(this.data.name.SubAssetID),
      this.AssetInfo.controls['uomFilter'].setValue(this.data.name.Unit)
      this.AssetInfo.controls['Quantity'].setValue(this.data.name.Quantity),
      this.AssetInfo.controls['AcquisitionDate'].setValue(this.data.name.AcquisitionDate),     
      this.AssetInfo.controls['GRNNo'].setValue(this.data.name.GRNNo),
      this.AssetInfo.controls['PONumber'].setValue(this.data.name.PONumber)
      this.AssetInfo.controls['InvoiceNo'].setValue(this.data.name.InvoiceNo),
      this.AssetInfo.controls['SerialNo'].setValue(this.data.name.SerialNo),     
      this.AssetInfo.controls['ITSerialNo'].setValue(this.data.name.ITSerialNo),
      this.AssetInfo.controls['EquipmentNumber'].setValue(this.data.name.EquipmentNumber),
      this.AssetInfo.controls['AssetLocation'].setValue(this.data.name.Locationlist),
      this.AssetInfo.controls['StorageLocation'].setValue(this.data.name.StorageLocation),     
      this.AssetInfo.controls['Room'].setValue(this.data.name.Room),
      this.AssetInfo.controls['CostCenter'].setValue(this.data.name.building)
      this.AssetInfo.controls['asset_criticality'].setValue(this.data.name.asset_criticality),
      this.AssetInfo.controls['AssetClass'].setValue(this.data.name.AssetClass),     
      this.AssetInfo.controls['AssetCategory'].setValue(this.data.name.AssetCategory),
      this.AssetInfo.controls['TypeOfAsset'].setValue(this.data.name.TypeOfAsset)
      this.AssetInfo.controls['SubTypeOfAsset'].setValue(this.data.name.SubTypeOfAsset),
      this.AssetInfo.controls['ADL2'].setValue(this.data.name.ADL2),     
      this.AssetInfo.controls['ADL3'].setValue(this.data.name.ADL3),
      this.AssetInfo.controls['Suplier'].setValue(this.data.name.Suplier),
      this.AssetInfo.controls['UsefulLife'].setValue(this.data.name.UsefulLife),
      this.AssetInfo.controls['ExpiryDate'].setValue(this.data.name.ExpiryDate),     
      this.AssetInfo.controls['asset_condition'].setValue(this.data.name.assetcondition),

      this.CostForm.controls['AcquisitionCost'].setValue(this.data.name.AcquisitionCost)
      this.CostForm.controls['WDV'].setValue(this.data.name.WDV),
      this.CostForm.controls['DepnRunDate'].setValue(this.data.name.DepnRunDate),     
      this.CostForm.controls['ResidualValue'].setValue(this.data.name.ResidualValue),

      this.Maintenance.controls['InsuranceFrom'].setValue(this.data.name.InsuranceFrom)
      this.Maintenance.controls['InsuranceTo'].setValue(this.data.name.InsuranceTo),
      this.Maintenance.controls['InsuranceVendor'].setValue(this.data.name.InsuranceVendor),     
      this.Maintenance.controls['AMCStart'].setValue(this.data.name.AMCStart),
      this.Maintenance.controls['AMCEnd'].setValue(this.data.name.AMCEnd),
      this.Maintenance.controls['AMCVendor'].setValue(this.data.name.AMCVendor)
      this.Maintenance.controls['WarrantyStartDate'].setValue(this.data.name.WarrantyStartDate),
      this.Maintenance.controls['WarrantyEnd'].setValue(this.data.name.WarrantyEnd),     
      this.Maintenance.controls['WarrantyPeriod'].setValue(this.data.name.WarrantyPeriod),
      this.Maintenance.controls['WarrantyCost'].setValue(this.data.name.WarrantyCost),
      this.Maintenance.controls['WarrantyTerms'].setValue(this.data.name.WarrantyTerms)
      this.Maintenance.controls['Remarks'].setValue(this.data.name.Remarks),

      this.OtherInfo.controls['IsMetal'].setValue(this.data.name.IsMetal),     
      this.OtherInfo.controls['CPPNumber'].setValue(this.data.name.CPPNumber),
      this.OtherInfo.controls['AMCComment'].setValue(this.data.name.AMCComment),
      this.OtherInfo.controls['Budget'].setValue(this.data.name.Budget)
      this.OtherInfo.controls['GRNDate'].setValue(this.data.name.GRNDate),
      this.OtherInfo.controls['Remark'].setValue(this.data.name.Remark),     
      this.OtherInfo.controls['AccountingStatus'].setValue(this.data.name.AccountingStatus),
      this.OtherInfo.controls['Division'].setValue(this.data.name.Division),

      this.OtherInfo.controls['ExpenseAccount'].setValue(this.data.name.ExpenseAccount),     
      this.OtherInfo.controls['CostAccount'].setValue(this.data.name.CostAccount),
      this.OtherInfo.controls['ReverseAccount'].setValue(this.data.name.ReverseAccount),
      this.OtherInfo.controls['Department'].setValue(this.data.name.Department)
      this.OtherInfo.controls['Area'].setValue(this.data.name.Area),
      this.OtherInfo.controls['Merchandise'].setValue(this.data.name.Merchandise),     
      this.OtherInfo.controls['InterCompany'].setValue(this.data.name.InterCompany),
      this.OtherInfo.controls['ServiceProvider'].setValue(this.data.name.ServiceProvider),

      this.OtherInfo.controls['AccumulatedDepreciation'].setValue(this.data.name.AccumulatedDepreciation),     
      this.OtherInfo.controls['Class'].setValue(this.data.name.Class),
      this.OtherInfo.controls['Loc2'].setValue(this.data.name.Loc2),
      this.OtherInfo.controls['Loc3'].setValue(this.data.name.Loc3)
      this.OtherInfo.controls['Loc4'].setValue(this.data.name.Loc4),
      this.OtherInfo.controls['Loc5'].setValue(this.data.name.Loc5),     
      this.OtherInfo.controls['FutureUse'].setValue(this.data.name.FutureUse),
      this.OtherInfo.controls['InterUnit'].setValue(this.data.name.InterUnit),
      this.OtherInfo.controls['AccountClearing'].setValue(this.data.name.AccountClearing),     
      this.OtherInfo.controls['DepartmentClearing'].setValue(this.data.name.DepartmentClearing),
      this.OtherInfo.controls['Comments'].setValue(this.data.name.Comments),
      this.OtherInfo.controls['Upl'].setValue(this.data.name.Upl)
      this.OtherInfo.controls['DepreciationReserve'].setValue(this.data.name.DepreciationReserve),
      this.OtherInfo.controls['Project'].setValue(this.data.name.Project),     
      this.OtherInfo.controls['AmortizationStartDate'].setValue(this.data.name.AmortizationStartDate),
      this.OtherInfo.controls['AmortizeNBV'].setValue(this.data.name.AmortizeNBV),
      this.OtherInfo.controls['LifeInMonths'].setValue(this.data.name.LifeInMonths),     
      this.OtherInfo.controls['Messages'].setValue(this.data.name.Messages),

      this.Download.controls['DocumentType'].setValue(this.data.name.DocumentType),
      this.Download.controls['FileUpload'].setValue(this.data.name.FileUpload),

      this.HardwareInfo.controls['OperatingSystem'].setValue(this.data.name.OperatingSystem),
      this.HardwareInfo.controls['CPUClass'].setValue(this.data.name.CPUClass),     
      this.HardwareInfo.controls['CPUSubClass'].setValue(this.data.name.CPUSubClass),
      this.HardwareInfo.controls['ApplicationType'].setValue(this.data.name.ApplicationType),
      this.HardwareInfo.controls['Model'].setValue(this.data.name.Model),
      this.HardwareInfo.controls['Manufacturer'].setValue(this.data.name.Manufacturer),     
      this.HardwareInfo.controls['HostName'].setValue(this.data.name.HostName),
      this.HardwareInfo.controls['HDD'].setValue(this.data.name.HDD),
      this.HardwareInfo.controls['RAM'].setValue(this.data.name.RAM)    
      
    }
    }  
    onclosetab(){
      debugger;
      this.dialogRef.close();
    }


      //create asset date
changeCapitlizationDate(dateEvent) {
  this.capitlizationDate.emit(dateEvent.value);
}
changeAssetExpiryDate(dateEvent1) {
  this.assetexpiryDate.emit(dateEvent1.value);
}
//cost date
changeDepnRunDate(dateEvent2) {
  this.depnrunDate.emit(dateEvent2.value);
}
//Maintennance date
changeInsuranceStart(dateEvent3) {
  this.insuranceStartDate.emit(dateEvent3.value);
}
changeInsuranceEnd(dateEvent4) {
  this.insuranceEndDate.emit(dateEvent4.value);
}
changeAMCStartDate(dateEvent5) {
  this.AMCStartDate.emit(dateEvent5.value);
}
changeAMCEndDate(dateEvent6) {
  this.AMCEndDate.emit(dateEvent6.value);
}
changeWarrantyStartDate(dateEvent7) {
  this.warrantyStartDate.emit(dateEvent7.value);
}
changeWarrantyEndDate(dateEvent8) {
  this.warrantyEndDate.emit(dateEvent8.value);
}

//OtherInfo Date
chargeGRNDate(dateEvent) {
  this.GRNDate.emit(dateEvent.value);
}

    public onBack() {
      this.router.navigateByUrl('h1/a')
    }
//GetPreferFieldsDataForGRN
GetAllPreferFieldsForGRN() {

this.groupservice.GetAllGRNAssetData().subscribe(response => {

  this.GRNMandatoryFields = response;
  this.checkRequiredFields();
  this.EnableFormFields();
})
}

public checkRequiredFields() {
debugger;
if (this.AssetInfoFormControls) {
  debugger;
  this.GRNMandatoryFields.forEach((element, gindex) => {

    this.AssetInfoFormControls.forEach((ele, aindex) => {
      if (element.FieldsName == ele) {
        if (element.GRNMandatory === true) {
          this.AssetInfo.controls[ele].setValidators([Validators.required]);              
        }
      }
    });

  })
}
else if (this.CostFormControls) {
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
else if(this.MaintenanceFormControls)
{
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
else(this.HardwareInfoFormControls)
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
debugger;
if (this.AssetInfoFormControls) {
  this.GRNMandatoryFields.forEach((element, gindex) => {

    this.AssetInfoFormControls.forEach((ele, aindex) => {
      if (element.FieldsName == ele) {
        if (element.GRN == true) {
          this.enableAssetFormField = true;
        }
        //  else
        //  {
        //   this.enableAssetFormField=true;

        //  }
      }
    });

  })
}
else if (this.CostFormControls) {
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
GetAllUOM() {
this.groupservice.GetAllUOMData().subscribe(response => {

  this.UOMData = JSON.parse(response);
  this.getFilterUOM();
})
}

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
console.log(this.filteredUOM);
}

//GetAssetConditionData
GetAllAssetCondition() {

this.assetservice.GetAssetConditionList().subscribe(response => {

  this.AssetConditionData = JSON.parse(response);
  this.getFilterAssetCondition();
})
}

getFilterAssetCondition() {
;
this.filteredAssetCondition.next(this.AssetConditionData.slice());
this.AssetInfo.controls['assetconditionFilter'].valueChanges
  .pipe(takeUntil(this._onDestroy))
  .subscribe(() => {
    ;
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
console.log(this.filteredAssetCondition);
}


//GetAssetCriticalityData
GetAllAssetCriticality() {

this.assetservice.GetAssetCriticalityList().subscribe(response => {
  ;
  this.AssetCriticalityData = JSON.parse(response);
  this.getFilterAssetCriticality();
})
}
getFilterAssetCriticality() {
;
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
;
console.log(this.filteredAssetCriticality);
}

//CostCenterByCompanyIdgroupId
GetCostCenterByCompanyIdGroupId() {

this.CId = 2;
this.GId = 2;
this.costcenterservice.GetAllCostsCenterList(this.CId, this.GId).subscribe(response => {

  this.CostCenterData = JSON.parse(response);
  this.getFilterCostCenter();
})
}

getFilterCostCenter() {

this.filteredCostCenter.next(this.CostCenterData.slice());
this.AssetInfo.controls['costCenterFilter'].valueChanges
  .pipe(takeUntil(this._onDestroy))
  .subscribe(() => {
    ;
    this.filterCostCenterData();
  });

}
protected filterCostCenterData() {
;
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
;
console.log(this.filteredCostCenter);
}

//SupplierListDataByCompanyIdGroupId:vendor list
GetAllSupplierData() {

this.CId = 1;
this.GId = 2;
this.assetservice.GetAllSupplierListData(this.CId, this.GId).subscribe(response => {

  this.allSupplierData = JSON.parse(response);
  this.getFilterVendors();
})
}
getFilterVendors() {
;
this.filteredVendor.next(this.allSupplierData.slice());
this.AssetInfo.controls['vendorFilter'].valueChanges
  .pipe(takeUntil(this._onDestroy))
  .subscribe(() => {
    ;
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

console.log(this.filteredVendor);
}

//AllCategoryData
GetAllCategoryData() {
this.ITassetservice.GetAllCategoryData().subscribe(response => {

  this.CategoryData = response;
  this.getFilterCategory();
})
}

getFilterCategory() {

this.filteredAssetCategory.next(this.CategoryData.slice());
this.AssetInfo.controls['categoryFilter'].valueChanges
  .pipe(takeUntil(this._onDestroy))
  .subscribe(() => {
    ;
    this.filterCategoryData();
  });

}


protected filterCategoryData() {

if (!this.CategoryData) {
  return;
}
// get the search keyword
let search = this.AssetInfo.controls['categoryFilter'].value;
if (!search) {
  this.filteredAssetCategory.next(this.CategoryData.slice());
  return;
} else {
  search = search.toLowerCase();

}
// filter the Asset category
this.filteredAssetCategory.next(
  this.CategoryData.filter(x => x.AssetCategoryName.toLowerCase().indexOf(search) > -1)
);

console.log(this.filteredAssetCategory);
}
//TypeByBloickJSON
GetAllAssetTypeData() {
var companyData = {
  BlockName: 1,
  CompanyId: 1
}
this.ITassetservice.GetTypeByBlockJSON(companyData).subscribe(response => {
  this.allAssetTypeData = response;
  this.getFilterAssettype();
})
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

console.log(this.filteredAssetType);
}


//SubTypeDataByTypeIdCompanyId
GetAllAssetSubtypeData() {

this.TId = 1;
this.CId = 1;
this.ITassetservice.GetAllSubtypeData(this.TId, this.CId).subscribe(response => {

  this.allSubtypeData = response;
  this.getFilterAssetSubtype();
})
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

console.log(this.filteredAssetSubtype);
}

//LocationDataByCompanyIdUserId
GetAllLocatioByCompanyIdUserId() {

this.TaskId = 6;
this.CId = 2;
this.UId = 8;
this.usermappingservice.GetUsersLocationsByTaskIdsCompanyUserId(this.TaskId, this.CId, this.UId).subscribe(response => {

  console.log(response);
  // this.allLocationData = response;
  this.allLocationData = response.split(',');
  this.GetPlantData();
})

}

//LocationDataByCompanyId
GetLocationByCompanyID() {

this.CId = 2;
this.groupservice.LocationGetByCompanyId(this.CId).subscribe(response => {
  console.log(response);
  this.locationData = response;
  if(response)
  {
    this.GetAllLocatioByCompanyIdUserId();
  }
})

}
//Plantdata
GetPlantData() {
debugger
console.log(this.locationData, this.allLocationData);

this.locationData.forEach((element, cindex) => {
  this.allLocationData.forEach((ele, uindex) => {
    if (element.LocationId == ele) {
      this.plantData.push(element);
    }
    this.getFilterPlant();
  })
});
console.log(this.plantData);

}


getFilterPlant() {

this.filteredPlant.next(this.plantData.slice());
this.AssetInfo.controls['plantFilter'].valueChanges
  .pipe(takeUntil(this._onDestroy))
  .subscribe(() => {

    this.filterPlant();
  });

}
protected filterPlant() {

if (!this.plantData) {
  return;
}
// get the search keyword
let search = this.AssetInfo.controls['plantFilter'].value;
if (!search) {
  this.filteredPlant.next(this.plantData.slice());
  return;
} else {
  search = search.toLowerCase();

}
// filter the Plant
this.filteredPlant.next(
  this.plantData.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1)
);

console.log(this.filteredPlant);
}
//MappedRackedListCompanyId=>For Sublocation
GetAllMappedRackedListData() {

this.CId = 2;
this.companyrackservice.GetMappedRackListWithRackName(this.CId).subscribe(response => {

  this.allMappedRackListData = response;
  this.getFilterSubLocation();
})
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

console.log(this.filteredSubLocation);
}


//UsersBlocksData
GetAllUsersBlocksData() {
debugger;
this.TaskId = 6;
this.CId = 2;
this.UId = 9;
this.usermappingservice.GetUsersBlocksData(this.TaskId, this.CId, this.UId).subscribe(response => {
  debugger;
  if (response !== '') {
    this.allUsersBlocksData = response.split(',');
  }
  else {
    this.allUsersBlocksData = response;
  }
  this.GetAssetClassData();
})
}
//BlocksOfAssetsData
GetBlocksOfAssets() {
debugger;
this.CId = 2;
this.groupservice.BlocksOfAssetsGetByCompanyId(this.CId).subscribe(response => {
  debugger;
  this.blocksofAssetData = response;
  if (response) {
this.GetAllUsersBlocksData();
   
  }
})
}



GetAssetClassData() {
debugger;
if (this.allUsersBlocksData !== '') {
  this.blocksofAssetData.forEach((element, cindex) => {
    this.allUsersBlocksData.forEach((ele, uindex) => {
      if (element.Id == ele) {
        this.assetClassData.push(element);
      }
      this.getFilteredAssetClass();
    })
  });
}
else {
  this.assetClassData = this.blocksofAssetData;
  this.getFilteredAssetClass();
}

}

getFilteredAssetClass() {

this.filteredAssetClass.next(this.assetClassData.slice());
this.AssetInfo.controls['AssetClassFilter'].valueChanges
  .pipe(takeUntil(this._onDestroy))
  .subscribe(() => {
    this.filterAssetClass();
  });

}
protected filterAssetClass() {

if (!this.assetClassData) {
  return;
}
// get the search keyword
let search = this.AssetInfo.controls['AssetClassFilter'].value;
if (!search) {
  this.filteredAssetClass.next(this.assetClassData.slice());
  return;
} else {
  search = search.toLowerCase();

}
// filter the Asset Class
this.filteredAssetClass.next(
  this.assetClassData.filter(x => x.BlockName.toLowerCase().indexOf(search) > -1)
);

console.log(this.filteredAssetClass);
}
//Upload Document
GetAllUploadDoc() {
debugger;
this.assetservice.GetDocumentTypeId().subscribe(response => {
  this.list = response;
  this.UploaddocsData = [];
  this.list.forEach(element => {
    this.UploaddocsData.push(element)
    this.getFilterUpload();


  })
})
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

console.log(this.filteredUpload);
}

//OperatingSystemByCompanyidGroupid

GetOSData() {

var CId = 2;
var GId = 2;
this.operatingsystemservice.GetAllOperatingSystemList(CId, GId).subscribe(response => {

  this.OsData = JSON.parse(response);
  this.getFilterOperatingSystemName();
})
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

console.log(this.filteredOperatingSystemName);
}



//CPUClassByCompanyIdGroupId

GetAllCPUClassByCompanyIdGroupId() {

var CId = 2;
var GId = 2;
this.cpuclassservice.GetAllCPUClassList(CId, GId).subscribe(response => {

  this.CPUClassData = JSON.parse(response);
  this.getFilterCPUClass();
})
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

console.log(this.filteredCPUClass);
}
//CPUSubclassByCompanyIdGroupId

GetAllCPUSubClassByCompanyIdGroupId() {

var CId = 2;
var GId = 2;
this.cpusubclassservice.GetAllCPUSubClassList(CId, GId).subscribe(response => {

  this.CPUSubClassData = JSON.parse(response);
  this.getFilterCPUsubClass();
})
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

console.log(this.filteredCPUsubClass);
}

//ApplicationTypeByCompanyIdGroupId

GetApplicationTypeByCompanyIdGroupId() {

var CId = 2;
var GId = 2;
this.applicationTypeService.GetAllApplicationTypeList(CId, GId).subscribe(response => {

  this.ApplicationTypeData = JSON.parse(response);
  this.getFilterApplicationType();
})
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

console.log(this.filteredApplicationType);
}


//ModelByCompanyIdGroupId

GetModelByCompanyIdGroupId() {

var CId = 1;
var GId = 2;
this.modelservice.GetAllModelList(CId, GId).subscribe(response => {

  this.ModelData = JSON.parse(response);
  this.getFilterModel();
})
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

console.log(this.filteredModel);
}


//ManufactureByCppanyIdGroupId
GetManufacturerCompanyIdGroupId() {

var CId = 1;
var GId = 2;
this.manufacturerservice.GetAllManufactureList(CId, GId).subscribe(response => {

  this.ManufacturerData = JSON.parse(response);
  this.getFilterManufacturer();
})
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

console.log(this.filteredManufacturer);
}


//


public onAssetInfoSubmit() {
  debugger;
  const EmployeeData = this.AssetInfo.value;
  if (this.AssetInfo.valid) {
    var assetData = {
      InventoryNumber: this.AssetInfo.value.InventoryNo,
      assetNumber: this.AssetInfo.value.AssetID,
      SubNumber: this.AssetInfo.value.SubAssetID,
      unitName: this.AssetInfo.value.Unit,
      quantity: this.AssetInfo.value.Quantity,
      // CapitalizationDate: this.AssetInfo.value.CapitalizationDate,
      CapitalizationDate:this.datepipe.transform(this.AssetInfo.value.AcquisitionDate, 'dd-MMM-yyyy'),
      GRNNumber: this.AssetInfo.value.GRNNo,
      PONumber: this.AssetInfo.value.PONumber,
      invoiceNumber: this.AssetInfo.value.InvoiceNo,
      serialNumber: this.AssetInfo.value.SerialNo,
      ITSerialNumber: this.AssetInfo.value.ITSerialNo,
      equipmentNumber: this.AssetInfo.value.EquipmentNumber,
      plantLocation: this.AssetInfo.value.AssetLocation,
      subLocation: this.AssetInfo.value.StorageLocation,
      room: this.AssetInfo.value.Room,
      costCenter: this.AssetInfo.value.CostCenter,
      assetCriticality: this.AssetInfo.value.asset_criticality,
      assetClass: this.AssetInfo.value.AssetClass,
      assetCategory: this.AssetInfo.value.AssetCategory,
      assetType: this.AssetInfo.controls.TypeOfAsset,
      assetSubtype: this.AssetInfo.value.SubTypeOfAsset,
      assetName: this.AssetInfo.value.ADL2,
      assetDescription: this.AssetInfo.value.ADL3,
      vendorName: this.AssetInfo.value.Suplier,
      usefulLife: this.AssetInfo.value.UsefulLife,
      assetExpiryDate: this.datepipe.transform(this.AssetInfo.value.ExpiryDate, 'dd-MMM-yyyy'),
      assetCondition: this.AssetInfo.value.asset_condition,
      user: this.AssetInfo.value.User,
      Custodian: this.AssetInfo.value.Custodian
    }
    this.CreateAssetData = assetData;
  }

}
onCostFormSubmit() {

  if (this.CostForm.valid) {
    var CostData = {
      cost: this.CostForm.value.Cost,
      wdv: this.CostForm.value.WDV,
      depnRunDate: this.datepipe.transform(this.CostForm.value.DepnRunDate, 'dd-MMM-yyyy'),
      residualValue: this.CostForm.value.ResidualValue,
    }
    this.costData = CostData;
  }
}
onMaintenanceFormSubmit() {

  if (this.Maintenance.valid) {
    var MaintenanceData = {
      insuranceStart: this.datepipe.transform(this.Maintenance.value.InsuranceFrom, 'dd-MMM-yyyy'),
      insuranceEnd: this.datepipe.transform(this.Maintenance.value.InsuranceTo, 'dd-MMM-yyyy'),
      insuranceVendor: this.Maintenance.value.InsuranceVendor,
      AMCstart: this.datepipe.transform(this.Maintenance.value.AMCStart, 'dd-MMM-yyyy'),
      AMCend: this.datepipe.transform(this.Maintenance.value.AMCEnd, 'dd-MMM-yyyy'),
      AMCvendor: this.Maintenance.value.AMCVendor,
      warrantyStartDate: this.datepipe.transform(this.Maintenance.value.WarrantyStartDate, 'dd-MMM-yyyy'),
      warrantyEnd: this.datepipe.transform(this.Maintenance.value.WarrantyEnd, 'dd-MMM-yyyy'),
      warrantyPeriod: this.Maintenance.value.WarrantyPeriod,
      warrantyCost: this.Maintenance.value.WarrantyCost,
      warrantyTerms: this.Maintenance.value.WarrantyTerms,
      remarks: this.Maintenance.value.Remarks
    }
    this.maintenanceData = MaintenanceData;
  }
}
public onOtherInfoSubmit() {
  debugger
  if (this.OtherInfo.valid) {
    var otherinfoData = {
      IsMetal: this.OtherInfo.value.IsMetal,
      CPPNumber: this.OtherInfo.value.CPPNumber,
      AMCComment: this.OtherInfo.value.AMCComment,
      Budget: this.OtherInfo.value.Budget,
      GRNDate: this.datepipe.transform(this.OtherInfo.value.GRNDate, 'dd-MMM-yyyy'),
      Description: this.OtherInfo.value.Description,
      Remark: this.OtherInfo.value.Remark,
      AccountingStatus: this.OtherInfo.value.AccountingStatus,
      Division: this.OtherInfo.value.Division,
      ExpenseAccount: this.OtherInfo.value.ExpenseAccount,
      CostAccount: this.OtherInfo.value.CostAccount,
      ReserveAccount: this.OtherInfo.value.ReverseAccount,
      Department: this.OtherInfo.value.Department,
      Area: this.OtherInfo.value.Area,
      Merchandise: this.OtherInfo.value.Merchandise,
      InterCompany: this.OtherInfo.value.InterCompany,
      ServiceProvider: this.OtherInfo.value.ServiceProvider,
      AccumulatedDepreciation: this.OtherInfo.value.AccumulatedDepreciation,
      Class: this.OtherInfo.value.Class,
      Loc2: this.OtherInfo.value.Loc2,
      Loc3: this.OtherInfo.value.Loc3,
      Loc4: this.OtherInfo.value.Loc4,
      Loc5: this.OtherInfo.value.Loc5,
      FutureUse: this.OtherInfo.value.FutureUse,
      InterUnit: this.OtherInfo.value.InterUnit,
      Account_Clearing: this.OtherInfo.value.AccountClearing,
      Department_Clearing: this.OtherInfo.value.DepartmentClearing,
      Comments: this.OtherInfo.value.Comments,
      Upl: this.OtherInfo.value.Upl,
      DepreciationReserve: this.OtherInfo.value.DepreciationReserve,
      Project: this.OtherInfo.value.Project,
      AmortizationStartDate: this.OtherInfo.value.AmortizationStartDate,
      AmortizeNBV: this.OtherInfo.value.AmortizeNBV,
      LifeInMonths: this.OtherInfo.value.LifeInMonths,
      Messages: this.OtherInfo.value.Messages,
    }
    this.CreateOtherinfoData = otherinfoData;
  }
}
public onDownloadFormSubmit() {
  debugger
  if (this.Download.valid) {
    var DownloadData = {
      DocumentType: this.Download.value.DocumentType,
      uploadFile: this.Download.value.FileUpload
    }
    this.DownloadInfoData = DownloadData;
  }
}
public onHardwareFormSubmit() {
  debugger
  if (this.HardwareInfo.valid) {
    var HardwareData = {
      Operatingsystem: this.HardwareInfo.value.OperatingSystem,
      Cpuclass: this.HardwareInfo.value.CPUClass,
      CpuSubclass: this.HardwareInfo.value.CPUSubClass,
      applicationtype: this.HardwareInfo.value.ApplicationType,
      model: this.HardwareInfo.value.Model,
      manufacturer: this.HardwareInfo.value.Manufacturer,
      hostname: this.HardwareInfo.value.HostName,
      HDD: this.HardwareInfo.value.HDD,
      RAM: this.HardwareInfo.value.RAM,
    }
    this.hardwareinfodata = HardwareData;
  }
}

AddUploadAssets() {
  debugger;

  this.getUploadssetData = this.localService.getData();
  this.uploadservice.UploadNormalAsset(this.getUploadssetData).subscribe(r => {
    debugger;
    if (r == "Success") {
      this.toastr.success(this.message.AssetCreated, this.message.AssetrakSays);

    }
    else if (r == "Exists") {
      this.toastr.warning(this.message.GroupExits, this.message.AssetrakSays);
    }
    else if (r == "Fail") {

      this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
    }
  })
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
onFinalSubmit() {
  debugger;
  // this.onAssetInfoSubmit();
  // this.onCostFormSubmit();
  // this.onMaintenanceFormSubmit();
  // this.onHardwareFormSubmit();
  // this.onOtherInfoSubmit();
  
 // debugger;
 // var InsuranceFrom =this.datepipe.transform(this.Maintenance.value.InsuranceFrom, 'yyyy-MM-dd')
  var AssetData =
 [ {
    ADL1:!this.CreateAssetData.assetClass.BlockName ? "" : this.CreateAssetData.assetClass.BlockName,
    ADL2:!this.CreateAssetData.assetName ? "" : this.CreateAssetData.assetName,
    ADL3:!this.CreateAssetData.assetDescription ? null : this.CreateAssetData.assetDescription,
    AMCExpiryDate:!this.maintenanceData.AMCend ? null :this.JsonDate(this.maintenanceData.AMCend),
    AMCStartDate:!this.maintenanceData.AMCstart ? null :this.JsonDate(this.maintenanceData.AMCstart),
    AMCVendor:!this.maintenanceData.AMCvendor ? null :this.maintenanceData.AMCvendor,
    AcquisitionCost:!this.costData.cost ? "": this.costData.cost,
    AcquisitionDate:this.JsonDate(this.CreateAssetData.CapitalizationDate),
    AssetId:!this.CreateAssetData.assetNumber ? "" : isNaN(this.CreateAssetData.assetNumber)===false ?parseInt(this.CreateAssetData.assetNumber):this.CreateAssetData.assetNumber,
    AssetStage: 2,
    BlockOfAsset:!this.CreateAssetData.assetClass.BlockName ? "" : this.CreateAssetData.assetClass.BlockName,
    Building: !this.CreateAssetData.costCenter ? "" : this.CreateAssetData.costCenter,
    CompanyId: 2,
    CustodianEmailId:!this.CreateAssetData.Custodian ? "" : this.CreateAssetData.Custodian,
    CustodianName:!this.CreateAssetData.Custodian ? "" : this.CreateAssetData.Custodian,
    GroupId:2,
    ITSerialNo:!this.CreateAssetData.ITSerialNumber ? null : this.CreateAssetData.ITSerialNumber,
    InstallationDate:!this.maintenanceData.warrantyStartDate ? null :this.JsonDate(this.maintenanceData.warrantyStartDate),
    InsuranceFrom:!this.maintenanceData.insuranceStart ? null :this.JsonDate(this.maintenanceData.insuranceStart),
    InsuranceTo:!this.maintenanceData.insuranceEnd ? null :this.JsonDate(this.maintenanceData.insuranceEnd),
    InsuranceVendor:!this.maintenanceData.insuranceVendor ? null : this.maintenanceData.insuranceVendor,
    InvoiceNo:!this.CreateAssetData.invoiceNumber ? null : this.CreateAssetData.invoiceNumber,
    LastModifiedBy:"",
    Location:!this.CreateAssetData.plantLocation.LocationName ? "" : this.CreateAssetData.plantLocation.LocationName,
    LocationId:!this.CreateAssetData.plantLocation.LocationId ? null : this.CreateAssetData.plantLocation.LocationId,
    PONumber:!this.CreateAssetData.PONumber ? null : this.CreateAssetData.PONumber,
    Quantity:!this.CreateAssetData.quantity ? null : this.CreateAssetData.quantity,
    Rack:!this.CreateAssetData.subLocation.RackName ? "" : this.CreateAssetData.subLocation.RackName,
    Room:!this.CreateAssetData.room ? null : this.CreateAssetData.room,
    SerialNo:!this.CreateAssetData.serialNumber ? null : this.CreateAssetData.serialNumber,
    SubAssetId:!this.CreateAssetData.SubNumber ? "0" : this.CreateAssetData.SubNumber,
    Suplier:!this.CreateAssetData.vendorName.SupplierName? null : this.CreateAssetData.vendorName.SupplierName,
    TypeOfAsset:!this.CreateAssetData.assetType.TypeOfAsset ? null : this.CreateAssetData.assetType.TypeOfAsset,
    TAId:!this.CreateAssetData.assetType.TAId ? 0 : this.CreateAssetData.assetType.TAId,
    Unit:!this.CreateAssetData.unitName.Unit_Name ? 'EA' : this.CreateAssetData.unitName.Unit_Name,
    UsefulLife:!this.CreateAssetData.usefulLife ? null : this.CreateAssetData.usefulLife,
    UserEmailId:!this.CreateAssetData.user ? null : this.CreateAssetData.user,
    UserName:!this.CreateAssetData.user ? null : this.CreateAssetData.user,
    WDV:!this.costData.wdv ? 0 : this.costData.wdv,
    WDVDate: !this.costData.depnRunDate ? null :this.JsonDate(this.costData.depnRunDate),
    WarrantyExpiryDate:!this.maintenanceData.warrantyEnd ? null :this.JsonDate(this.maintenanceData.warrantyEnd),
    expiryDate:!this.CreateAssetData.assetExpiryDate ? null :this.JsonDate(this.CreateAssetData.assetExpiryDate),
    subTypeOfAsset:!this.CreateAssetData.assetSubtype.SubTypeOfAsset ? null : this.CreateAssetData.assetSubtype.SubTypeOfAsset,
    STAId:!this.CreateAssetData.assetSubtype.STAId ? 0 : this.CreateAssetData.assetSubtype.STAId,
    CreatedBy:"",
    ReplacementValue:!this.costData.residualValue ? null : this.costData.residualValue,
    CTId: 0,
    CMId: "",
    OperatingSystem:!this.hardwareinfodata.Operatingsystem.OperatingSystemName ? null : this.hardwareinfodata.Operatingsystem.OperatingSystemName,
    CPUClass:!this.hardwareinfodata.Cpuclass.CpuClassName ? null : this.hardwareinfodata.Cpuclass.CpuClassName,
    CPUSubClass:!this.hardwareinfodata.CpuSubclass.CpuSubClassName ? null :this.hardwareinfodata.CpuSubclass.CpuSubClassName,
    ApplicationType:!this.hardwareinfodata.applicationtype.ApplicationTypeName ? null : this.hardwareinfodata.applicationtype.ApplicationTypeName,
    Model:!this.hardwareinfodata.model.ModelName ? null : this.hardwareinfodata.model.ModelName,
    Manufacturer:!this.hardwareinfodata.manufacturer.ManufacturerName ? null : this.hardwareinfodata.manufacturer.ManufacturerName,
    Barcode:"",
    GRNNo:!this.CreateAssetData.GRNNumber ? "" : this.CreateAssetData.GRNNumber,
    HostName:!this.hardwareinfodata.hostname ? "" : this.hardwareinfodata.hostname,
    HDD:!this.hardwareinfodata.HDD ? "" : this.hardwareinfodata.HDD,
    RAM:!this.hardwareinfodata.RAM ? "" :this.hardwareinfodata.RAM,
    WarrantyPeriod:!this.maintenanceData.warrantyPeriod ? "" : this.maintenanceData.warrantyPeriod,
    WarrantyCost:!this.maintenanceData.warrantyCost ? "" :this.maintenanceData.warrantyCost,
    WarrantyTerms:!this.maintenanceData.warrantyTerms ? "" : this.maintenanceData.warrantyTerms,
    WarrantyRemarks:!this.maintenanceData.remarks ? "" : this.maintenanceData.remarks,
    AssetCondition:!this.CreateAssetData.assetCondition.AssetCondition ? null : this.CreateAssetData.assetCondition.AssetCondition,
    AssetCriticality:!this.CreateAssetData.assetCriticality.AssetCriticality ? null :this.CreateAssetData.assetCriticality.AssetCriticality,
    equipmentNo:!this.CreateAssetData.equipmentNumber ? null : this.CreateAssetData.equipmentNumber,
    AssetList:"[]",

  }]
  this.addAssetData = AssetData;

  this.dialogRef.close(this.addAssetData);
  // this.localService.setData(this.addAssetData);
  this.AddUploadAssets();
  this.onBack();

}

onSubmit() { }     
  
}

