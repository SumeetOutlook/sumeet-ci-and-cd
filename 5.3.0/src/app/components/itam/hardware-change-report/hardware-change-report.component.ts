import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import * as headers from '../../../../assets/Headers.json';
import { LocalStoreService } from 'app/shared/services/local-store.service';
import { DatePipe } from '@angular/common';
import { GroupService } from 'app/components/services/GroupService';
import { ITAMService } from 'app/components/services/ITAMService';
import { CompanyService } from 'app/components/services/CompanyService';
import { RegionService } from 'app/components/services/RegionService';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { SbuService } from 'app/components/services/SbuService';
import { LocationService } from 'app/components/services/LocationService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportService } from 'app/components/services/ReportService';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { AllPathService } from 'app/components/services/AllPathServices';
import { GetFieldsComponent } from 'app/components/partialView/get-fields/get-fields.component';
import * as menuheaders from '../../../../assets/MenuHeaders.json'
import { AssetRetireService } from '../../services/AssetRetireService';
import * as resource from '../../../../assets/Resource.json';
import { ToastrService } from 'ngx-toastr';
import { assetTabsComponent } from '../../partialView/assetDetails/asset_tabs.component';
import { MannualMappingDialogComponent } from '../dialogs/mannual-mapping-dialog/mannual-mapping-dialog.component';
import { AutomationMappingDialogComponent } from '../dialogs/automation-mapping-dialog/automation-mapping-dialog.component';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { ReviewMappingDialogComponent } from '../dialogs/review-mapping-dialog/review-mapping-dialog.component';
import moment from 'moment';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { I } from '@angular/cdk/keycodes';


export interface SqSort extends Sort {
  //   /** The id of the column being sorted. */
  // active: string;

  // /** The sort direction. */
  // direction: SortDirection;
  type: string;
}

@Component({
  selector: 'app-hardware-change-report',
  templateUrl: './hardware-change-report.component.html',
  styleUrls: ['./hardware-change-report.component.scss']
})
export class HardwareChangeReportComponent implements OnInit {

  header: any ;
  message: any ;

  numRows: number;
  menuheader: any = (menuheaders as any).default
  show: boolean = false;
  isButtonVisible: boolean = false;
  submitted: boolean = false;
  setflag: boolean = false;
  public arrlength = 0;
  public fil = 0;
  public appliedfilters: any[] = [];
  isExport: Boolean = false;
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  protected _onDestroy = new Subject<void>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayTable: boolean = false;
  displaybtn: boolean = false;
  displayAutomatedbtn: boolean = false;

  displayedColumns: any[] = ["BIOSSerialNumber", "HardwareCategory", "AssetId", "HostName","SystemUser","ChangeType", "OldValue", "NewValue", "ChangeDate"];
  dataSource = new MatTableDataSource<any>();
  HideColumnList = ["CompanyName", "Plant", "InventoryNo", "AssetNo", "SubAssetId"]
  //ReportForm: FormGroup;
  //get f1() { return this.ReportForm.controls; };

  SessionGroupId: any;
  SessionRegionId: any;
  SessionCompanyId: any;
  SessionUserId: any;
  Count: any;
  IsPageLoad: Boolean = false;

  paginationParams: any;
  resultData: any;
  regionData: any[] = [];
  companyData: any[] = [];
  sbus: any[] = [];
  locations: any[] = [];

  searchTypes: any[] = [];

  hardwareCategoryTypes: any[] = [];

  optionValues: any[] = []
  statusList: any[] = [];         //'Group',  

  public searchCtrl: any;
  public hardwareCategoryCtrl: any;
  public optionMultiCtrl: any;
  public optionMultiFilterCtrl: FormControl = new FormControl();
  public filteredoptionMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public fromDateCtrl: any;
  public categoryFilterCtrl: FormControl = new FormControl();
  public filteredcategoryMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public ToDateCtrl: any;
  public manufacturerMultiFilterCtrl: FormControl = new FormControl();
  public filteredManufacturerMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public modelMultiCtrl: any;
  public modelMultiFilterCtrl: FormControl = new FormControl();
  public filteredModelMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public BIOSNoCtrl: any;

  public remarkMultiCtrl: any;

