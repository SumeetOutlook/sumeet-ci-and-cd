import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import * as headers from '../../../../../assets/Headers.json';
import { FieldfilterService } from 'app/components/services/FieldfilterService';
import { ToastrService } from 'ngx-toastr';
import * as resource from '../../../../../assets/Resource.json';
import * as header from '../../../../../assets/Headers.json';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';


@Component({
  selector: 'app-edit_tag_master',
  templateUrl: './edit_tag_master.component.html',
  styleUrls: ['./edit_tag_master.component.scss']
})
export class EditMasterDialogComponent implements OnInit {
  header: any ;
  message: any = (resource as any).default;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table', { static: true }) table: any;
  CompanyId : any;
  UserId :any;
  GroupId: any;
  RegionId: any;

  public checkboxlist: any[] = [
    { name: "Asset No", id: '1' },
    { name: "Asset Class", id: '2' },
    { name: "Asset Class(shortname)", id: '3' },
    { name: "Asset Name", id: '4' },
  ]


  ReadOnlyStyleGuideNotes: boolean;
  public updateTagMasterInfo: FormGroup;
  datasource: any = [];
  dataSourceLabel: any = [];
  taglist: any = [];
  PrintAssetId:any;
  PrintBlockOfAsset:any;
  PrintAssetDescription1:any;
  PrintAssetDescription2:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EditMasterDialogComponent>,
    private fb: FormBuilder, public fieldfilterservice: FieldfilterService,
    public toastr: ToastrService,private storage: ManagerService,private jwtAuth:JwtAuthService)
    {
       this.header = this.jwtAuth.getHeaders()
     }

  ngOnInit() {
    debugger;

    this.GroupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.RegionId = this.storage.get(Constants.SESSSION_STORAGE, Constants.REGION_ID);
    this.CompanyId = this.storage.get(Constants.SESSSION_STORAGE, Constants.COMPANY_ID);
    this.UserId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_ID);

    this.buildItemForm();
    this.ReadOnlyStyleGuideNotes = true;
    if (this.data.Barcode1D == true) {
      this.updateTagMasterInfo.controls["TagMaster"].setValue("1D");
    }
    else if (this.data.Barcode2D == true) {
      this.updateTagMasterInfo.controls["TagMaster"].setValue("2D");
    }
    else if (this.data.Barcode1D2D == true) {
      this.updateTagMasterInfo.controls["TagMaster"].setValue("1D2D");
    }
    this.PrintAssetId  = this.data.PrintAssetId ;
    this.PrintBlockOfAsset  = this.data.PrintBlockOfAsset ;
    this.PrintAssetDescription1  = this.data.PrintAssetDescription1 ;
    this.PrintAssetDescription2  = this.data.PrintAssetDescription2 ;

    this.changelabelsize();

    if (this.data.PrintAssetId == true) {
      this.labelchecked(1, true , 'PrintAssetId')
    }
    if (this.data.PrintBlockOfAsset == true) {
      this.labelchecked(2, true , 'PrintBlockOfAsset')
    }
    if (this.data.PrintAssetDescription1 == true) {
      this.labelchecked(3, true ,'PrintAssetDescription1')
    }
    if (this.data.PrintAssetDescription2 == true) {
      this.labelchecked(4, true ,'PrintAssetDescription2')
    }
  }
  public onclosetab() {
    this.dialogRef.close();
  }

  buildItemForm() {
    this.updateTagMasterInfo = this.fb.group({
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
  public save() {
    debugger;
    var Barcode = this.updateTagMasterInfo.value.TagMaster;
    var Header = this.updateTagMasterInfo.value.LabelHeader;
    var Footer = this.updateTagMasterInfo.value.LabelFooter;
    var LabelSize = this.updateTagMasterInfo.value.LabelSize;
    // var Assetno = this.updateTagMasterInfo.value.assetno;
    // var Assetclass = this.updateTagMasterInfo.value.assetclass;
    // var Assetclassshortname = this.updateTagMasterInfo.value.assetclassshortname;
    // var Assetname = this.updateTagMasterInfo.value.assetname;
    var PrintSetupList = {
      CompanyId: this.CompanyId,
      Header: Header,
      Footer: Footer,
      LabelSize: LabelSize,
      PrintAssetDescription: false,
      PrintAssetDescription1: this.PrintAssetDescription1,
      PrintAssetDescription2: this.PrintAssetDescription2,
      PrintAssetId: this.PrintAssetId,
      PrintBlockOfAsset: this.PrintBlockOfAsset,
      PrintMasterId: 0,
      PrintSubAssetId: false
    }
    this.fieldfilterservice.updatetagmasterdata(PrintSetupList).subscribe(r => {
      debugger;
      this.toastr.success( this.message.LabelheaderContentUpdate,this.message.AssetrakSays); 
      this.dialogRef.close(true);
    })
    
  }
 
  cancel() {
    this.dialogRef.close(false);
  }
  len: any;
  checkedCheckboxCount: any;
  lvlcnt: any;
  width: any;
  height: any;
  checked: boolean;
  selectedlabelsize: any;
  heightImg: any;
  widthImg: any;
  changelabelsize() {
    debugger;
    this.selectedlabelsize = [];
    this.selectedlabelsize = this.data.LabelSize;

    this.lvlchecked = [];
    this.width = "";
    this.height = "";
    this.checkboxlist.forEach(item => {
      item.checked = false;
    })
    if (this.selectedlabelsize == "35X15") {
      this.heightImg = "15mm";
      this.widthImg = "35mm";
      this.len = 15;
      this.lvlcnt = 1;
      this.checkedCheckboxCount = "For 35X15 label size, you can choose only one content lines";
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
    else if (this.selectedlabelsize == "L(50X75)") {
      this.heightImg = "75mm";
      this.widthImg = "50mm";

      this.len = 32;
      this.lvlcnt = 2;
      this.checkedCheckboxCount = "For large[L(50X75)] label size, you can choose only two content lines";
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
      this.checkedCheckboxCount = "For 25X25 label size, you can choose onlu one content lines";
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
      this.heightImg = "75mm";
      this.widthImg = "50mm";

      this.len = 30;
      this.lvlcnt = 2;
      this.checkedCheckboxCount = "For 75X50 label size, you can choose only two  content lines";
      this.width = 75;
      this.height = 50;
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
  }

  lvlchecked: any[] = [];
  cnt: any;
  disabled: boolean = false;


  labelchecked(a, state , name) {
    debugger;
    this.cnt = this.lvlchecked.length;
    !!state ? this.cnt++ : this.cnt--;

    var idx = this.lvlchecked.indexOf(a);
    if (idx > -1) {
      this.lvlchecked.splice(idx, 1);
      if(name == 'PrintAssetId'){ this.PrintAssetId = false ;}
      if(name == 'PrintBlockOfAsset'){this.PrintBlockOfAsset = false ;}
      if(name == 'PrintAssetDescription1'){this.PrintAssetDescription1 = false ;}
      if(name == 'PrintAssetDescription2'){this.PrintAssetDescription2 = false ;}
    }
    else {      
      this.lvlchecked.push(a);
      if(name == 'PrintAssetId'){ this.PrintAssetId = true ;}
      if(name == 'PrintBlockOfAsset'){this.PrintBlockOfAsset = true ;}
      if(name == 'PrintAssetDescription1'){this.PrintAssetDescription1 = true ;}
      if(name == 'PrintAssetDescription2'){this.PrintAssetDescription2 = true ;}
      if (parseInt(this.lvlcnt) >= parseInt(this.cnt)) {

      }
      else {
        var idx1 = this.lvlchecked.indexOf(a);
        if (idx1 > -1) {
          this.lvlchecked.splice(idx1, 1);
          this.exists(a);
        }
      }
    }   

  }
  exists(value) {    
    var k = this.lvlchecked.indexOf(value) > -1;
    return k;
  }
}
