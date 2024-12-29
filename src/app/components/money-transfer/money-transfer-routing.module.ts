import { Routes } from '@angular/router';
import { MoneyTransferListComponent } from './money-transfer-list/money-transfer-list.component';
import { MoneyAddEditComponent } from './money-add-edit/money-add-edit.component';

export const MoneyTransferRoutingModule: Routes = [
  {
    path: '',
    component: MoneyTransferListComponent // Set the default component for this module
  },
  {
    path: 'addmoney',
    component: MoneyAddEditComponent // Set the Add component for this module
  },
  {
    path: 'editmoney/:id',
    component: MoneyAddEditComponent // Set the Edit component for this module
  },
]
