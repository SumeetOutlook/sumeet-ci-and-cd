import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { CredentialService } from 'app/components/services/CredentialService';
import { ToastrService } from 'ngx-toastr';
import * as headers from '../../../../assets/Headers.json';
import * as resource from '../../../../assets/Resource.json';
import { GroupService } from 'app/components/services/GroupService';
import { UserRoleService } from 'app/components/services/UserRoleService';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AddLicenseDialogComponent } from '../License-Managment/dialog/add-license-dialog/add-license-dialog.component';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { UploadFileDialogComponent } from '../sso-approval-configuration/upload-file-dialog/upload-file-dialog.component';
import { AssetCategoryService } from 'app/components/services/AssetCategoryService';

export interface type {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-sso-approval-configuration',
  templateUrl: './sso-approval-configuration.component.html',
  styleUrls: ['./sso-approval-configuration.component.scss']
})
export class SSOApprovalConfigurationComponent implements OnInit {
  showSapDropDown: Boolean = false;
  header: any ;
  isShowDivsftp: boolean;
  isShowDivftp: boolean;
  message: any = (resource as any).default;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  title: "User Credential";
  Submitname: string;
  Submitemail: string;
  isChecked = true;
  checked: boolean;
  checkval: boolean;
  outag: boolean;
  submitted: boolean = false;
  disablevalueSelect: boolean = false;
  ActivedicId: any;
  firstFormGroup: FormGroup;
  showPingFed: Boolean = false
  showAdfs: Boolean = false
  showDisabled: Boolean = false
  showPing: Boolean = false
  firstFormGroup3: FormGroup;
  showOthersTransfer: Boolean = false;
  showWDV: Boolean = false;
  showWDVTransfer: Boolean = false;
  get f4() { return this.firstFormGroup3.controls; }
  firstFormGroup1: FormGroup; //EmailCredential
  get f2() { return this.firstFormGroup1.controls; };
  outBoundVal: any
  RetirementTxnCtrl: any;
  TransferTxnCtrl: any;
  showOthers: Boolean = true;
  portnumber: any;
  IsSSO: Boolean = true;
  firstFormGroup2: FormGroup;
  get f3() { return this.firstFormGroup2.controls; }
  EmailCredentialId: any;
  ssoEnable: Boolean = false;
  SellingAmtCheckCtrl: any;
  tranferdataSource: any = new MatTableDataSource<any>();
  retiredataSource: any = new MatTableDataSource<any>();
  outBoundDataSource: any = new MatTableDataSource<any>();
  othersDataSource: any = new MatTableDataSource<any>();
  showOthersRetire: Boolean = false;
  displayedColumns: string[] = ['displayName', 'defaultValue', 'isActive', 'isActive1'];
  displayedHeaders: string[] = ['Configuration', 'Display Name', 'Default Value', 'isActive', 'isActive1'];
  displayedColumnsOutBound: string[] = ['displayName', 'defaultValue', 'isActive'];
  displayedHeadersOutBound: string[] = ['Display Name', 'Default Value', 'isActive'];
  displayedColumnsOthers: string[] = ['displayName', 'defaultValue', 'isActive'];
  displayedHeadersOthers: string[] = ['Display Name', 'Default Value', 'isActive'];
  Types: type[] = [
    { value: 'Secure', viewValue: 'Secure' },
    { value: 'SecureSocketsLayer', viewValue: 'SecureSocketsLayer' },
    { value: 'Anonymous', viewValue: 'Anonymous' }
  ];

  TypeData: any[] = [
    { Type: '1', Name: "PING" },
    { Type: '2', Name: "ADFS-LOCAL" },
    { Type: '3', Name: "OKTA" },
    { Type: '4', Name: "ONE LOGIN" },
    { Type: '5', Name: "AZURE AD" },
    /*	{ Type: '6', Name: "PingFed" },*/
  ]

