import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { APIConstants} from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';

@Injectable({
    providedIn: 'root'
})
export class  CpuSubClassService{
    constructor(private http: HttpClient) { }

    AddCpuSub(cpusubdata):Observable<any> {
           
          return this.http.post(APIConstants.CPUSUBCLASSINSERT,cpusubdata)
        }

    GetAllCpuSubData(cpusubdata):Observable<any> {
           
        return this.http.post(APIConstants.CPUSUBCLASSGETALLDATA,cpusubdata)
        }  

    RemoveCpuSubClass(cpusubdata):Observable<any> {
           
        return this.http.post(APIConstants.CPUSUBCLASSREMOVE,cpusubdata)
        } 

    UploadCpuSubClass(cpusubdata):Observable<any> {
           
        return this.http.post(APIConstants.CPUSUBCLASSUPLOAD,cpusubdata)
        } 

    UpdateCpuSubClass(cpusubdata):Observable<any> {
           
        return this.http.post(APIConstants.CPUSUBCLASSUPDATE,cpusubdata)
        } 

    ExportCpuSubClass(cpusubdata):Observable<any> {
           
        return this.http.post(APIConstants.CPUSUBCLASSEXPORT,cpusubdata)
        } 
        GetAllCPUSubClassList(CompanyId,GroupId):Observable<any> {
               
            let params = new HttpParams();
            params = params.append('CompanyId', CompanyId);
            params = params.append('GroupId', GroupId);
            return this.http.get(APIConstants.CPUSUBCLASSLISTGETALLDATA, {params: params})
          }
}