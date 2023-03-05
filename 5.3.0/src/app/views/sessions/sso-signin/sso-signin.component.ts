import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { SHA256 } from 'app/components/storage/SHA256';
import { LogOnService } from 'app/components/services/LogOnService';
import { ActivatedRoute, Router } from '@angular/router';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import * as header from '../../../../assets/Headers.json';
import * as resource from '../../../../assets/Resource.json';
import { ToastrService } from 'ngx-toastr';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-sso-signin',
  templateUrl: './sso-signin.component.html',
  styleUrls: ['./sso-signin.component.scss']
})
export class SsoSigninComponent implements OnInit {

  Headers: any = (header as any).default;
  message: any = (resource as any).default;
  errorMsg = '';

  constructor(private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private storage: ManagerService,
    public LoginService: LogOnService,
    public SHA256: SHA256,
    private loader: AppLoaderService,
    public toastr: ToastrService,
    private jwtAuth: JwtAuthService,) { }

  e: any = "";
  u: any = "";
  p: any = "";
  error : any = "";
  ngOnInit(): void {     
    this.getParam();
  }

  getParam() {
    debugger;
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    console.log(url)
    for (var i = 0; i < url.length; i++) {
      var params = url[i].split("=");
      if (params[0] == 'e') {
        var e = params[1];
        this.e = e;
      }
    }

    //=======
    if (!this.e) {     
      this.GetSsoURL(); 
    }
    else if (this.e == 'a') {
      this.error = 'Response Invalid' ;
      this.toastr.warning('Response Invalid', this.message.AssetrakSays);      
    }
    else if (this.e == 'b') {
      this.error = 'Response Email Id Invalid' ;
      this.toastr.warning('Response Email Id Invalid', this.message.AssetrakSays);     
    }
    else if (this.e == 'c') {
      this.error = 'User email id not valid' ;
      this.toastr.warning('User email id not valid', this.message.AssetrakSays);      
    }   
    else if (this.e == 'd') {
      this.error = 'Sign Out' ;
      this.toastr.warning('Sign Out', this.message.AssetrakSays);   
    } 
    else {
       
      var urlSplit = this.decode(this.e);
      console.log(urlSplit);
      var splitData = urlSplit.split('&');
      for (var i = 0; i < splitData.length; i++) {
        var params = splitData[i].split("=");
        if (params[0] == 't') {
          // var flag1 = params[1];
          // var unixtimestamp = (new Date()).getTime() / 1000;
          // if ((unixtimestamp - flag1) > 100) {
          //     $scope.u = "";
          //     $scope.p = "";
          // }
        }
        if (params[0] == 'u') {
          var flag1 = params[1];
          this.u = flag1;
          //$scope.u = flag1.replace(/\%2B/g, "+").replace(/\%21/g, "!").replace(/\%23/g, "#").replace(/\%24/g, "$").replace(/\%26/g, "&").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")").replace(/\%2A/g, "*").replace(/\%2C/g, ",").replace(/\%2F/g, "/").replace(/\%3A/g, ":").replace(/\%3B/g, ";").replace(/\%3D/g, "=").replace(/\%3F/g, "?").replace(/\%40/g, "@").replace(/\%5B/g, "[").replace(/\%5D/g, "]");
        }
        if (params[0] == 'p') {
          var flag2 = params[1];
          this.p = flag2;
          //$scope.p = flag2.replace(/\%2B/g, "+").replace(/\%21/g, "!").replace(/\%23/g, "#").replace(/\%24/g, "$").replace(/\%26/g, "&").replace(/\%27/g, "'").replace(/\%28/g, "(").replace(/\%29/g, ")").replace(/\%2A/g, "*").replace(/\%2C/g, ",").replace(/\%2F/g, "/").replace(/\%3A/g, ":").replace(/\%3B/g, ";").replace(/\%3D/g, "=").replace(/\%3F/g, "?").replace(/\%40/g, "@").replace(/\%5B/g, "[").replace(/\%5D/g, "]");
        }
      }
      this.Ssologin();
    }
  }

  GetSsoURL() {     
    this.LoginService.GetSsoURL().subscribe(r => {       
      window.open(r,"_self");
    })
  }

  Ssologin() {     
    debugger;
    const UserName = this.u;
    const Password = this.p;
    const Authdata = UserName + ":" + Password;
    var encodeauthdata = btoa(Authdata);
    this.LoginService.customerLogin(UserName, Password, encodeauthdata)
      .subscribe(response => {         
        this.loader.close();
        debugger;
        if (response == null) {
          this.error = 'User email id not exist in database' ;
          this.toastr.warning('User email id not exist in database', this.message.AssetrakSays);
          //this.GetSsoURL();
        }
        else {
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
           
          }
          else {            
            this.getSelectionByUserId(response);
          }
        }
      }, err => {
        this.errorMsg = err.message;
        this.loader.close();
      })
  }
  getSelectionByUserId(response) {
    this.LoginService.GetFavouriteSeletionByUserId(response.UserId).subscribe(r => {
       
      if (r != "null") {
        this.router.navigateByUrl("sessions/selectGRC");
      }
      else {
        this.router.navigateByUrl("sessions/selectGRC");
      }
    });
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
