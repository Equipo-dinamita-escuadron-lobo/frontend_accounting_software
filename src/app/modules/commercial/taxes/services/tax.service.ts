import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Tax } from '../models/Tax';

@Injectable({
  providedIn: 'root'
})
export class TaxService {

  constructor(private http: HttpClient) { }

  // getTaxes(enterpriseId: string): Observable<Tax[]> {
  //   const url = `${environment.API_URL}taxes/findAll/${enterpriseId}`;
  //   return this.http.get<Tax[]>(url);
  // }
taxes: Tax[] = [
    {
      id: 1,
      code: '001',
      description: 'Impuesto de Venta',
      interest: 0.13,
      depositAccountId: 1,
      refundAccountId: 1
    },
    {
      id: 2,
      code: '002',
      description: 'Impuesto de Servicio',
      interest: 0.15,
      depositAccountId: 2,
      refundAccountId: 2
    },
    {
      id: 3,
      code: '003',
      description: 'Impuesto de Consumo',
      interest: 0.10,
      depositAccountId: 3,
      refundAccountId: 3
    },
    {
      id: 4,
      code: '004',
      description: 'Impuesto de Importación',
      interest: 0.20,
      depositAccountId: 4,
      refundAccountId: 4
    },
    {
      id: 5,
      code: '005',
      description: 'Impuesto de Exportación',
      interest: 0.05,
      depositAccountId: 5,
      refundAccountId: 5
    }
  ];

  getTaxes(enterpriseId: string): Observable<Tax[]> {
    return new Observable((observer) => {
      observer.next(this.taxes);
      observer.complete();
    });
  }
  getTaxById(id: number): Observable<Tax> {
    return new Observable((observer) => {
      const tax = this.taxes.find((tax) => tax.id === id);
      observer.next(tax);
      observer.complete();
    });
  }

  // getTaxes(enterpriseId: string): Observable<Tax[]> {
  //   const url = `${environment.API_URL}tax/taxes/`;
  //   return this.http.get<Tax[]>(url);
  // }

  createTax(tax: Tax): Observable<Tax> {
    const url = `${environment.API_URL}taxes/create`;
    return this.http.post<Tax>(url, tax);
  }

  updateTax(tax: Tax): Observable<Tax> {
    const id = tax.id;
    const url = `${environment.API_URL}taxes/update/${id}`;
    return this.http.put<Tax>(url, tax);
  }

  // getTaxById(id: number): Observable<Tax> {
  //   const url = `${environment.API_URL}taxes/findById/${id}`;
  //   return this.http.get<Tax>(url);
  // }

  deleteTax(id: number): Observable<Tax> {
    const url = `${environment.API_URL}taxes/delete/${id}`;
    return this.http.delete<Tax>(url);
  }
  
  
}
