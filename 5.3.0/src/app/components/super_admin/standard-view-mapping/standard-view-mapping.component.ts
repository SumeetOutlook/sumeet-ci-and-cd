import { Component, OnInit,Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReplaySubject, Subject,forkJoin } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog, MatDialogConfig, } from '@angular/material/dialog';
import { GetFieldsComponent } from 'app/components/partialView/get-fields/get-fields.component';
import { GroupService } from 'app/components/services/GroupService';
import { FieldDialogPopupComponent } from './field-dialog-popup/field-dialog-popup.component';
import { AssetService } from 'app/components/services/AssetService';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';

@Component({
  selector: 'standard-view-mapping',
  templateUrl: './standard-view-mapping.component.html',
  styleUrls: ['./standard-view-mapping.component.scss']
})
export class ViewFieldComponent implements OnInit {

  dialogRoleForm: FormGroup;
  ModifiedList: any;
  isActive :boolean =false;
  groupId: any;
  ApproveMandatoryField: any[] = [];
  displayedColumns: any[] = ['select'];
  public fieldMultiCtrl: FormControl = new FormControl();
  panelOpenState = new Array<boolean>();
//  public fieldMultiFilterCtrl: FormControl = new FormControl();
 public filteredFieldMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
 public TablefilteredFieldMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
 public FieldfilteredFieldMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
//  get f1() { return this.dialogRoleForm.controls; };
  
  StandardTypeData: any[] = [
    // { Type: '1', sName: "AssetInfoView" },
    // { Type: '2', sName: "NetworkInfoView" },
    // { Type: '3', sName: "AuditInfoView" },
    // { Type: '4', sName: "HardwareInfoView" },
    // { Type: '5', sName: "TransferInfoView" },
    // { Type: '6', sName: "RetirementInfoView" },
    // { Type: '7', sName: "Notification" },
    // { Type: '8', sName: "Reports" },
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
    { Type: '15', Name: "Cost" },
    /*	{ Type: '6', Name: "PingFed" },*/
  ]
  constructor(private fb: FormBuilder ,
    public dialog: MatDialog,
    public gs: GroupService,
    public as:AssetService,
    private storage: ManagerService,) { }

  ngOnInit(): void {
    debugger;
    this.groupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.isActive = !this.isActive;
    this.dialogRoleForm = this.fb.group({
      roleCtrl: ['', [Validators.required]],
      categoryMultiCtrl: ['', [Validators.required]],
      plantMultiCtrl: ['', [Validators.required]],
      fieldMultiCtrl: ['', [Validators.required]],
    
   });  
   this.GetStandardView();
  
   
   this.TablefilteredFieldMulti.next(this.TableTypeData.slice());
   this.FieldfilteredFieldMulti.next(this.fieldTypeData.slice());
  }
  StandardTypeData1:any[]=[]
  GetStandardView()
  { 
    debugger;

    this.as.Getallcategories(this.groupId).subscribe(response => {
      this.StandardTypeData1 = JSON.parse(response);
      //sthis.StandardTypeData1 = response;
      this.StandardTypeData1.forEach(r=>{
        if(r.Status=="S")
        {
          this.StandardTypeData.push(r);
        }
        
      })
      this.filteredFieldMulti.next(this.StandardTypeData.slice());
      debugger;
    })
  }
  ListOfField: any[] = [];
  editGridpop(...event) {
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
    const dialogRef = this.dialog.open(FieldDialogPopupComponent,dialogconfigcom1) 
  
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
  step;
  setStep(index: number) {
    this.step = index;
    this.panelOpenState[index] = true;
    for (let i = 0; i < 12; i++) {
      console.log(this.panelOpenState[i]);
    }
  }
  changeState(index: number) {
    debugger;
    this.panelOpenState[index] = false;
  }
}
