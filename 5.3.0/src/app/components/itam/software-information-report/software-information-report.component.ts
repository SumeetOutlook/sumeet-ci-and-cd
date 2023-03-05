import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { ITAMService } from 'app/components/services/ITAMService';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import * as headers from '../../../../assets/Headers.json';
import { LocalStoreService } from 'app/shared/services/local-store.service';
import { DatePipe } from '@angular/common';
import { GroupService } from 'app/components/services/GroupService';
import { CompanyService } from 'app/components/services/CompanyService';
import { RegionService } from 'app/components/services/RegionService';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { SbuService } from 'app/components/services/SbuService';
import { LocationService } from 'app/components/services/LocationService';
import { UserRoleService } from 'app/components/services/UserRoleService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AssetClassService } from '../../services/AssetClassService';
import { AssetCategoryService } from 'app/components/services/AssetCategoryService';
import { AssetTypeService } from 'app/components/services/AssetTypeService';
import { AssetSubTypeService } from 'app/components/services/AssetSubTypeService';
import { ReconciliationService } from 'app/components/services/ReconciliationService';
import { ReportService } from 'app/components/services/ReportService';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { AllPathService } from 'app/components/services/AllPathServices';
import { GetFieldsComponent } from 'app/components/partialView/get-fields/get-fields.component';
import * as menuheaders from '../../../../assets/MenuHeaders.json'
import { AssetRetireService } from '../../services/AssetRetireService';
import { ViewUploadDocumentsDialogComponent } from '../../partialView/view-upload-documents-dialog/view-upload-documents-dialog.component'
import * as resource from '../../../../assets/Resource.json';
import { ToastrService } from 'ngx-toastr';
import { assetTabsComponent } from '../../partialView/assetDetails/asset_tabs.component';
import moment from 'moment';

export interface SqSort extends Sort {
  //   /** The id of the column being sorted. */
  // active: string;

  // /** The sort direction. */
  // direction: SortDirection;
  type: string;
}

@Component({
  selector: 'app-software-information-report',
  templateUrl: './software-information-report.component.html',
  styleUrls: ['./software-information-report.component.scss']
})
export class SoftwareInformationReportComponent implements OnInit {

 
  header: any = (headers as any).default;
  message: any = (resource as any).default;

  numRows: number;
  menuheader: any = (menuheaders as any).default
  show: boolean = false;
  isButtonVisible: boolean = false;
  submitted: boolean = false;
  setflag: boolean =false;
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
  displayedHeaders: string[] = [this.header.InventoryNumber, this.header.AssetNo, this.header.SAID,
  this.header.AssetClass, this.header.ADL1, this.header.ADL2, this.header.ADL3, this.header.AcquisitionCost, this.header.WDV,
  this.header.EquipmentNumber, this.header.AssetCondition, this.header.AssetCriticality, this.header.TransferId, this.header.TransferStatus,
  this.header.SourceLocation, this.header.TransferTo, this.header.PreviousInventoryInfo,
  this.header.InitiatedBy, this.header.InitiatedOn, this.header.FinancialLevelTransferBy, this.header.FinancialLevelTransferOn,
  this.header.BlockOwner, this.header.SourceBODate, this.header.DestinationBlockOwner, this.header.DestinationBODate, this.header.A1, this.header.Approval1On,
  this.header.A2, this.header.Approval2On, this.header.A3, this.header.Approval3On, this.header.WithdrawBy, this.header.WithdrawOn,
  this.header.ApprovedDeclinedby, this.header.ApprovedDeclinedOn, this.header.Comment, this.header.PhysicalAssetTransferBy, this.header.PhysicalAssetTransferon, this.header.InventoryStatus, this.header.RetirementStatus,
  this.header.AllocationStatus];

  displayedColumns: any[] = [];
  // displayedColumns: string[] = ["InventoryNo", "AssetNo", "SubNo", "AssetClass", "AssetClassShortName", "AssetName", "AssetDescription",
  //   "Cost", "WDV", "EquipmentNumber", "AssetCondition", "AssetCriticality", "TransferId", "TransferStatus", "TransferFrom", "TransferTo", "PreviousInventoryInfo", "InitiatedBy", "InitiatedOn", "FinancialLevelTransferby",
  //   "FinancialLevelTransferon", "AssetClassOwner", "SourceBODate", "DestinationAssetClassOwner", "DestinationBODate", "Approver1", "Approval1on", "Approver2", "Approval2on",
  //   "Approver3", "Approval3on", "Withdrawby", "Withdrawon", "Approved/DeclinedBy", "Approved/DeclinedOn", "Comment", "PhysicalAssetTransferby", "PhysicalAssetTransferon",
  //   "InventoryStatus", "RetirementStatus", "AllocationStatus"];
  dataSource = new MatTableDataSource<any>();

