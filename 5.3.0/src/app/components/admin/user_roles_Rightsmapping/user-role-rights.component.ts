import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig, throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { LocationListDialogComponent } from '../create-role/location-list-dialog/location-list-dialog.component';
import { Router, ActivatedRoute } from "@angular/router";
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';

import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { Role_dialogComponent } from './role_add_edit_dialog/role_dialog.component';
import { User_dialogComponent } from './user_add_edit_dialog copy/user_dialog.component';
import { UserRoleService } from 'app/components/services/UserRoleService';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import * as menuheaders from '../../../../assets/MenuHeaders.json';
import { UserService } from '../../services/UserService';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { CompanyLocationService } from 'app/components/services/CompanyLocationService';
import { CompanyBlockService } from '../../services/CompanyBlockService';
import { ReportService } from 'app/components/services/ReportService';

@Component({
  selector: 'app-user-role-rights',
  templateUrl: './user-role-rights.component.html',
  styleUrls: ['./user-role-rights.component.scss']
})

export class UserRoleRightsMappingComponent implements OnInit {

  header: any;
  message: any;

  SessionGroupId: any;
  SessionRegionId: any;
  SessionCompanyId: any;
  SessionUserId: any;

  //panelOpenState: boolean = false;

  panelOpenState = new Array<boolean>();
  SubModules_OpenState = new Array();
  CreateModules_OpenState = new Array<boolean>();

  public plants: any[] = [];	

  public cityMultiCtrl: any;
  public cityMultiFilterCtrl: FormControl = new FormControl();
  public filteredCityMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public plantMultiCtrl: any;
  public plantMultiFilterCtrl: FormControl = new FormControl();
  public filteredPlantsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public categoryMultiCtrl: any;
  public categoryFilterCtrl: FormControl = new FormControl();
  public filteredcategoryMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  step;

  setStep(index: number) {
    this.step = index;
    this.panelOpenState[index] = true;
    for (let i = 0; i < 12; i++) {
      console.log(this.panelOpenState[i]);
    }
  }

  changeState(index: number) {
    debugger;
    this.panelOpenState[index] = false;
  }


  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  userpanel: boolean = false;
  rolepanel: boolean = false;
  userTablepanel: boolean = false;
  roleTablepanel: boolean = false;
  userForm: FormGroup;
  submitted: boolean = false;
  showAddBtnForuser: boolean = false;
  showAddBtn: boolean = false;

  deleteOptions: { option: any; data: any; };

  roleTypes: any[] = [
    { id: '0', name: 'Admin' },
    { id: '1', name: 'Super Admin' },];

  userTypes: any[] = [
    { id: '0', name: 'admin@gmail.com' },
    { id: '1', name: 'super@gmail.com' }];

  mappingTypes: any[] = [
    { value: 'By User', id: '1' },
    { value: 'By Role', id: '2' },
  ];

  get f() { return this.userForm.controls; };

  dataSourceForUser: any;
  dataSource: any;
  UserData: any[] = [];
  RoleData: any[] = [];
  addMappingData: any;
  IslayerDisplay: any;
  layerid: any;
  Layertext: any;
  HeaderLayerText: any;
  HideEvent:boolean = false;

