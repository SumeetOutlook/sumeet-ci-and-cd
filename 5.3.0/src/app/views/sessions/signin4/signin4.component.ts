import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ForgotPasswordPopUpComponent } from './forgotpassword_dialog/forgotpassword_popup.component';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { SHA256 } from 'app/components/storage/SHA256';
import { LogOnService } from 'app/components/services/LogOnService';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { environment } from '../../../../environments/environment';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { RSAHelper } from 'app/components/services/RSAHelper';
import { HttpClient } from '@angular/common/http';
import { OAuthService } from "angular-oauth2-oidc";
import { JwksValidationHandler } from "angular-oauth2-oidc-jwks";
import { authConfig } from "../../../sso.config";
import { GroupService } from 'app/components/services/GroupService';
import { TwoFactorAuthenticationComponent } from '../dialog/two-factor-authentication/two-factor-authentication.component';
import { ToastrService } from 'ngx-toastr';
import * as header from '../../../../assets/Headers.json';
import * as resource from '../../../../assets/Resource.json';
import { ReconciliationService } from 'app/components/services/ReconciliationService';
import { AllPathService } from 'app/components/services/AllPathServices';
import {
  MatSnackBarVerticalPosition,
  MatSnackBarHorizontalPosition,
  MatSnackBar,
  MatSnackBarConfig
} from "@angular/material/snack-bar";
import { json } from 'ngx-custom-validators/src/app/json/validator';


@Component({
  selector: 'app-signin4',
  templateUrl: './signin4.component.html',
  styleUrls: ['./signin4.component.scss'],
  animations: egretAnimations
})
export class Signin4Component implements OnInit {

