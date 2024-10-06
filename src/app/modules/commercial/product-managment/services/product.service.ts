import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Product } from '../models/Product';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  //constructor(private http: HttpClient) { };
  private http = inject(HttpClient);
  constructor() { }
  // Método para obtener todos los productos
  getProducts(enterpriseId:string): Observable<Product[]> {
    const url = `${environment.API_PRODUCTS_URL}products/findAll/${enterpriseId}`;
    return this.http.get<Product[]>(url);
  }
  
  // Método para crear un nuevo producto
  createProduct(product: Product): Observable<Product> {
    const url = `${environment.API_PRODUCTS_URL}products/create`;
    return this.http.post<Product>(url, product);
  }

   // Método para actualizar un producto existente
   updateProduct(product: Product): Observable<Product> {
    const id = product.id; // Obtenemos el ID del producto
    const url = `${environment.API_PRODUCTS_URL}products/update/${id}`; // Suponiendo que el backend espera el ID del producto en la URL
    console.log(product);
    return this.http.put<Product>(url, product); // Usamos el método PUT para actualizar el producto

  }
  // Método para obtener un producto por su ID
  getProductById(id: string): Observable<Product> {
    const url = `${environment.API_PRODUCTS_URL}products/findById/${id}`;
    return this.http.get<Product>(url);
  }

  // Método para eliminar un producto
  deleteProduct(id: string): Observable<Product> {
    const url = `${environment.API_PRODUCTS_URL}products/delete/${id}`;
    return this.http.delete<Product>(url);
  }
}
