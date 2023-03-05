import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReplaySubject, Subject,forkJoin } from 'rxjs';
import { FormControl,FormBuilder,FormGroup,Validators } from '@angular/forms';
import { AssetService } from 'app/components/services/AssetService';
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import { MatSelectChange } from '@angular/material/select';
import { MandatoryService } from 'app/components/services/MandatoryService';
import { FieldfilterService } from 'app/components/services/FieldfilterService';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { ToastrService } from 'ngx-toastr';
import * as header from '../../../../../assets/Headers.json';
import * as resource from '../../../../../assets/Resource.json';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-field-dialog-popup',
  templateUrl: './field-dialog-popup.component.html',
  styleUrls: ['./field-dialog-popup.component.scss']
})
export class FieldDialogPopupComponent implements OnInit {
  Headers: any;
  message: any = (resource as any).default;

  ListOfField1: any[] = [];
  searchText: string;
  public fieldMultiCtrl: FormControl = new FormControl();
  isActive :boolean =false;
  public ListOfField: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public TablefilteredFieldMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  TypeData: any[] = [
    { Type: '1', headerName: "AssetInfoView" },
    { Type: '2', headerName: "NetworkInfoView" },
    { Type: '3', headerName: "AuditInfoView" },
    { Type: '4', headerName: "HardwareInfoView" },
    { Type: '6', headerName: "Asset Info" },
    { Type: '7', headerName: "Asset No" },
    { Type: '8', headerName: "Location" },
    { Type: '9', headerName: "Plant" },
    { Type: '10', headerName: "Retirement Id" },
    { Type: '11', headerName: "Transfer Id" },
    { Type: '12', headerName: "Retirement AD" },
    { Type: '13', headerName: "Asset " },
    { Type: '14', headerName: "WdV" },
    { Type: '15', headerName: "WDV(local)" },
    { Type: '16', headerName: "Inventory No" },
    { Type: '17', headerName: "Inventory comment" },
    { Type: '18', headerName: "City" },
    { Type: '19', headerName: "MoNo" },
    { Type: '20', headerName: "Barcode " },
    { Type: '21', headerName: "AssetId" },
    { Type: '22', headerName: "ADL1" },
    { Type: '23', headerName: "ADL2" },
    { Type: '24', headerName: "ADL3" },
    { Type: '25', headerName: "Status" },
    { Type: '26', headerName: "AMC" },
    { Type: '27', headerName: "Admin" },
    { Type: '28', headerName: "All status" },
    { Type: '29', headerName: "Asset Life" },
    { Type: '30', headerName: "Asset Type" },
    { Type: '31', headerName: "Attachment" },
    { Type: '32', headerName: "Audit" },
    { Type: '33', headerName: "Audit1" },
    { Type: '34', headerName: "Admin2" },
    { Type: '35', headerName: "AdL3" },
    { Type: '36', headerName: "Category" },
    { Type: '38', headerName: "Asset catergory" },
    { Type: '39', headerName: "inventory cat" },
    { Type: '40', headerName: "Authorization" },

    /*	{ Type: '6', Name: "PingFed" },*/
  ]
  TableTypeData: any[] = [
    // { Type: '1', Name: "prefar" },
    // { Type: '2', Name: "companylocationmaster" },
    // { Type: '3', Name: "prepurchaseditassets" },
    // { Type: '4', Name: "PrintLabels" },
    // { Type: '5', Name: "Transfer" },
    // { Type: '6', Name: "Retirement" },
    // { Type: '7', Name: "assetallocationdetails" },
    // { Type: '8', Name: "clientcustomizecolumn" },
    /*	{ Type: '6', Name: "PingFed" },*/
  ]
  dialogForm: FormGroup;
  groupId:any;
  selectedValue: any;
  compareValue: any;
  List: any[] = [];
  listOfMandetorydata: any = [];
  listOfStandardViewData:any = [];
  listofMandatory: any = [];
  checboxIdlist: any[] = [];
  pagenamelist: any[] = [];
  checboxlist:any[]=[];
  listOfmappingField: any = [];
  listpagedata: any[] = [];
  listofpagefiledmappingdata: any = [];
  public pagename: any;
  viewid:any;

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
  Dynamicflage: boolean = false;
  Editasset:boolean = false;
  ReviewAsset: boolean = false;
  PrintTag:boolean = false;
  ReprintTag:boolean = false;
  TagStatusReport:boolean = false;

sendforreconsilation:boolean = false;
closeproject:boolean = false;
physicalmovement:boolean = false;
assetintransitreport:boolean = false;
recieveasset:boolean = false;
revertasset:boolean = false;
physicaldisposal:boolean = false;
outboundpendingasset:boolean = false;
AssetRetirementhistory:boolean = false;
NonVerifiableAssets:boolean = false;
VerifyOnlyAssets:boolean = false;
AssetDisposalreport:boolean = false;
TaggingReport:boolean = false;
InventoryReport:boolean = false;
AssetRegister:boolean = false;
AuditTrail:boolean = false;
AssetTrail:boolean = false;
DamagedNotinuseAssets:boolean = false;
AssetTransferReport:boolean = false;
AssetDispatchReport:boolean = false;
UnrecordedTransferReport:boolean = false;
Assetsatrisk:boolean = false;
Assetsdueforexpiry:boolean = false;
InitiateTransferPopup:boolean = false;
TransferApprovalPopup:boolean = false;
InitiateRetirementPopup:boolean = false;
RetirementApprovalPopup:boolean = false;
PhysicalDisposalPopup:boolean = false;
AllocationReport:boolean = false;
AssignmentPopup:boolean = false;
standardcategorydata:any;

