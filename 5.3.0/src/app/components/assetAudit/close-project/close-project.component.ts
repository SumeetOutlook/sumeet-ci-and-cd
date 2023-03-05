
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuditService } from '../../services/AuditService';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { Constants } from 'app/components/storage/constants';
import { FormControl } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ProjectDetailsDialogComponent } from '../close-project/project-details-dialog/project-details-dialog.component';
import { UserService } from '../../services/UserService';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppConfirmService } from '../../../shared/services/app-confirm/app-confirm.service';

@Component({
  selector: 'app-close-project',
  templateUrl: './close-project.component.html',
  styleUrls: ['./close-project.component.scss']
})

export class CloseProjectComponent implements OnInit {
  Headers: any ;
  message: any ;

  CompanyId: any;
  GroupId: any;
  RegionId: any;
  UserId: any;
  ReportForm: FormGroup;
  submitted: boolean = false;
  IsDisabled: boolean = true;

  SelectedByData: any[] = []

  @ViewChild('PaginatorForRegion', { static: true }) paginatorForRegion: MatPaginator;
  @ViewChild('SortForRegion', { static: true }) sortForRegion: MatSort;
  @ViewChild('TableForRegion', { static: true }) tableForRegion: any;

  displayedColumns: string[] = ['Select', 'ProjectName', 'MainTableCount', 'MainTableCost', 'MainTableWDV', 'ProjectCompleteDate'];

  public selectedbyctrl: FormControl = new FormControl();
  public selectedby: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  // dataSource = new MatTableDataSource<any>();
  dataSource: any;
  selection = new SelectionModel<any>(true, []);
  numSelected: any = 0;
  getselectedIds: any[] = [];
  isAllSelected: boolean = false;
  displayTable: boolean = false;
  displaybtn: boolean = false;

  ListProjectName: any[] = [];
  ProjectDetails: any[] = [];
  public selectedData: FormControl = new FormControl();

  constructor(public dialog: MatDialog, 
    public us: UserService,
    private router: Router,
    private confirmService: AppConfirmService,
    public alertService: MessageAlertService, public auditservice: AuditService, private storage: ManagerService, private fb: FormBuilder, public toastr: ToastrService, private loader: AppLoaderService,private jwtAuth: JwtAuthService) { 
      this.Headers = this.jwtAuth.getHeaders();
	    this.message = this.jwtAuth.getResources(); 

      this.SelectedByData = [
        { value: "PhysicalVerification", name: this.Headers.PhysicalVerification },
        // { value:"SelfCertification", name: this.Headers.SelfCertification},
      ]
    }

