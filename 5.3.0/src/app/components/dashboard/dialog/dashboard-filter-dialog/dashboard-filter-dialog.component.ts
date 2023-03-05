
import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { CompanyBlockService } from '../../../services/CompanyBlockService';
import { CompanyLocationService } from '../../../services/CompanyLocationService';
import { DatePipe } from '@angular/common';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import * as header from '../../../../../assets/Headers.json';
import * as resource from '../../../../../assets/Resource.json';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MessageAlertService } from '../../../../shared/services/app-msg-alert/app-msg.service';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';


@Component({
  selector: 'app-dashboard-filter-dialog',
  templateUrl: './dashboard-filter-dialog.component.html',
  styleUrls: ['./dashboard-filter-dialog.component.scss']
})
export class DashboardFilterDialogComponent implements OnInit {

  Headers: any ;
  message: any = (resource as any).default;
  CompanyId: any;
  RegionId: any;
  UserId: any;
  GroupId: any;
  layerid: any;
  IslayerDisplay: any;
  Layertext: any;
  HeaderLayerText: any;
  dialogForm: FormGroup;
  LocationIdList: any[] = [];
  CategoryIdList: any[] = [];
  SbuList: any[] = [];
  RegionIdList: any[] = [];
  CompanyIdList: any[] = [];

