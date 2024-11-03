import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceServiceService } from '../../services/invoice-service.service'; // Asegúrate de ajustar la ruta del servicio
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from '../../../../principal/login/services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-factures-sale-qrcomponent',
  templateUrl: './factures-sale-qrcomponent.component.html',
  styleUrls: ['./factures-sale-qrcomponent.component.css']
})
export class FacturesSaleQRComponentComponent implements OnInit {
  isLoading = true;
  private id: number | undefined;
  public qrImageUrl: SafeUrl | undefined;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private factureService: InvoiceServiceService,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  loginForm = {
    //! Valores por defecto servidor en desarrollo cambiar a '' en produccion
    username: 'contables_admin',
    password: '12345',
  }
  
  ngOnInit(): void {
    // Obtener el ID de los parámetros de la ruta
    this.onLoginUser();

  }

  
  fetchAndSaveQR(id: number): Promise<void> {
    return new Promise((resolve) => {
      this.factureService.generateInvoiceQR(id).subscribe((blob: Blob | MediaSource) => {
        // Crear una URL segura para la imagen QR
        const qrUrl = URL.createObjectURL(blob);
        // Descargar la imagen automáticamente
        const a = document.createElement('a');
        a.href = qrUrl;
        a.download = `facture_${id}_QR.jpeg`;
        a.click();
  
        // Limpiar el objeto URL después de usarlo
        URL.revokeObjectURL(qrUrl);
  
        // Resuelve la promesa para indicar que la descarga ha comenzado
        resolve();
      });
    });
  }
  
  async onLoginUser() {
    this.isLoading = true; // Activa el spinner
    this.authService.login(this.loginForm).subscribe({
      next: (data: any) => {
        this.authService.setToken(data.access_token);
        this.authService.getCurrentUser().subscribe({
          next: async (data: any) => {
            this.authService.setUserData(data);
            let roles = data.roles;
            if (roles.includes('admin_realm') || roles.includes('super_realm')) {
              this.authService.loginStatus.next(true);
              this.route.params.subscribe(async params => {
                this.id = +params['id'];
                if (this.id) {
                  await this.fetchAndSaveQR(this.id);
                  this.isLoading = false; // Desactiva el spinner al finalizar
                  setTimeout(() => {
                    this.router.navigate(['/general/enterprises/list']);
                  }, 1000);
                }
              });
            }
          },
          error: (error) => {
            console.error(error);
            this.isLoading = false; // Desactiva el spinner si ocurre un error
          },
        });
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false; // Desactiva el spinner si ocurre un error
      },
    });
  }
  
}
