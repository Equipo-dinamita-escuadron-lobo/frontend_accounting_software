import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { ProductTypeService } from '../../services/product-type-service.service';
import { buttonColors } from '../../../../../shared/buttonColors';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryCreationComponent } from '../category-creation/category-creation.component';

/**
 * Componente para la creación de un tipo de producto
 */
@Component({
  selector: 'app-product-type-creation',
  templateUrl: './product-type-creation.component.html',
  styleUrls: ['./product-type-creation.component.css']
})
export class ProductTypeCreationComponent implements OnInit {
  /**
   * Variables del componente
   */
  @Input() isDialog: boolean = false; // Variable para saber si es un diálogo
  productTypeForm: FormGroup = this.formBuilder.group({});  // Variable para almacenar el formulario
  localStorageMethods: LocalStorageMethods = new LocalStorageMethods(); // Variable para almacenar los métodos de almacenamiento local
  entData: any | null = null; // Variable para almacenar los datos de la empresa

  /**
   * Constructor del componente
   * @param formBuilder 
   * @param productTypeService 
   * @param router 
   * @param data 
   * @param dialogRef
   */
  constructor(
    private formBuilder: FormBuilder,
    private productTypeService: ProductTypeService,
    private router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, // Inyectar los datos solo cuando es un diálogo
    @Optional() public dialogRef: MatDialogRef<CategoryCreationComponent> 
  ) {
    if (data && data.isDialog !== undefined) {
      this.isDialog = data.isDialog;
    }
  }

  /**
   * Método para inicializar el componente
   */
  ngOnInit(): void {
    this.productTypeForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
    this.entData = this.localStorageMethods.loadEnterpriseData(); // Get enterprise data from local storage
  }

  /**
   * Método para enviar el formulario
   */
  onSubmit(): void {
    if (this.productTypeForm.valid) {
      const productTypeData = this.productTypeForm.value;

      productTypeData.enterpriseId = this.entData; // Add enterprise ID
      this.productTypeService.createProductType(productTypeData).subscribe(
        () => {
          Swal.fire({
            title: 'Creación exitosa',
            text: 'Se ha creado el tipo de producto con éxito!',
            icon: 'success',
            confirmButtonColor: buttonColors.confirmationColor,
            confirmButtonText: 'Aceptar'
          });
          if (this.dialogRef) {
            this.dialogRef.close();
          } else {
            this.resetForm(); 
          }
        },
        error => {
          console.error('Error al crear el tipo de producto:', error);
          Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al crear el tipo de producto.',
            icon: 'error',
            confirmButtonColor: buttonColors.confirmationColor,
            confirmButtonText: 'Aceptar'
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, complete todos los campos.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  }

  /**
   * Método para regresar a la lista de tipos de producto
   */
  goBack(): void {
    this.router.navigate(['/general/operations/product-types']); // Adjust the route as needed
  }

  /**
   * Método para resetear el formulario
   */
  resetForm(): void {
    this.productTypeForm.reset();
  }
}
