import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APIConstants } from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';


@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private http: HttpClient) { }


  GetAllLocationData(CompanyId, SbuName): Observable<any> {

    let params = new HttpParams();
    params = params.append('companyId', CompanyId);
    params = params.append('SBUName', SbuName);
    return this.http.get(APIConstants.LOCATIONGETALLDATA, { params: params })
  }

  AddLocation(locationdata): Observable<any> {

    return this.http.post(APIConstants.LOCATIONINSERT, locationdata)
  }

  LocationGetById(Id): Observable<any> {

    let params = new HttpParams();
    params = params.append('id', Id);
    return this.http.get(APIConstants.LOCATIONGETDATA, { params: params })
  }

  LocationUpdate(locationdata): Observable<any> {

    return this.http.post(APIConstants.LOCATIONUPDATE, locationdata)
  }

  RemoveLocationById(locationdata): Observable<any> {

    return this.http.post(APIConstants.LOCATIONREMOVE, locationdata)
  }
  // //For Review
  //           LocationById(ModuleId,UserId):Observable<any> {
  //                
  //               let params = new HttpParams();
  //               params = params.append('ModuleId', ModuleId);
  //               params = params.append('UserId', UserId);
  //               return this.http.get(APIConstants.LOCATIONID, {params: params})
  //             }

  //             Category(ModuleId,UserId):Observable<any> {
  //                  
  //                 let params = new HttpParams();
  //                 params = params.append('ModuleId', ModuleId);
  //                 params = params.append('UserId', UserId);
  //                 return this.http.get(APIConstants.REVIEWCATEGORYDATA, {params: params})
  //               }


  //For Review
  LocationById(CompanyId): Observable<any> {

    let params = new HttpParams();
    params = params.append('CompanyId', CompanyId);
    return this.http.get(APIConstants.LOCATIONID, { params: params })
  }

  Category(CompanyId): Observable<any> {

    let params = new HttpParams();
    params = params.append('companyId', CompanyId);
    return this.http.get(APIConstants.REVIEWCATEGORYDATA, { params: params })
  }

  LocationFileInfoUpload(uploadedFileInfo): Observable<any> {
    debugger;
    return this.http.post(APIConstants.LOCATIONFILEINFOUPLOAD, uploadedFileInfo);
  }

  GetLocationexport(CompanyId, SbuName,isExport): Observable<any> {

    let params = new HttpParams();
    params = params.append('companyId', CompanyId);
    params = params.append('SBUName', SbuName);
    params = params.append('isExport', isExport);
    return this.http.get(APIConstants.LOCATIONEXPORT, { params: params })
  }
}