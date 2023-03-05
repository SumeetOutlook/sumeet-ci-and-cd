import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ReconciliationService } from '../../../services/ReconciliationService';
import { CompanyRackService } from '../../../services/CompanyRackService';
import { CompanyLocationService } from '../../../services/CompanyLocationService';
import { DatePipe } from '@angular/common';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { ToastrService } from 'ngx-toastr';
import { UploadDialogComponent } from '../../dialog/upload-dialog/upload-dialog.component';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-asset-transfer-reinitiate-dialog',
  templateUrl: './asset-transfer-reinitiate-dialog.component.html',
  styleUrls: ['./asset-transfer-reinitiate-dialog.component.scss']
})
export class AssetTransferReinitiateDialogComponent implements OnInit {

  headers: any = [];
  message: any ;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('table', { static: false }) table: any;
  displayedColumns: string[] = ['select','Icon', 'Inventory No.', 'Asset No.', 'Sub No.', 'Asset Class', 'Asset Name', 'Asset Description', 'Serial No', 'IT Serial No', 'Plant', 'Cost', 'WDV', 'Inventory Indicator']
  dataSource: any;
  dataSourceNew: any;
  json: any;
  bindData: any[] = [];
  dialogForm: FormGroup;
  selection = new SelectionModel<any>(true, []);
  selectionNew = new SelectionModel<any>(true, []);
  transfertypeList: any[] = [];
  result: any[] = [];
  ListCost: any[] = [];
  ListOfStorage: any[] = [];
  private isButtonVisible = false;
  isDisabled :boolean = true;
  minDate = new Date();
  
  public destinationfilterCtrl: FormControl = new FormControl();
  public filtereddestinationMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();

  CompanyId: any;
  LocationId: any;
  UserId: any;
  GroupId: any;
  layerid: any;
  sbufilter: any;

  showLocation: boolean = false;
  sbutosbunotallowed: boolean = false;
  showCostCenters: boolean = false;
  showStorageLocations: boolean = false;
  outWardlocations: boolean = false;
  outwardType: any;
  approvaltab: boolean = false;
  informationtab: boolean = false;
  withdrawntab: boolean = false;
  title: any;
  transfertype: any;
  ShowNewDataSource: boolean = false;

  AssetNoFilter = new FormControl();
  filteredValues = {
    AssetNo: ''
  };

