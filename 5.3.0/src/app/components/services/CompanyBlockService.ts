import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { APIConstants} from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';


@Injectable({
    providedIn: 'root'
})
export class CompanyBlockService {
    constructor(private http: HttpClient) { }

    GetBlockOfAssetsByCompany(companyId):Observable<any> {
        let params = new HttpParams();
        params = params.append('companyId', companyId);
        return this.http.get(APIConstants.GETBLOCKOFASSETSBYCOMPANY , {params: params})
    }

    GetBlocksByLocUser(locationId, userId, CompanyId ):Observable<any> {
        let params = new HttpParams();
        params = params.append('locationId', locationId);
        params = params.append('userId', userId);
        params = params.append('CompanyId', CompanyId);
        return this.http.get(APIConstants.GETBLOCKSBYLOCUSER, {params: params})
    }

    GetCategoryAndLocationListForReview(groupId, userid, companyId,regionId ):Observable<any> {
         
        let params = new HttpParams();
        params = params.append('groupId', groupId);
        params = params.append('userid', userid);
        params = params.append('companyId', companyId);
        params = params.append('regionId',regionId);
       
        return this.http.get(APIConstants.GETLOCATIONANDCATEGORYLIST, {params: params})
    }

    GetCategoryListByConfiguration(groupId, userid, companyId,regionId ,pageid ):Observable<any> {
         
        let params = new HttpParams();
        params = params.append('groupId', groupId);
        params = params.append('userid', userid);
        params = params.append('companyId', companyId);
        params = params.append('regionId',regionId);
        params = params.append('pageid',pageid);
       
        return this.http.get(APIConstants.GETCATEGORYLISTBYCONFIGURATION, {params: params})
    }

    GetCompanyBlockListByCompanyId(CompanyId):Observable<any> {
        let params = new HttpParams();
        params = params.append('companyId',CompanyId);
        return this.http.get(APIConstants.GetAssetClassData, {params: params})
    }

    GetToBindSelectListForInventoryAdditional(CompanyId,locationtype,additionalremark):Observable<any> {
        let params = new HttpParams();
        params = params.append('companyId',CompanyId);
        params = params.append('locationtype',locationtype);
        params = params.append('additionalremark',additionalremark);

        return this.http.get(APIConstants.GetAdditionalAssetCityList, {params: params})
    }
     GetAssetClassData(companyId) :Observable<any> {
        let params = new HttpParams();
        params = params.append('companyId', companyId);
        return this.http.get(APIConstants.GetAssetClassData, { params: params })
          
      }
       GetAssetCateotyData(companyId) :Observable<any> {
        let params = new HttpParams();
        params = params.append('companyId', companyId);
        return this.http.get(APIConstants.GetAssetCateotyData, { params: params })
         
      }
      GetBlockOfAssetsByCompanyAssetCategoryId(CompanyBlockDetails):Observable<any>
      {
        debugger;
        return this.http.post(APIConstants.GetBlockOfAssetsByCompanyAssetCategoryId, CompanyBlockDetails)
      }
      
}