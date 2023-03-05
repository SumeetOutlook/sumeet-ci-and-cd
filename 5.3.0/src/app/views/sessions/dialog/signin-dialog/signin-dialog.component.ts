
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { RSAHelper } from 'app/components/services/RSAHelper';
import { SHA256 } from 'app/components/storage/SHA256';
import { LogOnService } from 'app/components/services/LogOnService';

@Component({
  selector: 'app-signin-dialog',
  templateUrl: './signin-dialog.component.html',
  styleUrls: ['./signin-dialog.component.scss']
})
export class SigninDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private fb: FormBuilder,
    public SHA256: SHA256,
    private rsaHelper : RSAHelper ,
    public LoginService: LogOnService,
    public dialogRef: MatDialogRef<any>) { }

  environment :any;
  signinForm: FormGroup;
  ngOnInit(): void {
    this.environment = this.data.environment;
    const password = new FormControl('', Validators.required);
    this.signinForm = this.fb.group(
      {
        email: ["", [Validators.required]],
        password: password,
        agreed: [false, Validators.required]
      }
    );
  }
  displayError : boolean = false;
  onSubmit() {
        
    if (!this.signinForm.invalid) {      
      const signinData = this.signinForm.value;
      var password : any;
      if (!!this.environment.IsSSO && this.environment.SSOType == '2') {
        password = this.rsaHelper.encryptWithPublicKey(signinData.password);
      }
      else{
        password = this.SHA256.convertToSHA256(signinData.password);
      }  
      const Authdata = signinData.email + ":" + password;
      var encodeauthdata = btoa(Authdata);
      this.displayError = false;
      this.LoginService.customerLogin(signinData.email, password, encodeauthdata)
        .subscribe(response => {          
          if (response == null) {
            this.displayError = true;
          }
          else {
            this.dialogRef.close(response);
          }
        })
    }
  }
  onclosetab() {
    this.dialogRef.close();
  }

}
