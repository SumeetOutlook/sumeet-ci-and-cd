import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { FieldfilterService } from 'app/components/services/FieldfilterService';
import { ToastrService } from 'ngx-toastr';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';


@Component({
  selector: 'app-field_dialog',
  templateUrl: './field_dialog.component.html',
  styleUrls: ['./field_dialog.component.scss'],
})
export class DefaultFieldsComponent implements OnInit {
  Headers: any;
  message: any;
  optionValue: any;
  Relationship: boolean = false;
  ManageGroup: boolean = false;
  ApproveTaggingInformation: boolean = false;
  AdditionalAssets: boolean = false;
  InventoryStatus: boolean = false;
  MissingAssets: boolean = false;
  ViewModifiedAssets: boolean = false;
  Assignment: boolean = false;
  InitiateTransfer: boolean = false;
  TransferApproval: boolean = false;
  InitiateRetirement: boolean = false;
  RetirementApproval: boolean = false;
  AdditionalAssetsReconc: boolean = false;

  public pagename: any;

  selectedValue: any;
  compareValue: any;
  List: any[] = [];
  listofpagefiledmappingdata: any = [];
  listOfmappingField: any = [];
  checboxlist = [];
  listpagedata = [];



  constructor(public dialogRef: MatDialogRef<DefaultFieldsComponent>, public localService: LocalStoreService,
    public fieldfilterservice: FieldfilterService,
    public toastr: ToastrService,
    private jwtAuth: JwtAuthService) { 
      this.Headers = this.jwtAuth.getHeaders();
	    this.message = this.jwtAuth.getResources();
    }

  ngOnInit() {
    debugger;

    this.PageFieldMappingGetAllData();
    this.checboxlist = [];
    this.pagename = this.localService.getItem('selectedgrp');
  }

  onclosetab() {
    this.localService.clear();
    this.dialogRef.close();
  }

  getFields(event: MatSelectChange) {
    debugger;
    this.compareValue = this.selectedValue;
  }

  checkboxclick(FieldId) {
    debugger;
    var index = this.checboxlist.indexOf(FieldId);
    debugger;
    if (index == -1) {
      this.checboxlist.push(FieldId);
    }
    else {
      this.checboxlist.splice(index, 1);
    }
  }

  save() {
    debugger;
    this.pagename = this.localService.getItem('selectedgrp');
    const count = this.checboxlist.length;
    var fieldlist = this.checboxlist.join(',')
    if (count == 0) {
      this.toastr.success(this.message.FieldError, this.message.AssetrakSays);
    }
    else {
      var Pagedto =
      {
        IsforAdmin: true,
        PageId: this.pagename.Id,
        PageName: this.pagename.name,
        fieldlist: fieldlist,

      }
      this.fieldfilterservice.PageFieldMappingInsert(Pagedto).subscribe(result => {
        debugger;
        this.toastr.success(this.message.PageField, this.message.AssetrakSays);
      });
      this.dialogRef.close();
    }
  }
  PageFieldMappingGetAllData() {
    this.pagename = this.localService.getItem('selectedgrp');
    this.fieldfilterservice.PageFieldMappingGetAllData().subscribe(r => {
      this.listofpagefiledmappingdata = r;
      debugger;
      this.listofpagefiledmappingdata.forEach(element => {
        if (this.pagename.Id == element.PageId) {
          if (element.IsForDefault == true) {
            this.checboxlist.push(element.FieldId);
          }
          this.listOfmappingField.push(element);
        }

      });


    })
  }


}

