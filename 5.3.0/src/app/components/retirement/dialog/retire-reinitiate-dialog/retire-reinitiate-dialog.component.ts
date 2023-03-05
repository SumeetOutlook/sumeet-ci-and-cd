import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatPaginator,PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ReconciliationService } from '../../../services/ReconciliationService';
import { AssetRetireService } from '../../../services/AssetRetireService';
import { CompanyRackService } from '../../../services/CompanyRackService';
import { CompanyLocationService } from '../../../services/CompanyLocationService';
import { DatePipe } from '@angular/common';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { ToastrService } from 'ngx-toastr';
import { UploadDialogComponent } from '../../dialog/upload-dialog/upload-dialog.component';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';

@Component({
  selector: 'app-retire-reinitiate-dialog',
  templateUrl: './retire-reinitiate-dialog.component.html',
  styleUrls: ['./retire-reinitiate-dialog.component.scss']
})
export class RetireReinitiateDialogComponent implements OnInit {

  Headers: any = [];
  message: any ;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('table', { static: false }) table: any;
  displayedColumns: string[] = ['select','Icon', 'Inventory No.', 'Asset No.','Sale Amount', 'Sub No.', 'Asset Class', 'Asset Name', 'Asset Description', 'Serial No', 'IT Serial No', 'Plant', 'Cost', 'WDV', 'Inventory Indicator']
  displayedColumns1: string[] = ['select', 'Inventory No.', 'Asset No.', 'Sub No.', 'Asset Class', 'Asset Name', 'Asset Description', 'Serial No', 'IT Serial No', 'Plant', 'Cost', 'WDV', 'Inventory Indicator']
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
  setflag:boolean=false;

  CompanyId: any;
  LocationId: any;
  UserId: any;
  GroupId: any;
  layerid: any;
  sbufilter: any;
  ShowNewDataSource: boolean = false;
  AssetLife: any;
  AssetList: any;
  RetiredId: any;
  saleamountEnable: boolean = false;
  today = new Date();

  retiretypeList: any[] = []

