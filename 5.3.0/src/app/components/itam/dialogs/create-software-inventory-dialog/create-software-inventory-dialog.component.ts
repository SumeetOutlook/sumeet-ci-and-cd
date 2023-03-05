import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { FormControl } from '@angular/forms';
import { AssetService } from 'app/components/services/AssetService';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import * as header from '../../../../../assets/Headers.json';
import { DatePipe } from '@angular/common';
import { GroupService } from 'app/components/services/GroupService';
import { MatTableDataSource } from '@angular/material/table';

import { AllPathService } from 'app/components/services/AllPathServices';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { Constants } from 'app/components/storage/constants';

@Component({
  selector: 'app-create-software-inventory-dialog',
  templateUrl: './create-software-inventory-dialog.component.html',
  styleUrls: ['./create-software-inventory-dialog.component.scss']
})
export class CreateSoftwareInventoryDialogComponent implements OnInit {

    Headers: any = (header as any).default;
  
    public AssetInfo: FormGroup;
    public InventoryInfo: FormGroup;
    public AllStatus: FormGroup;
    public CostForm: FormGroup;
    public Maintenance: FormGroup;
    public OtherInfo: FormGroup;
    public Download: FormGroup;
    public HardwareInfo : FormGroup;
    public selectedIndex;
    tabEnabled : boolean= false;
    geodisabled:boolean=true;
  
    displayedColumns: string[] = ['DocumentType', 'DocumentName','ViewDocument'];
    datasource = new MatTableDataSource();
    layerid: any;
    Layertext: string;
    IslayerDisplay: any;
    HeaderLayerText: string;
  
  
    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<CreateSoftwareInventoryDialogComponent>,
      private fb: FormBuilder,
      private storage: ManagerService,
      public assetservice: AssetService,
      public loader: AppLoaderService,
      public datepipe: DatePipe,
      public groupservice: GroupService,
      public AllPath : AllPathService) { }
  
    ngOnInit() {
      this.tabEnabled = true;
      // this.GetMandatoryByFlag('IsGivenForClient');
     this.GetAssetData();
  
      
      this.layerid = this.storage.get(Constants.SESSSION_STORAGE, Constants.LAYER_ID);
      this.IslayerDisplay = this.layerid;
      if (this.layerid == 1) {
        this.Layertext = "Country";
      }
      else if (this.layerid == 2) {
        this.Layertext = "State";
      }
      else if (this.layerid == 3) {
        this.Layertext = "City";
      }
      else if (this.layerid == 4) {
        this.Layertext = "Zone";
      }
      this.HeaderLayerText = this.Layertext;
  
    }
  
    nextStep(i) {
      this.selectedIndex = i;   
    }
    previousStep(i) {
      this.selectedIndex = i;    
    }
    bindData: any[] = [];
    GetAssetData() {
   
        this.buildItemForm();
  
    }
    
  
    ListOfField: any[] = [];
    displayedColumns1: any[] = [];
    mandatoryFields: any[] = [];
    // GetMandatoryByFlag(flag) {
    //   
    //   this.groupservice.GetMandatoryByFlag(flag).subscribe((response) => {
    //     
    //     this.ListOfField = response;
    //     this.displayedColumns1 = this.ListOfField.filter(x => x.FAR == true).map(choice => choice.FieldsName);
    //   });
    // }
  
    public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
      this.nextStep(tabChangeEvent.index);
      this.previousStep(tabChangeEvent.index);    
    }
    
  
    buildItemForm() {
          
    
  
      this.AssetInfo = this.fb.group({
        AssetNo: [''],
        SubNo:  [''],
        AssetClass:  [''],
        AssetCategory:  [''],
        AssetType:  [''],
        AssetSubType:  [''],
        AssetName:  [''],
        AssetDescription:  [''],
        AllocationType:  [''],
        UserType:  [''],
        User:  [{ value: '', disabled: true }],
        Custodian:  [''],
        RevertDate:  [''],
        CapitalizationDate:  [''],
        Qty:  [''],
        SBU:  [{ value: '', disabled: true }],
        Plant:  [''],
        UOM:  [''],
        VendorName:  [''],
        PONo:  [''],
        InvoiceNo: [''],
        AssetrakStage: [''],
        GeoCity:  [''],
        GeoLocation:  [''],
        GpsDate: [''],
        UsefulLife:  [''],
        AssetExpiryDate: [''],
        AssetCondition:  [''],
        AssetCricality:  [''],
        GRNNo:  [''],
        EquipmentNumber:  [''],
      })
    
    }
    onChangeDataSource(value) {
      this.datasource = new MatTableDataSource(value);
    }
    viewpath(item){
      
      var path = item.DocumentPath.split('uploads')
      this.AllPath.ViewDocument(path[1]); 
    }
    onclosetab() {
      this.dialogRef.close(false);
  
    }
    mapLocation(){
      
            
        if (this.AssetInfo.controls['GeoLocation'].value == "") {
  
        } else {
            window.open('https://www.google.com/maps/search/?api=1&query=' + this.AssetInfo.controls['GeoLocation'].value);
        }
    }
  
}
