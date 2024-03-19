import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedRoutingModule } from './shared-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SidebarSelectedComponent } from './components/sidebar-selected/sidebar-selected.component';
import { CheckButtonComponent } from './components/check-button/check-button.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    SidebarSelectedComponent,
    CheckButtonComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FormsModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    CheckButtonComponent
  ]
})
export class SharedModule { }
