import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialog ,MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AllPathService } from '../../services/AllPathServices';

@Component({
  selector: 'app-view-upload-documents-dialog',
  templateUrl: './view-upload-documents-dialog.component.html',
  styleUrls: ['./view-upload-documents-dialog.component.scss']
})
export class ViewUploadDocumentsDialogComponent implements OnInit {

  title : any;
  dialogForm: FormGroup;
  uploader :any[] = [];
  flag: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,   
    private fb: FormBuilder,
    public AllPath : AllPathService
 
    ) { }

  get f() { return this.dialogForm.controls; };
  ngOnInit() {
      
    this.title = this.data.title ;
    this.dialogForm = this.fb.group({      
      commentCtrl: [''],
    })

    if(!!this.data.payload){
      this.uploader = this.data.payload ;
    }
  }
  viewpath(item){
    
    var path = item.DocumentPath.split('uploads')
    this.AllPath.DownloadUploadDocument(path[1]); 
  }
  datetimestamp = Date.now();
  Submit(){   
    this.dialogRef.close(false);
  }

}
