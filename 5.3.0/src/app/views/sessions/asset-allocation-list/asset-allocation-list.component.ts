import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import * as header from '../../../../assets/Headers.json';
import * as resource from '../../../../assets/Resource.json';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import * as menuheaders from '../../../../assets/MenuHeaders.json'
import { ReconciliationService } from '../../../components/services/ReconciliationService';
import { CompanyLocationService } from '../../../components/services/CompanyLocationService';
import { UserMappingService } from '../../../components/services/UserMappingService';
import { CompanyBlockService } from '../../../components/services/CompanyBlockService';
import { GroupService } from '../../../components/services/GroupService';
import { UploadService } from '../../../components/services/UploadService';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { UserService } from '../../../components/services/UserService';
import { AssetService } from '../../../components/services/AssetService';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { assetTabsComponent } from '../../../components/partialView/assetDetails/asset_tabs.component';
import { GetFieldsComponent } from 'app/components/partialView/get-fields/get-fields.component';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from "@angular/common/http";

@Component({
  selector: 'app-asset-allocation-list',
  templateUrl: './asset-allocation-list.component.html',
  styleUrls: ['./asset-allocation-list.component.scss']
})
export class AssetAllocationListComponent implements OnInit {

  Headers: any ;
  message: any = (resource as any).default;

  dialogForm: FormGroup;
  numRows: number;
  selectedValue: string;
  IsDisabled: boolean = true;
  private isButtonVisible = false;
  private isApprovalLevelButtonVisible = false;

  public bindData: any[];
  public arrlength = 0;
  public arr = [];
  public newdataSource = [];
  public isallchk: boolean;
  public getselectedData: any[] = [];
  public selecteddatasource: any[] = [];
  public appliedfilters: any[] = [];

  AssetNoFilter = new FormControl();
  ApprovalLevelFilter = new FormControl();
  AssetClassFilter = new FormControl();
  TransferTypeFilter = new FormControl();

  filteredValues = {
    AssetNo: '', ApprovalLevel: '', SubNo: '', CapitalizationDate: '',
    AssetClass: '', AssetType: '',
    AssetSubType: '', UOM: '', AssetName: '',
    AssetDescription: '', Qty: '', Cost: '', WDV: '',
    EquipmentNO: '', AssetCondition: '', AssetCriticality: ''
  };


  CompanyId: any = 2;
  GroupId: any = 2;
  UserId: any = 0;
  IsCompanyAdmin: any = 1;
  IslayerDisplay: any;
  layerid: any;
  Layertext: any;
  HeaderLayerText: any;
  menuheader: any = (menuheaders as any).default;

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  protected _onDestroy = new Subject<void>();
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public sessionId: any;

