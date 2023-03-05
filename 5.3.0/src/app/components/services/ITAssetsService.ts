import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { APIConstants} from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';


@Injectable({
    providedIn: 'root'
})
export class ITAssetsService {
    constructor(private http: HttpClient) { }
    GetAllSubtypeData(typeId,companyId):Observable<any> {
      let params = new HttpParams();
      params = params.append('typeId', typeId);
      params = params.append('companyId', companyId);
      return this.http.get(APIConstants.SUBTYPEDATA, {params: params})
    }
    GetTypeByBlockJSON(assetParameterDto): Observable<any> {
      return this.http.post(APIConstants.TYPEDATA,assetParameterDto)
    }
    GetAllCategoryData(): Observable<any> {
      return this.http.get(APIConstants.CATEGORYGETALLDATA)
    }
    GetTypeOfAssetList(companyId): Observable<any> {
      let params = new HttpParams();
      params = params.append('companyId',companyId)
      return this.http.get(APIConstants.GetTypeOfAssetList, {params: params})
    }
    GetITAssetsForUserAllocation(companyId , itAssetIds): Observable<any> {
      let params = new HttpParams();
      params = params.append('companyId',companyId)
      params = params.append('itAssetIds',itAssetIds)
      return this.http.get(APIConstants.GETITASSETSFORUSERALLOCATION, {params: params})
    }
    getAllocationTypeList(): Observable<any> {
      return this.http.get(APIConstants.GETALLOCATIONTYPELIST)
    }
    updateUserDetails(assetParameterDto): Observable<any> {
      return this.http.post(APIConstants.UPDATEUSERDETAILS,assetParameterDto)
    }
    GetSubTypeOfAssetMasterList(CompanyId) : Observable<any> {
      let params = new HttpParams();
      params = params.append('companyId', CompanyId);
      return this.http.get(APIConstants.GetSubTypeOfAssetMasterList, { params: params })
       
    }
}