  //public assetSubTypeCtrl: any;
  //public assetTypeCtrl: any;
  public scanDateCtrl: any;
  manufacturerData: any = [];
  modelData: any = [];
  deviceCategoryData: any = [];

  constructor(public dialog: MatDialog, private httpService: HttpClient, public localService: LocalStoreService, public datepipe: DatePipe,
    public groupservice: GroupService,
    public companyservice: CompanyService,
    public toastr: ToastrService,
    public AllPathService: AllPathService,
    public regionservice: RegionService,
    private storage: ManagerService,
    public sbuService: SbuService,
    public locationService: LocationService,
    private fb: FormBuilder,
    public reportService: ReportService,
    private loader: AppLoaderService,
    public ars: AssetRetireService,
    public itamService: ITAMService,
    public confirmService: AppConfirmService,private jwtAuth: JwtAuthService,) {
      this.header = this.jwtAuth.getHeaders();
      this.message = this.jwtAuth.getResources();

      this.searchTypes = [
        { value: "1", name: "By "+this.header.ChangeType },
        { value: "2", name: "By Hardware" },
      ];
    
      this.hardwareCategoryTypes = [
        { value: "Managed", name: "Managed Hardware" },
        { value: "Unidentified", name: "Unidentified" },
      ];
    
      this.optionValues = [
        { value: "", name: this.header.All },
        { value: "1", name: this.header.PhysicalMemory },
        { value: "2", name: this.header.NoOfCores },
        { value: "3", name:  this.header.TotalHD}, //this.header.TotalHardDiskGB
        { value: "4", name: this.header.MotherBoardSerialNo },
        { value: "5", name: this.header.HostName },
        { value: "6", name: this.header.BIOSSerialNumber },
      ]
  }
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngOnInit(): void {
    this.loader.open();
    this.SessionGroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.SessionRegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.SessionCompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.SessionUserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);

    this.paginationParams = {
      pageSize: 50,
      currentPageIndex: 0,
      endIndex: 0,
      startIndex: 0,
      totalCount: 0,
    }

    this.searchCtrl = "";
    this.optionMultiCtrl = "";
    this.hardwareCategoryCtrl = "";
   
    this.ToDateCtrl = new Date();
    var todate = new Date();
    this.fromDateCtrl = new Date(todate.setMonth(todate.getMonth() - 1)); //  this.datepipe.transform(new Date(), 'dd-MMM-yyyy');;    

    this.minDate = new Date(this.fromDateCtrl);
    var max = new Date(this.minDate);
    this.maxDate = new Date(max.setFullYear(max.getFullYear() + 1));
    
    this.getFilterOption();

