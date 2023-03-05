import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { APIConstants} from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';


@Injectable({
    providedIn: 'root'
})
export class StoragelocationService {
    constructor(private http: HttpClient) { }


    GetAllStoragelocationData(companyId,locationId):Observable<any> {
           
        let params = new HttpParams();
        params = params.append('CompanyId', companyId);
        params = params.append('LocationId', locationId);
        return this.http.get(APIConstants.STORAGELOCATIONGETALLDATA, {params: params})
      }
  
    AddStoragelocation(storagelocationdata):Observable<any> {
         
        return this.http.post(APIConstants.STORAGELOCATIONINSERT,storagelocationdata)
      }

      StoragelocationGetById(Id):Observable<any> {
         
        let params = new HttpParams();
        params = params.append('id', Id);
        return this.http.get(APIConstants.STORAGELOCATIONGETDATA, {params: params})
      }

      StoragelocationUpdate(storagelocationdata):Observable<any> {
           
          return this.http.post(APIConstants.STORAGELOCATIONUPDATE,storagelocationdata)
        }

    RemoveStoragelocationById(storagelocationdata):Observable<any> {
             
            return this.http.post(APIConstants.STORAGELOCATIONREMOVE,storagelocationdata)
          }   


  RackFileInfoUpload(uploadedFileInfo): Observable<any> {
    debugger;
    return this.http.post(APIConstants.RACKFILEINFOUPLOAD, uploadedFileInfo);
  }
  
  ExportStoragelocationData(companyId,locationId,isExport):Observable<any> {
           
    let params = new HttpParams();
    params = params.append('CompanyId', companyId);
    params = params.append('LocationId', locationId);
    params = params.append('isExport', isExport);
    return this.http.get(APIConstants.EXPORTSTORAGELOCATION, {params: params})
  }
}