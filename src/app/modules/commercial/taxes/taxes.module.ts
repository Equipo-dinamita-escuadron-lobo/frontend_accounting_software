import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaxesRoutingModule } from './taxes-routing.module';
import { NombreDelComponenteComponent } from './components/nombre-del-componente/nombre-del-componente.component';
import { CreateTaxComponent } from './components/create-tax/create-tax.component';
import { ListTaxComponent } from './components/list-tax/list-tax.component';
import { EditTaxComponent } from './components/edit-tax/edit-tax.component';


@NgModule({
  declarations: [
    NombreDelComponenteComponent,
    CreateTaxComponent,
    ListTaxComponent,
    EditTaxComponent
  ],
  imports: [
    CommonModule,
    TaxesRoutingModule
  ]
})
export class TaxesModule { }
