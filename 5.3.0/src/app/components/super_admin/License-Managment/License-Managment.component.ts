import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { CredentialService } from 'app/components/services/CredentialService';
import { ToastrService } from 'ngx-toastr';
import * as headers from '../../../../assets/Headers.json';
import * as resource from '../../../../assets/Resource.json';
import { GroupService } from 'app/components/services/GroupService';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { AddLicenseDialogComponent } from '../License-Managment/dialog/add-license-dialog/add-license-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { EditLicenseDialogComponent} from  '../License-Managment/dialog/edit-license-dialog/edit-license-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

export interface type {
  value: string;
  viewValue: string;
}

export interface UsersData {
  id: number;
  name: string;
  groupId: string;
  type: string;
  module: string;
}

const ELEMENT_DATA: UsersData[] = [
  { id: 1, name: 'License id 1', groupId: 'group id 1', type: 'type 1', module: 'module 1' },
  { id: 2, name: 'License id 2 ', groupId: 'group id 2', type: 'type 2', module: 'module 2' },
  { id: 3, name: 'License id 3', groupId: 'group id 3', type: 'type 3', module: 'module 3' },
  { id: 4, name: 'license id 4', groupId: 'group id 4', type: 'type 4', module: 'module 4' }
];

@Component({
  selector: 'app-License-Managment',
  templateUrl: './License-Managment.component.html',
  styleUrls: ['./License-Managment.component.scss']
})
export class LicenseManagmentComponent implements OnInit {
  header: any ;
  message: any = (resource as any).default;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  submitted: boolean = false;
  firstFormGroup: FormGroup;
  get f1() { return this.firstFormGroup.controls; };
  firstFormGroup2: FormGroup;
  get f3() { return this.firstFormGroup2.controls; }
  firstFormGroup3: FormGroup;
  get f4() { return this.firstFormGroup3.controls; }

  datasource = new MatTableDataSource<any>();
  dummydata: UsersData[];

  panelOpenState = new Array<boolean>();
  displaybtn :boolean = false;
  LicenseGroup :boolean = true;
  selection = new SelectionModel<any>(true, []);
  Company_Distribution_Data = [
    {
      name: 'Total Asset Count',
      totalCount : 0,
      companyList: [],
      disabled:true
    },
    {
      name: 'Total User',
      totalCount : 0,
      companyList: [],
      disabled:true
    },
    {
      name: 'Total Audit',
      totalCount : 0,
      companyList: [],
      disabled:true
    },
    {
      name: 'Transfer Licenses',
      totalCount : 0,
      companyList: [],
      disabled:true
    },
    {
      name: 'Retirment Licenses',
      totalCount : 0,
      companyList: [],
      disabled:true
    },
    {
      name: 'Assignment Licenses',
      totalCount : 0,
      companyList: [],
      disabled:true
    }
  ];

  displayedColumns: string[] = ['select','Type', 'Product', 'Module', 'From_Date', 'To_Date', 'License_Level', 'Creation_Date']

  ModuleField = [    
    {
      value: '19',
      viewValue: 'NONFAR'
    },
    {
      value: '20',
      viewValue: 'GRN'
    },
    {
      value: '107',
      viewValue: 'Assignment'
    },
    {
      value: '39',
      viewValue: 'Transfer'
    },
    {
      value: '46',
      viewValue: 'Retirement'
    },
    {
      value: '26',
      viewValue: 'Audit'
    },
    {
      value: '67',
      viewValue: 'Contract Management'
    }
  ];
  LicenseType: any;
  constructor(
    private _formBuilder: FormBuilder,
    public credentialservice: CredentialService,
    public gp: GroupService,
    public toastr: ToastrService,
    private loader: AppLoaderService,
    public dialog: MatDialog,
    private storage: ManagerService,
    private router: Router,
    private jwtAuth :JwtAuthService
  ) 
  {
    this.header = this.jwtAuth.getHeaders()
   }

