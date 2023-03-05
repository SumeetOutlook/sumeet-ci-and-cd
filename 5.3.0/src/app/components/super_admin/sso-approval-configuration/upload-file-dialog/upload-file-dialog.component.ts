import { Component, OnInit,Inject,ViewEncapsulation, Input, Output, EventEmitter  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { UploadService } from 'app/components/services/UploadService';
import {AllPathService} from 'app/components/services/AllPathServices';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { ReconciliationService } from 'app/components/services/ReconciliationService';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from 'app/components/services/GroupService';
// import * as headers from '../../assets/Headers.json';
import { ToastrService } from 'ngx-toastr';

// import * as resource from '../../assets/';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { CostConfigDialogComponent } from 'app/components/cmms/dialogs/cost-config-dialog/cost-config-dialog.component';

@Component({
  selector: 'app-upload-file-dialog',
  templateUrl: './upload-file-dialog.component.html',
  styleUrls: ['./upload-file-dialog.component.scss'],

  animations: [
    trigger('fadeInOut', [
          state('in', style({ opacity: 100 })),
          transition('* => void', [
                animate(400, style({ opacity: 0 }))
          ])
    ])
]
})
export class UploadFileDialogComponent implements OnInit {

  header:any ;
  public AssetType: FormGroup;
  public AssetSubType: FormGroup;
  
  fileList: any[];
  fileextlist:any[];
  message: any ;
  constructor( @Inject(MAT_DIALOG_DATA,) public data: any,
  public uploadService: UploadService,
  public groupService: GroupService,
  public ReconciliationService: ReconciliationService,
  private router: Router,
  public dialogRef: MatDialogRef<UploadFileDialogComponent>,
  private fb: FormBuilder,public dialog: MatDialog,
  public allPathService:AllPathService,private loader: AppLoaderService,public toastr: ToastrService,private jwtAuth:JwtAuthService){
    this.header = this.jwtAuth.getHeaders();
    this.message = this.jwtAuth.getResources();
   }

 
  ngOnInit() {
    debugger;
    this.buildItemForm();
    var FunctionId = 6;
    this.uploadService.GetAllowedExtensions(FunctionId).subscribe(response => {
      debugger;
      this.fileextlist =response;  
    })
  }
  buildItemForm() {
    this.AssetSubType = this.fb.group({
    })
  }

  onclosetab(){
    this.dialogRef.close();

  }
uploadfile
  fileChange(event) {
    debugger;
    this.fileList = event.target.files;
    var name=this.fileList[0].name;
    var size=this.fileList[0].size
    this.FileUploadValidation(name,size);
     if(this.uploadfile ==false){
     event.target.value = null;
     }
  }
  documentId: any;
  CompanyId: any;
  disableLogo:boolean  = false;
  uploadData() {
    debugger;
   
    // var path = item.DocumentPath.split('uploads')
    //   this.AllPath.DownloadUploadDocument(path[1]);       

    if (this.fileList.length > 0 && this.uploadfile == true) {
      let formData = new FormData();
      
      formData.append('uploadfile', this.fileList[0]);
      var companyId = this.CompanyId;
        var documentTypeId = this.fileList[0].DocumentType;
        var Data = {
          documentType: 10,
          CompanyId: 0,
          fileList: this.fileList[0]
        }


      this.uploadService.uploadDocumentCreateAsset(Data).subscribe(r=>{
        debugger;
        if(r){
          this.dialogRef.close(r);

        }  
       else(r=="false")
       {
        this.disableLogo=true;
       }

      }) 
      
      

     
  }
  }
    //PrefarId:any;
    // setUploadMissingFile(companyId, filePath, documentType) {
     
    //   var prefarId = this.PrefarId;//$scope.vm.prefarId1;
    //   var projectType = "None";
    //   var projectId = 0;    
    //   if(documentType == 4){
    //     var path = filePath.split('/Insurance/');
    //   }
    //   else if(documentType == 5){
    //     var path = filePath.split('/AMC/');
    //   }
    //   else if(documentType == 7){
    //     var path = filePath.split('/Invoice/');
    //   }
    //   else if(documentType == 8 || documentType == 9){
    //     var path = filePath.split('uploads/');
    //   }
    //   else{
    //     var path = filePath.split('/Photo/');
    //   }
  
    //   var uploadmissingdto = {
    //     CId: companyId,
    //     PreFarId: prefarId,
    //     ProjectType: projectType,
    //     ProjectId: projectId,
    //     filePath: !!path[1] ? path[1] : "",
    //     documentType: documentType,
    //   }
  
    //   this.ReconciliationService.setUploadMissingFile(uploadmissingdto)
    //     .subscribe(response => {
    //       this.Download.controls['FileUpload'].setValue(null);
    //     })
    // }
   
  
    //   downloadTemplate(Name)
    // {
    //   debugger;
    //   this.loader.open();
    //   this.allPathService.DownloadTemplateExcel(Name);
    //   this.loader.close();
    // }
    doublext= /\.\w{2,3}\.\w{2,3}$/;
    fileName :any;
    
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
       
        this.toastr.error(this.message.filesizerestriction, this.message.AssetrakSays);
       
        return null;
      }
    if( !(filename.endsWith(extension)) )
    {
        this.uploadfile =false;
        
        this.toastr.error(this.message.filesizerestriction, this.message.AssetrakSays);
      
       return null;
    }
   if( doublextension ==true )
   {
      this.uploadfile =false;
       this.toastr.error(this.message.filesizerestriction, this.message.AssetrakSays);
      
      return null;
    } 
     if(filename.startsWith('.') )
     {
       this.uploadfile =false;
      
       this.toastr.error(this.message.filesizerestriction, this.message.AssetrakSays);
    
       return null;
    }
     }
     } 
   }
  
  }
