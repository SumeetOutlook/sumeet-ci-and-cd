import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as header from '../../../assets/Headers.json';

interface IMenuItem {
  type: string; // Possible values: link/dropDown/icon/separator/extLink
  name?: string; // Used as display text for item and title for separator type
  state?: string; // Router state
  icon?: string; // Material icon name
  tooltip?: string; // Tooltip text
  disabled?: boolean; // If true, item will not be appeared in sidenav.
  sub?: IChildItem[]; // Dropdown items
  badges?: IBadge[];
}
interface IChildItem {
  type?: string;
  name: string; // Display text
  state?: string; // Router state
  icon?: string;
  tooltip?: string;
  sub?: IChildItem[];
}

interface IBadge {
  color: string; // primary/accent/warn/hex color codes(#fff000)
  value: string; // Display text
}

@Injectable()
export class NavigationService {
  Headers: any = (header as any).default;

  iconMenuDefault: IMenuItem[] = []

  iconMenu: IMenuItem[] = [
    {
      name: "Home Page",
      type: "link",
      tooltip: "Home Page",
      icon: "home",
      state: "dashboard",
      // sub: [
      //   { name: "Default", state: "default" },
      //   { name: "Analytics", state: "analytics" },
      //   { name: "Cryptocurrency", state: "crypto" },
      //   { name: "Dark Cards", state: "dark" }
      // ]
    },
    {
      name: "Create Masters",
      type: "dropDown",
      tooltip: "Create Masters",
      icon: "featured_play_list",
      state: "master",
      sub: [
        {
          name: "Asset Categories",
          type: "dropDown",
          state: "",
          sub: [
            { name: "Category Type / Subtype", state: "category_type_subtype", tooltip: "Category Type/Subtype"},
            { name: "Asset Class", state: "asset_class", tooltip: "Asset Class" },
            { name: "Category and Asset Class Mapping", state: "mapping", tooltip: "Category and Asset Class Mapping" },
           
          ]
        },
        {
          name: "Label Master",
          type: "dropDown",
          state: "",
          sub: [
            { name: "Label Content", state: "tag_master", tooltip: "Label Content" },
            { name: "Define Series", state: "defineseries", tooltip: "Define Series" },

          ]
        },
        { name: "Create Group/Region and Legal Entity", state: "group", tooltip: "Create Group/Region and Legal Entity" },
        { name: "SBU Location/Storage_location", state: "SBU_location", tooltip: "SBU Location/Storage_location" },
        { name: "Other Masters", state: "other_masters", tooltip: "Other Masters" },
        { name: "Currency Exchange Rates", state: "currency", tooltip: "Currency Exchange Rates" },
        
      ]
    },
    {
      name: "Create Assets",
      type: "dropDown",
      tooltip: "Create Assets",
      icon: "featured_play_list",
      state: "create_assets",
      sub: [
        { name: "Upload Assets", state: "create-assets", tooltip: "create-assets" },
        { name: "Edit Asset", state: "edit_asset", tooltip: "Edit Asset" },
        { name: "Review Assets", state: "review_assets", tooltip: "Review Assets" },
        
      ]
    },
    {
      name: "Relationship Management",
      type: "dropDown",
      tooltip: "Relationship Management",
      icon: "group_work",
      state: "relationship",
      sub: [
        { name: "Define Relationship", state: "assetrelationship", tooltip: "Define Relationship" },
        { name: "Manage Group", state: "managegroup", tooltip: "Manage Group" }
        
      ]
    },
    {
      name: "Asset Audit",
      type: "dropDown",
      tooltip: "Asset Audit",
      icon: "check_circle",
      state: "audit",
      sub: [
        {
          name: "Asset Tags",
          type: "dropDown",
          state: "",
          sub: [
            { name: "Print tags", state: "print_tag", tooltip: "Print tags" },
                          
          ]
        },
       
         {
          name: "Asset Tagging",
          type: "dropDown",
          state: "",
          sub: [
            { name: "Approve Tagging Status", state: "approve_tagging", tooltip: "Approve Tagging Status" },
             { name: "Additional Assets Tagging", state: "additional_assets", tooltip: "Additional Assets Tagging" }
          ]
        },
        {
          name: "Asset Inventory",
          type: "dropDown",
          state: "",
          sub: [
            { name: "Create Project", state: "createproject", tooltip: "Create Project" },
            { name: "Send For Reconciliation", state: "send_for_reconciliation", tooltip: "Send For Reconciliation" },
            { name: "Inventory Status", state: "inventory", tooltip: "Inventory Status Report" }
            
          ]
        },
             
      ]
    },
    {
      name: "Asset Movement",
      type: "dropDown",
      tooltip: "Asset Movement",
      icon: "swap_horiz",
      state: "transfer",
      sub: [
        { name: "Initiate Transfer", state: "initiatetransfer", tooltip: "Initiate Transfer" },
        { name: "Review Transfer Request", state: "transferapproval", tooltip: "Review Transfer Request" },
        { name: "Physical Movement", state: "physical_movement", tooltip: "Physical Movement" },
        { name: "Assets In Transit Report", state: "view_transit_assets", tooltip: "Assets In Transit Report" },
        // { name: "Receive Assets", state: "Receive_Assets", tooltip: "Receive Assets" }
        {
          name: "Asset Inward",
          type: "dropDown",
          state: "",
          sub: [
            { name: "Receive Asset", state: "receiveasset", tooltip: "Receive Asset" },
            { name: "Revert Asset", state: "revertasset", tooltip: "Revert Asset" },
          ]
        },
      ]
    },
    {
      name: "Asset Retirement",
      type: "dropDown",
      tooltip: "Asset Retirement",
      icon: "delete",
      state: "retire",
      sub: [
        { name: "Initiate Retirement", state: "initiateretire", tooltip: "Initiate Retirement" },
        { name: "Review Retirement Request", state: "retireapproval", tooltip: "Review Retirement Request" },
        { name: "Physical Disposal", state: "physicaldisposal", tooltip: "Physical Disposal" }
      ]
    },
    {
      name: "Reports",
      type: "dropDown",
      tooltip: "Reports",
      icon: "collections_bookmark",
      state: "reports",
      sub: [
        { name: "Outbound Pending Assets", state: "OutboundPendingAssets", tooltip: "OutboundPendingAssets" },
        { name: "Asset Register Report", state:"assetregisterreport", tooltip:"assetregisterreport"},
        {name: "Damaged or Not in Use", state: "DamageNotInUse", tooltip: "DamageNotInUse"},
        { name: "Asset Retirement", state: "AssetRetirement", tooltip: "AssetRetirement" },
        { name: "Asset Retirement History", state: "AssetRetirementHistory", tooltip: "AssetRetirementHistory" },
        {name: "Verify Only Assets", state: "verifyonly", tooltip: "verifyonly"},
        {name: "Non Verifiable Assets", state: "nonverify", tooltip: "nonverify"},
        {name:"Report Tagging", state:"reportagging",tooltip:"reportagging"},     
        { name: "Inventory Report ", state: "inventoryreport", tooltip: "inventoryreport"},   
        
        { name: "Transfer History Report ", state: "assetdispatchedreport", tooltip: "transferhistoryreport"},
      ]
    },
    {
      name: "Options and Settings",
      type: "dropDown",
      tooltip: "Options and Settings",
      icon: "build",
      state: "admin",
      sub: [
        { name: "Filter Configuration", state: "filter_configuration", tooltip: "filter_configuration" },
        { name: "Manage Credentials", state: "userCredentials", tooltip: "userCredentials" },
        { name: "Other Configurations", state: "OtherConfigurations", tooltip: "Other Configurations"},
        { name: "Cut-off Management", 
          type:"dropDown",
          state: "",
          sub: [
            { name: "Period Management",  state: "cut-off", tooltip: "Period Management" },
            { name: "Discrepancy Management",  state: "DiscrepancyManagement", tooltip: "Discrepancy Management" },
          ]
        },
        {
          name: "User Role Management",
          type: "dropDown",
          state: "",
          sub: [
            { name: "Create User", state: "createUser", tooltip: "Create User" },
            { name: "Create Role", state: "createrole", tooltip: "Create Role" },
            // { name: "User/Role Mapping", state: "userrolemapping", tooltip: "User/Role Mapping" },
            { name: "User-Role Rights Mapping", state: "userrole_rights", tooltip: "User-Role Rights Mapping"},
            { name: "Employee List", state: "employeemaster", tooltip: "Employee List"},
            // { name: "Remapping Deleted Employee", state: "remapping_employee", tooltip: "Remapping Deleted Employee"}
          ]
        },

        { name: "Messages Notification", state: "messages_notification", tooltip: "Messages_Notification" },
        { name: "License Usage Information", state: "LicenseUsageInformation", tooltip: "License Usage Information"},
        
      ]       
    },
 
    {
      name: "Aassignment",
      type: "link",
      tooltip: "Assignment",
      icon: "assignment_ind",
      state: "assignment"
    },
    // {
    //   name: "SESSIONS",
    //   type: "dropDown",
    //   tooltip: "Pages",
    //   icon: "view_carousel",
    //   state: "sessions",
    //   sub: [
      
    //     { name: "Signin 4", state: "signin4" },
    //     { name: "FORGOT", state: "forgot-password" },
    //     { name: "Select Group/Region/Legal Entities", state: "selectGpRgCom" },
        
    //   ]
    // },    
    
  ]
  iconMenuSuperAdmin: IMenuItem[] = [
    {
      name: "Home Page",
      type: "link",
      tooltip: "Home Page",
      icon: "home",
      state: "h"
    },
    // {
    //   name: "Super Admin",
    //   type: "dropDown",
    //   tooltip: "Super Admin",
    //   icon: "person_pin",
    //   state: "superadmin",
    //   sub: [
    //     { name: "Mandatory-Non Mandatory", state: "mandatory-non mandatory", tooltip: "Mandatory-Non Mandatory" },
    //     { name: "Filter / Field Configuration", state: "filterandfieldsconfiguration", tooltip: "filterandfieldsconfiguration" },
    //     { name: "License Details", state:"create_module_permission", tooltip:"License Details" },
    //     { name: "Other Configuration", state:"other_configuration", tooltip:"other_configuration" },
    //     { name: "Rules Engine", state: "rules-engine-list", tooltip: "rulesengine" },        
    //   ]
    // },
    {
      name: "Mandatory-Non Mandatory",
      type: "link",
      tooltip: "Mandatory-Non Mandatory",
      icon: "person_pin",
      state: "superadmin/mandatory-non mandatory"
    },
    {
      name: "Filter / Field Configuration",
      type: "link",
      tooltip: "filterandfieldsconfiguration",
      icon: "person_pin",
      state: "superadmin/filterandfieldsconfiguration"
    },
    // {
    //   name: "License Details",
    //   type: "link",
    //   tooltip: "License Details",
    //   icon: "person_pin",
    //   state: "superadmin/create_module_permission"
    // },
    // {
    //   name: "Other Configuration",
    //   type: "link",
    //   tooltip: "other_configuration",
    //   icon: "person_pin",
    //   state: "superadmin/other_configuration"
    // },
    {
      name: "Rules Engine",
      type: "link",
      tooltip: "rulesengine",
      icon: "person_pin",
      state: "superadmin/rules-engine-list"
    },
    {
      name: "Create Group/Region and Legal Entity",
      type: "link",
      tooltip: "Create Group/Region and Legal Entity",
      icon: "person_pin",
      state: "h2/f"
    },
    {
      name: "License Management",
      type: "link",
      tooltip: "License Management",
      icon: "person_pin",
      state: "superadmin/LicenseManagment"
    },
    {
      name: "Group Configuration",
      type: "link",
      tooltip: "Group_configuration",
      icon: "person_pin",
      state: "superadmin/SSO-Approval-Configuration"
    },{
      name: "LicenseUtilization",
      type: "link",
      tooltip: "LicenseUtilization",
      icon: "person_pin",
      state: "superadmin/LicenseUtilization"
    },
    {
      name: "Standard View Mapping",
      type: "link",
      tooltip: "ViewField",
      icon: "person_pin",
      state: "superadmin/View_Field"
    },
    {
      name: "Custom View Mapping",
      type: "link",
      tooltip: "CustomViewMapping",
      icon: "person_pin",
      state: "superadmin/custom_view_mapping"
    },
    // {
    //   name: "View Page Creation",
    //   type: "link",
    //   tooltip: "ViewPageCreation",
    //   icon: "person_pin",
    //   state: "superadmin/view_page_creation"
    // },
  ]
  // Icon menu TITLE at the very top of navigation.
  // This title will appear if any icon type item is present in menu.
  iconTypeMenuTitle = 'Frequently Accessed';
  // sets iconMenu as default;
  menuItems = new BehaviorSubject<IMenuItem[]>(this.iconMenuDefault);
  // navigation component has subscribed to this Observable
  menuItems$ = this.menuItems.asObservable();

  constructor() {}
 
  // Customizer component uses this method to change menu.
  // You can remove this method and customizer component.
  // Or you can customize this method to supply different menu for
  // different user type.
  publishNavigationChange(menuType: string , iconMenu : IMenuItem[]) {  
    if(menuType == '1'){
      this.menuItems.next(this.iconMenuSuperAdmin);
    }
    else {
      this.menuItems.next(iconMenu);
    }    
  }
}
