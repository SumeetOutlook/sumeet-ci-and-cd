import { Component, OnInit , Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITAMService } from 'app/components/services/ITAMService';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-modified-manufacturer-category-dialog',
  templateUrl: './modified-manufacturer-category-dialog.component.html',
  styleUrls: ['./modified-manufacturer-category-dialog.component.scss']
})
export class ModifiedManufacturerCategoryDialogComponent implements OnInit {

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
      manufacturerCtrl : [''],
      categoryCtrl : [''],
      softwareTypeCtrl : ['']
    })

    this.GetInitiatedData();


  }


  GetInitiatedData() {
    var Isoptions = 0;   
    let url2 = this.itamService.getSoftwareCategory();
    let url3 = this.itamService.getSoftwareManufacturer();
    let url4 = this.itamService.getSoftwareType(Isoptions)
    forkJoin([url2 , url3 ,url4]).subscribe(results => {
      debugger;
      
      if (!!results[0]) {
        this.typeOfCategorys = results[0];
        console.log(results[0]);
      }
      if (!!results[1]) {
        this.typeOfManufacturers = results[1];
        console.log(results[1]);
      }
      if (!!results[2]) {
        this.typeOfSoftwares = results[2];
        console.log(results[2]);
      }
    })
  }

  Submit(){
    
  }

}
