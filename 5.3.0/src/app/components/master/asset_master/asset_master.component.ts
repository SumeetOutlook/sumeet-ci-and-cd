import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Inject } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';

import * as moment from 'moment';
import { ManagerService } from '../../storage/sessionMangaer'
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { FileUploader } from 'ng2-file-upload';
import { LocalStoreService } from '../../../shared/services/local-store.service';
import { CreateManufacturerDialogComponent } from './manufacturer_add_edit_dialog/createmanufacturer-dialog.component'
import { UploadManufacturerPopUpComponent } from './manufacturer_upload_dialog/upload_manufacturer_popup.component';
import { CreateVendorDialogComponent } from './vendor_add_edit_dialog/createvendor-dialog.component';
import { UploadVendorPopUpComponent } from './vendor_upload_dialog/upload_vendor_popup.component';
import { CreateCPUClassDialogComponent } from './cpuclass_add_edit_dialog/createcpuclass-dialog.component';
import { UploadCPUClassPopUpComponent } from './cpuclass_upload_dialog/upload_cpuclass_popup.component';
import { CreateCPUSubClassDialogComponent } from './cpusubclass_add_edit_dialog/createcpusubclass-dialog.component';
import { UploadCPUSubClassPopUpComponent } from './cpusubclass_upload_dialog/upload_cpusubclass_popup.component';
import { CreateApplicationTypeDialogComponent } from './applicationtype_add_edit_dialog/createapplicationtype-dialog.component';
import { UploadApplicationTypePopUpComponent } from './applicationtype_upload_dialog/upload_applicationtype_popup.component';
import { CreateModelDialogComponent } from './model_add_edit_dialog/createmodel-dialog.component';
import { UploadModelPopUpComponent } from './model_upload_dialog/upload_model_popup.component';
import { CreateOperatingSystemDialogComponent } from './operatingsystem_add_edit_dialog/createoperatingsystem-dialog.component';
import { UploadOperatingSystemPopUpComponent } from './operatingsystem_upload_dialog/upload_operatingsystem_popup.component';
import { CreateCostCenterDialogComponent } from './costcenter_add_edit_dialog/createcostcenter-dialog.component';
import { UploadCostCenterPopUpComponent } from './costcenter_upload_dialog/upload_costcenter_popup.component';
import { OperatingSystemService } from 'app/components/services/OperatingSystemService';
import { ApplicationTypeService } from 'app/components/services/ApplicationTypeService';
import { VendorService } from 'app/components/services/VendorService';
import { CostCenterService } from 'app/components/services/CostCenterService';
import { CpuClassService } from 'app/components/services/CpuClassService';
import { CpuSubClassService } from 'app/components/services/CpuSubClassService';
import { ModelService } from 'app/components/services/ModelService';
import { ManufacturerService } from 'app/components/services/ManufacturerService';
import * as resource from '../../../../assets/Resource.json';
import { ToastrService } from 'ngx-toastr';
import { UploadService } from 'app/components/services/UploadService';
import { Constants } from 'app/components/storage/constants';
import * as headers from '../../../../assets/Headers.json';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/UserService';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import * as menuheaders from '../../../../assets/MenuHeaders.json';
import { AllPathService } from 'app/components/services/AllPathServices';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

const MANUFACTURER_DATA: PeriodicElement[] = [
  { manufacturer_code: '1', manufacturer_name: 'Intel i3', createdby: '30-Nov-2020' },
  { manufacturer_code: '2', manufacturer_name: 'Intel i2', createdby: '30-Nov-2020' },
  { manufacturer_code: '3', manufacturer_name: 'Intel i5', createdby: '30-Nov-2020' },
  { manufacturer_code: '4', manufacturer_name: 'Intel i5', createdby: '30-Nov-2020' },
  { manufacturer_code: '5', manufacturer_name: 'Intel ds', createdby: '30-Nov-2020' },
  { manufacturer_code: '6', manufacturer_name: 'Intel dsa', createdby: '30-Nov-2020' },
  { manufacturer_code: '7', manufacturer_name: 'Intel fgds', createdby: '30-Nov-2020' },
  { manufacturer_code: '8', manufacturer_name: 'Intel gfds', createdby: '30-Nov-2020' },
  { manufacturer_code: '9', manufacturer_name: 'Intel gfds', createdby: '30-Nov-2020' },
  { manufacturer_code: '10', manufacturer_name: 'Intel gfds', createdby: '30-Nov-2020' },
  { manufacturer_code: '11', manufacturer_name: 'Intel gfds', createdby: '30-Nov-2020' },
]

const VENDOR_DATA: PeriodicElement[] = [
  { vendor_code: '1', vendor_name: 'Intel i3', createdby: '30-Nov-2020' },
  { vendor_code: '2', vendor_name: 'Intel i2', createdby: '30-Nov-2020' },
  { vendor_code: '3', vendor_name: 'Intel i5', createdby: '30-Nov-2020' },
  { vendor_code: '4', vendor_name: 'Intel i5', createdby: '30-Nov-2020' },
  { vendor_code: '5', vendor_name: 'Intel ds', createdby: '30-Nov-2020' },
  { vendor_code: '6', vendor_name: 'Intel dsa', createdby: '30-Nov-2020' },
  { vendor_code: '7', vendor_name: 'Intel fgds', createdby: '30-Nov-2020' },
  { vendor_code: '8', vendor_name: 'Intel gfds', createdby: '30-Nov-2020' },
  { vendor_code: '9', vendor_name: 'Intel gfds', createdby: '30-Nov-2020' },
  { vendor_code: '10', vendor_name: 'Intel gfds', createdby: '30-Nov-2020' },
  { vendor_code: '11', vendor_name: 'Intel gfds', createdby: '30-Nov-2020' },
]

const OPERATINGSYSTEM_DATA: PeriodicElement[] = [
  { operatingSystem_class_code: '1', operatingSystem_class_name: 'Intel i3', createdby: '30-Nov-2020' },
  { operatingSystem_class_code: '2', operatingSystem_class_name: 'Intel i2', createdby: '30-Nov-2020' },
  { operatingSystem_class_code: '3', operatingSystem_class_name: 'Intel i5', createdby: '30-Nov-2020' },
  { operatingSystem_class_code: '4', operatingSystem_class_name: 'Intel i5', createdby: '30-Nov-2020' },
  { operatingSystem_class_code: '5', operatingSystem_class_name: 'Intel ds', createdby: '30-Nov-2020' },
  { operatingSystem_class_code: '6', operatingSystem_class_name: 'Intel dsa', createdby: '30-Nov-2020' },
  { operatingSystem_class_code: '7', operatingSystem_class_name: 'Intel fgds', createdby: '30-Nov-2020' },
  { operatingSystem_class_code: '8', operatingSystem_class_name: 'Intel gfds', createdby: '30-Nov-2020' },
  { operatingSystem_class_code: '9', operatingSystem_class_name: 'Intel gfds', createdby: '30-Nov-2020' },
  { operatingSystem_class_code: '10', operatingSystem_class_name: 'Intel gfds', createdby: '30-Nov-2020' },
  { operatingSystem_class_code: '11', operatingSystem_class_name: 'Intel gfds', createdby: '30-Nov-2020' },
]

const CPUCLASS_DATA: PeriodicElement[] = [
  { cpu_class_code: '1', cpu_class_name: 'Intel i3', createdby: '30-Nov-2020' },
  { cpu_class_code: '2', cpu_class_name: 'Intel i2', createdby: '30-Nov-2020' },
  { cpu_class_code: '3', cpu_class_name: 'Intel i5', createdby: '30-Nov-2020' },
  { cpu_class_code: '4', cpu_class_name: 'Intel i5', createdby: '30-Nov-2020' },
  { cpu_class_code: '5', cpu_class_name: 'Intel ds', createdby: '30-Nov-2020' },
  { cpu_class_code: '6', cpu_class_name: 'Intel dsa', createdby: '30-Nov-2020' },
  { cpu_class_code: '7', cpu_class_name: 'Intel fgds', createdby: '30-Nov-2020' },
  { cpu_class_code: '8', cpu_class_name: 'Intel gfds', createdby: '30-Nov-2020' },
  { cpu_class_code: '9', cpu_class_name: 'Intel gfds', createdby: '30-Nov-2020' },
  { cpu_class_code: '10', cpu_class_name: 'Intel gfds', createdby: '30-Nov-2020' },
  { cpu_class_code: '11', cpu_class_name: 'Intel gfds', createdby: '30-Nov-2020' },

]

