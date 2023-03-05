import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SelectionModel } from '@angular/cdk/collections';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { LogOnService } from 'app/components/services/LogOnService';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import {
  MatSnackBarVerticalPosition,
  MatSnackBarHorizontalPosition,
  MatSnackBar,
  MatSnackBarConfig
} from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import * as header from '../../../../assets/Headers.json';


@Component({
  selector: 'app-group-region-company',
  templateUrl: './group-region-company.component.html',
  styleUrls: ['./group-region-company.component.scss']
})
export class GroupRegionCompanyComponent implements OnInit {

  Headers: any = (header as any).default;
  public isSubmit = true;
  public selectedIndex = 2;
  ValidData: boolean = true;
  actionButtonLabel = "Retry";
  action = false;
  setAutoHide = true;
  autoHide = 2000;
  verticalPosition: MatSnackBarVerticalPosition = "top";
  errorMsg = '';
  LoginUserInfo: any;

  public array_group;
  public array_region;
  public array_company;
  checked: boolean = false;

  constructor(private fb: FormBuilder,
    public jwtAuth: JwtAuthService,
    public snackBar: MatSnackBar,
    private router: Router,
    private storage: ManagerService,
    public LoginService: LogOnService) { }


  groupdatasource: any;
  regiondatasource: any;
  legaldatasource: any;
  Name: any;
  public SelectedData: any;

  displayedColumnsGroup: string[] = ['LevelNameValue'];
  selection = new SelectionModel<any>(false, []);
  displayedColumnsRegion: string[] = ['LevelNameValue'];
  displayedColumnsLegal: string[] = ['LevelNameValue'];

  nextStep(i) {
    this.selectedIndex = i;
    //console.log(i);
  }
  previousStep(i) {
    this.selectedIndex = i;
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.nextStep(tabChangeEvent.index);
    this.previousStep(tabChangeEvent.index);

  }

  ngOnInit() {
    if (this.jwtAuth.isLoggedIn()) {
      this.Name = this.storage.get(Constants.SESSSION_STORAGE, Constants.Name);
      this.GetGroupRegionCompany();
    }
    else {
      this.router.navigateByUrl("sessions/login");
    }
  }
  selectedRowIndex1 : any;
  selectData(row) {
     this.selectedRowIndex1 = row.LevelNameValue;
    this.selection.clear();
    if (row.GroupName == "") {
      this.ValidData = true;
    } else {
      this.ValidData = false;
      this.selection.toggle(row)
      this.SelectedData = this.selection.selected;
    }
  }
  Check() {
    this.checked = !this.checked;
  }

  GetGroupRegionCompany() {

    const UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    const ProfileId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_PROFILE);

    this.array_group = [];
    this.array_region = [];
    this.array_company = [];

    this.LoginService.GetGroupRegionCompany(UserId,ProfileId)
      .subscribe(r => {

        let Obj: any[] = JSON.parse(r);
        Obj.forEach(element => {
          if (element.LevelId === 1) {
            this.array_group.push(element)
          }
          else if (element.LevelId === 2) {
            this.array_region.push(element)
          }
          else if (element.LevelId === 3) {
            this.array_company.push(element)
          }
        });
        this.groupdatasource = new MatTableDataSource(this.array_group);
        this.regiondatasource = new MatTableDataSource(this.array_region);
        this.legaldatasource = new MatTableDataSource(this.array_company);
      })
  }

  Continue() {
    debugger;
    if (!!this.SelectedData) {
      const checkbox = this.checked;
      const groupId = !!this.SelectedData[0].groupid ? this.SelectedData[0].groupid : 0;
      const userid = !!this.SelectedData[0].userId ? this.SelectedData[0].userId : 0;
      const companyId = !!this.SelectedData[0].companyid ? this.SelectedData[0].companyid : 0;
      const regionId = !!this.SelectedData[0].regionid ? this.SelectedData[0].regionid : 0;
      const LevelNameValue = !!this.SelectedData[0].LevelNameValue ? this.SelectedData[0].LevelNameValue : 0;
      this.storage.set(Constants.SESSSION_STORAGE, Constants.GROUP_ID, groupId);
      this.storage.set(Constants.SESSSION_STORAGE, Constants.REGION_ID, regionId);
      this.storage.set(Constants.SESSSION_STORAGE, Constants.COMPANY_ID, companyId);
      this.storage.set(Constants.SESSSION_STORAGE, Constants.LevelNameValue, LevelNameValue);

      //if (checkbox == true) {

        var userAssignmentDto = {
          userId: !!this.SelectedData[0].userId ? this.SelectedData[0].userId : 0,
          LevelValue: !!this.SelectedData[0].LevelValue ? this.SelectedData[0].LevelValue : 0,
          LevelId: !!this.SelectedData[0].LevelId ? this.SelectedData[0].LevelId : 0,
          groupid: !!this.SelectedData[0].groupid ? this.SelectedData[0].groupid : 0,
          regionid: !!this.SelectedData[0].regionid ? this.SelectedData[0].regionid : 0,
          companyid: !!this.SelectedData[0].companyid ? this.SelectedData[0].companyid : 0,
          LevelNameValue: !!this.SelectedData[0].LevelNameValue ? this.SelectedData[0].LevelNameValue : 0
        }

        this.LoginService.InsertFavouriteSelection(userAssignmentDto)
          .subscribe(r => {

          })
      //}
      // ========== configuration data store into localStorage ===========
      let url1 = this.LoginService.GetConfigurationDetails(groupId);
      let url2 = this.LoginService.PagePermissionForMenuDisplay(groupId, userid, companyId, regionId)
      forkJoin([url1, url2]).subscribe(results => {

        if (!!results) {
          localStorage.setItem("Configuration", results[0]);
          localStorage.setItem("MenuPage", results[1]);
          localStorage.setItem('PageSession', null);
          this.router.navigateByUrl("h/a");
        }
      })
    }
    else {

    }

  }



}
