import { Routes } from '@angular/router';
import { MoneyTransferListComponent } from './money-transfer-list/money-transfer-list.component';

export const MoneyTransferRoutingModule: Routes = [
  {
    path: '',
    component: MoneyTransferListComponent // Set the default component for this module
  }
]
