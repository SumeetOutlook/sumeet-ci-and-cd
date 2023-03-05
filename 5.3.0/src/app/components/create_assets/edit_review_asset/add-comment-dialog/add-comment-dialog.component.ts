import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import * as headers from '../../../../../assets/Headers.json';
import * as resource from '../../../../../assets/Resource.json';
import { AssetService } from 'app/components/services/AssetService';
import { ToastrService } from 'ngx-toastr';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-add-comment-dialog',
  templateUrl: './add-comment-dialog.component.html',
  styleUrls: ['./add-comment-dialog.component.scss']
})
export class AddCommentDialogComponent implements OnInit {

  header: any ;
  message: any = (resource as any).default;

  Approve: any;
  Reject: any;

  dialogRejectForm: FormGroup;
  get f1() { return this.dialogRejectForm.controls; };

  public Rejectctrl: FormControl = new FormControl();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router,
    public assetservice: AssetService, public toastr: ToastrService,
    public dialogRef: MatDialogRef<any>, private fb: FormBuilder,private jwtAuth: JwtAuthService) 
    {
        this.header = this.jwtAuth.getHeaders()
    }

 
  ngOnInit() {
    debugger;
    this.dialogRejectForm = this.fb.group({
      Rejectctrl: ['', [Validators.required]],
    });
  } 
  onclosetab() {
    this.dialogRef.close();
  }  
  ContinueRejectbtn() {
    debugger;
    const EmployeeData = this.dialogRejectForm.value.Rejectctrl;
    this.dialogRef.close(EmployeeData);
  }

}
