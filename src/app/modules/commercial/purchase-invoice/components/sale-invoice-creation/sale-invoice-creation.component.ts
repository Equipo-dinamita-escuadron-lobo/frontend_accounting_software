import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { ProductCreationComponent } from '../../../product-managment/components/product-creation/product-creation.component';


import { CommonModule } from '@angular/common';
import { EnterpriseDetails } from '../../../enterprise-managment/models/Enterprise';
import { EnterpriseService } from '../../../enterprise-managment/services/enterprise.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { InvoiceSelectSupplierComponent } from '../invoice-select-supplier/invoice-select-supplier.component';
import { ThirdServiceService } from '../../../third-parties-managment/services/third-service.service';
import { Third } from '../../../third-parties-managment/models/Third';
import { InvoiceSelectProductsComponent } from '../invoice-select-products/invoice-select-products.component';
import { ProductI } from '../../models/productInvoice';
import { Facture } from '../../models/facture';
import { ProductS } from '../../models/productSend';
import { InvoiceServiceService } from '../../services/invoice-service.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { buttonColors } from '../../../../../shared/buttonColors'
import { SaleInvoiceSelectedSupplierComponent } from '../sale-invoice-selected-supplier/sale-invoice-selected-supplier.component';
import { SaleInvoiceSelectedProductsComponent } from '../sale-invoice-selected-products/sale-invoice-selected-products.component';
import { FactureV } from '../../models/factureV';
import { ThirdCreationComponent } from '../../../third-parties-managment/components/third-creation/third-creation.component';
import { UnitOfMeasureService } from '../../../product-managment/services/unit-of-measure.service';
import { get } from 'jquery';
import { MatPaginatorModule } from '@angular/material/paginator';
@Component({

  selector: 'app-sale-invoice-creation',
  templateUrl: './sale-invoice-creation.component.html',
  styleUrls: ['./sale-invoice-creation.component.css'],

})



export class SaleInvoiceCreationComponent implements OnInit {
  enterpriseSelected?: EnterpriseDetails;
  isLoadingPdfPreview: boolean = false;
  isSavingPdf: boolean = false;
  // Variables for third parties
  showSectionThrid: boolean = true;
  SectionNotas: boolean = false;
  showInfoThird: boolean = false;
  selectedSupplier: any;
  selectedSupplierS?: number;
  supplierS?: Third;
  supplierSCopy?: Third;
  changeSupplierS: boolean = false;

  // Variables for products
  showSectionProducts: boolean = true;
  showInfoProducts: boolean = false;
  lstProducts: ProductI[] = [];
  lstProductsSecurity: ProductI[] = [];

  // Variables for purchase invoice
  subTotal: number = 0;
  taxTotal: number = 0;
  uvt: number = 47065;
  retention: number = 0;
  descuentoPorc: number = 0;
  descuentoVal: number = 0;
  descuentoTotal: number = 0;
  total: number = 0;
  impuestoCheck: boolean = true;
  retencionCheck: boolean = true;

  currentDate: Date = new Date();
  dueDate?: string;
  paymentMethod: string = 'debito';
  lstProductsSend: ProductS[] = [];

  factureType: string = 'Venta';

  columnsProducts: any[] = [
    { title: '#' },
    { title: 'Codigo', data: 'itemType' },
    { title: 'Descripción', data: 'description' },
    { title: 'Cantidad' },
    { title: 'U/M' },
    { title: 'Precio Unitario', data: 'price' },
    { title: 'Descuento' },
    { title: 'IVA' },
    { title: 'Subtotal' },
    { title: 'Eliminar' }
  ];

  nota: string = "";

  constructor(private enterpriseService: EnterpriseService,
    private location: Location,
    private UnitMeasureService: UnitOfMeasureService,
    private dialog: MatDialog,
    private thirdService: ThirdServiceService,
    private invoiceService: InvoiceServiceService,
    private router: Router) { }

  ngOnInit() {
    this.getEnterpriseSelectedInfo();
  }

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

  cancelCreateProduct() {
    this.location.back(); // Navega hacia atrás en el historial
  }

