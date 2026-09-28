import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { LoginRequest, LoginResponse } from './auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authUrl = 'http://localhost:8081/authstarter/auth/login';

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(this.authUrl, request)
      .pipe(
        tap(response => {
          sessionStorage.setItem(
            'accessToken',
            response.accessToken
          );

          sessionStorage.setItem(
            'refreshToken',
            response.refreshToken
          );
        })
      );
  }
}