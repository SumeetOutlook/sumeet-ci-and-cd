import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { APIConstants} from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';

@Injectable({
    providedIn: 'root'
})
export class  ModelService{
    constructor(private http: HttpClient) { }

    AddModel(modeldata):Observable<any> {
           
          return this.http.post(APIConstants.MODELINSERT,modeldata)
        }

    GetAllModel(modeldata):Observable<any> {
           
        return this.http.post(APIConstants.MODELGETALLDATA,modeldata)
        }  

    RemoveModel(modeldata):Observable<any> {
           
        return this.http.post(APIConstants.MODELREMOVE,modeldata)
        } 

    UploadModel(modeldata):Observable<any> {
           
        return this.http.post(APIConstants.MODELUPLOAD,modeldata)
        } 

    UpdateModel(modeldata):Observable<any> {
           
        return this.http.post(APIConstants.MODELUPDATE,modeldata)
        } 

        GetAllModelList (CompanyId,GroupId):Observable<any>{
               
            let params = new HttpParams();
            params = params.append('CompanyId', CompanyId);
            params = params.append('GroupId', GroupId);
            return this.http.get(APIConstants.MODELTYPEGETDATA, {params: params})
    
          }

    ExportModel(modeldata):Observable<any> {
           
        return this.http.post(APIConstants.MODELEXPORT,modeldata)
        } 
}