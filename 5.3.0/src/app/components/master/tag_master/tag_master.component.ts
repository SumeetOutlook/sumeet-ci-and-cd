import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { SnotifyService, SnotifyToast } from "ng-snotify";
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { Router, ActivatedRoute } from "@angular/router";
import { TagMasterDialogComponent } from './add_tag_master_dialog/add_tag_master_dialog.component';
import { LocalStoreService } from "app/shared/services/local-store.service";
import { EditMasterDialogComponent } from "./edit_tag_master/edit_tag_master.component";
import { SelectionModel } from '@angular/cdk/collections';
import { MatTabChangeEvent } from '@angular/material/tabs';
import * as headers from '../../../../assets/Headers.json';
import { FieldfilterService } from 'app/components/services/FieldfilterService';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ReconciliationService } from '../../services/ReconciliationService';
import { CompanyLocationService } from '../../services/CompanyLocationService';
import { UserMappingService } from '../../services/UserMappingService';
import { CompanyBlockService } from '../../services/CompanyBlockService';
import { GroupService } from '../../services/GroupService';
import { UserService } from '../../services/UserService';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import * as resource from '../../../../assets/Resource.json';
import * as header from '../../../../assets/Headers.json';
import { ToastrService } from 'ngx-toastr';
import { AllPathService } from 'app/components/services/AllPathServices';
import { JwtAuthService } from "app/shared/services/auth/jwt-auth.service";


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

export interface PeriodicElement1 {
  LabelMaterial: string;
  enable: string;
}

const LABELMATERIAL: PeriodicElement1[] = [
  { enable: "", LabelMaterial: 'Paper' },
  { enable: "", LabelMaterial: 'Aluminium' },
  { enable: "", LabelMaterial: 'Steel' },
  { enable: "", LabelMaterial: 'Vinyl' },
  { enable: "", LabelMaterial: 'Plastic' },
];

@Component({
  selector: 'app-tag_master',
  templateUrl: './tag_master.component.html',
  styleUrls: ['./tag_master.component.scss']
})

export class TagMasterComponent implements OnInit {
  selectedRow: boolean = false;
  Headers: any ;
  message: any;


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

  public assettypeMultiCtrl: any;
  public assettypeFilterCtrl: FormControl = new FormControl();
  public filteredAssetTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public assetsubtypeMultiCtrl: any;
  public assetsubtypeFilterCtrl: FormControl = new FormControl();
  public filteredAssetSubTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  protected _onDestroy = new Subject<void>();
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table', { static: true }) table: any;

  displayedColumns: string[] = ["LabelHeader", "LabelFooter", "Style", "LabelSize", "AssetNo", "AssetClass", "AssetClassName", "AssetName", "Actions"];

  selection = new SelectionModel<Element>(true, []);
  controls: FormArray;
  public grpdata;
  value: any;
  updateData: any;
  deleteOptions: { option: any; id: any; };
  core: any;
  CompanyId: any;
  GroupId: any;
  UserId: any;
  RegionId: any;
  currentGroupIndex: any;
  laballist: any = [];
  taglist: any = [];
  getselectedData: any[] = [];
  newdataSource = [];
  ListOfLoc: any[] = [];
  ListOfLoc1: any[] = [];
  ListOfSBU: any[] = [];
  displayedHeadersForLabel:any = []
  displayedColumnsForLabel = ['IsActive', 'PrintLocation'];
  datasource: any = [];
  dataSourceLabel: any = [];
  sbutosbunotallowed: any;
  labelsize: any[] = [];
  displaybtn: boolean = true;
  setflag: boolean = false;
  step;
  public selectedTabIndex = 0;
  displayTable: boolean;

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  nextTab(i) {
    this.selectedTabIndex = i;
  }
  previousTab(i) {
    this.selectedTabIndex = i;
    console.log(i);
  }

  constructor(
    public dialog: MatDialog,
    public rs: ReconciliationService,
    public cls: CompanyLocationService,
    public ums: UserMappingService,
    public cbs: CompanyBlockService,
    public gs: GroupService,
    public us: UserService,
    private loader: AppLoaderService,
    private confirmService: AppConfirmService,
    private router: Router,
    private localService: LocalStoreService,
    private storage: ManagerService,
    public fieldfilterservice: FieldfilterService,
    public alertService: MessageAlertService,
    public toastr: ToastrService,
    public AllPathService: AllPathService,
    private jwtAuth : JwtAuthService
  ) {
      this.Headers = this.jwtAuth.getHeaders();
      this.message = this.jwtAuth.getResources();
      this.displayedHeadersForLabel = [this.Headers.Status, this.Headers.LabelMaterial]
   }

