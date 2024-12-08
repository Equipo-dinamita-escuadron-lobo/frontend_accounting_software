import { Component, OnInit } from '@angular/core';
import { UnitOfMeasure } from '../../models/UnitOfMeasure';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UnitOfMeasureService } from '../../services/unit-of-measure.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { buttonColors } from '../../../../../shared/buttonColors';

/**
 * Componente para editar una unidad de medida
 */
@Component({
  selector: 'app-unit-of-measure-edit',
  templateUrl: './unit-of-measure-edit.component.html',
  styleUrl: './unit-of-measure-edit.component.css'
})
export class UnitOfMeasureEditComponent implements OnInit{
  /**
   * Variables del componente
   */
  unitOfMeasureId: string = ''; // Variable para almacenar el ID de la unidad de medida
  unitOfMeasure: UnitOfMeasure = {} as UnitOfMeasure; // Variable para almacenar la unidad de medida
  editForm: FormGroup;  // Variable para almacenar el formulario
  unitOfMeasureForm: FormGroup = this.formBuilder.group({});  // Variable para almacenar el formulario
  localStorageMethods: LocalStorageMethods = new LocalStorageMethods(); // Variable para almacenar los métodos de almacenamiento local
  entData: any | null = null; // Variable para almacenar los datos de la empresa

  /**
   * Constructor del componente
   * @param route 
   * @param unitOfMeasureService 
   * @param formBuilder 
   * @param router 
   */
  constructor(
    private route: ActivatedRoute,
    private unitOfMeasureService: UnitOfMeasureService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.editForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      abbreviation: ['', Validators.required]
    });
  }
  /**
   * Método para inicializar el componente
   */
  ngOnInit(): void {
    this.entData = this.localStorageMethods.loadEnterpriseData();

    if (this.entData) {
      this.route.params.subscribe(params => {
        this.unitOfMeasureId = params['id'];
        this.unitOfMeasureDetails();
      });
    }
  }
  /**
   * Método para obtener los detalles de la unidad de medida
   */
  unitOfMeasureDetails(): void {
    this.unitOfMeasureService.getUnitOfMeasuresId(this.unitOfMeasureId).subscribe(
      (unitOfMeasure: UnitOfMeasure) => {
        this.unitOfMeasure = unitOfMeasure;
        this.editForm.patchValue({
          name: unitOfMeasure.name,
          description: unitOfMeasure.description,
          abbreviation: unitOfMeasure.abbreviation,
          return: unitOfMeasure.abbreviation
        });
      },
      error => {
        console.error('Error getting unit Of Measure details: ', error);
      }
    );
    console.log('unit Of Measure details: ', this.unitOfMeasure);
  }

  /**
   * Método para enviar el formulario
   */
  onSubmit(): void {
    if (this.editForm.valid) {
      const formData = this.editForm.value;

      formData.enterpriseId = this.entData;
      formData.state = 'true';

      this.unitOfMeasureService.updateUnitOfMeasureId(this.unitOfMeasureId, formData).subscribe(
        (unitOfMeasure: UnitOfMeasure) => {
          console.log('Category updated successfully: ', unitOfMeasure);
          Swal.fire({
            title: 'Creación exitosa',
            text: 'Se ha creado la Unidad de medida con éxito!',
            icon: 'success',
            confirmButtonColor: buttonColors.confirmationColor,
            confirmButtonText: 'Aceptar'
          });
          this.resetForm();
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
    this.unitOfMeasureForm.reset();  }
}
