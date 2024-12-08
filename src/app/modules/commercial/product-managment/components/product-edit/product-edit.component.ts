import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { Product } from '../../models/Product';
import { CategoryService } from '../../services/category.service';
import { ProductTypeService } from '../../services/product-type-service.service';
import { ProductService } from '../../services/product.service';
import { UnitOfMeasureService } from '../../services/unit-of-measure.service';
import { ProductType } from '../../models/ProductType';
import { buttonColors } from '../../../../../shared/buttonColors';

/**
 * Componente para editar un producto
 */
@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  /**
   * Variables del componente
   */
  productId: string = ''; // Inicializa la propiedad productId como una cadena vacía

  product: Product = {} as Product; // Inicializa la propiedad product como un objeto vacío
  editForm: FormGroup; // Define un formulario reactivo para la edición de productos
  productForm: FormGroup = this.formBuilder.group({}); // Define un formulario reactivo para la creación de productos
  unitOfMeasures: any[] = []; // Inicializa la propiedad unitOfMeasures como un arreglo vacío
  categories: any[] = []; // Inicializa la propiedad categories como un arreglo vacío
  thirdParties: any[] = []; // Declarar la propiedad thirdParties como un arreglo vacío al principio
  nextProductId: number = 1; // Inicializa el contador del ID del producto
  productTypes: any[] = []; // Inicializa la propiedad productTypes como un arreglo vacío
  localStorageMethods: LocalStorageMethods = new LocalStorageMethods(); // Instancia de la clase LocalStorageMethods
  entData: any | null = null; // Inicializa la propiedad entData como un objeto nulo

  /**
   * Constructor del componente
   * @param route 
   * @param productService 
   * @param formBuilder 
   * @param unitOfMeasureService 
   * @param categoryService 
   * @param productTypeService 
   * @param router 
   */
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private unitOfMeasureService: UnitOfMeasureService,
    private categoryService: CategoryService,
    private productTypeService: ProductTypeService,
    private router: Router

  ) {
    this.editForm = this.formBuilder.group({
      itemType: ['', Validators.required],
      description: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.min(0)]],
      taxPercentage: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      creationDate: [null, Validators.required],
      unitOfMeasureId: [null, [Validators.required, Validators.pattern(/^\d+$/)]], // 'unitOfMeasureId' es un número
      //supplierId: [null, [Validators.required, Validators.pattern(/^\d+$/)]], // 'supplierId' es un número
      categoryId: [null, [Validators.required, Validators.pattern(/^\d+$/)]], // 'categoryId' es un número
      cost: [null, Validators.required],
      reference: [''],
      productTypeId: [null, [Validators.required, Validators.pattern(/^\d+$/)]], // 'productTypeId' es un número
    }, { validators: quantityValidator });
  }

  /**
   * Método para inicializar el componente
   */
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = params['id']; // Obtener el ID del producto de los parámetros de ruta
      this.getProductDetails(); // Llamar a la función para obtener los detalles del producto
    });
    this.initForm();

    this.entData = this.localStorageMethods.loadEnterpriseData();
    if(this.entData){
      this.getUnitOfMeasures();
      this.getCategories();
      this.loadProductTypes();
    }

  }
  
  /**
   * Método para cargar los tipos de producto
   */
  loadProductTypes(): void {
    this.productTypeService.getAllProductTypes().subscribe(
      (data: any[]) => {
        this.productTypes = data;
      },
      error => {
        console.error('Error al cargar los tipos de producto', error);
      }
    );
  }

  /**
   * Método para obtener las categorías
   */
  getCategories(): void {
    this.categoryService.getCategories(this.entData).subscribe(
      (categories: any[]) => {
        this.categories = categories;
      },
      error => {
        console.error('Error al obtener las categorías:', error);
      }
    );
  }

  /**
   * Método para obtener las unidades de medida
   */
  getUnitOfMeasures(): void {
    this.unitOfMeasureService.getUnitOfMeasures(this.entData).subscribe(
      (unitOfMeasures: any[]) => {
        this.unitOfMeasures = unitOfMeasures;
      },
      error => {
        console.error('Error al obtener las unidades de medida:', error);
      }
    );
  }

  /**
   * Método para inicializar el formulario
   */
  initForm(): void {
    // Definir el formulario reactivo con las validaciones
    this.productForm = this.formBuilder.group({
      id: [this.nextProductId], // Asigna el próximo ID al campo 'id'
      itemType: ['', [Validators.required]],
      description: ['', [Validators.required]],
      quantity: [null, [Validators.required, Validators.min(0)]],
      taxPercentage: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      creationDate: [new Date().toISOString().split('T')[0], [Validators.required]],
      unitOfMeasureId: [null, [Validators.required, Validators.pattern(/^\d+$/)]], // 'unitOfMeasureId' es un número
      // supplierId: [null, [Validators.required, Validators.pattern(/^\d+$/)]], // 'supplierId' es un número
      categoryId: [null, [Validators.required, Validators.pattern(/^\d+$/)]], // 'categoryId' es un número
      cost: [null, [Validators.required, Validators.min(0)]],
      reference: [''],
      productTypeId: [null, [Validators.required, Validators.pattern(/^\d+$/)]], // 'productTypeId' es un número
    });
  }

  /**
   * Método para obtener los detalles del producto
   */
  getProductDetails(): void {
    this.productService.getProductById(this.productId).subscribe(
      (product: Product) => {
        this.product = product;
        console.log(this.product);

        // Puedes asignar los valores del producto al formulario de edición aquí
        this.editForm.patchValue({
          itemType: product.itemType,
          description: product.description,
          quantity: product.quantity,
          taxPercentage: product.taxPercentage,
          creationDate: product.creationDate,
          unitOfMeasureId: product.unitOfMeasureId,
          //supplierId: product.supplierId,
          categoryId: product.categoryId,
          cost: product.cost,
          reference: product.reference,
          productTypeId: product.productTypeId,
        });
      },
      error => {
        console.error('Error obteniendo detalles del producto:', error);
      }
    );
  }

  /**
   * Método para editar un producto
   */
  onSubmit(): void {
    if (this.editForm.valid) {
      const formData = this.productForm.value;
      formData.unitOfMeasureId = parseInt(formData.unitOfMeasureId, 10);
     // formData.supplierId = parseInt(formData.supplierId, 10);
      formData.categoryId = parseInt(formData.categoryId, 10);


      console.log('Sin editar:',this.product);
      const updatedProduct: Product = this.editForm.value;

      updatedProduct.id= this.productId;
      updatedProduct.state= this.product.state;
      updatedProduct.enterpriseId= this.product.enterpriseId;
      // Asignar el ID del producto a la propiedad _id del objeto
      // Agrega cualquier lógica adicional necesaria antes de enviar los datos al servidor
      this.productService.updateProduct(updatedProduct).subscribe(
        (response: Product) => {
          // Mostrar mensaje de éxito
          Swal.fire({
            title: 'Edición exitosa',
            text: 'Se ha editado el producto exitosamente.',
            confirmButtonColor: buttonColors.confirmationColor,
            icon: 'success',
          });
          // Puedes redirigir al usuario a otra página aquí si lo deseas
        },
        (error) => {
          //console.error('Error al editar el producto:', error);
          // Mostrar mensaje de error
          Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al editar el producto.',
            confirmButtonColor: buttonColors.confirmationColor,
            icon: 'error',
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, completa correctamente el formulario antes de enviarlo.',
        icon: 'error',
        confirmButtonColor: buttonColors.confirmationColor,
      });
    }
  }

  /**
   * Método para dar formato al costo
   * @param event 
   */
  formatcost(event: any) {
      const inputValue = event.target.value;
      let formattedcost = '';

      if (inputValue !== '') {
          // Convertir el precio a número entero (asumiendo que no hay decimales)
          const cost = parseFloat(inputValue.replace(',', ''));
      }
  }

  /**
   * Método para regresar a la lista de productos
   */
  goBack(): void {
    this.router.navigate(['/general/operations/products']);
  }


}

// Función para validar que el maximo y minimo tengan valores coherentes
function quantityValidator(group: FormGroup): { [key: string]: any } | null {
  const quantity = group.controls['quantity'].value;
  //const max = group.controls['maxQuantity'].value;
  return quantity !== null ? null : { 'quantityInvalid': true };
}
