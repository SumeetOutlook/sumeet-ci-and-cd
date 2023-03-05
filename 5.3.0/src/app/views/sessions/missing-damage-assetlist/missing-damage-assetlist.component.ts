import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { MatSelect } from '@angular/material/select';

import * as header from '../../../../assets/Headers.json';
import * as resource from '../../../../assets/Resource.json';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { CompanyLocationService } from '../../../components/services/CompanyLocationService';
import { UserMappingService } from '../../../components/services/UserMappingService';
import { CompanyBlockService } from '../../../components/services/CompanyBlockService';
import { GroupService } from '../../../components/services/GroupService';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { UserService } from '../../../components/services/UserService';
import { AssetService } from '../../../components/services/AssetService';
import { AuditService } from '../../../components/services/AuditService';
import { UploadService } from '../../../components/services/UploadService';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { assetTabsComponent } from '../../../components/partialView/assetDetails/asset_tabs.component';
import { AllPathService } from 'app/components/services/AllPathServices';


import { GetFieldsComponent } from 'app/components/partialView/get-fields/get-fields.component';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-missing-damage-assetlist',
  templateUrl: './missing-damage-assetlist.component.html',
  styleUrls: ['./missing-damage-assetlist.component.scss']
})
export class MissingDamageAssetlistComponent implements OnInit {

  Headers: any;
  message: any = (resource as any).default;

  dialogForm: FormGroup;
  numRows: number;
  selectedValue: string;
  IsDisabled: boolean = true;
  private isButtonVisible = false;
  private isApprovalLevelButtonVisible = false;

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

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  protected _onDestroy = new Subject<void>();
  @ViewChild(MatSort) sort: MatSort;
  public sessionId: any;

