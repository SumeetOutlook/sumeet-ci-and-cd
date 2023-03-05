import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { Constants } from 'app/components/storage/constants';
import { APIConstants } from 'app/apiEndpoints/apiFile';

@Injectable({
  providedIn: 'root' 
})
export class SignUpService {
  public isLogginedin=false;
  constructor(private http: HttpClient,private storage:ManagerService) { }

  signUp(signup) : Observable<any>{
    return this.http.post(APIConstants.SIGNUP, signup)
   }
  checkTokenValidAndPassword(data) :Observable<any> {
    return this.http.post(APIConstants.TOKENCHECK,data)
  }
  passwordSet(data) :Observable<any> {
    return this.http.post(APIConstants.PASSWORDSET,data)
  }

  signIn(data) :Observable<any> {
    debugger;
    return this.http.post(APIConstants.LOGIN,data)
  }

  signInGetVersion( ):Observable<any> {
    debugger;
    return this.http.get(APIConstants.LOGIN)
  }



}
