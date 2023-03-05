
import { Component, OnInit, ViewChild, ElementRef, Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { Router, ActivatedRoute } from "@angular/router";
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { LocalStoreService } from 'app/shared/services/local-store.service';
import { LocationListDialogComponent } from 'app/components/admin/create-role/location-list-dialog/location-list-dialog.component';

import { MatTabChangeEvent } from '@angular/material/tabs';
import { UserRoleService } from 'app/components/services/UserRoleService';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import * as headers from '../../../../assets/Headers.json';
import * as resource from '../../../../assets/Resource.json';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

export interface PeriodicElement {
  configuration: string;
  enable: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { configuration: 'License Type', enable: "" },
  { configuration: 'AMC/Renewal Date', enable: "" },
  { configuration: 'Total Assets Licensed', enable: "" },
  { configuration: 'Users', enable: "" },
  { configuration: 'Companies', enable: "" },
  { configuration: 'Assets Licensed (Audit Only)', enable: "" },
];


@Component({
  selector: 'app-CreateModulePermission',
  templateUrl: './create_module_permissions.component.html',
  styleUrls: ['./create_module_permissions.component.scss'],
})
export class CreateModulePermissionComponent implements OnInit {
  displayedColumns: string[] = ['configuration', 'enable'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  header: any ;
  message: any = (resource as any).default;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  Type = ['By User', 'By Location'];
  UserType = ['Web User', 'Mobile User'];
  User = ['komalpatil@gmail.com'];

  LicenseType = ['Perpetual', 'SAAS'];
  SAPIntegration = ['Yes', 'No'];
  public AssetInfo: FormGroup;
  public LicenseDetails: FormGroup;

  CreateModules1: any[] = [];
  childmodules1: any[] = [];
  AllPermssionData: any[] = [];

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
  ];
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




  panelOpenState = new Array<boolean>();
  SubModules_OpenState = new Array();
  CreateModules_OpenState = new Array<boolean>();

  step;
  public selectedTabIndex = 0;

  setStep(index: number) {
    this.step = index;
    this.panelOpenState[index] = true;
    for (let i = 0; i < 12; i++) {
      console.log(this.panelOpenState[i]);
    }
  }

  changeState(index: number) {
    this.panelOpenState[index] = false;
  }


  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  nextTab(i) {
    this.selectedTabIndex = i;
    //console.log(i);
  }
  previousTab(i) {
    this.selectedTabIndex = i;
    console.log(i);
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.nextTab(tabChangeEvent.index);
    this.previousTab(tabChangeEvent.index);
    console.log(tabChangeEvent);
  }

  get f() { return this.roleForm.controls; };
  XLSXdata: any;
  ProfileId :any;
  constructor(
    private storage: ManagerService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private loader: AppLoaderService,
    private fb: FormBuilder,
    private userRoleService: UserRoleService,
    public alertService: MessageAlertService,
    private jwtAuth:JwtAuthService
  ) 
  {
    this.header = this.jwtAuth.getHeaders()
   }

  ngOnInit() {
    this.buildItemForm();
    this.buildLicenseForm();
    this.roleForm = new FormGroup({
      name: new FormControl('')
    })

    this.ProfileId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_PROFILE);
    if (this.ProfileId == '0') {
      this.alertService.alert({ message: this.message.NotAuthorisedToAccess, title: this.message.AssetrakSays })
        .subscribe(res => {
          this.router.navigateByUrl('h/a')
        })
    }
    else{
      this.GetAllModule();
    }   

    for (let i = 0; i < this.CreateModules_OpenState.length; i++) {
      this.CreateModules_OpenState[i] = false;
    }
    for (let i = 0; i < this.CreateModules_OpenState.length; i++) {
      this.SubModules_OpenState[i] = new Array<boolean>(this.CreateModules1[i].submodules.length);
      for (let j = 0; j < this.SubModules_OpenState[i].length; j++) {
        this.SubModules_OpenState[i][j] = false;
      }
    }   

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  buildItemForm() {
    this.AssetInfo = this.fb.group({
      Type: [''],
      UserType: [''],
      User: [''],
    })
  }

  buildLicenseForm() {
    this.LicenseDetails = this.fb.group({
      LicenseType: [''],
      RenewalDate: [''],
      SAPIntegration: [''],
      TotalAssetsLicensed: [''],
      Users: [''],
      Companies: [''],
      AssetsAudited: [''],
    })
  }

  addPermissions(p) {

    var idx = this.permissionList.indexOf(p);
    if (idx > -1) {
      this.permissionList.splice(idx, 1);
    }
    else {
      this.permissionList.push(p);
    }
  }

  bindvalueTypes2(module_id) {

    for (var i = 0; i < this.modules.length; i++) {
      for (var j = 0; j < this.modules[i].childmodule.length; j++) {
        if (module_id == this.modules[i].childmodule[j].id) {
          this.modules[i].childmodule[j].permissions = this.attributevalueTypes1;
        }
      }
    }

  }
  getAllModuleData() {
    for (var i = 0; i < this.modules.length; i++) {
      for (var j = 0; j < this.childmodulesList.length; j++) {
        if (this.modules[i].id == this.childmodulesList[j].parent_module_id) {
          this.modules[i].childmodule.push(this.childmodulesList[j]);
        }
      }
    }

  }
  bindUserwithLocation(u) {

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


  SelectAllPermissions(moduleType, module) {


    if (moduleType == 'mainmodules') {
      if (!!module.OpenState) {
        module.OpenState = !module.OpenState;
      }
      else {
        module.OpenState = true;
      }
      module.isActive = !module.isActive;
      for (var i = 0; i < module.submodules.length; i++) {
        module.submodules[i].isActive = module.isActive;
        for (var j = 0; j < module.submodules[i].childmodules.length; j++) {
          module.submodules[i].childmodules[j].isActive = module.isActive;
        }
      }
    }

    if (moduleType == 'submodules') {
      module.isActive = !module.isActive;
      for (var i = 0; i < module.childmodules.length; i++) {
        module.childmodules[i].isActive = module.isActive;
      }
    }

    if (moduleType == 'Permissions') {
      module.isActive = !module.isActive;
    }

  }

  onSubmit() {

    var data = {
      List: JSON.stringify(this.CreateModules1)
    }
    // var List=JSON.stringify(this.CreateModules1);
    this.userRoleService.UpdateModuleAndPermissionConfiguration(data).subscribe(r => {


      this.GetAllModule();
    })
  }

  //Integration For Module&Permissions

  GetAllModule() {

    this.childmodules1 = [];
    this.CreateModules1 = [];
    this.userRoleService.GetAllModuleData().subscribe(r => {
      r.forEach(element => {

        if (!!element.ParentModuleId) {
          this.childmodules1.push(element)
        }
        else {
          var aa = {
            mainmoduleId: element.ModuleId,
            mainmodules: element.ModuleName,
            displayOrder: element.DisplayOrder,
            isActive: element.IsActive,
            OpenState: element.IsActive,
            submodules: []
          }
          this.CreateModules1.push(aa)
        }
      });

      this.BindModuleSubModule();
    })
  }

  BindModuleSubModule() {

    for (var i = 0; i < this.CreateModules1.length; i++) {
      for (var j = 0; j < this.childmodules1.length; j++) {
        if (this.CreateModules1[i].mainmoduleId == this.childmodules1[j].ParentModuleId) {
          var aa = {
            subModuleid: this.childmodules1[j].ModuleId,
            submodules: this.childmodules1[j].ModuleName,
            parentModuleId: this.childmodules1[j].ParentModuleId,
            displayOrder: this.childmodules1[j].DisplayOrder,
            isActive: this.childmodules1[j].IsActive,
            childmodules: []
          }
          this.CreateModules1[i].submodules.push(aa);
        }
      }
    }

    this.GetModulePermissions();
  }


  GetModulePermissions() {

    this.userRoleService.GetAllModulePermissionData().subscribe(r => {
      this.AllPermssionData = [];
      r.forEach(element => {

        this.AllPermssionData.push(element)
      });

      for (var i = 0; i < this.CreateModules1.length; i++) {
        for (var j = 0; j < this.CreateModules1[i].submodules.length; j++) {
          for (var k = 0; k < this.AllPermssionData.length; k++) {
            if (this.CreateModules1[i].submodules[j].subModuleid == this.AllPermssionData[k].ModuleId) {
              var aa = {
                id: this.AllPermssionData[k].ModulePermissionId,
                name: this.AllPermssionData[k].ModulePermissionName,
                parentModuleId: this.AllPermssionData[k].ModuleId,
                isActive: this.AllPermssionData[k].IsActive,
              }
              this.CreateModules1[i].submodules[j].childmodules.push(aa);
            }
          }
        }
      }

    })
    this.panelOpenState.length = this.CreateModules1.length;
    this.SubModules_OpenState.length = this.CreateModules1.length;
    this.CreateModules_OpenState.length = this.CreateModules1.length;
  }



}
