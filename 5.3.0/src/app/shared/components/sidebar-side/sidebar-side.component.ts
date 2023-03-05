import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { NavigationService } from "../../../shared/services/navigation.service";
import { ThemeService } from "../../services/theme.service";
import { Subscription } from "rxjs";
import { ILayoutConf, LayoutService } from "app/shared/services/layout.service";
import { JwtAuthService } from "app/shared/services/auth/jwt-auth.service";
import { Constants } from 'app/components/storage/constants';
import { ManagerService } from 'app/components/storage/sessionMangaer';
import * as Menuheaders from '../../../../assets/MenuHeaders.json';

@Component({
  selector: "app-sidebar-side",
  templateUrl: "./sidebar-side.component.html"
})
export class SidebarSideComponent implements OnInit, OnDestroy, AfterViewInit {

  public menuItems: any[];
  public hasIconTypeMenuItem: boolean;
  public iconTypeMenuTitle: string;
  private menuItemsSub: Subscription;
  public layoutConf: ILayoutConf;
  iconMenu: any[] = [];
  iconMenu1: any[] = [];
  SubModules: any[] = [];
  MenuHeader: any;
  constructor(
    private navService: NavigationService,
    public themeService: ThemeService,
    private layout: LayoutService,
    public jwtAuth: JwtAuthService,
    private storage: ManagerService,
  ) {
    this.MenuHeader = (Menuheaders as any).default;
  }


