import { Component, OnInit, ViewChild, Inject, ViewEncapsulation, EventEmitter, Output, VERSION, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { FormControl } from '@angular/forms';
import { AssetService } from 'app/components/services/AssetService';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { DatePipe } from '@angular/common';
import { GroupService } from 'app/components/services/GroupService';
import { MatTableDataSource } from '@angular/material/table';

import { AllPathService } from 'app/components/services/AllPathServices';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { Constants } from 'app/components/storage/constants';
import { Subject } from 'rxjs';
import { ITAMService } from 'app/components/services/ITAMService';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-software-license-details-dialog',
  templateUrl: './software-license-details-dialog.component.html',
  styleUrls: ['./software-license-details-dialog.component.scss']
})
export class SoftwareLicenseDetailsDialogComponent implements OnInit {

  Headers: any ;

  public DetailsInfo: FormGroup;
  public ContractsInfo: FormGroup;

  public selectedIndex;
  tabEnabled : boolean= false;
  geodisabled:boolean=true;
  mattab:boolean=true;
  public sampleform: FormGroup;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
 
  datasource = new MatTableDataSource();
  datasourceL = new MatTableDataSource();
  datasourceI = new MatTableDataSource();
  datasourceLC = new MatTableDataSource();
  layerid: any;
  Layertext: string;
  IslayerDisplay: any;
  HeaderLayerText: string;
  groupId:any;
  UserId :any;
  regionId :any;
  companyId:any;

  displayedHeaders:string[] = ['Software', 'License Key', 'License Name','Cost','Allocated'];
  displayedColumns: string[] = ['softwareName', 'LicenseKey', 'LicenseName','Cost'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SoftwareLicenseDetailsDialogComponent>,
    private fb: FormBuilder,
    private storage: ManagerService,
    public assetservice: AssetService,
    public loader: AppLoaderService,
    public datepipe: DatePipe,
    public groupservice: GroupService,
    public AllPath : AllPathService,
    private jwtAuth: JwtAuthService,
    public itamService : ITAMService,
    public as:AssetService,) { 
      this.Headers = this.jwtAuth.getHeaders();
    }

    softwareType :any;
    softwareid : any;
    complianceType : any;
  ngOnInit() {
    this.tabEnabled = false;

    this.layerid = this.storage.get(Constants.SESSSION_STORAGE, Constants.LAYER_ID);
    this.groupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.regionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.companyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    
    
    debugger;
    
    //this.softwareid = this.data.payload.softwareid;
    // this.softwareType = this.data.payload.Type;
    // this.complianceType = this.data.payload.ComplianceType;
    // this.GetSoftwareDetails();
    // this.getSoftwareCategory();
    // this.getSoftwareManufacturers();

    this.buildItemForm(this.data.payload);
    //this.GetSoftwareLicenseDetails(this.data.payload);
    this.getDowngradeRightsDetails(this.data.payload);

  }

  
  nextStep(i) {
    this.selectedIndex = i;   
  }
  previousStep(i) {
    this.selectedIndex = i;    
  }
  bindData: any[] = [];
  ColumnValue:any[]=[];
  
  typeOfCategorys : any=[];
  typeOfManufacturers : any=[];
  getSoftwareCategory(){     
    this.itamService.getSoftwareCategory().subscribe((res: any)=>{       
      this.typeOfCategorys = res;
      console.log(res)
    });
  }

  getSoftwareManufacturers(){     
    this.itamService.getSoftwareManufacturer().subscribe((res: any)=>{       
      this.typeOfManufacturers = res;
      console.log(res);
    });
  }

  ListOfField: any[] = [];
  displayedColumns1: any[] = [];
  mandatoryFields: any[] = [];
 

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    debugger;    
    this.nextStep(tabChangeEvent.index);
    this.previousStep(tabChangeEvent.index); 
    
  }
  

  GetSoftwareLicenseDetails(item) {
    debugger;
    var reqData = {
      LicenseAgreementDetailID : item.LicenseAgreementDetailID,
      CompanyId: this.companyId,
      GroupID: this.groupId,
      searchManufacturer: item.Manufacturer,      
      pageSize: 50,
      pageNo: 1
    }

    this.itamService.getSoftwareLicenseList(reqData).subscribe((res: any) => {
      debugger;      
      this.tabEnabled = true;
      this.bindData = !!res ? res[0] : "";
      console.log(this.bindData);
      this.buildItemForm(this.bindData);

    })
  }
  
  buildItemForm(item) {
    debugger;
    this.tabEnabled = true;
    this.DetailsInfo = this.fb.group({
      LicenseName : [item.LicenseName || ''],
      Software : [ item.Software || ''],
      Manufacturer : [ item.Manufacturer || ''],
      AgreementNumber : [''],
      LicenseType : [ item.LicenseType || ''],
      LicenseOption : [ item.LicenseOption || ''],
      AcquisitionDate : [''],
      ExpiryDate : [''],
      Cost : [ ''],
      PurchasedFor : [''],
      Vendor : [''],
      Site : [''],

      LicenseKey : [ item.LicenseKey || ''],
      Description : [''],
      CreatedBy : [ item.CreatedBy || ''],
      CreatedTime : [ item.CreatedTime || ''],
      LastUpdatedBy : [ item.LastUpdatedBy || ''],
      LastUpdatedTime : [ item.LastUpdatedTime || ''],
      InstallationsAllowed : [ item.InstallationsAllowed || '']

    })
    this.ContractsInfo = this.fb.group({
     
    })   
    
    //======== Get Document List ======
    
    
  }
  getDowngradeRightsDetails(item) {
    debugger;
    var data = {
      LicenseID : item.LicenseAgreementDetailID,
      CompanyId : this.companyId,
      GroupID : this.groupId
    }
    //this.loader.open();
    this.itamService.getDowngradeRightsDetails(data).subscribe(r => {
      debugger;
      var result = r;
      console.log(result);
      this.onChangeDataSource(result);

    })
  }
  

  onChangeDataSource(value) {
    this.datasource = new MatTableDataSource(value);
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  onChangeDataSourceL(value) {
    value  = [{'Agreement Number': '66', 'Manufacturer': 'Adobe', 'Acquisition Date': 'Mar 16, 2022','Expiry Date': 'Mar 27, 2022','Expire in':'3 days ago','PO #': 'r44','Status': 'Expired'}];
    this.datasourceL = new MatTableDataSource(value);
    this.datasourceL.sort = this.sort;
    this.datasourceL.paginator = this.paginator;
  }

  onChangeDataSourceI(value) {
    //value  = [{'Workstation':'desktop-9pdea2e','Version':'','User':'','License Key':'','Product ID':'','Allocated License':'','Installed On':''}];
    this.datasourceI = new MatTableDataSource(value);
    this.datasourceI.sort = this.sort;
    this.datasourceI.paginator = this.paginator;
  } 
   onChangeDataSourceLC(value) {
    value  = [];
    this.datasourceLC = new MatTableDataSource(value);
    this.datasourceLC.sort = this.sort;
    this.datasourceLC.paginator = this.paginator;
  }

  onclosetab() {
    this.dialogRef.close(false);

  }

}
