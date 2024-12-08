import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';
import { ProductType } from '../../models/ProductType';
import { ProductTypeService } from '../../services/product-type-service.service';
import { buttonColors } from '../../../../../shared/buttonColors';

/**
 * Componente para editar un tipo de producto
 */
@Component({
  selector: 'app-product-type-edit',
  templateUrl: './product-type-edit.component.html',
  styleUrls: ['./product-type-edit.component.css']
})
export class ProductTypeEditComponent implements OnInit {
  /**
   * Variables del componente
   */
  productTypeForm: FormGroup; // Variable para almacenar el formulario
  productTypeName: string | null = null;  // Variable para almacenar el nombre del tipo de producto
  productTypeId: string = ''; // Variable para almacenar el ID del tipo de producto
  typeProduct: ProductType = {} as ProductType; // Variable para almacenar el tipo de producto

  /**
   * Constructor del componente
   * @param route 
   * @param formBuilder 
   * @param productTypeService 
   * @param router 
   */
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

  /**
   * Método para inicializar el componente
   */
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productTypeId = params['id']; // Obtener el ID del producto de los parámetros de ruta
      this.getTypeProduct(); // Llamar a la función para obtener los detalles del tipo de producto
    });
    if (this.productTypeName) {
      this.productTypeService.getProductTypeById(this.productTypeName).subscribe(productType => {
        this.productTypeForm.patchValue(productType);
      });
    }
  }

  /**
   * Método para enviar el formulario
   */
  onSubmit(): void {
    if (this.productTypeName) {
      this.productTypeService.updateProductType(this.productTypeName, this.productTypeForm.value).subscribe(
        () => {
          Swal.fire('Actualización exitosa',  'El tipo de producto ha sido actualizado.', 'success');
          this.router.navigate(['/general/operations/product-types']);
        },
        error => {
          console.error('Error al actualizar el tipo de producto:', error);
          Swal.fire('Error', 'Ha ocurrido un error al actualizar el tipo de producto.', 'error');
        }
      );
    }
  }

  /**
   * Método para obtener los detalles del tipo de producto
   */
  getTypeProduct(): void {
    this.productTypeService.getProductTypeById(this.productTypeId).subscribe(
      (Type: ProductType) => {
        this.typeProduct = Type;
        console.log(this.typeProduct);

        // Puedes asignar los valores del producto al formulario de edición aquí
        this.productTypeForm.patchValue({
          name: this.typeProduct.name,
          description: this.typeProduct.description
        });
      },
      error => {
        console.error('Error obteniendo detalles del producto:', error);
      }
    );
  }

  /**
   * Método para eliminar un tipo de producto
   */
  deleteProductType(): void {
    if (this.productTypeName) {
      this.productTypeService.deleteProductType(this.productTypeName).subscribe(
        () => {
          Swal.fire('Eliminación exitosa', 'El tipo de producto ha sido eliminado.', 'success');
          this.router.navigate(['/general/operations/product-types']);
        },
        error => {
          console.error('Error al eliminar el tipo de producto:', error);
          Swal.fire('Error', 'Ha ocurrido un error al eliminar el tipo de producto.', 'error');
        }
      );
    }
  }

  /**
   * Método para regresar
   */
  goBack(): void {
    this.router.navigate(['/general/operations/product-types']);
  }
}
