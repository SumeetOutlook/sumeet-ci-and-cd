import { Component, OnInit, Inject, ViewChild,EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import * as headers from '../../../../../assets/Headers.json';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import {
  MatSnackBarVerticalPosition,
  MatSnackBarHorizontalPosition,
  MatSnackBar,
  MatSnackBarConfig
} from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-emp-dialog',
  templateUrl: './emp-dialog.component.html',
  styleUrls: ['./emp-dialog.component.scss']
})
export class CreateEmployeeDialogComponent implements OnInit {

  submitted: boolean = false;
  dialogGroupForm: FormGroup;
  get f1() { return this.dialogGroupForm.controls; };

  constructor(public dialogRef: MatDialogRef<CreateEmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,public localService: LocalStoreService,
    private jwtAuth: JwtAuthService,public snackBar: MatSnackBar, private router: Router
  ) { }

  LoginUserInfo: any;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  contactNumberPattern = "^((\\+91-?)|0)?[0-9]{10}$"; 

  ngOnInit() {

    this.LoginUserInfo = JSON.parse(localStorage.getItem("selectedgrp"));

    this.dialogGroupForm = this.fb.group({
      employeeId: [ '', [Validators.required,this.noWhitespaceValidator]],
      employeeEmail: [ '',  [Validators.required,Validators.email,this.noWhitespaceValidator]],
      firstName: [ '', [Validators.required,this.noWhitespaceValidator]],
      lastName: [ '', [Validators.required,this.noWhitespaceValidator]],
      contactNo: ['',[Validators.pattern(this.contactNumberPattern),Validators.maxLength(12)]], 
      Location: [''],
      
    });

    
    if(this.data.component1 == 'CreateEmployeeDialogComponent' && this.data.value === 'edit')
    {
     
      this.dialogGroupForm.controls['employeeId'].setValue(this.data.name.EmployeeId),
      this.dialogGroupForm.controls['employeeEmail'].setValue(this.data.name.EmployeeEmail),     
      this.dialogGroupForm.controls['firstName'].setValue(this.data.name.FirstName),
      this.dialogGroupForm.controls['lastName'].setValue(this.data.name.LastName),
      this.dialogGroupForm.controls['contactNo'].setValue(this.data.name.ContactNo),
      this.dialogGroupForm.controls['Location'].setValue(this.data.name.Location)
      
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

    const EmployeeData = this.dialogGroupForm.value;
    
debugger;

var companyData = {

  EmployeeId: EmployeeData.employeeId,
  EmployeeEmail: EmployeeData.employeeEmail,
  FirstName: EmployeeData.firstName,
  LastName: EmployeeData.lastName,
  ContactNo: EmployeeData.contactNo,
  Location: EmployeeData.Location
  
}

this.dialogRef.close(companyData)
}
}
