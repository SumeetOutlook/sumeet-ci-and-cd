import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import * as header from '../../../../assets/Headers.json';
import * as menuheaders from '../../../../assets/MenuHeaders.json';
import { environment } from '../../../../environments/environment';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import * as resource from '../../../../assets/Resource.json';
import { ToastrService } from 'ngx-toastr';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { AssetService } from '../../../components/services/AssetService';
import { R } from '@angular/cdk/keycodes';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject, forkJoin } from 'rxjs';
import { ApproveRejectDialogComponent } from '../dialog/approve-reject-dialog/approve-reject-dialog.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { CompanyLocationService } from '../../../components/services/CompanyLocationService';
import { CompanyBlockService } from '../../../components/services/CompanyBlockService';
import { take, takeUntil } from 'rxjs/operators';
import {AuditService} from '../../../components/services/AuditService';
import { DatePipe } from '@angular/common';

interface SBU {
  id: string;
  name: string;
}

@Component({
  selector: 'app-view-photo',
  templateUrl: './view-photo.component.html',
  styleUrls: ['./view-photo.component.scss']
})
export class ViewPhotoComponent implements OnInit {

  Headers: any ;
  message: any = (resource as any).default;
  menuheader: any = (menuheaders as any).default
  rowData: any;
  constructor(public route: ActivatedRoute,
    private router: Router,
    private storage: ManagerService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private jwtAuth: JwtAuthService,
    public toastr: ToastrService,
    public AuditService:AuditService,
    public assetService: AssetService,
    public dialog: MatDialog,
    public cls: CompanyLocationService,
    public cbs: CompanyBlockService,
    public datepipe: DatePipe,) 
    {
      this.Headers = this.jwtAuth.getHeaders()

  }
  SBUList: any;
  PlantList: any;
  categorylist: any;
  modifiedfield: any;
  assettypes: any;
  SBUName: any;
  assettypedropdown: any;
  assetsubtypedropdown: any;
  companydata: any;
  regiondata: any;

  CompanyId: any;
  GroupId: any;
  UserId: any;
  RegionId: any;
  AssetId: any;
  Location: any;
  CategoryName: any;
  path: any;
  imagepath: any;
  Barcode: any;
  BlockOfAsset: any
  bindData: any;
  TaggingStatus: any;
  GPS_Location: any;
  GPS_CoOrdinate: any;
  Rack: any;
  TaggingButton: boolean = false;
  geodisabled: boolean = true;
  IslayerDisplay: any;
  layerid: any;
  Layertext: any;
  HeaderLayerText: any;

  PrefarIdList: any[] = [];
  prefarId: any = 0;
  totalCount: any = 0;
  startCount: any = 0;
  pageNo: any = 0;
  assetDetails: any;
  public selectedIndex;

  public SBUMultiFilterCtrl: FormControl = new FormControl();
  public SBUMultiCtrl: any;
  public filteredSBUMulti: ReplaySubject<SBU[]> = new ReplaySubject<SBU[]>(1);
  public filtered: ReplaySubject<SBU[]> = new ReplaySubject<SBU[]>(1);
  public filteredSBU: ReplaySubject<SBU[]> = new ReplaySubject<SBU[]>(1);

  public plants: any;
  public plantMultiCtrl: any;
  public plantMultiFilterCtrl: FormControl = new FormControl();
  public filteredPlantsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  protected assetclass: any;
  public assetclassMultiCtrl: FormControl = new FormControl();
  public assetclassFilterCtrl: FormControl = new FormControl();
  public filteredAssetClassMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public modificationstatus: any[] = [
    { name: 'All', id: 'All' },
    { name: 'Non - Modified Records', id: 'NonModified' },
    { name: 'Modified Records', id: 'Modified' },
    { name: 'Records For Review', id: 'RecordsForReview' },
  ];
  public modificationstatusMultiCtrl: any;
  public modificationstatusFilterCtrl: FormControl = new FormControl();
  public filteredModificationstatusMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public assetstatusMultiCtrl: any;
  public inventory: any[] = [
    //{ name: 'All Asset', id: 'All' },
    { name: 'Verified and Tagged', id: '1' },
    { name: 'Verified but not Tagged', id: '2' },
    { name: 'Not Verifiable', id: '5' },
    { name: 'Not Found', id: '6' },
    { name: 'Pending Verification', id: '7' },

  ];
  public inventoryMultiCtrl: any;
  public InventoryFilterCtrl: FormControl = new FormControl();
  public inventorynote: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  protected modifiedfields: any;
  public ModifiedMultiCtrl: any;
  public ModifiedFilterCtrl: FormControl = new FormControl();
  public ModifiedReviewFilterCtrl: FormControl = new FormControl();
  public modified: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public ReviewList : ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public categoryMultiCtrl: any;
  public categoryFilterCtrl: FormControl = new FormControl();
  public filteredcategoryMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();

