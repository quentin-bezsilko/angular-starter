import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

import { SampleStatus } from '../model/sample.model';

export const sampleValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {

  const active = control.get('active')?.value as boolean | null;
  const stock = control.get('stock')?.value as number | null;
  const weight = control.get('weight')?.value as number | null;
  const category = control.get('category')?.value as string | null;
  const status = control.get('status')?.value as SampleStatus | null;

  const errors: ValidationErrors = {};

  if (active === true && (stock === null || stock <= 0)) {
    errors['activeRequiresStock'] = true;
  }

  if (
    status === SampleStatus.DELETED &&
    stock !== null &&
    stock > 0
  ) {
    errors['deletedCannotHaveStock'] = true;
  }

  if (
    weight !== null &&
    weight > 500 &&
    category !== 'H'
  ) {
    errors['heavyRequiresCategoryH'] = true;
  }

  return Object.keys(errors).length > 0
    ? errors
    : null;
};

export const pastOrPresentValidator = (
  controlName: string
): ValidatorFn => {

  return (
    form: AbstractControl
  ): ValidationErrors | null => {

    const value = form.get(controlName)?.value as string | null;

    if (!value) {
      return null;
    }

    const now = new Date();

    const today =
      `${now.getFullYear()}-` +
      `${String(now.getMonth() + 1).padStart(2, '0')}-` +
      `${String(now.getDate()).padStart(2, '0')}`;

    return value > today
      ? { futureDate: true }
      : null;
  };
};

export function positiveValidator(
  control: AbstractControl
): ValidationErrors | null {

  const value = control.value;

  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null;
  }

  return Number(value) > 0
    ? null
    : { positive: true };
};

export function maxTwoDecimalsValidator(
  control: AbstractControl
): ValidationErrors | null {

  const value = control.value;

  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null;
  }

  return /^\d{1,13}(\.\d{1,2})?$/.test(
    String(value)
  )
    ? null
    : { decimalFormat: true };
};