import { Component, OnInit, Inject, ViewChild,EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import * as headers from '../../../../../assets/Headers.json';
import { LocalStoreService } from '../../../../shared/services/local-store.service';

@Component({
  selector: 'app-createassetclass-dialog',
  templateUrl: './createassetclass-dialog.component.html',
  styleUrls: ['./createassetclass-dialog.component.scss']
})
export class CreateAssetClassDialogComponent implements OnInit {
  products: any = (headers as any).default;
  submitted: boolean = false;
  array;
  public cpuClass:string;
  dialogForm: FormGroup;
  splitedName: any [] = [];
  get f() { return this.dialogForm.controls; };
  displayedHeadersAssetClass:string[] = [this.products.AssetClass,this.products.ShortName];
  blockLength: any=55;
  AcronymLength: any=28;

  constructor(public dialogRef: MatDialogRef<CreateAssetClassDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,public localService: LocalStoreService
  ) { }

  ngOnInit() {
    this.dialogRef.updateSize("'auto'");
    this.dialogForm = this.fb.group({
      AssetClass:[this.data.AssetClass ||'',[Validators.required,this.noWhitespaceValidator]],
      ShortName:[this.data.ShortName || '',[Validators.required,this.noWhitespaceValidator]],
    });

    // if(this.data.value==='edit')
    // {
    //   this.splitedName =this.data.payload.ShortName.split('|', 2);
    // }

    if(this.data.component1=="assetClassComponent" && this.data.value=='edit')
    {
      this.dialogForm.controls['AssetClass'].setValue(this.data.payload.BlockName),
      this.dialogForm.controls['ShortName']. setValue(this.data.payload.Acronym)
    }
  }
  
  onclosetab(){
    debugger;
    this.dialogRef.close();
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
  onSubmit() {
    debugger;
    if (this.data.component1=='assetClassComponent' && this.dialogForm.valid) {
      var assetClassData={
        BlockName: this.dialogForm.value.AssetClass.trim(),
        Acronym: this.dialogForm.value.ShortName.trim(),       
      }
      this.dialogRef.close(assetClassData)
    }
    
  }

}