const CPUSUBCLASS_DATA: PeriodicElement[] = [
  { cpusubclass_code: '1', cpusubclass_name: 'Intel i3', createdby: '30-Nov-2020' },
  { cpusubclass_code: '2', cpusubclass_name: 'Intel i2', createdby: '30-Nov-2020' },
  { cpusubclass_code: '3', cpusubclass_name: 'Intel i5', createdby: '30-Nov-2020' },
  { cpusubclass_code: '4', cpusubclass_name: 'Intel i5', createdby: '30-Nov-2020' },
  { cpusubclass_code: '5', cpusubclass_name: 'Intel ds', createdby: '30-Nov-2020' },
  { cpusubclass_code: '6', cpusubclass_name: 'Intel dsa', createdby: '30-Nov-2020' },
  { cpusubclass_code: '7', cpusubclass_name: 'Intel fgds', createdby: '30-Nov-2020' },
  { cpusubclass_code: '8', cpusubclass_name: 'Intel gfds', createdby: '30-Nov-2020' },
  { cpusubclass_code: '9', cpusubclass_name: 'Intel gfds', createdby: '30-Nov-2020' },
  { cpusubclass_code: '10', cpusubclass_name: 'Intel gfds', createdby: '30-Nov-2020' },
  { cpusubclass_code: '11', cpusubclass_name: 'Intel gfds', createdby: '30-Nov-2020' },
]

const APPLICATIONTYPE_DATA: PeriodicElement[] = [
  { application_code: '1', application_name: 'Intel i3', createdby: '30-Nov-2020' },
  { application_code: '2', application_name: 'Intel i2', createdby: '30-Nov-2020' },
  { application_code: '3', application_name: 'Intel i5', createdby: '30-Nov-2020' },
  { application_code: '4', application_name: 'Intel i5', createdby: '30-Nov-2020' },
  { application_code: '5', application_name: 'Intel ds', createdby: '30-Nov-2020' },
  { application_code: '6', application_name: 'Intel dsa', createdby: '30-Nov-2020' },
  { application_code: '7', application_name: 'Intel fgds', createdby: '30-Nov-2020' },
  { application_code: '8', application_name: 'Intel gfds', createdby: '30-Nov-2020' },
  { application_code: '9', application_name: 'Intel gfds', createdby: '30-Nov-2020' },
  { application_code: '10', application_name: 'Intel gfds', createdby: '30-Nov-2020' },
  { application_code: '11', application_name: 'Intel gfds', createdby: '30-Nov-2020' },
]

const MODEL_DATA: PeriodicElement[] = [
  { model_code: '1', model_name: 'Intel i3', createdby: '30-Nov-2020' },
  { model_code: '2', model_name: 'Intel i2', createdby: '30-Nov-2020' },
  { model_code: '3', model_name: 'Intel i5', createdby: '30-Nov-2020' },
  { model_code: '4', model_name: 'Intel i5', createdby: '30-Nov-2020' },
  { model_code: '5', model_name: 'Intel ds', createdby: '30-Nov-2020' },
  { model_code: '6', model_name: 'Intel dsa', createdby: '30-Nov-2020' },
  { model_code: '7', model_name: 'Intel fgds', createdby: '30-Nov-2020' },
  { model_code: '8', model_name: 'Intel gfds', createdby: '30-Nov-2020' },
  { model_code: '9', model_name: 'Intel gfds', createdby: '30-Nov-2020' },
  { model_code: '10', model_name: 'Intel gfds', createdby: '30-Nov-2020' },
  { model_code: '11', model_name: 'Intel gfds', createdby: '30-Nov-2020' },
]

const COSTCENTER_DATA: PeriodicElement[] = [
  { costcenter_code: '1', costcenter_name: 'Intel i3', createdby: '30-Nov-2020' },
  { costcenter_code: '2', costcenter_name: 'Intel i2', createdby: '30-Nov-2020' },
  { costcenter_code: '3', costcenter_name: 'Intel i5', createdby: '30-Nov-2020' },
  { costcenter_code: '4', costcenter_name: 'Intel i5', createdby: '30-Nov-2020' },
  { costcenter_code: '5', costcenter_name: 'Intel ds', createdby: '30-Nov-2020' },
  { costcenter_code: '6', costcenter_name: 'Intel dsa', createdby: '30-Nov-2020' },
  { costcenter_code: '7', costcenter_name: 'Intel fgds', createdby: '30-Nov-2020' },
  { costcenter_code: '8', costcenter_name: 'Intel gfds', createdby: '30-Nov-2020' },
  { costcenter_code: '9', costcenter_name: 'Intel gfds', createdby: '30-Nov-2020' },
  { costcenter_code: '10', costcenter_name: 'Intel gfds', createdby: '30-Nov-2020' },
  { costcenter_code: '11', costcenter_name: 'Intel gfds', createdby: '30-Nov-2020' },
]


export interface PeriodicElement {
}

@Component({
  selector: 'app-asset_master',
  templateUrl: './asset_master.component.html',
  styleUrls: ['./asset_master.component.scss']

})

export class AssetMasterComponent implements OnInit, AfterViewInit {
  message: any ;
  menuheader: any = (menuheaders as any).default
  headers: any ;
  @ViewChild('CPUClasspaginator', { static: false }) CPUClasspaginator: MatPaginator;
  @ViewChild('CPUClass_sort', { static: false }) CPUClass_sort: MatSort;
  @ViewChild('CPUClass_table', { static: false }) CPUClass_table: any;

  @ViewChild('OperatingSystempaginator', { static: true }) operatingSystempaginator: MatPaginator;
  @ViewChild('OperatingSystem_sort', { static: false }) operatingSystem_sort: MatSort;
  @ViewChild('OperatingSystem_table', { static: false }) operatingSystem_table: any;

  @ViewChild('CPUSubClasspaginator', { static: true }) CPUSubClasspaginator: MatPaginator;
  @ViewChild('CPUSubClass_sort', { static: false }) CPUSubClass_sort: MatSort;
  @ViewChild('CPUSubClass_table', { static: false }) CPUSubClass_table: any;

  @ViewChild('ApplicationTypepaginator', { static: true }) ApplicationTypepaginator: MatPaginator;
  @ViewChild('ApplicationType_sort', { static: false }) ApplicationType_sort: MatSort;
  @ViewChild('ApplicationType_table', { static: false }) ApplicationType_table: any;

  @ViewChild('Modelpaginator', { static: true }) Modelpaginator: MatPaginator;
  @ViewChild('Model_sort', { static: false }) Model_sort: MatSort;
  @ViewChild('Model_table', { static: false }) Model_table: any;

  @ViewChild('Manufacturerpaginator', { static: true }) Manufacturerpaginator: MatPaginator;
  @ViewChild('Manufacturer_sort', { static: false }) Manufacturer_sort: MatSort;
  @ViewChild('Manufacturer_table', { static: false }) Manufacturer_table: any;

  @ViewChild('Vendorpaginator', { static: true }) Vendorpaginator: MatPaginator;
  @ViewChild('Vendor_sort', { static: false }) Vendor_sort: MatSort;
  @ViewChild('Vendor_table', { static: false }) Vendor_table: any;

  @ViewChild('CostCenterpaginator', { static: true }) CostCenterpaginator: MatPaginator;
  @ViewChild('CostCenter_sort', { static: false }) CostCenter_sort: MatSort;
  @ViewChild('CostCenter_table', { static: false }) CostCenter_table: any;


  //SelectAssetMaster = ["Operating System", "CPU Class", "CPU Sub Class", "Application Type", "Model", "Manufacturer", "Vendor", "Cost Center"];
  SelectAssetMaster :any[] =[];
  public SelectedAssetmaster: any;

  value: any;
  updateData: any;
  updateDataInsert: any;
  deleteOptions: { option: any; id: any; };
  json: any;
  show: boolean = false;
  public hideth;

  public CPUClass_data = Object.assign(CPUCLASS_DATA);
  CPUClass_datasource: any;
  displayedColumnsCPUClass: string[] = ['CpuClassName', 'Actions'];
  public cpuClass;

  public CPUSubClass_data = Object.assign(CPUSUBCLASS_DATA);
  public CPUSubClass_datasource: any;
  displayedColumnsCPUSubClass: string[] = ['CpuSubClassName', 'Actions'];
  public cpuSubClass;

  public Manufacturer_data = Object.assign(MANUFACTURER_DATA);
  public Manufacturer_datasource: any;
  displayedColumnsManufacturerClass: string[] = ['ManufacturerName', 'Actions'];
  public manufacturer;

