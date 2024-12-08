import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importa los módulos necesarios para trabajar con formularios reactivos
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { CategoryService } from '../../services/category.service';
import { ProductTypeService } from '../../services/product-type-service.service';
import { ProductService } from '../../services/product.service';
import { UnitOfMeasureService } from '../../services/unit-of-measure.service';
import { buttonColors } from '../../../../../shared/buttonColors';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CategoryCreationComponent } from '../category-creation/category-creation.component';
import { ProductTypeCreationComponent } from '../product-type-creation/product-type-creation.component';
import { UnitOfMeasureCreationComponent } from '../unit-of-measure-creation/unit-of-measure-creation.component';
import { TaxService } from '../../../taxes/services/tax.service';
import { Tax } from '../../../taxes/models/Tax';

/**
 * Componente para la creación de productos
 */
@Component({
  selector: 'app-product-creation',
  templateUrl: './product-creation.component.html',
  styleUrls: ['./product-creation.component.css'],
  
})

export class ProductCreationComponent implements OnInit {
  /**
   * Variables del componente
   */
  productForm: FormGroup = this.formBuilder.group({}); // Define un formulario reactivo para la creación de productos
  unitOfMeasures: any[] = []; // Inicializa la propiedad unitOfMeasures como un arreglo vacío
  categories: any[] = []; // Inicializa la propiedad categories como un arreglo vacío
  productTypes: any[] = []; // Inicializa la propiedad productTypes como un arreglo vacío
  taxes: any[] = [];  // Inicializa la propiedad taxes como un arreglo vacío

  formSubmitAttempt: boolean = false; // Inicializa el intento de envío del formulario como falso
  submitSuccess: boolean = false; // Inicializa el estado de éxito del envío del formulario como falso
  nextProductId: number = 1; // Inicializa el contador del ID del producto
  localStorageMethods: LocalStorageMethods = new LocalStorageMethods(); // Inicializa la variable para almacenar los métodos de almacenamiento local
  entData: any | null = null; // Inicializa la variable para almacenar los datos de la empresa
  
  /**
   * Constructor del componente
   * @param dialogRef 
   * @param formBuilder 
   * @param productService 
   * @param unitOfMeasureService 
   * @param categoryService 
   * @param productTypeService 
   * @param router 
   * @param dialog 
   * @param taxService 
   * @param data 
   */
  constructor(
    @Optional() private dialogRef: MatDialogRef<ProductCreationComponent>,
    
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private unitOfMeasureService: UnitOfMeasureService,
    private categoryService: CategoryService,
    private productTypeService: ProductTypeService,
    private router: Router,
    private dialog: MatDialog,
    private taxService: TaxService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: { destination?: string },

  ) {}

  /**
   * Método para inicializar el componente
   */
  ngOnInit(): void {
    this.entData = this.localStorageMethods.loadEnterpriseData();

    // Inicializa el formulario reactivo y define las validaciones necesarias para cada campo

    // TypeScript: Agregando validaciones para campos no negativos y no vacíos
    const today = new Date().toISOString().split('T')[0];
    this.productForm = this.formBuilder.group({
      id: [''], // 'id' es un string
      itemType: ['', [Validators.required]], // 'itemType' es un string
      description: ['', [Validators.required]], // 'description' es un string
      quantity: [null, [Validators.required, Validators.min(0)]], // 'quantity' es un número
      taxPercentage: [null, [Validators.required, Validators.min(0), Validators.max(100)]], // 'taxPercentage' es un número
      creationDate: [today, [Validators.required]], // 'creationDate' es un Date
      unitOfMeasureId: [null, [Validators.required, Validators.pattern(/^\d+$/)]], // 'unitOfMeasureId' es un número
      categoryId: [null, [Validators.required, Validators.pattern(/^\d+$/)]], // 'categoryId' es un número
      cost: [null, [Validators.required, Validators.min(0)]], // 'cost' es un número
      reference: [null, [Validators.pattern(/^\d+$/)]],// Asigna el próximo ID al campo 'id'
      productTypeId: [null, [ Validators.pattern(/^\d+$/)]], // Nuevo campo para el tipo de producto

    }
    ,{ validators: quantityValidator });
    if (this.entData) {
      this.initForm();
      this.getUnitOfMeasures();
      this.getCategories();
      this.loadProductTypes();
      this.getTaxes();
    }


  }

