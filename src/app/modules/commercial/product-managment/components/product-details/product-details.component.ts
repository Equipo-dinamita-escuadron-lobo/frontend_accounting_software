import { Component, Inject, defineInjectable } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms'; 
import { Product } from '../../models/Product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-details-modal',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsModalComponent {
  inputData: any;
  productData: Product = {
    id: '',
    itemType: '',
    code: '',
    description: '',
    minQuantity: 0,
    maxQuantity: 0,
    taxPercentage: 0,
    creationDate: new Date(),
    unitOfMeasureId: 0,
    supplierId: 0,
    categoryId: 0,
    price: 0,
    enterpriseId:0,
    state: ''
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProductDetailsModalComponent>,
    private formBuilder: FormBuilder,
    private service: ProductService
  ) { }

  closePopup(): void {
    this.dialogRef.close('closing from modal details');
  }

  ngOnInit(): void {
    this.inputData = this.data;
    console.log(this.inputData);
    if(this.inputData.productId > 0){

      this.service.getProductById(this.inputData.productId).subscribe(
        product => {
        this.productData = product;
      });
    } 
    console.log(this.productData);
  }
}
