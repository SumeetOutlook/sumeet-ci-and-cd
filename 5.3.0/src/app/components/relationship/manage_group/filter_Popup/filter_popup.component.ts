import { Component, OnInit,Inject,ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  name: string;
  region: any[];

}
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
interface AssetSubType {
  id: string;
  name: string;
}
interface AssetName {
  id: string;
  name: string;
}
interface AssetCriticality {
  id: string;
  name: string;
}
interface AssetCondition {
  id: string;
  name: string;
}
interface SelectedValues{
  name:string;
  values:any[];
}
@Component({
  selector: 'app-filter_Popup',
  templateUrl: './filter_Popup.component.html',
  styleUrls: ['./filter_Popup.component.scss'],
})
export class FilterPopupComponent implements OnInit {
   ELEMENT_DATA: PeriodicElement[] = [
//     {
//     name:'Plant',
//   region: [
//     { name: 'Pune', id: 'A',Selected:'' },
//     { name: 'Nashik', id: 'B',Selected:'' },
//     { name: 'Mumbai', id: 'C',Selected:'' },
//     { name: 'Kolhapur', id: 'D',Selected:'' },
//     { name: 'Delhi', id: 'E',Selected:'' },
//     { name: 'Hydrabad', id: 'F',Selected:'' },
//   ],
// },
// {
//   name:'City',
//   region: [
//     { name: 'Pune', id: 'A',Selected:'' },
//     { name: 'Nashik', id: 'B',Selected:'' },
//     { name: 'Mumbai', id: 'C',Selected:'' },
//     { name: 'Kolhapur', id: 'D',Selected:'' },
//     { name: 'Delhi', id: 'E',Selected:'' },
//     { name: 'Hydrabad', id: 'F',Selected:'' },
//   ]
// },
{
 name:'Asset Class' ,
  region: [
    { name: 'Laptop', id: 'L',Selected:'' },
    { name: 'Furniture', id: 'F',Selected:'' },
    { name: 'LED', id: 'E',Selected:'' },
    { name: 'Office Furniture ', id: 'D',Selected:'' },
    { name: 'Office Laptop', id: 'G',Selected:'' },
    { name: 'Tv', id: 'H',Selected:'' },
  ]
},
{
  name:'Asset Type',
  region: [
    { name: 'Dell', id: 'D',Selected:'' },
    { name: 'Hp', id: 'H',Selected:'' },
    { name: 'Linux', id: 'L',Selected:'' },
    { name: 'Mac', id: 'M',Selected:'' },
    { name: 'Accer', id: 'A',Selected:'' },
    { name: 'Assus', id: 'S',Selected:'' },
    { name: 'Lenovo', id: 'L',Selected:'' },
  ]
},
{
  name:'Asset UOM',
  region: [
    { name: 'EA', id: 'A',Selected:'' },
    { name: 'FA', id: 'B',Selected:'' },
  ]
},
{
  name:'Asset Sub Type',
  region: [
    { name: 'Dell Vostro', id: 'D',Selected:'' },
    { name: 'Hp', id: 'H',Selected:'' },
    { name: 'Linux', id: 'L',Selected:'' },
    { name: 'Mac', id: 'M',Selected:'' },
    { name: 'Accer', id: 'A',Selected:'' },
    { name: 'Assus', id: 'S',Selected:'' },
    { name: 'Lenovo', id: 'L',Selected:'' },
  ]
},
{
  name:'Asset Name',
  region: [
    { name: 'Laptop', id: 'L',Selected:'' },
    { name: 'Furniture', id: 'F',Selected:'' },
    { name: 'LED', id: 'E',Selected:'' },
    { name: 'Office Furniture ', id: 'D',Selected:'' },
    { name: 'Office Laptop', id: 'G',Selected:'' },
    { name: 'Tv', id: 'H',Selected:'' },
  ]
},
{
  name:'Asset Cricality',
  region: [
    { name: 'Normal', id: 'A',Selected:'' },
    { name: 'High', id: 'B',Selected:'' },
    { name: 'Medium', id: 'A',Selected:'' },
    { name: 'Low', id: 'A',Selected:'' },
  ]
},
{
  name:'Asset Condition',
  region : [
    { name: 'Good to use', id: 'A',Selected:'' },
    { name: 'Not in use', id: 'B',Selected:'' },
    { name: 'Damaged', id: 'B',Selected:'' },
    { name: 'Scrapped', id: 'B',Selected:'' },
    { name: 'Working', id: 'B',Selected:'' },
  ]
}
]
public currentData;
public regionalData: any;
public displayedColumns: string[] = ['name'];
public displayedRegions: string[] = ['region'];
public data1 = Object.assign(this.ELEMENT_DATA);
public dataSource = new MatTableDataSource<Element>(this.data1); 
  
  
  public arr:any[]=[];
  public selectedrows1 = [];
  public selectedrows2 = [];
  public toselect=0;
  public len=0;
  public selectedvalues:SelectedValues[]=[];
  
