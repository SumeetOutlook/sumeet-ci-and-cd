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
import * as headers from '../../../../assets/Headers.json';
import { LocalStoreService } from 'app/shared/services/local-store.service';
import { DatePipe } from '@angular/common';
import { tablecolumnComponent } from '../../reports/dialog/tablecolum-popup/tablecolum-popup.component';
import { assetTabsComponent } from '../../reports/dialog/asset-tabs/asset_tabs.component';
import { DefaultFieldsComponent } from '../../reports/dialog/field_dialog/field_dialog.component';
import { AssetService } from '../../services/AssetService';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { AllPathService } from 'app/components/services/AllPathServices';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

interface City {
  id: string;
  name: string;
}
interface Plant {
  id: string;
  name: string;
}
interface InventoryProjectId {
  id: string;
  name: string;
}
interface LocationType {
  id: string;
  name: string;
}
interface Currency {
  id: string;
  name: string;
}
interface InventoryNote {
  id: string;
  name: string;
}
interface Project {
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



const LOCATIONTYPE: LocationType[] = [
  { name: 'Company Location', id: 'A' },
  { name: 'Vendor Location', id: 'B' },
];
const INVENTORYNOTE: InventoryNote[] = [
  { name: 'Verified', id: 'A' },
  { name: 'Not Found', id: 'B' },
  { name: 'Pending Verification', id: 'C' },
];
const CURRENCY: Currency[] = [
  { name: 'INR', id: 'A' },
  { name: 'EGP', id: 'B' },
  { name: 'USD', id: 'C' },
];
const PROJECT: Project[] = [
  { name: 'Physical Verification', id: 'A' },
  { name: 'Self Certification', id: 'B' },
];

@Component({
  selector: 'app-inventory-status',
  templateUrl: './inventory-status.component.html',
  styleUrls: ['./inventory-status.component.scss']
})
export class InventoryStatusComponent implements OnInit {

  header: any;
  numRows: number;
  show: boolean = false;
  selectedValue: string;
  selectedassetclass: string;
  selectedProject;
  selectedassettype: string;
  selectedassetuom: string;
  IsDisabled: boolean = true;
  //arrBirds: Array<arrBirds> = [];
  public CreateProject_Data;
  public SelfCertification_Data = [];
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
  public appliedfilters: any[] = [];
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



  ///////////////////////////////////

  protected currency: Currency[] = CURRENCY;
  public currencyMultiCtrl: FormControl = new FormControl();
  public currencyFilterCtrl: FormControl = new FormControl();
  public filteredCurrencyMulti: ReplaySubject<Currency[]> = new ReplaySubject<Currency[]>(1);

  protected city: any;
  public cityMultiCtrl: FormControl = new FormControl();
  public cityMultiFilterCtrl: FormControl = new FormControl();
  public filteredCityMulti: ReplaySubject<City[]> = new ReplaySubject<City[]>(1);

  protected plants :any;
  public plantMultiCtrl: FormControl = new FormControl();
  public plantMultiFilterCtrl: FormControl = new FormControl();
  public filteredPlantsMulti: ReplaySubject<Plant[]> = new ReplaySubject<Plant[]>(1);

  protected inventoryprojectid: InventoryProjectId[] = [];
  public inventoryprojectidMultiCtrl: FormControl = new FormControl();
  public inventoryprojectidFilterCtrl: FormControl = new FormControl();
  public filteredinventoryprojectidMulti: ReplaySubject<InventoryProjectId[]> = new ReplaySubject<InventoryProjectId[]>(1);

  protected project: Project[] = PROJECT;
  public projectMultiCtrl: FormControl = new FormControl();
  public projectMultiFilterCtrl: FormControl = new FormControl();
  public filteredProjectMulti: ReplaySubject<Project[]> = new ReplaySubject<Project[]>(1);

  protected locationtype: LocationType[] = LOCATIONTYPE;
  public locationtypeMultiCtrl: FormControl = new FormControl();
  public locationtypeMultiFilterCtrl: FormControl = new FormControl();
  public filteredLocationTypeMulti: ReplaySubject<LocationType[]> = new ReplaySubject<LocationType[]>(1);

  protected inventorynote: InventoryNote[] = INVENTORYNOTE;
  public inventorynoteMultiCtrl: FormControl = new FormControl();
  public inventorynoteMultiFilterCtrl: FormControl = new FormControl();
  public filteredInventoryNoteMulti: ReplaySubject<InventoryNote[]> = new ReplaySubject<InventoryNote[]>(1);


  public FromDate: FormControl = new FormControl();
  public ToDate: FormControl = new FormControl();
  today = new Date();


  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  protected _onDestroy = new Subject<void>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedHeaders: any[] = [];

