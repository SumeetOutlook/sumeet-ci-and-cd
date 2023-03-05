import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialog ,MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { FileUploader } from 'ng2-file-upload';
import { AssetRetireService } from '../../../services/AssetRetireService';
import { UploadService } from 'app/components/services/UploadService';
import { AllPathService } from '../../../services/AllPathServices';
import { ToastrService } from 'ngx-toastr';
import * as resource from '../../../../../assets/Resource.json';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent implements OnInit {

  Headers: any = [];
  message: any ;
  title : any;
  dialogForm: FormGroup;
  dialogHide : any;
  public uploader: FileUploader = new FileUploader({ isHTML5: true });
  public hasBaseDropZoneOver: boolean = false;
  docs:any
  fileextlist:any[];
  selectedfile :any;
  @ViewChild('selectedFile') selectedFile: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,   
    private fb: FormBuilder,public ars: AssetRetireService,
    public AllPath : AllPathService,
    private jwtAuth: JwtAuthService,public toastr: ToastrService,public uploadService: UploadService
    ){
      this.Headers = this.jwtAuth.getHeaders();
      this.message = this.jwtAuth.getResources();
    }

  get f() { return this.dialogForm.controls; };
  ngOnInit() {
    debugger;
    this.dialogHide  = true;
    this.uploader.clearQueue();
    this.title = this.data.title ;
    this.dialogForm = this.fb.group({      
      commentCtrl: [''],
    })

    if(!!this.data.payload){
      this.uploader.queue = this.data.payload ;
    }
    var RetiredId = this.data.retId;
    this.ars.GetDocumentlistByRetireAssetID(RetiredId).subscribe(r => {
      debugger;
      if (!!r) {
        var documentList = [];
        documentList = JSON.parse(r);
        this.docs = documentList;       
      }
      this.dialogHide  = false;
    })
    var FunctionId = 12;
    this.uploadService.GetAllowedExtensions(FunctionId).subscribe(response => {
      debugger;
      this.fileextlist =response;  
    })
  }
  checboxlist : any[]=[];
  checkboxclick(item){    
    var idx = this.checboxlist.indexOf(item.DocumentId) ;
    if(idx > -1){
      this.checboxlist.splice(idx , 1);
    }
    else{
      this.checboxlist.push(item.DocumentId);
    }
  }
  viewpath(item){
    debugger;
    var path = item.DocumentPath.split('uploads')
    this.AllPath.ViewDocument(path[1]); 
  }
  datetimestamp = Date.now();
  Submit(){
    this.datetimestamp = Date.now();
    var oldDocName = [];
    if(this.docs.length > 0){
      for(let j = 0; j < this.docs.length; j++){
         var idx = this.checboxlist.indexOf(this.docs[j].DocumentId);
         if(idx > -1){
          oldDocName.push(this.docs[j].DocumentName);
         }
      }
    }
    // if (this.uploader.queue.length > 0) {
    //   for (let j = 0; j < this.uploader.queue.length; j++) {        
    //     let data = new FormData();
    //     let displayName = this.uploader.queue[j].file.name;
    //     let fileItem = this.uploader.queue[j]._file;   
    //     //this.uploader.queue[j].
    //     data.append('file', fileItem);
    //     data.append('displayName', displayName);
    //     data.append('Rfid', this.datetimestamp.toString());        
    //   }
    // }
    // else {
    //   this.datetimestamp = null;
    // }
    var result = {
      uploader : this.uploader.queue,
      oldDocName : oldDocName.join(',')
    }
    this.dialogRef.close(result);
  }
  fileList: any[];
  fileChange(event) 
  {
    debugger;
    this.fileList=[];
    this.fileList = event;
    for(var i =0 ; i< this.fileList.length; i++){
      this.selectedfile=this.fileList[i];
     this.FileUploadValidation(this.fileList[i].file.name,this.fileList[i].file.size);

     if(this.uploadfile == false){
      this.selectedFile.nativeElement.value = '';
      this.uploader.queue[i].remove();
   }
  }
  }
  doublext= /\.\w{2,3}\.\w{2,3}$/;
  fileName :any;
  uploadfile: boolean =false;
  FileUploadValidation(filename,filesize) {
    debugger;
   this.fileName = filename;
   var extension = filename.substr(filename.lastIndexOf('.')); 
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
   if( (!(filename.endsWith(extension))) || this.fileextlist.indexOf(extension) == -1 || doublextension ==true || filename.startsWith('.'))
   {
       this.uploadfile =false;
       this.toastr.error(this.message.fileextensionvalidation2, this.message.AssetrakSays);
       return null;
   }
 
   }
   } 
 }
}
