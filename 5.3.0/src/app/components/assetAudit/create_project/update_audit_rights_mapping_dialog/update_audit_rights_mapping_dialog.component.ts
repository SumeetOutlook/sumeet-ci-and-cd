import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelect } from '@angular/material/select';
import * as headers from '../../../../../assets/Headers.json';
import { AuditService } from '../../../services/AuditService';
import { UserService } from '../../../services/UserService';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

interface MobileUser {
  id: string;
  name: string;
}
interface AssetClassOwner {
  id: string;
  name: string;
}

const MOBILEUSER: MobileUser[] = [
  { name: 'rohit1234@gmail.com', id: 'A' },
  { name: 'surbhimuser@gmail.com', id: 'B' },
  { name: 'ak@gmai.com', id: 'C' },
  { name: 'mobileuser@assetcues.com', id: 'D' },
  { name: 'surbhiem@gmail.com', id: 'E' },
  { name: 'dummy@assetcues.com', id: 'F' },
];
const ASSETCLASSOWNER: AssetClassOwner[] = [
  { name: 'surbhi232425@gmail.com', id: 'A' },
  { name: 'shreyasdoshi48@gmail.com', id: 'B' },
  { name: 'doshishreyas048@gmail.com', id: 'C' },
  { name: 'kunal.shah1@gmail.com', id: 'D' },
  { name: 'rohitlaychetti009@gmail.com', id: 'E' },
  { name: 'sandeshsonikar2018@gmail.com', id: 'F' },

];


@Component({
  selector: 'app-update_audit_rights_mapping_dialog',
  templateUrl: './update_audit_rights_mapping_dialog.component.html',
  styleUrls: ['./update_audit_rights_mapping_dialog.component.scss'],
  //encapsulation:ViewEncapsulation.None
})


export class UpdateAuditRightsMappingDialogComponent implements OnInit {
  header: any ;
  public clicked = false;
  private isButtonVisible = false;
  public Edittempdatasource: any[] = [];
  public Editselecteddatasource: any[] = [];

