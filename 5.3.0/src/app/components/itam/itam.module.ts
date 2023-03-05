import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
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
import { MatExpansionModule } from '@angular/material/expansion';
import { FileUploadModule } from 'ng2-file-upload';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedMaterialModule } from '../../shared/shared-material.module';

import { ItamRoutes } from './itam.routing';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AddHardwareAssetComponent } from './add-hardware-asset/add-hardware-asset.component';
import { CreateSoftareInventoryComponent } from './create-softare-inventory/create-softare-inventory.component';
import { MapEditHardwareAssetComponent } from './map-edit-hardware-asset/map-edit-hardware-asset.component';
import { CreateSoftwareInventoryDialogComponent } from './dialogs/create-software-inventory-dialog/create-software-inventory-dialog.component';
import { AddSoftwarePageComponent } from './add-software-page/add-software-page.component';
import { ScannedSoftwareComponent } from './scanned-software/scanned-software.component';
import { AddScannedSoftwareComponent } from './add-scanned-software/add-scanned-software.component';
import { LicensedSoftwareComponent } from './licensed-software/licensed-software.component';
import { AddLicensedSoftwareComponent } from './add-licensed-software/add-licensed-software.component';
import { SoftwareLicensesComponent } from './software-licenses/software-licenses.component';
import { AddSoftwareLicenseComponent } from './add-software-license/add-software-license.component';
import { SoftwareDetailsComponent } from './software-details/software-details.component';
import { UploadScannedSoftwareComponent } from './dialogs/upload-scanned-software/upload-scanned-software.component';
import { AddManufacturerDialogComponent } from './dialogs/add-manufacturer-dialog/add-manufacturer-dialog.component';
import { ModifiedManufacturerCategoryDialogComponent } from './dialogs/modified-manufacturer-category-dialog/modified-manufacturer-category-dialog.component';
import { SoftwareDetailsDialogComponent } from './dialogs/software-details-dialog/software-details-dialog.component';
import { AddManagedSoftwareDialogComponent } from './dialogs/add-managed-software-dialog/add-managed-software-dialog.component';
import { AddLicenseTypeDialogComponent } from './dialogs/add-license-type-dialog/add-license-type-dialog.component';
import { SoftwareLicenseDetailsDialogComponent } from './dialogs/software-license-details-dialog/software-license-details-dialog.component';
import { SoftwarePackageDetailsDialogComponent } from './dialogs/software-package-details-dialog/software-package-details-dialog.component';
import { HardwareDiscoveryReportComponent } from './hardware-discovery-report/hardware-discovery-report.component';
import { HardwareChangeReportComponent } from './hardware-change-report/hardware-change-report.component';
import { SoftwareInformationReportComponent } from './software-information-report/software-information-report.component';
import { SoftwareExpiryReportComponent } from './software-expiry-report/software-expiry-report.component';
import { ElpReportComponent } from './elp-report/elp-report.component';
import { MannualMappingDialogComponent } from './dialogs/mannual-mapping-dialog/mannual-mapping-dialog.component';
import { AutomationMappingDialogComponent } from './dialogs/automation-mapping-dialog/automation-mapping-dialog.component';
import { ReviewMappingDialogComponent } from './dialogs/review-mapping-dialog/review-mapping-dialog.component';
import { EditSoftwareLicenseComponent } from './edit-software-license/edit-software-license.component';
export const dtFORMAT = {
  parse: {
    dateInput: "DD-MMM-YYYY"
  },
  display: {
    dateInput: "DD-MMM-YYYY",
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: "DD-MMM-YYYY",
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

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
    RouterModule.forChild(ItamRoutes)
  ],
  declarations: [AddHardwareAssetComponent, CreateSoftareInventoryComponent, MapEditHardwareAssetComponent, CreateSoftwareInventoryDialogComponent, AddSoftwarePageComponent, ScannedSoftwareComponent, AddScannedSoftwareComponent, LicensedSoftwareComponent, AddLicensedSoftwareComponent, SoftwareLicensesComponent, AddSoftwareLicenseComponent, SoftwareDetailsComponent, UploadScannedSoftwareComponent, AddManufacturerDialogComponent, ModifiedManufacturerCategoryDialogComponent, SoftwareDetailsDialogComponent, AddManagedSoftwareDialogComponent, AddLicenseTypeDialogComponent, SoftwareLicenseDetailsDialogComponent, SoftwarePackageDetailsDialogComponent ,HardwareDiscoveryReportComponent, HardwareChangeReportComponent, SoftwareInformationReportComponent, SoftwareExpiryReportComponent, ElpReportComponent, MannualMappingDialogComponent, AutomationMappingDialogComponent, ReviewMappingDialogComponent, EditSoftwareLicenseComponent],
  exports: [],
  entryComponents: [

  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: dtFORMAT }]


})
export class ItamModule { }