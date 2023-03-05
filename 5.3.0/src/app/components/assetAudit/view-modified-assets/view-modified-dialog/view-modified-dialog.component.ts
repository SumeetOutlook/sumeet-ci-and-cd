import { AfterViewInit, OnDestroy, Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import * as header from '../../../../../assets/Headers.json';
import * as resource from '../../../../../assets/Resource.json';
import { ToastrService } from 'ngx-toastr';
import { AuditService } from '../../../services/AuditService';

@Component({
  selector: 'app-view-modified-dialog',
  templateUrl: './view-modified-dialog.component.html',
  styleUrls: ['./view-modified-dialog.component.scss']
})
export class ViewModifiedDialogComponent implements OnInit {

  Headers: any = (header as any).default;
  message: any = (resource as any).default;

  public clicked = false;
  private isButtonVisible = false;
  public Edittempdatasource: any[] = [];
  public Editselecteddatasource: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    public dialog: MatDialog,
    public AuditService: AuditService) { }

  public arrlength = 0;
  public newdataSource = [];
  public isallchk: boolean;
  public getselectedData: any[] = [];
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public AssetNo = new FormControl();
  displayedColumns: string[] = ['Inventory No.', 'Asset No.', 'Sub No.', 'Asset Class', 'Asset Name', 'Asset Description', 'Plant', 'Cost', 'WDV']

  displayedColumns1: string[] = ['Field', 'OldValue', 'NewValue', 'Action'];

  dataSource: any;
  dataSourceNew: any;
  ngOnInit() {
    debugger;
    this.ListOfMapField = this.data.configdata.ListOfMapField;
    this.onChangeDataSource([this.data.configdata.selected]);
    this.GetByIdForChangeCase();

  }

  bindData: any[] = [];
  oldAsset: any[] = [];
  newAsset: any[] = [];
  ListOfMapField: any[] = [];
  PageMandatoryFields: any[] = [];
  GetByIdForChangeCase() {
    debugger;

    var assetDetails = {
      PrefarId: this.data.configdata.PrefarId,
      projectId: this.data.configdata.projectId,
      locationId: this.data.configdata.locationId,
      CompanyId: this.data.configdata.CompanyId,
    }

    this.AuditService.GetByIdForChangeCase(assetDetails)
      .subscribe(r => {
        debugger;
        this.bindData = JSON.parse(r);
        //this.oldAsset = this.bindData[1];
        //this.newAsset = this.bindData[0];
        this.mapdata();
      });
  }
  hideFields: any[] = ['AssetId', 'BlockOfAsset', 'ADL2', 'subTypeOfAsset', 'Location']
  datalist : any[] = [];
  mapdata() {
    debugger;
    this.datalist = [];
    for (var i = 0; i < this.bindData.length; i++) {
      debugger;
      var idx = this.ListOfMapField.indexOf(this.bindData[i].FieldName);
      if (idx > -1) {
        var a = {
          PrefarId : this.data.configdata.PrefarId,
          FieldName: this.bindData[i].FieldName,
          OldValue: !!this.bindData[i].OldValue ? this.bindData[i].OldValue : "",
          NewValue: !!this.bindData[i].NewValue ? this.bindData[i].NewValue : "",
          isNewvalueupdate: true,
          EditableDuringAuditReview : true,
          EditableDuringAudit : true

        }
        this.datalist.push(a);
      }
    }
    console.log(this.datalist);
    this.onChangeDataSourceNew(this.datalist);
  }
  onItemChange(element, type) {
    element.checked = type;
  }
  onclosetab() {
    this.dialogRef.close();
  }

  onChangeDataSource(value) {
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  onChangeDataSourceNew(value) {
    this.dataSourceNew = new MatTableDataSource(value);
    this.dataSourceNew.paginator = this.paginator;
    this.dataSourceNew.sort = this.sort;
  }
  Reject(element) {
    element.isNewvalueupdate = !element.isNewvalueupdate;
  }
  onSubmit() {
    debugger;
    // var result = {
    //   PrePrintId: this.data.configdata.PrePrintId,
    //   PreFarId: this.data.configdata.selected[0].PreFarId,
    //   CheckBoxChecked: '',
    //   UId: this.data.configdata.UserId,
    // }
    var objApproveRajectChangesNew = {
      PreFarId: this.data.configdata.PrefarId,
      Option: "Continue",
      ProjectType: "Inventory",
      LastModifiedBy: this.data.configdata.UserId,
      ResidualValue: "",
      ExpiryDate: "",
      UserMail: "",
      UN: "",
      CMail: "",
      CN: "",
      CheckBoxChecked: "",
      IsUserAllocationAllow: "true",
      BuildingHidden: "",
      ModifiedAssetDtoList : this.datalist
    }
    this.dialogRef.close(objApproveRajectChangesNew);
  }

}
