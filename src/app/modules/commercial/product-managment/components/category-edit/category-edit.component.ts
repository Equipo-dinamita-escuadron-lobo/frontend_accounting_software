import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/Category';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import Swal from 'sweetalert2';

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
localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
entData: any | null = null;
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
    getCuentas(): void {
      this.categoryService.getCuentas().subscribe(
        (data: Cuenta[]) => {
          this.inventory = data;
          this.cost = data;
          this.sale = data;
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
            confirmButtonText: 'Aceptar',
          });
        },
        error => {
          console.error('Error al editar la categoría:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Ha ocurrido un error al editar la categoría.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });        }
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

  goBack(): void {
    //this.router.navigate(['../../'], { relativeTo: this.route });
    this.router.navigate(['/general/operations/categories']);
  }
}
