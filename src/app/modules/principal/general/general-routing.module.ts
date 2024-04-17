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

const routes: Routes = [
  {
    path: '',
    redirectTo: 'enterprises/list',
    pathMatch: 'full'
  },
  {
    path: 'enterprises',
    component: ViewEnterprisesComponent,
    children: [
      {
        path: 'list',
        component: EnterpriseListComponent
      },
      {
        path: 'create',
        component: EnterpriseCreationComponent
      }
    ]
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
        path: 'products',
        component: ProductListComponent,
      },
      {
        path: 'products/create',
        component: ProductCreationComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralRoutingModule { }
