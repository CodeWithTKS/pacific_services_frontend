import { Routes } from '@angular/router';
import { CompanyRegisterComponent } from './company-register/company-register.component';

export const CompanyRoutingModule: Routes = [
  {
    path: 'register',
    component: CompanyRegisterComponent // Set the default component for this module
  },
]