import { Component,Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog } from '@angular/material/dialog';
import { UploadService } from 'app/components/services/UploadService';
import {AllPathService} from 'app/components/services/AllPathServices';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import * as headers from '../../../../../assets/Headers.json';
import * as resource from '../../../../../assets/Resource.json';
import { ToastrService } from 'ngx-toastr';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
@Component({
  selector: 'app-type-upload-dialog',
  templateUrl: './type-upload-dialog.component.html',
  styleUrls: ['./type-upload-dialog.component.scss']
})
export class TypeUploadDialogComponent implements OnInit {

  header: any ;
  public AssetInfo: FormGroup;
  fileList: any[];
  fileextlist:any[];
  message: any = (resource as any).default;
  constructor(@Inject(MAT_DIALOG_DATA,) public data: any,
  public uploadService: UploadService,
  public dialogRef: MatDialogRef<TypeUploadDialogComponent>,
  private fb: FormBuilder,public dialog: MatDialog,
  public allPathService:AllPathService,private loader: AppLoaderService, public toastr: ToastrService,private jwtAuth : JwtAuthService) 
  {
    this.header = this.jwtAuth.getHeaders()
   }

  ngOnInit(): void {
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
    if (this.fileList.length > 0 && this.uploadfile == true) {
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
