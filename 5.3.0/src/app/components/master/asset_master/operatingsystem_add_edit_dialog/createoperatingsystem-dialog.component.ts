import { Component, OnInit, Inject, ViewChild,EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import * as headers from '../../../../../assets/Headers.json';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { MatSelect } from '@angular/material/select';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-createoperatingsystem-dialog',
  templateUrl: './createoperatingsystem-dialog.component.html',
  styleUrls: ['./createoperatingsystem-dialog.component.scss']
})
export class CreateOperatingSystemDialogComponent implements OnInit{

  submitted: boolean = false;
  headers: any ;
  array;
  public cpuClass:string;
  dialogOperatingSystemForm: FormGroup;
  splitedName: any [] = [];
  get f2() { return this.dialogOperatingSystemForm.controls; };

  constructor(public dialogRef: MatDialogRef<CreateOperatingSystemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private fb: FormBuilder,public localService: LocalStoreService,
    private jwtAuth : JwtAuthService   
  ) { 
    this.headers = this.jwtAuth.getHeaders();
  }

  ngOnInit() 
  {
    this.dialogRef.updateSize("'auto'");
    this.dialogOperatingSystemForm = this.fb.group({
      OperatingSystemCode:[this.data.OperatingSystemCode  || ''],
      OperatingSystemName:[this.data.OperatingSystemName  || '',[Validators.required, this.noWhitespaceValidator]],
    });
    debugger;
    if(this.data.value==='edit')
    {
      this.splitedName =this.data.payload.OperatingSystemName.split('|', 2);
    }

    if(this.data.value==='edit' && this.data.component1=="OperatingSystemComponent")
    {
      this.dialogOperatingSystemForm.controls['OperatingSystemCode'].setValue(this.data.payload.OperatingSystemCode),
      this.dialogOperatingSystemForm.controls['OperatingSystemName'].setValue(this.splitedName.length > 1 ? this.splitedName[1]:this.data.payload.OperatingSystemName)
    }
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}
  onclosetab(){
    debugger;
    this.dialogRef.close();
  }
  

  onSubmit() {
    debugger;
    if (this.data.component1=='OperatingSystemComponent' && this.dialogOperatingSystemForm.valid) {
      var operatingsystemdata={
        OperatingSystemCode: this.dialogOperatingSystemForm.value.OperatingSystemCode.trim(),
        OperatingSystemName: this.dialogOperatingSystemForm.value.OperatingSystemName.trim(),       
      }
     this.dialogRef.close(operatingsystemdata)    
    }

  }

}
