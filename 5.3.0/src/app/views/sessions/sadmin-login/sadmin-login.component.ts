import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { SHA256 } from 'app/components/storage/SHA256';
import { LogOnService } from 'app/components/services/LogOnService';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { environment } from '../../../../environments/environment';

import {
  MatSnackBarVerticalPosition,
  MatSnackBarHorizontalPosition,
  MatSnackBar,
  MatSnackBarConfig
} from "@angular/material/snack-bar";
import { json } from 'ngx-custom-validators/src/app/json/validator';


@Component({
  selector: 'app-sadmin-login',
  templateUrl: './sadmin-login.component.html',
  styleUrls: ['./sadmin-login.component.scss'],
  animations: egretAnimations
})
export class SadminLoginComponent implements OnInit {

  signupForm: FormGroup;
  errorMsg = '';
  actionButtonLabel = "Retry";
  action = false;
  setAutoHide = true;
  autoHide = 2000;
  verticalPosition: MatSnackBarVerticalPosition = "top";
  stringifiedData: any;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private jwtAuth: JwtAuthService,
    public snackBar: MatSnackBar,
    private router: Router,
    private storage: ManagerService,
    public LoginService: LogOnService,
    public SHA256: SHA256,
    private loader: AppLoaderService) { }

  ngOnInit() {
    const password = new FormControl('', Validators.required);
    const confirmPassword = new FormControl('', CustomValidators.equalTo(password));
    this.signupForm = this.fb.group(
      {
        email: ["", [Validators.required, Validators.email]],
        password: password,
        agreed: [false, Validators.required]
      }
    );
  }

  onSubmit() {
    debugger;
    this.storage.clearDB();
    if (!this.signupForm.invalid) {
      this.loader.open();
      const signinData = this.signupForm.value
      const UserName = signinData.email;
      const Password = signinData.password;

      const SHA256 = this.SHA256.convertToSHA256(Password);
      const Authdata = signinData.email + ":" + SHA256;
      console.log(SHA256);
      var encodeauthdata = btoa(Authdata);
      //var decodeauth  = atob(authdata);
      this.LoginService.customerLogin(UserName, Password, encodeauthdata)
        .subscribe(response => {
          debugger;
          this.loader.close();
          if (response == null) {
            this.snackBar.open('Username or password is incorrect!', 'OK', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'end' })
            this.router.navigateByUrl("sessions/login");
          }
          else {
            this.jwtAuth.setUserAndToken(response.SessionId, response.ProfileId, true);
            this.storage.set(Constants.SESSSION_STORAGE, Constants.USER_PROFILE, response.ProfileId)
            this.storage.set(Constants.SESSSION_STORAGE, Constants.USER_ID, response.UserId)
            this.storage.set(Constants.SESSSION_STORAGE, Constants.USER_NAME, response.UserName)
            const Name = response.FirstName + ' ' + response.LastName;
            this.storage.set(Constants.SESSSION_STORAGE, Constants.Name, Name)
            this.storage.set(Constants.SESSSION_STORAGE, Constants.Authenticated, true)
            if (response.ProfileId == 1) {
              this.router.navigateByUrl("h/a");
            }
            else {

            }
          }
        }, err => {
          this.errorMsg = err.message;
          this.loader.close();
        })
    }
  }
}
