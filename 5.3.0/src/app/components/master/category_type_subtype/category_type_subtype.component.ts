import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LocalStoreService } from 'app/shared/services/local-store.service';
import { AssetCategoryService } from 'app/components/services/AssetCategoryService';
import { AssetTypeService } from 'app/components/services/AssetTypeService';
import { AssetSubTypeService } from 'app/components/services/AssetSubTypeService';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as headers from '../../../../assets/Headers.json';
import * as resource from '../../../../assets/Resource.json';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { CategoryDialogComponent } from './category_add_edit_dialog/category_add_edit_dialog.component';
import { SubtypeDialogComponent } from './subtype_add_edit_dialog/subtype_add_edit_dialog.component';
import { TypeDialogComponent } from './type_add_edit_dialog/type_add_edit_dialog.component';
import { UserService } from '../../services/UserService';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { CategoryUploadDialogComponent } from './category-upload-dialog/category-upload-dialog.component';
import { TypeUploadDialogComponent } from './type-upload-dialog/type-upload-dialog.component';
import { SubtypeUploadDialogComponent } from './subtype-upload-dialog/subtype-upload-dialog.component';
import * as menuheaders from '../../../../assets/MenuHeaders.json';
import { AllPathService } from 'app/components/services/AllPathServices';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

export interface PeriodicElement {
  name: string;
  type: any[];
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-CategoryTypeSubtype',
  templateUrl: './category_type_subtype.component.html',
  styleUrls: ['./category_type_subtype.component.scss']
})
export class CategoryTypeSubtypeComponent implements OnInit {
   
  header: any;
  message: any = (resource as any).default;

  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  @ViewChild('table', { static: true }) table: any;

  @ViewChild('PaginatorForType', { static: true }) paginatorForType: MatPaginator;
  @ViewChild('SortForType', { static: true }) sortForType: MatSort;
  @ViewChild('TableForType', { static: true }) tableForType: any;

  @ViewChild('PaginatorForSubType', { static: true }) paginatorForSubType: MatPaginator;
  @ViewChild('SortForSubType', { static: true }) sortForSubType: MatSort;
  @ViewChild('TableForSubType', { static: true }) tableForSubType: any;
  menuheader :any =(menuheaders as any).default
  displayedHeaders : any[] = []
  displayedColumns: string[] = ['AssetCategoryName', 'Actions'];

  displayedHeadersT :any [] = []
  displayedColumnsT: string[] = ['TypeOfAsset', 'ActionsT'];

  displayedHeadersS :any []= []
  displayedColumnsS: string[] = ['SubTypeOfAsset', 'ActionsS'];

  dataSource: any;
  categoryData: any;
  updateCategoryDataInsert: any;
  updateCategoryValue: any;
  deleteCategoryOptions: { option: any; data: any; };
  categoryId: any;
  public disabledRegionAdd = true;
  TypeAddDisable: boolean = true;
  SubTypeAddDisable: boolean = true;

  dataSourceT: any;
  assettypeData: any;
  updateTypeDataInsert: any;
  updateTypeValue: any;
  deleteTypeOptions: { option: any; data: any; };
  TypeId: any;

  dataSourceS: any;
  subTypeData: any;
  updateSubTypeDataInsert: any;
  updateSubTypeValue: any;
  deleteSubTypeOptions: { option: any; data: any; };
  LabelForType: any;
  LabelForSubType: any;

  SessionGroupId: any;
  SessionRegionId: any;
  SessionCompanyId: any;
  SessionUserId: any;

  public openCarddata = false;
  public displayedTypes: string[] = ['type', 'gettypedetails'];
  public displayedSubtypes: string[] = ['subtype', 'getsubtypedetails'];
  public data = Object.assign(ELEMENT_DATA);
  //public dataSource = new MatTableDataSource<Element>(this.data);
  public selection = new SelectionModel<Element>(true, []);
  public categorydata;
  public addcategorydata;
  public disableadd = true;
  public disableadd1 = true;
  private myDataArray: any;
  public typeData: any;
  public dataSubtype: any;
  public highlightedRows = [];
  public currentGroupIndex: any;
  public currentCompIndex: any;
  public selectedrows1 = [];
  public selectedrows2 = [];
  public toselect = 0;
  public len = 0;

