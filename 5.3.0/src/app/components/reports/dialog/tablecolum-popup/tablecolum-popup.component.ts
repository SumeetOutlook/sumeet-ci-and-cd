import { Component, OnInit, ElementRef, ViewChild , Inject} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatDialogRef , MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
//import { Position } from 'ngx-perfect-scrollbar';

export interface autodata {
  AssetNo: string;
  SubNo: string;
  CapitalizationDate: string;
  AssetClass: string;
  AssetType: string;
  AssetSubType: string;
  UOM: string;
  AssetName: string;
  AssetDescription: string;
  Qty: string;
  Location: string;
  Cost: string;
  WDV: string;
  EquipmentNO: string;
  AssetCondition: string;
  AssetCriticality: string;
  
}


@Component({
    selector: 'app-tablecolum',
    templateUrl: './tablecolum-popup.component.html',
    styleUrls: ['./tablecolum-popup.component.scss']
})


export class tablecolumnComponent implements OnInit {
    public asset_no = new FormControl();
    public selectedColumnName: any;
    public valueSelected=[];
    public visible = true;
    public selectable = true;
    public removable = true;
    public addOnBlur = true;
    public separatorKeysCodes: number[] = [ENTER, COMMA];
    public newArr=[];
    public filteredassetno: Observable<any[]>;
    public allAsset_no : string[];// = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'];
    public payload=[];
   public newLength;
   public addedassetno;
   public selectedUsers:any[]=[];
   public indexarr:any[]=[];
   public newdata=[{
     AssetNo:'1',
     AssetName:'laptop'
   },
  {
    AssetNo:'2',
    AssetName:'laptop'
  }]
    @ViewChild('assetInput') assetInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;
    

    constructor(public matdialogbox: MatDialogRef<any>,@Inject(MAT_DIALOG_DATA) public data:any,public localService: LocalStoreService) {
    }
    
    public _filter(value) {
      debugger
      const filterValue = value;
      // if ((value || '').trim()) {
      //   let index = this.payload.indexOf(value.trim())
      //   if (index == -1)
      //     this.payload.push(value.trim());
      // }
      if (filterValue.length > 2) {
        return this.payload.filter(asset => asset.toLowerCase().indexOf(value.toLowerCase()) === 0).slice(0, 10);
      }
    }

    add(event: MatChipInputEvent): void {
      // Add fruit only when MatAutocomplete is not open
      // To make sure this does not conflict with OptionSelected Event
      if (!this.matAutocomplete.isOpen) {
        const input = event.input;
        const value = event.value;
  
        // Add our fruit
         
        // Reset the input value
        if (input) {
          input.value = '';
        }
  
        this.asset_no.setValue(null);
      }
    }
  
    
    public selected(event: MatAutocompleteSelectedEvent): void {
        this.selectedUsers.push(event.option.value);
        this.assetInput.nativeElement.value = '';
        this.asset_no.setValue(null);
      }

      toggleSelection(user,i) {

        debugger;
          this.selectedUsers.push(user);
          this.indexarr.push(i+1);
        //this.asset_no.setValue(this.selectedUsers);
        console.log(this.selectedUsers);
      }

    
    removeAsset(index){
      this.selectedUsers.splice(index,1);
      console.log(index);
    }
    
    remove(user: string): void {
      const index = this.selectedUsers.indexOf(user);
  
      if (index >= 0) {
        this.selectedUsers.splice(index, 1);
      }
      console.log(index);
    }

    public ngOnInit(): void {
      debugger;
      this.data.forEach(element => {
        if(this.payload.indexOf(element) == -1) {
          this.payload.push(element);
        }
      });
      this.filteredassetno = this.asset_no.valueChanges
        .pipe(
          startWith(''),
          map(value => value.length >= 1 ? this._filter(value) : []));
         debugger;
       
    }

    public onclosetab() {
      this.matdialogbox.close();

        
    }

    onChangeFilterData(val) 
    {
     debugger;
    
    //  this.filteredassetno = this.asset_no.valueChanges
    //  .pipe(
    //    startWith(''),
    //    map(value => this._filter(val)));
    //   // this.selectedColumnName = this.localService.getItem('selectedColumn');
    //      debugger
    //    this.matdialogbox.keydownEvents().subscribe(event => {
    //      if (event.key === "Escape") {
    //          this.onclosetab();
    //      }
    //  });
    //  debugger;
    //  console.log(this.filteredassetno);
    //  console.log(this.asset_no);
    


    }


  public save() {
    debugger;
   // this.matdialogbox.close(this.indexarr);
   this.matdialogbox.close(this.selectedUsers);
    
}

clear(){
  debugger;
  //this.asset_no.setValue(null);
  this.asset_no.setValue('');
  //this.valueSelected=[];
  
  console.log(this.asset_no.value);
}

}