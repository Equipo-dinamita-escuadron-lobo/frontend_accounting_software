import { Component, Inject } from '@angular/core';
import { Facture } from '../../../models/facture';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { PreviewFacture } from '../../../models/previewFacture';

@Component({
  selector: 'app-invoice-preview-dialog',
  templateUrl: './invoice-preview-dialog.html',
  styles: [],

})
export class InvoicePreviewDialogComponent {

  generateQRData(): string {
    return `Proveedor: ${this.data.supplier}\nSubtotal: ${this.data.factSubtotals}\nIVA: ${this.data.facSalesTax}\nRetención: ${this.data.facWithholdingSource}\nTotal: ${this.data.total}`;
  }

  constructor(
    public dialogRef: MatDialogRef<InvoicePreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PreviewFacture  ) {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
