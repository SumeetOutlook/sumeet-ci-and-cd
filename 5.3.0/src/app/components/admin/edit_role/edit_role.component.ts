
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationListDialogComponent } from '../create-role/location-list-dialog/location-list-dialog.component';
import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { MatSelectChange } from '@angular/material/select';
import { LocalStoreService } from 'app/shared/services/local-store.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import * as headers from '../../../../assets/Headers.json';
import * as resource from '../../../../assets/Resource.json';
import { UserRoleService } from '../../services/UserRoleService';
import * as Menuheaders from '../../../../assets/MenuHeaders.json';
import { ViewfieldComponent } from 'app/components/super_admin/custom-view-mapping/viewfield/viewfield.component';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { AssetService } from 'app/components/services/AssetService';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';


@Component({
  selector: 'app-role_edit',
  templateUrl: './edit_role.component.html',
  styleUrls: ['./edit_role.component.scss']
})
export class editRoleComponent implements OnInit {

  header: any ;
  message: any = (resource as any).default;
  MenuHeader: any = (Menuheaders as any).default;
  rowData: any;
  roleForm: FormGroup;
  submitted: boolean = false;

  CreateModules1:any[]=[];
  childmodules1 : any[]=[];
  AllPermssionData: any[]=[];

  SessionGroupId: any;
  SessionRegionId: any;
  SessionCompanyId: any;
  SessionUserId: any;

