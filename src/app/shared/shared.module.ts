import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedRoutingModule } from './shared-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SidebarSelectedComponent } from './components/sidebar-selected/sidebar-selected.component';
import { CheckButtonComponent } from './components/check-button/check-button.component';
import { DatatableComponent } from './components/datatable/datatable.component';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    SidebarSelectedComponent,
    CheckButtonComponent,
    DatatableComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FormsModule,
    DataTablesModule,
    ReactiveFormsModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    CheckButtonComponent,
    DatatableComponent
  ]
})
export class SharedModule { }
