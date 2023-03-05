import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import {CredentialService} from 'app/components/services/CredentialService';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { ToastrService } from 'ngx-toastr';
import * as headers from '../../../../assets/Headers.json';
import * as resource from '../../../../assets/Resource.json';

export interface type {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-user-credentials',
  templateUrl: './user-credentials.component.html',
  styleUrls: ['./user-credentials.component.scss']
})
export class UserCredentialsComponent implements OnInit {
  header: any ;
  message: any = (resource as any).default;
  title: "User Credential";
  Submitname: string;
  Submitemail: string;
  isChecked = true;
  checked: boolean;
  checkval: boolean;
  outag: boolean;
  submitted: boolean = false;
  disablevalueSelect:boolean = false;
  ActivedicId:any;
  firstFormGroup: FormGroup;  //Activedirectory
  get f1() { return this.firstFormGroup.controls; };
  firstFormGroup1: FormGroup; //EmailCredential
  get f2() { return this.firstFormGroup1.controls; };
  EmailCredentialId:any;
  firstFormGroup2: FormGroup; //ftp1
  get f3() { return this.firstFormGroup2.controls; }
  firstFormGroup3: FormGroup; //ftp2
  get f4() { return this.firstFormGroup3.controls; }
  firstFormGroup4: FormGroup; //ftp3
  get f5() { return this.firstFormGroup4.controls; }
  firstFormGroup5: FormGroup;  //ftp4
  get f6() { return this.firstFormGroup5.controls; }
  disableSelect = new FormControl (true);
  // disableSelect = new FormControl(false);
  options: string[] = ['OU=YourOrgUnit,DC=YourDomain,DC=com'];

  Types: type[] = [
    {value: 'Secure', viewValue: 'Secure'},
    {value: 'SecureSocketsLayer', viewValue: 'SecureSocketsLayer'},
    {value: 'Anonymous', viewValue: 'Anonymous'}
  ];

  // tabs = ['FTP2', ];
  // selected = new FormControl(0);
  // tabtitle:string = '';
  constructor(private _formBuilder: FormBuilder, 
     public credentialservice :  CredentialService,
     public toastr: ToastrService,
     private jwtAuth: JwtAuthService) 
     {
      this.header = this.jwtAuth.getHeaders()
      }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      // Withoutpassword: false,
      // FirstName: [false],
      // firstCtrl: [''],
      // email: [''],
      // password: [''],
      // portnumber: [''],
      // portnumber1: [''],
      // portnumber2: [''],
      // portnumber3: [''],
      