  othersData: any[] = [
    { displayName: 'Tagging Approval', defaultValue: '', isActive: "PING" },
    { displayName: 'Asset Approval', defaultValue: '', isActive: "ADFS-LOCAL" },
  ]
  constructor(
    private _formBuilder: FormBuilder,
    public credentialservice: CredentialService,
    public gp: GroupService,
    public toastr: ToastrService,
    private loader: AppLoaderService,
    public dialog: MatDialog,
    public urs: UserRoleService,
    private storage: ManagerService,
    private jwtAuth:JwtAuthService,
    public categoryservice: AssetCategoryService
  ) 
  {
    this.header = this.jwtAuth.getHeaders()
   }
  groupId: any;
  unamePattern: "/^[a-zA-Z0-9 :_\\\/|.-]+$/";
  ngOnInit() {

    this.groupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.firstFormGroup1 = this._formBuilder.group({
      Sendertitle: ['', Validators.required],
      emailsender: ['', Validators.required],
      Epassword: ['', Validators.required],
      smtpemail: ['', Validators.required],
      smtppassword: ['', Validators.required],
      emailhost: ['', Validators.required],
      Eportnumber: ['', Validators.required],
      IsSSL: true,
      IsHTMLBody: true,
      UserCredentials: true,
      Withoutpassword: true,
      WithoutSmtp: true,

    })
    this.firstFormGroup2 = this._formBuilder.group({
      Hostname: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      portnumber: ['', Validators.required],
      Operationtypeftp: ['', Validators.required],
      Operationtypesftp: ['', Validators.required],
      isShowDivftp: false,
      isShowDivsftp: false,
    })
    this.firstFormGroup3 = this._formBuilder.group({
      IsSSO: [false, Validators.required],
      SSOType: ['', Validators.required],
      IsLocal: [''],
      SSOPath: [''],
      URL: [''],
      RedirectURL: [''],
      MobileRedirectURL: [''],
      Issuer: [''],
      ClientId: [''],
      ClientSecrate: [''],
      DiscoveryUrl: [''],
      AuthorizationEndpoint: [''],
      TokenEndpoint: [''],
      UserEndpoint: ['']
    })
    debugger;
    this.GetSSODetails();
    this.GetConfigurationData();
    this.EmailCredentialGetAllData();
  }

  SaveFTP() {
    
    // console.log(this.firstFormGroup2.value);
    this.FtpInsertData();
  }

  onclicksftp() {
    
    this.portnumber = 22;
    this.isShowDivftp = false;
    this.isShowDivsftp = true;

    // if(outag.checked == true)
    // {
    //   alert("hi");
    //   this.firstFormGroup.controls['isShowDivftp'].disable();
    // }

  }

  FtpInsertData() {
    var Hostname = this.firstFormGroup2.value.Hostname;
    var username = this.firstFormGroup2.value.username;
    var password = this.firstFormGroup2.value.password;
    var portnumber = this.firstFormGroup2.value.portnumber;






    var Operationtypeftp;
    if (this.isShowDivftp) {
      Operationtypeftp = this.firstFormGroup2.value.Operationtypeftp;
    }
    else {
      Operationtypeftp = "";

    }

    var Operationtypesftp;
    if (this.isShowDivsftp) {
      var Operationtypesftp = this.firstFormGroup2.value.Operationtypesftp;
    }
    else {
      Operationtypesftp = "";
    }


    var Ftpdata = {
      HostName: Hostname,
      UserName: username,
      Password: password,
      PortNumber: portnumber,
      OperationType: Operationtypeftp,
      Temp1: Operationtypesftp,
      IsFTPorSFTP: this.isShowDivftp,
      FTPType: this.isShowDivsftp ? "true" : "false",



    }
    // FTPfor

    
    this.credentialservice.FtpInsertData(Ftpdata).subscribe(r => {
      
      this.toastr.success(this.message.FTP, this.message.AssetrakSays);
    })

  }

