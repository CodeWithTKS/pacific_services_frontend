import { Routes } from '@angular/router';
import { PortalAddEditComponent } from './portal-add-edit/portal-add-edit.component';
import { PortalListComponent } from './portal-list/portal-list.component'; // Import the default component

export const PortalRoutingModule: Routes = [
  {
    path: '',
    component: PortalListComponent // Set the default component for this module
  },
  {
    path: 'addportal',
    component: PortalAddEditComponent // Set the Add component for this module
  },
  {
    path: 'editportal/:id',
    component: PortalAddEditComponent // Set the Edit component for this module
  },
];
