/**
 * @fileoverview Componente para la gestión y visualización de la lista de empresas
 * 
 * Este componente permite:
 * - Visualizar el listado de empresas activas e inactivas
 * - Filtrar empresas por nombre
 * - Gestionar el estado de las empresas (activar/archivar)
 * - Navegar entre diferentes funcionalidades empresariales
 * 
 * Funcionalidades principales:
 * - Listado de empresas con filtros
 * - Cambio de estado de empresas
 * - Navegación a creación y edición
 * - Ordenamiento alfabético
 * 
 * @autor [CONTAPP]
 * @versión 1.0.0
 */

import { Component, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { EnterpriseList } from '../../models/EnterpriseList';
import { EnterpriseService } from '../../services/enterprise.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Enterprise } from '../../models/Enterprise';
import Swal from 'sweetalert2';
import { LocalStorageMethods } from '../../../../../shared/methods/local-storage.method';
import { buttonColors } from '../../../../../shared/buttonColors';

@Component({
  selector: 'app-enterprise-list',
  templateUrl: './enterprise-list.component.html',
  styleUrls: ['./enterprise-list.component.css'],
})
export class EnterpriseListComponent {
  /** Filtro por nombre de empresa */
  filterName: string = '';

  /** Listas de empresas activas e inactivas */
  listEnterprises: EnterpriseList[] = [];
  listEnterprisesInctive: EnterpriseList[] = [];

  /** Tipo de lista actual (ACTIVE/INACTIVE) */
  typeList = 'ACTIVE';

  /** Textos de interfaz */
  title: string = 'Listado de empresas';
  subtitle: string = 'Elija una empresa para acceder a sus funcionalidades';

  /** Control de selección de empresa */
  selecteEnterprise?: EnterpriseList;
  selectedEnterprise: EnterpriseList | null = null;

  /** Control de visualización de formularios */
  showLegalForm: boolean = true;
  showNaturalForm: boolean = false;
  
  /** Filtro de empresas */
  filterEnterprise: string = '';

  /** Referencia al botón de archivo */
  @ViewChild('buttonArchive') buttonArchive!: ElementRef;

  /** Métodos de almacenamiento local */
  localStorageMethods: LocalStorageMethods = new LocalStorageMethods();

  /**
   * Constructor del componente
   * Inicializa servicios necesarios
   */
  constructor(
    private enterpriseService: EnterpriseService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  /**
   * Inicializa el componente
   * Carga la lista de empresas activas
   */
  ngOnInit(): void {
    this.getEnterprisesActive();
  }

  /**
   * Obtiene la lista de empresas activas
   */
  getEnterprisesActive() {
    this.title = 'Listado de empresas';
    this.subtitle = 'Elija una empresa para acceder a sus funcionalidades';
    this.enterpriseService.getEnterprisesActive().subscribe({
      next: (enterpriseData) => {
        this.typeList = 'ACTIVE';
        this.listEnterprises = enterpriseData;
        this.sortArrayByName();
      },
    });
  }

  /**
   * Obtiene la lista de empresas inactivas
   */
  getEnterprisesInactive() {
    this.title = 'Empresas archivadas';
    this.subtitle = 'Lista de empresas archivadas.';
    this.enterpriseService.getEnterprisesInactive().subscribe({
      next: (enterpriseData) => {
        this.listEnterprises = enterpriseData;
        this.typeList = 'INACTIVE';
      },
    });
  }

  /**
   * Navega a la vista de creación de empresa
   */
  goToCreateEnterprise() {
    this.router.navigate(['general/enterprises/create']);
  }

  /**
   * Navega a la vista de creación de PDF RUT
   */
  goToCreateEnterpisepdfRUT(){
    this.router.navigate(['general/enterprises/create-PDF-RUT']);
  }

  /**
   * Actualiza la empresa seleccionada y guarda sus datos
   * @param id ID de la empresa seleccionada
   */
  updateEnterpriseSelected(id: string) {
    this.localStorageMethods.saveEnterpriseData(id);
    this.logInEnterprise();
  }

  /**
   * Navega a la vista principal de la empresa
   */
  logInEnterprise() {
    this.router.navigate(['general/operations/home']);
  }

  /**
   * Activa una empresa archivada
   * @param id ID de la empresa a activar
   */
  activeEnterprise(id: string) {
    Swal.fire({
      title: 'Deseas activar esta empresa?',
      text: 'Tu empresa pasará al estado activo!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: buttonColors.confirmationColor,
      cancelButtonColor: buttonColors.cancelButtonColor,
      confirmButtonText: 'Si, activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.enterpriseService.updateStatusEnterprise(id, 'ACTIVE').subscribe({
          next: () => {
            Swal.fire({
              title: 'Empresa activada!',
              text: 'Tu empresa esta activa',
              icon: 'success',
              confirmButtonColor: buttonColors.confirmationColor,
            });
            this.cdRef.detectChanges();
            this.buttonArchive.nativeElement.click();
          },
        });
      }
    });
  }

  /**
   * Ordena alfabéticamente el array de empresas por nombre
   */
  sortArrayByName(): void {
    this.listEnterprises.sort((a:EnterpriseList, b:EnterpriseList) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
      return 0;
    });
  }
}
