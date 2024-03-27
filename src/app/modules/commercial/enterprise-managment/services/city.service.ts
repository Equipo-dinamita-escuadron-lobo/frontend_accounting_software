import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { City } from '../models/City';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  caucaCities: City[] = [
    { id: 1, name: 'Popayán' },
    { id: 2, name: 'Santander de Quilichao' },
    { id: 3, name: 'Puerto Tejada' },
    { id: 4, name: 'Guachené' },
    // Puedes añadir más ciudades del Cauca según sea necesario
  ];

  private apiUrl = ''; 
  constructor(private http: HttpClient) {

   }

   /*
  getListCitiesByDepartment(id: number): Observable<City> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<City>(url);
  }*/

  getListCitiesByDepartment(id: number){
    return this.caucaCities;
  }


}