  constructor(
    private dialog: MatDialog,
    public localService: LocalStoreService,
    public categoryservice: AssetCategoryService,
    public typeservice: AssetTypeService,
    public subTypeservice: AssetSubTypeService,
    public toastr: ToastrService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private storage: ManagerService,
    private router: Router,
    public us: UserService,
    public alertService: MessageAlertService,
    public AllPathService: AllPathService,
    private jwtAuth : JwtAuthService
  ) 
  {
    this.header = this.jwtAuth.getHeaders()

    this.displayedHeaders = [this.header.AssetCategory, this.header.Actions]
    this.displayedHeadersT = [this.header.AssetType, this.header.Actions]
    this.displayedHeadersS = [this.header.AssetSubtype, this.header.Actions]
   }

  ngOnInit(): void {
    this.loader.open();
    this.SessionGroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.SessionRegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.SessionCompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.SessionUserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);

    this.paginator._intl.itemsPerPageLabel = 'Items per page';
    this.paginatorForType._intl.itemsPerPageLabel = 'Items per page';
    this.paginatorForSubType._intl.itemsPerPageLabel = 'Items per page';

    // console.log(this.selectedrows1);
    for (let i = 0; i < this.data.length; i++) {
      this.selectedrows1.push("");
      for (let i = 0; i < this.data[i].type.length; i++) {
        this.selectedrows2.push("");
      }
    }
    this.GetInitiatedData();
    this.GetAllCategory();
    this.loader.close();
  }
  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  GetInitiatedData() {
    let url5 = this.us.PermissionRightsByUserIdAndPageId(this.SessionGroupId, this.SessionUserId, this.SessionCompanyId, this.SessionRegionId, "2,3,4");
    forkJoin([url5]).subscribe(results => {
      if (!!results[0]) {
         
        this.ListOfPagePermission = JSON.parse(results[0]);
        console.log("PagePermission", this.ListOfPagePermission)
        if(this.ListOfPagePermission.length > 0){
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
    })
  }

  //Category
  GetAllCategory() {
     
    this.LabelForType = "";
    this.LabelForSubType = "";
    this.dataSourceT = "";
    this.dataSourceS = "";
    this.TypeAddDisable = true;
    this.SubTypeAddDisable = true;
    var groupId = this.SessionGroupId;
    var regionId = this.SessionRegionId;
    var companyId = this.SessionCompanyId;
    this.categoryservice.GetAllCategoryData(groupId, regionId, companyId).subscribe(response => {

      this.categoryData = response;
      this.onChangeDataSource(response);
    })
  }

  onChangeDataSource(value) {
     
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  AddCategory(result: any) {
    debugger;
    var categoryData = {
      AssetCategoryName: result.assetCategoryName,
      GroupId: this.SessionGroupId,
      RegionId: this.SessionRegionId,
      CompanyId: this.SessionCompanyId
    }
    this.categoryservice.AddCategory(categoryData).subscribe(r => {
      debugger;

      if (r == "Success") {
        this.toastr.success(this.message.CategoryCreated, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.CategoryExits, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetAllCategory();
    })
  }

  GetCategoryByID() {
     
    var Id = "";
    this.categoryservice.CategoryGetById(Id).subscribe(r => {
       
    })
  }

  UpdateCategory(result: any) {
    this.loader.open();
    var categoryData = {
      AssetCategoryId: result.assetCategoryId,
      AssetCategoryName: result.assetCategoryName,
      GroupId: this.SessionGroupId,
      RegionId: this.SessionRegionId,
      CompanyId: this.SessionCompanyId
    }
    this.categoryservice.CategoryUpdate(categoryData).subscribe(r => {
      this.loader.close();
      if (r == "Success") {
        this.toastr.success(this.message.CategoryUpdate, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.CategoryExits, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetAllCategory();
    })
  }

  RemoveCategory(result: any) {
     
    var categoryData = {
      AssetCategoryId: result.data.AssetCategoryId
    }
    this.loader.open();
    this.categoryservice.RemoveCategoryById(categoryData).subscribe(r => {
       
      this.loader.close();
      if (r == "Success") {
        var msg = this.message.CategoryDelete;
        msg = msg.replace('xxxx', result.data.AssetCategoryName); 
        this.toastr.success(msg, this.message.AssetrakSays);
        this.GetAllCategory();
      }
      else if (r == "Exists") {
        var msg = this.message.CategoryDeleteWarning;
        msg = msg.replace('xxxx', result.data.AssetCategoryName); 
        this.toastr.warning(msg, this.message.AssetrakSays);
      }
      else if (r == "Type Exists") {
        var msg = this.message.CategoryDeleteWarning;
        msg = msg.replace('xxxx', result.data.AssetCategoryName); 
        this.toastr.warning(msg, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      
    })
  }
  //EndCategory

  //AssetType
  GetAllTypeData() {
    this.loader.open();
    this.LabelForSubType = "";
    this.dataSourceS = "";
    this.SubTypeAddDisable = true;
    var typeData = {
      CategoryId: this.categoryId,
      GroupId: this.SessionGroupId,
      RegionId: this.SessionRegionId,
      CompanyId: this.SessionCompanyId,
      IsExport: false,
    }

    this.typeservice.GetAllAssetTypeData(typeData).subscribe(response => {
      this.loader.close();
      this.assettypeData = response;
      this.onChangeDataSourceT(response);
    })
  }

  onChangeDataSourceT(value) {
     
    this.dataSourceT = new MatTableDataSource(value);
    this.dataSourceT.paginator = this.paginatorForType;
    this.dataSourceT.sort = this.sortForType;
  }

  applyFilterT(filterValue: string) {
    this.dataSourceT.filter = filterValue.trim().toLowerCase();
  }

  AddType(result: any) {
    var typeData = {
      AssetType: result.assetType,
      CategoryId: this.categoryId,
      GroupId: this.SessionGroupId,
      RegionId: this.SessionRegionId,
      CId: this.SessionCompanyId
    }
    this.typeservice.AddAssetType(typeData).subscribe(r => {
      if (r == "Success") {
        this.toastr.success(this.message.AssetTypeCreated, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.AssetTypeExits, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetAllTypeData();
    })
  }

  GetTypeByID() {
     
    var Id = "";
    this.typeservice.AssetTypeGetById(Id).subscribe(r => {
       
    })
  }

  UpdateType(result: any) {
    this.loader.open();
    var typeData = {
      TAId: result.taId,
      AssetType: result.assetType,
      CategoryId: this.categoryId,
      GroupId: this.SessionGroupId,
      RegionId: this.SessionRegionId,
      CId: this.SessionCompanyId
    }
    this.typeservice.AssetTypeUpdate(typeData).subscribe(r => {
      this.loader.close();
      if (r == "Success") {
        this.toastr.success(this.message.AssetTypeUpdate, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.AssetTypeExits, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetAllTypeData();
    })
  }

  RemoveType(result: any) {
     
    var typeData = {
      TAId: result.data.TAId,
    }
    this.loader.open();
    this.typeservice.RemoveAssetTypeById(typeData).subscribe(r => {
       
      this.loader.close();
      if (r == "Success") {
        var msg = this.message.AssetTypeDelete;
        msg = msg.replace('xxxx', result.data.TypeOfAsset); 
        this.toastr.success(msg, this.message.AssetrakSays);
        this.GetAllTypeData();
      }
      else if (r == "Exists") {
        var msg = this.message.AssetTypeDeleteWarning;
        msg = msg.replace('xxxx', result.data.TypeOfAsset); 
        this.toastr.warning(msg, this.message.AssetrakSays);
        //this.toastr.warning(this.message.AssetTypeDeleteWarningAssetAvailable, this.message.AssetrakSays);
      }
      else if (r == "SubType Exists") {
        var msg = this.message.AssetTypeDeleteWarning;
        msg = msg.replace('xxxx', result.data.TypeOfAsset); 
        this.toastr.warning(msg, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }      
    })
  }
  //EndAssetType

  //AssetSubType
  GetAllSubTypeByCategoryIdTypeId() {
    this.loader.open();
    var subTypeData = {
      GroupId: this.SessionGroupId,
      RegionId: this.SessionRegionId,
      CId: this.SessionCompanyId,
      TypeId: this.TypeId
    }

    this.subTypeservice.GetAllSubTypeData(subTypeData).subscribe(response => {
      this.loader.close();
      this.subTypeData = response;
      this.onChangeDataSourceS(response);
    })
  }

  onChangeDataSourceS(value) {
     
    this.dataSourceS = new MatTableDataSource(value);
    this.dataSourceS.paginator = this.paginatorForSubType;
    this.dataSourceS.sort = this.sortForSubType;
  }

  applyFilterS(filterValue: string) {
    this.dataSourceS.filter = filterValue.trim().toLowerCase();
  }

  AddSubType(result: any) {
    var subTypeData = {
      subTypeOfAsset: result.SubTypeOfAsset,
      TAId: this.TypeId,
      GroupId: this.SessionGroupId,
      RegionId: this.SessionRegionId,
      CId: this.SessionCompanyId,
    }
    this.subTypeservice.AddSubType(subTypeData).subscribe(r => {
      if (r == "Success") {
        this.toastr.success(this.message.AssetSubTypeCreated, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.AssetSubTypeExits, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetAllSubTypeByCategoryIdTypeId();
    })
  }

  GetSubTypeByID() {
     
    var Id = "";
    this.subTypeservice.SubTypeGetById(Id).subscribe(r => {
       
    })
  }

  UpdateSubType(result: any) {
    this.loader.open();
    var subTypeData = {
      GroupId: this.SessionGroupId,
      RegionId: this.SessionRegionId,
      CId: this.SessionCompanyId,
      subTypeOfAsset: result.SubTypeOfAsset,
      TAId: this.TypeId,
      STAId: result.sTAId
    }
    this.subTypeservice.SubTypeUpdate(subTypeData).subscribe(r => {
      this.loader.close();
      if (r == "Success") {
        this.toastr.success(this.message.AssetSubTypeUpdate, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.AssetSubTypeExits, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetAllSubTypeByCategoryIdTypeId();
    })
  }

  RemoveSubType(result: any) {
     
    var subTypeData = {
      STAId: result.data.STAId,
      TAId: this.TypeId,
    }
    this.loader.open();
    this.subTypeservice.RemoveSubTypeById(subTypeData).subscribe(r => {
       
      this.loader.close();
      if (r == "Success") {
        var msg = this.message.AssetSubTypeDelete;
        msg = msg.replace('xxxx', result.data.SubTypeOfAsset); 
        this.toastr.success(msg, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        var msg = this.message.AssetSubTypeDeleteWarning;
        msg = msg.replace('xxxx', result.data.SubTypeOfAsset); 
        this.toastr.warning(msg, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetAllSubTypeByCategoryIdTypeId();
    })
  }

  //EndSubType


  public openAddCategory(selecttype) {
    const dialogconfigcom1 = new MatDialogConfig();
   // dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = "40%";
     
    this.localService.setItem('settype', selecttype);
    const modalService = this.dialog.open(CategoryDialogComponent, dialogconfigcom1);
     
    modalService.afterClosed().subscribe((res) => {
      let addedcategory = this.localService.getItem('addcategorydata');
      //this.data.push(this.addedcategory);
      this.dataSource = new MatTableDataSource<Element>(this.data);


      if (addedcategory) {
        if (addedcategory.type == 'category') {
          let tempObject1 = {
            name: addedcategory.name,
            type: []
          }
          this.data.push(tempObject1);
        } else if (addedcategory.type == 'type') {
          let tempObject = {
            name: addedcategory.name,
            comp: []
          }
          this.data[this.currentGroupIndex].type.push(tempObject);
          this.typeData = new MatTableDataSource<Element>(this.data[this.currentGroupIndex].type);

        } else if (addedcategory.type == 'subtype') {
          this.data[this.currentGroupIndex].type[this.currentCompIndex].comp.push(addedcategory.name);
          this.dataSubtype = new MatTableDataSource<Element>(this.data[this.currentGroupIndex].type[this.currentCompIndex].comp);
        }
        this.dataSource = new MatTableDataSource<Element>(this.data);
        console.log(this.data);
      }
    })
  }

  public openEditDialog(element, rowid: number, selectedtype) {
    //console.log(element, rowid, type)
     
    const dialogconfigcom = new MatDialogConfig();
    let name = String;
    if (selectedtype == 'subtype') {
      name = element;
    } else {
      name = element.name;
    }
    let payloadObject = {
      index: rowid,
      name: name,
      type: selectedtype
    }
  //  dialogconfigcom.disableClose = true;
    dialogconfigcom.autoFocus = true;
    dialogconfigcom.width = "40%";
     
    this.categorydata = payloadObject;
    this.localService.setItem("selectedgrp", this.categorydata);
    const modalService = this.dialog.open(CategoryDialogComponent, dialogconfigcom);

    modalService.afterClosed().subscribe((res) => {
      let changedName = this.localService.getItem('selectedcategory');
      if (changedName) {
        if (selectedtype == 'category') {
          this.data[changedName.index].name = changedName.name;
        } else if (selectedtype == 'type') {
          this.data[this.currentGroupIndex].type[changedName.index].name = changedName.name;
        } else if (selectedtype == 'subtype') {
          this.data[this.currentGroupIndex].type[this.currentCompIndex].comp[changedName.index] = changedName.name;
        }
        this.dataSource = new MatTableDataSource<Element>(this.data);
      }
    })
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
    this.len = this.toselect * (this.data[this.toselect].type.length);
    for (let j = 0; j < this.selectedrows2.length; j++) {
      this.selectedrows2[this.len + i] = "true";
      if (this.selectedrows2[j] === 'true') {
        if ((this.len + i) != j) {
          this.selectedrows2[j] = "";
        }
      }
    }
    console.log(this.len);
    console.log(this.data[this.toselect].type.length);
    console.log(this.selectedrows2);
  }

  public deleteCategory(rowid: number) {
    this.dataSource.data.splice(rowid, 1);
    this.dataSource = new MatTableDataSource<Element>(this.dataSource.data);
    this.typeData = [];
    this.dataSubtype = [];
  }

  public deletetype(typeId: number) {
    this.data[this.currentGroupIndex].type.splice(typeId, 1);
    this.dataSource = new MatTableDataSource<Element>(this.data);
    this.typeData = new MatTableDataSource<Element>(this.data[this.currentGroupIndex].type);
    console.log(this.typeData);
    this.dataSubtype = [];
  }

  public deleteSubtype(compId: number) {
    this.data[this.currentGroupIndex].type[this.currentCompIndex].comp.splice(compId, 1);
    this.dataSource = new MatTableDataSource<Element>(this.data);
    this.dataSubtype = new MatTableDataSource<Element>(this.data[this.currentGroupIndex].type[this.currentCompIndex].comp);
    // console.log(this.dataCompany);
  }

  public showNextData(currentData, index) {
    this.dataSubtype = [];
    this.disableadd1 = true;
    console.log(currentData, 'current data');
    this.typeData = currentData.type;
    this.disableadd = false;
    this.currentGroupIndex = index;
  }

  public showNextsubtypeData(currentData1, index1) {
    this.dataSubtype = currentData1.comp;
    this.disableadd1 = false;
    console.log(currentData1, 'current compdata');
    this.currentCompIndex = index1;
  }




  deleteCategoryData(...vars) {
    this.deleteCategoryOptions = {
      option: vars[0],
      data: vars[1]

    }
     
    this.confirmService.confirm({ message: this.message.AssetTypeDeleteNotification , title: this.message.AssetrakSays })
      .subscribe(res => {
        if (!!res) {          
          this.RemoveCategory(this.deleteCategoryOptions);         
        }
      })

  }

  deleteType(...vars) {
    this.deleteTypeOptions = {
      option: vars[0],
      data: vars[1]

    }
     
    this.confirmService.confirm({ message: this.message.CategoryDeleteNotification, title: this.message.AssetrakSays })
      .subscribe(res => {
        if (!!res) {          
          this.RemoveType(this.deleteTypeOptions);         
        }
      })

  }

  deleteSubType(...vars) {
    this.deleteSubTypeOptions = {
      option: vars[0],
      data: vars[1]

    }
     
    this.confirmService.confirm({ message: this.message.SubCategoryDeleteNotification, title: this.message.AssetrakSays })
      .subscribe(res => {
        if (!!res) {         
          this.RemoveSubType(this.deleteSubTypeOptions);         
        }
      })
  }


  openDialog(...getValue): void {
     
    var component: any
    if (getValue[0] === 'upload') {
      //component=UploadRegionPopUpComponent
    }
    else {
      component = CategoryDialogComponent;
    }
    const dialogRef = this.dialog.open(component, {
      panelClass: 'Category-form-dialog',
    
      data: {
        component1: 'CategoryComponent',
        value: getValue[0],
        name: getValue[1],
      },
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result && getValue[0] === 'edit') {
         
        this.updateCategoryValue = result;
        this.updateCategoryValue['assetCategoryId'] = getValue[1].AssetCategoryId;

        this.UpdateCategory(this.updateCategoryValue)
      }
      else if (result && getValue[0] === 'insert') {
         
        this.updateCategoryDataInsert = result;
        this.loader.open();
        this.AddCategory(this.updateCategoryDataInsert)
        this.loader.close();
      }

    });
  }
  selectedRowIndex : any ;
  //Type
  public GetCategoryId(currentData, index) {
     
    this.selectedRowIndex = currentData.AssetCategoryName ;
    this.selectedRowIndex1 = -1 ;
    currentData.selected = true ;
    this.LabelForType = "";
    this.LabelForSubType = "";
    this.LabelForType = currentData.AssetCategoryName;
    this.dataSourceT = "";
    this.dataSourceS = "";
    this.TypeId ="";
    // this.paginator.pageIndex = 0;
    //this.paginatorForRegion.pageIndex=0;
    this.categoryId = currentData.AssetCategoryId;
    this.disabledRegionAdd = false;
    this.TypeAddDisable = false;
    this.GetAllTypeData();
  }

  openDialogT(...getValue): void {
     
    var component: any
    if (getValue[0] === 'upload') {
      //component=UploadDialogComponent
    }
    else {
      component = TypeDialogComponent;
    }
    const dialogRef = this.dialog.open(component, {
      panelClass: 'Category-form-dialog',
     
      data: {
        component1: 'TypeComponent',
        value: getValue[0],
        name: getValue[1],
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && getValue[0] === 'edit') {
         
        this.updateTypeValue = result;
        this.updateTypeValue['taId'] = getValue[1].TAId;

        this.UpdateType(this.updateTypeValue)
      }
      else if (result && getValue[0] === 'insert') {
         
        this.updateTypeDataInsert = result;
        this.AddType(this.updateTypeDataInsert)
      }

    });
  }


  selectedRowIndex1 : any;
  //SubType
  public GetTypeId(currentData, index) {
     
    this.selectedRowIndex1 = currentData.TypeOfAsset;
    this.LabelForSubType = currentData.TypeOfAsset;
    this.TypeId = currentData.TAId;
    this.SubTypeAddDisable = false;
    this.GetAllSubTypeByCategoryIdTypeId();
  }

  openDialogS(...getValue): void {
     
    var component: any
    if (getValue[0] === 'upload') {
      //component=UploadDialogComponent
    }
    else {
      component = SubtypeDialogComponent;
    }
    const dialogRef = this.dialog.open(component, {
      panelClass: 'Category-form-dialog',
     
      data: {
        component1: 'SubTypeComponent',
        value: getValue[0],
        name: getValue[1],
      },
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result && getValue[0] === 'edit') {
         
        this.updateSubTypeValue = result;
        this.updateSubTypeValue['sTAId'] = getValue[1].STAId;

        this.UpdateSubType(this.updateSubTypeValue)
      }
      else if (result && getValue[0] === 'insert') {
         
        this.updateSubTypeDataInsert = result;
        this.AddSubType(this.updateSubTypeDataInsert)
      }

    });
  }

  // Upload Category Dialog
  openUploadAssetCategory(): void {
     
    const dialogconfigcom1 = new MatDialogConfig();
    //dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = "50%";
    const modalService = this.dialog.open(CategoryUploadDialogComponent, dialogconfigcom1);
    modalService.afterClosed().subscribe((res) => {
      if (res) {
        this.loader.open();
        var uploadedFileInfo = {
          FileName: res,
          GroupID: this.SessionGroupId,
          RegionId: this.SessionRegionId,
          CompanyID: this.SessionCompanyId
        }
        this.categoryservice.UploadCategory(uploadedFileInfo).subscribe(r => {
           
          this.loader.close();
            if(r[0] == "Success")
            {
              this.toastr.success(this.message.TypeOfAssetUpload, this.message.AssetrakSays);
            } 
            else if(r[0] == "Incorrect File template")
            {
              this.toastr.error(this.message.FileFormatIncorrect, this.message.AssetrakSays);
            }
            else if (r[0] != null) {
              var msg = r[0].replaceAll('Asset Type', this.header.AssetCategory); 
              this.toastr.warning(msg, this.message.AssetrakSays);
            }          
            else if(r[0] == null)
            {
              this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
            }
            this.GetAllCategory();
        })
      }
    });
  }


  // Upload Type Dialog
  openUploadAssetType(): void {
     
    const dialogconfigcom1 = new MatDialogConfig();
  //  dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = "50%";
    const modalService = this.dialog.open(TypeUploadDialogComponent, dialogconfigcom1);
    modalService.afterClosed().subscribe((res) => {
      if (res) {
        this.loader.open();
        var uploadedFileInfo = {
          FileName: res,
          GroupID: this.SessionGroupId,
          RegionId: this.SessionRegionId,
          CompanyID: this.SessionCompanyId,
          AssetCategoryId: this.categoryId
        }
        this.typeservice.UploadAssetType(uploadedFileInfo).subscribe(r => {
           
          this.loader.close();
            if(r[0] == "Success")
            {
              this.toastr.success(this.message.CategoryUpload, this.message.AssetrakSays);
            } 
            else if(r[0] == "Incorrect File template")
            {
              this.toastr.error(this.message.FileFormatIncorrect, this.message.AssetrakSays);
            }
            else if (r[0] != null) {
              var msg = r[0].replaceAll('Category', this.header.AssetType); 
              this.toastr.warning(msg, this.message.AssetrakSays);
            }          
            else if(r[0] == null)
            {
              this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
            }
            this.GetAllTypeData();
        })
      }
    });
  }

  // Upload Sub-Type Dialog
  openUploadAssetSubType(): void {
     
    const dialogconfigcom1 = new MatDialogConfig();
   // dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = "50%";
    const modalService = this.dialog.open(SubtypeUploadDialogComponent, dialogconfigcom1);
    modalService.afterClosed().subscribe((res) => {
      if (res) {
        this.loader.open();
        var uploadedFileInfo = {
          FileName: res,
          GroupID: this.SessionGroupId,
          RegionId: this.SessionRegionId,
          CompanyID: this.SessionCompanyId,
          TAID : this.TypeId
        }
        this.subTypeservice.UploadSubType(uploadedFileInfo).subscribe(r => {
           
          this.loader.close();
          if(r[0] == "Success")
            {
              this.toastr.success(this.message.SubCategoryUpload, this.message.AssetrakSays);
            } 
            else if(r[0] == "Incorrect File template")
            {
              this.toastr.error(this.message.FileFormatIncorrect, this.message.AssetrakSays);
            }
            else if (r[0] != null) {
              var msg = r[0].replaceAll('Sub Category', this.header.AssetSubtype); 
              this.toastr.warning(msg, this.message.AssetrakSays);
            }          
            else if(r[0] == null)
            {
              this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
            }
            this.GetAllSubTypeByCategoryIdTypeId();
        })
      }
    });
  }

  exportAssetTypeFile()
  {
    this.loader.open();
    this.LabelForSubType = "";
    this.dataSourceS = "";
    this.SubTypeAddDisable = true;
    var typeData = {
      CategoryId: this.categoryId,
      GroupId: this.SessionGroupId,
      RegionId: this.SessionRegionId,
      CompanyId: this.SessionCompanyId,
      IsExport: true,
    }
    this.typeservice.ExportAssetType(typeData).subscribe(response => {
      this.loader.close();
       this.AllPathService.DownloadExportFile(response);
        console.log("URL", URL);
    })
  }

  exportSubTypeOfAssetFile()
  {
    debugger;
    var subTypeData = {
      GroupId: this.SessionGroupId,
      RegionId: this.SessionRegionId,
      CompanyId: this.SessionCompanyId,
      TypeId: this.TypeId,
      CategoryId: this.categoryId,
      IsExport : true
    }

    this.subTypeservice.ExportSubType(subTypeData).subscribe(response => {
      this.loader.close();
      this.AllPathService.DownloadExportFile(response);
        console.log("URL", URL);
    })
  }
}