  ReportForm: FormGroup;
  get f1() { return this.ReportForm.controls; };

  SessionGroupId: any;
  SessionRegionId: any;
  SessionCompanyId: any;
  SessionUserId: any;
  Count: any;
  IsPageLoad: Boolean = false;
  paginationParams: any;
  resultData: any=[];
  regionData: any[] = [];
  companyData: any[] = [];
  sbus: any[] = [];
  locations: any[] = [];
  AssetClassData: any[] = [];
  categories: any[] = [];
  public filteredoptionMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  typeData: any[] = [];
  subTypeData: any[] = [];
  transferIdData: any[] = [];

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
  optionValues: any[] =[
    {value:"",name : this.header.All},
    {value:"Physical Memory",name : this.header.PhysicalMemory},
    {value:"OS",name : this.header.OS},
    {value:"Total HardDisc",name : this.header.TotalHardDiskGB},
    {value:"Processor",name : this.header.Processor},
    {value:"NoOfCores",name : this.header.NoOfCores},
    {value:"Manufacturer",name : this.header.Manufacturer},
    {value:"Model",name : this.header.Model}
  ]
  filterTypes: any[] = ['IT Serial No','Asset No / Sub No']

  statusList: any[] = [];         //'Group',
  DisplayHeaders: string[] = [this.header.InventoryNumber, this.header.PrefarId, this.header.AID, this.header.SAID, this.header.AcquisitionDate, this.header.AssetClass, this.header.ADL1, this.header.ADL2, this.header.ADL3, this.header.Supplier, this.header.Location, this.header.Quantity, this.header.CostCenter, this.header.Room, this.header.StorageLocation, this.header.UserEmail, this.header.User, this.header.Cost, this.header.WDV, this.header.ConvertedCost, this.header.ConvertedWDV, this.header.EqipmentNumber, this.header.AssetCondition, this.header.AssetCriticality, this.header.InventoryIndicator, this.header.WDVDate, this.header.SerialNo, this.header.UOM, this.header.ITSerialNo, this.header.RetirementId, this.header.SBU, this.header.TypeOfAsset, this.header.SubTypeOfAsset, this.header.PreviousInventoryInfo, this.header.RetireType, this.header.RetireDate, this.header.ProposedRetireDate, this.header.RetirementStatus, this.header.RetirementAmount, this.header.CustomerName, this.header.InitiatorName, this.header.InitiatedDate, this.header.FinancialLevelApproverName, this.header.FinancialLevelApproveron, this.header.AssetClassOwner, this.header.BlockOwnerDate, this.header.A1, this.header.Approval1On, this.header.A2, this.header.Approval2On, this.header.A3, this.header.Approval3On, this.header.WithdroverName, this.header.WithdrawOn, this.header.ApprovedDeclinedby, this.header.ApprovedDeclinedOn, this.header.Comment, this.header.RetireDocument, this.header.ReadytoDisposeby, this.header.ReadytoDisposeon, this.header.ADF];
  public sbuMultiCtrl: FormControl = new FormControl();
  public sbuMultiFilterCtrl: FormControl = new FormControl();
  public filteredsbuMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public option: FormControl = new FormControl();
  public plantMultiFilterCtrl: FormControl = new FormControl();
  //public optionMultiFilterCtrl: FormControl = new FormControl();
  public filteredPlantsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public categoryMultiCtrl: FormControl = new FormControl();
  public categoryMultiFilterCtrl: FormControl = new FormControl();
  public filteredCategorysMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public statusMultiCtrl: FormControl = new FormControl();
  public statusMultiFilterCtrl: FormControl = new FormControl();
  public filteredStatusMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public transferidMultiCtrl: FormControl = new FormControl();
  public transferidFilterCtrl: FormControl = new FormControl();
  public filteredtransferidMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(public dialog: MatDialog, private httpService: HttpClient, public localService: LocalStoreService, public datepipe: DatePipe,
    public groupservice: GroupService,
    public companyservice: CompanyService,
    public toastr: ToastrService,
    public AllPathService: AllPathService,
    public regionservice: RegionService,
    private storage: ManagerService,
    public sbuService: SbuService,
    public locationService: LocationService,
    private userRoleService: UserRoleService,
    private fb: FormBuilder,
    private assetClassService: AssetClassService,
    public categoryservice: AssetCategoryService,
    public typeservice: AssetTypeService,
    public subTypeservice: AssetSubTypeService,
    public reconciliationService: ReconciliationService,
    public reportService: ReportService,
    private loader: AppLoaderService,
    public ars: AssetRetireService,
    public itamService: ITAMService) {

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

    this.ReportForm = this.fb.group({
    //  sbuMultiCtrl: [''],
      // optionMultiCtrl: [''],
      // optionMultiFilterCtrl: [''],
      // fromDate: [''],
      // toDate: [''],
      filterType: [''],
      itSerialNo: [''],
      assetNo: [''],
      subNo: ['']
    //  categoryMultiCtrl: [''],
     // statusMultiCtrl: [''],
    //  transferidMultiCtrl: ['', [Validators.required]],
    //  sbuMultiFilterCtrl: [''],
     // plantMultiFilterCtrl: [''],
     // categoryMultiFilterCtrl: [''],
    //  statusMultiFilterCtrl: [''],
    //  transferidFilterCtrl: [''],

    });
    this.paginationParams = {
      pageSize: 50,
      currentPageIndex: 0,
      endIndex: 0,
      startIndex: 0,
      totalCount: 0,
    }
    // this.SBUGetdata();
    // this.CategoryGetdata();
    // this.TransferStatusGetdata();
    this.GetInitiatedData();
    this.getFilterOption();

    // this.GetTransferIds();
    // this.LocationGetdata();
    this.loader.close();

  }

