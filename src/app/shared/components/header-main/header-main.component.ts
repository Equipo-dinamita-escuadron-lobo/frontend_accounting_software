import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-main',
  templateUrl: './header-main.component.html',
  styleUrl: './header-main.component.css'
})
export class HeaderMainComponent {
  selectedOption: string = 'Inicio';

  constructor(public router: Router){

  }

  selectOption(option: string) {
    this.selectedOption = option;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
