import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';

import { LocalStoreService } from 'app/shared/services/local-store.service';
import {DatePipe} from '@angular/common';
import { tablecolumnComponent } from '../dialog/tablecolum-popup/tablecolum-popup.component';
import { assetTabsComponent } from '../dialog/asset-tabs/asset_tabs.component';
// import { FilterPopupComponent } from './filter-popup/filter-popup.component';
import {DefaultFieldsComponent} from '../dialog/field_dialog/field_dialog.component';
import {AssetService} from '../../services/AssetService';
import {ReportService} from '../../services/ReportService';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';


interface Plant {
  id: string;
  name: string;
}
interface AssetClass {
  id: string;
  name: string;
}
interface Currency {
  id: string;
  name: string;
}
interface FinancialYear {
  id: string;
  name: string;
}
interface Period {
  id: string;
  name: string;
}
interface ReportFilter {
  id: string;
  name: string;
}
interface Region {
  id: string;
  name: string;
}
interface Company {
  id: string;
  name: string;
}
interface Sbu {
  id: string;
  name: string;
}
interface AssetCategory {
  id: string;
  name: string;
}
interface SubType {
  id: string;
  name: string;
}
interface Type {
  id: string;
  name: string;
}

export interface PeriodicElement {
  AssetNo: string;
  SubNo: string;
  CapitalizationDate: string;
  AssetClass: string;
  AssetType: string;
  AssetSubType: string;
  UOM: string;
  AssetName: string;
  AssetDescription: string;
  Qty: string;
  Location: string;
  Cost: string;
  WDV: string;
  EquipmentNO: string;
  AssetCondition: string;
  AssetCriticality: string;

}


const PLANTS: Plant[] = [
  { name: '7888996', id: 'A' },
  { name: 'AAAABBBBCCCC', id: 'B' },
  { name: 'Abu Dhabi', id: 'C' },
  { name: 'Auckland', id: 'D' },
  { name: 'Chennai', id: 'E' },
  { name: 'Dubai', id: 'F' },
  { name: 'Mumbai', id: 'G' },
  { name: 'Wellington', id: 'H' },
];
const REGION: Region[] = [
  { name: 'Pune', id: 'A' },
  { name: 'Sulawesi Selatan', id: 'B' },
  { name: 'Abu Zabi', id: 'C' },
  { name: 'Hillsborough', id: 'D' },
  { name: 'Leone', id: 'E' },
  { name: 'Dubai', id: 'F' },
  { name: 'Mumbai', id: 'G' },
  { name: 'Martinborough', id: 'H' },
];
const SBU: Sbu[] = [
  { name: 'PA', id: 'A' },
  { name: 'KA', id: 'B' },
  { name: 'CA', id: 'C' },
  { name: 'MA', id: 'D' },
];
const COMPANY: Company[] = [
  { name: 'AssetCues', id: 'A' },
  { name: 'Assetrak', id: 'B' },
  { name: 'Arhata', id: 'C' },
];
const ASSETCLASS: AssetClass[] = [
  { name: '@#$%^&*()', id: 'A' },
  { name: 'AAABBBCCC', id: 'B' },
  { name: 'Computer', id: 'C' },
  { name: 'Furniture & Fixture', id: 'D' },
  { name: 'LAND & BUILDING', id: 'E' },
  { name: 'LAPTOP', id: 'F' },
  { name: 'PLANT & EQUIPMENT', id: 'G' },
  { name: 'PLANT & MACHINARY', id: 'H' },
];
const ASSETCATEGORY: AssetCategory[] = [
  { name: 'a test class', id: 'A' },
  { name: 'Furniture', id: 'B' },
  { name: 'IT', id: 'C' },
  { name: 'Laptop', id: 'D' },
  { name: 'Moulds & Dies', id: 'E' },
  { name: 'NEW', id: 'F' },
  { name: 'Office Equipment', id: 'G' },
  { name: 'Plant & Machinary', id: 'H' },
  { name: 'test', id: 'I' },
  { name: 'test1', id: 'J' },
  { name: 'Vehicle', id: 'K' },
];
const TYPE: Type[] = [
  { name: 'Assets Excluded', id: 'A' },
  { name: 'Include Untagged Assets', id: 'B' },
];
const SUBTYPE: SubType[] = [
  { name: 'Dell Vostro', id: 'D' },
  { name: 'Hp', id: 'H' },
  { name: 'Linux', id: 'L' },
  { name: 'Mac', id: 'M' },
  { name: 'Accer', id: 'A' },
  { name: 'Assus', id: 'S' },
  { name: 'Lenovo', id: 'L' },
];
const CURRENCY: Currency[] = [
  { name: 'INR', id: 'A' },
  { name: 'EGP', id: 'B' },
  { name: 'USD', id: 'C' },
];
const REPORTFILTER: ReportFilter[] = [
  { name: 'For the Period', id: 'A' },
  { name: 'By Transfer Id', id: 'B' },
];
const FINANCIALYEAR: FinancialYear[] = [
  { name: '2018-19', id: 'A' },
  { name: '2019-20', id: 'B' },
  { name: '2020-21', id: 'C' },
];
const PERIOD: Period[] = [
  { name: 'Jan-Mar', id: 'A' },
  { name: 'Apr-Jun', id: 'B' },
  { name: 'Jul-Sep', id: 'C' },
  { name: 'Oct-Dec', id: 'C' },
];

