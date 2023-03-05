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
  selector: 'app-perioddialog',
  templateUrl: './period.component.html',
  styleUrls: ['./period.component.scss'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}]
})
export class PerioddialogComponent implements OnInit {
  submitted: boolean = false;
  public grpnm: any;
  PeriodForm: FormGroup;
  get f1() { return this.PeriodForm.controls; };
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
  date: Date;
  periods:any; 
  periodEndmindate:any; 
  Enddatevalid : boolean = true;
  fiscalyear:any;
  yearlist:any[]=[];
  periodEndmaxdate:any;
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  public filteredCurrency: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(public matdialogbox: MatDialogRef<PerioddialogComponent>, 
    public localService: LocalStoreService, @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,public groupservice: GroupService,  public datepipe: DatePipe,
    public CompanyService :CompanyService,
    private storage: ManagerService,) { }
  

  ngOnInit() {
    debugger;
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    this.periodEndmaxdate= this.data.periodEndmaxdate;
    this.getfiscalyear();
  //   this.date = this.data.name.PeriodStartDate,
  // this.date.setDate( this.date.getDate() + 1 );
    this.PeriodForm = this.fb.group({
      periodEndDate: [''],
      periodStartDate: [''],
      displayName: ['']
    });
    // this.periods= (this.PeriodForm.value.periodEndDate.getDate() + 1) ;

    if(this.data.component1 == 'PerioddialogComponent' && this.data.value === 'edit')
    {
      debugger;
      // var ll=this.datepipe.transform(this.data.name.PeriodStartDate, 'dd-MMM-yyyy')
      this.periodmindate = moment(this.data.name.PeriodStartDate),
      // this.periodmindate = new Date();
      // this.periodEndmindate = new Date();
      this.periodmaxdate = moment(this.data.name.PeriodEndDate),
      this.freezedmindate = moment(this.data.name.FreezeStartDate),
      this.freezedmaxdate = moment(this.data.name.FreezeEndDate),
      this.PeriodForm.controls['displayName'].setValue(this.data.name.DisplayName),
      this.PeriodForm.controls['periodStartDate'].setValue(moment(this.data.name.PeriodStartDate)),     
      this.PeriodForm.controls['periodEndDate'].setValue(moment(this.data.name.PeriodEndDate))
      if(this.freezedmaxdate >+ this.periodmindate)
      {
        this.periodEndmindate = this.freezedmaxdate;
      }
      else
      {
        this.periodEndmindate = this.periodmindate;
      }
     

      // this.PeriodForm.controls['emailId'].setValue(this.data.name.DisplayName)
      
    }

    debugger;
    
    
  }
  
  getfiscalyear(){
    this.CompanyService.GetFiscalYearList(this.GroupId).subscribe(r=>{
      this.yearlist= JSON.parse(r);
      this.yearlist.forEach(element => {
        if(element.FiscalYear=this.fiscalyear)
        {
          this.periodEndmaxdate=element.FiscalYearEndDate;
        }
        else{

        }
      });
      //this.filteredFinancialList.next(this.yearlist.slice());
    })
  }
  public onclosetab() {
    this.matdialogbox.close();
  }

  onSubmit() {
    debugger;
    this.periods = moment(this.PeriodForm.value.periodEndDate).add(1, "day");
   var  Freeze;
   var  Freeze1;
    // var PeriodData={        
    //   displayName: this.PeriodForm.value.displayName,
    //   periodStartDate: this.PeriodForm.value.periodStartDate,   
    //   periodEndDate: this.PeriodForm.value.periodEndDate        
    // }
    if(this.data.name.FreezeStartDate==null && this.data.name.FreezeEndDate==null)
      {
        Freeze=null;
        Freeze1=null;
      }
      else{
      Freeze=this.JsonDate(this.data.name.FreezeStartDate) ;
      Freeze1=this.JsonDate(this.data.name.FreezeEndDate) ;
      }
    var cutOffPeriodMasterDto={

      PeriodName: this.data.name.PeriodName,
      DisplayName: this.PeriodForm.value.displayName,
      PeriodStartDate: this.JsonDate(this.PeriodForm.value.periodStartDate),   
      PeriodEndDate: this.JsonDate(this.PeriodForm.value.periodEndDate),
      CreatedBy:this.UserId,
      FreezeStartDate:Freeze,
      FreezeEndDate:Freeze1,       
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
      // this.periods= this.PeriodForm.value.periodEndDate ;
      // {
      //  var cutOffPeriodMasterDto={
      //     PeriodName: this.data.name.PeriodName,
      //     DisplayName: this.PeriodForm.value.displayName,
      //     PeriodStartDate: this.JsonDate(this.periods) ,//this.JsonDate(this.PeriodForm.value.periodEndDate),   
          // PeriodEndDate: this.JsonDate(this.data.name.PeriodEndDate),
          // CreatedBy:this.UserId,
          // FreezeStartDate:null ,
          // FreezeEndDate:null,
          // Custom1:this.data.name.Custom1,
          // Custom2:this.data.name.Custom2,
          // Custom3:this.data.name.Custom3,
          // FiscalYear:this.data.name.Custome5,
          // PeriodId:this.data.name.PeriodId,

        // }

      //   this.CompanyService.AddCutOffDetailsForCurrentFiscalYear(cutOffPeriodMasterDto).subscribe(r=>{
      //     debugger;
      //   })
      // }

    });
    // this.matdialogbox.close("Updated Successfully..!");
    // this.matdialogbox.close();
  
    
  
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

  openperiodEnddate(event: any){
    debugger;
  
    if(event.target.value != ''){
  
    var  startDate = moment(this.PeriodForm.value.periodStartDate).format("YYYY/MM/DD").toString();
     var EndDate =moment(event.target.value).format("YYYY/MM/DD").toString();
 
     if(startDate < EndDate){
      this.Enddatevalid = false;
     } 
     else{
      this.Enddatevalid = true;
     }
   }
  }
  openperiodStartdate(event :any){
    debugger
    if(event.target.value != ''){
      
      var  startDate = moment( event.target.value).format("YYYY/MM/DD").toString();
      if(!! this.PeriodForm.value.periodEndDate)
      {
        var EndDate =moment(this.PeriodForm.value.periodEndDate).format("YYYY/MM/DD").toString();
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


}