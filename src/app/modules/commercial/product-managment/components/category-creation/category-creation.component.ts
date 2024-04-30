import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-category-creation',
  templateUrl: './category-creation.component.html',
  styleUrls: ['./category-creation.component.css']
})
export class CategoryCreationComponent implements OnInit {
  categoryForm: FormGroup = this.formBuilder.group({});

  
  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      inventory: ['', [Validators.required]],
      cost: ['', [Validators.required]],
      sale: ['', [Validators.required]],
      return: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const categoryData = this.categoryForm.value;
      this.categoryService.createCategory(categoryData).subscribe(
        () => {
          Swal.fire({
            title: 'Creación exitosa!',
            text: 'Se ha creado la categoría con éxito!',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          this.resetForm();
        },
        error => {
          console.error('Error al crear la categoría:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Ha ocurrido un error al crear la categoría.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, complete todos los campos.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
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
}

