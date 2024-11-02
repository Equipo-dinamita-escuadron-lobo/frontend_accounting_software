import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SaleInvoiceCreationComponent } from './components/sale-invoice-creation/sale-invoice-creation.component';
import { InvoiceCreationComponent } from './components/invoice-creation/invoice-creation.component';
import { FacturesSaleQRComponentComponent } from './components/factures-sale-qrcomponent/factures-sale-qrcomponent.component';

const routes: Routes = [
  {
    path: 'sale',
    component: SaleInvoiceCreationComponent
  },
  {
    path: 'purchase',
    component: InvoiceCreationComponent
  },
  {
    path: 'facturasQR/:id',
    component: FacturesSaleQRComponentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseInvoiceRoutingModule { }
