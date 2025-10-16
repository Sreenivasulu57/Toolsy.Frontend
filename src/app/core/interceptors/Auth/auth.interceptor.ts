import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';

import { Router } from '@angular/router';
import { AuthService } from '../../../common/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();
    let authReq = req;

    if (token) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403 ) {
          
          return this.auth.refreshToken().pipe(
            switchMap(() => {
              debugger
              const newToken = this.auth.getToken();
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
                withCredentials: true,
              });
              return next.handle(retryReq);
            }),
            catchError(() => {
              this.auth.logout();
              this.router.navigate(['/login']);
              return throwError(() => error);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }
}
