import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/Product';
import { environment } from '../../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  //constructor(private http: HttpClient) { };
  private http = inject(HttpClient);
  constructor() { }
  // Método para obtener todos los productos
  getProducts(): Observable<Product[]> {
    const url = `${environment.API_URL}products/findAll`;
    return this.http.get<Product[]>(url);
  }
  // Método para crear un nuevo producto
  createProduct(product: Product): Observable<Product> {
    const url = `${environment.API_URL}products/create`;
    return this.http.post<Product>(url, product);
  }

   // Método para actualizar un producto existente
   updateProduct(product: Product): Observable<Product> {
    const id = product.id; // Obtenemos el ID del producto
    const url = `${environment.API_URL}products/update/${id}`; // Suponiendo que el backend espera el ID del producto en la URL
    console.log(product);
    return this.http.put<Product>(url, product); // Usamos el método PUT para actualizar el producto

  }
  getProductById(id: string): Observable<Product> {
    const url = `${environment.API_URL}products/findById/${id}`;
    return this.http.get<Product>(url);
  }
}
