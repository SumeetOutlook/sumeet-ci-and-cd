import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { CompanyLocationService } from '../../services/CompanyLocationService';
// import { ReplaySubject, Subject } from 'rxjs';
import { UserMappingService } from '../../services/UserMappingService';
import { CompanyBlockService } from '../../services/CompanyBlockService';
import { GroupService } from '../../services/GroupService';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import * as headers from '../../../../assets/Headers.json';
import { HttpClient } from '@angular/common/http';
import { LocalStoreService } from 'app/shared/services/local-store.service';
import { assetTabsComponent } from '../../partialView/assetDetails/asset_tabs.component';
import {AssetService} from '../../services/AssetService';
import * as menuheaders from '../../../../assets/MenuHeaders.json'
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { ReconciliationService } from '../../services/ReconciliationService';
import { CompanyService } from '../../services/CompanyService';
import { ReportService } from '../../services/ReportService';
interface City {
  id: string;
  name: string;
}
interface Currency {
  id: string;
  name: string;
}
interface TransferTo {
  id: string;
  name: string;
}
interface TransferId {
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


const CITY: City[] = [
  { name: 'Pune', id: 'A' },
  { name: 'Eshkashem', id: 'B' },
  { name: 'Chandigarh', id: 'C' },
  { name: 'Akalkot', id: 'D' },
 ];
const CURRENCY: Currency[] = [
  { name: 'INR', id: 'L' },
  { name: 'EGP', id: 'F' },
  { name: 'USD', id: 'E' },
];
const TRANSFERTO: TransferTo[] = [
  { name: 'Belgaum-ADMIN', id: 'D' },
  { name: 'Belgaum-IT', id: 'H' },
  { name: 'Belgaum-Others', id: 'L' },
  { name: 'Chakan-ADMIN', id: 'D' },
  { name: 'Chakan-IT', id: 'H' },
  { name: 'Chakan-Others', id: 'L' },
  { name: 'Goa-ADMIN', id: 'D' },
  { name: 'Goa-IT', id: 'H' },
  { name: 'Goa-Others', id: 'L' },
  { name: 'Hubli-ADMIN', id: 'D' },
  { name: 'Hubli-IT', id: 'H' },
  { name: 'Hubli-Others', id: 'L' },
  { name: 'Kolhapur-ADMIN', id: 'D' },
  { name: 'Kolhapur-IT', id: 'H' },
  { name: 'Kolhapur-Others', id: 'L' },
  { name: 'Major', id: 'D' },
  { name: 'Mulshi', id: 'H' },
  { name: 'Mumbai-ADMIN', id: 'L' },
  { name: 'Mumbai-IT', id: 'D' },
  { name: 'Mumbai-Others', id: 'H' },
  { name: 'PPC-Chennai', id: 'L' },
  { name: 'PPH-Haridwar', id: 'D' },
  { name: 'Pune-ADMIN', id: 'H' },
  { name: 'Pune-IT', id: 'L' },
  { name: 'Pune-Others', id: 'L' },
];
const TRANSFERID: TransferId[] = [
  { name: 'TR_202012234', id: 'A' },
];



@Component({
  selector: 'app-view_transit_assets',
  templateUrl: './view_transit_assets.component.html',
  styleUrls: ['./view_transit_assets.component.scss']
})
export class ViewTransitAssetsComponent implements OnInit, AfterViewInit, OnDestroy {
  Headers: any = (headers as any).default;
  numRows: number;
  selectedValue: string;
  selectedassetclass: string;
  selectedassettype: string;
  selectedassetuom: string;
  IsDisabled: boolean = true;

  setflag: boolean=false;
  //arrBirds: Array<arrBirds> = [];
  public arrBirds: any[];
  private isButtonVisible = false;
  public getSeletedData = [];
  GroupId: any;
  CompanyId
  UserId: any;
  RegionId: any;
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
  checkoutInitiationLocations: any;
  ListOfLoc1: any[] = [];
  menuheader :any =(menuheaders as any).default
  public grpdata;
  public transfertypeMultiCtrl: any;
  transferTypelst: any[] = [];
  result: any[] = [];
  TRANSFERTYPE: any[] = [];
  transfertype: any[] = [];
  // CompanyId: any;
  // GroupId: any;
  // UserId: any;
  // RegionId: any;
  IsCompanyAdmin: any = 1;
  IslayerDisplay: any;
  layerid: any;
  Layertext: any;
  HeaderLayerText: any;

