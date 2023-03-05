import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
// import { MatPaginator } from '@angular/material/paginator';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import * as headers from '../../../../assets/Headers.json';
import * as resource from '../../../../assets/Resource.json';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/UserService';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import * as menuheaders from '../../../../assets/MenuHeaders.json';
import { ITAMService } from 'app/components/services/ITAMService';
import { FormControl } from '@angular/forms';
import { GroupService } from '../../services/GroupService';
import { SelectionModel } from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { ModifiedManufacturerCategoryDialogComponent } from '../dialogs/modified-manufacturer-category-dialog/modified-manufacturer-category-dialog.component';
import { SoftwareDetailsDialogComponent } from '../dialogs/software-details-dialog/software-details-dialog.component';
import { SoftwarePackageDetailsDialogComponent } from '../dialogs/software-package-details-dialog/software-package-details-dialog.component';

@Component({
  selector: 'app-scanned-software',
  templateUrl: './scanned-software.component.html',
  styleUrls: ['./scanned-software.component.scss']
})
export class ScannedSoftwareComponent implements OnInit {

  header: any = (headers as any).default;
  message: any = (resource as any).default;
  order: string;
  nSoftwareType: any;
  public dialogForm: FormGroup;
  selection = new SelectionModel<any>(true, []);

  private isButtonVisible = false;
  AssetNoFilter = new FormControl();
  IsSearch: boolean = false;

  IsCompanyAdmin: any = 1;
  FileNameWithPath: any;
  LocationId: any;
  menuheader: any = (menuheaders as any).default
  GroupId: any;
  RegionId: any;
  UserId: any;
  CompanyId: any;
  paginationParams: any;

  public typeOfSoftwares: any[] = [];
  public typeOfCategorys: any[] = [];
  public typeOfManufacturers: any[] = [];
  public typeOfManufacturers1: any[] = [];
  public typeOfSoftwareSuite: any[]=[];

  public ManufacturerCtrl: any;
  public ManufacturerFilterCtrl: FormControl = new FormControl();
  public filteredManufacturersMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public SoftwareTypeCtrl: any;
  public SoftwareTypeFilterCtrl: FormControl = new FormControl();
  public filteredSoftwareTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public SoftwareSuiteCtrl: any;
  public SoftwareSuiteFilterCtrl: FormControl = new FormControl();
  public filteredSoftwareSuiteMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public ComplianceTypeCtrl: any;

  ComplianceTypeData: any[] = [];

  public colFilterCtrl: FormControl = new FormControl();

  // displayedHeaders = ['Select','Icon','Software', 'Manufacturer', 'Category', 'Type', 'Installations','Package','Licensed Installations', 'Purchased','Installations Allowed','Allocated','Available for allocation','Compliance Type','Users']
  // displayedColumns: any[] = ['Select','Icon','Software', 'Manufacturer', 'Category', 'Type', 'Installations','SoftwareSuite','LicensedInstallations', 'Purchased','InstallationsAllowed','Allocated','Availableforallocation','ComplianceType','Users'];

  // displayedHeaders1 = ['Select','Icon','Software', 'Manufacturer', 'Category', 'Type', 'Installations','Softwares','Licensed Installations', 'Purchased','Installations Allowed','Allocated','Available for allocation']
  // displayedColumns1: any[] = ['Select','Icon','Software', 'Manufacturer', 'Category', 'Type', 'Installations','Softwares','LicensedInstallations', 'Purchased','InstallationsAllowed','Allocated','Availableforallocation'];

  displayedHeaders = ['Select','Icon','Software', 'Manufacturer', 'Category', 'Type','Installations','Package']
  displayedColumns: any[] = ['Select','Icon','Software', 'Manufacturer', 'Category', 'Type','Installations' ,'SoftwareSuite'];

  displayedHeaders1 = ['Select','Icon','Software', 'Manufacturer', 'Category','Softwares']
  displayedColumns1: any[] = ['Select','Icon','Software', 'Manufacturer', 'Category', 'Softwares'];

  //datasource = new MatTableDataSource(this.mandatory);
  datasource: any;
  datasourceNew: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  protected _onDestroy = new Subject<void>();

  @ViewChild(MatPaginator) paginatorNew: MatPaginator;
  @ViewChild(MatSort) sortNew: MatSort;

