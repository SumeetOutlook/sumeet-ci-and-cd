import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { MapFarAssetDialogComponent } from '../../../create_assets/create-farasset/map-far-asset-dialog/map-far-asset-dialog.component';
import { UploadService } from 'app/components/services/UploadService';
import { DatePipe } from '@angular/common';
import { MessageAlertService } from '../../../../shared/services/app-msg-alert/app-msg.service';
import * as headers from '../../../../../assets/Headers.json';
import * as resource from '../../../../../assets/Resource.json';
import { ToastrService } from 'ngx-toastr';

interface City {
  id: string;
  name: string;
}
interface Plant {
  id: string;
  name: string;
}
interface AssetClass {
  id: string;
  name: string;
}
interface AssetType {
  id: string;
  name: string;
}
interface UOM {
  id: string;
  name: string;
}
@Component({
  selector: 'app-upload-scanned-software',
  templateUrl: './upload-scanned-software.component.html',
  styleUrls: ['./upload-scanned-software.component.scss']
})
export class UploadScannedSoftwareComponent implements OnInit {

  header: any = (headers as any).default;
  message: any = (resource as any).default;
  photos: any[] = [''];
  files=[{
    file: '',
    name: 'No File Selected'
  }];
  fileText :string= 'No file Selected'

  public uploader: FileUploader = new FileUploader({ isHTML5: true });

  file: File = null;
  fileData: any;
  fileList: any[] = [];
  columnData: any[] = [];
  chkFilsSizeIsValid: boolean;
  date = new Date();
  latest_date: string;
  uploadByName: string;
  today = new Date();

  public AssetInfo: FormGroup;

  get f1() { return this.AssetInfo.controls; };

  constructor(@Inject(MAT_DIALOG_DATA,) public data: any,
    public dialogRef: MatDialogRef<UploadScannedSoftwareComponent>,
    private fb: FormBuilder, public dialog: MatDialog,
    private uploadService: UploadService,
    public datepipe: DatePipe,
    public messageAlertService: MessageAlertService, public toastr: ToastrService) { }


  ngOnInit() {
    debugger;
    this.latest_date = this.datepipe.transform(this.date, 'dd-MMM-yyyy');
    if (this.data.uploadBy === "AssetId") {
      this.uploadByName = this.header.AssetId;
    }
    if (this.data.uploadBy === "InventoryNumber") {
      this.uploadByName = this.header.InventoryNumber;
    }
    this.buildItemForm();
  }

  buildItemForm() {
    debugger;
    this.AssetInfo = this.fb.group({
      // CurrentFARDate: [{ value: this.latest_date, disabled: true }],
      UploadBy: [{ value: this.uploadByName, disabled: true }],
      // NewFARDate:  [{ value: ' ' }, [Validators.required]],
      // DepnRunDate:  [ { value: ' ' }, [Validators.required]],
      FileName: [{ value: ' ' }],
      FileData: '',
    })
    debugger;
  }


  onclosetab() {
    this.dialogRef.close();

  }
  open_MapColumns_Popup() {
    let dialogRef: MatDialogRef<any> = this.dialog.open(MapFarAssetDialogComponent, {
      width: 'auto',
      maxHeight: '90vh',
      minHeight: '30vh',
      disableClose: true,
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
      })
  }

  fileChange(event, file) {
    debugger;
   file.file = event.target.files[0];
   file.name = event.target.files[0].name
    this.fileText = event.target.files[0].name
    this.fileList = event.target.files[0];

  }
  selectedFile: any;
  uploadData() {
    debugger;

    this.selectedFile = this.AssetInfo.get('FileData').value;
    if (!this.selectedFile || this.selectedFile == "") {
      this.messageAlertService.alert({ title: this.message.AssetrakSays, message: this.message.File });
      return false;
    }

    if (this.fileList.length > 0) {
      let formData = new FormData();
      formData.append('uploadFile', this.fileList[0]);
      let headers = new Headers();
      this.uploadService.UploadMultipleAssets(formData).subscribe(r => {
        debugger;
        if (r == "There is no data available in the uploaded spreadsheet. Please check and try again.") {
          this.toastr.error( this.message.SpredsheetBlank, this.message.AssetrakSays);
          this.dialogRef.close("");
        }
        else if (!!r && r != null) {
          this.columnData = JSON.parse(r);
          this.dialogRef.close(this.columnData);
        }
        else {
          this.toastr.error(this.message.NotAllowtoUploadFile, this.message.AssetrakSays);
        }
      })
    }

  }

  maxDate: any;
  maxDateFormat: any;
  depRunDateValidation() {
    debugger;
    this.maxDateFormat = new Date(this.AssetInfo.get('NewFARDate').value);
    this.maxDate = this.datepipe.transform(this.maxDateFormat, 'dd-MMM-yyyy');
  }

  addAnotherPhoto(){
    if(this.files.length>=3) return;
    this.files.push({
      file: '',
      name: 'No file Selected'
    })
  }

  saveImages(){
    this.dialogRef.close(this.files);
  }
}
