import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AssetRetireService } from '../../../services/AssetRetireService';
import { CompanyRackService } from '../../../services/CompanyRackService';
import { CompanyLocationService } from '../../../services/CompanyLocationService';
import { DatePipe } from '@angular/common';
import { ITAssetsService } from '../../../services/ITAssetsService';
import { UserService } from '../../../services/UserService';
import { AssetService } from '../../../services/AssetService';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { R } from '@angular/cdk/keycodes';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-unallocated-asset-dialog',
  templateUrl: './unallocated-asset-dialog.component.html',
  styleUrls: ['./unallocated-asset-dialog.component.scss']
})
export class UnallocatedAssetDialogComponent implements OnInit {

  Headers: any = [];
  message: any ;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('table', { static: false }) table: any;

  displayedColumns: string[] = ['select','Icon', 'Inventory No.', 'Asset No.', 'Sub No.','AssetCondition','Asset Class', 'Asset Name', 'Asset Description', 'Serial No', 'IT Serial No','allocatedStatus','AllocationType', 'Plant', 'Cost', 'WDV', 'Inventory Indicator','CustodianDetails','UserDetails','AssetCriticality']
  displayedColumns1: string[] = ['select', 'Inventory No.', 'Asset No.', 'Sub No.', 'Asset Class', 'Asset Name', 'Asset Description', 'Serial No', 'IT Serial No', 'Plant', 'Cost', 'WDV', 'Inventory Indicator']
  dataSource: any;
  dataSourceNew: any;
  json: any;
  bindData: any[] = [];
  bindData1: any[] = [];
  dialogForm: FormGroup;
  selection = new SelectionModel<any>(true, []);
  selectionNew = new SelectionModel<any>(true, []);
  today = new Date();

  CompanyId: any;
  txtUserEmail: any;
  txtCustodianEmail: any;
  UserName: any;
  LocationId: any;
  UserId: any;
  GroupId: any;
  layerid: any;
  sbufilter: any;
  AssetLife: any;
  Name: any;

  UserTypeList: any[] = [
    { value: 'AD employee', viewValue: this.Headers.ADEmployee },
    { value: 'Other User', viewValue: this.Headers.OtherUser },
    { value: 'Other employee', viewValue: this.Headers.OtherEmployee },
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    public ars: AssetRetireService,
    private fb: FormBuilder,
    public crs: CompanyRackService,
    public cls: CompanyLocationService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    public toastr: ToastrService,
    public confirmService: AppConfirmService,
    private loader: AppLoaderService,
    private ITAssetsService: ITAssetsService,
    private us: UserService,
    private as: AssetService,
    private jwtAuth: JwtAuthService,
    ){
       this.Headers = this.jwtAuth.getHeaders();
       this.message = this.jwtAuth.getResources();
    }
  get f() { return this.dialogForm.controls; };

  ngOnInit(): void {

    this.CompanyId = this.data.configdata.CompanyId;
    this.LocationId = this.data.configdata.LocationId;
    this.UserId = this.data.configdata.UserId;
    this.GroupId = this.data.configdata.GroupId;
    this.Name = this.data.configdata.Name;
    this.UserName = this.data.configdata.UserName;
    this.txtUserEmail = this.data.configdata.txtUserEmail;
    this.txtCustodianEmail = this.data.configdata.txtCustodianEmail;

    this.dialogForm = this.fb.group({      
      UserCtrl: [''],
      CustodianCtrl: [''],
    })
    this.bindData = [];
    this.bindData = this.data.configdata.bindData;
    if(!!this.data.configdata.AssetList){
      this.buildItemForm(this.data); 
    }   
    else{
      this.onChangeDataSource(this.bindData);
    }

   // this.buildItemForm(this.data);
    // this.getAllocationTypeList();
    this.GetEmployeeBySearchKeyWordJson();
    this.userFilter();
    this.custodianFilter();

  }

  buildItemForm(item) {
    debugger;
    // var CompanyId = this.data.configdata.CompanyId;
     var AssetList = this.data.configdata.AssetList;

    var assetDetails = {
      CompanyId: this.data.configdata.CompanyId,
      UserName: this.UserName,
      PrefarIdlist: this.data.configdata.AssetList
    }
    if(!!AssetList){
      this.loader.open();
      this.as.GetAssetsForUserUnallocation(assetDetails).subscribe(r => {
        debugger;
        this.loader.close();
       // this.bindData1 = JSON.parse(r);
       if(!!r){
        var data = JSON.parse(r);
        data.forEach(element => {
          this.bindData.push(element);
        });
      }    
        this.onChangeDataSource(this.bindData);
        if (this.txtUserEmail != "" || this.txtCustodianEmail != "") {
          this.dialogForm.get('UserCtrl').setValue(this.txtUserEmail);
          this.dialogForm.get('CustodianCtrl').setValue(this.txtCustodianEmail);
          this.SearchUsersForAssetUnAllocation();
        }
      })
    }    
  }