  SSOData: any;
  GetSSODetails() {
    this.gp.GetSSODetails().subscribe(response => {
      
      if (!!response) {
        this.SSOData = JSON.parse(response);
        this.ssoEnable = this.SSOData.IsSSO;
        this.firstFormGroup3.get('IsSSO').setValue(this.SSOData.IsSSO);
        this.TypeData.forEach(element => {
          if (element.Type == this.SSOData.SSOType) {
            this.firstFormGroup3.get('SSOType').setValue(element);
          }
        })

        if (this.SSOData.SSOType == 3 || this.SSOData.SSOType == 1 || this.SSOData.SSOType == 4 || this.SSOData.SSOType == 5) {
          this.showPing = true;
          this.firstFormGroup3.get('RedirectURL').setValue(this.SSOData.RedirectURL);
          this.firstFormGroup3.get('Issuer').setValue(this.SSOData.Issuer);
          this.firstFormGroup3.get('ClientId').setValue(this.SSOData.ClientId);
          this.firstFormGroup3.get('ClientSecrate').setValue(this.SSOData.ClientSecrate);
          this.firstFormGroup3.get('DiscoveryUrl').setValue(this.SSOData.DiscoveryUrl);
          this.firstFormGroup3.get('AuthorizationEndpoint').setValue(this.SSOData.AuthorizationEndpoint);
          this.firstFormGroup3.get('TokenEndpoint').setValue(this.SSOData.TokenEndpoint);
          this.firstFormGroup3.get('UserEndpoint').setValue(this.SSOData.UserEndpoint);
        }
        else if (this.SSOData.SSOType == 2) {
          this.showAdfs = true;
          this.firstFormGroup3.get('IsLocal').setValue(this.SSOData.IsLocal);
          this.firstFormGroup3.get('SSOPath').setValue(this.SSOData.SSOPath);
          this.firstFormGroup3.get('URL').setValue(this.SSOData.URL);
        }
        else if (this.SSOData.SSOType == 6) {
          this.showPingFed = true;
        }

      }
    })
  }
  bindData: any[] = [];
  tranferdata: any[] = [];
  tranferOtherdata: any[] = [];
  retiredata: any[] = [];
  retireOtherdata: any[] = [];
  outBoundData: any[] = [];
  GetConfigurationData() {
    
    this.gp.GetConfigDetailsByGroupId(this.groupId).subscribe(response => {
      
      this.bindData = [];
      this.tranferdata = [];
      this.tranferOtherdata= [];
      this.retiredata = [];
      this.retireOtherdata = [];
      this.outBoundData = [];
      this.othersData = [];
      if (!!response) {
        this.bindData = JSON.parse(response);
        console.log(this.bindData);
      }
      if (this.bindData.length > 0) {
        this.bindData.forEach(element => {
          if (element.Custome2 == 'T') {            
            if(this.tranferdata.length < 4){
              this.tranferdata.push(element);
            }
            else{              
              this.tranferOtherdata.push(element);
              this.TransferTxnCtrl = this.tranferOtherdata[0].SelectedValue;
            }
          }
          if (element.Custome2 == 'R') {            
            if(this.retiredata.length < 4){
              this.retiredata.push(element);
            }
            else{
              this.retireOtherdata.push(element);
              this.RetirementTxnCtrl = this.retireOtherdata[0].SelectedValue;
            }
          }
          if (element.Custome2 == 'SAP') {
            if(element.ConfigurationMasterId == '49' &&  element.IsActive == true)
            {
              this.showSapDropDown = true;
              this.outBoundVal = 'sap';
            }
            this.outBoundData.push(element);
          }
          if (element.Custome2 == 'O') {
            if(element.ConfigurationMasterId=='63')
            {
              element.SelectedValue=element.Custome1;
            }
            else if(element.ConfigurationMasterId=='64')
            {
              element.SelectedValue=element.Custome1;
            }
            this.othersData.push(element);
          }
          
          if(element.configurationName == 'Is sellingAmt On Wdv Or Cost?'){
              
              this.SellingAmtCheckCtrl = element.SelectedValue == 1 ? "1" : "0" ;
          }
          if(element.configurationName == 'Series Printing'){
            
             element.SelectedValue = element.SelectedValue.toString(); 
          }
        });
      }
      this.onChangedatasource();

    });
  }
  onChangedatasource() {
    this.tranferdataSource = new MatTableDataSource(this.tranferdata);
    this.retiredataSource = new MatTableDataSource(this.retiredata);
    this.outBoundDataSource = new MatTableDataSource(this.outBoundData);
    this.othersDataSource = new MatTableDataSource(this.othersData);
  }
  changeToggle() {
    this.ssoEnable = !this.ssoEnable;
    this.firstFormGroup3.get('IsSSO').setValue(this.ssoEnable);
    if (this.ssoEnable == false) {
      this.SubmitSSO();
    }
  }

  onclickftp() {
    this.portnumber = 21;
    
    this.isShowDivftp = true;
    this.isShowDivsftp = false;
    // if(outag.checked == true)
    // {
    //   alert("hi");
    //   this.firstFormGroup.controls['isShowDivsftp'].disable();
    // }
  }

 
  changedisable(checkval) {
    

    if (checkval.checked == true) {
      this.disablevalueSelect = false;
      //this.firstFormGroup.controls['AuthenticationType'].enable();
    }
    else {
      this.disablevalueSelect = true;
      //this.firstFormGroup.controls['AuthenticationType'].disable();
    }
  }
  changeDisable(checkval) {

    
    if (checkval.checked == true) {

      this.firstFormGroup1.controls['Epassword'].enable();
      this.firstFormGroup1.controls['smtppassword'].enable();


    }
    else {
      this.firstFormGroup1.controls['Epassword'].disable();
      this.firstFormGroup1.controls['smtppassword'].disable();
    }

  }
  Saveemail() {
    
    // console.log(this.firstFormGroup1.value);
    this.EmailCredentialInsertData();
  }

