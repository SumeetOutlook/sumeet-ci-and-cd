import { Component, OnInit, Inject, ViewChild,EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import * as headers from '../../../../../assets/Headers.json';
import { LocalStoreService } from '../../../../../app/shared/services/local-store.service';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-createvendor-dialog',
  templateUrl: './createvendor-dialog.component.html',
  styleUrls: ['./createvendor-dialog.component.scss']
})
export class CreateVendorDialogComponent implements OnInit {
  submitted: boolean = false;
  headers: any ;
  public cpuClass:string; 
  splitedName: any [] = [];
  dialogForm: FormGroup;
  get f() { return this.dialogForm.controls; };

  constructor(public dialogRef: MatDialogRef<CreateVendorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,public localService: LocalStoreService,private jwtAuth : JwtAuthService 
  ) {
    this.headers = this.jwtAuth.getHeaders();
   }

  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  contactNumberPattern = "^((\\+91-?)|0)?[0-9]{10}$"; 
ngOnInit() {
    this.dialogRef.updateSize("'auto'");
    this.dialogForm = this.fb.group({
      SupplierCode:[this.data.SupplierCode  || ''],
      SupplierName:[this.data.SupplierName  || '',[Validators.required,this.noWhitespaceValidator]],
      employeeEmail: [ this.data.SupplierEmail || '',[Validators.pattern(this.emailPattern)]],
      contactNo: [this.data.Temp1  || '',[Validators.pattern(this.contactNumberPattern),Validators.maxLength(12)]], 
    });

    if(this.data.value==='edit')
    {
      this.splitedName =this.data.payload.SupplierName.split('|', 2);
    }

    if(this.data.component1 == 'VenderComponent' && this.data.value==='edit')
    {
      // this.dialogForm.controls['SupplierName'].setValue(this.data.payload.SupplierName),
      this.dialogForm.controls['SupplierName'].setValue(this.splitedName.length > 1 ? this.splitedName[1]:this.data.payload.SupplierName),
      this.dialogForm.controls['SupplierCode'].setValue(this.data.payload.SupplierCode),
      this.dialogForm.controls['employeeEmail'].setValue(this.data.payload.SupplierEmail), 
      this.dialogForm.controls['contactNo'].setValue(this.data.payload.Temp1)
   
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
    if(this.data.component1=='VenderComponent' && this.dialogForm.valid)
    {
      var supplierdata=
      {
        SupplierName:this.dialogForm.value.SupplierName.trim(),
        SupplierCode:this.dialogForm.value.SupplierCode.trim(),
        SupplierEmail:this.dialogForm.value.employeeEmail,
        contactNo:this.dialogForm.value.contactNo
      }
    }
    this.dialogRef.close(supplierdata)
   
  }

}
