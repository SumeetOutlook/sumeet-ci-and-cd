import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { APIConstants } from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';
import { map, catchError, delay } from "rxjs/operators";
import { of, BehaviorSubject, throwError } from "rxjs";
import { formatDate } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class GroupService {
  constructor(private http: HttpClient) { }


  GetAllGroupData(groupId): Observable<any> {
    let params = new HttpParams();
    params = params.append('groupId', groupId);
    return this.http.get(APIConstants.GROUPGETALLDATA, { params: params })
  }

  getAllGroups(searchAsset): Observable<any> {
    return this.http.post(APIConstants.GROUPLIST, searchAsset)
  }

  AddGroup(groupdata): Observable<any> {

    return this.http.post(APIConstants.GROUPINSERT, groupdata)
  }

  GroupGetById(Id): Observable<any> {

    let params = new HttpParams();
    params = params.append('id', Id);
    return this.http.get(APIConstants.GROUPGETDATA, { params: params })
  }

  GroupUpdate(groupdata): Observable<any> {

    return this.http.post(APIConstants.GROUPUPDATE, groupdata)
  }

  RemoveGroupById(groupdata): Observable<any> {

    return this.http.post(APIConstants.GROUPREMOVE, groupdata)
  }

  GetAllCurrencyData(): Observable<any> {

    return this.http.get(APIConstants.CURRENCYGETALLDATA)
  }
  CheckWetherConfigurationExist(groupId, configid): Observable<any> {

    let params = new HttpParams();
    params = params.append('groupId', groupId);
    params = params.append('configid', configid);
    return this.http.get(APIConstants.CHECKWETHERCONFIGURATIONEXIST, { params: params })
  }
  GetConfigurationValue(groupId, configid): Observable<any> {

    let params = new HttpParams();
    params = params.append('groupId', groupId);
    params = params.append('configid', configid);
    return this.http.get(APIConstants.GETCONFIGURATIONVALUE, { params: params })
  }
  

  GetAllUOMData(): Observable<any> {
    return this.http.get(APIConstants.UOMGETALLDATA)
  }

  LocationGetByCompanyId(CompanyId): Observable<any> {

    let params = new HttpParams();
    params = params.append('CompanyId', CompanyId);
    return this.http.get(APIConstants.LOCATIONDATAGETBYCOMPANYID, { params: params })
  }

  BlocksOfAssetsGetByCompanyId(companyId): Observable<any> {
    let params = new HttpParams();
    params = params.append('companyId', companyId);
    return this.http.get(APIConstants.BLOCKSOFASSETSDATA, { params: params })
  }

  GetAllGRNAssetData(): Observable<any> {
    return this.http.get(APIConstants.GETGRNASSETDATA)
  }

  //For SuperAdmin OtherConfigPage 

  GETONLOADSUPERADMINDETAILS(): Observable<any> {
    return this.http.get(APIConstants.GETONLOADSUPERADMINDETAILS)
  }

  GetAllGroupDetails(): Observable<any> {
    return this.http.get(APIConstants.GETGROUPDETAILS)
  }


  GetConfigDetailsByGroupId(groupId): Observable<any> {
    let params = new HttpParams();
    params = params.append('groupId', groupId);
    return this.http.get(APIConstants.GETCONFIGURATIONMASTER, { params: params })
  }

  //For Admin OtherConfigPage          
  GetAdminConfigDetailsByGroupId(groupId): Observable<any> {
    let params = new HttpParams();
    params = params.append('groupId', groupId);
    return this.http.get(APIConstants.GETADMINCONFIGURATIONMASTER, { params: params })
  }

  GETONLOADADMINDETAILS(): Observable<any> {
    return this.http.get(APIConstants.GETONLOADADMINDETAILS)
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  };

  //For Save SuperAdmin Config
  public SAveConfigDetails(Groupdto) {

    let body = JSON.stringify(Groupdto);

    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.post<any>(APIConstants.SAVECONFIGMASTER, body, { headers })
      .pipe(map(data => {
        //   
        if (!data) {
          return null;
        }

        if (data != null) {
          return data;
        }
      }),
        catchError(this.handleError)
      );
  }

  //For Save Admin Config
  public SAveAdminConfigDetails(groupDetails) {

    let body = JSON.stringify(groupDetails);

    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.post<any>(APIConstants.SAVEADMINCONFIGMASTER, body, { headers })
      .pipe(map(data => {
        //   
        if (!data) {
          return null;
        }

        if (data != null) {
          return data;
        }
      }),
        catchError(this.handleError)
      );
  };

  GetFilterIDlistByPageId(PageId): Observable<any> {
    let params = new HttpParams();
    params = params.append('PageId', PageId);
    return this.http.get(APIConstants.GETFILTERIDLISYBYPAGEID, { params: params })
  }
  GetFieldListByPageId(PageId,UserId,CompanyId): Observable<any> {
    let params = new HttpParams();
    params = params.append('PageId', PageId);
    params = params.append('UserId', UserId);
    params = params.append('IsfromLink','false');
    params = params.append('CompanyId',CompanyId);
    return this.http.get(APIConstants.GETFIELDLISTBYPAGEId, { params: params })
  }
  GetFieldListByPageIdbyLink(PageId,UserId,IsfromLink): Observable<any> {
    let params = new HttpParams();
    params = params.append('PageId', PageId);
    params = params.append('UserId', UserId);
    params = params.append('IsfromLink', IsfromLink);
    return this.http.get(APIConstants.GETFIELDLISTBYPAGEId, { params: params })
  }
  GetFieldListBypageid(PageId): Observable<any> {
    let params = new HttpParams();
    params = params.append('PageId', PageId);
    // params = params.append('UserId', UserId);
    return this.http.get(APIConstants.GetFieldListbyPage, { params: params })
  }
  CheckWetherConfigurationExistForClientCust(groupId, configid): Observable<any> {
    let params = new HttpParams();
    params = params.append('groupId', groupId);
    params = params.append('configid', configid);
    return this.http.get(APIConstants.CLIENTCUSTOMIZATIONCHECKWETHERCONFIG, { params: params })
  }

  CheckWetherConfigurationExistIsAgentUsedOrNot(groupId, configid): Observable<any> {
    let params = new HttpParams();
    params = params.append('groupId', groupId);
    params = params.append('configid', configid);
    return this.http.get(APIConstants.CONFIGCHECKFORISAGENTUSEDORNOT, { params: params })
  }

  //For OutBound Report

  public GetOutBoundData(Transactiontype, Filtertype, PageId, IsExport, CompanyId, SBUList, PageNumber, PageSize) {
    let params = new HttpParams();
    params = params.append('TransactionType', Transactiontype);
    params = params.append('status', Filtertype);
    params = params.append('PageId', PageId);
    params = params.append('isExport', IsExport);
    params = params.append('companyId', CompanyId);
    params = params.append('SBUList', SBUList);
    params = params.append('pageNumber', PageNumber);
    params = params.append('pageSize', PageSize);
    return this.http.get<any>(APIConstants.GetOutBoundData, { params: params })
      .pipe(map(data => {
        //debugger;
        if (!data) {
          return null;
        }
        //this.setUserAndToken(data.token, data.user, !!data);

        if (data != null) {
          return data;
        }

      }),
        catchError(this.handleError)
      );
  }
  GetEditAssetUploadDocument(prefarId): Observable<any> {
    let params = new HttpParams();
    params = params.append('prefarId', prefarId);
    return this.http.get(APIConstants.GetDocumentListForEditAsset, { params: params })
  }


  GetEmployeeSuggestionList(companyId, groupId): Observable<any> {
    let params = new HttpParams();
    params = params.append('companyId', companyId);
    params = params.append('groupId', groupId);
    return this.http.get(APIConstants.GETLISTOFEMPLOYEE, { params: params })
  }


  BlocksOfAssetsGetByCompanyIdUserId(companyId, UserId): Observable<any> {
    let params = new HttpParams();
    params = params.append('companyId', companyId);
    params = params.append('userId', UserId);
    return this.http.get(APIConstants.BLOCKSOFASSETSDATARIGHTWISE, { params: params })
  }


  //For Notification
  GetNotificationModelWiseList(companyId): Observable<any> {
    let params = new HttpParams();
    params = params.append('CompanyId', companyId);
    return this.http.get(APIConstants.GETNOTIFICATIONMODELWISE, { params: params })
  }
  GetNotificationTemplateModuleWiseByClientName(clientname): Observable<any> {
    let params = new HttpParams();
    params = params.append('ClientName', clientname);
    return this.http.get(APIConstants.GETNOTIFICATIONTEMPLATEMODULEWISEBYCLIENTNAME, { params: params })
  }

  GetEventData(): Observable<any> {
    return this.http.get(APIConstants.GETEVENTDATA)
  }

  UpdateEVentBasedData(EmailDto): Observable<any> {
    return this.http.post(APIConstants.UPDATEEVENTBASEDDATA, EmailDto);
  }

  GetNotificationModelWiseListScheduledBase(companyId): Observable<any> {
    let params = new HttpParams();
    params = params.append('CompanyId', companyId);
    return this.http.get(APIConstants.GETNOTIFICATIONSHEDULEDBASED, { params: params })
  }

  UpdateScheduledBasedData(ScheduledDto): Observable<any> {
    return this.http.post(APIConstants.UPDATESCHEDULEDBASEDDATA, ScheduledDto);

  }

  GetAllRoleListByGroupNotification(GroupID, RegionID, CompanyID): Observable<any> {

    let params = new HttpParams();
    params = params.append('groupId', GroupID);
    params = params.append('regionId', RegionID);
    params = params.append('companyId', CompanyID);
    return this.http.get(APIConstants.NOTIFICATIONROLESGETALLDATA, { params: params })
  }

  // InsertData(data): Observable<any> {
  //   return this.http.post(APIConstants.InsertData, data)
  // }
  // UpdateData(data): Observable<any> {
  //   return this.http.post(APIConstants.UpdateData, data)
  // }
  // GetGridData(): Observable<any> {
  //   return this.http.get(APIConstants.GETGridata)
  // }
  // GetAllLicenseData(): Observable<any> {
  //   return this.http.get(APIConstants.GetAllLicenseData)
  // }
  GetMandatoryByFlag(flag): Observable<any> {

    let params = new HttpParams();
    params = params.append('flag', flag);
    return this.http.get(APIConstants.GETMANDATORYBYFLAG, { params: params })
  }

  Getnotificationcount(ClientName): Observable<any> {
    let params = new HttpParams();
    params = params.append('ClientName', ClientName);
    return this.http.get(APIConstants.GETNOTIFICATIONCOUNT, { params: params })
  }

  CreateDuplicateTemplate(paradto): Observable<any> {

    return this.http.post(APIConstants.CREATEDUPLICATETEMPLATE, paradto)
  }
  UpdateNotificationTemplateforNotification(parameterDto): Observable<any> {
    return this.http.post(APIConstants.UPDATENOTIFICATIONTEMPLATEFORNOTIFICATION, parameterDto)
  }

  Init(): Observable<any> {
    return this.http.post(APIConstants.INIT,"")
  }

  InsertIntoLicenseTable(data): Observable<any> {
    return this.http.post(APIConstants.INSERTINTOLICENSETABLE, data )
  }
  UpdateLicenseTable(data): Observable<any> {
    return this.http.post(APIConstants.UPDATELICENSETABLE, data )
  }
  GetAllLicenseDetails(groupId): Observable<any> {
    let params = new HttpParams();
    params = params.append('groupId', groupId);
    return this.http.get(APIConstants.GETALLLICENSEDETAILS, { params: params })
  }
  GetLicenseTermsById(LicenseId): Observable<any> {
    let params = new HttpParams();
    params = params.append('LicenseId', LicenseId);
    return this.http.get(APIConstants.GETLICENSETERMSBYID , { params: params })
  }
  GetLicenseCompanyDistributionById(LicenseId, TermId): Observable<any> {
    let params = new HttpParams();
    params = params.append('LicenseId', LicenseId);
    params = params.append('TermId', TermId);
    return this.http.get(APIConstants.GETLICENSECOMPANYDISTRIBUtIONBYID , { params: params })
  }
  InsertIntoLicenseTerm(data): Observable<any> {
    return this.http.post(APIConstants.INSERTINTOLICENSETERM, data )
  }
  InsertIntoLicenseOverUsage(data): Observable<any> {
    return this.http.post(APIConstants.INSERTINTOLICENSEOVERUSAGE, data )
  }
  UpdateLicenseOverUsageTerm(data): Observable<any> {
    return this.http.post(APIConstants.UPDATELICENSEOVERUSAGETERM, data )
  }
  SaveGroupWiseConfigurationDetails(paradto): Observable<any> {
    return this.http.post(APIConstants.SAVEGROUPWISECONFIGURATIONDETAILS, paradto)
  }
  GetSSODetails(): Observable<any> {
    return this.http.get(APIConstants.GETSSODETAILS)
  }
  checkGroupMasterTableData(): Observable<any> {
    return this.http.get(APIConstants.checkGroupMasterTableData)
  }
  InsertIntoCompanyDistribution(data): Observable<any> {
    debugger;
    return this.http.post(APIConstants.INSERTINTOCOMPANYDISTRIBUTION, data )
  }
  AddDisplayNameToClientHeaderFile(changeHeaderList): Observable<any> {
    let params = new HttpParams();
    params = params.append('header', changeHeaderList);
    return this.http.get(APIConstants.ADDDISPLAYNAMETOCLIENTHEADERFILE, { params: params })
  }
  GetNonFARAssetData(): Observable<any> {
    return this.http.get(APIConstants.GETNONFARASSETDATA)
  }
  // GetFieldList(PageId,UserId): Observable<any> {
  //   let params = new HttpParams();
  //   params = params.append('PageId', PageId);
  //   params = params.append('UserId', UserId);
  //   return this.http.get(APIConstants.GETFIELDLISTBY, { params: params })
  // }

  GetLogoByConfigurationId(configId): Observable<any> {
    debugger;
    let params = new HttpParams();
    params = params.append('configId', configId);
    return this.http.get(APIConstants.GetLogoByConfigurationId, { params: params })
}
}