  EmailCredentialInsertData() {
    
    var Withoutpassword = this.firstFormGroup1.value.Withoutpassword;
    var Epassword;
    var smtppassword;
    if (Withoutpassword) {
      
      var Epassword = this.firstFormGroup1.value.Epassword;
      var smtppassword = this.firstFormGroup1.value.smtppassword;
    }
    else {
      Epassword = "";
      smtppassword = "";
    }

    var WithoutSmtp = this.firstFormGroup1.value.WithoutSmtp;
    var smtpemail;
    var smtppassword;
    if (WithoutSmtp) {
      
      var smtpemail = this.firstFormGroup1.value.smtpemail;
      var smtppassword = this.firstFormGroup1.value.smtppassword;
    }
    else {
      smtpemail = "";
      smtppassword = "";
    }

    var Sendertitle = this.firstFormGroup1.value.Sendertitle;
    var emailsender = this.firstFormGroup1.value.emailsender;
    var emailhost = this.firstFormGroup1.value.emailhost;
    var Eportnumber = this.firstFormGroup1.value.Eportnumber;
    var IsSSL = this.firstFormGroup1.value.IsSSL;
    var IsHTMLBody = this.firstFormGroup1.value.IsHTMLBody;
    var UserCredentials = this.firstFormGroup1.value.UserCredentials;

    var emailCredentialdata = {
      SenderTitle: Sendertitle,
      Id: this.EmailCredentialId,
      EmailHost: emailhost,
      EmailSender: emailsender,
      Password: Epassword,
      SMTPUserName: smtpemail,
      SMTPPassword: smtppassword,
      PortNumber: Eportnumber,
      // Temp1:IsSSL,
      // Temp2:IsHTMLBody,
      // UserCredentials, 
      // Temp3:Withoutpassword,
      // Temp4:WithoutSmtp,
      isusercredential: UserCredentials,
      isssl: IsSSL,
      ishtmlbody: IsHTMLBody,
      iswithoutpassword: Withoutpassword,
      iswithoutsmtp: WithoutSmtp,

    }
    if (this.Submitemail == "Save") {
      
      // this.credentialservice.EmailCredentialInsertData(emailCredentialdata).subscribe(result => {
      //   
      //   this.EmailCredentialGetAllData();
      //   this.toastr.success(this.message.EmailcredentialInsert, this.message.AssetrakSays);
      // })
    }
    else {
      
      // this.credentialservice.EmailCredentialUpdateData(emailCredentialdata).subscribe(result => {
      //   
      //   this.EmailCredentialGetAllData();
      //   this.toastr.success(this.message.EmailcredentialUpdate, this.message.AssetrakSays);
      // })
    }

  }

  EmailCredentialGetAllData() {
    
    this.credentialservice.EmailCredentialGetAllData().subscribe(result => {
      
      if (result.length > 0) {
        this.Submitemail = "Update";
        this.EmailCredentialId = result[0].Id;
        this.firstFormGroup1.controls['Sendertitle'].setValue(result[0].SenderTitle)
        this.firstFormGroup1.controls['emailhost'].setValue(result[0].EmailHost)
        this.firstFormGroup1.controls['emailsender'].setValue(result[0].EmailSender)

        this.firstFormGroup1.controls['smtpemail'].setValue(result[0].SMTPUserName)
        this.firstFormGroup1.controls['smtppassword'].setValue(result[0].SMTPPassword)
        this.firstFormGroup1.controls['Eportnumber'].setValue(result[0].PortNumber)
        // this.firstFormGroup1.controls['IsSSL'].setValue(result[0].Temp1)
        // this.firstFormGroup1.controls['IsHTMLBody'].setValue(result[0].Temp2)
        // this.firstFormGroup1.controls['UserCredentials'].setValue(result[0].UserCredentials)
        this.firstFormGroup1.controls['IsSSL'].setValue(result[0].IsSSL)
        this.firstFormGroup1.controls['IsHTMLBody'].setValue(result[0].IsHtmlBody)
        this.firstFormGroup1.controls['UserCredentials'].setValue(result[0].IsUserCredential)

        //if(result[0].Temp3=="true")
        if (result[0].IsWithoutPassword == true) {
          this.firstFormGroup1.controls['Withoutpassword'].setValue(true);
          this.firstFormGroup1.controls['Epassword'].setValue(result[0].Password)
          this.firstFormGroup1.controls['smtppassword'].setValue(result[0].SMTPPassword)
        }
        else {
          this.firstFormGroup1.controls['Withoutpassword'].setValue(false)
          this.firstFormGroup1.controls['Epassword'].disable();
          this.firstFormGroup1.controls['smtppassword'].disable();
        }

        if (result[0].IsWithoutSMTP == true) {
          this.firstFormGroup1.controls['WithoutSmtp'].setValue(true)
          this.firstFormGroup1.controls['smtpemail'].setValue(result[0].SMTPUserName)
          this.firstFormGroup1.controls['smtppassword'].setValue(result[0].SMTPPassword)
        }
        else {
          this.firstFormGroup1.controls['WithoutSmtp'].setValue(false)
          this.firstFormGroup1.controls['smtpemail'].disable();
          this.firstFormGroup1.controls['smtppassword'].disable();
        }
      }
      else {
        //this.toastr.success(this.message.EmailCredential, this.message.AssetrakSays);
        this.Submitemail = "Save";
      }
    });
  }


