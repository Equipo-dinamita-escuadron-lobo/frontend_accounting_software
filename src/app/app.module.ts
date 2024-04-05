import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { ProductManagmentModule } from './modules/commercial/product-managment/product-managment.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ThirdPartiesManagmentModule } from './modules/commercial/third-parties-managment/third-parties-managment.module';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    ProductManagmentModule,
    ReactiveFormsModule,
    ThirdPartiesManagmentModule,
    DataTablesModule,
    NgSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
