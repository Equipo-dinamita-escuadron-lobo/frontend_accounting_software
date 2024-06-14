import { Component, OnInit } from '@angular/core';
import { Category, CategoryList } from '../../models/Category';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { CategoryDetailsComponent } from '../category-details/category-details.component';
import Swal from 'sweetalert2';
import { Account } from '../../../chart-accounts/models/ChartAccount';
import { ChartAccountService } from '../../../chart-accounts/services/chart-account.service';


@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  accounts: any[] = [];

  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
  entData: any | null = null;

  columns: any[] = [
    { title: 'Id', data: 'id' },
    { title: 'Nombre', data: 'name' },
    { title: 'Descripción', data: 'description' },
    { title: 'Inventario', data: 'inventory' },
    { title: 'Costo', data: 'cost' },
    { title: 'Venta', data: 'sale' },
    { title: 'Devolución', data: 'return' },
    { title: 'Acciones', data: 'actions' },
  ];

  form: FormGroup;

  //variables para el doble clic
  selectedCategoryId: string | null = null;
  timer: any;
  dialog: any;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private chartAccountService: ChartAccountService,

    private fb: FormBuilder  ) {
    this.form = this.fb.group(this.validationsAll());
    this.accounts = [];
  }

  validationsAll() {
    return {
      stringSearchCategory: [''],
    };
  }

  ngOnInit(): void {
    this.entData = this.localStorageMethods.loadEnterpriseData();
    if (this.entData) {
      this.getCategories();
      this.getCuentas();

    }
  }
    //cuentas
    getCuentas(): void {
      this.chartAccountService.getListAccounts(this.entData).subscribe(
        (data: any[]) => {
          this.accounts = this.mapAccountToList(data);
          console.log('accounts:', this.accounts);
        },
        error => {
          console.log('Error al obtener las cuentas:', error);
        }
      );
    }

    mapAccountToList(data: Account[]): Account[] {
      let result: Account[] = [];
      console.log('data:', data);
  
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
      console.log('result:', result);
      return result;
  }

    getCategoryName(id: number): string {
      const account = this.accounts.find(cuenta => cuenta.id === id);
      return account ? account.description : 'No encontrado';
    }


  getCategories(): void {
    this.categoryService.getCategories(this.entData).subscribe(
      (data: Category[]) => {
        this.categories = data;
      },
      (error) => {
        console.log('Error al obtener las categorías:', error);
      }
    );
  }


  // Método para redirigir a una ruta específica
  redirectTo(route: string): void {
    this.router.navigateByUrl(route);
  }

  // Método para redirigir a la página de edición de un producto
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

  goBack(): void {
    this.router.navigate(['/general/operations/products']);
  }

  deleteCategory(categoryId: string): void {
    // Utilizando SweetAlert para mostrar un cuadro de diálogo de confirmación
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Estás seguro de que deseas eliminar esta categoría?',
      icon: 'question',
      showCancelButton: true,
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
              confirmButtonText: 'Aceptar'
            });
          }
        );
      }
    });
  }


  openDetailsModal(id: any) {
    this.OpenPopUp(id, 'Detalles de categoria', CategoryDetailsComponent);
  }

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
