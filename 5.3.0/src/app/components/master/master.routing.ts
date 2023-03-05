import { Routes } from "@angular/router";
import { SbuComponent } from './sbu/sbu.component';
import { SBULocationStorageLocationComponent } from './sbu-location/sbu_location.component';
import {AssetMasterComponent} from './asset_master/asset_master.component';
import {CategoryAssetclassMapComponent} from './category&assetclass_mapping/mapping.component';
import { CurrencyComponent } from "./currency/currency.component";
import {TagMasterComponent} from './tag_master/tag_master.component';
import {AssetClassComponent} from './asset_class/asset_class.component';
import {DefineseriesComponent } from './defineseries/defineseries.component';
import { CategoryTypeSubtypeComponent } from "./category_type_subtype/category_type_subtype.component";
import {GroupComponent} from './group/group.component';
 
export const MasterRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "sbu",
        component: SbuComponent,
        data: { title: "sbu" }
      },    
      {
        path: "g",
        component: SBULocationStorageLocationComponent,
        data: { title: "SBU_location" }
      },
      {
        path: "h",
        component: AssetMasterComponent,
        data: { title: "Other Masters" }
      },
      {
        path: "c",
        component:CategoryAssetclassMapComponent,
        data: { title: "Category and Asset Class Mapping" }
      },
      {
        path: "i",
        component:CurrencyComponent,
        data: { title: "Currency" }
      },
      {
        path: "d",
        component:TagMasterComponent,
        data: { title: "Tag Master" }
      },
      {
        path: "b",
        component:AssetClassComponent,
        data: { title: "Asset Class" }
      },
      {
        path: "e",
        component:DefineseriesComponent,
        data: { title: "Define Series" }
      },
      {
        path: "a",
        component: CategoryTypeSubtypeComponent,
        data: {title: "Category Type/Subtype"}
      },
      { path: "f",
      component: GroupComponent,
      data: { title: "group"}
    },
    ]
  }
];
