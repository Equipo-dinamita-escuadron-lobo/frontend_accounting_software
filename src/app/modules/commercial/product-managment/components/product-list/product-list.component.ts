import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service'; // Importa el servicio ProductService
import { Product } from '../../models/Product'; // Importa el modelo Product
import { Router } from '@angular/router'; // Importa Router desde '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = []; // Inicializa la lista de productos
  columns: any[] = [
    //{title: 'Id', data: 'id'},
    {title:'Codigo',data:'code'},
    {title:'Nombres',data:'itemType'},
    {title:'Descripción',data:'description'},
    {title:'Precio',data:'price'},
    {title:'Min',data:'minQuantity'},
   // {title:'max',data:'maxQuantity'},
    //{title:'tax',data:'taxPercentage'},
    //{title:'f creación',data:'creationDate'},
    {title:'Unidad',data:'unitOfMeasure'},
    {title:'Prov',data:'supplier'},
    {title:'Cat',data:'category'},
  ];

  form: FormGroup;

  constructor(private productService: ProductService,  private router: Router, private fb: FormBuilder ) {
    this.form = this.fb.group(this.validationsAll());
   } // Inyecta el servicio ProductService en el constructor

validationsAll(){
  return {
    stringSearch: ['']
  };
}

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

  redirectToEdit(productId: string): void {
  console.log('ID del producto seleccionado:', productId);
  this.router.navigate(['/product-edit', productId]);
}
}

