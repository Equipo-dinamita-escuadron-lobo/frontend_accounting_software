import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductList } from '../../models/Product';
import { ProductService } from '../../services/product.service';

/**
 * Componente para mostrar los detalles de un producto
 */
@Component({
  selector: 'app-product-details-modal',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsModalComponent {
  /**
   * Variables del componente
   */
  inputData: any; // Variable para almacenar los datos de entrada
  productData: ProductList = {  // Variable para almacenar los datos del producto
    id: '',
    code: '',
    itemType: '',
    description: '',
    quantity: 0,
    taxPercentage: 0,
    creationDate: new Date(),

    unitOfMeasureName: '',
    //supplierName: '',
    categoryName: '',

    enterpriseId: '',

    cost: 0,
    state: '',
    reference: '',
    productTypeName: '',
  };

  /**
   * Constructor del componente
   * @param data 
   * @param dialogRef 
   * @param formBuilder 
   * @param service
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProductDetailsModalComponent>,
    private formBuilder: FormBuilder,
    private service: ProductService
  ) {}

  closePopup(): void {
    this.dialogRef.close('closing from modal details');
  }

  /**
   * Método para inicializar el componente
   */
  ngOnInit(): void {
    this.inputData = this.data;
    console.log(this.inputData);
    if (this.inputData.product.id > 0) {
      this.productData = this.inputData.product;
    }

    console.log(this.productData);
  }
}
