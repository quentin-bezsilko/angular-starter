import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import type { Observable } from "rxjs";

import type { SampleStatistics } from "../model/sample-statistics";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    "http://localhost:8080/springstarter/api/v1/samples";

  getStatistics(): Observable<SampleStatistics> {
    return this.http.get<SampleStatistics>(`${this.apiUrl}/statistics`);
  }
}
