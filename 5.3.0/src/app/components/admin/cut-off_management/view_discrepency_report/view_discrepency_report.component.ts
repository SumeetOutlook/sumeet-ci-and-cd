import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { CompanyService } from 'app/components/services/CompanyService';
import { UploadService } from 'app/components/services/UploadService';
import { AllPathService } from 'app/components/services/AllPathServices';
import { Router, ActivatedRoute } from "@angular/router";
import { RetireSubmitinformationDialogComponent } from 'app/components/retirement/dialog/retire-submitinformation-dialog/retire-submitinformation-dialog.component';




interface FinancialList {
  id: string;
  name: string;
}

// interface StatusList {
//   id: number;
//   name: string;
// }

const FLIST: FinancialList[] = [
  { name: '2021-22', id: 'A' },
  // { name: '2021-22', id: 'B' },

];

// const SLIST: StatusList[] = [
//   { name: 'All', id: 0 },
//   { name: 'Asset not found in Assetcues', id: 1 },
//   { name: 'Asset not found in FAR', id: 2 },
//   { name: 'Transfer discrepancy found', id: 3 },
//   { name: 'Retirement discrepancy found', id: 4 },

// ];

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
  selector: 'app-view_discrepency_report',
  templateUrl: './view_discrepency_report.component.html',
  styleUrls: ['./view_discrepency_report.component.scss']
})
export class ViewDiscrepencyReport implements OnInit {

  header: any ;
  message: any ;

  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  @ViewChild('table', { static: true }) table: any;

  ELEMENT_DATA: PeriodicElement[] = [
    { PeriodName: 'P1', DisplayName: 'Period 1', PeriodStartDate: '01-Feb-2021', PeriodEndDate: '01-Mar-2021', FreezeStartDate: '5-Feb-2021', FreezeEndDate: '28-Feb-2021', action: '' },
    { PeriodName: 'P2', DisplayName: 'Period 2', PeriodStartDate: '02-Mar-2021', PeriodEndDate: '01-Apr-2021', FreezeStartDate: '5-Mar-2021', FreezeEndDate: '28-Mar-2021', action: '' }


  ];


  transferStatus: any[] = [];

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

  statusList: any[] = [];
  protected flist1: FinancialList[] = FLIST;
  public PeriodnameCtrl: FormControl = new FormControl();
  public PeriodnameFilterCtrl: FormControl = new FormControl();
  public filteredPeriodnameList: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public FilenameCtrl: FormControl = new FormControl();
  public FilenameFilterCtrl: FormControl = new FormControl();
  public filteredFilenameList: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  // protected slist1: StatusList[] = SLIST;
  // public StatusMultiCtrl: FormControl = new FormControl();
  // public statusFilterCtrl: FormControl = new FormControl();
  // public filteredstatusList: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  //protected slist1: StatusList[] = SLIST;
  
  public statusMultiCtrl: FormControl = new FormControl();
  public statusMultiFilterCtrl: FormControl = new FormControl();
  public filteredStatusMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  data = Object.assign(this.ELEMENT_DATA);
  Perioddata: any[] = [];
  Filenamedata: any[] = [];
  displayedHeaders = [];
  displayedColumns: string[] = ['inventoryno', 'AssetidAt', 'Assetidfar','assetstage', 'plant', 'category', 'cost',  'discrepancy','retirementfar', 'acquisition date', 'adl2', 'adl3', 'acquisition cost', 'wdv1','wdv','FileName', 'Period', 'fiscalyear', 'Discrepancy','Reason'];
  today = new Date();
  // dataSource = new MatTableDataSource<Element>(this.data);
  dataSource: any;
  selection = new SelectionModel<Element>(true, []);
  public pagename: any;
  filename: any[] = [];
  selectedfinancialyear: any[] = [];
  reason = new FormControl();
  fileList: any[];
  CompanyId: any;
  GroupId: any;
  UserId: any;
  RegionId: any;
  paginationParams: any;

