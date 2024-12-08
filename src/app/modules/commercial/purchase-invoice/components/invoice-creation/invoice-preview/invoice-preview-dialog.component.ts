import { Component, Inject } from '@angular/core';
import { Facture } from '../../../models/facture';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { PreviewFacture } from '../../../models/previewFacture';

/**
 * Componente para la vista previa de una factura
 */
@Component({
  selector: 'app-invoice-preview-dialog',
  templateUrl: './invoice-preview-dialog.html',
  styles: [],

})
export class InvoicePreviewDialogComponent {

  /**
   * Método para generar los datos del código QR
   * @return string
   */
  generateQRData(): string {
    return `Proveedor: ${this.data.supplier}\nSubtotal: ${this.data.factSubtotals}\nIVA: ${this.data.facSalesTax}\nRetención: ${this.data.facWithholdingSource}\nTotal: ${this.data.total}`;
  }

  /**
   * Constructor del componente
   * @param dialogRef 
   * @param data 
   */
  constructor(
    public dialogRef: MatDialogRef<InvoicePreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PreviewFacture  ) {}

  /**
   * Método para cerrar el diálogo
   */
  cancel(): void {
    this.dialogRef.close(false);
  }

  /**
   * Método para confirmar el diálogo
   */
  confirm(): void {
    this.dialogRef.close(true);
  }
}
