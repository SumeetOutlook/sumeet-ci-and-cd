import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { APIConstants} from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';

@Injectable({
    providedIn: 'root'
})
export class CostCenterService {
    constructor(private http: HttpClient) { }

    GetAllCostCenterData(costcenterdata):Observable<any> 
    {
           
        return this.http.post(APIConstants.COSTCENTERGETALLDATA,costcenterdata)
    }
    AddCostCenter(costcenterdata):Observable<any> 
    {
           
          return this.http.post(APIConstants.COSTCENTERINSERT,costcenterdata)
    }

    UpdateCostCenter(costcenterdata):Observable<any> 
    {
             
            return this.http.post(APIConstants.COSTCENTEREDIT,costcenterdata)
    }

    RemoveCostCenter(costcenterdata):Observable<any> 
    {
               
              return this.http.post(APIConstants.COSTCENTERREMOVE,costcenterdata)
    } 
            
    UploadCostCenter(costcenterdata):Observable<any>
    {
           
        return this.http.post(APIConstants.COSTCENTERUPLOAD,costcenterdata)
    }
    ExportCostCenter(costcenterdata):Observable<any>
    {
           
        return this.http.post(APIConstants.COSTCENTEREXPORT,costcenterdata)
    }
    GetAllCostsCenterList(CompanyId,GroupId):Observable<any> {
           
        let params = new HttpParams();
        params = params.append('companyId', CompanyId);
        params = params.append('groupId', GroupId);
        return this.http.get(APIConstants.COSTCENTERGETLISTALLDATA, {params: params})
      }   
}
