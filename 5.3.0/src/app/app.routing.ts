import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './shared/guards/auth.guard';

export const rootRouterConfig: Routes = [
  // { 
  //   path: '', 
  //   redirectTo: 'others/blank', 
  //   pathMatch: 'full' 
  // },
  { 
    path: '', 
    redirectTo: 'sessions/login', 
    pathMatch: 'full' 
  },
  {
    path: 'login',
    loadChildren: () => import('./views/sessions/sessions.module').then(m => m.SessionsModule),
    data: { title: 'login' }
  },
  {
    path: '', 
    component: AuthLayoutComponent,
    children: [
      { 
        path: 'sessions', 
        loadChildren: () => import('./views/sessions/sessions.module').then(m => m.SessionsModule),
        data: { title: 'Session'} 
      }
    ]
  },
  {
    path: '', 
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { 
        path: 'h', 
        loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule), 
        data: { title: 'Dashboard', breadcrumb: 'DASHBOARD'}
      },
      {
        path: 'search', 
        loadChildren: () => import('./views/search-view/search-view.module').then(m => m.SearchViewModule)
      },
      
      { 
        path: 'superadmin', 
        loadChildren: () => import('./components/super_admin/super.module').then(m => m.SuperAdminModule),
        data: { title: 'Super Admin'} 
      },
      { 
        path: 'h9', 
        loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule),
        data: { title: 'Admin', breadcrumb: 'Admin'} 
      },
      { 
        path: 'h3', 
        loadChildren: () => import('./components/relationship/relation.module').then(m => m.AssetRelationshipModule),
        data: { title: 'Relationship'} 
      },
      { 
        path: 'h7', 
        loadChildren: () => import('./components/assetAudit/audit.module').then(m => m.AuditModule),
        data: { title: 'Audit'} 
      },
      { 
        path: 'h2', 
        loadChildren: () => import('./components/master/master.module').then(m => m.MasterModule),
        data: { title: 'Master'} 
      },
      {
        path: 'h10', 
        loadChildren: () => import('./components/notifications/notification.module').then(m => m.NotificationModule),
        data: { title: 'Notifications'} 
      },
      { 
        path: 'h1', 
        loadChildren: () => import('./components/create_assets/assets.module').then(m => m.AssetsModule),
        data: { title: 'Master'} 
      },
      { 
        path: 'h5', 
        loadChildren: () => import('./components/transfer/transfer.module').then(m => m.TransferModule),
        data: { title: 'Transfer'} 
      },
      { 
        path: 'h6', 
        loadChildren: () => import('./components/retirement/retirement.module').then(m => m.RetirementModule),
        data: { title: 'Retirement'} 
      },
      { 
        path: 'h4', 
        loadChildren: () => import('./components/assignment/assignment.module').then(m => m.AssignmentModule),
        data: { title: 'Assignment'} 
      },
      { 
        path: 'h8', 
        loadChildren: () => import('./components/reports/reports.module').then(m => m.ReportModule),
        data: { title: 'Reports'} 
      },
      {
          path:'h11',
          loadChildren: () => import('./components/itam/itam.module').then(m => m.ItamModule),
          data: { title: 'ITAM'} 
      },
      {
        path:'h12',
        loadChildren: () => import('./components/cmms/cmms.module').then(m => m.CmmsModule),
        data: { title: 'CMMS'} 
    },
      { 
        path: 'partialview', 
        loadChildren: () => import('./components/partialView/partial.module').then(m => m.PartialModule),
        data: { title: 'Reports'} 
      },
    ]
  },  
  { 
    path: '404', 
    redirectTo: 'sessions/404'
  },
  { 
    path: '**', 
    redirectTo: 'sessions/404'
  }
];

