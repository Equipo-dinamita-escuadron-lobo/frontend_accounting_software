import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './components/main/main.component';
import { LandingPageRoutingModule } from './landing-page-routing.module';
import { HeaderMainComponent } from '../../../shared/components/header-main/header-main.component';
import { SharedModule } from '../../../shared/shared.module';



@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    LandingPageRoutingModule,
    SharedModule
  ]
})
export class LandingPageModule { }
