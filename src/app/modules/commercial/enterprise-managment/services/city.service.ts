/**
 * @fileoverview Servicio para la gestión de ciudades
 * 
 * Este servicio permite:
 * - Obtener listados de ciudades por departamento
 * - Gestionar la comunicación con el API de ciudades
 * - Manejar diferentes URLs según el entorno
 * 
 * Funcionalidades principales:
 * - Consulta de ciudades por departamento
 * - Manejo de URLs dinámicas según microservicio
 * - Integración con el backend de direcciones
 * 
 * @autor [CONTAPP]
 * @versión 1.0.0
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { City } from '../models/City';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

/** URL base de la API */
let API_URL = '';

/** Configuración de URL según el microservicio */
if(environment.microservice == 'enterprise'){
    API_URL = environment.API_LOCAL_URL;
}
else{
    API_URL = environment.API_URL;
}

/**
 * Servicio para la gestión de ciudades
 * Maneja las operaciones relacionadas con ciudades y su integración con el backend
 */
@Injectable({
  providedIn: 'root'
})
export class CityService {
  /** URL del endpoint de ciudades */
  private apiUrl = API_URL + 'address/cities'

  /**
   * Constructor del servicio
   * @param http Cliente HTTP para realizar peticiones
   */
  constructor(private http: HttpClient) {
   }

  /**
   * Obtiene la lista de ciudades de un departamento específico
   * @param id ID del departamento
   * @returns Observable con la lista de ciudades del departamento
   */
  getListCitiesByDepartment(id: number): Observable<City> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<City>(url);
  }
}