@Component({
  selector: 'app-verify-only-assets',
  templateUrl: './verify-only-assets.component.html',
  styleUrls: ['./verify-only-assets.component.scss']
})
export class VerifyOnlyAssetsComponent implements OnInit {
  header: any = [];
  numRows: number;
  show: boolean = false;
  selectedValue: string;
  selectedassetclass: string;
  selectedassettype: string;
  selectedassetuom: string;
  IsDisabled: boolean = true;
  typeId: number;
  public arrBirds: any[] = [
      {
        "InventoryNo": "AC-1012",
        "AssetNo": "6007458",
        "SubNo": "0|0",
        "CapitalizationDate": "30-Apr-2005",
        "AssetClass": "Furniture",
        "AssetClassShortName": "FF",
        "AssetName": "Gsm Cutter With Blade For Bangalore & Madras",
        "AssetDescription": "",
        "VendorName": "Bailwal  Sanjeev",
        "Plant": "Belgaum - IT",
        "Qty": 1,
        "CostCenter": "",
        "Room": "",
        "Sub-Location": "",
        "UserEmail": "",
        "User": "",
        "Cost": 2070,
        "WDV": 0,
        "EquipmentNumber": "",
        "AssetCondition": "Fit For Purpose|21-Jul-2020",
        "AssetCriticality": "Normal",
        "ApprovedBy": "Shreyas Doshi",
        "ApprovedOn": "04-Oct-2020",
        "InventoryOn": "24-Nov-2020 12 54 31 PM",
        "InventoryBy": "Mobile Usermobile",
        "InventoryComment": "",
        "InventoryMode": "Manual",
        "InventoryNote": "Verified",
        "Verifiedat": "",
     },
      {
        "InventoryNo": "AC-1011",
        "AssetNo": "6008639",
        "SubNo": "0|0",
        "CapitalizationDate": "30-Apr-2005",
        "AssetClass": "Furniture",
        "AssetClassShortName": "FF",
        "AssetName": "Snap Testing Ddadadassdaadsads",
        "AssetDescription": "",
        "VendorName": "Bailwal  Sanjeev",
        "Plant": "Belgaum - IT",
        "Qty": 1,
        "CostCenter": "",
        "Room": "",
        "Sub-Location": "",
        "UserEmail": "",
        "User": "",
        "Cost": 21019,
        "WDV": 0,
        "EquipmentNumber": "",
        "AssetCondition": "Fit For Purpose|05-Sep-2020",
        "AssetCriticality": "Normal",
        "ApprovedBy": "Shreyas Doshi",
        "ApprovedOn": "01-Oct-2020",
        "InventoryOn": "24-Nov-2020 01 00 34 PM",
        "InventoryBy": "Mobile Usermobile",
        "InventoryComment": "",
        "InventoryMode": "Manual",
        "InventoryNote": "Verified",
        "Verifiedat": "",
     },
      {
        "InventoryNo": "AC-1008",
        "AssetNo": "6098175",
        "SubNo": "0|0",
        "CapitalizationDate": "12-Mar-2009",
        "AssetClass": "Furniture",
        "AssetClassShortName": "FF",
        "AssetName": "X Rite Spectralight Iii Light Booth For Bangalore",
        "AssetDescription": "",
        "VendorName": "Bailwal  Sanjeev",
        "Plant": "Belgaum - ADMIN",
        "Qty": 1,
        "CostCenter": "",
        "Room": "",
        "Sub-Location": "",
        "UserEmail": "shreyasdoshi48@gmail.com",
        "User": "Shreyas Doshi",
        "Cost": 313227,
        "WDV": 0,
        "EquipmentNumber": "",
        "AssetCondition": "Fit For Purpose|21-Jul-2020",
        "AssetCriticality": "Normal",
        "ApprovedBy": "Shreyas Doshi",
        "ApprovedOn": "04-Oct-2020",
        "InventoryOn": "24-Nov-2020 01 00 42 PM",
        "InventoryBy": "Mobile Usermobile",
        "InventoryComment": "",
        "InventoryMode": "Manual",
        "InventoryNote": "Not Found",
        "Verifiedat": "",
     },
      {
        "InventoryNo": "AC-1008",
        "AssetNo": "6098175",
        "SubNo": "0|0",
        "CapitalizationDate": "12-Mar-2009",
        "AssetClass": "Furniture",
        "AssetClassShortName": "FF",
        "AssetName": "X Rite Spectralight Iii Light Booth For Bangalore",
        "AssetDescription": "",
        "VendorName": "Bailwal  Sanjeev",
        "Plant": "Belgaum - ADMIN",
        "Qty": 1,
        "CostCenter": "",
        "Room": "",
        "Sub-Location": "",
        "UserEmail": "shreyasdoshi48@gmail.com",
        "User": "Shreyas Doshi",
        "Cost": 3000,
        "WDV": 2000,
        "EquipmentNumber": "",
        "AssetCondition": "Fit For Purpose|21-Jul-2020",
        "AssetCriticality": "Normal",
        "ApprovedBy": "Shreyas Doshi",
        "ApprovedOn": "04-Oct-2020",
        "InventoryOn": "24-Nov-2020 01 02 55 PM",
        "InventoryBy": "",
        "InventoryComment": "",
        "InventoryMode": "",
        "InventoryNote": "Not Found",
        "Verifiedat": "",
     },
      {
        "InventoryNo": "AC-1008",
        "AssetNo": "6098175",
        "SubNo": "0|0",
        "CapitalizationDate": "12-Mar-2009",
        "AssetClass": "Furniture",
        "AssetClassShortName": "FF",
        "AssetName": "X Rite Spectralight Iii Light Booth For Bangalore",
        "AssetDescription": "",
        "VendorName": "Bailwal  Sanjeev",
        "Plant": "Belgaum - ADMIN",
        "Qty": 1,
        "CostCenter": "",
        "Room": "",
        "Sub-Location": "",
        "UserEmail": "shreyasdoshi48@gmail.com",
        "User": "Shreyas Doshi",
        "Cost": 3000,
        "WDV": 2000,
        "EquipmentNumber": "",
        "AssetCondition": "Fit For Purpose|21-Jul-2020",
        "AssetCriticality": "Normal",
        "InventoryIndicator": "Yes",
        "AssetrakStage": "Available For Inventory",
        "ApprovedBy": "Shreyas Doshi",
        "ApprovedOn": "04-Oct-2020",
        "InventoryOn": "24-Nov-2020 01 02 55 PM",
        "InventoryBy": "",
        "InventoryComment": "",
        "InventoryMode": "",
        "InventoryNote": "Not Found",
        "Verifiedat": "",
     },
  ];
  private isButtonVisible = false;
  public getSeletedData = [];

