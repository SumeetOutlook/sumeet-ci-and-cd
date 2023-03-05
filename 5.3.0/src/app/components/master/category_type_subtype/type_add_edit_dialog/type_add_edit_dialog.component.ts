import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { NumberValidator } from 'ngx-custom-validators/src/app/number/directive';
import * as headers from '../../../../../assets/Headers.json';


@Component({
  selector: 'app-typeDialog',
  templateUrl: './type_add_edit_dialog.component.html',
  styleUrls: ['./type_add_edit_dialog.component.scss']
})
export class TypeDialogComponent implements OnInit {
  header:any = (headers as any).default;
  submitted: boolean = false;
  public grpnm: any;
  dialogTypeForm: FormGroup;
  get f1() { return this.dialogTypeForm.controls; };

  constructor(public matdialogbox: MatDialogRef<TypeDialogComponent>,public localService: LocalStoreService, @Inject(MAT_DIALOG_DATA) public data:any,
  private fb: FormBuilder,   
) { }

  ngOnInit(){
      debugger;
      this.dialogTypeForm = this.fb.group({
        typeName : [this.data.TypeOfAsset||'',[Validators.required,this.noWhitespaceValidator]],
    });
//this.str_location = this.localService.getItem('selectedgrp');

if(this.data.component1 == 'TypeComponent' && this.data.value === 'edit')
{
  this.dialogTypeForm.controls['typeName'].setValue(this.data.name.TypeOfAsset)  
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
  if (this.data.component1 === 'TypeComponent' && this.dialogTypeForm.valid) {
    var typeData={        
      assetType: this.dialogTypeForm.value.typeName.trim(),
    }
  
   this.matdialogbox.close(typeData)
 }
}


}