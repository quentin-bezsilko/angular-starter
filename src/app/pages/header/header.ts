import { ChangeDetectionStrategy, Component, inject } from "@angular/core";

import { Router, RouterLink } from "@angular/router";

import { AuthService } from "../../auth/auth-service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./header.html",
  styleUrl: "./header.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  readonly authService = inject(AuthService);

  private readonly router = inject(Router);

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.redirectToLogin();
      },
      error: () => {
        this.redirectToLogin();
      },
    });
  }

  private redirectToLogin(): void {
    void this.router.navigate(["/login"]);
  }
}
