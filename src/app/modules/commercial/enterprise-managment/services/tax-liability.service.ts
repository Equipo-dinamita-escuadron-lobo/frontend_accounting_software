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
  taxLiabilities: TaxLiability[] = [
    { id: 1, name: 'Impuesto sobre la Renta' },
    { id: 2, name: 'Impuesto al Valor Agregado (IVA)' },
    { id: 3, name: 'Impuesto de Sociedades' },
    // Puedes añadir más tipos de obligaciones fiscales según sea necesario
  ];

  getTaxLiabilities(){
    return this.taxLiabilities;
  }

  constructor(private http: HttpClient) { }

  /**
   * @description method to get all tax liabilities
   * @returns all tax payer types from the backend
   */

  /*
  getTaxLiabilities(): Observable<TaxLiability[]> {
    return this.http.get<TaxLiability[]>(this.apiUrl);
  }*/

}