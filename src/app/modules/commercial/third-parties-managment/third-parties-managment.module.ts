import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { ThirdPartiesManagmentRoutingModule } from './third-parties-managment-routing.module';
import { ThirdsListComponent } from './components/thirds-list/thirds-list.component';
import { ThirdCreationComponent } from './components/third-creation/third-creation.component';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterList } from './pipes/filter.pipe';
import { ThirdEditModalComponent } from './components/third-edit-modal/third-edit-modal.component';
import { ThirdDetailsModalComponent } from './components/third-details-modal/third-details-modal.component';
import { ThirdConfigModalComponent } from './components/third-config-modal/third-config-modal.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDropzoneModule } from 'ngx-dropzone';
@NgModule({
  declarations: [
    ThirdsListComponent,
    ThirdCreationComponent,
    ThirdEditModalComponent,
    ThirdDetailsModalComponent,
    ThirdConfigModalComponent,
    FilterList
  ],
  imports: [
    CommonModule,
    ThirdPartiesManagmentRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    NgxDropzoneModule,
    MatTableModule,
    MatPaginatorModule
  ]
})
export class ThirdPartiesManagmentModule { }
