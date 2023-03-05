import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input,Output,EventEmitter } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { SelectionModel } from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { LocalStoreService } from 'app/shared/services/local-store.service';
import { HttpClient } from '@angular/common/http';
import { EditAssetPopupComponent } from './edit_popup/edit_popup.component';
import { ApproveRejectComponent } from './approve_reject_popup/approvereject.component';
import { LocationService } from 'app/components/services/LocationService';
import { AssetService } from 'app/components/services/AssetService';
import { GroupService } from 'app/components/services/GroupService';
import { CompanyBlockService } from 'app/components/services/CompanyBlockService';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/UserService';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { assetTabsComponent } from '../../partialView/assetDetails/asset_tabs.component';
import { CompanyLocationService } from '../../services/CompanyLocationService';
import { GetFieldsComponent } from 'app/components/partialView/get-fields/get-fields.component'
import * as menuheaders from '../../../../assets/MenuHeaders.json';
import { AllPathService } from 'app/components/services/AllPathServices';
import { ViewUploadDocumentsDialogComponent } from '../../partialView/view-upload-documents-dialog/view-upload-documents-dialog.component';
import { Sort } from '@angular/material/sort';
import { ReportService } from 'app/components/services/ReportService';
import { ExportFieldsComponent } from 'app/components/partialView/export-fields/export-fields.component';
import { MultiSearchDialogComponent } from 'app/components/partialView/multi-search-dialog/multi-search-dialog.component'; 
export interface SqSort extends Sort {
  //   /** The id of the column being sorted. */
  // active: string;

  // /** The sort direction. */
  // direction: SortDirection;
  type: string;
}

interface AssetGroup {
  id: string;
  name: string;
}

interface Plant {
  id: number;
  name: string;
}
interface AssetClass {
  id: number;
  name: string;
}

interface Status {
  id: number;
  name: string;
}

const SelectStatus: Status[] = [
  { name: 'Available For Approval', id: 1 },
  { name: 'Information Pending', id: 2 },
  { name: 'Asset With Error', id: 3 },

];
const AssetGrroup: AssetGroup[] = [
  { name: 'Asset FAR', id: 'FAR' },
  { name: 'Asset Non-FAR', id: 'NFAR' },
  { name: 'Asset GRN', id: 'GRN' },

];

