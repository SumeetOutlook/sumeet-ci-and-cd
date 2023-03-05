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
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedMaterialModule } from '../../shared/shared-material.module';
import { PartialRoutes } from './partial.routing'
import { assetTabsComponent } from './assetDetails/asset_tabs.component';
import { GetFieldsComponent } from './get-fields/get-fields.component';
import { ViewUploadDocumentsDialogComponent } from './view-upload-documents-dialog/view-upload-documents-dialog.component'
import { OrderModule } from 'ngx-order-pipe';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { ExportFieldsComponent } from './export-fields/export-fields.component';
import { MultiSearchDialogComponent } from './multi-search-dialog/multi-search-dialog.component';


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
    OrderModule,
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
    RouterModule.forChild(PartialRoutes)
  ],
  declarations: [
    assetTabsComponent,
    GetFieldsComponent,
    ViewUploadDocumentsDialogComponent,
    GroupDetailsComponent,
    ExportFieldsComponent,
    MultiSearchDialogComponent
  ],
  providers: []
})
export class PartialModule { }