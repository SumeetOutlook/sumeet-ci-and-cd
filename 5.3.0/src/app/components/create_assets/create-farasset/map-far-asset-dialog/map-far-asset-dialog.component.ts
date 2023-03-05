import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { of, forkJoin } from 'rxjs';
//import { OrderPipe } from 'ngx-order-pipe';
import * as headers from '../../../../../assets/Headers.json';
import * as resource from '../../../../../assets/Resource.json';
import { AssetService } from 'app/components/services/AssetService';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { ToastrService } from 'ngx-toastr';
import { GroupService } from 'app/components/services/GroupService';
import { FormControl } from '@angular/forms';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-map-far-asset-dialog',
  templateUrl: './map-far-asset-dialog.component.html',
  styleUrls: ['./map-far-asset-dialog.component.scss']
})
export class MapFarAssetDialogComponent implements OnInit {

  header: any ;
  message: any = (resource as any).default;
  order: string;
  
  public AssetInfo: FormGroup;
  public DocumentType = "Select Document Type";
  public OperatingSystem = "Select Operating System";
  public CPUClass = "Select CPU Class";
  public CPUSubClass = "Select CPU SubClass";
  public ApplicationType = "Select Application Type";
  public Model = "Select Model";
  public Manufacturer = "Select Manufacturer";
  public filteredData; 

  CreateValidation = ["AssetClass", "AcquisitionDate", "Quantity", "AssetLocation", "AssetCondition", "WDV", "ADL2", "Unit", "AcquisitionCost"];

  columnsName: any[] = [];
  columnExcelHeaderName: any = [];
  tempColumnHeaderName: any = [];
  FileNameWithPath: any;

  UploadMappingSelectList: any[] = [];
  tempTableColumnName: any[] = [];
  tempExcelColumnName: any[] = [];
  tempCreateValidation: any[] = [];
  ValidationResult: any = '';

  public responseData1: any;
  public responseData2: any;
  allColumns: any[] = [];
  UploadMappingData: any[] = [];
  columns: any;
  uploadBy: string;

