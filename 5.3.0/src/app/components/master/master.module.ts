import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";


import { FlexLayoutModule } from '@angular/flex-layout';
import { MasterRoutes } from './master.routing';

import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
//  import {MatPaginatorModule} from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatSortModule } from '@angular/material/sort'
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule } from '@angular/common/http';
import { MasterComponent } from './master.component'
import { MatExpansionModule } from '@angular/material/expansion';
import { FileUploadModule } from 'ng2-file-upload';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedMaterialModule } from '../../shared/shared-material.module';
import { SbuComponent } from './sbu/sbu.component';

import { SBULocationStorageLocationComponent } from './sbu-location/sbu_location.component';
import { StorageLocationDialogComponent } from './sbu-location/storageLocation_add_edit_dialog/storageLocation_add_edit_dialog.component';
import { SbuAddEditDialogComponent } from './sbu-location/sbu_add_edit_dialog/sbu_add_edit_dialog.component';
import { LocationDialogComponent } from './sbu-location/location_add_edit_dialog/location_add_edit_dialog.component';

import { AssetMasterComponent } from './asset_master/asset_master.component';
import { CreateManufacturerDialogComponent } from './asset_master/manufacturer_add_edit_dialog/createmanufacturer-dialog.component';
import { UploadManufacturerPopUpComponent } from './asset_master/manufacturer_upload_dialog/upload_manufacturer_popup.component';
import { CreateVendorDialogComponent } from './asset_master/vendor_add_edit_dialog/createvendor-dialog.component';
import { UploadVendorPopUpComponent } from './asset_master/vendor_upload_dialog/upload_vendor_popup.component';
import { CreateCPUClassDialogComponent } from './asset_master/cpuclass_add_edit_dialog/createcpuclass-dialog.component';
import { UploadCPUClassPopUpComponent } from './asset_master/cpuclass_upload_dialog/upload_cpuclass_popup.component';
import { CreateCPUSubClassDialogComponent } from './asset_master/cpusubclass_add_edit_dialog/createcpusubclass-dialog.component';
import { UploadCPUSubClassPopUpComponent } from './asset_master/cpusubclass_upload_dialog/upload_cpusubclass_popup.component';
import { CreateApplicationTypeDialogComponent } from './asset_master/applicationtype_add_edit_dialog/createapplicationtype-dialog.component';
import { UploadApplicationTypePopUpComponent } from './asset_master/applicationtype_upload_dialog/upload_applicationtype_popup.component';
import { CreateModelDialogComponent } from './asset_master/model_add_edit_dialog/createmodel-dialog.component';
import { UploadModelPopUpComponent } from './asset_master/model_upload_dialog/upload_model_popup.component';
import { CreateOperatingSystemDialogComponent } from './asset_master/operatingsystem_add_edit_dialog/createoperatingsystem-dialog.component';
import { UploadOperatingSystemPopUpComponent } from './asset_master/operatingsystem_upload_dialog/upload_operatingsystem_popup.component';
import { CreateCostCenterDialogComponent } from './asset_master/costcenter_add_edit_dialog/createcostcenter-dialog.component';
import { UploadCostCenterPopUpComponent } from './asset_master/costcenter_upload_dialog/upload_costcenter_popup.component';

import { CategoryAssetclassMapComponent } from './category&assetclass_mapping/mapping.component';


// import {EditAssetDialogComponent} from './edit_asset/edit_popup/edit_popup.component';
import { CurrencyComponent } from "./currency/currency.component";
// import{filterPopupComponent} from './review_assets/filter_popup/filter_popup.component'

import { DatePipe } from '@angular/common'
import { editCurrencyDialogComponent } from './currency/edit_currency_dialog/edit_currency_dialog.component';
//import {MessageAlertComponent} from '../../shared/services/app-msg-alert/app-msg.component';
import { TagMasterComponent } from './tag_master/tag_master.component';
import { TagMasterDialogComponent } from './tag_master/add_tag_master_dialog/add_tag_master_dialog.component';
import { EditMasterDialogComponent } from './tag_master/edit_tag_master/edit_tag_master.component';