  get f() { return this.dialogForm.controls; };
  constructor(public dialogRef: MatDialogRef<FieldDialogPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,public localService: LocalStoreService,
    private fb: FormBuilder,
    public as:AssetService,
    private storage: ManagerService,
    public mandatoryservice: MandatoryService,
    public fieldfilterservice: FieldfilterService,
    private jwtAuth:JwtAuthService) {
      this.Headers = this.jwtAuth.getHeaders()
     }

  ngOnInit(): void {
    debugger
    this.groupId = this.storage.get(Constants.SESSSION_STORAGE, Constants.GROUP_ID);
    this.standardcategorydata= this.data.payload;
    this.viewid= this.standardcategorydata[0].CategoryId;
    //this.PagesGetAllData();
    this.isActive = !this.isActive;
    this.ListOfField.next(this.TypeData.slice());
    this.TablefilteredFieldMulti.next(this.TableTypeData.slice());
    this.dialogForm = this.fb.group({
      ViewName:[this.data.value.Categoryname ||'',[Validators.required]],
     
    });
    this.gettabledata()
    this.checboxlist=[];
  }
  gettabledata()
  {
    debugger;
    this.as.GetstandardTablename(this.groupId,this.viewid).subscribe(r=> {
      debugger;
      this.TableTypeData = JSON.parse(r);
      this.TableTypeData = this.TableTypeData.filter(
        (thing, i, arr) => arr.findIndex(t => t.TableName === thing.TableName) === i
      );
      this.TablefilteredFieldMulti.next(this.TableTypeData.slice());
    })
  }
  getFields(event: MatSelectChange) {
    debugger;
    this.compareValue = this.selectedValue.TableName;
    this.List = [];
    this.as.GetstandardTablename(this.groupId,this.viewid).subscribe(r=> {
      this.listOfStandardViewData = [];
      this.listOfStandardViewData = JSON.parse(r);;
      this.listOfStandardViewData.forEach(element => {
      if (element.TableName == this.compareValue) 
      {
        this.List.push(element);
        if(element.Custom2=='1'){
        this.checboxlist.push(element.StandardViewTableId);
        }
        else
        {

        }
      }
      })

    })
    // this.mandatoryservice.MandatoryGetAllDataBYTableName(this.selectedValue.TableName).subscribe(r => {
    //   debugger;
    //   this.listOfMandetorydata = [];
    //   this.listOfMandetorydata = r;
    //   this.listOfMandetorydata.forEach(element => {
    //     if (element.Tables == this.compareValue && element.IsGivenForClient == true) {
    //       debugger;
    //       this.List.push(element);
    //       var idx1 = this.pagenamelist.indexOf(this.selectedValue.TableName);
    //       if (idx1 == -1) {
    //         var idx = this.listOfmappingField.indexOf(element.ID);
    //         if (idx > -1) {
    //           this.checboxlist.push(element.ID);
    //           this.checboxIdlist.push(element);
    //         }
    //       }
    //     }
    //   });
    // })
    
  }
  Onsearch(event) {   
    
    var search = event.toLowerCase();
    //this.ListOfField.forEach(val => { val.headerName = val.headerName.toLowerCase()})
    //this.ListOfField = this.ListOfField1.filter(x => x.headerName.toLowerCase().indexOf(search) > -1);
  }
  fielddto:any ;
  FieldList:any[]=[];
  save() {
    debugger;
    for (var i = 0; i < this.List.length; i++) {
      var field = {
        Tables: this.List[i].Custom1,
        ID: this.List[i].StandardViewTableId,
        Fieldname :this.List[i].Custom2
      }
      this.FieldList.push(field)
    }
    if (this.checboxlist.length == 0) {
     //this.toastr.success(this.message.FieldError, this.message.AssetrakSays);
    }
        
      
       this.fielddto= {
        viewid:this.viewid,
        tableFieldList : this.FieldList
      }
    

    this.as.SaveFieldStandardView(this.fielddto).subscribe(r=> {})
    console.log(this.List);
   // this.ListOfField = this.ListOfField1;
    this.dialogRef.close(this.ListOfField);
  }
  checkboxclick(n) {
    debugger; 
    var index = this.checboxlist.indexOf(n.StandardViewTableId);
    if (index == -1) {
      n.Custom2 = "1"; 
      this.checboxlist.push(n.StandardViewTableId);
      this.checboxIdlist.push(n);
      this.List.forEach(element=>{
        if(element.StandardViewTableId==n.StandardViewTableId)
        {
          n.Custom2 = "1"; 
        }
      })
    }
    else {
      this.checboxlist.splice(index, 1);
      this.checboxIdlist.splice(n);
      this.List.forEach(element=>{
        if(element.StandardViewTableId==n.StandardViewTableId)
        {
          n.Custom2 = "0"; 
        }
      })
    }
  }

