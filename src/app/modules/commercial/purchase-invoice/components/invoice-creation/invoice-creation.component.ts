import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { EnterpriseDetails } from '../../../enterprise-managment/models/Enterprise';
import { EnterpriseService } from '../../../enterprise-managment/services/enterprise.service';
import { Third } from '../../../third-parties-managment/models/Third';
import { ThirdServiceService } from '../../../third-parties-managment/services/third-service.service';
import { Facture } from '../../models/facture';
import { ProductI } from '../../models/productInvoice';
import { ProductS } from '../../models/productSend';
import { InvoiceServiceService } from '../../services/invoice-service.service';
import { InvoiceSelectProductsComponent } from '../invoice-select-products/invoice-select-products.component';
import { InvoiceSelectSupplierComponent } from '../invoice-select-supplier/invoice-select-supplier.component';
import { InvoicePreviewDialogComponent } from './invoice-preview/invoice-preview-dialog.component';
import { PreviewFacture } from '../../models/previewFacture';
import { buttonColors } from '../../../../../shared/buttonColors';
import { FactureV } from '../../models/factureV';

/**
 * Componente para la creación de una factura de compra
 */
@Component({
  selector: 'app-invoice-creation',
  templateUrl: './invoice-creation.component.html',
  styleUrls: ['./invoice-creation.component.css']
})
export class InvoiceCreationComponent implements OnInit {
  /**
   * Variables del componente
   */
  enterpriseSelected?: EnterpriseDetails; // Variable para almacenar la empresa seleccionada

  // Variables for third parties
  showSectionThrid: boolean = true; // Variable para mostrar la sección de terceros
  showInfoThird: boolean = false; // Variable para mostrar la información del tercero
  SectionNotas: boolean = false;  // Variable para mostrar la sección de notas
  selectedSupplier: any;  // Variable para almacenar el proveedor seleccionado
  selectedSupplierS?: number; // Variable para almacenar el proveedor seleccionado
  supplierS?: Third;  // Variable para almacenar la información del proveedor
  supplierSCopy?: Third;  // Variable para almacenar la información del proveedor
  changeSupplierS: boolean = false;  // Variable para saber si se cambió el proveedor
  isLoadingPdfPreview: boolean = false;  // Variable para saber si se está cargando la vista previa del PDF
  isSavingPdf: boolean = false;  // Variable para saber si se está guardando el PDF

  // Variables for products
  showSectionProducts: boolean = true;    // Variable para mostrar la sección de productos
  showInfoProducts: boolean = false;  // Variable para mostrar la información de los productos 
  lstProducts: ProductI[] = [];   // Variable para almacenar la lista de productos
  lstProductsSecurity: ProductI[] = [];   // Variable para almacenar la lista de productos

  // Variables for purchase invoice
  subTotal: number = 0; 
  taxTotal: number = 0;
  retention: number = 0;
  total: number = 0;

  currentDate: Date = new Date();   // Variable para almacenar la fecha actual
  dueDate?: string;   // Variable para almacenar la fecha de vencimiento
  paymentMethod: string = 'debito'; // Variable para almacenar el método de pago
  lstProductsSend: ProductS[] = []; // Variable para almacenar la lista de productos a enviar

  // Columns for products table
  columnsProducts: any[] = [
    { title: 'Nombres', data: 'itemType' },
    { title: 'Descripción', data: 'description' },
    { title: 'Costo Unitario', data: 'cost' },
    { title: 'Cantidad' },
    { title: 'IVA' },
    { title: 'Subtotal' },
  ];

  nota: string = "";  // Variable para almacenar la nota de la factura
  /**
   * Constructor del componente
   * @param enterpriseService 
   * @param dialog 
   * @param thirdService 
   * @param invoiceService 
   * @param router 
   */
  constructor(private enterpriseService: EnterpriseService,
    private dialog: MatDialog,
    private thirdService: ThirdServiceService,
    private invoiceService: InvoiceServiceService,
    private router: Router) { }

  /**
   * Método para inicializar el componente
   */
  ngOnInit() {
    this.getEnterpriseSelectedInfo();
  }

  /**
   * Método para obtener la información de la empresa seleccionada
   * @return Enterprise
   */
  getEnterpriseSelectedInfo() {
    const id = this.enterpriseService.getSelectedEnterprise();
    if (id === null) {
      // Manejar caso donde no hay empresa seleccionada
    } else {
      this.enterpriseService.getEnterpriseById(id).subscribe({
        next: (enterpriseData) => {
          this.enterpriseSelected = enterpriseData;
        },
      });
    }
    return this.enterpriseSelected;
  }

  /**
   * Método para obtener la información del tercero
   * @param thirdId 
   * @return Third
   */
  getSupplier(thirdId: any) {
    if (thirdId) {
      this.thirdService.getThirdPartie(thirdId).subscribe({
        next: (response: Third) => {
          this.supplierS = response;
        }
      });
    }
  }

  /**
   * Método para seleccionar un proveedor
   */
  selectSupplier() {
    this.OpenListThirds('Seleccion de proveedor', this.enterpriseSelected?.id, InvoiceSelectSupplierComponent);
  }