  displayedHeaders: any [] = []
  SelfCertificationdisplayedHeaders: any[]

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UpdateAuditRightsMappingDialogComponent>,
    public dialog: MatDialog,
    public as: AuditService,
    public us: UserService,private jwtAuth : JwtAuthService) 
    {
      this.header = this.jwtAuth.getHeaders()
      this.displayedHeaders = [this.header.AssetCategory, this.header.MobileUser, this.header.CategoryOwner, this.header.Comment]
      this.SelfCertificationdisplayedHeaders =   [this.header.AssetCategory, this.header.CategoryOwner, this.header.Comment];
     }


  protected mobileuser: MobileUser[] = MOBILEUSER;
  public mobileuserMultiCtrl: FormControl = new FormControl();
  public mobileuserMultiFilterCtrl: FormControl = new FormControl();
  public filteredMobileUserMulti: ReplaySubject<MobileUser[]> = new ReplaySubject<MobileUser[]>(1);

  protected assetclassowner: AssetClassOwner[] = ASSETCLASSOWNER;
  public assetclassownerMultiCtrl: FormControl = new FormControl();
  public assetclassownerMultiFilterCtrl: FormControl = new FormControl();
  public filteredAssetClassOwnerMulti: ReplaySubject<AssetClassOwner[]> = new ReplaySubject<AssetClassOwner[]>(1);

  public AssetNo = new FormControl();

  displayedColumns: string[] = ['Select', 'AssetCategory'];

  
  SelfCertificationdisplayedColumns: string[] = ['AssetCategory', 'CategoryOwner', 'Comment'];

  AssetNoFilter = new FormControl();

  filteredValues = {
    AssetNo: '', SubNo: '', CapitalizationDate: '',
    AssetClass: '', AssetType: '',
    AssetSubType: '', UOM: '', AssetName: '',
    AssetDescription: '', Qty: '', Cost: '', WDV: '',
    EquipmentNO: '', AssetCondition: '', AssetCriticality: ''

  };

  public arrlength = 0;
  public newdataSource = [];
  public isallchk: boolean;
  public getselectedData: any[] = [];
  selection = new SelectionModel<any>(true, []);
  CompanyId: any;
  LocationId: any;
  UserId: any;
  GroupId: any;
  Records: any[] = [];
  selectedProject: any;
  isThirdParty: any;
  isZeroValue: any;
  isGRNAssets: any;
  selectedData: any;
  categoryList :any;

  numSelected: any = 0;
  getselectedIds: any[] = [];
  isAllSelected: boolean = false;

  PhysicalVerification_DATA = [
    { AssetCategory: 'LAPTOP(598)', MobileUser: 'rohit1234@gmail.com', CategoryOwner: 'surbhi232425@gmail.com', Comment: 'Inventory project in progress' },
    { AssetCategory: 'PLANT & MACHINARY(21)', MobileUser: 'rohit1234@gmail.com', CategoryOwner: 'surbhi232425@gmail.com', Comment: 'Inventory project in progress' },
    { AssetCategory: 'LAND & BUILDING(3)', MobileUser: 'rohit1234@gmail.com', CategoryOwner: 'surbhi232425@gmail.com', Comment: 'Inventory project in progress' },
    { AssetCategory: 'Computer(0)', MobileUser: 'rohit1234@gmail.com', CategoryOwner: 'surbhi232425@gmail.com', Comment: 'Inventory project in progress' },
    { AssetCategory: 'Furniture & Fixture(0)', MobileUser: 'mobileuser@assetcues.com', CategoryOwner: 'sandeshsonikar2018@gmail.com', Comment: 'Assets not available' },
    { AssetCategory: 'PLANT & EQUIPMENT(0)', MobileUser: 'mobileuser@assetcues.com', CategoryOwner: 'sandeshsonikar2018@gmail.com', Comment: 'Inventory project in progress' },
    { AssetCategory: '@#$%^&*()(0)', MobileUser: '', CategoryOwner: '', Comment: 'User not mapped' },
    { AssetCategory: 'AAABBBCCC(0)', MobileUser: '', CategoryOwner: '', Comment: 'User not mapped' },
  ];

  SelfCertification_DATA = [
    { AssetCategory: 'LAPTOP(598)', CategoryOwner: 'surbhi232425@gmail.com', Comment: '' },
    { AssetCategory: 'PLANT & MACHINARY(21)', CategoryOwner: 'surbhi232425@gmail.com', Comment: '' },
    { AssetCategory: 'LAND & BUILDING(0)', CategoryOwner: 'surbhi232425@gmail.com', Comment: 'Assets not available' },
    { AssetCategory: 'Computer(0)', CategoryOwner: 'surbhi232425@gmail.com', Comment: 'Assets not available' },
  ];
  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;
  protected _onDestroy = new Subject<void>();

  ngOnInit() {
    debugger;
    this.CompanyId = this.data.configdata.CompanyId;
    this.GroupId = this.data.configdata.GroupId;
    this.LocationId = this.data.configdata.LocationId;   
    this.selectedProject = this.data.configdata.selectedProject;
    this.isThirdParty = this.data.configdata.isThirdParty;
    this.isZeroValue = this.data.configdata.isZeroValue;
    this.isGRNAssets = this.data.configdata.isGRNAssets;
    this.selectedData = this.data.configdata.selectedData;
    this.categoryList = this.data.configdata.categoryList;

    

    this.onChangeDataSource(this.selectedData);

    if(!!this.categoryList){
      var arr = this.categoryList.split(',')
      for(var i=0 ;i< this.selectedData.length ;i++){
        var idx = arr.indexOf(this.selectedData[i].AssetCategoryId.toString());
        if(idx > -1){
          this.isSelected(this.selectedData[i]);
        }
      }
    }
    else{
      for(var i=0 ;i< this.selectedData.length ;i++){
        this.isSelected(this.selectedData[i]);
      }
    }

    //this.GetBlockOfAssetsByCompanyIdGroupIdJSON();
    //this.GetBlockOwnerListForCreateInventoryProject();
    //this.GetToBindDisplayListForMapping();

  }

  
  masterToggle() {
    debugger;
    this.isAllSelected = !this.isAllSelected;
    this.getselectedIds = [];
    if (this.isAllSelected == true) {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
    else {
      this.dataSource.data.forEach(row => this.selection.toggle(row));
    }
    this.numSelected = this.selection.selected.length;
    if (this.numSelected > 0) {
      this.selection.selected.forEach(row => this.getselectedIds.push(row.AssetCategoryId));
    }
  }

  isSelected(row) {
    debugger;
    this.selection.toggle(row)
    this.numSelected = this.selection.selected.length;
    var idx = this.getselectedIds.indexOf(row.AssetCategoryId);
    if (idx > -1) {
      this.getselectedIds.splice(idx, 1);
    }
    else {
      this.getselectedIds.push(row.AssetCategoryId);
    }
  }

  companyBlockDto: any[] = [];
  GetBlockOfAssetsByCompanyIdGroupIdJSON() {
    this.as.GetBlockWithMappingDetailsForDisplay(this.CompanyId, this.GroupId, this.LocationId, this.isThirdParty, this.isZeroValue, this.isGRNAssets).subscribe(r => {
      debugger;
      this.companyBlockDto = JSON.parse(r);
      this.onChangeDataSource(this.companyBlockDto);
      for (var k = 0; k < this.Records.length; k++) {
        if (this.Records[k].LocationId === this.LocationId) {
          if (this.Records[k].selectedBlockForLocation != 'all') {
            if (this.Records[k].selectedBlockForLocation != 'no') {
              var loc = this.Records[k].selectedBlockForLocation.split(',');
              for (var i = 0; i < loc.length; i++) {
                var idx = this.getselectedIds.indexOf(parseInt(loc[i]));
                if (idx > -1) {
                }
                else {
                  this.getselectedIds.push(parseInt(loc[i]));
                }
              }
            }
          }
          else {
            for (var i = 0; i < this.companyBlockDto.length; i++) {
              if (this.companyBlockDto[i].AssetCount > 0 && this.companyBlockDto[i].StatusForDisplay === "") {
                var idx = this.getselectedIds.indexOf(this.companyBlockDto[i].Id);
                if (idx > -1) {
                }
                else {
                  this.getselectedIds.push(this.companyBlockDto[i].Id);
                }
              }
            }
          }
        }
      }
    })
  }
  blockOwners: any[] = [];
  GetBlockOwnerListForCreateInventoryProject() {
    this.as.GetBlockOwnerListForCreateInventoryProject(this.CompanyId, this.GroupId, this.LocationId, this.isThirdParty, this.isZeroValue).subscribe(r => {
      debugger;
      this.blockOwners = JSON.parse(r);
    })
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected setInitialValue() {
    this.filteredMobileUserMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: MobileUser, b: MobileUser) => a && b && a.id === b.id;
      });

    this.filteredAssetClassOwnerMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.multiSelect.compareWith = (a: AssetClassOwner, b: AssetClassOwner) => a && b && a.id === b.id;
      });
  }

  protected filterMobileUserMulti() {
    if (!this.mobileuser) {
      return;
    }
    let search = this.mobileuserMultiFilterCtrl.value;
    if (!search) {
      this.filteredMobileUserMulti.next(this.mobileuser.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredMobileUserMulti.next(
      this.mobileuser.filter(mobileuser => mobileuser.name.toLowerCase().indexOf(search) > -1)
    );
  }


  protected filterAssetClassOwnerMulti() {
    if (!this.assetclassowner) {
      return;
    }
    let search = this.assetclassownerMultiFilterCtrl.value;
    if (!search) {
      this.filteredAssetClassOwnerMulti.next(this.assetclassowner.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredAssetClassOwnerMulti.next(
      this.assetclassowner.filter(assetclassowner => assetclassowner.name.toLowerCase().indexOf(search) > -1)
    );
  }


  onclosetab() {
    this.dialogRef.close();
  }
  lUserList: any[] = [];
  GetToBindDisplayListForMapping() {
    this.us.GetToBindDisplayListForMappingJSON(0, this.GroupId).subscribe(r => {
      debugger;
      this.lUserList = JSON.parse(r);
    })
  }

  onChangeDataSource(value) {
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.sort = this.sort;
  }


  onSubmit() {
    var totalQty = 0;
      var totalCost = 0;
      var totalWDV = 0;
      var categoryList = [];
      for (var i = 0; i < this.selectedData.length; i++) {
        var idx = this.getselectedIds.indexOf(this.selectedData[i].AssetCategoryId);
        if (idx > -1) {
          totalQty = totalQty + parseFloat(this.selectedData[i].Qty);
          totalCost = totalCost + parseFloat(this.selectedData[i].Cost);
          totalWDV = totalWDV + parseFloat(this.selectedData[i].WDV);
          categoryList.push(this.selectedData[i].AssetCategoryId);
        }
      }
      var result = {
        totalQty: totalQty,
        totalCost: totalCost,
        totalWDV: totalWDV,
        categoryList : categoryList.join(',')
      }
      this.dialogRef.close(result);
  }
}

