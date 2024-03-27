import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enterprise } from '../models/Enterprise';
import { EnterpriseList } from '../models/EnterpriseList';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseService {

  logoDefault:string = "../../../../../../assets/Iconos/enterprise/icon-default.png";
  /**
   * Test of service
   */

  enterprises: EnterpriseList[] = [
    {
        id: 1,
        name: "Enterprise 1",
        nit: "NIT123",
        logo: this.logoDefault
    },
    {
        id: 2,
        name: "Enterprise 2",
        nit: "NIT456",
        logo: this.logoDefault
    },
    // Añade más objetos según sea necesario
];


  //Route API
  private apiUrl = ''; 

  constructor(private http: HttpClient) { }

    /**
   * @description Method to get all enterprises.
   * @returns all tax payer types from the backend
   */
  
  getEnterprises(): Observable<EnterpriseList[]> {
    return this.http.get<EnterpriseList[]>(this.apiUrl);
  }

  /**
   * 
   * @param id enterprise´s identifier
   * @description  Method to get one enterprise by its ID. 
   * @returns one enterprise with id
   */
  getEnterpriseById(id: number): Observable<Enterprise> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Enterprise>(url);
  }

  /**
   * @param enterprise 
   * @returns respond from the backend of creation enterprise
   */
  createEnterprise(enterprise: Enterprise): Observable<Enterprise> {
    return this.http.post<Enterprise>(this.apiUrl, enterprise);
  }

}
