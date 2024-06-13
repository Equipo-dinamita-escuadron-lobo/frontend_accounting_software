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
  supplierS?: Third;
  lstThirds: Third[] = [];
  lstThirdsSecurity: Third[] = [];

  // Variables for products
  showSectionProducts: boolean = true;
  showInfoProducts: boolean = false;
  lstProducts: ProductI[] = [];
  lstProductsSecurity: ProductI[] = [];

  columnsProducts: any[] = [
    { title: 'Nombres', data: 'itemType' },
    { title: 'Descripción', data: 'description' },
    { title: 'Precio Unitario', data: 'price' },
    { title: 'Cantidad' },
    { title: 'IVA' },
    { title: 'Valor Total' },
  ];

  // Variables for purchase invoice
  subTotal: number = 0;
  taxTotal: number = 0;
  total: number = 0;

    // Variables for date and payment method
  currentDate: Date = new Date();
  dueDate?: string;
  paymentMethod: string = 'debito';

  constructor(private enterpriseService: EnterpriseService,
              private dialog: MatDialog,
              private thirdService: ThirdServiceService) { }

  ngOnInit() {
    this.getEnterpriseSelectedInfo();
  }

  getEnterpriseSelectedInfo() {
    const id = this.enterpriseService.getSelectedEnterprise();
    console.log("id " + id);
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
          console.log(this.supplierS.email);
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
    this.showInfoThird = !this.showInfoThird;
  }

  showSectionThridM() {
    this.showSectionThrid = !this.showSectionThrid;
  }

  // Método para mostrar ventana emergente de productos
  selectProducts() {
    this.OpenListProducts('Seleccion de Productos', this.enterpriseSelected?.id, this.supplierS?.idNumber, InvoiceSelectProductsComponent);
  }

  createProduct() {
    this.showSectionProducts = !this.showSectionProducts;
  }

  showSectionProductsM() {
    this.showSectionProducts = !this.showSectionProducts;
  }

  formatPrice(price: number): string {
    return price.toLocaleString('es-ES');
    //return price.toLocaleString('es-ES', { style: 'currency', currency: 'COP' });
  }

  // Paara calcular total de cada producto
  calculateTotal(prod: ProductI): void {
    prod.totalValue = this.calculateTotalValue(prod); //Llamado para cada producto
    this.calculateInvoiceTotals(); //Llama para que se vaya actualizando los labels de abajo
  }

  // para calcular valor total del producto incluyendo IVA
  calculateTotalValue(prod: ProductI): number {
    const subtotalProduct = prod.amount * prod.price;
    const ivaAmountProduct = (subtotalProduct * prod.IVA) / 100;
    return subtotalProduct + ivaAmountProduct;
  }

  //para calcular los datos como impuesto, subtotal y total de la factura
  calculateInvoiceTotals(): void {
    this.subTotal = this.lstProducts.reduce((acc, prod) => acc + (prod.price * prod.amount), 0);
    this.taxTotal = this.lstProducts.reduce((acc, prod) => acc + ((prod.price * prod.amount) * prod.IVA / 100), 0);
    this.total = this.subTotal + this.taxTotal;
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
        this.getSupplier(result);
      } else {
        this.showInfoThird = false;
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
          prod.IVA = prod.taxPercentage; // Set default IVA to taxPercentage
          prod.amount = 1;
          prod.totalValue = 0;
        });
        this.showInfoProducts = true;
        this.calculateInvoiceTotals(); // Calcular los totales iniciales
      } else {
        console.log('No selecciono ningun producto');
        this.showInfoProducts = false;
      }
    });
  }
}
