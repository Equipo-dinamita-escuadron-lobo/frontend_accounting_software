import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environmentSecurity } from '../../../environments/enviorment.security';

const keycloakUrl = environmentSecurity.keycloakUrl;

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const excludedRoutes = [`${keycloakUrl}`];
    if (excludedRoutes.includes(req.url)) {
      return next.handle(req);
    }
    const token = localStorage.getItem('token');
    const authReq = req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) });
    return next.handle(authReq);
  }
}
