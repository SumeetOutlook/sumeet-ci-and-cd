import { Component, OnInit,Inject,ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { LocalStoreService } from '../../../../shared/services/local-store.service';


@Component({
  selector: 'app-field_dialog',
  templateUrl: './field_dialog.component.html',
  styleUrls: ['./field_dialog.component.scss'],
})
export class DefaultFieldsComponent implements OnInit {
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
  public filters;


  selectedValue:any;
  compareValue:any;
  List:any[]=[];
 

  constructor(public dialogRef:MatDialogRef<DefaultFieldsComponent>,public localService: LocalStoreService,@Inject(MAT_DIALOG_DATA) public data: any,)
  {}

  ListOfPrefar: any = [
    {
      name: "InventoryNo",
      value: "Inventory No."
    },
    {
      name: "AssetNo",
      value: "Asset No"
    },
    {
      name: "SubNo",
      value: "Sub No"
    },
    {
      name: "AssetType",
      value: "Asset Type"
    },
    {
      name: "AssetSubType",
      value: "Asset Sub-Type"
    },
    {
      name: "CapitalizationDate ",
      value: "Capitalization Date"
    },
    {
      name: "AssetClass",
      value: "Asset Class"
    },
    {
      name: "AssetName",
      value: "Asset Name"
    },
    {
      name: "AssetDescription ",
      value: "Asset Description"
    },
    {
      name: "UOM ",
      value: "UOM"
    },
    {
      name: "Plant",
      value: "Plant"
    },
    {
      name: "Qty ",
      value: "Qty"
    },
    {
      name: "Cost ",
      value: "Cost"
    },
    {
      name: "WDV",
      value: "WDV"
    },
    {
      name: "EquipmentNo",
      value: "Equipment Number"
    },
    {
      name: "AssetCondition",
      value: "Asset Condition"
    },
    {
      name: "AssetCriticality",
      value: "Asset Criticality"
    },
    {
      name: "Status",
      value: "Status"
    },
    {
      name: "NotFoundNote",
      value: "NotFoundNote"
    }
  ];

  
 /* ListOfLabelDetails: any = [
    {
      name: "LabelMaterial ",
      value: "Label Material"
    },
    {
      name: "LabelSize",
      value: "Label Size"
    }
  ];

  ListOfPreprint: any = [
    {
      name: "InventoryComment ",
      value: "Inventory Comment"
    },
    {
      name: "SerialNo",
      value: "Serial No"
    },
    {
      name: "ITSerialNo ",
      value: "IT Serial No"
    },
    {
      name: "UserName",
      value: "User Name"
    },
    {
      name: "GPS_CoOrdinate ",
      value: "GPS_CoOrdinate"
    },
    {
      name: "GPS_Location",
      value: "GPS_Location"
    },
    {
      name: "PONumber ",
      value: "PO Number"
    },
    {
      name: "InvoiceNo",
      value: "Invoice No"
    }
  ];*/

  public selectedfilters=new Array<boolean>(this.ListOfPrefar.length);
  


  ngOnInit() {
  debugger;
  this.List=this.ListOfPrefar;
  this.filters=this.data.payload;
  for(let i=0;i<this.List.length;i++){
    this.selectedfilters[i]=false;
  }
  console.log(this.selectedfilters);
  for(let i=0;i<this.List.length;i++){
    for(let j=0;j<this.filters.length;j++){
    if(this.filters[j]===this.List[i].value){
      this.selectedfilters[i]=true;
    }
  }
  }
    this.pagename = this.localService.getItem('selectedgrp');

    if(this.pagename.name=='Define Relationship')
    {

      this.Relationship=true;
    }
    if(this.pagename.name=='Manage Group')
    {

      this.ManageGroup=true;
    }
    if(this.pagename.name=='Approve Tagging Information')
    {

      this.ApproveTaggingInformation=true;
    }
    if(this.pagename.name=='Additional Assets')
    {

      this.AdditionalAssets=true;
    }
    if(this.pagename.name=='Inventory Status')
    {

      this.InventoryStatus=true;
    }
    if(this.pagename.name=='Missing Assets')
    {

      this.MissingAssets=true;
    }
    if(this.pagename.name=='View Modified Assets')
    {

      this.ViewModifiedAssets=true;
    }
    if(this.pagename.name=='Assignment')
    {

      this.Assignment=true;
    }
    if(this.pagename.name=='Initiate Transfer')
    {

      this.InitiateTransfer=true;
    }
    if(this.pagename.name=='Transfer Approval')
    {

      this.TransferApproval=true;
    }
    if(this.pagename.name=='Initiate Retirement')
    {

      this.InitiateRetirement=true;
    }
    if(this.pagename.name=='Retirement Approval')
    {

      this.RetirementApproval=true;
    }
 
  }

  optionClicked(event: Event,index) {
    event.stopPropagation();
  }

  SelectAllFields(value){
    
  }

  onclosetab(){
    this.localService.clear();
    this.dialogRef.close();
  }

  getFields(event: MatSelectChange){
   debugger;
   /*this.compareValue=this.selectedValue;
   if( this.compareValue=='prefar')
   {
    
    this.List=this.ListOfPrefar;

   }
   if(this.compareValue=='labeldetails'){

    this.List=this.ListOfLabelDetails;
   }

   if(this.compareValue=='preprintadditionalasset'){

    this.List=this.ListOfPreprint;
   }*/

   
  




  }
  

}

