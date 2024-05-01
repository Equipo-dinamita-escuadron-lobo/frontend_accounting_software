import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.css'
})
export class LoginViewComponent {

  loading: any = true

  constructor(public router:Router) { }

  perfil: any[] = []

  contenedor: any

  erroStatus: boolean = false
  erroMsg: any = ""

  ngOnInit(): void {  }

  async onLoginUser() {
    this.router.navigate(['/general/']);
  }

  showPassword() {//ocultar password
    const change = document.getElementById('password') as HTMLInputElement
    if (change.type === 'password') {
      change.type = 'text'
    } else {
      change.type = 'password'
    }
  }

}
