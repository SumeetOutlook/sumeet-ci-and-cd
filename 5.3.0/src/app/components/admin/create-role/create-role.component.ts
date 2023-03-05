
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer'
import { Router, ActivatedRoute } from "@angular/router";
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { LocalStoreService } from 'app/shared/services/local-store.service';
import { UserRoleService } from 'app/components/services/UserRoleService';
import { ToastrService } from 'ngx-toastr';
import * as resource from '../../../../assets/Resource.json';
import * as Menuheaders from '../../../../assets/MenuHeaders.json';
import { LocationListDialogComponent } from '../create-role/location-list-dialog/location-list-dialog.component';
import { UserService } from '../../services/UserService';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { ViewfieldComponent } from 'app/components/super_admin/custom-view-mapping/viewfield/viewfield.component';
import { AssetService } from 'app/components/services/AssetService';
import * as headers from '../../../../assets/Headers.json';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
import { timeStamp } from 'console';
import { json } from 'ngx-custom-validators/src/app/json/validator';
import { stringify } from 'querystring';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss']
})

export class CreateRoleComponent implements OnInit {

  header: any;
  message: any = (resource as any).default;
  Type = ['By User', 'By Location'];
  UserType = ['Web User', 'Mobile User'];
  User = ['komalpatil@gmail.com'];
  public AssetInfo: FormGroup;
  //panelOpenState: boolean = false;
  roleForm: FormGroup;
  submitted: boolean = false;
  public isShow = false;
  moduleTypes: any[] = [];
  panelopen = true;
  panelopen1 = true;
  modules: any[] = [{ id: 1, name: 'Dashboard' },
  { id: 2, name: 'Super Admin' }, { id: 3, name: 'Admin' }, { id: 4, name: 'Relationship' }, { id: 5, name: 'Master' }];
  childmodule: any[] = [{ id: 1, name: 'Default' }, { id: 2, name: 'Analytics' }, { id: 3, name: 'Filter Configuration' }
  ];
  modulePermissions: any[] = [];
  attributevalueTypes1: any[] = [];
  childmodulesList: any[] = [];
  userTypes: any[] = [{ id: 1, name: 'Admin' }, { id: 2, name: 'Super Admin' }];
  userList: any[] = [];
  selectedValue1: any;
  permissionList: any[] = [{ id: 1, name: 'Create' }, { id: 1, name: 'View' }, { id: 1, name: 'Upadte' }, { id: 1, name: 'Delete' }];

  CreateModules1: any[] = [];
  childmodules1: any[] = [];
  AllPermssionData: any[] = [];

  SessionGroupId: any;
  SessionRegionId: any;
  SessionCompanyId: any;
  SessionUserId: any;

  MenuHeader: any = (Menuheaders as any).default;

