
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableDataSource } from '@angular/material/table';
import { GroupService } from 'app/components/services/GroupService';
import { UserRoleService } from 'app/components/services/UserRoleService';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import * as resource from '../../../../assets/Resource.json';
import { take, takeUntil } from 'rxjs/operators';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { Directive, HostListener } from "@angular/core";
import * as Menuheaders from '../../../../assets/MenuHeaders.json';

@Directive({
  selector: '[numberOnly]'
})
export class NumberOnlyDirective {
  // Only want positive integers
  private regex: RegExp = new RegExp(/^\d+$/g);
  // Allow key codes for special events Backspace, tab, end, home
  private specialKeys = ['Backspace', 'Tab', 'End', 'Home'];

  constructor(private el: ElementRef) { }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) > -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    let next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }
}

@Component({
  selector: 'app-notificationspanel',
  templateUrl: './notificationspanel.component.html',
  styleUrls: ['./notificationspanel.component.scss']
})

export class NotificationspanelComponent implements OnInit {

  // displayedColumns: string[] = ['Select', 'Active', 'Type', 'Template', 'MailTo', 'MailCC', 'action'];
  displayedColumns: string[] = ['Select', 'Active', 'Type', 'Template', 'MailTo', 'action'];
  // displayedColumns1: string[] = ['Select', 'Active', 'Type', 'Template', 'MailTo', 'MailCC', 'Frequency', 'Calender', 'Time', 'period', 'HourlyFrequency', 'Expirydate', 'LastRunDate', 'NextRunDate', 'action'];
  displayedColumns1: string[] = ['Select', 'Active', 'Type', 'Template', 'MailTo', 'Frequency', 'Calender', 'Time', 'period', 'HourlyFrequency', 'Expirydate', 'LastRunDate', 'NextRunDate', 'action'];
  disabled: boolean = true;
  SessionGroupId: any;
  SessionRegionId: any;
  SessionCompanyId: any;
  public filteredTemplateName: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  GroupId: any;
  RegionId: any;
  CompanyId: any;
  UserId: any;
  today = new Date();
  message: any = (resource as any).default;
  constructor(public groupservice: GroupService, private userRoleService: UserRoleService,
    private loader: AppLoaderService, private confirmService: AppConfirmService,
    public datepipe: DatePipe, public toastr: ToastrService,
    private storage: ManagerService,) { }
  panelOpenState = false;
  protected _onDestroy = new Subject<void>();
  FrequencyList = [{ value: '1', FName: "Daily" }, { value: '2', FName: "Alternate days" }, { value: '7', FName: "Weekly" }, { value: '15', FName: "Fortnightly" }, { value: '30', FName: "Monthly" }]
  ActiveList = [{ value: 'True', name: "Active" }, { value: 'False', name: "Inactive" }]

  public ModelwiseData: any[] = [];
  public ModelwiseData1: any[] = [];
  InitData: any;
  EventData: any[] = [];
  TOData: any[] = [];
  CCData: any[] = [];
  SelectedId: any[] = [];
  subdata = [];
  Template: any;
  RoleData: any[] = [];
  userRole: any[] = [];
  SelectedFrequencyItems = 0;
  public selectedIndex;
  MenuHeader: any = (Menuheaders as any).default;

  ngOnInit(): void {
  
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    //this.GETALLEVENTDATA();
    this.GetAllRoleList();
    this.GetAllEventBasedData();
  }

