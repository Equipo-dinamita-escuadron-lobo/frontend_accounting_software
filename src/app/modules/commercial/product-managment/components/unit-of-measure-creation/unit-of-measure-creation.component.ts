import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UnitOfMeasureService } from '../../services/unit-of-measure.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-unit-of-measure-creation',
  templateUrl: './unit-of-measure-creation.component.html',
  styleUrl: './unit-of-measure-creation.component.css'
})
export class UnitOfMeasureCreationComponent implements OnInit{
  unitOfMeasureForm: FormGroup = this.formBuilder.group({});

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
  }

  onSubmit(): void {
    if (this.unitOfMeasureForm.valid) {
      const unitOfMeasureData = this.unitOfMeasureForm.value;
      this.unitOfMeasureService.createUnitOfMeasure(unitOfMeasureData).subscribe(
        () => {
          Swal.fire({
            title: 'Creación exitosa!',
            text: 'Se ha creado la Unidad de medida con éxito!',
            icon: 'success',
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
            confirmButtonText: 'Aceptar'
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, complete todos los campos.',
        icon: 'error',
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
  