  CreateModules = [
    {
      mainmodules: 'Create Masters',
      submodules: [
        {
          modules: 'Create Assets',
          childmodules: [
            {
              name: 'Add Assets',
              id: '1',
            },
            {
              name: 'Add GRN Assets',
              id: '2'
            },
            {
              name: 'Add NFAR Assets',
              id: '3',
            },
            {
              name: 'Edit Assets',
              id: '4',
            },
            {
              name: 'Errors in Assets',
              id: '5',
            }
          ]
        },
        {
          modules: 'Add Currency Rates',
          childmodules: [

          ]
        },
        {
          modules: 'Create Asset Class',
          childmodules: [

          ]
        },
        {
          modules: 'Create Asset Type',
          childmodules: [
          ]
        },
        {
          modules: 'Create Asset Sub Type',
          childmodules: [
          ]
        },
        {
          modules: 'Create Cost Center',
          childmodules: [
          ]
        },
        {
          modules: 'Create Label Master',
          childmodules: [
          ]
        },
        {
          modules: 'Create Plant',
          childmodules: [
          ]
        },
        {
          modules: 'Create SBU',
          childmodules: [
          ]
        },
        {
          modules: 'Create Sub Location',
          childmodules: [
          ]
        },
      ]
    },
    {
      mainmodules: 'Asset Relationship',
      submodules: [
        {
          modules: 'Relationship',
          childmodules: [
          ]
        }
      ]
    },
    {
      mainmodules: 'Print Barcodes',
      submodules: [
        {
          modules: 'Create Series',
          childmodules: [
          ]
        },
        {
          modules: 'Print Tages',
          childmodules: [

          ]
        },
        {
          modules: 'Reprint Tages',
          childmodules: [

          ]
        },
        {
          modules: 'Tag Status Report',
          childmodules: [
          ]
        },
      ]
    },
    {
      mainmodules: 'Audit',
      submodules: [
        {
          modules: 'Confirm Inventory Completion',
          childmodules: [
          ]
        },
        {
          modules: 'Inventory Project',
          childmodules: [
            {
              name: 'Create-Edit-Delete Project',
              id: '1',
            },
            {
              name: 'Create-Edit-Delete SC Project',
              id: '2'
            },
            {
              name: 'Reconcilliation',
              id: '3',
            },
            {
              name: 'Reconcilliation for SC',
              id: '4',
            },
            {
              name: 'Update Inventory Status',
              id: '5',
            },
            {
              name: 'Update SCInventory Status',
              id: '6',
            }
          ]
        },
        {
          modules: 'Send For Reconcilliation',
          childmodules: [

          ]
        },
        {
          modules: 'Tagging Details',
          childmodules: [
            {
              name: 'Approve Tagging Information',
              id: '1',
            },
            {
              name: 'View Additional Assets',
              id: '2'
            },
          ]
        },
      ]
    },
    {
      mainmodules: 'Assignment',
      submodules: [
        {
          modules: 'Assignment',
          childmodules: [
          ]
        }
      ]
    },
    {
      mainmodules: 'Asset Movement',
      submodules: [
        {
          modules: 'Cost Center Transfer',
          childmodules: [
            {
              name: 'Transfer Initiation-CC',
              id: '1',
            },
            {
              name: 'Financial Level T. Approver- CC',
              id: '2'
            },
            {
              name: 'Transfer Approver1-CC',
              id: '3',
            },
            {
              name: 'Transfer Approver2- CC',
              id: '4',
            },
            {
              name: 'Transfer Approver3- CC',
              id: '5',
            },
            {
              name: 'Physical Asset T. Approver- CC',
              id: '6',
            },
            {
              name: 'Receive Asset-CC',
              id: '7',
            },
            {
              name: 'Transfer Approver4- CC',
              id: '8',
            },
            {
              name: 'Transfer Approver5- CC',
              id: '9',
            },
          ]
        },
        {
          modules: 'Location Transfer',
          childmodules: [
            {
              name: 'Transfer Initiation- L',
              id: '1',
            },
            {
              name: 'Financial Level T. Approver- L',
              id: '2'
            },
            {
              name: 'Transfer Approver1- L',
              id: '3',
            },
            {
              name: 'Transfer Approver2- L',
              id: '4',
            },
            {
              name: 'Transfer Approver3- L',
              id: '5',
            },
            {
              name: 'Physical Asset T. Approver- L',
              id: '6',
            },
            {
              name: 'Receive Asset-SL',
              id: '7',
            },
            {
              name: 'Transfer Approver4- SL',
              id: '8',
            },
            {
              name: 'Transfer Approver5- SL',
              id: '9',
            },
          ]
        },
        {
          modules: 'Plant Transfer',
          childmodules: [
            {
              name: 'Transfer Initiation',
              id: '1',
            },
            {
              name: 'Financial Level T. Approver',
              id: '2'
            },
            {
              name: 'Approver 1 Level',
              id: '3',
            },
            {
              name: 'Approver 2 Level',
              id: '4',
            },
            {
              name: 'Approver 3 Level',
              id: '5',
            },
            {
              name: 'Physical Asset T. Approver',
              id: '6',
            },
            {
              name: 'Receive Asset',
              id: '7',
            },
            {
              name: 'Transfer Approver4',
              id: '8',
            },
            {
              name: 'Transfer Approver5',
              id: '9',
            },
          ]
        },
      ]
    },
    {
      mainmodules: 'Asset Retirement',
      submodules: [
        {
          modules: 'Active Assets',
          childmodules: [
            {
              name: 'Retirement Initiation',
              id: '1',
            },
            {
              name: 'Financial Level D. Approver',
              id: '2'
            },
            {
              name: 'Approver 1 Level',
              id: '3',
            },
            {
              name: 'Approver 2 Level',
              id: '4',
            },
            {
              name: 'Approver 3 Level',
              id: '5',
            },
            {
              name: 'Ready To Dispose',
              id: '6',
            },
            {
              name: 'Physical Asset D. Approver',
              id: '7',
            },
            {
              name: 'Retirement Approver4',
              id: '8',
            },
            {
              name: 'Retirement Approver5',
              id: '9',
            },
          ]
        },
        {
          modules: 'Expired Assets',
          childmodules: [
            {
              name: 'Retirement Initiation- Expired',
              id: '1',
            },
            {
              name: 'Financial Level D.Approver-Expired',
              id: '2'
            },
            {
              name: 'Approver 1 Level- Expired',
              id: '3',
            },
            {
              name: 'Approver 2 Level- Expired',
              id: '4',
            },
            {
              name: 'Approver 3 Level- Expired',
              id: '5',
            },
            {
              name: 'Ready To Dispose-Expired',
              id: '6',
            },
            {
              name: 'Physical Asset D.Approver-Expried',
              id: '7',
            },
            {
              name: 'Retirement Approver4- Expired',
              id: '8',
            },
            {
              name: 'Retirement Approver5- Expired',
              id: '9',
            },
          ]
        },
      ]
    },
    {
      mainmodules: 'Contract Management',
      submodules: [
        {
          modules: 'Contract Management',
          childmodules: [
          ]
        }
      ]
    },
    {
      mainmodules: 'Depreciation Calculation',
      submodules: [
        {
          modules: 'Depreciation Calculation',
          childmodules: [
          ]
        }
      ]
    },
    {
      mainmodules: 'ITAM',
      submodules: [
        {
          modules: 'Create Hardware assets',
          childmodules: [

          ]
        },
        {
          modules: 'Create Software Inventory',
          childmodules: [

          ]
        }
      ]
    },
    {
      mainmodules: 'Reports',
      submodules: [
        {
          modules: 'Asset at Risk',
          childmodules: [

          ]
        },
        {
          modules: 'Asset Dispatched Report',
          childmodules: [

          ]
        },
        {
          modules: 'Asset Disposal Report',
          childmodules: [
          ]
        },
        {
          modules: 'Asset Due for Expiry',
          childmodules: [
          ]
        },
        {
          modules: 'Asset Movement',
          childmodules: [
          ]
        },
        {
          modules: 'Asset not scan',
          childmodules: [
          ]
        },
        {
          modules: 'Asset Trail',
          childmodules: [
          ]
        },
        {
          modules: 'Assignment Report',
          childmodules: [
          ]
        },
        {
          modules: 'Audit Trail',
          childmodules: [
          ]
        },
        {
          modules: 'Damaged / Not in use assets',
          childmodules: [

          ]
        },
        {
          modules: 'ELP',
          childmodules: [

          ]
        },
        {
          modules: 'HW Change',
          childmodules: [
          ]
        },
        {
          modules: 'HW Discovery',
          childmodules: [
          ]
        },
        {
          modules: 'Inventory',
          childmodules: [
          ]
        },
        {
          modules: 'Inventory For SC',
          childmodules: [
          ]
        },
        {
          modules: 'IT Asset Due for Expiry',
          childmodules: [
          ]
        },
        {
          modules: 'Non-Verifiable',
          childmodules: [
          ]
        },
        {
          modules: 'Objectionable',
          childmodules: [
          ]
        },
        {
          modules: 'Register',
          childmodules: [

          ]
        },
        {
          modules: 'Retire History',
          childmodules: [

          ]
        },
        {
          modules: 'Revert Date',
          childmodules: [
          ]
        },
        {
          modules: 'Store Assets',
          childmodules: [
          ]
        },
        {
          modules: 'Store IT Asset',
          childmodules: [
          ]
        },
        {
          modules: 'SW Information',
          childmodules: [
          ]
        },
        {
          modules: 'SW Usage',
          childmodules: [
          ]
        },
        {
          modules: 'Tagging',
          childmodules: [
          ]
        },
        {
          modules: 'Unrecorded Transfers',
          childmodules: [
          ]
        },
        {
          modules: 'Verify Only',
          childmodules: [
          ]
        },
        {
          modules: 'View Transit Assets',
          childmodules: [
          ]
        }
      ]
    },
    {
      mainmodules: 'Dashboard',
      submodules: [
        {
          modules: 'DashBoard Rights',
          childmodules: [

          ]
        }
      ]
    }
  ]


