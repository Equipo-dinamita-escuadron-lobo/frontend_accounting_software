import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../../product-managment/models/Product';
import { ProductService } from '../../../product-managment/services/product.service';

/**
 * Componente para seleccionar productos
 */
@Component({
  selector: 'app-invoice-select-products',
  templateUrl: './invoice-select-products.component.html',
  styleUrl: './invoice-select-products.component.css'
})
export class InvoiceSelectProductsComponent {
  /**
   * Variables del componente
   */
  inputData: any; // Variable para almacenar los datos de entrada

  filterProductS: string = '';  // Variable para almacenar el filtro de productos
  products: Product[] = [];   // Variable para almacenar los productos
  selectedProducts: Product[] = []; // Variable para almacenar los productos seleccionados

  columnsProducts: any[] = [
    { title: 'Codigo', data: 'code' },
    { title: 'Nombres', data: 'itemType' },
    { title: 'Descripción', data: 'description' },
    { title: 'Costo', data: 'cost' },
    { title: 'Seleccionar' }
  ];

  /**
   * Constructor del componente
   * @param data 
   * @param ref 
   * @param productService
   * @param dialogRef
   */
  constructor(@Inject(MAT_DIALOG_DATA) 
    public data: any,
    private ref: MatDialogRef<InvoiceSelectProductsComponent>, 
    private productService: ProductService,) { }

  /**
   * Método para inicializar el componente
   */
  ngOnInit() {
    this.inputData = this.data;
    this.getProducts();
  }

  /**
   * Método para obtener los productos
   */
  getProducts(): void {
    this.productService.getProducts(this.inputData.entId).subscribe(
      (data: Product[]) => {
        console.log('recibe el id de producto num:', this.inputData.entId);
        this.products = data.filter(product => product.enterpriseId === this.inputData.entId);
      },
      (error) => {
        console.log('Error al obtener los productos:', error);
      }
    );
  }

  /**
   * Método para seleccionar un producto
   * @param product 
   */
  toggleSelection(product: Product) {
    const index = this.selectedProducts.findIndex(p => p.id === product.id);
    if (index === -1) {
      this.selectedProducts.push(product);
    } else {
      this.selectedProducts.splice(index, 1);
    }
  }

  /**
   * Método para dar formato al precio
   * @param cost 
   * @returns 
   */
  formatPrice(cost: number): string {
    return cost.toLocaleString('es-ES');
  }

  /**
   * Método para confirmar la selección
   */
  confirmSelection() {
    this.ref.close(this.selectedProducts);
  }

  /**
   * Método para cerrar el popup
   */
  closePopUp() {
    this.ref.close();
  }
}