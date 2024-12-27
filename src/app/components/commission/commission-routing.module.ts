import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommissionAddEditComponent } from './commission-add-edit/commission-add-edit.component';
import { CommissionListComponent } from './commission-list/commission-list.component'; // Import the default component

const routes: Routes = [
  {
    path: '',
    component: CommissionListComponent // Set the default component for this module
  },
  {
    path: 'addcommission',
    component: CommissionAddEditComponent // Set the Add component for this module
  },
  {
    path: 'editcommission/:id',
    component: CommissionAddEditComponent // Set the Edit component for this module
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommissionRoutingModule { }
