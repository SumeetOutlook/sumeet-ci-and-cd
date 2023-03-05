import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APIConstants } from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';


@Injectable({
    providedIn: 'root'
})
export class AssetRetireService {
    constructor(private http: HttpClient) { }    
    
    GetAssetListToInitiateRetire(assetDetails): Observable<any> {
        
        //let params = new HttpParams();
        // params = params.append('companyId', assetDetails.companyId);
        // params = params.append('locationId', assetDetails.locationId);
        // params = params.append('pageNumber', assetDetails.PageNo);
        // params = params.append('pageSize', assetDetails.PageSize);
        // params = params.append('searchText', assetDetails.searchText);
        // params = params.append('isSearch', assetDetails.isSearch);
        // params = params.append('userId', assetDetails.userId);
        // params = params.append('blockId', assetDetails.blockId);
        // params = params.append('assetLife', assetDetails.assetLife);
        // params = params.append('flag', assetDetails.flag);
        // params = params.append('IsExport', assetDetails.IsExport);
        return this.http.post(APIConstants.GETASSETLISTTOINITIATERETIRE, assetDetails )
    }
    GetAssetsForRetirement(CompanyId, AssetList): Observable<any> {
        
        let params = new HttpParams();
        params = params.append('CompanyId', CompanyId);
        params = params.append('AssetList', AssetList);

        return this.http.get(APIConstants.GETASSETSFORRETIREMENT, { params: params })
    }

    // AddRetiredAssetDetails(assetDetails , fileList): Observable<any> {
    //     
    //     let params = new HttpParams();
    //     params = params.append('excelfile', assetDetails.Excelfile);
    //     params = params.append('assetList', assetDetails.AssetList);
    //     params = params.append('rComment', assetDetails.rComment);
    //     params = params.append('Amount', assetDetails.Amount);
    //     params = params.append('CustomerName', assetDetails.CustomerName);
    //     params = params.append('discardValue', assetDetails.discardValue);
    //     params = params.append('discardType', assetDetails.discardType);
    //     params = params.append('discardedPhoto', assetDetails.discardedPhoto);
    //     params = params.append('discardedPhotoId', assetDetails.DiscardedPhotoId);
    //     params = params.append('retireDateTime', assetDetails.RetireDateTime);
    //     params = params.append('userId', assetDetails.UserId);
    //     params = params.append('locationId', assetDetails.LocationId);
    //     params = params.append('companyId', assetDetails.CompanyId);
    //     params = params.append('proposedDate', assetDetails.proposedDate);
    //     params = params.append('amountype', assetDetails.amountype);
    //     params = params.append('assetLifeFlag', assetDetails.assetLifeFlag);
    //     params = params.append('TransactionTypeForSellingAmount', assetDetails.TransactionTypeForSellingAmount);        
    //     params = params.append('RequestInfoComment', assetDetails.rComment);
    //     params = params.append('SellingAlist', assetDetails.SellingAmountlist);
    //     let formData = new FormData();
    //     for (var i = 0; i < fileList.length; i++) {
    //         formData.append("file[]", fileList[i]);
    //     }
    //     return this.http.post(APIConstants.ADDRETIREDASSETDETAILS, formData , { params: params })
    // }

    AddRetiredAssetDetails(assetDetails , fileList): Observable<any> {
        
        let formData = new FormData();
        const blobOverrides = new Blob([JSON.stringify(assetDetails)], {
            type: 'application/json',
          });      
        formData.append('data', blobOverrides);        
        for (var i = 0; i < fileList.length; i++) {
            formData.append("file", fileList[i]);
        }
        
        return this.http.post(APIConstants.ADDRETIREDASSETDETAILS, formData)
    }

