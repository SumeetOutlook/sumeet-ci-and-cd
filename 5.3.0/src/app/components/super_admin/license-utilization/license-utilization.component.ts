import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GroupService } from 'app/components/services/GroupService';
import { ToastrService } from 'ngx-toastr';
import * as resource from '../../../../assets/Resource.json';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { Constants } from 'app/components/storage/constants';
import { CompanyLocationService } from '../../services/CompanyLocationService';
import { CompanyBlockService } from '../../services/CompanyBlockService';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { ReportService } from '../../services/ReportService';
import { LogOnService } from 'app/components/services/LogOnService';

export interface UsersData {
  id:any;
  name: any;
  LicenceCount:any;
  UtilizationCount:any;
  UtilizationCountpercentage:any;
}

const ELEMENT_DATA: UsersData[] = [
  { id:1, name: 'Asset Licenses', LicenceCount : "0",UtilizationCount : "0",UtilizationCountpercentage:"0" },
  { id:2, name: 'User Licenses', LicenceCount : "0",UtilizationCount : "0",UtilizationCountpercentage:"0"},
  { id:3, name: 'Audit Licenses', LicenceCount : "0",UtilizationCount : "0",UtilizationCountpercentage:"0"},
  { id:4, name: 'Transfer Licenses',LicenceCount: "0",UtilizationCount : "0",UtilizationCountpercentage:"0"},
  { id:5, name: 'Retirement Licenses',LicenceCount : "0",UtilizationCount : "0",UtilizationCountpercentage:"0"},
  { id:6, name: 'Assignment Licenses',LicenceCount : "0",UtilizationCount : "0",UtilizationCountpercentage:"0"},
  { id:7, name: 'Company Licenses',LicenceCount : "0",UtilizationCount : "0",UtilizationCountpercentage:"0"},
  { id:8, name: 'Location Licenses',LicenceCount : "0",UtilizationCount : "0",UtilizationCountpercentage:"0"}
];

@Component({
  selector: 'app-license-utilization',
  templateUrl: './license-utilization.component.html',
  styleUrls: ['./license-utilization.component.scss']
})

export class LicenseUtilizationComponent implements OnInit {

  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  message: any = (resource as any).default;

  datasource = new MatTableDataSource<any>();
  dataSource = ELEMENT_DATA;

  displayedColumns: string[] = ['license', 'count','Allcount', 'alertCountPercent', 'tolercenceCountLevel'];
  LicenseTermsData: any;
  GridData: any[];
  LicenseType:any;
  CompanyDistributionData: any[] = [];

  Company_Distribution_Data = [
    {
      name: 'Total Asset Count',
      totalCount : 0,
      companyList: [],
      disabled:true
    },
    {
      name: 'Total User',
      totalCount : 0,
      companyList: [],
      disabled:true
    },
    {
      name: 'Total Audit',
      totalCount : 0,
      companyList: [],
      disabled:true
    },
    {
      name: 'Transfer Licenses',
      totalCount : 0,
      companyList: [],
      disabled:true
    },
    {
      name: 'Retirment Licenses',
      totalCount : 0,
      companyList: [],
      disabled:true
    },
    {
      name: 'Assignment Licenses',
      totalCount : 0,
      companyList: [],
      disabled:true
    }
  ];
  profileId: any;
  CompanyId: any;
  GroupId: any;
  UserId: any;
  RegionId: any;
  layerid: any;
  IslayerDisplay: any;
  Layertext: any;
  HeaderLayerText: any;
  
