import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MandatoryService } from 'app/components/services/MandatoryService';
import { GroupService } from 'app/components/services/GroupService';
import { ToastrService } from 'ngx-toastr';
import { AppLoaderService } from '../../../shared/services/app-loader/app-loader.service';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { MessageAlertService } from '../../../shared/services/app-msg-alert/app-msg.service';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtAuthService } from '../../../shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-mandatory-nonmandatory',
  templateUrl: './mandatory-nonmandatory.component.html',
  styleUrls: ['./mandatory-nonmandatory.component.scss'],
  //encapsulation:ViewEncapsulation.None,
})
export class MandatoryNonmandatoryComponent implements OnInit {

  header: any = [];
  message: any = [];
  prefarDataSource: any = [];
  transferDataSource: any = [];
  companylocationmasterDataSource: any = [];
  prepurchaseditassetsDataSource: any = [];
  currencyconversionmasterDataSource: any = [];
  companyprintmasterDataSource: any = [];
  printlabelsDataSource: any = [];
  seriesdefinitionDataSource: any = [];
  usermasterDataSource: any = [];
  capitalizenoncapitalizecommonfieldsDataSource: any = [];
  assetallocationdetailsDataSource: any = [];
  capitalizenoncapitalizecommonfieldsorprepurchaseditassetsDataSource: any = [];
  clientcustomizecolumnDataSource: any = [];
  assetdocumentDataSource: any = [];
  excelmasterDataSource: any = [];
  preprintadditionalassetDataSource: any = [];
  taggingcompleteDataSource: any = [];
  inventorycompleteDataSource: any = [];
  labeldetailsDataSource: any = [];
  uploaderrorDataSource: any = [];
  OtherDataSource: any = [];
  additionalassetsDataSource: any = [];
  taggingprojectmasterDataSource: any = [];
  mobiletransferredassetsDataSource: any = [];
  retireassetdetailsDataSource: any = [];
  retireassetdetailshistoryDataSource: any = [];
  tbl_contract_masterDataSource: any = [];
  panelOpenState = new Array<boolean>(22);

  step = 0;

  setStep(index: number) {
    this.step = index;
    this.panelOpenState[index] = true;    
  }