  nextStep(i) {
    debugger;
    this.getselectedIds = [];
    this.selectedIndex = i;
    if (this.selectedIndex == 0) {
      this.GetAllEventBasedData();
    }
    else (this.selectedIndex == 1)
    {
      this.GetAllSheduledBasedData();
    }
  }  
  tabClick(event){   
    this.getselectedIds = [];
    if (event.index == 0) {
      this.GetAllEventBasedData();
    }
    else {
      this.GetAllSheduledBasedData();
    }    
  }
  assettransfername: any;
  binddata: any[] = [];
  GetAllEventBasedData() {
    debugger;
    this.loader.open();
    this.groupservice.GetNotificationModelWiseList(this.CompanyId).subscribe(response => {
      debugger;
      this.loader.close();
      this.ModelwiseData = [];
      var modulename = [];
      this.binddata = JSON.parse(response);
      for (var i = 0; i < this.binddata.length; i++) {
        debugger;
        var aa = {
          modulename: this.MenuHeader[this.binddata[i][0].ModuleName],
          sub: []
        }
        debugger;
        this.ModelwiseData.push(aa);
      }

      // binddata.forEach(element => {
      //   if (!!element.ModuleName && element.ModuleName != null) {
      //     modulename.push(element.ModuleName);
      //   }
      // });
      // modulename = modulename.filter(function (item, pos) {
      //   return modulename.indexOf(item) == pos;
      // })
      // for (var i = 0; i < modulename.length; i++) { // modulename.length
      //   var subdata = [];
      //   binddata.forEach(element => {          
      //     if (element.ModuleName == modulename[i]) {
      //       if (!!element.TemplateCode) {
      //         this.EventData.forEach((val) => {                
      //           if (val.TemplateShortCode.toLowerCase() == element.TemplateCode.toLowerCase()) {
      //             element.CategoryCtrl = val.TemplateShortCode;
      //           }
      //         })
      //       }
      //       if (!!element.ToRoleID) {          
      //         element.CategoryCtrl1 = element.ToRoleID;
      //       }
      //       if (!!element.CCRoleId) {          
      //         element.CategoryCtrl2 = element.CCRoleId;
      //       }                    
      //       element.IsActive = !!element.IsActive ? 'true' : 'false' ;            
      //       subdata.push(element);
      //     }
      //   });
      //   var aa = {
      //     modulename: modulename[i],
      //     sub: subdata
      //   }
      //   debugger;
      //   this.ModelwiseData.push(aa);
      //   this.loader.close();
      // }
      //this.onChangeDataSource(this.ModelwiseData)
    })
  }

  ShowModuleData(data){
    debugger;
    for (var i = 0; i < this.binddata.length; i++) {
      if(data.modulename == this.MenuHeader[this.binddata[i][0].ModuleName]){
        this.binddata[i].forEach(element => {
          //element.IsActive = !!element.IsActive ? 'true' : 'false' ;
          if(element.IsActive == true || element.IsActive == 'true'){
            element.IsActive = 'true' ;
          }
          else{
            element.IsActive = 'false' ;
          }
        });
        data.sub = this.binddata[i]
      }      
    }
  }

  // BindExistingData()
  // {
  //   for (var i = 0; i < subdata.length; i++)
  //   this.CostCenterData.forEach((val) => {
  //     if (val.Description.toLowerCase() == this.editAssetInfo.Building.toLowerCase()) {
  //     this.CostCenterValueSelected = val;
  //     this.InventoryInfo.controls['CostCenter'].setValue(val)
  //     }
  //     })
  // }
  // onChangeDataSource(value) {
  //    
  //   this.CreateMaster1 = new MatTableDataSource(value);
  //   this.CreateMaster1.paginator = this.paginator;
  //   this.CreateMaster1.sort = this.sort;

  // } 
  GETALLEVENTDATA() {
    this.Template = [];
    this.groupservice.GetEventData().subscribe(response => {
      debugger;
      this.EventData = JSON.parse(response);
    })
  }

  GetAllRoleList() {
    this.RoleData = [];
    //this.groupservice.GetAllRoleListByGroupNotification(groupId, regionId, companyId).subscribe(r => {
    this.userRoleService.GetAllRolesByLevel(this.GroupId, this.RegionId, this.CompanyId).subscribe(r => {     
      this.userRole = r;
    })
  }

