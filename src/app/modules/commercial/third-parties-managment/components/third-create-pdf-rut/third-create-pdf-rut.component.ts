import { Component, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ThirdServiceService } from '../../services/third-service.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-third-create-pdf-rut',
  templateUrl: './third-create-pdf-rut.component.html',
  styleUrls: ['./third-create-pdf-rut.component.css']
})
export class ThirdCreatePdfRUTComponent {
  @Output() close = new EventEmitter<void>();
  
  inputData = { title: 'Crear Tercero A partir del RUT' };
  pdfUrl: SafeResourceUrl | null = null;
  selectedFile: File | null = null;

  constructor(
    private sanitizer: DomSanitizer, 
    private http: HttpClient, 
    private thirdService: ThirdServiceService, 
    private router: Router
  ) {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Por favor, selecciona un archivo PDF.');
    }
  }

  uploadFile() {
    if (this.selectedFile) {
      this.thirdService.ExtractInfoPDFRUT(this.selectedFile).subscribe({
        next: (response) => {
          console.log('Respuesta del servicio:', response);
          const pdfContent = response.content;
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Archivo cargado correctamente.'
          });
          this.redirectToCreateThird(pdfContent);
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar el archivo: ' + (err.message || 'Error desconocido.')
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No hay archivo seleccionado.'
      });
    }
  }

  closePopUp() {
    this.close.emit();
    this.pdfUrl = null;
    this.selectedFile = null;
  }

  redirectToCreateThird(infoThird: string): void {
    this.thirdService.setInfoThirdRUT(infoThird); 
    this.router.navigate(['/general/operations/third-parties/create']);
  }
}