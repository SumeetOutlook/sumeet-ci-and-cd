import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { APIConstants} from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';


@Injectable({
    providedIn: 'root'
})
export class AssetCategoryService {
    constructor(private http: HttpClient) { }


    GetAllCategoryData(Groupid,Regionid,Companyid):Observable<any> {
         
        let params = new HttpParams();
        params = params.append('groupId', Groupid);
        params = params.append('regionId', Regionid);
        params = params.append('companyId', Companyid);
        return this.http.get(APIConstants.CATEGORYGETALLDATA, {params: params})
      }
  
    AddCategory(categorydata):Observable<any> {
       
        return this.http.post(APIConstants.CATEGORYINSERT,categorydata)
      }

      CategoryGetById(Id):Observable<any> {
       
        let params = new HttpParams();
        params = params.append('id', Id);
        return this.http.get(APIConstants.CATEGORYGETDATA, {params: params})
      }

      CategoryUpdate(categorydata):Observable<any> {
         
          return this.http.post(APIConstants.CATEGORYUPDATE,categorydata)
        }

    RemoveCategoryById(categorydata):Observable<any> {
           
            return this.http.post(APIConstants.CATEGORYREMOVE,categorydata)
          }   


       UploadCategory(categorydata):Observable<any> {
          debugger;
            return this.http.post(APIConstants.ASSETCATEGORYUPLOAD,categorydata)
            }   
}