  SelectGridCheckbox(element) {    
    element.disabled = !element.disabled;
    this.getselectedIds.push(element);
  }
  save(element) {
    debugger;
    if (element.IsActive == "true")
    {
     if( !element.TemplateCode || (element.ToRoleID.length == 0 && !element.ToValue)) {
      this.toastr.warning("Mandatory fields Required", this.message.AssetrakSays);
      return false;
     }
     else{
      var EmailDto = {
        EventName: element.EventName,
        EventId: element.EventId,
        TemplateCode: element.TemplateCode,
        ToRoleID: element.ToRoleID,
        CCRoleId: element.CCRoleId,
        IsActive: element.IsActive == 'true' ? true : false,
        CompanyId: this.CompanyId
      }
      this.loader.open();
      this.groupservice.UpdateEVentBasedData(EmailDto).subscribe(r => {
        debugger;
        this.loader.close();
        element.disabled = !element.disabled;
        this.getselectedIds = [];
        if (r == "Success") {
          this.toastr.success("Data Updated Successfully", this.message.AssetrakSays);
        }
        else {
          this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
        }
      })
     }
    }
    else{
    var EmailDto = {
      EventName: element.EventName,
      EventId: element.EventId,
      TemplateCode: element.TemplateCode,
      ToRoleID: element.ToRoleID,
      CCRoleId: element.CCRoleId,
      IsActive: element.IsActive == 'true' ? true : false,
      CompanyId: this.CompanyId
    }
    this.loader.open();
    this.groupservice.UpdateEVentBasedData(EmailDto).subscribe(r => {
      debugger;
      this.loader.close();
      element.disabled = !element.disabled;
      this.getselectedIds = [];
      if (r == "Success") {
        this.toastr.success("Data Updated Successfully", this.message.AssetrakSays);
      }
      else {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
    })
  }
  }

  getselectedIds : any[]=[];
  SelectGridCheckbox1(element) {
    debugger;
    if (!element.disabled) {
      element.disabled = true;
    }
    else {
      element.disabled = false;
    }
    this.getselectedIds.push(element);
  }

  newEventlist: any[] = [];
  binddata1 : any[] = [];
  GetAllSheduledBasedData() {
    debugger;
    this.loader.open();
    this.groupservice.GetNotificationModelWiseListScheduledBase(this.CompanyId).subscribe(response => {
      debugger;
      this.loader.close();
      var modulename1 = [];
      this.ModelwiseData1 = [];
      this.binddata1 = JSON.parse(response);    
      for (var i = 0; i < this.binddata1.length; i++) {
        var aa = {
          modulename1: this.MenuHeader[this.binddata1[i][0].ModuleName],
          sub1: []
        }
        debugger;
        this.ModelwiseData1.push(aa);
      }

      // binddata1.forEach(element => {
      //   if (!!element.ModuleName && element.ModuleName != null) {
      //     modulename1.push(element.ModuleName);
      //   }
      // });
      // modulename1 = modulename1.filter(function (item, pos) {
      //   return modulename1.indexOf(item) == pos;
      // })
      // for (var i = 0; i < modulename1.length; i++) {
      //   var subdata1 = [];
      //   binddata1.forEach(element => {
      //     //element.Templatelist = [];
      //     if (element.ModuleName == modulename1[i]) {
      //       //if (!!element.TemplateCode) {
      //       //debugger;
      //       //this.EventData.forEach(data => {                
      //       //if(data.TemplateShortCode.startsWith(element.ID)){
      //       //element.Templatelist.push(data);
      //       //}   
      //       //})
      //       debugger;
      //       // if(!!element.Templatelist){
      //       //   element.Templatelist.forEach((val) => {
      //       //     //var datalist = JSON.parse(element.Templatelist);
      //       //     //datalist.forEach((val) => {
      //       //     if (val.TemplateShortCode.toLowerCase() == element.TemplateCode.toLowerCase()) {
      //       //       debugger;
      //       //       element.TemplateShortCodeCtrlScheduled = val.TemplateShortCode;
      //       //       //this.newEventlist.push(val);
      //       //     }
      //       //   })
      //       // }            
      //       //}
      //       if (!!element.ToRoleID) {
      //         element.ToCtrlSheduled = element.ToRoleID;
      //       }
      //       if (!!element.CCRoleId) {
      //         element.CCCtrlSheduled = element.CCRoleId;
      //       }
      //       if (!!element.Frequency) {
      //         element.Frequency = element.Frequency;
      //       }
      //       if (!!element.StartDate) {
      //         element.CalendarCtrlstart = element.StartDate;
      //       }
      //       if (!!element.LastRunDateTime) {
      //         element.LastRunDateCtrl = element.LastRunDateTime;
      //       }
      //       if (!!element.NextRunDateTime) {
      //         element.NextRunDateCtrl = element.NextRunDateTime;
      //       }
      //       if (!!element.ExpiryDate) {
      //         element.ExpiryDate = element.ExpiryDate;
      //       }
      //       if (!!element.Period) {
      //         element.Period = element.Period;
      //       }
      //       if (!!element.StartTime) {
      //         element.StartTime = element.StartTime;
      //       }
      //       if (!!element.HourlyFrequency) {
      //         element.HourlyFrequency = element.HourlyFrequency;
      //       }
      //       if (!!element.TemplateCode) {
      //         element.TemplateShortCodeCtrlScheduled = element.TemplateCode;
      //       }
      //       debugger;
      //       element.IsActive = !!element.IsActive ? 'true' : 'false';
      //       subdata1.push(element);
      //     }
      //   });
      //   debugger;
      //   var aa = {
      //     modulename1: modulename1[i],
      //     sub1: subdata1
      //   }
      //   this.ModelwiseData1.push(aa);
      //   this.loader.close();
      // }
      //this.onChangeDataSource(this.ModelwiseData)
    })
  }

  ShowSheduledBasedData(data){
    debugger;
    for (var i = 0; i < this.binddata1.length; i++) {
      if(data.modulename1 == this.MenuHeader[this.binddata1[i][0].ModuleName]){
        this.binddata1[i].forEach(element => {
          debugger;
          if(element.IsActive == true || element.IsActive == 'true'){
            element.IsActive = 'true' ;
          }
          else{
            element.IsActive = 'false' ;
          }
        
        });
        data.sub1 = this.binddata1[i]
      }      
    }
  }

  save1(element) {
    debugger;
    if (element.Period == 0){
      element.Period = "0"
      
    }
    if (element.IsActive == "true"){
    if ( !element.TemplateCode || !element.ToRoleID || !element.Frequency || !element.StartDate || !element.Period || !element.StartTime) {
      this.toastr.warning("Mandatory fields are Required", this.message.AssetrakSays)
      return false;
    }
    else{

      var CalendarCtrlstart = this.datepipe.transform(element.StartDate, 'dd-MMM-yyyy');
      var ExpiryDate = this.datepipe.transform(element.ExpiryDate, 'dd-MMM-yyyy');
  
      var ScheduledDto = {
        IsActive: element.IsActive == 'true' ? true : false,
        TemplateCode: element.TemplateCode,
        ToRoleID: element.ToRoleID,
        CCRoleId: element.CCRoleId,
        StartDate: !CalendarCtrlstart ? "" : CalendarCtrlstart,
        StartTime: element.StartTime,
        Period: element.Period,
        ChangeFrequency: !element.Frequency ? 0 : parseInt(element.Frequency),
        EventName: element.EventName,
        EventId: element.ID,
        HourlyFrequency: !element.HourlyFrequency ? 0 : element.HourlyFrequency,
        ExpiryDateNew: !ExpiryDate ? "" : ExpiryDate,
        CompanyId: this.CompanyId
      }
      this.groupservice.UpdateScheduledBasedData(ScheduledDto).subscribe(r => {
        debugger;
        element.disabled = !element.disabled;
        this.getselectedIds = [];
        if (r == "Success") {
          this.toastr.success("Data Updated Successfully", this.message.AssetrakSays)
        }
        else {
          this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
        }
  
      })
    }
  }
  else{

    var CalendarCtrlstart = this.datepipe.transform(element.StartDate, 'dd-MMM-yyyy');
    var ExpiryDate = this.datepipe.transform(element.ExpiryDate, 'dd-MMM-yyyy');

    var ScheduledDto = {
      IsActive: element.IsActive == 'true' ? true : false,
      TemplateCode: element.TemplateCode,
      ToRoleID: element.ToRoleID,
      CCRoleId: element.CCRoleId,
      StartDate: !CalendarCtrlstart ? "" : CalendarCtrlstart,
      StartTime: element.StartTime,
      Period: element.Period,
      ChangeFrequency: !element.Frequency ? 0 : parseInt(element.Frequency),
      EventName: element.EventName,
      EventId: element.ID,
      HourlyFrequency: !element.HourlyFrequency ? 0 : element.HourlyFrequency,
      ExpiryDateNew: !ExpiryDate ? "" : ExpiryDate,
      CompanyId: this.CompanyId
    }
    this.groupservice.UpdateScheduledBasedData(ScheduledDto).subscribe(r => {
      debugger;
      element.disabled = !element.disabled;
      this.getselectedIds = [];
      if (r == "Success") {
        this.toastr.success("Data Updated Successfully", this.message.AssetrakSays)
      }
      else {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }

    })
  }
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
  
handleChange(row) {
  debugger;

  if (row.HourlyFrequency < 0.1){
    row.HourlyFrequency = 0.1
    
  } else if(row.HourlyFrequency > 24){
    row.HourlyFrequency = 24;
  } 
}

}
