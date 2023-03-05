import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { APIConstants} from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';

@Injectable({
    providedIn: 'root'
})
export class  CpuClassService{
    constructor(private http: HttpClient) { }

    AddCpu(cpudata):Observable<any> {
           
          return this.http.post(APIConstants.CPUCLASSINSERT,cpudata)
        }

    GetAllCpuData(cpudata):Observable<any> {
           
        return this.http.post(APIConstants.CPUCLASSGETALLDATA,cpudata)
        }  

    RemoveCpuClass(cpudata):Observable<any> {
           
        return this.http.post(APIConstants.CPUCLASSREMOVE,cpudata)
        } 

    UploadCpuClass(cpudata):Observable<any> {
           
        return this.http.post(APIConstants.CPUCLASSUPLOAD,cpudata)
        } 
    UpdateCpuClass(cpudata):Observable<any> {
           
        return this.http.post(APIConstants.CPUCLASSUPDATE,cpudata)
        } 
    ExportCpuClass(cpudata):Observable<any> {
           
        return this.http.post(APIConstants.CPUCLASSEXPORT,cpudata)
        } 
        GetAllCPUClassList(CompanyId,GroupId):Observable<any> {
               
            let params = new HttpParams();
            params = params.append('CompanyId',CompanyId);
            params = params.append('GroupId', GroupId);
            return this.http.get(APIConstants.CPUCLASSGETLISTALLDATA, {params: params})
          }
}