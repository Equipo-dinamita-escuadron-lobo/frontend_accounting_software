import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/User';

let API_URL = '';

//Si microservice es de enterprise se cambia la url de la api a local
if(environment.microservice == 'keycloak'){
    API_URL = environment.URL;
}
else{
    API_URL = environment.URL;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {

  
  //Route API
  private apiUrl = API_URL + 'keycloak/';


  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl + 'users');
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl+'create', user);
  }

  updateUser(id?: string, user?: User) {
    const url = `${this.apiUrl}update/${id}`;
    return this.http.put(url, user);
  }

  getUserById(id: string): Observable<User> {
    const url = `${this.apiUrl}user/${id}`;
    console.log(url);
    return this.http.get<User>(url);
  }
}
