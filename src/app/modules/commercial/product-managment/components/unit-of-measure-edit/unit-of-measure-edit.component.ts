import { Component, OnInit } from '@angular/core';
import { UnitOfMeasure } from '../../models/UnitOfMeasure';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UnitOfMeasureService } from '../../services/unit-of-measure.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { buttonColors } from '../../../../../shared/buttonColors';

@Component({
  selector: 'app-unit-of-measure-edit',
  templateUrl: './unit-of-measure-edit.component.html',
  styleUrl: './unit-of-measure-edit.component.css'
})
export class UnitOfMeasureEditComponent implements OnInit{
  unitOfMeasureId: string = '';
  unitOfMeasure: UnitOfMeasure = {} as UnitOfMeasure;
  editForm: FormGroup;
  unitOfMeasureForm: FormGroup = this.formBuilder.group({});
  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
  entData: any | null = null;

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
  ngOnInit(): void {
    this.entData = this.localStorageMethods.loadEnterpriseData();

    if (this.entData) {
    this.route.params.subscribe(params => {
      this.unitOfMeasureId = params['id'];
      this.unitOfMeasureDetails();
    });
  }
  }
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

  onSubmit(): void {
    if (this.editForm.valid) {
      const formData = this.editForm.value;

      formData.enterpriseId = this.entData;
      formData.state = 'true';

      this.unitOfMeasureService.updateUnitOfMeasureId(this.unitOfMeasureId, formData).subscribe(
        (unitOfMeasure: UnitOfMeasure) => {
          console.log('Category updated successfully: ', unitOfMeasure);
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
    this.unitOfMeasureForm.reset();  }
}
