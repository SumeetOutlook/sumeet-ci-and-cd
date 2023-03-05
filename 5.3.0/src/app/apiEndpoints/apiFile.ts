import { environment } from '../../environments/environment';

//Space Removed
export const APIConstants: any = {
  //wihtout token
  'SIGNUP': 'api/signup',
  //'LOGIN': environment.apiURL +'api/users/login',
  'LOGIN': environment.apiURL + 'LoginService.svc/IsLoggedInJson',
  'VERIFYOTPDETAILS': environment.apiURL + 'LoginService.svc/VerifyOtpDetails',
  'GENERATEOTPANDMISSING': environment.apiURL + 'LoginService.svc/GenerateOtpAndMailSend',
  'GetDeviceDetails': environment.apiURL + 'LoginService.svc/GetDeviceDetails',
  'ForgotPassword': environment.apiURL + 'LoginService.svc/ForgotPassword',
  'ResetPassword': environment.apiURL + 'UserDataService.svc/ResetPassword',
  'GetUserId': environment.apiURL + 'UserDataService.svc/GetUserIdByUserEmail',
  'GetGroupRegionAndCompany': environment.apiURL + 'CompanyService.svc/GetValueForGroupRegionAndCompanyByUserId',
  'InsertFavouriteSelections': environment.apiURL + 'UserDataService.svc/InsertFavouriteSelection',
  'GetFavouriteSeletionByUser': environment.apiURL + 'UserDataService.svc/GetFavouriteSeletionByUserId',
  'TOKENCHECK': 'api/passwordTokenCheck',
  'PASSWORDSET': 'api/setSubUSerPassword',
  'SUBUSERCREATE': 'api/signupSubUser',
  'GetCurrencyCompanyGroupById': environment.apiURL + 'CompanyService.svc/GetCompanyMasterDataAllByGroupID',
  'GetCurrencyConversionDataAllByGroupID': environment.apiURL + 'CompanyService.svc/GetCurrencyConversionDataAllByGroupID',
  'GetCurrencyConversionDataByGroupIDCompanyID': environment.apiURL + 'CompanyService.svc/GetCurrencyConversionDataByGroupIDCompanyID',
  'MapCurrencyConversion': environment.apiURL + 'CompanyService.svc/MapCurrencyConversion',
  'GetOutBoundData': environment.apiURL + 'GroupService.svc/GetDataByTransactionTypeForIDHolderandSapTemp',
  'GetEmployeeMasterCompanyList': environment.apiURL + 'CompanyService.svc/CompanyNameIdListJson',
  'GetEmployeeMasterCompanyData': environment.apiURL + 'CompanyService.svc/GetEmployeeList',
  'UploadandCreateEmployee': environment.apiURL + 'CompanyLocationService.svc/UploadEmployeeMaster',
  'UpdateEmployeeData': environment.apiURL + 'CompanyService.svc/UpdateEmployee',
  'DeleteEmployeeData': environment.apiURL + 'CompanyService.svc/DeleteEmployee',
  'GetAssetClassData': environment.apiURL + 'CompanyBlockService.svc/GetCompanyBlockListByCompanyIdWithPrefarCount',
  'GetAssetCateotyData': environment.apiURL + 'CompanyBlockService.svc/GetCategoryListByCompanyId',
  'UpdateAssetCateotyData': environment.apiURL + 'PrefarService.svc/UpdateCategoryByClassIdForSelectedAssets',
  'GetLocationListByConfiguration': environment.apiURL + 'CompanyLocationService.svc/GetLocationListByConfiguration',
  'GetLocationListByConfigurationAndAssetsAvailable': environment.apiURL + 'CompanyLocationService.svc/GetLocationListByConfigurationAndAssetsAvailable',
  'GetCategoryListByConfiguration': environment.apiURL + 'CompanyBlockService.svc/GetCategoryListByConfiguration',
  'GetAllOptionsByPtype': environment.apiURL + 'Auditservice.svc/GetAllOptionsByPtype',
  'GetAssetListForTagging': environment.apiURL + 'PrefarService.svc/GetAssetListForTagging',
  'GetTypeOfAssetList': environment.apiURL + 'ITAssetsService.svc/getTypeOfAssetList',
  'GetSubTypeOfAssetMasterList': environment.apiURL + 'ITAssetsService.svc/getSubTypeOfAssetMasterList',
  'GetAssetsForBackToScruitiny': environment.apiURL + 'Auditservice.svc/GetAssetsForBackToScruitiny',
  'RejectApprove': environment.apiURL + 'Auditservice.svc/RejectApprove',
  'MultipalApproveTaggingDetails': environment.apiURL + 'Auditservice.svc/MultipalApproveTaggingDetails',
  'GetAssetDetailsWithGroupJson': environment.apiURL + 'PrefarService.svc/GetAssetDetailsWithGroupJson',
  'GetPrePrintAdditionalListForMapping': environment.apiURL + 'Auditservice.svc/GetPrePrintAdditionalListForMapping',
  'GetValueForRegion': environment.apiURL + 'CompanyService.svc/GetValueForRegion',
  'GetValueForCompany': environment.apiURL + 'CompanyService.svc/GetValueForCompany',
  'GetAllRetiredIdForReport': environment.apiURL + 'AssetRetireService.svc/GetAllRetiredIdForReport',
  'GetAllRetiredIdForDisposalReport': environment.apiURL + 'AssetRetireService.svc/GetAllRetiredIdForDisposalReport',
  'GetnewModifiedAssetListForReview': environment.apiURL + 'Auditservice.svc/GetnewModifiedAssetListForReview',
  'GetBlockOfAssetsByCompany': environment.apiURL + 'CompanyBlockService.svc/GetBlockOfAssetsByCompany',
  'GetFiscalYearList': environment.apiURL + 'CompanyService.svc/GetFiscalYearList',
  'GetPeriodList': environment.apiURL + 'CompanyService.svc/GetPeriodList',
  'SearchAssetJSON': environment.apiURL + 'PrefarService.svc/SearchAssetJSON',
  'GetDocumentListForEditAsset': environment.apiURL + 'PrefarService.svc/GetDocumentListForEditAsset',
  //configuration
  'CONFIGINSERTDATA': 'configuration/api/configInsert',
  'CONFIGGETDATA': 'configuration/api/configGetData',
  'SUBUSERGETDATA': 'admin/api/getAdminCreatedUsers',
  'SUBUSEREDITDATA': 'admin/api/updateUserdata',

  'USERGROUPINSERT': 'admin/api/userGroupInsert',
  'USERGROUPGET': 'admin/api/userGroupGetdata',
  'UPDATEUSERGROUP': 'admin/api/updateUserGroup',

  'GROUPUSERASSIGN': 'admin/api/groupUserAssign',
  'GETGROUPUSERASSIGN': 'admin/api/getgroupAssignData',
  'REMOVEUSERFROMGROUP': 'admin/api/userRemovalFromGroup',

  //internal approval
  'GETINTERNALAPPROVAL': 'admin/api/internalApprovalGetdata',
  'UPDATEINTERNALAPPROVAL': 'admin/api/updateInternalApproval ',
  'INSERTINTERNALAPPROVAL': 'admin/api/internalApprovalInsert',

  //GroupMaster
  'GROUPGETALLDATA': environment.apiURL + 'GroupService.svc/GetGroupToBindDisplayList',
  'GROUPGETDATA': environment.apiURL + 'GroupService.svc/GetGroupById',
  'GROUPINSERT': environment.apiURL + 'GroupService.svc/AddGroup',
  'GROUPUPDATE': environment.apiURL + 'GroupService.svc/UpdateGroup',
  'GROUPREMOVE': environment.apiURL + 'GroupService.svc/RemoveGroupById',

  //RegionMaster
  'REGIONGETALLDATA': environment.apiURL + 'RegionService.svc/RegionList',
  'REGIONGETDATA': environment.apiURL + 'RegionService.svc/GetRegionByIdJson',
  'REGIONINSERT': environment.apiURL + 'RegionService.svc/AddRegion',
  'REGIONUPDATE': environment.apiURL + 'RegionService.svc/UpdateRegionJson',
  'REGIONREMOVE': environment.apiURL + 'RegionService.svc/DeleteRegion',
  'EMPLOYEEALLDATA': environment.apiURL + 'RegionService.svc/EmployeeListByGroupId',

  //CompanyMaster
  'COMPANYGETALLDATA': environment.apiURL + 'CompanyService.svc/CompanyList',
  'COMPANYGETDATA': environment.apiURL + 'CompanyService.svc/GetCompanyByIdJson',
  'COMPANYINSERT': environment.apiURL + 'CompanyService.svc/AddCompany',
  'COMPANYUPDATE': environment.apiURL + 'CompanyService.svc/UpdateCompanyJson',
  'COMPANYREMOVE': environment.apiURL + 'CompanyService.svc/DeleteCompany',

  //CurrencyMaster
  'CURRENCYGETALLDATA': environment.apiURL + 'CompanyLocationService.svc/GetToBindCurrencyList',

  //CountryMaster
  'COUNTRYGETALLDATA': environment.apiURL + 'CompanyLocationService.svc/GetToBindDisplayListOfCountry',

  //StateMaster
  'STATEGETALLDATA': environment.apiURL + 'CompanyLocationService.svc/GetToBindDisplayListOfState',

  //CityMaster
  'CITYGETALLDATA': environment.apiURL + 'CompanyLocationService.svc/GetToBindDisplayListOfCity',
  'GETLOCATIONBYCOMPANYID': environment.apiURL + 'CompanyLocationService.svc/GetLocationsByCompanyIdToBindSelectList',

  //AssetcategoryMaster
  'CATEGORYGETALLDATA': environment.apiURL + 'ITAssetsService.svc/GetAllAssetCategoryByLevel',
  'CATEGORYGETDATA': environment.apiURL + 'ITAssetsService.svc/GetAssetCategoryById',
  'CATEGORYINSERT': environment.apiURL + 'ITAssetsService.svc/AddAssetCategoryByLevel',
  'CATEGORYUPDATE': environment.apiURL + 'ITAssetsService.svc/UpdateAssetCategoryByLevel',
  'CATEGORYREMOVE': environment.apiURL + 'ITAssetsService.svc/DeleteAssetCategoryByID',

  //AssetTypeMaster
  'ASSETTYPEGETALLDATA': environment.apiURL + 'ITAssetsService.svc/getTypeofAssetsJSON',
  'ASSETTYPEGETDATA': environment.apiURL + 'ITAssetsService.svc/GetRegionByIdJson',
  'ASSETTYPEINSERT': environment.apiURL + 'ITAssetsService.svc/AddSingleAssetTypeByLevel',
  'ASSETTYPEUPDATE': environment.apiURL + 'ITAssetsService.svc/UpdateSingleAssetTypeByLevel',
  'ASSETTYPEREMOVE': environment.apiURL + 'ITAssetsService.svc/DeleteAssetTypeByID',
  'EXPORTASSETTYPE': environment.apiURL + 'ITAssetsService.svc/ExportAssetType',

  //AssetSubTypeMaster
  'ASSETSUBTYPEGETALLDATA': environment.apiURL + 'ITAssetsService.svc/getSubTypeDetailsByLevel',
  'ASSETSUBTYPEGETDATA': environment.apiURL + 'ITAssetsService.svc/GetCompanyByIdJson',
  'ASSETSUBTYPEINSERT': environment.apiURL + 'ITAssetsService.svc/AddSingleAssetSubTypeByLevel',
  'ASSETSUBTYPEUPDATE': environment.apiURL + 'ITAssetsService.svc/UpdateSingleAssetSubTypeByLevel',
  'ASSETSUBTYPEREMOVE': environment.apiURL + 'ITAssetsService.svc/DeleteAssetSubTypeByID',
  'EXPORTSUBETYPE': environment.apiURL + 'ITAssetsService.svc/exportSubTypeDetails',

  //SBU
  'SBUGETALLDATA': environment.apiURL + 'CompanyBlockService.svc/GetAllSBUByLevel',
  'SBUGETDATA': environment.apiURL + 'CompanyBlockService.svc/GetSbuById',
  'SBUINSERT': environment.apiURL + 'CompanyBlockService.svc/AddSBUByLevel',
  'SBUUPDATE': environment.apiURL + 'CompanyBlockService.svc/UpdateSBUByLevel',
  'SBUREMOVE': environment.apiURL + 'CompanyBlockService.svc/DeleteSBUByLevel',
  'GetSbuExport': environment.apiURL + 'CompanyBlockService.svc/GetSbuExport',

  //Location
  'LOCATIONGETALLDATA': environment.apiURL + 'CompanyLocationService.svc/GetLocationsByCompanyIdToBindDisplayList',
  'LOCATIONGETDATA': environment.apiURL + 'CompanyLocationService.svc/GetLocationById',
  'LOCATIONINSERT': environment.apiURL + 'CompanyLocationService.svc/AddCompanyLocation',
  'LOCATIONUPDATE': environment.apiURL + 'CompanyLocationService.svc/UpdateCompanyLocationNew',
  'LOCATIONREMOVE': environment.apiURL + 'CompanyLocationService.svc/DeleteLocationById',
  'LOCATIONEXPORT': environment.apiURL + 'CompanyLocationService.svc/ExportLocation',

  //StorageLocation
  'STORAGELOCATIONGETALLDATA': environment.apiURL + 'CompanyRackService.svc/GetAllStorageLocationDetailsNew',
  'STORAGELOCATIONGETDATA': environment.apiURL + 'CompanyRackService.svc/GetStorageLocationById',
  'STORAGELOCATIONINSERT': environment.apiURL + 'CompanyRackService.svc/AddSingleRack',
  'STORAGELOCATIONUPDATE': environment.apiURL + 'CompanyRackService.svc/UpdateRack',
  'STORAGELOCATIONREMOVE': environment.apiURL + 'CompanyRackService.svc/UpdateRackMappingStorageMaster',
  'EXPORTSTORAGELOCATION': environment.apiURL + 'CompanyRackService.svc/ExportStorageLocation',

  //UploadFile
  'GETALLOWEDEXTENSIONS' : environment.apiURL + 'UploadService.svc/GetAllowedExtensions',
  'UPLOADFILE': environment.apiURL + 'UploadService.svc/PostOutbounFiles',

  //OperatingSysteMaster
  'OPERATINGSYSTEMGETALLDATA': environment.apiURL + 'PrefarService.svc/GetAllOperatingSystemDetails',
  'OPERATINGSYSTEMINSERT': environment.apiURL + 'PrefarService.svc/AddSingleOperatingSystem',
  'OPERATINGSYSTEMEDIT': environment.apiURL + 'PrefarService.svc/UpdateOperatingSystem',
  'OPERATINGSYSTEMREMOVE': environment.apiURL + 'PrefarService.svc/DeleteMultipleOperatingSystem',
  'OPERATINGSYSTEMUPLOAD': environment.apiURL + 'PrefarService.svc/AddOperatingSystemFromExcel',
  'OPERATINGSYSTEMEXPORT': environment.apiURL + 'PrefarService.svc/GetAllOperatingSystemDetails',

  //CpuClassMaster
  'CPUCLASSGETALLDATA': environment.apiURL + 'PrefarService.svc/GetAllCpuClassDetails',
  'CPUCLASSINSERT': environment.apiURL + 'PrefarService.svc/AddSingleCpuClass',
  'CPUCLASSREMOVE': environment.apiURL + 'PrefarService.svc/DeleteMultipleCpuClass',
  'CPUCLASSUPDATE': environment.apiURL + 'PrefarService.svc/UpdateCpuClassMaster',
  'CPUCLASSUPLOAD': environment.apiURL + 'PrefarService.svc/AddCpuClassFromExcel',
  'CPUCLASSEXPORT': environment.apiURL + 'PrefarService.svc/GetAllCpuClassDetails',

  //CpuSubClassMaster
  'CPUSUBCLASSGETALLDATA': environment.apiURL + 'PrefarService.svc/GetAllCpuSubClassDetails',
  'CPUSUBCLASSINSERT': environment.apiURL + 'PrefarService.svc/AddSingleCpuSubClass',
  'CPUSUBCLASSREMOVE': environment.apiURL + 'PrefarService.svc/DeleteMultipleCpuSubClass',
  'CPUSUBCLASSUPDATE': environment.apiURL + 'PrefarService.svc/UpdateCpuSubClassMaster',
  'CPUSUBCLASSUPLOAD': environment.apiURL + 'PrefarService.svc/AddCpuSubClassFromExcel',
  'CPUSUBCLASSEXPORT': environment.apiURL + 'PrefarService.svc/GetAllCpuSubClassDetails',

  //ModelMaster
  'MODELGETALLDATA': environment.apiURL + 'PrefarService.svc/GetAllModelDetails',
  'MODELINSERT': environment.apiURL + 'PrefarService.svc/AddSingleModel',
  'MODELREMOVE': environment.apiURL + 'PrefarService.svc/DeleteMultipleModel',
  'MODELUPDATE': environment.apiURL + 'PrefarService.svc/UpdateModelMaster',
  'MODELUPLOAD': environment.apiURL + 'PrefarService.svc/AddModelFromExcel',
  'MODELEXPORT': environment.apiURL + 'PrefarService.svc/GetAllModelDetails',

  //ManufacturerMaster
  'MANUFACTURERGETALLDATA': environment.apiURL + 'PrefarService.svc/GetAllManufacturerDetails',
  'MANUFACTURERINSERT': environment.apiURL + 'PrefarService.svc/AddSingleManufacturer',
  'MANUFACTURERREMOVE': environment.apiURL + 'PrefarService.svc/DeleteMultipleManufacturer',
  'MANUFACTURERUPDATE': environment.apiURL + 'PrefarService.svc/UpdateManufacturerMaster',
  'MANUFACTURERUPLOAD': environment.apiURL + 'PrefarService.svc/AddManufacturerFromExcel',
  'MANUFACTUREREXPORT': environment.apiURL + 'PrefarService.svc/GetAllManufacturerDetails',

  //ApplicationTypeMaster
  'APPLICATIONTYPEGETALLDATA': environment.apiURL + 'PrefarService.svc/GetAllApplicationTypeDetails',
  'APPLICATIONTYPEINSERT': environment.apiURL + 'PrefarService.svc/AddSingleApplicationType',
  'APPLICATIONTYPEEDIT': environment.apiURL + 'PrefarService.svc/UpdateApplicationType',
  'APPLICATIONTYPEREMOVE': environment.apiURL + 'PrefarService.svc/DeleteMultipleApplicationType',
  'APPLICATIONTYPEUPLOAD': environment.apiURL + 'PrefarService.svc/AddApplicationTypeFromExcel',
  'APPLICATIONTYPEEXPORT': environment.apiURL + 'PrefarService.svc/GetAllApplicationTypeDetails',

  //Vendor Master
  'VENDORGETALLDATA': environment.apiURL + 'PrefarService.svc/GetAllSupplierDetails',
  'VENDORINSERT': environment.apiURL + 'PrefarService.svc/AddSingleSupplier',
  'VENDOREDIT': environment.apiURL + 'PrefarService.svc/UpdateSupplier',
  'VENDORREMOVE': environment.apiURL + 'PrefarService.svc/DeleteMultipleSupplier',
  'VENDORUPLOAD': environment.apiURL + 'PrefarService.svc/AddSupplierFromExcel',
  'VENDOREXPORT': environment.apiURL + 'PrefarService.svc/GetAllSupplierDetails',

  //CostCenerMaster
  'COSTCENTERGETALLDATA': environment.apiURL + 'CompanyRackService.svc/GetAllCostsCenterDetails',
  'COSTCENTERINSERT': environment.apiURL + 'CompanyRackService.svc/AddSingleCostCenter',
  'COSTCENTEREDIT': environment.apiURL + 'CompanyRackService.svc/UpdateCostCenter',
  'COSTCENTERREMOVE': environment.apiURL + 'CompanyRackService.svc/DeleteMultipleCostsCenter',
  'COSTCENTERUPLOAD': environment.apiURL + 'CompanyRackService.svc/AddCostCenterFromExcel',
  'COSTCENTEREXPORT': environment.apiURL + 'CompanyRackService.svc/GetAllCostsCenterDetails',

  //User Creation
  'USERGETALLDATA': environment.apiURL + 'UserDataService.svc/GetUserListOfActiveDeactiveUserByGroupId',
  'USERINSERT': environment.apiURL + 'UserDataService.svc/AddUserDetails',
  'USERUPDATE': environment.apiURL + 'UserDataService.svc/UpdateUserDetails',
  'USERDEACTIVATE': environment.apiURL + 'UserDataService.svc/UpdateUserDetails',
  'USERRESENDMAIL': environment.apiURL + 'UserDataService.svc/ResendConfirmationMailToUser',
  'USEREXPORT': environment.apiURL + 'UserDataService.svc/GetUserListOfActiveDeactiveUserByGroupId',
  'USERDELETE': environment.apiURL + 'UserDataService.svc/deleteuser',

  //SetPassword
  'CHECKLINKVALID': environment.apiURL + 'UserDataService.svc/CheckLinkExistInEmailLinkMaster',
  'UPDATENEWPASSWORD': environment.apiURL + 'UploadService.svc/UpdateUserNewPassword',

  //MODULE and PERMISSIONS Configuration
  'MODULESGETALLDATA': environment.apiURL + 'UserRoleService.svc/GetAllModuleList',
  'MODULEPERMISSIONGETALLDATA': environment.apiURL + 'UserRoleService.svc/GetAllModulePermissionList',
  'MODULEPERMISSIONGETDATABYID': environment.apiURL + 'UserRoleService.svc/GetModulePermissionListByModuleId',
  'UPDATEMODULEANDPERMISSIONCONFIGURATION': environment.apiURL + 'UserRoleService.svc/UpdateModuleAndPermissionForConfiguration',

  //Create Role 
  'MODULESGETALLDATABYLEVEL': environment.apiURL + 'UserRoleService.svc/GetAllModuleListByLevel',
  'MODULEPERMISSIONGETALLDATAForCreateRole': environment.apiURL + 'UserRoleService.svc/GetAllModulePermissionListForCreateRole',
  'CREATEROLEBYLEVELVALUE': environment.apiURL + 'UserRoleService.svc/CreateRoleByLevel',
  'ADDROLEANDMODULEPERMISSIONS': environment.apiURL + 'UserRoleService.svc/AddModuleAndPermissionToRole',

  //User Role Mapping
  'USERSGETALLDATA': environment.apiURL + 'UserRoleService.svc/GetActiveUserListByGroupId',
  'ROLESGETALLDATA': environment.apiURL + 'UserRoleService.svc/GetAllRoleListByLevel',
  'SBUGETALLBYCOMPANYID': environment.apiURL + 'UserRoleService.svc/GetAllSBUByCompanyId',
  'LOCATIONGETALLBYCOMPANYID': environment.apiURL + 'UserRoleService.svc/GetAllLocationsByCompanyId',
  'CATEGORYGETALLBYCOMPANYID': environment.apiURL + 'UserRoleService.svc/GetAllCategoryByCompanyId',
  'GETALLASSIGNMENTBYUSERID': environment.apiURL + 'UserRoleService.svc/GetAllAssignmentsByUserIdAndLevel',
  'GETALLASSIGNMENTBYROLE': environment.apiURL + 'UserRoleService.svc/GetAllAssignmentsByRoleId',
  'USERROLEMAP': environment.apiURL + 'UserRoleService.svc/MapUserToRole',
  'DELETEUSERROLEMAP': environment.apiURL + 'UserRoleService.svc/DeleteUserRoleMapping',

  //organizations approval
  'ORGANIZATIONGETDATA': 'admin/api/organizationsGetdata',
  'ORGANIZATIONINSERT': 'admin/api/organizationsInsert',
  'ORGANIZATIONEDIT': 'admin/api/updateOrganizationsdata',

  //applications approval
  'APPLICATIONGETDATA': 'admin/api/applicationsGetdata',
  'APPLICATIONINSERT': 'admin/api/applicationsInsert',
  'APPLICATIONEDIT': 'admin/api/updateApplicationsdata',

  //applications approval
  // 'ASSETTYPEGETDATA':'admin/api/assetTypeGetdata',
  // 'ASSETTYPEINSERT':'admin/api/assetTypeInsert',
  // 'ASSETTYPEEDIT':'admin/api/updateAssetTypedata',

  //applications approval
  'APPLICATIONASSETTYPEGETDATA': 'admin/api/applicationAssetTypeGetdata',
  'APPLICATIONASSETTYPEINSERT': 'admin/api/applicationAssetTypeInsert',
  'APPLICATIONASSETTYPEEDIT': 'admin/api/updateApplicationAssetTypedata',

  //userORg 
  'USERORGGETDATA': 'admin/api/userOrgGetdata',
  'USERORGINSERT': 'admin/api/userOrgInsert',
  'USERORGEDIT': 'admin/api/userOrgUpdateData',

  //userORg Location 
  'USERORGLOCAGETDATA': 'admin/api/userOrgLocGetdata',
  'USERORGLOCINSERT': 'admin/api/userOrgLocInsert',
  'USERORGLOCEDIT': 'admin/api/userORgLocUpdateData',

  //ROLES 
  'ROLESGETDATA': 'admin/api/rolesGetdata',
  'ROLESINSERT': 'admin/api/rolesInsert',
  'ROLESEDIT': 'admin/api/rolesUpdateData',

  //MODULES 
  'MODULESGETDATA': 'admin/api/modulesGetdata',
  'MODULESINSERT': 'admin/api/modulesInsert',
  'MODULESEDIT': 'admin/api/modulesUpdateData',

  //ASSET POLICY 
  'ASSETPOLICYGETDATA': 'admin/api/assetPolicyGetdata',
  'ASSETPOLICYINSERT': 'admin/api/assetPolicyInsert',
  'ASSETPOLICYEDIT': 'admin/api/assetPolicyUpdateData',

  //MODULE PERMISSIONS 
  'MODULEPERMISSIONGETDATA': 'admin/api/modulePermissionGetdata',
  'MODULEPERMISSIONINSERT': 'admin/api/modulePermissionInsert',
  'MODULEPERMISSIONEDIT': 'admin/api/modulePermissionUpdateData',

  //PERMISSION ASSET POLICIES 
  'PERMISSIONASSETPOLICYGETDATA': 'admin/api/permissionAssetPolicyGetdata',
  'PERMISSIONASSETPOLICYINSERT': 'admin/api/permissionAssetPolicyInsert',
  'PERMISSIONASSETPOLICYEDIT': 'admin/api/permissionAssetPolicyUpdateData',

  //ROLES PERMISSION
  'ROLEPERMISSIONGETDATA': 'admin/api/rolePermissionGetdata',
  'ROLEPERMISSIONINSERT': 'admin/api/rolePermissionInsert',
  'ROLEPERMISSIONEDIT': 'admin/api/rolePermissionUpdateData',

  //ROLES MEMBERS
  'ROLEMEMBERSGETDATA': 'admin/api/roleMembersGetdata',
  'ROLEMEMBERSINSERT': 'admin/api/roleMembersInsert',
  'ROLEMEMBERSEDIT': 'admin/api/roleMembersUpdateData',


  //master api's
  //masters
  'SBUUPLOAD': 'masters/api/sbuBulk',
  'SBUEDIT': 'masters/api/updateSbudata',

  'COSTGETDATA': 'masters/api/costGetData',
  'COSTINSERT': 'masters/api/costInsert',
  'COSTEDIT': 'masters/api/updateCostdata',
  'COSTBULK': 'masters/api/costCenterBulk',
  'LOCATIONEDIT': 'masters/api/updateLocationdata',
  'LOCATIONUPLOAD': 'masters/api/uploadLocation',

  'DEPTGETDATA': 'masters/api/departmentGetdata',
  'DEPTINSERT': 'masters/api/departmentInsert',
  'DEPTEDIT': 'masters/api/updateDepartmentdata',
  'DEPTUPLOAD': 'masters/api/departmentBulk',

  'RELGROUPINSERT': 'masters/api/relationGroupInsert',
  'RELGROUPGETDATA': 'masters/api/relationGroupGetData',
  'RELGROUPEDITDATA': 'masters/api/relationGroupUpdateData',
  'RELGROUPUPLOAD': 'masters/api/relationGroupBulk',

  'RELCATEGORYINSERT': 'masters/api/relationCategoryInsert',
  'RELCATEGORYGETDATA': 'masters/api/relationCategoryGetData',
  'RELCATEGORYEDITDATA': 'masters/api/relationCategoryUpdateData',
  'RELCATEGORYUPLOAD': 'masters/api/relationCategoryBulk',

  'RELTYPEINSERT': 'masters/api/relationTypeInsert',
  'RELTYPEGETDATA': 'masters/api/relationTypeGetData',
  'RELTYPEEDITDATA': 'masters/api/relationTypeUpdateData',
  'RELTYPEUPLOAD': 'masters/api/relationTypeBulk',

  'RELSUBTYPEINSERT': 'masters/api/relationSubTypeInsert',
  'RELSUBTYPEGETDATA': 'masters/api/relationSubTypeGetData',
  'RELSUBTYPEEDITDATA': 'masters/api/relationSubTypeUpdateData',
  'RELSUBTYPEUPLOAD': 'masters/api/relationSubTypeBulk',

  'CATEGORIESINSERT': 'masters/api/relationClassificationInsert',
  'CATEGORIESGETDATA': 'masters/api/relationClassificationGetData',
  'CATEGORIESUPDATE': 'masters/api/relationClassificationUpdateData',

  'TRANSACTIONSUBTYPEINSERT': 'masters/api/transactionSubTypeInsert',
  'TRANSACTIONSUBTYPEGETDATA': 'masters/api/transactionSubTypeGetData',
  'TRANSACTIONSUBTYPEEDITDATA': 'masters/api/transactionSubTypeUpdateData',
  'TRANSACTIONSUBTYPEBULK': 'masters/api/transactionSubTypeBulk',

  'TRANSACTIONCATEGORYINSERT': 'masters/api/transactionCategoryInsert',
  'TRANSACTIONCATEGORYGETDATA': 'masters/api/transactionCategoryGetData',
  'TRANSACTIONCATEGORYEDITDATA': 'masters/api/transactionCategoryUpdateData',


  'TRANSACTIONTYPEINSERT': 'masters/api/transactionTypeInsert',
  'TRANSACTIONTYPEGETDATA': 'masters/api/transactionTypeGetData',
  'TRANSACTIONTYPEEDITDATA': 'masters/api/transactionTypeUpdateData',
  'TRANSACTIONBULK': 'masters/api/transactionBulk',

  'TRANSACTIONNAMEINSERT': 'masters/api/transactionNameInsert',
  'TRANSACTIONNAMEGETDATA': 'masters/api/transactionNameGetData',
  'TRANSACTIONNAMEEDITDATA': 'masters/api/transactionNameUpdateData',
  'TRANSACTIONNAMEBULK': 'masters/api/transactionNameBulk',

  'RELATEDPARTIESGETDATA': 'masters/api/relatedPartiesGetData',
  'RELATEDPARTIESINSERT': 'masters/api/relatedPartiesInsert',
  'RELATEDPARTIESUPLOAD': 'masters/bulkUpload',
  'RELATEDPARTIESEDIT': 'masters/api/updateRelatedParties',
  'MANDATORYGETALLDATA': environment.apiURL + 'GroupService.svc/MandatoryGetAllData',
  'MANDATORYUPDATEDATA': environment.apiURL + 'GroupService.svc/UpdateMandatoryfield',
  'ACTIVEDIRECTORYGETALLDATA': environment.apiURL + 'GroupService.svc/GetAllDataActiveDirectoryCredentials',
  'ACTIVEDIRECTORYUPDATEDATA': environment.apiURL + 'GroupService.svc/UpdateDataofActiveDirectory',
  'ACTIVEDIRECTORYINSERTDATA': environment.apiURL + 'GroupService.svc/InsertIntoActiveDirectoryCredentials',
  'EMAILCREDENTIALGETALLDATA': environment.apiURL + 'GroupService.svc/GetAllDataEmailCredential',
  'EMAILCREDENTIALINSERTDATA': environment.apiURL + 'GroupService.svc/InsertIntoEmailCredentials',
  'EMAILCREDENTIALUPDATEDATA': environment.apiURL + 'GroupService.svc/UpdateDataofEmail',
  'FTPGETALLDATA': environment.apiURL + 'GroupService.svc/GetAllDataFTPCredential',
  'FTPINSERTDATA': environment.apiURL + 'GroupService.svc/InsertFtpdetail',
  'FTP1UPDATEDATA': environment.apiURL + 'GroupService.svc/Ftp1UpdateData',
  'FTP2GETALLDATA': environment.apiURL + 'GroupService.svc/Ftp2GetAllData',
  'FTP2UPDATEDATA': environment.apiURL + 'GroupService.svc/Ftp2UpdateData',
  'PAGESGETALLDATA': environment.apiURL + 'GroupService.svc/GetAllDataModuleMaster',
  'PAGEMAPPINGINSERT': environment.apiURL + 'GroupService.svc/InsertintoPageFieldmapping',
  'FIELDSGETALLDATA': environment.apiURL + 'GroupService.svc/GetAllDataPagefieldmapping',
  'FILTERMAPPING': environment.apiURL + 'GroupService.svc/InsertintoPageFiltermapping',
  'FILERMASTERGETALLDATA': environment.apiURL + 'GroupService.svc/FilterMasterGetAllData',
  'FILTERGETALLDATA': environment.apiURL + 'GroupService.svc/GetAllDataPagefiltermapping',
  'RULEINSERT': environment.apiURL + 'GroupService.svc/InsertRuleEngine',
  'RULESLISTGETDATA': environment.apiURL + 'GroupService.svc/GetRulesData',
  'UPLOADMULTIPLEASSETS': environment.apiURL + 'UploadService.svc/UploadAssetsMultipleDocument',
  'GETALLTABLECOLUMNDATA': environment.apiURL + 'PrefarService.svc/GetAllTableColumnData',
  'GETMAPPINGDATA': environment.apiURL + 'PrefarService.svc/GetMappingData',
  'GETTRANSFERTYPES': environment.apiURL + 'ReconciliationService.svc/GetTransferTypes',
  'GETLOCATIONSBYCOMPANYIDTOBINDSELECTLIST': environment.apiURL + 'CompanyLocationService.svc/GetLocationsByCompanyIdToBindSelectList',
  'GETUSERSLOCATIONSBYTASKIDSCOMPANYUSERID': environment.apiURL + 'UserMappingService.svc/GetUsersLocationsByTaskIdsCompanyUserId',
  'CHECKTRANSFERRIGHTS': environment.apiURL + 'ReconciliationService.svc/CheckRights',
  'GETBLOCKOFASSETSBYCOMPANY': environment.apiURL + 'CompanyBlockService.svc/GetBlockOfAssetsByCompany',
  'GETBLOCKSBYLOCUSER': environment.apiURL + 'CompanyBlockService.svc/GetBlocksByLocUser',
  'GETASSETLISTTOCHANGELOCATION': environment.apiURL + 'ReconciliationService.svc/GetAssetListToChangeLocation',
  'GETASSETFORTRANSFER': environment.apiURL + 'ReconciliationService.svc/GetAssetForTransfer',
  'GETALLCOSTSCENTERLIST': environment.apiURL + 'CompanyRackService.svc/GetAllCostsCenterList',
  'CHECKWETHERCONFIGURATIONEXIST': environment.apiURL + 'GroupService.svc/CheckWetherConfigurationExist',
  'GETMAPPEDRACKLISTWITHRACKNAME': environment.apiURL + 'CompanyRackService.svc/GetMappedRackListWithRackName',
  'GETTOBINDDISPLAYLISTBYTYPE': environment.apiURL + 'CompanyLocationService.svc/GetToBindDisplayListByType',
  'SETOUTWARDLOCATIONDETAILS': environment.apiURL + 'ReconciliationService.svc/SetOutwardLocationDetailswithDoc',
  'SETOUTWARDLOCATIONDETAILSCOSTCENTERSTORAGELOCATION': environment.apiURL + 'ReconciliationService.svc/SetOutwardLocationDetailsCostcenterStorageLocation',
  'GETLOCATIONSBYCOMPANYIDTOBINDSELECTLISTBYPAGENAME': environment.apiURL + 'CompanyLocationService.svc/GetLocationsByCompanyIdToBindSelectListByPageName',
  'GETTRANSACTIONIDS': environment.apiURL + 'ReconciliationService.svc/GetTransactionIds',
  'GETASSETLISTFORTRANSFERAPPROVAL': environment.apiURL + 'ReconciliationService.svc/GetAssetListForTransferApproval',
  'GETMULTIPLEASSETSFORTRANSFERAPPROVAL': environment.apiURL + 'ReconciliationService.svc/GetMultipleAssetsForTransferApproval',
  ////////////////////URL For Template//////////////////////
  'DOWNLOADTEMPLATE': environment.templateURL + 'assets/Templates/',
  'DOWNLOADEXCELFILE': environment.downloadExcel + 'uploads/',
  'UOMGETALLDATA': environment.apiURL + 'GroupService.svc/GetUnitList',
  'LOCATIONDATAGETBYCOMPANYID': environment.apiURL + 'CompanyLocationService.svc/GetLocationsByCompanyIdToBindSelectList',
  'BLOCKSOFASSETSDATA': environment.apiURL + 'CompanyBlockService.svc/GetBlockOfAssetsByCompanyNew',
  'USERSBLOCKSDATA': environment.apiURL + 'UserMappingService.svc/GetUsersBlocksByTaskIdsCompanyUserId',
  'ASSETCONDITIONGETALLDATA': environment.apiURL + 'PrefarService.svc/GetAssetConditionListForAll',
  'ASSETCRITICALITYGETALLDATA': environment.apiURL + 'PrefarService.svc/GetAssetCriticalityListForAll',
  'SUPPLIERLISTDATA': environment.apiURL + 'PrefarService.svc/GetSupplierList',
  'SUBTYPEDATA': environment.apiURL + 'ITAssetsService.svc/getSubTypeBytype',
  'MAPPEDRACKLISTDATA': environment.apiURL + 'CompanyRackService.svc/GetMappedRackListWithRackName',
  'TYPEDATA': environment.apiURL + 'ITAssetsService.svc/getTypeByBlockJSON',
  'COSTCENTERGETLISTALLDATA': environment.apiURL + 'CompanyRackService.svc/GetAllCostsCenterList',
  'CATEGORYGETLISTALLDATA': environment.apiURL + 'ITAssetsService.svc/GetAllAssetCategory',
  'UPLOADDOCUMENTGETDATA': environment.apiURL + 'PrefarService.svc/GetDocumentTypeId',
  'OSGETALLDATA': environment.apiURL + 'PrefarService.svc/GetAllOperatingSystemList',
  'CPUCLASSGETLISTALLDATA': environment.apiURL + 'PrefarService.svc/GetAllCPUClassList',
  'CPUSUBCLASSLISTGETALLDATA': environment.apiURL + 'PrefarService.svc/GetAllCPUSubClassList',
  'APPLICATIONTYPEGETDATA': environment.apiURL + 'PrefarService.svc/GetAllApplicationTypeList',
  'MODELTYPEGETDATA': environment.apiURL + 'PrefarService.svc/GetAllModelList',
  'GetAssetHeader': environment.apiURL + 'PrefarService.svc/GetAllTableColumnData',
  'GetAssetData': environment.apiURL + 'PrefarService.svc/GetMappingData',
  'MANUFACTUREGETDATA': environment.apiURL + 'PrefarService.svc/GetAllManufactureList',
  'GETGRNASSETDATA': environment.apiURL + 'GroupService.svc/GetGRNAssetData',
  'GETNONFARASSETDATA': environment.apiURL + 'GroupService.svc/GetNonFARAssetData',
  'INSERTNORMALASSETDATA': environment.apiURL + 'UploadService.svc/AddBulkFarDataWithMultipalExcelUploadGRNJson',
  'UPLOADDOCUMENTDATA': environment.apiURL + 'PrefarService.svc/GetDocumentTypeId',
  'LOCATIONDATABYTASKIDCOMPANYUSERID': environment.apiURL + 'UserMappingService.svc/GetUsersLocationsByTaskIdsCompanyUserId',
  'LOCATIONID': environment.apiURL + 'CompanyLocationService.svc/GetLocationsByCompanyIdToBindSelectList',
  'REVIEWCATEGORYDATA': environment.apiURL + 'PrefarService.svc/GetAssetCategoryListHavingErrors',
  'DeleteReview': environment.apiURL + 'PrefarService.svc/DeleteAssetsInErrors',
  'GETASSETLISTFORUPLOADERROR': environment.apiURL + 'PrefarService.svc/GetAssetListBySelectionForUploadError',
  'ADDBULKFARDATAWITHMULTIPALEXCELUPLOADGRNJSON': environment.apiURL + 'UploadService.svc/AddBulkFarDataWithMultipalExcelUploadGRNJson',
  'TAGMASTERGETDATA': environment.apiURL + 'PrintSetupService.svc/GetPrintSetupByCompanyDetailsJson',
  'TAGMASTERADDDATA': environment.apiURL + 'PrintSetupService.svc/AddPrintSetupList',
  'TAGMASTERUPDATEDATA': environment.apiURL + 'PrintSetupService.svc/UpdatePrintSetupList',
  'LABALDETAILGETDATA': environment.apiURL + 'LabelTypeService.svc/GetAllLabelContent',
  'INSERTLABELDATA': environment.apiURL + 'LabelTypeService.svc/AddLabelListJSON',
  'ASSETAPPROVAL': environment.apiURL + 'PrefarService.svc/MultipalAcceptAaprovalForAssets',
  'ASSETREJECTION': environment.apiURL + 'PrefarService.svc/MultipalAcceptRejectAaprovalForAssets',
  'GETTRANSACTIONIDSFORPHYSICALTRANSFER': environment.apiURL + 'ReconciliationService.svc/GetTransferIdsForPhysicalTransfer',
  'GETASSETFORPHYSICALTRANSFER': environment.apiURL + 'ReconciliationService.svc/GetAssetForPhysicalTransfer',
  'GETPHYSICALTRANSFERASSETLIST': environment.apiURL + 'ReconciliationService.svc/GetPhysicalTransferAssetList',
  'SAVEPHYSICALTRANSFERASSET': environment.apiURL + 'ReconciliationService.svc/SavePhysicalTransferAsset',
  'CHECKRIGHTS': environment.apiURL + 'ReconciliationService.svc/CheckRights',
  'GETASSETLISTTOINITIATERETIRE': environment.apiURL + 'AssetRetireService.svc/GetAssetListToInitiateRetire',
  'GETASSETSFORRETIREMENT': environment.apiURL + 'AssetRetireService.svc/GetAssetsForRetirement',
  'ADDRETIREDASSETDETAILS': environment.apiURL + 'AssetRetireService.svc/AddRetiredAssetDetails',
  'ADDRETIREDASSETDETAILSEXPIRED': environment.apiURL + 'AssetRetireService.svc/AddRetiredAssetDetailsExpired',
  'GETALLRETIREDASSETID': environment.apiURL + 'AssetRetireService.svc/GetAllRetiredAssetId',
  'GETASSETSTOAPPROVERETIRE': environment.apiURL + 'AssetRetireService.svc/GetAssetsToApproveRetire',
  'GETMULTIPLERETIREASSETFORALLLEVEL': environment.apiURL + 'AssetRetireService.svc/GetMultipleRetireAssetForAllLevel',
  'GETALLPHYSICALDISPOSALRETIREDASSETID': environment.apiURL + 'ReconciliationService.svc/GetAllPhysicalDisposalRetiredAssetId',
  'GETMAPPEDTASKIDSOFCUSERASSTRING': environment.apiURL + 'UserMappingService.svc/GetMappedTaskIdsOfCuserAsString',
  'GETASSETFORPHYSICALDISPOSAL': environment.apiURL + 'ReconciliationService.svc/GetAssetForPhysicalDisposal',
  'ASSETREADYTODISPOSAL': environment.apiURL + 'ReconciliationService.svc/AssetReadyToDisposal',
  'GETPHYSICALDISPOSALASSETLIST': environment.apiURL + 'ReconciliationService.svc/GetPhysicalDisposalAssetList',
  'SAVEPHYSICALTDISPOSALASSET': environment.apiURL + 'ReconciliationService.svc/SavePhysicalDisposalAsset',
  'GetAssetForPhysicalDisposalWithdrawRetire' :environment.apiURL + 'AssetRetireService.svc/GetAssetForPhysicalDisposalWithdrawRetire',

  'GETALLCUSTDATAWITHTYPE': environment.apiURL + 'PrefarService.svc/GetAllCustomizationDataWithType',
  'CHECKINVOICENOFORCREATEGRN': environment.apiURL + 'PrefarService.svc/CheckInvoiceNoForCreateGRN',
  'GETLOCATIONANDCATEGORYLIST': environment.apiURL + 'CompanyBlockService.svc/GetCategoryAndLocationListByConfiguration',
  'GETEXCELTOBINDDISPLAYLIST': environment.apiURL + 'PrefarService.svc/GetExcelToBindDisplayListForGRN',
  'GETEMPEMAILFORAUTOCOMP': environment.apiURL + 'UserDataService.svc/GetEmpEmailForAutoComplete',

  // For SuperAdmin Configuration
  'GETGROUPDETAILS': environment.apiURL + 'GroupService.svc/GetAllGroupDetails',
  'GETCONFIGURATIONMASTER': environment.apiURL + 'GroupService.svc/GetConfigurationDetails',
  'SAVECONFIGMASTER': environment.apiURL + 'GroupService.svc/SaveConfigurationDetailsForSAdmin',
  'GETCONFIGURATIONDETAILES': environment.apiURL + 'GroupService.svc/GetConfigurationDetails',
  'PAGEPERMISSIONFORMENUDISPLAY': environment.apiURL + 'UserDataService.svc/PagePermissionForMenuDisplay',
  'GETLOCATIONLISTBYCONFIGURATION': environment.apiURL + 'CompanyLocationService.svc/GetLocationListByConfiguration',
  'GETCATEGORYLISTBYCONFIGURATION': environment.apiURL + 'CompanyBlockService.svc/GetCategoryListByConfiguration',
  'GETFIELDLISTBYPAGEId': environment.apiURL + 'GroupService.svc/GetFieldListByPageId',
  'GetFieldListbyPage':environment.apiURL + 'GroupService.svc/GetFieldListbyPage',
 // 'GETFIELDLISTBY': environment.apiURL + 'GroupService.svc/GetFieldList',
  'GETFILTERIDLISYBYPAGEID': environment.apiURL + 'GroupService.svc/GetFilterIDlistByPageId',
  'MULTIPALACCEPTREJECTTRANSFERFORALLLEVEL': environment.apiURL + 'ReconciliationService.svc/MultipalAcceptRejectTransferForAllLevel',
  'ACCEPTREJECTTRANSFERNEWCCSL': environment.apiURL + 'ReconciliationService.svc/AcceptRejectTransferNewCCSL',
  'REQUESTFORRESUBMISSION': environment.apiURL + 'ReconciliationService.svc/RequestForReSubmission',
  'GETMULTIPLEASSETSFORWITHDRAWAL': environment.apiURL + 'ReconciliationService.svc/GetMultipleAssetsForWithdrawal',
  'MULTIPLEWITHDRAWTRANSFERBYINITIATOR': environment.apiURL + 'ReconciliationService.svc/MultipleWithdrawTransferByInitiator',
  'GETMULTIPALASSETFORREQUESTINFORMATION': environment.apiURL + 'ReconciliationService.svc/GetMultipalAssetForRequestInformation',
  'GETMULTIPALASSETFORREINTIATION': environment.apiURL + 'ReconciliationService.svc/GetMultipalAssetForReintiation',
  'RESUBMITFORAPPROVALWITHDOC': environment.apiURL + 'ReconciliationService.svc/ReSubmitForApprovalwithDoc',
  'REINITIATEDETAILSWITHDOC': environment.apiURL + 'ReconciliationService.svc/ReInitiateDetailswithDoc',
  'GETAPPROVALDETAILS': environment.apiURL + 'ReconciliationService.svc/GetApprovalDetails',
  'PERMISSIONRIGHTSBYUSERIDANDPAGEID': environment.apiURL + 'UserDataService.svc/PermissionRightsByUserIdAndPageId',
  'CLIENTCUSTOMIZATIONCHECKWETHERCONFIG': environment.apiURL + 'GroupService.svc/CheckWetherConfigurationExist',
  'CONFIGCHECKFORISAGENTUSEDORNOT': environment.apiURL + 'GroupService.svc/CheckWetherConfigurationExist',
  'GETADMINCONFIGURATIONMASTER': environment.apiURL + 'GroupService.svc/GetAdminConfigurationDetails',
  'SAVEADMINCONFIGMASTER': environment.apiURL + 'GroupService.svc/SaveAdminConfigurationDetails',
  'UPLOADDOCUMENTCEREATEGRNASSET': environment.apiURL + 'UploadService.svc/uploadDocumentCreateAsset',
  'UPLOADDOCUMENT': environment.apiURL + 'UploadService.svc/uploadDocument',
  'GETASSETBYID2': environment.apiURL + 'PrefarService.svc/GetAssetById2',
  'SETUPLOADMISSINGFILE': environment.apiURL + 'ReconciliationService.svc/setUploadMissingFile',
  'GETONLOADSUPERADMINDETAILS': environment.apiURL + 'GroupService.svc/GetAllSuperAdminConfigurationDetailsOnLoad',
  'DOWNLOADEXPORTFILE': environment.downloadExcel,


  //AssetClass
  'ASSETCLASSGETALL': environment.apiURL + 'CompanyBlockService.svc/GetBlockOfAssetsByCompany',
  'ASSETCLASSINSERT': environment.apiURL + 'CompanyBlockService.svc/AddBlocksList',
  'ASSETCLASSUPDATE': environment.apiURL + 'CompanyBlockService.svc/UpdateBlockAcronym',
  'ASSETCLASSDELETE': environment.apiURL + 'CompanyBlockService.svc/DeleteBlockOfAssets',
  'ASSETCLASSDELETECHECK': environment.apiURL + 'CompanyBlockService.svc/CheckAssetCountForBlock',
  'ASSETCLASSFILEINFO': environment.apiURL + 'CompanyBlockService.svc/AddBlocksFromExcel',
  'ASSETCLASSFILEEXPORT': environment.apiURL + 'CompanyBlockService.svc/GetBlockOfAssetsByCompanyForExport',
  'ITBLOCKUPDATE': environment.apiURL + 'CompanyBlockService.svc/SetITBlock',
  'NFARBLOCKUPDATE': environment.apiURL + 'CompanyBlockService.svc/SetNFARBlock',

  ///////////////// Series Defination //////////////////////
  'GETTOBINDCOMPANYSELECTLISTWITHUSERID': environment.apiURL + 'CompanyService.svc/GetToBindCompanySelectListWithCUserID',
  'GETSERIESDEFINATION': environment.apiURL + 'LabelTypeService.svc/GetSeriesDefinition',
  'SERIESPRINTING': environment.apiURL + 'LabelTypeService.svc/Seriesprinting',
  'INSERTSERIESDATA': environment.apiURL + 'LabelTypeService.svc/CreateSeriesDefinition',
  'COMPAIREBARCODE': environment.apiURL + 'LabelTypeService.svc/compaireBarcode',
  'GETASSETDETAIL': environment.apiURL + 'LabelTypeService.svc/GetAssetdetails',
  ///////////////// Series Defination //////////////////////

  //AdminConfig

  'GETONLOADADMINDETAILS': environment.apiURL + 'GroupService.svc/GetAllAdminConfigurationDetailsOnLoad',
  // 'INSERTSERIESDATA': environment.apiURL + 'LabelTypeService.svc/Seriesprinting',
  ///////////////// Series Defination //////////////////////
  'MANDATORYGETALLDATABYTABLENAME': environment.apiURL + 'GroupService.svc/MandatoryGetAllDataBYTableName',
  'GETALLDATPAGEFIELDMAPPINGBYMODULEID': environment.apiURL + 'GroupService.svc/GetAllDataPagefieldmappingByModuleID',
  'GETALLDATAPAGEFILTERMAPPINGBYMODULEID': environment.apiURL + 'GroupService.svc/GetAllDataPagefiltermappingByModuleID',


  'UPDATESERIESDEFINITION': environment.apiURL + 'LabelTypeService.svc/UpdateSeriesDefinition',
  ///////////////// Series Defination //////////////////////

  // Relationship
  'AllCITYDETAILS': environment.apiURL + 'CompanyLocationService.svc/GetLocationsByCompanyIdToBindSelectList',
  'UOMDETAILS': environment.apiURL + 'PrefarService.svc/GetUnitsForScrutiny',
  'QUANTITYSPLIT': environment.apiURL + 'PrefarService.svc/SplitByQtyAndCompleteScrutinySP',
  'COMPONENTSPLIT': environment.apiURL + 'PrefarService.svc/AddAssetSplitList',
  'ASSETTYPE': environment.apiURL + ' ITAssetsService.svc/getSubTypeBytype',
  'ASSETLISTTABLE': environment.apiURL + 'PrefarService.svc/GetAssetListBySelectionScrutinyJsons',
  'TYPEOFASSETLIST': environment.apiURL + 'ITAssetsService.svc/getTypeOfAssetList',
  'ASSETCLASS': environment.apiURL + 'CompanyBlockService.svc/GetCategoryListByConfiguration',
  'SUBMITGROUPSPLIT': environment.apiURL + 'PrefarService.svc/GroupAsset',
  'SEARCHASSET': environment.apiURL + 'PrefarService.svc/GetAssetIdsForAutoCompleteJson',
  'LOCATIONLIST': environment.apiURL + 'CompanyLocationService.svc/GetLocationListByConfiguration',
  'SEARCHASSETGROUP': environment.apiURL + 'PrefarService.svc/ListForSearchColumn',
  'TAGGING': environment.apiURL + 'PrefarService.svc/CompleteScrutinyJson',
  'SUBASSET': environment.apiURL + 'ITAssetsService.svc/getSubTypeOfAssetMasterList',
  'FILTERIDLIST': environment.apiURL + 'GroupService.svc/GetFilterIDlistByPageId',
  'FIELDIDLIST': environment.apiURL + 'GroupService.svc/GetFieldListByPageId',
  //Manage Group
  'GROUPLIST': environment.apiURL + 'PrefarService.svc/SearchAssetForManageGroup',
  'GETLABELIDTOBINDDISPLAYLIST': environment.apiURL + 'LabelTypeService.svc/GetlabelIdTOBindDisplaylists',

  ////////////////////Print Tag////////// 
  'GETPRINTDETAIL': environment.apiURL + 'LabelTypeService.svc/GetPrintDetails',
  'GETBARCODEAVAILABLECOUNT': environment.apiURL + 'LabelTypeService.svc/GetBarcodeAvailableCount',
  'GETPRINTSETUPBYCOPANYIDJSON': environment.apiURL + 'PrintSetupService.svc/GetPrintSetupByCompanyIdJson',
  'INSERTPRINTDETAIL': environment.apiURL + 'LabelTypeService.svc/Printdetails',
  'DOWNLOAD': environment.apiURL + 'LabelTypeService.svc/DownloadExcel',
  //Receive asset
  //'TRANSFERID': environment.apiURL + 'ReconciliationService.svc/GetAssetListToInwardAssets',
  'TRANSFERID': environment.apiURL + 'ReconciliationService.svc/GetAssetListToInwardAssetsTransferIds',
  'DISPLAYASSETS': environment.apiURL + 'ReconciliationService.svc/GetAssetListToInwardAssetsWithTransferId',
  'REVERTGRTIDASSETS': environment.apiURL + 'ReconciliationService.svc/GetAssetListToInwardAssets',
  'REVERTASSET': environment.apiURL + 'ReconciliationService.svc/MarkAssetsAsInwardOrRevert',
  'COSTCENTERLIST': environment.apiURL + 'CompanyRackService.svc/GetAllCostsCenterList',
  'LOCATIONUPDATEREVERT': environment.apiURL + 'CompanyRackService.svc/GetAllMappedRacksByLocId',
  'FINISHUPDATERECEIVE': environment.apiURL + 'ReconciliationService.svc/UpdateAssetDetailsOnInward',

  //Transfer Report
  'GETTRANSFERIDSFORTARNSFERREPORT': environment.apiURL + 'ReconciliationService.svc/GetTransactionIdsForReport',
  'GETTRANSFERINPROCESSDATA': environment.apiURL + 'ReportsService.svc/GetAssetRegisterDataTableBySp',
  'GETTRANSFERINPROCESSDATA1': environment.apiURL + 'ReportsService.svc/GetAssetRegisterDataTableByTable',
  'GETASSETREGISTERREPORTBYSP': environment.apiURL + 'ReportsService.svc/GetAssetRegisterReportBySp',
  'GETTRANSACTIONIDSFORTRANSITREPORT': environment.apiURL + 'ReconciliationService.svc/GetTransactionIdsForTransitReport',
  'GETCURENCYRATEFORCONVERSION': environment.apiURL + 'CompanyService.svc/GetCurencyRateForConversion',

  //Verify and Non verifiable assets
  'NONVERIFIABLE': environment.apiURL + 'ReportsService.svc/GetAssetRegisterReportBySp',
  // Tagging report
  'TAGGINGREPORT': environment.apiURL + 'RegionService.svc/GetRegionsToBindDisplayList',
  'TAGGINGCOMPANY': environment.apiURL + 'CompanyService.svc/GetCompaniesToBindDisplayList',
  'TAGGINGSBU': environment.apiURL + 'UserRoleService.svc/GetAllSBUByCompanyId',
  'TAGGINGPLANT': environment.apiURL + 'UserRoleService.svc/GetAllLocationsByCompanyId',
  'TAGGINGCATEGORY': environment.apiURL + 'UserRoleService.svc/GetAllCategoryByCompanyId',
  'TAGGINGASSETCLASS': environment.apiURL + 'CompanyBlockService.svc/GetBlockOfAssetsByCompany',
  'TAGGINGTYPE': environment.apiURL + 'ITAssetsService.svc/getTypeofAssetsJSON',
  'TAGGINGSUBTYPE': environment.apiURL + 'ITAssetsService.svc/getSubTypeBytype',
  'TAGGINGCURRENCY': environment.apiURL + 'CompanyService.svc/GetCurencyRateForConversion',
  'UPDATEEDITASSET': environment.apiURL + 'PrefarService.svc/UpdateEditAsset',
  'GETLASTPRINTBARCODE': environment.apiURL + 'LabelTypeService.svc/GetLastPrintBarcode',
  'GETBARCODE': environment.apiURL + 'LabelTypeService.svc/GetBarcode',
  'GetVerificationProjectListforInventoryReport': environment.apiURL + 'Auditservice.svc/GetVerificationProjectListforInventoryReport',
  'GetVerificationProjectListforInventoryReportSelfCert': environment.apiURL + 'Auditservice.svc/GetVerificationProjectListforInventoryReportSelfCert',
  'GetInventReport': environment.apiURL + 'ReportsService.svc/GetReport',
  //Inventory Asset
  'SBUINVENTORY': environment.apiURL + 'CompanyLocationService.svc/GetLocationsByCompanyIdForProjectToBindSelectList',
  'SUBINVENTORYCERTIFICATION': environment.apiURL + 'CompanyLocationService.svc/GetLocationsByCompanyIdForProjectToBindSelectListForSelfCert',
  'PROJECTIDVERIFICATION': environment.apiURL + 'AuditService.svc/GetVerificationProgressToBindSelectListlocationwiseAllloc',
  'PROJECTIDCERTIFICATION': environment.apiURL + 'AuditService.svc/GetVerificationProgressToBindSelectListlocationwiseAlllocForSC',
  'DisplayInventoryData': environment.apiURL + 'PrefarService.svc/GetAssetListBySelectionJsons',
  'GETALLMAPPEDRACKSBYLOCID': environment.apiURL + 'CompanyRackService.svc/GetAllMappedRacksByLocId',
  'GETEMPLOYEEBYSEARCHKEYWORD': environment.apiURL + 'UserDataService.svc/GetEmployeeBySearchKeyWord',
  'UPDATEASSETDETAILSONINWARD': environment.apiURL + 'ReconciliationService.svc/UpdateAssetDetailsOnInward',
  'CHECKGRNNUMBERDUPLICATE': environment.apiURL + 'UploadService.svc/CheckGrnNumberDuplicate',

  // SBU-location & Category Upload
  'SBUFILEINFOUPLOAD': environment.apiURL + 'PrefarService.svc/AddSBUFromExcel',
  'LOCATIONFILEINFOUPLOAD': environment.apiURL + 'CompanyLocationService.svc/AddlocationfromExcel',
  'RACKFILEINFOUPLOAD': environment.apiURL + 'CompanyRackService.svc/AddRackFromExcel',
  'ASSETCATEGORYUPLOAD': environment.apiURL + 'PrefarService.svc/AddCategoryFromExcel',
  'ASSETSUBTYPEUPLOAD': environment.apiURL + 'PrefarService.svc/AddSubTypeFromExcel',
  'ASSETTYPEUPLOAD': environment.apiURL + 'PrefarService.svc/AddTypeFromExcel',


  'MARKASSETSASINWARDORREVERT': environment.apiURL + 'ReconciliationService.svc/MarkAssetsAsInwardOrRevert',
  //Transer Dispatched
  'GETTRANSFERIDSFORTARNSFERDispatchedREPORT': environment.apiURL + 'ReconciliationService.svc/GetTransactionIdsForDispatchedReport',
  'APPROVALLISTBYUSERIDSTATUSANDTRANSFERID': environment.apiURL + 'PrefarService.svc/ApprovalListbyUserIdStatusAndTransferID',

  ///for cutofff 
  'SENDMAILOFADI': environment.apiURL + 'CompanyService.svc/SendOutboundMailOfADI',
  'GETPERIODWISEDESCREPANCYFILELIST': environment.apiURL + 'CompanyService.svc/GetPeriodwiseDescrepancyfileList',
  'GETPERIODWISEDESCREPANCYFILELISTForReport': environment.apiURL + 'CompanyService.svc/GetListofFilesByperiod',
  'GETDESCREPANCYLIST': environment.apiURL + 'CompanyService.svc/GetDescrepancyList',
  'RUNDESCREPANCY': environment.apiURL + 'CompanyService.svc/RunDescrepancy',
  'GETPERIODLIST': environment.apiURL + 'CompanyService.svc/GetPeriodList',
  'GETPERIODLISTFORDESCREPANCY': environment.apiURL + 'CompanyService.svc/GetPeriodListforDescrepancy',
  'UPDATECUTOFFPERIODETAILSBYPERIODID': environment.apiURL + 'CompanyService.svc/UpdateCutoffPeriodDetailsByPeridid',
  'AddCutOffDetailsForCurrentFiscalYear': environment.apiURL + 'CompanyService.svc/AddCutOffDetailsForCurrentFiscalYear',
  'MULTIPALACCEPTREJECTRETIREMENTFORALLAPPROVELEVEL': environment.apiURL + 'AssetRetireService.svc/MultipalAcceptRejectRetirementForAllApproveLevel',
  'REQUESTFORRESUBMISSIONRETIRE': environment.apiURL + 'AssetRetireService.svc/RequestForReSubmission',
  'GETAPPROVALDETAILSFORRETIRED': environment.apiURL + 'AssetRetireService.svc/GetApprovalDetailsForRetired',
  'GETMULTIPLERETIREASSETFORREQUESTINFORMATION': environment.apiURL + 'AssetRetireService.svc/GetMultipleRetireAssetForRequestInformation',
  'GETMULTIPLERETIREASSETFORREINTIATION': environment.apiURL + 'AssetRetireService.svc/GetMultipleRetireAssetForReintiation',
  'REINITIATERETIREDASSETDETAILS': environment.apiURL + 'AssetRetireService.svc/ReInitiateRetiredAssetDetails',
  'GETMULTIPLERETIREASSETFORFINANCEAPPROVER': environment.apiURL + 'AssetRetireService.svc/GetMultipleRetireAssetForFinanceApprover',
  'REJECTRETIREMENTBYMULTIPLEWITHDRAW': environment.apiURL + 'AssetRetireService.svc/RejectRetirementByMultipleWithdraw',
  'RESUBMITFORAPPROVAL': environment.apiURL + 'AssetRetireService.svc/ReSubmitForApproval',
  'APPROVALLISTBYUSERIDSTATUSANDRETIREDASSETID': environment.apiURL + 'PrefarService.svc/ApprovalListbyUserIdStatusAndRetiredAssetID',
  'UPDATEDISCREPANCYREASONS': environment.apiURL + 'CompanyService.svc/UpdateDiscrepacyReasons',
  'RUNDESCREPANCYWITHFILE': environment.apiURL + 'UploadService.svc/RunDescrepancywithfile',
  'GETPERIODWISEDESCREPANCYFILELISTALL': environment.apiURL + 'CompanyService.svc/GetPeriodwiseDescrepancyfileListAll',
  //View existing Roles
  'GetAllRoleListForViewExisting': environment.apiURL + 'UserRoleService.svc/GetAllRoleListByLevelForViewExisting',
  'DeleteRoleByLevel': environment.apiURL + 'UserRoleService.svc/DeleteRoleByLevel',
  'GetAllModuleListForViewRole': environment.apiURL + 'UserRoleService.svc/GetAllModuleListForViewRole',
  'GetAllModulePermissionListForViewRole': environment.apiURL + 'UserRoleService.svc/GetAllModulePermissionListForViewRole',
  'USERLISTFORVIEWROLE': environment.apiURL + 'UserRoleService.svc/GetUserListForViewRole',
  'LOCATIONLISTFORVIEWROLE': environment.apiURL + 'UserRoleService.svc/GetAllLocationsForViewRole',
  'CATEGORYLISTFORVIEWROLE': environment.apiURL + 'UserRoleService.svc/GetAllCategoryForViewRole',
  'GETDOCUMENTLISTBYTRANSFERID': environment.apiURL + 'ReconciliationService.svc/GetDocumentlistByTransferID',
  'GETDOCUMENTLISTBYRETIREASSETID': environment.apiURL + 'AssetRetireService.svc/GetDocumentlistByRetireAssetID',

  //get Report Count
  'GETREPORTCOUNT': environment.apiURL + 'ReportsService.svc/GetCountReportTable',

  //View ATF & ADF
  'GETATAF': environment.apiURL + 'ReportsService.svc/AssetTransferDownloadpdf',
  'GETATF': environment.apiURL + 'ReportsService.svc/AssetDispatchDownloadpdf',
  'GETADF': environment.apiURL + 'ReportsService.svc/AssetDiscardDownloadpdf',
  'DISPOSALDOCUMENTS': environment.apiURL + 'PrefarService.svc/GetPhysicalDisposalDocumentView',


  //Report rights wise location and category
  'LOCATIONRIGHTSWISE': environment.apiURL + 'PrefarService.svc/GetMultipleLocationsforReports',
  'CATEGORYRIGHTWISE': environment.apiURL + 'PrefarService.svc/GetMultipleCategoriesforReports',
  'COMPANYLISTFORREPORT': environment.apiURL + 'CompanyService.svc/CompanyListForReport',
  'GETPHOTOFORREPORT': environment.apiURL + 'PrefarService.svc/GetDocumentPath',
  'BLOCKSOFASSETSDATARIGHTWISE': environment.apiURL + 'CompanyBlockService.svc/GetBlockOfAssetsByCompanyIdUserIdRightWise',
  'GETEMPLOYEEFORALLOCATIONREPORT': environment.apiURL + 'UserDataService.svc/GetForAllocationReportListOfEmployee',
  'GETASSETIDLISTFORALLOCATION': environment.apiURL + 'ReportsService.svc/GetAssetIdListForAllocation', 
  'GETSUBASSETIDLISTFORALLOCATION': environment.apiURL + 'ReportsService.svc/GetSubIds', 
  'GETSPLITIDSFORALLOCATION': environment.apiURL + 'ReportsService.svc/GetSplitIds',
  'GETPHOTOFORINVENTORYREPORT': environment.apiURL + 'PrefarService.svc/GetDocumentPathForInventoryReport',

  //Create Project
  'GETPROJECTNAME': environment.apiURL + 'AuditService.svc/getProjectName',
  'UPDATEREJECTCOMMENTONPREPRINTADDITIONAL':environment.apiURL +'PrefarService.svc/UpdateRejectCommentOnPreprintAdditional',
  'GETSELFCERTPROJECTNAME': environment.apiURL + 'AuditService.svc/getSelfCertProjectName',
  'CHECKISZEROVALUEBLOCKCREATED': environment.apiURL + 'AuditService.svc/CheckIsZeroValueBlockCreated',
  'GETASSETDATAFORCREATEINVENTORYPROJECTBYSP': environment.apiURL + 'ReportsService.svc/GetAssetDataForCreateInventoryProjectBySp',
  'GETASSETDATAFORCREATEINVENTORYPROJECTBYSPFORVIEWMAP': environment.apiURL + 'ReportsService.svc/GetAssetDataForCreateInventoryProjectBySpForViewMap',
  'CREATEMULTIPLEVERIFICATIONPROJECTJSON': environment.apiURL + 'AuditService.svc/CreateMultipleVerificationProjectJSON',
  'GETBLOCKOWNERLISTFORCREATEINVENTORYPROJECT': environment.apiURL + 'AuditService.svc/GetBlockOwnerListForCreateInventoryProject',
  'GETBLOCKWITHMAPPINGDETAILSFORDISPLAY': environment.apiURL + 'AuditService.svc/GetBlockWithMappingDetailsForDisplay',
  'GETTOBINDDISPLAYLISTFORMAPPINGJSON': environment.apiURL + 'UserDataService.svc/GetToBindDisplayListForMappingJSON',
  'GETINVENTORYPROJECTLISTFORRECONCILITION': environment.apiURL + 'AuditService.svc/GetInventoryProjectListForReconcilition',
  'GetProjectIdListByCompanyIdLocationIdUserId': environment.apiURL + 'ReconciliationService.svc/GetProjectIdListByCompanyIdLocationIdUserId',
  'GETBLOCKWISEPROJECTLIST': environment.apiURL + 'AuditService.svc/GetBlockwiseProjectList',
  'COMPLETEPROJECT': environment.apiURL + 'AuditService.svc/CompleteProject',
  'GETASSETDATAFORCREATEINVENTORYPROJECTBYAPI': environment.apiURL + 'ReportsService.svc/GetAssetDataForCreateInventoryProjectByAPI',
  'GetAdditionalAssetCityList': environment.apiURL + 'CompanyLocationService.svc/GetToBindSelectListForInventoryAdditional',
  'GetAdditionalAssetListGridData': environment.apiURL + 'ReconciliationService.svc/GetNewAddtionalAssetDetailsListPartOfProject',
  'GETBLOCKWISEPROJECTLISTJSON': environment.apiURL + 'AuditService.svc/GetBlockwiseProjectListJson',
  'GETRECONCILIATIONASSETLIST': environment.apiURL + 'ReconciliationService.svc/GetReconciliationAssetList',
  'COMPLETEPROJECTBLOCKWISE': environment.apiURL + 'AuditService.svc/CompleteProjectBlockwise',
  'SETREVERTINTPBLOCKIDWISE': environment.apiURL + 'AuditService.svc/SetRevertInTPBlockIdWise',
  'SETREVERTINTPBLOCK': environment.apiURL + 'AuditService.svc/SetRevertInTPBlock',
  'SETSTATUSTOASSETLIST': environment.apiURL + 'ReconciliationService.svc/SetStatusToAssetList',
  'SENDMAILTOUSERFORMISSINGASSETS': environment.apiURL + 'ReconciliationService.svc/SendMailToUserforMissingAssets',
  'GETMISSINGNOTEINLIST': environment.apiURL + 'ReconciliationService.svc/getMissingNoteInList',
  'SETMISSINGSTATUS': environment.apiURL + 'ReconciliationService.svc/setMissingStatus',
  'POSTFILES': environment.apiURL + 'UploadService.svc/PostFiles',
  'GETDAMAGEDNOTINUSEDETAILSBLOCKWISE': environment.apiURL + 'PrefarService.svc/GetMissingAssetsBlockWiseForSendMail',
  'CheckForSendMailToOwner': environment.apiURL + 'PrefarService.svc/CheckMissingAssetsBlockWiseForSendMail',
  'GETUSEREMAILEMPCODE': environment.apiURL + 'UserDataService.svc/GetuserEmailuserCode',
  'NEWAPPROVEADDITIONALASSETS': environment.apiURL + 'ReconciliationService.svc/NewApproveAdditionalAssets',
  'DELETEASSETDOCUMENTBYID': environment.apiURL + 'PrefarService.svc/DeleteAssetDocumentById',
  'SENDMAILFORMISSINGASSETS': environment.apiURL + 'ReconciliationService.svc/sendMailForMissingAssets',
  'SENDMAILCONTENT': environment.apiURL + 'PrefarService.svc/SendMailContent',
  'GETMISSINGORDAMAGEASSETLISTBYCOMIDLOCIDPROJECTNAMEUSERID': environment.apiURL + 'UploadService.svc/GetMissingOrDamageAssetListByComIdLocIdProjectNameUserId',
  'SETMISSINGSTATUSNEW': environment.apiURL + 'UploadService.svc/setMissingStatus',
  'GetAssetDetailsByExcelAndBarcode':environment.apiURL + 'PrefarService.svc/GetAssetDetailsByExcelAndBarcode',
 

  //Inventory Report
  'GETPROJECTNAMEFORREPORT': environment.apiURL + 'AuditService.svc/GetVerificationProjectListforInventoryReportNew',
  'GETPROJECTNAMEFORREPORTPeriodWise': environment.apiURL + 'AuditService.svc/GetVerificationProjectListforInventoryReportByPeriod',
  'GetLOCATIONSFORREPORTRIGHTANDPROJECTWISE': environment.apiURL + 'AuditService.svc/GetLocationsforReportByProjectId',
  'GETINVENTORYREPORT': environment.apiURL + 'ReportsService.svc/GetReport', 

  //Close project
  'GETVERIFICATIONPROGRESS': environment.apiURL + 'AuditService.svc/GetVerificationProgressToBindSelectList',
  'GETCLOSEPROJECTDATA': environment.apiURL + 'AuditService.svc/GetVerificationProgressDetails1',
  'CLOSEPROJECT': environment.apiURL + 'AuditService.svc/CloseMultipeVerificationProject',
  'DELETEPROJECT': environment.apiURL + 'AuditService.svc/DeleteVerificationProject',
  'OPENPROJECTDETAILS': environment.apiURL + 'AuditService.svc/GetVerificationProgressDetails',


  //cut-off
  'EXPORTFILENAME': environment.apiURL + 'PrefarService.svc/ExportingDataOfExcelFile',

  //All Document Path
  'GETALLDOCUMENTPATH': environment.apiURL + 'PrefarService.svc/GetAllDocumentPath',
  'GETALLDOCUMENTPATHFORINVENTORYREPORT': environment.apiURL + 'PrefarService.svc/GetAllDocumentPathForInventoryReport',
  'GetPhysicalDispatchDocumentVIEW': environment.apiURL + 'PrefarService.svc/GetPhysicalDispatchDocumentView',
  // DashBoard 
  'GETDASHBOARDCOUNT': environment.apiURL + 'ReportsService.svc/GetDashBoardCount',
  'GETCOUNTFORDASHBOARDINVENTORYDUEDATES': environment.apiURL + 'ReportsService.svc/GetCountForDashBoardInventoryDueDates',
  'GETSSOURL': environment.apiURL + 'LoginService.svc/GetSsoURL',
  'GETINVENTORYLOCATIONIDSBYPROJECTNAMEPAGENAME': environment.apiURL + 'CompanyLocationService.svc/GetInventoryLocationIdsByProjectNamePageName',
  'GETTOGGLEPERMISSIONS': environment.apiURL + 'UserRoleService.svc/GetTogglePermissions',

  //assignment
  'GETASSETLISTFORUSERCUSTODIAN': environment.apiURL + 'PrefarService.svc/GetAssetListForUserCustodian',
  'GETPREFARIDLISTFORTAGGINGAPPROVAL': environment.apiURL + 'PrefarService.svc/GetPrefarIdListForTaggingApproval',
  'GETBYPREFARIDFORTAGGINGAPPROVAL': environment.apiURL + 'PrefarService.svc/GetByPrefarIdForTaggingApproval',

  //EmployeeSuggestion
  'GETLISTOFEMPLOYEE': environment.apiURL + 'CompanyService.svc/GetEmployeeListForCreateUser',
  'GETITASSETSFORUSERALLOCATION': environment.apiURL + 'ITAssetsService.svc/GetITAssetsForUserAllocation',
  'GETALLOCATIONTYPELIST': environment.apiURL + 'ITAssetsService.svc/getAllocationTypeList',
  'GETBYEMAILOREMPLOYEEID': environment.apiURL + 'UserDataService.svc/GetbyEmailOrEmployeeId',
  'UPDATEASSET': environment.apiURL + 'PrefarService.svc/UpdateAsset',
  'UPDATEUSERDETAILS': environment.apiURL + 'ITAssetsService.svc/updateUserDetails',
  'GETASSETSFORUSERALLOCATION': environment.apiURL + 'PrefarService.svc/GetAssetsForUserAllocation',
  'GETASSETSFORUSERUNALLOCATION': environment.apiURL + 'PrefarService.svc/GetAssetsForUserUnallocation',
  'SEARCHUSERSFORASSETUNALLOCATION': environment.apiURL + 'PrefarService.svc/SearchUsersForAssetUnAllocation',
  'SEARCHUSERSFORASSETUNALLOCATIONFORLINK': environment.apiURL + 'PrefarService.svc/SearchUsersForAssetUnAllocationForLink',
  'ASSETUNALLOCATION': environment.apiURL + 'PrefarService.svc/AssetUnallocation',
  'GETASSETLISTBYCOMPANYIDGROUPIDUSEREMAILIDALLOCATION': environment.apiURL + 'UploadService.svc/GetAssetListByCompanyIdGroupIdUserEmailIdAllocation',
  'USERALOCATIONACTION': environment.apiURL + 'UploadService.svc/UserAlocationAction',
  'RESENDMAIL': environment.apiURL + 'PrefarService.svc/ResendMail',

  'GETCURRENCYICON': environment.apiURL + 'ReportsService.svc/GetCurrencyIcon',
  'GETASSETSTOGROUP': environment.apiURL + 'PrefarService.svc/GetAssetsToGroup',
  'GETSUBGROUPJSON': environment.apiURL + 'PrefarService.svc/GetSubGroupJson',
  'GETVALUESTOCOMPAREFORMAPPREPRINTEDADDITIONALASSET': environment.apiURL + 'AuditService.svc/getValuesToCompareForMapPrePrintedAdditionalAsset',
  'GETPREPRINTEDADDITIONALASSETLIST': environment.apiURL + 'AuditService.svc/GetPrePrintedAdditionalAssetList',
  'GetAdditionalType': environment.apiURL + 'AuditService.svc/GetAdditionalType',
  'GetAssetListForReprintLabelsJSON': environment.apiURL + 'LabelTypeService.svc/GetAssetListForReprintLabelsJSON',
  'GetReconciliationAssetListForLabelStatusdto': environment.apiURL + 'ReconciliationService.svc/GetReconciliationAssetListForLabelStatusdto',
  'APPROVECHANGEFORPREPRINTEDADDITIONALASSETMAP': environment.apiURL + 'AuditService.svc/ApproveChangeForPrePrintedAdditionalAssetMap',
  'GETCHANGEDASSETDETAILSLIST': environment.apiURL + 'ReconciliationService.svc/GetChangedAssetDetailsList',
  'GETBYIDFORCHANGECASE': environment.apiURL + 'PrefarService.svc/GetByIdForChangeCase',
  'GETASSETFORPOTENTIALMATCHJSON': environment.apiURL + 'AuditService.svc/GetAssetForPotentialMatchJson',
  'DELETEADDITIONALASSETS': environment.apiURL + 'AuditService.svc/DeleteAdditionalAssets',
  'DOWNLOADEXCELFORREPRINTLABELS': environment.apiURL + 'LabelTypeService.svc/DownloadExcelForReprintLabels',
  'NEWAPPROVECHANGEFORPREPRINTEDADDITIONALASSETMAP' : environment.apiURL + 'AuditService.svc/NewApproveChangeForPrePrintedAdditionalAssetMap',

  //For Notification
  'GETNOTIFICATIONMODELWISE' : environment.apiURL + 'GroupService.svc/GetNotificationTemplateModuleWise',
  'GETEVENTDATA': environment.apiURL + 'GroupService.svc/GetTemplateData',
  'UPDATEEVENTBASEDDATA':environment.apiURL + 'GroupService.svc/UpdateNotificationTemplate',
  'GETNOTIFICATIONSHEDULEDBASED' :environment.apiURL + 'GroupService.svc/GetNotificationTemplateModuleWiseScheduledBased',
  'UPDATESCHEDULEDBASEDDATA':environment.apiURL + 'GroupService.svc/UpdateNotificationTemplateScheduledBase',
  'GETASSETDATAFORCREATEINVENTORYPROJECTBYAPILOCATIONWISE':environment.apiURL + 'ReportsService.svc/GetAssetDataForCreateInventoryProjectByAPILocationWise',
  'GETASSETDATAFORCREATEINVENTORYPROJECTBYAPICATEGORYWISE':environment.apiURL + 'ReportsService.svc/GetAssetDataForCreateInventoryProjectByAPICategoryWise',
  'GETASSETIDSFORAUTOCOMPLETEJSON':environment.apiURL + 'PrefarService.svc/GetAssetIdsForAutoCompleteJson',
  'SENDFORRETAGGING':environment.apiURL + 'ReconciliationService.svc/SendForReTagging',
  'NOTIFICATIONROLESGETALLDATA': environment.apiURL + 'UserRoleService.svc/GetAllRoleListByGroupNotification',
  // 'InsertData': environment.apiURL + 'GroupService.svc/InsertIntoLicenseTable',
  // 'UpdateData': environment.apiURL + 'GroupService.svc/UpdateLicenseTable',
  // 'GETGridata': environment.apiURL + 'GroupService.svc/GetAllLicenseUsageData',
  // 'GetAllLicenseData': environment.apiURL + 'GroupService.svc/GetLicenseDetails',
  'GETMANDATORYBYFLAG': environment.apiURL + 'GroupService.svc/GetMandatoryByFlag',
  'GetClientName' : environment.apiURL + 'GroupService.svc/GetClientName',
  'GETVERSION': environment.apiURL + 'LoginService.svc/GetVersion',
  'CHECKFREEZEPERIODSTATUS': environment.apiURL + 'UserDataService.svc/CheckFreezePeriodStatus',
  'ISASSETIDDUPLICATE': environment.apiURL + 'PrefarService.svc/IsAssetIdDuplicate',
  'ISASSETIDANDACQDATEDUPLICATE': environment.apiURL + 'PrefarService.svc/IsAssetIdAndAcqDateDuplicate',
  'ISAIDSAMEDIFFBLOCK': environment.apiURL + 'PrefarService.svc/IsAIDSameDiffBlock',

  ///edit asset
  'IsAssetIdAndSubNoDuplicate': environment.apiURL + 'PrefarService.svc/IsAssetIdAndSubNoDuplicate',
  'APPROVEREJECTCHANGESNEW': environment.apiURL + 'ReconciliationService.svc/ApproveRejectChangesNew',
  'GETSSODETAILS':environment.apiURL + 'GroupService.svc/GetSSODetails',
  'GETUSERDETAILSBYUSERNAME':environment.apiURL + 'LoginService.svc/GetUserDetailsByUserName',
  // notification panal
  'GETNOTIFICATIONTEMPLATEMODULEWISEBYCLIENTNAME' : environment.apiURL + 'GroupService.svc/GetNotificationTemplateModuleWiseByClientName',
  'GETNOTIFICATIONCOUNT': environment.apiURL + 'GroupService.svc/Getnotificationcount',
  'CREATEDUPLICATETEMPLATE': environment.apiURL + 'GroupService.svc/CreateDuplicateTemplate',
  'UPDATENOTIFICATIONTEMPLATEFORNOTIFICATION': environment.apiURL + 'GroupService.svc/UpdateNotificationTemplateforNotification',
  'INIT': environment.apiURL + 'GroupService.svc/Init',
  'UPLOADPHYSICALDISPOSALDOCUMENT': environment.apiURL + 'UploadService.svc/UploadPhysicalDisposalDocument',
  'GETDOCUMENTLISTBYPHYSICALTRANSFER': environment.apiURL + 'ReconciliationService.svc/GetDocumentlistByPhysicalTransfer',
  //License
  'INSERTINTOLICENSETABLE': environment.apiURL + 'GroupService.svc/InsertIntoLicenseTable',
  'GETALLLICENSEDETAILS': environment.apiURL + 'GroupService.svc/GetAllLicenseDetails',
  'GETLICENSETERMSBYID': environment.apiURL + 'GroupService.svc/GetLicenseTermsById',
  'INSERTINTOLICENSETERM': environment.apiURL + 'GroupService.svc/InsertIntoLicenseTerm',
  'GETLICENSECOMPANYDISTRIBUtIONBYID': environment.apiURL + 'GroupService.svc/GetLicenseCompanyDistributionById',
  'INSERTINTOLICENSEOVERUSAGE' : environment.apiURL + 'GroupService.svc/InsertIntoLicenseOverUsage',
  'UPDATELICENSEOVERUSAGETERM' : environment.apiURL + 'GroupService.svc/UpdateLicenseOverusageTerm',
  'UPDATELICENSETABLE' :  environment.apiURL + 'GroupService.svc/UpdateLicenseManagement',

  'INSERTSSOCREDENTIALS': environment.apiURL + 'UserRoleService.svc/InsertSSOCredentials',
  'SAVEGROUPWISECONFIGURATIONDETAILS': environment.apiURL + 'GroupService.svc/SaveGroupWiseConfigurationDetails',
  //ITAM
  'getNetworkInventoryAssets': environment.apiURL + 'itam/api/getNetworkInventoryAssets',
  'unmappedassets': environment.apiURL + 'itam/api/getNetworkInventoryAssets/unmappedassets',
  'getautomatchassets': environment.apiURL + 'itam/api/getNetworkInventoryAssets/getautomatchassets',
  'getautomatchassetshow': environment.apiURL + 'itam/api/getNetworkInventoryAssets/getautomatchassetshow',
  'getAssetsdetails': environment.apiURL + 'itam/api/getNetworkInventoryAssets/getAssetsdetails',
  'manuallymapassets': environment.apiURL + 'itam/api/getNetworkInventoryAssets/manuallymapassets',
  'hardwareChangeReport': environment.itamUrl + 'api/HardwareChangeReport',
  'getSWListByITSerialNo': environment.itamUrl + 'api/getSWListByITSerialNo',
  'getpcsoftwaredetails': environment.itamUrl + 'api/getNetworkInventoryAssets/getpcsoftwaredetails',
  
  'getNetworkInventoryFilters': environment.apiURL + 'itam/api/getNetworkInventoryFilters',
  'getSoftwareType': environment.itamUrl + 'api/getSoftwaretype',
  'getSoftwareCategory': environment.itamUrl + 'api/getSoftwareCategory',
  'getManufacturer': environment.itamUrl + 'api/manufacturer/get',
  'insertManufacturer': environment.itamUrl + 'api/manufacturer/insert',
  'getSuiteSoftwareComponent': environment.itamUrl + 'api/getSuiteComponentSoftware',
  'addNewSoftware': environment.itamUrl + 'api/softwaremaster/insert',
  'deleteScannedSoftware': environment.itamUrl + 'api/softwaremaster/delete',
  'getScannedSoftwareList': environment.itamUrl + 'api/softwaremaster/scannedsoftwarelist',
  'getSuiteSoftwareList': environment.itamUrl + 'api/softwaresuitemaster/suitesoftwarelist',
  'getSoftwareSuite' : environment.itamUrl + 'api/softwaresuitemaster/getSoftwareSuite',
  'getSoftwareSuiteList': environment.itamUrl + 'api/softwaresuitemaster/suitesoftwarelist',
  'deleteSuiteSoftware': environment.itamUrl + 'api/softwaresuitemaster/delete',
  'getLicenseType' : environment.itamUrl + 'api/softwarelicense/licenseTypes/get',
  'getLicenseOption' : environment.itamUrl + 'api/softwarelicense/getsoftwarelicenseoption',
  'getLicenseField' : environment.itamUrl + 'api/softwarelicense/licensetypefields/get',
  'getFieldMaster' : environment.itamUrl + 'api/softwarelicense/dropdown/fieldmaster',
  'getLicensePurchased' : environment.itamUrl + 'api/softwarelicense/getsoftwarelicensepurchased',
  'getSoftwareVendor' : environment.itamUrl + 'api/getSoftwareVendor',
  'insertUpdateNewSoftwareSuite' : environment.itamUrl + 'api/softwaresuitemaster/insert_update',
  'getmanagedsoftware' : environment.itamUrl + 'api/softwarelicense/getmanagedsoftware',
  'insertSoftwareLicense' : environment.itamUrl + 'api/softwarelicense/insert',
  'getSoftwareLicenseList' : environment.itamUrl + 'api/softwarelicense/getdetails',
  'getSoftwareDetails' : environment.itamUrl + 'api/softwaremaster/details',
  'deleteSoftwareLicense' : environment.itamUrl + 'api/softwarelicense/deletesoftwarelicense',
  'getSoftwareInstallationdetails' : environment.itamUrl + 'api/softwaremaster/tab_softwareInstallationdetails',
  'insertSoftwareLicenseType': environment.itamUrl + 'api/softwarelicense/licenseTypes/insert',  
  'getDowngradeRightsDetails': environment.itamUrl + 'api/softwarelicense/downgraderights/getdetails',  
  'modifyaction': environment.itamUrl + 'api/softwaremaster/modify_action', 
  'movetoaction': environment.itamUrl + 'api/softwaremaster/moveto_action', 
  'getsoftwarecompliancetype' : environment.itamUrl + 'api/getsoftwarecompliancetype',
  'getunmanagedsoftware' : environment.itamUrl + 'api/softwarelicense/getunmanagedsoftware',
  'updatemanagedsoftware' : environment.itamUrl + 'api/softwarelicense/updatemanagedsoftware',
  'updatesoftware' : environment.itamUrl + 'api/softwaremaster/update',
  'SuiteComponentSoftwareMaster' : environment.itamUrl + 'api/softwaresuitemaster/SuiteComponentSoftwareMaster/getGridData',
  'getTrackby' : environment.itamUrl + 'api/softwarelicense/trackby/get',
  'getInstallationsallowed' : environment.itamUrl + 'api/softwarelicense/softwarelicenseinstallationsallowed/get',
  'getsoftwarelicenseoption': environment.itamUrl + 'api/softwarelicense/getsoftwarelicenseoption',
  'getRoleList': environment.itamUrl + 'api/softwaremaster/role/get',
  //  For check group exist through superadmin login
  'checkGroupMasterTableData': environment.apiURL + 'GroupService.svc/checkGroupMasterTableData',
  'INSERTINTOCOMPANYDISTRIBUTION': environment.apiURL + 'GroupService.svc/InsertIntoCompanyDistribution',
  'ADDDISPLAYNAMETOCLIENTHEADERFILE': environment.apiURL + 'GroupService.svc/AddDisplayNameToClientHeaderFile',

  //CMMS
  //--orderTypes
  'getOrdertypes': environment.cmmsUrl + 'OrderTypes/GetDetail',
  'addEditOrderType': environment.cmmsUrl + 'OrderTypes',
  'deleteOrderType': environment.cmmsUrl + 'OrderTypes',
  'GetAssetTypesByCategoryIds': environment.cmmsUrl + 'BlockTypeOfAssetMapping/GetTypeByCategory',
  'getAssetSubTypesByTypeIds': environment.cmmsUrl + 'TypeSubtypeofAssetMapping/GetSubTypeByTypeAndByLevel',
  'getIssueTypesWithMapping': environment.cmmsUrl + 'IssueTypes/GetDetailByFilter',
  'getIssueTypeByIssueId': environment.cmmsUrl + 'IssueTypes/GetById',

  //--issueTypes
  'getIssueTypesByOrderId': environment.cmmsUrl + 'IssueTypes/GetDetailByOrderTypeID',
  'addEditIssueType': environment.cmmsUrl + 'IssueTypes',
  'deleteIssueType': environment.cmmsUrl + 'IssueTypes',
  'getIssueTypes': environment.cmmsUrl + 'IssueTypes/GetDetail',

  //issueTypes Mapping
  'GetMappingByIssueTypeID': environment.cmmsUrl + '/IssueTypeMapping/GetByIssueTypeID',

  //Parts Purchase
  'GetPartsByFilter': environment.cmmsUrl + '/Parts/GetDetailByFilter',
  'GetById': environment.cmmsUrl + '/Parts/GetById',
  'GetAllParts': environment.cmmsUrl + '/Parts/GetDetail',

  //Parts Inventory
  'GetAllPartsInventory': environment.cmmsUrl + 'PartsInventory/GetDetail',
  'GetParsWithFilter': environment.cmmsUrl + 'PartsInventory/GetDetailByFilter',
  'GetPartInventoryByID': environment.cmmsUrl + 'PartsInventory/GetById',
  'PartInventory': environment.cmmsUrl + 'PartsInventory',

  //WorkOrders
  'GetAllWorkOrders': environment.cmmsUrl + 'WorkOrders/GetDetail',
  'GetPreFARbyLocationID': environment.cmmsUrl + 'PreFAR/GetPrefar',
  'AddWorkOrder': environment.cmmsUrl + 'WorkOrders/Post',
  'GetWorkOrderByFilter': environment.cmmsUrl + 'WorkOrders/GetDetailByFilter',

  //Criticality
  'GetAllCriticalityTypes': environment.cmmsUrl + 'Criticality/GetDetail',
  
  //AdditionaAsset
  'DELETEADDITIONALASSETSBYID':  environment.apiURL + 'ReconciliationService.svc/DeleteAdditionalAssetsById',
  'GETCONFIGURATIONVALUE': environment.apiURL + 'GroupService.svc/getConfigurationvalue',

   //StandardViemMapping
   'GETALLCATEGORIES': environment.apiURL + 'GroupService.svc/GetAllCategories',
   'GETSTANDARDTABLENAME': environment.apiURL + 'GroupService.svc/GetTabledetail',
   'SAVEFIELDSTANDARDVIEW': environment.apiURL + 'GroupService.svc/SaveFieldStandardView',
   'GETALLSTANDARDANDCUSTOMECATEGORIES': environment.apiURL + 'GroupService.svc/GetallstandardAndCustomecategories',
   'GETFIELDBYVIEWID': environment.apiURL + 'GroupService.svc/GetFieldsByViewId',
   'SAVECUSTOMEVIEW': environment.apiURL + 'GroupService.svc/SaveCustomeView',
   'GETCUSTOMEFIELD' : environment.apiURL + 'GroupService.svc/GetCustomField',
   'SAVEFIELDCUSTOMVIEW' : environment.apiURL + 'GroupService.svc/SaveFieldCustomView',
   'GETCUSTOMEVIEW': environment.apiURL + 'GroupService.svc/GetCustomView',
   'GetAssetDetailsWithGroupJsonComponent' : environment.apiURL + 'PrefarService.svc/GetAssetDetailsWithGroupJsoncomponent',
   'GetAllViewData' : environment.apiURL + 'PrefarService.svc/GetAllViewData',

   'GETAPPROVALLEVELAVAILABLE':environment.apiURL + 'ReconciliationService.svc/GetPendingApprovalNamefromprefarId',
   'GETAPPROVALLEVELAVAILABLERETIREMENT':environment.apiURL + 'AssetRetireService.svc/GetPendingApprovalNamefromprefarIdForRetirment',   
   
   'GetBlockOfAssetsByCompanyAssetCategoryId':environment.apiURL + 'CompanyBlockService.svc/GetBlockOfAssetsByCompanyAssetCategoryId',
   'UPLOADDOCUMENTCEREATEASSET': environment.apiURL + 'UploadService.svc/uploadDocumentCreateAsset',
   'GetLogoByConfigurationId':environment.apiURL + 'GroupService.svc/GetLogoByConfigurationId',
  
   //For Rfid Api
   'GETRFIDDATA':environment.apiURL + 'AssetMovementPage/api/assetmovement/list'
   
}