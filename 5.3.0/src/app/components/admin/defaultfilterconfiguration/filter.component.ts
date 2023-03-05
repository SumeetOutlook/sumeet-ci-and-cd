import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FilterDefault_DialogComponent } from './filter_dialog/filter_dialog.component';
import { DefaultFieldsComponent } from './field_dialog/field_dialog.component';
import { LocalStoreService } from 'app/shared/services/local-store.service';
import { FieldfilterService } from 'app/components/services/FieldfilterService';
import { ToastrService } from 'ngx-toastr';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import * as MenuHeaders from '../../../../assets/MenuHeaders.json';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { UserService } from '../../services/UserService';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';

export interface PeriodicElement {
  Pages: string;
  AvailableFilters: string;
  AvailableFields: string;
  DisplayName: string;

}
const ELEMENT_DATA: PeriodicElement[] = [
  { Pages: 'Define Relationship', DisplayName: "", AvailableFilters: "", AvailableFields: "" },
  { Pages: 'Manage Group', DisplayName: "", AvailableFilters: "", AvailableFields: "" },
  { Pages: 'Approve Tagging Information', DisplayName: "", AvailableFilters: "", AvailableFields: "" },
  { Pages: 'Additional Assets', DisplayName: "", AvailableFilters: "", AvailableFields: "" },
  { Pages: 'Inventory Status', DisplayName: "", AvailableFilters: "", AvailableFields: "" },
  { Pages: 'Missing Assets', DisplayName: "", AvailableFilters: "", AvailableFields: "" },
  { Pages: 'View Modified Assets', DisplayName: "", AvailableFilters: "", AvailableFields: "" },
  { Pages: 'Assignment', DisplayName: "", AvailableFilters: "", AvailableFields: "" },
  { Pages: 'Initiate Transfer', DisplayName: "", AvailableFilters: "", AvailableFields: "" },
  { Pages: 'Transfer Approval', DisplayName: "", AvailableFilters: "", AvailableFields: "" },
  { Pages: 'Initiate Retirement', DisplayName: "", AvailableFilters: "", AvailableFields: "" },
  { Pages: 'Retirement Approval', DisplayName: "", AvailableFilters: "", AvailableFields: "" },

];


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class DefaultFilterComponent implements OnInit {
  header: any ;
  message: any;
  MenuHeader : any = (MenuHeaders as any).default;
  public grpdata;
  CompanyId: any;
  GroupId: any;
  UserId: any;
  RegionId: any;
  listpagedata: any[] = [];
  displayedHeader = []
  displayedColumns = ['Pages', 'DisplayName', 'AvailableFilters', 'AvailableFields'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, public localService: LocalStoreService,
    public fieldfilterservice: FieldfilterService,
    private storage: ManagerService,
    private router: Router,
    public us: UserService,
    public alertService: MessageAlertService,private jwtAuth: JwtAuthService) {
      this.header = this.jwtAuth.getHeaders();
	    this.message = this.jwtAuth.getResources();

      this.displayedHeader = [this.header.Pages, this.header.DisplayName, this.header.AvailableFilters, this.header.AvailableFields];
     }

  ngOnInit() {
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    this.GetInitiatedData();
    this.PagesGetAllData();

  }

  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  GetInitiatedData() {
    let url5 = this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.RegionId, "68");
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

  PagesGetAllData() {
    debugger;
    this.fieldfilterservice.PagesGetAllData().subscribe(r => {
      debugger;
      this.listpagedata = r;
      this.listpagedata.forEach(x => {
        x.DisplayName = this.MenuHeader[x.ModuleName];
      })
      this.dataSource = new MatTableDataSource(this.listpagedata);
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;


  }

  openFields(element, data: any = {}) {
    debugger;
    let title = 'Available Fields';
    let name = String;
    let Id = 0;
    name = element.ModuleName;
    Id = element.ModuleId;


    let payloadObject = {
      name: name,
      Id: Id,
    }
    this.grpdata = payloadObject;
    this.localService.setItem("selectedgrp", this.grpdata);
    let dialogRef: MatDialogRef<any> = this.dialog.open(DefaultFieldsComponent, {
      width: '60vw',
      height: 'auto',
      disableClose: true,
      data: { title: title, payload: data },
      //element:{ title: title, payload: data },
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          console.log(res);
          return;
        }
      })


  }
  openFilter(element, data: any = {}) {

    let title = 'Available Filter';
    let name = String;
    let Id = 0;
    name = element.ModuleName;
    Id = element.ModuleId;


    let payloadObject = {
      name: name,
      Id: Id,
    }
    this.grpdata = payloadObject;
    this.localService.setItem("selectedgrp", this.grpdata);

    let dialogRef: MatDialogRef<any> = this.dialog.open(FilterDefault_DialogComponent, {
      width: '60vw',
      height: 'auto',
      disableClose: true,
      data: { title: title, payload: data }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          console.log(res);
          return;
        }
      })


  }



}