import { Component, OnInit,Inject,ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';


interface City {
  id: string;
  name: string;
}
interface Plant {
  id: string;
  name: string;
}
interface AssetClass {
  id: string;
  name: string;
}
interface AssetType {
  id: string;
  name: string;
}
interface UOM {
  id: string;
  name: string;
}


@Component({
  selector: 'app-Upload_user_dialog',
  templateUrl: './Upload_user.component.html',
  styleUrls: ['./Upload_user.component.scss'],
  // encapsulation:ViewEncapsulation.None
})
export class UploadUserComponent implements OnInit {


  PLANTS: Plant[] = [
    { name: 'Pune', id: 'A' },
    { name: 'Nashik', id: 'B' },
    { name: 'Mumbai', id: 'C' },
    { name: 'Kolhapur', id: 'D' },
    { name: 'Delhi', id: 'E' },
    { name: 'Hydrabad', id: 'F' },
  ];
  CITY: City[] = [
    { name: 'Pune', id: 'A' },
    { name: 'Nashik', id: 'B' },
    { name: 'Mumbai', id: 'C' },
    { name: 'Kolhapur', id: 'D' },
    { name: 'Delhi', id: 'E' },
    { name: 'Hydrabad', id: 'F' },
  
  ];
  ASSETCLASS: AssetClass[] = [
    { name: 'Laptop', id: 'L' },
    { name: 'Furniture', id: 'F' },
    { name: 'LED', id: 'E' },
    { name: 'Office Furniture ', id: 'D' },
    { name: 'Office Laptop', id: 'G' },
    { name: 'Tv', id: 'H' },
  ];
  ASSETTYPE: AssetType[] = [
    { name: 'Dell', id: 'D' },
    { name: 'Hp', id: 'H' },
    { name: 'Linux', id: 'L' },
    { name: 'Mac', id: 'M' },
    { name: 'Accer', id: 'A' },
    { name: 'Assus', id: 'S' },
    { name: 'Lenovo', id: 'L' },
  
  
  ];
  ASSETUOM: UOM[] = [
    { name: 'EA', id: 'A' },
    { name: 'FA', id: 'B' },
  
  ];
  
  
  public AssetInfo: FormGroup;

  constructor( public dialogRef: MatDialogRef<UploadUserComponent>,
  private fb: FormBuilder,) { }

  ngOnInit() {
    this.buildItemForm();
  }
  buildItemForm() {
    this.AssetInfo = this.fb.group({
      CurrentFARDate: [{value:'27-Oct-2020',disabled:true}],
      UploadBy: [{value:'GRN No',disabled:true}],
      NewFARDate: [' '],
      DepnRunDate: [' '],
      FileName: [{value:' '}],
    })
  }

  onclosetab(){
    this.dialogRef.close();

  }
  

}

