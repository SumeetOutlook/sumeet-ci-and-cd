import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';

import { sha256 } from 'js-sha256';
import { SignUpService } from '../signin2/session.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { SnotifyToast, SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-signin2',
  templateUrl: './signin2.component.html',
  styleUrls: ['./signin2.component.scss']
})
export class Signin2Component implements OnInit {

  signupForm: FormGroup;

  constructor(private fb: FormBuilder , 
             private service:SignUpService ,
             private storage:ManagerService,
             private router: Router,
             private notifyService:SnotifyService) {}

  ngOnInit() {

    const password = new FormControl('', Validators.required);
    const confirmPassword = new FormControl('', CustomValidators.equalTo(password));

    this.signupForm = this.fb.group(
      {
        email: ["",[Validators.required,Validators.email]],
        password: password,
        agreed: [false,Validators.required]
      }
    );
  }

  onSubmit() {
    debugger;
    // if (!this.signupForm.invalid) {
    //   this.router.navigateByUrl('/others/blank');
    // }else{
     
    // }
    this.service.signInGetVersion().subscribe(r=>{
      debugger;
    })
    
  //   if (!this.signupForm.invalid) {
  //     debugger;
  //     var hash2 = sha256.update(this.signupForm.get('password').value);
  //     hash2.update(this.signupForm.get('password').value);
  //     var hashedHash= hash2.hex();
  //     console.log('hash2',hashedHash)
  //     this.signupForm.get('password').setValue(hashedHash)
  //     // do what you wnat with your data
  //     this.service.signIn(this.signupForm.value).subscribe(responseData=>{
  //      console.log("response",responseData.message)
  //      debugger;
  //      if(responseData.status)
  //       {
  //         // this.isLogginedin=true
  //         this.storage.set(Constants.SESSSION_STORAGE,Constants.AUTH_TOKEN,responseData.token)
  //         this.storage.set(Constants.SESSSION_STORAGE,Constants.USER_UUID,responseData.users[0].id)
  //         this.storage.set(Constants.SESSSION_STORAGE,Constants.USER_NAME,responseData.users[0].user_name)
  //         this.storage.set(Constants.SESSSION_STORAGE,Constants.USER_TYPE,responseData.users[0].user_type)
  //         this.storage.set(Constants.SESSSION_STORAGE,Constants.Authenticated,true)
  //         this.router.navigateByUrl('/others/blank');
  //         // this.userDetails(responseData.token)
  //       }
  //       else
  //       {
  //         if(responseData.message === 'Password Incorrect')
  //         {
  //          this.notifyService.warning('Password Incorrect')
  //         }
  //         else if(responseData.message === 'Your Account is not active') 
  //         {
  //           this.notifyService.warning('Your Account is not active')
  //         }
  //         else
  //         {
  //           this.notifyService.warning(responseData.message)
  //         }
  //       }
  //     })
  //     console.log(this.signupForm.value);
  //   }
   }
}
