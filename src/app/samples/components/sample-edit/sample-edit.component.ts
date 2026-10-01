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

interface VersionConflictError {
  title?: string;
  detail?: string;
  status?: number;
  resourceId?: number;
  requestedVersion?: number;
  currentVersion?: number;
}

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

  readonly versionConflict = signal(false);

  readonly versionConflictMessage =
    signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!Number.isInteger(id) || id <= 0) {
      this.error.set(
        'Identifiant du sample invalide.'
      );
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
    this.clearVersionConflict();

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

      // Version du Sample qui a été chargé.
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
          /*
           * Le backend renvoie désormais la nouvelle
           * version Hibernate.
           */
          this.sample.set(updatedSample);

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

  reloadAfterConflict(): void {
    const sample = this.sample();

    if (!sample) {
      return;
    }

    this.loadSample(sample.id);
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
          /*
           * SampleFormComponent observe initialValue
           * et repatche lui-même son formulaire.
           */
          this.sample.set(sample);

          this.clearVersionConflict();
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
      this.handleVersionConflict(error);
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

  private handleVersionConflict(
    error: HttpErrorResponse
  ): void {
    const conflict =
      error.error as VersionConflictError | null;

    this.versionConflict.set(true);

    this.versionConflictMessage.set(
      conflict?.detail ??
      'Ce sample a été modifié par un autre utilisateur depuis son chargement.'
    );
  }

  private clearVersionConflict(): void {
    this.versionConflict.set(false);
    this.versionConflictMessage.set(null);
  }
}