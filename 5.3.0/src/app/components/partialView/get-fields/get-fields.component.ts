import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupService } from '../../services/GroupService';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-get-fields',
  templateUrl: './get-fields.component.html',
  styleUrls: ['./get-fields.component.scss']
})
export class GetFieldsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<GetFieldsComponent>,
    public gs: GroupService, private orderPipe: OrderPipe , private jwtAuth: JwtAuthService) { this.header = this.jwtAuth.getHeaders(); }
  List: any;
  Listt: any
  searchText: string;
  order: string = 'headerName'
  header: any ;
  ListOfField: any[] = []
  ListOfField1: any[] = []
  eventForm: FormGroup;
  ngOnInit(): void {
    debugger;
    this.ListOfField = this.data.payload;
    this.ListOfField.forEach(val => {
      val.headerName = this.header[val.Custom1]
    })
    this.ListOfField1 = this.ListOfField.map(choice => choice);
    this.List = this.ListOfField.map(choice => choice.Custom1)
  }

  Onsearch(event) {   
    
    var search = event.toLowerCase();
    //this.ListOfField.forEach(val => { val.headerName = val.headerName.toLowerCase()})
    this.ListOfField = this.ListOfField1.filter(x => x.headerName.toLowerCase().indexOf(search) > -1);
  }

  checkboxclick(n) {
    debugger;
    if(n.Custom2=="1")
    {
       n.Custom2="0";
    }
    else if(n.Custom2=="0")
    {
      n.Custom2="1";
    }
  }
  save() {
    debugger;
    console.log(this.ListOfField)
    this.ListOfField = this.ListOfField1;
    this.dialogRef.close(this.ListOfField);
  }
}
