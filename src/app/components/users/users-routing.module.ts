import { Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';

export const UsersRoutingModule: Routes = [
  {
    path: '',
    component: UserListComponent // Set the default component for this module
  },
]