import { AfterViewInit, OnDestroy, Component, OnInit, Inject, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl,FormGroup,FormBuilder,Validators} from '@angular/forms';
import { JwtAuthService } from '../../../../shared/services/auth/jwt-auth.service';
import { ToastrService } from 'ngx-toastr';
import { AuditService } from '../../../services/AuditService';
import { AllPathService } from '../../../services/AllPathServices';
import { json } from 'ngx-custom-validators/src/app/json/validator';

@Component({
  selector: 'app-mapadditionalasset-dialog',
  templateUrl: './mapadditionalasset-dialog.component.html',
  styleUrls: ['./mapadditionalasset-dialog.component.scss']
})
export class MapadditionalassetDialogComponent implements OnInit {

  Headers: any ;
  message: any;

  public clicked = false;
  private isButtonVisible = false;
  public Edittempdatasource: any[] = [];
  public Editselecteddatasource: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MapadditionalassetDialogComponent>,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public AuditService: AuditService,
    public AllPath: AllPathService,
    public toastr: ToastrService ,private jwtAuth: JwtAuthService) { 
      this.Headers = this.jwtAuth.getHeaders();
	    this.message = this.jwtAuth.getResources();
    }

  public arrlength = 0;
  public newdataSource = [];
  public isallchk: boolean;
  public getselectedData: any[] = [];
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public AssetNo = new FormControl();
  displayedColumns: string[] = ['Inventory No.', 'Asset No.', 'Sub No.', 'Asset Class', 'Asset Name', 'Asset Description', 'Serial No', 'IT Serial No', 'Plant', 'Cost', 'WDV', 'Inventory Indicator', 'AssetCondition', 'AssetCriticality']

  displayedColumns1: string[] = ['FieldName', 'CapitalizedAssetValue', 'AdditionalAssets'];


  ELEMENT_DATA = [];
  ELEMENT_DATA1 = [];

  dataSource: any;
  dataSourceNew: any;
  CompanyId: any;
  dialogForm: FormGroup;
  hiderejectbtn:boolean =false;
  get f() { return this.dialogForm.controls; };
  ngOnInit() {
      debugger;
    this.dialogForm = this.fb.group({
      commentCtrl: ['', [Validators.required,this.noWhitespaceValidator]],
    })
    var list = [];
    this.CompanyId = this.data.configdata.CompanyId;
    this.data.configdata.ListOfMapField.forEach(element => {
      list.push(element);
    });
    list.push("Photo");
    this.ListOfMapField1 = list;
    this.getValuesToCompareForMapPrePrintedAdditionalAsset();

  }

  bindData: any[] = [];
  oldAsset: any[] = [];
  newAsset: any[] = [];
  ListOfMapField1: any[] = [];
  PageMandatoryFields: any[] = [];
  ErrorList: any[] = [];
  getValuesToCompareForMapPrePrintedAdditionalAsset() {

    var PrePrintid = this.data.configdata.PrePrintId;
    var prefarId = this.data.configdata.selected[0].PreFarId;
    this.PageMandatoryFields = this.data.configdata.ListofAdditinolMandatory;

    this.AuditService.getValuesToCompareForMapPrePrintedAdditionalAsset(PrePrintid, prefarId)
      .subscribe(r => {
        debugger;
        this.bindData = JSON.parse(r);
        this.oldAsset = this.bindData[1];

        // var AssetId = this.bindData[1].AssetId;
        // if (AssetId.startsWith('GRN')) {
        //   this.PageMandatoryFields = this.data.configdata.ListofAdditinolMandatory;
        // }
        // else if (AssetId.startsWith('NFAR')) {
        //   this.PageMandatoryFields = this.data.configdata.NONFARMandatory;
        // }
        // else {
        //   this.PageMandatoryFields = this.data.configdata.FARMandatory;
        // }

        this.newAsset = this.bindData[0];
        this.ErrorList = this.bindData[0].ErrorList.split(',');
        this.ErrorList = this.ErrorList.filter((c, index) => {
          return this.ErrorList.indexOf(c) === index;
        });
        var idx = this.ErrorList.indexOf("");
        if (idx > -1) {
          this.ErrorList.splice(idx, 1);
        }

        if(this.ErrorList.length == 0){
          this.showBtn = false;
        }
        this.onChangeDataSource([this.bindData[1]]);
        this.mapdata();
        //this.onChangeDataSourceNew([]) ;
      });
  }
  hideFields: any[] = ['AssetId', 'CategoryName', 'BlockOfAsset', 'ADL2', 'subTypeOfAsset', 'Location']
  datalist: any[] = [];
  btnDisabled: boolean = true;
  mapdata() {

    this.datalist = [];
    for (var i = 0; i < this.ListOfMapField1.length; i++) {

      var checked = 'AdditionalAssets';
      if (this.ListOfMapField1[i] != 'subTypeOfAsset') {
        var idx = this.hideFields.indexOf(this.ListOfMapField1[i]);
        if (idx > -1) {
          checked = 'CapitalizedAsset';
        }
      }
      var a = {
        FieldName: this.ListOfMapField1[i],
        CapitalizedAssetValue: this.oldAsset[this.ListOfMapField1[i]],
        AdditionalAssets: this.newAsset[this.ListOfMapField1[i]],
        checked: checked
      }
      this.datalist.push(a);
    }
    this.datalist.sort((a,b) => (a.checked > b.checked) ? -1 : ((b.checked > a.checked) ? 1 : 0));
    console.log(this.datalist);
    this.onChangeDataSourceNew(this.datalist);
  }
  
  showBtn : boolean = true;
  onItemChange(element, type) {
    debugger;
    this.showBtn = true;
    element.checked = type;
    if (element.FieldName == 'typeOfAsset') {
      this.datalist.forEach(val => {
        if (val.FieldName == 'subTypeOfAsset') {
          val.checked = type;
        }
      })
    }
    var list = [];
    this.datalist.forEach(val => {
      if (val.checked == 'CapitalizedAsset') {
        debugger;
        var idx = this.ErrorList.indexOf(val.FieldName);
        if (idx > -1) {
          list.push(val.FieldName);
        }
      }
    });
    debugger;
    if(list.length == this.ErrorList.length){
      this.showBtn = false;
    }
    
  }
  Checkvalidation() {

    this.btnDisabled = false;
    for (var i = 0; i < this.datalist.length; i++) {
      var idx = this.PageMandatoryFields.indexOf(this.datalist[i].FieldName);
      if (idx > -1) {

        if (this.datalist[i].checked == 'CapitalizedAsset' && !this.datalist[i].CapitalizedAssetValue) {
          this.btnDisabled = true;
        }
        if (this.datalist[i].checked == 'AdditionalAssets' && !this.datalist[i].AdditionalAssets) {
          this.btnDisabled = true;
        }
      }
    }
    // if(!!this.btnDisabled){
    //   this.toastr.warning(this.message.Mandatory, this.message.AssetrakSays);
    //   return false;
    // }
  }
  onclosetab() {
    this.dialogRef.close();
  }

  onChangeDataSource(value) {
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  onChangeDataSourceNew(value) {
    this.dataSourceNew = new MatTableDataSource(value);
    this.dataSourceNew.paginator = this.paginator;
    this.dataSourceNew.sort = this.sort;
  }

  ViewDocument(type, path) {
    var filename = path;
    if (type == 'Additional') {
      var pathName = this.CompanyId + "/PrePrintAdditional/" + path;
    }
    else {
      var pathName = this.CompanyId + "/Photo/" + path;
    }
    //var pathName = this.CompanyId + "/Photo/" + path; 
    if (filename == "") {
      this.toastr.warning(this.message.DocumentNotFound, this.message.AssetrakSays);
      return false;
    }
    this.AllPath.ViewDocument(pathName);
    return false;
  }

  onSubmit() {
      debugger;
    this.Checkvalidation();
    if (!!this.btnDisabled) {
      this.toastr.warning(this.message.Mandatory, this.message.AssetrakSays);
      return false;
    }
    var data = [];
    for (var i = 0; i < this.datalist.length; i++) {
      var a = {
        FieldName: this.datalist[i].FieldName,
        CheckeData: this.datalist[i].checked
      }
      data.push(a);
    }
    var result = {
      PrePrintId: this.data.configdata.PrePrintId,
      PreFarId: this.data.configdata.selected[0].PreFarId,
      CheckBoxChecked: '',
      UId: this.data.configdata.UserId,
      ModifiedAssetDtoList: data
    }
    this.dialogRef.close(result);
  }
Reject() {
  debugger;
  var prefarIds = [];
  var AssetsParameterDto = {
    PrefarIdlist: this.data.configdata.selected[0].PreFarId, //[Number(this.SelectedId)],
    RejectComment: this.dialogForm.value.commentCtrl,
    createdBy: this.data.configdata.UserId,
    CompanyId:this.CompanyId,
   }
   this.AuditService.UpdateRejectCommentOnPreprintAdditional(AssetsParameterDto)
   .subscribe(r => {
    var msg='';
    if(r == "success"){
      msg = "Information requested successfully.";
      this.toastr.success(msg, this.message.AssetrakSays);
      return null;
    } 
   });
}
public noWhitespaceValidator(control: FormControl) {
  const isWhitespace = (control.value || '').trim().length === 0;
  const isValid = !isWhitespace;
  return isValid ? null : { 'whitespace': true };
}
}