    // this.LocationGetdata();
    // //this.GetInitiatedData();
    // this.itamService.getNetworkInventoryFilters('MANUFACTURER', 1).subscribe(r => {
    //   if (!!r && r != null) {
    //     this.manufacturerData = r;
    //     this.getFilterManufacturer();
    //   }
    // });
    // this.itamService.getNetworkInventoryFilters('MODEL', 1).subscribe(r => {
    //   if (!!r && r != null) {
    //     this.modelData = r;
    //     this.getFilterModel();
    //   }
    // });
    this.GetInitiatedData1();
    this.loader.close();

  }
  GetInitiatedData1() {
    this.groupservice.GetFieldListByPageId(109, this.SessionUserId, this.SessionCompanyId).subscribe(r => {
      this.ListOfField = JSON.parse(r);
      var list = this.ListOfField.filter(x => x.Custom2 == "1").map(choice => choice.Custom1);
      console.log(this.ListOfField);
      console.log(list);
    });
  }
  hiddenHeader: boolean = false;
  AssetInfoHeaderCount: any = 0;
  HardwareInfoHeaderCount: any = 0;
  ExtraHeaderCount: any = 0;
  titleName: any;
  // HideAndAddColumnList() {

  //   if (this.typeMultiCtrl == 'Company Assets') {
  //     // this.displayedColumns = this.ListOfField;
  //     // this.displayedColumns = this.displayedColumns.filter(x => x.Custom2 == "1" ).map(choice => choice.Custom1);
  //     // this.displayedColumns = ['Icon','MappedBy', 'InventoryNo'].concat(this.displayedColumns);
  //     // console.log(this.displayedColumns);
  //     this.hiddenHeader = false;
  //     this.displayedColumns = ["Icon", "MappedBy", "InventoryNo", "AssetId", "SubAssetId", "ITSerialNo", "ADL2", "ADL3", "LocationName", "CategoryName", "UserEmailID", "HostName", "MotherBoardSerialNo", "scandate", "User", "City", "GeoLocation", "IPAddress", "Gateway", "Domain", "OSType", "Manufacturer", "Model", "Processor", "NoOfCores", "HardDisk", "PhysicalMemory", "DeviceCategory", "UsedCapacityofHDD"];
  //     this.ExtraHeaderCount = 2;
  //     this.HardwareInfoHeaderCount = 18;
  //     this.titleName = "Mapped Hardware information"
  //     console.log(this.displayedColumns);
  //   }
  //   else if (this.typeMultiCtrl == 'Review Asset') {
  //     // this.displayedColumns = this.ListOfField;
  //     // this.displayedColumns = this.displayedColumns.filter(x => x.Custom2 == "1" ).map(choice => choice.Custom1);
  //     // this.displayedColumns = ["Review", "ReviewRemark", "MappedBy"].concat(this.displayedColumns);
  //     // console.log(this.displayedColumns);
  //     this.hiddenHeader = false;
  //     this.displayedColumns = ["Review", "ReviewRemark", "MappedBy", "InventoryNo", "AssetId", "SubAssetId", "ITSerialNo", "ADL2", "ADL3", "LocationName", "CategoryName", "UserEmailID", "HostName", "MotherBoardSerialNo", "scandate", "AllocationStatus", "City", "GeoLocation", "IPAddress", "Gateway", "Domain", "OSType", "Manufacturer", "Model", "Processor", "NoOfCores", "HardDisk", "PhysicalMemory", "User", "DeviceCategory", "UsedCapacityofHDD"];
  //     this.ExtraHeaderCount = 3;
  //     this.HardwareInfoHeaderCount = 18;
  //     this.titleName = "Mapped Hardware information"
  //     console.log(this.displayedColumns);
  //   }
  //   else {
  //     // this.displayedColumns = this.ListOfField;
  //     // this.displayedColumns = this.displayedColumns.filter(x => x.Custom2 == "1" && x.ViewName == "Hardware Discovery Report View").map(choice => choice.Custom1);
  //     // this.displayedColumns = ['Icon'].concat(this.displayedColumns);
  //     // console.log(this.displayedColumns);
  //     this.hiddenHeader = true;
  //     this.displayedColumns = ["Icon", "HostName", "MotherBoardSerialNo", "BIOSNo", "scandate", "City", "GeoLocation", "IPAddress", "Gateway", "Domain", "OSType", "Manufacturer", "Model", "Processor", "NoOfCores", "HardDisk", "PhysicalMemory", "User", "DeviceCategory", "UsedCapacityofHDD"];
  //     this.HardwareInfoHeaderCount = 21;
  //     this.titleName = "Scanned Hardware information"
  //     console.log(this.displayedColumns);
  //   }
  // }
  ListOfField: any[] = [];

  minDate = new Date();
  maxDate = new Date();
  toDateValidation() {
    debugger;
    if (this.fromDateCtrl){
      this.minDate = this.fromDateCtrl;
      var max = new Date(this.minDate);
      this.maxDate = new Date(max.setFullYear(max.getFullYear() + 1));
    }
    this.ToDateCtrl = "";
      
  }
  LocationGetdata() {
    this.locations = [];
    var companyId = this.SessionCompanyId;
    var userId = this.SessionUserId;
    var IsGroupRegion = false;
    var SBUList = "";
    var moduleId = 55;

    this.reportService.GetLocationRightWiseForReport(companyId, userId, IsGroupRegion, SBUList, moduleId).subscribe(r => {
      r.forEach(element => {
        this.locations.push(element)
        //this.getFilterLocations();
      });
    })
  }

  handlePage(pageEvent: PageEvent) {
    this.IsPageLoad = false;
    this.paginationParams.pageSize = pageEvent.pageSize;
    this.paginationParams.currentPageIndex = pageEvent.pageIndex;
    this.paginationParams.endIndex = (this.paginationParams.currentPageIndex + 1) * pageEvent.pageSize;
    this.paginationParams.startIndex = this.paginationParams.currentPageIndex * pageEvent.pageSize;
    this.getHardwareData("");
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    //this.dataSource.paginator = this.paginator;
  }


  viewSelected() {

  }

  clearSelected() {
  }

  clearfilter() {
  }


  showTable() {
    this.IsPageLoad = true;
    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;
    this.getclear();
    this.getHardwareData("OnPageload");
    this.show = true;

  }

  onChangeSearchCtrl(option){
      this.BIOSNoCtrl = "";
      this.optionMultiCtrl = "";
      this.hardwareCategoryCtrl = "";
  }

  issort: Boolean = false;
  getHardwareData(action) {
    if (!this.ToDateCtrl) {
      this.toastr.warning(this.message.ToDate, this.message.AssetrakSays);

    }
    if (!this.fromDateCtrl) {
      this.toastr.warning(this.message.FromDate, this.message.AssetrakSays);

    }
    if (!this.fromDateCtrl || !this.ToDateCtrl) return;
    this.loader.open();
    this.resultData = [];
    if (action === 'IsExport') {
      this.isExport = true;
    }
    else if (action !== 'IsExport') {
      this.isExport = false;
      this.paginationParams.totalCount = 0;
      this.onChangeDataSourceC("");
    }

    if(!this.IsSearch){
      this.SearchText = "";
    }

    var data =
    {
      companyId: this.SessionCompanyId,
      GroupID: this.SessionGroupId,
      option: !!this.optionMultiCtrl ? this.optionMultiCtrl : 0,
      HardwareCategory : !!this.hardwareCategoryCtrl ? this.hardwareCategoryCtrl : "",
      itSerialNo: !!this.BIOSNoCtrl ? this.BIOSNoCtrl : "",
      AssetID: this.SearchOnColumn == "AssetId" ? this.SearchText : "",
      FromDate: !!this.fromDateCtrl ? moment(this.fromDateCtrl).format('YYYY-MM-DD') : null,//this.ReportForm.value.fromDate,
      ToDate: !!this.ToDateCtrl ? moment(this.ToDateCtrl).format('YYYY-MM-DD') : null, //DD-MMM-YYYY
      SearchText: "",
      pageNo: this.isExport ? 0 : this.paginationParams.currentPageIndex + 1,
      pageSize: this.isExport ? 0 : this.paginationParams.pageSize,
      isExport: this.isExport,
    }
    debugger;
    this.itamService.hardwareChangeReport(data).subscribe(response => {
      this.loader.close();
      debugger;
      if (action === 'IsExport') {
        if (!!response) {
          this.AllPathService.DownloadExportFile(response);
          console.log("URL", URL);
        }
      }
      else {
        this.resultData = response;
        console.log(this.resultData);
        this.displayTable = true;
        this.paginationParams.totalCount = this.resultData.length > 0 ? this.resultData[0].AssetListCount : 0
        // this.GetCountOfReport();
        // this.paginationParams.totalCount = 0;
        this.onChangeDataSourceC(this.resultData);
      }

    })
  }

  onChangeDataSourceC(value) {

    this.dataSource = new MatTableDataSource(value);
    this.dataSource.sort = this.sort;
  }

  numSelected: any = 0;
  getselectedIds: any[] = [];
  isAllSelected: boolean = false;
  selection = new SelectionModel<any>(true, []);
  masterToggle() {
    this.isAllSelected = !this.isAllSelected;
    this.selection.clear();
    this.getselectedIds = [];
  }
  isSelected(row) {
    this.isAllSelected = false;
    this.selection.toggle(row)
    this.numSelected = this.selection.selected.length;
    var idx = this.getselectedIds.indexOf(row.PreFarId);
    if (idx > -1) {
      this.getselectedIds.splice(idx, 1);
    }
    else {
      this.getselectedIds.push(row.PreFarId);
    }
  }

  getFilterOption() {
    debugger
    this.filteredoptionMulti.next(this.optionValues.slice());
    this.optionMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterTYPEOptions();
      });
  }

  protected filterTYPEOptions() {
    if (!this.optionValues) {
      return;
    }
    let search = this.optionMultiFilterCtrl.value;
    if (!search) {
      this.filteredoptionMulti.next(this.optionValues.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredoptionMulti.next(
      this.optionValues.filter(x => x.name.toLowerCase().indexOf(search) > -1)
    );
  }

  clickToExport() {
    debugger;
    if (this.displayTable == true && this.dataSource.data.length != 0) {
      this.getHardwareData("IsExport");
    } else {
      if (this.displayTable == false) {
        this.toastr.warning(this.message.NoDataselected, this.message.AssetrakSays);
        return null;
      }
      else {
        this.toastr.warning(this.message.NoDataAvailable, this.message.AssetrakSays);
        return null;
      }
    }
  }

  Unmapped(element) {
    this.confirmService.confirm({ message: "Are you sure you want to remove the mapping ? The said scanned hardware entry will be classified as unidentified and will be available for mapping against other assets if you continue ", title: this.message.AssetrakSays })
      .subscribe(res => {
        if (!!res) {

          this.itamService.unmappedassets(element.PreFarId).subscribe(response => {

            if (!!response && response.errorMessage == "OK") {
              this.toastr.success("The selected hardware has been unmapped successfully and is classified as unidentified.", this.message.AssetrakSays);
              var idx = this.resultData.indexOf(element);
              if (idx > -1) {
                this.resultData.splice(idx, 1)
              }
              this.onChangeDataSourceC(this.resultData);
            }

          });
        }
      });
  }


  opentablePopup(columnName) {
    const dialogconfigcom = new MatDialogConfig();
    dialogconfigcom.disableClose = true;
    dialogconfigcom.autoFocus = true;
    dialogconfigcom.width = "45%";
  }

  openFilter_PopUp() {
  }

  openEditGridDisplay() {
  }






  getFilterModel() {
    this.filteredModelMulti.next(this.modelData.slice());
    this.modelMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterModelMulti();
      });
  }
  protected filterModelMulti() {
    if (!this.modelData) {
      return;
    }
    let search = this.modelMultiFilterCtrl.value;
    if (!search) {
      this.filteredModelMulti.next(this.modelData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredModelMulti.next(
      this.modelData.filter(x => x.MODEL.toLowerCase().indexOf(search) > -1)
    );
  }

  toggleSelectAllModel(selectAllValue) {
    this.modelMultiCtrl = [];
    this.filteredModelMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (!!selectAllValue.checked) {
          let search = this.modelMultiFilterCtrl.value;
          if (!!search) {
            this.modelData.filter(x => x.MODEL.toLowerCase().indexOf(search) > -1).forEach(element => {
              this.modelMultiCtrl.push(element.MODEL);
            });
          }
          else {
            this.modelData.forEach(element => {
              this.modelMultiCtrl.push(element.MODEL);
            });
          }
        } else {
          this.modelMultiCtrl = "";
        }
      });
  }

  getFilterManufacturer() {
    this.filteredManufacturerMulti.next(this.manufacturerData.slice());
    this.manufacturerMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterManufacturerMulti();
      });
  }
  protected filterManufacturerMulti() {
    if (!this.manufacturerData) {
      return;
    }
    let search = this.manufacturerMultiFilterCtrl.value;
    if (!search) {
      this.filteredManufacturerMulti.next(this.manufacturerData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredManufacturerMulti.next(
      this.manufacturerData.filter(x => x.MANUFACTURER.toLowerCase().indexOf(search) > -1)
    );
  }

  limit = 10;
  // offset = 0;
  // getFilterCategoryType() {
  //   this.filteredcategoryMulti.next(this.ListOfCategory.slice());
  //   this.categoryFilterCtrl.valueChanges
  //     .pipe(takeUntil(this._onDestroy))
  //     .subscribe(() => {
  //       this.filterCategoryMulti();
  //     });
  // }
  // protected filterCategoryMulti() {
  //   if (!this.ListOfCategory) {
  //     return;
  //   }
  //   let search = this.categoryFilterCtrl.value;
  //   if (!search) {
  //     this.filteredcategoryMulti.next(this.ListOfCategory.slice());
  //     return;
  //   } else {
  //     search = search.toLowerCase();
  //   }
  //   this.filteredcategoryMulti.next(
  //     this.ListOfCategory.filter(x => x.CategoryName.toLowerCase().indexOf(search) > -1)
  //   );
  // }


  applyFilterC(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editGridpop() {
    let title = 'Edit Grid Display';
    const dialogRef = this.dialog.open(GetFieldsComponent, {
      width: '60vw',
      height: 'auto',
      data: { title: title, payload: this.ListOfField }
    })
    dialogRef.afterClosed().subscribe(result => {

      if (!!result) {
        console.log(result)
        this.ListOfField = result;
        this.displayedColumns = this.ListOfField;
        this.displayedColumns = this.ListOfField.filter(x => x.Custom2 == "1").map(choice => choice.Custom1);
        //  this.displayedColumns = ['Icon'].concat(this.displayedColumns);
      }
    })
  }

  PageId = 109;
  ReportFlag: boolean = false;
  openPopUp(data: any = {}) {

    this.ReportFlag = false;
    let title = 'Add new member';
    var payload = {
      PageId: this.PageId,
      element: data,
      ListOfField: this.ListOfField,
      ReportFlag: this.ReportFlag,
      Pagename: "Hardware Change Report"
    }
    const dialogRef = this.dialog.open(assetTabsComponent, {
      width: 'auto',

      data: { title: title, payload: payload }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
      })
  }

  mannualMapping(element) {

    var configdata = {
      LocationIdList: this.locations,
      GroupId: this.SessionGroupId,
      UserId: this.SessionUserId,
      CompanyId: this.SessionCompanyId,
      selected: [element]//this.selection.selected
    }
    let title = 'Add new member';
    const dialogRef = this.dialog.open(MannualMappingDialogComponent, {
      width: 'auto',
      disableClose: true,
      data: { configdata: configdata }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
        else {

          var idx = this.resultData.indexOf(element);
          if (idx > -1) {
            this.resultData.splice(idx, 1)
          }
          this.onChangeDataSourceC(this.resultData);
        }

      })
  }

  automationMapping() {
    var configdata = {
      LocationIdList: this.locations,
      GroupId: this.SessionGroupId,
      UserId: this.SessionUserId,
      CompanyId: this.SessionCompanyId
    }
    let title = 'Add new member';
    const dialogRef = this.dialog.open(AutomationMappingDialogComponent, {
      width: 'auto',
      disableClose: true,
      data: { configdata: configdata }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
        this.getHardwareData("OnPageload");
      })
  }

  reviewMapping(element) {
    var configdata = {
      LocationIdList: this.locations,
      GroupId: this.SessionGroupId,
      UserId: this.SessionUserId,
      CompanyId: this.SessionCompanyId,
      selected: [element]
    }
    let title = 'Add new member';
    const dialogRef = this.dialog.open(ReviewMappingDialogComponent, {
      width: 'auto',
      disableClose: true,
      data: { configdata: configdata }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
        this.getHardwareData("OnPageload");
      })
  }

  //Search Functionality
  private isButtonVisibleADL2 = false;
  public isButtonVisibleUser = false;
  private isButtonVisibleADL3 = false;
  private isButtonVisibleSupplier = false;
  private isButtonVisibleGRNNo = false;
  private isButtonVisibleSerialNo = false;
  private isButtonVisibleITSerialNo = false;
  private isButtonVisiblePONumber = false;
  private isButtonVisibleEqipmentNumber = false;
  private isButtonVisibleCPPNumber = false;
  private isButtonVisibleBarCode = false;
  SearchText: any;
  SearchOnColumn: any;
  IsSearch: boolean = false;

  AssetNoFilter = new FormControl();


  SerchAssetid(columnName) {

    this.IsPageLoad = false;
    this.IsSearch = false;
    this.SearchText = "";
    this.SearchOnColumn = "";

    this.SearchOnColumn = columnName;
    this.SearchText = !this.AssetNoFilter.value ? "" : this.AssetNoFilter.value;
    if (!!this.SearchText) {
      this.IsSearch = true;
      this.SearchText = this.SearchText.trim();
    }

    if (this.IsSearch) {
      this.paginator.pageIndex = 0;
      this.paginationParams.pageSize = 50;
      this.paginationParams.currentPageIndex = 0;

      this.getHardwareData("SearchText");
    }
  }

  ClearSerch(columnName, isflag) {

    this.SearchOnColumn = "";
    this.SearchText = "";
    this.AssetNoFilter.setValue("");
    this.IsSearch = false;

    this.isButtonVisible = !isflag;
    this.isButtonVisibleBarCode = !isflag;
    this.isButtonVisibleADL2 = !isflag;
    this.isButtonVisibleADL3 = !isflag;
    this.isButtonVisibleSupplier = !isflag;
    this.isButtonVisibleGRNNo = !isflag;
    this.isButtonVisibleSerialNo = !isflag;
    this.isButtonVisibleITSerialNo = !isflag;
    this.isButtonVisiblePONumber = !isflag;
    this.isButtonVisibleEqipmentNumber = !isflag;
    this.isButtonVisibleCPPNumber = !isflag;

    // this.showTable();
    this.IsPageLoad = false;
    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;
    this.getclear();
    this.getHardwareData("");
  }


  Serchicon(columnName, isflag) {


    this.SearchOnColumn = "";
    this.SearchText = "";
    this.AssetNoFilter.setValue("");
    this.IsSearch = false;

    this.isButtonVisible = isflag;
    this.isButtonVisibleBarCode = isflag;
    this.isButtonVisibleADL2 = isflag;
    this.isButtonVisibleADL3 = isflag;
    this.isButtonVisibleSupplier = isflag;
    this.isButtonVisibleGRNNo = isflag;
    this.isButtonVisibleSerialNo = isflag;
    this.isButtonVisibleITSerialNo = isflag;
    this.isButtonVisiblePONumber = isflag;
    this.isButtonVisibleEqipmentNumber = isflag;
    this.isButtonVisibleCPPNumber = isflag;
    this.isButtonVisibleUser = isflag;
    this.SearchOnColumn = columnName;

    if (columnName == "AssetId") { this.isButtonVisible = !isflag; }
    if (columnName == "Barcode") { this.isButtonVisibleBarCode = !isflag; }
    if (columnName == "ADL2") { this.isButtonVisibleADL2 = !isflag; }
    if (columnName == "ADL3") { this.isButtonVisibleADL3 = !isflag; }
    if (columnName == "Suplier") { this.isButtonVisibleSupplier = !isflag; }
    if (columnName == "GRNNo") { this.isButtonVisibleGRNNo = !isflag; }
    if (columnName == "SerialNo") { this.isButtonVisibleSerialNo = !isflag; }
    if (columnName == "ITSerialNo") { this.isButtonVisibleITSerialNo = !isflag; }
    if (columnName == "PONumber") { this.isButtonVisiblePONumber = !isflag; }
    if (columnName == "equipmentNo") { this.isButtonVisibleEqipmentNumber = !isflag; }
    if (columnName == "CPPNumber") { this.isButtonVisibleCPPNumber = !isflag; }
    if (columnName == "User") { this.isButtonVisibleUser = !isflag; }

  }

  getclear() {
    this.SearchOnColumn = "";
    this.SearchText = "";
    this.AssetNoFilter.setValue("");
    this.IsSearch = false;

    this.isButtonVisible = false;
    this.isButtonVisibleADL2 = false;
    this.isButtonVisibleADL3 = false;
    this.isButtonVisibleSupplier = false;
    this.isButtonVisibleGRNNo = false;
    this.isButtonVisibleSerialNo = false;
    this.isButtonVisibleITSerialNo = false;
    this.isButtonVisiblePONumber = false;
    this.isButtonVisibleEqipmentNumber = false;
    this.isButtonVisibleCPPNumber = false;
    this.isButtonVisibleBarCode = false;
  }
  orderBy: any;
  sortOrder: any;
  sortColumn($event: SqSort) {

    if ($event.active == 'scandate') {
      if ($event.direction == "asc" || $event.direction == "") {
        this.getHardwareData("")
      } else {
        this.orderBy = $event.active;
        this.sortOrder = $event.direction;
        this.getHardwareData("Sort")
      }

    }
  }



}
