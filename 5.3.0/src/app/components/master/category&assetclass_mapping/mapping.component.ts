import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/UserService';
import { ReplaySubject, Subject, Observable, forkJoin } from 'rxjs';
import * as resource from '../../../../assets/Resource.json';
import * as header from '../../../../assets/Headers.json';
import * as menuheaders from '../../../../assets/MenuHeaders.json';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { ToastrService } from 'ngx-toastr';
import { CompanyBlockService } from '../../../components/services/CompanyBlockService';

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss'],
})
export class CategoryAssetclassMapComponent implements OnInit, AfterViewInit, OnDestroy {

  Headers: any ;
  message: any = (resource as any).default;
  protected furniturecategory1;
  public furmappingCtrl: FormControl = new FormControl();
  public furmappingFilterCtrl: FormControl = new FormControl();
  public FurnitureCategory: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  CompanyId: any;
  GroupId: any;
  UserId: any;
  setflag: boolean=false;
  menuheader: any = (menuheaders as any).default
  RegionId: any;
  disablebtn: boolean = true;
  displayedColumns: string[] = ['assetclass', 'assetcount', 'category'];
  // dataSource = new MatTableDataSource(ELEMENT_DATA);
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('singleSelect') singleSelect: MatSelect;
  protected _onDestroy = new Subject<void>();
  constructor(public dialog: MatDialog, private fb: FormBuilder,
    private jwtAuth: JwtAuthService,
    private storage: ManagerService,
    private router: Router,
    public alertService: MessageAlertService,
    public us: UserService,
    public CompanyBlockService: CompanyBlockService,
    private loader: AppLoaderService,
    public toastr: ToastrService,) 
    {
      this.Headers = this.jwtAuth.getHeaders()
     }

  ngOnInit(): void {
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);

    this.OnGetAssetClassData();
    this.GetInitiatedData();
    this.furmappingFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterfurncategory();
      });
  }
  ListOfPagePermission: any[] = [];
  PermissionIdList: any[] = [];
  GetInitiatedData() {
    let url5 = this.us.PermissionRightsByUserIdAndPageId(this.GroupId, this.UserId, this.CompanyId, this.RegionId, "6");
    forkJoin([url5]).subscribe(results => {
      if (!!results[0]) {

        this.ListOfPagePermission = JSON.parse(results[0]);
        console.log("PagePermission", this.ListOfPagePermission)
        if (this.ListOfPagePermission.length > 0) {
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
    //this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  Arr = [];

  OnGetAssetClassData() {

    this.loader.open();
    this.dataSource = "";
    this.CompanyBlockService.GetAssetClassData(this.CompanyId)
      .subscribe(r => {
        this.loader.close();
        this.OnGetAssetCateotyData();
        const Data = JSON.parse(r);
        for (var i = 0; i < Data.length; i++) {
          if (!!Data[i].AssetCategoryId) {
            Data[i].disabled = true;
          }
          else {
            Data[i].disabled = false;
          }
        }
        this.dataSource = new MatTableDataSource(Data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.disablebtn = true;
      });
  }

  OnGetAssetCateotyData() {

    this.CompanyBlockService.GetAssetCateotyData(this.CompanyId)
      .subscribe(r => {

        this.furniturecategory1 = JSON.parse(r);
        this.FurnitureCategory.next(this.furniturecategory1.slice());
      });
  }


  OnUpdateCategoryData(type, element) {
    if(!!type){
      element.AssetCategoryId = type.AssetCategoryId;
      element.AssetCategoryName = type.AssetCategoryName;  //GroupId
      element.GroupId = type.GroupId;
      this.disablebtn = false;
      console.log(this.dataSource.data);
    }
    else{
      this.disablebtn = true;
    }    
  }

  Submit() {
    debugger;
    // this.loader.open();
    this.disablebtn = true;
    console.log(this.dataSource.data);
    var flag = false;
    for (var i = 0; i < this.dataSource.data.length; i++) {
      if (!this.dataSource.data[i].disabled && !!this.dataSource.data[i].AssetCategoryId) {
        flag = true;
        var assetsDetails = {
          CompanyId: this.CompanyId,
          GroupId: this.dataSource.data[i].GroupId,
          blockId: this.dataSource.data[i].Id,
          AssetCategoryId: this.dataSource.data[i].AssetCategoryId,
          CategoryName: this.dataSource.data[i].AssetCategoryName,
        };

        this.jwtAuth.UpdateAssetCategoryData(assetsDetails)
          .subscribe(r => {
            this.loader.close();

            this.OnGetAssetClassData();
          });
      }
      if (this.dataSource.data.length == (i + 1) && flag) {
        this.toastr.success(this.message.MappingSaveSucess, this.message.AssetrackSays);
      }
    }
    // this.loader.close();  
    // this.OnGetAssetClassData();

  }

  // protected setInitialValue() {
  //   this.FurnitureCategory
  //     .pipe(take(1), takeUntil(this._onDestroy))
  //     .subscribe(() => {
  //       this.singleSelect.compareWith = (a: Category1, b: Category1) => a && b && a.AssetCategoryId === b.AssetCategoryId;
  //     });
  // }

  protected filterfurncategory() {
    if (!this.furniturecategory1) {
      return;
    }
    let search = this.furmappingFilterCtrl.value;
    if (!search) {
      this.FurnitureCategory.next(this.furniturecategory1.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.FurnitureCategory.next(
      this.furniturecategory1.filter(furniturecategory => furniturecategory.AssetCategoryName.toLowerCase().indexOf(search) > -1)
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private isButtonVisible = false;
  ClearSerch(columnName, isflag) {

    this.isButtonVisible = !isflag;
    this.OnGetAssetClassData();
  }
}