  onChangeDataSource(value) {
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;    
  }
  SearchUsersForAssetUnAllocation() {
    debugger;
    this.selection.clear();
    var UserEmail = !this.txtUserEmail ? "" : this.txtUserEmail;
    var CustodianEmail = !this.txtCustodianEmail ? "" : this.txtCustodianEmail;
    
    var AssetType = "Capitalized Assets";
    var assetsDetails =
    {
      AssetType: AssetType,
      UserEmail: UserEmail,
      CustodianEmail: CustodianEmail,
      UserName: "",
      CustomerName: "",
      CompanyId: this.CompanyId,
      GroupId: this.GroupId,
    }
    this.loader.open();
    this.as.SearchUsersForAssetUnAllocation(assetsDetails).subscribe(r => {
      debugger;
      this.loader.close();
      this.bindData = [];  
      var prefarIds = [];    
      var data = JSON.parse(r);
      if(this.bindData1.length > 0){
        this.bindData1.forEach(x => {
          this.bindData.push(x)
          this.selection.select(x)
          prefarIds.push(x.PreFarId);
        }) 
      }
      if(data.length > 0){
        data.forEach(x => {
          if(prefarIds.indexOf(x.PreFarId) < 0){
            this.bindData.push(x)
          }          
        })
      }      
      console.log(this.bindData);
      this.onChangeDataSource(this.bindData);
    })
  }

  SearchUsersForAssetUnAllocationNew() {
    debugger;
    this.selection.clear();
    var UserEmail = "";
    var CustodianEmail = "";
    this.txtUserEmail = !this.dialogForm.get('UserCtrl').value ? "" : this.dialogForm.get('UserCtrl').value ;
    this.txtCustodianEmail = !this.dialogForm.get('CustodianCtrl').value ? "" : this.dialogForm.get('CustodianCtrl').value ;
    if (this.txtUserEmail.indexOf("|") >= 0) {
      UserEmail = this.txtUserEmail.split("|")[2];
      UserEmail = UserEmail.replace(/ +/g, "");
    }
    else {
      UserEmail = this.txtUserEmail;
    }

    if (this.txtCustodianEmail.indexOf("|") >= 0) {
      CustodianEmail = this.txtCustodianEmail.split("|")[2];
      CustodianEmail = CustodianEmail.replace(/ +/g, "");
    }
    else {
      CustodianEmail = this.txtCustodianEmail;
    }
    var AssetType = "Capitalized Assets";
    var assetsDetails =
    {
      AssetType: AssetType,
      UserEmail: UserEmail,
      CustodianEmail: CustodianEmail,
      UserName: "",
      CustomerName: "",
      CompanyId: this.CompanyId,
      GroupId: this.GroupId,
    }
    this.loader.open();
    this.as.SearchUsersForAssetUnAllocation(assetsDetails).subscribe(r => {
      debugger;
      this.loader.close();
      this.bindData = [];    
      var prefarIds = [];  
      var data = JSON.parse(r);
      if(this.bindData1.length > 0){
        this.bindData1.forEach(x => {
          this.bindData.push(x)
          prefarIds.push(x.PreFarId);
          this.selection.select(x)
        }) 
      }
      if(data.length > 0){
        data.forEach(x => {
          var idx = prefarIds.indexOf(x.PreFarId)
          if(idx > -1){}
          else{this.bindData.push(x)}          
        })
      }      
      this.onChangeDataSource(this.bindData);
    })
  }

  Submit() {
    debugger;
    if (this.selection.selected.length > 0) {
      var prefarIds = [];
      const numSelected = this.selection.selected.length;
      for (var i = 0; i < numSelected; i++) {
        prefarIds.push(this.selection.selected[i].PreFarId);
      }
      var assetsDetails = {
        AllocationDate: this.datepipe.transform(new Date(), 'dd-MMM-yyyy'),
        UserEmail: this.UserName,
        AllocateBy: this.Name,
        CompanyId: this.CompanyId,
        LocationId: this.LocationId,
        LastModifiedBy: this.UserId,
        PrefarIdlist: prefarIds
      }
      this.dialogRef.close(assetsDetails);
    }
    else{
      this.toastr.warning(this.message.SelectAtleastOneAsset, this.message.AssetrakSays);
    }
  }

  EmailList: any[] = [];
  GetEmployeeBySearchKeyWordJson() {
    debugger;
    this.us.GetEmployeeBySearchKeyWord(this.GroupId, "", true, this.CompanyId).subscribe(r => {
      debugger;
      this.EmailList = r;
    })
  }
  filteredOptions: Observable<string[]>;
  filteredOptionsForCust: Observable<string[]>;
  userFilter() {
    this.filteredOptions = this.dialogForm.controls['UserCtrl'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.EmailList.filter(option => option.toLowerCase().includes(filterValue));
  }

  custodianFilter() {
    this.filteredOptionsForCust = this.dialogForm.controls['CustodianCtrl'].valueChanges
      .pipe(
        startWith(''),
        map(v => this._filterCustodian(v))
      );
  }
  private _filterCustodian(v: string): string[] {
    const filterValue1 = v.toLowerCase();
    return this.EmailList.filter(x => x.toLowerCase().includes(filterValue1));
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


}



