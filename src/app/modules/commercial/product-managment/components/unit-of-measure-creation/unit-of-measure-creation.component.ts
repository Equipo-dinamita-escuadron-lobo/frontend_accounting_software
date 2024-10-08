import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UnitOfMeasureService } from '../../services/unit-of-measure.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { buttonColors } from '../../../../../shared/buttonColors';

@Component({
  selector: 'app-unit-of-measure-creation',
  templateUrl: './unit-of-measure-creation.component.html',
  styleUrl: './unit-of-measure-creation.component.css'
})
export class UnitOfMeasureCreationComponent implements OnInit{
  unitOfMeasureForm: FormGroup = this.formBuilder.group({});
  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
  entData: any | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private unitOfMeasureService: UnitOfMeasureService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.unitOfMeasureForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      abbreviation: ['', [Validators.required]],
    });
    this.entData = this.localStorageMethods.loadEnterpriseData();

  }

  onSubmit(): void {
    if (this.unitOfMeasureForm.valid) {
      const unitOfMeasureData = this.unitOfMeasureForm.value;

      unitOfMeasureData.enterpriseId = this.entData;
      this.unitOfMeasureService.createUnitOfMeasure(unitOfMeasureData).subscribe(
        () => {
          Swal.fire({
            title: 'Creación exitosa!',
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
            title: 'Error!',
            text: 'Ha ocurrido un error al crear la Unidad de medida .',
            icon: 'error',
            confirmButtonColor: buttonColors.confirmationColor,
            confirmButtonText: 'Aceptar'
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, complete todos los campos.',
        icon: 'error',
        confirmButtonColor: buttonColors.confirmationColor,
        confirmButtonText: 'Aceptar'
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/general/operations/unities']);
  }

  resetForm(): void {
    this.unitOfMeasureForm.reset();
  }
}
