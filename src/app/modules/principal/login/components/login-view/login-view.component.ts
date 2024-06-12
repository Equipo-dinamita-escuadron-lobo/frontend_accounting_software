import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.css',
})
export class LoginViewComponent {
  loginFail: boolean = false;
  invalidForm: boolean = false;

  loginForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  loading: any = true;

  constructor(public router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.verifiedStatusUser()
  }

  verifiedStatusUser(){
    if(this.authService.verifiedStatusLogin()){
      this.router.navigate(['/general/enterprises/list']);
    }
  }



  perfil: any[] = [];

  contenedor: any;

  erroStatus: boolean = false;
  erroMsg: any = '';

  ngOnInit(): void {
    //si existe un token cargar enterprises/list
    if (this.authService.getToken()) {
      this.router.navigate(['/general/enterprises/list']);
    } else {
      //borrar datos de usuario y token
      this.authService.logout();
    }
  }

  async onLoginUser() {
    this.invalidForm = false;
    //validar con loginForm

    if (this.loginForm.invalid) {
      if (
        this.loginForm.get('password')?.hasError('required') ||
        this.loginForm.get('username')?.hasError('required')
      ) {
        this.invalidForm = true;
      }
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (data: any) => {
        this.authService.setToken(data.access_token);
        this.authService.getCurrentUser().subscribe({
          //llega el usuario
          next: (data: any) => {
            this.authService.setUserData(data);
            //vericicamos el rol del usuario
            console.log('roles')
            let roles = data.roles;
            if (roles.includes('admin_realm') || roles.includes('user_realm') || roles.includes('super_realm')) {
              console.log(roles)
              this.router.navigate(['/general/enterprises/list']);
              this.authService.loginStatus.next(true);
            } else if (roles.includes('user_client')) {
              this.router.navigate(['/']);
              this.authService.loginStatus.next(true);
            } else {
              this.router.navigate(['']);
            }
          },
          error: (error) => {
            console.error(error);
            this.loginFail = true;
          },
        });
      },
      error: (error) => {
        console.error(error);
        this.loginFail = true;
      },
    });
    this.loginForm.reset();
  }

  showPassword() {
    //ocultar password
    const change = document.getElementById('password') as HTMLInputElement;
    if (change.type === 'password') {
      change.type = 'text';
    } else {
      change.type = 'password';
    }
  }
}
