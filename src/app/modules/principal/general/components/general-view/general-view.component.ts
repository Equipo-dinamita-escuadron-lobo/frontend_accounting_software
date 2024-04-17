import { Component } from '@angular/core';

@Component({
  selector: 'app-general-view',
  templateUrl: './general-view.component.html',
  styleUrl: './general-view.component.css'
})
export class GeneralViewComponent {
  stateSideBar: boolean = true;

  changeStateSideBar(event:boolean){
    this.stateSideBar = event;
  }
}
