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
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-StorageLocationDialog',
  templateUrl: './storageLocation_add_edit_dialog.component.html',
  styleUrls: ['./storageLocation_add_edit_dialog.component.scss']
})
export class StorageLocationDialogComponent implements OnInit {
  header:any ;
  submitted: boolean = false;
  public sbunm: any;
  dialogSLForm: FormGroup;
  get f1() { return this.dialogSLForm.controls; };

    constructor(public matdialogbox: MatDialogRef<StorageLocationDialogComponent>,public localService: LocalStoreService, @Inject(MAT_DIALOG_DATA) public data:any,
    private fb: FormBuilder, private jwtAuth:JwtAuthService  
  ) 
  {
    this.header = this.jwtAuth.getHeaders()
    }

  ngOnInit(){
    debugger;
    this.dialogSLForm = this.fb.group({
      rackName : [this.data.RackName||'',[Validators.required,this.noWhitespaceValidator]],
  });

  if(this.data.component1 == 'StorageLocationComponent' && this.data.value === 'edit')
  {     
    this.dialogSLForm.controls['rackName'].setValue(this.data.name.RackName)     
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
if (this.data.component1 === 'StorageLocationComponent' && this.dialogSLForm.valid) {
   var rackdata={        
    rackName: this.dialogSLForm.value.rackName.trim()  
   }
 
  this.matdialogbox.close(rackdata)
}
}

}