import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedRoutingModule } from './shared-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { HeaderEnterprisesComponent } from './components/header-enterprises/header-enterprises.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SidebarSelectedComponent } from './components/sidebar-selected/sidebar-selected.component';
import { CheckButtonComponent } from './components/check-button/check-button.component';
import { DatatableComponent } from './components/datatable/datatable.component';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule} from '@angular/forms';
import { SublevelMenuComponent } from './components/sidenav/sublevel-menu.component';
import { HeaderMainComponent } from './components/header-main/header-main.component';

@NgModule({
  declarations: [
    HeaderComponent,
    HeaderEnterprisesComponent,
    SidebarComponent,
    SidebarSelectedComponent,
    SidenavComponent,
    SublevelMenuComponent,
    CheckButtonComponent,
    DatatableComponent,
    HeaderMainComponent
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
    HeaderEnterprisesComponent,
    SidebarComponent,
    SidenavComponent,
    CheckButtonComponent,
    DatatableComponent,
    HeaderMainComponent
  ]
})
export class SharedModule { }
