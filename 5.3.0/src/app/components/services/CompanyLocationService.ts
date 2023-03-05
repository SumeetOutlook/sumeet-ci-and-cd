import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { APIConstants} from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';


@Injectable({
    providedIn: 'root'
})
export class CompanyLocationService {
    constructor(private http: HttpClient) { }

    GetLocationsByCompanyIdToBindSelectList(companyId):Observable<any> {
          
        let params = new HttpParams();
        params = params.append('companyId', companyId);
        return this.http.get(APIConstants.GETLOCATIONSBYCOMPANYIDTOBINDSELECTLIST, {params: params})
    }
    GetToBindDisplayListByType(companyId , ltype):Observable<any> {
        let params = new HttpParams();
        params = params.append('companyId', companyId);
        params = params.append('ltype', ltype);
        return this.http.get(APIConstants.GETTOBINDDISPLAYLISTBYTYPE, {params: params})
    }
    GetLocationsByCompanyIdToBindSelectListByPageName(companyId , pageName , groupId , ttype):Observable<any> {
        let params = new HttpParams();
        params = params.append('companyId', companyId);
        params = params.append('pageName', pageName);
        params = params.append('groupId', groupId);
        params = params.append('ttype', ttype);
        return this.http.get(APIConstants.GETLOCATIONSBYCOMPANYIDTOBINDSELECTLISTBYPAGENAME, {params: params})
    }
    GetLocationListByConfiguration(groupId , userid , companyId , regionId , pageid):Observable<any> {
        let params = new HttpParams();
        params = params.append('groupId', groupId);
        params = params.append('userid', userid);
        params = params.append('companyId', companyId);
        params = params.append('regionId', regionId);
        params = params.append('pageid',pageid);

        return this.http.get(APIConstants.GETLOCATIONLISTBYCONFIGURATION, {params: params})
    } 
    GetLocationListByConfigurationAndAssetsAvailable(groupId , userid , companyId , regionId , pageid, flag):Observable<any> {
        let params = new HttpParams();
        params = params.append('groupId', groupId);
        params = params.append('userid', userid);
        params = params.append('companyId', companyId);
        params = params.append('regionId', regionId);
        params = params.append('pageid',pageid);
        params = params.append('flag',flag);

        return this.http.get(APIConstants.GetLocationListByConfigurationAndAssetsAvailable, {params: params})
    } 
    GetInventoryLocationIdsByProjectNamePageName(companyId , pageName , projectName):Observable<any> {
        let params = new HttpParams();
        params = params.append('companyId', companyId);
        params = params.append('pageName', pageName);
        params = params.append('projectName', projectName);
        return this.http.get(APIConstants.GETINVENTORYLOCATIONIDSBYPROJECTNAMEPAGENAME, {params: params})
    }

    GetCurrencyIcon(companyId):Observable<any> {
          
        let params = new HttpParams();
        params = params.append('companyId', companyId);
        return this.http.get(APIConstants.GETCURRENCYICON, {params: params})
    }
    CreateandUploadEmployee(locationDto) :Observable<any> {        // 
        return this.http.post(APIConstants.UploadandCreateEmployee, locationDto)
         
      }
      
}