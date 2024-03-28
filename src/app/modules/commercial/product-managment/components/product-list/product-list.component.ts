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
  columns: any[] = [
    //{title: 'Id', data: 'id'},
    {title:'Nombres',data:'itemType'},
   // {title:'Codigo',data:'code'},
    {title:'Descripción',data:'description'},
    {title:'min',data:'minQuantity'},
   // {title:'max',data:'maxQuantity'},
    //{title:'tax',data:'taxPercentage'},
    //{title:'f creación',data:'creationDate'},
    {title:'unidad',data:'unitOfMeasure'},
    {title:'prov',data:'supplier'},
    {title:'cat',data:'category'},
    {title:'precio',data:'price'},
  ];

  constructor(private productService: ProductService,  private router: Router ) { } // Inyecta el servicio ProductService en el constructor

  ngOnInit(): void {
    this.getProducts(); // Llama al método getProducts() al inicializar el componente
  }

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

