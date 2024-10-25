import { Component, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-third-create-pdf-rut',
  templateUrl: './third-create-pdf-rut.component.html',
  styleUrls: ['./third-create-pdf-rut.component.css']
})
export class ThirdCreatePdfRUTComponent {
  @Output() close = new EventEmitter<void>();
  
  inputData = { title: 'Crear Tercero Apartir del RUT' };
  pdfUrl: SafeResourceUrl | null = null;
  selectedFile: File | null = null;
  errorMessage: string | null = null; 

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {}

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
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Caiste.'
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
}