@Component({
  selector: 'app-reviewasset',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewAssetComponent implements OnInit, OnDestroy {
  public ReviewInfo: FormGroup;
  public assetData: any[];
  Headers: any ;
  message: any ;
  public arrlength = 0;
  public getselectedData: any[] = [];
  deleteRecordOptions: { option: any; data: any; };
  companyData: any;
  public newdataSource = [];
  public isallchk: boolean;
  public ShowErrorType: boolean = false;
  public showApproveRejectbtn: boolean = false;
  public ShowEditbtn: boolean = false;
  public getApproveValue: any;
  public CreateReviewData: any;
  private isButtonVisible = false;
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
  Category: any[] = [];
  Location: any[] = [];
  GridData: any;
  serachtext: any;
  colunname: any;
  menuheader: any = (menuheaders as any).default
  Grid: any[] = [];
  Configuration: any;
  public ShowGridData: any;
  SelectedPlantItems: any[] = [];
  SelectedAssetItems: any[] = [];
  SelectedCategoryItems: any[] = [];
  SelectedStatusItems: any[] = [];
  locationchecboxId: any;
  //userId: number;
  locationId: number;
  //CompanyId: number;
  pageSize: number;
  pageNo: number;
  stageOfAssets: any;
  isForManageGroup: boolean;
  projectType: any;
  projectId: number;
  assetStatus: any;
  ErrorList: string;
  searchBy: string;
  pageName: string;
  groupType: string;
  userloclist: string;
  isSearch: boolean;
  AssetClassId: number;
  AssetCategoryId: number;
  SelectedId: any;
  AssetNoFilter = new FormControl();
  SubNoFilter = new FormControl();
  isExport: Boolean = false;
  displayTable: boolean = false;
  displaybtn: boolean = false;
  // plantSelected='All';
  panelOpenState = true;
  @Output() insuranceEndDate: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('mySel') skillSel: MatSelect;
  protected _onDestroy = new Subject<void>();

  public AssetGroup: AssetGroup[] = AssetGrroup;
  public assetGroupCtrl: any;
  public filteredAssetClassMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  protected assetclass: AssetClass[];
  public AssetClassFilter: FormControl = new FormControl();
  public AssetMultiFilterCtrl: FormControl = new FormControl();
  public AssetGrpMultiFilterCtrl: ReplaySubject<any[]> = new ReplaySubject<any[]>(2);

  public CategoryCtrl: any;
  public CategoryFilter: FormControl = new FormControl();
  public filteredCategory: ReplaySubject<any[]> = new ReplaySubject<any[]>(3);

  public status: Status[] = SelectStatus;
  public StatusCtrl: any;


  protected plants: Plant[];
  public plantMultiCtrl: any;
  public plantMultiFilterCtrl: FormControl = new FormControl();
  public filteredPlantsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(4);

  filteredValues = {
    AssetNo: '', SubNo: '', CapitalizationDate: '',
    AssetClass: '', AssetType: '',
    AssetSubType: '', UOM: '', AssetName: '',
    AssetDescription: '', Qty: '', Cost: '', WDV: '',
    EquipmentNO: '', AssetCondition: '', AssetCriticality: ''

  };

  constructor(public dialog: MatDialog, private httpService: HttpClient,
    private confirmService: AppConfirmService, private fb: FormBuilder,
    public locationservice: LocationService, public toastr: ToastrService,
    public assetservice: AssetService, private loader: AppLoaderService,
    public localService: LocalStoreService, public groupservice: GroupService,
    public companyBlockService: CompanyBlockService, private storage: ManagerService,
    private router: Router,
    public alertService: MessageAlertService,
    public us: UserService,
    public gs: GroupService,
    public cls: CompanyLocationService,
    public AllPathService: AllPathService,
    public reportService: ReportService,
    private jwtAuth: JwtAuthService
  ) {
    this.Headers = this.jwtAuth.getHeaders();
    this.message = this.jwtAuth.getResources();
  }

  //displayedHeaders = ['', this.Headers.AssetNo, this.Headers.SAID, this.Headers.AssetClass, this.Headers.ADL2, this.Headers.AcquisitionDate, this.Headers.Location,this.Headers.Quantity, this.Headers.UOM, this.Headers.AcquisitionCost, this.Headers.WDV, this.Headers.UploadErrors, this.Headers.AssetCondition, this.Headers.AssetCriticality, this.Headers.Excel, this.Headers.RejectionComment]
  //displayedColumns: any[] = ['select', 'AssetNo', 'SubNo', 'AssetClass', 'AssetName', 'CapitalizationDate', 'Location', 'Quantity', 'UOM', 'Cost', 'WDV', 'UploadErrors', 'AssetCondition', 'AssetCriticality', 'UploadReference', 'RejectionComment'];
  displayedColumns: any[] = [];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  allSelected = false;

  public statusFilterCtrl: FormControl = new FormControl();
  ReportForm: FormGroup;

  GroupId: any;
  RegionId: any;
  UserId: any;
  CompanyId: any;
  paginationParams: any;
  ngOnInit() {
debugger;
    this.paginationParams = {
      pageSize: 50,
      currentPageIndex: 0,
      endIndex: 0,
      startIndex: 0,
      totalCount: 0,
    }
    
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);

    this.ReportForm = this.fb.group({
      statusFilterCtrl : ['', [Validators.required]],
    })
    this.assetGroupCtrl = "";
    this.plantMultiCtrl = "";
    this.CategoryCtrl = "";
    this.GetInitiatedData();
    this.GetCategoryAndLocationList();
    this.CheckWetherApprovalConfigExits();
    this.filteredAssetClassMulti.next(this.AssetGroup.slice());

    // this.AssetNoFilter.valueChanges.subscribe((AssetNoFilterValue) => {
    //   this.filteredValues['AssetNo'] = AssetNoFilterValue;
    //   this.dataSource.filter = this.filteredValues.AssetNo;
    // });
  }

  ngOnDestroy() {
    debugger;
    console.clear();
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  ListOfPagePermission: any[] = [];
  ReviewListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  ReviewPermissionIdList: any[] = [];
  ExportedFields: any[] = [];
  ListOfField1: any[] = [];
  searchColumns: any[] = [];
  GetInitiatedData() {
    debugger;
    let url1 = this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.UserId, "22");
    let url2 = this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.UserId, "18,19,20");
    let url3 = this.us.CheckFreezePeriodStatus(this.GroupId, this.RegionId, this.CompanyId);
         //  let url6 = this.groupservice.GetFieldList(66,this.SessionUserId);
    forkJoin([url1, url2 , url3]).subscribe(results => {
      debugger;
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
      if (!!results[1]) {
        this.ReviewListOfPagePermission = JSON.parse(results[1]);
        console.log("ReviewListOfPagePermission", this.ReviewListOfPagePermission)
        if (this.ReviewListOfPagePermission.length > 0) {
          for (var i = 0; i < this.ReviewListOfPagePermission.length; i++) {
            this.ReviewPermissionIdList.push(this.ReviewListOfPagePermission[i].ModulePermissionId);
          }
        }
      }
      if (!!results[2]) {
        debugger;
        var FreezePeriod = results[2];
        if (!!FreezePeriod) {
          this.alertService.alert({ message: this.message.NotAuthorisedToAccessONFreezePeriod, title: this.message.AssetrakSays })
          .subscribe(res => {
            this.router.navigateByUrl('h/a')
          })
        }
      }
         // if (!!results[1]) {

      //   this.ListOfField1 = JSON.parse(results[1]);
      //   this.searchColumns = this.ListOfField1.filter(x => x.SearchOptionEnabled == true).map(choice => choice);
      // }
    })
  }
  LocationList = [];
  CategoryList = [];
  CategoryList1 = [];
  ListOfField: any[] = [];
  ListOfFilter: any[] = [];
  ListOfFilterName: any[] = [];
  GetCategoryAndLocationList() {
    debugger;
    let url1 = this.cls.GetLocationListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 22);
    let url2 = this.companyBlockService.GetCategoryListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 22);
    let url3 = this.gs.GetFieldListByPageId(22,this.UserId,this.CompanyId);
    let url4 = this.gs.GetFilterIDlistByPageId(22);
    forkJoin([url1, url2, url3, url4]).subscribe(results => {
      debugger;
      if (!!results[0]) {
        this.LocationList = JSON.parse(results[0]);
        this.getFilterLocation();
      }
      if (!!results[1]) {
        this.CategoryList = JSON.parse(results[1]);
        this.CategoryList1 = JSON.parse(results[1]);
        this.getFilterCategory();
      }
      if (!!results[2]) {
        this.ListOfField = JSON.parse(results[2]);
        this.ListOfField.forEach((element,index)=>{
          if(element.Custom1 == 'MissingDocument') 
            this.ListOfField.splice(index,1);
         });
        this.searchColumns = this.ListOfField.filter(x => x.SearchOptionEnabled == true).map(choice => choice);
        this.displayedColumns = this.ListOfField;
        this.displayedColumns = this.displayedColumns.filter(x => x.Custom2 == "1").map(choice => choice.Custom1);
        this.displayedColumns = ['Select'].concat(this.displayedColumns);
       // this.displayedColumns = this.displayedColumns.concat("Photo");
        console.log(this.displayedColumns);
      }
      if (!!results[3]) {
        this.ListOfFilter = JSON.parse(results[3]);
        if (!!this.ListOfFilter) {
          this.ListOfFilter.forEach(x => this.ListOfFilterName.push(x.FilterName))
        }
        console.log(this.ListOfFilter);
      }
      debugger;
      //this.GetPageSession();
    })
  }


  parentFun(val){
    // if(val == 'SBU'){ this.onchangeSBU('')}
    // if(val == 'Location'){ 
    //   this.ListOfCategory = this.ListOfCategory1;
    //   this.getFilterCategoryType();
    // }    
  }

  SelectAssetCheckbox(event) {
    debugger;
    this.showmultiSearch = false;
    this.SelectedAssetItems = event;
  }
  SelectPlantCheckbox(event) {

    this.SelectedPlantItems = event;
  }
  changeCategory(event) {

    this.SelectedCategoryItems = event;
  }
  limit = 10;
  offset = 0;
  getFilterLocation() {
    this.filteredPlantsMulti.next(this.LocationList.slice(0, this.offset + this.limit));
    this.offset += this.limit;
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
  allSelectedplantMultiCtrl : boolean = false
  toggleSelectAll(selectAllValue) {    
    this.plantMultiCtrl = [];
    this.filteredPlantsMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {        
        if (!!selectAllValue.checked) {
          //this.plantMultiCtrl.patchValue(val);
          this.LocationList.forEach(element => {
            this.plantMultiCtrl.push(element);
          });
        } else {
          this.plantMultiCtrl = "";
        }
        this.CategoryList = this.CategoryList1;
        this.getFilterCategory();
      });
  }

  toggleSelectAllcategory(selectAllValue) {
    this.CategoryCtrl =[];
    this.filteredCategory.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (!!selectAllValue.checked) {
          this.CategoryList.forEach(element => {
            this.CategoryCtrl.push(element);
          });  
        } else {
          this.CategoryCtrl="";
        }
      });
  }

  getFilterCategory() {
    this.filteredCategory.next(this.CategoryList.slice());
    this.CategoryFilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCategorydata();
      });
  }

  protected filterCategorydata() {
    if (!this.CategoryList) {
      return;
    }
    let search = this.CategoryFilter.value;
    if (!search) {
      this.filteredCategory.next(this.CategoryList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCategory.next(
      this.CategoryList.filter(x => x.AssetCategoryName.toLowerCase().indexOf(search) > -1)
    );
  }

  hideGoBtn: boolean = false;
  selectedStatus(event) {
    debugger;
    this.hideGoBtn = false;
    //this.SelectedStatusItems = event.id;
    if (event == "" || event == null) {
      this.hideGoBtn = false;
    }
    else if (event == 1) {
      this.hideGoBtn = true;
    } else if (event == 2) {
      this.hideGoBtn = true;
    } else if (event == 3) {
      this.hideGoBtn = true;
    }
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  openEditReview() {
    var UploadStatus = !this.StatusCtrl ? 0 : parseInt(this.StatusCtrl);
    this.getselectedData["pagename"] = "reviewasset";
    this.getselectedData["UploadStatus"] = UploadStatus;
    this.router.navigate(['/h1/cc'], {
      state: this.getselectedData
    });
    //this.router.navigate(['create_assets/edit_review_asset',this.getselectedData]);
  }

  openEdit() {
    var component: any
    component = EditAssetPopupComponent;
    const dialogRef = this.dialog.open(component, {
      panelClass: 'group-form-dialog',
      disableClose: true,
      data: {
        component1: 'ReviewComponent',
        name: this.getselectedData,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        // this.updateCompanyValue = result;
        // this.updateCompanyValue['CompanyId']=getValue[1].CompanyId;
        //  this.UpdateCompany(this.updateCompanyValue)
      }
    });
  }

  openApproveRejectDialog(...getValue) {
    this.getApproveValue = getValue[0];
    var component: any
    component = ApproveRejectComponent;
    const dialogRef = this.dialog.open(component, {
      panelClass: 'group-form-dialog',
      width: '500px',
      disableClose: true,
      data: {
        component1: 'ApproveRejectComponent',
        value: getValue[0],
        name: getValue[1],
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {

        if (result == "Approve SucessFully") {
          this.ContinueApprovebtn();
        }
        else {
          this.ContinueRejectbtn(result);
        }
      }

    });
  }

  ContinueApprovebtn() {
    this.loader.open();
    var AssetsDetail =
    {
      CompanyId: this.CompanyId,
      AssetList: this.getselectedIds.join(','),
    }
    this.assetservice.GetAssetApproval(AssetsDetail)
      .subscribe(r => {
        this.loader.close();
        this.clearSelected();
        if (r == "Assets are Approved Sucessfully.") {
          this.toastr.success(this.message.ReviewAssetApproved, this.message.AssetrakSays);
        }
      })
  }

  ContinueRejectbtn(result) {
    this.loader.open();
    var AssetsDetail =
    {
      UserId: this.UserId,
      CompanyId: this.CompanyId,
      AssetList: this.getselectedIds.join(','),
      RejectComment: result
    }
    //this.ShowGridData = ReviewData;
    this.assetservice.AssetsRejection(AssetsDetail).subscribe(r => {
      debugger;
      this.loader.close();
      this.toastr.success(this.message.AssetSendInfoRequestSuccess, this.message.AssetrakSays);
      // if (r == "Assets are Rejected Sucessfully.") {
      //   this.toastr.success(this.message.ReviewAssetRejected, this.message.AssetrakSays);
      // }
      this.clearSelected();
    })
  }
  //====== Bind Data To DataSource========  
  handlePage(pageEvent: PageEvent) {
    this.paginationParams.pageSize = pageEvent.pageSize;
    this.paginationParams.currentPageIndex = pageEvent.pageIndex;
    this.paginationParams.endIndex = (this.paginationParams.currentPageIndex + 1) * pageEvent.pageSize;
    this.paginationParams.startIndex = this.paginationParams.currentPageIndex * pageEvent.pageSize;
    if (!!this.variable && !!this.variable1) {
      this.GetAssetForReviewAssetBindData("SearchText")
    }
    if(this.multipleserach= true && this.multiSearch.length > 0)
    {
      this.GetAssetForReviewAssetBindData("multiplesearch");
    }
    else {
      this.GetAssetForReviewAssetBindData("")
    }

  }
  GetAssetForReviewAsset() {
    this.getclear();
    this.selection.clear();
    this.Onchange();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;
    this.GetAssetForReviewAssetBindData("OnPageload");
  }
  IsSearch: boolean = false;
  issort: boolean = false;
  Searchlist :any[];
  GetAssetForReviewAssetBindData(Action) {
    debugger;
    if (!this.StatusCtrl) {
      this.toastr.warning('Please Select Status', this.message.AssetrakSays);
      return null;
    }
    this.loader.open();
    
    var LocationIdList = [];
    var CategoryIdList = [];
    if (!!this.plantMultiCtrl) {
      this.plantMultiCtrl.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }
    else {
      this.LocationList.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }

    if (!!this.CategoryCtrl && this.CategoryCtrl.length > 0) {
      this.CategoryCtrl.forEach(x => {
        CategoryIdList.push(x.AssetCategoryId);
      })
    }
    else {
      this.CategoryList.forEach(x => {
        CategoryIdList.push(x.AssetCategoryId);
      })
    }

    //===== Sorting and Searching ===
    this.isExport = false;
    this.issort = false;
    this.IsSearch = false;
    this.serachtext = "";
    this.colunname = "";
    this.multipleserach = false;
    if (Action === 'IsExport') {
      this.isExport = true;
    }
    if ((Action == "SearchText" || Action === 'IsExport') && this.variable != "" && !!this.variable && !!this.variable1) {
      this.serachtext = this.variable;
      this.colunname = this.variable1;
      this.IsSearch = true;
    }
    if (Action == "Sort" && !!this.variable1) {
      this.issort = true;
      this.colunname = this.variable1;
    }
    if(Action == "OnPageload"){
      this.multipleserach = false;
      this.Searchlist = [];
    }
    if (Action == "multiplesearch" && this.multiSearch.length > 0  )
    {
      if(this.multiSearch[0].fieldname != "")
      {
      this.multipleserach = true;
      this.Searchlist = this.multiSearch;
      }
    }

    if(this.panelOpenState && this.showmultiSearch && this.displayTable) {
      this.panelOpenState = false;
    }
   
    
    var ErrorAssetsDetail =
    {
      AssetStage: 1,
      ProjectType: 0,
      AssetStatus: "All",
      UserId: this.UserId,
      PageName: "UploadErrors",
      CompanyId: this.CompanyId,
      Locationlist: LocationIdList,
      ProjectId: 0,
      CategoryIdList: CategoryIdList,
      groupTypeList: this.SelectedAssetItems,
      isSearch: this.IsSearch,
      isForManageGroup: false,
      ErrorList: "All",
      userloclist: "",
      searchBy: "",
      pageNo: this.paginationParams.currentPageIndex + 1,
      pageSize: this.paginationParams.pageSize,
      SbuList: [],
      isExport: this.isExport,
      UploadStatus: !this.StatusCtrl ? 0 : parseInt(this.StatusCtrl),
      SearchText: this.serachtext,
      columnName: this.colunname,
      issorting: this.issort,
      PageId : 22,
      GroupId:this.GroupId,
      RegionId:this.RegionId,
      ExportedFields : this.ExportedFields,
      ismultiplesearch: this.multipleserach,
      Searchlist : this.Searchlist,
    }
    this.assetservice.GetReviewGridData(ErrorAssetsDetail).subscribe(r => {
      debugger;
      this.loader.close();
      if (Action === 'IsExport') {
        this.AllPathService.DownloadExportFile(r);
      }
      else {
        this.Grid=[];
        if(!!r){
          this.Grid = JSON.parse(r);
        }        
        this.paginationParams.totalCount = 0;
        if (!!this.Grid && this.Grid.length > 0) {
          this.paginationParams.totalCount = this.Grid.length > 0 ? this.Grid[0].Count : 0;
          this.displaybtn = true;
          this.displayTable = true;
        }
        else {
          this.displayTable = true;
        }
        this.onChangeDataSource(this.Grid);
        this.SetPageSession();
      }
    })
  }
  CategoryGetdata() {
    this.showmultiSearch = false;
    var PlantList = [];
    if (!!this.plantMultiCtrl) {
      this.plantMultiCtrl.forEach(x => {
        PlantList.push(x.LocationId);
      })
    }
    else {
      this.LocationList.forEach(x => {
        PlantList.push(x.LocationId);
      })
    }

    debugger
    this.reportService.GetCategoryRightWiseForReport(this.CompanyId, this.UserId, PlantList, false, 24).subscribe(r => {
      this.CategoryList = [];
      r.forEach(element => {
        // this.ListOfCategory=[];
        this.CategoryList.push(element);
        this.getFilterCategory();
      });
    })
  }
  
  ExportData() {
    if(this.displayTable == true && this.Grid.length != 0){
      this.GetAssetForReviewAssetBindData("IsExport");
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




  GetExport(Action) {

    this.loader.open();
    this.showApproveRejectbtn = false;
    this.ShowEditbtn = false;
    this.isAllSelected = false;
    this.isAllSelected = false;
    this.ShowDeleteBtn = false;
    this.getselectedIds = [];
    this.selection.clear();
    var LocationIdList = [];
    var CategoryIdList = [];
    if (!!this.plantMultiCtrl) {
      this.plantMultiCtrl.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }
    else {
      this.LocationList.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }

    if (!!this.CategoryCtrl && this.CategoryCtrl.length > 0) {
      this.CategoryCtrl.forEach(x => {
        CategoryIdList.push(x.AssetCategoryId);
      })
    }
    else {
      this.CategoryList.forEach(x => {
        CategoryIdList.push(x.AssetCategoryId);
      })
    }

    if (Action === 'IsExport') {
      this.isExport = true;
    }
    else if (Action !== 'IsExport') {
      this.isExport = false;
      this.dataSource = null;
    }

    var ErrorAssetsDetail =
    {
      AssetStage: 1,
      ProjectType: 0,
      AssetStatus: "All",
      UserId: this.UserId,
      PageName: "UploadErrors",
      CompanyId: this.CompanyId,
      //Locationlist:[this.SelectedPlantItems[0]],
      Locationlist: LocationIdList,
      ProjectId: 0,
      CategoryIdList: CategoryIdList,
      groupTypeList: this.SelectedAssetItems,
      //  AssetClassId:1,
      isSearch: false,
      isForManageGroup: false,
      ErrorList: "All",
      userloclist: "",
      searchBy: "",
      pageNo: this.paginationParams.currentPageIndex + 1,
      pageSize: this.paginationParams.pageSize,
      SbuList: "",
      isExport: this.isExport,
      UploadStatus: !this.StatusCtrl.value ? 0 : parseInt(this.StatusCtrl.value),
    }
    this.assetservice.GetReviewGridData(ErrorAssetsDetail).subscribe(r => {
      this.loader.close();
      if (Action === 'IsExport') {
        this.AllPathService.DownloadExportFile(r);
      }
      else {
        this.Grid = JSON.parse(r);
        console.log("data", this.Grid);
        this.paginationParams.totalCount = 0;
        if (!!this.Grid && this.Grid.length > 0) {
          this.paginationParams.totalCount = this.Grid.length > 0 ? this.Grid[0].Count : 0;
        }
        this.onChangeDataSource(this.Grid);
      }
    })
  }

  SetPageSession() {
    debugger;
    var LocationIdList = [];
    var CategoryIdList = [];
    if (!!this.plantMultiCtrl) {
      this.plantMultiCtrl.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }

    if (!!this.CategoryCtrl) {
      this.CategoryCtrl.forEach(x => {
        CategoryIdList.push(x.AssetCategoryId);
      })
    }

    var formData = {
      'Pagename': "Review Assets",
      'SbuList': [],
      'LocationIdList': LocationIdList,
      'CategoryIdList': CategoryIdList,
      'groupTypeList': !!this.SelectedAssetItems ? this.SelectedAssetItems : "",
      'UploadStatus': !this.StatusCtrl ? 0 : this.StatusCtrl,
    };

    localStorage.setItem('PageSession', JSON.stringify(formData));
  }

  StorePageSession: any;
  GetPageSession() {
    debugger;
    this.StorePageSession = "";
    if (!!localStorage.getItem('PageSession') && localStorage.getItem('PageSession') != "null") {
      this.StorePageSession = {}
      this.StorePageSession = JSON.parse(localStorage.getItem('PageSession'));
      if (this.StorePageSession.Pagename === "Review Assets") {
        var list = [];
        this.plantMultiCtrl = "";
        this.LocationList.forEach(x => {
          debugger;
          if (this.StorePageSession.LocationIdList.indexOf(x.LocationId) > -1) {
            list.push(x);
            this.plantMultiCtrl = list;
          }
        })
        this.CategoryCtrl = "";
        list = [];
        this.CategoryList.forEach(x => {
          if (this.StorePageSession.CategoryIdList.indexOf(x.AssetCategoryId) > -1) {
            list.push(x);
            this.CategoryCtrl = list;
          }
        })
        this.SelectedAssetItems = this.StorePageSession.groupTypeList;
        this.assetGroupCtrl = this.StorePageSession.groupTypeList;
        this.StatusCtrl = this.StorePageSession.UploadStatus;

        this.GetAssetForReviewAsset();
      }
      else {
        localStorage.setItem('PageSession', null);
        this.StorePageSession = "";
      }
    }
  }

  toggleSelectAllGroup(selectAllValue) {
    this.assetGroupCtrl =[];
    this.filteredAssetClassMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (!!selectAllValue.checked) {
          this.AssetGroup.forEach(element => {
            this.assetGroupCtrl.push(element.id);
          });  
        } else {
          this.assetGroupCtrl="";
        }
        this.SelectedAssetItems = this.assetGroupCtrl;
        this.getFilterCategory();
      });
  }

  viewDocuments(element) {
    this.gs.GetEditAssetUploadDocument(element.PreFarId).subscribe(r => {

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

  deleteasset() {

    this.confirmService.confirm({ message: this.message.ReviewAssetDeletion, title: this.message.DeleteAssetsForReviewAssetTitle })
      .subscribe(res => {
        if (res) {
          this.RemoveRecord();
        }
      })
  }
  RemoveRecord() {
    this.loader.open();
    var assetsDetails = {
      CompanyId: this.CompanyId,
      AssetList: this.getselectedIds.join(',')
    };

    this.assetservice.DeleteRow(assetsDetails)
      .subscribe(r => {
        if (r == "success") {
          this.toastr.success(this.message.ReviewAssetRemved, this.message.AssetrakSays);
        }
        this.loader.close();
        this.clearSelected();
      })
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
        console.log(this.displayedColumns);
        this.displayedColumns = this.ListOfField.filter(x => x.Custom2 == "1" ).map(choice => choice.Custom1);
        this.displayedColumns = ['Select'].concat(this.displayedColumns);
      }
    })
  }

  @Input() model: FormControl;
  @Input() values = [];
  @Input() text = 'Select All';

  isChecked(): boolean {
    return this.model.value && this.values.length
      && this.model.value.length === this.values.length;
  }

  isIndeterminate(): boolean {
    return this.model.value && this.values.length && this.model.value.length
      && this.model.value.length < this.values.length;
  }

  toggleSelection(change: MatCheckboxChange): void {
    if (change.checked) {
      this.model.setValue(this.values);
    } else {
      this.model.setValue([]);
    }
  }


  ApprovalConfigExits: any;
  CheckWetherApprovalConfigExits() {
    var GroupId = this.GroupId;
    this.groupservice.CheckWetherConfigurationExist(GroupId, 62)
      .subscribe(r => {

        this.ApprovalConfigExits = r;
      })
  }
  PageId =22;
  ReportFlag :boolean = false;
  openPopUp(data: any = {}) {
    debugger;
    this.ReportFlag = false;
    this.ListOfField.forEach((element,index)=>{
      if(element.Custom1 == 'MissingDocument' || element.Custom1 == 'Photo') 
        this.ListOfField.splice(index,1);
     });
    let title = 'Add new member';
    var payload = {
      PageId : this.PageId,
      element : data,
      ListOfField : this.ListOfField,
      ReportFlag : this.ReportFlag ,
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

  numSelected: any = 0;
  getselectedIds: any[] = [];
  isAllSelected: boolean = false;
  masterToggle() {
    debugger;
    this.isAllSelected = !this.isAllSelected;
    this.getselectedIds = [];
    this.selection.clear();
    if (this.isAllSelected == true) {
      this.dataSource.data.forEach(row => this.selection.select(row));
      this.dataSource.data.forEach((row) => {

        if (row.ReviewStatus == "Availabel for approve") {
          this.ShowEditbtn = false;
          this.showApproveRejectbtn = true;
          this.ShowDeleteBtn = false;
        } else {
          this.showApproveRejectbtn = false;
          this.ShowEditbtn = false;
        }
        if (row.ReviewStatus == "Information pending") {
          this.showApproveRejectbtn = false;
          this.ShowEditbtn = true;
          this.ShowDeleteBtn = true;
        } else {
          this.ShowEditbtn = false;
        }
        if (row.ReviewStatus == "") {
          this.ShowEditbtn = true;
          this.ShowDeleteBtn = true;
        } else {
          this.ShowEditbtn = false;
        }
      })
    }
    else {
      //this.dataSource.data.forEach(row => this.selection.toggle(row));
      this.ShowEditbtn = false;
      this.ShowDeleteBtn = false;
      this.showApproveRejectbtn = false; 
    }
    this.numSelected = this.selection.selected.length;
    if (this.numSelected > 0) {
      this.selection.selected.forEach(row => this.getselectedIds.push(row.PreFarId));
    }
    if (this.numSelected > 1) {
      this.ShowEditbtn = false;
    }
  }

  ShowDeleteBtn: boolean = false;
  isSelected(row) {
    this.isAllSelected = false;
    this.getselectedData = row;
    if (row.ReviewStatus == "Availabel for approve") {

      this.ShowEditbtn = false;
      this.showApproveRejectbtn = true;
      this.ShowDeleteBtn = false;

    } else {

      this.showApproveRejectbtn = false;
      this.ShowEditbtn = false;
    }

    if (row.ReviewStatus == "Information pending") {
      this.showApproveRejectbtn = false;
      this.ShowEditbtn = true;
      this.ShowDeleteBtn = true;

    } else {
      this.ShowEditbtn = false;

    }

    if (row.ReviewStatus == "") {
      this.ShowEditbtn = true;
      this.ShowDeleteBtn = true;
    } else {
      //this.showApproveRejectbtn = false;
    }
    this.selection.toggle(row)
    this.numSelected = this.selection.selected.length;
    if (this.numSelected > 1) {
      this.ShowEditbtn = false;
    }
    debugger;
    var idx = this.getselectedIds.indexOf(row.PreFarId);
    if (idx > -1) {
      this.getselectedIds.splice(idx, 1);
    }
    else {
      this.getselectedIds.push(row.PreFarId);
    }


    if (this.getselectedIds.length > 0) {
      //this.ShowDeleteBtn = true;
    } else {
      this.ShowDeleteBtn = false;
      this.showApproveRejectbtn = false;
      this.ShowEditbtn = false;
    }

    if (this.getselectedIds.length != this.dataSource.data.length) {
      this.isAllSelected = false;
    }
    else {
      this.isAllSelected = true;
    }
  }
  viewSelected() {
    this.getclear();
    this.paginationParams.totalCount = this.selection.selected.length;
    this.paginationParams.endIndex = this.selection.selected.length;
    this.onChangeDataSource(this.selection.selected);
  }
  clearSelectedView(){
    this.ShowEditbtn = false;
    this.ShowDeleteBtn = false;
    this.showApproveRejectbtn = false;
    this.selection.clear();
    //this.getclear();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.paginationParams.totalCount = 0;
    if (!!this.Grid && this.Grid.length > 0) {
      this.paginationParams.totalCount = this.Grid.length > 0 ? this.Grid[0].Count : 0;
    }
    this.onChangeDataSource(this.Grid);
  }
  clearSelected() {
    this.selection.clear();
    this.getclear();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.GetAssetForReviewAssetBindData("");   
  }
  onChangeDataSource(value) {
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.sort = this.sort;
    //this.dataSource.paginator = this.paginator;
    this.isAllSelected = false;
    var ids = [];

    for (var i = 0; i < this.Grid.length; i++) {
      var idx = this.getselectedIds.indexOf(this.Grid[i].PreFarId);
      if (idx > -1) {
        ids.push(this.Grid[i].PreFarId);
      }
    }
    if (this.Grid.length > 0 && this.Grid.length == ids.length) {
      this.isAllSelected = true;
    }
  }
  public appliedfilters: any[] = [];
  clearfilter() {
    if (this.appliedfilters.length > 0) {
      while (this.appliedfilters.length > 0) {
        this.appliedfilters.splice(this.appliedfilters.length - 1);
        console.log(this.appliedfilters);
      }
    }
  }
  customFilterPredicate() {
    const myFilterPredicate = (data: any, filter: string): boolean => {

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
  tempdatasource: any[] = [];
  setflag: boolean =false;
  opentablePopup(columnName) {
    // const dialogconfigcom = new MatDialogConfig();
    // dialogconfigcom.disableClose = true;
    // dialogconfigcom.autoFocus = true;
    // dialogconfigcom.width = "45%";
    // dialogconfigcom.data = this.tempdatasource;
    // const dialogRef = this.dialog.open(tablecolumComponent, dialogconfigcom);
    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result.length > 0) {
    //     for (let i = 0; i < this.arrBirds.length; i++) {
    //       var idx = result.indexOf(this.arrBirds[i].AssetNo);
    //       if (idx > -1) {
    //         this.selecteddatasource.push(this.arrBirds[i])
    //       }
    //     }
    //     this.dataSource = new MatTableDataSource(this.selecteddatasource);
    //   }
    // });
  }

  variable: any;
  variable1: any;
  action: any[] = []
  SerchAssetid(columnName) {
    var flag = 0;
    this.variable1 = columnName;
    if (!!this.variable) {
      flag = 1;
    }
    this.variable = !this.AssetNoFilter.value ? "" : this.AssetNoFilter.value;
    this.variable = this.variable.trim();
    if (flag == 1 || !!this.variable) {
      this.paginator.pageIndex = 0;
      this.paginationParams.pageSize = 50;
      this.paginationParams.currentPageIndex = 0;
      this.GetAssetForReviewAssetBindData("SearchText");
    }

  }
  ClearSerch(columnName, isflag) {
    this.variable1 = "";
    this.variable = "";
    this.AssetNoFilter.setValue("");
    this.SearchcolumnName = "";
    if (columnName == "AssetId") { this.isButtonVisible = !isflag; }
    else if (columnName == "Barcode") { this.isButtonVisibleBarCode = !isflag; }
    else if (columnName == "ADL2") { this.isButtonVisibleADL2 = !isflag; }
    else if (columnName == "ADL3") { this.isButtonVisibleADL3 = !isflag; }
    else if (columnName == "Suplier") { this.isButtonVisibleSupplier = !isflag; }


    else if (columnName == "GRNNo") { this.isButtonVisibleGRNNo = !isflag; }
    else if (columnName == "SerialNo") { this.isButtonVisibleSerialNo = !isflag; }
    else if (columnName == "ITSerialNo") { this.isButtonVisibleITSerialNo = !isflag; }
    else if (columnName == "PONumber") { this.isButtonVisibleITSerialNo = !isflag; }
    else if (columnName == "equipmentNo") { this.isButtonVisibleEqipmentNumber = !isflag; }
    else if (columnName == "CPPNumber") {
      this.isButtonVisibleCPPNumber = !isflag;
    }
    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;
    this.GetAssetForReviewAssetBindData("");
  }
  SearchcolumnName: any;

  Serchicon(columnName, isflag) {
    this.getclear();
    this.variable = this.AssetNoFilter.setValue("");
    this.SearchcolumnName = columnName;

    if (columnName == "AssetId") {
      this.isButtonVisible = !isflag;
    }
    else if (columnName == "Barcode") {
      this.isButtonVisibleBarCode = !isflag;
    }
    else if (columnName == "ADL2") {
      this.isButtonVisibleADL2 = !isflag;
    }
    else if (columnName == "ADL3") {
      this.isButtonVisibleADL3 = !isflag;
    }
    else if (columnName == "Suplier") {
      this.isButtonVisibleSupplier = !isflag;
    }
    else if (columnName == "GRNNo") {
      this.isButtonVisibleGRNNo = !isflag;
    }
    else if (columnName == "SerialNo") {
      this.isButtonVisibleSerialNo = !isflag;
    }
    else if (columnName == "ITSerialNo") {
      this.isButtonVisibleITSerialNo = !isflag;
    }
    else if (columnName == "PONumber") {
      this.isButtonVisiblePONumber = !isflag;
    }
    else if (columnName == "equipmentNo") {
      this.isButtonVisibleEqipmentNumber = !isflag;
    }
    else if (columnName == "CPPNumber") {
      this.isButtonVisibleCPPNumber = !isflag;
    }

  }
  getclear() {
    this.variable = "";
    this.variable1 = "";
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
  sortColumn($event: SqSort) {
    if (this.SearchcolumnName != $event.active) {
      if ($event.active != "Select") {
        if ($event.direction == "asc" || $event.direction == "") {
          this.GetAssetForReviewAssetBindData("")
        } else {
          this.variable1 = $event.active;
          this.GetAssetForReviewAssetBindData("Sort")
        }
      }
    }

  }
  openExportPopup(){
    let title = 'Export';
    const dialogRef = this.dialog.open(ExportFieldsComponent, {
      width: '60vw',
      height: 'auto',
      data: { title: title, payload: this.ListOfField }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {           
        this.ExportedFields = result;
        this.ExportedFields = this.ExportedFields.filter(x => x.Custom2 == "1").map(choice => choice.Custom1);  
        this.ExportData();     
      }
    })
  }
  registerflag :boolean =false;
  SelectionColumn(ele , item){
    debugger;
    this.registerflag =false;
    item.Condition = "";
    item.HighValue ="";
    item.LowValue ="";
   item.fieldname = ele.FieldName;
   if(item.fieldname == "Register")
   {
     this.registerflag =true;
   }
   item.OptionType = ele.SearchOptionType;
   this.ListOfField.forEach(val => {
     if(val.FieldName == ele.FieldName){
       item.Tablename = val.Tables;
     }
   })
 }
 showmultiSearch:any=false;
 multiSearch : any[]=[];
 multiSearchAdd(){
  
  this.showmultiSearch = !this.showmultiSearch;
  this.multiSearch = [];
  if(!!this.showmultiSearch)
      this.addSearch();
  
 }
 hideSearch : boolean = false;
 searchCount : any = 0;
 addSearch() {
  var data = {
    fieldname: '',
    Tablename: '',
    Condition: '',
    HighValue:'',
    LowValue:''
  }
  this.multiSearch.push(data);  
  this.onChangeAdvancedSearch();  
 } 
 onChangeAdvancedSearch(){
  debugger;
  this.searchCount = 0;
  this.hideSearch = false;
  this.multiSearch.forEach(val => {
    if(val.Condition == "IN"){
      if(!!val.HighValue){
        this.hideSearch = true;
        this.searchCount = this.searchCount + 1;
      }
    }
    else{
    if( val.fieldname == 'AcquisitionDate' || val.fieldname =='WDVDate')
    {
      if(!!val.HighValue && !!val.LowValue ){
        this.hideSearch = true;
        this.searchCount = this.searchCount + 1;
      }
    }
    else if(val.fieldname == 'AssetId')
    {
      if(!!val.HighValue ){
        this.hideSearch = true;
        this.searchCount = this.searchCount + 1;
      }
    }
    else{
    var s = val.HighValue;
     s = s.replace(/,/g, '');
    if(!!val.HighValue){
      this.hideSearch = true;
      this.searchCount = this.searchCount + 1;
    }
    val.HighValue = s;  
  }
}

  })
}
 removeSearch(idx){
  this.multiSearch.splice(idx , 1);
  this.onChangeAdvancedSearch(); 
 }
 clearSearchData(){
  this.showmultiSearch = !this.showmultiSearch;
  this.multiSearch = [];
  if(!!this.hideSearch)
    this.GetAssetForReviewAssetBindData("");
 }
 multipleserach : boolean= false;
 onMultiSearchClick(){
 
  if(this.searchCount == 0){
    this.toastr.warning(`Please Select All Fields`, this.message.AssetrakSays);
    return null;
   }
   else{
    this.multipleserach= true ;
    this.GetAssetForReviewAssetBindData("multiplesearch");
    console.log(this.multiSearch);
   }
 
 }
 openMultiSearchDialog(val:any){	
  let title = 'Create list of values to search';	
  const dialogRef = this.dialog.open(MultiSearchDialogComponent, {	
    width: 'auto',	
    height: 'auto',	
    data: { title: title, payload: '' }	
  })	
  dialogRef.afterClosed().subscribe(result => {	
    debugger;
    if (!!result) {           	
      console.log(result)	
      // if(result.length>1)	
      // val.HighValue = result[0].name+','+result[1].name+'...';	
      // else val.HighValue = result[0].name;
      val.HighValue ="";	
      if(result.length>1){
       var i=0;
      for( i=0;i<result.length;i++){ 
      if(val.HighValue!='')
      val.HighValue = val.HighValue+","+result[i].name ;
      else
      val.HighValue = result[i].name ;
    }
    }
       else val.HighValue = result[0].name;	
    }	
    this.onChangeAdvancedSearch();
  })	
}	
startdate: any;
newdate:any;
Enddate: any;
changeStartDate(dateEvent4) {
  debugger;
  // this.insuranceStartDate.emit(dateEvent3.value);
  this.startdate = new Date(dateEvent4.value);
  this.Enddate = new Date( this.startdate);
  this.onChangeAdvancedSearch();
}
changeEndDate(dateEvent4) {
  debugger;
  this.insuranceEndDate.emit(dateEvent4.value);
  this.onChangeAdvancedSearch();
}
 Onchange(){
  this.showmultiSearch = false;
 }
 clearInput(val:any){	
  val.HighValue = '';	
}
}