  // panelOpenState=new Array<boolean>(this.CreateModules.length);
  // SubModules_OpenState=new Array(this.CreateModules.length);
  // CreateModules_OpenState=new Array<boolean>(this.CreateModules.length);

  panelOpenState = new Array<boolean>();
  panelOpenState1 = new Array<boolean>();
  SubModules_OpenState = new Array();
  CreateModules_OpenState = new Array<boolean>();

  step;


  rowData: any;
  StandardTypeData1: any[] = [];
  Standardcategoryid: any;
  StandviewDataAll: any[] = [];
  CreateModules2: any[] =
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
  submodules1: any[] =
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
  childmodules: any[] = [
    // {id:11,cname:"AssetinfoView(Custom1)"},
    // {id:12,cname:"AssetinfoView(Custom2)"},
    // {id:12,cname:"AssetinfoView(Custom3)"}
  ]
  childmodulefilled: any[] = [

  ]
  CreateModules2filled: any[] = [

  ]
  setStep(index: number, event) {
    this.step = index;
    this.Standardcategoryid = event.CategoryId
    this.panelOpenState[index] = true;
    for (let i = 0; i < 12; i++) {
      console.log(this.panelOpenState[i]);
    }
    this.GetCustomeView();
    debugger;
    for (let i = 0; i < this.CreateModules_OpenState.length; i++) {
      this.CreateModules_OpenState[i] = true;
    }
  }
  setStep1(index: number, event) {
    debugger;
    this.step = index;
    this.Standardcategoryid = event.CategoryId
    this.panelOpenState1[index] = true;
    for (let i = 0; i < 12; i++) {
      console.log(this.panelOpenState1[i]);
    }
    //this.GetStandardView();
    if (this.Standardcategoryid == event.CategoryId) {
      //this.GetCustomeView();
    }
    debugger;
    for (let i = 0; i < this.CreateModules_OpenState.length; i++) {
      this.CreateModules_OpenState[i] = true;
    }
  }

