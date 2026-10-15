import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";

import { Router } from "@angular/router";

import { finalize } from "rxjs";

import { SampleForm } from "../../components/sample-form/sample-form";
import type { SampleFormValue } from "../../components/sample-form/sample-form";

import { SampleService } from "../../service/sample-service";
import type { CreateSampleRequest } from "../../model/sample";
import { PageHeader } from "../page-header/page-header";

@Component({
  selector: "app-sample-create",
  standalone: true,
  imports: [SampleForm, PageHeader],
  templateUrl: "./sample-create.html",
  styleUrl: "./sample-create.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SampleCreate {
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
      status: value.status,
    };

    this.sampleService
      .create(request)
      .pipe(
        finalize(() => {
          this.submitting.set(false);
        }),
      )
      .subscribe({
        next: (sample) => {
          void this.router.navigate(["/samples", sample.id]);
        },

        error: () => {
          this.error.set(
            "Une erreur est survenue lors de la création du sample.",
          );
        },
      });
  }
}