  public Vendor_data = Object.assign(VENDOR_DATA);
  public Vendor_datasource: any;
  displayedColumnsVendorClass: string[] = ['SupplierName', 'Actions'];
  public vendor;

  public ApplicationType_data = Object.assign(APPLICATIONTYPE_DATA);
  public ApplicationType_datasource: any;
  displayedColumnsApplicationTypeClass: string[] = ['ApplicationTypeName', 'Actions'];
  public applicationtype;

  OperatingSystem_datasource: any;
  displayedColumnsOperatingSystem: string[] = ['OperatingSystemName', 'Actions'];
  public operatingsystem;

  public Model_data = Object.assign(MODEL_DATA);
  public Model_datasource: any;
  displayedColumnsModelClass: string[] = ['ModelName', 'Actions'];
  public model;


  public CostCenter_data = Object.assign(COSTCENTER_DATA);
  public CostCenter_datasource: any;
  displayedColumnsCostCenterClass: string[] = ['CostCenterCode', 'Name', 'Actions'];
  public CostCenter;

  GroupIdSession: any;
  RegionIdSession: any;
  CompanyIdSession: any;
  userIdSession: any;

  // headers for all the other masters classes
  displayedHeadersCpuClass:any[] = [];
  displayedHeadersOsClass:any[] = [];
  displayedHeadersCpuSubClass :any[]= [];
  displayedHeadersAppTypeClass:any[] = [];
  displayedHeadersModelClass:any[] = [];
  displayedHeadersManufacturerClass:any[] = [];
  displayedHeadersVendorClass:any[] = [];
  displayedHeadersCostCenterClass:any[] = [];
  displayTable: boolean = false;
  datasource: any;

  constructor(
    // private cs: CommonService,
    public dialog: MatDialog,
    private storage: ManagerService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    public toastr: ToastrService,
    public localService: LocalStoreService,
    private operatingsystemservice: OperatingSystemService,
    public uploadService: UploadService,
    private applicationtypeservice: ApplicationTypeService,
    private vendorservice: VendorService,
    private costcenterservice: CostCenterService,
    private cpuclassService: CpuClassService,
    private cpusubclassService: CpuSubClassService,
    private modelService: ModelService,
    private manufacturerService: ManufacturerService,
    private router: Router,
    public alertService: MessageAlertService,
    public us: UserService,
    public AllPathService: AllPathService,
    private jwtAuth : JwtAuthService
  ) 
  {
    this.headers = this.jwtAuth.getHeaders();
    this.message = this.jwtAuth.getResources();
    this.displayedHeadersCpuClass = [this.headers.CPUClass, this.headers.Actions];
    this.displayedHeadersOsClass = [this.headers.OperatingSystem, this.headers.Actions];
    this.displayedHeadersCpuSubClass = [this.headers.CPUSubClass, this.headers.Actions];
    this.displayedHeadersAppTypeClass = [this.headers.ApplicationType, this.headers.Actions];
    this.displayedHeadersModelClass = [this.headers.Model, this.headers.Actions];
    this.displayedHeadersManufacturerClass = [this.headers.Manufacturer, this.headers.Actions];
    this.displayedHeadersVendorClass = [this.headers.SupplierCode, this.headers.Suplier, this.headers.Actions];  //this.headers.vendor = this.headers.Suplier>
    this.displayedHeadersCostCenterClass = [this.headers.Building, this.headers.Building, this.headers.Actions]; //this.headers.CostCenterCode,
    this.SelectAssetMaster = [this.headers.OperatingSystem, this.headers.CPUClass, this.headers.CPUSubClass, this.headers.ApplicationType, this.headers.Model, this.headers.Manufacturer, this.headers.Suplier, this.headers.Building];
   }

