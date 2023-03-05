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
import { UploadDialogComponent } from '../../dialog/upload-dialog/upload-dialog.component';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';


@Component({
  selector: 'app-asset-retirement-dialog',
  templateUrl: './asset-retirement-dialog.component.html',
  styleUrls: ['./asset-retirement-dialog.component.scss']
})
export class AssetRetirementDialogComponent implements OnInit {

  Headers: any = [];
  message: any ;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('table', { static: false }) table: any;
  displayedColumns: string[] = ['select','Icon','Inventory No.', 'Asset No.', 'Sale Amount', 'Sub No.', 'Asset Class', 'Asset Name', 'Asset Description', 'Serial No', 'IT Serial No', 'Plant', 'Cost', 'WDV', 'Inventory Indicator', 'AssetCondition', 'AssetCriticality']
  dataSource: any;
  json: any;
  bindData: any[] = [];
  dialogForm: FormGroup;
  selection = new SelectionModel<any>(true, []);
  transfertypeList: any[] = [];
  result: any[] = [];
  saleamountEnable: boolean = false;
  today = new Date();
  isDisabled :boolean = true;
  retiretypeList: any[] = []

  CompanyId: any;
  LocationId: any;
  UserId: any;
  GroupId: any;
  layerid: any;
  sbufilter: any;
  AssetLife: any;
  getselectedIds: any;
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
    private jwtAuth: JwtAuthService,
    ){
       this.Headers = this.jwtAuth.getHeaders();
       this.message = this.jwtAuth.getResources();
       this.retiretypeList= [
        { value: '1', viewValue: this.Headers.saleToVendor },
        { value: '2', viewValue: this.Headers.saleToEmployee },
        { value: '3', viewValue: this.Headers.WriteOffLost },
        // { value: '4', viewValue: this.Headers.DonationToCharity },
        { value: '5', viewValue: this.Headers.TradeInBuyBackFromVendor }
      ]
    }
  get f() { return this.dialogForm.controls; };
  ngOnInit() {
    debugger;
    
    this.CompanyId = this.data.configdata.CompanyId;
    this.LocationId = this.data.configdata.LocationId;
    this.UserId = this.data.configdata.UserId;
    this.GroupId = this.data.configdata.GroupId;
    this.layerid = this.data.configdata.layerid;
    this.AssetLife = this.data.configdata.AssetLife;
    this.getselectedIds = this.data.configdata.getselectedIds;

    this.dialogForm = this.fb.group({
      retireDateCtrl: ['', [Validators.required]],
      proposedRetireDateCtrl: ['', [Validators.required]],
      retireTypeCtrl: ['', [Validators.required]],
      customernameCtrl: ['', [Validators.required, this.noWhitespaceValidator]],
      commentCtrl: ['', [Validators.required,this.noWhitespaceValidator]],
      amountCtrl: [''],
      UploadTransferPhoto: [''],
      UploadFile: [''],
      amountType:['', [Validators.required]],
      amountBy:['', [Validators.required]],
    })

    this.bindData = [];
    this.bindData = this.data.configdata.bindData;
    if(!!this.data.configdata.AssetList){
      this.buildItemForm(this.data);
    }
    else{
      this.onChangeDataSource(this.bindData);    
    }    

    var sendDate = new Date();
    this.dialogForm.get('retireDateCtrl').setValue(sendDate);

  }
  buildItemForm(item) {
    debugger;
    this.loader.open();
    var CompanyId = this.data.configdata.CompanyId;
    var AssetList = this.data.configdata.AssetList;

    this.ars.GetAssetsForRetirement(CompanyId, AssetList).subscribe(r => {
      this.loader.close();
      if(!!r){
        var data = JSON.parse(r);
        data.forEach(element => {
          this.bindData.push(element);
        });
      }
      this.onChangeDataSource(this.bindData);      
    })       
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}
  onChangeDataSource(value) {
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    this.selection.clear();
    this.masterToggle();
    this.getselectedPrefarIds = [];
    this.getselectedIds.forEach(row => {
      this.getselectedPrefarIds.push(row);
      this.selection.selected.push(row);
      debugger;
      if(row.checkFlagForAllocationRetireTransfer === true || row.CheckFlag === 'yes')
      {
        debugger;

      }
    })
    // this.dataSource.data.forEach(row => {
    //   if (row.checkFlagForAllocationRetireTransfer === true || row.CheckFlag === 'yes') {
    //     this.selection.select(row);
    //     this.getselectedPrefarIds.push(row.PreFarId)
    //   }
    // });
  }
  removeMandatory: boolean = true;
  vendorenable : boolean = false;
  Employenable: boolean =false;
  Retiretype :any;
  onchangeRetireType(type){
    debugger;
    this.Retiretype = type.viewValue;
    this.vendorenable = false;
    this.removeMandatory = true;
    this.Employenable = false;
    this.dialogForm.get('customernameCtrl').clearValidators();
    this.dialogForm.get('customernameCtrl').updateValueAndValidity();
    if(type.value == '1'){
      this.vendorenable = true;
      this.dialogForm.get('customernameCtrl').setValidators([Validators.required, this.noWhitespaceValidator]);
      this.dialogForm.get('customernameCtrl').updateValueAndValidity();
    }  
    if( type.value == '5'){
    this.vendorenable = false;
    //this.dialogForm.get('customernameCtrl').setValidators([this.noWhitespaceValidator]);
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
  AmountType1: any;
  amount: any;
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
  
    if (this.SellingValue == true && this.SellingValue1 == true) {
       this.saleamountEnable = true;
       this.IsShow = true;
       this.amountDisabled = true; 
       this.dialogForm.get("amountCtrl").setValue(this.amount);
       this.dialogForm.get('amountCtrl').enable();
       this.dialogForm.get('amountCtrl').setValidators([Validators.required]);
       this.dialogForm.get('amountCtrl').updateValueAndValidity();         
     }
  
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
     if (this.Consolidated == true && this.SellingValue1 == true ) {
      this.IsShow = true;
      this.amountDisabled = false; 
      this.amountDisabled = true;
      this.dialogForm.get("amountCtrl").setValue("");
      this.dialogForm.get('amountCtrl').enable();
      this.dialogForm.get('amountCtrl').setValidators([Validators.required]);
      this.dialogForm.get('amountCtrl').updateValueAndValidity();
    }
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

  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource.data.length;
  //   return numSelected === numRows;
  // }
  // masterToggle() {
  //   this.isAllSelected() ?
  //     this.selection.clear() :
  //     this.dataSource.data.forEach(row => this.selection.select(row));
  // }


  numSelected: any = 0;
  getselectedPrefarIds: any[] = [];
  isAllSelected: boolean = false;
  masterToggle() {
    debugger;
    this.isAllSelected = !this.isAllSelected;
    this.selection.clear();
    this.getselectedPrefarIds = [];
    if (this.isAllSelected == true) {
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
      });
    }
    this.numSelected = this.selection.selected.length;
    if (this.numSelected > 0) {
      this.selection.selected.forEach(row => this.getselectedPrefarIds.push(row.PreFarId));
    }
  }

  isSelected(row) {
    this.isAllSelected = false;
    this.selection.toggle(row);
    var idx = this.getselectedPrefarIds.indexOf(row.PreFarId);
    if (idx > -1) {
      this.getselectedPrefarIds.splice(idx, 1);
    }
    else {
      this.getselectedPrefarIds.push(row.PreFarId);
    }
    debugger;
    //majorminor group
    if ((parseInt(row.MergeId) > 0 && row.PreFarId == row.MergeId)) {
      for (var k = 0; k < this.dataSource.data.length; k++) {
        if (((parseInt(this.dataSource.data[k].MergeId) > 0 && (row.MergeId) > 0) && this.dataSource.data[k].MergeId == row.MergeId)) {
          var idx1 = this.getselectedPrefarIds.indexOf(row.PreFarId);
          if (idx1 > -1) {
            if (!!this.dataSource.data[k].Taggable && (this.dataSource.data[k].Taggable == "No")) {  //|| $scope.contentInfos1[k].Taggable.toLowerCase().trim() == "Verify Only".toLowerCase().trim()
              var idx2 = this.getselectedPrefarIds.indexOf(this.dataSource.data[k].PreFarId);
              if (idx2 > -1) {
              } else {
                debugger;
                this.getselectedPrefarIds.push(this.dataSource.data[k].PreFarId);
                this.selection.toggle(this.dataSource.data[k]);
              }
            }
          }
          else {
            var idx2 = this.getselectedPrefarIds.indexOf(this.dataSource.data[k].PreFarId);
            if (idx2 > -1) {
              var idx3 = this.getselectedPrefarIds.indexOf(this.dataSource.data[k].PreFarId);
              if (idx3 > -1) {
                this.getselectedPrefarIds.splice(idx2, 1); 
                this.selection.toggle(this.dataSource.data[k]);
               }
              else { }
            }
          }
        }
      }
    }

    if ((row.ADDL_Tag != null && row.PreFarId == row.ADDL_Tag)) {
      for (var k = 0; k < this.dataSource.data.length; k++) {
        if ((parseInt(this.dataSource.data[k].ADDL_Tag) > 0 && parseInt(row.ADDL_Tag) > 0) && row.ADDL_Tag == this.dataSource.data[k].ADDL_Tag) {

          var idx1 = this.getselectedPrefarIds.indexOf(row.PreFarId);
          if (idx1 > -1) {
            if (!!this.dataSource.data[k].Taggable && (this.dataSource.data[k].Taggable == "No")) { //|| $scope.contentInfos1[k].Taggable.toLowerCase().trim() == "Verify Only".toLowerCase().trim()
              var idx2 = this.getselectedPrefarIds.indexOf(this.dataSource.data[k].PreFarId);
              if (idx2 > -1) {
              } else {
                debugger;
                this.getselectedPrefarIds.push(this.dataSource.data[k].PreFarId);
                this.selection.toggle(this.dataSource.data[k]);
              }
            }
          }
          else {
            var idx2 = this.getselectedPrefarIds.indexOf(this.dataSource.data[k].PreFarId);
            if (idx2 > -1) {
              var idx3 = this.getselectedPrefarIds.indexOf(this.dataSource.data[k].PreFarId);
              if (idx3 > -1) { }
              else {
                if ((parseInt(this.dataSource.data[k].ADDL_Tag) > 0) && (!!this.dataSource.data[k].Taggable && (this.dataSource.data[k].Taggable == "No" || this.dataSource.data[k].Taggable.toLowerCase().trim() == "Verify Only".toLowerCase().trim()))) {  //|| $scope.contentInfos1[k].Taggable.toLowerCase().trim() == "Verify Only".toLowerCase().trim()
                  var idx4 = this.getselectedPrefarIds.indexOf(row.MergeId);
                  if (idx4 > -1) { } else { 
                    debugger;
                    this.getselectedPrefarIds.splice(idx2, 1); 
                    this.selection.toggle(this.dataSource.data[k]);
                  }
                }
              }
            }
          }
        }
      }
    }

  }


  fileList: any[] = [];
  displayFileName : any ;
  fileChange(event) {
    debugger;
    this.fileList = event.target.files;
  }
  uploaderData : any;
  openUploadDialog(value){
    debugger;
    const dialogRef = this.dialog.open(UploadDialogComponent, {
      width: '980px',
      disableClose: true,
      data: { title: value, payload:  this.uploaderData }
    });
    dialogRef.afterClosed().subscribe(result => {
      debugger;
      if(!!result){
        var name = [];
        this.fileList = [];
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
      }      
    })
  }

  Submit() {
    debugger;
    if (this.selection.selected.length) {
      var prefarIds = [];
      var SellingAmountlist = [];
      const numSelected = this.selection.selected.length;
    //  for (var i = 0; i < numSelected; i++) {
      //  prefarIds.push(this.selection.selected[i].PreFarId);
      //}
      prefarIds= this.getselectedPrefarIds;
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
        SellingAmountlist: SellingAmountlist
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
