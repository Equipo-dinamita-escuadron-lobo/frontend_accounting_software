import { Component } from '@angular/core';
import { EnterpriseService } from '../../services/enterprise.service';
import { Enterprise, EnterpriseDetails } from '../../models/Enterprise';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-enterprise-details',
  templateUrl: './enterprise-details.component.html',
  styleUrl: './enterprise-details.component.css',
})
export class EnterpriseDetailsComponent {
  enterpriseSelected?: EnterpriseDetails;
  typePerson:string = '';
  id: string = '-1';

  constructor(private enterpriseService: EnterpriseService,
    private router: Router
  ) {
    this.getEnterpriseSelectedInfo();
  }

  ngOnInit(): void {
    this.getEnterpriseSelectedInfo();
  }

  getEnterpriseSelectedInfo() {
    this.id = this.enterpriseService.getSelectedEnterprise();
    if (this.id === '-1') {
    } else {
      this.enterpriseService.getEnterpriseById(this.id).subscribe({
        next: (enterpriseData) => {
          this.enterpriseSelected = enterpriseData;
          this.getTypePerson(enterpriseData.personType.type);
          console.log(enterpriseData)
        },
      });
    }
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
