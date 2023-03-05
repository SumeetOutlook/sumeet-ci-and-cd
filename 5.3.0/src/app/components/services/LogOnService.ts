import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APIConstants } from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';
import { map, catchError, delay } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class LogOnService {
    constructor(private http: HttpClient) { }


    customerLogin(UserName, Password, Authdata): Observable<any> {
        debugger;
        let params = new HttpParams();
        params = params.append('UserName', UserName);
        params = params.append('Password', Password);
        params = params.append('Authdata', Authdata);
        return this.http.post(APIConstants.LOGIN, { Authdata, UserName, Password })
    }

    GetGroupRegionCompany(UserId,ProfileId): Observable<any> {

        let params = new HttpParams();
        params = params.append('UserId', UserId);
        params = params.append('ProfileId', ProfileId);
        return this.http.get(APIConstants.GetGroupRegionAndCompany, { params: params })
    }

    InsertFavouriteSelection(userAssignmentDto): Observable<any> {
        debugger;
        // let body = JSON.stringify(userAssignmentDto)
        // const headers = new HttpHeaders().set('content-type', 'application/json');
        // return this.http.post<any>(APIConstants.InsertFavouriteSelections, body, { headers })
        //   .pipe(map(data => {
        //     if (!data) {
        //       return null;
        //     }    
        //     if (data != null) {
        //       return data;
        //     }
        //   }),            
        //   );
        return this.http.post(APIConstants.InsertFavouriteSelections, userAssignmentDto)
    }

    GetFavouriteSeletionByUserId(UserId): Observable<any> {

        let params = new HttpParams();
        params = params.append('UserId', UserId);
        return this.http.get(APIConstants.GetFavouriteSeletionByUser, { params: params })
    }
    GetConfigurationDetails(groupId): Observable<any> {

        let params = new HttpParams();
        params = params.append('groupId', groupId);
        return this.http.get(APIConstants.GETCONFIGURATIONDETAILES, { params: params })
    }

    PagePermissionForMenuDisplay(groupId, userid, companyId, regionId): Observable<any> {

        let params = new HttpParams();
        params = params.append('groupId', groupId);
        params = params.append('userid', userid);
        params = params.append('companyId', companyId);
        params = params.append('regionId', regionId);
        return this.http.get(APIConstants.PAGEPERMISSIONFORMENUDISPLAY, { params: params })
    }
    GetSsoURL(): Observable<any> {
        return this.http.get(APIConstants.GETSSOURL)
    }
    
    ForgotPassword(UserName): Observable<any> {
        return this.http.post(APIConstants.ForgotPassword, { UserName })
    }

    GetVersion(): Observable<any> {

        
        return this.http.post(APIConstants.GETVERSION,{})
    }

    GetUserDetailsByUserName(UserName): Observable<any> {
        let params = new HttpParams();
        params = params.append('UserName', UserName);
        return this.http.get(APIConstants.GETUSERDETAILSBYUSERNAME, { params: params })
    }
    VerifyOtpDetails(DeviceMFARegistrationDto): Observable<any> {
        debugger;
        let params = new HttpParams();
      //  params = params.append('userId', userId);
     //   params = params.append('UserName', userName);
     //   params = params.append('otpHashValue', otpHashValue);
        return this.http.post(APIConstants.VERIFYOTPDETAILS,DeviceMFARegistrationDto )
    }
    GenerateOtpAndMailSend(userId,userName):Observable<any>{
        let params = new HttpParams();
        params = params.append('userId', userId);
        params = params.append('userName', userName);
        return this.http.get(APIConstants.GENERATEOTPANDMISSING, { params: params } )
    }

    GetDeviceDetails(DeviceDetail):Observable<any>{
        return this.http.post(APIConstants.GetDeviceDetails, DeviceDetail)
    }
   
}