import { Component, OnInit, OnDestroy, Input, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { Account } from '../../../chart-accounts/models/ChartAccount';
import { ChartAccountService } from '../../../chart-accounts/services/chart-account.service';
import { CategoryService } from '../../services/category.service';
import { buttonColors } from '../../../../../shared/buttonColors';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaxService } from '../../../taxes/services/tax.service';
import { Tax } from '../../../taxes/models/Tax';

/**
 * Componente para la creación de una categoría
 */
@Component({
  selector: 'app-category-creation',
  templateUrl: './category-creation.component.html',
  styleUrls: ['./category-creation.component.css'],
})
export class CategoryCreationComponent implements OnInit, OnDestroy {
  @Input() isDialog: boolean = false; // Determina si el componente es usado como dialog
  

  categoryForm: FormGroup = this.formBuilder.group({}); // Formulario de la categoría
  localStorageMethods: LocalStorageMethods = new LocalStorageMethods(); // Métodos para el manejo del local storage
  entData: any | null = null; // Datos de la empresa

  // Cuentas para los filtros
  accounts: any[] | undefined; 
  // Filtros para cuentas
  filterAccount: string = '';
  // Listas para cuentas
  inventory: any[] = [];
  cost: any[] = [];
  sale: any[] = [];
  return: any[] = [];

  taxes: any[] = [];

  // FormControls para filtros
  inventoryFilterCtrl: FormControl = new FormControl();
  costFilterCtrl: FormControl = new FormControl();
  saleFilterCtrl: FormControl = new FormControl();
  returnFilterCtrl: FormControl = new FormControl();
  taxFilterCtrl: FormControl = new FormControl();
  // Listas observables filtradas
  filteredInventory: ReplaySubject<any[]> = new ReplaySubject(1);
  filteredCost: ReplaySubject<any[]> = new ReplaySubject(1);
  filteredSale: ReplaySubject<any[]> = new ReplaySubject(1);
  filteredReturn: ReplaySubject<any[]> = new ReplaySubject(1);
  filteredTaxes: ReplaySubject<any[]> = new ReplaySubject(1);

  private _onDestroy = new Subject<void>();

