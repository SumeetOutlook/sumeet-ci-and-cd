import { Component,Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup,FormControl } from '@angular/forms';
import { SHA256 } from 'app/components/storage/SHA256';
import { LogOnService } from 'app/components/services/LogOnService';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RSAHelper } from 'app/components/services/RSAHelper';
import { HttpClient } from '@angular/common/http';
import * as header from '../../../../../assets/Headers.json';
import * as resource from '../../../../../assets/Resource.json';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-two-factor-authentication',
  templateUrl: './two-factor-authentication.component.html',
  styleUrls: ['./two-factor-authentication.component.scss']
})
export class TwoFactorAuthenticationComponent implements OnInit {

  Headers: any = (header as any).default;
  message: any = (resource as any).default;
  signupForm: FormGroup;
  HideLoginForm:boolean =false;
  timerOn:boolean = true;
  UserName:any;
  userId:any;
  resendCounter:any;
  macaddress: any;
  devicetype:any;
  browserName:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private fb: FormBuilder,
    public dialogRef: MatDialogRef<TwoFactorAuthenticationComponent>,
    public SHA256: SHA256,
    public LoginService: LogOnService,
    private router: Router,
    public toastr: ToastrService,
    private rsaHelper : RSAHelper,
    private http:HttpClient,
    private jwtAuth: JwtAuthService
  ) { }

  ngOnInit(): void {
    debugger;
    this.UserName =this.data.configdata.UserName;
    this.userId=this.data.configdata.UserId;
  this.resendCounter=this.data.configdata.ResendCounter;

    const otpHashValue = new FormControl('', Validators.required);
    this.signupForm = this.fb.group(
      {
       // email: ["", [Validators.required]],
       // otpHashValue:otpHashValue,
       otpHashValue1: [""],
       otpHashValue2:[ ""],
       otpHashValue3:[""],
       otpHashValue4:[""],
       otpHashValue5:[""],
       otpHashValue6:[""],
      }
    );
    this.startTimer();   
    this.getIP();
    var info = this.jwtAuth.getDeviceInfo();
    console.log(info);
    this.macaddress = info.deviceId;
    this.devicetype = info.deviceType;
    this.browserName = info.browser;
  }

  onclosetab(){
    this.dialogRef.close();

  }
  onSubmit(){
    debugger;
    
      const otparray = this.signupForm.value;
      var OtpHashValue : any;
      
      OtpHashValue = this.SHA256.convertToSHA256(this.otparray);
      var DeviceMFARegistrationDto={
        UserId:this.userId,
        UserName:this.UserName,
     //   otpHashValue:OtpHashValue,
        Status:"",
        IPAddress:  this.ipAddress ,
        LoginType:"web",
        Result:'',
        OtpHashValue: OtpHashValue,
        DeviceType:this.devicetype,
        Browser: this.browserName,
        MacAddress: this.macaddress,

      }
      this.LoginService.VerifyOtpDetails(DeviceMFARegistrationDto)
        .subscribe(response => {
          debugger;
          if(response.Result =="success"){

              this.dialogRef.close(response.Result);
              }
           else if(response.Result =="Failed"){
          //var msg1="Invalid OTP, Please try again!";
            // this.toastr.warning(msg1);
            this.toastr.warning(this.message.InvalidOTP, this.message.AssetrakSays);
             this.router.navigateByUrl("sessions/signin4");
           }
           else if(response.Result == "Expired"){
           // var msg1=" OTP Expired, Please try again! ";
            this.toastr.warning(this.message.OTPExpired, this.message.AssetrakSays);
            this.router.navigateByUrl("sessions/signin4");
           }

         })
     }
 
  ResendOTP(){
  debugger;
    //this.pauseTimer();
    this.startTimer();
   
    this.LoginService.GenerateOtpAndMailSend(this.userId,this.UserName)
    .subscribe(response => {
      debugger;
      if(response == "Success"){
       // var  msg="OTP Resend Successfully"
       this.toastr.success(this.message.ResendOTP, this.message.AssetrakSays);
      }
    }) 
   
  }
  timeLeft: number ;
  interval;
  startTimer() {
    debugger;
    this.timeLeft =this.resendCounter;
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = this.resendCounter;
      }
      if(this.timeLeft == 0){
       this.pauseTimer();
        }
    },1000)
  
  }
  pauseTimer() {
    clearInterval(this.interval);
  }
  ipAddress ='';
  public getIPAddress()
  {
    debugger;
    return this.http.get("https://api.ipify.org/?format=json"); //https://api.ipify.org/
  }
  getIP()
  {
    debugger;
    this.getIPAddress().subscribe((res:any)=>{
      this.ipAddress=res.ip;
    });
  }
  otparray:any[] =[];
  keytab(event,value){
    debugger;
    this.otparray =[];
    var nextInput = event.srcElement.nextElementSibling; // get the sibling element
   
    var target = event.target || event.srcElement;
    var id = target.id
    this.otparray += value.otpHashValue1 + value.otpHashValue2 + value.otpHashValue3 + value.otpHashValue4 + value.otpHashValue5 + value.otpHashValue6;
    console.log(id.maxlength); // prints undefined

    if(nextInput == null)  // check the maxLength from here
        return;
    else
        nextInput.focus();   // focus if not null
  
} 
otpController(event,next,prev,value){
  debugger;
  this.otparray =[];
    this.otparray += value.otpHashValue1 + value.otpHashValue2 + value.otpHashValue3 + value.otpHashValue4 + value.otpHashValue5 + value.otpHashValue6;
    var nextInput = event.srcElement.nextElementSibling;
    
      if(event.target.value.length < 1 && prev ){
        prev.focus()
      }
      else if(next && event.target.value.length>0){
        next.focus();
      }
      else {
       return 0;
      } 
   }
}
