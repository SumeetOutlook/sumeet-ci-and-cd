import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as headers from '../../../../../assets/Headers.json';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { AssetCategoryService } from 'app/components/services/AssetCategoryService';
import { Constants } from 'app/components/storage/constants';
import { MatPaginator } from '@angular/material/paginator';
import { AssetTypeService } from 'app/components/services/AssetTypeService';
import { AssetSubTypeService } from 'app/components/services/AssetSubTypeService';
import { take, takeUntil } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';
import { CmmsService } from '../../../services/CmmsService';
import { StoragelocationService } from '../../../services/StoragelocationService';
import { MatSort } from '@angular/material/sort';
import { CompanyLocationService } from '../../../services/CompanyLocationService';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { UserRoleService } from 'app/components/services/UserRoleService';
import { MatStepper } from '@angular/material/stepper';
@Component({
  selector: 'app-workorder-type-dialog',
  templateUrl: './workorder-type-dialog.component.html',
  styleUrls: ['./workorder-type-dialog.component.scss']
})
export class WorkorderTypeDialogComponent implements OnInit {

  protected _onDestroy = new Subject<void>();
  assetVal: any;
  initiatedVal: any;
  selectedAsset: any = {};
  requestedVal: any;
  displayedColumns: any[] = ['select','Acronym', 'AssetCondition', 'AssetLocation', 'LabelStatus','Zone'];
  issueTypeVal: any;
  pbCriticlity:any;
  issueDesc: any;
  issueText: any;
  @ViewChild('stepper') private stepper: MatStepper;
  orderTyes: any[] = [];
  paginationParams: any;
  plantVal: any;
  public plantMultiFilterCtrl: FormControl = new FormControl();
  public filteredissueTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredPlantsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  issueTypes: any[] = [];
  category:any[]=[];
  public filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  ListOfLoc:any;
  ListOfLoc1: any;
  public filteredCategoryMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredSubTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  orderTypeFilterCtrl: FormControl = new FormControl();
  categoryIDS: any[]=[];
  typeIDS: any[]=[];
  subtypeIDS: any[]=[];
  filteredOrderTypes:  ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public categoryMultiCtrl: any;
  public categoryFilterCtrl: FormControl = new FormControl();
  public filteredcategoryMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredsubtypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public subtypeFilterCtrl: FormControl = new FormControl();
  public assettypeMultiCtrl: any;
  public assettypeFilterCtrl: FormControl = new FormControl();
  public subLocMultiFilterCtrl: FormControl = new FormControl();
  public filteredSubLocMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredAssetTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public issuetypeFilterCtrl: FormControl = new FormControl();
  public filteredCriticalityMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public criticalityMultiFilterCtrl:  FormControl = new FormControl();
  type:any[]=[];
  categories: any[] = [];
  types: any[] = [];
  criticalities: any[] = [];
  subTypes: any[] = [];
  header:any = (headers as any).default;
  submitted: boolean = false;
  public sbunm: any;
  disableAllFields:Boolean = false;
  dialogSBUForm: FormGroup;
  SessionGroupId: any;
  SessionRegionId: any;
  subLocVal: any;
  SessionCompanyId: any;
  subtype:any[]=[];
  SessionUserId: any;
  subLocations: any = [];
  categoryData: any;
  showGrid: boolean = false;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: any;
  allCategorySelected: Boolean = false;
  allTypesSelected: Boolean = false;
  allSubTypesSelected: Boolean = false;
  assettypeData: any;
  subTypeData: any;
  preFars: any[] = [];
  UserFilter: FormControl = new FormControl();
  get f1() { return this.dialogSBUForm.controls; };

  constructor(public matdialogbox: MatDialogRef<WorkorderTypeDialogComponent>,public localService: LocalStoreService, @Inject(MAT_DIALOG_DATA) public data:any,
  private storage: ManagerService,public categoryservice: AssetCategoryService,
      public typeservice: AssetTypeService,public subTypeservice: AssetSubTypeService,
  private fb: FormBuilder,   private cmmsService: CmmsService, private slService: StoragelocationService,
  public cls: CompanyLocationService,public userRoleService: UserRoleService
) { }

  ngOnInit(){
    debugger
    this.SessionGroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.SessionRegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.SessionCompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.SessionUserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    this.initiatedVal = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_NAME);
    this.paginationParams = {
      pageSize: 20,
      currentPageIndex: 0,
      endIndex: 0,
      startIndex: 0,
      totalCount: 0,
    }
      debugger;
      this.dialogSBUForm = this.fb.group({
        orderType: [''],
        partName : [''],
        qty : [''],
        dTime: [''],
        cost : [''],
        photo : [''],
        category : [''],
        type: [''],
        subtype: [''],
        categoryMultiFilterCtrl: [''],
        typeMultiFilterCtrl: [''],
        subtypeMultiFilterCtrl: ['']
    });
   debugger;

