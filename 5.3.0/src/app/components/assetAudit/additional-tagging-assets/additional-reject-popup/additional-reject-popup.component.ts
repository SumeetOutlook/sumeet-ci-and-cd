import { Component, OnInit ,Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-additional-reject-popup',
  templateUrl: './additional-reject-popup.component.html',
  styleUrls: ['./additional-reject-popup.component.scss']
})
export class AdditionalRejectPopupComponent implements OnInit {

  header: any ;
  message: any ;

  public arrlength = 0;
  public getselectedData: any[] = [];
  public newdataSource = [];
  public isallchk: boolean;
  Approve: any;
  Reject: any;
  dialogRejectForm: FormGroup;
  get f1() { return this.dialogRejectForm.controls; };

  public Rejectctrl: FormControl = new FormControl();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router,
    public toastr: ToastrService,
    public dialogRef: MatDialogRef<AdditionalRejectPopupComponent> ,private fb: FormBuilder , private jwtAuth: JwtAuthService) { 
      this.header = this.jwtAuth.getHeaders();
	    this.message = this.jwtAuth.getResources();
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

