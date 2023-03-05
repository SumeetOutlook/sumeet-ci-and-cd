import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddHardwareAssetComponent } from './add-hardware-asset/add-hardware-asset.component';
import { CreateSoftareInventoryComponent } from './create-softare-inventory/create-softare-inventory.component';
import { MapEditHardwareAssetComponent } from './map-edit-hardware-asset/map-edit-hardware-asset.component';
import { AddSoftwarePageComponent } from './add-software-page/add-software-page.component';
import { ScannedSoftwareComponent } from './scanned-software/scanned-software.component';
import { AddScannedSoftwareComponent } from './add-scanned-software/add-scanned-software.component';
import { SoftwareLicensesComponent } from './software-licenses/software-licenses.component';
import { AddSoftwareLicenseComponent } from './add-software-license/add-software-license.component';
import { LicensedSoftwareComponent } from './licensed-software/licensed-software.component';
import { AddLicensedSoftwareComponent } from './add-licensed-software/add-licensed-software.component';
import { SoftwareDetailsComponent } from './software-details/software-details.component';
import { HardwareDiscoveryReportComponent } from './hardware-discovery-report/hardware-discovery-report.component';
import { HardwareChangeReportComponent } from './hardware-change-report/hardware-change-report.component';
import { SoftwareInformationReportComponent } from './software-information-report/software-information-report.component';
import { SoftwareExpiryReportComponent } from './software-expiry-report/software-expiry-report.component';
import { ElpReportComponent } from './elp-report/elp-report.component';
import { EditSoftwareLicenseComponent } from './edit-software-license/edit-software-license.component';

export const ItamRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "a",
        component: AddHardwareAssetComponent,
        data: { title: "Add Hardware Asset" }
      },
      {
        path: "b",
        component: CreateSoftareInventoryComponent,
        data: { title: "Create Software Inventory" }
      }    ,
      {
        path: "c",
        component: MapEditHardwareAssetComponent,
        data: { title: "Map Edit Hardware Asset" }
      },
      {
        path: "bb",
        component: AddSoftwarePageComponent,
        data: { title: "Add Software" }
      },
      {
        path: "d",
        component: ScannedSoftwareComponent,
        data: { title: "Scanned Software " }
      },
      {
        path:"dd",
        component: AddScannedSoftwareComponent,
        data: {title: "Add Scanned Software"}
      },
      {
        path: "e",
        component: LicensedSoftwareComponent,
        data: { title: "License Software" }
      },
      {
        path:"ee",
        component: AddLicensedSoftwareComponent,
        data: {title: "Add License Software"}
      },
      {
        path: "f",
        component: SoftwareLicensesComponent,
        data: { title: "Software License " }
      },
      {
        path:"ff",
        component: AddSoftwareLicenseComponent,
        data: {title: "Add Software License"}
      },
      {
        path:"fff",
        component: EditSoftwareLicenseComponent,
        data: {title: "Edit Software License"}
      },
      {
        path:"ddd",
        component: SoftwareDetailsComponent,
        data: {title: "Software Details"}
      },
      {
        path: 'l',
        component:HardwareDiscoveryReportComponent,
        data: {title: "Hardware Discovery Report"}
      },
      {
        path: 'm',
        component:HardwareChangeReportComponent,
        data: {title: "Hardware Change Report"}
      },
      {
        path: 'n',
        component:SoftwareInformationReportComponent,
        data: {title: "Software Information Report"}
      },
      {
        path: 'o',
        component:SoftwareExpiryReportComponent,
        data: {title: "Software Expiry Report"}
      },
      {
        path: 'p',
        component:ElpReportComponent,
        data: {title: "ELP Report"}
      }
    ]
  }
  ];