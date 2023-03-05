import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStoreService } from '../../../../../shared/services/local-store.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GroupService } from 'app/components/services/GroupService';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { NumberValidator } from 'ngx-custom-validators/src/app/number/directive';
import {DatePipe} from '@angular/common';
import moment from 'moment';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { CompanyService} from 'app/components/services/CompanyService';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'DD MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-freezedialog',
  templateUrl: './freeze.component.html',
  styleUrls: ['./freeze.component.scss'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}]
})
export class FreezedialogComponent implements OnInit {
  submitted: boolean = false;
  public grpnm: any;
  FreezeForm: FormGroup;
  get f1() { return this.FreezeForm.controls; };
  protected _onDestroy = new Subject<void>();
  public currencyData: any[]=[];
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  // currencyData: any;
  

  minDate = new Date();
  periodmindate :any;
  periodmaxdate :any;
  freezedmindate :any;
  freezedmaxdate :any;
  CompanyId: any;
  GroupId: any;
  UserId: any;
  RegionId: any;
  freezedateStart:any;
  freezedateEnd:any;
  freezeminStart:any;
  freezemaxStart:any;
  Enddatevalid : boolean = true;

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  public filteredCurrency: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(public matdialogbox: MatDialogRef<FreezedialogComponent>, 
    public localService: LocalStoreService, @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,public groupservice: GroupService,
    public CompanyService :CompanyService,
    private storage: ManagerService, 
  ) { }
 

  ngOnInit() {
    debugger;
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    
    this.FreezeForm = this.fb.group({
      freezeStartDate: [''],
      freezeEndDate: ['',Validators.required],
    });

    if(this.data.component1 == 'FreezedialogComponent' && this.data.value === 'edit')
    {
      this.periodmindate = moment(this.data.name.PeriodStartDate),
      this.periodmaxdate = moment(this.data.name.PeriodEndDate),
      this.FreezeForm.controls['freezeStartDate'].setValue(moment(this.data.name.FreezeStartDate)),
      this.FreezeForm.controls['freezeEndDate'].setValue(moment(this.data.name.FreezeEndDate)),
      this.freezedmindate = moment(this.data.name.FreezeStartDate),
      this.freezedmaxdate = moment(this.data.name.FreezeEndDate)
      if(this.minDate > this.periodmindate){
        this.freezedateStart = this.minDate;

      }else{
        this.freezedateStart= this.periodmindate;
      }
      if( this.data.name.FreezeEndDate == null){
        this.freezeminStart =this.periodmindate  ;

      }else{
        this.freezeminStart= this.freezedmindate;
      }

      if( this.data.name.FreezeEndDate == null){
        this.freezemaxStart = this.periodmaxdate ;

      }else{
        this.freezemaxStart= this.freezedmaxdate;
      }
      if(this.minDate > this.freezedmindate){
        this.freezedateEnd = this.minDate;

      }else{
        this.freezedateEnd= this.freezedmindate;
      }
      // if(this.periodmindate > this.)
    }

    debugger;
    
  }
  

  public onclosetab() {
    this.matdialogbox.close();
  }

  openfreezeEnddate(event: any){
    debugger;
  
    if(event.target.value != ''){
  
    var  startDate = moment(this.FreezeForm.value.freezeStartDate).format("YYYY/MM/DD").toString();
     var EndDate =moment(event.target.value).format("YYYY/MM/DD").toString();
 
     if(startDate < EndDate){
      this.Enddatevalid = false;
     } 
     else{
      this.Enddatevalid = true;
     }
   }
  }
  openfreezeStartdate(event :any){
    debugger
    if(event.target.value != ''){
      
      var  startDate = moment( event.target.value).format("YYYY/MM/DD").toString();
      if(!! this.FreezeForm.value.freezeEndDate)
      {
        var EndDate =moment(this.FreezeForm.value.freezeEndDate).format("YYYY/MM/DD").toString();
        //  this.ngOnInit();    
         if(startDate < EndDate){
          this.Enddatevalid = false;
         } 
         else{
          this.Enddatevalid = true;
         }
      }
      else{
        this.Enddatevalid = true;
      }

     }
    }
     
  
  onSubmit() {

    // var freezeData={        
    //   freezeStartDate: this.FreezeForm.value.freezeStartDate,
    //   freezeEndDate: this.FreezeForm.value.freezeEndDate        
    // }
    debugger;
      var cutOffPeriodMasterDto={
      PeriodName: this.data.name.PeriodName,
      DisplayName: this.data.name.DisplayName,
      PeriodStartDate: this.JsonDate(this.data.name.PeriodStartDate),   
      PeriodEndDate: this.JsonDate(this.data.name.PeriodEndDate),
      CreatedBy:this.UserId,
      FreezeStartDate: this.JsonDate(this.FreezeForm.value.freezeStartDate),
      FreezeEndDate: this.JsonDate(this.FreezeForm.value.freezeEndDate),      
      Custom1:this.data.name.Custom1,
      Custom2:this.data.name.Custom2,
      Custom3:this.data.name.Custom3,
      FiscalYear:this.data.name.Custome5,
      PeriodId:this.data.name.PeriodId,
      // groupid:this.GroupId,
    }
    this.CompanyService.UpdateCutoffPeriodDetailsByPeriodid(cutOffPeriodMasterDto).subscribe(r=>{
      debugger;
      if (r=="Updated Successfully..!")
      {
        this.matdialogbox.close("Updated Successfully..!");
      }
      else if(r=="Inserted Successfully..!")
      {
        this.matdialogbox.close("Inserted Successfully..!");
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
  public save() {
   
    this.localService.clear();
    this.localService.setItem('selectedgrp', this.grpnm);
    this.onclosetab();
  }


}