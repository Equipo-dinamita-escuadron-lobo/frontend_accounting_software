import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { ProductManagmentModule } from './modules/commercial/product-managment/product-managment.module';

@NgModule({
  declarations: [
    AppComponent  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    ProductManagmentModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
