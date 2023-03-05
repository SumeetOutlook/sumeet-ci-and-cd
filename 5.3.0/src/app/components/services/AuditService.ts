import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APIConstants } from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';
import { map, catchError, delay } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuditService {

  constructor(private http: HttpClient) { }

  GetAdditionalType(): Observable<any> {
    debugger
    return this.http.get(APIConstants.GetAdditionalType);
  }

  GetNewAddtionalAssetDetailsListPartOfProject(assetDetails) {
    debugger;

    let body = JSON.stringify(assetDetails);
    let params = new HttpParams();
    params = params.append('assetDetails', body);
    // const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.get<any>(APIConstants.GetAdditionalAssetListGridData, { params: params })
      .pipe(map(data => {
        if (!data) {
          return null;
        }
        if (data != null) {
          return data;
        }
      }),
      );
  }


  GetVerificationProjectListforInventoryReport(companyIds, locationIds, projecttype) {
    debugger
    let params = new HttpParams();
    params = params.append('companyIds', companyIds);
    params = params.append('locationIds', locationIds);
    params = params.append('projecttype', projecttype);
    return this.http.get(APIConstants.GetVerificationProjectListforInventoryReport, { params: params })
  }
  
  getVerificationProgress(companyId):Observable<any>{
    let params = new HttpParams();
    params = params.append('companyId',companyId);
    return this.http.get(APIConstants.GETVERIFICATIONPROGRESS, {params: params})
  }
 
  GetVerificationProjectListforInventoryReportSelfCert(companyIds, locationIds, projecttype): Observable<any> {
    debugger
    let params = new HttpParams();
    params = params.append('companyIds', companyIds);
    params = params.append('locationIds', locationIds);
    params = params.append('projecttype', projecttype);
    return this.http.get(APIConstants.GetVerificationProjectListforInventoryReportSelfCert, { params: params })
  }
  getProjectName(companyId): Observable<any> {
    let params = new HttpParams();
    params = params.append('companyId', companyId);
    return this.http.get(APIConstants.GETPROJECTNAME, { params: params })
  }

  getSelfCertProjectName(companyId): Observable<any> {
    let params = new HttpParams();
    params = params.append('companyId', companyId);
    return this.http.get(APIConstants.GETSELFCERTPROJECTNAME, { params: params })
  }
  CheckIsZeroValueBlockCreated(companyId): Observable<any> {
    let params = new HttpParams();
    params = params.append('companyId', companyId);
    return this.http.get(APIConstants.CHECKISZEROVALUEBLOCKCREATED, { params: params })
  }
  CreateMultipleVerificationProjectJSON(verificationPorject): Observable<any> {

    return this.http.post(APIConstants.CREATEMULTIPLEVERIFICATIONPROJECTJSON, verificationPorject)
  }
  GetBlockOwnerListForCreateInventoryProject(companyId, groupId, locationId, isThirdParty, isZeroValue): Observable<any> {
    let params = new HttpParams();
    params = params.append('companyId', companyId);
    params = params.append('groupId', groupId);
    params = params.append('locationId', locationId);
    params = params.append('isThirdParty', isThirdParty);
    params = params.append('isZeroValue', isZeroValue);
    return this.http.get(APIConstants.GETBLOCKOWNERLISTFORCREATEINVENTORYPROJECT, { params: params })
  }
  GetBlockWithMappingDetailsForDisplay(companyId, groupId, locationId, isThirdParty, isZeroValue, isGRNAssets): Observable<any> {
    let params = new HttpParams();
    params = params.append('companyId', companyId);
    params = params.append('groupId', groupId);
    params = params.append('locationId', locationId);
    params = params.append('isThirdParty', isThirdParty);
    params = params.append('isZeroValue', isZeroValue);
    params = params.append('isGRNAssets', isGRNAssets);
    return this.http.get(APIConstants.GETBLOCKWITHMAPPINGDETAILSFORDISPLAY, { params: params })
  }

  GetInventoryProjectListForReconcilition(assetDetails): Observable<any> {
    debugger;
    return this.http.post(APIConstants.GETINVENTORYPROJECTLISTFORRECONCILITION, assetDetails)
  }
  GetBlockwiseProjectList(assetDetails): Observable<any> {
    let params = new HttpParams();
    params = params.append('companyId', assetDetails.companyId);
    params = params.append('locationId', assetDetails.locationId);
    params = params.append('projectName', assetDetails.projectName);
    params = params.append('projectType', assetDetails.projectType);
    return this.http.post(APIConstants.GETBLOCKWISEPROJECTLIST, assetDetails)
  }

  CompleteProject(assetDetails): Observable<any> {
    return this.http.post(APIConstants.COMPLETEPROJECT, assetDetails)
  }

  GetBlockwiseProjectListJson(assetDetails): Observable<any> {
    let params = new HttpParams();
    params = params.append('companyId', assetDetails.companyId);
    params = params.append('locationId', assetDetails.locationId);
    params = params.append('projectName', assetDetails.projectName);
    params = params.append('projectType', assetDetails.projectType);  
    params = params.append('userId', assetDetails.userId);
    params = params.append('CategoryList', assetDetails.CategoryList);
    return this.http.get(APIConstants.GETBLOCKWISEPROJECTLISTJSON, { params: params })
  }
  CompleteProjectBlockwise(assetDetails): Observable<any> {
    let params = new HttpParams();
    params = params.append('companyId', assetDetails.companyId);
    params = params.append('locationId', assetDetails.locationId);
    params = params.append('blockId', assetDetails.blockId);
    params = params.append('projectName', assetDetails.projectName);
    params = params.append('projectType', assetDetails.projectType);
    params = params.append('modifiedBy', assetDetails.modifiedBy);
    params = params.append('Id', assetDetails.Id);
    params = params.append('locationType', assetDetails.locationType);
    return this.http.get(APIConstants.COMPLETEPROJECTBLOCKWISE, { params: params })
  }

  SetRevertInTPBlockIdWise(assetDetails): Observable<any> {
    let params = new HttpParams();
    params = params.append('pkId', assetDetails.pkId);
    params = params.append('blockId', assetDetails.blockId);
    params = params.append('Id', assetDetails.Id);
    params = params.append('locationType', assetDetails.locationType);
    return this.http.get(APIConstants.SETREVERTINTPBLOCKIDWISE, { params: params })
  }
  SetRevertInTPBlock(assetDetails): Observable<any> {
    // let params = new HttpParams();
    // params = params.append('pkId', pkId);
    // return this.http.get(APIConstants.SETREVERTINTPBLOCK, { params: params })
    return this.http.post(APIConstants.SETREVERTINTPBLOCK, assetDetails)
  }
  SetStatusToAssetList(assetDetails): Observable<any> {
    debugger;
    // let params = new HttpParams();    
    // params = params.append('CompanyId', assetDetails.CompanyId);
    // params = params.append('projectId', assetDetails.projectId);
    // params = params.append('projectType', assetDetails.projectType);
    // params = params.append('assetIdLists', assetDetails.assetIdLists);
    // params = params.append('status', assetDetails.status);
    // params = params.append('modifiedBy', assetDetails.modifiedBy);
    // params = params.append('LocationId', assetDetails.LocationId);
    // params = params.append('Projectname', assetDetails.Projectname);
    // return this.http.post(APIConstants.SETSTATUSTOASSETLIST, '', { params: params })
    let formData = new FormData();
    const blobOverrides = new Blob([JSON.stringify(assetDetails)], {
        type: 'application/json',
      });      
    formData.append('data', blobOverrides); 
    return this.http.post(APIConstants.SETSTATUSTOASSETLIST, formData)
  }

  getMissingNoteInList(): Observable<any> {
    return this.http.get(APIConstants.GETMISSINGNOTEINLIST)
  }

  setMissingStatus(assetDetails): Observable<any> {
    return this.http.post(APIConstants.SETMISSINGSTATUS, assetDetails)
  }
  PostFiles(assetDetails): Observable<any> {
    debugger;
    let params = new HttpParams();
    params = params.append('fileName', assetDetails.fileName);
    params = params.append('companyId', assetDetails.companyId);
    params = params.append('fileType', assetDetails.fileType);

    let formData = new FormData();

    for (var i = 0; i < assetDetails.fileList.length; i++) {
      formData.append("file[]", assetDetails.fileList[i]);
    }

    return this.http.post(APIConstants.POSTFILES, formData, { params: params })
  }

  setUploadMissingFile(assetDetails): Observable<any> {
    return this.http.post(APIConstants.SETUPLOADMISSINGFILE, assetDetails)
  }
  GetDamagedNotInUseDetailsBlockWise(assetDetails): Observable<any> {
    let params = new HttpParams();    
    params = params.append('companyId', assetDetails.companyId);
    params = params.append('locationId', assetDetails.locationId);
    params = params.append('assetStage', assetDetails.assetStage);
    params = params.append('assetStatus', assetDetails.assetStatus);
    params = params.append('TPID', assetDetails.TPID);
    params = params.append('projectName', assetDetails.projectName);
    return this.http.get(APIConstants.GETDAMAGEDNOTINUSEDETAILSBLOCKWISE, { params: params })
  }

  CheckForSendMailToOWNER(assetDetails): Observable<any> {
    let params = new HttpParams();    
    params = params.append('companyId', assetDetails.companyId);
    params = params.append('locationId', assetDetails.locationId);
    params = params.append('assetStage', assetDetails.assetStage);
    params = params.append('assetStatus', assetDetails.assetStatus);
    params = params.append('TPID', assetDetails.TPID);
    params = params.append('projectName', assetDetails.projectName);
    return this.http.get(APIConstants.CheckForSendMailToOwner, { params: params })
  }

  GetCloseProjectData(companyId):Observable<any>{
    let params = new HttpParams();
    params = params.append('companyId',companyId);
    return this.http.get(APIConstants.GETCLOSEPROJECTDATA, {params: params})
  }

  CloseProject(data): Observable<any> {
    return this.http.post(APIConstants.CLOSEPROJECT, data)
  }

  DeleteProject(data): Observable<any> {
    return this.http.post(APIConstants.DELETEPROJECT, data)
  }


  GetMissingOrDamageAssetList(assetDetails): Observable<any> {
    return this.http.post(APIConstants.GETMISSINGORDAMAGEASSETLISTBYCOMIDLOCIDPROJECTNAMEUSERID, assetDetails)
  }

  GetProjectDetailsByProjectId(companyId, ProjectName):Observable<any>{
    let params = new HttpParams();
    params = params.append('companyId',companyId);
    params = params.append('projectName',ProjectName);
    return this.http.get(APIConstants.OPENPROJECTDETAILS, {params: params})
  }
  GetPrePrintAdditionalListForMapping(assetDetails): Observable<any> {
    return this.http.post(APIConstants.GetPrePrintAdditionalListForMapping, assetDetails)
  }
  getValuesToCompareForMapPrePrintedAdditionalAsset(assetId, PrefarId):Observable<any>{
    let params = new HttpParams();
    params = params.append('assetId',assetId);
    params = params.append('PrefarId',PrefarId);
    return this.http.get(APIConstants.GETVALUESTOCOMPAREFORMAPPREPRINTEDADDITIONALASSET, {params: params})
  }
  GetPrePrintedAdditionalAssetList(assetDetails): Observable<any> {
    return this.http.post(APIConstants.GETPREPRINTEDADDITIONALASSETLIST, assetDetails)
  }
  GetChangedAssetDetailsList(assetDetails): Observable<any> {
    return this.http.post(APIConstants.GETCHANGEDASSETDETAILSLIST, assetDetails)
  }
  GetByIdForChangeCase(assetDetails):Observable<any>{
    let params = new HttpParams();
    params = params.append('id',assetDetails.PrefarId);
    params = params.append('resolveTPID',assetDetails.projectId);
    params = params.append('locationId',assetDetails.locationId);
    params = params.append('CompanyId',assetDetails.CompanyId);
    return this.http.get(APIConstants.GETBYIDFORCHANGECASE, {params: params})
  }
  GetAssetForPotentialMatchJson(assetDetails):Observable<any>{
    let params = new HttpParams();
    params = params.append('potentialMatchby',assetDetails.potentialMatchby);
    params = params.append('companyId',assetDetails.companyId);
    params = params.append('groupId',assetDetails.groupId);
    params = params.append('locationId',assetDetails.locationId);
    params = params.append('blockId',assetDetails.blockId);
    params = params.append('pageNo',assetDetails.pageNo);
    params = params.append('pageSize',assetDetails.pageSize);
    params = params.append('searchText',assetDetails.searchText);
    params = params.append('isSearch',assetDetails.isSearch);
    params = params.append('ispotential',assetDetails.ispotential);
    return this.http.get(APIConstants.GETASSETFORPOTENTIALMATCHJSON, {params: params})
  }
  DeleteAdditionalAssets(assetDetails): Observable<any> {
    return this.http.post(APIConstants.DELETEADDITIONALASSETS, assetDetails)
  }
   GetAllOptionsByPtype(ptype) : Observable<any> {
    let params = new HttpParams();
    params = params.append('ptype', ptype);
    return this.http.get(APIConstants.GetAllOptionsByPtype, { params: params })
     
  }
  GetAssetsForBackToScruitiny(assetsDetails) : Observable<any> {
    return this.http.post(APIConstants.GetAssetsForBackToScruitiny, assetsDetails)
      
  }
  RejectApprove(objAssetsParameterDto) : Observable<any>{   
    return this.http.post(APIConstants.RejectApprove, objAssetsParameterDto)
     
  }
  MultipalApproveTagging(approveTaggingDetails) : Observable<any> {
    return this.http.post(APIConstants.MultipalApproveTaggingDetails, approveTaggingDetails )
      
  }
  ApproveTaggingDetails(approveTaggingDetails) : Observable<any>{
    return this.http.post(APIConstants.ApproveTaggingDetails,approveTaggingDetails)
      
  }
  GetnewModifiedAssetListForReview(PrefarId, ProjectType) : Observable<any> {

    let params = new HttpParams();
    params = params.append('PrefarId', PrefarId);
    params = params.append('ProjectType', ProjectType);

    return this.http.get(APIConstants.GetnewModifiedAssetListForReview, { params: params })
     

  }
  UpdateRejectCommentOnPreprintAdditional(AssetsParameterDto): Observable<any>{
    return this.http.post(APIConstants.UPDATEREJECTCOMMENTONPREPRINTADDITIONAL, AssetsParameterDto)
  }
}
