import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { TaxService } from '../../services/tax.service';
import { Tax } from '../../models/Tax';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { ChartAccountService } from '../../../chart-accounts/services/chart-account.service';
import { Account } from '../../../chart-accounts/models/ChartAccount';
import { buttonColors } from '../../../../../shared/buttonColors';

@Component({
  selector: 'app-list-tax',
  templateUrl: './list-tax.component.html',
  styleUrls: ['./list-tax.component.css']
})
export class ListTaxComponent implements OnInit {

  taxes: Tax[] = [];
  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
  entData: any | null = null;
  accounts: any[] = [];

  columns: any[] = [
    { title: 'Código', data: 'code' },
    { title: 'Descripción', data: 'description' },
    { title: 'Tarifa', data: 'interest' },
    { title: 'Cuenta', data: 'depositAccount' },
    { title: 'Cuenta Devolución', data: 'refundAccount' },
    { title: 'Acciones', data: 'actions' }
  ];

  selectedTaxId: number | null = null;
  timer: any;

  constructor(
    private taxService: TaxService,
    private router: Router,
    private dialog: MatDialog,
    private chartAccountService: ChartAccountService,

  ) {
    this.accounts = [];

  }

  ngOnInit(): void {
    this.entData = this.localStorageMethods.loadEnterpriseData();
    this.getTaxes();
    this.getCuentas();


  }

  /**
 * Obtiene la lista de cuentas y las mapea a una lista sin la propiedad 'children'.
 * En caso de error, muestra un mensaje de error en la consola.
 * 
 * @returns void
 */
  getCuentas(): void {
    this.chartAccountService.getListAccounts(this.entData).subscribe(
      (data: any[]) => {
        this.accounts = this.mapAccountToList(data);
      },
      error => {
        console.log('Error al obtener las cuentas:', error);
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
 * Obtiene la lista de impuestos y los ordena alfabéticamente por el código del impuesto.
 * En caso de error, muestra un mensaje de error en la consola.
 * 
 * @returns void
 */
  getTaxes(): void {
    this.taxService.getTaxes(this.entData).subscribe(
      (data: Tax[]) => {
        this.taxes = data.sort((a, b) => {
          const codeA = String(a.code).toLowerCase();
          const codeB = String(b.code).toLowerCase();
          return codeA.localeCompare(codeB);
        });
      },
      (error) => {
        console.error('Error al obtener los impuestos:', error);
      }
    );
  }


  /**
 * Redirige a una ruta específica dentro de la aplicación.
 * 
 * @param route - La ruta a la que se desea redirigir.
 * @returns void
 */
  redirectTo(route: string): void {
    this.router.navigateByUrl(route);
  }

  /**
 * Redirige a la página de edición de un impuesto específico utilizando su ID.
 * 
 * @param taxId - El ID del impuesto que se va a editar.
 * @returns void
 */
  redirectToEdit(taxId: string): void {
    this.router.navigate(['/general/operations/taxes/edit/', taxId]);
  }


  /**
 * Muestra un cuadro de diálogo de confirmación utilizando SweetAlert2 para confirmar la eliminación de un impuesto.
 * Si el usuario confirma, se procede a eliminar el impuesto y actualizar la lista de impuestos.
 * Si ocurre un error durante la eliminación, se muestra un mensaje de error.
 *
 * @param taxId - El ID del impuesto que se desea eliminar.
 */
  redirectToDelete(taxId: number): void {
    // Utilizando SweetAlert para mostrar un cuadro de diálogo de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Estás seguro de que deseas eliminar este impuesto?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: buttonColors.confirmationColor,
      cancelButtonColor: buttonColors.cancelButtonColor,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      // Si el usuario confirma la eliminación
      if (result.isConfirmed) {
        this.taxService.deleteTax(taxId).subscribe(
          () => {
            //console.log('Impuesto eliminado con éxito');
            this.getTaxes(); // Actualizar la lista de impuestos
            Swal.fire({
              title: 'Eliminado con éxito',
              text: 'Se ha eliminado el impuesto con éxito.',
              icon: 'success',
              confirmButtonColor: buttonColors.confirmationColor,
              confirmButtonText: 'Aceptar'
            });
          },
          (error) => {
            //console.error('Error al eliminar el impuesto:', error);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar el impuesto.',
              icon: 'error',
              confirmButtonColor: buttonColors.confirmationColor,
              confirmButtonText: 'Aceptar'
            });
          }
        );
      }
    });
  }


  /**
   * Navega de vuelta a la lista de impuestos.
   * 
   * @returns void
   */
  goBack(): void {
    this.router.navigate(['/general/operation/taxes']);
  }
}