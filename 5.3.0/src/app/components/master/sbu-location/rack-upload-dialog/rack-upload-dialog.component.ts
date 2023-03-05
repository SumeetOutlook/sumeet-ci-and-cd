import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AllPathService } from 'app/components/services/AllPathServices';
import { UploadService } from 'app/components/services/UploadService';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import * as headers from '../../../../../assets/Headers.json';
import { ToastrService } from 'ngx-toastr';
import * as resource from '../../../../../assets/Resource.json';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
@Component({
  selector: 'app-rack-upload-dialog',
  templateUrl: './rack-upload-dialog.component.html',
  styleUrls: ['./rack-upload-dialog.component.scss']
})
export class RackUploadDialogComponent implements OnInit {

  header:any;
  public RackInfo: FormGroup;
  fileList: any[];
  fileextlist:any[];
  message: any ;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public uploadService: UploadService,
    public dialogRef: MatDialogRef<RackUploadDialogComponent>,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public allPathService: AllPathService,
    private loader: AppLoaderService,
    public toastr: ToastrService,
    private jwtAuth  : JwtAuthService
  ) 
  {
    this.header =this.jwtAuth.getHeaders();
    this.message = this.jwtAuth.getResources();
   }

  ngOnInit(): void {
    this.buildLocationForm();
    var FunctionId = 3;
    this.uploadService.GetAllowedExtensions(FunctionId).subscribe(response => {
      debugger;
      this.fileextlist =response;  
    })
  }

  onClose() {
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

  uploadFile() {
    debugger;
   
    if (this.fileList.length > 0 && this.uploadfile == true) {
      let formData = new FormData();
      formData.append('uploadFile', this.fileList[0]);

      this.uploadService.UploadFile(formData).subscribe(res => {
        debugger;
        if (res) {
          this.dialogRef.close(res);
        }
      });
    }
  }

  downloadTemplate(name) {
    debugger;
    this.loader.open();
    this.allPathService.DownloadTemplateExcel(name);
    this.loader.close();
  }

  buildLocationForm() {
    this.RackInfo = this.formBuilder.group({})
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