  displayedColumns: string[] = ["InventoryNo", "AssetNo", "SubNo", "AssetType", "AssetSubType", "CapitalizationDate",
    "Qty", "UOM", "Cost", "WDV", "AssetClass", "AssetName", "AssetDescription", "InventoryComment", "Photo", "InventoryNote",
    "EquipmentNumber", "AssetCondition", "AssetCriticality"];
  dataSource = new MatTableDataSource<any>();
  payloadData = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  tempdatasource: any[] = [];
  SessionGroupId: any;
  SessionRegionId: any;
  SessionCompanyId: any;
  SessionUserId: any;
  constructor(
    public dialog: MatDialog,
    private readonly assetService: AssetService,
    private httpService: HttpClient,
    public localService: LocalStoreService,
    public datepipe: DatePipe,
    public AllPathService: AllPathService,
    private storage: ManagerService,
    private jwtAuth : JwtAuthService)
    {
      this.header = this.jwtAuth.getHeaders()
      
      this.displayedHeaders  = [this.header.InventoryNumber, this.header.AssetNo, this.header.SAID,
        this.header.AssetType, this.header.AssetSubtype, this.header.AcquisitionDate, this.header.Quantity, this.header.UOM, this.header.AcquisitionCost,
        this.header.WDV, this.header.AssetClass, this.header.ADL2, this.header.ADL3, this.header.InventoryComment, this.header.Photo,
        this.header.InventoryNote, this.header.EquipmentNumber, this.header.AssetCondition, this.header.AssetCriticality];
    }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
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

