import { Routes } from '@angular/router';
import { AepsListComponent } from './aeps-list/aeps-list.component';
import { AepsAddEditComponent } from './aeps-add-edit/aeps-add-edit.component';


export const AepsRoutingModule: Routes = [
  {
    path: '',
    component: AepsListComponent // Set the default component for this module
  },
  {
    path: 'addmoney',
    component: AepsAddEditComponent // Set the Add component for this module
  },
  {
    path: 'editmoney/:id',
    component: AepsAddEditComponent // Set the Edit component for this module
  },
]
