import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FileUploader } from 'ng2-file-upload';
import { UploadService } from '../../../services/UploadService';
import { SelectionModel } from '@angular/cdk/collections';
import { ReplaySubject, Subject } from 'rxjs';

import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { ReconciliationService } from '../../../services/ReconciliationService';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { UploadDialogComponent } from '../../dialog/upload-dialog/upload-dialog.component';



@Component({
  selector: 'app-physical_asset_transfer',
  templateUrl: './physical_asset_transfer.component.html',
  styleUrls: ['./physical_asset_transfer.component.scss'],
})
export class PhysicalAssetTransferComponent implements OnInit {
  Headers: any;
  message: any;

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  protected _onDestroy = new Subject<void>();
  public uploader: FileUploader = new FileUploader({ isHTML5: true });
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  file: File = null;
  fileData: any;
  fileList: any[] = [];
  columnData: any[] = [];
  maxDate:any = new Date();
  maxDateFormat: any;
  today = new Date();
  DeliveryModeData: any[] = [];
  CompanyId: any;
  LocationId: any;
  UserId: any;
  TransferType: any;
  json: any;
  bindData: any[] = [];
  public arrlength = 0;
  public arr = [];
  public newdataSource = [];
  public isallchk: boolean;
  public getselectedData: any[] = [];
  selection = new SelectionModel<any>(true, []);
  public elementdata;
  dataSource = new MatTableDataSource<any>();
  displayedHeaders: string[] = [];
  displayedColumns: string[] = ['select','Icon', '2', '3', '4', '5', '6', '7', '8', '15', '9', '10', '11', '12', '13', '14'];

  public AssetInfo: FormGroup;
  public filteredDeliveryMode: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  GroupId: any;
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

  constructor(@Inject(MAT_DIALOG_DATA,) public data: any,
    public dialogRef: MatDialogRef<PhysicalAssetTransferComponent>,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private uploadService: UploadService,
    public rs: ReconciliationService,
    public toastr: ToastrService,
    public datepipe: DatePipe,private jwtAuth: JwtAuthService) {

      this.Headers = this.jwtAuth.getHeaders();
	    this.message = this.jwtAuth.getResources();
      this.DeliveryModeData = [
        { value: 'Courier', viewValue: this.Headers.Courier },
        { value: 'Transport', viewValue: this.Headers.Transport },
        { value: 'HandDelivery', viewValue: this.Headers.HandDelivery },
      ];

      this.displayedHeaders = [this.Headers.Select, this.Headers.InventoryNumber, this.Headers.AssetNo, this.Headers.SAID, this.Headers.AcquisitionDate, this.Headers.AssetClass, this.Headers.ADL2, this.Headers.ADL3,
        this.Headers.Quantity, this.Headers.UOM, this.Headers.AcquisitionCost, this.Headers.WDV, this.Headers.EquipmentNumber, this.Headers.AssetCondition, this.Headers.AssetCriticality, this.Headers.Action];
     }


