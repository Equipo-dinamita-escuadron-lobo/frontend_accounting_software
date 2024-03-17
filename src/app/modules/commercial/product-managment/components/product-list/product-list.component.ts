import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service'; // Importa el servicio ProductService
import { Product } from '../../models/Product'; // Importa el modelo Product
import { Router } from '@angular/router'; // Importa Router desde '@angular/router'

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = []; // Inicializa la lista de productos

  constructor(private productService: ProductService,  private router: Router ) { } // Inyecta el servicio ProductService en el constructor

  ngOnInit(): void {
    this.getProducts(); // Llama al método getProducts() al inicializar el componente
  }

  // Método para obtener la lista de productos
  getProducts(): void {
    this.productService.getProducts().subscribe(
      (data: Product[]) => {
        this.products = data; // Asigna los productos obtenidos del servicio a la propiedad products
      },
      error => {
        console.log('Error al obtener los productos:', error);
      }
    );
  }
  // Método para redirigir a una ruta específica
  redirectTo(route: string): void {
    this.router.navigateByUrl(route);
  }
}

