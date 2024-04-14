import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; 
import { ProductManagmentRoutingModule } from './product-managment-routing.module';
import { ProductCreationComponent } from './components/product-creation/product-creation.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { SharedModule } from "../../../shared/shared.module";
import { FilterList } from './pipes/filter.pipe';
import { ProductEditComponent } from './components/product-edit/product-edit.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { FilterCategoryPipe } from './pipes/filter-category.pipe';

@NgModule({
    declarations: [
        ProductCreationComponent,
        ProductListComponent,
        FilterList,
        ProductEditComponent,
        CategoryListComponent,
        FilterCategoryPipe
    ],
    exports: [
        ProductCreationComponent,
        ProductListComponent,
        ProductEditComponent,
        CategoryListComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ProductManagmentRoutingModule,
        SharedModule
    ]
})
export class ProductManagmentModule { }
