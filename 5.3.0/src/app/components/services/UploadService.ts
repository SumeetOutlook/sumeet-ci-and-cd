import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APIConstants } from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';


@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(private http: HttpClient) { }

  UploadFile(fileData: FormData): Observable<any> {
    return this.http.post(APIConstants.UPLOADFILE, fileData)
  }
  UploadNormalAsset(AssetDetail): Observable<any> {
    // let body = JSON.stringify(AssetDetail);  
    // const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.post(APIConstants.INSERTNORMALASSETDATA, AssetDetail)
  }
  UploadMultipleAssets(fileData: FormData): Observable<any> {
    return this.http.post(APIConstants.UPLOADMULTIPLEASSETS, fileData)
  }
  AddBulkFarDataWithMultipalExcelUploadGRNJson(AssetDetail): Observable<any> {
    return this.http.post(APIConstants.ADDBULKFARDATAWITHMULTIPALEXCELUPLOADGRNJSON, AssetDetail)
  }

  uploadDocumentCreateGRNAsset(data): Observable<any> {
    let params = new HttpParams();
    params = params.append('documentType', data.documentType);
    params = params.append('CompanyId', data.CompanyId);
    let formData = new FormData();
    formData.append('uploadFile', data.fileList);

    return this.http.post(APIConstants.UPLOADDOCUMENTCEREATEGRNASSET, formData, { params: params })
  }

  uploadDocumentCreateAsset(data): Observable<any> {
    let params = new HttpParams();
    params = params.append('documentType', data.documentType);
    params = params.append('CompanyId', data.CompanyId);
    let formData = new FormData();
    formData.append('uploadFile', data.fileList);

    return this.http.post(APIConstants.UPLOADDOCUMENTCEREATEASSET, formData, { params: params })
  }

  uploadDocument(data): Observable<any> {
    let params = new HttpParams();
    params = params.append('documentType', data.documentType);
    params = params.append('CompanyId', data.CompanyId);
    let formData = new FormData();
    for (var i = 0; i < data.fileList.length; i++) {
      formData.append("file[]", data.fileList[i]);
    }

    return this.http.post(APIConstants.UPLOADDOCUMENT, formData, { params: params })
  }
  CheckGrnNumberDuplicate(AssetDetail): Observable<any> {
    return this.http.post(APIConstants.CHECKGRNNUMBERDUPLICATE, AssetDetail)
  }
  setMissingStatus(AssetDetail): Observable<any> {
    return this.http.post(APIConstants.SETMISSINGSTATUSNEW, AssetDetail)
  }
  GetAssetListByCompanyIdGroupIdUserEmailIdAllocation(AssetDetail): Observable<any> {
    return this.http.post(APIConstants.GETASSETLISTBYCOMPANYIDGROUPIDUSEREMAILIDALLOCATION, AssetDetail)
  }
  UserAlocationAction(AssetDetail): Observable<any> {
    return this.http.post(APIConstants.USERALOCATIONACTION, AssetDetail)
  }
  UploadPhysicalDisposalDocument(data): Observable<any> {
    debugger;
    let params = new HttpParams();
    params = params.append('discardedPhoto', data.discardedPhoto);
    params = params.append('companyId', data.companyId);
    params = params.append('AssetList', data.AssetList);
    let formData = new FormData();

    for (var i = 0; i < data.fileList.length; i++) {
      formData.append("Files", data.fileList[i]);
    }
    return this.http.post(APIConstants.UPLOADPHYSICALDISPOSALDOCUMENT, formData, { params: params })
  }
  GetAllowedExtensions(FunctionId): Observable<any> {
    debugger;
    let params = new HttpParams();
    params = params.append('FunctionId', FunctionId);
    return this.http.get(APIConstants.GETALLOWEDEXTENSIONS, { params: params } )
}
}
