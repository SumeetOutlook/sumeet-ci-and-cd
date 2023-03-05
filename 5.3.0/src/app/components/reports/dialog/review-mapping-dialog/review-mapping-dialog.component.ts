import { ITAMService } from 'app/components/services/ITAMService';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
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

@Component({
  selector: 'app-review-mapping-dialog',
  templateUrl: './review-mapping-dialog.component.html',
  styleUrls: ['./review-mapping-dialog.component.scss']
})
export class ReviewMappingDialogComponent implements OnInit {

  Headers: any = [];
  message: any ;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('table', { static: false }) table: any;

  dialogForm: FormGroup;
  mappedCtrl : any;
  mappedByList :any[]=[];
  dataSource: any;
  selection = new SelectionModel<any>(true, []);

  CompanyId: any;
  UserId: any;
  GroupId: any;

  AssetColumns = ["ITSerialNo","HostName", "MotherBoardSerialNo","User","InventoryNo", "AssetId", "SubAssetId", "ADL2", "ADL3", "LocationName", "CategoryName", "TypeOfAsset", "SubTypeOfAsset"];
  HardwareColumns = ["ITSerialNo","HostName", "MotherBoardSerialNo", "User","scandate","IPAddress", "Gateway", "Domain", "OSType", "Manufacturer", "Model", "Processor", "NoOfCores", "HardDisk", "PhysicalMemory",  "DeviceCategory", "UsedCapacityofHDD"]

  displayedColumns: string[] = ["Col1","Col2","Col7","Col3","Col4","Col6"]
  //displayedColumns: string[] = ['Select', "ITSerialNo","HostName","MotherBoardSerialNo","Manufacturer","InventoryNo","AssetId" , "SubAssetId" ,"ADL2","ADL3","LocationName","CategoryName","TypeOfAsset","SubTypeOfAsset","ITSerialNo","HostNameFAR","MotherBoardSerialNoFAR","UserName","AllocationStatus"]

  //displayedColumns1: string[] = ['Select', "InventoryNo","AssetId" , "SubAssetId" ,"ADL2","ADL3","LocationName","CategoryName","TypeOfAsset","SubTypeOfAsset","ITSerialNo","HostNameFAR","MotherBoardSerialNoFAR","UserName","AllocationStatus","ITSerialNo","HostName","MotherBoardSerialNo","Manufacturer"]

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<any>,
  public itamService : ITAMService ,
  private fb: FormBuilder,
  private loader: AppLoaderService,
  public toastr: ToastrService,
  public as: AssetService,
  public confirmService: AppConfirmService,
  private jwtAuth: JwtAuthService) { 
    this.Headers = this.jwtAuth.getHeaders();
    this.message = this.jwtAuth.getResources();

    this.mappedByList  = [
      { name: "By IT Serial No", value: "1" },
      { name: "By Host Name", value: "3" },
      { name: "By Motherboard No", value: "2" },
    ];
  }

  

  get f() { return this.dialogForm.controls; };
  ngOnInit(): void {
    this.CompanyId = this.data.configdata.CompanyId;
    this.UserId = this.data.configdata.UserId;
    this.GroupId = this.data.configdata.GroupId;

    this.dialogForm = this.fb.group({
      mappedCtrl : ['', [Validators.required]],
      mappedCtrlFilterCtrl : ['']
    })
    this.GetBindData();
    
  }


  GetBindData(){
      this.bindData = [];
      for(var i=0; i < this.HardwareColumns.length ; i++){
        var bind ={
          Col1 : !!this.AssetColumns[i] ?  this.Headers[this.AssetColumns[i]] : "",
          Col2 : '',
          Col3 : this.Headers[this.HardwareColumns[i]],
          Col4 : '',
          Col5 : this.Headers[this.HardwareColumns[i]],
          Col6 : '',
        }
        this.bindData.push(bind);
      }

      this.onChangeDataSource(this.bindData);
  }

  onChangeDataSource(value) {
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  bindData: any[] = [];
  Showsuggestion(){
    debugger;
    if (!this.dialogForm.value.mappedCtrl) {
      this.toastr.warning(this.message.DataforSearch, this.message.AssetrakSays);
    }
    else {

      var assetDetails = {
       
        option: !!this.dialogForm.value.mappedCtrl ? this.dialogForm.value.mappedCtrl : 0,
        CompanyID: 1,//this.CompanyId,
        UserID: 1, //this.userId
      }
      this.loader.open();
      this.itamService.getautomatchassetshow(assetDetails).subscribe(response => {
        debugger;
        this.loader.close();
        this.bindData = [];
        if (!!response) {
          this.bindData = response; 
        }
        console.log(this.bindData);
        this.onChangeDataSource(this.bindData);
      });
    }
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
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
    else {
      this.getselectedIds = [];
    }
    this.numSelected = this.selection.selected.length;
    if (this.numSelected > 0) {
      this.selection.selected.forEach(row => {
        var idx = this.getselectedIds.indexOf(row.PreFARId);
        if (idx > -1) {
        }
        else {
          this.getselectedIds.push(row.PreFARId);
        }
      });
    }    
  }

  isSelected(row) {
    debugger;
    this.isAllSelected = false;
    this.selection.toggle(row)
    this.numSelected = this.selection.selected.length;
    var idx = this.getselectedIds.indexOf(row.PreFARId);
    if (idx > -1) {
      this.getselectedIds.splice(idx, 1);
    }
    else {
      this.getselectedIds.push(row.PreFARId);
    }
  }

  Submit() {
    debugger;
    // this.confirmService.confirm({ message: "Are you sure , you want to automated map ?", title: this.message.AssetrakSays })
    //   .subscribe(res => {
    //     if (!!res) {
    //       debugger;
    //       var MapList = [];
    //       this.numSelected = this.selection.selected.length;
    //        if(this.numSelected > 0){
    //         this.selection.selected.forEach(row => {
    //           var map = {
    //             selectedoption :!!this.dialogForm.value.mappedCtrl ? this.dialogForm.value.mappedCtrl : 0,                
    //             prefarID : row.PreFARId,
    //             networkInventoryID : row.networkinventoryID,
    //             companyId : 1 , //this.CompanyId
    //             userID : this.UserId
    //           }
    //           MapList.push(map);
    //         })
    //        }           
    //       this.itamService.getautomatchassets(MapList).subscribe(response => {
    //         debugger;
    //         this.toastr.success("Hardware map Successfully", this.message.AssetrakSays);
    //         this.dialogRef.close(true);
    //       });
    //     }
    //   })
  }

}
