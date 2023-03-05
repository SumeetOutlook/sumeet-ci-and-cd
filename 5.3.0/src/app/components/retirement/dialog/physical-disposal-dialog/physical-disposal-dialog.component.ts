import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ReconciliationService } from '../../../services/ReconciliationService';
import { AssetRetireService } from '../../../services/AssetRetireService';
import { CompanyRackService } from '../../../services/CompanyRackService';
import { CompanyLocationService } from '../../../services/CompanyLocationService';
import { UploadService } from '../../../services/UploadService';
import { DatePipe } from '@angular/common';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { ToastrService } from 'ngx-toastr';
import { UploadDialogComponent } from '../../dialog/upload-dialog/upload-dialog.component';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';


@Component({
  selector: 'app-physical-disposal-dialog',
  templateUrl: './physical-disposal-dialog.component.html',
  styleUrls: ['./physical-disposal-dialog.component.scss']
})
export class PhysicalDisposalDialogComponent implements OnInit {

  Headers: any = [];
  message: any ;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('table', { static: false }) table: any;
  displayedColumns: string[] = ['select', 'Icon', 'Inventory No.', 'Asset No.', 'Sub No.', 'Asset Class', 'Asset Name', 'Asset Description', 'Serial No', 'IT Serial No', 'Plant', 'Cost', 'WDV', 'Inventory Indicator']
  dataSource: any;
  dataSourceNew: any;
  json: any;
  bindData: any[] = [];
  dialogForm: FormGroup;
  selection = new SelectionModel<any>(true, []);
  transfertypeList: any[] = [];
  result: any[] = [];
  ListCost: any[] = [];
  ListOfStorage: any[] = [];
  private isButtonVisible = false;
  fileextlist:any[];
  CompanyId: any;
  LocationId: any;
  UserId: any;
  GroupId: any;
  layerid: any;
  sbufilter: any;
  ShowNewDataSource: boolean = false;
  disabled: any;
  bindData1: any[] = [];
  physicalRemovalModeList: any[] = [];
  AssetNoFilter = new FormControl();
  filteredValues = {
    AssetNo: ''
  };

