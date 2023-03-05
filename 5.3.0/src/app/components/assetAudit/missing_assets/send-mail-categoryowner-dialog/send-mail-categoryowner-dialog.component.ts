import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialog ,MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { CompanyRackService } from '../../../services/CompanyRackService';
import { CompanyLocationService } from '../../../services/CompanyLocationService';
import { DatePipe } from '@angular/common';
import * as header from '../../../../../assets/Headers.json';
import * as resource from '../../../../../assets/Resource.json';
import { AuditService } from '../../../services/AuditService';
import { AssetService } from '../../../services/AssetService';
import { UserService } from '../../../services/UserService';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';

@Component({
  selector: 'app-send-mail-categoryowner-dialog',
  templateUrl: './send-mail-categoryowner-dialog.component.html',
  styleUrls: ['./send-mail-categoryowner-dialog.component.scss']
})
export class SendMailCategoryownerDialogComponent implements OnInit {

  Headers: any = (header as any).default;
  message: any = (resource as any).default;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('table', { static: false }) table: any;
  displayedColumns: string[] = ['select', 'Name','Count', 'Cost', 'WDV']
  dataSource: any;
  json: any;
  bindData: any[] = [];
  dialogForm: FormGroup;
  selection = new SelectionModel<any>(true, []);
  
  CompanyId: any;
  LocationId: any;
  UserId: any;
  GroupId: any;
  layerid: any;
  AssetLife: any;

  approvaltab : boolean= false;
  informationtab : boolean= false;
  withdrawntab : boolean= false;
  title : any;
  transfertype: any;
  TPID:any;
  projectName: any;
  assetStatus: any;
  assetStage: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,   
    private fb: FormBuilder,
    public crs: CompanyRackService,
    public cls: CompanyLocationService,
    public datepipe: DatePipe ,
    public as : AuditService,
    private loader: AppLoaderService,
    public toastr: ToastrService,
    public us : UserService,
    public assetservice : AssetService
    ) { }

  get f() { return this.dialogForm.controls; };
  ngOnInit() {
    debugger;
   //this.loader.open();
    this.CompanyId = this.data.configdata.CompanyId;
    this.GroupId = this.data.configdata.GroupId;
    this.LocationId = this.data.configdata.LocationId;
    this.UserId = this.data.configdata.UserId;
    this.TPID = this.data.configdata.TPID;    
    this.projectName = this.data.configdata.projectName;    
    this.assetStatus = this.data.configdata.assetStatus;    
    this.assetStage = this.data.configdata.assetStage;  

    
    
    this.dialogForm = this.fb.group({      
      msgCtrl: ['', [Validators.required]],
      CCmail1 : ['', [Validators.required]],
    })
    this.dialogForm.get('msgCtrl').disable();
    this.buildItemForm(this.data);
    this.SendMailContent();
  }
  blockwiseData :any[]=[];
  buildItemForm(item) {
    
    var assetDetails = {
      companyId : this.CompanyId,
      locationId :this.LocationId,
      assetStage:this.assetStage,
      assetStatus:this.assetStatus,
      TPID:this.TPID,
      projectName: this.projectName
    }

    this.as.GetDamagedNotInUseDetailsBlockWise(assetDetails).subscribe(r => {
      debugger;
      this.loader.close();
      this.blockwiseData = r;
      this.onChangeDataSource(this.blockwiseData);
    })
    debugger;
    
  }
  msg : any;
  SendMailContent(){
    var EventName = "Missing asset Send mail to Asset class owner";
    this.assetservice.SendMailContent(EventName).subscribe(r => {
      debugger;
      this.msg = r ;
      this.msg= this.msg.replace('$UserName$' , 'XXXXX');
      this.msg= this.msg.replace('$link$' , '');
      //document.getElementById('textarea1').innerHTML = this.msg;
      this.dialogForm.get('msgCtrl').setValue(this.msg);
    })
  }
  UserList : any[]=[];
  GetUserEmailEmpcode(){
    var radi = "";
    var IsUsernameChecked = ((radi === 'empmail') ? true : false);
    var assetDetails = {
      EmpId : "",
      GroupId :this.GroupId,
      companyId:this.CompanyId,
      IsUsernameChecked:IsUsernameChecked
    }
    this.us.GetuserEmailuserCode(assetDetails).subscribe(r => {
      debugger;
      this.loader.close();
      this.UserList = JSON.parse(r);
    })
  }
  onChangeDataSource(value) {

    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.masterToggle();
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
  
  Submit(){   
    if (this.selection.selected.length > 0) {
      var AssetCategoryIds = [];
      const numSelected = this.selection.selected.length;
      for (var i = 0; i < numSelected; i++) {
        AssetCategoryIds.push(this.selection.selected[i].AssetCategory);
      }
      var assetsDetails = {
        selectedIds : AssetCategoryIds.join(','),
        CCmail: "" ,//this.dialogForm.get('CCmail1').value,
        message: this.msg //this.dialogForm.get('msgCtrl').value,
      }
      this.dialogRef.close(assetsDetails);
    }
    else {
      this.dialogRef.close(false);
    }
  }

}