  constructor(public dialog: MatDialog, private fb: FormBuilder,
    public confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private storage: ManagerService,
    private router: Router,
    public alertService: MessageAlertService,
    public us: UserService,
    public itamService: ITAMService,
    public toastr: ToastrService,
    public gs: GroupService) {

      this.ComplianceTypeData= [
        { value: 'Under Licensed', viewValue: 'Under Licensed' },
        { value: 'Compliant', viewValue: 'Compliant' },
        { value: 'Over Licensed' , viewValue: 'Over Licensed' },
        { value: 'Possibly Under Licensed' , viewValue : 'Possibly Under Licensed'},
        { value: 'NA' , viewValue: 'NA' }
      ];
     }

  ngOnInit(): void {
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);

    

    this.paginationParams = {
      pageSize: 50,
      currentPageIndex: 0,
      endIndex: 0,
      startIndex: 0,
      totalCount: 0,
    }
    this.ManufacturerCtrl = "";
    this.SoftwareTypeCtrl = "";
    this.SoftwareSuiteCtrl = "";
    this.ComplianceTypeCtrl = "";
    this.GetInitiatedData();    
    //this.getSuiteSoftware();


  }

  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  ListOfField: any[] = [];
  CompliancetypeList :any[] =[];
  GetInitiatedData() {
    var Isoptions = 0;
    //let url1 = this.gs.GetFieldListBypageid(115);
    let url2 = this.itamService.getSoftwareType(Isoptions);
    let url3 = this.itamService.getSoftwareManufacturer();
    let url4 = this.itamService.getSoftwareSuite(Isoptions , 0);
    //let url5 = this.itamService.getsoftwarecompliancetype();
    forkJoin([url2 , url3 , url4]).subscribe(results => {
      
      if (!!results[0] && results[0] != null) {
        this.typeOfSoftwares = results[0];
        console.log(results[0]);
        this.getFilterSoftwareType();
      }
      if (!!results[1] && results[1] != null) {
        this.typeOfManufacturers1 = results[1];
        this.typeOfManufacturers = results[1];
        console.log(results[1]);
        this.getFilterManufacturer();
      }
      if (!!results[2] && results[2] != null) {
        this.typeOfSoftwareSuite = results[2];
        console.log(results[2]);
        this.getFilterSoftwareSuite();
      }
      // if (!!results[4]) {
      //   this.CompliancetypeList = results[4];
      //   console.log(results[4]);
      // }

      this.getSoftware();
    })
  }

  getSoftwareSuite(mID){
      
    this.typeOfSoftwareSuite = [];
    this.itamService.getSoftwareSuite(0 , mID).subscribe((res: any)=>{
      this.typeOfSoftwareSuite = res;
      this.getFilterSoftwareSuite();
    });
  }

  uploadNameBy: any;
  showScannedSoftware : boolean = true;
  showSuiteSoftware : boolean = false;

  onTabChanged($event){
      
    this.getselectedIds = [];
    this.selection.selected.length = 0;
    if($event.index == 1){
      this.showScannedSoftware = false;
      this.showSuiteSoftware = true;
      this.getSoftware();
    }
    else{
      this.showScannedSoftware = true;
      this.showSuiteSoftware = false;
      this.getSoftware();
    }
  }

  handlePage(pageEvent: PageEvent) {
      
    this.paginationParams.pageSize = pageEvent.pageSize;
    this.paginationParams.currentPageIndex = pageEvent.pageIndex;
    this.paginationParams.endIndex = (this.paginationParams.currentPageIndex + 1) * pageEvent.pageSize;
    this.paginationParams.startIndex = this.paginationParams.currentPageIndex * pageEvent.pageSize;
    if(!!this.showScannedSoftware){
      this.getSoftwareBindData();
    }
    else{
      this.getSoftwareSuiteBindData();  
    }
  }

  getSoftware() {
    this.getselectedIds= [];
    this.selection.clear();
    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;
    if(!!this.showScannedSoftware){
      this.getSoftwareBindData();
    }
    else{
      this.getSoftwareSuiteBindData();  
    }
    
  }

  DataForGrid: any[] = [];
  getSoftwareBindData() {
      
    //this.loader.open();
    var reqData = {
      CompanyId: this.CompanyId,
      GroupID: this.GroupId,
      searchManufacturer: !!this.ManufacturerCtrl ? this.ManufacturerCtrl :  [],
      searchSoftwareType: !!this.SoftwareTypeCtrl ? this.SoftwareTypeCtrl : [],
      searchSoftwareSuite: !!this.SoftwareSuiteCtrl ? this.SoftwareSuiteCtrl : [],
      ComplianceType : !!this.ComplianceTypeCtrl ? [this.ComplianceTypeCtrl] : [],
      searchlist : !!this.SearchText ? this.SearchText : "",
      pageSize: this.paginationParams.pageSize,
      pageNo: this.paginationParams.currentPageIndex + 1
    }

    this.itamService.getScannedSoftwareList(reqData).subscribe((res: any) => {
      this.loader.close();
        
      var bindData = [];
        
      this.paginationParams.totalCount = 0;
      if(!!res && res != 'null'){
        bindData = res;
        this.paginationParams.totalCount = bindData[0].AssetListCount;
        this.paginationParams.endIndex = bindData[0].AssetListCount;
      }         
      this.onChangeDataSource(bindData);
    })

  }

  onChangeDataSource(value) {
      
    this.datasource = new MatTableDataSource(value);
    //this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }

  onChangeDataSourceNew(value) {
      
    this.datasourceNew = new MatTableDataSource(value);
    //this.datasourceNew.paginator = this.paginatorNew;
    this.datasourceNew.sort = this.sortNew;
  }

  numSelected: any = 0;
  getselectedIds: any[] = [];
  isAllSelected: boolean = false;

  isSelected(row) {     
    
    this.isAllSelected = false;
    this.selection.toggle(row)
    this.numSelected = this.selection.selected.length;
    var idx = this.getselectedIds.indexOf(row);
    if (idx > -1) {
      this.getselectedIds.splice(idx, 1);
    }
    else {
      this.getselectedIds.push(row);
    }    
  }

  

  getSoftwareSuiteBindData() {
      
    //this.loader.open();
    var reqData = {
      SoftwareSuiteID: 0,
      CompanyId: this.CompanyId,
      GroupID: this.GroupId,
      searchManufacturer: !!this.ManufacturerCtrl ? this.ManufacturerCtrl :  [],
      searchSoftwareType: !!this.SoftwareTypeCtrl ? this.SoftwareTypeCtrl : [],
      searchSoftwareSuite: !!this.SoftwareSuiteCtrl ? this.SoftwareSuiteCtrl : [],
      complianceType : !!this.ComplianceTypeCtrl ? [this.ComplianceTypeCtrl] : [],
      searchlist : !!this.SearchText ? this.SearchText : "",
      pageSize: this.paginationParams.pageSize,
      pageNo: this.paginationParams.currentPageIndex + 1
    }

    this.itamService.getSoftwareSuiteList(reqData).subscribe((res: any) => {
        
      //this.loader.close();
      var bindData = [];
        
      this.paginationParams.totalCount = 0;
      if(!!res && res != 'null'){
        bindData = res;
        
        this.paginationParams.totalCount = bindData[0].AssetListCount;
        this.paginationParams.endIndex = bindData[0].AssetListCount;
      } 
      console.log(bindData);

      this.onChangeDataSourceNew(bindData);
    })

  }
  
  deleteScannedSoftware() {    
      debugger;
    var req = {
      ID: '',
      CompanyId: this.CompanyId,
      LocationId: 0 , //this.LocationId,
      GroupID: this.GroupId
    }
    if(this.showSuiteSoftware == true){
      req.ID = this.getselectedIds[0].SoftwareSuiteID ;
      this.itamService.deleteSuiteSoftware(req).subscribe((res: any) => {
        this.getselectedIds= [];
        this.selection.clear();
        if(!!res && res.errorMessage != "OK"){
          this.toastr.warning(res.errorMessage, this.message.AssetrakSays);
        }
        else{
          this.toastr.success("Software package removed successfully", this.message.AssetrakSays);
        }        
        this.getSoftware();
      });
    }
    else{
      req.ID = this.getselectedIds[0].softwareid ;
      this.itamService.deleteScannedSoftware(req).subscribe((res: any) => {
        this.getselectedIds= [];
        this.selection.clear();
        if(!!res && res.errorMessage != "OK"){
          this.toastr.warning(res.errorMessage, this.message.AssetrakSays);
        }
        else{
          this.toastr.success("Software removed successfully", this.message.AssetrakSays);
        }
        
        this.getSoftware();
      });
    }
  }

  ChangeManufacturerAndCategory(){
    
      let dialogRef = this.dialog.open(ModifiedManufacturerCategoryDialogComponent, {
        width: '500px',
        data: { payload: this.selection.selected }
      });
      dialogRef.afterClosed()
      .subscribe(res => {
          
        if (!res) {
          // If user press cancel
          return;
        }       
      })
  }

  modifiedManufacturer(MID , softwareid){
      
    var req = {
      SoftwareId : softwareid ,
      ManufacturerID : !!MID ? MID : 0,
      SoftwareCatId : 0
    }
    this.itamService.modifyaction(req).subscribe((res: any) => {
        
              
      this.toastr.success("success", this.message.AssetrakSays);     
    });
  }

  modifiedType(TID , softwareid){
      
    var req = {
      SoftwareId : softwareid ,
      SoftwareTypeId : !!TID ? TID : 0
    }
    this.itamService.movetoaction(req).subscribe((res: any) => {
        
              
      this.toastr.success("success", this.message.AssetrakSays);     
    });
  }

  GetDetails(data: any = {}) {
      
    let title = 'Add new member';
    const dialogRef = this.dialog.open(SoftwareDetailsDialogComponent, {
      width: 'auto',
      disableClose: true,
      data: { title: title, payload: data }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
        this.getSoftwareBindData();
      })
  }

  GetPackageDetails(data: any = {}) {
      
    let title = 'Add new member';
    const dialogRef = this.dialog.open(SoftwarePackageDetailsDialogComponent, {
      width: 'auto',
      disableClose: true,
      data: { title: title, payload: data }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
        this.getSoftwareSuiteBindData();
      })
  }


  getFilterManufacturer() {
    this.filteredManufacturersMulti.next(this.typeOfManufacturers.slice());    
    this.ManufacturerFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterManufacturerMulti();
      });
  }
  protected filterManufacturerMulti() {
    if (!this.typeOfManufacturers) {
      return;
    }
    let search = this.ManufacturerFilterCtrl.value;
    if (!search) {
      this.filteredManufacturersMulti.next(this.typeOfManufacturers.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredManufacturersMulti.next(
      this.typeOfManufacturers.filter(x => x.Name.toLowerCase().indexOf(search) > -1)
    );
  }

  toggleSelectAllManufacturer(selectAllValue) {    
    this.ManufacturerCtrl = [];
    this.filteredManufacturersMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {       
        if (!!selectAllValue.checked) {
          let search = this.ManufacturerFilterCtrl.value;
          if(!!search){
            this.typeOfManufacturers.filter(x => x.Name.toLowerCase().indexOf(search) > -1).forEach(element => {
              this.ManufacturerCtrl.push(element.ID);
            });
          }
          else{
            this.typeOfManufacturers.forEach(element => {
              this.ManufacturerCtrl.push(element.ID);
            });
          }          
        } else {
          this.ManufacturerCtrl = "";
        }        
      });
  }

  getFilterSoftwareType() {
    this.filteredSoftwareTypeMulti.next(this.typeOfSoftwares.slice());    
    this.SoftwareTypeFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterSoftwareTypeMulti();
      });
  }
  protected filterSoftwareTypeMulti() {
    if (!this.typeOfSoftwares) {
      return;
    }
    let search = this.SoftwareTypeFilterCtrl.value;
    if (!search) {
      this.filteredSoftwareTypeMulti.next(this.typeOfSoftwares.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredSoftwareTypeMulti.next(
      this.typeOfSoftwares.filter(x => x.SoftwareTypeName.toLowerCase().indexOf(search) > -1)
    );
  }

  toggleSelectAllSoftwareType(selectAllValue) {    
    this.SoftwareTypeCtrl = [];
    this.filteredSoftwareTypeMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {       
        if (!!selectAllValue.checked) {
          let search = this.SoftwareTypeFilterCtrl.value;
          if(!!search){
            this.typeOfSoftwares.filter(x => x.SoftwareTypeName.toLowerCase().indexOf(search) > -1).forEach(element => {
              this.SoftwareTypeCtrl.push(element.SoftwareTypeId);
            });
          }
          else{
            this.typeOfSoftwares.forEach(element => {
              this.SoftwareTypeCtrl.push(element.SoftwareTypeId);
            });
          }          
        } else {
          this.SoftwareTypeCtrl = "";
        }        
      });
  }

  getFilterSoftwareSuite() {
    this.filteredSoftwareSuiteMulti.next(this.typeOfSoftwareSuite.slice());    
    this.SoftwareSuiteFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterSoftwareSuiteMulti();
      });
  }
  protected filterSoftwareSuiteMulti() {
    if (!this.typeOfSoftwareSuite) {
      return;
    }
    let search = this.SoftwareSuiteFilterCtrl.value;
    if (!search) {
      this.filteredSoftwareSuiteMulti.next(this.typeOfSoftwareSuite.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredSoftwareSuiteMulti.next(
      this.typeOfSoftwareSuite.filter(x => x.SoftwareName.toLowerCase().indexOf(search) > -1)
    );
  }

  toggleSelectAllSoftwareSuite(selectAllValue) {    
    this.SoftwareSuiteCtrl = [];
    this.filteredSoftwareSuiteMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {       
        if (!!selectAllValue.checked) {
          let search = this.SoftwareSuiteFilterCtrl.value;
          if(!!search){
            this.typeOfSoftwareSuite.filter(x => x.SoftwareName.toLowerCase().indexOf(search) > -1).forEach(element => {
              this.SoftwareSuiteCtrl.push(element.SoftwareSuiteID);
            });
          }
          else{
            this.typeOfSoftwareSuite.forEach(element => {
              this.SoftwareSuiteCtrl.push(element.SoftwareSuiteID);
            });
          }          
        } else {
          this.SoftwareSuiteCtrl = "";
        }        
      });
  }

  ShowList(type , element){
    if(type == 'Manufacturer'){
      if(!!this.datasource && this.datasource.data.length > 0){
        this.datasource.data.forEach(ele => {
          ele.ManufacturerFlag = false;
        });
      }
      element.ManufacturerFlag = true;
    }

    if(type == 'Type'){
      if(!!this.datasource && this.datasource.data.length > 0){
        this.datasource.data.forEach(ele => {
          ele.TypeFlag = false;
        });
      }
      element.TypeFlag = true;
    }
  }
  // GetDetails(element){
  //     
  //   let route = 'h11/ddd';
  //   this.router.navigateByUrl(route);
  // }


  applyFilter(filterValue: string) {
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  applyManufactureFilter(c) {
      
    let search = this.colFilterCtrl.value;
    if (!search) {
      this.typeOfManufacturers = this.typeOfManufacturers1;
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the s
    this.typeOfManufacturers = this.typeOfManufacturers1.filter(col => col.Name.toLowerCase().indexOf(search) > -1);

  }


  openCSIDialog(SoftwareType) {
    let route = 'h11/dd';
    route += SoftwareType == 'ns' ? '?type=ns' : '?type=nss';
    this.router.navigateByUrl(route);
  }

  SearchText: any;
  SearchOnColumn: any;
  SerchAssetid(columnName) {
    debugger;  
    // this.IsPageLoad= false;
    this.IsSearch = false;
    this.SearchText = "";
    this.SearchOnColumn = "";

    this.SearchOnColumn = columnName;
    this.SearchText = !this.AssetNoFilter.value ? "" : this.AssetNoFilter.value;
    if (!!this.SearchText) {
      this.IsSearch = true;
      this.SearchText = this.SearchText.trim();
    }
    if (this.IsSearch) {
      this.paginator.pageIndex = 0;
      this.paginationParams.pageSize = 50;
      this.paginationParams.currentPageIndex = 0;
      this.getSoftware();
    }
  }

  ClearSerch(columnName, isflag) {
      
    this.SearchOnColumn = "";
    this.SearchText = "";
    this.AssetNoFilter.setValue("");
    this.IsSearch = false;

    this.isButtonVisible = !isflag;

    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;
    this.getclear();
    this.getSoftware();
  }


  Serchicon(columnName, isflag) {
      
    this.SearchOnColumn = "";
    this.SearchText = "";
    this.AssetNoFilter.setValue("");
    this.IsSearch = false;

    this.isButtonVisible = isflag;

    if (columnName == "Software") { this.isButtonVisible = !isflag; }
  }

  getclear() {
    this.SearchOnColumn = "";
    this.SearchText = "";
    this.AssetNoFilter.setValue("");
    this.IsSearch = false;

    this.isButtonVisible = false;
  }

}
