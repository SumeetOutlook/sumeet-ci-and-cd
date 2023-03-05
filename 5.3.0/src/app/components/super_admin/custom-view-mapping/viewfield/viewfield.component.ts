import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReplaySubject, Subject,forkJoin } from 'rxjs';
import { FormControl,FormBuilder,FormGroup,Validators } from '@angular/forms';
import { AssetService } from 'app/components/services/AssetService';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import * as header from '../../../../../assets/Headers.json';
import * as resource from '../../../../../assets/Resource.json';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
@Component({
  selector: 'app-viewfield',
  templateUrl: './viewfield.component.html',
  styleUrls: ['./viewfield.component.scss']
})
export class ViewfieldComponent implements OnInit {
  Headers: any;
  message: any = (resource as any).default;
  ListOfField1: any[] = [];
  searchText: string;
  public fieldMultiCtrl: FormControl = new FormControl();
  isActive :boolean =false;
  //public ListOfField: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public TablefilteredFieldMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  GroupId: any;
  RegionId: any;
  UserId: any;
  CompanyId: any;
  paginationParams: any;
  ListOfField:any[]=[];
  // TypeData: any[] = [
  //   { Type: '1', headerName: "AssetInfoView" },
  //   { Type: '2', headerName: "NetworkInfoView" },
  //   { Type: '3', headerName: "AuditInfoView" },
  //   { Type: '4', headerName: "HardwareInfoView" },
  //   { Type: '6', headerName: "Asset Info" },
  //   { Type: '7', headerName: "Asset No" },
  //   { Type: '8', headerName: "Location" },
  //   { Type: '9', headerName: "Plant" },
  //   { Type: '10', headerName: "Retirement Id" },
  //   { Type: '11', headerName: "Transfer Id" },
  //   { Type: '12', headerName: "Retirement AD" },
  //   { Type: '13', headerName: "Asset " },
  //   { Type: '14', headerName: "WdV" },
  //   { Type: '15', headerName: "WDV(local)" },
  //   { Type: '16', headerName: "Inventory No" },
  //   { Type: '17', headerName: "Inventory comment" },
  //   { Type: '18', headerName: "City" },
  //   { Type: '19', headerName: "MoNo" },
  //   { Type: '20', headerName: "Barcode " },
  //   { Type: '21', headerName: "AssetId" },
  //   { Type: '22', headerName: "ADL1" },
  //   { Type: '23', headerName: "ADL2" },
  //   { Type: '24', headerName: "ADL3" },
  //   { Type: '25', headerName: "Status" },
  //   { Type: '26', headerName: "AMC" },
  //   { Type: '27', headerName: "Admin" },
  //   { Type: '28', headerName: "All status" },
  //   { Type: '29', headerName: "Asset Life" },
  //   { Type: '30', headerName: "Asset Type" },
  //   { Type: '31', headerName: "Attachment" },
  //   { Type: '32', headerName: "Audit" },
  //   { Type: '33', headerName: "Audit1" },
  //   { Type: '34', headerName: "Admin2" },
  //   { Type: '35', headerName: "AdL3" },
  //   { Type: '36', headerName: "Category" },
  //   { Type: '38', headerName: "Asset catergory" },
  //   { Type: '39', headerName: "inventory cat" },
  //   { Type: '40', headerName: "Authorization" },

  //   /*	{ Type: '6', Name: "PingFed" },*/
  // ]
  TableTypeData: any[] = [
    { Type: '1', Name: "prefar" },
    { Type: '2', Name: "companylocationmaster" },
    { Type: '3', Name: "prepurchaseditassets" },
    { Type: '4', Name: "PrintLabels" },
    { Type: '5', Name: "Transfer" },
    { Type: '6', Name: "Retirement" },
    { Type: '7', Name: "assetallocationdetails" },
    { Type: '8', Name: "clientcustomizecolumn" },
    /*	{ Type: '6', Name: "PingFed" },*/
  ]
  dialogForm: FormGroup;
  standardcategorydata:any;
  viewid:any;
  disableview:boolean;
  r:any[]=[];
  get f() { return this.dialogForm.controls; };
  constructor(public dialogRef: MatDialogRef<ViewfieldComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder,
    private storage: ManagerService,
    public as:AssetService,
    private jwtAuth:JwtAuthService) {
      this.Headers = this.jwtAuth.getHeaders()
     }

  ngOnInit(): void {
    debugger;
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    this.standardcategorydata= this.data.payload;
    this.viewid= this.standardcategorydata[0].CategoryId;
    this.isActive = !this.isActive;
    this.disableview = true;
   // this.ListOfField.next(this.TypeData.slice());
    //this.TablefilteredFieldMulti.next(this.TableTypeData.slice());
    this.dialogForm = this.fb.group({
      ViewName:[this.data.value.CategoryName ||'',[Validators.required]],
     
    });
    if(this.data.value.Status=="S"){
      this.Getfielddata();
    }
    else if (this.data.value.Status=="C"){
      this.disableview=true;
      this.as.GetCustomField(this.data.value.CategoryName).subscribe(response=> {
        this.r= JSON.parse(response)
        this.r.forEach(element => {
          var Custom1= element.Custom1;
          var Custom2=  element.Custom2;

          element.Custom1= Custom2;
          element.Custom2= Custom1;
          this.ListOfField.push(element);
          
        });

      })
    }
    
  }
  TypeData:any=[];
  Getfielddata()
  {
    debugger;
  this.as.GetstandardTablename(this.GroupId,this.viewid).subscribe(r=> {
    this.ListOfField = JSON.parse(r);
    //this.ListOfField.next(this.TypeData.slice());
  })
  }
  Onsearch(event) {   
    
    var search = event.toLowerCase();
    //this.ListOfField.forEach(val => { val.headerName = val.headerName.toLowerCase()})
    //this.ListOfField = this.ListOfField1.filter(x => x.headerName.toLowerCase().indexOf(search) > -1);
  }
  save() {
    debugger;
    console.log(this.ListOfField)
   // this.ListOfField = this.ListOfField1;
    this.dialogRef.close(this.ListOfField);
  }
  checkboxclick(n) {
    n.IsForDefault = !n.IsForDefault;
  }
}
