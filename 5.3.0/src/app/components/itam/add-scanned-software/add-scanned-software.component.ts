import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Component, OnInit, ViewChild, Inject, ViewEncapsulation, EventEmitter, Output, VERSION, ChangeDetectionStrategy } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { take, takeUntil } from 'rxjs/operators';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
import * as headers from '../../../../assets/Headers.json';
import * as resource from '../../../../assets/Resource.json';
import * as moment from "moment";
import { default as _rollupMoment } from "moment";
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { UploadScannedSoftwareComponent } from 'app/components/itam/dialogs/upload-scanned-software/upload-scanned-software.component';
import { AddManufacturerDialogComponent } from 'app/components/itam/dialogs/add-manufacturer-dialog/add-manufacturer-dialog.component';
import { ITAMService } from 'app/components/services/ITAMService';


@Component({
  selector: 'app-add-scanned-software',
  templateUrl: './add-scanned-software.component.html',
  styleUrls: ['./add-scanned-software.component.scss']
})
export class AddScannedSoftwareComponent implements OnInit {
  message: any = (resource as any).default;
  header: any = (headers as any).default;
  jsonDoc: any;
  submitted: boolean = false;
  fileList: any[] = [];
  photos: any[]=['photo'];
  softwareComponents: any;
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
 
  public typeOfSoftwares: any[] = [];
  public typeOfCategorys: any[] = [];
  public typeOfManufacturers: any[] = [];
  public typeOfManufacturers1 : any[] = [];
  public typeOfSoftwareSuites: any[] = [];
  public LCTypes: any[] = ['Perpetual','Subscription'];
  public RestrictionTypes: any[] = ['Per User', 'Per Core'];
  GroupId: any;
  RegionId: any;
  UserId: any;
  CompanyId: any;
  typeOfSoftware: any = '';

  public colFilterCtrl: FormControl = new FormControl();
  
  get s2() { return this.stp1Form.controls; }
  get s1() {return this.softwareForm.controls; }
  
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

    this.stp1Form = this.fb.group({
      TypeAsst: [''],
      AsstNo: [''],
      LicenseType: ['']
    });

    this.softwareForm = this.fb.group({
      SoftwareName: ['' , [Validators.required,this.noWhitespaceValidator]],
      SoftwareVersion: [''],
      SoftwareType: [''],
      SoftwareTypeFilter :[''],
      SoftwareCategory: ['',[Validators.required]],
      SoftwareCategoryFilter:[''],
      Manufacturer: ['',[Validators.required]],
      ManufacturerFilter : [''],
      SoftwareSuite: [''],
      SoftwareSuiteFilter : [''],
      Description: [''],
      Images: [''],
      ComponentSoftware: [''],
      ComponentSoftwareFilter:[''],
      Role : []
    });

    this.route.queryParams
    .subscribe(params=>{
      this.typeOfSoftware = params.type;

    })

    if(this.typeOfSoftware == 'nss'){
      this.softwareForm.get('ComponentSoftware').setValidators([Validators.required]);
      this.softwareForm.get('ComponentSoftware').updateValueAndValidity();

      // this.softwareForm.get('Role').setValidators([Validators.required]);
      // this.softwareForm.get('Role').updateValueAndValidity();
    }
    else{
      this.softwareForm.get('SoftwareType').setValidators([Validators.required]);
      this.softwareForm.get('SoftwareType').updateValueAndValidity();
    }

