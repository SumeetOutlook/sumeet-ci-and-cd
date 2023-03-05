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
import { AssetService } from '../../../services/AssetService';
import { CompanyLocationService } from '../../../services/CompanyLocationService';
import { DatePipe } from '@angular/common';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { ToastrService } from 'ngx-toastr';
import { ignoreElements } from 'rxjs/operators';


@Component({
  selector: 'app-create-group-dialog',
  templateUrl: './create-group-dialog.component.html',
  styleUrls: ['./create-group-dialog.component.scss']
})
export class CreateGroupDialogComponent implements OnInit {

  Headers: any = [];
  message: any ;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('table', { static: false }) table: any;
  displayedColumns: string[] = ['Select', 'Inventory No.', 'Asset No.', 'Sub No.', 'Asset Class', 'Asset Name', 'Asset Description', 'Serial No', 'IT Serial No', 'Plant', 'Cost', 'WDV', 'Inventory Indicator', 'AssetCondition', 'AssetCriticality']
  displayedColumns1: string[] = ['select', 'Inventory No.', 'Asset No.', 'Sub No.', 'Asset Class', 'Asset Name', 'Asset Description', 'Serial No', 'IT Serial No', 'Plant', 'Cost', 'WDV', 'Inventory Indicator', 'AssetCondition', 'AssetCriticality']
  dataSource: any;
  dataSource1: any;
  json: any;
  bindData: any[] = [];
  bindDataPreFarId: any[] = [];
  bindDataLength: any;
  dialogForm: FormGroup;
  selection = new SelectionModel<any>(true, []);

