/**
 * @fileoverview Servicio para la gestión integral de empresas
 * 
 * Este servicio permite:
 * - Gestionar el CRUD completo de empresas
 * - Manejar logos empresariales
 * - Procesar información del RUT
 * - Gestionar estados de empresas
 * - Manejar almacenamiento local
 * 
 * Funcionalidades principales:
 * - Creación y edición de empresas
 * - Gestión de empresas activas e inactivas
 * - Manejo de logos y archivos
 * - Procesamiento de documentos RUT
 * - Gestión de tipos de empresa
 * 
 * @autor [CONTAPP]
 * @versión 1.0.0
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Enterprise, EnterpriseDetails } from '../models/Enterprise';
import { EnterpriseList } from '../models/EnterpriseList';
import { EnterpriseType } from '../models/EnterpriseType';
import { environment } from '../../../../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { LocalStorageMethods } from '../../../../shared/methods/local-storage.method';
//import { environment } from '../../../../../environments/enviorment.development';

let API_URL = '';

//Si microservice es de enterprise se cambia la url de la api a local
if(environment.microservice == 'enterprise'){
    API_URL = environment.API_LOCAL_URL;
}
else{
    API_URL = environment.API_URL;
}

@Injectable({
  providedIn: 'root',
})
export class EnterpriseService {
  /** URL por defecto del logo */
  logoDefault: string = '../../../../../../assets/Iconos/enterprise/icon-default.png';

  /** Información del RUT de la empresa */
  private infoEnterpriseRUT: string |null=null;

  /** Métodos de almacenamiento local */
  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();

  /** Empresa seleccionada actualmente */
  enterpriseSelected?: EnterpriseDetails;

  /** Tipos de empresa disponibles */
  enterpriseTypes: EnterpriseType[] = [
    { id: 1, name: 'Privada' },
    { id: 2, name: 'Oficial' },
    { id: 3, name: 'Mixta' },
  ];

  /** URLs de la API */
  private apiUrl = API_URL + 'enterprises/';
  private urlCloudinary = environment.myStorageUrl;

  /**
   * Constructor del servicio
   * @param http Cliente HTTP para realizar peticiones
   */
  constructor(private http: HttpClient) {}

  /**
   * Establece la información del RUT de la empresa
   * @param info Información del RUT
   */
  setInfoEnterpiseRUT(info: string): void {
    this.infoEnterpriseRUT = info;
  }

  /**
   * Obtiene la información del RUT de la empresa
   * @returns Información del RUT almacenada
   */
  getinfoEnterpriseRUT(): string | null {
    return this.infoEnterpriseRUT;
  }

  /**
   * Limpia la información del RUT almacenada
   */
  clearInfoEnterpriseRUT(): void {
    this.infoEnterpriseRUT = null;
  }

  /**
   * Obtiene todas las empresas activas
   * @returns Observable con la lista de empresas activas
   */
  getEnterprisesActive(): Observable<EnterpriseList[]> {
    return this.http.get<EnterpriseList[]>(this.apiUrl);
  }

  /**
   * Obtiene todas las empresas inactivas
   * @returns Observable con la lista de empresas inactivas
   */
  getEnterprisesInactive(): Observable<EnterpriseList[]> {
    return this.http.get<EnterpriseList[]>(this.apiUrl + 'inactive');
  }

  /**
   * Obtiene una empresa por su ID
   * @param id Identificador de la empresa
   * @returns Observable con los detalles de la empresa
   */
  getEnterpriseById(id: string): Observable<EnterpriseDetails> {
    const url = `${this.apiUrl}enterprise/${id}`;
    return this.http.get<EnterpriseDetails>(url);
  }

  /**
   * Crea una nueva empresa
   * @param enterprise Datos de la empresa a crear
   * @returns Observable con la respuesta de creación
   */
  createEnterprise(enterprise: Enterprise): Observable<Enterprise> {
    return this.http.post<Enterprise>(this.apiUrl, enterprise);
  }

  /**
   * Actualiza el estado de una empresa
   * @param id ID de la empresa
   * @param status Nuevo estado
   * @returns Observable con la respuesta de actualización
   */
  updateStatusEnterprise(id: string, status: string) {
    const url = `${this.apiUrl}update/status/${id}/${status}`;
    return this.http.put(url, null);
  }

  /**
   * Actualiza la información de una empresa
   * @param id ID de la empresa
   * @param enterprise Nuevos datos de la empresa
   * @returns Observable con la respuesta de actualización
   */
  updateEnterprise(id?: string, enterprise?: Enterprise) {
    const url = `${this.apiUrl}update/${id}`;
    return this.http.put(url, enterprise);
  }

  /**
   * Obtiene los tipos de empresa disponibles
   * @returns Lista de tipos de empresa
   */
  getTypesEnterprise() {
    return this.enterpriseTypes;
  }

  /**
   * Sube una imagen al servidor
   * @param data Datos de la imagen
   * @returns Observable con la respuesta de la carga
   */
  uploadImg(data: any): Observable<any> {
    return this.http.post(this.urlCloudinary, data);
  }

  /**
   * Descarga un logo desde una URL
   * @param url URL del logo
   * @returns Observable con el archivo descargado
   */
  downloadLogo(url: string): Observable<File> {
    return this.http.get(url, { responseType: 'blob' }).pipe(
      map(blob => {
        const tipoMIME = blob.type;
        const extension = tipoMIME.split('/')[1];
        const nombreArchivo = `imagen.${extension}`;
        return new File([blob], nombreArchivo, {
          type: 'image/jpeg',
        });
      })
    );
  }

  /**
   * Obtiene la empresa seleccionada del almacenamiento local
   * @returns ID de la empresa seleccionada
   */
  getSelectedEnterprise() {
    return this.localStorageMethods.loadEnterpriseData();
  }

  /**
   * Obtiene la información completa de la empresa seleccionada
   * @returns Detalles de la empresa seleccionada
   */
  getEnterpriseSelectedInfo() {
    const id = this.getSelectedEnterprise();
    if (id === null) {
      // No hay empresa seleccionada
    } else {
      this.getEnterpriseById(id).subscribe({
        next: (enterpriseData) => {
          this.enterpriseSelected = enterpriseData;
        },
      });
    }
    return this.enterpriseSelected;
  }

  /**
   * Extrae información del PDF del RUT
   * @param file Archivo PDF del RUT
   * @returns Observable con la información extraída
   */
  ExtractInfoPDFRUT(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    console.log('Request Body:', formData);
    console.log(this.apiUrl+"content-PDF-RUT");
    return this.http.post<string>(this.apiUrl+"content-PDF-RUT", formData).pipe(
      catchError((error) => {
        console.error('Error al procesar el RUT: ', error);
        return throwError(() => new Error('Error occurred while uploading the file'));
      })
    );
  }
}
