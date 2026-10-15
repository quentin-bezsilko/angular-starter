import type { OnInit } from "@angular/core";
import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardService } from "../../service/sample-statistics-service";
import type { SampleStatistics } from "../../model/sample-statistics";

@Component({
  selector: "app-sample-dashboard",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./sample-dashboard.html",
  styleUrl: "./sample-dashboard.scss",
})
export class SampleDashboard implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  statistics?: SampleStatistics;

  loading = false;
  error?: string;

  ngOnInit(): void {
    this.loadStatistics();
  }

  private loadStatistics(): void {
    this.loading = true;

    this.dashboardService.getStatistics().subscribe({
      next: (response) => {
        this.statistics = response;
        this.loading = false;
      },
      error: () => {
        this.error = "Impossible de charger les statistiques";
        this.loading = false;
      },
    });
  }
}