  public cityMultiCtrl: any;
  public cityMultiFilterCtrl: FormControl = new FormControl();
  public filteredCityMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public plantMultiCtrl: any;
  public plantMultiFilterCtrl: FormControl = new FormControl();
  public filteredPlantsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public categoryMultiCtrl: any;
  public categoryFilterCtrl: FormControl = new FormControl();
  public filteredcategoryMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  protected _onDestroy = new Subject<void>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    public cbs: CompanyBlockService,
    public cls: CompanyLocationService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private loader: AppLoaderService,
    private fb: FormBuilder,
    public alertService: MessageAlertService,
    private jwtAuth : JwtAuthService
  ) 
  {
    this.Headers = this.jwtAuth.getHeaders()
   }

  ngOnInit(): void {
    debugger;
    this.CompanyId = this.data.configdata.CompanyId;
    this.RegionId = this.data.configdata.RegionId;
    this.UserId = this.data.configdata.UserId;
    this.GroupId = this.data.configdata.GroupId;
    this.LocationIdList = this.data.configdata.LocationIdList;
    this.CategoryIdList = this.data.configdata.CategoryIdList;
    this.SbuList = this.data.configdata.SbuList;
    this.RegionIdList = this.data.configdata.RegionIdList;
    this.CompanyIdList = this.data.configdata.CompanyIdList;

    this.dialogForm = this.fb.group({
    })
    this.layerid = this.data.configdata.layerid;
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
  }



  ListOfCategory: any[] = [];
  ListOfCategory1: any[] = [];
  ListOfLoc: any[] = [];
  ListOfLoc1: any[] = [];
  ListOfSBU: any[] = [];
  // GetInitiatedData() {
  //   debugger;
  //   this.loader.open();
  //   let url1 = this.cls.GetLocationListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 85);
  //   let url2 = this.cbs.GetCategoryListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 85);
  //   forkJoin([url1, url2]).subscribe(results => {  
  //   })
  // }  
  GetInitiatedData() {
    this.ListOfLoc = this.data.configdata.ListOfLoc;
    this.ListOfLoc1 = this.data.configdata.ListOfLoc;
    this.ListOfSBU = this.UniqueArraybyId(this.ListOfLoc, this.Layertext);
    this.getFilterCityType();
    this.getFilterPlantType();
    debugger;
    var plantMulti = [];
    this.ListOfLoc.forEach(x => {
      var idx = this.LocationIdList.indexOf(x.LocationId);
      if (idx > -1) {
        plantMulti.push(x)
      }
    })
    this.plantMultiCtrl = plantMulti;

    // var cityMulti = [];
    // this.ListOfSBU.forEach(x => {          
    //   var idx = this.SbuList.indexOf(x[this.Layertext]);
    //   if(idx > -1){
    //     cityMulti.push(x)
    //   }
    // })
    this.cityMultiCtrl = this.SbuList;
    if (!!this.cityMultiCtrl) {
      this.onchangeSBU('');
    }
    this.ListOfCategory = this.data.configdata.ListOfCategory;
    this.ListOfCategory1 = this.data.configdata.ListOfCategory;
    this.getFilterCategoryType();
    var categoryMulti = [];
    this.ListOfCategory.forEach(x => {
      var idx = this.CategoryIdList.indexOf(x.AssetCategoryId);
      if (idx > -1) {
        categoryMulti.push(x)
      }
    })
    this.categoryMultiCtrl = categoryMulti;
    if (this.ListOfLoc.length == 0) {
      this.dialogRef.close(false);
      this.alertService.alert({ message: this.message.NotAuthorisedToAccess, title: this.message.AssetrakSays })
        .subscribe(res => {

        })
    }

  }

  onchangeSBU(value) {
    debugger;
    var list = [];

    if (!!this.cityMultiCtrl) {
      this.cityMultiCtrl.forEach(x => {
        this.ListOfLoc = this.ListOfLoc1.filter(y => y[this.Layertext].indexOf(x) > -1);
        this.ListOfLoc.forEach(x => {
          list.push(x);
        })
      })
    }
    this.ListOfLoc = list;
    this.getFilterPlantType();
  }

  Submit() {
    debugger;
    var LocationIdList = [];
    var SbuList = [];

    var CategoryIdList = [];
    if (!!this.plantMultiCtrl) {
      this.plantMultiCtrl.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }
    else {
      this.ListOfLoc.forEach(x => {
        LocationIdList.push(x.LocationId);
      })
    }

    if (!!this.categoryMultiCtrl) {
      this.categoryMultiCtrl.forEach(x => {
        CategoryIdList.push(x.AssetCategoryId);
      })
    }
    else {
      this.ListOfCategory.forEach(x => {
        CategoryIdList.push(x.AssetCategoryId);
      })
    }

    var assetDetails = {
      LocationIdList: LocationIdList,
      UserId: this.UserId,
      GroupId: this.GroupId,
      CategoryIdList: CategoryIdList,
      SbuList: !!this.cityMultiCtrl ? this.cityMultiCtrl : [],
      RegionIdList: [this.RegionId],
      CompanyIdList: [this.CompanyId]
    }
    this.dialogRef.close(assetDetails);
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
    this.filteredCityMulti.next(this.ListOfSBU.slice(0, this.offset + this.limit ));
    this.cityMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
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
  limit = 10;
  offset = 0;
  getFilterPlantType() {
    this.filteredPlantsMulti.next(this.ListOfLoc.slice(0, this.offset + this.limit));
    this.plantMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPlantsMulti();
      });
  }
  protected filterPlantsMulti() {
    if (!this.ListOfLoc) {
      return;
    }
    let search = this.plantMultiFilterCtrl.value;
    if (!search) {
      this.filteredPlantsMulti.next(this.ListOfLoc.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredPlantsMulti.next(
      this.ListOfLoc.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1)
    );
  }
  getFilterCategoryType() {
    this.filteredcategoryMulti.next(this.ListOfCategory.slice(0, this.offset + this.limit));
    this.categoryFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCategoryMulti();
      });
  }
  protected filterCategoryMulti() {
    if (!this.ListOfCategory) {
      return;
    }
    let search = this.categoryFilterCtrl.value;
    if (!search) {
      this.filteredcategoryMulti.next(this.ListOfCategory.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredcategoryMulti.next(
      this.ListOfCategory.filter(x => x.AssetCategoryName.toLowerCase().indexOf(search) > -1)
    );
  }

  
  toggleSelectAllcategory(selectAllValue) {
    this.categoryMultiCtrl = [];
    this.filteredcategoryMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (!!selectAllValue.checked) {
          this.ListOfCategory.forEach(element => {
            this.categoryMultiCtrl.push(element);
          });
        } else {
          this.categoryMultiCtrl = "";
        }
      });
  }

  toggleSelectAllCity(selectAllValue) {
    this.cityMultiCtrl = [];
    this.filteredCityMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (!!selectAllValue.checked) {
          this.ListOfSBU.forEach(element => {
            this.cityMultiCtrl.push(element[this.Layertext]);
          });
        } else {
          this.cityMultiCtrl = "";
        }
        this.onchangeSBU('');
      });
  }


 
  toggleSelectAll(selectAllValue) {
    this.plantMultiCtrl = [];
    this.filteredPlantsMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (!!selectAllValue.checked) {
          //this.plantMultiCtrl.patchValue(val);
          this.ListOfLoc.forEach(element => {
            this.plantMultiCtrl.push(element);
          });
        } else {
          this.plantMultiCtrl = "";
        }
        this.ListOfCategory = this.ListOfCategory1;
        this.getFilterCategoryType();
      });
  }

}
