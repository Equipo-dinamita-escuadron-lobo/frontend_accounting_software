import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Tax } from '../models/Tax';


let API_URL = '';

if(environment.microservice == 'enterprise'){
  API_URL = environment.API_ACCOUNT_CATALOGE_URL;
}
else{
  API_URL = environment.API_URL;
}

@Injectable({
  providedIn: 'root'
})
export class TaxService {
  

  constructor(private http: HttpClient) { }

   getTaxes(enterpriseId: string): Observable<Tax[]> {
     const url = `${API_URL}tax/taxes/${enterpriseId}`;
     return this.http.get<Tax[]>(url);
   }

  createTax(tax: Tax): Observable<Tax> {
    const url = `${API_URL}tax/`;
    console.log('tax:', tax);
    return this.http.post<Tax>(url, tax);
  }

  updateTax(tax: Tax): Observable<Tax> {
    const id = tax.id;
    const url = `${API_URL}tax/${id}`;
    return this.http.put<Tax>(url, tax);
  }

  getTaxById(code: string, enterpriseId: string): Observable<Tax> {
    console.log('code:', code);
    console.log('enterpriseId:', enterpriseId);
    const url = `${API_URL}tax/${code}/${enterpriseId}`;
    return this.http.get<Tax>(url);
  }

  deleteTax(id: number): Observable<Tax> {
    const url = `${API_URL}tax/${id}`;
    return this.http.delete<Tax>(url);
  }


}
