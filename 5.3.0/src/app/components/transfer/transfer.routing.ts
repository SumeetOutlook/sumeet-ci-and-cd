import { Routes } from "@angular/router";
import { InitiateTransferComponent } from './initiate-transfer/initiate-transfer.component';
import { TransferApprovalComponent } from './transfer-approval/transfer-approval.component';
import { PhysicalMovementComponent } from "./physical_movement/physical_movement.component";
import { ViewTransitAssetsComponent} from './view_transit_assets/view_transit_assets.component';
import { ReceiveAssetComponent } from './receive-asset/receive-asset.component';
import { RevertAssetComponent } from './revert-asset/revert-asset.component';

export const TransferRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "a",
        component: InitiateTransferComponent,
        data: { title: "Initiate Transfer" }
      },    
      {
        path: "b",
        component: TransferApprovalComponent,
        data: { title: "Transfer Approval" }
      },    
     {
        path: "c",
        component: PhysicalMovementComponent,
        data: { title: "Physical Movement" }
      }, 
      {
        path: "d",
        component: ViewTransitAssetsComponent,
        data: { title: "View Transit Assets" }
      },
      {
        path: "e",
        component: ReceiveAssetComponent,
        data: { title: "Receive Asset" }
      },
      {
        path: "f",
        component: RevertAssetComponent,
        data: { title: "Revert Asset" }
      },
    ]
  }
];
