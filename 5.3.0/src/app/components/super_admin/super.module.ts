import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import {DragDropModule} from '@angular/cdk/drag-drop';

import { FlexLayoutModule } from '@angular/flex-layout';
 import { SuperAdminRoutes } from './super.routing';

import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import{MatCheckboxModule} from '@angular/material/checkbox'
import{MatSortModule} from '@angular/material/sort'
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule  } from '@angular/material/input';
import{MatCardModule} from '@angular/material/card';
import{MatToolbarModule} from '@angular/material/toolbar';
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule } from '@angular/common/http';

import { MatExpansionModule } from '@angular/material/expansion';
import {FileUploadModule} from 'ng2-file-upload';
import { MatSidenavModule } from '@angular/material/sidenav';

import { SharedMaterialModule } from '../../shared/shared-material.module';
import {FilterComponent} from './availablefilterconfiguration/filter.component';
import {FieldsComponent} from './availablefilterconfiguration/field_dialog/field_dialog.component';
import {Filter_DialogComponent} from './availablefilterconfiguration/filter_dialog/filter_dialog.component';
import { MandatoryNonmandatoryComponent } from './mandatory-nonmandatory/mandatory-nonmandatory.component';
import { CreateModulePermissionComponent } from './create_module_permissions/create_module_permissions.component';
import {OtherConfigComponent} from './otherconfig/otherconfig.component';
import { RulesEngineAddComponent } from "./rulesengine/rules-engine-add/rules-engine-add.component";
import { RulesEngineListComponent } from "./rulesengine/rules-engine-list/rules-engine-list.component";
import {LicenseManagmentComponent} from "./License-Managment/License-Managment.component";
import { LicenseComponent } from './license/license.component';
import { AddLicenseDialogComponent } from './License-Managment/dialog/add-license-dialog/add-license-dialog.component';
import { SSOApprovalConfigurationComponent } from './sso-approval-configuration/sso-approval-configuration.component';
import { EditLicenseDialogComponent } from './License-Managment/dialog/edit-license-dialog/edit-license-dialog.component';
import { LicenseUtilizationComponent } from './license-utilization/license-utilization.component';
import { ViewFieldComponent } from './standard-view-mapping/standard-view-mapping.component';
import { FieldDialogPopupComponent } from './standard-view-mapping/field-dialog-popup/field-dialog-popup.component';

import { CustomViewMappingComponent } from './custom-view-mapping/custom-view-mapping.component';
import { ViewPageCreationComponent } from './view-page-creation/view-page-creation.component';
import { ViewFieldPopupComponent } from './view-page-creation/view-field-popup/view-field-popup.component';
import { CreateDuplicateDialogComponent } from './custom-view-mapping/create-duplicate-dialog/create-duplicate-dialog.component';
import { EditFieldComponent } from './custom-view-mapping/edit-field/edit-field.component';
import { ViewfieldComponent } from './custom-view-mapping/viewfield/viewfield.component';
import { UploadFileDialogComponent } from './sso-approval-configuration/upload-file-dialog/upload-file-dialog.component';
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
    RouterModule.forChild(SuperAdminRoutes)
  ],
  declarations: [FilterComponent,
    FieldsComponent,
    Filter_DialogComponent,
    MandatoryNonmandatoryComponent,
    CreateModulePermissionComponent,
    OtherConfigComponent,
    RulesEngineAddComponent,
    RulesEngineListComponent,
    LicenseManagmentComponent,
    LicenseComponent,
    AddLicenseDialogComponent,
    SSOApprovalConfigurationComponent,
    EditLicenseDialogComponent,
    LicenseUtilizationComponent,
    ViewFieldComponent,
    FieldDialogPopupComponent,
    CustomViewMappingComponent,
    ViewPageCreationComponent,
    ViewFieldPopupComponent,
    CreateDuplicateDialogComponent,
    EditFieldComponent,
    ViewfieldComponent,
    UploadFileDialogComponent
   ],
   
})
export class SuperAdminModule { }