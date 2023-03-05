import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { ReplaySubject, Subject,forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { CompanyService} from 'app/components/services/CompanyService';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { UserService } from '../../../services/UserService';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageAlertService } from '../../../../shared/services/app-msg-alert/app-msg.service';

import { FreezedialogComponent } from './freeze_edit_dialog/freeze.component';
import { PerioddialogComponent } from './period_edit_dialog/period.component';
import * as MenuHeaders from '../../../../../assets/MenuHeaders.json';
import moment from 'moment';

interface FinancialList {
  id: string;
  name: string;
}

const FLIST: FinancialList[] = [
  { name: '2021-22', id: 'A' },
  // { name: '2021-22', id: 'B' },

];

export interface PeriodicElement {
  PeriodName: string;
  DisplayName: string,
  PeriodStartDate: string,
  PeriodEndDate: string,
  FreezeStartDate: string,
  FreezeEndDate: string,
  action: string

}

@Component({
  selector: 'app-cut-off',
  templateUrl: './cut-off.component.html',
  styleUrls: ['./cut-off.component.scss']
})
export class CutOffComponent implements OnInit {

  header: any ;
  message: any ;
  menuheader: any = (MenuHeaders as any).default;

  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  @ViewChild('table', { static: true }) table: any;

  ELEMENT_DATA: PeriodicElement[] = [
    { PeriodName: 'P1', DisplayName: 'Period 1', PeriodStartDate: '01-Feb-2021', PeriodEndDate: '01-Mar-2021', FreezeStartDate: '5-Feb-2021', FreezeEndDate: '28-Feb-2021', action: '' },
    { PeriodName: 'P2', DisplayName: 'Period 2', PeriodStartDate: '02-Mar-2021', PeriodEndDate: '01-Apr-2021', FreezeStartDate: '5-Mar-2021', FreezeEndDate: '28-Mar-2021', action: '' }


  ];

  public periodEndDatePicker = [];
  public FreezeStartDatePicker = [];
  public FreezeEndDatePicker = [];

  public periodEndDateIcon = [];
  public FreezeStartDateIcon = [];
  public FreezeEndDateIcon = [];

  public DisplayName = [];
  public DisplayNameIcon = [];

  public AssetInfo: FormGroup;

  protected _onDestroy = new Subject<void>();

  // dialogCuttofForm: FormGroup;
  // get f1() { return this.dialogGroupForm.controls; };
  protected flist1: FinancialList[] = FLIST;
  public FinancialCtrl: FormControl = new FormControl();
  public FinancialFilterCtrl: FormControl = new FormControl();
  public filteredFinancialList: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  // data = Object.assign(this.ELEMENT_DATA);
  displayedHeaders = []
  displayedColumns: string[] = ['PeriodName', 'DisplayName', 'PeriodStartDate', 'PeriodEndDate', 'FreezeStartDate', 'FreezeEndDate','ForcedActive','action'];
  today = new Date();
  // dataSource = new MatTableDataSource<Element>(this.data);
  dataSource: any;
  data:any[]=[];
  selection = new SelectionModel<Element>(true, []);
  selectedItems:any[]=[];
  yearlist:any[]=[];
  CompanyId: any;
  GroupId: any;
  UserId: any;
  RegionId: any;
  ProfileId: any;
  minDate = new Date();
  fiscalyear:any;
  periodEndmaxdate:any;


  constructor(public toastr: ToastrService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService, private dialog: MatDialog,
    private fb: FormBuilder, public datepipe: DatePipe,
    public CompanyService :CompanyService,
    private storage: ManagerService,
    private router: Router,
    public alertService: MessageAlertService,
	public us: UserService,
  private jwtAuth: JwtAuthService) { 
    this.header = this.jwtAuth.getHeaders();
    this.message = this.jwtAuth.getResources();

    this.displayedHeaders = [this.header.PeriodName, this.header.DisplayName, this.header.PeriodStartDate, this.header.PeriodEndDate, this.header.FreezeStartDate, this.header.FreezeEndDate,''];
  }
 

  ngOnInit(): void {
    debugger;
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    this.ProfileId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_PROFILE);

    this.GetInitiatedData();
    this.Getfinancialyear();
    

    
    // this.GetInitiatedData();

    // this.FinancialFilterCtrl.valueChanges
    //   .pipe(takeUntil(this._onDestroy))
    //   .subscribe(() => {
    //     this.filterList();
    //   });

    this.buildItemForm();

    for (let i = 0; i < this.ELEMENT_DATA.length; i++) {

      this.FreezeEndDateIcon.push(false);
      this.FreezeEndDatePicker.push(false);
      this.periodEndDatePicker.push(false);
      this.FreezeStartDatePicker.push(false);
      this.periodEndDateIcon.push(false);
      this.FreezeStartDateIcon.push(false);

      this.DisplayNameIcon.push(false);
      this.DisplayName.push(false);

    }

  }


  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  GetInitiatedData() {

    if(this.ProfileId == '0')
    {      
      let url5 = this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.RegionId, "71");
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
    else{
      this.PermissionIdList = [14]
    }
    
  }	


  Getfinancialyear(){
    debugger;
    
     this.CompanyService.GetFiscalYearList(this.GroupId).subscribe(r=>{
       debugger;
       this.yearlist= JSON.parse(r);
       this.filteredFinancialList.next(this.yearlist.slice());

       this.FinancialFilterCtrl.valueChanges
         .pipe(takeUntil(this._onDestroy))
         .subscribe(() => {
           this.filterList();
         });
         
     })
  }

  getData(event) {
    debugger;
    this.selectedItems=event.FiscalYear;
   this.GetPeriodList();
    
  }
  data1:any[]=[];
  private isButtonvisiable =false;
  PeriodEndDate:any;
  GetPeriodList(){
    debugger;
    this.loader.open();
    this.data=[];
    this.dataSource="";
    // const financialyear= this.selectedItems;
    var financialyear= this.selectedItems;
    this.CompanyService.GetPeriodList(this.GroupId,this.RegionId,this.CompanyId,financialyear).subscribe(r=>{
      debugger;
      this.loader.close();
      this.data1= JSON.parse(r);
      this.data1.forEach(element =>{
        debugger
        this.PeriodEndDate =moment(element.PeriodEndDate)
        if(this.minDate > this.PeriodEndDate )
        {
          element.isButtonvisiable= false;
          //this.isButtonvisiable=false;
          this.data.push(element);
        }
        else{
          element.isButtonvisiable= true;
          //this.isButtonvisiable=true;
          this.data.push(element);
        }
      })
      // this.dataSource = new MatTableDataSource<Element>(this.data);
      this.onChangeDataSource( this.data);
    })
    }
  onChangeDataSource(value) {
    debugger;
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  protected filterList() {
    if (!this.yearlist) {
      return;
    }
    let search = this.FinancialFilterCtrl.value;
    if (!search) {
      this.filteredFinancialList.next(this.yearlist.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredFinancialList.next(
      this.yearlist.filter(x => x.name.toLowerCase().indexOf(search) > -1)
    );
  }

  selected(event) {


  }

  buildItemForm() {
    this.AssetInfo = this.fb.group({
      PeriodEndDate: [''],
      FreezeStartDate: [''],
      FreezeEndDate: [''],
      DisplayName:[''],
    })
  }



  openDialogFreeze(...getValue): void {
    debugger;
    var component: any
    if (getValue[0] === 'upload') {
      //component=UploadDialogComponent
    }
    else {
      component = FreezedialogComponent;
    }
    const dialogRef = this.dialog.open(component, {

      disableClose: true,
      data: {
        component1: 'FreezedialogComponent',
        value: getValue[0],
        name: getValue[1],
    
      },
      
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result == "Updated Successfully..!")
      {
        this.GetPeriodList();
        this.toastr.success(this.message.freezeupdate,this.message.AssetrakSays);
      }
      else  if (result == "Inserted Successfully..!")
      {
        this.GetPeriodList();
        this.toastr.success(this.message.freezeupdate ,this.message.AssetrakSays);
      }

      // if (result && getValue[0] === 'edit') {
      //   debugger;
      //   this.freezeEndDate = this.datepipe.transform(result.freezeEndDate._d, 'dd-MMM-yyyy');
      //   this.freezeStartDate = this.datepipe.transform(result.freezeStartDate._d, 'dd-MMM-yyyy');
        
      //   for (let i = 0; i < this.ELEMENT_DATA.length; i++) {
         
      //       if (getValue[1].PeriodName == this.ELEMENT_DATA[i].PeriodName) {

      //         this.ELEMENT_DATA[i].FreezeEndDate=this.freezeEndDate ;
      //         this.ELEMENT_DATA[i].FreezeStartDate=this.freezeStartDate
      //         this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);
      //       }
      //     }
      // }
      // else if (result && getValue[0] === 'insert') {
      //   // debugger;
      //   //   this.updateRegionDataInsert = result;
      //   //   this.updateRegionDataInsert['GroupId']=this.GroupId;

      //   //   this.AddRegion(this.updateRegionDataInsert)
      // }

    });
  }
  freezeEndDate:any;
  freezeStartDate:any;
  periodStartDate:any;
  periodEndDate:any;
  displayName:any;
  openDialogPeriod(...getValue): void {
    debugger;
    this.yearlist.forEach(element => {
      if(element.FiscalYear=this.selectedItems)
      {
        this.periodEndmaxdate=element.FiscalYearEndDate;
      }
      else{

      }})
    var component: any
    if (getValue[0] === 'upload') {
      //component=UploadDialogComponent
    }
    else {
      component = PerioddialogComponent;
    }
    const dialogRef = this.dialog.open(component, {
      width: '700px',
      disableClose: true,
      data: {
        component1: 'PerioddialogComponent',
        value: getValue[0],
        name: getValue[1],
        periodEndmaxdate:this.periodEndmaxdate
      },
    });
    debugger;

    dialogRef.afterClosed().subscribe(result => {
      debugger;
      if (result == "Updated Successfully..!")
      {
        this.GetPeriodList();
        this.toastr.success(this.message.Periodupdate, this.message.AssetrakSays,);
      }
      else  if (result == "Inserted Successfully..!")
      {
        this.GetPeriodList();
        this.toastr.success(this.message.Perioddate,this.message.AssetrakSays);
      }
      // if (result && getValue[0] === 'edit') {
      //   debugger;
      //   this.displayName = result.displayName;
      //   this.periodStartDate = this.datepipe.transform(result.periodStartDate._d, 'dd-MMM-yyyy');
      //   this.periodEndDate= this.datepipe.transform(result.periodEndDate._d, 'dd-MMM-yyyy');
        
      //   for (let i = 0; i < this.ELEMENT_DATA.length; i++) {
         
      //       if (getValue[1].PeriodName == this.ELEMENT_DATA[i].PeriodName) {

      //         this.ELEMENT_DATA[i].DisplayName=this.displayName ;
      //         this.ELEMENT_DATA[i].PeriodStartDate=this.periodStartDate ;
      //         this.ELEMENT_DATA[i].PeriodEndDate=this.periodEndDate
      //         this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);
      //       }
      //     }
      // }
      // else if (result && getValue[0] === 'insert') {
     
      // }
      // this.GetPeriodList();
    });
  }
 

  PeriodEndmaxDate: any;
  PeriodEndmaxDateFormat: any;
  FreezeStartmaxDate: any;
  FreezeStartmaxDateFormat: any;
  FreezeEndmaxDate: any;
  FreezeEndmaxDateFormat: any;
  PeriodEndDateValidation() {
    debugger;
    this.PeriodEndmaxDateFormat = new Date(this.AssetInfo.get('PeriodEndDate').value);

    this.PeriodEndmaxDate = this.datepipe.transform(this.PeriodEndmaxDateFormat, 'dd-MMM-yyyy');


  }

  FreezeStartDateValidation() {
    debugger;
    this.FreezeStartmaxDateFormat = new Date(this.AssetInfo.get('FreezeStartDate').value);

    this.FreezeStartmaxDate = this.datepipe.transform(this.FreezeStartmaxDateFormat, 'dd-MMM-yyyy');


  }

  FreezeEndDateValidation() {
    debugger;
    this.FreezeEndmaxDateFormat = new Date(this.AssetInfo.get('FreezeEndDate').value);
    console.log(this.FreezeEndmaxDateFormat);

    this.FreezeEndmaxDate = this.datepipe.transform(this.FreezeEndmaxDateFormat, 'dd-MMM-yyyy');
    console.log(this.FreezeEndmaxDate);


  }

  showDate(element, property) {
    debugger;
    for (let i = 0; i < this.ELEMENT_DATA.length; i++) {
      // var idx=element.indexOf(this.ELEMENT_DATA[i].PeriodName);
      // if (this.periodEndDatePicker[i] == true || this.FreezeStartDatePicker[i] == true || this.FreezeEndDatePicker[i] == true) {

      // } else {
        if (element == this.ELEMENT_DATA[i].PeriodName) {
          debugger;

          if (property === "PeriodEndDate") {
            this.periodEndDatePicker[i] = true;
            this.periodEndDateIcon[i] = true;
            this.AssetInfo.controls['PeriodEndDate'].setValue(new Date(this.ELEMENT_DATA[i].PeriodEndDate));
            console.log(this.AssetInfo.controls['PeriodEndDate'].value);
          }
          else if (property === "FreezeStartDate") {
            this.FreezeStartDatePicker[i] = true;
            this.FreezeStartDateIcon[i] = true;
            this.AssetInfo.controls['FreezeStartDate'].setValue(new Date(this.ELEMENT_DATA[i].FreezeStartDate));
            console.log(this.AssetInfo.controls['FreezeStartDate'].value);
          }
          else if (property === "FreezeEndDate") {
            this.FreezeEndDatePicker[i] = true;
            this.FreezeEndDateIcon[i] = true;
            this.AssetInfo.controls['FreezeEndDate'].setValue(new Date(this.ELEMENT_DATA[i].FreezeEndDate));
          }
          else if (property === "DisplayName") {
            this.DisplayName[i] = true;
            this.DisplayNameIcon[i] = true;
            this.AssetInfo.controls['DisplayName'].setValue(this.ELEMENT_DATA[i].DisplayName);
          }
        }
     // }
    }
    debugger;
  }

  hideDate(element, property) {
    for (let i = 0; i < this.ELEMENT_DATA.length; i++) {
      //  var idx=element.indexOf(this.ELEMENT_DATA[i].PeriodName);
      if (element == this.ELEMENT_DATA[i].PeriodName) {
        if (property === "PeriodEndDate") {
          this.periodEndDatePicker[i] = false;
          this.periodEndDateIcon[i] = false;
          this.PeriodEndDateValidation();
          this.ELEMENT_DATA[i].PeriodEndDate = this.PeriodEndmaxDate;
        }
        else if (property === "FreezeStartDate") {
          this.FreezeStartDatePicker[i] = false;
          this.FreezeStartDateIcon[i] = false;
          this.FreezeStartDateValidation();
          this.ELEMENT_DATA[i].FreezeStartDate = this.FreezeStartmaxDate;
        }
        else if (property === "FreezeEndDate") {
          this.FreezeEndDatePicker[i] = false;
          this.FreezeEndDateIcon[i] = false;
          this.FreezeEndDateValidation();
          this.ELEMENT_DATA[i].FreezeEndDate = this.FreezeEndmaxDate;
        }
        else if (property === "DisplayName") {
          debugger;
          this.DisplayName[i] = false;
          this.DisplayNameIcon[i] = false;
          this.ELEMENT_DATA[i].DisplayName = this.AssetInfo.controls['DisplayName'].value;
         // this.AssetInfo.controls['DisplayName'].setValue(new Date(this.ELEMENT_DATA[i].DisplayName));
        }
      }
    }
  }


  changedisable(checkval,data){
    debugger;
    if(this.PermissionIdList.indexOf(163) > -1)
    {
      if (checkval.checked == true) {
        this.ForToggleChange(data , true);
      }
      else{
        this.ForToggleChange(data , false);
      }
    }  
    else {
      this.toastr.warning( this.message.AssetrakSays , this.message.NotAuthorizedtoForceActive);
    }  
  }

  ForToggleChange(result: any , ForcedActive) {
    debugger;
      var cutOffPeriodMasterDto={
      PeriodName: result.PeriodName,
      DisplayName: result.DisplayName,
      PeriodStartDate: this.JsonDate(result.PeriodStartDate),   
      PeriodEndDate: this.JsonDate(result.PeriodEndDate),
      CreatedBy:this.UserId,
      FreezeStartDate: this.JsonDate(result.FreezeStartDate),
      FreezeEndDate: this.JsonDate(result.FreezeEndDate),      
      Custom1:this.GroupId,
      Custom2:this.RegionId,
      Custom3:this.CompanyId,
      FiscalYear:result.Custome5,
      PeriodId:result.PeriodId,
      ForcedActive: ForcedActive
    }
    this.CompanyService.UpdateCutoffPeriodDetailsByPeriodid(cutOffPeriodMasterDto).subscribe(r=>{
      debugger;
      if (r)
      {
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

}
