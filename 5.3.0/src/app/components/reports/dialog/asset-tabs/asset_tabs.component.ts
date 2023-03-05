import { Component, OnInit,Inject,ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {MatTabChangeEvent} from '@angular/material/tabs';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';

interface SelectData {
  name: string;
  id:string;
}

@Component({
  selector: 'app-asset_tabs',
  templateUrl: './asset_tabs.component.html',
  styleUrls: ['./asset_tabs.component.scss'],
})
export class assetTabsComponent implements OnInit {
  public Tabledata=[
    {
       "DocumentName":"4_9_2020_59_CompanyLocationTemplate (2).xlsx",
       "DocumentType":"Retired Document",
       "ViewDocument":"View"
    },
    {
      "DocumentName":"4_9_2020_59_Screenshot_2020-08-04-13-37-41-92_9348e1b846c37f82b8cdf37cf3ed6f72.jpg",
      "DocumentType":"Retired Photo",
      "ViewDocument":"View"
   }
];
  
@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
@ViewChild(MatSort) sort: MatSort;
public dataSource;


  public OperatingSystemData: SelectData[]=[
    {name:'Windows',id:'1'},
    {name:'Mac',id:'2'},
  ];

  public CPUClassData: SelectData[]=[
    {name:'1|model1',id:'1'},
  ];

  public CPUSubClassData: SelectData[]=[
  ];

  public ApplicationTypeData: SelectData[]=[
  ];

  public ModelData: SelectData[]=[
  ];

  public ManufacturerData: SelectData[]=[
  ];

  public AssetInfo: FormGroup;
  public InventoryInfo: FormGroup;
  public AllStatus: FormGroup;
  public CostForm: FormGroup;
  public Maintenance: FormGroup;
  public OtherInfo: FormGroup;
  public HardwareInfo: FormGroup;
  public selectedIndex;
  public selectedIndex1;

  public filteredOperatingSystem: ReplaySubject<SelectData[]> = new ReplaySubject<SelectData[]>(1);
  public filteredCPUClass: ReplaySubject<SelectData[]> = new ReplaySubject<SelectData[]>(1);
  public filteredCPUSubClass: ReplaySubject<SelectData[]> = new ReplaySubject<SelectData[]>(1);
  public filteredApplicationType: ReplaySubject<SelectData[]> = new ReplaySubject<SelectData[]>(1);
  public filteredModel: ReplaySubject<SelectData[]> = new ReplaySubject<SelectData[]>(1);
  public filteredManufacturer: ReplaySubject<SelectData[]> = new ReplaySubject<SelectData[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  protected _onDestroy = new Subject<void>();
  displayedColumns: string[] =['DocumentName','DocumentType','ViewDocument'];
  datasource=new MatTableDataSource();

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<assetTabsComponent>,
  private fb: FormBuilder,) { }

  ngOnInit() {
    this.buildItemForm(this.data.payload);

    this.paginator._intl.itemsPerPageLabel = 'Records per page';
    this.dataSource = new MatTableDataSource(this.Tabledata);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.filteredOperatingSystem.next(this.OperatingSystemData.slice());
    this.HardwareInfo.controls['OperatingSystemFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterOperatingSystem();
      });

      this.filteredCPUClass.next(this.CPUClassData.slice());
    this.HardwareInfo.controls['CPUClassFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCPUClass();
      });

      this.filteredCPUSubClass.next(this.CPUSubClassData.slice());
    this.HardwareInfo.controls['CPUSubClassFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCPUSubClass();
      });

      this.filteredApplicationType.next(this.ApplicationTypeData.slice());
      this.HardwareInfo.controls['ApplicationTypeFilter'].valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterApplicationType();
        });
  
        this.filteredModel.next(this.ModelData.slice());
      this.HardwareInfo.controls['ModelFilter'].valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterModel();
        });
  
        this.filteredManufacturer.next(this.ManufacturerData.slice());
      this.HardwareInfo.controls['ManufacturerFilter'].valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterManufacturer();
        });
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  nextStep(i){
    this.selectedIndex=i;
    //console.log(i);
}
previousStep(i){
   this.selectedIndex=i;
   console.log(i);
} 

