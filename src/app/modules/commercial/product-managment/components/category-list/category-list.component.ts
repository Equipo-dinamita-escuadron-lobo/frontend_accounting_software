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
  redirectToEdit(categoryId: string): void {
    console.log('ID de la categoría seleccionado:', categoryId);
    this.router.navigate(['/category-edit', categoryId]);
  }
}
