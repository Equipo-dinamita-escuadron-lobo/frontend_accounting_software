import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Asegúrate de importar FormsModule aquí

import { PurchaseInvoiceRoutingModule } from './purchase-invoice-routing.module';
import { InvoiceCreationComponent } from './components/invoice-creation/invoice-creation.component';
import { InvoiceSelectProductsComponent } from './components/invoice-select-products/invoice-select-products.component';
import { InvoiceSelectSupplierComponent } from './components/invoice-select-supplier/invoice-select-supplier.component';
import { FilterPipe } from './components/pipes/filter.pipe';
import { FilterProductPipe } from './components/pipes/filter-product.pipe';

@NgModule({
  declarations: [
    InvoiceCreationComponent,
    InvoiceSelectProductsComponent,
    InvoiceSelectSupplierComponent,
    FilterPipe,
    FilterProductPipe
  ],
  imports: [
    CommonModule,
    PurchaseInvoiceRoutingModule,
    FormsModule
  ]
})
export class PurchaseInvoiceModule { }