  ModifiedFieldDataList: any[] = [];
  FARMandatory: any[] = [];
  NONFARMandatory: any[] = [];
  GRNMandatory: any[] = [];
  isClickedModified: boolean = true;

  ngOnInit(): void {
     
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
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


    this.pageNo = 1;
    this.rowData = localStorage.getItem("rowData");
    if (!!this.rowData) {
      this.rowData = JSON.parse(this.rowData);
      this.totalCount = this.rowData.AssetListCount;

      this.FARMandatory = this.rowData.FARMandatory;
      this.NONFARMandatory = this.rowData.NONFARMandatory;
      this.GRNMandatory = this.rowData.GRNMandatory;

      this.assetDetails = this.rowData.assetDetails;
      this.ModifiedFieldDataList = this.assetDetails.ModifiedList;

      if (this.PrefarIdList.length == 0 && this.prefarId == 0) {
        this.PrefarIdList = JSON.parse(localStorage.getItem('PrefarIdList'));
      }
      //this.InitiateDataBind(); 
      this.bindFirstData();
      this.GetInitiatedData();
      this.filteredModificationstatusMulti.next(this.modificationstatus.slice());
      debugger;
      var removelist : any[] = ['Barcode', 'displayTaggingStatus', 'InventoryComment', 'GPS_Location','GPS_CoOrdinate'] ;
      removelist.forEach(val => {
        debugger;
        var idx = this.assetDetails.ModifiedList.indexOf(val);
        if(idx > -1){
          this.assetDetails.ModifiedList.splice(idx , 1);
        }
        var idx1 = this.rowData.ReviewList.indexOf(val);
        if(idx1 > -1){
          this.rowData.ReviewList.splice(idx1 , 1);
        }
      })
      debugger;
      this.modified.next(this.assetDetails.ModifiedList.slice());
      this.ReviewList.next(this.rowData.ReviewList.slice());
      this.inventorynote.next(this.inventory.slice());
      this.SBUMultiCtrl = '';
      this.modificationstatusMultiCtrl = 'All';
    }
    else {
      //this.toastr.warning(this.message.DataNotFound, this.message.AssetrakSays);
      localStorage.setItem("rowData", "");
      this.showDiv = false;
      this.SetPageSession();
    }

  }

  

