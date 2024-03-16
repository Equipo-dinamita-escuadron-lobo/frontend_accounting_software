import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductCreationComponent } from './components/product-creation/product-creation.component';

const routes: Routes = [
  { path: 'product-creation', component: ProductCreationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductManagmentRoutingModule { }
