import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaxPayerType } from '../models/TaxPayerType';

@Injectable({
  providedIn: 'root',
})
export class TaxPayerTypeService {
  private taxpayerTypes: TaxPayerType[] = [
    { id: 1, name: 'Responsable de IVA' },
    { id: 2, name: 'No Responsable de IVA' },
    { id: 3, name: 'Régimen Simple de Tributación' },
    { id: 4, name: 'Entidad Sin Ánimo de Lucro' },
  ];

  private apiUrl = '';

  constructor(private http: HttpClient) {}

  /**
   * @description method to get all tax payer types
   * @returns all tax payer types from the backend
   */

  /*
  getTaxPayerTypes(): Observable<TaxPayerType[]> {
    return this.http.get<TaxPayerType[]>(this.apiUrl);
  }*/

  
  getTaxPayerTypes(){
    return this.taxpayerTypes;
  }
}
