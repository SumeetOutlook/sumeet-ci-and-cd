import { Component, OnInit,ViewEncapsulation,ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {GroupService} from 'app/components/services/GroupService';
import moment, { now } from "moment";
import { FormBuilder, Validators, FormGroup ,FormControl} from '@angular/forms';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { ToastrService } from 'ngx-toastr';
import * as resource from '../../../../assets/Resource.json';
import { Constants } from 'app/components/storage/constants';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { date } from 'ngx-custom-validators/src/app/date/validator';


export interface PeriodicElement {
  configuration: string;
  enable:string;
}


interface ListOfConfig {
  id: string;
  name: string;
}

const ListOfConfig: ListOfConfig[] = [
  { name: 'Calendar Year', id: '1' },
  { name: 'Financial Year', id: '2' },
  { name: 'Other', id: '3' },

];

@Component({
  selector: 'app-otherConfig',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.css']
})

export class OtherConfigComponent implements OnInit {
  message: any = (resource as any).default;
  AdminConfigGrid: any[] = [];
  Save: any[] = [];
  SelectGridItems:any[] = [];
  SelectLayerItems = 0;
  SelectSplitItems = 0;
  SelectedId: any[] = [];
  public Group: any[] = [];
  displayedColumns: string[] =['configuration','enable'];
  dataSource = new MatTableDataSource<any>();
  public StartDatectrl: FormControl = new FormControl();
  EndDatectrl = new FormControl();
  public GrpCtrl: FormControl = new FormControl();
  GrpCtrlr : FormControl = new FormControl();

 // public filteredFinancialList: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteregroup: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
// public filteredFinancialList: any;
//dataSource = new MatTableDataSource(ELEMENT_DATA);
// dialogGroupForm: FormGroup;
//   get f1() { return this.dialogGroupForm.controls; };

@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort: MatSort;
protected _onDestroy = new Subject<void>();
protected ListOfConfigList: ListOfConfig[] = ListOfConfig;
  constructor(public groupservice:GroupService,private fb: FormBuilder,public storage:ManagerService,
    public toastr: ToastrService, ) { 
 
  }
  GroupId: any;
  RegionId: any;
  UserId: any;
  CompanyId: any;

  ngOnInit(): void {
   
    // this.dialogGroupForm = this.fb.group({
    //   EndDatectrl: [''],
    //   GrpCtrlr : [],
    //   GrpCtrl : [],
    //   StartDatectrl : [],
    // });

    debugger;
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);

    this.GetGroupDetails();
    // this.GetAdminConfigGrid();
    this.GetAdminConfigGridOnLoad();
  }

  SelectedGroupItem :any[] = [];

  SelectGroupbox(event) {

    this.SelectedGroupItem = event;
    this.GetAdminConfigGrid();
  }
  
  GetGroupDetails() {
    debugger;
    this.groupservice.GetAllGroupDetails().subscribe(response => {

      this.Group = JSON.parse(response);
      this.getFiltergrp();
    })
  }

  getFiltergrp() {

    this.filteregroup.next(this.Group.slice());
    this.GrpCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        ;
       // this.filterUOMData();
      });

  }


  protected filterUOMData() {
debugger;
    if (!this.Group) {
      return;
    }
    // get the search keyword
    let search = this.GrpCtrl.value;
    if (!search) {
      this.filteregroup.next(this.Group.slice());
      return;
    } else {
      search = search.toLowerCase();

    }
    // filter the Group
    this.filteregroup.next(
      this.Group.filter(x => x.GroupName.toLowerCase().indexOf(search) > -1)
    );

  }

  // GetGroupDetails() {
  //   debugger;
    
  //     this.groupservice.GetAllGroupDetails().subscribe(response => {
  
  //       //this.Group = JSON.parse(response);
  //       const data = JSON.parse(response);
  //       this.filteredFinancialList.next(data);
  //       //this.filteredFinancialList.next(data.slice());
  //     })
  //   }

  GetAdminConfigGridOnLoad(){
    debugger;
   
    this.groupservice.GETONLOADADMINDETAILS().subscribe(response=>{
     debugger;
      this.AdminConfigGrid=JSON.parse(response);
      this.onChangeDataSource(this.AdminConfigGrid);
      //this.ListOfConfigList = ListOfConfig;
    });
  }
   

  GetAdminConfigGrid(){
    debugger;
   // var groupId=2;
    //var groupId=this.GroupId;
    var groupId = this.SelectedGroupItem;
    this.groupservice.GetAdminConfigDetailsByGroupId(groupId).subscribe(response=>{
     debugger;
      this.AdminConfigGrid=JSON.parse(response);
      this.onChangeDataSource(this.AdminConfigGrid);
      //this.ListOfConfigList = ListOfConfig;
    });
  }

onChangeDataSource(value) {
  this.dataSource = new MatTableDataSource(value);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
 
}

// SelectGridCheckbox(event)
//   {
//     debugger;
   
//     var idx = this.SelectGridItems.indexOf(event);
//     if (idx > -1) {
//       this.SelectGridItems.splice(idx, 1);  
//     }
//     else {
//       this.SelectGridItems.push(event);
//     }
//     this.GetList(this.SelectGridItems);
//   } 

