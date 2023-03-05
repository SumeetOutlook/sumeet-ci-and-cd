import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormArray, FormGroup, Validators,FormBuilder } from '@angular/forms';
import { AddprinttagDialogComponent } from "./Addprinttag/Addprinttag-dialog.component";
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import * as headers from '../../../../assets/Headers.json';
import { DefineseriesService } from '../../services/DefineseriesService';
import { LocationService } from 'app/components/services/LocationService';
import { CompanyBlockService } from 'app/components/services/CompanyBlockService';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/UserService';
import * as resource from '../../../../assets/Resource.json';
import * as header from '../../../../assets/Headers.json';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from 'app/components/services/ReportService';
import { InventorySeriesDialogComponent } from './Inventoryseries/Inventoryseries-dialog.component';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { AllPathService } from 'app/components/services/AllPathServices';

import * as menuheaders from '../../../../assets/MenuHeaders.json'

import { ReconciliationService } from '../../services/ReconciliationService';
import { CompanyLocationService } from '../../services/CompanyLocationService';
import { UserMappingService } from '../../services/UserMappingService';
import { GroupService } from '../../services/GroupService';

export interface PeriodicElement {
  LabelHeader: string;
  LabelFooter: string;
  Style: string;
  LabelSize: string;
  AssetNo: string;
  AssetClass: string;
  AssetClassName: string;
  AssetName: string;

}

export interface labelsize {
  name: string;
  id: string;
}

interface SBU {
  id: string;
  name: string;
}

interface Inventory {
  id: string;
  name: string;
}

/*const LABELMATERIAL: labelsize[] = [
  // { id: '1', name: 'All' },
  { id: '2', name: 'Paper' },
  { id: '3', name: 'Aluminium' },
  { id: '4', name: 'Steel' },
  { id: '5', name: 'Vinyl' },
  { id: '6', name: 'Plastic' },


]; */




/*const InventoryNote: Inventory[] = [

  { id: '1', name: 'Paper' },
  { id: '2', name: 'Aluminium' },
  { id: '3', name: 'Steel' },
  { id: '4', name: 'Vinyl' },
  { id: '5', name: 'Plastic' },

]; */

const ELEMENT_DATA: PeriodicElement[] = [
  { LabelHeader: 'Assetcues', LabelFooter: 'Do Not Temper', Style: '1D', LabelSize: 'xs(14x15)', AssetNo: 'No', AssetClass: 'No', AssetClassName: 'Yes', AssetName: 'No' },
  { LabelHeader: 'Assetcues', LabelFooter: 'Temper', Style: '2D', LabelSize: '75x45', AssetNo: 'No', AssetClass: 'No', AssetClassName: 'Yes', AssetName: 'No' }
  // {LabelHeader:'Assetrak', LabelFooter: 'Temper',Style:'1D',LabelSize:'xs(14x15)',AssetNo:'No',AssetClass:'No' ,AssetClassName:'Yes',AssetName: 'No'},
  // {LabelHeader:'Assetcues', LabelFooter: 'Do Not Temper',Style:'1D',LabelSize:'xs(14x15)',AssetNo:'No',AssetClass:'No' ,AssetClassName:'Yes',AssetName: 'No'},
  // {LabelHeader:'Assetrak', LabelFooter: 'Do Not Temper',Style:'2D',LabelSize:'xs(14x15)',AssetNo:'No',AssetClass:'No' ,AssetClassName:'Yes',AssetName: 'No'},


];



@Component({
  selector: 'app-print-tag',
  templateUrl: './print-tag.component.html',
  styleUrls: ['./print-tag.component.scss']
})

export class PrintTagComponent implements OnInit {
  menuheader: any = (menuheaders as any).default
  Headers: any ;
  message: any = (resource as any).default;
  selectedRow: boolean = false;
  header: any;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  protected _onDestroy = new Subject<void>();
  @ViewChild('table', { static: true }) table: any;
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  ReportForm: FormGroup;
  // public city: City[] = [];
  //public labelsizename: labelsize[] = LABELMATERIAL;
  public assetGroupCtrl: FormControl = new FormControl();
  public assetGroupfiltrCtrl: FormControl = new FormControl();
  public filteredAssetClassMulti: ReplaySubject<labelsize[]> = new ReplaySubject<labelsize[]>(1);

