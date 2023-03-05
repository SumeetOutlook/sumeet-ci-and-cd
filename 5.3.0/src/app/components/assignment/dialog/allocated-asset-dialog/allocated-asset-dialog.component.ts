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
import { ITAssetsService } from '../../../services/ITAssetsService';
import { UserService } from '../../../services/UserService';
import { AssetService } from '../../../services/AssetService';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { ToastrService } from 'ngx-toastr';
import { AppConfirmService } from '../../../../shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { R } from '@angular/cdk/keycodes';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { take, takeUntil } from 'rxjs/operators';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { GroupService } from '../../../services/GroupService';

@Component({
  selector: 'app-allocated-asset-dialog',
  templateUrl: './allocated-asset-dialog.component.html',
  styleUrls: ['./allocated-asset-dialog.component.scss']
})
export class AllocatedAssetDialogComponent implements OnInit {

  Headers: any = [];
  message: any;
  selectemployee :boolean = false;
  submitted: boolean = false;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('table', { static: false }) table: any;

  displayedColumns: string[] = ['select', 'Icon', 'Inventory No.', 'Asset No.', 'Sub No.', 'AssetCondition', 'Asset Class', 'Asset Name', 'Asset Description', 'Serial No', 'IT Serial No', 'Plant', 'Cost', 'WDV', 'Inventory Indicator', 'CustodianDetails', 'UserDetails', 'AssetCriticality']
  displayedColumns1: string[] = ['select', 'Inventory No.', 'Asset No.', 'Sub No.', 'Asset Class', 'Asset Name', 'Asset Description', 'Serial No', 'IT Serial No', 'allocatedStatus', 'Plant', 'Cost', 'WDV', 'Inventory Indicator', 'CustodianDetails', 'UserDetails', 'AllocateBy', 'allocatedDate', 'AllocationType', 'RevertDate', 'UserType']
  dataSource: any;
  dataSourceNew: any;
  json: any;
  bindData: any[] = [];
  dialogForm: FormGroup;
  selection = new SelectionModel<any>(true, []);
  selectionNew = new SelectionModel<any>(true, []);
  today = new Date();

  CompanyId: any;
  LocationId: any;
  UserId: any;
  GroupId: any;
  layerid: any;
  sbufilter: any;
  AssetLife: any;
  Name: any;
  IP_Address: any;
  Device_ID: any;
  Device_Type: any;

