import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseInvoiceRoutingModule } from './purchase-invoice-routing.module';
import { InvoiceCreationComponent } from './components/invoice-creation/invoice-creation.component';
import { InvoiceSelectProductsComponent } from './components/invoice-select-products/invoice-select-products.component';
import { InvoiceSelectSupplierComponent } from './components/invoice-select-supplier/invoice-select-supplier.component';
import { FilterPipe } from './components/filter.pipe';


@NgModule({
  declarations: [
    InvoiceCreationComponent,
    InvoiceSelectProductsComponent,
    InvoiceSelectSupplierComponent,
    FilterPipe
  ],
  imports: [
    CommonModule,
    PurchaseInvoiceRoutingModule
  ]
})
export class PurchaseInvoiceModule { }