  ListOfField: any[] = [];
  ListOfFilter: any[] = [];
  ListOfFilterName: any[] = [];
  NewModifiedList: any[] = [];
  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  PlantList1: any[] = [];
  ModifiedFieldList: any[] = [];
  GetInitiatedData() {

    let url4 = this.cls.GetLocationListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 30)
    let url5 = this.cbs.GetCategoryListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 30);
    forkJoin([url4, url5]).subscribe(results => {

      if (!!results[0]) {
        this.SBUList = JSON.parse(results[0]);
        this.PlantList = JSON.parse(results[0]);
        this.PlantList1 = JSON.parse(results[0]);
        this.filteredPlantsMulti.next(this.PlantList.slice());
        this.SBUList = this.UniqueArraybyId(this.PlantList, this.Layertext);  249
        this.getFilterCityType();
        this.getFilterPlantType();
        this.OnGetlayerid();
      }
      if (!!results[1]) {
        this.categorylist = JSON.parse(results[1]);
        //this.filteredAssetClassMulti.next(this.categorylist.slice());
        this.getFilterModifiedfield(); 
        this.getFilterReviewModifiedfield();
        this.getFilterCategoryType();
      }
      this.GetPageSession();
    })
  }

  OnGetlayerid() {
    if (this.layerid == 1) {
      this.SBUList = this.SBUList.filter((item, i, arr) => arr.findIndex((t) => t.Country === item.Country) === i);
      this.filteredSBUMulti.next(this.SBUList);
    }
    else if (this.layerid == 2) {
      this.SBUList = this.SBUList.filter((item, i, arr) => arr.findIndex((t) => t.State === item.State) === i);
      this.filteredSBUMulti.next(this.SBUList);
    }
    else if (this.layerid == 3) {
      this.SBUList = this.SBUList.filter((item, i, arr) => arr.findIndex((t) => t.City === item.City) === i);
      this.filteredSBUMulti.next(this.SBUList);
    }
    else if (this.layerid == 4) {
      this.SBUList = this.SBUList.filter((item, i, arr) => arr.findIndex((t) => t.Zone === item.Zone) === i);
      this.filteredSBUMulti.next(this.SBUList);
    }
  }


  GetPageSession() {
     
    var list = [];
    this.plantMultiCtrl = "";
    this.PlantList.forEach(x => {
       
      if (this.assetDetails.LocationIdList.indexOf(x.LocationId) > -1) {
        list.push(x.LocationId);
        this.plantMultiCtrl = list;
      }
    })
    this.ModifiedMultiCtrl = "";
    list = [];
    this.categorylist.forEach(x => {
      if (this.assetDetails.CategoryIdList.indexOf(x.AssetCategoryId) > -1) {
        list.push(x.AssetCategoryId);
        this.categoryMultiCtrl = list;
      }
    })

    this.inventoryMultiCtrl = "";
    list = [];
    this.inventory.forEach(x => {
      if (this.assetDetails.TagginStatusList.indexOf(x.id) > -1) {
        list.push(x.id);
        this.inventoryMultiCtrl = list;
      }
    })
    this.assetstatusMultiCtrl = "TaggingApproval";//this.assetDetails.Option;
  }

  nextStep(i) {
    this.selectedIndex = i;
  }
  previousStep(i) {
    this.selectedIndex = i;
  }
  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.nextStep(tabChangeEvent.index);
    this.previousStep(tabChangeEvent.index);

  }

  SetPageSession() {
     debugger;
    var formData = {
      'Pagename': "Approve Tagging",
      'SbuList': [],
      'LocationIdList': [],
      'CategoryIdList': [],
      'Option':"TaggingApproval",
      'typeOfAssetList': [],
      'subTypeOfAssetList':[],
      'TagginStatusList': [],
      'ModifiedList': []
    }

    localStorage.setItem('PageSession', JSON.stringify(formData));

    this.router.navigateByUrl('h7/b');
  }


  btndisabled: boolean = true;
  showDiv: boolean = false;
  modifiedList: any[];
  InitiateDataBind() {
     
    this.selectedIndex = 0;
    this.bindData = this.rowData;
    this.startCount = this.startCount + 1;
    //this.totalCount = this.PrefarIdList.length + 1;


    var path = this.CompanyId + "/Photo/"+ this.bindData.Photopath; //4_3_2021_42_Untitled.png
    this.imagepath = environment.apiURL + "uploads/" + path;

    if (this.bindData.TaggingStatus == 1) {
      this.TaggingStatus = 'Verified and Tagged';
    }
    if (this.bindData.TaggingStatus == 2) {
      this.TaggingStatus = 'Verified But Not Tagged';
    }
    if (this.bindData.TaggingStatus == 3) {
      this.TaggingStatus = 'Verified but Damaged';
    }
    if (this.bindData.TaggingStatus == 4) {
      this.TaggingStatus = 'Verified but not in Use';
    }
    if (this.bindData.TaggingStatus == 5) {
      this.TaggingStatus = 'Not Verifiable';
    }
    if (this.bindData.TaggingStatus == 6 || this.bindData.TaggingStatus == '') {
      this.TaggingStatus = 'Not Found';
    }
    if (this.bindData.TaggingStatus == 7 || this.bindData.TaggingStatus == '') {
      this.TaggingStatus = 'Pending Verification';
    }
    debugger;
    this.bindData.GPS_Location = !!this.bindData.GPS_Location ? this.bindData.GPS_Location : "";
    this.bindData.GPS_CoOrdinate = !!this.bindData.GPS_CoOrdinate ? this.bindData.GPS_CoOrdinate : "";
    this.bindData.Rack = !!this.bindData.Rack ? this.bindData.Rack : "";

    this.bindData.AMCStartDate = !!this.bindData.AMCStartDate ? this.datepipe.transform(this.bindData.AMCStartDate, 'dd-MMM-yyyy') : "";
    this.bindData.AMCExpiryDate = !!this.bindData.AMCExpiryDate ? this.datepipe.transform(this.bindData.AMCExpiryDate, 'dd-MMM-yyyy') : "";
    this.bindData.InsuranceFrom = !!this.bindData.InsuranceFrom ? this.datepipe.transform(this.bindData.InsuranceFrom, 'dd-MMM-yyyy') : "";
    this.bindData.InsuranceTo = !!this.bindData.InsuranceTo ? this.datepipe.transform(this.bindData.InsuranceTo, 'dd-MMM-yyyy') : "";

    if (!!this.bindData.GPS_CoOrdinate) {
      this.geodisabled = false;
    }

    if (this.bindData.TaggingStatus != null && this.bindData.TaggingStatus != 9 && this.bindData.TaggingStatus != 7 && this.bindData.TaggingStatus != 6 && (this.bindData.RejectFlag == null || this.bindData.RejectFlag == false)) {
      this.btndisabled = false;
    }
  }

  bindData1: any[] = [];
  Submit() {
    this.skipIdList = [];
    this.SubmitbindData("OnPageLoad");
  }
  SubmitbindData(action) {
     debugger;
    var LocationIdList = [];
    var CategoryIdList = [];
    var TagginStatusList = [];
    var ModifiedList = [];
    //====== location ==
    if (!!this.plantMultiCtrl && this.plantMultiCtrl.length > 0) {
      this.plantMultiCtrl.forEach(x => {
        LocationIdList.push(x);
      })
    }
    else {
      this.PlantList.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }
    //====== 
    if (!!this.ModifiedMultiCtrl && this.ModifiedMultiCtrl.length > 0) {
      this.ModifiedMultiCtrl.forEach(x => {
        ModifiedList.push(x);
      })
    }
    else {
      this.ModifiedFieldDataList.forEach(x => {
        ModifiedList.push(x);
      })
    }
    if (!!this.inventoryMultiCtrl && this.inventoryMultiCtrl.length > 0) {
      this.inventoryMultiCtrl.forEach(x => {
        TagginStatusList.push(x);
      })
    }


    // this.categorylist.forEach(x => {
    //   CategoryIdList.push(x.AssetCategoryId);
    // })

    if (!!this.categoryMultiCtrl && this.categoryMultiCtrl.length > 0) {
      this.categoryMultiCtrl.forEach(x => {
        CategoryIdList.push(x);
      })
    } else {
      this.categorylist.forEach(x => {
        CategoryIdList.push(x.AssetCategoryId);
      })
    }

    var assetDetails = {
      CategoryIdList: CategoryIdList,
      UserId: this.UserId,
      CompanyId: this.CompanyId,
      LocationIdList: LocationIdList,
      pageSize: 100,
      pageNo: this.pageNo,
      AssetStage: 7,
      AssetStatus: "",
      Option: "TaggingApproval",
      SbuList: [],
      RegionId: this.RegionId,
      AssetsClassList: [],
      typeOfAssetList: [],
      subTypeOfAssetList: [],
      TagginStatusList: TagginStatusList,
      IsExport: false,
      ModifiedList: ModifiedList,
      RegionIdList: [this.RegionId],
      CompanyIdList: [this.CompanyId],
      SearchText: '',
      columnName: '',
      IsSearch: false,
      issorting: false,
      ModifiedStatus: !!this.modificationstatusMultiCtrl ? this.modificationstatusMultiCtrl : 'All',
      PageId : 30,
      GroupId:this.GroupId,
      IsCallFromReview : true
    }
    this.loader.open();
    //this.assetService.GetPrefarIdListForTaggingApproval
    this.jwtAuth.Getapprovetagginggrid(assetDetails).subscribe(r => {
       
      var PrefarIdList = [];
      this.loader.close();
      if (!!r) {
        this.bindData1 = JSON.parse(r);
        if (this.bindData1.length > 0) {
          if (action != 'OnPaging') {
            this.totalCount = this.bindData1[0].AssetListCount;
          }
          this.bindData1.forEach(x => {
            PrefarIdList.push(x.PreFarId);
          })
          localStorage.setItem("PrefarIdList", JSON.stringify(PrefarIdList));
          this.PrefarIdList = JSON.parse(localStorage.getItem('PrefarIdList'));
          this.next("");
        }
        else {
          //this.toastr.warning(this.message.DataNotFound, this.message.AssetrakSays);
          localStorage.setItem("rowData", "");
          this.showDiv = false;
          this.SetPageSession();
        }
      }

    })
  }

  bindFirstData() {
    this.loader.open();
    this.prefarId = this.rowData.PreFarId;
    this.assetService.GetByPrefarIdForTaggingApproval(this.prefarId).subscribe(r => {
       debugger;
      this.loader.close();

      if (!!r) {
        var binddata = JSON.parse(r);
        console.log(binddata);
        this.rowData = binddata;
        this.showDiv = true;
        var AssetId = this.rowData.AssetId;
        if (AssetId.startsWith('GRN')) {
          this.PageMandatoryFields = this.GRNMandatory;
        }
        else if (AssetId.startsWith('NFAR')) {
          this.PageMandatoryFields = this.NONFARMandatory;
        }
        else {
          this.PageMandatoryFields = this.FARMandatory;
        }

        this.ModifiedFieldList = [];
        this.modifiedList = binddata.ModifiedAssetlist;
        console.log(this.modifiedList);
        this.modifiedList.forEach(x => {
          x.NewValueHeader = x.NewValue;
          x.OldValueHeader = x.OldValue;
          this.ModifiedFieldList.push(x.FieldName)
        });

        var idx = this.PrefarIdList.indexOf(this.prefarId);
        if (idx > -1) {
          this.PrefarIdList.splice(idx, 1);
          this.totalCount = this.totalCount - 1;
        }
        this.InitiateDataBind();
      }
      else {
        this.toastr.warning(this.message.OperationFailed, this.message.AssetrakSays);
      }
    });
  }
  skipIdList: any[] = [];
  Skip() {
     
    var idx = this.skipIdList.indexOf(this.rowData.PreFarId);
    if (idx < 0) {
      this.skipIdList.push(this.rowData.PreFarId);
    }
    this.next("");
  }

  previous() {
     
    var cnt = this.skipIdList.length;
    var prefarId = this.skipIdList[cnt - 1];
    this.PrefarIdList.push(prefarId);
    var idx = this.skipIdList.indexOf(prefarId);
    if (idx > -1) {
      this.skipIdList.splice(idx, 1);
    }
    this.next("previous");
  }
  PageMandatoryFields: any[] = [];
  next(action) {
     
    if (this.PrefarIdList.length > 0) {
      if (action == 'previous') {
        var cnt = this.PrefarIdList.length;
        this.prefarId = this.PrefarIdList[cnt - 1];
      }
      else {
        this.prefarId = this.PrefarIdList[0];
      }
      this.loader.open();
      this.assetService.GetByPrefarIdForTaggingApproval(this.prefarId).subscribe(r => {
         
        this.loader.close();
        if (!!r) {
          var binddata = JSON.parse(r);
          this.rowData = binddata;
          this.showDiv = true;
           
          var AssetId = this.rowData.AssetId;
          if (AssetId.startsWith('GRN')) {
            this.PageMandatoryFields = this.GRNMandatory;
          }
          else if (AssetId.startsWith('NFAR')) {
            this.PageMandatoryFields = this.NONFARMandatory;
          }
          else {
            this.PageMandatoryFields = this.FARMandatory;
          }
          console.log(this.PageMandatoryFields);

          this.ModifiedFieldList = [];
          this.modifiedList = binddata.ModifiedAssetlist;
          this.modifiedList.forEach(x => {
            x.NewValueHeader = x.NewValue;
            x.OldValueHeader = x.OldValue;
            this.ModifiedFieldList.push(x.FieldName)
          });
          console.log(this.ModifiedFieldList);
          var idx = this.PrefarIdList.indexOf(this.prefarId);
          if (idx > -1) {
            this.PrefarIdList.splice(idx, 1);
            if (action == 'previous') {
              this.totalCount = this.totalCount + 1;
            }
            else {
              this.totalCount = this.totalCount - 1;
            }
          }

          this.InitiateDataBind();
        }
        else {
          this.toastr.warning(this.message.OperationFailed, this.message.AssetrakSays);
        }
      });
    }
    else {
      if (this.totalCount > 0) {
        this.pageNo = this.pageNo + 1;
        this.SubmitbindData("OnPaging");
      }
      else {
        //this.toastr.warning(this.message.DataNotFound, this.message.AssetrakSays);
        localStorage.setItem("rowData", "");
        this.showDiv = false;
        this.SetPageSession();
      }
    }
  }

  // nextpage() {
  //    
  //   this.assetDetails.pageNo = this.pageNo;
  //   this.loader.open();
  //   this.assetService.GetPrefarIdListForTaggingApproval(this.assetDetails).subscribe(r => {
  //      
  //     this.loader.close();
  //     this.bindData1 = JSON.parse(r);
  //     if (this.bindData1.length > 0) {
  //       this.bindData1.forEach(x => {
  //         this.PrefarIdList.push(x.PreFarId);
  //       })
  //       this.next();
  //     }
  //     else {
  //       this.toastr.warning(this.message.DataNotFound, this.message.AssetrakSays);
  //       localStorage.setItem("rowData", "");
  //       this.showDiv = false;
  //     }
  //   })
  // }

  btnReject: boolean = false;
  btnRejectClick(b) {
     
    var oldval = b.OldValueHeader;

    var idx = this.PageMandatoryFields.indexOf(b.FieldName);
    if (idx > -1 && !oldval) {
      this.toastr.warning(this.message.MandatoryFieldMsg, this.message.AssetrakSays);
    }
    else {
      b.btnReject = !b.btnReject;
      b.NewValue = oldval;

      this.modifiedList.forEach(x => {
         
        if (x.FieldName == 'Barcode' && x.btnReject == true) {
          this.btndisabled = true;
        }
        if (x.FieldName == 'displayTaggingStatus' && x.btnReject == true) {
          this.btndisabled = true;
        }
        if (x.FieldName == 'subTypeOfAsset' && b.FieldName == 'typeOfAsset') {
          var oldval = x.OldValueHeader;
          x.btnReject = !x.btnReject;
          x.NewValue = oldval;
        }
        if (x.FieldName == 'typeOfAsset' && b.FieldName == 'subTypeOfAsset') {
          var oldval = x.OldValueHeader;
          x.btnReject = !x.btnReject;
          x.NewValue = oldval;
        }
      });
    }
  }

  btnReinstateClick(b) {
     
    var newval = b.NewValueHeader;
    b.btnReject = !b.btnReject;
    b.NewValue = newval;

    this.btndisabled = false;
    this.modifiedList.forEach(x => {
       
      if (x.FieldName == 'Barcode' && x.btnReject == true) {
        this.btndisabled = true;
      }
      if (x.FieldName == 'displayTaggingStatus' && x.btnReject == true) {
        this.btndisabled = true;
      }
      if (x.FieldName == 'subTypeOfAsset' && b.FieldName == 'typeOfAsset') {
        var newval = x.NewValueHeader;
        x.btnReject = !x.btnReject;
        x.NewValue = newval;
      }
      if (x.FieldName == 'typeOfAsset' && b.FieldName == 'subTypeOfAsset') {
        var newval = x.NewValueHeader;
        x.btnReject = !x.btnReject;
        x.NewValue = newval;
      }
    });
  }

  ApproveAssetDtolist: any[];
  ApproveAssetDto = [];
  ApproveAudit() {

    var flag = 0;
    this.modifiedList.forEach(x => {
      var idx = this.PageMandatoryFields.indexOf(x.FieldName);
      if (idx > -1 && !x.NewValue) {
        flag = 1;
      }
    })
    if (flag == 1) {
      this.toastr.warning(this.message.MandatoryFieldBlankMsg, this.message.AssetrakSays);
      return false;
    }

    var ModifiedAssetDtoList = [];
          this.ApproveAssetDto = [];
          this.modifiedList.forEach(x => {
            var aa = {
              PrefarId: this.bindData.PreFarId,
              FieldName: x.FieldName,
              OldValue: x.OldValue,
              NewValue: x.NewValue,
              EditableDuringTagging: x.EditableDuringTagging,
              EditableDuringTaggingReview: x.EditableDuringTaggingReview,
              isNewvalueupdate: (x.NewValue == x.NewValueHeader) ? true : false
            }
            ModifiedAssetDtoList.push(aa)
          })

          var ApproveAssetDtolist = {
            PreFarId: this.bindData.PreFarId,
            Taggable: this.bindData.Taggable,
            LastModifiedBy: this.UserId,
            LabelMaterial: this.bindData.LabelMaterial,
            LabelSize: this.bindData.LabelSize,
            flag: "1",
            InventoryComment: this.bindData.InventoryComment,
            isUserAllocationAlllow: true,
            // LastModifiedOn: this.JsonDate(this.bindData.LastModifiedOn),
            OutwardLocation:new Date(this.bindData.LastModifiedOn), 
            isSingleAsset: false,
            Optionlistformodified: this.ModifiedFieldDataList,
            ModifiedAssetDtoList: ModifiedAssetDtoList
          };
          this.ApproveAssetDto.push(ApproveAssetDtolist);

          var approveTaggingDetails = {
            ApproveAssetDtolist: this.ApproveAssetDto
          }
          this.loader.open();
          this.AuditService.MultipalApproveTagging(approveTaggingDetails).subscribe(r => {
            this.loader.close();
             
            var msg = '';
            if (r.startsWith("success")) {
              var result = r.split(',');
              if (parseInt(result[1]) > 0) {                
                this.toastr.success("Tagging approved successfully.", this.message.AssetrakSays);
              }
              if (parseInt(result[2]) > 0) {                
                this.toastr.error("Tagging cannot be approved for the selected asset/s.", this.message.AssetrakSays);
              }
              if (parseInt(result[3]) > 0) {               
                this.toastr.error("Tagging cannot be approved for the selected asset/s.", this.message.AssetrakSays);
              }              
              //this.toastr.success(result[1] + ' assets are Approved Successfully.' + result[2] + ' assets are Failed to Approve and for ' + result[3] + ' assets action is already taken.', this.message.AssetrakSays);
            }
            else {
              this.toastr.error(this.message.ErrorMessage, this.message.AssetrakSays);
            }
            this.next("");
          });

    // this.confirmService.confirm({ message: this.message.ApproveTaggingAsset, title: this.message.AssetrakSays })
    //   .subscribe(res => {
    //     if (!!res) {   
    //     }
    //   })
  }

  public JsonDate(datePicker) {
    Date.prototype.toJSON = function () {
      var date = '/Date(' + this.getTime() + ')/';
      return date;
    };
    var dt = new Date(datePicker);
    var dt1 = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds()));
    return dt1.toJSON();
  }

  openApproveRejectDialog() {

    const dialogRef = this.dialog.open(ApproveRejectDialogComponent, {
      panelClass: 'group-form-dialog',
      width: '400px',
      disableClose: true,
      data: {},
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {

        this.ContinueRejectbtn(result);
      }
    });

  }

  ContinueRejectbtn(result) {
     
    this.loader.open();
    var ModifiedAssetDtoList = [];
    this.modifiedList.forEach(x => {
      var aa = {
        PrefarId: this.bindData.PreFarId,
        FieldName: x.FieldName,
        OldValue: x.OldValue,
        NewValue: x.NewValue,
        EditableDuringTagging: x.EditableDuringTagging,
        EditableDuringTaggingReview: x.EditableDuringTaggingReview,
        isNewvalueupdate: (x.NewValue == x.NewValueHeader) ? true : false
      }
      ModifiedAssetDtoList.push(aa)
    })

    var objAssetsParameterDto = {
      PrefarIdlist: [this.bindData.PreFarId],
      approveRejectComment: result,
      UserId: this.UserId,
      Optionlistformodified: this.ModifiedFieldDataList,
      ModifiedAssetDtoList: ModifiedAssetDtoList
    }

    this.AuditService.RejectApprove(objAssetsParameterDto)
      .subscribe(r => {
        this.loader.close();
         
        var msg = '';
        if (r.startsWith("Success")) {
          var result = r.split(',');
          if (parseInt(result[1]) > 0) {            
            this.toastr.success("Information requested Successfully.", this.message.AssetrakSays);
          }
          if (parseInt(result[2]) > 0) {           
            this.toastr.error("Tagging request cannot be done for the selected asset/s.", this.message.AssetrakSays);
          }
          if (parseInt(result[3]) > 0) {            
            this.toastr.error("Tagging request cannot be done for the selected asset/s.", this.message.AssetrakSays);
          }        
          //this.toastr.success(this.message.TaggingReject, this.message.AssetrakSays);
          //this.toastr.success(result[1] + ' assets are Approved Successfully.' + result[2] + ' assets are Failed to Approve and for ' + result[3] + ' assets action is already taken.', this.message.AssetrakSays);
        }
        else {
          this.toastr.error(this.message.ErrorMessage, this.message.AssetrakSays);
        }
        this.next("");
      });
  }

  mapLocation() {
    if (!this.bindData.GPS_CoOrdinate) {
    } else {
      window.open('https://www.google.com/maps/search/?api=1&query=' + this.bindData.GPS_CoOrdinate, '_blank');
    }
  }

  getFilterCategoryType() {
    this.filteredcategoryMulti.next(this.categorylist.slice());
    this.categoryFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCategoryMulti();
      });
  }
  protected filterCategoryMulti() {
    if (!this.categorylist) {
      return;
    }
    let search = this.categoryFilterCtrl.value;
    if (!search) {
      this.filteredcategoryMulti.next(this.categorylist.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredcategoryMulti.next(
      this.categorylist.filter(x => x.AssetCategoryName.toLowerCase().indexOf(search) > -1)
    );
  }

  getParam() {
     
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < url.length; i++) {
      var params = url[i].split("=");
      if (params[0] == 'a') {
        var a = params[1];
        this.AssetId = a.replace(/\%20/g, " ").replace(/\%2B/g, "+").replace(/\%21/g, "!").replace(/\%23/g, "#").replace(/\%24/g, "$").replace(/\%26/g, "&").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")").replace(/\%2A/g, "*").replace(/\%2C/g, ",").replace(/\%2F/g, "/").replace(/\%3A/g, ":").replace(/\%3B/g, ";").replace(/\%3D/g, "=").replace(/\%3F/g, "?").replace(/\%40/g, "@").replace(/\%5B/g, "[").replace(/\%5D/g, "]");
      }
      if (params[0] == 'b') {
        var b = params[1];
        this.Location = b.replace(/\%20/g, " ").replace(/\%2B/g, "+").replace(/\%21/g, "!").replace(/\%23/g, "#").replace(/\%24/g, "$").replace(/\%26/g, "&").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")").replace(/\%2A/g, "*").replace(/\%2C/g, ",").replace(/\%2F/g, "/").replace(/\%3A/g, ":").replace(/\%3B/g, ";").replace(/\%3D/g, "=").replace(/\%3F/g, "?").replace(/\%40/g, "@").replace(/\%5B/g, "[").replace(/\%5D/g, "]");
      }
      if (params[0] == 'c') {
        var c = params[1];
        this.CategoryName = c.replace(/\%20/g, " ").replace(/\%2B/g, "+").replace(/\%21/g, "!").replace(/\%23/g, "#").replace(/\%24/g, "$").replace(/\%26/g, "&").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")").replace(/\%2A/g, "*").replace(/\%2C/g, ",").replace(/\%2F/g, "/").replace(/\%3A/g, ":").replace(/\%3B/g, ";").replace(/\%3D/g, "=").replace(/\%3F/g, "?").replace(/\%40/g, "@").replace(/\%5B/g, "[").replace(/\%5D/g, "]");
      }
      if (params[0] == 'd') {
        var d = params[1];
        this.path = d.replace(/\%20/g, " ").replace(/\%2B/g, "+").replace(/\%21/g, "!").replace(/\%23/g, "#").replace(/\%24/g, "$").replace(/\%26/g, "&").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")").replace(/\%2A/g, "*").replace(/\%2C/g, ",").replace(/\%2F/g, "/").replace(/\%3A/g, ":").replace(/\%3B/g, ";").replace(/\%3D/g, "=").replace(/\%3F/g, "?").replace(/\%40/g, "@").replace(/\%5B/g, "[").replace(/\%5D/g, "]");
      }
      if (params[0] == 'e') {
        var e = params[1];
        this.Barcode = e.replace(/\%20/g, " ").replace(/\%2B/g, "+").replace(/\%21/g, "!").replace(/\%23/g, "#").replace(/\%24/g, "$").replace(/\%26/g, "&").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")").replace(/\%2A/g, "*").replace(/\%2C/g, ",").replace(/\%2F/g, "/").replace(/\%3A/g, ":").replace(/\%3B/g, ";").replace(/\%3D/g, "=").replace(/\%3F/g, "?").replace(/\%40/g, "@").replace(/\%5B/g, "[").replace(/\%5D/g, "]");
      }
    }
    this.imagepath = environment.apiURL + "uploads/" + this.path;
    console.log(this.imagepath);

  }
  limit = 10;         
  offset = 0;
  getFilterPlantType() {
    this.filteredPlantsMulti.next(this.PlantList.slice());
    this.plantMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPlantsMulti();
      });
  }
  protected filterPlantsMulti() {
    if (!this.PlantList) {
      return;
    }
    let search = this.plantMultiFilterCtrl.value;
    if (!search) {
      this.filteredPlantsMulti.next(this.PlantList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredPlantsMulti.next(
      this.PlantList.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1)
    );
  }
  onChangeSBU(value) {
   // this.showmultiSearch = false;
    if (!!value) {
      var list = [];
      if (!!this.SBUMultiCtrl && this.SBUMultiCtrl.length > 0) {
        this.SBUMultiCtrl.forEach(x => {
          this.PlantList = this.PlantList1.filter(y => y[this.Layertext].indexOf(x) > -1);
          this.PlantList.forEach(x => {
            list.push(x);
          })
        })
        this.PlantList = list;
      }
      else {
        this.PlantList = this.PlantList1.filter(y => y);
      }
      this.plantMultiCtrl = "";
      //this.filteredPlantsMulti.next(this.PlantList.slice());
      this. getFilterPlantType();
    }
    else {
      this.PlantList = this.PlantList1;
      this.plantMultiCtrl = "";
      //this.filteredPlantsMulti.next(this.PlantList.slice());
      this. getFilterPlantType();
    }
  }
  getFilterCityType() {
    this.filteredSBUMulti.next(this.SBUList.slice());
    this.SBUMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCityMulti();
      });
  }
  protected filterCityMulti() {
    if (!this.SBUList) {
      return;
    }
    let search = this.SBUMultiFilterCtrl.value;
    if (!search) {
      this.filteredSBUMulti.next(this.SBUList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredSBUMulti.next(
      this.SBUList.filter(x => x.Zone.toLowerCase().indexOf(search) > -1)
    );
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
  getFilterModifiedfield() {
    this.modified.next(this.ModifiedFieldDataList.slice());
    this.ModifiedFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterModifiedfield();
      });
  }
  protected filterModifiedfield() {
    debugger;
    if (!this.ModifiedFieldDataList) {
      return;
    }
    let search = this.ModifiedFilterCtrl.value;
    if (!search) {
      this.modified.next(this.ModifiedFieldDataList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.modified.next(
      this.ModifiedFieldDataList.filter(x => this.Headers[x].toLowerCase().indexOf(search) > -1)
    );
  }
  getFilterReviewModifiedfield() {
    this.ReviewList.next(this.ModifiedFieldDataList.slice());
    this.ModifiedReviewFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterModifiedReviewfield();
      });
  }
  protected filterModifiedReviewfield() {
    debugger;
    if (!this.ModifiedFieldDataList) {
      return;
    }
    let search = this.ModifiedReviewFilterCtrl.value;
    if (!search) {
      this.ReviewList.next(this.ModifiedFieldDataList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.ReviewList.next(
      this.ModifiedFieldDataList.filter(x => this.Headers[x].toLowerCase().indexOf(search) > -1)
    );
  }

}
