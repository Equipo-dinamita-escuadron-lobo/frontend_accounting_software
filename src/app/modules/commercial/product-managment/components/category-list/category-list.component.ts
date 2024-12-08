import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { Account } from '../../../chart-accounts/models/ChartAccount';
import { ChartAccountService } from '../../../chart-accounts/services/chart-account.service';
import { Category } from '../../models/Category';
import { CategoryService } from '../../services/category.service';
import { CategoryDetailsComponent } from '../category-details/category-details.component';
import { buttonColors } from '../../../../../shared/buttonColors';
import { TaxService } from '../../../taxes/services/tax.service';
import { Tax } from '../../../taxes/models/Tax';

/**
 * Componente para listar las categorías
 */
@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
})
export class CategoryListComponent implements OnInit {
  /**
   * Variables del componente
   */
  categories: Category[] = []; // Variable para almacenar las categorías
  accounts: any[] = []; // Variable para almacenar las cuentas
  taxes: Tax[] = [];  // Variable para almacenar los impuestos

  localStorageMethods: LocalStorageMethods = new LocalStorageMethods(); // Variable para almacenar los métodos de almacenamiento local
  entData: any | null = null; // Variable para almacenar los datos de la empresa

  // Variables para la tabla
  displayedColumns: string[] = ['id', 'name', 'description', 'inventory', 'cost', 'sale', 'return', 'tax', 'actions'];
  dataSource = new MatTableDataSource<Category>(this.categories);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  /**
   * Método para aplicar un filtro en la tabla
   * @param event 
   */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  form: FormGroup;

  //variables para el doble clic
  selectedCategoryId: string | null = null;
  timer: any;
  dialog: any;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private chartAccountService: ChartAccountService,
    private taxService: TaxService,

    private fb: FormBuilder  ) {
    this.form = this.fb.group(this.validationsAll());
    this.accounts = [];
  }

  validationsAll() {
    return {
      stringSearchCategory: [''],
    };
  }

  /**
   * Método para inicializar el componente
   */
  async ngOnInit(): Promise<void> {
    this.entData = this.localStorageMethods.loadEnterpriseData();
    if (this.entData) {
      this.getCategories();
      this.getCuentas();
      await this.getTaxes();
      

    }
  }

  /**
   * Método para obtener los impuestos
   */
  async getTaxes() {
    this.entData = this.localStorageMethods.loadEnterpriseData();
    this.taxService.getTaxes(this.entData).subscribe(
      (data: Tax[]) => {
        this.taxes = data  
        console.log(this.categories);
      },
    );
  }
  
  /**
   * Método para obtener las cuentas
   * @returns void
   * @example getCuentas()
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
   * Método para mapear las cuentas a una lista
   * @param data 
   * @returns Account[]
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
   * Método para obtener el nombre de una cuenta
   * @param id 
   * @returns string
   * @example getCategoryName(1)
   */
  getCategoryName(id: number): string {
    const account = this.accounts.find(cuenta => cuenta.id === id);
    return account ? account.description : 'No encontrado';
  }

  /**
   * Método para obtener el nombre de un impuesto
   * @param id 
   * @returns
   * @example getTax(1)
   */
  getTax(id: number){
    const tax = this.taxes.find(tax => tax.id === id);
    return tax?.code;
  }

  /**
   * Método para obtener todas las categorías
   */
  getCategories(): void {
    this.categoryService.getCategories(this.entData).subscribe(
      (data: Category[]) => {
        this.categories = data;
        this.dataSource = new MatTableDataSource<Category>(this.categories);
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.log('Error al obtener las categorías:', error);
      }
    );
  }

  /**
   * Método para redirigir a una ruta
   * @param route 
   */
  redirectTo(route: string): void {
    this.router.navigateByUrl(route);
  }

  /**
   * Método para redirigir a la página de edición
   * @param categoryId 
   */
  redirectToEdit(categoryId: string): void {
    if (this.selectedCategoryId === categoryId) {
      // Doble clic, navegar a la página de edición
      this.router.navigate([
        '/general/operations/categories/edit/',
        categoryId,
      ]);
      // Reiniciar el temporizador y el ID del producto seleccionado
      clearTimeout(this.timer);
      this.selectedCategoryId = null;
    } else {
      // Primer clic, iniciar el temporizador
      this.selectedCategoryId = categoryId;
      this.timer = setTimeout(() => {
        // Limpiar el temporizador si pasa un tiempo después del primer clic
        clearTimeout(this.timer);
        this.selectedCategoryId = null;
      }, 300); // Tiempo en milisegundos para considerar un doble clic
    }
  }

  /**
   * Método para regresar
   */
  goBack(): void {
    this.router.navigate(['/general/operations/products']);
  }

  /**
   * Método para eliminar una categoría
   * @param categoryId 
   */
  deleteCategory(categoryId: string): void {
    // Utilizando SweetAlert para mostrar un cuadro de diálogo de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Estás seguro de que deseas eliminar esta categoría?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: buttonColors.confirmationColor,
      cancelButtonColor: buttonColors.cancelButtonColor,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      // Si el usuario confirma la eliminación
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(categoryId).subscribe(
          (data: Category) => {
            console.log('Categoría eliminada con éxito: ', data);
            this.getCategories();
            // Mostrar cuadro de diálogo de éxito
            Swal.fire({
              title: 'Eliminada con éxito',
              text: 'La categoría se ha eliminado correctamente.',
              icon: 'success',
              confirmButtonColor: buttonColors.confirmationColor,
              confirmButtonText: 'Aceptar'
            });
          },
          (error) => {
            console.error('Error al eliminar la categoría: ', error);
            // Mostrar cuadro de diálogo de error
            Swal.fire({
              title: 'Error al eliminar',
              text: 'Ha ocurrido un error al intentar eliminar la categoría.',
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
   * Método para abrir un modal con los detalles de una categoría
   * @param id
   * @example openDetailsModal(1)
   * @returns void
   */
  openDetailsModal(id: any) {
    this.OpenPopUp(id, 'Detalles de categoria', CategoryDetailsComponent);
  }

  /**
   * Método para abrir un modal
   * @param id
   * @param title
   * @param component
   * @example OpenPopUp(1, 'Detalles de categoria', CategoryDetailsComponent)
   * @returns void
   */
  OpenPopUp(id: any, title: any, component: any) {
    var _popUp = this.dialog.open(component, {
      width: '40%',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '600ms',
      data: {
        title: title,
        categoryId: id,
      },
    });
    _popUp.afterClosed().subscribe();
  }

}
