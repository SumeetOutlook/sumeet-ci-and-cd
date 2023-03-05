import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as headers from '../../../../../assets/Headers.json';


@Component({
  selector: 'app-create-workorder-dialog',
  templateUrl: './create-workorder-dialog.component.html',
  styleUrls: ['./create-workorder-dialog.component.scss']
})
export class CreateWorkorderDialogComponent implements OnInit {

  header:any = (headers as any).default;
  submitted: boolean = false;
  public sbunm: any;
  dialogMapForm: FormGroup;
  get f1() { return this.dialogMapForm.controls; };

  constructor(public matdialogbox: MatDialogRef<CreateWorkorderDialogComponent>,public localService: LocalStoreService, @Inject(MAT_DIALOG_DATA) public data:any,
  private fb: FormBuilder,   
) { }

  ngOnInit(){
      debugger;
      this.dialogMapForm = this.fb.group({
        category : ['',[Validators.required,this.noWhitespaceValidator]],
        type: ['',[Validators.required,this.noWhitespaceValidator]],
        subType: ['',[Validators.required,this.noWhitespaceValidator]]
    });
   debugger;
    if(this.data.component1 == 'SBUComponent' && this.data.value === 'edit')
    {     
      // this.dialogMapForm.controls['category'].setValue(this.data.name.SBU)     
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
  if (this.data.component1 === 'SBUComponent' && this.dialogMapForm.valid) {
     var sbuData={        
       sbu: this.dialogMapForm.value.category.trim()
     }
   
    this.matdialogbox.close(sbuData)
  }
}


}
