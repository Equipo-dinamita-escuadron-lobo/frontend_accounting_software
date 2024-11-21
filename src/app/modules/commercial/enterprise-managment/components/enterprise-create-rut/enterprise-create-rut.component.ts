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
  @Output() close = new EventEmitter<void>();
  
  inputData = { title: 'Crear una Empresa apartir del PDF del RUT' };
  pdfUrl: SafeResourceUrl | null = null;
  selectedFile: File | null = null;
  isFileLoaded = false;

  constructor(
    private sanitizer: DomSanitizer, 
    private http: HttpClient, 
    private router: Router, 
    private enterpriseServie: EnterpriseService,
  ) {}

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

  closePopUp() {
    this.close.emit();
    this.pdfUrl = null;
    this.selectedFile = null;
    this.isFileLoaded = false;
    this.router.navigate(['general/enterprises/list']);
  }

  goToListEnterprises(){
    this.router.navigate(['general/enterprises/list']);
  }

  redirectToCreateEnterprise(infoEnterprise: string):void{
    this.enterpriseServie.setInfoEnterpiseRUT(infoEnterprise);
    this.router.navigate(['general/enterprises/create']);
  }
}
