import { Routes } from "@angular/router";
import { CreateAssetsComponent } from './create_asset/create_assets.component';
import { CreateAssetPopupComponent } from './CreateAsset_popup/createasset_popup.component';
import { ReviewAssetComponent } from './review_assets/review.component';
import { EditAssetComponent } from './edit_asset/edit_asset.component';
import { EditAssetDialogComponent } from "./edit_popup/edit_popup.component";
import { EditReviewComponent } from './edit_review_asset/edit_review.component';
import { CreateFARAssetComponent } from './create-farasset/create-farasset.component';
import { CreateFARAssetPopupComponent } from './create-farasset-popup/create-farasset-popup.component';


export const AssetsRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "a",
        component: CreateAssetsComponent,
        data: { title: "create-assets" }
      },
      {
        path: "b",
        component: EditAssetComponent,
        data: { title: "Edit Asset" }
      },
      {
        path: "bb",
        component: EditAssetDialogComponent,
        data: { title: "edit_asset_popup" }
      },
      {
        path: "aa",
        component: CreateAssetPopupComponent,
        data: { title: "create_assets_popup" }
      },

      {
        path: "c",
        component: ReviewAssetComponent,
        data: { title: "Review Assets" }
      },
      {
        path: "cc",
        component: EditReviewComponent,
        data: { title: "Edit Review Asset" }
      },
      {
        path: "d",
        component: CreateFARAssetComponent,
        data: { title: "Create FARAsset" }
      },
      {
        path: "dd",
        component: CreateFARAssetPopupComponent,
        data: { title: "Create FARAsset Popup" }
      },
    ]
  }
];
