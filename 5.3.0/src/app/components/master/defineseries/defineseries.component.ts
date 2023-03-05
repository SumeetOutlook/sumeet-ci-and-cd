import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { AddsDefineSeriesDialogComponent } from './Adddefineseries/addsdefineseries-dialog.component';
import { InventorySeriesDialogComponent } from './Inventoryseries/Inventoryseries-dialog.component';
import { InventorySeriesDataDialogComponent } from './Inventoryseriesdata/Inventoryseriesdata-dialog.component';
import * as headers from '../../../../assets/Headers.json';
import * as resource from '../../../../assets/Resource.json';
import { ToastrService } from 'ngx-toastr';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { DefineseriesService } from '../../services/DefineseriesService';
import { LocationService } from 'app/components/services/LocationService';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { ReconciliationService } from '../../services/ReconciliationService';
import { CompanyLocationService } from '../../services/CompanyLocationService';
import { UserMappingService } from '../../services/UserMappingService';
import { CompanyBlockService } from '../../services/CompanyBlockService';
import { GroupService } from '../../services/GroupService';
import { UserService } from '../../services/UserService';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as menuheaders from '../../../../assets/MenuHeaders.json';
import { AllPathService } from 'app/components/services/AllPathServices';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
interface Company {
  id: string;
  name: string;
}

interface SelectStatus {
  id: number;
  name: string;
}

interface AssetClass {
  id: string;
  name: string;
}


const SELECTSTATUS: SelectStatus[] = [
  { name: 'All', id: 1 },
  { name: 'Active', id: 2 },
  { name: 'Inactive', id: 3 },
  { name: 'Not Available', id: 4 },

];

@Component({
  selector: 'app-defineseries',
  templateUrl: './defineseries.component.html',
  styleUrls: ['./defineseries.component.scss']
})
export class DefineseriesComponent implements OnInit {
  header: any ;
  message: any = (resource as any).default;
  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  protected _onDestroy = new Subject<void>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  selected = 'All';
  selected1 = 'Global';

  disableSelect = false;
  disablevalueSelect: boolean = false;
  firstFormGroup: FormGroup;
  updateData: any;
  updateDataInsert: any;
  //datasource: any;
  Company: any;
  public assetcategory: any[] = [];
  Category: any[] = [];
  CompanyId: any;
  GroupId: any;
  UserId: any;
  RegionId: any;
  Global: boolean = true;
  Global1: boolean = false;
  ListOfLoc: any[] = [];
  ListOfLoc1: any[] = [];
  ListOfSBU: any[] = [];
  public newdataSource = [];
  public getselectedData: any[] = [];
  public isallchk: boolean;
  public arrBirds: any[];
  public arrlength = 0;
  menuheader: any = (menuheaders as any).default
  displayedHeaders : any[] = []
  displayedColumns: string[] = ['select', 'Company', 'Asset Class', 'Prefix', 'Start Number', 'End Number', 'Record', 'Print Count', 'Used Count', 'Status'];
  datasource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  sbutosbunotallowed: any;
  // SelectedCompanyItems: any[] = [];
  SelectedCompanyItems: any;
  SelectedCategatoryItems: any[] = [];
  SelectedCategatory1Items: any[] = [];
  SelectedSatusItems: any[] = [];
  serieslist: any[] = [];
  Selectedvalueforglobal = "Global";
  SelectedvalueforStatus = "All";
  ShowPopup: boolean = false;
  Showcheckbtn: boolean = false;
  ShowExportbtn: boolean = false;
  IsExport: boolean = false;
  SelectedStatus: any;
  IsShow: boolean = false;
  displayTable: boolean = false;
  displaybtn: boolean = false;
  setflag:boolean =false;

  // protected company: Company[] ;
  public CompanyMultiCtrl: any;
  // public CompanyMultiCtrl: FormControl = new FormControl();
  public CompanyMultiFilterCtrl: FormControl = new FormControl();
  public filteredCompanyMulti: ReplaySubject<Company[]> = new ReplaySubject<Company[]>(1);

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

