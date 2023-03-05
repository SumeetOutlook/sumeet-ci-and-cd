import { Component, OnInit, Inject, ViewChild,EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import * as headers from '../../../../../assets/Headers.json';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-createcpusubclass-dialog',
  templateUrl: './createcpusubclass-dialog.component.html',
  styleUrls: ['./createcpusubclass-dialog.component.scss']
})
export class CreateCPUSubClassDialogComponent implements OnInit {

  submitted: boolean = false;
  headers: any ;
  array;
  public cpuClass:string;
  dialogForm: FormGroup;
  splitedName: any [] = [];
  get f() { return this.dialogForm.controls; };

  constructor(public dialogRef: MatDialogRef<CreateCPUSubClassDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,public localService: LocalStoreService,private jwtAuth : JwtAuthService 
  ) {
    this.headers = this.jwtAuth.getHeaders();
   }

  ngOnInit() {
    this.dialogRef.updateSize("'auto'");
    this.dialogForm = this.fb.group({
      CpuSubClassCode:[this.data.CpuSubClassCode ||''],
      CpuSubClassName:[this.data.CpuSubClassName || '',[Validators.required, this.noWhitespaceValidator]],
    });

    if(this.data.value==='edit')
    {
      this.splitedName =this.data.payload.CpuSubClassName.split('|', 2);
    }

    if(this.data.component1=="CpuSubClassComponent" && this.data.value=='edit')
    {
      this.dialogForm.controls['CpuSubClassCode'].setValue(this.data.payload.CpuSubClassCode),
      this.dialogForm.controls['CpuSubClassName'].setValue(this.splitedName.length > 1 ? this.splitedName[1]:this.data.payload.CpuSubClassName)
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

    if (this.data.component1=='CpuSubClassComponent' && this.dialogForm.valid) {
      var cpusubclassdata={
        CpuSubClassCode: this.dialogForm.value.CpuSubClassCode.trim(),
        CpuSubClassName: this.dialogForm.value.CpuSubClassName.trim(),       
      }

      this.dialogRef.close(cpusubclassdata)
    }
  
  }
}