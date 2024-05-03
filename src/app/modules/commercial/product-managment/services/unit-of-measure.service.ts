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

  // DELETE
  // 1 Método para Eliminar todas las Unidades de medida existentes
  deleteUnitOfMeasure(): Observable<UnitOfMeasure> {
    const url = `${environment.API_URL}unit-measures/deleteAll`;
    return this.http.delete<UnitOfMeasure>(url );
  }
  // 2 Método para Eliminar una Unidad de medida existente por ID
  deleteUnitOfMeasureId(id: string): Observable<UnitOfMeasure> {
    const url = `${environment.API_URL}unit-measures/delete/${id}`;
    return this.http.delete<UnitOfMeasure>(url );
  }

  // GET
  // 1 Método para obtener una Unidad de medida existente por ID
  getUnitOfMeasureId(id: string): Observable<UnitOfMeasure> {
    const url = `${environment.API_URL}unit-measures/findById/${id}`;
    return this.http.get<UnitOfMeasure>(url);
  }
  // 2 Método para obtener todas las Unidades de medida existentes con ID de empresa
  getUnitOfMeasure(enterpriseId:string): Observable<UnitOfMeasure[]> {
    const url = `${environment.API_URL}unit-measures/findAll/${enterpriseId}`;
    return this.http.get<UnitOfMeasure[]>(url);
  }
  // 3 Método para obtener el estado de las Unidades de medida existentes con ID de empresa
  getUnitOfMeasureActivate(enterpriseId:string): Observable<UnitOfMeasure[]> {
    const url = `${environment.API_URL}unit-measures/findActivate/${enterpriseId}`;
    return this.http.get<UnitOfMeasure[]>(url);
  }  

  // POST
  // 1 Método para actualizar una Unidad de medida existente por ID
  // updateUnitOfMeasure(): Observable<UnitOfMeasure> {    
  //   const url = `${environment.API_URL}unit-measures/findAll`;
  //   return this.http.put<UnitOfMeasure>(url, this.unitOfMeasures);
  // }
  // // Método para actualizar una Unidad de medida existente por ID
  // updateUnitOfMeasureActivate(): Observable<UnitOfMeasure> {    
  //   const url = `${environment.API_URL}unit-measures/findActivate`;
  //   return this.http.put<UnitOfMeasure>(url , this.unitOfMeasures);
  // }

  // POST
  // Método para crear una nueva unidad de medida
  createUnitOfMeasure(unitOfMeasure: UnitOfMeasure): Observable<UnitOfMeasure> {
    const url = `${environment.API_URL}unit-measures/create`;
    console.log('unitOfMeasure', unitOfMeasure);
    return this.http.post<UnitOfMeasure>(url, unitOfMeasure);
  }
  
  // PUT  
  // 1 Método para actualizar una Unidad de medida existente por ID
  updateUnitOfMeasureId(id: string, unitOfMeasure: UnitOfMeasure): Observable<UnitOfMeasure> {    
    const url = `${environment.API_URL}unit-measures/update/${id}`;
    return this.http.put<UnitOfMeasure>(url, unitOfMeasure);
  }
  // 2 Método para actualizar el estado de una Unidad de medida existente por ID
  updateUnitOfMeasureActivate(id: string, unitOfMeasure: UnitOfMeasure): Observable<UnitOfMeasure> {  
    const url = `${environment.API_URL}unit-measures/updateActivate/${id}`;
    return this.http.put<UnitOfMeasure>(url, unitOfMeasure);
  }

  
}
