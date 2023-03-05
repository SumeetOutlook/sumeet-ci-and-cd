import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { FlexLayoutModule } from '@angular/flex-layout';
import { RelationshipRoutes } from './relation.routing';
import { AssetRelationshipComponent } from './asset_relationship/asset.component';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedMaterialModule } from '../../shared/shared-material.module';
import { ManageGroupComponent } from './manage_group/manage.component';
import { FilterPopupComponent } from './manage_group/filter_Popup/filter_Popup.component';
import { TablecolumComponent } from './manage_group/tablecolum-Popup/tablecolum-Popup.component';
import { ComponentSplitDialogComponent } from './dialog/component-split-dialog/component-split-dialog.component';
import { CreateGroupDialogComponent } from './dialog/create-group-dialog/create-group-dialog.component';
//import { SelectCheckAllComponent } from '../../select-check-all.component';
import {MatSelectInfiniteScrollModule} from 'ng-mat-select-infinite-scroll';

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
    NgxDatatableModule,
    MatSelectInfiniteScrollModule,
    RouterModule.forChild(RelationshipRoutes)
  ],
  declarations: [AssetRelationshipComponent,
    ManageGroupComponent,
    FilterPopupComponent,
    TablecolumComponent,
    ComponentSplitDialogComponent,
    CreateGroupDialogComponent,
    //SelectCheckAllComponent
  ]
})
export class AssetRelationshipModule { }