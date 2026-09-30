import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import { finalize } from 'rxjs';

import { SampleFormComponent } from '../../components/sample-form/sample-form.component';
import { SampleFormValue } from '../../components/sample-form/sample-form.component';

import { SampleService } from '../../service/sample.service';
import { CreateSampleRequest } from '../../model/sample.model';

@Component({
  selector: 'app-sample-create',
  standalone: true,
  imports: [
    RouterLink,
    SampleFormComponent
  ],
  templateUrl: './sample-create.component.html',
  styleUrl: './sample-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleCreateComponent {

  private readonly sampleService = inject(SampleService);
  private readonly router = inject(Router);

  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);

  createSample(value: SampleFormValue): void {
  this.submitting.set(true);
  this.error.set(null);

  const request: CreateSampleRequest = {
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
  externalId: crypto.randomUUID(),
  document: value.document,
  comments: value.comments,
  status: value.status
};

  this.sampleService
    .create(request)
    .pipe(
      finalize(() => {
        this.submitting.set(false);
      })
    )
    .subscribe({
      next: sample => {
        void this.router.navigate([
          '/samples',
          sample.id
        ]);
      },

      error: () => {
        this.error.set(
          'Une erreur est survenue lors de la création du sample.'
        );
      }
    });
  }

}