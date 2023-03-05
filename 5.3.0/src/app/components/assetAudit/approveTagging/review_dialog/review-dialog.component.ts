import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { NumberValidator } from 'ngx-custom-validators/src/app/number/directive';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-review-dialog',
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.scss']
})
export class ReviewDialogComponent implements OnInit {

  submitted: boolean = false;
  public grpnm: any;
  dialogGroupForm: FormGroup;
  get f1() { return this.dialogGroupForm.controls; };
  protected _onDestroy = new Subject<void>();
  public currencyData: any[]=[];
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  // currencyData: any;

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  public filteredCurrency: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(public matdialogbox: MatDialogRef<ReviewDialogComponent>,public localService: LocalStoreService, @Inject(MAT_DIALOG_DATA) public data: any,
  private fb: FormBuilder) { }

  dataSource  =  new MatTableDataSource<any>();
  displayedColumns: string[] = ['OriginalUser' , 'ProposedUser','Option', 'Action'];


  ngOnInit(): void {
    this.dialogGroupForm = this.fb.group({
      OUser: [this.data.OUser || '', [Validators.required]],
      oemailId: [this.data.oemailId || '',  [Validators.required,Validators.pattern(this.emailPattern)]],
      oempid: [this.data.oempid || ''],
      PUser: [this.data.PUser || '', [Validators.required]],
      pemailId: [this.data.pemailId || '',  [Validators.required,Validators.pattern(this.emailPattern)]],
      pempid: [this.data.pempid || '']
    });

    debugger;
    
     this.dataSource = new MatTableDataSource(this.data.value);

    // var str = this.data.name.UserDetails;
    // var splitted = []
    // splitted = str.split("|");

    // this.dialogGroupForm.controls['OUser'].setValue(splitted[1].trim()),
    // this.dialogGroupForm.controls['oemailId'].setValue(splitted[2].trim()),     
    // this.dialogGroupForm.controls['oempid'].setValue(splitted[0].trim()),
    // this.dialogGroupForm.controls['PUser'].setValue(splitted[1].trim()),
    // this.dialogGroupForm.controls['pemailId'].setValue(splitted[2].trim()),     
    // this.dialogGroupForm.controls['pempid'].setValue(splitted[0].trim())
  
  }

  onSubmit(){

  }

  RejectList:any;

  getRejct(data){
  debugger;
    

     if(this.RejectList != null){
      this.RejectList = this.RejectList.filter((item) => item.Option != data.Option);
     }

     else{
      this.RejectList = this.data.value.filter((item) => item.Option != data.Option);
     }
  }

  onclosetab(){
    this.matdialogbox.close(false);
  }

 
  SelectedId: any[] = [];
  ApproveAssetDto = [];
GridData : any[] = [];

  acceptandapprove(){

    this.GridData = [];



    this.SelectedId =  [];

    if(this.RejectList != null){
      this.RejectList.forEach(Id => {

        this.SelectedId.push(Id.Option);
      });
    }
    else  {
      this.data.value.forEach(Id => {

        this.SelectedId.push(Id.Option);
      });
    }
 

  this.GridData.push(this.data.name);

  this.GridData.forEach(Id => {

    var ApproveAssetDtolist = { 

     PreFarId : Id.PreFarId,
     Taggable : Id.Taggable,
     LastModifiedBy : Id.LastModifiedBy,
     LabelMaterial : Id.LabelMaterial,
     LabelSize : Id.LabelSize,
     flag : Id.Flag,
     InventoryComment : Id.InventoryComment,
     isUserAllocationAlllow : false,
     LastModifiedOn : this.JsonDate(Id.LastModifiedOn),
     isSingleAsset : true,
     Result : "Accept",
     Optionlistformodified  : this.SelectedId
   };

   this.ApproveAssetDto.push(ApproveAssetDtolist);

 });

    this.matdialogbox.close(this.ApproveAssetDto);
  
  }

  public JsonDate(datePicker) {
    Date.prototype.toJSON = function () {
      var date = '/Date(' + this.getTime() + ')/';
      return date;
    };
    var dt = new Date(datePicker);
    var dt1 = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds()));
    return dt1.toJSON();
  }

  rejectandapprove(){
debugger;
    const dialogformdata = this.dialogGroupForm.value;

    const Data1 = {

      UserId : dialogformdata.PUser,
      UserEmail : dialogformdata.pemailId,
      EmployeeId : dialogformdata.pempid,
      Result : "Reject",
      GridData :  this.data.name
    };

    this.matdialogbox.close([Data1]);
  }

}
