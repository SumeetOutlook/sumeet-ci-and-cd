import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { APIConstants } from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';
import { map, catchError, delay } from "rxjs/operators";
import { of, BehaviorSubject, throwError } from "rxjs";


@Injectable({
  providedIn: 'root'
})

export class ITAMService {
  constructor(private http: HttpClient) { }

  getNetworkInventoryAssets(data): Observable<any> {

    let params = new HttpParams();
    params = params.append('companyId', data.companyId);
    params = params.append('locationId', data.locationId);
    params = params.append('groupId', data.groupId);
    params = params.append('option', data.option);
    params = params.append('pageNo', data.pageNo);
    params = params.append('pageSize', data.pageSize);
    params = params.append('isExport', data.isExport);
    params = params.append('Model', data.Model);
    params = params.append('Devicecategory', data.Devicecategory);
    params = params.append('Orderby', data.Orderby);
    params = params.append('SortOrder', data.SortOrder);
    params = params.append('manufacturer', data.manufacturer);
    params = params.append('searchtext', data.searchtext);
    params = params.append('Category', data.Category);
    params = params.append('Assettype', data.Assettype);
    params = params.append('Assetsubtype', data.Assetsubtype);
    params = params.append('Datewisefilter', data.Datewisefilter);
    return this.http.get(APIConstants.getNetworkInventoryAssets, { params: params })
  }

  hardwareChangeReport(data): Observable<any> {

    let params = new HttpParams();
    params = params.append('companyId', data.companyId);
    params = params.append('GroupID', data.GroupID);
    params = params.append('option', data.option);
    params = params.append('HardwareCategory', data.HardwareCategory);
    params = params.append('itSerialNo',data.itSerialNo);
    params = params.append('AssetID',data.AssetID);
    params = params.append('FromDate', data.FromDate);
    params = params.append('ToDate', data.ToDate);
    params = params.append('SearchText', data.SearchText);
    params = params.append('pageSize', data.pageSize);    
    params = params.append('pageNo', data.pageNo);
    params = params.append('isExport', data.isExport);
    
    //params = params.append('searchColumn', data.searchColumn);
    return this.http.get(APIConstants.hardwareChangeReport, { params: params })
  }

  getSWListByITSerialNo(data): Observable<any> {

    let params = new HttpParams();
    params = params.append('companyId', data.companyId);
    params = params.append('pageNo', data.pageNo);
    params = params.append('pageSize', data.pageSize);
    params = params.append('isExport', data.isExport);
    params = params.append('itSerialNo', data.itSerialNo ? data.itSerialNo : '');
    params = params.append('searchtext', data.searchtext);
    params = params.append('AssetNo', data.AssetNo);
    params = params.append('SubNo', data.SubNo);
    params = params.append('Orderby', data.Orderby);
    params = params.append('SortOrder', data.SortOrder);
    return this.http.get(APIConstants.getSWListByITSerialNo, { params: params })
  }

  getNetworkInventoryFilters(filter, companyId): Observable<any> {
    let params = new HttpParams();
    params = params.append('DropdownSelection', filter);
    params = params.append('companyId', companyId);
    return this.http.get(APIConstants.getNetworkInventoryFilters, { params: params })
  }

  getSoftwareType(Isoptions): Observable<any> {
    let params = new HttpParams();
    params = params.append('Isoptions', Isoptions);
    return this.http.get(APIConstants.getSoftwareType, { params: params });
  }

  getSoftwareCategory(): Observable<any> {
    return this.http.get(APIConstants.getSoftwareCategory);
  }

  getSoftwareManufacturer(): Observable<any> {
    return this.http.get(APIConstants.getManufacturer);
  }

  getSuiteComponentSoftware(mID): Observable<any> {
    let params = new HttpParams();
    params = params.append('ManufacturerID', mID);
    return this.http.get(APIConstants.getSuiteSoftwareComponent, { params: params });
  }

