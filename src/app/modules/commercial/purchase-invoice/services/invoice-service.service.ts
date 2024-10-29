import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceServiceService {

  private apiUrl = environment.API_FEATURES_URL + 'factures/';

  constructor(private http: HttpClient) { }

  saveInvoice(facture: any): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, facture, { headers: headers, responseType: 'blob' });
  }
}
