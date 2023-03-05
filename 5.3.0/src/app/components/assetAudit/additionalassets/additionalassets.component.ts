import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild,Output,EventEmitter} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ReportService } from '../../services/ReportService';
import { MatSelect } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { LocalStoreService } from 'app/shared/services/local-store.service';
import { assetTabsComponent } from '../../partialView/assetDetails/asset_tabs.component';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';

import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { GroupService } from '../../services/GroupService';

import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/UserService';
import { CompanyLocationService } from '../../services/CompanyLocationService';
import { CompanyBlockService } from '../../services/CompanyBlockService';
import { ReconciliationService } from '../../services/ReconciliationService';
import { AuditService } from '../../services/AuditService';

import { UserRoleService } from 'app/components/services/UserRoleService';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GetFieldsComponent } from 'app/components/partialView/get-fields/get-fields.component';
import { GroupDetailsComponent } from 'app/components/partialView/group-details/group-details.component';
import { AllPathService } from 'app/components/services/AllPathServices';
import { ExportFieldsComponent } from 'app/components/partialView/export-fields/export-fields.component'; 
import * as menuheaders from '../../../../assets/MenuHeaders.json';
import { MultiSearchDialogComponent } from 'app/components/partialView/multi-search-dialog/multi-search-dialog.component';



interface SBU {
  id: string;
  name: string;
}

@Component({
  selector: 'app-additionalassets',
  templateUrl: './additionalassets.component.html',
  styleUrls: ['./additionalassets.component.scss']
})
export class AdditionalassetsComponent implements OnInit {
  CompanyId: any;
  GroupId: any;
  UserId: any;
  RegionId: any;
  layerid;
  grid: any;
  lcnsbu: any;
  adt: any;
  astcls: any;
  plantlist: any;
  loocationtypes: boolean = false;
  paginationParams: any;
  show: boolean = false;
  selectedSBUList: any[] = [];
  selectedPlantIdList: any[] = [];
  selectedCompanyList: any[] = [];
  RetireData: any[] = [];
  resultData: any;
  locations: any[] = [];
  SBUList: any;
  PlantList: any[] =[];
  categorylist: any;
  IslayerDisplay: any;
  Layertext: any;
  HeaderLayerText: any;
  isButtonVisible: boolean = false;
  submitted: boolean = false;
  setflag: boolean =false;
  showlocation : boolean =true;
  public arrlength = 0;
  public fil = 0;
  public appliedfilters: any[] = [];
  @Output() insuranceEndDate: EventEmitter<any> = new EventEmitter<any>();
  header: any ;
  message: any ;
  Headers: any ;
  panelOpenState = true;
  
  selection = new SelectionModel<any>(true, []);

  public additionaltype: any[] = [];

  public locationtype: any[] = [];

  public cityMultiCtrl: any;
  public cityMultiFilterCtrl: FormControl = new FormControl();
  public filteredCityMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public plantMultiCtrl: any;
  public plantMultiFilterCtrl: FormControl = new FormControl();
  public filteredPlantsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public categoryMultiCtrl: any;
  public categoryFilterCtrl: FormControl = new FormControl();
  public filteredcategoryMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public additionalMultiCtrl: any;
  public additionaltypedata: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public locationtypeCtrl: any;
  public locationtypedata: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public SBUMultiFilterCtrl: FormControl = new FormControl();
  public SBUMultiCtrl: any = new FormControl();
  public filteredSBUMulti: ReplaySubject<SBU[]> = new ReplaySubject<SBU[]>(1);
  public filtered: ReplaySubject<SBU[]> = new ReplaySubject<SBU[]>(1);
  public filteredSBU: ReplaySubject<SBU[]> = new ReplaySubject<SBU[]>(1);

