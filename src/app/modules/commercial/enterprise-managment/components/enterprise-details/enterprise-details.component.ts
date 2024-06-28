import { Component } from '@angular/core';
import { EnterpriseService } from '../../services/enterprise.service';
import { Enterprise, EnterpriseDetails } from '../../models/Enterprise';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../../../principal/login/services/auth.service';

@Component({
  selector: 'app-enterprise-details',
  templateUrl: './enterprise-details.component.html',
  styleUrl: './enterprise-details.component.css',
})
export class EnterpriseDetailsComponent {
  enterpriseSelected?: EnterpriseDetails;
  typePerson:string = '';
  id:any;
  rol: boolean = false;

  constructor(private enterpriseService: EnterpriseService,
    private router: Router,
    private authService: AuthService
  ) {
    this.rol = this.authService.verifiedRolSuperUser();
  }

  ngOnInit(): void {
    this.getEnterpriseSelectedInfo();
  }


  getEnterpriseSelectedInfo() {
    const id = this.enterpriseService.getSelectedEnterprise();
    if (id === null) {

    } else {
      this.enterpriseService.getEnterpriseById(id).subscribe({
        next: (enterpriseData) => {
          this.enterpriseSelected = enterpriseData;
        },
      });
    }

    return this.enterpriseSelected;
  }

  getTypePerson(value:string){
    if(value === 'LEGAL_PERSON'){
      this.typePerson = 'Persona Jurídica';
    }else if((value === 'NATURAL_PERSON')){
      this.typePerson = 'Persona natural';
    }else{
      this.typePerson = ''
    }
  }

  goToListEnterprises(){
    this.router.navigate(['general/enterprises/list']);
  }

  goToEditEnterprise(){
    this.router.navigate(['general/operations/home/edit']);
  }


  archiveEnterprise() {
    Swal.fire({
      title: 'Deseas archivar esta empresa?',
      text: "Tu empresa pasará al estado inactivo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(23 37 84)',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, archivar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.enterpriseService.updateStatusEnterprise(this.id, 'INACTIVE').subscribe({
          next: () => {
            Swal.fire({
              title: 'Empresa archivada!',
              text: 'Tu empresa ha sido archivada',
              icon: 'success',
              confirmButtonColor: 'rgb(23 37 84)',
            });
            this.goToListEnterprises();
          },
        });

      }
    });
  }
}
