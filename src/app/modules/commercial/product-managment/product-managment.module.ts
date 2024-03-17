import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; 
import { ProductManagmentRoutingModule } from './product-managment-routing.module';
import { ProductCreationComponent } from './components/product-creation/product-creation.component';
import { ProductListComponent } from './components/product-list/product-list.component';

@NgModule({
  declarations: [
    ProductCreationComponent,
    ProductListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    ProductManagmentRoutingModule
  ],
  exports: [
    ProductCreationComponent,
    ProductListComponent
  ]
})
export class ProductManagmentModule { }
