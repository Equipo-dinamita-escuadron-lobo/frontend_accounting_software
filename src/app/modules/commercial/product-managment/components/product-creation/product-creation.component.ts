import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importa los módulos necesarios para trabajar con formularios reactivos
import { ProductService } from '../../services/product.service'; 
import { UnitOfMeasureService } from '../../services/unit-of-measure.service'; 
import { CategoryService } from '../../services/category.service'; 
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-creation',
  templateUrl: './product-creation.component.html',
  styleUrls: ['./product-creation.component.css']
})
export class ProductCreationComponent implements OnInit {
  productForm: FormGroup = this.formBuilder.group({}); // Define un formulario reactivo para la creación de productos
  unitOfMeasures: any[] = []; // Inicializa la propiedad unitOfMeasures como un arreglo vacío
  categories: any[] = []; // Inicializa la propiedad categories como un arreglo vacío

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private unitOfMeasureService: UnitOfMeasureService,
    private categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    // Inicializa el formulario reactivo y define las validaciones necesarias para cada campo
    this.productForm = this.formBuilder.group({
      tipo_item: ['', Validators.required],
      codigo: ['', Validators.required],
      descripcion: ['', Validators.required],
      minima_cantidad: ['', Validators.required],
      maxima_cantidad: ['', Validators.required],
      iva: ['', Validators.required],
      fecha_creacion: ['', Validators.required],
      unidad_medida: ['', Validators.required],
      proveedor: ['', Validators.required],
      categoria: ['', Validators.required]
    });

    // Obtiene todas las unidades de medida al inicializar el componente
  //  this.getUnitOfMeasures();

    // Obtiene todas las categorías al inicializar el componente
   // this.getCategories();

  }

  // Método para obtener todas las unidades de medida
  /*
  getUnitOfMeasures(): void {
    this.unitOfMeasureService.getUnitOfMeasures().subscribe(
      (data: any[]) => {
        this.unitOfMeasures = data;
      },
      error => {
        console.log('Error al obtener las unidades de medida:', error);
      }
    );
  }
*/
  // Método para obtener todas las categorías/
  /*
  getCategories(): void {
    this.categoryService.getCategories().subscribe(
      (data: any[]) => {
        this.categories = data;
      },
      error => {
        console.log('Error al obtener las categorías:', error);
      }
    );
  }*/


  // Método para enviar el formulario y crear un nuevo producto
  onSubmit(): void {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      // Aquí puedes enviar los datos del formulario al servicio ProductService para crear un nuevo producto
      this.productService.createProduct(productData).subscribe(
        (response: any) => {
          console.log('Producto creado exitosamente:', response);
          // Limpia el formulario después de crear el producto exitosamente
          this.productForm.reset();
        },
        error => {
          console.log('Error al crear el producto:', error);
        }
      );
    } else {
      console.log('Formulario inválido');
    }
  }
}
