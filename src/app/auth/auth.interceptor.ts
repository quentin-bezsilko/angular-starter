import { inject } from '@angular/core';

import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';

import {
  catchError,
  switchMap,
  throwError
} from 'rxjs';

import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const accessToken = authService.accessToken();
  const requestWithToken = accessToken ? addAccessToken(req, accessToken) : req;

  return next(requestWithToken).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status !== 401 || isAuthenticationRequest(req)) {
        return throwError(() => error);
      }

      return authService.refresh().pipe(
        switchMap(response => {
          const retryRequest = addAccessToken(req, response.accessToken);
          return next(retryRequest);
        }),
        catchError(refreshError => {
          authService.clearAccessToken();
          return throwError(() => refreshError);
        })
      );
    })
  );
};

function addAccessToken(
  req: HttpRequest<unknown>,
  token: string
): HttpRequest<unknown> {

  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

function isAuthenticationRequest(req: HttpRequest<unknown>): boolean {
  return (
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/refresh')
  );
}