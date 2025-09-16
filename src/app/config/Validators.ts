import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const newPass = control.get('new')?.value;
  const newPass2 = control.get('new2')?.value;

  return newPass && newPass2 && newPass !== newPass2 ? { passwordMismatch: true } : null;
};