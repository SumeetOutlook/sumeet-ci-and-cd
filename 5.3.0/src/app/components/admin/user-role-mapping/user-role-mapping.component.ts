import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import{LocationListDialogComponent}from '../create-role/location-list-dialog/location-list-dialog.component';
//import { CommonService } from 'app/components/services/common.service';
import { Router, ActivatedRoute } from "@angular/router";
//import * as XLSX from 'xlsx';
//import { AdminService } from "app/components/services/admin.service";
//import { LocationListDialogComponent   } from "../dialogs/location-list-dialog/location-list-dialog.component";
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
//import * as headers from '../../../constantJson/tableHeaders.json';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { UserRoleService } from 'app/components/services/UserRoleService';
import { ToastrService } from 'ngx-toastr';
import * as resource from '../../../../assets/Resource.json';


interface SBU {
  id: string;
  name: string;
}
interface Plant {
  id: string;
  name: string;
}
interface CATEGORY {
  id: string;
  name: string;
}
const PLANTS: Plant[] = [
  { name: 'Pune', id: 'A' },
  { name: 'Nashik', id: 'B' },
  { name: 'Mumbai', id: 'C' },
  { name: 'Kolhapur', id: 'D' },
  { name: 'Delhi', id: 'E' },
  { name: 'Hydrabad', id: 'F' },
];
const SBU: SBU[] = [
  { name: 'India', id: 'A' },
  { name: 'USA', id: 'B' },
  { name: 'New SBU', id: 'C' },
  { name: 'SBU1', id: 'D' },
  { name: 'Delhi', id: 'E' }

];

const CATEGORY: CATEGORY[] = [
  { name: 'IT Equipment', id: 'A' },
  { name: 'Hardware', id: 'B' },
  { name: 'Furniture & Fixtures', id: 'C' },
  { name: 'Automobile', id: 'D' }
];

@Component({
  selector: 'app-user-role-mapping',
  templateUrl: './user-role-mapping.component.html',
  styleUrls: ['./user-role-mapping.component.css']
})

export class UserRoleMappingComponent implements OnInit {
//  products: any = (headers as any).default;
  panelOpenState: boolean = false;
  userpanel: boolean = false;
  rolepanel: boolean = false;
  userForm: FormGroup;
  submitted: boolean = false;  
  roleTypes: any[] = [
  {id: '0', name: 'Admin'},
  {id: '1', name: 'Super Admin'},
 // {id: 'tacos-2', viewValue: 'Tacos'}
];
  userTypes: any[] = [
  {id: '0', name:'admin@gmail.com'},
  {id: '1', name: 'super@gmail.com'}];
  roleList : any[] = [];
  selectedValue1:any;
  permissionList : any[] = [];

  mappingTypes: any[] = [
    { value: 'By User', id: '1' },
    { value: 'By Role', id: '2' },
  ];

  listofRoles:any[]=[];
  roleListByModule: any[] = [
    {id: '0', name:'Admin',listofRoles:[{ sbu_id : '', location_id : '',cat_id : '' }]},
    {id: '1', name: 'Super Admin',listofRoles:[{ sbu_id : '', location_id : '',cat_id : '' }]}];


    userListByModule: any[] = [
      {id: '0', name:'admin@gmail.com',listofRoles:[{ sbu_id : '', location_id : '',cat_id : '' }]},
      {id: '1', name: 'super@gmail.com',listofRoles:[{ sbu_id : '', location_id : '',cat_id : '' }]}];


  get f() { return this.userForm.controls; };
  XLSXdata: any;

 
  protected sbu: SBU[] = SBU;
  public sbuMultiCtrl: FormControl = new FormControl();
  public sbuMultiFilterCtrl: FormControl = new FormControl();
  public filteredsbuMulti: ReplaySubject<SBU[]> = new ReplaySubject<SBU[]>(1);

  protected plants: Plant[] = PLANTS;
  public plantMultiCtrl: FormControl = new FormControl();
  public plantMultiFilterCtrl: FormControl = new FormControl();
  public filteredPlantsMulti: ReplaySubject<Plant[]> = new ReplaySubject<Plant[]>(1);

  protected Category: CATEGORY[] = CATEGORY;
  public categoryMultiCtrl: FormControl = new FormControl();
  public categoryMultiFilterCtrl: FormControl = new FormControl();
  public filteredCategorysMulti: ReplaySubject<CATEGORY[]> = new ReplaySubject<CATEGORY[]>(1);

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  protected _onDestroy = new Subject<void>();

  SessionGroupId: any;
  SessionRegionId: any;
  SessionCompanyId: any;
  message: any = (resource as any).default;
  
  constructor(
    private storage: ManagerService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog ,
    private loader: AppLoaderService,
    private userRoleService:UserRoleService,
    public toastr: ToastrService,) { }

