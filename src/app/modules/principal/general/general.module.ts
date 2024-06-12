import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { GeneralRoutingModule } from './general-routing.module';

import { SharedModule } from '../../../shared/shared.module';
import { EnterpriseManagmentModule } from '../../commercial/enterprise-managment/enterprise-managment.module';
import { ViewEnterprisesComponent } from './components/view-enterprises/view-enterprises.component';
import { GeneralViewComponent } from './components/general-view/general-view.component';
import { UserViewComponent } from './components/user-view/user-view.component';
import { UsersModule } from '../../users/users.module';


@NgModule({
  declarations: [
    ViewEnterprisesComponent,
    GeneralViewComponent,
    UserViewComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    GeneralRoutingModule,
    SharedModule,
    EnterpriseManagmentModule,
    UsersModule
  ]
})
export class GeneralModule { }
