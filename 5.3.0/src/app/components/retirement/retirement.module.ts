import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgModule } from '@angular/core';
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

import { RetirementRoutes } from './retirement.routing';
import { InitiateRetirementComponent } from './initiate-retirement/initiate-retirement.component';
import { AssetRetirementDialogComponent } from './dialog/asset-retirement-dialog/asset-retirement-dialog.component';
import { UploadDialogComponent } from './dialog/upload-dialog/upload-dialog.component';
import { RetirementApprovalComponent } from './retirement-approval/retirement-approval.component';
import { RetirementApprovalDialogComponent } from './dialog/retirement-approval-dialog/retirement-approval-dialog.component';
import { RetirementWithdrawDialogComponent } from './dialog/retirement-withdraw-dialog/retirement-withdraw-dialog.component';
import { RetirementApprovalDetailsDialogComponent } from './dialog/retirement-approval-details-dialog/retirement-approval-details-dialog.component';
import { RetireSubmitinformationDialogComponent } from './dialog/retire-submitinformation-dialog/retire-submitinformation-dialog.component';
import { RetireReinitiateDialogComponent } from './dialog/retire-reinitiate-dialog/retire-reinitiate-dialog.component';
import { PhysicalDisposalComponent } from './physical-disposal/physical-disposal.component';
import { PhysicalDisposalDialogComponent } from './dialog/physical-disposal-dialog/physical-disposal-dialog.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {MatSelectInfiniteScrollModule} from 'ng-mat-select-infinite-scroll';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {RetirementDisposalWithdrawDialogComponent} from './dialog/retirement-disposal-withdraw-dialog/retirement-disposal-withdraw-dialog.component';

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
    DragDropModule,
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
    MatSelectInfiniteScrollModule,
    RouterModule.forChild(RetirementRoutes)
  ],
  declarations: [
  InitiateRetirementComponent,
  AssetRetirementDialogComponent,
  UploadDialogComponent,
  RetirementApprovalComponent,
  RetirementApprovalDialogComponent,
  RetirementWithdrawDialogComponent,
  RetirementApprovalDetailsDialogComponent,
  RetireSubmitinformationDialogComponent,
  RetireReinitiateDialogComponent,
  PhysicalDisposalComponent,
  PhysicalDisposalDialogComponent,
  RetirementDisposalWithdrawDialogComponent],
  exports: [],
  entryComponents: [

  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: dtFORMAT }]


})
export class RetirementModule { }