  deleteScannedSoftware(data): Observable<any> {
    let formData = new FormData();
    let params = new HttpParams();
    params = params.append('id', data.ID);
    params = params.append('CompanyId', data.CompanyId);
    params = params.append('LocationId', data.LocationId);
    params = params.append('GroupID', data.GroupID);
    return this.http.post(APIConstants.deleteScannedSoftware,  formData, { params: params });
  }

  insertManufacturer(manufacturer): Observable<any> {

    let formData = new FormData();

    let params = new HttpParams();
    params = params.append('Description', manufacturer.Description);
    params = params.append('Name', manufacturer.Name);
    return this.http.post(APIConstants.insertManufacturer, formData, { params: params })
  }

  insertNewSoftware(softwareData): Observable<any> {

    let formData = new FormData();
    formData.append('SoftwareName', softwareData.SoftwareName);
    formData.append('SoftwareVersion', softwareData.SoftwareVersion);
    formData.append('SoftwareTypeID', softwareData.SoftwareTypeID);
    formData.append('SoftwareCategoryID', softwareData.SoftwareCategoryID);
    formData.append('ManufacturerID', softwareData.ManufacturerID);
    formData.append('SoftwareSuiteID', softwareData.SoftwareSuiteID);
    //formData.append('Cost',softwareData.Cost);
    formData.append('Description', softwareData.Description);
    formData.append('CompanyId', softwareData.CompanyId);
    formData.append('GroupId', softwareData.GroupId);
    //formData.append('RoleID', softwareData.RoleID);
    //formData.append('SuiteComponentSoftware',softwareData.SuiteComponentSoftware);
    softwareData.Images.forEach(img => formData.append('Image', img));
    return this.http.post(APIConstants.addNewSoftware, formData)
  }

  getScannedSoftwareList(data): Observable<any> {

    // let params = new HttpParams();
    // params = params.append('CompanyId',data.CompanyId);
    // params = params.append('GroupID',data.GroupID);
    // params = params.append('searchManufacturer',data.searchManufacturer);
    // params = params.append('seaarchSoftwareType',data.seaarchSoftwareType);
    // params = params.append('searchSoftwareSuite',data.searchSoftwareSuite);
    // params = params.append('ComplianceType',data.ComplianceType);
    // params = params.append('searchlist',data.searchlist);
    // params = params.append('pageSize',data.pageSize);
    // params = params.append('pageNo',data.pageNo);
    return this.http.post(APIConstants.getScannedSoftwareList, data);
  }

