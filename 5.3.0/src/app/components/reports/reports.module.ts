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
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ReportRoutes } from './reports.routing';

import { SharedMaterialModule } from '../../shared/shared-material.module';
import {tablecolumComponent} from './outbound_pending_assets/tablecolum-popup/tablecolum-popup.component';
import {Outbound_Pending_AssetsComponent} from './outbound_pending_assets/outbound_pending_assets.component';
import { DamageorNotinUsedComponent } from './damageor-notin-used/damageor-notin-used.component';

import { AssetDispatchedReportComponent } from './asset-dispatched-report/asset-dispatched-report.component';
import { AssetTransferReportComponent } from './asset-transfer-report/asset-transfer-report.component';

import {InventoryReportComponent} from './inventory_report/inventory_report.component';
import { AssetRetirementReportComponent } from './asset-retirement-report/asset-retirement-report.component';
import { VerifyOnlyAssetsComponent } from './verify-only-assets/verify-only-assets.component';
import { NonVerifyAssetComponent } from './non-verify-asset/non-verify-asset.component';
import { ReportTaggingComponent } from './report-tagging/report-tagging.component';
import { FilterPopupComponent } from './report-tagging/filter-popup/filter-popup.component';
import {AssetRetirementHistoryReportComponent} from './asset-retirementHistory-report/asset-retirement-history-report.component';
import { AssetRegisterComponent } from './asset_register/asset_register.component';
import { AllocationReportComponent } from './Allocation_Report/Allocation_Report.component';
import { HardwareDiscoveryReportComponent } from './itam/hardware-discovery-report/hardware-discovery-report.component';
import { HardwareChangeReportComponent } from './itam/hardware-change-report/hardware-change-report.component';
import { SoftwareInformationReportComponent } from './itam/software-information-report/software-information-report.component';
import { SoftwareExpiryReportComponent } from './itam/software-expiry-report/software-expiry-report.component';
import { ElpReportComponent } from './itam/elp-report/elp-report.component';
import { MannualMappingDialogComponent } from './dialog/mannual-mapping-dialog/mannual-mapping-dialog.component';
import { AutomationMappingDialogComponent } from './dialog/automation-mapping-dialog/automation-mapping-dialog.component';
import { ReviewMappingDialogComponent } from './dialog/review-mapping-dialog/review-mapping-dialog.component';
import { ViewuploadDocregisterDialogComponent } from './asset_register/viewupload-docregister-dialog/viewupload-docregister-dialog.component';

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
    DragDropModule,
    RouterModule.forChild(ReportRoutes)
  ],
  declarations: [tablecolumComponent,
    Outbound_Pending_AssetsComponent,
    AssetDispatchedReportComponent,
    AssetTransferReportComponent,
    AssetRetirementReportComponent,
    VerifyOnlyAssetsComponent,
    NonVerifyAssetComponent,
    ReportTaggingComponent,
    FilterPopupComponent ,
    AssetRegisterComponent,
    
    AssetRetirementReportComponent , DamageorNotinUsedComponent,
    AssetRetirementHistoryReportComponent,InventoryReportComponent,AllocationReportComponent, HardwareDiscoveryReportComponent, HardwareChangeReportComponent, SoftwareInformationReportComponent, SoftwareExpiryReportComponent, ElpReportComponent, MannualMappingDialogComponent, AutomationMappingDialogComponent, ReviewMappingDialogComponent, ViewuploadDocregisterDialogComponent],
    providers: [
      { provide: MAT_DATE_FORMATS, useValue: dtFORMAT }]
})
// providers: [
//   { provide: MAT_DATE_FORMATS, useValue: dtFORMAT }]
export class ReportModule { }