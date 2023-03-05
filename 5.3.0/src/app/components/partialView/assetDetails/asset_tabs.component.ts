import { Component, OnInit, ViewChild, Inject, ViewEncapsulation, EventEmitter, Output, VERSION, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { FormControl } from '@angular/forms';
import { AssetService } from 'app/components/services/AssetService';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { DatePipe } from '@angular/common';
import { GroupService } from 'app/components/services/GroupService';
import { MatTableDataSource } from '@angular/material/table';

import { AllPathService } from 'app/components/services/AllPathServices';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { Constants } from 'app/components/storage/constants';
import { Subject } from 'rxjs';
import { ChildrenOutletContexts } from '@angular/router';
import { ITAMService } from 'app/components/services/ITAMService';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-asset_tabs',
  templateUrl: './asset_tabs.component.html',
  styleUrls: ['./asset_tabs.component.scss'],
})
export class assetTabsComponent implements OnInit {

  Headers: any;

  public AssetInfo: FormGroup;
  public InventoryInfo: FormGroup;
  public AllStatus: FormGroup;
  public CostForm: FormGroup;
  public Maintenance: FormGroup;
  public OtherInfo: FormGroup;
  public Download: FormGroup;
  public HardwareInfo: FormGroup;
  public selectedIndex;
  tabEnabled: boolean = false;
  geodisabled: boolean = true;
  mattab: boolean = true;
  public sampleform: FormGroup;
  displayedColumns: string[] = ['DocumentType', 'DocumentName', 'ViewDocument'];
  displayedColumnsI : string[] = ['Software','Manufacturer','Category','Type','SoftwareSuite','License Key','Allocated License'];
  datasource = new MatTableDataSource();
  layerid: any;
  Layertext: string;
  IslayerDisplay: any;
  HeaderLayerText: string;
  groupId: any;
  UserId: any;
  regionId: any;
  companyId: any;
  StandardViewData: any[] = [];

  bindData: any;
  bindData1 :any;
  ColumnValue: any[] = [];

  ListOfField: any[] = [];
  displayedColumns1: any[] = [];
  mandatoryFields: any[] = [];

