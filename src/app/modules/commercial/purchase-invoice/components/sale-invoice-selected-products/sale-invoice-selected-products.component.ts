import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product } from '../../../product-managment/models/Product';
import { ProductService } from '../../../product-managment/services/product.service';

@Component({
  selector: 'app-sale-invoice-selected-products',
  templateUrl: './sale-invoice-selected-products.component.html',
  styleUrl: './sale-invoice-selected-products.component.css'
})




export class SaleInvoiceSelectedProductsComponent {
  inputData: any;

  filterProductS: string = '';
  products: Product[] = []; //Array for all products
  selectedProducts: Product[] = []; //Array for selec products

  columnsProducts: any[] = [
    { title: 'Codigo', data: 'code' },
    { title: 'Nombres', data: 'itemType' },
    { title: 'Descripción', data: 'description' },
    { title: 'Precio', data: 'price' },
    { title: 'Seleccionar' }
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private ref: MatDialogRef<SaleInvoiceSelectedProductsComponent>, private productService: ProductService,) { }

  ngOnInit() {
    this.inputData = this.data;
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts(this.inputData.entId).subscribe(
      (data: Product[]) => {
        console.log('recibe el id de producto num:', this.inputData.thId)
        console.log(data)
        this.products = data;
      },
      (error) => {
        console.log('Error al obtener los productos:', error);
      }
    );
  }

  toggleSelection(product: Product) {
    const index = this.selectedProducts.findIndex(p => p.id === product.id);
    if (index === -1) {
      this.selectedProducts.push(product);
    } else {
      this.selectedProducts.splice(index, 1);
    }
  }

 /* formatPrice(price: number): string {
    return price.toString();
  }*/

  confirmSelection() {
    this.ref.close(this.selectedProducts);
  }

  closePopUp() {
    this.ref.close();
  }
}
