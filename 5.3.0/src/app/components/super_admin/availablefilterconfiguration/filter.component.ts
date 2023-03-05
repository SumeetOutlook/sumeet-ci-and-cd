import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Filter_DialogComponent } from './filter_dialog/filter_dialog.component';
import { FieldsComponent } from './field_dialog/field_dialog.component';
import { LocalStoreService } from 'app/shared/services/local-store.service';
import { FieldfilterService } from 'app/components/services/FieldfilterService';
import { ToastrService } from 'ngx-toastr';
import * as headers from '../../../../assets/Headers.json';
import * as resource from '../../../../assets/Resource.json';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

export interface PeriodicElement {
  Pages: string;
  AvailableFilters: string;
  AvailableFields: string;

}
const ELEMENT_DATA: PeriodicElement[] = [
  { Pages: 'Define Relationship', AvailableFilters: "", AvailableFields: "" },
  { Pages: 'Manage Group', AvailableFilters: "", AvailableFields: "" },
  { Pages: 'Approve Tagging Information', AvailableFilters: "", AvailableFields: "" },
  { Pages: 'Additional Assets', AvailableFilters: "", AvailableFields: "" },
  { Pages: 'Inventory Status', AvailableFilters: "", AvailableFields: "" },
  { Pages: 'Missing Assets', AvailableFilters: "", AvailableFields: "" },
  { Pages: 'View Modified Assets', AvailableFilters: "", AvailableFields: "" },
  { Pages: 'Assignment', AvailableFilters: "", AvailableFields: "" },
  { Pages: 'Initiate Transfer', AvailableFilters: "", AvailableFields: "" },
  { Pages: 'Transfer Approval', AvailableFilters: "", AvailableFields: "" },
  { Pages: 'Initiate Retirement', AvailableFilters: "", AvailableFields: "" },
  { Pages: 'Retirement Approval', AvailableFilters: "", AvailableFields: "" },

];



@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  header: any ;
  message: any = (resource as any).default;
  public grpdata;

  ProfileId :any;
  CompanyId: any;
  GroupId: any;
  UserId: any;
  RegionId: any;
  listpagedata: any[] = [];
  displayedHeader:any[] = []
  displayedColumns = ['Pages', 'AvailableFilters', 'AvailableFields'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, public localService: LocalStoreService,
    public fieldfilterservice: FieldfilterService,
    private storage: ManagerService,
    private router: Router,
    public alertService: MessageAlertService,
    private jwtAuth :JwtAuthService)
    {
      this.header = this.jwtAuth.getHeaders()
      this.displayedHeader = [this.header.Pages, this.header.AvailableFilters, this.header.AvailableFields]

    }

  ngOnInit() {

    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    this.ProfileId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_PROFILE);
    if (this.ProfileId == '0') {
      this.alertService.alert({ message: this.message.NotAuthorisedToAccess, title: this.message.AssetrakSays })
        .subscribe(res => {
          this.router.navigateByUrl('h/a')
        })
    }
    else{
      this.PagesGetAllData();
    }   
  }
  PagesGetAllData() {
    this.fieldfilterservice.PagesGetAllData().subscribe(r => {
      this.listpagedata = r;
      this.dataSource = new MatTableDataSource(this.listpagedata);
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openFields(element, data: any = {}) {

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


    let dialogRef: MatDialogRef<any> = this.dialog.open(FieldsComponent, {
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

    let dialogRef: MatDialogRef<any> = this.dialog.open(Filter_DialogComponent, {
      width: '60vw',
      height: 'auto',
      disableClose: true,
      data: { title: title, payload: data }
    })
    debugger
    dialogRef.afterClosed()
      .subscribe(res => {

        if (!res) {
          console.log(res);
          return;
        }
      })


  }



}