import { Routes } from '@angular/router';
import { MobileTransferListComponent } from './mobile-transfer-list/mobile-transfer-list.component';
import { MobileTransferAddEditComponent } from './mobile-transfer-add-edit/mobile-transfer-add-edit.component';

export const MobileTransferRoutingModule: Routes = [
  {
    path: '',
    component: MobileTransferListComponent // Set the default component for this module
  },
  {
    path: 'addmoney',
    component: MobileTransferAddEditComponent // Set the Add component for this module
  },
  {
    path: 'editmoney/:id',
    component: MobileTransferAddEditComponent // Set the Edit component for this module
  },
]
