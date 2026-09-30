import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { finalize } from 'rxjs';

import {
  Sample,
  UpdateSampleRequest
} from '../../model/sample.model';

import {
  SampleFormComponent,
  SampleFormValue
} from '../../components/sample-form/sample-form.component';

import { SampleService } from '../../service/sample.service';

@Component({
  selector: 'app-sample-edit',
  standalone: true,
  imports: [
    RouterLink,
    SampleFormComponent
  ],
  templateUrl: './sample-edit.component.html',
  styleUrl: './sample-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleEditComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sampleService = inject(SampleService);

  readonly sample = signal<Sample | null>(null);

  readonly loading = signal(false);
  readonly submitting = signal(false);

  readonly error = signal<string | null>(null);

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

  updateSample(value: SampleFormValue): void {
    const sample = this.sample();

    if (!sample) {
      return;
    }

    if (sample.version === null) {
      this.error.set(
        'Impossible de modifier ce sample : version manquante.'
      );
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    const request: UpdateSampleRequest = {
      name: value.name,
      description: value.description,
      quantity: value.quantity!,
      stock: value.stock,
      weight: value.weight,
      ratio: value.ratio,
      price: value.price!,
      active: value.active,
      category: value.category,
      manufacturedDate: value.manufacturedDate,
      manufacturedTime: value.manufacturedTime,
      externalId: sample.externalId,
      document: value.document,
      comments: value.comments,
      status: value.status,
      version: sample.version
    };

    this.sampleService
      .update(sample.id, request)
      .pipe(
        finalize(() => {
          this.submitting.set(false);
        })
      )
      .subscribe({
        next: updatedSample => {
          void this.router.navigate([
            '/samples',
            updatedSample.id
          ]);
        },

        error: (error: HttpErrorResponse) => {
          this.handleUpdateError(error);
        }
      });
  }

  private loadSample(id: number): void {
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
          this.handleLoadError(error);
        }
      });
  }

  private handleLoadError(
    error: HttpErrorResponse
  ): void {

    if (error.status === 404) {
      this.error.set(
        'Le sample demandé est introuvable.'
      );
      return;
    }

    this.error.set(
      'Une erreur est survenue lors du chargement du sample.'
    );
  }

  private handleUpdateError(
    error: HttpErrorResponse
  ): void {

    if (error.status === 404) {
      this.error.set(
        'Le sample demandé est introuvable.'
      );
      return;
    }

    if (error.status === 409) {
      this.error.set(
        'Ce sample a été modifié par un autre utilisateur. ' +
        'Rechargez la page avant de réessayer.'
      );
      return;
    }

    if (error.status === 400) {
      this.error.set(
        'Certaines données sont invalides. Vérifiez le formulaire.'
      );
      return;
    }

    this.error.set(
      'Une erreur est survenue lors de la modification du sample.'
    );
  }
}