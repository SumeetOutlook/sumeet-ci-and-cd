import { Component, OnInit, Inject, ViewChild,EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import * as headers from '../../../../../assets/Headers.json';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-createcostcenter-dialog',
  templateUrl: './createcostcenter-dialog.component.html',
  styleUrls: ['./createcostcenter-dialog.component.scss']
})
export class CreateCostCenterDialogComponent implements OnInit {
  submitted: boolean = false;
  headers: any ;
  array;
  public cpuClass:string;
  dialogForm: FormGroup;
  get f() { return this.dialogForm.controls; };


  constructor(public dialogRef: MatDialogRef<CreateCostCenterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,public localService: LocalStoreService,private jwtAuth : JwtAuthService 
  ) {
    this.headers = this.jwtAuth.getHeaders();
   }


  ngOnInit() {
    this.dialogRef.updateSize("'auto'");
    this.dialogForm = this.fb.group({
      CostCenterCode:[this.data.CostCenterCode  || ''],
      Name:[this.data.Name  || '',[Validators.required,this.noWhitespaceValidator]],
     
    });

    if(this.data.component1 == 'CostCenterComponent' && this.data.value==='edit')
    {
      this.dialogForm.controls['Name'].setValue(this.data.payload.Name),
      this.dialogForm.controls['CostCenterCode'].setValue(this.data.payload.CostCenterCode)
     
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
    
    if(this.data.component1=='CostCenterComponent'  && this.dialogForm.valid)
    {
      var costcenterdata={
        Name:this.dialogForm.value.Name.trim(),
        CostCenterCode:this.dialogForm.value.CostCenterCode.trim() 
      }
    }
    this.dialogRef.close(costcenterdata)
  }

}
