import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { APIConstants} from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';


@Injectable({
    providedIn: 'root'
})
export class RegionService {
    constructor(private http: HttpClient) { }


    GetAllRegionData(GroupId):Observable<any> {
           
        let params = new HttpParams();
        params = params.append('groupId', GroupId);
        return this.http.get(APIConstants.REGIONGETALLDATA, {params: params})
      }
  
    AddRegion(regiondata):Observable<any> {
         
        return this.http.post(APIConstants.REGIONINSERT,regiondata)
      }

    RegionGetById(Id):Observable<any> {
         
        let params = new HttpParams();
        params = params.append('id', Id);
        return this.http.get(APIConstants.REGIONGETDATA, {params: params})
      }

    RegionUpdate(regiondata):Observable<any> {
           
          return this.http.post(APIConstants.REGIONUPDATE,regiondata)
        }

    RemoveRegionById(regiondata):Observable<any> {
             
            return this.http.post(APIConstants.REGIONREMOVE,regiondata)
          }   
        
    GetRegionstoBind(groupId):Observable<any> {
            let params = new HttpParams();
            params = params.append('groupId', groupId);
            return this.http.get(APIConstants.GETREGIONSTOBIND, {params: params})
          }

    EmployeeList(Id):Observable<any> {
          
        let params = new HttpParams();
        params = params.append('groupId', Id);
       return this.http.get(APIConstants.EMPLOYEEALLDATA, {params: params})
    }      


}