/**
 * @fileoverview Servicio para la gestión de terceros
 * 
 * Este servicio permite:
 * - Obtener listados de terceros
 * - Gestionar la comunicación con el API
 * - Manejar datos de terceros
 * 
 * Funcionalidades principales:
 * - Consulta de terceros
 * - Manejo de respuestas HTTP
 * - Gestión de datos de terceros
 * 
 * @author [CONTAPP]
 * @version 1.0.0
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Third } from '../models/third-model'; // Importa el modelo que creaste

@Injectable({
  providedIn: 'root'
})
export class ThirdService {
  // private apiUrl = 'http://tuapi.com/api/terceros'; // Reemplaza con la URL de tu API real
  /** URL del endpoint para terceros */
  private apiUrl = 'assets/data/thirds-parties/thirds-parties.json';

  /**
   * Constructor del servicio
   * @param http Cliente HTTP para realizar peticiones
   */
  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de terceros
   * @returns Observable con el array de terceros
   */
  getThirdParties(): Observable<Third[]> {
    return this.http.get<Third[]>(this.apiUrl);
  }

  // Aquí podrías añadir más métodos para manejar terceros, como agregar, editar, eliminar, etc.
}
