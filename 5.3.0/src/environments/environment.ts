// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular.json`.

import { config } from "config";

export const environment = {
  production: false,
  templateURL:config.templateURL,
  apiURL: config.apiUrl,
  itamUrl:config.itamUrl,
  cmmsUrl:config.cmmsUrl,
  downloadExcel:config.downloadExcel,
  IsSSO : config.IsSSO,
  SSOType : config.SSOType,
  SSOName : config.SSOName,
  Issuer : config.Issuer,
  ClientId : config.ClientId,
  Notificationapiurl : config.Notificationapiurl
  //apiURL:'https://qaservice.assetrak.net'
};
