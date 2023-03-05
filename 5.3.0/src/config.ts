export const config = {
  apiUrl:'http://localhost:1446/',
  itamUrl:'https://localhost:44395/',
  cmmsUrl:'https://localhost:44306/',
  templateURL:'http://localhost:4200/',
  downloadExcel:'http://localhost:1446/',
  Notificationapiurl:'http://localhost:5200/',
  //Notificationapiurl:'https://notification.assetrak.net/',

  //serverNotificationapiurl:'https://notification.assetrak.net/',
   serverNotificationapiurl:'https://prdnotification.assetrak.net/',

  // serverapiUrl:'https://qaservice.assetrak.net/',
  // servertemplateURL:'https://qa.assetrak.net/',
  // serverdownloadExcel:'https://qaservice.assetrak.net/',

  //   serverapiUrl:'https://qagapservice.assetrak.net/',
  // servertemplateURL:'https://qagap.assetrak.net/',
  // serverdownloadExcel:'https://qagapservice.assetrak.net/',

 // serverapiUrl:'https://arhataservice.assetrak.net/',
 // servertemplateURL:'https://arhata.assetrak.net/',
 // serverdownloadExcel:'https://arhataservice.assetrak.net/',

 //  serverapiUrl:'https://qamobileservice.assetrak.net/',
 //  servertemplateURL:'https://qamobile.assetrak.net/',
 //  serverdownloadExcel:'https://qamobileservice.assetrak.net/',

  //  serverapiUrl:'https://jd1service.assetrak.net/',
  //  servertemplateURL:'https://jd1.assetrak.net/',
  //  serverdownloadExcel:'https://jd1service.assetrak.net/',

    //  serverapiUrl:'https://adaniservice.assetrak.net/',
  //  servertemplateURL:'https://adani.assetrak.net/',
  //  serverdownloadExcel:'https://adaniservice.assetrak.net/',

       serverapiUrl:'https://toothsiservice.assetrak.net/',
   servertemplateURL:'https://toothsi.assetrak.net/',
   serverdownloadExcel:'https://toothsiservice.assetrak.net/',

  //      serverapiUrl:'https://uatcholayilservice.assetrak.net/',
  //  servertemplateURL:'https://uatcholayil.assetrak.net/',
  //  serverdownloadExcel:'https://uatcholayilservice.assetrak.net/',



   serveritamUrl:'',
   // serverCmmsUrl:'',
 
  SingleSignOn: false,
  IsSSO: false,
  SSOType: "",
  SSOName: "",
  Issuer: "",
  ClientId: "",
  authRoles: {
    sa: ['SA'], // Only Super Admin has access
    admin: ['SA', 'Admin'], // Only SA & Admin has access
    editor: ['SA', 'Admin', 'Editor'], // Only SA & Admin & Editor has access
    user: ['SA', 'Admin', 'Editor', 'User'], // Only SA & Admin & Editor & User has access
    guest: ['SA', 'Admin', 'Editor', 'User', 'Guest'] // Everyone has access
  }
 }