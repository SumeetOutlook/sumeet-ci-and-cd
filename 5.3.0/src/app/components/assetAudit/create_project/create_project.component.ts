import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl, FormArray, FormGroup, Validators,FormBuilder } from '@angular/forms';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSelect } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
/*import{filterPopupComponent} from './filter_Popup/filter_Popup.component';*/
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Constants } from 'app/components/storage/constants';
import { DatePipe } from '@angular/common';
import { UpdateAuditRightsMappingDialogComponent } from './update_audit_rights_mapping_dialog/update_audit_rights_mapping_dialog.component';
import { tablecolumComponent } from './tablecolum-popup/tablecolum-popup.component';
import * as menuheaders from '../../../../assets/MenuHeaders.json'
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AllPathService } from 'app/components/services/AllPathServices';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { UserService } from '../../services/UserService';
import { CompanyLocationService } from '../../services/CompanyLocationService';
import { UserMappingService } from '../../services/UserMappingService';
import { CompanyBlockService } from '../../services/CompanyBlockService';
import { GroupService } from '../../services/GroupService';
import { AuditService } from '../../services/AuditService';
import { ReportService } from '../../services/ReportService';
import { UserRoleService } from '../../services/UserRoleService';
import { TypeUploadDialogComponent } from './type_upload_dialog/type-upload-dialog.component';






