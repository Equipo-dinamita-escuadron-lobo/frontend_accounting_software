/**
 * @fileoverview Componente para la creación de terceros a partir de un archivo RUT en PDF
 * 
 * Este componente permite:
 * - Cargar un archivo PDF del RUT
 * - Visualizar el PDF cargado
 * - Extraer información del PDF para crear un tercero
 * - Redireccionar a la creación del tercero con la información extraída
 * 
 * @author [CONTAPP]
 * @version 1.0.0
 */

import { Component, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ThirdServiceService } from '../../services/third-service.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { buttonColors } from '../../../../../shared/buttonColors';

/**
 * Componente para gestionar la creación de terceros a partir de un PDF del RUT
 * 
 * @class ThirdCreatePdfRUTComponent
 */
@Component({
  selector: 'app-third-create-pdf-rut',
  templateUrl: './third-create-pdf-rut.component.html',
  styleUrls: ['./third-create-pdf-rut.component.css']
})
export class ThirdCreatePdfRUTComponent {
  /** Evento para cerrar el componente */
  @Output() close = new EventEmitter<void>();
  
  /** Datos de entrada del componente */
  inputData = { title: 'Crear Tercero apartir del RUT' };

  /** URL segura del PDF cargado */
  pdfUrl: SafeResourceUrl | null = null;

  /** Archivo PDF seleccionado */
  selectedFile: File | null = null;

  /** Indica si se ha cargado un archivo */
  isFileLoaded = false;

  /**
   * Constructor del componente
   * 
   * @param sanitizer - Servicio para sanitizar URLs
   * @param http - Cliente HTTP para peticiones
   * @param thirdService - Servicio para operaciones con terceros
   * @param router - Servicio de enrutamiento
   */
  constructor(
    private sanitizer: DomSanitizer, 
    private http: HttpClient, 
    private thirdService: ThirdServiceService, 
    private router: Router
  ) {}

  /**
   * Maneja el cambio de archivo seleccionado
   * Verifica que sea un PDF y lo carga para su visualización
   * 
   * @param event - Evento del input de archivo
   * @returns {void}
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
   * Sube el archivo PDF al servidor y procesa la información
   * Si la extracción es exitosa, redirige a la creación del tercero
   * 
   * @returns {void}
   */
  uploadFile() {
    if (this.selectedFile) {
      this.thirdService.ExtractInfoPDFRUT(this.selectedFile).subscribe({
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
            this.redirectToCreateThird(pdfContent);
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
   * Cierra el componente y reinicia los valores
   * 
   * @returns {void}
   */
  closePopUp() {
    this.close.emit();
    this.pdfUrl = null;
    this.selectedFile = null;
    this.isFileLoaded = false;
  }

  /**
   * Redirige a la página de creación de tercero con la información extraída
   * 
   * @param infoThird - Información extraída del PDF del RUT
   * @returns {void}
   */
  redirectToCreateThird(infoThird: string): void {
    this.thirdService.setInfoThirdRUT(infoThird); 
    this.router.navigate(['/general/operations/third-parties/create']);
  }
}
