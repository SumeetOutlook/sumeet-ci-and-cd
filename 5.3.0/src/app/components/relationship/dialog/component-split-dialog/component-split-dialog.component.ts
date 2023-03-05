import { Component, OnInit, Inject, ViewEncapsulation, ViewChild , OnDestroy  } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatPaginator , PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ReconciliationService } from '../../../services/ReconciliationService';
import { CompanyRackService } from '../../../services/CompanyRackService';
import { AssetService } from '../../../services/AssetService';
import { GroupService } from '../../../services/GroupService';
import { CompanyLocationService } from '../../../services/CompanyLocationService';
import { CompanyBlockService } from '../../../services/CompanyBlockService';
import { DatePipe } from '@angular/common';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { ToastrService } from 'ngx-toastr';
import { ITAssetsService } from 'app/components/services/ITAssetsService';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { CostCenterService } from 'app/components/services/CostCenterService';
import { ApplicationTypeService } from 'app/components/services/ApplicationTypeService';
import { ModelService } from 'app/components/services/ModelService';
import { OperatingSystemService } from 'app/components/services/OperatingSystemService';
import { CpuClassService } from 'app/components/services/CpuClassService';
import { CpuSubClassService } from 'app/components/services/CpuSubClassService';
import { CompanyService } from 'app/components/services/CompanyService';
import { ManufacturerService } from 'app/components/services/ManufacturerService';
import { UserService } from '../../../services/UserService';

@Component({
  selector: 'app-component-split-dialog',
  templateUrl: './component-split-dialog.component.html',
  styleUrls: ['./component-split-dialog.component.scss']
})
export class ComponentSplitDialogComponent implements OnInit ,OnDestroy {

  Headers: any = [];
  message: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table', { static: false }) table: any;
  displayedColumns: string[] = ['Inventory No.', 'Asset No.', 'Sub No.', 'Asset Class', 'Asset Name', 'Asset Description', 'Serial No', 'IT Serial No', 'Plant', 'Cost', 'WDV', 'Inventory Indicator', 'AssetCondition', 'AssetCriticality']
  displayedColumns1: any[] = ['Action1', 'Split', 'Quantity', 'AcquisitionCost', 'WDV'];
  dataSource: any;
  dataSource1: any;
  json: any;
  bindData: any[] = [];
  dialogForm: FormGroup;
  selection = new SelectionModel<any>(true, []);

  result: any[] = [];
  today = new Date();

