import { Component, OnInit, Inject, ViewChild } from '@angular/core';
//import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { SbuComponent } from 'app/pages/sbu/sbu.component';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { SbuComponent } from '../sbu/sbu.component';
import * as headers from '../../../../assets/Headers.json';

@Component({
  selector: 'app-sbu-dialog',
  templateUrl: './sbu-dialog.component.html',
  styleUrls: ['./sbu-dialog.component.scss']
})
export class SbuDialogComponent implements OnInit {

  submitted: boolean = false;
  products: any = (headers as any).default;
  constructor(public dialogRef: MatDialogRef<SbuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) { }

  
  dialogForm: FormGroup;
  get f() { return this.dialogForm.controls; };
  dialogForm1: FormGroup;
  get f1() { return this.dialogForm.controls; };

  ngOnInit() {
    this.dialogRef.updateSize("500px");
    console.log("came to dialog?")
    this.dialogForm = this.fb.group({
      name: [this.data.name || '', [Validators.required, Validators.minLength(3)]],
      // sbuCode : [this.data.name||'',[Validators.required,Validators.minLength(3)]],
    });
  }

  onSubmit() {
    if (this.dialogForm.invalid) {
      return true;
    }
    else {
      console.log(this.dialogForm.get('name').value)
      this.dialogRef.close(this.dialogForm.value)
    }
  }

}
