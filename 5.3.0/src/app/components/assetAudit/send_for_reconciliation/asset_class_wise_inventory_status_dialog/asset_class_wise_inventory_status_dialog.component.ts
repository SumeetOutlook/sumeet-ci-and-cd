import { Component, OnInit,Inject,ViewEncapsulation,ViewChild, OnDestroy } from '@angular/core';
import {  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup,FormControl } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatSelect } from '@angular/material/select';
import * as headers from '../../../../../assets/Headers.json';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
@Component({
  selector: 'app-asset_class_wise_inventory_status_dialog',
  templateUrl: './asset_class_wise_inventory_status_dialog.component.html',
  styleUrls: ['./asset_class_wise_inventory_status_dialog.component.scss'],   
})


export class AssetClassWiseInventoryStatusDialogComponent implements OnInit {
  header: any ;
  public clicked=false;
  private isButtonVisible = false;
  public Edittempdatasource: any[] = [];
  public Editselecteddatasource: any[] = [];

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<AssetClassWiseInventoryStatusDialogComponent>,
  public dialog: MatDialog,private jwtAuth : JwtAuthService)
  {
    this.header = this.jwtAuth.getHeaders()
    this.displayedHeaders  = [this.header.Action,this.header.Count,this.header.Cost,this.header.WDV]
  }

  public AssetNo = new FormControl();

  displayedHeaders = []
  displayedColumns:string[]=['Status','Records','Cost','WDV'];

  AssetNoFilter = new FormControl();

  public arrlength = 0;
  public newdataSource = [];
  public isallchk: boolean;
  public getselectedData: any[] = [];
  selection = new SelectionModel<any>(true, []);

    @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
    dataSource = new MatTableDataSource();
    @ViewChild(MatSort) sort: MatSort;
    protected _onDestroy = new Subject<void>();

    bindData: any;
    Type : any;
    Count_DATA: any[]=[];
    location : any;
    
  ngOnInit() {
    debugger;
    this.bindData = this.data.configdata.data;
    this.Type = this.data.configdata.type;
    this.location = this.bindData.Location;

    if(this.Type == 'LocationCount'){
      this.Count_DATA = [
        {Status: 'Verified', Records: this.bindData.FARverifyCount , Cost: this.bindData.FARverifycost , WDV: this.bindData.FARverifywdv},
        {Status: 'Pending', Records: this.bindData.FARpendingCount , Cost: this.bindData.FARpendingcost  , WDV: this.bindData.FARpendingwdv },
        {Status: 'Missing', Records: this.bindData.FARmissingCount , Cost: this.bindData.FARmissingcost , WDV: this.bindData.FARmissingwdv },
        {Status: 'Additional', Records: this.bindData.FARadditionalCount , Cost: this.bindData.FARadditionalcost, WDV: this.bindData.FARadditionalwdv},
      ];
    }
    else if(this.Type=='GRNCount'){
      this.Count_DATA = [
        {Status: 'Verified', Records: this.bindData.GRNverifyCount , Cost: this.bindData.GRNverifycost , WDV: this.bindData.GRNverifywdv},
        {Status: 'Pending', Records: this.bindData.GRNpendingCount, Cost: this.bindData.GRNpendingcost, WDV: this.bindData.GRNpendingwdv},
        {Status: 'Missing', Records: this.bindData.GRNmissingCount, Cost: this.bindData.GRNmissingcost, WDV: this.bindData.GRNmissingwdv},
        {Status: 'Additional', Records: this.bindData.GRNadditionalCount , Cost: this.bindData.GRNadditionalcost , WDV: this.bindData.GRNadditionalwdv},
      ];
    }
    else if(this.Type=='NonFARCount'){
      this.Count_DATA = [
        {Status: 'Verified', Records: this.bindData.NonFARverifyCount , Cost: '0', WDV: '0'},
        {Status: 'Pending', Records: this.bindData.NonFARpendingCount, Cost: '0', WDV: '0'},
        {Status: 'Missing', Records: this.bindData.NonFARmissingCount, Cost: '0', WDV: '0'},
        {Status: 'Additional', Records: this.bindData.NonFARadditionalCount , Cost: '0', WDV: '0'},
      ];
    }

    this.onChangeDataSource(this.Count_DATA);    
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  
  
  onclosetab(){
    this.dialogRef.close(false);
  }

  onChangeDataSource(value) {
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.sort = this.sort;
  }

  onSubmit(){
    this.dialogRef.close(false);
  }

}

