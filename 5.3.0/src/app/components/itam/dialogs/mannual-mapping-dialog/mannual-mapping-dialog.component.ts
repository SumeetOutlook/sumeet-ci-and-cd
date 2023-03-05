import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ReconciliationService } from '../../../services/ReconciliationService';
import { CompanyRackService } from '../../../services/CompanyRackService';
import { AssetService } from '../../../services/AssetService';
import { CompanyLocationService } from '../../../services/CompanyLocationService';
import { DatePipe } from '@angular/common';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { ToastrService } from 'ngx-toastr';
import { ignoreElements } from 'rxjs/operators';
import { ITAMService } from 'app/components/services/ITAMService';

@Component({
  selector: 'app-mannual-mapping-dialog',
  templateUrl: './mannual-mapping-dialog.component.html',
  styleUrls: ['./mannual-mapping-dialog.component.scss']
})
export class MannualMappingDialogComponent implements OnInit {

  Headers: any = [];
  message: any ;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('table', { static: false }) table: any;
  displayedColumns: string[] = ['HostName', 'IPAddress', 'Gateway', 'Domain', 'OSType', 'ITSerialNo', 'Manufacturer', 'Model', 'Processor', 'NoOfCores', 'PhysicalMemory', 'User', 'DeviceCategory', 'scandate']
  displayedColumns1: string[] = ['select', "InventoryNo","AssetId" , "SubAssetId" ,"ADL2","ADL3","LocationName","CategoryName","TypeOfAsset","SubTypeOfAsset","ITSerialNo","UserEmailID"]
  dataSource: any;
  dataSource1: any;
  json: any;
  bindData: any[] = [];
  bindDataPreFarId: any[] = [];
  bindDataLength: any;
  dialogForm: FormGroup;
  selection = new SelectionModel<any>(true, []);

  CompanyId: any;
  LocationId: any;
  LocationIdList: any[] = [];
  UserId: any;
  GroupId: any;
  layerid: any;
  assetIdforgroup: any;
  mappedCtrl : any;
  mappedByList :any[]=[];

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
    public as: AssetService,
    public confirmService: AppConfirmService,
    private jwtAuth: JwtAuthService,
    public itamService: ITAMService,
    ){
       this.Headers = this.jwtAuth.getHeaders();
       this.message = this.jwtAuth.getResources();
       this.mappedByList  = [
        { name: "By Asset No", value: "By AssetNo" },
        { name: "By Asset Name", value: "By AssetName" },
        { name: "By Serial No", value: "By SerialNo" },
        { name: "By Host Name", value: "By HostName" },
        //{ name: "By Motherboard No", value: "By MotherboardNo" },
        { name: "By User", value: "By User" },
        { name: "By Type", value: "By Type" },
        { name: "By SubType", value: "By SubType" },
      ];
    }
  get f() { return this.dialogForm.controls; };

  ngOnInit() {
    debugger;
    this.bindData = [];
    debugger
    this.CompanyId = this.data.configdata.CompanyId;
    this.UserId = this.data.configdata.UserId;
    this.GroupId = this.data.configdata.GroupId;
    this.LocationIdList = this.data.configdata.LocationIdList;
    this.bindData = this.data.configdata.selected;

    this.onChangeDataSource(this.bindData);
    this.onChangeDataSourcenew([]);
  }

  onChangeDataSource(value) {
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  contentInfos1: any[] = [];
  GetAssetsToMap() {
    debugger;
    if (!this.assetIdforgroup) {
      this.toastr.warning(this.message.DataforSearch, this.message.AssetrakSays);
    }
    else {

      var assetDetails = {
        companyid: this.CompanyId,
        SearchBy: !!this.mappedCtrl ? this.mappedCtrl : "",
        searchtext: !this.assetIdforgroup ? "" : this.assetIdforgroup,
        pageSize: 50,
        pageNo: 1,
      }
      this.loader.open();
      this.itamService.getAssetsdetails(assetDetails).subscribe(response => {
        debugger;
        this.loader.close();
        this.contentInfos1 = [];
        if (!!response) {
          this.contentInfos1 = response;   
        }
        console.log(this.contentInfos1);
        this.onChangeDataSourcenew(this.contentInfos1);
      });
    }
  }
  AssetIdList: any[] = [];
  GetAssetIdList() {
    debugger;
    var search = '';
    var assetDetails = {
      CompanyId: this.CompanyId,
      BlockId: 0,
      LocationIdList: this.LocationIdList,
      prefarIdlist: [],
      SearchText: !this.assetIdforgroup ? "" : this.assetIdforgroup,
      columnName: 'AssetId',
      IsSearch: !this.assetIdforgroup ? false : true,
      //prefarId : this.bindData[0].PreFarId,
    }
    this.as.GetAssetIdsForAutoCompleteJson(assetDetails).subscribe(response => {
      debugger;
      if (!!response) {
        this.AssetIdList = JSON.parse(response);
      }
    });
  }

  onChangeDataSourcenew(value) {
    this.dataSource1 = new MatTableDataSource(value);
    this.dataSource1.paginator = this.paginator;
    this.dataSource1.sort = this.sort;
  }

  numSelected: any = 0;
  getselectedIds: any[] = [];
  isAllSelected: boolean = false;
  masterToggle() {
    debugger;
    this.isAllSelected = !this.isAllSelected;
    this.selection.clear();
    //this.getselectedIds = [];
    if (this.isAllSelected == true) {
      this.dataSource1.data.forEach(row => this.selection.select(row));
    }
    else {
      this.getselectedIds = [];
      this.dataSource1.data.forEach(row => {
        var idx1 = this.bindData.indexOf(row);
        if (idx1 > -1) {
          this.bindData.splice(idx1, 1);
        }
      });
    }
    this.numSelected = this.selection.selected.length;
    if (this.numSelected > 0) {
      this.selection.selected.forEach(row => {
        var idx = this.getselectedIds.indexOf(row.PreFarId);
        if (idx > -1) {
        }
        else {
          this.getselectedIds.push(row.PreFarId);
          this.bindData.push(row);
        }
      });
    }
    this.onChangeDataSource(this.bindData);
  }

  isSelected(row) {
    debugger;
    this.isAllSelected = false;
    this.selection.clear();
    this.getselectedIds = [];
    this.selection.toggle(row)
    this.numSelected = this.selection.selected.length;
    var idx = this.getselectedIds.indexOf(row.prefarid);
    if (idx > -1) {
      this.getselectedIds.splice(idx, 1);
    }
    else {
      this.getselectedIds.push(row.prefarid);
    }
  }

  Submit() {
    debugger;
    var GroupAssetdto = {
      PreFarId: this.getselectedIds.join(','),
      NetworkInventoryID: this.bindData[0].NetworkInventoryID,
      CompanyId: this.CompanyId,
      GroupID: this.GroupId,
      UserID: this.UserId
    }

    this.itamService.manuallymapassets(GroupAssetdto).subscribe(response => {
      debugger;
      this.toastr.success("Hardware information mapped successfully with the asset.", this.message.AssetrakSays);
      this.dialogRef.close(GroupAssetdto);
    });
  }

}
