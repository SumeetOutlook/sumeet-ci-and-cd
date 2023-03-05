import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LocalStoreService } from 'app/shared/services/local-store.service';
import { SbuService } from 'app/components/services/SbuService';
import { LocationService } from 'app/components/services/LocationService';
import { StoragelocationService } from 'app/components/services/StoragelocationService';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as headers from '../../../../assets/Headers.json';
import * as resource from '../../../../assets/Resource.json';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/UserService';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { SbuAddEditDialogComponent } from './sbu_add_edit_dialog/sbu_add_edit_dialog.component';
import { LocationDialogComponent } from './location_add_edit_dialog/location_add_edit_dialog.component';
import { StorageLocationDialogComponent } from './storageLocation_add_edit_dialog/storageLocation_add_edit_dialog.component'
import { SbuUploadDialogComponent } from './sbu-upload-dialog/sbu-upload-dialog.component';
import { LocationUploadDialogComponent } from './location-upload-dialog/location-upload-dialog.component';
import { RackUploadDialogComponent } from './rack-upload-dialog/rack-upload-dialog.component';
import * as menuheaders from '../../../../assets/MenuHeaders.json';
import { CompanyService } from 'app/components/services/CompanyService';
import { AllPathService } from 'app/components/services/AllPathServices';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

export interface PeriodicElement {
  name: string;
  location: any[];
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-SbuLocationStorageLocation',
  templateUrl: './sbu_location.component.html',
  styleUrls: ['./sbu_location.component.scss']
})
export class SBULocationStorageLocationComponent implements OnInit {

  header: any;
  message: any;
  menuheader: any = (menuheaders as any).default

  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  @ViewChild('table', { static: true }) table: any;

  @ViewChild('PaginatorForL', { static: true }) paginatorForL: MatPaginator;
  @ViewChild('SortForL', { static: true }) sortForL: MatSort;
  @ViewChild('TableForL', { static: true }) tableForL: any;

  @ViewChild('PaginatorForS', { static: true }) paginatorForS: MatPaginator;
  @ViewChild('SortForS', { static: true }) sortForS: MatSort;
  @ViewChild('TableForS', { static: true }) tableForS: any;

  displayedHeaders :any[]= []
  displayedColumns: string[] = ['SBU', 'Actions'];

  displayedHeadersL :any[]= []
  displayedColumnsL: string[] = ['LocationName', 'ActionsL'];

  displayedHeadersS :any[]= []
  displayedColumnsS: string[] = ['RackName', 'ActionsS'];

  dataSource: any;
  SBUData: any;
  updateSBUDataInsert: any;
  updateSBUValue: any;
  deleteSBUOptions: { option: any; data: any; };
  SBUId: any;
  LabelForLocation: any;
  LabelForStorageLocation: any;
  LocationAddDisable: boolean = true;
  StorageLocationAddDisable: boolean = true;

  dataSourceL: any;
  LocationData: any;
  updateLocationDataInsert: any;
  updateLocationValue: any;
  deleteLocationOptions: { option: any; data: any; };
  LocationId: any;

  dataSourceS: any;
  storageLocationData: any;
  updateStorageLocationDataInsert: any;
  updateStorageLocationValue: any;
  deleteStorageLocationOptions: { option: any; data: any; };

  //Hide Location & StorageLocation when login by level Group & Region
  groupIdSession: any;
  regionIdSession: any;
  companyIdSession: any;
  userIdSession: any;

  public openCarddata = false;
  public displayedLocations: string[] = ['location', 'getlocationdetails'];
  public displayedStoragelocations: string[] = ['storagelocation', 'getstoragelocationdetails'];
  public data = Object.assign(ELEMENT_DATA);
  //public dataSource = new MatTableDataSource<Element>(this.data);
  public selection = new SelectionModel<Element>(true, []);
  public sbudata;
  public addsbudata;
  public disableadd = true;
  public disableadd1 = true;
  private myDataArray: any;
  public locationData: any;
  public dataStoragelocation: any;
  public highlightedRows = [];
  public currentGroupIndex: any;
  public currentCompIndex: any;
  public selectedrows1 = [];
  public selectedrows2 = [];
  public toselect = 0;
  public len = 0;
  GroupId: any;
  RegionId: any;
  CompanyId: any;
  UserId: any;
   isexport: boolean= false;