  scrappedHide: boolean = false;
  saleHide: boolean = false;
  donationHide: boolean = false;
  EwasteMode: boolean = false;
  EWasteHide: boolean = false;
  TradeHide: boolean = false;
  DiscardValue: any;
  DiscardType: any;
  ProposedSellingAmount: any;
  ustomerName :any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    public rs: ReconciliationService,
    private fb: FormBuilder,
    public crs: CompanyRackService,
    public cls: CompanyLocationService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    public ars: AssetRetireService,
    private loader: AppLoaderService,
    public confirmService: AppConfirmService,
    public toastr: ToastrService,
    public us: UploadService,
    private jwtAuth: JwtAuthService,
    ){
       this.Headers = this.jwtAuth.getHeaders();
       this.message = this.jwtAuth.getResources();
    }

  get f() { return this.dialogForm.controls; };
  ngOnInit() {
    debugger;
    this.loader.open();
    this.disabled = 'true';
    this.CompanyId = this.data.configdata.CompanyId;
    this.LocationId = this.data.configdata.LocationId;
    this.UserId = this.data.configdata.UserId;
    this.GroupId = this.data.configdata.GroupId;
    this.DiscardValue = this.data.configdata.DiscardValue;
    this.DiscardType = this.data.configdata.DiscardType;
    this.ProposedSellingAmount = this.data.configdata.ProposedSellingAmount;
    this.bindData1 = this.data.configdata.bindData
    this.ustomerName= this.bindData1[0].CustomerName
    this.dialogForm = this.fb.group({
      DiscardTypeCtrl: [this.DiscardType, [Validators.required]],
      ProposedSellingAmountCtrl: [this.ProposedSellingAmount, [Validators.required]],
      physicalRemovalModeCtrl: [''],
      amountCtrl: [this.ProposedSellingAmount],
      CustomerNameCtrl: [''],
      scrappingCtrl: [''],
      donationCtrl: [''],
      vendorCtrl: [''],
      ewasteAmountCtrl: [this.ProposedSellingAmount],
      EmployeeNameCtrl: [this.ustomerName],
      saleToempAmountCtrl: [this.ProposedSellingAmount],
      VendorNameCtrl: [this.ustomerName],
      VendorAmountCtrl: [this.ProposedSellingAmount],
    })
    this.SelectStatus();
    this.SelectPhysicalRemovalMode(this.DiscardType)
    this.onChangeDataSource(this.bindData1);
    //this.buildItemForm(this.data);

    this.AssetNoFilter.valueChanges.subscribe((AssetNoFilterValue) => {
      this.filteredValues['AssetNo'] = AssetNoFilterValue;
      this.dataSourceNew.filter = this.filteredValues.AssetNo;
    });
    var FunctionId = 15;
    this.us.GetAllowedExtensions(FunctionId).subscribe(response => {
      debugger;
      this.fileextlist =response;  
    })

  }
  buildItemForm(item) {

    var assetsDetails =
    {
      CompanyId: this.CompanyId,
      LocationId: this.LocationId,
      UserId: this.UserId,
      BlockId: this.data.configdata.BlockId,
      pageNo: 1,
      pageSize: 50,
      SearchText: "",
      IsSearch: false,
      AssetList: this.data.configdata.AssetList,
      TransferType: 0,
    }
    this.rs.GetPhysicalDisposalAssetList(assetsDetails).subscribe(r => {
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
    this.loader.close();
  }
  SelectStatus() {
    debugger;

    this.scrappedHide = false;
    this.saleHide = false;
    this.donationHide = false;
    this.EWasteHide = false;
    this.TradeHide = false;
    if (!this.DiscardValue || this.DiscardValue === "" || this.DiscardValue === null) {


    } else {
      if (this.DiscardValue == "1" || this.DiscardValue == "2") {
        this.saleHide = true;
        this.EWasteHide = true;
        this.physicalRemovalModeList = [
          { value: 'Sale', viewValue: this.Headers.sale },
          { value: 'Sale To Employee', viewValue: this.Headers.saleToEmployee },
          { value: 'Sale To Vendor', viewValue: this.Headers.saleToVendor },
          { value: 'E-Waste Disposal', viewValue: this.Headers.EWasteDisposal },
        ]
      }
      if (this.DiscardValue == "3") {
        this.scrappedHide = true;
        this.EWasteHide = true;
        this.physicalRemovalModeList = [
          { value: 'Disposed as Scrapped', viewValue: this.Headers.DisposedasScrapped },
          { value: 'E-Waste Disposal', viewValue: this.Headers.EWasteDisposal },
        ]
      }
      if (this.DiscardValue == "4") {
        this.donationHide = true;
        this.physicalRemovalModeList = [
          { value: 'Donation To Charity', viewValue: this.Headers.DonationToCharity },
        ]
      }
      if (this.DiscardValue == "5") {
        this.TradeHide = true;
        this.physicalRemovalModeList = [
          { value: 'Trade In', viewValue: this.Headers.TradeIn },
          { value: 'Vendor Buy Back', viewValue: this.Headers.vendorBuyBack },
        ]
      }
    }
  }

  saleMode: boolean = false;
  scrapMode: boolean = false;
  donationMode: boolean = false;
  saleToempMode: boolean = false;
  VendorMode: boolean = false;
  isDisabled: boolean = true;
  proposedAmnt:boolean =true;
  mandetoryflag: boolean =false;
  SelectPhysicalRemovalMode(value) {
    debugger;
    var physicalRemovalMode = value;
    this.saleMode = false;
    this.scrapMode = false;
    this.donationMode = false;
    this.EwasteMode = false;
    this.saleToempMode = false;
    this.VendorMode = false;
    if (!physicalRemovalMode || physicalRemovalMode === "" || physicalRemovalMode === null) {
      this.dialogForm = this.fb.group({
        DiscardTypeCtrl: [this.DiscardType, [Validators.required]],
        ProposedSellingAmountCtrl: [this.ProposedSellingAmount, [Validators.required]],
        physicalRemovalModeCtrl: [value],
        EmployeeNameCtrl: [''],
        saleToempAmountCtrl: [''],
      })
    } else if (physicalRemovalMode === "Sale") {
      this.saleMode = true;
      this.dialogForm = this.fb.group({
        DiscardTypeCtrl: [this.DiscardType, [Validators.required]],
        ProposedSellingAmountCtrl: [this.ProposedSellingAmount, [Validators.required]],
        physicalRemovalModeCtrl: [value, [Validators.required]],
        amountCtrl: [this.ProposedSellingAmount],
        CustomerNameCtrl: ['' ]
      })
    } else if (physicalRemovalMode === "Disposed as Scrapped") {
      this.scrapMode = true;
      this.dialogForm = this.fb.group({
        DiscardTypeCtrl: [this.DiscardType, [Validators.required]],
        ProposedSellingAmountCtrl: [this.ProposedSellingAmount, [Validators.required]],
        physicalRemovalModeCtrl: [value, [Validators.required]],
        scrappingCtrl: [this.ProposedSellingAmount, [Validators.required]]
      })
    } else if (physicalRemovalMode === "Donation To Charity") {
      this.donationMode = true;
      this.dialogForm = this.fb.group({
        DiscardTypeCtrl: [this.DiscardType, [Validators.required]],
        ProposedSellingAmountCtrl: [this.ProposedSellingAmount, [Validators.required]],
        physicalRemovalModeCtrl: [value, [Validators.required]],
        donationCtrl: [this.ProposedSellingAmount, [Validators.required]]
      })
    } else if (physicalRemovalMode === "E-Waste Disposal") {
      this.EwasteMode = true;
      this.dialogForm = this.fb.group({
        DiscardTypeCtrl: [this.DiscardType, [Validators.required]],
        ProposedSellingAmountCtrl: [this.ProposedSellingAmount, [Validators.required]],
        physicalRemovalModeCtrl: [value, [Validators.required]],
        vendorCtrl: ['', [Validators.required]],
        ewasteAmountCtrl: [this.ProposedSellingAmount]
      })
    } else if (physicalRemovalMode === "Sale To Employee") {
      this.saleToempMode = true;
      this.mandetoryflag =true;
      this.dialogForm = this.fb.group({
        DiscardTypeCtrl: [this.DiscardType, [Validators.required]],
        ProposedSellingAmountCtrl: [this.ProposedSellingAmount, [Validators.required]],
        physicalRemovalModeCtrl: [value, [Validators.required]],
        EmployeeNameCtrl: [this.ustomerName, [Validators.required]],
        saleToempAmountCtrl: [this.ProposedSellingAmount, [Validators.required]],
      })
    } else if (physicalRemovalMode === "Sale To Vendor") {
      this.VendorMode = true;
      this.mandetoryflag =true
      this.dialogForm = this.fb.group({
        DiscardTypeCtrl: [this.DiscardType, [Validators.required]],
        ProposedSellingAmountCtrl: [this.ProposedSellingAmount, [Validators.required]],
        physicalRemovalModeCtrl: [value, [Validators.required]],
        VendorNameCtrl: [this.ustomerName, [Validators.required]],
        VendorAmountCtrl: [this.ProposedSellingAmount, [Validators.required]],
      })
    }
  }

  openUploadDialog(value) {
    debugger;
    const dialogRef = this.dialog.open(UploadDialogComponent, {
      width: '980px',
      disableClose: true,
      data: { title: value, payload: value }
    });
    dialogRef.afterClosed().subscribe(result => {
      debugger;
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
  fileList: any[] = [];
  displayFileName : any ;
  fileChange(event) {
    debugger;
    var name = [];
    this.fileList = event.target.files;
   
  
    for (let j = 0; j < this.fileList.length; j++) { 
      this.FileUploadValidation(this.fileList[0].name,this.fileList[0].size);
     if(this.uploadfile ==true){
      let displayName = this.fileList[j].name;
      name.push(displayName);        
     }
    
  }
    this.displayFileName = name.join(',');
  
  }
  Submit() {
    if (this.selection.selected.length > 0) {
      var prefarIds = [];
      const numSelected = this.selection.selected.length;
      for (var i = 0; i < numSelected; i++) {
        prefarIds.push(this.selection.selected[i].PreFarId);
      }

      var amount = "", name = "", donation = "", scrapping = "";
      var disposalMode = !this.dialogForm.get('physicalRemovalModeCtrl').value ? "" : this.dialogForm.get('physicalRemovalModeCtrl').value;
      var disposalModeName = "";
      if (disposalMode == "Sale") {
        name = !this.dialogForm.get('CustomerNameCtrl').value ? "" : this.dialogForm.get('CustomerNameCtrl').value;
        amount = !this.dialogForm.get('amountCtrl').value ? "" : this.dialogForm.get('amountCtrl').value;
        disposalModeName = this.Headers.sale;
      }
      if (disposalMode == "Disposed as Scrapped") {
        scrapping = !this.dialogForm.get('scrappingCtrl').value ? "" : this.dialogForm.get('scrappingCtrl').value;
        disposalModeName = this.Headers.DisposedasScrapped;
      }
      if (disposalMode == "Donation To Charity") {
        donation = !this.dialogForm.get('donationCtrl').value ? "" : this.dialogForm.get('donationCtrl').value;
        disposalModeName = this.Headers.DonationToCharity;
      }
      if (disposalMode == "E-Waste Disposal") {
        name = !this.dialogForm.get('vendorCtrl').value ? "" : this.dialogForm.get('vendorCtrl').value;
        amount = !this.dialogForm.get('ewasteAmountCtrl').value ? "" : this.dialogForm.get('ewasteAmountCtrl').value;
        disposalModeName = this.Headers.EWasteDisposal;
      }
      if (disposalMode == "Sale To Employee") {
        var emp1 = this.dialogForm.get('EmployeeNameCtrl').value; //$scope.vm.EmployeeName.split("|");
        var emp = emp1.split("|");
        if (emp.length > 2) {
          var email = emp1.split("|")[2];
          name = email.replace(/ +/g, "");
        } else {
          name = !this.dialogForm.get('EmployeeNameCtrl').value ? "" : this.dialogForm.get('EmployeeNameCtrl').value;
        }
        amount = !this.dialogForm.get('saleToempAmountCtrl').value ? "" : this.dialogForm.get('saleToempAmountCtrl').value;
        disposalModeName = this.Headers.saleToEmployee;
      }
      if (disposalMode == "Sale To Vendor") {
        name = !this.dialogForm.get('VendorNameCtrl').value ? "" : this.dialogForm.get('VendorNameCtrl').value;
        amount = !this.dialogForm.get('VendorAmountCtrl').value ? "" : this.dialogForm.get('VendorAmountCtrl').value;
        disposalModeName = this.Headers.saleToVendor;
      }

      this.confirmService.confirm({ message: this.message.PhysicalDisposeNotification, title: this.message.AssetrakSays })
        .subscribe(res => {
          if (!!res) {
            debugger;
            if (this.fileList.length > 0) {
              var data = {
                discardedPhoto: null,
                companyId: this.CompanyId,
                AssetList: prefarIds.join(','),
                fileList: this.fileList
              }
              this.us.UploadPhysicalDisposalDocument(data)
                .subscribe(result => {
                  debugger;
                  var assetsDetails =
                  {
                    CompanyId: this.CompanyId,
                    AssetList: prefarIds.join(','),
                    LastModifiedBy: this.UserId,
                    TransferType: 0,
                    DisposalMode: disposalModeName,
                    Amount: amount,
                    CustomerName: name,
                    Scrapping: scrapping,
                    Donation: donation,
                    Documentlist: !!result ? result : "",
                    GroupId:this.GroupId
                  }
                  this.dialogRef.close(assetsDetails);
                })
            }
            else {
              var assetsDetails =
              {
                CompanyId: this.CompanyId,
                AssetList: prefarIds.join(','),
                LastModifiedBy: this.UserId,
                TransferType: 0,
                DisposalMode: disposalModeName,
                Amount: amount,
                CustomerName: name,
                Scrapping: scrapping,
                Donation: donation,
                Documentlist: "",
                GroupId:this.GroupId
              }
              this.dialogRef.close(assetsDetails);
            }
          }          
        })
    }
    else {
      this.toastr.warning(this.message.AssetsNotAvailableForPhysicalDisposal, this.message.AssetrakSays);
    }
  }
  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,3})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);
    
    if (!reg.test(input)) {
        event.preventDefault();
    }
   }
   doublext= /\.\w{2,3}\.\w{2,3}$/;
   fileName :any;
   uploadfile: boolean =false;
FileUploadValidation(filename,filesize) {
     debugger;
    this.fileName = filename;
    var extension = filename.substr(filename.lastIndexOf('.')); //check file type extention
    var doublextension = this.doublext.test(filename);
 
    for(let j = 0; j < this.fileextlist.length; j++)
    {
     if(extension.toLowerCase() === this.fileextlist[j] &&  filesize < 3000000)
       {    
       this.uploadfile =true;
       }    
   else{
     if (filesize > 3000000)
     { 
     this.uploadfile =false;
     this.toastr.error(this.message.filesizerestriction, this.message.AssetrakSays);
     return null;
  
    }
    if( (!(filename.endsWith(extension))) || this.fileextlist.indexOf(extension) == -1 || doublextension ==true || filename.startsWith('.'))
    {
        this.uploadfile =false;
        this.toastr.error(this.message.fileextensionvalidation2, this.message.AssetrakSays);
        return null;
    } 
    }
    } 
  }
}
