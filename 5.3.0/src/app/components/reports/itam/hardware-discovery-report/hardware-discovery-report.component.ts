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
import * as headers from '../../../../../assets/Headers.json';
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
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { AllPathService } from 'app/components/services/AllPathServices';
import { GetFieldsComponent } from 'app/components/partialView/get-fields/get-fields.component';
import * as menuheaders from '../../../../../assets/MenuHeaders.json'
import { AssetRetireService } from '../../../services/AssetRetireService';
import { ViewUploadDocumentsDialogComponent } from '../../../partialView/view-upload-documents-dialog/view-upload-documents-dialog.component'
import * as resource from '../../../../../assets/Resource.json';
import { ToastrService } from 'ngx-toastr';
import { assetTabsComponent } from '../../../partialView/assetDetails/asset_tabs.component';
import { MannualMappingDialogComponent } from '../../dialog/mannual-mapping-dialog/mannual-mapping-dialog.component';
import { AutomationMappingDialogComponent } from '../../dialog/automation-mapping-dialog/automation-mapping-dialog.component';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { ReviewMappingDialogComponent } from '../../dialog/review-mapping-dialog/review-mapping-dialog.component';



export interface SqSort extends Sort {
  //   /** The id of the column being sorted. */
  // active: string;

  // /** The sort direction. */
  // direction: SortDirection;
  type: string;
}
@Component({
  selector: 'app-hardware-discovery-report',
  templateUrl: './hardware-discovery-report.component.html',
  styleUrls: ['./hardware-discovery-report.component.scss']
})

export class HardwareDiscoveryReportComponent implements OnInit {

  header: any = (headers as any).default;
  message: any = (resource as any).default;

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

  displayedColumns: any[] = [];
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
  ListOfCategory: any[] = [];
  ListOfCategory1: any[] = [];
  ListOfAssetType: any[] = [];
  ListOfAssetSubType: any[] = [];




  selectedSBUList: any[] = [];
  selectedPlantIdList: any[] = [];

  transferStatus: any[] = [
    { value: "", name: this.header.All },
    { value: "Unapproved Transfer", name: this.header.UnapprovedTransfer },
    { value: "Rejected Transfer", name: this.header.RejectedTransfer },
    { value: "Request Withdrawn", name: this.header.RequestWithdrawn },
    { value: "Avail for Physical Transfer", name: this.header.AvailforPhysicalTransfer },
    { value: "Completed Transfer", name: this.header.CompletedTransfer },
    { value: "Assets In Transit", name: this.header.AssetsInTransit }
  ];

  assetTypes: any[] = [
    { value: "Company Assets", name: "Managed Hardware" },
    //{ value: "Review Asset", name: "Managed Hardware (For Review)" },
    { value: "Out Of Group", name: "Unidentified" },

  ];

  statusList: any[] = [];         //'Group',
  DisplayHeaders: string[] = [this.header.InventoryNumber, this.header.PrefarId, this.header.AID, this.header.SAID, this.header.AcquisitionDate, this.header.AssetClass, this.header.ADL1, this.header.ADL2, this.header.ADL3, this.header.Supplier, this.header.Location, this.header.Quantity, this.header.CostCenter, this.header.Room, this.header.StorageLocation, this.header.UserEmail, this.header.User, this.header.Cost, this.header.WDV, this.header.ConvertedCost, this.header.ConvertedWDV, this.header.EqipmentNumber, this.header.AssetCondition, this.header.AssetCriticality, this.header.InventoryIndicator, this.header.WDVDate, this.header.SerialNo, this.header.UOM, this.header.ITSerialNo, this.header.RetirementId, this.header.SBU, this.header.TypeOfAsset, this.header.SubTypeOfAsset, this.header.PreviousInventoryInfo, this.header.RetireType, this.header.RetireDate, this.header.ProposedRetireDate, this.header.RetirementStatus, this.header.RetirementAmount, this.header.CustomerName, this.header.InitiatorName, this.header.InitiatedDate, this.header.FinancialLevelApproverName, this.header.FinancialLevelApproveron, this.header.AssetClassOwner, this.header.BlockOwnerDate, this.header.A1, this.header.Approval1On, this.header.A2, this.header.Approval2On, this.header.A3, this.header.Approval3On, this.header.WithdroverName, this.header.WithdrawOn, this.header.ApprovedDeclinedby, this.header.ApprovedDeclinedOn, this.header.Comment, this.header.RetireDocument, this.header.ReadytoDisposeby, this.header.ReadytoDisposeon, this.header.ADF];
  public sbuMultiCtrl: FormControl = new FormControl();
  public sbuMultiFilterCtrl: FormControl = new FormControl();

