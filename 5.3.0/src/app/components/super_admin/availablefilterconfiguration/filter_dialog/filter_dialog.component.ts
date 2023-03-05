import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { FieldfilterService } from 'app/components/services/FieldfilterService';
import { MandatoryService } from 'app/components/services/MandatoryService';
import { ToastrService } from 'ngx-toastr';
import * as headers from '../../../../../assets/Headers.json';
import * as resource from '../../../../../assets/Resource.json';
import { IfStmt } from '@angular/compiler';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';




@Component({
  selector: 'app-filter_dialog',
  templateUrl: './filter_dialog.component.html',
  styleUrls: ['./filter_dialog.component.scss'],
})
export class Filter_DialogComponent implements OnInit {
  header: any ;
  message: any = (resource as any).default;
  optionValue: any;
  checboxlist = [];
  listOffiltermasterdata: any = [];
  List: any[] = [];
  listofpagefiltermappingdata: any = [];
  listOffiltermapping: any = [];
  public pagename: any;

  constructor(public dialogRef: MatDialogRef<Filter_DialogComponent>, public localService: LocalStoreService,
    public mandatoryservice: MandatoryService,
    public fieldfilterservice: FieldfilterService,
    public toastr: ToastrService,private jwtAuth:JwtAuthService)
    {
       this.header = this.jwtAuth.getHeaders()

       
     }


  ngOnInit() {
    this.MandatoryGetAllData()
    this.checboxlist = [];
  }
  checkboxclick(ID) {
    debugger;
    var index = this.checboxlist.indexOf(ID);
    if (index == -1) {
      this.checboxlist.push(ID);
    }
    else {
      this.checboxlist.splice(index, 1);
    }
  }
  MandatoryGetAllData() {
    debugger;
    this.mandatoryservice.MandatoryGetAllData().subscribe(r => {
      debugger;
      this.PageFilterMappingGetdata(r);
    });
  }
  onclosetab() {
    this.dialogRef.close();
  }
  save() {
    debugger;
    this.pagename = this.localService.getItem('selectedgrp');
    const count = this.checboxlist.length;
    var Filterlist = this.checboxlist.join(',')
    if (count == 0) {
      this.toastr.success(this.message.FilterError, this.message.AssetrakSays);
    }
    else {
      var Pagedto =
      {
        IsforAdmin: false,
        PageId: this.pagename.Id,
        PageName: this.pagename.name,
        Filterlist: Filterlist
      }
      this.fieldfilterservice.PageFilterMappingInsert(Pagedto).subscribe(result => {
        debugger;
        this.toastr.success(this.message.PageFilter, this.message.AssetrakSays);
      });
      this.dialogRef.close();
    }
  }
  PageFilterMappingGetdata(result) {
    debugger;
    this.checboxlist = [];
    this.pagename = this.localService.getItem('selectedgrp');
    this.fieldfilterservice.GetAllDataPagefiltermappingByModuleID(this.pagename.Id).subscribe(r => {
      debugger;
      this.listofpagefiltermappingdata = r;
      this.listofpagefiltermappingdata.forEach(element => {
        if (this.pagename.Id == element.PageId) {
          this.listOffiltermapping.push(element.FilterId);
        }
      });
      this.listOffiltermasterdata = result;
      this.List = [];
      this.listOffiltermasterdata.forEach(element => {
        if (element.IsGivenForClient == true) {
          debugger;
          var index = this.listOffiltermapping.indexOf(element.ID);
          if (index > -1) {
            this.checboxlist.push(element.ID);
          }
          this.List.push(element);
        }
      });
    });
  }
}

