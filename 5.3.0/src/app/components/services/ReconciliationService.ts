import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APIConstants } from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';
import { map, catchError, delay } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class ReconciliationService {
    constructor(private http: HttpClient) { }
    GetDamaged(assetParameterDto): Observable<any> {
        return this.http.post(APIConstants.GETDAMAGENOTINUSE, assetParameterDto)

    }
    GetTransferTypes(): Observable<any> {
        return this.http.get(APIConstants.GETTRANSFERTYPES)
    }

    getCostCenter(GroupId, companyId): Observable<any> {
        let params = new HttpParams();
        params = params.append('GroupId', GroupId);
        params = params.append('companyId', companyId);
        return this.http.get(APIConstants.COSTCENTERLIST, { params: params })
    }

    getRevertLocation(locationId): Observable<any> {
        let params = new HttpParams();
        params = params.append('locId', locationId);
        return this.http.post(APIConstants.LOCATIONUPDATEREVERT, { params: params })
    }

    updateReceiveAsset(assetsDetails) {
        return this.http.post(APIConstants.FINISHUPDATERECEIVE, assetsDetails)
    }

    // getTransferId(assetsDetails): Observable<any>{
    //         return this.http.post(APIConstants.TRANSFERID,assetsDetails)
    // }

    getAssetsUsingTransferId(assetsDetails): Observable<any> {
        return this.http.post(APIConstants.DISPLAYASSETS, assetsDetails);
    }

    getAssetListToInvert(assetsDetails) {
        return this.http.post(APIConstants.REVERTGRTIDASSETS, assetsDetails)
    }

    revertAsset(assetsDetails) {
        return this.http.post(APIConstants.REVERTASSET, assetsDetails)
    }

    getTransferId(assetsDetails) {
        let body = JSON.stringify(assetsDetails);
        
        const headers = new HttpHeaders().set('content-type', 'application/json');
        return this.http.post<any>(APIConstants.TRANSFERID, body, { headers })
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

    GetTransactionIdsForTransitReport(CompanyId, locationId, UserId, TaskId): Observable<any> {
        let params = new HttpParams();
        params = params.append('CompanyId', CompanyId);
        params = params.append('locationId', locationId);
        params = params.append('UserId', UserId);
        params = params.append('TaskId', TaskId);
        return this.http.get(APIConstants.GETTRANSACTIONIDSFORTRANSITREPORT, { params: params })
    }
    CheckTransferRights(locationId, companyId, userId, userRights): Observable<any> {
        let params = new HttpParams();
        params = params.append('locationId', locationId);
        params = params.append('companyId', companyId);
        params = params.append('userId', userId);
        params = params.append('userRights', userRights);
        return this.http.get(APIConstants.CHECKTRANSFERRIGHTS, { params: params })
    }

    CheckRights(locationId, companyId, userId, userRights): Observable<any> {
        let params = new HttpParams();
        params = params.append('locationId', locationId);
        params = params.append('companyId', companyId);
        params = params.append('userId', userId);
        params = params.append('userRights', userRights);
        return this.http.get(APIConstants.CHECKRIGHTS, { params: params })
    }

    GetAssetListToChangeLocation(assetDetails): Observable<any> {
        return this.http.post(APIConstants.GETASSETLISTTOCHANGELOCATION, assetDetails)
    }

    GetAssetForTransfer(assetDetails): Observable<any> {
        return this.http.post(APIConstants.GETASSETFORTRANSFER, assetDetails)
    }
    SetOutwardLocationDetailswithDoc(assetDetails): Observable<any> {
        
        // let params = new HttpParams();
        // params = params.append('excelfile', assetDetails.excelfile);
        // params = params.append('companyId', assetDetails.companyId);
        // params = params.append('locationId', assetDetails.locationId);
        // params = params.append('newLocationId', assetDetails.newLocationId);
        // params = params.append('transitType', assetDetails.transitType);
        // params = params.append('assetList', assetDetails.assetList);
        // params = params.append('modifiedBy', assetDetails.modifiedBy);
        // params = params.append('dateC', assetDetails.dateC);
        // params = params.append('TransferComment', assetDetails.TransferComment);
        // params = params.append('RevertDate', assetDetails.RevertDate);
        // params = params.append('ProposedTransferDate', assetDetails.ProposedTransferDate);
        // params = params.append('transferredPhoto', assetDetails.transferredPhoto);
        // params = params.append('transferredPhotoId', assetDetails.transferredPhotoId);
        //return this.http.post(APIConstants.SETOUTWARDLOCATIONDETAILS, formData, { params: params })        

        let formData = new FormData();
        const blobOverrides = new Blob([JSON.stringify(assetDetails.assetsDetails)], {
            type: 'application/json',
          });      
        formData.append('data', blobOverrides); 
        for (var i = 0; i < assetDetails.fileList.length; i++) {
            formData.append("file[]", assetDetails.fileList[i]);
        }

        return this.http.post(APIConstants.SETOUTWARDLOCATIONDETAILS, formData)
    }

    SetOutwardLocationDetailsCostcenterStorageLocation(assetDetails): Observable<any> {
        return this.http.post(APIConstants.SETOUTWARDLOCATIONDETAILSCOSTCENTERSTORAGELOCATION, assetDetails)
    }

    GetTransactionIds(assetDetails): Observable<any> {
        return this.http.post(APIConstants.GETTRANSACTIONIDS, assetDetails)
    }
    GetAssetListForTransferApproval(assetDetails): Observable<any> {
        return this.http.post(APIConstants.GETASSETLISTFORTRANSFERAPPROVAL, assetDetails)
    }

    GetMultipleAssetsForTransferApproval(CompanyId, AssetList, TransferId, LocationId, approvalLevel): Observable<any> {
        // let params = new HttpParams();
        // params = params.append('CompanyId', CompanyId);
        // params = params.append('AssetList', AssetList);
        // params = params.append('TransferId', TransferId);
        // params = params.append('LocationId', LocationId);
        // params = params.append('approvalLevel', approvalLevel);
        
        var assetDetails = {
            CompanyId : CompanyId,
            AssetList : AssetList,
            TransferId : TransferId,
            LocationId : LocationId,
            ApprovalLevel : approvalLevel
        }
        let formData = new FormData();
        const blobOverrides = new Blob([JSON.stringify(assetDetails)], {
            type: 'application/json',
          });      
        formData.append('data', blobOverrides);    

        return this.http.post(APIConstants.GETMULTIPLEASSETSFORTRANSFERAPPROVAL, formData)
    }

    GetTransferIdsForPhysicalTransfer(assetDetails): Observable<any> {
        
        let params = new HttpParams();
        return this.http.post(APIConstants.GETTRANSACTIONIDSFORPHYSICALTRANSFER, assetDetails)
    }
    GetAssetForPhysicalTransfer(assetDetails): Observable<any> {
        

        return this.http.post(APIConstants.GETASSETFORPHYSICALTRANSFER, assetDetails)
    }
    GetPhysicalTransferAssetList(assetDetails): Observable<any> {
        
        let params = new HttpParams();
        params = params.append('CompanyId', assetDetails.CompanyId);
        params = params.append('LocationId', assetDetails.LocationId);
        params = params.append('pageNo', assetDetails.pageNo);
        params = params.append('pageSize', assetDetails.pageSize);
        params = params.append('SearchText', assetDetails.SearchText);
        params = params.append('IsSearch', assetDetails.IsSearch);
        params = params.append('UserId', assetDetails.UserId);
        params = params.append('BlockId', assetDetails.BlockId);
        params = params.append('AssetList', assetDetails.AssetList);
        params = params.append('TransferType', assetDetails.TransferType);

        return this.http.get(APIConstants.GETPHYSICALTRANSFERASSETLIST, { params: params })
    }

    SavePhysicalTransferAsset(assetDetails): Observable<any> {
        
        let params = new HttpParams();
        params = params.append('excelfile', assetDetails.excelfile);
        params = params.append('CompanyId', assetDetails.CompanyId);
        params = params.append('AssetList', assetDetails.AssetList);
        params = params.append('LastModifiedBy', assetDetails.LastModifiedBy);
        params = params.append('TransferType', assetDetails.TransferType);
        params = params.append('DeliveryMode', assetDetails.DeliveryMode);
        params = params.append('ModeRecipient', assetDetails.ModeRecipient);
        params = params.append('ModeAgency', assetDetails.ModeAgency);
        params = params.append('ModeNumber', assetDetails.ModeNumber);
        params = params.append('DispatchDate', assetDetails.DispatchDate);
        params = params.append('ReceiptDate', assetDetails.ReceiptDate);
        params = params.append('ModeDeliveryBy', assetDetails.ModeDeliveryBy);
        params = params.append('ModeDeliveryTo', assetDetails.ModeDeliveryTo);
        params = params.append('TransferDocument', assetDetails.TransferDocument);
        params = params.append('DeliveryDate', assetDetails.DeliveryDate);
        params = params.append('GroupId', assetDetails.GroupId);
        let formData = new FormData();
        //formData.append('uploadFile', assetDetails.fileList[0]);
        for (var i = 0; i < assetDetails.fileList.length; i++) {
            formData.append("file[]", assetDetails.fileList[i]);
        }

        return this.http.post(APIConstants.SAVEPHYSICALTRANSFERASSET, formData, { params: params })
    }

    GetAllPhysicalDisposalRetiredAssetId(assetDetails): Observable<any> {
        
        // let params = new HttpParams();
        // params = params.append('CompanyId', CompanyId);
        // params = params.append('LocationId', LocationId);
        // params = params.append('Status', Status);
        return this.http.post(APIConstants.GETALLPHYSICALDISPOSALRETIREDASSETID, assetDetails)
    }
    GetAssetForPhysicalDisposal(assetDetails): Observable<any> {
        
        // let params = new HttpParams();        
        // params = params.append('CompanyId', assetDetails.CompanyId);
        // params = params.append('LocationId', assetDetails.LocationId);
        // params = params.append('pageNo', assetDetails.pageNo);
        // params = params.append('pageSize', assetDetails.pageSize);
        // params = params.append('SearchText', assetDetails.SearchText);
        // params = params.append('IsSearch', assetDetails.IsSearch);
        // params = params.append('UserId', assetDetails.UserId);
        // params = params.append('BlockId', assetDetails.BlockId);
        // params = params.append('RetiredId', assetDetails.RetiredId);
        // params = params.append('Status', assetDetails.Status);
        // params = params.append('IsExport', assetDetails.IsExport);

        return this.http.post(APIConstants.GETASSETFORPHYSICALDISPOSAL, assetDetails)
    }

    AssetReadyToDisposal(assetDetails): Observable<any> {
        return this.http.post(APIConstants.ASSETREADYTODISPOSAL, assetDetails)
    }

    GetPhysicalDisposalAssetList(assetDetails): Observable<any> {
        
        let params = new HttpParams();
        params = params.append('CompanyId', assetDetails.CompanyId);
        params = params.append('LocationId', assetDetails.LocationId);
        params = params.append('pageNo', assetDetails.pageNo);
        params = params.append('pageSize', assetDetails.pageSize);
        params = params.append('UserId', assetDetails.UserId);
        params = params.append('BlockId', assetDetails.BlockId);
        params = params.append('SearchText', assetDetails.SearchText);
        params = params.append('IsSearch', assetDetails.IsSearch);
        params = params.append('AssetList', assetDetails.AssetList);
        params = params.append('TransferType', assetDetails.TransferType);

        return this.http.get(APIConstants.GETPHYSICALDISPOSALASSETLIST, { params: params })
    }
    SavePhysicalDisposalAsset(assetDetails): Observable<any> {
        return this.http.post(APIConstants.SAVEPHYSICALTDISPOSALASSET, assetDetails)
    }

    MultipalAcceptRejectTransferForAllLevel(assetDetails): Observable<any> {
        let formData = new FormData();
        const blobOverrides = new Blob([JSON.stringify(assetDetails)], {
            type: 'application/json',
          });      
        formData.append('data', blobOverrides);
        return this.http.post(APIConstants.MULTIPALACCEPTREJECTTRANSFERFORALLLEVEL, formData)
    }
    AcceptRejectTransferNewCCSL(assetDetails): Observable<any> {
        return this.http.post(APIConstants.ACCEPTREJECTTRANSFERNEWCCSL, assetDetails)
    }
    RequestForReSubmission(assetDetails): Observable<any> {
        return this.http.post(APIConstants.REQUESTFORRESUBMISSION, assetDetails)
    }
    GetMultipleAssetsForWithdrawal(CompanyId, AssetList, TransferId, LocationId): Observable<any> {
        
        // let params = new HttpParams();
        // params = params.append('CompanyId', CompanyId);
        // params = params.append('AssetList', AssetList);
        // params = params.append('TransferId', TransferId);
        // params = params.append('LocationId', LocationId);
        var assetDetails = {
            CompanyId : CompanyId,
            AssetList:AssetList,
            TransferId: TransferId,
            LocationId : LocationId
        }

        let formData = new FormData();
        const blobOverrides = new Blob([JSON.stringify(assetDetails)], {
            type: 'application/json',
          });      
        formData.append('data', blobOverrides);

        return this.http.post(APIConstants.GETMULTIPLEASSETSFORWITHDRAWAL, formData)
    }
    MultipleWithdrawTransferByInitiator(assetDetails): Observable<any> {
        
        let formData = new FormData();
        const blobOverrides = new Blob([JSON.stringify(assetDetails)], {
            type: 'application/json',
          });      
        formData.append('data', blobOverrides);
        return this.http.post(APIConstants.MULTIPLEWITHDRAWTRANSFERBYINITIATOR, formData)
    }
    GetMultipalAssetForRequestInformation(assetDetails): Observable<any> {
        return this.http.post(APIConstants.GETMULTIPALASSETFORREQUESTINFORMATION, assetDetails)
    }
    GetMultipalAssetForReintiation(assetDetails): Observable<any> {
        return this.http.post(APIConstants.GETMULTIPALASSETFORREINTIATION, assetDetails)
    }
    ReSubmitForApprovalwithDoc(assetDetails): Observable<any> {
        
        let params = new HttpParams();
        params = params.append('excelfile', assetDetails.excelfile);
        params = params.append('companyId', assetDetails.companyId);
        params = params.append('locationId', assetDetails.locationId);
        params = params.append('newLocationId', assetDetails.newLocationId);
        params = params.append('transitType', assetDetails.transitType);
        params = params.append('assetList', assetDetails.assetList);
        params = params.append('modifiedBy', assetDetails.modifiedBy);
        params = params.append('dateC', assetDetails.dateC);
        params = params.append('TransferComment', assetDetails.TransferComment);
        params = params.append('RevertDate', assetDetails.RevertDate);
        params = params.append('ProposedTransferDate', assetDetails.ProposedTransferDate);
        params = params.append('transferredPhoto', assetDetails.transferredPhoto);
        params = params.append('transferredPhotoId', assetDetails.transferredPhotoId);
        params = params.append('TransferId', assetDetails.TransferId);



        let formData = new FormData();
        //formData.append('uploadFile', assetDetails.fileList[0]);
        for (var i = 0; i < assetDetails.fileList.length; i++) {
            formData.append("file[]", assetDetails.fileList[i]);
        }

        return this.http.post(APIConstants.RESUBMITFORAPPROVALWITHDOC, formData, { params: params })
    }
    ReInitiateDetailswithDoc(assetDetails): Observable<any> {
        debugger;
        let formData = new FormData();
        const blobOverrides = new Blob([JSON.stringify(assetDetails)], {
            type: 'application/json',
          });      
        formData.append('data', blobOverrides);
        
        //formData.append('uploadFile', assetDetails.fileList[0]);
        for (var i = 0; i < assetDetails.fileList.length; i++) {
            formData.append("file[]", assetDetails.fileList[i]);
        }
        return this.http.post(APIConstants.REINITIATEDETAILSWITHDOC, formData)
    
    }
        // let params = new HttpParams();
        // params = params.append('excelfile', assetDetails.excelfile);
        // params = params.append('companyId', assetDetails.companyId);
        // params = params.append('locationId', assetDetails.locationId);
        // params = params.append('newLocationId', assetDetails.newLocationId);
        // params = params.append('transitType', assetDetails.transitType);
        // params = params.append('assetList', assetDetails.assetList);
        // params = params.append('modifiedBy', assetDetails.modifiedBy);
        // params = params.append('dateC', assetDetails.dateC);
        // params = params.append('TransferComment', assetDetails.TransferComment);
        // params = params.append('RevertDate', assetDetails.RevertDate);
        // params = params.append('ProposedTransferDate', assetDetails.ProposedTransferDate);
        // params = params.append('transferredPhoto', assetDetails.transferredPhoto);
        // params = params.append('transferredPhotoId', assetDetails.transferredPhotoId);
        // params = params.append('OldPhotolist', assetDetails.OldPhotolist);

        // let formData = new FormData();
        // //formData.append('uploadFile', assetDetails.fileList[0]);
        // for (var i = 0; i < assetDetails.fileList.length; i++) {
        //     formData.append("file[]", assetDetails.fileList[i]);
        // }

        // return this.http.post(APIConstants.REINITIATEDETAILSWITHDOC, formData, { params: params })
    

    GetApprovalDetails(PrefarId): Observable<any> {

        let params = new HttpParams();
        params = params.append('PrefarId', PrefarId);
        return this.http.get(APIConstants.GETAPPROVALDETAILS, { params: params })
    }


    setUploadMissingFile(assetDetails): Observable<any> {
        
        return this.http.post(APIConstants.SETUPLOADMISSINGFILE, assetDetails)
    }

    // GetTransferIdsForTransferReport(CompanyList,LOCATIONLIST): Observable<any> {

    //     let params = new HttpParams();        
    //     params = params.append('CompanyIds', CompanyList);
    //     params = params.append('locationIdList', LOCATIONLIST);
    //     return this.http.get(APIConstants.GETTRANSFERIDSFORTARNSFERREPORT, { params: params } )
    // }

    UpdateAssetDetailsOnInward(assetDetails): Observable<any> {
        
        return this.http.post(APIConstants.UPDATEASSETDETAILSONINWARD, assetDetails)
    }
    MarkAssetsAsInwardOrRevert(assetDetails): Observable<any> {
        
        return this.http.post(APIConstants.MARKASSETSASINWARDORREVERT, assetDetails)
    }

    GetDocumentlistByTransferID(TransferId): Observable<any> {
        let params = new HttpParams();
        params = params.append('TransferId', TransferId);
        return this.http.get(APIConstants.GETDOCUMENTLISTBYTRANSFERID, { params: params })
    }

    GetDocumentlistByPhysicalTransfer(TransferId): Observable<any> {
        let params = new HttpParams();
        params = params.append('TransferId', TransferId);
        return this.http.get(APIConstants.GETDOCUMENTLISTBYPHYSICALTRANSFER, { params: params })
    }
    
    GetProjectIdformissingasset(companyId,locationId,pageName,categorylist): Observable<any> {

        let params = new HttpParams();
        params = params.append('companyId', companyId);
        params = params.append('locationIds', locationId);
        params = params.append('pageName', pageName);
        params = params.append('categorylist', categorylist);

        return this.http.get(APIConstants.GetMissingAssetProjectId, { params: params })
    }


    GetMissingAssetGridData(assetsDetails){
       
    let body = JSON.stringify(assetsDetails);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.post<any>(APIConstants.GetMissingAssetGridData, body, { headers })
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

    GetReconciliationAssetList(assetDetails): Observable<any> {
        
        return this.http.post(APIConstants.GETRECONCILIATIONASSETLIST, assetDetails)
    }

    SendMailToUserforMissingAssets(assetDetails): Observable<any> {
        
        return this.http.post(APIConstants.SENDMAILTOUSERFORMISSINGASSETS, assetDetails)
    }
    NewApproveAdditionalAssets(assetDetails): Observable<any> {

        let params = new HttpParams();
        params = params.append('companyId', assetDetails.companyId);
        params = params.append('transitType', assetDetails.transitType);
        params = params.append('assetLists', assetDetails.assetLists);
        params = params.append('modifiedBy', assetDetails.modifiedBy);

        return this.http.get(APIConstants.NEWAPPROVEADDITIONALASSETS, { params: params })
    }
    sendMailForMissingAssets(assetDetails): Observable<any> {
        
        return this.http.post(APIConstants.SENDMAILFORMISSINGASSETS, assetDetails)
    }

    GetReconciliationAssetListForLabelStatusdto(assetDTO): Observable<any>{
        return this.http.post(APIConstants.GetReconciliationAssetListForLabelStatusdto, assetDTO)
    }
    SendForReTagging(assetDTO): Observable<any>{
        return this.http.post(APIConstants.SENDFORRETAGGING, assetDTO)
    }
    ApproveRejectChangesNew(assetDTO): Observable<any>{
        return this.http.post(APIConstants.APPROVEREJECTCHANGESNEW, assetDTO)
    }

    GetProjectIdListByCompanyIdLocationIdUserId(assetDetails): Observable<any> {
        
        return this.http.post(APIConstants.GetProjectIdListByCompanyIdLocationIdUserId, assetDetails)
      }

      DeleteAdditionalAssetsById(assetsDetails): Observable<any> {
        return this.http.post(APIConstants.DELETEADDITIONALASSETSBYID, assetsDetails)

    }

    GetApprovalLevelAvailable(PrefarId,userId): Observable<any> {
        debugger;
        let params = new HttpParams();
        params = params.append('PrefarId', PrefarId);
        params = params.append('userId', userId);
        return this.http.get(APIConstants.GETAPPROVALLEVELAVAILABLE, { params: params })
    }
}