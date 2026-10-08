import type {
  OnInit} from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';

import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  Subject
} from 'rxjs';

import type {
  Sample} from '../../model/sample.model';
import {
  SampleStatus
} from '../../model/sample.model';

import { SampleService } from '../../service/sample.service';

type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-sample-list',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    FormsModule
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

  private readonly searchSubject = new Subject<string>();

  readonly search = signal('');
  readonly statusFilter = signal<SampleStatus | ''>('');
  readonly categoryFilter = signal('');
  readonly activeFilter = signal<boolean | undefined>(undefined);

  readonly sortColumn = signal('id');
  readonly sortDirection = signal<SortDirection>('desc');

  readonly SampleStatus = SampleStatus;

  readonly statuses = Object.values(SampleStatus);

  ngOnInit(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(search => {
        this.search.set(search);
        this.loadSamples(0);
      });

    this.loadSamples();
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value.trim());
  }

  loadSamples(page = this.currentPage()): void {
    this.loading.set(true);
    this.error.set(null);

    const sort =
      `${this.sortColumn()},${this.sortDirection()}`;

    this.sampleService
      .findAll(
        page,
        this.pageSize(),
        sort,
        this.search(),
        this.statusFilter() || undefined,
        this.categoryFilter() || undefined,
        this.activeFilter()
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

  applyFilters(): void {
    this.loadSamples(0);
  }

  resetFilters(): void {
    this.search.set('');
    this.statusFilter.set('');
    this.categoryFilter.set('');
    this.activeFilter.set(undefined);

    this.loadSamples(0);
  }

  sortBy(column: string): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update(direction =>
        direction === 'asc' ? 'desc' : 'asc'
      );
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }

    this.loadSamples(0);
  }

  sortSymbol(column: string): string {
    if (this.sortColumn() !== column) {
      return '↕';
    }

    return this.sortDirection() === 'asc'
      ? '↑'
      : '↓';
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