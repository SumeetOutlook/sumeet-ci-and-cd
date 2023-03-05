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
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';



@Component({
  selector: 'app-asset-transfer-approval-dialog',
  templateUrl: './asset-transfer-approval-dialog.component.html',
  styleUrls: ['./asset-transfer-approval-dialog.component.scss']
})
export class AssetTransferApprovalDialogComponent implements OnInit {

  headers: any = [];
  message: any ;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('table', { static: false }) table: any;
  displayedColumns: string[] = ['select','Icon', 'Inventory No.', 'Asset No.', 'Sub No.', 'Asset Class', 'Asset Name', 'Asset Description', 'Serial No', 'IT Serial No', 'Plant', 'Cost', 'WDV', 'Inventory Indicator']
  dataSource: any;
  json: any;
  bindData: any[] = [];
  dialogForm: FormGroup;
  selection = new SelectionModel<any>(true, []);

  CompanyId: any;
  LocationId: any;
  UserId: any;
  GroupId: any;
  layerid: any;

  approvaltab: boolean = false;
  informationtab: boolean = false;
  withdrawntab: boolean = false;
  title: any;
  transfertype: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    public rs: ReconciliationService,
    private fb: FormBuilder,
    public crs: CompanyRackService,
    public cls: CompanyLocationService,
    public datepipe: DatePipe,
    private loader: AppLoaderService,
    public toastr: ToastrService,
    public confirmService : AppConfirmService,
    private jwtAuth: JwtAuthService,
    ){
       this.headers = this.jwtAuth.getHeaders();
       this.message = this.jwtAuth.getResources();
    }

  get f() { return this.dialogForm.controls; };
  ngOnInit() {
    debugger;
    this.loader.open();
    this.CompanyId = this.data.configdata.CompanyId;
    this.LocationId = this.data.configdata.LocationId;
    this.UserId = this.data.configdata.UserId;
    this.GroupId = this.data.configdata.GroupId;
    this.transfertype = this.data.configdata.TransferType;

    this.dialogForm = this.fb.group({
      commentCtrl: [''],
    })

    this.buildItemForm(this.data);

  }
  buildItemForm(item) {
    debugger;
    var CompanyId = this.data.configdata.CompanyId;
    var LocationId = this.data.configdata.LocationId;
    var UserId = this.data.configdata.UserId;
    var AssetList = this.data.configdata.AssetList;
    var TransferId = this.data.configdata.TransferId;
    var approvalLevel = this.data.configdata.approvalLevel;

    this.rs.GetMultipleAssetsForTransferApproval(CompanyId, AssetList, TransferId, LocationId, approvalLevel).subscribe(r => {
      debugger;
      this.loader.close();
      this.bindData = JSON.parse(r);
      this.onChangeDataSource(this.bindData);
    })

  }
  onChangeDataSource(value) {

    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.masterToggle();
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {

    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  Submit(action) {
    debugger;
    var msg = "";
    var Comment = this.dialogForm.get('commentCtrl').value;
    Comment = Comment.trim();
    if (!Comment && (action == 'Reject' || action == 'RequestInformation')) {
      this.toastr.warning('Comment is mandatory for requesting information and rejecting', this.message.AssetrakSays);
      return false;
    }
    if(action == 'Accept'){ msg = this.message.ApproveTransferNotification }
    if(action == 'Reject'){ msg = this.message.AssetTransferRejectNotification }
    if(action == 'RequestInformation'){ msg = this.message.RequestInfoNotification }


    if (this.selection.selected.length > 0) {
      this.confirmService.confirm({ message: msg , title: this.message.AssetrakSays })
      .subscribe(res => {
        if (!!res) {
          var prefarIds = [];
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
            CompanyId: this.CompanyId,
            TransferType: this.transfertype,
            GroupId: this.GroupId,
            LocationId: this.LocationId,
            UserId: this.UserId,
            TransferId : this.data.configdata.TransferId
          }
          this.dialogRef.close(assetsDetails);
        }
      })     
    }
    else {
      this.toastr.warning(this.message.SelectAssetstoApproveTransfer, this.message.AssetrakSays);
    }
  }

}
