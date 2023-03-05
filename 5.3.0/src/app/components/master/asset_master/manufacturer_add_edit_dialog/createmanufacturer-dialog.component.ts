import { Component, OnInit, Inject, ViewChild,EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import * as headers from '../../../../../assets/Headers.json';
import { LocalStoreService } from '../../../../../app/shared/services/local-store.service';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-createmanufacturer-dialog',
  templateUrl: './createmanufacturer-dialog.component.html',
  styleUrls: ['./createmanufacturer-dialog.component.scss']
})
export class CreateManufacturerDialogComponent implements OnInit {

  submitted: boolean = false;
  headers: any ;
  array;
  public cpuClass:string;
  dialogForm: FormGroup;
  splitedName: any [] = [];
  get f() { return this.dialogForm.controls; };

  constructor(public dialogRef: MatDialogRef<CreateManufacturerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,public localService: LocalStoreService,private jwtAuth : JwtAuthService 
  ) {
    this.headers = this.jwtAuth.getHeaders();
   }

  ngOnInit() {
    this.dialogRef.updateSize("'auto'");
    this.dialogForm = this.fb.group({
      ManufacturerCode:[this.data.ManufacturerCode ||''],
      ManufacturerName:[this.data.ManufacturerName || '',[Validators.required,this.noWhitespaceValidator]],
    });

    if(this.data.value==='edit')
    {
      this.splitedName =this.data.payload.ManufacturerName.split('|', 2);
    }

    if(this.data.component1=="ManufacturerComponent" && this.data.value=='edit')
    {
      this.dialogForm.controls['ManufacturerCode'].setValue(this.data.payload.ManufacturerCode),
      this.dialogForm.controls['ManufacturerName']. setValue(this.splitedName.length > 1 ? this.splitedName[1]:this.data.payload.ManufacturerName)
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

    if (this.data.component1=='ManufacturerComponent' && this.dialogForm.valid) {
      var manufacturerdata={
        ManufacturerCode: this.dialogForm.value.ManufacturerCode.trim(),
        ManufacturerName: this.dialogForm.value.ManufacturerName.trim(),
       
      }
    this.dialogRef.close(manufacturerdata)
    }
  }

}
