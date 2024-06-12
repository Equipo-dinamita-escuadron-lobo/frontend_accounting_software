import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Product } from '../../../product-managment/models/Product';
import { ProductService } from '../../../product-managment/services/product.service';

@Component({
  selector: 'app-invoice-select-products',
  templateUrl: './invoice-select-products.component.html',
  styleUrl: './invoice-select-products.component.css'
})
export class InvoiceSelectProductsComponent {
  inputData: any;

  filterProductS: string = '';
  products: Product[] = []; //Array for all products
  selectedProducts: Product[] = []; //Array for selec products

  columnsProducts: any[] = [
    { title: 'Codigo', data: 'code' },
    { title: 'Nombres', data: 'itemType' },
    { title: 'Descripción', data: 'description' },
    { title: 'Precio', data: 'price' },
    { title: 'Proveedor', data: 'supplier' },
    { title: 'Seleccionar' }
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<InvoiceSelectProductsComponent>, private productService: ProductService,) { }

  ngOnInit() {
    this.inputData = this.data;
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts(this.inputData.entId).subscribe(
      (data: Product[]) => {
        this.products = data;
      },
      (error) => {
        console.log('Error al obtener los productos:', error);
      }
    );
  }

  toggleSelection(product: Product) {
    const index = this.selectedProducts.findIndex(p => p.code === product.code);
    if (index === -1) {
      this.selectedProducts.push(product);
    } else {
      this.selectedProducts.splice(index, 1);
    }
    console.log(this.selectedProducts)
  }

  formatPrice(price: number): string {
    return price.toLocaleString('es-ES');
  }

  confirmSelection() {
    this.ref.close(this.selectedProducts);
  }

  closePopUp() {
    this.ref.close();
  }
}
