/**
 * @fileoverview Servicio para la gestión de departamentos
 * 
 * Este servicio permite:
 * - Obtener listados de departamentos
 * - Manejar departamentos nacionales y extranjeros
 * - Gestionar la comunicación con el API de departamentos
 * 
 * Funcionalidades principales:
 * - Consulta de departamentos colombianos
 * - Manejo de departamentos extranjeros
 * - Integración con el backend de direcciones
 * 
 * @autor [CONTAPP]
 * @versión 1.0.0
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Department } from '../models/Department';
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
 * Servicio para la gestión de departamentos
 * Maneja las operaciones relacionadas con departamentos y su integración con el backend
 */
@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  /** Lista de departamentos colombianos */
  colombianDepartments: Department[] = [
    { id: 1, name: 'Amazonas' },
    { id: 2, name: 'Antioquia' },
    { id: 3, name: 'Arauca' },
    { id: 4, name: 'Atlántico' },
    { id: 5, name: 'Bolívar' },
    { id: 6, name: 'Boyacá' },
    { id: 7, name: 'Caldas' },
    { id: 8, name: 'Caquetá' },
    { id: 9, name: 'Casanare' },
    { id: 10, name: 'Cauca' },
    { id: 11, name: 'Cesar' },
    { id: 12, name: 'Chocó' },
    { id: 13, name: 'Córdoba' },
    { id: 14, name: 'Cundinamarca' },
    { id: 15, name: 'Guainía' },
    { id: 16, name: 'Guaviare' },
    { id: 17, name: 'Huila' },
    { id: 18, name: 'La Guajira' },
    { id: 19, name: 'Magdalena' },
    { id: 20, name: 'Meta' },
    { id: 21, name: 'Nariño' },
    { id: 22, name: 'Norte de Santander' },
    { id: 23, name: 'Putumayo' },
    { id: 24, name: 'Quindío' },
    { id: 25, name: 'Risaralda' },
    { id: 26, name: 'San Andrés y Providencia' },
    { id: 27, name: 'Santander' },
    { id: 28, name: 'Sucre' },
    { id: 29, name: 'Tolima' },
    { id: 30, name: 'Valle del Cauca' },
    { id: 31, name: 'Vaupés' },
    { id: 32, name: 'Vichada' },
  ];

  /** Lista de departamentos extranjeros */
  extranjeroDepartments: Department[] = [ 
    { id: 33, name: 'Extranjero' }
  ];

  /** URL del endpoint de departamentos */
  private apiUrl = API_URL + 'address/departments';
  //Local
  //private apiUrl = myAppUrl + 'address/departments';

  /**
   * Constructor del servicio
   * @param http Cliente HTTP para realizar peticiones
   */
  constructor(private http: HttpClient) {
   }

  /**
   * Obtiene la lista de departamentos desde el backend
   * @returns Observable con la lista de departamentos
   */
  getListDepartmentsBackend(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }

  /**
   * Obtiene la lista de departamentos colombianos
   * @returns Array de departamentos colombianos
   */
  getListDepartments(){
    return this.colombianDepartments;
  }

  /**
   * Obtiene la lista de departamentos según el tipo
   * @param n 1 para departamentos colombianos, otro valor para extranjeros
   * @returns Array de departamentos según el tipo seleccionado
   */
  getListDepartments2(n : number ){
    if(n == 1){
      return this.colombianDepartments;      
    }else{
      return this.extranjeroDepartments;
    }
  }
}
