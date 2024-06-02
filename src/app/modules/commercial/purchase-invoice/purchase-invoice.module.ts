import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseInvoiceRoutingModule } from './purchase-invoice-routing.module';
import { InvoiceCreationComponent } from './components/invoice-creation/invoice-creation.component';


@NgModule({
  declarations: [
    InvoiceCreationComponent
  ],
  imports: [
    CommonModule,
    PurchaseInvoiceRoutingModule
  ]
})
export class PurchaseInvoiceModule { }
