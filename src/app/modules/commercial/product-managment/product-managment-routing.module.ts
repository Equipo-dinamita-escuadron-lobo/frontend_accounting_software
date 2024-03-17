import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductCreationComponent } from './components/product-creation/product-creation.component';
import { ProductListComponent } from './components/product-list/product-list.component';
const routes: Routes = [
  { path: 'product-creation', component: ProductCreationComponent },
  { path: 'product-list', component: ProductListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductManagmentRoutingModule { }
