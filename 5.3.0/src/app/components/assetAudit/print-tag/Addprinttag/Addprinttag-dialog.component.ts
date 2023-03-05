import { Component, OnInit, Inject, ViewChild, EventEmitter } from '@angular/core';
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
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';


interface Inventory {
  id: string;
  name: string;
}

@Component({
  selector: 'app-Addprinttag-dialog',
  templateUrl: './Addprinttag-dialog.component.html',
  styleUrls: ['./Addprinttag-dialog.component.scss']
})
export class AddprinttagDialogComponent implements OnInit {
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
  unamePattern: " /^[a-zA-Z0-9 :_\\\/|.-]+$/";
  Selectedvalueforglobal = "Global";
  SelectedchangeplantItems: any;
  number: any;
  public CategoryCtrl: FormControl = new FormControl();
  public CategoryFilter: FormControl = new FormControl();
  public filteredCategory: ReplaySubject<any[]> = new ReplaySubject<any[]>(2);

  public cityMultiCtrl: any;
  public cityMultiFilterCtrl: FormControl = new FormControl();
  public filteredCityMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  //public plantMultiCtrl: any;
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

  // protected labelsize: Labelsize[] = InventoryNote;
  public labelsizeCtrl: FormControl = new FormControl();
  public labelsizeFilterCtrl: FormControl = new FormControl();
  public filterlabelsize: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public labelmaterialCtrl: FormControl = new FormControl();
  public filterlabelmaterialCtrl: FormControl = new FormControl();
  public filterlabelmaterial: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  protected _onDestroy = new Subject<void>();



  get f() { return this.dialogForm.controls; };

  constructor(public dialogRef: MatDialogRef<AddprinttagDialogComponent>,
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
    private jwtAuth: JwtAuthService,
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
  labelsize: any[] = [];
  labelmaterial: any[] = [];
  SBUList: any;
  PlantList: any;
  plant: any;
  assetclass;
  decimalNumericPattern = "^-?[0-9]\\d*(\\.\\d{1,3})?$";

  ngOnInit() {


    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);

    this.dialogRef.updateSize("'auto'");
    this.dialogForm = this.fb.group({
      Globalmode: [this.data.GlobalValue || ''],
      CategoryCtrl: [''],
      plantMultiCtrl: [''],
      Prfix: [''],
      StartNumber: [''],
      EndNumber: [''],
      CountAvailable: [''],
      nolabels: ['', [Validators.pattern(/^[0-9]\d*$/), Validators.required]],
      labelsizeCtrl: ['', Validators.required],
      labelmaterialCtrl: ['', Validators.required],
      Remark: [''],
    });

    this.GlobalValue = this.data.GlobalAvailable;
    this.assetclass = (this.data.assetclass);


    this.Seriesprinting();
    // this.GetCategoryListByConfiguration();
    // this.OnGetSBUList();
    this.GetInitiatedData();
    //this.GetPrintSetupByCompanyIdJson();
    //this.GetlabelIdTOBindDisplaylist();
    //this.filterlabelsize.next(this.labelsize.slice());
    //this.filterlabelmaterial.next(this.labelmaterial.slice());

    
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  onclosetab() {
    this.dialogRef.close();
  }
  Seriesprinting() {
    var GroupId = this.GroupId;
    this.defineseriesservies.Seriesprinting(GroupId).subscribe(r => {

      this.Global = true;
      this.Global1 = false;
      this.selectedcategory1 = "Global"
      if (r == 0) {
        this.Global = false;
        this.Global1 = true;
      }
    })
  }
  MaterialList: any[] = [];
  GetInitiatedData() {
    
    this.pageid = 27;
    let url1 = this.defineseriesservies.GetBlockOfAssetsByCompany(this.CompanyId);
    let url2 = this.cls.GetLocationListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, 27);
    let url3 = this.defineseriesservies.GetPrintSetupByCompanyIdJson(this.CompanyId);
    let url4 = this.defineseriesservies.GetlabelIdTOBindDisplaylist(this.CompanyId);

    forkJoin([url1, url2, url3, url4]).subscribe(results => {
      
      this.labelmaterial = [];
      if (!!results[0]) {
        this.assetcategory = results[0];
        this.assetcategory.forEach((val) => {
          if (val.Id == this.assetclass) {
            this.dialogForm.controls['CategoryCtrl'].setValue(val);
            this.selectedcategory = val.Id;
            this.selectedcategory1 = val.BlockName;
            //this.GetBarcodeAvailableCount(val);
          }
        })
        this.getFilterCategory();
      }
      if (!!results[1]) {
        this.SBUList = JSON.parse(results[1]);
        this.PlantList = JSON.parse(results[1]);
        if (!!this.data.selectplant && this.data.selectplant != 0) {
          this.PlantList.forEach(element => {
            if (element.LocationId == this.data.selectplant) {
              this.dialogForm.controls['plantMultiCtrl'].setValue(element);
              this.SelectedchangeplantItems = this.data.selectplant[0];
              this.GetBarcodeAvailableCount(element);
            }
          });
        }
        else {
          this.dialogForm.controls['plantMultiCtrl'].setValue(0);
          this.GetBarcodeAvailableCount('');
        }
        this.getFilterLocation();
      }
      
      if (!!results[2]) {
        this.labelsize = JSON.parse(results[2]);
        this.getFilterlabelsize();
      }
      if (!!results[3]) {
        var list = JSON.parse(results[3]);
        list.forEach(element => {
          var idx = this.MaterialList.indexOf(element.Material);
          if (idx < 0) {
            this.labelmaterial.push(element);
            this.MaterialList.push(element.Material);
          }
        });
        this.getFilterlabelmaterial();
      }
    })
  }

