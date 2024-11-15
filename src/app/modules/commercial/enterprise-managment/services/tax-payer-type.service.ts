import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaxPayerType } from '../models/TaxPayerType';
import { environment } from '../../../../../environments/environment';

let API_URL = '';

//Si microservice es de enterprise se cambia la url de la api a local
if(environment.microservice == 'enterprise'){
    API_URL = environment.API_LOCAL_URL;
}
else{
    API_URL = environment.API_URL;
}


@Injectable({
  providedIn: 'root',
})
export class TaxPayerTypeService {
  private taxpayerTypes: TaxPayerType[] = [
    { id: 1, name: 'Responsable de IVA' },
    { id: 2, name: 'No Responsable de IVA' },
    { id: 3, name: 'Régimen Simple de Tributación' },
    { id: 4, name: 'Entidad Sin Ánimo de Lucro' },
  ];

  private apiUrl = API_URL + 'enterprises/'

  constructor(private http: HttpClient) {}

  /**
   * @description method to get all tax payer types
   * @returns all tax payer types from the backend
   */

  getTaxPayerTypesBack(): Observable<TaxPayerType[]> {
    return this.http.get<TaxPayerType[]>(this.apiUrl + 'taxpayertype');
  }

  getTaxPayerTypes(){
    return this.taxpayerTypes;
  }
}
