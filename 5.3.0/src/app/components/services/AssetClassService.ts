import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { APIConstants } from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable'

@Injectable({
  providedIn: 'root'
})
export class AssetClassService {

  constructor(private http: HttpClient) { }

  AssetClassGetAll(companyId): Observable<any> {
    let params = new HttpParams();
    params = params.append('companyId', companyId);
    return this.http.get(APIConstants.ASSETCLASSGETALL, { params: params });
  }

  AssetClassInsert(assetClassData): Observable<any> {
    return this.http.post(APIConstants.ASSETCLASSINSERT, assetClassData);
  }

  AssetClassUpdate(assetClassData): Observable<any> {
    return this.http.post(APIConstants.ASSETCLASSUPDATE, assetClassData);
  }

  AssetClassDelete(assetClassData): Observable<any> {
    return this.http.post(APIConstants.ASSETCLASSDELETE, assetClassData);
  }

  ITBlockUpdate(blockId, itblock): Observable<any> {
    let params = new HttpParams();
    params = params.append('blockId', blockId);
    params = params.append('itblock', itblock);
    return this.http.get(APIConstants.ITBLOCKUPDATE, { params: params });
  }

  NFARBlockUpdate(blockId, nfarId): Observable<any> {
    let params = new HttpParams();
    params = params.append('blockId', blockId);
    params = params.append('nfarId', nfarId);
    return this.http.get(APIConstants.NFARBLOCKUPDATE, { params: params });
  }

  AssetClassUpload(uploadedFileInfo): Observable<any> {
    return this.http.post(APIConstants.ASSETCLASSFILEINFO, uploadedFileInfo);
  }

  AssetClassExport(companyId, isExport): Observable<any> {
    let params = new HttpParams();
    params = params.append('companyId', companyId);
    params = params.append('isExport', isExport);
    return this.http.get(APIConstants.ASSETCLASSFILEEXPORT, { params: params });
  }

  CheckAssetCountForBlock(CompanyId, BlockId): Observable<any> {
    let params = new HttpParams();
    params = params.append('companyId', CompanyId);
    params = params.append('blockId', BlockId);
    return this.http.get(APIConstants.ASSETCLASSDELETECHECK, { params: params });
  }

  GetAssetListReprint(assetDetails): Observable<any> {   
    return this.http.post(APIConstants.GetAssetListForReprintLabelsJSON , assetDetails);
  }
  DownloadExcelForReprintLabels(assetDetails): Observable<any> {
    let params = new HttpParams();
    params = params.append('companyId', assetDetails.companyId);
    params = params.append('locationId', assetDetails.locationId);
    params = params.append('pageName', assetDetails.pageName);
    params = params.append('serverPath', assetDetails.serverPath);
    params = params.append('assetStage', assetDetails.assetStage);
    params = params.append('projectType', assetDetails.projectType);
    params = params.append('projectId', assetDetails.projectId);
    params = params.append('labelSize', assetDetails.labelSize);
    params = params.append('labelMaterial', assetDetails.labelMaterial);
    params = params.append('AssetCategory', assetDetails.AssetCategory);
    params = params.append('assetStatus', assetDetails.assetStatus);
    params = params.append('userId', assetDetails.userId);
    params = params.append('PrefarId', assetDetails.PrefarId);
    params = params.append('printingType', assetDetails.printingType);
    return this.http.get(APIConstants.DOWNLOADEXCELFORREPRINTLABELS, { params: params });
  }
}

