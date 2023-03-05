import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { MatSelectChange } from '@angular/material/select';
import { LocalStoreService } from 'app/shared/services/local-store.service';
//import { AdminService } from 'app/components/services/admin.service';
//import * as headers from '../../../../constantJson/tableHeaders.json';
//import { CommonService } from 'app/components/services/common.service';

@Component({
  selector: 'app-location-list-dialog',
  templateUrl: './location-list-dialog.component.html',
  styleUrls: ['./location-list-dialog.component.scss']
})
export class LocationListDialogComponent implements OnInit {


  optionValue:any;
  Relationship:boolean=false;
  ManageGroup:boolean=false;
  ApproveTaggingInformation:boolean=false;
  AdditionalAssets:boolean=false;
  InventoryStatus:boolean=false;
  MissingAssets:boolean=false;
  ViewModifiedAssets:boolean=false;
  Assignment:boolean=false;
  InitiateTransfer:boolean=false;
  TransferApproval:boolean=false;
  InitiateRetirement:boolean=false;
  RetirementApproval:boolean=false;
  AdditionalAssetsReconc:boolean=false;
 
  public pagename:any;

  selectedValue:any;
  compareValue:any;
  List:any[]=[];
  fb: any;
  locationTypes : any[] = [
    {id:1,name:'Mumbai'},
    {id:2,name:'Kolhapur'},
    {id:3,name:'Pune'},
    {id:4,name:'Sangli'},{id:5,name:'Goa'}
  ];
  locationIds : any[] = [];
  locationNames : any[] = [];
  submitted: boolean = false;
  matdialogbox1: any;
 
  dialogForm: FormGroup;
  get f() { return this.dialogForm.controls; };  
  //ListOfPrefar: any[];
 

  constructor(public dialogRef:MatDialogRef<LocationListDialogComponent>,public localService: LocalStoreService)
  {}
  // locationTypes: any = [
  //   {
  //     name: "Pune",
  //     value: "Pune"
  //   },
  //   {
  //     name: "Kolhapur",
  //     value: "Kolhapur"
  //   },
   
  // ];


  ngOnInit() {
  debugger;
   //this.dialogRef.updateSize("450px");
    this.dialogForm = this.fb.group({

    });
    this.locationGetData();
    // if(this.data.rowData.locationIds.length > 0 ){
    //   this.locationIds= this.data.rowData.locationIds;
    //   this.locationNames= this.data.rowData.locationNames.split(',');
    //   //this.locationNames= this.data.rowData.locationNames;
    // }  
    
  }

  onclosetab(){
    this.localService.clear();
    this.dialogRef.close();
  }

  getFields(event: MatSelectChange){
   debugger;

   this.compareValue=this.selectedValue;
   if( this.compareValue=='prefar')
   {
    
    this.List=this.locationTypes;

   }
  }
  

//  products: any = (headers as any).default;
 

  // ngOnInit() {
  //   debugger;
  //   //this.dialogRef.updateSize("450px");
  //   this.dialogForm = this.fb.group({

  //   });
  //   this.locationGetData();
  //   if(this.data.rowData.locationIds.length > 0 ){
  //     this.locationIds= this.data.rowData.locationIds;
  //     this.locationNames= this.data.rowData.locationNames.split(',');
  //     //this.locationNames= this.data.rowData.locationNames;
  //   }  
    
  // }

  locationGetData() {
  // this.cs.locationGetData().subscribe(r => {
  //     r.data.forEach(element => {
  //       this.locationTypes.push(element)
  //     });
  //   })
  }

  addLocations(p){
    debugger;
    var idx = this.locationIds.indexOf(p.id);
    if(idx > -1 ){
      this.locationIds.splice(idx , 1);
      this.locationNames.splice(idx , 1);
    }
    else{
      this.locationIds.push(p.id);
      this.locationNames.push(p.name);
    }
  }
  onSubmit() {
    debugger;
    if (this.dialogForm.invalid) {
      return false;
    }
    else {      
      var data ={
        locationIds: this.locationIds,
        locationNames : this.locationNames
      }
      this.dialogRef.close(data)
    }
  }
  
 

}