  changeDisable1(checkval) {

    if (checkval.checked == true) {
      this.firstFormGroup1.controls['smtpemail'].enable();
      this.firstFormGroup1.controls['smtppassword'].enable();
    }
    else {
      this.firstFormGroup1.controls['smtpemail'].disable();
      this.firstFormGroup1.controls['smtppassword'].disable();
    }

  }
  markAllFalse() {
    this.showPing = false;
    this.showAdfs = false;
    this.showPingFed = false;

    this.firstFormGroup3.get('SSOPath').setValue("");
    this.firstFormGroup3.get('URL').setValue("");
    this.firstFormGroup3.get('RedirectURL').setValue("");
    this.firstFormGroup3.get('Issuer').setValue("");
    this.firstFormGroup3.get('ClientId').setValue("");
    this.firstFormGroup3.get('ClientSecrate').setValue("");
    this.firstFormGroup3.get('DiscoveryUrl').setValue("");
    this.firstFormGroup3.get('AuthorizationEndpoint').setValue("");
    this.firstFormGroup3.get('TokenEndpoint').setValue("");
    this.firstFormGroup3.get('UserEndpoint').setValue("");

    this.firstFormGroup3.get('IsLocal').clearValidators();
    this.firstFormGroup3.get('SSOPath').clearValidators();
    this.firstFormGroup3.get('URL').clearValidators();
    this.firstFormGroup3.get('RedirectURL').clearValidators();
    this.firstFormGroup3.get('Issuer').clearValidators();
    this.firstFormGroup3.get('ClientId').clearValidators();
    this.firstFormGroup3.get('ClientSecrate').clearValidators();
    this.firstFormGroup3.get('DiscoveryUrl').clearValidators();
    this.firstFormGroup3.get('AuthorizationEndpoint').clearValidators();
    this.firstFormGroup3.get('TokenEndpoint').clearValidators();
    this.firstFormGroup3.get('UserEndpoint').clearValidators();
  }

  showOtherFields(sso) {
    
    this.markAllFalse();
    if (sso.Type == 3 || sso.Type == 1 || sso.Type == 4 || sso.Type == 5) {
      this.showPing = true;
      this.firstFormGroup3.get('RedirectURL').setValidators([Validators.required]);
      this.firstFormGroup3.get('Issuer').setValidators([Validators.required]);
      this.firstFormGroup3.get('ClientId').setValidators([Validators.required]);
      this.firstFormGroup3.get('ClientSecrate').setValidators([Validators.required]);
      this.firstFormGroup3.get('DiscoveryUrl').setValidators([Validators.required]);
      this.firstFormGroup3.get('AuthorizationEndpoint').setValidators([Validators.required]);
      this.firstFormGroup3.get('TokenEndpoint').setValidators([Validators.required]);
      this.firstFormGroup3.get('UserEndpoint').setValidators([Validators.required]);
      this.firstFormGroup3.get('IsLocal').setValue(false);
    }
    else if (sso.Type == 2) {
      this.showAdfs = true;
      this.firstFormGroup3.get('IsLocal').setValidators([Validators.required]);
      this.firstFormGroup3.get('IsLocal').setValue(true);
      this.firstFormGroup3.get('SSOPath').setValidators([Validators.required]);
      this.firstFormGroup3.get('URL').setValidators([Validators.required]);
    }
    else if (sso.Type == 6) {
      this.showPingFed = true;
    }
  }
  
  Configurationdto: any[] = [];
  ChangeApproval(element) {
    if(element.ConfigurationMasterId == '2')
    {
      element.IsActive = true;
    }
    else{
      element.IsActive = !element.IsActive;  
    }
   //element.IsActive = !element.IsActive;    
    // if (element.SelectedValue== 0 ) {
    //   element.SelectedValue = 1;
    // }
    // else {
    //   element.SelectedValue = 0;
    // }
    this.SubmitConfiguration(element);
  }
  ChangeOtherApproval(val , idx){
    
    var index = parseInt(idx) + 1;
    if(val == 'Retirement'){
      this.retireOtherdata[index].IsActive = !this.retireOtherdata[index].IsActive;
      var element = this.retireOtherdata[index];
      element.IsActive = this.retireOtherdata[index].IsActive;
    }
    if(val == 'Transfer'){
      this.tranferOtherdata[index].IsActive = !this.tranferOtherdata[index].IsActive;
      var element = this.tranferOtherdata[index];
      element.IsActive = this.tranferOtherdata[index].IsActive;
    }
    this.SubmitConfiguration(element);
  }

  SellingAmtCheck(){
    
    this.bindData.forEach(element => {
      if(element.configurationName == 'Is sellingAmt On Wdv Or Cost?'){
        
        element.SelectedValue = this.SellingAmtCheckCtrl;
        element.IsActive =true;
        this.SubmitConfiguration(element);
      }
    })
  }
  uploadbtn: boolean=true;
  // Upload Category Dialog
  SessionGroupId: any;
  SessionRegionId: any;
  SessionCompanyId: any;
  
