import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.css'
})
export class LoginViewComponent {

  loginForm = this.formBuilder.group({
    username: ['', Validators.required ],
    password: ['', Validators.required]
  })

  loading: any = true

  constructor(
    public router:Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
  ) { }

  perfil: any[] = []

  contenedor: any

  erroStatus: boolean = false
  erroMsg: any = ""

  ngOnInit(): void {  }

  async onLoginUser() {

    //validar con loginForm
    if (this.loginForm.invalid) {
      return;
    }


    this.authService.login(this.loginForm.value).subscribe({
      next: (data:any) => {

        this.authService.setToken(data.access_token);
        this.authService.getCurrentUser().subscribe({
          //llega el usuario
          next: (data:any) => {
            this.authService.setUserData(data);
            //vericicamos el rol del usuario
            let roles = data.roles;
            if (roles.includes('admin_client')) {

              this.router.navigate(['/general/']);
              this.authService.loginStatus.next(true);
            } else if (roles.includes('user_client')) {

              this.router.navigate(['/general/']);
              this.authService.loginStatus.next(true);
            }
            else {
              this.router.navigate(['']);
            }
          },
          error: error => console.error(error)
        }
        );
    },
      error: error => console.error(error)
    }
    );
    this.loginForm.reset();


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
