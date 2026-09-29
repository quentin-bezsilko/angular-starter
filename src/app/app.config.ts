import {ApplicationConfig, inject, provideAppInitializer} from '@angular/core';
import {provideHttpClient,  withInterceptors} from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './auth/auth.interceptor';
import { AuthService } from './auth/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    provideHttpClient(
      withInterceptors([
        authInterceptor
      ])
    ),

    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.initializeSession();
    })
  ]
};