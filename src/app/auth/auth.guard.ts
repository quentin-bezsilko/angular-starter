import { inject } from '@angular/core';
import {
  CanActivateChildFn,
  CanActivateFn,
  Router,
  UrlTree
} from '@angular/router';

import { AuthService } from './auth.service';

/**
 * Vérifie si l'utilisateur est authentifié.
 *
 * La restauration de session via le refresh token HttpOnly
 * est effectuée au démarrage de l'application par initializeSession().
 *
 * Le guard se contente donc de vérifier l'état d'authentification courant.
 */
const checkAuthentication = (url: string): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: {
      returnUrl: url
    }
  });
};

/**
 * Protège une route.
 *
 * Exemple :
 * canActivate: [authGuard]
 */
export const authGuard: CanActivateFn = (_route, state) =>
  checkAuthentication(state.url);

/**
 * Protège toutes les routes enfants d'une route.
 *
 * Exemple :
 * canActivateChild: [authChildGuard]
 */
export const authChildGuard: CanActivateChildFn = (_route, state) =>
  checkAuthentication(state.url);