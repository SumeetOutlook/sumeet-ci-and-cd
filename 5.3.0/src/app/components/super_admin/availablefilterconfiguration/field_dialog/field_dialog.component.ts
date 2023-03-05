import { Component, OnInit, Input, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LocalStoreService } from '../../../../shared/services/local-store.service';
import { MandatoryService } from 'app/components/services/MandatoryService';
import { CredentialService } from 'app/components/services/CredentialService';
import { FieldfilterService } from 'app/components/services/FieldfilterService';
import { ToastrService } from 'ngx-toastr';
import * as header from '../../../../../assets/Headers.json';
import * as resource from '../../../../../assets/Resource.json';


@Component({
  selector: 'app-field_dialog',
  templateUrl: './field_dialog.component.html',
  styleUrls: ['./field_dialog.component.scss'],
})
export class FieldsComponent implements OnInit {
  Headers: any = (header as any).default;
  message: any = (resource as any).default;
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


  public pagename: any;

  selectedValue: any;
  compareValue: any;
  List: any[] = [];
  listOfMandetorydata: any = [];
  listofMandatory: any = [];

  count: number = 0;
  errorMsg: string;
  resultText = [];
  values: string;
  checboxlist = [];
  listpagedata: any[] = [];
  newlist: any = [];
  listofpagefiledmappingdata: any = [];
  listOfmappingField: any = [];

  constructor(public dialogRef: MatDialogRef<FieldsComponent>, public localService: LocalStoreService,
    public mandatoryservice: MandatoryService,
    public credentialservice: CredentialService,
    public fieldfilterservice: FieldfilterService,
    public toastr: ToastrService,) { }

  ListOfPrefar: any = [
    {
      name: "Field Name ",
      value: "Asset No "
    },
    {
      name: "SubNo",
      value: "Sub No"
    },
    {
      name: "CapitalizationDate ",
      value: "Capitalization Date"
    },
    {
      name: "AssetClass",
      value: "Asset Class"
    },
    {
      name: "AssetType",
      value: "Asset Type"
    },
    {
      name: "AssetSubType",
      value: "Asset Sub Type"
    },
    {
      name: "AssetName",
      value: "Asset Name"
    },

    {
      name: "UOM ",
      value: "UOM"
    },

    {
      name: "AssetDescription ",
      value: "Asset Description"
    },

    {
      name: "Qty ",
      value: "Qty"
    },

    {
      name: "Cost ",
      value: "Cost"
    },
    {
      name: "Wdv ",
      value: "Wdv"
    },
    {
      name: "Cost ",
      value: "Cost"
    },
    {
      name: "EquipmentNo ",
      value: "Equipment No"
    },
    {
      name: "AssetCondition ",
      value: "Asset Condition"
    },
    {
      name: "AssetCriticality ",
      value: "Asset Criticality"
    }
  ];


  ListOfLabelDetails: any = [
    {
      name: "LabelMaterial ",
      value: "Label Material"
    },
    {
      name: "LabelSize",
      value: "Label Size"
    }
  ];

  ListOfPreprint: any = [
    {
      name: "InventoryComment ",
      value: "Inventory Comment"
    },
    {
      name: "SerialNo",
      value: "Serial No"
    },
    {
      name: "ITSerialNo ",
      value: "IT Serial No"
    },
    {
      name: "UserName",
      value: "User Name"
    },
    {
      name: "GPS_CoOrdinate ",
      value: "GPS_CoOrdinate"
    },
    {
      name: "GPS_Location",
      value: "GPS_Location"
    },
    {
      name: "PONumber ",
      value: "PO Number"
    },
    {
      name: "InvoiceNo",
      value: "Invoice No"
    }

  ];
  ListOfCustomization: any = [
    {
      name: "IsMetal ",
      value: "IsMetal "
    },
    {
      name: "CPPNumber",
      value: "CPP Number"
    },
    {
      name: "AMCComment ",
      value: "AMC Comment"
    },
    {
      name: "Budget",
      value: "Budget"
    },
    {
      name: "GRNDate",
      value: "GRN Date"
    },
    {
      name: "Description",
      value: "Description"
    },
    {
      name: "Remark",
      value: "Remark"
    },

    {
      name: "AccountingStatus ",
      value: "Accounting Status"
    },

    {
      name: "Division ",
      value: "Division"
    },

    {
      name: "ExpenseAccount ",
      value: "Expense Account"
    },

    {
      name: "CostAccount ",
      value: "Cost Account"
    },
    {
      name: "ReserveAccount ",
      value: "Reserve Account"
    },
    {
      name: "Department ",
      value: "Department"
    },
    {
      name: "Area ",
      value: "Area"
    },
    {
      name: "Merchandise ",
      value: "Merchandise"
    },
    {
      name: "InterCompany ",
      value: "Inter Company"
    },
    {
      name: "ServiceProvider ",
      value: "Service Provider"
    },
    {
      name: "AccumulatedDepreciation ",
      value: "Accumulated Depreciation"
    },
    {
      name: "FutureUse ",
      value: "FutureUse"
    },
    {
      name: "InterUnit ",
      value: "Inter Unit"
    },
    {
      name: "Account_Clearing ",
      value: "Account_Clearing"
    },
    {
      name: "Department_Clearing ",
      value: "Department_Clearing"
    },
    {
      name: "Comments",
      value: "Comments"
    },
    {
      name: "Upl ",
      value: "Upl"
    },
    {
      name: "DepreciationReserve ",
      value: "DepreciationReserve"
    },
    {
      name: "Project ",
      value: "Project"
    },
    {
      name: "AmortizationStartDate ",
      value: "Amortization StartDate"
    },
    {
      name: "AmortizeNBV ",
      value: "Amortize NBV"
    },
    {
      name: "LifeInMonths ",
      value: "Life In Months"
    },
    {
      name: "Messages ",
      value: "Messages"
    },
  ];


