import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { APIConstants} from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';

@Injectable({
    providedIn: 'root'
})
export class  ManufacturerService{
    constructor(private http: HttpClient) { }

    AddManufacturer(manufacturerdata):Observable<any> {
           
          return this.http.post(APIConstants.MANUFACTURERINSERT,manufacturerdata)
        }

    GetAllManufacturerData(manufacturerdata):Observable<any> {
           
        return this.http.post(APIConstants.MANUFACTURERGETALLDATA,manufacturerdata)
        }  

    RemoveManufacturer(manufacturerdata):Observable<any> {
           
        return this.http.post(APIConstants.MANUFACTURERREMOVE,manufacturerdata)
        } 

    UploadManufacturer(manufacturerdata):Observable<any> {
           
        return this.http.post(APIConstants.MANUFACTURERUPLOAD,manufacturerdata)
        } 
    UpdateManufacturer(manufacturerdata):Observable<any> {
           
        return this.http.post(APIConstants.MANUFACTURERUPDATE,manufacturerdata)
        } 
    ExportManufacturer(manufacturerdata):Observable<any> {
           
        return this.http.post(APIConstants.MANUFACTUREREXPORT,manufacturerdata)
        } 
        GetAllManufactureList (CompanyId,GroupId):Observable<any>{
               
            let params = new HttpParams();
            params = params.append('CompanyId', CompanyId);
            params = params.append('GroupId', GroupId);
            return this.http.get(APIConstants.MANUFACTUREGETDATA, {params: params})
    
          }
}