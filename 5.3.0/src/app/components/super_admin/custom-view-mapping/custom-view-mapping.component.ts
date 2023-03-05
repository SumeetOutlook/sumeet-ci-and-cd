import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReplaySubject, Subject,forkJoin } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog, MatDialogConfig, } from '@angular/material/dialog';
import { GetFieldsComponent } from 'app/components/partialView/get-fields/get-fields.component';
import { GroupService } from 'app/components/services/GroupService';
//import { FieldDialogPopupComponent } from '../standard-view-mapping/field-dialog-popup/field-dialog-popup.component';
import { FieldDialogPopupComponent } from '../standard-view-mapping/field-dialog-popup/field-dialog-popup.component';
import { CreateDuplicateDialogComponent } from './create-duplicate-dialog/create-duplicate-dialog.component';
import { EditFieldComponent } from './edit-field/edit-field.component';
import { ViewfieldComponent } from './viewfield/viewfield.component'; 
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { AssetService } from 'app/components/services/AssetService';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { N } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-custom-view-mapping',
  templateUrl: './custom-view-mapping.component.html',
  styleUrls: ['./custom-view-mapping.component.scss']
})
export class CustomViewMappingComponent implements OnInit {

  dialogRoleForm: FormGroup;
  ModifiedList: any;
  count :any;
  hidebtn:boolean=false;
  ApproveMandatoryField: any[] = [];
  displayedColumns: any[] = ['select'];
  public fieldMultiCtrl: FormControl = new FormControl();
  panelOpenState = new Array<boolean>();
  panelOpenState1 = new Array<boolean>();
  SubModules_OpenState = new Array();
  CreateModules_OpenState = new Array<boolean>();
  countval:boolean=false;
  Countvalue:boolean=false;
  count1:any;
//  public fieldMultiFilterCtrl: FormControl = new FormControl();
 public filteredFieldMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
 public TablefilteredFieldMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
 public FieldfilteredFieldMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

 GroupId: any;
  RegionId: any;
  UserId: any;
  CompanyId: any;
  paginationParams: any;
 
  StandardTypeData1: any[] = [
    // { Type: '1', Name: "AssetInfoview" },
    // { Type: '2', Name: "NetworkInfoview" },
    // { Type: '3', Name: "AuditInfoview" },
    // { Type: '4', Name: "HardwareInfoview" },
    // { Type: '5', Name: "TransferInfoview" },
    // { Type: '6', Name: "RetirementInfoView" },
    // { Type: '7', Name: "Notification" },
    // { Type: '8', Name: "Reports" },
  ]

    StandardTypeData2: any[] = [
      // { Type: '1', Name: "AssetInfoView" },
    //  { Type: '2', Name: "NetworkInfo" },
    //  { Type: '3', Name: "AuditInfo" },
    //  { Type: '4', Name: "HardwareInfo" },
    //  { Type: '5', Name: "TransferInfo" },
    //  { Type: '6', Name: "RetirementInfoView" },
    //  { Type: '7', Name: "Notification" },
    //  { Type: '8', Name: "Setting and Reports" },
  ]
    StandardTypeData: any[] = [
      // { Type: '1', Name: "AssetInfoView(Custom1)" },
      // { Type: '2', Name: "AssetInfoView(Custom2)" }
      //{ Type: '3', Name: "AuditInfoView" },
     // { Type: '4', Name: "HardwareInfoView" },
    ]
  
  TableTypeData: any[] = [
    { Type: '1', Name: "AssetInfoView" },
  //  { Type: '2', Name: "AssetInfoView2" },
   
 
    /*	{ Type: '6', Name: "PingFed" },*/
  ]
  fieldTypeData: any[] = [
    { Type: '1', Name: "Assetno" },
    { Type: '2', Name: "AssetInfo" },
    { Type: '3', Name: "Inventory No" },
    { Type: '4', Name: "Transfer ID" },
    { Type: '5', Name: "Transfer date " },
    { Type: '6', Name: "Retirement date" },
    { Type: '7', Name: "Condition" },
    { Type: '9', Name: "Retirement Condition" },
    { Type: '10', Name: "UserID" },
    { Type: '11', Name: "UserName" },
    { Type: '12', Name: "Plant" },
    { Type: '13', Name: "Location" },
    { Type: '14', Name: "WdV" },
    { Type: '15', Name: "WDV(local)" },
    { Type: '16', Name: "Inventory No" },
    { Type: '17', Name: "Inventory comment" },
    { Type: '18', Name: "City" },
    { Type: '19', Name: "MoNo" },
    { Type: '20', Name: "Barcode " },
    { Type: '21', Name: "AssetId" },
    { Type: '22', Name: "ADL1" },
    { Type: '23', Name: "ADL2" },
    { Type: '24', Name: "ADL3" },
    { Type: '25', Name: "Status" },
    { Type: '26', Name: "AMC" },
    { Type: '27', Name: "Admin" },
    { Type: '28', Name: "All status" },
    { Type: '29', Name: "Asset Life" },
    { Type: '30', Name: "Asset Type" },
    { Type: '31', Name: "Attachment" },
    { Type: '32', Name: "Audit" },
    { Type: '33', Name: "Audit1" },
    { Type: '34', Name: "Admin2" },
    { Type: '35', Name: "AdL3" },
    { Type: '36', Name: "Category" },
    { Type: '38', Name: "Asset catergory" },
    { Type: '39', Name: "inventory cat" },
    { Type: '40', Name: "Authorization" },
    /*	{ Type: '6', Name: "PingFed" },*/
  ]
  StandardTypeData3:any[]=[];
  constructor(private fb: FormBuilder ,
    public dialog: MatDialog,
    public gs: GroupService,
    private storage: ManagerService,
    public as:AssetService,
    ) { }

  ngOnInit(): void {
    
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    this.dialogRoleForm = this.fb.group({
      Vname:['',Validators.required],
      roleCtrl: ['', [Validators.required]],
      categoryMultiCtrl: ['', [Validators.required]],
      plantMultiCtrl: ['', [Validators.required]],
      fieldMultiCtrl: ['', [Validators.required]],
      ViewName:[this.StandardTypeData1 ||'',[Validators.required]],
    
   });  
  
   this.GetStandardView();
   
   this.TablefilteredFieldMulti.next(this.TableTypeData.slice());
   this.FieldfilteredFieldMulti.next(this.fieldTypeData.slice());
   this.FieldfilteredFieldMulti.next(this.StandardTypeData.slice());

  }

  GetStandardView()
  { 
    debugger;
    this.as.Getallcategories(this.GroupId).subscribe(response => {
 console.log(response);
      this.StandardTypeData2 = JSON.parse(response);
      this.StandardTypeData2.forEach(r=>{
        if(r.Status=="S")
        {
          this.StandardTypeData1.push(r);
        }
        // if(r.Status == "C")
        // {
        //   this.StandardTypeData3.push(r);
        //   this.StandardTypeData3.forEach(result=>{
        //     this.StandardTypeData1.forEach(element=> {
        //     if(result.Custom2 == element.CategoryId)
        //     {
              
        //       debugger
        //       this.as.GetCustomView(element.CategoryId).subscribe(resp=>{
        //         this.count1 = 0;
        //         var data = JSON.parse(resp);
        //         this.count1 = parseInt(data.Custom3) + 0;
                
        //         this.countval = true

        //       })
        //     }
        //     else{
        //       this.count1 = 0;
        //       this.Countvalue= true;
        //     }
        //     })
        //   })
        // }
      })

     // this.filteredFieldMulti.next(this.StandardTypeData.slice());
      debugger;
    })
  }


  GetStandardAndCustomeView()
  { 
    debugger;
    this.as.GetCustomeView(this.GroupId,this.RegionId,this.CompanyId).subscribe(response => {
      this.StandardTypeData = JSON.parse(response);
      this.filteredFieldMulti.next(this.StandardTypeData.slice());
      debugger;
    })
  }
  
  GetCustomview()
  {
    // this.as.GetCustome(this.GroupId).subscribe(response=>{
    //   this.StandardTypeData = JSON.parse(response);
    // })
  }

