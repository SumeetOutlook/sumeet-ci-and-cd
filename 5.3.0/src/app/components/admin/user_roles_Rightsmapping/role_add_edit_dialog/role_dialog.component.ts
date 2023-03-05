import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
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
  selector: 'app-role-dialog',
  templateUrl: './role_dialog.component.html',
  styleUrls: ['./role_dialog.component.scss']
})

export class Role_dialogComponent implements OnInit {
  Headers : any ;
  submitted: boolean = false;
  IsCompanyLevel: boolean = false;
  IsCategoryConfig: boolean = false;
  dialogRoleForm: FormGroup;
  get f1() { return this.dialogRoleForm.controls; };
  protected _onDestroy = new Subject<void>();

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;

  sbus: any[] = [];
  locations: any[] = [];
  categories: any[] = [];
  companyId: any;
  RoleData: any[]=[];
  selectedSBUList : any[] = [];
  mapData: { role_Id: any; location_Ids: any[]; category_Ids:any[]; };


  public sbuMultiCtrl: FormControl = new FormControl();
  public sbuMultiFilterCtrl: FormControl = new FormControl();
  public filteredsbuMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public plantMultiCtrl: FormControl = new FormControl();
  public plantMultiFilterCtrl: FormControl = new FormControl();
  public filteredPlantsMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public categoryMultiCtrl: FormControl = new FormControl();
  public categoryMultiFilterCtrl: FormControl = new FormControl();
  public filteredCategorysMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public filteredRoles: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);


  constructor(public matdialogbox: MatDialogRef<Role_dialogComponent>, public localService: LocalStoreService, @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,public groupservice: GroupService, private userRoleService:UserRoleService, private jwtAuth:JwtAuthService
  ) 
  {
    this.Headers = this.jwtAuth.getHeaders()
   }


  ngOnInit() {
     
    // this.matdialogbox.updateSize("400px"); 
    this.GetAllRoleList();
    if(this.data.CompanyId > 0)
    { 
      this.IsCompanyLevel= true;
      this.companyId=this.data.CompanyId;
      if(this.data.IsCategoryConfiguration)
      {
        this.IsCategoryConfig= true;
        this.dialogRoleForm = this.fb.group({
          roleCtrl: ['', [Validators.required]],
          sbuMultiCtrl: ['', [Validators.required]],
          plantMultiCtrl: ['', [Validators.required]],
          categoryMultiCtrl: ['', [Validators.required]],
          roleFilterCtrl: [''],
          sbuMultiFilterCtrl: [''],
          plantMultiFilterCtrl: [''],
          categoryMultiFilterCtrl: [''],
       });
       this.CategoryGetdata();
      }else{
        this.IsCategoryConfig= false;
        this.dialogRoleForm = this.fb.group({
          roleCtrl: ['', [Validators.required]],
          sbuMultiCtrl: ['', [Validators.required]],
          plantMultiCtrl: ['', [Validators.required]],
          roleFilterCtrl: [''],
          sbuMultiFilterCtrl: [''],
          plantMultiFilterCtrl: [''],
       });
      }
      this.SBUGetdata();
    }
    else{
      this.IsCompanyLevel= false;
      this.IsCategoryConfig= false;
      this.dialogRoleForm = this.fb.group({
        roleCtrl: ['', [Validators.required]],
        roleFilterCtrl: [''],
     });
    }
  }

  public onclosetab() {
    this.matdialogbox.close();
  }

  onSubmit() {
     debugger;
    if (this.data.component1 === 'RoleComponent' && this.dialogRoleForm.valid) {
       
      if(this.IsCompanyLevel)
      {
        if(this.IsCategoryConfig)
        {
          this.mapData={        
            role_Id: this.dialogRoleForm.value.roleCtrl,
            location_Ids: this.dialogRoleForm.value.plantMultiCtrl,        
            category_Ids: this.dialogRoleForm.value.categoryMultiCtrl,   
          }
          this.matdialogbox.close(this.mapData)
        }
        else{
          this.mapData={        
            role_Id: this.dialogRoleForm.value.roleCtrl,
            location_Ids: this.dialogRoleForm.value.plantMultiCtrl,        
            category_Ids: [],   
          }
          this.matdialogbox.close(this.mapData)
        } 
      }
      else{
        this.mapData={        
          role_Id: this.dialogRoleForm.value.roleCtrl,
          location_Ids: [],        
          category_Ids: [],   
        }
        this.matdialogbox.close(this.mapData)
      }
    }
  }

  GetAllRoleList()
  {
     
    this.RoleData=[];
    var groupId=this.data.GroupID;
    var regionId=this.data.RegionID;
    var companyId=this.data.CompanyId;

    this.userRoleService.GetAllRolesByLevel(groupId, regionId, companyId).subscribe(r => {
      r.forEach(element => {
                 
          this.RoleData.push(element) 
          this.getFilterRoles();     
      });
    })   
  }

  getFilterRoles() {
     
    this.filteredRoles.next(this.RoleData.slice());
    this.dialogRoleForm.controls['roleFilterCtrl'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
         
        this.filterRoleMulti();
      });
  }
  
  protected filterRoleMulti() {
    if (!this.RoleData) {
      return;
    }
    let search = this.dialogRoleForm.controls['roleFilterCtrl'].value;
    if (!search) {
      this.filteredRoles.next(this.RoleData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredRoles.next(
      this.RoleData.filter(x => x.RoleName.toLowerCase().indexOf(search) > -1)
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

  LocationGetdata(result : any) {     
    this.locations = [];
    var companyId=this.companyId;
    this.userRoleService.GetAllLocations(companyId).subscribe(r => {       
      r.forEach(element => {         
        var idx = result.indexOf(element.Zone);
        if(idx > -1 ){           
          this.locations.push(element);  
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
    this.dialogRoleForm.controls['sbuMultiFilterCtrl'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
         
        this.filterSBUMulti();
      });
  }

  protected filterSBUMulti() {
    if (!this.sbus) {
      return;
    }
    let search = this.dialogRoleForm.controls['sbuMultiFilterCtrl'].value;
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
    this.dialogRoleForm.controls['plantMultiFilterCtrl'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
         
        this.filterPlantsMulti();
      });
  }

  protected filterPlantsMulti() {
    if (!this.locations) {
      return;
    }
    let search = this.dialogRoleForm.controls['plantMultiFilterCtrl'].value;
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
    this.dialogRoleForm.controls['categoryMultiFilterCtrl'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
         
        this.filterCategoryMulti();
      });
  }

  protected filterCategoryMulti() {
    if (!this.categories) {
      return;
    }
    let search = this.dialogRoleForm.controls['categoryMultiFilterCtrl'].value;
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
  
  toggleSelectAllSBU(selectAllValue: boolean) {
    debugger;
    var arr: any = [];
    this.selectedSBUList = [];
    this.filteredsbuMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {         
        if (selectAllValue) {
          debugger;
          //this.sbuMultiCtrl.patchValue(val);
          for(var i=0;i<val.length;i++){
            arr.push(val[i].SBU);
            this.selectedSBUList.push(val[i].SBU);
          }          
        } else {          
          arr = [];
          this.selectedSBUList = [];     
        }
        debugger;
        this.dialogRoleForm.controls['sbuMultiCtrl'].setValue(arr);
        this.dialogRoleForm.controls['plantMultiCtrl'].setValue([]); 
        this.LocationGetdata(this.selectedSBUList);
      });
  }

  toggleSelectPlantAll(selectAllValue: boolean) {
    debugger;
    var arr: any = [];
    this.filteredPlantsMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {         
        if (selectAllValue) {
          for(var i=0;i<val.length;i++){
            arr.push(val[i].LocationId);
          } 
        } else {
          arr = [];
        }    
        this.dialogRoleForm.controls['plantMultiCtrl'].setValue(arr); 
      });
      if(arr == 0){
        this.dialogRoleForm.controls['plantMultiCtrl'].setValue([])
      }
  }

  toggleSelectCategoryAll(selectAllValue: boolean) {
    debugger;
    var arr: any = [];
    this.filteredCategorysMulti.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(val => {
        if (selectAllValue) {
          for(var i=0;i<val.length;i++){
            arr.push(val[i].AssetCategoryId);
          } 
        } else {
          arr = [];
        }
        this.dialogRoleForm.controls['categoryMultiCtrl'].setValue(arr); 
      });
      if(arr == 0){
        this.dialogRoleForm.controls['categoryMultiCtrl'].setValue([])
      }
  }

}