import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReplaySubject, Subject,forkJoin } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MandatoryService } from 'app/components/services/MandatoryService';
import { MatSelectChange } from '@angular/material/select';
import * as header from '../../../../../assets/Headers.json';

@Component({
  selector: 'app-view-field-popup',
  templateUrl: './view-field-popup.component.html',
  styleUrls: ['./view-field-popup.component.scss']
})
export class ViewFieldPopupComponent implements OnInit {

  public ListOfField: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public TablefilteredFieldMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  Headers: any = (header as any).default;
  StandardTypeData: any[] = [
    { Type: '1', Name: "AssetInfoView" },
    { Type: '2', Name: "NetworkInfoView" },
    { Type: '3', Name: "AuditInfoView" },
    { Type: '4', Name: "HardwareInfoView" },
    { Type: '5', Name: "TransferInfoView" },
    { Type: '6', Name: "RetirementInfoView" },
    { Type: '7', Name: "Notification" },
    { Type: '8', Name: "Setting and Reports" },
    /*	{ Type: '6', Name: "PingFed" },*/
  ]
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
    { Type: '39', headerName: "inventory cat" },
    { Type: '40', headerName: "Authorization" },

    /*	{ Type: '6', Name: "PingFed" },*/
  ]
  constructor(public dialogRef: MatDialogRef<ViewFieldPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,public mandatoryservice: MandatoryService,) { }

  ngOnInit(): void {
    this.ListOfField.next(this.TypeData.slice());
    this.TablefilteredFieldMulti.next(this.StandardTypeData.slice());
  }
  checkboxclick(n) {
    n.IsForDefault = !n.IsForDefault;
    var index = this.checboxlist.indexOf(n.ID);
    if (index == -1) {
      this.checboxlist.push(n.ID);
      this.checboxIdlist.push(n);
    }
    else {
      this.checboxlist.splice(index, 1);
      this.checboxIdlist.splice(index, 1);
    }
  }
  save() {
    debugger;
    console.log(this.ListOfField)
   // this.ListOfField = this.ListOfField1;
    this.dialogRef.close(this.ListOfField);
  }
  selectedValue: any;
  compareValue: any;
  List: any[] = [];
  listOfMandetorydata: any = [];
  listofMandatory: any = [];
  checboxIdlist: any[] = [];
  pagenamelist: any[] = [];
  listofpagefiledmappingdata: any = [];
  listOfmappingField: any = [];
  checboxlist = [];
  
  getFields(event: MatSelectChange) {
    debugger;
    this.compareValue = this.selectedValue;
    this.List = [];
    this.mandatoryservice.MandatoryGetAllDataBYTableName(this.selectedValue).subscribe(r => {
      debugger;
      this.listOfMandetorydata = [];
      this.listOfMandetorydata = r;
      this.listOfMandetorydata.forEach(element => {
        if (element.Tables == this.compareValue && element.IsGivenForClient == true) {
          debugger;
          this.List.push(element);
          var idx1 = this.pagenamelist.indexOf(this.selectedValue);
          if (idx1 == -1) {
            var idx = this.listOfmappingField.indexOf(element.ID);
            if (idx > -1) {
              this.checboxlist.push(element.ID);
              this.checboxIdlist.push(element);
            }
          }
        }
      });
      this.pagenamelist.push(this.selectedValue);
    });

  }
  
}
