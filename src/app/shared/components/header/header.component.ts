import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() stateSideBar = new EventEmitter<boolean>();
  varStateSideBar: boolean = true;

  sendStateSideBar() {
    this.varStateSideBar = !this.varStateSideBar;
    this.stateSideBar.emit(this.varStateSideBar);
    
  }
}
