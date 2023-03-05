import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GroupService } from 'app/components/services/GroupService';
import { CompanyService } from 'app/components/services/CompanyService';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { RegionService } from 'app/components/services/RegionService';
import * as headers from '../../../../../assets/Headers.json';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-groupdialog',
  templateUrl: './company_dialog.component.html',
  styleUrls: ['./company_dialog.component.scss']
})
export class CompanyDialogComponent implements OnInit {
  header: any;
  submitted: boolean = false;
  public grpnm: any;
  dialogCompanyForm: FormGroup;
  get f1() { return this.dialogCompanyForm.controls; };
  // currencyData: any;
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  protected _onDestroy = new Subject<void>();
  public currencyData: any[] = [];
  contactNumberPattern = "^((\\+91-?)|0)?[0-9]{10}$";
  employeeData: any[] = [];


  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  public filteredCurrency: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public filteredCountry: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredState: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredCity: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredEmployee: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(public matdialogbox: MatDialogRef<CompanyDialogComponent>, public localService: LocalStoreService, @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder, public groupservice: GroupService, private loader: AppLoaderService, public companyservice: CompanyService, public regionService: RegionService,private jwtAuth :JwtAuthService) 
    {
      this.header = this.jwtAuth.getHeaders()
     }

  ngOnInit() {
    debugger;
    this.matdialogbox.updateSize("450px");
    this.GetAllCurrency();
    this.CountryGetdata();
    this.EmployeeGetdata();
    this.dialogCompanyForm = this.fb.group({
      companyName: [this.data.CompanyName || '', [Validators.required,this.noWhitespaceValidator]],
      companyRegNo: [this.data.CompanyRegNo || '', [Validators.required]],
      address1: [this.data.Address1 || '', [Validators.required]],
      address2: [this.data.Address2],
      country: [this.data.Country || '', [Validators.required]],
      state: [this.data.State || '', [Validators.required]],
      city: [this.data.City || '', [Validators.required]],
      companyCode: [this.data.CompanyCode || ''],
      contactNo: [this.data.ContactNo || '', [Validators.required, Validators.pattern(this.contactNumberPattern)]],
      faxNo: [this.data.FaxNo],
      zipCode: [this.data.ZipCode || '', [Validators.required]],
      currency: [this.data.BaseCurrency || '', [Validators.required]],
      currencyFilter: [''],
      countryFilter: [''],
      stateFilter: [''],
      cityFilter: [''],
      employee: [''],
      employeeFilter: [''],
    });

    if (this.data.component1 == 'CompanyComponent' && this.data.value === 'edit') {

      this.dialogCompanyForm.controls['companyName'].setValue(this.data.name.CompanyName);
      this.dialogCompanyForm.controls['companyRegNo'].setValue(this.data.name.CompanyRegNo);
      this.dialogCompanyForm.controls['address1'].setValue(this.data.name.Address1);
      this.dialogCompanyForm.controls['address2'].setValue(this.data.name.Address2);
      this.dialogCompanyForm.controls['country'].setValue(this.data.name.Country);
      this.dialogCompanyForm.controls['state'].setValue(this.data.name.State);
      this.dialogCompanyForm.controls['city'].setValue(this.data.name.City);
      this.dialogCompanyForm.controls['companyCode'].setValue(this.data.name.CompanyCode);
      this.dialogCompanyForm.controls['contactNo'].setValue(this.data.name.ContactNo);
      this.dialogCompanyForm.controls['faxNo'].setValue(this.data.name.FaxNo);
      this.dialogCompanyForm.controls['zipCode'].setValue(this.data.name.ZipCode);
      this.dialogCompanyForm.controls['currency'].setValue(this.data.name.CurrencyId);
      this.dialogCompanyForm.controls['employee'].clearValidators();
      this.dialogCompanyForm.controls['employee'].updateValueAndValidity();  

    }
    else{
      this.dialogCompanyForm.controls['employee'].setValidators([Validators.required]);
      this.dialogCompanyForm.controls['employee'].updateValueAndValidity();
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
    debugger;
    if (this.data.component1 === 'CompanyComponent' && this.dialogCompanyForm.valid) {
      var companyData = {
        companyName: this.dialogCompanyForm.value.companyName,
        companyRegNo: this.dialogCompanyForm.value.companyRegNo,
        address1: this.dialogCompanyForm.value.address1,
        address2: this.dialogCompanyForm.value.address2,
        country: this.dialogCompanyForm.value.country,
        state: this.dialogCompanyForm.value.state,
        city: this.dialogCompanyForm.value.city,
        companyCode: this.dialogCompanyForm.value.companyCode,
        contactNo: this.dialogCompanyForm.value.contactNo,
        faxNo: this.dialogCompanyForm.value.faxNo,
        zipCode: this.dialogCompanyForm.value.zipCode,
        currencyId: this.dialogCompanyForm.value.currency,
        employeeTableid: this.dialogCompanyForm.value.employee,
      }

      this.matdialogbox.close(companyData)
    }
  }

  GetAllCurrency() {
    debugger;
    this.groupservice.GetAllCurrencyData().subscribe(response => {
      debugger;
      this.currencyData = response;
      this.getFilterCurrency();
    })
  }

  getFilterCurrency() {

    debugger;
    this.filteredCurrency.next(this.currencyData.slice());
    this.dialogCompanyForm.controls['currencyFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        debugger;
        this.filterCurrencyData();
      });

  }