  public assetlength;
  public newLength;
  public arrlength = 0;
  public arr = [];
  public newdataSource = [];
  public isallchk: boolean;
  public getselectedData: any[] = [];
  public selecteddatasource: any[] = [];
  public appliedfilters: any[]=[];
  public sendData;

  /////Filter Instance/////////

  AssetNoFilter = new FormControl();
  SubNoFilter = new FormControl();
  CapitalizationDateFilter = new FormControl();
  AssetClassFilter = new FormControl();
  AssetTypeFilter = new FormControl();
  AssetSubTypeFilter = new FormControl();
  UOMFilter = new FormControl();
  AssetNameFilter = new FormControl();
  AssetDescriptionFilter = new FormControl();
  QtyFilter = new FormControl();
  LocationFilter = new FormControl();
  CostFilter = new FormControl();
  WDVFilter = new FormControl();
  EquipmentNOFilter = new FormControl();
  AssetConditionFilter = new FormControl();
  AssetCriticalityFilter = new FormControl();


  filteredValues = {
    AssetNo: '', SubNo: '', CapitalizationDate: '',
    AssetClass: '', AssetType: '',
    AssetSubType: '', UOM: '', AssetName: '',
    AssetDescription: '', Qty: '', Cost: '', WDV: '',
    EquipmentNO: '', AssetCondition: '', AssetCriticality: ''

  };

  SessionGroupId: any;
  SessionRegionId: any;
  SessionCompanyId: any;
  SessionUserId: any;

  ///////////////////////////////////

  protected currency: Currency[] = [];
  public currencyMultiCtrl: FormControl = new FormControl();
  public currencyFilterCtrl: FormControl = new FormControl();
  public filteredCurrencyMulti: ReplaySubject<Currency[]> = new ReplaySubject<Currency[]>(1);

  protected plants: Plant[] = [];
  public plantMultiCtrl: FormControl = new FormControl();
  public plantMultiFilterCtrl: FormControl = new FormControl();
  public filteredPlantsMulti: ReplaySubject<Plant[]> = new ReplaySubject<Plant[]>(1);

  protected subtype: SubType[] = [];
  public subtypeMultiCtrl: FormControl = new FormControl();
  public subtypeFilterCtrl: FormControl = new FormControl();
  public filteredSubTypeMulti: ReplaySubject<SubType[]> = new ReplaySubject<SubType[]>(1);

  protected assetclass: AssetClass[] = [];
  public assetclassMultiCtrl: FormControl = new FormControl();
  public assetclassMultiFilterCtrl: FormControl = new FormControl();
  public filteredAssetClassMulti: ReplaySubject<AssetClass[]> = new ReplaySubject<AssetClass[]>(1);

  protected type: Type[] = [];
  public typeMultiCtrl: FormControl = new FormControl();
  public typeMultiFilterCtrl: FormControl = new FormControl();
  public filteredTypeMulti: ReplaySubject<Type[]> = new ReplaySubject<Type[]>(1);

  protected region: Region[] = [];
  public regionMultiCtrl: FormControl = new FormControl();
  public regionMultiFilterCtrl: FormControl = new FormControl();
  public filteredRegionMulti: ReplaySubject<Region[]> = new ReplaySubject<Region[]>(1);