  changeState(index: number) {
    debugger;
    this.panelOpenState[index] = false;
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

  get f() { return this.roleForm.controls; };
  XLSXdata: any;
  constructor(
    private storage: ManagerService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private loader: AppLoaderService,
    private fb: FormBuilder,
    private userRoleService: UserRoleService,
    public toastr: ToastrService,
    private router: Router,
    public us: UserService,
    public alertService: MessageAlertService,
    public as: AssetService, private jwtAuth: JwtAuthService) {
    this.header = this.jwtAuth.getHeaders()
  }

  ngOnInit() {
    this.loader.open();
    this.buildItemForm();
    this.roleForm = new FormGroup({
      name: new FormControl('', [Validators.required])
    })

    this.SessionGroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.SessionRegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.SessionCompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.SessionUserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    this.GetInitiatedData();
    this.GetAllModule();
    this.GetStandardView();

    for (let i = 0; i < this.CreateModules_OpenState.length; i++) {
      this.CreateModules_OpenState[i] = false;
    }
    for (let i = 0; i < this.CreateModules_OpenState.length; i++) {
      this.SubModules_OpenState[i] = new Array<boolean>(this.CreateModules1[i].submodules.length);
      for (let j = 0; j < this.SubModules_OpenState[i].length; j++) {
        this.SubModules_OpenState[i][j] = false;
      }
    }
    this.loader.close();
  }

  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  GetInitiatedData() {
    let url5 = this.us.PermissionRightsByUserIdAndPageId(this.SessionGroupId, this.SessionUserId, this.SessionCompanyId, this.SessionRegionId, "73");
    forkJoin([url5]).subscribe(results => {
      if (!!results[0]) {
        debugger;
        this.ListOfPagePermission = JSON.parse(results[0]);
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
    })
  }

  buildItemForm() {
    this.AssetInfo = this.fb.group({
      Type: [''],
      UserType: [''],
      User: [''],
    })
  }

  addPermissions(p) {
    debugger;
    var idx = this.permissionList.indexOf(p);
    if (idx > -1) {
      this.permissionList.splice(idx, 1);
    }
    else {
      this.permissionList.push(p);
    }
  }

  bindvalueTypes2(module_id) {
    debugger;
    for (var i = 0; i < this.modules.length; i++) {
      for (var j = 0; j < this.modules[i].childmodule.length; j++) {
        if (module_id == this.modules[i].childmodule[j].id) {
          this.modules[i].childmodule[j].permissions = this.attributevalueTypes1;
        }
      }
    }
    debugger;
  }
  getAllModuleData() {
    for (var i = 0; i < this.modules.length; i++) {
      for (var j = 0; j < this.childmodulesList.length; j++) {
        if (this.modules[i].id == this.childmodulesList[j].parent_module_id) {
          this.modules[i].childmodule.push(this.childmodulesList[j]);
        }
      }
    }
    debugger;
  }
  bindUserwithLocation(u) {
    debugger;
    let user = {
      id: u.id,
      name: u.name,
      locationIds: [],
      locationNames: [],
    }
    this.userList.push(user);
  }
  remove(u) {
    var idx = this.userList.indexOf(u);
    if (idx > -1) {
      this.userList.splice(idx, 1);
    }
  }
  openDialog(u): void {
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = true;
    dialogconfig.autoFocus = true;
    dialogconfig.width = "50%";
    dialogconfig.data = {
      rowData: u
    };

    const dialogRef = this.dialog.open(LocationListDialogComponent, dialogconfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        debugger;
        u.locationNames = [];
        u.locationIds = result.locationIds;
        u.locationNames = result.locationNames.join(',')
      }
    });
  }