  public transferIdMultiCtrl: any;
  public transferIdFilterCtrl: FormControl = new FormControl();
  public filteredtransferIdMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public cityMultiCtrl: any;
  public cityMultiFilterCtrl: FormControl = new FormControl();
  public filteredCityMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public plantMultiCtrl: any;
  public plantMultiFilterCtrl: FormControl = new FormControl();
  public filteredPlantsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public categoryMultiCtrl: any;
  public categoryFilterCtrl: FormControl = new FormControl();
  public filteredcategoryMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public assetclassMultiCtrl: any;
  public assetclassFilterCtrl: FormControl = new FormControl();
  public filteredAssetClassMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  // public transfertypeMultiCtrl: any;
  public transfertypeFilterCtrl: FormControl = new FormControl();
  public filteredTransferTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public approvalLevelMultiCtrl: any;
  public approvalLevelFilterCtrl: FormControl = new FormControl();
  public filteredapprovalLevelMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public assettypeMultiCtrl: any;
  public assettypeFilterCtrl: FormControl = new FormControl();
  public filteredAssetTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public assetsubtypeMultiCtrl: any;
  public assetsubtypeFilterCtrl: FormControl = new FormControl();
  public filteredAssetSubTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
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



  ///////////////////////////////////
  ListOfSBU: any;
  ListOfLoc: any;
  protected city: City[] = CITY;
  // public cityMultiCtrl: FormControl = new FormControl();
  // public cityMultiFilterCtrl: FormControl = new FormControl();
  // public filteredCityMulti: ReplaySubject<City[]> = new ReplaySubject<City[]>(1);

  protected currency: Currency[] = CURRENCY;
  public currencyMultiCtrl: FormControl = new FormControl();
  public currencyFilterCtrl: FormControl = new FormControl();
  public filteredCurrencyMulti: ReplaySubject<Currency[]> = new ReplaySubject<Currency[]>(1);

  protected transferto: TransferTo[] = TRANSFERTO;
  public transfertoMultiCtrl: FormControl = new FormControl();
  public transfertoFilterCtrl: FormControl = new FormControl();
  public filteredTransferToMulti: ReplaySubject<TransferTo[]> = new ReplaySubject<TransferTo[]>(1);

  protected transferid: TransferId[] = TRANSFERID;
  public transferidMultiCtrl: FormControl = new FormControl();
  public transferidFilterCtrl: FormControl = new FormControl();
  public filteredTransferidMulti: ReplaySubject<TransferId[]> = new ReplaySubject<TransferId[]>(1);
  sbutosbunotallowed: any;

  // protected banks: Bank[] = BANKS;
  // public bankMultiCtrl: FormControl = new FormControl();
  // public bankMultiFilterCtrl: FormControl = new FormControl();
  // public filteredBanksMulti: ReplaySubject<Bank[]> = new ReplaySubject<Bank[]>(1);

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  protected _onDestroy = new Subject<void>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  //  city: City[] = [
  //   {value: 'Orlando-0', viewValue: 'Orlando'},
  //   {value: 'Florida-1', viewValue: 'Florida'},
  //   {value: 'Nashik-2', viewValue: 'Nashik'},
  //   {value: 'pune-3', viewValue: 'Pune'}
  // ];


