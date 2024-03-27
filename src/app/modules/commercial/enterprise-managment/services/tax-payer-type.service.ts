import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaxPayerType } from '../models/TaxPayerType';

@Injectable({
  providedIn: 'root',
})
export class TaxPayerTypeService {

  taxpayerTypes: TaxPayerType[] = [
    { id: 1, name: 'Persona Natural' },
    { id: 2, name: 'Persona Jurídica' },
    { id: 3, name: 'Gran Contribuyente' },
    // Puedes añadir más tipos de contribuyentes según sea necesario
  ];

  private apiUrl = '';

  constructor(private http: HttpClient) {}

  /*
  // Method to get all tax payer types
  getTaxPayerTypes(): Observable<TaxPayerType[]> {
    return this.http.get<TaxPayerType[]>(this.apiUrl);
  }*/


  getTaxPayerTypes(){
    return this.taxpayerTypes;
  }
}
