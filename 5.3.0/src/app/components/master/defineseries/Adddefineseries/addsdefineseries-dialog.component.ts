import { Component, OnInit, Inject, ViewChild, EventEmitter , HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import * as header from '../../../../../assets/Headers.json';
import * as resource from '../../../../../assets/Resource.json';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { DefineseriesService } from '../../../services/DefineseriesService';

import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';


import { ReconciliationService } from '../../../services/ReconciliationService';
import { CompanyLocationService } from '../../../services/CompanyLocationService';
import { UserMappingService } from '../../../services/UserMappingService';
import { CompanyBlockService } from '../../../services/CompanyBlockService';
import { GroupService } from '../../../services/GroupService';
import { UserService } from '../../../services/UserService';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { ToastrService } from 'ngx-toastr';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';




@Component({
  selector: 'app-addsdefineseries-dialog',
  templateUrl: './addsdefineseries-dialog.component.html',
  styleUrls: ['./addsdefineseries-dialog.component.scss']
})
export class AddsDefineSeriesDialogComponent implements OnInit {
  Headers: any ;
  message: any = (resource as any).default;
  submitted: boolean = false;
  array;
  public cpuClass: string;
  dialogForm: FormGroup;
  formControlName: string = 'name';
  disabled = false;
  splitedName: any[] = [];
  asset: boolean = false;
  record: boolean = false;
  Global: boolean = true;
  Global1: boolean = false;
  unamePattern: "/^[a-zA-Z0-9 :_\\\/|.-]+$/";
  Selectedvalueforglobal = "Global";

  public CategoryCtrl: FormControl = new FormControl();
  public CategoryFilter: FormControl = new FormControl();
  public filteredCategory: ReplaySubject<any[]> = new ReplaySubject<any[]>(2);

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


  protected _onDestroy = new Subject<void>();



  get f() { return this.dialogForm.controls; };

  constructor(public dialogRef: MatDialogRef<AddsDefineSeriesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder, public localService: LocalStoreService,
    private defineseriesservies: DefineseriesService,
    private storage: ManagerService,
    public rs: ReconciliationService,
    public cls: CompanyLocationService,
    public ums: UserMappingService,
    public cbs: CompanyBlockService,
    public gs: GroupService,
    public toastr: ToastrService,
    private loader: AppLoaderService,
    public us: UserService,
    private jwtAuth : JwtAuthService
  )
  { 
    this.Headers = this.jwtAuth.getHeaders()
  }

  GlobalValue: any;
  selectedCompanyId: any;
  assetcategory: any[] = [];
  Category: any[] = [];
  CompanyId: any;
  GroupId: any;
  UserId: any;
  RegionId: any;
  ListOfLoc: any[] = [];
  ListOfLoc1: any[] = [];
  ListOfSBU: any[] = [];
  sbutosbunotallowed: any;
  submittedvalue: boolean = true;
  ngOnInit() {

    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);

    this.GetInitiatedData();
    this.Seriesprinting();
    this.GetCategoryListByConfiguration();

    this.GlobalValue = this.data.GlobalAvailable;
    this.selectedCompanyId = this.data.CompanyId;


    //     CompanyId: 0
    // GlobalAvailable: false
    // component1: "CompanyComponent"

    this.dialogRef.updateSize("'auto'");
    this.dialogForm = this.fb.group({
      Globalmode: [this.data.GlobalValue || ''],
      CategoryCtrl: [''],
      Prfix: ['', Validators.pattern(this.unamePattern)],
      StartNumber: ['', Validators.required],
      EndNumber: ['', Validators.required],

      Record: ['']
    });
    // this.dialogForm.controls['ModelCode'].disable();
    this.dialogForm.controls['Record'].disable();
    //  
    // if (this.data.value === 'edit') {
    //   this.splitedName = this.data.payload.ModelName.split('|', 2);
    // }

    // if (this.data.component1 == "ModelComponent" && this.data.value == 'edit') {
    //   this.dialogForm.controls['ModelCode'].setValue(this.data.payload.ModelCode),
    //     this.dialogForm.controls['ModelName'].setValue(this.splitedName.length > 1 ? this.splitedName[1] : this.data.payload.ModelName)
    // }
  }

  onclosetab() {

    this.dialogRef.close(false);
  }
  Seriesprinting() {


    var GroupId = this.GroupId;

    this.defineseriesservies.Seriesprinting(GroupId).subscribe(r => {

      this.Global = true;
      this.Global1 = false;
      if (r == 0) {
        this.Global = false;
        this.Global1 = true;
      }

    })
  }


  GetCategoryListByConfiguration() {


    var groupId = this.GroupId;
    var userId = this.UserId;
    var regionId = this.RegionId;
    var companyId = this.CompanyId;
    var pageid = 8;
    // this.defineseriesservies.GetCategoryListByConfiguration(groupId, userId, companyId, regionId, pageid)
    this.defineseriesservies.GetBlockOfAssetsByCompany(companyId).subscribe(result => {

      this.assetcategory = result;
      this.assetcategory.forEach((val) => {
        if (val.Id == this.data.assetclass) {
          this.dialogForm.controls['CategoryCtrl'].setValue(val);
          this.selectedcategory = this.data.assetclass;
        }
      })
      this.filteredCategory.next((this.assetcategory).slice());

      this.getFilterCategory();

    })
  }


  getFilterCategory() {

    this.filteredCategory.next(this.assetcategory.slice());
    this.CategoryFilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {

        this.filterCategorydata();
      });
  }

  protected filterCategorydata() {

    if (!this.assetcategory) {
      return;
    }

    let search = this.CategoryFilter.value;
    if (!search) {
      this.filteredCategory.next(this.assetcategory.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredCategory.next(
      this.assetcategory.filter(x => x.BlockName.toLowerCase().indexOf(search) > -1)
    );

  }
  ListOfField: any[] = [];
  ListOfFilter: any[] = [];
  ListOfFilterName: any[] = [];
  ListOfCategory: any[] = [];
  ListOfPagePermission: any[] = [];
  pageid: any;
  GetInitiatedData() {

    this.pageid = 0;
    let url1 = this.cls.GetLocationListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, this.pageid);
    let url2 = this.cbs.GetCategoryListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, this.pageid);
    let url3 = this.gs.GetFieldListByPageId(45,this.UserId, this.CompanyId);
    let url4 = this.gs.GetFilterIDlistByPageId(45);
    let url5 = this.gs.CheckWetherConfigurationExist(this.GroupId, 24);
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

      if (!!results[1]) {
        this.ListOfCategory = JSON.parse(results[1]);
        this.getFilterCategoryType();
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
      }
      this.loader.close();
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
  getFilterCityType() {
    this.filteredCityMulti.next(this.ListOfSBU.slice());
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
  getFilterPlantType() {
    this.filteredPlantsMulti.next(this.ListOfLoc1.slice());
    this.plantMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
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
  getFilterCategoryType() {
    this.filteredcategoryMulti.next(this.ListOfCategory.slice());
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
  checkPrefixVal() {
    debugger;

    if (!this.dialogForm.value.Prfix || this.dialogForm.value.Prfix === undefined || this.dialogForm.value.Prfix.trim() === "") {
      return false;
    } else {
      var id = this.dialogForm.value.Prfix.trim();
      var lastChar = id.substr(id.length - 1);
      if (parseInt(lastChar) >= 0) {
        this.dialogForm.controls['Prfix'].setValue("");
        this.toastr.error(
          this.message.PrefixValidation,
          this.message.AssetrakSays,
        );
      } else {
        if (!this.dialogForm.value.StartNumber && !this.dialogForm.value.EndNumber) {
          this.compaireBarcode();
        }
      }
    }

  }
  newrecord: any;
  compaireBarcode() {

    var Startbarcode = (!this.dialogForm.value.StartNumber) ? '' : this.dialogForm.value.StartNumber;
    var Endbarcode = !this.dialogForm.value.EndNumber ? '' : this.dialogForm.value.EndNumber;
    var prefix = !this.dialogForm.value.Prfix ? '' : this.dialogForm.value.Prfix.trim();
    var CompanyId = this.selectedCompanyId;
    var GroupId = this.GroupId;
    this.dialogForm.value.Record = "";

    var cnt = 0;
    if (Startbarcode != "" && Endbarcode != "") {
      cnt = (parseInt(Endbarcode) - parseInt(Startbarcode)) + 1;
      if (parseInt(Startbarcode) > parseInt(Endbarcode)) {

        this.toastr.warning(this.message.StartInventoryNumberValidation, this.message.AssetrakSays,);
        // this.dialogForm.value.EndNumber = "";
        // this.dialogForm.value.Record = "";
        this.dialogForm.controls['StartNumber'].setValue("");
        this.dialogForm.controls['EndNumber'].setValue("");
        this.dialogForm.controls['Record'].setValue("");
        return false;
      }
      else {
        this.dialogForm.controls['Record'].enable();
        this.newrecord = this.dialogForm.controls['Record'].setValue(cnt);
        this.submittedvalue = false;
        // this.dialogForm.value.Record = cnt;


        this.defineseriesservies.compaireBarcode(Startbarcode, Endbarcode, GroupId, CompanyId, prefix)
          .subscribe(data => {

            //   $("#divLoading").hide();
            if (data === 'available') {

              this.dialogForm.controls['Prfix'].setValue(""),
                this.dialogForm.controls['StartNumber'].setValue("");
              this.dialogForm.controls['EndNumber'].setValue("")
              this.dialogForm.controls['Record'].setValue("")
              this.dialogForm.value.StartNumber = '';
              this.dialogForm.value.EndNumber = '';
              this.dialogForm.value.Prfix = '';
              this.submittedvalue = true;

              this.toastr.warning(this.message.SeriesAlreadyAvailable, this.message.AssetrakSays,);
              return false;
            }
            else if (data === 'not available') {

              this.dialogForm.controls['Prfix'].setValue(""),
                this.dialogForm.controls['StartNumber'].setValue("");
              this.dialogForm.controls['EndNumber'].setValue("")
              this.dialogForm.controls['Record'].setValue("")
              this.dialogForm.value.StartNumber = '';
              this.dialogForm.value.EndNumber = '';
              this.dialogForm.value.Prfix = '';
              this.submittedvalue = true;

              this.toastr.warning(this.message.SeriesWrong, this.message.AssetrakSays,);
              return false;
            }
            else if (data === 'Not Same')
            {
              this.dialogForm.controls['Prfix'].setValue(""),
              this.dialogForm.controls['StartNumber'].setValue("");
              this.dialogForm.controls['EndNumber'].setValue("")
              this.dialogForm.controls['Record'].setValue("")
              this.dialogForm.value.StartNumber = '';
              this.dialogForm.value.EndNumber = '';
              this.dialogForm.value.Prfix = '';
              this.submittedvalue = true;

              this.toastr.warning(this.message.StartEndnumber, this.message.AssetrakSays,);
              return false;
            }
          });

      }

    }
    else {
      this.submittedvalue = true;
    }


  }
  // @HostListener('dblclick', ['$event'])
  // clickEvent(event) {
  //   debugger;
  // event.srcElement.setAttribute('disabled', false);
  // }
  selectedcategory: any;
  changeCategory(event) {
    this.selectedcategory = event.Id;

  }
  onSubmit() {
    this.loader.open();
    if (this.selectedcategory) {
      var categoryid = this.selectedcategory;
    }
    else {
      categoryid = 0;
    }
    var StratBarcode = this.dialogForm.value.StartNumber;
    var EndBarcode = this.dialogForm.value.EndNumber;
    var Count = this.dialogForm.value.Record;// ['Record'];
    var Companyid = this.selectedCompanyId;
    var prefix = this.dialogForm.value.Prfix.trim();
    var GroupId = this.GroupId;
    var Enabled = true;
    var IsActive = 1;

    this.defineseriesservies.Insertseriesdata(categoryid, GroupId, StratBarcode, EndBarcode, Count, Companyid, prefix, Enabled, IsActive).subscribe(r => {
      this.loader.close();
      this.dialogRef.close(r)

    })




  }
}
