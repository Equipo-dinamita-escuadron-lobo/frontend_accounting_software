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

  /**
   * Método para obtener todos los tipos de producto
   * @returns Observable<ProductType[]>
   * @example getAllProductTypes()
   */
  getAllProductTypes(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(this.apiUrl);
  }

  /**
   * Método para obtener todos los tipos de producto de una empresa
   * @param enterpriseId 
   * @returns Observable<ProductType[]>
   * @example getAllProductTypesEnterprise('1')
   */
  getAllProductTypesEnterprise(enterpriseId: string): Observable<ProductType[]> {
    const url = `${this.apiUrl}/enterprise/${enterpriseId}`;
    return this.http.get<ProductType[]>(url);
  }

  /**
   * Método para obtener un tipo de producto por ID
   * @param id 
   * @returns Observable<ProductType>
   * @example getProductTypeById('1')
   */
  getProductTypeById(id: string): Observable<ProductType> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<ProductType>(url);
  }

  /**
   * Método para crear un nuevo tipo de producto
   * @param productType 
   * @returns Observable<ProductType>
   * @example createProductType({name: 'ProductType 1', description: 'ProductType 1 description'})
   */
  createProductType(productType: ProductType): Observable<ProductType> {
    return this.http.post<ProductType>(this.apiUrl, productType);
  }

  /**
   * Método para actualizar un tipo de producto
   * @param id 
   * @param productType 
   * @returns Observable<ProductType>
   * @example updateProductType('1', {name: 'ProductType 1', description: 'ProductType 1 description'})
   */
  updateProductType(id: string, productType: ProductType): Observable<ProductType> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<ProductType>(url, productType);
  }

  /**
   * Método para eliminar un tipo de producto
   * @param id 
   * @returns Observable<void>
   * @example deleteProductType('1')
   */
  deleteProductType(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
