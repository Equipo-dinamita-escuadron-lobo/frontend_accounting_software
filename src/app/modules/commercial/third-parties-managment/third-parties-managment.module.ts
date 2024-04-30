import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThirdPartiesManagmentRoutingModule } from './third-parties-managment-routing.module';
import { ThirdsListComponent } from './components/thirds-list/thirds-list.component';
import { ThirdCreationComponent } from './components/third-creation/third-creation.component';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterList } from './pipes/filter.pipe';
import { ThirdEditModalComponent } from './components/third-edit-modal/third-edit-modal.component';

@NgModule({
  declarations: [
    ThirdsListComponent,
    ThirdCreationComponent,
    ThirdEditModalComponent,
    FilterList
  ],
  imports: [
    CommonModule,
    ThirdPartiesManagmentRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class ThirdPartiesManagmentModule { }