  ngOnInit() {
    this.CompanyId = this.data.configdata.CompanyId;
    this.LocationId = this.data.configdata.LocationId;
    this.UserId = this.data.configdata.UserId;
    this.TransferType = this.data.configdata.TransferType,
    this.bindData = this.data.configdata.bindData;
    this.GroupId = this.data.configdata.GroupId;
      this.AssetInfo = this.fb.group({
        deliveryMode: ['', [Validators.required]],
        courierName: [''],
        agencyName: [''],
        docketNumber: [''],
        challanNumber: [''],
        dispatchDate: [''],
        expectedReceiptDate: [''],
        deliveryBy: [''],
        deliveredTo: [''],
        deliveryDate: [''],
        FileName: [''],
      })
    //this.buildItemForm();
    this.onChangeDataSource(this.bindData);

  }
  buildItemForm() {
    debugger;
    var assetsDetails =
    {
      CompanyId: this.CompanyId,
      LocationId: this.LocationId,
      UserId: this.UserId,
      BlockId: this.data.configdata.BlockId,
      pageNo: this.data.configdata.pageNo,
      pageSize: this.data.configdata.pageSize,
      SearchText: "",
      IsSearch: this.data.configdata.IsSearch,
      AssetList: this.data.configdata.AssetList,
      TransferType: this.data.configdata.TransferType,
    }
    this.rs.GetPhysicalTransferAssetList(assetsDetails).subscribe(r => {
      debugger;
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

  CourierMode: boolean = false;
  TransferMode: boolean = false;
  HandDeliveryMode: boolean = false;
  SelectDeliveryMode(value) {
    this.CourierMode = false;
    this.TransferMode = false;
    this.HandDeliveryMode = false;
    if (value == 'Courier') {
      this.CourierMode = true;
      this.AssetInfo = this.fb.group({
        deliveryMode: [value, [Validators.required]],
        courierName: [''],
        agencyName: ['', [Validators.required, this.noWhitespaceValidator]],
        docketNumber: ['', [Validators.required, this.noWhitespaceValidator]],
        dispatchDate: ['', [Validators.required]],
        expectedReceiptDate: [''],
        FileName: [''],
      })
      var sendDate = new Date();
      this.maxDate = new Date();
      this.AssetInfo.get('dispatchDate').setValue(sendDate);
    }
    if (value == 'Transport') {
      this.TransferMode = true;
      this.AssetInfo = this.fb.group({
        deliveryMode: [value, [Validators.required]],
        courierName: [''],
        agencyName: ['', [Validators.required, this.noWhitespaceValidator]],
        challanNumber: ['', [Validators.required, this.noWhitespaceValidator]],
        dispatchDate: ['', [Validators.required]],
        expectedReceiptDate: [''],
        FileName: [''],
      })
      var sendDate = new Date();
      this.maxDate = new Date();
      this.AssetInfo.get('dispatchDate').setValue(sendDate);
    }
    if (value == 'HandDelivery') {
      this.HandDeliveryMode = true;
      this.AssetInfo = this.fb.group({
        deliveryMode: [value, [Validators.required]],
        deliveryBy: ['', [Validators.required, this.noWhitespaceValidator]],
        deliveredTo: ['', [Validators.required, this.noWhitespaceValidator]],
        deliveryDate: ['', [Validators.required]],
        FileName: [''],
      })
      var sendDate = new Date();
      this.maxDate = new Date();
      this.AssetInfo.get('deliveryDate').setValue(sendDate);
    }

  }
  
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  fileChange(event) {
    debugger;
    this.fileList = event.target.files;
  }
  SavePhysicalTransferAsset() {
    debugger;
    if (this.selection.selected.length > 0) {
      var ModeRecipient = "", ModeAgency = "", ModeNumber = "", DispatchDate = "", ReceiptDate = "", ModeDeliveryBy = "", ModeDeliveryTo = "", TransferDocument = "", DeliveryDate = "";
      var deliveryMode = this.AssetInfo.get('deliveryMode').value;
      var prefarIds = [];
      const numSelected = this.selection.selected.length;
      for (var i = 0; i < numSelected; i++) {
        prefarIds.push(this.selection.selected[i].PreFarId);
      }

      if (deliveryMode == "Courier") {
        ModeRecipient = this.AssetInfo.get('courierName').value;
        ModeAgency = this.AssetInfo.get('agencyName').value;
        ModeNumber = this.AssetInfo.get('docketNumber').value;
        DispatchDate = this.AssetInfo.get('dispatchDate').value;
        ReceiptDate = !!this.AssetInfo.get('expectedReceiptDate').value ? this.AssetInfo.get('expectedReceiptDate').value : "";
        DeliveryDate = "";
      }
      if (deliveryMode == "Transport") {
        ModeRecipient = this.AssetInfo.get('courierName').value;
        ModeAgency = this.AssetInfo.get('agencyName').value;
        ModeNumber = this.AssetInfo.get('challanNumber').value;
        DispatchDate = this.AssetInfo.get('dispatchDate').value;
        ReceiptDate = !!this.AssetInfo.get('expectedReceiptDate').value ? this.AssetInfo.get('expectedReceiptDate').value : "";
        DeliveryDate = "";
      }
      if (deliveryMode == "HandDelivery") {
        ModeDeliveryBy = this.AssetInfo.get('deliveryBy').value;
        ModeDeliveryTo = this.AssetInfo.get('deliveredTo').value;
        DeliveryDate = this.AssetInfo.get('deliveryDate').value;
        DispatchDate = "";
        ReceiptDate = "";
      }

      var assetDetails = {
        CompanyId: this.CompanyId,
        AssetList: prefarIds.join(','),
        LastModifiedBy: this.UserId,
        TransferType: this.TransferType,
        DeliveryMode: deliveryMode,
        ModeRecipient: ModeRecipient,
        ModeAgency: ModeAgency,
        ModeNumber: ModeNumber,
        DispatchDate: !!DispatchDate ? this.datepipe.transform(DispatchDate, 'dd-MMM-yyyy') : DispatchDate,
        ReceiptDate: !!ReceiptDate ? this.datepipe.transform(ReceiptDate, 'dd-MMM-yyyy') : ReceiptDate,
        ModeDeliveryBy: ModeDeliveryBy,
        ModeDeliveryTo: ModeDeliveryTo,
        TransferDocument: null,
        DeliveryDate: !!DeliveryDate ? this.datepipe.transform(DeliveryDate, 'dd-MMM-yyyy') : DeliveryDate,
        excelfile: null,
        fileList: this.fileList,
        GroupId: this.GroupId
      }
      this.dialogRef.close(assetDetails);
    }
    else {
      this.toastr.warning(this.message.Selectassetphysicaltransfer, this.message.AssetrakSays);
    }

  }
  uploadData() {
    debugger;
    if (this.fileList.length > 0) {
      // this.file = this.fileList[0];
      let formData = new FormData();
      formData.append('uploadFile', this.fileList[0]);
      let headers = new Headers();

      // this.uploadService.UploadFile(formData).subscribe(r => {
      //   debugger;
      //   this.columnData= JSON.parse(r);

      //   this.dialogRef.close(this.columnData);

      // })

    }

  }

  
  dispatchDateValidation() {
    debugger;
    this.maxDateFormat = new Date(this.AssetInfo.get('dispatchDate').value);
    //this.maxDate = this.datepipe.transform(this.maxDateFormat, 'dd-MMM-yyyy');
    this.maxDate = this.maxDateFormat;

  }

  deliveryDateValidation() {
    debugger;
    this.maxDateFormat = new Date(this.AssetInfo.get('deliveryDate').value);
    //this.maxDate = this.datepipe.transform(this.maxDateFormat, 'dd-MMM-yyyy');
    this.maxDate = this.maxDateFormat;
  }

  expectedReceiptDateValidation() {
    debugger;
    this.maxDateFormat = new Date(this.AssetInfo.get('expectedReceiptDate').value);
    this.maxDate = this.datepipe.transform(this.maxDateFormat, 'dd-MMM-yyyy');

  }

  displayFileName : any ;
  uploaderData : any;
  openUploadDialog(value){
    debugger;
    const dialogRef = this.dialog.open(UploadDialogComponent, {
      width: '980px',
      disableClose: true,
      data: { title: value, payload:  this.uploaderData }
    });
    dialogRef.afterClosed().subscribe(result => {
      debugger;
      var name = [];
      this.fileList = [];
      result = result.uploader;
      this.uploaderData = result;
      for (let j = 0; j < result.length; j++) {        
        let data = new FormData();
        let displayName = result[j].file.name;
        name.push(displayName);
        let fileItem = result[j]._file;   
        fileItem['displayName'] = displayName ;
        this.fileList.push(fileItem);
        //this.uploader.queue[j].
        //data.append('file', fileItem);
        //data.append('displayName', displayName);        
      }

      this.displayFileName = name.join(',');
    })
  }
}