  step;
  public selectedTabIndex = 0;
  setStep(index: number) {
    this.step = index;
    this.panelOpenState[index] = true;
  }

  changeState(index: number) {
    this.panelOpenState[index] = false;
  }
  GroupId: any;
  ngOnInit() {
    debugger;
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    if(this.GroupId == "null")
    {
      this.toastr.error(this.message.AddGroup, this.message.AssetrakSays);
    }
    this.firstFormGroup = this._formBuilder.group({
      LCDID: [''],
      CDI: [''],
      TI: [''],
      CI: [''],
      RC: [''],
      TAC: [''],
      UC: [''],
      AC: [''],
      TC: [''],
      AlC: [''],
      Domainusername: [''],
      disableSelect: true,
      disablevalueSelect: false
    })

    this.firstFormGroup2 = this._formBuilder.group({
      LOI: [''],
      LGP: [''],
      NTGP: [''],
      GUP: [''],
      GAssetP: [''],
      GAuditedP: [''],
      GTP: [''],
      GRP: [''],
      GAlP: [''],
      isShowDivftp: false,
      isShowDivsftp: false,
    })
    this.firstFormGroup3 = this._formBuilder.group({

      Total_Count: [''],
      Count_Percentage: [''],
      Asset_Tolerance_Level: [''],

      Total_User: [''],
      User_Percentage: [''],
      User_Tolerance_Level: [''],

      Total_Audit: [''],
      Audit_Percentage: [''],
      Audit_Tolerance_Level: [''],

      Total_Transfer: [''],
      Transfer_Percentage: [''],
      Transfer_Tolerance_Level: [''],

      Total_Retirment: [''],
      Retirment_Percentage: [''],
      Retirment_Tolerance_Level: [''],

      Total_Assignment: [''],
      Assignment_Percentage: [''],
      Assignment_Tolerance_Level: [''],

      Total_Company: [''],
      Company_Percentage: [''],
      Company_Tolerance_Level: [''],
    })
    this.GetGridData();
  }


  GridData: any[];
  GetGridData() {
    debugger;
    
    
    this.gp.GetAllLicenseDetails(this.GroupId).subscribe(r => {
      debugger;
      this.GridData = [];
      if(r== "Failed")
      {
        this.toastr.warning(this.message.AddGroup, this.message.AssetrakSays);
        this.router.navigateByUrl("h2/f");
      }
      if (!!r) {
        this.GridData = JSON.parse(r);
        console.log('data',this.GridData)
        this.GridData.forEach(element => {
          if (element.Type == '1') {
            element.TypeName = 'Perpetual';
          }
          if (element.Type == '2') {
            element.TypeName = 'Subscriptions';
          }
          if (element.Type == '3') {
            element.TypeName = 'Support';
          }
          // if(element.LicenseLevel== 'G')
          // {
          //   this.LicenseGroup = true;
          // }
          // else{
          //   this.LicenseGroup = false;
          // }
        })
      }
      this.onChangedatasource(this.GridData);
    })
  
  }
  onChangedatasource(value) {
    this.datasource = new MatTableDataSource(value);
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }
  LicenseTermsData: any;
  moduleList : any[]=[];
  AssetDisabled : boolean = true;
  UserDisabled : boolean = true;
  AuditDisabled : boolean = true;
  MovementDisabled : boolean = true;
  RetirementDisabled : boolean = true;
  AssignmentDisabled : boolean = true;
  GetLicenseTermsById(val) {
    debugger;
    var LicenseId = val.LicenseID;
    this.moduleList = val.ModuleNamelist;
    this.AssetDisabled  = true;
    this.UserDisabled  = true;
    this.AuditDisabled  = true;
    this.MovementDisabled  = true;
    this.RetirementDisabled  = true;
    this.AssignmentDisabled  = true;
    this.gp.GetLicenseTermsById(LicenseId).subscribe(r => {
      debugger;
      if (!!r) {
        var LicenseTermsData = JSON.parse(r);
        this.LicenseTermsData = LicenseTermsData[0];
        // this.LicenseTermsData.TotalLocation="0";
        // this.LicenseTermsData.TotalCountToleranceLevel="0";
        // this.LicenseTermsData.TotalUsersToleranceLevel="0";
        // this.LicenseTermsData.AuditedCountToleranceLevel="0";
        // this.LicenseTermsData.TransferedCountToleranceLevel="0";
        // this.LicenseTermsData.RetiredCountToleranceLevel="0";
        // this.LicenseTermsData.AllocatedCountToleranceLevel="0";
        if(val.LicenseLevel=="G")
        {
          this.LicenseGroup= true;
        }
        else
        {
          this.LicenseGroup= false;
        }
        
        this.CompanyDistribution();
      }
    })
  }
  
