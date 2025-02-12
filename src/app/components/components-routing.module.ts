import { Routes } from "@angular/router";
import { ComponentsComponent } from "./components.component";
import { DashboardComponent } from "./dashboard/dashboard.component";

export const AdminRoutingModule: Routes = [{
  path: '',
  component: ComponentsComponent,
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    {
      path: 'money-transfer',
      loadChildren: () => import('./money-transfer/money-transfer-routing.module').then(m => m.MoneyTransferRoutingModule),
    },
    {
      path: 'portal',
      loadChildren: () => import('./portal/portal-routing.module').then(m => m.PortalRoutingModule),
    },
    {
      path: 'commission',
      loadChildren: () => import('./commission/commission-routing.module').then(m => m.CommissionRoutingModule),
    },
    {
      path: 'aeps',
      loadChildren: () => import('./aeps/aeps-routing.module').then(m => m.AepsRoutingModule),
    },
    {
      path: 'user',
      loadChildren: () => import('./users/users-routing.module').then(m => m.UsersRoutingModule),
    },
    {
      path: 'service',
      loadChildren: () => import('./services/services-routing.module').then(m => m.ServicesRoutingModule),
    },
    {
      path: 'sales',
      loadChildren: () => import('./sales/sales-routing.module').then(m => m.SalesRoutingModule),
    },
  ]
}]