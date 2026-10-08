import type {
  ApplicationConfig} from '@angular/core';
import {
  inject,
  provideAppInitializer
} from '@angular/core';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';
import { AuthService } from './auth/auth.service';
import { authInterceptor } from './auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return firstValueFrom(
        authService.initializeSession()
      );
    })
  ]
};