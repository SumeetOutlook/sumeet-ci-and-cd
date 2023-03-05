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
import { AssetTypeService } from 'app/components/services/AssetTypeService';
import { AssetSubTypeService } from 'app/components/services/AssetSubTypeService';
import { take, takeUntil } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';
import { CmmsService } from '../../../services/CmmsService';
import { CompanyLocationService } from '../../../services/CompanyLocationService';
@Component({
  selector: 'app-parts-inventory-dialog',
  templateUrl: './parts-inventory-dialog.component.html',
  styleUrls: ['./parts-inventory-dialog.component.scss']
})
export class PartsInventoryDialogComponent implements OnInit {

  protected _onDestroy = new Subject<void>();
  partVal: any;
  locVal: any;
  qty: any;
  cost: any;
  orderTyes: any[] = [];
  partTypeFilterCtrl: FormControl = new FormControl();
  plantMultiFilterCtrl:FormControl = new FormControl();
  issueTypes: any[] = [];
  category:any[]=[];
  filteredPartTypes: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredCategoryMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredSubTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  orderTypeFilterCtrl: FormControl = new FormControl();
  allParts: any[] = [];
  categoryIDS: any[]=[];
  typeIDS: any[]=[];
  filteredPlantsMulti:  ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  subtypeIDS: any[]=[];
  filteredOrderTypes:  ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public categoryMultiCtrl: any;
  public categoryFilterCtrl: FormControl = new FormControl();
  public filteredcategoryMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredsubtypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public subtypeFilterCtrl: FormControl = new FormControl();
  public assettypeMultiCtrl: any;
  public assettypeFilterCtrl: FormControl = new FormControl();
  public filteredAssetTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  type:any[]=[];
  categories: any[] = [];
  types: any[] = [];
  subTypes: any[] = [];
  header:any = (headers as any).default;
  submitted: boolean = false;
  public sbunm: any;
  disableAllFields:Boolean = false;
  dialogSBUForm: FormGroup;
  SessionGroupId: any;
  SessionRegionId: any;
  SessionCompanyId: any;
  subtype:any[]=[];
  SessionUserId: any;
  categoryData: any;
  allCategorySelected: Boolean = false;
  allTypesSelected: Boolean = false;
  allSubTypesSelected: Boolean = false;
  assettypeData: any;
  subTypeData: any;
  ListOfLoc: any[] = [];
  ListOfLoc1: any[] = [];
  get f1() { return this.dialogSBUForm.controls; };

  constructor(public matdialogbox: MatDialogRef<PartsInventoryDialogComponent>,public localService: LocalStoreService, @Inject(MAT_DIALOG_DATA) public data:any,
  private storage: ManagerService,public categoryservice: AssetCategoryService,
      public typeservice: AssetTypeService,public subTypeservice: AssetSubTypeService,
  private fb: FormBuilder,   private cmmsService: CmmsService, public cls: CompanyLocationService
) { }

  ngOnInit(){
    debugger
    this.SessionGroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.SessionRegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.SessionCompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.SessionUserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    let url1 = this.cls.GetLocationListByConfiguration(this.SessionGroupId, this.SessionUserId, this.SessionCompanyId, this.SessionRegionId, 40);
   url1.subscribe(locs=>{
     this.ListOfLoc = JSON.parse(locs);
     this.ListOfLoc1 = this.ListOfLoc;
 

     this.getFilterPlantType();
   });
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
    console.log(this.data);
    if(this.data.task == 'edit'){
       this.partVal = this.data.rowData.PartID;
       this.locVal = this.data.rowData.LocationID;
       this.qty = this.data.rowData.AvailableQty;
       this.cost = this.data.rowData.WeightedCost;
    }

    this.getOrderTypes();
     this.GetAllCategory();
     this.getParts();
}

public onclosetab() {
  this.matdialogbox.close('close');
}
public noWhitespaceValidator(control: FormControl) {
  const isWhitespace = (control.value || '').trim().length === 0;
  const isValid = !isWhitespace;
  return isValid ? null : { 'whitespace': true };
}
onSubmit() {
  let dialogDaaata = {
      "CompanyID": 1,
      "LocationID": this.locVal,
      "PartID": this.partVal,
      "AvailableQty": this.qty,
      "WeightedCost": this.cost
  };
  if(this.data.task == 'edit') dialogDaaata['InventoryID'] = this.data.rowData.InventoryID;
  console.log(dialogDaaata);
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

getParts() {
  this.cmmsService.getAllParts().subscribe(res=>{
    this.allParts = JSON.parse(res.Model);
    console.log(this.allParts);
    this.getPartFilter();
  })
}
getPartFilter() {
  this.filteredPartTypes.next(this.allParts.slice());
  this.partTypeFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.FilterPlantTypes();
    });
}

FilterPlantTypes() {
  if (!this.allParts) {
    return;
  }
  // get the search keyword
  let search = this.partTypeFilterCtrl.value;
  if (!search) {
    this.filteredPartTypes.next(this.allParts.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  // filter the banks
  this.filteredPartTypes.next(
    this.allParts.filter(ot => ot.PartName.toLowerCase().indexOf(search) > -1)
  );
}

}
