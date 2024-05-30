import { Component } from '@angular/core';
import { AuthService } from '../../../modules/principal/login/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-enterprises',
  templateUrl: './header-enterprises.component.html',
  styleUrl: './header-enterprises.component.css'
})
export class HeaderEnterprisesComponent {

  constructor(private authService: AuthService,
    private router: Router
  ){

  }

  logOut(){
    this.authService.logout();
    this.logInUser();
  }

  logInUser() {
    this.router.navigate(['/']);
  }

}
