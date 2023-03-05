import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as headers from '../../../../../assets/Headers.json';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-sbuAdd-edit-dialog',
  templateUrl: './sbu_add_edit_dialog.component.html',
  styleUrls: ['./sbu_add_edit_dialog.component.scss']
})
export class SbuAddEditDialogComponent implements OnInit {
  header:any ;
  submitted: boolean = false;
  public sbunm: any;
  dialogSBUForm: FormGroup;
  get f1() { return this.dialogSBUForm.controls; };

  constructor(public matdialogbox: MatDialogRef<SbuAddEditDialogComponent>,public localService: LocalStoreService, @Inject(MAT_DIALOG_DATA) public data:any,
  private fb: FormBuilder,  private jwtAuth:JwtAuthService 
) 
{
  this.header = this.jwtAuth.getHeaders()
  }
  ngOnInit(){
      debugger;
      this.dialogSBUForm = this.fb.group({
        sbuName : [this.data.SBU||'',[Validators.required,this.noWhitespaceValidator]]
    });
   debugger;
    if(this.data.component1 == 'SBUComponent' && this.data.value === 'edit')
    {     
      this.dialogSBUForm.controls['sbuName'].setValue(this.data.name.SBU)     
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
  if (this.data.component1 === 'SBUComponent' && this.dialogSBUForm.valid) {
     var sbuData={        
       sbu: this.dialogSBUForm.value.sbuName.trim()
     }
   
    this.matdialogbox.close(sbuData)
  }
}

}
