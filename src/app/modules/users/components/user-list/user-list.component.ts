import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { MatDialog } from '@angular/material/dialog';
import { UserModalEditComponent } from '../user-modal-edit/user-modal-edit.component';
import { UserModalCreateComponent } from '../user-modal-create/user-modal-create.component';
import { UserService } from '../../services/user.service';

interface Options{
  name: string;
  rol:string
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  title: string = 'Listado de usuarios';
  subtitle: string = 'Seleccione un usuario para ver sus detalles';

  filterUser: string = '';

  roles: Options[] = [{
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


  form: FormGroup;
  data: User[] = [];
  columns: any[] = [
     // { title: 'Id', data: 'entId' },
    { title: 'Nombre' },
    { title: 'Apellido' },
    { title: 'Correo' },
    { title: 'Usuario' },
    { title: 'Roles'},
    { title: 'Acciones'}
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private userService: UserService
  ) {
    this.form = this.fb.group(this.validationsAll());
    this.getLstUsers();
  }

  ngOnInit(): void {
    this.getLstUsers();
  }

  validationsAll(){
    return {
      stringSearch: ['']
    };
  }

  validRol(rol:string){
    if(rol=== 'admin_realm' || rol=== 'super_realm' || rol=== 'user_realm'){
      return true;
    }
    return false
  }

  filterRoles(rol:string): string{
      if(rol==='admin_realm' ){
        return 'Administrador'
      }else  if(rol==='super_realm' ){
        return 'Superusuario'
      }else  if(rol==='user_realm'){
        return 'Usuario'
      }else{
        return '';
      }
  }


  openModalEdit(username:string):void{
    this.openPopUp(username, 'Editar información del usuario', UserModalEditComponent, true)
  }

  openModalCreate():void{
    this.openPopUp(null, 'Crear Usuario', UserModalCreateComponent, true)
  }

  openPopUp(id:any, title: any, component: any, band: any){
    var _popUp = this.dialog.open(component, {
      width: '40%',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '600ms',
      data:{
        title: title,
        id: id,
        band: band
      }
    });
    _popUp.afterClosed().subscribe()
  }

  getLstUsers(){
    this.userService.getAllUsers().subscribe({
      next: (lstUsuarios) => {
        this.data = lstUsuarios;
        this.sortArrayByName();
      },
    });
  }

  sortArrayByName(): void {
    this.data.sort((a:User, b:User) => {
      if (a.firstName.toLowerCase() < b.firstName.toLowerCase()) {
        return -1;
      }
      if (a.firstName.toLowerCase() > b.firstName.toLowerCase()) {
        return 1;
      }
      return 0;
    });
  }
}
