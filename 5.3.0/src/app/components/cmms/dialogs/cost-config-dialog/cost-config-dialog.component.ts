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
@Component({
  selector: 'app-cost-config-dialog',
  templateUrl: './cost-config-dialog.component.html',
  styleUrls: ['./cost-config-dialog.component.scss']
})
export class CostConfigDialogComponent implements OnInit {

  protected _onDestroy = new Subject<void>();
  orderTyes: any[] = [];
 
  issueTypes: any[] = [];
  lvlVal: any[]=[];
  configVal: any;
  lvls: any[] = ['Level-1','Level-2','Level-3','Level-4','Level-5','Level-5'];
  amountFromVal: any;
  amountToVal: any;
  amountVal: any;
  configTypes: any[] = ['Amount From', 'Amount Above', 'Amount Below'];
  category:any[]=[];
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
  get f1() { return this.dialogSBUForm.controls; };

  constructor(public matdialogbox: MatDialogRef<CostConfigDialogComponent>,public localService: LocalStoreService, @Inject(MAT_DIALOG_DATA) public data:any,
  private storage: ManagerService,public categoryservice: AssetCategoryService,
      public typeservice: AssetTypeService,public subTypeservice: AssetSubTypeService,
  private fb: FormBuilder,   private cmmsService: CmmsService
) { }

  ngOnInit(){
    debugger
    this.SessionGroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.SessionRegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.SessionCompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.SessionUserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
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
    if(this.data.task === 'edit')
    {     
      // this.configVal = this.rowData;
      console.log(this.data.rowData);
      let dialogData = this.data.rowData
      this.configVal = dialogData['Config Type'] || "";
      this.amountFromVal = dialogData['Amount From'] || "";
      this.amountToVal = dialogData['Amount To'] || "";
      this.amountVal = dialogData['Value'] || ""
      console.log('Mukesh')
      for(let lvl=1;lvl<=dialogData['Levels'];lvl++){
        console.log('inside loop',lvl.toString())
        this.lvlVal.push("Level-"+lvl);
        console.log(lvl.toString())
      }
      console.log(this.lvlVal)

    }else if(this.data.task=='view'){
      // this.disableAllFields = true;
      this.dialogSBUForm.controls['orderType'].disable();
      this.dialogSBUForm.controls['partName'].disable();
      // this.dialogSBUForm.controls['qty'].disable();
      this.dialogSBUForm.controls['cost'].disable();
      this.dialogSBUForm.controls['dTime'].disable();
      this.dialogSBUForm.controls['category'].disable();
      this.dialogSBUForm.controls['type'].disable();
      this.dialogSBUForm.controls['subtype'].disable();

      this.dialogSBUForm.controls['orderType'].setValue(this.data.rowData['OrderType']);
      this.dialogSBUForm.controls['partName'].setValue(this.data.rowData['Par Name']);
      // this.dialogSBUForm.controls['qty'].setValue(this.data.rowData['Qty']);//Cost
      this.dialogSBUForm.controls['cost'].setValue(this.data.rowData['Cost']);
      this.dialogSBUForm.controls['category'].setValue(['163','361']);
      this.dialogSBUForm.controls['type'].setValue(['163','361']);
      this.dialogSBUForm.controls['subtype'].setValue(['163','361']);
    }

    this.getOrderTypes();
     this.GetAllCategory();
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
  console.log(this.lvlVal);
  let dialogDaaata = {
    'Config Type': this.configVal,
    'Amount From':this.amountFromVal || "",
     'Amount To': this.amountToVal  || "",
      'Value':this.amountVal || "",
      'Levels':this.lvlVal.length || ""
  };
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


}
