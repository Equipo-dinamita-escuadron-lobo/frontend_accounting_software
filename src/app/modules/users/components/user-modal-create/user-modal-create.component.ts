import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from '../../models/User';
import Swal from 'sweetalert2';

interface Options{
  name: string;
  rol:string
}

@Component({
  selector: 'app-user-modal-create',
  templateUrl: './user-modal-create.component.html',
  styleUrl: './user-modal-create.component.css'
})
export class UserModalCreateComponent {
  inputData: any;

  userData:User = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roles: [],
    username: ''
  }

  selectedOptions: string[] = [];
  options: Options[] = [{
    name: 'Administrador',
    rol: 'admin_realm'
  },
  {
    name: 'Superusuario',
    rol: 'super_realm'
  },
  {
    name: 'Usuario',
    rol: 'user_realm'
  }];



  UserForm: FormGroup = this.fb.group({
    firstName:  [this.userData.firstName],
    lastName:  [this.userData.lastName],
    email:  [this.userData.email],
    password:  [this.userData.password],
    roles:  [this.userData.roles],
    username:  [this.userData.username]
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data:any, private ref:MatDialogRef<UserModalCreateComponent>, private userService:UserService, private fb:FormBuilder){

  }

  ngOnInit(){
    this.inputData = this.data;
    
  }

  onOptionsSelected(event: any) {
    this.UserForm.value.roles =  event.map((roles:Options) => roles.rol);
    console.log(this.userData.roles)
  }

  closePopUp(){
    this.ref.close('closing from modal details');
  }

  OnSubmit(){
    var user: User = this.UserForm.value;

    user.firstName = this.UserForm.value.firstName;
    user.lastName = this.UserForm.value.lastName;
    user.email = this.UserForm.value.email;
    user.password = this.UserForm.value.password;
    user.username = this.UserForm.value.username;
    user.roles = this.UserForm.value.roles;

    console.log(user)

    this.userService.createUser(user).subscribe({
      next: (response) => {
        // Handle the successful response here
        console.log('Success:', response);
        Swal.fire({
          title: 'Creación exitosa!',
          text: 'Se ha creado el usuario con éxito!',
          icon: 'success',
        });
      },
      error: (error) => {
        // Handle any errors here
        console.error('Error:', error);
        // Mensaje de éxito con alert
        Swal.fire({
          title: 'Error!',
          text: 'Ha ocurrido un error al crear el Usuario!',
          icon: 'error',
        });
      },
    })

  }
}
