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
<<<<<<< HEAD
import { PurchaseInvoiceModule } from '../../commercial/purchase-invoice/purchase-invoice.module';
=======
import { TaxesModule } from '../../commercial/taxes/taxes.module';
>>>>>>> develop


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
    UsersModule,
<<<<<<< HEAD
    PurchaseInvoiceModule
=======
    TaxesModule

>>>>>>> develop
  ]
})
export class GeneralModule { }
