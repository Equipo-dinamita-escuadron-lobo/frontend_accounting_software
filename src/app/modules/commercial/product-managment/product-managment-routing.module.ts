import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductCreationComponent } from './components/product-creation/product-creation.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductEditComponent } from './components/product-edit/product-edit.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryCreationComponent } from './components/category-creation/category-creation.component';
import { UnitOfMeasureListComponent } from './components/unit-of-measure-list/unit-of-measure-list.component';
import { UnitOfMeasureCreationComponent } from './components/unit-of-measure-creation/unit-of-measure-creation.component';
const routes: Routes = [
  { path: 'product-creation', component: ProductCreationComponent },
  { path: 'product-list', component: ProductListComponent },
  { path: 'product-edit/:id', component: ProductEditComponent },
  { path: 'category-list', component: CategoryListComponent},
  { path: 'category-creation', component: CategoryCreationComponent},
  { path: 'category-edit/:id', component: CategoryCreationComponent},
  { path: 'unitOfMeasure-list', component: UnitOfMeasureListComponent},
  { path: 'unitOfMeasure-creation', component: UnitOfMeasureCreationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductManagmentRoutingModule { }
