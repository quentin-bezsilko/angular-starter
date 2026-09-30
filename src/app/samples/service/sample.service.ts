import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Sample, CreateSampleRequest, UpdateSampleRequest } from '../model/sample.model';

@Injectable({
  providedIn: 'root'
})
export class SampleService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/springstarter/api/v1/samples';

  findAll(): Observable<Sample[]> {
    return this.http.get<Sample[]>(this.apiUrl);
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

  update(id: number, request: UpdateSampleRequest): Observable<Sample> {
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