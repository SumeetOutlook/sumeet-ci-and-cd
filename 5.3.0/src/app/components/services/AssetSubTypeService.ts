import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { APIConstants} from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';


@Injectable({
    providedIn: 'root'
})
export class AssetSubTypeService {
    constructor(private http: HttpClient) { }


    GetAllSubTypeData(subTypeData):Observable<any> {
          
        return this.http.post(APIConstants.ASSETSUBTYPEGETALLDATA, subTypeData)
      }
  
    AddSubType(subTypedata):Observable<any> {
        
        return this.http.post(APIConstants.ASSETSUBTYPEINSERT,subTypedata)
      }

      SubTypeGetById(Id):Observable<any> {
        
        let params = new HttpParams();
        params = params.append('id', Id);
        return this.http.get(APIConstants.ASSETSUBTYPEGETDATA, {params: params})
      }

      SubTypeUpdate(subTypedata):Observable<any> {
          
          return this.http.post(APIConstants.ASSETSUBTYPEUPDATE,subTypedata)
        }

    RemoveSubTypeById(subTypedata):Observable<any> {
            
            return this.http.post(APIConstants.ASSETSUBTYPEREMOVE,subTypedata)
          }   

    UploadSubType(subTypedata):Observable<any> {
          debugger;
            return this.http.post(APIConstants.ASSETSUBTYPEUPLOAD,subTypedata)
          } 
          ExportSubType(subTypeData):Observable<any> {
          
            return this.http.post(APIConstants.EXPORTSUBETYPE, subTypeData)
          }
}