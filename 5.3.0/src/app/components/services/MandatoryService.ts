import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APIConstants } from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';


@Injectable({
  providedIn: 'root'
})
export class MandatoryService {
  constructor(private http: HttpClient) { }


  MandatoryGetAllData(): Observable<any> {    
    return this.http.get(APIConstants.MANDATORYGETALLDATA)
  }

  UpdateMandatoryfield(MandatoryDto): Observable<any> {   
    return this.http.post(APIConstants.MANDATORYUPDATEDATA, MandatoryDto)
  }
  MandatoryGetAllDataBYTableName(Table): Observable<any> {
    let params = new HttpParams();
        params = params.append('Table', Table);   
    return this.http.get(APIConstants.MANDATORYGETALLDATABYTABLENAME ,{params : params})
  }




}