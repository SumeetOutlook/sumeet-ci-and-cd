import { Component, OnInit, AfterViewInit, ViewChild ,Inject} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableDataSource } from '@angular/material/table';
import { GroupService } from 'app/components/services/GroupService';
import { MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import * as resource from '../../../../../assets/Resource.json';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.scss']
})
export class NotificationDialogComponent implements OnInit {

  dataS:any
  dialogForm: FormGroup;
  bindData : any;
  get f() { return this.dialogForm.controls; };
  constructor(public groupservice: GroupService,public toastr: ToastrService,public dialog: MatDialog,   public dialogRef: MatDialogRef<NotificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any , private fb: FormBuilder) { }

  ngOnInit(): void {
    debugger;
    console.log(this.data)

    this.bindData = this.data;
    this.dialogForm = this.fb.group({
      EventName : ['' || this.bindData.EventName, [Validators.required]],
      EventSubject : ['' || this.bindData.Subject, [Validators.required]],
      TemplateContent: ['' || this.bindData.JsonBody, [Validators.required]],
    })
  }

  Submit() {
   debugger;

    var result = {
     EmailSubject : this.dialogForm.get('EventSubject').value,
     EmailTemplate : this.dialogForm.get('TemplateContent').value,
     EventName : this.dialogForm.get('EventName').value,
     TemplateShortCode : this.bindData.TemplateShortCode
    }
    this.dialogRef.close(result);

  }

}
