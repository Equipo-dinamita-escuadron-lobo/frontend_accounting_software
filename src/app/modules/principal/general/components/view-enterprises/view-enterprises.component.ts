import { Component } from '@angular/core';

@Component({
  selector: 'app-view-enterprises',
  templateUrl: './view-enterprises.component.html',
  styleUrl: './view-enterprises.component.css'
})
export class ViewEnterprisesComponent {
  stateSideBar: boolean = true;

  changeStateSideBar(event:boolean){
    this.stateSideBar = event;
  }
}
