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
import * as headers from '../../../../../assets/Headers.json';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';


@Component({
  selector: 'app-groupdialog',
  templateUrl: './group_dialog.component.html',
  styleUrls: ['./group_dialog.component.scss']
})
export class Group_dialogComponent implements OnInit {
  header: any ;
  submitted: boolean = false;
  public grpnm: any;
  dialogGroupForm: FormGroup;
  get f1() { return this.dialogGroupForm.controls; };
  protected _onDestroy = new Subject<void>();
  public currencyData: any[] = [];
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  contactNumberPattern = "^((\\+91-?)|0)?[0-9]{10}$";
  // currencyData: any;

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  public filteredCurrency: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(public matdialogbox: MatDialogRef<Group_dialogComponent>, public localService: LocalStoreService, @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder, public groupservice: GroupService, private userRoleService: UserRoleService,private jwtAuth:JwtAuthService
  ) 
  {
    this.header = this.jwtAuth.getHeaders()
  }

  selectedcurrency:any;
  ngOnInit() {
    debugger;
    // this.matdialogbox.updateSize("400px"); 
    this.GetAllCurrency();
    this.dialogGroupForm = this.fb.group({
      groupname: ['', [Validators.required , ,this.noWhitespaceValidator]],
      currency: ['', [Validators.required]],
      groupCode: [''],
      currencyFilter: [''],
      employeeId: ['', [Validators.required]],
      employeeEmail: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      contactNo: ['', [Validators.required, Validators.pattern(this.contactNumberPattern)]],
    });

    if (this.data.component1 == 'GroupComponent' && this.data.value === 'edit') {

      this.dialogGroupForm.get('employeeId').clearValidators();
      this.dialogGroupForm.get('employeeId').updateValueAndValidity();
      this.dialogGroupForm.get('employeeEmail').clearValidators();
      this.dialogGroupForm.get('employeeEmail').updateValueAndValidity();
      this.dialogGroupForm.get('firstName').clearValidators();
      this.dialogGroupForm.get('firstName').updateValueAndValidity();
      this.dialogGroupForm.get('lastName').clearValidators();
      this.dialogGroupForm.get('lastName').updateValueAndValidity();
      this.dialogGroupForm.get('contactNo').clearValidators();
      this.dialogGroupForm.get('contactNo').updateValueAndValidity();

      this.dialogGroupForm.controls['groupname'].setValue(this.data.name.GroupName);
      //this.dialogGroupForm.controls['emailId'].setValue(this.data.name.emailId);
      this.dialogGroupForm.controls['currency'].setValue(this.data.name.CurrencyId);
      this.selectedcurrency = this.data.name.CurrencyId;
      this.dialogGroupForm.controls['groupCode'].setValue(this.data.name.GroupCode);

    }

    debugger;
    this.grpnm = this.localService.getItem('selectedgrp');

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
    //this.matdialogbox.close(this.dialogGroupForm.value)

    if (this.data.component1 === 'GroupComponent' && this.dialogGroupForm.valid) {
      var groupData = {
        groupname: this.dialogGroupForm.value.groupname,
        currencyId: this.dialogGroupForm.value.currency,
        groupCode: this.dialogGroupForm.value.groupCode,
        employeeId: this.dialogGroupForm.value.employeeId,
        employeeEmail: this.dialogGroupForm.value.employeeEmail,
        firstName: this.dialogGroupForm.value.firstName,
        lastName: this.dialogGroupForm.value.lastName,
        contactNo: this.dialogGroupForm.value.contactNo,
      }

      this.matdialogbox.close(groupData)
    }
  }

  public save() {
    console.log(this.grpnm);
    this.localService.clear();
    this.localService.setItem('selectedgrp', this.grpnm);
    this.onclosetab();
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
    this.dialogGroupForm.controls['currencyFilter'].valueChanges
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
    let search = this.dialogGroupForm.controls['currencyFilter'].value;
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



}