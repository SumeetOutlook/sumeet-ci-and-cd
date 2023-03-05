import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild,Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator,PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {Observable, ReplaySubject,forkJoin} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as headers from '../../../../assets/Headers.json';
import * as menuheaders from '../../../../assets/MenuHeaders.json'
import{ManagerService} from '../../storage/sessionMangaer';
import { AppConfirmService } from '../../../../app/shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../app/shared/services/app-loader/app-loader.service';
import {LocalStoreService} from '../../../../app/shared/services/local-store.service';
import {tablecolumComponent} from './tablecolum-popup/tablecolum-popup.component';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { Constants } from 'app/components/storage/constants';
import { CompanyService} from 'app/components/services/CompanyService';
import { ToastrService } from 'ngx-toastr';

import { GroupService} from 'app/components/services/GroupService';

import { CompanyLocationService } from '../../services/CompanyLocationService';
import { CompanyBlockService } from '../../services/CompanyBlockService';
import { UserService } from '../../services/UserService';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import { assetTabsComponent } from '../../partialView/assetDetails/asset_tabs.component';

export interface SelectGroup {
    groupselect: string;
    names: string[];
  }
  
export const _filter = (opt: string[], value: string): string[] => {
    const filterValue = value.toLowerCase();
  
    return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
  };
@Component({
  selector: 'app-outbound_pending_assets',
  templateUrl: './outbound_pending_assets.component.html',
  styleUrls: ['./outbound_pending_assets.component.scss']
})
export class Outbound_Pending_AssetsComponent implements OnInit {
  products: any =[];
  Headers: any = [];
  message: any ;
  menuheader :any =(menuheaders as any).default
  @ViewChild('TransferPaginator', { static: true }) Transferpaginator: MatPaginator;
  @ViewChild('Transfer_sort', { static: false }) Transfer_sort: MatSort;
  @ViewChild('Transfer_table', { static: false }) Transfer_table: any;

  @ViewChild('Retirementpaginator', { static: true }) Retirementpaginator: MatPaginator;
  @ViewChild('Retirement_sort', { static: false }) Retirement_sort: MatSort;
  @ViewChild('Retirement_table', { static: false }) Retirement_table: any;

  @ViewChild('Editpaginator', { static: true }) Editpaginator: MatPaginator;
  @ViewChild('Edit_sort', { static: false }) Edit_sort: MatSort;
  @ViewChild('Edit_table', { static: false }) Edit_table: any;

  @ViewChild('Taggingpaginator', { static: true }) Taggingpaginator: MatPaginator;
  @ViewChild('Tagging_sort', { static: false }) Tagging_sort: MatSort;
  @ViewChild('Tagging_table', { static: false }) Tagging_table: any;

  @ViewChild('Inventorypaginator', { static: true }) Inventorypaginator: MatPaginator;
  @ViewChild('Inventory_sort', { static: false }) Inventory_sort: MatSort;
  @ViewChild('Inventory_table', { static: false }) Inventory_table: any;

  @ViewChild('Componentizationpaginator', { static: true }) Componentizationpaginator: MatPaginator;
  @ViewChild('Componentization_sort', { static: false }) Componentization_sort: MatSort;
  @ViewChild('Componentization_table', { static: false }) Componentization_table: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  paginationParams: any;
  public Transfer_data: any[];
  public Transfer_data1 :any[] = [];
  public Retirement_data1: any[] = [];
  public Retirement_data: any[];
  public Edit_data: any[];
  public Edit_data1: any[] = [];
  public Tagging_data: any[];
  public Tagging_data1: any[] = [];
  public Inventory_data: any[];
  public Inventory_data1: any[] = [];
  public Componentization_data: any[];
  public Componentization_data1: any[] = [];
  SelectedSSbuList : any[] = [];
  HeaderLayerText: any;
  IslayerDisplay: any;
  layerid: any;
  Layertext: any;
  displayTable: boolean = false;
  // SelectAssetMaster=["Transfer","Retirement","Edit","Tagging","Inventory","Componentization"];
  SelectAssetMaster=["Tagging"];
  filterDropdown=["All","Transaction Pending","Transaction Failed"];
  FilterDropdownControl=new FormControl();
  public SelectedAssetmaster:any;
  value: any;
  updateData: any;
  updateDataInsert: any;
  deleteOptions: { option: any; id: any; };
  json: any;
  show: boolean = false;
  showADIButton: boolean = false;
  public hideth;
  Transfertempdatasource: any[] = [];
  Retirementtempdatasource: any[] = [];
  Edittempdatasource: any[] = [];
  Taggingtempdatasource: any[] = [];
  Inventorytempdatasource: any[] = [];
  Componentizationtempdatasource: any[] = [];
  public Transferselecteddatasource: any[] = [];
  public Retirementselecteddatasource: any[] = [];
  public Editselecteddatasource: any[] = [];
  public Taggingselecteddatasource: any[] = [];
  public Inventoryselecteddatasource: any[] = [];
  public Componentizationselecteddatasource: any[] = [];
  private isButtonVisible = false;
  TransferAssetNoFilter = new FormControl();
  RetirementAssetNoFilter = new FormControl();
  EditAssetNoFilter = new FormControl();
  TaggingAssetNoFilter = new FormControl();
  InventoryAssetNoFilter = new FormControl();
  ComponentizationAssetNoFilter = new FormControl();
  TransferfilteredValues = {
    AssetNo: '',
    };
  RetirementfilteredValues = {
    AssetNo: '',
  };
  EditfilteredValues = {
    AssetNo: '',
  };
  TaggingfilteredValues = {
    AssetNo: '',
  };
  InventoryfilteredValues = {
    AssetNo: '',
  };
  ComponentizationfilteredValues = {
    AssetNo: '',
  };
  displayedColumns: any[];
  public Transactiontype:string = null;
  public Filtertype : number = null;
  public PageId;
  public IsExport: boolean;
  IsshowGo: boolean = false;

