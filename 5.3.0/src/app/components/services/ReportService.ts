import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APIConstants } from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';
import { map, catchError, delay } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class ReportService {
    constructor(private http: HttpClient) { }

    getNonVerifiableAssets(parameters): Observable<any> {
        return this.http.post(APIConstants.NONVERIFIABLE, parameters)
    }

    getTaggingCompany(groupId, regionId): Observable<any> {
        let params = new HttpParams();
        params = params.append('groupId', groupId);
        params = params.append('regionId', regionId);
        return this.http.post(APIConstants.TAGGINGCOMPANY, { params: params })
    }

    getTaggingRegion(groupId): Observable<any> {
        let params = new HttpParams();
        params = params.append('groupId', groupId);
        return this.http.get(APIConstants.TAGGINGREPORT, { params: params })
    }

    getTaggingSBU(companyId): Observable<any> {
        debugger;
        let params = new HttpParams();
        params = params.append('companyId', companyId);
        return this.http.get(APIConstants.TAGGINGSBU, { params: params })
    }

    getTaggingPlant(companyId): Observable<any> {
        let params = new HttpParams();
        params = params.append('companyId', companyId);
        return this.http.get(APIConstants.TAGGINGPLANT, { params: params })
    }

    getTaggingCategory(companyId): Observable<any> {
        let params = new HttpParams();
        params = params.append('companyId', companyId);
        return this.http.get(APIConstants.TAGGINGCATEGORY, { params: params })
    }

    getTaggingClass(companyId): Observable<any> {
        let params = new HttpParams();
        params = params.append('companyId', companyId);
        return this.http.get(APIConstants.TAGGINGASSETCLASS, { params: params })
    }

    getTaggingType(companyId): Observable<any> {
        let params = new HttpParams();
        params = params.append('companyId', companyId);
        return this.http.get(APIConstants.TAGGINGTYPE, { params: params })
    }

    getTaggingSubType(companyId, typeId): Observable<any> {
        let params = new HttpParams();
        params = params.append('companyId', companyId);
        params = params.append('typeId', typeId);
        return this.http.get(APIConstants.TAGGINGSUBTYPE, { params: params })
    }

    getTaggingCurrency(companyId, GroupId): Observable<any> {
        let params = new HttpParams();
        params = params.append('companyId', companyId);
        params = params.append('GroupId', GroupId);
        return this.http.get(APIConstants.TAGGINGCURRENCY, { params: params })
    }
    GetAllRetiredIdForReport(CompanyList, LOCATIONLIST, userId, IsGroupRegion,sbuIdList): Observable<any> {

        let params = new HttpParams();
        params = params.append('CompanyIds', CompanyList);
        params = params.append('locationIdList', LOCATIONLIST);
        params = params.append('userid', userId);
        params = params.append('isGroupRegion', IsGroupRegion);
        params = params.append('sbuIdList', sbuIdList);
        return this.http.get(APIConstants.GetAllRetiredIdForReport, { params: params })
    }


    GetTransferIdsForTransferReport(CompanyList, LOCATIONLIST, userId, IsGroupRegion,sbuIdList): Observable<any> {

        let params = new HttpParams();
        params = params.append('CompanyIds', CompanyList);
        params = params.append('locationIdList', LOCATIONLIST);
        params = params.append('userid', userId);
        params = params.append('isGroupRegion', IsGroupRegion);
        params = params.append('sbuIdList',sbuIdList)
        return this.http.get(APIConstants.GETTRANSFERIDSFORTARNSFERREPORT, { params: params })
    }

    GetTransferInProcessData(data): Observable<any> {

        return this.http.post(APIConstants.GETTRANSFERINPROCESSDATA, data)
    }

    GetTransferInProcessData1(data): Observable<any> {

        return this.http.post(APIConstants.GETTRANSFERINPROCESSDATA1, data)
    }

    GetAssetRegisterReportBySp(parameters): Observable<any> {
        debugger;
        return this.http.post(APIConstants.GETASSETREGISTERREPORTBYSP, parameters)
    }

    GETASSETREGISTERREPORTBYSP(parameters) {
        debugger;

        let body = JSON.stringify(parameters);

        const headers = new HttpHeaders().set('content-type', 'application/json');
        return this.http.post<any>(APIConstants.GETASSETREGISTERREPORTBYSP, body, { headers })
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
    GetInventoryReport(dto): Observable<any> {
        debugger
        return this.http.post(APIConstants.GetInventReport, dto)
    }

    GetAllRetiredIdForDisposalReport(CompanyList, LOCATIONLIST, UserId, IsGroupRegion,sbuIdList): Observable<any> {

        let params = new HttpParams();
        params = params.append('CompanyIds', CompanyList);
        params = params.append('locationIdList', LOCATIONLIST);
        params = params.append('userid', UserId);
        params = params.append('isGroupRegion', IsGroupRegion);
        params = params.append('sbuIdList', sbuIdList);
        return this.http.get(APIConstants.GetAllRetiredIdForDisposalReport, { params: params })
    }

    GetTransferIdsForTransferDispatchedReport(CompanyList, LOCATIONLIST, UserId, IsGroupRegion,sbuIdList): Observable<any> {

        let params = new HttpParams();
        params = params.append('CompanyIds', CompanyList);
        params = params.append('locationIdList', LOCATIONLIST);
        params = params.append('userid', UserId);
        params = params.append('isGroupRegion', IsGroupRegion);
        params = params.append('sbuIdList', sbuIdList);
        return this.http.get(APIConstants.GETTRANSFERIDSFORTARNSFERDispatchedREPORT, { params: params })
    }

    GetReportCount(dto): Observable<any> {
        debugger
        return this.http.post(APIConstants.GETREPORTCOUNT, dto)
    }

    GetATAF(prefarid, Id): Observable<any> {

        let params = new HttpParams();
        params = params.append('prefarId', prefarid);
        params = params.append('id', Id);
        return this.http.get(APIConstants.GETATAF, { params: params })
    }

    GetATF(prefarid, Id): Observable<any> {

        let params = new HttpParams();
        params = params.append('prefarId', prefarid);
        params = params.append('id', Id);
        return this.http.get(APIConstants.GETATF, { params: params })
    }

    GetLocationRightWiseForReport(CompanyId, UserId, IsGroupRegion, SBUlist, moduleId): Observable<any> {

        let params = new HttpParams();
        params = params.append('companyId', CompanyId);
        params = params.append('userId', UserId);
        params = params.append('isGroupRegion', IsGroupRegion);
        params = params.append('sbuList', SBUlist);
        params = params.append('mobuleId', moduleId);
        return this.http.get(APIConstants.LOCATIONRIGHTSWISE, { params: params })
    }

    GetCategoryRightWiseForReport(CompanyId, UserId, LocationIdList, IsGroupRegion,moduleId): Observable<any> {

        let params = new HttpParams();
        params = params.append('companyId', CompanyId);
        params = params.append('userId', UserId);
        params = params.append('locationIdList', LocationIdList);
        params = params.append('isGroupRegion', IsGroupRegion);
        params = params.append('mobuleId', moduleId);
        return this.http.get(APIConstants.CATEGORYRIGHTWISE, { params: params })
    }

    GetCompanysForReport(GroupId, RegionId): Observable<any> {

        let params = new HttpParams();
        params = params.append('groupId', GroupId);
        params = params.append('regionId', RegionId);
        return this.http.get(APIConstants.COMPANYLISTFORREPORT, { params: params })
    }

    GetPhotoForReport(PrefarId, DocumentType): Observable<any> {

        let params = new HttpParams();
        params = params.append('prefarId', PrefarId);
        params = params.append('documentType', DocumentType);
        return this.http.get(APIConstants.GETPHOTOFORREPORT, { params: params })
    }
    GetPhotoForInventoryReport(PrefarId, DocumentType,ProjectName): Observable<any> {

        let params = new HttpParams();
        params = params.append('prefarId', PrefarId);
        params = params.append('documentType', DocumentType);
        params = params.append('ProjectName', ProjectName);
        return this.http.get(APIConstants.GETPHOTOFORINVENTORYREPORT, { params: params })
    }
    GetAssetDataForCreateInventoryProjectBySp(assetDetails): Observable<any> {
        debugger;
        let params = new HttpParams();
        params = params.append('companyId', assetDetails.companyId);
        params = params.append('locationId', assetDetails.locationId);
        params = params.append('zeroValue', assetDetails.zeroValue);
        params = params.append('thirdParty', assetDetails.thirdParty);
        params = params.append('GRNValue', assetDetails.GRNValue);
        params = params.append('isView', assetDetails.isView);
        params = params.append('blockIds', assetDetails.blockIds);
        params = params.append('UserId', assetDetails.UserId);
        params = params.append('Zone', assetDetails.Zone);
        params = params.append('locationList', assetDetails.locationList);
        return this.http.get(APIConstants.GETASSETDATAFORCREATEINVENTORYPROJECTBYSP, { params: params })
    }

    GetAssetDataForCreateInventoryProjectBySpForViewMap(assetDetails): Observable<any> {

        let params = new HttpParams();
        params = params.append('companyId', assetDetails.companyId);
        params = params.append('locationId', assetDetails.locationId);
        params = params.append('zeroValue', assetDetails.zeroValue);
        params = params.append('thirdParty', assetDetails.thirdParty);
        params = params.append('GRNValue', assetDetails.GRNValue);
        params = params.append('isView', assetDetails.isView);
        params = params.append('blockIds', assetDetails.blockIds);
        params = params.append('UserId', assetDetails.UserId);
        params = params.append('Zone', assetDetails.Zone);

        return this.http.get(APIConstants.GETASSETDATAFORCREATEINVENTORYPROJECTBYSPFORVIEWMAP, { params: params })
    }


    GetADF(prefarid): Observable<any> {

        let params = new HttpParams();
        params = params.append('prefarId', prefarid);
        return this.http.get(APIConstants.GETADF, { params: params })
    }


    GetProjectNameForReport(CompanyIds, userId, ProjectType): Observable<any> {

        let params = new HttpParams();
        params = params.append('companyIds', CompanyIds);
        params = params.append('userId', userId);
        params = params.append('projecttype', ProjectType);
        return this.http.get(APIConstants.GETPROJECTNAMEFORREPORT, { params: params })
    }


    GetProjectInventoryReport(dto): Observable<any> {
        debugger;
        return this.http.post(APIConstants.GETINVENTORYREPORT, dto)
    }

    GetAssetDataForCreateInventoryProjectByAPI(assetDetails): Observable<any> {
        debugger
        return this.http.post(APIConstants.GETASSETDATAFORCREATEINVENTORYPROJECTBYAPI, assetDetails)
    }


    GetAllDocumentsPath(PrefarId, DocumentType): Observable<any> {

        let params = new HttpParams();
        params = params.append('prefarId', PrefarId);
        params = params.append('documentType', DocumentType);
        return this.http.get(APIConstants.GETALLDOCUMENTPATH, { params: params })
    }

    GetAllDocumentsPathForIneventoryReport(PrefarId, DocumentType, ProjectName): Observable<any> {

        let params = new HttpParams();
        params = params.append('prefarId', PrefarId);
        params = params.append('documentType', DocumentType);
        params = params.append('ProjectName', ProjectName);
        return this.http.get(APIConstants.GETALLDOCUMENTPATHFORINVENTORYREPORT, { params: params })
    }

    GetDashBoardCount(assetDetails): Observable<any>{
        debugger;
        return this.http.post(APIConstants.GETDASHBOARDCOUNT,assetDetails)
    }  

    GetCountForDashBoardInventoryDueDates(assetDetails): Observable<any>{
        debugger;
        return this.http.post(APIConstants.GETCOUNTFORDASHBOARDINVENTORYDUEDATES,assetDetails)
    }  

    GetEmployeeListForAllocationReport(groupId, companyId): Observable<any> {

        let params = new HttpParams();
        params = params.append('groupId', groupId);
        params = params.append('companyId', companyId);
        return this.http.get(APIConstants.GETEMPLOYEEFORALLOCATIONREPORT, { params: params })
    }


    GetAssetIdListForAllocation(CompanyId, UserId): Observable<any> {

        let params = new HttpParams();
        params = params.append('companyId', CompanyId);
        params = params.append('userId', UserId);
        return this.http.get(APIConstants.GETASSETIDLISTFORALLOCATION, { params: params })
    }

    GetSubAssetIdListForAllocation(CompanyId, assetId): Observable<any> {

        let params = new HttpParams();
        params = params.append('companyId', CompanyId);
        params = params.append('AssetId', assetId);
        return this.http.get(APIConstants.GETSUBASSETIDLISTFORALLOCATION, { params: params })
    }

    GetSplitIdsForAllocation(CompanyId, assetId, subAssetId): Observable<any> {

        let params = new HttpParams();
        params = params.append('companyId', CompanyId);
        params = params.append('AssetId', assetId);
        params = params.append('SAssetId', subAssetId);
        return this.http.get(APIConstants.GETSPLITIDSFORALLOCATION, { params: params })
    }

    GetProjectNameForInventoryReportPeriodWise(CompanyIds, userId, ProjectType, periodString): Observable<any> {

        let params = new HttpParams();
        params = params.append('companyIds', CompanyIds);
        params = params.append('userId', userId);
        params = params.append('projecttype', ProjectType);
        params = params.append('periodString', periodString);
        return this.http.get(APIConstants.GETPROJECTNAMEFORREPORTPeriodWise, { params: params })
    }

    GetLocationRightAndProjectWiseForReport(CompanyId, UserId, IsGroupRegion, SBUlist, moduleId, projectName): Observable<any> {

        let params = new HttpParams();
        params = params.append('companyId', CompanyId);
        params = params.append('userId', UserId);
        params = params.append('isGroupRegion', IsGroupRegion);
        params = params.append('sbuList', SBUlist);
        params = params.append('mobuleId', moduleId);
        params = params.append('ProjectName', projectName);
        return this.http.get(APIConstants.GetLOCATIONSFORREPORTRIGHTANDPROJECTWISE, { params: params })
    }

    GetAssetDataForCreateInventoryProjectByAPILocationWise(assetDetails): Observable<any> {        
        return this.http.post(APIConstants.GETASSETDATAFORCREATEINVENTORYPROJECTBYAPILOCATIONWISE, assetDetails)
    }
    GetAssetDataForCreateInventoryProjectByAPICategoryWise(assetDetails): Observable<any> {        
        return this.http.post(APIConstants.GETASSETDATAFORCREATEINVENTORYPROJECTBYAPICATEGORYWISE, assetDetails)
    }

    GetAllDocumentsPathForTransferReport(PrefarId, DocumentId): Observable<any> {

        let params = new HttpParams();
        params = params.append('prefarId', PrefarId);
        params = params.append('fileId', DocumentId);
        return this.http.get(APIConstants.GetPhysicalDispatchDocumentVIEW, { params: params })
    }

    getDisposalDocument(prefarId,photoId, fileId): Observable<any> {
        let params = new HttpParams();
        params = params.append('prefarId', prefarId);
        params = params.append('photoId', photoId);
        params = params.append('fileId', fileId);
        return this.http.get(APIConstants.DISPOSALDOCUMENTS, { params: params })
    }

    GetAssetDetailsByExcelAndBarcodeByAPILocationWise(assetDetails): Observable<any> {        
        return this.http.post(APIConstants.GetAssetDetailsByExcelAndBarcode, assetDetails)
    }


}