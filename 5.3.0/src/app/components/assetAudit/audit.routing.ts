import { Routes } from "@angular/router";
import { ApprovetaggingComponent } from "./approveTagging/approvetagging.component";
import { CreateProjectComponent } from './create_project/create_project.component';
import { SendForReconciliationComponent } from './send_for_reconciliation/send_for_reconciliation.component';
import { PrintTagComponent } from './print-tag/prtint-tag.component';
import { AdditionalassetsComponent } from './additionalassets/additionalassets.component';
import { InventoryStatusComponent } from './inventory-status/inventory-status.component';
import { CloseProjectComponent } from './close-project/close-project.component';
import { MissingAssetComponent } from './missing_assets/missing-asset.component';
import { AdditionalTaggingAssetsComponent } from './additional-tagging-assets/additional-tagging-assets.component';
import { ReprintTagsComponent } from './reprint-tags/reprint-tags.component';
import { TagstatusReportComponent } from './tagstatus-report/tagstatus-report.component';
import { ViewModifiedAssetsComponent } from './view-modified-assets/view-modified-assets.component';


export const AuditRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "d",
        component: CreateProjectComponent,
        data: { title: "Create Project" }
      },
      {
        path: "k",
        component: CloseProjectComponent,
        data: { title: "Close project" }
      },
      {
        path: "e",
        component: InventoryStatusComponent,
        data: { title: "Inventory Status" }
      },
      {
        path: "f",
        component: SendForReconciliationComponent,
        data: { title: "Send For Reconciliation" }
      },
      {
        path: "b",
        component: ApprovetaggingComponent,
        data: { title: "Approve tagging Status" }
      },
      {
        path: "a",
        component: PrintTagComponent,
        data: { title: "Print Tag" }
      },  
      {
        path: "l",
        component: ReprintTagsComponent,
        data: { title: "RePrint Tags"}
      },    
      {
        path: "m",
        component: TagstatusReportComponent,
        data: { title: "Tag Status Report"}
      },
      {
        path: "g",
        component: MissingAssetComponent,
        data: { title: "Missing Asset" }
      },
      {
        path: "h",
        component: AdditionalassetsComponent,
        data: { title: "Additional Assets" }
      },
      {
        path: "c",
        component: AdditionalTaggingAssetsComponent,
        data: { title: "Additional Tagging Assets" }
      },
      {
        path: "n",
        component: ViewModifiedAssetsComponent,
        data: { title: "View Modified Assets" }
      },
    ]
  }
];
