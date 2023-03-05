import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialog ,MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { UploadDialogComponent } from '../../dialog/upload-dialog/upload-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';

@Component({
  selector: 'app-asset-transfer-submitinformation-dialog',
  templateUrl: './asset-transfer-submitinformation-dialog.component.html',
  styleUrls: ['./asset-transfer-submitinformation-dialog.component.scss']
})
export class AssetTransferSubmitinformationDialogComponent implements OnInit {

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

  approvaltab : boolean= false;
  informationtab : boolean= false;
  withdrawntab : boolean= false;
  title : any;
  transfertype: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    public rs: ReconciliationService,
    private fb: FormBuilder,
    public crs: CompanyRackService,
    public cls: CompanyLocationService,
    public datepipe: DatePipe ,
    public dialog: MatDialog ,
    private loader: AppLoaderService,
    public toastr: ToastrService,
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
      commentCtrl: ['', [Validators.required,this.noWhitespaceValidator]],
    })

    this.buildItemForm(this.data);
    
  }
  buildItemForm(item) {
    debugger;
    var assetDetails = {
      CompanyId : this.data.configdata.CompanyId ,
      LocationId : this.data.configdata.LocationId ,
      TransferId : this.data.configdata.TransferId,
      AssetList : this.data.configdata.AssetList ,
      UserId : this.data.configdata.UserId ,
      TransferType : this.data.configdata.TransferType
    }
    this.rs.GetMultipalAssetForRequestInformation(assetDetails).subscribe(r => {
      debugger;
      this.loader.close();
      this.bindData = JSON.parse(r);
      this.onChangeDataSource(this.bindData);
    })
    
    
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}
  onChangeDataSource(value) {

    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.masterToggle();
  }
  // openUploadDialog(value){
  //   debugger;
  //   const dialogRef = this.dialog.open(UploadDialogComponent, {
  //     width: '980px',
  //     disableClose: true,
  //     data: { title: value, payload: value }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     debugger;
  //   })
  // }

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
      if(!!result){
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
      }  
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

  fileList: any[] = [];
  fileChange(event) {
    debugger;
    this.fileList = event.target.files;
  }
  
  Submit() {
    debugger;
    if (this.selection.selected.length > 0) {
      var prefarIds = [];
      const numSelected = this.selection.selected.length;
      for (var i = 0; i < numSelected; i++) {
        prefarIds.push(this.selection.selected[i].PreFarId);
      }      

      var assetsDetails =
      {
        excelfile: null,
        companyId: this.CompanyId,
        locationId: this.LocationId,
        newLocationId: 0,
        transitType: this.transfertype,
        assetList: prefarIds.join(','),
        modifiedBy: this.UserId,
        dateC: '',
        TransferComment: this.dialogForm.get('commentCtrl').value,
        RevertDate: null,
        ProposedTransferDate: '',
        transferredPhoto: null,
        transferredPhotoId: null,
        fileList: this.fileList,
        TransferId : this.data.configdata.TransferId,
        
      }
      this.dialogRef.close(assetsDetails);
    }
    else {
      this.toastr.warning(this.message.SelectAssetstoApproveTransfer, this.message.AssetrakSays);
    }
  }

}