  ngOnInit() {
    this.loader.open();
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    this.paginator._intl.itemsPerPageLabel = 'Records per page';
    this.GetlabelIdTOBindDisplaylist();
    this.Gettagmasterdata();
    //this.Getlabaldetaildata(); 
    this.GetInitiatedData();

    this.loader.close();

  }
  ListOfField: any[] = [];
  ListOfFilter: any[] = [];
  ListOfFilterName: any[] = [];
  ListOfCategory: any[] = [];
  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  pageid: any;
  IsExport: Boolean = false;
  GetInitiatedData() {

    let url1 = this.cls.GetLocationListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 7);
    let url2 = this.cbs.GetCategoryListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 7);
    let url3 = this.gs.GetFieldListByPageId(7,this.UserId, this.CompanyId);
    let url4 = this.gs.GetFilterIDlistByPageId(7);
    let url5 = this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.RegionId, "7");
    forkJoin([url1, url2, url3, url4, url5]).subscribe(results => {
      if (!!results[0]) {
        this.ListOfLoc = JSON.parse(results[0]);
        this.ListOfLoc1 = this.ListOfLoc;
        this.ListOfSBU = this.UniqueArraybyId(this.ListOfLoc1, 'City');
        console.log(this.ListOfSBU);
        this.getFilterCityType();
        this.getFilterPlantType();
      }

      if (!!results[1]) {
        this.ListOfCategory = JSON.parse(results[1]);
        this.getFilterCategoryType();
      }
      if (!!results[2]) {
        this.ListOfField = JSON.parse(results[2]);
      }
      if (!!results[3]) {
        this.ListOfFilter = JSON.parse(results[3]);
        if (!!this.ListOfFilter) {
          this.ListOfFilter.forEach(x => this.ListOfFilterName.push(x.FilterName))
        }
        console.log(this.ListOfFilter);
      }

      if (!!results[4]) {
        this.ListOfPagePermission = JSON.parse(results[4]);
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
  Gettagmasterdata() {
    this.temptagdata = [];
    this.taglist = [];
    this.labelsize = [];
    var tagdto = {
      CompanyId: this.CompanyId,
      IsSearch: false,
      SearchText: "",
    }
    this.fieldfilterservice.Gettagmasterdata(tagdto).subscribe(r => {
      if (!!r) {
        this.taglist = JSON.parse(r);
        this.taglist.forEach(element => {
          this.temptagdata.push(element);
          this.labelsize.push(element.LabelSize);
        });
      }

      this.onChangedatasource(this.temptagdata);
    })
  }
  temptagdata: any = [];
  onChangedatasource(value) {
    this.datasource = new MatTableDataSource(value);
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }
  Getlabaldetaildata() {
    this.tempdatalabal = [];
    this.fieldfilterservice.Getlabaldetaildata().subscribe(r => {
      this.laballist = [];
      this.laballist = JSON.parse(r);
      debugger;
      this.laballist.forEach(element => {
        if (this.listoflabelmatrial.indexOf(element.PrintLocation) > -1) {
          element.checked = true;
          element.disabled = true;
        }
        else {
          element.checked = false;
          element.disabled = false;
        }
        this.tempdatalabal.push(element);
      });
      this.onChangedataSourceLabel(this.tempdatalabal);
    })
  }
  tempdatalabal: any = [];
  onChangedataSourceLabel(value) {
    this.dataSourceLabel = new MatTableDataSource(value);
    //this.dataSourceLabel.paginator = this.paginator;
    //this.dataSourceLabel.sort = this.sort;
  }
  getvalue(row) {
    debugger;
    this.selection.clear();
    this.displaybtn =false;
    var idx = this.newdataSource.indexOf(row);
    if (idx > -1) {
      this.newdataSource.splice(idx, 1);
      this.getselectedData.splice(idx, 1);
      if(this.newdataSource.length == 0)
      {
        this.displaybtn=true;
      }
      var idx1 = this.listoflabelmatrial.indexOf(row.PrintLocation);
      if (idx1 > -1) {
        this.listoflabelmatrial.splice(idx1, 1);
      }
    }
    else {
      this.newdataSource.push(row);
      this.getselectedData.push(row);
      this.listoflabelmatrial.push(row.PrintLocation)
    }
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.nextTab(tabChangeEvent.index);
    this.previousTab(tabChangeEvent.index);
    console.log(tabChangeEvent);
  }
  ngAfterViewInit() {
    //this.datasource.sort = this.sort;
    //this.datasource.paginator = this.paginator;

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  }
  public Addtagmaster() {
    const dialogconfigcom1 = new MatDialogConfig();
    dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = "60vw";
    dialogconfigcom1.height = "auto";
    dialogconfigcom1.data = this.labelsize;
    const modalService = this.dialog.open(TagMasterDialogComponent, dialogconfigcom1);
    modalService.afterClosed().subscribe((res) => {
      if (res == "sucess") {

        this.Gettagmasterdata();
        this.toastr.success(this.message.LabelContentSucess, this.message.AssetrakSays)
      }
      else if (res == "Failed")
        this.toastr.warning(this.message.tagErrormessage, this.message.AssetrakSays)
    })
  }

  Exportdata() {
    if (this.datasource.data.length != 0) {
      this.loader.open();
      this.temptagdata = [];
      this.taglist = [];
      var tagdto = {
        CompanyId: this.CompanyId,
        IsSearch: false,
        SearchText: "",
        IsExport: true
      }
      this.fieldfilterservice.Gettagmasterdata(tagdto).subscribe(r => {
        if (!!r) {
          this.AllPathService.DownloadExportFile(r);
        }
        this.loader.close();
      });
    } else {
      this.toastr.warning(this.message.NoDataAvailable, this.message.AssetrakSays);
      return null;
    }

  }
  callit(row) {
    this.selectedRow = true;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.datasource.data.forEach(row => this.selection.select(row));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.datasource.data.length;
    return numSelected === numRows;
  }

  editmaster(row): void {
    console.log(row);
    let dialogRef = this.dialog.open(EditMasterDialogComponent, {
      width: '60vw', height: 'auto',
      data: row
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.Gettagmasterdata();
      }
    });
  }

  public doFilter = (value: string) => {
    this.datasource.filter = value.trim().toLocaleLowerCase();
  }

  Submit() {
    debugger;
    var companyId = this.CompanyId;
    var UserId = this.UserId;
    var labedetialdtolist = [];
    if (this.listoflabelmatrial.length == 0) {
      this.Getlabaldetaildata();
    }
    else {
      this.listoflabelmatrial.forEach(element => {
        var labeldetails = {
          CompanyId: null,
          PrintAt: "",
          LabelTypeId: 0,
          PrintLocation: null,
          Material: element,
          IsActive: true,
          VendorEmail: null,
        }
        labedetialdtolist.push(labeldetails);
      });
    }
    var labellist = {
      locationDetailsList: JSON.stringify(labedetialdtolist),
      CompanyId: companyId,
      UserId: UserId,
    }
    this.fieldfilterservice.InsertLabeldata(labellist).subscribe(r => {
      this.toastr.success(this.message.Labelmaterialupdated, this.message.AssetrakSays);
      this.displaybtn =true;
      this.ngOnInit();
    })
  }
  valuelist: any[] = [];
  materialinfo: any[] = [];
  listoflabelmatrial: any[] = [];
  disablelistofmaterial: any[] = [];

  GetlabelIdTOBindDisplaylist() {
    this.fieldfilterservice.GetlabelIdTOBindDisplaylist(this.CompanyId).subscribe(r => {
      debugger;
      this.materialinfo = [];
      this.valuelist = [];
      this.newdataSource =[];
      this.disablelistofmaterial = [];
      this.listoflabelmatrial = [];
      this.materialinfo = JSON.parse(r);
      this.materialinfo.forEach(element => {
        if (this.valuelist.indexOf(element.Material) < 0) {
          this.valuelist.push(element.Material);
          this.disablelistofmaterial.push(element.Material);
        }
      });
      this.listoflabelmatrial = this.valuelist;
      // this.listoflabelmatrial = this.valuelist.filter((c, index) => {
      //   return this.valuelist.indexOf(c) === index;
      // });
      this.Getlabaldetaildata();
    })

  }
  private isButtonVisible = false;
  ClearSerch(columnName, isflag) {
    debugger;
    this.isButtonVisible = !isflag;
    this.Gettagmasterdata();
  }
}
