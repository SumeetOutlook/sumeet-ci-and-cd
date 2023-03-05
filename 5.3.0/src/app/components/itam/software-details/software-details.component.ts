import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Component, OnInit, ViewChild, Inject, ViewEncapsulation, EventEmitter, Output, VERSION, ChangeDetectionStrategy } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupService } from 'app/components/services/GroupService';
import { take, takeUntil } from 'rxjs/operators';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DatePipe } from '@angular/common';
import * as headers from '../../../../assets/Headers.json';
import * as resource from '../../../../assets/Resource.json';
import * as moment from "moment";
import { default as _rollupMoment } from "moment";
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { UserService } from 'app/components/services/UserService';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';

@Component({
  selector: 'app-software-details',
  templateUrl: './software-details.component.html',
  styleUrls: ['./software-details.component.scss']
})
export class SoftwareDetailsComponent implements OnInit {

  message: any = (resource as any).default;
  paginationParams: any;
  header: any = (headers as any).default;
  submitted: boolean = false;
 
  
  today = new Date();
  displayedColumns: string[] = ['Product', 'Cost', 'Version','Manufacturer','Category'];
  displayedColumnsL: string[] = ['Agreement Number', 'Manufacturer', 'Acquisition Date','Expiry Date','Expire in','PO #','Status'];
  displayedColumnsI : string[] = ['Workstation','Version','User','License Key','Product ID','Allocated License','Installed On'];
  displayedColumnsLC: string[] = ['License Name','License Type','License Option','Installations Allowed','Allocated','License Key','Status']
  datasource = new MatTableDataSource();
  uploadAssetData: any;
  GroupId: any;
  RegionId: any;
  UserId: any;
  CompanyId: any;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute,
    public toastr: ToastrService,
    public datepipe: DatePipe,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    public messageAlertService: MessageAlertService,
    public userDataService: UserService,
    private storage: ManagerService,
  ) { }

  public selectedIndex;
  previousStep(i) {
    this.selectedIndex = i;
  }
  nextStep(i) {
    this.selectedIndex = i;    
  }
  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.nextStep(tabChangeEvent.index);
    this.previousStep(tabChangeEvent.index);
  }

  ngOnInit() {
    
     this.paginationParams = {
      pageSize: 50,
      currentPageIndex: 0,
      endIndex: 0,
      startIndex: 0,
      totalCount: 0,
    }
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
  }
}