  /**
   * Método para crear un proveedor
   */
  createSupplier() {
    this.router.navigate(['/general/operations/third-parties/create']);
  }
  
  /**
   * Método para mostrar la sección de terceros
   */
  showSectionThridM() {
    this.showSectionThrid = !this.showSectionThrid;
  }

  /**
   * Método para seleccionar productos
   * @return void
   */
  selectProducts() {
    this.OpenListProducts('Seleccion de Productos', this.enterpriseSelected?.id, InvoiceSelectProductsComponent);
  }

  /**
   * Método para crear un producto
   * @return void
   */
  createProduct() {
    this.router.navigate(['/general/operations/products/create']);
  }

  /**
  * Método para mostrar la sección de productos
  */
  showSectionProductsM() {
    this.showSectionProducts = !this.showSectionProducts;
  }

  /**
   * Método para dar formato a un precio
   * @return void
   */
  formatPrice(price: number): string {
    return price.toLocaleString('es-ES');
  }

  /**
   * Método para calcular el total de un producto
   * @param prod 
   * @return void
   */
  calculateTotal(prod: ProductI): void {
    prod.totalValue = this.calculateTotalValue(prod); //Llamado para cada producto
    this.calculateInvoiceTotals(); //Llama para que se vaya actualizando los labels de abajo
  }

  /**
   * Método para calcular el valor total de un producto en la factura de compra incluyendo el IVA
   * @param prod 
   * @return number
   */
  calculateTotalValue(prod: ProductI): number {
    const subtotalProduct = prod.amount * prod.cost;
    return subtotalProduct;
  }

  /**
   * Método para calcular los totales de la factura de compra
   * @return void
   */
  calculateInvoiceTotals(): void {
    console.log(this.lstProducts)
    this.subTotal = this.lstProducts.reduce((acc, prod) => acc + ((prod.cost * prod.amount)), 0);
    this.taxTotal = this.lstProducts.reduce((acc, prod) => acc + ((prod.cost * prod.amount) * prod.IVA / 100), 0);
    this.retention = this.subTotal * 0.025;
    this.total = this.subTotal + this.taxTotal - this.retention;
  }