    AddRetiredAssetDetailsExpired(assetDetails): Observable<any> {
        
        let params = new HttpParams();
        params = params.append('excelfile', assetDetails.excelfile);
        params = params.append('assetList', assetDetails.assetList);
        params = params.append('rComment', assetDetails.rComment);
        params = params.append('Amount', assetDetails.Amount);
        params = params.append('CustomerName', assetDetails.CustomerName);
        params = params.append('discardValue', assetDetails.discardValue);
        params = params.append('discardType', assetDetails.discardType);
        params = params.append('discardedPhoto', assetDetails.discardedPhoto);
        params = params.append('discardedPhotoId', assetDetails.discardedPhotoId);
        params = params.append('retireDateTime', assetDetails.retireDateTime);
        params = params.append('userId', assetDetails.userId);
        params = params.append('locationId', assetDetails.locationId);
        params = params.append('companyId', assetDetails.companyId);
        params = params.append('proposedDate', assetDetails.proposedDate);
        params = params.append('amountype', assetDetails.amountype);
        params = params.append('assetLifeFlag', assetDetails.assetLifeFlag);

        let formData = new FormData();
        formData.append('uploadFile', assetDetails.fileList[0]);

        return this.http.post(APIConstants.ADDRETIREDASSETDETAILSEXPIRED,formData, { params: params } )
    }
    GetAllRetiredAssetId(assetDetails): Observable<any> {
        return this.http.post(APIConstants.GETALLRETIREDASSETID,assetDetails)
    }
    GetAssetsToApproveRetire(assetDetails): Observable<any> {
        
        // let params = new HttpParams();
        // params = params.append('locationId', assetDetails.locationId);
        // params = params.append('BlockId', assetDetails.BlockId);
        // params = params.append('retirementLocations', assetDetails.retirementLocations);
        // params = params.append('isAdmin', assetDetails.isAdmin);
        // params = params.append('CompanyId', assetDetails.CompanyId);
        // params = params.append('pageNo', assetDetails.pageNo);
        // params = params.append('pageSize', assetDetails.pageSize);
        // params = params.append('searchText', assetDetails.searchText);
        // params = params.append('IsExport', assetDetails.IsExport);
        // params = params.append('UserId', assetDetails.UserId);
        // params = params.append('isSearch', assetDetails.isSearch);
        // params = params.append('AssetLife', assetDetails.AssetLife);
        // params = params.append('AssetConditionId', assetDetails.AssetConditionId);
        // params = params.append('retireId', assetDetails.retireId);
        // params = params.append('ApprovalLevel', assetDetails.ApprovalLevel);
        return this.http.post(APIConstants.GETASSETSTOAPPROVERETIRE, assetDetails)
    }

    GetMultipleRetireAssetForAllLevel(CompanyId, AssetList): Observable<any> {
        
        // let params = new HttpParams();
        // params = params.append('CompanyId', CompanyId);
        // params = params.append('AssetList', AssetList);
        var assetDetails = {
            CompanyId : CompanyId,
            AssetList : AssetList
        }

        let formData = new FormData();
        const blobOverrides = new Blob([JSON.stringify(assetDetails)], {
            type: 'application/json',
          });      
        formData.append('data', blobOverrides); 

        return this.http.post(APIConstants.GETMULTIPLERETIREASSETFORALLLEVEL, formData)
    }

    GetAllRetiredIdForReport(CompanyIds,locationIdList): Observable<any> {
        let params = new HttpParams();
        params = params.append('CompanyIds', CompanyIds);
        params = params.append('locationIdList', locationIdList);

        return this.http.get(APIConstants.GetAllRetiredIdForReport, { params: params })
    }

    GetBlockOfAssetsByCompany(companyId): Observable<any> {

        let params = new HttpParams();
        params = params.append('companyId', companyId);

        return this.http.get(APIConstants.GetBlockOfAssetsByCompany, { params: params })
    }

