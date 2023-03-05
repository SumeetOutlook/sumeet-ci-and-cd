import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { Router, ActivatedRoute } from "@angular/router";
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { LocalStoreService } from 'app/shared/services/local-store.service';
import { ViewDialogComponent } from './view_dialog/view.component';
import { UserRoleService } from '../../services/UserRoleService';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import * as resource from '../../../../assets/Resource.json';

const ELEMENT_DATA: PeriodicElement[] = [
  { rolename: 'abcd', createdby: 'abcd', createddt: '21/6/2019', updateddt: '21/6/2019', edit: '' },
  { rolename: 'pqrs', createdby: 'abcd', createddt: '5/5/2020', updateddt: '5/5/2020', edit: '' },
  { rolename: 'xyz', createdby: 'abcd', createddt: '28/5/2019', updateddt: '28/5/2019', edit: '' },
  { rolename: 'ats', createdby: 'abcd', createddt: '31/7/2019', updateddt: '31/7/2019', edit: '' },
]

export interface PeriodicElement {
  rolename: string;
  createdby: string;
  createddt: string;
  updateddt: string;
  edit: string;
}

@Component({
  selector: 'app-role_add',
  templateUrl: './role-add.component.html',
  styleUrls: ['./role-add.component.scss']
})
export class RoleAddComponent implements OnInit {
  message: any = (resource as any).default;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  @ViewChild('table', { static: true }) table: any;

  displayedColumns: string[] = ['rolename', "UserName", 'RoleCreatedDate', 'edit'];
  public data = Object.assign(ELEMENT_DATA);
  public dataSource = new MatTableDataSource<Element>(this.data);
  controls: FormArray;
  grpdata;
  value: any;
  updateData: any;
  deleteOptions: { option: any; id: any; };
  core: any;
  CompanyId: any;
  GroupId: any;
  UserId: any;
  RegionId: any;
  getselectedData: any;

  constructor(
    public dialog: MatDialog,
    private storage: ManagerService,
    private loader: AppLoaderService,
    private userRoleService: UserRoleService,
    private router: Router,
    public localService: LocalStoreService,
    private snackBar: MatSnackBar,
    public toastr: ToastrService,
    private confirmService: AppConfirmService,
  ) { }

  ngOnInit() {
    this.loader.open();
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    this.loadRoleList();
    this.loader.close();
  }

  loadRoleList() {
    this.userRoleService.GetAllRoleList(this.GroupId, this.RegionId, this.CompanyId).subscribe(response => {
      console.log(response);
      //this.dataSource = new MatTableDataSource<any>(response);
      this.onChangeDataSource(response);
    });
  }

  onChangeDataSource(value) {
    debugger;
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  // }

  editRecord(data) {
    this.router.navigate(['/masters/useredit'], {
      state: data
    });
  }

  public backtoCreateRole() {
    this.router.navigateByUrl('h9/f');
  }

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
  }

  // public editRole(element, rowid: number) {
  //   this.router.navigateByUrl('h9/p');
  //   let name = String;
  //   name = element;

  //   let payloadObject = {
  //     index: rowid,
  //     name: name
  //   }

  //   this.grpdata = payloadObject;
  //   this.localService.setItem("selectedgrp", this.grpdata);

  //   let changedName = this.localService.getItem('addgrpdata');
  //   this.data[changedName.index].rolename = changedName.name.rolename;
  //   this.dataSource = new MatTableDataSource<Element>(this.data);
  // }

  public editRole(element, rowid: number) {
    debugger;
    this.router.navigateByUrl('h9/p', {
      state: element
    });
  }

  deleteRole(elm) {
    console.log(elm);
    debugger;
    this.confirmService.confirm({ message: this.message.RoleDeleteNotification + "'"+elm.RoleName+"'"+" role?", title: this.message.AssetrakSays })
    .subscribe(res => {
      if (res) {
        this.loader.open();
        const deleteData = {
          GroupId: this.GroupId, 
          RegionId: this.RegionId, 
          CompanyId: this.CompanyId, 
          RoleId: elm.RoleId
        };
        this.userRoleService.DeleteRoleByLevel(deleteData).subscribe(r => {
          console.log(r);
          this.loader.close();
          if (r == "Success") {
            this.toastr.success(this.message.RoleDeleteSuccess, this.message.AssetrakSays);
          }
          else if (r == "Default Role") {
            this.toastr.warning(this.message.DefaultRoleDeleteSuccess, this.message.AssetrakSays);
          }
          else if (r == "Fail") {
            this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
          }
    
          this.loadRoleList();    
        });
      }
    })
    // const deleteData = {
    //   GroupId: this.GroupId, 
    //   RegionId: this.RegionId, 
    //   CompanyId: this.CompanyId, 
    //   RoleId: elm
    // };
    // this.userRoleService.DeleteRoleByLevel(deleteData).subscribe(r => {
    //   console.log(r);

    //   if (r == "Success") {
    //     this.toastr.success(this.message.RoleDeleteSuccess, this.message.AssetrakSays);
    //   }
    //   else if (r == "Default Role") {
    //     this.toastr.warning(this.message.DefaultRoleDeleteSuccess, this.message.AssetrakSays);
    //   }
    //   else if (r == "Fail") {
    //     this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
    //   }

    //   this.loadRoleList();    
    // });
  }

  viewRole(element) {
    var component: any
    component = ViewDialogComponent;
    const dialogRef = this.dialog.open(component, {
      disableClose: true,
      data: {
        component1: 'ViewDialogComponent',
        role: element,
      },
      width: '1200px'
    });
  }
}
