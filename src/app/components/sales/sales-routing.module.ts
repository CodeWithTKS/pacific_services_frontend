import { Routes } from '@angular/router';
import { SalesListComponent } from './sales-list/sales-list.component';
import { SaleAddEditComponent } from './sale-add-edit/sale-add-edit.component';
import { ManualSalesComponent } from './manual-sales/manual-sales.component';

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
  {
    path: 'manual/add',
    component: ManualSalesComponent // Set the default component for this module
  },
  {
    path: 'manual/edit/:id',
    component: ManualSalesComponent // Set the default component for this module
  },
]