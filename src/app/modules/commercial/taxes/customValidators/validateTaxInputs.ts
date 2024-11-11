
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Account } from '../../chart-accounts/models/ChartAccount';

export const cuentasDiferentesValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const depositAccount = control.get('depositAccount')?.value;
  const refundAccount = control.get('refundAccount')?.value;

  return depositAccount === refundAccount
    ? { cuentasIguales: true }
    : null;
};


  // Función recursiva para obtener el último hijo o el padre si no tiene hijos
  export const collectLeaves=(item: Account, leaves: Account[]): Account[] => {
    if (item.children && item.children.length > 0) {
      // Recorrer todos los hijos
      item.children.forEach(child => collectLeaves(child, leaves));
    } else {
      // Si no hay hijos, agregar el nodo actual a la lista de hojas
      leaves.push(item);
    }
    return leaves;
  }