  constructor(public toastr: ToastrService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService, private dialog: MatDialog,
    private fb: FormBuilder, public datepipe: DatePipe,
    public localService: LocalStoreService,
    private storage: ManagerService,
    public CompanyService: CompanyService,
    public uploadService: UploadService,
    public AllPathService: AllPathService,
    private router: Router,
    private jwtAuth: JwtAuthService
  ) {
    this.header = this.jwtAuth.getHeaders();
	  this.message = this.jwtAuth.getResources();

    this.transferStatus = [
      //{ value: "", name: this.header.All },
      { value: "Asset not found in Assetcues", name: this.header.AssetnotfoundinAssetcues },
      { value: "Asset not found in FAR", name: this.header.AssetnotfoundinFAR },
      { value: "Transfer discrepancy found", name: this.header.Transferdiscrepancyfound },
      { value: "Retirement discrepancy found", name: this.header.Retirementdiscrepancyfound },
     
    ];

    this.displayedHeaders = [this.header.ATBarCode, this.header.ATAID, this.header.FARAID, this.header.stageOfAssets, this.header.AreaFAR, this.header.ATLocation, this.header.FARLocation,  this.header.ATRetireDate,this.header.FARRetireDate,this.header.ATAcquisitionDate,this.header.ADL2,this.header.ADL3,this.header.AcquisitionCost,this.header.WDV,this.header.DiscrepancyOn, this.header.FileName, this.header.Period, this.header.FinancialYear, this.header.DiscrepancyType, this.header.DiscrepancyReason];

   }


