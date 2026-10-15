import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import type { BulkResult } from "../model/sample-bulk";
import { SampleStatus } from "../model/sample";

@Injectable({
  providedIn: "root",
})
export class SampleBulkService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl =
    "http://localhost:8080/springstarter/api/v1/samples";

  bulkDelete(ids: number[]): Observable<BulkResult> {
    return this.http.post<BulkResult>(`${this.apiUrl}/bulk-delete`, { ids });
  }

  bulkDuplicate(ids: number[]): Observable<BulkResult> {
    return this.http.post<BulkResult>(`${this.apiUrl}/bulk-duplicate`, { ids });
  }

  bulkUpdateStatus(
    ids: number[],
    status: SampleStatus,
  ): Observable<BulkResult> {
    return this.http.post<BulkResult>(`${this.apiUrl}/bulk-status`, {
      ids,
      status,
    });
  }

  bulkMoveToTrash(ids: number[]): Observable<BulkResult> {
    return this.bulkUpdateStatus(ids, SampleStatus.DELETED);
  }

  bulkExport(ids: number[]): Observable<Blob> {
    return this.http.post(
      `${this.apiUrl}/bulk-export`,
      { ids },
      {
        responseType: "blob",
      },
    );
  }
}
