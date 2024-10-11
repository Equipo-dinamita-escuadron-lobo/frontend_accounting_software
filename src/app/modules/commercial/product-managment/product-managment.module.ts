import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
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
import { ProductTypeCreationComponent } from './components/product-type-creation/product-type-creation.component';
import { ProductTypeEditComponent } from './components/product-type-edit/product-type-edit.component';
import { ProductTypeListComponent } from './components/product-type-list/product-type-list.component';
import { FilterAccountPipe } from './pipes/filter-account.pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';



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
        CategoryDetailsComponent,
        ProductTypeCreationComponent,
        ProductTypeEditComponent,
        ProductTypeListComponent,
        FilterAccountPipe
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
        UnitOfMeasureEditComponent,
        FilterAccountPipe
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ProductManagmentRoutingModule,
        SharedModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatTableModule,
        NgSelectModule  
    ]
})
export class ProductManagmentModule { }