   let url1 = this.cls.GetLocationListByConfiguration(this.SessionGroupId, this.SessionUserId, this.SessionCompanyId, this.SessionRegionId, 40);
   url1.subscribe(locs=>{
     this.ListOfLoc = JSON.parse(locs);
     this.ListOfLoc1 = this.ListOfLoc;
     if(this.data){
      this.getSubLocByLocID(this.data.LocationID)
   
     }

     this.getFilterPlantType();
   });
    this.getOrderTypes();
    this.GetIssueTypes();
    this.GetAllCriticalities();
    this.GetAllUserList();
    if(this.data){
      this.plantVal = this.data.LocationID;
      this.issueTypeVal = this.data.IssueTypeID;
      this.issueText = this.data.IssueTypeDesc;
      this.issueDesc = this.data.Description;
      this.requestedVal = this.data.RequestedBy;
      this.pbCriticlity = this.data.CriticalityID;
      this.stepper.next();
    }
}

ngAfterViewInit(){
  if(this.data)
  this.stepper.next();
}

public onclosetab() {
  this.matdialogbox.close();
}

GetIssueTypes() {
  this.cmmsService.getIssueTypes().subscribe(res=>{
    console.log(JSON.parse(res.Model));
    this.issueTypes = JSON.parse(res.Model);
    this.getIssueFilterTypes();
  })
}

getIssueFilterTypes() {
  this.filteredissueTypeMulti.next(this.issueTypes.slice());
  this.issuetypeFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterIssueTypes();
    });
}

filterIssueTypes() {
  if (!this.issueTypes) {
    return;
  }
  let search = this.issuetypeFilterCtrl.value;
  if (!search) {
    this.filteredissueTypeMulti.next(this.issueTypes.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredissueTypeMulti.next(
    this.issueTypes.filter(x => x.IssueType.toLowerCase().indexOf(search) > -1)
  );
}



public noWhitespaceValidator(control: FormControl) {
  const isWhitespace = (control.value || '').trim().length === 0;
  const isValid = !isWhitespace;
  return isValid ? null : { 'whitespace': true };
}
onSubmit() {
  let dialogDaaata = {
    "Description": this.issueDesc,
    "CompanyID": this.SessionCompanyId,
    "IssueTypeID": this.issueTypeVal,
    "IssueTypeDesc": this.issueText,
    "PrefarID": this.selectedAsset.PreFARId,
    "StatusID": 1,
    "OrderClass": "OD",
    "CriticalityID": this.pbCriticlity,
    "InitiatedBy": this.SessionUserId,
    "RequestedBy": this.requestedVal,
    "LocationID": this.plantVal,
  };
  if(this.data) dialogDaaata['WorkOrderID'] = this.data.WorkOrderID;
  
  this.matdialogbox.close(dialogDaaata);
}

GetAllCategory() {
  var groupId = this.SessionGroupId;
  var regionId = this.SessionRegionId;
  var companyId = this.SessionCompanyId;
  this.categoryservice.GetAllCategoryData(groupId, regionId, companyId).subscribe(response => {
    this.categories = response;
    if(this.data.task == 'view' || this.data.task == 'edit'){
      this.categoryIDS.forEach(categoryId=>{
        this.categories.forEach(category=>{
          if(category.AssetCategoryId == categoryId)  this.category.push(category);
        });
        this.GetAllTypeData();
        });
    }
    this.getFilterCategoryType();
  })
}





getAllSubTypeData(typeId: any) {
  // var subTypeData = {
  //   GroupId: this.SessionGroupId,
  //   RegionId: this.SessionRegionId,
  //   CId: this.SessionCompanyId,
  //   TypeId: typeId
  // }
  // this.subTypeservice.GetAllSubTypeData(subTypeData).subscribe(response => {
  //   this.subTypeData = response;
  // })
}

toggleSelectAllCategory(ev){
if(ev) {
  let idsArr = [];
  this.allCategorySelected = true;
  this.filteredCategoryMulti.pipe(take(1), takeUntil(this._onDestroy))
  .subscribe(values=>{
    values.forEach(val=>{
      idsArr.push((val.AssetCategoryId).toString())
    })
  })
  this.dialogSBUForm.controls['category'].setValue(idsArr);
}
else{
  let idsArr = [];
  this.allCategorySelected = false;
  this.dialogSBUForm.controls['category'].setValue(idsArr);
}
}

toggleSelectAllTypes(ev){
  if(ev) {
    let idsArr = [];
    this.allSubTypesSelected = true;
    this.filteredSubTypeMulti.pipe(take(1), takeUntil(this._onDestroy))
    .subscribe(values=>{
      values.forEach(val=>{
        idsArr.push((val.AssetCategoryId).toString())
      })
    })
    this.dialogSBUForm.controls['type'].setValue(idsArr);
  }
  else{
    let idsArr = [];
    this.allTypesSelected = false;
    this.dialogSBUForm.controls['type'].setValue(idsArr);
  }
}

toggleSelectAllSubTypes(ev){
  if(ev) {
    let idsArr = [];
    this.allTypesSelected = true;
    this.filteredTypeMulti.pipe(take(1), takeUntil(this._onDestroy))
    .subscribe(values=>{
      values.forEach(val=>{
        idsArr.push((val.AssetCategoryId).toString())
      })
    })
    this.dialogSBUForm.controls['subtype'].setValue(idsArr);
  }
  else{
    let idsArr = [];
    this.allTypesSelected = false;
    this.dialogSBUForm.controls['subtype'].setValue(idsArr);
  }
}


onDelete(){
  debugger;
  this.matdialogbox.close();
}

enableFields(){
  // this.disableAllFields = false;
  // this.dialogSBUForm.controls['orderType'].enable();
  this.dialogSBUForm.controls['partName'].enable();
  // this.dialogSBUForm.controls['qty'].enable();
  this.dialogSBUForm.controls['cost'].enable();
  this.dialogSBUForm.controls['category'].enable();
  this.dialogSBUForm.controls['dTime'].enable();
  this.dialogSBUForm.controls['type'].enable();
  this.dialogSBUForm.controls['subtype'].enable();
}

getOrderTypes(){
  this.cmmsService.getOrderTypes().subscribe(res=>{
    debugger; 
    this.orderTyes = JSON.parse(res.Model);
    this.getFilterOrderType();
    console.log(this.orderTyes);
  })
}

GetAllTypeData() {
    // this.loader.open();
let catgoryIds = [];
this.category.forEach(catg=>catgoryIds.push(catg.AssetCategoryId));
 var typeData = {
   categoryIds: catgoryIds,
   groupId: this.SessionGroupId,
   regionId: this.SessionRegionId,
   companyId: this.SessionCompanyId,
 }
debugger;
 this.cmmsService.GetAssetTypesByCategoryIds(typeData).subscribe(response => {
      // this.loader.close();
   this.types = response.Model;
   if(this.data.task=='view' || this.data.task == 'edit'){
   this.typeIDS.forEach(typeId=>{
    this.types.forEach(type=>{
    if(type.TAId == typeId) this.type.push(type);
    });
    });
    this.GetAllSubTypeByCategoryIdTypeId();
  }
  this.getFilterType();
 });
 
}

GetAllSubTypeByCategoryIdTypeId() {
 
 let typeIds = [];
 this.type.forEach(t=>typeIds.push(t.TAId));
 
//  this.loader.open();
 var subTypeData = {
   typeIds: typeIds,
   groupId: this.SessionGroupId,
   regionId: this.SessionRegionId,
   companyId: this.SessionCompanyId,
 }

 this.cmmsService.getAssetSubTypesByTypeIds(subTypeData).subscribe(response => {
    //  this.loader.close();
   this.subTypes = response.Model;
   if(this.data.task == 'edit' || this.data.task == 'view'){
    this.subtypeIDS.forEach(subtypeId=>{
      this.subTypes.forEach(subtype=>{
      if(subtype.STAId == subtypeId) this.subtype.push(subtype);
      });
      });
   }
   this.getFilterSubType();
 })
}

getFilterOrderType() {
  this.filteredOrderTypes.next(this.orderTyes.slice());
  this.orderTypeFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterOrderTypes();
    });
}
filterOrderTypes(){
  if (!this.orderTyes) {
    return;
  }
  // get the search keyword
  let search = this.orderTypeFilterCtrl.value;
  if (!search) {
    this.filteredOrderTypes.next(this.orderTyes.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  // filter the banks
  this.filteredOrderTypes.next(
    this.orderTyes.filter(ot => ot.OrderType.toLowerCase().indexOf(search) > -1)
  );
}

getFilterType(){
  // public assettypeMultiCtrl: any;
  // public assettypeFilterCtrl: FormControl = new FormControl();
  // public filteredsubtypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  debugger;
  this.filteredAssetTypeMulti.next(this.types.slice());
  this.assettypeFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(()=> {
      this.filterAssetTypes();
    })
}



filterAssetTypes(){
  if (!this.types) {
    return;
  }
  debugger;
  let search = this.assettypeFilterCtrl.value;
  if (!search) {
    this.filteredAssetTypeMulti.next(this.types.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredAssetTypeMulti.next(
    this.types.filter(x => x.TypeOfAsset.toLowerCase().indexOf(search) > -1)
  );
}


getFilterSubType() {
  this.filteredsubtypeMulti.next(this.subTypes.slice());
  this.subtypeFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterSubTypeMulti();
    });
}

protected filterSubTypeMulti(){
  if (!this.subTypes) {
    return;
  }
  let search = this.subtypeFilterCtrl.value;
  if (!search) {
    this.filteredsubtypeMulti.next(this.subTypes.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredsubtypeMulti.next(
    this.subTypes.filter(x => x.SubTypeOfAsset.toLowerCase().indexOf(search) > -1)
  );
}

getFilterCategoryType() {
  debugger;
  this.filteredcategoryMulti.next(this.categories.slice());
  this.categoryFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterCategoryMulti();
    });
}
protected filterCategoryMulti() {
  if (!this.categories) {
    return;
  }
  let search = this.categoryFilterCtrl.value;
  if (!search) {
    this.filteredcategoryMulti.next(this.categories.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredcategoryMulti.next(
    this.categories.filter(x => x.AssetCategoryName.toLowerCase().indexOf(search) > -1)
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
  if (!this.ListOfLoc1) {
    return;
  }
  let search = this.plantMultiFilterCtrl.value;
  if (!search) {
    this.filteredPlantsMulti.next(this.ListOfLoc1.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredPlantsMulti.next(
    this.ListOfLoc1.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1)
  );
}

getSubLocByLocID(LocationId){

  this.slService.GetAllStoragelocationData(this.SessionCompanyId, LocationId).subscribe(res=>{
    this.subLocations = res;
    if(this.data)
    this.subLocVal = this.data.RackID;
    this.getFilterSubLocType();
  })
}
getFilterSubLocType(){
  this.filteredSubLocMulti.next(this.subLocations.slice());
  this.subLocMultiFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterSubLocMulti();
    });
}

filterSubLocMulti() {
  if (!this.subLocations) {
    return;
  }
  let search = this.subLocMultiFilterCtrl.value;
  if (!search) {
    this.filteredSubLocMulti.next(this.subLocations.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredSubLocMulti.next(
    this.subLocations.filter(x => x.RackName.toLowerCase().indexOf(search) > -1)
  );
}

GetPreFarByLocationId(){
  let data ={
    locationID: 1,
    take: 20,
    skip: 0
  }
this.cmmsService.getPrefarByLocID(data).subscribe(res=>{ // using loc id as 1 for now only
  this.preFars = JSON.parse(res.Model);
  console.log(this.preFars);
  this.onChangeDataSource(this.preFars,res.TotalRecords);
  this.showGrid = true;
})
}

onChangeDataSource(data,tRec){
  this.dataSource = new MatTableDataSource(data);
  this.dataSource.sort = this.sort;
  this.dataSource.paginator = this.paginator;
  this.paginationParams.totalCount = tRec;
}

GetAllCriticalities() {
  this.cmmsService.getCriticalities().subscribe(res=>{
    this.criticalities = JSON.parse(res.Model);
    this.getFilterCriticality();
  })
}

getFilterCriticality(){
  this.filteredCriticalityMulti.next(this.criticalities.slice());
  this.criticalityMultiFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterCriticalityMulti();
    });
}

filterCriticalityMulti() {
  if (!this.criticalities) {
    return;
  }
  let search = this.criticalityMultiFilterCtrl.value;
  if (!search) {
    this.filteredCriticalityMulti.next(this.criticalities.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredCriticalityMulti.next(
    this.criticalities.filter(x => x.CriticalityType.toLowerCase().indexOf(search) > -1)
  );
}

UserData: any[] = [];
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

getFilterUser() {
  debugger;
  this.filteredUsers.next(this.UserData.slice());
  this.UserFilter.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterUserData();
    });
}

protected filterUserData() {

  if (!this.UserData) {
    return;
  }
  let search = this.UserFilter.value;
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

getAssetValue(el){
  this.selectedAsset = el;
  this.assetVal = el.ADL2;
  console.log(this.selectedAsset);
}

}
