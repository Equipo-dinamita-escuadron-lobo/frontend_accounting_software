import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductManagmentRoutingModule } from './product-managment-routing.module';
import { ProductCreationComponent } from './components/product-creation/product-creation.component';


@NgModule({
  declarations: [
    ProductCreationComponent
  ],
  imports: [
    CommonModule,
    ProductManagmentRoutingModule
  ],
  exports: [ProductCreationComponent
  ]
})
export class ProductManagmentModule { }
