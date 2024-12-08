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
  
  /**
   * Método para obtener todos los productos de una empresa
   * @param enterpriseId 
   * @returns Observable<Product[]>
   * @example getProducts('1')
   */
  getProducts(enterpriseId:string): Observable<Product[]> {
    const url = `${environment.API_PRODUCTS_URL}products/findAll/${enterpriseId}`;
    return this.http.get<Product[]>(url);
  }
  
  /**
   * Método para crear un producto
   * @param product 
   * @returns Observable<Product>
   * @example createProduct({name: 'Product 1', description: 'Product 1 description'})
   */
  createProduct(product: Product): Observable<Product> {
    const url = `${environment.API_PRODUCTS_URL}products/create`;
    return this.http.post<Product>(url, product);
  }

  /**
   * Método para actualizar un producto
   * @param product
   * @returns Observable<Product>
   * @example updateProduct({name: 'Product 1', description: 'Product 1 description'})
   */
   updateProduct(product: Product): Observable<Product> {
    const id = product.id; // Obtenemos el ID del producto
    const url = `${environment.API_PRODUCTS_URL}products/update/${id}`; // Suponiendo que el backend espera el ID del producto en la URL
    console.log(product);
    return this.http.put<Product>(url, product); // Usamos el método PUT para actualizar el producto

  }
  
  /**
   * Método para obtener un producto por su ID
   * @param id 
   * @returns Observable<Product>
   * @example getProductById(1)
  */
  getProductById(id: string): Observable<Product> {
    const url = `${environment.API_PRODUCTS_URL}products/findById/${id}`;
    return this.http.get<Product>(url);
  }

  /**
   * Método para eliminar un producto
   * @param id 
   * @returns Observable<Product>
   * @example deleteProduct(1)
  */
  deleteProduct(id: string): Observable<Product> {
    const url = `${environment.API_PRODUCTS_URL}products/delete/${id}`;
    return this.http.delete<Product>(url);
  }
}
