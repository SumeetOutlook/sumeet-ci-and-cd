import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStoreService } from '../../../../../shared/services/local-store.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { NumberValidator } from 'ngx-custom-validators/src/app/number/directive';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-SubtypeDialog',
  templateUrl: './subtype_add_edit_dialog.component.html',
  styleUrls: ['./subtype_add_edit_dialog.component.scss']
})
export class SubtypeDialogComponent implements OnInit {
  header: any ;
  submitted: boolean = false;
  public grpnm: any;
  dialogSubTypeForm: FormGroup;
  get f1() { return this.dialogSubTypeForm.controls; };

  constructor(public matdialogbox: MatDialogRef<SubtypeDialogComponent>,public localService: LocalStoreService, @Inject(MAT_DIALOG_DATA) public data:any,
  private fb: FormBuilder,private jwtAuth:JwtAuthService 
) 
{
  this.header = this.jwtAuth.getHeaders()
 }
  ngOnInit(){
      debugger;
      this.dialogSubTypeForm = this.fb.group({
        subTypeName : [this.data.SubTypeOfAsset||'',[Validators.required,this.noWhitespaceValidator]],
    });
//this.str_location = this.localService.getItem('selectedgrp');
if(this.data.component1 == 'SubTypeComponent' && this.data.value === 'edit')
{
  this.dialogSubTypeForm.controls['subTypeName'].setValue(this.data.name.SubTypeOfAsset)  
}

}

public onclosetab() {
  this.matdialogbox.close();
}
public noWhitespaceValidator(control: FormControl) {
  const isWhitespace = (control.value || '').trim().length === 0;
  const isValid = !isWhitespace;
  return isValid ? null : { 'whitespace': true };
}
onSubmit() {
  debugger;
  if (this.data.component1 === 'SubTypeComponent' && this.dialogSubTypeForm.valid) {
    var subTypeData={        
      SubTypeOfAsset: this.dialogSubTypeForm.value.subTypeName.trim(),   
    }
  
   this.matdialogbox.close(subTypeData)
 }
}


}