  datasourceI = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<assetTabsComponent>,
    private fb: FormBuilder,
    private storage: ManagerService,
    public assetservice: AssetService,
    public loader: AppLoaderService,
    public datepipe: DatePipe,
    public groupservice: GroupService,
    public AllPath: AllPathService,
    private jwtAuth: JwtAuthService,
    public as: AssetService,
    public itamService : ITAMService) {
    this.Headers = this.jwtAuth.getHeaders();
  }
  ReportFlag :boolean = false;
  Pagename:any;
  pendingwith :any;
  ngOnInit() {
     
    this.tabEnabled = false;

    this.layerid = this.storage.get(Constants.SESSSION_STORAGE, Constants.LAYER_ID);
    this.groupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.regionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.companyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);

    this.IslayerDisplay = this.layerid;
    if (this.layerid == 1) {
      this.Layertext = "Country";
    }
    else if (this.layerid == 2) {
      this.Layertext = "State";
    }
    else if (this.layerid == 3) {
      this.Layertext = "City";
    }
    else if (this.layerid == 4) {
      this.Layertext = "Zone";
    }
    this.HeaderLayerText = this.Layertext;
    this.ReportFlag = this.data.payload.ReportFlag;
    this.ListOfField = this.data.payload.ListOfField;
    this.bindData = this.data.payload.element;
    this.Pagename = this.data.payload.Pagename;
    if( this.Pagename == "Transfer Approval" || this.Pagename =="Retirement Approval"){
    // this.bindData= [ 'PendingWith'].concat(this.bindData);
    this.bindData =this.data.payload.element;
  //   for(var i=0;i<this.bindData.PendingForApproval.length;i++){
  //     if(this.pendingwith != undefined ){
  //     this.pendingwith = this.pendingwith +","+this.bindData.PendingForApproval[i] ;
  //     }
  //     else{
  //       this.pendingwith = this.bindData.PendingForApproval[i];	
  //     }
  //     // console.log(this.pendingwith);
      
  //  // this.pendingwith =this.bindData.PendingForApproval[1];
  //   }
  //   this.bindData.PendingWith =  this.pendingwith;
    }
    if(this.Pagename == "Asset Allocation"){
     if(this.data.payload.element.allocatedStatus == null || this.data.payload.element.allocatedStatus == "" || this.data.payload.element.allocatedStatus == "Stores" )
      {
        this.data.payload.element.allocatedStatus = "Stores" ;
      } 
      
    }
    if(this.data.payload.element.allocatedStatus == "0"){
      this.data.payload.element.allocatedStatus = "Allocated-Unconfirmed"
    }
    else if(this.data.payload.element.allocatedStatus == "1"){
      this.data.payload.element.allocatedStatus= "Allocated-Confirmed"
    }
    else if(this.data.payload.element.allocatedStatus == "2"){
      this.data.payload.element.allocatedStatus= "Allocated-Declined"
    }
    else if(this.data.payload.element.allocatedStatus == "3"){
      this.data.payload.element.allocatedStatus = "Uploaded"
    }
    else if(this.data.payload.element.allocatedStatus == "5"){
      this.data.payload.element.allocatedStatus = "Employee Not Available"
    }
    else if(this.data.payload.element.allocatedStatus != "" || this.data.payload.element.allocatedStatus != null || this.data.payload.element.allocatedStatus != "Stores" ){
      this.data.payload.element.allocatedStatus =  this.data.payload.element.allocatedStatus
    }
 
    // else if(!!this.data.payload.element.allocatedStatus && !this.data.payload.element.UserName)
    // {
    //   this.data.payload.element.allocatedStatus = ""
    // }
   
    this.GetCustomViewData();
    

  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.nextStep(tabChangeEvent.index);
    this.previousStep(tabChangeEvent.index);
  }

  nextStep(i) {
    this.selectedIndex = i;
  }
  previousStep(i) {
    this.selectedIndex = i;
  }

  CategoryViewTable = [];
  StandardTypeData: any[];
  FieldData: any[] = [];
  InstalledSoftwaresFlag : boolean = false;
  GetCustomViewData() {
     
    this.StandardViewData = this.ListOfField;
    if (!!this.StandardViewData && this.StandardViewData.length > 0) {
      var viewNames = this.StandardViewData.filter(x => x).map(choice => choice.ViewName);   
      let uniqueViewNames = viewNames.filter((item, i, ar) => ar.indexOf(item) === i);   
       
      //====== Add condition for hardware discovery report
      if(this.Pagename == "Hardware Discovery Report"){
        var idx = uniqueViewNames.indexOf('InstalledSoftwareView');
        if(idx > -1){
          uniqueViewNames.splice(idx , 1);
        }
        
        this.getpcsoftwaredetails();
        this.InstalledSoftwaresFlag = true;
      } 
      //==============      
      if (!!uniqueViewNames && uniqueViewNames.length > 0) {
        uniqueViewNames.forEach(val => {
          var viewsData = {
            ViewName: val,
            FieldData: this.StandardViewData.filter(x => x.ViewName == val).map(choice => choice.Custom1)
          }
          this.CategoryViewTable.push(viewsData);
        })
      }
    }
    this.tabEnabled = true;
  }


  getpcsoftwaredetails() {
     
   var data = {
    NetworkScanId : !!this.bindData.NetworkScanId ? this.bindData.NetworkScanId : "",
    pageSize : 50,
    pageNo : 1
   }
   this.itamService.getpcsoftwaredetails(data).subscribe(r => {
      
     var result = r;
     console.log(result);
     this.onChangeDataSourceI(result);

   })
 }

 onChangeDataSourceI(value) {
  //value  = [{'Workstation':'desktop-9pdea2e','Version':'','User':'','License Key':'','Product ID':'','Allocated License':'','Installed On':''}];
  this.datasourceI = new MatTableDataSource(value);
  this.datasourceI.sort = this.sort;
  this.datasourceI.paginator = this.paginator;
} 

  GetAssetData(PreFarId) {
    this.assetservice.GetAssetDetailsWithGroupJson(PreFarId).subscribe(r => {
      this.loader.close();
      this.tabEnabled = true;
      this.bindData = JSON.parse(r);
      console.log(this.bindData);
      this.buildItemForm(this.bindData);
    })
  }
  GetMandatoryByFlag(flag) {
    this.groupservice.GetMandatoryByFlag(flag).subscribe((response) => {
      this.ListOfField = response;
      this.displayedColumns1 = this.ListOfField.filter(x => x.FAR == true).map(choice => choice.FieldsName);
      console.log(this.displayedColumns1);
    });
  }
  buildItemForm(item) {
    var PreperchasedList = JSON.parse(item.PreperchasedList);
    var clientcustomData = JSON.parse(item.clientcustomData);
    this.FieldData.forEach(element => {
      if (element.Custom1 == item) {
        //this.sampleform.push(element.Custom1)
      }
    }),


      this.AssetInfo = this.fb.group({



        AssetNo: [{ value: item.AssetId, disabled: true }],
        SubNo: [{ value: item.SubAssetId, disabled: true }],
        AssetClass: [{ value: item.ADL1, disabled: true }],
        AssetCategory: [{ value: item.CategoryName, disabled: true }],
        AssetType: [{ value: item.TypeOfAsset, disabled: true }],
        AssetSubType: [{ value: item.subTypeOfAsset, disabled: true }],
        AssetName: [{ value: item.ADL2, disabled: true }],
        AssetDescription: [{ value: item.ADL3, disabled: true }],
        AllocationType: [{ value: item.AllocationType, disabled: true }],
        UserType: [{ value: item.UserType, disabled: true }],
        User: [{ value: item.UserDetails, disabled: true }],
        Custodian: [{ value: item.CustodianDetails, disabled: true }],
        RevertDate: [{ value: item.RevertDate, disabled: true }],
        CapitalizationDate: [{ value: item.AcquisitionDate, disabled: true }],
        Qty: [{ value: item.Quantity, disabled: true }],
        SBU: [{ value: item.SBU, disabled: true }],
        Plant: [{ value: item.Location, disabled: true }],
        UOM: [{ value: item.Unit, disabled: true }],
        VendorName: [{ value: item.Suplier, disabled: true }],
        PONo: [{ value: item.PONumber, disabled: true }],
        InvoiceNo: [{ value: item.InvoiceNo, disabled: true }],
        AssetrakStage: [{ value: item.Stage, disabled: true }],
        GeoCity: [{ value: item.GPS_Location, disabled: true }],
        GeoLocation: [{ value: item.GPS_CoOrdinate, disabled: false }],
        GpsDate: [{ value: item.GPS_Date, disabled: true }],
        UsefulLife: [{ value: item.UsefulLife, disabled: true }],
        AssetExpiryDate: [{ value: item.expiryDate, disabled: true }],
        AssetCondition: [{ value: item.AssetCondition, disabled: true }],
        AssetCricality: [{ value: item.AssetCriticality, disabled: true }],
        GRNNo: [{ value: item.GRNNo, disabled: true }],
        EquipmentNumber: [{ value: item.equipmentNo, disabled: true }],
      })
    this.InventoryInfo = this.fb.group({
      InventoryNo: [{ value: item.Barcode, disabled: true }],
      SerialNo: [{ value: item.SerialNo, disabled: true }],
      Room: [{ value: item.Room, disabled: true }],
      SubLocation: [{ value: item.Rack, disabled: true }],
      CostCenter: [{ value: item.Building, disabled: true }],
      ITSerialNo: [{ value: item.ITSerialNo, disabled: true }],
      InventoryIndicator: [{ value: item.Taggable, disabled: true }],
      LabelSize: [{ value: item.LabelSize, disabled: true }],
      LabelMaterial: [{ value: item.LabelMaterial, disabled: true }],
      InventoryBy: [{ value: item.LastVerifiedBy, disabled: true }],
      InventoryOn: [{ value: item.LastVerifiedOn, disabled: true }],
      InventoryMode: [{ value: item.InputMode, disabled: true }],
      InventoryNote: [{ value: item.CurrentStatus, disabled: true }],
      PreviousInventoryInfo: [{ value: item.LastRemark || '', disabled: true }],
      NotFoundNote: [{ value: item.MissingRemark, disabled: true }],
      LabelQuality: [{ value: item.LabelStatus, disabled: true }],
    })
    this.AllStatus = this.fb.group({
      AssetStatus: [{ value: item.AssetStatus, disabled: true }],
      AllocationStatus: [{ value: item.AllocationStatus, disabled: true }],
      InventoryStatus: [{ value: item.InventoryStatus, disabled: true }],
      TransferStatus: [{ value: item.TransferStatus, disabled: true }],
      RetirementStatus: [{ value: item.RetirementStatus, disabled: true }],
    })
    this.CostForm = this.fb.group({
      Cost: [{ value: item.AcquisitionCost, disabled: true }],
      WDV: [{ value: item.WDV, disabled: true }],
      DepnRunDate: [{ value: item.WDVDate, disabled: true }],
      ResidualValue: [{ value: item.ReplacementValue, disabled: true }],
    })
    this.Maintenance = this.fb.group({
      InsuranceStart: [{ value: item.InsuranceFrom, disabled: true }],
      InsuranceEnd: [{ value: item.InsuranceTo, disabled: true }],
      InsuranceVendor: [{ value: item.InsuranceVendor, disabled: true }],
      AMCStart: [{ value: item.AMCStartDate, disabled: true }],
      AMCEnd: [{ value: item.AMCExpiryDate, disabled: true }],
      AMCVendor: [{ value: item.AMCVendor, disabled: true }],
      WarrantyEnd: [{ value: item.WarrantyExpiryDate, disabled: true }],
      WarrantyStartDate: [{ value: item.warrantystartdate, disabled: true }],
      WarrantyPeriod: [{ value: item.WarrantyPeriod, disabled: true }],
      WarrantyCost: [{ value: item.WarrantyCost, disabled: true }],
      WarrantyTerms: [{ value: item.WarrantyTerms, disabled: true }],
      Remarks: [{ value: item.WarrantyRemarks, disabled: true }]
    })
    this.OtherInfo = this.fb.group({
      CPPNumber: [{ value: item.CPPNumber, disabled: true }],
      AMCComment: [{ value: item.AMCComment, disabled: true }],
      Budget: [{ value: item.Budget, disabled: true }],
      GRNDate: [{ value: item.GRNDate, disabled: true }],
      Remark: [{ value: item.Remark, disabled: true }],
      AccountingStatus: [{ value: item.AccountingStatus, disabled: true }],
      Division: [{ value: item.Division, disabled: true }],
      ExpenseAccount: [{ value: item.ExpenseAccount, disabled: true }],
      CostAccount: [{ value: item.CostAccount, disabled: true }],
      ReverseAccount: [{ value: item.ReserveAccount, disabled: true }],
      Department: [{ value: item.Department, disabled: true }],
      Area: [{ value: item.Area, disabled: true }],
      Merchandise: [{ value: item.Merchandise, disabled: true }],
      InterCompany: [{ value: item.InterCompany, disabled: true }],
      ServiceProvider: [{ value: item.ServiceProvider, disabled: true }],
      AccumulatedDepreciation: [{ value: item.AccumulatedDepreciation, disabled: true }],
      Class: [{ value: item.Class, disabled: true }],
      Account_Clearing: [{ value: item.Account_Clearing, disabled: true }],
      Description: [{ value: item.Description, disabled: true }],
      Loc2: [{ value: item.Loc2, disabled: true }],
      Loc3: [{ value: item.Loc3, disabled: true }],
      Loc4: [{ value: item.Loc4, disabled: true }],
      Loc5: [{ value: item.Loc5, disabled: true }],
      Adjustment_Amount: [{ value: (clientcustomData.length != 0 ? clientcustomData.Adjustment_Amount : ""), disabled: true }],
      Deprn_Reserve: [{ value: (clientcustomData.length != 0 ? clientcustomData.Deprn_Reserve : ""), disabled: true }],
      Bonus_Deprn_Amount: [{ value: (clientcustomData.length != 0 ? clientcustomData.Bonus_Deprn_Amount : ""), disabled: true }],
      Bonus_YTD_Deprn: [{ value: (clientcustomData.length != 0 ? clientcustomData.Bonus_YTD_Deprn : ""), disabled: true }],
      YTD_Impairment: [{ value: (clientcustomData.length != 0 ? clientcustomData.YTD_Impairment : ""), disabled: true }],
      Impairment_Reserve: [{ value: (clientcustomData.length != 0 ? clientcustomData.Impairment_Reserve : ""), disabled: true }],


    })
    this.Download = this.fb.group({
      DocumentType: [''],
      FileUpload: [''],
      UploadFilter: [''],
    })
    this.HardwareInfo = this.fb.group({
      OperatingSystem: [{ value: (PreperchasedList.length != 0 ? PreperchasedList[0].OperatingSystem : ""), disabled: true }],
      CPUClass: [{ value: (PreperchasedList.length != 0 ? PreperchasedList[0].CPUClass : ""), disabled: true }],
      CPUSubClass: [{ value: (PreperchasedList.length != 0 ? PreperchasedList[0].CPUSubClass : ""), disabled: true }],
      ApplicationType: [{ value: (PreperchasedList.length != 0 ? PreperchasedList[0].ApplicationType : ""), disabled: true }],
      Model: [{ value: (PreperchasedList.length != 0 ? PreperchasedList[0].Model : ""), disabled: true }],
      Manufacturer: [{ value: (PreperchasedList.length != 0 ? PreperchasedList[0].Manufacturer : ""), disabled: true }],
      HostName: [{ value: (PreperchasedList.length != 0 ? PreperchasedList[0].HostName : ""), disabled: true }],
      HDD: [{ value: (PreperchasedList.length != 0 ? PreperchasedList[0].HDD : ""), disabled: true }],
      RAM: [{ value: (PreperchasedList.length != 0 ? PreperchasedList[0].RAM : ""), disabled: true }],
    })
    if (!!item.GPS_Location) {
      this.geodisabled = false;
    }
    else {
      this.geodisabled = true;
    }
    var cost = Number(item.AcquisitionCost).toLocaleString('en-GB');
    this.CostForm.controls['Cost'].setValue(cost);

    var wdv = Number(item.WDV).toLocaleString('en-GB');
    this.CostForm.controls['WDV'].setValue(wdv);

    var AcquisitionDate = this.datepipe.transform(item.AcquisitionDate, 'dd-MMM-yyyy');
    this.AssetInfo.controls['CapitalizationDate'].setValue(AcquisitionDate);

    var AcquisitionDate = this.datepipe.transform(item.expiryDate, 'dd-MMM-yyyy');
    this.AssetInfo.controls['AssetExpiryDate'].setValue(AcquisitionDate);

    var AcquisitionDate = this.datepipe.transform(item.InsuranceFrom, 'dd-MMM-yyyy');
    this.Maintenance.controls['InsuranceStart'].setValue(AcquisitionDate);

    var AcquisitionDate = this.datepipe.transform(item.InsuranceTo, 'dd-MMM-yyyy');
    this.Maintenance.controls['InsuranceEnd'].setValue(AcquisitionDate);

    var AcquisitionDate = this.datepipe.transform(item.AMCStartDate, 'dd-MMM-yyyy');
    this.Maintenance.controls['AMCStart'].setValue(AcquisitionDate);

    var AcquisitionDate = this.datepipe.transform(item.AMCExpiryDate, 'dd-MMM-yyyy');
    this.Maintenance.controls['AMCEnd'].setValue(AcquisitionDate);

    var AcquisitionDate = this.datepipe.transform(item.WarrantyExpiryDate, 'dd-MMM-yyyy');
    this.Maintenance.controls['WarrantyEnd'].setValue(AcquisitionDate);

    var AcquisitionDate = this.datepipe.transform(item.InstallationDate, 'dd-MMM-yyyy');
    this.Maintenance.controls['WarrantyStartDate'].setValue(AcquisitionDate);

    var AcquisitionDate = this.datepipe.transform(item.LastVerifiedOn, 'dd-MMM-yyyy');
    this.InventoryInfo.controls['InventoryOn'].setValue(AcquisitionDate);

    var AcquisitionDate = this.datepipe.transform(item.GPS_Date, 'dd-MMM-yyyy');
    this.AssetInfo.controls['GpsDate'].setValue(AcquisitionDate);

    var AcquisitionDate = this.datepipe.transform(item.WDVDate, 'dd-MMM-yyyy');
    this.CostForm.controls['DepnRunDate'].setValue(AcquisitionDate);

    if (item.AssetStatus == "Disposed") {
      this.AllStatus.controls['AllocationStatus'].setValue("Disposed");
      this.AllStatus.controls['TransferStatus'].setValue("Disposed");
      this.AllStatus.controls['RetirementStatus'].setValue("Disposed");
      this.AllStatus.controls['InventoryStatus'].setValue("Disposed");

    }
    //======== Get Document List ======

    this.groupservice.GetEditAssetUploadDocument(item.PreFarId)
      .subscribe(r => {

        const Data = JSON.parse(r);
        console.log("Document", Data);
        this.onChangeDataSource(Data)
      });
  }
  onChangeDataSource(value) {
    this.datasource = new MatTableDataSource(value);
  }
  viewpath(item) {

    var path = item.DocumentPath.split('uploads')
    this.AllPath.ViewDocument(path[1]);
  }
  onclosetab() {
    this.dialogRef.close(false);

  }
  mapLocation() {
    if (this.AssetInfo.controls['GeoLocation'].value == "") {
    } else {
      window.open('https://www.google.com/maps/search/?api=1&query=' + this.AssetInfo.controls['GeoLocation'].value);
    }
  }

  // GetAllStandardAndCustomViewData(PageId) {
  //   this.loader.open();
  //   this.groupservice.GetFieldListByPageId(PageId, this.UserId).subscribe(response => {
  //     this.StandardTypeData = JSON.parse(response);
  //     this.StandardTypeData.forEach(r => {
  //       if (r.Status == "S") {
  //         this.StandardViewData.push(r);
  //         this.CategoryViewTable = this.StandardViewData.filter(
  //           (thing, i, arr) => arr.findIndex(t => t.ViewName === thing.ViewName) === i
  //         );
  //       }
  //       else if (r.Status == "C") {
  //          
  //         this.StandardViewData.push(r);
  //         this.CategoryViewTable = this.StandardViewData.filter(
  //           (thing, i, arr) => arr.findIndex(t => t.ViewName === thing.ViewName) === i
  //         );
  //       }
  //       this.CategoryViewTable.forEach(Data => {
  //         if (Data.ViewName == r.ViewName) {
  //           this.FieldData.push(r.Custom1);
  //           this.FieldData = this.StandardViewData.filter(x => x.ViewName === "Asset Info View").map(choice => choice.Custom1);

  //         }
  //       })
  //     })
  //     this.GetAssetData(this.data.payload);
  //   });
  // }
  // GetStandardView() {
  //   this.as.Getallcategories(this.groupId).subscribe(response => {
  //     this.StandardTypeData = JSON.parse(response);
  //     this.StandardTypeData.forEach(r => {
  //       if (r.Status == "S") {
  //       }
  //     })
  //   })
  // }

}