  /**
   * Método para guardar la factura de compra
   * @return void
   * @example saveFacture()
   */
  saveFacture() {
    this.lstProductsSend = this.lstProducts.map(prod => ({
      productId: parseInt(prod.id),
      amount: prod.amount,
      description: prod.description,
      vat: prod.IVA / 100,
      unitPrice: prod.cost,
      subtotal: (prod.cost * prod.amount * (1 + prod.IVA / 100))
    }));
    /**
     * Objeto de factura de compra
     * @type Facture
     * @const factureS
     * @example {
     * entId: 1,
     * thId: 1,
     * factCode: 0,
     * factureType: "Compra",
     * factObservations: "Factura de compra",
     * factProducts: [
     * {
     * productId: 1,
     * amount: 1,
     * description: "Producto 1",
     * vat: 0.19,
     * unitPrice: 1000,
     * subtotal: 1190
     * }
     * ],
     * factSubtotals: 1000,
     * facSalesTax: 190,
     * facWithholdingSource: 25
     * }
     */
    const factureS: Facture = {
      entId: this.enterpriseSelected?.id,
      thId: this.supplierS?.thId,
      factCode: 0,
      factureType: "Compra",
      factObservations: this.nota,
      factProducts: this.lstProductsSend,
      factSubtotals: this.subTotal,
      facSalesTax: this.taxTotal,
      facWithholdingSource: this.retention
    };

    const previewFacture: PreviewFacture = {
      entId: this.enterpriseSelected?.id,
      thId: this.supplierS?.thId,
      supplier: this.supplierS?.names + ' ' + this.supplierS?.lastNames,
      factCode: 0,
      factObservations: this.nota,
      factureType: "Compra",
      factProducts: this.lstProductsSend,
      factSubtotals: this.subTotal,
      facSalesTax: this.taxTotal,
      facWithholdingSource: this.retention,
      total: this.subTotal - this.taxTotal -this.retention
    }

    const dialogRef = this.dialog.open(InvoicePreviewDialogComponent, {
      width: '400px',
      data: previewFacture
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveInvoice(factureS); 
      } else {
        console.log('Se canceló el guardado de la factura.');
      }
    });

  }

  /**
   * Método para mostrar la sección de notas
   */
  showSectionNotas() {
    this.SectionNotas = !this.SectionNotas;
  }

  /**
   * Método para guardar la factura de compra
   * @param facture 
   * @return void
   */
  async saveInvoice(facture: any) {
  
    this.isSavingPdf = true;
    this.invoiceService.saveInvoice(facture).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // Extraer el nombre del archivo del encabezado 'Content-Disposition'
        const contentDisposition = blob.type;
        const fileName = this.extractFileName(contentDisposition);

        //Para borrar datos de factura
        this.supplierS = undefined;
        this.supplierSCopy = undefined;
        this.lstProducts = [];
        this.lstProductsSend = [];
        this.showInfoThird = false;
        this.showInfoProducts = false;
        this.changeSupplierS = false;
        this.subTotal = 0;
        this.taxTotal = 0;
        this.retention = 0;
        this.total = 0;

        link.setAttribute('download', fileName || 'facture.pdf');
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        this.isSavingPdf = false;
        Swal.fire({
          title: 'Creación exitosa',
          text: 'Se ha creado la factura con éxito!',
          confirmButtonColor: buttonColors.confirmationColor,
          icon: 'success',
        });
      },
      (error) => {
        this.isSavingPdf = false;
        Swal.fire({
          title: 'Error',
          text: 'Ha ocurrido un error al crear la factura.',
          confirmButtonColor: buttonColors.confirmationColor,
          icon: 'error',
        });
      }
    );
  }

  changeSupplier(){

  }

  private extractFileName(contentDisposition: string): string | null {
    const matches = /filename="(.+)"/.exec(contentDisposition);
    return matches && matches[1] ? matches[1] : null;
  }

  /**
   * Método para abrir la lista de terceros
   * @param title 
   * @param entId 
   * @param component
   * @return void
   * @example OpenListThirds('Seleccion de proveedor', 1, InvoiceSelectSupplierComponent)
   */
  OpenListThirds(title: any, entId: any, component: any) {
    const _popUp = this.dialog.open(component, {
      width: '50%',
      height: 'auto',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '100ms',
      data: {
        title: title,
        entId: entId
      }
    });

    _popUp.afterClosed().subscribe(result => {
      if (result) {
        console.log('Información recibida del modal:', result);
        this.selectedSupplier = result;
        this.showInfoThird = true;
        this.showSectionProducts = true;
        this.getSupplier(result);

        if((this.supplierS?.thId !== this.supplierSCopy?.thId) && (this.lstProducts.length !== 0)){
          Swal.fire({
            title: "Cambio de proveedor",
            text: "Si cambia de proveerdor se perderan los datos que hayan registrado en productos!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: buttonColors.confirmationColor,
            cancelButtonColor: buttonColors.cancelButtonColor,
            confirmButtonText: "Confirmar!"
          }).then((result) => {
            if (result.isConfirmed) {
              this.supplierSCopy = this.supplierS;
              this.lstProducts = [];
              this.showInfoProducts = false;
            }
          });
        }
      } else {
        this.supplierS = undefined;
        this.showInfoThird = false;
        this.showInfoProducts = false;
        this.showSectionProducts = false;
      }
    });
  }

  /**
   * Método para cargar la información de la factura
   */
  loadFactureInfo() {
    this.lstProductsSend = this.lstProducts.map(prod => ({
      productId: parseInt(prod.id),
      amount: prod.amount,
      description: prod.description,
      vat: prod.IVA / 100,
      code: prod.itemType,
      unitPrice: prod.cost,
      subtotal: (prod.cost * prod.amount * (1 + prod.IVA / 100))
    }));
  }

  /**
   * Método para generar la vista previa de la factura
   */
  async generatePdfPreview() {
    this.loadFactureInfo();

    const previewFacture: FactureV = {
      entId: this.enterpriseSelected?.id,
      thId: this.supplierS?.thId,
      factCode: 0,
      factureType: "Compra",
      factObservations: this.nota, 
      factProducts: this.lstProductsSend,
      factSubtotals: this.subTotal,
      facSalesTax: this.taxTotal,
      facWithholdingSource: this.retention,
      descounts: 0,
    };


    if (!previewFacture) {
      Swal.fire({
        title: 'Error',
        text: 'No hay factura disponible para mostrar.',
        icon: 'error',
      });
      return;
    }
    this.isLoadingPdfPreview = true;
    this.invoiceService.generateInvoicePreview(previewFacture).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url);
        this.isLoadingPdfPreview = false;
        Swal.fire({
          title: 'Visualización exitosa',
          text: 'Se ha generado la vista previa de la factura.',
          icon: 'success',
        });
      },
      (error) => {
        this.isLoadingPdfPreview = false;
        Swal.fire({
          title: 'Error',
          text: 'Ha ocurrido un error al generar la vista previa de la factura.',
          icon: 'error',
        });
      }
    );
  }

  /**
   * Método para abrir la lista de productos
   * @param title 
   * @param entId 
   * @param component 
   */
  OpenListProducts(title: any, entId: any, component: any) {
    const _popUp = this.dialog.open(component, {
      width: '0%',
      height: 'auto',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '100ms',
      data: {
        title: title,
        entId: entId
      }
    });

    /**
     * Método para cerrar el modal y obtener la información de los productos seleccionados
     */
    _popUp.afterClosed().subscribe(result => {
      if (result && result.length > 0) {
        console.log('Información recibida del modal:', result);
        this.lstProducts = result;
        this.lstProducts.forEach(prod => {
          prod.IVA = prod.taxPercentage;
          prod.amount = 1;
          prod.totalValue = 0;
        });
        this.showInfoProducts = true;
        this.calculateInvoiceTotals();
      } else {
        console.log('No selecciono ningun producto');
        this.showInfoProducts = false;
      }
    });
  }
}