  ngOnInit() {
    debugger;
    this.PagesGetAllData();
    this.checboxlist = [];
  }


  onclosetab() {
    this.localService.clear();
    this.dialogRef.close();
  }

  getFieldsOld(event: MatSelectChange) {
    debugger;
    this.compareValue = this.selectedValue;
    this.List = [];
    this.listOfMandetorydata.forEach(element => {
      element.checked = false;
      if (element.Tables == this.compareValue && element.IsGivenForClient == true) {
        debugger;
        var index = this.listOfmappingField.indexOf(element.ID);
        if (index == -1) {
          element.checked = false;
        }
        else {
          element.checked = true;
          this.checboxlist.push(element.ID);
        }
        this.List.push(element);
      }

    });
  }
  checboxIdlist: any[] = [];
  pagenamelist: any[] = [];
  getFields(event: MatSelectChange) {
    debugger;
    this.compareValue = this.selectedValue;
    this.List = [];
    this.mandatoryservice.MandatoryGetAllDataBYTableName(this.selectedValue).subscribe(r => {
      debugger;
      this.listOfMandetorydata = [];
      this.listOfMandetorydata = r;
      this.listOfMandetorydata.forEach(element => {
        if (element.Tables == this.compareValue && element.IsGivenForClient == true) {
          debugger;
          this.List.push(element);
          var idx1 = this.pagenamelist.indexOf(this.selectedValue);
          if (idx1 == -1) {
            var idx = this.listOfmappingField.indexOf(element.ID);
            if (idx > -1) {
              this.checboxlist.push(element.ID);
              this.checboxIdlist.push(element);
            }
          }
        }
      });
      this.pagenamelist.push(this.selectedValue);
    });

  }

  checkboxclick(element) {
    debugger;
    var index = this.checboxlist.indexOf(element.ID);
    if (index == -1) {
      this.checboxlist.push(element.ID);
      this.checboxIdlist.push(element);
    }
    else {
      this.checboxlist.splice(index, 1);
      this.checboxIdlist.splice(index, 1);
    }
  }


  onChange(branchNamae: string, event) {
    this.errorMsg = "";
    const checked = event.target.checked;

    if (checked) {
      this.resultText.push(branchNamae);

    } else {
      const index = this.resultText.indexOf(branchNamae);
      this.resultText.splice(index, 1);
    }
    this.values = this.resultText.toString();
    const count = this.resultText.length;
    this.count = count;
  }


  tableFieldList: any[] = [];
  save(TableName) {
    debugger;
    this.pagename = this.localService.getItem('selectedgrp');
    var fieldlist = this.checboxlist.join(',')
    for (var i = 0; i < this.checboxIdlist.length; i++) {
      var field = {
        Tables: this.checboxIdlist[i].Tables,
        ID: this.checboxIdlist[i].ID
      }
      this.tableFieldList.push(field)
    }
    if (this.checboxlist.length == 0) {
      this.toastr.success(this.message.FieldError, this.message.AssetrakSays);
    }
    else {
      var Pagedto =
      {
        IsforAdmin: false,
        PageId: this.pagename.Id,
        PageName: this.pagename.name,
        tableFieldList : this.tableFieldList
      }
      this.fieldfilterservice.PageFieldMappingInsert(Pagedto).subscribe(result => {
        debugger;
        this.toastr.success(this.message.PageField, this.message.AssetrakSays);
      });
      this.dialogRef.close();
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

