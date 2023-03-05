import { Injectable } from "@angular/core";
import { LocalStoreService } from "../local-store.service";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { map, catchError, delay } from "rxjs/operators";
import { User } from "../../models/user.model";
import { of, BehaviorSubject, throwError } from "rxjs";
import { APIConstants } from "app/apiEndpoints/apiFile";
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { Constants } from 'app/components/storage/constants';
import { environment } from '../../../../environments/environment';
import { OAuthService } from "angular-oauth2-oidc";
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';


// ================= only for demo purpose ===========
const DEMO_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YjhkNDc4MDc4NmM3MjE3MjBkYzU1NzMiLCJlbWFpbCI6InJhZmkuYm9ncmFAZ21haWwuY29tIiwicm9sZSI6IlNBIiwiYWN0aXZlIjp0cnVlLCJpYXQiOjE1ODc3MTc2NTgsImV4cCI6MTU4ODMyMjQ1OH0.dXw0ySun5ex98dOzTEk0lkmXJvxg3Qgz4ed";

const DEMO_USER: User = {
  id: "5b700c45639d2c0c54b354ba",
  displayName: "Watson Joyce",
  role: "SA",
};
// ================= you will get those data from server =======

@Injectable({
  providedIn: "root",
})
export class JwtAuthService {
  token;
  isAuthenticated: Boolean;
  user: User;
  //user$ = (new BehaviorSubject<User>(this.user));
  signingIn: Boolean;
  return: string;
  JWT_TOKEN = "JWT_TOKEN";
  APP_USER = "EGRET_USER";


  constructor(
    private ls: LocalStoreService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private storage: ManagerService,
    private oauthService: OAuthService,
    private deviceDetectorService: DeviceDetectorService
  ) {
    this.route.queryParams
      .subscribe(params => this.return = params['return'] || '/');
  }

