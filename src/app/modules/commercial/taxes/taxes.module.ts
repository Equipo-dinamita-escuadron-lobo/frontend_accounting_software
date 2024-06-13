import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxesRoutingModule } from './taxes-routing.module';
import { CreateTaxComponent } from './components/create-tax/create-tax.component';
import { ListTaxComponent } from './components/list-tax/list-tax.component';
import { EditTaxComponent } from './components/edit-tax/edit-tax.component';


@NgModule({
  declarations: [
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
