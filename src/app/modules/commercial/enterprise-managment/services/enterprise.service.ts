import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enterprise } from '../models/Enterprise';
import { EnterpriseList } from '../models/EnterpriseList';
import { EnterpriseType } from '../models/EnterpriseType';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseService {

  logoDefault:string = "../../../../../../assets/Iconos/enterprise/icon-default.png";
  /**
   * Test of service
   */

  enterpriseTypes: EnterpriseType[] = [
    { id: 1, name: 'Privada' },
    { id: 2, name: 'Oficial' },
    { id: 3, name: 'Mixta' }
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

  getTypesEnterprise(){
    return this.enterpriseTypes;
  }

}
