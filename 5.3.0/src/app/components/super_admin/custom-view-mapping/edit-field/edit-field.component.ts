import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReplaySubject, Subject,forkJoin } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { AssetService } from 'app/components/services/AssetService';
import { GroupService } from 'app/components/services/GroupService';
import * as header from '../../../../../assets/Headers.json';
import * as resource from '../../../../../assets/Resource.json';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-edit-field',
  templateUrl: './edit-field.component.html',
  styleUrls: ['./edit-field.component.scss']
})
export class EditFieldComponent implements OnInit {
  Headers: any;
  message: any = (resource as any).default;
 
  ListOfField: any[] = [];
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
  viewid:any;
  viewname:any;
  fielddto:any ;
  FieldList:any[]=[];
  checboxIdlist: any[] = [];
  pagenamelist: any[] = [];
  checboxlist:any[]=[];
  TypeData: any[] = [
    // { Type: '1', headerName: "AssetInfoView" },
    // { Type: '2', headerName: "NetworkInfoView" },
    // { Type: '3', headerName: "AuditInfoView" },
    // { Type: '4', headerName: "HardwareInfoView" },
    // { Type: '6', headerName: "Asset Info" },
    // { Type: '7', headerName: "Asset No" },
    // { Type: '8', headerName: "Location" },
    // { Type: '9', headerName: "Plant" },
    // { Type: '10', headerName: "Retirement Id" },
    // { Type: '11', headerName: "Transfer Id" },
    // { Type: '12', headerName: "Retirement AD" },
    // { Type: '13', headerName: "Asset " },
    // { Type: '14', headerName: "WdV" },
    // { Type: '15', headerName: "WDV(local)" },
    // { Type: '16', headerName: "Inventory No" },
    // { Type: '17', headerName: "Inventory comment" },
    // { Type: '18', headerName: "City" },
    // { Type: '19', headerName: "MoNo" },
    // { Type: '20', headerName: "Barcode " },
    // { Type: '21', headerName: "AssetId" },
    // { Type: '22', headerName: "ADL1" },
    // { Type: '23', headerName: "ADL2" },
    // { Type: '24', headerName: "ADL3" },
    // { Type: '25', headerName: "Status" },
    // { Type: '26', headerName: "AMC" },
    // { Type: '27', headerName: "Admin" },
    // { Type: '28', headerName: "All status" },
    // { Type: '29', headerName: "Asset Life" },
    // { Type: '30', headerName: "Asset Type" },
    // { Type: '31', headerName: "Attachment" },
    // { Type: '32', headerName: "Audit" },
    // { Type: '33', headerName: "Audit1" },
    // { Type: '34', headerName: "Admin2" },
    // { Type: '35', headerName: "AdL3" },
    // { Type: '36', headerName: "Category" },
    // { Type: '38', headerName: "Asset catergory" },
    // { Type: '39', headerName: "inventory cat" },
    // { Type: '40', headerName: "Authorization" },

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
  constructor(public dialogRef: MatDialogRef<EditFieldComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    public gs: GroupService,
    private storage: ManagerService,
    public as:AssetService,
    private jwtAuth:JwtAuthService
    ) {
      this.Headers = this.jwtAuth.getHeaders()
     }

  ngOnInit(): void {
    debugger;
    this.isActive = !this.isActive;
    this.viewid= this.data.payload.CategoryId;
    this.viewname = this.data.payload.CategoryName;
    this.as.GetCustomField(this.viewname).subscribe(r=> {
      this.ListOfField = JSON.parse(r);
      this.ListOfField.forEach(element=>{
      if(element.Custom1=='1'){
        this.checboxlist.push(element.ViewId);
        }
        else
        {

        }
      })
    })
    // this.ListOfField.next(this.TypeData.slice());
    this.TablefilteredFieldMulti.next(this.TableTypeData.slice());
  }
  Onsearch(event) {   
    
    var search = event.toLowerCase();
    //this.ListOfField.forEach(val => { val.headerName = val.headerName.toLowerCase()})
    //this.ListOfField = this.ListOfField1.filter(x => x.headerName.toLowerCase().indexOf(search) > -1);
  }
  save() {
    debugger;
    for (var i = 0; i < this.ListOfField.length; i++) {
      var field = {
        Tables: this.ListOfField[i].Custom2,
        ID: this.ListOfField[i].ViewId,
        Fieldname :this.ListOfField[i].Custom1,//edit customview Isactive Flag 
        Viewname:this.ListOfField[i].viewname,
      }
      this.FieldList.push(field)
    }
    if (this.checboxlist.length == 0) {
     //this.toastr.success(this.message.FieldError, this.message.AssetrakSays);
    }
        
      
       this.fielddto= {
        viewid:this.viewid,
        tableFieldList : this.FieldList,
        
      }
    

    this.as.SaveFieldCustomView(this.fielddto).subscribe(r=> {})
    console.log(this.ListOfField);
   // this.ListOfField = this.ListOfField1;
    this.dialogRef.close(this.ListOfField);
  }
  checkboxclick(n) {
    debugger;
    var index = this.checboxlist.indexOf(n.ViewId);
    if (index == -1) {
      n.Custom1 = "1"; 
      this.checboxlist.push(n.ViewId);
      this.checboxIdlist.push(n);
      this.ListOfField.forEach(element=>{
        if(element.ViewId==n.ViewId)
        {
          n.Custom1 = "1"; 
        }
      })
    }
    else {
      this.checboxlist.splice(index, 1);
      this.checboxIdlist.splice(n);
      this.ListOfField.forEach(element=>{
        if(element.ViewId==n.ViewId)
        {
          n.Custom1 = "0"; 
        }
      })
    }
    n.IsForDefault = !n.IsForDefault;
  }
}
