import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.css'
})
export class LoginViewComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login() {
    console.log(this.email);
    console.log(this.password);
    this.router.navigate(['/general/'])
  }
}
