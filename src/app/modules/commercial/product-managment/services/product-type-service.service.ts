import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ProductType } from '../models/ProductType';


@Injectable({
  providedIn: 'root'
})
export class ProductTypeService {

  private readonly apiUrl = `${environment.API_PRODUCTS_URL}product-types`; // Cambia esta URL según tu configuración

  constructor(private http: HttpClient) { }

  // GET: Obtener todos los tipos de producto
  getAllProductTypes(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(this.apiUrl);
  }

  // GET: Obtener todos los tipos de producto
  getAllProductTypesEnterprise(enterpriseId: string): Observable<ProductType[]> {
    const url = `${this.apiUrl}/enterprise/${enterpriseId}`;
    return this.http.get<ProductType[]>(url);
  }

  // GET: Obtener un tipo de producto por ID
  getProductTypeById(id: string): Observable<ProductType> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<ProductType>(url);
  }

  // POST: Crear un nuevo tipo de producto
  createProductType(productType: ProductType): Observable<ProductType> {
    return this.http.post<ProductType>(this.apiUrl, productType);
  }

  // PUT: Actualizar un tipo de producto existente por ID
  updateProductType(id: string, productType: ProductType): Observable<ProductType> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<ProductType>(url, productType);
  }

  // DELETE: Eliminar un tipo de producto por ID
  deleteProductType(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
