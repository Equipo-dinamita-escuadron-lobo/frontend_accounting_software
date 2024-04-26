import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartAccountsRoutingModule } from './chart-accounts-routing.module';
import { AccountsListComponent } from './components/accounts-list/accounts-list.component';
import { FilterPipe } from './components/filter.pipe';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AccountsListComponent,
    FilterPipe
  ],
  imports: [
    CommonModule,
    ChartAccountsRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports:[
    AccountsListComponent
  ]
})
export class ChartAccountsModule { }