  panelOpenState=new Array<boolean>();
  panelOpenState1 = new Array<boolean>();
  SubModules_OpenState=new Array();
  CreateModules_OpenState=new Array<boolean>();
  StandardTypeData1:any[]=[];
  Standardcategoryid:any;
  step;
  CreateModules2:any[] =
  [
    // { Type: '1', name: "AssetInfoview" },
    // { Type: '2', name: "NetworkInfoview" },
    // { Type: '3', name: "AuditInfoview" },
    // { Type: '4', name: "HardwareInfoview" },
    // { Type: '5', name: "TransferInfoview" },
    // { Type: '6', name: "RetirementInfoView" },
    // { Type: '7', name: "Notification" },
    // { Type: '8', name: "Reports" },
  ]
  submodules1:any[] =
  [
    // {id:11,Sname:"AssetinfoView(Standard)"},
    // {id:12, Sname: "NetworkInfoview(Standard)" },
    // {id:13, Sname: "AuditInfoview(Standard)" },
    // {id:14, Sname: "HardwareInfoview(Standard)" },
    // {id:15, Sname: "TransferInfoview(Standard)" },
    // {id:16, Sname: "RetirementInfoView(Standard)" },
    // {id:17, Sname: "NotificationView(Standard)" },
    // {id:18, Sname: "ReportsView(Standard)" }
   // {id:12,Sname:"NetworkInfoView"}
  ]
  childmodules:any[] =[
    // {id:11,cname:"AssetinfoView(Custom1)"},
    // {id:12,cname:"AssetinfoView(Custom2)"},
    // {id:12,cname:"AssetinfoView(Custom3)"}
  ]
  setStep(index: number,event) {
    debugger;
    this.Standardcategoryid = event.CategoryId
    this.step = index;
      this.panelOpenState[index]=true;
      for(let i=0;i<12;i++){
      console.log(this.panelOpenState[i]);
      }
     this.GetCustomeView();
  }
  setStep1(index: number,event) {
    this.step = index;
    this.Standardcategoryid = event.CategoryId
    this.panelOpenState1[index] = true;
    for (let i = 0; i < 12; i++) {
      console.log(this.panelOpenState1[i]);
    }
    //this.GetCustomeView();
  }
  public selectedIndex;
  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.nextStep(tabChangeEvent.index);
    this.previousStep(tabChangeEvent.index);
  }
  previousStep(i) {
    this.selectedIndex = i;
  }
  changeState(index: number){
    
   this.panelOpenState[index]=false;
  }
  changeState1(index: number) {
    debugger;
    this.panelOpenState1[index] = false;
  }

  nextStep(i) {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  // get f() { return this.roleForm.controls; };
    constructor(
      private storage: ManagerService,
      private router: Router,
      private route: ActivatedRoute,
      public dialog: MatDialog,
      private loader: AppLoaderService,
      public localService: LocalStoreService,
      private fb: FormBuilder,
      private userRoleService:UserRoleService,
      public toastr: ToastrService,
      public as:AssetService,
      private jwtAuth: JwtAuthService
      ) 
      { 
        this.header = this.jwtAuth.getHeaders()
        this.rowData = this.router.getCurrentNavigation().extras.state
      }
  
      public onBack() {
        this.router.navigateByUrl('h9/n');
      }

    ngOnInit() {
      this.loader.open();
      
      if(!!this.rowData)
      {
        this.SessionGroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
        this.SessionRegionId =this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
        this.SessionCompanyId =this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);   
        this.SessionUserId= this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);

        this.roleForm = new FormGroup({
          name: new FormControl({value:this.rowData.RoleName, disabled: true},[Validators.required])
          // userName: [{value:'', disabled: true}, [Validators.required,Validators.pattern(this.emailPattern)]],
        })

        this.GetAllModule();
        this.GetStandardView();
      for(let i=0;i<this.CreateModules_OpenState.length;i++){
          this.CreateModules_OpenState[i]=false;
        }
       for(let i=0;i<this.CreateModules_OpenState.length;i++){
       this.SubModules_OpenState[i]=new Array<boolean>(this.CreateModules1[i].submodules.length);
       for(let j=0;j<this.SubModules_OpenState[i].length;j++){
         this.SubModules_OpenState[i][j]=false;
        }
       }
      }
      else{
        this.onBack();
      }
      this.loader.close();
    }
  

    onSubmit() {
      debugger;
      var flag= false;
      if (this.rowData.RoleId > 0) { 
        for (var i = 0; i < this.CreateModules1.length; i++) {
            if (this.CreateModules1[i].isCheck == true) {
              flag= true;
             }
            }

         if(flag)
         {
          this.loader.open();
          
          var data={
            List : JSON.stringify(this.CreateModules1),
            ListOfViewischeck : JSON.stringify(this.submodules1),
            ListOfView :JSON.stringify(this.StandviewDataAll),
            roleId :this.rowData.RoleId,
            IsEditRole : true
          }
          this.userRoleService.AddRoleToModuleAndPermission(data).subscribe(res =>{
            this.loader.close();
           
           if(res == "Success")
           {
             this.toastr.success(this.message.RoleUpdationSuccess,this.message.AssetrakSays);
           }
           else if(res == "Fail")
           {
             this.toastr.error(this.message.OperationFailed,this.message.AssetrakSays);
           }
           else if(res == "Default Role")
           {
             this.toastr.warning(this.message.DefaultRoleMsg,this.message.AssetrakSays);
           }
    
          this.GetAllModule();
          this.GetStandardView();
          })
     } 
     else{
      this.toastr.warning(this.message.SelectRole,this.message.AssetrakSays);
     }  
    }
      }   
  
    public existingRole() {
      
      this.router.navigateByUrl('h9/n'); 
    }

    optionClicked(event: Event,index) {
      event.stopPropagation();
    }

    toggleCreateModules(index: number,module){
      if(!!module.OpenState){
        module.OpenState = !module.OpenState;
      }
      else{
        module.OpenState = true;
      }
    }
  
    SelectAllPermissions(moduleType,module,submodules){
      debugger;    
      if(moduleType == 'mainmodules'){
        if(!!module.OpenState){
          module.OpenState = !module.OpenState;
        }
        else{
          module.OpenState = true;
        }
        module.isCheck = !module.isCheck ;
        if(module.Status=="S")
        {
          module.isCheck = module.isCheck ;
          // for(var i =0;i<module.;i++){
          //   module.submodules[i].isCheck = module.isCheck;
        }
        else if (module.Status=="C")
        {
          module.isCheck = !module.isCheck ;
        }
        else{
        for(var i =0;i<module.submodules.length;i++){
          module.submodules[i].isCheck = module.isCheck;
          for(var j =0;j< module.submodules[i].childmodules.length;j++){
            module.submodules[i].childmodules[j].isCheck = module.isCheck;
          }
        }
      }
      }
  
      if(moduleType == 'submodules'){      
        module.isCheck = !module.isCheck ;
        for(var i =0;i<module.childmodules.length;i++){
          module.childmodules[i].isCheck = module.isCheck;
        }
      }
      if(moduleType == 'submodules1'){  
        debugger;
        module.isCheck = !module.isCheck ;
      submodules[0].isCheck = true;
      for (var j = 1; j < submodules.length; j++) {
        if(submodules[j].isCheck == true && module.CategoryId == submodules[j].CategoryId){
          submodules[0].isCheck = false;
        }
        else{
          submodules[j].isCheck = false;
        }
      }
        // for(var j=0;j < submodules.length;j++)
        // {
        //   if(module.CategoryId ==submodules[j].CategoryId )
        //   {
        //     if(submodules[j].isCheck == true){
        //       submodules[0].isCheck = true;
        //     }
        //     submodules[j].isCheck = true;
        //     this.StandviewDataAll[j].isCheck = true;
        //   }
        //   else{
        //     submodules[j].isCheck = false;
        //     this.StandviewDataAll[j].isCheck = false;
        //   }
    
        // }
        this.submodules1 = submodules;
        // var aa = {
        //   CategoryId:module.CategoryId,
        //   CategoryName:module.CategoryName,
        //   GroupId:module.GroupId,
        //   Status:module.Status,
        //   Custom1:module.Custom1,
        //   Custom2:module.Custom2,
        //   isCheck: !module.isCheck,       
        //   OpenState : false, 
        //   submodules:[]
        // }
        // this.submodules1.push(aa);
      }
      
      if(moduleType == 'Permissions'){      
        module.isCheck = !module.isCheck ;
      }
      
  }
  
  GetAllModule()
  {
    
    var groupId=this.SessionGroupId;
    var regionId=this.SessionRegionId;
    var companyId=this.SessionCompanyId;
    var roleId= this.rowData.RoleId;
  
    this.childmodules1=[];
    this.CreateModules1=[];
    this.panelOpenState=new Array<boolean>();
    this.SubModules_OpenState=new Array();
    this.CreateModules_OpenState=new Array<boolean>();
  
    this.userRoleService.ViewRoles(groupId, regionId, companyId, roleId).subscribe(r => {
      r.forEach(element => {
        
        if(!!element.ParentModuleId){          
          this.childmodules1.push(element)
        }
        else {
          var aa = {
            mainmoduleId:element.ModuleId,
            // mainmodules:element.ModuleName,
            mainmodules:this.MenuHeader[element.ModuleName],
            displayOrder: element.DisplayOrder,
            isCheck: element.IsCheck,       
            OpenState : element.IsCheck, 
            categoryname:element.CategoryName,
            submodules:[]

          }
          this.CreateModules1.push(aa)
        }        
      });
      
      this.BindModuleSubModule();
    })   
  }
  
  BindModuleSubModule()
  {
   
    for (var i = 0; i < this.CreateModules1.length; i++) {
      for (var j = 0; j < this.childmodules1.length; j++) {
        if (this.CreateModules1[i].mainmoduleId == this.childmodules1[j].ParentModuleId) {
          var aa = {
            subModuleid:this.childmodules1[j].ModuleId,
            // submodules:this.childmodules1[j].ModuleName,
            submodules:this.MenuHeader[this.childmodules1[j].ModuleName],
            parentModuleId:this.childmodules1[j].ParentModuleId,        
            displayOrder: this.childmodules1[j].DisplayOrder,
            isCheck: this.childmodules1[j].IsCheck, 
            childmodules : []
          }
          this.CreateModules1[i].submodules.push(aa);
        }
      }      
    }
    
    this.GetModulePermissions();
  }
  
  
  GetModulePermissions()
  {
    
    var roleId=this.rowData.RoleId;
    this.userRoleService.permissions(roleId).subscribe(r => {
      this.AllPermssionData=[];
      r.forEach(element => {
        
        this.AllPermssionData.push(element)
      });
      
      for (var i = 0; i < this.CreateModules1.length; i++) {
         for(var j = 0; j < this.CreateModules1[i].submodules.length; j++){
          for (var k = 0; k < this.AllPermssionData.length; k++) {
            if (this.CreateModules1[i].submodules[j].subModuleid == this.AllPermssionData[k].ModuleId) {
              var aa = {
                id:this.AllPermssionData[k].ModulePermissionId,
                name:this.AllPermssionData[k].ModulePermissionName,
                parentModuleId:this.AllPermssionData[k].ModuleId,
                isCheck: this.AllPermssionData[k].IsCheck,
              }
              this.CreateModules1[i].submodules[j].childmodules.push(aa);
            }
          } 
         }
      }
      
    })   
   this.panelOpenState.length=this.CreateModules1.length;
   this.SubModules_OpenState.length=this.CreateModules1.length;
   this.CreateModules_OpenState.length=this.CreateModules1.length;
  }
  VieweditGridpop(...event) {
    debugger;
    let title = 'Add Grid Display';
    const dialogconfigcom1 = new MatDialogConfig();
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = '60vw';
    dialogconfigcom1.height = 'auto';
    dialogconfigcom1.data = {
      component1: 'assetClassComponent',
      value: event[0],
      payload: event
    };
    const dialogRef = this.dialog.open(ViewfieldComponent,dialogconfigcom1) 
  
    dialogRef.afterClosed().subscribe(result => {
      debugger;
      if (!!result) {
        console.log(result)
      //  this.ListOfField = result;
        //this.displayedColumns = this.ListOfField;
      //  this.displayedColumns = this.displayedColumns.filter(x => x.IsForDefault == true).map(choice => choice.FieldName);
      //  this.displayedColumns = ['Select', 'Icon', 'review'].concat(this.displayedColumns);
      }
    })
  }
  GetStandardView()
  { 
    debugger;
    this.as.Getallcategories(this.SessionGroupId).subscribe(response => {
      this.StandardTypeData1 = JSON.parse(response)
      // this.StandardTypeData1 = response;
      
             
      this.StandardTypeData1.forEach(r=>{
        if(r.Status=="S")
        {
          var aa = {
            CategoryId:r.CategoryId,
            CategoryName:r.CategoryName,
            GroupId:r.GroupId,
            Status:r.Status,
            Custom1:r.Custom1,
            Custom2:r.Custom2,
            isCheck: true,       
            OpenState : false, 
            submodules:[]
          }
          this.CreateModules2.push(aa);
          
        }
        if(r.Status=="C" && r.Custom2==this.Standardcategoryid)
        {
          
        }
        var aa = {
          CategoryId:r.CategoryId,
          CategoryName:r.CategoryName,
          GroupId:r.GroupId,
          Status:r.Status,
          Custom1:r.Custom1,
          Custom2:r.Custom2,
          isCheck: true,       
          OpenState : false, 
          submodules:[]
        }
        this.submodules1.push(aa);
      })
      this.GetAllViewData();
      //this.filteredFieldMulti.next(this.StandardTypeData.slice());
      debugger;
    })
  }
  GetCustomeView()
  { 
    debugger;
    this.childmodules=[];
    this.as.Getallcategories(this.SessionGroupId).subscribe(response => {
      this.StandardTypeData1 =JSON.parse(response);
      
      this.StandardTypeData1.forEach(r=>{
        
        if(r.Status=="C" && r.Custom2==this.Standardcategoryid)
        {
          var aa = {
            CategoryId:r.CategoryId,
            CategoryName:r.CategoryName,
            GroupId:r.GroupId,
            Status:r.Status,
            Custom1:r.Custom1,
            Custom2:r.Custom2,
            isCheck: true,       
            OpenState : false, 
            submodules:[]
          }
          this.childmodules.push(aa);
        }
        
      })
      //this.filteredFieldMulti.next(this.StandardTypeData.slice());
      debugger;
    })
  }
  StandviewDataAll:any[]=[];
  GetAllViewData()
  {
    debugger;
    
    var ViewData={
        AllStandviewData : JSON.stringify(this.StandardTypeData1),
      roleId: this.rowData.RoleId,
       comp: "Edit",
    }
  
    this.as.GetAllViewData(ViewData).subscribe(response => {
      this.StandviewDataAll = JSON.parse(response);

    })
    debugger;
  }
}
