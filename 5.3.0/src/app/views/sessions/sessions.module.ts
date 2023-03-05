import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

// import { CommonDirectivesModule } from './sdirectives/common/common-directives.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { SessionsRoutes } from "./sessions.routing";
import { NotFoundComponent } from './not-found/not-found.component';
import { ErrorComponent } from './error/error.component';
import { Signup2Component } from './signup2/signup2.component';
import { Signup3Component } from './signup3/signup3.component';
import { Signup4Component } from './signup4/signup4.component';
import { Signin3Component } from './signin3/signin3.component';
import { Signin4Component } from './signin4/signin4.component';
import { Signin2Component } from './signin2/signin2.component';
import { SetPasswordComponent } from './set-password/set-password.component';
 import { GroupRegionCompanyComponent} from './group-region-company/group-region-company.component';
import { ForgotPasswordPopUpComponent} from './signin4/forgotpassword_dialog/forgotpassword_popup.component';
import { AssetTransferListComponent } from './asset-transfer-list/asset-transfer-list.component';
import { AssetTransferApprovalDetailsDialogComponent } from './dialog/asset-transfer-approval-details-dialog/asset-transfer-approval-details-dialog.component';
import { AssetRetirementListComponent } from './asset-retirement-list/asset-retirement-list.component';
import { AssetRetirementApprovalDetailsDialogComponent } from './dialog/asset-retirement-approval-details-dialog/asset-retirement-approval-details-dialog.component';
import { MissingDamageAssetlistComponent } from './missing-damage-assetlist/missing-damage-assetlist.component';
import { SsoSigninComponent } from './sso-signin/sso-signin.component';
import { SadminLoginComponent } from './sadmin-login/sadmin-login.component';
import { ViewPhotoComponent } from './view-photo/view-photo.component';
import { ApproveRejectDialogComponent } from './dialog/approve-reject-dialog/approve-reject-dialog.component';
import { AssetAllocationListComponent } from './asset-allocation-list/asset-allocation-list.component';
import { AssetUnallocationListComponent } from './asset-unallocation-list/asset-unallocation-list.component';
import { SsoOauthComponent } from './sso-oauth/sso-oauth.component';
import { NotificationsPanelComponent } from './notifications-panel/notifications-panel.component';
import { NotificationDialogComponent } from './dialog/notification-dialog/notification-dialog.component';
import { SigninDialogComponent } from './dialog/signin-dialog/signin-dialog.component';
import { TwoFactorAuthenticationComponent } from './dialog/two-factor-authentication/two-factor-authentication.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    FlexLayoutModule,
    PerfectScrollbarModule,
    NgxMatSelectSearchModule,
    RouterModule.forChild(SessionsRoutes)
  ],
  declarations: [ForgotPasswordComponent,
    SetPasswordComponent, 
    LockscreenComponent,
     SigninComponent, 
     SignupComponent,
     NotFoundComponent,
     ErrorComponent,
     Signup2Component, 
     Signup3Component, 
     Signup4Component, 
     Signin3Component, 
     Signin4Component, 
     Signin2Component,     
     ForgotPasswordPopUpComponent,
     AssetTransferListComponent,
     GroupRegionCompanyComponent,
     AssetTransferApprovalDetailsDialogComponent,
     AssetRetirementListComponent,
     AssetRetirementApprovalDetailsDialogComponent,
     MissingDamageAssetlistComponent,
     SsoSigninComponent,
     SadminLoginComponent,
     ViewPhotoComponent,
     ApproveRejectDialogComponent,
     AssetAllocationListComponent,
     AssetUnallocationListComponent,
     SsoOauthComponent,
     NotificationsPanelComponent,
     NotificationDialogComponent,
     SigninDialogComponent,
     TwoFactorAuthenticationComponent

    ]
})
export class SessionsModule { }