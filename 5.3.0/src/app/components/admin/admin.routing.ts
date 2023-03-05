import { Routes } from "@angular/router";
import { MessageComponent } from "./messagesnotification/messages.component";


import { UserCredentialsComponent} from './user-credentials/user-credentials.component';
import {CreateUserComponent} from './create-user/create-user.component';
import {CreateRoleComponent} from './create-role/create-role.component';
import {UserRoleMappingComponent} from './user-role-mapping/user-role-mapping.component';
import { editRoleComponent } from "./edit_role/edit_role.component";
import { RoleAddComponent } from "./role-add/role-add.component";
import {DefaultFilterComponent} from "./defaultfilterconfiguration/filter.component";

import {PolicyComponent} from './policy_definition/policy.component';
import {OtherConfigComponent} from './other_configuration/other.component';
import { EmployeeComponent } from "./employee_data/employee.component";
import {UserRoleRightsMappingComponent} from "./user_roles_Rightsmapping/user-role-rights.component";
import { CutOffComponent } from './cut-off_management/PeriodManagement/cut-off.component';
import {DiscrepancyManagement} from './cut-off_management/DiscrepancyManagement/DiscrepancyManagement.component';
import{ViewDiscrepencyReport} from './cut-off_management/view_discrepency_report/view_discrepency_report.component';
import{NotificationPanelComponent}from './Notification_Panel/Notification_Panel.component';


export const AdminRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "b",
        component: UserCredentialsComponent,
        data: { title: "Manage Credentials" }
      },
      {
        path: "k",
        component: MessageComponent,
        data: { title: "Messages Notification", breadcrumb:"Messages Notification"  }
      },
      {
        path: "a",
        component: DefaultFilterComponent,
        data: { title: "Filter Configuration" }
      },
      {
        path: "e",
        component: CreateUserComponent,
        data: { title: "Create User" }
      },
      {
        path: "h",
        component: EmployeeComponent,
        data: { title: "Employee Data" }
      },
      {
        path: "f",
        component: CreateRoleComponent,
        data: { title: "Create Role"}
      },
      {
        path: "p",
        component: editRoleComponent,
        data: { title: "Edit Role" }
      },
      {
        path: "n",
        component: RoleAddComponent,
        data: { title: "Add Role" }
      },
      {
        path: "userrolemapping",
        component: UserRoleMappingComponent,
        data: { title: "User-Role Mapping" }
      },
      {
        path: "PolicyDefinition",
        component: PolicyComponent,
        data: {title: "Policy Definition"}
      },
      {
        path: "c",
        component: OtherConfigComponent,
        data: {title: "Other Configurations"}
      },
      {
        path: "l",
        component: PolicyComponent,
        data: {title: "License Usage Information"}
      },
      {
        path: "g",
        component: UserRoleRightsMappingComponent,
        data: { title: "User-Role Rights Mapping" }
      },
      {
        path: "d",
        component:CutOffComponent,
        data: { title: "Cut-off Management" }
      },
      {
        path: "m",
        component:DiscrepancyManagement,
        data: { title: "Discrepancy Management" }
      },
      {
        path: "q",
        component:ViewDiscrepencyReport,
        data: { title: "view" }
      },
      {
        path: "r",
        component:NotificationPanelComponent,
        data: { title: "Notification Panel" }
      },
      
    ]
  }
];
