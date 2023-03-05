import { config } from "../config";

export const environment = {
  production: true,
  apiURL: config.serverapiUrl,
  itamUrl:config.serveritamUrl,
  cmmsUrl:config.serverCmmsUrl,
  templateURL:config.servertemplateURL,
  downloadExcel:config.serverdownloadExcel,
  IsSSO : config.IsSSO,
  SSOType : config.SSOType,
  SSOName : config.SSOName,
  Issuer : config.Issuer,
  ClientId : config.ClientId,
  Notificationapiurl : config.serverNotificationapiurl
};