import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTreeModule } from "@angular/material/tree";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ChartsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { MatCheckboxModule } from '@angular/material/checkbox'
import * as echarts from 'echarts';
import { UserCredentialsComponent } from './user-credentials/user-credentials.component';
import { MessageComponent } from './messagesnotification/messages.component';

import { SharedMaterialModule } from '../../shared/shared-material.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { DefaultFilterComponent } from './defaultfilterconfiguration/filter.component';
import { FilterDefault_DialogComponent } from './defaultfilterconfiguration/filter_dialog/filter_dialog.component';
import { DefaultFieldsComponent } from './defaultfilterconfiguration/field_dialog/field_dialog.component';
import { UserRoleMappingComponent } from './user-role-mapping/user-role-mapping.component';
import { CreateRoleComponent } from './create-role/create-role.component';
import { CreateUserComponent } from './create-user/create-user.component';

import { CdkStepperModule } from '@angular/cdk/stepper';
import { ToastrModule } from 'ngx-toastr';

import { FlexLayoutModule } from '@angular/flex-layout';
import { AdminRoutes } from './admin.routing';

import { addUserDialogComponent } from './create-user/add_user_dialog/add_user_dialog.component';
import { editUserDialogComponent } from './create-user/edit_user_dialog/edit_user_dialog.component';
import { RoleAddComponent } from './role-add/role-add.component';
import { editRoleComponent } from './edit_role/edit_role.component';
import { LocationListDialogComponent } from './create-role/location-list-dialog/location-list-dialog.component';
import { UploadUserComponent } from './create-user/Upload_user_dialog/Upload_user.component';

import { PolicyComponent } from './policy_definition/policy.component';
import { ViewRoleDialogComponent } from './create-user/view_role_dialog/viewrole.component';
import { ViewDialogComponent } from './role-add/view_dialog/view.component';
import { EmployeeComponent } from './employee_data/employee.component'
import { UploadEmployeePopUpComponent } from './employee_data/emp_upload_dialog/emp_model_popup.component';
import { CreateEmployeeDialogComponent } from './employee_data/emp_add_edit_dialog/emp-dialog.component';
import { OtherConfigComponent } from './other_configuration/other.component';
import { UserRoleRightsMappingComponent } from './user_roles_Rightsmapping/user-role-rights.component';
import { Role_dialogComponent } from './user_roles_Rightsmapping/role_add_edit_dialog/role_dialog.component';
import { User_dialogComponent } from './user_roles_Rightsmapping/user_add_edit_dialog copy/user_dialog.component';
import { CutOffComponent } from './cut-off_management/PeriodManagement/cut-off.component';
import { FreezedialogComponent } from './cut-off_management/PeriodManagement/freeze_edit_dialog/freeze.component';
import { PerioddialogComponent } from './cut-off_management/PeriodManagement/period_edit_dialog/period.component';
import { DiscrepancyManagement } from './cut-off_management/DiscrepancyManagement/DiscrepancyManagement.component';
import { ViewDiscrepencyReport } from './cut-off_management/view_discrepency_report/view_discrepency_report.component';
import { NotificationPanelComponent } from './Notification_Panel/Notification_Panel.component';
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatTabsModule,
    MatTableModule,
    MatGridListModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTreeModule,
    MatAutocompleteModule,
    SharedMaterialModule,
    FlexLayoutModule,
    ChartsModule,
    MatCheckboxModule,
    CdkStepperModule,
    NgxMatSelectSearchModule,
    // NgxEchartsModule.forRoot({
    //   echarts
    // }),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    PerfectScrollbarModule,
    DragDropModule,
    MatSelectInfiniteScrollModule,
    InfiniteScrollModule,
    ToastrModule.forRoot({ closeButton: true, progressBar: true }),
    RouterModule.forChild(AdminRoutes)
  ],
  declarations: [UserCredentialsComponent,
    MessageComponent,
    DefaultFilterComponent,
    FilterDefault_DialogComponent,
    DefaultFieldsComponent,
    UserRoleMappingComponent,
    CreateRoleComponent,
    CreateUserComponent,
    addUserDialogComponent,
    editUserDialogComponent,
    RoleAddComponent,
    editRoleComponent,
    LocationListDialogComponent,
    UploadUserComponent,
    PolicyComponent,
    ViewRoleDialogComponent,
    ViewDialogComponent,
    EmployeeComponent,
    UploadEmployeePopUpComponent,
    CreateEmployeeDialogComponent,
    OtherConfigComponent,
    UserRoleRightsMappingComponent,
    Role_dialogComponent,
    User_dialogComponent,
    CutOffComponent,
    PerioddialogComponent,
    FreezedialogComponent,
    DiscrepancyManagement,
    ViewDiscrepencyReport,
    NotificationPanelComponent
  ]
})
export class AdminModule { }