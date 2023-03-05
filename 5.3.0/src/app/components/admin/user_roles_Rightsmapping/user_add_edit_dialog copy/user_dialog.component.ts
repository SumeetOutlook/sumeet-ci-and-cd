import { Component, OnInit, ElementRef, ViewChild, Inject,Input } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GroupService } from 'app/components/services/GroupService';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { NumberValidator } from 'ngx-custom-validators/src/app/number/directive';
import { UserRoleService } from 'app/components/services/UserRoleService';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';


@Component({
  selector: 'app-user-dialog',
  templateUrl: './user_dialog.component.html',
  styleUrls: ['./user_dialog.component.scss']
})
export class User_dialogComponent implements OnInit {
  Headers : any ;
  submitted: boolean = false;
  IsCompanyLevel: boolean = false;
  IsCategoryConfig: boolean = false;
  dialogUserForm: FormGroup;
  get f1() { return this.dialogUserForm.controls; };
  protected _onDestroy = new Subject<void>();

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;

  sbus: any[] = [];
  locations: any[] = [];
  categories: any[] = [];
  companyId: any;
  UserData: any[]=[];
  selectedSBUList : any[] = [];
  selectedPlantList : any[] =[];
  selectedCategoryList : any[] =[];
  mapData: { user_Id: any; location_Ids: any[]; category_Ids:any[]; };

  @Input() toggleAllCheckboxIndeterminate = false;
  @Input() toggleAllCheckboxChecked = false;
  public sbuMultiCtrl: FormControl = new FormControl();
  public sbuMultiFilterCtrl: FormControl = new FormControl();
  public filteredsbuMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public plantMultiCtrl: FormControl = new FormControl();
  public plantMultiFilterCtrl: FormControl = new FormControl();
  public filteredPlantsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public categoryMultiCtrl: FormControl = new FormControl();
  public categoryMultiFilterCtrl: FormControl = new FormControl();
  public filteredCategorysMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(public matdialogbox: MatDialogRef<User_dialogComponent>, public localService: LocalStoreService, @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,public groupservice: GroupService, private userRoleService:UserRoleService,private jwtAuth:JwtAuthService
  ) 
  {
    this.Headers = this.jwtAuth.getHeaders()
   }


  ngOnInit() {
      
    // this.matdialogbox.updateSize("400px"); 
    this.GetAllUserList();
    if(this.data.CompanyId > 0)
    { 
      this.IsCompanyLevel= true;
      this.companyId=this.data.CompanyId;
      if(this.data.IsCategoryConfiguration)
      {
        this.IsCategoryConfig= true;
        this.dialogUserForm = this.fb.group({
          userCtrl: ['', [Validators.required]],
          sbuMultiCtrl: ['', [Validators.required]],
          plantMultiCtrl: ['', [Validators.required]],
          categoryMultiCtrl: ['', [Validators.required]],
          userFilterCtrl: [''],
          sbuMultiFilterCtrl: [''],
          plantMultiFilterCtrl: [''],
          categoryMultiFilterCtrl: [''],
       });
       this.CategoryGetdata();
      }else{
        this.IsCategoryConfig= false;
        this.dialogUserForm = this.fb.group({
          userCtrl: ['', [Validators.required]],
          sbuMultiCtrl: ['', [Validators.required]],
          plantMultiCtrl: ['', [Validators.required]],
          userFilterCtrl: [''],
          sbuMultiFilterCtrl: [''],
          plantMultiFilterCtrl: [''],
       });
      }
      this.SBUGetdata();
    }
    else{
      this.IsCompanyLevel= false;
      this.IsCategoryConfig= false;
      this.dialogUserForm = this.fb.group({
        userCtrl: ['', [Validators.required]],
        userFilterCtrl: [''],
     });
    }
  }


public onclosetab() {
  this.matdialogbox.close();
}

onSubmit() {
    
  if (this.data.component1 === 'UserComponent' && this.dialogUserForm.valid) {
      
    if(this.IsCompanyLevel)
    {
      if(this.IsCategoryConfig)
      {
        this.mapData={        
          user_Id: this.dialogUserForm.value.userCtrl,
          location_Ids: this.dialogUserForm.value.plantMultiCtrl,        
          category_Ids: this.dialogUserForm.value.categoryMultiCtrl,   
        }
        this.matdialogbox.close(this.mapData)
      }
      else{
        this.mapData={        
          user_Id: this.dialogUserForm.value.userCtrl,
          location_Ids: this.dialogUserForm.value.plantMultiCtrl,        
          category_Ids: [],   
        }
        this.matdialogbox.close(this.mapData)
      } 
    }
    else{
      this.mapData={        
        user_Id: this.dialogUserForm.value.userCtrl,
        location_Ids: [],        
        category_Ids: [],   
      }
      this.matdialogbox.close(this.mapData)
    }
  }
}


GetAllUserList()
{
    
  this.UserData=[];
  var groupId=this.data.GroupID;

  this.userRoleService.GetAllUsers(groupId).subscribe(r => {
      
    r.forEach(element => {
                
        this.UserData.push(element) 
        this.getFilterUsers();      
    });
  })   
}

getFilterUsers() {
    
  this.filteredUsers.next(this.UserData.slice());
  this.dialogUserForm.controls['userFilterCtrl'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
        
      this.filterUserMulti();
    });
}