  @ViewChild(MatPaginator) paginatorForUser: MatPaginator;
  @ViewChild(MatSort) sortForUser: MatSort;
  displayedHeadersForUser = [];
  displayedColumnsForUser: string[] = ['RoleName', 'SBUName', 'LocationName', 'AssetCategoryName', 'Actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedHeadersForRole = [];
  displayedColumnsForRole: string[] = ['UserName', 'SBUName', 'LocationName', 'AssetCategoryName', 'Actions'];
  menuheader: any = (menuheaders as any).default
  // dataSource = new MatTableDataSource(ELEMENT_DATA);
  // dataSourceForUser= new MatTableDataSource(ELEMENT_DATA1);

  constructor(
    private storage: ManagerService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private loader: AppLoaderService,
    private userRoleService: UserRoleService,
    public toastr: ToastrService,
    private confirmService: AppConfirmService,
    public us: UserService,
    public alertService: MessageAlertService,
    public cls: CompanyLocationService,
    public cbs: CompanyBlockService ,
    public reportService: ReportService,
    private jwtAuth: JwtAuthService) { 
      this.header = this.jwtAuth.getHeaders();
	    this.message = this.jwtAuth.getResources();

      this.displayedHeadersForUser = [this.header.Role, this.header.SBUName, this.header.Location, this.header.AssetCategory, this.header.Actions];
      this.displayedHeadersForRole = [this.header.UserName, this.header.SBUName, this.header.Location, this.header.AssetCategory, this.header.Actions];
    }

  ngOnInit() {
    this.SessionGroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.SessionRegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.SessionCompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.SessionUserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
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

    this.plantMultiCtrl="";
    this.cityMultiCtrl = "";
    this.categoryMultiCtrl = "";
    this.GetInitiatedData();
    this.CategoryGetdata1();
    this.userForm = new FormGroup({
      userEmail: new FormControl('', [Validators.required]),
      roleName: new FormControl('', [Validators.required]),
      UserFilter: new FormControl(['']),
      RoleFilter: new FormControl(['']),
    })

  }

  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  ListOfLoc1: any[] = [];
  ListOfSBU: any[] = [];
  ListOfLoc: any[] = [];
  ListOfCategory: any[] = [];
  ListOfCategory1: any[] = [];
  GetInitiatedData() {
    let url1 = this.cls.GetLocationListByConfiguration(this.SessionGroupId, this.SessionUserId, this.SessionCompanyId, this.SessionRegionId, 24);
    let url2 = this.cbs.GetCategoryListByConfiguration(this.SessionGroupId, this.SessionUserId, this.SessionCompanyId, this.SessionRegionId, 24);
    let url5 = this.us.PermissionRightsByUserIdAndPageId(this.SessionGroupId, this.SessionUserId, this.SessionCompanyId, this.SessionRegionId, "74");
    forkJoin([url5 , url1 , url2]).subscribe(results => {
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
        this.ListOfLoc = JSON.parse(results[1]);	
        this.ListOfLoc1 = this.ListOfLoc;
        this.ListOfSBU = this.UniqueArraybyId(this.ListOfLoc1, this.Layertext);
        this.getFilterCityType();
        this.getFilterPlantType();	
      }
      if (!!results[2]) {
        this.ListOfCategory = JSON.parse(results[2]);
        this.ListOfCategory1 = JSON.parse(results[2]);
        this.getFilterCategoryType();
      }
    })
  }
  
  UniqueArraybyId(collection, keyname) {
    var output = [], keys = [];
    collection.forEach(item => {
      var key = item[keyname];
      if (keys.indexOf(key) === -1) {
        keys.push(key);
        output.push(item);
      }
    });
    return output;
  };

  HideAllCheckBox(){
    this.HideEvent = !this.HideEvent;
  }
  categories : any[]=[];
  CategoryGetdata1() {
    this.categories = [];
    this.userRoleService.GetAllCategory(this.SessionCompanyId).subscribe(r => {
      r.forEach(element => {
          this.categories.push(element)
      });
    })
  }

  onchangeSBU(value) {
    debugger
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

   
    this.reportService.GetCategoryRightWiseForReport(this.SessionCompanyId, this.SessionUserId, PlantList, false, 24).subscribe(r => {
      this.ListOfCategory = [];
      r.forEach(element => {
        // this.ListOfCategory=[];
        this.ListOfCategory.push(element);
        this.getFilterCategoryType();
      });
      debugger;
        if(!!this.roleTablepanel){
          this.GetAllRoleAssignments();
        }
        if(!!this.userTablepanel){
          this.GetAllUserAssignments();
        }
    })
  }

