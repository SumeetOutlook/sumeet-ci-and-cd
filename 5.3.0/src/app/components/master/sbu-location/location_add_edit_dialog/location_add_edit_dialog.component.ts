import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GroupService } from 'app/components/services/GroupService';
import { CompanyService } from 'app/components/services/CompanyService';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import * as headers from '../../../../../assets/Headers.json';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-LocationAddEdit',
  templateUrl: './location_add_edit_dialog.component.html',
  styleUrls: ['./location_add_edit_dialog.component.scss']
})
export class LocationDialogComponent implements OnInit {
  header: any ;
  submitted: boolean = false;
  public grpnm: any;
  dialogLocationForm: FormGroup;
  get f1() { return this.dialogLocationForm.controls; };
  countries: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  protected _onDestroy = new Subject<void>();

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  public filteredCountry: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredState: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredCity: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(public matdialogbox: MatDialogRef<LocationDialogComponent>, public localService: LocalStoreService, @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder, public groupservice: GroupService, public companyservice: CompanyService,private loader: AppLoaderService,
    private jwtAuth:JwtAuthService) 
    {
     this.header = this.jwtAuth.getHeaders()
     }
  ngOnInit() {
    
    //this.GetAllCityData();
    //this.GetAllStateData();
    //this.CountryGetdata();    

    this.dialogLocationForm = this.fb.group({
      locationName: [this.data.LocationName || '', [Validators.required, Validators.maxLength(30),this.noWhitespaceValidator]],
      address1: [this.data.Address1 || '', [Validators.required,this.noWhitespaceValidator]],
      address2: [this.data.Address2 || ''],
      locationName2: [this.data.LocationName2 || ''],
      country: [this.data.Country || '', Validators.required],
      state: [this.data.State || '', Validators.required],
      city: [this.data.City || '', Validators.required],
      zipCode: [this.data.ZipCode || '', [Validators.required, Validators.minLength(5),this.noWhitespaceValidator]],
      locationCode: [this.data.LocationCode || ''],
      countryFilter: [''],
      stateFilter: [''],
      cityFilter: [''],
    });

    if (this.data.component1 == 'LocationComponent' && this.data.value === 'edit') {
      
      this.dialogLocationForm.controls['locationName'].setValue(this.data.name.LocationName);
      this.dialogLocationForm.controls['address1'].setValue(this.data.name.Address1);
      this.dialogLocationForm.controls['address2'].setValue(this.data.name.Address2);
      this.dialogLocationForm.controls['locationName2'].setValue(this.data.name.LocationName2);
      this.dialogLocationForm.controls['country'].setValue(this.data.name.Country);
      this.dialogLocationForm.controls['state'].setValue(this.data.name.State);
      this.dialogLocationForm.controls['city'].setValue(this.data.name.City);
      this.dialogLocationForm.controls['zipCode'].setValue(this.data.name.ZipCode);
      this.dialogLocationForm.controls['locationCode'].setValue(this.data.name.LocationCode);
    }
    this.GetInitiatedData();
  }
  AllCityData: any;
  AllStateData: any;
  GetInitiatedData() {
    debugger;
    this.cities = [];
    this.AllCityData = this.data.AllCityData;
    this.AllStateData = this.data.AllStateData;
    this.countries = this.data.countries;
    this.getFilterCountry();    
    if (this.data.value === 'edit') {
      this.countries.forEach(element => {
        if (element.Country_Name == this.data.name.Country) {
          debugger;
          this.StateGetdata(element.Country_Id)
        }
      })
    }


    // this.cities = [];
    // this.loader.open();
    // let url1 = this.companyservice.GetAllCityData();
    // let url2 = this.companyservice.GetAllStateData();
    // let url3 = this.companyservice.GetAllCountryData();
    // forkJoin([url1, url2, url3]).subscribe(results => {
    //   debugger;
    //   this.loader.close();
    //   if (!!results[0]) {
    //     this.AllCityData = results[0];
    //   }
    //   if (!!results[1]) {
    //     this.AllStateData = results[1];
    //   }
    //   if (!!results[2]) {
    //     this.countries = results[2];
    //     this.getFilterCountry();
    //   }
    //   if (this.data.value === 'edit') {
    //     this.countries.forEach(element => {
    //       if (element.Country_Name == this.data.name.Country) {
    //         this.StateGetdata(element.Country_Id)
    //       }
    //     })
    //   }
    // })
  }


