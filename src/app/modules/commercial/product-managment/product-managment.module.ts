import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from "../../../shared/shared.module";
import { CategoryCreationComponent } from './components/category-creation/category-creation.component';
import { CategoryDetailsComponent } from './components/category-details/category-details.component';
import { CategoryEditComponent } from './components/category-edit/category-edit.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { ProductCreationComponent } from './components/product-creation/product-creation.component';
import { ProductDetailsModalComponent } from './components/product-details/product-details.component';
import { ProductEditComponent } from './components/product-edit/product-edit.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { UnitOfMeasureCreationComponent } from './components/unit-of-measure-creation/unit-of-measure-creation.component';
import { UnitOfMeasureEditComponent } from './components/unit-of-measure-edit/unit-of-measure-edit.component';
import { UnitOfMeasureListComponent } from './components/unit-of-measure-list/unit-of-measure-list.component';
import { FilterAccountPipe } from './pipes/filter-account.pipe';
import { FilterCategoryPipe } from './pipes/filter-category.pipe';
import { FilterUnitOfMeasurePipe } from './pipes/filter-unit-of-measure.pipe';
import { FilterList } from './pipes/filter.pipe';
import { ProductManagmentRoutingModule } from './product-managment-routing.module';

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
        NgSelectModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatTableModule,
        MatPaginatorModule,
        MatPaginator,
    ]
})
export class ProductManagmentModule { }
