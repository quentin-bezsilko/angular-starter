import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import type { Observable } from 'rxjs';

import type { Page } from '../model/page.model';
import type {
  Sample,
  SampleStatus,
  CreateSampleRequest,
  UpdateSampleRequest
} from '../model/sample.model';

@Injectable({
  providedIn: 'root'
})
export class SampleService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8080/springstarter/api/v1/samples';

  findAll(
    page = 0,
    size = 20,
    sort = 'id,desc',
    search?: string,
    status?: SampleStatus,
    category?: string,
    active?: boolean
  ): Observable<Page<Sample>> {

    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort);

    if (search?.trim()) {
      params = params.set('search', search.trim());
    }

    if (status) {
      params = params.set('status', status);
    }

    if (category) {
      params = params.set('category', category);
    }

    if (active !== undefined) {
      params = params.set('active', active);
    }

    return this.http.get<Page<Sample>>(
      this.apiUrl,
      { params }
    );
  }

  findById(id: number): Observable<Sample> {
    return this.http.get<Sample>(
      `${this.apiUrl}/${id}`
    );
  }

  create(request: CreateSampleRequest): Observable<Sample> {
    return this.http.post<Sample>(
      this.apiUrl,
      request
    );
  }

  update(
    id: number,
    request: UpdateSampleRequest
  ): Observable<Sample> {
    return this.http.put<Sample>(
      `${this.apiUrl}/${id}`,
      request
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}