    this.getsoftwareTypes();
    this.getSoftwareCategory();
    this.getSoftwareManufacturers();
    //this.getRoleList();
    //this.getSoftwareSuite(0);
  }
  selectedImages: any = [];

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  addAnotherPhoto(){
    let dialogRef = this.dialog.open(UploadScannedSoftwareComponent, {
      maxHeight: '90vh',
      width: '600px',
      data: {
        uploadBy: 'this.dialogForm.value.uploadBy',
      },
    });
    dialogRef.afterClosed()
    .subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }
      let images = [];
      res.forEach(r=>{
        images.push(r.file);
      })
      this.selectedImages = images;
    })
  }

  addManufacturer(){
    let dialogRef = this.dialog.open(AddManufacturerDialogComponent, {
      maxHeight: '90vh',
      width: 'auto',
      data: {
        'name': 'Scanned Software'
      }
    });
    dialogRef.afterClosed()
    .subscribe(res => {
      if (!res) {
        // If user press cancel
        return;
      }
      this.itamService.insertManufacturer(res).subscribe(response=>{
          
        this.getSoftwareManufacturers();
      });
    })
  }

  getsoftwareTypes(){     
    var Isoptions =  1 ; 
    this.itamService.getSoftwareType(Isoptions).subscribe((res: any)=>{       
      this.typeOfSoftwares = res;
      console.log(res);
    });
  }

  getSoftwareCategory(){     
    this.itamService.getSoftwareCategory().subscribe((res: any)=>{       
      this.typeOfCategorys = res;
      console.log(res)
    });
  }

  getSoftwareManufacturers(){     
    this.itamService.getSoftwareManufacturer().subscribe((res: any)=>{       
      this.typeOfManufacturers = res;
      this.typeOfManufacturers1 = res;
      console.log(res);
    });
  }

  applyManufactureFilter() {
      
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

  roleList : any[]=[];
  getRoleList(){     
    this.itamService.getRoleList().subscribe((res: any)=>{       
      this.roleList = res;
      console.log(res);
    });
  }
  
  ChangeType(type){
    
    // if(this.typeOfSoftware == 'nss' && type.SoftwareTypeName == 'Managed'){
    //   this.softwareForm.get('ComponentSoftware').setValidators([Validators.required]);
    //   this.softwareForm.get('ComponentSoftware').updateValueAndValidity();
    // }
    // else{
    //   this.softwareForm.get('ComponentSoftware').clearValidators();
    //   this.softwareForm.get('ComponentSoftware').updateValueAndValidity();
    // }

    if(this.typeOfSoftware == 'ns' && type.SoftwareTypeName == 'Managed'){
      this.softwareForm.get('SoftwareSuite').setValidators([Validators.required]);
      this.softwareForm.get('SoftwareSuite').updateValueAndValidity();

      //this.softwareForm.get('Role').setValidators([Validators.required]);
      //this.softwareForm.get('Role').updateValueAndValidity();
    }
    else{
      this.softwareForm.get('SoftwareSuite').clearValidators();
      this.softwareForm.get('SoftwareSuite').updateValueAndValidity();

      //this.softwareForm.get('Role').clearValidators();
      //this.softwareForm.get('Role').updateValueAndValidity();
    }
  }

  onExit(){
    let route = 'h11/d';
    this.router.navigateByUrl(route);
  }

  getSoftwareSuite(mid){     
    var optionId = 1;
    this.itamService.getSoftwareSuite(optionId , mid).subscribe((res: any)=>{       
      this.typeOfSoftwareSuites = res;
      console.log(res);
    });
  }

  getSuiteComponentSoftware(mID){
    this.itamService.getSuiteComponentSoftware(mID).subscribe((res: any)=>{
      this.softwareComponents = res;
      console.log(res);
    });
    this.getSoftwareSuite(mID);
  }
  
  onSave(){
       
    if(this.typeOfSoftware == 'nss'){

      var ComponentSoftware = [];
      var SuiteComponentSoftware = !!this.softwareForm.value.ComponentSoftware ? this.softwareForm.value.ComponentSoftware : "";
      if(!!SuiteComponentSoftware){
        SuiteComponentSoftware.forEach(val => {
          var aa ={
            SoftwareID : val.SoftwareId,
            SoftwareName : val.SoftwareName
          }
          ComponentSoftware.push(aa)
        })        
      }

      let data = {
        id : 0,
        SoftwareName: this.softwareForm.value.SoftwareName,
        SoftwareVersion :!!this.softwareForm.value.SoftwareVersion ? this.softwareForm.value.SoftwareVersion : "",
        SoftwareTypeID: !!this.softwareForm.value.SoftwareType ? this.softwareForm.value.SoftwareType : 0,
        SoftwareCategoryID: !!this.softwareForm.value.SoftwareCategory ? this.softwareForm.value.SoftwareCategory : 0,
        ManufacturerID: !!this.softwareForm.value.Manufacturer ? this.softwareForm.value.Manufacturer: 0,
        //Cost:this.softwareForm.value.Cost,
        Description: !!this.softwareForm.value.Description ? this.softwareForm.value.Description : "",
        CompanyId: this.CompanyId,
        GroupId: this.GroupId,
        SuiteComponentSoftware: !!this.softwareForm.value.ComponentSoftware ? JSON.stringify(ComponentSoftware) : "",
        //LicenseAgreementID : 0,
        Images: this.selectedImages
      }
      this.itamService.insertUpdateNewSoftwareSuite(data).subscribe(res=>{
         
        console.log(res);
        if(res != null && res.errorMessage == 'duplicate'){
          this.toastr.warning("Software package name is duplicate", this.message.AssetrakSays);
        }
        else{
          this.toastr.success("Software package added successfully", this.message.AssetrakSays);
          this.router.navigateByUrl('h11/d');   
        }
      })
    }
    else{
      let data = {
        SoftwareName: this.softwareForm.value.SoftwareName,
        SoftwareVersion : !!this.softwareForm.value.SoftwareVersion ? this.softwareForm.value.SoftwareVersion : "",
        SoftwareTypeID: !!this.softwareForm.value.SoftwareType ? this.softwareForm.value.SoftwareType : 0,
        SoftwareCategoryID: !!this.softwareForm.value.SoftwareCategory ? this.softwareForm.value.SoftwareCategory : 0,
        ManufacturerID: !!this.softwareForm.value.Manufacturer ? this.softwareForm.value.Manufacturer: 0,
        SoftwareSuiteID:!!this.softwareForm.value.SoftwareSuite ? this.softwareForm.value.SoftwareSuite : 0,
        Description: !!this.softwareForm.value.Description ? this.softwareForm.value.Description : "",
        CompanyId: this.CompanyId,
        GroupId: this.GroupId,
        //SuiteComponentSoftware: !!this.softwareForm.value.ComponentSoftware ? this.softwareForm.value.ComponentSoftware : '0',
        Images: this.selectedImages,
        //RoleID : !!this.softwareForm.value.RoleID ? this.softwareForm.value.RoleID : "",
      }
      this.itamService.insertNewSoftware(data).subscribe(res=>{
          
        console.log(res);
        if(res != null && res.errorMessage == 'duplicate'){
          this.toastr.warning("Software name is duplicate", this.message.AssetrakSays);
        }
        else{
          this.toastr.success("Software added successfully", this.message.AssetrakSays);
          this.router.navigateByUrl('h11/d');
        }
      })
    }
    
  }
}