  AssetNoFilter = new FormControl();
  filteredValues = {
    AssetNo: ''
  };
  decimalNumericPattern = "^-?[0-9]\\d*(\\.\\d{1,3})?$";
  paginationParams: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    public rs: ReconciliationService,
    private fb: FormBuilder,
    public crs: CompanyRackService,
    public cls: CompanyLocationService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    public ars: AssetRetireService,
    public confirmService: AppConfirmService,
    private loader: AppLoaderService,
    public toastr: ToastrService,
    private jwtAuth: JwtAuthService,
    ){
       this.Headers = this.jwtAuth.getHeaders();
       this.message = this.jwtAuth.getResources();
       this.retiretypeList = [
        { value: '1', viewValue: this.Headers.saleToVendor },
        { value: '2', viewValue: this.Headers.saleToEmployee },
        { value: '3', viewValue: this.Headers.WriteOffLost },
        { value: '4', viewValue: this.Headers.DonationToCharity },
        { value: '5', viewValue: this.Headers.TradeInBuyBackFromVendor }
      ]
    }

  get f() { return this.dialogForm.controls; };
  ngOnInit() {
    debugger;
    this.loader.open();
    this.CompanyId = this.data.configdata.CompanyId;
    this.LocationId = this.data.configdata.LocationId;
    this.UserId = this.data.configdata.UserId;
    this.GroupId = this.data.configdata.GroupId;
    this.AssetLife = this.data.configdata.AssetLife;
    this.AssetList = this.data.configdata.AssetList;
    this.RetiredId = this.data.configdata.RetiredId;

    this.dialogForm = this.fb.group({
      retireDateCtrl: ['', [Validators.required]],
      proposedRetireDateCtrl: ['', [Validators.required]],
      retireTypeCtrl: ['', [Validators.required]],
      customernameCtrl: [''],
      commentCtrl: ['', [Validators.required,this.noWhitespaceValidator]],
      amountCtrl: [''],
      UploadTransferPhoto: [''],
      UploadFile: [''],
      amountType:['', [Validators.required]],
      amountBy:['', [Validators.required]],
    })
    this.buildItemForm(this.data);

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
    var assetsDetails = {
      AssetLife: this.AssetLife,
      AssetList: this.AssetList,
      CompanyId: this.CompanyId,
      RetiredId: this.RetiredId
    }
    item.payload.forEach(element => {
      this.bindData.push(element);
    });
    ///this.bindData = JSON.parse(item.payload);
    this.onChangeDataSource(this.bindData);
    this.loader.close();
    // this.ars.GetMultipleRetireAssetForReintiation(assetsDetails).subscribe(r => {
    //   this.loader.close();
    //   this.bindData = JSON.parse(r);
    //   this.onChangeDataSource(this.bindData);
    // })
    

    var sendDate = new Date();
    this.dialogForm.get('retireDateCtrl').setValue(sendDate);

  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}
  onChangeDataSource(value) {
    this.dataSource = new MatTableDataSource(value);
    // this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.selection.clear()
    this.masterToggle();
  }
  
  removeMandatory: boolean = true;
  vendorenable : boolean = false;
  Employenable: boolean =false;
  Retiretype :any;
  onchangeRetireType(type){
    this.Retiretype = type.viewValue;
    this.vendorenable = false;
    this.removeMandatory = true;
    this.Employenable = false;
    this.dialogForm.get('customernameCtrl').clearValidators();
    this.dialogForm.get('customernameCtrl').updateValueAndValidity();
    if(type.value == '1'){
      this.vendorenable = true;
      this.dialogForm.get('customernameCtrl').setValidators([Validators.required]);
      this.dialogForm.get('customernameCtrl').updateValueAndValidity();
    }   
    if( type.value == '5'){
      this.vendorenable = false;
      this.dialogForm.get('customernameCtrl').setValidators([Validators.required, this.noWhitespaceValidator]);
      this.dialogForm.get('customernameCtrl').updateValueAndValidity();   
      }
      if(type.value == '2'){
        this.Employenable = true;
         this.dialogForm.get('customernameCtrl').setValidators([Validators.required, this.noWhitespaceValidator]);
         this.dialogForm.get('customernameCtrl').updateValueAndValidity();
       }  
    if(!this.AmountType){
      this.dialogForm.get('amountBy').setValidators([Validators.required]);
      this.dialogForm.get('amountBy').updateValueAndValidity();
      this.dialogForm.get('amountType').setValidators([Validators.required]);
      this.dialogForm.get('amountType').updateValueAndValidity();
    }    
    if(type.value == '3' || type.value == '4'){     
      this.removeMandatory = false; 
        this.dialogForm.get('amountBy').clearValidators();
        this.dialogForm.get('amountBy').updateValueAndValidity();  
        this.dialogForm.get('amountType').clearValidators();
        this.dialogForm.get('amountType').updateValueAndValidity();           
    }   
  }
  
  ReAmountId: boolean = false;
  IsShow: boolean = false;
  AmountType: any;
  amount: any;
  AmountType1: any;
  Consolidated: boolean = false;
  SellingValue: boolean = false;
  NBV: boolean = false;
  SaleAmountAssetWise: boolean = false;
  TransactionTypeForSellingAmount: any;
  SellingValue1 :boolean =false;
  ShowAmount(value) {
    debugger;
    this.ReAmountId = false;
    this.IsShow = false;
    this.SellingValue1 = false;
    this.saleamountEnable = false;
    this.NBV = false;
    if(!!this.totalamount1){
      this.amount = this.totalamount1
    }
    else{
    this.amount = "";
    }

    if (value === 'Selling  Value') {
      this.AmountType = 'Selling  Value';
      this.ReAmountId = true;
      this.SellingValue1 = true;
    }
    else if (value === 'NBV') {
      this.IsShow = false;
      this.AmountType = 'NBV';
      this.ReAmountId = false;
      this.NBV = true;
    }
    this.dialogForm.get('amountCtrl').clearValidators();
    this.dialogForm.get('amountCtrl').disable();
    this.dialogForm.get('amountCtrl').updateValueAndValidity();
    // if (this.ReAmountId == true && this.SellingValue1 == true) {
    //  // this.saleamountEnable = true;
    //   this.IsShow = true;
    //   this.amountDisabled = true; 
    //   this.dialogForm.get("amountCtrl").setValue("");
    //   this.dialogForm.get('amountCtrl').enable();
    //   this.dialogForm.get('amountCtrl').setValidators([Validators.required]);
    //   this.dialogForm.get('amountCtrl').updateValueAndValidity();         
    // }
    if (this.SellingValue == true && this.SellingValue1 == true) {
       this.saleamountEnable = true;
       this.IsShow = true;
       this.amountDisabled = true; 
       this.dialogForm.get("amountCtrl").setValue(this.amount);
       this.dialogForm.get('amountCtrl').enable();
       this.dialogForm.get('amountCtrl').setValidators([Validators.required]);
       this.dialogForm.get('amountCtrl').updateValueAndValidity();         
     }
    // if (this.NBV == true && this.SellingValue1 == false) {
    //   // this.saleamountEnable = true;
    //    this.IsShow = false;
    //    this.amountDisabled = true; 
    //    this.dialogForm.get("amountCtrl").setValue("");
    //    this.dialogForm.get('amountCtrl').enable();
    //    this.dialogForm.get('amountCtrl').setValidators([Validators.required]);
    //    this.dialogForm.get('amountCtrl').updateValueAndValidity();         
    //  }
    if (this.SaleAmountAssetWise == true && this.NBV == true) {
      this.saleamountEnable = false;
      this.IsShow = false;
      this.amountDisabled = true; 
      this.dialogForm.get("amountCtrl").setValue("");
      this.dialogForm.get('amountCtrl').enable();
      this.dialogForm.get('amountCtrl').updateValueAndValidity();         
    }
    if (this.Consolidated == true && this.SellingValue1 == true) {
      this.IsShow = true;
      this.amountDisabled = false;
      this.dialogForm.get("amountCtrl").setValue("");
      this.dialogForm.get('amountCtrl').enable();
      this.dialogForm.get('amountCtrl').setValidators([Validators.required]);
      this.dialogForm.get('amountCtrl').updateValueAndValidity();
    }
    // if (this.Consolidated == true && this.SellingValue == false) {
    //   this.IsShow = true;
    //   this.amountDisabled = false;
    //   this.dialogForm.get("amountCtrl").setValue("");
    //   this.dialogForm.get('amountCtrl').enable();
    //   this.dialogForm.get('amountCtrl').setValidators([Validators.required]);
    //   this.dialogForm.get('amountCtrl').updateValueAndValidity();
    // }
    // if(this.SaleAmountAssetWise == true && this.NBV == true ){
    //   this.IsShow = true;
    //   this.saleamountEnable = true;
    //   this.amountDisabled = false;
    //   this.dialogForm.get("amountCtrl").setValue(this.amount);
    //   this.dialogForm.get('amountCtrl').enable();
    //   this.dialogForm.get('amountCtrl').setValidators([Validators.required]);
    //   this.dialogForm.get('amountCtrl').updateValueAndValidity();
    // }
    // if(this.Consolidated == true && this.NBV == true ){
    //   this.IsShow = false;
    //   this.saleamountEnable = false;
    //   this.amountDisabled = false;
      
    // }

    this.dialogForm.get('amountBy').clearValidators();
    this.dialogForm.get('amountBy').updateValueAndValidity();
  }
  amountDisabled : boolean = true;
  Consolidated1 :boolean =false;
  ShowAmount1(value) {
    debugger;
    this.Consolidated = false;
    this.SaleAmountAssetWise = false;
    this.saleamountEnable = false;
    this.IsShow = false;
    this.Consolidated1 =false;
    this.SellingValue =false;
    if (value === 'AssetWish') {
      this.AmountType1 = 'Sale Amount Asset Wish';
      this.TransactionTypeForSellingAmount = "By Asset";
      this.SaleAmountAssetWise = true;
      this.SellingValue = true;
    }
    else if (value === 'Consolidated') {
      this.AmountType1 = 'Consolidated';
      this.TransactionTypeForSellingAmount = "By Transaction";
      this.Consolidated = true;
      this.Consolidated1 =true; 
      this.SellingValue = false;
    }
    this.dialogForm.get('amountCtrl').clearValidators();
    this.dialogForm.get('amountCtrl').disable();
    this.dialogForm.get('amountCtrl').updateValueAndValidity();
    if (this.SaleAmountAssetWise == true && this.SellingValue1 == true) {
      this.saleamountEnable = true;
      this.IsShow = true;
      this.amountDisabled = true;  
      this.dialogForm.get("amountCtrl").setValue("");
      this.dialogForm.get('amountCtrl').enable();
      this.dialogForm.get('amountCtrl').setValidators([Validators.required]);
      this.dialogForm.get('amountCtrl').updateValueAndValidity();
    }
    // if (this.Consolidated == true && this.SellingValue == false) {
    //   this.IsShow = false;
    //   this.amountDisabled = false;
    //   this.dialogForm.get("amountCtrl").setValue("");
    //   this.dialogForm.get('amountCtrl').enable();
    //   this.dialogForm.get('amountCtrl').setValidators([Validators.required]);
    //   this.dialogForm.get('amountCtrl').updateValueAndValidity();
    // }
    // if (this.SaleAmountAssetWise == true && this.NBV == true) {
    //   this.saleamountEnable = false;
    //   this.IsShow = false;
    //   this.amountDisabled = true; 
    //   this.dialogForm.get("amountCtrl").setValue("");
    //   this.dialogForm.get('amountCtrl').enable();
    //   this.dialogForm.get('amountCtrl').setValidators([Validators.required]);
    //   this.dialogForm.get('amountCtrl').updateValueAndValidity();         
    // }
     if (this.Consolidated == true && this.SellingValue1 == true ) {
      this.IsShow = true;
      this.amountDisabled = false; 
      this.amountDisabled = true;
      this.dialogForm.get("amountCtrl").setValue("");
      this.dialogForm.get('amountCtrl').enable();
      this.dialogForm.get('amountCtrl').setValidators([Validators.required]);
      this.dialogForm.get('amountCtrl').updateValueAndValidity();
    }
    // if (this.Consolidated == true && this.Consolidated1 == true ) {
    //   this.IsShow = false;
    //   this.amountDisabled = false;
    //   this.dialogForm.get("amountCtrl").setValue("");
    //   this.dialogForm.get('amountCtrl').enable();
    //   this.dialogForm.get('amountCtrl').setValidators([Validators.required]);
    //   this.dialogForm.get('amountCtrl').updateValueAndValidity();
    // }
    // if (this.Consolidated == true && this.SellingValue == false) {
    //   this.IsShow = true;
    //   this.amountDisabled = false;
    //   this.dialogForm.get("amountCtrl").setValue("");
    //   this.dialogForm.get('amountCtrl').enable();
    //   this.dialogForm.get('amountCtrl').setValidators([Validators.required]);
    //   this.dialogForm.get('amountCtrl').updateValueAndValidity();
    // }
    // if(this.SaleAmountAssetWise == true && this.NBV == true ){
    //   this.IsShow = true;
    //   this.saleamountEnable = true;
    //   this.amountDisabled = false;
    //   this.dialogForm.get("amountCtrl").setValue(this.amount);
    //   this.dialogForm.get('amountCtrl').enable();
    //   this.dialogForm.get('amountCtrl').setValidators([Validators.required]);
    //   this.dialogForm.get('amountCtrl').updateValueAndValidity();
    // }
    // if(this.Consolidated == true && this.NBV == true ){
    //   this.IsShow = false;
    //   this.saleamountEnable = false;
    //   this.amountDisabled = false;
     
    // }
    this.dialogForm.get('amountType').clearValidators();
    this.dialogForm.get('amountType').updateValueAndValidity();
  }
  totalamount1 :any;

  submitbtn :boolean =false;
  submitbtn1 :boolean =false;
  totalSellingAmount(){
    this.submitbtn1 = false;
    var totalAmount :any;
    for (var j = 0; j < this.dataSource.data.length; j++) {

      for(var i =0 ;i < this.getselectedPrefarIds.length ; i++) {

        if(this.getselectedPrefarIds[i] == this.dataSource.data[j].PreFarId ){
 
      if(!!this.dataSource.data[j].SaleAmount){
         if(this.dataSource.data[j].SaleAmount.startsWith('.'))
        {
       totalAmount = "";
        this.dialogForm.get("amountCtrl").setValue("");
        this.dataSource.data[j].SaleAmount = "";
         return;
        }
        else{
           if(this.dataSource.data[j].SaleAmount == 0)
          {
           this.submitbtn1 = true;
        }
          if(!!totalAmount){
        totalAmount = totalAmount + Number(this.dataSource.data[j].SaleAmount);
          }
          else{
        totalAmount = 0;
        totalAmount = totalAmount + Number(this.dataSource.data[j].SaleAmount);
        }
        }
      } 
      else if(!this.dataSource.data[j].SaleAmount){
        this.submitbtn1 = true;
      }
      else{
        this.dialogForm.get("amountCtrl").setValue("");
      } 
    }    
    }
  }
    this.dialogForm.get("amountCtrl").setValue(totalAmount);
    this.totalamount1 = totalAmount;
    if(this.submitbtn1 == true){
      this.submitbtn = true;
    }
  else if(this.dialogForm.get('amountCtrl').value == 0 && this.Retiretype == "Sale To Vendor"){
      this.submitbtn = true;
    }
   else if(this.dialogForm.get('amountCtrl').value == 0 && this.Retiretype == "Sale To Employee"){
      this.submitbtn = true;
    }
    else if(this.dialogForm.get('amountCtrl').value != 0 && this.submitbtn1 == false){
      this.submitbtn = false;
    }
   // this.dialogForm.get("amountCtrl").setValue(totalAmount);
  }
  fileList: any[] = [];
  displayFileName : any ;
  fileChange(event) {
    
    this.fileList = event.target.files;
  }
  uploaderData : any;
  OldPhotolist: any = "";
  openUploadDialog(value){
    
    const dialogRef = this.dialog.open(UploadDialogComponent, {
      width: '980px',
      disableClose: true,
      data: { title: value, payload:  this.uploaderData,retId: this.RetiredId }
    });
    dialogRef.afterClosed().subscribe(result => {
      
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
        fileItem['displayName'] = displayName ;
        this.fileList.push(fileItem);
        //this.uploader.queue[j].
        //data.append('file', fileItem);
        //data.append('displayName', displayName);        
      }

      this.displayFileName = name.join(',');
      this.displayFileName = this.displayFileName + ',' + this.OldPhotolist ;
    })
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  numSelected: any = 0;
  getselectedPrefarIds: any[] = [];
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
      this.numSelected = this.selection.selected.length;
      if (this.numSelected > 0) {
        this.selection.selected.forEach(row => this.getselectedPrefarIds.push(row.PreFarId));
      }
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
        LocationId: locationId,
        // pageNo: 1,
        // pageSize: 50,
        pageNo: this.paginationParams.currentPageIndex + 1,
        pageSize: this.paginationParams.pageSize,
        IsSearch: this.IsSearch,
        UserId: this.UserId,
        BlockId:  0,
        AssetLife: "All",
        Flag: 'Retirement Initiation',
        IsExport: false,
        SearchText: this.serachtext,
        columnName: this.colunname,
        isfromReinitation : true
      }

      this.ars.GetAssetListToInitiateRetire(assetDetails).subscribe(r => {
        
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
        this.onChangeDataSourceNew(this.bindData1);
      })   

  }

  onChangeDataSourceNew(value) {
    this.dataSourceNew = new MatTableDataSource(value);
    // this.dataSourceNew.paginator = this.paginator;
    this.dataSourceNew.sort = this.sort;
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
    
    if (this.selection.selected.length) {
      var prefarIds = [];
      var SellingAmountlist = [];
      const numSelected = this.selection.selected.length;
      for (var i = 0; i < numSelected; i++) {
        prefarIds.push(this.selection.selected[i].PreFarId);
      }
      for (var j = 0; j < this.dataSource.data.length; j++) {
        var idx = prefarIds.indexOf(this.dataSource.data[j].PreFarId);
        if (idx > -1) {
          if (this.SaleAmountAssetWise == true && this.SellingValue == true){
            var aa = {
              PrefarId: this.dataSource.data[j].PreFarId,
              SellingAmount: !this.dataSource.data[j].SaleAmount ? 0 : this.dataSource.data[j].SaleAmount,
            }
            SellingAmountlist.push(aa);
          }
          else{
            var aa1 = {
              PrefarId: this.dataSource.data[j].PreFarId,
              SellingAmount: 0,
            }
            SellingAmountlist.push(aa1);
          }   
        }
      }


      var retireDateTime = this.datepipe.transform(this.dialogForm.get('retireDateCtrl').value, 'dd-MMM-yyyy');
      var proposedDate = this.datepipe.transform(this.dialogForm.get('proposedRetireDateCtrl').value, 'dd-MMM-yyyy');
      
      var discardValue = this.dialogForm.get('retireTypeCtrl').value;
      var discardType = "";
      if (discardValue == "1") { discardType = this.Headers.saleToVendor }
      if (discardValue == "2") { discardType = this.Headers.saleToEmployee }
      if (discardValue == "3") { discardType = this.Headers.WriteOffLost }
      if (discardValue == "4") { discardType = this.Headers.DonationToCharity }
      if (discardValue == "5") { discardType = this.Headers.TradeInBuyBackFromVendor }
      var RetireDto = {
        Excelfile: null,
        AssetList: prefarIds.join(','),
        rComment: this.dialogForm.get('commentCtrl').value,
        Amount: !this.dialogForm.get('amountCtrl').value ? 0 : this.dialogForm.get('amountCtrl').value,
        CustomerName: this.dialogForm.get('customernameCtrl').value,
        discardValue: discardValue,
        discardType: discardType,
        discardedPhoto: null,
        DiscardedPhotoId: null,
        RetireDateTime: retireDateTime,
        UserId: this.UserId,
        LocationId: this.LocationId,
        CompanyId: this.CompanyId,
        proposedDate: proposedDate,
        amountype: this.AmountType,
        assetLifeFlag: this.AssetLife,
        TransactionTypeForSellingAmount: this.TransactionTypeForSellingAmount,
        fileList: this.fileList,
        SellingAmountlist: SellingAmountlist ,
        OldPhotolist : this.OldPhotolist
      }
      this.dialogRef.close(RetireDto);

    }
    else {
      this.toastr.warning(this.message.SelectassetInitiateRetirement, this.message.AssetrakSays);
    }

  }
  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,3})?$/;
   
    if(this.saleamountEnable  == true)
    {
      let input = event.target.value + String.fromCharCode(event.charCode);
      if (!reg.test(input)) {
          event.preventDefault();
      }
      this.totalSellingAmount()
    }
    else{
      let input = event.target.value + String.fromCharCode(event.charCode);
      if (!reg.test(input)) {
           if(input.startsWith('.'))
          {
           this.dialogForm.get("amountCtrl").setValue("");
           return null;
          }
          if(this.dialogForm.get('amountCtrl').value == 0 && this.Retiretype == "Sale To Vendor"){
            this.submitbtn = true;
          }
           else if(this.dialogForm.get('amountCtrl').value == 0 && this.Retiretype == "Sale To Employee"){
            this.submitbtn = true;
          }
          else{
            this.submitbtn = false;
            event.preventDefault();
          }
      }
  
    }
  }

}
