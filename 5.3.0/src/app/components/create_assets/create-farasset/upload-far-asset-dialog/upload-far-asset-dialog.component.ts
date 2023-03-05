import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { MapFarAssetDialogComponent } from '../map-far-asset-dialog/map-far-asset-dialog.component';
import { UploadService } from 'app/components/services/UploadService';
import { DatePipe } from '@angular/common';
import { MessageAlertService } from '../../../../shared/services/app-msg-alert/app-msg.service';
import * as headers from '../../../../../assets/Headers.json';
import * as resource from '../../../../../assets/Resource.json';
import { ToastrService } from 'ngx-toastr';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

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
  selector: 'app-upload-far-asset-dialog',
  templateUrl: './upload-far-asset-dialog.component.html',
  styleUrls: ['./upload-far-asset-dialog.component.scss']
})
export class UploadFarAssetDialogComponent implements OnInit {

  header: any ;
  message: any = (resource as any).default;

  fileText :string= 'No file Selected'

  public uploader: FileUploader = new FileUploader({ isHTML5: true });

  file: File = null;
  fileextlist:any[];
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
    public dialogRef: MatDialogRef<UploadFarAssetDialogComponent>,
    private fb: FormBuilder, public dialog: MatDialog,
    private uploadService: UploadService,
    public datepipe: DatePipe,
    public messageAlertService: MessageAlertService, public toastr: ToastrService,private jwtAuth:JwtAuthService) 
    {
      this.header = this.jwtAuth.getHeaders()
    }

    UploadTypeflag :any;
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
    var FunctionId = 5;
    this.uploadService.GetAllowedExtensions(FunctionId).subscribe(response => {
      debugger;
      this.fileextlist =response;  
    })
    this.UploadTypeflag = 1;
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

  fileChange(event) {
    debugger;
  
    this.fileText = event.target.files[0].name
    this.fileList = event.target.files;
    this.FileUploadValidation(this.fileList[0].name,this.fileList[0].size);
    if(this.uploadfile ==false){
      this.fileText = 'No file Selected';
      event.target.value = null;
      }

  }
  selectedFile: any;
  uploadData() {
    debugger;
    var UploadTypeFlag;
    this.selectedFile = this.AssetInfo.get('FileData').value;
    if (!this.selectedFile || this.selectedFile == "") {
      this.messageAlertService.alert({ title: this.message.AssetrakSays, message: this.message.File });
      return false;
    }

    if (this.fileList.length > 0 && this.uploadfile == true) {
      let formData = new FormData();
      UploadTypeFlag = this.UploadTypeflag;
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
  doublext= /\.\w{2,3}\.\w{2,3}$/;
  fileName :any;
  uploadfile: boolean =false;
  FileUploadValidation(filename,filesize) {
    debugger;
   this.fileName = filename;
   var extension = filename.substr(filename.lastIndexOf('.')); //check file type extention
   var doublextension = this.doublext.test(filename);

   for(let j = 0; j < this.fileextlist.length; j++)
   {
    if(extension.toLowerCase() === this.fileextlist[j] &&  filesize < 3000000)
      {    
      this.uploadfile =true;
      }    
  else{
    if (filesize > 3000000)
    { 
    this.uploadfile =false;
    this.toastr.error(this.message.filesizerestriction, this.message.AssetrakSays);
    return null;
 
   }
   if(this.fileextlist.indexOf(extension) == -1)
    {
      this.uploadfile =false;
      this.toastr.error(this.message.fileextensionvalidation1, this.message.AssetrakSays);
      return null;
    }
  if( !(filename.endsWith(extension)) )
  {
      this.uploadfile =false;
      this.toastr.error(this.message.fileextensionvalidation1, this.message.AssetrakSays);
     return null;
  }
 if( doublextension ==true )
 {
    this.uploadfile =false;
     this.toastr.error(this.message.fileextensionvalidation1, this.message.AssetrakSays);
    return null;
  } 
   if(filename.startsWith('.') )
   {
     this.uploadfile =false;
     this.toastr.error(this.message.fileextensionvalidation1, this.message.AssetrakSays);
     return null;
  }
   }
   } 
 }
}
