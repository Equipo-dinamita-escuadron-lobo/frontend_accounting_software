import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/Category';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];

  columns: any[] = [
    { title: 'Id', data: 'id' },
    { title: 'Nombre', data: 'name' },
    { title: 'Descripción', data: 'description' },
    { title: 'Inventario', data: 'inventory' },
    { title: 'Costo', data: 'cost' },
    { title: 'Venta', data: 'sale' },
    { title: 'Devolución', data: 'return' }
  ];

  form: FormGroup;

    //variables para el doble clic
    selectedCategoryId: string | null = null;
    timer: any;

  constructor(private categoryService : CategoryService,  private router: Router, private fb: FormBuilder ) {
    this.form = this.fb.group(this.validationsAll());
   }

   validationsAll(){
    return {
      stringSearchCategory: ['']
    };
  }



  ngOnInit(): void {
    this.getCategories();
  }

getCategories(): void {
  this.categoryService.getCategories().subscribe(
    (data: Category[]) => {
      this.categories = data;
    },
    error => {
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
      this.router.navigate(['/general/operations/categories/edit/', categoryId]);
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

}
