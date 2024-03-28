import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/Product';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent {
  searchTerm: string = ''; // Variable para almacenar el término de búsqueda
  searchResults: Product[] = []; // Arreglo para almacenar los resultados de la búsqueda

  constructor(private productService: ProductService) {}

  // Método para realizar la búsqueda de productos
  searchProducts(): void {
    // Verificar si el término de búsqueda está vacío
    if (this.searchTerm.trim() === '') {
      this.searchResults = []; // Si está vacío, vaciar los resultados
      return; // Salir del método
    }

    // Realizar la búsqueda de productos utilizando el servicio ProductService
    this.productService.searchProducts(this.searchTerm).subscribe(
      (data: Product[]) => {
        this.searchResults = data; // Almacenar los resultados de la búsqueda en la variable searchResults
      },
      error => {
        console.log('Error al buscar productos:', error);
      }
    );
  }

  // Método para limpiar los resultados de la búsqueda
  clearResults(): void {
    this.searchResults = []; // Vaciar los resultados
    this.searchTerm = ''; // Limpiar el término de búsqueda
  }
}
