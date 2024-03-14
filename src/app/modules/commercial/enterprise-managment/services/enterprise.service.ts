import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enterprise } from '../models/Enterprise';
import { EnterpriseList } from '../models/EnterpriseList';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseService {

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
