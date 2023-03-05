import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LocalStoreService } from 'app/shared/services/local-store.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MatSnackBarVerticalPosition,
  MatSnackBarHorizontalPosition,
  MatSnackBar,
  MatSnackBarConfig
} from "@angular/material/snack-bar";
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import moment, { now } from "moment";
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { Constants } from 'app/components/storage/constants';
import { DecimalPipe, formatNumber } from '@angular/common';
import * as headers from '../../../../../assets/Headers.json';


@Component({
  selector: 'app-edit_currency_dialog',
  templateUrl: './edit_currency_dialog.component.html',
  styleUrls: ['./edit_currency_dialog.component.scss']
})
export class editCurrencyDialogComponent implements OnInit {

  header: any ;
  public currencyinfo: any;
  public currencyinfodata: any;
  dialogform: FormGroup;
  CompanyId: any;
  GroupId: any;
  UserId: any;
  RegionId: any;
  today = new Date();

  constructor(public dialogRef: MatDialogRef<editCurrencyDialogComponent>,
    public localService: LocalStoreService, private fb: FormBuilder,
    public dialog: MatDialog, private jwtAuth: JwtAuthService,
    private storage: ManagerService, public snackBar: MatSnackBar, private router: Router,
    private _decimalPipe: DecimalPipe) 
    {
      this.header = this.jwtAuth.getHeaders()
     }

  ngOnInit() {
    debugger;
    this.currencyinfo = this.localService.getItem('selectedgrp');
    // this.currencyinfo =JSON.parse(localStorage.getItem("selectedgrp"));
    // this.currencyinfodata=this.currencyinfo.ConversionRate;
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID),
      this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID),
      this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID),
      this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID),

      this.dialogform = this.fb.group(
        {
          FromCurrency : ["", [Validators.required ]],
          ToCurrency : ["", [Validators.required]],
          conversionrate: ["", [Validators.required]],
          upadateddate: ["", [Validators.required]],
          agreed: [false, ]
        }
      );
    debugger;
    //var decimal_formatted =  parseFloat(this.currencyinfo.Rate).toFixed(7);
    var decimal_formatted = this._decimalPipe.transform(this.currencyinfo.Rate, "1.1-7")
    this.dialogform.controls['conversionrate'].setValue(decimal_formatted);
    this.dialogform.controls['upadateddate'].setValue(this.currencyinfo.UpDatedOn);
    this.dialogform.controls['FromCurrency'].setValue(this.currencyinfo.FromCurrency);
    this.dialogform.controls['FromCurrency'].disable();
    this.dialogform.controls['ToCurrency'].setValue(this.currencyinfo.ToCurrency);
    this.dialogform.controls['ToCurrency'].disable();

  }

  onclosetab() {
    this.dialogRef.close(false);
  }

  save() {
    debugger
    if (!this.dialogform.invalid) {
      const dialogformdata = this.dialogform.value;
      const CurrencyConversionList1 = {
        Rate: dialogformdata.conversionrate,
        UpDatedOn: moment(dialogformdata.upadateddate).format("YYYY/MM/DD").toString(),
        FromCurrency: this.currencyinfo.FromCurrency,
        ToCurrency: this.currencyinfo.ToCurrency,
        CompanyId: this.currencyinfo.CompanyId,
        GroupId: this.currencyinfo.GroupId,
        UpDateBy: this.UserId,
      };

      if (this.dialogform.value != null) {
        const CurrencyData = CurrencyConversionList1;
        this.dialogRef.close(CurrencyData);
      }
    }
  }
}
