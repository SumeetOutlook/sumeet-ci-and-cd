import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {SelectionModel} from '@angular/cdk/collections';
import { MatProgressBar } from '@angular/material/progress-bar';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import {
  MatSnackBarVerticalPosition,
  MatSnackBarHorizontalPosition,
  MatSnackBar,
  MatSnackBarConfig
} from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from '@angular/router';
import {CompanyService} from '../../../components/services/CompanyService';
import {UserService} from '../../../components/services/UserService';

const Group_DATA: PeriodicElement[] = [
  {GroupName:'Baxter'},
  {GroupName:'TATA'},
  {GroupName:'Assetrak'},
  {GroupName:'Sony'},
  {GroupName:'HDB'},
  {GroupName:'FMC'},
  {GroupName:'Amara Raja'},
  {GroupName:'Yazaki'},
  {GroupName:'YRG'},
 
]

const REGION_DATA: PeriodicElement[] = [
  {RegionName:'South Region'},
  {RegionName:'North Region'},
  {RegionName:'East Region'},
  {RegionName:'West Region'},
  
]

const LEGAL_DATA: PeriodicElement[] = [
  {LegalName:'Assetrak Solutions Pvt Ltd.',Id:1},
  {LegalName:'Sony Picture',Id:1},
  {LegalName:'FMC India',Id:1},
  {LegalName:'HDB Mumbai',Id:1},
  {LegalName:'TATA Chemicals',Id:1}
  
]

export interface PeriodicElement {
 
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './grc.component.html',
  styleUrls: ['./grc.component.css']
})
export class GroupRegionCompanyComponent implements OnInit {

  public isSubmit=true;
  public selectedIndex=2;
  ValidData:boolean=true;
  actionButtonLabel = "Retry";
  action = false;
  setAutoHide = true;
  autoHide = 2000;
  verticalPosition: MatSnackBarVerticalPosition = "top";
  errorMsg = '';
  LoginUserInfo: any;

  public array_group;
  public array_region;
  public array_company;
  checked: boolean = false;

  GroupList=['Baxter','TATA','Assetrak','Sony','HDB','FMC','Amara Raja','Yazaki','YRG'];
  RegionList=['South Region','North Region','East Region','West Region'];
  LegalEntityList=['Assetrak Solutions Pvt Ltd.','Sony Picture','FMC India','HDB Mumbai','TATA Chemicals'];


  
  constructor(private fb: FormBuilder,private jwtAuth: JwtAuthService,public UserService :UserService ,public CompanyService:CompanyService,public snackBar: MatSnackBar, private router: Router) { }

  // public Group_data;
   groupdatasource :any;
   regiondatasource : any;
   legaldatasource : any;
   public Remeberdata:any;

  displayedColumnsGroup: string[] = ['LevelNameValue'];
//  public displayedColumnsGroup;
  selection = new SelectionModel<PeriodicElement>(false, []);

  // public Region_data = Object.assign(REGION_DATA);
  // public regiondatasource = new MatTableDataSource<Element>(this.Region_data);
   displayedColumnsRegion: string[] = ['LevelNameValue'];

  // public Legal_data = Object.assign(LEGAL_DATA);
  // public legaldatasource = new MatTableDataSource<Element>(this.Legal_data);
   displayedColumnsLegal: string[] = ['LevelNameValue'];

  nextStep(i){
    this.selectedIndex=i;
    //console.log(i);
}
previousStep(i){
   this.selectedIndex=i;
}

public tabChanged(tabChangeEvent:MatTabChangeEvent):void{
 this.nextStep(tabChangeEvent.index);
 this.previousStep(tabChangeEvent.index);
 
}

  ngOnInit() {
    this.GetGroupRegionCompany();
    
  }

  selectData(row)
  {
    debugger;
    this.selection.clear();
    if(row.GroupName==""){

      this.ValidData=true;

    }else{
      this.ValidData=false;
      this.selection.toggle(row)
      this.Remeberdata = this.selection.selected;
    }
  }
  Check(){
    this.checked = true;
  }

  GetGroupRegionCompany(){

    this.LoginUserInfo = JSON.parse(localStorage.getItem("LogInUser"));
    const UserId =  this.LoginUserInfo.UserId;
     
      this.array_group = [];
      this.array_region = [];
      this.array_company = [];

     this.CompanyService.GetGroupRegionCompany(UserId)
    .subscribe(r => {
       // debugger;

        let Obj: any[] = JSON.parse(r);

        Obj.forEach(element => {
          if (element.LevelId === 1) {
            this.array_group.push(element)
          }
        else  if (element.LevelId === 2) {
            this.array_region.push(element)
          }
         else if (element.LevelId === 3) {
            this.array_company.push(element)
          }
        });

        this.groupdatasource = new MatTableDataSource(this.array_group);
        this.regiondatasource = new MatTableDataSource(this.array_region);
        this.legaldatasource = new MatTableDataSource(this.array_company);

      })
  }

  Continue(){
    
    debugger;
    const checkbox =  this.checked;
    const SelectedData =   this.Remeberdata[0];

    const userId = SelectedData.userId;
    const LevelValue =  SelectedData.LevelValue;
    const LevelNameValue =SelectedData.LevelNameValue;
    const CreatedOn = SelectedData.CreatedOn;

    if(checkbox == true){

      this.UserService.InsertFavouriteSelection(SelectedData)
      .subscribe(r => {
debugger;
      })
    }
    else{
      this.router.navigateByUrl("h/a");
    }
  }
}
