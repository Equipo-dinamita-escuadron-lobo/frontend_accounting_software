import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Tax } from '../../models/Tax';
import { TaxService } from '../../services/tax.service';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { ChartAccountService } from '../../../chart-accounts/services/chart-account.service';
import { Account } from '../../../chart-accounts/models/ChartAccount';
import { buttonColors } from '../../../../../shared/buttonColors';
import { collectLeaves, cuentasDiferentesValidator } from '../../customValidators/validateTaxInputs';
import { map } from 'rxjs';
@Component({
  selector: 'app-create-tax',
  templateUrl: './create-tax.component.html',
  styleUrl: './create-tax.component.css'
})
export class CreateTaxComponent {
  taxId: number = 0;
  tax: Tax = {} as Tax
  addForm: FormGroup;
  depositAccounts: any[] = [];
  refundAccounts: any[] = [];
  selectedAccount: any;
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

    this.addForm = this.formBuilder.group({
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
  }

  /**
   * Obtiene las cuentas que se podrían usar como cuenta de depósito o devolución
   * para el impuesto.
   *
   * Realiza una petición GET a la API para obtener el listado de cuentas,
   * y luego los procesa para obtener las últimas hojas (los últimos hijos)
   * de cada una de las cuentas. Estas cuentas son las que se podrían usar
   * como cuenta de depósito o devolución.
   *
   * @returns void
   */
  getCuentas(): void {
    this.chartAccountService.getListAccounts(this.entData).pipe(
      map(dataArray => {
        this.accounts = this.mapAccountToList(dataArray);
        const allLeaves:Account[] = [];
        // Aplicar la función a cada elemento del array
        dataArray.forEach((item:Account) => collectLeaves(item, allLeaves));
        return allLeaves; // Regresar el nuevo arreglo con los últimos hijos
      })
    ).subscribe(
      (data: any[]) => {
        this.depositAccounts = data;
        this.refundAccounts = data;
      },
      error => {
        console.error('Error obteniendo cuentas de depósito:', error);
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
      // Clonamos el objeto cuenta sin los hijos
      let { children, ...accountWithoutChildren } = account;
      result.push(accountWithoutChildren as Account);

      // Llamamos recursivamente para cada hijo
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
   * Maneja el envío del formulario para agregar un nuevo impuesto.
   * Valida el formulario, verifica si el impuesto ya existe y, en caso afirmativo, muestra un mensaje de error.
   * Si el impuesto no existe, lo crea y muestra una notificación de éxito.
   * Si ocurre un error durante el proceso de creación, se muestra un mensaje de error.
   * 
   * @returns void
   */
  onSubmit(): void {
    if (this.addForm.valid) {
      const createdTax: Tax = {
        ...this.addForm.value,
        idEnterprise: this.entData,
        code: this.addForm.value.code,
        description: this.addForm.value.description,
        interest: this.addForm.value.interest,
        depositAccount: this.getAccountCode(this.addForm.value.depositAccount),
        refundAccount: this.getAccountCode(this.addForm.value.refundAccount)
      };
      this.taxService.getTaxById(createdTax.code, createdTax.idEnterprise).subscribe(
        (response: Tax) => {
          if (response) {
            Swal.fire({
              title: 'Error',
              text: 'Ya existe un impuesto con ese código.',
              confirmButtonColor: buttonColors.confirmationColor,
              icon: 'error',
            });
            return;
          }
          else {
            this.taxService.createTax(createdTax).subscribe(
              (response: Tax) => {
                Swal.fire({
                  title: '¡Impuesto agregado!',
                  text: 'Se agregó el impuesto exitosamente.',
                  confirmButtonColor: buttonColors.confirmationColor,
                  icon: 'success',
                });
                this.router.navigate(['/general/operations/taxes']);
              },
              (error) => {
                Swal.fire({
                  title: 'Error',
                  text: 'Ha ocurrido un error al agregar el impuesto.',
                  confirmButtonColor: buttonColors.confirmationColor,
                  icon: 'error',
                });
              }
            )
          }
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
      this.addForm.get('interest')?.setValue(parseFloat(value), { emitEvent: false });
      input.value = value + '%';
      input.setSelectionRange(value.length, value.length);
    } else {
      this.addForm.get('interest')?.setValue(null, { emitEvent: false });
    }
  }

}