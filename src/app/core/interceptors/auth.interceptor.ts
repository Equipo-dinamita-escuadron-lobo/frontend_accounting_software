import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const excludedRoutes = [ `${environment.keycloak_url}`, `${environment.myStorageUrl}` ];
    if (excludedRoutes.includes(req.url)) {
      return next.handle(req);
    }
    const token = localStorage.getItem('token');
    const authReq = req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) });
    return next.handle(authReq);
  }
}
