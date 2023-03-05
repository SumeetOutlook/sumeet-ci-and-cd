import { Component,Inject, OnInit,ViewChild } from '@angular/core';
import * as header from '../../../../../assets/Headers.json';
import * as resource from '../../../../../assets/Resource.json';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog ,MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { ReconciliationService } from '../../../services/ReconciliationService';
import { CompanyRackService } from '../../../services/CompanyRackService';
import { CompanyLocationService } from '../../../services/CompanyLocationService';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatSelect } from '@angular/material/select';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { AssetRetireService } from '../../../services/AssetRetireService';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-retirement-disposal-withdraw-dialog',
  templateUrl: './retirement-disposal-withdraw-dialog.component.html',
  styleUrls: ['./retirement-disposal-withdraw-dialog.component.scss']
})
export class RetirementDisposalWithdrawDialogComponent implements OnInit {
  Headers: any = (header as any).default;
  message: any = (resource as any).default;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  protected _onDestroy = new Subject<void>();
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('table', { static: false }) table: any;

  displayedColumns: string[] = ['select','Icon', 'Inventory No.', 'Asset No.', 'Sub No.', 'Asset Class', 'Asset Name', 'Asset Description', 'Serial No', 'IT Serial No', 'Plant', 'Cost', 'WDV', 'Inventory Indicator']
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

  approvaltab : boolean= false;
  informationtab : boolean= false;
  withdrawntab : boolean= false;
  title : any;
  transfertype: any;
  RegionId: any;
  LocationIdList :any;
  public assetclassMultiCtrl: any;
  public retirementIdMultiCtrl: any;
  public retirementIdFilterCtrl: FormControl = new FormControl();
  public filteredretirementIdMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public assetstatusMultiCtrl: any;
  public categoryMultiCtrl: any;

  displayTable: boolean = false;
  displaybtn: boolean = false;
  public plantMultiCtrl: any;
  RetiredId: any;
  Assetstatus :any;
  ListOfLoc: any[] = [];
  ListOfCategory: any[] = [];

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<any>,
  public rs: ReconciliationService,
  private fb: FormBuilder,
  public crs: CompanyRackService,
  public cls: CompanyLocationService,
  private storage: ManagerService,
  public datepipe: DatePipe ,
  public ars: AssetRetireService,
  public toastr: ToastrService,
  private loader: AppLoaderService,
  public confirmService : AppConfirmService) { }

  get f() { return this.dialogForm.controls; };
  ngOnInit(): void {
        
   // this.loader.open();
   
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    this.RetiredId = this.data.configdata.RetiredId;
    this.bindData = this.data.configdata.bindData;

    this.dialogForm = this.fb.group({      
      commentCtrl: ['', [Validators.required,this.noWhitespaceValidator]],
    })
    this.onChangeDataSource(this.bindData);
    //this.buildItemForm(this.data);
  }

  buildItemForm(item) {
    debugger;
    var LocationIdList = [];
    var SbuList = [];
    var TAIdList = [];
    var subTypeOfAssetList = [];
    var CategoryIdList = [];
    var locationId = this.data.configdata.locationId;
    var CategoryIdlist = this.data.configdata.CategoryIdList;
    this.Assetstatus= this.data.configdata.AssetStatus;
  
    var assetDetails = {
      // CompanyId: this.CompanyId,
      // GroupId: this.GroupId,
      // RegionId: this.RegionId,
      // LocationIdList: LocationIdlist,
      // UserId: this.UserId,
      // //IsSearch: false,
      // RetiredId: this.RetiredId,
      // BlockId: !!this.assetclassMultiCtrl ? this.assetclassMultiCtrl[0].Id : 0,
      // AssetStatus: this.Assetstatus,
      // typeOfAssetList: TAIdList,
      // subTypeOfAssetList: subTypeOfAssetList,
      // SbuList: SbuList,
      // CategoryIdList: CategoryIdlist,
      // AssetList: this.data.configdata.AssetList,
      // status : this.data.configdata.Assetstatus,
      // TransferType: 0,
      // pageNo: 1,
      // pageSize: 50,
      // SearchText: "",
      // IsSearch: false,
      //AssetsClassList: [],
     // SearchText: this.serachtext,
     // columnName: this.colunname,
     // issorting: this.issort,

     CompanyId: this.CompanyId,
      LocationId: locationId,
      UserId: this.UserId,
      BlockId: this.data.configdata.BlockId,
      pageNo: 1,
      pageSize: 50,
      SearchText: "",
      IsSearch: false,
      AssetList: this.data.configdata.AssetList,
      TransferType: 0,

      PageId : 49
    }
    // var assetDetails = {
    //  CompanyId  : this.data.configdata.CompanyId,
    //  AssetList : this.data.configdata.AssetList,
    //  AssetStatus : this.data.configdata.AssetStatus,
    //  RetiredId : this.data.configdata.RetiredId,
    //  RegionId : this.RegionId,
    // }
    
    this.ars.GetAssetForPhysicalDisposalWithdrawRetire(assetDetails).subscribe(r => {
      
      this.loader.close();
      this.bindData = JSON.parse(r);
      this.onChangeDataSource(this.bindData);
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
public noWhitespaceValidator(control: FormControl) {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
  }
    Submit(value){
      if (this.selection.selected.length > 0) {
        this.confirmService.confirm({ message: this.message.RejectWithdrawRetirement , title: this.message.AssetrakSays })
        .subscribe(res => {
          if (!!res) {
            var prefarIds = [];
            const numSelected = this.selection.selected.length;
            for (var i = 0; i < numSelected; i++) {
              prefarIds.push(this.selection.selected[i].PreFarId);
            }
            var assetsDetails =
            {
              AssetList: prefarIds.join(','),
              Option: value,
              rComment: this.dialogForm.get('commentCtrl').value,
              CompanyId: this.CompanyId,
            //  TransferType: this.transfertype,
              GroupId: this.GroupId,
              LocationId: this.LocationId,
              UserId: this.UserId,
              status : this.data.configdata.AssetStatus
            }
            this.dialogRef.close(assetsDetails);
          }        
        })  
      }
      else {
        this.toastr.warning(this.message.SelectAssetstoApproveTransfer, this.message.AssetrakSays);
      }
    }
   
  

}