  toggleSelectAllInventoryProjectId(selectAllValue: boolean) {
    this.filteredinventoryprojectidMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.inventoryprojectidMultiCtrl.patchValue(val);
        } else {
          this.inventoryprojectidMultiCtrl.patchValue([]);
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

  toggleSelectAllLocationType(selectAllValue: boolean) {
    this.filteredLocationTypeMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.locationtypeMultiCtrl.patchValue(val);
        } else {
          this.locationtypeMultiCtrl.patchValue([]);
        }
      });
  }

  toggleSelectAllInventoryNote(selectAllValue: boolean) {
    this.filteredInventoryNoteMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.inventorynoteMultiCtrl.patchValue(val);
        } else {
          this.inventorynoteMultiCtrl.patchValue([]);
        }
      });
  }


  protected setInitialValue() {

    this.filteredCityMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: City, b: City) => a && b && a.id === b.id;
      });

    this.filteredPlantsMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: Plant, b: Plant) => a && b && a.id === b.id;
      });
    this.filteredinventoryprojectidMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: InventoryProjectId, b: InventoryProjectId) => a && b && a.id === b.id;
      });
    this.filteredProjectMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: Project, b: Project) => a && b && a.id === b.id;
      });

    this.filteredLocationTypeMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: LocationType, b: LocationType) => a && b && a.id === b.id;
      });
    this.filteredCurrencyMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: Currency, b: Currency) => a && b && a.id === b.id;
      });
    this.filteredInventoryNoteMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: InventoryNote, b: InventoryNote) => a && b && a.id === b.id;
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
  protected filterInventoryProjectIdMulti() {
    if (!this.inventoryprojectid) {
      return;
    }
    let search = this.inventoryprojectidFilterCtrl.value;
    if (!search) {
      this.filteredinventoryprojectidMulti.next(this.inventoryprojectid.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredinventoryprojectidMulti.next(
      this.inventoryprojectid.filter(inventoryprojectid => inventoryprojectid.name.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterLocationTypeMulti() {
    if (!this.locationtype) {
      return;
    }
    let search = this.locationtypeMultiFilterCtrl.value;
    if (!search) {
      this.filteredLocationTypeMulti.next(this.locationtype.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredLocationTypeMulti.next(
      this.locationtype.filter(locationtype => locationtype.name.toLowerCase().indexOf(search) > -1)
    );
  }


  protected filterProjectMulti() {
    if (!this.project) {
      return;
    }
    let search = this.projectMultiFilterCtrl.value;
    if (!search) {
      this.filteredProjectMulti.next(this.project.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredProjectMulti.next(
      this.project.filter(project => project.name.toLowerCase().indexOf(search) > -1)
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

  protected filterInventoryNoteMulti() {
    if (!this.inventorynote) {
      return;
    }
    let search = this.inventorynoteMultiFilterCtrl.value;
    if (!search) {
      this.filteredInventoryNoteMulti.next(this.inventorynote.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredInventoryNoteMulti.next(
      this.inventorynote.filter(inventorynote => inventorynote.name.toLowerCase().indexOf(search) > -1)
    );
  }

  export() {
    const assetDetails = {
      CompanyId: this.SessionUserId,
      LocationIdList: [],
      IsForManageGroup: false,
      LocationList: '',
      SbuList: [],
      CategoryIdList: [],
      AssetsClassList: [],
      typeOfAssetList: [],
      subTypeOfAssetList: [],
      TagginStatusList: [],
      ProjectIdList: [],
      AssetStage: '',
      ProjectType: '',
      AssetStatus: '',
      columnName: '',
      SearchText: '',
      IsExport: true,
    };
    this.assetService.showData(assetDetails).subscribe(response => {
      this.AllPathService.DownloadExportFile(response);
    });
  }

  displayInventoryData() {
    const assetDetails = {
      CompanyId: this.SessionUserId,
      LocationIdList: [],
      IsForManageGroup: false,
      LocationList: '',
      SbuList: [],
      CategoryIdList: [],
      AssetsClassList: [],
      typeOfAssetList: [],
      subTypeOfAssetList: [],
      TagginStatusList: [],
      ProjectIdList: [],
      AssetStage: '',
      ProjectType: '',
      AssetStatus: '',
      columnName: '',
      SearchText: '',
      IsExport: false,
    };
    this.assetService.showData(assetDetails).subscribe(response => {
      console.log(response);
    });
  }


  ngOnInit(): void {
    this.SessionGroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.SessionRegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.SessionCompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.SessionUserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);

    
    this.filteredinventoryprojectidMulti.next(this.inventoryprojectid.slice());
    this.inventoryprojectidFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterInventoryProjectIdMulti();
      });

    this.filteredProjectMulti.next(this.project.slice());
    this.projectMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterProjectMulti();
      });

    this.filteredLocationTypeMulti.next(this.locationtype.slice());
    this.locationtypeMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterLocationTypeMulti();
      });

    this.filteredCurrencyMulti.next(this.currency.slice());
    this.currencyFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCurrencyMulti();
      });

    this.filteredInventoryNoteMulti.next(this.inventorynote.slice());
    this.inventorynoteMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterInventoryNoteMulti();
      });

    this.AssetNoFilter.valueChanges.subscribe((AssetNoFilterValue) => {
      this.filteredValues['AssetNo'] = AssetNoFilterValue;
      this.dataSource.filter = this.filteredValues.AssetNo;
    });    
   
  }

  

  onChangeDataSource(value) {
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  locationId = 1;
  taskId = 30;
  taskName = 'Update Inventory Status';

  selected(event) {
    console.log(event);
    if (event.name == "Physical Verification") {
      this.assetService.getSbuListInventory(this.SessionCompanyId).subscribe(response => {
        this.city = response;
      });

      this.assetService.getProjectIdVerification(this.SessionCompanyId, this.locationId, this.SessionUserId, this.taskId, this.taskName).subscribe(response => {
        console.log('projectId', response);
        this.inventoryprojectid = response;
      });
      this.tempdatasource = [];
      this.selectedProject = event.name;
      this.onChangeDataSource(this.CreateProject_Data);
      for (let i = 0; i < this.CreateProject_Data.length; i++) {
        this.tempdatasource.push(this.CreateProject_Data[i].AssetNo);
      }

    }

    if (event.name == "Self Certification") {
      this.assetService.getInventorySbuForCertification(this.SessionCompanyId).subscribe(response => {
        console.log('sbu list', response);
        this.city = response;
      });
      this.assetService.getProjectIdCertification(this.SessionCompanyId, this.locationId, this.SessionUserId, this.taskId, this.taskName).subscribe(response => {
        console.log('projectId', response);
        this.inventoryprojectid = response;
      });

      this.tempdatasource = [];
      this.selectedProject = event.name;
      this.onChangeDataSource(this.SelfCertification_Data);
      for (let i = 0; i < this.SelfCertification_Data.length; i++) {
        this.tempdatasource.push(this.SelfCertification_Data[i].AssetNo);
      }
      //  this.paginator._intl.itemsPerPageLabel = 'Records per page';
    }
  }

  selected1(event) {
    debugger;
    if (event.name == "Vendor Location") {
      this.inventorynoteMultiCtrl.disable();
    }
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
      for (let i = 0; i < this.CreateProject_Data.length; i++) {
        this.newdataSource.push(this.CreateProject_Data[i].ID);
      }
    }
    this.arrlength = this.newdataSource.length;
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  viewSelected() {
    this.dataSource = new MatTableDataSource(this.getselectedData);
  }

  clearSelected() {
    this.newdataSource = [];
    this.getselectedData = [];
    this.arrlength = 0;
    this.onChangeDataSource(this.CreateProject_Data);
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

  showTable() {
    this.show = true;
  }

  opentablePopup(columnName, tableData) {
    debugger;
    const dialogconfigcom = new MatDialogConfig();
    dialogconfigcom.disableClose = true;
    dialogconfigcom.autoFocus = true;
    dialogconfigcom.width = "45%";
    dialogconfigcom.data = this.tempdatasource;
    const dialogRef = this.dialog.open(tablecolumnComponent, dialogconfigcom);


    dialogRef.afterClosed().subscribe((result) => {
      debugger;
      if (result.length > 0) {


        for (let i = 0; i < tableData.length; i++) {
          var idx = result.indexOf(tableData[i].city);
          console.log(idx);
          if (idx > -1) {
            this.selecteddatasource.push(tableData[i])
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
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          console.log(res);
          return;
        }
      })
  }

  clearfilter() {
    if (this.appliedfilters.length > 0) {
      while (this.appliedfilters.length > 0) {
        this.appliedfilters.splice(this.appliedfilters.length - 1);
        console.log(this.appliedfilters);
      }
    }
  }
 
 

}