  UserTypeList: any[] = [];

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
    private ITAssetsService: ITAssetsService,
    private us: UserService,
    private as: AssetService,
    private jwtAuth: JwtAuthService,
    private storage: ManagerService,
    private groupService: GroupService
  ) {
    this.Headers = this.jwtAuth.getHeaders();
    this.message = this.jwtAuth.getResources();
    this.UserTypeList = [
      { value: 'AD employee', viewValue: this.Headers.ADEmployee },
      { value: 'Other User', viewValue: this.Headers.OtherUser },
      // { value: 'Other employee', viewValue: this.Headers.OtherEmployee },
    ];
  }
  get f() { return this.dialogForm.controls; };
  isActiveflag :any;
  ngOnInit(): void {

    this.IP_Address = this.storage.get(Constants.SESSSION_STORAGE, Constants.IP_Address);
    this.Device_ID = this.storage.get(Constants.SESSSION_STORAGE, Constants.Device_ID);
    this.Device_Type = this.storage.get(Constants.SESSSION_STORAGE, Constants.Device_Type);

    this.CompanyId = this.data.configdata.CompanyId;
    this.LocationId = this.data.configdata.LocationId;
    this.UserId = this.data.configdata.UserId;
    this.GroupId = this.data.configdata.GroupId;
    this.Name = this.data.configdata.Name;
    this.isActiveflag = this.data.configdata.Flag;

    this.dialogForm = this.fb.group({
      EmployeeTypeeCtrl: ['', [Validators.required]],
      AllocationTypeCtrl: ['', [Validators.required]],
      RevertDateCtrl: [''],
      UserCtrl: ['', [Validators.required]],
      CustodianCtrl: [''],
    })
    this.bindData = [];
    this.bindData = this.data.configdata.bindData;
    if (!!this.data.configdata.AssetList) {
      this.buildItemForm(this.data);
    }
    else {
      this.onChangeDataSource(this.bindData);
    }

    // this.buildItemForm(this.data);
    this.getAllocationTypeList();
    this.GetEmployeeBySearchKeyWordJson();
    this.CheckResignationConfigExits();
    //this.userFilter();
    //this.custodianFilter();

  }

  buildItemForm(item) {

   // var CompanyId = this.data.configdata.CompanyId;
  //  var AssetList = this.data.configdata.AssetList;
    var assetDetails =
    {
      CompanyId :this.data.configdata.CompanyId,
      PrefarIdlist :this.data.configdata.AssetList
    }
    this.loader.open();
    this.as.GetAssetsForUserAllocation(assetDetails).subscribe(r => {

      this.loader.close();
      // this.bindData = JSON.parse(r);

      if (!!r) {
        var data = JSON.parse(r);
        data.forEach(element => {
          this.bindData.push(element);
        });
      }
      this.onChangeDataSource(this.bindData);

    })

    //var sendDate = new Date();
    //this.dialogForm.get('retireDateCtrl').setValue(sendDate);
  }

  onChangeDataSource(value) {
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.masterToggle();
  }
  AllocationTypeList: any[] = [];
  EmailList: any[] = [];
  getAllocationTypeList() {

    this.ITAssetsService.getAllocationTypeList().subscribe(r => {

      this.AllocationTypeList = JSON.parse(r);
    })
  }

  GetEmployeeBySearchKeyWordJson() {

    this.us.GetEmployeeBySearchKeyWord(this.GroupId, "", true, this.CompanyId).subscribe(r => {

      this.EmailList = r;
      console.log(this.EmailList);
      this.getFilterUser();
      this.getFilterCustodian();
    })
  }
  filteredOptions: Observable<string[]>;
  filteredOptionsForCust: Observable<string[]>;
  public userMultiFilterCtrl: FormControl = new FormControl();
  userFilter() {
    this.filteredOptions = this.userMultiFilterCtrl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }
  private _filter(value: string): string[] {
    debugger;
    const filterValue = value.toLowerCase();
    return this.EmailList.filter(option => option.toLowerCase().includes(filterValue));
  }

  Clear(flag) {
    if (flag == 'user')
      this.dialogForm.controls['UserCtrl'].setValue("");
    else
      this.dialogForm.controls['CustodianCtrl'].setValue("");

    this.ShowNewDataSource = false;
    this.showAssignmentButton = false;
  }

  custodianFilter() {
    this.filteredOptionsForCust = this.dialogForm.controls['CustodianCtrl'].valueChanges
      .pipe(
        startWith(''),
        map(v => this._filterCustodian(v))
      );
  }
  private _filterCustodian(v: string): string[] {
    const filterValue1 = v.toLowerCase();
    return this.EmailList.filter(x => x.toLowerCase().includes(filterValue1));
  }

  public userFilterCtrl: FormControl = new FormControl();
  public filteredUser: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();

  getFilterUser() {
    this.filteredUser.next(this.EmailList.slice());
    this.userFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterUser();
      });
  }
  protected filterUser() {
    if (!this.EmailList) {
      return;
    }
    let search = this.userFilterCtrl.value;
    if (!search) {
      this.filteredUser.next(this.EmailList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredUser.next(
      this.EmailList.filter(x => x.toLowerCase().indexOf(search) > -1)
    );
  }

  public custodianFilterCtrl: FormControl = new FormControl();
  public filteredCustodian: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  getFilterCustodian() {
    this.filteredCustodian.next(this.EmailList.slice());
    this.custodianFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCustodian();
      });
  }
  protected filterCustodian() {
    if (!this.EmailList) {
      return;
    }
    let search = this.custodianFilterCtrl.value;
    if (!search) {
      this.filteredCustodian.next(this.EmailList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCustodian.next(
      this.EmailList.filter(x => x.toLowerCase().indexOf(search) > -1)
    );
  }
  resignationCongiguration: any;
  CheckResignationConfigExits() {
    var GroupId = this.GroupId;
    this.groupService.GetConfigurationValue(GroupId, 65)
      .subscribe(r => {
        debugger;
        this.resignationCongiguration = 15;
        if (!r) {
          this.resignationCongiguration = r;
        }
        console.log(r);
      })
  }

  txtCustodian: any;
  txtCustodianEmail: any;
  txtUserName: any;
  txtUserEmail: any;
  AssetType: any;
  btnDisabled: boolean = true;
  btnDisabled1: boolean = true;
  showAssignmentButton: boolean = false;
  GetbyEmail(SearchEmail) {
    debugger;
    this.btnDisabled = true;
    this.ShowNewDataSource = false;
    this.showAssignmentButton = false;
    this.txtUserEmail = "";
    this.txtUserName = "";
    var EmployeeType = this.dialogForm.get('EmployeeTypeeCtrl').value;
    SearchEmail = this.dialogForm.get('UserCtrl').value;
    if (!!SearchEmail && SearchEmail != "" && SearchEmail != undefined) {
      this.showAssignmentButton = true;
      if (SearchEmail.indexOf("|") >= 0) {
        var email = SearchEmail.split("|")[2];
        email = email.replace(/ +/g, "");
      }
      else {
        var email = SearchEmail;
      }
      var IsUsernameChecked = true;
      if (this.checkEmail(email)) {
        this.loader.open();
        this.us.GetbyEmailOrEmployeeId(this.GroupId, email, IsUsernameChecked).subscribe(r => {
          debugger;
          this.loader.close();
          if (r != null && r != "") {
            var emplist = JSON.parse(r);
            // 
            if(this.isActiveflag  == true){
            if (!!emplist.RelievingDate || !!emplist.ResignationDate) {
              //Relieving date updated (Whether or not resignation date is available)
              if (!!emplist.RelievingDate) {
                var date1 = new Date(emplist.RelievingDate);
                var date2 = new Date();
                var relievingDate = this.datepipe.transform(emplist.RelievingDate, 'dd-MMM-yyyy');

                var Time = date1.getTime() - date2.getTime();
                var Days = Time / (1000 * 3600 * 24); //Diference in Days
                //Relieving date updated (Relieving date is within 2 days of the current date)

                if (Days >= this.resignationCongiguration   ) {
                  this.confirmService.confirm({ message: "Employee to whom the assets are being assigned has resigned and is expected to be relieved on " + relievingDate + ". Do you still want to continue?", title: this.message.AssetrakSays })
                    .subscribe(res => {
                      debugger;
                      if (!!res) {
                        this.btnDisabled = false;
                        this.txtUserName = emplist.FirstName + " " + emplist.LastName;
                        if ((EmployeeType == 'AD employee')) {
                          this.btnDisabled1 = false;
                        }
                      }
                      else {
                        this.dialogForm.get('UserCtrl').setValue("");
                      }
                    })
                }
                else if(Days <= this.resignationCongiguration){
                  this.toastr.warning("Employee to whom the assets are being assigned has resigned and is expected to be relieved on " + relievingDate + ". New assets cannot be assigned", this.message.AssetrakSays);
                  this.dialogForm.get('UserCtrl').setValue("");
                }
              }
              else if (!!emplist.ResignationDate ) {
                this.confirmService.confirm({ message: "Employee to whom the assets are being assigned has resigned. Do you still want to continue?", title: this.message.AssetrakSays })
                  .subscribe(res => {
                    debugger;
                    if (!!res) {
                      this.btnDisabled = false;
                      this.txtUserName = emplist.FirstName + " " + emplist.LastName;
                      if ((EmployeeType == 'AD employee')) {
                        this.btnDisabled1 = false;
                      }
                    }
                    else {
                      this.dialogForm.get('UserCtrl').setValue("");
                    }
                  })
              }
            }
            else {
              this.btnDisabled = false;
              this.txtUserName = emplist.FirstName + " " + emplist.LastName;
              if ((EmployeeType == 'AD employee')) {
                this.btnDisabled1 = false;
              }
            }
          }
            else {
              this.btnDisabled = false;
              this.txtUserName = emplist.FirstName + " " + emplist.LastName;
              if ((EmployeeType == 'AD employee')) {
                this.btnDisabled1 = false;
              }
            }
          }
          else {
            if (EmployeeType === "Other employee" || EmployeeType === "Other User") {
              this.btnDisabled = false;
              this.txtUserName = email;
              if ((EmployeeType == 'AD employee')) {
                this.btnDisabled1 = false;
              }
            }
            else {
              this.txtUserEmail = "";
              this.txtUserName = "";
              this.dialogForm.get('UserCtrl').setValue("");
              this.btnDisabled = true;
              this.toastr.warning(this.message.IncorrectUserEmail, this.message.AssetrakSays);
            }
          }
        })
      }
      else {
        this.btnDisabled = true;
        //this.dialogForm.get('UserCtrl').setValue("");
      }
    }
    else {
      this.btnDisabled = true;
      this.ShowNewDataSource = false;
      this.showAssignmentButton = false;
    }
  }
  GetbyEmployeeId(SearchEmail) {
    debugger;
    this.btnDisabled1 = true;
    this.ShowNewDataSource = false;
    this.showAssignmentButton = false;
    this.txtCustodianEmail = "";
    this.txtCustodian = "";
    var EmployeeType = this.dialogForm.get('EmployeeTypeeCtrl').value;
    SearchEmail = this.dialogForm.get('CustodianCtrl').value;
    if (!!SearchEmail && SearchEmail != "" && SearchEmail != undefined) {
      this.showAssignmentButton = true;
      if (SearchEmail.indexOf("|") >= 0) {
        var email = SearchEmail.split("|")[2];
        email = email.replace(/ +/g, "");
      }
      else {
        var email = SearchEmail;
      }
      var IsUsernameChecked = true;
      if (this.checkEmail(email)) {
        this.loader.open();
        this.us.GetbyEmailOrEmployeeId(this.GroupId, email, IsUsernameChecked).subscribe(r => {
          debugger;
          this.loader.close();
          if (r != null && r != "") {
            var emplist = JSON.parse(r);
            // 
            // 
            if(this.isActiveflag  == true){
            if (!!emplist.RelievingDate || !!emplist.ResignationDate) {
              //Relieving date updated (Whether or not resignation date is available)
              if (!!emplist.RelievingDate) {
                var date1 = new Date(emplist.RelievingDate);
                var date2 = new Date();
                var relievingDate = this.datepipe.transform(emplist.RelievingDate, 'dd-MMM-yyyy');

                var Time = date1.getTime() - date2.getTime();
                var Days = Time / (1000 * 3600 * 24); //Diference in Days
                //Relieving date updated (Relieving date is within 2 days of the current date)
               
                if (Days >= this.resignationCongiguration) {
                  this.confirmService.confirm({ message: "Employee to whom the assets are being assigned has resigned and is expected to be relieved on " + relievingDate + ". Do you still want to continue?", title: this.message.AssetrakSays })
                    .subscribe(res => {
                      debugger;
                      if (!!res) {
                        this.btnDisabled1 = false;
                        this.txtCustodian = emplist.FirstName + " " + emplist.LastName;                        
                      }
                      else {
                        this.dialogForm.get('CustodianCtrl').setValue("");
                      }
                    })
                }
                else  if(Days <= this.resignationCongiguration) {
                  this.toastr.warning("Employee to whom the assets are being assigned has resigned and is expected to be relieved on " + relievingDate + ". New assets cannot be assigned", this.message.AssetrakSays);
                  this.dialogForm.get('CustodianCtrl').setValue("");
                }
              }
              else if (!!emplist.ResignationDate) {
                this.confirmService.confirm({ message: "Employee to whom the assets are being assigned has resigned. Do you still want to continue?", title: this.message.AssetrakSays })
                  .subscribe(res => {
                    debugger;
                    if (!!res) {
                      this.btnDisabled1 = false;
                      this.txtCustodian = emplist.FirstName + " " + emplist.LastName; 
                    }
                    else {
                      this.dialogForm.get('CustodianCtrl').setValue("");
                    }
                  })
              }
            
            
            }
            else {
              this.btnDisabled1 = false;
              this.txtCustodian = emplist.FirstName + " " + emplist.LastName;               
            }
          }
            else {
              this.btnDisabled1 = false;
              this.txtCustodian = emplist.FirstName + " " + emplist.LastName;               
            }
          }
          else {
            this.btnDisabled1 = true;
            this.txtCustodianEmail = "";
            this.txtCustodian = "";
            this.dialogForm.get('CustodianCtrl').setValue("");
            this.toastr.warning(this.message.IncorrectCustodianEmail, this.message.AssetrakSays);
            if ((EmployeeType == 'AD employee')) {
              this.btnDisabled1 = false;
            }
          }
        })
      }
      else {
        this.btnDisabled1 = true;
        //this.dialogForm.get('CustodianCtrl').setValue("");
        if ((EmployeeType == 'AD employee')) {
          this.btnDisabled1 = false;
        }
      }
    }
    else {
      this.btnDisabled1 = true;
      if ((EmployeeType == 'AD employee')) {
        this.btnDisabled1 = false;
      }
    }
  }
  GetbyEmailOrEmployeeIdJson(SearchEmail, Type) {

    this.btnDisabled = true;
    if (Type == 'user') {
      SearchEmail = this.dialogForm.get('UserCtrl').value;
      this.txtUserEmail = "";
      this.txtUserName = "";
    }
    else {
      SearchEmail = this.dialogForm.get('CustodianCtrl').value;
      this.txtCustodianEmail = "";
      this.txtCustodian = "";
    }

    if (SearchEmail != "" && SearchEmail != "" && SearchEmail != undefined) {
      if (SearchEmail.indexOf("|") >= 0) {
        var email = SearchEmail.split("|")[2];
        email = email.replace(/ +/g, "");
      }
      else {
        var email = SearchEmail;
      }
      var IsUsernameChecked = true;
      if (this.checkEmail(email)) {

        this.us.GetbyEmailOrEmployeeId(this.GroupId, email, IsUsernameChecked).subscribe(r => {
          debugger;
          if (r != null && r != "") {
            var emplist = JSON.parse(r);
            if (Type === 'user') {
              this.txtUserName = emplist.FirstName + " " + emplist.LastName;
            }
            else {
              this.txtCustodian = emplist.FirstName + " " + emplist.LastName;
            }
          }
          else {
            debugger;
            var EmployeeType = this.dialogForm.get('EmployeeTypeeCtrl').value;
            if (EmployeeType === "Other employee" || EmployeeType === "Other User") {
              if (this.checkEmail(email)) {
                if (Type === 'user') {
                  this.txtUserName = email;
                }
                else {
                  this.txtCustodianEmail = "";
                  this.txtCustodian = "";
                  this.dialogForm.get('CustodianCtrl').setValue("");
                  this.toastr.warning(this.message.IncorrectCustodianEmail, this.message.AssetrakSays);
                  this.btnDisabled = true;
                }
              }
              else {
                this.CheckUser(Type);
              }
            }
            else {
              this.CheckUser(Type);
            }
          }

          //======= 
          var EmployeeType = this.dialogForm.get('EmployeeTypeeCtrl').value;
          var user = this.dialogForm.get('UserCtrl').value;
          var Custodian = this.dialogForm.get('CustodianCtrl').value;
          if ((EmployeeType == 'AD employee' && !!user) || (EmployeeType == 'Other User' && !!user && !!Custodian)) {
            this.btnDisabled = false;
          }
        })
      }
      else {
        this.CheckUser(Type);
      }
    }
    else {
      var EmployeeType = this.dialogForm.get('EmployeeTypeeCtrl').value;
      var user = this.dialogForm.get('UserCtrl').value;
      var Custodian = this.dialogForm.get('CustodianCtrl').value;
      if ((EmployeeType == 'AD employee' && !!user) || (EmployeeType == 'Other User' && !!user && !!Custodian)) {
        this.btnDisabled = false;
      }
    }
  }
  CheckUser(Type) {
    debugger;
    if (Type === 'user') {
      this.txtUserEmail = "";
      this.txtUserName = "";
      this.dialogForm.get('UserCtrl').setValue("");
      this.toastr.warning(this.message.IncorrectUserEmail, this.message.AssetrakSays);
      this.btnDisabled = true;
    }
    else {
      this.txtCustodianEmail = "";
      this.txtCustodian = "";
      this.dialogForm.get('CustodianCtrl').setValue("");
      this.toastr.warning(this.message.IncorrectCustodianEmail, this.message.AssetrakSays);
      this.btnDisabled = true;
    }
  }
  userRequired: boolean = true;
  EmployeeType(employeeType) {

    this.userRequired = true;
    // this.dialogForm.get('UserCtrl').setValue("");    
    // this.dialogForm.get('UserCtrl').clearValidators();
    // this.dialogForm.get('UserCtrl').updateValueAndValidity();
    this.dialogForm.get('CustodianCtrl').setValue("");
    this.dialogForm.get('CustodianCtrl').clearValidators();
    this.dialogForm.get('CustodianCtrl').updateValueAndValidity();
    if (employeeType === "AD employee") {
      this.selectemployee =false;
      this.dialogForm.get('UserCtrl').setValue("");
       this.dialogForm.get('UserCtrl').setValidators([Validators.required]);
      // this.dialogForm.get('UserCtrl').updateValueAndValidity();
    }
    else {
      this.userRequired = false;
      this.selectemployee =true;
      this.dialogForm.get('UserCtrl').setValue("");
      this.dialogForm.get('UserCtrl').setValidators([Validators.required,Validators.email]);
      this.dialogForm.get('UserCtrl').updateValueAndValidity();
      this.dialogForm.get('CustodianCtrl').setValidators([Validators.required]);
      this.dialogForm.get('CustodianCtrl').updateValueAndValidity();
    }
  }

  RevertDate: boolean = false;
  SetAllocationType(type) {

    this.RevertDate = false;
    if (type.AllocationType === 'Temporary') {
      this.RevertDate = true;
      this.dialogForm.get('RevertDateCtrl').setValidators([Validators.required]);
      this.dialogForm.get('RevertDateCtrl').updateValueAndValidity();
    } else {
      this.dialogForm.get('RevertDateCtrl').clearValidators();
      this.dialogForm.get('RevertDateCtrl').updateValueAndValidity();
    }
  }

  Submit() {
  debugger;
    if (this.selection.selected.length > 0) {
      var prefarIds = [];
      const numSelected = this.selection.selected.length;
      for (var i = 0; i < numSelected; i++) {
        prefarIds.push(this.selection.selected[i].PreFarId);
      }
      var user = ''; var custodian = ''; var userEmail = ''; var custodianEmail = '';
      this.AssetType = 'Capitalized Assets';
      this.txtUserEmail = !this.dialogForm.get('UserCtrl').value ? '' : this.dialogForm.get('UserCtrl').value;
      this.txtCustodianEmail = !this.dialogForm.get('CustodianCtrl').value ? '' : this.dialogForm.get('CustodianCtrl').value;
      var employeeType = !this.dialogForm.get('EmployeeTypeeCtrl').value ? '' : this.dialogForm.get('EmployeeTypeeCtrl').value;

      if (employeeType != "Other User" && employeeType != "Other employee") {
        if (this.txtUserEmail.indexOf("|") >= 0) {
          userEmail = this.txtUserEmail.split("|")[2];
          userEmail = userEmail.replace(/ +/g, "");
          user = !this.txtUserName ? this.txtUserEmail.split("|")[1] : this.txtUserName;
        }
        else {
          if (this.checkEmail(this.txtUserEmail)) {
            userEmail = this.txtUserEmail;
            user = !this.txtUserName ? this.txtUserEmail : this.txtUserName;
          }
          else {
            this.toastr.warning(this.message.IncorrectUserEmail, this.message.AssetrakSays);
            return false;
          }
        }
      }
      else {
        if (!!this.txtUserEmail || this.txtUserEmail != "") {
          if (this.txtUserEmail.indexOf("|") >= 0) {
            userEmail = this.txtUserEmail.split("|")[2];
            userEmail = userEmail.replace(/ +/g, "");
            user = !this.txtUserName ? this.txtUserEmail.split("|")[1] : this.txtUserName;
          }
          else {
            userEmail = this.txtUserEmail;
            if (userEmail.includes("@")) {
              if (!!this.txtUserName || this.txtUserName.includes("@")) {
                user = this.txtUserName.split("@")[0];
              }
              else {
                user = !this.txtUserName ? this.txtUserEmail : this.txtUserName;;
              }
            }
            else {
              userEmail = "";
              user = "";
            }
          }
        }
      }
      debugger;
      if (this.txtCustodianEmail.indexOf("|") >= 0) {
        custodianEmail = this.txtCustodianEmail.split("|")[2];
        custodianEmail = custodianEmail.replace(/ +/g, "");
        custodian = !this.txtCustodian ? this.txtCustodianEmail.split("|")[1] : this.txtCustodian;
      }
      else {
        if (this.checkEmail(this.txtCustodianEmail)) {
          custodianEmail = this.txtCustodianEmail;
          custodian = !this.txtCustodian ? this.txtCustodianEmail : this.txtCustodian;
        }
        else {
          if ((employeeType == "Other User" || employeeType == "Other employee") && custodianEmail == "") {
            this.toastr.warning(this.message.IncorrectCustodianEmail, this.message.AssetrakSays);
            return false;
          }
        }
      }

      //var allocatedBy = ",AllocationBy='" + $scope.FirstName + " " + $scope.LastName + "',";
      var allocatedBy = ",AllocationBy='" + this.Name + "',";
      var allocatedDate = this.datepipe.transform(new Date(), 'dd-MMM-yyyy');
      var allocationType = !this.dialogForm.get('AllocationTypeCtrl').value ? "" : this.dialogForm.get('AllocationTypeCtrl').value;
      // var RevertDate = !this.dialogForm.get('RevertDateCtrl').value ? null : this.JsonDate(this.dialogForm.get('RevertDateCtrl').value);
      var RevertDate = !this.dialogForm.get('RevertDateCtrl').value ? null : new Date(this.dialogForm.get('RevertDateCtrl').value);
      var assetlist = prefarIds;

      if (allocationType == "" || allocationType == null) {
        this.toastr.warning(this.message.SelectAllocationtype, this.message.AssetrakSays);
        return false;
      }
      if (allocationType == "Temporary" && RevertDate == null) {     //allocationType == "Temporary" && RevertDate == ""
        this.toastr.warning(this.message.ProvideRevertDate, this.message.AssetrakSays);
        return false;
      }
      if (employeeType == "" || employeeType == null) {
        this.toastr.warning(this.message.EmployeeType, this.message.AssetrakSays);
        return false;
      }
      if ((employeeType == "Other User" || employeeType == "Other employee") && custodianEmail == "") {
        this.toastr.warning(this.message.CustodianDetails, this.message.AssetrakSays);
        return false;
      }
      if (employeeType == "AD employee" && userEmail == "") {
        this.toastr.warning(this.message.IncorrectUserDetails, this.message.AssetrakSays);
        return false;
      }
      // ===== save allocated data =======
      var flag = false;
      var setUser = "UserEmailId='" + userEmail + "' ,UserName='" + user + "' ,";
      var setCustodian = "CustodianEmailId='" + custodianEmail + "' ,CustodianName='" + custodian + "' ";
      if (this.AssetType === "Capitalized Assets") {
        var assetDetails = {
          AllocateBy: this.Name,
          CompanyId: this.CompanyId,
          UserEmailId: userEmail,
          CustodianEmailId: custodianEmail,
          EditParameterForUserCustodian: setUser + setCustodian + allocatedBy + "~" + assetlist + " ~ " + allocatedDate + " ~ " + flag + " ~ " + employeeType + " ~ " + allocationType,
          LastModifiedBy: this.UserId,
          // RevertDate: RevertDate
          RevertDateInString: RevertDate,
          IP_Address: this.IP_Address,
          Device_ID: this.Device_ID,
          Device_Type: this.Device_Type
        }
        this.dialogRef.close(assetDetails);
      }
      else {
        var updateUserDetails = {
          UserName: user,
          UserEmail: userEmail,
          Custodian: custodian,
          CustodianEmail: custodianEmail,
          assetlist: assetlist,
          AllocationDate: allocatedDate,
          ISselected: false,
          UserId: this.UserId,
          AllocationType: allocationType,
          EmployeeType: employeeType,
          CompanyId: this.CompanyId,
          GroupId: this.GroupId,
          // RevertDate: RevertDate
          RevertDateInString: RevertDate
        }
        this.dialogRef.close(updateUserDetails);
      }

    } else {
      this.toastr.warning(this.message.SelectAtleastOneAsset, this.message.AssetrakSays);
    }
  }

  checkEmail(email) {
    var regExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regExp.test(email);
  }
  public JsonDate(datePicker) {
    Date.prototype.toJSON = function () {
      var date = '/Date(' + this.getTime() + ')/';
      return date;
    };
    var dt = new Date(datePicker);
    var dt1 = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds()));
    return dt1.toJSON();
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


  bindData1: any[] = [];
  ShowNewDataSource: boolean = false;
  btnName: any = 'View Other Assignment';
  GetNewAsset() {
    debugger;
    this.txtUserEmail = !this.dialogForm.get('UserCtrl').value ? "" : this.dialogForm.get('UserCtrl').value;
    this.txtCustodianEmail = !this.dialogForm.get('CustodianCtrl').value ? "" : this.dialogForm.get('CustodianCtrl').value;
    if ((this.txtUserEmail === undefined || this.txtUserEmail === "") && (this.txtCustodianEmail === undefined || this.txtCustodianEmail === "")) {
      this.toastr.warning(this.message.SelectUserCustodian, this.message.AssetrakSays);
      return false;
    }
    else {
      this.selectionNew.clear();
      this.ShowNewDataSource = !this.ShowNewDataSource;
      if (this.ShowNewDataSource == true) {
        this.btnName = 'Hide';
        this.SearchUsersForAssetUnAllocationNew();
      }
      else {
        this.btnName = 'View Other Assignment';
        this.bindData1 = [];
        this.onChangeDataSourceNew(this.bindData1);
      }
    }
  }

  serachtext: any;
  colunname: any;
  IsSearch: boolean = false;
  SearchUsersForAssetUnAllocationNew() {

    var UserEmail = "";
    var CustodianEmail = "";

    if (this.txtUserEmail.indexOf("|") >= 0) {
      UserEmail = this.txtUserEmail.split("|")[2];
      UserEmail = UserEmail.replace(/ +/g, "");
    }
    else {
      UserEmail = this.txtUserEmail;
    }

    if (this.txtCustodianEmail.indexOf("|") >= 0) {
      CustodianEmail = this.txtCustodianEmail.split("|")[2];
      CustodianEmail = CustodianEmail.replace(/ +/g, "");
    }
    else {
      CustodianEmail = this.txtCustodianEmail;
    }
    var AssetType = "Capitalized Assets";
    var assetsDetails =
    {
      AssetType: AssetType,
      UserEmail: UserEmail,
      CustodianEmail: CustodianEmail,
      UserName: "",
      CustomerName: "",
      CompanyId: this.CompanyId,
      GroupId: this.GroupId,
    }
    this.loader.open();
    this.as.SearchUsersForAssetUnAllocation(assetsDetails).subscribe(r => {

      this.loader.close();
      this.bindData1 = JSON.parse(r);
      var data = JSON.parse(r);
      var prefarIds = [];
      const numSelected = this.selection.selected.length;
      for (var i = 0; i < numSelected; i++) {
        prefarIds.push(this.selection.selected[i].PreFarId);
      }
      this.bindData1 = data.filter(row => prefarIds.indexOf(row.PreFarId) < 0);
      this.onChangeDataSourceNew(this.bindData1);
    })

  }

  onChangeDataSourceNew(value) {
    this.dataSourceNew = new MatTableDataSource(value);
    this.dataSourceNew.paginator = this.paginator;
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

    this.btnName = 'View Other Assignment';
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
    //this.isButtonVisible = false;
  }

}
