import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections'
import { AssetService } from '../../services/AssetService';
import { DatePipe } from '@angular/common';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
// import * as header from '../../../../assets/Headers.json';
// import * as resource from '../../../../assets/Resource.json';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { ToastrService } from 'ngx-toastr';
import { ITAssetsService } from 'app/components/services/ITAssetsService';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss']
})
export class GroupDetailsComponent implements OnInit {

  Headers: any ;
  message: any ;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('table', { static: false }) table: any;
  displayedColumns: string[] = ['Select','Inventory No.', 'Asset No.', 'Sub No.','Acquisition Date', 'Asset Class', 'Asset Name', 'Asset Description', 'Serial No', 'IT Serial No', 'Plant', 'Cost', 'WDV', 'Inventory Indicator', 'AssetCondition', 'AssetCriticality']

  dataSource: any;
  dataSource1: any;
  json: any;
  bindData: any[] = [];
  dialogForm: FormGroup;
  selection = new SelectionModel<any>(true, []);

  result: any[] = [];
  PreFarId :any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    private fb: FormBuilder,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private loader: AppLoaderService,
    public as: AssetService,
    public ITassetservice: ITAssetsService,
    public toastr: ToastrService,private jwtAuth: JwtAuthService) { 
      this.Headers = this.jwtAuth.getHeaders();
      this.message = this.jwtAuth.getResources(); 
    }
    
  get f() { return this.dialogForm.controls; };
  ngOnInit() {
    debugger;
    this.PreFarId = this.data.payload;
    this.GetAssetData(this.PreFarId);
  }

  GetAssetData(PreFarId) {
    debugger;
    this.loader.open();
    this.as.GetSubGroupJson(PreFarId).subscribe(r => {
      this.loader.close();
      debugger;
      this.bindData = JSON.parse(r);
      this.onChangeDataSource(this.bindData);
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

  Submit() {   
    this.dialogRef.close(false);
  }
  

  

}