  displayedColumns: any[] = ['select', '2', '3', '4', '5', '6', '26', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'];
  displayedColumns1: string[] = ['Inventory No.', 'Asset No.', 'Sub No.', 'Asset Class', 'Asset Name', 'Asset Description', 'Serial No', 'IT Serial No', 'allocatedStatus', 'Plant', 'Cost', 'WDV', 'Inventory Indicator', 'CustodianDetails', 'UserDetails', 'AllocateBy', 'allocatedDate', 'AllocationType', 'RevertDate', 'UserType']
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  dataSourceNew = new MatTableDataSource<any>();
  selectionNew = new SelectionModel<any>(true, []);
  tempdatasource: any[] = [];

  constructor(public dialog: MatDialog,
    public rs: ReconciliationService,
    public cls: CompanyLocationService,
    public ums: UserMappingService,
    public cbs: CompanyBlockService,
    public gs: GroupService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    public confirmService: AppConfirmService,
    private loader: AppLoaderService,
    public alertService: MessageAlertService,
    public us: UserService,
    public as: AssetService,
    public UploadService: UploadService,
    private jwtAuth : JwtAuthService,
    private http: HttpClient) {
      debugger;    
    //   this.jwtAuth.GetHeaderFileData();
    //  this.Headers = this.jwtAuth.getHeaders();
  }
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  paginationParams: any;
  ListOfField: any[] = [];
  ListOfFilter: any[] = [];
  ListOfFilterName: any[] = [];
  ListOfCategory: any[] = [];
  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  CompanyIdList: any[] = [];
  GroupIdList: any[] = [];
  RegionIdList: any[] = [];
  ngOnInit(): void {
    debugger;
    this.GetHeaderFileData();
    this.paginationParams = {
      pageSize: 50,
      currentPageIndex: 0,
      endIndex: 0,
      startIndex: 0,
      totalCount: 0,
      
    }
    this.dialogForm = this.fb.group({
      commentCtrl: [''],
    })

    this.layerid = 4;
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
    this.GetInitiatedData1();
    
    //this.GetInitiatedData();
    //this.GetInitiatedData1();

    // this.AssetNoFilter.valueChanges.subscribe((AssetNoFilterValue) => {
    //   this.filteredValues['AssetNo'] = AssetNoFilterValue;
    //   this.dataSource.filter = this.filteredValues.AssetNo;
    // });
    // this.dataSource.filterPredicate = this.customFilterPredicate();
  }
  
  public async GetHeaderFileData() {   
    debugger;
    var apiUrl = environment.apiURL + 'GroupService.svc/GetHeaderFileData';
    var data:any  = await this.http.get(apiUrl).toPromise();    
    
    this.Headers = JSON.parse(data);
    console.log(this.Headers);

  };
  xyz: any;
  abc: any;
  tableid: any;
  pqr: any;
  getParam() {
   
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < url.length; i++) {
      var params = url[i].split("=");
      if (params[0] == 'abc') {
        var abc = params[1];
        //this.xyz = xyz.replace(/\%2B/g, "+").replace(/\%21/g, "!").replace(/\%23/g, "#").replace(/\%24/g, "$").replace(/\%26/g, "&").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")").replace(/\%2A/g, "*").replace(/\%2C/g, ",").replace(/\%2F/g, "/").replace(/\%3A/g, ":").replace(/\%3B/g, ";").replace(/\%3D/g, "=").replace(/\%3F/g, "?").replace(/\%40/g, "@").replace(/\%5B/g, "[").replace(/\%5D/g, "]");
        this.abc = abc;
      }
      if (params[0] == 'xyz') {
        var xyz = params[1];
        //this.xyz = xyz.replace(/\%2B/g, "+").replace(/\%21/g, "!").replace(/\%23/g, "#").replace(/\%24/g, "$").replace(/\%26/g, "&").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")").replace(/\%2A/g, "*").replace(/\%2C/g, ",").replace(/\%2F/g, "/").replace(/\%3A/g, ":").replace(/\%3B/g, ";").replace(/\%3D/g, "=").replace(/\%3F/g, "?").replace(/\%40/g, "@").replace(/\%5B/g, "[").replace(/\%5D/g, "]");
        this.xyz = xyz;
      }
      if (params[0] == 'tableid') {
        var tableid = params[1];
        //this.flag = flag.replace(/\%2B/g, "+").replace(/\%21/g, "!").replace(/\%23/g, "#").replace(/\%24/g, "$").replace(/\%26/g, "&").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")").replace(/\%2A/g, "*").replace(/\%2C/g, ",").replace(/\%2F/g, "/").replace(/\%3A/g, ":").replace(/\%3B/g, ";").replace(/\%3D/g, "=").replace(/\%3F/g, "?").replace(/\%40/g, "@").replace(/\%5B/g, "[").replace(/\%5D/g, "]");
        this.tableid = tableid;
      }
      if (params[0] == 'pqr') {
        var pqr = params[1];
        //this.externalpage = externalpage.replace(/\%2B/g, "+").replace(/\%21/g, "!").replace(/\%23/g, "#").replace(/\%24/g, "$").replace(/\%26/g, "&").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")").replace(/\%2A/g, "*").replace(/\%2C/g, ",").replace(/\%2F/g, "/").replace(/\%3A/g, ":").replace(/\%3B/g, ";").replace(/\%3D/g, "=").replace(/\%3F/g, "?").replace(/\%40/g, "@").replace(/\%5B/g, "[").replace(/\%5D/g, "]");
        this.pqr = pqr;
      }
    }
    this.Assetallocation();
  }

  GetInitiatedData1() {
    debugger;
    let url1 = this.gs.GetFieldListByPageIdbyLink(107,this.UserId,true);
    let url2 = this.gs.GetFilterIDlistByPageId(107);
    forkJoin([url1, url2]).subscribe(results => {
      if (!!results[0]) {
        this.ListOfField = JSON.parse(results[0]);
        this.displayedColumns = this.ListOfField;
        this.displayedColumns = this.displayedColumns.filter(x => x.Custom2 == "1").map(choice => choice.Custom1);
        this.displayedColumns = ['Select'].concat(this.displayedColumns);
        console.log(this.displayedColumns);

      }
      if (!!results[1]) {
        this.ListOfFilter = JSON.parse(results[1]);
        if (!!this.ListOfFilter) {
          this.ListOfFilter.forEach(x => this.ListOfFilterName.push(x.FilterName))
        }
        console.log(this.ListOfFilter);
      }
      this.loader.close();
      this.getParam();
     
    })
  }

