import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ReconciliationService } from '../../../services/ReconciliationService';
import { CompanyRackService } from '../../../services/CompanyRackService';
import { CompanyLocationService } from '../../../services/CompanyLocationService';

@Component({
  selector: 'app-asset-transfer-vendor-dialog',
  templateUrl: './asset-transfer-vendor-dialog.component.html',
  styleUrls: ['./asset-transfer-vendor-dialog.component.scss']
})
export class AssetTransferVendorDialogComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('table', { static: false }) table: any;
  displayedColumns: string[] = ['select', 'Inventory No.', 'Asset No.', 'Sub No.', 'Asset Class', 'Asset Name', 'Asset Description', 'Serial No', 'IT Serial No', 'Plant', 'Cost', 'WDV', 'Inventory Indicator', 'AssetCondition', 'AssetCriticality']
  dataSource: any;
  json: any;
  bindData: any[] = [];
  dialogForm: FormGroup;
  selection = new SelectionModel<any>(true, []);
  transfertype: any[] = [];
  result: any[] = [];

  vendorlocationlist: any[] = [];

  showLocation: boolean = false;
  sbutosbunotallowed: boolean = false;
  showCostCenters: boolean = false;
  showStorageLocations: boolean = false;
  outWardlocations: boolean = false;
  RevertDates: boolean = false;
  CompanyId: any;
  LocationId: any;
  UserId: any;
  GroupId: any;
  layerid: any;
  sbufilter: any;
  Typename: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    public rs: ReconciliationService,
    private fb: FormBuilder,
    public crs: CompanyRackService,
    public cls: CompanyLocationService) { }
  get f() { return this.dialogForm.controls; };
  ngOnInit() {
    debugger;
    this.CompanyId = this.data.configdata.CompanyId;
    this.LocationId = this.data.configdata.LocationId;
    this.UserId = this.data.configdata.UserId;
    this.GroupId = this.data.configdata.GroupId;
    this.layerid = this.data.configdata.layerid;
    this.Typename = this.data.configdata.Typename;


    this.dialogForm = this.fb.group({
      sendDateCtrl: ['', [Validators.required]],
      transferTypeCtrl: ['', [Validators.required]],
      destinationCtrl: ['', [Validators.required]],
      commentCtrl: ['', [Validators.required]],
      proposedTransferDateCtrl: ['', [Validators.required]],
      revertDateCtrl: ['', [Validators.required]],
      //UploadTransferPhoto: [''],
      //UploadFile : [''],
    })

    this.buildItemForm(this.data);
    this.GetTransferTypes();
    this.GetToBindDisplayListByType();
  }
  buildItemForm(item) {    
    var TransferType = this.data.configdata.TransferType;
    var assetDetails = {
      CompanyId : this.data.configdata.CompanyId,
      LocationId : this.data.configdata.LocationId,
      UserId : this.data.configdata.UserId,
      BlockId : this.data.configdata.BlockId,
      AssetLife : this.data.configdata.AssetLife,
      Flag : this.data.configdata.Flag,
      AssetList : this.data.configdata.AssetList,    
      CategoryIdList : []
     }

    this.rs.GetAssetForTransfer(assetDetails).subscribe(r => {
      this.bindData = JSON.parse(r);
      this.onChangeDataSource(this.bindData);
    })
    debugger;
    var sendDate = new Date();
    this.dialogForm.get('sendDateCtrl').setValue(sendDate);
    this.dialogForm.get('transferTypeCtrl').setValue(TransferType);
  }
  onChangeDataSource(value) {

    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  GetTransferTypes() {
    this.rs.GetTransferTypes().subscribe(r => {
      this.result = JSON.parse(r);
      this.transfertype = this.result;
    })
  }

  GetToBindDisplayListByType() {
    debugger;
    this.cls.GetToBindDisplayListByType(this.CompanyId, "Vendor").subscribe(r => {
      debugger;
      this.vendorlocationlist = r;
    })
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

  SetOutwardLocationDetails() {


   
    this.dialogRef.close();
  }

}