  optionClicked(event: Event, index) {
    event.stopPropagation();
  }

  toggleCreateModules(index: number, module) {
    if (!!module.OpenState) {
      module.OpenState = !module.OpenState;
    }
    else {
      module.OpenState = true;
    }
  }

  SelectAllPermissions(moduleType, module, submodules, childmodules) {
    debugger;
    if (moduleType == 'mainmodules') {
      if (!!module.OpenState) {
        module.OpenState = !module.OpenState;
      }
      else {
        module.OpenState = true;
      }
      module.isCheck = !module.isCheck;
      for (var i = 0; i < module.submodules.length; i++) {
        module.submodules[i].OpenState = module.OpenState;
        module.submodules[i].isCheck = module.isCheck;
        for (var j = 0; j < module.submodules[i].childmodules.length; j++) {
          module.submodules[i].childmodules[j].isCheck = module.isCheck;
        }
      }
    }

    if (moduleType == 'submodules') {
      submodules.isCheck = !submodules.isCheck;
      for (var i = 0; i < submodules.childmodules.length; i++) {
        submodules.childmodules[i].isCheck = submodules.isCheck;
      }
      module.isCheck = false;
      for (var i = 0; i < module.submodules.length; i++) {
        if (module.submodules[i].isCheck == true) {
          module.isCheck = true;
        }
      }
    }

    if (moduleType == 'Permissions') {
      childmodules.isCheck = !childmodules.isCheck;
      submodules.isCheck = false;
      for (var i = 0; i < submodules.childmodules.length; i++) {
        if (submodules.childmodules[i].isCheck == true) {
          submodules.isCheck = true;
        }
      }
      module.isCheck = false;
      for (var i = 0; i < module.submodules.length; i++) {
        if (module.submodules[i].isCheck == true) {
          module.isCheck = true;
        }
      }
    }

    if (moduleType == 'submodules1') {
      debugger;
      module.isCheck = !module.isCheck ;
      submodules[0].isCheck = true;
      // for (var j = 0; j < submodules.length; j++) {
      //   if (module.CategoryId == submodules[j].CategoryId) {
      //     if (submodules[j].isCheck == true) {
      //       submodules[0].isCheck = true;
      //     }
      //     submodules[j].isCheck = true;
      //   }
      //   else {
      //     submodules[j].isCheck = false;
      //     this.StandviewDataAll[j].isCheck = false;
      //   }
      // }
      for (var j = 1; j < submodules.length; j++) {
        if(submodules[j].isCheck == true && module.CategoryId == submodules[j].CategoryId){
          submodules[0].isCheck = false;
        }
        else{
          submodules[j].isCheck = false;
        }
      }
      this.submodules1 = submodules;
      // this.CreateModules2;
      // this.childmodules;

      // for(var i=0;i < this.CreateModules2.length;i++)
      // {
      //   if(this.CreateModules2[i].CategoryId == module.Custom2)
      //   {
      //     this.CreateModules2[i].isCheck = false;
      //     for(var j=0;j < this.childmodules.length;j++)
      //     {
      //         if(this.childmodules[j].CategoryId == module.CategoryId)
      //         {
      //           this.childmodules[j].isCheck = true;
      //         }
      //         else
      //         {
      //            this.childmodules[j].isCheck = false;  
      //         }
      //     }
      //   }
      //   else{
      //     this.CreateModules2[i].isCheck = true;
      //     for(var j=0;j < this.childmodules.length;j++)
      //     {
      //       this.childmodules[j].isCheck = false;
      //     }
      //   }
      // }
      // debugger;
      // this.childmodulefilled = this.childmodules;
      // this.CreateModules2filled = this.CreateModules2;
      // module.isCheck = !module.isCheck;
      // for (var j = 0; j < this.childmodules.length; j++)
      //   {
      //   if((this.submodules1[i].CategoryId == this.childmodules[j].Custom2)
      //   && this.childmodules[j].CategoryId == module.CategoryId)
      //   {
      //     this.submodules1[i].isCheck = false;
      //     this.childmodules[j].isCheck = true;
      //   }
      // }

      // if(module.isCheck == true)
      // {
      //   module.isCheck == false;
      // }


      // for (var i = 0; i < this.submodules1.length; i++) {
      //   for (var j = 0; j < this.childmodules.length; j++)
      //   {
      //   if((this.submodules1[i].CategoryId == this.childmodules[j].Custom2)
      //   && this.childmodules[j].CategoryId == module.CategoryId)
      //   {
      //     this.submodules1[i].isCheck = false;
      //     this.childmodules[j].isCheck = true;
      //   }
      // }
      //   // if(this.submodules1[i].isCheck == true ){
      //   //   module.isCheck = !module.isCheck;
      //   // }
      //   // for (var j = 0; j < this.childmodules[j].length; j++) {
      //   //   this.childmodules[j].isCheck = !module.isCheck;
      //   // }
      // }
      // var aa = {
      //   CategoryId:module.CategoryId,
      //   CategoryName:module.CategoryName,
      //   GroupId:module.GroupId,
      //   Status:module.Status,
      //   Custom1:module.Custom1,
      //   Custom2:module.Custom2,
      //   isCheck: module.isCheck,       
      //   OpenState : false, 
      //   submodules:[]
      // }
      // this.submodules1.push(aa);

      
    }

    if ((moduleType == 'submodules2')) {
      debugger;
      module.isCheck = !module.isCheck;
    }
    debugger;
  }

