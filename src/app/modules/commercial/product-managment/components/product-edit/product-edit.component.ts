import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/Product';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  productId: string = '';
  product: Product = {} as Product;
  editForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private formBuilder: FormBuilder
  ) {
    this.editForm = this.formBuilder.group({
      itemType: ['', Validators.required],
      code: ['', Validators.required],
      description: ['', Validators.required],
      minQuantity: [null, [Validators.required, Validators.min(0)]],
      maxQuantity: [null, [Validators.required, Validators.min(0)]],
      taxPercentage: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      creationDate: [null, Validators.required],
      unitOfMeasure: [null, Validators.required],
      supplier: ['', Validators.required],
      category: [null, Validators.required],
      price: [null, Validators.required]
    }, { validators: minMaxValidator });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = params['id']; // Obtener el ID del producto de los parámetros de ruta
      this.getProductDetails(); // Llamar a la función para obtener los detalles del producto
    });
  }

  getProductDetails(): void {
    this.productService.getProductById(this.productId).subscribe(
      (product: Product) => {
        this.product = product;
        // Puedes asignar los valores del producto al formulario de edición aquí
        this.editForm.patchValue({
          itemType: product.itemType,
          code: product.code,
          description: product.description,
          minQuantity: product.minQuantity,
          maxQuantity: product.maxQuantity,
          taxPercentage: product.taxPercentage,
          creationDate: product.creationDate,
          unitOfMeasure: product.unitOfMeasure,
          supplier: product.supplier,
          category: product.category,
          price: product.price
        });
      },
      error => {
        console.error('Error obteniendo detalles del producto:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const updatedProduct: Product = this.editForm.value;
      updatedProduct.id= this.productId; // Asignar el ID del producto a la propiedad _id del objeto
      // Agrega cualquier lógica adicional necesaria antes de enviar los datos al servidor
      this.productService.updateProduct(updatedProduct).subscribe(
        (response: Product) => {
          // Manejar la respuesta del servidor, por ejemplo, mostrar un mensaje de éxito
          console.log('Producto actualizado exitosamente:', response);
        },
        (error) => {
          console.error('Error al actualizar el producto:', error);
          // Puedes mostrar un mensaje de error al usuario aquí si lo deseas
        }
      );
    } else {
      // Si el formulario no es válido, puedes mostrar un mensaje al usuario para corregir los campos
      console.error('El formulario de edición no es válido.');
    }
  }
  
}

// Función para validar que el maximo y minimo tengan valores coherentes 
function minMaxValidator(group: FormGroup): { [key: string]: any } | null {
  const min = group.controls['minQuantity'].value;
  const max = group.controls['maxQuantity'].value;
  return min !== null && max !== null && min <= max ? null : { 'minMaxInvalid': true };
}
