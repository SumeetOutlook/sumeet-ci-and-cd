import { Component, OnInit } from '@angular/core';
import { OAuthService } from "angular-oauth2-oidc";
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { LogOnService } from 'app/components/services/LogOnService';
import { ActivatedRoute, Router } from '@angular/router';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { environment } from '../../../../environments/environment';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';

@Component({
  selector: 'app-sso-oauth',
  templateUrl: './sso-oauth.component.html',
  styleUrls: ['./sso-oauth.component.scss']
})
export class SsoOauthComponent implements OnInit {

  constructor(private oauthService: OAuthService,
    private jwtAuth: JwtAuthService,
    private router: Router,
    private storage: ManagerService,
    public LoginService: LogOnService,
    private loader: AppLoaderService,) { }

  HideDiv : any;  
  ngOnInit(): void {
    let claims: any = this.oauthService.getIdentityClaims();
      debugger;
      if (claims == null) {
        this.oauthService.initImplicitFlow();   
      }
      else {
        alert(claims.email);
        this.userlogin('Shreyas.d@assetcues.com');
      }
  }

  login() {
    this.oauthService.initImplicitFlow();
  }
  logout() {
    this.oauthService.logOut();
  }
  get token() {
    let claims: any = this.oauthService.getIdentityClaims();
    console.log("claims", claims);
    return claims ? claims : null;
  }


  userlogin(username) {
    debugger;
    this.loader.open();
    this.LoginService.GetUserDetailsByUserName(username)
      .subscribe(response => {
        debugger;
        this.loader.close();
        if (response == null) {
          //this.router.navigateByUrl("sessions/login");
        }
        else {
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
            //this.router.navigateByUrl("h/a");
          }
          else {
            // this.snackBar.open("Logged in Successfully", 'OK', { duration: 3000, verticalPosition: 'top', horizontalPosition: 'end' , panelClass: ['red-snackbar'] })
            this.getSelectionByUserId(response);
          }
        }
      }, err => {
        this.loader.close();
      })

  }

  userid: any;
  groupId: any;
  regionId: any;
  companyId: any;
  LevelNameValue: any;
  getSelectionByUserId(response) {
    debugger;
    this.loader.open();
    this.LoginService.GetFavouriteSeletionByUserId(response.UserId).subscribe(r => {
      debugger;
      this.loader.close();
      if (r != "null" && r != null) {
        const Data = JSON.parse(r);
        this.userid = Data.UserId;
        if (Data.LevelId == 1) {
          this.storage.set(Constants.SESSSION_STORAGE, Constants.GROUP_ID, Data.LevelValue);
          this.storage.set(Constants.SESSSION_STORAGE, Constants.REGION_ID, 0);
          this.storage.set(Constants.SESSSION_STORAGE, Constants.COMPANY_ID, 0);
          this.storage.set(Constants.SESSSION_STORAGE, Constants.LevelNameValue, Data.Custome3);
          this.groupId = Data.LevelValue;
          this.regionId = 0;
          this.companyId = 0;
        }
        else if (Data.LevelId == 2) {
          this.storage.set(Constants.SESSSION_STORAGE, Constants.GROUP_ID, Data.Custome1);
          this.storage.set(Constants.SESSSION_STORAGE, Constants.REGION_ID, Data.LevelValue);
          this.storage.set(Constants.SESSSION_STORAGE, Constants.COMPANY_ID, 0);
          this.storage.set(Constants.SESSSION_STORAGE, Constants.LevelNameValue, Data.Custome3);
          this.groupId = Data.Custome1;
          this.regionId = Data.LevelValue;
          this.companyId = 0;
        }
        else if (Data.LevelId == 3) {
          this.storage.set(Constants.SESSSION_STORAGE, Constants.GROUP_ID, Data.Custome1);
          this.storage.set(Constants.SESSSION_STORAGE, Constants.REGION_ID, Data.Custome2);
          this.storage.set(Constants.SESSSION_STORAGE, Constants.COMPANY_ID, Data.LevelValue);
          this.storage.set(Constants.SESSSION_STORAGE, Constants.LevelNameValue, Data.Custome3);
          this.groupId = Data.Custome1;
          this.regionId = Data.Custome2;
          this.companyId = Data.LevelValue;
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

}