  public SBUMultiFilterCtrl: FormControl = new FormControl();
  public SBUMultiCtrl: FormControl = new FormControl();
  public filteredSBUMulti: ReplaySubject<SBU[]> = new ReplaySubject<SBU[]>(1);
  public filtered: ReplaySubject<SBU[]> = new ReplaySubject<SBU[]>(1);
  public filteredSBU: ReplaySubject<SBU[]> = new ReplaySubject<SBU[]>(1);

  public cityMultiCtrl: any;
  public cityMultiFilterCtrl: FormControl = new FormControl();
  public filteredCityMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public categoryMultiCtrl: any;
  public categoryFilterCtrl: FormControl = new FormControl();
  public filteredcategoryMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  // public plants: Plant[] = [];
  public plantMultiCtrl1: any;
  public plantMultiCtrl: any;
  public plantMultiFilterCtrl: FormControl = new FormControl();
  public filteredPlantsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public CategoryCtrl: any;
  public CategoryFilter: FormControl = new FormControl();
  public filteredCategory: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  protected inventory: Inventory[] ;
  public inventoryMulti: any;
  public inventoryMultiCtrl: FormControl = new FormControl();
  public InventoryFilterCtrl: FormControl = new FormControl();
  public inventorynote: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  displayedHeaders:any = []
  displayedColumns: string[] = ['Plant', 'Asset Category', 'No of labels', 'Prefix', 'Start Number', 'End Number', 'Label Size', 'Label Material', 'Used Count','Remark', 'print File']
  //'Record', 'Print Count', 'Used Count', 'Status'];

  layerid;
  SBUList: any;
  PlantList: any;
  SBUName: any;
  CompanyId: any;
  GroupId: any;
  UserId: any;
  RegionId: any;
  Global: boolean = true;
  Global1: boolean = false;
  public assetcategory: any[] = [];
  SelectedPlantItems: any[] = [];
  Location: any[] = [];
  datasource: any;
  printlist: any[] = [];
  SelectedCategatoryItems: any[] = [];
  SelectedCategatory1Items: any;
  SelectedchangeplantItems: any[] = [];
  SelectedMaterialItems: any;
  SelectedSBUItems: any[] = [];
  Selectedvalueforglobal = "Global";
  selectedvalue: any;
  // SelectCurrency1 = "All";
  IsExport: boolean = false;
  IslayerDisplay: any;
  Layertext: any;
  HeaderLayerText: any;
  sbutosbunotallowed: any;
  displayTable: boolean = false;
  displaybtn: boolean = false;
  AssetNoFilter = new FormControl();
  private isButtonVisible = false;
  Labelmaterial: any[] = [];

  dataSource = new MatTableDataSource<any>();
  constructor(
    public dialog: MatDialog,
    private defineseriesservies: DefineseriesService,
    public locationservice: LocationService,
    private storage: ManagerService,
    private jwtAuth: JwtAuthService,
    public cbs: CompanyBlockService,
    private router: Router,
    public alertService: MessageAlertService,
    public us: UserService,
    public toastr: ToastrService,
    public reportService: ReportService,
    private loader: AppLoaderService,
    public AllPathService: AllPathService,
    public rs: ReconciliationService,
    public cls: CompanyLocationService,
    public ums: UserMappingService,
    public gs: GroupService,
    private fb:FormBuilder
  ) 
  {
    this.Headers = this.jwtAuth.getHeaders()
    this.displayedHeaders =[this.Headers.Location, this.Headers.AssetClass, this.Headers.NoOfLabels, this.Headers.Prefix, this.Headers.StartInventoryNumber, this.Headers.EndInventoryNumber, this.Headers.LabelSize, this.Headers.LabelMaterial, this.Headers.UsedCount,this.Headers.Remark, this.Headers.PrintFile]
   }

