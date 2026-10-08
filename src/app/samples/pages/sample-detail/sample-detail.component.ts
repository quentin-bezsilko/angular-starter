import type { OnInit } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';

import { DatePipe, DecimalPipe } from '@angular/common';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import type { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

import type {
  Sample} from '../../model/sample.model';
import {
  SampleStatus
} from '../../model/sample.model';

import { SampleService } from '../../service/sample.service';

@Component({
  selector: 'app-sample-detail',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './sample-detail.component.html',
  styleUrl: './sample-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleDetailComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly sampleService = inject(SampleService);

  readonly sample = signal<Sample | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly SampleStatus = SampleStatus;

  ngOnInit(): void {
    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!Number.isInteger(id) || id <= 0) {
      this.error.set('Identifiant du sample invalide.');
      return;
    }

    this.loadSample(id);
  }

  loadSample(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.sampleService
      .findById(id)
      .pipe(
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe({
        next: sample => {
          this.sample.set(sample);
        },
        error: (error: HttpErrorResponse) => {
          this.handleError(error);
        }
      });
  }

  statusLabel(status: SampleStatus): string {
    switch (status) {
      case SampleStatus.CREATED:
        return 'Créé';

      case SampleStatus.ACTIVE:
        return 'Actif';

      case SampleStatus.ARCHIVED:
        return 'Archivé';

      case SampleStatus.DELETED:
        return 'Supprimé';
    }
  }

  private handleError(error: HttpErrorResponse): void {
    if (error.status === 404) {
      this.error.set('Le sample demandé est introuvable.');
      return;
    }

    this.error.set(
      'Une erreur est survenue lors du chargement du sample.'
    );
  }
}