  /**
   * Método para cargar los tipos de producto
   */
  loadProductTypes(): void {
    this.productTypeService.getAllProductTypes().subscribe(
      (productTypes: any[]) => {
        this.productTypes = productTypes;
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
   * Método para decodificar un valor si es necesario
   * @param value 
   * @returns 
   */
  decodeIfNeeded(value: string): string {
    try {
      return decodeURIComponent(escape(value));
    } catch {
      return value;
    }
  }
  
  /**
   * Método para obtener las unidades de medida
   */
  getUnitOfMeasures(): void {
    this.unitOfMeasureService.getUnitOfMeasures(this.entData).subscribe(
      (data: any[]) => {
        this.unitOfMeasures = data.map(unit => ({
          ...unit,
          name: this.decodeIfNeeded(unit.name),
          abbreviation: this.decodeIfNeeded(unit.abbreviation),
          description: this.decodeIfNeeded(unit.description)
        }));

      },
      error => {
        console.log('Error al obtener las unidades de medida:', error);
      }
    );
  }

  /**
   * Método para obtener los impuestos
   */
  getTaxes() {
    this.entData = this.localStorageMethods.loadEnterpriseData();
    this.taxService.getTaxes(this.entData).subscribe(
      (data: Tax[]) => {
        this.taxes = data  
      },

    );
  }

  /**
   * Método para cambiar el estado de una unidad de medida
   * @param categoryId 
   */
  onCategoryChange(categoryId: any) {
    const selectedCategory = this.categories.find(category => category.id === categoryId);
    console.log(selectedCategory)
    if (selectedCategory) {
      const tax = this.taxes.find(tax => tax.id ==  selectedCategory.taxId)
      console.log(tax)
      this.productForm.get('taxPercentage')?.setValue(tax.interest);
    } else {
      this.productForm.get('taxPercentage')?.setValue(null); // Resetea si no hay categoría seleccionada
    }
  
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
      categoryId: [null, [Validators.required, Validators.pattern(/^\d+$/)]], // 'categoryId' es un número
      cost: [null, [Validators.required, Validators.min(0)]],
      reference: [null, ],// Asigna el próximo ID al campo 'id'
      productTypeId: [null, [ Validators.pattern(/^\d+$/)]], // Nuevo campo para el tipo de producto
    });
  }

  /**
   * Método para verificar si el formulario es válido
   * @returns boolean
   */
  isFormValid(): boolean {
    const formValue = this.productForm.value;

    // Verifica que los campos de tipo 'string' no estén vacíos
    const areTextFieldsValid =formValue.itemType.trim() !== '' &&
                              formValue.description.trim() !== ''// Suponiendo que esto sea un valor seleccionado, no un objeto

    // Verifica que los números no sean negativos y que la fecha sea válida
    const areNumberFieldsValid = formValue.quantity !== null && // Revisar que no sea null
                                formValue.quantity >= 0 &&
                                formValue.taxPercentage !== null && // Revisar que no sea null
                                formValue.taxPercentage >= 0 &&
                                formValue.taxPercentage <= 100 &&
                                formValue.cost !== null && // Revisar que no sea null
                                formValue.cost >= 0;

    // Verifica que la fecha de creación sea válida
    const isDateValid = formValue.creationDate && new Date(formValue.creationDate).toString() !== 'Invalid Date';

    // Verifica que quantity sea menor que maxQuantity
    //const isMinMaxQuantityValid = formValue.quantity <= formValue.maxQuantity;

    return areTextFieldsValid && areNumberFieldsValid && isDateValid;
  }

  /**
   * Método para enviar el formulario
   */
  onSubmit(): void {
    this.formSubmitAttempt = true;

    if (this.isFormValid()) {
      const formData = this.productForm.value;

      formData.categoryId = parseInt(formData.categoryId, 10);
      formData.unitOfMeasureId = parseInt(formData.unitOfMeasureId, 10);
      formData.cost = parseFloat(formData.cost.toString().replace(/\./g, '').replace(',', '.'));
      formData.productTypeId = parseInt(formData.productTypeId, 10);
      formData.enterpriseId = this.entData;
      
      this.productService.createProduct(formData).subscribe(
        (response: any) => {
          // Mensaje de éxito con alerta
          Swal.fire({
            title: 'Creación exitosa',
            text: 'Se ha creado el producto con éxito!',
            icon: 'success',
            confirmButtonColor: buttonColors.confirmationColor,
          });
          if(this.dialogRef){
            this.dialogRef.close('created');
          }

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
            title: 'Error',
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
  
  /**
   * Método para restablecer el formulario con la fecha actual
   */
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

  formatcost(event: any) {
    const inputValue = event.target.value;
    let formattedcost = '';

    if (inputValue !== '') {
        // Convertir el precio a número entero (asumiendo que no hay decimales)
        const cost = parseFloat(inputValue.replace(',', ''));
    }

    //this.productForm.get('cost')?.setValue(formattedcost);
  }

  /**
   * Método para regresar
   */
  goBack(): void { 
    if (this.data && this.data.destination === 'destination') {
      this.dialogRef?.close('close'); // Usar el operador de acceso opcional para dialogRef
    } else {
      this.router.navigate(['/general/operations/products']);
    }
  }

  /**
   * Método para abrir un modal con los detalles de una categoría
   * @param id 
   */
  openCategoryDialog(): void {
    const dialogRef = this.dialog.open(CategoryCreationComponent, {
      data: { isDialog: true }
    });
  
    dialogRef.afterClosed().subscribe(_ => {
      this.getCategories();
    });
  }

  /**
   * Método para abrir un modal con los detalles de un tipo de producto
   * @param id
   */
  openProductTypeDialog(): void {
    const dialogRef = this.dialog.open(ProductTypeCreationComponent , {
      data: { isDialog: true }
    });
    dialogRef.afterClosed().subscribe(_ => {
      this.loadProductTypes();
    });
  }

  /**
   * Método para abrir un modal con los detalles de una unidad de medida
   * @param id
   */
  openUnitOfMeasureDialog(): void {
    const dialogRef = this.dialog.open(UnitOfMeasureCreationComponent, {
      data: { isDialog: true }
    });
    dialogRef.afterClosed().subscribe(_ => {
      this.getUnitOfMeasures();
    });
  }
  
}

/**
 * Validador personalizado para la cantidad
 * @param group 
 * @returns 
 */
function quantityValidator(group: FormGroup): { [key: string]: any } | null {
  const quantity = group.controls['quantity'].value;
  return quantity !== null ? null : { 'quantityInvalid': true };
}




