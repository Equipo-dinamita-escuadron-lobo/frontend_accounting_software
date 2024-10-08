import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importa los módulos necesarios para trabajar con formularios reactivos
import { ProductService } from '../../services/product.service';
import { UnitOfMeasureService } from '../../services/unit-of-measure.service';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
import { Product } from '../../models/Product';
import Swal from 'sweetalert2';
import { ThirdServiceService } from '../../../third-parties-managment/services/third-service.service';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { buttonColors } from '../../../../../shared/buttonColors';

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
  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
  entData: any | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private unitOfMeasureService: UnitOfMeasureService,
    private categoryService: CategoryService,
    private thirdService: ThirdServiceService, // Inyecta el servicio ThirdService en el constructor,
    private router: Router
  ) {}



  ngOnInit(): void {
    this.entData = this.localStorageMethods.loadEnterpriseData();

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
      unitOfMeasureId: [null, [Validators.required, Validators.pattern(/^\d+$/)]], // 'unitOfMeasureId' es un número
      supplierId: [null, [Validators.required, Validators.pattern(/^\d+$/)]], // 'supplierId' es un número
      categoryId: [null, [Validators.required, Validators.pattern(/^\d+$/)]], // 'categoryId' es un número
      price: [null, [Validators.required, Validators.min(0)]] // 'price' es un número
    }
    ,{ validators: minMaxValidator });
    if (this.entData) {

    this.initForm();
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
      code: ['', [Validators.required]],
      description: ['', [Validators.required]],
      minQuantity: [null, [Validators.required, Validators.min(0)]],
      maxQuantity: [null, [Validators.required, Validators.min(0)]],
      taxPercentage: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      creationDate: [new Date().toISOString().split('T')[0], [Validators.required]],
      unitOfMeasureId: [null, [Validators.required, Validators.pattern(/^\d+$/)]], // 'unitOfMeasureId' es un número
      supplierId: [null, [Validators.required, Validators.pattern(/^\d+$/)]], // 'supplierId' es un número
      categoryId: [null, [Validators.required, Validators.pattern(/^\d+$/)]], // 'categoryId' es un número
      price: [null, [Validators.required, Validators.min(0)]]
    });
  }

  //Metodo de validacion para devolver true o false
  isFormValid(): boolean {
    const formValue = this.productForm.value;

    // Verifica que los campos de tipo 'string' no estén vacíos
    const areTextFieldsValid =formValue.itemType.trim() !== '' &&
                              formValue.code.trim() !== '' &&
                              formValue.description.trim() !== ''// Suponiendo que esto sea un valor seleccionado, no un objeto

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
    const formData = this.productForm.value;

    // Convertir supplierId a número si es una cadena
    formData.supplierId = parseInt(formData.supplierId, 10);
    formData.categoryId = parseInt(formData.categoryId, 10);
    formData.unitOfMeasureId = parseInt(formData.unitOfMeasureId, 10);
    formData.price = parseInt(formData.price, 10);

    formData.enterpriseId = this.entData;


    this.productService.createProduct(formData).subscribe(
      (response: any) => {
        // Mensaje de éxito con alert
        Swal.fire({
          title: 'Creación exitosa!',
          text: 'Se ha creado el producto con éxito!',
          icon: 'success',
          confirmButtonColor: buttonColors.confirmationColor,
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
          text: 'Ha ocurrido un error al crear el producto.',
          confirmButtonColor: buttonColors.confirmationColor,
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
    // Obtener la fecha actual en UTC
    const currentDateUTC = new Date();

    // Convertir la fecha UTC a la zona horaria GMT-5 (Hora Estándar del Este, EST)
    const currentDateEST = new Date(currentDateUTC.getTime() - (5 * 60 * 60 * 1000));

    // Formatear la fecha EST como una cadena en formato ISO
    const formattedDate = currentDateEST.toISOString().split('T')[0];

    // Restablecer el formulario con la fecha ajustada
    this.productForm.reset({
      creationDate: formattedDate
    });

    console.log('Fecha actual:', formattedDate);
  }

  //Método para formatear el precio
  formatPrice(event: any) {
    let priceInput = event.target.value.replace(/\D/g, ''); // Remover caracteres no numéricos
    let formattedPrice = '';
    if (priceInput !== '') {
      // Convertir el precio a número
      const price = parseInt(priceInput, 10);
      // Formatear el precio con separador de miles y decimales
      formattedPrice = this.formatNumberWithCommas(price);
    }
    // Establecer el valor formateado en el campo de precio del formulario
    this.productForm.get('price')?.setValue(formattedPrice);
  }

  // Función para formatear un número con separadores de miles
  formatNumberWithCommas(number: number): string {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }



  goBack(): void {
    this.router.navigate(['/general/operations/products']);
  }

}

  // Funcion para validar que el maximo y minimo tengan valores coherentes
  function minMaxValidator(group: FormGroup): { [key: string]: any } | null {
    const min = group.controls['minQuantity'].value;
    const max = group.controls['maxQuantity'].value;
    return min !== null && max !== null && min <= max ? null : { 'minMaxInvalid': true };
  }




