import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import * as header from '../../../../assets/Headers.json';
import * as resource from '../../../../assets/Resource.json';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';

import { ReconciliationService } from '../../../components/services/ReconciliationService';
import { CompanyLocationService } from '../../../components/services/CompanyLocationService';
import { UserMappingService } from '../../../components/services/UserMappingService';
import { CompanyBlockService } from '../../../components/services/CompanyBlockService';
import { GroupService } from '../../../components/services/GroupService';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { UserService } from '../../../components/services/UserService';
import { AssetService } from '../../../components/services/AssetService';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { assetTabsComponent } from '../../../components/partialView/assetDetails/asset_tabs.component';
import { AssetRetirementApprovalDetailsDialogComponent } from '../dialog/asset-retirement-approval-details-dialog/asset-retirement-approval-details-dialog.component';
import { AssetRetireService } from '../../../components/services/AssetRetireService';
import { GetFieldsComponent } from 'app/components/partialView/get-fields/get-fields.component';
import { ViewUploadDocumentsDialogComponent } from 'app/components/partialView/view-upload-documents-dialog/view-upload-documents-dialog.component';
import { Sort } from '@angular/material/sort';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from "@angular/common/http";
export interface SqSort extends Sort {
  //   /** The id of the column being sorted. */
  // active: string;

  // /** The sort direction. */
  // direction: SortDirection;
  type: string;
}
@Component({
  selector: 'app-asset-retirement-list',
  templateUrl: './asset-retirement-list.component.html',
  styleUrls: ['./asset-retirement-list.component.scss']
})
export class AssetRetirementListComponent implements OnInit {

  Headers: any ;
  message: any = (resource as any).default;

  dialogForm: FormGroup;
  numRows: number;
  selectedValue: string;
  IsDisabled: boolean = true;
  setflag: boolean = false;
  private isButtonVisible = false;
  private isApprovalLevelButtonVisible = false;
  private isButtonVisibleADL2 = false;
  private isButtonVisibleADL3 = false;
  private isButtonVisibleSupplier = false;
  private isButtonVisibleGRNNo = false;
  private isButtonVisibleSerialNo = false;
  private isButtonVisibleITSerialNo = false;
  private isButtonVisiblePONumber = false;
  private isButtonVisibleEqipmentNumber = false;
  private isButtonVisibleCPPNumber = false;
  private isButtonVisibleBarCode = false;

  public bindData: any[];
  public arrlength = 0;
  public arr = [];
  public newdataSource = [];
  public isallchk: boolean;
  public getselectedData: any[] = [];
  public selecteddatasource: any[] = [];
  public appliedfilters: any[] = [];

  /////Filter Instance/////////
  AssetNoFilter = new FormControl();
  ApprovalLevelFilter = new FormControl();
  AssetClassFilter = new FormControl();
  TransferTypeFilter = new FormControl();

  filteredValues = {
    AssetNo: '', ApprovalLevel: '', SubNo: '', CapitalizationDate: '',
    AssetClass: '', AssetType: '',
    AssetSubType: '', UOM: '', AssetName: '',
    AssetDescription: '', Qty: '', Cost: '', WDV: '',
    EquipmentNO: '', AssetCondition: '', AssetCriticality: ''
  };

  transferTypelst: any[] = [];
  result: any[] = [];
  TRANSFERTYPE: any[] = [];
  transfertype: any[] = [];
  CompanyId: any = 2;
  GroupId: any = 2;
  UserId: any = 5;
  IsCompanyAdmin: any = 1;
  IslayerDisplay: any;
  layerid: any;
  Layertext: any;
  HeaderLayerText: any;
  serachtext: any;
  colunname: any;

  public assetlifeMultiCtrl: any;

  public retirementIdMultiCtrl: any;
  public retirementIdFilterCtrl: FormControl = new FormControl();
  public filteredretirementIdMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public cityMultiCtrl: any;
  public cityMultiFilterCtrl: FormControl = new FormControl();
  public filteredCityMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public companyMultiCtrl: any;
  public companyMultiFilterCtrl: FormControl = new FormControl();
  public filteredCompanyMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public plantMultiCtrl: any;
  public plantMultiFilterCtrl: FormControl = new FormControl();
  public filteredPlantsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public categoryMultiCtrl: any;
  public categoryFilterCtrl: FormControl = new FormControl();
  public filteredcategoryMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public assetclassMultiCtrl: any;
  public assetclassFilterCtrl: FormControl = new FormControl();
  public filteredAssetClassMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public approvalLevelMultiCtrl: any;
  public approvalLevelFilterCtrl: FormControl = new FormControl();
  public filteredapprovalLevelMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public assettypeMultiCtrl: any;
  public assettypeFilterCtrl: FormControl = new FormControl();
  public filteredAssetTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public assetsubtypeMultiCtrl: any;
  public assetsubtypeFilterCtrl: FormControl = new FormControl();
  public filteredAssetSubTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  protected _onDestroy = new Subject<void>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public sessionId: any;