  public AssetInfo: FormGroup;

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<FilterPopupComponent>,
  private fb: FormBuilder,) { }

  ngOnInit() {
    this.buildItemForm();
    this.currentData=this.data.prop;
    console.log(this.currentData);
    console.log(this.selectedrows1);
    console.log(this.ELEMENT_DATA);
    console.log(this.data1);
    for(let i=0;i<this.data1.length;i++){
      this.selectedrows1.push("");
      for(let i=0;i<this.data1[i].region.length;i++){
        this.selectedrows2.push("");
      }
    }
    console.log(this.ELEMENT_DATA[0].region[0].Selected);
  }
  buildItemForm() {
    this.AssetInfo = this.fb.group({
      City: [],
      Plant: [],
      AssetClass: [],
      AssetType: [],
      UOM: [],
    })
  }

  onclosetab(){
    this.dialogRef.close();
  }
  applyFilter(event:Event){
    const filterValue=(event.target as HTMLInputElement).value;
    this.regionalData.filter=filterValue.trim().toLowerCase();
  }
  
  /*public save() {
    debugger;
   if(this.AssetInfo.value.City){
     this.arr.push("City");
   }
   if(this.AssetInfo.value.Plant){
     this.arr.push("Plant");
   }
   if(this.AssetInfo.value.AssetClass){
    this.arr.push("Asset Class");
  }
  if(this.AssetInfo.value.AssetType){
    this.arr.push("Asset Type");
  }
  if(this.AssetInfo.value.UOM){
    this.arr.push("UOM");
  }
   this.dialogRef.close(this.arr);
    
}*/
public getRecord(){}
getCard(i){
  console.log(i);
  this.toselect=i;
  for(let k=0;k<this.selectedrows2.length;k++){
    if(this.selectedrows2[k]==='true'){
      this.selectedrows2[k]="";
    }
  }
  for(let j=0;j<this.selectedrows1.length;j++){
   this.selectedrows1[i]="true";
   if(this.selectedrows1[j]==='true'){
   if(i!=j){
   this.selectedrows1[j]="";
   }
  }
  }
}

getcard1(i){
 console.log(i);
  this.len=this.toselect*(this.data1[this.toselect].region.length);
  for(let j=0;j<this.selectedrows2.length;j++){
   this.selectedrows2[this.len+i]="true";
   if(this.selectedrows2[j]==='true'){
   if((this.len+i)!=j){
   this.selectedrows2[j]="";
   }
  }
  }
  console.log(this.len);
  console.log(this.data[this.toselect].region.length);
console.log(this.selectedrows2);
}
public showNextData(currentData, index) {
 // this.disableadd1 = true;
 console.log(currentData);
 this.currentData=currentData;
  console.log(currentData, 'current data');
  this.regionalData = new MatTableDataSource<Element>(currentData.region);
  //this.disableadd = false;
 // this.currentGroupIndex = index;
}
optionClicked(event: Event, checkedValue,index) {
  event.stopPropagation();
}

toggleSelection(checkedValue,index) {
  let k=-1;
  if(this.currentData.region[index].Selected===true){
    if(this.selectedvalues.length===0){
      this.selectedvalues.push({name:this.currentData.name,values:[]});
        this.selectedvalues[0].values.push(checkedValue);
    }
    else{
      for(let i=0;i<this.selectedvalues.length;i++){
      if(this.selectedvalues[i].name===this.currentData.name){
        k=i;
      }
    }
      if(k!=-1){
      if(this.selectedvalues[k].values.indexOf(checkedValue)===-1){
      this.selectedvalues[k].values.push(checkedValue);
      console.log(this.selectedvalues);
      }
    }
      else{
        this.selectedvalues.push({name:this.currentData.name,values:[]});
        console.log(this.selectedvalues);
        if(this.selectedvalues[this.selectedvalues.length-1].values.indexOf(checkedValue)===-1){
        this.selectedvalues[this.selectedvalues.length-1].values.push(checkedValue);
        console.log(this.selectedvalues);
      }
    }
    }
  }
  else if(this.currentData.region[index].Selected===false){
  for(let i=0;i<this.selectedvalues.length;i++){
  for(let j=0;j<this.selectedvalues[i].values.length;j++){
    if(this.selectedvalues[i].values.length>1 && this.selectedvalues[i].values[j]===checkedValue){
    this.selectedvalues[i].values.splice(j,1);
  }
  else if(this.selectedvalues[i].values.length===1){
    console.log(this.selectedvalues[i].values.length);
    this.selectedvalues[i].values.splice(j,1);
    this.selectedvalues.splice(i,1);
  }
 }
}
}
  //console.log(this.selectedvalues);
}
public save() {
  debugger;
  this.dialogRef.close(this.selectedvalues);
}


}

