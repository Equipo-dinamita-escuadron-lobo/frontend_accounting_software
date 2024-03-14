import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaxPayerType } from '../models/TaxPrayerType';

@Injectable({
  providedIn: 'root',
})
export class TaxPayerTypeService {
  taxpayerTypes: string[] = [
    'responsable de iva',
    'no responsable de iva',
    'regimen simple de tributación',
    'entidad sin animo de lucro',
  ];

  getTaxPrayerTest(){
    return this.taxpayerTypes;
  }

  private apiUrl = '';

  constructor(private http: HttpClient) {}

  // Method to get all tax payer types
  getTaxPayerTypes(): Observable<TaxPayerType[]> {
    return this.http.get<TaxPayerType[]>(this.apiUrl);
  }
}
