import { Routes } from '@angular/router';
import { VendorListComponent } from './vendor-list/vendor-list.component';
import { VendorLogsComponent } from './vendor-logs/vendor-logs.component';

export const VendorsRoutingModule: Routes = [
  {
    path: '',
    component: VendorListComponent // Set the default component for this module
  },
  {
    path: 'view/:id',
    component: VendorLogsComponent // Set the Edit component for this module
  },
]