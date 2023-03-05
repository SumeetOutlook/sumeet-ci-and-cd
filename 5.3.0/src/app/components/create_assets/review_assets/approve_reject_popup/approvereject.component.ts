import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from "@angular/router";
import * as headers from '../../../../../assets/Headers.json';
import * as resource from '../../../../../assets/Resource.json';
import { AssetService } from 'app/components/services/AssetService';

import { ToastrService } from 'ngx-toastr';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';


@Component({
  selector: 'app-approvereject',
  templateUrl: './approvereject.component.html',
  styleUrls: ['./approvereject.component.scss']
})
export class ApproveRejectComponent implements OnInit {

  header: any ;
  message: any = (resource as any).default;

  public arrlength = 0;
  public getselectedData: any[] = [];
  public newdataSource = [];
  public isallchk: boolean;
  Approve: any;
  Reject: any;

  dialogRejectForm: FormGroup;
  get f1() { return this.dialogRejectForm.controls; };

  public Rejectctrl: FormControl = new FormControl();

  displayedHeaders:any[] = []

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router,
    public assetservice: AssetService, public toastr: ToastrService,
    public dialogRef: MatDialogRef<ApproveRejectComponent>, private fb: FormBuilder,
    private jwtAuth : JwtAuthService) 
    {
        this.header = this.jwtAuth.getHeaders()
        this.displayedHeaders = ['', '', this.header.BarCode, this.header.AssetNo, this.header.SAID, this.header.AssetClass, this.header.ADL2, this.header.ADL3, this.header.SerialNo, this.header.ITSerialNo, this.header.Location, this.header.AcquisitionCost, this.header.WDV, this.header.InventoryIndicator]
    }

  
  displayedColumns: string[] = ['select', 'group', 'BarCode', 'AssetNo', 'SubNo', 'AssetClass', 'AssetName', 'AssetDescription', 'SerialNo', 'ITSerialNo', 'Location', 'Cost', 'WDV', 'InventoryIndicator'];
  selection = new SelectionModel<any>(true, []);
  ngOnInit() {
    debugger;

    this.dialogRejectForm = this.fb.group({
      Rejectctrl: ['', [Validators.required,this.noWhitespaceValidator]],

    });
  }


  ELEMENT_DATA = [
    { BarCode: 'S-15012', AssetNo: '10088', SubNo: '0|0', AssetClass: 'Laptop', AssetName: 'Laptop', AssetDescription: 'Dell vostro 105', SerialNo: '342344', ITSerialNo: '5342344', Location: 'Kolhapur', Cost: '2,000', WDV: '123', InventoryIndicator: 'Yes' },
    { BarCode: 'S-150123', AssetNo: 'ABC', SubNo: '0|0', AssetClass: 'Laptop', AssetName: 'Laptop', AssetDescription: 'Dell vostro 105', SerialNo: '7878', ITSerialNo: '5454', Location: 'Kolhapur', Cost: '2,000', WDV: '1235', InventoryIndicator: 'Yes' },
    { BarCode: 'S-150124', AssetNo: 's13444', SubNo: '0|0', AssetClass: 'Laptop', AssetName: 'Laptop', AssetDescription: 'Dell vostro 105', SerialNo: '465', ITSerialNo: '77777', Location: 'Kolhapur', Cost: '7,000', WDV: '6123', InventoryIndicator: 'Yes' }]

  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatSort) sort: MatSort;


  onclosetab() {
    this.dialogRef.close();
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}
  ContinueApprovebtn() {
    debugger;
    this.dialogRef.close("Approve SucessFully")
  }

  ContinueRejectbtn() {
    debugger;
    const EmployeeData = this.dialogRejectForm.value.Rejectctrl;
    this.dialogRef.close(EmployeeData);
  }

  EnableDisable(selectedvalue, index) {
    debugger;
    var idx = this.newdataSource.indexOf(selectedvalue.ID);
    if (idx > -1) {
      this.newdataSource.splice(idx, 1);
      this.getselectedData.splice(idx, 1);
    }
    else {
      this.newdataSource.push(selectedvalue.ID);
      this.getselectedData.push(selectedvalue);
    }
    debugger;
    this.arrlength = this.newdataSource.length;

  }

  isAllSelected() {

    this.newdataSource = [];

    if (this.isallchk == true) {

      for (let i = 0; i < this.ELEMENT_DATA.length; i++) {
        this.newdataSource.push(this.ELEMENT_DATA[i]);
      }

    }
    console.log(this.isAllSelected);
    this.arrlength = this.newdataSource.length;
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    debugger;
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }


}