  TpMissingStatusCtrl: any;
  TpMissingStatus1Ctrl: any;
  displayedColumns: any[] = ['select'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  tempdatasource: any[] = [];

  constructor(public dialog: MatDialog,
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
    public aus: AuditService ,
    public ups : UploadService ,
    public AllPathService: AllPathService,private jwtAuth : JwtAuthService) {
      this.Headers = this.jwtAuth.getHeaders();
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
    this.paginationParams = {
      pageSize: 50,
      currentPageIndex: 0,
      endIndex: 0,
      startIndex: 0,
      totalCount: 0,
    }
    this.dialogForm = this.fb.group({
      commentCtrl: ['', [Validators.required]],
    })

    this.layerid = 3;
    this.IslayerDisplay = this.layerid;
    this.Layertext = "City";
    this.HeaderLayerText = this.Layertext;
    
    this.GetInitiatedData1();

    this.AssetNoFilter.valueChanges.subscribe((AssetNoFilterValue) => {
      this.filteredValues['AssetNo'] = AssetNoFilterValue;
      this.dataSource.filter = this.filteredValues.AssetNo;
    });
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }
  xyz: any;
  abc: any;
  flag: any;
  jkm: any;
  tableid: any;
  pqr: any;
  PageName: any;
  externalpage: any;
  transferId: any;
  SelfCertFlag: any;
  getParam() {
    debugger;
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < url.length; i++) {
      var params = url[i].split("=");
      if (params[0] == 'abc') {
        var abc = params[1];
        this.abc = abc; //.replace(/\%2B/g, "+").replace(/\%21/g, "!").replace(/\%23/g, "#").replace(/\%24/g, "$").replace(/\%26/g, "&").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")").replace(/\%2A/g, "*").replace(/\%2C/g, ",").replace(/\%2F/g, "/").replace(/\%3A/g, ":").replace(/\%3B/g, ";").replace(/\%3D/g, "=").replace(/\%3F/g, "?").replace(/\%40/g, "@").replace(/\%5B/g, "[").replace(/\%5D/g, "]");
      }
      if (params[0] == 'xyz') {
        var xyz = params[1];
        this.xyz = xyz; //.replace(/\%2B/g, "+").replace(/\%21/g, "!").replace(/\%23/g, "#").replace(/\%24/g, "$").replace(/\%26/g, "&").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")").replace(/\%2A/g, "*").replace(/\%2C/g, ",").replace(/\%2F/g, "/").replace(/\%3A/g, ":").replace(/\%3B/g, ";").replace(/\%3D/g, "=").replace(/\%3F/g, "?").replace(/\%40/g, "@").replace(/\%5B/g, "[").replace(/\%5D/g, "]");
      }

      if (params[0] == 'jkm') {
        var jkm = params[1];
        this.jkm = jkm; //.replace(/\%2B/g, "+").replace(/\%21/g, "!").replace(/\%23/g, "#").replace(/\%24/g, "$").replace(/\%26/g, "&").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")").replace(/\%2A/g, "*").replace(/\%2C/g, ",").replace(/\%2F/g, "/").replace(/\%3A/g, ":").replace(/\%3B/g, ";").replace(/\%3D/g, "=").replace(/\%3F/g, "?").replace(/\%40/g, "@").replace(/\%5B/g, "[").replace(/\%5D/g, "]");
      }
      if (params[0] == 'tableid') {
        var tableid = params[1];
        this.tableid = tableid; //.replace(/\%2B/g, "+").replace(/\%21/g, "!").replace(/\%23/g, "#").replace(/\%24/g, "$").replace(/\%26/g, "&").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")").replace(/\%2A/g, "*").replace(/\%2C/g, ",").replace(/\%2F/g, "/").replace(/\%3A/g, ":").replace(/\%3B/g, ";").replace(/\%3D/g, "=").replace(/\%3F/g, "?").replace(/\%40/g, "@").replace(/\%5B/g, "[").replace(/\%5D/g, "]");
      }

      if (params[0] == 'pqr') {
        var pqr = params[1];
        this.pqr = pqr; //.replace(/\%2B/g, "+").replace(/\%21/g, "!").replace(/\%23/g, "#").replace(/\%24/g, "$").replace(/\%26/g, "&").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")").replace(/\%2A/g, "*").replace(/\%2C/g, ",").replace(/\%2F/g, "/").replace(/\%3A/g, ":").replace(/\%3B/g, ";").replace(/\%3D/g, "=").replace(/\%3F/g, "?").replace(/\%40/g, "@").replace(/\%5B/g, "[").replace(/\%5D/g, "]");
      }

      if (params[0] == 'pn') {
        var pageName = params[1];
        this.PageName = pageName; //.replace(/\%2B/g, "+").replace(/\%21/g, "!").replace(/\%23/g, "#").replace(/\%24/g, "$").replace(/\%26/g, "&").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")").replace(/\%2A/g, "*").replace(/\%2C/g, ",").replace(/\%2F/g, "/").replace(/\%3A/g, ":").replace(/\%3B/g, ";").replace(/\%3D/g, "=").replace(/\%3F/g, "?").replace(/\%40/g, "@").replace(/\%5B/g, "[").replace(/\%5D/g, "]");
      }

      if (params[0] == 'mnp') {
        var pageName = params[1];
        this.SelfCertFlag = pageName;//.replace(/\%2B/g, "+").replace(/\%21/g, "!").replace(/\%23/g, "#").replace(/\%24/g, "$").replace(/\%26/g, "&").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")").replace(/\%2A/g, "*").replace(/\%2C/g, ",").replace(/\%2F/g, "/").replace(/\%3A/g, ":").replace(/\%3B/g, ";").replace(/\%3D/g, "=").replace(/\%3F/g, "?").replace(/\%40/g, "@").replace(/\%5B/g, "[").replace(/\%5D/g, "]");
      }
    }

  }

