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
@Component({
  selector: 'app-add-edit-configuration',
  templateUrl: './add-edit-configuration.component.html',
  styleUrls: ['./add-edit-configuration.component.scss']
})
export class AddEditConfigurationComponent implements OnInit {

  protected _onDestroy = new Subject<void>();
  orderTyes: any[] = ['Equipment','Location','Vehicle'];
  exceptionTypes: any[] = ["Auto","Manual"];
  issueTypes: any[] = ['Mac not working','Windows corrupted','Joystick button not working','Mouse scroll buton not working',
  'AC not working'];
  categories: any[] = ['a category','b category','c category','d category','e category','f category'];
  types: any[] = ['a type','b type','c type','d type','e type','f type'];
  subTypes: any[] = ['a subType','b subType','c subType','d subType','e subType','f subType'];
  header:any = (headers as any).default;
  submitted: boolean = false;
  disableAllFields:Boolean = false;
  public sbunm: any;
  dialogSBUForm: FormGroup;
  public filteredCategoryMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);4
  public filteredSubTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  SessionGroupId: any;
  SessionRegionId: any;
  SessionCompanyId: any;
  SessionUserId: any;
  categoryData: any;
  allCategorySelected: Boolean = false;
  allTypesSelected: Boolean = false;
  allSubTypesSelected: Boolean = false;
  assettypeData: any;
  subTypeData: any;
  get f1() { return this.dialogSBUForm.controls; };

  constructor(public matdialogbox: MatDialogRef<AddEditConfigurationComponent>,public localService: LocalStoreService, @Inject(MAT_DIALOG_DATA) public data:any,
  private storage: ManagerService,public categoryservice: AssetCategoryService,
      public typeservice: AssetTypeService,public subTypeservice: AssetSubTypeService,
  private fb: FormBuilder,   
) { }

  ngOnInit(){
    this.SessionGroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.SessionRegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.SessionCompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.SessionUserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
      debugger;
      this.dialogSBUForm = this.fb.group({
        exceptionType: [''],
        orderType: [''],
        issueType : [''],
        dTime:[''],
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
      //  this.dialogSBUForm.controls['exceptionType'].disable();
      // this.dialogSBUForm.controls['issueType'].disable();
      // this.dialogSBUForm.controls['category'].disable();
      // this.dialogSBUForm.controls['dTime'].disable();
      // this.dialogSBUForm.controls['type'].disable();
      // this.dialogSBUForm.controls['subtype'].disable();
      this.dialogSBUForm.controls['exceptionType'].setValue(this.data.rowData['Exception Type']);
      this.dialogSBUForm.controls['orderType'].setValue(this.data.rowData['Order Type']);
      this.dialogSBUForm.controls['issueType'].setValue([this.data.rowData['Issue Type']]);
      this.dialogSBUForm.controls['category'].setValue(['163','361']);
      this.dialogSBUForm.controls['type'].setValue(['163','361']);
      this.dialogSBUForm.controls['subtype'].setValue(['163','361']);

    } else if(this.data.task=='view'){
      // this.disableAllFields = true;
      this.dialogSBUForm.controls['exceptionType'].disable();
      this.dialogSBUForm.controls['orderType'].disable();
      this.dialogSBUForm.controls['issueType'].disable();
      this.dialogSBUForm.controls['category'].disable();
      this.dialogSBUForm.controls['dTime'].disable();
      this.dialogSBUForm.controls['type'].disable();
      this.dialogSBUForm.controls['subtype'].disable();

      this.dialogSBUForm.controls['exceptionType'].setValue(this.data.rowData['Exception Type']);
      this.dialogSBUForm.controls['orderType'].setValue(this.data.rowData['Order Type']);
      this.dialogSBUForm.controls['issueType'].setValue([this.data.rowData['Issue Type']]);
      this.dialogSBUForm.controls['category'].setValue(['163','361']);
      this.dialogSBUForm.controls['type'].setValue(['163','361']);
      this.dialogSBUForm.controls['subtype'].setValue(['163','361']);
    } else if(this.data.task=='add'){
      this.dialogSBUForm.controls['exceptionType'].disable();
    }

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
  let dialogData = {
     'Order Type':  this.dialogSBUForm.controls['orderType'].value,
     'Issue Type': this.dialogSBUForm.controls['issueType'].value
  }
  this.matdialogbox.close(dialogData);
}

GetAllCategory() {
  var groupId = this.SessionGroupId;
  var regionId = this.SessionRegionId;
  var companyId = this.SessionCompanyId;
  this.categoryservice.GetAllCategoryData(groupId, regionId, companyId).subscribe(response => {
    this.categoryData = response;
    this.getFilteredCategory();
    this.getFilteredType();
    this.getFilteredSubType();
  })
}

getCategoryId(){
  this.GetAllTypeData(this.dialogSBUForm.value.category);
}

GetAllTypeData(categoryId: any) {

  // var typeData = {
  //   CategoryId: categoryId,
  //   GroupId: this.SessionGroupId,
  //   RegionId: this.SessionRegionId,
  //   CompanyId: this.SessionCompanyId,
  //   IsExport: false,
  // }

  // this.typeservice.GetAllAssetTypeData(typeData).subscribe(response => {
  
  //   this.assettypeData = response;
  // })
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

//filters
getFilteredCategory(){
  this.filteredCategoryMulti.next(this.categoryData.slice());
  this.dialogSBUForm.controls['categoryMultiFilterCtrl'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
        
      this.filterCategoryMulti();
    });
}
//filteredTypeMulti
filterCategoryMulti(){
  if (!this.categoryData) {
    return;
  }
  let search = this.dialogSBUForm.controls['categoryMultiFilterCtrl'].value;
  if (!search) {
    this.filteredCategoryMulti.next(this.categoryData.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredCategoryMulti.next(
    this.categoryData.filter(x => x.AssetCategoryName.toLowerCase().indexOf(search) > -1)
  );
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
//filteredTypeMulti
filterSubTypeMulti(){
  if (!this.categoryData) {
    return;
  }
  let search = this.dialogSBUForm.controls['subtypeMultiFilterCtrl'].value;
  if (!search) {
    this.filteredSubTypeMulti.next(this.categoryData.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredSubTypeMulti.next(
    this.categoryData.filter(x => x.AssetCategoryName.toLowerCase().indexOf(search) > -1)
  );
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

}
