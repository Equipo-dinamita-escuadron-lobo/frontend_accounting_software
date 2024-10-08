import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Facture } from '../models/facture';

@Injectable({
  providedIn: 'root'
})
export class InvoiceServiceService {

  private apiUrl = environment.API_URL + 'factures/';

  constructor(private http: HttpClient) { }

  saveInvoice(facture: any): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, facture, { headers: headers, responseType: 'blob' });
  }
}
