import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-main',
  templateUrl: './header-main.component.html',
  styleUrl: './header-main.component.css'
})
export class HeaderMainComponent {
  selectedOption: string = 'Inicio';
  hiddenMenu: boolean = false;
  containerOptions = document.getElementById('container-options');

  constructor(private router: Router){

  }
  selectOption(option: string) {
    this.selectedOption = option;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToAbout(item:string) {
    this.router.navigate(['/about']);
    this.selectOption('Acerca')
  }

  goLanding(item:string) {
    this.router.navigate(['/']);
    this.selectOption(item)
  }

  showMenu(){
    if(this.hiddenMenu === false){
      this.hiddenMenu = true
    }else{
      this.hiddenMenu = false;
    }
  }
}
