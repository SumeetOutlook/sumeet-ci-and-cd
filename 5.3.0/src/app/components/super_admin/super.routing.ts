import { Routes } from "@angular/router";
import {FilterComponent} from './availablefilterconfiguration/filter.component';
import { CreateModulePermissionComponent } from "./create_module_permissions/create_module_permissions.component";
import {MandatoryNonmandatoryComponent} from './mandatory-nonmandatory/mandatory-nonmandatory.component';
import { OtherConfigComponent } from "./otherconfig/otherconfig.component";
import { RulesEngineAddComponent } from "./rulesengine/rules-engine-add/rules-engine-add.component";
import { RulesEngineListComponent } from "./rulesengine/rules-engine-list/rules-engine-list.component";
import {LicenseManagmentComponent} from "./License-Managment/License-Managment.component";
import { LicenseComponent } from './license/license.component';
import { SSOApprovalConfigurationComponent } from './sso-approval-configuration/sso-approval-configuration.component';
import { LicenseUtilizationComponent } from './license-utilization/license-utilization.component';
import { ViewFieldComponent } from "./standard-view-mapping/standard-view-mapping.component";
import { CustomViewMappingComponent } from "./custom-view-mapping/custom-view-mapping.component";
import { ViewPageCreationComponent } from "./view-page-creation/view-page-creation.component";

export const SuperAdminRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "mandatory-non mandatory",
        component: MandatoryNonmandatoryComponent,
        data: { title: "Mandatory-Non Mandatory" }
      },
      {
          path: "filterandfieldsconfiguration",
          component: FilterComponent,
        data: { title: "Filter / Field Configuration"}
      },
      {
        path: "create_module_permission",
        component: CreateModulePermissionComponent,
        data: { title: "create_module_permission"}
      },
      {
        path: "other_configuration",
        component: OtherConfigComponent,
        data: { title: "other_configuration"}
      },
      {
        path: "rules-engine-add",
        component: RulesEngineAddComponent,
        data: { title: "Rules Engine ADD"}
      },
      {
          path: "rules-engine-list",
          component: RulesEngineListComponent,
          data: { title: "Rules Engine List"}
      },
      {
        path: "LicenseManagment",
        component: LicenseManagmentComponent,
        data: { title: "License Managment" }
      },
      {
        path: "License",
        component: LicenseComponent,
        data: { title: "License" }
      },
      {
        path: "SSO-Approval-Configuration",
        component: SSOApprovalConfigurationComponent,
        data: { title: "SSO Approval Configuration" }
      },
      {
        path: "LicenseUtilization",
        component: LicenseUtilizationComponent,
        data: { title: "license-utilization" }
      },
      {
      path: "View_Field",
      component: ViewFieldComponent,
      data: { title: "View Field" }
    },
    {
      path: "custom_view_mapping",
      component: CustomViewMappingComponent,
      data: { title: "custom view mapping" }
    },
    {
      path: "view_page_creation",
      component: ViewPageCreationComponent,
      data: { title: "view page creation" }
    },
    ]
  }
];