  ngOnInit(): void {
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    this.ReportForm = this.fb.group({
      selectedbyctrl: ['', [Validators.required]],
    });
    this.selectedby.next(this.SelectedByData.slice());
    this.GetInitiatedData();
  }

  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  GetInitiatedData() {
      
    let url1 = this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.RegionId, "38");
    forkJoin([url1]).subscribe(results => {     
      if (!!results[0]) {
        this.ListOfPagePermission = JSON.parse(results[0]);
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

  onChangeSelectedby(event) {
  
    this.selection.clear();
    this.ListProjectName = [];
    this.getselectedIds = [];
    if (event == "PhysicalVerification") {
      this.GetProjectName('OnPageLoad');
      // this.GetCompanyById();
    }
  }


  GetProjectName(Action) {
    this.ListProjectName = [];
    this.getselectedIds = [];
    this.dataSource = "";
    this.selection.clear();
    var companyId = this.CompanyId;
    this.loader.open();
    this.auditservice.getVerificationProgress(companyId).subscribe(r => {       
      this.loader.close();
      if (r != null && !!r) {
        var data = JSON.parse(r);
        data.forEach(element => {
          this.ListProjectName.push(element.Name)
        });
        // this.GetProjectData();
      }
      this.GetProjectData();
    });
  }


  GetProjectData() {
    
    // this.dataSource = new MatTableDataSource<any>();
    this.dataSource = "";
    this.selectedData.setValue("");
    var companyId = this.CompanyId;
    this.getselectedIds = [];
    if (!!this.ListProjectName) {
      this.loader.open();
      this.auditservice.GetCloseProjectData(companyId).subscribe(r => {        
        this.loader.close();
        var binddata = [];
        if (r != null && !!r) {
          binddata = JSON.parse(r);          
        }
        this.displaybtn = true;
        this.onChangeDataSource(binddata);
      });
    }
  }

  onChangeDataSource(value) {
   
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginatorForRegion;
    this.dataSource.sort = this.sortForRegion;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  masterToggle() {
    this.isAllSelected = !this.isAllSelected;
    this.getselectedIds = [];
    if (this.isAllSelected == true) {
      this.dataSource.filteredData.forEach(row => this.selection.select(row));
    }
    else {
      this.dataSource.filteredData.forEach(row => this.selection.toggle(row));
    }
    this.numSelected = this.selection.selected.length;
    if (this.numSelected > 0) {
      this.selection.selected.forEach(row => this.getselectedIds.push(row.ProjectName));
    }
  }

  isSelected(row) {
    this.selection.toggle(row)
    this.numSelected = this.selection.selected.length;
    var idx = this.getselectedIds.indexOf(row.ProjectName);
    if (idx > -1) {
      this.getselectedIds.splice(idx, 1);
    }
    else {
      this.getselectedIds.push(row.ProjectName);
    }
  }

  DeleteProjectConfirmation()
  {
    this.confirmService.confirm({ message: this.message.DeleteProjectConfirmation, title: this.message.AssetrakSays })
    .subscribe(res => {
      if (!!res) {         
        this.DeleteProject();         
      }
    })
  }

  DeleteProject() {
    var pName = this.selectedData.value;
    if (!!pName) {
      this.loader.open();
      var projectname = pName;
      var companyid = this.CompanyId;
      var userId = this.UserId;
      var StatusToCheck = "Pending";
      var data = {
        CId: companyid,
        projectName: projectname,
        StatusToCheck: StatusToCheck,
        UId: userId
      }
      this.auditservice.DeleteProject(data).subscribe(r => {
        console.log(r);
        this.loader.close();
        if (r == "2") {
          this.toastr.warning(this.message.licenceExpiry, this.message.AssetrakSays);
        }
        else if (r == "Project deleted successfully !!!") {
          this.toastr.success(this.message.ProjectDeleteSucess, this.message.AssetrakSays);
        }
        else if (r == "Tagging is already started.") {
          this.toastr.warning(this.message.TaggingIsAlreadyStarted, this.message.AssetrakSays);
        }
        else if (r == "Verification is already started.") {
          this.toastr.warning(this.message.VerificationIsAlreadyStarted, this.message.AssetrakSays);
        }
        this.GetProjectName("");
      });
      //  this.GetProjectName("");
    }
    else {
      this.toastr.warning("Please select Project", this.message.AssetrakSays);
    }
  }


  CloseProjectConfirmation()
  {
    this.confirmService.confirm({ message: this.message.CloseProjectConfirmation, title: this.message.AssetrakSays })
    .subscribe(res => {
      if (!!res) {         
        this.CloseProject();         
      }
    })
  }
  CloseProject() {
    
    var pName = this.selectedData.value;
    if (!!pName) {
      this.loader.open();
      var projectname = pName;
      var companyid = this.CompanyId;
      var userId = this.UserId;
      var data = {
        CId: companyid,
        projectName: projectname,
        UId: userId
      }
      this.auditservice.CloseProject(data).subscribe(r => {
        console.log(r);
        
        this.loader.close();
        if (r == "Inventory Project Closed Successfully !!!") {
          this.toastr.success(this.message.InventoryProjectCloseSucess, this.message.AssetrakSays);
        }
        else if (r != null) {
          this.toastr.warning(r, this.message.AssetrakSays);
        }

        this.GetProjectName("");
      });
      //  this.GetProjectName("");
    }
    else {
      this.toastr.warning("Please select Project", this.message.AssetrakSays);
    }
  }

  OpenProjectDetails(result: any) {
    let configdata = {
      CompanyId: this.CompanyId,
      projectName: result.ProjectName
    }
    const dialogRef = this.dialog.open(ProjectDetailsDialogComponent, {
      width: '980px',
      disableClose: true,
      data: { configdata: configdata }
    });
    dialogRef.afterClosed().subscribe(result => {

    })
  }
}
