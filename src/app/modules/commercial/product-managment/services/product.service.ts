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
    const url = `${environment.API_URL}products/findAllProducts`;
    return this.http.get<Product[]>(url);
  }
  // Método para crear un nuevo producto
  createProduct(product: Product): Observable<Product> {
    const url = `${environment.API_URL}products/createProduct`;
    return this.http.post<Product>(url, product);
  }

}