  // GetCategoryListByConfiguration() {
  //   this.defineseriesservies.GetBlockOfAssetsByCompany(this.CompanyId).subscribe(result => {   
  //          
  //     this.assetcategory = result;
  //     this.assetcategory.forEach((val) => {  
  //         if (val.Id == this.assetclass) {  
  //         this.dialogForm.controls['CategoryCtrl'].setValue(val);
  //         this.selectedcategory = val.Id;
  //         this.selectedcategory1 = val.BlockName;
  //         //this.GetBarcodeAvailableCount(val);
  //       }
  //     })      
  //     this.getFilterCategory();
  //   })
  // }
  // OnGetSBUList() {   
  //   const pageid = 27;
  //   this.cls.GetLocationListByConfiguration(this.GroupId, this.UserId, this.CompanyId, this.RegionId, pageid)
  //     .subscribe(r => {
  //       
  //       this.SBUList = JSON.parse(r);
  //       this.PlantList = JSON.parse(r);
  //       if(!!this.data.selectplant && this.data.selectplant != 0){
  //         this.PlantList.forEach(element => {      
  //           if (element.LocationId == this.data.selectplant) {
  //             this.dialogForm.controls['plantMultiCtrl'].setValue(element);
  //             this.SelectedchangeplantItems = this.data.selectplant;             
  //             this.GetBarcodeAvailableCount(element);
  //           }          
  //         });
  //       }
  //       else{
  //         this.dialogForm.controls['plantMultiCtrl'].setValue(0);
  //         this.GetBarcodeAvailableCount('');
  //       }        
  //       //this.filteredPlantsMulti.next(this.PlantList.slice());
  //       this.getFilterLocation();
  //     })   
  // }
  // GetPrintSetupByCompanyIdJson() {     
  //   var CompanyId = this.CompanyId;
  //   this.defineseriesservies.GetPrintSetupByCompanyIdJson(CompanyId).subscribe(r => {       
  //     this.labelsize = JSON.parse(r);
  //     this.getFilterlabelsize();
  //   })
  // }
  // GetlabelIdTOBindDisplaylist() {
  //   var CompanyId = this.CompanyId;
  //   this.defineseriesservies.GetlabelIdTOBindDisplaylist(CompanyId).subscribe(r => {
  //     
  //     this.labelmaterial = [];
  //     if (!!r) {
  //       var list = JSON.parse(r);
  //       list.forEach(element => {
  //         var idx = this.MaterialList.indexOf(element.Material);
  //         if (idx < 0) {
  //           this.labelmaterial.push(element);
  //           this.MaterialList.push(element.Material);
  //         }
  //       });
  //     }
  //     this.getFilterlabelmaterial();
  //   })
  // }

  ListOfField: any[] = [];
  ListOfFilter: any[] = [];
  ListOfFilterName: any[] = [];
  ListOfCategory: any[] = [];
  ListOfPagePermission: any[] = [];
  pageid: any;


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

