import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ReconciliationService } from '../../../services/ReconciliationService';
import { CompanyRackService } from '../../../services/CompanyRackService';
import { AssetService } from '../../../services/AssetService';
import { CompanyLocationService } from '../../../services/CompanyLocationService';
import { DatePipe } from '@angular/common';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import * as header from '../../../../../assets/Headers.json';
import * as resource from '../../../../../assets/Resource.json';
import { ToastrService } from 'ngx-toastr';
import { ITAssetsService } from 'app/components/services/ITAssetsService';
@Component({
  selector: 'app-component-spilt-dialog',
  templateUrl: './component-spilt-dialog.component.html',
  styleUrls: ['./component-spilt-dialog.component.scss']
})
export class ComponentSpiltDialogComponent implements OnInit {
  Headers: any = (header as any).default;
  message: any = (resource as any).default;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('table', { static: false }) table: any;
  displayedColumns: string[] = ['Inventory No.', 'Asset No.', 'Sub No.', 'Asset Class', 'Asset Name', 'Asset Description', 'Serial No', 'IT Serial No', 'Plant', 'Cost', 'WDV', 'Inventory Indicator', 'AssetCondition', 'AssetCriticality']

  dataSource: any;
  dataSource1: any;
  json: any;
  bindData: any[] = [];
  dialogForm: FormGroup;
  selection = new SelectionModel<any>(true, []);

  result: any[] = [];




