import { Component, OnInit, Inject, ViewChild, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import * as headers from '../../../../../assets/Headers.json';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { DefineseriesService } from '../../../services/DefineseriesService';

import { Constants } from '../../../../components/storage/constants';
import { ManagerService } from '../../../../components/storage/sessionMangaer';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-Inventoryseries-dialog',
  templateUrl: './Inventoryseries-dialog.component.html',
  styleUrls: ['./Inventoryseries-dialog.component.scss']
})
export class InventorySeriesDialogComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['Company','Asset Class']
  dataSource = new MatTableDataSource<any>();
  Headers : any ;
  datasource : any;
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

  public CategoryCtrl: FormControl = new FormControl();
  public CategoryFilter: FormControl = new FormControl();
  public filteredCategory: ReplaySubject<any[]> = new ReplaySubject<any[]>(3);

  protected _onDestroy = new Subject<void>();

  get f() { return this.dialogForm.controls; };

  constructor(public dialogRef: MatDialogRef<InventorySeriesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder, public localService: LocalStoreService,
    private defineseriesservies: DefineseriesService,
    private storage: ManagerService,private jwtAuth : JwtAuthService
  ) 
  {
    this.Headers = this.jwtAuth.getHeaders()
   }

  GlobalValue: any;
  selectedCompanyId:any;
  assetcategory: any[] = [];
  Category: any[] = [];
  CompanyId: any;
  GroupId: any;
  UserId: any;
  RegionId: any;
  StratBarcode:any;
  EndBarcode:any;
  prefix:any;
  selectedtype:any;
  CategoryIdlist:any;
  datasourcedata:any;


  ngOnInit() {

    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    debugger;
    this.Seriesprinting();
    this.GetCategoryListByConfiguration();

    this.GlobalValue = this.data.GlobalAvailable;
    this.selectedCompanyId=this.data.CompanyId;
    this.datasourcedata=this.data.value;
    this.datasourcedata.forEach(element => {
      debugger;
      this.tempseriesdata.push(element)
      
    });
    this.onChangedatasource(this.tempseriesdata);
    
    // this.CategoryIdlist = this.data.Catogryidlist;
    // this.selectedtype = this.data.selectedtype;
    // this.StratBarcode=this.data.StratBarcode;
    // this.EndBarcode=this.data.EndBarcode;
    // this.prefix=this.data.prefix;


//     CompanyId: 0
// GlobalAvailable: false
// component1: "CompanyComponent"

    this.dialogRef.updateSize("'auto'");
    this.dialogForm = this.fb.group({
      plant: [''],
     
      

      Record: [this.data.record || '']
    });
    // this.dialogForm.controls['plant'].setValue(this.data.value.ModelCode);
    // this.dialogForm.controls['Record'].setValue(this.data.record);
    debugger;
    if (this.data.value === 'edit') {
      this.splitedName = this.data.payload.ModelName.split('|', 2);
    }

    if (this.data.component1 == "ModelComponent" && this.data.value == 'edit') {
      this.dialogForm.controls['ModelCode'].setValue(this.data.payload.ModelCode),
        this.dialogForm.controls['ModelName'].setValue(this.splitedName.length > 1 ? this.splitedName[1] : this.data.payload.ModelName)
    }
  }

  onclosetab() {
    debugger;
    this.dialogRef.close();
  }
  Seriesprinting() {


    var GroupId=this.GroupId;

    this.defineseriesservies.Seriesprinting(GroupId).subscribe(r => {
      this.Global = true;
      this.Global1 = false;
      if (r == 0) {
        this.Global = false;
        this.Global1 = true;
      }

    })
  }
  onSubmit() {
   

    

    this.dialogRef.close()


  }

  GetCategoryListByConfiguration() {
    
    var groupId = this.GroupId;
    var userId = this.UserId;
    var regionId = this.RegionId;
    var companyId = this.CompanyId;
    var pageid = 45;
    this.defineseriesservies.GetCategoryListByConfiguration(groupId, userId, companyId, regionId, pageid).subscribe(result => {
      
      this.assetcategory = JSON.parse(result);
      // this.filteredCategory.next((this.assetcategory).slice());
      // this.assetcategory.forEach(element => {
      //   this.tempseriesdata.push(element);

      // });
      // this.getFilterCategory();   this.tempseriesdata.push(element);

        

    })
  }
  
  // this.datasourcedata.forEach(element => {
  //   this.tempseriesdata.push(element);

    
  // });


  tempseriesdata: any = [];
  onChangedatasource(value) {
     debugger;

    this.datasource = new MatTableDataSource(value);

    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;

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
      this.assetcategory.filter(x => x.CategoryName.toLowerCase().indexOf(search) > -1)
    );
   
  }
  Getassetdetail(){



    // var blockId = this.block;
    // var type = target.id;
    // var sbarcode = this.StratBarcode;
    // var ebarcode = this.EndBarcode;
    // var companyId = this.Companyid;
    // var groupId = this.GroupId;
    // var prefix = this.prefix;
  }

}
