import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnterpriseDetails } from '../../../enterprise-managment/models/Enterprise';
import { EnterpriseService } from '../../../enterprise-managment/services/enterprise.service';
import { MatDialog } from '@angular/material/dialog';
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

@Component({
  selector: 'app-invoice-creation',
  templateUrl: './invoice-creation.component.html',
  styleUrls: ['./invoice-creation.component.css']
})
export class InvoiceCreationComponent implements OnInit {
  enterpriseSelected?: EnterpriseDetails;

  // Variables for third parties
  showSectionThrid: boolean = true;
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
  retention: number = 0;
  total: number = 0;

  currentDate: Date = new Date();
  dueDate?: string;
  paymentMethod: string = 'debito';
  lstProductsSend: ProductS[] = [];

  columnsProducts: any[] = [
    { title: 'Nombres', data: 'itemType' },
    { title: 'Descripción', data: 'description' },
    { title: 'Precio Unitario', data: 'price' },
    { title: 'Cantidad' },
    { title: 'IVA' },
    { title: 'Subtotal' },
  ];

  constructor(private enterpriseService: EnterpriseService,
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

  getSupplier(thirdId: any) {
    if (thirdId) {
      this.thirdService.getThirdPartie(thirdId).subscribe({
        next: (response: Third) => {
          this.supplierS = response;
        }
      });
    }
  }

  // Método para ventana emergente de terceros
  selectSupplier() {
    this.OpenListThirds('Seleccion de proveedor', this.enterpriseSelected?.id, InvoiceSelectSupplierComponent);
  }

  // Método para llevar al formulario de crear tercero
  createSupplier() {
    this.router.navigate(['/general/operations/third-parties/create']);
  }

  showSectionThridM() {
    this.showSectionThrid = !this.showSectionThrid;
  }

  // Método para mostrar ventana emergente de productos
  selectProducts() {
    this.OpenListProducts('Seleccion de Productos', this.enterpriseSelected?.id, this.supplierS?.idNumber, InvoiceSelectProductsComponent);
  }

  createProduct() {
    this.router.navigate(['/general/operations/products/create']);
  }

  showSectionProductsM() {
    this.showSectionProducts = !this.showSectionProducts;
  }

  formatPrice(price: number): string {
    return price.toLocaleString('es-ES');
  }

  // Paara calcular total de cada producto
  calculateTotal(prod: ProductI): void {
    prod.totalValue = this.calculateTotalValue(prod); //Llamado para cada producto
    this.calculateInvoiceTotals(); //Llama para que se vaya actualizando los labels de abajo
  }

  // para calcular valor total del producto incluyendo IVA
  calculateTotalValue(prod: ProductI): number {
    const subtotalProduct = prod.amount * prod.price;
    return subtotalProduct;
  }

  //para calcular los datos como impuesto, subtotal y total de la factura
  calculateInvoiceTotals(): void {
    console.log(this.lstProducts)
    this.subTotal = this.lstProducts.reduce((acc, prod) => acc + ((prod.price * prod.amount)), 0);
    this.taxTotal = this.lstProducts.reduce((acc, prod) => acc + ((prod.price * prod.amount) * prod.IVA / 100), 0);
    this.retention = this.subTotal * 0.025;
    this.total = this.subTotal + this.taxTotal - this.retention;
  }

  saveFacture() {
    this.lstProductsSend = this.lstProducts.map(prod => ({
      productId: parseInt(prod.id),
      amount: prod.amount,
      description: prod.description,
      vat: prod.IVA / 100,
      unitPrice: prod.price,
      subtotal: (prod.price * prod.amount * (1 + prod.IVA / 100))
    }));

    const factureS: Facture = {
      entId: this.enterpriseSelected?.id,
      thId: this.supplierS?.thId,
      factCode: "123",
      factureType: "Compra",
      factProducts: this.lstProductsSend,
      factSubtotals: this.subTotal,
      facSalesTax: this.taxTotal,
      facWithholdingSource: this.retention
    };

    this.saveInvoice(factureS);
  }

  async saveInvoice(facture: any) {
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

        Swal.fire({
          title: 'Creación exitosa!',
          text: 'Se ha creado la factura con éxito!',
          icon: 'success',
        });
      },
      (error) => {
        Swal.fire({
          title: 'Error!',
          text: 'Ha ocurrido un error al crear la factura.',
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
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
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

  OpenListProducts(title: any, entId: any, thId: any, component: any) {
    const _popUp = this.dialog.open(component, {
      width: '0%',
      height: 'auto',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '100ms',
      data: {
        title: title,
        entId: entId,
        thId: thId
      }
    });

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
