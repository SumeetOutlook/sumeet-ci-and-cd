// import { Component, OnInit } from '@angular/core';
import { UserRoleService } from '../../services/UserRoleService';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { CompanyLocationService } from '../../services/CompanyLocationService';
// import { ReplaySubject, Subject } from 'rxjs';
import { UserMappingService } from '../../services/UserMappingService';
import { CompanyBlockService } from '../../services/CompanyBlockService';
import { GroupService } from '../../services/GroupService';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import * as headers from '../../../../assets/Headers.json';
import { HttpClient } from '@angular/common/http';
import { LocalStoreService } from 'app/shared/services/local-store.service';
import {AssetService} from '../../services/AssetService';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { ReconciliationService } from '../../services/ReconciliationService';
import { CompanyService } from '../../services/CompanyService';
import { ReportService } from '../../services/ReportService';
import {RegionService} from '../../services/RegionService';
import {ITAssetsService} from '../../services/ITAssetsService';
// import { GroupService } from '../../services/GroupService';
// import {CompanyBlockService} from '../../services/CompanyBlockService'
@Component({
  selector: 'app-damageor-notin-used',
  templateUrl: './damageor-notin-used.component.html',
  styleUrls: ['./damageor-notin-used.component.scss']
})
export class DamageorNotinUsedComponent implements OnInit {
  GroupId: any;
  CompanyId
  UserId: any;
  RegionId: any;
  loc:any;
  sbu:any;
  astcls:any;
  category:any;
  region: any;
  company:any;
  group:any;
  currency:any;
  locn:any;
  sbn:any;
  astn:any;
  sbusel:any=[];
  type:any;
  locsel:any=[];
  crn:any;
  crnsel:any;
  astsel:any=[];
  catgn:any;
  grpn:any;
  grpnsel:any=[];
  catgnsel:any=[];
  tpn:any;
  tpnsel:any=[];
  subtype:any;
  public cityMultiCtrl: any;
  public cityMultiFilterCtrl: FormControl = new FormControl();
  public filteredCityMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public plantMultiCtrl: any;
  public plantMultiFilterCtrl: FormControl = new FormControl();
  public filteredPlantsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public categoryMultiCtrl: any;
  public categoryFilterCtrl: FormControl = new FormControl();
  public filteredcategoryMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public assetclassMultiCtrl: any;
  public assetclassFilterCtrl: FormControl = new FormControl();
  public filteredAssetClassMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);


public assettypeMultiCtrl: any;
  public assettypeFilterCtrl: FormControl = new FormControl();
  public filteredAssetTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public assetsubtypeMultiCtrl: any;
  public assetsubtypeFilterCtrl: FormControl = new FormControl();
  public filteredAssetSubTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  constructor(private rcs: ReconciliationService,private itas: ITAssetsService,private gs: GroupService,private cs: CompanyService,private urs:UserRoleService,private storage: ManagerService , private cbs: CompanyBlockService,private rgs: RegionService) { }

  ngOnInit(): void {
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID),
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID),
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID),
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID)
     this.getLocations();
     this.getAllSBu();
    this.GetCompanyBlockListByCompanyId();
    this.GetAllCategory();
    this.GetRegionstobind();
 this.GetCompanytoDisplay();
 this.GetGrouptoDisplay();
 this.GetSubtype();//(later)
 this.GetTypeAsset();//(later)
 this.GetCurrency();
  }

  getLocations(){
    this.urs.GetAllLocations(this.CompanyId).subscribe(data=>{
      console.log('location: ',data);
      this.loc = data;
     // console.log(this.loc)
    })
  }

  getAllSBu(){
    this.urs.GetAllSBU(this.CompanyId).subscribe(data=>{
        console.log('SBU: ',data);
      this.sbu = data;
      // console.log(this.sbu)
    })
  }

  GetCompanyBlockListByCompanyId(){
    this.cbs.GetCompanyBlockListByCompanyId(this.CompanyId).subscribe(data=>{
        console.log('asset class: ',JSON.parse(data));
        this.astcls = JSON.parse(data);
      })
  }

  GetAllCategory(){
    this.urs.GetAllCategory(this.CompanyId).subscribe(data=>{
      console.log('category: ',data);
      this.category = data;
    })
  }

  GetRegionstobind(){
    this.rgs.GetRegionstoBind(this.GroupId).subscribe(data=>{
      //console.log('Regions: ',data);//(not allowed)
      this.region = data;
    })
  }
  GetCompanytoDisplay(){
    this.cs.GetCompanytoBind(this.GroupId,this.RegionId).subscribe(data=>{
      // console.log('company: ',data);//(not allowed)
      this.company = data;
    })
  }
GetGrouptoDisplay(){
this.gs.GetAllGroupData(this.GroupId).subscribe(data=>{
  console.log('Group: ',data)
  this.group = data;
})
}
GetSubtype(){
  this.itas.GetAllSubtypeData(1,this.CompanyId).subscribe(data=>{
    console.log('subtype: ',data)
    this.subtype = data
  })
}

GetTypeAsset(){
  var typeData = {
    CompanyId: this.CompanyId,
  }
  this.itas.GetTypeOfAssetList(this.CompanyId).subscribe(data=>{
    console.log('Type: ',JSON.parse(data));
    this.type = JSON.parse(data);
  })
}
GetCurrency(){
  this.cs.GetCurencyRateForConversion(this.GroupId,this.CompanyId).subscribe(data=>{
   //  console.log('Currency: ',JSON.parse(data));
    this.currency = JSON.parse(data)
  })
}
  GetDamagenotinUseAsset() {
    console.log('damage')
    
    
    this.locn.forEach(element => {
      this.locsel.push(element.LocationId)

    });
    console.log('location selected ', this.locsel);
    this.sbn.forEach(element => {
      this.sbusel.push(element.Id)
    });
    console.log('SBU selected ', this.sbusel);
    this.astn.forEach(element => {
      this.astsel.push(element.Id)
    });
    console.log('Asset selected ', this.astsel);
    this.catgn.forEach(element => {
      this.catgnsel.push(element.AssetCategoryId)
    });
    console.log('Category selected ', this.catgnsel);
    this.grpn.forEach(element => {
      this.grpnsel.push(element.GroupId)
    });
    console.log('Group selected ', this.catgnsel);
    this.tpn.forEach(element => {
      this.tpnsel.push(element.TAId)
    });
    console.log('Type selected ', this.tpnsel);
    // this.crn.forEach(element => {
    //   this.crnsel.push(element.BaseCurrency)
    // });
  
    console.log('Currency selected: ',this.crn.BaseCurrency)
    var assetDto={
      DisplayColumnName: "",
      assetconditionlist :3,
      GroupId:this.GroupId,
      regionId:this.RegionId,
      CompanyIds:this.CompanyId,
      UserId:"",
      blockIdList:this.astsel,
      isExport:false,
      locationIds:this.locsel,
      pageNumber:1,
      pageSize:50,
      searchtext:"",
      searchColumn:"",
      sbulist:this.sbusel,
      categoryIdList:this.catgnsel,
      typeofassetlist:this.tpnsel,
      subtypeofassetlist:"",
      selectedCurrency:this.crn.BaseCurrency

    }
    console.log(assetDto)
    this.rcs.GetDamaged(assetDto).subscribe(data=>{
      debugger
      console.log(data)
    })
  }

}