  changeStatus(flag){

    if(flag == 'Asset'){
      this.AssetDisabled = !this.AssetDisabled;
    }
    if(flag == 'User'){
      this.UserDisabled  = !this.UserDisabled ;
    }
    if(flag == 'Audit'){
      this.AuditDisabled = !this.AuditDisabled;
    }
    if(flag == 'Movement'){
      this.MovementDisabled  = !this.MovementDisabled ;
    }
    if(flag == 'Retirement'){
      this.RetirementDisabled = !this.RetirementDisabled;
    }
    if(flag == 'Assignment'){
      this.AssignmentDisabled = !this.AssignmentDisabled;
    }
    flag = !flag;
  }
  CompanyDistributionData: any[] = [];
  CompanyDistribution() {
    debugger;
    var LicenseID = this.LicenseTermsData.LicenseID;
    var TermID = this.LicenseTermsData.TermID;
    this.gp.GetLicenseCompanyDistributionById(LicenseID, TermID).subscribe(r => {
      debugger;
      if (!!r) {
        this.CompanyDistributionData = [];
        this.CompanyDistributionData = JSON.parse(r);
        this.Company_Distribution_Data.forEach(element => {
          element.companyList = [];
        });
        for (var j = 0; j < this.CompanyDistributionData.length; j++) {
          for (var i = 0; i < this.Company_Distribution_Data.length; i++) {
            debugger;
            if(this.Company_Distribution_Data[i].name == 'Total Asset Count'){
              var aa = {
                CompanyId : this.CompanyDistributionData[j].CompanyId,
                CompanyName : this.CompanyDistributionData[j].CompanyName,
                Count : this.CompanyDistributionData[j].TotalAssetCount
              }
              this.Company_Distribution_Data[i].totalCount = this.LicenseTermsData.TotalAssetCount;
              this.Company_Distribution_Data[i].companyList.push(aa);              
            }
            if(this.Company_Distribution_Data[i].name == 'Total User'){
              var aa = {
                CompanyId : this.CompanyDistributionData[j].CompanyId,
                CompanyName : this.CompanyDistributionData[j].CompanyName,
                Count : this.CompanyDistributionData[j].TotalUsers
              }
              this.Company_Distribution_Data[i].totalCount = this.LicenseTermsData.TotalUsers;
              this.Company_Distribution_Data[i].companyList.push(aa); 
            }
            if(this.Company_Distribution_Data[i].name == 'Total Audit'){
              var aa = {
                CompanyId : this.CompanyDistributionData[j].CompanyId,
                CompanyName : this.CompanyDistributionData[j].CompanyName,
                Count : this.CompanyDistributionData[j].AuditedCount
              }
              this.Company_Distribution_Data[i].totalCount = this.LicenseTermsData.AuditedCount;
              this.Company_Distribution_Data[i].companyList.push(aa); 
            }
            if(this.Company_Distribution_Data[i].name == 'Transfer Licenses'){
              var aa = {
                CompanyId : this.CompanyDistributionData[j].CompanyId,
                CompanyName : this.CompanyDistributionData[j].CompanyName,
                Count : this.CompanyDistributionData[j].TransferCount
              }
              this.Company_Distribution_Data[i].totalCount = this.LicenseTermsData.TransferCount;
              this.Company_Distribution_Data[i].companyList.push(aa); 
            }
            if(this.Company_Distribution_Data[i].name == 'Retirment Licenses'){
              var aa = {
                CompanyId : this.CompanyDistributionData[j].CompanyId,
                CompanyName : this.CompanyDistributionData[j].CompanyName,
                Count : this.CompanyDistributionData[j].RetirementCount
              }
              this.Company_Distribution_Data[i].totalCount = this.LicenseTermsData.RetirementCount;
              this.Company_Distribution_Data[i].companyList.push(aa);
            } 
            if(this.Company_Distribution_Data[i].name == 'Assignment Licenses'){
              var aa = {
                CompanyId : this.CompanyDistributionData[j].CompanyId,
                CompanyName : this.CompanyDistributionData[j].CompanyName,
                Count : this.CompanyDistributionData[j].AllocatedCount
              }
              this.Company_Distribution_Data[i].totalCount = this.LicenseTermsData.AllocatedCount;
              this.Company_Distribution_Data[i].companyList.push(aa); 
            }
          }
        }        
      }
    })
    
  }

