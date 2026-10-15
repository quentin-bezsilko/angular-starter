import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import type { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SampleFavoriteService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl =
    "http://localhost:8080/springstarter/api/v1/samples";

  addFavorite(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/favorite`, {});
  }

  removeFavorite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/favorite`);
  }
}
