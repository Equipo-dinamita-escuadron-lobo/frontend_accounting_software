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
  ) { }

  ngOnInit() {
    this.inputData = this.data;
    this.productsInvoice = this.data.products || [];
    this.getProducts();
  }

  /**
   * Obtiene la lista de productos desde el servicio y marca los productos como seleccionados si ya existen en la factura.
   * Luego, realiza una detección de cambios para asegurar que los productos seleccionados se actualicen en la vista.
   */
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

  /**
 * Alterna la selección de un producto. Si el producto no está seleccionado, lo agrega a la lista de productos seleccionados. 
 * Si ya está seleccionado, lo elimina de la lista. Luego, realiza una detección de cambios para asegurar que la vista se actualice.
 * @param product - El producto que se va a seleccionar o deseleccionar.
 */
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

  /**
 * Cierra el cuadro de diálogo y devuelve la lista de productos seleccionados.
 */
  confirmSelection() {
    this.ref.close(this.selectedProducts);
  }

  /**
 * Cierra el cuadro de diálogo si existe un `entId` en los datos proporcionados.
 */
  closePopUp() {
    if (this.data.entId) {
      this.ref.close();
    }
  }
}