  onSubmit() {
    debugger;
    var flag = false;
    if (this.roleForm.valid) {
      for (var i = 0; i < this.CreateModules1.length; i++) {
        if (this.CreateModules1[i].isCheck == true) {
          flag = true;
        }
      }

      if (flag) {
        debugger;
        var isValid = this.roleForm.value.name.trim();
        if (!isValid || isValid == "" || isValid == null) {
          this.toastr.warning('Please enter Role name', this.message.AssetrakSays);
          return null;
        }
        this.loader.open();
        var Rolename = this.roleForm.value.name;
        var groupId = this.SessionGroupId;
        var regionId = this.SessionRegionId;
        var companyId = this.SessionCompanyId;
        var UserId = this.SessionUserId;

        this.userRoleService.CreateRoleByLevel(groupId, regionId, companyId, Rolename, UserId).subscribe(r => {
          debugger;
          this.loader.close();
          if (r == "Exists") {
            this.toastr.warning(this.message.RoleExits, this.message.AssetrakSays);
          }
          else if (r == "Fail") {
            this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
          }
          else if (r != null) {
            debugger;
            this.loader.open();
            var data = {
              List: JSON.stringify(this.CreateModules1),
              ListOfViewischeck: JSON.stringify(this.submodules1),
              ListOfView: JSON.stringify(this.StandviewDataAll),
              roleId: r,
              IsEditRole: false,
              UserId: this.SessionUserId
            }
            this.userRoleService.AddRoleToModuleAndPermission(data).subscribe(res => {
              debugger;
              this.loader.close();
              if (res == "Success") {
                this.toastr.success(this.message.RoleCreationSuccess, this.message.AssetrakSays);
              }
              else if (res == "Fail") {
                this.toastr.error(this.message.OperationFailed, this.message.AssetrakSays);
              }

              this.GetAllModule();
              this.GetStandardView();
            })
          }
        })
      }
      else {
        this.toastr.warning(this.message.SelectRole, this.message.AssetrakSays);
      }
    }
  }


