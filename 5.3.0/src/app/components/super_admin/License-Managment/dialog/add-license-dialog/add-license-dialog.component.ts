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
  selector: 'app-add-license-dialog',
  templateUrl: './add-license-dialog.component.html',
  styleUrls: ['./add-license-dialog.component.scss']
})
export class AddLicenseDialogComponent implements OnInit {
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
  GridData: any[];
  fielddisable: boolean = false;
  get f2() { return this.dialogForm.controls; };


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    private _formBuilder: FormBuilder,
    public credentialservice: CredentialService,
    public gp: GroupService,
    public toastr: ToastrService,
    private loader: AppLoaderService,
    public datepipe: DatePipe,
    private jwtAuth :JwtAuthService
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
  ngOnInit() {
    this.GetGridData();
    debugger;
    this.GroupId = this.data.configdata.GroupId;
    
    this.dialogForm = this._formBuilder.group({
      Type: ['', Validators.required],
      Product: ['', Validators.required],
      Module: ['', Validators.required],
      From_Date: ['', Validators.required],
      To_Date: ['', Validators.required],
      License_Level: ['', Validators.required]
    })



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
  Submit() {
    debugger;
    var From_Date = this.datepipe.transform(this.dialogForm.get('From_Date').value, 'dd-MMM-yyyy');
    var To_Date = this.datepipe.transform(this.dialogForm.get('To_Date').value, 'dd-MMM-yyyy');
    var module = this.dialogForm.get('Module').value;
    var data = {
      GroupID : this.GroupId,
      Type: this.dialogForm.get('Type').value,
      Product: this.dialogForm.get('Product').value,
      Module: module.join(','),
      FromDate: this.dialogForm.get('From_Date').value,
      ToDate: this.dialogForm.get('To_Date').value,
      LicenseLevel: this.dialogForm.get('License_Level').value,
      LastModifiedBy : this.GroupId
    }
    this.dialogRef.close(data);

  }
  submitbtn=false
  ChangeType(value){
    debugger;
    if(value === '1'){    
      this.todatedisable = true;
      //this.toastr.warning('Already available', this.message.AssetrakSays);
    }
      else{
        this.todatedisable = false;
      }
      // this.gp.GetLicensedetailbyGroupIdAndType(this.GroupId,value).subscribe(r=>{
      //   debugger;

      // })
      this.gp.GetAllLicenseDetails(this.GroupId).subscribe(r => {
        debugger;
        this.GridData = [];
        if (!!r) {
          this.GridData = JSON.parse(r);
          console.log('data',this.GridData)
          this.GridData.forEach(element => {
            debugger;
            if (element.Type == value && element.GroupID == this.GroupId) {
              if(value==="1"){
                debugger;
              this.toastr.warning('Already available', this.message.AssetrakSays);
              this.submitbtn=true;
              this.GetGridData();
              }
              else{
                this.submitbtn= false;
              }
            }
            // if (element.Type == value) {
            //   this.toastr.warning('Already available', this.message.AssetrakSays);
            //   element.TypeName = 'Saas';
            // }
            // if (element.Type == value) {
            //   this.toastr.warning('Already available', this.message.AssetrakSays);
            //   element.TypeName = 'Support';
            // }
            if(element.LicenseLevel== 'G')
            {
              
            }
          })
        }
        })
    

  }
    GetGridData() {
    debugger;
    this.gp.GetAllLicenseDetails(this.GroupId).subscribe(r => {
      debugger;
      this.GridData = [];
      if (!!r) {
        this.GridData = JSON.parse(r);
        console.log('data',this.GridData)
        
        this.GridData.forEach(element => {
          if (element.Type == '1') {
            element.TypeName = 'Perpetual';
            this.fielddisable = true ;
          }
          if (element.Type == '2') {
            element.TypeName = 'Saas';
          }
          if (element.Type == '3') {
            element.TypeName = 'Support';
          }
          if(element.LicenseLevel== 'G')
          {
            debugger;
          }
        })
      }
      
    })
  }

}