  public filteredtypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public typeMultiCtrl: any;
  public typeMultiFilterCtrl: FormControl = new FormControl();

  public plantMultiCtrl: any;
  public plantMultiFilterCtrl: FormControl = new FormControl();
  public filteredPlantsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public categoryMultiCtrl: any;
  public categoryFilterCtrl: FormControl = new FormControl();
  public filteredcategoryMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public manufacturerMultiCtrl: any;
  public manufacturerMultiFilterCtrl: FormControl = new FormControl();
  public filteredManufacturerMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public modelMultiCtrl: any;
  public modelMultiFilterCtrl: FormControl = new FormControl();
  public filteredModelMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public assetTypeMultiCtrl: any;
  public assetTypeMultiFilterCtrl: FormControl = new FormControl();
  public filteredAssetTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public assetSubTypeMultiCtrl: any;
  public assetSubTypeMultiFilterCtrl: FormControl = new FormControl();
  public filteredAssetSubTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public deviceCategoryMultiCtrl: any;
  public deviceCategoryMultiFilterCtrl: FormControl = new FormControl();
  public filteredDeviceCategoryMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
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
    public confirmService: AppConfirmService) {

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

    // this.ReportForm = this.fb.group({
    //   typeMultiCtrl: [''],
    //   typeMultiFilterCtrl: [''],
    //   plantMultiCtrl: [''],      
    //   plantMultiFilterCtrl: [''],
    //   deviceManfucaturer: [''],
    //   deviceModel: [''],
    //   deviceCategory: [''],
    // });

    this.paginationParams = {
      pageSize: 50,
      currentPageIndex: 0,
      endIndex: 0,
      startIndex: 0,
      totalCount: 0,
    }

    this.typeMultiCtrl = this.header.CompanyAssets;
    this.manufacturerMultiCtrl = "";
    this.plantMultiCtrl = "";
    this.modelMultiCtrl = "";
    this.deviceCategoryMultiCtrl = "";
    this.categoryMultiCtrl = "";
    this.assetSubTypeMultiCtrl = "";
    this.assetTypeMultiCtrl = "";
    this.scanDateCtrl = "";

    this.LocationGetdata();
    this.GetInitiatedData();
    //this.GetInitiatedData1();
    
    this.getFilterTYPESS()
    this.loader.close();

  }
  GetInitiatedData1() {
    this.groupservice.GetFieldListByPageId(108, this.SessionUserId,this.SessionCompanyId).subscribe(r => {
      this.ListOfField = JSON.parse(r);
      this.displayedColumns = this.ListOfField;
      this.displayedColumns = this.displayedColumns.filter(x => x.Custom2 == "1").map(choice => choice.Custom1);
      this.displayedColumns = ['Icon'].concat(this.displayedColumns);
      console.log(this.displayedColumns);
    });
  }
  hiddenHeader :boolean = false;
  HideAndAddColumnList() {
    debugger;
    if (this.typeMultiCtrl == 'Company Assets') {
      // this.displayedColumns = this.ListOfField;
      // this.displayedColumns = this.displayedColumns.filter(x => x.Custom2 == "1" ).map(choice => choice.Custom1);
      // this.displayedColumns = ['Icon'].concat(this.displayedColumns);
      // console.log(this.displayedColumns);
      this.hiddenHeader = false;
      this.displayedColumns = ["Icon","MappedBy",  "InventoryNo", "AssetId", "SubAssetId", "ITSerialNo","ADL2", "ADL3", "LocationName", "CategoryName", "TypeOfAsset", "SubTypeOfAsset",  "UserEmailID", "HostName", "MotherBoardSerialNo", "scandate", "User","City","GeoLocation","IPAddress", "Gateway", "Domain", "OSType", "Manufacturer", "Model", "Processor", "NoOfCores", "HardDisk", "PhysicalMemory",  "DeviceCategory", "UsedCapacityofHDD"];
      console.log(this.displayedColumns);
    }
    else if(this.typeMultiCtrl == 'Review Asset'){
      this.hiddenHeader = false;
      this.displayedColumns = ["Review", "MappedBy", "InventoryNo", "AssetId", "SubAssetId","ITSerialNo", "ADL2", "ADL3", "LocationName", "CategoryName", "TypeOfAsset", "SubTypeOfAsset",  "UserEmailID", "HostName", "MotherBoardSerialNo", "scandate", "AllocationStatus","City","GeoLocation","IPAddress", "Gateway", "Domain", "OSType", "Manufacturer", "Model", "Processor", "NoOfCores", "HardDisk", "PhysicalMemory", "User", "DeviceCategory", "UsedCapacityofHDD"];
      console.log(this.displayedColumns);
    }
    else {
      this.hiddenHeader = true;
      this.displayedColumns = ["Icon", "HostName", "MotherBoardSerialNo","ITSerialNo", "scandate", "City","GeoLocation","IPAddress", "Gateway", "Domain", "OSType", "Manufacturer", "Model", "Processor", "NoOfCores", "HardDisk", "PhysicalMemory", "User","UserEmailID", "DeviceCategory", "UsedCapacityofHDD"];
      console.log(this.displayedColumns);
    }
  }
  ListOfField: any[] = [];
  GetInitiatedData() {
    //let url3 = this.groupservice.GetFieldListByPageId(108,this.SessionUserId);
    let url1 = this.itamService.getNetworkInventoryFilters('MANUFACTURER', 1);
    let url2 = this.itamService.getNetworkInventoryFilters('MODEL', 1);
    let url3 = this.itamService.getNetworkInventoryFilters('DEVICECATEGORY', 1);
    let url4 = this.itamService.getNetworkInventoryFilters('CATEGORY', 1);
    let url5 = this.itamService.getNetworkInventoryFilters('ASSETTYPE', 1);
    let url6 = this.itamService.getNetworkInventoryFilters('ASSETSUBTYPE', 1);

    forkJoin([url1, url2, url3, url4, url5, url6]).subscribe(results => {

      if (!!results[0]) {
        this.manufacturerData = results[0];
        console.log(this.manufacturerData);
        this.getFilterManufacturer();
      }
      if (!!results[1]) {
        this.modelData = results[1];
        console.log(results[1]);
        this.getFilterModel();
      }
      if (!!results[2]) {
        this.deviceCategoryData = results[2];
        console.log(results[2]);
        this.getFilterDeviceCategory();
      }
      if (!!results[3]) {
        this.ListOfCategory = results[3];
        this.ListOfCategory1 = results[3];
        console.log(this.ListOfCategory);
        this.getFilterCategoryType();
      }
      if (!!results[4]) {
        this.ListOfAssetType = results[4];
        console.log(results[4]);
        this.getFilterAssetType();
      }
      if (!!results[5]) {
        this.ListOfAssetSubType = results[5];
        console.log(results[5]);
        this.getFilterAssetSubType();
      }
      this.loader.close();
    })
  }

  LocationGetdata() {
    this.locations = [];
    this.filteredPlantsMulti = new ReplaySubject<any[]>(1);
    this.selectedPlantIdList = [];
    this.plantMultiCtrl = "";
    var companyId = this.SessionCompanyId;
    var userId = this.SessionUserId;
    var IsGroupRegion = false;
    var SBUList = !!this.selectedSBUList ? this.selectedSBUList.join(',') : "";
    var moduleId = 55;
    
    this.reportService.GetLocationRightWiseForReport(companyId, userId, IsGroupRegion, SBUList, moduleId).subscribe(r => {
      r.forEach(element => {
        this.locations.push(element)
        this.getFilterLocations();
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
  hideTask() {
    console.log(this.typeMultiCtrl);
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
  issort: Boolean = false;
  getHardwareData(action) {
    this.HideAndAddColumnList();
    this.loader.open();
    this.issort = false;
    this.isExport = false;
    this.resultData = [];
    if (action === 'IsExport') {
      this.isExport = true;
    }
    else if (action !== 'IsExport') {
      this.isExport = false;
      this.paginationParams.totalCount = 0;
      this.onChangeDataSourceC("");
    }
    else if (action == "Sort") {
      this.issort = true;
    }
    var LocationIdList;
    if (!this.plantMultiCtrl) {
      LocationIdList = 0;
    }
    else if (this.typeMultiCtrl == 'Company Assets') {
      LocationIdList = this.plantMultiCtrl
    }
    else {
      LocationIdList = 0;
    }

    debugger;
    var data =
    {
      locationId: LocationIdList,
      companyId: this.SessionCompanyId,
      groupId: this.SessionGroupId,
      isExport: this.isExport,
      option: !!this.typeMultiCtrl ? this.typeMultiCtrl : "",
      pageNo: this.isExport ? 0 : this.paginationParams.currentPageIndex + 1,
      pageSize: this.isExport ? 0 : this.paginationParams.pageSize,
      Model: !!this.modelMultiCtrl ? this.modelMultiCtrl[0] : "",
      Orderby: this.issort ? this.orderBy : '',
      SortOrder: this.issort ? this.sortOrder : 'asc',
      Devicecategory: !!this.deviceCategoryMultiCtrl ? this.deviceCategoryMultiCtrl[0] : "",
      manufacturer: !!this.manufacturerMultiCtrl ? this.manufacturerMultiCtrl[0] : "",
      searchtext: this.IsSearch ? this.SearchText : "",
      Category : !!this.categoryMultiCtrl ? this.categoryMultiCtrl : "",
      Assettype : !!this.assetTypeMultiCtrl ? this.assetTypeMultiCtrl : "",
      Assetsubtype : !!this.assetSubTypeMultiCtrl ? this.assetSubTypeMultiCtrl : "",
      Datewisefilter : !!this.scanDateCtrl ? this.scanDateCtrl : "0"
      //searchColumn: this.IsSearch ? this.SearchOnColumn : "",
    }
    this.itamService.getNetworkInventoryAssets(data).subscribe(response => {
      this.loader.close();
      debugger
      if (action === 'IsExport') {
        if (!!response) {
          this.AllPathService.DownloadExportFile(response);
          console.log("URL", URL);
        }
      }
      else {
        this.resultData = response;
        console.log(this.resultData);
        this.displaybtn = true;
        this.displayTable = true;
        if (!!this.typeMultiCtrl && this.typeMultiCtrl == "Company Assets")
          this.displayAutomatedbtn = false;
        else
          this.displayAutomatedbtn = true;
        //this.GetCountOfReport();
        // this.paginationParams.totalCount = 0;
        this.paginationParams.totalCount = this.resultData.length > 0 ? this.resultData[0].AssetListCount : 0
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

  clickToExport() {
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
          debugger;
          this.itamService.unmappedassets(element.PreFarId).subscribe(response => {
            debugger;
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


  getFilterTYPESS() {
    this.filteredtypeMulti.next(this.assetTypes.slice());
    this.typeMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterTYPEMulti();
      });
  }

  protected filterTYPEMulti() {
    if (!this.assetTypes) {
      return;
    }
    let search = this.typeMultiFilterCtrl.value;
    if (!search) {
      this.filteredtypeMulti.next(this.assetTypes.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredtypeMulti.next(
      this.assetTypes.filter(x => x.name.toLowerCase().indexOf(search) > -1)
    );
  }

  getFilterLocations() {
    this.filteredPlantsMulti.next(this.locations.slice());
    this.plantMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPlantsMulti();
      });
  }

  protected filterPlantsMulti() {
    if (!this.locations) {
      return;
    }
    let search = this.plantMultiFilterCtrl.value;
    if (!search) {
      this.filteredPlantsMulti.next(this.locations.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredPlantsMulti.next(
      this.locations.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1)
    );
  }

  getFilterAssetSubType() {
    this.filteredAssetSubTypeMulti.next(this.ListOfAssetSubType.slice());
    this.assetSubTypeMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAssetSubTypeMulti();
      });
  }
  protected filterAssetSubTypeMulti() {
    if (!this.ListOfAssetSubType) {
      return;
    }
    let search = this.assetSubTypeMultiFilterCtrl.value;
    if (!search) {
      this.filteredAssetSubTypeMulti.next(this.ListOfAssetSubType.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredAssetSubTypeMulti.next(
      this.ListOfAssetSubType.filter(x => x.SubTypeOfAsset.toLowerCase().indexOf(search) > -1)
    );
  }

  toggleSelectAllAssetSubType(selectAllValue) {
    this.assetSubTypeMultiCtrl = [];
    this.filteredAssetTypeMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (!!selectAllValue.checked) {
          let search = this.assetSubTypeMultiFilterCtrl.value;
          if (!!search) {
            this.ListOfAssetSubType.filter(x => x.SubTypeOfAsset.toLowerCase().indexOf(search) > -1).forEach(element => {
              this.assetSubTypeMultiCtrl.push(element.STAId);
            });
          }
          else {
            this.ListOfAssetSubType.forEach(element => {
              this.assetSubTypeMultiCtrl.push(element.STAId);
            });
          }
        } else {
          this.assetSubTypeMultiCtrl = "";
        }
      });
  }

  getFilterAssetType() {
    this.filteredAssetTypeMulti.next(this.ListOfAssetType.slice());
    this.assetTypeMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAssetTypeMulti();
      });
  }
  protected filterAssetTypeMulti() {
    if (!this.ListOfAssetType) {
      return;
    }
    let search = this.assetTypeMultiFilterCtrl.value;
    if (!search) {
      this.filteredAssetTypeMulti.next(this.ListOfAssetType.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredAssetTypeMulti.next(
      this.ListOfAssetType.filter(x => x.TypeOfAsset.toLowerCase().indexOf(search) > -1)
    );
  }

  toggleSelectAllAssetType(selectAllValue) {
    this.assetTypeMultiCtrl = [];
    this.filteredAssetTypeMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (!!selectAllValue.checked) {
          let search = this.assetTypeMultiFilterCtrl.value;
          if (!!search) {
            this.ListOfAssetType.filter(x => x.TypeOfAsset.toLowerCase().indexOf(search) > -1).forEach(element => {
              this.assetTypeMultiCtrl.push(element.TAId);
            });
          }
          else {
            this.ListOfAssetType.forEach(element => {
              this.assetTypeMultiCtrl.push(element.TAId);
            });
          }
        } else {
          this.assetTypeMultiCtrl = "";
        }
      });
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

  getFilterDeviceCategory() {
    this.filteredDeviceCategoryMulti.next(this.deviceCategoryData.slice());
    this.deviceCategoryMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDeviceCategoryMulti();
      });
  }
  protected filterDeviceCategoryMulti() {
    if (!this.deviceCategoryData) {
      return;
    }
    let search = this.deviceCategoryMultiFilterCtrl.value;
    if (!search) {
      this.filteredDeviceCategoryMulti.next(this.deviceCategoryData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredDeviceCategoryMulti.next(
      this.deviceCategoryData.filter(x => x.DEVICECATEGORY.toLowerCase().indexOf(search) > -1)
    );
  }

  toggleSelectAllDeviceCategory(selectAllValue) {
    this.deviceCategoryMultiCtrl = [];
    this.filteredDeviceCategoryMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (!!selectAllValue.checked) {
          let search = this.deviceCategoryMultiFilterCtrl.value;
          if (!!search) {
            this.deviceCategoryData.filter(x => x.DEVICECATEGORY.toLowerCase().indexOf(search) > -1).forEach(element => {
              this.deviceCategoryMultiCtrl.push(element.DEVICECATEGORY);
            });
          }
          else {
            this.deviceCategoryData.forEach(element => {
              this.deviceCategoryMultiCtrl.push(element.DEVICECATEGORY);
            });
          }
        } else {
          this.deviceCategoryMultiCtrl = "";
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

  toggleSelectAllManufacturer(selectAllValue) {
    this.manufacturerMultiCtrl = [];
    this.filteredManufacturerMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (!!selectAllValue.checked) {
          let search = this.manufacturerMultiFilterCtrl.value;
          if (!!search) {
            this.manufacturerData.filter(x => x.MANUFACTURER.toLowerCase().indexOf(search) > -1).forEach(element => {
              this.manufacturerMultiCtrl.push(element.MANUFACTURER);
            });
          }
          else {
            this.manufacturerData.forEach(element => {
              this.manufacturerMultiCtrl.push(element.MANUFACTURER);
            });
          }
        } else {
          this.manufacturerMultiCtrl = "";
        }
      });
  }
  limit = 10;
  offset = 0;
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
      this.ListOfCategory.filter(x => x.CategoryName.toLowerCase().indexOf(search) > -1)
    );
  }
  toggleSelectAllcategory(selectAllValue) {
    this.categoryMultiCtrl = [];
    this.filteredcategoryMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (!!selectAllValue.checked) {
          let search = this.categoryFilterCtrl.value;
          if (!!search) {
            this.ListOfCategory.filter(x => x.CategoryName.toLowerCase().indexOf(search) > -1).forEach(element => {
              this.categoryMultiCtrl.push(element.CategoryId);
            });
          }
          else {
            this.ListOfCategory.forEach(element => {
              this.categoryMultiCtrl.push(element.CategoryId);
            });
          }
        } else {
          this.categoryMultiCtrl = "";
        }
      });
  }



  applyFilterC(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleSelectAllSBU(selectAllValue: boolean) {
    this.filteredtypeMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.typeMultiCtrl.patchValue(val);
        } else {
          this.typeMultiCtrl.patchValue([]);
        }
      });
  }

  toggleSelectPlantAll(selectAllValue) {
    this.plantMultiCtrl = [];
    this.filteredPlantsMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (!!selectAllValue.checked) {
          let search = this.plantMultiFilterCtrl.value;
          if (!!search) {
            this.locations.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1).forEach(element => {
              this.plantMultiCtrl.push(element.LocationId);
            });
          }
          else {
            this.locations.forEach(element => {
              this.plantMultiCtrl.push(element.LocationId);
            });
          }
        } else {
          this.plantMultiCtrl = "";
        }
      });
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

  PageId = 108;
  openPopUp(data: any = {}) {
    return null;
    let title = 'Add new member';
    const dialogRef = this.dialog.open(assetTabsComponent, {
      width: 'auto',
      disableClose: true,
      data: { title: title, payload: data.PrefarId, PageId: this.PageId }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
      })
  }

  mannualMapping(element) {
    debugger;
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
          debugger;
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
  
  reviewMapping(element){
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
    debugger;
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

  mapLocation(GeoLocation) {
    if (!GeoLocation) {
    } else {
      window.open('https://www.google.com/maps/search/?api=1&query=' + GeoLocation, '_blank');
    }
  }
}
