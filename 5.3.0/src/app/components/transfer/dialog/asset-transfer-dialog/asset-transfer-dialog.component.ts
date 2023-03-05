import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ReconciliationService } from '../../../services/ReconciliationService';
import { CompanyRackService } from '../../../services/CompanyRackService';
import { CompanyLocationService } from '../../../services/CompanyLocationService';
import { DatePipe } from '@angular/common';
import { UploadDialogComponent } from '../../dialog/upload-dialog/upload-dialog.component';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-asset-transfer-dialog',
  templateUrl: './asset-transfer-dialog.component.html',
  styleUrls: ['./asset-transfer-dialog.component.scss']
})
export class AssetTransferDialogComponent implements OnInit {

  Headers: any = [];
  message: any ;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('table', { static: false }) table: any;
  displayedColumns: string[] = ['select', 'Icon', 'Inventory No.', 'Asset No.', 'Sub No.', 'Asset Class', 'Asset Name', 'Asset Description', 'Serial No', 'IT Serial No', 'Plant', 'Cost', 'WDV', 'Inventory Indicator', 'AssetCondition', 'AssetCriticality']
  dataSource: any;
  json: any;
  bindData: any[] = [];
  dialogForm: FormGroup;
  selection = new SelectionModel<any>(true, []);
  transfertypeList: any[] = [];
  result: any[] = [];
  ListCost: any[] = [];
  ListOfStorage: any[] = [];
  isDisabled: boolean = true;
  minDate = new Date();


  public destinationfilterCtrl: FormControl = new FormControl();
  public filtereddestinationMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();


