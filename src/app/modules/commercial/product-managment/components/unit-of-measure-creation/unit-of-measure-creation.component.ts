import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UnitOfMeasureService } from '../../services/unit-of-measure.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { buttonColors } from '../../../../../shared/buttonColors';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryCreationComponent } from '../category-creation/category-creation.component';

/**
 * Componente para la creación de una unidad de medida
 */
@Component({
  selector: 'app-unit-of-measure-creation',
  templateUrl: './unit-of-measure-creation.component.html',
  styleUrl: './unit-of-measure-creation.component.css'
})
export class UnitOfMeasureCreationComponent implements OnInit{
  /**
   * Variables del componente
   */
  @Input() isDialog: boolean = false; // Variable para saber si es un diálogo
  unitOfMeasureForm: FormGroup = this.formBuilder.group({});  // Variable para almacenar el formulario
  localStorageMethods: LocalStorageMethods = new LocalStorageMethods(); // Variable para almacenar los métodos de almacenamiento local
  entData: any | null = null; // Variable para almacenar los datos de la empresa

  /**
   * Constructor del componente
   * @param formBuilder 
   * @param unitOfMeasureService 
   * @param router 
   * @param data 
   * @param dialogRef 
   */
  constructor(
    private formBuilder: FormBuilder,
    private unitOfMeasureService: UnitOfMeasureService,
    private router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, 
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
    this.unitOfMeasureForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      abbreviation: ['', [Validators.required]],
    });
    this.entData = this.localStorageMethods.loadEnterpriseData();

  }

  /**
   * Método para enviar el formulario
   */
  onSubmit(): void {
    if (this.unitOfMeasureForm.valid) {
      const unitOfMeasureData = this.unitOfMeasureForm.value;

      unitOfMeasureData.enterpriseId = this.entData;
      this.unitOfMeasureService.createUnitOfMeasure(unitOfMeasureData).subscribe(
        () => {
          Swal.fire({
            title: 'Creación exitosa',
            text: 'Se ha creado la Unidad de medida con éxito!',
            icon: 'success',
            confirmButtonColor: buttonColors.confirmationColor,
            confirmButtonText: 'Aceptar'
          });
          if (this.dialogRef) {
            this.dialogRef.close();  // Close dialog after successful creation
          } else {
            this.resetForm();  // Reset form if not using dialog
          }
        },
        error => {
          console.error('Error al crear la Unidad de medida :', error);
          Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error al crear la Unidad de medida .',
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
        confirmButtonColor: buttonColors.confirmationColor,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  /**
   * Método para redirigir a la lista de unidades de medida
   */
  goBack(): void {
    this.router.navigate(['/general/operations/unities']);
  }

  /**
   * Método para resetear el formulario
   */
  resetForm(): void {
    this.unitOfMeasureForm.reset();
  }
}