  SelectCustomeView(event){
    debugger;
    
    // if(event.Custom1=="0")
    // {
    //   event.Custom1 = "1";
    this.as.Getallcategories(this.GroupId).subscribe(response => {

      this.StandardTypeData2 = JSON.parse(response);
      this.StandardTypeData2.forEach(r=>{
     if (r.Status=="C"&& r.Custom2 == (event.CategoryId).toString())
        {
          this.StandardTypeData.push(r);
        }
        else{
          // if()
          //   this.StandardTypeData=[];
           }

      })
      })
    // }

      // else{
      //   event.Custom1 = "0";
      //   this.StandardTypeData=[];
      // }
     
  }
  viewid;
  openstep(event){
    debugger;
    this.viewid= event;
  }
  editGridpop(event) {
    debugger;
    let title = 'Edit Grid Display';
    const dialogRef = this.dialog.open(FieldDialogPopupComponent, {
      width: '60vw',
      height: 'auto',
      data: { title: title, payload: event },
      
    })
    dialogRef.afterClosed().subscribe(result => {
      debugger;
      if (!!result) {
        console.log(result)
      //  this.ListOfField = result;
        //this.displayedColumns = this.ListOfField;
      //  this.displayedColumns = this.displayedColumns.filter(x => x.IsForDefault == true).map(choice => choice.FieldName);
      //  this.displayedColumns = ['Select', 'Icon', 'review'].concat(this.displayedColumns);
      }
    })
  }
  string1 ="custom"; 
  createduplicate(...event) {
    debugger;
    let title = 'Edit Grid Display';
    const dialogconfigcom1 = new MatDialogConfig();
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = '60vw';
    dialogconfigcom1.height = 'auto';
    dialogconfigcom1.data = {
      component1: 'assetClassComponent',
      value: event[0],
      payload: event
    };
    const dialogRef = this.dialog.open(CreateDuplicateDialogComponent,dialogconfigcom1)
    dialogRef.afterClosed().subscribe(result => {
      debugger;
      if (!!result) {
        console.log(result)
        this.GetStandardView();
        for (let i = 0; i < 17; i++) {
          this.panelOpenState[i]= false;
      console.log(this.panelOpenState[i]);
    }
    
      //  this.ListOfField = result;
        //this.displayedColumns = this.ListOfField;
      //  this.displayedColumns = this.displayedColumns.filter(x => x.IsForDefault == true).map(choice => choice.FieldName);
      //  this.displayedColumns = ['Select', 'Icon', 'review'].concat(this.displayedColumns);
      }
    })
    this.GetStandardView();
    this.GetCustomeViewCount();
  }
  step;
  setStep(index: number,data) {
    debugger;
    this.step = index;
    this.panelOpenState[index] = true;
    // for (let i = 0; i < 12; i++) {
    //   console.log(this.panelOpenState[i]);
    // }
    this.StandardTypeData=[];
     this.viewid= data.CategoryId;
     //this.GetCustomeViewCount();
     this.SelectCustomeView(data)
  }

  changeState(index: number) {
    debugger;
    this.panelOpenState[index] = false;
    this.StandardTypeData=[];
  }
 
  toggleCreateModules(index: number,module){
    if(!!module.OpenState){
      module.OpenState = !module.OpenState;
    }
    else{
      module.OpenState = true;
    }
  }
  editGridpop1(event) {
    debugger;
    let title = 'Edit Grid Display';
    const dialogRef = this.dialog.open(EditFieldComponent, {
      width: '60vw',
      height: 'auto',
      data: { title: title, payload: event }

    })
    dialogRef.afterClosed().subscribe(result => {
      debugger;
      if (!!result) {
        console.log(result)
      //  this.ListOfField = result;
        //this.displayedColumns = this.ListOfField;
      //  this.displayedColumns = this.displayedColumns.filter(x => x.IsForDefault == true).map(choice => choice.FieldName);
      //  this.displayedColumns = ['Select', 'Icon', 'review'].concat(this.displayedColumns);
      }
    })
  }
  ListOfField: any[] = [];
  VieweditGridpop(...event) {
    debugger;
    let title = 'Add Grid Display';
    const dialogconfigcom1 = new MatDialogConfig();
    dialogconfigcom1.autoFocus = true;
    dialogconfigcom1.width = '60vw';
    dialogconfigcom1.height = 'auto';
    dialogconfigcom1.data = {
      component1: 'assetClassComponent',
      value: event[0],
      payload: event
    };
    const dialogRef = this.dialog.open(ViewfieldComponent,dialogconfigcom1) 
  
    dialogRef.afterClosed().subscribe(result => {
      debugger;
      if (!!result) {
        console.log(result)
      //  this.ListOfField = result;
        //this.displayedColumns = this.ListOfField;
      //  this.displayedColumns = this.displayedColumns.filter(x => x.IsForDefault == true).map(choice => choice.FieldName);
      //  this.displayedColumns = ['Select', 'Icon', 'review'].concat(this.displayedColumns);
      }
    })
  }
  GetCustomeViewCount()
  {
    debugger;
    this.as.GetCustomView(this.viewid).subscribe(r=>{
      var data = JSON.parse(r);
      
      this.count = data + 1;
    })
  }
}
