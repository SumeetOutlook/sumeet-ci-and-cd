import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APIConstants } from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';


@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private http: HttpClient) { }

  GetCurencyRateForConversion(GroupId, CompanyId): Observable<any> {
    let params = new HttpParams();
    params = params.append('groupId', GroupId);
    params = params.append('companyId', CompanyId);
    return this.http.get(APIConstants.GETCURENCYRATEFORCONVERSION, { params: params })
  }
  GetAllCompanyData(GroupId, RegionId): Observable<any> {

    let params = new HttpParams();
    params = params.append('groupId', GroupId);
    params = params.append('regionId', RegionId);
    return this.http.get(APIConstants.COMPANYGETALLDATA, { params: params })
  }
  GetCompanytoBind(groupId, regionId): Observable<any> {
    let params = new HttpParams();
    params = params.append('groupId', groupId);
    params = params.append('regionId', regionId);
    return this.http.get(APIConstants.GETCOMPANYTOBIND, { params: params })

  }
  AddComapny(companydata): Observable<any> {

    return this.http.post(APIConstants.COMPANYINSERT, companydata)
  }

  CompanyGetById(Id): Observable<any> {

    let params = new HttpParams();
    params = params.append('id', Id);
    return this.http.get(APIConstants.COMPANYGETDATA, { params: params })
  }

  CompanyUpdate(companydata): Observable<any> {

    return this.http.post(APIConstants.COMPANYUPDATE, companydata)
  }

  RemoveCompanyById(companydata): Observable<any> {

    return this.http.post(APIConstants.COMPANYREMOVE, companydata)
  }

  GetAllCountryData(): Observable<any> {

    return this.http.get(APIConstants.COUNTRYGETALLDATA)
  }


  GetAllStateData(): Observable<any> {

    return this.http.get(APIConstants.STATEGETALLDATA)
  }

  GetAllCityData(): Observable<any> {

    return this.http.get(APIConstants.CITYGETALLDATA)
  }


  // GetAllCityData():Observable<any> {
  //      
  //   return this.http.get(APIConstants.GETLOCATIONBYCOMPANYID)
  // }
  MappedRackListWithNameGetById(CompanyId): Observable<any> {
    let params = new HttpParams();
    params = params.append('CompanyId', CompanyId);
    return this.http.get(APIConstants.MAPPEDRACKLISTDATA, { params: params })
  }

  GetAllCostsCenterList(CompanyId, GroupId): Observable<any> {

    let params = new HttpParams();
    params = params.append('companyId', CompanyId);
    params = params.append('groupId', GroupId);
    return this.http.get(APIConstants.COSTCENTERGETALLDATA, { params: params })
  }


  GetFiscalYearList(GroupId): Observable<any> {
       
    let params = new HttpParams();
    params = params.append('groupId', GroupId);

    return this.http.get(APIConstants.GetFiscalYearList, { params: params })

  }

  GetPeriodList(GroupId, Region, company, Fianacialyear): Observable<any> {
       
    let params = new HttpParams();
    params = params.append('groupId', GroupId);
    params = params.append('RegionId', Region);
    params = params.append('companyId', company);
    params = params.append('FinancialYear', Fianacialyear);

    return this.http.get(APIConstants.GetPeriodList, { params: params })
  }
  GetPeriodListforDescrepancy(GroupId, RegionId, CompanyId, financialyear): Observable<any> {

    let params = new HttpParams();
    params = params.append('groupId', GroupId);
    params = params.append('regionId', RegionId);
    params = params.append('companyId', CompanyId);
    params = params.append('financialyear', financialyear);
    return this.http.get(APIConstants.GETPERIODLISTFORDESCREPANCY, { params: params })
  }
  GetPeriodwiseDescrepancyfileList(GroupId, RegionId, CompanyId, financialyear): Observable<any> {

    let params = new HttpParams();
    params = params.append('groupId', GroupId);
    params = params.append('regionId', RegionId);
    params = params.append('companyId', CompanyId);
    params = params.append('financialyear', financialyear);
    return this.http.get(APIConstants.GETPERIODWISEDESCREPANCYFILELIST, { params: params })
  }
   GetDescrepancyList(GroupId, RegionId, CompanyId, filename, period, IsExport, PageNumber, PageSize,Status,isSearch,SearchText): Observable<any> {

    let params = new HttpParams();
    params = params.append('groupId', GroupId);
    params = params.append('regionId', RegionId);
    params = params.append('companyId', CompanyId);
    params = params.append('filename', filename);
    params = params.append('period', period);
    params = params.append('IsExport', IsExport);
    params = params.append('pageNumber', PageNumber);
    params = params.append('pageSize', PageSize);
    params = params.append('status', Status);
    params = params.append('isSearch', isSearch );
    params = params.append('SearchText', SearchText );
    return this.http.get(APIConstants.GETDESCREPANCYLIST, { params: params })
  }
  RunDescrepancy(GroupId, RegionId, CompanyId, period, financialyear): Observable<any> {

    let params = new HttpParams();
    params = params.append('groupId', GroupId);
    params = params.append('regionId', RegionId);
    params = params.append('companyId', CompanyId);
    params = params.append('period', period);
    params = params.append('financialyear', financialyear);
    return this.http.get(APIConstants.RUNDESCREPANCY, { params: params })
  }
  UpdateCutoffPeriodDetailsByPeriodid(cutOffPeriodMasterDto): Observable<any> {
    return this.http.post(APIConstants.UPDATECUTOFFPERIODETAILSBYPERIODID, cutOffPeriodMasterDto)
    // cutOffPeriodMasterDto

  }
  AddCutOffDetailsForCurrentFiscalYear(cutOffPeriodMasterDto): Observable<any> {
    return this.http.post(APIConstants.AddCutOffDetailsForCurrentFiscalYear, cutOffPeriodMasterDto)
  }
  UpdateDiscrepacyReasons(activityDto): Observable<any> {

    return this.http.post(APIConstants.UPDATEDISCREPANCYREASONS, activityDto)
  }
  RunDescrepancywithfile(GroupId, RegionId, CompanyId, period, financialyear, fileList): Observable<any> {
       
    let params = new HttpParams();
    params = params.append('groupId', GroupId);
    params = params.append('regionId', RegionId);
    params = params.append('companyId', CompanyId);
    params = params.append('period', period);
    params = params.append('financialyear', financialyear);
    params = params.append('filename', "");

   

    let formData = new FormData();
    formData.append('uploadFile', fileList[0]);

    return this.http.post(APIConstants.RUNDESCREPANCYWITHFILE, formData, { params: params })
  }

  GetPeriodwiseDescrepancyfileListAll(GroupId, RegionId, CompanyId, financialyear): Observable<any> {

    let params = new HttpParams();
    params = params.append('groupId', GroupId);
    params = params.append('regionId', RegionId);
    params = params.append('companyId', CompanyId);
    params = params.append('financialyear', financialyear);
    return this.http.get(APIConstants.GETPERIODWISEDESCREPANCYFILELISTALL, { params: params })
  }

  GetPeriodwiseDescrepancyfileListForReport(GroupId, RegionId, CompanyId, financialyear, PeriodName): Observable<any> {

    let params = new HttpParams();
    params = params.append('groupId', GroupId);
    params = params.append('regionId', RegionId);
    params = params.append('companyId', CompanyId);
    params = params.append('financialyear', financialyear);
    params = params.append('period', PeriodName);
    return this.http.get(APIConstants.GETPERIODWISEDESCREPANCYFILELISTForReport, { params: params })
  }

  
  SendMailOfADI(GroupId, RegionId, CompanyId): Observable<any> {

    let params = new HttpParams();
    params = params.append('groupId', GroupId);
    params = params.append('RegionId', RegionId);
    params = params.append('companyId', CompanyId);
    return this.http.get(APIConstants.SENDMAILOFADI, { params: params })
  }
  ExportFilename(GroupId, RegionId, CompanyId,filename): Observable<any> {
    let params = new HttpParams();
    params = params.append('groupId', GroupId);
    params = params.append('RegionId', RegionId);
    params = params.append('companyId', CompanyId);
    params = params.append('fileName', filename);
    return this.http.get(APIConstants.EXPORTFILENAME , { params: params })
    }
     Fullpath:any;
    GetFileExportReturnFilePath( filename,CompanyId) {
         
      var path = APIConstants.DOWNLOADEXCELFILE;
      this.Fullpath=path +CompanyId+'/ViewDescrepancy/'+ filename;
      window.location.assign(this.Fullpath);
      
      }
       GetGroupRegionCompany(UserId,ProfileId) : Observable<any>{
        let params = new HttpParams();
        params = params.append('UserId', UserId);
        params = params.append('ProfileId', ProfileId);
        return this.http.get(APIConstants.GetGroupRegionAndCompany, { params: params })
          
      }
       GetCurrencyCompanyByGroup(groupId, Region, Company, UserId) : Observable<any> {
        let params = new HttpParams();
        params = params.append('groupId', groupId);
        params = params.append('RegionId', Region);
        params = params.append('CompanyId', Company);
        params = params.append('userId', UserId);
    
        return this.http.get(APIConstants.GetCurrencyCompanyGroupById, { params: params })
          
      }
       GetCurrencyConversionDataByGroupID(groupId, RegionId, CompanyId, UserId) : Observable<any>  {
        let params = new HttpParams();
        params = params.append('GroupId', groupId);
        params = params.append('RegionId', RegionId);
        params = params.append('CompanyId', CompanyId);
        params = params.append('UserId', UserId);
        return this.http.get(APIConstants.GetCurrencyConversionDataAllByGroupID, { params: params })
          
      }
       GetCurrencyConversionDataByGroupIDCompanyID(groupId, companyId) : Observable<any> {
        let params = new HttpParams();
        params = params.append('CompanyId', companyId);
        params = params.append('GroupId', groupId);
        return this.http.get(APIConstants.GetCurrencyConversionDataByGroupIDCompanyID, { params: params })
          
      }
      MapCurrencyConversion(CurrencyConversionList) : Observable<any> {
        return this.http.post(APIConstants.MapCurrencyConversion, CurrencyConversionList)
          
      }  
       GetEmployeeMasterCompany(GroupId): Observable<any> {
        let params = new HttpParams();
        params = params.append('groupId', GroupId);
        return this.http.get(APIConstants.GetEmployeeMasterCompanyList, { params: params })
          
      }
       GetEmployeeMasterCompanyData(companyId, pagesize, pageno, IsExport, searchText, GroupId) : Observable<any> {
        let params = new HttpParams();
        params = params.append('companyId', companyId);
        params = params.append('pageSize', pagesize);
        params = params.append('pageNo', pageno);
        params = params.append('searchText', searchText);
        params = params.append('IsExport', IsExport);
        params = params.append('groupId', GroupId);
    
        return this.http.get(APIConstants.GetEmployeeMasterCompanyData, { params: params })
          
      }
       UpdateEmployee(ObjEmployeeMasterDto): Observable<any>  {
        return this.http.post(APIConstants.UpdateEmployeeData, ObjEmployeeMasterDto)
         
      }
       DeleteEmployeeData(EmployyeeDto) : Observable<any> {        
        return this.http.post(APIConstants.DeleteEmployeeData, EmployyeeDto)
         
      }
      OnGetComapnyList(UserId) : Observable<any> {

        let params = new HttpParams();
        params = params.append('UserId', UserId);
        return this.http.get(APIConstants.GetValueForCompany, { params: params })
          
      }
      OnGetRegionList(UserId) : Observable<any>  {
        let params = new HttpParams();
        params = params.append('UserId', UserId);
    
        return this.http.get(APIConstants.GetValueForRegion, { params: params })
         
      }
    

}