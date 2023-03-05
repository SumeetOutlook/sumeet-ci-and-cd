import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
// import { MatPaginator } from '@angular/material/paginator';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AssetService } from 'app/components/services/AssetService';
import { AllPathService } from 'app/components/services/AllPathServices';
import * as headers from '../../../../assets/Headers.json';
import * as resource from '../../../../assets/Resource.json';
import { UploadService } from 'app/components/services/UploadService';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { ReconciliationService } from 'app/components/services/ReconciliationService';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/UserService';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import * as menuheaders from '../../../../assets/MenuHeaders.json';
import { FormControl } from '@angular/forms';
import { ITAMService } from 'app/components/services/ITAMService';
import { SelectionModel } from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';
import { take, takeUntil } from 'rxjs/operators';
import { CreateSoftwareInventoryDialogComponent } from '../dialogs/create-software-inventory-dialog/create-software-inventory-dialog.component';
import { SoftwareLicenseDetailsDialogComponent } from '../dialogs/software-license-details-dialog/software-license-details-dialog.component';

@Component({
  selector: 'app-software-licenses',
  templateUrl: './software-licenses.component.html',
  styleUrls: ['./software-licenses.component.scss']
})
export class SoftwareLicensesComponent implements OnInit {

  header: any = (headers as any).default;
  message: any = (resource as any).default;
  order: string;
  public dialogForm: FormGroup;
  selection = new SelectionModel<any>(true, []);

  SelectUploadedBy: any[] = [
    { value: 'GRN No', viewValue: this.header.GRNNo },
    { value: 'InventoryNumber', viewValue: this.header.InventoryNumber },
  ]

  IsCompanyAdmin: any = 1;
  FileNameWithPath: any;
  LocationId: any;
  menuheader: any = (menuheaders as any).default
  GroupId: any;
  RegionId: any;
  UserId: any;
  CompanyId: any;
  paginationParams: any;

  public ManufacturerCtrl: any;
  public ManufacturerFilterCtrl: FormControl = new FormControl();
  public filteredManufacturersMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public LicenseTypeCtrl: any;
  public LicenseTypeFilterCtrl: FormControl = new FormControl();
  public filteredLicenseTypeMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public LicenseOptionCtrl: any;
  public LicenseOptionFilterCtrl: FormControl = new FormControl();  

  public SoftwareSuiteCtrl: any;
  public SoftwareSuiteFilterCtrl: FormControl = new FormControl();
  public filteredSoftwareSuiteMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  protected _onDestroy = new Subject<void>();