  getSuiteSoftwareList(data): Observable<any> {

    let params = new HttpParams();
    params = params.append('SoftwareSuiteID', data.SoftwareSuiteID);
    params = params.append('CompanyId', data.CompanyId);
    params = params.append('GroupID', data.GroupID);
    params = params.append('searchManufacturer', data.searchManufacturer);
    params = params.append('seaarchSoftwareType', data.seaarchSoftwareType);
    params = params.append('pageSize', data.pageSize);
    params = params.append('pageNo', data.pageNo);
    return this.http.get(APIConstants.getSuiteSoftwareList, { params: params });
  }
  insertUpdateNewSoftwareSuite(softwareData): Observable<any> {

    let formData = new FormData();
    formData.append('id', softwareData.id);
    formData.append('SoftwareName', softwareData.SoftwareName);
    formData.append('SoftwareVersion', softwareData.SoftwareVersion);
    formData.append('SoftwareTypeID', softwareData.SoftwareTypeID);
    formData.append('SoftwareCategoryID', softwareData.SoftwareCategoryID);
    formData.append('ManufacturerID', softwareData.ManufacturerID);
    //formData.append('Cost',softwareData.Cost);
    formData.append('Description', softwareData.Description);
    formData.append('CompanyId', softwareData.CompanyId);
    formData.append('GroupId', softwareData.GroupId);
    formData.append('insert_suitecomponentsoftware', softwareData.SuiteComponentSoftware);
    //formData.append('LicenseAgreementID',softwareData.LicenseAgreementID);
    softwareData.Images.forEach(img => formData.append('Image', img));
    return this.http.post(APIConstants.insertUpdateNewSoftwareSuite, formData)
  }
  getLicenseType(): Observable<any> {
    let params = new HttpParams();
    //params = params.append('ManufacturerID', "0");
    return this.http.get(APIConstants.getLicenseType, { params: params });
  }
  getLicensePurchased(): Observable<any> {
    return this.http.get(APIConstants.getLicensePurchased);
  }
  getSoftwareVendor(): Observable<any> {
    return this.http.get(APIConstants.getSoftwareVendor);
  }
  getLicenseOption(LicenseTypeID): Observable<any> {
    let params = new HttpParams();
    params = params.append('LicenseTypeID', LicenseTypeID);
    return this.http.get(APIConstants.getLicenseOption, { params: params });
  }
  deleteSuiteSoftware(data): Observable<any> {
    let formData = new FormData();
    let params = new HttpParams();
    params = params.append('id', data.ID);
    params = params.append('CompanyId', data.CompanyId);
    params = params.append('LocationId', data.LocationId);
    params = params.append('GroupID', data.GroupID);
    return this.http.post(APIConstants.deleteSuiteSoftware, formData, { params: params });
  }
  getSoftwareSuiteList(data): Observable<any> {

    // let params = new HttpParams();
    // params = params.append('SoftwareSuiteID',data.SoftwareSuiteID);
    // params = params.append('CompanyId',data.CompanyId);
    // params = params.append('GroupID',data.GroupID);
    // params = params.append('searchManufacturer',data.searchManufacturer);
    // params = params.append('searchSoftwareType',data.searchSoftwareType);
    // params = params.append('searchSoftwareSuite',data.searchSoftwareSuite);
    // params = params.append('searchbyComplianceType',data.searchbyComplianceType);
    // params = params.append('searchlist',data.searchlist);
    // params = params.append('pageSize',data.pageSize);
    // params = params.append('pageNo',data.pageNo);
    return this.http.post(APIConstants.getSoftwareSuiteList, data);
  }
  getSoftwareSuite(optionId, ManufacturerID): Observable<any> {
    let params = new HttpParams();
    params = params.append('option', optionId);
    params = params.append('ManufacturerID', ManufacturerID);
    return this.http.get(APIConstants.getSoftwareSuite, { params: params });
  }
  getmanagedsoftware(Mid): Observable<any> {
    let params = new HttpParams();
    params = params.append('ManufacturerID', Mid);
    return this.http.get(APIConstants.getmanagedsoftware, { params: params });
  }
  insertSoftwareLicense(element): Observable<any> {

    let formData = new FormData();
    formData.append('ID', element.ID);
    formData.append('ManufacturerID', element.ManufacturerID);
    formData.append('SoftwareID', element.SoftwareID);
    formData.append('AcquisitionDate', element.AcquisitionDate);   
    formData.append('ExpiryDate', element.ExpiryDate);
    formData.append('LicenseTypeID', element.LicenseTypeID);
    formData.append('PurchaseCost', element.PurchaseCost);   
    formData.append('PurchasedFor', element.PurchasedFor);    
    formData.append('VendorID', element.VendorID);
    formData.append('Description', element.Description);   
    formData.append('LicenseKeys', element.LicenseKeys);
    formData.append('insert_SoftwareLicenseFields', element.insert_SoftwareLicenseFields);
    formData.append('CreatedBy', element.CreatedBy);
    formData.append('LastUpdatedBy', element.LastUpdatedBy);

    // formData.append('SoftwareSuiteID', element.SoftwareSuiteID);
    // formData.append('insert_downgraderights', element.insert_downgraderights);
    // formData.append('LicenseType', element.LicenseType);

    return this.http.post(APIConstants.insertSoftwareLicense, formData)
  }

