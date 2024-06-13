import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginRoutingModule } from './login-routing.module';
import { LoginViewComponent } from './components/login-view/login-view.component';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
  declarations: [
    LoginViewComponent,
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
})
export class LoginModule { }
