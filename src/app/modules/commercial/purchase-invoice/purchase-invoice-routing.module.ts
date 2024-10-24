import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SaleInvoiceCreationComponent } from './components/sale-invoice-creation/sale-invoice-creation.component';

const routes: Routes = [
  {
    path: 'sale',
    component: SaleInvoiceCreationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseInvoiceRoutingModule { }
