import { AfterViewInit, OnDestroy, Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { LocalStoreService } from 'app/shared/services/local-store.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { MapadditionalassetDialogComponent } from '../mapadditionalAsset_dialog/mapadditionalasset-dialog.component';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { Constants } from 'app/components/storage/constants';

import { ToastrService } from 'ngx-toastr';
import { AuditService } from '../../../services/AuditService';

@Component({
  selector: 'app-mapadditional-dialog',
  templateUrl: './mapadditional-dialog.component.html',
  styleUrls: ['./mapadditional-dialog.component.scss']
})
export class MapadditionalDialogComponent implements OnInit {

  Headers: any ;
  message: any ;
  private isButtonVisible = false;
  private isButtonVisibleADL2 = false;
  private isButtonVisibleADL3 = false;
  private isButtonVisibleSupplier = false;
  private isButtonVisibleGRNNo = false;
  private isButtonVisibleSerialNo = false;
  private isButtonVisibleITSerialNo = false;
  private isButtonVisiblePONumber = false;
  private isButtonVisibleEqipmentNumber = false;
  private isButtonVisibleCPPNumber = false;
  private isButtonVisibleBarCode = false;
  private isButtonVisibleLocation = false;
  private isButtonVisibletypeOfAsset = false;
  private isButtonVisiblesubTypeOfAsset = false;
  private isButtonVisibleCategoryName = false;
  setflag: boolean = false;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public matdialogbox: MatDialogRef<MapadditionalDialogComponent>,
    public localService: LocalStoreService,
    private fb: FormBuilder,
    private loader: AppLoaderService,
    private storage: ManagerService,
    public dialog: MatDialog,
    public AuditService: AuditService , private jwtAuth: JwtAuthService) { 
      this.Headers = this.jwtAuth.getHeaders();
	    this.message = this.jwtAuth.getResources();
    }
  dialogGroupForm: FormGroup;
  get f1() { return this.dialogGroupForm.controls; };

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public selectedData: FormControl = new FormControl();
  AssetNoFilter = new FormControl();

  public appliedfilters: any[] = [];
  public newdataSource = [];
  public isallchk: boolean;
  selection = new SelectionModel<any>(true, []);

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['Select', 'Barcode', 'AssetId', 'SubAssetId', 'BlockOfAsset', 'ADL2', 'ADL3', 'SerialNo', 'ITSerialNo', 'Location', 'AcquisitionCost', 'WDV'];

  displayedColumns1: string[] = ['Inventory No.', 'Asset No.', 'Sub No.', 'Asset Class', 'Asset Name', 'Asset Description', 'Serial No', 'IT Serial No', 'Plant', 'Cost', 'WDV', 'Inventory Indicator', 'AssetCondition', 'AssetCriticality']

  public arrlength = 0;
  arrBirds: any[] = [];
  MapOptions: { option: any; data: any; };
  getselectedData: any[] = [];

  CompanyId: any;
  GroupId: any;
  UserId: any;
  RegionId: any;
  paginationParams: any;

  ngOnInit(): void {
    this.paginationParams = {
      pageSize: 50,
      currentPageIndex: 0,
      endIndex: 0,
      startIndex: 0,
      totalCount: 0,
    }

    this.dialogGroupForm = this.fb.group({

    });
    debugger;
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);

    this.displayedColumns = this.data.configdata.ListOfMapField;
    this.displayedColumns = ['Select'].concat(this.displayedColumns);
    console.log(this.displayedColumns);
    this.GetAdditionalListForMapping("");

    var BindData2 = this.data.configdata.selected;
    console.log(BindData2);

    this.onChangeDataSourceNew(BindData2);

  }
  dataSourceNew : any;
  onChangeDataSourceNew(value) {
    this.dataSourceNew = new MatTableDataSource(value);
    this.dataSourceNew.paginator = this.paginator;
    this.dataSourceNew.sort = this.sort;
  }


  handlePage(pageEvent: PageEvent) {
    this.paginationParams.pageSize = pageEvent.pageSize;
    this.paginationParams.currentPageIndex = pageEvent.pageIndex;
    this.paginationParams.endIndex = (this.paginationParams.currentPageIndex + 1) * pageEvent.pageSize;
    this.paginationParams.startIndex = this.paginationParams.currentPageIndex * pageEvent.pageSize;
    this.GetAdditionalListForMapping("")

  }
  serachtext: any;
  colunname: any;
  IsSearch: boolean = false;
  btnDisabled: boolean = true;
  GetAdditionalListForMapping(Action) {
    debugger;
    this.IsSearch = false;
    this.serachtext = "";
    this.colunname = "";
    if (Action == "SearchText" && this.variable != "" && !!this.variable && !!this.variable1) {
      this.serachtext = this.variable;
      this.colunname = this.variable1;
      this.IsSearch = true;
      this.btnDisabled = true;
    }
    var assetsDto = {
      CompanyId: this.CompanyId,
      LocationId: 0,//this.data.configdata.LocationId ,
      GroupId: this.GroupId,
      BlockId: 0,
      pageNo: this.paginationParams.currentPageIndex + 1,
      pageSize: this.paginationParams.pageSize,
      SearchText: this.serachtext,
      columnName: this.colunname,
      IsSearch: this.IsSearch,
    };
    this.loader.open();
    this.AuditService.GetPrePrintAdditionalListForMapping(assetsDto)
      .subscribe(r => {
        debugger;
        this.loader.close();
        var bindData = [];
        if (!!r && r != null){
          bindData = JSON.parse(r);
        }      
        this.paginationParams.totalCount = 0;
        if (!!bindData && bindData.length > 0) {
          this.paginationParams.totalCount = bindData[0].AssetListCount;
        }
        this.onChangeDataSource(bindData);
      });
  }

  onChangeDataSource(value) {
    this.dataSource = new MatTableDataSource(value);
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
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

  disablenextbtn: boolean = true;
  onchange() {
    debugger;
    this.disablenextbtn = false;
  }

  onclosetab() {
    this.matdialogbox.close(false);
  }

  Submit() {
    debugger;
    if (!!this.selectedData.value) {
      this.matdialogbox.close(this.selectedData.value.PrePurId);
    }
  }

  OpenAdditionalDialog() {
    if (this.getselectedData.length == 1) {
      var component: any;
      component = MapadditionalassetDialogComponent;
      this.loader.open();
      this.matdialogbox.close();
      const dialogRef = this.dialog.open(component, {
        panelClass: 'group-form-dialog',
        width: 'auto',
        maxHeight: '90vh',
        minHeight: '30vh',
        disableClose: true,
        data: {
          component1: 'MapadditionalassetDialogComponent',
          Mapvalue: this.getselectedData,
          name: this.data.value,
        },
      });
      this.loader.close();
    }
  }

  variable: any;
  variable1: any;
  action: any[] = []
  SerchAssetid(columnName) {
    debugger;
    var flag = 0;
    this.variable1 = columnName;
    if (!!this.variable) {
      flag = 1;
    }
    this.variable = !this.AssetNoFilter.value ? "" : this.AssetNoFilter.value;
    this.variable = this.variable.trim();
    if (flag == 1 || !!this.variable) {
      this.paginator.pageIndex = 0;
      this.paginationParams.pageSize = 50;
      this.paginationParams.currentPageIndex = 0;
      // SearchText=this.AssetNoFilter.value
      //this.action=[this.variable, this.variable1];
      //this.GetAssetListBySelectionBindData("SearchText");
      this.GetAdditionalListForMapping("SearchText")
    }
  }
  ClearSerch(columnName, isflag) {
    debugger;
    this.variable1 = "";
    this.variable = "";
    this.AssetNoFilter.setValue("");
    // this.variable1 = columnName;
    // this.variable = this.AssetNoFilter.value;
    this.SearchcolumnName = "";
    if (columnName == "AssetId") { this.isButtonVisible = !isflag; }
    else if (columnName == "Barcode") { this.isButtonVisibleBarCode = !isflag; }
    else if (columnName == "ADL2") { this.isButtonVisibleADL2 = !isflag; }
    else if (columnName == "ADL3") { this.isButtonVisibleADL3 = !isflag; }
    else if (columnName == "Suplier") { this.isButtonVisibleSupplier = !isflag; }
    else if (columnName == "GRNNo") { this.isButtonVisibleGRNNo = !isflag; }
    else if (columnName == "SerialNo") { this.isButtonVisibleSerialNo = !isflag; }
    else if (columnName == "ITSerialNo") { this.isButtonVisibleITSerialNo = !isflag; }
    else if (columnName == "PONumber") { this.isButtonVisibleITSerialNo = !isflag; }
    else if (columnName == "equipmentNo") { this.isButtonVisibleEqipmentNumber = !isflag; }
    else if (columnName == "CPPNumber") { this.isButtonVisibleCPPNumber = !isflag; }
    else if (columnName == "Location") { this.isButtonVisibleLocation = !isflag; }
    else if (columnName == "typeOfAsset") { this.isButtonVisibletypeOfAsset = !isflag; }
    else if (columnName == "subTypeOfAsset") { this.isButtonVisiblesubTypeOfAsset = !isflag; }
    else if (columnName == "CategoryName") { this.isButtonVisibleCategoryName = !isflag; }


    this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;
    this.GetAdditionalListForMapping("")
  }

  SearchcolumnName: any;
  Serchicon(columnName, isflag) {
    debugger;
    this.getclear();
    this.variable = this.AssetNoFilter.setValue("");
    this.SearchcolumnName = columnName;
    if (columnName == "AssetId") {
      this.isButtonVisible = !isflag;
    }
    else if (columnName == "Barcode") {
      this.isButtonVisibleBarCode = !isflag;
    }
    else if (columnName == "ADL2") {
      this.isButtonVisibleADL2 = !isflag;
    }
    else if (columnName == "ADL3") {
      this.isButtonVisibleADL3 = !isflag;
    }
    else if (columnName == "Suplier") {
      this.isButtonVisibleSupplier = !isflag;
    }
    else if (columnName == "GRNNo") {
      this.isButtonVisibleGRNNo = !isflag;
    }
    else if (columnName == "SerialNo") {
      this.isButtonVisibleSerialNo = !isflag;
    }
    else if (columnName == "ITSerialNo") {
      this.isButtonVisibleITSerialNo = !isflag;
    }
    else if (columnName == "PONumber") {
      this.isButtonVisiblePONumber = !isflag;
    }
    else if (columnName == "equipmentNo") {
      this.isButtonVisibleEqipmentNumber = !isflag;
    }
    else if (columnName == "CPPNumber") {
      this.isButtonVisibleCPPNumber = !isflag;
    }
    else if (columnName == "Location") {
      this.isButtonVisibleLocation = !isflag;
    }
    else if (columnName == "typeOfAsset") {
      this.isButtonVisibletypeOfAsset = !isflag;
    }
    else if (columnName == "subTypeOfAsset") {
      this.isButtonVisiblesubTypeOfAsset = !isflag;
    }
    else if (columnName == "CategoryName") {
      this.isButtonVisibleCategoryName = !isflag;
    }

  }
  getclear() {
    debugger;
    this.variable = "";
    this.variable1 = "";
    this.isButtonVisible = false;
    this.isButtonVisibleADL2 = false;
    this.isButtonVisibleADL3 = false;
    this.isButtonVisibleSupplier = false;
    this.isButtonVisibleGRNNo = false;
    this.isButtonVisibleSerialNo = false;
    this.isButtonVisibleITSerialNo = false;
    this.isButtonVisiblePONumber = false;
    this.isButtonVisibleEqipmentNumber = false;
    this.isButtonVisibleCPPNumber = false;
    this.isButtonVisibleBarCode = false;
    this.isButtonVisibleLocation = false;
    this.isButtonVisibletypeOfAsset = false;
    this.isButtonVisiblesubTypeOfAsset = false;
    this.isButtonVisibleCategoryName = false;
  }
}