  getSoftwareLicenseList(data): Observable<any> {

    let params = new HttpParams();
    params = params.append('LicenseAgreementDetailID', data.LicenseAgreementDetailID);
    params = params.append('CompanyID', data.CompanyId);
    params = params.append('GroupID', data.GroupID);
    params = params.append('searchManufacturer', data.searchManufacturer);
    params = params.append('searchSoftware', data.searchSoftware);
    params = params.append('searchLicenseType', data.searchLicenseType);
    params = params.append('searchLicenseOption', data.searchLicenseOption);
    params = params.append('pageSize', data.pageSize);
    params = params.append('pageNo', data.pageNo);
    return this.http.get(APIConstants.getSoftwareLicenseList, { params: params });
  }
  getSoftwareDetails(data): Observable<any> {

    let params = new HttpParams();
    params = params.append('Softwareid', data.Softwareid);
    params = params.append('CompanyId', data.CompanyId);
    params = params.append('GroupID', data.GroupID);
    return this.http.get(APIConstants.getSoftwareDetails, { params: params });
  }
  deleteSoftwareLicense(id): Observable<any> {
    let formData = new FormData();
    let params = new HttpParams();
    params = params.append('id', id);
    return this.http.post(APIConstants.deleteSoftwareLicense, formData, { params: params });
  }
  getSoftwareInstallationdetails(data): Observable<any> {

    let params = new HttpParams();
    params = params.append('option', data.option);
    params = params.append('SoftwareId', data.SoftwareId);
    params = params.append('CompanyId', data.CompanyId);
    params = params.append('GroupID', data.GroupID);
    return this.http.get(APIConstants.getSoftwareInstallationdetails, { params: params });
  }

  insertSoftwareLicenseType(data): Observable<any> {

    let params = new HttpParams();
    params = params.append('Name', data.LicenseType);
    params = params.append('LicenseTypeOptionsMapID', data.LicenseTypeOptionsMapID);

    let formData = new FormData();

    return this.http.post(APIConstants.insertSoftwareLicenseType, formData, { params: params });
  }
  getDowngradeRightsDetails(data): Observable<any> {

    let params = new HttpParams();
    params = params.append('LicenseID', data.LicenseID);
    params = params.append('CompanyId', data.CompanyId);
    params = params.append('GroupID', data.GroupID);
    return this.http.get(APIConstants.getDowngradeRightsDetails, { params: params });
  }

  modifyaction(data): Observable<any> {
    let params = new HttpParams();
    params = params.append('SoftwareId', data.SoftwareId);
    params = params.append('ManufacturerID', data.ManufacturerID);
    params = params.append('SoftwareCatId', data.SoftwareCatId);

    let formData = new FormData();

    return this.http.post(APIConstants.modifyaction, formData, { params: params });
  }

  movetoaction(data): Observable<any> {
    let params = new HttpParams();
    params = params.append('SoftwareId', data.SoftwareId);
    params = params.append('SoftwareTypeId', data.SoftwareTypeId);

    let formData = new FormData();
    return this.http.post(APIConstants.movetoaction, formData, { params: params });
  }

  getsoftwarecompliancetype(): Observable<any> {

    return this.http.get(APIConstants.getsoftwarecompliancetype);
  }

  getunmanagedsoftware(Mid): Observable<any> {
    let params = new HttpParams();
    params = params.append('ManufacturerID', Mid);
    return this.http.get(APIConstants.getunmanagedsoftware, { params: params });
  }
  updatemanagedsoftware(SoftwareId): Observable<any> {
    let params = new HttpParams();
    params = params.append('SoftwareId', SoftwareId);
    return this.http.get(APIConstants.updatemanagedsoftware, { params: params });
  }

  updatesoftware(softwareData): Observable<any> {

    let formData = new FormData();
    formData.append('id', softwareData.id);
    formData.append('SoftwareName', softwareData.SoftwareName);
    formData.append('SoftwareVersion', softwareData.SoftwareVersion);
    formData.append('SoftwareTypeID', softwareData.SoftwareTypeID);
    formData.append('SoftwareCategoryID', softwareData.SoftwareCategoryID);
    formData.append('ManufacturerID', softwareData.ManufacturerID);
    formData.append('Description', softwareData.Description);
    formData.append('CompanyId', softwareData.CompanyId);
    formData.append('GroupId', softwareData.GroupId);
    formData.append('SoftwareSuiteID', softwareData.SoftwareSuiteID);
    //formData.append('RoleID', softwareData.RoleID);
    return this.http.post(APIConstants.updatesoftware, formData)
  }

