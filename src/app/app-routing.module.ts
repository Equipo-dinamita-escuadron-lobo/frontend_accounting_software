import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductManagmentModule } from './modules/commercial/product-managment/product-managment.module';
import { ThirdPartiesManagmentModule } from './modules/commercial/third-parties-managment/third-parties-managment.module';

const routes: Routes = [
  { path: 'product-management', loadChildren: () => import('./modules/commercial/product-managment/product-managment.module').then(m => m.ProductManagmentModule) },
  { path: 'enterprise-management', loadChildren: () => import('./modules/commercial/enterprise-managment/enterprise-managment.module').then(m => m.EnterpriseManagmentModule) },
  { path: 'third-parties-management', loadChildren: () => import('./modules/commercial/third-parties-managment/third-parties-managment.module').then(m => m.ThirdPartiesManagmentModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true}), ProductManagmentModule, ThirdPartiesManagmentModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
