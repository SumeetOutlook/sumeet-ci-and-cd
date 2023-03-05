import { Component, OnInit, Inject, ViewChild,EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import * as headers from '../../../../../assets/Headers.json';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-createcpuclass-dialog',
  templateUrl: './createcpuclass-dialog.component.html',
  styleUrls: ['./createcpuclass-dialog.component.scss']
})
export class CreateCPUClassDialogComponent implements OnInit {

  submitted: boolean = false;
  headers: any ;
  array;
  public cpuClass:string;
  dialogForm: FormGroup;
  splitedName: any [] = [];
  get f() { return this.dialogForm.controls; };

  constructor(public dialogRef: MatDialogRef<CreateCPUClassDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,public localService: LocalStoreService,private jwtAuth : JwtAuthService 
  ) { 
    this.headers = this.jwtAuth.getHeaders();
  }

  ngOnInit() {
    debugger;
    this.dialogRef.updateSize("'auto'");
    this.dialogForm = this.fb.group({
      CpuClassCode:[this.data.CpuClassCode ||''],
      CpuClassName:[this.data.CpuClassName || '',[Validators.required, this.noWhitespaceValidator]],
    });
    

    if(this.data.value==='edit')
    {
      this.splitedName =this.data.payload.CpuClassName.split('|', 2);
    }

    if(this.data.component1=="CpuClassComponent" && this.data.value=='edit')
    {
      this.dialogForm.controls['CpuClassCode'].setValue(this.data.payload.CpuClassCode),
      this.dialogForm.controls['CpuClassName'].setValue(this.splitedName.length > 1 ? this.splitedName[1]:this.data.payload.CpuClassName)
     
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
    if (this.data.component1=='CpuClassComponent' && this.dialogForm.valid ) {
      var cpuclassdata={
        CpuClassCode: this.dialogForm.value.CpuClassCode.trim(),
        CpuClassName: this.dialogForm.value.CpuClassName.trim(),       
      }
      this.dialogRef.close(cpuclassdata)
    }
    
    
  }

}
