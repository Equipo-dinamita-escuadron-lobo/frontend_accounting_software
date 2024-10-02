import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Tax } from '../models/Tax';



// Set API URL based on environment configuration
let API_URL = '';

// If the microservice is for account catalogue, set the API URL to local URL
if(environment.microservice == 'accountCatalogue'){
    API_URL = environment.API_LOCAL_URL;
}
else{
    API_URL = environment.API_URL;
}



@Injectable({
  providedIn: 'root'
})
export class TaxService {


      // URL for the account catalogue API
    //Production
    private apiURL = API_URL + 'tax/'
    //Local
    //private apiURL = myAppUrl + 'accountCatalogue'

    

  constructor(private http: HttpClient) { }

   getTaxes(enterpriseId: string): Observable<Tax[]> {
     const url = this.apiURL + 'taxes/' +enterpriseId;
     //const url = `${this.apiURL}/taxes/${enterpriseId}`;
     return this.http.get<Tax[]>(url);
   }

  createTax(tax: Tax): Observable<Tax> {
    const url = this.apiURL;
    return this.http.post<Tax>(url, tax);
  }

  updateTax(tax: Tax): Observable<Tax> {
    const id = tax.id;
    const url = this.apiURL + id;
    //const url = `${this.apiURL}${id}`;
    return this.http.put<Tax>(url, tax);
  }

  getTaxById(code: string, enterpriseId: string): Observable<Tax> {
    const url = this.apiURL + code + '/' + enterpriseId;
    //const url = `${this.apiURL}${code}/${enterpriseId}/`;
    return this.http.get<Tax>(url);
  }

  deleteTax(id: number): Observable<Tax> {
    const url = this.apiURL + id;
    //const url = `${this.apiURL}${id}`;
    return this.http.delete<Tax>(url);
  }


}
