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
  taxResponsibilities: string[] = [
    'información exogena',
    'facturador electronico',
    'informante de beneficiarios finales',
    'retención en la fuente a titulo de renta',
    'retención en la fuente a titulo de iva',
    'autorretenedor',
    'gran contribuyente'
  ];

  getResponsibilitiesTest(){
    return this.taxResponsibilities;
  }



  constructor(private http: HttpClient) { }

  // Method to get all the Tax Liabilities
  getTaxLiabilities(): Observable<TaxLiability[]> {
    return this.http.get<TaxLiability[]>(this.apiUrl);
  }

}