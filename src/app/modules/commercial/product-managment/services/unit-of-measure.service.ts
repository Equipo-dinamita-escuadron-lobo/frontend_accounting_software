import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UnitOfMeasure } from '../models/UnitOfMeasure';

@Injectable({
  providedIn: 'root'
})
export class UnitOfMeasureService {
  private apiUrl = ''; //la URL de tu API 

  constructor(private http: HttpClient) { }

  // Método para obtener todas las unidades de medida
  getUnitOfMeasures(): Observable<UnitOfMeasure[]> {
    return this.http.get<UnitOfMeasure[]>(this.apiUrl);
  }

  // Método para crear una nueva unidad de medida
  createUnitOfMeasure(unitOfMeasure: UnitOfMeasure): Observable<UnitOfMeasure> {
    return this.http.post<UnitOfMeasure>(this.apiUrl, unitOfMeasure);
  }
}
