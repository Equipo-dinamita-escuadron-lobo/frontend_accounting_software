import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnterpriseManagmentRoutingModule } from './enterprise-managment-routing.module';
import { EnterpriseCreationComponent } from './components/enterprise-creation/enterprise-creation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EnterpriseListComponent } from './components/enterprise-list/enterprise-list.component';
import { FilterEnterpriseList } from './components/filter.pipe';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    EnterpriseCreationComponent,
    EnterpriseListComponent,
    FilterEnterpriseList
  ],
  imports: [
    CommonModule,
    EnterpriseManagmentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  exports:[
    EnterpriseListComponent,
    EnterpriseCreationComponent
  ]
})
export class EnterpriseManagmentModule { }
