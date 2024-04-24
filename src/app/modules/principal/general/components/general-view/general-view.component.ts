import { Component } from '@angular/core';
import { SideNavToggle } from '../../../../../shared/components/sidenav/SideNavToggle.interface';

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

  isSideNavCollapsed = false;
  screenWidth = 0;


  onToggleSideNav(data: SideNavToggle):void{
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
}
