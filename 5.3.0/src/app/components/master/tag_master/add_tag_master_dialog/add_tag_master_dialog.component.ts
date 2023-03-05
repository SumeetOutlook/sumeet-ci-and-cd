import { Component, OnInit, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { MatPaginator } from '@angular/material/paginator';
import * as headers from '../../../../../assets/Headers.json';
import * as resource from '../../../../../assets/Resource.json';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { FieldfilterService } from 'app/components/services/FieldfilterService';
import { ToastrService } from 'ngx-toastr';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { AppLoaderService } from '../../../../shared/services/app-loader/app-loader.service';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';


interface SelectData {
  name: string;
  id: string;
}

@Component({
  selector: 'app-add_tag_master_dialog',
  templateUrl: './add_tag_master_dialog.component.html',
  styleUrls: ['./add_tag_master_dialog.component.scss']
})
export class TagMasterDialogComponent implements OnInit {
  header: any;
  message: any = (resource as any).default;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table', { static: true }) table: any;

  CompanyId : any;
  UserId :any;
  GroupId: any;
  RegionId: any;
  datasource: any = [];
  taglist: any = [];

  public TagMaster: string;
  public LabelSize: string;
  public LabelHeader: string;
  public LabelFooter: string;
  public adduserDetl = {
    tagmaster: '',
    labelsize: '',
    labelheader: '',
    labelfooter: ''
  }
  public TagMasterData: SelectData[] = [
    { name: '1D', id: '1' },
    { name: '2D', id: '2' },
    // { name: '1D_2D', id: '3' },
  ];
  public LabelSizeData: SelectData[] = [
    { name: "35X15", id: '1' },
    { name: "XS(40X15)", id: '2' },
    { name: "S(50X25)", id: '3' },
    { name: "M(50X35)", id: '4' },
    { name: "L(75X50)", id: '5' },
    { name: "XL(100X60)", id: '6' },
    { name: "75X45", id: '7' },
    { name: "25X25", id: '8' },
    { name: "60X40", id: '9' },
    { name: "70X50", id: '10' }
  ];
  public checkboxlist: any[] = [
    { name: "Asset No", id: '1' },
    { name: "Asset Class", id: '2' },
    { name: "Asset Class(shortname)", id: '3' },
    { name: "Asset Name", id: '4' },
  ]

  public AssetSubTypeData: SelectData[] = [];
  public TagMasterInfo: FormGroup;
  public LicenceContentInfo: FormGroup;

  public DocumentType = "Select Document Type";
  public OperatingSystem = "Select Operating System";
  public CPUClass = "Select CPU Class";
  public CPUSubClass = "Select CPU SubClass";
  public ApplicationType = "Select Application Type";
  public Model = "Select Model";
  public Manufacturer = "Select Manufacturer";
  public filteredTagMaster: ReplaySubject<SelectData[]> = new ReplaySubject<SelectData[]>(1);
  public filteredLabelSize: ReplaySubject<SelectData[]> = new ReplaySubject<SelectData[]>(1);


  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  protected _onDestroy = new Subject<void>();
  public selectedIndex;
  len: any;
  checkedCheckboxCount: any;
  lvlcnt: any;
  width: any;
  height: any;
  checked: boolean;
  selectedlabelsize: any;
  showQRcodeimage:boolean=false;
  showBarcodeimage:boolean=false;
  Tagmastersave:boolean=true;
  LlSize:any[]=[];
  temllvlsize:any[]=[];
  all:any[]=[];
  constructor(
    public dialogRef: MatDialogRef<TagMasterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public localService: LocalStoreService, public fieldfilterservice: FieldfilterService,
    private fb: FormBuilder, public toastr: ToastrService,
    private storage: ManagerService,
    private loader: AppLoaderService,private jwtAuth:JwtAuthService) 
    {
      this.header = this.jwtAuth.getHeaders()
     }

  nextStep(i) {
    this.selectedIndex = i;
    var Barcode = this.TagMasterInfo.value.TagMaster;
    if (Barcode.name === '2D' ||  Barcode.name === '1D_2D')
    {
      this.showQRcodeimage= true 
    }
    else
    {
      this.showQRcodeimage= false
    }
    if (Barcode.name === '1D' )
    {
      this.showBarcodeimage= true 
    }
    else
    {
      this.showBarcodeimage= false
    }

  }
  previousStep(i) {
    this.selectedIndex = i;
    console.log(i);
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.nextStep(tabChangeEvent.index);
    this.previousStep(tabChangeEvent.index);
    console.log(tabChangeEvent);
  }
  ngOnInit() {
    this.loader.open();
    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);
    this.buildItemForm();

    this.filteredTagMaster.next(this.TagMasterData.slice());
    this.TagMasterInfo.controls['TagMasterFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterTagMaster();
      });
      
      this.temllvlsize=this.data;
    this.LlSize = [];
          for (var i = 0; i < this.LabelSizeData.length; i++) {
              var idx = this.temllvlsize.indexOf(this.LabelSizeData[i].name);
              if (idx > -1) {
                 
              }
              else {
                  this.LlSize.push(this.LabelSizeData[i]);
              }
          }
    this.filteredLabelSize.next(this.LlSize.slice());
    this.TagMasterInfo.controls['LabelSizeFilter'].valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterLabelSize();
      });
      this.loader.close();
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  buildItemForm() {
    this.TagMasterInfo = this.fb.group({
      TagMaster: [''],
      TagMasterFilter: [''],
      LabelSize: [''],
      LabelSizeFilter: [''],
      LabelHeader: [''],
      LabelFooter: ['']
    })
    this.LicenceContentInfo = this.fb.group({
      TagMaster: [''],
      TagMasterFilter: [''],
      LabelSize: [''],
      LabelSizeFilter: [''],
      LabelHeader: [''],
      LabelFooter: [''],
      assetno: false,
      assetclass: false,
      assetclassshortname: false,
      assetname: false,
    })
  }

  protected setInitialValue() {
    
    this.TagMasterInfo.controls['TagMasterFilter'].value
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: SelectData, b: SelectData) => a && b && a.id === b.id;
      });

    this.TagMasterInfo.controls['LabelSizeFilter'].value
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: SelectData, b: SelectData) => a && b && a.id === b.id;
      });
  }

  protected filterTagMaster() {
    
    if (!this.TagMasterData) {
      return;
    }

    let search = this.TagMasterInfo.controls['TagMasterFilter'].value;
    if (!search) {
      this.filteredTagMaster.next(this.TagMasterData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredTagMaster.next(
      this.TagMasterData.filter(data => data.name.toLowerCase().indexOf(search) > -1)
    );
    console.log(this.filteredTagMaster);
  }

  protected filterLabelSize() {
    
    if (!this.LabelSizeData) {
      return;
    }

    let search = this.TagMasterInfo.controls['LabelSizeFilter'].value;
    if (!search) {
      this.filteredLabelSize.next(this.LabelSizeData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredLabelSize.next(
      this.LabelSizeData.filter(data1 => data1.name.toLowerCase().indexOf(search) > -1)
    );
    console.log(this.filteredLabelSize);
  }

  onclosetab() {
    this.dialogRef.close(false);
  }
  heightImg :any;
  widthImg : any;
  


  changelabelsize(event) {

    this.selectedlabelsize = [];
    this.selectedlabelsize = event.value.name;
    this.Tagmastersave=true;
    this.lvlchecked = [];
    this.labelshow =[];
    this.width = "";
    this.height = "";
    this.checkboxlist.forEach(item => {
      item.checked =false;
    })
    if (this.selectedlabelsize == "35X15") {  
      this.heightImg = "15mm";
      this.widthImg = "35mm";    
      this.len = 15;
      this.lvlcnt = 1;
      this.checkedCheckboxCount = "For 35X15 label size, you can choose only one content line";
      this.width = 35;
      this.height = 15;
    }
    else if (this.selectedlabelsize == "XS(40X15)") {  
      this.heightImg = "15mm";
      this.widthImg = "40mm";     
      this.len = 29;
      this.lvlcnt = 1;
      this.checkedCheckboxCount = "For extra small[XS(40X15)] label size, you can choose only one content line";
      this.width = 40;
      this.height = 15;
    }
    else if (this.selectedlabelsize == "S(50X25)") {
      this.heightImg = "25mm";
      this.widthImg = "50mm";    

      this.len = 32;
      this.lvlcnt = 1;
      this.checkedCheckboxCount = "For small[S(50X25)] label size, you can choose only one content line";
      this.width = 50;
      this.height = 25;
    }
    else if (this.selectedlabelsize == "M(50X35)") {
      
      this.heightImg = "35mm";
      this.widthImg = "50mm";
      this.len = 32;
      this.lvlcnt = 2;
      this.checkedCheckboxCount = "For medium[M(50X35)] label size, you can choose only two content lines";
      this.width = 50;
      this.height = 25;
    }
    else if (this.selectedlabelsize == "L(75X50)") {
      this.heightImg = "50mm";
      this.widthImg = "75mm";

      this.len = 32;
      this.lvlcnt = 2;
      this.checkedCheckboxCount = "For large[L(75X50)] label size, you can choose only two content lines";
      this.width = 50;
      this.height = 75;
    }
    else if (this.selectedlabelsize == "XL(100X60)") {
      
      this.heightImg = "60mm";
      this.widthImg = "100mm";

      this.len = 33;
      this.lvlcnt = 3;
      this.checkedCheckboxCount = "For extra large[XL(100X60)] label size, you can choose only three content lines";
      this.width = 100;
      this.height = 60;
    }
    else if (this.selectedlabelsize == "75X45") {
      this.heightImg = "45mm";
      this.widthImg = "75mm";

      this.len = 32;
      this.lvlcnt = 2;
      this.checkedCheckboxCount = "For 75X45 label size, you can choose only two content lines";
      this.width = 75;
      this.height = 45;
    }
    else if (this.selectedlabelsize == "25X25") {
      this.heightImg = "25mm";
      this.widthImg = "25mm";

      this.len = 30;
      this.lvlcnt = 1;
      this.checkedCheckboxCount = "For 25X25 label size, you can choose only one content lines";
      this.width = 25;
      this.height = 25;
    }
    else if (this.selectedlabelsize == "60X40") {
      
      this.heightImg = "40mm";
      this.widthImg = "60mm";
      this.len = 30;
      this.lvlcnt = 2;
      this.checkedCheckboxCount = "For 60X40 label size, you can choose only two content lines";
      this.width = 60;
      this.height = 40;
    }
    else if (this.selectedlabelsize == "70X50") {
      this.heightImg = "50mm";
      this.widthImg = "70mm";

      this.len = 30;
      this.lvlcnt = 2;
      this.checkedCheckboxCount = "For 70X50 label size, you can choose only two content lines";
      this.width = 75;
      this.height = 50;
    }
  }  
  lvlchecked: any[] = [];
  labelshow: any[] = [];
  cnt: any;
  disabled: boolean = true;
  labelchecked(a, state, m) {   
    
    this.cnt = this.lvlchecked.length;
    !!state ? this.cnt++ : this.cnt--;

    var idx = this.lvlchecked.indexOf(a);
    if (idx > -1) {
      this.lvlchecked.splice(idx, 1);
      m.checked = false;
      if(this.lvlcnt == this.lvlchecked.length || this.lvlchecked.length > 0){
        this.Tagmastersave=false;
      }
      else{
        this.Tagmastersave=true;
      }
      // this.Tagmastersave=true;
    }
    else {
      // if (this.lvlcnt > this.cnt) {
      //   this.lvlchecked.push(a);
      //   this.lvlchecked.length;
      // }
      // else {
      //   this.toastr.warning(" u have only " + this.cnt + "count ");
      // }
      this.lvlchecked.push(a);
      m.checked = true;
    
      if (parseInt(this.lvlcnt) >= parseInt(this.cnt)) {
        if(this.lvlcnt == this.lvlchecked.length || this.lvlchecked.length > 0)
        {
          this.Tagmastersave=false;
        }
        else{
          this.Tagmastersave=true;
        }
       
      }
      else {
          var idx1 = this.lvlchecked.indexOf(a);
          if (idx1 > -1) {
              this.lvlchecked.splice(idx1, 1);
              this.exists(a);
          }
      }
    }
    var idx = this.labelshow.indexOf(m.name);
    if (idx > -1) {
      this.labelshow.splice(idx, 1);
      if(m.name == "Asset No")
      {
        this.LicenceContentInfo.value.assetno = false;
      }
      else if(m.name == "Asset Class" )
      {
        this.LicenceContentInfo.value.assetclass = false;
      }
      else if(m.name == "Asset Class(shortname)" )
      {
        this.LicenceContentInfo.value.assetclassshortname =false;
      }
      else if(m.name == "Asset Name")
      {
        this.LicenceContentInfo.value.assetname = false;
      }
    }
    else {
      this.labelshow.push(m.name);
      if(m.name == "Asset No")
      {
        this.LicenceContentInfo.value.assetno = true;
      }
      else if(m.name == "Asset Class")
      {
        this.LicenceContentInfo.value.assetclass = true;
      }
      else if(m.name == "Asset Class(shortname)")
      {
        this.LicenceContentInfo.value.assetclassshortname = true;
      }
      else if(m.name == "Asset Name")
      {
        this.LicenceContentInfo.value.assetname = true;
      }
       
        // assetclass: false,
        // assetclassshortname: false,
        // assetname: false,
      
    //   { name: "Asset No", id: '1' },
    // { name: "Asset Class", id: '2' },
    // { name: "Asset Class(shortname)", id: '3' },
    // { name: "Asset Name", id: '4' },
    //   var variable = this.labelshow;
    }
  }
  exists(value) {
    var k = this.lvlchecked.indexOf(value) > -1;
    return k;
  }
  save() {  

    var companyId = this.CompanyId;
    var UserId = this.UserId;
    var Barcode1D = false, Barcode2D = false, Barcode1D2D = false;
    var Barcode = this.TagMasterInfo.value.TagMaster;
    if (Barcode.name == '1D') {
      Barcode1D = true;
    }
    else if (Barcode.name == '2D') {
      Barcode2D = true;
    }
    else if (Barcode.name == '1D2D') {
      Barcode1D2D = true;
    }
    var Header = this.TagMasterInfo.value.LabelHeader;
    var Footer = this.TagMasterInfo.value.LabelFooter;
    var LabelSize = this.TagMasterInfo.value.LabelSize.name;
    var Assetno = this.LicenceContentInfo.value.assetno;
    var Assetclass = this.LicenceContentInfo.value.assetclass;
    var Assetclassshortname = this.LicenceContentInfo.value.assetclassshortname;
    var Assetname = this.LicenceContentInfo.value.assetname;
    var PrintSetupList = {

      Barcode1D: Barcode1D,
      Barcode1D2D: Barcode1D2D,
      Barcode2D: Barcode2D,
      CompanyId: companyId,
      Header: Header,
      Footer: Footer,
      LabelSize: LabelSize,
      PrintAssetDescription: false,
      PrintAssetDescription1: Assetclassshortname,
      PrintAssetDescription2: Assetname,
      PrintAssetId: Assetno,
      PrintBlockOfAsset: Assetclass,
      PrintMasterId: 0,
      PrintSubAssetId: false,
      userId: UserId
    };
    this.fieldfilterservice.ADDtagmasterdata(PrintSetupList).subscribe(r => {
      
      this.localService.setItem('addgrpdata', this.adduserDetl);
      this.dialogRef.close(r);
    })
    
  }
}