nextStep1(i){
    this.selectedIndex1=i;
    //console.log(i);
}
previousStep1(i){
   this.selectedIndex1=i;
   console.log(i);
} 

public tabChanged(tabChangeEvent:MatTabChangeEvent):void{
  this.nextStep(tabChangeEvent.index);
  this.previousStep(tabChangeEvent.index);
  console.log(tabChangeEvent);
}

public tabChanged1(tabChangeEvent:MatTabChangeEvent):void{
  this.nextStep1(tabChangeEvent.index);
  this.previousStep1(tabChangeEvent.index);
  console.log(tabChangeEvent);
}

buildItemForm(item) {
    console.log(item);
    this.AssetInfo = this.fb.group({
      AssetNo: [{value:item.AssetNo || 'Laptop',disabled:true}],
      SubNo: [{value:item.SubNo || 'Laptop',disabled:true}],
      AssetClass: [{value:item.AssetClass || 'Laptop',disabled:true}],
      AssetType: [{value:item.AssetType || 'Laptop',disabled:true}],
      AssetSubType: [{value:item.AssetSubType || 'Laptop',disabled:true}],
      AssetName: [{value:item.AssetName || 'Laptop',disabled:true}],
      AssetDescription: [{value:item.AssetDescription || 'Good Laptop' ,disabled:true}],
      AssetClassOwner: [{value:item.AssetClassOwner || 'Sumit Porwal',disabled:true}],
      AllocationType: [{value:item.AllocationType || 'None',disabled:true}],
      UserType: [{value:item.UserType || 'Admin',disabled:true}],
      User: [{value:item.User || 'hi',disabled:true}],
      Custodian: [{value:item.Custodian || 'Laptop',disabled:true}],
      RevertDate: [{value:item.RevertDate || '28-Jan-2019',disabled:true}],
      CapitalizationDate: [{value:item.CapitalizationDate || '09-Oct-2019',disabled:true}],
      Qty: [{value:item.Qty || '10',disabled:true}],
      Plant: [{value:item.Plant || 'Laptop',disabled:true}],
      UOM: [{value:item.UOM || 'EA',disabled:true}],
      VendorName: [{value:item.VendorName || 'Laptop',disabled:true}],
      PONo: [{value:item.pono || 'None',disabled:true}],
      InvoiceNo: [{value:item.InvoiceNo || 'Inv-15001',disabled:true}],
      AssetrakStage: [{value:item.AssetrakStage || 'Scrutiny',disabled:true}],
      GeoCity: [{value:item.GeoCity || 'Indore',disabled:true}],
      GeoLocation: [{value:item.GeoLocation || 'India',disabled:true}],
      GpsDate: [{value:item.GpsDate || '28-Oct-2019',disabled:true}],
      UsefulLife: [{value:item.UsefulLife || '5 yrs',disabled:true}],
      AssetExpiryDate: [{value:item.AssetExpiryDate || '28-Oct-2020',disabled:true}],
      AssetCondition: [{value:item.AssetCondition || 'Good',disabled:true}],
      AssetCricality: [{value:item.AssetCricality || 'Normal',disabled:true}],
      GRNNo: [{value:item.GrnNo || '10',disabled:true}],
      EquipmentNumber: [{value:item.EquipmentNo || 'Eq10',disabled:true}],
    })
    this.InventoryInfo = this.fb.group({
      InventoryNo: [{value:item.inventoryno || 'In18',disabled:true}],
      SerialNo: [{value:item.serialno || '10',disabled:true}],
      Room: [{value:item.room || 'Laptop',disabled:true}],
      SubLocation: [{value:item.sublocation || 'Pune',disabled:true}],
      CostCenter: [{value:item.costcenter || 'Indore',disabled:true}],
      ITSerialNo: [{value:item.itserialno || '1002',disabled:true}],
      InventoryIndicator: [{value:item.inventoryindicator || 'None',disabled:true}],
      LabelSize: [{value:item.labelsize || '10',disabled:true}],
      LabelMaterial: [{value:item.labelmaterial || 'Laptop',disabled:true}],
      InventoryBy: [{value:item.inventoryby || 'Hi',disabled:true}],
      InventoryOn: [{value:item.inventoryon || '29_Feb-2019',disabled:true}],
      InventoryMode: [{value:item.inventorymode || 'Open',disabled:true}],
      InventoryNote: [{value:item.inventorynote || 'Laptop',disabled:true}],
      PreviousInventoryInfo: [{value:item.previousinventoryinfo || 'None',disabled:true}],
      NotFoundNote: [{value:item.notfoundnote || 'Laptop',disabled:true}],
      LabelQuality: [{value:item.labelquality || 'Laptop',disabled:true}],
    })
    this.AllStatus = this.fb.group({
      AssetStatus: [{value:item.assetstatus || 'Active',disabled:true}],
      AllocationStatus: [{value:item.allocationstatus || 'Available in Stores',disabled:true}],
      InventoryStatus: [{value:item.inventorystatus || 'Active',disabled:true}],
      TransferStatus: [{value:item.transferstatus || 'Transferrable',disabled:true}],
      RetirementStatus: [{value:item.retirementstatus || 'Laptop',disabled:true}],
    })
    this.CostForm = this.fb.group({
      Cost: [{value:item.Cost || 'Laptop',disabled:true}],
      WDV: [{value:item.WDV || 'Laptop',disabled:true}],
      DepnRunDate: [{value:item.depnrundate || '21-Sep-2020',disabled:true}],
      ResidualValue: [{value:item.residualvalue || '20',disabled:true}],
    })
    this.Maintenance = this.fb.group({
      InsuranceStart: [{value:item.insurancestart || '20_Oct-2019',disabled:true}],
      InsuranceEnd: [{value:item.insuranceend || '20-Oct-2020',disabled:true}],
      InsuranceVendor: [{value:item.insurancevendor || 'Laptop',disabled:true}],
      AMCStart: [{value:item.amcstart || '21-Oct-2019',disabled:true}],
      AMCEnd: [{value:item.amcend || '21-Oct-2020',disabled:true}],
      AMCVendor: [{value:item.amcvendor || 'Laptop',disabled:true}],
      WarrantyEnd: [{value:item.warrantyend || 'Laptop',disabled:true}],
      WarrantyStartDate: [{value:item.warrantystartdate || '25-Sep-2019',disabled:true}],
      WarrantyPeriod: [{value:item.warrantyperiod || '3yrs',disabled:true}],
      WarrantyCost: [{value:item.warrantycost || '2000',disabled:true}],
      WarrantyTerms: [{value:item.warrantyterms || 'None',disabled:true}],
      Remarks: [{value:item.remarks || 'Good',disabled:true}]
    })
    this.OtherInfo = this.fb.group({
      CPPNumber: [{value:item.cppnumber || 'C9102',disabled:true}],
      AMCComment: [{value:item.amccomment || 'Laptop',disabled:true}],
      Budget: [{value:item.budget || '20000',disabled:true}],
      GRNDate: [{value:item.grndate || 'None',disabled:true}],
      Remark: [{value:item.remark || 'Good',disabled:true}],
      AccountingStatus: [{value:item.accountingstatus || 'Laptop',disabled:true}],
      Division: [{value:item.division || '1st',disabled:true}],
      ExpenseAccount: [{value:item.expenseaccount || 'Laptop',disabled:true}],
      CostAccount: [{value:item.costaccount || 'None',disabled:true}],
      ReverseAccount: [{value:item.reverseaccount || 'None',disabled:true}],
      Department: [{value:item.department || 'Laptop',disabled:true}],
      Area: [{value:item.area || 'Pune',disabled:true}],
      Merchandise: [{value:item.merchandise || 'Laptop',disabled:true}],
      InterCompany: [{value:item.intercompany || 'Yes',disabled:true}],
      ServiceProvider: [{value:item.serviceprovider || 'Intel',disabled:true}],
      AccumulatedDepreciation: [{value:item.accumulateddescription || 'Yes',disabled:true}],
      Class: [{value:item.Class || 'Laptop',disabled:true}]
    })
    this.HardwareInfo = this.fb.group({
      OperatingSystem: [''],
      OperatingSystemFilter: [''],
      CPUClass: [''],
      CPUClassFilter: [''],
      CPUSubClass: [''],
      CPUSubClassFilter: [''],
      ApplicationType: [''],
      ApplicationTypeFilter: [''],
      Model: [''],
      ModelFilter: [''],
      Manufacturer: [''],
      ManufacturerFilter: [''],
      HostName: [''],
      HDD: [''],
      RAM: [''],
    })
  }

  protected setInitialValue() {
    debugger;
      this.HardwareInfo.controls['OperatingSystemFilter'].value
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: SelectData, b: SelectData) => a && b && a.id === b.id;
      });

      this.HardwareInfo.controls['CPUClassFilter'].value
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: SelectData, b: SelectData) => a && b && a.id === b.id;
      });

      this.HardwareInfo.controls['CPUSubClassFilter'].value
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: SelectData, b: SelectData) => a && b && a.id === b.id;
      });

      this.HardwareInfo.controls['ApplicationTypeFilter'].value
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: SelectData, b: SelectData) => a && b && a.id === b.id;
      });

      this.HardwareInfo.controls['ModelFilter'].value
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: SelectData, b: SelectData) => a && b && a.id === b.id;
      });

      this.HardwareInfo.controls['ManufacturerFilter'].value
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: SelectData, b: SelectData) => a && b && a.id === b.id;
      });
    }     
  
        protected filterOperatingSystem() {
          if (!this.OperatingSystemData) {
            return;
          }
          // get the search keyword
          let search = this.HardwareInfo.controls['OperatingSystemFilter'].value;
          if (!search) {
            this.filteredOperatingSystem.next(this.OperatingSystemData.slice());
            return;
          } else {
            search = search.toLowerCase();
          }
          // filter the banks
          this.filteredOperatingSystem.next(
            this.OperatingSystemData.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
          );
          console.log(this.filteredOperatingSystem);
        }
      
      protected filterCPUClass() {
          if (!this.CPUClassData) {
            return;
          }
          // get the search keyword
          let search = this.HardwareInfo.controls['CPUClassFilter'].value;
          if (!search) {
            this.filteredCPUClass.next(this.CPUClassData.slice());
            return;
          } else {
            search = search.toLowerCase();
          }
          // filter the banks
          this.filteredCPUClass.next(
            this.CPUClassData.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
          );
          console.log(this.filteredCPUClass);
        }
      
        protected filterCPUSubClass() {
          if (!this.CPUSubClassData) {
            return;
          }
          // get the search keyword
          let search = this.HardwareInfo.controls['CPUSubClassFilter'].value;
          if (!search) {
            this.filteredCPUSubClass.next(this.CPUSubClassData.slice());
            return;
          } else {
            search = search.toLowerCase();
          }
          // filter the banks
          this.filteredCPUSubClass.next(
            this.CPUSubClassData.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
          );
          console.log(this.filteredCPUSubClass);
        }

        protected filterApplicationType() {
          if (!this.ApplicationTypeData) {
            return;
          }
          // get the search keyword
          let search = this.HardwareInfo.controls['ApplicationTypeFilter'].value;
          if (!search) {
            this.filteredApplicationType.next(this.ApplicationTypeData.slice());
            return;
          } else {
            search = search.toLowerCase();
          }
          // filter the banks
          this.filteredApplicationType.next(
            this.ApplicationTypeData.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
          );
          console.log(this.filteredApplicationType);
        }
      
      protected filterModel() {
          if (!this.ModelData) {
            return;
          }
          // get the search keyword
          let search = this.HardwareInfo.controls['ModelFilter'].value;
          if (!search) {
            this.filteredModel.next(this.ModelData.slice());
            return;
          } else {
            search = search.toLowerCase();
          }
          // filter the banks
          this.filteredModel.next(
            this.ModelData.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
          );
          console.log(this.filteredModel);
        }
      
      protected filterManufacturer() {
          if (!this.ManufacturerData) {
            return;
          }
          // get the search keyword
          let search = this.HardwareInfo.controls['ManufacturerFilter'].value;
          if (!search) {
            this.filteredManufacturer.next(this.ManufacturerData.slice());
            return;
          } else {
            search = search.toLowerCase();
          }
          // filter the banks
          this.filteredManufacturer.next(
            this.ManufacturerData.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
          );
          console.log(this.filteredManufacturer);
        }
      


  onclosetab(){
    this.dialogRef.close();

  }
  

}