  showLocation: boolean = false;
  sbutosbunotallowed: boolean = false;
  showCostCenters: boolean = false;
  showStorageLocations: boolean = false;
  outWardlocations: boolean = false;
  outwardType: any;
  RevertDates: boolean = false;
  CompanyId: any;
  LocationId: any;
  UserId: any;
  GroupId: any;
  layerid: any;
  sbufilter: any;
  Typename: any;
  transfertype: any;
  getselectedIds: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    public rs: ReconciliationService,
    private fb: FormBuilder,
    public crs: CompanyRackService,
    public cls: CompanyLocationService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private loader: AppLoaderService,
    public toastr: ToastrService,
    private jwtAuth: JwtAuthService,
    ){
       this.Headers = this.jwtAuth.getHeaders();
       this.message = this.jwtAuth.getResources();
    }
  get f() { return this.dialogForm.controls; };
  ngOnInit() {
    debugger;

    this.CompanyId = this.data.configdata.CompanyId;
    this.LocationId = this.data.configdata.LocationId;
    this.UserId = this.data.configdata.UserId;
    this.GroupId = this.data.configdata.GroupId;
    this.layerid = this.data.configdata.layerid;
    this.Typename = this.data.configdata.Typename;
    this.outwardType = this.data.configdata.outwardType;
    this.transfertype = this.data.configdata.TransferType;
    this.getselectedIds = this.data.configdata.getselectedIds;

    this.dialogForm = this.fb.group({
      sendDateCtrl: ['', [Validators.required]],
      transferTypeCtrl: ['', [Validators.required]],
      destinationCtrl: ['', [Validators.required]],
      commentCtrl: ['', [Validators.required,this.noWhitespaceValidator]],
      proposedTransferDateCtrl: ['', [Validators.required]],
      revertdateCtrl: [''],
      UploadTransferPhoto: [''],
      UploadFile: [''],
    })
    this.bindData = [];
    this.bindData = this.data.configdata.bindData;
    if (!!this.data.configdata.AssetList) {
      this.buildItemForm(this.data);
    }
    else {
      this.onChangeDataSource(this.bindData);
    }

    var TransferType = this.transfertype.Id;
    var sendDate = new Date();
    this.dialogForm.get('sendDateCtrl').setValue(sendDate);
    this.dialogForm.get('transferTypeCtrl').setValue(TransferType);

    this.GetTransferTypes();

    debugger;
    //====== Cost Center ======
    this.showCostCenters = this.data.configdata.showCostCenters;
    if (this.showCostCenters == true) {
      this.GetAllCostsCenterList(this.CompanyId, this.GroupId)
    }
    //====== Storage Location ======
    this.showStorageLocations = this.data.configdata.showStorageLocations;
    if (this.showStorageLocations == true) {
      this.GetMappedRackListWithRackName(this.CompanyId)
    }
    //====== Location ======
    this.showLocation = this.data.configdata.showLocation;
    this.sbutosbunotallowed = this.data.configdata.sbutosbunotallowed;
    if (this.showLocation == true && this.sbutosbunotallowed == true) {
      this.GetLocationsByCompanyIdToBindSelectList(this.LocationId, this.data.configdata.LocationIdData);
    }
    if (this.showLocation == true && this.sbutosbunotallowed == false) {
      this.GetLocationsByCompanyIdToBindSelectList(this.LocationId, this.data.configdata.LocationIdData);
    }
  }
  buildItemForm(item) {
    debugger;
    this.loader.open();
    var assetDetails = {
      CompanyId: this.data.configdata.CompanyId,
      LocationId: this.data.configdata.LocationId,
      UserId: this.data.configdata.UserId,
      BlockId: this.data.configdata.BlockId,
      AssetLife: this.data.configdata.AssetLife,
      Flag: this.data.configdata.Flag,
      AssetList: this.data.configdata.AssetList,
      CategoryIdList: []
    }

    this.rs.GetAssetForTransfer(assetDetails).subscribe(r => {
      debugger;
      this.loader.close();
      if (!!r) {
        var data = JSON.parse(r);
        data.forEach(element => {
          this.bindData.push(element);
        });
      }
      this.onChangeDataSource(this.bindData);

    })
  }
  onChangeDataSource(value) {
    debugger;
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.selection.clear();
    this.masterToggle();
    this.getselectedPrefarIds = [];
    this.getselectedIds.forEach(row => {
      this.getselectedPrefarIds.push(row);
      //this.selection.selected.push(row);
      debugger;
      if(row.checkFlagForAllocationRetireTransfer === true || row.CheckFlag === 'yes')
      {
        debugger;

      }
    })
    // this.dataSource.data.forEach(row => {
    //   debugger;
    //   if (row.checkFlagForAllocationRetireTransfer === true || row.CheckFlag === 'yes') {
    //     this.selection.select(row);
    //     this.getselectedPrefarIds.push(row.PreFarId)
    //   }
    // });
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}
  GetTransferTypes() {

    this.rs.GetTransferTypes().subscribe(r => {

      this.result = JSON.parse(r);
      this.transfertypeList = this.result;
    })
  }
  GetAllCostsCenterList(CompanyId, GroupId) {

    this.crs.GetAllCostsCenterList(CompanyId, GroupId).subscribe(r => {

      this.ListCost = JSON.parse(r);
    })
  }

  GetMappedRackListWithRackName(CompanyId) {
    this.crs.GetMappedRackListWithRackName(CompanyId).subscribe(r => {

      this.ListOfStorage = JSON.parse(r);
    })
  }
  outwardlocationlist: any[] = [];
  newoutwardlocationlist: any[] = [];
  GetLocationsByCompanyIdToBindSelectList(locationId, locationIdData) {

    this.cls.GetLocationsByCompanyIdToBindSelectList(this.CompanyId).subscribe(r => {
      for (var i = 0; i < r.length; i++) {
        if (r[i].LocationId != locationId) {
          this.outwardlocationlist.push(r[i]);
        }
      }

      if (this.sbutosbunotallowed) {
        var sbu = "";
        if (this.layerid == 1) {
          sbu = !locationIdData ? 0 : locationIdData.Country;
        }
        else if (this.layerid == 2) {
          sbu = !locationIdData ? 0 : locationIdData.State;
        }
        else if (this.layerid == 3) {
          sbu = !locationIdData ? 0 : locationIdData.City;
        }
        else if (this.layerid == 4) {
          sbu = !locationIdData ? 0 : locationIdData.Zone;
        }

        this.sbufilter = sbu;
        this.outwardlocationlist.forEach(c => {

          if (this.layerid == 1) {
            if (c.Country == sbu) {
              this.newoutwardlocationlist.push(c);
            }
          }
          else if (this.layerid == 2) {
            if (c.State == sbu) {
              this.newoutwardlocationlist.push(c);
            }
          }
          else if (this.layerid == 3) {
            if (c.City == sbu) {
              this.newoutwardlocationlist.push(c);
            }
          }
          else if (this.layerid == 4) {
            if (c.Zone == sbu) {
              this.newoutwardlocationlist.push(c);
            }
          }
        })
      }
      this.getDestinationType();

    })
  }
  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource.data.length;
  //   return numSelected === numRows;
  // }
  // masterToggle() {
  //   this.isAllSelected() ?
  //     this.selection.clear() :
  //     this.dataSource.data.forEach(row => this.selection.select(row));
  // }
  numSelected: any = 0;
  getselectedPrefarIds: any[] = [];
  isAllSelected: boolean = false;
  masterToggle() {
    debugger;
    this.isAllSelected = !this.isAllSelected;
    this.selection.clear();
    this.getselectedPrefarIds = [];
    if (this.isAllSelected == true) {
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
      });
    }
    this.numSelected = this.selection.selected.length;
    if (this.numSelected > 0) {
      this.selection.selected.forEach(row => this.getselectedPrefarIds.push(row.PreFarId));
    }
  }

  isSelected(row) {
    this.isAllSelected = false;
    this.selection.toggle(row);
    var idx = this.getselectedPrefarIds.indexOf(row.PreFarId);
    if (idx > -1) {
      this.getselectedPrefarIds.splice(idx, 1);
    }
    else {
      this.getselectedPrefarIds.push(row.PreFarId);
    }
    debugger;
    //majorminor group
    if ((parseInt(row.MergeId) > 0 && row.PreFarId == row.MergeId)) {
      for (var k = 0; k < this.dataSource.data.length; k++) {
        if (((parseInt(this.dataSource.data[k].MergeId) > 0 && (row.MergeId) > 0) && this.dataSource.data[k].MergeId == row.MergeId)) {
          var idx1 = this.getselectedPrefarIds.indexOf(row.PreFarId);
          if (idx1 > -1) {
            if (!!this.dataSource.data[k].Taggable && (this.dataSource.data[k].Taggable == "No")) {  //|| $scope.contentInfos1[k].Taggable.toLowerCase().trim() == "Verify Only".toLowerCase().trim()
              var idx2 = this.getselectedPrefarIds.indexOf(this.dataSource.data[k].PreFarId);
              if (idx2 > -1) {
              } else {
                debugger;
                this.getselectedPrefarIds.push(this.dataSource.data[k].PreFarId);
                this.selection.toggle(this.dataSource.data[k]);
              }
            }
          }
          else {
            var idx2 = this.getselectedPrefarIds.indexOf(this.dataSource.data[k].PreFarId);
            if (idx2 > -1) {
              var idx3 = this.getselectedPrefarIds.indexOf(this.dataSource.data[k].PreFarId);
              if (idx3 > -1) {
                this.getselectedPrefarIds.splice(idx2, 1); 
                this.selection.toggle(this.dataSource.data[k]);
               }
              else { 
                debugger;
                
              }
            }
          }
        }
      }
    }

    if ((row.ADDL_Tag != null && row.PreFarId == row.ADDL_Tag)) {
      for (var k = 0; k < this.dataSource.data.length; k++) {
        if ((parseInt(this.dataSource.data[k].ADDL_Tag) > 0 && parseInt(row.ADDL_Tag) > 0) && row.ADDL_Tag == this.dataSource.data[k].ADDL_Tag) {

          var idx1 = this.getselectedPrefarIds.indexOf(row.PreFarId);
          if (idx1 > -1) {
            if (!!this.dataSource.data[k].Taggable && (this.dataSource.data[k].Taggable == "No")) { //|| $scope.contentInfos1[k].Taggable.toLowerCase().trim() == "Verify Only".toLowerCase().trim()
              var idx2 = this.getselectedPrefarIds.indexOf(this.dataSource.data[k].PreFarId);
              if (idx2 > -1) {
              } else {
                debugger;
                this.getselectedPrefarIds.push(this.dataSource.data[k].PreFarId);
                this.selection.toggle(this.dataSource.data[k]);
              }
            }
          }
          else {
            var idx2 = this.getselectedPrefarIds.indexOf(this.dataSource.data[k].PreFarId);
            if (idx2 > -1) {
              var idx3 = this.getselectedPrefarIds.indexOf(this.dataSource.data[k].PreFarId);
              if (idx3 > -1) { }
              else {
                if ((parseInt(this.dataSource.data[k].ADDL_Tag) > 0) && (!!this.dataSource.data[k].Taggable && (this.dataSource.data[k].Taggable == "No" || this.dataSource.data[k].Taggable.toLowerCase().trim() == "Verify Only".toLowerCase().trim()))) {  //|| $scope.contentInfos1[k].Taggable.toLowerCase().trim() == "Verify Only".toLowerCase().trim()
                  var idx4 = this.getselectedPrefarIds.indexOf(row.MergeId);
                  if (idx4 > -1) { } else { 
                    debugger;
                    this.getselectedPrefarIds.splice(idx2, 1); 
                    this.selection.toggle(this.dataSource.data[k]);
                  }
                }
              }
            }
          }
        }
      }
    }

  }

  fileList: any[] = [];
  displayFileName: any;
  fileChange(event) {
    debugger;
    this.fileList = event.target.files;
  }
  uploaderData: any;
  openUploadDialog(value) {
    debugger;
    const dialogRef = this.dialog.open(UploadDialogComponent, {
      width: '980px',
      disableClose: true,
      data: { title: value, payload: this.uploaderData }
    });
    dialogRef.afterClosed().subscribe(result => {
      debugger;
      if (!!result) {
        var name = [];
        this.fileList = [];
        result = result.uploader;
        this.uploaderData = result;
        for (let j = 0; j < result.length; j++) {
          let data = new FormData();
          let displayName = result[j].file.name;
          name.push(displayName);
          let fileItem = result[j]._file;
          fileItem['displayName'] = displayName;
          this.fileList.push(fileItem);
          //this.uploader.queue[j].
          //data.append('file', fileItem);
          //data.append('displayName', displayName);        
        }
        this.displayFileName = name.join(',');
      }
    })
  }
  getDestinationType() {
    this.filtereddestinationMulti.next(this.outwardlocationlist.slice());
    this.destinationfilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPlantsMulti();
      });
  }
  protected filterPlantsMulti() {
    if (!this.outwardlocationlist) {
      return;
    }
    let search = this.destinationfilterCtrl.value;
    if (!search) {
      this.filtereddestinationMulti.next(this.outwardlocationlist.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filtereddestinationMulti.next(
      this.outwardlocationlist.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1)
    );
  }

  SetOutwardLocationDetails() {
    debugger;
    if(this.selection.selected.length)
    {
    var prefarIds = [];
    const numSelected = this.selection.selected.length;
     // for (var i = 0; i < numSelected; i++) {
    //   prefarIds.push(this.selection.selected[i].PreFarId);
    // }
    prefarIds= this.getselectedPrefarIds;
    var newLocationId = this.dialogForm.get('destinationCtrl').value;
    //var dateC = new Date(this.dialogForm.get('sendDateCtrl').value)  ;
    var dateC = this.datepipe.transform(this.dialogForm.get('sendDateCtrl').value, 'dd-MMM-yyyy');
    var ProposedTransferDate = this.datepipe.transform(this.dialogForm.get('proposedTransferDateCtrl').value, 'dd-MMM-yyyy');


    if (this.transfertype.Type == 'Location') {
      var Details =
      {
        Excelfile: null,
        GroupId: this.GroupId,
        CompanyId: this.CompanyId,
        LocationId: this.LocationId,
        NewLocationId: !newLocationId ? 0 : newLocationId.LocationId,
        TransitTypes: !this.outwardType ? null : this.outwardType,
        AssetList: prefarIds.join(','),
        LastModifiedBy: this.UserId,
        UserId: this.UserId,
        CheckOutDate: dateC,
        rComment: this.dialogForm.get('commentCtrl').value,
        ProposedTransferDate: ProposedTransferDate,
        transferredPhoto: null,
        transferredPhotoId: null
      }

      var assetsDetails =
      {
        assetsDetails: Details,
        fileList: this.fileList
      }

      this.dialogRef.close(assetsDetails);
    }
    else {
      var CostCenter = "";
      var StorageLocation = "";
      if (this.transfertype.Type == 'Storage Location') {
        CostCenter = !newLocationId ? 0 : newLocationId.LocationId;
      }
      if (this.transfertype.Type == 'Cost Center') {
        StorageLocation = !newLocationId ? 0 : newLocationId.LocationId;
      }

      var assetsDetails1 =
      {
        GroupId: this.GroupId,
        CompanyId: this.CompanyId,
        LocationId: this.LocationId,
        NewLocationId: !newLocationId ? 0 : newLocationId.LocationId,
        TransitTypes: !this.outwardType ? null : this.outwardType,
        AssetList: prefarIds.join(','),
        LastModifiedBy: this.UserId,
        UserId: this.UserId,
        CheckOutDate: dateC,
        rComment: this.dialogForm.get('commentCtrl').value,
        RevertDateTime: null,
        TransferType: !!this.transfertype ? this.transfertype.Id : 0,
        CostCenter: CostCenter,
        StorageLocation: StorageLocation,
        ProposedTransferDate: ProposedTransferDate
      }
      this.dialogRef.close(assetsDetails1);
    }
  }
  else{
    this.toastr.warning(this.message.SelectassetInitiatetransfer, this.message.AssetrakSays);
  }
  }
}
