import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Asegúrate de importar FormsModule aquí
import { MatDialogModule, } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider'


import { PurchaseInvoiceRoutingModule } from './purchase-invoice-routing.module';
import { InvoiceCreationComponent } from './components/invoice-creation/invoice-creation.component';
import { InvoiceSelectProductsComponent } from './components/invoice-select-products/invoice-select-products.component';
import { InvoiceSelectSupplierComponent } from './components/invoice-select-supplier/invoice-select-supplier.component';
import { FilterPipe } from './components/pipes/filter.pipe';
import { FilterProductPipe } from './components/pipes/filter-product.pipe';
import { InvoicePreviewDialogComponent } from './components/invoice-creation/invoice-preview/invoice-preview-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    InvoiceCreationComponent,
    InvoiceSelectProductsComponent,
    InvoiceSelectSupplierComponent,
    InvoicePreviewDialogComponent,
    FilterPipe,
    FilterProductPipe
  ],
  imports: [
    CommonModule,
    PurchaseInvoiceRoutingModule,
    FormsModule,
    MatDialogModule,
    MatDividerModule,
    MatButtonModule,
    QRCodeModule
  ]
})
export class PurchaseInvoiceModule { }
