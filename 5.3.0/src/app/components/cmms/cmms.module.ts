import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatSortModule } from '@angular/material/sort'
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { FileUploadModule } from 'ng2-file-upload';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedMaterialModule } from '../../shared/shared-material.module';
import { CmmsRoutes } from './cmms.routing';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { PartsPageComponent } from './parts-page/parts-page.component';
import { PartsDialogComponent } from './dialogs/parts-dialog/parts-dialog.component';
import { AddAssignConfigurationComponent } from './create-configuration/add-assign-configuration.component';
import { CreateWorkOrderComponent } from './create-work-order/create-work-order.component';
import { CreateWorkorderDialogComponent } from './dialogs/create-workorder-dialog/create-workorder-dialog.component';
import { TechnicianRateHistoryComponent } from './technician-rate-history/technician-rate-history.component';
import { AddEditTechnicianRateDialogComponent } from './dialogs/add-edit-technician-rate-dialog/add-edit-technician-rate-dialog.component';
import { CreateIssueComponent } from './create-issue/create-issue.component';
import { AddEditIssueDialogComponent } from './dialogs/add-edit-issue-dialog/add-edit-issue-dialog.component';
import { AddEditConfigurationComponent } from './dialogs/add-edit-configuration/add-edit-configuration.component';
import { CostConfigurationComponent } from './cost-configuration/cost-configuration.component';
import { CostConfigDialogComponent } from './dialogs/cost-config-dialog/cost-config-dialog.component';
import { PartsInventoryComponent } from './parts-inventory/parts-inventory.component';
import { PartsInventoryDialogComponent } from './dialogs/parts-inventory-dialog/parts-inventory-dialog.component';
import { WorkorderTypeDialogComponent } from './dialogs/workorder-type-dialog/workorder-type-dialog.component';
import {MatStepperModule} from '@angular/material/stepper';
import { HoursSpentComponent } from './hours-spent/hours-spent.component';
import { ChartsModule } from 'ng2-charts';
import { TechnicianWiseReportComponent } from './hours-spent/technician-wise-report/technician-wise-report.component';
import { IssueWiseReportComponent } from './hours-spent/issue-wise-report/issue-wise-report.component';
import { ExtraFiltersComponent } from './dialogs/extra-filters/extra-filters.component';
import { WorkorderTicketApprovalComponent } from './workorder-ticket-approval/workorder-ticket-approval.component';
import { DummyComponentComponent } from './hours-spent/dummy-component/dummy-component.component';
import * as CanvasJSAngularChart from '../../shared/charts/canvasjs.angular.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
var CanvasJSChart = CanvasJSAngularChart.CanvasJSChart;
export const dtFORMAT = {
    parse: {
      dateInput: "DD-MMM-YYYY"
    },
    display: {
      dateInput: "DD-MMM-YYYY",
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: "DD-MMM-YYYY",
      monthYearA11yLabel: 'MMMM YYYY',
    }
  };

  @NgModule({
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MatButtonModule,
      FlexLayoutModule,
      PerfectScrollbarModule,
      MatSelectModule,
      MatIconModule,
      MatCardModule,
      MatDividerModule,
      MatToolbarModule,
      MatTooltipModule,
      NgxMatSelectSearchModule,
      MatPaginatorModule,
      MatDialogModule,
      FileUploadModule,
      MatTableModule,
      MatFormFieldModule,
      MatInputModule,
      MatSortModule,
      MatListModule,
      MatCheckboxModule,
      MatMenuModule,
      MatExpansionModule,
      MatSidenavModule,
      HttpClientModule,
      SharedMaterialModule,
      MatStepperModule,
      ChartsModule,
      NgxChartsModule,
      RouterModule.forChild(CmmsRoutes)
    ],
    declarations: [
                   PartsPageComponent,
                   PartsDialogComponent,
                  AddAssignConfigurationComponent,
                  CreateWorkOrderComponent,
                  CreateWorkorderDialogComponent,
                  TechnicianRateHistoryComponent,
                  AddEditTechnicianRateDialogComponent,
                  CreateIssueComponent,
                  AddEditIssueDialogComponent,
                  AddEditConfigurationComponent,
                  CostConfigurationComponent,
                  CostConfigDialogComponent,
                  PartsInventoryComponent,
                  PartsInventoryDialogComponent,
                  WorkorderTypeDialogComponent,
                  HoursSpentComponent,
                  TechnicianWiseReportComponent,
                  IssueWiseReportComponent,
                  ExtraFiltersComponent,
                  WorkorderTicketApprovalComponent,
                  DummyComponentComponent,
                  CanvasJSChart
                  ],
                  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    exports: [],
    entryComponents: [
  
    ],
    providers: [
      { provide: MAT_DATE_FORMATS, useValue: dtFORMAT }]
  })

  export class CmmsModule { }