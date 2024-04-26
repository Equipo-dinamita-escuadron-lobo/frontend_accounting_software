import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { City } from '../models/City';
import { Observable } from 'rxjs';
//import { environment } from '../../../../../environments/environment';
import { environment } from '../../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CityService {

  //Production
  //private apiUrl = environment.API_URL + 'address/cities'; 
  //Local
  private apiUrl = environment.myAppUrl + 'address/cities'
  constructor(private http: HttpClient) {

   }

  getListCitiesByDepartment(id: number): Observable<City> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<City>(url);
  }

}
