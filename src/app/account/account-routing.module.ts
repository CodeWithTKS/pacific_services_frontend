import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

export const AccountRoutingModule: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
];
