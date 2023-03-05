import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GroupService } from '../../services/GroupService';
import * as headers from '../../../../assets/Headers.json';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { OrderPipe } from 'ngx-order-pipe';
import {MatChipInputEvent} from '@angular/material/chips';
import {ENTER, COMMA} from '@angular/cdk/keycodes';
@Component({
  selector: 'app-multi-search-dialog',
  templateUrl: './multi-search-dialog.component.html',
  styleUrls: ['./multi-search-dialog.component.scss']
})
export class MultiSearchDialogComponent implements OnInit {

  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];

  fruits = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MultiSearchDialogComponent>,
    public gs: GroupService, private orderPipe: OrderPipe) { }

    ngOnInit(){
}

  add(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: any): void {
    let index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  save(){
    console.log(this.fruits)
    this.dialogRef.close(this.fruits);
  }

  paste(event: ClipboardEvent): void {
    event.preventDefault(); //Prevents the default action
    event.clipboardData
    .getData('Text') //Gets the text pasted
    .split(/;|,|\n/) //Splits it when a SEMICOLON or COMMA or NEWLINE
    .forEach(value => {
    if(value.trim()){
    this.fruits.push({ name: value.trim() }); //Push if valid
    }
    })
    }
  

}
