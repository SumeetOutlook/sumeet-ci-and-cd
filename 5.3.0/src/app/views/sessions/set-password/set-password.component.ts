import { Component, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import  {UserService}  from '../../../components/services/UserService' ;
import {
  MatSnackBarVerticalPosition,
  MatSnackBarHorizontalPosition,
  MatSnackBar,
  MatSnackBarConfig
} from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {CustomValidators} from 'ng2-validation'; 
import { sha256 } from 'js-sha256';
import { environment } from 'environments/environment';
import * as duplicatepassword from '../../../../assets/DuplicatePassword.json';
import { ToastrService } from 'ngx-toastr';
import { PasswordStrengthValidator } from "../signin4/Password-strength.validator";

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit {


  setPasswordForm: FormGroup;
  requestParams:any[]=[]
  email: any;
  token: any;
  messageShow: boolean;
  message: any;
  IsValid: boolean= false;
  Passpattern: any="/(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z])/";  //,Validators.pattern(this.Passpattern)
  duplicatepassword: any = (duplicatepassword as any).default;
  passwordlist:any;
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;

  constructor(private _route:ActivatedRoute,
    private router: Router, private UserService : UserService , private fb: FormBuilder ,private jwtAuth: JwtAuthService,public snackBar: MatSnackBar, public toastr: ToastrService
    ) { } 

  ngOnInit() {
    this.passwordlist = JSON.parse(JSON.stringify(this.duplicatepassword));
    const password = new FormControl('', [Validators.required,PasswordStrengthValidator,
    Validators.minLength(8),
    Validators.maxLength(12)]);
    const confirmPassword = new FormControl('', CustomValidators.equalTo(password));

    this.setPasswordForm = new FormGroup({
         password: password,
         confirmPassword: confirmPassword,     
       })  
      this.getParam();   
    }


  userName: any;
  flag: any;
  tableid: any;
  groupId: any;
  getParam() {
    
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < url.length; i++) {
      var params = url[i].split("=");
      if (params[0] == 'abc') {
        var abc = params[1];
        //this.xyz = xyz.replace(/\%2B/g, "+").replace(/\%21/g, "!").replace(/\%23/g, "#").replace(/\%24/g, "$").replace(/\%26/g, "&").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")").replace(/\%2A/g, "*").replace(/\%2C/g, ",").replace(/\%2F/g, "/").replace(/\%3A/g, ":").replace(/\%3B/g, ";").replace(/\%3D/g, "=").replace(/\%3F/g, "?").replace(/\%40/g, "@").replace(/\%5B/g, "[").replace(/\%5D/g, "]");
        this.userName = abc;
      }
      if (params[0] == 'flag') {
        var flag = params[1];
        //this.xyz = xyz.replace(/\%2B/g, "+").replace(/\%21/g, "!").replace(/\%23/g, "#").replace(/\%24/g, "$").replace(/\%26/g, "&").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")").replace(/\%2A/g, "*").replace(/\%2C/g, ",").replace(/\%2F/g, "/").replace(/\%3A/g, ":").replace(/\%3B/g, ";").replace(/\%3D/g, "=").replace(/\%3F/g, "?").replace(/\%40/g, "@").replace(/\%5B/g, "[").replace(/\%5D/g, "]");
        this.flag = flag;
      }
      if (params[0] == 'pqr') {
        var pqr = params[1];
        //this.flag = flag.replace(/\%2B/g, "+").replace(/\%21/g, "!").replace(/\%23/g, "#").replace(/\%24/g, "$").replace(/\%26/g, "&").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")").replace(/\%2A/g, "*").replace(/\%2C/g, ",").replace(/\%2F/g, "/").replace(/\%3A/g, ":").replace(/\%3B/g, ";").replace(/\%3D/g, "=").replace(/\%3F/g, "?").replace(/\%40/g, "@").replace(/\%5B/g, "[").replace(/\%5D/g, "]");
        this.tableid = pqr;
      }
      if (params[0] == 'xyz') {
        var xyz = params[1];
        //this.externalpage = externalpage.replace(/\%2B/g, "+").replace(/\%21/g, "!").replace(/\%23/g, "#").replace(/\%24/g, "$").replace(/\%26/g, "&").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")").replace(/\%2A/g, "*").replace(/\%2C/g, ",").replace(/\%2F/g, "/").replace(/\%3A/g, ":").replace(/\%3B/g, ";").replace(/\%3D/g, "=").replace(/\%3F/g, "?").replace(/\%40/g, "@").replace(/\%5B/g, "[").replace(/\%5D/g, "]");
        this.groupId = xyz;
      }
    }
    this.Checkvalid();
  }


  Checkvalid() {
    
   if(!!this.tableid && this.tableid != null)
   {
    var tableId =this.tableid;
    this.UserService.CheckLinkValid(tableId).subscribe(r => {
      if (r == "Link Expired") {
        this.IsValid= false;
        this.message="Link Expired";
       }
      else if(r == "Sucess"){
        this.IsValid= true;
      }else{
        this.IsValid= false;
        this.message="Oops. Something went wrong. Please try again later.";
        } 
    })
   } 
  }


  signup() {
    debugger;
  
     if(this.setPasswordForm.valid)
     {//var email = this.userName.replace(/\%2B/g, "+").replace(/\%21/g, "!").replace(/\%23/g, "#").replace(/\%24/g, "$").replace(/\%26/g, "&").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")").replace(/\%2A/g, "*").replace(/\%2C/g, ",").replace(/\%2F/g, "/").replace(/\%3A/g, ":").replace(/\%3B/g, ";").replace(/\%3D/g, "=").replace(/\%3F/g, "?").replace(/\%40/g, "@").replace(/\%5B/g, "[").replace(/\%5D/g, "]");
      //this.userName = this.userName.replace(/%3D/g, "=");
      //this.userName.btoa(this.userName)
      var password =this.setPasswordForm.value.password;

      password = btoa(password);
    //  var commonPassword = Object.keys(this.passwordlist).map(e=>this.passwordlist[e]);
     // var lenpass = commonPassword.length;
      // for (var i=0; i < commonPassword.length; i++) {
      
      //     if (commonPassword[i] === password) {
      //        // return false;
      //        this.router.navigateByUrl("sessions/forgot-password");
      //        this.flag1 =true;
      //           this.toastr.warning(this.message.passwordpolicy, this.message.AssetrakSays);
      //          return false;
      //     } 
      //  }
      //  if (lenpass <= commonPassword.length && this.flag1 == false){
     
      var flag =this.flag;
      //var tableId =this.tableid.replace(/\%2B/g, "+").replace(/\%21/g, "!").replace(/\%23/g, "#").replace(/\%24/g, "$").replace(/\%26/g, "&").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")").replace(/\%2A/g, "*").replace(/\%2C/g, ",").replace(/\%2F/g, "/").replace(/\%3A/g, ":").replace(/\%3B/g, ";").replace(/\%3D/g, "=").replace(/\%3F/g, "?").replace(/\%40/g, "@").replace(/\%5B/g, "[").replace(/\%5D/g, "]");
      
      //var tableId = btoa(this.tableid);
      //console.log(tableId);      
      this.UserService.UpdateNewPassword(this.userName,password,flag,this.tableid).subscribe(r => {
        if (r == "User Activated Successfully.") {
          var landingUrl = environment.templateURL + "sessions/login";
          window.location.href = landingUrl;
         }
        else if(r == "Failed."){
          
        }else{
          
          } 
      })
     } 
    }
    checkpasswordvalidation(){
      debugger;
      var commonPassword = Object.keys(this.passwordlist).map(e=>this.passwordlist[e]);
      var lenpass = commonPassword.length;
      for (var i=0; i < commonPassword.length; i++) {
      
          if (commonPassword[i] === this.setPasswordForm.value.password) {
             this.router.navigateByUrl("sessions/forgot-password");
             this.setPasswordForm.controls['password'].setValue("");
                this.toastr.warning(this.message.passwordpolicy, this.message.AssetrakSays);
                return false;
          } 
        }
    }



  }






