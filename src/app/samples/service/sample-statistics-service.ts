import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import type { Observable } from "rxjs";

import type { SampleStatistics } from "../model/sample-statistics";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  private readonly http = inject(HttpClient);

  getStatistics(): Observable<SampleStatistics> {
    return this.http.get<SampleStatistics>("/api/v1/samples/statistics");
  }
}
