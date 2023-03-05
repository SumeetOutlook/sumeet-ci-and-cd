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
import { ITAMService } from 'app/components/services/ITAMService';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AddManagedSoftwareDialogComponent } from '../dialogs/add-managed-software-dialog/add-managed-software-dialog.component';
import { AddLicenseTypeDialogComponent } from '../dialogs/add-license-type-dialog/add-license-type-dialog.component';
import {MatChipInputEvent} from '@angular/material/chips';
import {ENTER, COMMA} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-add-software-license',
  templateUrl: './add-software-license.component.html',
  styleUrls: ['./add-software-license.component.scss']
})
export class AddSoftwareLicenseComponent implements OnInit {

  message: any = (resource as any).default;
  header: any = (headers as any).default;
  jsonDoc: any;
  submitted: boolean = false;
  fileList: any[] = [];
  photos: any[] = ['photo'];
  softwareComponents: any;
  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];
  fruits = [];
  // Only Integer Numbers for GRNDate

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
  public softwareForm: FormGroup;

  public LCTypes: any[] = ['Perpetual', 'Subscription'];
  public RestrictionTypes: any[] = ['Per User', 'Per Core'];
  GroupId: any;
  RegionId: any;
  UserId: any;
  CompanyId: any;
  typeOfSoftware: any = '';

  get s2() { return this.stp1Form.controls; }
  get s1() { return this.softwareForm.controls; }

  protected _onDestroy = new Subject<void>();
  public requiredValidator = [
    Validators.required
  ]

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute,
    public toastr: ToastrService,
    public datepipe: DatePipe,
    private storage: ManagerService,
    public dialog: MatDialog,
    public itamService: ITAMService
  ) { }

  UploadNameBy: any;
  ngOnInit() {

    this.UploadNameBy = localStorage.getItem("uploadNameBy"); //this.route.snapshot.params;

    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);

    this.softwareForm = this.fb.group({
      Manufacturer: ['', [Validators.required]],
      ManufacturerFilter: [''],
      Package:[''],
      PackageFilter:[''],
      AcquisitionDate: [''],
      ManagedSoftware: ['', [Validators.required]],
      ManagedSoftwareFilter: [''],
      ExpiryDate: [''],
      LicenseType: ['', [Validators.required]],
      LicenseTypeFilter: [''],
      TrackBy : [''],
      Installations : [''],
      LicenseOption: ['', [Validators.required]],
      LicenseOptionFilter: [''],
      PurchaseCost: [''],
      PurchasedFor: [''],
      PurchasedForFilter: [''],
      Vendor: [''],
      Vendorfilter: [''],
      Description: [''],
      LicenseKeys: [''],
      NoofCALs : [''],
      UsersAllowed: [''],
      Usedby: [''],
      AllocateTo: [''],
      HostID: [''],
      OSName: [''],
      Allocated: [''],
      Role:['']

    });

    this.GetInitiatedData();
    this.addDRight();
    this.GetFieldMasterData();
    this.getRoleList();
  }
  selectedImages: any = [];

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  public typeOfManufacturers: any[] = [];
  public typeOfManufacturers1: any[] = [];

  public typeOfLicenseType: any[] = [];
  public typeOfLicenseOption: any[] = [];
  public typeOfPurchasedFor: any[] = [];
  public typeOfVendor: any[] = [];
  public typeOfManageSoftware: any[] = [];
  public typeOfSoftwareSuites:any[] = [];

  GetInitiatedData() {
    var optionId = 1;
    let url1 = this.itamService.getSoftwareManufacturer();
    let url2 = this.itamService.getLicenseType();
    let url3 = this.itamService.getLicensePurchased();
    let url4 = this.itamService.getSoftwareVendor();
    //let url5 = this.itamService.getSoftwareSuite(optionId , 0);
    forkJoin([url1, url2, url3, url4]).subscribe(results => {
      debugger;
      if (!!results[0]) {
        this.typeOfManufacturers = results[0];
        this.typeOfManufacturers1 = results[0];
        console.log(results[0]);
      }
      if (!!results[1]) {
        this.typeOfLicenseType = results[1];
        console.log(results[1]);
      }
      if (!!results[2]) {
        this.typeOfPurchasedFor = results[2];
        console.log(results[2]);
      }
      if (!!results[3]) {
        this.typeOfVendor = results[3];
        console.log(results[3]);
      }
    })
  }

  getSoftwareSuite(mid){     
    var optionId = 0;
    this.itamService.getSoftwareSuite(optionId , mid).subscribe((res: any)=>{       
      this.typeOfSoftwareSuites = res;
      console.log(res);
    });
  }
  roleList : any[]=[];
  getRoleList(){     
    this.itamService.getRoleList().subscribe((res: any)=>{       
      this.roleList = res;
      console.log(res);
    });
  }
  ExpiryDateMandatory : boolean = false;
  displayFields : any[]=[];
  masterDataOne : any[]=[];
  masterDataTwo : any[]=[];
  masterDataThree : any[]=[];
  masterDataFour : any[]=[];
  onChangeLicenseType(type) {
    // this.itamService.getLicenseOption(typeId).subscribe((res: any) => {
    //   this.typeOfLicenseOption = res;
    //   console.log(res);
    // });
    debugger;
    var LicenseTypeOptionsMapID = !!type.LicenseTypeOptionsMapID ? type.LicenseTypeOptionsMapID : 0;
    this.itamService.getLicenseField(LicenseTypeOptionsMapID).subscribe((res: any) => {
      debugger;
      console.log(res);
      this.displayFields = [];
      if(!!res){

        this.softwareForm.controls['TrackBy'].setValue(res[0].TrackBy);
        this.softwareForm.controls['Installations'].setValue(res[0].installations);
        this.softwareForm.controls['LicenseOption'].setValue(res[0].licensetypeoptions);

        res.forEach(val =>{
          var field = {
            Id : val.LicenseTypeFieldID,
            FieldName : val.FieldName,
            FieldType : val.FieldType,
            Mandatory : val.Mandatory == 'Y' ? true : false,
            FieldMasterID : val.FieldMasterID,
            Value : ''
          }

          this.displayFields.push(field);
        })
      }

      if(!!res && res[0].licensetypeoptions != 'Is Perpetual'){
        this.softwareForm.get('ExpiryDate').setValidators([Validators.required]);
        this.softwareForm.get('ExpiryDate').updateValueAndValidity();
        this.ExpiryDateMandatory = true;
      }
      else{
        this.softwareForm.get('ExpiryDate').clearValidators();
        this.softwareForm.get('ExpiryDate').updateValueAndValidity();
        this.ExpiryDateMandatory = false;
      }

    });

   

  }

  GetFieldMasterData() {
    
    let url1 = this.itamService.getFieldMaster(1);
    let url2 = this.itamService.getFieldMaster(2);
    let url3 = this.itamService.getFieldMaster(3);
    let url4 = this.itamService.getFieldMaster(4);
    forkJoin([url1, url2, url3 , url4]).subscribe(results => {
      debugger;
      if (!!results[0]) {
        this.masterDataOne = results[0];
        console.log(results[0]);
      }
      if (!!results[1]) {
        this.masterDataTwo = results[1];
        console.log(results[1]);
      }
      if (!!results[2]) {
        this.masterDataThree = results[2];
        console.log(results[2]);
      }
      if (!!results[3]) {
        this.masterDataFour = results[3];
        console.log(results[3]);
      }
    })
  }

  onChangeManufacturer(Mid) {
    this.itamService.getmanagedsoftware(Mid).subscribe((res: any) => {
      this.typeOfManageSoftware = res;
      console.log(res);
    });
    this.getSoftwareSuite(Mid);
  }
  dRights: any=[];
  addDRight() {
    var DR ={
      SoftwareID : '',
      LicenseKey :''
    }
    this.dRights.push(DR)
  }

  addManagedSoftware(){
    let dialogRef = this.dialog.open(AddManagedSoftwareDialogComponent, {
      maxHeight: '90vh',
      width: '400px',
      data: {
        'ManufacturerId': this.softwareForm.controls['Manufacturer'].value
      }
    });
    dialogRef.afterClosed()
    .subscribe(res => {
      if (!!res) {
        debugger;
        var req = {
          SoftwareId : res ,
          SoftwareTypeId : 5
        }
        this.itamService.movetoaction(req).subscribe((res: any) => {
          debugger;
          console.log(res);      
          this.toastr.success("success", this.message.AssetrakSays);     
        });
        // this.itamService.updatemanagedsoftware(res).subscribe((res: any) => {
        //   debugger;
        //   console.log(res);
        // });
      }       
    })
  }

  addLicenseType(){
    debugger;
    let dialogRef = this.dialog.open(AddLicenseTypeDialogComponent, {
      maxHeight: '90vh',
      width: '600px',
      data: {
        'ManufacturerId': this.softwareForm.controls['Manufacturer'].value
      }
    });
    dialogRef.afterClosed()
    .subscribe(res => {
      if (!!res) {
        debugger;
        this.itamService.insertSoftwareLicenseType(res).subscribe((res: any) => {
          debugger;
          console.log(res);
          if(!!res && res.errorMessage == 'duplicate'){
            this.toastr.warning("duplicate", this.message.AssetrakSays); 
          }
          else{
            this.toastr.success("success", this.message.AssetrakSays); 
          }
        });
      }    
    })
  }

  applyManufactureFilter() {
    debugger;
    let search = this.softwareForm.controls['ManufacturerFilter'].value;
    if (!search) {
      this.typeOfManufacturers = this.typeOfManufacturers1;
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the s
    this.typeOfManufacturers = this.typeOfManufacturers1.filter(col => col.Name.toLowerCase().indexOf(search) > -1);

  }

  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;

  add(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push({ LicenseOption : value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: any): void {
    let index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  paste(event: ClipboardEvent): void {
    event.preventDefault(); //Prevents the default action
    event.clipboardData
      .getData('Text') //Gets the text pasted
      .split(/;|,|\n/) //Splits it when a SEMICOLON or COMMA or NEWLINE
      .forEach(value => {
        if (value.trim()) {
          this.fruits.push({ LicenseOption : value.trim() }); //Push if valid
        }
      })
  }
  
  Submit() {
    debugger;
    var error = 0;
    var LicenseFields = [];
    if(!!this.displayFields && this.displayFields.length > 0){
      this.displayFields.forEach(val => {
        var field = {
          LicenseTypeFieldID : val.Id,
          FieldValue : val.Value
        }
        LicenseFields.push(field);
        if(val.Mandatory == true && !val.Value){
          error++;
        }
      })
    }

    var LicenseKeys = (!!this.fruits && this.fruits.length > 0) ? JSON.stringify(this.fruits) : "";

    if(error > 0){
      this.toastr.warning("Mandatory ( * ) fields are required.", this.message.AssetrakSays);
      return false;
    }

    var reqData = {
      ID: 0,
      ManufacturerID: this.softwareForm.value.Manufacturer,
      SoftwareID: this.softwareForm.value.ManagedSoftware,
      AcquisitionDate: !this.softwareForm.value.AcquisitionDate ? null : this.datepipe.transform(this.softwareForm.value.AcquisitionDate, 'yyyy-MM-dd'),
      ExpiryDate: !this.softwareForm.value.ExpiryDate ? null :  this.datepipe.transform(this.softwareForm.value.ExpiryDate, 'yyyy-MM-dd'),
      LicenseTypeID: !!this.softwareForm.value.LicenseType ? this.softwareForm.value.LicenseType : 0,
      PurchaseCost: !!this.softwareForm.value.PurchaseCost ? this.softwareForm.value.PurchaseCost : 0,
      PurchasedFor: !!this.softwareForm.value.PurchasedFor ? this.softwareForm.value.PurchasedFor : 0,
      VendorID: !!this.softwareForm.value.Vendor ? this.softwareForm.value.Vendor : 0,
      Description: this.softwareForm.value.Description,      
      LicenseKeys: !!this.softwareForm.value.LicenseKeys ? this.softwareForm.value.LicenseKeys : "ABCD-ASDR-ASSR",    
      insert_SoftwareLicenseFields :  LicenseFields.length > 0 ? JSON.stringify(LicenseFields) : "", 
      CreatedBy: this.UserId,
      LastUpdatedBy: "",
      //SoftwareSuiteID : !!this.softwareForm.value.Package ? this.softwareForm.value.Package : "",
      //insert_downgraderights : this.dRights.length > 0 ? JSON.stringify(this.dRights) : "",      
    }

    debugger;
    this.itamService.insertSoftwareLicense(reqData).subscribe((res: any) => {
      debugger;
      console.log(res);
      if(!!res && !!res.errorMessage){
        
      }
      this.toastr.success("Software license added successfully.", this.message.AssetrakSays);
      this.router.navigateByUrl('h11/f');
    });

    // var reqData = {
    //   LicenseAgreementDetailID: 0,
    //   ManufacturerID: this.softwareForm.value.Manufacturer,
    //   LicenseAgreementID: 0,
    //   GroupId: this.GroupId,
    //   CompanyId: this.CompanyId ,
    //   AcquisitionDate: !this.softwareForm.value.AcquisitionDate ? null : this.datepipe.transform(this.softwareForm.value.AcquisitionDate, 'yyyy-MM-dd'),
    //   SoftwareID: this.softwareForm.value.ManagedSoftware,
    //   ExpiryDate: !this.softwareForm.value.ExpiryDate ? null :  this.datepipe.transform(this.softwareForm.value.ExpiryDate, 'yyyy-MM-dd'),
    //   LicenseTypeID: this.softwareForm.value.LicenseType,
    //   PurchaseCost: !!this.softwareForm.value.PurchaseCost ? this.softwareForm.value.PurchaseCost : 0,
    //   LicenseOption: this.softwareForm.value.LicenseOption,
    //   PurchasedFor: !!this.softwareForm.value.PurchasedFor ? this.softwareForm.value.PurchasedFor : 0,
    //   NoofCALs: !!this.softwareForm.value.NoofCALs ? this.softwareForm.value.NoofCALs : 0,
    //   UsersAllowed: !!this.softwareForm.value.UsersAllowed ? this.softwareForm.value.UsersAllowed : 0,
    //   VendorID: !!this.softwareForm.value.Vendor ? this.softwareForm.value.Vendor : 0,
    //   Description: this.softwareForm.value.Description,
    //   Usedby: !!this.softwareForm.value.Usedby ? this.softwareForm.value.Usedby : 0,
    //   AllocateTo: !!this.softwareForm.value.AllocateTo ? this.softwareForm.value.AllocateTo : "",
    //   HostID: !!this.softwareForm.value.HostID ? this.softwareForm.value.HostID : "",
    //   OSName: !!this.softwareForm.value.OSName ? this.softwareForm.value.OSName : "",
    //   InstallationsAllowed: this.softwareForm.value.InstallationsAllowed,
    //   LicenseKeys: !!this.softwareForm.value.LicenseKeys ? this.softwareForm.value.LicenseKeys : "",
    //   Allocated: !!this.softwareForm.value.Allocated ? this.softwareForm.value.Allocated : "",
    //   CreatedBy: this.UserId,
    //   LastUpdatedBy: "",
    //   AssociatetoServer:"",
    //   SoftwareSuiteID : !!this.softwareForm.value.Package ? this.softwareForm.value.Package : "",
    //   insert_downgraderights : this.dRights.length > 0 ? JSON.stringify(this.dRights) : "",
    //   LicenseType : 'New',
    //   SoftwareUpgradeFrom:"",
    //   SoftwareupgradeLicense : "",
    //   SoftwareUpgradeTo:""
    // }
   

  }


}
