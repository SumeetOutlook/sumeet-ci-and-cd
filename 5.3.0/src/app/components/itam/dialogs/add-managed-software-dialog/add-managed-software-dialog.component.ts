import { Component, OnInit , Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITAMService } from 'app/components/services/ITAMService';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-managed-software-dialog',
  templateUrl: './add-managed-software-dialog.component.html',
  styleUrls: ['./add-managed-software-dialog.component.scss']
})
export class AddManagedSoftwareDialogComponent implements OnInit {

  dialogForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<any>,
  public itamService : ITAMService ,
  private fb: FormBuilder,) { }

  public typeOfSoftwares: any[] = [];
  public typeOfCategorys: any[] = [];
  public typeOfManufacturers: any[] = [];

  get f() { return this.dialogForm.controls; };
  ngOnInit(): void {
    //this.CompanyId = this.data.payload.CompanyId;

    this.dialogForm = this.fb.group({
      unmanagedSoftwareCtrl : ['', [Validators.required]],
      unmanagedSoftwareFilterCtrl : ['']
    })

    this.GetInitiatedData();


  }
  unmanagedSoftwareList :any[]=[];

  GetInitiatedData() { 
    var Mid = this.data.ManufacturerId;
    let url2 = this.itamService.getunmanagedsoftware(Mid);
    forkJoin([url2]).subscribe(results => {
      debugger;
      
      if (!!results[0]) {
        this.unmanagedSoftwareList = results[0];
        console.log(results[0]);
      }
    })
  }

  Submit(){
    var SoftwareId = this.dialogForm.value.unmanagedSoftwareCtrl;
    this.dialogRef.close(SoftwareId);
  }


}