protected filterUserMulti() {
  if (!this.UserData) {
    return;
  }
  let search = this.dialogUserForm.controls['userFilterCtrl'].value;
  if (!search) {
    this.filteredUsers.next(this.UserData.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredUsers.next(
    this.UserData.filter(x => x.UserName.toLowerCase().indexOf(search) > -1)
  );
}

SBUGetdata() {
    
  this.sbus = [];
  this.selectedSBUList=[];
  var companyId=this.companyId;
  this.userRoleService.GetAllSBU(companyId).subscribe(r => {
      
    r.forEach(element => {
      this.sbus.push(element)
      this.getFilterSBUUS();
    });
  })
}

onChangeSBU(name) {
    
  var idx = this.selectedSBUList.indexOf(name);
  if(idx > -1 ){
    this.selectedSBUList.splice(idx , 1);
  }
  else{
    this.selectedSBUList.push(name);
  }
  this.LocationGetdata(this.selectedSBUList);
}

onChangeLocation(name) {
    
  var idx = this.selectedPlantList.indexOf(name);
  if(idx > -1 ){
    this.selectedPlantList.splice(idx , 1);
  }
  else{
    this.selectedPlantList.push(name);
  }
 
}


onChangeCategory(name) {
    
  var idx = this.selectedCategoryList.indexOf(name);
  if(idx > -1 ){
    this.selectedCategoryList.splice(idx , 1);
  }
  else{
    this.selectedCategoryList.push(name);
  }
  
}

LocationGetdata(result : any) {
    
  this.locations = [];
  var companyId=this.companyId;
  this.userRoleService.GetAllLocations(companyId).subscribe(r => {    
    r.forEach(element => {     
      var idx = result.indexOf(element.Zone);
      if(idx > -1 ){        
        this.locations.push(element)             
      }
    });
    this.getFilterLocations(); 
  })
}

CategoryGetdata() {
  this.categories = [];
  var companyId=this.companyId;
  this.userRoleService.GetAllCategory(companyId).subscribe(r => {
    r.forEach(element => {
        this.categories.push(element)
        this.getFilterCategory();
    });
  })
}

getFilterSBUUS() {
    
  this.filteredsbuMulti.next(this.sbus.slice());
  this.dialogUserForm.controls['sbuMultiFilterCtrl'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
        
      this.filterSBUMulti();
    });
}

protected filterSBUMulti() {
  if (!this.sbus) {
    return;
  }
  let search = this.dialogUserForm.controls['sbuMultiFilterCtrl'].value;
  if (!search) {
    this.filteredsbuMulti.next(this.sbus.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredsbuMulti.next(
    this.sbus.filter(x => x.SBU.toLowerCase().indexOf(search) > -1)
  );
}

getFilterLocations() {
    
  this.filteredPlantsMulti.next(this.locations.slice());
  this.dialogUserForm.controls['plantMultiFilterCtrl'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
        
      this.filterPlantsMulti();
    });
}

protected filterPlantsMulti() {
  if (!this.locations) {
    return;
  }
  let search = this.dialogUserForm.controls['plantMultiFilterCtrl'].value;
  if (!search) {
    this.filteredPlantsMulti.next(this.locations.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredPlantsMulti.next(
    this.locations.filter(x => x.LocationName.toLowerCase().indexOf(search) > -1)
  );
}

getFilterCategory() {
    
  this.filteredCategorysMulti.next(this.categories.slice());
  this.dialogUserForm.controls['categoryMultiFilterCtrl'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
        
      this.filterCategoryMulti();
    });
}

protected filterCategoryMulti() {
  if (!this.categories) {
    return;
  }
  let search = this.dialogUserForm.controls['categoryMultiFilterCtrl'].value;
  if (!search) {
    this.filteredCategorysMulti.next(this.categories.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredCategorysMulti.next(
    this.categories.filter(x => x.AssetCategoryName.toLowerCase().indexOf(search) > -1)
  );
}
clearIcon(){
  
}
allSbuSelected:any =false
toggleSelectAllSBU(selectAllValue: boolean) {
    
  var arr = [];
  this.selectedSBUList = [];
  debugger
  this.filteredsbuMulti.pipe(take(1), takeUntil(this._onDestroy))
    .subscribe(val => {         
      if (selectAllValue) {
        //this.sbuMultiCtrl.patchValue(val);
        for(var i=0;i<val.length;i++){
          arr.push(val[i].SBU);
          this.selectedSBUList.push(val[i].SBU);
        
        }       
      } else {          
        arr = [];
        this.selectedSBUList = [];
      }
        this.filteredsbuMulti.subscribe(val=> {
          if(val.length==this.sbus.length)
            this.allSbuSelected = true;
            else this.allSbuSelected = false;

        });
      this.dialogUserForm.controls['sbuMultiCtrl'].setValue(arr);
      this.dialogUserForm.controls['plantMultiCtrl'].setValue([]); 
      this.LocationGetdata(this.selectedSBUList);
    });
}

toggleSelectPlantAll(selectAllValue: boolean) {
  var arr = [];
  this.selectedPlantList =[];
  this.filteredPlantsMulti.pipe(take(1), takeUntil(this._onDestroy))
    .subscribe(val => {         
      if (selectAllValue) {
        for(var i=0;i<val.length;i++){
          arr.push(val[i].LocationId);
          this.selectedPlantList.push(val[i].LocationId);
        } 
      } 
      this.dialogUserForm.controls['plantMultiCtrl'].setValue(arr); 
    });    
}

toggleSelectCategoryAll(selectAllValue: boolean) {
  var arr = [];
  this.selectedCategoryList =[];
  this.filteredCategorysMulti.pipe(take(1), takeUntil(this._onDestroy))
    .subscribe(val => {
      debugger;
      if (selectAllValue) {
        for(var i=0;i<val.length;i++){
          arr.push(val[i].AssetCategoryId);
          this.selectedCategoryList.push(val[i].AssetCategoryId);
        } 
      } 
      this.dialogUserForm.controls['categoryMultiCtrl'].setValue(arr); 
    });
}


}