  CompanyId: any;
  LocationId: any;
  UserId: any;
  GroupId: any;
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
    public toastr: ToastrService,) { }
  get f() { return this.dialogForm.controls; };

  ngOnInit() {
    debugger;

    //this.loader.open();
    this.CompanyId = this.data.configdata.CompanyId;
    this.LocationId = this.data.configdata.LocationId;
    this.UserId = this.data.configdata.UserId;
    this.GroupId = this.data.configdata.GroupId;

    this.bindData = [this.data.configdata.selected[0]];
    this.onChangeDataSource(this.bindData);
    //this.loadAssetSubTypes();
    //this.typeOfAsset();  
    this.GetAllAssetTypeData(this.data.configdata.selected[0].AssetCategoryId)

  }

  onChangeDataSource(value) {
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  assetSubTypes: any[] = [];
  assettype: any[] = [];
  loadAssetSubTypes() {
    this.as.getSubAssets(this.CompanyId).subscribe((response) => {
      this.assetSubTypes = JSON.parse(response);
    });
  }

  typeOfAsset() {
    this.as.typeOfAsset(this.CompanyId).subscribe(response => {
      this.assettype = JSON.parse(response);
    });
  }
  btncomponents: boolean = true;
  ChnageQtySts: boolean = true;
  Quantitys: any = 0;
  AcquisitionCosts: any = 0;
  list1: any[] = [];
  bindlist1: any[] = [];
  displayedColumns1: string[] = ['ADL2', 'ADL3', 'TAId', 'STAId', 'SerialNo', 'ITSerialNo', 'Quantity', 'AcquisitionCost', 'WDV', 'Split', 'Action1']
  AssertList() {
    this.btncomponents = true;
    if (this.list1.length > 0) {
      var a = {
        PreFarId: this.list1.length,
        MergeId: !this.bindData[0].PreFarId ? 0 : this.bindData[0].PreFarId,
        IsQtySplit: false,
        Unit: this.bindData[0].Unit,
        AssetId: this.bindData[0].AssetId,
        SubAssetId: this.bindData[0].SubAssetId,
        TAId: !this.bindData[0].TypeOfAssets ? 0 : this.bindData[0].TypeOfAssets,
        STAId: !this.bindData[0].subTypeOfAssets ? 0 : this.bindData[0].subTypeOfAssets,
        ADL2: this.bindData[0].ADL2,
        ADL3: this.bindData[0].ADL3,
        SerialNo: "",
        ITSerialNo: "",
        Quantity: 1,
        AcquisitionCost: "0",
        WDV: "0",
        IsDisbaledForScrutiny: true
      }
      //this.list1.unshift(a);
      this.list1.push(a);
    }
    else {
      var c = {
        PreFarId: 0,
        MergeId: !this.bindData[0].PreFarId ? 0 : this.bindData[0].PreFarId,
        IsQtySplit: false,
        Unit: this.bindData[0].Unit,
        AssetId: this.bindData[0].AssetId,
        SubAssetId: this.bindData[0].SubAssetId,
        TAId: !this.bindData[0].TypeOfAssets ? 0 : this.bindData[0].TypeOfAssets,
        STAId: !this.bindData[0].subTypeOfAssets ? 0 : this.bindData[0].subTypeOfAssets,
        ADL2: this.bindData[0].ADL2,
        ADL3: this.bindData[0].ADL3,
        SerialNo: "",
        ITSerialNo: "",
        Quantity: parseInt(this.bindData[0].Quantity),
        AcquisitionCost: this.bindData[0].AcquisitionCost,
        WDV: this.bindData[0].WDV,
        IsDisbaledForScrutiny: true
      }
      this.list1.push(c);
      var b = {
        PreFarId: this.list1.length,
        MergeId: !this.bindData[0].PreFarId ? 0 : this.bindData[0].PreFarId,
        IsQtySplit: false,
        Unit: this.bindData[0].Unit,
        AssetId: this.bindData[0].AssetId,
        SubAssetId: this.bindData[0].SubAssetId,
        TAId: !this.bindData[0].TypeOfAssets ? 0 : this.bindData[0].TypeOfAssets,
        STAId: !this.bindData[0].subTypeOfAssets ? 0 : this.bindData[0].subTypeOfAssets,
        ADL2: this.bindData[0].ADL2,
        ADL3: this.bindData[0].ADL3,
        SerialNo: "",
        ITSerialNo: "",
        Quantity: 1,
        AcquisitionCost: "0",
        WDV: "0",
        IsDisbaledForScrutiny: true
      }
      this.list1.push(b);
    }

    this.Quantitys = 0;
    this.AcquisitionCosts = 0;
    for (var i = 0; i < this.list1.length; i++) {
      this.Quantitys = this.Quantitys + parseInt(this.list1[i].Quantity);
      this.AcquisitionCosts = this.AcquisitionCosts + parseFloat(this.list1[i].AcquisitionCost);
    }
    debugger;
    // this.bindlist1 = this.list1 ;
    //this.list1.sort((a, b) => parseFloat(b.PreFarId) - parseFloat(a.PreFarId));
    this.dataSource1 = new MatTableDataSource(this.list1);
  }
 sum = 0;
  OnchangeQty(b) {
    debugger;
    if ((!isNaN(parseFloat(b.Quantity)) && isFinite(b.Quantity)) === true) {
      this.btncomponents = false;
      this.Quantitys = 0;
      b.checked = false;
     // var sum = 0;
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
            this.sum = this.sum + parseFloat(this.list1[i].AcquisitionCost);
          }
        }
        else {
          this.btncomponents = true;
        } 
      }
 
      if ((parseFloat(this.bindData[0].AcquisitionCost) - parseFloat(this.sum.toString())) > 0) {
        this.list1[0].AcquisitionCost = parseFloat(this.bindData[0].AcquisitionCost) - parseFloat(this.sum.toString());
        this.list1[0].WDV = parseFloat(this.list1[0].AcquisitionCost) * parseFloat(Percentage);
        b.WDV = parseFloat(b.AcquisitionCost) * parseFloat(Percentage);
      } else {
        b.AcquisitionCost = 0;
        b.WDV = 0;
        this.btncomponents = true;
      //  this.toastr.warning(this.message.SplitedCostCannotExceedOriginalCost, this.message.AssetrakSays);
        return false;
      }
      if (parseFloat(this.list1[0].AcquisitionCost) <= 0) {
        this.btncomponents = true;
      //  this.toastr.warning(this.message.SplitedCostCannotExceedOriginalCost, this.message.AssetrakSays);
        return false;
      }
    }
    else {
      this.btncomponents = true;
      //this.toastr.warning(this.message.QuantityMoreThan1, this.message.AssetrakSays);
      return false;
    }
  }

  remove(s) {
    debugger;
    this.btncomponents = false;
    var idx = this.list1.indexOf(s);
    if (idx > -1) {
      this.list1.splice(idx, 1);
      this.dataSource1 = new MatTableDataSource(this.list1);
    }
    this.Quantitys = 0;
    var sum = 0;
    var Percentage;   

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

    this.list1[0].AcquisitionCost = parseFloat(this.bindData[0].AcquisitionCost) - parseFloat(sum.toString());
    this.list1[0].WDV = parseFloat(this.list1[0].AcquisitionCost) * parseFloat(Percentage);
    if (parseFloat(this.list1[0].AcquisitionCost) <= 0) {
      this.btncomponents = true;
    //  this.toastr.warning(this.message.SplitedCostCannotExceedOriginalCost, this.message.AssetrakSays);
      return false;
    }

  }

  change(b) {
    debugger;
    if ((!isNaN(parseFloat(b.AcquisitionCost)) && isFinite(b.AcquisitionCost)) === true) {
      this.btncomponents = false;
      this.Quantitys = 0;
      b.checked = false;
      var sum = 0;
      var Percentage;
      if (b.AcquisitionCost === undefined || b.AcquisitionCost === "0" || b.AcquisitionCost === "") {
        b.AcquisitionCost = "0";
        this.btncomponents = true;
        debugger;
       // this.toastr.warning(this.message.AcquisitionCostMoreThan1, this.message.AssetrakSays);

      }
      else if (b.Quantity === undefined || b.Quantity === 0 || b.Quantity < 1) {
        b.Quantity = 0;
        b.AcquisitionCost = "0";
        this.btncomponents = true;

        if (this.ChnageQtySts != true) {
       //   this.toastr.warning(this.message.QuantityMoreThan1, this.message.AssetrakSays);

        }

      }
      else {
        if (parseFloat(b.AcquisitionCost) <= 0) {
          b.AcquisitionCost = "0";
          this.btncomponents = true;
         // this.toastr.warning(this.message.AcquisitionCostMoreThan1, this.message.AssetrakSays);

        }
        else { b.AcquisitionCost = parseFloat(b.AcquisitionCost).toFixed(3); }
      }
      this.ChnageQtySts = false;
      debugger;
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
      if(this.sum == b.AcquisitionCost)
      {
        this.allowcreate =true;
      }
      debugger;

      if ((parseFloat(this.bindData[0].AcquisitionCost) - parseFloat(sum.toString())) > 0) {
        this.list1[0].AcquisitionCost = parseFloat(this.bindData[0].AcquisitionCost) - parseFloat(sum.toString());
        this.list1[0].WDV = parseFloat(this.list1[0].AcquisitionCost) * parseFloat(Percentage);
        b.WDV = parseFloat(b.AcquisitionCost) * parseFloat(Percentage);
      } else {
        b.AcquisitionCost = 0;
        b.WDV = 0;
        this.btncomponents = true;
     //   this.toastr.warning(this.message.SplitedCostCannotExceedOriginalCost, this.message.AssetrakSays);

        return false;
      }

      if (parseFloat(this.list1[0].AcquisitionCost) <= 0) {
        this.btncomponents = true;
       // this.toastr.warning(this.message.SplitedCostCannotExceedOriginalCost, this.message.AssetrakSays);

        return false;
      }
    }
    else {
      this.btncomponents = true;
      if (b.Quantity === undefined || b.Quantity === 0 || b.Quantity < 1) {
      //  this.toastr.warning(this.message.QuantityMoreThan1, this.message.AssetrakSays);


        return false;

      } else {
        if (this.validateAcquisitionCost(b.AcquisitionCost)) {
        //  this.toastr.warning(this.message.AcquisitionCostValidation, this.message.AssetrakSays);

          return false;

        } else {
         // this.toastr.warning(this.message.AcquisitionCostValidation1, this.message.AssetrakSays);

          b.AcquisitionCost = "";
          return false;

        }
      }

    }
  }
  SplitAssertList(b) {
    debugger;
    if (b.Quantity != undefined && b.Quantity != 0 && b.Quantity > 1 && b.AcquisitionCost != "0" && b.AcquisitionCost != "") {
      var AcquisitionCosts;
      var Percentage;
      var WDV;
      Percentage = parseFloat(this.bindData[0].WDV) / parseFloat(this.bindData[0].AcquisitionCost);
      this.btncomponents = false;
      AcquisitionCosts = parseFloat(b.AcquisitionCost) / parseInt(b.Quantity);
      WDV = parseFloat(AcquisitionCosts) * parseFloat(Percentage);;

      for (var k = 1; k < parseInt(b.Quantity); k++) {
        var a = {
          PreFarId: this.list1.length,
          MergeId: !b.MergeId ? 0 : b.MergeId,
          IsQtySplit: false,
          Unit: b.Unit,
          AssetId: b.AssetId,
          SubAssetId: b.SubAssetId,
          TAId: !b.TAId ? 0 : b.TAId,
          STAId: !b.STAId ? 0 : b.STAId,
          ADL2: b.ADL2,
          ADL3: b.ADL3,
          SerialNo: "",
          ITSerialNo: "",
          Quantity: 1,
          AcquisitionCost: parseFloat(AcquisitionCosts).toFixed(3),
          WDV: parseFloat(WDV).toFixed(3),
          IsDisbaledForScrutiny: true
        }
        this.list1.push(a);
        this.dataSource1 = new MatTableDataSource(this.list1);
      }
      b.Quantity = 1;
      b.AcquisitionCost = parseFloat(AcquisitionCosts).toFixed(3);
      b.WDV = parseFloat(WDV).toFixed(3);
      this.Quantitys = 0;
      var sum = 0;
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
        this.list1[0].WDV = parseFloat(this.list1[0].AcquisitionCost) * parseFloat(Percentage);
      } else {
        this.btncomponents = true;
        //this.toastr.warning(this.message.SplitedCostCannotExceedOriginalCost, this.message.AssetrakSays);
      }

      if (parseFloat(this.list1[0].AcquisitionCost) <= 0) {
        this.btncomponents = true;
      //  this.toastr.warning(this.message.SplitedCostCannotExceedOriginalCost, this.message.AssetrakSays);
      }
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
  validateAcquisitionCost(AcquisitionCost) {
    debugger;
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

allowcreate:boolean =false;
  Submit() {
    debugger;
    var sum =0;
    var Percentage;   
    Percentage = parseFloat(this.bindData[0].WDV) / parseFloat(this.bindData[0].AcquisitionCost);
    this.list1[0].AcquisitionCost = parseFloat(this.bindData[0].AcquisitionCost) - parseFloat(sum.toString());
    this.list1[0].WDV = parseFloat(this.list1[0].AcquisitionCost) * parseFloat(Percentage);
    if (parseFloat(this.list1[0].AcquisitionCost) <= 0) {
      this.btncomponents = true;
      this.toastr.warning(this.message.SplitedCostCannotExceedOriginalCost, this.message.AssetrakSays);
      return false;
    }
     if( this.allowcreate == true){
    var SplitList = {
      farDetailsList: this.list1,
      modifiedBy: this.UserId
    }
    this.dialogRef.close(SplitList);
  }else
  {
    this.toastr.warning(this.message.AcquisitionCostValidation1, this.message.AssetrakSays);
  }
  }
  allAssetTypeData: any;
  allSubtypeData: any;
  assetCategory: any = []
  GetAllAssetTypeData(CatId) {
    debugger;
    var companyData = {
      BlockName: CatId,
      CompanyId: this.CompanyId
    }
    this.ITassetservice.GetTypeByBlockJSON(companyData)
      .subscribe(response => {
        debugger;
        this.allAssetTypeData = [];
        this.allSubtypeData = [];
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
        debugger
        this.allSubtypeData = response;
        element.allSubtypeData = this.allSubtypeData;
      })
  }


}