  limit = 10;
  offset = 0;
  getFilterLocation() {
    this.filteredPlantsMulti.next(this.PlantList.slice(0, this.offset + this.limit));
    this.offset += this.limit;
    this.plantMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterLocationdata();
      });
  }
  protected filterLocationdata() {

    if (!this.PlantList) {
      return;
    }
    let search = this.plantMultiFilterCtrl.value;
    if (!search) {
      this.filteredPlantsMulti.next(this.PlantList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredPlantsMulti.next(
      this.PlantList.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1)

    );
  }

  selectedcategory: any;
  selectedcategory1: any;
  SelectedMaterialItems: any;
  SlectedlabelsizeItems: any;
  changeCategory(event) {
    
    if (event.value == "Global") {
      this.selectedcategory1 = event.value;
    }
    else {
      this.selectedcategory = event.value.Id;
      this.selectedcategory1 = event.value.BlockName;
    }
    this.GetBarcodeAvailableCount(event);
  }

  GetBarcodeAvailableCount(event) {
    
    var categoryName = "";
    var LocationId = 0;
    if (!this.SelectedchangeplantItems) {
      LocationId = 0
    }
    else {
      LocationId = this.SelectedchangeplantItems;
    }

    if (this.selectedcategory1 == "Global") {
      categoryName = "Global";
    }
    else {
      categoryName = this.selectedcategory1;
    }

    this.defineseriesservies.GetBarcodeAvailableCount(LocationId, categoryName, this.GroupId, this.CompanyId).subscribe(r => {

      var str = r.split(",");
      var count = str[0];
      var startBarcodeNo = str[1];
      var prefix = str[2];
      this.dialogForm.controls['Prfix'].setValue(prefix);
      this.dialogForm.controls['CountAvailable'].setValue(count);
      this.dialogForm.controls['StartNumber'].setValue(startBarcodeNo);
    });
  }

  SelectedMaterial(event) {

    this.SelectedMaterialItems = event.Material;
  }
  Selectedchangeplant(event) {
    
    if (event.value == 0) {
      this.SelectedchangeplantItems = 0;
    }
    else {
      this.SelectedchangeplantItems = event.value.LocationId;
    }
    this.GetBarcodeAvailableCount(event);
  }
  Selectedlabelsize(event) {

    this.SlectedlabelsizeItems = event.LabelSize;
  }
  onSubmit() {
    this.loader.open();
    var sdefinition = {
      categoryid: this.selectedcategory,
      StratBarcode: this.dialogForm.value.StartNumber,
      EndBarcode: this.dialogForm.value.EndNumber,
      Count: this.dialogForm.value.CountAvailable,
      Companyid: this.CompanyId,
      locationid: !!this.SelectedchangeplantItems ? this.SelectedchangeplantItems : 0,
      prefix: this.dialogForm.value.Prfix,
      GroupId: this.GroupId,
      nolabels: this.dialogForm.value.nolabels,
      labelsize: this.SlectedlabelsizeItems,
      labelmaterial: this.SelectedMaterialItems,
      remark: this.dialogForm.value.Remark
    }
    this.defineseriesservies.Insertprintdetail(sdefinition).subscribe(r => {
      this.loader.close();
      this.dialogRef.close(r);
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

  getFilterlabelmaterial() {
    this.filterlabelmaterial.next(this.labelmaterial.slice());
    this.filterlabelmaterialCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterlabelmaterialdata();
      });
  }
  filterlabelmaterialdata() {
    if (!this.labelmaterial) {
      return;
    }
    let search = this.filterlabelmaterialCtrl.value;
    if (!search) {
      this.filterlabelmaterial.next(this.labelmaterial.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filterlabelmaterial.next(
      this.labelmaterial.filter(x => x.material.toLowerCase().indexOf(search) > -1)
    );
  }


  getFilterlabelsize() {
    this.filterlabelsize.next(this.labelsize.slice());
    this.labelsizeFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterlabelsizedata();
      });
  }
  filterlabelsizedata() {
    if (!this.labelsize) {
      return;
    }
    let search = this.labelsizeFilterCtrl.value;
    if (!search) {
      this.filterlabelsize.next(this.labelsize.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filterlabelsize.next(
      this.labelsize.filter(x => x.Size.toLowerCase().indexOf(search) > -1)
    );

  }

  checkValidNumber1() {
    
    var companyId = this.CompanyId;
    var locationid = 0;
    var noOfLabels = !this.dialogForm.value['nolabels'] ? 0 : this.dialogForm.value['nolabels'];
    //noOfLabels = noOfLabels.trim();
    var categoryName = "";
    var catrgoryId = 0;
    var countAvailable = this.dialogForm.value['CountAvailable'];
    var Ebarcode = "";
    var Sbarcode = "";
    
    if (parseInt(noOfLabels) > 0) {
      if (!this.SelectedchangeplantItems) {
        locationid = 0
      }
      else {
        locationid = this.SelectedchangeplantItems;
      }
      if (this.Global1 == false) {
        categoryName = "Global";
        catrgoryId = 0;
      }
      else {
        categoryName = this.selectedcategory1;
        catrgoryId = this.selectedcategory;
      }
      if (!countAvailable) {
        this.toastr.warning(this.message.SeriesNotAvailable, this.message.AssetrakSays)
        return false;
      }
      if (locationid == 0) {
        if (categoryName == "Global" || locationid == 0) {
        }
        else {
          this.toastr.warning(this.message.SelectLocation, this.message.AssetrakSays)
          return false;
        }
      }
      if (this.Global1 === true && categoryName == "") {
        this.toastr.warning(this.message.SelectAssetClass, this.message.AssetrakSays)
        return false;
      }
      if (!noOfLabels) {
        this.toastr.warning(this.message.NoOfLabels, this.message.AssetrakSays,)
        return false;
      }
      var r1: any[] = [];
      this.loader.open();
      this.defineseriesservies.GetBarcode(locationid, catrgoryId, noOfLabels).subscribe(r => {
        r1 = JSON.parse(r);
        this.defineseriesservies.GetLastPrintBarcode(catrgoryId, companyId).subscribe(result => {
          debugger;
          this.loader.close();
          
          var value = [];
          if (r1) {
            r1.forEach(element => {
              if (element.Companyid == companyId) {
                value.push(element);
              }
            });
            Ebarcode = value[0].EndBarcode;
            Sbarcode = value[0].StratBarcode;
          }
          else {
            Ebarcode = "0";
            Sbarcode = "0";
          }
          var Endb = Ebarcode;
          var statb = Sbarcode;
          if (result == "") {
            this.toastr.warning(this.message.SeriesNotAvailable, this.message.AssetrakSays,)
            this.dialogForm.controls['StartNumber'].setValue('');
            this.dialogForm.controls['EndNumber'].setValue('');
            this.dialogForm.controls['nolabels'].setValue('');
            return false;
          }
          else if (parseInt(result) > 0) {
            var noofl = noOfLabels;
            this.number = this.dialogForm.value['nolabels'];
            var stb1 = parseInt(result) + 1;
            var result1 = parseInt(result)
            var sBarcodePrefix1 = result.replace(result1.toString(), "");
            var firstendb1 = stb1 + (parseInt(this.number) - 1);
            var firstendb = sBarcodePrefix1 + firstendb1;
            var stb = sBarcodePrefix1 + stb1;
            
            if (firstendb > parseInt(Endb)) {
              this.toastr.warning(this.message.LabelCountNotAvailabel, this.message.AssetrakSays,)
              this.dialogForm.controls['StartNumber'].setValue('');
              this.dialogForm.controls['EndNumber'].setValue('');
              this.dialogForm.controls['nolabels'].setValue('');
              return false;
            }
            this.dialogForm.controls['StartNumber'].setValue(stb);
            this.dialogForm.controls['EndNumber'].setValue(firstendb);
          }
          else {
            var noofl = noOfLabels;
            this.number = this.dialogForm.value['nolabels'];
            var etb = parseInt(statb) + (parseInt(this.number) - 1);
            
            var etb1 = parseInt(statb);
            var sBarcodePrefix = statb.replace(etb1.toString(), "");
            var etb2 = sBarcodePrefix + etb;
            var endbo = Endb + noOfLabels;
            this.dialogForm.controls['StartNumber'].setValue(Sbarcode);
            this.dialogForm.controls['EndNumber'].setValue(etb2);
            if (etb > parseInt(Endb)) {
              this.toastr.warning(this.message.InventoryNumberNotAvailable, this.message.AssetrakSays,)
              this.dialogForm.controls['StartNumber'].setValue('');
              this.dialogForm.controls['EndNumber'].setValue('');
              this.dialogForm.controls['nolabels'].setValue('');
              return false;
            }
          }

        });
      });
    }
    else{
      this.dialogForm.controls['nolabels'].setValue("");
    }
  }
}