  CompanyId: any;
  LocationId: any;
  GroupId: any;
  UserId: any;

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  protected _onDestroy = new Subject<void>();
  public selectedIndex;
  displayedColumns: string[] = ['DocumentType', 'DocumentName', 'DeleteDocument'];
  datasource = new MatTableDataSource();
  public colFilterCtrl: FormControl = new FormControl();
  columnHeaders1:any;//ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  validation: any[] = ["AcquisitionDate", "TypeOfAsset", "AssetLocation", "AssetCondition", "ADL2" ,"Quantity" ,"SubTypeOfAsset","PONumber","Suplier" ,"AcquisitionCost","CPPNumber"];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MapFarAssetDialogComponent>,
    private fb: FormBuilder, public assetService: AssetService,
    private loader: AppLoaderService,public toastr: ToastrService , public GroupService : GroupService,
    //private orderPipe: OrderPipe
    private jwtAuth : JwtAuthService
  ) 
  {
    this.header = this.jwtAuth.getHeaders()
   }

  displayModule : boolean = false;
  nextStep(i) {
    this.selectedIndex = i;
    //console.log(i);
  }
  previousStep(i) {
    this.selectedIndex = i;
    console.log(i);
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.nextStep(tabChangeEvent.index);
    this.previousStep(tabChangeEvent.index);
    console.log(tabChangeEvent);
  }
  GRNvalidation: any[] = [];
  ngOnInit() {

    
    this.displayModule = false;
    this.CompanyId = this.data.data.CompanyId;
    this.LocationId = this.data.data.LocationId;
    this.GroupId = this.data.data.GroupId;
    this.UserId = this.data.data.UserId;

    this.buildItemForm();
    this.uploadBy = this.data.data.uploadBy;
    // this.validation.forEach(val => {
    //   this.GRNvalidation.push(val);
    // });   
    
    this.columnsName = [];
    this.columnExcelHeaderName = [];
    this.tempColumnHeaderName = [];
    this.columnsName = JSON.parse(this.data.data.columnsName);
    this.GetMandatoryByFlag('FAR');
    
  }

  ListOfField: any[] = [];
  GetMandatoryByFlag(flag) {
    
    this.loader.open();
    this.GroupService.GetMandatoryByFlag(flag).subscribe((response) => {
      
      this.loader.close();
      this.ListOfField = response;     
      this.GRNvalidation = this.ListOfField.filter(x => x.FarManadatory == true).map(choice => choice.FieldsName);  
      console.log(this.GRNvalidation);
      // if (this.uploadBy == "AssetId") {
      //   this.GRNvalidation.push("AssetId");
      // }
      // if (this.uploadBy == "InventoryNumber") {
      //   this.GRNvalidation.push("AssetClass");
      // }    
      // this.GRNvalidation.push(this.uploadBy);
      this.getDropdowndata();
    });
  }
  getDropdowndata() {
    
    this.loader.open();
    this.UploadMappingSelectList = [];
    this.tempTableColumnName = [];
    this.tempExcelColumnName = [];
    this.tempCreateValidation = [];
    this.ValidationResult = '';

    this.GRNvalidation.forEach((v) => {
      this.tempCreateValidation.push(v);
    })

    let promise1 = this.assetService.GetAllTableColumnData(this.GroupId, 'CreateFARAsset');
    let promise2 = this.assetService.GetMappingData("uploadFAR" , this.UserId);
    forkJoin([promise1, promise2]).subscribe(result => {
      
      this.allColumns = [];
      this.tempColumnHeaderName = [];
      this.UploadMappingData = [];

      if (!!result[0]) {
        this.allColumns = JSON.parse(result[0]);
        this.allColumns.forEach((s) => {
          s.HeaderName = this.header[s.Columnname];
        })
        this.order = 'Columnname';
        //this.tempColumnHeaderName = this.orderPipe.transform(this.allColumns, this.order);
        this.tempColumnHeaderName = this.allColumns;
        this.tempColumnHeaderName = this.tempColumnHeaderName.sort((a,b) => {
          if(a.HeaderName < b.HeaderName) { return -1; }
          if(a.HeaderName > b.HeaderName) { return 1; }
      })
      }

      if (!!result[1]) {
        this.UploadMappingData = JSON.parse(result[1]);
      }

      this.UploadMappingData.forEach((s) => {
        this.tempExcelColumnName.push(s.ExcelColumnName);
        var idx1 = this.columnsName.indexOf(s.ExcelColumnName);
        if (idx1 > -1) {
          this.tempColumnHeaderName.forEach((p) => {
            if (s.TableColumnName == p.Columnname) {
              this.tempTableColumnName.push(s.TableColumnName);
            }
          })
        }
      })

      this.tempColumnHeaderName.forEach((p) => {
        if (this.tempTableColumnName.indexOf(p.Columnname) > -1) {
          p.disabled = true;
          var idx = this.tempCreateValidation.indexOf(p.Columnname);
          if (idx > -1) {
            this.tempCreateValidation.splice(idx, 1);
          }
        }
      })

      if (this.tempCreateValidation.length > 0) {
        this.tempCreateValidation.forEach((v) => {
          this.ValidationResult = this.ValidationResult + this.header[v] + ' ,';
        })
      }

      this.columnsName.forEach((p) => {
        var model;
        model = "";
        var tmodel = "";
        var idx = this.tempExcelColumnName.indexOf(p);
        if (idx > -1) {
          if (this.UploadMappingData[idx].TableColumnName != 'Select') {
            tmodel = this.UploadMappingData[idx].TableColumnName;
          }
        }
        this.tempColumnHeaderName.forEach((t) => {
          if (tmodel == t.Columnname) {
            model = t;
          }
        })
        var val = {
          name: p,
          ColumnHeaderName: this.tempColumnHeaderName,
          model: model
        }
        this.columnExcelHeaderName.push(val);
        var row = { value: !model.Columnname ? "" : model.Columnname, name: p };
        this.UploadMappingSelectList.push(row);
      })
      this.columnHeaders1 = this.columnExcelHeaderName[0].ColumnHeaderName;
      // this.colFilterCtrl.valueChanges
      // .pipe(takeUntil(this._onDestroy))
      // .subscribe(() => {
      //   this.filterCols();
      // });
      this.loader.close();
      this.displayModule = true;
    });
  }
  dataSourceForDropdown = new MatTableDataSource<any>();
  onChange(c){
     
    // this.dataSourceForDropdown=new MatTableDataSource(c.ColumnHeaderName);
    // this.dataSourceForDropdown.filter = c.nameModel.trim().toLocaleLowerCase();
  
  }

  applyFilter(c) {
    debugger;
    let search = this.colFilterCtrl.value;
    if (!search) {
      c.ColumnHeaderName = this.columnHeaders1;
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the s
    c.ColumnHeaderName = this.columnHeaders1.filter(col => col.HeaderName.toLowerCase().indexOf(search) > -1);

  }
  GetChangeValue(c) {
    
    c.ColumnHeaderName = [];
    this.tempCreateValidation = [];
    this.ValidationResult = '';
    var modelVal = false;

    this.GRNvalidation.forEach((v) => {
      this.tempCreateValidation.push(v);
    })
    var model;
    if (c.model != null) {
      model = c.model;
      modelVal = true;
    }
    if (!!model) {
      this.tempTableColumnName.push(model.Columnname);
    }

    this.UploadMappingSelectList.forEach((s) => {
      if (s.name === c.name) {
        var idx = this.tempTableColumnName.indexOf(s.value);
        if (idx > -1) {
          this.tempTableColumnName.splice(idx, 1);
        }
        s.value = !model ? "" : model.Columnname;
      }
    })

    
    this.tempColumnHeaderName.forEach((s) => {
      if (this.tempTableColumnName.indexOf(s.Columnname) > -1) {
        s.disabled = true;
        var idx = this.tempCreateValidation.indexOf(s.Columnname);
        if (idx > -1) {
          this.tempCreateValidation.splice(idx, 1);
        }
      }
      else{
        s.disabled = false;
      }
    })

    if (this.tempCreateValidation.length > 0) {
      if (this.tempCreateValidation.length > 0) {
        this.tempCreateValidation.forEach((v) => {
          this.ValidationResult = this.ValidationResult + this.header[v] + ' ,';
        })
      }
    }
    

    c.model = !model ? "" : model;
    c.ColumnHeaderName = this.tempColumnHeaderName;
    if (modelVal == false) {
      model = null;
    }
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  buildItemForm() {
    this.AssetInfo = this.fb.group({
      AssetNo: [''],
      AssetNoFilter: [''],

      InventoryNo: [''],
      InventoryNoFilter: [''],

      AssetClass: [''],
      AssetClassFilter: [''],

      CapitalizationDate: [''],
      CapitalizationDateFilter: [''],

      Qty: [''],
      QtyFilter: [''],

      Location: [''],
      LocationFilter: [''],

      Cost: [''],
      CostFilter: [''],

      WDV: [''],
      WDVFilter: [''],

      AssetName: [''],
      AssetNameFilter: [''],

      UOM: [''],
      UOMFilter: [''],

      SubNo: [''],
      SubNoFilter: [''],

      CostCenter: [''],
      CostCenterFilter: [''],

      Room: [''],
      RoomFilter: [''],

      StorageLocation: [''],
      StorageLocationFilter: [''],

      AssetDescription: [''],
      AssetDescriptionFilter: [''],

      SerialNo: [''],
      SerialNoFilter: [''],

      UsefulLife: [''],
      UsefulLifeFilter: [''],

      CustodianEmail: [''],
      CustodianEmailFilter: [''],

      UserEmail: [''],
      UserEmailFilter: [''],

      ResidualValue: [''],
      ResidualValueFilter: [''],

      ITSerialNo: [''],
      ITSerialNoFilter: [''],

      AssetType: [''],
      AssetTypeFilter: [''],

      AssetSubType: [''],
      AssetSubTypeFilter: [''],

      PONo: [''],
      PONoFilter: [''],

      InsuranceStart: [''],
      InsuranceStartFilter: [''],

      InsuranceEnd: [''],
      InsuranceEndFilter: [''],

      InsuranceVendor: [''],
      InsuranceVendorFilter: [''],

      AMCStart: [''],
      AMCStartFilter: [''],

      AMCEnd: [''],
      AMCEndFilter: [''],

      AMCVendor: [''],
      AMCVendorFilter: [''],

      WarrantyEnd: [''],
      WarrantyEndFilter: [''],

      InstallationDate: [''],
      InstallationDateFilter: [''],

      DeactivationDate: [''],
      DeactivationDateFilter: [''],

      OperatingSystems: [''],
      OperatingSystemsFilter: [''],

      CPUClass: [''],
      CPUClassFilter: [''],

      CPUSubClass: [''],
      CPUSubClassFilter: [''],

      ApplicationType: [''],
      ApplicationTypeFilter: [''],

      Manufacturer: [''],
      ManufacturerFilter: [''],

      Condition: [''],
      ConditionFilter: [''],

      GRNNo: [''],
      GRNNoFilter: [''],

      CPPNumber: [''],
      CPPNumberFilter: [''],

      HDD: [''],
      HDDFilter: [''],

      RAM: [''],
      RAMFilter: [''],

      WarrantyCost: [''],
      WarrantyCostFilter: [''],

      WarrantyTerms: [''],
      WarrantyTermsFilter: [''],

      WarrantyRemarks: [''],
      WarrantyRemarksFilter: ['']
    })
  }  
  
  Submit() {
    this.dialogRef.close(this.UploadMappingSelectList);
  }
  protected filterCols() {
    debugger;
    if (!this.columnExcelHeaderName[0].ColumnHeaderName) {
      return;
    }
    // get the search keyword
    let search = this.colFilterCtrl.value;
    
    if (!search) {
      this.columnHeaders1 = this.columnExcelHeaderName[0].ColumnHeaderName;
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the s
    this.columnHeaders1 = this.columnExcelHeaderName[0].ColumnHeaderName.filter(col => col.HeaderName.toLowerCase().indexOf(search) > -1)
     

  }
}
