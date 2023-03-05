import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GestureConfig } from '@angular/material/core';
import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface
} from 'ngx-perfect-scrollbar';
import { MatTabsModule } from '@angular/material/tabs';
import { OrderModule } from 'ngx-order-pipe';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './shared/inmemory-db/inmemory-db.service';
import { rootRouterConfig } from './app.routing';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ErrorHandlerService } from './shared/services/error-handler.service';
import { TokenInterceptor } from './shared/interceptors/token.interceptor';
import { ManagerService } from './components/storage/sessionMangaer';
import { SessionStorage } from './components/storage/sessionstorage';
import { LocalStorage } from './components/storage/localstorage';
import { SHA256 } from './components/storage/SHA256';
//import { LoaderService } from './components/services/loader-service';
import { UrlInterceptor } from './shared/interceptors/urlInterceptor';
import { LoaderInterceptor } from './shared/interceptors/LoaderInterceptor';
import { SnotifyModule, SnotifyService, ToastDefaults, SnotifyPosition } from 'ng-snotify';
import { ToastrModule } from 'ngx-toastr';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { CustomPaginator } from './shared/shared.custom_paginator';
import { BnNgIdleService } from 'bn-ng-idle';
import { AuthGuard } from './shared/guards/auth.guard';
import { OAuthModule } from "angular-oauth2-oidc";
import {MatStepperModule} from '@angular/material/stepper';




// import { ItamModule } from './components/itam/itam.module';
//import { OrderModule } from 'ngx-order-pipe'; 
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    MatTabsModule,
    OrderModule,
    HttpClientModule,
    PerfectScrollbarModule,
    MatPaginatorModule,
    MatStepperModule,
    // ItamModule,
    ToastrModule.forRoot({
      closeButton: true,
      progressBar: true,
      timeOut: 5000
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    //OrderModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService, { passThruUnknownUrl: true }),
    RouterModule.forRoot(rootRouterConfig, { useHash: false }),
    OAuthModule.forRoot(),
  ],
  declarations: [AppComponent],
  providers: [
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: AuthGuard, useClass: AuthGuard },
    //{ provide: MatPaginatorIntl, useValue: CustomPaginator() },    
    ManagerService,
    SessionStorage,
    LocalStorage,
    SHA256,
    DatePipe,
    DecimalPipe,
    BnNgIdleService,
    // REQUIRED IF YOU USE JWT AUTHENTICATION
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UrlInterceptor,
      multi: true
    },
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults }, SnotifyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
