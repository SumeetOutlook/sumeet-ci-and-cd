import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GroupService } from 'app/components/services/GroupService';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { NumberValidator } from 'ngx-custom-validators/src/app/number/directive';


@Component({
  selector: 'app-edituserdialog',
  templateUrl: './edit_user_dialog.component.html',
  styleUrls: ['./edit_user_dialog.component.scss']
})
export class editUserDialogComponent implements OnInit {
  submitted: boolean = false;
  UserNameDisabled: boolean = true;
  dialogUserEditForm: FormGroup;
  IsDisabledEmployeeId: boolean = true;
  get f1() { return this.dialogUserEditForm.controls; };

  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  contactNumberPattern = "^((\\+91-?)|0)?[0-9]{10}$"; 
  

  constructor(public dialogRef: MatDialogRef<editUserDialogComponent>,public localService: LocalStoreService, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,) { }

  ngOnInit() {  
    this.dialogUserEditForm = this.fb.group({
      userName: [{value:'', disabled: true}, [Validators.required,Validators.pattern(this.emailPattern)]],
      firstName: [this.data.FirstName || '', [ Validators.required]],
      lastName: [this.data.LastName || '', [Validators.required]],
      contactNo: [this.data.ContactNo || '', [Validators.pattern(this.contactNumberPattern)]],
      employeeId: [ ''],
    });

    
    if(this.data.component1 == 'UserEditComponent' && this.data.value === 'edit')
    {
     
      this.dialogUserEditForm.controls['userName'].setValue(this.data.name.UserName),
      this.dialogUserEditForm.controls['firstName'].setValue(this.data.name.FirstName),     
      this.dialogUserEditForm.controls['lastName'].setValue(this.data.name.LastName),
      this.dialogUserEditForm.controls['contactNo'].setValue(this.data.name.ContactNo),
      this.dialogUserEditForm.controls['employeeId'].setValue(this.data.name.EmpolyeeID)
      
    }

}

public onclosetab() {
  this.dialogRef.close();
}

onSubmit() {
  debugger;
  if (this.data.component1 === 'UserEditComponent' && this.dialogUserEditForm.valid) {
     var userData={        
      userName: this.dialogUserEditForm.value.userName,
       firstName: this.dialogUserEditForm.value.firstName,        
       lastName: this.dialogUserEditForm.value.lastName,
       contactNo: this.dialogUserEditForm.value.contactNo,     
     }
   
    this.dialogRef.close(userData)
  }
}
}
