import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Category } from '../models/Category';

//interface temporal para simular la respuesta de la API
interface Cuenta {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private cuentas: Cuenta[] = [
    {
      id: 1,
      name: 'Cuentas por cobrar',
      description: 'Cuentas por cobrar a clientes'
    },
    {
      id: 2,
      name: 'Cuentas por pagar',
      description: 'Cuentas por pagar a proveedores'
    },
    {
      id: 3,
      name: 'Caja',
      description: 'Caja chica'
    },
    {
      id: 4,
      name: 'Bancos',
      description: 'Cuentas bancarias'
    },
    {
      id: 5,
      name: 'Inventario',
      description: 'Inventario de productos'
    }
  ];

  /**
   * Constructor del servicio
   * @param http 
   */
constructor(private http: HttpClient) { }

  /**
   * Método para obtener todas las cuentas de la empresa actual
   * @returns Observable<Cuenta[]>
   * @example getCuentas()
   */
  getCuentas(): Observable<Cuenta[]> {
    return of(this.cuentas);
  }

  /**
   * Método para obtener una cuenta por su ID
   * @param id 
   * @returns Observable<Cuenta>
   * @example getCuentaById(1)
   */
  getCuentaById(id: number): Observable<Cuenta> {

    const cuenta: Cuenta = {
      id: 0,
      name: '',
      description: ''
    };
    this.cuentas.find(cuenta => cuenta.id === id);

    return of(cuenta);
  }

 /**
  * Método para obtener todas las categorías de la empresa actual
  * @param enterpriseId 
  * @returns  Observable<Category[]>
  * @example getCategories('1')
  */
  getCategories(enterpriseId:string): Observable<Category[]> {
    const url = `${environment.API_PRODUCTS_URL}categories/findAll/${enterpriseId}`;
    return this.http.get<Category[]>(url);
  }

  /**
   * Método para obtener una categoría por su ID
   * @param id 
   * @returns Observable<Category>
   * @example getCategoryById(1)
   */
  getCategoryById(id: string): Observable<Category> {
    const url = `${environment.API_PRODUCTS_URL}categories/findById/${id}`;
    return this.http.get<Category>(url);
  }

  /**
   * Método para crear una nueva categoría
   * @param category 
   * @returns Observable<Category>
   * @example createCategory({name: 'Category 1', description: 'Category 1 description'})
   */
  createCategory(category: Category): Observable<Category> {
    console.log(category);
    const url = `${environment.API_PRODUCTS_URL}categories/create`;
    return this.http.post<Category>(url, category);
  }

  /**
   * Método para actualizar una categoría
   * @param category 
   * @returns Observable<Category>
   * @example updateCategory({id: 1, name: 'Category 1', description: 'Category 1 description'})
   */
  updateCategory(category: Category): Observable<Category> {
    const url = `${environment.API_PRODUCTS_URL}categories/update/${category.id}`;
    return this.http.put<Category>(url, category);
  }

  /**
   * Método para eliminar una categoría
   * @param id 
   * @returns Observable<Category>
   * @example deleteCategory(1)
   */
  deleteCategory(id: string): Observable<Category> {
    const url = `${environment.API_PRODUCTS_URL}categories/delete/${id}`;
    return this.http.delete<Category>(url);
  }
}
