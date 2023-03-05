import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { FlexLayoutModule } from '@angular/flex-layout';
import { AssetsRoutes } from './assets.routing';
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
import { CreateAssetsComponent } from './create_asset/create_assets.component';
import { UploadAssetRegisterComponent } from './create_asset/UploadAssetRegister_popup/UploadAssetRegister.component';
import { MapColumnsPopupComponent } from './create_asset/mapcolumns_popup/mapcolumns_popup.component';
import { ReviewAssetComponent } from './review_assets/review.component';
import { EditAssetPopupComponent } from './review_assets/edit_popup/edit_popup.component';
import { ApproveRejectComponent } from './review_assets/approve_reject_popup/approvereject.component';
import { EditAssetComponent } from './edit_asset/edit_asset.component';
import { UpdateAssetRegisterComponent } from './edit_asset/UpdateAssetRegister_popup/UpdateAssetRegister.component';
import { DatePipe } from '@angular/common';
import { MessageAlertComponent } from '../../shared/services/app-msg-alert/app-msg.component';
import { EditAssetDialogComponent } from './edit_popup/edit_popup.component';
import { EditReviewComponent } from './edit_review_asset/edit_review.component'
import { CreateAssetPopupComponent } from './CreateAsset_popup/createasset_popup.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AddCommentDialogComponent } from './edit_review_asset/add-comment-dialog/add-comment-dialog.component';
import { CreateFARAssetComponent } from './create-farasset/create-farasset.component';
import { CreateFARAssetPopupComponent } from './create-farasset-popup/create-farasset-popup.component';
import { ComponentSpiltDialogComponent } from './edit_asset/component-spilt-dialog/component-spilt-dialog.component';
import { CreateGroupDialogComponent } from './edit_asset/create-group-dialog/create-group-dialog.component';
import { MapFarAssetDialogComponent } from './create-farasset/map-far-asset-dialog/map-far-asset-dialog.component';
import { UploadFarAssetDialogComponent } from './create-farasset/upload-far-asset-dialog/upload-far-asset-dialog.component';
import {MatSelectInfiniteScrollModule} from 'ng-mat-select-infinite-scroll';

export const dtFORMAT = {
  parse: {
    dateInput: "DD-MM-YYYY",
  },
  display: {
    dateInput: "DD-MMM-YYYY",
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: "DD-MMM-YYYY",
    monthYearA11yLabel: 'MMM YYYY',
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
    RouterModule.forChild(AssetsRoutes)
  ],
  declarations: [
    CreateAssetsComponent,
    UploadAssetRegisterComponent,
    MapColumnsPopupComponent,
    ReviewAssetComponent,
    EditAssetPopupComponent,
    ApproveRejectComponent,
    EditAssetComponent,
    UpdateAssetRegisterComponent,
    // CreateGroupDialogComponent,
    // ComponentSplitDialogComponent,
    MessageAlertComponent,
    EditAssetDialogComponent,
    EditReviewComponent,
    CreateAssetPopupComponent,
    AddCommentDialogComponent,
    CreateFARAssetComponent,
    CreateFARAssetPopupComponent,
    ComponentSpiltDialogComponent,
    CreateGroupDialogComponent,
    MapFarAssetDialogComponent,
    UploadFarAssetDialogComponent
  ],
  providers: [DatePipe,
    { provide: MAT_DATE_FORMATS, useValue: dtFORMAT },]
})
export class AssetsModule { }