  paginationParams: any;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    public rs: ReconciliationService,
    private fb: FormBuilder,
    public crs: CompanyRackService,
    public cls: CompanyLocationService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private loader: AppLoaderService,
    public toastr: ToastrService,
    private jwtAuth: JwtAuthService,
    ){
       this.headers = this.jwtAuth.getHeaders();
       this.message = this.jwtAuth.getResources();
    }

  get f() { return this.dialogForm.controls; };
  ngOnInit() {
    
    this.loader.open();
    this.CompanyId = this.data.configdata.CompanyId;
    this.LocationId = this.data.configdata.LocationId;
    this.UserId = this.data.configdata.UserId;
    this.GroupId = this.data.configdata.GroupId;
    this.layerid = this.data.configdata.layerid;
    this.outwardType = this.data.configdata.outwardType;
    this.transfertype = this.data.configdata.TransferType;

    this.dialogForm = this.fb.group({
      sendDateCtrl: ['', [Validators.required]],
      transferTypeCtrl: ['', [Validators.required]],
      destinationCtrl: ['', [Validators.required]],
      commentCtrl: ['', [Validators.required,this.noWhitespaceValidator]],
      proposedTransferDateCtrl: ['', [Validators.required]],
      revertdateCtrl: [''],
      UploadTransferPhoto: [''],
      UploadFile: [''],
    })
    this.buildItemForm(this.data);
    this.GetTransferTypes();
    
    //====== Cost Center ======
    this.showCostCenters = this.data.configdata.showCostCenters;
    if (this.showCostCenters == true) {
      this.GetAllCostsCenterList(this.CompanyId, this.GroupId)
    }
    //====== Storage Location ======
    this.showStorageLocations = this.data.configdata.showStorageLocations;
    if (this.showStorageLocations == true) {
      this.GetMappedRackListWithRackName(this.CompanyId)
    }
    //====== Location ======
    this.showLocation = this.data.configdata.showLocation;
    this.sbutosbunotallowed = this.data.configdata.sbutosbunotallowed;
    if (this.showLocation == true && this.sbutosbunotallowed == true) {
      this.GetLocationsByCompanyIdToBindSelectList(this.LocationId, this.data.configdata.LocationIdData);
    }
    if (this.showLocation == true && this.sbutosbunotallowed == false) {
      this.GetLocationsByCompanyIdToBindSelectList(this.LocationId, this.data.configdata.LocationIdData);
    }

    // this.AssetNoFilter.valueChanges.subscribe((AssetNoFilterValue) => {
    //   this.filteredValues['AssetNo'] = AssetNoFilterValue;
    //   this.dataSourceNew.filter = this.filteredValues.AssetNo;
    // });
    this.paginationParams = {
      pageSize: 500,
      currentPageIndex: 0,
      endIndex: 0,
      startIndex: 0,
      totalCount: 0,
    }

  }
  buildItemForm(item) {
    

    var TransferType = this.data.configdata.TransferType.Id;
    var assetDetails = {
      CompanyId: this.data.configdata.CompanyId,
      LocationId: this.data.configdata.LocationId,
      TransferId: this.data.configdata.TransferId,
      AssetList: this.data.configdata.AssetList,
      UserId: this.data.configdata.UserId,
      TransferType: this.data.configdata.TransferType.Id
    }

    item.payload.forEach(element => {
      this.bindData.push(element);
    });
    ///this.bindData = JSON.parse(item.payload);
    this.onChangeDataSource(this.bindData);
    this.loader.close();

    // this.rs.GetMultipalAssetForReintiation(assetDetails).subscribe(r => {
      
    //   this.loader.close();
    //   this.bindData = JSON.parse(r);
    //   this.onChangeDataSource(this.bindData);
    // })


    var sendDate = new Date();
    this.dialogForm.get('sendDateCtrl').setValue(sendDate);
    this.dialogForm.get('transferTypeCtrl').setValue(TransferType);

  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}
  onChangeDataSource(value) {

    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    ///this.dataSource.sort = this.sort;
    this.selection.clear();
    this.masterToggle();
  }

  GetTransferTypes() {
    this.rs.GetTransferTypes().subscribe(r => {
      this.result = JSON.parse(r);
      this.transfertypeList = this.result;
    })
  }
  GetAllCostsCenterList(CompanyId, GroupId) {
    this.crs.GetAllCostsCenterList(CompanyId, GroupId).subscribe(r => {
      this.ListCost = JSON.parse(r);
    })
  }

  GetMappedRackListWithRackName(CompanyId) {
    this.crs.GetMappedRackListWithRackName(CompanyId).subscribe(r => {
      this.ListOfStorage = JSON.parse(r);
    })
  }
  outwardlocationlist: any[] = [];
  newoutwardlocationlist: any[] = [];
  GetLocationsByCompanyIdToBindSelectList(locationId, locationIdData) {

    this.cls.GetLocationsByCompanyIdToBindSelectList(this.CompanyId).subscribe(r => {
      for (var i = 0; i < r.length; i++) {
        if (r[i].LocationId != locationId) {
          this.outwardlocationlist.push(r[i]);
        }
      }

      if (this.sbutosbunotallowed) {
        var sbu = "";
        if (this.layerid == 1) {
          sbu = !locationIdData ? 0 : locationIdData.Country;
        }
        else if (this.layerid == 2) {
          sbu = !locationIdData ? 0 : locationIdData.State;
        }
        else if (this.layerid == 3) {
          sbu = !locationIdData ? 0 : locationIdData.City;
        }
        else if (this.layerid == 4) {
          sbu = !locationIdData ? 0 : locationIdData.Zone;
        }

        this.sbufilter = sbu;
        this.outwardlocationlist.forEach(c => {

          if (this.layerid == 1) {
            if (c.Country == sbu) {
              this.newoutwardlocationlist.push(c);
            }
          }
          else if (this.layerid == 2) {
            if (c.State == sbu) {
              this.newoutwardlocationlist.push(c);
            }
          }
          else if (this.layerid == 3) {
            if (c.City == sbu) {
              this.newoutwardlocationlist.push(c);
            }
          }
          else if (this.layerid == 4) {
            if (c.Zone == sbu) {
              this.newoutwardlocationlist.push(c);
            }
          }
        })
      }
debugger
      this.getDestinationType();

    })
  }
  fileList: any[] = [];
  displayFileName: any;
  fileChange(event) {
    
    this.fileList = event.target.files;
  }
  uploaderData: any;
  OldPhotolist: any = "";
  openUploadDialog(value) {
    
    const dialogRef = this.dialog.open(UploadDialogComponent, {
      width: '980px',
      disableClose: true,
      data: { title: value, payload: this.uploaderData, tid: this.data.configdata.TransferId }
    });
    dialogRef.afterClosed().subscribe(result => {
      
      if (!!result) {
        var name = [];
        this.fileList = [];
        this.OldPhotolist = result.oldDocName;
        result = result.uploader;
        this.uploaderData = result;
        for (let j = 0; j < result.length; j++) {
          let data = new FormData();
          let displayName = result[j].file.name;
          name.push(displayName);
          let fileItem = result[j]._file;
          fileItem['displayName'] = displayName;
          this.fileList.push(fileItem);
          //this.uploader.queue[j].
          //data.append('file', fileItem);
          //data.append('displayName', displayName);        
        }
        this.displayFileName = name.join(',');
        this.displayFileName = this.displayFileName + ',' + this.OldPhotolist;
      }
       
    })

  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  isAllSelectedNew() {
    const numSelected = this.selectionNew.selected.length;
    const numRows = this.dataSourceNew.data.length;
    return numSelected === numRows;
  }
  masterToggleNew() {
    this.isAllSelectedNew() ?
      this.selectionNew.clear() :
      this.dataSourceNew.data.forEach(row => this.selectionNew.select(row));
  }

  handlePage(pageEvent: PageEvent) {
    
    this.paginationParams.pageSize = pageEvent.pageSize;
    this.paginationParams.currentPageIndex = pageEvent.pageIndex;
    this.paginationParams.endIndex = (this.paginationParams.currentPageIndex + 1) * pageEvent.pageSize;
    this.paginationParams.startIndex = this.paginationParams.currentPageIndex * pageEvent.pageSize;
    this.GetNewAssetbindData("");
  }

  bindData1: any[] = [];
  btnName: any = 'Add New';
  GetNewAsset() {
    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;  
    this.selectionNew.clear();  
    // this.selectionNew.clear();    
    this.btnName = 'Add New';
    this.ShowNewDataSource = !this.ShowNewDataSource;
    if (this.ShowNewDataSource == true) {
      this.GetNewAssetbindData("");
    }
    else {
      this.bindData1 = [];
      this.onChangeDataSourceNew(this.bindData1);
    }
    
  }
  serachtext: any;
  colunname: any;
  IsSearch: boolean = false;
  GetNewAssetbindData(Action) {
        
    
    this.bindData1 = [];
      this.btnName = 'Hide';
      var locationId = this.data.configdata.LocationId;
      var LocationIdList = [];
      LocationIdList.push(locationId);

      if (Action == "SearchText" && !!this.variable && !!this.variable1) {
        this.serachtext = this.variable;
        this.colunname = this.variable1;
        this.IsSearch = true;
      }
      else {
        this.serachtext = "";
        this.colunname = "";
        this.IsSearch = false;
      }

      var assetDetails = {
        CompanyId: this.CompanyId,
        RegionId: 0,
        SbuList: [],
        LocationIdList: LocationIdList,
        CategoryIdList: [],
        AssetsClassList: [],
        typeOfAssetList: [],
        subTypeOfAssetList: [],
        // pageNo: 1,
        // pageSize: 50,
        pageNo: this.paginationParams.currentPageIndex + 1,
        pageSize: this.paginationParams.pageSize,
        IsSearch: this.IsSearch,
        UserId: this.UserId,
        BlockId: 0,
        AssetLife: '',
        Flag: 'Checkout Initiation',
        TransferType: this.data.configdata.TransferType.Id,
        IsExport: false,
        SearchText: this.serachtext,
        columnName: this.colunname,
        isfromReinitation: true
      }

      this.rs.GetAssetListToChangeLocation(assetDetails).subscribe(r => {
        
        this.loader.close();
        this.bindData1 = JSON.parse(r);
        var data = JSON.parse(r);
        var prefarIds = [];
        const numSelected = this.selection.selected.length;
        for (var i = 0; i < numSelected; i++) {
          prefarIds.push(this.selection.selected[i].PreFarId);
        }
        
        this.bindData1 = data.filter(row => prefarIds.indexOf(row.PreFarId) < 0 );   
        this.paginationParams.totalCount = !!data ? data[0].AssetListCount : 0;     
        console.log(this.paginationParams.totalCount);
        this.onChangeDataSourceNew(this.bindData1);
      })   

  }
  getDestinationType() {
    
    this.filtereddestinationMulti.next(this.outwardlocationlist.slice());
    this.destinationfilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPlantsMulti();
      });
  }
  protected filterPlantsMulti() {
    if (!this.outwardlocationlist) {
      return;
    }
    let search = this.destinationfilterCtrl.value;
    if (!search) {
      this.filtereddestinationMulti.next(this.outwardlocationlist.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filtereddestinationMulti.next(
      this.outwardlocationlist.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1)
    );
  }

  onChangeDataSourceNew(value) {
    this.dataSourceNew = new MatTableDataSource(value);
    this.dataSourceNew.paginator = this.paginator;
    this.dataSourceNew.sort = this.sort;
  }

  AddNewAssetData() {
    
    this.btnName = 'Add New';
    var prefarIds = [];
    const numSelected = this.selection.selected.length;
    for (var i = 0; i < numSelected; i++) {
      prefarIds.push(this.selection.selected[i].PreFarId);
    }
    //======
    const numSelectedNew = this.selectionNew.selected.length;
    for (var i = 0; i < numSelectedNew; i++) {
      var idx = prefarIds.indexOf(this.selectionNew.selected[i].PreFarId);
      if (idx < 0) {
        this.bindData.push(this.selectionNew.selected[i]);
      }
    }
    this.onChangeDataSource(this.bindData);
    this.selectionNew.clear(); 
    this.ShowNewDataSource = !this.ShowNewDataSource;
    this.isButtonVisible = false;
  }

  variable: any;
  variable1: any;
  action: any[] = []
  SerchAssetid(columnName) {
    
    var flag = 0;
    this.variable1 = columnName;
    if (!!this.variable) {
      flag = 1;
    }
    this.variable = !this.AssetNoFilter.value ? "" : this.AssetNoFilter.value;
    this.variable = this.variable.trim();
    if (flag == 1 || !!this.variable) {
      //this.paginator.pageIndex = 0;
      //this.paginationParams.pageSize = 50;
      //this.paginationParams.currentPageIndex = 0;
      // SearchText=this.AssetNoFilter.value
      //this.action=[this.variable, this.variable1];
      this.GetNewAssetbindData("SearchText");
    }

  }
  ClearSerch(columnName, isflag) {
    
    if (columnName == "AssetId") { this.isButtonVisible = !isflag; }
    this.GetNewAssetbindData("");
  }

  Serchicon(columnName, isflag) {
    
    this.variable = this.AssetNoFilter.setValue("");
    if (columnName == "AssetId") {
      this.isButtonVisible = !isflag;
    }
  }

  Submit() {
    
    var prefarIds = [];
    const numSelected = this.selection.selected.length;
    for (var i = 0; i < numSelected; i++) {
      prefarIds.push(this.selection.selected[i].PreFarId);
    }
    var newLocationId = this.dialogForm.get('destinationCtrl').value;
    //var dateC = new Date(this.dialogForm.get('sendDateCtrl').value)  ;
    var dateC = this.datepipe.transform(this.dialogForm.get('sendDateCtrl').value, 'dd-MMM-yyyy');
    var ProposedTransferDate = this.datepipe.transform(this.dialogForm.get('proposedTransferDateCtrl').value, 'dd-MMM-yyyy');


    if (this.transfertype.Type == 'Location') {
      var assetsDetails =
      {
        excelfile: null,
        companyId: this.CompanyId,
        locationId: this.LocationId,
        newLocationId: !newLocationId ? 0 : newLocationId.LocationId,
        transitType: !this.outwardType ? null : this.outwardType,
        assetList: prefarIds.join(','),
        modifiedBy: this.UserId,
        dateC: dateC,
        TransferComment: this.dialogForm.get('commentCtrl').value,
        RevertDate: this.datepipe.transform(this.dialogForm.get('sendDateCtrl').value, 'dd-MMM-yyyy'),
        ProposedTransferDate: ProposedTransferDate,
        transferredPhoto: null,
        transferredPhotoId: null,
        fileList: this.fileList,
        OldPhotoList: this.OldPhotolist
      }
      this.dialogRef.close(assetsDetails);
    }
    else {
      var CostCenter = "";
      var StorageLocation = "";
      if (this.transfertype.Type == 'Storage Location') {
        CostCenter = !newLocationId ? 0 : newLocationId.LocationId;
      }
      if (this.transfertype.Type == 'Cost Center') {
        StorageLocation = !newLocationId ? 0 : newLocationId.LocationId;
      }

      var assetsDetails1 =
      {
        GroupId: this.GroupId,
        CompanyId: this.CompanyId,
        LocationId: this.LocationId,
        NewLocationId: !newLocationId ? 0 : newLocationId.LocationId,
        TransitTypes: !this.outwardType ? null : this.outwardType,
        AssetList: prefarIds.join(','),
        LastModifiedBy: this.UserId,
        CheckOutDate: dateC,
        rComment: this.dialogForm.get('commentCtrl').value,
        RevertDateTime: null,
        TransferType: !!this.transfertype ? this.transfertype.Id : 0,
        CostCenter: CostCenter,
        StorageLocation: StorageLocation,
        ProposedTransferDate: ProposedTransferDate
      }
      this.dialogRef.close(assetsDetails1);
    }

  }

}