  protected filterCurrencyData() {
    debugger;
    if (!this.currencyData) {
      return;
    }
    // get the search keyword
    let search = this.dialogCompanyForm.controls['currencyFilter'].value;
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
    debugger;
    console.log(this.filteredCurrency);
  }

  CountryGetdata() {
    debugger;
    this.countries = [];
    this.loader.open();
    this.companyservice.GetAllCountryData().subscribe(r => {
      debugger;
      r.forEach(element => {
        this.countries.push(element)
        this.getFilterCountry();
        if (this.data.value === 'edit') {
          if (element.Country_Name == this.data.name.Country) {
            this.StateGetdata(element.Country_Id)
          }
        }
      });
      this.loader.close();
    })
  }

  StateGetdata(id) {
    debugger;
    this.states = [];
    this.companyservice.GetAllStateData().subscribe(r => {
      debugger;
      r.forEach(element => {
        if (id == element.Country_Id) {
          this.states.push(element)
          this.getFilterState();
          debugger;
          if (this.data.value === 'edit') {
            if (element.State_Name == this.data.name.State) {            
              this.CityGetdata(element.State_Id);              
            }
          }
        }
      });
    })
  }

  CityGetdata(id) {
    this.cities = [];    
    this.loader.open();
    this.companyservice.GetAllCityData().subscribe(r => {      
      if (!!r) {      
        r.forEach(element => {
          if (id == element.State_Id) {
            this.cities.push(element)
            this.getFilterCity();
          }
        });        
      }
      this.loader.close();      
    })
  }

  CityGetdata1(id) {
    this.cities = [];  
    this.companyservice.GetAllCityData().subscribe(r => {      
      if (!!r) {      
        r.forEach(element => {
          if (id == element.State_Id) {
            this.cities.push(element)
            this.getFilterCity();
          }
        });        
      }    
    })
  }


  onChangeCountry(id, Currency) {
    this.dialogCompanyForm.controls['state'].setValue("");
    this.dialogCompanyForm.controls['city'].setValue("");
    this.dialogCompanyForm.controls['stateFilter'].setValue("");
    this.dialogCompanyForm.controls['cityFilter'].setValue("");
    this.StateGetdata(id);
    this.setCurrencyOnCountry(Currency);
  }

  onChangeState(id) {
    this.dialogCompanyForm.controls['city'].setValue("");
    this.CityGetdata1(id);
  }


  getFilterCountry() {
    debugger;
    this.filteredCountry.next(this.countries.slice());
    this.dialogCompanyForm.controls['countryFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        debugger;
        this.filterCountryData();
      });

  }

  protected filterCountryData() {
    debugger;
    if (!this.countries) {
      return;
    }
    // get the search keyword
    let search = this.dialogCompanyForm.controls['countryFilter'].value;
    if (!search) {
      this.filteredCountry.next(this.countries.slice());
      return;
    } else {
      search = search.toLowerCase();

    }
    // filter the banks
    this.filteredCountry.next(
      this.countries.filter(x => x.Country_Name.toLowerCase().indexOf(search) > -1)
    );


  }


  getFilterState() {

    debugger;
    this.filteredState.next(this.states.slice());
    this.dialogCompanyForm.controls['stateFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        debugger;
        this.filterStateData();
      });

  }

  protected filterStateData() {
    debugger;
    if (!this.states) {
      return;
    }
    // get the search keyword
    let search = this.dialogCompanyForm.controls['stateFilter'].value;
    if (!search) {
      this.filteredState.next(this.states.slice());
      return;
    } else {
      search = search.toLowerCase();

    }
    // filter the banks
    this.filteredState.next(
      this.states.filter(x => x.State_Name.toLowerCase().indexOf(search) > -1)
    );

  }


  getFilterCity() {
    debugger;
    this.filteredCity.next(this.cities.slice());
    this.dialogCompanyForm.controls['cityFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        debugger;
        this.filterCityData();
      });

  }

  protected filterCityData() {
    debugger;
    if (!this.cities) {
      return;
    }
    // get the search keyword
    let search = this.dialogCompanyForm.controls['cityFilter'].value;
    if (!search) {
      this.filteredCity.next(this.cities.slice());
      return;
    } else {
      search = search.toLowerCase();

    }
    // filter the banks
    this.filteredCity.next(
      this.cities.filter(x => x.City_Name.toLowerCase().indexOf(search) > -1)
    );

  }

  setCurrencyOnCountry(Currency) {
    this.currencyData.forEach(element => {
      if (element.Currency == Currency) {
        this.dialogCompanyForm.controls['currency'].setValue(element.CurrencyId)
      }
    });
  }


  EmployeeGetdata() {
    debugger;
    this.employeeData = [];
    var Id = this.data.Group_Id;
    this.regionService.EmployeeList(Id).subscribe(r => {
      debugger;
      r.forEach(element => {
        this.employeeData.push(element);
      });
      this.getFilterEmployee();
    })
  }

  limit = 10;
  offset = 0;
  getFilterEmployee() {
    debugger;
    this.filteredEmployee.next(this.employeeData.slice(0, this.offset + this.limit));
    this.offset += this.limit;
    this.dialogCompanyForm.controls['employeeFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        debugger;
        this.filterEmployeeData();
      });
  }


  protected filterEmployeeData() {
    debugger;
    if (!this.employeeData) {
      return;
    }
    let search = this.dialogCompanyForm.controls['employeeFilter'].value;
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
