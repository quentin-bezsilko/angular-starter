import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { finalize } from 'rxjs';

import {
  Sample,
  SampleStatus
} from '../../model/sample.model';

import { SampleService } from '../../service/sample.service';

@Component({
  selector: 'app-sample-list',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe
  ],
  templateUrl: './sample-list.component.html',
  styleUrl: './sample-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleListComponent implements OnInit {

  private readonly sampleService = inject(SampleService);

  readonly samples = signal<Sample[]>([]);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly totalElements = signal(0);
  readonly totalPages = signal(0);
  readonly currentPage = signal(0);
  readonly pageSize = signal(8);

  readonly SampleStatus = SampleStatus;

  ngOnInit(): void {
    this.loadSamples();
  }

  loadSamples(page = this.currentPage()): void {
    this.loading.set(true);
    this.error.set(null);

    this.sampleService
      .findAll(
        page,
        this.pageSize(),
        'id,asc'
      )
      .pipe(
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe({
        next: response => {
          this.samples.set(response.content);
          this.currentPage.set(response.number);
          this.pageSize.set(response.size);
          this.totalPages.set(response.totalPages);
          this.totalElements.set(response.totalElements);
        },
        error: () => {
          this.error.set(
            'Une erreur est survenue lors du chargement des samples.'
          );
        }
      });
  }

  previousPage(): void {
    if (this.currentPage() > 0) {
      this.loadSamples(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() + 1 < this.totalPages()) {
      this.loadSamples(this.currentPage() + 1);
    }
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
}