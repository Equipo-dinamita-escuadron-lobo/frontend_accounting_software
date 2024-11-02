import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Asegúrate de importar FormsModule aquí

import { PurchaseInvoiceRoutingModule } from './purchase-invoice-routing.module';
import { InvoiceCreationComponent } from './components/invoice-creation/invoice-creation.component';
import { InvoiceSelectProductsComponent } from './components/invoice-select-products/invoice-select-products.component';
import { InvoiceSelectSupplierComponent } from './components/invoice-select-supplier/invoice-select-supplier.component';
import { FilterPipe } from './components/pipes/filter.pipe';
import { FilterProductPipe } from './components/pipes/filter-product.pipe';
import { SaleInvoiceCreationComponent } from './components/sale-invoice-creation/sale-invoice-creation.component';
import { SaleInvoiceSelectedProductsComponent } from './components/sale-invoice-selected-products/sale-invoice-selected-products.component';
import { SaleInvoiceSelectedSupplierComponent } from './components/sale-invoice-selected-supplier/sale-invoice-selected-supplier.component';
import { Router } from '@angular/router';
import { FacturesSaleQRComponentComponent } from './components/factures-sale-qrcomponent/factures-sale-qrcomponent.component';

@NgModule({
  declarations: [
    InvoiceCreationComponent,
    InvoiceSelectProductsComponent,
    InvoiceSelectSupplierComponent,
    FilterPipe,
    FilterProductPipe,
    SaleInvoiceCreationComponent,
    SaleInvoiceSelectedProductsComponent,
    SaleInvoiceSelectedSupplierComponent,
    FacturesSaleQRComponentComponent,
  ],
  imports: [
    CommonModule,
    
    PurchaseInvoiceRoutingModule,
    FormsModule,
    
  ]
})
export class PurchaseInvoiceModule { }
