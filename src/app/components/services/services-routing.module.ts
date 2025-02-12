import { Routes } from '@angular/router';
import { ServiceListComponent } from './service-list/service-list.component';

export const ServicesRoutingModule: Routes = [
  {
    path: '',
    component: ServiceListComponent // Set the default component for this module
  },
]