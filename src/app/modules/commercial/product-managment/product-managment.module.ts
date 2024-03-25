import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; 
import { ProductManagmentRoutingModule } from './product-managment-routing.module';
import { ProductCreationComponent } from './components/product-creation/product-creation.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
    declarations: [
        ProductCreationComponent,
        ProductListComponent
    ],
    exports: [
        ProductCreationComponent,
        ProductListComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ProductManagmentRoutingModule,
        SharedModule
    ]
})
export class ProductManagmentModule { }
