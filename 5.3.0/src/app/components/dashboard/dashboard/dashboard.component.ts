
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import * as header from '../../../../assets/Headers.json';
import * as resource from '../../../../assets/Resource.json';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import * as menuheaders from '../../../../assets/MenuHeaders.json'
import { UserService } from '../../services/UserService';
import { ReportService } from '../../services/ReportService';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyLocationService } from '../../services/CompanyLocationService';
import { UserMappingService } from '../../services/UserMappingService';
import { CompanyBlockService } from '../../services/CompanyBlockService';
import { DashboardFilterDialogComponent } from '../dialog/dashboard-filter-dialog/dashboard-filter-dialog.component';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  Headers: any = (header as any).default;
  message: any = (resource as any).default;
  CurrencyIcon: any;


  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  protected _onDestroy = new Subject<void>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  AllCount: any = 0;
  AllCost: any = 0;
  AllWDV: any = 0;

  newcount: any = 0;
  newcost: any = 0;
  newwdv: any = 0;

  Relationcount: any = 0;
  Relationcost: any = 0;
  Relationwdv: any = 0;

  Errorcount: any = 0;
  Errorcost: any = 0;
  Errorwdv: any = 0;

  taggingCount: any = 0;
  taggingCost: any = 0;
  taggingWDV: any = 0;

  untagCount: any = 0;
  untagCost: any = 0;
  untagWDV: any = 0;

  pendingtagCount: any = 0;
  pendingtagCost: any = 0;
  pendingtagWDV: any = 0;

  pendingtaggedCount: any = 0;
  pendingtaggedCost: any = 0;
  pendingtaggedWDV: any = 0;

  damagetaggedCount: any = 0;
  damagetaggedCost: any = 0;
  damagetaggedWDV: any = 0;

  notusetaggedCount: any = 0;
  notusetaggedCost: any = 0;
  notusetaggedWDV: any = 0;

  verifyonlytaggedCount: any = 0;
  verifyonlytaggedCost: any = 0;
  verifyonlytaggedWDV: any = 0;

  nonverifytaggedCount: any = 0;
  nonverifytaggedCost: any = 0;
  nonverifytaggedWDV: any = 0;

  notfoundtagCount: any = 0;
  notfoundtagCost: any = 0;
  notfoundtagWDV: any = 0;

  additionalcount: any = 0;

  taggedCount: any = 0;
  taggedCost: any = 0;
  taggedWDV: any = 0;

  underInvCount: any = 0;
  underInvCost: any = 0;
  underInvWDV: any = 0;

  availInvCount: any = 0;
  availInvCost: any = 0;
  availInvdWDV: any = 0;

  verifyCount: any = 0;
  verifyCost: any = 0;
  verifyWDV: any = 0;

  pendingInvCount: any = 0;
  pendingInvCost: any = 0;
  pendingInvdWDV: any = 0;

  notfoundCount: any = 0;
  notfoundCost: any = 0;
  notfoundWDV: any = 0;

  additionalInvcount: any = 0;
  additionalInvCost: any = 0;
  additionalInvWDV: any = 0;

  damageInvCount: any = 0;
  damageInvCost: any = 0;
  damageInvWDV: any = 0;

  notuseInvCount: any = 0;
  notuseInvCost: any = 0;
  notuseInvdWDV: any = 0;

  notInvCount: any = 0;
  notInvCost: any = 0;
  notInvWDV: any = 0;

  verifyonlyCount: any = 0;
  verifyonlyCost: any = 0;
  verifyonlyWDV: any = 0;

  nonverifyCount: any = 0;
  nonverifyCost: any = 0;
  nonverifyWDV: any = 0;

  retireCount: any = 0;
  retireCost: any = 0;
  retireWDV: any = 0;

  currencyIn: any = 1000;

  profileId: any;
  CompanyId: any;
  GroupId: any;
  UserId: any;
  RegionId: any;
  IsCompanyAdmin: any = 1;
  IslayerDisplay: any;
  layerid: any;
  Layertext: any;
  HeaderLayerText: any;
  displayContent : boolean = false;
  Showprogressbar : boolean = false;

  constructor(public dialog: MatDialog,
    public toastr: ToastrService,
    private storage: ManagerService,
    public confirmService: AppConfirmService,
    private loader: AppLoaderService,
    public us: UserService,
    private router: Router,
    public rps: ReportService,
    public cls: CompanyLocationService,
    public ums: UserMappingService,
    public cbs: CompanyBlockService,
    public alertService: MessageAlertService,
  ) {
  }

  ngOnInit(): void {
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    this.profileId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_PROFILE);
    this.layerid = this.storage.get(Constants.SESSSION_STORAGE, Constants.LAYER_ID);
    this.IslayerDisplay = this.layerid;
    if (this.layerid == 1) {
      this.Layertext = "Country";
    }
    else if (this.layerid == 2) {
      this.Layertext = "State";
    }
    else if (this.layerid == 3) {
      this.Layertext = "City";
    }
    else if (this.layerid == 4) {
      this.Layertext = "Zone";
    }
    this.HeaderLayerText = this.Layertext;
    if (this.profileId != 1 && this.CompanyId != 0) {
      this.displayContent  = true;
      this.GetCurrencyIcon();
      this.GetInitiatedData();
    }
    else{
      this.displayContent  = false;
    }
  }


  ListOfCategory: any[] = [];
  ListOfLoc: any[] = [];
  ListOfSBU: any[] = [];
  GetInitiatedData() {
    debugger;
    let url1 = this.cls.GetLocationListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 85);
    let url2 = this.cbs.GetCategoryListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 85);
    //this.loader.open();
    this.Showprogressbar = true;
    forkJoin([url1, url2]).subscribe(results => {
      if (!!results[0]) {
        this.ListOfLoc = JSON.parse(results[0]);
        this.ListOfLoc.forEach(x => {
          this.LocationIdList.push(x.LocationId);
        })
        this.ListOfSBU = this.UniqueArraybyId(this.ListOfLoc, this.Layertext);
        this.ListOfSBU.forEach(x => {
          this.SbuList.push(x[this.Layertext]);
        })
      }
      debugger;
      if (!!results[1]) {
        this.ListOfCategory = JSON.parse(results[1]);
        this.ListOfCategory.forEach(x => {
          this.CategoryIdList.push(x.AssetCategoryId);
        })
      }

      if (this.RegionId != "0") {
        this.RegionIdList.push(this.RegionId);
      }
      if (this.CompanyId != "0") {
        this.CompanyIdList.push(this.CompanyId);
      }
     // this.loader.close();
     this.Showprogressbar =false;

      this.GetDashBoardCount();
      this.GetPageSession();
    })
  }

  StorePageSession: any;
  GetPageSession() {
    this.StorePageSession = "";
    if (!!localStorage.getItem('PageSession') && localStorage.getItem('PageSession') != "null") {
      this.StorePageSession = {}
      this.StorePageSession = JSON.parse(localStorage.getItem('PageSession'));
      if (this.StorePageSession.Pagename === "Dashboard") {
        
      }
      else {
        localStorage.setItem('PageSession', null);
        this.StorePageSession = "";
      }
    }
  }

  UniqueArraybyId(collection, keyname) {
    var output = [],
      keys = [];

    collection.forEach(item => {
      var key = item[keyname];
      if (keys.indexOf(key) === -1) {
        keys.push(key);
        output.push(item);
      }
    });
    return output;
  };
  plantMultiCtrl: any;
  categoryMultiCtrl: any;
  bindData1: any[] = [];
  bindData: any[] = [];
  LocationIdList: any[] = [];
  CategoryIdList: any[] = [];
  SbuList: any[] = [];
  RegionIdList: any[] = [];
  CompanyIdList: any[] = [];
  GetDashBoardCount() {
    debugger;

    if (this.LocationIdList.length == 0) {
      this.ListOfLoc.forEach(x => {
        this.LocationIdList.push(x.LocationId);
      })
    }
    if (this.CategoryIdList.length == 0) {
      this.ListOfCategory.forEach(x => {
        this.CategoryIdList.push(x.AssetCategoryId);
      })
    }
    if (this.SbuList.length == 0) {
      this.ListOfSBU.forEach(x => {
        this.SbuList.push(x[this.Layertext]);
      })
    }
    var assetDetails = {
      LocationIdList: this.LocationIdList,
      UserId: this.UserId,
      GroupId: this.GroupId,
      CategoryIdList: this.CategoryIdList,
      SbuList: this.SbuList,
      RegionIdList: this.RegionIdList,
      CompanyIdList: this.CompanyIdList
    }
    //this.loader.open();
    this.Showprogressbar = true;
    this.rps.GetDashBoardCount(assetDetails).subscribe(r => {
      debugger;
     // this.loader.close();
     this.Showprogressbar = false;
      if (!!r) {
        this.bindData = JSON.parse(r);
        console.log(this.bindData);
        //this.bindData = this.bindData1[0];

        var AllCount = this.bindData[0].allCount.split(',');
        this.AllCount = AllCount[0];
        this.AllCost = AllCount[1];
        this.AllWDV = AllCount[2];

        var New = this.bindData[0].NewCount.split(',');
        this.newcount = New[0];
        this.newcost = New[1];
        this.newwdv = New[2];

        var Relation = this.bindData[0].RelationCount.split(',');
        this.Relationcount = Relation[0];
        this.Relationcost = Relation[1];
        this.Relationwdv = Relation[2];

        var Error = this.bindData[0].ErrorCount.split(',');
        this.Errorcount = Error[0];
        this.Errorcost = Error[1];
        this.Errorwdv = Error[2];

        //tagging
        var tagg = this.bindData[0].taggingCount.split(',');
        this.taggingCount = tagg[0];
        this.taggingCost = tagg[1];
        this.taggingWDV = tagg[2];
        // Sum
        var untag = this.bindData[0].untagCount.split(',');
        this.untagCount = untag[0];
        this.untagCost = untag[1];
        this.untagWDV = untag[2];

        var pendingtag = this.bindData[0].pendingtagCount.split(',');
        this.pendingtagCount = pendingtag[0];
        this.pendingtagCost = pendingtag[1];
        this.pendingtagWDV = pendingtag[2];

        //Pending Tagging
        var pendingtagged = this.bindData[0].pendingtaggedCount.split(',');
        this.pendingtaggedCount = pendingtagged[0];
        this.pendingtaggedCost = pendingtagged[1];
        this.pendingtaggedWDV = pendingtagged[2];

        var damagetagged = this.bindData[0].damagetaggedCount.split(',');
        this.damagetaggedCount = damagetagged[0];
        this.damagetaggedCost = damagetagged[1];
        this.damagetaggedWDV = damagetagged[2];

        var notusetagged = this.bindData[0].notusetaggedCount.split(',');
        this.notusetaggedCount = notusetagged[0];
        this.notusetaggedCost = notusetagged[1];
        this.notusetaggedWDV = notusetagged[2];

        var verifyonlytagged = this.bindData[0].verifyonlytaggedCount.split(',');
        this.verifyonlytaggedCount = verifyonlytagged[0];
        this.verifyonlytaggedCost = verifyonlytagged[1];
        this.verifyonlytaggedWDV = verifyonlytagged[2];

        var nonverifytagged = this.bindData[0].nonverifytaggedCount.split(',');
        this.nonverifytaggedCount = nonverifytagged[0];
        this.nonverifytaggedCost = nonverifytagged[1];
        this.nonverifytaggedWDV = nonverifytagged[2];

        var notfoundtag = this.bindData[0].notfoundtagCount.split(',');
        this.notfoundtagCount = notfoundtag[0];
        this.notfoundtagCost = notfoundtag[1];
        this.notfoundtagWDV = notfoundtag[2];

        var additional = this.bindData[0].additionalcount.split(',');
        this.additionalcount = additional[0];

        //Inventory
        var tagged = this.bindData[0].taggedCount.split(',');
        this.taggedCount = tagged[0];
        this.taggedCost = tagged[1];
        this.taggedWDV = tagged[2];

        // Sum
        var underInv = this.bindData[0].underInvCount.split(',');
        this.underInvCount = underInv[0];
        this.underInvCost = underInv[1];
        this.underInvWDV = underInv[2];

        var availInv = this.bindData[0].availInvCount.split(',');
        this.availInvCount = availInv[0];
        this.availInvCost = availInv[1];
        this.availInvdWDV = availInv[2];

        //For Inventory
        var verify = this.bindData[0].verifyCount.split(',');
        this.verifyCount = verify[0];
        this.verifyCost = verify[1];
        this.verifyWDV = verify[2];

        var pendingInv = this.bindData[0].pendingInvCount.split(',');
        this.pendingInvCount = pendingInv[0];
        this.pendingInvCost = pendingInv[1];
        this.pendingInvdWDV = pendingInv[2];

        var notfound = this.bindData[0].notfoundCount.split(',');
        this.notfoundCount = notfound[0];
        this.notfoundCost = notfound[1];
        this.notfoundWDV = notfound[2];

        var additionalInv = this.bindData[0].additionalInvcount.split(',');
        this.additionalInvcount = additionalInv[0];
        this.additionalInvCost = additionalInv[1];
        this.additionalInvWDV = additionalInv[2];

        var damageInv = this.bindData[0].damageInvCount.split(',');
        this.damageInvCount = damageInv[0];
        this.damageInvCost = damageInv[1];
        this.damageInvWDV = damageInv[2];

        var notuseInv = this.bindData[0].notuseInvCount.split(',');
        this.notuseInvCount = notuseInv[0];
        this.notuseInvCost = notuseInv[1];
        this.notuseInvdWDV = notuseInv[2];

        //Not For Inventory
        var notInv = this.bindData[0].notInvCount.split(',');
        this.notInvCount = notInv[0];
        this.notInvCost = notInv[1];
        this.notInvWDV = notInv[2];

        var verifyonly = this.bindData[0].verifyonlyCount.split(',');
        this.verifyonlyCount = verifyonly[0];
        this.verifyonlyCost = verifyonly[1];
        this.verifyonlyWDV = verifyonly[2];

        var nonverify = this.bindData[0].nonverifyCount.split(',');
        this.nonverifyCount = nonverify[0];
        this.nonverifyCost = nonverify[1];
        this.nonverifyWDV = nonverify[2];

        var retire = this.bindData[0].retireCount.split(',');
        this.retireCount = retire[0];
        this.retireCost = retire[1];
        this.retireWDV = retire[2];
        //End 

        // //Overdue Dates
        // var tempAllocation = this.bindData[0].tempAllocationCount.split(',');
        // this.tempAllocationCount = tempAllocation[0];
        // this.tempAllocationCost = tempAllocation[1];
        // this.tempAllocationWDV = tempAllocation[2];

        // var onloan = this.bindData[0].onloanCount.split(',');
        // this.onLoanCount = onloan[0];
        // this.onLoanCost = onloan[1];
        // this.onLoanWDV = onloan[2];

        // var Thirdparty = this.bindData[0].ThirdpartyCount.split(',');
        // this.ThirdpartyCount = Thirdparty[0];
        // this.ThirdpartyCost = Thirdparty[1];
        // this.ThirdpartyWDV = Thirdparty[2];

        // //Asset At Risk
        // var Intransit = this.bindData[0].IntransitCount.split(',');
        // this.IntransitCount = Intransit[0];
        // this.IntransitCost = Intransit[1];
        // this.IntransitWDV = Intransit[2];

        // var empnotavail = this.bindData[0].empnotavailCount.split(',');
        // this.empnotavailCount = empnotavail[0];
        // this.empnotavailCost = empnotavail[1];
        // this.empnotavailWDV = empnotavail[2];

        // var notscan = this.bindData[0].notscanCount.split(',');
        // this.notscanCount = notscan[0];
        // this.notscanCost = notscan[1];
        // this.notscanWDV = notscan[2];

        // var nottag = this.bindData[0].nottagCount.split(',');
        // this.nottagCount = nottag[0];
        // this.nottagCost = nottag[1];
        // this.nottagWDV = nottag[2];
      }
    })
    //this.GetCountForDashBoardInventoryDueDates(assetDetails);

  }

  bindData2: any;
  currency: any;
  // CurrencyIcon : any;
  UpcomingDueDateslst: any;
  MissingProjectsListslst: any;
  GetCountForDashBoardInventoryDueDates(assetDetails) {
    this.rps.GetCountForDashBoardInventoryDueDates(assetDetails).subscribe(r => {
      debugger;
      this.bindData2 = JSON.parse(r);
      // this.currency = this.bindData2.currency ;
      // this.CurrencyIcon = this.bindData2.CurrencyIcon ;
      // this.UpcomingDueDateslst = this.bindData2.UpcomingProjectsLists ;
      // this.MissingProjectsListslst = this.bindData2.MissingProjectsLists ;
    })
  }
  ListOfPagePermission: any[] = [];
  openFilter() {
    debugger;
    var configdata = {
      LocationIdList: this.LocationIdList,
      UserId: this.UserId,
      GroupId: this.GroupId,
      CompanyId: this.CompanyId,
      RegionId: this.RegionId,
      layerid: this.layerid,
      CategoryIdList: this.CategoryIdList,
      SbuList: this.SbuList,
      RegionIdList: this.RegionIdList,
      CompanyIdList: this.CompanyIdList,
      ListOfLoc :this.ListOfLoc,
      ListOfCategory:this.ListOfCategory

    }

    const dialogRef = this.dialog.open(DashboardFilterDialogComponent, {
      width: "500px",
      disableClose: true,
      data: { configdata: configdata }
    });
    dialogRef.afterClosed().subscribe(result => {
      debugger;
      if (!!result) {
        this.LocationIdList = result.LocationIdList;
        this.CategoryIdList = result.CategoryIdList;
        this.SbuList = result.SbuList;
        this.RegionIdList = result.RegionIdList;
        this.CompanyIdList = result.CompanyIdList;
        this.GetDashBoardCount();
      }
    });
  }

  PageNavigation(PageId, Path) {
    debugger;
    this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.RegionId, PageId).subscribe(r => {
      debugger;
      this.ListOfPagePermission = JSON.parse(r);
      if (this.ListOfPagePermission.length == 0) {
        this.alertService.alert({ message: this.message.NotAuthorisedToAccess, title: this.message.AssetrakSays })
          .subscribe(res => {

          })
      }
      else {
        this.router.navigateByUrl(Path);
      }
    })
  }

  GetCurrencyIcon() {
    this.CurrencyIcon = "";
    var companyId = this.CompanyId;
    this.cls.GetCurrencyIcon(companyId).subscribe(r => {
      if (!!r) {
        this.CurrencyIcon = r;
      }
    })
  }
}



