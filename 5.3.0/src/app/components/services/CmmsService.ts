import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APIConstants } from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';
import { map, catchError, delay } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

export class CmmsService {
    constructor(private http: HttpClient) { }
    //fetch All Order Types
    getOrderTypes() :Observable<any>{
        let headers = new HttpHeaders();
        headers=headers.append('Authorization','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiIzIiwiVXNlck5hbWUiOiJrcnVwYS5zQGFzc2V0Y3Vlcy5jb20iLCJDb21wYW55SUQiOiIwIiwianRpIjoiNGVmYWY2NmYtZTYxOS00ZDE2LWJlMzUtYmQwNTA2MWZjODA5IiwibmJmIjoxNjQ2NjUxMDI1LCJleHAiOjE2NDgzNzkwMjUsImlhdCI6MTY0NjY1MTAyNSwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NDQzMDYvIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NDQzMDYvIn0.DWrrijqzkaBm8H2jU_UqQQYo5Mfb2Rv1hmbskYIcUpM');
        headers = headers.append('Access-Control-Allow-Headers','Content-Type,Accept,origin,x-requested-with,Authorization,X-Your-Extra-Header-Key');
        headers = headers.append('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,OPTIONS');
        headers = headers.append('Access-Control-Allow-Origin','*');
        headers = headers.append('Access-Control-Allow-Origin','1728000');
        return this.http.get(APIConstants.getOrdertypes,{headers: headers});
    }
    //for adding/editing an order type(if adding no need to pass ordertype id, if editing pass ordertype id)
    addEditOrderType(orderData): Observable<any>{
      return this.http.post(APIConstants.addEditOrderType,orderData);
    }
    //deleting an order type 
    deleteOrderType(orderData):Observable<any>{
      let params = new HttpParams();
      params = params.append('OrderTypeID', orderData.OrderTypeID);
      return this.http.delete(APIConstants.deleteOrderType,{params:params});
    }

    getIssueTypesByOrderId(OrderTypeID):Observable<any>{
      let params = new HttpParams();
      params = params.append('OrderTypeID', OrderTypeID);
      return this.http.get(APIConstants.getIssueTypesByOrderId,{params:params});
    }

    getIssueTypes(): Observable<any> {
      return this.http.get(APIConstants.getIssueTypes);
    }

    addEditIssueTypeByOrderId(data): Observable<any>{
      
      return this.http.post(APIConstants.addEditIssueType,data);
    }

    deleteIssueTypeByIssueId(IssueTypeID): Observable<any>{
      let params = new HttpParams();
      params = params.append('IssueTypesID',IssueTypeID);
      return this.http.delete(APIConstants.deleteIssueType,{params:params});
    }

    getIssueTypesMappingByIssueID(issueID): Observable<any>{
      let params = new HttpParams();
      params = params.append('IssueTypesID', issueID);
      return this.http.get(APIConstants.getIssueTypesByOrderId,{params:params});
    }

    GetAssetTypesByCategoryIds(data): Observable<any> {
      let params = new HttpParams();
      params = params.append('CategoryIds',data.categoryIds);
      params = params.append('CompanyID',data.companyId);
      params = params.append('GroupID',data.groupId);
      params = params.append('RegionID',data.regionId);
      return this.http.get(APIConstants.GetAssetTypesByCategoryIds, {params: params});
    }

    getAssetSubTypesByTypeIds(data):Observable<any> {
      let params = new HttpParams();
      params = params.append('Typeids',data.typeIds);
      params = params.append('CompanyID',data.companyId);
      params = params.append('GroupID',data.groupId);
      params = params.append('RegionID',data.regionId);
      return this.http.get(APIConstants.getAssetSubTypesByTypeIds, {params: params});
    }

    getIssueTypesWithMapping(data):Observable<any> {
      let params = new HttpParams();
      params = params.append('OrderTypeID',data.OrderTypeID);
      params = params.append('CategoryID',data.CategoryID);
      params = params.append('TypeID',data.TypeID);
      params = params.append('SubTypeID',data.SubTypeID);
      params = params.append('PageNumber',data.PageNumber);
      params = params.append('PageSize',data.PageSize);
      return this.http.get(APIConstants.getIssueTypesWithMapping, {params: params});
    }

    getIssueTypeByIssueId(issueId):Observable<any>{
      let params = new HttpParams();
      params = params.append('IssueTypesID',issueId);
      return this.http.get(APIConstants.getIssueTypeByIssueId, {params: params});
    }

    //Parts 

    GetPartsByFilter(data):Observable<any> {
      let params = new HttpParams();
      params = params.append('OrderTypeID',data.OrderTypeID);
      params = params.append('CategoryID',data.CategoryID);
      params = params.append('TypeID',data.TypeID);
      params = params.append('SubTypeID',data.SubTypeID);
      params = params.append('PageNumber',data.PageNumber);
      params = params.append('PageSize',data.PageSize);
      return this.http.get(APIConstants.GetPartsByFilter, {params: params});
    }

    GetPartByID(partID):Observable<any> {
      let params = new HttpParams();
      params = params.append('ID',partID);
      return this.http.get(APIConstants.GetById, {params: params});
    }

    GetPartsInventory(): Observable<any> {
      return this.http.get(APIConstants.GetAllPartsInventory);
    }

    GetPartsInventoryByID(id): Observable<any> {
      let params = new HttpParams();
      params = params.append('ID',id);
      return this.http.get(APIConstants.GetPartInventoryByID, {params: params});
    }

    DeletePartInventoryByID(id): Observable<any> {
      let params = new HttpParams();
      params = params.append('ID',id);
      return this.http.delete(APIConstants.PartInventory, {params: params});
    }

    GetPartsInventoryWithFilter(filters): Observable<any> {
      debugger;
      let params = new HttpParams();
      if(filters.partIDS)
      params = params.append('PartIds',filters.partIDS);
      if(filters.locIDS)
      params = params.append('LocationIds',filters.locIDS);
      return this.http.get(APIConstants.GetParsWithFilter, {params: params});
    }

    AddUpdatePartsInventory(data): Observable<any> {
      return this.http.post(APIConstants.PartInventory, data);
    }

    getAllParts(): Observable<any> {
      return this.http.get(APIConstants.GetAllParts);
    }

    getAllWorkdOrders(): Observable<any> {
      return this.http.get(APIConstants.GetAllWorkOrders);
    }

    getPrefarByLocID(data): Observable<any> {
      let params = new HttpParams();
      params = params.append('LocationID', data.locationID);
      params = params.append('Take',data.take);
      params = params.append('Skip',data.skip);
      return this.http.get(APIConstants.GetPreFARbyLocationID, {params: params});
    }

    getCriticalities(): Observable<any> {
      return this.http.get(APIConstants.GetAllCriticalityTypes);
    }

    addWorkOrder(data): Observable<any> {
      return this.http.post(APIConstants.AddWorkOrder, data);
    }

    getWorkOrderByFilter(filters): Observable<any> {
      return this.http.post(APIConstants.GetWorkOrderByFilter,filters);
    }
}