import { AssetClassComponent } from './asset_class/asset_class.component';
import { CreateAssetClassDialogComponent } from './asset_class/assetclass_add_edit_dialog/createassetclass-dialog.component';
import { UploadAssetClassPopUpComponent } from './asset_class/assetclass_upload_dialog/upload_assetclass_popup.component';
import { DefineseriesComponent } from './defineseries/defineseries.component';
import { AddsDefineSeriesDialogComponent } from './defineseries/Adddefineseries/addsdefineseries-dialog.component';
import { CategoryTypeSubtypeComponent } from "./category_type_subtype/category_type_subtype.component";
import { CategoryDialogComponent } from './category_type_subtype/category_add_edit_dialog/category_add_edit_dialog.component';
import { TypeDialogComponent } from './category_type_subtype/type_add_edit_dialog/type_add_edit_dialog.component';
import { SubtypeDialogComponent } from './category_type_subtype/subtype_add_edit_dialog/subtype_add_edit_dialog.component';
import { GroupComponent } from './group/group.component';
import { Group_dialogComponent } from './group/group_add_edit_dialog/group_dialog.component';
import { RegionDialogComponent } from './group/region_add_edit_dialog/region_dialog.component';
import { CompanyDialogComponent } from './group/company_add_edit_dialog/company_dialog.component';
import { InventorySeriesDialogComponent } from './defineseries/Inventoryseries/Inventoryseries-dialog.component';
import { InventorySeriesDataDialogComponent } from './defineseries/Inventoryseriesdata/Inventoryseriesdata-dialog.component';
import { SbuUploadDialogComponent } from './sbu-location/sbu-upload-dialog/sbu-upload-dialog.component';
import { LocationUploadDialogComponent } from './sbu-location/location-upload-dialog/location-upload-dialog.component';
import { RackUploadDialogComponent } from './sbu-location/rack-upload-dialog/rack-upload-dialog.component';
import { CategoryUploadDialogComponent } from './category_type_subtype/category-upload-dialog/category-upload-dialog.component';
import { SubtypeUploadDialogComponent } from './category_type_subtype/subtype-upload-dialog/subtype-upload-dialog.component';
import { TypeUploadDialogComponent } from './category_type_subtype/type-upload-dialog/type-upload-dialog.component';
import {MatSelectInfiniteScrollModule} from 'ng-mat-select-infinite-scroll';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    FlexLayoutModule,
    PerfectScrollbarModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatToolbarModule,
    MatTooltipModule,
    NgxMatSelectSearchModule,
    MatPaginatorModule,
    MatDialogModule,
    FileUploadModule,
    DragDropModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatListModule,
    MatCheckboxModule,
    MatMenuModule,
    MatExpansionModule,
    MatSidenavModule,
    HttpClientModule,
    SharedMaterialModule,
    MatSelectInfiniteScrollModule,
    RouterModule.forChild(MasterRoutes)
  ],
  declarations: [MasterComponent,
    SbuComponent,
    SBULocationStorageLocationComponent,
    StorageLocationDialogComponent,
    SbuAddEditDialogComponent,
    LocationDialogComponent,
    AssetMasterComponent,
    CreateManufacturerDialogComponent,
    UploadManufacturerPopUpComponent,
    CreateVendorDialogComponent,
    UploadVendorPopUpComponent,
    CreateCPUClassDialogComponent,
    UploadCPUClassPopUpComponent,
    CreateCPUSubClassDialogComponent,
    UploadCPUSubClassPopUpComponent,
    CreateApplicationTypeDialogComponent,
    UploadApplicationTypePopUpComponent,
    CreateOperatingSystemDialogComponent,
    UploadOperatingSystemPopUpComponent,
    CreateModelDialogComponent,
    UploadModelPopUpComponent,
    UploadCostCenterPopUpComponent,
    CreateCostCenterDialogComponent,
    CategoryAssetclassMapComponent,
    CurrencyComponent,
    editCurrencyDialogComponent,
    TagMasterComponent,
    TagMasterDialogComponent,
    EditMasterDialogComponent,
    AssetClassComponent,
    CreateAssetClassDialogComponent,
    UploadAssetClassPopUpComponent,
    DefineseriesComponent,
    AddsDefineSeriesDialogComponent,
    CategoryTypeSubtypeComponent,
    CategoryDialogComponent,
    TypeDialogComponent,
    SubtypeDialogComponent,
    GroupComponent,
    Group_dialogComponent,
    RegionDialogComponent,
    CompanyDialogComponent,
    InventorySeriesDialogComponent,
    InventorySeriesDataDialogComponent,
    SbuUploadDialogComponent,
    LocationUploadDialogComponent,
    RackUploadDialogComponent,
    CategoryUploadDialogComponent,
    SubtypeUploadDialogComponent,
    TypeUploadDialogComponent,
  ],
  providers: [DatePipe]
})
export class MasterModule { }