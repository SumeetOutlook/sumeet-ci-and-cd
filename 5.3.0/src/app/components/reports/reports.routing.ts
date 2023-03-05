import { Routes } from "@angular/router";

import {DamageorNotinUsedComponent} from './damageor-notin-used/damageor-notin-used.component';
import {Outbound_Pending_AssetsComponent} from  './outbound_pending_assets/outbound_pending_assets.component'
import { AssetDispatchedReportComponent } from './asset-dispatched-report/asset-dispatched-report.component';
import { AssetTransferReportComponent } from './asset-transfer-report/asset-transfer-report.component';
import { AssetRegisterComponent } from './asset_register/asset_register.component';
import {InventoryReportComponent} from './inventory_report/inventory_report.component';
import { AssetRetirementReportComponent } from './asset-retirement-report/asset-retirement-report.component';
import { VerifyOnlyAssetsComponent } from './verify-only-assets/verify-only-assets.component';
import { NonVerifyAssetComponent } from './non-verify-asset/non-verify-asset.component';
import {ReportTaggingComponent} from './report-tagging/report-tagging.component';
import {AssetRetirementHistoryReportComponent} from './asset-retirementHistory-report/asset-retirement-history-report.component';
import { AllocationReportComponent } from './Allocation_Report/Allocation_Report.component';
import { HardwareDiscoveryReportComponent } from './itam/hardware-discovery-report/hardware-discovery-report.component';
import { HardwareChangeReportComponent } from './itam/hardware-change-report/hardware-change-report.component';
import { SoftwareInformationReportComponent } from './itam/software-information-report/software-information-report.component';
import { SoftwareExpiryReportComponent } from './itam/software-expiry-report/software-expiry-report.component';
import { ElpReportComponent } from './itam/elp-report/elp-report.component';

export const ReportRoutes: Routes = [
    {
        path: "",
        children: [
          {
            path: "a",
            component: Outbound_Pending_AssetsComponent,
            data: { title: "Outbound Pending Assets" }
          },
          {
            path: "DamageNotInUse",
            component: DamageorNotinUsedComponent,
            data: { title: "Damaged or Not in Use" }
          },
          {
         
            path: "h",
            component: AssetDispatchedReportComponent,
            data: { title: "Asset Transfer History Report" }
          },
          {
            path: "g",
            component: AssetTransferReportComponent,
            data: { title: "Asset Transfer Report" }
          },
          
          {
            path: "f",
            component: AssetRegisterComponent,
            data: { title: "Asset Register Report"}
            
          },
          {
            path: "b",
            component: AssetRetirementReportComponent,
            data: { title: "Asset Retirement Report" }
          },
          {
            path: "c",
            component: AssetRetirementHistoryReportComponent,
            data: { title: "Asset Retirement History Report" }
          },
          {
            path: "e",
            component: InventoryReportComponent,
            data: { title:"Inventory Report"}
          },{

            path: "verifyonly",
            component: VerifyOnlyAssetsComponent,
            data: { title: "Verify Only Assets" }
          }, 
          {
            path: "nonverify",
            component: NonVerifyAssetComponent,
            data: { title: "Non Verifiable Assets" }
          },
          {
            path: 'd',
            component:ReportTaggingComponent,
            data: {title: "Report Tagging"}
          },
          {
            path: 'k',
            component:AllocationReportComponent,
            data: {title: "Allocation Report"}
          },
          {
            path: 'l',
            component:HardwareDiscoveryReportComponent,
            data: {title: "Hardware Discovery Report"}
          },
          {
            path: 'm',
            component:HardwareChangeReportComponent,
            data: {title: "Hardware Change Report"}
          },
          {
            path: 'n',
            component:SoftwareInformationReportComponent,
            data: {title: "Software Information Report"}
          },
          {
            path: 'o',
            component:SoftwareExpiryReportComponent,
            data: {title: "Software Expiry Report"}
          },
          {
            path: 'p',
            component:ElpReportComponent,
            data: {title: "ELP Report"}
          }
        ]
      }
    ];
