import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { MatSelectChange } from '@angular/material/select';
import { LocalStoreService } from 'app/shared/services/local-store.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as headers from '../../../../../assets/Headers.json';
import * as resource from '../../../../../assets/Resource.json';
import { UserRoleService } from '../../../services/UserRoleService';
import * as Menuheaders from '../../../../../assets/MenuHeaders.json';

import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { AssetService } from 'app/components/services/AssetService';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

export interface PeriodicElement {
  name: string;
  LocationData: any[];

}
const ELEMENT_DATA: PeriodicElement[] = [
  {
    name: 'sandesh@Gmail.com',
    LocationData: [
      {
        name: 'Kolhapur',
        comp: ['a', 'b', 'c']
      },
      {
        name: 'Mumbai',
        comp: ['ABC.ltd', 'JKL.ltd', 'STR.ltd']
      },
      {
        name: 'Pune',
        comp: ['LNT.ltd', 'BBC.ltd', 'DFC.ltd']
      },
    ]

  },
  {
    name: 'admin@Gmail.com',
    LocationData: [
      {
        name: 'Mumbai',
        comp: ['a', 'b', 'c']
      },
      {
        name: 'Kochi',
        comp: ['aa', 'bb', 'cc']
      },
      {
        name: 'Shimala',
        comp: ['LNT.ltd', 'BBC.ltd', 'DFC.ltd']
      }
    ]
  },
  {
    name: 'shreyasdoshi48@Gmail.com',
    LocationData: [
      {
        name: 'Pune',
        comp: ['a', 'b', 'c']
      },
      {
        name: 'Beed',
        comp: ['aa', 'bb', 'cc']
      },
      {
        name: 'Solapur',
        comp: ['LNT.ltd', 'BBC.ltd', 'DFC.ltd']
      }]
  }
  ,
  {
    name: 'assetcues@Gmail.com',
    LocationData: [
      {
        name: 'Sangli',
        comp: ['a', 'b', 'c']
      },
      {
        name: 'Satara',
        comp: ['aa', 'bb', 'cc']
      },
      {
        name: 'Belgaon',
        comp: ['LNT.ltd', 'BBC.ltd', 'DFC.ltd']
      }]
  },
  {
    name: 'surbhi2325@Gmail.com',
    LocationData: [
      {
        name: 'Thane',
        comp: ['a', 'b', 'c']
      },
      {
        name: 'Surat',
        comp: ['aa', 'bb', 'cc']
      },
      {
        name: 'Mumbai',
        comp: ['LNT.ltd', 'BBC.ltd', 'DFC.ltd']
      }]
  },
  {
    name: 'sumit@Gmail.com',
    LocationData: [
      {
        name: 'Navi Mumbai',
        comp: ['a', 'b', 'c']
      },
      {
        name: 'Kagal',
        comp: ['aa', 'bb', 'cc']
      },
      {
        name: 'Sangaon',
        comp: ['LNT.ltd', 'BBC.ltd', 'DFC.ltd']
      }]
  },
  {
    name: 'Assetrak@Gmail.com',
    LocationData: [
      {
        name: 'Borgaon',
        comp: ['a', 'b', 'c']
      },
      {
        name: 'Dharwad',
        comp: ['aa', 'bb', 'cc']
      },
      {
        name: 'Belgaon',
        comp: ['LNT.ltd', 'BBC.ltd', 'DFC.ltd']
      }]
  },
];


