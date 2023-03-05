import { Component, OnInit, ElementRef, ViewChild ,Inject} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GroupService } from 'app/components/services/GroupService';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { RegionService } from 'app/components/services/RegionService';
import * as headers from '../../../../../assets/Headers.json';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-regiondialog',
  templateUrl: './region_dialog.component.html',
  styleUrls: ['./region_dialog.component.scss']
})
export class RegionDialogComponent implements OnInit {
  submitted: boolean = false;
  public grpnm: any;
  header:any ;
  dialogRegionForm: FormGroup;
  get f1() { return this.dialogRegionForm.controls; };
  protected _onDestroy = new Subject<void>();
  public currencyData: any[]=[];
  contactNumberPattern = "^((\\+91-?)|0)?[0-9]{10}$"; 
  employeeData: any[]=[];

 
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  public filteredCurrency: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredEmployee: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  
    constructor(public matdialogbox: MatDialogRef<RegionDialogComponent>, public localService: LocalStoreService, @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,public groupservice: GroupService,public regionService:RegionService,private jwtAuth:JwtAuthService) 
    {
      this.header = this.jwtAuth.getHeaders()
     }

    ngOnInit() {
      
      this.matdialogbox.updateSize("450px"); 
      this.GetAllCurrency();
      this.EmployeeGetdata();
      this.dialogRegionForm = this.fb.group({
        regionName: [this.data.RegionName || '', [Validators.required,this.noWhitespaceValidator]],
        // regionRegNo: [this.data.RegionRegNo || '', Validators.required],
        address1: [this.data.Address1 || ''],
        address2: [this.data.Address2 || ''], 
        regionCode: [this.data.RegionCode || ''],
        contactNo: [this.data.ContactNo || '',[ Validators.required,Validators.pattern(this.contactNumberPattern)]],
        faxNo: [this.data.FaxNo ],
        currency: [this.data.RegionCurrency || '', [Validators.required]],
        currencyFilter:[''],
        employee: [ '', [Validators.required]],
        employeeFilter:[''],
      });
  
      if(this.data.component1 == 'RegionComponent' && this.data.value === 'edit')
      {
       
        this.dialogRegionForm.controls['regionName'].setValue(this.data.name.RegionName);   
        this.dialogRegionForm.controls['address1'].setValue(this.data.name.Address1);
        this.dialogRegionForm.controls['address2'].setValue(this.data.name.Address2);
        this.dialogRegionForm.controls['regionCode'].setValue(this.data.name.RegionCode);
        this.dialogRegionForm.controls['contactNo'].setValue(this.data.name.ContactNo);
        this.dialogRegionForm.controls['faxNo'].setValue(this.data.name.FaxNo);
        this.dialogRegionForm.controls['currency'].setValue(this.data.name.RegionCurrencyid);
        this.dialogRegionForm.controls['employee'].clearValidators();
        this.dialogRegionForm.controls['employee'].updateValueAndValidity(); 
        
      }
      else{
        this.dialogRegionForm.controls['employee'].setValidators([Validators.required]);
        this.dialogRegionForm.controls['employee'].updateValueAndValidity();
      }
      
    }
  
    public onclosetab() {
      this.matdialogbox.close();
    }
    public noWhitespaceValidator(control: FormControl) {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
  }
  
    onSubmit() {
       
      if (this.data.component1 === 'RegionComponent' && this.dialogRegionForm.valid) {
         var regionData={
          regionName: this.dialogRegionForm.value.regionName,
          address1: this.dialogRegionForm.value.address1,
          address2: this.dialogRegionForm.value.address2,    
          regionCode: this.dialogRegionForm.value.regionCode,  
          contactNo: this.dialogRegionForm.value.contactNo,   
          faxNo: this.dialogRegionForm.value.faxNo,  
          regionCurrencyid: this.dialogRegionForm.value.currency,  
          employeeTableid: this.dialogRegionForm.value.employee, 
         }
      
        this.matdialogbox.close(regionData)
      }
    }

    GetAllCurrency(){
      
      this.groupservice.GetAllCurrencyData().subscribe(response=>{
        
        this.currencyData=response;
        this.getFilterCurrency();
        
      }) 
    }

getFilterCurrency()
{

  
  this.filteredCurrency.next(this.currencyData.slice());
  this.dialogRegionForm.controls['currencyFilter'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      
      this.filterCurrencyData();
    });
 
}

protected filterCurrencyData() {
  
  if (!this.currencyData) {
    return;
  }
  // get the search keyword
  let search = this.dialogRegionForm.controls['currencyFilter'].value;
  if (!search) {
    this.filteredCurrency.next(this.currencyData.slice());
    return;
  } else {
    search = search.toLowerCase();
    
  }
  // filter the banks
  this.filteredCurrency.next(
    this.currencyData.filter(x => x.Currency.toLowerCase().indexOf(search) > -1)
  );
}

EmployeeGetdata() {
  
  this.employeeData = [];
  var Id=this.data.Group_Id;
  this.regionService.EmployeeList(Id).subscribe(r => {
    
    r.forEach(element => {
      this.employeeData.push(element)      
    });
    this.getFilterEmployee();
  })
}
limit = 10;
offset = 0; 
getFilterEmployee() {
  
  this.filteredEmployee.next(this.employeeData.slice(0, this.offset + this.limit));
  this.offset += this.limit;
  this.dialogRegionForm.controls['employeeFilter'].valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      
      this.filterEmployeeData();
    });
}


protected filterEmployeeData() {
  
  if (!this.employeeData) {
    return;
  }
  let search = this.dialogRegionForm.controls['employeeFilter'].value;
  if (!search) {
    this.filteredEmployee.next(this.employeeData.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredEmployee.next(
    this.employeeData.filter(x => x.UserDetails.toLowerCase().indexOf(search) > -1)
  );
}



}
