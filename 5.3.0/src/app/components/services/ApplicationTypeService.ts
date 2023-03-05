import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { APIConstants} from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';

@Injectable({
    providedIn: 'root'
})
export class ApplicationTypeService {
    constructor(private http: HttpClient) { }

        GetAllApplicationTypeData(applicationtypedata):Observable<any> {
         
        return this.http.post(APIConstants.APPLICATIONTYPEGETALLDATA,applicationtypedata)
      }

      AddApplicationType(applicationtypedata):Observable<any> {
         
          return this.http.post(APIConstants.APPLICATIONTYPEINSERT,applicationtypedata)
        }

    UpdateApplicationType(applicationtypedata):Observable<any> {
           
            return this.http.post(APIConstants.APPLICATIONTYPEEDIT,applicationtypedata)
          }

    RemoveApplicationType(applicationtypedata):Observable<any> 
    {
             
              return this.http.post(APIConstants.APPLICATIONTYPEREMOVE,applicationtypedata)
            } 
            
    UploadApplicationType(applicationtypedata):Observable<any>
    {
         
        return this.http.post(APIConstants.APPLICATIONTYPEUPLOAD,applicationtypedata)
    }
    ExportApplicationType(applicationtypedata):Observable<any>
    {
         
        return this.http.post(APIConstants.APPLICATIONTYPEEXPORT,applicationtypedata)
    }
    GetAllApplicationTypeList (CompanyId,GroupId):Observable<any>{
       
      let params = new HttpParams();
      params = params.append('CompanyId', CompanyId);
      params = params.append('GroupId', GroupId);
      return this.http.get(APIConstants.APPLICATIONTYPEGETDATA, {params: params})

    }
}
