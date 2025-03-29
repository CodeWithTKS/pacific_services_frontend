import { Routes } from "@angular/router";
import { CashbackListComponent } from "./cashback-list/cashback-list.component";

export const CashbackRoutingModule: Routes = [
  {
    path: '',
    component: CashbackListComponent // Set the default component for this module
  },
]