  ngOnInit() {
   debugger;
   // this.inventorynote.next(this.inventory.slice());

   
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    
    this.ReportForm = this.fb.group({
      plantMultiFilterCtrl : ['', [Validators.required]],
    })

    this.layerid = this.storage.get(Constants.SESSSION_STORAGE, Constants.LAYER_ID);
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
    this.GetInitiatedData();
    this.Seriesprinting();
    this.GetCategoryListByConfiguration();

    this.selectedvalue = "0";
    this.plantMultiCtrl1 = 0;
    this.inventoryMulti = "";
    this.cityMultiCtrl = "";
    this.SelectSBUCheckbox(this.cityMultiCtrl);
    this.Selectedchangeplant(this.plantMultiCtrl1);
    // this.GetCategoryAndLocationList();
    this.IsExport = false;
  }
  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  ListOfField: any[] = [];
  ListOfFilter: any[] = [];
  ListOfFilterName: any[] = [];
  ListOfCategory: any[] = [];
  MaterialList: any[] = [];
  GetInitiatedData() {

    let url1 = this.cls.GetLocationListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 27);
    let url2 = this.cbs.GetCategoryListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 27);
    let url3 = this.gs.GetFieldListByPageId(27,this.UserId,this.CompanyId);
    let url4 = this.gs.GetFilterIDlistByPageId(27);
    let url5 = this.gs.CheckWetherConfigurationExist(this.GroupId, 24);
    let url6 = this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.RegionId, "27");
    let url7 = this.defineseriesservies.GetlabelIdTOBindDisplaylist(this.CompanyId);
    forkJoin([url1, url2, url3, url4, url5, url6,url7]).subscribe(results => {
      if (!!results[0]) {

        this.ListOfLoc = JSON.parse(results[0]);
        this.ListOfLoc1 = this.ListOfLoc;
        this.ListOfSBU = this.UniqueArraybyId(this.ListOfLoc, this.Layertext);
        this.getFilterCityType();
        this.getFilterPlantType();
      }

      if (!!results[1]) {
        this.ListOfCategory = JSON.parse(results[1]);
        this.getFilterCategoryType();
      }
      if (!!results[3]) {
        this.ListOfFilter = JSON.parse(results[3]);
        if (!!this.ListOfFilter) {
          this.ListOfFilter.forEach(x => this.ListOfFilterName.push(x.FilterName))
        }
      }
      if (!!results[6]) {
        var list = JSON.parse(results[6]);
        list.forEach(element => {
          var idx = this.MaterialList.indexOf(element.Material);
          if (idx < 0) {
            this.Labelmaterial.push(element);
            this.MaterialList.push(element.Material);
          }
        });
        this.getFilterlabelmaterial();
      }
      this.sbutosbunotallowed = results[4];
      if (!!results[5]) {
        this.ListOfPagePermission = JSON.parse(results[5]);
        if (this.ListOfPagePermission.length > 0) {
          for (var i = 0; i < this.ListOfPagePermission.length; i++) {
            this.PermissionIdList.push(this.ListOfPagePermission[i].ModulePermissionId);
          }
        }
        else {
          this.alertService.alert({ message: this.message.NotAuthorisedToAccess, title: this.message.AssetrakSays })
            .subscribe(res => {
              this.router.navigateByUrl('h/a')
            })
        }
      }
      this.loader.close();
    })
  }

  UniqueArraybyId(collection, keyname) {
    var output = [],
      keys = [];

    collection.forEach(item => {
      var key = item[keyname];
      if (keys.indexOf(key) === -1) {
        keys.push(key);
        output.push(item);
      }
    });
    return output;
  };

  Seriesprinting() {
    var groupId = this.GroupId;
    this.defineseriesservies.Seriesprinting(groupId)
      .subscribe(r => {

        this.Global = true;
        this.Global1 = false;
        this.SelectedCategatoryItems = ["Global"];


        if (r == 0) {
          this.Global = false;
          this.Global1 = true;
        }

      })
  }
  SearchcolumnName: any;
  variable: any;
  Serchicon(columnName, isflag) {

    this.variable = this.AssetNoFilter.setValue("");
    this.SearchcolumnName = columnName;
    this.getclear();
    if (columnName == "AssetId") {
      this.isButtonVisible = !isflag;
    }
  }

  getclear() {
    this.isButtonVisible = false;

  }

  ClearSerch(columnName, isflag) {

    this.isButtonVisible = !isflag;
    this.Showprintlabel();
  }

  GetCategoryListByConfiguration() {

    var groupId = this.GroupId;
    var userId = this.UserId;
    var regionId = this.RegionId;
    var companyId = this.CompanyId;
    var pageid = 27;
    // this.defineseriesservies.GetCategoryListByConfiguration(groupId, userId, companyId, regionId, pageid)
    this.defineseriesservies.GetBlockOfAssetsByCompany(companyId).subscribe(result => {

      this.assetcategory = (result);
      // this.filteredCategory.next((this.assetcategory).slice());

      this.getFilterCategory();

    })
  }
  getFilterCategory() {

    this.filteredCategory.next(this.assetcategory.slice());
    this.CategoryFilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCategorydata();
      });
  }
  protected filterCategorydata() {
    if (!this.assetcategory) {
      return;
    }
    let search = this.CategoryFilter.value;
    if (!search) {
      this.filteredCategory.next(this.assetcategory.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredCategory.next(
      this.assetcategory.filter(x => x.BlockName.toLowerCase().indexOf(search) > -1)
    );
  }
  getFilterlabelmaterial(){
    this.inventorynote.next(this.Labelmaterial.slice());
    this.assetGroupfiltrCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterLabelSize();
      });
  }
  protected filterLabelSize() {

    if (!this.Labelmaterial) {
      return;
    }

    let search = this.assetGroupfiltrCtrl.value;
    if (!search) {
      this.inventorynote.next(this.Labelmaterial.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.inventorynote.next(
      this.Labelmaterial.filter(data1 => data1.name.toLowerCase().indexOf(search) > -1)
    );

  }

  SelectPlantCheckbox(event) {

    this.SelectedPlantItems = event;
  }
  LocationList = [];
  CategoryList = [];
  // GetCategoryAndLocationList() {
  //   var groupId = this.GroupId;
  //   var userid = this.UserId;
  //   var companyId = this.CompanyId;
  //   var regionId = this.RegionId;
  //   this.cbs.GetCategoryAndLocationListForReview(groupId, userid, companyId, regionId)
  //     .subscribe(r => {
  //         
  //       var AllData = JSON.parse(r);
  //       this.CategoryList = AllData.AssetCategoryList;
  //       this.LocationList = AllData.AssetLocationList;
  // this.filterCategorydata();
  // this.getFilterLocation();
  // })
  //   }  
  // getFilterLocation() {
  //   this.filteredPlantsMulti.next(this.PlantList.slice(0, this.offset + this.limit));
  //   this.offset += this.limit;
  //   this.plantMultiFilterCtrl.valueChanges
  //     .pipe(takeUntil(this._onDestroy))
  //     .subscribe(() => {
  //       this.filterLocationdata();
  //     });
  // }
  // protected filterLocationdata() {
  //   if (!this.PlantList) {
  //     return;
  //   }
  //   let search = this.plantMultiFilterCtrl.value;
  //   if (!search) {
  //     this.filteredPlantsMulti.next(this.PlantList.slice());
  //     return;
  //   } else {
  //     search = search.toLowerCase();
  //   }
  //   this.filteredPlantsMulti.next(
  //     this.PlantList.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1)
  //   );
  // }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  toggleSelectAllCity(selectAllValue) {
    this.cityMultiCtrl = [];
    this.filteredCityMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (!!selectAllValue.checked) {
          this.ListOfSBU.forEach(element => {
            this.cityMultiCtrl.push(element[this.Layertext]);
          });
        } else {
          this.cityMultiCtrl = "";
        }
        this.onchangeSBU('');
      });
  }

  toggleSelectAllplant(selectAllValue: boolean) {
    this.filteredPlantsMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.plantMultiCtrl.patchValue(val);
        } else {
          this.plantMultiCtrl.patchValue([]);
        }
      });
  }
  toggleSelectAllcategory(selectAllValue: boolean) {
    this.filteredCategory.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.CategoryCtrl.patchValue(val);
        } else {
          this.CategoryCtrl.patchValue([]);
        }
      });
  }
  toggleSelectAllmatrial(selectAllValue: boolean) {
    this.filteredAssetClassMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.assetGroupCtrl.patchValue(val);
        } else {
          this.assetGroupCtrl.patchValue([]);
        }
      });
  }
  // onchangeSBU(value) {
  //   if(!!value){
  //     this.ListOfLoc1 = this.ListOfLoc.filter(x => x[this.Layertext].indexOf(value) > -1);
  //     this.getFilterPlantType();
  //   }
  //   else{
  //     this.ListOfLoc1 = this.ListOfLoc.filter(x => x);
  //     this.getFilterPlantType();
  //   }

  // }
  onchangeSBU(value) {
    debugger;
    if (!!value) {
      var list = [];
      if (!!this.cityMultiCtrl && this.cityMultiCtrl.length > 0) {
        this.cityMultiCtrl.forEach(x => {
          this.ListOfLoc = this.ListOfLoc1.filter(y => y[this.Layertext].indexOf(x) > -1);
          this.ListOfLoc.forEach(x => {
            list.push(x);
          })
        })
        this.ListOfLoc = list;
      }
      else {
        this.ListOfLoc = this.ListOfLoc1.filter(y => y);
      }
      this.plantMultiCtrl1 = "";
      this.plantMultiCtrl = "";
      this.getFilterPlantType();
    }
    else {
      this.ListOfLoc = this.ListOfLoc1;
      this.plantMultiCtrl1 = "";
      this.plantMultiCtrl = "";
      this.getFilterPlantType();
    }
  }
  //========= City ===========
  checkoutInitiationLocations: any;
  ListOfLoc: any[] = [];
  ListOfLoc1: any[] = [];
  ListOfSBU: any[] = [];

  getFilterCityType() {
    this.filteredCityMulti.next(this.ListOfSBU.slice());
    this.cityMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCityMulti();
      });
  }
  protected filterCityMulti() {

    if (!this.ListOfSBU) {
      return;
    }
    let search = this.cityMultiFilterCtrl.value;
    if (!search) {
      this.filteredCityMulti.next(this.ListOfSBU.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCityMulti.next(
      this.ListOfSBU.filter(x => x.City.toLowerCase().indexOf(search) > -1)
    );
  }
  limit = 10;
  offset = 0;
  getFilterPlantType() {
    this.filteredPlantsMulti.next(this.ListOfLoc.slice(0, this.offset + this.limit));
    this.offset += this.limit;
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
  getFilterCategoryType() {
    this.filteredcategoryMulti.next(this.ListOfCategory.slice());
    this.categoryFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCategoryMulti();
      });
  }
  protected filterCategoryMulti() {
    if (!this.ListOfCategory) {
      return;
    }
    let search = this.categoryFilterCtrl.value;
    if (!search) {
      this.filteredcategoryMulti.next(this.ListOfCategory.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredcategoryMulti.next(
      this.ListOfCategory.filter(x => x.AssetCategoryName.toLowerCase().indexOf(search) > -1)
    );
  }

  protected setInitialValue() {

    this.assetGroupCtrl.value
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: labelsize, b: labelsize) => a && b && a.id === b.id;
      });
  }

  selectmaerial: any;
  Showprintlabel() {
    debugger;
    if (this.Global == true) {
      if (this.plantMultiCtrl1.length == 0) {
        this.toastr.warning(`Please Select ${this.Headers.Location}`, this.message.AssetrakSays);
        return null;
      }
      if (!this.Selectedvalueforglobal) {
        this.toastr.warning(`Please Select ${this.Headers.AssetClass}`, this.message.AssetrakSays);
        return null;
      }
    }

    if (this.Global1 == true) {
      if (!this.plantMultiCtrl) {
        this.toastr.warning(`Please Select ${this.Headers.Location}`, this.message.AssetrakSays);
        return null;
      }
      if (!this.CategoryCtrl) {
        this.toastr.warning(`Please Select ${this.Headers.AssetClass}`, this.message.AssetrakSays);
        return null;
      }
    }

    this.loader.open();
    this.datasource = [];
    this.IsExport = false;
    var CategoryIdList = [];
    var locationidlist = [];

    if (!this.SelectedchangeplantItems) {
      locationidlist.push(0);
      this.ListOfLoc1.forEach(x => {
        locationidlist.push(x.LocationId);
      })
    }
    else {
      locationidlist = this.SelectedchangeplantItems;
    }

    if (this.Global1 == true) {
      if (!!this.SelectedCategatoryItems && this.CategoryCtrl != null && this.CategoryCtrl != "") {
        CategoryIdList = [this.SelectedCategatoryItems];
      }
      else {
        CategoryIdList = [];
      }
    }

    var assetDetails = {
      CompanyId: this.CompanyId,
      GroupId: this.GroupId,
      LocationIdList: locationidlist,
      CategoryIdList: CategoryIdList,
      BlockId: 1,
      SearchText: "",
      IsExport: this.IsExport,
      Material: !!this.inventoryMulti ? this.inventoryMulti.Material : "All" ,
      pageNo: 1,
      pageSize: 50
    }
    this.defineseriesservies.GetPrintDetails(assetDetails).subscribe(r => {

      this.tempseriesdata = [];
      this.loader.close();
      if (!!r) {
        this.printlist = JSON.parse(r);
        this.printlist.forEach(element => {
          if (element.locationid == 0) {
            element.location = "All";
            this.tempseriesdata.push(element);
          }
          else {
            this.tempseriesdata.push(element);
          }
        });
      }
      this.displaybtn = true;
      this.displayTable = true;
      this.onChangedatasource(this.tempseriesdata);

    })
  }
  tempseriesdata: any = [];
  onChangedatasource(value) {
    this.datasource = new MatTableDataSource(value);
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
    if (value.length == 0) {
      this.datasource = undefined;
    }
  }
  SelectedMaterial(event) {
    if (event.name == "All") {
      this.SelectedMaterialItems = "0"
    }
    else {
      this.SelectedMaterialItems = event.name;
    }
  }
  changeCategory(event) {
    this.SelectedCategatoryItems = event.Id;
  }
  Selectedchangeplant(event) {
    this.SelectedchangeplantItems = event;
  }

  SelectSBUCheckbox(event) {
    //  
    this.SelectedSBUItems = event;
  }
  printlabel(): void {
    debugger;
    var component: any
    component = AddprinttagDialogComponent;
    const dialogRef = this.dialog.open(component, {
      panelClass: 'group-form-dialog',
    
      width: "50%",
      data: {
        CompanyId: this.CompanyId,
        GlobalAvailable: this.Global,
        plantlist: this.PlantList,
        labelmaterial: this.inventory,
        selectplant: this.SelectedchangeplantItems,
        assetclass: this.SelectedCategatoryItems
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.toastr.success(this.message.InsertPrinttag, this.message.AssetrakSays,);
        this.Showprintlabel();

      }
      else {
        return false;
      }
    });
  }
  selectedrow: any;
  Download(event) {
    debugger;
    this.loader.open();
    this.selectedrow = event;
    var CategoryIdList = [];
    var locationidlist = [];
    if (this.Global1 == true) {
      CategoryIdList.push(this.SelectedCategatoryItems);
    }
    else {
      CategoryIdList = [0];
    }
    if (!this.SelectedchangeplantItems) {
      locationidlist = []
    }
    else {
      locationidlist.push(this.SelectedchangeplantItems);
    }
    

    var sdefinition = {
      Companyid: this.CompanyId,
      categoryidList: CategoryIdList,
      // locationid : locationidlist,
      labelmaterial: this.selectedrow.labelmaterial,
      labelsize: this.selectedrow.labelsize,
      EndBarcode: this.selectedrow.EndBarcode,
      StratBarcode: this.selectedrow.StratBarcode,
      prefix: this.selectedrow.prefix,
      BlockName: this.selectedrow.BlockName,
      LocationName: this.selectedrow.LocationName,
      remark:this.selectedrow.remark,
      ServerPath: ""

    }
    this.defineseriesservies.Download(sdefinition).subscribe(r => {
      debugger;
      this.loader.close();
      if (!!r) {
        this.AllPathService.DownloadExportFile(r);
      }

    })
  }
  selectedtype1: any;
  openInventorydetaildata(...event): void {
    this.loader.open();
    const SelectedData = event[0];
    var CategoryIdList = [];
    if (this.Global1 == true) {
      CategoryIdList = this.SelectedCategatoryItems;
    }
    var BarcodeDetails = {
      CategoryIdList: CategoryIdList,
      Type: '',
      StratBarcode: SelectedData.StratBarcode,
      EndBarcode: SelectedData.EndBarcode,
      prefix: SelectedData.prefix,
      GroupId: this.GroupId,
      CompanyId: this.CompanyId,
    }
    this.defineseriesservies.Getassetdetail(BarcodeDetails).subscribe(r => {
      this.loader.close();
      const response = JSON.parse(r);
      if (r == "[]") {
        this.toastr.warning("count is not Available", this.message.AssetrakSays,);
      }
      else {
        var component: any
        component = InventorySeriesDialogComponent;
        const dialogRef = this.dialog.open(component, {
          panelClass: 'group-form-dialog',
        
          width: "50%",
          data: {
            component1: 'CompanyComponent',
            CompanyId: this.CompanyId,
            GlobalAvailable: this.Global,
            selectedtype1: event,
            record: SelectedData.Used,
            value: response,
          },
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
          }
        });
      }
    })
  }
}




