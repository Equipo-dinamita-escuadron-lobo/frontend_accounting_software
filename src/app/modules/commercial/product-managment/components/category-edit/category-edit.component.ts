import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/Category';

//interface temporal para simular la respuesta de la API
interface Cuenta {
  id: number;
  name: string;
  description: string;
}
@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.css'
})
export class CategoryEditComponent implements OnInit{
categoryId: string = '';
category: Category = {} as Category;
editForm: FormGroup;
//cuentas
inventory: any[] = [];
cost: any[] = [];
sale: any[] = [];
return: any[] = [];


constructor(
  private route: ActivatedRoute,
  private categoryService: CategoryService,
  private formBuilder: FormBuilder,
  private router: Router
  
) {
  this.editForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    inventory: [null],
    cost: ['', Validators.required],
    sale: ['', Validators.required],
    return: ['', Validators.required]
  });
}
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryId = params['id'];
      this.getCategoryDetails();
    });
    //cuentas
    this.getCuentas();
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
  
  
getCuentasR(): Cuenta[] {
  this.categoryService.getCuentas().subscribe(
    (data: Cuenta[]) => {
      return data;      },
    error => {
      console.log('Error al obtener las cuentas:', error);
    }
  );
  return [];
}
  //cuentas
getCuentas(): void {
  this.categoryService.getCuentas().subscribe(
    (data: Cuenta[]) => {
      this.inventory = data;
    },
    error => {
      console.log('Error al obtener las cuentas:', error);
    }
  );
  this.categoryService.getCuentas().subscribe(
    (data: Cuenta[]) => {
      this.cost = data;
    },
    error => {
      console.log('Error al obtener las cuentas:', error);
    }
  );
  this.categoryService.getCuentas().subscribe(
    (data: Cuenta[]) => {
      this.sale = data;
    },
    error => {
      console.log('Error al obtener las cuentas:', error);
    }
  );
  this.categoryService.getCuentas().subscribe(
    (data: Cuenta[]) => {
      this.return = data;
    },
    error => {
      console.log('Error al obtener las cuentas:', error);
    }
  );
}


  onSubmit(): void {
    console.log('Formulario editado sub:', this.editForm.value);

    if (this.editForm.valid) {
      this.categoryService.updateCategory( this.editForm.value).subscribe(
        (category: Category) => {
          console.log('Category updated successfully: ', category);
        },
        error => {
          console.error('Error updating category: ', error);
        }
      );
    }
  }
  
  goBack(): void {
    //this.router.navigate(['../../'], { relativeTo: this.route });
    this.router.navigate(['/general/operations/categories']);
  }
}
