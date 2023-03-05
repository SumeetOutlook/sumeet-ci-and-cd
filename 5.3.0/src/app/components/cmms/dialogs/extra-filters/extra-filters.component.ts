import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { COMMA, ENTER, M, S } from '@angular/cdk/keycodes';
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
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { CmmsService } from '../../../services/CmmsService';
@Component({
  selector: 'app-extra-filters',
  templateUrl: './extra-filters.component.html',
  styleUrls: ['./extra-filters.component.scss']
})
export class ExtraFiltersComponent implements OnInit {

  protected _onDestroy = new Subject<void>();
  orderTyes: any[];
  issueTypes: any[] = ['Mac not working','Windows corrupted','Joystick button not working','Mouse scroll buton not working',
  'AC not working'];
  categories: any[] ;
  types: any[];
  subTypes: any[];
  subtype:any[]=[];
  header:any = (headers as any).default;
  submitted: boolean = false;
  disableAllFields:Boolean = false;
  public sbunm: any;
  dialogSBUForm: FormGroup;
  public filteredCategoryMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredSubTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  SessionGroupId: any;
  SessionRegionId: any;
  SessionCompanyId: any;
  public assettypeMultiCtrl: any;
  public assettypeFilterCtrl: FormControl = new FormControl();
  public filteredAssetTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  category:any[]=[];
  categoryIDS: any[]=[];
  typeIDS: any[]=[];
  orderTypeFilterCtrl: FormControl = new FormControl();
  subtypeIDS: any[]=[];
  type:any[]=[];
  SessionUserId: any;
  categoryData: any;
  filteredOrderTypes:  ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  allCategorySelected: Boolean = false;
  allTypesSelected: Boolean = false;
  allSubTypesSelected: Boolean = false;
  assettypeData: any;
  public categoryMultiCtrl: any;
  public categoryFilterCtrl: FormControl = new FormControl();
  public filteredcategoryMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  subTypeData: any;
  public filteredsubtypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public subtypeFilterCtrl: FormControl = new FormControl();

  get f1() { return this.dialogSBUForm.controls; };

  constructor(public matdialogbox: MatDialogRef<ExtraFiltersComponent>,public localService: LocalStoreService, @Inject(MAT_DIALOG_DATA) public data:any,
  private storage: ManagerService,public categoryservice: AssetCategoryService,
      public typeservice: AssetTypeService,public subTypeservice: AssetSubTypeService,
  private fb: FormBuilder, private loader: AppLoaderService, private cmmsService: CmmsService
) { }

