import { Component, OnInit,Inject,ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {MatTabChangeEvent} from '@angular/material/tabs';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import * as headers from '../../../../assets/Headers.json';
import * as header from '../../../../assets/Headers.json';

interface SelectData {
  name: string;
  id:string;
}

@Component({
  selector: 'app-editassetreview',
  templateUrl: './edit_popup.component.html',
  styleUrls: ['./edit_popup.component.scss']
})
export class EditAssetDialogComponent implements OnInit {
  public AssetTypeData:SelectData[]=[
    {name:'Table',id:'1'},
  ];
  Headers: any = (header as any).default;
  public AssetSubTypeData:SelectData[]=[];

  public SubLocationData:SelectData[]=[
    {name:'Kagal',id:'1'},
  ];

  public UOMData:SelectData[]=[
    {name:'R-U',id:'1'},
    {name:'NMM',id:'2'},
    {name:'CCM',id:'3'},
    {name:'CD',id:'4'},
    {name:'CD3',id:'5'},
    {name:'CM',id:'6'},
    {name:'CM2',id:'7'},
    {name:'CV',id:'8'},
    {name:'CL',id:'9'},
    {name:'EA',id:'10'},
    {name:'UA',id:'11'},
  ];

  public VendorNameData:SelectData[]=[];

  public CostCenterData:SelectData[]=[
    {name:'Center1|Code1',id:'1'},
  ];

  public DocumentTypeData: SelectData[]=[
    {name:'All',id:'1'},
    {name:'Asset Not Found',id:'2'},
    {name:'Retired Document',id:'3'},
    {name:'Asset Photo',id:'4'},
    {name:'Insurance Policy',id:'5'},
    {name:'AMC Document',id:'6'},
    {name:'Retired Photo',id:'7'},
    {name:'Invoice',id:'8'},
    {name:'Software Document',id:'9'},
  ];

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
  public HardwareInfo: FormGroup;
  public Download: FormGroup;
  public CostForm: FormGroup;
  public Maintenance: FormGroup;
  public OtherInfo: FormGroup;
  public DocumentType="Select Document Type";
  public OperatingSystem="Select Operating System";
  public CPUClass="Select CPU Class";
  public CPUSubClass="Select CPU SubClass";
  public ApplicationType="Select Application Type";
  public Model="Select Model";
  public Manufacturer="Select Manufacturer";
  public filteredAssetType: ReplaySubject<SelectData[]> = new ReplaySubject<SelectData[]>(1);
  public filteredAssetSubType: ReplaySubject<SelectData[]> = new ReplaySubject<SelectData[]>(1);
  public filteredSubLocation: ReplaySubject<SelectData[]> = new ReplaySubject<SelectData[]>(1);
  public filteredUOM: ReplaySubject<SelectData[]> = new ReplaySubject<SelectData[]>(1);
  public filteredVendorName: ReplaySubject<SelectData[]> = new ReplaySubject<SelectData[]>(1);
  public filteredCostCenter: ReplaySubject<SelectData[]> = new ReplaySubject<SelectData[]>(1);
  public filteredDocumentType: ReplaySubject<SelectData[]> = new ReplaySubject<SelectData[]>(1);
  public filteredOperatingSystem: ReplaySubject<SelectData[]> = new ReplaySubject<SelectData[]>(1);
  public filteredCPUClass: ReplaySubject<SelectData[]> = new ReplaySubject<SelectData[]>(1);
  public filteredCPUSubClass: ReplaySubject<SelectData[]> = new ReplaySubject<SelectData[]>(1);
  public filteredApplicationType: ReplaySubject<SelectData[]> = new ReplaySubject<SelectData[]>(1);
  public filteredModel: ReplaySubject<SelectData[]> = new ReplaySubject<SelectData[]>(1);
  public filteredManufacturer: ReplaySubject<SelectData[]> = new ReplaySubject<SelectData[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  protected _onDestroy = new Subject<void>();
  public selectedIndex;
  displayedColumns: string[] =['DocumentType','DocumentName','DeleteDocument'];
  datasource=new MatTableDataSource();

  constructor(
  private fb: FormBuilder) { }

  nextStep(i){
       this.selectedIndex=i;
       //console.log(i);
  }
  previousStep(i){
      this.selectedIndex=i;
      console.log(i);
  }

  public tabChanged(tabChangeEvent:MatTabChangeEvent):void{
    this.nextStep(tabChangeEvent.index);
    this.previousStep(tabChangeEvent.index);
    console.log(tabChangeEvent);
  }
  ngOnInit() {
    this.buildItemForm();
  
  this.filteredAssetType.next(this.AssetTypeData.slice());
    this.AssetInfo.controls['AssetTypeFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAssetType();
      });

   this.filteredAssetSubType.next(this.AssetSubTypeData.slice());
    this.AssetInfo.controls['AssetSubTypeFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAssetSubType();
      });

    this.filteredSubLocation.next(this.SubLocationData.slice());
    this.AssetInfo.controls['SubLocationFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterSubLocation();
      });

      this.filteredUOM.next(this.UOMData.slice());
    this.AssetInfo.controls['UOMFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterUOM();
      });

      this.filteredVendorName.next(this.VendorNameData.slice());
    this.AssetInfo.controls['VendorNameFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterVendorName();
      });

      this.filteredCostCenter.next(this.CostCenterData.slice());
    this.AssetInfo.controls['CostCenterFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCostCenter();
      });

      this.filteredDocumentType.next(this.DocumentTypeData.slice());
    this.Download.controls['DocumentTypeFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDocumentType();
      });

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

      buildItemForm() {
        this.AssetInfo = this.fb.group({
          InventoryNo: [{value:'',disabled:true}],
          AssetNo: [{value:'testasset1',disabled:true}],
          SubNo: [{value:'0|0',disabled:true}],
          AssetClass: [{value:'Furniture',disabled:true}],
          AssetType: [''],
          AssetTypeFilter: [''],
          AssetSubType: [''],
          AssetSubTypeFilter: [''],
          CapitalizationDate: [{value:'23-Sep-2020',disabled:true}],
          Qty: [{value:'12',disabled:true}],
          Plant: [{value:'Kolhapur',disabled:true}],
          SubLocation: [''],
          SubLocationFilter: [''],
          AssetCondition: [''],
          AssetCricality: [''],
          GRNNo: [''],
          Room: [''],
          UOM: [''],
          UOMFilter: [''],
          AssetName: [{value:'fsafds',disabled:true}],
          AssetDescription: [''],
          VendorName: [''],
          VendorNameFilter: [''],
          CostCenterFilter: [''],
          PONo: [{value:'',disabled:true}],
          InvoiceNo: [{value:'',disabled:true}],
          SerialNo: [''],
          CostCenter: [''],
          ITSerialNo: [''],
          UsefulLife: [{value:'',disabled:true}],
          AssetExpiryDate: [''],
          User: [{value:'',disabled:true}],
          Custodian: [{value:'',disabled:true}],
          EquipmentNumber: [''],
        })
        this.CostForm = this.fb.group({
          Cost: [{value:'3,333',disabled:true}],
          WDV: [{value:'333',disabled:true}],
          DepnRunDate: [{value:'2020-09-23',disabled:true}],
          ResidualValue: [''],
        })
        this.Maintenance = this.fb.group({
          InsuranceStart: [{value:'',disabled:true}],
          InsuranceEnd: [{value:'',disabled:true}],
          InsuranceVendor: [{value:'',disabled:true}],
          AMCStart: [{value:'',disabled:true}],
          AMCEnd: [{value:'',disabled:true}],
          AMCVendor: [{value:'',disabled:true}],
          WarrantyEnd: [{value:'',disabled:true}],
          WarrantyStartDate: [{value:'',disabled:true}],
          WarrantyPeriod: [''],
          WarrantyCost: [''],
          WarrantyTerms: [''],
          Remarks: ['']
        })
        this.OtherInfo = this.fb.group({
          IsMetal: [''],
          CPPNumber: [''],
          AMCComment: [''],
          Budget: [''],
          GRNDate: [''],
          Description:[''],
          Remark: [''],
          AccountingStatus: [''],
          Division: [''],
          ExpenseAccount: [''],
          CostAccount: [''],
          ReverseAccount: [''],
          Department: [''],
          Area: [''],
          Merchandise: [''],
          InterCompany: [''],
          ServiceProvider: [''],
          AccumulatedDepreciation: [''],
          Class: [''],
          Loc2:[''],
          Loc3:[''],
          Loc4:[''],
          Loc5:[''],
          FutureUse:[''],
          InterUnit:[''],
          AccountClearing:[''],
          DepartmentClearing:[''],
          Comments:[''],
          Upl:[''],
          DepreciationReserve:[''],
          Project:[''],
          AmortizationStartDate:[''],
          AmortizeNBV:[''],
          LifeInMonths:[''],
          Messages:[''],
        })
        this.Download=this.fb.group({
          DocumentType:[''],
          DocumentTypeFilter:[''],
          FileUpload:['']
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
        this.AssetInfo.controls['AssetTypeFilter'].value
          .pipe(take(1), takeUntil(this._onDestroy))
          .subscribe(() => {
            this.singleSelect.compareWith = (a: SelectData, b: SelectData) => a && b && a.id === b.id;
          });
    
          this.AssetInfo.controls['AssetSubTypeFilter'].value
          .pipe(take(1), takeUntil(this._onDestroy))
          .subscribe(() => {
            this.singleSelect.compareWith = (a: SelectData, b: SelectData) => a && b && a.id === b.id;
          });
    
          this.AssetInfo.controls['SubLocationFilter'].value
          .pipe(take(1), takeUntil(this._onDestroy))
          .subscribe(() => {
            this.singleSelect.compareWith = (a: SelectData, b: SelectData) => a && b && a.id === b.id;
          });
    
          this.AssetInfo.controls['UOMFilter'].value
          .pipe(take(1), takeUntil(this._onDestroy))
          .subscribe(() => {
            this.singleSelect.compareWith = (a: SelectData, b: SelectData) => a && b && a.id === b.id;
          });
    
          this.AssetInfo.controls['VendorNameFilter'].value
          .pipe(take(1), takeUntil(this._onDestroy))
          .subscribe(() => {
            this.singleSelect.compareWith = (a: SelectData, b: SelectData) => a && b && a.id === b.id;
          });
    
          this.AssetInfo.controls['CostCenterFilter'].value
          .pipe(take(1), takeUntil(this._onDestroy))
          .subscribe(() => {
            this.singleSelect.compareWith = (a: SelectData, b: SelectData) => a && b && a.id === b.id;
          });
    
          this.Download.controls['DocumentTypeFilter'].value
          .pipe(take(1), takeUntil(this._onDestroy))
          .subscribe(() => {
            this.singleSelect.compareWith = (a: SelectData, b: SelectData) => a && b && a.id === b.id;
          });
    
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

        protected filterAssetType() {
          debugger;
          if (!this.AssetTypeData) {
            return;
          }
          // get the search keyword
          let search = this.AssetInfo.controls['AssetTypeFilter'].value;
          if (!search) {
            this.filteredAssetType.next(this.AssetTypeData.slice());
            return;
          } else {
            search = search.toLowerCase();
          }
          // filter the banks
          this.filteredAssetType.next(
            this.AssetTypeData.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
          );
          console.log(this.filteredAssetType);
        }
      
        protected filterAssetSubType() {
          if (!this.AssetSubTypeData) {
            return;
          }
          // get the search keyword
          let search = this.AssetInfo.controls['AssetSubTypeFilter'].value;
          if (!search) {
            this.filteredAssetSubType.next(this.AssetSubTypeData.slice());
            return;
          } else {
            search = search.toLowerCase();
          }
          // filter the banks
          this.filteredAssetSubType.next(
            this.AssetSubTypeData.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
          );
          console.log(this.filteredAssetSubType);
        }
      
      protected filterSubLocation() {
          if (!this.SubLocationData) {
            return;
          }
          // get the search keyword
          let search = this.AssetInfo.controls['SubLocationFilter'].value;
          if (!search) {
            this.filteredSubLocation.next(this.SubLocationData.slice());
            return;
          } else {
            search = search.toLowerCase();
          }
          // filter the banks
          this.filteredSubLocation.next(
            this.SubLocationData.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
          );
          console.log(this.filteredSubLocation);
        }

        protected filterUOM() {
          if (!this.UOMData) {
            return;
          }
          // get the search keyword
          let search = this.AssetInfo.controls['UOMFilter'].value;
          if (!search) {
            this.filteredUOM.next(this.UOMData.slice());
            return;
          } else {
            search = search.toLowerCase();
          }
          // filter the banks
          this.filteredUOM.next(
            this.UOMData.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
          );
          console.log(this.filteredUOM);
        }
      
      protected filterVendorName() {
          if (!this.VendorNameData) {
            return;
          }
          // get the search keyword
          let search = this.AssetInfo.controls['VendorNameFilter'].value;
          if (!search) {
            this.filteredVendorName.next(this.VendorNameData.slice());
            return;
          } else {
            search = search.toLowerCase();
          }
          // filter the banks
          this.filteredVendorName.next(
            this.VendorNameData.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
          );
          console.log(this.filteredVendorName);
        }
      
      protected filterCostCenter() {
          if (!this.CostCenterData) {
            return;
          }
          // get the search keyword
          let search = this.AssetInfo.controls['CostCenterFilter'].value;
          if (!search) {
            this.filteredCostCenter.next(this.CostCenterData.slice());
            return;
          } else {
            search = search.toLowerCase();
          }
          // filter the banks
          this.filteredCostCenter.next(
            this.CostCenterData.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
          );
          console.log(this.filteredCostCenter);
        }
      
      protected filterDocumentType() {
          if (!this.DocumentTypeData) {
            return;
          }
          // get the search keyword
          let search = this.Download.controls['DocumentTypeFilter'].value;
          if (!search) {
            this.filteredDocumentType.next(this.DocumentTypeData.slice());
            return;
          } else {
            search = search.toLowerCase();
          }
          // filter the banks
          this.filteredDocumentType.next(
            this.DocumentTypeData.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
          );
          console.log(this.filteredDocumentType);
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
  
}