  public Transfer_datasource;
  displayedHeadersTransfer = [this.products.InventoryNumber, this.products.AssetNo, this.products.SAID,
    this.products.AssetClass, this.products.ADL1, this.products.ADL2, this.products.ADL3,this.products.AcquisitionCost, this.products.WDV, 
    this.products.EquipmentNumber, this.products.AssetCondition,this.products.AssetCriticality, this.products.TransferId,this.products.TransferStatus,
    this.products.SourceLocation,this.products.TransferTo,this.products.PreviousInventoryInfo,
    this.products.InitiatedBy,this.products.InitiatedOn, this.products.FinancialLevelTransferBy, this.products.FinancialLevelTransferOn,
    this.products.BlockOwner,this.products.SourceBODate, this.products.DestinationBlockOwner, this.products.DestinationBODate, this.products.A1,this.products.Approval1On,
    this.products.A2, this.products.Approval2On, this.products.A3,this.products.Approval3On, this.products.WithdrawBy, this.products.WithdrawOn,
    this.products.ApprovedDeclinedby,this.products.ApprovedDeclinedOn, this.products.Comment, this.products.PhysicalAssetTransferBy, this.products.PhysicalAssetTransferon,this.products.InventoryStatus, this.products.RetirementStatus,
    this.products.AllocationStatus];
    displayedColumnsTransfer = ["InventoryNo","AssetNo","SubNo","AssetClass","AssetClassShortName","AssetName","AssetDescription",
    "Cost","WDV","EquipmentNumber","AssetCondition","AssetCriticality","TransferId","TransferStatus","TransferFrom","TransferTo","PreviousInventoryInfo","InitiatedBy","InitiatedOn","FinancialLevelTransferby",
    "FinancialLevelTransferon","AssetClassOwner","SourceBODate","DestinationAssetClassOwner","DestinationBODate","Approver1","Approval1on","Approver2","Approval2on",
    "Approver3","Approval3on","Withdrawby","Withdrawon","Approved/DeclinedBy","Approved/DeclinedOn","Comment","PhysicalAssetTransferby","PhysicalAssetTransferon",
    "InventoryStatus","RetirementStatus","AllocationStatus"];

  public Retirement_datasource;
  displayedHeadersRetirement = [this.products.InventoryNumber, this.products.AssetNo, this.products.SAID,this.products.AssetClass, 
    this.products.ADL1, this.products.ADL2, this.products.ADL3, this.products.AcquisitionCost, this.products.WDV, this.products.EquipmentNumber,
    this.products.AssetCondition,this.products.AssetCriticality,this.products.RetirementId,this.products.RetireType,this.products.RetireDate,
    this.products.ProposedRetireDate,this.products.RetirementStatus,this.products.RetirementAmount,this.products.CustomerName,this.products.InitiatorName,
    this.products.InitiatedDate,this.products.FinancialLevelApproverName,this.products.FinancialLevelApproveron,this.products.AssetClassOwner,this.products.BlockOwnerDate,
    this.products.A1,this.products.Approval1On,this.products.A2,this.products.Approval2On,this.products.A3,this.products.Approval3On,this.products.WithdroverName,
    this.products.WithdroverOn,this.products.ApprovedDeclinedby,this.products.ApprovedDeclinedOn,this.products.Comment,this.products.RetireDocument,this.products.ReadytoDisposeby,this.products.ReadytoDisposeon];
    displayedColumnsRetirement = ["InventoryNo","AssetNo","SubNo","AssetClass","AssetClassShortName","AssetName","AssetDescription","Cost","WDV","EquipmentNumber","AssetCondition",
    "AssetCriticality","RetirementId","RetirementType","RetirementDate","ProposedRetirementDate","RetirementStatus","RetirementAmount","CustomerName","InitiatorName","InitiationDate","FinancialLevelApproverName",
    "FinancialLevelApprovalon","AssetClassOwner","AssetClassOwnerDate","Approver1","Approval1on","Approver2","Approval2on","Approver3","Approval3on","WithdrawerName","Withdraweron","Approved/DeclinedBy",
    "Approved/DeclinedOn","Comment","RetireDocument","ReadytoDisposeby","ReadytoDisposeon"];
   
