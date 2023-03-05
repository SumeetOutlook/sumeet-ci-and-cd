import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelect } from '@angular/material/select';
import * as headers from '../../../../../assets/Headers.json';
import { AuditService } from '../../../services/AuditService';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-project-details-dialog',
  templateUrl: './project-details-dialog.component.html',
  styleUrls: ['./project-details-dialog.component.scss']
})
export class ProjectDetailsDialogComponent implements OnInit {

  Headers: any ;
  public clicked = false;
  private isButtonVisible = false;
  public Edittempdatasource: any[] = [];
  public Editselecteddatasource: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    public dialog: MatDialog,
    public auditservice: AuditService,
    private jwtAuth : JwtAuthService) 
    {
      this.Headers = this.jwtAuth.getHeaders()
     }

  public AssetNo = new FormControl();

  displayedColumns: string[] = ['Location', 'AssetCount', 'ActualCost', 'WDV', 'IsAuditClosed', 'IsInventoryCompleted', 'ProjectCompleteDate']

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

  bindData: any[] = [];
  CompanyId: any;
  Count_DATA: any[] = [];
  projectName: any;

  ngOnInit() {
    debugger;
    this.CompanyId = this.data.configdata.CompanyId;
    this.projectName = this.data.configdata.projectName;
    this.auditservice.GetProjectDetailsByProjectId(this.CompanyId, this.projectName).subscribe(r => {
      debugger;
      this.bindData = JSON.parse(r);
      this.onChangeDataSource(this.bindData);
    })
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }


  onclosetab() {
    this.dialogRef.close(false);
  }

  onChangeDataSource(value) {
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.sort = this.sort;
  }

  onSubmit() {
    this.dialogRef.close(false);
  }

}
