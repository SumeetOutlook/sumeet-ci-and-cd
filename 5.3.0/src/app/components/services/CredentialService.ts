import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { APIConstants} from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';



@Injectable({
    providedIn: 'root'
})
export class CredentialService {
    constructor(private http: HttpClient) { }


    ActiveDirectoryGetAllData():Observable<any> {
           
        return this.http.get(APIConstants.ACTIVEDIRECTORYGETALLDATA)
      }
  
    ActiveDirectoryUpdateData(groupdata):Observable<any> {
         
        return this.http.post(APIConstants.ACTIVEDIRECTORYUPDATEDATA,groupdata)
      }
    ActiveDirectoryInsertData(groupdata) :Observable<any>{
           
        return this.http.post(APIConstants.ACTIVEDIRECTORYINSERTDATA,groupdata)
      }
    ActiveDirectoryDeletData(id):Observable<any> {
         
      return this.http.post(APIConstants.ACTIVEDIRECTORYDELETDATA,id)
    }

    EmailCredentialGetAllData():Observable<any> {
         
      return this.http.get(APIConstants.EMAILCREDENTIALGETALLDATA)
    }
    EmailCredentialInsertData(emailCredentialdata) :Observable<any>{
         
      return this.http.post(APIConstants.EMAILCREDENTIALINSERTDATA,emailCredentialdata)
    }
    EmailCredentialUpdateData(emailCredentialdata):Observable<any> {
         
      return this.http.post(APIConstants.EMAILCREDENTIALUPDATEDATA,emailCredentialdata)
    }
    EmailCredentialDeletData(id):Observable<any> {
         
      return this.http.get(APIConstants.EMAILCREDENTIALDELETDATA,id)
    }

    FtpGetAllData():Observable<any> {
         
      return this.http.get(APIConstants.FTP1GETALLDATA)
    }
    FtpInsertData(Ftpdata):Observable<any> {
         
      return this.http.post(APIConstants.FTPINSERTDATA,Ftpdata)
    }
    Ftp1UpdateData(id):Observable<any> {
         
      return this.http.get(APIConstants.FTP1UPDATEDATA,id)
    }
    Ftp1DeletData(id):Observable<any> {
         
      return this.http.get(APIConstants.FTP1DELETDATA,id)
    }
    Ftp2GetAllData():Observable<any> {
         
      return this.http.get(APIConstants.FTP2GETALLDATA)
    }
    Ftp2UpdateData(id):Observable<any> {
         
      return this.http.get(APIConstants.FTP2UPDATEDATA,id)
    }
    Ftp2DeletData(id):Observable<any> {
         
      return this.http.get(APIConstants.FTP2DELETDATA,id)
    }

   
    
  
 }
    
   