import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { SnotifyService, SnotifyToast } from "ng-snotify";
import { ManagerService } from "app/components/storage/sessionMangaer";
import { Constants } from "app/components/storage/constants";

import { ToastrService } from 'ngx-toastr';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { Router, ActivatedRoute } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { LocalStoreService } from "app/shared/services/local-store.service";
import { UserService } from 'app/components/services/UserService';

import { addUserDialogComponent } from './add_user_dialog/add_user_dialog.component';
import { editUserDialogComponent } from './edit_user_dialog/edit_user_dialog.component';
import { UploadUserComponent } from './Upload_user_dialog/Upload_user.component';
import { ViewRoleDialogComponent } from './view_role_dialog/viewrole.component';

import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import * as menuheaders from '../../../../assets/MenuHeaders.json';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { AllPathService } from 'app/components/services/AllPathServices';


const ELEMENT_DATA: PeriodicElement[] = [
  { first_name: 'abcd', last_name: 'abcd', empId: 'EMP001', email: 'abcd@gmail.com', contactno: '12345', ActiveDeactiveDate: '10/2/2020', view_roles: '', status: 'Active', edit: '' },
  { first_name: 'pqrs', last_name: 'abcd', empId: 'EMP002', email: 'an@gmail.com', contactno: '456789', ActiveDeactiveDate: '15/3/2020', view_roles: '', status: 'Active', edit: '' },
  { first_name: 'xyz', last_name: 'abcd', empId: 'EMP0025', email: 'an@gmail.com', contactno: '789123', ActiveDeactiveDate: '1/6/2020', view_roles: '', status: 'Active', edit: '' },
  { first_name: 'ats', last_name: 'abcd', empId: 'EMP003', email: 'ans@gmail.com', contactno: '456789', ActiveDeactiveDate: '', view_roles: '', status: 'Unconfirmed', edit: '' },
  { first_name: 'ats', last_name: 'abcd', empId: 'EMP004', email: 'ans@gmail.com', contactno: '456789', ActiveDeactiveDate: '3/2/2019', view_roles: '', status: 'Active', edit: '' },

]

export interface PeriodicElement {

  contactno: string;
  email: string;
  first_name: string;
  last_name: string;
  empId: string;
  status: string;
  edit: string;
  ActiveDeactiveDate: string;
  view_roles: string;

}
export interface eleM {

  UserName:string,
  FirstName:string,
  LastName:string,
  ContactNo:string,
  Status:string,
  EmpolyeeID:string,
  Actions:string

}

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})

export class CreateUserComponent implements OnInit {
  private isButtonVisible = false;

  header: any ;
  message: any ;
  menuheader: any = (menuheaders as any).default
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  @ViewChild('table', { static: true }) table: any;


  public data = Object.assign(ELEMENT_DATA);
  displayedHeaders = [];
  // displayedColumns: string[] = ['UserName','FirstName','LastName','ContactNo','UserId','CreatedOn','Status','Actions'];
  displayedColumns: string[] = ['UserName', 'FirstName', 'LastName', 'ContactNo', 'Status','EmpolyeeID', 'Actions'];

  datasource: any;
  controls: FormArray;
  public grpdata;
  value: any;
  updateData: any;
  addData: any;
  deleteOptions: { option: any; id: any; };
  core: any;
  currentGroupIndex: any;

  SessionGroupId: any;
  SessionRegionId: any;
  SessionCompanyId: any;
  SessionUserId: any;


  constructor(
    public dialog: MatDialog,
    private storage: ManagerService,
    private loader: AppLoaderService,
    private confirmService: AppConfirmService,
    public toastr: ToastrService,
    private router: Router,
    public localService: LocalStoreService,
    public userService: UserService ,
    public alertService :MessageAlertService,
    public AllPathService: AllPathService,
    private jwtAuth: JwtAuthService
  ) {
      this.header = this.jwtAuth.getHeaders();
      this.message = this.jwtAuth.getResources();
      this.displayedHeaders = [this.header.UserName, this.header.FirstName, this.header.LastName, this.header.ContactNumber, this.header.UserId, this.header.ActiveDeactiveDate, this.header.ActivationStatus,this.header.EmployeeId, this.header.Actions];
   }

