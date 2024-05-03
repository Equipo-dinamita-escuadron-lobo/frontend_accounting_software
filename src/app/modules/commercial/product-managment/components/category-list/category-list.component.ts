import { Component, OnInit } from '@angular/core';
import { Category, CategoryList } from '../../models/Category';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { CategoryDetailsComponent } from '../category-details/category-details.component';
interface Cuenta {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  cuentas: Cuenta[] = [];

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
    private fb: FormBuilder
  ) {
    this.form = this.fb.group(this.validationsAll());
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
      this.categoryService.getCuentas().subscribe(
        (data: Cuenta[]) => {
          this.cuentas = data;
          
        },
        error => {
          console.log('Error al obtener las cuentas:', error);
        }
      );
    }
    getCategoryName(id: number): string {
      const account = this.cuentas.find(cuenta => cuenta.id === id);
      return account ? account.name : 'No encontrado';
    }
    
    
  getCategories(): void {
    this.categoryService.getCategories(this.entData.entId).subscribe(
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
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      this.categoryService.deleteCategory(categoryId).subscribe(
        (data: Category) => {
          console.log('Categoría eliminada con éxito: ', data);
          this.getCategories();
        },
        (error) => {
          console.error('Error al eliminar la categoría: ', error);
        }
      );
    }
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
