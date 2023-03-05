import { Component, OnInit,Inject,ViewEncapsulation, Input, Output, EventEmitter  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { UploadService } from 'app/components/services/UploadService';
import {AllPathService} from 'app/components/services/AllPathServices';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import * as headers from '../../../../../assets/Headers.json';
import { ToastrService } from 'ngx-toastr';
import { MessageAlertService } from '../../../../shared/services/app-msg-alert/app-msg.service';
import * as resource from '../../../../../assets/Resource.json';



@Component({
  selector: 'app-upload-assetclass-popup',
  templateUrl: './upload_assetclass_popup.component.html',
  styleUrls: ['./upload_assetclass_popup.component.scss'],
  animations: [
    trigger('fadeInOut', [
          state('in', style({ opacity: 100 })),
          transition('* => void', [
                animate(400, style({ opacity: 0 }))
          ])
    ])
]
})
export class UploadAssetClassPopUpComponent implements OnInit {
  products: any = (headers as any).default;
  public AssetInfo: FormGroup;
  fileList: any[];
  fileextlist:any[];
  submitted: boolean = false;
  dialogForm: FormGroup;
  message: any = (resource as any).default;
  get f() { return this.dialogForm.controls; };
  constructor( @Inject(MAT_DIALOG_DATA,) public data: any,
  public uploadService: UploadService,
  public dialogRef: MatDialogRef<UploadAssetClassPopUpComponent>,
  private fb: FormBuilder,public dialog: MatDialog,
  public allPathService:AllPathService,private loader: AppLoaderService,
  public toastr: ToastrService) { }

  ngOnInit() {
    debugger;
    this.dialogForm = this.fb.group({      
      fileuploader:['',Validators.required]
    })
    this.buildItemForm();
    var FunctionId = 2;
    this.uploadService.GetAllowedExtensions(FunctionId).subscribe(response => {
      debugger;
      this.fileextlist =response;  
    })
  }
  buildItemForm() {
    this.AssetInfo = this.fb.group({
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
   // this.FileUploadValidation(this.fileList[0].name,this.fileList[0].size);
    if (this.fileList.length > 0 && this.uploadfile == true) {
      debugger;
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
     
        this.toastr.warning(this.message.fileextensionvalidation1, this.message.AssetrakSays);
       return null;
    }
   if( doublextension ==true )
   {
      this.uploadfile =false;
     
       this.toastr.warning(this.message.fileextensionvalidation1, this.message.AssetrakSays);
      return null;
    } 
     if(filename.startsWith('.') )
     {
       this.uploadfile =false;
     
       this.toastr.warning(this.message.fileextensionvalidation1, this.message.AssetrakSays);
       return null;
    }
     }
     } 
   }
}

