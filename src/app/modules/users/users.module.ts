import { NgModule } from '@angular/core';
import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './components/user-list/user-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserModalEditComponent } from './components/user-modal-edit/user-modal-edit.component';
import { UserModalCreateComponent } from './components/user-modal-create/user-modal-create.component';
import { FilterUserList } from './components/user-list/filter.pipe';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDropzoneModule } from 'ngx-dropzone';


@NgModule({
  declarations: [
    UserListComponent,
    UserModalEditComponent,
    UserModalCreateComponent,
    FilterUserList
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxDropzoneModule
  ]
})
export class UsersModule { }
   