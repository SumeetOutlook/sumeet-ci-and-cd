import { Component, OnInit,Inject,ViewEncapsulation, Input, Output, EventEmitter  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { UploadService } from 'app/components/services/UploadService';
import {AllPathService} from 'app/components/services/AllPathServices';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { ToastrService } from 'ngx-toastr';
import * as resource from '../../../../../assets/Resource.json';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-upload-operatingsystem-popup',
  templateUrl: './upload_operatingsystem_popup.component.html',
  styleUrls: ['./upload_operatingsystem_popup.component.scss'],
  animations: [
    trigger('fadeInOut', [
          state('in', style({ opacity: 100 })),
          transition('* => void', [
                animate(400, style({ opacity: 0 }))
          ])
    ])
]
})
export class UploadOperatingSystemPopUpComponent implements OnInit {
 
  headers: any ;
  public AssetInfo: FormGroup;
  fileList: any[];
  fileextlist:any[];
  message: any ;
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<UploadOperatingSystemPopUpComponent>,
  private fb: FormBuilder,public dialog: MatDialog, public uploadService: UploadService,
  public allPathService:AllPathService,private loader: AppLoaderService,public toastr: ToastrService,private jwtAuth : JwtAuthService) { 
    this.headers = this.jwtAuth.getHeaders();
    this.message = this.jwtAuth.getResources();
  }

  ngOnInit() {
    this.buildItemForm();
    var FunctionId = 4;
    this.uploadService.GetAllowedExtensions(FunctionId).subscribe(response => {
      debugger;
      this.fileextlist =response;  
    })
  }
  buildItemForm() {
    this.AssetInfo = this.fb.group({
      // CurrentFARDate: [{value:'27-Oct-2020',disabled:true}],
      // UploadBy: [{value:'GRN No',disabled:true}],
      // NewFARDate: [' '],
      // DepnRunDate: [' '],
      // FileName: [{value:' '}],
    })
  }

  onclosetab(){
    this.dialogRef.close();

  }

  fileChange(event) {
    debugger;
    this.fileList = event.target.files;
    this.FileUploadValidation(this.fileList[0].name,this.fileList[0].size);
    if(this.uploadfile ==false){
      event.target.value = null;
      }
  }
  uploadData() {
    debugger;
  
    if (this.fileList.length > 0  && this.uploadfile == true) {
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

