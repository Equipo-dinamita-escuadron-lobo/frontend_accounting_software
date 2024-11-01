import { Component, Inject } from '@angular/core';
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
  selectedProductIds: number[] = []; // Array de IDs de los productos seleccionados

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
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.inputData = this.data;
    // Almacenar IDs de productos ya seleccionados
    this.selectedProductIds = this.data.lstProducts ? this.data.lstProducts.map((product: Product) => product.id) : [];
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts(this.inputData.entId).subscribe(
      (data: Product[]) => {
        // Mapear productos y establecer `selected` si el ID está en `selectedProductIds`
        this.products = data.map(product => ({
          ...product,
          selected: this.selectedProductIds.includes(product.id) // Chequeo de selección basado en IDs
        }));
      },
      (error) => {
        console.log('Error al obtener los productos:', error);
      }
    );
  }

  toggleSelection(product: SelectableProduct) {
    if (product.selected) {
      // Si está seleccionado, remover su ID de `selectedProductIds`
      this.selectedProductIds = this.selectedProductIds.filter(id => id !== product.id);
    } else {
      // Si no está seleccionado, agregar su ID a `selectedProductIds`
      this.selectedProductIds.push(product.id);
    }
    product.selected = !product.selected; // Cambiar visualmente el estado de selección
  }

  confirmSelection() {
    // Filtrar los productos seleccionados basados en `selectedProductIds`
    const selectedProducts = this.products.filter(product => this.selectedProductIds.includes(product.id));
    this.ref.close(selectedProducts);
  }

  closePopUp() {
    if (this.data.entId) {
      this.ref.close("close");
    }
  }
}