  getSupplier(thirdId: any) {
    if (thirdId) {
      this.thirdService.getThirdPartie(thirdId).subscribe({
        next: (response: Third) => {
          this.supplierS = response;
        }
      });
    }
  }

  selectSupplier() {
    const dialogRef = this.OpenListThirds(
      'Seleccion de Cliente',
      this.enterpriseSelected?.id,
      SaleInvoiceSelectedSupplierComponent
    );

  }



  createSupplier() {
    const dialogRef = this.dialog.open(ThirdCreationComponent, {
      width: '900px',
      height: '80vh', // Establece una altura del 80% del viewport
      data: { destination: "destination" },
      panelClass: 'dialog-scrollable' // Agrega una clase personalizada al diálogo
    });
  }


  getUnitOfMeasureForId(lstProducts: ProductI[]): ProductI[] {
    if (lstProducts != null || this.lstProducts.length > 0) {

      lstProducts.forEach((prod) => {
        //console.log(prod.unitOfMeasureId);
        this.UnitMeasureService.getUnitOfMeasuresId("" + prod.unitOfMeasureId).subscribe({
          next: (response) => {
            prod.unitOfMeasure = response.abbreviation;
          }
        });
      });
    }

    return lstProducts;

  }


  showSectionThridM() {
    this.showSectionThrid = !this.showSectionThrid;
  }

  showSectionNotas() {
    this.SectionNotas = !this.SectionNotas;
  }

  // Método para mostrar ventana emergente de productos
  selectProducts() {

    const dialogRef = this.OpenListProducts(
      'Seleccion de Productos',
      this.enterpriseSelected?.id,
      this.supplierS?.thId,
      SaleInvoiceSelectedProductsComponent
    );


  }

  createProduct() {
    const dialogRef = this.dialog.open(ProductCreationComponent, {
      width: '600px',
      height: '80vh',
      data: { destination: "destination" },
      panelClass: 'dialog-scrollable' // Agrega una clase personalizada al diálogo
    });


  }


  showSectionProductsM() {
    this.showSectionProducts = !this.showSectionProducts;
  }

