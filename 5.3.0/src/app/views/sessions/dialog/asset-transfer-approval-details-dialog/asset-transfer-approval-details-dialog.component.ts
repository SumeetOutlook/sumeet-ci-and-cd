import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialog ,MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ReconciliationService } from '../../../../components/services/ReconciliationService';
// import * as header from '../../../../../assets/Headers.json';
// import * as resource from '../../../../../assets/Resource.json';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { Constants } from 'app/components/storage/constants';

@Component({
  selector: 'app-asset-transfer-approval-details-dialog',
  templateUrl: './asset-transfer-approval-details-dialog.component.html',
  styleUrls: ['./asset-transfer-approval-details-dialog.component.scss']
})
export class AssetTransferApprovalDetailsDialogComponent implements OnInit {

  // Headers: any = (header as any).default;
  // message: any = (resource as any).default;
  Headers :[];
  message :[];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('table', { static: false }) table: any;
  displayedColumns: string[] = ['select', 'Inventory No.', 'Asset No.', 'Sub No.', 'Asset Class', 'Asset Name', 'Asset Description', 'Serial No', 'IT Serial No', 'Plant', 'Cost', 'WDV', 'Inventory Indicator']
  dataSource: any;
  json: any;
  bindData: any ;
  dialogForm: FormGroup;
  selection = new SelectionModel<any>(true, []);
  tabEnabled : boolean= false;
  
  panelOpenState = false;
  CompanyId: any;
  LocationId: any;
  UserId: any;
  GroupId: any;
  PreFarId: any;
  ApprovalLevelAvailable : any[] = [];
  
  transfertype: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    public rs: ReconciliationService,
    private fb: FormBuilder,   
    private loader: AppLoaderService,
    private jwtAuth: JwtAuthService,
    private storage: ManagerService,)
    {
      this.Headers = this.jwtAuth.getHeaders();
      this.message = this.jwtAuth.getResources();
    }

  get f() { return this.dialogForm.controls; };
  ngOnInit() {
    debugger;
    this.tabEnabled = false;
    this.loader.open();
    this.PreFarId = this.data.payload.PreFarId;
    this.UserId = this.data.UserId;
    //var ApprovalLevel = this.data.payload.ApprovalLevelAvailable;
    //this.ApprovalLevelAvailable = ApprovalLevel.split(',');

    this.rs.GetApprovalLevelAvailable(this.PreFarId,this.UserId).subscribe(r=>{
      debugger;
      var approval= JSON.parse(r);
    approval.forEach(element => {
      this.ApprovalLevelAvailable=element.ApprovalLevelAvailable;
    });
    this.buildItemForm(this.PreFarId); 
    })
    this.dialogForm = this.fb.group({      
      commentCtrl: ['', [Validators.required]],
    })
    
    this.buildItemForm(this.PreFarId);    
  }
  buildItemForm(item) {  
     
    this.rs.GetApprovalDetails(item).subscribe(r => {
      debugger;
      this.loader.close();    
      this.bindData = JSON.parse(r);
      console.log(this.bindData);
      this.tabEnabled = true;
      
    })
  }
  onChangeDataSource(value) {

    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
  
  Submit(){
    this.dialogRef.close();
  }

}
