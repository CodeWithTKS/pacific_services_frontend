import { Routes } from '@angular/router';
import { PortalListComponent } from './portal-list/portal-list.component'; // Import the default component

export const PortalRoutingModule: Routes = [
  {
    path: '',
    component: PortalListComponent // Set the default component for this module
  }
];