  protected company: Company[] = [];
  public companyMultiCtrl: FormControl = new FormControl();
  public companyMultiFilterCtrl: FormControl = new FormControl();
  public filteredCompanyMulti: ReplaySubject<Company[]> = new ReplaySubject<Company[]>(1);

  protected assetcategory: AssetCategory[] = [];
  public assetcategoryMultiCtrl: FormControl = new FormControl();
  public assetcategoryMultiFilterCtrl: FormControl = new FormControl();
  public filteredAssetCategoryMulti: ReplaySubject<AssetCategory[]> = new ReplaySubject<AssetCategory[]>(1);

  protected sbu: Sbu[] = [];
  public sbuMultiCtrl: FormControl = new FormControl();
  public sbuMultiFilterCtrl: FormControl = new FormControl();
  public filteredSBUMulti: ReplaySubject<Sbu[]> = new ReplaySubject<Sbu[]>(1);

  protected reportfilter: ReportFilter[] = REPORTFILTER;
  public reportfilterMultiCtrl: FormControl = new FormControl();
  public reportfilterMultiFilterCtrl: FormControl = new FormControl();
  public filteredReportFilterMulti: ReplaySubject<ReportFilter[]> = new ReplaySubject<ReportFilter[]>(1);

  protected financialyear: FinancialYear[] = FINANCIALYEAR;
  public financialyearMultiCtrl: FormControl = new FormControl();
  public financialyearMultiFilterCtrl: FormControl = new FormControl();
  public filteredFinancialYearMulti: ReplaySubject<FinancialYear[]> = new ReplaySubject<FinancialYear[]>(1);

  protected period: Period[] = PERIOD;
  public periodMultiCtrl: FormControl = new FormControl();
  public periodMultiFilterCtrl: FormControl = new FormControl();
  public filteredPeriodMulti: ReplaySubject<Period[]> = new ReplaySubject<Period[]>(1);


  public FromDate: FormControl = new FormControl();
  public ToDate: FormControl = new FormControl();  
  today = new Date(); 

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  protected _onDestroy = new Subject<void>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedHeaders: string[] = [this.header.InventoryNumber, this.header.AssetNo, this.header.SAID,
    this.header.AssetClass, this.header.ADL1, this.header.ADL2, this.header.ADL3,this.header.AcquisitionCost, this.header.WDV, 
    this.header.EquipmentNumber, this.header.AssetCondition,this.header.AssetCriticality, this.header.ApprovedBy,this.header.ApprovedOn,
    this.header.InventoryOn,this.header.InventoryBy,this.header.InventoryComment,this.header.InventoryMode,this.header.InventoryNote,this.header.LabelQuality,
    this.header.NotFoundNote,this.header.VerifiedAt];
  displayedColumns: string[] = ["InventoryNo","AssetNo","SubNo","AssetClass","AssetClassShortName","AssetName","AssetDescription",
  "Cost","WDV","EquipmentNumber","AssetCondition","AssetCriticality","ApprovedBy","ApprovedOn","InventoryOn","InventoryBy","InventoryComment",
  "InventoryMode","InventoryNote","Verifiedat"];
  dataSource = new MatTableDataSource<any>();
  payloadData = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  tempdatasource: any[] = [];

  constructor(public dialog: MatDialog, 
    private httpService: HttpClient, 
    public localService: LocalStoreService,
    public datepipe: DatePipe,
    public reportService : ReportService,
    private storage: ManagerService,
    private jwtAuth: JwtAuthService,
    ){
       this.header = this.jwtAuth.getHeaders();
    }

  showAssets(){
    const parameters = {
      DisplayColumnName: '',
      GroupId: this.SessionGroupId,
      regionId: this.SessionRegionId,
      CompanyIds: this.SessionCompanyId,
      IsBaseSelected: true,
      ReportName: "VerifyReport",
      UserId: this.SessionUserId,
      blockIdList: [],
      isExport: false,
      isPageLoad: false,
      locationIds: [],
      pageNumber: 1,
      pageSize: 50,
      searchtext: '',
      searchColumn: '',
      sbulist: [],
      categoryIdList: [],
      typeofassetlist: [],
      subtypeofassetlist: [],
      selectedCurrency: ''
    };
    this.reportService.getNonVerifiableAssets(parameters).subscribe(response => {
      console.log(response);
    })
  }

  getRegions(){
    this.reportService.getTaggingRegion(this.SessionGroupId).subscribe( response=> {
      console.log('Region',response);
      this.region = JSON.parse(response);
    })
  }

  getCompanies(){
    this.reportService.getTaggingCompany(this.SessionGroupId,this.SessionRegionId).subscribe( response => {
      console.log('Company',response);
      this.company= JSON.parse(response);
    })
  }

  getSbu(){
    this.reportService.getTaggingSBU(this.SessionCompanyId).subscribe( response=> {
      console.log('sbu',response);
      this.sbu = JSON.parse(response);
    })
  }

  getPlants(){
    this.reportService.getTaggingPlant(this.SessionCompanyId).subscribe( response => {
      console.log('plant',response);
      this.plants = JSON.parse(response);
    })
  }

