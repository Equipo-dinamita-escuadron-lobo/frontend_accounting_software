import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const cuentasDiferentesValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const depositAccount = control.get('depositAccount')?.value;
  const refundAccount = control.get('refundAccount')?.value;

  return depositAccount === refundAccount
    ? { cuentasIguales: true }
    : null;
};
