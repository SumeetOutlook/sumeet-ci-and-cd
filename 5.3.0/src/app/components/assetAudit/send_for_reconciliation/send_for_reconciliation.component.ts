import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl ,FormBuilder,FormGroup,Validators} from '@angular/forms';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSelect } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
/*import{filterPopupComponent} from './filter_Popup/filter_Popup.component';*/
import * as header from '../../../../assets/Headers.json';
import * as resource from '../../../../assets/Resource.json';
import { DatePipe } from '@angular/common';
import { AssetClassWiseInventoryStatusDialogComponent } from './asset_class_wise_inventory_status_dialog/asset_class_wise_inventory_status_dialog.component';
import * as menuheaders from '../../../../assets/MenuHeaders.json'
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { UserService } from '../../services/UserService';
import { CompanyLocationService } from '../../services/CompanyLocationService';
import { UserMappingService } from '../../services/UserMappingService';
import { CompanyBlockService } from '../../services/CompanyBlockService';
import { GroupService } from '../../services/GroupService';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Constants } from 'app/components/storage/constants';
import { AuditService } from '../../services/AuditService';
import { ReportService } from '../../services/ReportService';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';


@Component({
  selector: 'app-send_for_reconciliation',
  templateUrl: './send_for_reconciliation.component.html',
  styleUrls: ['./send_for_reconciliation.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SendForReconciliationComponent implements OnInit, AfterViewInit, OnDestroy {
  Headers: any ;
  message: any = (resource as any).default;
  expandedElement: any | null;
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

  public project: any[] = []

  //public CreateProject_Data = [];
  //public SelfCertification_Data = [];
  //panelOpenState = new Array<boolean>(this.CreateProject_Data.length - 1);
  //panelOpenState1 = new Array<boolean>(this.SelfCertification_Data.length - 1);  
  //step;
  //step1;
  // setStep(index: number) {
  //   this.step = index;
  //   this.panelOpenState[index] = false;
  //   
  //   console.log(this.panelOpenState);
  // }
  // changeState(index: number) {
  //   this.panelOpenState[index] = false;
  // }
  // nextStep() {
  //   this.step++;
  // }
  // prevStep() {
  //   this.step--;
  // }
  // setStep1(index: number) {
  //   this.step1 = index;
  //   this.panelOpenState1[index] = true;
  //   console.log(this.panelOpenState);
  // }
  // changeState1(index: number) {
  //   this.panelOpenState1[index] = false;
  // }
  // nextStep1() {
  //   this.step1++;
  // }
  // prevStep1() {
  //   this.step1--;
  // }

  CompanyId: any;
  GroupId: any;
  UserId: any;
  RegionId: any;
  IsCompanyAdmin: any = 1;
  IslayerDisplay: any;
  layerid: any;
  Layertext: any;
  HeaderLayerText: any;
  ReportForm: FormGroup;

  AssetNoFilter = new FormControl();
  filteredValues = {
    AssetNo: '', SubNo: '', CapitalizationDate: '',
    AssetClass: '', AssetType: '',
    AssetSubType: '', UOM: '', AssetName: '',
    AssetDescription: '', Qty: '', Cost: '', WDV: '',
    EquipmentNO: '', AssetCondition: '', AssetCriticality: ''
  };

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

  public projectidMultiCtrl: any;
  public projectidFilterCtrl: FormControl = new FormControl();
  public filteredprojectidMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);



  public InventoryDeadline: FormControl = new FormControl();
  today = new Date();

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  protected _onDestroy = new Subject<void>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatPaginator, { static: true }) SelfCertificationpaginator: MatPaginator;
  @ViewChild(MatSort) SelfCertificationsort: MatSort;
  
  displayedPhysicalVerificationPopupColumns: string[] = ['Select1','LocationType', 'AssetCategory', 'InventoryCompleted', 'AssetCount', 'Cost', 'WDV', 'PendingCount'];
  displayedColumns: string[] = ['Select','Location', 'FARCount', 'GRNCount', 'NonFARCount', 'AcquisitionCost', 'WDVcost','Icon'];

  dataSource = new MatTableDataSource<any>();
  selfCertificationdataSource = new MatTableDataSource<any>();
  payloadData = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  selectionnew = new SelectionModel<any>(true, []);
  tempdatasource: any[] = [];
  displayTable: boolean = false;
  displaybtn: boolean = false;

  
  constructor(public dialog: MatDialog,
    public datepipe: DatePipe,
    public toastr: ToastrService,
    private storage: ManagerService,
    public confirmService: AppConfirmService,
    private loader: AppLoaderService,
    public us: UserService,
    public cls: CompanyLocationService,
    public ums: UserMappingService,
    public cbs: CompanyBlockService,
    public gs: GroupService,
    public as: AuditService,
    public rp: ReportService ,
    public alertService:MessageAlertService,
    private router: Router,private jwtAuth : JwtAuthService,
    private fb:FormBuilder) 
    {
      this.Headers = this.jwtAuth.getHeaders()
      this.project = [
        { name: this.Headers.PhysicalVerification, id: 'PhysicalVerification' },
        //{ name: this.Headers.SelfCertification, id: 'SelfCertification' },
      ];
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
    this.filteredprojectidMulti.next(this.ListProject.slice());
    this.projectidFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterProjectIdMulti();
      });
      
      this.ReportForm = this.fb.group({
        projectidFilterCtrl : ['', [Validators.required]],
      })
    this.HeaderLayerText = this.Layertext;
    this.filterProjectMulti();
    this.GetInitiatedData();
    this.projectMultiCtrl = "PhysicalVerification";
    this.selected("PhysicalVerification");


    this.AssetNoFilter.valueChanges.subscribe((AssetNoFilterValue) => {
      this.filteredValues['AssetNo'] = AssetNoFilterValue;
      this.dataSource.filter = this.filteredValues.AssetNo;
    });
    //this.dataSource.filterPredicate = this.customFilterPredicate();

  }
  projectid: any[] = [];
  ListOfLoc: any[] = [];
  ListOfLoc1: any[] = [];
  ListOfSBU: any[] = [];
  ListOfField: any[] = [];
  ListOfFilter: any[] = [];
  ListOfFilterName: any[] = [];
  ListOfCategory: any[] = [];
  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  GetInitiatedData() {
     
    this.loader.open();
    let url1 = this.cls.GetLocationListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 34);
    let url2 = this.cbs.GetCategoryListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 34);
    let url3 = this.gs.GetFieldListByPageId(34,this.UserId,this.CompanyId);
    let url4 = this.gs.GetFilterIDlistByPageId(34);
    let url5 = this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.RegionId, "34");
    forkJoin([url1, url2, url3, url4, url5]).subscribe(results => {
      if (!!results[0]) {
        this.ListOfLoc1 = JSON.parse(results[0]);
        this.ListOfLoc = JSON.parse(results[0]);
        this.ListOfSBU = this.UniqueArraybyId(this.ListOfLoc, this.Layertext);
        this.getFilterCityType();
        this.getFilterPlantType();
      }

      if (!!results[1]) {
        this.ListOfCategory = JSON.parse(results[1]);
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
      if (this.StorePageSession.Pagename === "Send For Reconciliation") {
        
      }
      else {
        localStorage.setItem('PageSession', null);
        this.StorePageSession = "";
      }
    }
  }

  onchangeSBU(value) {
    
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
  bindData: any[] = [];
  GetBlockwiseProjectList(){    
    this.numSelected = 0;
    this.getselectedIds = [];
    this.getselectedIdsnew = [];
    this.getselectedIdsnewid = [];
    this.selection.clear();
    this.selectionnew.clear();
    this.GetBlockwiseProjectListBindData("");
  }
  GetBlockwiseProjectListBindData(Action) {

    
    this.displaybtn = false;
    this.displayTable = false;
    if (!!this.IsPhysicalVerification) {
      var LocationIdList = [];
      var CategoryIdList = [];
      var locationId = 0;
      if (!!this.plantMultiCtrl) {
        this.plantMultiCtrl.forEach(x => {
          LocationIdList.push(x.LocationId);
        })
      }
      else {
        this.ListOfLoc.forEach(x => {
          LocationIdList.push(x.LocationId);
        })
      }

      if (!!this.categoryMultiCtrl) {
        this.categoryMultiCtrl.forEach(x => {
          CategoryIdList.push(x.AssetCategoryId);
        })
      }
      else {
        this.ListOfCategory.forEach(x => {
          CategoryIdList.push(x.AssetCategoryId);
        })
      }
      
      if (!this.projectidMultiCtrl) {

        this.toastr.warning(`Please Select ${this.Headers.ProjectName}`, this.message.AssetrakSays);
        return null;
      }
  
      this.loader.open();
      var assetDetails = {
        Id:this.UserId,
        CompanyId: this.CompanyId,
        LocationIdList: LocationIdList,
        projectName: !!this.projectidMultiCtrl ? this.projectidMultiCtrl.Name : "",
        ProjectType: "Inventory",
        CategoryIdList: CategoryIdList
      }

      this.as.GetBlockwiseProjectList(assetDetails).subscribe(r => {
         
        this.loader.close();
        this.bindData = [];
        if(!!r){
          this.bindData = JSON.parse(r);
          this.bindData.forEach(x=> {
            x.popupdata = "" ;
            x.showbtn = false;
          });
        }        
        this.displaybtn = true;
        this.displayTable = true;
        this.expandedElement = null;
        //this.panelOpenState = new Array<boolean>(this.bindData.length - 1);
        this.onChangeDataSource(this.bindData);
      })
    }
    else {
      // var assetDetails = {
      //   companyId: this.CompanyId,
      //   locationId: !!this.plantMultiCtrl ? this.plantMultiCtrl.LocationId : 0,
      //   projectName: !!this.projectidMultiCtrl ? this.projectidMultiCtrl.name : "",
      //   projectType: "SelfCertInventory"
      // }
    }
  }
  loclist : any[]=[];
  loclistIds : any[]=[];
  GetInventoryLocationIdsByProjectName(val){
     
    this.loader.open();
    var projectName = val.Name;
    this.cls.GetInventoryLocationIdsByProjectNamePageName(this.CompanyId , "confirminventory", projectName).subscribe(r => {
       
      this.loader.close();
      if(!!r){
        this.loclist = r;
        this.loclistIds=[];
        for(var i=0;i< this.loclist.length ; i++){
          this.loclistIds.push(this.loclist[i].LocationId);
        }
        this.ListOfLoc=[];        
        for(var j=0;j< this.ListOfLoc1.length ; j++){
          var idx = this.loclistIds.indexOf(this.ListOfLoc1[j].LocationId);
          if(idx > -1){
            this.ListOfLoc.push(this.ListOfLoc1[j]);            
          }
        }     
        // this.ListOfLoc1 = this.ListOfLoc;
        this.ListOfSBU = this.UniqueArraybyId(this.ListOfLoc, this.Layertext);
        this.getFilterCityType();
        this.getFilterPlantType();
      }      

    })
  }
  BlockWiseAssetsDetails : any[]=[];
  GetBlockwiseProjectListGetData(b){
          
    this.bindData.forEach(x=> {
      x.popupdata = "" ;
      x.showbtn = false;
    });
    this.expandedElement = this.expandedElement === b ? null : b ;
  
    if (!!this.IsPhysicalVerification) {
      this.loader.open();
      b.showbtn = true;

      var CategoryIdList = [];
      if (!!this.categoryMultiCtrl) {
        this.categoryMultiCtrl.forEach(x => {
          CategoryIdList.push(x.AssetCategoryId);
        })
      }
      else {
        this.ListOfCategory.forEach(x => {
          CategoryIdList.push(x.AssetCategoryId);
        })
      }

      var assetDetails = {
        companyId: this.CompanyId,
        locationId: b.LocationId,
        projectName: b.Name,
        projectType: "Inventory",
        userId:this.UserId,
        CategoryList: CategoryIdList.join(',')
      }
      this.as.GetBlockwiseProjectListJson(assetDetails).subscribe(r => {
         
        this.loader.close();
        this.BlockWiseAssetsDetails = JSON.parse(r);
        b.popupdata = this.BlockWiseAssetsDetails  ;
      })
    }
  }

  hidetab(b){
     
    //this.bindData.forEach(x=> x.popupdata = "");
    this.expandedElement = this.expandedElement === b ? null : b ;
    b.popupdata = "";
    b.showbtn = false;
  }

  data: any[] = [];

  GetAssetCount() {
     
    this.data=[];
    this.confirmService.confirm({ message: this.message.InventoryCompleteNotification, title: this.message.AssetrakSays })
      .subscribe(res => {
        if (!!res) {
          this.loader.open();
           
          if(!!this.getselectedIdsnew && this.getselectedIdsnew.length > 0)
          {
            this.getselectedIdsnew.forEach(element => {
              var aa={
                ProjectId:element.TPID,
                CategoryId: element.BlockId,
                ProjectType: "Inventory",
                CompanyId: this.CompanyId,  
                UserId: this.UserId,
              }
              this.data.push(aa)
            }); 
          }

          this.getselectedIds.forEach(element => {             
            if(!!this.data && this.data.length > 0)
            {
              var tpids=this.data.map(x =>x.ProjectId);
              var idx = tpids.indexOf(element.Tpid);
              if(idx > -1 ){ }             
              else{
                var aaa={
                  ProjectId:element.Tpid,
                  CategoryId: 0,
                  ProjectType: "Inventory",
                  CompanyId: this.CompanyId, 
                  UserId: this.UserId
                }
                this.data.push(aaa)
              }
            }  else{
              var aaa={
                ProjectId:element.Tpid,
                CategoryId: 0,
                ProjectType: "Inventory",
                CompanyId: this.CompanyId,  
                UserId: this.UserId,
              }
              this.data.push(aaa)
            }        
          });
          
          var objAssetsParameterDto = {
            AssetList: !!this.data ?JSON.stringify(this.data):""
          }
          // var objAssetsParameterDto = !!this.data ?JSON.stringify(this.data):"";           
          this.as.CompleteProject(objAssetsParameterDto).subscribe(r => {      
                   
            this.loader.close();
            if (r === "Inventory cannot be completed!!") {
              this.toastr.warning(this.message.Inventorycannotbecompleted, this.message.AssetrakSays);
            }
            else {
              this.toastr.success(this.message.InventoryCompletedSuccess, this.message.AssetrakSays);
            }
            this.clearSelected();
          })
        }
      })
  }
  RevertAuditDataNew() {    
     
    this.data=[];
    var flag=false;
    this.getselectedIds.forEach(element => {       
      if(element.FARpendingCount == 0 && element.FARmissingCount == 0 && element.FARadditionalCount == 0)
      {
         flag=true;
      }   
    });
    if(!!flag)
    {
      this.confirmService.confirm({ message: this.message.RevertNotificationForAllVerified, title: this.message.AssetrakSays })
      .subscribe(res => {
        if (!!res) {
          this.loader.open();
           
          if(!!this.getselectedIdsnew && this.getselectedIdsnew.length > 0)
          {
            this.getselectedIdsnew.forEach(element => {
              var aa={
                ProjectId:element.TPID,
                CategoryId: element.BlockId,
                ProjectType: "Inventory",
                CompanyId: this.CompanyId,  
                UserId: this.UserId,
              }
              this.data.push(aa)
            });               
          }

          this.getselectedIds.forEach(element => {             
            if(!!this.data && this.data.length > 0)
            {
              var tpids=this.data.map(x =>x.ProjectId);
              var idx = tpids.indexOf(element.Tpid);
              if(idx > -1 ){ }             
              else{
                var aaa={
                  ProjectId:element.Tpid,
                  CategoryId: 0,
                  ProjectType: "Inventory",
                  CompanyId: this.CompanyId, 
                  UserId: this.UserId,
                }
                this.data.push(aaa)
              }
            }  else{
              var aaa={
                ProjectId:element.Tpid,
                CategoryId: 0,
                ProjectType: "Inventory",
                CompanyId: this.CompanyId,  
                UserId: this.UserId,
              }
              this.data.push(aaa)
            }        
          });
          
          var assetDetails = {
            AssetList: !!this.data ?JSON.stringify(this.data):""
          }
          this.as.SetRevertInTPBlock(assetDetails).subscribe(r => {
             
            this.loader.close();
            if (r === 1) {
              this.toastr.success(this.message.ProjectRevertSuccess, this.message.AssetrakSays);
            }
            else if (r === 2) {
              this.toastr.warning(this.message.ProjectAlreadyConfirmed, this.message.AssetrakSays);
            }
            else {
              this.toastr.error(r, this.message.AssetrakSays);
            }
            this.clearSelected();
          })

        }
      })
    }else{
      this.confirmService.confirm({ message: this.message.RevertNotification, title: this.message.AssetrakSays })
      .subscribe(res => {
        if (!!res) {
          this.loader.open();
           
          if(!!this.getselectedIdsnew && this.getselectedIdsnew.length > 0)
          {
            this.getselectedIdsnew.forEach(element => {
              var aa={
                ProjectId:element.TPID,
                CategoryId: element.BlockId,
                ProjectType: "Inventory",
                CompanyId: this.CompanyId,  
                UserId: this.UserId,
              }
              this.data.push(aa)
            }); 
              
          }

          this.getselectedIds.forEach(element => {
             
            if(!!this.data && this.data.length > 0)
            {
              var tpids=this.data.map(x =>x.ProjectId);
              var idx = tpids.indexOf(element.Tpid);
              if(idx > -1 ){ }             
              else{
                var aaa={
                  ProjectId:element.Tpid,
                  CategoryId: 0,
                  ProjectType: "Inventory",
                  CompanyId: this.CompanyId, 
                  UserId: this.UserId,
                }
                this.data.push(aaa)
              }
            }  else{
              var aaa={
                ProjectId:element.Tpid,
                CategoryId: 0,
                ProjectType: "Inventory",
                CompanyId: this.CompanyId,  
                UserId: this.UserId,
              }
              this.data.push(aaa)
            }        
          });
          
          var assetDetails = {
            AssetList: !!this.data ?JSON.stringify(this.data):""
          }
          this.as.SetRevertInTPBlock(assetDetails).subscribe(r => {
             
            this.loader.close();
            if (r === 1) {
              this.toastr.success(this.message.ProjectRevertSuccess, this.message.AssetrakSays);
            }
            else if (r === 2) {
              this.toastr.warning(this.message.ProjectAlreadyConfirmed, this.message.AssetrakSays);
            }
            else {
              this.toastr.error(r, this.message.AssetrakSays);
            }
            this.clearSelected();
          })

        }
      })
    }


  }

  GetBlockWiseAssetCount(d){
     
    this.confirmService.confirm({ message: this.message.InventoryCompleteNotification, title: this.message.AssetrakSays })
    .subscribe(res => {
       
      if (!!res) {
        this.loader.open();
        var assetDetails = {
          companyId: this.CompanyId,            
          locationId:d.LocationId,
          blockId: d.BlockId,
          projectName: !!this.projectidMultiCtrl ? this.projectidMultiCtrl.Name : "",
          projectType : 2,
          modifiedBy :this.UserId ,
          Id: d.Id,
          locationType : d.VLocation ,
        }
        this.as.CompleteProjectBlockwise(assetDetails).subscribe(r => {
           
          this.loader.close();
          if (r === "Inventory cannot be completed!!") {
            this.toastr.warning(this.message.Inventorycannotbecompleted, this.message.AssetrakSays);
          }
          else {
            this.toastr.success(r, this.message.AssetrakSays);
          }
          this.clearSelected();
        })

      }
    })
  }
  SetRevertInTPBlockIdWise(d){
     
    this.confirmService.confirm({ message: this.message.RevertNotification, title: this.message.AssetrakSays })
    .subscribe(res => {
       
      if (!!res) {
        this.loader.open();
        var assetDetails = {
          pkId: d.TPID,   
          blockId: d.BlockId,         
          Id: d.Id,
          locationType : d.VLocation ,
        }
        this.as.SetRevertInTPBlockIdWise(assetDetails).subscribe(r => {
           
          this.loader.close();
          if (r === 1) {
            this.toastr.success(this.message.ProjectRevertSuccess, this.message.AssetrakSays);
          }
          else if (r === 2) {
            this.toastr.warning(this.message.ProjectAlreadyConfirmed, this.message.AssetrakSays);
          }
          else {
            this.toastr.error(r, this.message.AssetrakSays);
          }
          this.clearSelected();
        })

      }
    })
  }

  RevertAuditData(b){
     
    if (b.FARpendingCount == 0 && b.FARmissingCount == 0 && b.FARadditionalCount == 0) {
      this.confirmService.confirm({ message: this.message.RevertNotificationForAllVerified, title: this.message.AssetrakSays })
      .subscribe(res => {
         
        if (!!res) {     
          this.loader.open();    
          this.as.SetRevertInTPBlock(b.Tpid).subscribe(r => {
             
            this.loader.close();
            if (r == 1) {
              this.toastr.success(this.message.ProjectRevertSuccess, this.message.AssetrakSays);
            }            
            else {
              this.toastr.warning(this.message.ErrorMessage, this.message.AssetrakSays);
            }
            this.clearSelected();
          })
  
        }
      })
    }
    else{
      this.confirmService.confirm({ message: this.message.RevertNotification, title: this.message.AssetrakSays })
      .subscribe(res => {
         
        if (!!res) {
          this.loader.open();
          this.as.SetRevertInTPBlock(b.Tpid).subscribe(r => {
             
            this.loader.close();
            if (r == 1) {
              this.toastr.success(this.message.ProjectRevertSuccess, this.message.AssetrakSays);
            }            
            else {
              this.toastr.warning(this.message.ErrorMessage, this.message.AssetrakSays);
            }
            this.clearSelected();
          })
        }
      })
    }

  }

  

  onChangeDataSource(value) {
    this.dataSource = new MatTableDataSource(value);
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;

  }

  onChangeDataSource1(value) {
    this.dataSource = new MatTableDataSource(value);
    //this.dataSource.paginator = this.SelfCertificationpaginator;
    //this.dataSource.sort = this.sort;

  }

  IsPhysicalVerification: boolean = false;
  IsSelfCertification: boolean = false;
  selected(name) {
    if (name == "PhysicalVerification") {
      this.selectedProject = name;
      this.IsPhysicalVerification = true;
      this.GetProjectName();
    }

    if (name == "SelfCertification") {
      this.selectedProject = name;
      this.IsSelfCertification = true;
      this.GetProjectName();
    }
  }
  ListProject: any[] = [];
  GetProjectName() {     
    //this.loader.open();
    var LocationIdList = [];
    var SbuList = [];
    var CategoryIdList = [];
    if (!!this.plantMultiCtrl) {
      this.plantMultiCtrl.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }
    else {
      this.ListOfLoc.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }

    if (!!this.categoryMultiCtrl) {
      this.categoryMultiCtrl.forEach(x => {
        CategoryIdList.push(x.AssetCategoryId);
      })
    }
    else {
      this.ListOfCategory.forEach(x => {
        CategoryIdList.push(x.AssetCategoryId);
      })
    }
    var pageName = "confirmInventoryForSelfCert";
    if (!!this.IsPhysicalVerification) {
      pageName = "confirmInventory";
    }

    var assetDetails = {
      companyId: this.CompanyId,
      locationIdList: LocationIdList,
      pageName: pageName,
      CategoryIdList: CategoryIdList
    }

    this.as.GetInventoryProjectListForReconcilition(assetDetails).subscribe(r => {
       
      // this.loader.close();
      this.ListProject = r;// JSON.parse(r);
      this.filterProjectIdMulti();
    })

  }

  numSelected: any = 0;
  getselectedIds: any[] = [];
  isAllSelected: boolean = false;

  numSelectednew: any = 0;
  getselectedIdsnew: any[] = [];
  isAllSelectednew: boolean = false;

  masterToggle() {
     
    this.isAllSelected = !this.isAllSelected;
    this.getselectedIds = [];
    this.getselectedIdsnew = [];
    this.getselectedIdsnewid = [];
    this.getselectedIdsdata = [];
    this.selection.clear();
    this.selectionnew.clear();
    if (this.isAllSelected == true) {
      this.dataSource.data.forEach(row => {
        if(!!row.MclosedFlag){
          this.selection.select(row);
        }
      });
    }    
    this.numSelected = this.selection.selected.length;
    if (this.numSelected > 0) {    
      this.selection.selected.forEach(row => 
        {
          this.getselectedIds.push(row);
          this.getselectedIdsdata.push(row.Tpid);

        });
    }
  }
  getselectedIdsdata : any[]=[];
  isSelected(row) {
    
    this.isAllSelected = false;
    this.selection.toggle(row)
    this.numSelected = this.selection.selected.length;
    //  var idx = this.getselectedIds.indexOf(row.Tpid);
    var idx = this.getselectedIdsdata.indexOf(row.Tpid);
    if (idx > -1) {
      this.getselectedIds.splice(idx, 1);   
      this.getselectedIdsdata.splice(idx, 1);      
    }
    else {
     this.getselectedIds.push(row); 
     this.getselectedIdsdata.push(row.Tpid); 
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
      this.ListOfLoc.forEach(x => {
        PlantList.push(x.LocationId);
      })
    }
    this.categoryMultiCtrl="";
    this.filteredcategoryMulti= new ReplaySubject<any[]>(1);
   
    
    this.rp.GetCategoryRightWiseForReport(this.CompanyId, this.UserId, PlantList, false,34).subscribe(r => {
      this.ListOfCategory=[];
      r.forEach(element => {
        // this.ListOfCategory=[];
        this.ListOfCategory.push(element);
        this.getFilterCategoryType();
      });
    })
  }

  masterTogglenew() {
     
    this.isAllSelectednew = !this.isAllSelectednew;
    this.getselectedIdsnew = [];
    this.getselectedIdsnewid = [];
    this.selectionnew.clear();
    // if (this.isAllSelected == true) {
    //   this.dataSource.data.forEach(row => this.selectionnew.select(row));
    // }    
    // this.numSelectednew = this.selectionnew.selected.length;
    // if (this.numSelectednew > 0) {
    //   this.selectionnew.selected.forEach(row => this.getselectedIdsnew.push(row.Tpid));
    // }
  }
  
  getselectedIdsnewid : any[]=[];
  isSelectednew(row) {
     
    this.selectionnew.toggle(row)
    this.numSelectednew = this.selectionnew.selected.length;
    var idx = this.getselectedIdsnewid.indexOf(row.Id);
    if (idx > -1) {
      this.getselectedIdsnewid.splice(idx, 1); 
      this.getselectedIdsnew.splice(idx, 1);      
    }
    else {
      this.getselectedIdsnewid.push(row.Id); 
      this.getselectedIdsnew.push(row);      
    }
  }

 
  protected filterProjectIdMulti() {
    debugger;
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
      this.ListProject.filter(Projectid => Projectid.Name.toLowerCase().indexOf(search) > -1)
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.selfCertificationdataSource.sort = this.sort;
    this.selfCertificationdataSource.paginator = this.paginator;
  }

  viewSelected() {
     
    this.dataSource = new MatTableDataSource(this.getselectedData);
  }

  clearSelected() {
    this.selection.clear();
    this.isAllSelected = false;
    this.numSelected = 0;
    this.getselectedIds = [];
    this.getselectedIdsnew = [];
    this.getselectedIdsnewid = [];
    this.selectionnew.clear();
    this.GetBlockwiseProjectListBindData("");
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
  getFilterPlantType() {
     
    this.filteredPlantsMulti.next(this.ListOfLoc.slice());
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

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }


  toggleSelectAllCity(selectAllValue: boolean) {
    this.filteredCityMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.cityMultiCtrl.patchValue(val);
        } else {
          this.cityMultiCtrl.patchValue([]);
        }
      });
  }

  toggleSelectAll(selectAllValue: boolean) {
    this.filteredPlantsMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.plantMultiCtrl.patchValue(val);
        } else {
          this.plantMultiCtrl.patchValue([]);
        }
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

  toggleSelectAllCategory(selectAllValue: boolean) {
    this.filteredcategoryMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.categoryMultiCtrl.patchValue(val);
        } else {
          this.categoryMultiCtrl.patchValue([]);
        }
      });
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

  openFilter_PopUp() {
    let title = 'Add new member';
  }

  openDetails(data, type) {
    let configdata = {
      data: data,
      type: type
    }
    const dialogRef = this.dialog.open(AssetClassWiseInventoryStatusDialogComponent, {
      width: '980px',
      disableClose: true,
      data: { configdata: configdata }
    });
    dialogRef.afterClosed().subscribe(result => {
       
    })
  }

  clearfilter() {
    if (this.appliedfilters.length > 0) {
      while (this.appliedfilters.length > 0) {
        this.appliedfilters.splice(this.appliedfilters.length - 1);
        console.log(this.appliedfilters);
      }
    }
  }

}
