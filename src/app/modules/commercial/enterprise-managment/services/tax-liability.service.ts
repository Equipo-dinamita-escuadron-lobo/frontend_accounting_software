import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaxLiability } from '../models/TaxLiability';

@Injectable({
  providedIn: 'root'
})
export class TaxLiabilityService {
  private apiUrl = ''; 

  /**
   * PRUEBAS
   *  */ 
  private taxLiabilities: TaxLiability[] = [
    { id: 1, name: 'Información Exógena' },
    { id: 2, name: 'Facturador Electrónico' },
    { id: 3, name: 'Informante de Beneficiarios Finales' },
    { id: 4, name: 'Retención en la Fuente a Título de Renta' },
    { id: 5, name: 'Retención en la Fuente a Título de IVA' },
    { id: 6, name: 'Autorretenedor' },
    { id: 7, name: 'Gran Contribuyente' }
];

  /*
  getTaxLiabilities(){
    return this.taxLiabilities;
  }*/

  constructor(private http: HttpClient) { }

  /**
   * @description method to get all tax liabilities
   * @returns all tax payer types from the backend
   */

  
  getTaxLiabilitiesBackend(): Observable<TaxLiability[]> {
    return this.http.get<TaxLiability[]>(this.apiUrl);
  }

  getTaxLiabilities(){
    return this.taxLiabilities;
  }

}