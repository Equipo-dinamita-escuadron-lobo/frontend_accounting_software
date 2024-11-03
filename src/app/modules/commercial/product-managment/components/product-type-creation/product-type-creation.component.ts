import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { ProductTypeService } from '../../services/product-type-service.service';
import { buttonColors } from '../../../../../shared/buttonColors';


@Component({
  selector: 'app-product-type-creation',
  templateUrl: './product-type-creation.component.html',
  styleUrls: ['./product-type-creation.component.css']
})
export class ProductTypeCreationComponent implements OnInit {
  productTypeForm: FormGroup = this.formBuilder.group({});
  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
  entData: any | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private productTypeService: ProductTypeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.productTypeForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
    this.entData = this.localStorageMethods.loadEnterpriseData(); // Get enterprise data from local storage
  }

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
          this.resetForm();
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

  goBack(): void {
    this.router.navigate(['/general/operations/product-types']); // Adjust the route as needed
  }

  resetForm(): void {
    this.productTypeForm.reset();
  }
}
