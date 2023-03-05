import { Component, OnInit,Inject,ViewEncapsulation, Input, Output, EventEmitter  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { UploadService } from 'app/components/services/UploadService';
import {AllPathService} from 'app/components/services/AllPathServices';
import {AppLoaderService } from '../../../../../shared/services/app-loader/app-loader.service';
// import * as headers from '../../../../../assets/Headers.json';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-subtype-upload-dialog',
  templateUrl: './subtype-upload-dialog.component.html',
  styleUrls: ['./subtype-upload-dialog.component.scss'],
  animations: [
    trigger('fadeInOut', [
          state('in', style({ opacity: 100 })),
          transition('* => void', [
                animate(400, style({ opacity: 0 }))
          ])
    ])
]
})
export class SubtypeUploadDialogComponent implements OnInit {
  header:any ;
  public AssetSubType: FormGroup;
  fileList: any[];
  constructor( @Inject(MAT_DIALOG_DATA,) public data: any,
  public uploadService: UploadService,
  public dialogRef: MatDialogRef<SubtypeUploadDialogComponent>,
  private fb: FormBuilder,public dialog: MatDialog,
  public allPathService:AllPathService,private loader: AppLoaderService,private jwtAuth:JwtAuthService) 
  {
    this.header = this.jwtAuth.getHeaders()
   }


  ngOnInit(){
    this.buildItemForm();
  }
  buildItemForm() {
    this.AssetSubType = this.fb.group({
    })
  }

  onclosetab(){
    this.dialogRef.close();

  }

  fileChange(event) {
    debugger;
    this.fileList = event.target.files;

  }
  uploadData() {
    debugger;
    if (this.fileList.length > 0) {
      let formData = new FormData();
      formData.append('uploadFile', this.fileList[0]);

      this.uploadService.UploadFile(formData).subscribe(r=>{
        debugger;
        if(r){
          this.dialogRef.close(r);
        }     
      })     
      }
    }

    downloadTemplate(Name)
    {
      debugger;
      this.loader.open();
      this.allPathService.DownloadTemplateExcel(Name);
      this.loader.close();
    }
}