  ngOnInit() {
    this.userForm = new FormGroup({
      userEmail: new FormControl('', [Validators.required]),      
    })
  //  this.addMore();
  this.SessionGroupId = 12;
  this.SessionRegionId = 1;
  this.SessionCompanyId = 12;

    this.usersGetData();
    this.rolesGetData(); 

    this.filteredsbuMulti.next(this.sbu.slice());
    this.sbuMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterSBUMulti();
      });

    this.filteredPlantsMulti.next(this.plants.slice());
    this.plantMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPlantsMulti();
      });

    this.filteredCategorysMulti.next(this.Category.slice());
    this.categoryMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCategoryMulti();
      });
  }

  protected filterSBUMulti() {
    if (!this.sbu) {
      return;
    }
    let search = this.sbuMultiFilterCtrl.value;
    if (!search) {
      this.filteredsbuMulti.next(this.sbu.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredsbuMulti.next(
      this.sbu.filter(SBU => SBU.name.toLowerCase().indexOf(search) > -1)
    );
  }
  
  protected filterPlantsMulti() {
    if (!this.plants) {
      return;
    }
    let search = this.plantMultiFilterCtrl.value;
    if (!search) {
      this.filteredPlantsMulti.next(this.plants.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredPlantsMulti.next(
      this.plants.filter(plant => plant.name.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterCategoryMulti() {
    if (!this.Category) {
      return;
    }
    let search = this.categoryMultiCtrl.value;
    if (!search) {
      this.filteredCategorysMulti.next(this.Category.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCategorysMulti.next(
      this.Category.filter(Category => Category.name.toLowerCase().indexOf(search) > -1)
    );
  }



  toggleSelectAllSBU(selectAllValue: boolean) {
    this.filteredsbuMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.sbuMultiCtrl.patchValue(val);
        } else {
          this.sbuMultiCtrl.patchValue([]);
        }
      });
  }

  toggleSelectPlantAll(selectAllValue: boolean,item) {
    
    this.filteredPlantsMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        
        if (selectAllValue) {
          this.plantMultiCtrl.patchValue(val);

        } else {
          this.plantMultiCtrl.patchValue([]);
        }
      });
      
      
  }

  toggleSelectCategoryAll(selectAllValue: boolean) {
    this.filteredCategorysMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.categoryMultiCtrl.patchValue(val);
        } else {
          this.categoryMultiCtrl.patchValue([]);
        }
      });
  }

  usersGetData() {
    // this.as.usersGetData(this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_UUID)).subscribe(r => {
    //   r.data.forEach(element => {   
    //     element.locationIds = [];
    //     element.locationNames = [];
    //     element.cheked = false;     
    //     this.userTypes.push(element)
    //   });
    // })
  }

  rolesGetData() {
    // this.as.rolesGetData(this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_UUID)).subscribe(response => {
    //   response.data.forEach(element => {
    //     element.locationIds = [];
    //     element.locationNames = [];
    //     element.cheked = false;
    //     this.roleTypes.push(element)
    //   });
    // })
  }
  onChangeMappingType(val){
    
    if(val=='1'){
      this.GetAllUserList();
      this.userpanel=true;
      this.rolepanel=false;
    }
    else{
      this.GetAllRoleList();
      this.userpanel=false;
      this.rolepanel=true;
    }
    this.panelOpenState = true;
  }

  addPermissions(p){
    
    var idx = this.permissionList.indexOf(p);
    if(idx > -1 ){
      this.permissionList.splice(idx , 1);
    }
    else{
      this.permissionList.push(p);
    }
  }
  bindRolewithLocation(u){
    
    let user = {
      id: u.id, 
      name: u.name,
      locationIds : [],
      locationNames : [],
    }
     this.roleList.push(user);
    u.cheked = !u.cheked;
  }

  openDialog(u){
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    dialogconfig.width = "50%";
    dialogconfig.data={
      rowData: u
    };

    const dialogRef = this.dialog.open(LocationListDialogComponent, dialogconfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        
        u.locationNames=[];
        u.locationIds =  result.locationIds;
        u.locationNames = result.locationNames.join(',')
      }
    });
   
  }

  onSubmit() {
    
    if (this.userForm.invalid) {
      return false;
    }
    else {      
      if( this.userpanel == true){
        var data = {        
          // 'first_name': this.userForm.get('firstName').value,
          // 'last_name': this.userForm.get('lastName').value,
          'user_id': this.userForm.get('userEmail').value,
          'role_list':this.roleTypes,
          'created_by': this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_UUID),
          'option':'delete',
          'action' :'by_user'
        }     
        this.updateRoleMembers(data) ;
      }
      else{
        var data1 = {        
          // 'first_name': this.userForm.get('firstName').value,
          // 'last_name': this.userForm.get('lastName').value,
          'role_id': this.userForm.get('userEmail').value,
          'user_list':this.userTypes,
          'created_by': this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_UUID),
          'option':'delete',
          'action' :'by_role'
        }     
        this.updateRoleMembers(data1) ;
      }
      
    }
  }

  updateRoleMembers(result: any) {

  }
  createRoleMembers(result: any) {
    this.loader.open();
  }


  removebtnDisable:boolean=true;
  addMore(r)
  {
    
    this.removebtnDisable=false;
    let data = { sbu_id : '', location_id : '',cat_id : '' }
    r.listofRoles.push(data);

    if(r.listofRoles.length == 1)
    {
      this.removebtnDisable=true;

    }

  }

  removeParty(r,item) {
    
    this.removebtnDisable=false;
    var idx = r.listofRoles.indexOf(item);
    if (idx > -1) {
      r.listofRoles.splice(idx, 1);
    }
    if(r.listofRoles.length == 1)
    {
      this.removebtnDisable=true;

    }
    //this.salientContractList.push(this.salientContractList);
   
  }


  removebtnDisableForUser:boolean=true;
  addMoreForUser(r)
  {
    
    this.removebtnDisableForUser=false;
    let data = { sbu_id : '', location_id : '',cat_id : '' }
    r.listofRoles.push(data);

    if(r.listofRoles.length == 1)
    {
      this.removebtnDisableForUser=true;

    }

  }

  removePartyForUser(r,item) {
    
    this.removebtnDisableForUser=false;
    var idx = r.listofRoles.indexOf(item);
    if (idx > -1) {
      r.listofRoles.splice(idx, 1);
    }
    if(r.listofRoles.length == 1)
    {
      this.removebtnDisableForUser=true;

    }
    //this.salientContractList.push(this.salientContractList);
   
  }


  //Integration for User-Role mapping
  
  UserData: any[]=[];
  RoleData: any[]=[];

  sbus: any[] = [];
  locations: any[] = [];
  categories: any[] = [];

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  public filteredSBUS: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredLocations: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredCategory: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  GetAllUserList()
  {
    
    this.UserData=[];
    var groupId=this.SessionGroupId;

    this.userRoleService.GetAllUsers(groupId).subscribe(r => {
      
      r.forEach(element => {
                
          this.UserData.push(element)      
      });
    })   
  }

  GetAllRoleList()
  {
    
    this.RoleData=[];
    var groupId=this.SessionGroupId;
    var regionId=this.SessionRegionId;
    var companyId=this.SessionCompanyId;

    this.userRoleService.GetAllRolesByLevel(groupId, regionId, companyId).subscribe(r => {
      r.forEach(element => {
                
          this.RoleData.push(element)      
      });
    })   
  }


  SBUGetdata() {
    
    this.sbus = [];
    var companyId=this.SessionCompanyId;
    this.userRoleService.GetAllSBU(companyId).subscribe(r => {
      
      r.forEach(element => {
        this.sbus.push(element)
        this.getFilterSBUUS();
      });
    })
  }

  LocationGetdata(name) {
    
    this.locations = [];
    var companyId=this.SessionCompanyId;
    this.userRoleService.GetAllLocations(companyId).subscribe(r => {
      
      r.forEach(element => {
        if (name == element.Zone) {
          this.locations.push(element)
          this.getFilterLocations();
          
        }
      });
    })
  }

  CategoryGetdata() {
    this.categories = [];
    var companyId=this.SessionCompanyId;
    this.userRoleService.GetAllCategory(companyId).subscribe(r => {
      r.forEach(element => {
          this.categories.push(element)
          this.getFilterCategory();
      });
    })
  }


  onChangeSBU(name) {
    this.LocationGetdata(name);
  }

  getFilterSBUUS() {
    
    this.filteredSBUS.next(this.sbus.slice());
    this.userForm.controls['sbuMultiFilterCtrl'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        
        this.filterSBUData();
      });
  }

  protected filterSBUData() {
    
    if (!this.sbus) {
      return;
    }
    // get the search keyword
    let search = this.userForm.controls['sbuMultiFilterCtrl'].value;
    if (!search) {
      this.filteredSBUS.next(this.sbus.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredSBUS.next(
      this.sbus.filter(x => x.SBU.toLowerCase().indexOf(search) > -1)
    );  
  }


  getFilterLocations() {

    
    this.filteredLocations.next(this.locations.slice());
    this.userForm.controls['plantMultiFilterCtrl'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        
        this.filterLocationData();
      });
  }

  protected filterLocationData() {
    
    if (!this.locations) {
      return;
    }
    // get the search keyword
    let search = this.userForm.controls['plantMultiFilterCtrl'].value;
    if (!search) {
      this.filteredLocations.next(this.locations.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredLocations.next(
      this.locations.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1)
    );   
  }


  getFilterCategory() {
    
    this.filteredCategory.next(this.categories.slice());
    this.userForm.controls['categoryMultiFilterCtrl'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        
        this.filterCategoryData();
      });
  }

  protected filterCategoryData() {
    
    if (!this.categories) {
      return;
    }
    // get the search keyword
    let search = this.userForm.controls['categoryMultiFilterCtrl'].value;
    if (!search) {
      this.filteredCategory.next(this.categories.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredCategory.next(
      this.categories.filter(x => x.AssetCategoryName.toLowerCase().indexOf(search) > -1)
    );
  }







}
