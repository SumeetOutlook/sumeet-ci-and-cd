import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartsPageComponent } from './parts-page/parts-page.component';
import { AddAssignConfigurationComponent } from './create-configuration/add-assign-configuration.component';
import { CreateWorkOrderComponent } from './create-work-order/create-work-order.component';
import { TechnicianRateHistoryComponent } from './technician-rate-history/technician-rate-history.component';
import { CreateIssueComponent } from './create-issue/create-issue.component';
import { CostConfigurationComponent } from './cost-configuration/cost-configuration.component';
import { PartsInventoryComponent } from './parts-inventory/parts-inventory.component';
import { HoursSpentComponent } from './hours-spent/hours-spent.component';
import { TechnicianWiseReportComponent } from './hours-spent/technician-wise-report/technician-wise-report.component';
import { IssueWiseReportComponent } from './hours-spent/issue-wise-report/issue-wise-report.component';
import { WorkorderTicketApprovalComponent } from './workorder-ticket-approval/workorder-ticket-approval.component';
import { DummyComponentComponent } from './hours-spent/dummy-component/dummy-component.component';

export const CmmsRoutes: Routes = [
    {
      path: "",
      children: [
        {
          path: "a",
          component: CreateIssueComponent,
          data: { title: "Create Issue" }
        },
        {
          path: "b",
          component: PartsPageComponent,
          data: { title: "Parts Page" }
        },
        {
          path: "c",
          component: AddAssignConfigurationComponent,
          data: { title: "Add Assign Config" }
        },
        {
          path: "d",
          component: CreateWorkOrderComponent,
          data: { title: "Create Work Order" }
        },
        {
          path: "e",
          component: TechnicianRateHistoryComponent,
          data: { title: "Technician Rate History" }
        },
        {
          path: "f",
          component: CostConfigurationComponent,
          data: { title: "Cost Configuration" }
        },
        {
          path: "g",
          component: PartsInventoryComponent,
          data: { title: "Parts Inventory" }
        },
        {
          path: "h",
          component: HoursSpentComponent,
          data: { title: "Hours Spent on Work" }
        },
        {
          path: "j",
          component: TechnicianWiseReportComponent,
          data: { title: "Technician Wise Report" }
        },
        {
          path: "i",
          component: IssueWiseReportComponent,
          data: { title: "Issue Wise Report" }
        },
        {
          path: "k",
          component: WorkorderTicketApprovalComponent,
          data: { title: "Work Order Ticket Approval" }
        },
        {
          path: "l",
          component: DummyComponentComponent,
          data: { title: "dummy" }
        }
      ]
    }
    ];