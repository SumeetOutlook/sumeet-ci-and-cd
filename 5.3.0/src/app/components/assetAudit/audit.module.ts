import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";

import { FlexLayoutModule } from '@angular/flex-layout';
import { AuditRoutes } from './audit.routing';

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
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedMaterialModule } from '../../shared/shared-material.module';

import { ApprovetaggingComponent } from './approveTagging/approvetagging.component';
import { ReviewDialogComponent } from './approveTagging/review_dialog/review-dialog.component';
// import {MapDialogComponent} from './approveTagging/map_dialog/map-dialog.component';
import { MapadditionalDialogComponent } from './approveTagging/mapadditional_dialog/mapadditional-dialog.component';
import { MapadditionalassetDialogComponent } from './approveTagging/mapadditionalAsset_dialog/mapadditionalasset-dialog.component';
import { ApproveRejectComponent } from './approveTagging/approve_reject_popup/approvereject.component';
import { CreateProjectComponent } from './create_project/create_project.component';
import { UpdateAuditRightsMappingDialogComponent } from './create_project/update_audit_rights_mapping_dialog/update_audit_rights_mapping_dialog.component';
import { tablecolumComponent } from './create_project/tablecolum-popup/tablecolum-popup.component';
import { SendForReconciliationComponent } from './send_for_reconciliation/send_for_reconciliation.component';
import { AssetClassWiseInventoryStatusDialogComponent } from './send_for_reconciliation/asset_class_wise_inventory_status_dialog/asset_class_wise_inventory_status_dialog.component';
import { PrintTagComponent } from './print-tag/prtint-tag.component';
import { AddprinttagDialogComponent } from './print-tag/Addprinttag/Addprinttag-dialog.component';
import { InventorySeriesDialogComponent } from './print-tag/Inventoryseries/Inventoryseries-dialog.component';
import { AdditionalassetsComponent } from './additionalassets/additionalassets.component';
import { InventoryStatusComponent } from './inventory-status/inventory-status.component';
import { CloseProjectComponent } from './close-project/close-project.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

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
import{MissingAssetComponent} from './missing_assets/missing-asset.component';
import { SendMailCategoryownerDialogComponent } from './missing_assets/send-mail-categoryowner-dialog/send-mail-categoryowner-dialog.component';
import { ProjectDetailsDialogComponent } from './close-project/project-details-dialog/project-details-dialog.component';
import { AdditionalTaggingAssetsComponent } from './additional-tagging-assets/additional-tagging-assets.component';
import { ReprintTagsComponent } from './reprint-tags/reprint-tags.component';
import { TagstatusReportComponent } from './tagstatus-report/tagstatus-report.component';
import { ViewModifiedAssetsComponent } from './view-modified-assets/view-modified-assets.component';
import { ViewModifiedDialogComponent } from './view-modified-assets/view-modified-dialog/view-modified-dialog.component';
import {MatSelectInfiniteScrollModule} from 'ng-mat-select-infinite-scroll';
import { TypeUploadDialogComponent } from './create_project/type_upload_dialog/type-upload-dialog.component';
import { AdditionalRejectPopupComponent } from './additional-tagging-assets/additional-reject-popup/additional-reject-popup.component';

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
    DragDropModule,
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
    RouterModule.forChild(AuditRoutes),


  ],
  declarations: [ApprovetaggingComponent,
    ReviewDialogComponent,
    // MapDialogComponent,
    MapadditionalDialogComponent,
    MapadditionalassetDialogComponent,
    ApproveRejectComponent,
    CreateProjectComponent,
    UpdateAuditRightsMappingDialogComponent,
    tablecolumComponent,
    SendForReconciliationComponent,
    AssetClassWiseInventoryStatusDialogComponent,
    PrintTagComponent,
    AddprinttagDialogComponent,
    AdditionalassetsComponent,
    InventoryStatusComponent,
    InventorySeriesDialogComponent,
    CloseProjectComponent, 
    MissingAssetComponent,
    SendMailCategoryownerDialogComponent,
    ProjectDetailsDialogComponent,
    AdditionalTaggingAssetsComponent,
    ReprintTagsComponent,
    TagstatusReportComponent,
    ViewModifiedAssetsComponent,
    ViewModifiedDialogComponent,
    TypeUploadDialogComponent,
    AdditionalRejectPopupComponent,
   
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: dtFORMAT }]
})
export class AuditModule { }