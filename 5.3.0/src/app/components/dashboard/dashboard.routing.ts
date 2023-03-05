import { Routes } from "@angular/router";
import { DashboardComponent } from './dashboard/dashboard.component';

export const DashboardRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "a",
        component: DashboardComponent,
        data: { title: "Dashboard" }
      }, 
    ]
  }
];
