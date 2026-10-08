import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type {
  Observable} from 'rxjs';
import {
  catchError,
  finalize,
  of,
  shareReplay,
  tap
} from 'rxjs';

import type {
  LoginRequest,
  TokenResponse
} from './auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);
  private readonly authUrl = 'http://localhost:8081/authstarter/auth';
  private readonly accessTokenSignal = signal<string | null>(null);
  readonly accessToken = this.accessTokenSignal.asReadonly();
  private refreshInProgress$: Observable<TokenResponse> | null = null;

  readonly isAuthenticated = computed(() => this.accessTokenSignal() !== null);

  login(request: LoginRequest): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(
        `${this.authUrl}/login`,
        request,
        {
          withCredentials: true
        }
      )
      .pipe(
        tap(response => {
          this.accessTokenSignal.set(response.accessToken);
        })
      );
  }

  refresh(): Observable<TokenResponse> {
    if (this.refreshInProgress$) {
      return this.refreshInProgress$;
    }

    this.refreshInProgress$ = this.http
      .post<TokenResponse>(
        `${this.authUrl}/refresh`,
        {},
        {
          withCredentials: true
        }
      )
      .pipe(
        tap(response => {
          this.accessTokenSignal.set(response.accessToken);
        }),
        finalize(() => {
          this.refreshInProgress$ = null;
        }),
        shareReplay({
          bufferSize: 1,
          refCount: false
        })
      );

    return this.refreshInProgress$;
  }

  initializeSession(): Observable<TokenResponse | null> {
    return this.refresh().pipe(
      catchError(() => {
        this.accessTokenSignal.set(null);
        return of(null);
      })
    );
  }

  logout(): Observable<void> {
      return this.http
        .post<void>(
          `${this.authUrl}/logout`,
          {},
          {
            withCredentials: true
          }
        )
        .pipe(
          finalize(() => {
            this.accessTokenSignal.set(null);
          })
        );
  }

  clearAccessToken(): void {
    this.accessTokenSignal.set(null);
  }
}