  ngOnInit() {
    this.hideth = true;

    this.GroupIdSession = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionIdSession = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyIdSession = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.userIdSession = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    this.GetInitiatedData();
  }

  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  GetInitiatedData() {
    let url5 = this.us.PermissionRightsByUserIdAndPageId(this.GroupIdSession, this.userIdSession, this.CompanyIdSession, this.RegionIdSession, "15");
    forkJoin([url5]).subscribe(results => {
      if (!!results[0]) {
        debugger;
        this.ListOfPagePermission = JSON.parse(results[0]);
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

    })
  }

  ngAfterViewInit() {
  }

  selected(event) {
   debugger;
    if (event == this.headers.CPUClass) {
      this.GetCPUClassData();
    }

    if (event == this.headers.CPUSubClass) {
      this.GetCPUSubClassData();
    }

    if (event == this.headers.OperatingSystem) {
      this.GetOperatingSystemData();
    }

    if (event == this.headers.ApplicationType) {
      this.GetApplicationTypeData();
    }

    if (event == this.headers.Model) {
      this.GetModelData();
    }

    if (event ==  this.headers.Manufacturer) {
      this.GetManufacturerData();
    }

    if (event == this.headers.Suplier) {
      this.GetVendorData();
    }

    if (event == this.headers.Building) {
      this.GetCostCenterData();
    }

  }

  //AllFilter
  applyFilterCPUClass(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.CPUClass_datasource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterCPUSubClass(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.CPUSubClass_datasource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterOperatingSystem(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.OperatingSystem_datasource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterApplicationType(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ApplicationType_datasource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterModel(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.Model_datasource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterManufacturer(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.Manufacturer_datasource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterVendor(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.Vendor_datasource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterCostCenter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.CostCenter_datasource.filter = filterValue.trim().toLowerCase();
  }

  //FilterEnd

  exportAsXLSX() {
    console.log("this native elemnt", this.operatingSystem_table)
    this.show = true;
    this.exportToExcelFromTable(this.operatingSystem_table._elementRef, "sbu");
    this.show = false
  }

  exportToExcelFromTable(exltable, filename) {
    debugger;
    /*const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(exltable.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, filename + '_' + moment(Date.now()).format('YYYY_MM_DD') + '.csv');*/

  }

  //OperatingSystem

  GetOperatingSystemData() {
    var operatingsystemdata = {
      GroupId: this.GroupIdSession,
      RegionId: this.RegionIdSession,
      CompanyId: this.CompanyIdSession,
      IsExport: false
    }
    debugger;
    this.operatingsystemservice.GetAllOperatingSystemData(operatingsystemdata).subscribe(response => {
      debugger;
      this.OperatingSystem_datasource = new MatTableDataSource(JSON.parse(response));
      this.OperatingSystem_datasource.paginator = this.operatingSystempaginator;
      this.OperatingSystem_datasource.sort = this.operatingSystem_sort;
      this.SelectedAssetmaster = 'Operating System';

    })
  }

  openAddOperatingSystem(...getValue): void {
    const dialogconfigcom1 = new MatDialogConfig();
    dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = "50%";
    dialogconfigcom1.data = {
      component1: 'OperatingSystemComponent',
      value: getValue[0],
      payload: getValue[1]
    };
    debugger;
    const modalService = this.dialog.open(CreateOperatingSystemDialogComponent, dialogconfigcom1);

    debugger;
    modalService.afterClosed().subscribe((res) => {
      if (res && getValue[0] === 'edit') {
        debugger
        this.updateData = res;
        this.updateData["Id"] = getValue[1].Id;
        this.UpdateOperatingSystem(this.updateData)
      }
      else if (res && getValue[0] === 'insert') {
        debugger;
        this.updateDataInsert = res;
        this.loader.open;
        this.addoperatingsystem(this.updateDataInsert)
        this.loader.close();
      }
    });
  }


  addoperatingsystem(result: any) {
    debugger;
    var operatingsystemdata = {
      OperatingSystemCode: result.OperatingSystemCode,
      Name: result.OperatingSystemName,
      GroupID: this.GroupIdSession,
      RegionId: this.RegionIdSession,
      CompanyID: this.CompanyIdSession,
      UploadedBy: "1"
    }
    this.operatingsystemservice.AddOperatingSystem(operatingsystemdata).subscribe(r => {
      debugger;
      if (r == "Success") {
        this.toastr.success(this.message.OperatingSystemSucess, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.OperatingSystemAlreadyExist, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }

      this.GetOperatingSystemData();
    })
  }

  UpdateOperatingSystem(result: any) {
    debugger;
    this.loader.open();
    var operatingsystemdata = {
      Id: result.Id,
      OperatingSystemCode: result.OperatingSystemCode,
      OperatingSystemName: result.OperatingSystemName,
      GroupId: this.GroupIdSession,
      RegionId: this.RegionIdSession,
      CompanyId: this.CompanyIdSession
    }
    this.operatingsystemservice.UpdateOperatingSystem(operatingsystemdata).subscribe(r => {
      debugger;
      this.loader.close();
      if (r == "Success") {
        this.toastr.success(this.message.OperatingSystemUpdate, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.OperatingSystemAlreadyExist, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetOperatingSystemData();
    })
  }

  deleteOperatingSystem(...index) {
    this.deleteOptions = {
      option: index[0],
      id: index[1]
    }
    debugger;
    this.confirmService.confirm({ message: this.message.OSDeleteNotification, title: this.message.AssetrakSays })
      .subscribe(res => {
        if (res) {

          this.RemoveOperatingSystem(this.deleteOptions);;

        }
      })
  }

  RemoveOperatingSystem(result: any) {
    debugger;
    var operatingsystemdata = {
      Id: result.id.Id,
      GroupId: this.GroupIdSession,
      CompanyId: this.CompanyIdSession,
    }
    this.loader.open();
    this.operatingsystemservice.RemoveOperatingSystem(operatingsystemdata).subscribe(r => {
      debugger;
      this.loader.close();
      if (r == "Success") {
        var msg = this.message.OperatingSystemRemove;
        msg = msg.replace('xxxx', result.id.OperatingSystemName);
        this.toastr.success(msg, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.OperatingSystemRemoveFail, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetOperatingSystemData();
    })
  }

  openExportOperatingSystem() {
    if (this.OperatingSystem_datasource.data.length != 0) {
      var operatingsystemdata = {
        GroupId: this.GroupIdSession,
        RegionId: this.RegionIdSession,
        CompanyId: this.CompanyIdSession,
        IsExport: true
      }
      this.operatingsystemservice.ExportOperatingSystem(operatingsystemdata).subscribe(r => {
        debugger;
        if (!!r) {
          this.AllPathService.DownloadExportFile(r);
          console.log("URL", URL);
        }
      })
    } else {
      this.toastr.warning(this.message.NoDataAvailable, this.message.AssetrakSays);
      return null;
    }


  }

  openUploadOperatingSystem(): void {
    debugger;
    const dialogconfigcom1 = new MatDialogConfig();
    dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = "50%";
    const modalService = this.dialog.open(UploadOperatingSystemPopUpComponent, dialogconfigcom1);
    modalService.afterClosed().subscribe((res) => {
      if (res) {
        this.loader.open();
        var UploadOperatingSystemData = {
          FileName: res,
          UploadedBy: "1",
          GroupID: this.GroupIdSession,
          RegionId: this.RegionIdSession,
          CompanyID: this.CompanyIdSession,

        }
        this.operatingsystemservice.UploadOperatingSystem(UploadOperatingSystemData).subscribe(r => {
          this.loader.close();
          debugger;
          if (r[0] == "Success") {
            this.toastr.success(this.message.OperatingSystemUpload, this.message.AssetrakSays);
          }
          else if (r[0] != null) {
            this.toastr.warning(r[0], this.message.AssetrakSays);
          }
          else if (r[0] == null) {
            this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
          }
          this.GetOperatingSystemData();
        })
      }
    });
  }
  //OperatingSystemEnd

  //CpuClass
  GetCPUClassData() {
    var cpuclassdata = {
      GroupId: this.GroupIdSession,
      RegionId: this.RegionIdSession,
      CompanyId: this.CompanyIdSession,
      IsSearch: false,
      SearchText: '',
      IsExport: false
    }

    debugger;
    this.cpuclassService.GetAllCpuData(cpuclassdata).subscribe(response => {
      debugger;
      this.CPUClass_datasource = new MatTableDataSource(JSON.parse(response));
      this.CPUClass_datasource.paginator = this.CPUClasspaginator;
      this.CPUClass_datasource.sort = this.CPUClass_sort;
      this.SelectedAssetmaster = 'CPU Class';


    })
  }

  openAddCPUClass(...getValue): void {
    const dialogconfigcom1 = new MatDialogConfig();
    dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = "50%";
    dialogconfigcom1.data = {
      component1: 'CpuClassComponent',
      value: getValue[0],
      payload: getValue[1]
    };
    debugger;
    const modalService = this.dialog.open(CreateCPUClassDialogComponent, dialogconfigcom1);

    debugger;
    modalService.afterClosed().subscribe((res) => {
      debugger;

      if (res && getValue[0] === 'edit') {
        debugger;
        this.updateData = res;
        this.updateData["Id"] = getValue[1].Id;
        this.UpdateCpuClassData(this.updateData)
      }
      else if (res && getValue[0] === 'insert') {
        debugger;
        this.updateDataInsert = res;
        this.loader.open;
        this.AddCpuClass(this.updateDataInsert)
        this.loader.close();
      }
    });
  }

  AddCpuClass(result: any) {
    debugger;
    var cpuData = {
      CpuClassCode: result.CpuClassCode,
      CpuClassName: result.CpuClassName,
      GroupId: this.GroupIdSession,
      RegionId: this.RegionIdSession,
      CompanyId: this.CompanyIdSession,
      UploadedBy: "1",
    }
    this.cpuclassService.AddCpu(cpuData).subscribe(r => {
      debugger;
      if (r == "Success") {
        this.toastr.success(this.message.CpuClassSucess, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.CpuClassAlreadyExist, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }

      this.GetCPUClassData();
    })
  }


  UpdateCpuClassData(result: any) {
    debugger;
    this.loader.open();
    var cpuData = {
      Id: result.Id,
      CpuClassCode: result.CpuClassCode,
      CpuClassName: result.CpuClassName,
      GroupId: this.GroupIdSession,
      RegionId: this.RegionIdSession,
      CompanyId: this.CompanyIdSession,
    }
    this.cpuclassService.UpdateCpuClass(cpuData).subscribe(r => {
      debugger;
      this.loader.close();
      if (r == "Success") {
        this.toastr.success(this.message.CpuClassUpdate, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.CpuClassAlreadyExist, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetCPUClassData();
    })
  }

  deleteCPUClass(...vars) {
    this.deleteOptions = {
      option: vars[0],
      id: vars[1]

    }
    debugger;
    this.confirmService.confirm({ message: this.message.CPUClassDeleteNotification, title: this.message.AssetrakSays })
      .subscribe(res => {
        if (res) {

          this.RemoveCpuclass(this.deleteOptions);;

        }
      })
  }

  RemoveCpuclass(result: any) {
    debugger;
    var cpuData = {
      Id: result.id.Id,
      GroupId: this.GroupIdSession,
      CompanyId: this.CompanyIdSession
    }
    this.loader.open();

    this.cpuclassService.RemoveCpuClass(cpuData).subscribe(r => {
      debugger;
      this.loader.close();
      if (r == "Success") {
        var msg = this.message.CpuClassRemove;
        msg = msg.replace('xxxx', result.id.CpuClassName);
        this.toastr.success(msg, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.CpuClassRemoveFail, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetCPUClassData();
    })
  }

  openExportCPUClass() {
    if (this.CPUClass_datasource.data.length != 0) {
      var cpuclassdata = {
        GroupId: this.GroupIdSession,
        RegionId: this.RegionIdSession,
        CompanyId: this.CompanyIdSession,
        IsSearch: false,
        SearchText: '',
        IsExport: true
      }
      this.cpuclassService.ExportCpuClass(cpuclassdata).subscribe(r => {
        debugger;
        if (!!r) {
          this.AllPathService.DownloadExportFile(r);
          console.log("URL", URL);
        }
      })
    } else {
      this.toastr.warning(this.message.NoDataAvailable, this.message.AssetrakSays);
      return null;
    }

  }

  openUploadCPUClass(): void {
    debugger;
    const dialogconfigcom1 = new MatDialogConfig();
    dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = "50%";
    const modalService = this.dialog.open(UploadCPUClassPopUpComponent, dialogconfigcom1);
    modalService.afterClosed().subscribe((res) => {
      if (res) {
        this.loader.open();
        var UploadCPUClassData = {
          FileName: res,
          UploadedBy: "1",
          GroupId: this.GroupIdSession,
          RegionId: this.RegionIdSession,
          CompanyId: this.CompanyIdSession
        }
        this.cpuclassService.UploadCpuClass(UploadCPUClassData).subscribe(r => {
          this.loader.close();
          debugger;
          if (r[0] == "Success") {
            this.toastr.success(this.message.CpuClassUpload, this.message.AssetrakSays);
          }
          else if (r[0] != null) {
            this.toastr.warning(r[0], this.message.AssetrakSays);
          }
          else if (r[0] == null) {
            this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
          }
          this.GetCPUClassData();
        })
      }
    });
  }
  //CpuClassEnd

  //CpuSubClass
  GetCPUSubClassData() {
    var cpusubclassdata = {
      GroupId: this.GroupIdSession,
      RegionId: this.RegionIdSession,
      CompanyId: this.CompanyIdSession,
      IsSearch: false,
      SearchText: '',
      IsExport: false
    }

    debugger;
    this.cpusubclassService.GetAllCpuSubData(cpusubclassdata).subscribe(response => {
      debugger;
      this.CPUSubClass_datasource = new MatTableDataSource(JSON.parse(response));
      this.CPUSubClass_datasource.paginator = this.CPUSubClasspaginator;
      this.CPUSubClass_datasource.sort = this.CPUSubClass_sort;
      this.SelectedAssetmaster = 'CPU SubClass';
    })
  }

  openAddCPUSubClass(...getValue): void {
    const dialogconfigcom1 = new MatDialogConfig();
    dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = "50%";
    dialogconfigcom1.data = {
      component1: 'CpuSubClassComponent',
      value: getValue[0],
      payload: getValue[1]
    };
    debugger;
    const modalService = this.dialog.open(CreateCPUSubClassDialogComponent, dialogconfigcom1);
    debugger;

    modalService.afterClosed().subscribe((res) => {
      debugger;

      if (res && getValue[0] === 'edit') {
        debugger;
        this.updateData = res;
        this.updateData["Id"] = getValue[1].Id;
        this.UpdateCpuSubClassData(this.updateData)
      }
      else if (res && getValue[0] === 'insert') {
        debugger;
        this.updateDataInsert = res;
        this.loader.open;
        this.AddCpuSubClass(this.updateDataInsert)
        this.loader.close();
      }
    });
  }

  AddCpuSubClass(result: any) {
    debugger;
    var cpusubData = {
      CpuSubClassCode: result.CpuSubClassCode,
      CpuSubClassName: result.CpuSubClassName,
      GroupId: this.GroupIdSession,
      RegionId: this.RegionIdSession,
      CompanyId: this.CompanyIdSession,
      UploadedBy: "1"
    }
    this.cpusubclassService.AddCpuSub(cpusubData).subscribe(r => {
      debugger;
      if (r == "Success") {
        this.toastr.success(this.message.CpuSubClassSucess, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.CpuSubClassAlreadyExist, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }

      this.GetCPUSubClassData();
    })
  }

  UpdateCpuSubClassData(result: any) {
    debugger;
    this.loader.open();
    var cpusubData = {
      Id: result.Id,
      CpuSubClassCode: result.CpuSubClassCode,
      CpuSubClassName: result.CpuSubClassName,
      GroupId: this.GroupIdSession,
      RegionId: this.RegionIdSession,
      CompanyId: this.CompanyIdSession,
    }
    this.cpusubclassService.UpdateCpuSubClass(cpusubData).subscribe(r => {
      debugger;
      this.loader.close();

      if (r == "Success") {
        this.toastr.success(this.message.CpuSubClassUpdate, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.CpuSubClassAlreadyExist, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetCPUSubClassData();
    })
  }

  deleteCPUSubClass(...vars) {
    this.deleteOptions = {
      option: vars[0],
      id: vars[1]
    }
    debugger;
    this.confirmService.confirm({ message: this.message.CPUSubClassDeleteNotification, title: this.message.AssetrakSays })
      .subscribe(res => {
        if (res) {

          this.RemoveCpuSubclass(this.deleteOptions);;

        }
      })
  }

  RemoveCpuSubclass(result: any) {
    debugger;
    var cpusubData = {
      Id: result.id.Id,
      GroupId: this.GroupIdSession,
      CompanyId: this.CompanyIdSession
    }
    this.loader.open();
    this.cpusubclassService.RemoveCpuSubClass(cpusubData).subscribe(r => {
      debugger;
      this.loader.close();
      if (r == "Success") {
        var msg = this.message.CpuSubClassRemove;
        msg = msg.replace('xxxx', result.id.CpuSubClassName);
        this.toastr.success(msg, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.CpuSubClassRemoveFail, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetCPUSubClassData();
    })
  }

  openExportCPUSubClass() {
    if (this.CPUSubClass_datasource.data.length != 0) {
      var cpusubclassdata = {
        GroupId: this.GroupIdSession,
        RegionId: this.RegionIdSession,
        CompanyId: this.CompanyIdSession,
        IsSearch: false,
        SearchText: '',
        IsExport: true
      }
      this.cpusubclassService.ExportCpuSubClass(cpusubclassdata).subscribe(r => {
        debugger;
        if (!!r) {
          this.AllPathService.DownloadExportFile(r);
          console.log("URL", URL);
        }
      })
    } else {
      this.toastr.warning(this.message.NoDataAvailable, this.message.AssetrakSays);
      return null;
    }

  }

  openUploadCPUSubClass(): void {
    debugger;
    const dialogconfigcom1 = new MatDialogConfig();
    dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = "50%";
    const modalService = this.dialog.open(UploadCPUSubClassPopUpComponent, dialogconfigcom1);
    modalService.afterClosed().subscribe((res) => {
      if (res) {
        this.loader.open();
        var UploadCPUSubClassData = {
          FileName: res,
          UploadedBy: "1",
          GroupId: this.GroupIdSession,
          RegionId: this.RegionIdSession,
          CompanyId: this.CompanyIdSession,
        }
        this.cpusubclassService.UploadCpuSubClass(UploadCPUSubClassData).subscribe(r => {
          this.loader.close();
          debugger;
          if (r[0] == "Success") {
            this.toastr.success(this.message.CpuSubClassUpload, this.message.AssetrakSays);
          }
          else if (r[0] != null) {
            this.toastr.warning(r[0], this.message.AssetrakSays);
          }
          else if (r[0] == null) {
            this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
          }
          this.GetCPUSubClassData();
        })
      }
    });
  }
  //CpuSubClassEnd

  //Model
  GetModelData() {
    var modeldata = {
      GroupId: this.GroupIdSession,
      RegionId: this.RegionIdSession,
      CompanyId: this.CompanyIdSession,
      IsSearch: false,
      SearchText: '',
      IsExport: false
    }

    debugger;
    this.modelService.GetAllModel(modeldata).subscribe(response => {
      debugger;
      this.Model_datasource = new MatTableDataSource(JSON.parse(response));
      this.Model_datasource.paginator = this.Modelpaginator;
      this.Model_datasource.sort = this.Model_sort;
      this.SelectedAssetmaster = 'Model';
    })
  }


  openAddModel(...getValue): void {
    const dialogconfigcom1 = new MatDialogConfig();
    dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = "50%";
    dialogconfigcom1.data = {
      component1: 'ModelComponent',
      value: getValue[0],
      payload: getValue[1]
    };
    debugger;

    const modalService = this.dialog.open(CreateModelDialogComponent, dialogconfigcom1);
    debugger;

    modalService.afterClosed().subscribe((res) => {
      debugger;

      if (res && getValue[0] === 'edit') {
        debugger;
        this.updateData = res;
        this.updateData["Id"] = getValue[1].Id;
        this.UpdateModelData(this.updateData)
      }
      else if (res && getValue[0] === 'insert') {
        debugger;
        this.updateDataInsert = res;
        this.loader.open;
        this.AddModel(this.updateDataInsert)
        this.loader.close();
      }
    });
  }

  UpdateModelData(result: any) {
    debugger;
    this.loader.open();
    var modelData = {
      Id: result.Id,
      ModelCode: result.ModelCode,
      ModelName: result.ModelName,
      GroupId: this.GroupIdSession,
      RegionId: this.RegionIdSession,
      CompanyId: this.CompanyIdSession
    }
    this.modelService.UpdateModel(modelData).subscribe(r => {
      debugger;
      this.loader.close();
      if (r == "Success") {
        this.toastr.success(this.message.ModelUpdate, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.ModelAlreadyExist, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetModelData();
    })
  }

  AddModel(result: any) {
    debugger;
    var modelData = {
      ModelCode: result.ModelCode,
      ModelName: result.ModelName,
      GroupId: this.GroupIdSession,
      RegionId: this.RegionIdSession,
      CompanyId: this.CompanyIdSession,
      UploadedBy: "1"
    }
    this.modelService.AddModel(modelData).subscribe(r => {
      debugger;
      if (r == "Success") {
        this.toastr.success(this.message.ModelSucess, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.ModelAlreadyExist, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }

      this.GetModelData();
    })
  }

  deleteModel(...vars) {
    this.deleteOptions = {
      option: vars[0],
      id: vars[1]
    }
    debugger;
    this.confirmService.confirm({ message: this.message.ModelDeleteNotification, title: this.message.AssetrakSays })
      .subscribe(res => {
        if (res) {

          this.RemoveModel(this.deleteOptions);;

        }
      })
  }

  RemoveModel(result: any) {
    debugger;
    var modelData = {
      Id: result.id.Id,
      GroupId: this.GroupIdSession,
      CompanyId: this.CompanyIdSession
    }
    this.loader.open();
    this.modelService.RemoveModel(modelData).subscribe(r => {
      debugger;
      this.loader.close();
      if (r == "Success") {
        var msg = this.message.ModelRemove;
        msg = msg.replace('xxxx', result.id.ModelName);
        this.toastr.success(msg, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.ModelRemoveFail, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetModelData();
    })
  }

  openExportModel() {
    if (this.Model_datasource.data.length != 0) {
      var modeldata = {
        GroupId: this.GroupIdSession,
        RegionId: this.RegionIdSession,
        CompanyId: this.CompanyIdSession,
        IsSearch: false,
        SearchText: '',
        IsExport: true
      }
      this.modelService.ExportModel(modeldata).subscribe(r => {
        debugger;
        if (!!r) {
          this.AllPathService.DownloadExportFile(r);
          console.log("URL", URL);
        }
      })
    } else {
      this.toastr.warning(this.message.NoDataAvailable, this.message.AssetrakSays);
      return null;
    }

  }

  openUploadModel(): void {
    debugger;
    const dialogconfigcom1 = new MatDialogConfig();
    dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = "50%";
    const modalService = this.dialog.open(UploadModelPopUpComponent, dialogconfigcom1);
    modalService.afterClosed().subscribe((res) => {
      if (res) {
        this.loader.open();
        var UploadModelData = {
          FileName: res,
          UploadedBy: "1",
          GroupId: this.GroupIdSession,
          RegionId: this.RegionIdSession,
          CompanyId: this.CompanyIdSession
        }
        this.modelService.UploadModel(UploadModelData).subscribe(r => {
          this.loader.close();
          debugger;
          if (r[0] == "Success") {
            this.toastr.success(this.message.ModelUpload, this.message.AssetrakSays);
          }
          else if (r[0] != null) {
            this.toastr.warning(r[0], this.message.AssetrakSays);
          }
          else if (r[0] == null) {
            this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
          }
          this.GetModelData();
        })
      }
    });
  }
  //ModelEnd

  //Manufacturer
  GetManufacturerData() {
    var manufacturerdata = {
      GroupId: this.GroupIdSession,
      RegionId: this.RegionIdSession,
      CompanyId: this.CompanyIdSession,
      IsSearch: false,
      SearchText: '',
      IsExport: false
    }

    debugger;
    this.manufacturerService.GetAllManufacturerData(manufacturerdata).subscribe(response => {
      debugger;
      this.Manufacturer_datasource = new MatTableDataSource(JSON.parse(response));
      this.Manufacturer_datasource.paginator = this.Manufacturerpaginator;
      this.Manufacturer_datasource.sort = this.Manufacturer_sort;
      this.SelectedAssetmaster = 'Manufacturer';
    })
  }

  openAddManufacturer(...getValue): void {
    const dialogconfigcom1 = new MatDialogConfig();
    dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = "50%";
    dialogconfigcom1.data = {
      component1: 'ManufacturerComponent',
      value: getValue[0],
      payload: getValue[1]
    };
    debugger;
    const modalService = this.dialog.open(CreateManufacturerDialogComponent, dialogconfigcom1);
    debugger
    modalService.afterClosed().subscribe((res) => {
      debugger;

      if (res && getValue[0] === 'edit') {
        debugger;
        this.updateData = res;
        this.updateData["Id"] = getValue[1].Id;
        this.UpdateManufacturerData(this.updateData)
      }
      else if (res && getValue[0] === 'insert') {
        debugger;
        this.updateDataInsert = res;
        this.loader.open;
        this.AddManufacturer(this.updateDataInsert)
        this.loader.close();
      }
    });
  }

  AddManufacturer(result: any) {
    debugger;
    var manufacturerData = {
      ManufacturerCode: result.ManufacturerCode,
      ManufacturerName: result.ManufacturerName,
      GroupId: this.GroupIdSession,
      RegionId: this.RegionIdSession,
      CompanyId: this.CompanyIdSession,
      UploadedBy: "1"
    }
    this.manufacturerService.AddManufacturer(manufacturerData).subscribe(r => {
      debugger;
      if (r == "Success") {
        this.toastr.success(this.message.ManufacturerSucess, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.ManufacturerAlreadyExist, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }

      this.GetManufacturerData();
    })
  }


  UpdateManufacturerData(result: any) {
    debugger;
    this.loader.open();
    var manufacturerData = {
      Id: result.Id,
      ManufacturerCode: result.ManufacturerCode,
      ManufacturerName: result.ManufacturerName,
      GroupId: this.GroupIdSession,
      RegionId: this.RegionIdSession,
      CompanyId: this.CompanyIdSession
    }
    this.manufacturerService.UpdateManufacturer(manufacturerData).subscribe(r => {
      debugger;
      this.loader.close();
      if (r == "Success") {
        this.toastr.success(this.message.ManufacturerUpdate, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.ManufacturerAlreadyExist, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetManufacturerData();
    })
  }


  deleteManufacturer(...vars) {
    this.deleteOptions = {
      option: vars[0],
      id: vars[1]
    }
    debugger;
    this.confirmService.confirm({ message: this.message.ManufacturerDeleteNotification, title: this.message.AssetrakSays })
      .subscribe(res => {
        if (res) {

          this.RemoveManufacturer(this.deleteOptions);;

        }
      })
  }

  RemoveManufacturer(result: any) {
    debugger;
    var manufacturerData = {
      Id: result.id.Id,
      GroupId: this.GroupIdSession,
      CompanyId: this.CompanyIdSession
    }
    this.loader.open();
    this.manufacturerService.RemoveManufacturer(manufacturerData).subscribe(r => {
      debugger;
      this.loader.close();
      if (r == "Success") {
        var msg = this.message.ManufacturerRemove;
        msg = msg.replace('xxxx', result.id.ManufacturerName);
        this.toastr.success(msg, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.ManufacturerRemoveFail, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetManufacturerData();
    })
  }


  openExportManufacturer() {
    if (this.Manufacturer_datasource.data.length != 0) {
      var manufacturerdata = {
        GroupId: this.GroupIdSession,
        RegionId: this.RegionIdSession,
        CompanyId: this.CompanyIdSession,
        IsSearch: false,
        SearchText: '',
        IsExport: true
      }
      this.manufacturerService.ExportManufacturer(manufacturerdata).subscribe(r => {
        debugger;
        if (!!r) {
          this.AllPathService.DownloadExportFile(r);
          console.log("URL", URL);
        }
      })
    } else {
      this.toastr.warning(this.message.NoDataAvailable, this.message.AssetrakSays);
      return null;
    }

  }

  openUploadManufacturer(): void {
    debugger;
    const dialogconfigcom1 = new MatDialogConfig();
    dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = "50%";
    const modalService = this.dialog.open(UploadManufacturerPopUpComponent, dialogconfigcom1);
    modalService.afterClosed().subscribe((res) => {
      if (res) {
        this.loader.open();
        var UploadManufacturerData = {
          FileName: res,
          UploadedBy: "1",
          GroupId: this.GroupIdSession,
          RegionId: this.RegionIdSession,
          CompanyId: this.CompanyIdSession
        }
        this.manufacturerService.UploadManufacturer(UploadManufacturerData).subscribe(r => {
          this.loader.close();
          debugger;
          if (r[0] == "Success") {
            this.toastr.success(this.message.ManufacturerUpload, this.message.AssetrakSays);
          }
          else if (r[0] != null) {
            this.toastr.warning(r[0], this.message.AssetrakSays);
          }
          else if (r[0] == null) {
            this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
          }
          this.GetManufacturerData();
        })
      }
    });
  }
  //ManufacturerEnd

  //Application
  GetApplicationTypeData() {
    var applicationtypedata = {
      GroupId: this.GroupIdSession,
      RegionId: this.RegionIdSession,
      CompanyId: this.CompanyIdSession,
      IsSearch: false,
      SearchText: '',
      IsExport: false
    }
    debugger;
    this.applicationtypeservice.GetAllApplicationTypeData(applicationtypedata).subscribe(response => {
      debugger;
      this.ApplicationType_datasource = new MatTableDataSource(JSON.parse(response));
      this.ApplicationType_datasource.paginator = this.ApplicationTypepaginator;
      this.ApplicationType_datasource.sort = this.ApplicationType_sort;
      this.SelectedAssetmaster = 'Application Type';

    })
  }

  openAddApplicationType(...getValue): void {
    console.log(getValue[1]);
    const dialogconfigcom1 = new MatDialogConfig();
    dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = "50%";

    dialogconfigcom1.data =
    {
      component1: "ApplicationTypeComponent",
      value: getValue[0],
      payload: getValue[1]
    };
    debugger;
    const modalService = this.dialog.open(CreateApplicationTypeDialogComponent, dialogconfigcom1);


    debugger;
    modalService.afterClosed().subscribe((res) => {
      debugger
      if (res && getValue[0] === 'edit') {
        debugger;
        this.updateData = res;
        this.updateData['Id'] = getValue[1].Id;
        this.updateApplicationType(this.updateData)
      }
      else if (res && getValue[0] === 'insert') {
        debugger;
        this.updateDataInsert = res;
        this.loader.open;
        this.addApplicationType(this.updateDataInsert)
        this.loader.close();
      }
    })
  }

  addApplicationType(result: any) {
    debugger;
    var applicationtypedata =
    {
      ApplicationTypeCode: result.ApplicationTypeCode,
      ApplicationTypeName: result.ApplicationTypeName,
      UploadedBy: "1",
      GroupId: this.GroupIdSession,
      RegionId: this.RegionIdSession,
      CompanyId: this.CompanyIdSession,
    }
    this.applicationtypeservice.AddApplicationType(applicationtypedata).subscribe(r => {
      debugger;
      if (r == "Success") {
        this.toastr.success(this.message.ApplicationTypeSucess, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.ApplicationTypeAlreadyExist, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }

      this.GetApplicationTypeData();
    })
  }

  updateApplicationType(result: any) {
    debugger;
    this.loader.open();
    var applicationtypedata = {
      Id: result.Id,
      ApplicationTypeCode: result.ApplicationTypeCode,
      ApplicationTypeName: result.ApplicationTypeName,
      GroupId: this.GroupIdSession,
      RegionId: this.RegionIdSession,
      CompanyId: this.CompanyIdSession
    }
    this.applicationtypeservice.UpdateApplicationType(applicationtypedata).subscribe(r => {
      debugger;
      this.loader.close();
      if (r == "Success") {
        this.toastr.success(this.message.ApplicationTypeUpdate, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.ApplicationTypeAlreadyExist, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetApplicationTypeData();
    })
  }

  deleteApplicationType(...index) {
    this.deleteOptions = {
      option: index[0],
      id: index[1]
    }
    debugger;
    this.confirmService.confirm({ message: this.message.ApplicationTypeDeleteNotification, title: this.message.AssetrakSays })
      .subscribe(res => {
        if (res) {

          this.RemoveApplicationType(this.deleteOptions);;

        }
      })

  }
  RemoveApplicationType(result: any) {
    debugger;
    var applicationtypedata = {
      GroupId: this.GroupIdSession,
      CompanyId: this.CompanyIdSession,
      Id: result.id.Id
    }
    this.loader.open();
    this.applicationtypeservice.RemoveApplicationType(applicationtypedata).subscribe(r => {
      debugger;
      this.loader.close();
      if (r == "Success") {
        var msg = this.message.ApplicationTypeRemove;
        msg = msg.replace('xxxx', result.id.ApplicationTypeName);
        this.toastr.success(msg, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.ApplicationTypeRemoveFail, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }

      this.GetApplicationTypeData();
    });

  }

  openUploadApplicationType(): void {
    debugger;
    const dialogconfigcom1 = new MatDialogConfig();
    dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = "50%";
    const modalService = this.dialog.open(UploadApplicationTypePopUpComponent, dialogconfigcom1);
    modalService.afterClosed().subscribe((res) => {
      if (res) {
        this.loader.open();
        var UploadApplicationTypeData = {
          FileName: res,
          UploadedBy: "1",
          GroupId: this.GroupIdSession,
          RegionId: this.RegionIdSession,
          CompanyId: this.CompanyIdSession
        }
        this.applicationtypeservice.UploadApplicationType(UploadApplicationTypeData).subscribe(r => {
          this.loader.close();
          debugger;
          if (r[0] == "Success") {
            this.toastr.success(this.message.ApplicationTypeUpload, this.message.AssetrakSays);
          }
          else if (r[0] != null) {
            this.toastr.warning(r[0], this.message.AssetrakSays);
          }
          else if (r[0] == null) {
            this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
          }
          this.GetApplicationTypeData();
        })
      }

    });
  }

  openExportApplicationType() {

    if (this.ApplicationType_datasource.data.length != 0) {
      var applicationtypedata = {
        GroupId: this.GroupIdSession,
        RegionId: this.RegionIdSession,
        CompanyId: this.CompanyIdSession,
        IsSearch: false,
        SearchText: '',
        IsExport: true
      }
      this.applicationtypeservice.ExportApplicationType(applicationtypedata).subscribe(r => {
        debugger;
        if (!!r) {
          this.AllPathService.DownloadExportFile(r);
          console.log("URL", URL);
        }
      });
    } else {
      this.toastr.warning(this.message.NoDataAvailable, this.message.AssetrakSays);
      return null;
    }

  }
  //ApplicationEnd

  //Vendor
  GetVendorData() {
    var supplierdata = {
      GroupId: this.GroupIdSession,
      RegionId: this.RegionIdSession,
      CompanyId: this.CompanyIdSession,
      IsSearch: false,
      SearchText: '',
      IsExport: false
    }
    debugger;
    this.vendorservice.GetAllVendorData(supplierdata).subscribe(response => {
      debugger;
      this.Vendor_datasource = new MatTableDataSource(JSON.parse(response));
      this.Vendor_datasource.paginator = this.Vendorpaginator;
      this.Vendor_datasource.sort = this.Vendor_sort;
      this.SelectedAssetmaster = 'Vendor';

    })
  }

  openAddVendor(...getValue): void {
    const dialogconfigcom1 = new MatDialogConfig();
    dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = "50%";
    dialogconfigcom1.data =
    {
      component1: "VenderComponent",
      value: getValue[0],
      payload: getValue[1]
    };
    debugger;
    const modalService = this.dialog.open(CreateVendorDialogComponent, dialogconfigcom1);

    debugger
    modalService.afterClosed().subscribe((res) => {
      if (res && getValue[0] === 'edit') {
        debugger;
        this.updateData = res;
        this.updateData["Id"] = getValue[1].Id;
        this.UpdateVendor(this.updateData)
      }
      else if (res && getValue[0] === 'insert') {
        debugger;
        this.updateDataInsert = res;
        this.loader.open;
        this.addVendor(this.updateDataInsert)
        this.loader.close();
      }
    });
  }

  addVendor(result: any) {
    debugger;
    var supplierdata = {
      SupplierCode: result.SupplierCode,
      SupplierName: result.SupplierName,
      SupplierEmail:result.SupplierEmail,
      Temp1:result.contactNo,
      UploadedBy: "1",
      GroupId: this.GroupIdSession,
      RegionId: this.RegionIdSession,
      CompanyId: this.CompanyIdSession
    }
    this.vendorservice.AddVendor(supplierdata).subscribe(r => {
      debugger;
      if (r == "Success") {
        this.toastr.success(this.message.SupplierSucess, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.SupplierAlreadyExist, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }

      this.GetVendorData();
    });
  }
  UpdateVendor(result: any) {
    debugger;
    this.loader.open();
    var supplierdata = {
      Id: result.Id,
      SupplierCode: result.SupplierCode,
      SupplierName: result.SupplierName,
      SupplierEmail:result.SupplierEmail,
      Temp1:result.contactNo,
      GroupId: this.GroupIdSession,
      RegionId: this.RegionIdSession,
      CompanyId: this.CompanyIdSession
    }
    this.vendorservice.UpdateVendor(supplierdata).subscribe(r => {
      debugger;
      this.loader.close();
      if (r == "Success") {
        this.toastr.success(this.message.SupplierUpdate, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.SupplierAlreadyExist, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetVendorData();
    })
  }


  deleteVendor(...index) {
    this.deleteOptions = {
      option: index[0],
      id: index[1]
    }
    debugger;
    this.confirmService.confirm({ message: this.message.VendorDeleteNotification, title: this.message.AssetrakSays })
      .subscribe(res => {
        if (res) {

          this.RemoveVendor(this.deleteOptions);;

        }
      })
  }

  RemoveVendor(result: any) {
    debugger;
    var supplierdata = {
      GroupId: this.GroupIdSession,
      CompanyId: this.CompanyIdSession,
      Id: result.id.Id
    }
    this.loader.open();
    this.vendorservice.RemoveVendor(supplierdata).subscribe(r => {
      debugger;
      this.loader.close();
      if (r == "Success") {
        var msg = this.message.SupplierRemove;
        msg = msg.replace('xxxx', result.id.SupplierName);
        this.toastr.success(msg, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.SupplierRemoveFail, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetVendorData();
    })
  }

  openUploadVendor(): void {
    debugger;
    const dialogconfigcom1 = new MatDialogConfig();
    dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = "50%";
    const modalService = this.dialog.open(UploadVendorPopUpComponent, dialogconfigcom1);
    modalService.afterClosed().subscribe((res) => {
      debugger;
      if (res) {
        this.loader.open();
        var UploadVenderData = {
          FileName: res,
          UploadedBy: "1",
          GroupId: this.GroupIdSession,
          RegionId: this.RegionIdSession,
          CompanyId: this.CompanyIdSession
        }
        this.vendorservice.UploadVendor(UploadVenderData).subscribe(r => {
          this.loader.close();
          debugger;
          if (r[0] == "Success") {
            this.toastr.success(this.message.SupplierUpload, this.message.AssetrakSays);
          }
          else if (r[0] != null) {
            this.toastr.warning(r[0], this.message.AssetrakSays);
          }
          else if (r[0] == null) {
            this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
          }
          this.GetVendorData();
        })
      }
    });
  }

  openExportVendorData() {
    if (this.Vendor_datasource.data.length != 0) {
      var supplierdata = {
        GroupId: this.GroupIdSession,
        RegionId: this.RegionIdSession,
        CompanyId: this.CompanyIdSession,
        IsSearch: false,
        SearchText: '',
        IsExport: true
      }
      this.vendorservice.ExportVendor(supplierdata).subscribe(r => {
        debugger;
        if (!!r) {
          this.AllPathService.DownloadExportFile(r);
          console.log("URL", URL);
        }
      });
    } else {
      this.toastr.warning(this.message.NoDataAvailable, this.message.AssetrakSays);
      return null;
    }


  }
  //VendorEnd

  //CostCenter
  GetCostCenterData() {
    var costcenterdata = {
      GroupId: this.GroupIdSession,
      RegionId: this.RegionIdSession,
      CompanyId: this.CompanyIdSession,
      IsSearch: false,
      SearchText: '',
      IsExport: false
    }
    debugger;
    this.costcenterservice.GetAllCostCenterData(costcenterdata).subscribe(response => {
      debugger;
      this.CostCenter_datasource = new MatTableDataSource(JSON.parse(response));
      this.CostCenter_datasource.paginator = this.CostCenterpaginator;
      this.CostCenter_datasource.sort = this.CostCenter_sort;
      this.SelectedAssetmaster = 'Cost Center';
    })
  }

  openAddCostCenter(...getValue): void {
    const dialogconfigcom1 = new MatDialogConfig();
    dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = "50%";
    dialogconfigcom1.data = {
      component1: "CostCenterComponent",
      value: getValue[0],
      payload: getValue[1]
    };
    debugger;
    const modalService = this.dialog.open(CreateCostCenterDialogComponent, dialogconfigcom1);
    debugger;
    modalService.afterClosed().subscribe((res) => {
      if (res && getValue[0] === 'edit') {
        debugger;
        this.updateData = res;
        this.updateData["Id"] = getValue[1].Id;
        this.UpdateCostCenter(this.updateData)
      }
      else if (res && getValue[0] === 'insert') {
        debugger;
        this.updateDataInsert = res;
        this.loader.open;
        this.addCostCenter(this.updateDataInsert)
        this.loader.close();
      }
    });
  }

  addCostCenter(result: any) {
    debugger;
    var costcenterdata = {
      CostCenterCode: result.CostCenterCode,
      Name: result.Name,
      CreateUploadedBy: "1",
      GroupId: this.GroupIdSession,
      RegionId: this.RegionIdSession,
      companyId: this.CompanyIdSession
    }
    this.costcenterservice.AddCostCenter(costcenterdata).subscribe(r => {
      debugger;
      if (r == "Success") {
        this.toastr.success(this.message.CostCenterSucess, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.CostCenterAlreadyExist, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }

      this.GetCostCenterData();
    })
  }

  UpdateCostCenter(result: any) {
    debugger;
    this.loader.open();
    var costcenterdata = {
      Id: result.Id,
      CostCenterCode: result.CostCenterCode,
      Name: result.Name,
      GroupId: this.GroupIdSession,
      RegionId: this.RegionIdSession,
      companyId: this.CompanyIdSession
    }
    this.costcenterservice.UpdateCostCenter(costcenterdata).subscribe(r => {
      debugger;
      this.loader.close();
      if (r == "Success") {
        this.toastr.success(this.message.CostCenterUpdate, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.CostCenterAlreadyExist, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetCostCenterData();
    })
  }
  deleteCostCenter(...index) {
    this.deleteOptions = {
      option: index[0],
      id: index[1]
    }
    debugger;
    this.confirmService.confirm({ message: this.message.CostCenterDeleteNotification, title: this.message.AssetrakSays })
      .subscribe(res => {
        if (res) {

          this.RemoveCostCenter(this.deleteOptions);;

        }
      })
  }

  RemoveCostCenter(result: any) {
    debugger;
    var costcenterdata = {
      grid: this.GroupIdSession,
      CId: this.CompanyIdSession,
      Id: result.id.Id
    }
    this.loader.open();
    this.costcenterservice.RemoveCostCenter(costcenterdata).subscribe(r => {
      debugger;
      this.loader.close();
      if (r == "Success") {
        var msg = this.message.CostCenterRemove;
        msg = msg.replace('xxxx', result.id.Name);
        this.toastr.success(msg, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.CostCenterRemoveFail, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }

      this.GetCostCenterData();
    })
  }


  openUploadCostCenter(): void {
    debugger;
    const dialogconfigcom1 = new MatDialogConfig();
    dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = "50%";
    const modalService = this.dialog.open(UploadCostCenterPopUpComponent, dialogconfigcom1);
    modalService.afterClosed().subscribe((res) => {
      if (res) {
        this.loader.open();
        var UploadCostCenterData = {
          FileName: res,
          uploadedBy: "1",
          GroupId: this.GroupIdSession,
          RegionId: this.RegionIdSession,
          CompanyId: this.CompanyIdSession
        }
        this.costcenterservice.UploadCostCenter(UploadCostCenterData).subscribe(r => {
          this.loader.close();
          debugger;
          if (r[0] == "Success") {
            this.toastr.success(this.message.CostCenterUpload, this.message.AssetrakSays);
          }
          else if (r[0] != null) {
            this.toastr.warning(r[0], this.message.AssetrakSays);
          }
          else if (r[0] == null) {
            this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
          }
          this.GetCostCenterData();
        })
      }
    });
  }
  openExportCostCenter() {
    if (this.CostCenter_datasource.data.length != 0) {
      var costcenterdata = {
        GroupId: this.GroupIdSession,
        RegionId: this.RegionIdSession,
        CompanyId: this.CompanyIdSession,
        IsSearch: false,
        SearchText: '',
        IsExport: true
      }
      this.costcenterservice.ExportCostCenter(costcenterdata).subscribe(r => {
        debugger;
        if (!!r) {
          this.AllPathService.DownloadExportFile(r);
          console.log("URL", URL);
        }
      });
    } else {
      this.toastr.warning(this.message.NoDataAvailable, this.message.AssetrakSays);
      return null;
    }


  }
  //CostCenterEnd

  downLoadFile(data: any, type: string) {
    debugger;
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert('Please disable your Pop-up blocker and try again.');
    }
  }


}
