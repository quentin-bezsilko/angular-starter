import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";

import {
  NgApexchartsModule,
  ApexChart,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexLegend,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexDataLabels,
  ApexPlotOptions
} from "ng-apexcharts";

import { DashboardService } from "../../service/sample-statistics-service";
import { SampleStatistics } from "../../model/sample-statistics";
import { signal } from '@angular/core';
import { PageHeader } from "../../components/page-header/page-header";

@Component({
  selector: "app-sample-dashboard",
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, PageHeader],
  templateUrl: "./sample-dashboard.html",
  styleUrl: "./sample-dashboard.scss",
})
export class SampleDashboard implements OnInit {
  private readonly dashboardService = inject(DashboardService);

loading = signal(true);
  error?: string;
  statistics?: SampleStatistics;

  statusSeries: ApexNonAxisChartSeries = [];
  statusLabels: string[] = [];

  categorySeries: ApexNonAxisChartSeries = [];
  categoryLabels: string[] = [];

  monthlySeries: ApexAxisChartSeries = [];
  monthlyCategories: string[] = [];

  readonly donutChart: ApexChart = {
    type: "donut",
    height: 350,
  };

  readonly barChart: ApexChart = {
    type: "bar",
    height: 380,
    toolbar: {
      show: false,
    },
  };

  readonly legend: ApexLegend = {
    position: "bottom",
  };

  readonly dataLabels: ApexDataLabels = {
    enabled: true,
  };

  readonly plotOptions: ApexPlotOptions = {
    bar: {
      borderRadius: 8,
      columnWidth: "45%",
    },
  };

  readonly responsive: ApexResponsive[] = [
    {
      breakpoint: 768,
      options: {
        chart: {
          height: 280,
        },
      },
    },
  ];

  ngOnInit(): void {
    this.loadStatistics();
  }

  private loadStatistics(): void {
    this.loading.set(true);

    this.dashboardService.getStatistics().subscribe({
      next: (stats) => {
        this.statistics = stats;
        this.buildCharts(stats);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error = "Impossible de charger les statistiques";
      },
    });
  }

  private buildCharts(stats: SampleStatistics): void {
    this.statusSeries =
      stats.statusDistribution?.map((s) => s.count) ?? [];

    this.statusLabels =
      stats.statusDistribution?.map((s) => s.status) ?? [];

    this.categorySeries =
      stats.categoryDistribution?.map((c) => c.count) ?? [];

    this.categoryLabels =
      stats.categoryDistribution?.map((c) => c.category) ?? [];

    this.monthlySeries = [
      {
        name: "Créations",
        data: stats.monthlyCreations?.map((m) => m.count) ?? [],
      },
    ];

    this.monthlyCategories =
      stats.monthlyCreations?.map((m) => m.month) ?? [];
  }
}