  ListOfInitiatorPermission: any[] = [];
  missingNote: any[] = [];
  GetInitiatedData1() {
    debugger;
    let url1 = this.gs.GetFieldListByPageIdbyLink(35,this.UserId,true);
    let url2 = this.gs.GetFilterIDlistByPageId(35);
    let url3 = this.aus.getMissingNoteInList();
    forkJoin([url1, url2, url3]).subscribe(results => {
      if (!!results[0]) {
        this.ListOfField = JSON.parse(results[0]);
        this.displayedColumns = this.ListOfField;
        
        this.displayedColumns = this.displayedColumns.filter(x => x.Custom2 == "1").map(choice => choice.Custom1);

        this.displayedColumns = ['Select'].concat(this.displayedColumns);
        // this.displayedColumns = this.displayedColumns.concat("Status");
        // this.displayedColumns = this.displayedColumns.concat("Upload");
        // this.displayedColumns = this.displayedColumns.concat("ViewDocument");
      }
      if (!!results[1]) {
        this.ListOfFilter = JSON.parse(results[1]);
        if (!!this.ListOfFilter) {
          this.ListOfFilter.forEach(x => this.ListOfFilterName.push(x.FilterName))
        }
      }
      if (!!results[1]) {
        this.ListOfFilter = JSON.parse(results[1]);
        if (!!this.ListOfFilter) {
          this.ListOfFilter.forEach(x => this.ListOfFilterName.push(x.FilterName))
        }
        console.log(this.ListOfFilter);
      }
      if (!!results[2]) {
        this.missingNote = JSON.parse(results[2]);

      }
      this.loader.close();
      this.getParam();
      this.GetMissingOrDamageAssetList();
      
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
        this.displayedColumns = this.ListOfField.filter(x => x.Custom2 == "1" ).map(choice => choice.Custom1);
        this.displayedColumns = ['Select'].concat(this.displayedColumns);
        // this.displayedColumns = this.displayedColumns.concat("Status");
        // this.displayedColumns = this.displayedColumns.concat("Upload");
        // this.displayedColumns = this.displayedColumns.concat("ViewDocument");
      }
    })
  }


  //====== Bind Data To DataSource========  
  handlePage(pageEvent: PageEvent) {
    debugger;
    this.paginationParams.pageSize = pageEvent.pageSize;
    this.paginationParams.currentPageIndex = pageEvent.pageIndex;
    this.paginationParams.endIndex = (this.paginationParams.currentPageIndex + 1) * pageEvent.pageSize;
    this.paginationParams.startIndex = this.paginationParams.currentPageIndex * pageEvent.pageSize;
    this.GetMissingOrDamageAssetListBindData("")
  }
  GetMissingOrDamageAssetList() {
    this.selection.clear();
    this.dialogForm.get('commentCtrl').setValue("");
    this.numSelected = 0;
    this.getselectedIds = [];
    this.GetMissingOrDamageAssetListBindData("OnPageload");
  }
  ApprovalStatus: any[] = [];
  GetMissingOrDamageAssetListBindData(Action) {
    debugger;
    this.loader.open();
    var assetsDetails =
    {
      ComIds: this.abc,
      LocationList: this.xyz,
      Ids: this.pqr,
      projectName: this.jkm,
      Option: this.tableid,
      pageNo: this.paginationParams.currentPageIndex + 1,
      pageSize: this.paginationParams.pageSize,
      IsSearch: false,
      SearchText: "",
      PageName: this.PageName,
    }
    this.aus.GetMissingOrDamageAssetList(assetsDetails).subscribe(r => {
      debugger;
      this.loader.close();
      this.bindData = [];
      if (!!r && r != "[]") {
        this.bindData = JSON.parse(r);
        console.log("bindData", this.bindData);
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
  PageId =35;
  openPopUp(data: any = {}) {
    debugger;
    return null;
    let title = 'Add new member';
    const dialogRef = this.dialog.open(assetTabsComponent, {
      width: 'auto',
      disableClose: true,
      data: { title: title, payload: data.PreFarId,PageId:this.PageId }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
      })
  }
  numSelected: any = 0;
  getselectedIds: any[] = [];
  isAllSelected: boolean = false;
  masterToggle() {

    this.isAllSelected = !this.isAllSelected;
    this.selection.clear();
    this.getselectedIds = [];
    if (this.isAllSelected == true) {
      this.dataSource.data.forEach(row => {
        this.selection.select(row)
      });
    }
    debugger;
    this.numSelected = this.selection.selected.length;
    if (this.numSelected > 0) {
      this.selection.selected.forEach(row => {
        this.getselectedIds.push(row.PreFarId)
      })
    }
  }

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
  }
  Submit(action) {
    debugger;
    if (this.selection.selected.length > 0) {
      var prefarIds = [];
      this.loader.open();
      const numSelected = this.selection.selected.length;
      for (var i = 0; i < numSelected; i++) {
        prefarIds.push(this.selection.selected[i].PreFarId);
      }
      var assetsDetails =
      {
        AssetList: prefarIds.join(','),
        Option: action,
        Approver: this.UserId,
        ApprovalLevel: "",
        rComment: this.dialogForm.get('commentCtrl').value,
        RequestInfoComment: this.dialogForm.get('commentCtrl').value,
        UserId: this.UserId
      }

    }
    else {
      this.toastr.warning(this.message.SelectAssetstoApproveTransfer, this.message.AssetrakSays);
    }
  }

  SetMissingStatus() {
    debugger;
    var projectType = "Inventory";
    var missingStatus = !this.TpMissingStatusCtrl ? "" : this.TpMissingStatusCtrl;
    if(missingStatus == 'Other'){
      missingStatus  = !this.TpMissingStatus1Ctrl ? "" : this.TpMissingStatus1Ctrl;
    }
    var prefarIds = [];
    this.loader.open();
    const numSelected = this.selection.selected.length;
    for (var i = 0; i < numSelected; i++) {
      prefarIds.push(this.selection.selected[i].PreFarId);
    }
    var setmissingStatus = {
      ComIds: this.abc,
      LocationList: this.xyz,
      Ids: this.pqr,
      projectName: this.jkm,
      Option: this.tableid,
      missingStatus: missingStatus,
      AssetList: prefarIds.join(','),
      PageName: this.PageName
    }
    this.ups.setMissingStatus(setmissingStatus).subscribe(r => {
      debugger;
      this.loader.close();
      this.TpMissingStatusCtrl = "";
      this.TpMissingStatus1Ctrl = "";
        this.clearSelected();
    })

  }
  fileList: any[] = [];
  fileChange(event) {
    debugger;
    this.fileList = event.target.files;
  }
  upload(d) {
    debugger;
    if(this.fileList.length > 0){
      var companyId = d.CompanyId ;
      var missingStatus = d.TpMissingStatus;
      var assetDeails = {
        fileName: "",
        companyId: companyId,
        fileType: "Missing",
        fileList: this.fileList
      }
      this.aus.PostFiles(assetDeails).subscribe(result => {
        debugger;
        if (!!result) {
          if (result != "Your files is too large, maximum allowed size is 2 MB") {
            var fileName = result;
            this.SetMissingStatus1(fileName, d.PreFarId , missingStatus);
          }
          else {
            this.toastr.warning(this.message.FileisTooLarge, this.message.AssetrakSays);
          }
        }
      })
    }
    else{
      this.alertService.alert({title: this.message.AssetrakSays, message: this.message.File})
    }
    
  }
  SetMissingStatus1(fileName, preFarId ,missingStatus){
    debugger;
    var projectType = "Inventory";
    var documentType = 1;
    var path = fileName.split('Missing\\');

    this.loader.open();
   
    var setmissingStatus = {
      ComIds: this.abc,
      LocationList: this.xyz,
      Ids: this.pqr,
      projectName: this.jkm,
      Option: this.tableid,
      missingStatus: missingStatus,
      AssetList: preFarId,
      PageName: this.PageName ,
      //  filePath: fileName,
      filePath: path[1],
      documentType: documentType
    }
    this.ups.setMissingStatus(setmissingStatus).subscribe(r => {
      debugger;
      this.loader.close();
        this.clearSelected();
    })
  }
  // uploadMissingFile(fileName, preFarId) {
  //   debugger;
  //   if (!!this.IsPhysicalVerification) {

  //     var assetDeails = {
  //       CId: this.CompanyId,
  //       PreFarId: preFarId,
  //       ProjectType: "Inventory",
  //       ProjectId: !!this.projectidMultiCtrl ? this.projectidMultiCtrl.ProjectId : "",
  //       filePath: fileName,
  //       documentType: 1,
  //       projectName: !!this.projectidMultiCtrl ? this.projectidMultiCtrl.Name : "",
  //       LId: !!this.plantMultiCtrl ? this.plantMultiCtrl.LocationId : 0
  //     }
  //     this.as.setUploadMissingFile(assetDeails).subscribe(r => {
  //       debugger;
  //       this.clearSelected();
  //     })
  //   }
  // }

  viewDocument(d) {
    debugger;
    var CompanyId = d.CompanyId;
    var filePath = CompanyId + "\\Missing\\" + d.FileName;
    this.AllPathService.ViewDocument(filePath);
  }

  viewSelected() {
    this.onChangeDataSource(this.selection.selected);
  }
  clearSelected() {
    this.selection.clear();
    this.dialogForm.get('commentCtrl').setValue("");
    this.numSelected = 0;
    this.getselectedIds = [];
    this.GetMissingOrDamageAssetListBindData("")
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

}