  onChangeMappingType(val) {

    this.userpanel = false;
    this.rolepanel = false;
    this.userTablepanel = false;
    this.roleTablepanel = false;
    this.showAddBtnForuser = false;
    this.showAddBtn = false;
    this.dataSourceForUser = "";
    this.dataSource = "";
    this.UserData = [];
    this.RoleData = [];
    this.userForm.controls['userEmail'].setValue(null);
    this.userForm.controls['roleName'].setValue(null);

    if (val == '1') {
      this.GetAllUserList();
      this.userpanel = true;
    }
    if (val == '2') {
      this.GetAllRoleList();
      this.rolepanel = true;
    }
    // this.panelOpenState = true;
  }

  public filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredRoles: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();

  GetAllUserList() {
    this.UserData = [];
    var groupId = !this.SessionGroupId || this.SessionGroupId == 0 ? 0 : this.SessionGroupId;

    this.userRoleService.GetAllUsers(groupId).subscribe(r => {
      r.forEach(element => {
        this.UserData.push(element);        
      });
      this.getFilterUser();
    })
  }
  limit = 10;
  offset = 0;
  getFilterUser() {
    debugger;
    this.filteredUsers.next(this.UserData.slice(0, this.offset + this.limit));
    this.offset += this.limit;
    this.userForm.controls['UserFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterUserData();
      });
  }

  protected filterUserData() {

    if (!this.UserData) {
      return;
    }
    let search = this.userForm.controls['UserFilter'].value;
    if (!search) {
      this.filteredUsers.next(this.UserData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredUsers.next(
      this.UserData.filter(x => x.UserName.toLowerCase().indexOf(search) > -1)
    );
  }

  GetAllRoleList() {
    this.RoleData = [];
    var groupId = !this.SessionGroupId || this.SessionGroupId == 0 ? 0 : this.SessionGroupId;
    var regionId = !this.SessionRegionId || this.SessionRegionId == 0 ? 0 : this.SessionRegionId;
    var companyId = !this.SessionCompanyId || this.SessionCompanyId == 0 ? 0 : this.SessionCompanyId;

    this.userRoleService.GetAllRolesByLevel(groupId, regionId, companyId).subscribe(r => {
      r.forEach(element => {
        this.RoleData.push(element)
        this.getFilterRole();
      });
    })
  }

  getFilterRole() {

    this.filteredRoles.next(this.RoleData.slice());
    this.userForm.controls['RoleFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {

        this.filterRoleData();
      });
  }

  protected filterRoleData() {

    if (!this.RoleData) {
      return;
    }
    let search = this.userForm.controls['RoleFilter'].value;
    if (!search) {
      this.filteredRoles.next(this.RoleData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredRoles.next(
      this.RoleData.filter(x => x.RoleName.toLowerCase().indexOf(search) > -1)
    );
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

  limit2 = 10;
  offset2 = 0;	
  getFilterPlantType() {	
    this.filteredPlantsMulti.next(this.ListOfLoc.slice(0, this.offset2 + this.limit2));	
    this.offset2 += this.limit2;	
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

  toggleSelectAll(selectAllValue) {
    this.plantMultiCtrl = [];
    this.filteredPlantsMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (!!selectAllValue.checked) {
          //this.plantMultiCtrl.patchValue(val);
          this.ListOfLoc.forEach(element => {
            this.plantMultiCtrl.push(element);
          });
        } else {
          this.plantMultiCtrl = "";
        }
        this.ListOfCategory = this.ListOfCategory1;
        this.getFilterCategoryType();
        debugger;
        if(!!this.roleTablepanel){
          this.GetAllRoleAssignments();
        }
        if(!!this.userTablepanel){
          this.GetAllUserAssignments();
        }
      });
  }
  toggleSelectAllcategory(selectAllValue) {
    this.categoryMultiCtrl = [];
    this.filteredcategoryMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (!!selectAllValue.checked) {
          this.ListOfCategory.forEach(element => {
            this.categoryMultiCtrl.push(element);
          });
        } else {
          this.categoryMultiCtrl = "";
        }
      });
  }
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

  createRoleMembers(result: any) {
    this.loader.open();
  }


  openDialogRole(...getValue): void {

    var component: any
    if (getValue[0] === 'upload') {
    }
    else {
      component = Role_dialogComponent;
    }
    const dialogRef = this.dialog.open(component, {
      panelClass: 'group-form-dialog',
      disableClose: true,
      data: {
        component1: 'RoleComponent',
        value: getValue[0],
        GroupID: !this.SessionGroupId || this.SessionGroupId == 0 ? 0 : this.SessionGroupId,
        RegionID: !this.SessionRegionId || this.SessionRegionId == 0 ? 0 : this.SessionRegionId,
        CompanyId: !this.SessionCompanyId || this.SessionCompanyId == 0 ? 0 : this.SessionCompanyId,
        IsCategoryConfiguration: true,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && getValue[0] === 'insert') {

        this.addMappingData = "";
        this.addMappingData = result;
        this.addMappingData['user_Id'] = this.userForm.value.userEmail;
        this.addMappingData['flag'] = 'UserPanel';
        this.AddUserRoleMapping(this.addMappingData)
      }
    });
  }

  AddUserRoleMapping(result: any) {
    this.loader.open();
    var data =
    {
      GroupId: !this.SessionGroupId || this.SessionGroupId == 0 ? 0 : this.SessionGroupId,
      RegionId: !this.SessionRegionId || this.SessionRegionId == 0 ? 0 : this.SessionRegionId,
      CompanyId: !this.SessionCompanyId || this.SessionCompanyId == 0 ? 0 : this.SessionCompanyId,
      UserId: result.user_Id,
      RoleId: result.role_Id,
      LocationIds: result.location_Ids,
      AssetCategoryIds: result.category_Ids,
      CreatedBy: this.SessionUserId
    }
    this.userRoleService.AddUserRoleMapping(data).subscribe(r => {
      this.loader.close();
      if (r == "Success") {
        this.toastr.success(this.message.MappingSaveSucess, this.message.AssetrakSays);
      } else if (r == "Exists") {
        this.toastr.warning(this.message.RoleAlreadyMapped, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      if (result.flag == 'UserPanel') {
        this.GetAllUserAssignments();
      }
      if (result.flag == 'RolePanel') {
        this.GetAllRoleAssignments();
      }
    })
  }

  selectedUser(event) {

    if (event == "") {
      this.showAddBtn = false;
      this.showAddBtnForuser = false;
      this.userTablepanel = false;
      this.roleTablepanel = false;
    } else {
      this.showAddBtn = true;
      this.showAddBtnForuser = false;

      //method for showing user's assignment
      this.GetAllUserAssignments();
      this.userTablepanel = true;
      this.roleTablepanel = false;
    }
  }
  bindData: any[] = [];
  UserRoleBindData: any[] = [];
  GetAllUserAssignments() {
    debugger;
    this.loader.open();
    this.dataSourceForUser = "";
    var groupId = !this.SessionGroupId || this.SessionGroupId == 0 ? 0 : this.SessionGroupId;
    var regionId = !this.SessionRegionId || this.SessionRegionId == 0 ? 0 : this.SessionRegionId;
    var companyId = !this.SessionCompanyId || this.SessionCompanyId == 0 ? 0 : this.SessionCompanyId;
    var userId = this.userForm.value.userEmail;
    var LocationIds = [];
    if (!!this.plantMultiCtrl && this.plantMultiCtrl.length > 0) {
      this.plantMultiCtrl.forEach(x => {
        LocationIds.push(x.LocationId);
      })
    }
    var LocationIdList = LocationIds.join(',');

    this.userRoleService.GetUserAssignmentsByLevel(groupId, regionId, companyId, userId , LocationIdList).subscribe(r => {
      this.loader.close();
      debugger;
      this.bindData = [];
      this.UserRoleBindData = [];
      this.bindData = JSON.parse(r);
      console.log(this.bindData);
      if(this.bindData.length > 0){
        for (var i = 0; i < this.bindData.length; i++) {
          debugger;
          this.panelOpenState[i] =false;
          var locationList =  [];
          var userrole = {
            RoleName: this.bindData[i].RoleName,
            RoleId: this.bindData[i].RoleId,
            UserId: this.bindData[i].UserId,
            locationList: locationList
          }
          this.UserRoleBindData.push(userrole);
        }
      }      
      //this.onChangeDataSource(r);
    })
  }

  onChangeDataSource(value) {

    this.dataSourceForUser = new MatTableDataSource(value);
    this.dataSourceForUser.paginator = this.paginatorForUser;
    this.dataSourceForUser.sort = this.sortForUser;
  }

  SelectUserRole(type, data) {
    debugger;
    var locationList = [];
    var locationIdList = [];
    this.limit1 = 10;
    this.offset1 = 0;
    this.loader.open();
    //======== By User ========
    if(type == 'UserRoles'){
      for (var i = 0; i < this.bindData.length; i++) {      
        if(data.RoleName == this.bindData[i].RoleName){
          locationList = !!this.bindData[i].List ? JSON.parse(this.bindData[i].List) : [];  
        }      
      }
    }
    //======== By Role ========
    if(type == 'RoleUsers'){
      for (var i = 0; i < this.bindData.length; i++) {      
        if(data.UserName == this.bindData[i].UserName){
          locationList = !!this.bindData[i].List ? JSON.parse(this.bindData[i].List) : []; 
        }      
      }
    }

    debugger;
    data.locationList = locationList.slice(0, this.offset1 + this.limit1);
    this.loader.close();    
    
  }

  limit1 = 10;
  offset1 = 0;

  onScrollDown(type, data){
    debugger;
    var locationList = [];
    this.offset1 += this.limit1;
    this.loader.open();
    //======== By User ========
    if(type == 'UserRoles'){
      for (var i = 0; i < this.bindData.length; i++) {      
        if(data.RoleName == this.bindData[i].RoleName){
          locationList = !!this.bindData[i].List ? JSON.parse(this.bindData[i].List) : [];  
        }      
      }
    }
    //======== By Role ========
    if(type == 'RoleUsers'){
      for (var i = 0; i < this.bindData.length; i++) {      
        if(data.UserName == this.bindData[i].UserName){
          locationList = !!this.bindData[i].List ? JSON.parse(this.bindData[i].List) : []; 
        }      
      }
    }

    debugger;
    data.locationList = locationList.slice(0, this.offset1 + this.limit1);
    this.loader.close(); 
  }
  onScrollUp(){
    debugger;
  }
  applyFilter(filterValue: string) {
    this.dataSourceForUser.filter = filterValue.trim().toLowerCase();
  }

  applyLocationFilter(event: Event , type, data){
    debugger;
    const Value = (event.target as HTMLInputElement).value;
    
    var locationList = [];
    this.limit1 = 10;
    this.offset1 = 0;
    this.loader.open();
    //======== By User ========
    if(type == 'UserRoles'){
      for (var i = 0; i < this.bindData.length; i++) {      
        if(data.RoleName == this.bindData[i].RoleName){
          locationList = !!this.bindData[i].List ? JSON.parse(this.bindData[i].List) : [];  
        }      
      }
    }
    //======== By Role ========
    if(type == 'RoleUsers'){
      for (var i = 0; i < this.bindData.length; i++) {      
        if(data.UserName == this.bindData[i].UserName){
          locationList = !!this.bindData[i].List ? JSON.parse(this.bindData[i].List) : []; 
        }      
      }
    }

    debugger;
    if(!!Value){
      locationList = locationList.filter(x => x.LocationName.toLowerCase().indexOf(Value) > -1)
    }
     
    data.locationList = locationList.slice(0, this.offset1 + this.limit1);
    this.loader.close();    
    
  }

  openDialogUser(...getValue): void {

    var component: any
    if (getValue[0] === 'upload') {
    }
    else {
      component = User_dialogComponent;
    }
    const dialogRef = this.dialog.open(component, {
      panelClass: 'group-form-dialog',
      disableClose: true,
      data: {
        component1: 'UserComponent',
        value: getValue[0],
        GroupID: !this.SessionGroupId || this.SessionGroupId == 0 ? 0 : this.SessionGroupId,
        RegionID: !this.SessionRegionId || this.SessionRegionId == 0 ? 0 : this.SessionRegionId,
        CompanyId: !this.SessionCompanyId || this.SessionCompanyId == 0 ? 0 : this.SessionCompanyId,
        IsCategoryConfiguration: true,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && getValue[0] === 'insert') {

        this.addMappingData = "";
        this.addMappingData = result;
        this.addMappingData['role_Id'] = this.userForm.value.roleName;
        this.addMappingData['flag'] = 'RolePanel';
        this.AddUserRoleMapping(this.addMappingData)
      }
    });
  }

  selectedRole(event) {

    if (event == "") {
      this.showAddBtnForuser = false;
      this.showAddBtn = false;
      this.userTablepanel = false;
      this.roleTablepanel = false;
    } else {
      this.showAddBtnForuser = true;
      this.showAddBtn = false;

      //method for showing role's assignment
      this.GetAllRoleAssignments();
      this.userTablepanel = false;
      this.roleTablepanel = true;

    }
  }

  GetAllRoleAssignments() {
    this.loader.open();
    this.dataSource = "";
    var roleId = this.userForm.value.roleName;
    var groupId = !this.SessionGroupId || this.SessionGroupId == 0 ? 0 : this.SessionGroupId;
    var regionId = !this.SessionRegionId || this.SessionRegionId == 0 ? 0 : this.SessionRegionId;
    var companyId = !this.SessionCompanyId || this.SessionCompanyId == 0 ? 0 : this.SessionCompanyId;

    var LocationIds = [];
    if (!!this.plantMultiCtrl && this.plantMultiCtrl.length > 0) {
      this.plantMultiCtrl.forEach(x => {
        LocationIds.push(x.LocationId);
      })
    }
    var LocationIdList = LocationIds.join(',');


    this.userRoleService.GetAssignmentsByRole(roleId, groupId, regionId, companyId , LocationIdList).subscribe(r => {
      this.loader.close();
      debugger;
      this.bindData = [];
      this.UserRoleBindData = [];
      this.bindData = JSON.parse(r);
      if(this.bindData.length > 0){
        for (var i = 0; i < this.bindData.length; i++) {
          this.panelOpenState[i] =false;
          var locationList = [];
          var userrole = {
            UserName: this.bindData[i].UserName,
            RoleId: this.bindData[i].RoleId,
            UserId: this.bindData[i].UserId,
            locationList: locationList
          }
          this.UserRoleBindData.push(userrole);
        }
      }
      //this.onChangeDataSourceRole(r);
    })
  }

  onChangeDataSourceRole(value) {

    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilterRole(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  deleteMapping(...vars) {
    debugger;
    // this.deleteOptions = {
    //   option: vars[0],
    //   data: vars[1]
    // }

    var result = {
      UserId : vars[0].UserId ,
      RoleId : vars[0].RoleId ,
      LocationId : vars[1],
      AssetCategoryId : vars[2],
    }

    this.confirmService.confirm({ message: `Are you sure want to delete ?`, title: this.message.AssetrakSays })
      .subscribe(res => {
        debugger
        if (!!res) {
          this.RemoveUserRoleMapping(result);
        }
      })
  }

  RemoveUserRoleMapping(result: any) {
    debugger;
    this.loader.open();
    var data = {
      GroupId: !this.SessionGroupId || this.SessionGroupId == 0 ? 0 : this.SessionGroupId,
      RegionId: !this.SessionRegionId || this.SessionRegionId == 0 ? 0 : this.SessionRegionId,
      CompanyId: !this.SessionCompanyId || this.SessionCompanyId == 0 ? 0 : this.SessionCompanyId,
      UserId: result.UserId,
      RoleId: result.RoleId,
      LocationIds: !result.LocationId ? [] : [result.LocationId],
      AssetCategoryIds: !result.AssetCategoryId ? [] : [result.AssetCategoryId]
    }

    this.userRoleService.DeleteUserRoleMapping(data).subscribe(r => {
      debugger;
      this.loader.close();
      if (r == "Success") {
        this.toastr.success(this.message.MappingRemoveSucess, this.message.AssetrakSays);
      }
      else if (r == "Default Role") {
        this.toastr.error(this.message.DefaultRoleMappingDelete, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }      
      if(!!this.roleTablepanel){        
        this.GetAllRoleAssignments();
      }
      else{
        this.GetAllUserAssignments();
      }
      
    })
  }

  RemoveUserRoleMappingOld(result: any) {

    if (result.option == "UserTablePanel") {
      this.loader.open();
      var data = {
        GroupId: !this.SessionGroupId || this.SessionGroupId == 0 ? 0 : this.SessionGroupId,
        RegionId: !this.SessionRegionId || this.SessionRegionId == 0 ? 0 : this.SessionRegionId,
        CompanyId: !this.SessionCompanyId || this.SessionCompanyId == 0 ? 0 : this.SessionCompanyId,
        UserId: this.userForm.value.userEmail,
        RoleId: result.data.RoleId,
        LocationId: !result.data.LocationId ? 0 : result.data.LocationId,
        AssetCategoryId: !result.data.AssetCategoryId ? 0 : result.data.AssetCategoryId
      }

      this.userRoleService.DeleteUserRoleMapping(data).subscribe(r => {
        this.loader.close();
        if (r == "Success") {
          this.toastr.success(this.message.MappingRemoveSucess, this.message.AssetrakSays);
        }
        else if (r == "Default Role") {
          this.toastr.error(this.message.DefaultRoleMappingDelete, this.message.AssetrakSays);
        }
        else if (r == "Fail") {
          this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
        }
        this.GetAllUserAssignments();
      })
    }
    if (result.option == "RoleTablePanel") {
      this.loader.open();
      var data1 = {
        GroupId: !this.SessionGroupId || this.SessionGroupId == 0 ? 0 : this.SessionGroupId,
        RegionId: !this.SessionRegionId || this.SessionRegionId == 0 ? 0 : this.SessionRegionId,
        CompanyId: !this.SessionCompanyId || this.SessionCompanyId == 0 ? 0 : this.SessionCompanyId,
        UserId: result.data.UserId,
        RoleId: this.userForm.value.roleName,
        LocationId: !result.data.LocationId ? 0 : result.data.LocationId,
        AssetCategoryId: !result.data.AssetCategoryId ? 0 : result.data.AssetCategoryId
      }

      this.userRoleService.DeleteUserRoleMapping(data1).subscribe(r => {
        this.loader.close();
        if (r == "Success") {
          this.toastr.success(this.message.MappingRemoveSucess, this.message.AssetrakSays);
        }
        else if (r == "Default Role") {
          this.toastr.error(this.message.DefaultRoleMappingDelete, this.message.AssetrakSays);
        }
        else if (r == "Fail") {
          this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
        }
        this.GetAllRoleAssignments();
      })
    }

  }





}
