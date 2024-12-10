/**
 * @fileoverview Componente para crear empresas a partir de PDF del RUT
 * 
 * Este componente permite:
 * - Cargar archivos PDF del RUT
 * - Visualizar el PDF cargado
 * - Extraer información del RUT
 * - Crear empresas con la información extraída
 * 
 * Funcionalidades principales:
 * - Carga y validación de archivos PDF
 * - Visualización segura de PDF
 * - Procesamiento de información del RUT
 * - Manejo de errores y alertas
 * - Redirección a creación de empresa
 * 
 * @author [CONTAPP]
 * @version 1.0.0
 */

import { Component, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { EnterpriseService } from '../../services/enterprise.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { buttonColors } from '../../../../../shared/buttonColors';

@Component({
  selector: 'app-enterprise-create-rut',
  templateUrl: './enterprise-create-rut.component.html',
  styleUrl: './enterprise-create-rut.component.css'
})
export class EnterpriseCreateRUTComponent {
  /** Evento para cerrar el componente */
  @Output() close = new EventEmitter<void>();
  
  /** Datos de entrada del componente */
  inputData = { title: 'Crear una Empresa apartir del PDF del RUT' };

  /** URL segura del PDF cargado */
  pdfUrl: SafeResourceUrl | null = null;

  /** Archivo PDF seleccionado */
  selectedFile: File | null = null;

  /** Indica si se ha cargado un archivo */
  isFileLoaded = false;

  /**
   * Constructor del componente
   * @param sanitizer Servicio para sanitizar URLs
   * @param http Cliente HTTP
   * @param router Servicio de enrutamiento
   * @param enterpriseServie Servicio de empresas
   */
  constructor(
    private sanitizer: DomSanitizer, 
    private http: HttpClient, 
    private router: Router, 
    private enterpriseServie: EnterpriseService,
  ) {}

  /**
   * Maneja el cambio de archivo seleccionado
   * @param event Evento de cambio de archivo
   */
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(reader.result as string);
        this.isFileLoaded = true;
      };
      reader.readAsDataURL(file);
    } else {
      alert('Por favor, selecciona un archivo PDF.');
    }
  }

  /**
   * Sube el archivo PDF y procesa la información
   * Maneja la extracción de información y redirección
   */
  uploadFile() {
    if (this.selectedFile) {
      this.enterpriseServie.ExtractInfoPDFRUT(this.selectedFile).subscribe({
        next: (response) => {
          console.log('Respuesta del servicio:', response);
          const pdfContent = response.content;
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Archivo cargado correctamente.',
            confirmButtonColor: buttonColors.confirmationColor
          });

          if (pdfContent === ";;0;;;;;;;;;0") {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se encontro informacion para crear un tercero',
              confirmButtonColor: buttonColors.confirmationColor
            });
          } else {
            console.log(pdfContent);
            this.redirectToCreateEnterprise(pdfContent);
          }
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar el archivo: ' + (err.message || 'Error desconocido.'),
            confirmButtonColor: buttonColors.confirmationColor
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No hay archivo seleccionado.',
        confirmButtonColor: buttonColors.confirmationColor
      });
    }
  }

  /**
   * Cierra el popup y limpia el estado
   */
  closePopUp() {
    this.close.emit();
    this.pdfUrl = null;
    this.selectedFile = null;
    this.isFileLoaded = false;
    this.router.navigate(['general/enterprises/list']);
  }

  /**
   * Navega a la lista de empresas
   */
  goToListEnterprises(){
    this.router.navigate(['general/enterprises/list']);
  }

  /**
   * Redirige a la creación de empresa con la información extraída
   * @param infoEnterprise Información extraída del RUT
   */
  redirectToCreateEnterprise(infoEnterprise: string):void{
    this.enterpriseServie.setInfoEnterpiseRUT(infoEnterprise);
    this.router.navigate(['general/enterprises/create']);
  }
}