  handlePage(pageEvent: PageEvent) {
    debugger;
    this.paginationParams.pageSize = pageEvent.pageSize;
    this.paginationParams.currentPageIndex = pageEvent.pageIndex;
    this.paginationParams.endIndex = (this.paginationParams.currentPageIndex + 1) * pageEvent.pageSize;
    this.paginationParams.startIndex = this.paginationParams.currentPageIndex * pageEvent.pageSize;
    this.AssetallocationBindData("")
  }

  Assetallocation() {
    this.selection.clear();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.getclear();
    this.AssetallocationBindData("OnPageload");
  }
  ApprovalStatus: any[] = [];
  AssetallocationBindData(Action) {
    debugger;
    var assetsDetails =
    {
      ComIds: this.abc,
      GroupIds: this.xyz,
      Ids: this.pqr,
      Option: this.tableid,
      pageSize: this.paginationParams.pageSize,
      pageNo: this.paginationParams.currentPageIndex + 1,
      IsSearch: false,
      // SearchText: ""
      SearchText: this.IsSearch ? this.SearchText : "",
      searchColumn: this.IsSearch ? this.SearchOnColumn : "",
    }
    this.loader.open();
    this.UploadService.GetAssetListByCompanyIdGroupIdUserEmailIdAllocation(assetsDetails).subscribe(r => {
      debugger;
      this.loader.close();
      this.bindData = [];
      if (!!r && r != "[]") {
        this.bindData = JSON.parse(r);
      }
      console.log(this.bindData)
      this.paginationParams.totalCount = 0;
      if (!!this.bindData && this.bindData.length > 0) {
        this.paginationParams.totalCount = this.bindData[0].AssetListCount;
      }
      this.onChangeDataSource(this.bindData);
    })

  }
  onChangeDataSource(value) {
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.sort = this.sort;
    this.isAllSelected = false;
    var ids = [];
    debugger;
    for (var i = 0; i < this.bindData.length; i++) {
      var idx = this.getselectedIds.indexOf(this.bindData[i].PreFarId);
      if (idx > -1) {
        ids.push(this.bindData[i].PreFarId);
      }
    }
    if (this.bindData.length > 0 && this.bindData.length == ids.length) {
      this.isAllSelected = true;
    }
  }

