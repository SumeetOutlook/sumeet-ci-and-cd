import { Injectable } from '@angular/core';
import { APIConstants } from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';
import { map, catchError, delay } from "rxjs/operators";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse, HttpParams } from "@angular/common/http";
import { of, BehaviorSubject, throwError } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class AssetService {
  constructor(private http: HttpClient) { }

  getSbuListInventory(id): Observable<any> {
    let params = new HttpParams();
    params = params.append('companyId', id);
    return this.http.get(APIConstants.SBUINVENTORY, { params: params })
  }

  getInventorySbuForCertification(id): Observable<any> {
    let params = new HttpParams();
    params = params.append('companyId', id);
    return this.http.get(APIConstants.SUBINVENTORYCERTIFICATION, { params: params })
  }


  getProjectIdVerification(companyId, locationId, userId, taskId, taskname): Observable<any> {
    let params = new HttpParams();
    params = params.append('companyId', companyId);
    params = params.append('locationId', locationId);
    params = params.append('userId', userId);
    params = params.append('taskId', taskId);
    params = params.append('taskname', taskname);
    return this.http.get(APIConstants.PROJECTIDVERIFICATION, { params: params })
  }

  getProjectIdCertification(companyId, locationId, userId, taskId, taskname): Observable<any> {
    let params = new HttpParams();
    params = params.append('companyId', companyId);
    params = params.append('locationId', locationId);
    params = params.append('userId', userId);
    params = params.append('taskId', taskId);
    params = params.append('taskname', taskname);
    return this.http.get(APIConstants.PROJECTIDVERIFICATION, { params: params })
  }
  showData(assetDetails) {
    return this.http.post(APIConstants.DisplayInventoryData, assetDetails)
  }

  getLocationList(gId, uId, cId, rId): Observable<any> {
    // groupId={groupId}&userid={userid}&companyId={companyId}&regionId={regionId}
    let params = new HttpParams();
    params = params.append('groupId', gId);
    params = params.append('userid', uId);
    params = params.append('companyId', cId);
    params = params.append('regionId', rId);
    params = params.append('moduleid', ' 1');
    return this.http.get(APIConstants.LOCATIONLIST, { params: params });
  }

  getCityDetails(id): Observable<any> {
    let params = new HttpParams();
    params = params.append('companyId', id);
    return this.http.get(APIConstants.AllCITYDETAILS, { params: params });
  }

  getFilterIdList(): Observable<any> {
    let params = new HttpParams();
    params = params.append('PageId', '3');
    return this.http.get(APIConstants.FILTERIDLIST, { params: params })
  }

  getFieldIdsList(PageId): Observable<any> {
    let params = new HttpParams();
    params = params.append('PageId', PageId);
    return this.http.get(APIConstants.FIELDIDLIST, { params: params })
  }

  getSubAssets(id): Observable<any> {
    let params = new HttpParams();
    params = params.append('companyId', id);
    return this.http.get(APIConstants.SUBASSET, { params: params });
  }

  getAssetIdsForGroup(asset): Observable<any> {
    console.log(asset);
    let params = new HttpParams();
    params = params.append('columnname', 'assetId');
    params = params.append('searchtext', asset);
    return this.http.get(APIConstants.SEARCHASSETGROUP, { params: params })
  }

  getAssetClass(gId, uId, cId, rId): Observable<any> {
    let params = new HttpParams();
    params = params.append('groupId', gId);
    params = params.append('userid', uId);
    params = params.append('companyId', cId);
    params = params.append('regionId', rId);
    params = params.append('moduleid', ' 1');
    return this.http.get(APIConstants.ASSETCLASS, { params: params });
  }

  getUomData(id, assetId): Observable<any> {
    let params = new HttpParams();
    params = params.append('companyId', id);
    params = params.append('AssetblockId', assetId);
    return this.http.get(APIConstants.UOMDETAILS, { params: params });
  }

  quantitySplit(assetsDetails): Observable<any> {
    return this.http.post(APIConstants.QUANTITYSPLIT, assetsDetails);
  }

  sendForTagging(assetsDetails) {

    return this.http.post(APIConstants.TAGGING, assetsDetails);
  }

  splitComponent(objAddAssetSplitList) {
    debugger;
    return this.http.post(APIConstants.COMPONENTSPLIT, objAddAssetSplitList);
  }

  groupSplit(GroupAssetdto) {
    return this.http.post(APIConstants.SUBMITGROUPSPLIT, GroupAssetdto);
  }

  searchAsset(assetsDetails) {
    return this.http.post(APIConstants.SEARCHASSET, assetsDetails);
  }

  getAssetType(typeId, id) {
    let params = new HttpParams();
    params = params.append('companyId', id);
    params = params.append('typeId', typeId);
    return this.http.get(APIConstants.ASSETTYPE, { params: params });
  }

  loadAssetListAllData(objAsetsParameter) {
    return this.http.post(APIConstants.ASSETLISTTABLE, objAsetsParameter);
  }

  typeOfAsset(companyId): Observable<any> {
    let params = new HttpParams();
    params = params.append('companyId', companyId);
    return this.http.get(APIConstants.TYPEOFASSETLIST, { params: params });

  }

  configurationGetById(id): Observable<any> {
    let params = new HttpParams();
    params = params.append('name', id);
    return this.http.get(APIConstants.CONFIGURATIONGETBYID, { params: params })
  }
  sbuInsertData(sbu): Observable<any> {
    console.log('sbu created service', sbu)
    return this.http.post(APIConstants.SBUINSERT, sbu)
  }

  GetAllTableColumnData(groupId, Type): Observable<any> {

    let params = new HttpParams();
    params = params.append('groupId', groupId);
    params = params.append('Type', Type);
    return this.http.get(APIConstants.GETALLTABLECOLUMNDATA, { params: params })
  }

  GetMappingData(UploadType, userid): Observable<any> {
    let params = new HttpParams();
    params = params.append('UploadType', UploadType);
    params = params.append('userid', userid);
    return this.http.get(APIConstants.GETMAPPINGDATA, { params: params })
  }
  //Change By Tanmayee
  GetFARDate(companyId, locationId): Observable<any> {
    let params = new HttpParams();
    params = params.append('companyId', companyId);
    params = params.append('locationId', locationId);
    return this.http.get(APIConstants.CurrentFARDATE, { params: params })
  }

  GetAssetHeaderData(groupId, Type): Observable<any> {
    let params = new HttpParams();
    params = params.append('groupId', groupId);
    params = params.append('Type', Type);
    return this.http.get(APIConstants.GetAssetHeader, { params: params })
  }
  GetAssetConditionList(): Observable<any> {
    return this.http.get(APIConstants.ASSETCONDITIONGETALLDATA)
  }

  GetAssetCriticalityList(): Observable<any> {
    return this.http.get(APIConstants.ASSETCRITICALITYGETALLDATA)
  }

  GetDocumentTypeId(): Observable<any> {
    return this.http.get(APIConstants.UPLOADDOCUMENTGETDATA)
  }

  GetAllSupplierListData(CompanyId, GroupId): Observable<any> {
    let params = new HttpParams();
    params = params.append('companyId', CompanyId);
    params = params.append('groupId', GroupId);
    return this.http.get(APIConstants.SUPPLIERLISTDATA, { params: params })
  }


  GetAllOperatingSystemList(CompanyId, GroupId): Observable<any> {

    let params = new HttpParams();
    params = params.append('CompanyId', CompanyId);
    params = params.append('GroupId', GroupId);
    return this.http.get(APIConstants.OSGETALLDATA, { params: params })
  }

  GetAllCPUClassList(CompanyId, GroupId): Observable<any> {

    let params = new HttpParams();
    params = params.append('CompanyId', CompanyId);
    params = params.append('GroupId', GroupId);
    return this.http.get(APIConstants.CPUCLASSGETALLDATA, { params: params })
  }

  GetAllCPUSubClassList(CompanyId, GroupId): Observable<any> {

    let params = new HttpParams();
    params = params.append('CompanyId', CompanyId);
    params = params.append('GroupId', GroupId);
    return this.http.get(APIConstants.CPUSUBCLASSGETALLDATA, { params: params })
  }

  GetAllApplicationTypeList(CompanyId, GroupId): Observable<any> {

    let params = new HttpParams();
    params = params.append('CompanyId', CompanyId);
    params = params.append('GroupId', GroupId);
    return this.http.get(APIConstants.APPLICATIONTYPEGETDATA, { params: params })

  }

  GetAllModelList(CompanyId, GroupId): Observable<any> {

    let params = new HttpParams();
    params = params.append('CompanyId', CompanyId);
    params = params.append('GroupId', GroupId);
    return this.http.get(APIConstants.MODELTYPEGETDATA, { params: params })

  }

  GetAllManufactureList(CompanyId, GroupId): Observable<any> {

    let params = new HttpParams();
    params = params.append('CompanyId', CompanyId);
    params = params.append('GroupId', GroupId);
    return this.http.get(APIConstants.MANUFACTUREGETDATA, { params: params })

  }

  GetAllCustomizationDataWithType(lisTtype): Observable<any> {

    let params = new HttpParams();
    params = params.append('lisTtype', lisTtype);
    return this.http.get(APIConstants.GETALLCUSTDATAWITHTYPE, { params: params })

  }

  CheckInvoiceNoForCreateGRN(GRNNo, companyId, GroupId, Vendor): Observable<any> {

    let params = new HttpParams();
    params = params.append('GRNNo', GRNNo);
    params = params.append('companyId', companyId);
    params = params.append('GroupId', GroupId);
    params = params.append('Vendor', Vendor);
    return this.http.get(APIConstants.CHECKINVOICENOFORCREATEGRN, { params: params })

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

  GetReviewGridData(ErrorAssetsDetail): Observable<any> {

    return this.http.post(APIConstants.GETASSETLISTFORUPLOADERROR, ErrorAssetsDetail)
  }


  GetGridDataForGrnAsset(companyId, userId, PageName, pageNo, PageSize, search, isSearch, IsExport, IsCompanyAdmin): Observable<any> {

    let params = new HttpParams();
    params = params.append('companyId', companyId);
    params = params.append('userId', userId);
    params = params.append('PageName', PageName);
    params = params.append('pageNo', pageNo);
    params = params.append('PageSize', PageSize);
    params = params.append('search', search);
    params = params.append('isSearch', isSearch);
    params = params.append('IsExport', IsExport);
    params = params.append('IsCompanyAdmin', IsCompanyAdmin);

    return this.http.get(APIConstants.GETEXCELTOBINDDISPLAYLIST, { params: params })

  }

  GetAssetApproval(assetsDetails): Observable<any> {

    return this.http.post(APIConstants.ASSETAPPROVAL, assetsDetails)
  }

  AssetsRejection(assetsDetails): Observable<any> {

    return this.http.post(APIConstants.ASSETREJECTION, assetsDetails)
  }

  DeleteRow(assetsDetails): Observable<any> {

    return this.http.post(APIConstants.DeleteReview, assetsDetails)
  }

  GetAssetById2(prefarId): Observable<any> {

    let params = new HttpParams();
    params = params.append('id', prefarId);

    return this.http.get(APIConstants.GETASSETBYID2, { params: params })

  }
  UpdateEditAsset(assetsDetails): Observable<any> {

    return this.http.post(APIConstants.UPDATEEDITASSET, assetsDetails)
  }
  GetAssetDetailsWithGroupJson(assetId): Observable<any> {
    let params = new HttpParams();
    params = params.append('assetId', assetId);
    return this.http.get(APIConstants.GetAssetDetailsWithGroupJson, { params: params })
  }
  ApprovalListbyUserIdStatusAndTransferID(userId, Status, transferID): Observable<any> {

    let params = new HttpParams();
    params = params.append('userId', userId);
    params = params.append('Status', Status);
    params = params.append('transferID', transferID);
    return this.http.get(APIConstants.APPROVALLISTBYUSERIDSTATUSANDTRANSFERID, { params: params })
  }

  SearchAssetJSON(searchassetsDto): Observable<any> {

    let body = JSON.stringify(searchassetsDto);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.post<any>(APIConstants.SearchAssetJSON, body, { headers })
      .pipe(map(data => {

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

  ApprovalListbyUserIdStatusAndRetiredAssetID(userId, Status, RetiredAssetId): Observable<any> {

    let params = new HttpParams();
    params = params.append('userId', userId);
    params = params.append('Status', Status);
    params = params.append('RetiredAssetId', RetiredAssetId);
    return this.http.get(APIConstants.APPROVALLISTBYUSERIDSTATUSANDRETIREDASSETID, { params: params })
  }
  DeleteAssetDocumentById(id, documentPath): Observable<any> {

    let params = new HttpParams();
    params = params.append('id', id);
    params = params.append('documentPath', documentPath);
    return this.http.delete(APIConstants.DELETEASSETDOCUMENTBYID, { params: params })
  }

  SendMailContent(EventName): Observable<any> {

    let params = new HttpParams();
    params = params.append('EventName', EventName);
    return this.http.get(APIConstants.SENDMAILCONTENT, { params: params })
  }
  GetAssetListForUserCustodian(assetDetails): Observable<any> {

    // let params = new HttpParams();
    // params = params.append('assetDetails', assetDetails);
    return this.http.post(APIConstants.GETASSETLISTFORUSERCUSTODIAN, assetDetails)
  }
  GetPrefarIdListForTaggingApproval(assetDetails): Observable<any> {

    return this.http.post(APIConstants.GETPREFARIDLISTFORTAGGINGAPPROVAL, assetDetails)
  }
  GetByPrefarIdForTaggingApproval(prefarId): Observable<any> {

    let params = new HttpParams();
    params = params.append('prefarId', prefarId);
    return this.http.get(APIConstants.GETBYPREFARIDFORTAGGINGAPPROVAL, { params: params })
  }
  UpdateAsset(assetDetails): Observable<any> {
    return this.http.post(APIConstants.UPDATEASSET, assetDetails)
  }

  GetAssetsForUserAllocation(assetDetails): Observable<any> {

    let params = new HttpParams();
   //params = params.append('companyId', companyId);
   // params = params.append('AssetList', AssetList);
    return this.http.post(APIConstants.GETASSETSFORUSERALLOCATION, assetDetails)
  }

  GetAssetsForUserUnallocation(assetDetails): Observable<any> {

    let params = new HttpParams();
    // params = params.append('companyId', companyId);
    // params = params.append('userEmail', userEmail);
    // params = params.append('AssetList', AssetList);
    return this.http.post(APIConstants.GETASSETSFORUSERUNALLOCATION, assetDetails)
  }

  SearchUsersForAssetUnAllocation(assetDetails): Observable<any> {
    return this.http.post(APIConstants.SEARCHUSERSFORASSETUNALLOCATION, assetDetails)
  }

  AssetUnallocation(assetDetails): Observable<any> {
    debugger;
    let params = new HttpParams();
    // params = params.append('allocatedDate', assetDetails.AllocationDate);
    // params = params.append('userEmail', assetDetails.UserEmail);
    // params = params.append('allocatedBy', assetDetails.AllocateBy);
    // params = params.append('CompanyId', assetDetails.CompanyId);
    // params = params.append('locationId', assetDetails.LocationId);
    // params = params.append('UserId', assetDetails.LastModifiedBy);
    // params = params.append('AssetList', assetDetails.AssetList);
    return this.http.post(APIConstants.ASSETUNALLOCATION, assetDetails)
  }

  ResendMail(assetDetails): Observable<any> {

    let params = new HttpParams();
    // params = params.append('PrefarIdlist', assetDetails.PrefarIdlist);
    // params = params.append('companyId', assetDetails.companyId);
    // params = params.append('groupId', assetDetails.groupId);
    return this.http.post(APIConstants.RESENDMAIL, assetDetails)
  }
  GetAssetsToGroup(assetDetails): Observable<any> {
    debugger;
    let params = new HttpParams();
    params = params.append('farId', assetDetails.farId);
    params = params.append('actionMethod', assetDetails.actionMethod);
    params = params.append('subStringForAssetId', assetDetails.subStringForAssetId);
    params = params.append('subStringForAssetDesc', assetDetails.subStringForAssetDesc);
    params = params.append('subStringForadl2', assetDetails.subStringForadl2);
    return this.http.get(APIConstants.GETASSETSTOGROUP, { params: params })
  }
  GetSubGroupJson(assetId): Observable<any> {
    debugger;
    let params = new HttpParams();
    params = params.append('assetId', assetId);
    return this.http.get(APIConstants.GETSUBGROUPJSON, { params: params })
  }

  SearchUsersForAssetUnAllocationForLink(assetDetails): Observable<any> {
    return this.http.post(APIConstants.SEARCHUSERSFORASSETUNALLOCATIONFORLINK, assetDetails)
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
  ApproveChangeForPrePrintedAdditionalAssetMap(assetDetails): Observable<any> {
    return this.http.post(APIConstants.APPROVECHANGEFORPREPRINTEDADDITIONALASSETMAP, assetDetails)
  }
  NewApproveChangeForPrePrintedAdditionalAssetMap(assetDetails): Observable<any> {
    return this.http.post(APIConstants.NEWAPPROVECHANGEFORPREPRINTEDADDITIONALASSETMAP, assetDetails)
  }
  GetAssetIdsForAutoCompleteJson(assetDetails): Observable<any> {
    return this.http.post(APIConstants.GETASSETIDSFORAUTOCOMPLETEJSON, assetDetails)
  }

  IsAssetIdDuplicate(companyId, GroupId, assetId, subAssetId, AcqDate): Observable<any> {

    let params = new HttpParams();
    params = params.append('companyId', companyId);
    params = params.append('GroupId', GroupId);
    params = params.append('assetId', assetId);
    params = params.append('subAssetId', subAssetId);
    params = params.append('AcqDate', AcqDate);
    return this.http.get(APIConstants.ISASSETIDDUPLICATE, { params: params })
  }
  IsAssetIdAndAcqDateDuplicate(companyId, assetId, AcqDate): Observable<any> {

    let params = new HttpParams();
    params = params.append('companyId', companyId);
    params = params.append('assetId', assetId);
    params = params.append('AcqDate', AcqDate);
    return this.http.get(APIConstants.ISASSETIDANDACQDATEDUPLICATE, { params: params })
  }

  IsAIDSameDiffBlock(companyId, assetId, BlockId): Observable<any> {

    let params = new HttpParams();
    params = params.append('companyId', companyId);
    params = params.append('assetId', assetId);
    params = params.append('BlockId', BlockId);
    return this.http.get(APIConstants.ISAIDSAMEDIFFBLOCK, { params: params })
  }
  
  IsAssetIdAndSubNoDuplicate(companyId, assetId,SubAssetId , PreFarId): Observable<any> {

    let params = new HttpParams();
      params = params.append('companyId', companyId);
      params = params.append('assetId', assetId);
      params = params.append('subassetId', SubAssetId);
      params = params.append('PreFarId', PreFarId);
      return this.http.get(APIConstants.IsAssetIdAndSubNoDuplicate, { params: params })
    }
    Getallcategories(groupId): Observable<any> {

      let params = new HttpParams();
        params = params.append('groupId', groupId);
        return this.http.get(APIConstants.GETALLCATEGORIES, { params: params })
      }
     
      GetstandardTablename(groupId,viewid): Observable<any> {
  
        let params = new HttpParams();
          params = params.append('groupId', groupId);
          params = params.append('viewid', viewid);
          return this.http.get(APIConstants.GETSTANDARDTABLENAME, { params: params })
      }
      SaveFieldStandardView(fielddto): Observable<any> {
        return this.http.post(APIConstants.SAVEFIELDSTANDARDVIEW, fielddto)
      }
  
      GetCustomeView(groupId,regionId,companyId): Observable<any> {
  
        let params = new HttpParams();
          params = params.append('groupId', groupId);
          params = params.append('regionId', regionId);
          params = params.append('companyId', companyId);
          return this.http.get(APIConstants.GETALLSTANDARDANDCUSTOMECATEGORIES, { params: params })
        }
  
        GetFieldsByViewId(ViewId): Observable<any> {
  
          let params = new HttpParams();
            params = params.append('ViewId', ViewId);
            return this.http.get(APIConstants.GETFIELDBYVIEWID, { params: params })
          }
          SaveCustomeView(fielddto): Observable<any> {
            debugger;
            return this.http.post(APIConstants.SAVECUSTOMEVIEW, fielddto)
          }
  
          GetCustome(groupId): Observable<any> {
          let params = new HttpParams();
          params = params.append('groupId', groupId);
          return this.http.get(APIConstants.GETALLSTANDARDANDCUSTOMECATEGORIES, { params: params })
        }
        GetCustomField(Viewname): Observable<any> {
        let params = new HttpParams();
        params = params.append('Viewname', Viewname);
        return this.http.get(APIConstants.GETCUSTOMEFIELD, { params: params })
        }
        
        SaveFieldCustomView(fielddto): Observable<any> {
          return this.http.post(APIConstants.SAVEFIELDCUSTOMVIEW, fielddto)
        }
        GetCustomView(ParentViewId): Observable<any> {
          let params = new HttpParams();
          params = params.append('ParentViewId', ParentViewId);
          return this.http.get(APIConstants.GETCUSTOMEVIEW, { params: params })
        }
        GetAssetDetailsWithGroupJson_component(assetId): Observable<any> {
          let params = new HttpParams();
          params = params.append('assetId', assetId);
          return this.http.get(APIConstants.GetAssetDetailsWithGroupJsonComponent, { params: params })
        }

        GetAllViewData(ViewData): Observable<any> {
          let formData = new FormData();
    const blobOverrides = new Blob([JSON.stringify(ViewData)], {
        type: 'application/json',
      });      
    formData.append('data', blobOverrides); 
    return this.http.post(APIConstants.GetAllViewData, formData)
         // let params = new HttpParams();
          //SETSTATUSTOASSETLIST
         // params = params.append('AllStandviewData', AllStandviewData);
         // return this.http.get(APIConstants.GetAllViewData, { params: params })
        }
}