import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartAccountsRoutingModule } from './chart-accounts-routing.module';
import { AccountsListComponent } from './components/accounts-list/accounts-list.component';
import { FilterPipe } from './components/filter.pipe';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AccountImportComponent } from './components/account-import/account-import.component';

@NgModule({
  declarations: [
    AccountsListComponent,
    AccountImportComponent,
    FilterPipe,
  ],
  imports: [
    CommonModule,
    ChartAccountsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule
  ],
  exports:[
    AccountsListComponent
  ]
})
export class ChartAccountsModule { }