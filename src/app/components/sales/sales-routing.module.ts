import { Routes } from '@angular/router';
import { SaleAddEditComponent } from './sale-add-edit/sale-add-edit.component';
import { SalesListComponent } from './sales-list/sales-list.component';

export const SalesRoutingModule: Routes = [
  {
    path: '',
    component: SalesListComponent // Set the default component for this module
  },
  {
    path: 'add',
    component: SaleAddEditComponent // Set the default component for this module
  },
  {
    path: 'edit/:id',
    component: SaleAddEditComponent // Set the default component for this module
  },
]