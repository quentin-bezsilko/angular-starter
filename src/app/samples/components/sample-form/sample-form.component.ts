import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output
} from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Sample,
  SampleStatus
} from '../../model/sample.model';

import { sampleValidator, pastOrPresentValidator, positiveValidator, maxTwoDecimalsValidator } from '../../validator/sample-form.validator';

export interface SampleFormValue {
  name: string;
  description: string | null;
  quantity: number | null;
  stock: number | null;
  weight: number | null;
  ratio: number | null;
  price: number | null;
  active: boolean;
  category: string;
  manufacturedDate: string | null;
  manufacturedTime: string | null;
  document: string;
  comments: string | null;
  status: SampleStatus;
}

@Component({
  selector: 'app-sample-form',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './sample-form.component.html',
  styleUrl: './sample-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SampleFormComponent {

  readonly initialValue = input<Sample | null>(null);
  readonly submitting = input(false);

  readonly formSubmit = output<SampleFormValue>();

  readonly statuses = Object.values(SampleStatus);

  constructor() {
    effect(() => {
      const sample = this.initialValue();

      if (!sample) {
        return;
      }

      this.form.patchValue({
        name: sample.name,
        description: sample.description,
        quantity: sample.quantity,
        stock: sample.stock,
        weight: sample.weight,
        ratio: sample.ratio,
        price: sample.price,
        active: sample.active,
        category: sample.category,
        manufacturedDate: sample.manufacturedDate,
        manufacturedTime: sample.manufacturedTime,
        document: sample.document,
        comments: sample.comments,
        status: sample.status
      });

      this.form.markAsPristine();
      this.form.markAsUntouched();
    });
  }

  readonly form = new FormGroup(
    {
      name: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[A-Za-z0-9_-]+$/)
        ]
      }),

      description: new FormControl<string | null>(null, [
        Validators.maxLength(500)
      ]),

      quantity: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(1),
        Validators.max(100000)
      ]),

      stock: new FormControl<number | null>(null, [
        Validators.min(0)
      ]),

      weight: new FormControl<number | null>(null, [
        positiveValidator,
        Validators.max(1000)
      ]),

      ratio: new FormControl<number | null>(null, [
        Validators.min(0),
        Validators.max(1)
      ]),

      price: new FormControl<number | null>(null, [
        Validators.required,
        Validators.min(0.01),
        maxTwoDecimalsValidator
      ]),

      active: new FormControl(false, {
        nonNullable: true,
        validators: [
          Validators.required
        ]
      }),

      category: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(1)
        ]
      }),

      manufacturedDate: new FormControl<string | null>(null),

      manufacturedTime: new FormControl<string | null>(null),

      document: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required
        ]
      }),

      comments: new FormControl<string | null>(null, [
        Validators.maxLength(5000)
      ]),

      status: new FormControl(SampleStatus.CREATED, {
        nonNullable: true,
        validators: [
          Validators.required
        ]
      })
    },
    {
      validators: [
        sampleValidator,
        pastOrPresentValidator('manufacturedDate')
      ]
    }
  );

  submit(): void {
    console.log('SUBMIT');
    console.log('Form valid:', this.form.valid);
    console.log('Form errors:', this.form.errors);
    console.log('Form value:', this.form.getRawValue());

    Object.entries(this.form.controls).forEach(([name, control]) => {
      if (control.invalid) {
        console.log(
          `Control invalide: ${name}`,
          control.errors,
          control.value
        );
      }
    });

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log('EMIT');

    this.formSubmit.emit(
      this.form.getRawValue()
    );
  }

  hasError(
    field: keyof SampleFormValue,
    error: string
  ): boolean {
    const control = this.form.get(field);
    return !!(control?.touched && control.hasError(error));
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    const file = input.files?.[0];

    if (!file) {
      this.form.controls.document.setValue('');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== 'string') {
        return;
      }
      const base64 = result.split(',')[1];
      this.form.controls.document.setValue(base64);
      this.form.controls.document.markAsTouched();
      this.form.controls.document.updateValueAndValidity();
    };

    reader.readAsDataURL(file);
  }
}