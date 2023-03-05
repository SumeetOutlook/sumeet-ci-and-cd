import { Signup4Component } from './signup4/signup4.component';
import { Signup3Component } from './signup3/signup3.component';
import { Signup2Component } from './signup2/signup2.component';
import { Routes } from "@angular/router";

import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { LockscreenComponent } from "./lockscreen/lockscreen.component";
import { SigninComponent } from "./signin/signin.component";
import { SignupComponent } from "./signup/signup.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { ErrorComponent } from "./error/error.component";
import { Signin3Component } from './signin3/signin3.component';
import { Signin4Component } from './signin4/signin4.component';
import { Signin2Component } from './signin2/signin2.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { GroupRegionCompanyComponent} from './group-region-company/group-region-company.component';
import { AssetTransferListComponent } from './asset-transfer-list/asset-transfer-list.component';
import { AssetRetirementListComponent } from './asset-retirement-list/asset-retirement-list.component';
import { MissingDamageAssetlistComponent } from './missing-damage-assetlist/missing-damage-assetlist.component';
import { SsoSigninComponent } from './sso-signin/sso-signin.component';
import { SadminLoginComponent } from './sadmin-login/sadmin-login.component';
import { ViewPhotoComponent } from './view-photo/view-photo.component';
import { AssetAllocationListComponent } from './asset-allocation-list/asset-allocation-list.component';
import { AssetUnallocationListComponent } from './asset-unallocation-list/asset-unallocation-list.component';
import { SsoOauthComponent } from './sso-oauth/sso-oauth.component';
import { NotificationsPanelComponent } from './notifications-panel/notifications-panel.component';

export const SessionsRoutes: Routes = [
  {
    path: "",
    //component: Signin2Component,
    children: [
      {
        path: "signup",
        component: SignupComponent,
        data: { title: "Signup" }
      },
      {
        path:"view_photo",
        component:ViewPhotoComponent,
        data: {title: 'View Photo'}
      },
      {
        path: "signup2",
        component: Signup2Component,
        data: { title: "Signup2" }
      },
      {
        path: "signin2",
        component: Signin2Component,
        data: { title: "Signin2" }
      },
      {
        path: "signup3",
        component: Signup3Component,
        data: { title: "Signup3" }
      },
      {
        path: "signin3",
        component: Signin3Component,
        data: { title: "sign-in-3" }
      },
      {
        path: "signin4",
        component: Signin4Component,
        data: { title: "Signin4" }
      },
      {
        path: "login",
        component: Signin4Component,
        data: { title: "Login" }
      },
      {
        path: "ssologin",
        component: SsoSigninComponent,
        data: { title: "Login" }
      },
      {
        path: "sadmin",
        component: SadminLoginComponent,
        data: { title: "Login" }
      },
      {
        path: "signin",
        component: SigninComponent,
        data: { title: "Signin" }
      },
      {
        path: "forgot-password",
        component: ForgotPasswordComponent,
        data: { title: "Forgot password" }
      },
      {
        path: "lockscreen",
        component: LockscreenComponent,
        data: { title: "Lockscreen" }
      },
      {
        path: "404",
        component: NotFoundComponent,
        data: { title: "Not Found" }
      },
      {
        path: "error",
        component: ErrorComponent,
        data: { title: "Error" }
      },
      {
        path: "setPassword",
        component: SetPasswordComponent,
        data: { title: "setpassword" }
      },
      {
        path: "selectGRC",
        component: GroupRegionCompanyComponent,
        data: { title: "selectGRC" }
      },
      {
        path: "assettransferlist",
        component: AssetTransferListComponent,
        data: { title: "Transfer Asset" }
      },
      {
        path: "assetretirementlist",
        component: AssetRetirementListComponent,
        data: { title: "Retirement Asset" }
      },
      {
        path: "missingassetlist",
        component: MissingDamageAssetlistComponent,
        data: { title: "Missing Asset" }
      },
      {
        path: "allocationlist",
        component: AssetAllocationListComponent,
        data: { title: "Asset Allocation" }
      },
      {
        path: "unallocationlist",
        component: AssetUnallocationListComponent,
        data: { title: "Asset Allocation" }
      },
      {
        path: "oauth",
        component: SsoOauthComponent,
        data: { title: "oauth" }
      },
      {
        path: "NotificationsPanel",
        component: NotificationsPanelComponent,
        data: { title: "NotificationsPanel" }
      },
    ]
  }
];
