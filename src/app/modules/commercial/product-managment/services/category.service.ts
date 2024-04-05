import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/Category'; 

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = ''; // URL de tu API de categorías

  constructor(private http: HttpClient) { }

  // Método para obtener todas las categorías
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  // Método para crear una nueva categoría
  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }
}
