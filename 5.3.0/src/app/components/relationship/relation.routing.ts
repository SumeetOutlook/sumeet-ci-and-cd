import { Routes } from "@angular/router";
import { AssetRelationshipComponent } from "./asset_relationship/asset.component";
import {ManageGroupComponent} from "./manage_group/manage.component";

export const RelationshipRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "a",
        component: AssetRelationshipComponent,
        data: { title: "Asset Relationship" }
      },
      {
        path: "b",
        component: ManageGroupComponent,
        data: { title: "Manage Group" }
      },
    ]
  }
];