  public CategoryCtrl: FormControl = new FormControl();
  public CategoryFilter: FormControl = new FormControl();
  public filteredCategory: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);


  constructor(
    // private cs: CommonService,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private loader: AppLoaderService,
    private defineseriesservies: DefineseriesService,
    public locationservice: LocationService,
    private storage: ManagerService,
    public rs: ReconciliationService,
    public cls: CompanyLocationService,
    public ums: UserMappingService,
    public cbs: CompanyBlockService,
    public gs: GroupService,
    public toastr: ToastrService,
    public us: UserService,
    private router: Router,
    public alertService: MessageAlertService,
    public AllPathService: AllPathService,
    private jwtAuth :JwtAuthService
  ) 
  {
    this.header = this.jwtAuth.getHeaders()
    this.displayedHeaders = ['', this.header.LegalEntity, this.header.AssetClass, this.header.Prefix, this.header.StartInventoryNumber, this.header.EndInventoryNumber, this.header.Record, this.header.Printed, this.header.UsedCount, this.header.Status]
   }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  toggleSelectAllCompany(selectAllValue: boolean) {

    this.filteredCompanyMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {

        if (selectAllValue) {
          this.CompanyMultiCtrl.patchValue(val);
        } else {
          this.CompanyMultiCtrl.patchValue([]);
        }
      });
  }
  // protected setInitialValue() {
  //   this.filteredCompanyMulti
  //     .pipe(take(1), takeUntil(this._onDestroy))
  //     .subscribe(() => {
  //       this.multiSelect.compareWith = (a: Company, b: Company) => a && b && a.id === b.id;
  //     });      
  // }
  // protected filterCompanyMulti() {
  //   if (!this.Company) {
  //     return;
  //   }
  //   let search = this.CompanyMultiFilterCtrl.value;
  //   if (!search) {
  //     this.filteredCompanyMulti.next(this.Company.slice());
  //     return;
  //   } else {      
  //   }    
  // }

  getFiltercompany() {
    this.filteredCompanyMulti.next(this.Company.slice());
    this.CompanyMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCompanyMulti();
      });
  }
  protected filterCompanyMulti() {
    if (!this.Company) {
      return;
    }
    let search = this.CompanyMultiFilterCtrl.value;
    if (!search) {
      this.filteredCompanyMulti.next(this.Company.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCompanyMulti.next(
      this.Company.filter(x => x.CompanyName.toLowerCase().indexOf(search) > -1)
    );
  }

  ngOnInit(): void {

    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);

    this.Seriesprinting();
    this.GetInitiatedData()
    this.GetToBindCompanySelectListWithCUserID();
    this.GetCategory();

    this.SelectedStatus = "All";
    this.changeStatus(this.SelectedStatus);
    this.paginator._intl.itemsPerPageLabel = 'Records per page';
  };
  Seriesprinting() {
    var GroupId = this.GroupId;
    this.defineseriesservies.Seriesprinting(GroupId)
      .subscribe(r => {
        this.Global = true;
        this.Global1 = false;
        if (r == 0) {
          this.Global = false;
          this.Global1 = true;
        }
      })
  }
  GetToBindCompanySelectListWithCUserID() {
    var groupId = this.GroupId;
    var userId = this.UserId;
    this.defineseriesservies.GetToBindCompanySelectListWithCUserID(groupId, userId).subscribe(result => {
      debugger;
      this.Company = result;
      //this.filteredCompanyMulti.next((JSON.parse(this.Company)).slice());
      //  this.GetCategoryAndLocationList();
      this.getFiltercompany();
      this.CompanyMultiCtrl = parseInt(this.CompanyId);
      this.changeCompany(this.CompanyMultiCtrl);
      this.GetCategoryListByConfiguration();
    })
  }
  GetCategoryListByConfiguration() {
    var groupId = this.GroupId;
    var userId = this.UserId;
    var regionId = this.RegionId;
    var companyId = this.CompanyId;
    var pageid = 8;
    // this.defineseriesservies.GetCategoryListByConfiguration(groupId, userId, companyId, regionId, pageid)
    this.defineseriesservies.GetBlockOfAssetsByCompany(companyId).subscribe(result => {

      this.assetcategory = result;
      this.getFilterCategory();

    })
  }
  GetCategory() {
    var CId = this.CompanyId;
    this.locationservice.Category(CId).subscribe(response => {
      this.Category = JSON.parse(response);
    })
  }
  LocationList = [];
  CategoryList = [];
  GetCategoryAndLocationList() {
    var groupId = this.GroupId;
    var userid = this.UserId;
    var regionId = this.RegionId;
    var companyId = this.CompanyId;

    this.cbs.GetCategoryAndLocationListForReview(groupId, userid, companyId, regionId)
      .subscribe(r => {
        var AllData = JSON.stringify(r);
        // this.CategoryList = AllData.AssetCategoryList;
        // this.LocationList = AllData.AssetLocationList;
        // this.filterCategorydata();
        // this.getFilterLocation();
      })
  }
  getFilterLocation() {
    this.filteredPlantsMulti.next(this.LocationList.slice());
    this.plantMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterLocationdata();
      });

  }
  protected filterLocationdata() {
    if (!this.LocationList) {
      return;
    }
    let search = this.plantMultiFilterCtrl.value;
    if (!search) {
      this.filteredPlantsMulti.next(this.LocationList.slice());
      return;
    } else {
      search = search.toLowerCase();

    }
    this.filteredPlantsMulti.next(
      this.LocationList.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1)
    );
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




  selectedtype: any;
  openInventorydetail(...event): void {
    debugger;
    this.loader.open();
    const Type = event[0];
    const SelectedData = event[1];
    var CategoryIdList = [];
    if (this.Global1 == true) {
      if (!!this.SelectedCategatoryItems && this.CategoryCtrl.value != null && this.CategoryCtrl.value != "") {
        CategoryIdList = [this.SelectedCategatoryItems];
      }
      else {
        CategoryIdList = [];
      }
      // CategoryIdList = this.SelectedCategatoryItems;
    }
    var BarcodeDetails = {
      CategoryIdList: CategoryIdList,
      Type: Type,
      StratBarcode: SelectedData.StratBarcode,
      EndBarcode: SelectedData.EndBarcode,
      prefix: SelectedData.prefix,
      GroupId: this.GroupId,
      CompanyId: SelectedData.Companyid,
    }
    this.defineseriesservies.Getassetdetail(BarcodeDetails).subscribe(r => {
      debugger;
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
            value: response,
            record: SelectedData.Printed,
          },
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
          }
        });
      }
    })
  }

  openAddseries(): void {
    var component: any
    component = AddsDefineSeriesDialogComponent;
    const dialogRef = this.dialog.open(component, {
      panelClass: 'group-form-dialog',
      
      width: "50%",
      data: {
        component1: 'CompanyComponent',
        CompanyId: this.CompanyId,
        GlobalAvailable: this.Global,
        assetclass: this.SelectedCategatoryItems,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.toastr.success(this.message.SeriesDefibitionAddSucess, this.message.AssetrakSays,)
        this.Showseries();
      }
    });
  }
  selectedtype1: any;
  openInventorydetaildata(...event): void {
    debugger;
    this.loader.open();
    const SelectedData = event[0];
    var CategoryIdList = [];
    if (this.Global1 == true) {
      if (!!this.SelectedCategatoryItems && this.CategoryCtrl.value != null && this.CategoryCtrl.value != "") {
        CategoryIdList = [this.SelectedCategatoryItems];
      }
      else {
        CategoryIdList = [];
      }
      // CategoryIdList = this.SelectedCategatoryItems;
    }
    var BarcodeDetails = {
      CategoryIdList: CategoryIdList,
      Type: '',
      StratBarcode: SelectedData.StratBarcode,
      EndBarcode: SelectedData.EndBarcode,
      prefix: SelectedData.prefix,
      GroupId: this.GroupId,
      CompanyId: SelectedData.Companyid,
    }
    this.defineseriesservies.Getassetdetail(BarcodeDetails).subscribe(r => {
      debugger;
      this.loader.close();
      const response = JSON.parse(r);
      if (r == "[]") {
        this.toastr.warning("count is not Available", this.message.AssetrakSays,);
      }
      else {
        var component: any
        component = InventorySeriesDataDialogComponent;
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



  checkbox(row) {
    var objUpdateSeriesDefinition = {
    //  ID: this.getselectedIds[0],
    ID: row.ID,
      Enabled: true
    }
    this.defineseriesservies.UpdateSeriesDefinition(objUpdateSeriesDefinition).subscribe(r => {
      this.toastr.success(this.message.SeriesUpdateSucess, this.message.AssetrakSays,);
      this.Showcheckbtn = false;
      this.Showseries();
    })

  }
  // Exportdata() {
    
  //   this.IsExport = true;
  //   this.Showseries();
  // }
  Exportdata() {
    if(this.displayTable == true && this.datasource.data.length != 0){
      this.IsExport = true;
      this.Showseries();
    } else{
      if(this.displayTable == false){
        this.toastr.warning(this.message.NoDataselected, this.message.AssetrakSays);
        return null;
      }
      else{
        this.toastr.warning(this.message.NoDataAvailable, this.message.AssetrakSays);
        return null;
      }            
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.datasource.data.forEach(row => this.selection.select(row));
  }
  EnableDisable(selectedvalue, index) {
    var idx = this.newdataSource.indexOf(selectedvalue.ID);
    if (idx > -1) {
      this.newdataSource.splice(idx, 1);
      this.getselectedData.splice(idx, 1);
    }
    else {
      this.newdataSource.push(selectedvalue.ID);
      this.getselectedData.push(selectedvalue);
    }
    this.arrlength = this.newdataSource.length;
  }
  isAllSelected() {
    this.newdataSource = [];
    if (this.isallchk == true) {
      for (let i = 0; i < this.arrBirds.length; i++) {
        this.newdataSource.push(this.arrBirds[i].ID);
      }
    }
    this.arrlength = this.newdataSource.length;
    const numSelected = this.selection.selected.length;
    const numRows = this.datasource.data.length;
    return numSelected === numRows;
  }
  Showseries() {
    debugger;
    // this.loader.open();
    this.ShowExportbtn = true;
    var CategoryIdList = [];
    if (this.Global1 == true) {
      if(this.CategoryCtrl.value == null || this.CategoryCtrl.value == "")
      {
        this.toastr.warning('Please Select Asset Class', this.message.AssetrakSays);
        return null;
      }
      if (!!this.SelectedCategatoryItems && this.CategoryCtrl.value != null && this.CategoryCtrl.value != "") {
        CategoryIdList = [this.SelectedCategatoryItems];
      }
      else {
        CategoryIdList = [];
      }
    }
    this.loader.open();
    var assetDetails = {
      CompanyId: this.SelectedCompanyItems,
      GroupId: this.GroupId,
      CategoryIdList: CategoryIdList,
      IsExport: this.IsExport,
      status: this.SelectedSatusItems,
    }
    this.defineseriesservies.GetSeriesDefinition(assetDetails).subscribe(r => {
      this.loader.close();
      debugger;
      if (!!this.IsExport) {
        this.AllPathService.DownloadExportFile(r);
        this.IsExport = false;
      }
      else {
        this.tempseriesdata = [];
        this.serieslist = JSON.parse(r);
        this.serieslist.forEach(element => {
          this.tempseriesdata.push(element);
        });
        this.displayTable = true;
        this.displaybtn = true;
        this.onChangedatasource(this.tempseriesdata);
      }
    })
  }
  tempseriesdata: any = [];
  onChangedatasource(value) {
    this.datasource = new MatTableDataSource(value);
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }


  ListOfField: any[] = [];
  ListOfFilter: any[] = [];
  ListOfFilterName: any[] = [];
  ListOfCategory: any[] = [];
  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  GetInitiatedData() {
    let url5 = this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.RegionId, "8");
    forkJoin([url5]).subscribe(results => {
      if (!!results[0]) {

        this.ListOfPagePermission = JSON.parse(results[0]);
        console.log("PagePermission", this.ListOfPagePermission)
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

  changeCompany(event) {
    this.ShowPopup = false;
    this.SelectedCompanyItems = event;
    if (this.SelectedCompanyItems == parseInt(this.CompanyId)) {
      this.ShowPopup = true;
    } else {
      this.ShowPopup = false;
    }
  }
  changeCategory1(event) {

    this.SelectedCategatory1Items = event;
  }
  changeCategory(event) {
    this.IsShow = false;
    this.SelectedCategatoryItems = event;
    if (!!this.SelectedCategatoryItems) {
      this.IsShow = true;
    }
  }
  changeStatus(event) {


    this.SelectedSatusItems = event;
  }
  numSelected: any = 0;
  getselectedIds: any[] = [];
  isSelected(row) {



    this.getselectedIds = [];

    this.selection.toggle(row)
    this.numSelected = this.selection.selected.length;

    var idx = this.getselectedIds.indexOf(row.ID);
    if (idx > -1) {
      this.getselectedIds.splice(idx, 1);

    }
    else {
      this.getselectedIds.push(row.ID);
      this.Showcheckbtn = true
    }
    if (this.getselectedIds.length === 1) {
      this.selected1 = "";
      this.selected1 = row;


    }
  }

  GetSeriesDefinitionWithFilter() {

  }
  private isButtonVisible = false;
  ClearSerch(columnName, isflag) {
    debugger;
    this.isButtonVisible = !isflag;
    this.Showseries();
  }


}