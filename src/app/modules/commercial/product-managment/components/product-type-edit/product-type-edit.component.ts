import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { ProductTypeService } from '../../services/product-type-service.service';
import { buttonColors } from '../../../../../shared/buttonColors';


@Component({
  selector: 'app-product-type-edit',
  templateUrl: './product-type-edit.component.html',
  styleUrls: ['./product-type-edit.component.css']
})
export class ProductTypeEditComponent implements OnInit {
  productTypeForm: FormGroup;
  productTypeId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private productTypeService: ProductTypeService,
    private router: Router,
  ) {
    this.productTypeForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.productTypeId = this.route.snapshot.paramMap.get('id');
    if (this.productTypeId) {
      this.productTypeService.getProductTypeById(this.productTypeId).subscribe(productType => {
        this.productTypeForm.patchValue(productType);
      });
    }
  }

  onSubmit(): void {
    if (this.productTypeId) {
      this.productTypeService.updateProductType(this.productTypeId, this.productTypeForm.value).subscribe(
        () => {
          Swal.fire('Actualización exitosa!',  'El tipo de producto ha sido actualizado.', 'success');
          this.router.navigate(['/general/operations/product-types']);
        },
        error => {
          console.error('Error al actualizar el tipo de producto:', error);
          Swal.fire('Error!', 'Ha ocurrido un error al actualizar el tipo de producto.', 'error');
        }
      );
    }
  }

  deleteProductType(): void {
    if (this.productTypeId) {
      this.productTypeService.deleteProductType(this.productTypeId).subscribe(
        () => {
          Swal.fire('Eliminación exitosa!', 'El tipo de producto ha sido eliminado.', 'success');
          this.router.navigate(['/general/operations/product-types']);
        },
        error => {
          console.error('Error al eliminar el tipo de producto:', error);
          Swal.fire('Error!', 'Ha ocurrido un error al eliminar el tipo de producto.', 'error');
        }
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/general/operations/product-types']);
  }
}