  /**
   * Constructor del componente para la creación de una categoría
   * @param formBuilder 
   * @param categoryService 
   * @param router 
   * @param chartAccountService 
   * @param taxServices 
   * @param data 
   * @param dialogRef 
   */
  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private chartAccountService: ChartAccountService,
    private taxServices: TaxService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, // Inyectar los datos solo cuando es un diálogo
    @Optional() public dialogRef: MatDialogRef<CategoryCreationComponent> 
  ) {
    this.accounts = [];
    if (data && data.isDialog !== undefined) {
      this.isDialog = data.isDialog;
    }
  }

  /**
   * Método que se ejecuta al iniciar el componente
   */
  ngOnInit(): void {

    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      inventory: ['', [Validators.required]],
      cost: ['', [Validators.required]],
      sale: ['', [Validators.required]],
      return: ['', [Validators.required]],
      tax:  ['', [Validators.required]],
    });

    this.entData = this.localStorageMethods.loadEnterpriseData();

    if (this.entData) {
      this.getCuentas();
      this.getTaxes();
    }

    /**
     * Filtros para las cuentas
     */
    this.inventoryFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => this.filterOptions(this.inventory, this.inventoryFilterCtrl, this.filteredInventory));
    this.costFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => this.filterOptions(this.cost, this.costFilterCtrl, this.filteredCost));
    this.saleFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => this.filterOptions(this.sale, this.saleFilterCtrl, this.filteredSale));
    this.returnFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => this.filterOptions(this.return, this.returnFilterCtrl, this.filteredReturn));
    this.taxFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => this.filterOptions(this.return, this.taxFilterCtrl, this.filteredTaxes));
  }

   /**
    * Método para filtrar las opciones de las cuentas
    * @param list 
    * @param filterCtrl 
    * @param filteredList 
    */
   private filterOptions(list: any[], filterCtrl: FormControl, filteredList: ReplaySubject<any[]>) {
    const search = filterCtrl.value ? filterCtrl.value.toLowerCase() : '';
    filteredList.next(
      list.filter(item => (item.code + ' ' + item.description).toLowerCase().includes(search))
    );
  }

  /**
   * Método que se ejecuta al destruir el componente
   * @returns void
   * @example ngOnDestroy()
   */
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Método para validar los campos del formulario
   * @returns 
   */
  validationsAll() {
    return {
      stringSearchCategory: [''],
    };
  }

  /**
   * Método para crear una categoría
   * @returns void
   * @example onSubmit()
   */
  onSubmit(): void {
    if (this.categoryForm.valid) {
      const categoryData = this.categoryForm.value;

      categoryData.inventoryId = parseInt(categoryData.inventory, 10);
      categoryData.costId = parseInt(categoryData.cost, 10);
      categoryData.saleId = parseInt(categoryData.sale, 10);
      categoryData.returnId = parseInt(categoryData.return, 10);
      categoryData.taxId = parseInt(categoryData.tax, 10);

      categoryData.enterpriseId = this.entData;

      this.categoryService.createCategory(categoryData).subscribe(
        () => {
          Swal.fire({
            title: 'Creación exitosa',
            text: 'Se ha creado la categoría con éxito!',
            icon: 'success',
            confirmButtonColor: buttonColors.confirmationColor,
            confirmButtonText: 'Aceptar',
          });
          if (this.dialogRef) {
            this.dialogRef.close();  // Close dialog after successful creation
          } else {
            this.resetForm();  // Reset form if not using dialog
          }
        },
        (error) => {
          console.error('Error al crear la categoría:', error);
          Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al crear la categoría.',
            icon: 'error',
            confirmButtonColor: buttonColors.confirmationColor,
            confirmButtonText: 'Aceptar',
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, complete todos los campos.',
        icon: 'error',
        confirmButtonColor: buttonColors.confirmationColor,
        confirmButtonText: 'Aceptar',
      });
    }
  }

  /**
   * Método para resetear el formulario
   * @returns void
   * @example resetForm()
   */
  resetForm(): void {
    this.categoryForm.reset();
  }

  /**
   * Método para volver atrás
   * @returns void
   * @example goBack()
   */
  goBack(): void {
    if (!this.isDialog) {
      this.router.navigate(['/general/operations/categories']);
    }
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
        this.inventory = this.accounts;
        this.cost = this.accounts;
        this.sale = this.accounts;
        this.return = this.accounts;

        // Inicializar listas filtradas
        this.filteredInventory.next(this.inventory.slice());
        this.filteredCost.next(this.cost.slice());
        this.filteredSale.next(this.sale.slice());
        this.filteredReturn.next(this.return.slice());
      },
      error => {
        console.error('Error al obtener las cuentas:', error);
      }
    );
  }

  /**
   * Método para obtener los impuestos
   * @returns void
   * @example getTaxes()
   */
  getTaxes() {
    this.entData = this.localStorageMethods.loadEnterpriseData();
    this.taxServices.getTaxes(this.entData).subscribe(
      (data: Tax[]) => {
        this.taxes = data  
        this.filteredTaxes.next(this.taxes.slice());
      },

    );
  }

  /**
   * Método para mapear las cuentas a una lista
   * @param data 
   * @returns 
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
 * Método para obtener las cuentas filtradas
 * @returns account[]
 * @example get filteredAccounts()
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
 * Metodo para obtener las cuentas filtradas de inventario, atraves del buscador
 * @param term 
 * @param item 
 * @returns 
 */
customSearchFn(term: string, item: any) {
  term = term.toLowerCase();
  return item.code.toLowerCase().includes(term) || item.description.toLowerCase().includes(term);
}

}
