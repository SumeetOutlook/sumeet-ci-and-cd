import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { APIConstants} from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';


@Injectable({
    providedIn: 'root'
})
export class CompanyRackService {
    constructor(private http: HttpClient) { }

    GetAllCostsCenterList(companyId , GroupId):Observable<any> {
        let params = new HttpParams();
        params = params.append('companyId', companyId);
        params = params.append('GroupId', GroupId);
        return this.http.get(APIConstants.GETALLCOSTSCENTERLIST, {params: params})
    }
    GetMappedRackListWithRackName(companyId):Observable<any> {
        let params = new HttpParams();
        params = params.append('companyId', companyId);
        return this.http.get(APIConstants.GETMAPPEDRACKLISTWITHRACKNAME, {params: params})
    }
    GetAllMappedRacksByLocId(locId):Observable<any> {
        debugger;
        let params = new HttpParams();
        params = params.append('locId', locId);
        return this.http.post(APIConstants.GETALLMAPPEDRACKSBYLOCID,'', {params: params})
    }
}