  PagesGetAllData() {
    debugger;
    this.fieldfilterservice.PagesGetAllData().subscribe(result => {
      debugger;
      this.listpagedata = result;
      this.pagename = this.localService.getItem('selectedgrp');
      this.listpagedata.forEach(element => {
        if (element.ModuleId == this.pagename.Id) {
          if (element.ModuleId == 21) {
            this.Editasset = true;
          }
          else if (element.ModuleId == 22) {
            this.ReviewAsset = true;
          }
          else if (element.ModuleId == 24) {
            this.Relationship = true;
          } else if (element.ModuleId == 25) {
            this.ManageGroup = true;
          }
          else if (element.ModuleId == 27) {
            this.PrintTag = true;
          } else if (element.ModuleId == 28) {
            this.ReprintTag = true;
          } else if (element.ModuleId == 29) {
          this.TagStatusReport = true;
            }

          else if (element.ModuleId == 30) {
            this.ApproveTaggingInformation = true;
          } else if (element.ModuleId == 31) {
            this.AdditionalAssets = true;
          } else if (element.ModuleId == 33) {
            this.InventoryStatus = true;
          } else if (element.ModuleId == 35) {
            this.MissingAssets = true;
          } else if (element.ModuleId == 36) {
            this.AdditionalAssetsReconc = true;
          } else if (element.ModuleId == 37) {
            this.ViewModifiedAssets = true;
          } else if (element.ModuleId == 9) {
            this.Assignment = true;
          }
          else if (element.ModuleId == 40) {
            this.InitiateTransfer = true;
          }
          else if (element.ModuleId == 41) {
            this.TransferApproval = true;
          }
          else if (element.ModuleId == 47) {
            this.InitiateRetirement = true;
          }
          else if (element.ModuleId == 48) {
            this.RetirementApproval = true;
          }
          else if(element.ModuleId == 34)
          {
            this.sendforreconsilation = true;
          }
          else if(element.ModuleId == 38)
          {
            this.closeproject = true;
          }
          else if(element.ModuleId == 42)
          {
            this.physicalmovement = true;
          }
          else if(element.ModuleId == 43)
          {
            this.assetintransitreport = true;
          }
          else if(element.ModuleId == 44)
          {
            this.recieveasset = true;
          }
          else if(element.ModuleId == 45)
          {
            this.revertasset = true;
          }
          else if(element.ModuleId == 49)
          {
            this.physicaldisposal = true;
          }
          else if(element.ModuleId == 51)
          {
            this.outboundpendingasset = true;
          }
          else if(element.ModuleId == 52)
          {
            this.AssetRetirementhistory = true;
          }
          else if(element.ModuleId == 53)
          {
            this.NonVerifiableAssets = true;
          }
          else if(element.ModuleId == 54)
          {
            this.VerifyOnlyAssets = true;
          }
          else if(element.ModuleId == 55)
          {
            this.AssetDisposalreport = true;
          }
          else if(element.ModuleId == 56)
          {
            this.TaggingReport = true;
          }
          else if(element.ModuleId == 57 )
          {
            this.InventoryReport = true;
          }
          else if(element.ModuleId == 58)
          {
            this.AssetRegister = true;
          }
          else if(element.ModuleId == 59 )
          {
            this.AuditTrail = true;            
          }
          else if(element.ModuleId == 60 )
          {
            this.AssetTrail = true;            
          }
          else if(element.ModuleId == 61 )
          {
            this.DamagedNotinuseAssets = true;            
          }
          else if(element.ModuleId ==  62)
          {
            this.AssetTransferReport = true;            
          }
          else if(element.ModuleId == 63 )
          {
            this.AssetDispatchReport = true;            
          }
          else if(element.ModuleId == 64 )
          {
            this.UnrecordedTransferReport = true;            
          }
          else if(element.ModuleId == 65)
          {
            this.Assetsatrisk = true;            
          }
          else if(element.ModuleId == 66)
          {
            // this.Assetsdueforexpiry = true;  
            this.AllocationReport = true; 
          }
          else if (element.ModuleId == 98) {
            this.InitiateTransferPopup = true;
          }
          else if (element.ModuleId == 99) {
            this.TransferApprovalPopup = true;
          }
          else if (element.ModuleId == 101) {
            this.InitiateRetirementPopup = true;
          }
          else if (element.ModuleId == 102) {
            this.RetirementApprovalPopup = true;
          }
          else if(element.ModuleId == 103){
            this.PhysicalDisposalPopup = true;
          }
          else if(element.ModuleId == 107){
            this.AssignmentPopup = true;
          }
        }
      });

      this.PageFieldMappingGetAllData(this.pagename.Id);
    });
  }

  PageFieldMappingGetAllData(ModuleID) {
    debugger;
    this.fieldfilterservice.GetAllDataPagefieldmappingByModuleID(ModuleID).subscribe(r => {
      debugger;
      this.listofpagefiledmappingdata = r;
      this.listofpagefiledmappingdata.forEach(element => {
        this.listOfmappingField.push(element.FieldId);

      });
    })
  }
}
