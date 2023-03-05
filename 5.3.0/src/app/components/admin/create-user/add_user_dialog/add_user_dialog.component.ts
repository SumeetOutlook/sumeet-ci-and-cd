import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GroupService } from 'app/components/services/GroupService';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { NumberValidator } from 'ngx-custom-validators/src/app/number/directive';
import { Constants } from "app/components/storage/constants";
import { ManagerService } from "app/components/storage/sessionMangaer";
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-adduserdialog',
  templateUrl: './add_user_dialog.component.html',
  styleUrls: ['./add_user_dialog.component.scss']
})
export class addUserDialogComponent implements OnInit {

  SessionGroupId: any;
  SessionCompanyId: any;
  EmployeeList: any[]=[];
  filteredOptions: Observable<string[]>;
  IsDisabled: boolean = false;
  IsDisabledEmployeeId: boolean = true;

  submitted: boolean = false;
  dialogUserAddForm: FormGroup;
  get f1() { return this.dialogUserAddForm.controls; };

  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  contactNumberPattern = "^((\\+91-?)|0)?[0-9]{10}$"; 
   
  constructor(public dialogRef: MatDialogRef<addUserDialogComponent>,public localService: LocalStoreService, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private storage: ManagerService, public groupService: GroupService,) { }

    ngOnInit() {  
      this.SessionGroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
      this.SessionCompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);

      this.dialogUserAddForm = this.fb.group({
        userName: [ '', [Validators.required,Validators.email]],
        firstName: [ '', [ Validators.required , this.noWhitespaceValidator]],
        lastName: [ '', [Validators.required , this.noWhitespaceValidator]],
        contactNo: [ '', [Validators.pattern(this.contactNumberPattern)]],
        employeeId: [ ''],
      });

      this.GetEmployeeList();
      this.userFilter();
  }

  public onclosetab() {
    this.dialogRef.close();
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  onSubmit() {
    debugger;
    if (this.data.component1 === 'UserAddComponent' && this.dialogUserAddForm.valid) {
       var userData={        
        userName: this.dialogUserAddForm.value.userName,
         firstName: this.dialogUserAddForm.value.firstName,        
         lastName: this.dialogUserAddForm.value.lastName,
         contactNo: this.dialogUserAddForm.value.contactNo,     
       }
     
      this.dialogRef.close(userData)
    }
  }

  GetEmployeeList()
  {
    debugger;
    this.EmployeeList=[];
    this.groupService.GetEmployeeSuggestionList(this.SessionCompanyId,this.SessionGroupId).subscribe(response => {
      debugger;
      if(!!response)
      {
        this.EmployeeList =JSON.parse(response);
      }
    })
  }

  userFilter() {
    debugger;
    this.filteredOptions = this.dialogUserAddForm.controls['userName'].valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }
  private _filter(value: string): string[] {
    debugger;
    const filterValue = value.toLowerCase();
    debugger
    return this.EmployeeList.filter(option => option.EmployeeEmail.toLowerCase().includes(filterValue));
  }

  SetOtherDetail(result : any)
  {
    this.dialogUserAddForm.controls['firstName'].setValue("");
    this.dialogUserAddForm.controls['lastName'].setValue("");
    this.dialogUserAddForm.controls['contactNo'].setValue("");
    this.dialogUserAddForm.controls['employeeId'].setValue("");
    if(!!this.dialogUserAddForm.controls['userName'].value)
    {
      this.dialogUserAddForm.controls['firstName'].setValue(result.FirstName);     
      this.dialogUserAddForm.controls['lastName'].setValue(result.LastName);
      this.dialogUserAddForm.controls['contactNo'].setValue(result.ContactNo);
      this.dialogUserAddForm.controls['employeeId'].setValue(result.EmployeeId);
      this.IsDisabled= true;
    }else{
      this.IsDisabled= false;
    }
  
  }

  ClearData()
  {
    if(!this.dialogUserAddForm.controls['userName'].value)
    {
      this.dialogUserAddForm.controls['firstName'].setValue("");
      this.dialogUserAddForm.controls['lastName'].setValue("");
      this.dialogUserAddForm.controls['contactNo'].setValue("");
      this.dialogUserAddForm.controls['employeeId'].setValue("");
      this.IsDisabled= false;
    }
  }





}
  




