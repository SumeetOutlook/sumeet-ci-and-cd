import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationspanelComponent } from './notificationspanel/notificationspanel.component'



export const NotificationRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path:"a",
        component: NotificationspanelComponent,
        data: {title: " Notifications Panel"}
      }
    ]
  }
];
