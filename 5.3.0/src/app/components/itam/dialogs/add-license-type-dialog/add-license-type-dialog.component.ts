import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITAMService } from 'app/components/services/ITAMService';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import {MatChipInputEvent} from '@angular/material/chips';
import {ENTER, COMMA} from '@angular/cdk/keycodes';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-license-type-dialog',
  templateUrl: './add-license-type-dialog.component.html',
  styleUrls: ['./add-license-type-dialog.component.scss']
})
export class AddLicenseTypeDialogComponent implements OnInit {

  dialogForm: FormGroup;

  TrackByData: any[] = [];
  AllowedData: any[] = [];

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];

  fruits = [];

  disableManufacturer: boolean = true;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    public itamService: ITAMService,
    private fb: FormBuilder,
    public datepipe: DatePipe,) {

    this.TrackByData = [
      { value: '1', viewValue: 'WorkStation' },
      { value: '2', viewValue: 'User' }
    ];

    this.AllowedData = [
      { value: 'Multiple', viewValue: 'Multiple' },
      { value: 'OEM', viewValue: 'OEM' },
      { value: 'Single', viewValue: 'Single' },
      { value: 'Unlimited', viewValue: 'Unlimited' }
    ];
  }

  public typeOfSoftwares: any[] = [];
  public typeOfCategorys: any[] = [];
  public typeOfManufacturers: any[] = [];

  get f() { return this.dialogForm.controls; };
  ngOnInit(): void {
    //this.CompanyId = this.data.payload.CompanyId;

    var Mid = this.data.ManufacturerId;

    this.dialogForm = this.fb.group({
      LicenseTypeCtrl: ['', [Validators.required]],
      //ManufacturerCtrl: [Mid, [Validators.required]],
      TrackByDataCtrl: ['', [Validators.required]],
      AllowedDataCtrl: ['', [Validators.required]],
      OptionTypeCtrl: ['', [Validators.required]]
      
    })

    this.GetInitiatedData();


  }

  changeFlag(flag){
    flag = !flag;
  }

  isNodeLocked : boolean = false ;
  isPerpetual : boolean = false ;
  IsFreelicense : boolean = false ;

  GetInitiatedData() {
    var Isoptions = 0;
    let url1 = this.itamService.getSoftwareManufacturer();
    let url2 = this.itamService.getTrackby();
    forkJoin([url1 , url2 ]).subscribe(results => {
      debugger;
      if (!!results[0]) {
        this.typeOfManufacturers = results[0];
        console.log(results[0]);
      }
      if (!!results[1]) {
        this.TrackByData = results[1];
        console.log(results[1]);
      }
    })
  }

  getInstallationsallowed(TrackID){
    this.itamService.getInstallationsallowed(TrackID).subscribe(r => {
      debugger;
      this.AllowedData = r;
      console.log(this.AllowedData);
    })
  }
  OptionTypes : any[]=[];
  GetSoftwareLicenseOption(){
    var reqData = {
      trackbyID : !!this.dialogForm.value.TrackByDataCtrl ? this.dialogForm.value.TrackByDataCtrl : 0,
      installationsID : !!this.dialogForm.value.AllowedDataCtrl ? this.dialogForm.value.AllowedDataCtrl : 0
    }
    this.itamService.getsoftwarelicenseoption(reqData).subscribe(r => {
      debugger;
      this.OptionTypes = r;
      console.log(this.OptionTypes);
    })
  }

  Submit() {
    debugger;
    //console.log(this.fruits)
    //var LicenseOption = (!!this.fruits && this.fruits.length > 0) ? JSON.stringify(this.fruits) : "";
    var data = {
      LicenseType : this.dialogForm.value.LicenseTypeCtrl,
      LicenseTypeOptionsMapID : this.dialogForm.value.OptionTypeCtrl
    }
    console.log(data)
    this.dialogRef.close(data);
  }

  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;

  add(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push({ LicenseOption : value.trim() });
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

  paste(event: ClipboardEvent): void {
    event.preventDefault(); //Prevents the default action
    event.clipboardData
      .getData('Text') //Gets the text pasted
      .split(/;|,|\n/) //Splits it when a SEMICOLON or COMMA or NEWLINE
      .forEach(value => {
        if (value.trim()) {
          this.fruits.push({ LicenseOption : value.trim() }); //Push if valid
        }
      })
  }

}