  public signin(username, password) {
    return of({ token: DEMO_TOKEN, user: DEMO_USER })
      .pipe(
        delay(1000),
        map((res: any) => {
          this.setUserAndToken(res.token, res.user, !!res);
          this.signingIn = false;
          return res;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );

    // FOLLOWING CODE SENDS SIGNIN REQUEST TO SERVER
    // this.signingIn = true;
    // return this.http.post(`${environment.apiURL}/auth/local`, { username, password })
    //   .pipe(
    //     map((res: any) => {
    //       this.setUserAndToken(res.token, res.user, !!res);
    //       this.signingIn = false;
    //       return res;
    //     }),
    //     catchError((error) => {
    //       return throwError(error);
    //     })
    //   );
  }

  /*
    checkTokenIsValid is called inside constructor of
    shared/components/layouts/admin-layout/admin-layout.component.ts
  */
  public checkTokenIsValid() {
    return of(DEMO_USER)
      .pipe(
        map((profile: User) => {
          this.setUserAndToken(this.getJwtToken(), profile, true);
          this.signingIn = false;
          return profile;
        }),
        catchError((error) => {
          return of(error);
        })
      );
    /*
      The following code get user data and jwt token is assigned to
      Request header using token.interceptor
      This checks if the existing token is valid when app is reloaded
    */
    // return this.http.get(`${environment.apiURL}/api/users/profile`)
    //   .pipe(
    //     map((profile: User) => {
    //       this.setUserAndToken(this.getJwtToken(), profile, true);
    //       return profile;
    //     }),
    //     catchError((error) => {
    //       this.signout();
    //       return of(error);
    //     })
    //   );
  }

  public clearData() {
    this.storage.clearDB();
    this.setUserAndToken(null, null, false);
  }

  public signout() {
        
    if(!!environment.IsSSO && environment.SSOType == '6') {
      this.storage.clearDB();
      this.setUserAndToken(null, null, false);
      this.router.navigateByUrl("sessions/ssologin?e=d");
    }
    else if(!!environment.IsSSO && (environment.SSOType == '1' || environment.SSOType == '3' || environment.SSOType == '4' || environment.SSOType == '5')) {
      this.oauthService.logOut();    
    }
    else {
      if(!!environment.IsSSO && environment.SSOType == '2'){
        this.GetSSODetails();
      }
      this.storage.clearDB();
      this.setUserAndToken(null, null, false);      
      this.router.navigateByUrl("sessions/login");
    }
  }

  GetSSODetails() {
    
    var apiUrl = environment.apiURL + 'GroupService.svc/GetSSODetails';
    const promise = this.http.get(apiUrl).toPromise();
    promise.then((data: any) => {
      
      if (!!data) {
        var result = JSON.parse(data);        
        if (!!result.IsSSO) {
          environment.IsSSO = result.IsSSO;
          environment.SSOType = result.SSOType;
          environment.SSOName = result.SSOName;
          environment.Issuer = result.Issuer;
          environment.ClientId = result.ClientId;
        }
      }
    }).catch((error) => {
      console.log("Promise rejected with " + JSON.stringify(error));
    });
  };

  isLoggedIn(): Boolean {
    return !!this.getJwtToken();
  }

  getJwtToken() {
    return this.ls.getItem(this.JWT_TOKEN);
  }
  getUser() {
    return this.ls.getItem(this.APP_USER);
  }
  getMenuItem() {
    return this.ls.getItem("MenuPage");
  }
  getProfile() {
    return this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_PROFILE);
  }

  setUserAndToken(token: String, user: any, isAuthenticated: Boolean) {
    this.isAuthenticated = isAuthenticated;
    this.token = token;
    this.user = user;
    //this.user$.next(user);
    this.ls.setItem(this.JWT_TOKEN, token);
    this.ls.setItem(this.APP_USER, user);
  }
  getHeaders() {
    return this.ls.getItem('Headers');
  }
  getResources() {
    return this.ls.getItem('Resource');
  }  

  public async GetHeaderFileData() {   
    
    var apiUrl = environment.apiURL + 'GroupService.svc/GetHeaderFileData';
    var data:any  = await this.http.get(apiUrl).toPromise();
    this.ls.setItem('Headers', JSON.parse(data));    
  };

  public async GetResourceFileData() {   
    
    var apiUrl = environment.apiURL + 'GroupService.svc/GetResourceFileData';
    var data:any  = await this.http.get(apiUrl).toPromise();
    this.ls.setItem('Resource', JSON.parse(data));    
  };

  getSessionTimeOut() {
    var timeOut = this.storage.get(Constants.SESSSION_STORAGE, Constants.SESSION_TIME_OUT)
    return !!timeOut ? timeOut : '1800';
    // let params = new HttpParams();
    // params = params.append('UserId', '34');
    // return this.http.get<any>(APIConstants.GetGroupRegionAndCompany ,{params : params})
    //   .pipe(map(data => {   
    //          
    //     if (!data) {
    //       return "1800";
    //     }
    //     if (data != null) {
    //       return data;
    //     }        
    //   }),
    //     catchError(this.handleError)
    //   );
  }
  
getDeviceInfo(){
    var navigator_info = window.navigator;
    var screen_info = window.screen;
    var uid = navigator_info.mimeTypes.length;    
    uid += parseInt(navigator_info.userAgent.replace(/\D+/g,''))  || 0;
    uid += navigator_info.plugins.length;
    uid += screen_info.height || 0;
    uid += screen_info.width || 0;
    uid += screen_info.pixelDepth || 0;
    var deviceInfo = this.deviceDetectorService.getDeviceInfo();
    var deviceData = {
      deviceId : uid,
      browser : deviceInfo.browser,
      deviceType: deviceInfo.deviceType
    }
    
    return deviceData;
  }

  public customerLogin(UserName, Password, Authdata) {
    return this.http.post<any>(APIConstants.LOGIN, { Authdata, UserName, Password })
      .pipe(map(data => {
        // 
        if (!data) {
          return null;
        }
        //this.setUserAndToken(data.token, data.user, !!data);

        if (data != null) {
          return data;
        }
        sessionStorage.setItem("isLoggedin", "true");
      }),
        catchError(this.handleError)
      );
  }

  public UpdateAssetCategoryData(assetsDetails) {
    let body = JSON.stringify(assetsDetails);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.post<any>(APIConstants.UpdateAssetCateotyData, body, { headers })
      .pipe(map(data => {
        // 
        if (!data) {
          return null;
        }

        if (data != null) {
          return data;
        }
      }),
        catchError(this.handleError)
      );
  } // isli service ni mili  

  public GetCategoryListByConfiguration(groupId, userid, companyId, regionId, pageid) {
    let params = new HttpParams();
    params = params.append('groupId', groupId);
    params = params.append('userid', userid);
    params = params.append('companyId', companyId);
    params = params.append('regionId', regionId);
    params = params.append('pageid', pageid);

    return this.http.get<any>(APIConstants.GetCategoryListByConfiguration, { params: params })
      .pipe(map(data => {
        // 
        if (!data) {
          return null;
        }

        if (data != null) {
          return data;
        }

      }),
        catchError(this.handleError)
      );
  }

  GetTypeOfAssetList(CompanyId) {
    let params = new HttpParams();
    params = params.append('companyId', CompanyId);
    return this.http.get<any>(APIConstants.GetTypeOfAssetList, { params: params })
      .pipe(map(data => {
        // 
        if (!data) {
          return null;
        }

        if (data != null) {
          return data;
        }

      }),
        catchError(this.handleError)
      );
  } //already hai

  Getapprovetagginggrid(assetDetails) {

    let body = JSON.stringify(assetDetails);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.post<any>(APIConstants.GetAssetListForTagging, body, { headers })
      .pipe(map(data => {
        // 
        if (!data) {
          return null;
        }

        if (data != null) {
          return data;
        }
      }),
        catchError(this.handleError)
      );
  } // iski service ni mili
  EmailExistInEmpMasterDetail(EmailId, CompanyId) {
    let params = new HttpParams();
    params = params.append('userEmail', EmailId);
    params = params.append('companyId', CompanyId);
    return this.http.get<any>(APIConstants.EmailExistInEmpMasterDetail, { params: params })
      .pipe(map(data => {
        if (!data) {
          return null;
        }

        if (data != null) {
          return data;
        }
      }),
        catchError(this.handleError)
      );
  }

  UpdateModifiedAssetdata(updateDetails) {
    let body = JSON.stringify(updateDetails);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.post<any>(APIConstants.UpdateModifiedAssetdata, body, { headers })
      .pipe(map(data => {
        if (!data) {
          return null;
        }

        if (data != null) {
          return data;
        }

      }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  };


  GroupId: any;
  RegionId: any;
  CompanyId: any;
  UserName:any;
  UserId: any;
  ClientName:any;
  public GotoNotification() {
    
    
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    this.UserName = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_NAME);
    this.ClientName = this.storage.get(Constants.SESSSION_STORAGE, Constants.CLIENT_NAME);
   

    //this.ClientName = this.GetClientName();
    if(!!this.ClientName)
    {
        //var data = "T=abc&u=2&id=1"  
    //var data = "T="+this.GroupId+"&u="+this.UserId+"&id="+this.UserId;
    var data = "cid=" +this.CompanyId+ "&rid=" + this.RegionId + "&gid=" + this.GroupId + "&uid=" + this.UserId + "&uname=" + this.UserName + "&clientId=" + this.ClientName + "&cli=" + "pra";
    var param = this.encode(data);
    window.open(environment.Notificationapiurl + 'sessions/login?e=' + param, '_blank');
    }
    else{
      return "Your are not authorized";
    }
    
  }

  GetClientName() {
    return this.http.get<any>(APIConstants.GetClientName)
      .pipe(map(data => {
        // 
        if (!data) {
          return null;
        }

        if (data != null) {
          return data;
        }
      }),
        catchError(this.handleError)
      );
  }

  _keyStr: any = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  encode(input) {
    
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = this.utf8_encode(input);

    while (i < input.length) {

      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

    }
    
    return output;
  }

  decode(input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {

      enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }

    }

    output = this.utf8_decode(output);

    return output;

  }

  utf8_encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      }
      else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      }
      else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }

    }

    return utftext;
  }

  utf8_decode(utftext) {

    var string = "";
    var i = 0;
    var c = 0;
    var c1 = 0;
    var c2 = 0;
    var c3 = 0;

    while (i < utftext.length) {

      c = utftext.charCodeAt(i);

      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      }
      else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      }
      else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }

    }

    return string;
  }

}
