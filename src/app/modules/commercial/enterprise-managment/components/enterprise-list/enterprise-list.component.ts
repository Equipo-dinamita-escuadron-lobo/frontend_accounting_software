import { Component, ChangeDetectorRef  } from '@angular/core';
import { EnterpriseList } from '../../models/EnterpriseList';
import { EnterpriseService } from '../../services/enterprise.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Enterprise } from '../../models/Enterprise';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enterprise-list',
  templateUrl: './enterprise-list.component.html',
  styleUrls: ['./enterprise-list.component.css'],
})
export class EnterpriseListComponent {
  filterName: string = '';
  listEnterprises: EnterpriseList[] = [];
  listEnterprisesInctive: EnterpriseList[] = [];
  typeList = 'ACTIVE';

  selecteEnterprise?: EnterpriseList;
  showLegalForm: boolean = true;
  showNaturalForm: boolean = false;
  filterEnterprise: string = '';

  selectedEnterprise: EnterpriseList | null = null;

  constructor(
    private enterpriseServide: EnterpriseService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getEnterprisesActive();
  }

  getEnterprisesActive() {
    this.enterpriseServide.getEnterprisesActive().subscribe({
      next: (enterpriseData) => {
        this.typeList = 'ACTIVE';
        this.listEnterprises = enterpriseData;
      },
    });
  }

  getEnterprisesInactive() {
    this.enterpriseServide.getEnterprisesInactive().subscribe({
      next: (enterpriseData) => {
        this.listEnterprises = enterpriseData;
        this.typeList = 'INACTIVE';
      },
    });
  }

  goToCreateEnterprise() {
    this.router.navigate(['general/enterprises/create']);
  }

  updateEnterpriseSelected(id: string) {
    this.logInEnterprise();
    this.enterpriseServide.setSelectedEnterprise(id);
  }

  logInEnterprise() {
    this.router.navigate(['general/operations/home']);
  }

  activeEnterprise(id:string){
    Swal.fire({
      title: 'Deseas activar esta empresa?',
      text: "Tu empresa pasará al estado activo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(23 37 84)',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.enterpriseServide.updateStatusEnterprise(id, 'ACTIVE').subscribe({
          next: () => {
            Swal.fire({
              title: 'Empresa activada!',
              text: 'Tu empresa esta activa',
              icon: 'success',
              confirmButtonColor: 'rgb(23 37 84)',
            });
            this.cdRef.detectChanges();
          },
        });

      }
    });
  }
}