  CheckTotalCount(data , val){
    debugger;
    var tcount = parseFloat(data.totalCount);
    var tsum = 0;
    data.companyList.forEach(element => {
      var Count = !!element.Count ? element.Count : 0;
      tsum = tsum + parseFloat(Count);
    });
    debugger;
    if(tsum > tcount){
      val.Count = 0;
      this.toastr.warning('Invalid', this.message.AssetrakSays);
    }
  }
  listofdto=[]
  SubmitCompanyDistribution(){
    for (var i = 0; i < this.Company_Distribution_Data.length; i++) {
      debugger;
      if(this.Company_Distribution_Data[i].name == 'Total Asset Count'){
        this.Company_Distribution_Data[i].companyList.forEach(val=>{          
          this.CompanyDistributionData.find(x=> x.CompanyId == val.CompanyId).TotalAssetCount = val.Count;
        })
      }
      if(this.Company_Distribution_Data[i].name == 'Total User'){
        this.Company_Distribution_Data[i].companyList.forEach(val=>{          
          this.CompanyDistributionData.find(x=> x.CompanyId == val.CompanyId).TotalUsers = val.Count;
        })
      }
      if(this.Company_Distribution_Data[i].name == 'Total Audit'){
        this.Company_Distribution_Data[i].companyList.forEach(val=>{          
          this.CompanyDistributionData.find(x=> x.CompanyId == val.CompanyId).AuditedCount = val.Count;
        })
      }
      if(this.Company_Distribution_Data[i].name == 'Transfer Licenses'){
        this.Company_Distribution_Data[i].companyList.forEach(val=>{        
          this.CompanyDistributionData.find(x=> x.CompanyId == val.CompanyId).TransferCount = val.Count;
        })
      }
      if(this.Company_Distribution_Data[i].name == 'Retirment Licenses'){
        this.Company_Distribution_Data[i].companyList.forEach(val=>{          
          this.CompanyDistributionData.find(x=> x.CompanyId == val.CompanyId).RetirementCount = val.Count;
        })
      }
      if(this.Company_Distribution_Data[i].name == 'Assignment Licenses'){
        this.Company_Distribution_Data[i].companyList.forEach(val=>{         
          this.CompanyDistributionData.find(x=> x.CompanyId == val.CompanyId).AllocatedCount = val.Count;
        })
      }      
      debugger;
    }

    this.gp.InsertIntoCompanyDistribution(this.Company_Distribution_Data).subscribe(r => {
      debugger;
      if (!!r && r == 'Success') {
        this.toastr.success('Company Distribution Data added successfully.', this.message.AssetrakSays);
      }
      else if(!!r && r == 'update'){
        this.toastr.success('Company Distribution Data updated successfully.', this.message.AssetrakSays);
      }
      else{
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
    })
    debugger;
  }
  SubmitLicenseTerms() {
    debugger;

    var data = {
      TermID: this.LicenseTermsData.TermID,
      LicenseID: this.LicenseTermsData.LicenseID,
      TotalAssetCount: this.LicenseTermsData.TotalAssetCount,
      TotalCountAlertPercentage: this.LicenseTermsData.TotalCountAlertPercentage,
      TotalUsers: this.LicenseTermsData.TotalUsers,
      TotalUsersAlertPercentage: this.LicenseTermsData.TotalUsersAlertPercentage,
      AuditedCount: this.LicenseTermsData.AuditedCount,
      AuditedCountAlertPercentage: this.LicenseTermsData.AuditedCountAlertPercentage,
      TransferCount: this.LicenseTermsData.TransferCount,
      TransferedCountAlertPercentage: this.LicenseTermsData.TransferedCountAlertPercentage,
      RetirementCount: this.LicenseTermsData.RetirementCount,
      RetiredCountAlertPercentage: this.LicenseTermsData.RetiredCountAlertPercentage,
      AllocatedCount: this.LicenseTermsData.AllocatedCount,
      AllocatedCountAlertPercentage: this.LicenseTermsData.AllocatedCountAlertPercentage,
      TotalCompanies: this.LicenseTermsData.TotalCompanies,
      TotalLocation: this.LicenseTermsData.TotalLocation,
      TotalCountToleranceLevel:  this.LicenseTermsData.TotalCountToleranceLevel,
      TotalUsersToleranceLevel:  this.LicenseTermsData.TotalUsersToleranceLevel,
      AuditedCountToleranceLevel:  this.LicenseTermsData.AuditedCountToleranceLevel,
      TransferedCountToleranceLevel:  this.LicenseTermsData.TransferedCountToleranceLevel,
      RetiredCountToleranceLevel:  this.LicenseTermsData.RetiredCountToleranceLevel,
      AllocatedCountToleranceLevel:  this.LicenseTermsData.AllocatedCountToleranceLevel,
      CompanyDistribution: "0",
      LastModifiedBy: "1",
      GroupId :this.GroupId
    }

    this.gp.InsertIntoLicenseTerm(data).subscribe(r => {
      debugger;
      if (!!r && r == 'Success') {
        this.toastr.success('License Term added successfully.', this.message.AssetrakSays);
        //this.GetLicenseTerm(this.LicenseTermsData.LicenseID);
      }
      else if(!!r && r == 'update'){
        this.toastr.success('License Term updated successfully.', this.message.AssetrakSays);
        //this.CompanyDistribution();
        //this.GetLicenseTerm(this.LicenseTermsData.LicenseID);
      }
      else{
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
    })
  }

  openPopup() {
    let configdata = {
      GroupId: this.GroupId, 
    }
    let dialogRef: MatDialogRef<any> = this.dialog.open(AddLicenseDialogComponent, {
      width: 'auto',
      data: { title: "", configdata: configdata }
    })
    dialogRef.afterClosed().subscribe(result => {
      debugger;
      if (!!result) {
        this.gp.InsertIntoLicenseTable(result).subscribe(r => {
          debugger;
          if (!!r && r == 'Success') {
            this.toastr.success('License created sucessfully.', this.message.AssetrakSays);
          }
          else {
            this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
          }
          this.GetGridData();
        })
      }
    })
  }
  applyFilter(filterValue: string) {
    this.datasource.filter = filterValue.trim().toLowerCase();
  }
  getselectedIds : any[]=[];
  isSelected(row) {
    debugger;
   
    this.selection.toggle(row)
    this.displaybtn = !this.displaybtn;
    // this.numSelected = this.selection.selected.length;
     var idx = this.getselectedIds.indexOf(row.LicenseID);
     if (idx > -1) {
       this.getselectedIds.splice(idx, 1);
       //this.selectedQtySplitData.splice(idx, 1);
     }
    else {
      this.getselectedIds.push(row.LicenseID);
     //this.selectedQtySplitData.push(row);
     }
    // //==================
    // if (this.selectedQtySplitData.length == 1) {    
    //   if ((parseInt(this.selectedQtySplitData[0].AcquisitionCost) == 0 && parseInt(this.selectedQtySplitData[0].WDV) == 0) || (this.selectedQtySplitData[0].AcquisitionCost == "0" && this.selectedQtySplitData[0].WDV == "0")) {
    //     this.btnSplitAsset = false;
    //   }
    //   else if (this.selectedQtySplitData[0].isDifferentAssetIdsInGroupFlag == false && (this.selectedQtySplitData[0].MergeId2 == 0 || this.selectedQtySplitData[0].MergeId2 == null)) {
    //     this.btnSplitAsset = true;
    //   }
    // }
    // //========================
    // var flag = 0;
    // if (this.numSelected > 0) {
    //   this.btnGroupAsset = true;
    //   this.selection.selected.forEach(row => {
    //     if ((row.Quantity == 0 || row.Quantity == null) || parseInt(row.Quantity) <= 1) {
    //       flag = 1;
    //     }
    //     // for group asset
    //     if ((row.MergeId == 0 || row.MergeId == null) && (row.SplitId == 0 || row.SplitId == null) && (row.MergeId2 == 0 || row.MergeId2 == null) && (row.BlockOfAsset == this.selectedQtySplitData[0].BlockOfAsset)) { }
    //     else {
    //       this.btnGroupAsset = false;
    //     }
    //   })
    
    
  }
  openEditPopup()
  {
    debugger;
    let configdata = {
      GroupId: this.GroupId,
      getselectedIds : this.getselectedIds,
    }
    let dialogRef: MatDialogRef<any> = this.dialog.open(EditLicenseDialogComponent, {
      width: 'auto',
      data: { title: "", configdata: configdata }
    })
    dialogRef.afterClosed().subscribe(result => {
      debugger;
      if (!!result) {
        this.gp.InsertIntoLicenseTable(result).subscribe(r => {
          debugger;
          if (!!r && r == 'Updated Successfully') {
            this.toastr.success('License updated sucessfully.', this.message.AssetrakSays);
          }
          else {
            this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
          }
          this.GetGridData();
          this.displaybtn = !this.displaybtn;
        })
      }
    })
  }

  changeTotalCountToleranceLevel()
  {
    this.LicenseTermsData.TotalCountToleranceLevel = "10%";
  }
  changeTotalUsersToleranceLevel(){
  this.LicenseTermsData.TotalUsersToleranceLevel="10%";
  }
  changeAuditedCountToleranceLevel(){
  this.LicenseTermsData.AuditedCountToleranceLevel="10%";
  }
  changeTransferedCountToleranceLevel(){
  this.LicenseTermsData.TransferedCountToleranceLevel="10%";
  }
  changeRetiredCountToleranceLevel(){
  this.LicenseTermsData.RetiredCountToleranceLevel="10%";
  }
  changeAllocatedCountToleranceLevel(){
  this.LicenseTermsData.AllocatedCountToleranceLevel="10%";
  }


  GetLicenseTerm(val)
  {
    var LicenseId = val;
    this.gp.GetLicenseTermsById(LicenseId).subscribe(r => {
      debugger;
      if (!!r) {
        var LicenseTermsData = JSON.parse(r);
        this.LicenseTermsData = LicenseTermsData[0];
        // this.LicenseTermsData.TotalLocation="0";
        // this.LicenseTermsData.TotalCountToleranceLevel="0";
        // this.LicenseTermsData.TotalUsersToleranceLevel="0";
        // this.LicenseTermsData.AuditedCountToleranceLevel="0";
        // this.LicenseTermsData.TransferedCountToleranceLevel="0";
        // this.LicenseTermsData.RetiredCountToleranceLevel="0";
        // this.LicenseTermsData.AllocatedCountToleranceLevel="0";
        if(val.LicenseLevel=="G")
        {
          this.LicenseGroup= true;
        }
        else
        {
          this.LicenseGroup= false;
        }
        
        this.CompanyDistribution();
      }
    })
  
  }
}
