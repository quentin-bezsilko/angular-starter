import {
  Component,
  inject,
  signal
} from '@angular/core';

import type { HttpErrorResponse } from '@angular/common/http';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loading = signal(false);

  protected readonly errorMessage =
    signal<string | null>(null);

  protected readonly loginForm =
    this.formBuilder.nonNullable.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

  protected login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService
      .login(this.loginForm.getRawValue())
      .subscribe({

        next: () => {
          this.loading.set(false);
          void this.router.navigate(['/samples']);
        },
        error: (error: HttpErrorResponse) => {
          this.loading.set(false);

          if (error.status === 401) {
            this.errorMessage.set(
              'Login ou mot de passe incorrect.'
            );

            return;
          }

          this.errorMessage.set(
            'Le service d’authentification est indisponible.'
          );
        }
      });
  }
}