  Headers: any = (header as any).default;
  message: any = (resource as any).default;
  signupForm: FormGroup;
  errorMsg = '';
  actionButtonLabel = "Retry";
  action = false;
  setAutoHide = true;
  autoHide = 2000;
  verticalPosition: MatSnackBarVerticalPosition = "top";
  stringifiedData: any;
  HideLoginForm : boolean = false;
  isanygroup :boolean = false;
  macaddress: any;
  devicetype:any;
  browserName:any;
  clicked = false;

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private jwtAuth: JwtAuthService,
    public snackBar: MatSnackBar,
    private router: Router,
    private storage: ManagerService,
    public LoginService: LogOnService,
    public SHA256: SHA256,
    public toastr: ToastrService,
    private loader: AppLoaderService,
    private rsaHelper : RSAHelper ,
    private httpClient: HttpClient,
    private oauthService: OAuthService,
    public groupservice: GroupService,
    public rs: ReconciliationService,
    public AllPath : AllPathService,
    private http: HttpClient) { }
    
    showimage :boolean =false;
    image :any;
    Imagepath:any;
    Imagepath1:any;
  ngOnInit() {  
      
    debugger;
    var token = this.jwtAuth.token || this.jwtAuth.getJwtToken();
    var configId=67;
    this.Imagepath1="assets/images/assetrak/AssetCuesLogo3.png";
    this.groupservice.GetLogoByConfigurationId(configId).subscribe(r => {

      if (!!r && r!="false") {
        debugger;
        
        this.showimage = true;
        // var documentList ;
        // documentList = JSON.parse(r);
        // console.log("Doc", documentList)
       
        
           var path = r.split('uploads');
          // var path1 = path[1].split('Transfer\\');
         // var path2 = "assets/images/assetrak/";
          //  this.image = path1[1];
          //  console.log("Imagepath",  this.image)

           var image = path[1].split('Co-BrandingLogo\\');

           this.Imagepath=environment.apiURL+ 'uploads/Co-BrandingLogo/' +image[1];
        
           console.log("Imagepath",  this.image)
           }
      else
      {
        this.showimage = false;
        this.Imagepath1="assets/images/assetrak/AssetCuesLogo3.png";
      }

       
    })
    if(!!token){
      this.router.navigateByUrl("h/a");
    }
    else{
      this.GetSSODetails();
      this.checkgroupExist();    
      
      var info = this.jwtAuth.getDeviceInfo();
      console.log(info);
      this.macaddress = info.deviceId;
      this.devicetype = info.deviceType;
      this.browserName = info.browser;
    }   
    
  }

  //PING - 1 , ADFS-LOCAL - 2 , OKTA - 3 , ONE LOGIN - 4 , AZURE AD - 5 , PingFed - 6
  res1 : any ;
  private async GetSSODetails() {
    
    this.loader.open();
    var apiUrl = environment.apiURL + 'GroupService.svc/GetSSODetails';
    var data  = await this.httpClient.get(apiUrl).toPromise();
    
    this.loader.close();
    if (!!data) {
      this.res1 = new String(data);
      var result = JSON.parse(this.res1);
      
      if (!!result.IsSSO) {
        environment.IsSSO = result.IsSSO;
        environment.SSOType = result.SSOType;
        environment.SSOName = result.SSOName;
        environment.Issuer = result.Issuer;
        environment.ClientId = result.ClientId;
        authConfig.issuer = result.Issuer;
        authConfig.clientId = result.ClientId;
        if (!!environment.IsSSO && (environment.SSOType == '1' || environment.SSOType == '3' || environment.SSOType == '4' || environment.SSOType == '5')) {
          
          this.configureSingleSignOn(); 
          this.GetInitiatedData();
        }
        else{
          this.GetInitiatedData();
        }        
      }
      else{
        this.GetInitiatedData();
      }
    }
    else{
      this.GetInitiatedData();
    }    
  };
  
  GetInitiatedData(){
    this.getIP();
    if (!environment.IsSSO || (!!environment.IsSSO && environment.SSOType == '2')) {
      this.HideLoginForm = true;
      if (this.jwtAuth.isLoggedIn()){ this.jwtAuth.clearData() }
      const password = new FormControl('', Validators.required);
      const confirmPassword = new FormControl('', CustomValidators.equalTo(password));
      this.signupForm = this.fb.group(
        {
          email: ["", [Validators.required]],
          password: password,
          agreed: [false, Validators.required]
        }
      );
      this.storage.clearDB();
      this.loader.open();
      this.jwtAuth.GetHeaderFileData();
      this.jwtAuth.GetResourceFileData();
      this.loader.close();
      this.GetVersion();
    }
    if (!!environment.IsSSO && environment.SSOType == '6') {
      this.loader.open();
      this.jwtAuth.GetHeaderFileData();
      this.jwtAuth.GetResourceFileData();
      this.loader.close();
      this.router.navigateByUrl("sessions/ssologin");
    }
    else if (!!environment.IsSSO && (environment.SSOType == '1' || environment.SSOType == '3' || environment.SSOType == '4' || environment.SSOType == '5')) {
          
      this.loader.open();
      this.jwtAuth.GetHeaderFileData(); 
      this.jwtAuth.GetResourceFileData();
      this.loader.close(); 
      this.router.navigateByUrl("sessions/oauth");
    }
  }  

  configureSingleSignOn() {
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    //this.oauthService.loadDiscoveryDocumentAndTryLogin();
    this.oauthService.loadDiscoveryDocumentAndLogin();
  }

  displayError:boolean = false;
  onSubmit() {
        
    if (!this.signupForm.invalid) {
      this.loader.open();
      const signinData = this.signupForm.value;

      var password : any;
      if (!!environment.IsSSO && environment.SSOType == '2') {
        password = this.rsaHelper.encryptWithPublicKey(signinData.password);
      }
      else{
        password = this.SHA256.convertToSHA256(signinData.password);
      }  
      const moonLanding = new Date().getTime();
      const Authdata = signinData.email + ":" + password + ":" + moonLanding;
      
      var encodeauthdata = btoa(Authdata);
      this.displayError = false;
      //var decodeauth  = atob(authdata);
      this.LoginService.customerLogin(signinData.email, password, encodeauthdata)
        .subscribe(response => {
           
          this.loader.close();
          if (response == null) {
            this.displayError = true;
            this.router.navigateByUrl("sessions/login");
          }
          else {
             
            if(response.IsAuthenticationEnabled ==true){
              var DeviceDetail ={
                UserId :response.UserId,
                UserName:response.UserName,
                IPAddress:  this.ipAddress ,
                LoginType:"web",
                DeviceType:this.devicetype,
                Browser: this.browserName,
                MacAddress: this.macaddress,
    
              }
              this.LoginService.GetDeviceDetails(DeviceDetail)
              .subscribe(Response => {
                 
                      if(Response =="NotExist"){
                           this.LoginService.GenerateOtpAndMailSend(response.UserId,response.UserName)
                            .subscribe(response1 => {
                                  if(response1 == "Success"){
                                  this.toastr.success(this.message.OTPSendsuccess, this.message.AssetrakSays);
                                   }
                             })
          
              
              let configdata ={
                UserName:response.UserName,
                UserId:response.UserId,
                ResendCounter:response.ResendCounter
              }
              const dialogRef = this.dialog.open(TwoFactorAuthenticationComponent, {
              panelClass: 'group-form-dialog',
              width: "55%",
              height:"50%",
              disableClose: true,
            data: { title: '', configdata: configdata},
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result =="success" ) {
             //   this.toastr.success(this.message.VerifiedOTP, this.message.AssetrakSays);
        
              console.log(response);
               
              this.jwtAuth.setUserAndToken(response.SessionId, response.ProfileId, true);
              this.storage.set(Constants.SESSSION_STORAGE, Constants.USER_PROFILE, response.ProfileId)
              this.storage.set(Constants.SESSSION_STORAGE, Constants.USER_ID, response.UserId)
              this.storage.set(Constants.SESSSION_STORAGE, Constants.USER_NAME, response.UserName)
              const Name = response.FirstName + ' ' + response.LastName;
              this.storage.set(Constants.SESSSION_STORAGE, Constants.Name, Name)
              this.storage.set(Constants.SESSSION_STORAGE, Constants.Authenticated, true)
              this.storage.set(Constants.SESSSION_STORAGE, Constants.CLIENT_NAME, response.ClientName)
              this.storage.set(Constants.SESSSION_STORAGE, Constants.LAYER_ID, response.LayerId)
  
              if (response.ProfileId == 1) {
                if(this.isanygroup)
                {
                  this.router.navigateByUrl("sessions/selectGRC");
                }
                else
                {
                this.router.navigateByUrl("h/a");
                }
              }
              else {
                // this.snackBar.open("Logged in Successfully", 'OK', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'end' , panelClass: ['red-snackbar'] })
                this.getSelectionByUserId(response);
              }
            }
            else if(!result ){
              this.router.navigateByUrl("sessions/signin4");
            }
            })
              }
 
         else if(Response =="AlreadyExists"){
            console.log(response);
            this.jwtAuth.setUserAndToken(response.SessionId, response.ProfileId, true);
            this.storage.set(Constants.SESSSION_STORAGE, Constants.USER_PROFILE, response.ProfileId)
            this.storage.set(Constants.SESSSION_STORAGE, Constants.USER_ID, response.UserId)
            this.storage.set(Constants.SESSSION_STORAGE, Constants.USER_NAME, response.UserName)
            const Name = response.FirstName + ' ' + response.LastName;
            this.storage.set(Constants.SESSSION_STORAGE, Constants.Name, Name)
            this.storage.set(Constants.SESSSION_STORAGE, Constants.Authenticated, true)
            this.storage.set(Constants.SESSSION_STORAGE, Constants.CLIENT_NAME, response.ClientName)
            this.storage.set(Constants.SESSSION_STORAGE, Constants.LAYER_ID, response.LayerId)

            if (response.ProfileId == 1) {
              if(this.isanygroup)
              {
                this.router.navigateByUrl("sessions/selectGRC");
              }
              else
              {
              this.router.navigateByUrl("h/a");
              }
            }
            else {
              // this.snackBar.open("Logged in Successfully", 'OK', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'end' , panelClass: ['red-snackbar'] })
              this.getSelectionByUserId(response);
            }
                         }
                    })
                  }
                  else{
                    this.jwtAuth.setUserAndToken(response.SessionId, response.ProfileId, true);
                    this.storage.set(Constants.SESSSION_STORAGE, Constants.USER_PROFILE, response.ProfileId)
                    this.storage.set(Constants.SESSSION_STORAGE, Constants.USER_ID, response.UserId)
                    this.storage.set(Constants.SESSSION_STORAGE, Constants.USER_NAME, response.UserName)
                    const Name = response.FirstName + ' ' + response.LastName;
                    this.storage.set(Constants.SESSSION_STORAGE, Constants.Name, Name)
                    this.storage.set(Constants.SESSSION_STORAGE, Constants.Authenticated, true)
                    this.storage.set(Constants.SESSSION_STORAGE, Constants.CLIENT_NAME, response.ClientName)
                    this.storage.set(Constants.SESSSION_STORAGE, Constants.LAYER_ID, response.LayerId)
                    this.storage.set(Constants.SESSSION_STORAGE, Constants.Device_ID, this.macaddress)
                    this.storage.set(Constants.SESSSION_STORAGE, Constants.Device_Type, this.devicetype)
                    this.storage.set(Constants.SESSSION_STORAGE, Constants.Browser_Name, this.browserName)
        
                    if (response.ProfileId == 1) {
                      if(this.isanygroup)
                      {
                        this.router.navigateByUrl("sessions/selectGRC");
                      }
                      else
                      {
                      this.router.navigateByUrl("h/a");
                      }
                    }
                    else {
                      // this.snackBar.open("Logged in Successfully", 'OK', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'end' , panelClass: ['red-snackbar'] })
                      this.getSelectionByUserId(response);
                    }
                  }
                }
      //  }
      
    
    }, err => {
          this.errorMsg = err.message;
          this.loader.close();
        })
      
    }
  }
  userid:any;
  groupId:any;
  regionId:any;
  companyId:any;
  LevelNameValue :any;
  getSelectionByUserId(response) {
    this.LoginService.GetFavouriteSeletionByUserId(response.UserId).subscribe(r => {
      
      if (r != "null" && r != null) {
        const Data = JSON.parse(r);
        this.userid = Data.UserId ;
        if (Data.LevelId == 1) {
          this.storage.set(Constants.SESSSION_STORAGE, Constants.GROUP_ID, Data.LevelValue);
          this.storage.set(Constants.SESSSION_STORAGE, Constants.REGION_ID, 0);
          this.storage.set(Constants.SESSSION_STORAGE, Constants.COMPANY_ID, 0);
          this.storage.set(Constants.SESSSION_STORAGE, Constants.LevelNameValue, Data.Custome3);
          this.groupId = Data.LevelValue ;
          this.regionId = 0 ;
          this.companyId = 0 ;
        }
        else if (Data.LevelId == 2) {
          this.storage.set(Constants.SESSSION_STORAGE, Constants.GROUP_ID, Data.Custome1);
          this.storage.set(Constants.SESSSION_STORAGE, Constants.REGION_ID, Data.LevelValue);
          this.storage.set(Constants.SESSSION_STORAGE, Constants.COMPANY_ID, 0);
          this.storage.set(Constants.SESSSION_STORAGE, Constants.LevelNameValue, Data.Custome3);
          this.groupId = Data.Custome1 ;
          this.regionId = Data.LevelValue ;
          this.companyId = 0 ;
        }
        else if (Data.LevelId == 3) {
          this.storage.set(Constants.SESSSION_STORAGE, Constants.GROUP_ID, Data.Custome1);
          this.storage.set(Constants.SESSSION_STORAGE, Constants.REGION_ID, Data.Custome2);
          this.storage.set(Constants.SESSSION_STORAGE, Constants.COMPANY_ID, Data.LevelValue);
          this.storage.set(Constants.SESSSION_STORAGE, Constants.LevelNameValue, Data.Custome3);
          this.groupId = Data.Custome1 ;
          this.regionId = Data.Custome2 ;
          this.companyId = Data.LevelValue ;
        }
        let url1 = this.LoginService.GetConfigurationDetails(this.groupId);
        let url2 = this.LoginService.PagePermissionForMenuDisplay(this.groupId, this.userid, this.companyId, this.regionId)
        forkJoin([url1, url2]).subscribe(results => {

          if (!!results) {
            localStorage.setItem("Configuration", results[0]);
            localStorage.setItem("MenuPage", results[1]);
            localStorage.setItem('PageSession', null);
            this.router.navigateByUrl("h/a");
          }
        })
      }
      else {
        this.router.navigateByUrl("sessions/selectGRC");
      }
    });
  }

  openForgotPassword_Dialog(...getValue): void {

    const dialogconfigcom1 = new MatDialogConfig();
    dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = "25%";
    dialogconfigcom1.data = { value: getValue[0], payload: getValue[1] };    
    // this.localService.setItem('settype',type);
    const modalService = this.dialog.open(ForgotPasswordPopUpComponent, dialogconfigcom1);
  }
  versionlabel: any;
  GetVersion(){ 
    this.LoginService.GetVersion().subscribe (r =>{      
      this.versionlabel = r;
    } 
    )
  }
  checkgroupExist(){
    this.groupservice.checkGroupMasterTableData().subscribe (r =>{
      this.isanygroup = r;
     })
  }
  ipAddress = '';
  
  responseData : any;
  private async getIP()
  {   
    //https://api.ipify.org/?format=json
    //this.responseData  = await this.httpClient.get("https://api.db-ip.com/v2/free/self").toPromise();
    this.httpClient.get("https://api.db-ip.com/v2/free/self",{ headers: null }).subscribe((res:any)=>{
      this.responseData = res;
       
      this.ipAddress= !!this.responseData ? this.responseData.ipAddress : "0";
      this.storage.set(Constants.SESSSION_STORAGE, Constants.IP_Address, this.ipAddress);
    });
  }
}
