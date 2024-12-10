/**
 * @fileoverview Servicio para la gestión de responsabilidades tributarias
 * 
 * Este servicio permite:
 * - Obtener listados de responsabilidades tributarias
 * - Gestionar la comunicación con el API de responsabilidades
 * - Manejar datos de prueba para desarrollo
 * 
 * Funcionalidades principales:
 * - Consulta de responsabilidades tributarias
 * - Manejo de URLs dinámicas según entorno
 * - Gestión de datos de prueba
 * 
 * @autor [CONTAPP]
 * @versión 1.0.0
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaxLiability } from '../models/TaxLiability';
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
 * Servicio para la gestión de responsabilidades tributarias
 * Maneja las operaciones relacionadas con responsabilidades tributarias
 */
@Injectable({
  providedIn: 'root'
})
export class TaxLiabilityService {

  /** URL del endpoint de empresas */
  private apiURL = API_URL + 'enterprises/'

  /** 
   * Datos de prueba para responsabilidades tributarias
   * Utilizados durante el desarrollo y pruebas
   */
  private taxLiabilities: TaxLiability[] = [
    { id: 1, name: 'Información Exógena' },
    { id: 2, name: 'Facturador Electrónico' },
    { id: 3, name: 'Informante de Beneficiarios Finales' },
    { id: 4, name: 'Retención en la Fuente a Título de Renta' },
    { id: 5, name: 'Retención en la Fuente a Título de IVA' },
    { id: 6, name: 'Autorretenedor' },
    { id: 7, name: 'Gran Contribuyente' }
  ];

  /**
   * Constructor del servicio
   * @param http Cliente HTTP para realizar peticiones
   */
  constructor(private http: HttpClient) { }

  /**
   * Obtiene todas las responsabilidades tributarias desde el backend
   * @returns Observable con la lista de responsabilidades tributarias
   */
  getTaxLiabilitiesBackend(): Observable<TaxLiability[]> {
    return this.http.get<TaxLiability[]>(this.apiURL + 'taxliabilities');
  }

  /**
   * Obtiene la lista de responsabilidades tributarias de prueba
   * @returns Array con las responsabilidades tributarias de prueba
   */
  getTaxLiabilities(){
    return this.taxLiabilities;
  }
}
