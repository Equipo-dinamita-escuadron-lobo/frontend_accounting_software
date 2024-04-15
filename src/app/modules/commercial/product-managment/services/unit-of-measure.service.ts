import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { UnitOfMeasure } from '../models/UnitOfMeasure';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnitOfMeasureService {
  private apiUrl = ''; //la URL de tu API 

  constructor(private http: HttpClient) { }

  private unitOfMeasures: UnitOfMeasure[] = [
    {
      id: 1,
      name: 'Kilogramo',
      abbreviation: 'kg',
      description: 'Unidad de medida de masa'
    },
    {
      id: 2,
      name: 'Litro',
      abbreviation: 'lt',
      description: 'Unidad de medida de volumen'
    },
    {
      id: 3,
      name: 'Metro',
      abbreviation: 'm',
      description: 'Unidad de medida de longitud'
    },
    {
      id: 4,
      name: 'Segundo',
      abbreviation: 's',
      description: 'Unidad de medida de tiempo'
    },
    {
      id: 5,
      name: 'Kelvin',
      abbreviation: 'K',
      description: 'Unidad de medida de temperatura'
    }
    
    
  ];

  getUnitOfMeasures(): Observable<UnitOfMeasure[]> {
    //return this.http.get<Category[]>(this.apiUrl);
    return of(this.unitOfMeasures);
  }
  // Método para obtener todas las unidades de medida
  getUnitOfMeasuresId(id: string): Observable<UnitOfMeasure> {
    const url = `${environment.API_URL}products/findById/${id}`;
    return this.http.get<UnitOfMeasure>(url);
  }

  // Método para crear una nueva unidad de medida
  createUnitOfMeasure(unitOfMeasure: UnitOfMeasure): Observable<UnitOfMeasure> {
    return this.http.post<UnitOfMeasure>(this.apiUrl, unitOfMeasure);
  }

  // Método para actualizar una Unidad de medida existente
  updateUnitOfMeasure(id: string, unitOfMeasure: UnitOfMeasure): Observable<UnitOfMeasure> {
    return this.http.put<UnitOfMeasure>(`${this.apiUrl}/${id}`, unitOfMeasure);
  }
}
