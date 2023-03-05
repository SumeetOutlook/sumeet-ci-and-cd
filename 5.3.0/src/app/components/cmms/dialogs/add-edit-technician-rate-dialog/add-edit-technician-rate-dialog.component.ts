import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as headers from '../../../../../assets/Headers.json';
import { UserRoleService } from 'app/components/services/UserRoleService';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
@Component({
  selector: 'app-add-edit-technician-rate-dialog',
  templateUrl: './add-edit-technician-rate-dialog.component.html',
  styleUrls: ['./add-edit-technician-rate-dialog.component.scss']
})
export class AddEditTechnicianRateDialogComponent implements OnInit {

  header:any = (headers as any).default;
  submitted: boolean = false;
  UserData:any[] = [];
  public sbunm: any;
  types: any[] = ['By User', 'By Role'];
  GroupId: any;
  RegionId: any;
  UserId: any;
  typeVal:any ='';
  userVal: any = '';
  CompanyId: any;
  dialogSBUForm: FormGroup;
  get f1() { return this.dialogSBUForm.controls; };

  constructor(public matdialogbox: MatDialogRef<AddEditTechnicianRateDialogComponent>,public localService: LocalStoreService, @Inject(MAT_DIALOG_DATA) public data:any,
  private fb: FormBuilder,  private userRoleService: UserRoleService ,    private storage: ManagerService,
) { }

  ngOnInit(){
      this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
      console.log(this.GroupId);
      this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
      this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
      this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
      this.dialogSBUForm = this.fb.group({
        sbuName : [this.data.SBU||'',[Validators.required,this.noWhitespaceValidator]]
    });
    this.GetAllUserList();
   debugger;
    if(this.data.component1 == 'SBUComponent' && this.data.value === 'edit')
    {     
      this.dialogSBUForm.controls['sbuName'].setValue(this.data.name.SBU)     
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
  if (this.data.component1 === 'SBUComponent' && this.dialogSBUForm.valid) {
     var sbuData={        
       sbu: this.dialogSBUForm.value.sbuName.trim()
     }
   
    this.matdialogbox.close(sbuData)
  }
}

GetAllUserList() {
  this.UserData = [];
  var groupId = !this.GroupId || this.GroupId == 0 ? 0 : this.GroupId;
  this.userRoleService.GetAllUsers(groupId).subscribe(r => {
    r.forEach(element => {
      this.UserData.push(element);        
    });
    // this.getFilterUser();
  })
}

}