  // assetclass: AssetClass[] = [
  //   {value: 'Orlando-0', viewValue: 'Orlando'},
  //   {value: 'Florida-1', viewValue: 'Florida'},
  //   {value: 'Nashik-2', viewValue: 'Nashik'},
  //   {value: 'pune-3', viewValue: 'Pune'}
  // ];
  // assettype: AssetType[] = [
  //   {value: 'Orlando-0', viewValue: 'Orlando'},
  //   {value: 'Florida-1', viewValue: 'Florida'},
  //   {value: 'Nashik-2', viewValue: 'Nashik'},
  //   {value: 'pune-3', viewValue: 'Pune'}
  // ];
  // uom: UOM[] = [
  //   {value: 'Orlando-0', viewValue: 'Orlando'},
  //   {value: 'Florida-1', viewValue: 'Florida'},
  //   {value: 'Nashik-2', viewValue: 'Nashik'},
  //   {value: 'pune-3', viewValue: 'Pune'}
  // ];
  displayedHeaders = [this.Headers.InventoryNumber, this.Headers.AssetNo, this.Headers.SAID, this.Headers.AcquisitionDate,
    this.Headers.AssetClass, this.Headers.ADL1, this.Headers.ADL2, this.Headers.ADL3,this.Headers.ContractVendor,this.Headers.Quantity,
    this.Headers.CostCenter,this.Headers.Room,this.Headers.StorageLocation,this.Headers.UserEmail,this.Headers.User,this.Headers.AssetClassOwner,
    this.Headers.Cost, this.Headers.WDV, this.Headers.EquipmentNumber, this.Headers.AssetCondition,this.Headers.AssetCriticality, this.Headers.InventoryIndicator,
    this.Headers.Stage,this.Headers.VendorDetails,this.Headers.VendorLocation,this.Headers.VendorSentDate,this.Headers.CheckedOutAsset,this.Headers.InventoryNote,
    this.Headers.LabelQuality,this.Headers.WDVDate,this.Headers.TransferType,this.Headers.SerialNo,this.Headers.UOM,this.Headers.ITSerialNo,this.Headers.TransferId,
    this.Headers.AssetType,this.Headers.SubTypeOfAsset,this.Headers.Document,this.Headers.PreviousInventoryInfo,this.Headers.SourceLocation,this.Headers.TransferTo,
    this.Headers.ApprovedOn,this.Headers.DaysInTransit,this.Headers.InventoryStatus,this.Headers.TransferStatus,this.Headers.RetirementStatus,this.Headers.AllocationStatus,
    this.Headers.SBU];
    displayedColumns = ["InventoryNo","AssetNo","SubNo","CapitalizationDate","AssetClass","AssetClassShortName","AssetName","AssetDescription",
    "Cost","WDV","EquipmentNO","AssetCondition","AssetCriticality","TransferFrom","TransferTo","ApprovedOn","DaysInTransit"];

  dataSource = new MatTableDataSource<any>();
  payloadData = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  tempdatasource: any[] = [];

  constructor(public dialog: MatDialog, private httpService: HttpClient, public localService: LocalStoreService,private storage: ManagerService,  public rs: ReconciliationService,    public ums: UserMappingService,  public cls: CompanyLocationService,public gs: GroupService,public cs: CompanyService,public res: ReportService) {

  }
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  // toggleSelectAll(selectAllValue: boolean) {
  //   this.filteredBanksMulti.pipe(take(1), takeUntil(this._onDestroy))
  //     .subscribe(val => {
  //       if (selectAllValue) {
  //         this.bankMultiCtrl.patchValue(val);
  //       } else {
  //         this.bankMultiCtrl.patchValue([]);
  //       }
  //     });
  // }
  getCurrency(){
    
    this.cs.GetCurencyRateForConversion(this.GroupId,this.CompanyId).subscribe(data=>{      
      console.log(JSON.parse(data));
    })
  }
getTransactionId(){
  
  var locationId = !!this.plantMultiCtrl ? this.plantMultiCtrl.LocationId : 0;
  var TaskId = 0;
this.rs.GetTransactionIdsForTransitReport(this.CompanyId,locationId,this.UserId,TaskId).subscribe(data=>{
  console.log('Transaction Id',data);
  
})
}
getReport(){
  var data
  console.log('get rewport');
  data={
    ColumnName: "",
    CurrencyConversionRate: "1",
    GroupId: 2,
    IsBaseSelected: true,
    ReportName: "InTransiteAsets",
    RetirementAssetId: "",
    TransferAssetId: "",
    UserId: 5,
    blockid: "All",
    companyId: 2,
    isExport: false,
    isPageLoad: true,
    layerId: 3,
    layertext: "",
    locationId: 0,
    pageNumber: 1,
    pageSize: 50,
    searchtext: "",
    selectedBlock: 0,
    selectedCurrency: "INR",
    selectedStatus: 0

  }
  console.log(data)
  
 this.res.GetAssetRegisterReportBySp(data).subscribe(results=>{
   debugger;
   console.log('rew',results)
 })
}
GetLocationById() {
  debugger;
  // console.log(this.transfertypeMultiCtrl);
  let url1 = this.cls.GetLocationListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId , 40);
  
