import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { APIConstants} from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';
import { map, catchError, delay } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})

export class DefineseriesService {
    constructor(private http: HttpClient) { }
    GetAllDataDefine():Observable<any> {
           
        return this.http.get(APIConstants.GETDATADEAFINESERIES)
      }
    GetToBindCompanySelectListWithCUserID(groupId, userId):Observable<any> {
      let params = new HttpParams();
      params = params.append('groupId', groupId);
      params = params.append('userId', userId);
        return this.http.get(APIConstants.GETTOBINDCOMPANYSELECTLISTWITHUSERID, {params: params})
      }
      GetCategoryListByConfiguration( groupId, userid, companyId, regionId,pageid):Observable<any>{
         
        let params = new HttpParams();
        params = params.append('groupId', groupId);
        params = params.append('userid', userid);
        params = params.append('companyId', companyId);
        params = params.append('regionId',regionId);
        params = params.append('pageid',pageid);
       
        return this.http.get(APIConstants.GETCATEGORYLISTBYCONFIGURATION, {params: params})
    }
    GetSeriesDefinition(assetDetails):Observable<any> {
           
        
        return this.http.post(APIConstants.GETSERIESDEFINATION, assetDetails)
    }
    Insertseriesdata(categoryid,GroupId, StratBarcode, EndBarcode, Count , Companyid , prefix, Enabled,IsActive):Observable<any>{
         
      let params = new HttpParams();
      params = params.append('categoryid', categoryid); 
      params = params.append('StratBarcode', StratBarcode);
      params = params.append('EndBarcode', EndBarcode);
      params = params.append('Count', Count);
      params = params.append('Companyid', Companyid);
      params = params.append('prefix', prefix);
      params = params.append('Enabled', Enabled);
      params = params.append('IsActive', IsActive);
      params = params.append('GroupId', GroupId );
    
      return this.http.get(APIConstants.INSERTSERIESDATA, {params: params})
    }
    Seriesprinting(groupId):Observable<any> {
         
      let params = new HttpParams();
      params = params.append('groupid', groupId);
      return this.http.get(APIConstants.SERIESPRINTING, {params: params})
    }
    compaireBarcode(Startbarcode, Endbarcode,GroupId, CompanyId, prefix):Observable<any>{
         
      let params = new HttpParams();
      params = params.append('Startbarcode', Startbarcode);
      params = params.append('Endbarcode', Endbarcode);
      params = params.append('companyId', CompanyId);
      params = params.append('prefix', prefix);
      params = params.append('groupId', GroupId );
    
      return this.http.get(APIConstants.COMPAIREBARCODE, {params: params})
    }
    Getassetdetail(BarcodeDetails):Observable<any>{
         
      return this.http.post(APIConstants.GETASSETDETAIL,BarcodeDetails)
    }
    GetPrintDetails(assetDetails):Observable<any> {
         
      
      return this.http.post(APIConstants.GETPRINTDETAIL, assetDetails)
  }
  GetBarcodeAvailableCount(LocationId, categoryName, GroupId, CompanyId):Observable<any> {
    
    let params = new HttpParams();
    params = params.append('locationId', LocationId);
    params = params.append('companyId', CompanyId);
    params = params.append('blockname', categoryName);
    params = params.append('groupId', GroupId );
    return this.http.get(APIConstants.GETBARCODEAVAILABLECOUNT, {params: params})
  }
  GetPrintSetupByCompanyIdJson(CompanyId):Observable<any>{
       
    let params = new HttpParams();
    params = params.append('companyId', CompanyId);
    return this.http.get(APIConstants.GETPRINTSETUPBYCOPANYIDJSON, {params: params})
  }
  GetlabelIdTOBindDisplaylist(CompanyId): Observable<any> {
    let params = new HttpParams();
    params = params.append('id', CompanyId); 
    return this.http.get(APIConstants.GETLABELIDTOBINDDISPLAYLIST ,{params : params})

  }
  Insertprintdetail( sdefinition):Observable<any> {
       
     return this.http.post(APIConstants.INSERTPRINTDETAIL, sdefinition )
  }
  UpdateSeriesDefinition(objUpdateSeriesDefinition):Observable<any> {
       
    return this.http.post(APIConstants.UPDATESERIESDEFINITION, objUpdateSeriesDefinition )
 }

 GetBarcode(locationid, catrgoryId, noOfLabels):Observable<any>{
  
  let params = new HttpParams();
    params = params.append('locationid', locationid); 
    params = params.append('blockid', catrgoryId); 
    params = params.append('nolabels', noOfLabels); 
  return this.http.get(APIConstants.GETBARCODE, {params : params})
 }

 GetLastPrintBarcode(catrgoryId, companyId):Observable<any>{
  
  let params = new HttpParams();
    params = params.append('blockid', catrgoryId); 
    params = params.append('companyId', companyId); 
  return this.http.get(APIConstants.GETLASTPRINTBARCODE, {params : params})
 }
 
 GetBlockOfAssetsByCompany(companyId):Observable<any>{
  let params = new HttpParams();
  params = params.append('companyId',companyId);
  return this.http.get(APIConstants.TAGGINGASSETCLASS,{params:params})
}
Download(sdefinition):Observable<any>{
  
  let body = JSON.stringify(sdefinition);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.post<any>(APIConstants.DOWNLOAD, body, { headers })
      .pipe(map(data => {
        //
        if (!data) {
          return null;
        }

        if (data != null) {
          return data;
        }

      }),

      );
  // return this.http.post(APIConstants.DOWNLOAD, sdefinition )
}
}