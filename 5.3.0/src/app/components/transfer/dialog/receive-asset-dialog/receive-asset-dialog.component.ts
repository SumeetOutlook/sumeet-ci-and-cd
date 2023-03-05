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
import { CompanyLocationService } from '../../../services/CompanyLocationService';
import { UserService } from '../../../services/UserService';
import { DatePipe } from '@angular/common';

import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-receive-asset-dialog',
  templateUrl: './receive-asset-dialog.component.html',
  styleUrls: ['./receive-asset-dialog.component.scss']
})
export class ReceiveAssetDialogComponent implements OnInit {

  Headers: any = [];
  message: any ;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('table', { static: false }) table: any;
  displayedColumns: string[] = ['select', 'Inventory No.', 'Asset No.', 'Sub No.', 'Asset Class', 'Asset Name', 'Asset Description', 'Serial No', 'IT Serial No', 'Plant', 'Cost', 'WDV', 'Inventory Indicator', 'AssetCondition', 'AssetCriticality']
  dataSource: any;
  json: any;
  bindData: any[] = [];
  dialogForm: FormGroup;
  selection = new SelectionModel<any>(true, []);
  transfertypeList: any[] = [];
  result: any[] = [];
  ListCost: any[] = [];
  ListOfStorage: any[] = [];



  CompanyId: any;
  LocationId: any;
  UserId: any;
  GroupId: any;
  layerid: any;
  sbufilter: any;
  Typename: any;
  transfertype: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    public rs: ReconciliationService,
    private fb: FormBuilder,
    public crs: CompanyRackService,
    public cls: CompanyLocationService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private loader: AppLoaderService,
    public us: UserService,
    private jwtAuth: JwtAuthService,
    ){
       this.Headers = this.jwtAuth.getHeaders();
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
    this.transfertype = this.data.configdata.TransferType;

    this.dialogForm = this.fb.group({
      costCenterCtrl: [''],
      RoomCtrl: [''],
      rackCtrl: [''],
      userEmailCtrl: [''],
      custodianEmailCtrl: ['']

    })

    this.buildItemForm(this.data);
    this.GetTransferTypes();
    

  }
  IsRequiredRack: boolean = false;
  ListOfRack : any[]=[];
  buildItemForm(item) {
        
    this.crs.GetAllMappedRacksByLocId(this.LocationId).subscribe(r => {
      
      this.loader.close();
      this.ListOfRack = [];
      if (!!r) {
        this.IsRequiredRack = true;
        this.ListOfRack = JSON.parse(r);
      }
      else {
        this.IsRequiredRack = true;
      }
    })
    this.GetAllCostsCenterList();
    this.GetEmpEmailForAutoComplete();
    this.GetEmployeeBySearchKeyWordJson();
    this.loader.close();

  }
  onChangeDataSource(value) {

    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.masterToggle();
  }
  GetTransferTypes() {
    this.rs.GetTransferTypes().subscribe(r => {
      this.result = JSON.parse(r);
      this.transfertypeList = this.result;
    })
  }
  ListOfCostCenter: any[] = [];
  GetAllCostsCenterList() {
     
    this.crs.GetAllCostsCenterList(this.CompanyId, this.GroupId).subscribe(r => {
      
      this.ListOfCostCenter = [];
      if (!!r) {
        this.ListOfCostCenter = JSON.parse(r);
      }
    })
  }
  UserEmailList: any[] = [];
  GetEmpEmailForAutoComplete() {
    var userEmailId = "";
     
    this.us.GetEmpEmailForAutoComplete(userEmailId, this.CompanyId).subscribe(r => {
      
      this.UserEmailList = [];
      if (!!r) {
        this.UserEmailList = r;
      }
    })
  }
  EmailList: any[] = [];
  GetEmployeeBySearchKeyWordJson() {
     
    var IsUsernameChecked = true;
    this.us.GetEmployeeBySearchKeyWord(this.GroupId, "", IsUsernameChecked, this.CompanyId).subscribe(r => {
      
      this.EmailList = [];
      if (!!r) {
        this.EmailList = r;
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
  Username: any;
  UserMail : any;
  getUserData() {
    
    this.UserMail = !this.dialogForm.get("userEmailCtrl").value ? "" : this.dialogForm.get("userEmailCtrl").value.split("|")[2];
    this.Username = !this.dialogForm.get("userEmailCtrl").value ? "" : this.dialogForm.get("userEmailCtrl").value.split("|")[1];

  }
  CustodianemailId: any;
  custodianname: any;
  getCustodianData() {
    this.CustodianemailId = !this.dialogForm.get("custodianEmailCtrl").value ? "" : this.dialogForm.get("custodianEmailCtrl").value.split("|")[2];
    this.custodianname = !this.dialogForm.get("custodianEmailCtrl").value ? "" : this.dialogForm.get("custodianEmailCtrl").value.split("|")[1];
  }
  Submit() {
    
    if (this.dialogForm.valid) {

      var assetBuilding = !this.dialogForm.get("costCenterCtrl").value ? "" : this.dialogForm.get("costCenterCtrl").value.Description;
      var assetRoom = !this.dialogForm.get("RoomCtrl").value ? "" : this.dialogForm.get("RoomCtrl").value;
      var RackName = !this.dialogForm.get("rackCtrl").value ? "" : this.dialogForm.get("rackCtrl").value;

      var Usermail = !this.UserMail ? "" : this.UserMail;     
      var UserName = !this.Username ? "" : this.Username;      
      var Custodianemail = !this.CustodianemailId ? "" : this.CustodianemailId;
      var custodianname = !this.custodianname ? "" : this.custodianname;

      var assetsDetails = {        
        AssetList: this.data.configdata.AssetList,
        Building: assetBuilding,
        Room: assetRoom,
        RackName: RackName,
        UserEmail: Usermail,
        CustodianEmail: Custodianemail,
        Custodian: custodianname,
        UserName: UserName,
        UserId: this.UserId,
        TransferType: !!this.transfertype ? this.transfertype.Id : 1,
        LocationId: this.LocationId
      }
      this.dialogRef.close(assetsDetails);
    }

  }


}
