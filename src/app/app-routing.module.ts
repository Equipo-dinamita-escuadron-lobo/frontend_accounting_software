import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductManagmentModule } from './modules/commercial/product-managment/product-managment.module'; 

const routes: Routes = [
  { path: 'product-management', loadChildren: () => import('./modules/commercial/product-managment/product-managment.module').then(m => m.ProductManagmentModule) },
  { path: 'enterprise-management', loadChildren: () => import('./modules/commercial/enterprise-managment/enterprise-managment.module').then(m => m.EnterpriseManagmentModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), ProductManagmentModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