  ngOnInit(){
    this.SessionGroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.SessionRegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.SessionCompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.SessionUserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
      debugger;
      this.dialogSBUForm = this.fb.group({
        orderType: ['', Validators.required],
        issueType : ['', Validators.required],
        issueCode: ['', Validators.required],
        dTime:[false],
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
      //  this.disableAllFields = true;
       this.dialogSBUForm.controls['orderType'].disable();
      // this.dialogSBUForm.controls['issueType'].disable();
      // this.dialogSBUForm.controls['category'].disable();
      // this.dialogSBUForm.controls['dTime'].disable();
      // this.dialogSBUForm.controls['type'].disable();
      // this.dialogSBUForm.controls['subtype'].disable();

      this.dialogSBUForm.controls['orderType'].setValue(this.data.rowData.issueTypesDTO.OrderTypeID);
      this.dialogSBUForm.controls['issueType'].setValue(this.data.rowData.issueTypesDTO.IssueType);
      this.dialogSBUForm.controls['issueCode'].setValue(this.data.rowData.issueTypesDTO.IssueCode);
      this.dialogSBUForm.controls['dTime'].setValue(this.data.rowData.issueTypesDTO.DownTime=='1'?true:false);

      this.data.rowData.lissueTypeMappingDTO.forEach(mapping=>{

        if(mapping.CategoryID!=0 && this.categoryIDS.indexOf(mapping.CategoryID) == -1) this.categoryIDS.push(mapping.CategoryID);
        if(mapping.TypeID!=0 &&this.typeIDS.indexOf(mapping.TypeID)==-1) this.typeIDS.push(mapping.TypeID);
        if(mapping.SubTypeID!=0 &&this.subtypeIDS.indexOf(mapping.SubTypeID)==-1) this.subtypeIDS.push(mapping.SubTypeID);
        
        });

    } else if(this.data.task=='view'){
       this.dialogSBUForm.controls['orderType'].disable();
      this.dialogSBUForm.controls['issueType'].disable();
      this.dialogSBUForm.controls['issueCode'].disable();
      this.dialogSBUForm.controls['dTime'].disable();
     

      this.dialogSBUForm.controls['orderType'].setValue(this.data.rowData.issueTypesDTO.OrderTypeID);
      this.dialogSBUForm.controls['issueType'].setValue(this.data.rowData.issueTypesDTO.IssueType);
      this.dialogSBUForm.controls['issueCode'].setValue(this.data.rowData.issueTypesDTO.IssueCode);
      this.dialogSBUForm.controls['dTime'].setValue(this.data.rowData.issueTypesDTO.DownTime=='1'?true:false);
      this.data.rowData.lissueTypeMappingDTO.forEach(mapping=>{

        if(mapping.CategoryID!=0 && this.categoryIDS.indexOf(mapping.CategoryID) == -1) this.categoryIDS.push(mapping.CategoryID);
        if(mapping.TypeID!=0 &&this.typeIDS.indexOf(mapping.TypeID)==-1) this.typeIDS.push(mapping.TypeID);
        if(mapping.SubTypeID!=0 &&this.subtypeIDS.indexOf(mapping.SubTypeID)==-1) this.subtypeIDS.push(mapping.SubTypeID);
        
        });
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
  // this.dialogSBUForm.controls['orderType'].setValue(this.data.rowData['Order Type']);
  // this.dialogSBUForm.controls['issueType'].setValue(this.data.rowData['Issue Type']);
  debugger;
  let dialogData;
  let issueTypeMappings=[];
  let finalData = {
    issueTypesDTO: {
      "IssueCode": this.dialogSBUForm.controls['issueCode'].value,
      "IssueType": this.dialogSBUForm.controls['issueType'].value,
      "OrderTypeID": this.dialogSBUForm.controls['orderType'].value,
      "Class": "OD",
      "DownTime": this.dialogSBUForm.controls['dTime'].value==true?'1':'0',
      // 'IssueTypeID':''
    }
  }
  if(this.data.task=='edit'){
    finalData.issueTypesDTO['IssueTypeID'] = this.data.rowData.issueTypesDTO.IssueTypeID;
  }
  let catgoryIds = [];
 let mappingDTO = [];
 if(this.dialogSBUForm.controls['orderType'].value == '1')
{  
  this.category.forEach(categ=> mappingDTO.push({CategoryID: categ.AssetCategoryId}));
  this.type.forEach(t=>{
    mappingDTO.forEach(mp=>{
      if(mp.CategoryID == t.Id && !mp.TypeID) mp.TypeID = t.TAId;
      else if(mp.CategoryID == t.Id && mp.TypeID!=t.TAId) mappingDTO.push({CategoryID: mp.CategoryID,TypeID: t.TAId});
    });
  });
  this.subtype.forEach(st=>{
    mappingDTO.forEach(mp=>{
      if(mp.TypeID == st.TAId && !mp.SubTypeID) mp.SubTypeID = st.STAId;
      else if(mp.TypeID == st.TAId&&mp.SubTypeID!=st.STAId) mappingDTO.push({CategoryID: mp.CategoryID,TypeID: mp.TypeID,SubTypeID:st.STAId});
    });
  });
}
if(mappingDTO.length==0){
  mappingDTO.push({
    CategoryID:0,
    TypeID:0,
    SubTypeID:0
  })

}
finalData['lissueTypeMappingDTO'] = mappingDTO;
   this.matdialogbox.close(finalData);
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
    debugger;
    this.getFilterCategoryType();
  })
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

//filters
getFilteredCategory(){
  this.filteredCategoryMulti.next(this.categoryData.slice());
  this.dialogSBUForm.controls['categoryMultiFilterCtrl'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
        
      this.filterCategoryMulti();
    });
}

getFilteredType(){
  this.filteredTypeMulti.next(this.categoryData.slice());
  this.dialogSBUForm.controls['typeMultiFilterCtrl'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
        
      this.filterTypeMulti();
    });
}
//filteredTypeMulti
filterTypeMulti(){
  if (!this.categoryData) {
    return;
  }
  let search = this.dialogSBUForm.controls['typeMultiFilterCtrl'].value;
  if (!search) {
    this.filteredTypeMulti.next(this.categoryData.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredTypeMulti.next(
    this.categoryData.filter(x => x.AssetCategoryName.toLowerCase().indexOf(search) > -1)
  );
}

getFilteredSubType(){
  this.filteredSubTypeMulti.next(this.categoryData.slice());
  this.dialogSBUForm.controls['subtypeMultiFilterCtrl'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
        
      this.filterSubTypeMulti();
    });
}


onDelete(){
  debugger;
  this.matdialogbox.close();
}

enableFields(){
  // this.disableAllFields = false;
  // this.dialogSBUForm.controls['orderType'].enable();
  this.dialogSBUForm.controls['issueType'].enable();
  this.dialogSBUForm.controls['category'].enable();
  this.dialogSBUForm.controls['dTime'].enable();
  this.dialogSBUForm.controls['type'].enable();
  this.dialogSBUForm.controls['subtype'].enable();
}

getOrderTypes(){
  this.cmmsService.getOrderTypes().subscribe(res=>{
    debugger; 
    this.orderTyes = JSON.parse(res.Model);
    this.getFilterOrderType()
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
