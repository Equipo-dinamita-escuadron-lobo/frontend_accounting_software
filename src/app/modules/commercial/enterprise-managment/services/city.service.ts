import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { City } from '../models/City';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  private apiUrl = ''; 
  constructor(private http: HttpClient) {

   }

  getListCitiesByDepartment(id: number): Observable<City> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<City>(url);
  }

}
