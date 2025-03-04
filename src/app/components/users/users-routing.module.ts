import { Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { VendorLogsComponent } from './vendor-logs/vendor-logs.component';

export const UsersRoutingModule: Routes = [
  {
    path: '',
    component: UserListComponent // Set the default component for this module
  },
  {
    path: 'view/:id',
    component: VendorLogsComponent // Set the Edit component for this module
  },
]