  getCategory(){
    this.reportService.getTaggingCategory(this.SessionCompanyId).subscribe( response=> {
      console.log('Category',response);
      this.assetcategory = JSON.parse(response);
    })
  }

  getClass(){
    this.reportService.getTaggingClass(this.SessionCompanyId).subscribe( response => {
      console.log('asset class',response);
      this.assetclass = response;
    })
  }

  getType(){
    this.reportService.getTaggingType(this.SessionCompanyId).subscribe( response => {
      console.log('asset type',response);
    })
  }

  getSubType(){
    this.reportService.getTaggingSubType(this.SessionCompanyId,  this.typeId).subscribe(response => {
      console.log('asset sub type',response);
    })
  }

  getCurrency(){
    this.reportService.getTaggingCurrency(this.SessionCompanyId,this.SessionGroupId).subscribe(response => {
      console.log('asset currency',response);
      this.currency = JSON.parse(response);
    })
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  

 

  toggleSelectAllAssetCategory(selectAllValue: boolean) {
    this.filteredAssetCategoryMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.assetcategoryMultiCtrl.patchValue(val);
        } else {
          this.assetcategoryMultiCtrl.patchValue([]);
        }
      });
  }

  toggleSelectAll(selectAllValue: boolean) {
    this.filteredPlantsMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.plantMultiCtrl.patchValue(val);
        } else {
          this.plantMultiCtrl.patchValue([]);
        }
      });
  }

  toggleSelectAllRegion(selectAllValue: boolean) {
    this.filteredRegionMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.regionMultiCtrl.patchValue(val);
        } else {
          this.regionMultiCtrl.patchValue([]);
        }
      });
  }

  toggleSelectAllAssetClass(selectAllValue: boolean) {
    this.filteredAssetClassMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.assetclassMultiCtrl.patchValue(val);
        } else {
          this.assetclassMultiCtrl.patchValue([]);
        }
      });
  }

  toggleSelectAllCurrency(selectAllValue: boolean) {
    this.filteredCurrencyMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.currencyMultiCtrl.patchValue(val);
        } else {
          this.currencyMultiCtrl.patchValue([]);
        }
      });
  }

  toggleSelectAllCompany(selectAllValue: boolean) {
    this.filteredCompanyMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.companyMultiCtrl.patchValue(val);
        } else {
          this.companyMultiCtrl.patchValue([]);
        }
      });
  }

  toggleSelectAllSBU(selectAllValue: boolean) {
    this.filteredCompanyMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.sbuMultiCtrl.patchValue(val);
        } else {
          this.sbuMultiCtrl.patchValue([]);
        }
      });
  }

  toggleSelectAllType(selectAllValue: boolean) {
    this.filteredTypeMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.typeMultiCtrl.patchValue(val);
        } else {
          this.typeMultiCtrl.patchValue([]);
        }
      });
  }

  toggleSelectAllSubType(selectAllValue: boolean) {
    this.filteredSubTypeMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.subtypeMultiCtrl.patchValue(val);
        } else {
          this.subtypeMultiCtrl.patchValue([]);
        }
      });
  }

  toggleSelectAllPeriod(selectAllValue: boolean) {
    this.filteredPeriodMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.periodMultiCtrl.patchValue(val);
        } else {
          this.periodMultiCtrl.patchValue([]);
        }
      });
  }


  protected setInitialValue() {

    this.filteredAssetCategoryMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: AssetCategory, b: AssetCategory) => a && b && a.id === b.id;
      });

    this.filteredPlantsMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: Plant, b: Plant) => a && b && a.id === b.id;
      });
      this.filteredRegionMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: Region, b: Region) => a && b && a.id === b.id;
      });
      this.filteredAssetClassMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: AssetClass, b: AssetClass) => a && b && a.id === b.id;
      });

    this.filteredCompanyMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: Company, b: Company) => a && b && a.id === b.id;
      });

      this.filteredSBUMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: Sbu, b: Sbu) => a && b && a.id === b.id;
      });
      this.filteredTypeMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: Type, b: Type) => a && b && a.id === b.id;
      });
      this.filteredSubTypeMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: SubType, b: SubType) => a && b && a.id === b.id;
      });

    this.filteredFinancialYearMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: FinancialYear, b: FinancialYear) => a && b && a.id === b.id;
      });
      
      this.filteredPeriodMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: Period, b: Period) => a && b && a.id === b.id;
      });

      this.filteredReportFilterMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: ReportFilter, b: ReportFilter) => a && b && a.id === b.id;
      });

      this.filteredCurrencyMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: Currency, b: Currency) => a && b && a.id === b.id;
      });

  }

  protected filterAssetCategoryMulti() {
    if (!this.assetcategory) {
      return;
    }
    let search = this.assetcategoryMultiFilterCtrl.value;
    if (!search) {
      this.filteredAssetCategoryMulti.next(this.assetcategory.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredAssetCategoryMulti.next(
      this.assetcategory.filter(assetcategory => assetcategory.name.toLowerCase().indexOf(search) > -1)
    );
  }


  protected filterPlantsMulti() {
    if (!this.plants) {
      return;
    }
    let search = this.plantMultiFilterCtrl.value;
    if (!search) {
      this.filteredPlantsMulti.next(this.plants.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredPlantsMulti.next(
      this.plants.filter(plant => plant.name.toLowerCase().indexOf(search) > -1)
    );
  }
  protected filterRegionMulti() {
    if (!this.region) {
      return;
    }
    let search = this.regionMultiFilterCtrl.value;
    if (!search) {
      this.filteredRegionMulti.next(this.region.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredRegionMulti.next(
      this.region.filter(region => region.name.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterAssetClassMulti() {
    if (!this.assetclass) {
      return;
    }
    let search = this.assetclassMultiFilterCtrl.value;
    if (!search) {
      this.filteredAssetClassMulti.next(this.assetclass.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredAssetClassMulti.next(
      this.assetclass.filter(assetclass => assetclass.name.toLowerCase().indexOf(search) > -1)
    );
  }


  protected filterCompanyMulti() {
    if (!this.company) {
      return;
    }
    let search = this.companyMultiFilterCtrl.value;
    if (!search) {
      this.filteredCompanyMulti.next(this.company.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCompanyMulti.next(
      this.company.filter(company => company.name.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterSBUMulti() {
    if (!this.sbu) {
      return;
    }
    let search = this.sbuMultiFilterCtrl.value;
    if (!search) {
      this.filteredSBUMulti.next(this.sbu.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredSBUMulti.next(
      this.sbu.filter(sbu => sbu.name.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterTypeMulti() {
    if (!this.type) {
      return;
    }
    let search = this.typeMultiFilterCtrl.value;
    if (!search) {
      this.filteredTypeMulti.next(this.type.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredTypeMulti.next(
      this.type.filter(type => type.name.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterSubTypeMulti() {
    if (!this.subtype) {
      return;
    }
    let search = this.subtypeFilterCtrl.value;
    if (!search) {
      this.filteredSubTypeMulti.next(this.subtype.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredSubTypeMulti.next(
      this.subtype.filter(subtype => subtype.name.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterFinancialYearMulti() {
    if (!this.financialyear) {
      return;
    }
    let search = this.financialyearMultiFilterCtrl.value;
    if (!search) {
      this.filteredFinancialYearMulti.next(this.financialyear.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredFinancialYearMulti.next(
      this.financialyear.filter(financialyear => financialyear.name.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterPeriodMulti() {
    if (!this.period) {
      return;
    }
    let search = this.periodMultiFilterCtrl.value;
    if (!search) {
      this.filteredPeriodMulti.next(this.period.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredPeriodMulti.next(
      this.period.filter(period => period.name.toLowerCase().indexOf(search) > -1)
    );
  }
  protected filterReportFilterMulti() {
    if (!this.reportfilter) {
      return;
    }
    let search = this.reportfilterMultiFilterCtrl.value;
    if (!search) {
      this.filteredReportFilterMulti.next(this.reportfilter.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredReportFilterMulti.next(
      this.reportfilter.filter(reportfilter => reportfilter.name.toLowerCase().indexOf(search) > -1)
    );
  }
  protected filterCurrencyMulti() {
    if (!this.currency) {
      return;
    }
    let search = this.currencyFilterCtrl.value;
    if (!search) {
      this.filteredCurrencyMulti.next(this.currency.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCurrencyMulti.next(
      this.currency.filter(currency => currency.name.toLowerCase().indexOf(search) > -1)
    );
  }

  

  ngOnInit(): void {
    this.SessionGroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.SessionRegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.SessionCompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.SessionUserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
     
    this.getSubType();
    this.getRegions();
    this.getCompanies();
    this.getSbu();
    this.getPlants();
    this.getCategory();
    this.getClass();
    this.getType();
    this.getCurrency();

    this.filteredAssetCategoryMulti.next(this.assetcategory.slice());
    this.assetcategoryMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAssetCategoryMulti();
      });

    this.filteredPlantsMulti.next(this.plants.slice());
    this.plantMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPlantsMulti();
      });

      this.filteredRegionMulti.next(this.region.slice());
      this.regionMultiFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterRegionMulti();
        });

        this.filteredAssetClassMulti.next(this.assetclass.slice());
        this.assetclassMultiFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterAssetClassMulti();
          });
    
        this.filteredCompanyMulti.next(this.company.slice());
        this.companyMultiFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterCompanyMulti();
          });
    
          this.filteredCurrencyMulti.next(this.currency.slice());
          this.currencyFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
              this.filterCurrencyMulti();
            });    
     
            this.filteredSBUMulti.next(this.sbu.slice());
    this.sbuMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterSBUMulti();
      });

    this.filteredTypeMulti.next(this.type.slice());
    this.typeMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterTypeMulti();
      });

      this.filteredSubTypeMulti.next(this.subtype.slice());
      this.subtypeFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterSubTypeMulti();
        });

        this.filteredFinancialYearMulti.next(this.financialyear.slice());
        this.financialyearMultiFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterFinancialYearMulti();
          });
    
        this.filteredPeriodMulti.next(this.period.slice());
        this.periodMultiFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterPeriodMulti();
          });
          
    
          this.filteredReportFilterMulti.next(this.reportfilter.slice());
          this.reportfilterMultiFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
              this.filterReportFilterMulti();
            });    
    



    this.AssetNoFilter.valueChanges.subscribe((AssetNoFilterValue) => {
      this.filteredValues['AssetNo'] = AssetNoFilterValue;
      this.dataSource.filter = this.filteredValues.AssetNo;
    });

    this.SubNoFilter.valueChanges.subscribe((SubNoFilterValue) => {
      this.filteredValues['SubNo'] = SubNoFilterValue;
      // this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.dataSource.filter = this.filteredValues.SubNo;
    });

    this.CapitalizationDateFilter.valueChanges.subscribe((CapitalizationDateFilterValue) => {
      this.filteredValues['CapitalizationDate'] = CapitalizationDateFilterValue;
      //this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.dataSource.filter = this.filteredValues.CapitalizationDate;
    });

    this.AssetClassFilter.valueChanges.subscribe((AssetClassFilterValue) => {
      this.filteredValues['AssetClass'] = AssetClassFilterValue;
      // this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.dataSource.filter = this.filteredValues.AssetClass;
    });

    this.AssetTypeFilter.valueChanges.subscribe((AssetTypeFilterValue) => {
      this.filteredValues['AssetType'] = AssetTypeFilterValue;
      // this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.dataSource.filter = this.filteredValues.AssetType;
    });

    this.AssetSubTypeFilter.valueChanges.subscribe((AssetSubTypeFilterValue) => {
      this.filteredValues['AssetSubType'] = AssetSubTypeFilterValue;
      //this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.dataSource.filter = this.filteredValues.AssetSubType;
    });

    this.UOMFilter.valueChanges.subscribe((UOMFilterValue) => {
      this.filteredValues['UOM'] = UOMFilterValue;
      //this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.dataSource.filter = this.filteredValues.UOM;
    });

    this.AssetNameFilter.valueChanges.subscribe((AssetNameFilterValue) => {
      this.filteredValues['AssetName'] = AssetNameFilterValue;
      // this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.dataSource.filter = this.filteredValues.AssetName;
    });

    this.AssetDescriptionFilter.valueChanges.subscribe((AssetDescriptionFilterValue) => {
      this.filteredValues['AssetDescription'] = AssetDescriptionFilterValue;
      // this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.dataSource.filter = this.filteredValues.AssetDescription;
    });

    this.QtyFilter.valueChanges.subscribe((QtyFilterValue) => {
      this.filteredValues['Qty'] = QtyFilterValue;
      // this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.dataSource.filter = this.filteredValues.Qty;
    });

    this.CostFilter.valueChanges.subscribe((CostFilterValue) => {
      this.filteredValues['Cost'] = CostFilterValue;
      // this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.dataSource.filter = this.filteredValues.Cost;
    });

    this.WDVFilter.valueChanges.subscribe((WDVFilterValue) => {
      this.filteredValues['WDV'] = WDVFilterValue;
      // this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.dataSource.filter = this.filteredValues.WDV;
    });

    this.EquipmentNOFilter.valueChanges.subscribe((EquipmentNOFilterValue) => {
      this.filteredValues['EquipmentNO'] = EquipmentNOFilterValue;
      //  this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.dataSource.filter = this.filteredValues.EquipmentNO;
    });

    this.AssetConditionFilter.valueChanges.subscribe((AssetConditionFilterValue) => {
      this.filteredValues['AssetCondition'] = AssetConditionFilterValue;
      //this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.dataSource.filter = this.filteredValues.AssetCondition;
    });

    this.AssetCriticalityFilter.valueChanges.subscribe((AssetCriticalityFilterValue) => {
      this.filteredValues['AssetCriticality'] = AssetCriticalityFilterValue;
      // this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.dataSource.filter = this.filteredValues.AssetCriticality;
    });

    this.dataSource.filterPredicate = this.customFilterPredicate();


    this.httpService.get('./assets/outbound_Json/TransferredReport.json').subscribe(
      data => {
        this.arrBirds = data as any[];	 // FILL THE ARRAY WITH DATA.
        //  console.log(this.arrBirds[1]);

        this.onChangeDataSource(this.arrBirds)

        for (let i = 0; i < this.arrBirds.length; i++) {
          this.tempdatasource.push(this.arrBirds[i].AssetNo);
        }

      },
    );


  }



  onChangeDataSource(value) {
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }


  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.setInitialValue();
  }

  EnableDisable(selectedvalue, index) {
    debugger;
    var idx = this.newdataSource.indexOf(selectedvalue.ID);
    if (idx > -1) {
      this.newdataSource.splice(idx, 1);
      this.getselectedData.splice(idx, 1);
    }
    else {
      this.newdataSource.push(selectedvalue.ID);
      this.getselectedData.push(selectedvalue);
    }
    debugger;
    this.arrlength = this.newdataSource.length;
  }
  isAllSelected() {
   
    this.newdataSource = [];

    if (this.isallchk == true) {

      for (let i = 0; i < this.arrBirds.length; i++) {
        this.newdataSource.push(this.arrBirds[i].ID);
      }

    }
    console.log(this.isAllSelected);
    this.arrlength = this.newdataSource.length;
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  viewSelected() {
    debugger;
    this.dataSource = new MatTableDataSource(this.getselectedData);
  }

  clearSelected() {
    this.newdataSource = [];
    this.getselectedData = [];

    debugger;
    this.arrlength = 0;
    this.onChangeDataSource(this.arrBirds);
  }


  masterToggle() {
    debugger;
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  customFilterPredicate() {
    const myFilterPredicate = (data: PeriodicElement, filter: string): boolean => {

      let searchString = JSON.parse(filter);
      return data.AssetNo.toString().trim().toLowerCase().indexOf(searchString.AssetNo.toLowerCase()) !== -1 &&
        data.SubNo.toString().trim().indexOf(searchString.SubNo) !== -1 &&
        data.CapitalizationDate.toString().trim().toLowerCase().indexOf(searchString.CapitalizationDate.toLowerCase()) !== -1 &&
        data.AssetClass.toString().trim().toLowerCase().indexOf(searchString.AssetClass.toLowerCase()) !== -1 &&
        data.AssetType.toString().trim().toLowerCase().indexOf(searchString.AssetType.toLowerCase()) !== -1 &&
        data.AssetSubType.toString().trim().toLowerCase().indexOf(searchString.AssetSubType.toLowerCase()) !== -1 &&
        data.UOM.toString().trim().toLowerCase().indexOf(searchString.UOM.toLowerCase()) !== -1 &&
        data.AssetName.toString().trim().toLowerCase().indexOf(searchString.AssetName.toLowerCase()) !== -1 &&
        data.AssetDescription.toString().trim().toLowerCase().indexOf(searchString.AssetDescription.toLowerCase()) !== -1 &&
        data.Qty.trim().indexOf(searchString.Qty) !== -1 &&
        data.Cost.trim().toLowerCase().indexOf(searchString.Cost) !== -1 &&
        data.WDV.toString().trim().indexOf(searchString.WDV) !== -1 &&
        data.EquipmentNO.toString().trim().indexOf(searchString.EquipmentNO) !== -1 &&
        data.AssetCondition.toString().trim().toLowerCase().indexOf(searchString.AssetCondition.toLowerCase()) !== -1 &&
        data.AssetCriticality.toString().trim().toLowerCase().indexOf(searchString.AssetCriticality.toLowerCase()) !== -1;
    }
    return myFilterPredicate;
  }

  showTable(){
    this.show=true;
  }

  opentablePopup(columnName) {
    debugger;
    const dialogconfigcom = new MatDialogConfig();
    dialogconfigcom.disableClose = true;
    dialogconfigcom.autoFocus = true;
    dialogconfigcom.width = "45%";
    dialogconfigcom.data = this.tempdatasource;
    const dialogRef = this.dialog.open(tablecolumnComponent, dialogconfigcom);

     
    dialogRef.afterClosed().subscribe((result) => {
      debugger;
      if(result.length > 0){


        for (let i = 0; i < this.arrBirds.length; i++) {
          var idx = result.indexOf(this.arrBirds[i].AssetNo);

          if (idx > -1) {
            this.selecteddatasource.push(this.arrBirds[i])
          }
        }
        this.dataSource = new MatTableDataSource(this.selecteddatasource);

      }
     
    });
  }

  openPopUp(data: any = {}) {
    return null;
    let title = 'Add new member';
    let dialogRef: MatDialogRef<any> = this.dialog.open(assetTabsComponent, {
      width: 'auto',
      maxHeight: '90vh',
      minHeight: '30vh',
      disableClose: true,
      data: { title: title, payload: data }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
      })
  }

  openEditGridDisplay() {
    debugger;
   let title = 'Edit Grid Display';
   let name = String;
     
   let payloadObject = {
     name: name,
   }
   let dialogRef: MatDialogRef<any> = this.dialog.open(DefaultFieldsComponent, {
     width: '60vw',
     height: 'auto',
     disableClose: true,
     data: { title: title, payload: this.displayedHeaders },
     //element:{ title: title, payload: data },
   })
   dialogRef.afterClosed()
     .subscribe(res => {
       if (!res) {
        console.log(res);
         return;
       }
     })

 }

    clearfilter(){
      if(this.appliedfilters.length>0){
     while(this.appliedfilters.length>0){
      this.appliedfilters.splice(this.appliedfilters.length-1);
      console.log(this.appliedfilters);
      }
    }
    }
  
  maxDate:any;
  maxDateFormat:any;
  FromDateValidation()
  {
  debugger;
    this.maxDateFormat=new Date( this.FromDate.value);

    this.maxDate=this.datepipe.transform(this.maxDateFormat, 'dd-MMM-yyyy');

  }

  ToDateValidation()
  {
  debugger;
    this.maxDateFormat=new Date( this.ToDate.value);

    this.maxDate=this.datepipe.transform(this.maxDateFormat, 'dd-MMM-yyyy');

  }

}
