import { Component, OnInit, Inject, ViewChild,EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import * as headers from '../../../../../assets/Headers.json';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-createmodel-dialog',
  templateUrl: './createmodel-dialog.component.html',
  styleUrls: ['./createmodel-dialog.component.scss']
})
export class CreateModelDialogComponent implements OnInit {

  submitted: boolean = false;
  headers: any ;
  array;
  public cpuClass:string;
  dialogForm: FormGroup;
  splitedName: any [] = [];
  get f() { return this.dialogForm.controls; };

  constructor(public dialogRef: MatDialogRef<CreateModelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,public localService: LocalStoreService,private jwtAuth : JwtAuthService 
  ) { 
    this.headers = this.jwtAuth.getHeaders();
  }

  ngOnInit() {
    this.dialogRef.updateSize("'auto'");
      this.dialogForm = this.fb.group({
        ModelCode:[this.data.ModelCode || ''],
        ModelName:[this.data.ModelName || '',[Validators.required,this.noWhitespaceValidator]],
       
    });
debugger;
    if(this.data.value==='edit')
    {
      this.splitedName =this.data.payload.ModelName.split('|', 2);
    }

    if(this.data.component1=="ModelComponent" && this.data.value=='edit')
    {
      this.dialogForm.controls['ModelCode'].setValue(this.data.payload.ModelCode),
      this.dialogForm.controls['ModelName'].setValue(this.splitedName.length > 1 ? this.splitedName[1]:this.data.payload.ModelName)
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
    if (this.data.component1=='ModelComponent' && this.dialogForm.valid) {
      var modeldata={
        ModelCode: this.dialogForm.value.ModelCode.trim(),
        ModelName: this.dialogForm.value.ModelName.trim(),
      }

      this.dialogRef.close(modeldata)
    }
    
  }


}
