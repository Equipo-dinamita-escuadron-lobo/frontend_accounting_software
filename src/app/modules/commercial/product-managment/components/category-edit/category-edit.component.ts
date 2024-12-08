import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/Category';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import Swal from 'sweetalert2';
import { ChartAccountService } from '../../../chart-accounts/services/chart-account.service';
import { Account } from '../../../chart-accounts/models/ChartAccount';
import { buttonColors } from '../../../../../shared/buttonColors';
import { FormControl } from '@angular/forms';
import { TaxService } from '../../../taxes/services/tax.service';
import { Tax } from '../../../taxes/models/Tax';

/**
 * Componente para editar una categoría
 */
@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.css'
})
export class CategoryEditComponent implements OnInit{

/**
 * Variables del componente
 */
inventoryFilterCtrl: FormControl = new FormControl(); // Filtro para la cuenta de inventario
costFilterCtrl: FormControl = new FormControl();  // Filtro para la cuenta de costo
saleFilterCtrl: FormControl = new FormControl();  // Filtro para la cuenta de venta
taxFilterCtrl: FormControl = new FormControl(); // Filtro para el impuesto
returnFilterCtrl: FormControl = new FormControl();  // Filtro para la cuenta de devolución

categoryId: string = '';  // Id de la categoría
category: Category = {} as Category;  // Categoría
editForm: FormGroup;  // Formulario de edición
localStorageMethods: LocalStorageMethods = new LocalStorageMethods();   // Métodos de almacenamiento local
entData: any | null = null; // Datos de la empresa
  //cuentas
accounts: any[] | undefined;  // Cuentas
filterAccount: string = ''; // Filtro de cuentas
inventory: any[] = [];
cost: any[] = []; 
sale: any[] = [];
return: any[] = []; 
taxes: any [] = []; // Impuestos

/**
 * Constructor del componente
 * @param route 
 * @param categoryService 
 * @param formBuilder 
 * @param router 
 * @param taxServices 
 * @param chartAccountService 
 */
constructor(
  private route: ActivatedRoute,
  private categoryService: CategoryService,
  private formBuilder: FormBuilder,
  private router: Router,
  private taxServices: TaxService,
  private chartAccountService: ChartAccountService,


) {    this.accounts = [];
  this.editForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    inventory: ['', Validators.required],
    cost: ['', Validators.required],
    sale: ['', Validators.required],
    return: ['', Validators.required],
    tax: ['', Validators.required],
  });
}

  /**
   * Método para inicializar el componente
  */
  ngOnInit(): void {
    this.entData = this.localStorageMethods.loadEnterpriseData();

    if (this.entData) {
    this.route.params.subscribe(params => {
      this.categoryId = params['id'];
      this.getCategoryDetails();
    });
    //cuentas
    this.getCuentas();
    this.getTaxes();
    }

    this.inventoryFilterCtrl.valueChanges.subscribe(() => {
      this.filterInventory();
    });
    this.costFilterCtrl.valueChanges.subscribe(() => {
      this.filterCost();
    });
    this.saleFilterCtrl.valueChanges.subscribe(() => {
      this.filterSale();
    });
    this.returnFilterCtrl.valueChanges.subscribe(() => {
      this.filterReturn();
    });

    this.taxFilterCtrl.valueChanges.subscribe(() => {
      this.filterTax();
    });

  
  }

  /**
   * Método para filtrar las cuentas
   */
  filterInventory() {
    const searchTerm = this.inventoryFilterCtrl.value?.toLowerCase() || '';
    this.inventory = this.accounts?.filter(account =>
      `${account.code} - ${account.description}`.toLowerCase().includes(searchTerm)
    ) || [];
  }
  
  /**
   * Método para filtrar las cuentas
   */
  filterCost() {
    const searchTerm = this.costFilterCtrl.value?.toLowerCase() || '';
    this.cost = this.accounts?.filter(account =>
      `${account.code} - ${account.description}`.toLowerCase().includes(searchTerm)
    ) || [];
  }
  
  filterSale() {
    const searchTerm = this.saleFilterCtrl.value?.toLowerCase() || '';
    this.sale = this.accounts?.filter(account =>
      `${account.code} - ${account.description}`.toLowerCase().includes(searchTerm)
    ) || [];
  }
  
  filterReturn() {
    const searchTerm = this.returnFilterCtrl.value?.toLowerCase() || '';
    this.return = this.accounts?.filter(account =>
      `${account.code} - ${account.description}`.toLowerCase().includes(searchTerm)
    ) || [];
  }


  filterTax() {
    const searchTerm = this.taxFilterCtrl.value?.toLowerCase() || '';
    this.taxes = this.accounts?.filter(account =>
      `${account.code} - ${account.description}`.toLowerCase().includes(searchTerm)
    ) || [];
  }

  /**
   * Método para obtener los detalles de la categoría
   */
  getCategoryDetails(): void {
    console.log('Iniciando getCategoryDetails()...');
    console.log('Formulario sin editar:', this.editForm.value);

    this.categoryService.getCategoryById(this.categoryId).subscribe(
      (category: Category) => {
        console.log('Categoría obtenida:', category);

        this.category = category;
        this.editForm.patchValue({
          name: category.name,
          description: category.description,
          inventory: category.inventoryId,
          cost: category.costId,
          sale: category.saleId,
          tax: category.taxId,
          return: category.returnId
        });

        console.log('Formulario editado:', this.editForm.value);
      },
      error => {
        console.error('Error obteniendo detalles de la categoría: ', error);
      }
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
      this.cost = this.accounts;
      this.inventory = this.accounts;
      this.sale = this.accounts;
      this.return = this.accounts;
    },
    error => {
      console.log('Error al obtener las cuentas:', error);
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
      
    },

  );
}

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
  get filteredAccounts() {
    if (this.accounts) {
      return this.accounts.filter(account =>
        `${account.code} - ${account.description}`.toLowerCase().includes(this.filterAccount.toLowerCase())
      );
    }
    return [];
  }

  /**
   * Método para buscar en el filtro
   * @param term 
   * @param item 
   * @returns 
   */
  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    return item.code.toLowerCase().includes(term) || item.description.toLowerCase().includes(term);
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
   * Método para editar una categoría
   * @returns void
   * @example onSubmit()
   */
  onSubmit(): void {
    console.log('Formulario editado sub:', this.editForm.value);

    if (this.editForm.valid) {
      const categoryData = this.editForm.value;

      categoryData.inventoryId = parseInt(categoryData.inventory, 10);
      categoryData.costId = parseInt(categoryData.cost, 10);
      categoryData.saleId = parseInt(categoryData.sale, 10);
      categoryData.returnId = parseInt(categoryData.return, 10);
      categoryData.taxId =  parseInt(categoryData.tax, 10);
      categoryData.enterpriseId = this.entData;
      categoryData.id=this.category.id;
      categoryData.state=this.category.state;
    console.log('categoryData:', categoryData);
        this.categoryService.updateCategory( categoryData).subscribe(
        (category: Category) => {
          Swal.fire({
            title: 'Edición exitosa',
            text: 'Se ha editado la categoría con éxito!',
            icon: 'success',
            confirmButtonColor: buttonColors.confirmationColor,
            confirmButtonText: 'Aceptar',
          });
        },
        error => {
          console.error('Error al editar la categoría:', error);
          Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al editar la categoría.',
            icon: 'error',
            confirmButtonColor: buttonColors.confirmationColor,
            confirmButtonText: 'Aceptar',
          });        }
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
   * Método para regresar
   * @returns void
   * @example goBack()
   */
  goBack(): void {
    //this.router.navigate(['../../'], { relativeTo: this.route });
    this.router.navigate(['/general/operations/categories']);
  }
}
