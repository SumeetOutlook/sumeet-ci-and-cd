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

@Component({
  selector: 'app-add-manufacturer-dialog',
  templateUrl: './add-manufacturer-dialog.component.html',
  styleUrls: ['./add-manufacturer-dialog.component.scss']
})
export class AddManufacturerDialogComponent implements OnInit {

  header: any = (headers as any).default;
  message: any = (resource as any).default;
  //manufacturer: any;
  //description: any;
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

  public dialogForm: FormGroup;

  get f1() { return this.dialogForm.controls; };

  constructor(@Inject(MAT_DIALOG_DATA,) public data: any,
    public dialogRef: MatDialogRef<AddManufacturerDialogComponent>,
    private fb: FormBuilder, public dialog: MatDialog,
    private uploadService: UploadService,
    public datepipe: DatePipe,
    public messageAlertService: MessageAlertService, public toastr: ToastrService) { }


  ngOnInit() {
    debugger;
    this.dialogForm = this.fb.group({
      manufacturer: ['',[Validators.required]],
      description: ['',[Validators.required]]
    })
  }

  onclosetab() {
    this.dialogRef.close();
  }


  Submit(){
    debugger;
     var patLoad={
      Name : this.dialogForm.value.manufacturer,
      Description : this.dialogForm.value.description
     }
     this.dialogRef.close(patLoad);
  }

}
