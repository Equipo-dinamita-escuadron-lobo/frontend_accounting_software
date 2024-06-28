import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { ChartAccountService } from '../../../chart-accounts/services/chart-account.service';
import { Account } from '../../../chart-accounts/models/ChartAccount';

@Component({
  selector: 'app-category-creation',
  templateUrl: './category-creation.component.html',
  styleUrls: ['./category-creation.component.css'],
})
export class CategoryCreationComponent implements OnInit {
  categoryForm: FormGroup = this.formBuilder.group({});
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
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private chartAccountService: ChartAccountService,
  ) {
    this.accounts = [];
  }


  ngOnInit(): void {

    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      inventory: ['', [Validators.required]],
      cost: ['', [Validators.required]],
      sale: ['', [Validators.required]],
      return: ['', [Validators.required]],
    });

    this.entData = this.localStorageMethods.loadEnterpriseData();

    if (this.entData) {
      this.getCuentas();
    }
  }
  validationsAll() {
    return {
      stringSearchCategory: [''],
    };
  }
  onSubmit(): void {
    if (this.categoryForm.valid) {
      const categoryData = this.categoryForm.value;

      categoryData.inventoryId = parseInt(categoryData.inventory, 10);
      categoryData.costId = parseInt(categoryData.cost, 10);
      categoryData.saleId = parseInt(categoryData.sale, 10);
      categoryData.returnId = parseInt(categoryData.return, 10);

      categoryData.enterpriseId = this.entData;

      this.categoryService.createCategory(categoryData).subscribe(
        () => {
          Swal.fire({
            title: 'Creación exitosa!',
            text: 'Se ha creado la categoría con éxito!',
            icon: 'success',
            confirmButtonText: 'Aceptar',
          });
          this.resetForm();
        },
        (error) => {
          console.error('Error al crear la categoría:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Ha ocurrido un error al crear la categoría.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, complete todos los campos.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  }

  resetForm(): void {
    this.categoryForm.reset();
  }

  goBack(): void {
    //this.router.navigate(['../category-list']);
    this.router.navigate(['/general/operations/categories']);
  }

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

}