  displayedColumns: any[] = ['select', '2', '3', '4', '5', '6', '26', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  tempdatasource: any[] = [];

  AssetLifeData: any[] = [];

  ListOfApprovalLevel: any[] = [
    { value: 'Pending Approval', viewValue: 'Pending Approval' }
  ];

  constructor(public dialog: MatDialog,
    public rs: ReconciliationService,
    public cls: CompanyLocationService,
    public ums: UserMappingService,
    public cbs: CompanyBlockService,
    public gs: GroupService,
    public toastr: ToastrService,
    private fb: FormBuilder,
    public confirmService: AppConfirmService,
    private loader: AppLoaderService,
    public alertService: MessageAlertService,
    public us: UserService,
    public as: AssetService,
    public ars: AssetRetireService,
    private jwtAuth:JwtAuthService,
    private http: HttpClient) 
    {
      // this.Headers = this.jwtAuth.getHeaders();

      // this.AssetLifeData = [
      //   { value: 'Active', viewValue: this.Headers.Active },
      //   { value: 'Expire', viewValue: this.Headers.Expired },
      // ];
  }
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  paginationParams: any;
  ListOfField: any[] = [];
  ListOfFilter: any[] = [];
  ListOfFilterName: any[] = [];
  ListOfCategory: any[] = [];
  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  CompanyIdList: any[] = [];
  GroupIdList: any[] = [];
  RegionIdList: any[] = [];
  ngOnInit(): void {
    debugger;
    this.GetHeaderFileData();

    this.paginationParams = {
      pageSize: 50,
      currentPageIndex: 0,
      endIndex: 0,
      startIndex: 0,
      totalCount: 0,
    }
    this.assetlifeMultiCtrl = "";
    this.dialogForm = this.fb.group({
      commentCtrl: [''],
    })

    this.layerid = 4;
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
    
    
    this.GetInitiatedData1();

    this.AssetNoFilter.valueChanges.subscribe((AssetNoFilterValue) => {
      this.filteredValues['AssetNo'] = AssetNoFilterValue;
      this.dataSource.filter = this.filteredValues.AssetNo;
    });
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  public async GetHeaderFileData() {   
    debugger;
    var apiUrl = environment.apiURL + 'GroupService.svc/GetHeaderFileData';
    var data:any  = await this.http.get(apiUrl).toPromise();    
    
    this.Headers = JSON.parse(data);
    console.log(this.Headers);

      this.AssetLifeData = [
        { value: 'Active', viewValue: this.Headers.Active },
        { value: 'Expire', viewValue: this.Headers.Expired },
      ];

  };
  
  xyz: any;
  flag: any;
  externalpage: any;
  Retireid: any;
  getParam() {
    debugger;
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < url.length; i++) {
      var params = url[i].split("=");
      if (params[0] == 'xyz') {
        var xyz = params[1];
        //this.xyz = xyz.replace(/\%2B/g, "+").replace(/\%21/g, "!").replace(/\%23/g, "#").replace(/\%24/g, "$").replace(/\%26/g, "&").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")").replace(/\%2A/g, "*").replace(/\%2C/g, ",").replace(/\%2F/g, "/").replace(/\%3A/g, ":").replace(/\%3B/g, ";").replace(/\%3D/g, "=").replace(/\%3F/g, "?").replace(/\%40/g, "@").replace(/\%5B/g, "[").replace(/\%5D/g, "]");
        this.xyz = xyz;
      }
      if (params[0] == 'flag') {
        var flag = params[1];
        //this.flag = flag.replace(/\%2B/g, "+").replace(/\%21/g, "!").replace(/\%23/g, "#").replace(/\%24/g, "$").replace(/\%26/g, "&").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")").replace(/\%2A/g, "*").replace(/\%2C/g, ",").replace(/\%2F/g, "/").replace(/\%3A/g, ":").replace(/\%3B/g, ";").replace(/\%3D/g, "=").replace(/\%3F/g, "?").replace(/\%40/g, "@").replace(/\%5B/g, "[").replace(/\%5D/g, "]");
        this.flag = flag;
      }
      if (params[0] == 'externalpage') {
        var externalpage = params[1];
        //this.externalpage = externalpage.replace(/\%2B/g, "+").replace(/\%21/g, "!").replace(/\%23/g, "#").replace(/\%24/g, "$").replace(/\%26/g, "&").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")").replace(/\%2A/g, "*").replace(/\%2C/g, ",").replace(/\%2F/g, "/").replace(/\%3A/g, ":").replace(/\%3B/g, ";").replace(/\%3D/g, "=").replace(/\%3F/g, "?").replace(/\%40/g, "@").replace(/\%5B/g, "[").replace(/\%5D/g, "]");
        this.externalpage = externalpage;
      }
      if (params[0] == 'Retireid') {
        var Retireid = params[1];
        //this.Retireid = Retireid.replace(/\%2B/g, "+").replace(/\%21/g, "!").replace(/\%23/g, "#").replace(/\%24/g, "$").replace(/\%26/g, "&").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")").replace(/\%2A/g, "*").replace(/\%2C/g, ",").replace(/\%2F/g, "/").replace(/\%3A/g, ":").replace(/\%3B/g, ";").replace(/\%3D/g, "=").replace(/\%3F/g, "?").replace(/\%40/g, "@").replace(/\%5B/g, "[").replace(/\%5D/g, "]");
        this.Retireid = Retireid;
      }
    }

  }
  ListOfRetiredId: any[] = [];
  ListOfRetiredId1: any[] = [];
  ListOfLoc1: any[] = [];
  ListOfLoc2: any[] = [];
  ListOfCategory1: any[] = [];
  GetInitiatedData() {
    debugger;
    this.as.ApprovalListbyUserIdStatusAndRetiredAssetID(this.xyz, this.flag, this.Retireid).subscribe(r => {
      debugger;
      if (!!r) {
        var data = JSON.parse(r);
        console.log(data);
        this.CompanyId = data.CompanyId;
        this.UserId = data.UserId;
        this.sessionId = Number(this.UserId);
        if (!!data.CompanyList) {
          data.CompanyList.forEach(element => {
            this.CompanyIdList.push(element);
            if (element.CompanyId == this.CompanyId) {
              this.companyMultiCtrl = element;
            }
          });
          this.getFilterCompany();
        }
        if (!!data.GroupList) {
          data.GroupList.forEach(element => {
            this.GroupIdList.push(element);
          });
        }
        if (!!data.RegionList) {
          data.RegionList.forEach(element => {
            this.RegionIdList.push(element);
          });
        }
        if (!!data.LocationList) {
          data.LocationList.forEach(element => {
            this.ListOfLoc.push(element);
            this.ListOfLoc1.push(element);
          });
        }
        if (!!data.CategoryList) {
          data.CategoryList.forEach(element => {
            this.ListOfCategory.push(element);
            this.ListOfCategory1.push(element);
          });
        }
        if (!!data.RetireAssetIdlist) {
          data.RetireAssetIdlist.forEach(element => {
            this.ListOfRetiredId1.push(element);
            if (element == data.RetireAssetId) {
              this.retirementIdMultiCtrl = element;
            }
          });
        }
        else {
          this.ListOfRetiredId.push(data.RetireAssetId);
          this.retirementIdMultiCtrl = data.RetireAssetId;
          this.getFilterTransferId();
        }

        this.GetLocationByCompanyId(this.CompanyId);
        this.GetAssetsToApproveRetire();
        
      }
      
    })
  }

  GetLocationByCompanyId(CompanyId) {
    debugger;
    this.plantMultiCtrl = "";
    this.CompanyId = CompanyId;
    this.ListOfLoc = this.ListOfLoc1.filter(x => x.CompanyId == CompanyId);
    this.ListOfLoc2 = this.ListOfLoc;
    this.ListOfSBU = this.UniqueArraybyId(this.ListOfLoc, this.Layertext);
    this.getFilterCityType();
    this.getFilterPlantType();

    this.GetCategoryByCompanyId(this.CompanyId);
    if (this.ListOfRetiredId1.length > 0) {
      this.GetAllRetiredId();
    }
  }

  GetCategoryByCompanyId(CompanyId) {
    this.ListOfCategory = this.ListOfCategory1.filter(x => x.CompanyId == CompanyId);
    this.getFilterCategoryType();
  }

  onchangeSBU(value) {
    debugger
    if (!!value) {
      this.ListOfLoc = this.ListOfLoc2.filter(x => x[this.Layertext].indexOf(value) > -1);
      this.getFilterPlantType();
    }
    else {
      this.ListOfLoc = this.ListOfLoc2.filter(x => x);
      this.getFilterPlantType();
    }
  }

  UniqueArraybyId(collection, keyname) {
    var output = [], keys = [];
    collection.forEach(item => {
      var key = item[keyname];
      if (keys.indexOf(key) === -1) {
        keys.push(key);
        output.push(item);
      }
    });
    return output;
  };

  GetInitiatedData1() {
    debugger;
    let url1 = this.gs.GetFieldListByPageIdbyLink(48,this.UserId,"true");
    let url2 = this.gs.GetFilterIDlistByPageId(48);
    forkJoin([url1, url2]).subscribe(results => {
      if (!!results[0]) {
        this.ListOfField = JSON.parse(results[0]);
        this.displayedColumns = this.ListOfField;
        this.displayedColumns = this.displayedColumns.filter(x => x.Custom2 == "1").map(choice => choice.Custom1);
        this.displayedColumns = ['Select'].concat(this.displayedColumns);
        // this.displayedColumns = this.displayedColumns.concat("ApprovalStatus");
        // this.displayedColumns = this.displayedColumns.concat("ApprovalLevel");
        // this.displayedColumns = this.displayedColumns.concat("PendingWith");
        // this.displayedColumns = this.displayedColumns.concat("ApprovalDetails");
        console.log('fields:', this.displayedColumns)
      }
      if (!!results[1]) {
        this.ListOfFilter = JSON.parse(results[1]);
        if (!!this.ListOfFilter) {
          this.ListOfFilter.forEach(x => this.ListOfFilterName.push(x.FilterName))
        }
        console.log(this.ListOfFilter);
      }
      this.loader.close();
      this.getParam();
      this.GetInitiatedData();
    })
  }

  editGridpop() {
    debugger
    let title = 'Edit Grid Display';
    const dialogRef = this.dialog.open(GetFieldsComponent, {
      width: '60vw',
      height: 'auto',
      data: { title: title, payload: this.ListOfField }
    })
    dialogRef.afterClosed().subscribe(result => {
      debugger
      if (!!result) {
        console.log(result)
        this.ListOfField = result;
        this.displayedColumns = this.ListOfField;
        console.log(this.displayedColumns);
        this.displayedColumns = this.ListOfField.filter(x => x.Custom2 == "1" ).map(choice => choice.Custom1);
        this.displayedColumns = ['Select'].concat(this.displayedColumns);
      }
    })
  }

  viewDocuments(element) {
    var RetiredId = !!this.retirementIdMultiCtrl ? this.retirementIdMultiCtrl : 0
    this.ars.GetDocumentlistByRetireAssetID(RetiredId).subscribe(r => {
      debugger;
      if (!!r) {
        var documentList = [];
        documentList = JSON.parse(r);
        console.log("Doc", documentList)
        const dialogRef = this.dialog.open(ViewUploadDocumentsDialogComponent, {
          width: '980px',
          disableClose: true,
          data: { title: "", payload: documentList }
        });
        dialogRef.afterClosed().subscribe(result => {
          debugger;
        })
      }

    })
  }

  getFilterCategoryType() {
    this.filteredcategoryMulti.next(this.ListOfCategory.slice());
    this.categoryFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCategoryMulti();
      });
  }
  protected filterCategoryMulti() {
    if (!this.ListOfCategory) {
      return;
    }
    let search = this.categoryFilterCtrl.value;
    if (!search) {
      this.filteredcategoryMulti.next(this.ListOfCategory.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredcategoryMulti.next(
      this.ListOfCategory.filter(x => x.AssetCategoryName.toLowerCase().indexOf(search) > -1)
    );
  }

  //========= City ===========
  checkoutApproval1: any;
  ListOfLoc: any[] = [];
  ListOfSBU: any[] = [];
  ListOfBlocks: any[] = [];
  AssetClassOrcosteCenter: any;

  getFilterCityType() {
    debugger;
    this.filteredCityMulti.next(this.ListOfSBU.slice());
    this.cityMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCityMulti();
      });
  }
  protected filterCityMulti() {
    debugger;
    if (!this.ListOfSBU) {
      return;
    }
    let search = this.cityMultiFilterCtrl.value;
    if (!search) {
      this.filteredCityMulti.next(this.ListOfSBU.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCityMulti.next(
      this.ListOfSBU.filter(x => x.City.toLowerCase().indexOf(search) > -1)
    );
  }
  getFilterPlantType() {
    debugger;
    this.filteredPlantsMulti.next(this.ListOfLoc.slice());
    this.plantMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPlantsMulti();
      });
  }
  protected filterPlantsMulti() {
    debugger;
    if (!this.ListOfLoc) {
      return;
    }
    let search = this.plantMultiFilterCtrl.value;
    if (!search) {
      this.filteredPlantsMulti.next(this.ListOfLoc.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredPlantsMulti.next(
      this.ListOfLoc.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1)
    );
  }
  getFilterCompany() {
    debugger;
    this.filteredCompanyMulti.next(this.CompanyIdList.slice());
    this.companyMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCompanyMulti();
      });
  }
  protected filterCompanyMulti() {
    debugger;
    if (!this.CompanyIdList) {
      return;
    }
    let search = this.companyMultiFilterCtrl.value;
    if (!search) {
      this.filteredCompanyMulti.next(this.CompanyIdList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCompanyMulti.next(
      this.CompanyIdList.filter(x => x.CompanyName.toLowerCase().indexOf(search) > -1)
    );
  }

  getFilterAssetClassType() {
    this.filteredAssetClassMulti.next(this.ListOfBlocks.slice());
    this.assetclassFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAssetclassMulti();
      });
  }
  protected filterAssetclassMulti() {
    if (!this.ListOfBlocks) {
      return;
    }
    let search = this.assetclassFilterCtrl.value;
    if (!search) {
      this.filteredAssetClassMulti.next(this.ListOfBlocks.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredAssetClassMulti.next(
      this.ListOfBlocks.filter(x => x.BlockName.toLowerCase().indexOf(search) > -1)
    );
  }
  GetAllRetiredId() {
    debugger;
    var LocationIdList = [];
    if (!!this.plantMultiCtrl) {
      this.plantMultiCtrl.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }
    else {
      this.ListOfLoc.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }
    var assetDetails = {
      CompanyIdList: [this.CompanyId],
      ListRegionId: [],
      LocationIdList: LocationIdList,
      AssetLife: !this.assetlifeMultiCtrl ? "All" : this.assetlifeMultiCtrl,
      UserId: this.UserId
    }

    this.ars.GetAllRetiredAssetId(assetDetails).subscribe(r => {
      debugger;
      this.ListOfRetiredId = [];
      var data = JSON.parse(r);
      data.forEach(x => {
        var idx = this.ListOfRetiredId1.indexOf(x);
        if (idx > -1) {
          this.ListOfRetiredId.push(x);
        }
      })
      console.log(this.ListOfRetiredId);
      this.getFilterTransferId()
    })
  }
  getFilterTransferId() {
    this.filteredretirementIdMulti.next(this.ListOfRetiredId.slice());
    this.retirementIdFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterTransferIdMulti();
      });
  }
  protected filterTransferIdMulti() {
    if (!this.ListOfRetiredId) {
      return;
    }
    let search = this.retirementIdFilterCtrl.value;
    if (!search) {
      this.filteredretirementIdMulti.next(this.ListOfRetiredId.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredretirementIdMulti.next(
      this.ListOfRetiredId.filter(x => x.toLowerCase().indexOf(search) > -1)
    );
  }
  toggleSelectAllcategory(selectAllValue: boolean) {
    debugger;
    this.filteredcategoryMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        debugger;
        if (selectAllValue) {
          this.categoryMultiCtrl.patchValue(val);
        } else {
          this.categoryMultiCtrl.patchValue([]);
        }
      });
  }

  handlePage(pageEvent: PageEvent) {
    debugger;
    this.paginationParams.pageSize = pageEvent.pageSize;
    this.paginationParams.currentPageIndex = pageEvent.pageIndex;
    this.paginationParams.endIndex = (this.paginationParams.currentPageIndex + 1) * pageEvent.pageSize;
    this.paginationParams.startIndex = this.paginationParams.currentPageIndex * pageEvent.pageSize;
    this.GetAssetsToApproveRetireBindData("")
  }
  GetAssetsToApproveRetire() {
    this.selection.clear();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.pendingApprovalId = [];
    this.infomationRequestId = [];
    this.reinitiationRequestId = [];
    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;
    this.GetAssetsToApproveRetireBindData("OnPageload");
  }

  ApprovalStatus: any[] = [];
  IsSearch: boolean = false;
  issort: boolean = false;
  isExport: boolean = false;

  GetAssetsToApproveRetireBindData(Action) {
    debugger;
    this.loader.open();
    var isAdmin = 1;//this.IsCompanyAdmin;//!$rootScope.globals.currentUser.IsCompanyAdmin ? 0 : $rootScope.globals.currentUser.IsCompanyAdmin;
    var isRetirementLocation = 0;
    var retirementLocations = (isAdmin === 0) ? (!isRetirementLocation ? isRetirementLocation : "") : "";
    var AssetLife = !this.assetlifeMultiCtrl ? "All" : this.assetlifeMultiCtrl;
    var AssetConditionId = 4;

    var LocationIdList = [];
    var SbuList = [];
    var CategoryIdList = [];
    var TransferIdList = [];
    var BlockIdList = [];
    var TAIdList = [];
    var subTypeOfAssetList = [];
    this.ApprovalStatus = [];
    if (!!this.plantMultiCtrl) {
      this.plantMultiCtrl.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }
    else {
      this.ListOfLoc.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }

    if (!!this.categoryMultiCtrl) {
      this.categoryMultiCtrl.forEach(x => {
        CategoryIdList.push(x.AssetCategoryId);
      })
    }

    if (!!this.assetclassMultiCtrl) {
      this.assetclassMultiCtrl.forEach(x => {
        BlockIdList.push(x.Id);
      })
    }

    if (!!this.approvalLevelMultiCtrl && this.approvalLevelMultiCtrl.length > 0) {
      this.approvalLevelMultiCtrl.forEach(x => {
        this.ApprovalStatus.push(x);
      })
    }
    else {
      this.ListOfApprovalLevel.forEach(x => {
        this.ApprovalStatus.push(x.value);
      })
    }

    //===== Sorting and Searching ===
    this.isExport = false;
    this.issort = false;
    this.IsSearch = false;
    this.serachtext = "";
    this.colunname = "";
    if (Action === 'IsExport') {
      this.isExport = true;
    }
    if (Action == "SearchText" && this.variable != "" && !!this.variable && !!this.variable1) {
      this.serachtext = this.variable;
      this.colunname = this.variable1;
      this.IsSearch = true;
    }
    if (Action == "Sort" && !!this.variable1) {
      this.issort = true;
      this.colunname = this.variable1;
    }

    var assetDetails = {
      //locationId: !!this.plantMultiCtrl ? this.plantMultiCtrl[0].LocationId : 0,
      BlockId: !!this.assetclassMultiCtrl ? this.assetclassMultiCtrl[0].Id : 0,
      retirementLocations: retirementLocations,
      isAdmin: isAdmin,
      CompanyId: !this.companyMultiCtrl ? 0 : this.companyMultiCtrl.CompanyId,
      pageNo: this.paginationParams.currentPageIndex + 1,
      pageSize: this.paginationParams.pageSize,
      UserId: this.UserId,
      IsSearch: false,
      AssetLife: AssetLife,
      AssetConditionId: AssetConditionId,
      RetiredId: !!this.retirementIdMultiCtrl ? this.retirementIdMultiCtrl : 0,
      ApprovalLevel: "All",
      IsExport: false,
      LocationIdList: LocationIdList,
      AssetsClassList: [],
      TAIdList: TAIdList,
      subTypeOfAssetList: subTypeOfAssetList,
      SbuList: SbuList,
      CategoryIdList: CategoryIdList,
      ApprovalStatus: this.ApprovalStatus,
      SearchText: this.serachtext,
      columnName: this.colunname,
      issorting: this.issort,
      PageId : 48
    }
    this.ars.GetAssetsToApproveRetire(assetDetails).subscribe(r => {
      debugger;
      this.loader.close();
      this.bindData = [];
      if (!!r && r != "[]" && r !="Please check with another RetirementID") {
        this.bindData = JSON.parse(r);
      }
      this.paginationParams.totalCount = 0;
      if (!!this.bindData && this.bindData.length > 0) {
        this.paginationParams.totalCount = this.bindData[0].AssetListCount;
      }
      this.onChangeDataSource(this.bindData);
    })
  }
  onChangeDataSource(value) {
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.sort = this.sort;
    this.isAllSelected = false;
    var ids = [];
    debugger;
    for (var i = 0; i < this.bindData.length; i++) {
      var idx = this.getselectedIds.indexOf(this.bindData[i].PreFarId);
      if (idx > -1) {
        ids.push(this.bindData[i].PreFarId);
      }
    }
    if (this.bindData.length > 0 && this.bindData.length == ids.length) {
      this.isAllSelected = true;
    }
  }
  openApprovalDetails(element) {
    const dialogRef = this.dialog.open(AssetRetirementApprovalDetailsDialogComponent, {
      width: '980px',
      disableClose: true,
      data: { title: "", payload: element ,UserId:this.UserId}
    });
    dialogRef.afterClosed().subscribe(result => {
      debugger;
    })
  }
  numSelected: any = 0;
  getselectedIds: any[] = [];
  isAllSelected: boolean = false;
  masterToggle() {
    debugger;
    // this.isAllSelected() ?
    //   this.selection.clear() :
    //   this.dataSource.data.forEach(row => this.selection.select(row));
    this.isAllSelected = !this.isAllSelected;
    this.selection.clear();
    this.getselectedIds = [];
    this.pendingApprovalId = [];
    this.infomationRequestId = [];
    this.reinitiationRequestId = [];
    if (this.isAllSelected == true) {
      // this.dataSource.data.forEach(row => {
      //   var idx = row.UserIDlist.indexOf(this.sessionId);
      //   if (idx > -1) {
      //     this.selection.select(row)
      //   }
      // });
      this.dataSource.data.forEach(row => {
        this.selection.select(row)
      });
    }
    // else {
    //   this.dataSource.data.forEach(row => this.selection.toggle(row));
    // }
    debugger;
    this.numSelected = this.selection.selected.length;
    if (this.numSelected > 0) {
      this.selection.selected.forEach(row => {
        this.getselectedIds.push(row.PreFarId)
        if (row.ApprovalStatus == 'Pending Approval') {
          this.pendingApprovalId.push(row.PreFarId);
        }
        if (row.ApprovalStatus == 'Information Request') {
          this.infomationRequestId.push(row.PreFarId);
        }
        if (row.ApprovalStatus == 'Reinitiation Request') {
          this.reinitiationRequestId.push(row.PreFarId);
        }
      })
    }
  }
  pendingApprovalId: any[] = [];
  infomationRequestId: any[] = [];
  reinitiationRequestId: any[] = [];
  isSelected(row) {
    debugger;
    this.selection.toggle(row)
    this.numSelected = this.selection.selected.length;
    var idx = this.getselectedIds.indexOf(row.PreFarId);
    if (idx > -1) {
      this.getselectedIds.splice(idx, 1);
    }
    else {
      this.getselectedIds.push(row.PreFarId);
    }
    //===========
    if (row.ApprovalStatus == 'Pending Approval') {
      var idx = this.pendingApprovalId.indexOf(row.PreFarId);
      if (idx > -1) {
        this.pendingApprovalId.splice(idx, 1);
      }
      else {
        this.pendingApprovalId.push(row.PreFarId);
      }
    }
    if (row.ApprovalStatus == 'Information Request') {
      var idx = this.infomationRequestId.indexOf(row.PreFarId);
      if (idx > -1) {
        this.infomationRequestId.splice(idx, 1);
      }
      else {
        this.infomationRequestId.push(row.PreFarId);
      }
    }
    if (row.ApprovalStatus == 'Reinitiation Request') {
      var idx = this.reinitiationRequestId.indexOf(row.PreFarId);
      if (idx > -1) {
        this.reinitiationRequestId.splice(idx, 1);
      }
      else {
        this.reinitiationRequestId.push(row.PreFarId);
      }
    }
  }
  Submit(action) {
    debugger;
    var msg = "";
    var Comment = this.dialogForm.get('commentCtrl').value;
    Comment = Comment.trim();
    if (!Comment && action == '0') {
      this.toastr.warning('Comment is mandatory for requesting information and rejecting', this.message.AssetrakSays);
      return false;
    }
    if (action == '1') { msg = this.message.ApproveRetirementNotification }
    if (action == '0') { msg = this.message.RejectRetirementNotification }

    if (this.selection.selected.length > 0) {
      this.confirmService.confirm({ message: msg, title: this.message.AssetrakSays })
        .subscribe(res => {
          if (!!res) {
            var prefarIds = [];
            var locationId = [];
            var AssetLife = !this.assetlifeMultiCtrl ? "All" : this.assetlifeMultiCtrl;
            const numSelected = this.selection.selected.length;
            for (var i = 0; i < numSelected; i++) {
              prefarIds.push(this.selection.selected[i].PreFarId);
              locationId = this.selection.selected[i].LocationId;
            }
            var assetsDetails = {
              AssetLife: AssetLife,
              AssetList: prefarIds.join(','),
              Option: action,
              UserId: this.UserId,
              rComment: this.dialogForm.get('commentCtrl').value,
              RequestInfoComment: this.dialogForm.get('commentCtrl').value,
              LocationId: locationId,
              CompanyId: !this.companyMultiCtrl ? 0 : this.companyMultiCtrl.CompanyId,
              ApprovalLevel: ""
            }
            this.loader.open();
            this.ars.MultipalAcceptRejectRetirementForAllApproveLevel(assetsDetails).subscribe(r => {
              debugger;
              this.loader.close();
              if (r == "Asset retirement action rejected") {
                this.toastr.success(this.message.Assetretirementactionrejected, this.message.AssetrakSays);
              }
              else if (r == "Asset Retirement Approved Successfully.") {
                this.toastr.success(this.message.AssetRetirementApproveSucess, this.message.AssetrakSays);
              }
              else if (r == "Asset Retired Successfully") {
                this.toastr.success(r, this.message.AssetrakSays);
              }
              else if (r == "Asset is part of project, so you cannot retire it from here.Please reject the changes") {
                this.toastr.warning(this.message.AssetPartofProjectRetire, this.message.AssetrakSays);
              }
              else if (r == "not authorized") {
                this.toastr.warning(this.message.NotAuthorizedtoReject, this.message.AssetrakSays);
              }
              else if (r == "Asset already approved.") {
                this.toastr.error(this.message.ActionAlreadyTaken, this.message.AssetrakSays);
              }
              else {
                this.toastr.error(r, this.message.AssetrakSays);
              }
              this.clearSelected();
            })
          }
        })
    }
    else {
      this.toastr.warning(this.message.SelectAssetsToApproveReirement, this.message.AssetrakSays);
    }
  }
  RequestInformation() {
    debugger;
    if (this.selection.selected.length > 0) {
      var Comment = this.dialogForm.get('commentCtrl').value;
      Comment = Comment.trim();
      if (!Comment) {
        this.toastr.warning('Comment is mandatory for requesting information and rejecting', this.message.AssetrakSays);
        return false;
      }
      this.confirmService.confirm({ message: this.message.RequestInfoNotification, title: this.message.AssetrakSays })
        .subscribe(res => {
          if (!!res) {
            var prefarIds = [];
            var locationId = [];
            var AssetLife = !this.assetlifeMultiCtrl ? "All" : this.assetlifeMultiCtrl;
            const numSelected = this.selection.selected.length;
            for (var i = 0; i < numSelected; i++) {
              prefarIds.push(this.selection.selected[i].PreFarId);
              locationId = this.selection.selected[i].LocationId;
            }
            var assetsDetails = {
              AssetLife: AssetLife,
              AssetList: prefarIds.join(','),
              Option: 'RequestInformation',
              UserId: this.UserId,
              rComment: this.dialogForm.get('commentCtrl').value,
              RequestInfoComment: this.dialogForm.get('commentCtrl').value,
              LocationId: locationId,
              CompanyId: !this.companyMultiCtrl ? 0 : this.companyMultiCtrl.CompanyId,
              ApprovalLevel: ""
            }
            this.loader.open();
            this.ars.RequestForReSubmission(assetsDetails).subscribe(r => {
              debugger;
              this.loader.close();
              if (!!r) {
                this.toastr.success(this.message.RequestInfoSent, this.message.AssetrakSays);
              }
              else {
                this.toastr.error(r, this.message.AssetrakSays);
              }
              this.clearSelected();
            })
          }
        })
    }
    else {
      this.toastr.warning(this.message.SelectAssetsToApproveReirement, this.message.AssetrakSays);
    }
  }
  PageId =48;
  openPopUp(data: any = {}) {
    debugger;
    return null;
    let title = 'Add new member';
    const dialogRef = this.dialog.open(assetTabsComponent, {
      width: 'auto',
      disableClose: true,
      data: { title: title, payload: data.PreFarId , PageId:this.PageId }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
      })
  }
  toggleSelectAllCity(selectAllValue: boolean) {
    this.filteredCityMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.cityMultiCtrl.patchValue(val);
        } else {
          this.cityMultiCtrl.patchValue([]);
        }
      });
  }

  toggleSelectAll(selectAllValue: boolean) {
    this.filteredPlantsMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.plantMultiCtrl.patchValue(val);
        } else {
          this.plantMultiCtrl.patchValue([]);
        }
      });
  }

  toggleSelectAllassetclass(selectAllValue: boolean) {
    this.filteredAssetClassMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.assetclassMultiCtrl.patchValue(val);
        } else {
          this.assetclassMultiCtrl.patchValue([]);
        }
      });
  }
  toggleSelectAllapprovalLevel(selectAllValue: boolean) {
    this.filteredapprovalLevelMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.approvalLevelMultiCtrl.patchValue(val);
        } else {
          this.approvalLevelMultiCtrl.patchValue([]);
        }
      });
  }
  toggleSelectAllCompany(selectAllValue: boolean) {
    this.filteredCompanyMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.companyMultiCtrl.patchValue(val);
        } else {
          this.companyMultiCtrl.patchValue([]);
        }
      });
  }
  toggleSelectAllretirementId(selectAllValue: boolean) {
    this.filteredretirementIdMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          this.retirementIdMultiCtrl.patchValue(val);
        } else {
          this.retirementIdMultiCtrl.patchValue([]);
        }
      });
  }
  viewSelected() {
    this.getclear();
    this.paginationParams.totalCount = this.selection.selected.length;
    this.paginationParams.endIndex = this.selection.selected.length;
    this.onChangeDataSource(this.selection.selected);
  }
  clearSelectedView() {
    this.pendingApprovalId = [];
    this.infomationRequestId = [];
    this.reinitiationRequestId = [];
    this.selection.clear();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.paginationParams.totalCount = 0;
    if (!!this.bindData && this.bindData.length > 0) {
      this.paginationParams.totalCount = this.bindData[0].AssetListCount;
    }
    this.onChangeDataSource(this.bindData);
      
  }

  clearSelected() {
    this.selection.clear();
    this.numSelected = 0;
    this.getselectedIds = [];
    this.pendingApprovalId = [];
    this.infomationRequestId = [];
    this.reinitiationRequestId = [];
    this.dialogForm.get('commentCtrl').setValue("");
    this.GetAssetsToApproveRetireBindData("")
  }

  customFilterPredicate() {
    const myFilterPredicate = (data: any, filter: string): boolean => {

      let searchString = JSON.parse(filter);
      return data.AssetNo.toString().trim().toLowerCase().indexOf(searchString.AssetNo.toLowerCase()) !== -1 &&
        data.SubNo.toString().trim().indexOf(searchString.SubNo) !== -1 &&
        data.CapitalizationDate.toString().trim().toLowerCase().indexOf(searchString.CapitalizationDate.toLowerCase()) !== -1 &&
        data.AssetClass.toString().trim().toLowerCase().indexOf(searchString.AssetClass.toLowerCase()) !== -1 &&
        data.AssetType.toString().trim().toLowerCase().indexOf(searchString.AssetType.toLowerCase()) !== -1 &&
        data.AssetSubType.toString().trim().toLowerCase().indexOf(searchString.AssetSubType.toLowerCase()) !== -1 &&
        data.UOM.toString().trim().toLowerCase().indexOf(searchString.UOM.toLowerCase()) !== -1 &&
        data.AssetName.toString().trim().toLowerCase().indexOf(searchString.AssetName.toLowerCase()) !== -1 &&
        data.AssetDescription.toString().trim().toLowerCase().indexOf(searchString.AssetDescription.toLowerCase()) !== -1 &&
        data.Qty.trim().indexOf(searchString.Qty) !== -1 &&
        data.Cost.trim().toLowerCase().indexOf(searchString.Cost) !== -1 &&
        data.WDV.toString().trim().indexOf(searchString.WDV) !== -1 &&
        data.EquipmentNO.toString().trim().indexOf(searchString.EquipmentNO) !== -1 &&
        data.AssetCondition.toString().trim().toLowerCase().indexOf(searchString.AssetCondition.toLowerCase()) !== -1 &&
        data.AssetCriticality.toString().trim().toLowerCase().indexOf(searchString.AssetCriticality.toLowerCase()) !== -1;
    }
    return myFilterPredicate;
  }
  clearfilter() {
    if (this.appliedfilters.length > 0) {
      while (this.appliedfilters.length > 0) {
        this.appliedfilters.splice(this.appliedfilters.length - 1);
        console.log(this.appliedfilters);
      }
    }
  }

  variable: any;
  variable1: any;
  action: any[] = []
  SerchAssetid(columnName) {
    var flag = 0;
    this.variable1 = columnName;
    if (!!this.variable) {
      flag = 1;
    }
    this.variable = !this.AssetNoFilter.value ? "" : this.AssetNoFilter.value;
    this.variable = this.variable.trim();
    if (flag == 1 || !!this.variable) {
      this.paginator.pageIndex = 0;
      this.paginationParams.pageSize = 50;
      this.paginationParams.currentPageIndex = 0;
      this.GetAssetsToApproveRetireBindData("SearchText");
    }

  }


  ClearSerch(columnName, isflag) {

    this.variable1 = "";
    this.variable = "";
    this.AssetNoFilter.setValue("");

    this.SearchcolumnName = "";
    if (columnName == "AssetId") { this.isButtonVisible = !isflag; }
    else if (columnName == "Barcode") { this.isButtonVisibleBarCode = !isflag; }
    else if (columnName == "ADL2") { this.isButtonVisibleADL2 = !isflag; }
    else if (columnName == "ADL3") { this.isButtonVisibleADL3 = !isflag; }
    else if (columnName == "Suplier") { this.isButtonVisibleSupplier = !isflag; }
    else if (columnName == "GRNNo") { this.isButtonVisibleGRNNo = !isflag; }
    else if (columnName == "SerialNo") { this.isButtonVisibleSerialNo = !isflag; }
    else if (columnName == "ITSerialNo") { this.isButtonVisibleITSerialNo = !isflag; }
    else if (columnName == "PONumber") { this.isButtonVisibleITSerialNo = !isflag; }
    else if (columnName == "equipmentNo") { this.isButtonVisibleEqipmentNumber = !isflag; }
    else if (columnName == "CPPNumber") {
      this.isButtonVisibleCPPNumber = !isflag;
    }
    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;
    this.GetAssetsToApproveRetireBindData("");
  }

  SearchcolumnName: any;
  Serchicon(columnName, isflag) {

    this.variable = this.AssetNoFilter.setValue("");
    this.SearchcolumnName = columnName;
    this.getclear();
    if (columnName == "AssetId") {
      this.isButtonVisible = !isflag;
    }
    else if (columnName == "Barcode") {
      this.isButtonVisibleBarCode = !isflag;
    }
    else if (columnName == "ADL2") {
      this.isButtonVisibleADL2 = !isflag;
    }
    else if (columnName == "ADL3") {
      this.isButtonVisibleADL3 = !isflag;
    }
    else if (columnName == "Suplier") {
      this.isButtonVisibleSupplier = !isflag;
    }
    else if (columnName == "GRNNo") {
      this.isButtonVisibleGRNNo = !isflag;
    }
    else if (columnName == "SerialNo") {
      this.isButtonVisibleSerialNo = !isflag;
    }
    else if (columnName == "ITSerialNo") {
      this.isButtonVisibleITSerialNo = !isflag;
    }
    else if (columnName == "PONumber") {
      this.isButtonVisiblePONumber = !isflag;
    }
    else if (columnName == "equipmentNo") {
      this.isButtonVisibleEqipmentNumber = !isflag;
    }
    else if (columnName == "CPPNumber") {
      this.isButtonVisibleCPPNumber = !isflag;
    }

  }
  getclear() {
    this.isButtonVisible = false;
    this.isButtonVisibleADL2 = false;
    this.isButtonVisibleADL3 = false;
    this.isButtonVisibleSupplier = false;
    this.isButtonVisibleGRNNo = false;
    this.isButtonVisibleSerialNo = false;
    this.isButtonVisibleITSerialNo = false;
    this.isButtonVisiblePONumber = false;
    this.isButtonVisibleEqipmentNumber = false;
    this.isButtonVisibleCPPNumber = false;
    this.isButtonVisibleBarCode = false;
  }
  sortColumn($event: SqSort) {

    if (this.SearchcolumnName != $event.active) {
      if ($event.active != "Select") {
        if ($event.direction == "asc" || $event.direction == "") {
          this.GetAssetsToApproveRetireBindData("");
        } else {
          this.variable1 = $event.active;
          this.GetAssetsToApproveRetireBindData("Sort")
        }
      }
    }

  }

}
