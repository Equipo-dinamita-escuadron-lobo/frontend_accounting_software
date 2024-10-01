import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { ThirdServiceService } from '../../../third-parties-managment/services/third-service.service';
import { Product } from '../../models/Product';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { UnitOfMeasureService } from '../../services/unit-of-measure.service';


@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  productId: string = '';

  product: Product = {} as Product;
  editForm: FormGroup;
  productForm: FormGroup = this.formBuilder.group({}); // Define un formulario reactivo para la creación de productos
  unitOfMeasures: any[] = []; // Inicializa la propiedad unitOfMeasures como un arreglo vacío
  categories: any[] = []; // Inicializa la propiedad categories como un arreglo vacío
  thirdParties: any[] = []; // Declarar la propiedad thirdParties como un arreglo vacío al principio
  nextProductId: number = 1; // Inicializa el contador del ID del producto

  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
  entData: any | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private unitOfMeasureService: UnitOfMeasureService,
    private categoryService: CategoryService,
    private thirdService: ThirdServiceService, // Inyecta el servicio ThirdService en el constructor,
    private router: Router

  ) {
    this.editForm = this.formBuilder.group({
      itemType: ['', Validators.required],
      description: ['', Validators.required],
      minQuantity: [null, [Validators.required, Validators.min(0)]],
      maxQuantity: [null, [Validators.required, Validators.min(0)]],
      taxPercentage: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      creationDate: [null, Validators.required],
      unitOfMeasureId: [null, [Validators.required, Validators.pattern(/^\d+$/)]], // 'unitOfMeasureId' es un número
      //supplierId: [null, [Validators.required, Validators.pattern(/^\d+$/)]], // 'supplierId' es un número
      categoryId: [null, [Validators.required, Validators.pattern(/^\d+$/)]], // 'categoryId' es un número
      price: [null, Validators.required]
    }, { validators: minMaxValidator });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = params['id']; // Obtener el ID del producto de los parámetros de ruta
      this.getProductDetails(); // Llamar a la función para obtener los detalles del producto
    });
    this.initForm();

    this.entData = this.localStorageMethods.loadEnterpriseData();
    if(this.entData){
    this.getThirdParties();
    this.getUnitOfMeasures();
    this.getCategories();
    }

  }


    // Método para obtener la lista de categorías
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

    // Método para obtener la lista de proveedores
  getThirdParties(): void {

    this.thirdService.getThirdParties(this.entData,0).subscribe(
      (thirdParties: any[]) => {
        // Asigna la lista de proveedores a una propiedad del componente para usarla en el formulario
        this.thirdParties = thirdParties;
        // Llamar a initForm() después de obtener la lista de proveedores
        this.initForm();
      },
      error => {
        console.error('Error al obtener la lista de proveedores:', error);
      }
    );
  }

  // Método para obtener la lista de unidades de medida
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

    //Metodo Complementario
    initForm(): void {
      // Definir el formulario reactivo con las validaciones
      this.productForm = this.formBuilder.group({
        id: [this.nextProductId], // Asigna el próximo ID al campo 'id'
        itemType: ['', [Validators.required]],
        description: ['', [Validators.required]],
        minQuantity: [null, [Validators.required, Validators.min(0)]],
        maxQuantity: [null, [Validators.required, Validators.min(0)]],
        taxPercentage: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
        creationDate: [new Date().toISOString().split('T')[0], [Validators.required]],
        unitOfMeasureId: [null, [Validators.required, Validators.pattern(/^\d+$/)]], // 'unitOfMeasureId' es un número
       // supplierId: [null, [Validators.required, Validators.pattern(/^\d+$/)]], // 'supplierId' es un número
        categoryId: [null, [Validators.required, Validators.pattern(/^\d+$/)]], // 'categoryId' es un número
        price: [null, [Validators.required, Validators.min(0)]]
      });
    }


  getProductDetails(): void {
    this.productService.getProductById(this.productId).subscribe(
      (product: Product) => {
        this.product = product;
        console.log(this.product);

        // Puedes asignar los valores del producto al formulario de edición aquí
        this.editForm.patchValue({
          itemType: product.itemType,
          description: product.description,
          minQuantity: product.minQuantity,
          maxQuantity: product.maxQuantity,
          taxPercentage: product.taxPercentage,
          creationDate: product.creationDate,
          unitOfMeasureId: product.unitOfMeasureId,
          //supplierId: product.supplierId,
          categoryId: product.categoryId,
          price: product.price
        });
      },
      error => {
        console.error('Error obteniendo detalles del producto:', error);
      }
    );
  }

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
            title: 'Edición exitosa!',
            text: 'Se ha editado el producto exitosamente!',
            icon: 'success',
          });
          // Puedes redirigir al usuario a otra página aquí si lo deseas
        },
        (error) => {
          console.error('Error al editar el producto:', error);
          // Mostrar mensaje de error
          Swal.fire({
            title: 'Error!',
            text: 'Ha ocurrido un error al editar el producto.',
            icon: 'error',
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, completa correctamente el formulario antes de enviarlo.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  }

  //Metodo para formatear el precio
  formatPrice(event: any) {
    const priceInput = event.target.value.replace(/\D/g, ''); // Remover caracteres no numéricos
    let formattedPrice = '';
    if (priceInput !== '') {
      // Convertir el precio a número
      const price = parseInt(priceInput, 10);
      // Formatear el precio con separador de miles y decimales
      formattedPrice = this.formatNumberWithCommas(price);
    }
    this.editForm.get('price')?.setValue(formattedPrice);
  }

  // Función para formatear un número con separadores de miles
  formatNumberWithCommas(number: number): string {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }


  goBack(): void {
    this.router.navigate(['/general/operations/products']);
  }


}

// Función para validar que el maximo y minimo tengan valores coherentes
function minMaxValidator(group: FormGroup): { [key: string]: any } | null {
  const min = group.controls['minQuantity'].value;
  const max = group.controls['maxQuantity'].value;
  return min !== null && max !== null && min <= max ? null : { 'minMaxInvalid': true };
}
