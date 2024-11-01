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
  products: SelectableProduct[] = []; // Array para todos los productos
  selectedProducts: Product[] = []; // Array para los productos seleccionados

  columnsProducts: any[] = [
    { title: 'Código', data: 'code' },
    { title: 'Nombres', data: 'itemType' },
    { title: 'Descripción', data: 'description' },
    { title: 'Precio', data: 'price' },
    { title: 'Seleccionar' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<SaleInvoiceSelectedProductsComponent>,
    private productService: ProductService,
    private cdRef: ChangeDetectorRef // Detecta cambios en la vista
  ) {}

  ngOnInit() {
    this.inputData = this.data;
    this.selectedProducts = this.data.lstProducts ? [...this.data.lstProducts] : [];
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts(this.inputData.entId).subscribe(
      (data: Product[]) => {
        this.products = data.map(product => ({
          ...product,
          selected: this.isProductSelected(product) // Marcar productos seleccionados
        }));

        // Forzar la detección de cambios después de la carga
        this.cdRef.detectChanges();
      },
      (error) => {
        console.log('Error al obtener los productos:', error);
      }
    );
  }

  isProductSelected(product: Product): boolean {
    return this.selectedProducts.some(selected => selected.id === product.id);
  }

  toggleSelection(product: SelectableProduct) {
    const index = this.selectedProducts.findIndex(p => p.id === product.id);
    if (index === -1) {
      this.selectedProducts.push(product);
    } else {
      this.selectedProducts.splice(index, 1);
    }
    product.selected = !product.selected;
  }

  confirmSelection() {
    this.ref.close(this.selectedProducts);
  }

  closePopUp() {
    if (this.data.entId) {
      this.ref.close("close");
    }
  }
}
