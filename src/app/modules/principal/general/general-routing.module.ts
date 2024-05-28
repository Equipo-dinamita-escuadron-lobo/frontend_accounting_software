import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewEnterprisesComponent } from './components/view-enterprises/view-enterprises.component';
import { EnterpriseListComponent } from '../../commercial/enterprise-managment/components/enterprise-list/enterprise-list.component';
import { EnterpriseCreationComponent } from '../../commercial/enterprise-managment/components/enterprise-creation/enterprise-creation.component';
import { GeneralViewComponent } from './components/general-view/general-view.component';
import { ProductListComponent } from '../../commercial/product-managment/components/product-list/product-list.component';
import { ThirdsListComponent } from '../../commercial/third-parties-managment/components/thirds-list/thirds-list.component';
import { ThirdCreationComponent } from '../../commercial/third-parties-managment/components/third-creation/third-creation.component';
import { ProductCreationComponent } from '../../commercial/product-managment/components/product-creation/product-creation.component';
import { UnitOfMeasureListComponent } from '../../commercial/product-managment/components/unit-of-measure-list/unit-of-measure-list.component';
import { UnitOfMeasureCreationComponent } from '../../commercial/product-managment/components/unit-of-measure-creation/unit-of-measure-creation.component';
import { UnitOfMeasureEditComponent } from '../../commercial/product-managment/components/unit-of-measure-edit/unit-of-measure-edit.component';
import { ProductEditComponent } from '../../commercial/product-managment/components/product-edit/product-edit.component';
import { CategoryListComponent } from '../../commercial/product-managment/components/category-list/category-list.component';
import { CategoryCreationComponent } from '../../commercial/product-managment/components/category-creation/category-creation.component';
import { CategoryEditComponent } from '../../commercial/product-managment/components/category-edit/category-edit.component';
import { EnterpriseDetailsComponent } from '../../commercial/enterprise-managment/components/enterprise-details/enterprise-details.component';
import { EnterpriseEditComponent } from '../../commercial/enterprise-managment/components/enterprise-edit/enterprise-edit.component';
import { AccountsListComponent } from '../../commercial/chart-accounts/components/accounts-list/accounts-list.component';
import { permissionsGuard } from '../../../core/guards/permissions.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'enterprises/list',
    pathMatch: 'full'
  },
  {
    path: 'enterprises',
    component: ViewEnterprisesComponent,
    title: 'Empresas',
    children: [
      {
        path: 'list',
        component: EnterpriseListComponent,
      },
      {
        path: 'create',
        component: EnterpriseCreationComponent,
      }
    ],
    canActivate: [permissionsGuard],
  },
  {
    path: 'operations',
    component: GeneralViewComponent,
    children: [
      {
        path: 'third-parties',
        component: ThirdsListComponent,
      },
      {
        path: 'third-parties/create',
        component: ThirdCreationComponent
      },
      {
        path: 'accounts',
        component: AccountsListComponent
      },
      {
        path: 'products',
        component: ProductListComponent,
      },
      {
        path: 'products/create',
        component: ProductCreationComponent
      },
      {
        path: 'products/edit/:id',
        component: ProductEditComponent
      },
      {
        path: 'unities',
        component: UnitOfMeasureListComponent
      },
      {
        path: 'unities/create',
        component: UnitOfMeasureCreationComponent
      },
      {
        path: 'unities/edit/:id',
        component: UnitOfMeasureEditComponent
      },
      {
        path: 'categories',
        component: CategoryListComponent
      },
      {
        path: 'categories/create',
        component: CategoryCreationComponent
      },
      {
        path: 'categories/edit/:id',
        component: CategoryEditComponent
      },

      {
        path: 'home',
        component: EnterpriseDetailsComponent
      },
      {
        path: 'home/edit',
        component: EnterpriseEditComponent
      }
    ],
    canActivate: [permissionsGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralRoutingModule { }
