import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APIConstants } from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';
import { map, catchError, delay } from "rxjs/operators";



@Injectable({
  providedIn: 'root'
})
export class FieldfilterService {
  constructor(private http: HttpClient) { }

  PagesGetAllData(): Observable<any> {

    return this.http.get(APIConstants.PAGESGETALLDATA)
  }
  PageFieldMappingInsert(Pagedto): Observable<any> {

    return this.http.post(APIConstants.PAGEMAPPINGINSERT, Pagedto)
  }
  PageFieldMappingGetAllData(): Observable<any> {

    return this.http.get(APIConstants.FIELDSGETALLDATA)
  }
  PageFilterMappingInsert(Pagedto): Observable<any> {

    return this.http.post(APIConstants.FILTERMAPPING, Pagedto)
  }
  FiltermasterGetAllData(): Observable<any> {

    return this.http.get(APIConstants.FILERMASTERGETALLDATA)
  }
  PageFilterMappingGetdata(): Observable<any> {

    return this.http.get(APIConstants.FILTERGETALLDATA)
  }

  UpdateDefaultValue(updatefieldmapping): Observable<any> {

    return this.http.post(APIConstants.UPDATEDEFAULTDATA, updatefieldmapping)
  }
  UpdateDefaultValuefilter(updatefiltermapping): Observable<any> {

    return this.http.post(APIConstants.UPDATEDEFAULTDATAFILTER, updatefiltermapping)
  }
  Gettagmasterdata(tagdto): Observable<any> {
    return this.http.post(APIConstants.TAGMASTERGETDATA, tagdto)
  }
  ADDtagmasterdata(PrintSetupList): Observable<any> {
    return this.http.post(APIConstants.TAGMASTERADDDATA, PrintSetupList)
  }
  updatetagmasterdata(PrintSetupList): Observable<any> {
    return this.http.post(APIConstants.TAGMASTERUPDATEDATA, PrintSetupList)
  }
  Getlabaldetaildata(): Observable<any> {
    return this.http.get(APIConstants.LABALDETAILGETDATA)
  }
  InsertLabeldata(labedetialdtolist) {
    let body = JSON.stringify(labedetialdtolist);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.post<any>(APIConstants.INSERTLABELDATA, body, { headers })
      .pipe(map(data => {
        //debugger;
        if (!data) {
          return null;
        }

        if (data != null) {
          return data;
        }

      }),

      );
  }


  GetAllDataPagefieldmappingByModuleID(ModuleID): Observable<any> {
    let params = new HttpParams();
    params = params.append('ModuleID', ModuleID); 
    return this.http.get(APIConstants.GETALLDATPAGEFIELDMAPPINGBYMODULEID ,{params : params})
  }

  GetAllDataPagefiltermappingByModuleID(ModuleID): Observable<any> {
    let params = new HttpParams();
    params = params.append('ModuleID', ModuleID); 
    return this.http.get(APIConstants.GETALLDATAPAGEFILTERMAPPINGBYMODULEID ,{params : params})
  }
  GetlabelIdTOBindDisplaylist(CompanyId): Observable<any> {
    let params = new HttpParams();
    params = params.append('id', CompanyId); 
    return this.http.get(APIConstants.GETLABELIDTOBINDDISPLAYLIST ,{params : params})

  }
}