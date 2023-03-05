import { Component, OnInit, Inject, ViewChild,EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import * as headers from '../../../../../assets/Headers.json';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';


@Component({
  selector: 'app-createapplicationtype-dialog',
  templateUrl: './createapplicationtype-dialog.component.html',
  styleUrls: ['./createapplicationtype-dialog.component.scss']
})
export class CreateApplicationTypeDialogComponent implements OnInit {
  submitted: boolean = false;
  headers: any ;
  array;
  public cpuClass:string;
  dialogForm: FormGroup;
  splitedName: any [] = [];
  get f() { return this.dialogForm.controls; };
 
  constructor(public dialogRef: MatDialogRef<CreateApplicationTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,public localService: LocalStoreService,private jwtAuth : JwtAuthService 
  ) { 
    this.headers = this.jwtAuth.getHeaders();
  }

  ngOnInit() {
    this.dialogRef.updateSize("'auto'");
    this.dialogForm = this.fb.group({
      ApplicationTypeCode:[this.data.ApplicationTypeCode  || ''],
      ApplicationTypeName:[this.data.ApplicationTypeName  || '',[Validators.required,this.noWhitespaceValidator]],
      
    });

    if(this.data.value==='edit')
    {
      this.splitedName =this.data.payload.ApplicationTypeName.split('|', 2);
    }

    if(this.data.component1 == 'ApplicationTypeComponent' && this.data.value==='edit')
    {
      this.dialogForm.controls['ApplicationTypeName']. setValue(this.splitedName.length > 1 ? this.splitedName[1]:this.data.payload.ApplicationTypeName),
      this.dialogForm.controls['ApplicationTypeCode'].setValue(this.data.payload.ApplicationTypeCode)
    
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
    if(this.data.component1=='ApplicationTypeComponent'  && this.dialogForm.valid)
    {
      var applicationtypedata={
        ApplicationTypeName:this.dialogForm.value.ApplicationTypeName.trim(),
        ApplicationTypeCode:this.dialogForm.value.ApplicationTypeCode.trim()
      }
    }
    this.dialogRef.close(applicationtypedata)
  }
}
