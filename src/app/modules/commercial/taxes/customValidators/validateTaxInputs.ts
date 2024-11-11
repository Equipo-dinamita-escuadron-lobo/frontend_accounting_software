
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Account } from '../../chart-accounts/models/ChartAccount';

export const cuentasDiferentesValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const depositAccount = control.get('depositAccount')?.value;
  const refundAccount = control.get('refundAccount')?.value;
  // Solo ejecutar la validación si ambos campos tienen valor
  if (depositAccount && refundAccount) {
    return depositAccount === refundAccount ? { cuentasIguales: true } : null;
  }

  return null; // No hay error si cualquiera de los campos es null o está vacío
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