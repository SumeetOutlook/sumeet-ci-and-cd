import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { take, takeUntil } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { editCurrencyDialogComponent } from './edit_currency_dialog/edit_currency_dialog.component';
import { LocalStoreService } from '../../../shared/services/local-store.service';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { Constants } from 'app/components/storage/constants';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/UserService';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import * as resource from '../../../../assets/Resource.json';
import * as header from '../../../../assets/Headers.json';
import * as menuheaders from '../../../../assets/MenuHeaders.json';
import {CompanyService} from '../../../components/services/CompanyService';
import { ToastrService } from 'ngx-toastr';

interface Currency {
  CompanyId: string;
  CompanyName: string;
}

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss'],
})
export class CurrencyComponent implements OnInit, AfterViewInit, OnDestroy {

  Headers: any ;
  message: any = (resource as any).default;
  protected currency1;
  public currencymappingCtrl: FormControl = new FormControl();
  public currencymappingFilterCtrl: FormControl = new FormControl();
  public SelectCurrency: ReplaySubject<Currency[]> = new ReplaySubject<Currency[]>(1);
  LoginUserInfo: any;
  public currencyCompany;
  menuheader :any =(menuheaders as any).default
  selectedCurrency = "ALL";
  public grpdata;
  selectedRow: boolean = false;
  AllCompany: boolean = false;
  setflag: boolean=false;
  CompanyId: any;
  GroupId: any;
  UserId: any;
  RegionId: any;
  displayedColumns: string[] = ['select', 'FromCurrency', 'ToCurrency', 'Rate', 'UpDatedOn' , 'ModifiedDate'];
  datasource: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('singleSelect') singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();
  constructor(private storage: ManagerService,
    public dialog: MatDialog, private fb: FormBuilder,
    public localService: LocalStoreService, private jwtAuth: JwtAuthService,
    private router: Router,
    public CompanyService:CompanyService,
    public alertService: MessageAlertService,
    public us: UserService,
    public toastr: ToastrService,) 
    {
      this.Headers = this.jwtAuth.getHeaders()
     }

  ngOnInit(): void {

    this.GroupId = Number(this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID));
    this.RegionId = Number(this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID));
    this.CompanyId = Number(this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID));
    this.UserId = Number(this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID));

    this.GetInitiatedData();
    this.OnGetCurrencyCompany();
    this.OnGetCurrencyConversionDataByGroupID();
    this.paginator._intl.itemsPerPageLabel = 'Records per page';

    this.currencymappingFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtercurrency();
      });

  }

  ListOfPagePermission: any[] = [];
  PermissionIdList :any[]=[];
  GetInitiatedData() {
    let url5 = this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.RegionId, "16");
    forkJoin([url5]).subscribe(results => {
      if (!!results[0]) {
                 
        this.ListOfPagePermission = JSON.parse(results[0]);
        console.log("PagePermission" , this.ListOfPagePermission)
        if(this.ListOfPagePermission.length > 0){
          for (var i = 0; i < this.ListOfPagePermission.length; i++) {
            this.PermissionIdList.push(this.ListOfPagePermission[i].ModulePermissionId);
          }
        }
        else {
          this.alertService.alert({ message: this.message.NotAuthorisedToAccess, title: this.message.AssetrakSays })
            .subscribe(res => {
              this.router.navigateByUrl('h/a')
            })
        } 
      }
      
    })
  }

  ngAfterViewInit() {
    // this.datasource.paginator = this.paginator;
    // this.datasource.sort = this.sort;
    this.setInitialValue();

  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  OnGetCurrencyCompany() {
     
    const UserId = this.UserId;
    const GroupId = this.GroupId;
    const Region = this.RegionId;
    const Company = this.CompanyId;

     
    this.CompanyService.GetCurrencyCompanyByGroup(GroupId,Region,Company, UserId)
      .subscribe(r => {
         
        this.currency1 = JSON.parse(r);
        this.SelectCurrency.next(this.currency1.slice());
      });
  }
  bindData :any[]=[];
  OnGetCurrencyConversionDataByGroupID() {
    this.AllCompany = false;   
     
    this.CompanyService.GetCurrencyConversionDataByGroupID(this.GroupId,this.RegionId,this.CompanyId, this.UserId)
      .subscribe(r => {
        debugger;
        this.bindData =[];
        var data = JSON.parse(r);
        data.forEach(element => {
          if(element.FromCurrency != element.ToCurrency){
            this.bindData.push(element);
          }
        });  
        this.datasource = new MatTableDataSource(this.bindData);
        this.datasource.paginator = this.paginator;
        this.datasource.sort = this.sort;
      });
  }

  OnGetCurrencyConversionByCompany(param) {
    const companyId = param;
    const GroupId = this.GroupId;
    this.AllCompany = true;
    //  
    this.CompanyService.GetCurrencyConversionDataByGroupIDCompanyID(GroupId, companyId)
      .subscribe(r => {
        //  
        this.bindData =[];
        var data = JSON.parse(r);
        data.forEach(element => {
          if(element.FromCurrency != element.ToCurrency){
            this.bindData.push(element);
          }
        });  
        this.datasource = new MatTableDataSource(this.bindData);
        this.datasource.paginator = this.paginator;
        this.datasource.sort = this.sort;
      });
  }

  protected setInitialValue() {
    this.SelectCurrency
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: Currency, b: Currency) => a && b && a.CompanyId === b.CompanyId;
      });
  }

  protected filtercurrency() {
    if (!this.currency1) {
      return;
    }
    let search = this.currencymappingFilterCtrl.value;
    if (!search) {
      this.SelectCurrency.next(this.currency1.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.SelectCurrency.next(
      this.currency1.filter(currency1 => currency1.CompanyName.toLowerCase().indexOf(search) > -1)
    );
  }


  public doFilter = (value: string) => {
    this.datasource.filter = value.trim().toLocaleLowerCase();
  }

  public editcurrency(data: any = {}) {
    // 
    let title = 'Edit Tag Detail';
    let dialogRef: MatDialogRef<any> = this.dialog.open(editCurrencyDialogComponent, {
      width: '60vw',
      height: 'auto',
   
      data: { title: title, payload: data }
    })
    dialogRef.afterClosed()
      .subscribe(res => {         
        if (!!res) {
          this.OnUpdateMapCurrencyConversion(res);
        }
      })
  }

  OnUpdateMapCurrencyConversion(res) {
     
    this.CompanyService.MapCurrencyConversion(res)
      .subscribe(r => {
          this.toastr.success(this.message.CurrencyMappingSuccess, this.message.AssetrakSays)
          this.OnGetCurrencyConversionDataByGroupID();
         
      });
  }
  callit(row) {
    //  
    this.selectedRow = true;

    localStorage.setItem(
      "selectedgrp",
      JSON.stringify({
        FromCurrency: row.FromCurrency,
        ToCurrency: row.ToCurrency,
        CompanyId: row.CompanyId,
        GroupId: row.GroupId,
        Rate: row.Rate,
        UpDatedOn: row.UpDatedOn,
        IsAllSelect: this.AllCompany
      })
    );
  }

  private isButtonVisible = false;
		ClearSerch(columnName, isflag) {
     
    this.isButtonVisible = !isflag;
    this.OnGetCurrencyConversionDataByGroupID();
  }
}