  public Edit_datasource;
  displayedHeadersEdit = [this.products.InventoryNumber, this.products.AssetNo, this.products.SAID,this.products.AssetType,this.products.SubTypeOfAsset,this.products.AcquisitionDate,this.products.AssetClass, 
    this.products.ADL2, this.products.ADL3,this.products.Location,this.products.AcquisitionCost,this.products.WDV,this.products.Stage,this.products.EquipmentNumber,this.products.AssetCondition,this.products.AssetCriticality];
  displayedColumnsEdit = ["InventoryNo","AssetNo","SubNo","AssetType","AssetSub-Type","CapitalizationDate","AssetClass","AssetName","AssetDescription","Plant","Cost","WDV","AssetrakStage",
  "EquipmentNumber","AssetCondition","AssetCriticality"];

  Tagging_datasource: any;
  displayedHeadersTagging = [this.products.InventoryNumber, this.products.AssetNo, this.products.SAID,this.products.ADL2, this.products.ADL3,
    this.products.BU,this.products.Location,this.products.AssetType,this.products.SubTypeOfAsset,this.products.AcquisitionDate,
    this.products.Quantity,this.products.AcquisitionCost,this.products.WDV,this.products.AssetClass,this.products.SerialNo,
    this.products.LabelSize,this.products.LabelMaterial,this.products.Room,this.products.EquipmentNumber,this.products.AssetCondition,this.products.AssetCriticality,
    this.products.InventoryNote,this.products.ThirdPartyName,this.products.CostCenter,this.products.User,this.products.InvoiceNo,this.products.PONumber,
    this.products.ITSerialNo,this.products.GRNNo];
  displayedColumnsTagging = ["InventoryNo","AssetNo","SubNo","AssetName","AssetDescription","zone","Plant","AssetType","AssetSub-Type","CapitalizationDate",
  "Qty","Cost","WDV","AssetClass","SerialNo","LabelSize","LabelMaterial","Room","EquipmentNumber","AssetCondition","AssetCriticality","InventoryNote",
  "VendorName","CostCenter","User","InvoiceNo","PONo","ITSerialNo","GRNNo",];

  public Inventory_datasource;
  displayedHeadersInventory = [this.products.InventoryNumber,this.products.AssetNo, this.products.SAID,
    this.products.AssetClass,this.products.ADL2, this.products.ADL3,this.products.AcquisitionCost,this.products.WDV,this.products.InventoryOn,
    this.products.InventoryBy,this.products.InventoryComment,this.products.InventoryMode,this.products.InventoryNote,this.products.LabelQuality,
    this.products.NotFoundNote,this.products.VerifiedAt];
    displayedColumnsInventory = ["InventoryNo","AssetNo","SubNo","AssetClass","AssetName","AssetDescription","Cost","WDV","InventoryOn","InventoryBy","InventoryComment",
    "InventoryMode","InventoryNote","LabelQuality","NotFoundNote","Verifiedat"];

  public Componentization_datasource;
  displayedHeadersComponentization = [this.products.InventoryNumber, this.products.AssetNo, this.products.SAID,this.products.TypeOfAsset,this.products.SubTypeOfAsset,
    this.products.AcquisitionDate,this.products.AcquisitionCost,this.products.WDV,this.products.Location,this.products.AssetClass,this.products.ADL2,this.products.ADL3,
    this.products.AssetCondition,this.products.AssetCriticality];
  displayedColumnsComponentization = ["InventoryNo","AssetNo","SubNo","AssetType","AssetSub-Type","CapitalizationDate","Cost","WDV","Plant","AssetClass","AssetName",
  "AssetDescription","AssetCondition","AssetCriticality"];


