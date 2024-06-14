import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutAppRoutingModule } from './about-app-routing.module';
import { MainAboutComponent } from './components/main-about/main-about.component';
import { SharedModule } from '../../../shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [
    MainAboutComponent
  ],
  imports: [
    CommonModule,
    AboutAppRoutingModule,
    SharedModule
  ]
})
export class AboutAppModule { }
