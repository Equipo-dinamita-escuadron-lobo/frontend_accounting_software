import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartAccountsRoutingModule } from './chart-accounts-routing.module';
import { AccountsListComponent } from './components/accounts-list/accounts-list.component';


@NgModule({
  declarations: [
    AccountsListComponent
  ],
  imports: [
    CommonModule,
    ChartAccountsRoutingModule
  ]
})
export class ChartAccountsModule { }