      // Sendertitle: [''],
      // emailsender: [''],
      // Epassword: [''],
      // smtpemail: [''],
      // smtppassword: [''],
      // emailhost: [''],
      // Eportnumber: [''],
      Domain: ['',Validators.required],
      Domainpassword: ['',Validators.required],
      AuthenticationType: [''],
      Domainusername: ['',Validators.required],
      // Isusessl : false,
      disableSelect : true,
      disablevalueSelect : false,
      ou: [''],
      groupou: [''],
      // isShowDivftp: false,
      // isShowDivsftp: false,
    })
    this.firstFormGroup1 = this._formBuilder.group({
      Sendertitle: ['',Validators.required],
      emailsender: ['',Validators.required],
      Epassword: ['',Validators.required],
      smtpemail: ['',Validators.required],
      smtppassword: ['',Validators.required],
      emailhost: ['',Validators.required],
      Eportnumber: ['',Validators.required],
      IsSSL: true,
      IsHTMLBody: true,
      UserCredentials: true,  
      Withoutpassword: true,

      WithoutSmtp: true,

    })
    this.firstFormGroup2 = this._formBuilder.group({
      Hostname: ['',Validators.required],
      username: ['',Validators.required],
      password: ['',Validators.required],
      portnumber: ['',Validators.required],
      Operationtypeftp:['',Validators.required],
      Operationtypesftp:['',Validators.required],
      isShowDivftp: false,
      isShowDivsftp: false,
    })
    this.firstFormGroup3 = this._formBuilder.group({
      Hostname1: ['',Validators.required],
     username1: ['',Validators.required],
      password1: ['',Validators.required],
      portnumber1: ['',Validators.required],
    })
    this.firstFormGroup4 = this._formBuilder.group({
      Hostname2: ['',Validators.required],
     username2: ['',Validators.required],
      password2: ['',Validators.required],
      portnumber2: ['',Validators.required],
    })
    this.firstFormGroup5 = this._formBuilder.group({
      Hostname3: ['',Validators.required],
     username3: ['',Validators.required],
      password3: ['',Validators.required],
      portnumber3: ['',Validators.required],
    })
   
    this.isShowDivftp = true;

   this.ActiveDirectoryGetAllData();
    this.EmailCredentialGetAllData();
  }
  portnumber: any;
  isShowDivftp:  boolean;
  isShowDivsftp: boolean;
  // onPercentChange(percent: number) {
  //   console.log('here');  

  //   this.percent = percent;
  // }
  
  onclickftp(){
    
    this.portnumber = 21;
    debugger;
    
    this.isShowDivftp= true;
    this.isShowDivsftp= false;
   
    
    // if(outag.checked == true)
    // {
    //   alert("hi");
    //   this.firstFormGroup.controls['isShowDivsftp'].disable();
    // }
   
  
  }
  onclicksftp(){ 
    debugger;
    this.portnumber = 22;
    this.isShowDivftp= false;
    this.isShowDivsftp= true; 
    
    // if(outag.checked == true)
    // {
    //   alert("hi");
    //   this.firstFormGroup.controls['isShowDivftp'].disable();
    // }
    
  }
    onchageou(){
      if(this.firstFormGroup.controls['ou'].value == "" || this.firstFormGroup.controls['ou'].value == null){
        this.firstFormGroup.controls['groupou'].enable();
      }
      else{
      this.firstFormGroup.controls['groupou'].disable();
    }
    }
    onchagegroupou(){
      if(this.firstFormGroup.controls['groupou'].value == "" || this.firstFormGroup.controls['groupou'].value == null){
      this.firstFormGroup.controls['ou'].enable();
      }
      else{
        this.firstFormGroup.controls['ou'].disable();
      }
    }
    changedisable(checkval){
      debugger;
      
      if (checkval.checked == true) {
        this.disablevalueSelect = false;
        //this.firstFormGroup.controls['AuthenticationType'].enable();
      }
      else{
        this.disablevalueSelect = true;
        //this.firstFormGroup.controls['AuthenticationType'].disable();
      }
    }
  changeDisable(checkval) {

    debugger;
    if (checkval.checked == true) {
      
      this.firstFormGroup1.controls['Epassword'].enable();
      this.firstFormGroup1.controls['smtppassword'].enable();
     

    }
    else {
      this.firstFormGroup1.controls['Epassword'].disable();
      this.firstFormGroup1.controls['smtppassword'].disable();
    }
  
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
  openPopUp(){
    
  }
  onSubmit(){
    debugger;
    this.ActiveDirectoryInsertData();
    
    
  }
 
  Saveactive(){
    debugger;
    
    

  }
  Saveemail(){
    debugger;
    // console.log(this.firstFormGroup1.value);
    this.EmailCredentialInsertData();
  }
  SaveFTP(){
    debugger;
    // console.log(this.firstFormGroup2.value);
    this.FtpInsertData();
  }

  SaveFTP2(){
    debugger;
    this.Ftp2InsertData();
  }
  SaveFTP3(){
    debugger;
    this.Ftp3InsertData();
  }
  SaveFTP4(){
    debugger;
    this.Ftp4InsertData();  
  }
  selected(){
    debugger;
    // alert(this.selectedLevel.name)
    
  }
  
  // addTab() {

  //   if(this.tabtitle != ''){
  //      this.tabs.push(this.tabtitle);
  //   }else{
  //      this.tabs.push('FTP');
  //   }
   
  //   this.tabtitle = '';

  //    {
  //     this.selected.setValue(this.tabs.length - 1);
  //   }
    
  

  // }

  // removeTab(index: number) {
  //   this.tabs.splice(index, 1);
  // }

  ActiveDirectoryGetAllData(){
    debugger;
    this.credentialservice.ActiveDirectoryGetAllData().subscribe(r=>{
      debugger;
      if(r.length ==1){ 
        this.disablevalueSelect=r[0].IssueSSL;
        if(r[0].IssueSSL=='true')
        {
          this.disablevalueSelect==true;
        }
        else{
          this.disablevalueSelect==false;
        }
        //this.firstFormGroup.value.AuthenticationType=r[0].AuthenticationType;
        //this.firstFormGroup.value.Domain=r[0].Domain;
        //this.firstFormGroup.value.Domainusername=r[0].UserName;
        //this.firstFormGroup.value.Password=r[0].Password; 
        //this.firstFormGroup.value.ou=r[0].ou; 
        //this.firstFormGroup.value.groupou=r[0].groupou;
        
        this.Submitname = "Update";
        // this.firstFormGroup.controls['disableselect']
        this.ActivedicId = r[0].Id;
        this.firstFormGroup.controls['AuthenticationType'].setValue(r[0].AuthenticationType)
        this.firstFormGroup.controls['Domain'].setValue(r[0].Domain)
        this.firstFormGroup.controls['Domainusername'].setValue(r[0].UserName)
        this.firstFormGroup.controls['Domainpassword'].setValue(r[0].Password)

        if(r[0].OrganizationUnit =="" || r[0].OrganizationUnit == null ){
          this.firstFormGroup.controls['ou'].disable();
          this.firstFormGroup.controls['groupou'].setValue(r[0].GroupOrganizationUnit)

        }else{
          this.firstFormGroup.controls['ou'].setValue(r[0].OrganizationUnit)
          this.firstFormGroup.controls['groupou'].disable();
      
        }
        //[formControl]="firstFormGroup1.controls['Domainusername']";
        
      }
      else{
        this.toastr.success(this.message.ActiveDirectory,this.message.AssetrakSays);
        this.Submitname = "Save";
      }
    }); 

  }


  ActiveDirectoryInsertData()
  {
    debugger;
    var Isusessl = this.disablevalueSelect;
    var AuthenticationType ;
    if(Isusessl ){
      AuthenticationType = "";
    }
    else{
      AuthenticationType = this.firstFormGroup.value.AuthenticationType;
    }
    
    var Domain = this.firstFormGroup.value.Domain;
    var DomainUsername = this.firstFormGroup.value.Domainusername;
    var Password = this.firstFormGroup.value.Domainpassword;
    var ou = this.firstFormGroup.value.ou;
    var groupou = this.firstFormGroup.value.groupou;

    var groupdata={
      AuthenticationType:AuthenticationType,
      Domain:Domain ,
      UserName:DomainUsername,
      Password:Password,
      OrganizationUnit:ou,
      GroupOrganizationUnit:groupou,
      IssueSSL:Isusessl,
      Id:this.ActivedicId,
    }
    if(this.Submitname == "Save"){
      

  debugger;
  this.credentialservice.ActiveDirectoryInsertData(groupdata).subscribe(r=>{
    debugger;

    this.ActiveDirectoryGetAllData();
    this.toastr.success(this.message.ActiveDirectoryInsert,this.message.AssetrakSays);
  })
    }
    else{
      this.credentialservice.ActiveDirectoryUpdateData(groupdata).subscribe(r=>{
        debugger;

        this.ActiveDirectoryGetAllData();
        this.toastr.success(this.message.ActiveDirectoryUpdate,this.message.AssetrakSays);
      })  
    }
    
 }
 EmailCredentialGetAllData(){

  debugger;
  this.credentialservice.EmailCredentialGetAllData().subscribe(result=>{
    debugger;
    if(result.length > 0){
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
      if(result[0].IsWithoutPassword==true){
        this.firstFormGroup1.controls['Withoutpassword'].setValue(true);
        this.firstFormGroup1.controls['Epassword'].setValue(result[0].Password)
        this.firstFormGroup1.controls['smtppassword'].setValue(result[0].SMTPPassword)
      }
      else{
        this.firstFormGroup1.controls['Withoutpassword'].setValue(false)
        this.firstFormGroup1.controls['Epassword'].disable();
        this.firstFormGroup1.controls['smtppassword'].disable();
        
      }
      
      if(result[0].IsWithoutSMTP==true)
     {
      this.firstFormGroup1.controls['WithoutSmtp'].setValue(true)
      this.firstFormGroup1.controls['smtpemail'].setValue(result[0].SMTPUserName)
      this.firstFormGroup1.controls['smtppassword'].setValue(result[0].SMTPPassword)
     }
     else{
      this.firstFormGroup1.controls['WithoutSmtp'].setValue(false)
      this.firstFormGroup1.controls['smtpemail'].disable();
      this.firstFormGroup1.controls['smtppassword'].disable();
     }

      
      
      
       
    }
    else{
      this.toastr.success(this.message.EmailCredential,this.message.AssetrakSays);
      this.Submitemail = "Save";
    }
  });
 }

 EmailCredentialInsertData(){
   debugger;
  var Withoutpassword  = this.firstFormGroup1.value.Withoutpassword;
  var Epassword;
  var smtppassword;
  if(Withoutpassword){
    debugger;
    var Epassword  = this.firstFormGroup1.value.Epassword;
    var smtppassword  = this.firstFormGroup1.value.smtppassword;
  }
  else{
    Epassword = "";
    smtppassword = "";
    

  }

  var WithoutSmtp  = this.firstFormGroup1.value.WithoutSmtp;
  var smtpemail;
  var smtppassword;
  if (WithoutSmtp){
    debugger;
   
    var smtpemail  = this.firstFormGroup1.value.smtpemail;
    var smtppassword  = this.firstFormGroup1.value.smtppassword;
  }
  else{
    
    smtpemail = "";
   smtppassword = "";
  }

  var Sendertitle = this.firstFormGroup1.value.Sendertitle;
  var emailsender = this.firstFormGroup1.value.emailsender; 
  var emailhost  = this.firstFormGroup1.value.emailhost;
  var Eportnumber  = this.firstFormGroup1.value.Eportnumber;
  var IsSSL  = this.firstFormGroup1.value.IsSSL;
  var IsHTMLBody  = this.firstFormGroup1.value.IsHTMLBody;
  var UserCredentials  = this.firstFormGroup1.value.UserCredentials;
  
  var emailCredentialdata={
    SenderTitle:  Sendertitle,
    Id: this.EmailCredentialId,
    EmailHost: emailhost,
    EmailSender: emailsender,
    Password:Epassword,
    SMTPUserName:smtpemail,
    SMTPPassword:smtppassword,
    PortNumber:Eportnumber,
    // Temp1:IsSSL,
    // Temp2:IsHTMLBody,
    // UserCredentials, 
    // Temp3:Withoutpassword,
    // Temp4:WithoutSmtp,
    isusercredential :UserCredentials,
    isssl : IsSSL,
ishtmlbody :IsHTMLBody,
iswithoutpassword : Withoutpassword,
iswithoutsmtp :WithoutSmtp,
  
  }
  if(this.Submitemail== "Save"){

debugger;
this.credentialservice.EmailCredentialInsertData(emailCredentialdata).subscribe(result=>{
  debugger;
  
  this.EmailCredentialGetAllData();
  this.toastr.success(this.message.EmailcredentialInsert,this.message.AssetrakSays);
}) }
else{
  debugger;
this.credentialservice.EmailCredentialUpdateData(emailCredentialdata).subscribe(result=>{
  debugger;
  this.EmailCredentialGetAllData();
  this.toastr.success(this.message.EmailcredentialUpdate,this.message.AssetrakSays);

})
}

 }


 FtpGetAllData(){

  debugger;
  this.credentialservice.FtpGetAllData().subscribe(r=>{
    debugger;
    if(r.length > 0){
       
    }
    else{
      this.toastr.success(this.message.ActiveDirectory,this.message.AssetrakSays);
    }
  });
 }
 FtpInsertData(){
   var Hostname = this.firstFormGroup2.value.Hostname;
   var username = this.firstFormGroup2.value.username;
   var password = this.firstFormGroup2.value.password;
   var portnumber = this.firstFormGroup2.value.portnumber;

    
     

   
   
   var Operationtypeftp ;
   if(this.isShowDivftp){
    Operationtypeftp = this.firstFormGroup2.value.Operationtypeftp;
   }
   else{
     Operationtypeftp = "";
    
   }
 
 var Operationtypesftp;
 if(this.isShowDivsftp)
 {
  var Operationtypesftp = this.firstFormGroup2.value.Operationtypesftp;
 }
 else{
  Operationtypesftp = "";
 }
  
  
  var Ftpdata={
    HostName:Hostname ,
    UserName: username ,
    Password: password ,
    PortNumber:portnumber ,
    OperationType:Operationtypeftp,
    Temp1:Operationtypesftp,
    IsFTPorSFTP:this.isShowDivftp ,
    FTPType:this.isShowDivsftp?"true":"false",
    
    
  
  } 
  // FTPfor

debugger;
this.credentialservice.FtpInsertData(Ftpdata).subscribe(r=>{
  debugger;
  this.toastr.success(this.message.FTP,this.message.AssetrakSays);
})

 }
 Ftp2InsertData(){
  var Hostname = this.firstFormGroup3.value.Hostname1;
  var username = this.firstFormGroup3.value.username1;
  var password = this.firstFormGroup3.value.password1;
  var portnumber = this.firstFormGroup3.value.portnumber1;

  var Ftpdata={
    HostName:Hostname ,
    UserName: username ,
    Password: password ,
    PortNumber:portnumber ,
    
  }
    this.credentialservice.FtpInsertData(Ftpdata).subscribe(r=>{
      debugger;
      this.toastr.success(this.message.FTP,this.message.AssetrakSays);
    })
    
  
  }

  Ftp3InsertData(){ 
    var Hostname = this.firstFormGroup4.value.Hostname2;
    var username = this.firstFormGroup4.value.username2;
    var password = this.firstFormGroup4.value.password2;
    var portnumber = this.firstFormGroup4.value.portnumber2;

    var Ftpdata={
      HostName:Hostname ,
      UserName: username ,
      Password: password ,
      PortNumber:portnumber ,
      
    }
      this.credentialservice.FtpInsertData(Ftpdata).subscribe(r=>{
        debugger;
        this.toastr.success(this.message.FTP,this.message.AssetrakSays);
      })

   


  }
  Ftp4InsertData(){
    var Hostname = this.firstFormGroup5.value.Hostname3;
    var username = this.firstFormGroup5.value.username3;
    var password = this.firstFormGroup5.value.password3;
    var portnumber = this.firstFormGroup5.value.portnumber3;

    var Ftpdata={
      HostName:Hostname ,
      UserName: username ,
      Password: password ,
      PortNumber:portnumber ,
      
    }
      this.credentialservice.FtpInsertData(Ftpdata).subscribe(r=>{
        debugger;
        this.toastr.success(this.message.FTP,this.message.AssetrakSays);
      })
  }
 
}
 