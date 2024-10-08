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


@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.css'
})
export class CategoryEditComponent implements OnInit{

categoryId: string = '';
category: Category = {} as Category;
editForm: FormGroup;
localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
entData: any | null = null;
  //cuentas
  accounts: any[] | undefined;
  filterAccount: string = '';
inventory: any[] = [];
cost: any[] = [];
sale: any[] = [];
return: any[] = [];


constructor(
  private route: ActivatedRoute,
  private categoryService: CategoryService,
  private formBuilder: FormBuilder,
  private router: Router,
  private chartAccountService: ChartAccountService,


) {    this.accounts = [];
  this.editForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    inventory: ['', Validators.required],
    cost: ['', Validators.required],
    sale: ['', Validators.required],
    return: ['', Validators.required]
  });
}
  ngOnInit(): void {
    this.entData = this.localStorageMethods.loadEnterpriseData();

    if (this.entData) {
    this.route.params.subscribe(params => {
      this.categoryId = params['id'];
      this.getCategoryDetails();
    });
    //cuentas
    this.getCuentas();
  }
  }

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
          return: category.returnId
        });

        console.log('Formulario editado:', this.editForm.value);
      },
      error => {
        console.error('Error obteniendo detalles de la categoría: ', error);
      }
    );
  }

    //cuentas
 //cuentas
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

customSearchFn(term: string, item: any) {
term = term.toLowerCase();
return item.code.toLowerCase().includes(term) || item.description.toLowerCase().includes(term);
}


    validationsAll() {
      return {
        stringSearchCategory: [''],
      };
    }

  onSubmit(): void {
    console.log('Formulario editado sub:', this.editForm.value);

    if (this.editForm.valid) {
      const categoryData = this.editForm.value;

      categoryData.inventoryId = parseInt(categoryData.inventory, 10);
      categoryData.costId = parseInt(categoryData.cost, 10);
      categoryData.saleId = parseInt(categoryData.sale, 10);
      categoryData.returnId = parseInt(categoryData.return, 10);
      categoryData.enterpriseId = this.entData;
      categoryData.id=this.category.id;
      categoryData.state=this.category.state;
  console.log('categoryData:', categoryData);
        this.categoryService.updateCategory( categoryData).subscribe(
        (category: Category) => {
          Swal.fire({
            title: 'Edición exitosa!',
            text: 'Se ha editado la categoría con éxito!',
            icon: 'success',
            confirmButtonColor: buttonColors.confirmationColor,
            confirmButtonText: 'Aceptar',
          });
        },
        error => {
          console.error('Error al editar la categoría:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Ha ocurrido un error al editar la categoría.',
            icon: 'error',
            confirmButtonColor: buttonColors.confirmationColor,
            confirmButtonText: 'Aceptar',
          });        }
      );
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, complete todos los campos.',
        icon: 'error',
        confirmButtonColor: buttonColors.confirmationColor,
        confirmButtonText: 'Aceptar',
      });
    }
  }

  goBack(): void {
    //this.router.navigate(['../../'], { relativeTo: this.route });
    this.router.navigate(['/general/operations/categories']);
  }
}
