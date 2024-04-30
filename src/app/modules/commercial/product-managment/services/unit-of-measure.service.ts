import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { UnitOfMeasure } from '../models/UnitOfMeasure';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnitOfMeasureService {
  //private apiUrl = ''; //la URL de tu API 

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

  // GET
  // Método para obtener todas las unidades de medida
  getUnitOfMeasures(): Observable<UnitOfMeasure[]> {
    const url = `${environment.API_URL}unit-measures/findAll`;
    return this.http.get<UnitOfMeasure[]>(url);
  }
  // Método para obtener por Id las unidades de medida
  getUnitOfMeasuresId(id: string): Observable<UnitOfMeasure> {
    const url = `${environment.API_URL}unit-measures/findById/${id}`;
    return this.http.get<UnitOfMeasure>(url);
  }

  // PUT  
  // Método para actualizar una Unidad de medida existente por ID
  updateUnitOfMeasureId(id: string, unitOfMeasure: UnitOfMeasure): Observable<UnitOfMeasure> {    
    const url = `${environment.API_URL}unit-measures/update/${id}`;
    return this.http.put<UnitOfMeasure>(url, unitOfMeasure);
  }
  // Método para actualizar una Unidad de medida existente por ID
  updateUnitOfMeasure(): Observable<UnitOfMeasure> {    
    const url = `${environment.API_URL}unit-measures/findAll`;
    return this.http.put<UnitOfMeasure>(url, this.unitOfMeasures);
  }
  // Método para actualizar una Unidad de medida existente por ID
  updateUnitOfMeasureActivate(): Observable<UnitOfMeasure> {    
    const url = `${environment.API_URL}unit-measures/findActivate`;
    return this.http.put<UnitOfMeasure>(url , this.unitOfMeasures);
  }

  // POST
  // Método para crear una nueva unidad de medida
  createUnitOfMeasure(unitOfMeasure: UnitOfMeasure): Observable<UnitOfMeasure> {
    const url = `${environment.API_URL}unit-measures/create`;
    return this.http.post<UnitOfMeasure>(url, unitOfMeasure);
  }

  // DELETE
  // Método para Eliminar una Unidad de medida existente por ID
  deleteUnitOfMeasureId(id: string): Observable<UnitOfMeasure> {
    const url = `${environment.API_URL}unit-measures/delete/${id}`;
    return this.http.delete<UnitOfMeasure>(url );
  }
  // Método para Eliminar todas las Unidades de medida existentes
  deleteUnitOfMeasure(): Observable<UnitOfMeasure> {
    const url = `${environment.API_URL}unit-measures/deleteAll`;
    return this.http.delete<UnitOfMeasure>(url );
  }
}
