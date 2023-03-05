import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LocalStoreService } from 'app/shared/services/local-store.service';
import { GroupService } from 'app/components/services/GroupService';
import { CompanyService } from 'app/components/services/CompanyService';
import { RegionService } from 'app/components/services/RegionService';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as headers from '../../../../assets/Headers.json';
import * as resource from '../../../../assets/Resource.json';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Group_dialogComponent } from './group_add_edit_dialog/group_dialog.component';
import { RegionDialogComponent } from './region_add_edit_dialog/region_dialog.component';
import { CompanyDialogComponent } from './company_add_edit_dialog/company_dialog.component';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/UserService';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';


export interface PeriodicElement {
  name: string;
  region: any[];
}
const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'group_comp',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
   
  header: any ;
  message: any = (resource as any).default;
  SessionGroupId: any;
  SessionRegionId: any;
  SessionCompanyId: any;
  SessionUserId: any;

  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  @ViewChild('table', { static: true }) table: any;

  @ViewChild('PaginatorForRegion', { static: true }) paginatorForRegion: MatPaginator;
  @ViewChild('SortForRegion', { static: true }) sortForRegion: MatSort;
  @ViewChild('TableForRegion', { static: true }) tableForRegion: any;

  @ViewChild('PaginatorForCompany', { static: true }) paginatorForCompany: MatPaginator;
  @ViewChild('SortForCompany', { static: true }) sortForCompany: MatSort;
  @ViewChild('TableForCompany', { static: true }) tableForCompany: any;

  displayedHeaders:any [] = []

  displayedColumns: string[] = ['GroupName', 'Currency', 'Actions'];

  displayedHeadersR : any = []

  displayedColumnsR: string[] = ['RegionName', 'RegionCurrency', 'ActionsR'];

  displayedHeadersC :any []= []

  displayedColumnsC: string[] = ['CompanyName', 'BaseCurrency', 'ActionsC'];

  loadingTime = 3000;

  dataSource: any;
  groupData: any;
  updateGroupDataInsert: any;
  updateGroupValue: any;
  deleteGroupOptions: { option: any; data: any; };
  CompanyId: any;
  GroupId: any;
  UserId: any;
  RegionId: any;
  ProfileId: any;
  public disabledRegionAdd = true;
  RegionAddDisable: boolean = true;
  CompanyAddDisable: boolean = true;

  dataSourceR: any;
  regionData: any;
  updateRegionDataInsert: any;
  updateRegionValue: any;
  deleteRegionOptions: { option: any; data: any; };
  
  dataSourceC: any;
  companyData: any;
  updateCompanyDataInsert: any;
  updateCompanyValue: any;
  deleteCompanyOptions: { option: any; data: any; };
  LabelForRegion: any;
  LabelForCompany: any;


  public openCarddata = false;
  public displayedRegions: string[] = ['region', 'getregdetails'];
  public displayedCompanies: string[] = ['company', 'getregdetails'];
  public data = Object.assign(ELEMENT_DATA);
  //public dataSource = new MatTableDataSource<Element>(this.data);
  public selection = new SelectionModel<Element>(true, []);
  public grpdata;
  public addgrpdata;
  public disableadd = true;
  public disableadd1 = true;
  private myDataArray: any;
  public regionalData: any;
  public dataCompany: any;
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
    public groupservice: GroupService,
    public companyservice: CompanyService,
    public regionservice: RegionService,
    public toastr: ToastrService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private router: Router,
    public alertService: MessageAlertService,
    private storage: ManagerService,
    public us: UserService, private jwtAuth :JwtAuthService) 
    {
      this.header = this.jwtAuth.getHeaders()
      
      this.displayedHeaders = [this.header.Group, this.header.EmailId, this.header.Currency, this.header.GroupCode, this.header.Actions]
      this.displayedHeadersR = [this.header.RegionName, this.header.RegionRegNo, this.header.RegionAddress, this.header.RegionCode, this.header.Currency, this.header.Actions]
       this.displayedHeadersC = [this.header.CompanyName, this.header.CompanyRegNo, this.header.RegionAddress, this.header.CompanyCode, this.header.Currency, this.header.Actions]
     }

  ngOnInit(): void {
     
    this.paginator._intl.itemsPerPageLabel = 'Records per page';
    this.paginatorForRegion._intl.itemsPerPageLabel = 'Records per page';
    this.paginatorForCompany._intl.itemsPerPageLabel = 'Records per page';

    this.SessionGroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID) ;
    this.SessionRegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.SessionCompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.SessionUserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    this.ProfileId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_PROFILE);

    for (let i = 0; i < this.data.length; i++) {
      this.selectedrows1.push("");
      for (let i = 0; i < this.data[i].region.length; i++) {
        this.selectedrows2.push("");
      }
    }
    this.GetInitiatedData();
    this.GetAllGroup();
  }
  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  GetInitiatedData() {
     
    if(this.ProfileId == '0')
    {      
      let url5 = this.us.PermissionRightsByUserIdAndPageId(this.SessionGroupId, this.SessionUserId, this.SessionCompanyId, this.SessionRegionId, "9,10,11");
      forkJoin([url5]).subscribe(results => {
         
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
  
      })
    }
    else{
      this.PermissionIdList = [14]
    }
    
  }

  //Group
  GetAllGroup() {
     
    this.LabelForRegion = "";
    this.LabelForCompany = "";
    this.dataSourceC = "";
    this.dataSourceR = "";
    this.RegionAddDisable = true;
    this.CompanyAddDisable = true;
    if(this.ProfileId == '0'){var id = !!this.SessionGroupId ? this.SessionGroupId: 0;}
    else{ id = 0;}
    
    this.groupservice.GetAllGroupData(id).subscribe(response => {
       
      this.groupData = response;
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

  AddGroup(result: any) {
     
    var groupData = {
      GroupName: result.groupname,
      CurrencyId: result.currencyId,
      GroupCode: result.groupCode,
      EmployeeId: result.employeeId,
      EmployeeEmail: result.employeeEmail,
      FirstName: result.firstName,
      LastName: result.lastName,
      ContactNo: result.contactNo,
    }
    this.groupservice.AddGroup(groupData).subscribe(r => {
       
      if (r == "Success") {
        this.toastr.success(this.message.GroupCreated, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.GroupExits, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      else if (r == "Employee Exists") {
        this.toastr.error(this.message.EmployeeAlreadyExist, this.message.AssetrakSays);
      }

      this.GetAllGroup();
    })
  }

  GetGroupByID() {
     
    var Id = "";
    this.groupservice.GroupGetById(Id).subscribe(r => {
       
    })
  }

  UpdateGroup(result: any) {
     
    var groupData = {
      GroupId: result.GroupId,
      GroupName: result.groupname,
      emailId: result.emailId,
      CurrencyId: result.currencyId,
      GroupCode: result.groupCode
    }
    this.groupservice.GroupUpdate(groupData).subscribe(r => {
       
      if (r == "Success") {
        this.toastr.success(this.message.GroupUpdate, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.GroupExits, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetAllGroup();
    })
  }

  RemoveGroup(result: any) {
     
    this.loader.open();

    var groupData = {
      GroupId: result.data.GroupId,
      CreatedBy: null,
      Currency: null,
      CurrencyId: 0,
      GroupName: result.data.GroupName,
      IsActive: true,
      emailId: null,
      password: null
    }
    this.groupservice.RemoveGroupById(groupData).subscribe(r => {
       
      this.loader.close();
      if (r == "Success") {
        this.toastr.success(this.message.GroupDelete, this.message.AssetrakSays);
        this.GetAllGroup();
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.GroupDeleteWarning, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      
    })
  }
  //EndGroup

  //Region
  GetAllRegionByGroupId() {
     
    this.LabelForCompany = "";
    this.dataSourceC = "";
    this.CompanyAddDisable = true;
    var Id = this.GroupId;
    this.regionservice.GetAllRegionData(Id).subscribe(response => {
       
      this.regionData = response;
      if(!!response && response != 'null')
      {
        this.onChangeDataSourceR(response);
      }
    })
  }

  onChangeDataSourceR(value) {
     
    this.dataSourceR = new MatTableDataSource(value);
    this.dataSourceR.paginator = this.paginatorForRegion;
    this.dataSourceR.sort = this.sortForRegion;
  }

  applyFilterR(filterValue: string) {
    this.dataSourceR.filter = filterValue.trim().toLowerCase();
  }

  AddRegion(result: any) {
     
    var regionData = {
      RegionName: result.regionName,
      Address1: result.address1,
      Address2: result.address2,
      RegionCode: result.regionCode,
      GroupId: result.GroupId,
      ContactNo: result.contactNo,
      FaxNo: result.faxNo,
      RegionCurrencyid: result.regionCurrencyid,
      EmployeeTableId: result.employeeTableid,
    }
    this.regionservice.AddRegion(regionData).subscribe(r => {
       
      if (r == "Success") {
        this.toastr.success(this.message.RegionCreated, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.RegionExits, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      else if (r == "Employee not Exists") {
        this.toastr.error(this.message.EmployeeEmailOutOfMaster, this.message.AssetrakSays);
      }
      this.GetAllRegionByGroupId();
    })
  }

  GetRegionByID() {
     
    var Id = "";
    this.regionservice.RegionGetById(Id).subscribe(r => {
       
    })
  }

  UpdateRegion(result: any) {
     
    var regionData = {
      RegionId: result.RegionId,
      RegionName: result.regionName,
      // RegionRegNo: result.regionRegNo,
      Address1: result.address1,
      Address2: result.address2,
      IsActive: true,
      // RegionLogo:"",
      RegionCode: result.regionCode,
      GroupId: this.GroupId,
      ContactNo: result.contactNo,
      FaxNo: result.faxNo,
      RegionCurrencyid: result.regionCurrencyid
    }
    this.regionservice.RegionUpdate(regionData).subscribe(r => {
       
      if (r == "Success") {
        this.toastr.success(this.message.RegionUpdate, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.RegionExits, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetAllRegionByGroupId();
    })
  }

  RemoveRegion(result: any) {
     
    var regionData = {
      RegionId: result.data.RegionId,
    }
    this.regionservice.RemoveRegionById(regionData).subscribe(r => {
       
      if (r == "Success") {
        this.toastr.success(this.message.RegionDeleted, this.message.AssetrakSays);
        this.GetAllRegionByGroupId();
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.RegionDeleteWarning, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      
    })
  }
  //EndRegion

  //Company
  GetAllCompanyByGroupIdRegionId() {
     
    var GId = this.GroupId;
    var RId = this.RegionId;
    this.companyservice.GetAllCompanyData(GId, RId).subscribe(response => {
       
      this.companyData = response;
      this.onChangeDataSourceC(response);
    })
  }

  onChangeDataSourceC(value) {
     
    this.dataSourceC = new MatTableDataSource(value);
    this.dataSourceC.paginator = this.paginatorForCompany;
    this.dataSourceC.sort = this.sortForCompany;
  }

  applyFilterC(filterValue: string) {
    this.dataSourceC.filter = filterValue.trim().toLowerCase();
  }

  AddCompany(result: any) {
     
    var companyData = {
      CompanyName: result.companyName,
      CompanyRegNo: result.companyRegNo,
      Address1: result.address1,
      Address2: result.address2,
      City: result.city,
      Country: result.country,
      State: result.state,
      CompanyCode: result.companyCode,
      GroupId: result.GroupId,
      RegionId: result.RegionId,
      ContactNo: result.contactNo,
      FaxNo: result.faxNo,
      ZipCode: result.zipCode,
      CurrencyId: result.currencyId,
      EmployeeTableId: result.employeeTableid,

    }
    this.companyservice.AddComapny(companyData).subscribe(r => {
       
      if (r == "Success") {
        this.toastr.success(this.message.CompanyCreatedSuccess, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.CompanyAlreadyexist, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      else if (r == "Employee not Exists") {
        this.toastr.error(this.message.EmployeeEmailOutOfMaster, this.message.AssetrakSays);
      }
      this.GetAllCompanyByGroupIdRegionId();
    })
  }

  GetCompanyByID() {
     
    var Id = "";
    this.companyservice.CompanyGetById(Id).subscribe(r => {
       
    })
  }

  UpdateCompany(result: any) {
     debugger;
    var companyData = {
      CompanyId: result.CompanyId,
      CompanyName: result.companyName,
      CompanyRegNo: result.companyRegNo,
      Address1: result.address1,
      Address2: result.address2,
      City: result.city,
      Country: result.country,
      State: result.state,
      // CreatedOn: "",
      // CreatedBy:"",
      // IsActive:true,
      //CompanyLogo:"",
      CompanyCode: result.companyCode,
      ContactNo: result.contactNo,
      FaxNo: result.faxNo,
      ZipCode: result.zipCode,
      CurrencyId: result.currencyId,

    }
    this.companyservice.CompanyUpdate(companyData).subscribe(r => {
       
      if (r == "Success") {
        this.toastr.success(this.message.CompanyUpdatedSuccess, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.CompanyAlreadyexist, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetAllCompanyByGroupIdRegionId();
    })
  }

  RemoveCompany(result: any) {
     
    var companyData = {
      CompanyId: result.data.CompanyId,
    }
    this.companyservice.RemoveCompanyById(companyData).subscribe(r => {
       
      if (r == "Success") {
        this.toastr.success(this.message.CompanyDeleted, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.CompanyDeleteWarning, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetAllCompanyByGroupIdRegionId();
    })
  }

  //EndCompany

  public openAddGroup(type) {
    const dialogconfigcom1 = new MatDialogConfig();
    dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = "50%";
    debugger
    this.localService.setItem('settype', type);
    const modalService = this.dialog.open(RegionDialogComponent, dialogconfigcom1);
    debugger
    modalService.afterClosed().subscribe((res) => {
      let addedgroup = this.localService.getItem('addgrpdata');
      //this.data.push(this.addedgroup);
      this.dataSource = new MatTableDataSource<Element>(this.data);


      if (addedgroup) {
        if (addedgroup.type == 'group') {
          let tempObject1 = {
            name: addedgroup.name,
            region: []
          }
          this.data.push(tempObject1);
        } else if (addedgroup.type == 'region') {
          let tempObject = {
            name: addedgroup.name,
            comp: []
          }
          this.data[this.currentGroupIndex].region.push(tempObject);
          this.regionalData = new MatTableDataSource<Element>(this.data[this.currentGroupIndex].region);

        } else if (addedgroup.type == 'company') {
          this.data[this.currentGroupIndex].region[this.currentCompIndex].comp.push(addedgroup.name);
          this.dataCompany = new MatTableDataSource<Element>(this.data[this.currentGroupIndex].region[this.currentCompIndex].comp);
        }
        this.dataSource = new MatTableDataSource<Element>(this.data);
        console.log(this.data);
      }
    })
  }

  public opencomponent(element, rowid: number, type) {
    //console.log(element, rowid, type)
     
    const dialogconfigcom = new MatDialogConfig();
    let name = String;
    if (type == 'company') {
      name = element;
    } else {
      name = element.name;
    }
    let payloadObject = {
      index: rowid,
      name: name,
      type: type
    }
    dialogconfigcom.disableClose = true;
    dialogconfigcom.autoFocus = true;
    dialogconfigcom.width = "40%";
    debugger
    this.grpdata = payloadObject;
    this.localService.setItem("selectedgrp", this.grpdata);
    const modalService = this.dialog.open(Group_dialogComponent, dialogconfigcom);

    modalService.afterClosed().subscribe((res) => {
      let changedName = this.localService.getItem('selectedgrp');
      if (changedName) {
        if (type == 'group') {
          this.data[changedName.index].name = changedName.name;
        } else if (type == 'region') {
          this.data[this.currentGroupIndex].region[changedName.index].name = changedName.name;
        } else if (type == 'company') {
          this.data[this.currentGroupIndex].region[this.currentCompIndex].comp[changedName.index] = changedName.name;
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
    this.len = this.toselect * (this.data[this.toselect].region.length);
    for (let j = 0; j < this.selectedrows2.length; j++) {
      this.selectedrows2[this.len + i] = "true";
      if (this.selectedrows2[j] === 'true') {
        if ((this.len + i) != j) {
          this.selectedrows2[j] = "";
        }
      }
    }
    console.log(this.len);
    console.log(this.data[this.toselect].region.length);
    console.log(this.selectedrows2);
  }

  deleteGroup(...vars) {
    this.deleteGroupOptions = {
      option: vars[0],
      data: vars[1]

    }
     
    this.confirmService.confirm({ message: this.message.GroupDeleteNotification, title: this.message.AssetrakSays })
      .subscribe(res => {
         
        if (res) {
           

          this.RemoveGroup(this.deleteGroupOptions);


        }
      })

  }

  deleteRegion(...vars) {
    this.deleteRegionOptions = {
      option: vars[0],
      data: vars[1]

    }
     
    this.confirmService.confirm({ message:this.message.RegionDeleteNotification , title: this.message.AssetrakSays })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.RemoveRegion(this.deleteRegionOptions);
          this.loader.close();
        }
      })

  }

  deleteCompany(...vars) {
    this.deleteCompanyOptions = {
      option: vars[0],
      data: vars[1]

    }
     
    this.confirmService.confirm({ message: this.message.LegalEntityDeleteNotification, title: this.message.AssetrakSays })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.RemoveCompany(this.deleteCompanyOptions);
          this.loader.close();
        }
      })

  }


  public deleteregion(regionId: number) {
    this.data[this.currentGroupIndex].region.splice(regionId, 1);
    this.dataSource = new MatTableDataSource<Element>(this.data);
    this.regionalData = new MatTableDataSource<Element>(this.data[this.currentGroupIndex].region);
    console.log(this.regionalData);
    this.dataCompany = [];
  }

  public deletecompany(compId: number) {
    this.data[this.currentGroupIndex].region[this.currentCompIndex].comp.splice(compId, 1);
    this.dataSource = new MatTableDataSource<Element>(this.data);
    this.dataCompany = new MatTableDataSource<Element>(this.data[this.currentGroupIndex].region[this.currentCompIndex].comp);
    // console.log(this.dataCompany);
  }

  public showNextData(currentData, index) {
     
    this.dataCompany = [];
    this.disableadd1 = true;
    console.log(currentData, 'current data');
    this.regionalData = currentData.region;
    this.disableadd = false;
    this.currentGroupIndex = index;
  }

  public showNextcompData(currentData1, index1) {
    this.dataCompany = currentData1.comp;
    this.disableadd1 = false;
    console.log(currentData1, 'current compdata');
    this.currentCompIndex = index1;
  }



  openDialog(...getValue): void {
     
    var component: any
    if (getValue[0] === 'upload') {
      //component=UploadRegionPopUpComponent
    }
    else {
      component = Group_dialogComponent;
    }
    const dialogRef = this.dialog.open(component, {
      panelClass: 'group-form-dialog',
      disableClose: true,
      data: {
        component1: 'GroupComponent',
        value: getValue[0],
        name: getValue[1],
      },
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result && getValue[0] === 'edit') {
         
        this.updateGroupValue = result;
        this.updateGroupValue['GroupId'] = getValue[1].GroupId;

        this.UpdateGroup(this.updateGroupValue)
      }
      else if (result && getValue[0] === 'insert') {
         
        this.updateGroupDataInsert = result;
        this.loader.open();
        this.AddGroup(this.updateGroupDataInsert)
        this.loader.close();
      }

    });
  }

  //Region
  public GetGroupId(currentData, index) {
     
    this.LabelForRegion = "";
    this.LabelForCompany = "";
    this.LabelForRegion = currentData.GroupName;
    this.dataSourceC = "";
    this.dataSourceR = "";
    // this.paginator.pageIndex = 0;
    //this.paginatorForRegion.pageIndex=0;
    this.GroupId = currentData.GroupId;
    this.disabledRegionAdd = false;
    this.RegionAddDisable = false;
    this.GetAllRegionByGroupId();
  }

  openDialogR(...getValue): void {
     
    var component: any
    if (getValue[0] === 'upload') {
      //component=UploadDialogComponent
    }
    else {
      component = RegionDialogComponent;
    }
    const dialogRef = this.dialog.open(component, {
      panelClass: 'group-form-dialog',
      disableClose: true,
      data: {
        component1: 'RegionComponent',
        value: getValue[0],
        name: getValue[1],
        Group_Id: this.GroupId,
      },
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result && getValue[0] === 'edit') {
         
        this.updateRegionValue = result;
        this.updateRegionValue['RegionId'] = getValue[1].RegionId;

        this.UpdateRegion(this.updateRegionValue)
      }
      else if (result && getValue[0] === 'insert') {
         
        this.updateRegionDataInsert = result;
        this.updateRegionDataInsert['GroupId'] = this.GroupId;

        this.AddRegion(this.updateRegionDataInsert)
      }

    });
  }



  //Company
  public GetRegionId(currentData, index) {
     
    this.LabelForCompany = currentData.RegionName;
    this.RegionId = currentData.RegionId;
    this.CompanyAddDisable = false;
    this.GetAllCompanyByGroupIdRegionId();
  }

  openDialogC(...getValue): void {
     
    var component: any
    if (getValue[0] === 'upload') {
      //component=UploadDialogComponent
    }
    else {
      component = CompanyDialogComponent;
    }
    const dialogRef = this.dialog.open(component, {
      panelClass: 'group-form-dialog',
      disableClose: true,
      data: {
        component1: 'CompanyComponent',
        value: getValue[0],
        name: getValue[1],
        Group_Id: this.GroupId,
      },
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result && getValue[0] === 'edit') {
         
        this.updateCompanyValue = result;
        this.updateCompanyValue['CompanyId'] = getValue[1].CompanyId;

        this.UpdateCompany(this.updateCompanyValue)
      }
      else if (result && getValue[0] === 'insert') {
         
        this.updateCompanyDataInsert = result;
        this.updateCompanyDataInsert['GroupId'] = this.GroupId;
        this.updateCompanyDataInsert['RegionId'] = this.RegionId;

        this.AddCompany(this.updateCompanyDataInsert)
      }

    });
  }








}

