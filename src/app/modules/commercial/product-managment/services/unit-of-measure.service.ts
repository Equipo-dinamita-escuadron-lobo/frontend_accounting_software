import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { UnitOfMeasure } from '../models/UnitOfMeasure';

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
  // Método para obtener todas las unidades de medida
  getUnitOfMeasures(): Observable<UnitOfMeasure[]> {
    //return this.http.get<UnitOfMeasure[]>(this.apiUrl);
return of (this.unitOfMeasures);
  }

  // Método para crear una nueva unidad de medida
  createUnitOfMeasure(unitOfMeasure: UnitOfMeasure): Observable<UnitOfMeasure> {
    return this.http.post<UnitOfMeasure>(this.apiUrl, unitOfMeasure);
  }
}