@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewDialogComponent implements OnInit {

  header: any ;
  message: any = (resource as any).default;
  MenuHeader: any = (Menuheaders as any).default;

  displayedHeaders:any[] = []
  displayedHeadersLocation :any[]= []
  displayedHeadersCategory :any = []

  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  @ViewChild('table', { static: true }) table: any;

  @ViewChild('PaginatorForLocation', { static: true }) paginatorForLocation: MatPaginator;
  @ViewChild('SortForLocation', { static: true }) sortForLocation: MatSort;
  @ViewChild('TableForLocation', { static: true }) tableForLocation: any;

  @ViewChild('PaginatorForCategory', { static: true }) paginatorForCategory: MatPaginator;
  @ViewChild('SortForCategory', { static: true }) sortForCategory: MatSort;
  @ViewChild('TableForCategory', { static: true }) tableForCategory: any;

  
  displayedColumns: string[] = ['UserName'];

  
  displayedColumnsLocation: string[] = ['LocationName'];

 
  displayedColumnsCategory: string[] = ['AssetCategoryName'];

  public selectedIndex;
  public selectedrows1 = [];
  public selectedrows2 = [];
  public toselect = 0;
  public len = 0;
  StandardTypeData1:any[]=[];
  Standardcategoryid:any;

  public grpdata;
  public addgrpdata;
  public disableadd = true;
  public disableadd1 = true;
  private myDataArray: any;
  public LocationData: any;
  public dataLocation: any;
  public dataCategory: any;
  public highlightedRows = [];
  public currentLocationIndex: any;
  public currentCategory: any;

  public AssetInfo: FormGroup;
  roleForm: FormGroup;
  submitted: boolean = false;
  public isShow = false;
  moduleTypes: any[] = [];
  panelopen = true;
  panelopen1 = true;
  modules: any[] = [{ id: 1, name: 'Dashboard' },
  { id: 2, name: 'Super Admin' }, { id: 3, name: 'Admin' }, { id: 4, name: 'Relationship' }, { id: 5, name: 'Master' }];
  childmodule: any[] = [{ id: 1, name: 'Default' }, { id: 2, name: 'Analytics' }, { id: 3, name: 'Filter Configuration' }
  ];
  modulePermissions: any[] = [];
  attributevalueTypes1: any[] = [];
  childmodulesList: any[] = [];
  userTypes: any[] = [{ id: 1, name: 'Admin' }, { id: 2, name: 'Super Admin' }];
  userList: any[] = [];
  selectedValue1: any;
  roleId='';
  permissionList: any[] = [{ id: 1, name: 'Create' }, { id: 1, name: 'View' }, { id: 1, name: 'Upadte' }, { id: 1, name: 'Delete' }];
  CreateModules2:any[] =
  [
    // { Type: '1', name: "AssetInfoview" },
    // { Type: '2', name: "NetworkInfoview" },
    // { Type: '3', name: "AuditInfoview" },
    // { Type: '4', name: "HardwareInfoview" },
    // { Type: '5', name: "TransferInfoview" },
    // { Type: '6', name: "RetirementInfoView" },
    // { Type: '7', name: "Notification" },
    // { Type: '8', name: "Reports" },
  ]
  submodules1:any[] =
  [
    // { Type: '1', sName: "AssetInfoView(Standard)" },
    // { Type: '2', sName: "NetworkInfoView(Standard)" },
    // { Type: '3', sName: "AuditInfoView(Standard)" },
    // { Type: '4', sName: "HardwareInfoView(Standard)" },
    // { Type: '5', sName: "TransferInfoView(Standard)" },
    // { Type: '6', sName: "RetirementInfoView(Standard)" },
    // { Type: '7', sName: "NotificationView(Standard)" },
    // { Type: '8', sName: "ReportsView(Standard)" }
  ]
  childmodules:any[] =[
    // {id:11,cname:"AssetinfoView(Custom1)"},
    // {id:12,cname:"AssetinfoView(Custom2)"},
    // {id:12,cname:"AssetinfoView(Custom3)"}
  ]
  dataSourceU: any;
  dataSourceL: any;
  dataSourceC: any;
  LabelForLocation: any;
  LabelForCategory: any;
  UserId: any;
  LocationId : any;

  CreateModules1:any[]=[];
  childmodules1 : any[]=[];
  AllPermssionData: any[]=[];

  SessionGroupId: any;
  SessionRegionId: any;
  SessionCompanyId: any;
  SessionUserId: any;

  panelOpenState=new Array<boolean>();
  panelOpenState1 = new Array<boolean>();
  SubModules_OpenState=new Array();
  CreateModules_OpenState=new Array<boolean>();

  step;
  rowData: any;
  setStep(index: number,event) {
    this.Standardcategoryid = event.CategoryId
    this.step = index;
      this.panelOpenState[index]=true;
      for(let i=0;i<12;i++){
      console.log(this.panelOpenState[i]);
      }
      this.GetCustomeView();
  }
  setStep1(index: number,event) {
    this.step = index;
    this.Standardcategoryid = event.CategoryId
    this.panelOpenState1[index] = true;
    for (let i = 0; i < 12; i++) {
      console.log(this.panelOpenState1[i]);
    }
    //this.GetCustomeView();
  }
  changeState(index: number){
    
   this.panelOpenState[index]=false;
  }
  changeState1(index: number) {
    debugger;
    this.panelOpenState1[index] = false;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  
  constructor(public dialogRef: MatDialogRef<ViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private storage: ManagerService,
    private userRoleService:UserRoleService,
    private loader: AppLoaderService,public as:AssetService,
    private jwtAuth:JwtAuthService) 
    {
      this.header = this.jwtAuth.getHeaders()
      this.displayedHeaders = [this.header.User]
      this.displayedHeadersLocation = [this.header.Location]
      this.displayedHeadersCategory = [this.header.Category]

    }

  public data1 = Object.assign(ELEMENT_DATA);
  public dataSource = new MatTableDataSource<Element>(this.data1);
   selectedUserValue:any;
   selectedLocationValue:any;

   nextStep1(i) {
    this.selectedIndex = i;
  }
  previousStep(i) {
    this.selectedIndex = i;
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.nextStep1(tabChangeEvent.index);
    this.previousStep(tabChangeEvent.index);

  }

  CreateModules = []

  setStepforpanel(index: number) {
    this.step = index;
    this.panelOpenState[index] = true;
    for (let i = 0; i < 12; i++) {
      console.log(this.panelOpenState[i]);
    }
  }

  ngOnInit() {
    this.loader.open();
    this.SessionGroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.SessionRegionId =this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.SessionCompanyId =this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);   
    this.SessionUserId= this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    this.GetAllModule();
    this.GetAllUserList();
    this.GetStandardView();
  for(let i=0;i<this.CreateModules_OpenState.length;i++){
      this.CreateModules_OpenState[i]=false;
    }
   for(let i=0;i<this.CreateModules_OpenState.length;i++){
   this.SubModules_OpenState[i]=new Array<boolean>(this.CreateModules1[i].submodules.length);
   for(let j=0;j<this.SubModules_OpenState[i].length;j++){
     this.SubModules_OpenState[i][j]=false;
    }
   }
   this.loader.close();
  }


  toggleCreateModules(index: number,module){
    if(!!module.OpenState){
      module.OpenState = !module.OpenState;
    }
    else{
      module.OpenState = true;
    }
  }

  SelectAllPermissions(moduleType,module){
        
    if(moduleType == 'mainmodules'){
      if(!!module.OpenState){
        module.OpenState = !module.OpenState;
      }
      else{
        module.OpenState = true;
      }
      module.isCheck = !module.isCheck ;
      for(var i =0;i<module.submodules.length;i++){
        module.submodules[i].isCheck = module.isCheck;
        for(var j =0;j< module.submodules[i].childmodules.length;j++){
          module.submodules[i].childmodules[j].isCheck = module.isCheck;
        }
      }
    }

    if(moduleType == 'submodules'){      
      module.isCheck = !module.isCheck ;
      for(var i =0;i<module.childmodules.length;i++){
        module.childmodules[i].isCheck = module.isCheck;
      }
    }
    
    if(moduleType == 'Permissions'){      
      module.isCheck = !module.isCheck ;
    }
    
}

GetAllModule()
{
  
  var groupId=this.SessionGroupId;
  var regionId=this.SessionRegionId;
  var companyId=this.SessionCompanyId;
  var roleId= this.data.role;

  this.childmodules1=[];
  this.CreateModules1=[];
  this.panelOpenState=new Array<boolean>();
  this.SubModules_OpenState=new Array();
  this.CreateModules_OpenState=new Array<boolean>();

  this.userRoleService.ViewRoles(groupId, regionId, companyId, roleId).subscribe(r => {
    r.forEach(element => {
      
      if(!!element.ParentModuleId){          
        this.childmodules1.push(element)
      }
      else {
        var aa = {
          mainmoduleId:element.ModuleId,
          // mainmodules:element.ModuleName,
          mainmodules:this.MenuHeader[element.ModuleName],
          displayOrder: element.DisplayOrder,
          isCheck: element.IsCheck,       
          OpenState : element.IsCheck, 
          submodules:[]
        }
        this.CreateModules1.push(aa)
      }        
    });
    
    this.BindModuleSubModule();
  })   
}

BindModuleSubModule()
{
 
  for (var i = 0; i < this.CreateModules1.length; i++) {
    for (var j = 0; j < this.childmodules1.length; j++) {
      if (this.CreateModules1[i].mainmoduleId == this.childmodules1[j].ParentModuleId) {
        var aa = {
          subModuleid:this.childmodules1[j].ModuleId,
          // submodules:this.childmodules1[j].ModuleName,
          submodules:this.MenuHeader[this.childmodules1[j].ModuleName],
          parentModuleId:this.childmodules1[j].ParentModuleId,        
          displayOrder: this.childmodules1[j].DisplayOrder,
          isCheck: this.childmodules1[j].IsCheck, 
          childmodules : []
        }
        this.CreateModules1[i].submodules.push(aa);
      }
    }      
  }
  
  this.GetModulePermissions();
}


GetModulePermissions()
{
  
  var roleId=this.data.role;
  this.userRoleService.permissions(roleId).subscribe(r => {
    this.AllPermssionData=[];
    r.forEach(element => {
      
      this.AllPermssionData.push(element)
    });
    
    for (var i = 0; i < this.CreateModules1.length; i++) {
       for(var j = 0; j < this.CreateModules1[i].submodules.length; j++){
        for (var k = 0; k < this.AllPermssionData.length; k++) {
          if (this.CreateModules1[i].submodules[j].subModuleid == this.AllPermssionData[k].ModuleId) {
            var aa = {
              id:this.AllPermssionData[k].ModulePermissionId,
              name:this.AllPermssionData[k].ModulePermissionName,
              parentModuleId:this.AllPermssionData[k].ModuleId,
              isCheck: this.AllPermssionData[k].IsCheck,
            }
            this.CreateModules1[i].submodules[j].childmodules.push(aa);
          }
        } 
       }
    }
    
  })   
 this.panelOpenState.length=this.CreateModules1.length;
 this.SubModules_OpenState.length=this.CreateModules1.length;
 this.CreateModules_OpenState.length=this.CreateModules1.length;
}


  onChangeDataSource(value) {
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  addPermissions(p) {
    var idx = this.permissionList.indexOf(p);
    if (idx > -1) {
      this.permissionList.splice(idx, 1);
    }
    else {
      this.permissionList.push(p);
    }
  }

  bindvalueTypes2(module_id) {
    
    for (var i = 0; i < this.modules.length; i++) {
      for (var j = 0; j < this.modules[i].childmodule.length; j++) {
        if (module_id == this.modules[i].childmodule[j].id) {
          this.modules[i].childmodule[j].permissions = this.attributevalueTypes1;
        }
      }
    }
  }
  getAllModuleData() {
    for (var i = 0; i < this.modules.length; i++) {
      for (var j = 0; j < this.childmodulesList.length; j++) {
        if (this.modules[i].id == this.childmodulesList[j].parent_module_id) {
          this.modules[i].childmodule.push(this.childmodulesList[j]);
        }
      }
    }
  }
  bindUserwithLocation(u) {
  
    let user = {
      id: u.id,
      name: u.name,
      locationIds: [],
      locationNames: [],
    }
    this.userList.push(user);
  }
  remove(u) {
    var idx = this.userList.indexOf(u);
    if (idx > -1) {
      this.userList.splice(idx, 1);
    }
  }


  optionClicked(event: Event, index) {
    event.stopPropagation();
  }

  onclosetab() {
    this.dialogRef.close();
  }


  public getRecord() { }
  getCard(i) {
    console.log(i);
    this.toselect = i;
    for (let k = 0; k < this.selectedrows2.length; k++) {
      if (this.selectedrows2[k] === 'true') {
        this.selectedrows2[k] = "";
      }
    }
    for (let j = 0; j < this.selectedrows1.length; j++) {
      this.selectedrows1[i] = "true";
      if (this.selectedrows1[j] === 'true') {
        if (i != j) {
          this.selectedrows1[j] = "";
        }
      }
    }
  }

  getcard1(i) {
    console.log(i);
    this.len = this.toselect * (this.data1[this.toselect].LocationData.length);
    for (let j = 0; j < this.selectedrows2.length; j++) {
      this.selectedrows2[this.len + i] = "true";
      if (this.selectedrows2[j] === 'true') {
        if ((this.len + i) != j) {
          this.selectedrows2[j] = "";
        }
      }
    }

  }

  public showNextData(currentData, index) {
    
    this.dataLocation = [];
    this.disableadd1 = true;
    
    this.LocationData = currentData.LocationData;
    this.disableadd = false;
    this.currentLocationIndex = index;
    this.selectedUserValue=currentData.name;
  }

  public showNextcompData(currentData1, index1) {
    this.dataCategory = currentData1.comp;
    this.disableadd1 = false;
    this.currentCategory = index1;
    this.selectedLocationValue=currentData1.name;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterForLocation(filterValue: string) {
    this.LocationData.filter = filterValue.trim().toLowerCase();
  }

  applyFilterForCategory(filterValue: string) {
    this.dataCategory.filter = filterValue.trim().toLowerCase();
  }

  GetAllUserList()
  {
    this.dataSourceU="";
    var groupId=this.SessionGroupId;
    var regionId=this.SessionRegionId;
    var companyId=this.SessionCompanyId;
    var roleId= this.data.role;

    this.userRoleService.UsersForViewRole(groupId,roleId,regionId,companyId).subscribe(response => {
      
      this.onChangeDataSourceU(response);
    })
  }

  onChangeDataSourceU(value) {
    
    this.dataSourceU = new MatTableDataSource(value);
    this.dataSourceU.paginator = this.paginator;
    this.dataSourceU.sort = this.sort;
  }

  applyFilterU(filterValue: string) {
    this.dataSourceU.filter = filterValue.trim().toLowerCase();
  }

  public GetUserId(currentData, index) {
    
    if(this.SessionCompanyId > 0)
    {
      this.LabelForLocation = "";
      this.LabelForCategory = "";
      this.UserId="";
      this.LabelForLocation = currentData.UserName;
      this.dataSourceL = "";
      this.dataSourceC = "";
      this.UserId = currentData.UserId;
      this.GetAllLocations();
    }
  }


  GetAllLocations()
  {
    this.dataSourceL="";
    var companyId=this.SessionCompanyId;
    var roleId= this.data.role;
    var user_Id=this.UserId;

    this.userRoleService.LocationsForViewRole(companyId,roleId, user_Id).subscribe(response => {
      
      this.onChangeDataSourceL(response);
    })
  }

  onChangeDataSourceL(value) {
    
    this.dataSourceL = new MatTableDataSource(value);
    this.dataSourceL.paginator = this.paginatorForLocation;
    this.dataSourceL.sort = this.sortForLocation;
  }

  applyFilterL(filterValue: string) {
    this.dataSourceL.filter = filterValue.trim().toLowerCase();
  }

  public GetLocationId(currentData, index) {
    
    this.LabelForCategory = "";
    this.LocationId="";
    this.LabelForCategory = currentData.LocationName;
    this.dataSourceC = "";
    this.LocationId = currentData.LocationId;
    this.GetAllCategories();
  }

  GetAllCategories()
  {
    this.dataSourceC="";
    var companyId=this.SessionCompanyId;
    var roleId= this.data.role;
    var user_Id=this.UserId;
    var location_Id=this.LocationId;

    this.userRoleService.CategoriesForViewRole(companyId,roleId, user_Id, location_Id).subscribe(response => {
      
      this.onChangeDataSourceC(response);
    })
  }

  onChangeDataSourceC(value) {
    
    this.dataSourceC = new MatTableDataSource(value);
    this.dataSourceC.paginator = this.paginatorForCategory;
    this.dataSourceC.sort = this.sortForCategory;
  }

  applyFilterC(filterValue: string) {
    this.dataSourceC.filter = filterValue.trim().toLowerCase();
  }
  GetStandardView()
  { 
    debugger;
    this.as.Getallcategories(this.SessionGroupId).subscribe(response => {
      this.StandardTypeData1 = JSON.parse(response)
      // this.StandardTypeData1 = response;
      
             
      this.StandardTypeData1.forEach(r=>{
        if(r.Status=="S")
        {
          var aa = {
            CategoryId:r.CategoryId,
            CategoryName:r.CategoryName,
            GroupId:r.GroupId,
            Status:r.Status,
            Custom1:r.Custom1,
            Custom2:r.Custom2,
            isCheck: false,       
            OpenState : false, 
            submodules:[]
          }
          this.CreateModules2.push(aa);
          
        }
        if(r.Status=="C" && r.Custom2==this.Standardcategoryid)
        {
          
        }
        var aa = {
          CategoryId:r.CategoryId,
          CategoryName:r.CategoryName,
          GroupId:r.GroupId,
          Status:r.Status,
          Custom1:r.Custom1,
          Custom2:r.Custom2,
          isCheck: false,       
          OpenState : false, 
          submodules:[]
        }
        this.submodules1.push(aa);
      })
      this.GetAllViewData();
      //this.filteredFieldMulti.next(this.StandardTypeData.slice());
      debugger;
    })
  }
  GetCustomeView()
  { 
    debugger;
    this.childmodules=[];
    this.as.Getallcategories(this.SessionGroupId).subscribe(response => {
      this.StandardTypeData1 = JSON.parse(response);
      
      this.StandardTypeData1.forEach(r=>{
        
        if(r.Status=="C" && r.Custom2==this.Standardcategoryid)
        {
          this.childmodules.push(r);
        }
        
      })
      //this.filteredFieldMulti.next(this.StandardTypeData.slice());
      debugger;
    })
  }
  StandviewDataAll:any[]=[];
  GetAllViewData()
  {
    debugger;
    
    var ViewData={
        AllStandviewData : JSON.stringify(this.StandardTypeData1),
      roleId: this.data.role,
       comp: "Edit",
    }
  
    this.as.GetAllViewData(ViewData).subscribe(response => {
      this.StandviewDataAll = JSON.parse(response);

    })
    debugger;
  }
}