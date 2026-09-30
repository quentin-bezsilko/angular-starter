import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { finalize } from 'rxjs';
import { RouterLink } from '@angular/router';

import {
  Sample,
  SampleStatus
} from '../../model/sample.model';

import { SampleService } from '../../service/sample.service';
import { DatePipe } from '@angular/common';

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

  readonly SampleStatus = SampleStatus;

  ngOnInit(): void {
    this.loadSamples();
  }

  loadSamples(): void {
    this.loading.set(true);
    this.error.set(null);

    this.sampleService
      .findAll()
      .pipe(
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe({
        next: samples => {
          this.samples.set(samples);
        },
        error: () => {
          this.error.set(
            'Une erreur est survenue lors du chargement des samples.'
          );
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
}