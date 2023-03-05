import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { date } from 'ngx-custom-validators/src/app/date/validator';
import { GroupService } from 'app/components/services/GroupService';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import * as headers from '../../../../assets/Headers.json';
import * as resource from '../../../../assets/Resource.json';
import { Router, ActivatedRoute } from "@angular/router";
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';


export interface PeriodicElement {
  configuration: string;
  enable: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { configuration: 'Cost WDV Zero On Retire', enable: "" },
  { configuration: 'Series Printing- Global or Classwise', enable: "" },
  { configuration: 'Number of Approval Level', enable: "" },
  { configuration: 'Single SignOn', enable: "" },
  { configuration: 'Value required in ATF and ADF', enable: "" },
  { configuration: 'Depreciation cost', enable: "" },
  { configuration: 'Potential Match By AssetId', enable: "" },
  { configuration: 'Grnno Duplicate while Upload', enable: "" },
  { configuration: 'Is sellingAmt On Wdv Or Cost?', enable: "" },
  { configuration: 'Active Directory Check', enable: "" },
  { configuration: 'SAP Integration ', enable: "" },
  { configuration: 'Split in Assetrak or SAP', enable: "dropdown" },
  { configuration: 'Usful Life In', enable: "dropdownForyear" },

];

interface ListOfConfig {
  id: string;
  name: string;
}

const ListOfConfig: ListOfConfig[] = [
  { name: 'Calendar Year', id: '1' },
  { name: 'Financial Year', id: '2' },
  { name: 'Other', id: '3' },

];


@Component({
  selector: 'app-otherconfig',
  templateUrl: './otherconfig.component.html',
  styleUrls: ['./otherconfig.component.scss'],
})
export class OtherConfigComponent implements OnInit {

  header: any;
  message: any = (resource as any).default;


  ConfigGrid: any[] = [];
  Save: any[] = [];
  SelectGridItems: any[] = [];
  SelectApprovalNoItems = 0;
  displayedColumns: string[] = ['configuration', 'enable'];
  //dataSource = new MatTableDataSource(ELEMENT_DATA);

  dataSource = new MatTableDataSource<any>();
  SelectedId: any[] = [];
  Group: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public GrpCtrl: FormControl = new FormControl();
  GrpCtrlr: FormControl = new FormControl();
  public filteredFinancialList: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public StartDatectrl: FormControl = new FormControl();
  EndDatectrl = new FormControl();
  public filteregroup: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();
  //protected ListOfConfigList: ListOfConfig[] = ListOfConfig;
  protected ListOfConfigList: ListOfConfig[];

  constructor(public groupservice: GroupService,
    public storage: ManagerService,
    public toastr: ToastrService,
    private router: Router,
    public alertService: MessageAlertService,private jwtAuth:JwtAuthService) 
    {
        this.header = this.jwtAuth.getHeaders()
  }
  ProfileId: any;
  GroupId: any;
  RegionId: any;
  UserId: any;
  CompanyId: any;
  data: any[] = [];

  ngOnInit(): void {
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);

    // this.GetConfigGrid();
    this.ProfileId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_PROFILE);
    if (this.ProfileId == '0') {
      this.alertService.alert({ message: this.message.NotAuthorisedToAccess, title: this.message.AssetrakSays })
        .subscribe(res => {
          this.router.navigateByUrl('h/a')
        })
    }
    else{
      this.GetGroupDetails();
      this.GetConfigGridOnLoad();
    } 
  }

  SelectedGroupItem: any[] = [];

  SelectGroupbox(event) {

    this.SelectedGroupItem = event;
    this.GetConfigGrid();
  }



  GetGroupDetails() {

    this.groupservice.GetAllGroupDetails().subscribe(response => {

      this.Group = JSON.parse(response);
      this.getFiltergrp();
    })
  }

  getFiltergrp() {

    this.filteregroup.next(this.Group.slice());
    this.GrpCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        ;
        this.filterUOMData();
      });

  }


  protected filterUOMData() {

    if (!this.Group) {
      return;
    }
    // get the search keyword
    let search = this.GrpCtrl.value;
    if (!search) {
      this.filteregroup.next(this.Group.slice());
      return;
    } else {
      search = search.toLowerCase();

    }
    // filter the Group
    this.filteregroup.next(
      this.Group.filter(x => x.GroupName.toLowerCase().indexOf(search) > -1)
    );

  }

  GetConfigGridOnLoad() {


    this.groupservice.GETONLOADSUPERADMINDETAILS().subscribe(response => {

      this.ConfigGrid = JSON.parse(response);
      this.onChangeDataSource(this.ConfigGrid);
      this.ListOfConfigList = ListOfConfig;
    });
  }

  GetConfigGrid() {

    //var GroupId = 2;
    //var GroupId=this.GroupId;
    var GroupId = this.SelectedGroupItem;
    this.groupservice.GetConfigDetailsByGroupId(GroupId).subscribe(response => {

      this.ConfigGrid = JSON.parse(response);
      this.onChangeDataSource(this.ConfigGrid);
      this.ListOfConfigList = ListOfConfig;
    });
  }

  onChangeDataSource(value) {
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }



  SelectGridCheckbox(element) {

    if (element.SelectedValue == 0) {
      element.SelectedValue = 1;
    }
    else {
      element.SelectedValue = 0;
    }

    console.log(this.dataSource);

  }



  changeNoOfApproval(event) {

    this.SelectApprovalNoItems = event;
  }



  btnSave() {

    for (var i = 0; i < this.dataSource.data.length; i++) {
      if (this.dataSource.data[i].SelectedValue > 0) {
        this.SelectedId.push(this.dataSource.data[i].ConfigurationMasterId);
        if (this.dataSource.data[i].ConfigurationMasterId == 5) {
          this.SelectApprovalNoItems = this.dataSource.data[i].SelectedValue;
        }
      }
    }

    if (this.SelectedId.length > 0) {
      var Groupdto =
      {
        listOfId: this.SelectedId.join(','),
        noofapproval: this.SelectApprovalNoItems,
        grid: this.GrpCtrl.value,
        //grid:this.GroupId,
      }

      this.groupservice.SAveConfigDetails(Groupdto).subscribe(r => {

        //this.Save= JSON.parse(r);
        this.Save = r;
        this.GetConfigGridOnLoad();
      })

    }

  }


}