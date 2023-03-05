import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { APIConstants} from '../../apiEndpoints/apiFile';
import { Observable } from 'rxjs/Observable';


@Injectable({
    providedIn: 'root'
})
export class UserRoleService {
    constructor(private http: HttpClient) { }


//For Configuration
    GetAllModuleData():Observable<any> {
           
        return this.http.get(APIConstants.MODULESGETALLDATA)
      }

      GetAllModulePermissionData():Observable<any> {
           
        return this.http.get(APIConstants.MODULEPERMISSIONGETALLDATA)
      }

      GetModulePermissionDataById(Id):Observable<any> {
           
        let params = new HttpParams();
        params = params.append('moduleId', Id);
        return this.http.get(APIConstants.MODULEPERMISSIONGETDATABYID, { params: params })
      }

      UpdateModuleAndPermissionConfiguration(data):Observable<any> {
           
          return this.http.post(APIConstants.UPDATEMODULEANDPERMISSIONCONFIGURATION,data)
        }

//For Create Role
      GetAllModuleDataByLevel(GroupID,RegionID,CompanyID):Observable<any> {
           
        let params = new HttpParams();
        params = params.append('groupId', GroupID);
        params = params.append('regionId', RegionID);
        params = params.append('companyId', CompanyID);
        return this.http.get(APIConstants.MODULESGETALLDATABYLEVEL, { params: params })
      }

      GetAllModulePermissionDataforCreateRole():Observable<any> {
           
        return this.http.get(APIConstants.MODULEPERMISSIONGETALLDATAForCreateRole)
      }

      CreateRoleByLevel(GroupID,RegionID,CompanyID,RoleName,UserId):Observable<any> {
           
        let params = new HttpParams();
        params = params.append('groupId', GroupID);
        params = params.append('regionId', RegionID);
        params = params.append('companyId', CompanyID);
        params = params.append('roleName', RoleName);
        params = params.append('userId', UserId);
        return this.http.get(APIConstants.CREATEROLEBYLEVELVALUE, { params: params })
      }

      AddRoleToModuleAndPermission(data):Observable<any> {
           
          return this.http.post(APIConstants.ADDROLEANDMODULEPERMISSIONS,data)
        }


      //User Role Mapping Methods
      GetAllUsers(GroupId):Observable<any> {
           
        let params = new HttpParams();
        params = params.append('groupId', GroupId);
        return this.http.get(APIConstants.USERSGETALLDATA, { params: params })
      }  

      GetAllRolesByLevel(GroupID,RegionID,CompanyID):Observable<any> {
           
        let params = new HttpParams();
        params = params.append('groupId', GroupID);
        params = params.append('regionId', RegionID);
        params = params.append('companyId', CompanyID);
        return this.http.get(APIConstants.ROLESGETALLDATA, { params: params })
      }

      GetAllSBU(CompanyId):Observable<any> {
           
        let params = new HttpParams();
        params = params.append('companyId', CompanyId);
        return this.http.get(APIConstants.SBUGETALLBYCOMPANYID, { params: params })
      }  

      GetAllLocations(CompanyId):Observable<any> {
           
        let params = new HttpParams();
        params = params.append('companyId', CompanyId);
        return this.http.get(APIConstants.LOCATIONGETALLBYCOMPANYID, { params: params })
      }  

      GetAllCategory(CompanyId):Observable<any> {
           
        let params = new HttpParams();
        params = params.append('companyId', CompanyId);
        return this.http.get(APIConstants.CATEGORYGETALLBYCOMPANYID, { params: params })
      }  

      GetUserAssignmentsByLevel(GroupID,RegionID,CompanyID, UserId , LocationIdList):Observable<any> {
           
        let params = new HttpParams();
        params = params.append('groupId', GroupID); 
        params = params.append('regionId', RegionID);
        params = params.append('companyId', CompanyID);
        params = params.append('userId', UserId);
        params = params.append('LocationIdList', LocationIdList);
        return this.http.get(APIConstants.GETALLASSIGNMENTBYUSERID, { params: params })
      }

      GetAssignmentsByRole(RoleId,GroupID,RegionID,CompanyID , LocationIdList):Observable<any> {
           
        let params = new HttpParams();
        params = params.append('roleId', RoleId); 
        params = params.append('groupId', GroupID); 
        params = params.append('regionId', RegionID);
        params = params.append('companyId', CompanyID);
        params = params.append('LocationIdList', LocationIdList);
        return this.http.get(APIConstants.GETALLASSIGNMENTBYROLE, { params: params })
      }

      AddUserRoleMapping(data):Observable<any> {
           
          return this.http.post(APIConstants.USERROLEMAP,data)
        }

      DeleteUserRoleMapping(data):Observable<any> {
           
          return this.http.post(APIConstants.DELETEUSERROLEMAP,data)
        }
      

        //View Existing Role
        
    GetAllRoleList(groupId,regionId,companyId):Observable<any> {           
      let params = new HttpParams();
      params = params.append('groupId', groupId);
      params = params.append('regionId', regionId);
      params = params.append('companyId', companyId);
      return this.http.get(APIConstants.GetAllRoleListForViewExisting, { params: params })
    }

    ViewRoles(groupId,regionId,companyId,roleId):Observable<any> {           
      let params = new HttpParams();
      params = params.append('groupId', groupId);
      params = params.append('regionId', regionId);
      params = params.append('companyId', companyId);
      params = params.append('roleId', roleId);
      return this.http.get(APIConstants.GetAllModuleListForViewRole, { params: params })
    }
    
    permissions(roleId):Observable<any> {           
      let params = new HttpParams();
      params = params.append('roleId', roleId);
      return this.http.get(APIConstants.GetAllModulePermissionListForViewRole, { params: params })
    }

    DeleteRoleByLevel(DeleteRole){
      return this.http.post(APIConstants.DeleteRoleByLevel,DeleteRole)
    }


    UsersForViewRole(groupId,roleId,regionId,companyId):Observable<any> {           
      let params = new HttpParams();
      params = params.append('groupId', groupId);
      params = params.append('roleId', roleId);
      params = params.append('regionId', regionId);
      params = params.append('companyId', companyId);
      return this.http.get(APIConstants.USERLISTFORVIEWROLE, { params: params })
    }

    LocationsForViewRole(companyId,RoleId, UserId):Observable<any> {           
      let params = new HttpParams();
      params = params.append('companyId', companyId);
      params = params.append('roleId', RoleId);
      params = params.append('userId', UserId);
      return this.http.get(APIConstants.LOCATIONLISTFORVIEWROLE, { params: params })
    }

    CategoriesForViewRole(companyId,RoleId, UserId, LocationId):Observable<any> {           
      let params = new HttpParams();
      params = params.append('companyId', companyId);
      params = params.append('roleId', RoleId);
      params = params.append('userId', UserId);
      params = params.append('locationId', LocationId);
      return this.http.get(APIConstants.CATEGORYLISTFORVIEWROLE, { params: params })
    }

    GetTogglePermissions():Observable<any> { 
      return this.http.get(APIConstants.GETTOGGLEPERMISSIONS)
    } 

    InsertSSOCredentials(SSODetails):Observable<any>{
      return this.http.post(APIConstants.INSERTSSOCREDENTIALS,SSODetails)
    }


}