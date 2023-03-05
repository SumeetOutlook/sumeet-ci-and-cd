import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialog ,MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AllPathService } from '../../../services/AllPathServices';

@Component({
  selector: 'app-viewupload-docregister-dialog',
  templateUrl: './viewupload-docregister-dialog.component.html',
  styleUrls: ['./viewupload-docregister-dialog.component.scss']
})
export class ViewuploadDocregisterDialogComponent implements OnInit {
  title : any;
  dialogForm: FormGroup;
  uploader :any[] = [];
  flag: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,   
    private fb: FormBuilder,
    public AllPath : AllPathService
 
  ) { }
  get f() { return this.dialogForm.controls; };
  ngOnInit(): void {
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
