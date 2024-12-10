import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Tax } from '../../models/Tax';
import { TaxService } from '../../services/tax.service';
import { ChartAccountService } from '../../../chart-accounts/services/chart-account.service';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { Account } from '../../../chart-accounts/models/ChartAccount';
import { buttonColors } from '../../../../../shared/buttonColors';
import { collectLeaves, cuentasDiferentesValidator } from '../../customValidators/validateTaxInputs';
import { map } from 'rxjs';



@Component({
  selector: 'app-edit-tax',
  templateUrl: './edit-tax.component.html',
  styleUrl: './edit-tax.component.css'
})
export class EditTaxComponent {

  taxId: number = 0;
  taxCode: string = "";
  tax: Tax = {} as Tax
  editForm: FormGroup;
  depositAccounts: Account[] | undefined;
  refundAccounts: Account[] | undefined;
  selectedAccount: Account | null = null;
  selectedRefundAccount: Account | null = null;
  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
  entData: any | null = null;

  accounts: any[] = [];
  filterAccount: string = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private taxService: TaxService,
    private chartAccountService: ChartAccountService,

  ) {
    this.accounts = [];
    this.editForm = this.formBuilder.group({
      code: ['', Validators.required],
      description: ['', Validators.required],
      interest: [null, [Validators.required, Validators.min(0)]],
      depositAccount: [null, Validators.required],
      refundAccount: [null, Validators.required]
    }, { validators: cuentasDiferentesValidator });
  }

  ngOnInit(): void {
    this.entData = this.localStorageMethods.loadEnterpriseData();
    this.getCuentas();
    this.route.params.subscribe(params => {
      this.taxCode = params['id'];
      this.getTaxDetails();
    });
    this.initializePercentage();
  }

  /**
   * Obtiene los detalles de un impuesto a partir del código de impuesto y la empresa asociada.
   * Si la solicitud es exitosa, se actualiza el formulario con los detalles del impuesto.
   * Si el impuesto tiene cuentas asociadas (depósito o reembolso), se obtienen también los detalles de esas cuentas.
   * En caso de error, se muestra un mensaje de error.
   * 
   * @returns void
   */
  getTaxDetails(): void {
    this.taxService.getTaxById(this.taxCode, this.entData).subscribe(
      (tax: any) => {
        this.tax = tax;
        this.taxId = tax.id;
        this.editForm.patchValue({
          code: tax.code,
          description: tax.description,
          interest: tax.interest,
        });
        if (tax.depositAccount) {
          this.getCuentabycode(tax.depositAccount);
        }
        if (tax.refundAccount) {
          this.getCuentabycode(tax.refundAccount);
        }
      },
      error => {
        Swal.fire({
          title: 'Error',
          text: 'Error obteniendo detalles del impuesto.',
          confirmButtonColor: buttonColors.confirmationColor,
          icon: 'error',
        });
      }
    );
  }


  /**
 * Obtiene los detalles de una cuenta utilizando su código y la empresa asociada.
 * Si la cuenta se encuentra, se actualiza el formulario con la información de la cuenta.
 * Si no se encuentra la cuenta o ocurre un error, se muestra un mensaje de error.
 * 
 * @param code - El código de la cuenta a buscar.
 * @returns void
 */
  getCuentabycode(code: string): void {
    this.chartAccountService.getAccountByCode(code, this.entData).subscribe(
      account => {
        if (account) {
          this.updateAccountInForm(account);
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Cuenta no encontrada.',
            confirmButtonColor: buttonColors.confirmationColor,
            icon: 'error',
          });
        }
      },
      error => {
        Swal.fire({
          title: 'Error',
          text: 'Error al buscar la cuenta por código.',
          confirmButtonColor: buttonColors.confirmationColor,
          icon: 'error',
        });
      }
    );
  }


  /**
 * Actualiza el formulario con los detalles de la cuenta proporcionada, asignando el ID de la cuenta a los campos correspondientes.
 * Si la cuenta coincide con la cuenta de depósito o de reembolso del impuesto, se actualiza el valor en el formulario.
 * 
 * @param account - La cuenta cuyo ID se utilizará para actualizar el formulario.
 * @returns void
 */
  updateAccountInForm(account: Account): void {
    if (account) {
      if (this.tax.depositAccount === account.code) {
        this.editForm.patchValue({
          depositAccount: account.id
        });
      }
      if (this.tax.refundAccount === account.code) {
        this.editForm.patchValue({
          refundAccount: account.id
        });
      }
    }
  }


  /**
 * Obtiene la lista de cuentas y las procesa para obtener las cuentas de depósito y reembolso.
 * Mapea las cuentas a una lista, luego recoge las hojas (últimos hijos) y las asigna a las variables correspondientes.
 * En caso de error, se muestra un mensaje de error.
 * 
 * @returns void
 */
  getCuentas(): void {
    this.chartAccountService.getListAccounts(this.entData).pipe(
      map(dataArray => {
        this.accounts = this.mapAccountToList(dataArray);
        const allLeaves: Account[] = [];
        // Aplicar la función a cada elemento del array
        dataArray.forEach((item: Account) => collectLeaves(item, allLeaves));
        return allLeaves; // Regresar el nuevo arreglo con los últimos hijos
      })
    ).subscribe(
      (data: any[]) => {
        this.depositAccounts = data;
        this.refundAccounts = data;
      },
      error => {
        Swal.fire({
          title: 'Error',
          text: 'Ha ocurrido un error obteniendo cuentas de depósito.',
          confirmButtonColor: buttonColors.confirmationColor,
          icon: 'error',
        });
      }
    );
  }

  /**
 * Mapea una lista de cuentas a una nueva lista, eliminando la propiedad de hijos de cada cuenta.
 * 
 * @param data - Lista de cuentas que se van a procesar.
 * @returns Una nueva lista de cuentas sin la propiedad 'children'.
 */
  mapAccountToList(data: Account[]): Account[] {
    let result: Account[] = [];

    function traverse(account: Account) {
      let { children, ...accountWithoutChildren } = account;
      result.push(accountWithoutChildren as Account);

      if (children && children.length > 0) {
        children.forEach(child => traverse(child));
      }
    }

    data.forEach(account => traverse(account));
    return result;
  }
  /**
 * Filtra la lista de cuentas basándose en el código y la descripción de cada cuenta.
 * 
 * @returns Una lista de cuentas que contienen el filtro en su código o descripción.
 */
  get filteredAccounts() {
    if (this.accounts) {
      return this.accounts.filter(account =>
        `${account.code} - ${account.description}`.toLowerCase().includes(this.filterAccount.toLowerCase())
      );
    }
    return [];
  }

  /**
 * Realiza una búsqueda personalizada para verificar si el término de búsqueda está presente en el código o la descripción del elemento.
 * 
 * @param term - El término de búsqueda en minúsculas.
 * @param item - El elemento que se va a comparar, que debe tener las propiedades 'code' y 'description'.
 * @returns `true` si el término está presente en el código o la descripción del elemento, de lo contrario `false`.
 */
  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    return item.code.toLowerCase().includes(term) || item.description.toLowerCase().includes(term);
  }


  /**
 * Retorna un objeto con las validaciones predeterminadas para los campos de búsqueda de categorías.
 * 
 * @returns Un objeto con una propiedad 'stringSearchCategory' que es un array vacío.
 */
  validationsAll() {
    return {
      stringSearchCategory: [''],
    };
  }

  /**
 * Obtiene el código de cuenta correspondiente a un ID de cuenta.
 * 
 * @param id - El ID de la cuenta que se busca.
 * @returns El código de la cuenta si se encuentra, o 'No encontrado' si no se encuentra la cuenta.
 */
  getAccountCode(id: number): string {
    const account = this.accounts.find(cuenta => cuenta.id === id);
    return account ? account.code : 'No encontrado';
  }

    /**
   * Maneja el envío del formulario para editar un impuesto.
   * Valida el formulario, verifica si el impuesto ya existe con el mismo código y, en caso afirmativo, muestra un mensaje de error.
   * Si el impuesto no existe, lo actualiza y muestra una notificación de éxito.
   * En caso de error, se muestra un mensaje de error.
   * 
   * @returns void
   */
  onSubmit(): void {
    if (this.editForm.valid) {
      const updatedTax: Tax = {
        ...this.editForm.value,
        id: this.taxId,
        idEnterprise: this.entData,
        code: this.editForm.value.code,
        description: this.editForm.value.description,
        interest: this.editForm.value.interest,
        depositAccount: this.getAccountCode(this.editForm.value.depositAccount),
        refundAccount: this.getAccountCode(this.editForm.value.refundAccount)
      }
      this.taxService.getTaxById(updatedTax.code, updatedTax.idEnterprise).subscribe(
        (response: Tax) => {
          if (response && response.id !== updatedTax.id) {
            Swal.fire({
              title: 'Error',
              text: 'Ya existe un impuesto con ese código.',
              confirmButtonColor: buttonColors.confirmationColor,
              icon: 'error',
            });
          } else {
            this.taxService.updateTax(updatedTax).subscribe(
              () => {
                Swal.fire({
                  title: 'Edición exitosa',
                  text: 'Se ha editado el impuesto exitosamente.',
                  confirmButtonColor: buttonColors.confirmationColor,
                  icon: 'success',
                });
                this.router.navigate(['/general/operations/taxes']);
              },
              error => {
                Swal.fire({
                  title: 'Error',
                  text: 'Ha ocurrido un error al editar el impuesto.',
                  confirmButtonColor: buttonColors.confirmationColor,
                  icon: 'error',
                });
              }
            );
          }
        },
        error => {
          this.taxService.updateTax(updatedTax).subscribe(
            () => {
              Swal.fire({
                title: 'Edición exitosa',
                text: 'Se ha editado el impuesto exitosamente.',
                confirmButtonColor: buttonColors.confirmationColor,
                icon: 'success',
              });
              this.router.navigate(['/general/operations/taxes']);
            },
            updateError => {
              Swal.fire({
                title: 'Error',
                text: 'Ha ocurrido un error al editar el impuesto.',
                confirmButtonColor: buttonColors.confirmationColor,
                icon: 'error',
              });
            }
          );
        }
      );
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, completa correctamente el formulario antes de enviarlo.',
        icon: 'error',
        confirmButtonColor: buttonColors.confirmationColor,
      });
    }
  }


    /**
   * Redirige a la página de detalles del impuesto utilizando el ID del impuesto.
   * 
   * @returns void
   */
  redirectToDetails(): void {
    this.router.navigate(['/tax/details', this.taxId]);
  }

    /**
   * Navega de vuelta a la lista de impuestos.
   * 
   * @returns void
   */
  goBack(): void {
    this.router.navigate(['/general/operations/taxes']);
  }

    /**
   * Formatea el valor ingresado en el campo de porcentaje, asegurándose de que solo contenga números y un punto decimal.
   * Si el valor es válido, se agrega el símbolo de porcentaje al final del valor y se actualiza el formulario.
   * Si el campo está vacío, se establece el valor del formulario en `null`.
   * 
   * @param event - El evento que contiene el valor ingresado en el campo de entrada.
   * @returns void
   */
  formatPercentage(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9.]/g, '');

    if (value) {
      this.editForm.get('interest')?.setValue(parseFloat(value), { emitEvent: false });

      input.value = value + '%';

      input.setSelectionRange(value.length, value.length);
    } else {
      this.editForm.get('interest')?.setValue(null, { emitEvent: false });
    }
  }

    /**
   * Inicializa el campo de interés con el formato de porcentaje, agregando el símbolo '%' al valor si ya existe uno.
   * 
   * @returns void
   */
  initializePercentage(): void {
    const interestControl = this.editForm.get('interest');
    if (interestControl?.value) {
      interestControl.setValue(`${interestControl.value}%`, { emitEvent: false });
    }
  }
}