import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { APIConstants} from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';


@Injectable({
    providedIn: 'root'
})
export class AssetTypeService {
    constructor(private http: HttpClient) { }


    GetAllAssetTypeData(typeData):Observable<any> {
          
        return this.http.post(APIConstants.ASSETTYPEGETALLDATA, typeData)
      }
  
    AddAssetType(typedata):Observable<any> {
        
        return this.http.post(APIConstants.ASSETTYPEINSERT,typedata)
      }

      AssetTypeGetById(Id):Observable<any> {
        
        let params = new HttpParams();
        params = params.append('id', Id);
        return this.http.get(APIConstants.ASSETTYPEGETDATA, {params: params})
      }

      AssetTypeUpdate(typedata):Observable<any> {
          
          return this.http.post(APIConstants.ASSETTYPEUPDATE,typedata)
        }

    RemoveAssetTypeById(typedata):Observable<any> {
            
            return this.http.post(APIConstants.ASSETTYPEREMOVE,typedata)
          }   

     UploadAssetType(typedata):Observable<any> {
            debugger;
              return this.http.post(APIConstants.ASSETTYPEUPLOAD,typedata)
            }   

      ExportAssetType(typeData):Observable<any> {
          
        return this.http.post(APIConstants.EXPORTASSETTYPE, typeData)
      }
}