  //Integration For CreateRole

  GetAllModule() {
    debugger;
    var groupId = this.SessionGroupId;
    var regionId = this.SessionRegionId;
    var companyId = this.SessionCompanyId;

    this.childmodules1 = [];
    this.CreateModules1 = [];
    this.roleForm.controls['name'].setValue(""),
      this.panelOpenState = new Array<boolean>();
    this.SubModules_OpenState = new Array();
    this.CreateModules_OpenState = new Array<boolean>();

    this.userRoleService.GetAllModuleDataByLevel(groupId, regionId, companyId).subscribe(r => {
      r.forEach(element => {

        if (!!element.ParentModuleId) {
          this.childmodules1.push(element)
        }
        else {
          var aa = {
            mainmoduleId: element.ModuleId,
            // mainmodules:element.ModuleName,
            mainmodules: this.MenuHeader[element.ModuleName],
            displayOrder: element.DisplayOrder,
            isCheck: element.IsCheck,
            OpenState: element.IsCheck,
            submodules: []
          }
          this.CreateModules1.push(aa)
        }
      });
      debugger;
      this.BindModuleSubModule();
    })
  }

  BindModuleSubModule() {
    debugger;
    for (var i = 0; i < this.CreateModules1.length; i++) {
      for (var j = 0; j < this.childmodules1.length; j++) {
        if (this.CreateModules1[i].mainmoduleId == this.childmodules1[j].ParentModuleId) {
          var aa = {
            subModuleid: this.childmodules1[j].ModuleId,
            // submodules:this.childmodules1[j].ModuleName,
            submodules: this.MenuHeader[this.childmodules1[j].ModuleName],
            parentModuleId: this.childmodules1[j].ParentModuleId,
            displayOrder: this.childmodules1[j].DisplayOrder,
            isCheck: this.childmodules1[j].IsCheck,
            childmodules: []
          }
          this.CreateModules1[i].submodules.push(aa);
        }
      }
    }
    debugger;
    this.GetModulePermissions();
  }


  GetModulePermissions() {
    debugger;
    this.userRoleService.GetAllModulePermissionDataforCreateRole().subscribe(r => {
      this.AllPermssionData = [];
      r.forEach(element => {
        debugger;
        this.AllPermssionData.push(element)
      });
      debugger;
      for (var i = 0; i < this.CreateModules1.length; i++) {
        for (var j = 0; j < this.CreateModules1[i].submodules.length; j++) {
          for (var k = 0; k < this.AllPermssionData.length; k++) {
            if (this.CreateModules1[i].submodules[j].subModuleid == this.AllPermssionData[k].ModuleId) {
              var aa = {
                id: this.AllPermssionData[k].ModulePermissionId,
                name: this.AllPermssionData[k].ModulePermissionName,
                parentModuleId: this.AllPermssionData[k].ModuleId,
                isCheck: this.AllPermssionData[k].IsCheck,
              }
              this.CreateModules1[i].submodules[j].childmodules.push(aa);
            }
          }
        }
      }
      debugger;
    })
    this.panelOpenState.length = this.CreateModules1.length;
    this.SubModules_OpenState.length = this.CreateModules1.length;
    this.CreateModules_OpenState.length = this.CreateModules1.length;
  }