  CompanyId: any;
  LocationId: any;
  LocationIdList: any[] = [];
  UserId: any;
  GroupId: any;
  layerid: any;
  assetIdforgroup: any;

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
    public as: AssetService,
    public confirmService: AppConfirmService,
    private jwtAuth: JwtAuthService,
    ){
       this.Headers = this.jwtAuth.getHeaders();
       this.message = this.jwtAuth.getResources();
    }
  get f() { return this.dialogForm.controls; };

  ngOnInit() {
    debugger;
    this.bindData = [];
    debugger
    this.CompanyId = this.data.configdata.CompanyId;
    this.UserId = this.data.configdata.UserId;
    this.GroupId = this.data.configdata.GroupId;
    this.LocationId = this.data.configdata.selected[0].LocationId;
    this.LocationIdList = this.data.configdata.LocationIdList;
    this.bindData = this.data.configdata.selected;
    this.bindDataLength = this.bindData.length - 1;
    this.bindDataPreFarId = [];
    this.bindData.forEach(element => {
      this.bindDataPreFarId.push(element.PreFarId);
    });
    this.onChangeDataSource(this.bindData);
    //this.GetAssetIdList();
  }

  onChangeDataSource(value) {
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  contentInfos1: any[] = [];
  GetAssetsToGroup() {
    debugger;
    if (!this.assetIdforgroup) {
      this.toastr.warning(this.message.DataforSearch, this.message.AssetrakSays);
    }
    else {

      var assetDetails = {
        farId: this.bindData[0].PreFarId,
        actionMethod: 'ScrutinizeAssets',
        subStringForAssetId: !this.assetIdforgroup ? "" : this.assetIdforgroup,
        subStringForAssetDesc: !this.assetIdforgroup ? "" : this.assetIdforgroup,
        subStringForadl2: !this.assetIdforgroup ? "" : this.assetIdforgroup,
      }
      this.loader.open();
      this.as.GetAssetsToGroup(assetDetails).subscribe(response => {
        debugger;
        this.loader.close();
        this.contentInfos1 = [];
        if (!!response) {
          var arr = JSON.parse(response);
          arr.forEach(element => {
            var idx = this.bindDataPreFarId.indexOf(element.PreFarId);
            if (idx < 0) {
              this.contentInfos1.push(element);
            }
          });
        }
        this.onChangeDataSourcenew(this.contentInfos1);
      });
    }
  }
  AssetIdList: any[] = [];
  GetAssetIdList() {
    debugger;
    var search = '';
    var assetDetails = {
      CompanyId: this.CompanyId,
      BlockId: 0,
      LocationIdList: this.LocationIdList,
      prefarIdlist: [this.bindData[0].PreFarId],
      SearchText: !this.assetIdforgroup ? "" : this.assetIdforgroup,
      columnName: 'AssetId',
      IsSearch: !this.assetIdforgroup ? false : true,
      //prefarId : this.bindData[0].PreFarId,
    }
    this.as.GetAssetIdsForAutoCompleteJson(assetDetails).subscribe(response => {
      debugger;
      if (!!response) {
        this.AssetIdList = JSON.parse(response);
      }
    });
  }

  onChangeDataSourcenew(value) {
    this.dataSource1 = new MatTableDataSource(value);
    this.dataSource1.paginator = this.paginator;
    this.dataSource1.sort = this.sort;
  }

  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource1.data.length;
  //   return numSelected === numRows;
  // }
  // masterToggle() {
  //   this.isAllSelected() ?
  //     this.selection.clear() :
  //     this.dataSource1.data.forEach(row => this.selection.select(row));
  // }
  numSelected: any = 0;
  getselectedIds: any[] = [];
  isAllSelected: boolean = false;
  masterToggle() {
    debugger;
    this.isAllSelected = !this.isAllSelected;
    this.selection.clear();
    //this.getselectedIds = [];
    if (this.isAllSelected == true) {
      this.dataSource1.data.forEach(row => this.selection.select(row));
    }
    else {
      this.getselectedIds = [];
      this.dataSource1.data.forEach(row => {
        var idx1 = this.bindData.indexOf(row);
        if (idx1 > -1) {
          this.bindData.splice(idx1, 1);
        }
      });
    }
    this.numSelected = this.selection.selected.length;
    if (this.numSelected > 0) {
      this.selection.selected.forEach(row => {
        var idx = this.getselectedIds.indexOf(row.PreFarId);
        if (idx > -1) {
        }
        else {
          this.getselectedIds.push(row.PreFarId);
          this.bindData.push(row);
        }
      });
    }
    this.onChangeDataSource(this.bindData);
  }

  isSelected(row) {
    debugger;
    this.isAllSelected = false;
    this.selection.toggle(row)
    this.numSelected = this.selection.selected.length;
    var idx = this.getselectedIds.indexOf(row.PreFarId);
    var idx1 = this.bindDataPreFarId.indexOf(row.PreFarId);
    if (idx > -1 || idx1 > -1) {
      if (idx > -1) { this.getselectedIds.splice(idx, 1); }
      if (idx1 > -1) { this.bindDataPreFarId.splice(idx1, 1); }

      var idx1 = this.bindData.indexOf(row);
      if (idx1 > -1) {
        this.bindData.splice(idx1, 1);
      }
    }
    else {
      this.getselectedIds.push(row.PreFarId);
      this.bindData.push(row);
    }

    this.onChangeDataSource(this.bindData);
  }

  Submit() {
    debugger;
    this.confirmService.confirm({ message: this.message.CreateGroupConfirmation, title: this.message.AssetrakSays })
      .subscribe(res => {
        if (!!res) {
          var prefarIds = [];
          const numSelected = this.bindData.length;
          for (var i = 0; i < numSelected; i++) {
            if (this.bindData[i].PreFarId != this.bindData[0].PreFarId) {
              prefarIds.push(this.bindData[i].PreFarId);
            }
          }

          var GroupAssetdto = {
            parentAssets: this.bindData[0].PreFarId,
            childAssets: prefarIds.join(','),
            UId: this.UserId
          }
          this.dialogRef.close(GroupAssetdto);
        }
      })
  }
}
