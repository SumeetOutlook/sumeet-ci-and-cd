import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupService } from '../../services/GroupService';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-export-fields',
  templateUrl: './export-fields.component.html',
  styleUrls: ['./export-fields.component.scss']
})
export class ExportFieldsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ExportFieldsComponent>,
    public gs: GroupService, private orderPipe: OrderPipe, private jwtAuth: JwtAuthService) { this.header = this.jwtAuth.getHeaders(); }
  List: any;
  Listt: any
  allSelected: Boolean = false;
  searchText: string;
  order: string = 'headerName'
  header: any;
  ListOfField: any
  ListOfField1: any
  eventForm: FormGroup;
  ngOnInit(): void {
    debugger;
    this.ListOfField = JSON.stringify(this.data.payload);
    this.ListOfField = JSON.parse(this.ListOfField);
    this.ListOfField.forEach(val => {
      val.headerName = this.header[val.Custom1]
    })
    this.ListOfField1 = this.ListOfField.map(choice => choice);
    this.List = this.ListOfField.map(choice => choice.custome1);

  }

  Onsearch(event) {

    var search = event.toLowerCase();
    //this.ListOfField.forEach(val => { val.headerName = val.headerName.toLowerCase()})
    this.ListOfField = this.ListOfField1.filter(x => x.headerName.toLowerCase().indexOf(search) > -1);
  }

  checkboxclick(n) {
    // n.IsForDefault = !n.IsForDefault;
    debugger;
    if (n.Custom2 == "1") {
      n.Custom2 = "0";
    }
    else if (n.Custom2 == "0") {
      n.Custom2 = "1";
    }
  }
  save() {
    debugger;
    console.log(this.ListOfField)
    this.ListOfField = this.ListOfField1;

    this.dialogRef.close(this.ListOfField);
  }

  selectAllFields() {
    debugger;
    if (!this.allSelected) {
      this.ListOfField.forEach(field => {
        field.Custom2 = "1";
      });
      this.allSelected = true
    } 
    else {
      this.ListOfField = JSON.stringify(this.data.payload);
      this.ListOfField = JSON.parse(this.ListOfField);
      this.ListOfField.forEach(val => {
        val.headerName = this.header[val.Custom1]
        val.Custom2 = "0";
      })
      this.allSelected = false;
    }
    this.ListOfField1 = this.ListOfField.map(choice => choice);
  }
}
