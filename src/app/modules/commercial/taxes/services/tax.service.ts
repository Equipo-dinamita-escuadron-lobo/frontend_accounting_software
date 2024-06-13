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

  getTaxes(enterpriseId: string): Observable<Tax[]> {
    const url = `${environment.API_URL}taxes/findAll/${enterpriseId}`;
    return this.http.get<Tax[]>(url);
  }

  createTax(tax: Tax): Observable<Tax> {
    const url = `${environment.API_URL}taxes/create`;
    return this.http.post<Tax>(url, tax);
  }

  updateTax(tax: Tax): Observable<Tax> {
    const id = tax.id;
    const url = `${environment.API_URL}taxes/update/${id}`;
    return this.http.put<Tax>(url, tax);
  }

  getTaxById(id: number): Observable<Tax> {
    const url = `${environment.API_URL}taxes/findById/${id}`;
    return this.http.get<Tax>(url);
  }

  deleteTax(id: number): Observable<Tax> {
    const url = `${environment.API_URL}taxes/delete/${id}`;
    return this.http.delete<Tax>(url);
  }
}
