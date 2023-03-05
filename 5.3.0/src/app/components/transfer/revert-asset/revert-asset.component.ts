import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { ReconciliationService } from '../../services/ReconciliationService';
import { CompanyLocationService } from '../../services/CompanyLocationService';
import { UserMappingService } from '../../services/UserMappingService';
import { CompanyBlockService } from '../../services/CompanyBlockService';
import { GroupService } from '../../services/GroupService';
import { UserService } from '../../services/UserService';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { Constants } from 'app/components/storage/constants';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-revert-asset',
  templateUrl: './revert-asset.component.html',
  styleUrls: ['./revert-asset.component.scss']
})
export class RevertAssetComponent implements OnInit {

  Headers: any;
  message: any;
  city = new FormControl();
  plant = new FormControl();

  public cityMultiCtrl: any;
  public cityMultiFilterCtrl: FormControl = new FormControl();
  public filteredCityMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public plantMultiCtrl: any;
  public plantMultiFilterCtrl: FormControl = new FormControl();
  public filteredPlantsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  toppings = new FormControl();
  ListOfSBU: any[] = [];
  result: any[] = [];
  CompanyId: any;
  GroupId: any;
  UserId: any;
  RegionId: any;
  IsCompanyAdmin: any = 1;
  IslayerDisplay: any;
  layerid: any;
  Layertext: any;
  HeaderLayerText: any;
  sbutosbunotallowed: any;
  ListOfField: any[] = [];
  ListOfFilter: any[] = [];
  ListOfFilterName: any[] = [];
  ListOfPagePermission: any[] = [];
  ListOfLoc: any[] = [];
  ListOfLoc1: any[] = [];

  constructor(
    public rs: ReconciliationService,
    public cls: CompanyLocationService,
    public ums: UserMappingService,
    public cbs: CompanyBlockService,
    public gs: GroupService,
    public us: UserService,
    private storage: ManagerService,
    private router: Router,
    public alertService: MessageAlertService,
    private jwtAuth: JwtAuthService,
    ){
       debugger;
       this.Headers = this.jwtAuth.getHeaders();
       this.message = this.jwtAuth.getResources();
    }

  ngOnInit(): void {
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID),
      this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID),
      this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID),
      this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID),
      this.layerid = 3;
    this.GetInitiatedData();
  }

  showAssets() {
    console.log('city', this.cityMultiCtrl);
    const assetsDetails = {
      CompanyId: this.CompanyId,
      LocationIdList: this.plantMultiCtrl,
      TransitTypes: 1,
      pageNo: 1,
      pageSize: 50,
      searchText: "",
      IsSearch: false,
      IsForRevert: false,
      UserId: this.UserId,
      TransferType: 1,
      IsExport: false,
      BlockIdList: [],
      RegionId: this.RegionId,
      SbuList: this.cityMultiCtrl,
      typeOfAssetList: [],
      subTypeOfAssetList: [],
    }; console.log(assetsDetails);
    this.rs.getAssetListToInvert(assetsDetails).subscribe(response => {
      console.log(response);
    })
  }

  revertAssets() {
    const assetDetails = {
      LocationId: 1,
      TransitTypes: 2,
      AssetList: [],
      IsForRevert: true,
      LastModifiedBy: this.UserId,
      TransferType: 1
    };
    this.rs.revertAsset(assetDetails).subscribe(response => {
      console.log(response);
    })
  }
  PermissionIdList: any[] = [];
  GetInitiatedData() {
    let url1 = this.cls.GetLocationListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 45);
    let url2 = this.cbs.GetCategoryListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 45);
    let url3 = this.gs.GetFieldListByPageId(45,this.UserId, this.CompanyId);
    let url4 = this.gs.GetFilterIDlistByPageId(45);
    let url5 = this.gs.CheckWetherConfigurationExist(this.GroupId, 45);
    let url6 = this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.RegionId, "45");
    forkJoin([url1, url2, url3, url4, url5, url6]).subscribe(results => {
      if (!!results[0]) {
        this.ListOfLoc = JSON.parse(results[0]);
        this.ListOfLoc1 = this.ListOfLoc;
        this.ListOfSBU = this.UniqueArraybyId(this.ListOfLoc1, 'City');
        console.log(this.ListOfSBU);
        this.getFilterCityType();
        this.getFilterPlantType();
      }
      if (!!results[2]) {
        this.ListOfField = JSON.parse(results[2]);
      }
      if (!!results[3]) {
        this.ListOfFilter = JSON.parse(results[3]);
        if (!!this.ListOfFilter) {
          this.ListOfFilter.forEach(x => this.ListOfFilterName.push(x.FilterName))
        }
        console.log(this.ListOfFilter);
      }
      this.sbutosbunotallowed = results[4];
      if (!!results[5]) {
        this.ListOfPagePermission = JSON.parse(results[5]);
        console.log("PagePermission", this.ListOfPagePermission)
        if (this.ListOfPagePermission.length > 0) {
          for (var i = 0; i < this.ListOfPagePermission.length; i++) {
            this.PermissionIdList.push(this.ListOfPagePermission[i].ModulePermissionId);
          }
        }
        else {
          this.alertService.alert({ message: this.message.NotAuthorisedToAccess, title: this.message.AssetrakSays })
            .subscribe(res => {
              this.router.navigateByUrl('h/a')
            })
        }
      }
    })
  }

  getFilterPlantType() {
    this.filteredPlantsMulti.next(this.ListOfLoc1.slice());
    this.plantMultiFilterCtrl.valueChanges
      .subscribe(() => {
        this.filterPlantsMulti();
      });
  }

  protected filterPlantsMulti() {
    if (!this.ListOfLoc1) {
      return;
    }
    let search = this.plantMultiFilterCtrl.value;
    if (!search) {
      this.filteredPlantsMulti.next(this.ListOfLoc1.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredPlantsMulti.next(
      this.ListOfLoc1.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1)
    );
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

  getFilterCityType() {
    this.filteredCityMulti.next(this.ListOfSBU.slice());
    this.cityMultiFilterCtrl.valueChanges
      .subscribe(() => {
        this.filterCityMulti();
      });
  }
  protected filterCityMulti() {
    if (!this.ListOfSBU) {
      return;
    }
    let search = this.cityMultiFilterCtrl.value;
    if (!search) {
      this.filteredCityMulti.next(this.ListOfSBU.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCityMulti.next(
      this.ListOfSBU.filter(x => x.City.toLowerCase().indexOf(search) > -1)
    );
  }

  toggleSelectAllCity(selectAllValue: boolean) {
    this.filteredCityMulti
      .subscribe(val => {
        if (selectAllValue) {
          this.cityMultiCtrl.patchValue(val);
        } else {
          this.cityMultiCtrl.patchValue([]);
        }
      });
  }

}
