import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/principal/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'general',
    loadChildren: () => import('./modules/principal/general/general.module').then(m => m.GeneralModule),
  },
  {
    path: 'enterprise-management',
    loadChildren: () => import('./modules/commercial/enterprise-managment/enterprise-managment.module').then(m => m.EnterpriseManagmentModule),
  },
  {
    path: 'product-management',
    loadChildren: () => import('./modules/commercial/product-managment/product-managment.module').then(m => m.ProductManagmentModule),
  },
  {
    path: 'third-parties-management',
    loadChildren: () => import('./modules/commercial/third-parties-managment/third-parties-managment.module').then(m => m.ThirdPartiesManagmentModule),
  },
  {
    path: 'accounts-management',
    loadChildren: () => import('./modules/commercial/chart-accounts/chart-accounts.module').then(m => m.ChartAccountsModule),
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes,{useHash:true})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
