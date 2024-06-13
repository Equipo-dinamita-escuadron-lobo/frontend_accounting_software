import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { first } from 'rxjs';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

interface Options{
  name: string;
  rol:string
}

@Component({
  selector: 'app-user-modal-edit',
  templateUrl: './user-modal-edit.component.html',
  styleUrl: './user-modal-edit.component.css',
})
export class UserModalEditComponent {
  inputData: any;

  userData: User = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roles: [],
    username: '',
  };

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
    id: [this.userData.id],
    firstName: [this.userData.firstName],
    lastName: [this.userData.lastName],
    email: [this.userData.email],
    password: [this.userData.password],
    roles: [this.userData.roles],
    username: [this.userData.username],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<UserModalEditComponent>,
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.inputData = this.data;

    this.userService
      .getUserById(this.inputData.id)
      .subscribe((user) => {
        this.userData = user;
        console.log('Hola')
        console.log(this.userData)

        this.UserForm = this.fb.group({
          id: [this.userData.id],
          firstName: [this.userData.firstName],
          lastName: [this.userData.lastName],
          email: [this.userData.email],
          password: [this.userData.password],
          roles: [this.userData.roles],
          username: [this.userData.username],
        });
      });
  }

  onOptionsSelected(event: any) {
    this.UserForm.value.roles =  event.map((roles:Options) => roles.rol);
    console.log(this.userData.roles)
  }


  closePopUp() {
    this.ref.close('closing from modal details');
  }

  OnSubmit() {
    var user: User = this.UserForm.value;

    user.firstName = this.UserForm.value.firstName;
    user.lastName = this.UserForm.value.lastName;
    user.email = this.UserForm.value.email;
    user.password = this.UserForm.value.password;
    user.username = this.UserForm.value.username;
    user.roles = this.UserForm.value.roles;

    this.userService.updateUser(user.id, user).subscribe({
      next: (response) => {
        // Handle the successful response here
        console.log('Success:', response);
        Swal.fire({
          title: 'Edicion exitosa!',
          text: 'Se ha editado el usuario con éxito!',
          icon: 'success',
        });
      },
      error: (error) => {
        // Handle any errors here
        console.error('Error:', error);
        // Mensaje de éxito con alert
        Swal.fire({
          title: 'Error!',
          text: 'Ha Ocurrido Un Erro Al Editar El Usuario!',
          icon: 'error',
        });
      },
    });
  }
}