  openUploadAssetCategory(): void {
     debugger;
    const dialogconfigcom1 = new MatDialogConfig();
    dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = '50%';
    const modalService = this.dialog.open(UploadFileDialogComponent,dialogconfigcom1);
    modalService.afterClosed().subscribe((res) => {
      if (res) {
        this.loader.open();
        var uploadedFileInfo = {
          FileName: res,
           GroupID: this.SessionGroupId,
           RegionId: this.SessionRegionId,
           CompanyID: this.SessionCompanyId
        }
        
          this.loader.close();
            // if(r[0] == "Success")
            // {
            //   this.toastr.success(this.message.TypeOfAssetUpload, this.message.AssetrakSays);
            // } 
            // else if(r[0] == "Incorrect File template")
            // {
            //   this.toastr.error(this.message.FileFormatIncorrect, this.message.AssetrakSays);
            // }
            // else if (r[0] != null) {
            //   var msg = r[0].replaceAll('Asset Type', this.header.AssetCategory); 
            //   this.toastr.warning(msg, this.message.AssetrakSays);
            // }          
            // else if(r[0] == null)
            // {
            //   this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
            // }
            //this.GetAllCategory();
        // })
      }
    });
 }
  SubmitSSO() {
    
    var data = {
      IsSSO: this.firstFormGroup3.get('IsSSO').value,
      IsLocal: !!this.firstFormGroup3.get('IsLocal').value ? this.firstFormGroup3.get('IsLocal').value : false,
      SSOType: this.firstFormGroup3.get('SSOType').value.Type,
      SSOName: this.firstFormGroup3.get('SSOType').value.Name,
      SSOPath: this.firstFormGroup3.get('SSOPath').value,
      URL: this.firstFormGroup3.get('URL').value,
      RedirectURL: this.firstFormGroup3.get('RedirectURL').value,
      Issuer: this.firstFormGroup3.get('Issuer').value,
      ClientId: this.firstFormGroup3.get('ClientId').value,
      ClientSecrate: this.firstFormGroup3.get('ClientSecrate').value,
      DiscoveryUrl: this.firstFormGroup3.get('DiscoveryUrl').value,
      AuthorizationEndpoint: this.firstFormGroup3.get('AuthorizationEndpoint').value,
      TokenEndpoint: this.firstFormGroup3.get('TokenEndpoint').value,
      UserEndpoint: this.firstFormGroup3.get('UserEndpoint').value
    }

    this.urs.InsertSSOCredentials(data).subscribe(response => {
      
      if (!!response) {
        this.toastr.success('SSO Details updated successfully.', this.message.AssetrakSays);
      }
      else {
        this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      }
    })
  }

  RetirementTxn(){
    
    var val = !!this.RetirementTxnCtrl ? this.RetirementTxnCtrl : 0;
    
    var element = {
      ConfigurationMasterId : this.retireOtherdata[0].ConfigurationMasterId,
      SelectedValue : val,
      IsActive : true
    }
    this.SubmitConfiguration(element);
    
  }
  TransferTxn(){
    
    var val = !!this.TransferTxnCtrl ? this.TransferTxnCtrl : 0;
    var element = {
      ConfigurationMasterId : this.tranferOtherdata[0].ConfigurationMasterId,
      SelectedValue : this.TransferTxnCtrl,
      IsActive : true
    }
    this.SubmitConfiguration(element);   
  }
  aa:any=[];
  SubmitConfiguration(element) {
    
    this.loader.open();
    this.Configurationdto = [];
    if(element.ConfigurationMasterId=="49" && element.IsActive== true)
    {
      this.aa = {
        ConfigurationId: element.ConfigurationMasterId,
        //SelectedValue: element.SelectedValue,
        IsActive: element.IsActive, 
        custome1: element.SelectedValue
      }
      this.Configurationdto.push(this.aa);
    }
    else
    {
      this.aa = {
        ConfigurationId: element.ConfigurationMasterId,
        //SelectedValue: element.SelectedValue,
        IsActive: element.IsActive, 
        custome1: element.SelectedValue
      }
      this.Configurationdto.push(this.aa);
    }

    if( element.ConfigurationMasterId == '63' && element.IsActive== true)
    {
       this.aa = {
        ConfigurationId: element.ConfigurationMasterId,
        //SelectedValue: element.SelectedValue,
        IsActive: element.IsActive,
        custome1: element.SelectedValue
      }
      this.Configurationdto.push(this.aa);
    }
    else if(element.ConfigurationMasterId == '64' && element.IsActive== true)
  {
    this.aa = {
      ConfigurationId: element.ConfigurationMasterId,
      //SelectedValue: element.SelectedValue,
      IsActive: element.IsActive,
      custome1: element.SelectedValue
    }
    this.Configurationdto.push(this.aa);
  }
   
    else{
       this.aa = {
        ConfigurationId: element.ConfigurationMasterId,
        SelectedValue: element.SelectedValue,
        IsActive: element.IsActive
        //Custome1: element.SelectedValue
      }
      this.Configurationdto.push(this.aa);
    var aa = {
      ConfigurationId: element.ConfigurationMasterId,
      SelectedValue: element.SelectedValue,
      IsActive: element.IsActive
    }
    this.Configurationdto.push(aa);
    
    if(element.ConfigurationMasterId == '35' && element.IsActive== true)
    { 
      this.Configurationdto.forEach(x=> {
        debugger;
        if(x.ConfigurationId == '35')
        {
         
          var a =
          {
            ConfigurationId: '36',
            SelectedValue: 5,
            IsActive: true,
          }
          this.Configurationdto.push(a);
          if ( x.ConfigurationId == '35')
          {
            // x.ConfigurationId = '37'
            var a =
            {
              ConfigurationId:  '37',
              SelectedValue: 90,
              IsActive: true
            }
            this.Configurationdto.push(a);
          }
          if ( x.ConfigurationId == '35')
        {
          // x.ConfigurationId = '38'
          var a =
          {
            ConfigurationId:  '38',
            SelectedValue: 15,
            IsActive: true
          }
          this.Configurationdto.push(a);
        }
        }
      })
    }
        else
        { 
          this.Configurationdto.forEach(x=> {
            debugger;
            if(x.ConfigurationId == '35')
            {
             
              var a =
              {
                ConfigurationId: '36',
                SelectedValue: 0,
                IsActive: false
              }
              this.Configurationdto.push(a);
              if ( x.ConfigurationId == '35')
              {
                // x.ConfigurationId = '37'
                var a =
                {
                  ConfigurationId:  '37',
                  SelectedValue: 0,
                  IsActive: false
                }
                this.Configurationdto.push(a);
              }
              if ( x.ConfigurationId == '35')
            {
              // x.ConfigurationId = '38'
              var a =
              {
                ConfigurationId:  '38',
                SelectedValue: 0,
                IsActive: false
              }
              this.Configurationdto.push(a);
            }
            }
          })
        }
      
        
          this.Configurationdto.forEach(x=> {
            debugger;
            if(x.ConfigurationId == '31' && element.IsActive== true)
            { var a ={ConfigurationId: '32',SelectedValue: 5,IsActive: true,} 
            this.Configurationdto.push(a);
            var a ={ConfigurationId: '33',SelectedValue: 5,IsActive: true,}
            this.Configurationdto.push(a);
            var a ={ConfigurationId: '34',SelectedValue: 5,IsActive: true,}
            this.Configurationdto.push(a);
            }
            else if(x.ConfigurationId == '31' && element.IsActive== false)
            { var a ={ConfigurationId: '32',SelectedValue: 5,IsActive: false,} 
            this.Configurationdto.push(a);
            var a ={ConfigurationId: '33',SelectedValue: 5,IsActive: false,}
            this.Configurationdto.push(a);
            var a ={ConfigurationId: '34',SelectedValue: 5,IsActive: false,}
            this.Configurationdto.push(a);
            }
            if(x.ConfigurationId == '32' && element.IsActive== true)
            { var a ={ConfigurationId: '33',SelectedValue: 5,IsActive: true,} 
            this.Configurationdto.push(a);
            var a ={ConfigurationId: '34',SelectedValue: 5,IsActive: true,}
            this.Configurationdto.push(a);
            }
            else if(x.ConfigurationId == '32' && element.IsActive== false)
            { var a ={ConfigurationId: '33',SelectedValue: 5,IsActive: false,} 
            this.Configurationdto.push(a);
            var a ={ConfigurationId: '34',SelectedValue: 5,IsActive: false,}
            this.Configurationdto.push(a);
            }
            if(x.ConfigurationId == '33' && element.IsActive== true)
            { var a ={ConfigurationId: '34',SelectedValue: 5,IsActive: true,} 
            this.Configurationdto.push(a);
            }
            else if(x.ConfigurationId == '33' && element.IsActive== false)
            { var a ={ConfigurationId: '34',SelectedValue: 5,IsActive: false,} 
            this.Configurationdto.push(a);
            }
            
            if(x.ConfigurationId == '27' && element.IsActive== true)
            { var a ={ConfigurationId: '28',SelectedValue: 5,IsActive: true,} 
            this.Configurationdto.push(a);
            var a ={ConfigurationId: '29',SelectedValue: 5,IsActive: true,}
            this.Configurationdto.push(a);
            var a ={ConfigurationId: '30',SelectedValue: 5,IsActive: true,}
            this.Configurationdto.push(a);
            }
            else if(x.ConfigurationId == '27' && element.IsActive== false)
            { var a ={ConfigurationId: '28',SelectedValue: 5,IsActive: false,} 
            this.Configurationdto.push(a);
            var a ={ConfigurationId: '29',SelectedValue: 5,IsActive: false,}
            this.Configurationdto.push(a);
            var a ={ConfigurationId: '30',SelectedValue: 5,IsActive: false,}
            this.Configurationdto.push(a);
            }
            if(x.ConfigurationId == '28' && element.IsActive== true)
            { var a ={ConfigurationId: '29',SelectedValue: 5,IsActive: true,} 
            this.Configurationdto.push(a);
            var a ={ConfigurationId: '30',SelectedValue: 5,IsActive: true,}
            this.Configurationdto.push(a);
            }
            else if(x.ConfigurationId == '28' && element.IsActive== false)
            { var a ={ConfigurationId: '29',SelectedValue: 5,IsActive: false,} 
            this.Configurationdto.push(a);
            var a ={ConfigurationId: '30',SelectedValue: 5,IsActive: false,}
            this.Configurationdto.push(a);
            }
            if(x.ConfigurationId == '29' && element.IsActive== true)
            { var a ={ConfigurationId: '30',SelectedValue: 5,IsActive: true,} 
            this.Configurationdto.push(a);
            }
            else if(x.ConfigurationId == '29' && element.IsActive== false)
            { var a ={ConfigurationId: '30',SelectedValue: 5,IsActive: false,} 
            this.Configurationdto.push(a);
            }
            if(x.ConfigurationId == '66' && x.IsActive== true)
            {var a ={ConfigurationId:  '67',SelectedValue: 0,IsActive: true}
            this.Configurationdto.push(a);
            }
            else if((x.ConfigurationId == '66' && x.IsActive== false))
            {var a ={ConfigurationId:  '67',SelectedValue: 0,IsActive: false}
            this.Configurationdto.push(a);
            }
            })
        
      
      
      
          }
    
     
    var data = {
      GroupId: this.groupId,
      Configurationdtolist: this.Configurationdto
    }
    this.gp.SaveGroupWiseConfigurationDetails(data).subscribe(response => {
      debugger;
      this.loader.close();
      // if (!!response) {
      //   this.toastr.success('success', this.message.AssetrakSays);
      // }
      // else {
      //   this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
      // }
      this.GetConfigurationData();
      ///this.onChangedatasource();

    })
  }
  showCostWdv() {
    
    this.showWDV = true;
    this.retiredata.forEach(element => {
      if (element.configurationName == 'For Cost/Wdv Lesser Than In R?') {
        
        this.showOthersRetire = element.IsActive;
      }
    });
  }

