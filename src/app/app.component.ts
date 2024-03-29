import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  stateSideBar: boolean = true;

  changeStateSideBar(event:boolean){
    this.stateSideBar = event;
  }
}
