import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environmentSecurity } from '../../../../../environments/enviorment.security';

const API_URL = environmentSecurity.ApiUrl

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private keycloakUrl = environmentSecurity.keycloakUrl;

  constructor(private http: HttpClient) { }

  public loginStatus = new Subject<boolean>();

  public login(user: any) {
    const body = new URLSearchParams();
    body.set('client_id', environmentSecurity.clientId);
    body.set('grant_type', 'password');
    body.set('username', user.username);
    body.set('password', user.password);
    body.set('client_secret', environmentSecurity.clientSecret);

    return this.http.post(this.keycloakUrl, body.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }


  // Guardamos el token en el localStorage
  public setToken(token: string) {
    localStorage.setItem('token', token);
  }

  // Obtenemos el token del localStorage
  public getToken() {
    return localStorage.getItem('token');
  }

  // Comprobamos si existe el token en el localStorage
  public isLogged() {
    const token = localStorage.getItem('token');
    return token ? true : false;
  }

  // Eliminamos el token
  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return true;
  }

  // Obtenemos el usuario
  public setUserData(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Obtenemos el usuario
  public getUserData() {
    const user = localStorage.getItem('user');
    if(user != null) {
      return JSON.parse(user);
    } else {
      this.logout();
      return null;
    }
  }

  // Obtenemos el usuario actual
  public getCurrentUser() {
    return this.http.get(`${API_URL}/keycloak/getCurrentUser`);
  }


}
