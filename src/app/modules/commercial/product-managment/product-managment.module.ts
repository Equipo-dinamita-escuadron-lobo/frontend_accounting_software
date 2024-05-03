import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; 
import { ProductManagmentRoutingModule } from './product-managment-routing.module';
import { ProductCreationComponent } from './components/product-creation/product-creation.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { SharedModule } from "../../../shared/shared.module";
import { FilterList } from './pipes/filter.pipe';
import { ProductEditComponent } from './components/product-edit/product-edit.component';
import { UnitOfMeasureListComponent } from './components/unit-of-measure-list/unit-of-measure-list.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { FilterCategoryPipe } from './pipes/filter-category.pipe';
import { FilterUnitOfMeasurePipe } from './pipes/filter-unit-of-measure.pipe';
import { CategoryCreationComponent } from './components/category-creation/category-creation.component';
import { CategoryEditComponent } from './components/category-edit/category-edit.component';
import { UnitOfMeasureCreationComponent } from './components/unit-of-measure-creation/unit-of-measure-creation.component';
import { UnitOfMeasureEditComponent } from './components/unit-of-measure-edit/unit-of-measure-edit.component';
import { ProductDetailsModalComponent } from './components/product-details/product-details.component';
import { CategoryDetailsComponent } from './components/category-details/category-details.component';

@NgModule({
    declarations: [
        ProductCreationComponent,
        ProductListComponent,
        FilterList,
        ProductEditComponent,
        CategoryListComponent,
        FilterCategoryPipe,
        UnitOfMeasureListComponent,
        FilterUnitOfMeasurePipe,
        CategoryCreationComponent,
        CategoryEditComponent,
        UnitOfMeasureCreationComponent,
        UnitOfMeasureEditComponent,
        ProductDetailsModalComponent,
        CategoryDetailsComponent
    ],
    exports: [
        ProductCreationComponent,
        ProductListComponent,
        ProductEditComponent,
        CategoryListComponent,
        FilterCategoryPipe,
        UnitOfMeasureListComponent,
        CategoryCreationComponent,
        CategoryEditComponent,
        UnitOfMeasureCreationComponent,
        UnitOfMeasureEditComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ProductManagmentRoutingModule,
        SharedModule
    ]
})
export class ProductManagmentModule { }
