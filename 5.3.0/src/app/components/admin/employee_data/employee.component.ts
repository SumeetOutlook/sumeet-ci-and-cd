import { Component, OnInit, ViewChild } from '@angular/core';
import * as headers from '../../../../assets/Headers.json';
import * as resource from '../../../../assets/Resource.json';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { HttpClient } from '@angular/common/http';
import { MatSort } from '@angular/material/sort';
import { CreateEmployeeDialogComponent } from './emp_add_edit_dialog/emp-dialog.component';
import { UploadEmployeePopUpComponent } from './emp_upload_dialog/emp_model_popup.component';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import {
  MatSnackBarVerticalPosition,
  MatSnackBarHorizontalPosition,
  MatSnackBar,
  MatSnackBarConfig
} from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from '@angular/router';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/UserService';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { AllPathService } from 'app/components/services/AllPathServices';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';
import { CompanyService } from '../../../components/services/CompanyService';
import { CompanyLocationService } from '../../../components/services/CompanyLocationService';

interface Company {
  CompanyId: string;
  CompanyName: string;
}

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  header: any ;
  message: any = (resource as any).default;
  displayedHeaders = []
  constructor(public toastr: ToastrService,
    private storage: ManagerService,
    private loader: AppLoaderService,
    private httpService: HttpClient,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private jwtAuth: JwtAuthService,
    public snackBar: MatSnackBar,
    private router: Router,
    public us: UserService,
    public CompanyService: CompanyService,
    public CompanyLocationService: CompanyLocationService,
    public alertService: MessageAlertService,
    public AllPathService: AllPathService,
    private confirmService: AppConfirmService,) 
    {
      this.header = this.jwtAuth.getHeaders() 
      this.displayedHeaders = [this.header.EmployeeId, this.header.EmployeeEmail, this.header.FirstName, this.header.LastName, this.header.ContactNumber, this.header.Location, 'Actions']
     }


  
  displayedColumns: string[] = ['EmployeeId', 'EmployeeEmail', 'FirstName', 'LastName', 'ContactNumber', 'Location', 'Action'];  //ActivationStatus
  datasource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  IsExport: boolean;
  CompanyId: any;
  GroupId: any;
  UserId: any;
  RegionId: any;

  protected _onDestroy = new Subject<void>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public arrBirds: any[];
  LoginUserInfo: any;
  companyId;
  companylistdata: any;

  public CompanyList: ReplaySubject<Company[]> = new ReplaySubject<Company[]>(1);



  ngOnInit() {
    this.GroupId = Number(this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID));
    this.RegionId = Number(this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID));
    this.CompanyId = Number(this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID));
    this.UserId = Number(this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID));
    this.GetInitiatedData();
    this.OnGetEmployeeMasterCompany();
  }

  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  GetInitiatedData() {
    let url5 = this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.RegionId, "75");
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

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  OnGetEmployeeMasterCompany() {
    const GroupId = this.GroupId;
    this.CompanyService.GetEmployeeMasterCompany(GroupId)
      .subscribe(r => {
        this.companylistdata = JSON.parse(r);
        this.CompanyList.next(this.companylistdata.slice());
      });
  }

  OnGetCompanyData(event) {
    if (event == "") {
      this.hideADDEdit = false;
    } else {
      this.hideADDEdit = true;
    }

    if (event != "All") {
      this.companyId = event.CompanyId;
      this.hideADDEdit = true;
    }
    else {
      this.companyId = 0;
    }

    const pagesize = 50;
    const pageno = 1;
    this.IsExport = false;
    const searchText = "";
    //   
    this.CompanyService.GetEmployeeMasterCompanyData(this.companyId, pagesize, pageno, this.IsExport, searchText, this.GroupId)
      .subscribe(r => {
        //   
        const data = JSON.parse(r);
        this.datasource = new MatTableDataSource(data);
        this.datasource.paginator = this.paginator;
        this.datasource.sort = this.sort;
      });
  }


  openExportEmployee() {
    const pagesize = 0;
    const pageno = 0;
    this.IsExport = true;
    const searchText = "";
    this.CompanyService.GetEmployeeMasterCompanyData(this.companyId, pagesize, pageno, this.IsExport, searchText, this.GroupId)
      .subscribe(r => {
        if (!!r) {
          this.AllPathService.DownloadExportFile(r);
          console.log("URL", URL);
        }
      });
  }

  openDialog(...getValue): void {
    var component: any
    if (getValue[0] === 'upload') {
      //component=UploadRegionPopUpComponent
    }
    else {
      component = CreateEmployeeDialogComponent;
    }
    const dialogRef = this.dialog.open(component, {
      width: "50%",
      disableClose: true,
      data: {
        component1: 'CreateEmployeeDialogComponent',
        value: getValue[0],
        name: getValue[1],
      },
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result && getValue[0] === 'edit') {
        this.UpdateEmployeeData(result);
      }
      else if (result && getValue[0] === 'insert') {
        this.loader.open();
        this.CreateandUploadEmployee(result);
        this.loader.close();
      }

    });
  }

  CreateandUploadEmployee(EmployeeData) {
    const GroupId = this.GroupId;
    var InsertData = {

      CompanyId: this.companyId,
      GroupId: GroupId,
      EmployeeId: EmployeeData.EmployeeId,
      EmployeeEmail: EmployeeData.EmployeeEmail,
      FirstName: EmployeeData.FirstName,
      LastName: EmployeeData.LastName,
      ContactNo: EmployeeData.ContactNo,
      Location: EmployeeData.Location,
      status: true
    }

    this.CompanyLocationService.CreateandUploadEmployee(InsertData)
      .subscribe(Response => {
        if (Response == "Sucess") {
          const pagesize = 50;
          const pageno = 1;
          this.IsExport = false;
          const searchText = "";
          //   
          this.CompanyService.GetEmployeeMasterCompanyData(this.companyId, pagesize, pageno, this.IsExport, searchText, this.GroupId)
            .subscribe(r => {
              //   
              const data = JSON.parse(r);
              this.toastr.success(this.message.EmployeeAddSucess);
              this.datasource = new MatTableDataSource(data);
              this.datasource.paginator = this.paginator;
              this.datasource.sort = this.sort;
            });
        }

        else if (Response == "duplicate") {

          this.toastr.warning(this.message.EmployeeAlreadyExist);

        }
      });
  }

  public UpdateEmployeeData(EmployeeData) {
    const GroupId = this.GroupId;
    const UpdateData = {
      GroupId: GroupId,
      CompanyId: this.companyId,
      EmployeeId: EmployeeData.EmployeeId,
      EmployeeEmail: EmployeeData.EmployeeEmail,
      FirstName: EmployeeData.FirstName,
      LastName: EmployeeData.LastName,
      ContactNo: EmployeeData.ContactNo,
      Location: EmployeeData.Location
    }



    this.CompanyService.UpdateEmployee(UpdateData)
      .subscribe(Response => {
        if (Response == "Sucess") {

          const pagesize = 50;
          const pageno = 1;
          this.IsExport = false;
          const searchText = "";

          this.CompanyService.GetEmployeeMasterCompanyData(this.companyId, pagesize, pageno, this.IsExport, searchText, this.GroupId)
            .subscribe(r => {
              const data = JSON.parse(r);
              this.toastr.success(this.message.EmployeeUpdateSucess);
              this.datasource = new MatTableDataSource(data);
              this.datasource.paginator = this.paginator;
              this.datasource.sort = this.sort;
            });
        }

      });
  }

  deleteUser(getValue) {
    this.confirmService.confirm({ message: `Are you sure want to delete employee details ?`, title: this.message.AssetrakSays })
      .subscribe(res => {
        if (!!res) {
          this.loader.open();
          const EmployyeeDto = {
            GroupId: this.GroupId,
            CompanyId: getValue.CompanyId,
            EmployeeId: getValue.EmployeeId,
            EmployeeEmail: getValue.EmployeeEmail,
            userId: getValue.userId,
            mailSendflag: getValue.mailSendflag
          }

          this.CompanyService.DeleteEmployeeData(EmployyeeDto)
            .subscribe(r => {
              this.loader.close();
              if (r == "Employee Deleted Successfully") {
                const pagesize = 50;
                const pageno = 1;
                this.IsExport = false;
                const searchText = "";
                this.CompanyService.GetEmployeeMasterCompanyData(this.companyId, pagesize, pageno, this.IsExport, searchText, this.GroupId)
                  .subscribe(r => {
                    const data = JSON.parse(r);
                    this.toastr.success(this.message.EmployeeDeleteSucess, this.message.AssetrakSays);
                    this.datasource = new MatTableDataSource(data);
                    this.datasource.paginator = this.paginator;
                    this.datasource.sort = this.sort;
                  });
              }
            });
        }
      })
  }


  uploadEmployee() {
  }

  uploadEmployeeConfirmation() {
    this.confirmService.confirm({ message: this.message.EmployeeDataReplaceNotification, title: this.message.AssetrakSays })
      .subscribe(res => {
        if (res) {
          this.openUploadEmployee();
        }
      })
  }

  openUploadEmployee(): void {
    const dialogconfigcom1 = new MatDialogConfig();
    dialogconfigcom1.disableClose = true;
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = "50%";
    const modalService = this.dialog.open(UploadEmployeePopUpComponent, dialogconfigcom1);
    modalService.afterClosed().subscribe((res) => {
      debugger;
      if (res) {
        this.loader.open();
        var GroupId = this.GroupId;
        var UserId = this.UserId;
        {
          var UploadCPUClassData = {
            FileName: res,
            userId: UserId,
            CompanyId: this.companyId,
            GroupId: this.GroupId
          }
          debugger;
          this.CompanyLocationService.CreateandUploadEmployee(UploadCPUClassData)
            .subscribe(data => {
              debugger;
              this.loader.close();
              if (data === "1") {
                this.toastr.success(this.message.EmployeedetailsUploadedSucess, this.message.AssetrakSays);
              }
              else if (data == "2") {
                this.toastr.success(this.message.EmployeedetailsNotUploadedInvalidDetails, this.message.AssetrakSays);
              }
              else if (data == "3") {
                this.toastr.warning(this.message.SpredsheetBlank, this.message.AssetrakSays);
              }
              else if (data == "4") {
                this.toastr.warning(this.message.EmployeeAlreadyExist, this.message.AssetrakSays);
              }
              else if (data == "5") {
                this.toastr.warning(this.message.EmployeeDetailsinComplete, this.message.AssetrakSays);
              }
              else if (data == "6") {
                this.toastr.success(this.message.EmployeedetailsNotUploadedDuplicatedetails, this.message.AssetrakSays);
              }
              else {
                this.toastr.warning(this.message.ProvideAlldetails, this.message.AssetrakSays);
              }

              this.datasource = new MatTableDataSource();;
              const pagesize = 50;
              const pageno = 1;
              this.IsExport = false;
              const searchText = "";
              this.CompanyService.GetEmployeeMasterCompanyData(this.companyId, pagesize, pageno, this.IsExport, searchText, this.GroupId)
                .subscribe(r => {
                  const data = JSON.parse(r);
                  this.datasource = new MatTableDataSource(data);
                  this.datasource.paginator = this.paginator;
                  this.datasource.sort = this.sort;
                });
            });
        }
      }
    });
  }

  hideADDEdit: boolean = false;
  selected(event) {
    if (event == "") {
      this.hideADDEdit = false;
    } else {
      this.hideADDEdit = true;
    }
  }

  doFilter = (value: string) => {
    this.datasource.filter = value.trim().toLocaleLowerCase();
  }


}
