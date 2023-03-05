import { Routes } from "@angular/router";
import { InitiateRetirementComponent } from './initiate-retirement/initiate-retirement.component';
import { RetirementApprovalComponent } from './retirement-approval/retirement-approval.component';
import { PhysicalDisposalComponent } from './physical-disposal/physical-disposal.component';

export const RetirementRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "a",
        component: InitiateRetirementComponent,
        data: { title: "Initiate Retirement" }
      },
      {
        path: "b",
        component: RetirementApprovalComponent,
        data: { title: "Retirement Approval" }
      }    ,
      {
        path: "c",
        component: PhysicalDisposalComponent,
        data: { title: "Physical Disposal" }
      }  
    ]
  }
];
