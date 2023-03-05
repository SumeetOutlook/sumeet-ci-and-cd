import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReplaySubject, Subject,forkJoin } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { AssetService } from 'app/components/services/AssetService';
import { GroupService } from 'app/components/services/GroupService';
import * as header from '../../../../../assets/Headers.json';
import * as resource from '../../../../../assets/Resource.json';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
@Component({
  selector: 'app-create-duplicate-dialog',
  templateUrl: './create-duplicate-dialog.component.html',
  styleUrls: ['./create-duplicate-dialog.component.scss']
})
export class CreateDuplicateDialogComponent implements OnInit {
  Headers: any;
  message: any = (resource as any).default;
  ListOfField1: any[] = [];
  searchText: string;
  dialogForm: FormGroup;
  GroupId: any;
  RegionId: any;
  UserId: any;
  CompanyId: any;
  paginationParams: any;

  get f() { return this.dialogForm.controls; };
  public fieldMultiCtrl: FormControl = new FormControl();
  Selectedvalueforglobal = "AssetInfo";
  //public ListOfField: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public TablefilteredFieldMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  TypeData: any[] = [
    { Type: '1', headerName: "AssetInfoView" },
    { Type: '2', headerName: "NetworkInfoView" },
    { Type: '3', headerName: "AuditInfoView" },
    { Type: '4', headerName: "HardwareInfoView" },
    { Type: '6', headerName: "Asset Info" },
    { Type: '7', headerName: "Asset No" },
    { Type: '8', headerName: "Location" },
    { Type: '9', headerName: "Plant" },
    { Type: '10', headerName: "Retirement Id" },
    { Type: '11', headerName: "Transfer Id" },
    { Type: '12', headerName: "Retirement AD" },
    { Type: '13', headerName: "Asset " },
    { Type: '14', headerName: "WdV" },
    { Type: '15', headerName: "WDV(local)" },
    { Type: '16', headerName: "Inventory No" },
    { Type: '17', headerName: "Inventory comment" },
    { Type: '18', headerName: "City" },
    { Type: '19', headerName: "MoNo" },
    { Type: '20', headerName: "Barcode " },
    { Type: '21', headerName: "AssetId" },
    { Type: '22', headerName: "ADL1" },
    { Type: '23', headerName: "ADL2" },
    { Type: '24', headerName: "ADL3" },
    { Type: '25', headerName: "Status" },
    { Type: '26', headerName: "AMC" },
    { Type: '27', headerName: "Admin" },
    { Type: '28', headerName: "All status" },
    { Type: '29', headerName: "Asset Life" },
    { Type: '30', headerName: "Asset Type" },
    { Type: '31', headerName: "Attachment" },
    { Type: '32', headerName: "Audit" },
    { Type: '33', headerName: "Audit1" },
    { Type: '34', headerName: "Admin2" },
    { Type: '35', headerName: "AdL3" },
    { Type: '36', headerName: "Category" },
    { Type: '38', headerName: "Asset catergory" },
    { Type: '39', headerName: "inventory category" },
    { Type: '40', headerName: "Authorization" },

    /*	{ Type: '6', Name: "PingFed" },*/
  ]
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
  constructor(public dialogRef: MatDialogRef<CreateDuplicateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,private fb: FormBuilder,
    public gs: GroupService,
    private storage: ManagerService,
    public as:AssetService,
    private jwtAuth:JwtAuthService) { 
      this.Headers = this.jwtAuth.getHeaders()
    }
string1 :any ="custom";
count:any;
isActive :boolean =false;
viewid:any;
checboxlist:any[]=[];
ListOfField:any[]=[];
fielddto:any ;
FieldList:any[]=[];
Viewname:any;
Custom3=parseInt(this.data.value.Custom3)+1;
  ngOnInit(): void {
     debugger;
     this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
     this.isActive = !this.isActive;
     this.viewid = this.data.value.CategoryId;
     this.Viewname = this.data.value.CategoryName +'('+this.string1 +this.Custom3+')'
    this.GetFieldsByViewId();
    //this.ListOfField.next(this.TypeData.slice());
    this.TablefilteredFieldMulti.next(this.TableTypeData.slice());
    
     //this.count = this.data.value.Categoryname+ this.count;
    this.dialogForm = this.fb.group({
      ViewName:[this.Viewname||'',[Validators.required]],
     
    });
  }
  
  GetFieldsByViewId()
  {
    this.ListOfField=[];
    this.as.GetFieldsByViewId(this.viewid).subscribe(r=>{
      
      this.ListOfField = JSON.parse(r);
      this.ListOfField.forEach(element=>{
      if(element.Custom2=='1'){
        this.checboxlist.push(element.StandardViewTableId);
        }
        else
        {

        }
      })

    })
  }
  Onsearch(event) {   
    
    var search = event.toLowerCase();
    //this.ListOfField.forEach(val => { val.headerName = val.headerName.toLowerCase()})
    //this.ListOfField = this.ListOfField1.filter(x => x.headerName.toLowerCase().indexOf(search) > -1);
  }
  save() {
    debugger;
    // var field = {
    //   Fieldname: this.ListOfField[i].
    //   ID: 
    // }
  //   this.ListOfField.forEach(element=> {
  //   var customdetails ={
  //     custome2:element,
  //     ViewName: this.dialogForm.value.ViewName,
  //     Viewid: this.viewid,
      
  //   }
  // })
   // this.ListOfField = this.ListOfField1;
   for (var i = 0; i < this.ListOfField.length; i++) {
    var field = {
      Tables: this.ListOfField[i].Custom1,
      ID: this.ListOfField[i].StandardViewTableId,
      Fieldname :this.ListOfField[i].Custom2,
      Viewname:this.dialogForm.value.ViewName,
      ViewId:this.viewid,
    }
    this.FieldList.push(field)
  }
  if (this.checboxlist.length == 0) {
   //this.toastr.success(this.message.FieldError, this.message.AssetrakSays);
  }
      
    
     this.fielddto= {
      viewid:this.viewid,
      Viewname:this.dialogForm.value.ViewName,
      tableFieldList : this.FieldList,
      GroupId: this.GroupId,
      Status: "C"
    }
  

  this.as.SaveCustomeView(this.fielddto).subscribe(r=> {
    debugger;
  })
  console.log(this.ListOfField);
    this.dialogRef.close(this.ListOfField);
  }
  checkboxclick(n) {
    debugger;
    var index = this.checboxlist.indexOf(n.StandardViewTableId);
    if (index == -1) {
      n.Custom2 = "1"; 
      this.checboxlist.push(n.StandardViewTableId);
      //this.checboxIdlist.push(n);
      this.ListOfField.forEach(element=>{
        if(element.StandardViewTableId==n.StandardViewTableId)
        {
          n.Custom2 = "1"; 
        }
      })
    }
    else {
      this.checboxlist.splice(index, 1);
      //this.checboxIdlist.splice(n);
      this.ListOfField.forEach(element=>{
        if(element.StandardViewTableId==n.StandardViewTableId)
        {
          n.Custom2 = "0"; 
        }
      })
    }
  }
}

