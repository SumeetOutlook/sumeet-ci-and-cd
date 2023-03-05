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
import { DragDropModule } from '@angular/cdk/drag-drop';

import { TransferRoutes } from './transfer.routing';
import { InitiateTransferComponent } from './initiate-transfer/initiate-transfer.component';
import { AssetTransferDialogComponent } from './dialog/asset-transfer-dialog/asset-transfer-dialog.component';
import { AssetTransferVendorDialogComponent } from './dialog/asset-transfer-vendor-dialog/asset-transfer-vendor-dialog.component';
import { TransferApprovalComponent } from './transfer-approval/transfer-approval.component';
import { AssetTransferApprovalDialogComponent } from './dialog/asset-transfer-approval-dialog/asset-transfer-approval-dialog.component';
import { UploadDialogComponent } from './dialog/upload-dialog/upload-dialog.component';


import { PhysicalMovementComponent } from './physical_movement/physical_movement.component';
import { PhysicalAssetTransferComponent } from './physical_movement/physical_asset_transfer_popup/physical_asset_transfer.component';
import { ViewTransitAssetsComponent } from './view_transit_assets/view_transit_assets.component';
import { AssetTransferApprovalDetailsDialogComponent } from './dialog/asset-transfer-approval-details-dialog/asset-transfer-approval-details-dialog.component';
import { AssetTransferSubmitinformationDialogComponent } from './dialog/asset-transfer-submitinformation-dialog/asset-transfer-submitinformation-dialog.component';
import { AssetTransferReinitiateDialogComponent } from './dialog/asset-transfer-reinitiate-dialog/asset-transfer-reinitiate-dialog.component';
import { AssetTransferWithdrawDialogComponent } from './dialog/asset-transfer-withdraw-dialog/asset-transfer-withdraw-dialog.component';
import { ReceiveAssetComponent, InwardDialog } from './receive-asset/receive-asset.component';
import { RevertAssetComponent } from './revert-asset/revert-asset.component';
import { ReceiveAssetDialogComponent } from './dialog/receive-asset-dialog/receive-asset-dialog.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {MatSelectInfiniteScrollModule} from 'ng-mat-select-infinite-scroll';
import { AssetTransferPhysicalWithdrawDialogComponent} from './dialog/asset-transfer-physical-withdraw-dialog/asset-transfer-physical-withdraw-dialog.component';

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
    DragDropModule,
    MatSelectInfiniteScrollModule,
    RouterModule.forChild(TransferRoutes)
  ],
  declarations: [
    InitiateTransferComponent,
    AssetTransferDialogComponent,
    AssetTransferVendorDialogComponent,
    TransferApprovalComponent,
    AssetTransferApprovalDialogComponent,
    UploadDialogComponent, InwardDialog,
    PhysicalMovementComponent,
    PhysicalAssetTransferComponent,
    ViewTransitAssetsComponent,
    AssetTransferApprovalDetailsDialogComponent,
    AssetTransferSubmitinformationDialogComponent,
    AssetTransferReinitiateDialogComponent,
    AssetTransferWithdrawDialogComponent,
    ReceiveAssetComponent,
    RevertAssetComponent,
    ReceiveAssetDialogComponent,
    AssetTransferPhysicalWithdrawDialogComponent
  ],
  exports: [],
  entryComponents: [
    AssetTransferDialogComponent,
    AssetTransferVendorDialogComponent,
    AssetTransferApprovalDialogComponent,
    UploadDialogComponent
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: dtFORMAT }]

})
export class TransferModule { }