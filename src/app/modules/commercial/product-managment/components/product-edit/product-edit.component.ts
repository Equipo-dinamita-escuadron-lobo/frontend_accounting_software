import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/Product';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

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
    private formBuilder: FormBuilder,
    private router: Router
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
          // Mostrar mensaje de éxito
          Swal.fire({
            title: 'Edición exitosa!',
            text: 'Se ha editado el producto exitosamente!',
            icon: 'success',
          });
          // Puedes redirigir al usuario a otra página aquí si lo deseas
        },
        (error) => {
          console.error('Error al editar el producto:', error);
          // Mostrar mensaje de error
          Swal.fire({
            title: 'Error!',
            text: 'Ha ocurrido un error al editar el producto.',
            icon: 'error',
          });
        }
      );
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, completa correctamente el formulario antes de enviarlo.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  }

  //Metodo para formatear el precio
  formatPrice(event: any) {
    const priceInput = event.target.value.replace(/\D/g, ''); // Remover caracteres no numéricos
    let formattedPrice = '';
    if (priceInput !== '') {
        formattedPrice = parseInt(priceInput).toLocaleString('es-ES'); // Formatear el precio solo si no está vacío
    }
    this.editForm.get('price')?.setValue(formattedPrice);
  }

  goBack(): void {
    this.router.navigate(['/product-list']);
  }
  
}

// Función para validar que el maximo y minimo tengan valores coherentes 
function minMaxValidator(group: FormGroup): { [key: string]: any } | null {
  const min = group.controls['minQuantity'].value;
  const max = group.controls['maxQuantity'].value;
  return min !== null && max !== null && min <= max ? null : { 'minMaxInvalid': true };
}