    GetAllRetiredIdForDisposalReport(CompanyIds,locationIdList): Observable<any>{

        let params = new HttpParams();
        params = params.append('CompanyIds', CompanyIds);
        params = params.append('locationIdList', locationIdList);

        return this.http.get(APIConstants.GetAllRetiredIdForDisposalReport, { params: params })
    }
    MultipalAcceptRejectRetirementForAllApproveLevel(assetDetails): Observable<any> {   
          
        let formData = new FormData();
        const blobOverrides = new Blob([JSON.stringify(assetDetails)], {
            type: 'application/json',
          });      
        formData.append('data', blobOverrides);    
        return this.http.post(APIConstants.MULTIPALACCEPTREJECTRETIREMENTFORALLAPPROVELEVEL, formData)
    }
    RequestForReSubmission(assetDetails): Observable<any> {        
        return this.http.post(APIConstants.REQUESTFORRESUBMISSIONRETIRE, assetDetails)
    }
    GetApprovalDetailsForRetired(PrefarId): Observable<any> {
        let params = new HttpParams();
        params = params.append('PrefarId', PrefarId);
        return this.http.get(APIConstants.GETAPPROVALDETAILSFORRETIRED, { params: params })
    }
    GetMultipleRetireAssetForRequestInformation(assetDetails): Observable<any> {        
        return this.http.post(APIConstants.GETMULTIPLERETIREASSETFORREQUESTINFORMATION, assetDetails)
    }
    GetMultipleRetireAssetForReintiation(assetDetails): Observable<any> {        
        return this.http.post(APIConstants.GETMULTIPLERETIREASSETFORREINTIATION, assetDetails)
    }
    ReInitiateRetiredAssetDetails(assetDetails,fileList): Observable<any> {      
        
        // let params = new HttpParams();
        // params = params.append('excelfile', assetDetails.Excelfile);
        // params = params.append('assetList', assetDetails.AssetList);
        // params = params.append('rComment', assetDetails.rComment);
        // params = params.append('Amount', assetDetails.Amount);
        // params = params.append('CustomerName', assetDetails.CustomerName);
        // params = params.append('discardValue', assetDetails.discardValue);
        // params = params.append('discardType', assetDetails.discardType);
        // params = params.append('discardedPhoto', assetDetails.discardedPhoto);
        // params = params.append('discardedPhotoId', assetDetails.DiscardedPhotoId);
        // params = params.append('retireDateTime', assetDetails.RetireDateTime);
        // params = params.append('userId', assetDetails.UserId);
        // params = params.append('locationId', assetDetails.LocationId);
        // params = params.append('companyId', assetDetails.CompanyId);
        // params = params.append('proposedDate', assetDetails.proposedDate);
        // params = params.append('amountype', assetDetails.amountype);
        // params = params.append('assetLifeFlag', assetDetails.assetLifeFlag);
        // params = params.append('TransactionTypeForSellingAmount', assetDetails.TransactionTypeForSellingAmount);        
        // params = params.append('RequestInfoComment', assetDetails.rComment);
        // params = params.append('SellingAlist', assetDetails.SellingAmountlist);
        // params = params.append('OldPhotoList', assetDetails.OldPhotolist);

        let formData = new FormData();
       
        const blobOverrides = new Blob([JSON.stringify(assetDetails)], {
            type: 'application/json',
          });      
        formData.append('data', blobOverrides); 
        for (var i = 0; i < fileList.length; i++) {
            formData.append("file", fileList[0]);
        }


        return this.http.post(APIConstants.REINITIATERETIREDASSETDETAILS, formData)
    }
    GetMultipleRetireAssetForFinanceApprover(CompanyId, AssetList): Observable<any> {
        // let params = new HttpParams();
        // params = params.append('CompanyId', CompanyId);
        // params = params.append('AssetList', AssetList);

        var assetDetails = {
            CompanyId : CompanyId,
            AssetList : AssetList
        }

        let formData = new FormData();
        const blobOverrides = new Blob([JSON.stringify(assetDetails)], {
            type: 'application/json',
          });      
        formData.append('data', blobOverrides); 

        return this.http.post(APIConstants.GETMULTIPLERETIREASSETFORFINANCEAPPROVER, formData)
    }
    RejectRetirementByMultipleWithdraw(assetDetails): Observable<any> {   

        let formData = new FormData();
        const blobOverrides = new Blob([JSON.stringify(assetDetails)], {
            type: 'application/json',
          });      
        formData.append('data', blobOverrides);

        return this.http.post(APIConstants.REJECTRETIREMENTBYMULTIPLEWITHDRAW, formData)
    }
    ReSubmitForApproval(assetDetails): Observable<any> {     
        
        let params = new HttpParams();
        params = params.append('excelfile', null);
        params = params.append('assetList', assetDetails.AssetList);
        params = params.append('rComment', assetDetails.rComment);
        params = params.append('Amount', "0");
        params = params.append('CustomerName', "");
        params = params.append('discardValue', "");
        params = params.append('discardType', "");
        params = params.append('discardedPhoto', "");
        params = params.append('discardedPhotoId', "");
        params = params.append('retireDateTime', "");
        params = params.append('userId', assetDetails.UserId);
        params = params.append('locationId', assetDetails.LocationId);
        params = params.append('companyId', assetDetails.CompanyId);
        params = params.append('proposedDate', "");
        params = params.append('amountype',"");
        params = params.append('assetLifeFlag', assetDetails.AssetLife);
        params = params.append('TransactionTypeForSellingAmount', "");        
        params = params.append('RequestInfoComment', assetDetails.rComment);
        params = params.append('SellingAlist', "");
        params = params.append('RetiredId', assetDetails.RetiredId);

        let formData = new FormData();
        for (var i = 0; i < assetDetails.fileList.length; i++) {
            formData.append("file[]", assetDetails.fileList[i]);
        }

        return this.http.post(APIConstants.RESUBMITFORAPPROVAL, formData , {params : params})
    }
    GetDocumentlistByRetireAssetID(RetireAssetID): Observable<any> {
        let params = new HttpParams();
        params = params.append('RetireAssetID', RetireAssetID);
        return this.http.get(APIConstants.GETDOCUMENTLISTBYRETIREASSETID, { params: params })
    }
    GetAssetForPhysicalDisposalWithdrawRetire(assetDetails): Observable<any> {
        
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
        // var assetDetails = {
        //     CompanyId : CompanyId,
        //     AssetList : AssetList,
        //     AssetStatus: AssetStatus
        // }

        // let formData = new FormData();
        // const blobOverrides = new Blob([JSON.stringify(assetDetails)], {
        //     type: 'application/json',
        //   });      
        // formData.append('data', blobOverrides); 

        return this.http.get(APIConstants.GETPHYSICALDISPOSALASSETLIST, { params: params } )
    }

    GetApprovalLevelAvailableRetirment(PrefarId,userId): Observable<any> {
        debugger;
        let params = new HttpParams();
        params = params.append('PrefarId', PrefarId);
        params = params.append('userId', userId);
        return this.http.get(APIConstants.GETAPPROVALLEVELAVAILABLERETIREMENT, { params: params })
    }
}