  ngOnInit(): void {
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    // this.GetInitiatedData();
    
    this.pagename = this.localService.getItem('selectedgrp');

    const p = JSON.stringify(this.pagename);
    const p1 = JSON.parse(p);
    this.selectedItems = this.pagename.Selectedfinancialyear

    this.Getperiodlist();
    //  this.Getflilenamelist();
    this.paginationParams = {
      pageSize: 50,
      currentPageIndex: 0,
      endIndex: 0,
      startIndex: 0,
      totalCount: 0,
    }
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
  variable:any;
  searchvalue(event){
    
    this.variable=event;
    this.loader.open();
    this.ViewList = [];
    this.ShowExportbutton = true
    var IsExport = false;
    var filename = this.selectedfilename.value.FileName;
    var period = this.selectedPeriodname;
    var pageNumber = this.paginationParams.currentPageIndex + 1;
    var pageSize = this.paginationParams.pageSize;
    var status = !!this.statusMultiCtrl.value ? this.statusMultiCtrl.value.join(',') : "";
    var isSearch =true;
    var SearchText =event;

    this.CompanyService.GetDescrepancyList(this.GroupId, this.RegionId, this.CompanyId, filename, period, IsExport, pageNumber, pageSize, status,isSearch,SearchText).subscribe(r => {
      
      this.loader.close();
      this.ViewList = JSON.parse(r);
        this.paginationParams.totalCount = 0;
        if (!!this.ViewList && this.ViewList.length > 0) {
          this.paginationParams.totalCount = this.ViewList[0].AssetStage;
        }
        this.onChangeDataSource(this.ViewList);
      

    })

  }
  handlePage(pageEvent: PageEvent) {
    
    this.paginationParams.pageSize = pageEvent.pageSize;
    this.paginationParams.currentPageIndex = pageEvent.pageIndex;
    this.paginationParams.endIndex = (this.paginationParams.currentPageIndex + 1) * pageEvent.pageSize;
    this.paginationParams.startIndex = this.paginationParams.currentPageIndex * pageEvent.pageSize;
    // this.getTransferInProcessData("");
    this.ShowviewDecrepancydata();
  }

  selectedItems: any[] = [];
  ShowGobutton: boolean = false;
  ShowExportbutton: boolean = false;
  getperioddata(event) {
    
    
    this.selectedPeriodname = event.value.Custome1;
    this.Getflilenamelist(this.selectedPeriodname);
    // this.selectedPeriodname = event;
    // this.Getflilenamelist(name);
    // this.dataSource = new MatTableDataSource<Element>(this.data);
  }
  getfilenamedata(event) {
    this.ShowGobutton = true;
    this.selectedfilename = event;
  }
  protected filterperioddList() {
    if (!this.pagename.name) {
      return;
    }
    let search = this.PeriodnameFilterCtrl.value;
    if (!search) {
      this.filteredPeriodnameList.next(this.pagename.name.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredPeriodnameList.next(
      this.pagename.name.filter(x => x.name.toLowerCase().indexOf(search) > -1)
    );
  }
  filterfilenameList() {
    if (!this.pagename.name1) {
      return;
    }
    let search = this.FilenameFilterCtrl.value;
    if (!search) {
      this.filteredFilenameList.next(this.pagename.name1.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredFilenameList.next(
      this.pagename.name1.filter(x => x.name.toLowerCase().indexOf(search) > -1)
    );


  }

  TransferStatusGetdata() {
    this.statusList = [];
    this.statusMultiCtrl.setValue("");
    this.transferStatus.forEach(element => {
      this.statusList.push(element)
      this.getFilterStatus();
    });
  }


  getFilterStatus() {
    
    this.filteredStatusMulti.next(this.statusList.slice());
    this.statusMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        
        this.filterStatussMulti();
      });
  }

  protected filterStatussMulti() {
    if (!this.statusList) {
      return;
    }
    let search = this.statusMultiFilterCtrl.value;
    if (!search) {
      this.filteredStatusMulti.next(this.statusList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredStatusMulti.next(
      this.statusList.filter(x => x.name.toLowerCase().indexOf(search) > -1)
    );
  }
 
  Exportdata() {
    
    this.IsExport = true;
    this.ShowviewDecrepancydata();

  }
  fileChange(event) {
    
    this.fileList = event.target.files;

  }
  uploadData() {
    
    if (this.fileList.length > 0) {
      let formData = new FormData();
      formData.append('uploadFile', this.fileList[0]);

      this.uploadService.UploadFile(formData).subscribe(r => {
        
        if (r) {
          this.toastr.success(this.message.viewDecrepancyupload,this.message.AssetrakSays)
        }
      })
    }
  }
  selected(event) {


  }

  buildItemForm() {
    this.AssetInfo = this.fb.group({
      // PeriodEndDate: [''],
      // FreezeStartDate: [''],
      // FreezeEndDate: [''],
      // DisplayName:[''],
      PeriodnameFilterCtrl: [''],
      PeriodnameCtrl: [''],
      FilenameCtrl: [''],
      FilenameFilterCtrl: ['']

    })
  }



  // openDialogFreeze(...getValue): void {
  //   
  //   var component: any
  //   if (getValue[0] === 'upload') {
  //     //component=UploadDialogComponent
  //   }
  //   else {
  //     component = FreezedialogComponent;
  //   }
  //   const dialogRef = this.dialog.open(component, {

  //     disableClose: true,
  //     data: {
  //       component1: 'FreezedialogComponent',
  //       value: getValue[0],
  //       name: getValue[1],
  //     },
  //   });


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
  freezeEndDate: any;
  freezeStartDate: any;
  periodStartDate: any;
  periodEndDate: any;
  displayName: any;
  // openDialogPeriod(...getValue): void {
  //   
  //   var component: any
  //   if (getValue[0] === 'upload') {
  //     //component=UploadDialogComponent
  //   }
  //   else {
  //     component = PerioddialogComponent;
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
      if (element == this.ELEMENT_DATA[i].PeriodName) {
        

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
          
          this.DisplayName[i] = false;
          this.DisplayNameIcon[i] = false;
          this.ELEMENT_DATA[i].DisplayName = this.AssetInfo.controls['DisplayName'].value;
          // this.AssetInfo.controls['DisplayName'].setValue(new Date(this.ELEMENT_DATA[i].DisplayName));
        }
      }
    }
  }

  Getperiodlist() {
    
    const financialyear = this.selectedItems;
    this.CompanyService.GetPeriodListforDescrepancy(this.GroupId, this.RegionId, this.CompanyId, financialyear).subscribe(r => {
      
      this.Perioddata = JSON.parse(r);
      this.Perioddata.forEach((val) =>{
        
        if(val.Custome1 == this.pagename.name){
         
          this.AssetInfo.controls['PeriodnameCtrl'].setValue(val);
          this.selectedPeriodname=this.pagename.name;
          this.Getflilenamelist(this.selectedPeriodname);

        }})
      this.getfilterperiod();
      // this.filteredPeriodnameList.next(this.Perioddata.slice());
    })
  }
  getfilterperiod(){
    this.filteredPeriodnameList.next(this.Perioddata.slice());
    this.AssetInfo.controls['PeriodnameFilterCtrl'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterperiodMulti();
      });
  }
  filterperiodMulti(){
    if (!this.Perioddata) {
      return;
    }
    let search = this.AssetInfo.controls['PeriodnameFilterCtrl'].value;
    if (!search) {
      this.filteredPeriodnameList.next(this.Perioddata.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredPeriodnameList.next(
      this.Perioddata.filter(x => x.Custome1.toLowerCase().indexOf(search) > -1)
    );
  }
  Getflilenamelist(name) {
    
    this.Filenamedata = [];
    var Name = name;
    // const financialyear= this.selectedItems;
    var financialyear = this.selectedItems;
    this.CompanyService.GetPeriodwiseDescrepancyfileListForReport(this.GroupId, this.RegionId, this.CompanyId, financialyear, Name).subscribe(r => {
      
      this.Filenamedata = JSON.parse(r);
      this.getfilterfilename();
      // this.filteredFilenameList.next(this.Filenamedata.slice());
    })

  }
  getfilterfilename(){
    this.filteredFilenameList.next(this.Filenamedata.slice());
    this.AssetInfo.controls['FilenameFilterCtrl'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterfilenameMulti();
      });
  }
  filterfilenameMulti(){
    if (!this.Filenamedata) {
      return;
    }
    let search = this.AssetInfo.controls['FilenameFilterCtrl'].value;
    if (!search) {
      this.filteredFilenameList.next(this.Filenamedata.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredFilenameList.next(
      this.Filenamedata.filter(x => x.FileName.toLowerCase().indexOf(search) > -1)
    );
  }
  selectedfilename: any;
  selectedPeriodname: any;
  ViewList: any[] = [];
  IsExport: boolean = false;

  ShowviewDecrepancydata() {
    
    this.loader.open();
    this.ViewList = [];
    this.ShowExportbutton = true
    var IsExport = this.IsExport;
    var filename = this.selectedfilename.value.FileName;
    var period = this.selectedPeriodname;
    var pageNumber = this.paginationParams.currentPageIndex + 1;
    var pageSize = this.paginationParams.pageSize;
    var status = !!this.statusMultiCtrl.value ? this.statusMultiCtrl.value.join(',') : "";
    var isSearch =false;
    var SearchText ="";

    this.CompanyService.GetDescrepancyList(this.GroupId, this.RegionId, this.CompanyId, filename, period, IsExport, pageNumber, pageSize, status,isSearch,SearchText).subscribe(r => {
      
      this.loader.close();
      if (this.IsExport) {
        
        this.AllPathService.DownloadExportFile(r);
        console.log("URL", URL);
        this.IsExport=false;

      }
      else {
        this.ViewList = JSON.parse(r);
        this.paginationParams.totalCount = 0;
        if (!!this.ViewList && this.ViewList.length > 0) {
          this.paginationParams.totalCount = this.ViewList[0].AssetStage;
        }
        this.onChangeDataSource(this.ViewList);
      }

    })
  }

  onChangeDataSource(value) {
    
    this.dataSource = new MatTableDataSource(value);
    // this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // applyFilter(filterValue: string) {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }
  //   CompanyService.svc/UpdateDiscrepacyReasons(ActivityDto activityDto)
  // POST method
  // Payload:

  // {
  // 	"ActivityId": "1",
  // 	"ActivityName": "Vinayak Chavan"
  // }
  ResonId
  Resonmethod(element) {
    
    var activityDto = {
      ActivityId: element.ExcelMasterID,
      ActivityName: element.SelfCertMissingFile,
    }
    this.CompanyService.UpdateDiscrepacyReasons(activityDto).subscribe(r => {


    })
  }

  openAddRole() {
    
    this.router.navigateByUrl('h9/m');
  }
  Fullpath:any;
  ExportFAR(){
    
    var filename=this.selectedfilename.value.FileName;
     this.CompanyService.GetFileExportReturnFilePath( filename,this.CompanyId);
   
    }
    ExportAssetragister(){
     
     var filename=this.selectedfilename.value.FileName;
      this.CompanyService.ExportFilename(this.GroupId, this.RegionId, this.CompanyId, filename).subscribe(r=>{
          
          this.AllPathService.DownloadExportFile(r);
          if(r=="data not found")
          {
            this.toastr.warning("Data is not Available ", this.message.AssetrakSays)
          }
          else{
            this.AllPathService.DownloadExportFile(r);
          }
          // this.message.ErrorexportFARfile
          
      })
    }
}