  isAllSelected: boolean = false;
  numSelected: any = 0;
  getselectedIds: any[] = [];
  masterToggle() {
    debugger;
    this.isAllSelected = !this.isAllSelected;
    this.selection.clear();
    this.getselectedIds = [];
    if (this.isAllSelected == true) {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
    this.numSelected = this.selection.selected.length;
    if (this.numSelected > 0) {
      this.selection.selected.forEach(row => this.getselectedIds.push(row.PreFarId));
    }
  }
  isSelected(row) {
    debugger;
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
        console.log(this.displayedColumns);
        this.displayedColumns = this.ListOfField.filter(x => x.Custom2 == "1" ).map(choice => choice.Custom1);
        this.displayedColumns = ['Select'].concat(this.displayedColumns);
      }
    })
  }



  Submit(action) {
    debugger;
    if (this.selection.selected.length > 0) {
      var prefarIds = [];
      const numSelected = this.selection.selected.length;
      for (var i = 0; i < numSelected; i++) {
        prefarIds.push(this.selection.selected[i].PreFarId);
      }

      var Comment = !this.dialogForm.get('commentCtrl').value ? "" : this.dialogForm.get('commentCtrl').value;
      Comment = Comment.trim();
      if (!Comment && action == 'decline') {
        this.toastr.warning('Comment is mandatory for rejecting', this.message.AssetrakSays);
        return false;
      }

      var assetsDetails =
      {
        AssetList: prefarIds.join(','),
        rComment: !this.dialogForm.get('commentCtrl').value ? "" : this.dialogForm.get('commentCtrl').value,
        Option: this.tableid,
        Flag: action,
        SearchText: "",
        Ids: this.pqr
      }
      this.loader.open();
      this.UploadService.UserAlocationAction(assetsDetails).subscribe(r => {
        debugger;
        this.loader.close();
        if (r == "success") {
          if (action === "decline") {
            this.toastr.success(this.message.AssetAllocationDeclinedSucess, this.message.AssetrakSays);
          }
          else {
            this.toastr.success(this.message.AssetAllocationConfirmedSucess, this.message.AssetrakSays);
          }
        }
        else if (r === "already decline") {
          this.toastr.error(this.message.ActionAlreadyTaken, this.message.AssetrakSays);
        }
        else if (r === "already confirmed") {
          this.toastr.error(this.message.ActionAlreadyTaken, this.message.AssetrakSays);
        }
        else if (r == "Invalid PassWord") {
          this.toastr.warning(this.message.InvalidPassWord, this.message.AssetrakSays);
        }
        else if (r === "not authorized") {
          this.toastr.warning(this.message.NotAuthorizedAllocation, this.message.AssetrakSays);
        }
        this.clearSelected();
      })
    }
    else {
      this.toastr.warning(this.message.SelectAllocationAsset, this.message.AssetrakSays);
    }

  }
  bindData1: any[] = [];
  btnName: any = 'View Other Assignment';
  ShowNewDataSource: boolean = false;
  GetNewAsset() {
    debugger;
    this.selectionNew.clear();
    this.btnName = 'Hide';
    this.ShowNewDataSource = !this.ShowNewDataSource;
    if (this.ShowNewDataSource == true) {
      this.SearchUsersForAssetUnAllocationForLink();
    }
    else {
      this.btnName = 'View Other Assignment';
      this.bindData1 = [];
      this.onChangeDataSourceNew(this.bindData1);
    }
  }

  SearchUsersForAssetUnAllocationForLink() {
    debugger;
    var AssetType = "Capitalized Assets";
    var assetsDetails =
    {
      AssetType: AssetType,
      ComIds: this.abc,
      GroupIds: this.xyz,
      Ids: this.pqr,
    }
    this.loader.open();
    this.as.SearchUsersForAssetUnAllocationForLink(assetsDetails).subscribe(r => {
      debugger;
      this.loader.close();
      this.bindData1 = JSON.parse(r);
      var data = JSON.parse(r);
      var prefarIds = [];
      const numSelected = this.selection.selected.length;
      for (var i = 0; i < numSelected; i++) {
        prefarIds.push(this.selection.selected[i].PreFarId);
      }
      this.bindData1 = data.filter(row => prefarIds.indexOf(row.PreFarId) < 0);
      this.onChangeDataSourceNew(this.bindData1);
    })
  }

  onChangeDataSourceNew(value) {
    this.dataSourceNew = new MatTableDataSource(value);
    this.dataSourceNew.sort = this.sort;
  }

  isAllSelectedNew() {
    const numSelected = this.selectionNew.selected.length;
    const numRows = this.dataSourceNew.data.length;
    return numSelected === numRows;
  }
  masterToggleNew() {
    this.isAllSelectedNew() ?
      this.selectionNew.clear() :
      this.dataSourceNew.data.forEach(row => this.selectionNew.select(row));
  }
  PageId =107;
  openPopUp(data: any = {}) {
    debugger;
    return null;
    let title = 'Add new member';
    const dialogRef = this.dialog.open(assetTabsComponent, {
      width: 'auto',
      disableClose: true,
      data: { title: title, payload: data.PreFarId ,PageId:this.PageId}
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
      })
  }

  viewSelected() {
    this.onChangeDataSource(this.selection.selected);
  }
  clearSelected() {
    this.selection.clear();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.dialogForm.get('commentCtrl').setValue("");
    this.AssetallocationBindData("")
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
  clearfilter() {
    if (this.appliedfilters.length > 0) {
      while (this.appliedfilters.length > 0) {
        this.appliedfilters.splice(this.appliedfilters.length - 1);
        console.log(this.appliedfilters);
      }
    }
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

  SerchAssetid(columnName) {
    debugger;
    // this.IsPageLoad= false;
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
      this.selection.clear();
      this.numSelected = 0;
      this.getselectedIds = [];
      this.paginator.pageIndex = 0;
      this.paginationParams.pageSize = 50;
      this.paginationParams.currentPageIndex = 0;

      this.AssetallocationBindData("SearchText");
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
    // this.IsPageLoad= false;
    this.selection.clear();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;
    this.getclear();
    this.AssetallocationBindData("");
  }


  Serchicon(columnName, isflag) {
    debugger;
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


}
