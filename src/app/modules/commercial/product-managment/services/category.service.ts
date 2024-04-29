import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Category } from '../models/Category'; 
import { environment } from '../../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = ''; // URL de tu API de categorías

  constructor(private http: HttpClient) { }
  private categories: Category[] = [
    {
      id: 1, name: 'Category 1', description: 'Description 1',
      inventory: 'cuenta de inventario',
      cost: 'cuenta de costo',
      sale: 'cuenta de venta',
      return: 'cuenta de devolución'
    },
    { id: 2, name: 'Category 2', description: 'Description 2',inventory: 'cuenta de inventario',
    cost: 'cuenta de costo',
    sale: 'cuenta de venta',
    return: 'cuenta de devolución' },
    { id: 3, name: 'Category 3', description: 'Description 3',inventory: 'cuenta de inventario',
    cost: 'cuenta de costo',
    sale: 'cuenta de venta',
    return: 'cuenta de devolución' },
    { id: 4, name: 'Category 4', description: 'Description 4',inventory: 'cuenta de inventario',
    cost: 'cuenta de costo',
    sale: 'cuenta de venta',
    return: 'cuenta de devolución' },
    { id: 5, name: 'Category 5', description: 'Description 5',inventory: 'cuenta de inventario',
    cost: 'cuenta de costo',
    sale: 'cuenta de venta',
    return: 'cuenta de devolución'}
  ];

  // Método para obtener todas las categorías
  getCategories(): Observable<Category[]> {
    //return this.http.get<Category[]>(this.apiUrl);
    return of(this.categories);
  }
  // Método para obtener todas las categorías
  getCategoryById(id: string): Observable<Category> {
    //return of(this.categories.find(category => category.id === Number(id)));
    const url = `${environment.API_URL}products/findById/${id}`;
    return this.http.get<Category>(url);
  }
  // Método para crear una nueva categoría
  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  // Método para actualizar una categoría existente
  updateCategory(id: string, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }


}