  handlePage(pageEvent: PageEvent) {
    this.IsPageLoad = false;
    this.paginationParams.pageSize = pageEvent.pageSize;
    this.paginationParams.currentPageIndex = pageEvent.pageIndex;
    this.paginationParams.endIndex = (this.paginationParams.currentPageIndex + 1) * pageEvent.pageSize;
    this.paginationParams.startIndex = this.paginationParams.currentPageIndex * pageEvent.pageSize;
    this.getHadrwareData("");
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    //this.dataSource.paginator = this.paginator;
  }
  GetRetireIcon(value, type) {    
    var groupdata = value;
    var fileNames = groupdata.split('/');

    var MergeId = fileNames[0];
    var prefarid = fileNames[1];
    var PreHistoryId = fileNames[2];
    var ADDL_Tag = fileNames[3];
    var SplitType = fileNames[4];

    if (type == 'Retired') {
          if (PreHistoryId === "9" || PreHistoryId === "Retired") {
            return true;
          }
          else {
            return false;
          }
    }
    if (type == 'Quantity') {
          if (PreHistoryId === "9" || PreHistoryId === "Retired") {
            return false;
          }
          else if (SplitType == "Quantity") {
            return true;
          }
          else {
            return false;
          }
    }
    if (type == 'Parent') {
        if (PreHistoryId === "9" || PreHistoryId === "Retired") {
          return false;
        } else if ((MergeId != "0" && MergeId != null) && (prefarid === MergeId)) {
          return true;
        }
        else if ((ADDL_Tag != "0" && ADDL_Tag != null) && (MergeId === null || MergeId === 0) && (prefarid === ADDL_Tag)) {
          return true;
        }
        else {
          return false;
        }
    }
    if (type == 'Group') {
        if (PreHistoryId === "9" || PreHistoryId === "Retired") {

        }
        else if ((MergeId != "0" && MergeId != null) && (prefarid != MergeId)) {
          return true;
        }
        else if ((ADDL_Tag != "0" && ADDL_Tag != null) && (MergeId === null || MergeId === 0) && (prefarid != ADDL_Tag)) {
          return true;
        }
        else {
          return false;
        }
    }

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
    this.getHadrwareData("OnPageload");
    this.show = true;
    
  }
   clickToExport() {
    if(this.displayTable == true && this.dataSource.data.length != 0){
      this.getHadrwareData("IsExport");
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

  getFilterOption() {
    debugger
    this.filteredoptionMulti.next(this.optionValues.slice());
    this.ReportForm.controls['optionMultiFilterCtrl'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterTYPEOptions();
      });
  }

  protected filterTYPEOptions() {
    if (!this.optionValues) {
      return;
    }
    let search = this.ReportForm.controls['optionMultiFilterCtrl'].value;
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

  issort: Boolean = false;
  getHadrwareData(action) {
    if(!this.ReportForm.value.filterType) return ;
    if(this.ReportForm.value.filterType=='IT Serial No'&&!this.ReportForm.value.itSerialNo){
      this.toastr.warning(this.message.ITSerialNoRequired, this.message.AssetrakSays);
      return;
    }

    if(this.ReportForm.value.filterType=='Asset No / Sub No' && !(this.ReportForm.value.assetNo && this.ReportForm.value.subNo)){
      this.toastr.warning('Asset No / Sub No is required', this.message.AssetrakSays);
      return;
    }
  //  if(!this.ReportForm.value.fromDate ||!this.ReportForm.value.itSerialNo|| !this.ReportForm.value.toDate ) 
    this.loader.open();
    // this.dataSource = null;
    this.resultData = [];
    if (action === 'IsExport') {
      this.isExport = true;
    }
    else if (action !== 'IsExport') {
      this.isExport = false;
      this.paginationParams.totalCount = 0;
      this.onChangeDataSourceC("");
    }
    else if(action == "Sort") {
      this.issort = true;
      // this.colunname = this.variable1;
    }

debugger;
this.ReportForm.value.fromDate = moment(this.ReportForm.value.fromDate).format('DD-MMM-YYYY');
this.ReportForm.value.toDate = moment(this.ReportForm.value.toDate).format('DD-MMM-YYYY');
let data;
if(this.ReportForm.value.filterType=='IT Serial No')
     data =
    {
     companyId: this.SessionCompanyId,
      itSerialNo:this.ReportForm.value.itSerialNo,
      pageNo: this.isExport ? 0 : this.paginationParams.currentPageIndex + 1,
      pageSize: this.isExport ? 0 : this.paginationParams.pageSize,
      isExport:this.isExport,
      searchtext: this.IsSearch ? this.SearchText : "",
      Orderby : this.issort?this.orderBy:'',
      SortOrder :this.issort?this.sortOrder:'asc',
    }
    else if(this.ReportForm.value.filterType=='Asset No / Sub No')
     data = {
     companyId: this.SessionCompanyId,
      pageNo: this.isExport ? 0 : this.paginationParams.currentPageIndex + 1,
      pageSize: this.isExport ? 0 : this.paginationParams.pageSize,
      isExport:this.isExport,
      searchtext: this.IsSearch ? this.SearchText : "",
      AssetNo: this.ReportForm.value.assetNo,
      SubNo: this.ReportForm.value.subNo,
      Orderby : this.issort?this.orderBy:'',
      SortOrder :this.issort?this.sortOrder:'asc'
    }
    
    debugger;
    this.itamService.getSWListByITSerialNo(data).subscribe(response => {
      this.loader.close();
      debugger;
      if (action === 'IsExport') {
        debugger;
        if (!!response) {
          this.AllPathService.DownloadExportFile(response);
          console.log("URL", URL);
        }
      }
      else {
       this.resultData = response;
        // console.log(this.resultData);
        this.displayTable = true;
        this.paginationParams.totalCount = this.resultData.length>0?this.resultData[0].AssetListCount:0
       // this.GetCountOfReport();
        // this.paginationParams.totalCount = 0;
        this.onChangeDataSourceC(this.resultData);
      }

    })
  }

  onChangeDataSourceC(value) {
    if(!value)
    value ='';
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.sort = this.sort;
  }

  applyFilterC(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



  //Changes for Page field data and edit grid display

  ListOfField: any[] = [];

  GetInitiatedData() {

    let url3 = this.groupservice.GetFieldListByPageId(110,this.SessionUserId,this.SessionCompanyId);
    forkJoin([url3]).subscribe(results => {

      if (!!results[0]) {

        this.ListOfField = JSON.parse(results[0]);
        this.displayedColumns = this.ListOfField;
        this.displayedColumns = this.displayedColumns.filter(x => x.Custom2 == "1" ).map(choice => choice.Custom1);
      //  this.displayedColumns = ['Icon'].concat(this.displayedColumns);
        console.log("Displayed: ", this.displayedColumns)
      }
      this.loader.close();
    })
  }

  editGridpop() {
    debugger
    let title = 'Edit Grid Display';
    const dialogRef = this.dialog.open(GetFieldsComponent, {
      width: '60vw',
      height: 'auto',
      data: { title: title, payload: this.ListOfField }
    })
    dialogRef.afterClosed().subscribe(result => {
      debugger
      if (!!result) {
        console.log(result)
        this.ListOfField = result;
        this.displayedColumns = this.ListOfField;
        this.displayedColumns = this.ListOfField.filter(x => x.Custom2 == "1" ).map(choice => choice.Custom1);
      //  this.displayedColumns = ['Icon'].concat(this.displayedColumns);
      }
    })
  }



  GetADFData(currentdata) {

    if (!!currentdata) {
      var ADFValue = currentdata;
      var fileNames = ADFValue.split('/');

      var prefarId = fileNames[0];
      var status = fileNames[1];
      this.reportService.GetADF(prefarId).subscribe(response => {

        var path = response;
        this.AllPathService.ViewATFandADF(path);
      })
    }
  }


  showpdfFORARF(value) {
    if ((value.indexOf('Retirement Approved') > -1) || (value.indexOf('Available for Disposal') > -1)) {
      return true;
    } else {
      return false;
    }
  }


  showpdfForADF(value) {
    if ((value.indexOf('Disposed') > -1)) {
      return true;
    } else {
      return false;
    }
  }


  GetCountOfReport() {
    var LocationIdList = []
    var categoryIdList = []
    if (!this.ReportForm.value.categoryMultiCtrl) {
      this.categories.forEach(x => {
        categoryIdList.push(x.AssetCategoryId);
      })
    }
    else {

      categoryIdList = this.ReportForm.value.categoryMultiCtrl
    }

    if (!this.ReportForm.value.plantMultiCtrl) {
      this.locations.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }
    else {
      LocationIdList = this.ReportForm.value.option
    }
    var data =
    {
      selectedStatusList: this.ReportForm.value.statusMultiCtrl,
      CompanyIds: [this.SessionCompanyId],
      tableName: "HardwareChangeReport",
      UserId: this.SessionUserId,
      blockIdList: [],
      locationIdList: LocationIdList,
      // searchtext: '',
      // searchColumn: '',
      searchtext: this.IsSearch ? this.SearchText : "",
      searchColumn: this.IsSearch ? this.SearchOnColumn : "",
      SBUList: this.ReportForm.value.sbuMultiCtrl,
      CategoryIdList: categoryIdList,
      typeOfAssetList: [],
      subTypeOfAssetList: [],
      RetireIdList: this.ReportForm.value.transferidMultiCtrl,
    }

    this.reportService.GetReportCount(data).subscribe(response => {

      this.Count = response;
      this.paginationParams.totalCount = this.Count;
    })
  }
 PageId =110;
  openPopUp(data: any = {}) {
    debugger;
    return null;
    let title = 'Add new member';
    const dialogRef = this.dialog.open(assetTabsComponent, {
      width: 'auto',
      disableClose: true,
      data: { title: title, payload: data.PreFARId,PageId:this.PageId }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
      })
  }

  viewDocuments(element) {

    var RetireId = element[this.header.RetiredAssetId];
    this.ars.GetDocumentlistByRetireAssetID(RetireId).subscribe(r => {

      if (!!r) {
        var documentList = [];
        documentList = JSON.parse(r);
        console.log("Doc", documentList)
        const dialogRef = this.dialog.open(ViewUploadDocumentsDialogComponent, {
          width: '980px',
          disableClose: true,
          data: { title: "", payload: documentList }
        });
        dialogRef.afterClosed().subscribe(result => {

        })
      }
    })
  }


  //Search Functionality
  private isButtonVisibleADL2 = false;
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
    debugger;
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

      this.getHadrwareData("SearchText");
    }
  }

  ClearSerch(columnName, isflag) {
    debugger;
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
    this.getHadrwareData("");
  }


  Serchicon(columnName, isflag) {
    debugger;
    if (this.ReportForm.valid) {
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
    }
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

  orderBy:any;
sortOrder:any;
  sortColumn($event: SqSort) {
    debugger;
    if ($event.active=='ScanDate' || $event.active=='LastusedDate') {
      
        if ($event.direction == "asc" || $event.direction == "") {
          this.getHadrwareData("")
        } else {
          this.orderBy = $event.active;
          this.sortOrder = $event.direction;
          this.getHadrwareData("Sort")
        }
      
    }
  }

}
