import { Component } from '@angular/core';
import { Third } from '../../models/Third';
import { ThirdServiceService } from '../../services/third-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-thirds-list',
  templateUrl: './thirds-list.component.html',
  styleUrls: ['./thirds-list.component.css']
})
export class ThirdsListComponent {
  form: FormGroup;
  data: Third[] = [];
  columns: any[] = [
     // { title: 'Id', data: 'entId' },
     { title: 'Identificación', data: 'idNumber' },
    { title: 'Nombre/RazonSocial', data: 'socialReason' },
    { title: 'Tipo Id', data: 'typeId' },
    { title: 'Número de documento'},
    //{ title: 'DV', data: 'verificationNumber' },
    { title: 'Estado', data: 'state' },
    //{ title: 'Pais', data: 'country' },
    //{ title: 'Departamento', data: 'province' },
    //{ title: 'Ciudad', data: 'city' },
    //{ title: 'Direccion', data: 'address' },
    //{ title: 'Celular', data: 'phoneNumber' },
    { title: 'Correo', data: 'email' },
    { title: 'Acciones'}
  ];

  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();
  entData: any | null = null;

  constructor(private thirdService: ThirdServiceService,private fb: FormBuilder,private router: Router ) {
    this.form = this.fb.group(this.validationsAll());
  }

  validationsAll(){
    return {
      stringSearch: ['']
    };
  }

  ngOnInit() {

    this.entData = this.localStorageMethods.loadEnterpriseData();

    if(this.entData){

      console.log(this.entData.entId);

      this.thirdService.getThirdParties(this.entData.entId,0).subscribe({
        next: (response: Third[])=>{
          console.log(response)
          this.data = response;
        },
        error: (error) => {
          console.log(error)
          Swal.fire({
            title: 'Error!',
            text: 'No se han encontrado terceros para esta empresa!',
            icon: 'error',
          });
        }
      });
    }
  }

  changeThirdPartieState(thId:number):void{
    this.thirdService.changeThirdPartieState(thId).subscribe({
      next: (response: Boolean)=>{

        if(response){
          let updatedThird = this.data.find(t => t.thId === thId);
          if (updatedThird) {
            updatedThird.state = !updatedThird.state;
          }
          Swal.fire({
            title: 'Exito',
            text: 'Se cambió exitosamente el estado del tercero',
            icon: 'success',
          });
        }
      },
      error: (error) => {
        console.log(error)
        Swal.fire({
          title: 'Error!',
          text: 'No se pudo cambiar el estado del tercero',
          icon: 'error',
        });
      }
    });
  }

  redirectTo(route: string): void {
    this.router.navigateByUrl(route);
  }
}