  CompanyId: any;
  LocationId: any;
  UserId: any;
  GroupId: any;
  RegionId: any;
  layerid: any;
  sbufilter: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    public rs: ReconciliationService,
    private fb: FormBuilder,
    public crs: CompanyRackService,
    public cls: CompanyLocationService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private loader: AppLoaderService,
    public as: AssetService,
    public ITassetservice: ITAssetsService,
    public toastr: ToastrService,
    public gs: GroupService,
    public ccs: CostCenterService,
    public ats: ApplicationTypeService,
    public ms: ModelService,
    public oss: OperatingSystemService,
    public CpuClassService: CpuClassService,
    public CpuSubClassService: CpuSubClassService,
    public cs: CompanyService,
    public ManufacturerService: ManufacturerService,
    public cbs: CompanyBlockService ,
    public us : UserService,
    private jwtAuth: JwtAuthService,
    ){
       this.Headers = this.jwtAuth.getHeaders();
       this.message = this.jwtAuth.getResources();
    }
  get f() { return this.dialogForm.controls; };
  ngOnInit() {
     

    //this.loader.open();
    this.CompanyId = this.data.configdata.CompanyId;
    this.LocationId = this.data.configdata.selected[0].LocationId;
    this.UserId = this.data.configdata.UserId;
    this.GroupId = this.data.configdata.GroupId;
    this.RegionId = this.data.configdata.RegionId;

    this.bindData = [this.data.configdata.selected[0]];
    this.onChangeDataSource(this.bindData);
    //this.loadAssetSubTypes();
    //this.typeOfAsset();  
    var TAId = !!this.data.configdata.selected[0].TAId ? this.data.configdata.selected[0].TAId : 0;
    this.onCategoryChange(TAId, "")
    this.GetAllAssetTypeData(this.data.configdata.selected[0].AssetCategoryId);
    
    var AssetId = this.data.configdata.selected[0].AssetId;
    if (AssetId.startsWith('GRN')) {
      this.GetMandatoryByFlag('GRN');
    }
    else if (AssetId.startsWith('NFAR')) {
      this.GetMandatoryByFlag('NFAR');
    }
    else {
      this.GetMandatoryByFlag('FAR');
    }

    this.GetAssetData(this.data.configdata.selected[0].PreFarId);
    
    this.GetHardwaredata();
    this.GetEmpEmailList();

  }
  bindData1: any;
  bindData2: any[] = [];
  PreperchasedList : any;
  GetAssetData(PreFarId) {  
    this.loader.open();  
    this.as.GetAssetDetailsWithGroupJson_component(PreFarId).subscribe(r => {     
      this.loader.close();  
      
      this.bindData1 = JSON.parse(r);
      if(!!this.bindData1 && !!this.bindData1.PreperchasedList){
        this.PreperchasedList = JSON.parse(this.bindData1.PreperchasedList);
        if(!!this.PreperchasedList && this.PreperchasedList.length > 0){
          this.bindData1.OperatingSystem = this.PreperchasedList[0].OperatingSystem;
          this.bindData1.CPUClass = this.PreperchasedList[0].CPUClass;
          this.bindData1.CPUSubClass = this.PreperchasedList[0].CPUSubClass;
          this.bindData1.ApplicationType = this.PreperchasedList[0].ApplicationType;
          this.bindData1.Model = this.PreperchasedList[0].Model;
          this.bindData1.Manufacturer = this.PreperchasedList[0].Manufacturer;
          this.bindData1.HostName = this.PreperchasedList[0].HostName;
          this.bindData1.HDD = this.PreperchasedList[0].HDD;
          this.bindData1.RAM = this.PreperchasedList[0].RAM;
        }
        this.bindData1.Building = !!this.bindData1.Building ? this.bindData1.Building.toLowerCase() : "";
      }
      this.bindData2 = [this.bindData1];
      this.GetCategoryAndLocationList();
    })
  }

  onChangeDataSource(value) {
    this.dataSource = new MatTableDataSource(value);
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
  }
  ListOfField: any[] = [];
  displayedMandatoryField: any[] = [];
  GetMandatoryByFlag(flag) {
     
    this.gs.GetMandatoryByFlag(flag).subscribe((response) => {
       
      this.ListOfField = response;
      this.displayedMandatoryField = ["Quantity", "AcquisitionCost"];
      this.ListOfField.forEach(val => {
        if (val.FarManadatory == true && val.Editable == true && val.FieldsName != 'Quantity' && val.FieldsName != 'AcquisitionCost' && val.FieldsName != 'WDV' && val.FieldsName != 'Rack' && val.FieldsName != 'OperatingSystem' && val.FieldsName != 'CPUClass' && val.FieldsName != 'CPUSubClass' && val.FieldsName != 'ApplicationType' && val.FieldsName != 'Model' && val.FieldsName != 'Suplier' && val.FieldsName != 'HostName' && val.FieldsName != 'HDD' && val.FieldsName != 'RAM' && val.FieldsName != 'UserEmailId' && val.FieldsName != 'UserDetails') {
          this.displayedColumns1.push(val.FieldsName);
          this.displayedMandatoryField.push(val.FieldsName);
        }
      })
      this.ListOfField.forEach(val => {
        if (val.FarManadatory != true && val.Editable == true && val.FieldsName != 'Quantity' && val.FieldsName != 'AcquisitionCost' && val.FieldsName != 'WDV'  && val.FieldsName != 'Rack' && val.FieldsName != 'OperatingSystem' && val.FieldsName != 'CPUClass' && val.FieldsName != 'CPUSubClass' && val.FieldsName != 'ApplicationType' && val.FieldsName != 'Model' && val.FieldsName != 'Suplier' && val.FieldsName != 'HostName' && val.FieldsName != 'HDD' && val.FieldsName != 'RAM' && val.FieldsName != 'UserEmailId' && val.FieldsName != 'UserDetails') {
          this.displayedColumns1.push(val.FieldsName);
        }
      })
      console.log(this.displayedColumns1);
      //this.displayedColumns1 = this.ListOfField;
      //this.displayedColumns1 = this.displayedColumns1.filter(x => x.FarManadatory == true && x.Editable == true).map(choice => choice.FieldsName);
    });
  }

  AllCategoryList: any[] = [];
  LocationList: any[] = [];
  AssetCriticalityData: any[] = [];
  CostCenterData: any[] = [];
  GetCategoryAndLocationList() {
     
    this.loader.open();
    let url1 = this.cls.GetLocationListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 19);
    let url2 = this.cbs.GetCategoryListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 19);
    let url3 = this.crs.GetMappedRackListWithRackName(this.CompanyId);
    let url4 = this.gs.BlocksOfAssetsGetByCompanyId(this.CompanyId);
    let url5 = this.gs.GetAllUOMData();
    let url6 = this.as.GetAllSupplierListData(this.CompanyId, this.GroupId);
    let url7 = this.as.GetAssetConditionList();
    let url8 = this.as.GetAssetCriticalityList();
    let url9 = this.ccs.GetAllCostsCenterList(this.CompanyId, this.GroupId);

    forkJoin([url1, url2, url3, url4, url5, url6, url7 , url8, url9]).subscribe(results => {
       
      this.loader.close();
      if (!!results[0]) {
        this.LocationList = JSON.parse(results[0]);
      }
      if (!!results[1]) {
        this.AllCategoryList = JSON.parse(results[1]);
      }
      if (!!results[2]) {
        this.allMappedRackList = results[2];
        this.bindSubLocation(this.LocationId);
      }
      if (!!results[3]) {
        this.AssetClassData = results[3];
      }
      if (!!results[4]) {
        this.UOMData = JSON.parse(results[4]);
      }
      if (!!results[5]) {
        this.allSupplierData = JSON.parse(results[5]);
      }
      if (!!results[6]) {
        this.AssetConditionData = JSON.parse(results[6]);
      }
      if (!!results[7]) {
        this.AssetCriticalityData = JSON.parse(results[7]);
      }
      if (!!results[8]) {
        
        this.CostCenterData = JSON.parse(results[8]);
      }
    })
  }
  allMappedRackList: any[] = [];
  allMappedRackListData: any[] = [];

  bindSubLocation(LocationId) {
     
    this.allMappedRackListData = [];
    this.allMappedRackList.forEach(val => {
      if (val.LocationID == LocationId) {
        this.allMappedRackListData.push(val);
      }
    })
  }
  AssetClassData: any[] = [];
  CategoryList: any[] = [];
  assetSubTypes: any[] = [];
  assettype: any[] = [];
  UOMData: any[] = [];
  allSupplierData: any[] = [];
  AssetConditionData: any[] = [];
  OsData: any[] = [];
  CPUClassData: any[] = [];
  CPUSubClassData: any[] = [];
  ApplicationTypeData: any[] = [];
  ModelData: any[] = [];
  ManufacturerData: any[] = [];


  GetHardwaredata() {
     
    // let url1 = this.oss.GetAllOperatingSystemList(this.CompanyId, this.GroupId);
    // let url2 = this.CpuClassService.GetAllCPUClassList(this.CompanyId, this.GroupId);
    // let url3 = this.CpuSubClassService.GetAllCPUSubClassList(this.CompanyId, this.GroupId);
    // let url4 = this.ats.GetAllApplicationTypeList(this.CompanyId, this.GroupId);
    // let url5 = this.ms.GetAllModelList(this.CompanyId, this.GroupId);
    let url6 = this.ManufacturerService.GetAllManufactureList(this.CompanyId, this.GroupId);

    forkJoin([url6]).subscribe(results => {
       
      // if (!!results[0]) {
      //   this.OsData = JSON.parse(results[0]);
      // }
      // if (!!results[1]) {
      //   this.CPUClassData = JSON.parse(results[1]);
      // }
      // if (!!results[2]) {
      //   this.CPUSubClassData = JSON.parse(results[2]);
      // }
      // if (!!results[3]) {
      //   this.ApplicationTypeData = JSON.parse(results[3]);
      // }
      // if (!!results[4]) {
      //   this.ModelData = JSON.parse(results[4]);
      // }
      if (!!results[0]) {
        this.ManufacturerData = JSON.parse(results[0]);
      }
    })
  }

  btncomponents: boolean = true;
  ChnageQtySts: boolean = true;
  Quantitys: any = 0;
  AcquisitionCosts: any = 0;
  list1: any[] = [];
  bindlist1: any[] = [];
  //displayedColumns1: string[] = ['ADL2', 'ADL3', 'TAId', 'STAId', 'SerialNo', 'ITSerialNo', 'Quantity', 'AcquisitionCost', 'WDV', 'Split', 'Action1']
  AssertList() {
     if(this.bindData1.Flag == "3"){
      this.btncomponents = false;
     }
     else{
      this.btncomponents = true;
     }
   
    var AssetCondition = "";
    if (!!this.bindData1.AssetCondition) {
      AssetCondition = this.bindData1.AssetCondition.split("|")[0];
      AssetCondition = AssetCondition.trim();
    }

    if (this.list1.length > 0) {
      // var a = {
      //   PreFarId: this.list1.length,
      //   MergeId: !this.bindData[0].PreFarId ? 0 : this.bindData[0].PreFarId,
      //   IsQtySplit: false,
      //   Unit: this.bindData[0].Unit,
      //   AssetId: this.bindData[0].AssetId,
      //   SubAssetId: this.bindData[0].SubAssetId,
      //   TAId: !this.bindData[0].TypeOfAssets ? 0 : this.bindData[0].TypeOfAssets,
      //   STAId: !this.bindData[0].subTypeOfAssets ? 0 : this.bindData[0].subTypeOfAssets,
      //   ADL2: this.bindData[0].ADL2,
      //   ADL3: this.bindData[0].ADL3,
      //   SerialNo: "",
      //   ITSerialNo: "",
      //   Quantity: 1,
      //   AcquisitionCost: "0",
      //   WDV: "0",
      //   IsDisbaledForScrutiny: true
      // }
      let item1 = {};
      for (var i = 0; i < this.displayedColumns1.length; i++) {
        if (this.displayedColumns1[i] != 'Action1' && this.displayedColumns1[i] != 'Split') {
          item1[this.displayedColumns1[i]] = this.bindData2[0][this.displayedColumns1[i]];
        }
      }
      item1["PreFarId"] = this.list1.length;
      item1["MergeId"] = !this.bindData1.PreFarId ? 0 : this.bindData1.PreFarId;
      item1["IsQtySplit"] = false;
      item1["Unit"] = this.bindData1.Unit;
      item1["AssetId"] = this.bindData1.AssetId;
      item1["SubAssetId"] = this.bindData1.SubAssetId;
      item1["TAId"] = this.bindData1.TAId;
      item1["STAId"] = this.bindData1.STAId;
      item1["ADL2"] = this.bindData1.ADL2;
      item1["ADL3"] = this.bindData1.ADL3;
      item1["SerialNo"] = "";
      item1["ITSerialNo"] = "";
      item1["Quantity"] = 1;
      item1["AcquisitionCost"] = "0";
      item1["WDV"] = "0";
      item1["IsDisbaledForScrutiny"] = true;
      item1["AssetCondition"] = AssetCondition;
      item1["allSubtypeData"] = this.allSubtypeData;
      item1["PONumber"] = this.bindData1.PONumber;
      item1["SplitFlag"] = false;
      item1["Flag"]  =this.bindData1.Flag;
      
      this.list1.push(item1);

    }
    else {

      //let item = this.bindData2.map(x => Object.assign({}, x));     
      // item[0].PreFarId = 0;
      // item[0].MergeId = !this.bindData1.PreFarId ? 0 : this.bindData1.PreFarId;     

      let item = {};
      for (var i = 0; i < this.displayedColumns1.length; i++) {
        if (this.displayedColumns1[i] != 'Action1' && this.displayedColumns1[i] != 'Split') {
          item[this.displayedColumns1[i]] = this.bindData2[0][this.displayedColumns1[i]];
        }
      }
      item["allSubtypeData"] = this.allSubtypeData;
      item["PreFarId"] = 0;
      item["MergeId"] = !this.bindData1.PreFarId ? 0 : this.bindData1.PreFarId;
      item["IsQtySplit"] = false;
      item["Unit"] = this.bindData1.Unit;
      item["AssetId"] = this.bindData1.AssetId;
      item["SubAssetId"] = this.bindData1.SubAssetId;
      item["TAId"] = this.bindData1.TAId;
      item["STAId"] = this.bindData1.STAId;
      item["ADL2"] = this.bindData1.ADL2;
      item["ADL3"] = this.bindData1.ADL3;
      item["SerialNo"] = this.bindData1.SerialNo;
      item["ITSerialNo"] = this.bindData1.ITSerialNo;
      item["Quantity"] = parseInt(this.bindData1.Quantity);
      item["AcquisitionCost"] =  parseFloat(this.bindData1.AcquisitionCost).toFixed(2) ;
      item["WDV"] = parseFloat(this.bindData1.WDV).toFixed(2) ;
      item["IsDisbaledForScrutiny"] = true;
      item["AssetCondition"] = AssetCondition;
      item["PONumber"] = this.bindData1.PONumber;
      item["SplitFlag"] = false;
      item["Flag"]  =this.bindData1.Flag;
      

      this.list1.push(item);

      //let item1 = this.bindData2.map(x => Object.assign({}, x));
      let item1 = {};
      for (var i = 0; i < this.displayedColumns1.length; i++) {
        if (this.displayedColumns1[i] != 'Action1' && this.displayedColumns1[i] != 'Split') {
          item1[this.displayedColumns1[i]] = this.bindData2[0][this.displayedColumns1[i]];
        }
      }
      item1["allSubtypeData"] = this.allSubtypeData;
      item1["PreFarId"] = this.list1.length;
      item1["MergeId"] = !this.bindData1.PreFarId ? 0 : this.bindData1.PreFarId;
      item1["IsQtySplit"] = false;
      item1["Unit"] = this.bindData1.Unit;
      item1["AssetId"] = this.bindData1.AssetId;
      item1["SubAssetId"] = this.bindData1.SubAssetId;
      item1["TAId"] = this.bindData1.TAId;
      item1["STAId"] = this.bindData1.STAId;
      item1["ADL2"] = this.bindData1.ADL2;
      item1["ADL3"] = this.bindData1.ADL3;
      item1["SerialNo"] = "";
      item1["ITSerialNo"] = "";
      item1["Quantity"] = 1;
      item1["AcquisitionCost"] = "0";
      item1["WDV"] = "0";
      item1["IsDisbaledForScrutiny"] = true;
      item1["AssetCondition"] = AssetCondition;
      item1["PONumber"] = this.bindData1.PONumber;
      item1["SplitFlag"] = false;
      item1["Flag"]  =this.bindData1.Flag;
      
      this.list1.push(item1);

    }
    
    this.Quantitys = 0;
    this.AcquisitionCosts = 0;
    for (var i = 0; i < this.list1.length; i++) {
      this.Quantitys = this.Quantitys + parseInt(this.list1[i].Quantity);
      this.AcquisitionCosts = this.AcquisitionCosts + parseFloat(this.list1[i].AcquisitionCost);
    }
     
    // this.bindlist1 = this.list1 ;
    //this.list1.sort((a, b) => parseFloat(b.PreFarId) - parseFloat(a.PreFarId));
    var bindDataSource = this.list1.slice(this.startIndex , this.endIndex);
    this.dataSource1 = new MatTableDataSource(bindDataSource);
    this.dataSource1.paginator = this.paginator;
    //this.dataSource1.sort = this.sort;
    this.resultsLength = this.list1.length;
    
  }

  ngOnDestroy() {    
    //this.dataSource1 = new MatTableDataSource([]);
    this.list1 = [];
    if (!!this.dataSource1) {
      this.dataSource1.disconnect(this);
    }
  }

  OnchangeQty(b) {
     debugger;
     if (b.Flag == 3 && parseFloat(b.AcquisitionCost) == 0) {
      this.btncomponents = false;
   
    }
    else{
    if ((!isNaN(parseFloat(b.Quantity)) && isFinite(b.Quantity)) === true) {
      this.btncomponents = false;
      this.Quantitys = 0;
      b.checked = false;
      var sum = 0;
      var Percentage
      if (b.Quantity.toString().length > 13) {
        //QuantityValidation1
        b.Quantity = 0;
        b.AcquisitionCost = "0";
        this.btncomponents = true;
        this.ChnageQtySts = true;
        this.toastr.warning(this.message.QuantityValidation1, this.message.AssetrakSays);
        return false;

      }
      else if (b.Quantity === undefined || b.Quantity === 0 || b.Quantity < 1) {
        b.Quantity = 0;
        b.AcquisitionCost = "0";
        this.btncomponents = true;
        this.ChnageQtySts = true;
        this.toastr.warning(this.message.QuantityMoreThan1, this.message.AssetrakSays);

        return false;
      }

      Percentage = parseFloat(this.bindData[0].WDV) / parseFloat(this.bindData[0].AcquisitionCost);
      for (var i = 0; i < this.list1.length; i++) {
        this.Quantitys = this.Quantitys + parseInt(this.list1[i].Quantity);
        if (this.list1[i].AcquisitionCost != "0" && this.list1[i].AcquisitionCost != "") {
          if (parseFloat(this.list1[i].AcquisitionCost) <= 0) {
            this.btncomponents = true;
          }
          if (i > 0) {
            sum = sum + parseFloat(this.list1[i].AcquisitionCost);
          }
        }
        else {
          this.btncomponents = true;
        }
      }


      if ((parseFloat(this.bindData[0].AcquisitionCost) - parseFloat(sum.toString())) > 0) {
        this.list1[0].AcquisitionCost = parseFloat(this.bindData[0].AcquisitionCost) - parseFloat(sum.toString());
        this.list1[0].AcquisitionCost = parseFloat(this.list1[0].AcquisitionCost).toFixed(2);

        this.list1[0].WDV = parseFloat(this.list1[0].AcquisitionCost) * parseFloat(Percentage);
        this.list1[0].WDV = parseFloat(this.list1[0].WDV).toFixed(2);

        b.WDV = parseFloat(b.AcquisitionCost) * parseFloat(Percentage);
        b.WDV = parseFloat(b.WDV).toFixed(2);
      } else {
        b.AcquisitionCost = 0;
        b.WDV = 0;
        this.btncomponents = true;
        this.toastr.warning(this.message.SplitedCostCannotExceedOriginalCost, this.message.AssetrakSays);
        return false;
      }
      if (parseFloat(this.list1[0].AcquisitionCost) <= 0) {
        this.btncomponents = true;
        this.toastr.warning(this.message.SplitedCostCannotExceedOriginalCost, this.message.AssetrakSays);
        return false;
      }
    }
    else {
      this.btncomponents = true;
      this.toastr.warning(this.message.QuantityMoreThan1, this.message.AssetrakSays);
      return false;
    }
  }
  }

  remove(s) {
     debugger;
    //this.btncomponents = true;
    if(s.Flag == "3" ){
      var idx = this.list1.indexOf(s);
      this.btncomponents = false;
      if (idx > -1) {
        this.list1.splice(idx, 1);
        var bindDataSource = this.list1.slice(this.startIndex , this.endIndex);
        this.dataSource1 = new MatTableDataSource(bindDataSource);
        this.dataSource1.paginator = this.paginator;
        this.resultsLength = this.list1.length;
        //this.dataSource1 = new MatTableDataSource(this.list1);
      }
    }
      else{
        var idx = this.list1.indexOf(s);
        if (idx > -1) {
          this.list1.splice(idx, 1);
          var bindDataSource = this.list1.slice(this.startIndex , this.endIndex);
          this.dataSource1 = new MatTableDataSource(bindDataSource);
          this.dataSource1.paginator = this.paginator;
          this.resultsLength = this.list1.length;
          //this.dataSource1 = new MatTableDataSource(this.list1);
        }
      }
  
    // var idx = this.list1.indexOf(s);
    // if (idx > -1) {
    //   this.list1.splice(idx, 1);
    //   var bindDataSource = this.list1.slice(this.startIndex , this.endIndex);
    //   this.dataSource1 = new MatTableDataSource(bindDataSource);
    //   this.dataSource1.paginator = this.paginator;
    //   this.resultsLength = this.list1.length;
    //   //this.dataSource1 = new MatTableDataSource(this.list1);
    // }
    this.Quantitys = 0;
    var sum = 0;
    var Percentage;

    Percentage = parseFloat(this.bindData[0].WDV) / parseFloat(this.bindData[0].AcquisitionCost);
    for (var i = 0; i < this.list1.length; i++) {
      this.Quantitys = this.Quantitys + parseInt(this.list1[i].Quantity);
      if(this.list1[i].Flag == "3" ){
        // this.btncomponents = false;
      }
    else{
      if (this.list1[i].AcquisitionCost != "0" && this.list1[i].AcquisitionCost != "") {
        if (parseFloat(this.list1[i].AcquisitionCost) <= 0) {
          this.btncomponents = true;
        }
      }
    }
    if (i > 0) {
      sum = sum + parseFloat(this.list1[i].AcquisitionCost);
    
  }
    else {
    this.btncomponents = true;
  }
     }  
 
   

    this.list1[0].AcquisitionCost = parseFloat(this.bindData[0].AcquisitionCost) - parseFloat(sum.toString());
    this.list1[0].AcquisitionCost = parseFloat(this.list1[0].AcquisitionCost).toFixed(2);

    this.list1[0].WDV = parseFloat(this.list1[0].AcquisitionCost) * parseFloat(Percentage);
    this.list1[0].WDV = parseFloat(this.list1[0].WDV).toFixed(2);
    if (this.list1[0].Flag == 3 && parseFloat(this.list1[0].AcquisitionCost) == 0) {
      this.btncomponents = false;
    }
   else if (parseFloat(this.list1[0].AcquisitionCost) <= 0) {
      this.btncomponents = true;
      this.toastr.warning(this.message.SplitedCostCannotExceedOriginalCost, this.message.AssetrakSays);
      return false;
    }

  }

  change(b) {
     debugger;
     if (b.Flag == 3 && parseFloat(b.AcquisitionCost) == 0) {
      this.btncomponents = false;
   
    }
    else{
     
    if ((!isNaN(parseFloat(b.AcquisitionCost)) && isFinite(b.AcquisitionCost)) === true) {
      this.btncomponents = false;
      this.Quantitys = 0;
      b.checked = false;
      var sum = 0;
      var Percentage;
      if (b.AcquisitionCost === undefined || b.AcquisitionCost === "0" || b.AcquisitionCost === "") {
        b.AcquisitionCost = "0";
        this.btncomponents = true;
         
        this.toastr.warning(this.message.AcquisitionCostMoreThan1, this.message.AssetrakSays);

      }
      else if (b.Quantity === undefined || b.Quantity === 0 || b.Quantity < 1) {
        b.Quantity = 0;
        b.AcquisitionCost = "0";
        this.btncomponents = true;

        if (this.ChnageQtySts != true) {
          this.toastr.warning(this.message.QuantityMoreThan1, this.message.AssetrakSays);

        }

      }
      else {
        if (parseFloat(b.AcquisitionCost) <= 0) {
          b.AcquisitionCost = "0";
          this.btncomponents = true;
          this.toastr.warning(this.message.AcquisitionCostMoreThan1, this.message.AssetrakSays);

        }
        else { b.AcquisitionCost = parseFloat(b.AcquisitionCost).toFixed(3); }
      }
      this.ChnageQtySts = false;

      Percentage = parseFloat(this.bindData[0].WDV) / parseFloat(this.bindData[0].AcquisitionCost);
      for (var i = 0; i < this.list1.length; i++) {
        this.Quantitys = this.Quantitys + parseInt(this.list1[i].Quantity);
        if (this.list1[i].AcquisitionCost != "0" && this.list1[i].AcquisitionCost != "") {
          if (parseFloat(this.list1[i].AcquisitionCost) <= 0) {
            this.btncomponents = true;
          }
          if (i > 0) {
            sum = sum + parseFloat(this.list1[i].AcquisitionCost);
          }
        }
        else {
          this.btncomponents = true;
        }
      }
       

      if ((parseFloat(this.bindData[0].AcquisitionCost) - parseFloat(sum.toString())) > 0) {
        this.list1[0].AcquisitionCost = parseFloat(this.bindData[0].AcquisitionCost) - parseFloat(sum.toString());
        this.list1[0].AcquisitionCost = parseFloat(this.list1[0].AcquisitionCost).toFixed(2);

        this.list1[0].WDV = parseFloat(this.list1[0].AcquisitionCost) * parseFloat(Percentage);
        this.list1[0].WDV = parseFloat(this.list1[0].WDV).toFixed(2);

        b.WDV = parseFloat(b.AcquisitionCost) * parseFloat(Percentage);
        b.WDV = parseFloat(b.WDV).toFixed(2);

      } else {
        b.AcquisitionCost = 0;
        b.WDV = 0;
        this.btncomponents = true;
        this.toastr.warning(this.message.SplitedCostCannotExceedOriginalCost, this.message.AssetrakSays);
        return false;
      }

      if (parseFloat(this.list1[0].AcquisitionCost) <= 0) {
        this.btncomponents = true;
        this.toastr.warning(this.message.SplitedCostCannotExceedOriginalCost, this.message.AssetrakSays);
        return false;
      }
    }
    else {
      this.btncomponents = true;
      if (b.Quantity === undefined || b.Quantity === 0 || b.Quantity < 1) {
        this.toastr.warning(this.message.QuantityMoreThan1, this.message.AssetrakSays);
        return false;

      } else {
        if (this.validateAcquisitionCost(b.AcquisitionCost)) {
          this.toastr.warning(this.message.AcquisitionCostValidation, this.message.AssetrakSays);
          return false;

        } else {
          this.toastr.warning(this.message.InvalidCost, this.message.AssetrakSays); //this.message.AcquisitionCostValidation1
          b.AcquisitionCost = "";
          return false;

        }
      }

    }
  }
  }

  resultsLength = 0;
  SplitAssertList(b) {          
    
    if (b.Quantity != undefined && b.Quantity != 0 && b.Quantity > 1 && b.AcquisitionCost != "0" && b.AcquisitionCost != "") {  
      var AcquisitionCosts;
      var Percentage;
      var WDV;
      Percentage = parseFloat(this.bindData[0].WDV) / parseFloat(this.bindData[0].AcquisitionCost);
      this.btncomponents = false;
      AcquisitionCosts = parseFloat(b.AcquisitionCost) / parseInt(b.Quantity);
      WDV = parseFloat(AcquisitionCosts) * parseFloat(Percentage);

      for (var k = 1; k < parseInt(b.Quantity); k++) {
        // var a = {
        //   PreFarId: this.list1.length,
        //   MergeId: !b.MergeId ? 0 : b.MergeId,
        //   IsQtySplit: false,
        //   Unit: b.Unit,
        //   AssetId: b.AssetId,
        //   SubAssetId: b.SubAssetId,
        //   TAId: !b.TAId ? 0 : b.TAId,  
        //   STAId: !b.STAId ? 0 : b.STAId,
        //   ADL2: b.ADL2,
        //   ADL3: b.ADL3,
        //   SerialNo: "",
        //   ITSerialNo: "",
        //   Quantity: 1,
        //   AcquisitionCost: parseFloat(AcquisitionCosts).toFixed(3),
        //   WDV: parseFloat(WDV).toFixed(3),
        //   IsDisbaledForScrutiny: true
        // }

        let item1 = {};
        for (var i = 0; i < this.displayedColumns1.length; i++) {
          if (this.displayedColumns1[i] != 'Action1' && this.displayedColumns1[i] != 'Split') {
            item1[this.displayedColumns1[i]] = this.bindData2[0][this.displayedColumns1[i]];
          }
        }
        item1["allSubtypeData"] = this.allSubtypeData;
        item1["PreFarId"] = this.list1.length;
        item1["MergeId"] = !b.MergeId ? 0 : b.MergeId;
        item1["IsQtySplit"] = false;
        item1["Unit"] = b.Unit;
        item1["AssetId"] = b.AssetId;
        item1["SubAssetId"] = b.SubAssetId;
        item1["TAId"] = !b.TAId ? 0 : b.TAId;
        item1["STAId"] = !b.STAId ? 0 : b.STAId;
        item1["ADL2"] = b.ADL2;
        item1["ADL3"] = b.ADL3;
        item1["SerialNo"] = "";
        item1["ITSerialNo"] = "";
        item1["Quantity"] = 1;
        item1["AcquisitionCost"] = parseFloat(AcquisitionCosts).toFixed(2);
        item1["WDV"] = parseFloat(WDV).toFixed(2);
        item1["IsDisbaledForScrutiny"] = true;
        item1["AssetCondition"] = b.AssetCondition;
        item1["PONumber"] = b.PONumber;
        item1["SplitFlag"] = true;
        
        this.list1.push(item1);        
      }
      
            
      b.Quantity = 1;
      b.AcquisitionCost = parseFloat(AcquisitionCosts).toFixed(3);
      b.WDV = parseFloat(WDV).toFixed(3);
      this.Quantitys = 0;
      var sum = 0;
      for (var i = 0; i < this.list1.length; i++) {
        this.Quantitys = this.Quantitys + parseInt(this.list1[i].Quantity);
        if(this.list1[i].Flag == "3" && this.list1[i].AcquisitionCost <= "0")
        {
          this.btncomponents =false;
        }
        else{
        if (this.list1[i].AcquisitionCost != "0" && this.list1[i].AcquisitionCost != "") {
          if (parseFloat(this.list1[i].AcquisitionCost) <= 0) {
            this.btncomponents = true;
          }
          if (i > 0) {
            sum = sum + parseFloat(this.list1[i].AcquisitionCost);
          }
        }
        else {
          this.btncomponents = true;
        }
      }
      }      
      
      if ((parseFloat(this.bindData[0].AcquisitionCost) - parseFloat(sum.toString())) > 0) {
        this.list1[0].AcquisitionCost = parseFloat(this.bindData[0].AcquisitionCost) - parseFloat(sum.toString());
        this.list1[0].AcquisitionCost = parseFloat(this.list1[0].AcquisitionCost).toFixed(2);

        this.list1[0].WDV = parseFloat(this.list1[0].AcquisitionCost) * parseFloat(Percentage);
        this.list1[0].WDV = parseFloat(this.list1[0].WDV).toFixed(2);

      } 
      else if(this.bindData[0].Flag == "3" && this.bindData[0].AcquisitionCost <= 0){
        this.btncomponents =false;
      }
      else {
        this.btncomponents = true;
        this.toastr.warning(this.message.SplitedCostCannotExceedOriginalCost, this.message.AssetrakSays);
        return false;
      }

      if (parseFloat(this.list1[0].AcquisitionCost) <= 0  && this.list1[0].Flag != "3") {
        this.btncomponents = true;
        this.toastr.warning(this.message.SplitedCostCannotExceedOriginalCost, this.message.AssetrakSays);
        return false;
      }

      var bindDataSource = this.list1.slice(this.startIndex , this.endIndex);
      this.dataSource1 = new MatTableDataSource(bindDataSource);
      this.dataSource1.paginator = this.paginator;
      //this.dataSource1.sort = this.sort;
      this.resultsLength = this.list1.length;
    }
    else {
      if (b.Quantity === undefined || b.Quantity === 0 || b.Quantity <= 1) {
        this.toastr.warning(this.message.QuantityMoreThan1, this.message.AssetrakSays);
      }
      if (b.AcquisitionCost === undefined || b.AcquisitionCost === "0" || b.AcquisitionCost === "") {
        this.toastr.warning(this.message.AcquisitionCostMoreThan1, this.message.AssetrakSays);
      }
    }
    b.checked = false;
  }
  
  startIndex = 0;
  endIndex = 50;
  handlePage(pageEvent: PageEvent) {

    this.endIndex = (pageEvent.pageIndex + 1) * pageEvent.pageSize;
    this.startIndex = pageEvent.pageIndex * pageEvent.pageSize;

    var bindDataSource = this.list1.slice(this.startIndex , this.endIndex);
    this.dataSource1 = new MatTableDataSource(bindDataSource);
  }
  validateAcquisitionCost(AcquisitionCost) {
     
    var re = /^\d{0,13}(\.\d{1,3})?$/;
    return re.test(AcquisitionCost);
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  allAssetTypeData: any;
  allSubtypeData: any;
  assetCategory: any = []
  GetAllAssetTypeData(CatId) {
     
    var companyData = {
      BlockName: CatId,
      CompanyId: this.CompanyId
    }
    this.ITassetservice.GetTypeByBlockJSON(companyData)
      .subscribe(response => {
         
        this.allAssetTypeData = [];
        //this.allSubtypeData = [];
        this.allAssetTypeData = response;
        // this.allAssetTypeData.forEach(val=>{
        //   this.assetCategory.push(val.TypeOfAsset);
        // })
        // this.getFilterAssetSubtype();
      })
  }

  onCategoryChange(cate, element) {
    this.ITassetservice.GetAllSubtypeData(cate, this.CompanyId)
      .subscribe(response => {
         
        this.allSubtypeData = response;
        if (!!element) {
          element.allSubtypeData = this.allSubtypeData;
        }
      })
  }

  empList: any[] = [];
  empListForCustodian: any[] = [];
  filteredOptions: Observable<string[]>;
  filteredOptionsForCust: Observable<string[]>;
  GetEmpEmailList() {
    var userEmailId = "";
    this.us.GetEmpEmailForAutoComplete(userEmailId, this.GroupId)
      .subscribe(res => {
         
        if (!res || res === "" || res === null) {
          this.empList = [];
        } else {
          this.empList = res;
          console.log("empList", this.empList);
          this.empListForCustodian = res;
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

  Submit() {
    debugger;
    var flag = 0;
    this.list1.forEach(val => {
      val.typeOfAsset = val.TAId;
      val.subTypeOfAsset = val.STAId;
      val.AcquisitionDate =  !val.AcquisitionDate ? null : this.JsonDate(val.AcquisitionDate);
      val.WDVDate = !val.WDVDate ? null : this.JsonDate(val.WDVDate);
      val.GRNDate = !val.GRNDate ? null : this.JsonDate(val.GRNDate);
      val.InstallationDate = !val.InstallationDate ? null : this.JsonDate(val.InstallationDate);
      val.WarrantyExpiryDate = !val.WarrantyExpiryDate ? null : this.JsonDate(val.WarrantyExpiryDate);
      val.AMCExpiryDate = !val.AMCExpiryDate ? null : this.JsonDate(val.AMCExpiryDate);
      val.AMCStartDate = !val.AMCStartDate ? null : this.JsonDate(val.AMCStartDate);
      ///val.AmortizationStartDate =!val.AmortizationStartDate ? null : this.JsonDate(val.AmortizationStartDate);
      val.InsuranceFrom =!val.InsuranceFrom ? null : this.JsonDate(val.InsuranceFrom);
      val.InsuranceTo = !val.InsuranceTo ? null : this.JsonDate(val.InsuranceTo);
      if (val.Flag == 3 && parseFloat(val.AcquisitionCost) == 0) {
        flag = 0;
      }
      else{
      for(var i=0; i < this.displayedMandatoryField.length ;i++){         
        if(!val[this.displayedMandatoryField[i]]){
          flag = 1;
          break;
        }
      }  
    }
    val.expiryDate =  !val.expiryDate ? null : this.JsonDate(val.expiryDate);
    });
  

    if(flag == 1){
      this.toastr.warning(this.message.Mandatory, this.message.AssetrakSays);
      return false;
    }
    
    var SplitList = {
      farDetailsList: this.list1,
      modifiedBy: parseInt(this.UserId)
    }
    this.loader.open();
    this.as.splitComponent(SplitList).subscribe(response => {      
      this.loader.close();
      if (!!response) {
        this.toastr.warning("", this.message.AssetrakSays);
      }
      else {
        this.toastr.success(this.message.ComponentSplitSucess, this.message.AssetrakSays);
        this.dialogRef.close(true)
      }
      //this.toastr.success(this.message.ComponentSplitSucess, this.message.AssetrakSays);
      //this.dialogRef.close(true);
    });
  }


}
