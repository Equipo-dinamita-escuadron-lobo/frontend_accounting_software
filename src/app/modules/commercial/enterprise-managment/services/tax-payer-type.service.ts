/**
 * @fileoverview Servicio para la gestión de tipos de contribuyentes
 * 
 * Este servicio permite:
 * - Obtener listados de tipos de contribuyentes
 * - Gestionar la comunicación con el API de tipos de contribuyentes
 * - Manejar datos predefinidos de tipos de contribuyentes
 * 
 * Funcionalidades principales:
 * - Consulta de tipos de contribuyentes
 * - Manejo de URLs dinámicas según entorno
 * - Gestión de datos predefinidos
 * 
 * @autor [CONTAPP]
 * @versión 1.0.0
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaxPayerType } from '../models/TaxPayerType';
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
 * Servicio para la gestión de tipos de contribuyentes
 * Maneja las operaciones relacionadas con los diferentes tipos de contribuyentes
 */
@Injectable({
  providedIn: 'root',
})
export class TaxPayerTypeService {
  /** Lista predefinida de tipos de contribuyentes */
  private taxpayerTypes: TaxPayerType[] = [
    { id: 1, name: 'Responsable de IVA' },
    { id: 2, name: 'No Responsable de IVA' },
    { id: 3, name: 'Régimen Simple de Tributación' },
    { id: 4, name: 'Entidad Sin Ánimo de Lucro' },
  ];

  /** URL del endpoint de empresas */
  private apiUrl = API_URL + 'enterprises/'

  /**
   * Constructor del servicio
   * @param http Cliente HTTP para realizar peticiones
   */
  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los tipos de contribuyentes desde el backend
   * @returns Observable con la lista de tipos de contribuyentes
   */
  getTaxPayerTypesBack(): Observable<TaxPayerType[]> {
    return this.http.get<TaxPayerType[]>(this.apiUrl + 'taxpayertype');
  }

  /**
   * Obtiene la lista predefinida de tipos de contribuyentes
   * @returns Array con los tipos de contribuyentes predefinidos
   */
  getTaxPayerTypes(){
    return this.taxpayerTypes;
  }
}
