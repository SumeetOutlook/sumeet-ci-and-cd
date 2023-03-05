import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APIConstants } from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';


@Injectable({
  providedIn: 'root'
})
export class SbuService {
  constructor(private http: HttpClient) { }


  GetAllSbuData(GroupId, RegionId, CompanyId): Observable<any> {

    let params = new HttpParams();
    params = params.append('groupId', GroupId);
    params = params.append('regionId', RegionId);
    params = params.append('companyId', CompanyId);
    return this.http.get(APIConstants.SBUGETALLDATA, { params: params })
  }

  AddSbu(sbudata): Observable<any> {

    return this.http.post(APIConstants.SBUINSERT, sbudata)
  }

  SbuGetById(Id): Observable<any> {

    let params = new HttpParams();
    params = params.append('id', Id);
    return this.http.get(APIConstants.SBUGETDATA, { params: params })
  }

  SbuUpdate(sbudata): Observable<any> {

    return this.http.post(APIConstants.SBUUPDATE, sbudata)
  }

  RemoveSbuById(sbudata): Observable<any> {

    return this.http.post(APIConstants.SBUREMOVE, sbudata)
  }

  SbuFileInfoUpload(uploadedFileInfo): Observable<any> {
    debugger;
    return this.http.post(APIConstants.SBUFILEINFOUPLOAD, uploadedFileInfo);
  }
  GetSbuExport(GroupId, RegionId, CompanyId,isexport): Observable<any> {

    let params = new HttpParams();
    params = params.append('groupId', GroupId);
    params = params.append('regionId', RegionId);
    params = params.append('companyId', CompanyId);
    params = params.append('isexport', isexport);
    return this.http.get(APIConstants.GetSbuExport, { params: params })
  }
}