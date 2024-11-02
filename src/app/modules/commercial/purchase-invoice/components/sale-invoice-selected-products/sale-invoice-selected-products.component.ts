import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../../product-managment/models/Product';
import { ProductService } from '../../../product-managment/services/product.service';

interface SelectableProduct extends Product {
  selected?: boolean; // Propiedad para indicar si el producto está seleccionado
}

@Component({
  selector: 'app-sale-invoice-selected-products',
  templateUrl: './sale-invoice-selected-products.component.html',
  styleUrls: ['./sale-invoice-selected-products.component.css']
})
export class SaleInvoiceSelectedProductsComponent {
  inputData: any;
  filterProductS: string = '';
  products: SelectableProduct[] = []; // Array for all products
  selectedProducts: SelectableProduct[] = []; // Array for selected products
  productsInvoice: Product[] = [];
  columnsProducts: any[] = [
    { title: 'Codigo', data: 'code' },
    { title: 'Nombres', data: 'itemType' },
    { title: 'Descripción', data: 'description' },
    { title: 'Precio', data: 'price' },
    { title: 'Seleccionar' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<SaleInvoiceSelectedProductsComponent>,
    private productService: ProductService,
    private cdr: ChangeDetectorRef // Inyección de ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.inputData = this.data;
    this.productsInvoice = this.data.products || [];
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts(this.inputData.entId).subscribe(
      (data: Product[]) => {
        this.products = data.map((product) => ({
          ...product,
          selected: false // Marca todos los productos como no seleccionados inicialmente
        }));

        
        this.products.forEach((product) => {
          const index = this.productsInvoice.findIndex(p => p.id === product.id);
          if (index !== -1) {
            product.selected = true;
            this.selectedProducts.push(product);
          }
        });

        this.cdr.detectChanges(); // Forzar la detección de cambios
      },
      (error) => {
        console.log('Error al obtener los productos:', error);
      }
    );
  }

  toggleSelection(product: SelectableProduct) {
    const index = this.selectedProducts.findIndex(p => p.id === product.id);
    if (index === -1) {
      product.selected = true;
      this.selectedProducts.push(product);
    } else {
      product.selected = false;
      this.selectedProducts.splice(index, 1);
    }
    this.cdr.detectChanges(); // Forzar la detección de cambios
  }

  confirmSelection() {
    this.ref.close(this.selectedProducts);
  }

  closePopUp() {
    if (this.data.entId) {
      this.ref.close();
    }
  }
}