  changeState(index: number) {
    this.panelOpenState[index] = false;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  displayedHeader : any = [];
  displayedColumns : any = [];

  ProfileId: any;
  dataSource: any;
  showdata = false;
  Mandatorylist: any = [];

  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('sort', { static: true }) sort: MatSort;
  @ViewChild('table', { static: true }) table: any;

  constructor(
    public mandatoryservice: MandatoryService,
    private storage: ManagerService,
    private loader: AppLoaderService,
    private router: Router,
    public alertService: MessageAlertService,
    public gs:GroupService,
    public toastr: ToastrService,
    private jwtAuth: JwtAuthService) {
      this.header = this.jwtAuth.getHeaders();
      this.message = this.jwtAuth.getResources();
      this.displayedHeader = [this.header.IsGivenForClient, this.header.FieldsName, this.header.DisplayName, this.header.FAR, this.header.FarManadatory, this.header.NonFAR, this.header.NONFarMandatory, this.header.GRN, this.header.GRNMandatory, this.header.Editable, this.header.EditableDuringTagging, this.header.EditableDuringTaggingReview, this.header.EditableDuringAudit, this.header.EditableDuringAuditReview, this.header.SearchOptionEnabled, this.header.EditableDuringDaltaUpload , this.header.Additional , this.header.AdditionalMandatory , this.header.GRNUploadEdit, this.header.FARUploadEdit, this.header.NFARUploadEdit];
      this.displayedColumns = ['IsGivenForClient', 'FieldsName', 'DisplayName', 'FAR', 'FarManadatory', 'NONFAR', 'NONFarMandatory', 'GRN', 'GRNMandatory', 'Editable', 'EditableDuringTagging', 'EditableDuringTaggingReview', 'EditableDuringAudit', 'EditableDuringAuditReview', 'SearchOptionEnabled', 'EditableDuringDaltaUpload' , 'Additional','AdditionalMandatory','GRNUploadEdit','FARUploadEdit','NFARUploadEdit'];
    }

  ngOnInit(): void {
    debugger;
    this.paginator._intl.itemsPerPageLabel = 'Records per page';
    this.ProfileId = this.storage.get(Constants.SESSSION_STORAGE, Constants.USER_PROFILE);
    if (this.ProfileId == '0') {
      this.alertService.alert({ message: this.message.NotAuthorisedToAccess, title: this.message.AssetrakSays })
        .subscribe(res => {
          this.router.navigateByUrl('h/a')
        })
    }
    else {
      this.MandatoryGetAllData('prefar');
    }
  }

  ngAfterViewInit() {
    // this.datasource.paginator = this.paginator;
    // this.datasource.sort = this.sort;
  }

  openData() {
    this.showdata = true;
  }

  optionClicked(event: Event, checkedValue, selected, step, index) {
    event.stopPropagation();
  }

  getvalue(TableName, FieldName, ChangedValue, IsValue) {
    debugger;
    var MandatoryDto = {
      TableName: TableName,
      FieldName: FieldName,
      IsChangeData: ChangedValue,
      IsValue: IsValue,
    }
    this.mandatoryservice.UpdateMandatoryfield(MandatoryDto).subscribe(r => {
      debugger;
      //this.MandatoryGetAllData();
    })

  }


  MandatoryGetAllData(TableName) {

    this.tempPrefarSource = [];
    this.tempTransferSource = [];
    this.tempcompanylocationmasterSource = [];
    this.tempprepurchaseditassetsSource = [];
    this.tempcurrencyconversionmasterSource = [];
    this.tempcompanyprintmasterSource = [];
    this.tempprintlabelsSource = [];
    this.tempseriesdefinitionSource = [];
    this.tempusermasterSource = [];
    this.tempcapitalizenoncapitalizecommonfieldsSource = [];
    this.tempassetallocationdetailsSource = [];
    this.tempcapitalizenoncapitalizecommonfieldsorprepurchaseditassetsSource = [];
    this.tempclientcustomizecolumnSource = [];
    this.tempassetdocumentSource = [];
    this.tempexcelmasterSource = [];
    this.temppreprintadditionalassetSource = [];
    this.temptaggingcompleteSource = [];
    this.tempinventorycompleteSource = [];
    this.templabeldetailsSource = [];
    this.tempuploaderrorSource = [];
    this.tempOtherSource = [];
    this.tempadditionalassetsSource = [];
    this.temptaggingprojectmasterSource = [];
    this.tempmobiletransferredassetsSource = [];
    this.tempretireassetdetailsSource = [];
    this.tempretireassetdetailshistorySource = [];
    this.temptbl_contract_masterSource = [];
    debugger;
    this.loader.open();
    //this.mandatoryservice.MandatoryGetAllData().subscribe(r => {
    this.mandatoryservice.MandatoryGetAllDataBYTableName(TableName).subscribe(r => {
      this.loader.close();
      debugger;
      r.forEach(element => {
        element.DisplayName = this.header[element.FieldsName];
        debugger;
        this.Mandatorylist.push(element.Tables)

        if (element.Tables == "prefar") { this.tempPrefarSource.push(element); }
        else if (element.Tables == "Transfer") { this.tempTransferSource.push(element); }
        else if (element.Tables == "companylocationmaster") { this.tempcompanylocationmasterSource.push(element); }
        else if (element.Tables == "prepurchaseditassets") { this.tempprepurchaseditassetsSource.push(element); }
        else if (element.Tables == "currencyconversionmaster") { this.tempcurrencyconversionmasterSource.push(element); }
        else if (element.Tables == "companyprintmaster") { this.tempcompanyprintmasterSource.push(element); }
        else if (element.Tables == "printlabels") { this.tempprintlabelsSource.push(element); }
        else if (element.Tables == "seriesdefinition") { this.tempseriesdefinitionSource.push(element); }
        else if (element.Tables == "usermaster") { this.tempusermasterSource.push(element); }
        else if (element.Tables == "capitalizenoncapitalizecommonfields") { this.tempcapitalizenoncapitalizecommonfieldsSource.push(element); }
        else if (element.Tables == "assetallocationdetails") { this.tempassetallocationdetailsSource.push(element); }
        else if (element.Tables == "capitalizenoncapitalizecommonfields / prepurchaseditassets") { this.tempcapitalizenoncapitalizecommonfieldsorprepurchaseditassetsSource.push(element); }
        else if (element.Tables == "clientcustomizecolumn") { this.tempclientcustomizecolumnSource.push(element); }
        else if (element.Tables == "assetdocument") { this.tempassetdocumentSource.push(element); }
        else if (element.Tables == "excelmaster") { this.tempexcelmasterSource.push(element); }
        else if (element.Tables == "preprintadditionalasset") { this.temppreprintadditionalassetSource.push(element); }
        else if (element.Tables == "taggingcomplete") { this.temptaggingcompleteSource.push(element); }
        else if (element.Tables == "inventorycomplete") { this.tempinventorycompleteSource.push(element); }
        else if (element.Tables == "labeldetails") { this.templabeldetailsSource.push(element); }
        else if (element.Tables == "uploaderror") { this.tempuploaderrorSource.push(element); }
        else if (element.Tables == "other") { this.tempOtherSource.push(element); }
        else if (element.Tables == "additionalassets") { this.tempadditionalassetsSource.push(element); }
        else if (element.Tables == "taggingprojectmaster") { this.temptaggingprojectmasterSource.push(element); }
        else if (element.Tables == "mobiletransferredassets") { this.tempmobiletransferredassetsSource.push(element); }
        else if (element.Tables == "retireassetdetails") { this.tempretireassetdetailsSource.push(element); }
        else if (element.Tables == "retireassetdetailshistory") { this.tempretireassetdetailshistorySource.push(element); }
        else if (element.Tables == "tbl_contract_master") { this.temptbl_contract_masterSource.push(element); }

      });
      this.onChangePrefarDataSource(this.tempPrefarSource);
      this.onChangeTransferDataSource(this.tempTransferSource);
      this.onChangecompanylocationmasterDataSource(this.tempcompanylocationmasterSource);
      this.onChangeprepurchaseditassetsDataSource(this.tempprepurchaseditassetsSource);
      this.onChangecurrencyconversionmasterDataSource(this.tempcurrencyconversionmasterSource);
      this.onChangecompanyprintmasterDataSource(this.tempcompanyprintmasterSource);
      this.onChangeprintlabelsDataSource(this.tempprintlabelsSource);
      this.onChangeseriesdefinitionDataSource(this.tempseriesdefinitionSource);
      this.onChangeusermasterDataSource(this.tempusermasterSource);
      this.onChangecapitalizenoncapitalizecommonfieldsDataSource(this.tempcapitalizenoncapitalizecommonfieldsSource);
      this.onChangeassetallocationdetailsDataSource(this.tempassetallocationdetailsSource);
      this.onChangecapitalizenoncapitalizecommonfieldsorprepurchaseditassetsSourceDataSource(this.tempcapitalizenoncapitalizecommonfieldsorprepurchaseditassetsSource);
      this.onChangeclientcustomizecolumnDataSource(this.tempclientcustomizecolumnSource);
      this.onChangeassetdocumentDataSource(this.tempassetdocumentSource);
      this.onChangeexcelmasterDataSource(this.tempexcelmasterSource);
      this.onChangepreprintadditionalassetDataSource(this.temppreprintadditionalassetSource);
      this.onChangetaggingcompleteDataSource(this.temptaggingcompleteSource);
      this.onChangeinventorycompleteDataSource(this.tempinventorycompleteSource);
      this.onChangelabeldetailsDataSource(this.templabeldetailsSource);
      this.onChangeuploaderrorDataSource(this.tempuploaderrorSource);
      this.onChangeOtherDataSource(this.tempOtherSource);

      this.onChangeadditionalassetsDataSource(this.tempadditionalassetsSource);
      this.onChangetaggingprojectmasterDataSource(this.temptaggingprojectmasterSource);
      this.onChangemobiletransferredassetsDataSource(this.tempmobiletransferredassetsSource);
      this.onChangeretireassetdetailsDataSource(this.tempretireassetdetailsSource);
      this.onChangeretireassetdetailshistoryDataSource(this.tempretireassetdetailshistorySource);
      this.onChangetbl_contract_masterDataSource(this.temptbl_contract_masterSource);
    })
  }

  tempPrefarSource: any = [];
  tempTransferSource: any = [];
  tempcompanylocationmasterSource: any = [];
  tempprepurchaseditassetsSource: any = [];
  tempcurrencyconversionmasterSource: any = [];
  tempcompanyprintmasterSource: any = [];
  tempprintlabelsSource: any = [];
  tempseriesdefinitionSource: any = [];
  tempusermasterSource: any = [];
  tempcapitalizenoncapitalizecommonfieldsSource: any = [];
  tempassetallocationdetailsSource: any = [];
  tempcapitalizenoncapitalizecommonfieldsorprepurchaseditassetsSource: any = [];
  tempclientcustomizecolumnSource: any = [];
  tempassetdocumentSource: any = [];
  tempexcelmasterSource: any = [];
  temppreprintadditionalassetSource: any = [];
  temptaggingcompleteSource: any = [];
  tempinventorycompleteSource: any = [];
  templabeldetailsSource: any = [];
  tempuploaderrorSource: any = [];
  tempOtherSource: any = [];
  tempadditionalassetsSource: any = [];
  temptaggingprojectmasterSource: any = [];
  tempmobiletransferredassetsSource: any = [];
  tempretireassetdetailsSource: any = [];
  tempretireassetdetailshistorySource: any = [];
  temptbl_contract_masterSource: any = [];
  onChangePrefarDataSource(value) {
    this.prefarDataSource = new MatTableDataSource(value);
    this.prefarDataSource.paginator = this.paginator;
    this.prefarDataSource.sort = this.sort;

  }

  onChangeTransferDataSource(value) {
    this.transferDataSource = new MatTableDataSource(value);
    this.transferDataSource.paginator = this.paginator;
    this.transferDataSource.sort = this.sort;

  }
  onChangecompanylocationmasterDataSource(value) {
    this.companylocationmasterDataSource = new MatTableDataSource(value);
    this.companylocationmasterDataSource.paginator = this.paginator;
    this.companylocationmasterDataSource.sort = this.sort;
  }
  onChangeprepurchaseditassetsDataSource(value) {
    this.prepurchaseditassetsDataSource = new MatTableDataSource(value);
    this.prepurchaseditassetsDataSource.paginator = this.paginator;
    this.prepurchaseditassetsDataSource.sort = this.sort;
  }
  onChangecurrencyconversionmasterDataSource(value) {
    this.currencyconversionmasterDataSource = new MatTableDataSource(value);
    this.currencyconversionmasterDataSource.paginator = this.paginator;
    this.currencyconversionmasterDataSource.sort = this.sort;
  }
  onChangecompanyprintmasterDataSource(value) {
    this.companyprintmasterDataSource = new MatTableDataSource(value);
    this.companyprintmasterDataSource.paginator = this.paginator;
    this.companyprintmasterDataSource.sort = this.sort;
  }
  onChangeprintlabelsDataSource(value) {
    this.printlabelsDataSource = new MatTableDataSource(value);
    this.printlabelsDataSource.paginator = this.paginator;
    this.printlabelsDataSource.sort = this.sort;
  }
  onChangeseriesdefinitionDataSource(value) {
    this.seriesdefinitionDataSource = new MatTableDataSource(value);
    this.seriesdefinitionDataSource.paginator = this.paginator;
    this.seriesdefinitionDataSource.sort = this.sort;
  }
  onChangeusermasterDataSource(value) {
    this.usermasterDataSource = new MatTableDataSource(value);
    this.usermasterDataSource.paginator = this.paginator;
    this.usermasterDataSource.sort = this.sort;
  }
  onChangecapitalizenoncapitalizecommonfieldsDataSource(value) {
    this.capitalizenoncapitalizecommonfieldsDataSource = new MatTableDataSource(value);
    this.capitalizenoncapitalizecommonfieldsDataSource.paginator = this.paginator;
    this.capitalizenoncapitalizecommonfieldsDataSource.sort = this.sort;
  }
  onChangeassetallocationdetailsDataSource(value) {
    this.assetallocationdetailsDataSource = new MatTableDataSource(value);
    this.assetallocationdetailsDataSource.paginator = this.paginator;
    this.assetallocationdetailsDataSource.sort = this.sort;
  }
  onChangecapitalizenoncapitalizecommonfieldsorprepurchaseditassetsSourceDataSource(value) {
    this.capitalizenoncapitalizecommonfieldsorprepurchaseditassetsDataSource = new MatTableDataSource(value);
    this.capitalizenoncapitalizecommonfieldsorprepurchaseditassetsDataSource.paginator = this.paginator;
    this.capitalizenoncapitalizecommonfieldsorprepurchaseditassetsDataSource.sort = this.sort;
  }
  onChangeclientcustomizecolumnDataSource(value) {
    this.clientcustomizecolumnDataSource = new MatTableDataSource(value);
    this.clientcustomizecolumnDataSource.paginator = this.paginator;
    this.clientcustomizecolumnDataSource.sort = this.sort;
  }
  onChangeassetdocumentDataSource(value) {
    this.assetdocumentDataSource = new MatTableDataSource(value);
    this.assetdocumentDataSource.paginator = this.paginator;
    this.assetdocumentDataSource.sort = this.sort;
  }
  onChangeexcelmasterDataSource(value) {
    this.excelmasterDataSource = new MatTableDataSource(value);
    this.excelmasterDataSource.paginator = this.paginator;
    this.excelmasterDataSource.sort = this.sort;
  }
  onChangepreprintadditionalassetDataSource(value) {
    this.preprintadditionalassetDataSource = new MatTableDataSource(value);
    this.preprintadditionalassetDataSource.paginator = this.paginator;
    this.preprintadditionalassetDataSource.sort = this.sort;
  }
  onChangetaggingcompleteDataSource(value) {
    this.taggingcompleteDataSource = new MatTableDataSource(value);
    this.taggingcompleteDataSource.paginator = this.paginator;
    this.taggingcompleteDataSource.sort = this.sort;
  }
  onChangeinventorycompleteDataSource(value) {
    this.inventorycompleteDataSource = new MatTableDataSource(value);
    this.inventorycompleteDataSource.paginator = this.paginator;
    this.inventorycompleteDataSource.sort = this.sort;
  }
  onChangelabeldetailsDataSource(value) {
    this.labeldetailsDataSource = new MatTableDataSource(value);
    this.labeldetailsDataSource.paginator = this.paginator;
    this.labeldetailsDataSource.sort = this.sort;
  }
  onChangeuploaderrorDataSource(value) {
    this.uploaderrorDataSource = new MatTableDataSource(value);
    this.uploaderrorDataSource.paginator = this.paginator;
    this.uploaderrorDataSource.sort = this.sort;
  }
  onChangeOtherDataSource(value) {
    this.OtherDataSource = new MatTableDataSource(value);
    this.OtherDataSource.paginator = this.paginator;
    this.OtherDataSource.sort = this.sort;
  }
  onChangeadditionalassetsDataSource(value) {
    this.additionalassetsDataSource = new MatTableDataSource(value);
    this.additionalassetsDataSource.paginator = this.paginator;
    this.additionalassetsDataSource.sort = this.sort;
  }
  onChangetaggingprojectmasterDataSource(value) {
    this.taggingprojectmasterDataSource = new MatTableDataSource(value);
    this.taggingprojectmasterDataSource.paginator = this.paginator;
    this.taggingprojectmasterDataSource.sort = this.sort;
  }
  onChangemobiletransferredassetsDataSource(value) {
    this.mobiletransferredassetsDataSource = new MatTableDataSource(value);
    this.mobiletransferredassetsDataSource.paginator = this.paginator;
    this.mobiletransferredassetsDataSource.sort = this.sort;
  }
  onChangeretireassetdetailsDataSource(value) {
    this.retireassetdetailsDataSource = new MatTableDataSource(value);
    this.retireassetdetailsDataSource.paginator = this.paginator;
    this.retireassetdetailsDataSource.sort = this.sort;
  }
  onChangeretireassetdetailshistoryDataSource(value) {
    this.retireassetdetailshistoryDataSource = new MatTableDataSource(value);
    this.retireassetdetailshistoryDataSource.paginator = this.paginator;
    this.retireassetdetailshistoryDataSource.sort = this.sort;
  }
  onChangetbl_contract_masterDataSource(value) {
    this.tbl_contract_masterDataSource = new MatTableDataSource(value);
    this.tbl_contract_masterDataSource.paginator = this.paginator;
    this.tbl_contract_masterDataSource.sort = this.sort;
  }
  
  changeNameList : any=[];
  changeDisplayName(row){
    debugger;
    var changeName = this.changeNameList.find(x=> x.key == row.FieldsName);

    if(!!changeName){
      changeName.value = row.DisplayName;
    }
    else{
      var data = {
        key : row.FieldsName,
        value : row.DisplayName
      }
      this.changeNameList.push(data);
    }
  }

  submitChangeNameList(){
    debugger;
    var changeHeaderList = JSON.stringify(this.changeNameList)
    this.gs.AddDisplayNameToClientHeaderFile(changeHeaderList).subscribe(r => {
      debugger;
      if(r == 'Success'){       
        this.changeNameList = []; 
        this.jwtAuth.GetHeaderFileData();
        this.header = this.jwtAuth.getHeaders();
        this.toastr.success('Display name updated successfully.', this.message.AssetrakSays);
      }
    })
  }

}