  SessionGroupId: any;
  SessionRegionId: any;
  SessionCompanyId: any;
  SessionUserId: any;

public SBUMultiFilterCtrl: FormControl = new FormControl();
  public SBUMultiCtrl: FormControl = new FormControl();
  public filteredSBUMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filtered: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredSBU: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  
  constructor(
   // private cs: CommonService,
    public dialog: MatDialog,
    private storage: ManagerService,
    private confirmService: AppConfirmService,
    private loader: AppLoaderService,public localService: LocalStoreService,
    private httpService: HttpClient,
    private jwtAuth: JwtAuthService,
    public CompanyService :CompanyService,
    public gs :GroupService,
    public toastr: ToastrService,
    public cls: CompanyLocationService,
    public cbs: CompanyBlockService,
    public us: UserService,
    public alertService: MessageAlertService,
    private router: Router
    ){
       this.products = this.jwtAuth.getHeaders();
       this.Headers = this.jwtAuth.getHeaders();
       this.message = this.jwtAuth.getResources();
    }

  

  ngOnInit() {

    this.SessionGroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.SessionRegionId =this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.SessionCompanyId =this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);    
    this.SessionUserId= this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);

    this.paginationParams = {
      pageSize: 50,
      currentPageIndex: 0,
      endIndex: 0,
      startIndex: 0,
      totalCount: 0,
    }


    this.layerid = this.storage.get(Constants.SESSSION_STORAGE, Constants.LAYER_ID);
    this.IslayerDisplay = this.layerid;
    if (this.layerid == 1) {
      this.Layertext = "Country";
    }
    else if (this.layerid == 2) {
      this.Layertext = "State";
    }
    else if (this.layerid == 3) {
      this.Layertext = "City";
    }
    else if (this.layerid == 4) {
      this.Layertext = "Zone";
    }
    this.HeaderLayerText = this.Layertext;
    this.GetInitiatedData();

        this.httpService.get('./assets/outbound_Json/Retirement.json').subscribe(
          data => {
            this.Retirement_data = data as any[];	 // FILL THE ARRAY WITH DATA.
             console.log(this.Retirement_data);
             for (let i = 0; i < this.Retirement_data.length; i++) {
              this.Retirementtempdatasource.push(this.Retirement_data[i].AssetNo);
            }
            //this.onChangeDataSource(this.Retirement_data);
          })

          this.httpService.get('./assets/outbound_Json/Edit.json').subscribe(
            data => {
            this.Edit_data = data as any[];	 // FILL THE ARRAY WITH DATA.
              console.log(this.Edit_data);
              for (let i = 0; i < this.Edit_data.length; i++) {
                this.Edittempdatasource.push(this.Edit_data[i].AssetNo);
              }
           // this.onChangeDataSource(this.Tagging_data);
            })
    
        
        this.httpService.get('./assets/outbound_Json/Tagging.json').subscribe(
        data => {
        this.Tagging_data = data as any[];	 // FILL THE ARRAY WITH DATA.
           console.log(this.Tagging_data);
           for (let i = 0; i < this.Tagging_data.length; i++) {
            this.Taggingtempdatasource.push(this.Tagging_data[i].AssetNo);
          }
       // this.onChangeDataSource(this.Tagging_data);
        })

        this.httpService.get('./assets/outbound_Json/InventoryReport.json').subscribe(
          data => {
            this.Inventory_data = data as any[];	 // FILL THE ARRAY WITH DATA.
            //  console.log(this.arrBirds[1]);
            for (let i = 0; i < this.Inventory_data.length; i++) {
              this.Inventorytempdatasource.push(this.Inventory_data[i].AssetNo);
            }
            //this.onChangeDataSource(this.Inventory_data);
          })

            this.httpService.get('./assets/outbound_Json/Componentization.json').subscribe(
              data => {
                this.Componentization_data = data as any[];	 // FILL THE ARRAY WITH DATA.
                //  console.log(this.arrBirds[1]);
                for (let i = 0; i < this.Componentization_data.length; i++) {
                  this.Componentizationtempdatasource.push(this.Componentization_data[i].AssetNo);
                }
                //this.onChangeDataSource(this.Componentization_data);
              })

    this.hideth=true;

    this.TransferAssetNoFilter.valueChanges.subscribe((AssetNoFilterValue) => {
      this.TransferfilteredValues['AssetNo'] = AssetNoFilterValue;
      //this.Transfer_datasource.filter = this.TransferfilteredValues.AssetNo;
    });

    this.RetirementAssetNoFilter.valueChanges.subscribe((AssetNoFilterValue) => {
      this.RetirementfilteredValues['AssetNo'] = AssetNoFilterValue;
      //this.Retirement_datasource.filter = this.RetirementfilteredValues.AssetNo;
    });

    this.EditAssetNoFilter.valueChanges.subscribe((AssetNoFilterValue) => {
      this.EditfilteredValues['AssetNo'] = AssetNoFilterValue;
      //this.Edit_datasource.filter = this.EditfilteredValues.AssetNo;
    });

    this.TaggingAssetNoFilter.valueChanges.subscribe((AssetNoFilterValue) => {
      this.TaggingfilteredValues['AssetNo'] = AssetNoFilterValue;
      //this.Tagging_datasource.filter = this.TaggingfilteredValues.AssetNo;
    });

    this.InventoryAssetNoFilter.valueChanges.subscribe((AssetNoFilterValue) => {
      this.InventoryfilteredValues['AssetNo'] = AssetNoFilterValue;
      //this.Inventory_datasource.filter = this.InventoryfilteredValues.AssetNo;
    });

    this.ComponentizationAssetNoFilter.valueChanges.subscribe((AssetNoFilterValue) => {
      this.ComponentizationfilteredValues['AssetNo'] = AssetNoFilterValue;
     // this.Componentization_datasource.filter = this.ComponentizationfilteredValues.AssetNo;
    });
  }

  ngAfterViewInit() {

  }

  selected(event){
    debugger;
    if(event =="Transfer")
    {
      this.SelectedAssetmaster='Transfer';
      this.displayedColumns = [];

    }
    if(event =="Retirement")
    {
      this.SelectedAssetmaster='Retirement';
      this.displayedColumns = [];

    }
    if(event =="Edit")
    {
      this.SelectedAssetmaster='Edit';
      this.displayedColumns = [];

    }
    
    if(event =="Tagging")
    {
      this.SelectedAssetmaster='Tagging';
      this.displayedColumns = ["Barcode", "AssetId", "SubAssetId", "AcquisitionDate","BU", "Location","BlockOfAsset","CategoryName", "Building", "Room", "Rack", "CPPNumber", "Cost", "WDV","Taggable", "LabelSize", "LabelMaterial", "LastModifiedOn", "DynamicInventoryBy"];
      this.IsshowGo= true;

    }
    if(event =="Inventory")
    {
      this.SelectedAssetmaster='Inventory';
      this.displayedColumns = [];
    }
    if(event =="Componentization")
    {
      this.SelectedAssetmaster='Componentization';
      this.displayedColumns = [];

    } 
  }

  filter(event){
    if(event == "All"){
      this.Filtertype = 0;
    }
   if(event == "Transaction Pending"){
    this.Filtertype = 1;
    }
    if(event == "Transaction Failed"){
      this.Filtertype = 2;
    }
  }

  applyFilterTransfer(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  }

  applyFilterRetirement(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  }

  applyFilterEdit(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  }

  applyFilterTagging(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  }

  applyFilterInventory(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  }

  applyFilterComponentization(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
  }

  // opentablePopup(columnName) {
  //   debugger;
  //   const dialogconfigcom = new MatDialogConfig();
  //   dialogconfigcom.disableClose = true;
  //   dialogconfigcom.autoFocus = true;
  //   dialogconfigcom.width = "45%";
  //   if(this.SelectedAssetmaster==="Transfer"){
  //   dialogconfigcom.data = this.Transfertempdatasource;
  //   }
  //   if(this.SelectedAssetmaster==="Retirement"){
  //     dialogconfigcom.data = this.Retirementtempdatasource;
  //   }
  //   if(this.SelectedAssetmaster==="Edit"){
  //     dialogconfigcom.data = this.Edittempdatasource;
  //   }
  //   if(this.SelectedAssetmaster==="Tagging"){
  //     dialogconfigcom.data = this.Taggingtempdatasource;
  //   }
  //   if(this.SelectedAssetmaster==="Inventory"){
  //     dialogconfigcom.data = this.Inventorytempdatasource;
  //   }
  //   if(this.SelectedAssetmaster==="Componentization"){
  //     dialogconfigcom.data = this.Componentizationtempdatasource;
  //   }

  //   const dialogRef = this.dialog.open(tablecolumComponent, dialogconfigcom);

     
  //   dialogRef.afterClosed().subscribe((result) => {
  //     debugger;
  //     if(result.length > 0){

  //     if(this.SelectedAssetmaster==="Transfer"){
  //       for (let i = 0; i < this.Transfer_data.length; i++) {
  //         var idx = result.indexOf(this.Transfer_data[i].AssetNo);

  //         if (idx > -1) {
  //           this.Transferselecteddatasource.push(this.Transfer_data[i])
  //         }
  //       }
  //       //this.Transfer_datasource = new MatTableDataSource(this.Transferselecteddatasource);
  //     }

  //     if(this.SelectedAssetmaster==="Retirement"){
  //       for (let i = 0; i < this.Retirement_data.length; i++) {
  //         var idx = result.indexOf(this.Retirement_data[i].AssetNo);

  //         if (idx > -1) {
  //           this.Retirementselecteddatasource.push(this.Retirement_data[i])
  //         }
  //       }
  //       //this.Retirement_datasource = new MatTableDataSource(this.Retirementselecteddatasource);
  //     }

  //     if(this.SelectedAssetmaster==="Edit"){
  //       for (let i = 0; i < this.Edit_data.length; i++) {
  //         var idx = result.indexOf(this.Edit_data[i].AssetNo);

  //         if (idx > -1) {
  //           this.Editselecteddatasource.push(this.Edit_data[i])
  //         }
  //       }
  //       //this.Edit_datasource = new MatTableDataSource(this.Editselecteddatasource);
  //     }

  //     if(this.SelectedAssetmaster==="Tagging"){
  //       for (let i = 0; i < this.Tagging_data.length; i++) {
  //         var idx = result.indexOf(this.Tagging_data[i].AssetNo);

  //         if (idx > -1) {
  //           this.Taggingselecteddatasource.push(this.Tagging_data[i])
  //         }
  //       }
  //       //this.Tagging_datasource = new MatTableDataSource(this.Taggingselecteddatasource);
  //     }

  //     if(this.SelectedAssetmaster==="Inventory"){
  //       for (let i = 0; i < this.Inventory_data.length; i++) {
  //         var idx = result.indexOf(this.Inventory_data[i].AssetNo);

  //         if (idx > -1) {
  //           this.Inventoryselecteddatasource.push(this.Inventory_data[i])
  //         }
  //       }
  //      // this.Inventory_datasource = new MatTableDataSource(this.Inventoryselecteddatasource);
  //     }

  //     if(this.SelectedAssetmaster==="Componentization"){
  //       for (let i = 0; i < this.Componentization_data.length; i++) {
  //         var idx = result.indexOf(this.Componentization_data[i].AssetNo);

  //         if (idx > -1) {
  //           this.Componentizationselecteddatasource.push(this.Componentization_data[i])
  //         }
  //       }
  //       //this.Componentization_datasource = new MatTableDataSource(this.Componentizationselecteddatasource);
  //     }

  //     }

  //   });
  // }

  OnClickGo()
  {
    if(!this.SelectedAssetmaster){
      this.toastr.warning('Please Select Type', this.message.AssetrakSays);
      return null;
    }
    // this.paginator.pageIndex = 0;
    this.paginationParams.pageSize = 50;
    this.paginationParams.currentPageIndex = 0;  
    this.Go();
  }

  Go(){
    if(this.SelectedAssetmaster =="Transfer")
    {
      this.Transactiontype = "T";
      this.PageId = 1;
      this.IsExport = false;
      var companyId= this.SessionCompanyId;
      var sbu = !!this.SBUMultiCtrl.value ? this.SBUMultiCtrl.value.join(',') : "";
      var pageNumber=  this.paginationParams.currentPageIndex + 1;
      var pageSize= this.paginationParams.pageSize;

      this.gs.GetOutBoundData(this.Transactiontype,this.Filtertype,this.PageId,this.IsExport,companyId,sbu,pageNumber,pageSize )
      .subscribe(r => {
     debugger;
       this.displayedColumns = [];
       let Obj: any[] = JSON.parse(r);

        for( let v in Obj[0]){
               this.displayedColumns.push(v);
           }
          
        Obj.forEach(element => {
            this.Transfer_data1.push(element)
        });
        
      this.Transfer_datasource = new MatTableDataSource(this.Transfer_data1);
      this.Transfer_datasource.paginator = this.Transferpaginator;
      this.Transfer_datasource.sort = this.Transfer_sort;
      this.Transfer_data1 = [];
     
    })

    }
    if(this.SelectedAssetmaster =="Retirement")
    {
      this.Transactiontype = "R";
      this.PageId = 1;
      this.IsExport = false;
      var companyId= this.SessionCompanyId;
      var sbu = !!this.SBUMultiCtrl.value ? this.SBUMultiCtrl.value.join(',') : "";
      var pageNumber=  this.paginationParams.currentPageIndex + 1;
      var pageSize= this.paginationParams.pageSize;

      this.gs.GetOutBoundData(this.Transactiontype,this.Filtertype,this.PageId,this.IsExport ,companyId,sbu,pageNumber,pageSize)
      .subscribe(r => {

        this.displayedColumns = [];

        let Obj: any[] = JSON.parse(r);
 
        if(Obj != null){

         for( let v in Obj[0]){
                this.displayedColumns.push(v);
            }
           
         Obj.forEach(element => {
             this.Retirement_data1.push(element)
         });
         this.displayTable = true;
        }
        
         
      this.Retirement_datasource = new MatTableDataSource(this.Retirement_data1);
      this.Retirement_datasource.paginator = this.Retirementpaginator;
      this.Retirement_datasource.sort = this.Retirement_sort;
      
      })
    }

    if(this.SelectedAssetmaster =="Edit")
    {
      this.Transactiontype = "E";
      this.PageId = 1;
      this.IsExport = false;
      var companyId= this.SessionCompanyId;
      var sbu = !!this.SBUMultiCtrl.value ? this.SBUMultiCtrl.value.join(',') : "";
      var pageNumber=  this.paginationParams.currentPageIndex + 1;
      var pageSize= this.paginationParams.pageSize;

      this.gs.GetOutBoundData(this.Transactiontype,this.Filtertype,this.PageId,this.IsExport ,companyId ,sbu,pageNumber,pageSize)
      .subscribe(r => {

        this.displayedColumns = [];

        let Obj: any[] = JSON.parse(r);
 
        if(Obj != null){

         for( let v in Obj[0]){
                this.displayedColumns.push(v);
            }
           
         Obj.forEach(element => {
             this.Edit_data1.push(element)
         });
        }

      this.Edit_datasource = new MatTableDataSource(this.Edit_data1);
      this.Edit_datasource.paginator = this.Editpaginator;
      this.Edit_datasource.sort = this.Edit_sort;
      })

    }
    
    if(this.SelectedAssetmaster =="Tagging")
    {
      debugger;
      this.showADIButton= false;
      this.Tagging_datasource="";
      this.Tagging_data1=[];
      this.Transactiontype = "TC";
      this.PageId = 1;
      this.IsExport = false;
      var companyId= this.SessionCompanyId;     
      var sbu = !!this.SBUMultiCtrl.value ? this.SBUMultiCtrl.value.join(',') : "";
      var filterType= !!this.Filtertype? this.Filtertype:0;
      var pageNumber=  this.paginationParams.currentPageIndex + 1;
      var pageSize= this.paginationParams.pageSize;

      this.gs.GetOutBoundData(this.Transactiontype,filterType ,this.PageId,this.IsExport,companyId, sbu,pageNumber,pageSize )
      .subscribe(r => {
         debugger;
        // this.displayedColumns = [];

        let Obj: any[] = JSON.parse(r[0]);
 
        if(Obj != null){

        //  for( let v in Obj[0]){
        //         this.displayedColumns.push(v);
        //     }
           
         Obj.forEach(element => {
             this.Tagging_data1.push(element)
         });
        }

        // if(!!this.Tagging_data1)
        // {
        //   this.showADIButton= true;
        // }

      this.Tagging_datasource = new MatTableDataSource(this.Tagging_data1);
      debugger;
      // this.paginationParams.totalCount =this.Tagging_datasource.filteredData.length;
      this.paginationParams.totalCount =!!r? !!r[1] ?parseInt(r[1]) : 0: 0;
      if(this.paginationParams.totalCount > 0)
      {
        this.showADIButton= true;
      }
      this.Tagging_datasource.sort = this.Tagging_sort;
      })

    }
    if(this.SelectedAssetmaster =="Inventory")
    {
      this.Transactiontype = "VC";
      this.PageId = 1;
      this.IsExport = false;
      var companyId= this.SessionCompanyId;
      var sbu = !!this.SBUMultiCtrl.value ? this.SBUMultiCtrl.value.join(',') : "";
      var pageNumber=  this.paginationParams.currentPageIndex + 1;
      var pageSize= this.paginationParams.pageSize;

      this.gs.GetOutBoundData(this.Transactiontype,this.Filtertype ,this.PageId,this.IsExport ,companyId, sbu,pageNumber,pageSize)
      .subscribe(r => {

        this.displayedColumns = [];

        let Obj: any[] = JSON.parse(r);
 
        if(Obj != null){

         for( let v in Obj[0]){
                this.displayedColumns.push(v);
            }
           
         Obj.forEach(element => {
             this.Inventory_data1.push(element)
         });

        }

      this.Inventory_datasource = new MatTableDataSource(this.Inventory_data1);
      this.Inventory_datasource.paginator = this.Inventorypaginator;
      this.Inventory_datasource.sort = this.Inventory_sort;
       
      })
    }
    if(this.SelectedAssetmaster =="Componentization")
    {
      
      this.Transactiontype = "S";
      this.PageId = 1;
      this.IsExport = false;
      var companyId= this.SessionCompanyId;
      var sbu = !!this.SBUMultiCtrl.value ? this.SBUMultiCtrl.value.join(',') : "";
      var pageNumber=  this.paginationParams.currentPageIndex + 1;
      var pageSize= this.paginationParams.pageSize;

      this.gs.GetOutBoundData(this.Transactiontype,this.Filtertype,this.PageId,this.IsExport,companyId, sbu,pageNumber,pageSize)
      .subscribe(r => {

        this.displayedColumns = [];

        let Obj: any[] = JSON.parse(r);
 
        if(Obj != null){

         for( let v in Obj[0]){
                this.displayedColumns.push(v);
            }
           
         Obj.forEach(element => {
             this.Componentization_data1.push(element)
         });

        }

      this.Componentization_datasource = new MatTableDataSource(this.Componentization_data1);
      this.Componentization_datasource.paginator = this.Componentizationpaginator;
      this.Componentization_datasource.sort = this.Componentization_sort;
       
      })
    } 
  }

  uploadData() {
    debugger;
    var groupId=this.SessionGroupId;
    var regionId=this.SessionRegionId;
    var companyId=this.SessionCompanyId;

      this.CompanyService.SendMailOfADI(groupId,regionId,companyId).subscribe(r=>{
        debugger;
        if(r =="Mail sent successfully."){
          this.toastr.success(this.message.UserResendMailSucess,this.message.AssetrakSays); 
        } 
        else if(r =="Unable to run the exe.")
        {
          this.toastr.error(r,this.message.AssetrakSays); 
        }    
      })     
      }

      ListOfField: any[] = [];
      ListOfFilter: any[] = [];
      ListOfFilterName: any[] = [];
      NewModifiedList: any[] = [];
      ListOfPagePermission: any[] = [];
      PermissionIdList: any[] = [];
      SBUList: any;

      GetInitiatedData() {
        debugger;
        let url1 = this.gs.GetFieldListByPageId(30,this.SessionUserId,this.SessionCompanyId);
        let url2 = this.gs.GetFilterIDlistByPageId(30);
        let url3 = this.us.PermissionRightsByUserIdAndPageId(this.SessionGroupId, this.SessionUserId, this.SessionCompanyId, this.SessionRegionId, "51");
        let url4 = this.cls.GetLocationListByConfiguration(this.SessionGroupId, this.SessionUserId, this.SessionCompanyId, this.SessionRegionId, 30)
      
        forkJoin([url1, url2, url3, url4]).subscribe(results => {
          if (!!results[0]) {
            this.ListOfField = JSON.parse(results[0]);
          
          }
          if (!!results[1]) {
            this.ListOfFilter = JSON.parse(results[1]);
            if (!!this.ListOfFilter) {
              this.ListOfFilter.forEach(x => this.ListOfFilterName.push(x.FilterName))
            }
            console.log(this.ListOfFilter);
          }
          if (!!results[2]) {
            debugger;
            this.ListOfPagePermission = JSON.parse(results[2]);
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
          if (!!results[3]) {
            this.SBUList = JSON.parse(results[3]);
            this.OnGetlayerid();
          }
       
          this.loader.close();
        })
      }

      ReportFlag :boolean = false;
      openPopUp(data: any = {}) {
        debugger;
        this.ReportFlag = true;
        let title = 'Add new member';
        var payload = {
          PageId : this.PageId,
          element : data,
          ListOfField : this.ListOfField,
          ReportFlag : this.ReportFlag ,
        }
        const dialogRef = this.dialog.open(assetTabsComponent, {
          width: 'auto',
         
          data: { title: title, payload: payload }
        });
        dialogRef.afterClosed()
          .subscribe(res => {
            if (!res) {
              return;
            }
          })
      }

      OnGetlayerid() {
        if (this.layerid == 1) {
          this.SBUList = this.SBUList.filter((item, i, arr) => arr.findIndex((t) => t.Country === item.Country) === i);
          this.filteredSBUMulti.next(this.SBUList);
          // this.filteredPlantsMulti.next(this.PlantList.filter((item) => item.Country = this.SBUName).slice());
          // this.filteredSBUMulti.next(this.SBUList.filter((item) => item.Country.slice()));
        }
        else if (this.layerid == 2) {
          this.SBUList = this.SBUList.filter((item, i, arr) => arr.findIndex((t) => t.State === item.State) === i);
          this.filteredSBUMulti.next(this.SBUList);
          // this.filteredPlantsMulti.next(this.PlantList.filter((item) => item.State = this.SBUName.slice()));
        }
        else if (this.layerid == 3) {
          this.SBUList = this.SBUList.filter((item, i, arr) => arr.findIndex((t) => t.City === item.City) === i);
          this.filteredSBUMulti.next(this.SBUList);
        }
        else if (this.layerid == 4) {
          this.SBUList = this.SBUList.filter((item, i, arr) => arr.findIndex((t) => t.Zone === item.Zone) === i);
          this.filteredSBUMulti.next(this.SBUList);
        }
      }

      handlePage(pageEvent: PageEvent) {
        debugger;
        this.paginationParams.pageSize = pageEvent.pageSize;
        this.paginationParams.currentPageIndex = pageEvent.pageIndex;
        this.paginationParams.endIndex = (this.paginationParams.currentPageIndex + 1) * pageEvent.pageSize;
        this.paginationParams.startIndex = this.paginationParams.currentPageIndex * pageEvent.pageSize;
        this.Go();
      }
}
