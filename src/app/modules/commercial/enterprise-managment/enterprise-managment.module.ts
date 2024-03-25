import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnterpriseManagmentRoutingModule } from './enterprise-managment-routing.module';
import { EnterpriseCreationComponent } from './components/enterprise-creation/enterprise-creation.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EnterpriseListComponent } from './components/enterprise-list/enterprise-list.component';
import { FilterPipe } from './components/filter.pipe';


@NgModule({
  declarations: [
    EnterpriseCreationComponent,
    PrincipalComponent,
    EnterpriseListComponent,
    FilterPipe
  ],
  imports: [
    CommonModule,
    EnterpriseManagmentRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EnterpriseManagmentModule { }
