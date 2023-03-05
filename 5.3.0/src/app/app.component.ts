import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { RoutePartsService } from "./shared/services/route-parts.service";
import { filter } from 'rxjs/operators';
import { BnNgIdleService } from 'bn-ng-idle';
import { JwtAuthService } from "app/shared/services/auth/jwt-auth.service";
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Observable, Observer, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';
// import { LayoutService } from './shared/services/layout.service';
import { OAuthService } from "angular-oauth2-oidc";
import { JwksValidationHandler } from "angular-oauth2-oidc-jwks";
import { authConfig } from "./sso.config";
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  appTitle = 'Assetcues';
  pageTitle = '';

  constructor(
    public title: Title,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private routePartsService: RoutePartsService,
    private bnIdle: BnNgIdleService,
    private JwtAuth: JwtAuthService,
    private dialogRef: MatDialog,
    private oauthService: OAuthService,
    private httpClient: HttpClient
  ) {
    // Check Internet connection =========
    this.createOnline$().subscribe(isOnline => {
      if (!isOnline)
        alert("Please check your network connection and try again.")
    });
    // Session TimeOut =========
    var timeOut = this.JwtAuth.getSessionTimeOut();
    this.bnIdle.startWatching(timeOut).subscribe((res) => {
      if (res) {
        this.dialogRef.closeAll();
        alert("Session timed out!! Please log in again.");
        this.JwtAuth.signout();
      }
    });      
  } 
  ngOnInit() {
    this.changePageTitle();
  }
  createOnline$() {
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));
  }
  ngAfterViewInit() {
  }
  changePageTitle() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((routeChange) => {
      var routeParts = this.routePartsService.generateRouteParts(this.activeRoute.snapshot);
      if (!routeParts.length)
        return this.title.setTitle(this.appTitle);
      // Extract title from parts;
      this.pageTitle = routeParts
        .reverse()
        .map((part) => part.title)
        .reduce((partA, partI) => { return `${partA} > ${partI}` });
      this.pageTitle += ` | ${this.appTitle}`;
      //this.title.setTitle(this.pageTitle);
      this.title.setTitle(this.appTitle);
    });
  }

}
