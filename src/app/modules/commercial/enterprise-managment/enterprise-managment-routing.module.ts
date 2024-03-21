import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './components/principal/principal.component';
import { EnterpriseListComponent } from './components/enterprise-list/enterprise-list.component';
import { EnterpriseCreationComponent } from './components/enterprise-creation/enterprise-creation.component';

const routes: Routes = [
  {path: '', component: PrincipalComponent},
  {path: 'list', component: EnterpriseListComponent},
  {path: 'create', component: EnterpriseCreationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnterpriseManagmentRoutingModule { }
