import { Routes } from '@angular/router';
import { FundTransferlistComponent } from './fund-transferlist/fund-transferlist.component';
import { FundTransferAddEditComponent } from './fund-transfer-add-edit/fund-transfer-add-edit.component';

export const FundTransferRoutingModule: Routes = [
  {
    path: '',
    component: FundTransferlistComponent // Set the default component for this module
  },
  {
    path: 'addmoney',
    component: FundTransferAddEditComponent // Set the Add component for this module
  },
  {
    path: 'editmoney/:id',
    component: FundTransferAddEditComponent // Set the Edit component for this module
  },
]