  forkJoin([url1]).subscribe(results => {
    debugger;
    
    if (!!results[0]) {
      var IsCompanyAdmin = 1;//this.IsCompanyAdmin;//!$rootScope.globals.currentUser.IsCompanyAdmin ? 0 : $rootScope.globals.currentUser.IsCompanyAdmin;
      var checkoutInitiationLocations = this.checkoutInitiationLocations;
      this.ListOfLoc = JSON.parse(results[0]) ;
      var list = [];
      var listOfLoc = [];
      if (IsCompanyAdmin == 0 && checkoutInitiationLocations != '') {
        list = checkoutInitiationLocations.split(",");
        if (list.length === 1 && list[0] === 0) {
        }
        else {
          for (var s = 0; s < this.ListOfLoc.length; s++) {
            for (var j = 0; j < list.length; j++) {
              if (this.ListOfLoc[s].LocationId == list[j]) {
                listOfLoc.push(this.ListOfLoc[s]);
              }
            }
          }
          debugger;
          this.ListOfLoc = listOfLoc;
          this.ListOfLoc1 = this.ListOfLoc;
          this.ListOfSBU = this.ListOfLoc1;
          // console.log('city: ',this.ListOfSBU);
          // console.log('transfer to: ',this.ListOfLoc)
        }
      }
      else if (IsCompanyAdmin === 1) {
        this.ListOfLoc1 = this.ListOfLoc;
     
        this.ListOfSBU = this.ListOfLoc1;
        debugger
        
      }
    }    
    this.getFilterCityType();
    this.getFilterPlantType();
    // console.log('city: ',this.ListOfSBU);
    // console.log('transfer to: ',this.ListOfLoc)
  })
  // console.log('city: ',this.ListOfSBU);
  // console.log('transfer to: ',this.ListOfLoc)
}
getFilterCityType() {
  this.filteredCityMulti.next(this.ListOfSBU.slice());
  this.cityMultiFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterCityMulti();
    });
}
getFilterPlantType() {
  this.filteredPlantsMulti.next(this.ListOfLoc1.slice());
  this.plantMultiFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterPlantsMulti();
    });
}
protected filterPlantsMulti() {
  if (!this.ListOfLoc1) {
    return;
  }
  let search = this.plantMultiFilterCtrl.value;
  if (!search) {
    this.filteredPlantsMulti.next(this.ListOfLoc1.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredPlantsMulti.next(
    this.ListOfLoc1.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1)
  );
}
  toggleSelectAllCity(selectAllValue: boolean) {
    this.filteredCityMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.cityMultiCtrl.patchValue(val);
        } else {
          this.cityMultiCtrl.patchValue([]);
        }
      });
  }

  toggleSelectAllcurrency(selectAllValue: boolean) {
    this.filteredCurrencyMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.currencyMultiCtrl.patchValue(val);
        } else {
          this.currencyMultiCtrl.patchValue([]);
        }
      });
  }
  toggleSelectAlltransferto(selectAllValue: boolean) {
    this.filteredTransferToMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.transfertoMultiCtrl.patchValue(val);
        } else {
          this.transfertoMultiCtrl.patchValue([]);
        }
      });
  }
  toggleSelectAlltransferid(selectAllValue: boolean) {
    this.filteredTransferidMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.transferidMultiCtrl.patchValue(val);
        } else {
          this.transferidMultiCtrl.patchValue([]);
        }
      });
  }

  protected setInitialValue() {

    this.filteredCityMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: City, b: City) => a && b && a.id === b.id;
      });
    this.filteredCurrencyMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: Currency, b: Currency) => a && b && a.id === b.id;
      });
    this.filteredTransferToMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: TransferTo, b: TransferTo) => a && b && a.id === b.id;
      });
    this.filteredTransferidMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: TransferId, b: TransferId) => a && b && a.id === b.id;
      });

  }
  protected filterCityMulti() {
    if (!this.city) {
      return;
    }
    let search = this.cityMultiFilterCtrl.value;
    if (!search) {
      this.filteredCityMulti.next(this.city.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCityMulti.next(
      this.city.filter(city => city.name.toLowerCase().indexOf(search) > -1)
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
  protected filterTransfertoMulti() {
    if (!this.transferto) {
      return;
    }
    let search = this.transfertoFilterCtrl.value;
    if (!search) {
      this.filteredTransferToMulti.next(this.transferto.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredTransferToMulti.next(
      this.transferto.filter(transferto => transferto.name.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterTransferIdMulti() {
    if (!this.transferid) {
      return;
    }
    let search = this.transferidFilterCtrl.value;
    if (!search) {
      this.filteredTransferidMulti.next(this.transferid.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredTransferidMulti.next(
      this.transferid.filter(transferid => transferid.name.toLowerCase().indexOf(search) > -1)
    );
  }

  // protected setInitialValue() {
  //   this.filteredBanksMulti
  //     .pipe(take(1), takeUntil(this._onDestroy))
  //     .subscribe(() => {
  //       this.multiSelect.compareWith = (a: Bank, b: Bank) => a && b && a.id === b.id;
  //     });
  // }
  // protected filterBanksMulti() {
  //   if (!this.banks) {
  //     return;
  //   }
  //   let search = this.bankMultiFilterCtrl.value;
  //   if (!search) {
  //     this.filteredBanksMulti.next(this.banks.slice());
  //     return;
  //   } else {
  //     search = search.toLowerCase();
  //   }
  //   this.filteredBanksMulti.next(
  //     this.banks.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
  //   );
  // }


  ngOnInit(): void {
    // this.filteredBanksMulti.next(this.banks.slice());
    // this.bankMultiFilterCtrl.valueChanges
    //   .pipe(takeUntil(this._onDestroy))
    //   .subscribe(() => {
    //     this.filterBanksMulti();
    //   });
  
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID),
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID),
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID),
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID),

    this.paginator._intl.itemsPerPageLabel = 'Records per page';
    
    this.GetLocationById();

    //this.getTransactionId();
    
    this.getCurrency();

    
    



    console.log('city:',this.ListOfSBU)
    console.log('Transfer to:',this.ListOfLoc)
    this.filteredCityMulti.next(this.city.slice());
    this.cityMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCityMulti();
      });

    this.filteredCurrencyMulti.next(this.currency.slice());
    this.currencyFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCurrencyMulti();
      });

    this.filteredTransferToMulti.next(this.transferto.slice());
    this.transfertoFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterTransfertoMulti();
      });


    this.filteredTransferidMulti.next(this.transferid.slice());
    this.transferidFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterTransferIdMulti();
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


    this.httpService.get('./assets/InTransiteAsets20_23122020172950542.json').subscribe(
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


  // const ELEMENT_DATA: PeriodicElement[] =this.arrBirds;


  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.setInitialValue();
  }
  
  // EnableDisable(){
  //   debugger;
  //   this.IsDisabled =!this.IsDisabled;

  // }
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
    // if(this.arr[index]==="NO"){
    // this.arr[index]="yes";
    // this.IsDisabled =!this.IsDisabled;
    // this.arrlength=this.arrlength+1;
    // this.newdataSource.push(this.arrBirds[index]);
    // }
    // else if(this.arr[index]==="yes"){
    //   this.arr[index]="NO";
    //   this.IsDisabled =!this.IsDisabled;
    //   this.arrlength=this.arrlength-1;
    //   this.newdataSource.slice(index,1);
    //   }
    //   console.log(this.newdataSource[index]);
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

  opentablePopup(columnName) {
    debugger;
    
  }

  // toggleDisplayDiv() {
  //   this.isShowDiv = this.isShowDiv;
  // }

  openPopUp(data: any = {}) {
    debugger;
    return null;
    let title = 'Add new member';    
    const dialogRef = this.dialog.open(assetTabsComponent, {
      width: 'auto',
      disableClose: true,
      data: { title: title, payload: data.PreFarId }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {         
          return;
        }
      })
  }

  openEditGridDisplay() {
   

 }

 openFilter_PopUp() {
  
}

clearfilter(){
  if(this.appliedfilters.length>0){
 while(this.appliedfilters.length>0){
  this.appliedfilters.splice(this.appliedfilters.length-1);
  console.log(this.appliedfilters);
  }
}
}
}
