import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import * as headers from '../../../../../assets/Headers.json';
import * as resource from '../../../../../assets/Resource.json';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-approve-reject-dialog',
  templateUrl: './approve-reject-dialog.component.html',
  styleUrls: ['./approve-reject-dialog.component.scss']
})
export class ApproveRejectDialogComponent implements OnInit {

  header: any ;
  message: any = (resource as any).default;

  public arrlength = 0;
  public getselectedData: any[] = [];
  public newdataSource = [];
  public isallchk: boolean;
  Approve: any;
  Reject: any;
  dialogRejectForm: FormGroup;

  public Rejectctrl: FormControl = new FormControl();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    public dialogRef: MatDialogRef<any>,private fb: FormBuilder,private jwtAuth:JwtAuthService) 
    { 
      this.header = this.jwtAuth.getHeaders()
    }


  ngOnInit() {
    debugger;
    this.dialogRejectForm = this.fb.group({
      Rejectctrl: ['', [Validators.required,this.noWhitespaceValidator]],

    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}
  onclosetab() {
    this.dialogRef.close();
  }

  ContinueRejectbtn() {
    debugger;
    if (this.dialogRejectForm.value.Rejectctrl != null) {
      const EmployeeData = this.dialogRejectForm.value.Rejectctrl;
      this.dialogRef.close(EmployeeData);
    }
  }

}
