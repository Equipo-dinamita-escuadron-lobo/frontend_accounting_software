/**
 * @fileoverview Servicio para la gestión de ciudades
 * 
 * Este servicio permite:
 * - Obtener listados de ciudades por departamento
 * - Manejar las peticiones HTTP relacionadas con ciudades
 * - Gestionar la URL de la API según el entorno
 * 
 * Funcionalidades principales:
 * - Consulta de ciudades por departamento
 * - Manejo dinámico de URLs según microservicio
 * - Gestión de respuestas HTTP
 * 
 * @author [CONTAPP]
 * @version 1.0.0
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { City } from '../models/City';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

/** URL base de la API */
let API_URL = '';

/** 
 * Configuración de la URL de la API según el tipo de microservicio
 * Si el microservicio es 'enterprise', se usa la URL local
 */
if(environment.microservice == 'enterprise'){
    API_URL = environment.API_LOCAL_URL;
}
else{
    API_URL = environment.API_URL;
}

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
  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de ciudades para un departamento específico
   * @param id ID del departamento
   * @returns Observable con la lista de ciudades del departamento
   */
  getListCitiesByDepartment(id: number): Observable<City> {
    const url = `${this.apiUrl}/${id}`;
    console.log('Datos de ', url);
    return this.http.get<City>(url);
  }
}
