import { Component, OnInit,Inject,ViewEncapsulation, Input, Output, EventEmitter, ViewChild  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import {
  MatSnackBarVerticalPosition,
  MatSnackBarHorizontalPosition,
  MatSnackBar,
  MatSnackBarConfig
} from "@angular/material/snack-bar";
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { LogOnService } from '../../../../components/services/LogOnService';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as resource from '../../../../../assets/Resource.json';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';

// interface City {
//   id: string;
//   name: string;
// }
// interface Plant {
//   id: string;
//   name: string;
// }
// interface AssetClass {
//   id: string;
//   name: string;
// }
// interface AssetType {
//   id: string;
//   name: string;
// }
// interface UOM {
//   id: string;
//   name: string;
// }

@Component({
  selector: 'app-forgotpassword-popup',
  templateUrl: './forgotpassword_popup.component.html',
  styleUrls: ['./forgotpassword_popup.component.scss'],
  animations: [
    trigger('fadeInOut', [
          state('in', style({ opacity: 100 })),
          transition('* => void', [
                animate(400, style({ opacity: 0 }))
          ])
    ])
]
})
export class ForgotPasswordPopUpComponent implements OnInit {

  //public uploader: FileUploader = new FileUploader({ url: 'https://evening-anchorage-315.herokuapp.com/api/' });

  actionButtonLabel = "Retry";
  action = false;
  setAutoHide = true;
  autoHide = 2000;
  verticalPosition: MatSnackBarVerticalPosition = "top";
  errorMsg = '';
  
  message: any = (resource as any).default;

  signupForm: FormGroup;

  constructor(private loader: AppLoaderService,public toastr: ToastrService, @Inject(MAT_DIALOG_DATA,) public data: any,
  public dialogRef: MatDialogRef<ForgotPasswordPopUpComponent>,
  private fb: FormBuilder,public dialog: MatDialog,private jwtAuth: JwtAuthService,private LogOnService: LogOnService,
  public snackBar: MatSnackBar, private router: Router) { }
  userEmail;
  @ViewChild(MatProgressBar) progressBar: MatProgressBar;
  @ViewChild(MatButton) submitButton: MatButton;

  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  
  ngOnInit() {

    this.signupForm = this.fb.group(
      {
        email: ["",[Validators.required,Validators.email,Validators.pattern]],
      }
    );
  }

  submitEmail() {
    this.loader.open();

    // this.submitButton.disabled = true;
    //this.progressBar.mode = 'indeterminate';
debugger;
    const signinData = this.signupForm.value;
    const UserName =  signinData.email; 
    if(!!UserName){
      this.toastr.info(this.message.EmailValidation);
    }
    this.LogOnService.ForgotPassword(UserName)
      .subscribe(Response => {
        debugger;

        if(Response == "Success"){
         
          this.router.navigateByUrl("sessions/signin4");

        //  this.toastr.success(this.message.EmailUserActivationLinkSucess);
  
            this.dialogRef.close();
        }

        else{
          
         // this.toastr.warning(this.message.Invalidemailaddress);
      }

      this.loader.close();

      }, err => {
        this.errorMsg = err.message;
        // console.log(err);
      })
  }

  onclosetab(){
    this.dialogRef.close();

  }
  

}

