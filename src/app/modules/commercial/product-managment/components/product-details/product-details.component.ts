import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductList } from '../../models/Product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-details-modal',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsModalComponent {
  inputData: any;
  productData: ProductList = {
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProductDetailsModalComponent>,
    private formBuilder: FormBuilder,
    private service: ProductService
  ) {}

  closePopup(): void {
    this.dialogRef.close('closing from modal details');
  }

  ngOnInit(): void {
    this.inputData = this.data;
    console.log(this.inputData);
    if (this.inputData.product.id > 0) {
      this.productData = this.inputData.product;
    }

    console.log(this.productData);
  }
}
