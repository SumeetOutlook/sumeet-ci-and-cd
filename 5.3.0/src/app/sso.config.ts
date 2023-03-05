import { AuthConfig } from "angular-oauth2-oidc";
import { environment } from '../environments/environment';

export const authConfig: AuthConfig = {
  // Url of the Identity Provider
  //issuer: "https://steyer-identity-server.azurewebsites.net/identity",

  // URL gor testing Azure AD with OPENID connect
  //issuer: "https://login.microsoftonline.com/5654b3f8-e738-4dd2-a160-a81f04bb0e5f/v2.0",

  // URL gor testing onelogin with OPENID connect
  //issuer: "https://assetraksolutions-dev.onelogin.com/oidc/2",
  //issuer: "https://login.microsoftonline.com/ba02c16a-bd62-47b5-be20-64026da69c9a/v2.0",
  issuer: environment.Issuer ,//"https://dev-74557720.okta.com/oauth2/default",

  // URL of the SPA to redirect the user to after login
  //redirectUri: window.location.origin + "/index.html",
  redirectUri: window.location.origin ,//"http://localhost:4200/index.html",

  // ********** The SPA's id. The SPA is registered with this id at the auth-server
  //clientId: "spa-demo",
  // ********** AZURE AD Client Id ecoconut
  //clientId: "3c7bd380-389e-42d0-a2c5-c05ff61d3484",
  // ********** ONELOGIN CLIENT ID https://assetraksolutions-dev.onelogin.com/
  //clientId: "273bcd70-75b3-0139-9f73-023e32f84ce7186054",
  // ********** OKTA CLIENT ID https://dev-74557720.okta.com/
  clientId: environment.ClientId,//"0oaid1n5tU0uw4lwl5d6",

  // Irrespective of IDp responseType is constant value
  responseType: "id_token token",

  // Required for ONELOGIN only, will have to try for AZURE AD
  //postLogoutRedirectUri: "https://assetraksolutions-dev.onelogin.com/oidc/2/logout",
  //postLogoutRedirectUri:"https://dev-74557720.okta.com/oauth2/v1/authorize/callback",

  strictDiscoveryDocumentValidation: false,

  // set the scope for the permissions the client should request
  // The first three are defined by OIDC. The 4th is a usecase-specific one
  //scope: "openid api://1eed78bc-f23a-48bc-8b40-7a9377a3f9bc/app",
  scope: "openid profile email",
};