@Component({
  selector: 'app-create_project',
  templateUrl: './create_project.component.html',
  styleUrls: ['./create_project.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CreateProjectComponent implements OnInit, AfterViewInit, OnDestroy {
  Headers: any ;
  message: any ;
  numRows: number;
  selectedProject;
  selectedValue: string;
  selectedassetclass: string;
  selectedassettype: string;
  selectedassetuom: string;
  IsDisabled: boolean = true;
  public arrBirds: any[];
  private isButtonVisible = false;
  public getSeletedData = [];
  menuheader: any = (menuheaders as any).default
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
  expandedElement: any | null;
  ReportForm: FormGroup;
  public inventorytiFilterCtrl: FormControl = new FormControl();

  public project: any[] = [];

  public CreateProject_Data = [];

  public SelfCertification_Data = [];

  CompanyId: any;
  GroupId: any;
  UserId: any;
  RegionId: any;
  IsCompanyAdmin: any = 1;
  IslayerDisplay: any;
  layerid: any;
  Layertext: any;
  HeaderLayerText: any;
  displayTable: boolean = false;
  displaybtn: boolean = true;

  AssetNoFilter = new FormControl();
  filteredValues = {
    AssetNo: '', SubNo: '', CapitalizationDate: '',
    AssetClass: '', AssetType: '',
    AssetSubType: '', UOM: '', AssetName: '',
    AssetDescription: '', Qty: '', Cost: '', WDV: '',
    EquipmentNO: '', AssetCondition: '', AssetCriticality: ''
  };

  ///////////////////////////////////
  TYPE: any[] = []

  public cityMultiCtrl: any;
  public cityMultiFilterCtrl: FormControl = new FormControl();
  public filteredCityMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public plantMultiCtrl: any;
  public plantMultiFilterCtrl: FormControl = new FormControl();
  public filteredPlantsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public categoryMultiCtrl: any;
  public categoryFilterCtrl: FormControl = new FormControl();
  public filteredcategoryMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public projectMultiCtrl: any;
  public projectFilterCtrl: FormControl = new FormControl();
  public filteredprojectMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public typeMulti: any;
  public typenote: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public InventoryDeadline: any;
  public ProjectNameCtrl: any;
  today = new Date();

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  protected _onDestroy = new Subject<void>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator, { static: true }) SelfCertificationpaginator: MatPaginator;
  @ViewChild(MatSort) SelfCertificationsort: MatSort;


  displayedHeaders: string[] = [];
  displayedUpperColumns: string[] = [' ', 'Total', "SelectedForProject"];
  displayedColumns: string[] = ['Select', 'Plant', 'totalCount', 'totalCost', 'totalWDV', 'selectedForProjectCount', 'selectedForProjectCost', 'selectedForProjectWDV', 'Actions'];
  displayedNestedColumns: string[] = ['AssetCategory', 'Assets', 'ActualCost', 'WDV'];
  dataSource = new MatTableDataSource<any>();
  selfCertificationdataSource = new MatTableDataSource<any>();
  payloadData = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  selectionnew = new SelectionModel<any>(true, []);
  tempdatasource: any[] = [];
  tempdatasource1: any[] = [];
  disabledField: boolean = true;
  newflag: boolean = true;
  flag :any;
  isUpload:boolean = false;
  fileName : any;

  constructor(public dialog: MatDialog,
    public datepipe: DatePipe,
    public toastr: ToastrService,
    private storage: ManagerService,
    public confirmService: AppConfirmService,
    private loader: AppLoaderService,
    public us: UserService,
    private router: Router,
    public AllPathService: AllPathService,
    public alertService: MessageAlertService,
    public cls: CompanyLocationService,
    public ums: UserMappingService,
    public cbs: CompanyBlockService,
    public gs: GroupService,
    public as: AuditService,
    public rp: ReportService,
    public urs: UserRoleService , private jwtAuth: JwtAuthService,private fb:FormBuilder) {

      this.Headers = this.jwtAuth.getHeaders();
	    this.message = this.jwtAuth.getResources();

      this.project = [
        { name: this.Headers.PhysicalVerification, id: 'PhysicalVerification' },
        //{ name: this.Headers.SelfCertification, id: 'SelfCertification' },
      ];

      this.TYPE = [
        { id: 'Selected Location', name: this.Headers.location },
        { id: 'Uploaded ', name: this.Headers.Inventorynumber },
      ]

      this.displayedHeaders = [this.Headers.Select, this.Headers.City, this.Headers.Location, this.Headers.TotalAssets, this.Headers.ActualCost, this.Headers.WDV, this.Headers.Actions];
  }
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  paginationParams: any;
  ngOnInit(): void {

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
    this.ReportForm = this.fb.group({
      inventorytiFilterCtrl : ['', [Validators.required]],
    })
    this.filterProjectMulti();
    this.GetInitiatedData();

    this.typeMulti ="Selected Location"
    this.plantMultiCtrl = "";
    this.categoryMultiCtrl ="";
    this.cityMultiCtrl = "";
    this.projectMultiCtrl = "PhysicalVerification";
    this.selected("PhysicalVerification");

    this.AssetNoFilter.valueChanges.subscribe((AssetNoFilterValue) => {
      this.filteredValues['AssetNo'] = AssetNoFilterValue;
      this.dataSource.filter = this.filteredValues.AssetNo;
    });

    this.typenote.next(this.TYPE.slice())
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }



  ListOfLoc: any[] = [];
  ListOfLoc1: any[] = [];
  ListOfSBU: any[] = [];
  ListOfField: any[] = [];
  ListOfFilter: any[] = [];
  ListOfFilterName: any[] = [];
  ListOfCategory: any[] = [];
  ListOfCategory1: any[] = [];
  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  CreateProjectPagePermission: any[] = [];
  ProjectPermissionIdList: any[] = [];

  GetInitiatedData() {

    let url1 = this.cls.GetLocationListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 32);
    let url2 = this.cbs.GetCategoryListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 32);
    let url3 = this.gs.GetFieldListByPageId(32,this.UserId,this.CompanyId);
    let url4 = this.gs.GetFilterIDlistByPageId(32);
    let url5 = this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.RegionId, "32");
    let url6 = this.urs.GetTogglePermissions();
    forkJoin([url1, url2, url3, url4, url5, url6]).subscribe(results => {
      if (!!results[0]) {
        this.ListOfLoc1 = JSON.parse(results[0]);
        this.ListOfLoc = JSON.parse(results[0]);
        this.ListOfSBU = this.UniqueArraybyId(this.ListOfLoc, this.Layertext);
        this.getFilterCityType();
        this.getFilterPlantType();
      }

      if (!!results[1]) {
        this.ListOfCategory = JSON.parse(results[1]);
        this.ListOfCategory1 = JSON.parse(results[1]);
        this.getFilterCategoryType();
      }
      if (!!results[2]) {
        // this.ListOfField = JSON.parse(results[2]);
        // this.displayedColumns = this.ListOfField;
        // this.displayedColumns = this.displayedColumns.filter(x => x.IsForDefault == true).map(choice => choice.FieldName);
        // this.displayedColumns = ['Select'].concat(this.displayedColumns);       
      }
      if (!!results[3]) {
        this.ListOfFilter = JSON.parse(results[3]);
        if (!!this.ListOfFilter) {
          this.ListOfFilter.forEach(x => this.ListOfFilterName.push(x.FilterName))
        }
      }
      if (!!results[4]) {
        this.ListOfPagePermission = JSON.parse(results[4]);
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
      if (!!results[5]) {

        this.CreateProjectPagePermission = JSON.parse(results[5]);
        if (!!this.CreateProjectPagePermission) {
          this.ProjectPermissionIdList = this.CreateProjectPagePermission;
        }
      }
      this.loader.close();
      this.GetPageSession();
    })
  }

  StorePageSession: any;
  GetPageSession() {
    this.StorePageSession = "";
    if (!!localStorage.getItem('PageSession') && localStorage.getItem('PageSession') != "null") {
      this.StorePageSession = {}
      this.StorePageSession = JSON.parse(localStorage.getItem('PageSession'));
      if (this.StorePageSession.Pagename === "Create Project") {

      }
      else {
        localStorage.setItem('PageSession', null);
        this.StorePageSession = "";
      }
    }
  }
  openUploadType(): void {
    debugger;
    if (!this.InventoryDeadline) {
      this.toastr.warning(`Please Select ${this.Headers.InventoryDeadline}`, this.message.AssetrakSays);
      return null;
    }
    const dialogconfigcom1 = new MatDialogConfig();
    dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = "50%";
    const modalService = this.dialog.open(TypeUploadDialogComponent, dialogconfigcom1);
    modalService.afterClosed().subscribe((res) => {
      if (res) {
        debugger;
    this.loader.open();
    this.displaybtn = false;
    this.displayTable = true;
    var isView = false;
    var blockIds = "";
    if (this.flag == "viewmap") {
      isView = true;
      blockIds = 'no'
    }
    var locationId = 0;
    var SbuList = [];
    this.CategoryIdList = [];
    var LocationIdList = [];
    this.isUpload = true ;
    this.fileName = res;
    debugger;
    if (!!this.plantMultiCtrl && this.plantMultiCtrl.length > 0) {
      this.plantMultiCtrl.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }
    else {
      this.ListOfLoc.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }


    if (!!this.categoryMultiCtrl && this.categoryMultiCtrl.length > 0) {
      this.categoryMultiCtrl.forEach(x => {
        this.CategoryIdList.push(x.AssetCategoryId);
      })
    }
    else {
      this.ListOfCategory.forEach(x => {
        this.CategoryIdList.push(x.AssetCategoryId);
      })
    }

    if (!!this.cityMultiCtrl && this.cityMultiCtrl.length > 0) {
      this.cityMultiCtrl.forEach(x => {
        SbuList.push(x.SBU);
      })
    }
        var assetDetails = {
          fileName: res,
          companyId: this.CompanyId,
          zeroValue: this.zerovalueAssets,
          thirdParty: this.vendorAssets,
          GRNValue: this.grnAssets,
          isView: isView,
          locationIdList: LocationIdList,
          CategoryIdList: this.CategoryIdList,
          SBUList: SbuList,
          GroupId: this.GroupId,
          UserId: this.UserId,
          RegionId: this.RegionId,
          PageId: 32,
          isUpload : this.isUpload
        }
        if (this.flag == "viewmap") {
          this.loader.close();
          // this.rp.GetAssetDataForCreateInventoryProjectBySpForViewMap(assetDetails).subscribe(r => {
          //   this.bindData = JSON.parse(r);
          // })
        }
        else {
          //this.rp.GetAssetDataForCreateInventoryProjectByAPI(assetDetails).subscribe(r => {
            
          this.rp.GetAssetDetailsByExcelAndBarcodeByAPILocationWise(assetDetails).subscribe(r => {
            debugger;
            this.loader.close();
            this.bindData = [];
            this.displaybtn = true;
            this.displayTable = true;
            var arrdata = JSON.parse(r);
            for (var i = 0; i < arrdata.length; i++) {
              var aa = {
                Location: arrdata[i].Assetlocation,
                LocationId: arrdata[i].LocationId,
                CompanyId: arrdata[i].CompanyId,
                TotalAssetQty: arrdata[i].TotalAssetQty,
                TotalAssetCost: arrdata[i].TotalAssetCost,
                TotalAssetWDV: arrdata[i].TotalAssetWDV,
                SelcetedForProjectQty: arrdata[i].SelcetedForProjectQty,
                SelcetedForProjectCost: arrdata[i].SelcetedForProjectCost,
                SelcetedForProjectWDV: arrdata[i].SelcetedForProjectWDV
              }
              this.bindData.push(aa);
            }
    
            this.totalAssetCount1 = 0;
            this.totalAssetCost1 = 0;
            this.totalAssetWDV1 = 0;
            this.totalSelecForInveAssetCount1 = 0;
            this.totalSelecForInveAssetCost1 = 0;
            this.totalSelecForInveAssetWDV1 = 0;
            this.SelcetedForProjectQtyToDisablechkbox = 0;
            for (var i = 0; i < this.bindData.length; i++) {
              this.totalAssetCount1 += parseFloat(this.bindData[i].TotalAssetQty);
              this.totalAssetCost1 += parseFloat(this.bindData[i].TotalAssetCost);
              this.totalAssetWDV1 += parseFloat(this.bindData[i].TotalAssetWDV);
              this.totalSelecForInveAssetCount1 += parseFloat(this.bindData[i].SelcetedForProjectQty);
              this.totalSelecForInveAssetCost1 += parseFloat(this.bindData[i].SelcetedForProjectCost);
              this.totalSelecForInveAssetWDV1 += parseFloat(this.bindData[i].SelcetedForProjectWDV);
              this.SelcetedForProjectQtyToDisablechkbox += parseFloat(this.bindData[i].SelcetedForProjectQty);
            }
    
            this.onChangeDataSource(this.bindData);
          })
        }
      
      //this.loader.open();
       // var UploadCPUClassData = {
       //   FileName: res,
       //   UploadedBy: "1",
        //  GroupId: this.GroupId,
        //  RegionId: this.RegionId,
         // CompanyId: this.CompanyId
      // }
       // this.as.PostFiles(TypeUploadDialogComponent).subscribe(r => {
         // this.loader.close();
          debugger;
         // if (r[0] == "Success") {
          //  this.toastr.success(this.message.CpuClassUpload, this.message.AssetrakSays);
          //}
          //else if (r[0] != null) {
            //this.toastr.warning(r[0], this.message.AssetrakSays);
          //}
          //else if (r[0] == null) {
        //    this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
          //}
        //  this.GetCPUClassData();
        //})
      }
    });
  }
  
  Onchangetype(event) {
    debugger;
    this.selection.clear();
    this.numSelected = 0;
    this.getselectedIds = [];
    if (event == "Selected Location") {
      this.newflag = true;
       }
    else {
      this.newflag = false;
    
    }  
  }
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
      this.plantMultiCtrl = "";
      this.getFilterPlantType();
    }
    else {
      this.ListOfLoc = this.ListOfLoc1;
      this.plantMultiCtrl = "";
      this.getFilterPlantType();
    }
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
  onChangeDataSource1(value) {
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    for (let i = 0; i < value.length; i++) {
      this.tempdatasource.push(value[i].city);
    }
    for (let i = 0; i < value.length; i++) {
      this.tempdatasource1.push(value[i].plant);
    }
  }

  selected(name) {
    console.log(this.projectMultiCtrl);
    if (name == "PhysicalVerification") {
      this.selectedProject = name;
      this.getProjectName();
    }

    if (name == "SelfCertification") {
      this.selectedProject = name;
      this.getSelfCertProjectName();
    }
  }
  getProjectName() {
    this.as.getProjectName(this.CompanyId).subscribe(r => {
      this.ProjectNameCtrl = r;
    })
  }
  getSelfCertProjectName() {
    this.as.getSelfCertProjectName(this.CompanyId).subscribe(r => {

      this.ProjectNameCtrl = r;
    })
  }
  zerovalueAssets: boolean = false;
  vendorAssets: boolean = false;
  grnAssets: boolean = false;
  changeToggle(value) {

    if (value == 'zerovalueAssets') {
      this.zerovalueAssets = !this.zerovalueAssets;
    }
    if (value == 'vendorAssets') {
      this.vendorAssets = !this.vendorAssets;
    }
    if (value == 'grnAssets') {
      this.grnAssets = !this.grnAssets;
    }
    if(!!this.displayTable)
    {
      this.viewSummary();
    }
    


  }
  viewSummary() {
    this.selection.clear();
    this.selectionnew.clear();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.Records = [];
    this.createProject();
  }
  IsZeroValueBlock: any;
  bindData: any[] = [];
  totalAssetCount1 = 0;
  totalAssetCost1 = 0;
  totalAssetWDV1 = 0;
  totalSelecForInveAssetCount1 = 0;
  totalSelecForInveAssetCost1 = 0;
  totalSelecForInveAssetWDV1 = 0;
  SelcetedForProjectQtyToDisablechkbox = 0;
  createProject() {
    this.as.CheckIsZeroValueBlockCreated(this.CompanyId).subscribe(r => {
      this.IsZeroValueBlock = r;
      this.GetAssetDataForCreateInventoryProjectBySp("");
    })
  }
  CategoryIdList: any[] = [];
  GetAssetDataForCreateInventoryProjectBySp(flag) {
    debugger;
    if (!this.InventoryDeadline) {
      this.toastr.warning(`Please Select ${this.Headers.InventoryDeadline}`, this.message.AssetrakSays);
      return null;
    }

    this.loader.open();
    this.displaybtn = false;
    this.displayTable = true;
    var isView = false;
    var blockIds = "";
     this.isUpload = false;
    if (flag == "viewmap") {
      isView = true;
      blockIds = 'no'
    }
    var locationId = 0;
    var SbuList = [];
    this.CategoryIdList = [];
    var LocationIdList = [];
    debugger;
    if (!!this.plantMultiCtrl && this.plantMultiCtrl.length > 0) {
      this.plantMultiCtrl.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }
    else {
      this.ListOfLoc.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }


    if (!!this.categoryMultiCtrl && this.categoryMultiCtrl.length > 0) {
      this.categoryMultiCtrl.forEach(x => {
        this.CategoryIdList.push(x.AssetCategoryId);
      })
    }
    else {
      this.ListOfCategory.forEach(x => {
        this.CategoryIdList.push(x.AssetCategoryId);
      })
    }

    if (!!this.cityMultiCtrl && this.cityMultiCtrl.length > 0) {
      this.cityMultiCtrl.forEach(x => {
        SbuList.push(x.SBU);
      })
    }
    var assetDetails = {
      companyId: this.CompanyId,
      zeroValue: this.zerovalueAssets,
      thirdParty: this.vendorAssets,
      GRNValue: this.grnAssets,
      isView: isView,
      locationIdList: LocationIdList,
      CategoryIdList: this.CategoryIdList,
      SBUList: SbuList,
      GroupId: this.GroupId,
      UserId: this.UserId,
      RegionId: this.RegionId,
      PageId: 32,
      isUpload : this.isUpload

    }

    if (flag == "viewmap") {
      this.loader.close();
      // this.rp.GetAssetDataForCreateInventoryProjectBySpForViewMap(assetDetails).subscribe(r => {
      //   this.bindData = JSON.parse(r);
      // })
    }
    else {
      //this.rp.GetAssetDataForCreateInventoryProjectByAPI(assetDetails).subscribe(r => {
      this.rp.GetAssetDataForCreateInventoryProjectByAPILocationWise(assetDetails).subscribe(r => {
        debugger;
        this.loader.close();
        this.bindData = [];
        this.displaybtn = true;
        this.displayTable = true;
        var arrdata = JSON.parse(r);
        for (var i = 0; i < arrdata.length; i++) {
          var aa = {
            Location: arrdata[i].Assetlocation,
            LocationId: arrdata[i].LocationId,
            CompanyId: arrdata[i].CompanyId,
            TotalAssetQty: arrdata[i].TotalAssetQty,
            TotalAssetCost: arrdata[i].TotalAssetCost,
            TotalAssetWDV: arrdata[i].TotalAssetWDV,
            SelcetedForProjectQty: arrdata[i].SelcetedForProjectQty,
            SelcetedForProjectCost: arrdata[i].SelcetedForProjectCost,
            SelcetedForProjectWDV: arrdata[i].SelcetedForProjectWDV
          }
          this.bindData.push(aa);
        }

        this.totalAssetCount1 = 0;
        this.totalAssetCost1 = 0;
        this.totalAssetWDV1 = 0;
        this.totalSelecForInveAssetCount1 = 0;
        this.totalSelecForInveAssetCost1 = 0;
        this.totalSelecForInveAssetWDV1 = 0;
        this.SelcetedForProjectQtyToDisablechkbox = 0;
        for (var i = 0; i < this.bindData.length; i++) {
          this.totalAssetCount1 += parseFloat(this.bindData[i].TotalAssetQty);
          this.totalAssetCost1 += parseFloat(this.bindData[i].TotalAssetCost);
          this.totalAssetWDV1 += parseFloat(this.bindData[i].TotalAssetWDV);
          this.totalSelecForInveAssetCount1 += parseFloat(this.bindData[i].SelcetedForProjectQty);
          this.totalSelecForInveAssetCost1 += parseFloat(this.bindData[i].SelcetedForProjectCost);
          this.totalSelecForInveAssetWDV1 += parseFloat(this.bindData[i].SelcetedForProjectWDV);
          this.SelcetedForProjectQtyToDisablechkbox += parseFloat(this.bindData[i].SelcetedForProjectQty);
        }

        this.onChangeDataSource(this.bindData);
      })
    }
  }
  onChangeDataSource(value) {
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.sort = this.sort;
    // this.isAllSelected = false;
    // var ids = [];
    // for (var i = 0; i < this.bindData.length; i++) {
    //   var idx = this.getselectedIds.indexOf(this.bindData[i].PreFarId);
    //   if (idx > -1) {
    //     ids.push(this.bindData[i].PreFarId);
    //   }
    // }
    // if (this.bindData.length > 0 && this.bindData.length == ids.length) {
    //   this.isAllSelected = true;
    // }
    this.isAllSelected = false;
    this.masterToggle();
  }

  numSelected: any = 0;
  getselectedIds: any[] = [];
  isAllSelected: boolean = false;
  masterToggle() {
    this.isAllSelected = !this.isAllSelected;
    this.getselectedIds = [];
    this.Records = [];
    this.selection.clear();
    
    this.selectionnew.clear();
    if (this.isAllSelected == true) {
      this.dataSource.data.forEach(row => {
        if (row.SelcetedForProjectQty > 0) {
          this.selection.select(row);
        }
      })
    }
    this.numSelected = this.selection.selected.length;
    if (this.numSelected > 0) {
      this.selection.selected.forEach(row => {
        this.getselectedIds.push(row.LocationId);
      });
    }
  }
 

  isSelected(row) {
    debugger;
    
   
    this.selection.toggle(row)
    this.numSelected = this.selection.selected.length;
    var idx = this.getselectedIds.indexOf(row.LocationId);
    if (idx > -1) {
      this.getselectedIds.splice(idx, 1);
    }
    else {
      this.getselectedIds.push(row.LocationId);
    }
  }
  CategoryGetdata() {
    debugger;
    var PlantList = [];
    if (!!this.plantMultiCtrl) {
      this.plantMultiCtrl.forEach(x => {
        PlantList.push(x.LocationId);
      })
    }
    else {
      this.ListOfLoc.forEach(x => {
        PlantList.push(x.LocationId);
      })
    }
    this.rp.GetCategoryRightWiseForReport(this.CompanyId, this.UserId, PlantList, false, 32).subscribe(r => {
      this.ListOfCategory = [];
      r.forEach(element => {
        this.ListOfCategory.push(element);
        this.getFilterCategoryType();
      });
    })
  }
  reloadComponent() {
    let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([currentUrl]);
    }

  Records: any[] = [];
  CreateMultipleVerificationProjectJSON() {
    debugger;
    if (this.getselectedIds.length > 0) {
      this.loader.open();
      var verificationPorject = {
        CompanyId: this.CompanyId,
        UserId: this.UserId,
        GroupId: this.GroupId,
        tempInclude: 'No',
        vendorInclude: this.vendorAssets === true ? 'yes' : 'no',
        zeroValueInclude: this.zerovalueAssets === true ? 'yes' : 'no',
        GrnValueInclude: this.grnAssets === true ? 'yes' : 'no',
        PageId: 32,
        RegionId: this.RegionId,
        LocationIdList: this.getselectedIds,
        CategoryIdList: this.CategoryIdList,
        projectName: this.ProjectNameCtrl,
        DueDate: this.datepipe.transform(this.InventoryDeadline, 'dd-MMM-yyyy'),
        isUpload : this.isUpload,
        fileName : this.fileName
      }
      this.as.CreateMultipleVerificationProjectJSON(verificationPorject).subscribe(r => {

        this.loader.close();
        if (r == "success") {
          this.toastr.success(this.message.InventoryProjectCreatedSucess, this.message.AssetrakSays);
        }
        else if (r == "1") {
          this.toastr.warning(this.message.licenceLimitExceed, this.message.AssetrakSays);
        }
        else if (r == "2") {
          this.toastr.warning(this.message.licenceExpiry, this.message.AssetrakSays);
        }
        else if (r == "Failed") {
          this.toastr.error('Failed', this.message.AssetrakSays);
        }

        this.getProjectName();
        this.reloadComponent();
      })

    }
    else {
      this.toastr.warning(this.message.SelectlocationToList, this.message.AssetrakSays);
    }

  }


  createSelfCertProject() {

  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.selfCertificationdataSource.sort = this.sort;
    this.selfCertificationdataSource.paginator = this.paginator;
  }

  maxDate: any;
  maxDateFormat: any;
  InventoryDeadlineValidation() {
    debugger;
    this.maxDateFormat = new Date(this.InventoryDeadline);
    var date  = new Date();    
    date.setDate(date.getDate()-1);
    if(this.maxDateFormat >= date){
      this.maxDate = this.datepipe.transform(this.maxDateFormat, 'dd-MMM-yyyy');
    }
    else{
      this.InventoryDeadline = "";
    }
    
  }
  selectedLocationId: any;



  openMappingDailog(b) {
    debugger;
    this.bindData.forEach(x => {
      x.popupdata = "";
      x.showbtn = false;
    });
    this.selectionnew.clear();
    this.getselectedIdsnew = [];
    this.selectedLocationId = b.LocationId;
    this.expandedElement = this.expandedElement === b ? null : b;
    var popupdata = [];
    var SbuList = [];
   
    var assetDetails = {
      companyId: this.CompanyId,
      zeroValue: this.zerovalueAssets,
      thirdParty: this.vendorAssets,
      GRNValue: this.grnAssets,
      isView: false,
      locationId: b.LocationId,
      CategoryIdList: this.CategoryIdList,
      SBUList: [],
      UserId: this.UserId,
      isUpload : this.isUpload,
      fileName : this.fileName
    }
    this.loader.open();
    this.rp.GetAssetDataForCreateInventoryProjectByAPICategoryWise(assetDetails).subscribe(r => {
      debugger;
      this.loader.close();
      var popupdata = [];
      var categoryData = [];
      if (!!r && r != 'null') {
        categoryData = JSON.parse(r);
      }
      // if (!!this.categoryMultiCtrl) {
      //   this.categoryMultiCtrl.forEach(element => {
      //     var aa = {
      //       AssetCategoryId: element.AssetCategoryId,
      //       AssetCategoryName: element.AssetCategoryName,
      //       Qty: 0,
      //       Cost: 0,
      //       WDV: 0
      //     }
      //     popupdata.push(aa);
      //   })
      // }

      this.ListOfCategory.forEach(element => {
        var idx = this.CategoryIdList.indexOf(element.AssetCategoryId);
        if(idx > -1){
          var aa = {
            AssetCategoryId: element.AssetCategoryId,
            AssetCategoryName: element.AssetCategoryName,
            Qty: 0,
            Cost: 0,
            WDV: 0
          }
          popupdata.push(aa);
        }        
      })

      popupdata.forEach(element => {
        for (var i = 0; i < categoryData.length; i++) {
          if (categoryData[i].CategoryId == element.AssetCategoryId) {
            element.Qty = categoryData[i].SelcetedForProjectQty;
            element.Cost = categoryData[i].SelcetedForProjectCost;
            element.WDV = categoryData[i].SelcetedForProjectWDV;
          }
        }
      });

      b.popupdata = popupdata;
      b.showbtn = true;
    })
    //=================================
  }

  hidetab(b) {
    this.selectionnew.clear();
    this.getselectedIdsnew = [];
    this.selectedLocationId = 0;
    //this.bindData.forEach(x=> x.popupdata = "");
    this.expandedElement = this.expandedElement === b ? null : b;
    b.popupdata = "";
    b.showbtn = false;
  }
  selectedData: any;
  categoryList: any;


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

  // toggleSelectAll(selectAllValue: boolean) {
  //   this.filteredPlantsMulti.pipe(take(1), takeUntil(this._onDestroy))
  //     .subscribe(val => {
  //       if (selectAllValue) {
  //         this.plantMultiCtrl.patchValue(val);
  //       } else {
  //         this.plantMultiCtrl.patchValue([]);
  //       }
  //     });
  // }

  toggleSelectAll(selectAllValue) {        
    this.plantMultiCtrl = [];
    this.filteredPlantsMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {     
        debugger;  
        if (!!selectAllValue.checked) {
          let search = this.plantMultiFilterCtrl.value;
          if(!!search){
            this.ListOfLoc.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1).forEach(element => {
              this.plantMultiCtrl.push(element);
            });
          }
          else{
            this.ListOfLoc.forEach(element => {
              this.plantMultiCtrl.push(element);
            });
          }          
        } else {
          this.plantMultiCtrl = "";
        }
        this.ListOfCategory = this.ListOfCategory1;
        this.getFilterCategoryType();
      });
  }

  toggleSelectAllProject(selectAllValue: boolean) {
    this.filteredprojectMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.projectMultiCtrl.patchValue(val);
        } else {
          this.projectMultiCtrl.patchValue([]);
        }
      });
  }

  toggleSelectAllcategory(selectAllValue) {
    this.categoryMultiCtrl = [];
    this.filteredcategoryMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (!!selectAllValue.checked) {
          let search = this.categoryFilterCtrl.value;
          if(!!search){
            this.ListOfCategory.filter(x => x.AssetCategoryName.toLowerCase().indexOf(search) > -1).forEach(element => {
              this.categoryMultiCtrl.push(element);
            });
          }
          else{
            this.ListOfCategory.forEach(element => {
              this.categoryMultiCtrl.push(element);
            });
          }          
        } else {
          this.categoryMultiCtrl = "";
        }
      });
  }

  viewSelected() {
   // this.getclear();
    this.paginationParams.totalCount = this.selection.selected.length;
    this.paginationParams.endIndex = this.selection.selected.length;
    this.onChangeDataSource(this.selection.selected);
  }
  clearSelectedView() {
   
    // this.getclear();
    this.selection.clear();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.paginationParams.totalCount = 0;
    if (!!this.bindData && this.bindData.length > 0) {
      this.paginationParams.totalCount = this.bindData[0].AssetListCount;
      this.paginationParams.endIndex = this.bindData[0].AssetListCount;

    }

    this.onChangeDataSource(this.bindData);  
  }
  clearSelected() {
    this.selection.clear();
    this.numSelected = 0;
    
    this.getselectedIds = [];
    this.Records = [];
    this.GetAssetDataForCreateInventoryProjectBySp("");
  }

  opentablePopup(columnName, tableData) {
    const dialogconfigcom = new MatDialogConfig();
    dialogconfigcom.disableClose = true;
    dialogconfigcom.autoFocus = true;
    dialogconfigcom.width = "45%";
    if (columnName == "City") {
      dialogconfigcom.data = {
        data1: this.tempdatasource,
        title: columnName
      }
    }
    else if (columnName == "Plant") {
      dialogconfigcom.data = {
        data1: this.tempdatasource1,
        title: columnName
      }
    }
    // console.log(this.dataSource);
    // this.localService.setItem('selectedColumn', columnName);
    // this.localService.setData(this.arrBirds);
    const dialogRef = this.dialog.open(tablecolumComponent, dialogconfigcom);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(tableData);
      if (result.length > 0) {
        if (columnName == "City") {
          for (let i = 0; i < tableData.length; i++) {
            var idx = result.indexOf(tableData[i].city);
            console.log(idx);
            if (idx > -1) {
              this.selecteddatasource.push(tableData[i])
            }
          }
          this.dataSource = new MatTableDataSource(this.selecteddatasource);
        }
        else if (columnName == "Plant") {
          for (let i = 0; i < tableData.length; i++) {
            var idx = result.indexOf(tableData[i].plant);

            if (idx > -1) {
              this.selecteddatasource.push(tableData[i])
            }
          }
          this.dataSource = new MatTableDataSource(this.selecteddatasource);
        }
      }
    });
  }

  openFilter_PopUp() {

  }



  customFilterPredicate() {
    const myFilterPredicate = (data: any, filter: string): boolean => {
      let searchString = JSON.parse(filter);
      return data.City.toString().trim().toLowerCase().indexOf(searchString.AssetNo.toLowerCase()) !== -1 &&
        data.Plant.toString().trim().indexOf(searchString.SubNo) !== -1;
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

  ClearSerch(columnName, isflag) {

    this.loader.open();
    this.isButtonVisible = !isflag;
    this.selection.clear();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.Records = [];
    this.onChangeDataSource(this.bindData);
    this.loader.close();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


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
    if (!this.ListOfLoc) {
      return;
    }
    let search = this.plantMultiFilterCtrl.value;
    if (!search) {
      this.filteredPlantsMulti.next(this.ListOfLoc.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredPlantsMulti.next(
      this.ListOfLoc.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1)
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
  protected filterProjectMulti() {
    if (!this.project) {
      return;
    }
    let search = this.projectFilterCtrl.value;
    if (!search) {
      this.filteredprojectMulti.next(this.project.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredprojectMulti.next(
      this.project.filter(project => project.name.toLowerCase().indexOf(search) > -1)
    );
  }

  masterTogglenew() {

    // this.getselectedIds = [];
    // if (this.isAllSelected == true) {
    //   this.dataSource.data.forEach(row => this.selection.select(row));
    // }
    // else {
    //   this.dataSource.data.forEach(row => this.selection.toggle(row));
    // }
    // this.numSelected = this.selection.selected.length;
    // if (this.numSelected > 0) {
    //   this.selection.selected.forEach(row => this.getselectedIds.push(row.AssetCategoryId));
    // }
  }
  getselectedIdsnew: any[] = [];
  isSelectednew(row) {

    this.selectionnew.toggle(row)
    this.numSelected = this.selectionnew.selected.length;
    var idx = this.getselectedIdsnew.indexOf(row.AssetCategoryId);
    if (idx > -1) {
      this.getselectedIdsnew.splice(idx, 1);
    }
    else {
      this.getselectedIdsnew.push(row.AssetCategoryId);
    }

    for (var i = 0; i < this.dataSource.data.length; i++) {
      if (this.dataSource.data[i].LocationId == this.selectedLocationId) {

        var totalQty = 0;
        var totalCost = 0;
        var totalWDV = 0;
        var categoryList = [];
        for (var j = 0; j < this.dataSource.data[i].categorydataforproject.length; j++) {
          var idx = this.getselectedIdsnew.indexOf(this.dataSource.data[i].categorydataforproject[j].AssetCategoryId);
          if (idx > -1) {
            totalQty = totalQty + parseFloat(this.dataSource.data[i].categorydataforproject[j].Qty);
            totalCost = totalCost + parseFloat(this.dataSource.data[i].categorydataforproject[j].Cost);
            totalWDV = totalWDV + parseFloat(this.dataSource.data[i].categorydataforproject[j].WDV);
            categoryList.push(this.dataSource.data[i].categorydataforproject[j].AssetCategoryId);
          }
        }
        this.dataSource.data[i].SelcetedForProjectQty = totalQty;
        this.dataSource.data[i].SelcetedForProjectCost = totalCost;
        this.dataSource.data[i].SelcetedForProjectWDV = totalWDV;
        this.dataSource.data[i].selectedCategoryForLocation = categoryList;

        for (var k = 0; k < this.Records.length; k++) {
          if (this.Records[k].LocationId == this.selectedLocationId) {
            this.Records[k].selectedBlockForLocation = this.dataSource.data[i].selectedCategoryForLocation;
          }
        }
      }
    }


    this.totalSelecForInveAssetCount1 = 0;
    this.totalSelecForInveAssetCost1 = 0;
    this.totalSelecForInveAssetWDV1 = 0;
    this.SelcetedForProjectQtyToDisablechkbox = 0;
    for (var i = 0; i < this.bindData.length; i++) {
      this.totalSelecForInveAssetCount1 += parseFloat(this.bindData[i].SelcetedForProjectQty);
      this.totalSelecForInveAssetCost1 += parseFloat(this.bindData[i].SelcetedForProjectCost);
      this.totalSelecForInveAssetWDV1 += parseFloat(this.bindData[i].SelcetedForProjectWDV);
      this.SelcetedForProjectQtyToDisablechkbox += parseFloat(this.bindData[i].SelcetedForProjectQty);
    }
  }

  openUpdateAuditRightsMapping(b) {

    this.selectedData = b.categorydataforproject;
    this.categoryList = !!b.selectedCategoryForLocation ? b.selectedCategoryForLocation : "";

    if (!!this.categoryList) {
      var arr = this.categoryList.split(',')
      for (var i = 0; i < this.selectedData.length; i++) {
        var idx = arr.indexOf(this.selectedData[i].AssetCategoryId.toString());
        if (idx > -1) {
          //this.isSelectednew(this.selectedData[i]);
          this.selectionnew.toggle(this.selectedData[i]);
          this.getselectedIdsnew.push(this.selectedData[i].AssetCategoryId);
        }
      }
    }
    else {
      for (var i = 0; i < this.selectedData.length; i++) {
        //this.isSelectednew(this.selectedData[i]);
        this.selectionnew.toggle(this.selectedData[i]);
        this.getselectedIdsnew.push(this.selectedData[i].AssetCategoryId);
      }
    }


  }
  openUpdateAuditRightsMapping_PopUp(b) {
   debugger;
    let configdata = {
      CompanyId: this.CompanyId,
      GroupId: this.GroupId,
      LocationId: b.LocationId,
      isThirdParty: this.zerovalueAssets,
      isZeroValue: this.vendorAssets,
      isGRNAssets: this.grnAssets,
      selectedProject: this.selectedProject,
      selectedData: b.categorydataforproject,
      categoryList: !!b.selectedCategoryForLocation ? b.selectedCategoryForLocation : ""

    }
    debugger;
    const dialogRef = this.dialog.open(UpdateAuditRightsMappingDialogComponent, {
      width: '980px',
      disableClose: true,
      data: { configdata: configdata }
    });
    dialogRef.afterClosed().subscribe(result => {

      if (!!result) {
        b.SelcetedForProjectQty = result.totalQty;
        b.SelcetedForProjectCost = result.totalCost;
        b.SelcetedForProjectWDV = result.totalWDV;
        b.selectedCategoryForLocation = result.categoryList;

        for (var k = 0; k < this.Records.length; k++) {
          if (this.Records[k].LocationId == b.LocationId) {
            this.Records[k].selectedBlockForLocation = b.selectedCategoryForLocation;
          }
        }
        this.totalSelecForInveAssetCount1 = 0;
        this.totalSelecForInveAssetCost1 = 0;
        this.totalSelecForInveAssetWDV1 = 0;
        this.SelcetedForProjectQtyToDisablechkbox = 0;
        for (var i = 0; i < this.bindData.length; i++) {
          this.totalSelecForInveAssetCount1 += parseFloat(this.bindData[i].SelcetedForProjectQty);
          this.totalSelecForInveAssetCost1 += parseFloat(this.bindData[i].SelcetedForProjectCost);
          this.totalSelecForInveAssetWDV1 += parseFloat(this.bindData[i].SelcetedForProjectWDV);
          this.SelcetedForProjectQtyToDisablechkbox += parseFloat(this.bindData[i].SelcetedForProjectQty);
        }
      }
    })
  }

  // openMappingDailog(b) {
  //    
  //   this.bindData.forEach(x => {
  //     x.popupdata = "";
  //     x.showbtn = false;
  //   });
  //   this.selectionnew.clear();
  //   this.getselectedIdsnew = [];
  //   this.selectedLocationId = b.LocationId;
  //   this.expandedElement = this.expandedElement === b ? null : b;
  //   var popupdata = [];
  //   if (!!this.categoryMultiCtrl) {
  //     this.categoryMultiCtrl.forEach(element => {   
  //       var aa = {
  //         AssetCategoryId : element.AssetCategoryId,
  //         AssetCategoryName : element.AssetCategoryName,
  //         Qty : 0 ,
  //         Cost : 0,
  //         WDV : 0
  //       }
  //       popupdata.push(aa);
  //     })
  //   }
  //   else {
  //     this.ListOfCategory.forEach(element => {
  //       var aa = {
  //         AssetCategoryId : element.AssetCategoryId,
  //         AssetCategoryName : element.AssetCategoryName,
  //         Qty : 0 ,
  //         Cost : 0,
  //         WDV : 0
  //       }
  //       popupdata.push(aa);
  //     })
  //   }
  //    
  //   popupdata.forEach(element => {
  //     for(var i=0 ; i< b.categorydataforproject.length ; i++){
  //       if(b.categorydataforproject[i].CategoryId == element.AssetCategoryId){
  //         element.Qty = b.categorydataforproject[i].SelcetedForProjectQty ;
  //         element.Cost = b.categorydataforproject[i].SelcetedForProjectCost ;
  //         element.WDV = b.categorydataforproject[i].SelcetedForProjectWDV ;
  //       }
  //    }
  //   });
  //    
  //   //b.popupdata = b.categorydataforproject; 
  //   b.popupdata = popupdata;    
  //   b.showbtn = true;  
  // }


}
