import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { APIConstants} from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';

@Injectable({
    providedIn: 'root'
})
export class VendorService {
    constructor(private http: HttpClient) { }

      GetAllVendorData(vendordata):Observable<any> {
           
        return this.http.post(APIConstants.VENDORGETALLDATA,vendordata)
      }

      AddVendor(vendordata):Observable<any> {
           
          return this.http.post(APIConstants.VENDORINSERT,vendordata)
        }

     UpdateVendor(vendordata):Observable<any> {
             
            return this.http.post(APIConstants.VENDOREDIT,vendordata)
          }

    RemoveVendor(vendordata):Observable<any> 
    {
               
              return this.http.post(APIConstants.VENDORREMOVE,vendordata)
            } 
            
    UploadVendor(vendordata):Observable<any>
    {
           
        return this.http.post(APIConstants.VENDORUPLOAD,vendordata)
    }
    ExportVendor(vendordata):Observable<any>
    {
           
        return this.http.post(APIConstants.VENDOREXPORT,vendordata)
    }
}
