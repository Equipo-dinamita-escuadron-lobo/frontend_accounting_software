import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { UnitOfMeasure } from '../models/UnitOfMeasure';

@Injectable({
  providedIn: 'root'
})
export class UnitOfMeasureService {
  /**
   * Constructor del servicio
   * @param http 
   */
  constructor(private http: HttpClient) { }
  
  /**
   * Método para obtener todas las unidades de medida de una empresa
   * @param enterpriseId 
   * @returns Observable<UnitOfMeasure[]>
   * @example getUnitOfMeasures('1')
   */
  getUnitOfMeasures(enterpriseId: string): Observable<UnitOfMeasure[]> {
    const url = `${environment.API_PRODUCTS_URL}unit-measures/findAll/${enterpriseId}`;
    return this.http.get<UnitOfMeasure[]>(url);
  }
  
  /**
   * Método para obtener una unidad de medida por su ID
   * @param id 
   * @returns Observable<UnitOfMeasure>
   * @example getUnitOfMeasuresId(1)
  */
  getUnitOfMeasuresId(id: string): Observable<UnitOfMeasure> {
    const url = `${environment.API_PRODUCTS_URL}unit-measures/findById/${id}`;
    return this.http.get<UnitOfMeasure>(url);
  }

  /**
   * Método para obtener todas las unidades de medida de una empresa
   * @param id 
   * @param unitOfMeasure 
   * @returns Observable<UnitOfMeasure>
   */
  updateUnitOfMeasureId(id: string, unitOfMeasure: UnitOfMeasure): Observable<UnitOfMeasure> {    
    const url = `${environment.API_PRODUCTS_URL}unit-measures/update/${id}`;
    return this.http.put<UnitOfMeasure>(url, unitOfMeasure);
  }

  /**
   * Método para cambiar el estado de una unidad de medida
   * @param id 
   * @returns Observable<UnitOfMeasure>
   */
  unitOfMeasureChangeState(id:string): Observable<UnitOfMeasure> {    
    const url = `${environment.API_PRODUCTS_URL}unit-measures/changeState/${id}`;
    return this.http.put<UnitOfMeasure>(url,{});
  }

  /**
   * Método para crear una nueva unidad de medida
   * @param unitOfMeasure 
   * @returns Observable<UnitOfMeasure>
   * @example createUnitOfMeasure({name: 'UnitOfMeasure 1', description: 'UnitOfMeasure 1 description
   * @example , abbreviation: 'UOM1'})
   */
  createUnitOfMeasure(unitOfMeasure: UnitOfMeasure): Observable<UnitOfMeasure> {
    const url = `${environment.API_PRODUCTS_URL}unit-measures/create`;
    console.log('unitOfMeasure', unitOfMeasure);
    return this.http.post<UnitOfMeasure>(url, unitOfMeasure);
  }

  /**
   * Método para eliminar una unidad de medida
   * @param id 
   * @returns Observable<UnitOfMeasure>
   * @example deleteUnitOfMeasureId(1)
   */
  deleteUnitOfMeasureId(id: string): Observable<UnitOfMeasure> {
    const url = `${environment.API_PRODUCTS_URL}unit-measures/delete/${id}`;
    return this.http.delete<UnitOfMeasure>(url );
  }
  
  /**
   * Método para eliminar todas las unidades de medida
   * @returns Observable<UnitOfMeasure>
   * @example deleteUnitOfMeasure()
   */
  deleteUnitOfMeasure(): Observable<UnitOfMeasure> {
    const url = `${environment.API_PRODUCTS_URL}unit-measures/deleteAll`;
    return this.http.delete<UnitOfMeasure>(url );
  }
}