  constructor(
    private dialog: MatDialog,
    public localService: LocalStoreService,
    public sbuService: SbuService,
    public locationService: LocationService,
    public storagelocationService: StoragelocationService,
    public toastr: ToastrService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private storage: ManagerService,
    private router: Router,
    public alertService: MessageAlertService,
    public us: UserService,
    public cs: CompanyService,
    public AllPathService: AllPathService,
    private jwtAuth : JwtAuthService
  )
   {
    this.header = this.jwtAuth.getHeaders();
    this.message = this.jwtAuth.getResources();
    this.displayedHeaders = [this.header.SBU, this.header.Actions]
    this.displayedHeadersL = [this.header.Location, this.header.Actions]
   this.displayedHeadersS = [this.header.StorageLocation, this.header.Actions]
    }

  ngOnInit(): void {
    this.loader.open();
    this.groupIdSession = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.regionIdSession = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.companyIdSession = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.userIdSession = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);

    for (let i = 0; i < this.data.length; i++) {
      this.selectedrows1.push("");
      for (let i = 0; i < this.data[i].type.length; i++) {
        this.selectedrows2.push("");
      }
    }
    this.GetInitiatedData();
    this.GetAllSBU();
    this.GetAllCountryStateCity();
    this.loader.close();
  }

  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  GetInitiatedData() {
    let url5 = this.us.PermissionRightsByUserIdAndPageId(this.groupIdSession, this.userIdSession, this.companyIdSession, this.regionIdSession, "12,13,14");
    forkJoin([url5]).subscribe(results => {
      if (!!results[0]) {
         
        this.ListOfPagePermission = JSON.parse(results[0]);
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
  //SBU
  GetAllSBU() {
     
    this.LabelForLocation = "";
    this.LabelForStorageLocation = "";
    this.dataSourceS = "";
    this.dataSourceL = "";
    this.LocationAddDisable = true;
    this.StorageLocationAddDisable = true;
    var GroupId = this.groupIdSession;
    var RegionId = this.regionIdSession;
    var CompanyId = this.companyIdSession;
    this.sbuService.GetAllSbuData(GroupId, RegionId, CompanyId ).subscribe(response => {
       
      this.SBUData = response;
      this.onChangeDataSource(response);
    })
  }
  AllCityData: any[] = [];
  AllStateData: any[] = [];
  countries: any[] = [];
  GetAllCountryStateCity() {
    let url1 = this.cs.GetAllCityData();
    let url2 = this.cs.GetAllStateData();
    let url3 = this.cs.GetAllCountryData();
    forkJoin([url1, url2, url3]).subscribe(results => {
       
      if (!!results[0]) {
        this.AllCityData = results[0];
      }
      if (!!results[1]) {
        this.AllStateData = results[1];
      }
      if (!!results[2]) {
        this.countries = results[2];
      }
    })
  }
  onChangeDataSource(value) {
     
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  AddSBU(result: any) {
    var SBUData = {
      SBU: result.sbu,
      GroupId: this.groupIdSession,
      RegionId: this.regionIdSession,
      CompanyId: this.companyIdSession,
    }
    this.sbuService.AddSbu(SBUData).subscribe(r => {
      if (r == "Success") {
        this.toastr.success(this.message.SuccessSBU, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.SBUExist, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }

      this.GetAllSBU();
    })
  }

  // opens sbu file upload dialog & uploads sbu file info
  openSbuUpload(): void {
     
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";

    const uploadService = this.dialog.open(SbuUploadDialogComponent, dialogConfig);

    uploadService.afterClosed().subscribe(res => {
      if (res) {
        this.loader.open();
        var uploadedFileInfo = {
          FileName: res,
          GroupID: this.groupIdSession,
          RegionId: this.regionIdSession,
          CompanyID: this.companyIdSession
        }

        this.sbuService.SbuFileInfoUpload(uploadedFileInfo).subscribe(res => {
          this.loader.close();
          if (res[0] == "Success") {
            this.toastr.success(this.message.SBUUploadSuccess, this.message.AssetrakSays);
          } else if (res[0] != null) {
            this.toastr.warning(res[0], this.message.AssetrakSays);
          } else if (res[0] == null) {
            this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
          }
          this.GetAllSBU();
        });
      }
    });
  }

  // opens location file upload dialog & uploads location file info
  openLocationUpload(): void {
     
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";

    const uploadService = this.dialog.open(LocationUploadDialogComponent, dialogConfig);

    uploadService.afterClosed().subscribe(res => {
      if (!!res) {
        this.loader.open();
        debugger;
        var uploadedFileInfo = {
          FileName: res,
          CompanyId: this.companyIdSession,
          Zone: this.LabelForLocation,
          userId: this.userIdSession,
          companyType: ""
        }

        this.locationService.LocationFileInfoUpload(uploadedFileInfo).subscribe(res => {
          this.loader.close();
          debugger;
          if (res == "Success") {
            this.toastr.success(this.message.PlantUploadSuccess, this.message.AssetrakSays);
          } else if (res != null) {
            this.toastr.warning(res, this.message.AssetrakSays);
          } else if (res == null) {
            this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
          }
          this.GetAllLocations();
        });
      }
    });
  }


  // opens rack file upload dialog and uploads rack file info  
  openRackUpload(): void {
     
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";

    const uploadService = this.dialog.open(RackUploadDialogComponent, dialogConfig);

    uploadService.afterClosed().subscribe(res => {
      if (res) {
        this.loader.open();
        var uploadedFileInfo = {
          FileName: res,
          CompanyId: this.companyIdSession,
          LocationID: this.LocationId
        }

        this.storagelocationService.RackFileInfoUpload(uploadedFileInfo).subscribe(res => {
          this.loader.close();
          if (res[0] == "Success") {
            this.toastr.success(this.message.SubLocationUploadSuccess, this.message.AssetrakSays);
          } else if (res[0] == "Exists") {
            this.toastr.warning(this.message.AssetSubLocationExits, this.message.AssetrakSays);
          } else if (res[0] != null) {
            this.toastr.warning(res[0], this.message.AssetrakSays);
          } else if (res[0] == null) {
            this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
          }

          this.GetAllStorageLocationByCompanyLocationId();
        });
      }
    });
  }

  GetSBUByID() {
     
    var Id = "";
    this.sbuService.SbuGetById(Id).subscribe(r => {
       
    })
  }

  UpdateSBU(result: any) {
    this.loader.open();
    var sbuData = {
      Id: result.SBUId,
      SBU: result.sbu,
      GroupId: this.groupIdSession,
      RegionId: this.regionIdSession,
      CompanyId: this.companyIdSession
    }
    this.sbuService.SbuUpdate(sbuData).subscribe(r => {
      this.loader.close();
      if (r == "Success") {
        this.toastr.success(this.message.SBUUpdate, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.SBUExist, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetAllSBU();
    })
  }

  RemoveSBU(result: any) {    

    var sbuData = {
      Id: result.data.Id,
      CompanyId: this.companyIdSession,
      SBU: result.data.SBU
    }
    this.loader.open();
    this.sbuService.RemoveSbuById(sbuData).subscribe(r => {
      this.loader.close();
      if (r == "Success") {
        var msg = this.message.SBUDelete;
        msg = msg.replace('xxxx', result.data.SBU); 
        this.toastr.success(msg , this.message.AssetrakSays);
        this.GetAllSBU();
      }
      else if (r == "Exists") {
        var msg = this.message.SBUDeleteWarning;
        msg = msg.replace('xxxx', result.data.SBU); 
        this.toastr.warning(msg , this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      
    })
  }

  openDialog(...getValue): void {
     
    var component: any
    if (getValue[0] === 'upload') {
      //component=UploadRegionPopUpComponent
    }
    else {
      component = SbuAddEditDialogComponent;
    }
     
    const dialogRef = this.dialog.open(component, {
      panelClass: 'sbu-form-dialog',
      disableClose: true,
      data: {
        component1: 'SBUComponent',
        value: getValue[0],
        name: getValue[1],
      },
    });

     
    dialogRef.afterClosed().subscribe(result => {
      if (result && getValue[0] === 'edit') {
         
        this.updateSBUValue = result;
        this.updateSBUValue['SBUId'] = getValue[1].Id;

        this.UpdateSBU(this.updateSBUValue)
      }
      else if (result && getValue[0] === 'insert') {
         
        this.updateSBUDataInsert = result;
        this.loader.open();
        this.AddSBU(this.updateSBUDataInsert)
        this.loader.close();
      }

    });
  }

  deleteSBU(...vars) {
    this.deleteSBUOptions = {
      option: vars[0],
      data: vars[1]
    }
     
    this.confirmService.confirm({ message: this.message.SBUDeleteNotification, title: this.message.AssetrakSays })
      .subscribe(res => {
        if (res) {          
          this.RemoveSBU(this.deleteSBUOptions);          
        }
      })

  }
  selectedRowIndex : any ;
  selectedRowIndex1 : any ;
  public GetSBUId(currentData, index) {
     
    if (this.companyIdSession > 0) {
      this.selectedRowIndex = currentData.SBU ;
      this.selectedRowIndex1 = -1 ;
      this.LabelForLocation = "";
      this.LabelForStorageLocation = "";
      this.LabelForLocation = currentData.SBU;
      this.dataSourceL = "";
      this.dataSourceS = "";
      this.SBUId = currentData.Id;
      this.LocationAddDisable = false;
      this.GetAllLocations();
    }
  }
  //EndSBU


  //Location
  GetAllLocations() {
    this.loader.open();
    this.LabelForStorageLocation = "";
    this.dataSourceS = "";
    this.StorageLocationAddDisable = true;
    var companyId = this.companyIdSession;
    var SBUName = this.LabelForLocation;
    this.locationService.GetAllLocationData(companyId, SBUName).subscribe(response => {
      this.loader.close();
      this.LocationData = response;
      this.onChangeDataSourceL(response);
    })
  }

  onChangeDataSourceL(value) {
     
    this.dataSourceL = new MatTableDataSource(value);
    this.dataSourceL.paginator = this.paginatorForL;
    this.dataSourceL.sort = this.sortForL;
  }

  applyFilterL(filterValue: string) {
    this.dataSourceL.filter = filterValue.trim().toLowerCase();
  }

  AddLocation(result: any) {
    debugger;
    var locationData = {
      LocationName: result.locationName,
      CompanyId: this.companyIdSession,
      Address1: result.address1,
      Address2: result.address2,
      Country: result.country,
      State: result.state,
      City: result.city,
      CreatedBy: 1,
      locationType: "Company",
      LocationCode: result.locationCode,
      ZipCode: result.zipCode,
      Zone: this.LabelForLocation,
      LocationName2: result.locationName2,
      GroupId:this.groupIdSession
    }
    this.locationService.AddLocation(locationData).subscribe(r => {
      if (r == "Success") {
        this.toastr.success(this.message.SucessLocation, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.LocationExists, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetAllLocations();
    })
  }

  GetLocationByID() {
     
    var Id = "";
    this.locationService.LocationGetById(Id).subscribe(r => {
       
    })
  }

  UpdateLocation(result: any) {
    this.loader.open();
    var locationData = {
      LocationName: result.locationName,
      LocationId: result.LocationId,
      CompanyId: this.companyIdSession,
      Address1: result.address1,
      Address2: result.address2,
      newCountry: result.country,
      newState: result.state,
      newCity: result.city,
      LocationCode: result.locationCode,
      ZipCode: result.zipCode,
      LocationName2: result.locationName2,
      Zone: this.LabelForLocation
    }
    this.locationService.LocationUpdate(locationData).subscribe(r => {
      this.loader.close();
      if (r == "Success") {
        this.toastr.success(this.message.LocationUpdate, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.LocationExists, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetAllLocations();

    })
  }

  RemoveLocation(result: any) {
     
    var locationData = {
      LocationId: result.data.LocationId,
    }
    this.loader.open();
    this.locationService.RemoveLocationById(locationData).subscribe(r => {
      this.loader.close();
      if (r == "Success") {
        var msg = this.message.LocationDelete;
        msg = msg.replace('xxxx', result.data.LocationName); 
        this.toastr.success(msg , this.message.AssetrakSays);
        this.GetAllLocations();
      }
      else if (r == "Exists") {
        var msg = this.message.LocaionDeleteAssetAvailable;
        msg = msg.replace('xxxx', result.data.LocationName); 
        this.toastr.warning(msg , this.message.AssetrakSays);
        //this.toastr.warning(this.message.LocationDeleteFail, this.message.AssetrakSays);
      }
      else if (r == "SubLocation Exists") {
        var msg = this.message.LocaionDeleteSubLocationExists;
        msg = msg.replace('xxxx', result.data.LocationName); 
        this.toastr.warning(msg , this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      
    })
  }

  openDialogL(...getValue): void {
     
    var component: any
    if (getValue[0] === 'upload') {
      //component=UploadDialogComponent
    }
    else {
      component = LocationDialogComponent;
    }
    const dialogRef = this.dialog.open(component, {
      panelClass: 'SBU-form-dialog',
      disableClose: true,
      width: '520px',
      data: {
        component1: 'LocationComponent',
        value: getValue[0],
        name: getValue[1],
        AllCityData : this.AllCityData,
        AllStateData : this.AllStateData,
        countries : this.countries
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && getValue[0] === 'edit') {
         
        this.updateLocationValue = result;
        this.updateLocationValue['LocationId'] = getValue[1].LocationId;

        this.UpdateLocation(this.updateLocationValue)
      }
      else if (result && getValue[0] === 'insert') {
         
        this.updateLocationDataInsert = result;
        this.AddLocation(this.updateLocationDataInsert)
      }
    });
  }


  deleteLOcation(...vars) {
    this.deleteLocationOptions = {
      option: vars[0],
      data: vars[1]

    }
     
    this.confirmService.confirm({ message: this.message.LocationDeleteNotification, title: this.message.AssetrakSays })
      .subscribe(res => {
        if (res) {
          
          this.RemoveLocation(this.deleteLocationOptions);
          
        }
      })
  }

  public GetLocationId(currentData, index) {
    this.selectedRowIndex1 = currentData.LocationName;
    this.LabelForStorageLocation = currentData.LocationName;
    this.LocationId = currentData.LocationId;
    this.StorageLocationAddDisable = false;
    this.GetAllStorageLocationByCompanyLocationId();
  }
  //EndLocation


  //StorageLocation
  GetAllStorageLocationByCompanyLocationId() {
    this.loader.open();
    var CId = this.companyIdSession;
    var LId = this.LocationId;
    this.storagelocationService.GetAllStoragelocationData(CId, LId).subscribe(response => {
      this.loader.close();
      this.storageLocationData = response;
      this.onChangeDataSourceS(response);
    })
  }

  onChangeDataSourceS(value) {
     
    this.dataSourceS = new MatTableDataSource(value);
    this.dataSourceS.paginator = this.paginatorForS;
    this.dataSourceS.sort = this.sortForS;
  }

  applyFilterS(filterValue: string) {
    this.dataSourceS.filter = filterValue.trim().toLowerCase();
  }

  AddStorageLocation(result: any) {
    var storagelocationData = {
      RackName: result.rackName,
      CompanyId: this.companyIdSession,
      LocationID: this.LocationId
    }
    this.storagelocationService.AddStoragelocation(storagelocationData).subscribe(r => {
      if (r == "Success") {
        this.toastr.success(this.message.StorageLocationSucess, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.StorageLocationExist, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetAllStorageLocationByCompanyLocationId();
    })
  }

  GetStorageLocationByID() {
     
    var Id = "";
    this.storagelocationService.StoragelocationGetById(Id).subscribe(r => {
       
    })
  }

  UpdateStorageLocation(result: any) {
    this.loader.open();
    var storagelocationData = {
      RackName: result.rackName,
      RackID: result.RackId,
      CompanyId: this.companyIdSession,
      LocationID: this.LocationId
    }
    this.storagelocationService.StoragelocationUpdate(storagelocationData).subscribe(r => {
      this.loader.close();
      if (r == "Success") {
        this.toastr.success(this.message.StorageLocationUpdate, this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        this.toastr.warning(this.message.StorageLocationExist, this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetAllStorageLocationByCompanyLocationId();
    })
  }

  RemoveStorageLocation(result: any) {
     
    var companyData = {
      LocationID: this.LocationId,
      RackID: result.data.RackID,
    }
    this.loader.open();
    this.storagelocationService.RemoveStoragelocationById(companyData).subscribe(r => {
      this.loader.close();
      if (r == "Success") {
        var msg = this.message.StorageLocationDelete;
        msg = msg.replace('xxxx', result.data.RackName); 
        this.toastr.success(msg , this.message.AssetrakSays);
      }
      else if (r == "Exists") {
        var msg = this.message.StorageLocationRemoveFail;
        msg = msg.replace('xxxx', result.data.RackName); 
        this.toastr.warning(msg , this.message.AssetrakSays);
      }
      else if (r == "Fail") {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
      this.GetAllStorageLocationByCompanyLocationId();
    })
  }


  openDialogS(...getValue): void {
     
    var component: any
    if (getValue[0] === 'upload') {
      //component=UploadDialogComponent
    }
    else {
      component = StorageLocationDialogComponent;
    }
    const dialogRef = this.dialog.open(component, {
      panelClass: 'SBU-form-dialog',
      disableClose: true,
      data: {
        component1: 'StorageLocationComponent',
        value: getValue[0],
        name: getValue[1],
      },
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result && getValue[0] === 'edit') {
         
        this.updateStorageLocationValue = result;
        this.updateStorageLocationValue['RackId'] = getValue[1].RackID;

        this.UpdateStorageLocation(this.updateStorageLocationValue)
      }
      else if (result && getValue[0] === 'insert') {
         
        this.updateStorageLocationDataInsert = result;
        this.AddStorageLocation(this.updateStorageLocationDataInsert)
      }

    });
  }

  deleteSTorageLocation(...vars) {
    this.deleteStorageLocationOptions = {
      option: vars[0],
      data: vars[1]

    }
     
    this.confirmService.confirm({ message: this.message.SubLocationDeleteNotification, title: this.message.AssetrakSays })
      .subscribe(res => {
        if (res) {
          
          this.RemoveStorageLocation(this.deleteStorageLocationOptions);
        
        }
      })

  }
  //EndStorageLocation


  public openAddSbu(selecttype) {
    const dialogconfigcom1 = new MatDialogConfig();
    dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = "40%";
     
    this.localService.setItem('settype', selecttype);
    const modalService = this.dialog.open(SbuAddEditDialogComponent, dialogconfigcom1);
     
    modalService.afterClosed().subscribe((res) => {
      let addedSbu = this.localService.getItem('addsbudata');
      //this.data.push(this.addedcategory);
      this.dataSource = new MatTableDataSource<Element>(this.data);


      if (addedSbu) {
        if (addedSbu.type == 'sbu') {
          let tempObject1 = {
            name: addedSbu.name,
            type: []
          }
          this.data.push(tempObject1);
        } else if (addedSbu.type == 'location') {
          let tempObject = {
            name: addedSbu.name,
            comp: []
          }
          this.data[this.currentGroupIndex].type.push(tempObject);
          this.locationData = new MatTableDataSource<Element>(this.data[this.currentGroupIndex].type);

        } else if (addedSbu.type == 'storagelocation') {
          this.data[this.currentGroupIndex].type[this.currentCompIndex].comp.push(addedSbu.name);
          this.dataStoragelocation = new MatTableDataSource<Element>(this.data[this.currentGroupIndex].type[this.currentCompIndex].comp);
        }
        this.dataSource = new MatTableDataSource<Element>(this.data);
        console.log(this.data);
      }
    })
  }

  public openEditDialog(element, rowid: number, selectedtype) {
    //console.log(element, rowid, type)
     
    const dialogconfigcom = new MatDialogConfig();
    let name = String;
    if (selectedtype == 'storagelocation') {
      name = element;
    } else {
      name = element.name;
    }
    let payloadObject = {
      index: rowid,
      name: name,
      type: selectedtype
    }
    dialogconfigcom.disableClose = true;
    dialogconfigcom.autoFocus = true;
    dialogconfigcom.width = "40%";
     
    this.sbudata = payloadObject;
    this.localService.setItem("selectedsbu", this.sbudata);
    const modalService = this.dialog.open(SbuAddEditDialogComponent, dialogconfigcom);

    modalService.afterClosed().subscribe((res) => {
      let changedName = this.localService.getItem('selectedsbu');
      if (changedName) {
        if (selectedtype == 'sbu') {
          this.data[changedName.index].name = changedName.name;
        } else if (selectedtype == 'location') {
          this.data[this.currentGroupIndex].type[changedName.index].name = changedName.name;
        } else if (selectedtype == 'storagelocation') {
          this.data[this.currentGroupIndex].type[this.currentCompIndex].comp[changedName.index] = changedName.name;
        }
        this.dataSource = new MatTableDataSource<Element>(this.data);
      }
    })
  }
  public getRecord() { }
  getCard(i) {
    console.log(i);
    this.toselect = i;
    for (let k = 0; k < this.selectedrows2.length; k++) {
      if (this.selectedrows2[k] === 'true') {
        this.selectedrows2[k] = "";
      }
    }
    for (let j = 0; j < this.selectedrows1.length; j++) {
      this.selectedrows1[i] = "true";
      if (this.selectedrows1[j] === 'true') {
        if (i != j) {
          this.selectedrows1[j] = "";
        }
      }
    }
  }


  getcard1(i) {
     
    console.log(i);
    this.len = this.toselect * (this.data[this.toselect].type.length);
    for (let j = 0; j < this.selectedrows2.length; j++) {
      this.selectedrows2[this.len + i] = "true";
      if (this.selectedrows2[j] === 'true') {
        if ((this.len + i) != j) {
          this.selectedrows2[j] = "";
        }
      }
    }
  }

  public deleteSbu(rowid: number) {
    this.dataSource.data.splice(rowid, 1);
    this.dataSource = new MatTableDataSource<Element>(this.dataSource.data);
    this.locationData = [];
    this.dataStoragelocation = [];
  }

  public deleteLocation(typeId: number) {
    this.data[this.currentGroupIndex].type.splice(typeId, 1);
    this.dataSource = new MatTableDataSource<Element>(this.data);
    this.locationData = new MatTableDataSource<Element>(this.data[this.currentGroupIndex].type);
    console.log(this.locationData);
    this.dataStoragelocation = [];
  }

  public deleteStorageLocation(compId: number) {
    this.data[this.currentGroupIndex].type[this.currentCompIndex].comp.splice(compId, 1);
    this.dataSource = new MatTableDataSource<Element>(this.data);
    this.dataStoragelocation = new MatTableDataSource<Element>(this.data[this.currentGroupIndex].type[this.currentCompIndex].comp);
    // console.log(this.dataCompany);
  }

  public showNextData(currentData, index) {
    this.dataStoragelocation = [];
    this.disableadd1 = true;
    console.log(currentData, 'current data');
    this.locationData = currentData.type;
    this.disableadd = false;
    this.currentGroupIndex = index;
  }

  public showNextStoragelocationData(currentData1, index1) {
    this.dataStoragelocation = currentData1.comp;
    this.disableadd1 = false;
    console.log(currentData1, 'current compdata');
    this.currentCompIndex = index1;
  }




  // public addEvent() {
  //   this.dialogRef = this.dialog.open(Group_dialogComponent, {
  //     panelClass: 'calendar-form-dialog',
  //     data: {
  //       action: 'add',
  //       date: new Date()
  //     },
  //     width: '450px'
  //   });
  //   this.dialogRef.afterClosed()
  //     .subscribe((res) => {


  //     });
  // }

  openLocationDialog(...getValue): void {
     
    var component: any
    if (getValue[0] === 'upload') {
      //component=UploadDialogComponent
    }
    else {
      component = LocationDialogComponent;
    }
    const dialogRef = this.dialog.open(component, {
      panelClass: 'group-form-dialog',
      data: {
        component: 'SBULocationStorageLocationComponent',
        value: getValue[0],
        name: getValue[1]
      },
    });
  }


  openStorageLocationDialog(...getValue): void {
    //   
    var component: any
    if (getValue[0] === 'upload') {
      //component=UploadDialogComponent
    }
    else {
      component = StorageLocationDialogComponent;
    }
    const dialogstrRef = this.dialog.open(component, {
      panelClass: 'group-form-dialog',
      data: {
        component: 'SBULocationStorageLocationComponent',
        value: getValue[0],
        name: getValue[1]
      },
    });
  }

  exportSBUFile()
  {
    debugger;
    this.isexport = true;
    this.LabelForLocation = "";
    this.LabelForStorageLocation = "";
    this.dataSourceS = "";
    this.dataSourceL = "";
    this.LocationAddDisable = true;
    this.StorageLocationAddDisable = true;
    var GroupId = this.groupIdSession;
    var RegionId = this.regionIdSession;
    var CompanyId = this.companyIdSession;
    if(this.isexport == true)
    {
      this.isexport = true;
    }
    else 
    {
      this.isexport = false;
    }
    this.sbuService.GetSbuExport(GroupId, RegionId, CompanyId,this.isexport).subscribe(r => {
    
      if (!!r) {
        this.AllPathService.DownloadExportFile(r);
        console.log("URL", URL);
      }
    })
  }

  exportplantFile()
  {
    this.loader.open();
    this.LabelForStorageLocation = "";
    this.dataSourceS = "";
    this.StorageLocationAddDisable = true;
    var companyId = this.companyIdSession;
    var SBUName = this.LabelForLocation;
    var isExport = true 
    this.locationService.GetLocationexport(companyId, SBUName,isExport).subscribe(r => {
      this.loader.close();
      if (!!r) {
        this.AllPathService.DownloadExportFile(r);
        console.log("URL", URL);
      }
    })
  }

  exportsubplantfile()
  {
    // this.loader.open();
    var CId = this.companyIdSession;
    var LId = this.LocationId;
    var isExport = true;
    this.storagelocationService.ExportStoragelocationData(CId, LId,isExport).subscribe(r => {
      if (!!r) {
        this.AllPathService.DownloadExportFile(r);
        console.log("URL", URL);
      }
    })
  }

}
