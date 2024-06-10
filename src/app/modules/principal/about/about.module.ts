import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { MainAboutComponent } from './components/main-about/main-about.component';
import { SharedModule } from '../../../shared/shared.module';


@NgModule({
  declarations: [
    MainAboutComponent
  ],
  imports: [
    CommonModule,
    AboutRoutingModule,
    SharedModule
  ]
})
export class AboutModule { }
