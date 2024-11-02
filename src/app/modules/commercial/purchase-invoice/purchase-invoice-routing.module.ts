import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SaleInvoiceCreationComponent } from './components/sale-invoice-creation/sale-invoice-creation.component';
import { InvoiceCreationComponent } from './components/invoice-creation/invoice-creation.component';

const routes: Routes = [
  {
    path: 'sale',
    component: SaleInvoiceCreationComponent
  },
  {
    path: 'purchase',
    component: InvoiceCreationComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseInvoiceRoutingModule { }
