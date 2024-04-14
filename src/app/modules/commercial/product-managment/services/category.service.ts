import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Category } from '../models/Category'; 

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = ''; // URL de tu API de categorías

  constructor(private http: HttpClient) { }
  private categories: Category[] = [
    {
      id: 1, name: 'Category 1', description: 'Description for Category 1',
      inventory: 'cuenta de inventario',
      cost: 'cuenta de costo',
      sale: 'cuenta de venta',
      return: 'cuenta de devolución'
    },
    { id: 2, name: 'Category 2', description: 'Description for Category 2',inventory: 'cuenta de inventario',
    cost: 'cuenta de costo',
    sale: 'cuenta de venta',
    return: 'cuenta de devolución' },
    { id: 3, name: 'Category 3', description: 'Description for Category 3',inventory: 'cuenta de inventario',
    cost: 'cuenta de costo',
    sale: 'cuenta de venta',
    return: 'cuenta de devolución' },
    { id: 4, name: 'Category 4', description: 'Description for Category 4',inventory: 'cuenta de inventario',
    cost: 'cuenta de costo',
    sale: 'cuenta de venta',
    return: 'cuenta de devolución' },
    { id: 5, name: 'Category 5', description: 'Description for Category 5',inventory: 'cuenta de inventario',
    cost: 'cuenta de costo',
    sale: 'cuenta de venta',
    return: 'cuenta de devolución'}
  ];

  // Método para obtener todas las categorías
  getCategories(): Observable<Category[]> {
    //return this.http.get<Category[]>(this.apiUrl);
    return of(this.categories);
  }

  // Método para crear una nueva categoría
  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }
}