  ngOnInit() {

    // var data = this.storage.get(Constants.SESSSION_STORAGE, Constants.MenuPage);
    var data = this.jwtAuth.getMenuItem();
    if (data != null) {
      this.CreateIconMenu(JSON.parse(JSON.stringify(data)));
    }
    this.iconTypeMenuTitle = this.navService.iconTypeMenuTitle;
    var ProfileId = this.jwtAuth.getProfile();
    this.iconMenu = [
      {
        name: "Home Page",
        type: "link",
        tooltip: "Home Page",
        icon: "home",
        state: "dashboard"
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
              { name: "Category Type / Subtype", state: "category_type_subtype", tooltip: "Category Type/Subtype" },
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
              // { name: "Inventory Status Report", state: "Inventory_Status_Report", tooltip: "Inventory Status Report" }

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
          { name: "Damaged or Not in Use", state: "DamageNotInUse", tooltip: "DamageNotInUse" },
          { name: "Asset Retirement", state: "AssetRetirement", tooltip: "AssetRetirement" },
          { name: "Verify Only Assets", state: "verifyonly", tooltip: "verifyonly" },
          { name: "Non Verifiable Assets", state: "nonverify", tooltip: "nonverify" },
          { name: "Report Tagging", state: "reportagging", tooltip: "reportagging" },
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
          { name: "Other Configurations", state: "OtherConfigurations", tooltip: "Other Configurations" },
          { name: "Cut-off Management", state: "cut-off", tooltip: "Cut-off Management" },
          {
            name: "User Role Management",
            type: "dropDown",
            state: "",
            sub: [
              { name: "Create User", state: "createUser", tooltip: "Create User" },
              { name: "Create Role", state: "createrole", tooltip: "Create Role" },
              // { name: "User/Role Mapping", state: "userrolemapping", tooltip: "User/Role Mapping" },
              { name: "User-Role Rights Mapping", state: "userrole_rights", tooltip: "User-Role Rights Mapping" },
              { name: "Employee List", state: "employeemaster", tooltip: "Employee List" },
              // { name: "Remapping Deleted Employee", state: "remapping_employee", tooltip: "Remapping Deleted Employee"}
            ]
          },

          { name: "Messages Notification", state: "messages_notification", tooltip: "Messages_Notification" },
          { name: "License Usage Information", state: "LicenseUsageInformation", tooltip: "License Usage Information" },

        ]
      },

    ]
    this.navService.publishNavigationChange(ProfileId, this.iconMenu1);
    this.menuItemsSub = this.navService.menuItems$.subscribe(menuItem => {

      this.menuItems = menuItem;
      //Checks item list has any icon type.
      this.hasIconTypeMenuItem = !!this.menuItems.filter(
        item => item.type === "icon"
      ).length;
    });
    this.layoutConf = this.layout.layoutConf;
  }
  ngAfterViewInit() { }
  ngOnDestroy() {
    if (this.menuItemsSub) {
      this.menuItemsSub.unsubscribe();
    }
  }
  toggleCollapse() {

    if (this.layoutConf.sidebarCompactToggle) {
      this.layout.publishLayoutChange({
        sidebarCompactToggle: false
      });
    } else {
      this.layout.publishLayoutChange({
        // sidebarStyle: "compact",
        sidebarCompactToggle: true
      });
    }
  }

  CreateIconMenu(result: any) {
    result.sort(function (a, b) {
      return a.DisplayOrder - b.DisplayOrder;
    });

    result.forEach(element => {
      if (element.MenuParentModuleId != null && !!element.MenuParentModuleId && element.MenuParentModuleId > 0) {
        this.SubModules.push(element)
      }
      else {
        //  
        var aa = {
          // name: element.MenuModuleName,
          name: this.MenuHeader[element.ModuleName],
          type: element.ModuleType,
          tooltip: element.ModuleToolTip,
          icon: element.ModuleIcon,
          state: element.ModuleState,
          ModuleId: element.ModuleId,
          sub: []
        }
        this.iconMenu1.push(aa)
      }
    });
    this.BindSubMenu();
  }

  BindSubMenu() {

    this.SubModules.sort(function (a, b) {
      return a.DisplayOrder - b.DisplayOrder;
    });

    for (var i = 0; i < this.iconMenu1.length; i++) {
      for (var j = 0; j < this.SubModules.length; j++) {
        if (this.iconMenu1[i].ModuleId == this.SubModules[j].MenuParentModuleId) {
          var aa = {
            // name: this.SubModules[j].MenuModuleName,
            name: this.MenuHeader[this.SubModules[j].ModuleName],
            type: this.SubModules[j].ModuleType,
            state: this.SubModules[j].ModuleState,
            ModuleId: this.SubModules[j].ModuleId,
            sub: []
          }
          this.iconMenu1[i].sub.push(aa);
        }
      }
    }
    this.BindSub_SubMenu();
  }

  BindSub_SubMenu() {

    this.SubModules.sort(function (a, b) {
      return a.DisplayOrder - b.DisplayOrder;
    });

    for (var i = 0; i < this.iconMenu1.length; i++) {
      for (var j = 0; j < this.iconMenu1[i].sub.length; j++) {
        for (var k = 0; k < this.SubModules.length; k++) {
          if (this.iconMenu1[i].sub[j].ModuleId == this.SubModules[k].MenuParentModuleId) {
            var aa = {
              // name: this.SubModules[k].MenuModuleName,
              name: this.MenuHeader[this.SubModules[k].ModuleName],
              state: this.SubModules[k].ModuleState,
              tooltip: this.SubModules[k].ModuleToolTip,
              // type: this.SubModules[k].ModuleType,
              // ModuleId: this.SubModules[k].ModuleId,
              // sub: []
            }
            this.iconMenu1[i].sub[j].sub.push(aa);
          }
        }
      }
    }
    // this.BindSub_Sub_SubMenu();
  }

  // BindSub_Sub_SubMenu() {
  //   this.SubModules.sort(function (a, b) {
  //     return a.DisplayOrder - b.DisplayOrder;
  //   });

  //   for (var i = 0; i < this.iconMenu1.length; i++) {
  //     for (var j = 0; j < this.iconMenu1[i].sub.length; j++) {
  //       for (var m = 0; m < this.iconMenu1[i].sub[j].sub.length; m++) {
  //       for (var k = 0; k < this.SubModules.length; k++) {
  //         if (this.iconMenu1[i].sub[j].sub[m].ModuleId == this.SubModules[k].MenuParentModuleId) {
  //           var aa = {      
  //             name:this.MenuHeader[this.SubModules[k].ModuleName],
  //             state: this.SubModules[k].ModuleState,
  //             tooltip: this.SubModules[k].ModuleToolTip,
  //           }
  //           this.iconMenu1[i].sub[j].sub[m].sub.push(aa);
  //         }
  //       }
  //      }
  //     }
  //   }
  // }


}
