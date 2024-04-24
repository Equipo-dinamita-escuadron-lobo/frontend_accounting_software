import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnterpriseManagmentRoutingModule } from './enterprise-managment-routing.module';
import { EnterpriseCreationComponent } from './components/enterprise-creation/enterprise-creation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EnterpriseListComponent } from './components/enterprise-list/enterprise-list.component';
import { FilterEnterpriseList } from './components/filter.pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { EnterpriseDetailsComponent } from './components/enterprise-details/enterprise-details.component';
import { EnterpriseEditComponent } from './components/enterprise-edit/enterprise-edit.component';


@NgModule({
  declarations: [
    EnterpriseCreationComponent,
    EnterpriseListComponent,
    FilterEnterpriseList,
    EnterpriseDetailsComponent,
    EnterpriseEditComponent
  ],
  imports: [
    CommonModule,
    EnterpriseManagmentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxDropzoneModule

  ],
  exports:[
    EnterpriseListComponent,
    EnterpriseCreationComponent,
    NgSelectModule,
    NgxDropzoneModule,
    EnterpriseDetailsComponent
  ]
})
export class EnterpriseManagmentModule { }
