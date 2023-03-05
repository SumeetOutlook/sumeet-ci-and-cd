import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { APIConstants} from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';

@Injectable({
    providedIn: 'root'
})
export class OperatingSystemService {
    constructor(private http: HttpClient) { }


    GetAllOperatingSystemData(operatingsystemdata):Observable<any> {
           
        return this.http.post(APIConstants.OPERATINGSYSTEMGETALLDATA,operatingsystemdata)
      }

    AddOperatingSystem(operatingsystemdata):Observable<any> {
           
          return this.http.post(APIConstants.OPERATINGSYSTEMINSERT,operatingsystemdata)
        }

    UpdateOperatingSystem(operatingsystemdata):Observable<any> {
             
            return this.http.post(APIConstants.OPERATINGSYSTEMEDIT,operatingsystemdata)
          }

    RemoveOperatingSystem(operatingsystemdata):Observable<any> 
    {
               
              return this.http.post(APIConstants.OPERATINGSYSTEMREMOVE,operatingsystemdata)
            } 
            
    UploadOperatingSystem(operatingsystemdata):Observable<any>
    {
           
        return this.http.post(APIConstants.OPERATINGSYSTEMUPLOAD,operatingsystemdata)
    }
    ExportOperatingSystem(operatingsystemdata):Observable<any>
    {
           
        return this.http.post(APIConstants.OPERATINGSYSTEMEXPORT,operatingsystemdata)
    }
    GetAllOperatingSystemList(CompanyId,GroupId):Observable<any> {
         
      let params = new HttpParams();
      params = params.append('CompanyId',CompanyId);
      params = params.append('GroupId',GroupId);
      return this.http.get(APIConstants.OSGETALLDATA, {params: params})
    }

        

}
