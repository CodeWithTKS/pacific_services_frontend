import { Routes } from '@angular/router';
import { PanCardServiceListComponent } from './pan-card-service-list/pan-card-service-list.component';
import { PanCardServiceAddEditComponent } from './pan-card-service-add-edit/pan-card-service-add-edit.component';
export const PanCardServiceRoutingModule: Routes = [
  {
    path: '',
    component: PanCardServiceListComponent // Set the default component for this module
  },
  {
    path: 'add',
    component: PanCardServiceAddEditComponent // Set the default component for this module
  },
  {
    path: 'edit/:id',
    component: PanCardServiceAddEditComponent // Set the default component for this module
  },
]