  getSoftwarePackageDetails(data): Observable<any> {

    let params = new HttpParams();
    params = params.append('Softwareid', data.Softwareid);
    params = params.append('CompanyId', data.CompanyId);
    params = params.append('GroupID', data.GroupID);
    return this.http.get(APIConstants.getSoftwareDetails, { params: params });
  }
  SuiteComponentSoftwareMaster(SoftwaresuiteID): Observable<any> {

    let params = new HttpParams();
    params = params.append('SoftwaresuiteID', SoftwaresuiteID);
    return this.http.get(APIConstants.SuiteComponentSoftwareMaster, { params: params });
  }

  unmappedassets(prefarid): Observable<any> {
    let formData = new FormData();
    let params = new HttpParams();
    params = params.append('prefarid', prefarid);
    return this.http.post(APIConstants.unmappedassets, formData, { params: params });
  }

  getAssetsdetails(data): Observable<any> {

    let params = new HttpParams();
    params = params.append('companyid', data.companyid);
    params = params.append('SearchBy', data.SearchBy);
    params = params.append('searchtext', data.searchtext);
    params = params.append('pageSize', data.pageSize);
    params = params.append('pageNo', data.pageNo);
    return this.http.get(APIConstants.getAssetsdetails, { params: params });
  }

  getautomatchassets(Data): Observable<any> {

    // let formData = new FormData();
    // formData.append('option',Data.option);
    // formData.append('CompanyID',Data.CompanyID);
    // formData.append('UserID',Data.UserID);

    return this.http.post(APIConstants.getautomatchassets, Data)
  }

  getautomatchassetshow(Data): Observable<any> {

    let params = new HttpParams();
    params = params.append('option', Data.option);
    params = params.append('CompanyID', Data.CompanyID);

    return this.http.get(APIConstants.getautomatchassetshow, { params: params })
  }

  manuallymapassets(Data): Observable<any> {

    let formData = new FormData();
    formData.append('PreFarId', Data.PreFarId);
    formData.append('NetworkInventoryID', Data.NetworkInventoryID);
    formData.append('CompanyId', Data.CompanyId);
    formData.append('GroupID', Data.GroupID);
    formData.append('UserID', Data.UserID);

    return this.http.post(APIConstants.manuallymapassets, formData)
  }

  getpcsoftwaredetails(Data): Observable<any> {

    let params = new HttpParams();
    params = params.append('NetworkScanId', Data.NetworkScanId);
    params = params.append('pageSize', Data.pageSize);
    params = params.append('pageNo', Data.pageNo);

    return this.http.get(APIConstants.getpcsoftwaredetails, { params: params })
  }

  getTrackby(): Observable<any> {
    return this.http.get(APIConstants.getTrackby);
  }

  getInstallationsallowed(TrackID): Observable<any> {
    let params = new HttpParams();
    params = params.append('TrackID', TrackID);
    return this.http.get(APIConstants.getInstallationsallowed , { params: params });
  }
  getsoftwarelicenseoption(Data): Observable<any> {

    let params = new HttpParams();
    params = params.append('trackbyID', Data.trackbyID);
    params = params.append('installationsID', Data.installationsID);

    return this.http.get(APIConstants.getsoftwarelicenseoption, { params: params })
  }

  getLicenseField(LicenseTypeOptionsMapID): Observable<any> {
    let params = new HttpParams();
    params = params.append('LicenseTypeOptionsMapID', LicenseTypeOptionsMapID);
    return this.http.get(APIConstants.getLicenseField, { params: params });
  }
  getFieldMaster(FieldMasterID): Observable<any> {
    let params = new HttpParams();
    params = params.append('FieldMasterID', FieldMasterID);
    return this.http.get(APIConstants.getFieldMaster, { params: params });
  }
  getRoleList(): Observable<any> {
    return this.http.get(APIConstants.getRoleList);
  }
}