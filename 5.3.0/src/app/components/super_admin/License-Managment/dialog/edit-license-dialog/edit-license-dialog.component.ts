import { Component, OnInit, ViewChild, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { CredentialService } from 'app/components/services/CredentialService';
import { ToastrService } from 'ngx-toastr';
import * as headers from '../../../../../../assets/Headers.json';
import * as resource from '../../../../../../assets/Resource.json';
import { GroupService } from 'app/components/services/GroupService';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AppLoaderService } from '../../../../../shared/services/app-loader/app-loader.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';


export interface type {
  value: string;
  viewValue: string;
}



@Component({
  selector: 'app-edit-license-dialog',
  templateUrl: './edit-license-dialog.component.html',
  styleUrls: ['./edit-license-dialog.component.scss']
})
export class EditLicenseDialogComponent implements OnInit {
  yearSelected: any ;
  facultySelected: any;
  header: any ;
  message: any = (resource as any).default;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  title: "User Credential";
  submitted: boolean = false;
  dialogForm: FormGroup;
  todatedisable: boolean = false;
  get f2() { return this.dialogForm.controls; };


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    private _formBuilder: FormBuilder,
    public credentialservice: CredentialService,
    public gp: GroupService,
    public toastr: ToastrService,
    private loader: AppLoaderService,
    public datepipe: DatePipe,
    private jwtAuth:JwtAuthService
  ) 
  {
    this.header = this.jwtAuth.getHeaders()
   }

   LicenseTypeField = [
    {
      value: '1',
      viewValue: 'Perpetual'
    },
    {
      value: '2',
      viewValue: 'Subscriptions'
    },
    {
      value: '3',
      viewValue: 'Support'
    }
  ]
  LicenseProductField = [
    {
      value: '1',
      year:'1',
      viewValue: 'Assetcues Audit'
    },
    {
      value: '2',
      year:'2',
      viewValue: 'Assetcues Enterprise'
    },
    {
      value: '3',
      year:'3',
      viewValue: 'DiskoverIT'
    }
  ];
  
  ModuleField = [ 
  
    {
      value: '19',
      year:'1',
      viewValue: 'NONFAR'
    },
    {
      value: '19',
      year:'2',
      viewValue: 'NONFAR'
    },
    {
      value: '20',
      year:'1',
      viewValue: 'GRN'
    },
    {
      value: '20',
      year:'2',
      viewValue: 'GRN'
    },
    {
      value: '107',
      year:'1',
      viewValue: 'Assignment'
    },
    {
      value: '107',
      year:'2',
      viewValue: 'Assignment'
    },
    {
      value: '39',
      year:'1',
      viewValue: 'Transfer'
    },
    {
      value: '39',
      year:'2',
      viewValue: 'Transfer'
    },
    {
      value: '46',
      year:'1',
      viewValue: 'Retirement'
    },
    {
      value: '46',
      year:'2',
      viewValue: 'Retirement'
    },
    {
      value: '26',
      year:'1',
      viewValue: 'Audit'
    },
    {
      value: '26',
      year:'2',
      viewValue: 'Audit'
    },
    {
      value: '67',
      year:'1',
      viewValue: 'Contract Management'
    },
    {
      value: '67',
      year:'2',
      viewValue: 'Contract Management'
    },
    {
      value: '127',
      year : '3',
      viewValue: 'ITAM'
    }
  ];
  UtilizationField = [
    {
      value: 'G',
      viewValue: 'Group'
    },
    {
      value: 'C',
      viewValue: 'Company'
    }
  ];
  GroupId:any;
  getselectedIds: any;
  GridData: any[];
  licenselevel : any;
  ngOnInit() {

    this.GroupId = this.data.configdata.GroupId;
    this.getselectedIds= this.data.configdata.getselectedIds;
    this.dialogForm = this._formBuilder.group({
      Type: ['', Validators.required],
      Product: ['', Validators.required],
      Module: ['', Validators.required],
      From_Date: ['', Validators.required],
      To_Date: ['', Validators.required],
      License_Level: ['', Validators.required]
    })

    this.GetGridData();

  }

  onclosetab() {
    this.dialogRef.close(false);
  }
  onChange(event) {
    console.log(event)
  }
  get Modulefield() {
    return this.ModuleField.filter(field => {
      return field.year == this.yearSelected
    })
  }
 
  licenseid:any;
  Submit() {
    debugger;
    var From_Date = this.datepipe.transform(this.dialogForm.get('From_Date').value, 'dd-MMM-yyyy');
    var To_Date = this.datepipe.transform(this.dialogForm.get('To_Date').value, 'dd-MMM-yyyy');
    var module = this.dialogForm.get('Module').value;
    this.GridData.forEach(element => {
      debugger;
    if(this.getselectedIds == element.LicenseID){
      this.licenseid = element.LicenseID;
    }
    })
    
    var data = {
      GroupID : this.GroupId,
      Type: this.dialogForm.get('Type').value,
      Product: this.dialogForm.get('Product').value,
      Module: module.join(','),
      FromDate: From_Date,
      ToDate: To_Date,
      LicenseLevel: this.dialogForm.get('License_Level').value,
      LastModifiedBy : this.GroupId,
      LicenseID : this.licenseid,
      status : "",
    }
    this.dialogRef.close(data);

  }

  ChangeType(){
    debugger;
    var type = this.dialogForm.get('Type').value
    if(type == "1"){
      this.todatedisable= true;
      this.dialogForm.controls['To_Date'].setValue("");
    }
    else
    {
      this.todatedisable= false;
    }
    //this.todatedisable = !this.todatedisable

  }

  GetGridData() {
    debugger;
    this.gp.GetAllLicenseDetails(this.GroupId).subscribe(r => {
      debugger;
      if (!!r)
      this.GridData = JSON.parse(r);
      {
        this.GridData.forEach(element => {
          debugger;
        if(this.getselectedIds == element.LicenseID){
          this.dialogForm.controls['Type'].setValue(element.Type);
          this.dialogForm.controls['Product'].setValue(element.Product);
          this.dialogForm.controls['License_Level'].setValue(element.LicenseLevel);
          this.dialogForm.controls['From_Date'].setValue(element.FromDate);
          // if(element.LicenseLevel=="G")
          // {
          // this.dialogForm.controls['License_Level'].setValue("Group");
          // this.licenselevel = "Group"
          // }
          // else
          // {
          // this.dialogForm.controls['License_Level'].setValue("Company");
          // this.licenselevel = "Company"
          // }
          if(element.Type == "1")
          {
            this.dialogForm.controls['To_Date'].disable();
            this.todatedisable = true;
          }
          else
          {
            this.dialogForm.controls['To_Date'].enable();
            this.dialogForm.controls['To_Date'].setValue(element.ToDate);
          }
          
         if(element.Module) 
         { 
           this.ModuleField.forEach(x=> {
            if(x.viewValue == element.ModuleNamelist)
            this.ModuleField.push(element.ModuleNamelist)
           }
           )
           //  this.ModuleField.push(element.module)
         }
          
          
          ///this.dialogForm.controls['Module'].setValue(element.Module);
        }
        })
      }
    })
    }
}