  showCostWdvTransfr() {
    this.showWDVTransfer = true;
  }

  showOutBoundDropDown() {
    this.showSapDropDown = !this.showSapDropDown;
  }

  showSapSelector() {
    this.showSapDropDown = !this.showSapDropDown;
    var element =[]
    this.aa = {
      ConfigurationMasterId: 49,
      //SelectedValue: element.SelectedValue,
      IsActive: this.showSapDropDown, 
      custome1: 0
    }
    this.SubmitConfiguration(this.aa);
  }
  OutBondFields(element) {
    element.IsActive = !element.IsActive
    this.SubmitConfiguration(element)
  }
  changeselectedvalue(element)
  {
    debugger;
    var elementvalue = element.SelectedValue;
    element.selectedValue = element.selectedValue;
    if(element.ConfigurationMasterId == 63 )
    {
      this.othersData.forEach(element1 => {
        if(element1.ConfigurationMasterId == 64){
        if (element1.Custome1.toLowerCase() == elementvalue.toLowerCase()) {            
          element.SelectedValue ="";
          this.toastr.error(
            this.message.GRNVALIDATION,
            this.message.AssetrakSays,
          );
          return false;
         }
        else{
          this.checkPrefixVal(element);
          if(  this.checkdupliate == true){
            element.SelectedValue =elementvalue;
            this.SubmitConfiguration(element);
            }
        }
       }
      })
     }
   else if((element.ConfigurationMasterId == 64 )){
    this.othersData.forEach(element1 => {
      if(element1.ConfigurationMasterId == 63){
      if (element1.Custome1.toLowerCase() == elementvalue.toLowerCase()) {            
        element.SelectedValue ="";
        this.toastr.error(
          this.message.GRNVALIDATION,
          this.message.AssetrakSays,
        );
        return false;
         }
         else{
           this.checkPrefixVal(element);
            if(  this.checkdupliate == true)
            {
              element.SelectedValue =elementvalue;
              this.SubmitConfiguration(element);
            }
          }
        }
    })
   }
   else{
     this.SubmitConfiguration(element);
   }
}
  checkdupliate:boolean =false;
 
  checkPrefixVal(element) {
    debugger;

   var strlength = element.SelectedValue.length;
    if (!element.SelectedValue || element.SelectedValue  === undefined || element.SelectedValue.trim() === "") {
      return false;
    } else {
      var id = element.SelectedValue.trim();
      var value = parseInt(element.SelectedValue);
      var lastChar = id.substr(id.length - 1);
      if (  strlength < 3 || strlength > 6 ) {
       
        element.SelectedValue ="";
        this.checkdupliate =false;
        this.toastr.error(
          this.message.PREFIXLENGTH,
          this.message.AssetrakSays,
        );
        return false;
      }
        if ((value >= 0)) {
          element.SelectedValue ="";
          this.checkdupliate =false;
          this.toastr.error(
            this.message.PostfixValidation,
            this.message.AssetrakSays,
          );
          return false;
    } 
      else{
        this.checkdupliate =true;
      }
    }

  }
}
