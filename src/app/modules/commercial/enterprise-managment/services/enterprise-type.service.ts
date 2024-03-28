import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnterpriseType } from '../models/EnterpriseType';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseTypeService {


  enterpriseTypes: EnterpriseType[] = [
    { id: 1, name: 'Small Business' },
    { id: 2, name: 'Medium Business' },
    { id: 3, name: 'Large Business' },
    // Puedes añadir más tipos de empresas según sea necesario
  ];

  private apiUrl = ''; 
  constructor(private http: HttpClient) {

   }

   
  //Method to get all enterprises.
  getListTypesEnterprise(): Observable<EnterpriseType[]> {
    return this.http.get<EnterpriseType[]>(this.apiUrl);
  }

  /*
  getListTypesEnterprise(){
    return this.enterpriseTypes;
  }*/


}