  public selectedIndex;
  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.nextStep(tabChangeEvent.index);
    this.previousStep(tabChangeEvent.index);
  }
  previousStep(i) {
    this.selectedIndex = i;
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
    const dialogRef = this.dialog.open(ViewfieldComponent, dialogconfigcom1)

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
  GetStandardView() {
    debugger;

    this.as.Getallcategories(this.SessionGroupId).subscribe(response => {
      this.StandardTypeData1 = JSON.parse(response);

      this.childmodules = [];
      var p = 0;
      this.StandardTypeData1.forEach(r => {
        debugger;
        if (r.Status == "S") {
          var aa = {
            CategoryId: r.CategoryId,
            CategoryName: r.CategoryName,
            GroupId: r.GroupId,
            Status: r.Status,
            Custom1: r.Custom1,
            Custom2: r.Custom2,
            isCheck: true,
            OpenState: false,
            submodules: []
          }
          this.CreateModules2.push(aa);
          if (this.CreateModules2filled.length > 0 && r.CategoryId == this.CreateModules2filled[p].CategoryId) {
            this.CreateModules2[p].isCheck = this.CreateModules2filled[p].isCheck;
            p++;
          }
          // var aa = {
          //   CategoryId:r.CategoryId,
          //   CategoryName:r.CategoryName,
          //   GroupId:r.GroupId,
          //   Status:r.Status,
          //   Custom1:r.Custom1,
          //   Custom2:r.Custom2,
          //   isCheck: true,       
          //   OpenState : false, 
          //   submodules:[]
          // }
          // this.submodules1.push(aa);
        }
        if (r.Status == "C" && r.Custom2 == this.Standardcategoryid) {
          var aa = {
            CategoryId: r.CategoryId,
            CategoryName: r.CategoryName,
            GroupId: r.GroupId,
            Status: r.Status,
            Custom1: r.Custom1,
            Custom2: r.Custom2,
            isCheck: false,
            OpenState: false,
            submodules: []
          }

          this.childmodules.push(aa);
        }

      })
      this.GetAllViewData();
      //this.filteredFieldMulti.next(this.StandardTypeData.slice());
      debugger;
    })

  }
  GetCustomeView() {
    debugger;
    this.childmodules = [];
    this.as.Getallcategories(this.SessionGroupId).subscribe(response => {
      this.StandardTypeData1 = JSON.parse(response);
      this.childmodules = [];
      var k = 0;
      var p = 0;
      this.StandardTypeData1.forEach(r => {
        debugger;
        if (r.Status == "C" && r.Custom2 == this.Standardcategoryid) {
          var aa = {
            CategoryId: r.CategoryId,
            CategoryName: r.CategoryName,
            GroupId: r.GroupId,
            Status: r.Status,
            Custom1: r.Custom1,
            Custom2: r.Custom2,
            isCheck: false,
            OpenState: false,
            submodules: []
          }
          this.childmodules.push(aa);
          if (this.childmodulefilled.length > 0 && r.CategoryId == this.childmodulefilled[k].CategoryId) {
            this.childmodules[k].isCheck = this.childmodulefilled[k].isCheck;
            k++;
          }

        }
      })

      //this.filteredFieldMulti.next(this.StandardTypeData.slice());
      debugger;
    })
  }
  public openAddRole() {
    debugger
    this.router.navigateByUrl('h9/n');
  }


  GetAllViewData() {
    debugger;
    var ViewData = {
      AllStandviewData: JSON.stringify(this.StandardTypeData1),
      roleId: 0,
      comp: "create",
    }
    this.as.GetAllViewData(ViewData).subscribe(response => {
      this.StandviewDataAll = JSON.parse(response);


    })
    debugger;
  }

}