  public projectidMultiCtrl: any;
  public projectidFilterCtrl: FormControl = new FormControl();
  public filteredprojectidMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);


  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;

  protected _onDestroy = new Subject<void>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ReportForm: FormGroup;
  get f1() { return this.ReportForm.controls; };

  menuheader: any = (menuheaders as any).default
  constructor(private ads: AuditService, private cbs: CompanyBlockService, private cls: CompanyLocationService, public gs: GroupService, private httpService: HttpClient, public localService: LocalStoreService, private storage: ManagerService,
    public dialog: MatDialog, private confirmService: AppConfirmService, private loader: AppLoaderService, private jwtAuth: JwtAuthService,
    private router: Router,
    public alertService: MessageAlertService,
    private userRoleService: UserRoleService,
    private fb: FormBuilder,
    public us: UserService,
    public reconciliationService: ReconciliationService,
    public toastr: ToastrService,
    public rp: ReportService,
    public AllPathService: AllPathService) {
      this.header = this.jwtAuth.getHeaders();
      this.Headers = this.jwtAuth.getHeaders();
	    this.message = this.jwtAuth.getResources();
      this.additionaltype = [
        { id: 'Project Location Asset', name: this.Headers.ProjectAsset },
        { id: 'Other Location Asset', name: this.Headers.OutOfProjectAsset },
        { id: 'Group Company Asset', name: this.Headers.GroupCompanyAsset },
        {id: 'Asset not part of the Group',name:this.Headers.OtherAssets}
        // { id: 'Asset not part of Project', name: this.Headers.AssetNotPartOfProject },
      ];
    
      this.locationtype = [
        { id: 'Physical Location', name: this.Headers.PhysicalLocation },
        { id: 'Location', name: this.Headers.Location }
      ];
     }

  dataSource = new MatTableDataSource<any>();
  public additionaltiFilterCtrl: FormControl = new FormControl();
  public locationtiFilterCtrl: FormControl = new FormControl();

  displayedColumns: any[] = [];
 displayTable: boolean = false;
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
    this.plantMultiCtrl ="";
    this.GetInitiatedData();

    this.ReportForm = this.fb.group({
      additionaltiFilterCtrl: ['', [Validators.required]],
      plantMultiFilterCtrl : ['', [Validators.required]],
      locationtiFilterCtrl : ['', [Validators.required]],
    });
    this.additionaltypedata.next(this.additionaltype.slice());

  }

  ListOfField: any[] = [];
  ListOfLoc1: any[] = [];
  ListOfFilter: any[] = [];
  ListOfFilterName: any[] = [];
  NewModifiedList: any[] = [];
  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  ExportedFields: any[] = [];
  limit = 10;
  offset = 0;
  ListOfField1: any[] = [];
  searchColumns: any[] = [];
  GetInitiatedData() {
      
    let url1 = this.gs.GetFieldListByPageId(36,this.UserId,this.CompanyId);
    let url2 = this.gs.GetFilterIDlistByPageId(36);
    let url3 = this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 36);
    let url4 = this.cls.GetLocationListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 36)
    let url5 = this.cbs.GetCategoryListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 36);
  //  let url6 = this.gs.GetFieldList(36,this.UserId);
    forkJoin([url1, url2, url3, url4, url5]).subscribe(results => {
      if (!!results[0]) {
        this.ListOfField = JSON.parse(results[0]);
        this.searchColumns = this.ListOfField.filter(x => x.SearchOptionEnabled == true).map(choice => choice);
        this.displayedColumns = this.ListOfField;
        this.displayedColumns = this.displayedColumns.filter(x => x.Custom2 == "1").map(choice => choice.Custom1);
        this.displayedColumns = ['Select','Icon'].concat(this.displayedColumns);
        console.log("filter", this.displayedColumns)
      }
      if (!!results[1]) {
        this.ListOfFilter = JSON.parse(results[1]);
        if (!!this.ListOfFilter) {
          this.ListOfFilter.forEach(x => this.ListOfFilterName.push(x.FilterName))
        }
        console.log(this.ListOfFilter);
      }
      if (!!results[2]) {
          
        this.ListOfPagePermission = JSON.parse(results[2]);
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
      if (!!results[3]) {
        this.SBUList = JSON.parse(results[3]);
        this.PlantList = JSON.parse(results[3]);
        this.ListOfLoc1 = JSON.parse(results[3]);
        this.getFilterPlantType();
        this.OnGetlayerid();
      }
      if (!!results[4]) {
        this.categorylist = JSON.parse(results[4]);
        this.getFilterCategoryType();
      }
      // if (!!results[5]) {

      //   this.ListOfField1 = JSON.parse(results[5]);
      //   this.searchColumns = this.ListOfField1.filter(x => x.SearchOptionEnabled == true).map(choice => choice);
      // }
     // this.GetInventoryProjectList();
      this.loader.close();
      this.GetPageSession();
    })
  }

  StorePageSession: any;
  GetPageSession() {
    debugger;
    this.StorePageSession = "";
    if (!!localStorage.getItem('PageSession') && localStorage.getItem('PageSession') != "null") {
      this.StorePageSession = {}
      this.StorePageSession = JSON.parse(localStorage.getItem('PageSession'));
      if (this.StorePageSession.Pagename === "Additional Asset") {
        
      }
      else {
        localStorage.setItem('PageSession', null);
        this.StorePageSession = "";
      }
    }
  }

  CategoryGetdata() {
    var PlantList = [];
    if (!!this.plantMultiCtrl) {
      this.plantMultiCtrl.forEach(x => {
        PlantList.push(x.LocationId);
      })
    }
    else {
      this.ListOfLoc1.forEach(x => {
        PlantList.push(x.LocationId);
      })
    } 
   // var PlantList = "";
   //  PlantList = !!this.selectedPlantIdList ? this.selectedPlantIdList.join(',') : "";
    debugger
    this.rp.GetCategoryRightWiseForReport(this.CompanyId, this.UserId, PlantList, false,24).subscribe(r => {
      this.categorylist=[];
      r.forEach(element => {
        // this.ListOfCategory=[];
        this.categorylist.push(element);
        this.getFilterCategoryType();
      });
    })
  }

  onchangeSBU(value) {
    debugger;
    this.showmultiSearch = false;
    this.ListProject=[];
        if(!!value){
          var list = [];    
          if(!!this.SBUMultiCtrl && this.SBUMultiCtrl.length > 0){
            this.SBUMultiCtrl.forEach(x => {
              this.PlantList = this.ListOfLoc1.filter(y => y[this.Layertext].indexOf(x) > -1);
              this.PlantList.forEach(x => {
                list.push(x);
              })        
            })
            this.PlantList = list;
          }
          else{
            this.PlantList = this.ListOfLoc1.filter(y => y);
          }      
          this.plantMultiCtrl = "";
          this.projectidMultiCtrl="";
          this.getFilterPlantType();
        }
        else{     
          this.PlantList = this.ListOfLoc1;
           this.plantMultiCtrl = "";
           this.projectidMultiCtrl ="";
          this.getFilterPlantType();
        } 
        this.filterProjectIdMulti();  
        this.GetInventoryProjectList();
        // if (!!value) {
        //   this.ListOfLoc = this.ListOfLoc1.filter(x => x[this.Layertext].indexOf(value) > -1);
        //   this.getFilterPlantType();
        // }
        // else {
        //   this.ListOfLoc = this.ListOfLoc1.filter(x => x);
        //   this.getFilterPlantType();
        // }
      }
  // onchangeSBU(value){
      
  //   if(!!value){
  //     this.PlantList = this.ListOfLoc1.filter(x => x[this.Layertext].indexOf(value) > -1);
  //     this.getFilterPlantType();
  //   }
  //   else{
  //     this.PlantList = this.ListOfLoc1.filter(x => x);
  //     this.getFilterPlantType();
  //   }    
  // }

  OnGetlayerid() {
    if (this.layerid == 1) {
      this.SBUList = this.SBUList.filter((item, i, arr) => arr.findIndex((t) => t.Country === item.Country) === i);
      this.filteredSBUMulti.next(this.SBUList);
      // this.filteredPlantsMulti.next(this.PlantList.filter((item) => item.Country = this.SBUName).slice());
      // this.filteredSBUMulti.next(this.SBUList.filter((item) => item.Country.slice()));
    }
    else if (this.layerid == 2) {
      this.SBUList = this.SBUList.filter((item, i, arr) => arr.findIndex((t) => t.State === item.State) === i);
      this.filteredSBUMulti.next(this.SBUList);
      // this.filteredPlantsMulti.next(this.PlantList.filter((item) => item.State = this.SBUName.slice()));
    }
    else if (this.layerid == 3) {
      this.SBUList = this.SBUList.filter((item, i, arr) => arr.findIndex((t) => t.City === item.City) === i);
      this.filteredSBUMulti.next(this.SBUList);
    }
    else if (this.layerid == 4) {
      this.SBUList = this.SBUList.filter((item, i, arr) => arr.findIndex((t) => t.Zone === item.Zone) === i);
      this.filteredSBUMulti.next(this.SBUList);
    }
  }

  //====== Bind Data To DataSource========  
  handlePage(pageEvent: PageEvent) {
      
    this.paginationParams.pageSize = pageEvent.pageSize;
    this.paginationParams.currentPageIndex = pageEvent.pageIndex;
    this.paginationParams.endIndex = (this.paginationParams.currentPageIndex + 1) * pageEvent.pageSize;
    this.paginationParams.startIndex = this.paginationParams.currentPageIndex * pageEvent.pageSize;
    this.GetNewAddtionalAssetDetailsListPartOfProjectBindData("")
    if(this.multipleserach= true && this.multiSearch.length > 0)
    {
      this.GetNewAddtionalAssetDetailsListPartOfProjectBindData("multiplesearch");
    }
  }
  GetNewAddtionalAssetDetailsListPartOfProject() {
    debugger;
    this.selection.clear();
    this.numSelected = 0;
    this.Onchange();
    this.getselectedIds = [];
    this.GetNewAddtionalAssetDetailsListPartOfProjectBindData("OnPageload");
  }
  bindData: any[] = [];
  isExport: boolean = false;
  displaybtn: boolean = false;
  Searchlist :any[];
  GetNewAddtionalAssetDetailsListPartOfProjectBindData(Action) {

    if(this.locationtypeCtrl== "" && this.showlocation == true){
      this.toastr.warning(`Please Select ${this.Headers.LocationType}`, this.message.AssetrakSays);
       return null;
     }
     else if(this.additionalMultiCtrl ==""){
      this.toastr.warning(`Please Select ${this.Headers.AdditionalType}`, this.message.AssetrakSays);
       return null;
    }
    else if((!this.locationtypeCtrl) && (!this.additionalMultiCtrl)){
      this.toastr.warning(`Please Select ${this.Headers.LocationType} /${this.Headers.AdditionalType}`, this.message.AssetrakSays);
       return null;
    }

    this.loader.open();
    var LocationIdList = [];
    var SbuList = [];
    var locationId = 0;
    var CategoryIdList = [];
    var additionalassettype = "";
    var additionalremark = "";
    this.multipleserach = false;
     if (!!this.plantMultiCtrl) {
      // locationId = !!this.plantMultiCtrl ? this.plantMultiCtrl.LocationId : 0;
      // LocationIdList.push(locationId);
      this.plantMultiCtrl.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
      if(LocationIdList.length== 0)
      {
         this.toastr.warning(`Please Select ${this.Headers.Location}`, this.message.AssetrakSays);
        this.loader.close();
        return null;
      }
    }
    else {
      this.PlantList.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }

    if (!!this.categoryMultiCtrl) {
      this.categoryMultiCtrl.forEach(x => {
        CategoryIdList.push(x.AssetCategoryId);
      })
    }
    else {
      this.categorylist.forEach(x => {
        CategoryIdList.push(x.AssetCategoryId);
      })
    }
    additionalassettype = this.additionalMultiCtrl;
    if (additionalassettype == "Project Location Asset") {
      additionalremark = "Asset part of project";
      }
    else {
      additionalremark = additionalassettype;
    }
    if (Action === 'IsExport') {
      this.isExport = true;
    }
    if (!!this.projectidMultiCtrl) {
      debugger;
      this.ProjectIdList = [];
      // locationId = !!this.plantMultiCtrl ? this.plantMultiCtrl.LocationId : 0;
      // LocationIdList.push(locationId);
      this.projectidMultiCtrl.forEach(x => {
        this.ProjectIdList.push(x.ProjectId);
      })
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
var assetDetails = {
      CompanyId: this.CompanyId,
      LocationId: !!this.plantMultiCtrl ? this.plantMultiCtrl.LocationId : 0,
      LocationIdList: LocationIdList,
      AdditionalRemark: additionalremark,
      LocationType: this.locationtypeCtrl,
      RegionId: this.RegionId,
      SbuList: SbuList,
      CategoryIdList: CategoryIdList,
      AssetsClassList: [],
      typeOfAssetList: [],
      subTypeOfAssetList: [],
      AdditionalTypeId: [],
      Ispotential: false,
      ProjectIdList:this.ProjectIdList ,
      projectName: !!this.projectidMultiCtrl ? this.projectidMultiCtrl.Name : "",
      AdditionalDefault: false,
      IsExport: this.isExport,
      IsSearch: false,
      SearchText: "",
      TagginStatusList: "",
      pageNo: this.paginationParams.currentPageIndex + 1,
      pageSize: this.paginationParams.pageSize,
      PageId : 36,
      ExportedFields : this.ExportedFields,
      ismultiplesearch: this.multipleserach,
      Searchlist : this.Searchlist,
    }

    this.ads.GetNewAddtionalAssetDetailsListPartOfProject(assetDetails).subscribe(data => {
        
      this.bindData =[];
      this.loader.close();
      if (Action === 'IsExport') {
        debugger;
        if(!!data)
        {
          this.AllPathService.DownloadExportFile(data);
          console.log("URL", URL);
        }
      }else{
      this.bindData = JSON.parse(data);
      this.paginationParams.totalCount = 0;
      if (!!this.bindData && this.bindData.length > 0) {
        this.paginationParams.totalCount = this.bindData[0].AssetListCount;
        if(this.showdeletebtn == true){
          this.displaybtn = true;
          }
        this.displayTable =true;
      }
      else{
        if(this.showdeletebtn == true){
          this.displaybtn = true;
          }
        this.displayTable =true
        //this.toastr.warning(this.message.NoDataAvailable, this.message.AssetrakSays);
      }
      this.onChangeDataSourceC(this.bindData);
    }
    });
  }

  NewApproveAdditionalAssets() {
      
    var outwardType = "Approve";
    var transitType = "";
    if (outwardType == "Approve") {
      transitType = "None";
    }
    else if (outwardType == "ApproveTempTransfer") {
      transitType = "Temporary";
    }
    else {
      transitType = "Permanent";
    }
    if (this.getselectedIds.length > 0) {
      var assetsDetails = {
        companyId: this.CompanyId,
        transitType: transitType,
        assetLists: this.getselectedIds.join(','),
        modifiedBy: this.UserId
      }
      this.reconciliationService.NewApproveAdditionalAssets(assetsDetails).subscribe(r => {
          
        if (r == "success") {
          this.toastr.success(this.message.AssetRemarkSetSucess, this.message.AssetrakSays);
        }
        else {
          this.toastr.warning(this.message.OperationFailed, this.message.AssetrakSays);
        }
        this.clearSelected();

      });
    }
    else {
      this.toastr.warning(this.message.SelectAsset, this.message.AssetrakSays);
    }

  }

  numSelected: any = 0;
  getselectedIds: any[] = [];
  isAllSelected: boolean = false;
  masterToggle() {
      
    this.isAllSelected = !this.isAllSelected;
    this.selection.clear();
    this.getselectedIds = [];
    if (this.isAllSelected == true) {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
    // else {
    //   this.dataSource.data.forEach(row => this.selection.toggle(row));
    // }
    this.numSelected = this.selection.selected.length;
    if (this.numSelected > 0) {
      this.selection.selected.forEach(row => this.getselectedIds.push(row.AdditionalAssetId));
    }
  }

  isSelected(row) {
   
    this.selection.toggle(row)
    this.numSelected = this.selection.selected.length;
    var idx = this.getselectedIds.indexOf(row.AdditionalAssetId);
    if (idx > -1) {
      this.getselectedIds.splice(idx, 1);
    }
    else {
      this.getselectedIds.push(row.AdditionalAssetId);
    }
  }

  getFilterSBUUS() {
    this.filteredSBUMulti.next(this.SBUList.slice());
    this.ReportForm.controls['sbuMultiFilterCtrl'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterSBUMulti();
      });
  }
PageId =36;
ReportFlag :boolean = false;
openPopUp(data: any = {}) {
  debugger;
  this.ReportFlag = false;
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

  protected filterSBUMulti() {
    if (!this.SBUList) {
      return;
    }
    let search = this.ReportForm.controls['sbuMultiFilterCtrl'].value;
    if (!search) {
      this.filteredSBUMulti.next(this.SBUList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredSBUMulti.next(
      this.SBUList.filter(x => x.SBU.toLowerCase().indexOf(search) > -1)
    );
  }


  GetCompanyBlockListByCompanyId() {
    this.cbs.GetToBindSelectListForInventoryAdditional(this.CompanyId, this.selectedlocationtype, this.selectedadditionaltype).subscribe(data => {
        
      this.lcnsbu = data;
      //this.citylist.next(this.lcnsbu.slice());
    })
  }

  selectedadditionaltype: any;
  loocationtypesCheckValidation:any;
  showdeletebtn :boolean=false;
  Onchangeadditionaltype(event) {
    debugger;
    this.showmultiSearch = false;
    this.selection.clear();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.ListProject=[];
    this.locationtypeCtrl = "";
    this.plantMultiCtrl = "";
    this.projectidMultiCtrl ="";
    this.loocationtypesCheckValidation = false;
    this.displaybtn = false;
    this.onChangeDataSourceC("");
    if (event == "Project Location Asset") {
      this.showlocation = true;
      this.loocationtypes = true;
      this.showdeletebtn =false;
      this.selectedadditionaltype = "Asset part of project";
      this.selectedlocationtype = "";
      this.locationtypedata.next(this.locationtype.slice());
      }
    else {
      this.showdeletebtn =false;
      this.showlocation = false;
      this.loocationtypesCheckValidation = true;
      this.loocationtypes = false;
      this.selectedadditionaltype = event;
      if(this.selectedadditionaltype == "Asset not part of the Group"){
        this.showdeletebtn =true;
      }
      this.selectedlocationtype = "Select Type";
    }
    this.GetCompanyBlockListByCompanyId();
    this.filterProjectIdMulti();
    this.GetInventoryProjectList();

  }

  selectedlocationtype: any;

  Onchangelocationtype(event) {
    debugger;
    this.showmultiSearch = false;
    this.selectedlocationtype = event;
    this.loocationtypesCheckValidation = true;
    this.selection.clear();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.ListProject=[];
    //  this.plantMultiCtrl = "";
    this.projectidMultiCtrl="";
    this.onChangeDataSourceC("");
    this.GetCompanyBlockListByCompanyId();
    this.filterProjectIdMulti();
    this.GetInventoryProjectList();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onChangeDataSourceC(value) {
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.sort = this.sort;
  }

  applyFilterC(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  SelectedPlant: any[] = [];

  onChangePlant(plantId) {
    this.showmultiSearch = false;
    //this.SelectedPlant = event;
    this.selection.clear();
    this.SelectedPlant =[];
    this.selectedPlantIdList.push(plantId); 
    this.GetInventoryProjectList();
    //this.CategoryGetdata();
  }
  clickToExport() {
    if(this.displayTable == true && this.dataSource.data.length != 0){
      this.GetNewAddtionalAssetDetailsListPartOfProjectBindData("IsExport");
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
   clearSelectedView() {
  
    this.selection.clear();
    this.numSelected = 0;
    this.getselectedIds = [];
  this.paginationParams.totalCount = 0;
      if (!!this.bindData && this.bindData.length > 0) {
        this.paginationParams.totalCount = this.bindData[0].AssetListCount;
      
      }
      
      this.onChangeDataSourceC(this.bindData);
   }
  clearSelected() {
    this.selection.clear();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.GetNewAddtionalAssetDetailsListPartOfProjectBindData("");
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
        this.displayedColumns = ['Icon'].concat(this.displayedColumns);
      }
    })
  }
  GetSubGroupJson(element) {
    let title = 'Group Details';
    const dialogRef = this.dialog.open(GroupDetailsComponent, {
      width: 'auto',
      data: { title: title, payload: element.PreFarId }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {

      }
    })
  }

  toggleSelectAllSBU(selectAllValue: boolean) {
    this.filteredSBUMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.SBUMultiCtrl.patchValue(val);
        } else {
          this.SBUMultiCtrl.patchValue([]);
        }
      });
  }

  toggleSelectPlantAll(selectAllValue: boolean) {
    this.filteredPlantsMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.plantMultiCtrl.patchValue(val);
        } else {
          this.plantMultiCtrl.patchValue([]);
        }
      });
  }

  getFilterCategoryType() {
    this.filteredcategoryMulti.next(this.categorylist.slice());
    this.categoryFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCategoryMulti();
      });
  }
  protected filterCategoryMulti() {
    if (!this.categorylist) {
      return;
    }
    let search = this.categoryFilterCtrl.value;
    if (!search) {
      this.filteredcategoryMulti.next(this.categorylist.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredcategoryMulti.next(
      this.categorylist.filter(x => x.AssetCategoryName.toLowerCase().indexOf(search) > -1)
    );
  }

  getFilterPlantType() {
    this.filteredPlantsMulti.next(this.PlantList.slice(0, this.offset + this.limit));
    this.plantMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPlantsMulti();
      });
  }
  protected filterPlantsMulti() {
    if (!this.PlantList) {
      return;
    }
    let search = this.plantMultiFilterCtrl.value;
    if (!search) {
      this.filteredPlantsMulti.next(this.PlantList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredPlantsMulti.next(
      this.PlantList.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1)
    );
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
        this.clickToExport();     
      }
    })
  }

  ListProject: any[] = [];

  GetInventoryProjectList() {
    debugger;
      this.loader.open();
      this.ListProject=[];
      this.projectidMultiCtrl="";
     // this.plantMultiCtrl="";
      this.filteredprojectidMulti = new ReplaySubject<any[]>(1);
      var LocationIdList = [];
      var SbuList = [];
      var CategoryIdList = [];
      this.CategoryGetdata();
      if (!!this.plantMultiCtrl) {
        this.plantMultiCtrl.forEach(x => {
          LocationIdList.push(x.LocationId);

        })
        if(LocationIdList.length == 0)
        {
          // this.toastr.warning(`Please Select ${this.Headers.Location} }`, this.message.AssetrakSays);
          this.loader.close();
          this.ListProject = [];
          return null;
        }
      }
      else {
        this.PlantList.forEach(x => {
          LocationIdList.push(x.LocationId);
        })
      }
  
      if (!!this.categoryMultiCtrl) {
        this.categoryMultiCtrl.forEach(x => {
          CategoryIdList.push(x.AssetCategoryId);
        })
      }
      else {
        this.categorylist.forEach(x => {
          CategoryIdList.push(x.AssetCategoryId);
        })
      }
  
      var assetDetails = {
        UserId: this.UserId,
        GroupId: this.GroupId,
        companyId: this.CompanyId,
        locationIdList: LocationIdList,
        CategoryIdList: CategoryIdList,
        RegionId: this.RegionId,
        PageId:36,
        AdditionalRemark: this.selectedadditionaltype,
        LocationType: this.selectedlocationtype,
      }
      debugger;
      this.reconciliationService.GetProjectIdListByCompanyIdLocationIdUserId(assetDetails).subscribe(r => {
        debugger;
        this.loader.close();
        this.ListProject = r;// JSON.parse(r);
        this.filterProjectIdMulti();
      })
    }

    protected filterProjectIdMulti() {
     if (!this.ListProject) {
        return;
      }
      let search = this.projectidFilterCtrl.value;
      if (!search) {
        this.filteredprojectidMulti.next(this.ListProject.slice());
        return;
      } else {
        search = search.toLowerCase();
      }
      this.filteredprojectidMulti.next(
        this.ListProject.filter(projectid => projectid.name.toLowerCase().indexOf(search) > -1)
      );
    }
    loclist: any[] = [];
    loclistIds: any[] = [];
    projectid:any[] = [];
    ProjectIdList:any[] =[];
    OnchangeProjectId(val) {
      debugger;
      this.showmultiSearch = false;
      this.selection.clear();
      this.ProjectIdList= [];
      this.projectid = val.ProjectId
      this.ProjectIdList.push( this.projectid);
     }
     toggleSelectAll(selectAllValue) {    
      debugger;
        this.plantMultiCtrl=[];
        this.filteredPlantsMulti.pipe(take(1), takeUntil(this._onDestroy))
          .subscribe(val => {      
             
            if (!!selectAllValue.checked) {
              //this.plantMultiCtrl.patchValue(val);
              this.PlantList.forEach(element => {
                this.plantMultiCtrl.push(element);
              });          
            } else {         
              this.plantMultiCtrl="";
            }
            this.ListProject =this.ListProject;
            this.GetInventoryProjectList();
            this.filterProjectIdMulti();
           // this.onChangePlant('');
          });
      }
      DeleteAdditionalAssets() {
        debugger;
        if (this.getselectedIds.length == 0) {
          this.toastr.warning(this.message.SelectAsset, this.message.AssetrakSays);
          return null;
        }
        this.confirmService.confirm({ message: this.message.DeleteSelectedAssets, title: this.message.AssetrakSays })
          .subscribe(res => {
            if (!!res) {
              debugger;
              var assetsDetails =
              {
               // CompanyId: parseInt(this.CompanyId),
                Ids: this.getselectedIds.join(',')
              }
              this.loader.open();
              this.reconciliationService.DeleteAdditionalAssetsById(assetsDetails).subscribe(r => {
                debugger;
                this.loader.close();
                if (r == "success") {
                  this.toastr.success(this.message.AssetDeleteSucess, this.message.AssetrakSays);
                }
                else {
                  this.toastr.error(this.message.SessionTimeOutError, this.message.AssetrakSays);
                }
                this.clearSelected();
              })
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
      //  if(item.fieldname == "Register")
      //  {
      //    this.registerflag =true;
      //  }
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
      this.searchCount = 0;
      this.hideSearch = false;
      this.multiSearch.forEach(val => {
        var s = val.HighValue;
        s = s.replace(/,/g, '');
        if(!!val.HighValue){
          this.hideSearch = true;
          this.searchCount = this.searchCount + 1;
        }
        val.HighValue = s; 
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
        this.GetNewAddtionalAssetDetailsListPartOfProjectBindData("");
    }
    multipleserach : boolean= false;
    onMultiSearchClick(){
    
         
        this.multipleserach= true ;
        this.GetNewAddtionalAssetDetailsListPartOfProjectBindData("multiplesearch");
        console.log(this.multiSearch);
    
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
    }
    changeEndDate(dateEvent4) {
      debugger;
      this.insuranceEndDate.emit(dateEvent4.value);
    }
    Onchange(){
      this.showmultiSearch = false;
    }
    clearInput(val:any){	
      val.HighValue = '';	
    }
}