  ngOnInit() {
    // this.paginator._intl.itemsPerPageLabel = 'Records per page';
    this.SessionGroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.SessionRegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.SessionCompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.SessionUserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    this.GetInitiatedData();
    this.GetAllUsersByGroupId();
  }
  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  GetInitiatedData() {
    let url5 = this.userService.PermissionRightsByUserIdAndPageId(this.SessionGroupId, this.SessionUserId, this.SessionCompanyId, this.SessionRegionId, "72");
    forkJoin([url5]).subscribe(results => {
      if (!!results[0]) {
        debugger;
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

  ngAfterViewInit() {
    // this.datasource.sort = this.sort;
    // this.datasource.paginator = this.paginator;

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  }

  //User Flow
  GetAllUsersByGroupId() {
    debugger;
    var groupId = this.SessionGroupId;
    var IsExport = false;
    this.loader.open();
    this.userService.GetAllUserData(groupId, IsExport).subscribe(response => {
      debugger;

      this.loader.close();
      this.onChangeDataSource(JSON.parse(response));
    })
  }

  onChangeDataSource(value) {
    debugger;
    this.datasource = new MatTableDataSource(value);
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;

    this.datasource.filterPredicate = (data: eleM, filter: string) => {
      return data.FirstName.toLowerCase().startsWith(filter) || 
             data.LastName.toLowerCase().startsWith(filter) || 
             data.UserName.toLowerCase().startsWith(filter) || 
             data.ContactNo.toLowerCase().startsWith(filter);
     };
  }
  
  applyFilterNew(filterValue: any) {
  
    this.datasource.filter = filterValue.trim().toLowerCase();
     
  }


  AddUser(result: any) {
    debugger;
    var userData = {
      UserName: result.userName,
      GroupId: this.SessionGroupId,
      ContactNo: result.contactNo,
      CreatedBy: "1",
      FirstName: result.firstName,
      LastName: result.lastName,
      CompanyId: this.SessionCompanyId > 0? this.SessionCompanyId:0
    }
    this.userService.AddUser(userData).subscribe(r => {
      debugger;
      if (r == "Success") {
        this.toastr.success(this.message.UserCreationSucess, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.UserEmailRegister, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }

      this.GetAllUsersByGroupId();
    })
  }


  UpdateUser(result: any) {
    debugger;
    var userData = {
      UserId: result.userId,
      ContactNo: result.contactNo,
      FirstName: result.firstName,
      LastName: result.lastName,
      IsActive: true
    }
    this.userService.UpdateUser(userData).subscribe(r => {
      debugger;
      if (r == "Success") {
        this.toastr.success(this.message.UserDetailsUpdate, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.GroupExits, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetAllUsersByGroupId();
    })
  }

  DeactivateUserByUserId(result: any) {
    debugger;
    var userData = {
      UserId: result.id.UserId,
      IsActive: false
    }
    this.userService.DeactivateUser(userData).subscribe(r => {
      debugger;
      if (r == "Success") {
        this.toastr.success(this.message.UserDeactivateSucess, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.GroupExits, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetAllUsersByGroupId();
    })
  }


  deactivateUser(...vars) {
    this.deleteOptions = {
      option: vars[0],
      id: vars[1]
    }
    debugger;
    this.DeactivateUserByUserId(this.deleteOptions);
  }


  ResendMailToUser(result: any) {
    debugger;
    var userData = {
      GroupId: this.SessionGroupId,
      UserName: result.id.UserName,
    }
    this.userService.ResendConfirmationMailToUser(userData).subscribe(r => {
      debugger;
      if (r == "Success") {
        this.toastr.success(this.message.UserResendMailSucess, this.message.AssetrakSays);
      }
      else if (r == "confirmed") {
        this.toastr.warning(this.message.UserConfirmActivation, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetAllUsersByGroupId();
    })
  }

  Resendmail(...vars) {
    this.deleteOptions = {
      option: vars[0],
      id: vars[1]
    }
    debugger;
    this.ResendMailToUser(this.deleteOptions);
  }

  ExportUserdata() {
    debugger;
    var groupId = this.SessionGroupId;
    var IsExport = true;
    this.userService.ExportUserData(groupId, IsExport).subscribe(r => {
      debugger;
      if (!!r) {
        this.AllPathService.DownloadExportFile(r);
        console.log("URL", URL);
      }

    })
  }


  DeleteUserByUserName(result: any) {
    debugger;
    var userData = {
      UserName: result.id.UserName,
    }
    this.userService.DeleteUser(userData).subscribe(r => {
      debugger;
      if (r == "Success") {
        this.toastr.success(this.message.UserDeleteSucess, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.GroupExits, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetAllUsersByGroupId();
    })
  }


  deleteUser(...vars) {
    this.deleteOptions = {
      option: vars[0],
      id: vars[1]

    }
    debugger;
    this.confirmService.confirm({ message: `Are you sure want to delete ?`, title: this.message.AssetrakSays })
      .subscribe(res => {
        if (res) {
          this.loader.open();
          this.DeleteUserByUserName(this.deleteOptions);
          this.loader.close();
        }
      })
  }

  openDialogAdd(...getValue): void {
    debugger;
    var component: any
    component = addUserDialogComponent;
    const dialogRef = this.dialog.open(component, {
      panelClass: 'user-form-dialog',
      disableClose: true,
      data: {
        component1: 'UserAddComponent',
        value: getValue[0],
        name: getValue[1],
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && getValue[0] === 'insert') {
        debugger;
        this.addData = result;
        this.loader.open();
        this.AddUser(this.addData)
        this.loader.close();
      }

    });
  }


  openDialogEdit(...getValue): void {
    debugger;
    var component: any
    component = editUserDialogComponent;
    const dialogRef = this.dialog.open(component, {
      panelClass: 'user-form-dialog',
      disableClose: true,
      data: {
        component1: 'UserEditComponent',
        value: getValue[0],
        name: getValue[1],
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && getValue[0] === 'edit') {
        debugger;
        this.updateData = result;
        this.updateData['userId'] = getValue[1].UserId;
        this.loader.open();
        this.UpdateUser(this.updateData)
        this.loader.close();
      }

    });
  }

  //User Flow end

  editRecord(data) {
    debugger;
    this.router.navigate(['/masters/useredit'], {
      state: data
    });
  }


  public openAddUser() {
    debugger
    const dialogconfigcom1 = new MatDialogConfig();
    dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = "45%";
    debugger
    // this.localService.setItem('settype',type);
    const modalService = this.dialog.open(addUserDialogComponent, dialogconfigcom1);
    debugger
    modalService.afterClosed().subscribe((res) => {
      let addedgroup = this.localService.getItem('addgrpdata');
      debugger;
      if (addedgroup.firstnm == undefined && addedgroup.lastnm == undefined && addedgroup.email1 == undefined && addedgroup.compnm == undefined && addedgroup.empId) {
        modalService.close();
      } else {
        let tempObject = {
          first_name: addedgroup.firstnm,
          last_name: addedgroup.lastnm,
          empId: addedgroup.empId,
          email: addedgroup.email1,
          contactno: addedgroup.compnm

        }
        this.data.push(tempObject);
        this.datasource = new MatTableDataSource<Element>(this.data);
      }

    })
  }
  public getRecord() { }

  openDialog(...params): void {
    var component: any
    console.log(params)
    component = '' //CreateUserDialogComponent
    const dialogRef = this.dialog.open(component, {
      data: {
        value: params[0],
        rowData: params[1]
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && params[0] === 'edit') {
        console.log("this dialog closed with true value", result)
        this.updateData = result;
        this.updateData['id'] = params[1].id
        //this.updateUsers(this.updateData);
      }
      else if (result && params[0] === 'insert') {

      }
    });
  }

  public editUser(element, rowid: number) {
    debugger
    const dialogconfigcom = new MatDialogConfig();
    let name = String;
    name = element;
    let payloadObject = {
      index: rowid,
      name: name
    }
    dialogconfigcom.disableClose = true;
    dialogconfigcom.autoFocus = true;
    dialogconfigcom.width = "45%";
    debugger
    this.grpdata = payloadObject;
    this.localService.setItem("selectedgrp", this.grpdata);
    const modalService = this.dialog.open(editUserDialogComponent, dialogconfigcom);

    modalService.afterClosed().subscribe((res) => {
      debugger;
      let changedName = this.localService.getItem('addgrpdata');
      this.data[changedName.index].first_name = changedName.name.first_name;
      this.data[changedName.index].last_name = changedName.name.last_name;
      this.data[changedName.index].empId = changedName.name.empId;
      this.data[changedName.index].email = changedName.name.email;
      this.data[changedName.index].status = changedName.name.status;
      this.data[changedName.index].contactno = changedName.name.contactno;
      this.datasource = new MatTableDataSource<Element>(this.data);
    })
  }

  Upload_user() {
    let dialogRef: MatDialogRef<any> = this.dialog.open(UploadUserComponent, {
      width: '600px',
      maxHeight: '90vh',
      minHeight: '20vh',
      disableClose: true,
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
      })
  }

  showEdit(status, status1) {
    if (status == true && status1 == true) {
      return true;
    }
    // else if(status == false && status1== false)
    // {
    //   return false;
    // }
    // else{
    //   return false;
    // } 
    if (status == false && status1 == false) {
      return false;
    }

  }

  public doFilter = (value: string) => {
    this.datasource.filter = value.trim().toLocaleLowerCase();
  }

  openViewRoleDialog() {
    let dialogRef: MatDialogRef<any> = this.dialog.open(ViewRoleDialogComponent, {
      width: '1200px',
      disableClose: true,
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
      })

  }

}