  displayedHeaders = ['Select','Icon','License Name', 'Software','Manufacturer', 'License Type', 'License Option','Expiry Date','Package', 'Installations Allowed', 'Allocated', 'License Key', 'Status', '	Created By', 'Created Date', 'Last Updated By', 'Last Updated Date']
  displayedColumns: string[] = ['Select','Icon','License Name', 'Software','Manufacturer', 'LicenseType', 'LicenseOption','ExpiryDate','Package', 'InstallationsAllowed', 'Allocated', 'LicenseKey', 'Status', '	CreatedBy', 'CreatedTime', 'LastUpdatedBy', 'LastUpdatedTime'];
  //datasource = new MatTableDataSource(this.mandatory);
  datasource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, private fb: FormBuilder,
    public assetService: AssetService,
    public uploadService: UploadService,
    public confirmService: AppConfirmService,
    private loader: AppLoaderService, public allPathService: AllPathService,
    private storage: ManagerService,
    public reconciliationService: ReconciliationService,
    private router: Router,
    public alertService: MessageAlertService,
    public us: UserService,
    public toastr: ToastrService,
    public itamService : ITAMService) { }

  ngOnInit(): void {
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);

    this.ManufacturerCtrl = "";
    this.LicenseTypeCtrl = "";
    this.LicenseOptionCtrl = "";
    this.SoftwareSuiteCtrl = "";
    
    //this.buildItemForm();

    this.paginationParams = {
      pageSize: 50,
      currentPageIndex: 0,
      endIndex: 0,
      startIndex: 0,
      totalCount: 0,
    }
    this.GetInitiatedData();
  }

  public typeOfManufacturers: any[] = [];
  public typeOfLicenseType: any[] = [];
  public typeOfLicenseOption: any[] = [];
  public typeOfSoftwareSuite: any[] = [];

  GetInitiatedData() {
    var optionId = 1;
    let url5 = this.itamService.getSoftwareManufacturer();
    let url2 = this.itamService.getLicenseType();
    let url3 = this.itamService.getSoftwareSuite(optionId , 0);
    forkJoin([url5 , url2 , url3]).subscribe(results => {
      if (!!results[0]) {
        this.typeOfManufacturers = results[0];
        console.log(results[0]);
        this.getFilterManufacturer();
      }
      if (!!results[1]) {
        this.typeOfLicenseType = results[1];
        console.log(results[1]);
        this.getFilterLicenseType();
      }
      if (!!results[2]) {
        this.typeOfSoftwareSuite = results[2];
        console.log(results[2]);
        this.getFilterSoftwareSuite();
      }
      //this.getSoftwareLicenseList();
    })
  }

  onChangeLicenseType(typeId) {    
    this.itamService.getLicenseOption(typeId).subscribe((res: any) => {
      this.typeOfLicenseOption = res;
      console.log(res);
    });
  }
  uploadNameBy: any;
  handlePage(pageEvent: PageEvent) {
    debugger;
    this.paginationParams.pageSize = pageEvent.pageSize;
    this.paginationParams.currentPageIndex = pageEvent.pageIndex;
    this.paginationParams.endIndex = (this.paginationParams.currentPageIndex + 1) * pageEvent.pageSize;
    this.paginationParams.startIndex = this.paginationParams.currentPageIndex * pageEvent.pageSize;   
  }

  getSoftwareLicenseList() {
    // this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;
    this.getSoftwareLicenseBindData();
  }

  DataForGrid: any[] = [];
  getSoftwareLicenseBindData() {
    debugger;
    //this.loader.open();
    var reqData = {
      LicenseAgreementDetailID : 0,
      CompanyId: this.CompanyId,
      GroupID: this.GroupId,
      searchManufacturer: !!this.ManufacturerCtrl ? this.ManufacturerCtrl.join(',') :  null,   
      searchSoftware : !!this.SoftwareSuiteCtrl ? this.SoftwareSuiteCtrl.join(',') :  null,  
      searchLicenseType :  !!this.LicenseTypeCtrl ? this.LicenseTypeCtrl.join(',') :  null,  
      searchLicenseOption : !!this.LicenseOptionCtrl ? this.LicenseOptionCtrl.join(',') :  null, 
      pageSize: this.paginationParams.pageSize,
      pageNo: this.paginationParams.currentPageIndex + 1
    }

    this.itamService.getSoftwareLicenseList(reqData).subscribe((res: any) => {
      //this.loader.close();
      debugger;
      var bindData = [];
      console.log(res);
      if(!!res && res != 'null')
          bindData = res;
      this.onChangeDataSource(bindData);
    })

  }

  GetLicenseDetails(element: any = {}) {
    debugger;
    let title = 'Add new member';
    const dialogRef = this.dialog.open(SoftwareLicenseDetailsDialogComponent, {
      width: 'auto',
      disableClose: true,
      data: { title: title, payload: element }
    });
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          return;
        }
      })
  }

  onChangeDataSource(value) {
    debugger;
    this.datasource = new MatTableDataSource(value);
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
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
  

  applyFilter(filterValue: string) {
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  selectedPath: string;

  donloadexcels(v) {
    debugger;
    this.loader.open();
    this.selectedPath = v.FileName;
    this.allPathService.DownloadExcelGrnAsset(this.selectedPath);
    this.loader.close();
  }

  deleteSoftwareLicense(){
    debugger;
    var id = this.getselectedIds[0].softwareID;
    this.itamService.deleteSoftwareLicense(id).subscribe((res: any) => {
      console.log(res);
      debugger;
      this.getselectedIds= [];
      this.selection.clear();
      this.toastr.success("success", this.message.AssetrakSays);
      //this.getSoftware();
    });
  }
  openCSIDialog() {
    this.router.navigateByUrl('h11/ff');
    // let title = 'Create Software Inventory';
    // const dialogRef = this.dialog.open(CreateSoftwareInventoryDialogComponent, {
    //   width: 'auto',
    //   data: { title: title}
    // });
    // dialogRef.afterClosed()
    //   .subscribe(res => {
    //     if (!res) {
    //       return;
    //     }
    //   })
  }

  EditDetails(data: any = {}) {
    this.router.navigateByUrl('h11/fff');
   
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
              this.ManufacturerCtrl.push(element.Name);
            });
          }
          else{
            this.typeOfManufacturers.forEach(element => {
              this.ManufacturerCtrl.push(element.Name);
            });
          }          
        } else {
          this.ManufacturerCtrl = "";
        }        
      });
  }

  getFilterLicenseType() {
    this.filteredLicenseTypeMulti.next(this.typeOfLicenseType.slice());    
    this.LicenseTypeFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterLicenseTypeMulti();
      });
  }
  protected filterLicenseTypeMulti() {
    if (!this.typeOfLicenseType) {
      return;
    }
    let search = this.LicenseTypeFilterCtrl.value;
    if (!search) {
      this.filteredLicenseTypeMulti.next(this.typeOfLicenseType.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredLicenseTypeMulti.next(
      this.typeOfLicenseType.filter(x => x.SoftwareTypeName.toLowerCase().indexOf(search) > -1)
    );
  }

  toggleSelectAllSoftwareType(selectAllValue) {    
    this.LicenseTypeCtrl = [];
    this.filteredLicenseTypeMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {       
        if (!!selectAllValue.checked) {
          let search = this.LicenseTypeFilterCtrl.value;
          if(!!search){
            this.typeOfLicenseType.filter(x => x.SoftwareTypeName.toLowerCase().indexOf(search) > -1).forEach(element => {
              this.LicenseTypeCtrl.push(element.SoftwareTypeName);
            });
          }
          else{
            this.typeOfLicenseType.forEach(element => {
              this.LicenseTypeCtrl.push(element.SoftwareTypeName);
            });
          }          
        } else {
          this.LicenseTypeCtrl = "";
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
              this.SoftwareSuiteCtrl.push(element.SoftwareName);
            });
          }
          else{
            this.typeOfSoftwareSuite.forEach(element => {
              this.SoftwareSuiteCtrl.push(element.SoftwareName);
            });
          }          
        } else {
          this.SoftwareSuiteCtrl = "";
        }        
      });
  }

}
