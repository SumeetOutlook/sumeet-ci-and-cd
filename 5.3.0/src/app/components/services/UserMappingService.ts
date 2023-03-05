import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { APIConstants} from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';


@Injectable({
    providedIn: 'root'
})
export class UserMappingService {
    constructor(private http: HttpClient) { }
    GetAllLocationData(TaskId,CompanyId,UserId):Observable<any> {
           
        let params = new HttpParams();
    //   params=params.append('6',6);
        params=params.append('TaskId',TaskId);
        params = params.append('CompanyId', CompanyId);
        params = params.append('UserId', UserId);
        return this.http.get(APIConstants.LOCATIONDATABYTASKIDCOMPANYUSERID, {params: params})
      }


    GetUsersLocationsByTaskIdsCompanyUserId(taskId, companyId, userId):Observable<any> {
        let params = new HttpParams();
        params = params.append('taskId', taskId);
        params = params.append('companyId', companyId);
        params = params.append('userId', userId);
        return this.http.get(APIConstants.GETUSERSLOCATIONSBYTASKIDSCOMPANYUSERID, {params: params})
    }
    GetUsersBlocksData(TaskId,CompanyId,UserId):Observable<any>{
        let params = new HttpParams();
    //   params=params.append('6',6);
        params=params.append('TaskId',TaskId);
        params = params.append('CompanyId', CompanyId);
        params = params.append('UserId', UserId);
        return this.http.get(APIConstants.USERSBLOCKSDATA, {params: params})
      }

      GetMappedTaskIdsOfCuserAsString(userId, companyId):Observable<any>{
        let params = new HttpParams();    //
        params=params.append('userId',userId);
        params = params.append('companyId', companyId);

        return this.http.get(APIConstants.GETMAPPEDTASKIDSOFCUSERASSTRING, {params: params})
      }
}