  public array_group;
  public array_region;
  public array_company;
  constructor( public gp: GroupService,
    public toastr: ToastrService,
    private storage: ManagerService,
    public cls: CompanyLocationService,
    public cbs: CompanyBlockService,
    public rps: ReportService,
    public LoginService: LogOnService) { }
  
  
  ngOnInit(): void {
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    this.profileId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_PROFILE);
    this.layerid = this.storage.get(Constants.SESSSION_STORAGE, Constants.LAYER_ID);
    this.IslayerDisplay = this.layerid;
    if (this.layerid == 1) {
      this.Layertext = "Country";
    }
    else if (this.layerid == 2) {
      this.Layertext = "State";
    }
    else if (this.layerid == 3) {
      this.Layertext = "City";
    }
    else if (this.layerid == 4) {
      this.Layertext = "Zone";
    }
    this.HeaderLayerText = this.Layertext;
    this.GetInitiatedData();
    this.GetGridData();
  }
   
  GetGridData() {
    debugger;
    this.gp.GetAllLicenseDetails(this.GroupId).subscribe(r => {
      debugger;
      this.GridData = [];
      if (!!r) {
        this.GridData = JSON.parse(r);
        console.log('data',this.GridData)
        this.GridData.forEach(element => {
          if (element.Type == '1') {
            element.TypeName = 'Perpetual';
          }
          if (element.Type == '2') {
            element.TypeName = 'Saas';
          }
          if (element.Type == '3') {
            element.TypeName = 'Support';
          }
          // if(element.LicenseLevel== 'G')
          // {
          //   this.LicenseGroup = true;
          // }
          // else{
          //   this.LicenseGroup = false;
          // }
        })
      }
      this.onChangedatasource(this.GridData);
    })
  }
  onChangedatasource(value) {
    debugger;
    this.datasource = new MatTableDataSource(value);
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }
  GridData1:any[] = []
  ListOfCategory: any[] = [];
  ListOfLoc: any[] = [];
  ListOfSBU: any[] = [];
  bindData1: any[] = [];
  bindData: any[] = [];
  LocationIdList: any[] = [];
  CategoryIdList: any[] = [];
  SbuList: any[] = [];
  RegionIdList: any[] = [];
  CompanyIdList: any[] = [];
  GetInitiatedData() {
    debugger;
    let url1 = this.cls.GetLocationListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 85);
    let url2 = this.cbs.GetCategoryListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 85);
    //this.loader.open();
    //this.Showprogressbar = true;
    forkJoin([url1, url2]).subscribe(results => {
      if (!!results[0]) {
        this.ListOfLoc = JSON.parse(results[0]);
        this.ListOfLoc.forEach(x => {
          this.LocationIdList.push(x.LocationId);
        })
        this.ListOfSBU = this.UniqueArraybyId(this.ListOfLoc, this.Layertext);
        this.ListOfSBU.forEach(x => {
          this.SbuList.push(x[this.Layertext]);
        })
      }
      debugger;
      if (!!results[1]) {
        this.ListOfCategory = JSON.parse(results[1]);
        this.ListOfCategory.forEach(x => {
          this.CategoryIdList.push(x.AssetCategoryId);
        })
      }

      if (this.RegionId != "0") {
        this.RegionIdList.push(this.RegionId);
      }
      if (this.CompanyId != "0") {
        this.CompanyIdList.push(this.CompanyId);
      }
     // this.loader.close();
     //this.Showprogressbar =false;

      //this.GetDashBoardCount();
      //this.GetPageSession();
    })
  }

  UniqueArraybyId(collection, keyname) {
    var output = [],
      keys = [];

    collection.forEach(item => {
      var key = item[keyname];
      if (keys.indexOf(key) === -1) {
        keys.push(key);
        output.push(item);
      }
    });
    return output;
  };
  GetGroupRegionCompany() {
    debugger;
    const UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    const ProfileId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_PROFILE);

    this.array_group = [];
    this.array_region = [];
    this.array_company = [];

    this.LoginService.GetGroupRegionCompany(UserId,ProfileId)
      .subscribe(r => {

        let Obj: any[] = JSON.parse(r);
        Obj.forEach(element => {
          if (element.LevelId === 1) {
            this.array_group.push(element)
          }
          else if (element.LevelId === 2) {
            this.array_region.push(element)
          }
          else if (element.LevelId === 3) {
            this.array_company.push(element)
          }
        });
        //this.dataSource[6].UtilizationCount= this.array_company.count;
        // this.groupdatasource = new MatTableDataSource(this.array_group);
        // this.regiondatasource = new MatTableDataSource(this.array_region);
        // this.legaldatasource = new MatTableDataSource(this.array_company);
      })
  }
  UtilizationCount:any;
  UtilizationCountpercentage:any
  GetDashBoardCount() {
    debugger;

    if (this.LocationIdList.length == 0) {
      this.ListOfLoc.forEach(x => {
        this.LocationIdList.push(x.LocationId);
      })
    }
    if (this.CategoryIdList.length == 0) {
      this.ListOfCategory.forEach(x => {
        this.CategoryIdList.push(x.AssetCategoryId);
      })
    }
    if (this.SbuList.length == 0) {
      this.ListOfSBU.forEach(x => {
        this.SbuList.push(x[this.Layertext]);
      })
    }
    var assetDetails = {
      LocationIdList: this.LocationIdList,
      UserId: this.UserId,
      GroupId: this.GroupId,
      CategoryIdList: this.CategoryIdList,
      SbuList: this.SbuList,
      RegionIdList: this.RegionIdList,
      CompanyIdList: this.CompanyIdList
    }
    //this.loader.open();
    //this.Showprogressbar = true;
    this.rps.GetDashBoardCount(assetDetails).subscribe(r => {
      debugger;
     // this.loader.close();
    // this.Showprogressbar = false;
      if (!!r) {
        this.bindData = JSON.parse(r);
        console.log(this.bindData);
        var AllCount = this.bindData[0].allCount.split(',');
        var  retire = this.bindData[0].retireCount.split(',');
        var tagged = this.bindData[0].taggedCount.split(',');
        //  var User = this.bindData[0].Usercount.split(',');
        //  var Transfer = this.bindData[0].TransferCount.split(',');
        //  var Assetallocation =  this.bindData[0].assetaallocationcount.split(',');
        //  var location = this.bindData[0].LocationCount.split(',');
        // var company = this.bindData[0].LocationCount.split(',');

        this.dataSource[0].UtilizationCount= AllCount[0];// Assetcount
        this.dataSource[1].UtilizationCount= this.bindData[0].Usercount;// usercount
        this.dataSource[2].UtilizationCount= tagged[0];  // AuditCOunt
        this.dataSource[3].UtilizationCount= this.bindData[0].TransferCount; //Transfercount
        this.dataSource[4].UtilizationCount= retire[0]; //retimentcount
        this.dataSource[5].UtilizationCount= this.bindData[0].Assetallocation; //Assetallocation
        this.dataSource[6].UtilizationCount= this.bindData[0].Companycount; //CompanyCount
        this.dataSource[7].UtilizationCount= this.bindData[0].LocationCount; //LocationCount
      }
    })
    //this.GetCountForDashBoardInventoryDueDates(assetDetails);

  }
  GetLicenseTermsById(val) {
    debugger;
    var LicenseId = val.LicenseID;
    this.GridData1 = [];
    this.GetDashBoardCount();
    this.GetGroupRegionCompany();
    this.gp.GetLicenseTermsById(LicenseId).subscribe(r => {
      debugger;
      if (!!r) {


        var  LicenseTermsData = JSON.parse(r);
        this.LicenseTermsData = LicenseTermsData[0];
        this.GridData1 = JSON.parse(r);
        this.dataSource[0].LicenceCount= this.GridData1[0].TotalAssetCount;
        this.dataSource[0].UtilizationCountpercentage= parseInt(this.dataSource[0].LicenceCount) - parseInt(this.dataSource[0].UtilizationCount);
        //this.dataSource[0].tolercenceCountLevel= this.GridData1[0].AllocatedCountToleranceLevel;
        this.dataSource[1].LicenceCount= this.GridData1[0].TotalUsers;
        this.dataSource[1].UtilizationCountpercentage= parseInt(this.dataSource[1].LicenceCount) - parseInt(this.dataSource[1].UtilizationCount);
        //this.dataSource[1].tolercenceCountLevel= this.GridData1[0].AuditedCountToleranceLevel;
        this.dataSource[2].LicenceCount= this.GridData1[0].AuditedCount;
        this.dataSource[2].UtilizationCountpercentage= parseInt(this.dataSource[2].LicenceCount) - parseInt(this.dataSource[2].UtilizationCount);
        //this.dataSource[2].tolercenceCountLevel= this.GridData1[0].AuditedCountToleranceLevel;
        this.dataSource[3].LicenceCount= this.GridData1[0].TransferCount;
        this.dataSource[3].UtilizationCountpercentage= parseInt(this.dataSource[3].LicenceCount) - parseInt(this.dataSource[3].UtilizationCount);;
        //this.dataSource[3].tolercenceCountLevel= this.GridData1[0].AllocatedCountToleranceLevel;
        this.dataSource[4].LicenceCount= this.GridData1[0].RetirementCount;
        this.dataSource[4].UtilizationCountpercentage= parseInt(this.dataSource[4].LicenceCount) - parseInt(this.dataSource[4].UtilizationCount);;
        //this.dataSource[4].tolercenceCountLevel= this.GridData1[0].AllocatedCountToleranceLevel;
        this.dataSource[5].LicenceCount= this.GridData1[0].AllocatedCount;
        this.dataSource[5].UtilizationCountpercentage= parseInt(this.dataSource[5].LicenceCount) - parseInt(this.dataSource[5].UtilizationCount);;
        //this.dataSource[5].tolercenceCountLevel= this.GridData1[0].AllocatedCountToleranceLevel;
        this.dataSource[6].LicenceCount= this.GridData1[0].TotalCompanies;
        this.dataSource[6].UtilizationCountpercentage= parseInt(this.dataSource[6].LicenceCount) - parseInt(this.dataSource[6].UtilizationCount);;
        // this.dataSource[6].UtilizationCountpercentage= this.GridData1[0].AllocatedCountAlertPercentage;
        // this.dataSource[6].tolercenceCountLevel= this.GridData1[0].AllocatedCountToleranceLevel;
        this.dataSource[7].LicenceCount= this.GridData1[0].TotalLocation;
        this.dataSource[7].UtilizationCountpercentage= parseInt(this.dataSource[7].LicenceCount) - parseInt(this.dataSource[7].UtilizationCount);;
        // this.dataSource[7].alertCountPercent= this.GridData1[0].AllocatedCountAlertPercentage;
        // this.dataSource[7].tolercenceCountLevel= this.GridData1[0].AllocatedCountToleranceLevel;
        this.CompanyDistribution();
      }
    })
  }
  
  CompanyDistribution() {
    debugger;
    var LicenseID = this.LicenseTermsData.LicenseID;
    var TermID = this.LicenseTermsData.TermID;
    this.gp.GetLicenseCompanyDistributionById(LicenseID, TermID).subscribe(r => {
      debugger;
      if (!!r) {
        this.CompanyDistributionData = [];
        this.CompanyDistributionData = JSON.parse(r);
        this.Company_Distribution_Data.forEach(element => {
          element.companyList = [];
        });
        for (var j = 0; j < this.CompanyDistributionData.length; j++) {
          for (var i = 0; i < this.Company_Distribution_Data.length; i++) {
            debugger;
            if(this.Company_Distribution_Data[i].name == 'Total Asset Count'){
              var aa = {
                CompanyId : this.CompanyDistributionData[j].CompanyId,
                CompanyName : this.CompanyDistributionData[j].CompanyName,
                Count : this.CompanyDistributionData[j].TotalAssetCount
              }
              this.Company_Distribution_Data[i].totalCount = this.LicenseTermsData.TotalAssetCount;
              this.Company_Distribution_Data[i].companyList.push(aa);              
            }
            if(this.Company_Distribution_Data[i].name == 'Total User'){
              var aa = {
                CompanyId : this.CompanyDistributionData[j].CompanyId,
                CompanyName : this.CompanyDistributionData[j].CompanyName,
                Count : this.CompanyDistributionData[j].TotalUsers
              }
              this.Company_Distribution_Data[i].totalCount = this.LicenseTermsData.TotalUsers;
              this.Company_Distribution_Data[i].companyList.push(aa); 
            }
            if(this.Company_Distribution_Data[i].name == 'Total Audit'){
              var aa = {
                CompanyId : this.CompanyDistributionData[j].CompanyId,
                CompanyName : this.CompanyDistributionData[j].CompanyName,
                Count : this.CompanyDistributionData[j].AuditedCount
              }
              this.Company_Distribution_Data[i].totalCount = this.LicenseTermsData.AuditedCount;
              this.Company_Distribution_Data[i].companyList.push(aa); 
            }
            if(this.Company_Distribution_Data[i].name == 'Transfer Licenses'){
              var aa = {
                CompanyId : this.CompanyDistributionData[j].CompanyId,
                CompanyName : this.CompanyDistributionData[j].CompanyName,
                Count : this.CompanyDistributionData[j].TransferCount
              }
              this.Company_Distribution_Data[i].totalCount = this.LicenseTermsData.TransferCount;
              this.Company_Distribution_Data[i].companyList.push(aa); 
            }
            if(this.Company_Distribution_Data[i].name == 'Retirment Licenses'){
              var aa = {
                CompanyId : this.CompanyDistributionData[j].CompanyId,
                CompanyName : this.CompanyDistributionData[j].CompanyName,
                Count : this.CompanyDistributionData[j].RetirementCount
              }
              this.Company_Distribution_Data[i].totalCount = this.LicenseTermsData.RetirementCount;
              this.Company_Distribution_Data[i].companyList.push(aa);
            } 
            if(this.Company_Distribution_Data[i].name == 'Assignment Licenses'){
              var aa = {
                CompanyId : this.CompanyDistributionData[j].CompanyId,
                CompanyName : this.CompanyDistributionData[j].CompanyName,
                Count : this.CompanyDistributionData[j].AllocatedCount
              }
              this.Company_Distribution_Data[i].totalCount = this.LicenseTermsData.AllocatedCount;
              this.Company_Distribution_Data[i].companyList.push(aa); 
            }
          }
        }        
      }
    })
    
  }


}
