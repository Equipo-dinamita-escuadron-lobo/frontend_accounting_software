import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnterpriseManagmentRoutingModule } from './enterprise-managment-routing.module';
import { EnterpriseCreationComponent } from './components/enterprise-creation/enterprise-creation.component';


@NgModule({
  declarations: [
    EnterpriseCreationComponent
  ],
  imports: [
    CommonModule,
    EnterpriseManagmentRoutingModule
  ]
})
export class EnterpriseManagmentModule { }
