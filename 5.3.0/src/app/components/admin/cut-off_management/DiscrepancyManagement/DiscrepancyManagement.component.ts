

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { Router, ActivatedRoute } from "@angular/router";
import { LocalStoreService } from 'app/shared/services/local-store.service';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { CompanyService} from 'app/components/services/CompanyService';
import { UploadService } from 'app/components/services/UploadService';
import * as menuheaders from '../../../../../assets/MenuHeaders.json'



// interface FinancialList {
//   id: string;
//   name: string;
// }

// const FLIST: FinancialList[] = [
//   { name: '2021-22', id: 'A' },
//   // { name: '2021-22', id: 'B' },

// ];

export interface PeriodicElement {
  PeriodName: string;
  //  SortDiscrepancy:string,
  // Rundescripancy:string,
  FileUpdate:string,
  Viewdescripancy:string,


}

@Component({
  selector: 'app-DiscrepancyManagement',
  templateUrl: './DiscrepancyManagement.component.html',
  styleUrls: ['./DiscrepancyManagement.component.scss']
})
export class DiscrepancyManagement implements OnInit {

  header: any ;
  message: any ;
  menuheader: any = (menuheaders as any).default

  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  @ViewChild('table', { static: true }) table: any;

  ELEMENT_DATA: PeriodicElement[] = [
    { PeriodName: 'P1', FileUpdate:'FileUpdate' , Viewdescripancy:'Viewdescripancyreport' },
    { PeriodName: 'P2', FileUpdate:'FileUpdate' , Viewdescripancy:'viewdescripancyreport' },
    { PeriodName: 'P3', FileUpdate:'FileUpdate' , Viewdescripancy:'Viewdescripancyreport' }
 

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
  // protected flist1: FinancialList[] = FLIST;
  public FinancialCtrl: FormControl = new FormControl();
  public FinancialFilterCtrl: FormControl = new FormControl();
  public filteredFinancialList: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  data = Object.assign(this.ELEMENT_DATA);
  data1:any[]=[];
  displayedHeaders = []
  displayedColumns: string[] = ['Custome1','FileUpdate','Viewdescripancyreport'];
  today = new Date();
  // dataSource = new MatTableDataSource<Element>(this.data);
  dataSource: any;
  selection = new SelectionModel<Element>(true, []);
  public grpdata;
  selectedItems:any[]=[];
  fileList:any[]=[];
  ShowGobutton:boolean =false;
  Flielist:any
  yearlist:any[]=[];
  CompanyId: any;
  GroupId: any;
  UserId: any;
  RegionId: any;
  Viewdescripancy:boolean =true;
  fileextlist:any[];
  constructor(public toastr: ToastrService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService, private dialog: MatDialog,
    private fb: FormBuilder, public datepipe: DatePipe,
    private router: Router,
    public localService: LocalStoreService,
    public CompanyService :CompanyService,
    private storage: ManagerService,
    public uploadService: UploadService,
    private jwtAuth: JwtAuthService) { 
      this.header = this.jwtAuth.getHeaders();
      this.message = this.jwtAuth.getResources();

      this.displayedHeaders = [this.header.PeriodName,this.header.SortDiscrepancy];
    }


  ngOnInit(): void {
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    
    this.Getfinancialyear();
    // this.GetInitiatedData();
    var FunctionId = 2;
    this.uploadService.GetAllowedExtensions(FunctionId).subscribe(response => {
      debugger;
      this.fileextlist =response;  
    })

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
  Getfinancialyear(){
     
    
     this.CompanyService.GetFiscalYearList(this.GroupId).subscribe(r=>{
        
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
       
    this.selectedItems=event.FiscalYear;
    this.ShowGobutton=true 
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
  openRundescripancy(element): void {
     
    var financialyear= this.selectedItems;
    var period =element.Custome1;
    this.CompanyService.RunDescrepancy(this.GroupId, this.RegionId, this.CompanyId, period , financialyear ).subscribe(r=>{
       
      if(r=="Discrepancy ran successfully")
      {
        this.ShowDecrepancydata(); 
       this.toastr.success(this.message.AssetrakSays,this.message.RunDiscrepancy);
      }
      else{
        this.toastr.error(this.message.AssetrakSays,this.message.FileFormatIncorrect);
        return; 
      }

    })
  }
  
  openViewdescripancy(element): void { 
 
  this.router.navigateByUrl('h9/q');
  let name = String;
  let name1 =String;
  let Selectedfinancialyear :any[]=[];
  let Id = 0;
  Selectedfinancialyear=  this.selectedItems
  name = element.Custome1;
  name1 = element.FileName;
  


let payloadObject = {
  name: name,
  name1: name1,
  Id: Id,
  Selectedfinancialyear:Selectedfinancialyear
}
this.grpdata = payloadObject;
    this.localService.setItem("selectedgrp", this.grpdata);
 }
  //    
  //   var component: any
  //   if (getValue[0] === 'upload') {admin
  //     //component=UploadDialogComponent
  //   }
  //   else {
  //     component = 
  //   }
    


  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result && getValue[0] === 'edit') {
  //        
  //       this.freezeEndDate = this.datepipe.transform(result.freezeEndDate._d, 'dd-MMM-yyyy');
  //       this.freezeStartDate = this.datepipe.transform(result.freezeStartDate._d, 'dd-MMM-yyyy');
        
  //       for (let i = 0; i < this.ELEMENT_DATA.length; i++) {
         
  //           if (getValue[1].PeriodName == this.ELEMENT_DATA[i].PeriodName) {

  //             this.ELEMENT_DATA[i].FreezeEndDate=this.freezeEndDate ;
  //             this.ELEMENT_DATA[i].FreezeStartDate=this.freezeStartDate
  //             this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);
  //           }
  //         }
  //     }
  //     else if (result && getValue[0] === 'insert') {
  //       //  
  //       //   this.updateRegionDataInsert = result;
  //       //   this.updateRegionDataInsert['GroupId']=this.GroupId;

  //       //   this.AddRegion(this.updateRegionDataInsert)
  //     }

  //   });
  // }
  freezeEndDate:any;
  freezeStartDate:any;
  periodStartDate:any;
  periodEndDate:any;
  displayName:any;
  // openDialogPeriod(...getValue): void {
  //    
  //   var component: any
  //   if (getValue[0] === 'upload') {
  //     //component=UploadDialogComponent
  //   }
  //   else {
  //     component = 
  //   }
  //   const dialogRef = this.dialog.open(component, {
  //     width: '700px',
  //     disableClose: true,
  //     data: {
  //       component1: 'PerioddialogComponent',
  //       value: getValue[0],
  //       name: getValue[1],
  //     },
  //   });


  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result && getValue[0] === 'edit') {
  //        
  //       this.displayName = result.displayName;
  //       this.periodStartDate = this.datepipe.transform(result.periodStartDate._d, 'dd-MMM-yyyy');
  //       this.periodEndDate= this.datepipe.transform(result.periodEndDate._d, 'dd-MMM-yyyy');
        
  //       for (let i = 0; i < this.ELEMENT_DATA.length; i++) {
         
  //           if (getValue[1].PeriodName == this.ELEMENT_DATA[i].PeriodName) {

  //             this.ELEMENT_DATA[i].DisplayName=this.displayName ;
  //             this.ELEMENT_DATA[i].PeriodStartDate=this.periodStartDate ;
  //             this.ELEMENT_DATA[i].PeriodEndDate=this.periodEndDate
  //             this.dataSource=new MatTableDataSource(this.ELEMENT_DATA);
  //           }
  //         }
  //     }
  //     else if (result && getValue[0] === 'insert') {
     
  //     }

  //   });
  // }
 

  PeriodEndmaxDate: any;
  PeriodEndmaxDateFormat: any;
  FreezeStartmaxDate: any;
  FreezeStartmaxDateFormat: any;
  FreezeEndmaxDate: any;
  FreezeEndmaxDateFormat: any;
  PeriodEndDateValidation() {
     
    this.PeriodEndmaxDateFormat = new Date(this.AssetInfo.get('PeriodEndDate').value);

    this.PeriodEndmaxDate = this.datepipe.transform(this.PeriodEndmaxDateFormat, 'dd-MMM-yyyy');


  }

  FreezeStartDateValidation() {
     
    this.FreezeStartmaxDateFormat = new Date(this.AssetInfo.get('FreezeStartDate').value);

    this.FreezeStartmaxDate = this.datepipe.transform(this.FreezeStartmaxDateFormat, 'dd-MMM-yyyy');


  }

  FreezeEndDateValidation() {
     
    this.FreezeEndmaxDateFormat = new Date(this.AssetInfo.get('FreezeEndDate').value);
    console.log(this.FreezeEndmaxDateFormat);

    this.FreezeEndmaxDate = this.datepipe.transform(this.FreezeEndmaxDateFormat, 'dd-MMM-yyyy');
    console.log(this.FreezeEndmaxDate);


  }

  showDate(element, property) {
     
    for (let i = 0; i < this.ELEMENT_DATA.length; i++) {
      // var idx=element.indexOf(this.ELEMENT_DATA[i].PeriodName);
      // if (this.periodEndDatePicker[i] == true || this.FreezeStartDatePicker[i] == true || this.FreezeEndDatePicker[i] == true) {

      // } else {
        // if (element == this.ELEMENT_DATA[i].PeriodName) {
        //    

        //   if (property === "PeriodEndDate") {
        //     this.periodEndDatePicker[i] = true;
        //     this.periodEndDateIcon[i] = true;
        //     this.AssetInfo.controls['PeriodEndDate'].setValue(new Date(this.ELEMENT_DATA[i].));
        //     console.log(this.AssetInfo.controls['PeriodEndDate'].value);
        //   }
        //   else if (property === "FreezeStartDate") {
        //     this.FreezeStartDatePicker[i] = true;
        //     this.FreezeStartDateIcon[i] = true;
        //     this.AssetInfo.controls['FreezeStartDate'].setValue(new Date(this.ELEMENT_DATA[i].FreezeStartDate));
        //     console.log(this.AssetInfo.controls['FreezeStartDate'].value);
        //   }
        //   else if (property === "FreezeEndDate") {
        //     this.FreezeEndDatePicker[i] = true;
        //     this.FreezeEndDateIcon[i] = true;
        //     this.AssetInfo.controls['FreezeEndDate'].setValue(new Date(this.ELEMENT_DATA[i].FreezeEndDate));
        //   }
        //   else if (property === "DisplayName") {
        //     this.DisplayName[i] = true;
        //     this.DisplayNameIcon[i] = true;
        //     this.AssetInfo.controls['DisplayName'].setValue(this.ELEMENT_DATA[i].DisplayName);
        //   }
        // }
     // }
    }
     
  }

  hideDate(element, property) {
  //   for (let i = 0; i < this.ELEMENT_DATA.length; i++) {
  //     //  var idx=element.indexOf(this.ELEMENT_DATA[i].PeriodName);
  //     if (element == this.ELEMENT_DATA[i].PeriodName) {
  //       if (property === "PeriodEndDate") {
  //         this.periodEndDatePicker[i] = false;
  //         this.periodEndDateIcon[i] = false;
  //         this.PeriodEndDateValidation();
  //         this.ELEMENT_DATA[i].PeriodEndDate = this.PeriodEndmaxDate;
  //       }
  //       else if (property === "FreezeStartDate") {
  //         this.FreezeStartDatePicker[i] = false;
  //         this.FreezeStartDateIcon[i] = false;
  //         this.FreezeStartDateValidation();
  //         this.ELEMENT_DATA[i].FreezeStartDate = this.FreezeStartmaxDate;
  //       }
  //       else if (property === "FreezeEndDate") {
  //         this.FreezeEndDatePicker[i] = false;
  //         this.FreezeEndDateIcon[i] = false;
  //         this.FreezeEndDateValidation();
  //         this.ELEMENT_DATA[i].FreezeEndDate = this.FreezeEndmaxDate;
  //       }
  //       else if (property === "DisplayName") {
  //          
  //         this.DisplayName[i] = false;
  //         this.DisplayNameIcon[i] = false;
  //         this.ELEMENT_DATA[i].DisplayName = this.AssetInfo.controls['DisplayName'].value;
  //        // this.AssetInfo.controls['DisplayName'].setValue(new Date(this.ELEMENT_DATA[i].DisplayName));
  //       }
  //     }
    // }
  }
  fileChange(event) {
     
    this.fileList = event.target.files;
    this.FileUploadValidation(this.fileList[0].name,this.fileList[0].size);
    if(this.uploadfile ==false){
      event.target.value = null;
      }
  }
  size : any;
  uploadData(element) {
     
    if (this.fileList.length > 0) {
      // var MaxContentLength = 1024 * 1024 * 2 / 1024;
      // this.size = this.fileList[0].size; 
      // if(MaxContentLength >= parseInt(this.size)){
        this.loader.open();
        let formData = new FormData();
        
        var financialyear= this.selectedItems;
        var period =element.Custome1;
        formData.append('uploadFile', this.fileList[0]);
        var filename = this.fileList[0].name;
        
        this.CompanyService.RunDescrepancywithfile(this.GroupId, this.RegionId, this.CompanyId, period , financialyear,this.fileList ).subscribe(r=>{
           
          this.loader.close();
          if(r== "Discrepancy ran successfully"){
            this.toastr.success(this.message.viewDecrepancyupload,this.message.AssetrakSays)
          }
          else if(r== "File is not in correct format.")
          {
            this.toastr.warning(this.message.FileFormatIncorrect, this.message.AssetrakSays)
          }
          else if(r== "Oops something went wrong!!")
          {
            this.toastr.warning(this.message.FileNameFormatIncorrect, this.message.AssetrakSays)
          } 
           else if(r== "Not Found")
          {
            this.toastr.success(this.message.NoDecrepanyFound, this.message.AssetrakSays)
          }
          this.ShowDecrepancydata();     
        })   
     
        
      }
    }
   
  ShowDecrepancydata(){
         
        this.loader.open();
      // const financialyear= this.selectedItems;
      this.dataSource="";
      this.data1=[];
      var financialyear= this.selectedItems;
    this.CompanyService.GetPeriodwiseDescrepancyfileList(this.GroupId, this.RegionId, this.CompanyId,financialyear).subscribe(r=>{
        
       this.loader.close();
       this.data1= JSON.parse(r);
       this.onChangeDataSourceC(JSON.parse(r));
      })
    
    // this.dataSource = new MatTableDataSource<Element>(this.data1);   
  }

  onChangeDataSourceC(value) {
     
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  doublext= /\.\w{2,3}\.\w{2,3}$/;
  fileName :any;
  uploadfile: boolean =false;
FileUploadValidation(filename,filesize) {
    debugger;
   this.fileName = filename;
   var extension = filename.substr(filename.lastIndexOf('.')); //check file type extention
   var doublextension = this.doublext.test(filename);

   for(let j = 0; j < this.fileextlist.length; j++)
   {
    if(extension.toLowerCase() === this.fileextlist[j] &&  filesize < 3000000)
      {    
      this.uploadfile =true;
      }    
  else{
    if (filesize > 3000000)
    { 
    this.uploadfile =false;
 
    this.toastr.error(this.message.filesizerestriction, this.message.AssetrakSays);
    return null;
 
   }
   if(this.fileextlist.indexOf(extension) == -1)
    {
      this.uploadfile =false;
     
      this.toastr.error(this.message.fileextensionvalidation1, this.message.AssetrakSays);
      return null;
    }
  if( !(filename.endsWith(extension)) )
  {
      this.uploadfile =false;
   
      this.toastr.error(this.message.fileextensionvalidation1, this.message.AssetrakSays);
     return null;
  }
 if( doublextension ==true )
 {
    this.uploadfile =false;
   
     this.toastr.error(this.message.fileextensionvalidation1, this.message.AssetrakSays);
    return null;
  } 
   if(filename.startsWith('.') )
   {
     this.uploadfile =false;
   
     this.toastr.error(this.message.fileextensionvalidation1, this.message.AssetrakSays);
     return null;
  }
   }
   } 
 }
}