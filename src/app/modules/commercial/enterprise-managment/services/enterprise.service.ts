import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enterprise } from '../models/Enterprise';
import { EnterpriseList } from '../models/EnterpriseList';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseService {

  /**
   * Test of service
   */

  enterprises: EnterpriseList[] = [
    {
        id: 1,
        name: "Enterprise 1",
        nit: "NIT123",
        logo: "enterprise1_logo.png"
    },
    {
        id: 2,
        name: "Enterprise 2",
        nit: "NIT456",
        logo: "enterprise2_logo.png"
    },
    // Añade más objetos según sea necesario
];


  //Route API
  private apiUrl = ''; 

  constructor(private http: HttpClient) { }

  //Method to get all enterprises.
  getEnterprises(): Observable<EnterpriseList[]> {
    return this.http.get<EnterpriseList[]>(this.apiUrl);
  }

  // Method to get one enterprise by its ID. 
  getEnterpriseById(id: number): Observable<Enterprise> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Enterprise>(url);
  }

  // Method to create one enterprise
  createEnterprise(enterprise: Enterprise): Observable<Enterprise> {
    return this.http.post<Enterprise>(this.apiUrl, enterprise);
  }

}
