import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { APIConstants} from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) { }


    GetAllUserData(GroupId,IsExport):Observable<any> {
           
        let params = new HttpParams();
        params = params.append('groupId', GroupId);
        params = params.append('IsExport', IsExport);
        return this.http.get(APIConstants.USERGETALLDATA, {params: params})
      }

    AddUser(userDetails):Observable<any> {
           
          return this.http.post(APIConstants.USERINSERT,userDetails)
        }

    UpdateUser(userDetails):Observable<any> {
             
            return this.http.post(APIConstants.USERUPDATE,userDetails)
          }

    DeactivateUser(userDetails):Observable<any> 
    {
               
              return this.http.post(APIConstants.USERDEACTIVATE,userDetails)
            } 
            
    ResendConfirmationMailToUser(userDetails):Observable<any>
    {
           
        return this.http.post(APIConstants.USERRESENDMAIL,userDetails)
    }
    ExportUserData(GroupId,IsExport):Observable<any>
    {
           
        let params = new HttpParams();
        params = params.append('groupId', GroupId);
        params = params.append('IsExport', IsExport);
        return this.http.get(APIConstants.USEREXPORT, {params: params})
    }
    DeleteUser(userDetails):Observable<any>
    {
           
        return this.http.post(APIConstants.USERDELETE,userDetails)
    }

    GetEmpEmailForAutoComplete(userEmailId, companyId):Observable<any>
    {
           
        let params = new HttpParams();
        params = params.append('userEmailId', userEmailId);
        params = params.append('companyId', companyId);
        return this.http.get(APIConstants.GETEMPEMAILFORAUTOCOMP, {params: params})
    }

    PermissionRightsByUserIdAndPageId(groupId,userid ,companyId ,regionId ,moduleid):Observable<any>
    {
           
        let params = new HttpParams();
        params = params.append('groupId', groupId);
        params = params.append('userid', userid);
        params = params.append('companyId', companyId);
        params = params.append('regionId', regionId);
        params = params.append('moduleid', moduleid);
        return this.http.get(APIConstants.PERMISSIONRIGHTSBYUSERIDANDPAGEID, {params: params})
    }
    GetEmployeeBySearchKeyWord(groupId, EmpId, IsUsernameChecked, companyId):Observable<any>
    {
           
        let params = new HttpParams();
        params = params.append('groupId', groupId);
        params = params.append('EmpId', EmpId);
        params = params.append('IsUsernameChecked', IsUsernameChecked);
        params = params.append('companyId', companyId);
        return this.http.get(APIConstants.GETEMPLOYEEBYSEARCHKEYWORD, {params: params})
    }

    GetToBindDisplayListForMappingJSON(profile, groupId):Observable<any>
    {
           
        let params = new HttpParams();
        params = params.append('profile', profile);
        params = params.append('groupId', groupId);
        return this.http.get(APIConstants.GETTOBINDDISPLAYLISTFORMAPPINGJSON, {params: params})
    }

    GetuserEmailuserCode(assetDetails):Observable<any>{
        let params = new HttpParams();
        params = params.append('EmpId', assetDetails.EmpId);
        params = params.append('GroupId', assetDetails.GroupId);
        params = params.append('companyId', assetDetails.companyId);
        params = params.append('IsUsernameChecked', assetDetails.IsUsernameChecked);
        return this.http.get(APIConstants.GETUSEREMAILEMPCODE, {params: params})
    }

    download(url: string): Observable<Blob> {
        return this.http.get(url, {
          responseType: 'blob'
        })
    }

    GetbyEmailOrEmployeeId(groupId , EmpId , IsUsernameChecked):Observable<any>{
        let params = new HttpParams();
        params = params.append('groupId', groupId);
        params = params.append('EmpId', EmpId);
        params = params.append('IsUsernameChecked', IsUsernameChecked);
        return this.http.get(APIConstants.GETBYEMAILOREMPLOYEEID, {params: params})
    }
     UpdatePassword(userId, pass,tableid):Observable<any> {
        return this.http.post(APIConstants.ResetPassword, { userId, pass,tableid })
          
    }
    GetUserNameId(userEmail):Observable<any> {

        let params = new HttpParams();
        params = params.append('userEmail', userEmail);
        return this.http.get(APIConstants.GetUserId, { params: params })
          
    }
    InsertFavouriteSelection(userAssignmentDto) :Observable<any>{
        //let body = JSON.stringify(userAssignmentDto)
        // const headers = new HttpHeaders().set('content-type', 'application/json');
        return this.http.post(APIConstants.InsertFavouriteSelections, userAssignmentDto)
    }  
     GetFavouriteSeletionByUserId(UserId) :Observable<any> {
        let params = new HttpParams();
        params = params.append('UserId', UserId);
        return this.http.get(APIConstants.GetFavouriteSeletionByUser, { params: params })
     }

     CheckLinkValid(linkId):Observable<any> {
           
        let params = new HttpParams();
        params = params.append('id', linkId);
        return this.http.get(APIConstants.CHECKLINKVALID, {params: params})
      }

      UpdateNewPassword(email,password,flag,tableId):Observable<any> {
           
        let params = new HttpParams();
        params = params.append('UserEmail', email);
        params = params.append('NewPassword', password);
        params = params.append('flag', flag);
        params = params.append('tableid', tableId);       
        return this.http.get(APIConstants.UPDATENEWPASSWORD, {params: params})
      }
          

      CheckFreezePeriodStatus(groupId, regionId , companyId):Observable<any> {
           
        let params = new HttpParams();
        params = params.append('groupId', groupId);
        params = params.append('regionId', regionId);
        params = params.append('companyId', companyId);
        return this.http.get(APIConstants.CHECKFREEZEPERIODSTATUS, {params: params})
      }
}