//   GetList(RecordEntities: any) {
//     debugger;
//     this.SelectedId = "";
//     RecordEntities.forEach(Id => {
//       this.SelectedId = Id + "," + this.SelectedId;
//     });
//     this.SelectedId = this.SelectedId.replace(/,\s*$/, "");
//   }

SelectGridCheckbox(element) {
  debugger;
  if (element.SelectedValue == 0) {
    element.SelectedValue = 1;
  }
  else {
    element.SelectedValue = 0;
  }

  console.log(this.dataSource);
}
  
  today = new Date(); 

  CalendarYr:boolean=false;
  FinancialYr:boolean=false;
  OtherYr:boolean=false;
  CalendarCtrlstart:any;
  CalendarCtrlend:any;
  FinancialCtrlstart:any;
  FinancialCtrlend:any;
  getData(event)
  {
  debugger;
  this.CalendarYr=false;
  this.FinancialYr=false;
  this.OtherYr=false;

  if(event.name== "Calendar Year"){
  
    this.CalendarYr=true;
    this.CalendarCtrlstart="1 Jan";
    this.CalendarCtrlend="31 Dec";

  }else if(event.name== "Financial Year"){

    this.FinancialYr=true;
    this.FinancialCtrlstart="1 Apr";
    this.FinancialCtrlend="31 Mar";

  }else if(event.name== "Other"){

    this.OtherYr=true;
    
  }

  }
  changeSplitStage(event)
  {
    debugger;
    this.SelectSplitItems = event;
  }

  changeLayerStage(event)
  {
    debugger;
    this.SelectLayerItems = event;
  }

  

  OtherEndDate : any;

  ChangeEndDate(event: any){

  debugger;

  if(event.target.value != ''){
  
     //const EndDate =   moment(event.target.value).format("YYYY/MM/DD").toString();
    const EndDate =   event.target.value;

    this.OtherEndDate = moment(EndDate).add(12, 'months');

    const NewEndDate = new Date(this.OtherEndDate);
    
   //this.OtherEndDate = moment(NewEndDate).format("dd/mm/yyyy").toString();

    //this.dialogGroupForm.controls['EndDatectrl'].setValue(this.OtherEndDate.trim());
    this.EndDatectrl.setValue(NewEndDate);
  }
 

  }

  btnSave() {
    debugger;
    for (var i = 0; i < this.dataSource.data.length; i++) {
      if (this.dataSource.data[i].SelectedValue > 0) {
        this.SelectedId.push(this.dataSource.data[i].ConfigurationMasterId);
        if (this.dataSource.data[i].ConfigurationMasterId == 2) {
          this.SelectSplitItems = this.dataSource.data[i].SelectedValue;
        }
        if (this.dataSource.data[i].ConfigurationMasterId == 3) {
          this.SelectLayerItems = this.dataSource.data[i].SelectedValue;
        }
      }
    }

    var strdt=this.StartDatectrl.value;
    var enddt= moment(this.EndDatectrl.value).subtract(1, 'day');
    debugger;
    if (this.SelectedId.length > 0) {
      var groupDetails =
      {
        StartValue: moment(strdt).format("YYYY/MM/DD").toString() ,
        EndValue: moment(enddt).format("YYYY/MM/DD").toString() ,
        //listOfId: this.SelectedId.join(','),
        split:this.SelectSplitItems,
        layerno: this.SelectLayerItems,
        //grid: 2,
        //grid:this.GroupId,
        grid: this.SelectedGroupItem ,
      }
      debugger;
      this.groupservice.SAveAdminConfigDetails(groupDetails).subscribe(r => {
        debugger;
        //this.Save= JSON.parse(r);      
        this.Save = r;
        this.GetAdminConfigGridOnLoad();
      })

    }
    
  }


  // btnSave() {
  //   debugger;
  //   var strdt=this.StartDatectrl.value;
  //   var enddt= this.EndDatectrl.value;
  //   var groupDetails;
  //   if(this.SelectedId != null){
  //    groupDetails = {
  //   // grid:this.GroupId,
  //   grid:2,
  //   StartValue: moment(strdt).format("YYYY/MM/DD").toString() ,
  //   EndValue: moment(enddt).format("YYYY/MM/DD").toString() ,
  //   listOfId:this.SelectedId,
  //   layerno: this.SelectLayerItems
  //   }
  // }
  // else{
  //    groupDetails = {
  //     //grid:this.GroupId,
  //     grid:2,
  //     StartValue: moment(strdt).format("YYYY/MM/DD").toString() ,
  //     EndValue: moment(enddt).format("YYYY/MM/DD").toString() ,
  //     layerno: this.SelectLayerItems
  //    }
  // }
  //    debugger;
  //    this.groupservice.SAveAdminConfigDetails(groupDetails).subscribe(r=>{
  //     debugger;
  //   this.Save= JSON.parse(r);
  //   this.GetAdminConfigGrid(); 
  //   })
  // }
  

}
