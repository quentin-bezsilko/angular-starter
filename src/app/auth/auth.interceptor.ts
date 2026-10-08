import { inject } from '@angular/core';
import type {
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { Router } from '@angular/router';

import type {
  Observable} from 'rxjs';
import {
  catchError,
  switchMap,
  throwError
} from 'rxjs';

import { AuthService } from './auth.service';

/**
 * Ajoute l'access token à une requête HTTP.
 */
const addAccessToken = (
  request: HttpRequest<unknown>,
  accessToken: string
): HttpRequest<unknown> => {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};

/**
 * Indique si la requête cible un endpoint d'authentification.
 *
 * Ces endpoints ne doivent :
 * - ni recevoir l'access token ;
 * - ni déclencher le mécanisme automatique de refresh ;
 * - ni déclencher les redirections globales 401/403.
 */
const isAuthenticationRequest = (
  request: HttpRequest<unknown>
): boolean => {
  return (
    request.url.endsWith('/login') ||
    request.url.endsWith('/refresh') ||
    request.url.endsWith('/logout')
  );
};

/**
 * Intercepteur chargé de :
 *
 * - ajouter l'access token aux requêtes HTTP ;
 * - tenter un refresh automatique en cas de 401 ;
 * - rejouer la requête après un refresh réussi ;
 * - rediriger vers /login si le refresh échoue ;
 * - rediriger vers /403 en cas d'accès interdit.
 */
export const authInterceptor: HttpInterceptorFn = (
  request,
  next
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthRequest = isAuthenticationRequest(request);
  const accessToken = authService.accessToken();

  /*
   * Ajout de l'access token s'il existe.
   *
   * On évite volontairement de l'ajouter aux endpoints
   * login, refresh et logout.
   */
  const authenticatedRequest =
    accessToken && !isAuthRequest
      ? addAccessToken(request, accessToken)
      : request;

  return next(authenticatedRequest).pipe(
    catchError((error: HttpErrorResponse) => {

      /*
       * Les endpoints d'authentification sont gérés
       * directement par AuthService.
       *
       * Ils ne doivent jamais déclencher :
       * - un nouveau refresh automatique ;
       * - une redirection globale vers /login ;
       * - une redirection globale vers /403.
       *
       * C'est notamment important au démarrage de
       * l'application : initializeSession() appelle
       * /auth/refresh et gère lui-même l'absence de session.
       */
      if (isAuthRequest) {
        return throwError(() => error);
      }

      /*
       * 403 Forbidden
       *
       * Si une requête métier est refusée :
       *
       * - utilisateur authentifié -> /403
       * - utilisateur non authentifié -> /login
       */
      if (error.status === 403) {
        if (authService.isAuthenticated()) {
          void router.navigate(['/403']);
        } else {
          void router.navigate(['/login'], {
            queryParams: {
              returnUrl: router.url
            }
          });
        }

        return throwError(() => error);
      }

      /*
       * Pour toute erreur autre qu'un 401,
       * on laisse l'erreur continuer normalement.
       */
      if (error.status !== 401) {
        return throwError(() => error);
      }

      /*
       * 401 Unauthorized
       *
       * L'access token peut être expiré.
       * On tente d'obtenir un nouveau token grâce
       * au refresh token HttpOnly.
       */
      return authService.refresh().pipe(
        switchMap(response => {
          const retryRequest = addAccessToken(
            request,
            response.accessToken
          );

          return next(retryRequest);
        }),

        /*
         * Si le refresh échoue, la session n'est
         * plus valide.
         *
         * On supprime l'access token puis on redirige
         * vers la page de connexion en conservant
         * l'URL demandée.
         */
        catchError((refreshError: unknown) => {
  authService.clearAccessToken();

  void router.navigate(['/login'], {
    queryParams: {
      returnUrl: router.url
    }
  });

  return throwError(() => refreshError);
})
      );
    })
  );
};