  GetAllCityData() {
    this.cities = [];
    this.companyservice.GetAllCityData().subscribe(r => {
      r.forEach(element => {
        this.AllCityData.push(element)
      });
    })
  }

  GetAllStateData() {
    this.companyservice.GetAllStateData().subscribe(r => {      
      r.forEach(element => {
        this.AllStateData.push(element);
      });
    })
  }

  CountryGetdata() {    
    this.countries = [];
    this.companyservice.GetAllCountryData().subscribe(r => {      
      r.forEach(element => {
        this.countries.push(element)
        this.getFilterCountry();
        if (this.data.value === 'edit') {
          if (element.Country_Name == this.data.name.Country) {
            debugger;
            this.StateGetdata(element.Country_Id)
          }
        }
      });
    })
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
    if (this.data.component1 === 'LocationComponent' && this.dialogLocationForm.valid) {
      var locationData = {
        locationName: this.dialogLocationForm.value.locationName.trim(),
        address1: this.dialogLocationForm.value.address1.trim(),
        address2: this.dialogLocationForm.value.address2.trim(),
        locationName2: this.dialogLocationForm.value.locationName2.trim(),
        country: this.dialogLocationForm.value.country,
        state: this.dialogLocationForm.value.state,
        city: this.dialogLocationForm.value.city,
        zipCode: this.dialogLocationForm.value.zipCode.trim(),
        locationCode: this.dialogLocationForm.value.locationCode.trim(),
      }
      this.matdialogbox.close(locationData)
    }
  }

  onChangeCountry(id) {
    this.dialogLocationForm.controls['state'].setValue("");
    this.dialogLocationForm.controls['city'].setValue("");
    this.dialogLocationForm.controls['stateFilter'].setValue("");
    this.dialogLocationForm.controls['cityFilter'].setValue("");
    this.StateGetdata(id);
  }

  StateGetdata(id) {    
    debugger;
    this.states = [];
    this.getFilterState();  
    this.cities = [];
    this.getFilterCity();
    this.AllStateData.forEach(element => {
      if (id == element.Country_Id) {        
        this.states.push(element);               
        if (this.data.value === 'edit') {
          if (element.State_Name == this.data.name.State) {
            this.CityGetdata(element.State_Id)
          }
        }
      }
    });
    debugger;
    this.getFilterState(); 
  }

  // StateGetdata(id) {
  //   
  //   this.states = [];
  //   this.companyservice.GetAllStateData().subscribe(r => {
  //     
  //     r.forEach(element => {
  //       if (id == element.Country_Id) {
  //         this.states.push(element)
  //         this.getFilterState();
  //         
  //         if (this.data.value === 'edit') {
  //           if (element.State_Name == this.data.name.State) {
  //             this.CityGetdata(element.State_Id)
  //           }
  //         }
  //       }
  //     });
  //   })
  // }


  CityGetdata(id) {
    this.cities = [];    
    this.AllCityData.forEach(element => {
      if (id == element.State_Id) {
        this.cities.push(element)
      }
    });
    debugger;
    this.getFilterCity();
  }
  

  onChangeState(id) {
    debugger
    this.dialogLocationForm.controls['city'].setValue("");
    this.CityGetdata(id);
  }
  getFilterCountry() {
    this.filteredCountry.next(this.countries.slice());
    this.dialogLocationForm.controls['countryFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCountryData();
      });
  }
  protected filterCountryData() {
    if (!this.countries) {
      return;
    }
    // get the search keyword
    let search = this.dialogLocationForm.controls['countryFilter'].value;
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
    this.filteredState.next(this.states.slice());
    this.dialogLocationForm.controls['stateFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterStateData();
      });
  }
  protected filterStateData() {
    if (!this.states) {
      return;
    }
    // get the search keyword
    let search = this.dialogLocationForm.controls['stateFilter'].value;
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
    this.filteredCity.next(this.cities.slice());
    this.dialogLocationForm.controls['cityFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCityData();
      });
  }

  protected filterCityData() {
    if (!this.cities) {
      return;
    }
    // get the search keyword
    let search = this.dialogLocationForm.controls['cityFilter'].value;
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

}
