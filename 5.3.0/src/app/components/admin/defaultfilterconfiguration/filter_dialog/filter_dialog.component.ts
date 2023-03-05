import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { FieldfilterService } from 'app/components/services/FieldfilterService';
import { ToastrService } from 'ngx-toastr';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';


@Component({
  selector: 'app-filter_dialog',
  templateUrl: './filter_dialog.component.html',
  styleUrls: ['./filter_dialog.component.scss'],
})
export class FilterDefault_DialogComponent implements OnInit {
  checkedItems = [];
  checkedCount = 0;
  header: any ;
  message: any ;
  optionValue: any;
  checboxlist = [];
  checboxlist1 = [];
  listOffiltermasterdata: any = [];
  List: any[] = [];
  public pagename: any;
  listofpagefiltermappingdata: any = [];
  listOffiltermapping: any = [];

  constructor(public dialogRef: MatDialogRef<FilterDefault_DialogComponent>,
    public fieldfilterservice: FieldfilterService,
    public localService: LocalStoreService,
    public toastr: ToastrService,
    private jwtAuth: JwtAuthService
    ) { 
      this.header = this.jwtAuth.getHeaders();
	    this.message = this.jwtAuth.getResources();
    }



  ngOnInit() {
    this.PageFilterMappingGetdata();
    this.checboxlist = [];
  }
  onclosetab() {
    this.dialogRef.close();
  }
  checkboxclick(FilterId) {
    debugger;
    var index = this.checboxlist.indexOf(FilterId);
    if (index == -1) {
      this.checboxlist.push(FilterId);
    }
    else {
      this.checboxlist.splice(index, 1);
    }
  }

  PageFilterMappingGetdata() {
    debugger;
    this.List = [];
    this.pagename = this.localService.getItem('selectedgrp');
    this.fieldfilterservice.PageFilterMappingGetdata().subscribe(r => {
      debugger;
      this.listofpagefiltermappingdata = r;
      this.listofpagefiltermappingdata.forEach(element => {
        debugger;
        if (this.pagename.Id == element.PageId) {
          debugger;
          if (element.IsForDefault == null) {
            element.IsForDefault = false;
          }
          else if (element.IsForDefault == true) {
            this.checboxlist.push(element.FilterId);
          }
          this.listOffiltermapping.push(element);
        }
      });
    });
  }
  save() {
    debugger;
    this.pagename = this.localService.getItem('selectedgrp');
    const count = this.checboxlist.length;
    var Filterlist = this.checboxlist.join(',');
    if (count == 0) {
      this.toastr.success(this.message.FilterError, this.message.AssetrakSays);
    }
    else {
      var Pagedto =
      {
        IsforAdmin: true,
        PageId: this.pagename.Id,
        PageName: this.pagename.name,
        Filterlist: Filterlist,

      }
      this.fieldfilterservice.PageFilterMappingInsert(Pagedto).subscribe(result => {
        debugger;
        this.toastr.success(this.message.PageFilter, this.message.AssetrakSays);
      });
      this.dialogRef.close();
    }
  }
}

