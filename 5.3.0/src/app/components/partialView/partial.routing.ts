import { Routes } from "@angular/router";
import { assetTabsComponent } from "./assetDetails/asset_tabs.component";


export const PartialRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "asset_Details",
        component: assetTabsComponent,
        data: { title: "Asset Details" }
      }
    ]
  }
];
