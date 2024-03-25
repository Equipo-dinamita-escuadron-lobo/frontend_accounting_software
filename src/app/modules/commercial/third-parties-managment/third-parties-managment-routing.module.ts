import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThirdCreationComponent } from './components/third-creation/third-creation.component';
import { ThirdsListComponent } from './components/thirds-list/thirds-list.component';
const routes: Routes = [
  { path: 'third-creation', component: ThirdCreationComponent },
  { path: 'thirds-list', component: ThirdsListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThirdPartiesManagmentRoutingModule { }
