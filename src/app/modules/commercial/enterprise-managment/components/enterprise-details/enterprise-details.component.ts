/**
 * @fileoverview Componente para visualizar y gestionar detalles de empresas
 * 
 * Este componente permite:
 * - Visualizar información detallada de una empresa
 * - Gestionar el estado de la empresa
 * - Manejar la navegación entre vistas
 * - Controlar permisos de usuario
 * 
 * Funcionalidades principales:
 * - Consulta de información empresarial
 * - Archivado de empresas
 * - Validación de roles de usuario
 * - Navegación entre módulos
 * 
 * @autor [CONTAPP]
 * @versión 1.0.0
 */

import { Component } from '@angular/core';
import { EnterpriseService } from '../../services/enterprise.service';
import { Enterprise, EnterpriseDetails } from '../../models/Enterprise';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../../../principal/login/services/auth.service';
import { buttonColors } from '../../../../../shared/buttonColors';

@Component({
  selector: 'app-enterprise-details',
  templateUrl: './enterprise-details.component.html',
  styleUrl: './enterprise-details.component.css',
})
export class EnterpriseDetailsComponent {
  /** Detalles de la empresa seleccionada */
  enterpriseSelected?: EnterpriseDetails;
  
  /** Tipo de persona (natural/jurídica) */
  typePerson:string = '';
  
  /** Identificador de la empresa */
  id:any;
  
  /** Control de permisos de usuario */
  rol: boolean = false;

  /**
   * Constructor del componente
   * Inicializa servicios y verifica permisos
   */
  constructor(private enterpriseService: EnterpriseService,
    private router: Router,
    private authService: AuthService
  ) {
    this.rol = this.authService.verifiedRolSuperUser();
  }

  /**
   * Inicializa el componente
   * Carga la información de la empresa seleccionada
   */
  ngOnInit(): void {
    this.getEnterpriseSelectedInfo();
  }

  /**
   * Obtiene la información detallada de la empresa seleccionada
   * @returns Detalles de la empresa
   */
  getEnterpriseSelectedInfo() {
    const id = this.enterpriseService.getSelectedEnterprise();
    if (id === null) {

    } else {
      this.enterpriseService.getEnterpriseById(id).subscribe({
        next: (enterpriseData) => {
          this.enterpriseSelected = enterpriseData;
          this.getTypePerson(this.enterpriseSelected.personType.type);
          console.log(this.enterpriseSelected);
        },
      });
    }

    return this.enterpriseSelected;
  }

  /**
   * Determina el tipo de persona según el valor recibido
   * @param value Tipo de persona (LEGAL_PERSON/NATURAL_PERSON)
   */
  getTypePerson(value:string){
    if(value === 'LEGAL_PERSON'){
      this.typePerson = 'Persona Jurídica';
    }else if((value === 'NATURAL_PERSON')){
      this.typePerson = 'Persona natural';
    }else{
      this.typePerson = ''
    }
  }

  /**
   * Navega a la lista de empresas
   */
  goToListEnterprises(){
    this.router.navigate(['general/enterprises/list']);
  }

  /**
   * Navega a la edición de empresa
   */
  goToEditEnterprise(){
    this.router.navigate(['general/operations/home/edit']);
  }

  /**
   * Archiva una empresa cambiando su estado a inactivo
   * Muestra confirmaciones mediante SweetAlert2
   */
  archiveEnterprise() {
    Swal.fire({
      title: 'Deseas archivar esta empresa?',
      text: "Tu empresa pasará al estado inactivo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: buttonColors.confirmationColor,
      cancelButtonColor: buttonColors.cancelButtonColor,
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
              confirmButtonColor: buttonColors.confirmationColor,
            });
            this.goToListEnterprises();
          },
        });
      }
    });
  }
}
