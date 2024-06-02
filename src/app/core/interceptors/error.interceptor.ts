import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../modules/principal/login/services/auth.service';
import Swal from 'sweetalert2';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(err => {
        if (err.status === 401 || err.status === 403) {
          console.error('Unauthorized...');
          this.authService.logout();
          Swal.fire({
            title: 'Sesión expirada',
            text: 'Por favor inicie sesión nuevamente',
            icon: 'warning',
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/";
            }
          });
        }
        console.error(err);
        return throwError(() => err);
      })
    );
  }
}