  formatPrice(price: number): string {
    price=parseFloat(price.toFixed(2))
    
    return price.toString();
  }
  onKeyDown(event: KeyboardEvent) {
    // Permitir solo números y teclas especiales como Backspace, Tab, etc.
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight'];
    if (!/\d/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  
  formatValue(displayValue: string, value:number,formatValue:string):[number,string] {

    if (displayValue === '') {
      value = 0;
      formatValue = '';
      return [0, ''];
    }
    // Elimina caracteres no numéricos
    const numericValue = String(displayValue).replace(/\D/g, '') ;

    // Almacena el valor sin formato en `value` para cálculos
    value = parseFloat(numericValue);

    // Agrega puntos de miles para el displayValue
    formatValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    //console.log(formatValue);

    return [value, formatValue];

  }

  // Paara calcular total de cada producto
  calculateTotal(index?: number,prod?: ProductI): void {
    if (index === undefined || prod === undefined) {
      if(prod!=undefined){
        prod.totalValue = this.calculateTotalValue(prod); //Llamado para cada producto
        prod.IvaValor = prod.totalValue * prod.IVA / 100;
        this.calculateInvoiceTotals(); //Llama para que se vaya actualizando los labels de abajo
      }

      return;
    }else{
      this.lstProducts[index].price=this.formatValue(prod.displayPrice,prod.price,prod.displayPrice)[0];
      this.lstProducts[index].displayPrice=this.formatValue(prod.displayPrice,prod.price,prod.displayPrice)[1];
    
      prod.totalValue = this.calculateTotalValue(prod); //Llamado para cada producto
      prod.IvaValor = prod.totalValue * prod.IVA / 100;
      this.calculateInvoiceTotals(); //Llama para que se vaya actualizando los labels de abajo
    }

  }

  switchDescuento(type: 'porc' | 'val', prod: ProductI): void {
    
    prod.descuentos[1]=this.formatValue(prod.displayDescuentos,prod.descuentos[1],prod.displayDescuentos)[0];
    prod.displayDescuentos=this.formatValue(prod.displayDescuentos,prod.descuentos[1],prod.displayDescuentos)[1];

    if (type === 'porc') {
      prod.descuentos[1] = 0; // Vacía el descuento en valor si se escribe en porcentaje
      prod.displayDescuentos = '0';
    } else if (type === 'val') {
      prod.descuentos[0] = 0; // Vacía el descuento en porcentaje si se escribe en valor


    }
    this.calculateTotal(undefined,prod);
    this.calculateInvoiceTotals();
  }

  // para calcular valor total del producto 
  calculateTotalValue(prod?: ProductI): any {
    if (prod) {
      if(prod.amount==0){
        return 0;
      }
      const totalValue = prod.price * prod.amount;
      
      return totalValue-(totalValue * prod.descuentos[0] / 100)-prod.descuentos[1];
    }
    
  }
  calculateRetention(uvt: number): boolean {
    this.uvt = uvt;
    if ((this.uvt * 27) < this.subTotal) {
      this.retention = this.subTotal * 0.025;
      return true
    } else {
      this.retention = 0;
      
      return false
    }
    
  }
  //para calcular los datos como impuesto, subtotal y total de la factura
  calculateInvoiceTotals(): void {

    
    this.subTotal = 0;
    this.lstProducts.forEach(prod => {
    // Calcular subtotal para cada producto aplicando los descuentos
    let subtotalProducto = 0

    if(prod.amount!=0){
      subtotalProducto=(prod.price * prod.amount)
      - ((prod.price * prod.amount) * prod.descuentos[0] / 100)
      - prod.descuentos[1];
    }
    
    // Agregar al subtotal total
    this.subTotal += subtotalProducto;

});

    
    this.taxTotal = this.lstProducts.reduce((acc, prod) => acc + (this.calculateTotalValue(prod) * prod.IVA / 100), 0);
    

    if ((this.uvt * 27) < this.subTotal && this.retencionCheck) {
      this.retention = this.subTotal * 0.025;
    } else {
      this.retention = 0;
    }

    this.descuentoTotal = 0;
    this.lstProducts.forEach(prod => {
        // Calcular descuento para cada producto
        let descuentoCalculado = 0;
        if(prod.amount!=0){
          descuentoCalculado=((prod.price * prod.amount) * prod.descuentos[0] / 100) + prod.descuentos[1];
        }
        
        // Agregar el descuento al total
        this.descuentoTotal += descuentoCalculado;

        
    });

    
    this.total = this.subTotal + this.taxTotal - this.retention;
  }
  deleteProduct(index: number): void {
    this.lstProducts.splice(index, 1);
    this.calculateInvoiceTotals();
}


  saveFacture() {
    this.loadFactureInfo();
    //console.log("Productos a enviar" + this.lstProductsSend.forEach(prod => { console.log(prod) }));
    const factureS: FactureV = {
      entId: this.enterpriseSelected?.id,
      thId: this.supplierS?.thId,
      factCode: 0,
      factObservations: this.nota, //Modificar cuando se agregue campo en la vista
      descounts: this.descuentoTotal, //Modificar cuando se agregue campo en la vista
      factureType: this.factureType,
      factProducts: this.lstProductsSend,
      factSubtotals: this.subTotal,
      facSalesTax: this.taxTotal,
      facWithholdingSource: this.retention
    };

    this.saveInvoice(factureS);
  }

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
        this.nota = "";
        this.descuentoVal = 0;
        this.descuentoPorc = 0;
        this.descuentoTotal = 0;

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

  changeSupplier() {

  }

  private extractFileName(contentDisposition: string): string | null {
    const matches = /filename="(.+)"/.exec(contentDisposition);
    return matches && matches[1] ? matches[1] : null;
  }

  OpenListThirds(title: any, entId: any, component: any): MatDialogRef<any> {
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
        //console.log('Información recibida del modal:', result);
        this.selectedSupplier = result;
        this.showInfoThird = true;
        this.showSectionProducts = true;
        this.getSupplier(result);

        if (this.supplierS?.thId !== this.supplierSCopy?.thId && this.lstProducts.length !== 0) {
          Swal.fire({
            title: "Cambio de proveedor",
            text: "Si cambia de proveedor se perderán los datos que hayan registrado en productos!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: buttonColors.confirmationColor,
            cancelButtonColor: buttonColors.cancelButtonColor,
            confirmButtonText: "Confirmar!"
          }).then((swalResult) => {
            if (swalResult.isConfirmed) {
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

    return _popUp;
  }

  OpenListProducts(title: any, entId: any, thId: any, component: any): MatDialogRef<any> {
    const _popUp = this.dialog.open(component, {
      width: '50%', // Cambia a un valor mayor para que sea visible
      height: 'auto',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '100ms',
      data: {
        title: title,
        entId: entId,
        thId: thId,
        products: this.lstProducts
      }
    });

    _popUp.afterClosed().subscribe(result => {
      if (result && result.length > 0) {
        //console.log('Información recibida del modal:', result);
        let products = result.map((prod: any) => {
          return {
            id: prod.id,
            itemType: prod.itemType,
            description: prod.description,
            price: prod.cost,
            displayPrice: String(prod.cost),
            taxPercentage: prod.taxPercentage,
            unitOfMeasureId: prod.unitOfMeasureId,
            IVA: 0,
            IvaValor: 0,
            amount: 0,
            totalValue: 0,
            descuentos: [0, 0],
            displayDescuentos: '0'
          };
        });
        this.lstProducts = products;


        this.lstProducts.forEach(prod => {
          prod.IVA = prod.taxPercentage;
          prod.IvaValor = prod.price * prod.IVA / 100;
          prod.amount = 1;
          prod.totalValue = 0;
        });
        this.lstProducts = this.getUnitOfMeasureForId(this.lstProducts);
        //console.log(this.lstProducts);
        this.showInfoProducts = true;
        this.calculateInvoiceTotals();
      } else {
        //console.log('No seleccionó ningún producto');
        this.showInfoProducts = false;
      }
    });

    return _popUp;
  }

  async generatePdfPreview() {

    this.loadFactureInfo();

    const previewFacture: FactureV = {
      entId: this.enterpriseSelected?.id,
      thId: this.supplierS?.thId,
      factCode: 0,
      factureType: this.factureType,
      descounts: this.descuentoTotal, 
      factObservations: this.nota, 
      factProducts: this.lstProductsSend,
      factSubtotals: this.subTotal,
      facSalesTax: this.taxTotal,
      facWithholdingSource: this.retention
    };


    if (!previewFacture) {
      Swal.fire({
        title: 'Error',
        text: 'No hay factura disponible para mostrar.',
        icon: 'error',
        confirmButtonColor: buttonColors.confirmationColor,
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
          confirmButtonColor: buttonColors.confirmationColor,
          icon: 'success',
        });
      },
      (error) => {
        this.isLoadingPdfPreview = false;
        Swal.fire({
          title: 'Error',
          text: 'Ha ocurrido un error al generar la vista previa de la factura.',
          confirmButtonColor: buttonColors.confirmationColor,
          icon: 'error',
        });
      }
    );
  }

  calculateDescountTotal(product: ProductI): Number {
    if (product.descuentos[1] != 0) {
      const priceTotal = product.price * product.amount;
      const discount = 100 * product.descuentos[1] / priceTotal;
      return Math.floor(discount * 100) / 100; // Trunca a dos decimales
    }
    return Math.floor(product.descuentos[0] * 100) / 100; // Trunca a dos decimales
  }
  
  loadFactureInfo() {
    const descuento = 0;
    this.lstProductsSend = this.lstProducts.map(prod => ({
      
      productId: parseInt(prod.id),
      amount: prod.amount,
      description: prod.description,
      vat: prod.IVA / 100,
      descount: this.calculateDescountTotal(prod),
      code: prod.itemType,
      unitPrice: prod.price,
      subtotal: (prod.price * prod.amount * (1 + prod.IVA / 100))
    }));
  }


}
