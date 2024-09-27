import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsListComponent } from './components/accounts-list/accounts-list.component';
import { AccountExportComponent } from './components/account-export/account-export.component';

const routes: Routes = [
  {path: 'list-create', component: AccountsListComponent},
  {path: 'list-export', component: AccountExportComponent } // Nueva ruta para el componente de exportación
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChartAccountsRoutingModule { }
