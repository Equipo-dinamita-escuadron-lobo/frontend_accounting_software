import { Component } from '@angular/core';
import { EnterpriseService } from '../../services/enterprise.service';
import { Enterprise, EnterpriseDetails } from '../../models/Enterprise';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enterprise-details',
  templateUrl: './enterprise-details.component.html',
  styleUrl: './enterprise-details.component.css',
})
export class EnterpriseDetailsComponent {
  enterpriseSelected?: EnterpriseDetails;
  id: string = '-1';

  constructor(private enterpriseService: EnterpriseService) {
    this.ngOnInit();
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
          console.log(this.enterpriseSelected);
        },
      });
    }
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
          },
        });

      }
    });
  }
}
