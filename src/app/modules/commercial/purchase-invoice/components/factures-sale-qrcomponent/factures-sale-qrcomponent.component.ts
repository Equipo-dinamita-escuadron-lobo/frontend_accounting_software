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
  private id: number | undefined;
  public qrImageUrl: SafeUrl | undefined;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private factureService: InvoiceServiceService,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {
    this.verifiedStatusUser()
  }
  
  loginForm ={
    //! Valores por defecto servidor en desarrollo cambiar a '' en produccion
    username: 'contables_admin',
    password: '12345',
}
  verifiedStatusUser(){
    if(this.authService.verifiedStatusLogin()){
      this.router.navigate(['/general/enterprises/list']);
    }
  }
  ngOnInit(): void {
    // Obtener el ID de los parámetros de la ruta
    this.onLoginUser();
    
  }

  fetchAndSaveQR(id: number): void {
    this.factureService.generateInvoiceQR(id).subscribe((blob: Blob | MediaSource) => {
      // Crear una URL segura para la imagen QR
      const qrUrl = URL.createObjectURL(blob);
      this.qrImageUrl = this.sanitizer.bypassSecurityTrustUrl(qrUrl);

      // Descargar la imagen automáticamente
      const a = document.createElement('a');
      a.href = qrUrl;
      a.download = `facture_${id}_QR.jpeg`;
      a.click();

      // Limpiar el objeto URL después de usarlo
      URL.revokeObjectURL(qrUrl);
    });
  }
  
  async onLoginUser() {
    

    this.authService.login(this.loginForm).subscribe({
      next: (data: any) => {
        this.authService.setToken(data.access_token);
        this.authService.getCurrentUser().subscribe({
          //llega el usuario
          next: (data: any) => {
            this.authService.setUserData(data);
            //vericicamos el rol del usuario
            console.log('roles')
            let roles = data.roles;
            if (roles.includes('admin_realm') || roles.includes('super_realm')) {
              console.log(roles)
              this.authService.loginStatus.next(true);
              this.route.params.subscribe(params => {
                this.id = +params['id'];
                if (this.id) {
                  this.fetchAndSaveQR(this.id);
                  this.router.navigate(['']);
                }
              });
            }
          },
          error: (error) => {
            console.error(error);
          },
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
