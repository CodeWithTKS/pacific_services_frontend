import { Routes } from "@angular/router";
import { AuthGuard } from "../helpers/auth.gaurd";
import { ComponentsComponent } from "./components.component";
import { DashboardComponent } from "./dashboard/dashboard.component";

export const AdminRoutingModule: Routes = [{
  path: '',
  component: ComponentsComponent,
  canActivate: [AuthGuard], // Protect parent route
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }, // Protect Dashboard
    {
      path: 'money-transfer',
      loadChildren: () => import('./money-transfer/money-transfer-routing.module').then(m => m.MoneyTransferRoutingModule),
      canActivate: [AuthGuard]
    },
    {
      path: 'mobile-transfer',
      loadChildren: () => import('./mobile-transfer/mobile-transfer-routing.module').then(m => m.MobileTransferRoutingModule),
      canActivate: [AuthGuard]
    },
    {
      path: 'fund-transfer',
      loadChildren: () => import('./fund-transfer/fund-transfer-routing.module').then(m => m.FundTransferRoutingModule),
      canActivate: [AuthGuard]
    },
    {
      path: 'portal',
      loadChildren: () => import('./portal/portal-routing.module').then(m => m.PortalRoutingModule),
      canActivate: [AuthGuard]
    },
    {
      path: 'commission',
      loadChildren: () => import('./commission/commission-routing.module').then(m => m.CommissionRoutingModule),
      canActivate: [AuthGuard]
    },
    {
      path: 'cashback',
      loadChildren: () => import('./cashback/cashback-routing.module').then(m => m.CashbackRoutingModule),
      canActivate: [AuthGuard]
    },
    {
      path: 'aeps',
      loadChildren: () => import('./aeps/aeps-routing.module').then(m => m.AepsRoutingModule),
      canActivate: [AuthGuard]
    },
    {
      path: 'user',
      loadChildren: () => import('./users/users-routing.module').then(m => m.UsersRoutingModule),
      canActivate: [AuthGuard]
    },
    {
      path: 'vendor',
      loadChildren: () => import('./vendors/vendors-routing.module').then(m => m.VendorsRoutingModule),
      canActivate: [AuthGuard]
    },
    {
      path: 'service',
      loadChildren: () => import('./services/services-routing.module').then(m => m.ServicesRoutingModule),
      canActivate: [AuthGuard]
    },
    {
      path: 'sales',
      loadChildren: () => import('./sales/sales-routing.module').then(m => m.SalesRoutingModule),
      canActivate: [AuthGuard]
    },
  ]
}];
