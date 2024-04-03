import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importa los módulos necesarios para trabajar con formularios reactivos
import { ProductService } from '../../services/product.service';
import { UnitOfMeasureService } from '../../services/unit-of-measure.service';
import { CategoryService } from '../../services/category.service';
import { Router, RouterModule } from '@angular/router';
import { Product } from '../../models/Product';
import { ThirdService } from '../../../third-parties-managment/services/third-service';
import { Third } from '../../../third-parties-managment/models/third-model';
import Swal from 'sweetalert2';
 @Component({
  selector: 'app-product-creation',
  templateUrl: './product-creation.component.html',
  styleUrls: ['./product-creation.component.css'],
})
export class ProductCreationComponent implements OnInit {
  productForm: FormGroup = this.formBuilder.group({}); // Define un formulario reactivo para la creación de productos
  unitOfMeasures: any[] = []; // Inicializa la propiedad unitOfMeasures como un arreglo vacío
  categories: any[] = []; // Inicializa la propiedad categories como un arreglo vacío
  thirdParties: any[] = []; // Declarar la propiedad thirdParties como un arreglo vacío al principio
  formSubmitAttempt: boolean = false;
  submitSuccess: boolean = false;
  nextProductId: number = 1; // Inicializa el contador del ID del producto

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private unitOfMeasureService: UnitOfMeasureService,
    private categoryService: CategoryService,
    private thirdService: ThirdService // Inyecta el servicio ThirdService en el constructor
  ) {}
  
  ngOnInit(): void {
    // Inicializa el formulario reactivo y define las validaciones necesarias para cada campo
    // TypeScript: Agregando validaciones para campos no negativos y no vacíos
    const today = new Date().toISOString().split('T')[0];
    this.productForm = this.formBuilder.group({
      id: [''], // 'id' es un string
      itemType: ['', [Validators.required]], // 'itemType' es un string
      code: ['', [Validators.required]], // 'code' es un string
      description: ['', [Validators.required]], // 'description' es un string
      minQuantity: [null, [Validators.required, Validators.min(0)]], // 'minQuantity' es un número
      maxQuantity: [null, [Validators.required, Validators.min(0)]], // 'maxQuantity' es un número
      taxPercentage: [null, [Validators.required, Validators.min(0), Validators.max(100)]], // 'taxPercentage' es un número
      creationDate: [today, [Validators.required]], // 'creationDate' es un Date
      unitOfMeasure: [null, [Validators.required]], // 'unitOfMeasure' es un objeto
      supplier: ['', [Validators.required]], // 'supplier' es un string
      category: [null, [Validators.required]], // 'category' es un objeto
      price: [null, [Validators.required, Validators.min(0)]] // 'price' es un número
    }, { validators: minMaxValidator });  
    this.initForm();


    // Obtiene todas las unidades de medida al inicializar el componente
    //  this.getUnitOfMeasures();

    // Obtiene todas las categorías al inicializar el componente
    // this.getCategories();

  this.getThirdParties();
  }

  // Método para obtener la lista de proveedores
getThirdParties(): void {

  this.thirdService.getThirdParties().subscribe(
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

  //Metodo Complementario
  initForm(): void {
    // Definir el formulario reactivo con las validaciones
    this.productForm = this.formBuilder.group({
      id: [this.nextProductId], // Asigna el próximo ID al campo 'id'
      itemType: ['', [Validators.required]],
      code: ['', [Validators.required]],
      description: ['', [Validators.required]],
      minQuantity: [null, [Validators.required, Validators.min(0)]],
      maxQuantity: [null, [Validators.required, Validators.min(0)]],
      taxPercentage: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      creationDate: [new Date().toISOString().split('T')[0], [Validators.required]],
      unitOfMeasure: [null, [Validators.required]],
      supplier: ['', [Validators.required]],
      category: [null, [Validators.required]],
      price: [null, [Validators.required, Validators.min(0)]]
    });
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
//______________________________________________________________________________

  //Metodo de validacion para devolver true o false
  isFormValid(): boolean {
    const formValue = this.productForm.value;

    // Verifica que los campos de tipo 'string' no estén vacíos
    const areTextFieldsValid =formValue.itemType.trim() !== '' &&
                              formValue.code.trim() !== '' &&
                              formValue.description.trim() !== '' &&
                              formValue.unitOfMeasure && // Suponiendo que esto sea un valor seleccionado, no un objeto
                              formValue.supplier.trim() !== '' &&
                              formValue.category; // Suponiendo que esto sea un valor seleccionado, no un objeto

    // Verifica que los números no sean negativos y que la fecha sea válida
    const areNumberFieldsValid = formValue.minQuantity !== null && // Revisar que no sea null
                                formValue.maxQuantity !== null && // Revisar que no sea null
                                formValue.minQuantity >= 0 &&
                                formValue.maxQuantity >= 0 &&
                                formValue.taxPercentage !== null && // Revisar que no sea null
                                formValue.taxPercentage >= 0 &&
                                formValue.taxPercentage <= 100 &&
                                formValue.price !== null && // Revisar que no sea null
                                formValue.price >= 0;

    // Verifica que la fecha de creación sea válida
    const isDateValid = formValue.creationDate && new Date(formValue.creationDate).toString() !== 'Invalid Date';

    // Verifica que minQuantity sea menor que maxQuantity
    const isMinMaxQuantityValid = formValue.minQuantity <= formValue.maxQuantity;

    return areTextFieldsValid && areNumberFieldsValid && isDateValid && isMinMaxQuantityValid;
  }
  //Método para enviar el formulario y crear un nuevo producto
  onSubmit(): void {
  this.formSubmitAttempt = true;

  if (this.isFormValid()) {
    const productData: Product = this.productForm.value;
    this.productService.createProduct(productData).subscribe(
      (response: any) => {
        // Mensaje de éxito con alert
        Swal.fire({
          title: 'Creación exitosa!',
          text: 'Se ha creado el producto con éxito!',
          icon: 'success',
        });
        
        // Restablece el formulario con la fecha actual
        this.resetFormWithCurrentDate();        
        this.formSubmitAttempt = false; // Reinicia el estado del intento de envío
        // Incrementa el contador del ID del producto
        this.nextProductId++;
        // Vuelve a inicializar el formulario con el nuevo ID
        this.initForm();
      },
      (error) => {
        // Mensaje de error con alert
        Swal.fire({
          title: 'Error!',
          text: 'Ha ocurrido un error al crear la empresa.',
          icon: 'error',
        });
      }
    );
  } else {
    // Mensaje de error si el formulario es inválido
    alert('No se pudo crear el producto. Por favor revisa los campos.');
  }
  }
  //Metodo para Resetear Fecha actual
  resetFormWithCurrentDate(): void {
    this.productForm.reset({
      creationDate: new Date().toISOString().split('T')[0]
    });
  }
  
}

  // Funcion para validar que el maximo y minimo tengan valores coherentes 
  function minMaxValidator(group: FormGroup): { [key: string]: any } | null {
    const min = group.controls['minQuantity'].value;
    const max = group.controls['maxQuantity'].value;
    return min !== null && max !== null && min <= max ? null : { 'minMaxInvalid': true };
  }



